/*
	TITLE: Accordion

	DESCRIPTION: Basic Accordion widget

	VERSION: 0.3.4

	USAGE: let myAccordion = new Accordion('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: Chris Nelson <cnelson87@gmail.com>

	DEPENDENCIES:
		- jquery 2.2x+
		- greensock
		- HeightEqualizer.js

*/

import AppConfig from 'config/AppConfig';
import AppEvents from 'config/AppEvents';
import HeightEqualizer from 'widgets/HeightEqualizer';

class Accordion {

	constructor($el, objOptions) {
		this.$window = $(window);
		this.$htmlBody = $('html, body');
		this.initialize($el, objOptions);
	}

	initialize($el, objOptions) {
		let urlHash = window.location.hash.replace('#','') || false;

		// defaults
		this.$el = $el;
		this.options = $.extend({
			initialIndex: 0,
			selectorTabs: '.accordion--header a',
			selectorPanels: '.accordion--panel',
			classActive: 'is-active',
			classDisabled: 'is-disabled',
			equalizeHeight: false,
			selfClosing: true,
			animDuration: 0.4,
			animEasing: 'Power4.easeOut',
			selectorFocusEls: 'a, button, input, select, textarea',
			selectorContentEls: 'h2, h3, h4, h5, h6, p, ul, ol, dl',
			selectedText: 'currently selected',
			enableTracking: false,
			customEventName: 'Accordion'
		}, objOptions || {});

		// element references
		this.$tabs = this.$el.find(this.options.selectorTabs);
		this.$panels = this.$el.find(this.options.selectorPanels);

		// setup & properties
		this._length = this.$panels.length;
		if (this.options.initialIndex >= this._length) {this.options.initialIndex = 0;}
		this.currentIndex = this.options.initialIndex;
		this.previousIndex = null;
		this.heightEqualizer = null;
		this.maxHeight = 'auto';
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
		let $activeTab = this.$tabs.eq(this.currentIndex === -1 ? 9999 : this.currentIndex);
		let $activePanel = this.$panels.eq(this.currentIndex === -1 ? 9999 : this.currentIndex);

		this.$el.attr({'role':'tablist', 'aria-live':'polite'});
		this.$tabs.attr({'role':'tab', 'tabindex':'0', 'aria-selected':'false'});
		this.$panels.attr({'role':'tabpanel', 'aria-hidden':'true'});
		this.$panels.find(this.options.selectorFocusEls).attr({'tabindex':'-1'});

		// equalize items height
		if (this.options.equalizeHeight) {
			this.heightEqualizer = new HeightEqualizer(this.$el, {
				selectorItems: this.options.selectorPanels,
				setParentHeight: false
			});
			this.maxHeight = this.heightEqualizer.maxHeight;
		}

		this.activateTab($activeTab);

		this.activatePanel($activePanel);

		TweenMax.set(this.$panels, {
			display: 'none',
			height: this.maxHeight
		});

		TweenMax.set($activePanel, {
			display: 'block',
			height: this.maxHeight
		});

		// initial focus on content
		this.$window.on('load', function() {
			if (this.setInitialFocus) {
				this.focusOnPanel($activePanel);
			}
		}.bind(this));

	}

	uninitDOM() {

		this.$el.removeAttr('role aria-live');
		this.$tabs.removeAttr('role tabindex aria-selected').removeClass(this.options.classActive);
		this.$panels.removeAttr('role aria-hidden').removeClass(this.options.classActive);
		this.$panels.find(this.options.selectorFocusEls).removeAttr('tabindex');
		this.$tabs.find('.selected-text').remove();

		TweenMax.set(this.$panels, {
			display: '',
			height: ''
		});

	}

	_addEventListeners() {
		this.$window.on('resize', this.__onWindowResize.bind(this));
		this.$tabs.on('click', this.__clickTab.bind(this));
	}

	_removeEventListeners() {
		this.$window.off('resize', this.__onWindowResize.bind(this));
		this.$tabs.off('click', this.__clickTab.bind(this));
	}


/**
*	Event Handlers
**/

