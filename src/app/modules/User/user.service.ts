import { IUser } from "./user.interface"
import { User } from "./user.models";



const createUserService = async (payload: Partial<IUser>) => {
 
    const { name, email } = payload;
    const user = await User.create({ name, email });

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