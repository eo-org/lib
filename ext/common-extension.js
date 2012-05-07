$(document).on('click', 'a.action-menu', function(e) {
	var WBContent = $(".whitebox .content");
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
	} else if($(this).attr('method') == 'func') {
		e.preventDefault();
		var urlSuffix = ajaxFunc();
		var url = $(this).attr('href');
		$(location).attr('href', url + '/param/' + urlSuffix);
		return false;
	} else {
		//skip actions for link, just link
	}
});