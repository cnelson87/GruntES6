/*
	TITLE: AjaxModal

	DESCRIPTION: Subclass of ModalWindow retrieves & injects Ajax content

	VERSION: 0.2.2

	USAGE: var myAjaxModal = new AjaxModal('Elements', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: Chris Nelson <cnelson87@gmail.com>

	DEPENDENCIES:
		- jquery 2.1x+
		- ModalWindow.js
		- LoaderSpinner.js

*/

import ModalWindow from 'widgets/ModalWindow';
import LoaderSpinner from 'widgets/LoaderSpinner';

class AjaxModal extends ModalWindow {

	// unnecessary to declare a constructor method,
	// subclass will inherit constructor from super.
	// constructor($triggers, objOptions) {
	// 	super($triggers, objOptions);
	// }

	initialize($triggers, objOptions) {

		var options = $.extend({
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
		var self = this;
		var ajaxUrl = this.$activeTrigger.data('ajaxurl') || this.$activeTrigger.attr('href');
		var targetID = ajaxUrl.split('#')[1] || false;
		var targetEl;

		this.ajaxLoader.addLoader();

		$.when(this.ajaxGET(ajaxUrl, 'html'))
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

	// returns an Ajax GET request using deferred, url is required, dataType is optional
	ajaxGET(url, dataType) {
		return $.ajax({
			type: 'GET',
			url: url,
			dataType: dataType || 'json'
		});
	}

}

export default AjaxModal;
