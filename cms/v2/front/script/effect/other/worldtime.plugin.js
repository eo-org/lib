$(document).ready(function(){
	var data = jQuery.parseJSON($('.world-time').attr('data'));
	var dataSum = data.country.length;
	var i;
	var dt;
	var def;
	var gmt;
	var ending;
	var rome;
	var tky;
	var _CMT;
	var atl;
	var documentDom = new Array();
	var countryName;
	if(dataSum){
			for(i=0;i<dataSum;i++){
				$('.world-time').append($('<li><span id='+data.country[i]+'></span></li>'));
				documentDom[i] = document.getElementById(data.country[i]);
			}
	}
	window.GetTime = function() {
		dt = new Date();
		def = dt.getTimezoneOffset()/60;
		gmt = (dt.getHours() + def);
		ending = ":" + IfZero(dt.getMinutes()) + ":" +  IfZero(dt.getSeconds());
		rome =check24(((gmt + 1) > 24) ? ((gmt + 1) - 24) : (gmt + 1));
		tky =check24(((gmt + 9) > 24) ? ((gmt + 9) - 24) : (gmt + 9));
		_GMT =check24(((gmt) > 24) ? (gmt - 24) : (gmt));
		atl =check24(((gmt + (24-4)) > 24) ? ((gmt + (24-4)) - 24) : (gmt + (24-4)));
		for(var j=0;j<dataSum;j++){
			countryName = data.country[j];
			switch(countryName){
				case 'beijing': documentDom[j].innerHTML=("北京"+IfZero(dt.getHours()) + ":" + IfZero(dt.getMinutes()) + ":" + IfZero(dt.getSeconds()));
								break;
				case 'paris': documentDom[j].innerHTML=("巴黎"+IfZero(rome+1) + ending);
								break;
				case 'seoul': documentDom[j].innerHTML=("首尔"+IfZero(dt.getHours()+1) + ending);
								break;
				case 'tokyo': documentDom[j].innerHTML=("東京"+IfZero(tky) + ending);
								break;
				case 'london': documentDom[j].innerHTML=("倫敦"+IfZero(_GMT+1) + ":" + IfZero(dt.getMinutes()) + ":" + IfZero(dt.getSeconds()));
								break;
				case 'berlin': documentDom[j].innerHTML=("柏林"+IfZero(_GMT+2) + ":" + IfZero(dt.getMinutes()) + ":" + IfZero(dt.getSeconds()));
								break;
				case 'newyork': documentDom[j].innerHTML=("紐約"+IfZero(atl) + ending);
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
