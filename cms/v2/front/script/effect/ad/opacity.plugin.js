$(document).ready(function() {
	var inAction = false;
	var showIndexGraphic = function(fromIdx ,toIdx, graphics, handles) {
		if(fromIdx == toIdx) {
			return -1;
		}
		if(inAction == true) {
			return -1;
		}
		inAction = true;
		graphics.each(function(j, graphicEl) {
			if(j == fromIdx) {
				$(graphicEl).animate({'opacity' : 0}, function() {
					$(this).css('display', 'none');
				});
			} else if(j == toIdx) {
				$(graphicEl).css('display', 'block');
				$(graphicEl).animate({'opacity' : 1}, function() {
					inAction = false;
				});
			}
		});
		handles.each(function(j, handleEl) {
			if(j == fromIdx) {
				$(handleEl).removeClass('selected');
				$(handleEl).animate({
					'opacity' : 0.6
				});
			} else if(j == toIdx) {
				$(handleEl).addClass('selected');
				$(handleEl).animate({
					'opacity' : 1
				});
			}
		});
		return toIdx;
	}
	
	$('.ad-group-opacity').each(function(i, container) {
		var data = jQuery.parseJSON($(container).attr('data'));
		var timeDelay = data.delay;
		var thumbRotate = data.thumbRotate;
		
		var timer = null;
		$(this).mouseenter(function() {
			clearTimeout(timer);
		}).mouseleave(function() {
			timer = setInterval(auto, timeDelay);
		});
		
		var currentIndex = 0;
		var graphicUl = $(container).find('.graphic > ul');
		var graphics = $(container).find('.graphic > ul > li');
		var graphicsCount = graphics.length;
		var handleUl = $(container).find('.handle > ul');
		var handles = $(container).find('.handle > ul > li');
		
		graphicUl.css('position', 'relative');
		var graphicUlWidth = graphicUl.width();
		var graphicUlHeight = graphicUl.height();
		if(graphicUlHeight > 450) {
			graphicUlHeight = 450;
			graphicUl.css('height', 450);
		}
		graphics.each(function(i, gEl) {
			$(gEl).css({
				'position' : 'absolute',
				'left' : 0,
				'top' : 0,
				'width' : graphicUlWidth,
				'height' : graphicUlHeight,
				'overflow' : 'hidden',
				'opacity' : 0,
				'display' : 'none'
			})
		});
		
		var handleWidth = handles.outerWidth();
		var handleUlWidth = handleUl.width();
		handles.each(function(i, handleEl) {
			$(handleEl).css('opacity', 0.6)
			$(handleEl).click(function() {
				var result = showIndexGraphic(currentIndex, i, graphics, handles);
				if(result != -1) {
					currentIndex = result;
				}
			}); 
		});
		
		showIndexGraphic(null, 0, graphics, handles);
		var auto = function() {
			var nextIndex = currentIndex + 1;
			if(nextIndex >= graphicsCount){
				nextIndex = 0;
			}
			showIndexGraphic(currentIndex, nextIndex, graphics, handles);
			currentIndex = nextIndex;
		};
		
		timer = setInterval(auto, timeDelay);
	});
})