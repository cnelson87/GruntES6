/*
	TITLE: MiniAccordion

	DESCRIPTION: A single Accordion item

	VERSION: 0.3.6

	USAGE: let myAccordion = new MiniAccordion('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: Chris Nelson <cnelson87@gmail.com>

	DEPENDENCIES:
		- jquery 3.x
		- greensock

*/

import AppConfig from 'config/AppConfig';
import AppEvents from 'config/AppEvents';

class MiniAccordion {

	constructor($el, options = {}) {
		this.$window = $(window);
		this.$htmlBody = $('html, body');
		this.initialize($el, options);
	}

	initialize($el, options) {
		let urlHash = location.hash.substring(1) || false;

		// defaults
		this.$el = $el;
		this.options = Object.assign({
			initialOpen: false,
			selectorTabs: '.accordion--header a',
			selectorPanels: '.accordion--panel',
			classActive: 'is-active',
			animDuration: 0.4,
			animEasing: 'Power4.easeOut',
			selectorFocusEls: 'a, button, input, select, textarea',
			selectorContentEls: 'h2, h3, h4, h5, h6, p, ul, ol, dl',
			selectedText: 'currently selected',
			enableTracking: false,
			customEventName: 'MiniAccordion'
		}, options);

		// element references
		this.$tab = this.$el.find(this.options.selectorTabs);
		this.$panel = this.$el.find(this.options.selectorPanels);

		// setup & properties
		this.isActive = this.options.initialOpen;
		this.isAnimating = false;
		this.selectedLabel = `<span class="offscreen selected-text"> - ${this.options.selectedText}</span>`;

		// check url hash to override isActive
		this.setInitialFocus = false;
		if (urlHash && this.$panel.data('id') === urlHash) {
			this.isActive = true;
			this.setInitialFocus = true;
		}

		this.initDOM();

		this._addEventListeners();

		$.event.trigger(`${this.options.customEventName}:isInitialized`, [this.$el]);

	}


/**
*	Private Methods
**/

	initDOM() {

		this.$el.attr({'role':'tablist', 'aria-live':'polite'});
		this.$tab.attr({'role':'tab', 'tabindex':'0', 'aria-selected':'false'});
		this.$panel.attr({'role':'tabpanel', 'aria-hidden':'true'});
		this.$panel.find(this.options.selectorFocusEls).attr({'tabindex':'-1'});

		if (this.isActive) {
			this.activateTab();
			this.activatePanel();
		}

		TweenMax.set(this.$panel, {
			display: this.isActive ? 'block' : 'none',
			height: 'auto'
		});

		// initial focus on content
		this.$window.on('load', () => {
			if (this.setInitialFocus) {
				this.focusOnPanel();
			}
		});

	}

	uninitDOM() {

		this.$el.removeAttr('role aria-live');
		this.$tab.removeAttr('role tabindex aria-selected').removeClass(this.options.classActive);
		this.$panel.removeAttr('role aria-hidden').removeClass(this.options.classActive);
		this.$panel.find(this.options.selectorFocusEls).removeAttr('tabindex');
		this.$tab.find('.selected-text').remove();

		TweenMax.set(this.$panel, {
			display: '',
			height: ''
		});

	}

	_addEventListeners() {
		this.$tab.on('click', this.__clickTab.bind(this));
		this.$tab.on('keydown', this.__keydownTab.bind(this));
	}

	_removeEventListeners() {
		this.$tab.off('click', this.__clickTab.bind(this));
		this.$tab.off('keydown', this.__keydownTab.bind(this));
	}


/**
*	Event Handlers
**/

	__clickTab(event) {
		event.preventDefault();

		if (this.isAnimating) {return;}

		if (this.isActive) {
			this.animateClosed();
		} else {
			this.animateOpen();
		}

	}

	__keydownTab(event) {
		let keyCode = event.which;
		let { keys } = AppConfig;

		// spacebar; activate tab click
		if (keyCode === keys.space) {
			event.preventDefault();
			this.$tab.click();
		}

	}


/**
*	Public Methods
**/

	animateClosed() {
		let self = this;

		this.isAnimating = true;

		this.isActive = false;

		this.deactivateTab();

		this.deactivatePanel();

		TweenMax.to(this.$panel, this.options.animDuration, {
			height: 0,
			ease: this.options.animEasing,
			onComplete: function() {
				self.isAnimating = false;
				self.$tab.focus();
				TweenMax.set(self.$panel, {
					display: 'none',
					height: 'auto'
				});
			}
		});

	}

	animateOpen() {
		let self = this;
		let panelHeight = this.$panel.outerHeight();

		this.isAnimating = true;

		this.isActive = true;

		this.activateTab();

		this.activatePanel();

		TweenMax.to(this.$panel, this.options.animDuration, {
			display: 'block',
			height: panelHeight,
			ease: this.options.animEasing,
			onComplete: function() {
				self.isAnimating = false;
				self.focusOnPanel();
				TweenMax.set(self.$panel, {
					height: 'auto'
				});
			}
		});

		$.event.trigger(`${this.options.customEventName}:panelOpened`, [this.$el]);

		this.fireTracking();

	}

	deactivateTab() {
		this.$tab.removeClass(this.options.classActive).attr({'aria-selected':'false'});
		this.$tab.find('.selected-text').remove();
	}

	activateTab() {
		this.$tab.addClass(this.options.classActive).attr({'aria-selected':'true'});
		this.$tab.append(this.selectedLabel);
	}

	deactivatePanel() {
		this.$panel.removeClass(this.options.classActive).attr({'aria-hidden':'true'});
		this.$panel.find(this.options.selectorFocusEls).attr({'tabindex':'-1'});
	}

	activatePanel() {
		this.$panel.addClass(this.options.classActive).attr({'aria-hidden':'false'});
		this.$panel.find(this.options.selectorFocusEls).attr({'tabindex':'0'});
	}

	focusOnPanel() {
		let topOffset = AppConfig.topOffset;
		let pnlTop = this.$el.offset().top;
		let pnlHeight = this.$el.outerHeight();
		let winTop = this.$window.scrollTop() + topOffset;
		let winHeight = this.$window.height() - topOffset;
		let scrollTop = pnlTop - topOffset;
		let $focusContentEl = this.$panel.find(this.options.selectorContentEls).first();
		let scrollSpeed = 200;

		if (pnlTop < winTop || pnlTop + pnlHeight > winTop + winHeight) {
			this.$htmlBody.animate({scrollTop: scrollTop}, scrollSpeed, function() {
				$focusContentEl.attr({'tabindex':'-1'}).focus();
			});
		} else {
			$focusContentEl.attr({'tabindex':'-1'}).focus();
		}

	}

	fireTracking() {
		if (!this.options.enableTracking) {return;}
		$.event.trigger(AppEvents.TRACKING_STATE, [this.$el]);
	}

	unInitialize() {
		this._removeEventListeners();
		this.uninitDOM();
		this.$el = null;
		this.$tab = null;
		this.$panel = null;
		$.event.trigger(`${this.options.customEventName}:unInitialized`);
	}

}

export default MiniAccordion;
