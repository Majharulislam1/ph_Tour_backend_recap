/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BAD_REQUEST, UNAUTHORIZED } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../User/user.interface";
import { User } from "../User/user.models";

import bcrypt from "bcryptjs";

import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { createNewAccessTokensR, createUserTokens } from "../../utils/createUserToken";
import { JwtPayload } from "jsonwebtoken";

const crediantialLogin = async (payload: Partial<IUser>) => {

     const { email, password } = payload;

     const isUserExist = await User.findOne({ email });

     if (!isUserExist) {
          throw new AppError(BAD_REQUEST, "Email Does not exist");
     }

     const iShashPassword = await bcrypt.compare(password as string, isUserExist.password as string);

     if (!iShashPassword) {
          throw new AppError(BAD_REQUEST, "Password doesn't match");
     }

     //     const jwtPalyload = {
     //          userId:isUserExist._id,
     //          email:isUserExist.email,
     //          role:isUserExist.role,
     //     }

     //     const accessToken = generateToken(jwtPalyload,envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);
     //     const refreshToken = generateToken(jwtPalyload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_EXPIRES);

     const userToken = createUserTokens(isUserExist);

     const { password: pass, ...rest } = isUserExist.toObject();




     return {
          accessToken: userToken.accessToken,
          refreshToken: userToken.refreshToken,
          user: rest
     }
}



export const getNewAccessTokens = async (refreshToken: string) => {

     const newAccesToken = await createNewAccessTokensR(refreshToken);

     return {
          accessToken: newAccesToken
     }

}


export const resetPasswordService = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
     const user = await User.findById(decodedToken.userId)

     const isOldPasswordMatch = await bcrypt.compare(oldPassword, user!.password as string)
     if (!isOldPasswordMatch) {
          throw new AppError(UNAUTHORIZED, "Old Password does not match");
     }

     user!.password = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

     user!.save();
}


export const AuthService = {
     crediantialLogin,
     getNewAccessTokens,
     resetPasswordService
   
}