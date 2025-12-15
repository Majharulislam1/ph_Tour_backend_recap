// src/modules/otp/otp.routes.ts
import express from "express";
import { OTPController } from "./otp.controllers";
 

export const OtpRouter = express.Router();

OtpRouter.post("/send", OTPController.sendOTP);
OtpRouter.post("/verify", OTPController.verifyOTP);

 