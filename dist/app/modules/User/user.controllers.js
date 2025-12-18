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
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllers = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_service_1 = require("./user.service");
const catchAsync_1 = require("../../utils/catchAsync");
const sendRespons_1 = require("../../utils/sendRespons");
// const createUserFunction = async (req: Request, res: Response, next: NextFunction) => {
//     const user = await UserService.createUserService(req.body);
//     res.status(CREATED).json({
//         message: "User created Successfully",
//         user
//     });
// }
// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//           createUserFunction(req,res,next);
//         // const user = await UserService.createUserService(req.body);
//         // res.status(CREATED).json({
//         //     message: "User created Successfully",
//         //     user
//         // });
//     } catch (err) {
//         console.log(err);
//         next(err)
//     }
// }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_service_1.UserService.createUserService(req.body);
    // res.status(CREATED).json({
    //     message: "User created Successfully",
    //     user
    // });
    (0, sendRespons_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.CREATED,
        message: "User created Successfully",
        data: user
    });
}));
const updateUserControllers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const payload = req.body;
    const token = req.headers.authorization;
    // const decodedToken = verifyToken(token as string , envVars.JWT_ACCESS_SECRET) as JwtPayload;
    const decodedToken = req.user;
    const user = yield user_service_1.UserService.updateUser(userId, payload, decodedToken);
    (0, sendRespons_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.CREATED,
        message: "User Update Successfully",
        data: user
    });
}));
const getAllUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_service_1.UserService.getAllUserService();
    //    res.status(OK).json({
    //       success:true,
    //       message:"successfully find all user",
    //       data: {
    //          users
    //       }
    //    })
    (0, sendRespons_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.OK,
        message: "All User find Successfully",
        data: users.data,
    });
}));
const getMe = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield user_service_1.UserService.getMe(decodedToken.userId);
    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: "All Users Retrieved Successfully",
    //     data: users
    // })
    (0, sendRespons_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.CREATED,
        message: "Your profile Retrieved Successfully",
        data: result.data
    });
}));
exports.userControllers = {
    createUser,
    getAllUser,
    updateUserControllers,
    getMe
};
