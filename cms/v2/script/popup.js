$(document).ready(function(){
	$.fn.popupTips = function(DWidth,DHight,Ttop){
		$(this).bind('click',function(){
			$('body').append('<div class="popupbackground"></div>');
			var documentheight = $(document).height();
			var documentwidth = $(document).width();
			$('.popupbackground').css({
				opacity: '0.5',
				backgroundColor: '#ffffff',
				width: documentwidth,
				height: documentheight,
				position: 'absolute',
				top: 0
			});
			$('body').append('<div class="attribute-editor">dsfsesf</div>');
			$('.attribute-editor').css({
				position: 'absolute',
				width: DWidth,
				height: DHight
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
				top: Ttop,
				left: leftW+DWidth+7
			});
			$('.closePopup').click(function(){
				$('.popupbackground').remove();
				$('.attribute-editor').remove();
				$('.closePopup').remove();
			});
		})	
	}
	//$('.attribute-library-item').popupTips(200,100,200);
})
