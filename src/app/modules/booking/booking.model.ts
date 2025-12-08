import { model, Schema } from "mongoose";
import {   IBooking } from "./booking.interface";


const bookingSchema = new Schema<IBooking> ({
      user:{
           type:Schema.Types.ObjectId,
           ref:"User",
           required:true
      },
      tour:{
          type:Schema.Types.ObjectId,
          ref:"Tour",
          required:true
      },
       payment: {
        type: Schema.Types.ObjectId,
        ref: "Payment"
    },
      guestCount:{
         type:Number,
         required:true
      }
},{
    timestamps:true
})


export const Booking = model<IBooking> ("Booking",bookingSchema);

