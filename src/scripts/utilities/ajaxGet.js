/**
 * ajaxGet
 * @author: Chris Nelson <cnelson87@gmail.com>
 * @description: Returns an Ajax GET request using deferred.
 * @param: url is required, dataType is optional.
 * @return: json, html, text
 */

const ajaxGet = function(url, dataType, crossDomain) {
	if (!url) return;
	return $.ajax({
		type: 'GET',
		url: url,
		dataType: dataType || 'json'
	});
};

export default ajaxGet;
