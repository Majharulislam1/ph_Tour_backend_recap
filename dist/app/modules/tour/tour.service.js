"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourService = void 0;
const http_status_codes_1 = require("http-status-codes");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const tour_model_1 = require("./tour.model");
const tour_constance_1 = require("./tour.constance");
const QueryBuilder_1 = require("../../utils/QueryBuilder");
const cloudinary_config_1 = require("../../config/cloudinary.config");
const createTour = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTour = yield tour_model_1.Tour.findOne({ title: payload.title });
    if (existingTour) {
        throw new AppError_1.default(http_status_codes_1.CONFLICT, "A tour with this title already exists.");
    }
    const baseSlug = payload.title.toLowerCase().split(" ").join("-");
    let slug = `${baseSlug}`;
    let counter = 0;
    while (yield tour_model_1.Tour.exists({ slug })) {
        slug = `${slug}-${counter++}`; // dhaka-division-2
    }
    payload.slug = slug;
    const tour = yield tour_model_1.Tour.create(payload);
    return tour;
});
// getall tours
// const getAllTours = async (query:Record<string,string>) => {
//      const filter = query.location;
//      const searchTerm = query.searchTerm || "";
//      const sort = query.sort;
//     const searchQuery = {
//          $or:tourSearchFields.map(fields  =>  ({[fields]:{$regex:searchTerm, $options:'i'}}))
//     }
//     // const data = await Tour.find(searchQuery).find({location:filter}).sort('-title');
//     const data = await Tour.find().sort(sort).select('title  location'); // it's working properly
//     // .sort("location");
//      //  title:{$regex:query.searchTerm, $options:'i'} single field search
//          // multiple search query
//         // $or:[
//         //      {title:{$regex:query.searchTerm, $options:'i'}} , 
//         //      {description:{$regex:query.searchTerm, $options:'i'}} , 
//         //      {location:{$regex:query.searchTerm, $options:'i'}} , 
//         // ]
//     const meta = await Tour.countDocuments();
//     return {
//         data,
//         meta:{
//             total:meta,
//         }
//     }
// }
const getAllTours = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(tour_model_1.Tour.find(), query);
    const tours = yield queryBuilder
        .search(tour_constance_1.tourSearchFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
const updateTour = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTour = yield tour_model_1.Tour.findById(id);
    if (!existingTour) {
        throw new AppError_1.default(http_status_codes_1.NOT_FOUND, "Tour not found");
    }
    if (payload.images && payload.images.length > 0 && existingTour.images && existingTour.images.length > 0) {
        payload.images = [...payload.images, ...existingTour.images];
    }
    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        const restDBImages = existingTour.images.filter(imageUrl => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); });
        const updatedPayloadImages = (payload.images || [])
            .filter(imageUrl => { var _a; return !((_a = payload.deleteImages) === null || _a === void 0 ? void 0 : _a.includes(imageUrl)); })
            .filter(imageUrl => !restDBImages.includes(imageUrl));
        payload.images = [...restDBImages, ...updatedPayloadImages];
    }
    const updatedTour = yield tour_model_1.Tour.findByIdAndUpdate(id, payload, { new: true });
    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        yield Promise.all(payload.deleteImages.map(url => (0, cloudinary_config_1.deleteImageFromCLoudinary)(url)));
    }
    return updatedTour;
});
const deleteTour = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield tour_model_1.Tour.findByIdAndDelete(id);
});
/******************************** Tour type **************************************/
const createTourType = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findOne({ name: payload.name });
    if (existingTourType) {
        throw new AppError_1.default(http_status_codes_1.CONFLICT, "Tour type already exists");
    }
    const tour_type = yield tour_model_1.TourType.create({ name: payload.name });
    return tour_type;
});
const getAllTourTypes = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield tour_model_1.TourType.find();
});
const updateTourType = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findById(id);
    if (!existingTourType) {
        throw new AppError_1.default(http_status_codes_1.CONFLICT, "Tour Type Not Found");
    }
    const updateTourType = yield tour_model_1.TourType.findByIdAndUpdate(id, payload);
    return updateTourType;
});
const deleteTourType = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingTourType = yield tour_model_1.TourType.findById(id);
    if (!existingTourType) {
        throw new AppError_1.default(http_status_codes_1.CONFLICT, "Tour Type Not Found");
    }
    return yield tour_model_1.TourType.findByIdAndDelete(id);
});
exports.TourService = {
    createTour,
    updateTour,
    deleteTour,
    getAllTours,
    //  tour type 
    createTourType,
    getAllTourTypes,
    updateTourType,
    deleteTourType
};
