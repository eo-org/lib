$(document).ready(function(){
	var handles = $('ul.tab-handle li.handle');
	var contents = $('ul.tab-content li.content-item');
	var overlap = $('ul.tab-content li.handle-overlap');
	
	$(handles).first().addClass('current');
	$(contents).first().addClass('current');
	
	handles.each(function(i,handleLi){
		$(handleLi).click(function(){
			handles.removeClass('current');
			contents.removeClass('current');
			
			$(this).addClass('current');
			contents.each(function(j, contentLi){
				if( i == j ){
					$(overlap).css('left', 107 * j + 11 + 'px');
					$(contentLi).addClass('current');
				}
			})
		})
	})
})