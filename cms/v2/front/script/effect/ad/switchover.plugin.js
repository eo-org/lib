$(document).ready(function(){
	$('.imageroll').each(function(){
		var index=-1;
		var timer=0;
		var num=0;
		var offer=1000;
		var rolldiv=$('.alternate').find('.alternatearea');
		var rollW=$(rolldiv).find('li').outerWidth();
		var rollUW=$(rolldiv).find('ul').width();
		var data=jQuery.parseJSON($('.image-group-slide').attr('data'));
		var offset=data.delay;
		var showAuto = data.showauto;
		var change=$('.bigimage');
		$('.alternateBarea').css({
			overflow: 'hidden',
			position: 'relative'
		});
		$('.alternatearea').css({
			position: 'relative',
			right:'0px'
		});
		change.each(function(n,changediv){
			$('.bigimage div').each(function(i,tab){
				$(tab).attr('id','imgshow'+i);	
			});
			$('.alternate li').each(function(k,l){
				$(l).attr('class','litter'+k)	
			});
			$(rolldiv).find('ul').clone().appendTo($(rolldiv));
			hookThumb();
			leftscroll();
			rightscroll();
		});
		if(showAuto == 'y'){
			$(rolldiv).mouseover(function(){
				clearTimeout(timer);
			}).mouseout(function(){
				timer = setTimeout(auto,offset);
			});	
			$('#leftalternate').mouseover(function(){
				clearTimeout(timer);
				if(num==rollUW){
					num=0;
					$(rolldiv).animate({right: '0px'},0);
				}
			}).mouseout(function(){
				timer = setTimeout(auto,offset);
			});
			$('#rightalternate').mouseover(function(){
				clearTimeout(timer);
				if(num==0){
					num=rollUW;
					$(rolldiv).animate({right:rollUW+'px'},0);
				} 
			}).mouseout(function(){
				timer = setTimeout(auto,offset);
				if(num==rollUW){
					num=0;
					$(rolldiv).animate({right:'0px'},0);
				}
			});
		}
		auto();
		function hookThumb(){
			$('.alternate li').bind('click',function(){
				if($(this).attr('type')!='current'){
					if(timer){
						clearTimeout(timer);
					}
					var idname=$(this).attr('class');
					index=getIndex(idname.substr(6));
					rechange(index);
					slideImage(index);
					timer = setTimeout(auto,offset);
				}
			});
		};
		function getIndex(a){
			for(var i=0;i< $('.bigimage a').length;i++){
				if(i==a) return i;
			};
		};
		function rechange(loop){
			var id='litter'+loop;
			$('.alternate li.current').removeAttr('type');
			$('.alternate li.current').removeClass('current');
			$('.'+id).addClass('current');
			$('.'+id).attr('type','current');
		};
		function slideImage(b){
			var id='#imgshow'+b;
			$(id).siblings(':visible').animate({opacity: 0},1000,function(){});
			$(id).animate({opacity: 1},1000,function(){}).show();
		};
		function auto(){
			index++;
			if(index > $('.bigimage div').length){
				index=0;
			}
			rechange(index);
			slideImage(index);
			if(showAuto == 'y'){
				num+=rollW;
				$(rolldiv).animate(
					{right:'+='+rollW+'px'},
					offer
				)
				if(num>=rollUW){
					num=0;
					$(rolldiv).animate({right:'0px'},0);
				}
			}
			timer = setTimeout(auto,offset);
		};
		function leftscroll(){
			$('#leftalternate').click(function(){
				if(timer){
					clearTimeout(timer);
				}
				num+=rollW;
				$(rolldiv).animate(
				{	
					right: '+='+rollW+'px'},
					offer
				);
				if(num>=rollUW){
					num=0;
					$(rolldiv).animate({right:'0px'},0);
				}
				idname = $('.current').attr('class');
				index=getIndex(idname.substr(6,2))-1;
				if(index<0){
					index=rolldiv.find('ul:first li').length-1;
				}
				rechange(index);
				slideImage(index);
			})
		};
		function rightscroll(){
			$('#rightalternate').click(function(){
				if(timer){
					clearTimeout(timer);
				}
				num-=rollW;				
				$(rolldiv).animate({right:'-='+rollW+'px'},offer);
				if(num<=0){
					num=rollUW;
					$(rolldiv).animate({right:rollUW+'px'},0);
				}
				idname = $('.current').attr('class');
				index=getIndex(idname.substr(6,2))+1;
				if(index>rolldiv.find('ul:first li').length-1){
					index=0;
				}
				rechange(index);
				slideImage(index);
			})
		};
	})
})