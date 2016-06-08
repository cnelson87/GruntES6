/*
	TITLE: ResponsiveCarousel

	DESCRIPTION: A carousel widget that responds to mobile, tablet, and desaktop media queries

	VERSION: 0.3.2

	USAGE: let myCarousel = new ResponsiveCarousel('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: Chris Nelson <cnelson87@gmail.com>

	DEPENDENCIES:
		- jquery 2.2x+
		- greensock

*/

import AppConfig from 'config/AppConfig';
import AppEvents from 'config/AppEvents';

class ResponsiveCarousel {

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
			numVisibleItemsMobile: 1,
			numItemsToAnimateMobile: 1,
			numVisibleItemsTablet: 1,
			numItemsToAnimateTablet: 1,
			numVisibleItemsDesktop: 1,
			numItemsToAnimateDesktop: 1,
			enableSwipe: true,
			loopEndToEnd: false,
			selectorNavPrev: '.nav-prev',
			selectorNavNext: '.nav-next',
			selectorInnerTrack: '.carousel--inner-track',
			selectorPanels: '.carousel--panel',
			classActiveItem: 'is-active',
			classNavDisabled: 'is-disabled',
			autoRotate: false,
			autoRotateInterval: 8000,
			maxAutoRotations: 5,
			animDuration: 0.6,
			animEasing: 'Power4.easeInOut',
			selectorFocusEls: 'a, button, input, select, textarea',
			selectorContentEls: 'h2, h3, h4, h5, h6, p, ul, ol, dl',
			enableTracking: false,
			customEventName: 'ResponsiveCarousel'
		}, objOptions || {});

		// element references
		this.$navPrev = this.$el.find(this.options.selectorNavPrev);
		this.$navNext = this.$el.find(this.options.selectorNavNext);
		this.$innerTrack = this.$el.find(this.options.selectorInnerTrack);
		this.$panels = this.$innerTrack.children(this.options.selectorPanels);

		// setup & properties
		this._length = this.$panels.length;
		if (this.options.initialIndex >= this._length) {this.options.initialIndex = 0;}
		this.currentIndex = this.options.initialIndex;
		this.lastIndex = null;
		this.itemWidth = null;
		this.scrollAmt = null;
		this.trackWidth = null;
		this.numVisibleItems = null;
		this.numItemsToAnimate = null;
		this.isAnimating = false;

		// check url hash to override currentIndex
		this.focusOnInit = false;
		if (urlHash) {
			for (let i=0, $panel; i<this._length; i++) {
				if (this.$panels.eq(i).data('id') === urlHash) {
					this.currentIndex = i;
					this.focusOnInit = true;
					break;
				}
			}
		}

		this.initDOM();

		this.setOptions();

		this.setDOM();

		this._addEventListeners();

		$.event.trigger(`${this.options.customEventName}:isInitialized`, [this.$el]);

	}


