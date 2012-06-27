var FILE_SERVER_URI = "http://storage.aliyun.com/public-misc";
var FILE_SELECTOR_CALLER = null;

var openFileWindow = function() {
	var fileSelectorWindow = window.open(
		'http://file.enorange.cn/' + window.ORG_CODE + '/admin/',
		'file-selector',
		'height=640, width=980, location=no,scrollbars=no,toolbar=no,resizable=no'
	);
};
var appendToEditor = function() {};
var appendToInput = function() {};
var appendToAttachment = function() {};
window.addEventListener('message', function(e) {
	var filePath = e.data.filepath;
	var filename = e.data.filename;
	switch(FILE_SELECTOR_CALLER) {
		case 'editor':
			appendToEditor(filePath);
			break;
		case 'input':
			appendToInput(filePath);
			break;
		case 'attachment':
			appendToAttachment(filePath, filename);
			break;
	}
}, false);

function loadEditor(elementId) {
    var instance = CKEDITOR.instances[elementId];
    if(instance) {
        CKEDITOR.remove(instance);
    }
    CKEDITOR.replace(elementId, {
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
    var editor = CKEDITOR.instances.ck_text_editor;
	$('#append-image').click(function() {
		if ( editor.mode == 'wysiwyg' ) {
			FILE_SELECTOR_CALLER = 'editor';
			openFileWindow();
			appendToEditor = function(filePath) {
				imgHtml = CKEDITOR.dom.element.createFromHtml("<img src='" + FILE_SERVER_URI + "/" + filePath + "' />");
				editor.insertElement(imgHtml);
			};
		    return false;
		} else {
			alert( '需要在所见即所得模式下使用!' );
		}
	});
};
$(document).ready(function() {
	if($('#ck_text_editor').attr('id') == 'ck_text_editor') {
		loadEditor('ck_text_editor');
	}
});

$(document).on({
	'click': function() {
		var TH = $(this);
		
		FILE_SELECTOR_CALLER = 'input';
		openFileWindow();
		appendToInput = function(filePath) {
			TH.val(filePath);
		};
	    return false;
	},
	'mouseover': function() {
		$(this).css({'background-color':'#ddeeff'});
	},
	'mouseleave': function() {
		$(this).css({'background-color':'transparent'});
	}
}, '.icon-selector');

$(document).on({
	'click': function() {
		var TH = $(this);
		
		FILE_SELECTOR_CALLER = 'input';
		openFileWindow();
		appendToInput = function(filePath) {
			TH.val(filePath);
		};
	    return false;
	},
	'mouseover': function() {
		$(this).css({'background-color':'#ddeeff'});
	},
	'mouseleave': function() {
		$(this).css({'background-color':'transparent'});
	}
}, '.attachment-selector');