/*
	TITLE: Horizordion

	DESCRIPTION: A horizontal Accordion

	VERSION: 0.1.0

	USAGE: let myHorizordion = new Horizordion('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: Chris Nelson <cnelson87@gmail.com>

	DEPENDENCIES:
		- jquery 3.1.1+

*/

import AppConfig from 'config/AppConfig';
import AppEvents from 'config/AppEvents';

class Horizordion {

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
			initialIndex: 0,
			selectorTabs: '.horizordion--tab a',
			selectorPanels: '.horizordion--panel',
			selectorContent: '.horizordion--content',
			classActive: 'is-active',
			classDisabled: 'is-disabled',
			classInitialized: 'is-initialized',
			animDuration: 400,
			selectorFocusEls: 'a, button, input, select, textarea',
			selectorContentEls: 'h2, h3, h4, h5, h6, p, ul, ol, dl',
			selectedText: 'currently selected',
			enableTracking: false,
			customEventName: 'Horizordion'
		}, options);

		// element references
		this.$tabs = this.$el.find(this.options.selectorTabs);
		this.$panels = this.$el.find(this.options.selectorPanels);

		// setup & properties
		this._length = this.$panels.length;
		if (this.options.initialIndex >= this._length) {this.options.initialIndex = 0;}
		this.currentIndex = this.options.initialIndex;
		this.previousIndex = null;
		this.isAnimating = false;
		this.selectedLabel = `<span class="offscreen selected-text"> - ${this.options.selectedText}</span>`;

		// check url hash to override currentIndex
		this.setInitialFocus = false;
		if (urlHash) {
			for (let i=0; i<this._length; i++) {
				if (this.$panels.eq(i).data('id') === urlHash) {
					this.currentIndex = i;
					this.setInitialFocus = true;
					break;
				}
			}
		}

		this.initDOM();

		this._addEventListeners();

		$.event.trigger(`${this.options.customEventName}:isInitialized`, [this.$el]);

	}


/**
*	Private Methods
**/

	initDOM() {
		let highIndex = 9999;
		let $activeTab = this.$tabs.eq(this.currentIndex === -1 ? highIndex : this.currentIndex);
		let $activePanel = this.$panels.eq(this.currentIndex === -1 ? highIndex : this.currentIndex);

		this.$el.attr({'role':'tablist', 'aria-live':'polite'});
		this.$tabs.attr({'role':'tab', 'tabindex':'0', 'aria-selected':'false'});
		this.$panels.attr({'role':'tabpanel', 'aria-hidden':'true'});
		this.$panels.find(this.options.selectorContent).find(this.options.selectorFocusEls).attr({'tabindex':'-1'});

		this.activateTab($activeTab);

		this.activatePanel($activePanel);

		this.$el.addClass(this.options.classInitialized);

		// initial focus on content
		this.$window.on('load', () => {
			if (this.setInitialFocus) {
				this.focusOnPanel($activePanel);
			}
		});

	}

	uninitDOM() {
		this.$el.removeAttr('role aria-live').removeClass(this.options.classInitialized);
		this.$tabs.removeAttr('role tabindex aria-selected').removeClass(this.options.classActive);
		this.$panels.removeAttr('role aria-hidden').removeClass(this.options.classActive);
		this.$panels.find(this.options.selectorContent).find(this.options.selectorFocusEls).removeAttr('tabindex');
		this.$tabs.find('.selected-text').remove();
	}

	_addEventListeners() {
		this.$window.on('resize', this.__onWindowResize.bind(this));
		this.$tabs.on('click', this.__clickTab.bind(this));
		this.$tabs.on('keydown', this.__keydownTab.bind(this));
	}

	_removeEventListeners() {
		this.$window.off('resize', this.__onWindowResize.bind(this));
		this.$tabs.off('click', this.__clickTab.bind(this));
		this.$tabs.off('keydown', this.__keydownTab.bind(this));
	}


