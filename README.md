# Express-react-app

**Demo App** : [modokemdev.com/daily-organizer](https://modokemdev.com/daily-organizer/)  
**Goal**: Create a view layer which is fast, usable and easy to maintain.  
**Limitation**: Until we add back end (MongoDB), data cannot be persisted.  

This repository was built following the **Building a Full Stack App with React and Express** PluralSight course by _Daniel Stern_ ([Here](https://www.github.com/danielstern/express-react-fullstack) is the original course repository in GitHub). This app uses React and Redux to display components. Routing determines which components to display. Express allows to communicate with MongoDB through REST API.  

The **express-react-app** can run locally on your machine. Clone the repository and run `npm install` followed by `npm run dev`.  

This README contains the _notes_ I took from the course:  

- [Express-react-app](#express-react-app)
  - [Security Considerations](#security-considerations)
  - [Webpack setup](#webpack-setup)
    - [Install Webpack, Babel and other libraries needed for bundling and transpilation](#install-webpack-babel-and-other-libraries-needed-for-bundling-and-transpilation)
    - [Create a `.babelrc` file](#create-a-babelrc-file)
    - [Create a `webpack.config.js` file](#create-a-webpackconfigjs-file)
    - [Create an `index.js` file](#create-an-indexjs-file)
    - [Create an `index.html` file](#create-an-indexhtml-file)
    - [Define launch scripts](#define-launch-scripts)
    - [Run the application](#run-the-application)
  - [Add Redux](#add-redux)
    - [Create default application state](#create-default-application-state)
    - [Create basic Redux store](#create-basic-redux-store)
      - [Instal Redux](#instal-redux)
      - [Create new file to hold Redux store](#create-new-file-to-hold-redux-store)
    - [Add Dashboard Component](#add-dashboard-component)
      - [Connect the Dashboard to the Redux store](#connect-the-dashboard-to-the-redux-store)
      - [Connect Redux store data to Dashboard](#connect-redux-store-data-to-dashboard)
    - [Create TaskList component](#create-tasklist-component)
  - [Add Routing and Navigation](#add-routing-and-navigation)
    - [Add React Router](#add-react-router)
  - [Add Sagas](#add-sagas)
    - [Sagas in Brief](#sagas-in-brief)
    - [Generators in Brief](#generators-in-brief)
      - [Example of Generator function](#example-of-generator-function)
    - [Add a button to create a _new task_](#add-a-button-to-create-a-new-task)
    - [Add `requestTaskCreation` and `createTask` mutations](#add-requesttaskcreation-and-createtask-mutations)
    - [Add logging to store actions](#add-logging-to-store-actions)
      - [Add logger](#add-logger)
      - [Add logger to `index.js`](#add-logger-to-indexjs)
    - [Create a saga](#create-a-saga)
      - [Add redux-saga](#add-redux-saga)
      - [Add uuid library](#add-uuid-library)
      - [Using Mock Files During Development](#using-mock-files-during-development)
      - [Create a "mock" saga to interact with the "server" (the server doesn't exist yet)](#create-a-mock-saga-to-interact-with-the-server-the-server-doesnt-exist-yet)
    - [Add a Task Detail page](#add-a-task-detail-page)
      - [Implementing tasks details Route. Part 1: Displaying data](#implementing-tasks-details-route-part-1-displaying-data)
      - [Implementing tasks details Route. Part 2: Mutating data](#implementing-tasks-details-route-part-2-mutating-data)
        - [Add methods which _dispatch_ actions when form elements of the task detail are interacted with](#add-methods-which-dispatch-actions-when-form-elements-of-the-task-detail-are-interacted-with)
        - [Add clauses to **Redux** reducer which causes state to be changed in response to relevant action](#add-clauses-to-redux-reducer-which-causes-state-to-be-changed-in-response-to-relevant-action)
    - [Front End Summary](#front-end-summary)
  - [Creating Persistent Data storage with Node, Express, and MongoDB](#creating-persistent-data-storage-with-node-express-and-mongodb)
    - [Installing MongoDB](#installing-mongodb)
      - [What is MongoDB?](#what-is-mongodb)
      - [Install MongoDB](#install-mongodb)

## Security Considerations

If security is a concern for your app, you should look at <https://www.pluralsight.com/authors/troy-hunt>, or any other security resources. This application is not intended to be used for logins, store passwords, confidential data, etc.  

## Webpack setup

Why should we use Webpack?... Because browsers can't understand `.jsx` files!  

1. `Webpack` is a library that uses `babel` (another library) to convert `.jsx` and `ES6` files into `.js` files.
2. One thing `Webpack` does that `babel` can't is it bundles set of files connected by _import_ statements into one file. Thus the output in the **gh-pages** branch has only one `.js` file.
3. `Webpack` has a tool called `webpack-dev-server` which allow us to create an application in a fast and convenient way.

### Install Webpack, Babel and other libraries needed for bundling and transpilation

- Generate a `package.json` file:

```console
# --yes is used to generate a default package.json file.
npm init --yes
```

- Install `Webpack`:

```console
# You can replace webpack with webpack@4.17.2 to avoid errors (latest at the time of the demo)
npm install --save-dev webpack
```

> **IMPORTANT**: Add `.gitignore` file, and add `node_modules` to it to stop indexing those files. This is important _before_ the first commit.

- Install other dependencies:

```console
# Webpack related dependencies
npm install --save-dev webpack-cli webpack-dev-server

# Babel (@babel/core@7.0.0 at the time of the demo)
npm install --save-dev @babel/core

# @babel/node compiles in the command line | @babel/preset-env compiles ES6 | @babel/preset-react compiles react | @babel/register needs to be present
npm install --save-dev @babel/node @babel/preset-env @babel/preset-react @babel/register

# This package allows transpiling JavaScript files using Babel and webpack.
npm install --save-dev babel-loader
```

> **NOTE:** See this [answer](https://stackoverflow.com/questions/44931479/compiling-vs-transpiling/44932758#44932758) in Stack Overflow for a difference between **compiling** and **transpiling**.

### Add a `.babelrc` file

The `.babelrc` file, is a JSON file that [Babel](https://babeljs.io/docs/en/) automatically checks for to define how `.jsx` and ES6 should be handled.

The content of the JSON file should be the following:

- @babel/preset-env is for our ES6 compilation.
- @babel/preset-react is for our React.

```json
{
  "presets": [
    ["@babel/preset-env",{
      "targets":{
        "node":"current"
      }
    }],
    "@babel/preset-react"
  ]
}
```

### Add a `webpack.config.js` file

The `webpack.config.js` file describes how our app should be bundled.  

Add a `webpack.config.js` file with the following content:  

- `entry: path.resolve(__dirname, 'src','app')` indicates that the **main js file** is at `./src/app/index.js`.
- `path: path.resolve(__dirname,'dist')` indicates that the **output folder** will be at `./dist`.
- `extensions: ['.js','.jsx']` is an array of the extensions we want Webpack to process.
- `historyApiFallback: true` is a setting we have to enable if we want to use **React-Router**.
- `test: /\.jsx?/,` means that all `.js` or `.jsx` files will be compiled.

> **IMPORTANT**: Add `dist` _(the output folder)_ to `.gitignore`.

```javascript
const path = require("path");

module.exports = {
    mode: 'development',
    entry: path.resolve(__dirname, 'src','app'),
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js','.jsx']
    },
    devServer: {
        historyApiFallback: true,
        port: 8080,
        host: 'localhost',
        open: true
    },
    module: {
        rules: [{
            test: /\.jsx?/,
            loader:'babel-loader'
        }]
    }
}
```

> **NOTE:** As of [Webpack 5](https://webpack.js.org/blog/2020-10-10-webpack-5-release/), we need to specify `port`, `host` and `open` options in `devServer` configuration. For more info, see: [error: option '--open' argument missing](https://github.com/webpack/webpack-cli/issues/2001) and [webpack output is served from undefined](https://github.com/webpack/webpack-dev-server/issues/2745).  

### Add an `index.js` file

- Add the entry file at `./src/app/index.js`:

```javascript
console.log("Hello world!!!");
```

### Add an `index.html` file

You will need to add the `index.html` file in the `dist` folder. Add the folder to the project root if you don't have it and don't forget to put the `dist` folder in the `.gitignore` file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Required meta tags -->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

    <title>Daily Organizer</title>
</head>
<body class="container">
    <div id="app"></div>
    <script src="/bundle.js"></script>

    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
</body>
</html>
```

> **NOTE:** alternatively, you can setup [html-webpack-plugin](https://webpack.js.org/guides/output-management/#setting-up-htmlwebpackplugin). See the [getting started](https://webpack.js.org/guides/getting-started/#creating-a-bundle) tutorial from Webpack for more info.

### Define launch scripts

- Add the following scripts in `package.json`:

```json
{
  "start": "webpack",
  "dev": "webpack-dev-server --open"
}
```

> **NOTE:** As of [Webpack 5](https://webpack.js.org/blog/2020-10-10-webpack-5-release/), the script command is not anymore `webpack-dev-server` but `webpack serve`. For more info, see: [webpack-dev-server](https://github.com/webpack/webpack-dev-server#webpack-dev-server) and [DevServer](https://webpack.js.org/configuration/dev-server/).  

### Run the application

```console
# Run the dev script
$ npm run dev
```

> Because we specify the `open: true` option in `webpack.config.js`, your browser should open automatically. If not, navigate to <http://localhost:8080/>. You should see `Daily Organizer` displayed on the top left of the screen.  

## Add Redux

1. Manages underlying data.
2. Application state can be easily accessed.
3. Changing application state occurs only via actions.
4. Redux state is provided to React components via React-Redux, a small connector library.

If you need more info on **Redux**, you can look at: <https://www.pluralsight.com/courses/flux-redux-mastering>.  

### Create default application state

Add `src/server/defaultState.js` file:

- This is like a _fake_ database.
- This defines the initial state of the application.
- Here we have **users**, **groups**, **tasks** and **comments**, and each have their own properties.

```javascript
export const defaultState = {
    users:[{
        id:"U1",
        name:"Dev"
    },{
        id:"U2",
        name:"C. Eyo"
    }],
    groups:[{
        name:"To Do",
        id:"G1",
        owner:"U1"
    },{
        name:"Doing",
        id:"G2",
        owner:"U1"
    },{
        name:"Done",
        id:"G3",
        owner:"U1"
    }
    ],
    tasks:[{
        name:"Refactor tests",
        id:"T1",
        group:"G1",
        owner:"U1",
        isComplete:false,
    },{
        name:"Meet with CTO",
        id:"T2",
        group:"G1",
        owner:"U1",
        isComplete:true,
    },{
        name:"Compile ES6",
        id:"T3",
        group:"G2",
        owner:"U2",
        isComplete:false,
    },{
        name:"Update component snapshots",
        id:"T4",
        group:"G2",
        owner:"U1",
        isComplete:true,
    },{
        name:"Production optimizations",
        id:"T5",
        group:"G3",
        owner:"U1",
        isComplete:false,
    }],
    comments:[{
        id:"C1",
        owner:"U1",
        task:"T1",
        content:"Great work!"
    }]
};
```

### Create basic Redux store

The Redux store is going to provide the state to the application as necessary.  

#### Instal Redux

```console
# redux is at redux@4.0.0 in the original demo
npm install --save redux
```

#### Create new file to hold Redux store

Create the `Redux` store at `./src/app/store/index.jsx`:  

- **reducer** is a special function that always return a new state.
- This _Redux store_ is very basic and only works with `defaultState`.

```js
import { createStore } from 'redux';
import { defaultState } from '../../server/defaultState';

export const store = createStore(
    function reducer (state = defaultState, action) {
        return state;
    }
);
```

Import the store in `./app/index.jsx`:

- _console.log_ should load the application full state.

```javascript
import { store } from './store'

console.log(store.getState());
```

> **NOTE:** remove `console.log (store.getState())` after testing but keep the import statement!

- Run the application. You should see an `Object` element in the `console` which contains all the data we specified in `./src/server/defaultState.js`.

### Add Dashboard Component

Install the following dependencies:  

```console
# react@16.4.2 (version in demo) | react-dom turns jsx into html | react-redux@5.0.7 (version in demo)
npm install --save react react-dom react-redux
```

Add the `Dashboard` component at `src/app/components/Dashboard.jsx`:

- `.jsx` indicates that it is a React file.
- You always need to import React first: `import React from 'react';`.
- Here we use an arrow function to render the `Dashboard` component.

```jsx
import React from 'react';

export const Dashboard = ({groups}) => (
    <div>
        <h2>Dashboard</h2>
    </div>
);
```

We need to specify that we want to render the `Dashboard` component in the `app/index.jsx` file:  

> **NOTE:** the file was previously named `index.js` but you will need to rename it `index.jsx` and restart you dev server (if it was running).

```jsx
import { store } from './store'

import React from 'react';
import ReactDOM from 'react-dom';
import { Dashboard } from './components/Dashboard';

ReactDOM.render(
    <Dashboard/>,
    document.getElementById("app")
);
```

#### Connect the Dashboard to the Redux store

Use **React Redux** to connect the `Dashboard` component to the _Redux store_. The easiest way is to create a **parent component** which we are going to call `Main.jsx` (located at `src/app/components/Main.jsx`):  

- The **Provider** is an element which takes a store as a property and any connected component inside this **Provider** will have access to the store.

```jsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';

export const Main = () => (
    <Provider store={store}>
        <div>
            Dashboard goes here.
        </div>
    </Provider>
);
```

Update `index.jsx` to load `Main.jsx` component (which is our **main** component now):  

```jsx
import { store } from './store'

import React from 'react';
import ReactDOM from 'react-dom';
import { Main } from './components/Main';

ReactDOM.render(
    <Main/>,
    document.getElementById("app")
);
```

#### Connect Redux store data to Dashboard

Add `function mapStateToProps(state)` to `Dashboard` component and call `connect` from Redux.  

> **NOTE:** the [map function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) is a basic JavaScript function that simply maps every group in the json file.

```jsx
import React from 'react';
import { connect } from 'react-redux';

export const Dashboard = ({groups}) => (
    <div>
        <h2>Dashboard</h2>
        {
          groups.map(
            group => (
              <div>
                {group.name}
              </div>
            )
          )
        }
    </div>
);

function mapStateToProps(state) {
  return {
    groups:state.groups
  }
}

export const ConnectedDashboard = connect(mapStateToProps)(Dashboard);
```

Update `Main.jsx` and import the `ConnectedDashboard`:

```jsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ConnectedDashboard } from "./Dashboard";

export const Main = ()=>(
    <Provider store={store}>
        <div>
            {/*Dashboard goes here.*/}
            <ConnectedDashboard/>
        </div>
    </Provider>
);
```

### Create TaskList component

The `TaskList` component shows the tasks in each group. Add the `TaskList` component at `src/app/components/TaskList.jsx`:  

- The second argument of _mapStateToProps_ are the component properties: `const mapStateToProps = (state, ownProps) => {`. They are called **ownProps**.

```jsx
import React from 'react';
import { connect } from 'react-redux';

export const TaskList = ({tasks, name}) => (
    <div>
        <h3>
            {name}
        </h3>
        <div>
            {tasks.map(task=>(
                <div key={task.id}>{task.name}</div>
            ))}
        </div>
    </div>
);

const mapStateToProps = (state, ownProps) => {
    let groupID = ownProps.id;
    return {
        name: ownProps.name,
        id: groupID,
        tasks: state.tasks.filter(task=>task.group === groupID)
    };
};

export const ConnectedTaskList = connect(mapStateToProps)(TaskList);
```

- Update the `Dashboard` component to include the `TaskList` component:

```jsx
import React from 'react';
import { connect } from 'react-redux';
import { ConnectedTaskList } from './TaskList';

export const Dashboard = ({groups})=>(
    <div>
        <h2>Dashboard</h2>
        {groups.map(group=>(
            <ConnectedTaskList key={group.id} id={group.id} name={group.name}/>
        ))}
    </div>
);

function mapStateToProps(state) {
    return {
        groups:state.groups
    }
}

export const ConnectedDashboard = connect(mapStateToProps)(Dashboard);
```

## Add Routing and Navigation

1. "Routing" is a term for when the form of the application is affected by the URL bar.
2. `react-router` determines which React component to display based on URL.
3. Good use of routing allows a lot of information to be codified in URL.

### Add React Router

**React Router** will add routing capabilities for our app. Add `react-router-dom` which is a subset of React Router that is used in the browser:  

> **NOTE:** React router is at v6 as of 2022. Many commands have changed. If you have problems refer to the official documentation <https://reactrouter.com/docs/en/v6>. It is still possible to use v5 with the following documentation <https://v5.reactrouter.com/web/guides/quick-start>.

```console
# react-router-dom@4.3.1 (at the time of the demo)
$ npm install react-router-dom --save
```

> **NOTE:** in the original version, `history` was also installed but it seems **deprecated**. The command used was `npm install --save history@4.7.2`. The method imported from the library was **createBrowserHistory** which helped React Router to determine what the object is and what it was in the past.

Update `Main.jsx` to import `BrowserRouter` and `Route`:  

- We also add a `Navigation` component. The `Navigation` component imports **Link** from `react-router-dom` to navigate through the app. Refer to the code project for more info.

```jsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ConnectedDashboard } from './Dashboard';
import { BrowserRouter, Route, } from 'react-router-dom';
import { ConnectedNavigation } from './Navigation';

export const Main = ()=> (
    <BrowserRouter>
        <Provider store={store}>
            <div className="container mt-3">
                <ConnectedNavigation/>
                {/*<ConnectedDashboard/>*/}
                <Route
                    exact
                    path="/dashboard"
                    render={ () => (<ConnectedDashboard/>)}
                />
            </div>
        </Provider>
    </BrowserRouter>
)
```

## Add Sagas

We want to allow the user to create new tasks. This means that we want to allow the user to change the state of the application. This is possible with **Sagas**.  

1. `reducer` function must be updated to allow tasks array to be changed. If you are following the tutorial from the beginning, you will notice that we are just passing the `defaultState` of the application to the `reducer` function: `function reducer (state = defaultState, action) {return state;}`.
2. Tasks need random ID, reducers can't be random, therefore **Saga** or **Thunk** is needed.
3. Updated state is reflected automatically in React components because all of our components are **connected**.

### Sagas in Brief

You can use **Sagas** or **Thunks** to allow data transformation. You can use whichever you prefer.

1. Sagas run in the background of Redux applications.
2. Respond to actions by generating _"side-effects"_ (anything outside the app).
3. Sagas are denoted by a function star syntax (`function*`) which is not found in many other situations. This makes **Sagas** one of the only few places where **generators functions** are found.

### Generators in Brief

All **Sagas** are generators. A **generator** is a kind of JavaScript function. Standard functions return one value right away. However, generators can return any number of values: 3, 4, 5, 10, any number. Generators can return values later, not just right away. This is the **main difference** between a **generator functions** and a **basic functions**.  

> From [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*), the `function*` declaration (`function` keyword followed by an asterisk) defines a _generator function_, which returns a [Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) object.

1. Standard JavaScript functions (non-generator) return a single value, instantly.
2. Generators can return any number of values, not just one.
3. Generator values can be returned at a later time (asynchronously).

#### Example of Generator function

```javascript
function* myGenerator() {
    let meaning = 42;

    while (true) {
        meaning += 1;
        yield meaning;
    }
}
```

- `function*` indicates special generator function type.
- generator contains normal javascript code.
- `while (true)` loops can exist in generator functions. A `while(true)` loop, would normally cause a crash but it is acceptable inside a generator function as long as it has the **yield** keyword.
- `yield` keyword returns value to the generator's caller (can return many values). In this case, the value returned is `meaning`. It then waits until the generator is invoked again.
- Yields 43, 44, 45, ...

In this app, **Redux Saga** will be invoking these generators for us. For more info, take a look at <https://www.pluralsight.com/courses/redux-saga>, or the [official documentation](https://redux-saga.js.org/).  

### Add a button to create a _new task_

Update `TaskList.jsx`:

- add a button to create a _new task_: `<button onClick={() => createNewTask(id)}>Add New</button>`.
- add `mapDispatchToProps` to pass the new method `createNewTask` to the component. We don't pass it through the existing `mapStateToProps` method.
- add `mapDispatchToProps` to `connect` method which should provide access to `createNewTask` to the component.
- add `createNewTask` as component property: `export const TaskList = ({tasks, name, id, createNewTask}) => (`.

```jsx
import React from 'react';
import { connect } from 'react-redux';

export const TaskList = ({tasks, name, id, createNewTask}) => (
    <div>
        <h3>
            {name}
        </h3>
        <div>
            {tasks.map(task=>(
                <div key={task.id}>{task.name}</div>
            ))}
        </div>
        <button onClick={() => createNewTask(id)}>Add New</button>
    </div>
);

const mapStateToProps = (state, ownProps)=>{
    let groupID = ownProps.id;
    return {
        name: ownProps.name,
        id: groupID,
        tasks: state.tasks.filter(task=>task.group === groupID)
    };
};

const mapDispatchToProps = (dispatch, ownProps)=>{
    return {
        createNewTask(id) {
            console.log("Creating new task...", id);
        }
    };
};

export const ConnectedTaskList = connect(mapStateToProps, mapDispatchToProps)(TaskList);
```

You should be able to see the `Add New` button and if you enter the console, each time you click the button, it logs _"Creating new task..."_!

### Add `requestTaskCreation` and `createTask` mutations

Create a new file at `app/store/mutations.js`. This file is a template for all the changes to the application state:

- `REQUEST_TASK_CREATION` and `CREATE_TASK` are mutations.
- `requestTaskCreation` and `createTask` are methods that automatically create objects to **do** these mutations.
- `createTask` will be dispatched by the **saga** once it's finished creating this object complete with its own random ID.

```jsx
export const REQUEST_TASK_CREATION = `REQUEST_TASK_CREATION`;
export const CREATE_TASK = `CREATE_TASK`;

export const requestTaskCreation = (groupID) => ({
    type:REQUEST_TASK_CREATION,
    groupID
});

export const createTask = (taskID, groupID, ownerID) => ({
    type:CREATE_TASK,
    taskID,
    groupID,
    ownerID
});
```

Update `TaskList` component:

- import `requestTaskCreation` from `mutation.js`.
- add a call to `dispatch` function in `createNewTask` method which will _dispatch_ the `requestTaskCreation` mutation with the id provided.

```jsx
import React from 'react';
import { connect } from 'react-redux';
import { requestTaskCreation } from '../store/mutations';

export const TaskList = ({tasks, name, id, createNewTask})=>(
    <div className="card p-2 m-2">
        <h3>
            {name}
        </h3>
        <div>
            {tasks.map(task=>(
                <div key={task.id}>{task.name}</div>
            ))}
        </div>
        <button onClick={ () => createNewTask(id) }>Add New</button>
    </div>
);

const mapStateToProps = (state, ownProps)=>{
    let groupID = ownProps.id;
    return {
        name: ownProps.name,
        id: groupID,
        tasks: state.tasks.filter(task=>task.group === groupID)
    };
};

const mapDispatchToProps = (dispatch, ownProps)=>{
    return {
        createNewTask(id) {
            console.log("Creating new task...", id);
            dispatch(requestTaskCreation(id));
        }
    };
};

export const ConnectedTaskList = connect(mapStateToProps, mapDispatchToProps)(TaskList);
```

### Add logging to store actions

To help us understand what is going on, we want to add _logging_ **(console logging, not user login!)**.

#### Add logger

```console
# redux-logger@3.0.6 (at the original time of the demo)
$ npm install --save redux-logger
```

#### Add logger to `index.js`

Update the `store/index.js` file:

- import `createLogger` from `redux-logger`.
- add a second import from `redux` called `applyMiddleware`.
- add a second argument to `createStore` for `redux-logger` to work: `applyMiddleware(createLogger())`.

```js
import { createStore, applyMiddleware } from 'redux';
import { defaultState } from '../../server/defaultState';
import { createLogger } from 'redux-logger/src';

export const store = createStore(
    function reducer (state = defaultState, action) {
        return state;
    },
    applyMiddleware(createLogger())
);
```

Now, whenever we dispatch an action, we will see it in the console! _(Example: `action REQUEST_TASK_CREATION`)_

### Create a saga

Usually, actions change the state of the application. However, for actions that require some kind of randomness, like `TASK_CREATION`, we need an intermediary like a **saga**. A **saga** will deal with this unusual request.

#### Add redux-saga

```console
# redux-saga@0.16.2 (at the original time of the demo)
$ npm install --save redux-logger redux-saga
```

#### Add uuid library

We need a library to generate random strings.

```console
# uuid will generate random id
$ npm install --save uuid
```

#### Using Mock Files During Development

- Files with `.mock` extension indicate the file does not contain the true business logic.
- Used to reduce complexity (eg., does not depend on server).
- Mocks are commonly used in testing framework such as **Jest**.

#### Create a "mock" saga to interact with the "server" (the server doesn't exist yet)

Add a new **saga** at `store/sagas.mock.js`. All the **real sagas** will be communicating with the server, but until we have that, we are going to use these **mocks** that will do it on their own:

- You will need all the `import` statements.
- `taskCreationSaga` is a **saga** to create a _new task_.
- `take` function will stop until the specified action is dispatched. In this context, `groupID` is a property we get from the action. This is why we can log it just after.
- The `ownerID` is hardcoded to `'U1'` because no login has been implemented.
- The `taskID` needs to be a random string so we call our random generator `uuid()`.
- `put` function will send the action to the store. The mutation we want to send is the `createTask` mutation.

```js
import { take, put, select } from 'redux-saga/effects';
import * as mutations from './mutations';
import { v1 as uuid } from 'uuid';

export function* taskCreationSaga() {
    while (true) {
        const {groupID} = yield take(mutations.REQUEST_TASK_CREATION);
        console.log("Got group ID", groupID);
        const ownerID = 'U1';
        const taskID = uuid();
        yield put(mutations.createTask(taskID, groupID, ownerID));
    }
}
```

To run the **saga**, update `store/index.js`:

- add import `createSagaMiddleware` from `redux-saga` and assigned to `const sagaMiddleware`.
- import all sagas from `sagas.mock.js`.
- import all mutations from `mutations.js`.
- import `combineReduces` from `redux`. It creates a reducer that deals with each collection in our state differently.
- replace `reducer` function with `combineReducers` function.
- `combineReducers` takes objects as argument. The name of each property of the object corresponds to the collection.

```js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { defaultState } from '../../server/defaultState';
import { createLogger} from 'redux-logger/src';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();
import * as sagas from './sagas.mock';
import * as mutations from './mutations';

export const store = createStore(
    combineReducers({
        tasks(tasks = defaultState.tasks, action) {
            switch (action.type) {
                case mutations.CREATE_TASK:
                    return [...tasks, {
                        id:action.taskID,
                        name:"New Task",
                        group: action.groupID,
                        owner: action.ownerID,
                        isComplete: false
                    }]
            }
            return tasks;
        },
        comments(comments = defaultState.comments) {
            return comments;
        },
        groups(groups = defaultState.groups) {
            return groups;
        },
        users(users = defaultState.users) {
            return users;
        }
    }),
    applyMiddleware(createLogger(), sagaMiddleware)
);

for (let saga in sagas) {
    sagaMiddleware.run(sagas[saga]);
}
```

### Add a Task Detail page

The **Task Detail** page will allow users to modify the tasks.

#### Implementing tasks details Route. Part 1: Displaying data

1. Add route which displays the details of a single task
2. Route will implement forms and buttons to allow user to change data
3. Router will be used to indicate which task should be viewed
4. Interactions which mutate the state will be added later

Create a new file `app/components/TaskDetail.jsx`:

- Import `React`, `connect` and `Link`.
- Add all the component UI.
- Add `mapStateToProps` function.

```jsx
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const TaskDetail = ({
                        id,
                        comments,
                        task,
                        isComplete,
                        groups
                    }) => {
    return (
        <div>
            <div>
                <input type="text" value={task.name} className="form-control form-control-lg"/>
            </div>

            <form className="form-inline">
                <span>
                    Change Group
                </span>
                <select className="form-control">
                    {groups.map(group => (
                        <option key={group.id} value={group.id}>
                            {group.name}
                        </option>
                    ))}
                </select>
            </form>

            <form className="form-inline">
                <input type="text" name="commentContents" autoComplete="off" placeholder="Add a comment" className="form-control"/>
                <button type="submit" className="btn">Submit</button>
            </form>

            <div>
                <Link to="/dashboard">
                    <button>
                        Done
                    </button>
                </Link>
            </div>
        </div>
    )
}

function mapStateToProps(state,ownProps) {
    let id = ownProps.match.params.id;
    let task = state.tasks.find(task => task.id === id);
    let groups = state.groups;

    return {
        id,
        task,
        groups,
        isComplete: task.isComplete
    }
}

export const ConnectedTaskDetail = connect(mapStateToProps)(TaskDetail);
```

Update `components/Main.jsx`:

- Add a route to the new `TaskDetail` component.
- Import `TaskDetail` component.
- The `match` argument is the path id.

```jsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ConnectedDashboard } from './Dashboard';
import { BrowserRouter, Route, } from 'react-router-dom';
import { ConnectedNavigation } from './Navigation';
import { ConnectedTaskDetail} from './TaskDetail';

export const Main = ()=>(
    <BrowserRouter>
        <Provider store={store}>
            <div className="container mt-3">
                <ConnectedNavigation/>
                {/*<ConnectedDashboard/>*/}
                <Route
                    exact
                    path="/dashboard"
                    render={() => (<ConnectedDashboard/>)}
                />
                <Route
                    exact
                    path="/task/:id"
                    render={({ match }) => (<ConnectedTaskDetail match={match}/>)}
                />
            </div>
        </Provider>
    </BrowserRouter>
)
```

Update `components/TaskList.jsx`:

- Import `Link` from `react-router-dom`.
- For every task that is mapped, we render a **link** to its task page: `` Link to={`/task/${task.id}`} ``.

```jsx
import React from 'react';
import { connect } from 'react-redux';
import { requestTaskCreation} from '../store/mutations';
import { Link} from 'react-router-dom';

export const TaskList = ({tasks, name, id, createNewTask})=>(
    <div>
        <h3>
            {name}
        </h3>
        <div>
            {tasks.map(task => (
                <Link to={`/task/${task.id}`} key={task.id}>
                    <div>{task.name}</div>
                </Link>
            ))}
        </div>
        <button onClick={() => createNewTask(id)}>Add New</button>
    </div>
);

const mapStateToProps = (state, ownProps)=>{
    let groupID = ownProps.id;
    return {
        name: ownProps.name,
        id: groupID,
        tasks: state.tasks.filter(task=>task.group === groupID)
    };
};

const mapDispatchToProps = (dispatch, ownProps)=>{
    return {
        createNewTask(id) {
            console.log("Creating new task...", id);
            dispatch(requestTaskCreation(id));
        }
    };
};

export const ConnectedTaskList = connect(mapStateToProps, mapDispatchToProps)(TaskList);
```

#### Implementing tasks details Route. Part 2: Mutating data

1. Add methods which _dispatch_ actions when form elements of the task detail are interacted with
2. Add clauses to **Redux** reducer which causes state to be changed in response to relevant action

##### Add methods which _dispatch_ actions when form elements of the task detail are interacted with

Update `components/TaskDetail.jsx`:

- Modify the `button` output text (Reopen/Complete).
- Add `mapDispatchToProps` function.
- import all `mutations` from `mutations.js`.
- After adding the **mutations** to `mapDispatchToProps` function, pass the new functions as arguments to `TaskDetail` component.
- Pass `mapDispatchToProps` as a second argument to `connect` function.
- Add `setTaskGroup` and `setTaskName` to `mapDispatchToProps` and pass them as arguments to `TaskDetail` component.
- Add `onChange={setTaskName}` to `input` button.
- Add `onChange={setTaskGroup}` to `select` dropdown.

```jsx
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as mutations from '../store/mutations';

const TaskDetail = ({
                        id,
                        comments,
                        task,
                        isComplete,
                        groups,

                        setTaskCompletion,
                        setTaskGroup,
                        setTaskName
                    })=>{
    return (
        <div>
            <div>
                <input type="text" value={task.name} onChange={setTaskName} className="form-control form-control-lg"/>
            </div>

            <button onClick={() => setTaskCompletion(id,!isComplete)}>
                {isComplete ? `Reopen` : `Complete`} This Task
            </button>

            <form className="form-inline">
                <span>
                    Change Group
                </span>
                <select onChange={setTaskGroup} value={task.group} className="form-control">
                    {groups.map(group=>(
                        <option key={group.id} value={group.id}>
                            {group.name}
                        </option>
                    ))}
                </select>
            </form>

            <form className="form-inline">
                <input type="text" name="commentContents" autoComplete="off" placeholder="Add a comment" className="form-control"/>
                <button type="submit" className="btn">Submit</button>
            </form>

            <div>
                <Link to="/dashboard">
                    <button className="btn btn-primary mt-2">
                        Done
                    </button>
                </Link>
            </div>
        </div>
    )
}

function mapStateToProps(state,ownProps) {
    let id = ownProps.match.params.id;
    let task = state.tasks.find(task=>task.id === id);
    let groups = state.groups;

    return {
        id,
        task,
        groups,
        isComplete: task.isComplete
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    let id = ownProps.match.params.id;
    return {
        setTaskCompletion(id,isComplete){
            dispatch(mutations.setTaskCompletion(id,isComplete));
        },
        setTaskGroup(e){
            dispatch(mutations.setTaskGroup(id,e.target.value));
        },
        setTaskName(e){
            dispatch(mutations.setTaskName(id,e.target.value));
        }
    }
}

export const ConnectedTaskDetail = connect(mapStateToProps, mapDispatchToProps)(TaskDetail);
```

Update `store/mutations.js`:

- Add constants: `SET_TASK_COMPLETE`, `SET_TASK_GROUP`, `SET_TASK_NAME`.
- Add action creators: `setTaskCompletion`, `setTaskGroup`, `setTaskName`.

```js
export const REQUEST_TASK_CREATION = `REQUEST_TASK_CREATION`;
export const CREATE_TASK = `CREATE_TASK`;
export const SET_TASK_COMPLETE = `SET_TASK_COMPLETE`;
export const SET_TASK_GROUP = `SET_TASK_GROUP`;
export const SET_TASK_NAME = `SET_TASK_NAME`;

export const requestTaskCreation = (groupID) => ({
    type:REQUEST_TASK_CREATION,
    groupID
});

export const createTask = (taskID, groupID, ownerID) => ({
    type:CREATE_TASK,
    taskID,
    groupID,
    ownerID
});

export const setTaskCompletion = (id, isComplete) => ({
    type:SET_TASK_COMPLETE,
    taskID: id,
    isComplete
});

export const setTaskGroup = (id, groupID) => ({
    type:SET_TASK_GROUP,
    taskID: id,
    groupID
});

export const setTaskName = (id, name) => ({
    type:SET_TASK_NAME,
    taskID: id,
    name
});
```

##### Add clauses to **Redux** reducer which causes state to be changed in response to relevant action

Update `store/index.js` _(reducer)_:

- Add new case `mutations.SET_TASK_COMPLETE`.
- Add new cases for `mutations.SET_TASK_NAME` and `mutations.SET_TASK_GROUP`.

```js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { defaultState } from '../../server/defaultState';
import { createLogger} from 'redux-logger/src';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();
import * as sagas from './sagas.mock';
import * as mutations from './mutations';

export const store = createStore(
    combineReducers({
        tasks(tasks = defaultState.tasks, action) {
            switch (action.type) {
                case mutations.CREATE_TASK:
                    return [...tasks, {
                        id:action.taskID,
                        name:"New Task",
                        group: action.groupID,
                        owner: action.ownerID,
                        isComplete: false
                    }]
                case mutations.SET_TASK_COMPLETE:
                    return tasks.map(task => {
                       return (task.id === action.taskID) ?
                           {...task, isComplete:action.isComplete} :
                           task;
                    })
                case mutations.SET_TASK_NAME:
                    return tasks.map(task => {
                        return (task.id === action.taskID) ?
                            {...task, name:action.name} :
                            task;
                    })
                case mutations.SET_TASK_GROUP:
                    return tasks.map(task => {
                        return (task.id === action.taskID) ?
                            {...task, group:action.groupID} :
                            task;
                    });
            }
            return tasks;
        },
        comments(comments = defaultState.comments) {
            return comments;
        },
        groups(groups = defaultState.groups) {
            return groups;
        },
        users(users = defaultState.users) {
            return users;
        }
    }),
    applyMiddleware(createLogger(), sagaMiddleware)
);

for (let saga in sagas) {
    sagaMiddleware.run(sagas[saga]);
}
```

### Front End Summary

1. Webpack is useful as it allows us to write code using imports and with JSX.
2. Redux is a reliable and convenient way to store and manage our application state.
3. React components often contain forms used by the end user.
4. Using React-Redux, React components can update automatically to reflect data.

## Creating Persistent Data storage with Node, Express, and MongoDB

### Installing MongoDB

#### What is MongoDB?

- Database for storing persistent data
- Non-relational (collections, not tables, fluid data structure)
- Convenient JSON-based communication works with Node
- Alternative to relational databases such as MySQL

#### Install MongoDB
