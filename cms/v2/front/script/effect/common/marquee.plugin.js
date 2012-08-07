$(document).ready(function(){
	var roll=$('.leftroll');
	roll.each(function(i,rolldiv){
		var data = jQuery.parseJSON($('.image-group-marquee').attr('data'));
		var offset=parseInt(data.delay);
		var listW=0;
		if(data.direction == 'left'){
			var rollW=$(rolldiv).width();
			$(rolldiv).find('ul li').each(function(){
				listW+=$(this).width();
			});
			$(rolldiv).find('ul').width(listW*2);
		}else{
			var rollW = $(rolldiv).height();
			listW = $(rolldiv).find('ul:first').height();
		}
		$('#rollborder').css({
			overflow: 'hidden',
			position: 'absolute',
			left: 0
		});
		$('li').css({
			position: 'relative'
		});
		
		if(listW>=rollW){
			if(data.direction == 'left'){
				var marleft=0;
				$(rolldiv).find('ul li').clone().attr('class','').appendTo($(rolldiv).find('ul'));
				function rollText(){
					marleft+=1;
					if(marleft>listW){
						marleft=marleft-listW;
						$(rolldiv).find('ul').css('margin-left',-marleft);
					}
					else{
						$(rolldiv).find('ul').css('margin-left',-marleft);
					}
				}
			}else{
				var martop=0;
				$(rolldiv).find('ul').clone().attr('class','').appendTo($(rolldiv));
				function rollText(){
					martop++;
					if(martop>listW){
						martop=0;
						$(rolldiv).find('ul').css('margin-top',-martop);
					}
					else{
						$(rolldiv).find('ul:first').css('margin-top',-martop);
					}
				}
			}	
			var int=setInterval(rollText,offset);
			$(rolldiv).hover(
				function(){
					clearInterval(int);
				},
				function(){
					int=setInterval(rollText,offset);
				}
			);
		};
	});
})