$(document).ready(function(){
	var handles = $(".navi-popup").children('li');
	var origNaviHeight = handles.height();
	handles.mouseenter(function(){
		var naviHeight = origNaviHeight;
		//naviHeight = $(this).children('ul').height();
		$(this).children('ul').find('li').each(function() {
			var itemHeight = parseInt($(this).height());
			naviHeight += itemHeight;
		});
		$(this).stop().animate({height: naviHeight},{queue:false, duration:600, easing: 'easeOutBounce'})
	}).mouseleave(function(){
//		naviHeight = handles.height();
//		$(this).children('ul').css({'display':'none'});
		$(this).stop().animate({height: origNaviHeight },{queue:false, duration:600, easing: 'easeOutBounce'})
	});
	jQuery.easing['jswing'] = jQuery.easing['swing'];

	jQuery.extend( jQuery.easing,
	{
		easeOutBounce: function (x, t, b, c, d) {
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
			}
		}
	});
});