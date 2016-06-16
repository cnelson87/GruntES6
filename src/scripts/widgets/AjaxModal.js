/*
	TITLE: AjaxModal

	DESCRIPTION: Subclass of ModalWindow retrieves & injects Ajax content

	VERSION: 0.2.3

	USAGE: let myAjaxModal = new AjaxModal('Elements', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: Chris Nelson <cnelson87@gmail.com>

	DEPENDENCIES:
		- jquery 2.2x+
		- ModalWindow.js
		- LoaderSpinner.js
		- ajaxGet.js

*/

import ModalWindow from 'widgets/ModalWindow';
import LoaderSpinner from 'widgets/LoaderSpinner';
import ajaxGet from 'utilities/ajaxGet';

class AjaxModal extends ModalWindow {

	initialize($triggers, objOptions) {

		let options = $.extend({
			ajaxErrorMsg: '<div class="errormessage"><p>Sorry. Ajax request failed.</p></div>',
			customEventName: 'AjaxModal'
		}, objOptions || {});

		// setup & properties
		this.ajaxLoader = null;

		super.initialize($triggers, options);

	}


/**
*	Private Methods
**/

	initDOM() {
		super.initDOM();
		this.ajaxLoader = new LoaderSpinner(this.$modal);
	}


/**
*	Public Methods
**/

	getContent() {
		let self = this;
		let ajaxUrl = this.$activeTrigger.data('ajaxurl') || this.$activeTrigger.attr('href');
		let targetID = ajaxUrl.split('#')[1] || false;
		let targetEl;

		this.ajaxLoader.addLoader();

		$.when(ajaxGet(ajaxUrl, 'html'))
			.done(function(response) {
				//console.log(response);

				if (targetID) {
					targetEl = $(response).find('#' + targetID);
					if (targetEl.length) {
						self.contentHTML = $(response).find('#' + targetID).html();
					} else {
						self.contentHTML = $(response).html();
					}
					
				} else {
					self.contentHTML = response;
				}

				// add delay to showcase loader-spinner
				setTimeout(function() {
					self.ajaxLoader.removeLoader();
					self.setContent();
				}, 400);

			})
			.fail(function(response) {
				//console.log(response);
				self.contentHTML = null;
				self.ajaxLoader.removeLoader();
				self.$content.html(self.options.ajaxErrorMsg);
			});

	}

}

export default AjaxModal;
