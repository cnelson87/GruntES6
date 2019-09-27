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
				'<%= localPath %>/*.html': ['<%= sourceHTML %>/*.html'],
				'<%= localPath %>/ajax-content/*.html': ['<%= sourceHTML %>/ajax-content/*.html']
			}
		},

		prod: {
			files: {
				'<%= publicPath %>/*.html': ['<%= sourceHTML %>/*.html'],
				'<%= publicPath %>/ajax-content/*.html': ['<%= sourceHTML %>/ajax-content/*.html']
			}
		}

	};

};
