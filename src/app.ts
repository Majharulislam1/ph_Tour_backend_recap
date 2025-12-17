
import express, { Request, Response } from "express";
import cors from "cors"
import './app/config/passport';
import { router } from "./app/Routes";
 
import NotFoundRoutes from "./app/middlewares/NotFounds";
import expressSession from "express-session";
import cookieParser from 'cookie-parser'
import passport from "passport";
import { envVars } from "./app/config/env";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";


export const app = express();

app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())


app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
     origin:envVars.FRONTEND_URL
}));
 

app.use("/api/v1",router);



app.get('/',(req:Request,res:Response)=>{
      res.status(200).json({
         "message" : "Server is running"
      })
})




app.use(globalErrorHandler);
app.use(NotFoundRoutes);