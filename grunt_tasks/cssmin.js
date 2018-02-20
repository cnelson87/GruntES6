/**
 * cssmin
 * Minify CSS
 */

module.exports = function (grunt) {

	return {

		dist: {
			files: [{
				expand: true,
				cwd: '<%= publicStyles %>',
				src: ['*.css'],
				dest: '<%= publicStyles %>'
			}]
		}

	};

};
