

import express from 'express';
import type { Server } from 'http';


let server:Server;

const app = express();


const main = () => {

    try {

        
         
        server = app.listen(5000, () => {
            console.log('server is running');
        })
    } catch (error) {
        console.log(error);
    }


}

main();