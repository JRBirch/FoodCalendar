import express, { Express } from "express";
import "express-async-errors"; //Async wrapper
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { commandLineArgs } from "./utils/utilities";
import connectDB from "./db/connect";
import foodsRouter from "./routes/foods";
import authRouter from "./routes/auth";
import notFound from "./middleware/not_found";
import errorHandlerMiddleware from "./middleware/error_handler";
import { authentication } from "./middleware/authentication";
import dotenv from "dotenv";
dotenv.config();

// Create an instance of the app
const app: Express = express();

// Create an object of flags and data
const args = commandLineArgs(process.argv)

// Server up different sets of static files depending on what is input
if (args.frontend == "v") {
  // Vanilla JS frontend
  console.log("Serving the vanilla js frontend ...");
  app.use(express.static(__dirname + "/../../frontend/vanilla"));
}
if (args.frontend == "r") {
  // React JS frontend
  console.log("Serving the React js frontend ...");
  app.use(express.static(__dirname + "/../../frontend/react-app/dist"));
}
if (args.frontend == "rt") {
  // React-Typescript frontend
  console.log("Serving the React-Typescript frontend ...");
  app.use(express.static(__dirname + "/../../frontend/react-app-ts/dist"));
}
if (!args.frontend || args.frontend == "dev" ) {
  console.log("Serving up no static files in developer mode ...");
}

app.use(express.json());
app.use(cookieParser());

// Logging
// Use dev logs if running in dev mode. If the user is serving up the static
// files then use apache type logging, this would most likely be in a production
// environment. 
if (!args.frontend || args.frontend == "dev" ){
  app.use(morgan('dev'))
}else {
  // Similar to the 'common' type with extra response-time
  app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'))
}

// Routes
app.use("/api/v1/foods", authentication, foodsRouter);
app.use("/api/v1/auth", authRouter);

// Middleware
app.use(notFound);
app.use(errorHandlerMiddleware);

// Port number on which server will run
const port = process.env.PORT || 5000;

// Check that the mongoURI is set, then connect to the database, then load the server
const start = async () => {
  try {
    let mongoURI = process.env.MONGO_URI;
    if (typeof mongoURI === "undefined") {
      throw new Error("Mongo URI is undefined");
    }
    let databaseName = "FoodCalendar"
    if (args.database){
      databaseName = args.database
    }
    // This means from the command line we can pass in and create any database name
    // that we want. We can create a database specifically for testing.
    mongoURI = `${mongoURI}/${databaseName}`
    await connectDB(mongoURI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

// Loaded when app.js is run
if (require.main === module) {
  start();
}
