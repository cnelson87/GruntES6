/*
	TITLE: AjaxModalForm

	DESCRIPTION: Subclass of AjaxModal also POSTs Ajax data

	VERSION: 0.1.0

	USAGE: let myAjaxModalForm = new AjaxModalForm('Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: Chris Nelson <cnelson87@gmail.com>

	DEPENDENCIES:
		- jquery 3.x
		- AjaxModal.js

*/

import AjaxModal from 'widgets/AjaxModal';

class AjaxModalForm extends AjaxModal {

	initialize(options) {

		let subclassOptions = Object.assign({
			selectorTriggers: 'a#modal-form-trigger[data-ajaxUrl]',
			customEventPrefix: 'AjaxModalForm'
		}, options);

		super.initialize(subclassOptions);

	}

	setContent() {
		super.setContent();
		// console.log('AjaxModalForm:setContent');
	}

}

export default AjaxModalForm;
