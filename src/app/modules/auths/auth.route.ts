import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";

const router = Router();

router.post('/login',AuthControllers.crediantialController);
router.post('/refresh-token',AuthControllers.getNewAccessToken);
router.post("/logOut" , AuthControllers.logOut);
router.post("/reset-password",checkAuth(...Object.values(Role)),AuthControllers.resetPassword);
router.post("/set-password", checkAuth(...Object.values(Role)), AuthControllers.setPassword);

router.post("/forgot-password", AuthControllers.forgotPassword)
router.post("/reset-password", checkAuth(...Object.values(Role)), AuthControllers.resetPassword)

router.get("/google",async(req:Request,res:Response,next:NextFunction)=>{
    const redirect = req.query.redirect || '/'
    passport.authenticate("google",{scope:["profile" , "email"], state:redirect as string})(req,res,next)
})


router.get("/google/callback",passport.authenticate("google", { failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!` }),AuthControllers.googleCallBackController) ;


export const AuthRoute = router;