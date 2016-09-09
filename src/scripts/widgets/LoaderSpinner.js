/*
	TITLE: LoaderSpinner

	DESCRIPTION: Universal Ajax loader & spinner overlay

	VERSION: 0.2.3

	USAGE: let myLoaderSpinner = new LoaderSpinner('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: Chris Nelson <cnelson87@gmail.com>

	DEPENDENCIES:
		- jquery 2.2x+

*/

class LoaderSpinner {

	constructor($el, options = {}) {
		this.initialize($el, options);
	}

	initialize($el, options) {

		this.$el = $el;
		this.options = $.extend({
			overlayTemplate: '<div class="loader-spinner-overlay"></div>'
		}, options);

		// element references
		this.$elOverlay = $(this.options.overlayTemplate);

	}

	addLoader() {
		this.$el.append(this.$elOverlay);
		setTimeout(() => {
			//spinner gif gets 'stuck' and needs a click
			this.$elOverlay.click();
		}, 10);
	}

	removeLoader() {
		this.$elOverlay.remove();
	}

}

export default LoaderSpinner;
