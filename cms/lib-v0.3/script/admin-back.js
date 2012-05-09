(function($) {
	$.fn.actionMenuInit = function() {
		var WBContent = this;
		return WBContent.find('.action-menu').each(function(i, b) {
			var B = $(b);
			B.click(function(e) {
				if(B.attr('method') == 'post') {
					e.preventDefault();
					WBContent.find('form:first').submit();
					return false;
				} else if(B.attr('method') == 'get') {
					e.preventDefault();
					var urlSuffix = WBContent.find('form:first').serialize();
					var url = B.attr('href');
					$(location).attr('href', url + '?' + urlSuffix);
					return false;
				} else if(B.attr('method') == 'func') {
					e.preventDefault();
					var urlSuffix = ajaxFunc();
					var url = B.attr('href');
					$(location).attr('href', url + '/param/' + urlSuffix);
					return false;
				} else {
					//skip actions for link, just link
				}
			});
		});
	};
	$.fn.ajaxLink = function() {
		return false;
	}
	/*******************************/
	/*******************************/
	/*******************************/
	$.fn.finderInit = function() {
		var F = this;
		var fHeight = F.height();
		var finderCloser = F.children('.closer');
		var finderContent = F.children('.content');
		F.show = function() {
			F.css('display', 'block');
			F.animate({
				bottom: '0px'
			}, 200);
		};
		F.hide = function() {
			F.css({
				bottom: '-' + fHeight + 'px',
				display: 'none'
			});
		};
		F.appendToContent = function(HTML) {
			finderContent.empty();
			finderContent.append(HTML);
			return finderContent;
		};
		
		/*closer action*/
		finderCloser.click(function() {
			F.hide();
//			window.location.href = '#';
		});
	}
})(jQuery);

var FINDER;
var EventMessenger = {};
_.extend(EventMessenger, Backbone.Events);

$(document).ready(function() {
	var WBContent = $(".whitebox .content");
	WBContent.actionMenuInit();

	/*******************************/
	/*Backbone.js read and set hash*/
	/*******************************/
	AdminRouteController = Backbone.Router.extend({
		routes: {
			"search:*searchParam": "updateAdminSearch"
		},
		updateAdminSearch: function(searchParam) {
			EventMessenger.trigger("updateAdminSearch", searchParam);
		}
	});

	var ARC = new AdminRouteController;
	Backbone.history.start();
	
	FINDER = $('.finderbox');
	FINDER.finderInit();
});