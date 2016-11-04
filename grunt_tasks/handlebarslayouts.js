/**
 * handlebarslayouts
 * Handlebars task to render Handlebars templates to HTML
 */

module.exports = function (grunt) {

	// list all pages here
	var pages = [
		'ajax-content/ajax-content-1',
		'ajax-content/ajax-content-2',
		'index',
		'flexbox',
		'grids',
		// 'mask',
		'promise',
		'videos',
		'carousel',
		'tabcarousel',
		'infinitecarousel',
		'miniaccordion',
		'accordion',
		'tabswitcher',
		'horizordion',
		'modals',
		'test'
	];

	// populate files objects
	var devFiles = {};
	var distFiles = {};
	pages.forEach(function(page) {
		var sourcePage = '<%= sourceHTML %>/' + page + '.html';
		devFiles['<%= localPath %>/' + page + '.html'] = sourcePage;
		distFiles['<%= publicPath %>/' + page + '.html'] = sourcePage;
	});

	return {

		options: {
			basePath: '<%= sourceHTML %>',
			partials: [
				'<%= sourceHTML %>/_layouts/**/*.html',
				'<%= sourceHTML %>/_partials/**/*.html'
			],
			modules: ['<%= sourceHTML %>/_helpers/**/*.js'],
			context: '<%= sourceHTML %>/_context/data.json'
		},

		dev: {
			files: devFiles
		},

		dist: {
			files: distFiles
		}

	};

};