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