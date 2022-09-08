/**
 * concat
 * Concatenate files.
 */

module.exports = function (grunt) {

	// list all vendor libs
	var vendorLibs = [
		'<%= sourceVendor %>/jquery.min.js',
		'<%= sourceVendor %>/jquery-ui.custom.min.js',
		'<%= sourceVendor %>/jquery.touchSwipe.min.js',
		'<%= sourceVendor %>/jquery.easing.min.js',
		'<%= sourceVendor %>/validation/jquery.validate.min.js',
		'<%= sourceVendor %>/validation/additional-methods.min.js',
		'<%= sourceVendor %>/nouislider.min.js',
		'<%= sourceVendor %>/gsap/gsap.min.js',
		// '<%= sourceVendor %>/gsap/Draggable.min.js',
		// '<%= sourceVendor %>/gsap/ScrollToPlugin.min.js',
		'<%= sourceVendor %>/gsap/ScrollTrigger.min.js',
		'<%= sourceVendor %>/moment.min.js',
		'<%= sourceVendor %>/underscore-umd.min.js'
	];

	return {

		options: {
			separator: '\n\n'
		},

		dev: {
			src: vendorLibs,
			dest: '<%= devScripts %>/vendor.js'
		},

		prod: {
			src: vendorLibs,
			dest: '<%= prodScripts %>/vendor.js'
		}

	};

};
