/**
 * sasslint
 * Lint your sass using Node Sass Lint
 */

module.exports = function (grunt) {

	return {

		dev: {
			options: {
				config: '.sass-lint.yml',
				failOnWarning: true,
				force: false,
				reporterOutput: null
			},
			files: [{
				src: ['<%= sourceStyles %>/**/*.scss', '!<%= sourceStyles %>/vendor/**/*.scss']
			}]
		},

		prod: {
			options: {
				config: '.sass-lint.yml',
				force: true,
				reporterOutput: null
			},
			files: [{
				src: ['<%= sourceStyles %>/**/*.scss', '!<%= sourceStyles %>/vendor/**/*.scss']
			}]
		}

	};

};
