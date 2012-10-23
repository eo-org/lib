$(document).ready(function(){
	var clickEnlarge = $('.clickToEnlarge').find('img');
	clickEnlarge.each(function(i,clickImage){
		$(this).click(function(){
			var imageSrc = $(this).attr('src');
			$('body').append('<div class=clickImageBackground></div>');
			var clickImageBackground = $('.clickImageBackground');
			var documentWidth = $(document).width();
			var documentHeight = $(document).height();
			clickImageBackground.css({
				width: documentWidth,
				height: documentHeight,
				opacity: '0.2',
				position: 'absolute',
				top: '0',
				backgroundColor: '#000000',
				zIndex: '9999'
			});
			clickImageBackground.animate({opacity: '0.6'},500);
			$('body').append('<div class="enlargeImage" ><div class="enlargeImagePopup"><img src='+imageSrc+' > </div></div>');
			var enlargeImage = $('.enlargeImage');
			var enlargeImagePopup = $('.enlargeImagePopup').find('img');
			var imageWidth = enlargeImagePopup.width();
			var imageHeight = enlargeImagePopup.height();
			enlargeImage.css('position','fixed');
			enlargeImagePopup.css({
				position: 'fixed',
				borderRadius: '4px 4px 4px 4px',
				border: '4px solid #ddd',
				width: '90',
				height: '60',
				zIndex: '9999'
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
			clickImageBackground.click(function(){
				enlargeImage.remove();
				$(this).remove();
			});			
		})
	});
})