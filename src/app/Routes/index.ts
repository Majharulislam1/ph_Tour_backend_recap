import { Router } from "express";
import { userRouter } from "../modules/User/user.routes";
import { AuthRoute } from "../modules/auths/auth.route";

export const router = Router();


const modeuleRoute = [
     {
        path:"/user",
        route:userRouter
     },
     {
       path:"/auth",
       route:AuthRoute
     }
];

modeuleRoute.forEach((route)=>{
     router.use(route.path,route.route);
})