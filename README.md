# GruntES6

A Grunt-based ES6 sandbox. Scripts are compiled using Browserify and transpiled using Babelify. All scripts are written as ES6 modules. Instantiable modules are written as ES6 classes.


## Base Dependencies

- [Install Node.js:](https://nodejs.org/)
- [Install Grunt-CLI:](https://gruntjs.com/), `npm install grunt-cli -g`


## NPM Modules

- `cd` into the root directory containing 'package.json'
- Install dependencies: `npm install`


## Workflow

All development work should be done in the 'src' directory. Use the grunt commands below for running the project locally and compiling for production.


## Grunt Tasks

- `grunt build` : Default task packages all files for delivery to staging or production, and outputs to a 'prod' folder. Copies all static assets, lints and compiles javascript, lints and compiles SASS, optimizes JS and CSS.
- `grunt run` : Same as default grunt task minus JS and CSS optimization, and outputs to a 'dev' folder. Runs a local static server with automatic live-reloading, watches all files for changes.


## NPM scripts

- `npm run build` : npm script alias for `grunt build`
- `npm start` : npm script alias for `grunt run`
