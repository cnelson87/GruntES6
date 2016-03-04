/**
 * sass
 * Compile Sass to CSS
 */

module.exports = function (grunt) {

	return {

		dev: {
			options: {
				sourcemap: 'auto',
				style: 'expanded',
				debug: true,
				trace: true
			},
			files: [{
				src: '<%= sourceStyles %>/app.scss',
				dest: '<%= localStyles %>/<%= assetName %>.css'
			}]
		},

		dist: {
			options: {
				sourcemap: 'none',
				style: 'expanded',
				debug: false,
				trace: false
			},
			files: [{
				src: '<%= sourceStyles %>/app.scss',
				dest: '<%= publicStyles %>/<%= assetName %>.css'
			}]
		}

	};

};