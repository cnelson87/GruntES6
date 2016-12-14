module.exports = function(grunt) {

	'use strict';

	var path = require('path');
	var cwd = process.cwd();
	var pkg = grunt.file.readJSON('package.json');

	/**
	 * GRUNT INIT
	 */
	require('load-grunt-config')(grunt, {

		configPath: path.join(cwd,'grunt_tasks'),
		init: true, //auto grunt.initConfig

		data: {
			// Pkg data
			pkg			: pkg,
			pkgName		: pkg.name,
			metaTitle	: pkg.title,
			pkgDesc		: pkg.description,
			assetName	: pkg.namespace,
			portNum		: pkg.portNumber,
			lrPortNum	: pkg.livereloadPortNum,

			// source file paths
			sourcePath			: './src',
			sourceAssets		: '<%= sourcePath %>/assets',
			sourceData			: '<%= sourcePath %>/api',
			sourceHTML			: '<%= sourcePath %>/html',
			sourceAudio			: '<%= sourceAssets %>/audio',
			sourceVideo			: '<%= sourceAssets %>/video',
			sourceFonts			: '<%= sourceAssets %>/fonts',
			sourceImages		: '<%= sourceAssets %>/images',
			sourceScripts		: '<%= sourcePath %>/scripts',
			sourceStyles		: '<%= sourcePath %>/styles',
			sourceTemplates		: '<%= sourcePath %>/templates',
			sourceVendor		: '<%= sourcePath %>/vendor',

			// local file paths
			localPath			: './_builds/local',
			localData			: '<%= localPath %>/_api',
			localAssets			: '<%= localPath %>/_assets',
			localAudio			: '<%= localAssets %>/audio',
			localVideo			: '<%= localAssets %>/video',
			localFonts			: '<%= localAssets %>/fonts',
			localImages			: '<%= localAssets %>/images',
			localScripts		: '<%= localAssets %>/scripts',
			localStyles			: '<%= localAssets %>/styles',

			// public file paths
			publicPath			: './_builds/public',
			publicData			: '<%= publicPath %>/_api',
			publicAssets		: '<%= publicPath %>/_assets',
			publicAudio			: '<%= publicAssets %>/audio',
			publicVideo			: '<%= publicAssets %>/video',
			publicFonts			: '<%= publicAssets %>/fonts',
			publicImages		: '<%= publicAssets %>/images',
			publicScripts		: '<%= publicAssets %>/scripts',
			publicStyles		: '<%= publicAssets %>/styles',

			// temp file paths (not currently used)
			tempPath			: './_builds/temp'

		},

		loadGruntTasks: {
			config: require('./package.json'),
			scope: 'devDependencies',
			pattern: 'grunt-*'
		}

	});

	/**
	 * Register Custom tasks
	 */
	grunt.registerTask('build', 'generate a build', function(target) {
		var target = (target === 'dev') ? 'dev' : 'dist';
		var tasks = [
			// Manually run bower task only when updating libs.
			// Vendor libs are checked-in to src, so no need 
			// to run bower task when building.
			// 'bower',
			// 'bowercopy',
			// 'clean:temp',
			'clean:' + target,
			'lintspaces',
			'handlebarslayouts:' + target,
			'copy:' + target,
			'scsslint:' + target,
			'sass:' + target,
			'autoprefixer:' + target,
			'eslint',
			'concat:' + target + 'libs',
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
	 * Create a dev build and start a static server from the 'local' directory
	 */
	grunt.registerTask('run', ['build:dev', 'connect', 'watch']);

};