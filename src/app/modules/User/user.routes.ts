import { Router } from "express";
import { userControllers } from "./user.controllers";


export const userRouter = Router();

userRouter.post("/register",userControllers.createUser);
userRouter.get("/all_user",userControllers.getAllUser);

