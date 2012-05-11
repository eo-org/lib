(function($) {
    $.fn.AjaxGrid = function(options) {
    	var AJAX_GRID = this;
    	/*
    	 * encode hash param, so it can be recognized by php
    	 */
    	var urlEncode = function(url) {
    		var ts = "";
    		ts = url.replace('#', '%23');
    		ts = ts.replace('=', '%3D');
    		return ts;
    	};
    	var checkboxAction = function(checkbox) {
    		if(checkbox.attr('checked')) {
    			insertRecord(checkbox.attr('name'));
    		} else {
    			deleteRecord(checkbox.attr('name'));
    		}
    		
    		if(settings._afterCheckboxAction != undefined) {
    			settings._afterCheckboxAction(checkbox);
    		}
        };
        var openNewAction = function(row) {
        	var rowId = row.attr('rowId');
        	window.open(settings.doubleClickHref + rowId);
        	return false;
        };
        var gotoAction = function(row, param) {
        	var rowId = row.attr('rowId');
        	if(param == undefined || param == "") {
        		window.location = settings.doubleClickHref + rowId;
        	} else {
        		window.location = settings.doubleClickHref + rowId + '?hashParam=' + param;
        	}
        	return false;
        };
        AJAX_GRID.contextMenu = function(row, param) {
        	row.contextMenu();
        };
        var updateParentAction = function(row) {
        	var rowId = row.attr('rowId');
        	parent.callback(rowId);
        	alert('clicked');
        	return false;
        };
        var inputAction = function(txt) {
        	var tempArr = txt.attr('id').split('_');
        	var tempId = tempArr[1];
        	var tempKey = tempArr[0];
        	insertRecord(tempId, tempKey, txt.val());
        };
        
    	var settings = {
			container			: $('#grid-container'),
    		invoker				: $('#grid-invoker'),
    		pageTD				: $('#page-TD'),
    		currentSelected		: $('#filter_selectedIds_yes_option'),
    		checkboxAction		: checkboxAction,
    		openNewAction		: openNewAction,
    		gotoAction			: gotoAction,
    		updateParentAction	: updateParentAction,
    		displayFields		: [],
    		fieldOptions		: {},
    		doubleClickAction	: '',
    		doubleClickHref		: '',
    		click				: '',
    		actionId			: 'id',
    		recorder			: {},
    		initSelectRun		: false,
    		hashParam			: ''
    	};
    	
    	options = options || {};
    	$.extend(settings, options);
    	
    	var actionRecorder = settings.recorder;
		for (key in settings.recorder) {
			$('#filter_selectedIds_yes_option').attr('selected', 'selected');
			break;
		}
		
        AJAX_GRID.getRecord = function() {
        	return actionRecorder;
        };
        
        AJAX_GRID.setRecord = function(recorder) {
        	actionRecorder = recorder;
        };
        
        AJAX_GRID.addRecord = function(rowId, key, value) {
        	insertRecord(rowId, key, value);
        };
    	
    	var insertRecord = function(rowId, key, value) {
        	if(actionRecorder[rowId] == undefined) {
        		actionRecorder[rowId] = {};
        	}
        	if(key != undefined && value != undefined) {
        		actionRecorder[rowId][key] = value;
        	}
        };
        
        var deleteRecord = function(rowId) {
        	delete actionRecorder[rowId];
        };
    	
        AJAX_GRID.setOptions = function(options) {
    		$.extend(settings, options);
    		if(settings.initSelectRun) {
    			AJAX_GRID.postAction({currentHash: settings.hashParam, previousHash: ''});
    		}
    	};
        
        var url = settings.invoker.attr('url');
        var filters = $('.filter-field');
        $.each(filters, function(i, f) {
        	$(f).focus(function() {
        		$(this).attr('focused', 1);
        	}).blur(function() {
        		$(this).attr('focused', 0);
        	});
        });
        
        AJAX_GRID.reset = function() {
        	alert('not implemented yet');
        };
        
        AJAX_GRID.empty = function() {
        	settings.container.empty();
        };
        
        AJAX_GRID.postAction = function(hashObj) {
        	var currentHash = hashObj.currentHash;
        	var tmp = $().jqHash(currentHash);
        	tmp.getValue('page');
        	
            var varString = '';
            $.each(filters, function(i, f) {
                if($(f).val() != '') {
                	if($(f).attr('name') == 'filter_selectedIds' && $(f).val() == 'selectedIds') {
                		var tempArr = [];
                		for(id in actionRecorder) {
                			tempArr.push(id);
                		}
                		varString += $(f).attr('name') + '/' + tempArr.join(',') + '/';
                	} else {
                		varString += $(f).attr('name') + '/' + $(f).val() + '/';
                	}
                } else if($(f).attr('name').slice(7, 8) == '@') {
                	varString += $(f).attr('name') + '/' + $(f).val() + '/';
                }
            });
            varString += 'filter_page/' + tmp.getValue('page');
            
            //ajax loader animated effect
            var mask = $("<div class='alpha-filter'></div>").css({'display': 'block', 'background-color': '#FFFFFF'});
        	$('body').append(mask);
        	$('#ajax-loader > .text').empty().append('请稍候,正在读取数据！');
        	$('#ajax-loader').css('display', 'block');
        	// end ajax loader animated effect
            $.getJSON(url + varString, function(jsonObj) {
            	settings.container.empty();
                gridData = jsonObj.data;
                $.each(jsonObj.data, function(i,jo) {
                    var newRow = $('<tr></tr>');
                    for (key in settings.displayFields) {
                    	var keyValue = settings.displayFields[key];
                    	if(keyValue.slice(0,1) == '~') {
                    		var tempArr = keyValue.split('_');
                    		var kv = tempArr[0];
                    		
	                    	switch(kv) {
	                    		case '~selectedIds':
	                    			var checkTD = $("<td></td>");
	                            	var cb = $("<input class='select-id' type='checkbox' name='" + jo[settings.actionId] + "' />");
	                            	if(actionRecorder[jo[settings.actionId]] != undefined) {
	                            		cb.attr('checked', 'checked');
	                            	}
	                            	cb.click(function() {
	                            		settings.checkboxAction(cb);
	                            	}).appendTo(checkTD);
	                            	checkTD.appendTo(newRow);
	                    			break;
	                    		case '~input':
	                    			var labelValue = tempArr[1];
	                    			var txtTD = $("<td></td>");
	                            	var txt = $("<input type='text' id='" + labelValue + "_" + jo[settings.actionId] + "' name='" + labelValue + "[" + jo[settings.actionId] + "]' />");
	                            	if(actionRecorder[jo[settings.actionId]] != undefined) {
	                            		txt.attr('disabled', false);
	                            		txt.val(actionRecorder[jo[settings.actionId]][labelValue]);
	                            	} else {
	                            		txt.attr('disabled', true);
	                            	}
	                            	txt.blur(function() {
	                            		inputAction(txt);
	                            	}).appendTo(txtTD);
	                            	txtTD.appendTo(newRow);
	                    			break;
	                    		case '~href':
	                    			var hrefTD = $("<td></td>");
	                    			$("<a href='" + options.actionAttr.href + jo[options.actionAttr.field] + "' target='" + jo[options.actionAttr.target] + "'>" +options.actionAttr.text + "</a>").appendTo(checkTD);
	                    			hrefTD.appendTo(newRow);
	                    			break;
	                    		case '~contextMenu':
	                    			var hrefTD = $("<td><a class='context-menu-handle' href='#'>操作</a></td>");
	                    			hrefTD.appendTo(newRow);
	                    			break;
	                    	}
                    	} else {
                			if(keyValue.slice(0,1) == '@') {
                				keyValue = keyValue.slice(1);
                			}
							if(settings.fieldOptions[keyValue] != undefined) {
								var td = settings.fieldOptions[keyValue][jo[keyValue]];
							} else {
								var td = jo[keyValue];
							}
                			$("<td>" + td + "</td>").appendTo(newRow);
                    	}
                    }
                    switch(settings.doubleClickAction) {
                    	case 'openNew':
                    		newRow.dblclick(function() {
                    			settings.openNewAction(newRow);
                    		});
                    		newRow.addClass('dbclk');
                    		break;
                    	case 'goto':
                    		newRow.dblclick(function() {
                    			settings.gotoAction(newRow, urlEncode(currentHash));
                    		});
                    		newRow.addClass('dbclk');
                    		break;
                    	case 'updateParent':
                    		newRow.dblclick(function() {
                    			settings.updateParentAction(newRow);
                    		});
                    		newRow.addClass('dbclk');
                    		break;
                    	default:
                    		break;
                    }
                    switch(settings.click) {
                    	case 'contextMenu':
                    		AJAX_GRID.contextMenu(newRow);
                    		break;
                    }
                    newRow.attr('rowId', jo[settings.actionId]);
                    newRow.appendTo(settings.container);
                });
                
                settings.pageTD.jqPager({
                	totalItem: jsonObj.dataSize,
                	itemPerPage: jsonObj.pageSize,
                	currentPage: jsonObj.currentPage
                });
                
                //remove ajax loader
                mask.remove();
                $('#ajax-loader').css('display', 'none');
                //end remove ajax loader
            });
        };
        
        settings.invoker.click(function(event) {
        	AJAX_GRID.postAction({currentHash: '#page=1', previousHash: '#'});
        });
        
        $(window).keydown(function(event) {
        	if(event.keyCode === 13 ) {
	        	var refreshContent = false;
	        	filters.each(function(i, f) {
	        		if($(f).attr('focused') == 1) {
	        			refreshContent = true;
	        		}
	        	});
	        	if(refreshContent) {
	        		settings.invoker.click(); 
	        	}
        	}
        });
        if(settings.initSelectRun) {
			AJAX_GRID.postAction({currentHash: settings.hashParam, previousHash: ''});
		}
        return this;
    };
})(jQuery);