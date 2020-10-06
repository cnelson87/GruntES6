/**
 * copy
 * Copy files and folders.
 */

module.exports = function (grunt) {

	return {

		data: {
			// JSON Data
			files: [{
				expand: true,
				cwd: '<%= sourceData %>',
				src: '**/*.json',
				dest: '<%= devData %>'
			}]
		},

		assets: {
			// images, fonts, videos...
			files: [{
				expand: true,
				cwd: '<%= sourceAssets %>',
				src: '**/*.*',
				dest: '<%= devAssets %>'
			}]
		},

		dev: {
			files: [{
				expand: true,
				cwd: '<%= sourceData %>',
				src: '**/*.json',
				dest: '<%= devData %>'
			},{
				expand: true,
				cwd: '<%= sourceAssets %>',
				src: '**/*.*',
				dest: '<%= devAssets %>'
			}]
		},

		prod: {
			files: [{
				expand: true,
				cwd: '<%= sourceData %>',
				src: '**/*.json',
				dest: '<%= prodData %>'
			},{
				expand: true,
				cwd: '<%= sourceAssets %>',
				src: '**/*.*',
				dest: '<%= prodAssets %>'
			}]
		}

	};

};
