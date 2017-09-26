/*
	TITLE: ModalSubclass

	DESCRIPTION: Subclass example of ModalWindow

	VERSION: 0.1.0

	USAGE: let myModalSubclass = new ModalSubclass('Elements', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: Chris Nelson <cnelson87@gmail.com>

	DEPENDENCIES:
		- jquery 3.x
		- ModalWindow.js

*/

import ModalWindow from 'widgets/ModalWindow';

class ModalSubclass extends ModalWindow {

	initialize($triggers, options) {

		let subclassOptions = Object.assign({
			customEventName: 'ModalSubclass'
		}, options);

		super.initialize($triggers, subclassOptions);

	}


/**
*	Private Methods
**/

	initDOM() {
		super.initDOM();
		// call super & customize initDOM method
	}


/**
*	Public Methods
**/

	getContent() {
		// customize getContent method
	}

}

export default ModalSubclass;
