/* eslint-disable no-console */


 
import type { Server } from 'http';
import mongoose from 'mongoose';
import { envVars } from './app/config/env';
import { app } from './app';
import { seedSuperAdmin } from './app/utils/seedSuperAdmin';
import { connectRedis } from './app/config/radis.config';


let server:Server;




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

(async()=>{
    await main();
     await connectRedis()
    await seedSuperAdmin();
})();



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

