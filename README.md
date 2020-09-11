pluralsight.com/author/troy-hunt

# Setting up Webpack to Compile our application

1. `Webpack` is a library that uses `babel` which converts `.jsx` and `ES6` files into `.js` files.
2. One thing `webpack` does that `babel` can't is it bundles set of files connected by `import` statements into one file.
3. `Webpack` has a tool called `webpack-dev-server` which allow us to create an application in a fast and convenient way.

## Install Webpack, Babel and other libraries needed for bundling and transpilation

- Create a `package.json` file:

```console
npm init --yes
```

- Install `Webpack`:

```console
npm install --save-dev webpack
```

- Add `.gitignore` and add `node_modules`.
- Install other dependencies:

```console
npm install --save-dev webpack-cli webpack-dev-server
npm install --save-dev @babel/core
npm install --save-dev @babel/node @babel/preset-env @babel/preset-react @babel/register
npm install --save-dev babel-loader
```

## Create `.babelrc` file to define how `.jsx` and ES6 should be handled

- Add a `.babelrc` which is a json file that babel checks to determine how it should run:

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

## Create `webpack.config.js` file to describe how our app should be bundled

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

- Add the entry file at ``src/app/index.js`:

```
console.log("Hello world!!!");
```

- Add a script in `package.json`:

```json
"start": "webpack"
```

- Add `dist` folder to `.gitignore`.

## Create stubs for `index.html` and `index.js`, which will form the basis of our app

- Add `index.html`:
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

## On completion, app should say "hello world" in JS and HTML

- Define another script in `package.json`:

```json
"dev": "webpack-dev-server --open"
```

- Run the application

```console
npm run dev
```

# Implementing React Components and Redux State

## Create default application state as JSON file for development

- Add `src/server/defaultState.js`:
```javascript
import md5 from 'md5';
export const defaultState = {
    users:[{
        id:"U1",
        name:"Dev",
        passwordHash:md5("TUPLES"),
        friends:[`U2`]
    },{
        id:"U2",
        name:"C. Eeyo",
        passwordHash:md5("PROFITING"),
        friends:[]
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

## Create basic Redux store to provide state to application as necessary

- Install `Redux`:

```console
npm install --save redux
```

- Create the `Redux` store at `src/app/store/index.js`:

```js
import { createStore } from 'redux';
import { defaultState } from '../../server/defaultState';

export const store = createStore(
    function reducer (state = defaultState, action) {
        return state;
    }
);
```

- Import the store in `app/index.js`:

```javascript
import { store } from './store'

console.log (store.getState());
```

- Run the application and you should see an `Object` element in the `console` which contains all the data we specified in `src/server/defaultState.js`.

## Adding a Dashboard Component

