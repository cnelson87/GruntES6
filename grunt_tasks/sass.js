/**
 * sass
 * Compile Sass to CSS using node-sass
 */

module.exports = function (grunt) {

	return {

		dev: {
			options: {
				sourceComments: true,
				sourceMap: true,
				sourceMapContents: true,
				outputStyle: 'expanded'
			},
			files: [{
				src: '<%= sourceStyles %>/app.scss',
				dest: '<%= localStyles %>/<%= assetName %>.css'
			}]
		},

		dist: {
			options: {
				sourceComments: false,
				sourceMap: false,
				sourceMapContents: false,
				outputStyle: 'compressed'
			},
			files: [{
				src: '<%= sourceStyles %>/app.scss',
				dest: '<%= publicStyles %>/<%= assetName %>.css'
			}]
		}

	};

};