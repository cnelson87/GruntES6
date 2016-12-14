/**
 * lintspaces
 * A Grunt task for checking spaces in files.
 */

module.exports = function (grunt) {

	return {

		options: {
			// newline: true,
			newlineMaximum: 2,
			trailingspaces: true,
			indentation: 'tabs'
		},

		src: ['<%= sourceHTML %>/**/*.html', '!<%= sourceHTML %>/_context/**/*.*', '!<%= sourceHTML %>/_helpers/**/*.*']

	};

};