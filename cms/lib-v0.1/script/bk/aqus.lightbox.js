(function($) {
	$.fn.LightBox = function() {
		var LB = this;
		
		var mask = $("<div class='alpha-filter'></div>").css({'display': 'none', 'background-color': '#FFFFFF'});
		var container = $("<div class='popup-window'></div>").css({'display': 'none'});
		var closer = $("<div class='popup-window-closer'></div>").css({'display': 'none'});
		var onlyMaskShowed = false;
		closer.click(function() {
			LB.hide();
		});

		$('body').append(closer);
		$('body').append(container);
		$('body').append(mask);
		
		LB.show = function(onlyMask) {
			onlyMask = onlyMask ? onlyMask : false;
			if(onlyMask) {
				mask.show();
				onlyMaskShowed = true;
			} else {
				mask.show();
				container.show();
				closer.show();
			}
		};
		
		LB.hide = function () {
			if(onlyMaskShowed) {
				onlyMaskShowed = false;
				mask.hide();
			} else {
				mask.hide();
				container.empty();
				container.hide();
				closer.hide();
			}
		};
		
		LB.setContent = function (html) {
			container.append(html);
		};
		
		LB.getContent = function() {
			return container;
		}
		
		return this;
	}
})(jQuery);