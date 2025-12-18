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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendRespons_1 = require("../../utils/sendRespons");
const http_status_codes_1 = require("http-status-codes");
const auths_service_1 = require("./auths.service");
const AppError_1 = __importDefault(require("../../errorHelpers/AppError"));
const setCookie_1 = require("../../utils/setCookie");
const createUserToken_1 = require("../../utils/createUserToken");
const env_1 = require("../../config/env");
const passport_1 = __importDefault(require("passport"));
const crediantialController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // const user = await AuthService.crediantialLogin(req.body); // for custom credentails
    // passport credentails
    passport_1.default.authenticate("local", (err, user, info) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return next(new AppError_1.default(401, info.message));
        }
        if (!user) {
            return next(new AppError_1.default(401, info.message));
        }
        const userTokens = yield (0, createUserToken_1.createUserTokens)(user);
        const _a = user.toObject(), { password: pass } = _a, rest = __rest(_a, ["password"]);
        (0, setCookie_1.setAuthTokens)(res, user);
        (0, sendRespons_1.sendResponse)(res, {
            success: true,
            statusCode: http_status_codes_1.CREATED,
            message: "User Successfully Login",
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user: rest
            }
        });
    }))(req, res, next);
}));
const getNewAccessToken = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        throw new AppError_1.default(http_status_codes_1.BAD_REQUEST, "No refresh token recieved from cookies");
    }
    const tokenInfo = yield auths_service_1.AuthService.getNewAccessTokens(refreshToken);
    (0, sendRespons_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.CREATED,
        message: "  Successfully creted refresh tokens",
        data: tokenInfo
    });
}));
const setPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const { password } = req.body;
    yield auths_service_1.AuthService.setPassword(decodedToken.userId, password);
    (0, sendRespons_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.OK,
        message: "Password Changed Successfully",
        data: null,
    });
}));
const logOut = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    });
    (0, sendRespons_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.OK,
        message: "  Successfully Logout",
        data: null
    });
}));
// const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//      const newPassword = req.body.newPassword;
//      const oldPassword = req.body.oldPassword;
//      const decodedToken = req.user
//      await AuthService.resetPasswordService(oldPassword, newPassword, decodedToken as JwtPayload);
//      sendResponse(res, {
//           success: true,
//           statusCode: OK,
//           message: "  Successfully Logout",
//           data: null
//      })
// })
const resetPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    yield auths_service_1.AuthService.resetPassword(req.body, decodedToken);
    (0, sendRespons_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.OK,
        message: "Password Changed Successfully",
        data: null,
    });
}));
const forgotPassword = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield auths_service_1.AuthService.forgotPassword(email);
    (0, sendRespons_1.sendResponse)(res, {
        success: true,
        statusCode: http_status_codes_1.OK,
        message: "Email Sent Successfully",
        data: null,
    });
}));
const googleCallBackController = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let redirectTo = req.query.state ? req.query.state : "";
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.NOT_FOUND, "User not found");
    }
    const tokenInfo = (0, createUserToken_1.createUserTokens)(user);
    (0, setCookie_1.setAuthTokens)(res, tokenInfo);
    res.redirect(`${env_1.envVars.FRONTEND_URL}/${redirectTo}`);
}));
exports.AuthControllers = {
    crediantialController,
    getNewAccessToken,
    logOut,
    resetPassword,
    googleCallBackController,
    setPassword,
    forgotPassword
};
