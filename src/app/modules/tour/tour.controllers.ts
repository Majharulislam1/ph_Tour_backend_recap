import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourService } from "./tour.service";
import { sendResponse } from "../../utils/sendRespons";


const createTour = catchAsync(async(req:Request,res:Response)=>{

     const result = await TourService.createTour(req.body);

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour created successfully',
        data: result,
    });


})


//             tour type 

const createTourType = catchAsync(async(req:Request,res:Response)=>{
    
       

        const {name} = req.body;

        const result = await TourService.createTourType(name);

        sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type created successfully',
        data: result,
    });

})


 

export const TourController = {
    createTour,
    createTourType
}