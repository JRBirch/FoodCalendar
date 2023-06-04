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
exports.authentication = void 0;
const http_status_codes_1 = require("http-status-codes");
const custom_error_1 = __importDefault(require("../errors/custom_error"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const access_token = req.cookies.access_token;
    if (!access_token) {
        throw new custom_error_1.default("Authentication invalid", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    try {
        const payload = jsonwebtoken_1.default.verify(access_token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId, name: payload.name };
        next();
    }
    catch (error) {
        throw new custom_error_1.default("Authentication invalid", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
});
exports.authentication = authentication;
