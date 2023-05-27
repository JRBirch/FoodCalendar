import express, { Express, Request, Response } from 'express';
import "express-async-errors"; //Async wrapper
import connectDB from './db/connect';
import foodsRouter from './routes/foods';
import notFound from './middleware/not_found';
import errorHandlerMiddleware from './middleware/error_handler';
import dotenv from 'dotenv';
dotenv.config();

// Create an instance of the app
const app: Express = express();
app.use(express.static(__dirname+'/../dist/public'));
app.use(express.json());

// Routes
app.use("/api/v1/foods", foodsRouter)

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
