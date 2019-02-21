/**
 * concat
 * Concatenate files.
 */

module.exports = function (grunt) {

	// list all vendor libs
	var vendorLibs = [
		// '<%= sourceVendor %>/modernizr.custom.min.js',
		'<%= sourceVendor %>/jquery.min.js',
		'<%= sourceVendor %>/jquery-ui.custom.min.js',
		'<%= sourceVendor %>/jquery.touchSwipe.min.js',
		'<%= sourceVendor %>/picturefill.min.js',
		'<%= sourceVendor %>/nouislider.min.js',
		'<%= sourceVendor %>/greensock/TweenMax.min.js',
		'<%= sourceVendor %>/greensock/ScrollToPlugin.min.js',
		'<%= sourceVendor %>/greensock/Draggable.min.js',
		'<%= sourceVendor %>/greensock/jquery.gsap.min.js',
		'<%= sourceVendor %>/scrollmagic/ScrollMagic.min.js',
		'<%= sourceVendor %>/scrollmagic/jquery.ScrollMagic.min.js',
		'<%= sourceVendor %>/scrollmagic/animation.gsap.min.js',
		'<%= sourceVendor %>/scrollmagic/debug.addIndicators.min.js',
		'<%= sourceVendor %>/validation/jquery.validate.min.js',
		'<%= sourceVendor %>/validation/additional-methods.min.js',
		'<%= sourceVendor %>/moment.min.js',
		'<%= sourceVendor %>/moment-timezone-with-data-2012-2022.min.js',
		'<%= sourceVendor %>/underscore.min.js'
	];

	return {

		options: {
			separator: '\n\n'
		},

		dev: {
			src: vendorLibs,
			dest: '<%= localScripts %>/vendor.js'
		},

		dist: {
			src: vendorLibs,
			dest: '<%= publicScripts %>/vendor.js'
		}

	};

};
