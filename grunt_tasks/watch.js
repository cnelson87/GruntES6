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
			files: ['<%= sourceHTML %>/**/*.html', '!<%= sourceHTML %>/_layouts/**/*.html', '!<%= sourceHTML %>/_partials/**/*.html'],
			tasks: ['newer:lintspaces', 'newer:handlebarslayouts:dev']
		},
		htmlIncludes: {
			files: ['<%= sourceHTML %>/_layouts/**/*.html', '<%= sourceHTML %>/_partials/**/*.html'],
			tasks: ['newer:lintspaces', 'handlebarslayouts:dev']
		},
		htmlContext: {
			files: ['<%= sourceHTML %>/_context/*.json'],
			tasks: ['handlebarslayouts:dev']
		},

		styles: {
			files: ['<%= sourceStyles %>/**/*.scss'],
			tasks: ['newer:sasslint:dev', 'sass:dev', 'postcss:dev']
		},

		scripts: {
			files: ['<%= sourceScripts %>/**/*.js'],
			tasks: ['newer:eslint', 'browserify:dev']
		},

		templates: {
			files: ['<%= sourceTemplates %>/**/*.hbs', '<%= sourceScripts %>/**/*.hbs'],
			tasks: ['browserify:dev']
		},

		assets: {
			files: ['<%= sourceAssets %>/**/*.*'],
			tasks: ['newer:copy:assets']
		}

	};

};
