(function($) {
	$.fn.fillSelector = function(selector, options) {
		$.getJSON(
			options.url,
			function(jsonObj) {
				var opt = '';
				$.each(jsonObj.cities, function(i,jo) {
					opt += '<option value="' + i + '">' + jo + '</option>';
				});
				selector.html(opt);
			}
		);
	}
})(jQuery);