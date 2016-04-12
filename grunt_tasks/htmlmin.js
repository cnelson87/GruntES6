/**
 * htmlmin
 * Minify HTML
 */

module.exports = function (grunt) {

	return {

		options: {
			removeComments: true,
			removeCommentsFromCDATA: true,
			collapseWhitespace: true,
			conservativeCollapse: true,
			collapseInlineTagWhitespace: false,
			preserveLineBreaks: true,
			collapseBooleanAttributes: true,
			removeOptionalTags: false,
			removeEmptyElements: false,
			keepClosingSlash: true
		},

		dist: {
			files: [{
				cwd: '<%= publicPath %>',
				src: '**/*.html',
				dest: '<%= publicPath %>',
				expand: true
			}]
		}

	};

};