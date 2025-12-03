import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TourService } from "./tour.service";
import { sendResponse } from "../../utils/sendRespons";


const createTour = catchAsync(async (req: Request, res: Response) => {

    const result = await TourService.createTour(req.body);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour created successfully',
        data: result,
    });


})




//             tour type 

const createTourType = catchAsync(async (req: Request, res: Response) => {
    const result = await TourService.createTourType(req.body);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Tour type created successfully',
        data: result,
    });

})


const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
    const result = await TourService.getAllTourTypes();
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour types retrieved successfully',
        data: result,
    });

})


const updateTourType = catchAsync(async(req:Request,res:Response)=>{
      const result = await TourService.updateTourType(req.params.id,req.body);
       sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour updated successfully',
        data: result,
    });
})

const deleteTourType = catchAsync(async(req:Request,res:Response)=>{
      const result = await TourService.deleteTourType(req.params.id);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Tour type deleted successfully',
        data: result,
    });

})


export const TourController = {
    createTour,
    createTourType,
    getAllTourTypes,
    updateTourType,
    deleteTourType
}