/**
*	Private Methods
**/

	initDOM() {

		this.$el.attr({'role':'tablist', 'aria-live':'polite'});
		this.$navPrev.attr({'role':'button', 'tabindex':'0'});
		this.$navNext.attr({'role':'button', 'tabindex':'0'});
		this.$panels.attr({'role':'tabpanel', 'aria-hidden':'true'});

	}

	setOptions() {
		// console.log(AppConfig.currentBreakpoint);

		switch(AppConfig.currentBreakpoint) {
			case 'mobile':
				this.numVisibleItems = this.options.numVisibleItemsMobile;
				this.numItemsToAnimate = this.options.numItemsToAnimateMobile;
				break;
			case 'tablet':
				this.numVisibleItems = this.options.numVisibleItemsTablet;
				this.numItemsToAnimate = this.options.numItemsToAnimateTablet;
				break;
			case 'desktop':
				this.numVisibleItems = this.options.numVisibleItemsDesktop;
				this.numItemsToAnimate = this.options.numItemsToAnimateDesktop;
				break;
			default:
				console.error('ERROR: Invalid Breakpoint');
		}

		this.lastIndex = this._length - this.numVisibleItems;
		if (this.currentIndex > this.lastIndex) {this.currentIndex = this.lastIndex;}
		this.itemWidth = 100 / this._length;
		this.scrollAmt = (100 / this.numVisibleItems) * -1;
		this.trackWidth = (1 / this.numVisibleItems) * (this._length * 100);

	}

	setDOM() {
		let $activePanel = this.$panels.eq(this.currentIndex);
		let itemWidth = this.itemWidth + '%';
		let trackWidth = this.trackWidth + '%';
		let leftPos = (this.scrollAmt * this.currentIndex) + '%';

		// disable nav links if not enough visible items
		this.updateNav();
		if (this._length <= this.numVisibleItems) {
			this.$navPrev.addClass(this.options.classNavDisabled).attr({'tabindex':'-1'});
			this.$navNext.addClass(this.options.classNavDisabled).attr({'tabindex':'-1'});
		}

		// adjust initial position
		this.$panels.css({width: itemWidth});
		TweenMax.set(this.$innerTrack, {
			width: trackWidth,
			left: leftPos
		}); 

		this.deactivateItems();
		this.activateItems();

		// auto-rotate items
		if (this.options.autoRotate) {
			this.rotationInterval = this.options.autoRotateInterval;
			this.autoRotationCounter = this._length * this.options.maxAutoRotations;
			this.setAutoRotation = setInterval(function() {
				this.autoRotation();
			}.bind(this), this.rotationInterval);
		}

		// initial focus on content
		this.$window.load(function() {
			if (this.focusOnInit) {
				this.focusOnPanel($activePanel);
			}
		}.bind(this));

	}

	uninitDOM() {

		this.$el.removeAttr('role aria-live');
		this.$navPrev.removeAttr('role tabindex');
		this.$navNext.removeAttr('role tabindex');
		this.$panels.removeAttr('role aria-hidden').removeClass(this.options.classActiveItem);
		this.$panels.find(this.options.selectorFocusEls).removeAttr('tabindex');

		TweenMax.set(this.$innerTrack, {
			left: ''
		});

		if (this.options.autoRotate) {
			clearInterval(this.setAutoRotation);
		}

	}

	_addEventListeners() {
		let self = this;

		this.$window.on(AppEvents.BREAKPOINT_CHANGE, function(event, params) {
			self.__onBreakpointChange(event, params);
		}.bind(this));

		this.$navPrev.on('click', function(event) {
			event.preventDefault();
			if (!this.$navPrev.hasClass(this.options.classNavDisabled) && !this.isAnimating) {
				this.__clickNavPrev(event);
			}
		}.bind(this));

		this.$navNext.on('click', function(event) {
			event.preventDefault();
			if (!this.$navNext.hasClass(this.options.classNavDisabled) && !this.isAnimating) {
				this.__clickNavNext(event);
			}
		}.bind(this));

		if (this.options.enableSwipe) {
			this.$el.swipe({
				fingers: 'all',
				excludedElements: '.noSwipe',
				threshold: 50,
				triggerOnTouchEnd: false, // triggers on threshold
				swipeLeft: function(event) {
					if (!self.$navNext.hasClass(self.options.classNavDisabled) && !self.isAnimating) {
						self.__clickNavNext(event);
					}
				},
				swipeRight: function(event) {
					if (!self.$navPrev.hasClass(self.options.classNavDisabled) && !self.isAnimating) {
						self.__clickNavPrev(event);
					}
				},
				allowPageScroll: 'vertical'
			});
		}

	}

	_removeEventListeners() {
		this.$window.off(AppEvents.BREAKPOINT_CHANGE, function(){});
		this.$navPrev.off('click', function(){});
		this.$navNext.off('click', function(){});
		if (this.options.enableSwipe) {
			this.$el.swipe('destroy');
		}
	}

	autoRotation() {

		if (this.currentIndex === this.lastIndex) {
			this.currentIndex = 0;
		} else {
			this.currentIndex += this.numItemsToAnimate;
			if (this.currentIndex > this.lastIndex) {this.currentIndex = this.lastIndex;}
		}

		this.updateCarousel();
		this.autoRotationCounter--;

		if (this.autoRotationCounter === 0) {
			clearInterval(this.setAutoRotation);
			this.options.autoRotate = false;
		}

	}


