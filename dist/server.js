"use strict";
/* eslint-disable no-console */
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
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./app/config/env");
const app_1 = require("./app");
const seedSuperAdmin_1 = require("./app/utils/seedSuperAdmin");
const radis_config_1 = require("./app/config/radis.config");
let server;
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(env_1.envVars.DB_URL);
        server = app_1.app.listen(env_1.envVars.PORT, () => {
            console.log('server is running:', env_1.envVars.PORT);
        });
    }
    catch (error) {
        console.log(error);
    }
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield main();
    yield (0, radis_config_1.connectRedis)();
    yield (0, seedSuperAdmin_1.seedSuperAdmin)();
}))();
// connection error
process.on("unhandledRejection", () => {
    console.log("unhandleD Rejection error");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// code error
process.on("uncaughtException", () => {
    console.log("Uncaught Rejection error");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// server error
process.on('SIGTERM', () => {
    console.log("Internal server Error");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// backend server closed
process.on('SIGINT', () => {
    console.log("Server is closed");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// Promise.reject(new Error("I forget this server"));
// throw new Error('server shout down');
