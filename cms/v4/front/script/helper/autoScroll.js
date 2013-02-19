var scrollObj = null;
var intvalTime = null;
function AutoScroll() {
	var cssheight = $(scrollObj).find("ul li:first").css("height");
    $(scrollObj).find("ul").animate({
        marginTop: "-"+cssheight
    }, 500, function() {
        $(this).css({ marginTop: "0px" }).find("li:first").appendTo(this);
    });
}
$(document).ready(function() {
	intvalTime = 2500;
	scrollObj = $(".auto-scroll");
    var startScroll = setInterval('AutoScroll()', intvalTime)
    scrollObj.hover(
    	function() { clearInterval(startScroll); },
    	function() { startScroll = setInterval('AutoScroll()', intvalTime); }
    );
});