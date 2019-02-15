/**
 * sass
 * Compile Sass to CSS using node-sass
 */

var nodeSass = require('node-sass');

module.exports = function (grunt) {

	return {

		dev: {
			options: {
				implementation: nodeSass,
				sourceComments: true,
				sourceMap: true,
				sourceMapContents: true,
				outputStyle: 'expanded'
			},
			files: [{
				src: '<%= sourceStyles %>/app.scss',
				dest: '<%= localStyles %>/<%= assetName %>.css'
			},{
				src: '<%= sourceStyles %>/print.scss',
				dest: '<%= localStyles %>/print.css'
			}]
		},

		dist: {
			options: {
				implementation: nodeSass,
				sourceComments: false,
				sourceMap: false,
				sourceMapContents: false,
				outputStyle: 'compressed'
			},
			files: [{
				src: '<%= sourceStyles %>/app.scss',
				dest: '<%= publicStyles %>/<%= assetName %>.css'
			},{
				src: '<%= sourceStyles %>/print.scss',
				dest: '<%= publicStyles %>/print.css'
			}]
		}

	};

};
