import { Response } from "express";


export interface AuthTokens {
    accessToken?: string;
    refreshToken?: string;
}

export const setAuthTokens = (res: Response, tokenInfo: AuthTokens) => {

    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: false
        })
    }

    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: false,
        })
    }
}