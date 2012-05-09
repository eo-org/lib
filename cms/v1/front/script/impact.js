/********************************/
/*tabs control*******************/
/********************************/
$(document).ready(function() {
	var tabs = $('.grid-tab');
	tabs.each(function(i, tab) {
		var handles = $(tab).find('.tab-handles .handle');
		var contents = $(tab).find('.tab-contents .content');
		
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
		});
	});
});
/*********************************/
/********news rool newslist*******/
/*********************************/
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
		//var data=jQuery.parseJSON($('.roll-slide').attr('data'));
		//var offsett=parseInt(data.rolldelay);
		//console.log(offsett);
		var offset=50;
		var rollh=$(rolldiv).height();
		var listh=$(rolldiv).find('ul:first').height();
		if(listh>=rollh){
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
/*********************************/
/******productNS rool product*****/
/*********************************/
$(document).ready(function(){
	var roll=$('.leftroll');
	roll.each(function(i,rolldiv){
		//alert(roolh);	
		var rollW=$(rolldiv).width();
		//var data=jQuery.parseJSON($('.image-group-slide').attr('data'));
		//var offsett=parseInt(data.delay);
		//console.log(offsett);
		var offset=50;
		var listW=0;
		$(rolldiv).find('ul li').each(function(){
			listW+=$(this).width();
		});
		$(rolldiv).find('ul').width(listW*2);
		$('#rollborder').css({
			overflow: 'hidden',
			position: 'absolute',
			left:0
		});
		$('li').css({
			position: 'relative'
		});
		if(listW>=rollW){
			var marleft=0;
			$(rolldiv).find('ul li').clone().attr('class','').appendTo($(rolldiv).find('ul'));
			function rollText(){
				marleft++;
				if(marleft>listW){
					//alert(1);
					marleft=marleft-listW;
					$(rolldiv).find('ul').css('margin-left',-marleft);
				}
				else{
					//alert(1);
					$(rolldiv).find('ul').css('margin-left',-marleft);
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
});	
/*************************************/
/**********AdGroupV2 pupup************/
/*************************************/
$(document).ready(function(){
	var popup=$('.popup');
	popup.each(function(i,popupdiv){
		var liEls = $(popupdiv).find('li');
		liEls.each(function(j, liEl) {
			$(liEl).css({
				position: 'relative'
			});
			var divEl = $(liEl).find('div');		
			var liHeight = $(liEl).height();
			var divHeight =$(divEl).height();
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
/*************************************/
/***********AdGroupV2 rotate**********/
/*************************************/
$(document).ready(function(){
	var roll=$('.alternate').find('.alternatearea');
	roll.each(function(i,rolldiv){
		var rollUW=$(rolldiv).find('ul').width();
		var listW=0;
		var num=0;
		//var data=jQuery.parseJSON($('.image-group-slide').attr('data'));
		var offer=1000;
		var interval=2000;
		var moving;
		var index=1;
		var rollW=$(rolldiv).find('li').outerWidth()*index;
		$(rolldiv).find('ul').clone().appendTo($(rolldiv));
		$('.alternateBarea').css({
			overflow: 'hidden',
			position: 'relative'
		});
		$('.alternatearea').css({
			position: 'relative'
		});
		function autoGo(){
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
		function auto(){
			auto=setInterval(autoGo,interval);
			$(rolldiv).mouseover(function(){
				clearInterval(auto);
			}).mouseout(function(){
				auto=setInterval(autoGo,interval);
			});	
			$('#leftalternate').mouseover(function(){
				clearInterval(auto);
				if(num==rollUW){
					num=0;
					$(rolldiv).animate({right: '0px'},0);
				}
			}).mouseout(function(){
				auto=setInterval(autoGo,interval);
			});
			$('#rightalternate').mouseover(function(){
				clearInterval(auto);
				if(num==0){
					num=rollUW;
					$(rolldiv).animate({right:rollUW+'px'},0);
				} 
			}).mouseout(function(){
				auto=setInterval(autoGo,interval);
				if(num==rollUW){
					num=0;
					$(rolldiv).animate({right:'0px'},0);
				}
			});
		}
		function leftscroll(){
			$('#leftalternate').click(function(){
				num+=rollW;
				$(rolldiv).animate(
				{	right: '+='+rollW+'px'},
				offer
				);
				if(num==rollUW){
					num=0;
					$(rolldiv).animate({right:'0px'},0);
				}
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
			})
		}
		auto();
		leftscroll();
		rightscroll();
	}); 
})	
/*************************************/
/**************imageroll**************/
/*************************************/
$(document).ready(function(){
	$('.imageroll').each(function(){
		var index=null;
		var timer=0;
		var data=jQuery.parseJSON($('.image-group-slide').attr('data'));
		var offset=parseInt(data.delay);
		var change=$('.bigimage');
		change.each(function(n,changediv){
			$('.bigimage div').each(function(i,tab){
				$(tab).attr('id','imgshow'+i);	
			});
			$('.alternate li').each(function(k,l){
				$(l).attr('id','litter'+k)	
			});
			auto();
			hookThumb();
		})
		function hookThumb(){
			$('.alternate li').bind('click',function(){
				if(timer){
					clearTimeout(timer);
				}
				var idname=$(this).attr('id');
				index=getIndex(idname.substr(6));
				rechange(index);
				slideImage(index);
				timer=window.setTimeout(auto,offset);
			});
		}
		function getIndex(a){
			for(var i=0;i< $('.bigimage a').length;i++){
				if(i==a) return i;
			};
		}
		function rechange(loop){
			var id='litter'+loop;
			$('.alternate li.current').removeClass('current');
			$('#'+id).addClass('current').siblings(':visible');
		}
		function slideImage(b){
			var id='#imgshow'+b;
			$(id).siblings(':visible').animate({opacity: 0},2000,function(){
			});
			$(id).animate({opacity: 1},2000,function(){
			}).show();
		}
		function auto(){
			index++;
			if(index > $('.bigimage div').length){
				index=0;
			}
			rechange(index);
			slideImage(index);
			timer=window.setTimeout(auto,offset);
		}
	})
});
/*************************************/
/*************imagemagnify************/
/*************************************/
$(document).ready(function(){
	$('.imagemagnify').each(function(){
		$('#ZoomBox').css({
			position: 'absolute',
			display: 'none'
		});
		$('#ZoomBox img').css({
			position: 'absolute'
		});
		$("#Zoom").mousemove(function(e){	
			$("#ZoomBox").show();
			var x = e.clientX - $("#SmallImg").offset().left;
			var y = e.clientY - $("#SmallImg").offset().top;
			smallImgWidth = $("#SmallImg").width();		
			smallImgHeight = $("#SmallImg").height();
			bigImgWidth = $("#bigImg").width();
			bigImgHeight = $("#bigImg").height();
			zoomWidth = $("#ZoomBox").width();
			zoomHeight = $("#ZoomBox").height();
			if ( x < 0 || x > smallImgWidth || y < 0 || y > smallImgHeight) {
				$("#ZoomBox").hide();
			}else{
				$("#ZoomBox").css("left", x - zoomWidth/2);
				$("#ZoomBox").css("top", y - zoomHeight/2);
				x = - x*(bigImgWidth/smallImgWidth) + zoomWidth/2;
				y = - y*(bigImgWidth/smallImgWidth) + zoomHeight/2;
				$("#bigImg").css("left", x);
				$("#bigImg").css("top", y);
			}
		});
	})
})
/*************************************/
/**************magnifyImg*************/
/*************************************/
$(document).ready(function(){
	$.fn.magnifyImg=function(){
		$(this).find('img').click(function(){
			var imageS=$(this).attr('src');
			$('body').append('<div class="rollbackground"></div>');
			var documentheight =$(document).height();
			var documentwidth = $(document).width();
			$('.rollbackground').css({
				opacity: '0.5',
				backgroundColor: '#000000',
				position: 'absolute',
				top: 0,
				width: documentwidth,
				height: documentheight
			});
			$('body').append('<div class="bigimagerarea" ><div class="bigimageroll" ><img src='+imageS+' width="680" height="400"></div><div class="closeMI"><a href="javascript:void(0)"><img src="http://img.wha.enorange.com/161/close.png"></a></div></div>');
			$('.bigimageroll').find('img').css({
				opacity: '1',
				position: 'absolute',
				top: '300px',
				left: '290px',
				border: '5px solid #ccc'
			});
			$('.closeMI').css({
				position: 'absolute',
				top: '290px',
				left: '960px'
			});
			$('.closeMI').mouseover(function(){
				$('.closeMI').find('img').attr('src','http://img.wha.enorange.com/161/closeb.png');
			}).mouseout(function(){
				$('.closeMI').find('img').attr('src','http://img.wha.enorange.com/161/close.png');
			});
			$('.closeMI').click(function(){
				$('.bigimagerarea').remove();
				$('.rollbackground').remove();
			});
		})
	};
	$('.magnifyImg').magnifyImg();
})
