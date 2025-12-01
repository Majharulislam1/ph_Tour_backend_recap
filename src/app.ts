
import express, { Request, Response } from "express";
import cors from "cors"
import './app/config/passport';
import { router } from "./app/Routes";
import { globalErrorHnadler } from "./app/middlewares/globalErrorHandler";
import NotFoundRoutes from "./app/middlewares/NotFounds";
import expressSession from "express-session";
import cookieParser from 'cookie-parser'
import passport from "passport";
import { envVars } from "./app/config/env";


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
app.use(cors());
 

app.use("/api/v1",router);



app.get('/',(req:Request,res:Response)=>{
      res.status(200).json({
         "message" : "Server is running"
      })
})




app.use(globalErrorHnadler);
app.use(NotFoundRoutes);