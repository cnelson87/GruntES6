/*
	TITLE: ModalWindow

	DESCRIPTION: Base class to create modal windows

	VERSION: 0.2.2

	USAGE: var myModalWindow = new ModalWindow('Elements', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: Chris Nelson <cnelson87@gmail.com>

	DEPENDENCIES:
		- jquery 2.1x+

*/

class ModalWindow {

	constructor($triggers, objOptions) {
		this.$document = $(document);
		this.$body = $('body');
		this.initialize($triggers, objOptions);
	}

	initialize($triggers, objOptions) {

		// defaults
		this.$triggers = $triggers;
		this.options = $.extend({
			//selectorTriggers: 'a.modal-trigger',
			modalID: 'modalwindow',
			modalClass: 'modalwindow',
			extraClasses: '',
			overlayID: 'modaloverlay',
			closeBtnClass: 'btn-closeX',
			closeBtnInnerHTML: '<span>X</span>', //ex: '<span class="offscreen">close window</span>'
			activeClass: 'active',
			activeBodyClass: 'modal-active',
			animDuration: 400,
			customEventName: 'ModalWindow'
		}, objOptions || {});

		// element references
		this.$activeTrigger = null;
		this.$overlay = null;
		this.$modal = null;
		this.$content = null;
		this.$closeBtn = null;

		// setup & properties
		this.isModalActivated = false;
		this.contentHTML = null;

		this.initDOM();

		this.bindEvents();

	}


/**
*	Private Methods
**/

	initDOM() {

		//create overlay
		this.$overlay = $('#' + this.options.overlayID);
		if (!this.$overlay.length) {
			this.$overlay = $('<div id="' + this.options.overlayID + '"></div>').appendTo(this.$body);
		}

		//create modal
		this.$modal = $('#' + this.options.modalID);
		if (!this.$modal.length) {
			this.$modal = $('<div></div>', {
				'id': this.options.modalID,
				'class': this.options.modalClass + ' ' + this.options.extraClasses,
				'aria-hidden': 'true',
				'aria-live': 'polite',
				'role': 'dialog',
				'tabindex': '-1'
			});
		}

		//create modal content
		this.$content = this.$modal.find('.' + this.options.modalClass + '-content');
		if (!this.$content.length) {
			this.$content = $('<div></div>', {
				'class': this.options.modalClass + '-content',
				'role': 'document'
			}).appendTo(this.$modal);
		}

		//insert close button
		this.$closeBtn = this.$modal.find('.' + this.options.closeBtnClass);
		if (!this.$closeBtn.length) {
			this.$closeBtn = $('<a></a>', {
				'class': this.options.closeBtnClass,
				'href': '#close',
				'title': 'close'
			}).html(this.options.closeBtnInnerHTML).appendTo(this.$modal);
		}

		//insert into DOM
		this.$modal.insertAfter(this.$overlay);

	}

	bindEvents() {

		this.$triggers.on('click', function(event) {
			event.preventDefault();
			if (!this.isModalActivated) {
				this.$activeTrigger = $(event.currentTarget);
				this.openModal();
			}
		}.bind(this));

		this.$closeBtn.on('click', function(event) {
			event.preventDefault();
			if (this.isModalActivated) {
				this.closeModal();
			}
		}.bind(this));

		this.$overlay.on('click', function(event) {
			if (this.isModalActivated) {
				this.closeModal();
			}
		}.bind(this));

		this.$document.on('focusin', function(event) {
			if (this.isModalActivated && !this.$modal[0].contains(event.target)) {
				this.$modal.focus();
			}
		}.bind(this));

		this.$document.on('keydown', function(event) {
			if (this.isModalActivated && event.keyCode === 27) {
				this.closeModal();
			}
		}.bind(this));

	}

	unbindEvents() {
		this.$triggers.off('click', function(event){});
		this.$closeBtn.off('click', function(event){});
		this.$overlay.off('click', function(event){});
		this.$document.off('focusin', function(event){});
		this.$document.off('keydown', function(event){});
	}


/**
*	Public Methods
**/

	// extend or override getContent in subclass to create custom modal
	getContent() {
		var targetID = this.$activeTrigger.data('targetid') || this.$activeTrigger.attr('href').replace('#','');
		var targetEl = $('#' + targetID);
		this.contentHTML = targetEl.html();
		this.setContent();
	}

	setContent() {
		this.$content.html(this.contentHTML);
	}

	openModal() {

		this.isModalActivated = true;

		this.getContent();

		this.$body.addClass(this.options.activeBodyClass);
		this.$overlay.show();
		this.$modal.show();

		setTimeout(function() {

			this.$overlay.addClass(this.options.activeClass);
			this.$modal.addClass(this.options.activeClass).attr({'aria-hidden':'false'});

			setTimeout(function() {
				this.$modal.focus();
				$.event.trigger(this.options.customEventName + ':modalOpened', [this.options.modalID]);
			}.bind(this), this.options.animDuration);

		}.bind(this), 10);

	}

	closeModal() {

		this.$body.removeClass(this.options.activeBodyClass);
		this.$overlay.removeClass(this.options.activeClass);
		this.$modal.removeClass(this.options.activeClass).attr({'aria-hidden':'true'});

		setTimeout(function() {

			this.isModalActivated = false;
			this.$overlay.hide();
			this.$modal.hide();
			this.$content.empty();
			this.$activeTrigger.focus();
			$.event.trigger(this.options.customEventName + ':modalClosed', [this.options.modalID]);

		}.bind(this), this.options.animDuration);

	}

}

export default ModalWindow;
