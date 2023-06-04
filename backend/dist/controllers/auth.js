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
exports.login = exports.register = void 0;
const http_status_codes_1 = require("http-status-codes");
const custom_error_1 = __importDefault(require("../errors/custom_error"));
const user_1 = require("../models/user");
/**
 * Register the user, which involves creating the user record, creating the JSON web token
 * then sending the name of the user and the token back to the client.
 */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Registering User");
    const user = yield user_1.User.create(Object.assign({}, req.body));
    const token = user.createJWT();
    res.cookie("access_token", token, { httpOnly: true }).status(http_status_codes_1.StatusCodes.OK).json({ user: { name: user.name } });
});
exports.register = register;
/**
 * Log in the user, which involves finding the user record, check the password input and
 * the password on the system match, creating another JSON web token, and then sending the
 * user name and JSON web token back to the client.
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Logining User");
    const { email, password } = req.body;
    if (!email || !password) {
        throw new custom_error_1.default("No password of email", http_status_codes_1.StatusCodes.BAD_REQUEST);
    }
    const user = yield user_1.User.findOne({ email });
    if (!user) {
        console.log("No user");
        throw new custom_error_1.default("Invalid Credentials", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    const isPasswordCorrect = yield user.comparePassword(password);
    if (!isPasswordCorrect) {
        console.log("Wrong password");
        throw new custom_error_1.default("Invalid Credentials", http_status_codes_1.StatusCodes.UNAUTHORIZED);
    }
    const token = user.createJWT();
    res.status(http_status_codes_1.StatusCodes.OK).cookie("access_token", token, { httpOnly: true }).json({ user: { name: user.name } });
});
exports.login = login;
