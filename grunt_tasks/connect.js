/**
 * connect
 * Start a connect web server.
 */

module.exports = function (grunt) {
	return {
		localhost: {
			options: {
				hostname: '*',
				base: '<%= devPath %>',
				port: '<%= portNum %>',
				livereload: '<%= livereloadPort %>'
			}
		}
	};
};
