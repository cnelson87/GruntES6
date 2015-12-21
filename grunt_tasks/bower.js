
/**
 * bower
 * Copy bower installed components to dist folder.
 */

module.exports = function (grunt) {

	return {

		install: {
			options: {
				stripJsAffix: true,
				keepExpandedHierarchy: false,
				expand: false,
				packageSpecific: {
					greensock: {
						dest: '<%= vendorPath %>/greensock',
						files: [
							'src/minified/TweenMax.min.js',
							'src/minified/plugins/ScrollToPlugin.min.js'
						]
					},
					ScrollMagic: {
						dest: '<%= vendorPath %>/scrollmagic',
						files: [
							'scrollmagic/minified/ScrollMagic.min.js',
							'scrollmagic/minified/plugins/jquery.ScrollMagic.min.js',
							'scrollmagic/minified/plugins/animation.gsap.min.js',
							'scrollmagic/minified/plugins/debug.addIndicators.min.js'
						]
					}
				}
			},
			dest: '<%= sourceVendor %>'
		}

	};

};