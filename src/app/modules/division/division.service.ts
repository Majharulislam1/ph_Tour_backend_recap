import { BAD_REQUEST } from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { IDivision } from "./division.interface"
import { Division } from "./division.model"







const createDivisionService = async (payload: IDivision) => {
    const existingDivision = await Division.findOne({ name: payload.name });
    if (existingDivision) {
        throw new Error("A division with this name already exists.");
    }

    const baseSlug = payload.name.toLowerCase().split(" ").join("-")
    let slug = `${baseSlug}-division`

    let counter = 0;
    while (await Division.exists({ slug })) {
        slug = `${slug}-${counter++}` // dhaka-division-2
    }

    payload.slug = slug;

    const division = await Division.create(payload);

    return division
}

const getAllDivisions = async()=>{
     const division = await Division.find({});
     const totalDivision = await Division.countDocuments();
     return {
         data:division,
         meta:{
             total:totalDivision
         }
     }
}


const getSingleDivision = async (slug:string) =>{
      const division = await Division.findOne({slug});
      return {
         data:division
      }
}


const updateDivision = async(id:string,payload:Partial<IDivision>)=>{
      
    const existingDivision = await Division.findById(id);

    if(!existingDivision){
         throw new AppError(BAD_REQUEST,"Division not found.");
    }

    const duplicateDivision = await Division.findOne({
         name:payload.name,
         _id:{$ne:id}
    });

    if(duplicateDivision){
         throw new AppError(BAD_REQUEST,'A division with this name already exists.');
    }

    const updateDivision = await Division.findByIdAndUpdate(id,payload,{new:true})

    return updateDivision

}




const deleteDivision = async(id:string) =>{
     await Division.findByIdAndDelete(id);
     return null;
}

export const DivisionService = {
    createDivisionService,
    getAllDivisions,
    getSingleDivision,
    deleteDivision,
    updateDivision
}
