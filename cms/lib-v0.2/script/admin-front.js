function FrontAdmin()
{
	var BB = $(".blackbox");
	BB.height($(document).height());
	var WB = $(".whitebox");
	var WBContent = $(".whitebox .content");
	var WBCloser = $(".whitebox .closer");
	var cb = '';
	WBCloser.click(function() {
		window.location.hash = '';
		WB.hide();
		BB.hide();
		cb = '';
		$('body').trigger('AdminControlUnload');
	});
	
    if(this.constructor.instance) {
    	return this.constructor.instance;
    } else {
    	this.constructor.instance = this;
    }
    
    this.show = function()
    {
    	BB.show();
		$('html, body').animate({scrollTop:0}, 'fast');
		WBContent.empty();
		WB.show();
    }
    this.appendContent = function(html)
    {
    	WBContent.empty();
    	WBContent.append(html);
		BB.trigger('AdminControlLoad');
		WBContent.find('a.action-menu').controlButtonInit(WBContent);
    }
    this.setCallback = function(cb)
    {
    	this.cb = cb;
    }
    this.getCallback = function()
    {
    	return this.cb;
    }
}

(function($) {
	$.fn.controlButtonInit = function(WBContent) {
		var fa = new FrontAdmin();
		return this.each(function(i, b) {
			var B = $(b);
			B.click(function(e) {
//				e.preventDefault();
				var url = B.attr('href');
				if(fa.getCallback() == 'refresh') {
					url+= '/callback/refresh';
				}
				if(B.attr('method') == 'post') {
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
				}  else if(B.attr('method') == 'func') {
					e.preventDefault();
					var urlSuffix = ajaxFunc();
					$.ajax({
						type: "GET",
						url: url + '/param/' + urlSuffix,
						success: function(html) {
							if(html == 'success') {
								window.location.hash = 'refresh-page';
							} else {
								fa.appendContent(html)
							}
						}
					});
				}
			});
		});
	};
/*******************************/
/*******************************/
/*******************************/
	$.fn.finderInit = function() {
		var F = this;
		var fHeight = F.height();
		var finderCloser = F.children('.closer');
		var finderContent = F.children('.content');
		F.show = function() {
			F.css('display', 'block');
			F.animate({
				bottom: '0px'
			}, 200);
		};
		F.hide = function() {
			F.css({
				bottom: '-' + fHeight + 'px',
				display: 'none'
			});
		};
		F.appendToContent = function(HTML) {
			finderContent.empty();
			finderContent.append(HTML);
			return finderContent;
		};
		
		/*closer action*/
		finderCloser.click(function() {
			F.hide();
		});
	}
/*******************************/
/*******************************/
/*******************************/
//	$.fn.ajaxLink = function() {
//		var fa = new FrontAdmin();
//		var AL = this;
//		AL.click(function(e) {
//			e.preventDefault();
//			var url = AL.attr('href');
//			$.ajax({
//				type: "GET",
//				url: url,
//				success: function(html) {
//					fa.appendContent(html);
//				}
//			});
//		});
//	}
})(jQuery);


