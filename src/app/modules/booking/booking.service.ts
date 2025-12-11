/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { BAD_REQUEST } from "http-status-codes";
import { User } from "../User/user.models";
import { BOOKING_STATUS, IBooking } from "./booking.interface"
import { Booking } from "./booking.model";
import AppError from "../../errorHelpers/AppError";
import { Tour } from "../tour/tour.model";
import { Payment } from "../payments/payment.model";
import { PAYMENT_STATUS } from "../payments/payment.interface";
import { ISSLCommerz } from "../../sslcommerz/sslCommerz.interface";
import { SSLService } from "../../sslcommerz/sslCommerz.service";


const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`
}


const createBooking = async (payload: Partial<IBooking>, userId: string) => {

    const transactionId = getTransactionId();

    const session = await Booking.startSession();
    session.startTransaction();


    try {
        const user = await User.findById(userId);



        if (!user?.phone) {
            throw new AppError(BAD_REQUEST, "Please Update Your Profile to Book a Tour.")
        }

        const tour = await Tour.findById(payload.tour).select('costFrom');

        if (!tour?.costFrom) {
            throw new AppError(BAD_REQUEST, "No Tour Cost Found");
        }

        const amount = Number(tour.costFrom) * Number(payload.guestCount!);

        const booking = await Booking.create([{
            user: userId,
            status: BOOKING_STATUS.PENDING,
            ...payload,
        }], { session });

        const payment = await Payment.create([{
            booking: booking[0]._id,
            status: PAYMENT_STATUS.UNPAID,
            transactionId: transactionId,
            amount: amount
        }], { session })

        const updatedBooking = await Booking
            .findByIdAndUpdate(
                booking[0]._id,
                { payment: payment[0]._id },
                { new: true, runValidators: true, session }
            )
            .populate("user", "name email phone address")
            .populate("tour", "title costFrom")
            .populate("payment");

        const userAddress = (updatedBooking?.user as any).address
        const userEmail = (updatedBooking?.user as any).email
        const userPhoneNumber = (updatedBooking?.user as any).phone
        const userName = (updatedBooking?.user as any).name

        const sslPayload: ISSLCommerz = {
            address: userAddress,
            email: userEmail,
            phoneNumber: userPhoneNumber,
            name: userName,
            amount: amount,
            transactionId: transactionId
        }

        const sslPayment = await SSLService.sslPaymentInit(sslPayload)

        // console.log(sslPayment);


        await session.commitTransaction();
        session.endSession()

        return {
            paymentUrl: sslPayment.GatewayPageURL,
            booking: updatedBooking
        }
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    };

}






export const BookingService = {
    createBooking,

}