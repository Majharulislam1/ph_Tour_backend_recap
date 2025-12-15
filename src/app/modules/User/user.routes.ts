import { Router } from "express";
import { userControllers } from "./user.controllers";
 
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "./user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
 

export const userRouter = Router();
        


userRouter.post("/register", validateRequest(createUserZodSchema),userControllers.createUser);
userRouter.get("/all_user", checkAuth(Role.ADMIN, Role.SUPER_ADMIN),userControllers.getAllUser);
userRouter.get("/me", checkAuth(...Object.values(Role)), userControllers.getMe)
userRouter.patch("/:id",checkAuth(...Object.values(Role)),userControllers.updateUserControllers);

