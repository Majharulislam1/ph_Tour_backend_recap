import { Router } from "express";
import { userRouter } from "../modules/User/user.routes";

export const router = Router();


const modeuleRoute = [
     {
        path:"/user",
        route:userRouter
     }
];

modeuleRoute.forEach((route)=>{
     router.use(route.path,route.route);
})