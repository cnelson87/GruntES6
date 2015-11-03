
/**
 * concat
 * Concatenate files.
 */

module.exports = function (grunt) {

	// list all vendor libs
	var vendorLibs = [
		'<%= sourceVendor %>/modernizr.custom.min.js',
		'<%= sourceVendor %>/jquery.min.js',
		'<%= sourceVendor %>/jquery.touchSwipe.min.js',
		'<%= sourceVendor %>/picturefill.min.js',
		'<%= sourceVendor %>/TweenMax.min.js',
		'<%= sourceVendor %>/underscore-min.js',
		'<%= sourceVendor %>/backbone-min.js',
		'<%= sourceVendor %>/backbone-super-min.js'
	];

	return {

		options: {
			separator: '\n\n'
		},

		devlibs: {
			src: vendorLibs,
			dest: '<%= localScripts %>/vendor.js'
		},

		distlibs: {
			src: vendorLibs,
			dest: '<%= publicScripts %>/vendor.js'
		}

	};

};