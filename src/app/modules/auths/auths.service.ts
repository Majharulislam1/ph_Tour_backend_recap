/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BAD_REQUEST, UNAUTHORIZED } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IsActive, IUser } from "../User/user.interface";
import { User } from "../User/user.models";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { createNewAccessTokensR, createUserTokens } from "../../utils/createUserToken";
import { JwtPayload } from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";

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


const setPassword = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    if (user.password && user.auths.some(providerObject => providerObject.provider === "google")) {
        throw new AppError( BAD_REQUEST, "You have already set you password. Now you can change the password from your profile password update")
    }

    const hashedPassword = await bcrypt.hash(
        plainPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    )

    const credentialProvider: IAuthProvider = {
        provider: "crediantials",
        providerId: user.email
    }

    const auths: IAuthProvider[] = [...user.auths, credentialProvider]

    user.password = hashedPassword

    user.auths = auths

    await user.save()

}


// export const resetPasswordService = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
//      const user = await User.findById(decodedToken.userId)

//      const isOldPasswordMatch = await bcrypt.compare(oldPassword, user!.password as string)
//      if (!isOldPasswordMatch) {
//           throw new AppError(UNAUTHORIZED, "Old Password does not match");
//      }

//      user!.password = await bcrypt.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

//      user!.save();
// }

const resetPassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
    if (payload.id != decodedToken.userId) {
        throw new AppError(401, "You can not reset your password")
    }

    const isUserExist = await User.findById(decodedToken.userId)
    if (!isUserExist) {
        throw new AppError(401, "User does not exist")
    }

    const hashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    )

    isUserExist.password = hashedPassword;

    await isUserExist.save()
}


const forgotPassword = async (email: string) => {
    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError( BAD_REQUEST, "User does not exist")
    }
    if (!isUserExist.isVerified) {
        throw new AppError( BAD_REQUEST, "User is not verified")
    }
    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError( BAD_REQUEST, `User is ${isUserExist.isActive}`)
    }
    if (isUserExist.isDeleted) {
        throw new AppError( BAD_REQUEST, "User is deleted")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
        expiresIn: "10m"
    })

    const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

    sendEmail({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "emailTemplate",
        templateData: {
            name: isUserExist.name,
            resetUILink
        }
    })

    /**
     * http://localhost:5173/reset-password?id=687f310c724151eb2fcf0c41&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODdmMzEwYzcyNDE1MWViMmZjZjBjNDEiLCJlbWFpbCI6InNhbWluaXNyYXI2QGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzUzMTY2MTM3LCJleHAiOjE3NTMxNjY3Mzd9.LQgXBmyBpEPpAQyPjDNPL4m2xLF4XomfUPfoxeG0MKg
     */
}


export const AuthService = {
     crediantialLogin,
     getNewAccessTokens,
     resetPassword,
     setPassword,
     forgotPassword
}