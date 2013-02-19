//var ckEditor = null;
var appendToEditor = function(data) {
	var editor = null;
	for(var instanceName in CKEDITOR.instances) {
		editor = CKEDITOR.instances[instanceName];
	}
	
	if ( editor.mode == 'wysiwyg' ) {
		imgHtml = CKEDITOR.dom.element.createFromHtml("<img src='" + IconSelector.getFileServerUrl() + "/" + data.filepath + "' />");
		editor.insertElement(imgHtml);
	} else {
		alert( '需要在所见即所得模式下使用!' );
	}
};