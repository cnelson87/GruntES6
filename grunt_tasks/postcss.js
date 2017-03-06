/**
 * postcss
 * Apply several post-processors to your CSS using PostCSS.
 */

var autoprefixer = require('autoprefixer');

module.exports = function (grunt) {

	// list all plugins
	var plugins = [
		autoprefixer({browsers: ['last 5 versions', 'ie 9']})
	];

	return {

		dev: {
			options: {
				processors: plugins,
				map: true
			},
			files: [{
				src: '<%= localStyles %>/<%= assetName %>.css',
				dest: '<%= localStyles %>/<%= assetName %>.css'
			}]
		},

		dist: {
			options: {
				processors: plugins,
				map: false
			},
			files: [{
				src: '<%= publicStyles %>/<%= assetName %>.css',
				dest: '<%= publicStyles %>/<%= assetName %>.css'
			}]
		}

	};

};