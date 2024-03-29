"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropDatabase = exports.disconnectDB = exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = (url) => {
    return mongoose_1.default.connect(url);
};
exports.connectDB = connectDB;
const disconnectDB = () => {
    return mongoose_1.default.connection.close();
};
exports.disconnectDB = disconnectDB;
const dropDatabase = () => {
    return mongoose_1.default.connection.db.dropDatabase();
};
exports.dropDatabase = dropDatabase;
