import { Router } from "express";
import { userControllers } from "./user.controllers";
 
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";

export const userRouter = Router();
        


userRouter.post("/register", validateRequest(createUserZodSchema),userControllers.createUser);
userRouter.get("/all_user",userControllers.getAllUser);

