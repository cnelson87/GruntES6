/*
	TITLE: ModalWindow

	DESCRIPTION: Base class to create modal windows

	VERSION: 0.3.0

	USAGE: let myModalWindow = new ModalWindow('Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: Chris Nelson <cnelson87@gmail.com>

	DEPENDENCIES:
		- jquery 3.x

*/

import AppConfig from 'config/AppConfig';
import modalTemplate from 'templates/ModalTemplate.hbs';

class ModalWindow {

	constructor(options = {}) {
		this.$window = $(window);
		this.$document = $(document);
		this.$body = $('body');
		this.initialize(options);
	}

	initialize(options) {

		// defaults
		this.options = Object.assign({
			selectorTriggers: 'a.modal-trigger[data-targetID]',
			templateModal: modalTemplate(), //.hbs files return a function which returns html
			templateOverlay: '<div class="modal-overlay"></div>',
			selectorContent: '.modalwindow--content', //must match content element in template
			selectorCloseBtn: '.closeX', //must match close button in template
			selectorCloseLinks: '.close-modal', //close links within content
			activeClass: 'is-active',
			activeBodyClass: 'modal-active',
			animDuration: AppConfig.timing.standard,
			selectorContentEls: AppConfig.contentElements,
			customEventPrefix: 'ModalWindow'
		}, options);

		// element references
		this.$activeTrigger = null;
		this.$overlay = null;
		this.$modal = null;
		this.$content = null;
		this.$closeBtn = null;

		// setup & properties
		this.isModalActivated = false;
		this.contentHTML = null;
		this.windowScrollTop = 0;

		this.initDOM();

		this._addEventListeners();

	}


/**
*	Private Methods
**/

	initDOM() {

		// create overlay from template
		this.$overlay = $(this.options.templateOverlay);
		this.$overlay.attr({'tabindex':'0'});

		// create modal from template
		this.$modal = $(this.options.templateModal);
		this.$modal.attr({'aria-live':'polite', 'role':'dialog'});

		// set modal content
		this.$content = this.$modal.find(this.options.selectorContent);
		this.$content.attr({'role':'document'});

		// set close button
		this.$closeBtn = this.$modal.find(this.options.selectorCloseBtn);

	}

	_addEventListeners() {
		let { keys } = AppConfig;

		this.$body.on('click', this.options.selectorTriggers, (event) => {
			event.preventDefault();
			if (!this.isModalActivated) {
				this.$activeTrigger = $(event.currentTarget);
				this.openModal();
			}
		});

		this.$closeBtn.on('click', (event) => {
			event.preventDefault();
			if (this.isModalActivated) {
				this.closeModal();
			}
		});

		this.$content.on('click', this.options.selectorCloseLinks, (event) => {
			event.preventDefault();
			if (this.isModalActivated) {
				this.closeModal();
			}
		});

		this.$overlay.on('click', (event) => {
			if (this.isModalActivated) {
				this.closeModal();
			}
		});

		this.$document.on('focusin', (event) => {
			if (this.isModalActivated && !this.$modal[0].contains(event.target)) {
				this.setContentFocus();
			}
		});

		this.$overlay.on('focus', (event) => {
			if (this.isModalActivated) {
				this.setContentFocus();
			}
		});

		this.$document.on('keydown', (event) => {
			if (this.isModalActivated && event.keyCode === keys.escape) {
				this.closeModal();
			}
		});

		this.$document.on('scroll', (event) => {
			if (this.isModalActivated) {
				this.$window.scrollTop(this.windowScrollTop);
			}
		});

		this.$window.on('orientationchange', (event) => {
			if (this.isModalActivated) {
				this.$window.scrollTop(this.windowScrollTop);
			}
		});

	}


/**
*	Public Methods
**/

	// extend or override getContent and setContent methods
	// in subclass to create custom modal
	getContent() {
		let targetID = this.$activeTrigger.data('targetid');
		let targetEl = $(`#${targetID}`);
		this.contentHTML = targetEl.html();
		this.setContent();
	}

	setContent() {
		this.$content.html(this.contentHTML);
	}

	openModal() {
		let delay = 10;

		this.isModalActivated = true;

		this.windowScrollTop = this.$window.scrollTop();

		this.getContent();

		this.$body.addClass(this.options.activeBodyClass);
		this.$overlay.appendTo(this.$body).show();
		this.$modal.insertBefore(this.$overlay).show();

		setTimeout(() => {

			this.$content.scrollTop(0);
			this.$overlay.addClass(this.options.activeClass);
			this.$modal.addClass(this.options.activeClass);

			$.event.trigger(`${this.options.customEventPrefix}:modalPreOpen`, [this.$modal]);

			setTimeout(() => {
				this.setContentFocus();
				$.event.trigger(`${this.options.customEventPrefix}:modalOpened`, [this.$modal]);
			}, this.options.animDuration);

		}, delay);

	}

	closeModal() {

		this.$body.removeClass(this.options.activeBodyClass);
		this.$overlay.removeClass(this.options.activeClass);
		this.$modal.removeClass(this.options.activeClass);

		this.$window.scrollTop(this.windowScrollTop);

		$.event.trigger(`${this.options.customEventPrefix}:modalPreClose`, [this.$modal]);

		setTimeout(() => {

			this.isModalActivated = false;
			this.$content.empty();
			this.$modal.hide().detach();
			this.$overlay.hide().detach();
			this.$activeTrigger.focus();
			$.event.trigger(`${this.options.customEventPrefix}:modalClosed`, [this.$modal]);

		}, this.options.animDuration);

	}

	setContentFocus() {
		let $focusEl = this.$content.find(this.options.selectorContentEls).first();
		$focusEl.attr({'tabindex':'-1'}).focus();
	}

}

export default ModalWindow;
