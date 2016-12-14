/**
 * bower
 * Copy bower installed components to dist folder.
 */

module.exports = function (grunt) {

	return {

		install: {

			dest: '<%= sourceVendor %>',
			css_dest: '<%= sourceStyles %>',
			scss_dest: '<%= sourceStyles %>',
			fonts_dest: '<%= sourceFonts %>',
			images_dest: '<%= sourceImages %>',

			options: {
				stripJsAffix: true,
				keepExpandedHierarchy: false,
				expand: false,

				//use 'bowercopy' task for copying specific files for the following components:
				ignorePackages: [
					'font-awesome'
				],

				packageSpecific: {
					greensock: {
						dest: '<%= sourceVendor %>/greensock',
						files: [
							'src/minified/TweenMax.min.js',
							'src/minified/plugins/ScrollToPlugin.min.js',
							'src/minified/utils/Draggable.min.js'
						]
					},
					ScrollMagic: {
						dest: '<%= sourceVendor %>/scrollmagic',
						files: [
							'scrollmagic/minified/ScrollMagic.min.js',
							'scrollmagic/minified/plugins/jquery.ScrollMagic.min.js',
							'scrollmagic/minified/plugins/animation.gsap.min.js',
							'scrollmagic/minified/plugins/debug.addIndicators.min.js'
						]
					}
				}

			}

		}

	};

};