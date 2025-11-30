/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendRespons";
import { BAD_REQUEST, CREATED } from "http-status-codes";
import { AuthService } from "./auths.service";
import AppError from "../../errorHelpers/AppError";
import { setAuthTokens } from "../../utils/setCookie";


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




export const AuthControllers = {
     crediantialController,
     getNewAccessToken
}