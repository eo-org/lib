function FrontAdmin()
{
	var BB = $(".blackbox");
	BB.height($(document).height());
	var WB = $(".whitebox");
	var WBContent = $(".whitebox .content");
	var WBCloser = $(".whitebox .closer");
	var cb = '';
	WBCloser.click(function() {
		WB.hide();
		BB.hide();
		cb = '';
		$('body').trigger('AdminControlUnload');
	});
	
    if(this.constructor.instance) {
    	return this.constructor.instance;
    } else {
    	this.constructor.instance = this;
    }
    
    this.show = function()
    {
    	BB.show();
		$('html, body').animate({scrollTop:0}, 'fast');
		WBContent.empty();
		WB.show();
    }
    this.appendContent = function(html)
    {
    	WBContent.empty();
    	WBContent.append(html);
		BB.trigger('AdminControlLoad');
		WBContent.find('a.action-menu').controlButtonInit(WBContent);
    }
    this.setCallback = function(cb)
    {
    	this.cb = cb;
    }
    this.getCallback = function()
    {
    	return this.cb;
    }
}

(function($) {
	$.fn.controlButtonInit = function(WBContent) {
		var fa = new FrontAdmin();
		return this.each(function(i, b) {
			var B = $(b);
			B.click(function(e) {
//				e.preventDefault();
				var url = B.attr('href');
				if(fa.getCallback() == 'refresh') {
					url+= '/callback/refresh';
				}
				if(B.attr('method') == 'post') {
					e.preventDefault();
					var xForm = WBContent.find('form:first');
					if(CKEDITOR.instances['content']) {
						CKEDITOR.instances['content'].updateElement();
				    }
					
					var str = xForm.serialize();

					var aj = $.ajax({
						type: "POST",
						url: url,
						data: str,
						success: function(html) {
							if(html == 'success') {
								location.reload();
							} else {
								fa.appendContent(html);
							}
						}
					});
				} else if(B.attr('method') == 'link') {
//					var aj = $.ajax({
//						type: "GET",
//						url: url,
//						success: function(html) {
//							if(html == 'success') {
//								location.reload();
//							} else {
//								fa.appendContent(html);
//							}
//						}
//					});
				} else if(B.attr('method') == 'func') {
					e.preventDefault();
					var urlSuffix = ajaxFunc();
					$.ajax({
						type: "GET",
						url: url + '/param/' + urlSuffix,
						success: function(html) {
							if(html == 'success') {
								location.reload();
							} else {
								fa.appendContent(html)
							}
						}
					});
				}
//				return false;
			});
		});
	};
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
		});
	}
/*******************************/
/*******************************/
/*******************************/
//	$.fn.ajaxLink = function() {
//		var fa = new FrontAdmin();
//		var AL = this;
//		AL.click(function(e) {
//			e.preventDefault();
//			var url = AL.attr('href');
//			$.ajax({
//				type: "GET",
//				url: url,
//				success: function(html) {
//					fa.appendContent(html);
//				}
//			});
//		});
//	}
})(jQuery);
/**
 * declear global javascript items
 */
var WB;
var FINDER;
var GEARS;
var EventMessenger = {};
_.extend(EventMessenger, Backbone.Events);

$(document).ready(function() {
	/*******************************/
	/*Backbone.js read and set hash*/
	/*******************************/
	AdminRouteController = Backbone.Router.extend({
		routes			: {
			"/admin/*query@*searchParam": "updateAdminSearch",
			"/admin/*query": "getAdminContent"
		},
		updateAdminSearch : function(query, searchParam) {
//			console.log(query);
//			console.log(searchParam);

			

//			object.bind("alert", function(msg) {
//			  alert("Triggered " + msg);
//			});

			EventMessenger.trigger("updateAdminSearch", searchParam);
//			console.log('event triggered. query : ' + searchParam);
		},
		getAdminContent	: function(query) {
			var fa = new FrontAdmin();
			fa.show();
			$.ajax({
				type: "GET",
				url: '/admin/' + query,
				success: function(html) {
					fa.appendContent(html);
				}
			});
		}
	});

	var ARC = new AdminRouteController;
	Backbone.history.start();
	
	
	GEARS = $('div.gear');
	GEARS.each(function(i, g) {
		var GEAR = $(g);
		var showIcon = function() {
			GEAR.show();
		};
		var hideIcon = function() {
			hideUl();
			GEAR.hide();
		};
		var toggleUl = function() {
			GEAR.children('ul').toggle();
		};
		var hideUl = function() {
			GEAR.children('ul').hide();
		};
		
		GEAR.find('a').click(function(e){
			hideIcon();
			fa.show();
			var url = $(this).attr('href');
			$.ajax({
				url: url,
				success: function(html) {
					fa.appendContent(html);
					fa.setCallback('refresh');
				}
			});
			e.preventDefault();
			return false;
		});
		
		var p = GEAR.parent();
		p.mouseenter(function(){
			showIcon();
		}).mouseleave(function(){
			hideIcon();
		});
		GEAR.click(function() {
			toggleUl();
		});
	});
	
	FINDER = $('.finderbox');
	FINDER.finderInit();
});
