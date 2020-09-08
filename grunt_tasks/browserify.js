/**
 * browserify
 * Grunt task for node-browserify.
 */

var path = require('path');
var pathmodify = require('pathmodify');

module.exports = function (grunt) {

	var mods = [
		pathmodify.mod.dir('config', path.join(__dirname, '../src/scripts/config')),
		pathmodify.mod.dir('utilities', path.join(__dirname, '../src/scripts/utilities')),
		pathmodify.mod.dir('views', path.join(__dirname, '../src/scripts/views')),
		pathmodify.mod.dir('widgets', path.join(__dirname, '../src/scripts/widgets')),
		pathmodify.mod.dir('templates', path.join(__dirname, '../src/templates'))
	];

	return {

		options: {
			transform: [
				['hbsfy', {extensions: ['hbs']}],
				['babelify']
			],
			configure: function(b) {
				b.plugin(pathmodify, {mods: mods});
			},
			browserifyOptions: {
				fullPaths: false
			}
		},

		dev: {
			options: {
				debug: true
			},
			files: [{
				src: '<%= sourceScripts %>/initialize.js',
				dest: '<%= localScripts %>/<%= appName %>.js'
			}]
		},

		prod: {
			options: {
				debug: false
			},
			files: [{
				src: '<%= sourceScripts %>/initialize.js',
				dest: '<%= publicScripts %>/<%= appName %>.js'
			}]
		}

	};

};
