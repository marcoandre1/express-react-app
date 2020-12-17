# Express-react-app

This repo was built following **Daniel Stern** PluralSight course **Building a Full Stack App with React and Express**.  
You can find the original repo at: <https://www.github.com/danielstern/express-react-fullstack>.  

## Demo Application

This app uses React and Redux to display components. Routing determines which component to display. Express allows to communicate with MongoDB through REST API.  

## Security Considerations

If security is a concern, you should look at: <https://www.pluralsight.com/authors/troy-hunt>.  

## Creating a View Layer with React and Redux

**Goal**: Create a view layer which is fast, usable and easy to maintain.
**Limitation**: Until we add back end in the next module, data cannot be persisted.

1. [Setting up Webpack to Compile our application](https://github.com/marcoandre1/express-react-app#setting-up-webpack-to-compile-our-application)
2. [Install Webpack, Babel and other libraries needed for bundling and transpilation](https://github.com/marcoandre1/express-react-app#install-webpack-babel-and-other-libraries-needed-for-bundling-and-transpilation)
3. [Create `.babelrc` file to define how `.jsx` and ES6 should be handled](https://github.com/marcoandre1/express-react-app#create-babelrc-file-to-define-how-jsx-and-es6-should-be-handled)
4. [Create `webpack.config.js` file to describe how our app should be bundled](https://github.com/marcoandre1/express-react-app#create-webpackconfigjs-file-to-describe-how-our-app-should-be-bundled)
5. [Create stubs for `index.html` and `index.jsx`, which will form the basis of our app](https://github.com/marcoandre1/express-react-app#create-stubs-for-indexhtml-and-indexjsx-which-will-form-the-basis-of-our-app)

### Setting up Webpack to Compile our application

1. `Webpack` is a library that uses `babel` which converts `.jsx` and `ES6` files into `.js` files.
2. One thing `webpack` does that `babel` can't is it bundles set of files connected by `import` statements into one file.
3. `Webpack` has a tool called `webpack-dev-server` which allow us to create an application in a fast and convenient way.

### Install Webpack, Babel and other libraries needed for bundling and transpilation

- Create a `package.json` file:

```console
npm init --yes
```

- Install `Webpack`:

```console
npm install --save-dev webpack
```

- Add `.gitignore` file and add `node_modules` and `dist` to it.
- Install other dependencies:

```console
npm install --save-dev webpack-cli webpack-dev-server
npm install --save-dev @babel/core
npm install --save-dev @babel/node @babel/preset-env @babel/preset-react @babel/register
npm install --save-dev babel-loader
```

### Create `.babelrc` file to define how `.jsx` and ES6 should be handled

- Add a `.babelrc` file which is a json file that babel checks to determine how it should run:

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

### Create `webpack.config.js` file to describe how our app should be bundled

- Add a `webpack.config.js` file:

```javascript
// import path from 'path';

const path = require("path");
// export default {
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
        historyApiFallback: true
    },
    module: {
        rules: [{
            test: /\.jsx?/,
            loader:'babel-loader'
        }]
    }
}
```

- Add the entry file at ``src/app/index.jsx`:

```javascript
console.log("Hello world!!!");
```

- Add a script in `package.json`:

```json
{
    "start": "webpack"
}
```

### Create stubs for `index.html` and `index.jsx`, which will form the basis of our app

- Add `index.html` to the root of the project:

```html
<head>

    <title>
        An Application
    </title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
</head>
<body class="container">
    <div id="app"></div>
    <script src="/bundle.js"></script>
</body>
```

- Define another script in `package.json` to launch the application:

```json
{
    "dev": "webpack-dev-server --open"
}
```

- You can now run the application: `npm run dev`.

> App should say "hello world" in the console.

### Redux Overview

1. Manages underlying data.
2. Application state can be easily accessed.
3. Changing application state occurs only via actions.
4. Redux state is provided to React components via React-Redux, a small connector library.

### Create default application state as JSON file for development

- Add `src/server/defaultState.js` file:

```javascript
export const defaultState = {
    users:[{
        id:"U1",
        name:"Dev"
    },{
        id:"U2",
        name:"C. Eeyo"
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
        owner:"U1",
        id:"C1",
        task:"T1",
        content:"Great work!"
    }]
};
```

### Create basic Redux store to provide state to application as necessary

- Install `Redux`:

```console
npm install --save redux
```

- Create the `Redux` store at `src/app/store/index.jsx`:

```js
import { createStore } from 'redux';
import { defaultState } from '../../server/defaultState';

export const store = createStore(
    function reducer (state = defaultState, action) {
        return state;
    }
);
```

- Import the store in `app/index.jsx`:

```javascript
import { store } from './store'

console.log (store.getState());
```

> **NOTE:** remove `console.log (store.getState())` after testing but keep the import statement!

- Run the application. You should see an `Object` element in the `console` which contains all the data 
we specified in `src/server/defaultState.js`.

### Add React dashboard component to add as a "home page" for end user

- Install some dependencies:

```console
npm install --save react react-dom react-redux
```

- Add the `Dashboard` component at `src/app/components/Dashboard.jsx`:

```jsx
/**
 * The dashboard is a simple React component that contains several lists of tasks,
 * one for each group that belongs to the user.
 */

import React from 'react';

export const Dashboard = ({groups})=>(
    <div>
        <h2>Dashboard</h2>
    </div>
);
```

- Update `app/index.jsx`:

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

- Run the application: `npm run dev`.

### Connect the Dashboard to the Redux store

- Add the `Main` component at `src/app/components/Main.jsx`:

```jsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';

export const Main = ()=>(
    <Provider store={store}>
        <div className="container mt-3">
            Dashboard goes here.
        </div>
    </Provider>
);
```

- Update `index.jsx` to load `Main` component:

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

- Run the application: `npm run dev`.
- Add `function mapStateToProps(state)` to `Dashboard` component and call `connect` from Redux.
- Update `Main.jsx` and import the `ConnectedDashboard`:

```jsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ConnectedDashboard } from "./Dashboard";

export const Main = ()=>(
    <Provider store={store}>
        <div className="container mt-3">
            {/*Dashboard goes here.*/}
            <ConnectedDashboard/>
        </div>
    </Provider>
);
```

- Run the application: `npm run dev`.

### Create TaskList component

- Add the `TaskList` component at `src/app/components/TaskList.jsx`:

```jsx
import React from 'react';
import { connect } from 'react-redux';

export const TaskList = ({tasks, name})=>(
    <div className="card p-2 m-2">
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

const mapStateToProps = (state, ownProps)=>{
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
/**
 * The dashboard is a simple React component that contains several lists of tasks,
 * one for each group that belongs to the user.
 */

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

### Add Routing and Navigation

1. "Routing" is a term for when the form of the application is affected by the URL bar.
2. `react-router` determines which React component to display based on URL.
3. Good use of routing allows a lot of information to be codified in URL.

### Add "Main" component whose contents will change based on URL

- Add `react-router-dom`: `npm install react-router-dom --save`.

> **NOTE:** in the original version, `history` was also installed but it seems deprecated.

- Update `Main.jsx` to import `BrowserRouter` and `Route`:

```jsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ConnectedDashboard } from './Dashboard';
import { BrowserRouter, Route, } from 'react-router-dom';
import { ConnectedNavigation } from './Navigation';

export const Main = ()=>(
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

### Create new navigation component to go alongside dashboard

- Add a new `Navigation` component at `src/app/components/Navigation.jsx`:

```jsx
/**
 * The navigation component is present on all non-login pages,
 * and contains a link back to the dashboard, and the user's name.
 */
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import React from 'react';

const Navigation = ()=>(
    <div className="header">
        <Link to="/dashboard">
            <h1>
                My Application
            </h1>
        </Link>
    </div>
);

export const ConnectedNavigation = connect(state=>state)(Navigation);
```

- Update `Main.jsx` to import the `Navigation` component :

```jsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ConnectedDashboard } from "./Dashboard";
import { Router, Route } from 'react-router-dom';
import { history } from "../store/history";
import { ConnectedNavigation } from "./Navigation";

export const Main = ()=>(
    <Router history={ history }>
        <Provider store={store}>
            <div className="container mt-3">
                <ConnectedNavigation/>
                {/*<ConnectedDashboard/>*/}
                <Route
                    exact
                    path={"/dashboard"}
                    render={ () => (<ConnectedDashboard/>)}
                />
            </div>
        </Provider>
    </Router>
);
```

### Add new tasks using Sagas

1. Reducer must be updated to allow tasks array to be changed.
2. Tasks need random ID, reducers can't be random, therefore **Saga** or **Thunk** is needed.
3. Updated state is reflected automatically in React component appearance.

#### Sagas in Brief

1. Sagas run in the background of Redux applications.
2. Respond to actions by generating "side-effects" (anything outside the app).
3. One of only a few places where generators functions are found.

#### Generators in Brief

1. Standard JavaScript functions (non-generator) return a single value, instantly.
2. Generators can return any number of values, not just one.
3. Generator values can be returned at a later time (asynchronously).

- Example:

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
- `while (true)` loops can exist in generator functions.
- `Yield` keyword returns value to the generator's caller (can return many values).
- Yields 43, 44, 45, ...

For more info, take a look at: <https://www.pluralsight.com/courses/redux-saga>

### Create saga to generate random task ID, create task dispatch action containing details

- Update `TaskList.jsx` to include a button to create a _new task_ and add the `createNewTask` method:

```jsx
import React from 'react';
import { connect } from 'react-redux';

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
        }
    };
};

export const ConnectedTaskList = connect(mapStateToProps, mapDispatchToProps)(TaskList);
```

- You should be able to see the `Add New` button and if you enter the console, it creates a task for the right group!
- Create a new file at `app/store/mutations.js`. This file is a template for all the changes to the application state:

```jsx
export const REQUEST_TASK_CREATION = `REQUEST_TASK_CREATION`;
export const CREATE_TASK = `CREATE_TASK`;

export const requestTaskCreation = (groupID)=>({
    type:REQUEST_TASK_CREATION,
    groupID
});

export const createTask = (taskID, groupID, ownerID)=>({
    type:CREATE_TASK,
    taskID,
    groupID,
    ownerID
});
```

- Update `TaskList` to import `requestTaskCreation`:

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

- To help us understand what is going on, we want to add _logging_ **(console logging, not user login!)**.
- Add new dependencies: `npm install --save redux-logger redux-saga`.
- Update the `store/index.js` file to import `createLogger` and `applyMiddleware`:

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

- Now, whenever we dispatch an action, we will see it in the console!

### Create a "mock" saga to interact with the "server" (the server doesn't exist yet)

- Usually actions change the state of the application. However, for actions that require any kind of randomness like 
the task creation, we need some kind of intermediary, in other words a **saga**.
- Add a saga to deal with this unusual request.
- Install `uuid` to generate random `id`: `npm install --save uuid`.
- Add a new file at `store/sagas.mock.js`. All the **real sagas** will be communicating with the server, but until 
we have that, we are going to use this **mock** that will do it on their own:

```js
import { take, put, select } from 'redux-saga/effects';

import * as mutations from './mutations';
import { v1 as uuid } from 'uuid';

/**
 * Reducers cannot have any randomness (the must be deterministic)
 * Since the action of creating a task involves generating a random ID, it is not pure.
 * When the response to an action is not deterministic in a Redux application, both Sagas and Thunks are appropriate.
 */
export function* taskCreationSaga(){
    while (true){
        const {groupID} = yield take(mutations.REQUEST_TASK_CREATION);
        const ownerID = 'U1';
        const taskID = uuid();
        yield put(mutations.createTask(taskID, groupID, ownerID));
        console.log("Got group ID", groupID);
    }
}
```

- Update `store/index.js` to import `createSagaMiddleware`:

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
                    // console.log(action);
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

### Implementing tasks details Route. Part 1: Displaying data

#### Using Mock Files During Development

- Files with `.mock` extension indicate the file does not contain the true business logic.
- Used to reduce complexity (eg., does not depend on server).
- Mocks are commonly used in testing framework such as Jest.

#### Demo

1. Add route which displays the details of a single task
2. Route will implement forms and buttons to allow user to change data
3. Router will be used to indicate which task should be viewed
4. Interactions which mutate the state will be added later

- Create a new file `app/components/TaskDetail.jsx`:

```jsx
/**
 * The task detail component route is a more sophisticated form that has many different fields.
 * The component automatically calls the REST API [via a mutation] to update the server on every change.
 */
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const TaskDetail = ({
                        id,
                        comments,
                        task,
                        isComplete,
                        groups
                    })=>{
    return (
        <div className="card p-3 col-6">
            <div>
                <input type="text" value={task.name} className="form-control form-control-lg"/>
            </div>

            <form className="form-inline">
                <span className="mr-4">
                    Change Group
                </span>
                <select className="form-control">
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

function mapStateToProps(state,ownProps){
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

export const ConnectedTaskDetail = connect(mapStateToProps)(TaskDetail);
```

- Update `components/Main.jsx` to include a route for `TaskDetail`:

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
                    render={ () => (<ConnectedDashboard/>)}
                />
                <Route
                    exact
                    path="/task/:id"
                    render={ ({ match }) => (<ConnectedTaskDetail match={ match }/>)}
                />
            </div>
        </Provider>
    </BrowserRouter>
)
```

- Update `components/TaskList.jsx` to add links to each task:

```jsx
import React from 'react';
import { connect } from 'react-redux';
import { requestTaskCreation} from '../store/mutations';
import { Link} from 'react-router-dom';

export const TaskList = ({tasks, name, id, createNewTask})=>(
    <div className="card p-2 m-2">
        <h3>
            {name}
        </h3>
        <div>
            {tasks.map(task=>(
                <Link to={`/task/${task.id}`} key={task.id}>
                    <div>{task.name}</div>
                </Link>
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

### Implementing tasks details Route. Part 2: Mutating data

1. Add methods which _dispatch_ actions when form elements of the task detail are interacted with
2. Add clauses to **Redux** reducer which causes state to be changed in response to relevant action

#### Add methods which _dispatch_ actions when form elements of the task detail are interacted with

- Update `components/TaskDetail.jsx`:

```jsx
/**
 * The task detail component route is a more sophisticated form that has many different fields.
 * The component automatically calls the REST API [via a mutation] to update the server on every change.
 */
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
        <div className="card p-3 col-6">
            <div>
                <input type="text" value={task.name} onChange={setTaskName} className="form-control form-control-lg"/>
            </div>

            <button  className="btn btn-primary ml-2" onClick={() => setTaskCompletion(id,!isComplete)}>
                {isComplete ? `Reopen` : `Complete`} This Task
            </button>

            <form className="form-inline">
                <span className="mr-4">
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

function mapStateToProps(state,ownProps){
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

function mapDispatchToProps(dispatch, ownProps){
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

- Update `store/mutations.js`:

```js
export const REQUEST_TASK_CREATION = `REQUEST_TASK_CREATION`;
export const CREATE_TASK = `CREATE_TASK`;
export const SET_TASK_COMPLETE = `SET_TASK_COMPLETE`;
export const SET_TASK_GROUP = `SET_TASK_GROUP`;
export const SET_TASK_NAME = `SET_TASK_NAME`;

export const requestTaskCreation = (groupID)=>({
    type:REQUEST_TASK_CREATION,
    groupID
});

export const createTask = (taskID, groupID, ownerID)=>({
    type:CREATE_TASK,
    taskID,
    groupID,
    ownerID
});

export const setTaskCompletion = (id, isComplete)=>({
    type:SET_TASK_COMPLETE,
    taskID: id,
    isComplete
});

export const setTaskGroup = (id, groupID)=>({
    type:SET_TASK_GROUP,
    taskID: id,
    groupID
});

export const setTaskName = (id, name)=>({
    type:SET_TASK_NAME,
    taskID: id,
    name
});
```

#### Add clauses to **Redux** reducer which causes state to be changed in response to relevant action

- Update `store/index.js` _(reducer)_:

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

#### Front End Summary

1. Webpack is useful as it allows us to write code using imports and with JSX
2. Redux is a reliable and convenient way to store and manage our application state
3. React components often contain forms used by the end user
4. Using Ract-Redux, React components can update automatically to reflect data

## Creating Persistent Data storage with Node, Express, and MongoDB

### Installing MongoDB

#### What is MongoDB?

- Database for storing persistent data
- Non-relational (collections, not tables, fluid data structure)
- Convenient JSON-based communication works with Node
- Alternative to relational databases such as MySQL

#### Install MongoDB