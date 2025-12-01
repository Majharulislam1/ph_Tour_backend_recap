/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendRespons";
import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from "http-status-codes";
import { AuthService } from "./auths.service";
import AppError from "../../errorHelpers/AppError";
import { setAuthTokens } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserTokens } from "../../utils/createUserToken";
import { envVars } from "../../config/env";


const crediantialController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {



     const user = await AuthService.crediantialLogin(req.body);

     //      res.cookie("accessToken", user.accessToken, {
     //         httpOnly: true,
     //         secure: false
     //     })


     //     res.cookie("refreshToken", user.refreshToken, {
     //         httpOnly: true,
     //         secure: false,
     //     })

     setAuthTokens(res, user);


     sendResponse(res, {
          success: true,
          statusCode: CREATED,
          message: "User Successfully Login",
          data: user
     })

})


const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

     const refreshToken = req.cookies.refreshToken;

     if (!refreshToken) {
          throw new AppError(BAD_REQUEST, "No refresh token recieved from cookies")
     }


     const tokenInfo = await AuthService.getNewAccessTokens(refreshToken);



     sendResponse(res, {
          success: true,
          statusCode: CREATED,
          message: "  Successfully creted refresh tokens",
          data: tokenInfo
     })

})


const logOut = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

     res.clearCookie("accessToken", {
          httpOnly: true,
          secure: false,
          sameSite: "lax"
     })
     res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: false,
          sameSite: "lax"
     })


     sendResponse(res, {
          success: true,
          statusCode: OK,
          message: "  Successfully Logout",
          data: null
     })

})


const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

     const newPassword = req.body.newPassword;
     const oldPassword = req.body.oldPassword;
     const decodedToken = req.user

     await AuthService.resetPasswordService(oldPassword,newPassword,decodedToken as JwtPayload);

     sendResponse(res, {
          success: true,
          statusCode: OK,
          message: "  Successfully Logout",
          data: null
     })

})


const googleCallBackController = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
      let redirectTo = req.query.state ? req.query.state as string : ""

      if(redirectTo.startsWith("/")){
          redirectTo = redirectTo.slice(1)
      }

      const user = req.user;

      if(!user) {
           throw new AppError(NOT_FOUND,"User not found");
      }

      const tokenInfo = createUserTokens(user);
      setAuthTokens(res,tokenInfo);

      res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})





export const AuthControllers = {
     crediantialController,
     getNewAccessToken,
     logOut,
     resetPassword,
     googleCallBackController
}