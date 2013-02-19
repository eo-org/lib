$(document).ready(function(){
	var clickImageBackground = $('<div class="clickImageBackground"></div>');
	var documentWidth = $(document).width();
	var documentHeight = $(document).height();
	clickImageBackground.css({
		width: documentWidth,
		height: documentHeight,
		opacity: '0.2',
		position: 'fixed',
		top: '0',
		backgroundColor: '#000000',
		zIndex: '9999',
		display: 'none'
	});
	$('body').append(clickImageBackground);
	
	var enlargeImageContainer = $('<div class="enlargeImageContainer"></div>');
	enlargeImageContainer.css({
		width: documentWidth,
		height: documentHeight,
		position: 'fixed',
		top: 0,
		left: 0,
		zIndex: 10000,
		display: 'none'
	});
	$('body').append(enlargeImageContainer);
	enlargeImageContainer.click(function(){
		clickImageBackground.css('display', 'none');
		$(this).css('display', 'none');
		enlargeImageContainer.empty();
	});
	
	var graphicsGalleries = $('.graphics-gallery').find('img');
	graphicsGalleries.each(function(i, introImage){
		$(introImage).click(function(e) {
			e.preventDefault();
			clickImageBackground.css('display', 'block').animate({opacity: '0.6'}, 500);
			
			var imageSrc = $(this).attr('src');
			
			var graphicsData = $(this).attr('data-graphic');
			var graphicsObj = $.parseJSON(graphicsData);
			if(graphicsObj.items) {
				var imageSrc = "http://storage.aliyun.com/public-misc/" + window.SITE_FOLDER + "/" + graphicsObj.items[0];
			} else {
				var imageSrc = $(this).attr('src');
			}
			
			var imageObj = new Image();
			imageObj.onload = function() {
				var imageTag = $("<img src='" + imageSrc + "' />");
				var imageWidth = this.width;
				var imageHeight = this.height;
				imageTag.css({
					position: 'fixed',
					borderRadius: '4px',
					border: '4px solid black',
					width: '90',
					height: '60',
					left: (documentWidth - 90)/2,
					top: 10,
					opacity: 0
				});
				enlargeImageContainer.css('display', 'block');
				enlargeImageContainer.append(imageTag);
				var imageLeft = (documentWidth - imageWidth)/2;
				imageTag.animate({
					width: imageWidth,
					height: imageHeight,
					opacity: '1',
					top: '60px',
					left: imageLeft
				}, 500);
			}
			imageObj.src = imageSrc;
		});
	});
})