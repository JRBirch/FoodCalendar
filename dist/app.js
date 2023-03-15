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
const connect_1 = __importDefault(require("./db/connect"));
const foods_1 = __importDefault(require("./routes/foods"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create an instance of the app
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
// Routes
app.use("/api/v1/foods", foods_1.default);
// Dummy Route
app.get('/', (req, res) => {
    res.send('Express + TypeScript Server');
});
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
        app.listen(port, () => { console.log(`Server is listening on port ${port}...`); });
    }
    catch (error) {
        console.log(error);
    }
});
// Loaded when app.js is run
if (require.main === module) {
    start();
}
