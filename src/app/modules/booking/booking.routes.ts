import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createBookingZodSchema } from "./booking.validation";
import { BookingController } from "./booking.controllers";


export const bookingRouter = Router();



bookingRouter.post("/",
    checkAuth(...Object.values(Role)),
    validateRequest(createBookingZodSchema),
    BookingController.createBooking
);