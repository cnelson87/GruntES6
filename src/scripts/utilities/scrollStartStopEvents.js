/**
 * scrollStartStopEvents
 * @author: Chris Nelson <cnelson87@gmail.com>
 * @description: Broadcasts pseudo 'scrollStart' and 'scrollStop' events
 */

import AppConfig from 'config/AppConfig';
import AppEvents from 'config/AppEvents';
import PubSub from 'utilities/PubSub';

const scrollStartStopEvents = function() {
	let timer;
	$(window).on('scroll', function(event) {
		if (timer) {
			clearTimeout(timer);
		} else {
			$.event.trigger(AppEvents.WINDOW_SCROLL_START);
			PubSub.trigger(AppEvents.WINDOW_SCROLL_START);
		}
		timer = setTimeout(function() {
			timer = null;
			$.event.trigger(AppEvents.WINDOW_SCROLL_START);
			PubSub.trigger(AppEvents.WINDOW_SCROLL_STOP);
		}, 100);
	});
};

export default scrollStartStopEvents;
