/**
 *  urlQueryString
 *  @author Chris Nelson
 *	Reads query string and returns an object of name / value pairs.
 */

const urlQueryString = function() {
	let qs = location.search;
	let pairs = qs.slice(1).split('&');
	let result = {};
	if (!qs) return false;
	pairs.forEach(function(pair) {
		pair = pair.split('=');
		// let name = pair[0];
		// let value = decodeURIComponent(pair[1] || '');
		// result[name] = value;
		result[pair[0]] = decodeURIComponent(pair[1] || '');
	});
	return result;
};

export default urlQueryString;
