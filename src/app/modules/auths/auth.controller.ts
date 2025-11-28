/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendRespons";
import { CREATED } from "http-status-codes";
import { AuthService } from "./auths.service";
 

const crediantialController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
       
    
 
    const user = await AuthService.crediantialLogin(req.body);
   
    
    sendResponse(res, {
         success:true,
         statusCode:CREATED,
         message:"User Successfully Login",
         data:user
    })

})


export const AuthControllers = {
     crediantialController
}