/**
 * postcss
 * Apply several post-processors to your CSS using PostCSS.
 */

var autoprefixer = require('autoprefixer');

module.exports = function (grunt) {

	// list all plugins
	var plugins = [
		autoprefixer
	];

	return {

		dev: {
			options: {
				processors: plugins,
				map: true
			},
			files: [{
				src: '<%= localStyles %>/<%= appName %>.css',
				dest: '<%= localStyles %>/<%= appName %>.css'
			}]
		},

		prod: {
			options: {
				processors: plugins,
				map: false
			},
			files: [{
				src: '<%= publicStyles %>/<%= appName %>.css',
				dest: '<%= publicStyles %>/<%= appName %>.css'
			}]
		}

	};

};
