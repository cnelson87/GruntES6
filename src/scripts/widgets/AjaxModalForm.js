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
// import serializeFormFields from 'utilities/serializeFormFields';
import ajaxPost from 'utilities/ajaxPost';

class AjaxModalForm extends AjaxModal {

	initialize(options) {

		let subclassOptions = Object.assign({
			selectorTriggers: 'a#modal-form-trigger[data-ajaxUrl]',
			customEventPrefix: 'AjaxModalForm'
		}, options);

		// element references
		this.$form = null;

		super.initialize(subclassOptions);

	}

	setContent() {
		super.setContent();
		console.log('AjaxModalForm:setContent');
		this.$form = this.$content.find('form');
		this.$form.on('submit', this.onFormPost.bind(this));
		console.log(this.$form.prop('tagName'));
	}

	onFormPost(event) {
		event.preventDefault();
		let postUrl = this.$form.attr('action');
		// let data = serializeFormFields(this.$form);
		let data = this.$form.serialize()
		// console.log(data);

		Promise.resolve(ajaxPost(postUrl, data)).then((response) => {
			// console.log('success', response);
		}).catch((response) => {
			// console.log('error', response);
		});

	}

	closeModal() {
		this.$form.off('submit');
		this.$form = null;
		super.closeModal();
	}

}

export default AjaxModalForm;
