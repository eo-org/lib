$(document).ready(function(){	
	var timer;
	var clickDiv;
	var clickModel;
	var index = -1;
	var changeName;
	var data=jQuery.parseJSON($('.transition-frame').attr('data'));
	var offset=parseInt(data.delay);
	var mouseHoverChangeModel;
	var itemArray = new Array();
	var slideArray = $('.slide');
	var mouseHoverModel = $('.item'); 
	var mouseHoverModelFirst = $('.item:first');
	var clickActionModel = $('.item').children().attr('class');
	
	slideArray.each(function(i,slideDiv){
		$(this).attr('id','bigImage'+i);
	});
	mouseHoverModel.each(function(j,itemDiv){
		$(this).attr('id','smailImage'+j);
		itemArray[j] = $('#'+$(this).attr('id'));
	});
	
	mouseHoverModel.bind('click',clickAction);
	auto();
	
	mouseHoverModel.mouseover(function(){
		mouseHoverChangeModel = $(this).children().children('.hover');
		mouseHoverChangeModel.css({'display':'block','top':'-160px'});
		mouseHoverChangeModel.stop().animate(
			{
				top: '-140px'
			},
			500
		)
	}).mouseout(function(){
		mouseHoverChangeModel.css({'display':'none','top':'-160px'});
	})
	
	function auto() {
		index++;
		if(index > mouseHoverModel.length-1){
			index = 0;
		}
		rechange(index);
		itemArray[index].trigger('click');
		showPhoto();
		timer=window.setTimeout(auto,offset);
	}
	
	function clickAction(){
		clickDiv = $(this);
		clickModel = $(this).children();
		if($(this).children().attr('class') == clickActionModel){
			if(timer){
					clearTimeout(timer);
			}
			clickImage();
			hookThumb();
			showPhoto();
		}
	}
	function clickImage(){
		mouseHoverModel.unbind('click');
		$('.action').css('margin-top','0px');
		$('.action').removeClass('action');
		clickModel.stop().animate(
			{
				'margin-top': '-15px' 
			},
			500,
			function(){
				clickModel.addClass('action');
				mouseHoverModel.bind('click',clickAction);
			}
		);
	}
	function getIndex(a){
		for(var i=0;i< mouseHoverModel.length;i++){
			if(i==a) return i;
		};
	}
	function hookThumb(){
		if(timer){
					clearTimeout(timer);
		}
		index = getIndex(clickDiv.attr('id').substr(10));
		rechange(index);
		showPhoto();
		timer=window.setTimeout(auto,offset);
	}
	function rechange(loop){
		changeName = 'bigImage'+loop;
		slideArray.removeClass('current');
		$('#'+changeName).addClass('current').siblings(':visible');
	}
	function showPhoto(){
		$('#'+changeName).stop().animate(
			{
				'opacity': 1
			},
			500
		);
		$('#'+changeName).children('.introducebanner').stop().animate(
			{
				'top': '90px',
				'opacity': '1'
			},
			800
		);
		$('#'+changeName).siblings(':visible').animate(
			{
				'opacity': 0
			},
			500
		);
		$('#'+changeName).siblings(':visible').children('.introducebanner').stop().animate(
			{
				'top': '0px',
				'opacity': '0'
			},
			800
		);
	}
})