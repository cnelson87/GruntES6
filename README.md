# Grunt ES6

A Grunt-based ES6 sandbox. Scripts are compiled using Browserify and transpiled using Babelify. All scripts are written as ES6 modules. Instantiable modules are written as ES6 classes.


## Base Dependencies

- Install Node.js: [NodeJS Installer](https://nodejs.org/)
- Install Bower (browser package manager): `npm install -g bower`
- Install Grunt-CLI (command-line interface):  `npm install -g grunt-cli`


## NPM Modules

- CD into the repo where `package.json` lives
- Install dependencies: `npm install`


## Workflow

All development work should be done in the 'src' directory. Use the grunt commands below for running the project locally and processing for handoff to QA/Staging/Production.


## Grunt Tasks

- `grunt build`   : Compile, concat, and minify the CSS and JS, and copy assets. Outputs to production 'public' folder.
- `grunt run`     : Runs build:dev, connect, and watch tasks. Outputs to development 'local' folder.


## NPM scripts

- `npm run build` : npm script alias for `grunt build`
- `npm start`     : npm script alias for `grunt run`
