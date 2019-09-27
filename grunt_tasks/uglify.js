/**
 * uglify
 * Minify files with UglifyJS.
 */

module.exports = function (grunt) {

	return {

		prod: {
			files: [{
				src: '<%= publicScripts %>/<%= appName %>.js',
				dest: '<%= publicScripts %>/<%= appName %>.js'
			}]
		}

	};

};