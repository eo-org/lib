$(document).ready(function() {
	var tabs = $('.grid-tab');
	tabs.each(function(i, tab) {
		var handles = $(tab).find('.tab-handles>.tab-handle');
		var contents = $(tab).find('.tab-contents>.tab-content');
		
		contents.each(function(j, c) {
			$(c).css({position: 'absolute', left: 0, top: 0});
			if(j == 0) {
				$(c).css({'zIndex': 3});
			} else {
				$(c).css({'zIndex': 0});
			}
		});
		
		handles.each(function(j, h) {
			if(j == 0) {
				$(h).addClass('selected');
			}
			if($(tab).data('response') == 'mouseover') {
				$(h).mouseover(function() {
					handles.each(function(k, h) {
						if(k == j) {
							$(h).addClass('selected');
						} else {
							$(h).removeClass('selected');
						}
					});
					contents.each(function(k, c) {
						if(k == j) {
							$(c).css({'zIndex': 3});
						} else {
							$(c).css({'zIndex': 0});
						}
					});
				});
			} else {
				$(h).click(function() {
					handles.each(function(k, h) {
						if(k == j) {
							$(h).addClass('selected');
						} else {
							$(h).removeClass('selected');
						}
					});
					contents.each(function(k, c) {
						if(k == j) {
							$(c).css({'zIndex': 3});
						} else {
							$(c).css({'zIndex': 0});
						}
					});
				});
			}
		});
	});
});