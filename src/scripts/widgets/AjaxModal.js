/*
	TITLE: AjaxModal

	DESCRIPTION: Subclass of ModalWindow retrieves & injects Ajax content

	VERSION: 0.2.8

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

	initialize($triggers, options) {

		let subOptions = Object.assign({
			ajaxErrorMsg: '<div class="errormessage"><p>Sorry. Ajax request failed.</p></div>',
			customEventName: 'AjaxModal'
		}, options);

		// setup & properties
		this.ajaxLoader = null;

		super.initialize($triggers, subOptions);

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

		Promise.resolve(ajaxGet(ajaxUrl, 'html'))
			.then((response) => {
				// console.log(response);

				if (targetID) {
					targetEl = $(response).find('#' + targetID);
					if (targetEl.length) {
						this.contentHTML = $(response).find('#' + targetID).html();
					} else {
						this.contentHTML = $(response).html();
					}
					
				} else {
					this.contentHTML = response;
				}

				// add delay to showcase loader-spinner
				setTimeout(() => {
					this.ajaxLoader.removeLoader();
					this.setContent();
				}, 400);

			})
			.catch((response) => {
				// console.log(response);
				this.contentHTML = null;
				this.ajaxLoader.removeLoader();
				this.$content.html(this.options.ajaxErrorMsg);
			});

	}

}

export default AjaxModal;
