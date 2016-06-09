/*
	TITLE: TabSwitcher

	DESCRIPTION: Basic TabSwitcher widget

	VERSION: 0.3.3

	USAGE: let myTabSwitcher = new TabSwitcher('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: Chris Nelson <cnelson87@gmail.com>

	DEPENDENCIES:
		- jquery 2.2x+
		- HeightEqualizer.js

*/

import AppConfig from 'config/AppConfig';
import AppEvents from 'config/AppEvents';
import HeightEqualizer from 'widgets/HeightEqualizer';

class TabSwitcher {

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
			selectorTabs: '.tabswitcher--tabnav a',
			selectorPanels: '.tabswitcher--panel',
			activeClass: 'is-active',
			equalizeHeight: false,
			autoRotate: false,
			autoRotateInterval: 6000,
			maxAutoRotations: 5,
			animDuration: 400,
			selectorFocusEls: 'a, button, input, select, textarea',
			selectorContentEls: 'h2, h3, h4, h5, h6, p, ul, ol, dl',
			selectedText: 'currently selected',
			enableTracking: false,
			customEventName: 'TabSwitcher'
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
		this.isAnimating = false;
		this.selectedLabel = `<span class="offscreen selected-text"> - ${this.options.selectedText}</span>`;

		// check url hash to override currentIndex
		this.focusOnInit = false;
		if (urlHash) {
			for (let i=0; i<this._length; i++) {
				if (this.$panels.eq(i).data('id') === urlHash) {
					this.currentIndex = i;
					this.focusOnInit = true;
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
		let $activeTab = this.$tabs.eq(this.currentIndex);
		let $activePanel = this.$panels.eq(this.currentIndex);

		this.$el.attr({'role':'tablist', 'aria-live':'polite'});
		this.$tabs.attr({'role':'tab', 'tabindex':'0', 'aria-selected':'false'});
		this.$panels.attr({'role':'tabpanel', 'aria-hidden':'true'});
		this.$panels.find(this.options.selectorFocusEls).attr({'tabindex':'-1'});

		// equalize items height
		if (this.options.equalizeHeight) {
			this.heightEqualizer = new HeightEqualizer( this.$el, {
				selectorItems: this.options.selectorPanels,
				setParentHeight: false
			});
		}

		this.activateTab($activeTab);

		this.activatePanel($activePanel);

		// auto-rotate items
		if (this.options.autoRotate) {
			this.rotationInterval = this.options.autoRotateInterval;
			this.autoRotationCounter = this._length * this.options.maxAutoRotations;
			this.setAutoRotation = setInterval(function() {
				this.autoRotation();
			}.bind(this), this.rotationInterval);
		}

		// initial focus on content
		if (this.focusOnInit) {
			$(window).load(function() {
				this.focusOnPanel($activePanel);
			}.bind(this));
		}

	}

	uninitDOM() {

		this.$el.removeAttr('role aria-live');
		this.$tabs.removeAttr('role tabindex aria-selected').removeClass(this.options.activeClass);
		this.$panels.removeAttr('role aria-hidden').removeClass(this.options.activeClass);
		this.$panels.find(this.options.selectorFocusEls).removeAttr('tabindex');
		this.$tabs.find('.selected-text').remove();

		if (this.options.autoRotate) {
			clearInterval(this.setAutoRotation);
		}

	}

	_addEventListeners() {
		this.$window.on('resize', this.__onWindowResize.bind(this));
		this.$tabs.on('click', this.__clickTab.bind(this));
	}

	_removeEventListeners() {
		this.$window.off('resize', this.__onWindowResize.bind(this));
		this.$tabs.off('click', this.__clickTab.bind(this));
	}

	autoRotation() {
		this.previousIndex = this.currentIndex;
		this.currentIndex++;
		if (this.currentIndex === this._length) {this.currentIndex = 0;}

		this.switchPanels();
		this.autoRotationCounter--;

		if (this.autoRotationCounter === 0) {
			clearInterval(this.setAutoRotation);
			this.options.autoRotate = false;
		}

	}


/**
*	Event Handlers
**/

	__onWindowResize(event) {
		if (this.options.equalizeHeight) {
			this.heightEqualizer.resetHeight();
		}
	}

	__clickTab(event) {
		event.preventDefault();
		let index = this.$tabs.index(event.currentTarget);

		if (this.isAnimating) {return;}

		if (this.options.autoRotate) {
			clearInterval(this.setAutoRotation);
			this.options.autoRotate = false;
		}

		if (this.currentIndex === index) {
			this.focusOnPanel(this.$panels.eq(index));
		} else {
			this.previousIndex = this.currentIndex;
			this.currentIndex = index;
			this.switchPanels(event);
		}

	}


/**
*	Public Methods
**/

	switchPanels(event) {
		let $inactiveTab = this.$tabs.eq(this.previousIndex);
		let $activeTab = this.$tabs.eq(this.currentIndex);
		let $inactivePanel = this.$panels.eq(this.previousIndex);
		let $activePanel = this.$panels.eq(this.currentIndex);

		this.isAnimating = true;

		this.deactivateTab($inactiveTab);

		this.activateTab($activeTab);

		this.deactivatePanel($inactivePanel);

		this.activatePanel($activePanel);

		setTimeout(function() {
			this.isAnimating = false;
			if (!!event) {
				this.focusOnPanel($activePanel);
			}
		}.bind(this), this.options.animDuration);

		$.event.trigger(`${this.options.customEventName}:panelOpened`, {activeEl: $activePanel});

		this.fireTracking();

	}

	deactivateTab($tab) {
		$tab.removeClass(this.options.activeClass).attr({'aria-selected':'false'});
		$tab.find('.selected-text').remove();
	}

	activateTab($tab) {
		$tab.addClass(this.options.activeClass).attr({'aria-selected':'true'});
		$tab.append(this.selectedLabel);
	}

	deactivatePanel($panel) {
		$panel.removeClass(this.options.activeClass).attr({'aria-hidden':'true'});
		$panel.find(this.options.selectorFocusEls).attr({'tabindex':'-1'});
	}

	activatePanel($panel) {
		$panel.addClass(this.options.activeClass).attr({'aria-hidden':'false'});
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

export default TabSwitcher;
