var Prompt = (function(){
	var instantiated;
	
	var init = function() {
		$('body').append('<div class="prompt-loading-box" style="border-radius: 4px 4px 4px 4px;line-height:30px;background:#E0E0E0;width:260px;height:32px;position:fixed;bottom:0;right:28px;display:block;"><div class=consealTips>loading...</div></div>');
		$('body').append('<div class="prompt-hint-box" style="border-radius: 7px 7px 7px 7px;line-height:30px;text-align: center;width:260px;height:30px;background: #FFA500;position:fixed;top: 57px;right:-260px"><div></div></div>');
	};
	
	function prompt(){
		return {
			showLoadingBox: function(){
				$('.consealTips').css({
					'background': 'url(attribute-editor_files/load.gif) no-repeat',
					'width': '200px',
					'height': '32px',
					'margin-left': '10px',
					'padding-left': '50px'
				});
				$('.prompt-loading-box').animate(
					{'bottom': '40px'},
					500
				);
			},
			hiddenLoadingBox: function(){
				$('.prompt-loading-box').animate({
						'bottom': '0px',
					},
					500,
					function(){
						$('.prompt-loading-box').remove();
					}
				);
			},
			showHintBox: function(){
				$('.affirm').animate(
					{
						'right': '28px', 
					},
					1000
				);
			},
			hiddenHintBox: function(){
				$('.affirm').animate(
					{
						'right': '-260px', 
					},
					1000,
					function(){
						$('.conseal').remove();
					}
				);
			},
			showMask: function(){
				$('body').append('<div class="popupbackground"></div>');
				var documentheight = $(document).height();
				var documentwidth = $(document).width();
				$('.popupbackground').css({
					'opacity': '0.5',
					'backgroundColor': '#cccccc',
					'width': documentwidth,
					'height': documentheight,
					'position': 'absolute',
					'top': 0
				});
			},
			appendMaskCount: function(Ttop,content){
				var documentwidth = $(document).width();
				$('body').append('<div class="attribute-editor">'+content+'</div>');
				$('.attribute-editor').css({
					'position': 'absolute',
					'width': '500px',
					'min-height': '300px',
					'background': '#ffffff'
				});
				var leftW = (parseInt(documentwidth) - 500)/2;
				$('.attribute-editor').css({
					'position': 'absolute',
					'top': Ttop+'px',
					'left': leftW+'px',
					'border': '10px solid #BBBBBB',
					'border-radius': '4px 4px 4px 4px'
				});
				$('body').append('<div class=closePopup>x</div>');
				$('.closePopup').css({
					'position': 'absolute',
					'cursor': 'pointer',
					'top': Ttop-6+'px',
					'left': leftW+500+10+'px'
				});
			},
			closeMask: function(){
				$('.popupbackground').remove();
				$('.attribute-editor').remove();
				$('.closePopup').remove();
			}
		}
	}
	return {
		getInstance :function(){
			if(!instantiated){
				init();
				instantiated = prompt();
			}
			return instantiated; 
		}
	}
})()
