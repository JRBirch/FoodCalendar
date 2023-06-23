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
const express_1 = __importDefault(require("express"));
require("express-async-errors"); //Async wrapper
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const connect_1 = __importDefault(require("./db/connect"));
const foods_1 = __importDefault(require("./routes/foods"));
const auth_1 = __importDefault(require("./routes/auth"));
const not_found_1 = __importDefault(require("./middleware/not_found"));
const error_handler_1 = __importDefault(require("./middleware/error_handler"));
const authentication_1 = require("./middleware/authentication");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create an instance of the app
const app = (0, express_1.default)();
// Server up different sets of static files depending on what is input
if (process.argv[2] == "v") {
    // Vanilla JS frontend
    console.log("Serving the vanilla js frontend ...");
    app.use(express_1.default.static(__dirname + "/../../frontend/vanilla"));
}
if (process.argv[2] == "r") {
    // React JS frontend
    console.log("Serving the React js frontend ...");
    app.use(express_1.default.static(__dirname + "/../../frontend/react-app/dist"));
}
if (process.argv[2] == "rt") {
    // React-Typescript frontend
    console.log("Serving the React-Typescript frontend ...");
    app.use(express_1.default.static(__dirname + "/../../frontend/react-app-ts/dist"));
}
if (process.argv[2] == "dev" || !process.argv[2]) {
    console.log("Serving up no static files in developer mode ...");
}
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Routes
app.use("/api/v1/foods", authentication_1.authentication, foods_1.default);
app.use("/api/v1/auth", auth_1.default);
// Middleware
app.use(not_found_1.default);
app.use(error_handler_1.default);
// Port number on which server will run
const port = process.env.PORT || 5000;
// Check that the mongoURI is set, then connect to the database, then load the server
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (typeof mongoURI === "undefined") {
            throw new Error("Mongo URI is undefined");
        }
        yield (0, connect_1.default)(mongoURI);
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        });
    }
    catch (error) {
        console.log(error);
    }
});
// Loaded when app.js is run
if (require.main === module) {
    start();
}
