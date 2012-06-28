jQuery.Prompt = {
	load: function(){
		if(!$('.conseal').attr('class')){
			$('body').append('<div class="conseal" style="border-radius: 4px 4px 4px 4px;line-height:30px;background:#E0E0E0;width:260px;height:32px;position:fixed;bottom:0;right:28px;display:block;"><div class=consealTips>loading...</div></div>');
			$('.consealTips').css({
				'background': 'url(attribute-editor_files/load.gif) no-repeat',
				'width': '200px',
				'height': '32px',
				'margin-left': '10px',
				'padding-left': '50px'
			});
			$('.conseal').animate(
				{bottom: '40px'},
				500
			);
		}
	},
	loadingRemove: function(){
		$('.conseal').animate(
			{
				bottom: '0px',
			},
			500,
			function(){
				$('.conseal').remove();
			}
		);
	},
	prompt: function(){
		$('body').append('<div class="affirm" style="border-radius: 7px 7px 7px 7px;line-height:30px;text-align: center;width:260px;height:30px;background: #FFA500;position:fixed;top: 57px;right:-260px"><div class=save-sort>保存排序</div></div>');
		$('.affirm').animate(
			{
				right: '28px', 
			},
			1000
		);
	},
	promptRemove: function(){
		$('.affirm').animate(
			{
				right: '-260px', 
			},
			1000,
			function(){
				$('.conseal').remove();
			}
		);
	},
	popup:	function(DWidth,DHight,Ttop,content){
		$('body').append('<div class="popupbackground"></div>');
		var documentheight = $(document).height();
		var documentwidth = $(document).width();
		$('.popupbackground').css({
			opacity: '0.5',
			backgroundColor: '#cccccc',
			width: documentwidth,
			height: documentheight,
			position: 'absolute',
			top: 0
		});
		$('body').append('<div class="attribute-editor">'+content+'</div>');
		$('.attribute-editor').css({
			position: 'absolute',
			width: DWidth,
			height: DHight,
			background: '#ffffff'
		});
		var leftW = (parseInt(documentwidth) - DWidth)/2;
		$('.attribute-editor').css({
			position: 'absolute',
			top: Ttop,
			left: leftW,
			border: '10px solid #BBBBBB',
			'border-radius': '4px 4px 4px 4px'
		});
		$('body').append('<div class=closePopup>×</div>');
		$('.closePopup').css({
			position: 'absolute',
			cursor: 'pointer',
			top: Ttop-6,
			left: leftW+DWidth+8
		});
		$('.closePopup').click(function(){
			$('.popupbackground').remove();
			$('.attribute-editor').remove();
			$('.closePopup').remove();
		});
	}
};
