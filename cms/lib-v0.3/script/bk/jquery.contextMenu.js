(function($) {
	var menu, active_element = null;
	
	$.fn.ContextMenuInit = function() {
		this.appendItem = function(label, setting) {
			var menuItem = $('<li><a href="#">' + label + '</a></li>');
			if(setting.klass) {
				menuItem.attr("class", setting.klass);
			}
			menuItem.appendTo(menu).bind('click', function(e) {
				setting.click(active_element);
				e.preventDefault();
			});
		}
		
		menu = $('<ul class="context-menu"></ul>').hide().appendTo('body');
		
		return this;
	};
	
	jQuery.fn.contextMenu = function() {
		var ITEM = this;
		var hide_menu = function() {
			menu.trigger("closed");
			menu.hide();
			if(active_element != null) {
				active_element.removeClass('selected');
			}
			$('body').unbind('click', hide_menu);
		};
		
		ITEM.bind('click', function(e) {
			hide_menu();
			active_element = $(this);
			menu.show(0, function() {
				$('body').bind('click', hide_menu);
				active_element.addClass('selected');
			}).css({
				position: 'absolute',
				top: e.pageY,
				left: e.pageX,
				zIndex: 1000
			});
			return false;
		});
	};
})(jQuery);
