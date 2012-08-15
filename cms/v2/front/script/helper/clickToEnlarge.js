$(document).ready(function(){
	var clickEnlarge = $('.clickToenlarge').find('img');
	clickEnlarge.each(function(i,clickImage){
		$(this).click(function(){
			var imageSrc = $(this).attr('src');
			$('body').append('<div class=clickImageBackground></div>');
			var clickImageBackground = $('.clickImageBackground');
			var documentWidth = $(document).width();
			var documentHeight = $(document).heigt();
			clickImageBackground.css({
				width: documentWidth,
				height: documentHeight,
				opacity: '0.2',
				position: 'absolute',
				top: '0',
				backgroundColor: '#000000'
			});
			clickImageBackground.animate({opacity: '0.6'},500);
			$('body').append('<div class="enlargeImage" ><div class="enlargeImagePopup"><img src='+imageSrc+' > </div><div class="close" style="display:none"><a href="javascript:void(0)"><img src="http://storage.aliyun.com/public-misc/4fe811e76d54610e05000000/070731d39820381770ea17fa34739629.gif"></a></div></div>');
			var enlargeImage = $('.enlargeImage');
			var enlargeImagePopup = $('.enlargeImagePopup').find('img');
			var imageWidth = enlargeImagePopup.width();
			var imageHeight = enlargeImagePopup.height();
			enlargeImage.css('position','fixed');
			enlargeImagePopup.css({
				position: 'fixed',
				'border-radius': '8px 8px 8px 8px',
				border: '7px solid black',
				width: '90',
				height: '60'
			});
			var imageSmailWidth = enlargeImagePopup.width();
			var imageSmailLeft = (documentWidth - imageSmailWidth)/2;
			var imageEnlargeLeft = (documentWidth - imageWidth)/2;
			enlargeImagePopup.css('left',imageSmailLeft);
			enlargeImagePopup.animate(
				{
					width: imageWidth,
					height: imageHeight,
					opacity: '1',
					top: '100px',
					left: imageEnlargeLeft
				},
				500,
				function(){
					$('.close').css({
						display: 'block',
						position: 'fixed',
						top: '',
						left: ''
					});
				}
			);
			$('.close').click(function(){
				enlargeImage.remove();
				clickImageBackground.remove();
			});			
		})
	});
})