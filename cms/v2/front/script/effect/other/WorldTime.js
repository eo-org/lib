$(document).ready(function(){
	var data = jQuery.parseJSON($('.world-time').attr('data'));
	var dataSum = data.country.length;
	var i;
	window.GetTime = function() {
		if(dataSum){
			for(i=0;i<dataSum;i++){
				$('.world-time').append($('<li><span id='+data.country[i]+'></span></li>'));
			}
		}
		var dt = new Date();
		var def = dt.getTimezoneOffset()/60;
		var gmt = (dt.getHours() + def);
		var ending = ":" + IfZero(dt.getMinutes()) + ":" +  IfZero(dt.getSeconds());
		var rome =check24(((gmt + 1) > 24) ? ((gmt + 1) - 24) : (gmt + 1));
		var msw =check24(((gmt + 3) > 24) ? ((gmt + 3) - 24) : (gmt + 3));
		var baku =check24(((gmt + 4) > 24) ? ((gmt + 4) - 24) : (gmt + 4));
		var del =check24(((gmt + 5) > 24) ? ((gmt + 5) - 24) : (gmt + 5));
		var dh =check24(((gmt + 6) > 24) ? ((gmt + 6) - 24) : (gmt + 6));
		var kok =check24(((gmt +7 ) > 24) ? ((gmt +7 ) - 24) : (gmt + 7));
		var ho =check24(((gmt + 8) > 24) ? ((gmt + 8) - 24) : (gmt + 8));
		var tky =check24(((gmt + 9) > 24) ? ((gmt + 9) - 24) : (gmt + 9));
		var sdn =check24(((gmt + 10) > 24) ? ((gmt + 10) - 24) : (gmt + 10));
		var mag =check24(((gmt + 11) > 24) ? ((gmt + 11) - 24) : (gmt + 11));
		var wll =check24(((gmt + 12) > 24) ? ((gmt + 12) - 24) : (gmt + 12));
		var _GMT =check24(((gmt) > 24) ? (gmt - 24) : (gmt));
		var eniw =check24(((gmt + (24-12)) > 24) ? ((gmt + (24-12)) - 24) : (gmt + (24-12)));
		var sam =check24(((gmt + (24-11)) > 24) ? ((gmt + (24-11)) - 24) : (gmt + (24-11)));
		var haw =check24(((gmt + (24-10)) > 24) ? ((gmt + (24-10)) - 24) : (gmt + (24-10)));
		var ala =check24(((gmt + (24-9)) > 24) ? ((gmt + (24-9)) - 24) : (gmt + (24-9)));
		var pacif =check24(((gmt + (24-8)) >= 24) ? ((gmt + (24-8)) - 24) : (gmt + (24-8)));
		var mount =check24(((gmt + (24-7)) > 24) ? ((gmt + (24-7)) - 24) : (gmt + (24-7)));
		var center =check24(((gmt + (24-6)) > 24) ? ((gmt + (24-6)) - 24) : (gmt + (24-6)));
		var east =check24(((gmt + (24-5)) > 24) ? ((gmt + (24-5)) - 24) : (gmt + (24-5)));
		var atl =check24(((gmt + (24-4)) > 24) ? ((gmt + (24-4)) - 24) : (gmt + (24-4)));
		var bra =check24(((gmt + (24-3)) > 24) ? ((gmt + (24-3)) - 24) : (gmt + (24-3)));
		bra = (bra >= 24) ? bra - 24 : bra;
		var mid =check24(((gmt + (24-2)) > 24) ? ((gmt + (24-2)) - 24) : (gmt + (24-2)));
		mid = (mid >= 24) ? mid - 24 : mid;
		var azo =check24(((gmt + (24-1)) > 24) ? ((gmt + (24-1)) - 24) : (gmt + (24-1)));
		azo = (azo >= 24) ? azo - 24 : azo;
		setTimeout('GetTime()', 1000);
		var documentDom;
		var countryName;
		for(var j=0;j<dataSum;j++){
			documentDom = document.getElementById(data.country[j]);
			countryName = data.country[j];
			switch(countryName){
				case 'beijing': documentDom.innerHTML=("北京"+IfZero(dt.getHours()) + ":" + IfZero(dt.getMinutes()) + ":" + IfZero(dt.getSeconds()));
								break;
				case 'paris': documentDom.innerHTML=("巴黎"+IfZero(rome+1) + ending);
								break;
				case 'seoul': documentDom.innerHTML=("首尔"+IfZero(dt.getHours()+1) + ending);
								break;
				case 'tokyo': documentDom.innerHTML=("東京"+IfZero(tky) + ending);
								break;
				case 'london': documentDom.innerHTML=("倫敦"+IfZero(_GMT+1) + ":" + IfZero(dt.getMinutes()) + ":" + IfZero(dt.getSeconds()));
								break;
				case 'berlin': documentDom.innerHTML=("柏林"+IfZero(_GMT+2) + ":" + IfZero(dt.getMinutes()) + ":" + IfZero(dt.getSeconds()));
								break;
				case 'newyork': documentDom.innerHTML=("紐約"+IfZero(atl) + ending);
								break;
			}
		};
		setTimeout('GetTime()', 1000);
	}
	function IfZero(num) {
		return ((num <= 9) ? ("0" + Math.abs(num)) : num);
	}
	function check24(hour) {
		return (hour >= 24) ? (hour - 24) : hour;
	}
	GetTime(); 
})
