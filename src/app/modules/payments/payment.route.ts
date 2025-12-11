import { Router } from "express";
import { PaymentController } from "./payment.controllers";


export const paymentRoute = Router();

  

paymentRoute.post("/success", PaymentController.successPayment);