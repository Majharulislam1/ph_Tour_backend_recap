import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/User/user.interface";
import { generateToken, verifyToken } from "./jwt";
import AppError from "../errorHelpers/AppError";
import { User } from "../modules/User/user.models";
import { BAD_REQUEST } from "http-status-codes";


export const createUserTokens = (user: Partial<IUser>) => {
    const jwtPalyload = {
        userId: user._id,
        email: user.email,
        role: user.role,
    }

    const accessToken = generateToken(jwtPalyload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);
    const refreshToken = generateToken(jwtPalyload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES);



    return {
        accessToken,
        refreshToken
    }
}


export const createNewAccessTokensR = async (refreshToken: string) => {
    const verifyRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

    const isUserExist = await User.findOne({ email: verifyRefreshToken.email })

    if (!isUserExist) {
        throw new AppError(BAD_REQUEST, "User does not exist")
    }
    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(BAD_REQUEST, `User is ${isUserExist.isActive}`)
    }
    if (isUserExist.isDeleted) {
        throw new AppError(BAD_REQUEST, "User is deleted")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    return accessToken
}