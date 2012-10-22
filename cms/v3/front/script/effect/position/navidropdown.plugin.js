$(document).ready(function() {
	var containerUl = $('.brick-navidropdown > ul');
	var handles = containerUl.children();
	handles.each(function(i, handle) {
		$(handle).children('ul').css({'display':'none'});
		$(handle).children('ul').children('li').children('ul').css({'display':'none'});
		$(handle).mouseover(function() {
			$(this).addClass('mouseover');
			$(this).children('ul').css({'display':'block'});
			if($(this).children('ul').children('li').children('ul') != undefined){
				$(this).children('ul').children('li').mouseover(function(){
					$(this).children('ul').css({'display':'block'});
				});
			}
		}).mouseout(function() {
			$(this).removeClass('mouseover');
			$(this).children('ul').css({'display':'none'});
			$(this).children('ul').children('li').children('ul').css({'display':'none'});
		});
	});
});
