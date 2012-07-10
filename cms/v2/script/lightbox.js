/****************************************************/
/**Lightbox******************************************/
/****************************************************/
var Lightbox = function()
{
	var blackBox = $("#lightbox-blackbox");
	blackBox.height($(document).height());
	var whiteBox = $("#lightbox-whitebox");
	var content = $("#lightbox-whitebox > .content");
	
	var closer = $("#lightbox-whitebox > .closer");
	closer.click(function() {
		window.location.hash = '';
		whiteBox.hide();
		blackBox.hide();
		
		$(document).trigger('AdminControlUnload');
	});
    
    this.show = function() {
    	blackBox.show();
    	$('html, body').animate({scrollTop:0}, 'fast');
    	content.empty();
    	whiteBox.show();
    };
    this.close = function() {
    	window.location.hash = '';
    	whiteBox.hide();
    	blackBox.hide();
    	$(document).trigger('AdminControlUnload');
    };
    this.appendContent = function(html) {
    	content.empty();
    	content.append(html);
    	$(document).trigger('AdminControlLoad');
    };
};