$(document).ready(function() {
	/*******************************/
	/*Backbone.js read and set hash*/
	/*******************************/
	AdminRouteController = Backbone.Router.extend({
		routes			: {
			"/admin/*query@*searchParam": "updateAdminSearch",
			"/admin/*query": "getAdminContent",
			"refresh-page": "refreshPage"
		},
		updateAdminSearch : function(query, searchParam) {
			EventMessenger.trigger("updateAdminSearch", searchParam);
		},
		getAdminContent	: function(query) {
			var fa = new FrontAdmin();
			fa.show();
			$.ajax({
				type: "GET",
				url: '/admin/' + query,
				success: function(html) {
					if(html == 'success') {
						window.location.hash = '';
						window.location.reload();
					} else {
						fa.appendContent(html);
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
	
	FINDER = $('.finderbox');
	FINDER.finderInit();
});


$(document).on('click', '.link', function(evt) {
	evt.preventDefault();
	var url = $(this).attr('href');
	window.location.href = '#' + url;
	
});


/********************************/
/*page control*******************/
/********************************/

$(document).ready(function() {
var exitStageMode = function() {
	$('.stage-controller').remove();
	$('.stage-dropper').remove();
	$('.edit-stage-id').remove();
	$('.sprite').removeClass('sprite-editmode');
	
	$('#body_head').animate({'margin-top':'29px'}, 500);
	$('.toolbar').animate({'height':'28px'}, 500);
};

var exitSpriteMode = function() {
	$('.sprite').removeSpriteController();
	$('.stage-gap').remove();
	$('.sprite').removeClass('sprite-editmode');
};

var exitBrickMode = function() {
	MINI_BRICK_MASK.css('display', 'none');
	$('.sprite > div').each(function(i, brick) {
		$(brick).unbind('mouseover');
		$(brick).css('min-height', '');
	});
};

var exitCurrentMode = function() {
	switch(CURR_STATUS) {
		case 'stage-edit':
			exitStageMode();
			break;
		case 'sprite-edit':
			exitSpriteMode();
			break;
		case 'brick-edit':
			exitBrickMode();
			break;
	}
	CURR_STATUS = 'normal';
};

$('#enter-stage-mode').click(function() {
	if(CURR_STATUS != 'stage-edit') {
		exitCurrentMode();
		
		$('#body_head').animate({'margin-top':'120px'}, 500);
		$('.toolbar').animate({'height':'120px'}, 500);
		var newDropper = $("<div class='stage-dropper'></div>");
		newDropper.appendTo('.body_main_frame');
		var stages = $('.stage');
		stages.each(function(i, s) {
			var newDropper = $("<div class='stage-dropper'></div>");
			newDropper.insertBefore(s);
			$(s).appendStageController();
		});
		CURR_STATUS = 'stage-edit';

		$('.sprite').addClass('sprite-editmode');
	}
});
$('#enter-sprite-mode').click(function() {
	if(CURR_STATUS == 'stage-edit' && LAYOUT_STAGE_CHANGED == true) {
		alert('当前页面布局已更改，请点击右上角[退出编辑模式],退出页面编辑模式,或保存页面布局');
	} else {
		if(CURR_STATUS != 'sprite-edit') {
			exitCurrentMode();
			
			$('.sprite').each(function(i, s) {
				$(s).appendSpriteController();
			});
			var stages = $('.stage');
			stages.each(function(i, s) {
				var newDropper = $("<div class='stage-gap'></div>");
				newDropper.insertAfter(s);
			});
			CURR_STATUS = 'sprite-edit';

			$('.sprite').addClass('sprite-editmode');
		}
	}
});
$('#enter-brick-mode').click(function() {
	if(CURR_STATUS != 'brick-edit') {
		exitCurrentMode();
		
		$('.sprite > div').each(function(i, brick) {
			$(brick).bind('mouseover', function() {
				var topPos = $(this).offset().top + 'px';
				var leftPos = $(this).offset().left + 'px';
				var width = $(this).width();
				var height = $(this).height();
				MINI_BRICK_MASK.empty();
				var brickId = $(this).attr('brickId');
				MINI_BRICK_MASK.append("<a href='#/admin/brick/edit/brick-id/" + brickId + "'>编辑模块</a>");
				MINI_BRICK_MASK.css({
					'top': topPos,
					'left': leftPos,
					'width': width,
					'height': height,
					'display': 'block'
				});
			});
			$(brick).css('min-height', '40px');
		});
		
		CURR_STATUS = 'brick-edit';
	}
});
$('#enter-normal-mode').click(function() {
	if(CURR_STATUS != 'normal') {
		if(CURR_STATUS == 'stage-edit' && LAYOUT_STAGE_CHANGED == true) {
			if(confirm('对页面布局的修改不会保存，是够确定退出？')) {
				window.location.hash = '#refresh-page';
			}
		} else {
			exitCurrentMode();
		}
	}
});

$('#save-sprite-layout').click(function() {
	if(confirm('确定保存当前设置？')) {
		var layoutId = $('.body_main_frame').attr('layoutId');
		var stages = $('.stage');
		var spriteConfig = new Array();
		stages.each(function(i, st) {
			var stageId = $(st).attr('stage-id');
			spriteConfig.push('{"stageId":"' + stageId + '", "type":"' + $(st).attr('type') + '","sort":"' + $(st).attr('sort') + '"}');
		});
		var postStr = spriteConfig.join(',');
		postStr = '{"layoutId":"' + layoutId + '" ,"stages":[' + postStr + ']}';
		var aj = $.ajax({
			type: "POST",
			url: '/admin/layout-position/save-stage-json/',
			data: 'jsonString=' + postStr,
			dataType: 'json',
			success: function(jsonObj) {
				if(jsonObj.result == 'success') {
					location.reload();
				} else {
					alert('system internal error!');
				}
			}
		});
	}
});

$.fn.appendSpriteController = function() {
	var THIS = $(this);
	var layoutId = $('.body_main_frame').attr('layoutId');
//	THIS.mouseover(function() {
//		THIS.css("border", "1px dashed #678");
//	}).mouseout(function() {
//		THIS.css("border", "1px solid transparent");
//	});
	var newController = $("<a class='sprite-controller link' href='/admin/brick/create/layoutId/" + layoutId + "/stageId/" + THIS.attr('stage-id') + "/spriteName/" + THIS.attr('sprite-name') + "'>添加模块</a>");
	THIS.append(newController);
}
$.fn.removeSpriteController = function() {
	var THIS = $(this);
	THIS.unbind("mouseover").unbind("mouseout");
	THIS.find('.sprite-controller').remove();
}

$.fn.appendStageController = function() {
	var THIS = $(this);
	var newController = $("<a class='stage-controller'>删除此栏</a>");
	THIS.append(newController);
	
	var stageId = THIS.attr('stage-id');
	if(stageId != 0) {
		var editStageId = $("<a class='edit-stage-id' href='#/admin/layout/edit-stage/stageId/" + stageId + "'>编辑ID</a>");
		THIS.append(editStageId);
	}
	newController.click(function() {
		if(confirm('确认删除STAGE？其中包含的模块也会一并被删除！')) {
			LAYOUT_STAGE_CHANGED = true;
			THIS.fadeOut(800, function() {
				var dropper = THIS.prev('.stage-dropper');
				THIS.remove();
				dropper.remove();
				reorderStages();
			});
		}
	});
}

var reorderStages = function() {
	var tempStages = $('.stage');
	tempStages.each(function(i, s) {
		$(s).attr('sort', i);
	});
}

var layout = $('#admin-layout');
var brick = $('#admin-brick');

var dragSrcEl = null;
var sprites = $('div.sprite');


	MINI_BRICK_MASK = $('.mini-brick-mask')
	MINI_BRICK_MASK.mouseleave(function() {
		$(this).css('display', 'none');
	});
	
	var layoutId = $('.body_main_frame').attr('layoutId');
	$('#layout-selector').change(function() {
		window.location.href = $(this).val();
	});
	$('#layout-selector').find('option').each(function(i, ls) {
		if($(ls).attr('layoutId') == layoutId) {
			$(ls).attr('selected', 'selected');
		}
	});
	
	reorderStages();
	$(document).on({
		'dragstart': function(evt) {
			dragSrcEl = $(this);
			dragSrcEl.css('opacity', '0.8');
			evt.dataTransfer.effectAllowed = 'move';
			evt.dataTransfer.setData('text/html', '<div>sprite</div>');
		},
		'dragend': function(evt) {
			dragSrcEl.css({'opacity':0.2});
			dragSrcEl.animate({'opacity':1}, 800);
			dragSrcEl = null;
			return false;
		}
	}, 'div.sprite-type');
	
	$(document).on({
		'dragover': function(evt) {
			evt.preventDefault();
			$(this).css('border', '1px solid #333');
		},
		'dragleave': function(evt) {
			evt.preventDefault();
			$(this).css('border', '1px dotted #777');
		},
		'drop': function(evt) {
			evt.stopPropagation();
			$(this).css('border', '1px dotted #777');
			LAYOUT_STAGE_CHANGED = true;
			//move with empty slot in front of the cell
			var typeId = $(dragSrcEl).attr('typeId');
			
			var newStage = $("<div class='stage'></div>");
			var sprites = new Array();
			switch(typeId) {
				case '0':
					newStage.attr({'type':'100', 'stage-id':'0'});
					var newSprite1 = $("<div spriteId='0' class='sprite grid-100 sprite-editmode'></div>");
					sprites.push(newSprite1);
					break;
				case '1':
					newStage.attr({'type':'50-50', 'stage-id':'0'});
					var newSprite1 = $("<div spriteId='0' class='sprite grid-50 sprite-editmode'></div>");
					var newSprite2 = $("<div spriteId='0' class='sprite grid-50 sprite-editmode'></div>");
					sprites.push(newSprite1, newSprite2);
					break;
				case '2':
					newStage.attr({'type':'25-75', 'stage-id':'0'});
					var newSprite1 = $("<div spriteId='0' class='sprite grid-25 sprite-editmode'></div>");
					var newSprite2 = $("<div spriteId='0' class='sprite grid-75 sprite-editmode'></div>");
					sprites.push(newSprite1, newSprite2);
					break;
				case '3':
					newStage.attr({'type':'33-66', 'stage-id':'0'});
					var newSprite1 = $("<div spriteId='0' class='sprite grid-33 sprite-editmode'></div>");
					var newSprite2 = $("<div spriteId='0' class='sprite grid-66 sprite-editmode'></div>");
					sprites.push(newSprite1, newSprite2);
					break;
				case '4':
					newStage.attr({'type':'66-33', 'stage-id':'0'});
					var newSprite1 = $("<div spriteId='0' class='sprite grid-66 sprite-editmode'></div>");
					var newSprite2 = $("<div spriteId='0' class='sprite grid-33 sprite-editmode'></div>");
					sprites.push(newSprite1, newSprite2);
					break;
				case '5':
					newStage.attr({'type':'75-25', 'stage-id':'0'});
					var newSprite1 = $("<div spriteId='0' class='sprite grid-75 sprite-editmode'></div>");
					var newSprite2 = $("<div spriteId='0' class='sprite grid-25 sprite-editmode'></div>");
					sprites.push(newSprite1, newSprite2);
					break;
				case '6':
					newStage.attr({'type':'33-33-33', 'stage-id':'0'});
					var newSprite1 = $("<div spriteId='0' class='sprite grid-33 sprite-editmode'></div>");
					var newSprite2 = $("<div spriteId='0' class='sprite grid-33 sprite-editmode'></div>");
					var newSprite3 = $("<div spriteId='0' class='sprite grid-33 sprite-editmode'></div>");
					sprites.push(newSprite1, newSprite2, newSprite3);
					break;
				case '7':
					newStage.attr({'type':'25-50-25', 'stage-id':'0'});
					var newSprite1 = $("<div spriteId='0' class='sprite grid-25 sprite-editmode'></div>");
					var newSprite2 = $("<div spriteId='0' class='sprite grid-50 sprite-editmode'></div>");
					var newSprite3 = $("<div spriteId='0' class='sprite grid-25 sprite-editmode'></div>");
					sprites.push(newSprite1, newSprite2, newSprite3);
					break;
				case '8':
					newStage.attr({'type':'25-25-25-25', 'stage-id':'0'});
					var newSprite1 = $("<div spriteId='0' class='sprite grid-25 sprite-editmode'></div>");
					var newSprite2 = $("<div spriteId='0' class='sprite grid-25 sprite-editmode'></div>");
					var newSprite3 = $("<div spriteId='0' class='sprite grid-25 sprite-editmode'></div>");
					var newSprite4 = $("<div spriteId='0' class='sprite grid-25 sprite-editmode'></div>");
					sprites.push(newSprite1, newSprite2, newSprite3, newSprite4);
					break;
				default:
					alert('js file error');
					break;
			}
			$(sprites).each(function(i, s) {
				$(s).appendTo(newStage);
			});
			var newDropper = $("<div class='stage-dropper'></div>");
			newDropper.insertBefore(this);
			newStage.insertBefore(this);
			newStage.appendStageController();
			reorderStages();
			return false; 
		}
	}, 'div.stage-dropper');
});