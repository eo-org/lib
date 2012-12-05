var IconSelector = function() {
	var settings = {
		caller : null,
		callbackFunctionName : null,
		fileServerUrl : "http://misc.fucms.com/public-misc",
		fileHost : "http://file.enorange.cn"
	}
	this.init = function() {
		var TH = this;
		
		$(document).on({
			'click': function(e) {
				settings.caller = e.currentTarget;
				settings.callbackFunctionName = $(e.currentTarget).attr('data-callback');
				openFileWindow();
			    return false;
			},
			'mouseover': function() {
				$(this).addClass('mouseover-active');
			},
			'mouseleave': function() {
				$(this).removeClass('mouseover-active');
			}
		}, '.icon-selector');
		
		window.addEventListener('message', function(e) {
			TH.callback(e);
		}, false);
	};
	
	this.callback = function(e) {
		var fn = settings.callbackFunctionName;
		window[fn](e.data, settings.caller);
	};
	
	this.getFileServerUrl = function() {
		return settings.fileServerUrl;
	};
	
	var openFileWindow = function() {
		window.open(
			settings.fileHost + '/' + window.SITE_FOLDER + '/admin/',
			'file-selector',
			'height=640, width=980, location=no,scrollbars=no,toolbar=no,resizable=no'
		);
	};
}

var IconSelector = new IconSelector();
IconSelector.init();

//insert attachment
//var insertAttachment = function(data) {
//	var l = $("<li filepath='" + data.filepath + "'>" + data.filename + "</li>");
//	var attachmentList = $('#attachment-list');
//	l.appendTo(attachmentList);
//};

//use icon path as input
var appendToInput = function(data, caller) {
	$(caller).val(data.urlname);
};
var appendToCmEditor = function(data, caller) {
	var imgTag = "<img src='" + IconSelector.getFileServerUrl() + "/" + data.filepath + "' />";
	var c = codeMirrorEditor.getCursor();
	codeMirrorEditor.replaceRange(imgTag, c);
	codeMirrorEditor.save();
	//console.log(c);
}
//append icon to ck editor




/**
var editor = null;
var appendToEditor = function(data) {
	if ( editor.mode == 'wysiwyg' ) {
		imgHtml = CKEDITOR.dom.element.createFromHtml("<img src='" + IconSelector.getFileServerUrl() + "/" + data.filepath + "' />");
		editor.insertElement(imgHtml);
	} else {
		alert( '需要在所见即所得模式下使用!' );
	}
};

//init ck editor
$(document).ready(function() {
	if($('#ck_text_editor').attr('id') == 'ck_text_editor') {
		var instance = CKEDITOR.instances['ck_text_editor'];
	    if(instance) {
	        CKEDITOR.remove(instance);
	    }
	    CKEDITOR.replace('ck_text_editor', {
	        toolbar:[
				['Source'],
				['Underline','Strike'],
				['NumberedList','BulletedList','-','Outdent','Indent'],
				['JustifyLeft','JustifyCenter','JustifyBlock'],
				['Link','Unlink'],
				'/',
				['Format','Font','FontSize']
			],
			height: 280,
			width: 480
		});
	    editor = CKEDITOR.instances.ck_text_editor;
	}
});

$(document).on('AdminControlLoad', function() {
	if($('#ck_text_editor').attr('id') == 'ck_text_editor') {
		var instance = CKEDITOR.instances['ck_text_editor'];
	    if(instance) {
	        CKEDITOR.remove(instance);
	    }
	    CKEDITOR.replace('ck_text_editor', {
	        toolbar:[
				['Source'],
				['Underline','Strike'],
				['NumberedList','BulletedList','-','Outdent','Indent'],
				['JustifyLeft','JustifyCenter','JustifyBlock'],
				['Link','Unlink'],
				'/',
				['Format','Font','FontSize']
			],
			height: 280,
			width: 480
		});
	    editor = CKEDITOR.instances.ck_text_editor;
	}
});
**/