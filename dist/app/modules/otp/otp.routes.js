"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRouter = void 0;
// src/modules/otp/otp.routes.ts
const express_1 = __importDefault(require("express"));
const otp_controllers_1 = require("./otp.controllers");
exports.OtpRouter = express_1.default.Router();
exports.OtpRouter.post("/send", otp_controllers_1.OTPController.sendOTP);
exports.OtpRouter.post("/verify", otp_controllers_1.OTPController.verifyOTP);
