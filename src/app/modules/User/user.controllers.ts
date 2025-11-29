/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { BAD_REQUEST, CREATED, OK } from "http-status-codes";

import { UserService } from "./user.service";
import AppError from "../../errorHelpers/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendRespons";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { string } from "zod";


// const createUserFunction = async (req: Request, res: Response, next: NextFunction) => {
//     const user = await UserService.createUserService(req.body);

//     res.status(CREATED).json({
//         message: "User created Successfully",
//         user
//     });

// }


// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {

//           createUserFunction(req,res,next);
//         // const user = await UserService.createUserService(req.body);

//         // res.status(CREATED).json({
//         //     message: "User created Successfully",
//         //     user
//         // });


//     } catch (err) {
//         console.log(err);
//         next(err)
//     }
// }


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUserService(req.body);

    // res.status(CREATED).json({
    //     message: "User created Successfully",
    //     user
    // });
    
    sendResponse(res, {
         success:true,
         statusCode:CREATED,
         message:"User created Successfully",
         data:user
    })

})


const updateUserControllers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.params.id;

    const payload = req.body;

    const token = req.headers.authorization;

    // const decodedToken = verifyToken(token as string , envVars.JWT_ACCESS_SECRET) as JwtPayload;
    const decodedToken = req.user;
     

    const user = await UserService.updateUser(userId,payload,decodedToken);

     
    
    sendResponse(res, {
         success:true,
         statusCode:CREATED,
         message:"User Update Successfully",
         data:user
    })

})



const getAllUser = catchAsync(async(req:Request,res:Response,next:NextFunction)=>{
    
       const users = await UserService.getAllUserService();

    //    res.status(OK).json({
    //       success:true,
    //       message:"successfully find all user",
    //       data: {
    //          users
    //       }
    //    })

    sendResponse(res, {
         success:true,
         statusCode:OK,
         message:"All User find Successfully",
         data:users.data,
         meta:users.meta
    })

})




export const userControllers = {
    createUser,
    getAllUser,
    updateUserControllers
}