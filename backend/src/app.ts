import express, { Express, Request, Response } from 'express';
import "express-async-errors"; //Async wrapper
import cookieParser from "cookie-parser";
import connectDB from './db/connect';
import foodsRouter from './routes/foods';
import authRouter from './routes/auth';
import notFound from './middleware/not_found';
import errorHandlerMiddleware from './middleware/error_handler';
import {authentication} from './middleware/authentication';
import dotenv from 'dotenv';
dotenv.config();

// Create an instance of the app
const app: Express = express();

// Server up different sets of static files depending on what is input
if (process.argv[2] == "v"){
    // Vanilla JS frontend
    console.log("Serving the vanilla js frontend ...")
    app.use(express.static(__dirname+'/../../frontend/vanilla'));
}
if (process.argv[2] == "r"){
    // React JS frontend
    console.log("Serving the React js frontend ...")
    app.use(express.static(__dirname+'/../../frontend/react-app/dist'));
}
if (process.argv[2] == "rt"){
    // React-Typescript frontend
    console.log("Serving the React-Typescript frontend ...")
    app.use(express.static(__dirname+'/../../frontend/react-app-ts/dist'));
}
if (process.argv[2] == "dev" || !process.argv[2]){
    console.log("Serving up no static files in developer mode ...")
}

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/foods", authentication, foodsRouter)
app.use("/api/v1/auth", authRouter)

// Middleware
app.use(notFound);
app.use(errorHandlerMiddleware);

// Port number on which server will run
const port = process.env.PORT || 5000;

// Check that the mongoURI is set, then connect to the database, then load the server
const start = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (typeof mongoURI === "undefined") {
            throw new Error("Mongo URI is undefined");
        }
        await connectDB(mongoURI);
        app.listen(port, () => { console.log(`Server is listening on port ${port}...`); });
    } catch (error) {
        console.log(error);
    }
};

// Loaded when app.js is run
if (require.main === module) {
    start();
}
