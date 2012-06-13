$(document).ready(function(){
	$('.jp-play').css({
		'line-height':'12px',
		height: '12px',
		width: '12px',
		display: 'block',
		'float': 'left',
		background:'url(' + window.LIB_URI + '/front/image/player.png) repeat-x scroll -0px -0px transparent'
	});
	$('.jp-pause').css({
		'line-height':'12px',
		height: '12px',
		width: '12px',
		display: 'block',
		'float': 'left',
		background:'url(' + window.LIB_URI + '/front/image/player.png) repeat-x scroll -12px -0px transparent'
	});
	$('.jp-mute').css({
		'line-height':'12px',
		height: '12px',
		width: '12px',
		display: 'block',
		'float': 'left',
		background:'url(' + window.LIB_URI + '/front/image/player.png) repeat-x scroll -36px -0px transparent'		
	});
	$('.jp-volume-bar').css({
		width: '140px',
		height: '6px',
		border: '1px solid black',
		'border-radius': '4px 4px 4px 4px',
		position: 'relative',
		top:'-10px',
		left:'36px'
	});
	$('.jp-volume-bar-value').css({
		background: 'red',
		height: '6px',
		'border-radius': '4px 4px 4px 4px'		
	});
	var data = jQuery.parseJSON($('.player-box').attr('data'));
	$('#jquery_jplayer_1').jPlayer({
		ready: function(event){
			$(this).jPlayer('setMedia',{
				mp3: data.fileurl					
			}).jPlayer('play').jPlayer('repeat');
		},
		swfPath: ' '+ window.LIB_URI + '/front/script/',
		supplied: 'mp3',
		wmode: 'window'
	});
})