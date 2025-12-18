"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const NotFoundRoutes = (req, res) => {
    res.status(http_status_codes_1.NOT_FOUND).json({
        success: false,
        message: "Route Not Found"
    });
};
exports.default = NotFoundRoutes;
