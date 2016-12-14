/**
 * scss-lint
 * Validate .scss files with scss-lint.
 */

module.exports = function (grunt) {

	return {

		dev: {
			options: {
				config: '.scss-lint.yml',
				failOnWarning: true,
				force: false,
				reporterOutput: null
			},
			files: [{
				src: ['<%= sourceStyles %>/**/*.scss', '!<%= sourceStyles %>/vendor/**/*.scss']
			}]
		},

		dist: {
			options: {
				config: '.scss-lint.yml',
				force: true,
				reporterOutput: null
			},
			files: [{
				src: ['<%= sourceStyles %>/**/*.scss', '!<%= sourceStyles %>/vendor/**/*.scss']
			}]
		}

	};

};