/*
	TITLE: Accordion

	DESCRIPTION: Basic Accordion widget

	VERSION: 0.3.1

	USAGE: var myAccordion = new Accordion('Element', 'Options')
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
		var urlHash = window.location.hash.replace('#','') || false;

		// defaults
		this.$el = $el;
		this.options = $.extend({
			initialIndex: 0,
			selectorTabs: '.accordion-header a',
			selectorPanels: '.accordion-panel',
			activeClass: 'active',
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
		this.selectedLabel = '<span class="offscreen selected-text"> - ' + this.options.selectedText + '</span>';

		// check url hash to override currentIndex
		this.focusOnInit = false;
		if (urlHash) {
			for (var i=0; i<this._length; i++) {
				if (this.$panels.eq(i).data('id') === urlHash) {
					this.currentIndex = i;
					this.focusOnInit = true;
					break;
				}
			}
		}

		this.initDOM();

		this.bindEvents();

		$.event.trigger(this.options.customEventName + ':isInitialized', [this.$el]);

	}


/**
*	Private Methods
**/

	initDOM() {
		var $activeTab = this.$tabs.eq(this.currentIndex === -1 ? 9999 : this.currentIndex);
		var $activePanel = this.$panels.eq(this.currentIndex === -1 ? 9999 : this.currentIndex);

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

		TweenMax.set(this.$panels, {
			display: '',
			height: ''
		});

	}

	bindEvents() {
		this.$window.on('resize', this.__onWindowResize.bind(this));
		this.$tabs.on('click', this.__clickTab.bind(this));
	}

	unbindEvents() {
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
		var index = this.$tabs.index(event.currentTarget);

		if (this.isAnimating) {return;}

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
				this.focusOnPanel(this.$panels.eq(index));
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
		var self = this;
		var $inactiveTab = this.$tabs.eq(index);
		var $inactivePanel = this.$panels.eq(index);

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
		var self = this;
		var $activeTab = this.$tabs.eq(index);
		var $activePanel = this.$panels.eq(index);
		var panelHeight = $activePanel.outerHeight();

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

		$.event.trigger(this.options.customEventName + ':panelOpened', {activeEl: $activePanel});

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
		var index = this.$panels.index($panel);
		var topOffset = AppConfig.topOffset + this.$tabs.eq(index).outerHeight();
		var pnlTop = $panel.offset().top;
		var pnlHeight = $panel.outerHeight();
		var winTop = this.$window.scrollTop() + topOffset;
		var winHeight = this.$window.height() - topOffset;
		var scrollTop = pnlTop - topOffset;
		var $focusContentEl = $panel.find(this.options.selectorContentEls).first();

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
		var $activePanel = this.$panels.eq(this.currentIndex);
		$.event.trigger(AppEvents.TRACKING_STATE, {activeEl: $activePanel});
	}

	unInitialize() {
		this.unbindEvents();
		this.uninitDOM();
		this.$el = null;
		this.$tabs = null;
		this.$panels = null;
		$.event.trigger(this.options.customEventName + ':unInitialized');
	}

}

export default Accordion;
