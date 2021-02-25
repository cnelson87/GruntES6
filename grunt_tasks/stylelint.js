/**
 * stylelint
 * Grunt plugin for running stylelint
 */

module.exports = function (grunt) {

	return {
		options: {
			configFile: '.stylelintrc.json',
			syntax: 'scss'
		},
		src: ['<%= sourceStyles %>/**/*.scss', '!<%= sourceStyles %>/vendor/**/*.scss']
	};

};
