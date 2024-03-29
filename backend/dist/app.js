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
const morgan_1 = __importDefault(require("morgan"));
const utilities_1 = require("./utils/utilities");
const connect_1 = require("./db/connect");
const foods_1 = __importDefault(require("./routes/foods"));
const auth_1 = __importDefault(require("./routes/auth"));
const error_handler_1 = __importDefault(require("./middleware/error_handler"));
const authentication_1 = require("./middleware/authentication");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create an instance of the app
const app = (0, express_1.default)();
// Create an object of flags and data
const args = (0, utilities_1.commandLineArgs)(process.argv);
// Server up different sets of static files depending on what is input
if (args.frontend == "v") {
    // Vanilla JS frontend
    console.log("Serving the vanilla js frontend ...");
    app.use(express_1.default.static(__dirname + "/../../frontend/vanilla"));
}
if (args.frontend == "r") {
    // React JS frontend
    console.log("Serving the React js frontend ...");
    app.use(express_1.default.static(__dirname + "/../../frontend/react-app/dist"));
}
if (args.frontend == "rt") {
    // React-Typescript frontend
    console.log("Serving the React-Typescript frontend ...");
    app.use(express_1.default.static(__dirname + "/../../frontend/react-app-ts/dist"));
}
if (!args.frontend || args.frontend == "dev") {
    console.log("Serving up no static files in developer mode ...");
}
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Logging
// Use dev logs if running in dev mode. If the user is serving up the static
// files then use apache type logging, this would most likely be in a production
// environment. 
if (!args.frontend || args.frontend == "dev") {
    app.use((0, morgan_1.default)('dev'));
}
else {
    // Similar to the 'common' type with extra response-time
    app.use((0, morgan_1.default)(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));
}
// Routes
app.use("/api/v1/foods", authentication_1.authentication, foods_1.default);
app.use("/api/v1/auth", auth_1.default);
// This seems to fix the issue of refreshing the page, the react state files are 
// served back up to the user. A page not found screen will instead be shown on 
// the frontend, telling the user they have gone to a wrong url.
app.use("/*", express_1.default.static(__dirname + "/../../frontend/react-app-ts/dist"));
app.use(error_handler_1.default);
// Port number on which server will run
const port = process.env.PORT || 5000;
// Check that the mongoURI is set, then connect to the database, then load the server
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let mongoURI = process.env.MONGO_URI;
        if (typeof mongoURI === "undefined") {
            throw new Error("Mongo URI is undefined");
        }
        // The database name from the command line has precedence
        // Then the database name from the ENV variable DB
        // Then the default
        let databaseName = "FoodCalendar";
        if (args.database) {
            databaseName = args.database;
        }
        else if (process.env.DB) {
            databaseName = process.env.DB;
        }
        // This means from the command line we can pass in and create any database name
        // that we want.
        mongoURI = `${mongoURI}/${databaseName}`;
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        });
        const connection = yield (0, connect_1.connectDB)(mongoURI);
        return connection;
    }
    catch (error) {
        console.log(error);
    }
});
// Loaded when app.js is run
if (require.main === module) {
    start();
}
exports.default = app;
