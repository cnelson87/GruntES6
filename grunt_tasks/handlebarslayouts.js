/**
 * handlebarslayouts
 * Handlebars task to render Handlebars templates to HTML.
 */

module.exports = function (grunt) {

	return {

		options: {
			basePath: '<%= sourceHTML %>',
			partials: [
				'<%= sourceHTML %>/_layouts/**/*.html',
				'<%= sourceHTML %>/_partials/**/*.html'
			],
			modules: ['<%= sourceHTML %>/_helpers/**/*.js'],
			context: [
				'<%= sourceHTML %>/_context/data.json',
				{
					'appName': '<%= appName %>'
				}
			]
		},

		dev: {
			files: {
				'<%= devPath %>/*.html': ['<%= sourceHTML %>/*.html'],
				'<%= devPath %>/ajax-content/*.html': ['<%= sourceHTML %>/ajax-content/*.html']
			}
		},

		prod: {
			files: {
				'<%= prodPath %>/*.html': ['<%= sourceHTML %>/*.html'],
				'<%= prodPath %>/ajax-content/*.html': ['<%= sourceHTML %>/ajax-content/*.html']
			}
		}

	};

};
