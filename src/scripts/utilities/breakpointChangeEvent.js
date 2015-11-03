/**
 *  breakpointChangeEvent
 *  @author Chris Nelson
 *	Create pseudo 'breakpointChange' event
 */

import AppConfig from 'config/AppConfig';
import AppEvents from 'config/AppEvents';
import PubSub from 'utilities/PubSub';

const breakpointChangeEvent = function() {

	var $elIndicator = $('<div></div>',{
		'id': 'breakpoint-indicator'
	}).appendTo($('body'));
	var zIndex = $elIndicator.css('z-index');

	var updateAppConfig = function() {
		AppConfig.currentBreakpoint = AppConfig.breakpoints[zIndex];
		AppConfig.isMobileView = AppConfig.currentBreakpoint === 'mobile' ? true : false;
		AppConfig.isTabletView = AppConfig.currentBreakpoint === 'tablet' ? true : false;
		AppConfig.isDesktopView = AppConfig.currentBreakpoint === 'desktop' ? true : false;
	};
	updateAppConfig();

	$(window).on('resize', function(event) {
		var newZI = $elIndicator.css('z-index');
		if (newZI !== zIndex) {
			zIndex = newZI;
			updateAppConfig();
			$.event.trigger(AppEvents.BREAKPOINT_CHANGE, {breakpoint: AppConfig.currentBreakpoint});
			PubSub.trigger(AppEvents.BREAKPOINT_CHANGE, {
				breakpoint: AppConfig.currentBreakpoint,
				mobile: AppConfig.isMobileView, 
				tablet: AppConfig.isTabletView, 
				desktop: AppConfig.isDesktopView
			});
		}
	});

};

export default breakpointChangeEvent;
