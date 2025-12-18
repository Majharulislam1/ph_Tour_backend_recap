import { Router } from "express";
import { PaymentController } from "./payment.controllers";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";


export const paymentRoute = Router();

  
paymentRoute.post("/init-payment/:bookingId", PaymentController.initPayment);
paymentRoute.post("/success", PaymentController.successPayment);
paymentRoute.post("/fail", PaymentController.failPayment);
paymentRoute.post("/cancel", PaymentController.cancelPayment);
paymentRoute.get("/invoice/:paymentId", checkAuth(...Object.values(Role)), PaymentController.getInvoiceDownloadUrl);
paymentRoute.post("/validate-payment", PaymentController.validatePayment)
