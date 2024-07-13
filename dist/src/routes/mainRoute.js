"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const homeRoute_1 = __importDefault(require("./homeRoute"));
function loadRoutes(app) {
    app.use('/', homeRoute_1.default);
}
exports.default = loadRoutes;
