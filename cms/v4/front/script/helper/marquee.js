(function ($) {
    $.fn.marquee = function (direction) {
		var THIS = this;
		
		var marqueeObj = $(this);
		marqueeObj.css({
			'position':'relative',
			'overflow':'hidden'
		});
		var mask = $('<div style="width: 8000px;"></div>');
		var marqueeContent = marqueeObj.children('ul');
		var marqueeContentCopy = marqueeContent.clone();
		
		console.log(marqueeContent);
		
		console.log(marqueeContentCopy);
		
		mask.css({
			'position':'relative'
		});
		
		marqueeContent.wrap(mask);
		marqueeContentCopy.appendTo(marqueeContent.parent());
		
		
		var leftPos = 0;
		var contentWidth = marqueeContent.width();
		
		var animateMask = function(direction) {
			if (direction == "up") {
				if (marqueeContentCopy.offsetTop - marqueeObj.scrollTop <= 0) {
					marqueeObj.scrollTop -= (marqueeContent.offsetHeight + 20);
				} else {
					var tmp = marqueeObj.scrollTop;
					marqueeObj.scrollTop++;
					if (marqueeObj.scrollTop == tmp) {
						marqueeObj.scrollTop = 1;
					}
				}
			} else {
				if (contentWidth - leftPos <= 0) {
					leftPos = 1;
					marqueeObj.scrollLeft(leftPos);
				} else {
					marqueeObj.scrollLeft(++leftPos);
				}
			}
		}
		
		var marqueeVar = window.setInterval(animateMask, 20);
		marqueeObj.mouseover(function() {
			window.clearInterval(marqueeVar);
		}).mouseout(function() {
			marqueeVar = window.setInterval(animateMask, 20);
		});
	}
}(jQuery));
