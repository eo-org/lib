$(document).ready(function(){
	var ground = $('.ground');
	var groundlist = $('.group-list');
	var overlap = $('.overlap');
	$(ground).first().addClass('groundCurrent');
	$(groundlist).first().addClass('garoundListCurrent');
	ground.each(function(i,groundEl){
		$(groundEl).click(function(){
			$('.ground').removeClass('groundCurrent');
			$('.garoundListCurrent').removeClass('garoundListCurrent');
			$(this).addClass('groundCurrent');
			$(groundlist).each(function(j,groundlistEl){
				if( i == j ){
					$(overlap).css('left',(overlap.width()+7)*j+6+'px');
					$(this).addClass('garoundListCurrent');
				}
			})
		})
	})
})