
/**
 * watch
 * Run predefined tasks whenever watched file patterns are added, changed or deleted.
 */

module.exports = function (grunt) {

	return {

		options: {
			livereload: '<%= lrPortNum %>',
			spawn: false
		},

		data: {
			files: ['<%= sourceData %>/**/*.json'],
			tasks: ['newer:copy:data']
		},

		html: {
			files: [
				'<%= sourceHTML %>/**/*.html', '!<%= sourceHTML %>/_layouts/**/*.html', '!<%= sourceHTML %>/_partials/**/*.html'
			],
			tasks: ['newer:handlebarslayouts:dev']
		},
		htmlIncludes: {
			files: [
				'<%= sourceHTML %>/_layouts/**/*.html', '<%= sourceHTML %>/_partials/**/*.html'
			],
			tasks: ['handlebarslayouts:dev']
		},
		htmlContext: {
			files: ['<%= sourceHTML %>/_context/*.json'],
			tasks: ['handlebarslayouts:dev']
		},

		styles: {
			files: ['<%= sourceStyles %>/**/*.scss'],
			tasks: ['sass:dev', 'autoprefixer:dev']
		},

		scripts: {
			files: ['<%= sourceScripts %>/**/*.js'],
			tasks: ['newer:jshint', 'browserify:dev']
		},

		templates: {
			files: ['<%= sourceTemplates %>/**/*.hbs'],
			tasks: ['browserify:dev']
		},

		images: {
			files: ['<%= sourceImages %>/**/*.*'],
			tasks: ['newer:copy:images']
		}

	};

};