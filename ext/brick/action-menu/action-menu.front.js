$(document).on('click', '.action-menu', function(evt) {
	console.log('button clicked!!');
	var method = $(this).attr('method');
	var url = $(this).attr('href');
	switch(method) {
		case 'post':
			evt.preventDefault();
			var xForm = $('#lightbox-whitebox').find('form:first');
			if(xForm.attr('action') != '') {
				url = xForm.attr('action');
			}
			if(CKEDITOR.instances['ck_text_editor']) {
				CKEDITOR.instances['ck_text_editor'].updateElement();
		    }
			
			var str = xForm.serialize();
			var aj = $.ajax({
				type: "POST",
				url: url,
				data: str,
				success: function(html, status, xhr) {
					$result = xhr.getResponseHeader('result');
					if($result == 'success') {
						window.location.hash = 'refresh-page';
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