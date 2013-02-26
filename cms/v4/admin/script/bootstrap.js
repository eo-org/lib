/****************************************************/
/**Backbone Router***********************************/
/****************************************************/
$(document).ready(function() {
	/*******************************/
	/*Backbone.js read and set hash*/
	/*******************************/
	AdminRouteController = Backbone.Router.extend({
		routes			: {
			"/admin/*query@*filterParam": "updateWithFilter",
			"/admin/*query": "getAdminContent",
			"refresh-page": "refreshPage"
		},
		updateWithFilter : function(query, filterParam) {
			EventMessenger.trigger("updateWithFilter", filterParam);
		},
		getAdminContent	: function(query) {
			var lb = new Lightbox();
			lb.show();
			$.ajax({
				type: "GET",
				url: '/admin/' + query,
				success: function(html) {
					if(html == 'success') {
						window.location.hash = '';
						window.location.reload();
					} else {
						lb.appendContent(html);
						if($('#ck_text_editor').attr('id') == 'ck_text_editor') {
							loadEditor('ck_text_editor');
						}
					}
				}
			});
		},
		refreshPage : function() {
			window.location.hash = '';
			window.location.reload();
		}
	});

	var ARC = new AdminRouteController;
	Backbone.history.start();
});

/****************************************************/
/**Lightbox trigger links init***********************/
/****************************************************/
$(document).on('click', '.link', function(evt) {
	evt.preventDefault();
	var url = $(this).attr('href');
	window.location.href = '#' + url;
});
/****************************************************/
/**Action Menu Button init***************************/
/****************************************************/

$(document).on('click', '.action-menu', function(evt) {
	var method = $(this).attr('method');
	var url = $(this).attr('href');
	
	if(typeof method != undefined) {
		switch(method) {
			case 'post':
				evt.preventDefault();
				$('#lightbox-whitebox').find('form:first').submit();
				return false;
				
				
				
				
				
				
				e.preventDefault();
				var xForm = WBContent.find('form:first');
				if(xForm.attr('action') != '') {
					url = xForm.attr('action');
				}
				if(CKEDITOR.instances['ck_text_editor']) {
					CKEDITOR.instances['ck_text_editor'].updateElement();
			    }
				
				var str = xForm.serialize();
				var aj = $.ajax({
					type: "POST",
					url: url,
					data: str,
					success: function(html) {
						if(html == 'success') {
							window.location.hash = 'refresh-page';
						} else {
							fa.appendContent(html);
						}
					}
				});
				
				
				
				
				
				
			case 'ajax-post':
				evt.preventDefault();
				var xForm = $('#lightbox-whitebox').find('form:first');
				if(xForm.attr('action') != '') {
					url = xForm.attr('action');
				}
				if(CKEDITOR.instances['ck_text_editor']) {
					CKEDITOR.instances['ck_text_editor'].updateElement();
			    }
				
				var str = xForm.serialize();
				var aj = $.ajax({
					type: "POST",
					url: url,
					data: str,
					success: function(html) {
						if(html == 'success') {
							window.location.hash = 'refresh-page';
						} else {
							fa.appendContent(html);
						}
					}
				});
				break;
			default:
				evt.preventDefault();
				eval(method)(url);
				break;
		}
	}
});

/***********************/
/*FINDER*********/
/***********************/
//function loadEditor(elementId) {
//    var instance = CKEDITOR.instances[elementId];
//    if(instance) {
//        CKEDITOR.remove(instance);
//    }
//    CKEDITOR.replace(elementId, {
//        toolbar:[
//			['Source'],
//			['Underline','Strike'],
//			['NumberedList','BulletedList','-','Outdent','Indent'],
//			['JustifyLeft','JustifyCenter','JustifyBlock'],
//			['Link','Unlink'],
//			'/',
//			['Format','Font','FontSize']
//		],
//		height: 280,
//		width: 480
//	});
//    var editor = CKEDITOR.instances.ck_text_editor;
//	$('#append-image').click(function() {
//		if ( editor.mode == 'wysiwyg' ) {
//			FINDER.show();
//			$.ajax({
//				url: "/admin/file/list/layout/disable",
//				success: function(HTML) {
//					content = FINDER.appendToContent(HTML);
//					EventMessenger.bind('finder-responder-back', function(path) {
//						imgHtml = CKEDITOR.dom.element.createFromHtml("<img src='http://" + FILE_SERVER + "/" + path + "' />");
//						editor.insertElement(imgHtml);
//					});
//				}
//			});
//		}
//		else {
//			alert( '需要在所见即所得模式下使用!' );
//		}
//	});
//};
//$(document).ready(function() {
//	if($('#ck_text_editor').attr('id') == 'ck_text_editor') {
//		loadEditor('ck_text_editor');
//	}
//});
/***********************/
/*FINDER*********/
/***********************/
//var FINDER_RESPONDER_MESSAGE;
//$(document).on('click', '.finder-responder', function() {
//	EventMessenger.trigger("finder-responder-back", $(this).attr('message'));
//	FINDER.hide();
//});
//
//$(document).on({
//	'click': function() {
//		CALLER = this;
//		FINDER.show();
//		$.ajax({
//			url: "/admin/file/list/layout/disable",
//			success: function(HTML) {
//				content = FINDER.appendToContent(HTML);
//				EventMessenger.bind('finder-responder-back', function(path) {
//					$(CALLER).val(path);
//				});
//			}
//		});
//	},
//	'mouseover': function() {
//		$(this).css({'background-color':'#ddeeff'});
//	},
//	'mouseleave': function() {
//		$(this).css({'background-color':'transparent'});
//	}
//}, '.icon-selector');
//
//$(document).on({
//	'click': function() {
//		CALLER = this;
//		FINDER.show();
//		$.ajax({
//			url: "/admin/ad/list-group/",
//			success: function(HTML) {
//				content = FINDER.appendToContent(HTML);
//				EventMessenger.bind('finder-responder-back', function(path) {
//					$(CALLER).val(path);
//				});
//			}
//		});
//	},
//	'mouseover': function() {
//		$(this).css({'background-color':'#ddeeff'});
//	},
//	'mouseleave': function() {
//		$(this).css({'background-color':'transparent'});
//	}
//}, '.ad-group-selector');