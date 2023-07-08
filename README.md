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

## Dev Notes
The dragging functionality took a long time to implement. The dragging makes use of actual DOM manipulation, which can confuse React.

The dragging works by setting the position of a react element to `absolute` taking it out of the normal flow. The x and y position of the element can be updated,
to match that of the cursor giving the dragging affect. 

In React each created food was stored in array and each array belonged to a category in an object called `groupedFoods` e.g.: `{[category:string]:Food[]}`. After manipulating the actual
DOM, for example moving food1 from category "A" to category "B", the state stored in `groupedFoods` would not reflect the actual DOM, as we have been manipulating it behind the scenes. If the React state is updated to remove food1 from category "A" React will throw an error. This is because React tries to tear down the old DOM but can no longer find the old HTML element corresponding to food1 in category "A". To prevent this from happening I had to set everything up, such that React would never tear down the old DOM state, which is a bit hackey. 

In the future when trying to implement dragging functionality again I would use a library. Just from a small bit of research https://react-dnd.github.io/react-dnd/ seems like it would fit my needs.