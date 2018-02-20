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
				dest: '<%= localData %>'
			}]
		},

		assets: {
			// images, fonts, videos...
			files: [{
				expand: true,
				cwd: '<%= sourceAssets %>',
				src: '**/*.*',
				dest: '<%= localAssets %>'
			}]
		},

		dev: {
			files: [{
				expand: true,
				cwd: '<%= sourceData %>',
				src: '**/*.json',
				dest: '<%= localData %>'
			},{
				expand: true,
				cwd: '<%= sourceAssets %>',
				src: '**/*.*',
				dest: '<%= localAssets %>'
			}]
		},

		dist: {
			files: [{
				expand: true,
				cwd: '<%= sourceData %>',
				src: '**/*.json',
				dest: '<%= publicData %>'
			},{
				expand: true,
				cwd: '<%= sourceAssets %>',
				src: '**/*.*',
				dest: '<%= publicAssets %>'
			}]
		}

	};

};
