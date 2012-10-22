$(document).ready(function(){
	$('.imageroll').each(function(){
		var index=1;
		var timer=0;
		var num=0;
		var offer=1000;
		var rolldiv=$('.alternate').find('.alternatearea');
		var rollW=$(rolldiv).find('li').outerWidth();
		var rollUW=$(rolldiv).find('ul').width();
		var data=jQuery.parseJSON($('.image-group-slide').attr('data'));
		var offset=2000;
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
			auto();
			hookThumb();
			leftscroll();
			rightscroll();
		})
		//timer=window.setInterval(defaute,offset);
		function defaute(){
			$('#leftalternate').trigger('click');
			$(rolldiv).mouseover(function(){
				//clearInterval(timer);
			}).mouseout(function(){
				//timer=window.setInterval(defaute,offset);
			});
			$('#leftalternate').mouseover(function(){
				clearInterval(timer);
				if(num>=rollUW){
					num=0;
					$(rolldiv).animate({right:'0px'},0);
				}
			}).mouseover(function(){
				//timer=window.setInterval(defaute,offset);
			});
			$('#rightalternate').mouseover(function(){
				//clearInterval(timer);
				if(num<=0){
					num=rollUW;
					$(rolldiv).animate({right:rollUW+'px'},0);
				}
			}).mouseout(function(){
				//timer=window.setInterval(defaute,offset);
			});
		}
		function hookThumb(){
			$('.alternate li').bind('click',function(){
				if($(this).attr('type')!='current'){	
					if(timer){
						//clearInterval(timer);
						//clearInterval(timer);
					}
					var idname=$(this).attr('class');
					index=getIndex(idname.substr(6));
					var currentIndex = getIndex($('.alternate li.current').attr('class').substr(6,2))-index;
					if(currentIndex>0&&currentIndex<=2){
						num-=rollW*currentIndex;
						$(rolldiv).animate(
							{	right: '-='+rollW*currentIndex+'px'},
							offer
						);
						if(num<=0){
							num=rollUW;
							$(rolldiv).animate({right:rollUW+'px'},0,function(){});
						}
					}else if(currentIndex<0&&currentIndex>=-2){
						num+=rollW*(-currentIndex);
						$(rolldiv).animate(
							{	right: '+='+rollW*(-currentIndex)+'px'},
							offer
						);
						if(num>=rollUW){
							num=0;
							$(rolldiv).animate({right:'0px'},0);
						}
					}else if(currentIndex<-2){
						if(currentIndex == -9){
							currentIndex = 1;
						}else{
							if(currentIndex == -8 && currentIndex+index == 8){
								currentIndex = 2; 
							}else{
								currentIndex = 2;
							}
						}
						num-=rollW*currentIndex;
						$(rolldiv).animate(
							{	right: '-='+rollW*currentIndex+'px'},
							offer
						);
						if(num<=0){
							num=rollUW;
							$(rolldiv).animate({right:rollUW+'px'},0);
						}
					}else if(currentIndex>2){
						if(currentIndex == 9)
						{ 	
							currentIndex = 1;
						}else{	
							if(currentIndex == 8 && currentIndex+index == 9){
								currentIndex = 2; 
							}else{
								currentIndex = 2;
							}
						}
						num+=rollW*currentIndex;
						$(rolldiv).animate(
							{	right: '+='+rollW*currentIndex+'px'},
							offer
						);
						if(num>=rollUW){
							num=0;
							$(rolldiv).animate({right:'0px'},0);
						}
					}
				rechange(index);
				slideImage(index);
				//timer=window.setInterval(defaute,offset);
				}
			});
		}
		function getIndex(a){
			for(var i=0;i< $('.bigimage a').length;i++){
				if(i==a) return i;
			};
		}
		function rechange(loop){
			var id='litter'+loop;
			$('.alternate li.current').removeAttr('type');
			$('.alternate li.current').removeClass('current');
			$('.'+id).addClass('current');
			$('.'+id).attr('type','current');
		}
		function slideImage(b){
			var id='#imgshow'+b;
			$(id).siblings(':visible').animate({opacity: 0},2000,function(){});
			$(id).animate({opacity: 1},2000,function(){}).show();
		}
		function auto(){
			index++;
			if(index > $('.bigimage div').length){
				index=0;
			}
			rechange(index);
			slideImage(index);
		}
		function leftscroll(){
			$('#leftalternate').click(function(){
				//$(this).unbind('click');
				num+=rollW;
				$(rolldiv).animate(
				{	right: '+='+rollW+'px'},
				offer
				);
				if(num>=rollUW){
					num=0;
					$(rolldiv).animate({right:'0px'},0);
				}
				idname = $('.current').attr('class');
				index=getIndex(idname.substr(6,2))+1;
				if(index>rolldiv.find('ul:first li').length-1){
					index=0;
				}
				rechange(index);
				slideImage(index);
			})
		}
		function rightscroll(){
			$('#rightalternate').click(function(){
				num-=rollW;				
				$(rolldiv).animate({right:'-='+rollW+'px'},offer);
				if(num<=0){
					num=rollUW;
					$(rolldiv).animate({right:rollUW+'px'},0);
				}
				idname = $('.current').attr('class');
				index=getIndex(idname.substr(6,2))-1;
				if(index<0){
					index=rolldiv.find('ul:first li').length-1;
				}
				rechange(index);
				slideImage(index);
			})
		}
		function movingtext(){
			$('.alternatecontent').mouseover(function(){
				
			}).mouseout(function(){
				
			});
		}
	})
})