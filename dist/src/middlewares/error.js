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
exports.TryCatch = exports.errorMiddleware = void 0;
const app_js_1 = require("../app.js");
const errorMiddleware = (err, req, res, next) => {
    err.message || (err.message = "Internal Server Error");
    err.statusCode = err.statusCode || 500;
    const response = {
        success: false,
        message: err.message,
    };
    if (app_js_1.envMode === "DEVELOPMENT") {
        response.error = err;
    }
    return res.status(err.statusCode).json(response);
};
exports.errorMiddleware = errorMiddleware;
const TryCatch = (passedFunc) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield passedFunc(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
exports.TryCatch = TryCatch;
