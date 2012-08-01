$(document).ready(function(){
	$('.rotateimage').each(function(){
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