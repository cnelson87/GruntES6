/**
 * eslint
 * Validate files with ESlint.
 * available rules: http://eslint.org/docs/rules/
 */

module.exports = function (grunt) {
	return {
		target: ['<%= sourceScripts %>/**/*.js']
	};
};
