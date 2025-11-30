import { Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";

const router = Router();

router.post('/login',AuthControllers.crediantialController);
router.post('/refresh-token',AuthControllers.getNewAccessToken);
router.post("/logOut" , AuthControllers.logOut);
router.post("/reset-password",checkAuth(...Object.values(Role)),AuthControllers.resetPassword);



export const AuthRoute = router;