# FoodCalendar
The aim of this application is to create a program for a FoodCalendar app. The idea being a user can attach different foods to a day on their calendar. The purpose of this project was to help me explore different technologies and concepts associated with web development. Some of the main technologies I have used while developing this application include: 

- MongoDB
- Typescript
- Express
- React 

## Node Version
This code is design to run with node version: v16.17.1. Please ensure you have node version v16.17.1 installed.

## Config
Before running the app an .env file should be created inside `/backend``. This will need to contain the below variables,

```
PORT = 5000
MONGO_URI = mongodb://localhost:27017
JWT_SECRET = someSecret
JWT_LIFETIME = 500d
NODE_ENV = production
DB = MYDB
TEST_DB = TEST
```

- `PORT` - This is the port on which the server will run.
- `MONGO_URI` - This is the connection string for connecting your mongodb database. Do not include any optional paramters if running with `--database` as the app will add the database name on to the end of the connection string.
- `JWT_SECRET` - The secret used to sign the JWT (change it from `someSecret`).
- `JWT_LIFETIME` - The length of time that the JWT is valid.
- `NODE_ENV` - Whether the environment is production or development.
- `DB` - The name of the mongodb database to use with the application. The database name specified via the command line (--database *db name*) takes precedence over this value.
- `TEST_DB` - The name of the database to use when running tests.

## Starting the Server
For development, in one terminal run:

`npm run devb` or `tsc -w`

Then in another terminal run the command: 

`npm run dev` or `nodemon ./dist/app`

This will make typescript watch for any changes to the typescript file and nodemon watch for any changes to javascript files. When changes are saved in the typescript file, they will automatically be compiled by typescript, then nodemon will see that the javascript files have changed and automatically restart the server. 

Alternatively you can run a single compile command, turning the typescript code into javascript, by running:

`npm build` or `tsc`

Then to run the server: 

`npm start` or `node ./dist/app`

## Command Line Args
These arguments are only allowed when running the instance from node, not when running tests with jest.

### --frontend
The app can be run with three different frontends. One has been written using purely vanilla js, the other two have been written using React js (one with typescript). The frontend with the most development time has been the typescript one. To run this frontend,

`npm start -- --frontend rt` \ `npm run dev -- --frontend rt`

To serve up the vanilla frontend the `rt` argument can be used,

`npm start -- --frontend v` \ `npm run dev -- --frontend v` 

To serve up the react frontend the `r` argument can be used, 

`npm start -- --frontend r` \ `npm run dev -- --frontend r`


To just run the node server without serving up any static files,

`npm start -- --frontend dev` \ `npm run dev -- --frontend dev` OR `npm start` \ `npm run dev`

By default the server does not serve any static files.

### --database

To use a specific database name: 

`npm start -- --database *name of your db*`

If no database name is provided the default is `FoodCalendar`. 

## Running Tests
The tests are written using jest. To run the units tests, use the command: 

`npm run test`

The name specified by `TEST_DB` will be the name of the database used for testing.

## Some Developer Notes

### Frontend Dragging
The dragging functionality took a long time to implement. The dragging makes use of actual DOM manipulation, which can confuse React.

The dragging works by setting the position of a react element to `absolute` taking it out of the normal flow. The x and y position of the element can be updated,
to match that of the cursor giving the dragging affect. 

In React each created food was stored in array and each array belonged to a category in an object called `groupedFoods` e.g.: `{[category:string]:Food[]}`. After manipulating the actual
DOM, for example moving food1 from category "A" to category "B", the state stored in `groupedFoods` would not reflect the actual DOM, as we have been manipulating it behind the scenes. If the React state is updated to remove food1 from category "A" React will throw an error. This is because React tries to tear down the old DOM but can no longer find the old HTML element corresponding to food1 in category "A". To prevent this from happening I had to set everything up, such that React would never tear down the old DOM state, which is a bit hackey. 

In the future when trying to implement dragging functionality again I would use a library. Just from a small bit of research https://react-dnd.github.io/react-dnd/ seems like it would fit my needs.

### Backend Testing
When running the jest tests we do not want them running in parallel. To stop this jest provides a CLI option `--runInBand`. This will run all tests serially in the current process, rather than creating a worker pool of child processes that run tests.

`Supertest` wraps `superagent`, to provide a high-level abstraction for testing HTTP. In node `SuperAgent` does not save cookies by default, but you can use the `agent()` method to create a copy of `SuperAgent` that saves cookies. Each copy has a separate cookie jar.

```typescript 
const const supertest = request.agent(app);
```
