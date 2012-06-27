$(document).on('click', 'a.action-menu', function(e) {
	var WBContent = $("#lightbox-whitebox .content");
	if($(this).attr('method') == 'post') {
		e.preventDefault();
		WBContent.find('form:first').submit();
		return false;
	} else if($(this).attr('method') == 'get') {
		e.preventDefault();
		var urlSuffix = WBContent.find('form:first').serialize();
		var url = $(this).attr('href');
		$(location).attr('href', url + '?' + urlSuffix);
		return false;
	} else if($(this).attr('method') != undefined) {
		e.preventDefault();
		var fn = $(this).attr('method');
		window[fn]();
		return false;
	} else {
		//skip actions for link, just link
	}
});