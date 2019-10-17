/**
 * clean
 * Clean files and folders.
 */

module.exports = function (grunt) {
	return {
		dev: '<%= localPath %>',
		prod: '<%= publicPath %>',
		temp: '<%= tempPath %>'
	};
};
