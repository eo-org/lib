function guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+"-"+S4());
}

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
				$('.sprite-surrogate').each(function(i, s) {
					$(s).appendSurrogateController();
				});
				var stages = $('.stage');
				stages.each(function(i, s) {
					if(i == 0) {
						var newDropper = $("<div class='stage-gap'></div>");
						newDropper.insertBefore(s);
					}
					var newDropper = $("<div class='stage-gap'></div>");
					newDropper.insertAfter(s);
				});
				CURR_STATUS = 'sprite-edit';
	
				$('.sprite').addClass('sprite-editmode');
				$('.sprite-surrogate').addClass('sprite-editmode');
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
					var brickId = $(this).attr('brick-id');
					var extName = $(this).attr('ext-name');
					MINI_BRICK_MASK.append("<div class='ext-name'>" + extName + "</div> <a href='#/admin/brick.ajax/edit/id/" + brickId + "'>编辑模块</a>");
					MINI_BRICK_MASK.css({
						'top': topPos,
						'left': leftPos,
						'width': width,
						'height': height,
						'display': 'block',
						'zIndex': '99'
					});
					
					if($(this).attr('gearlinks') != undefined) {
						var gearLinks = jQuery.parseJSON($(this).attr('gearlinks'));
						
						if(gearLinks.length > 0) {
							var UL = $("<ul class='gearlinks'></ul>");
							for(i in gearLinks) {
								gl = gearLinks[i];
								UL.append("<li><a href='#" +  gl.href + "'>" + gl.label + "</a></li>");
							}
							MINI_BRICK_MASK.append(UL);
						}
					}
				});
				$(brick).css('min-height', '80px');
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
				var uniqueId = $(st).attr('id') == undefined ? "" : $(st).attr('id');
				spriteConfig.push('{"stageId":"' + stageId + '", "type":"' + $(st).attr('type') + '", "uniqueId":"' + uniqueId + '"}');
			});
			var postStr = spriteConfig.join(',');
			postStr = '{"layoutId":"' + layoutId + '" ,"stages":[' + postStr + ']}';
			var aj = $.ajax({
				type: "POST",
				url: '/rest/layout.json/save-stage',
				data: 'jsonString=' + postStr,
				dataType: 'json',
				success: function(output, status, xhr) {
					$result = xhr.getResponseHeader('result');
					if($result == 'success') {
						location.reload();
					} else {
						console.log($result);
						alert('system internal error!');
					}
				}
			});
		}
	});
	
	$.fn.appendSpriteController = function() {
		var THIS = $(this);
		var layoutId = $('.body_main_frame').attr('layoutId');
		var newController = $("<a class='sprite-controller' href='#/admin/brick.ajax/create/layoutId/" + layoutId + "/stageId/" + THIS.attr('stage-id') + "/spriteName/" + THIS.attr('sprite-name') + "'>添加模块</a>");
		THIS.append(newController);
	}
	$.fn.appendSurrogateController = function() {
		var THIS = $(this);
		var layoutId = $('.body_main_frame').attr('layoutId');
		var newController = $("<a class='sprite-controller' href='#/admin/brick.ajax/create/layoutId/" + layoutId + "/stageId/" + THIS.attr('stage-id') + "/spriteName/" + THIS.attr('sprite-name') + "'>添加TAB</a>");
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
			var editStageId = $("<a class='edit-stage-id' href='#/admin/layout.ajax/edit-stage/stageId/" + stageId + "'>编辑ID</a>");
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
			newStage.attr('stage-id', guidGenerator());
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
	
	$('#load-local-css').click(function() {
		window.location.href = '/?local-css-mode=activate';
	});
	$('#unload-local-css').click(function() {
		window.location.href = '/?local-css-mode=deactivate';
	});
	$('#reload-local-css').click(function() {
	    var queryString = '?reload=' + new Date().getTime();
	    $('link').each(function (i, el) {
	    	var href = $(el).attr('href');
	    	if(href.indexOf('http://local.host/') === 0) {
	    		this.href = this.href.replace(/\?.*|$/, queryString);
	    	}
	    });
	});
});