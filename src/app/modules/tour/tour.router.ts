import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import { validateRequest } from "../../middlewares/validateRequest";
import { createTourTypeZodSchema, createTourZodSchema } from "./tour.validation";
import { TourController } from "./tour.controllers";


export const TourRouter = Router();

TourRouter.post("/create",checkAuth(Role.ADMIN,Role.SUPER_ADMIN),validateRequest(createTourZodSchema),TourController.createTour)









/************************* Tour type ********************************* */



TourRouter.post("/create-tour-type",
    checkAuth(Role.ADMIN,Role.SUPER_ADMIN),
    validateRequest(createTourTypeZodSchema),
    TourController.createTourType) 