$(document).ready(function() {
	/**
	 * add new address.
	 * request an address form and save a new address for the current user.
	 */
	$('#address-selector-newbutton').click(function() {
		var result = $.ajax({
			type: "GET",
			url: '/user/address/edit-json/format/html',
			dataType: "html",
			success: function(html) {
				$('#address-selector-newform').append(html);
			}
		});
	});
	
	$('#address-selector-newform').on('click', '#addressSubmit', function(e) {
		e.preventDefault();
		var form = $(this).parents('form').filter(':first');
		var postData = form.serialize();
		var resp = $.ajax({
			type: "POST",
			url: '/user/address/edit-json/format/html',
			data: postData,
			success: function(html) {
				if(resp.getResponseHeader('result') == 'success') {
					$('#address-selector-newform').empty();
					
					$('#address-selector-list').append(
						"<li>" +
						"<input id='address_" + html.id + "' type='radio' name='address' value='" + html.id + "' /> " +
						"<label for='address_" + html.id + "'>" + html.fullAddress + "</label>" + 
						"</li>"
					);
				} else {
					alert('error msg');
				}
			}
		});
	});
});