import { NextFunction, Request, Response, Router } from "express";
import { AuthControllers } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../User/user.interface";
import passport from "passport";

const router = Router();

router.post('/login',AuthControllers.crediantialController);
router.post('/refresh-token',AuthControllers.getNewAccessToken);
router.post("/logOut" , AuthControllers.logOut);
router.post("/reset-password",checkAuth(...Object.values(Role)),AuthControllers.resetPassword);
router.post("/set-password", checkAuth(...Object.values(Role)), AuthControllers.setPassword);

router.get("/google",async(req:Request,res:Response,next:NextFunction)=>{
    const redirect = req.query.redirect || '/'
    passport.authenticate("google",{scope:["profile" , "email"], state:redirect as string})(req,res,next)
})


router.get("/google/callback",passport.authenticate("google",{failureRedirect:"/login"}),AuthControllers.googleCallBackController) ;


export const AuthRoute = router;