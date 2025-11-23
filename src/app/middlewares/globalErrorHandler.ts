/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";



// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalErrorHnadler = (err:any,req:Request,res:Response,next:NextFunction)=>{
      
    let statusCode = 500
    let message = `Something Went Wrong !! ${err.message} from global Error handler`;

    if(err instanceof AppError){
         statusCode = err.statusCode
         message = err.message
    } else if(err instanceof Error) {
         statusCode = 500
         message = err.message
    }


    res.status(statusCode).json({
         success:false,
         message,
         stack:envVars.NODE_ENV === "DEVELOPMENT" ? err.stack : null
    })
        

}