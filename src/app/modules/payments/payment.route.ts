import { Router } from "express";
import { PaymentController } from "./payment.controllers";


export const paymentRoute = Router();

  
paymentRoute.post("/init-payment/:bookingId", PaymentController.initPayment);
paymentRoute.post("/success", PaymentController.successPayment);
paymentRoute.post("/fail", PaymentController.failPayment);
paymentRoute.post("/cancel", PaymentController.cancelPayment);

