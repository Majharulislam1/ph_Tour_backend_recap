import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../modules/User/user.models";
import { BAD_REQUEST } from "http-status-codes";
import { IsActive } from "../modules/User/user.interface";



export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            throw new AppError(403, "NO Token Recived");
        }

        const verifyTokens = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload;

        const isUserExist = await User.findOne({ email: verifyTokens.email })

        if (!isUserExist) {
            throw new AppError(BAD_REQUEST, "User does not exist")
        }
        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
            throw new AppError(BAD_REQUEST, `User is ${isUserExist.isActive}`)
        }
        if (isUserExist.isDeleted) {
            throw new AppError(BAD_REQUEST, "User is deleted")
        }


        if (!authRoles.includes(verifyTokens.role)) {
            throw new AppError(403, "You are not permitted to view this route!!!")
        }
        req.user = verifyTokens;

         

        next()

    } catch (error) {
        next(error)
    }
}