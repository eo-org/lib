$(document).on('click', '.link', function(evt) {
	evt.preventDefault();
	var url = $(this).attr('href');
	window.location.href = '#' + url;
});

$(document).on('click', '.action-menu', function(evt) {
	var method = $(this).attr('method');
	var url = $(this).attr('href');
	
	if(typeof method != undefined) {
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
					success: function(html) {
						if(html == 'success') {
							window.location.hash = 'refresh-page';
						} else {
							var lightBox = new Lightbox();
							lightBox.appendContent(html);
						}
					}
				});
				break;
			case undefined:
				break;
			default:
				evt.preventDefault();
				eval(method)(url);
				break;
		}
	}
});