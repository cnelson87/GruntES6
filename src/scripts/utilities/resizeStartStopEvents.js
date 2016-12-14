/**
 * resizeStartStopEvents
 * @author: Chris Nelson <cnelson87@gmail.com>
 * @description: Broadcasts pseudo 'resizeStart' and 'resizeStop' events
 */

import AppEvents from 'config/AppEvents';
import PubSub from 'utilities/PubSub';

const resizeStartStopEvents = function() {
	let timer;
	let timeoutTime = 100;
	$(window).on('resize', function(event) {
		if (timer) {
			clearTimeout(timer);
		} else {
			$.event.trigger(AppEvents.WINDOW_RESIZE_START);
			PubSub.trigger(AppEvents.WINDOW_RESIZE_START);
		}
		timer = setTimeout(function() {
			timer = null;
			$.event.trigger(AppEvents.WINDOW_RESIZE_STOP);
			PubSub.trigger(AppEvents.WINDOW_RESIZE_STOP);
		}, timeoutTime);
	});
};

export default resizeStartStopEvents;
