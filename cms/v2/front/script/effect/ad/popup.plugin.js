$(document).ready(function(){
	var popupUls = $('.brick-ad-group-popup');
	popupUls.each(function(i, popup){
		var liEls = $(popup).find('li');
		liEls.each(function(j, liEl) {
			$(liEl).css({
				position: 'relative',
				overflow: 'hidden'
			});
			var divEl = $(liEl).find('div.popup-item');		
			var liHeight = $(liEl).height();
			var divHeight = $(divEl).height();
			var divToTop = liHeight - (divHeight * 2);
			var liwidth = $(liEl).find('img').width();
			divEl.css({
				position: 'absolute',
				opacity: '0',
				width: liwidth,
				top: liHeight - divHeight,
				left: 0
			});
			$(liEl).mouseover(function(){
				$(divEl).stop().animate({
					opacity: 0.8,
					top: divToTop
				},"slow");
			}).mouseout(function(){
				$(divEl).stop().animate({
					opacity: 0,
					top: liHeight - divHeight
				},"fast");
			});
		});
	});
});