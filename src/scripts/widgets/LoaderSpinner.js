/*
	TITLE: LoaderSpinner

	DESCRIPTION: Universal Ajax loader & spinner overlay

	VERSION: 0.2.2

	USAGE: var myLoaderSpinner = new LoaderSpinner('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: Chris Nelson <cnelson87@gmail.com>

	DEPENDENCIES:
		- jquery 2.2x+

*/

class LoaderSpinner {
	constructor($el, objOptions) {
		this.$el = $el;
		this.options = $.extend({
			overlayTemplate: '<div class="loader-spinner-overlay"></div>'
		}, objOptions || {});
		this.$elOverlay = $(this.options.overlayTemplate);
	}
	addLoader() {
		this.$el.append(this.$elOverlay);
		setTimeout(function() {
			this.$elOverlay.click(); //spinner gif gets 'stuck' and needs a click
		}.bind(this), 10);
	}
	removeLoader() {
		this.$elOverlay.remove();
	}
}

export default LoaderSpinner;
