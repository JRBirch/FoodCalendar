import express, { Express, Request, Response } from 'express';
import connectDB from './db/connect';
import dotenv from 'dotenv';
dotenv.config();

const app: Express = express();

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server');
});

// Port number on which server will run
const port = process.env.PORT || 3000;

/**
 * Check that the mongoURI is set, then connect to the database
 * Once connected to the db, load the server
 */
const start = async() => {
    try{
        const mongoURI = process.env.MONGO_URI;
        if (typeof mongoURI === "undefined"){
            throw new Error("Mongo URI is undefined");
        }
        await connectDB(mongoURI);
        app.listen(port, () => {console.log(`Server is listening on port ${port}...`);});
    } catch (error) {
        console.log(error);
    }
}

if (require.main === module){
    start();
}


