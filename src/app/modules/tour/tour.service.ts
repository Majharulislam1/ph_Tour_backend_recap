import { CONFLICT, NOT_FOUND } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { ITour, ITourType } from "./tour.interface";
import { Tour, TourType } from "./tour.model";
import { tourSearchFields } from "./tour.constance";


const createTour = async (payload: ITour) => {
    const existingTour = await Tour.findOne({ title: payload.title });

    if (existingTour) {
        throw new AppError(CONFLICT, "A tour with this title already exists.");
    }


    const baseSlug = payload.title.toLowerCase().split(" ").join("-")
    let slug = `${baseSlug}`

    let counter = 0;
    while (await Tour.exists({ slug })) {
        slug = `${slug}-${counter++}` // dhaka-division-2
    }

    payload.slug = slug;


    const tour = await Tour.create(payload);
    return tour
}


// getall tours

const getAllTours = async (query:Record<string,string>) => {
 
     const filter = query.location
     
    

    const searchQuery = {
         $or:tourSearchFields.map(fields  =>  ({[fields]:{$regex:query.searchTerm, $options:'i'}}))
    }

    const data = await Tour.find(searchQuery).find({location:filter});

     //  title:{$regex:query.searchTerm, $options:'i'} single field search

    
         // multiple search query
        // $or:[
        //      {title:{$regex:query.searchTerm, $options:'i'}} , 
        //      {description:{$regex:query.searchTerm, $options:'i'}} , 
        //      {location:{$regex:query.searchTerm, $options:'i'}} , 
        // ]



    const meta = await Tour.countDocuments();

    return {
        data,
        meta:{
            total:meta,
        }
    }
}


const updateTour = async (id: string, payload: Partial<ITour>) => {
    const existingTour = await Tour.findById(id);

    if (!existingTour) {
        throw new AppError(NOT_FOUND, "Tour not found");
    }

    const updatedTour = await Tour.findByIdAndUpdate(id, payload, { new: true });

    return updatedTour
}


const deleteTour = async (id: string) => {
    return await Tour.findByIdAndDelete(id);
}


/******************************** Tour type **************************************/

const createTourType = async (payload: ITourType) => {
    
  

    const existingTourType = await TourType.findOne({ name: payload.name });

    if (existingTourType) {
        throw new AppError(CONFLICT, "Tour type already exists");
    }


    const tour_type = await TourType.create({name:payload.name});

    return tour_type
}

const getAllTourTypes = async () => {
    return await TourType.find();
}


const updateTourType = async (id: string, payload: ITour) => {
    const existingTourType = await TourType.findById(id);

    if (!existingTourType) {
        throw new AppError(CONFLICT, "Tour Type Not Found");
    }

    const updateTourType = await TourType.findByIdAndUpdate(id, payload);
    return updateTourType;

}

const deleteTourType = async (id: string) => {
    const existingTourType = await TourType.findById(id);

    if (!existingTourType) {
        throw new AppError(CONFLICT, "Tour Type Not Found");
    }

    return await TourType.findByIdAndDelete(id);

}


export const TourService = {
    createTour,
    updateTour,
    deleteTour,
    getAllTours,
    //  tour type 
    createTourType,
    getAllTourTypes,
    updateTourType,
    deleteTourType
}