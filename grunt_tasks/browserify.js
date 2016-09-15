/**
 * browserify
 * Grunt task for node-browserify.
 */

var path = require('path');
var pathmodify = require('pathmodify');

module.exports = function (grunt) {

	var paths = [
		pathmodify.mod.dir('config', path.join(__dirname, '../src/scripts/config')),
		pathmodify.mod.dir('collections', path.join(__dirname, '../src/scripts/collections')),
		pathmodify.mod.dir('models', path.join(__dirname, '../src/scripts/models')),
		pathmodify.mod.dir('utilities', path.join(__dirname, '../src/scripts/utilities')),
		pathmodify.mod.dir('views', path.join(__dirname, '../src/scripts/views')),
		pathmodify.mod.dir('widgets', path.join(__dirname, '../src/scripts/widgets')),
		pathmodify.mod.dir('templates', path.join(__dirname, '../src/templates'))
	];

	return {

		options: {
			transform: ['browserify-handlebars', ['babelify', {
				presets: ['latest'],
				plugins: ['transform-object-assign']
			}]],
			configure: function(b) {
				b.plugin(pathmodify, {mods: paths});
			},
			browserifyOptions: {
				extensions: ['.hbs'],
				fullPaths: false
			}
		},

		dev: {
			options: {
				debug: true
			},
			files: [{
				src: '<%= sourceScripts %>/initialize.js',
				dest: '<%= localScripts %>/<%= assetName %>.js'
			}]
		},

		dist: {
			options: {
				debug: false
			},
			files: [{
				src: '<%= sourceScripts %>/initialize.js',
				dest: '<%= publicScripts %>/<%= assetName %>.js'
			}]
		}

	};

};