/**
*	Event Handlers
**/

	__onBreakpointChange(event, params) {
		// console.log(params);
		this.setOptions();
		this.setDOM();
	}

	__clickNavPrev(event) {

		if (this.options.autoRotate) {
			clearInterval(this.setAutoRotation);
			this.options.autoRotate = false;
		}

		if (this.options.loopEndToEnd && this.currentIndex === 0) {
			this.currentIndex = this.lastIndex;
		} else {
			this.currentIndex -= this.numItemsToAnimate;
			if (this.currentIndex < 0) {this.currentIndex = 0;}
		}

		this.updateCarousel(event);

	}

	__clickNavNext(event) {

		if (this.options.autoRotate) {
			clearInterval(this.setAutoRotation);
			this.options.autoRotate = false;
		}

		if (this.options.loopEndToEnd && this.currentIndex === this.lastIndex) {
			this.currentIndex = 0;
		} else {
			this.currentIndex += this.numItemsToAnimate;
			if (this.currentIndex > this.lastIndex) {this.currentIndex = this.lastIndex;}
		}

		this.updateCarousel(event);

	}


/**
*	Public Methods
**/

	updateCarousel(event) {
		let self = this;
		let leftPos = (this.scrollAmt * this.currentIndex) + '%';
		let $activePanel = this.$panels.eq(this.currentIndex);

		this.isAnimating = true;

		this.deactivateItems();
		// this.activateItems();
		this.updateNav();

		TweenMax.to(this.$innerTrack, this.options.animDuration, {
			left: leftPos,
			ease: this.options.animEasing,
			onComplete: function() {
				self.isAnimating = false;
				self.activateItems();
				if (!!event) {
					self.focusOnPanel($activePanel);
				}
			}
		});

		$.event.trigger(`${this.options.customEventName}:carouselUpdated`, {activeEl: $activePanel});

		this.fireTracking();

	}

	updateNav() {

		this.$navPrev.removeClass(this.options.classNavDisabled).attr({'tabindex':'0'});
		this.$navNext.removeClass(this.options.classNavDisabled).attr({'tabindex':'0'});

		if (!this.options.loopEndToEnd) {
			if (this.currentIndex <= 0) {
				this.$navPrev.addClass(this.options.classNavDisabled).attr({'tabindex':'-1'});
			}
			if (this.currentIndex >= this.lastIndex) {
				this.$navNext.addClass(this.options.classNavDisabled).attr({'tabindex':'-1'});
			}
		}

	}

	deactivateItems() {
		this.$panels.removeClass(this.options.classActiveItem).attr({'aria-hidden':'true'});
		this.$panels.find(this.options.selectorFocusEls).attr({'tabindex':'-1'});
	}

	activateItems() {
		let self = this;
		let first = this.currentIndex;
		let last = this.currentIndex + this.numVisibleItems;
		let $activeItems = this.$panels.slice(first, last);
		let delay = 100;

		//activate all current items incrementally
		$activeItems.each(function(index) {
			let $item = $(this);
			$item.delay(delay*index).queue(function() {
				$item.find(self.options.selectorFocusEls).attr({'tabindex':'0'});
				$item.addClass(self.options.classActiveItem).attr({'aria-hidden':'false'}).dequeue();
			});
		});

		//activate all current items at once
		// $activeItems.addClass(this.options.classActiveItem).attr({'aria-hidden':'false'});
		// $activeItems.find(this.options.selectorFocusEls).attr({'tabindex':'0'});

	}

	focusOnPanel($panel) {
		let topOffset = AppConfig.topOffset;
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
		$.event.trigger(AppEvents.TRACKING_STATE, {activeEl: $activePanel});
	}

	unInitialize() {
		this._removeEventListeners();
		this.uninitDOM();
		this.$el = null;
		this.$navPrev = null;
		this.$navNext = null;
		this.$innerTrack = null;
		this.$panels = null;
		$.event.trigger(`${this.options.customEventName}:unInitialized`);
	}

}

export default ResponsiveCarousel;
