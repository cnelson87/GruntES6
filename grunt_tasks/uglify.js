/**
 * uglify
 * Minify files with UglifyJS.
 */

module.exports = function (grunt) {
	return {
		prod: {
			files: [{
				src: '<%= prodScripts %>/<%= appName %>.js',
				dest: '<%= prodScripts %>/<%= appName %>.js'
			}]
		}
	};
};
