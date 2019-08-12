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
			pkg       : pkg,
			appName   : pkg.appName,
			portNum   : pkg.portNumber,
			lrPortNum : pkg.livereloadPortNum,

			// source file paths
			sourcePath      : './src',
			sourceAssets    : '<%= sourcePath %>/assets',
			sourceData      : '<%= sourcePath %>/data',
			sourceHTML      : '<%= sourcePath %>/html',
			sourceAudio     : '<%= sourceAssets %>/audio',
			sourceVideo     : '<%= sourceAssets %>/video',
			sourceFonts     : '<%= sourceAssets %>/fonts',
			sourceImages    : '<%= sourceAssets %>/images',
			sourceScripts   : '<%= sourcePath %>/scripts',
			sourceStyles    : '<%= sourcePath %>/styles',
			sourceTemplates : '<%= sourcePath %>/templates',
			sourceVendor    : '<%= sourcePath %>/vendor',
			nodeModules     : './node_modules',

			// local file paths
			localPath       : './_builds/local',
			localData       : '<%= localPath %>/_data',
			localAssets     : '<%= localPath %>/_assets',
			localAudio      : '<%= localAssets %>/audio',
			localVideo      : '<%= localAssets %>/video',
			localFonts      : '<%= localAssets %>/fonts',
			localImages     : '<%= localAssets %>/images',
			localScripts    : '<%= localAssets %>/scripts',
			localStyles     : '<%= localAssets %>/styles',

			// public file paths
			publicPath      : './_builds/public',
			publicData      : '<%= publicPath %>/_data',
			publicAssets    : '<%= publicPath %>/_assets',
			publicAudio     : '<%= publicAssets %>/audio',
			publicVideo     : '<%= publicAssets %>/video',
			publicFonts     : '<%= publicAssets %>/fonts',
			publicImages    : '<%= publicAssets %>/images',
			publicScripts   : '<%= publicAssets %>/scripts',
			publicStyles    : '<%= publicAssets %>/styles',

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
	 * Compile a dist build for deployment
	 */
	grunt.registerTask('build', 'generate a build', function(target) {
		var target = (target === 'dev') ? 'dev' : 'dist';
		var tasks = [
			// 'clean:temp',
			'clean:' + target,
			'lintspaces',
			'handlebarslayouts:' + target,
			'copy:' + target,
			'sasslint:' + target,
			'sass:' + target,
			'postcss:' + target,
			'eslint',
			'concat:' + target,
			'browserify:' + target
		];
		// optimize for dist build only
		if (target === 'dist') {
			tasks.push('htmlmin:dist');
			tasks.push('cssmin:dist');
			tasks.push('uglify:dist');
		}
		grunt.task.run(tasks);
	});

	/**
	 * Compile a dev build and start a static server from the 'local' directory
	 */
	grunt.registerTask('run', ['build:dev', 'connect', 'watch']);

};
