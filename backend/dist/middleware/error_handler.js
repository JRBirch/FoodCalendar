"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const custom_error_1 = __importDefault(require("../errors/custom_error"));
const http_status_codes_1 = require("http-status-codes");
/**
 * Error handler middleware which will raise a Custom Error
 */
const errorHandlerMiddleware = (error, req, res, next) => {
    if (error instanceof custom_error_1.default) {
        return res.status(error.statusCode).json({ msg: error.message });
    }
    return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
};
exports.default = errorHandlerMiddleware;
