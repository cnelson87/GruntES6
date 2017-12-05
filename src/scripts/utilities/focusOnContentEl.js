/**
 * focusOnContentEl
 * @author: Chris Nelson <cnelson87@gmail.com>
 * @description: Sets focus on content and optionally scrolls into view
 * @param: jQuery $el is required, extraOffset is optional
 */

import AppConfig from 'config/AppConfig';

const focusOnContentEl = function($el, extraTopOffset = 0, scrollSpeed = AppConfig.timing.fast) {
	const $window = $(window);
	const $htmlBody = $('html, body');
	let topOffset = AppConfig.topOffset + extraTopOffset;
	let pnlTop = $el.offset().top;
	let pnlHeight = $el.outerHeight();
	let winTop = $window.scrollTop() + topOffset;
	let winHeight = $window.height() - topOffset;
	let scrollTop = pnlTop - topOffset;
	let $focusEl = $el.find(AppConfig.contentElements).first();

	if (pnlTop < winTop || pnlTop + pnlHeight > winTop + winHeight) {
		$htmlBody.animate({scrollTop: scrollTop}, scrollSpeed, function() {
			$focusEl.attr({'tabindex':'-1'}).focus();
		});
	} else {
		$focusEl.attr({'tabindex':'-1'}).focus();
	}

};

export default focusOnContentEl;
