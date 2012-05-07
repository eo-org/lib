$(document).on({
	'click': function() {
		CALLER = this;
		FINDER.show();
		$.ajax({
			url: "/admin/file/list/layout/disable",
			success: function(HTML) {
				content = FINDER.appendToContent(HTML);
				EventMessenger.bind('finder-responder-back', function(path) {
					$(CALLER).val(path);
				});
			}
		});
	},
	'mouseover': function() {
		$(this).css({'background-color':'#ddeeff'});
	},
	'mouseleave': function() {
		$(this).css({'background-color':'transparent'});
	}
}, '.icon-selector');