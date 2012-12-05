$(document).on('click', '.action-menu', function(evt) {
	var method = $(this).attr('method');
	var url = $(this).attr('href');
	switch(method) {
		case 'post':
			evt.preventDefault();
			var xForm = $('#lightbox-whitebox').find('form:first');
			if(xForm.attr('action') != '') {
				url = xForm.attr('action');
			}
			
			var str = xForm.serialize();
			var aj = $.ajax({
				type: "POST",
				url: url,
				data: str,
				success: function(html, status, xhr) {
					var result = xhr.getResponseHeader('result');
					
					if(result == 'success') {
						window.location.hash = 'refresh-page';
					} else if(result == 'redirect') {
						var hashUrl = xhr.getResponseHeader('url');
						window.location.hash = hashUrl;
					} else {
						var lightBox = new Lightbox();
						lightBox.appendContent(html);
					}
				}
			});
			break;
		case undefined:
			evt.preventDefault();
			window.location.href = '#' + url;
			break;
		default:
			evt.preventDefault();
			eval(method)(url);
			break;
	}
});