	__onWindowResize(event) {
		if (this.options.equalizeHeight) {
			this.heightEqualizer.resetHeight();
			this.maxHeight = this.heightEqualizer.maxHeight;
		}
	}

	__clickTab(event) {
		event.preventDefault();
		let index = this.$tabs.index(event.currentTarget);
		let $currentTab = this.$tabs.eq(index);
		let $currentPanel = this.$panels.eq(index);

		if (this.isAnimating || $currentTab.hasClass(this.options.classDisabled)) {return;}

		// if selfClosing then check various states of acordion
		if (this.options.selfClosing) {

			// currentIndex is open
			if (this.currentIndex === index) {
				this.previousIndex = null;
				this.currentIndex = -1;
				this.animateClosed(index);

			// currentIndex is -1, all are closed
			} else if (this.currentIndex === -1) {
				this.previousIndex = null;
				this.currentIndex = index;
				this.animateOpen(index);

			// default behaviour
			} else {
				this.previousIndex = this.currentIndex;
				this.currentIndex = index;
				this.animateClosed(this.previousIndex);
				this.animateOpen(this.currentIndex);
			}

		// else accordion operates as normal
		} else {

			if (this.currentIndex === index) {
				this.focusOnPanel($currentPanel);
			} else {
				this.previousIndex = this.currentIndex;
				this.currentIndex = index;
				this.animateClosed(this.previousIndex);
				this.animateOpen(this.currentIndex);
			}

		}

	}


/**
*	Public Methods
**/

	animateClosed(index) {
		let self = this;
		let $inactiveTab = this.$tabs.eq(index);
		let $inactivePanel = this.$panels.eq(index);

		this.isAnimating = true;

		this.deactivateTab($inactiveTab);

		this.deactivatePanel($inactivePanel);

		TweenMax.to($inactivePanel, this.options.animDuration, {
			height: 0,
			ease: this.options.animEasing,
			onComplete: function() {
				self.isAnimating = false;
				$inactiveTab.focus();
				TweenMax.set($inactivePanel, {
					display: 'none',
					height: self.maxHeight
				});
			}
		});

	}

	animateOpen(index) {
		let self = this;
		let $activeTab = this.$tabs.eq(index);
		let $activePanel = this.$panels.eq(index);
		let panelHeight = $activePanel.outerHeight();

		this.isAnimating = true;

		this.activateTab($activeTab);

		this.activatePanel($activePanel);

		if (this.options.equalizeHeight) {
			panelHeight = this.maxHeight;
			TweenMax.set($activePanel, {
				height: 0
			});
		}

		TweenMax.to($activePanel, this.options.animDuration, {
			display: 'block',
			height: panelHeight,
			ease: this.options.animEasing,
			onComplete: function() {
				self.isAnimating = false;
				self.focusOnPanel($activePanel);
				TweenMax.set($activePanel, {
					height: self.maxHeight
				});
			}
		});

		$.event.trigger(`${this.options.customEventName}:panelOpened`, {activeEl: $activePanel});

		this.fireTracking();

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
		$panel.find(this.options.selectorFocusEls).attr({'tabindex':'-1'});
	}

	activatePanel($panel) {
		$panel.addClass(this.options.classActive).attr({'aria-hidden':'false'});
		$panel.find(this.options.selectorFocusEls).attr({'tabindex':'0'});
	}

	focusOnPanel($panel) {
		let index = this.$panels.index($panel);
		let topOffset = AppConfig.topOffset + this.$tabs.eq(index).outerHeight();
		let pnlTop = $panel.offset().top;
		let pnlHeight = $panel.outerHeight();
		let winTop = this.$window.scrollTop() + topOffset;
		let winHeight = this.$window.height() - topOffset;
		let scrollTop = pnlTop - topOffset;
		let $focusContentEl = $panel.find(this.options.selectorContentEls).first();

		if (pnlTop < winTop || pnlTop + pnlHeight > winTop + winHeight) {
			this.$htmlBody.animate({scrollTop: scrollTop}, 200, function() {
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

export default Accordion;
