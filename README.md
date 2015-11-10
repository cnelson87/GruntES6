# Grunt ES6

A Grunt-based ES6 sandbox. Scripts are compiled using Browserify and transpiled using Babelify. All scripts are written as ES6 modules. Instantiable modules are written as ES6 classes.


## Install Base Dependencies

- Install Node.js: [NodeJS Installer](http://nodejs.org/)
- Install Bower (browser package manager): `npm install -g bower`
- Install Grunt-CLI (command-line interface):  `npm install -g grunt-cli`
- Install SASS: `gem install sass`


## NPM Modules

- CD into the repo where `GruntFile.js` lives
- Install dependencies: `npm install`

Please note: Depending upon your setup you may need `sudo` permissions to execute the above commands.


## Bower Install

To install third party JS libs with Bower:

- all: `bower install`
- individually: `bower install [libname]`


## Grunt Tasks

- `grunt bower` : Command to copy JS libs into vendor folder.
- `grunt build` : Compile, concat, and minify the css and js, and copy assets. Outputs to production 'public' folder.
- `grunt run`   : Runs build:dev, connect, and watch tasks. Outputs to development 'local' folder.
