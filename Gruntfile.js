module.exports = function(grunt) {

	var path = require('path');
	var cwd = process.cwd();
	var pkg = grunt.file.readJSON('package.json');

	/**
	 * Grunt init
	 */
	require('load-grunt-config')(grunt, {

		configPath: path.join(cwd,'grunt_tasks'),
		init: true,

		data: {
			// Pkg data
			pkg: pkg,
			appName: pkg.appName,
			portNum: pkg.portNumber,
			livereloadPort: pkg.livereloadPort,

			// source file paths
			sourcePath      : './src',
			sourceAssets    : '<%= sourcePath %>/assets',
			sourceHTML      : '<%= sourcePath %>/html',
			sourceAudio     : '<%= sourceAssets %>/audio',
			sourceVideo     : '<%= sourceAssets %>/video',
			sourceFonts     : '<%= sourceAssets %>/fonts',
			sourceImages    : '<%= sourceAssets %>/images',
			sourceData      : '<%= sourcePath %>/data',
			sourceScripts   : '<%= sourcePath %>/scripts',
			sourceStyles    : '<%= sourcePath %>/styles',
			sourceTemplates : '<%= sourcePath %>/templates',
			sourceVendor    : '<%= sourcePath %>/vendor',
			nodeModules     : './node_modules',

			// dev file paths
			devPath       : './_builds/dev',
			devAssets     : '<%= devPath %>/_assets',
			devAudio      : '<%= devAssets %>/audio',
			devVideo      : '<%= devAssets %>/video',
			devFonts      : '<%= devAssets %>/fonts',
			devImages     : '<%= devAssets %>/images',
			devData       : '<%= devAssets %>/data',
			devScripts    : '<%= devAssets %>/scripts',
			devStyles     : '<%= devAssets %>/styles',

			// prod file paths
			prodPath      : './_builds/prod',
			prodAssets    : '<%= prodPath %>/_assets',
			prodAudio     : '<%= prodAssets %>/audio',
			prodVideo     : '<%= prodAssets %>/video',
			prodFonts     : '<%= prodAssets %>/fonts',
			prodImages    : '<%= prodAssets %>/images',
			prodData      : '<%= prodAssets %>/data',
			prodScripts   : '<%= prodAssets %>/scripts',
			prodStyles    : '<%= prodAssets %>/styles',

			// temp file paths (not currently used)
			tempPath        : './_builds/temp'

		},

		loadGruntTasks: {
			pattern: 'grunt-*',
			config: require('./package.json'),
			scope: 'devDependencies'
		}

	});

	/**
	 * Compile a prod build for deployment
	 */
	grunt.loadNpmTasks('@lodder/grunt-postcss');
	grunt.registerTask('build', 'generate a build', function(env) {
		var env = (env === 'dev') ? 'dev' : 'prod';
		var tasks = [
			// 'clean:temp',
			'clean:' + env,
			'lintspaces',
			'handlebarslayouts:' + env,
			'copy:' + env,
			'sasslint:' + env,
			'sass:' + env,
			'postcss:' + env,
			'eslint',
			'concat:' + env,
			'browserify:' + env
		];
		// optimize for prod build only
		if (env === 'prod') {
			tasks.push('htmlmin:prod');
			tasks.push('cssmin:prod');
			tasks.push('uglify:prod');
		}
		grunt.task.run(tasks);
	});

	/**
	 * Compile a dev build and start a static server from the 'dev' directory
	 */
	grunt.registerTask('run', ['build:dev', 'connect', 'watch']);

};
