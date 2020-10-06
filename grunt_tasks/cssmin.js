/**
 * cssmin
 * Minify CSS
 */

module.exports = function (grunt) {
	return {
		prod: {
			files: [{
				expand: true,
				cwd: '<%= prodStyles %>',
				src: ['*.css'],
				dest: '<%= prodStyles %>'
			}]
		}
	};
};
