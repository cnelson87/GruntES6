/**
 * clean
 * Clean files and folders.
 */

module.exports = function (grunt) {
	return {
		dev: '<%= devPath %>',
		prod: '<%= prodPath %>',
		temp: '<%= tempPath %>'
	};
};
