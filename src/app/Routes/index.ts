import { Router } from "express";
import { userRouter } from "../modules/User/user.routes";
import { AuthRoute } from "../modules/auths/auth.route";
import { DivisionRouter } from "../modules/division/division.router";
import { TourRouter } from "../modules/tour/tour.router";

export const router = Router();


const modeuleRoute = [
     {
        path:"/user",
        route:userRouter
     },
     {
       path:"/auth",
       route:AuthRoute
     },
     {
       path:"/division",
       route: DivisionRouter
     },{
        path:"/tour",
        route:TourRouter
     }
];

modeuleRoute.forEach((route)=>{
     router.use(route.path,route.route);
})