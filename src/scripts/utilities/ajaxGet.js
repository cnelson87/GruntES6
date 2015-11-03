/**
 *  ajaxGet
 *  @author Chris Nelson
 *	Returns an Ajax GET request using deferred, url is required,
 *  dataType and crossDomain are optional.
 *  @return: json, html, text
 */

const ajaxGet = function(url, dataType, crossDomain) {
	return $.ajax({
		type: 'GET',
		url: url,
		dataType: dataType || 'json',
		crossDomain: crossDomain || false
	});
};

export default ajaxGet;
