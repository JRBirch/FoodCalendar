# FoodCalendar
The aim of this application is to create a backend api for a FoodCalendar app. The idea being a user can attach different foods to a day on their calendar. The technologies I will utilise to write up the server side code include typescript, node, and express. I have plans to implement a nice frontend, but it will be basic to begin with. 

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

## Frontend
The app can be run with two different frontends. One has been written using purely vanilla js and makes use of server side rendering, the other has been written use React js and is a single page application. The vanilla js is the default code that is served. It can also be served by passing in the `v` argument. Ensure you are in the backend folder and run,

`npm start -- v` \ `npm run dev -- v` 

To serve up the react frontend the `r` argument can be used, 

`npm start -- r` \ `npm run dev -- r`

To just run the node server without serving up any static files,

`npm start -- dev` \ `npm run dev -- dev` OR `npm start` \ `npm run dev`

By default the server does not serve any static files.
