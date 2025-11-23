/* eslint-disable no-console */


import express from 'express';
import type { Server } from 'http';
import mongoose from 'mongoose';
import { envVars } from './config/env';


let server:Server;

const app = express();


const main = async() => {

    try {
        await mongoose.connect(envVars.DB_URL);
        server = app.listen(envVars.PORT, () => {
            console.log('server is running:', envVars.PORT);
        })
    } catch (error) {
        console.log(error);
    }
}

main();

// connection error
process.on("unhandledRejection",()=>{
      console.log("unhandleD Rejection error");

      if(server){
           server.close(()=>{
               process.exit(1);
           })
      }

      process.exit(1);

})


// code error

process.on("uncaughtException",()=>{
        
         console.log("Uncaught Rejection error");
       
         if(server){
             server.close(()=>{
                 process.exit(1);
             })
         }

         process.exit(1);
})

// server error

process.on('SIGTERM',()=>{
    
     console.log("Internal server Error");

     if(server){
             server.close(()=>{
                 process.exit(1);
             })
         }

         process.exit(1);
})


// backend server closed
process.on('SIGINT',()=>{

    console.log("Server is closed");

     if(server){
             server.close(()=>{
                 process.exit(1);
             })
         }

         process.exit(1);
})


// Promise.reject(new Error("I forget this server"));
// throw new Error('server shout down');

