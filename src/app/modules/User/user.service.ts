import { BAD_REQUEST } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface"
import { User } from "./user.models";
import bcrypt from "bcryptjs";


const createUserService = async (payload: Partial<IUser>) => {
 
    const { email, password ,...rest } = payload;

    const isUserExist = await User.findOne({email});

    if(isUserExist){
         throw new AppError(BAD_REQUEST,"User Already Exist");
    }

    const hashPassword = bcrypt.hashSync(password as string,10);


    const authProvider :IAuthProvider = {provider: "crediantials",providerId:email as string};

    const user = await User.create({ email ,password:hashPassword, auths:[authProvider],...rest });

    return user
}


const getAllUserService = async()=>{
     const Users = await User.find({});
     const totalUser = await User.countDocuments();
     return {
         data:Users,
         meta:{
             total:totalUser
         }
     }
}


export const UserService = {
    createUserService,
    getAllUserService
}