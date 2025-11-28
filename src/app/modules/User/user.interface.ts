import { Types } from "mongoose";

export interface IAuthProvider{
     provider:"google" | "crediantials",
     providerId:string
}

export enum IsActive{
     ACTIVE = "ACTIVE",
     INACTIVE = "INACTIVE",
     BLOCKED = "BLOCKED"
}

export enum Role{
     SUPER_ADMIN = "SUPER_ADMIN",
     ADMIN = "ADMIN",
     USER ="USER",
     GUIDE = "GUIDE"
}


export interface IUser {
     name:string,
     email:string,
     password?:string,
     phone?:string,
     address?:string,
     picture?:string,
     isDeleted?:boolean,
     isActive?:IsActive,
     isVerified?:boolean,
     role:Role,
     auths:IAuthProvider[],
     bookings?:Types.ObjectId[],
     guides?:Types.ObjectId[],
}