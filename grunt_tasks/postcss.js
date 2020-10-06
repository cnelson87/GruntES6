/**
 * postcss
 * Apply several post-processors to your CSS using PostCSS.
 */

module.exports = function (grunt) {

	// list all plugins
	var plugins = [
		require('autoprefixer')()
	];

	return {

		dev: {
			options: {
				processors: plugins,
				map: true
			},
			files: [{
				src: '<%= devStyles %>/<%= appName %>.css',
				dest: '<%= devStyles %>/<%= appName %>.css'
			}]
		},

		prod: {
			options: {
				processors: plugins,
				map: false
			},
			files: [{
				src: '<%= prodStyles %>/<%= appName %>.css',
				dest: '<%= prodStyles %>/<%= appName %>.css'
			}]
		}

	};

};
