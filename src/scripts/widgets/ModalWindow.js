/*
	TITLE: ModalWindow

	DESCRIPTION: Base class to create modal windows

	VERSION: 0.2.9

	USAGE: let myModalWindow = new ModalWindow('Elements', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: Chris Nelson <cnelson87@gmail.com>

	DEPENDENCIES:
		- jquery 3.1.1+

*/

class ModalWindow {

	constructor($triggers, options = {}) {
		this.$window = $(window);
		this.$document = $(document);
		this.$body = $('body');
		this.initialize($triggers, options);
	}

	initialize($triggers, options) {

		// defaults
		this.$triggers = $triggers;
		this.options = Object.assign({
			//selectorTriggers: 'a.modal-trigger',
			modalID: 'modalwindow',
			modalClass: 'modalwindow',
			extraClasses: '',
			overlayID: 'modaloverlay',
			overlayClass: 'modaloverlay',
			closeBtnClass: 'closeX',
			closeBtnText: 'close modal dialog',
			activeClass: 'is-active',
			activeBodyClass: 'modal-active',
			contentCloseTrigger: '.close-modal',
			animDuration: 400,
			selectorContentEls: 'h2, h3, h4, h5, h6, p, ul, ol, dl',
			customEventName: 'ModalWindow'
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

		//create overlay
		this.$overlay = $('#' + this.options.overlayID);
		if (!this.$overlay.length) {
			this.$overlay = $(`<div id="${this.options.overlayID}" class="${this.options.overlayClass}"></div>`).appendTo(this.$body);
		}

		//create modal
		this.$modal = $('#' + this.options.modalID);
		if (!this.$modal.length) {
			this.$modal = $('<div></div>', {
				'id': this.options.modalID,
				'class': this.options.modalClass + ' ' + this.options.extraClasses,
				'aria-hidden': 'true',
				'aria-live': 'polite',
				'role': 'dialog'
			});
		}

		//create modal content
		this.$content = this.$modal.find('.' + this.options.modalClass + '--content');
		if (!this.$content.length) {
			this.$content = $('<div></div>', {
				'class': this.options.modalClass + '--content',
				'role': 'document'
			}).appendTo(this.$modal);
		}

		//insert close button
		this.$closeBtn = this.$modal.find('.' + this.options.closeBtnClass);
		if (!this.$closeBtn.length) {
			this.$closeBtn = $('<a></a>', {
				'class': this.options.closeBtnClass,
				'href': '#close'
			}).html('<span>' + this.options.closeBtnText + '</span>').appendTo(this.$modal);
		}

		//insert into DOM
		this.$modal.insertAfter(this.$overlay);

	}

	_addEventListeners() {
		const escKey = 27;

		this.$triggers.on('click', (event) => {
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

		this.$content.on('click', this.options.contentCloseTrigger, (event) => {
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

		this.$document.on('keydown', (event) => {
			if (this.isModalActivated && event.keyCode === escKey) {
				this.closeModal();
			}
		});

	}


/**
*	Public Methods
**/

	// extend or override getContent in subclass to create custom modal
	getContent() {
		let targetID = this.$activeTrigger.data('targetid') || this.$activeTrigger.attr('href').replace('#','');
		let targetEl = $('#' + targetID);
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

		this.$body.addClass(this.options.activeBodyClass).css({top: this.windowScrollTop * -1});
		this.$overlay.show();
		this.$modal.show();

		setTimeout(() => {

			this.$overlay.addClass(this.options.activeClass);
			this.$modal.addClass(this.options.activeClass).attr({'aria-hidden':'false'});

			setTimeout(() => {
				this.setContentFocus();
				$.event.trigger(`${this.options.customEventName}:modalOpened`, [this.$modal]);
			}, this.options.animDuration);

		}, delay);

	}

	closeModal() {

		this.$body.removeClass(this.options.activeBodyClass).css({top: ''});
		this.$overlay.removeClass(this.options.activeClass);
		this.$modal.removeClass(this.options.activeClass).attr({'aria-hidden':'true'});

		this.$window.scrollTop(this.windowScrollTop);

		setTimeout(() => {

			this.isModalActivated = false;
			this.$overlay.hide();
			this.$modal.hide();
			this.$content.empty();
			this.$activeTrigger.focus();
			$.event.trigger(`${this.options.customEventName}:modalClosed`, [this.$modal]);

		}, this.options.animDuration);

	}

	setContentFocus() {
		this.$content.find(this.options.selectorContentEls).first().attr({'tabindex':'-1'}).focus();
	}

}

export default ModalWindow;
