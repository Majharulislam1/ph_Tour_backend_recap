import { BAD_REQUEST } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../User/user.interface";
import { User } from "../User/user.models";

import bcrypt from "bcryptjs";
 
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";

const crediantialLogin = async (payload: Partial<IUser>) => {
 
    const { email, password  } = payload;

    const isUserExist = await User.findOne({email});

    if(!isUserExist){
         throw new AppError(BAD_REQUEST,"Email Does not exist");
    }

    const iShashPassword = await bcrypt.compare(password as string,isUserExist.password as string);
     
     if(!iShashPassword){
         throw new AppError(BAD_REQUEST,"Password doesn't match");
    }

    const jwtPalyload = {
         userId:isUserExist._id,
         email:isUserExist.email,
         role:isUserExist.role,
    }

    const accessToken = generateToken(jwtPalyload,envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);

    return {
         accessToken
    }
}


export const AuthService = {
     crediantialLogin
}