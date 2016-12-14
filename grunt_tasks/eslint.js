/**
 * eslint
 * Validate files with ESlint.
 */

module.exports = function (grunt) {

	return {

		options: {
			configFile: './.eslintrc.json'
		},

		target: ['<%= sourceScripts %>/**/*.js']

	};

};