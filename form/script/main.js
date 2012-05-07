var updateElementSetting = function(postUrl) {
	var postData = $('#element_setting').serialize();
	var aj = $.ajax({
		type: "POST",
		url: postUrl,
		data: postData,
		dataType: "json",
		success: function(obj) {
			if(obj.result == 'success') {
				var newLi = $(obj.html);
				var elementId = newLi.attr('id');
				
				$('#' + elementId).replaceWith(newLi);
				var lb = new Lightbox();
				lb.close();
			} else {
				var errorMsg = obj.html;
				var messageBox = $('.lightbox-flash-message');
				var errorMessageUl = messageBox.find('.error-message');
				errorMessageUl.empty();
				errorMessageUl.css('display', 'block');
				for(key in errorMsg) {
					for(code in errorMsg[key]) {
						errorMessageUl.append("<li>" + key + ':' + errorMsg[key][code] + "</li>");
					}
				}
			}
		}
	});
}