/**
 * sass
 * Compile Sass to CSS using node-sass
 */

var nodesass = require('node-sass');

module.exports = function (grunt) {

	return {

		dev: {
			options: {
				implementation: nodesass,
				sourceComments: true,
				sourceMap: true,
				sourceMapContents: true,
				outputStyle: 'expanded'
			},
			files: [{
				src: '<%= sourceStyles %>/index.scss',
				dest: '<%= devStyles %>/<%= appName %>.css'
			},{
				src: '<%= sourceStyles %>/print.scss',
				dest: '<%= devStyles %>/print.css'
			}]
		},

		prod: {
			options: {
				implementation: nodesass,
				sourceComments: false,
				sourceMap: false,
				sourceMapContents: false,
				outputStyle: 'compressed'
			},
			files: [{
				src: '<%= sourceStyles %>/index.scss',
				dest: '<%= prodStyles %>/<%= appName %>.css'
			},{
				src: '<%= sourceStyles %>/print.scss',
				dest: '<%= prodStyles %>/print.css'
			}]
		}

	};

};