/**
*	Event Handlers
**/

	__onWindowResize(event) {
		console.log('__onWindowResize');
	}

	__clickTab(event) {
		event.preventDefault();
		let index = this.$tabs.index(event.currentTarget);
		let $currentTab = this.$tabs.eq(index);
		// let $currentPanel = this.$panels.eq(index);

		if (this.isAnimating || $currentTab.hasClass(this.options.classDisabled)) {return;}

		// currentIndex is open
		if (this.currentIndex === index) {
			this.previousIndex = null;
			this.currentIndex = -1;
			this.closePanel(index);

		// currentIndex is -1, all are closed
		} else if (this.currentIndex === -1) {
			this.previousIndex = null;
			this.currentIndex = index;
			this.openPanel(index);

		// default behaviour
		} else {
			this.previousIndex = this.currentIndex;
			this.currentIndex = index;
			this.closePanel(this.previousIndex);
			this.openPanel(this.currentIndex);
		}

	}

	__keydownTab(event) {
		let keyCode = event.which;
		let index = this.$tabs.index(event.currentTarget);
		const spaceKey = 32;
		const leftKey = 37;
		const upKey = 38;
		const rightKey = 39;
		const downKey = 40;

		// left/up arrow; go to previous tab
		if (keyCode === leftKey || keyCode === upKey) {
			event.preventDefault();
			if (index === 0) {index = this._length;}
			index--;
			this.$tabs.eq(index).focus();
		}

		// right/down arrow; go to next tab
		if (keyCode === rightKey || keyCode === downKey) {
			event.preventDefault();
			index++;
			if (index === this._length) {index = 0;}
			this.$tabs.eq(index).focus();
		}

		// spacebar; activate tab click
		if (keyCode === spaceKey) {
			event.preventDefault();
			this.$tabs.eq(index).click();
		}

	}


/**
*	Public Methods
**/

	closePanel(index) {
		let $inactiveTab = this.$tabs.eq(index);
		let $inactivePanel = this.$panels.eq(index);

		this.isAnimating = true;

		this.deactivateTab($inactiveTab);

		this.deactivatePanel($inactivePanel);

		setTimeout(() => {
			this.isAnimating = false;
			$inactiveTab.focus();
		}, this.options.animDuration);

	}

	openPanel(index) {
		let $activeTab = this.$tabs.eq(index);
		let $activePanel = this.$panels.eq(index);

		this.isAnimating = true;

		this.activateTab($activeTab);

		this.activatePanel($activePanel);

		setTimeout(() => {
			this.isAnimating = false;
			this.focusOnPanel($activePanel);
		}, this.options.animDuration);

	}

	deactivateTab($tab) {
		$tab.removeClass(this.options.classActive).attr({'aria-selected':'false'});
		$tab.find('.selected-text').remove();
	}

	activateTab($tab) {
		$tab.addClass(this.options.classActive).attr({'aria-selected':'true'});
		$tab.append(this.selectedLabel);
	}

	deactivatePanel($panel) {
		$panel.removeClass(this.options.classActive).attr({'aria-hidden':'true'});
		$panel.find(this.options.selectorContent).find(this.options.selectorFocusEls).attr({'tabindex':'-1'});
	}

	activatePanel($panel) {
		$panel.addClass(this.options.classActive).attr({'aria-hidden':'false'});
		$panel.find(this.options.selectorContent).find(this.options.selectorFocusEls).attr({'tabindex':'0'});
	}

	focusOnPanel($panel) {
		let index = this.$panels.index($panel);
		let topOffset = AppConfig.topOffset + this.$tabs.eq(index).outerHeight();
		let pnlTop = $panel.offset().top;
		let pnlHeight = $panel.outerHeight();
		let winTop = this.$window.scrollTop() + topOffset;
		let winHeight = this.$window.height() - topOffset;
		let scrollTop = pnlTop - topOffset;
		let $focusContentEl = $panel.find(this.options.selectorContent).find(this.options.selectorContentEls).first();
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
		let $activePanel = this.$panels.eq(this.currentIndex);
		$.event.trigger(AppEvents.TRACKING_STATE, [$activePanel]);
	}

	unInitialize() {
		this._removeEventListeners();
		this.uninitDOM();
		this.$el = null;
		this.$tabs = null;
		this.$panels = null;
		$.event.trigger(`${this.options.customEventName}:unInitialized`);
	}

}

export default Horizordion;
