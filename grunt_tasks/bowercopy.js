/**
 * bowercopy
 * Scrupulously manage file locations for bower dependencies.
 */

module.exports = function (grunt) {

	return {

		'font-awesome': {
			files: {
				'<%= sourceFonts %>/': 'font-awesome/fonts/*.*',
				'<%= sourceStyles %>/vendor/font-awesome.scss': 'font-awesome/css/font-awesome.css'
			}
		}

	};

};