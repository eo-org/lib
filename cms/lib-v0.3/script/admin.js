/***********************/
/*FINDER*********/
/***********************/
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
			FINDER.show();
			$.ajax({
				url: "/admin/file/list/layout/disable",
				success: function(HTML) {
					content = FINDER.appendToContent(HTML);
					EventMessenger.bind('finder-responder-back', function(path) {
						imgHtml = CKEDITOR.dom.element.createFromHtml("<img src='http://" + FILE_SERVER + "/" + path + "' />");
						editor.insertElement(imgHtml);
					});
				}
			});
		}
		else {
			alert( '需要在所见即所得模式下使用!' );
		}
	});
};
$(document).ready(function() {
	if($('#ck_text_editor').attr('id') == 'ck_text_editor') {
		loadEditor('ck_text_editor');
	}
});
/***********************/
/*FINDER*********/
/***********************/
//var FINDER_RESPONDER_MESSAGE;
$(document).on('click', '.finder-responder', function() {
	EventMessenger.trigger("finder-responder-back", $(this).attr('message'));
	FINDER.hide();
});

$(document).on({
	'click': function() {
		CALLER = this;
		FINDER.show();
		$.ajax({
			url: "/admin/file/list/layout/disable",
			success: function(HTML) {
				content = FINDER.appendToContent(HTML);
				EventMessenger.bind('finder-responder-back', function(path) {
					$(CALLER).val(path);
				});
			}
		});
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
		CALLER = this;
		FINDER.show();
		$.ajax({
			url: "/admin/ad/list-group/",
			success: function(HTML) {
				content = FINDER.appendToContent(HTML);
				EventMessenger.bind('finder-responder-back', function(path) {
					$(CALLER).val(path);
				});
			}
		});
	},
	'mouseover': function() {
		$(this).css({'background-color':'#ddeeff'});
	},
	'mouseleave': function() {
		$(this).css({'background-color':'transparent'});
	}
}, '.ad-group-selector');