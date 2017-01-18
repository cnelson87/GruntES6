/**
 * AppConfig
 * @description: Defines application constants
 */

if (!window.location.origin) {
	window.location.origin = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}

const AppConfig = {

	siteUrl: window.location.origin,
	isIE9: navigator.userAgent.indexOf('MSIE 9') !== -1,
	isIE10: navigator.userAgent.indexOf('MSIE 10') !== -1,
	isIE11: (navigator.userAgent.indexOf('Windows NT') !== -1 && navigator.userAgent.indexOf('rv:11') !== -1),
	isAndroid: /(android)/i.test(navigator.userAgent),
	isIOS: navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false,
	hasFormValidation: typeof document.createElement('input').checkValidity === 'function',
	hasTouch: Boolean('ontouchstart' in window || navigator.maxTouchPoints || navigator.msMaxTouchPoints),

	urls: {
		fibonacci: '/_api/promises/fibonacci.json',
		primes: '/_api/promises/primes.json',
		sevens: '/_api/promises/sevens.json',
		videosPlaylistLIVE: 'https://www.googleapis.com/youtube/v3/playlistItems',
		videosPlaylistDEV: '/_api/videos/playlist.json',
		homepageContent: '/_api/homepage/content.json'
	},

	// Starbucks Members playlist
	youtubePlaylistId: 'PLLt7Vrrx9E2BDUdeDsVfeR4Qx0FDLTo7v',

	// my 'chrisn.wearepop@gmail.com' key
	youtubeApiKey: 'AIzaSyDpNKX16BmckoJ14akwMxk0mHuJWgvNuBI',

	isMobileView: null,
	isTabletView: null,
	isDesktopView: null,
	currentBreakpoint: null,
	breakpoints: {
		1: 'mobile',
		2: 'tablet',
		3: 'desktop'
	},

	topOffset : 0

};

export default AppConfig;
