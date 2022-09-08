/**
 * stylelint
 * Grunt plugin for running stylelint
 */

module.exports = function (grunt) {

	return {
		options: {
			configFile: '.stylelintrc.json'
		},
		src: ['<%= sourceStyles %>/**/*.scss', '!<%= sourceStyles %>/vendor/**/*.scss']
	};

};
