/*
	TITLE: ResponsiveTabCarousel

	DESCRIPTION: A carousel widget that responds to mobile, tablet, and desktop media queries
	NOTE: The tabs only work if mobile/tablet/desktop views all display one 'panel' at a time.

	VERSION: 0.2.6

	USAGE: let myTabCarousel = new ResponsiveTabCarousel('Element', 'Options')
		@param {jQuery Object}
		@param {Object}

	AUTHOR: Chris Nelson <cnelson87@gmail.com>

	DEPENDENCIES:
		- jquery 2.2x+
		- greensock

*/

import AppConfig from 'config/AppConfig';
import AppEvents from 'config/AppEvents';
import ResponsiveCarousel from 'widgets/ResponsiveCarousel';

class ResponsiveTabCarousel extends ResponsiveCarousel {

	initialize($el, objOptions) {

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
			selectorTabs: '.tabnav a',
			classActiveNav: 'is-active',
			selectedText: 'currently selected',
			customEventName: 'ResponsiveTabCarousel'
		}, objOptions || {});

		// element references
		this.$tabs = this.$el.find(this.options.selectorTabs);

		// setup & properties
		this.selectedLabel = `<span class="offscreen selected-text"> - ${this.options.selectedText}</span>`;

		super.initialize($el, this.options);
	}


/**
*	Private Methods
**/

	initDOM() {
		super.initDOM();
		let $activeTab = this.$tabs.eq(this.currentIndex);
		this.$tabs.attr({'role':'tab', 'tabindex':'0', 'aria-selected':'false'});
		$activeTab.addClass(this.options.classActiveNav).attr({'aria-selected':'true'});
		$activeTab.append(this.selectedLabel);
	}

	uninitDOM() {
		super.uninitDOM();
		this.$tabs.removeAttr('role tabindex aria-selected').removeClass(this.options.classActiveNav);
		this.$tabs.find('.selected-text').remove();
	}

	_attachEventListeners() {
		super._attachEventListeners();
		this.$tabs.on('click', this.__clickTab.bind(this));
	}

	_removeEventListeners() {
		super._removeEventListeners();
		this.$tabs.off('click', this.__clickTab.bind(this));
	}


/**
*	Event Handlers
**/

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
			this.currentIndex = index;
			this.updateCarousel(event);
		}

	}


/**
*	Public Methods
**/

	updateNav() {
		let $inactiveTab = this.$tabs.filter('.'+this.options.classActiveNav);
		let $activeTab = this.$tabs.eq(this.currentIndex);

		$inactiveTab.removeClass(this.options.classActiveNav).attr({'aria-selected':'false'});
		$activeTab.addClass(this.options.classActiveNav).attr({'aria-selected':'true'});
		$inactiveTab.find('.selected-text').remove();
		$activeTab.append(this.selectedLabel);

		super.updateNav();

	}

}

export default ResponsiveTabCarousel;
