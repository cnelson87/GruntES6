/**
 * copy
 * Copy files and folders.
 */

module.exports = function (grunt) {

	return {

		data: {
			// JSON Data
			files: [{
				cwd: '<%= sourceData %>',
				src: '**/*.json',
				dest: '<%= localData %>',
				expand: true
			}]
		},

		assets: {
			// images, fonts, videos...
			files: [{
				cwd: '<%= sourceAssets %>',
				src: '**/*.*',
				dest: '<%= localAssets %>',
				expand: true
			}]
		},

		dev: {
			files: [{
				cwd: '<%= sourceData %>',
				src: '**/*.json',
				dest: '<%= localData %>',
				expand: true
			},{
				cwd: '<%= sourceAssets %>',
				src: '**/*.*',
				dest: '<%= localAssets %>',
				expand: true
			}]
		},

		dist: {
			files: [{
				cwd: '<%= sourceData %>',
				src: '**/*.json',
				dest: '<%= publicData %>',
				expand: true
			},{
				cwd: '<%= sourceAssets %>',
				src: '**/*.*',
				dest: '<%= publicAssets %>',
				expand: true
			}]
		}

	};

};