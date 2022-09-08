/**
 * watch
 * Run predefined tasks whenever watched file patterns are added, changed or deleted.
 */

module.exports = function (grunt) {

	return {

		options: {
			livereload: '<%= livereloadPort %>',
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
			tasks: ['stylelint', 'sass:dev', 'postcss:dev']
		},

		scripts: {
			files: ['<%= sourceScripts %>/**/*.js'],
			tasks: ['eslint', 'browserify:dev']
		},

		templates: {
			files: ['<%= sourceScripts %>/**/*.hbs'],
			tasks: ['browserify:dev']
		},

		assets: {
			files: ['<%= sourceAssets %>/**/*.*'],
			tasks: ['newer:copy:assets']
		}

	};

};
