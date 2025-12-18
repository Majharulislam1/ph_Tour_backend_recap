"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAuthTokens = void 0;
const env_1 = require("../config/env");
const setAuthTokens = (res, tokenInfo) => {
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV === "PRODUCTION",
            sameSite: "none"
        });
    }
    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: env_1.envVars.NODE_ENV === "PRODUCTION",
            sameSite: "none"
        });
    }
};
exports.setAuthTokens = setAuthTokens;
