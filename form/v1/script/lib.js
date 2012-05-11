var attrValue;
var formid = "";
var updateElementSetting = function(postUrl) {
	//获取添加的输入框的内容
	attrValue="";
	$("#addt :input:text").each(function(){
		var value = $(this).attr("value");
		attrValue+= value + ':';
	});
	formid = $('#addt').attr("name");
	var postData = $('#element_setting').serialize();
	postData+= '&val='+attrValue+'&sjid='+formid;
	alert(postData);
	var aj = $.ajax({
		type: "POST",
		url: postUrl,
		data: postData,
		dataType: "json",
		success: function(obj) {
			if(obj.result == 'success') {
				var newLi = $(obj.html);
				var elementId = newLi.attr('id');
				$('#' + elementId).replaceWith(newLi);
				var lb = new Lightbox();
				lb.close();
			} else {
				var errorMsg = obj.html;
				var messageBox = $('.lightbox-flash-message');
				var errorMessageUl = messageBox.find('.error-message');
				errorMessageUl.empty();
				errorMessageUl.css('display', 'block');
				for(key in errorMsg) {
					for(code in errorMsg[key]) {
						errorMessageUl.append("<li>" + key + ':' + errorMsg[key][code] + "</li>");
					}
				}
			}
		}
	});
}


var delElementSetting = function(postUrl) {
	var ajax = $.ajax({
		type: "POST",
		url:postUrl,
		success: function(obj){
			if(obj.result == 'success'){
				var id = obj.html;
				$('#form_element_'+id).remove();
				var lb = new Lightbox();
				lb.close();
			}
		}
	});
};

var createElementSetting = function(postUrl){
	var ajax = $.ajax({
		type: "POST",
		url:postUrl,
		success: function(obj){

		}
	});
};
