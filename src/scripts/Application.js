/**
 * Application
 * @author: Chris Nelson <cnelson87@gmail.com>
 */

import AppConfig from 'config/AppConfig';
import AppEvents from 'config/AppEvents';
import PubSub from 'utilities/PubSub';
import getQueryStringParams from 'utilities/getQueryStringParams';
import breakpointChangeEvent from 'utilities/breakpointChangeEvent';
import resizeStartStopEvents from 'utilities/resizeStartStopEvents';
import scrollStartStopEvents from 'utilities/scrollStartStopEvents';
import AppState from 'models/AppState';
import HomepageView from 'views/HomepageView';
import PromisePage from 'views/PromisePage';

import ResponsiveCarousel from 'widgets/ResponsiveCarousel';
import ResponsiveTabCarousel from 'widgets/ResponsiveTabCarousel';
import MiniAccordion from 'widgets/MiniAccordion';
import Accordion from 'widgets/Accordion';
import TabSwitcher from 'widgets/TabSwitcher';
import ModalWindow from 'widgets/ModalWindow';
import AjaxModal from 'widgets/AjaxModal';
import {SuperClass, SubClass} from 'widgets/SuperSubClass';

const Application = {

	initialize: function() {
		// console.log('Application:initialize');

		this.$window = $(window);
		this.$document = $(document);
		this.$html = $('html');
		this.$body = $('body');
		this.$header = $('#header');
		this.$footer = $('#footer');

		this.bodyID = this.$body.attr('id');

		if (AppConfig.isIE9) {this.$html.addClass('ie9');}
		if (AppConfig.isIE10) {this.$html.addClass('ie10');}
		if (AppConfig.isIE11) {this.$html.addClass('ie11');}
		if (AppConfig.isAndroid) {this.$html.addClass('android');}
		if (AppConfig.isIOS) {this.$html.addClass('ios');}

		this.appState = new AppState();

		this.hashParams = getQueryStringParams(location.hash.substring(1));
		this.queryParams = getQueryStringParams();
		if (!!this.queryParams || !!this.hashParams) {
			this.queryParams = $.extend(this.queryParams, this.hashParams);
		}
		console.log(this.hashParams);
		console.log(this.queryParams);

		// Initialize custom events
		breakpointChangeEvent();
		resizeStartStopEvents();
		scrollStartStopEvents();

		this._addEventListeners();

		this.setTopOffset();

		// init specific page views
		switch(this.bodyID) {
			case 'homepage':
				this.initHomePage();
				break;
			case 'promisepage':
				this.initPromisePage();
				break;
			case 'carouselpage':
				this.initCarouselPage();
				break;
			case 'tabcarouselpage':
				this.initTabCarouselPage();
				break;
			case 'miniaccordionpage':
				this.initMiniAccordionPage();
				break;
			case 'accordionpage':
				this.initAccordionPage();
				break;
			case 'tabswitcherpage':
				this.initTabswitcherPage();
				break;
			case 'modalspage':
				this.initModalsPage();
				break;
			case 'testpage':
				this.initTestPage();
				break;
			default:
				//console.log('default');
		}

	},

	initHomePage: function() {
		this.homepageView = new HomepageView({
			controller: this,
			el: $('#homepage-app')
		});
	},

	initPromisePage: function() {
		PromisePage.initialize();
	},

	initCarouselPage: function() {
		new ResponsiveCarousel( $('#carousel-m1-t1-d1'), {
			numVisibleItemsMobile: 1,
			numItemsToAnimateMobile: 1,
			numVisibleItemsTablet: 1,
			numItemsToAnimateTablet: 1,
			numVisibleItemsDesktop: 1,
			numItemsToAnimateDesktop: 1,
			loopEndToEnd: false,
			autoRotate: true
		});
		new ResponsiveCarousel( $('#carousel-m1-t2-d3'), {
			numVisibleItemsMobile: 1,
			numItemsToAnimateMobile: 1,
			numVisibleItemsTablet: 2,
			numItemsToAnimateTablet: 1,
			numVisibleItemsDesktop: 3,
			numItemsToAnimateDesktop: 2,
			loopEndToEnd: true,
			autoRotate: false
		});
		new ResponsiveCarousel( $('#carousel-m1-t3-d5'), {
			numVisibleItemsMobile: 1,
			numItemsToAnimateMobile: 1,
			numVisibleItemsTablet: 3,
			numItemsToAnimateTablet: 2,
			numVisibleItemsDesktop: 5,
			numItemsToAnimateDesktop: 4,
			loopEndToEnd: true,
			staggerActiveItems: true,
			autoRotate: false
		});
	},

	initTabCarouselPage: function() {
		new ResponsiveTabCarousel($('#carousel-m1-t1-d1'), {
			numVisibleItemsMobile: 1,
			numItemsToAnimateMobile: 1,
			numVisibleItemsTablet: 1,
			numItemsToAnimateTablet: 1,
			numVisibleItemsDesktop: 1,
			numItemsToAnimateDesktop: 1,
			loopEndToEnd: false,
			autoRotate: true
		});
	},

	initMiniAccordionPage: function() {
		let $miniAccordions = $('.accordion');
		for (let i=0, len=$miniAccordions.length; i<len; i++) {
			new MiniAccordion($miniAccordions.eq(i), {
				initialOpen: (i === 0) ? true : false,
			});
		}
	},

	initAccordionPage: function() {
		new Accordion($('#accordion-default'), {});
		new Accordion($('#accordion-custom'), {
			initialIndex: -1,
			equalizeHeight: true
		});
	},

	initTabswitcherPage: function() {
		new TabSwitcher($('#tabswitcher-default'), {});
		new TabSwitcher($('#tabswitcher-custom'), {
			equalizeHeight: true,
			autoRotate: true
		});
	},

	initModalsPage: function() {
		new ModalWindow($('a.modal-trigger'), {
			extraClasses: 'modal-wide'
		});
		new AjaxModal($('a.ajax-modal-trigger'), {
			// extraClasses: 'modal-wide'
		});
	},

	initTestPage: function() {
		// Super / Sub class demo
		new SubClass();
	},

	_addEventListeners: function() {
		PubSub.on(AppEvents.WINDOW_RESIZE_START, this.onWindowResizeStart, this);
		PubSub.on(AppEvents.WINDOW_RESIZE_STOP, this.onWindowResizeStop, this);
		PubSub.on(AppEvents.WINDOW_SCROLL_START, this.onWindowScrollStart, this);
		PubSub.on(AppEvents.WINDOW_SCROLL_STOP, this.onWindowScrollStop, this);
		PubSub.on(AppEvents.BREAKPOINT_CHANGE, this.onBreakpointChange, this);
	},

	_removeEventListeners: function() {
		PubSub.off(AppEvents.WINDOW_RESIZE_START, this.onWindowResizeStart, this);
		PubSub.off(AppEvents.WINDOW_RESIZE_STOP, this.onWindowResizeStop, this);
		PubSub.off(AppEvents.WINDOW_SCROLL_START, this.onWindowScrollStart, this);
		PubSub.off(AppEvents.WINDOW_SCROLL_STOP, this.onWindowScrollStop, this);
		PubSub.off(AppEvents.BREAKPOINT_CHANGE, this.onBreakpointChange, this);
	},

	onWindowResizeStart: function() {
		// console.log('onWindowResizeStart');
	},

	onWindowResizeStop: function() {
		// console.log('onWindowResizeStop');
	},

	onWindowScrollStart: function() {
		// console.log('onWindowScrollStart');
	},

	onWindowScrollStop: function() {
		// console.log('onWindowScrollStop');
	},

	onBreakpointChange: function(params) {
		// console.log('onBreakpointChange', params);
		// Store currentBreakpoint in a Backbone model
		this.appState.set({currentBreakpoint: AppConfig.currentBreakpoint});
		this.setTopOffset();
	},

	setTopOffset: function() {
		AppConfig.topOffset = this.$header.height();
	}

};

window.Application = Application;

export default Application;
