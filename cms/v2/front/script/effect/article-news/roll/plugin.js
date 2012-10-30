$(document).ready(function(){
	var rolls=$('.downroll');
	rolls.each(function(i,rolldiv){
		$(rolldiv).css({
			overflow: 'hidden',
			position: 'absolute'
		});
		$(rolldiv).find('li').css({
			position: 'relative'
		});

		var offset=50;
		var rollh=$(rolldiv).height();
		var listh=$(rolldiv).find('ul:first').height();
		if(listh>=rollh) {
			var martop=0;
			$(rolldiv).find('ul').clone().attr('class','').appendTo($(rolldiv));
			function rollText(){
				martop++;
				if(martop>listh){
					martop=0;
					$(rolldiv).find('ul').css('margin-top',-martop);
				} else {
					$(rolldiv).find('ul:first').css('margin-top',-martop);
				}
			};
			var inte=setInterval(rollText,offset);
			$(rolldiv).hover(
				function(){
					clearInterval(inte);
				},
				function(){
					inte=setInterval(rollText,50);
				}
			);
		}
    });
});	