(function($) {	
	var jqHash = function(hashString, name) {
		var hashArr = hashString.split('&');
		$(hashArr).each(function(i, hashItem) {
    		var tmp = hashItem.split('=');
    		if(tmp[0] == name) {
    			value = tmp[1];
    		}
    	});
		return value;
    }
	
	
	//**********************//
	//**********************//
	//********Action********//
	//**********************//
	//**********************//
	var menuItemArr = new Array();
	$.fn.ContextMenuInit = function() {
		menuItemArr = new Array();
		
		this.appendItem = function(label, action) {			
			menuItemArr.push({'label': label, 'action': action});
		}
		return this;
	};
	
	jQuery.fn.contextMenu = function() {
		var ITEM = this;
		var rowId = ITEM.attr('rowId');
		var len = menuItemArr.length;
		for(var $i = 0; $i < len; $i++) {
			var actionLink = $("<a href='" + menuItemArr[$i].action + rowId + "'>" + menuItemArr[$i].label + "</a>");
			actionLink.appendTo(ITEM);
		}
	};
	
	
	//**********************//
	//**********************//
	//********Grid**********//
	//**********************//
	//**********************//
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
        
    	var settings = {
			container			: $('#grid-container'),
    		invoker				: $('#grid-invoker'),
    		pageTD				: $('#page-TD'),
    		currentSelected		: $('#filter_selectedIds_yes_option'),
    		checkboxAction		: checkboxAction,
    		displayFields		: [],
    		fieldOptions		: {},
    		actionId			: 'id',
    		recorder			: {},
    		initSelectRun		: true,
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
        
        AJAX_GRID.postAction = function(currentHash) {
        	var page = jqHash(currentHash, 'page');
        	
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
            varString += 'filter_page/' + page;
            
            $.getJSON(url + varString, function(jsonObj) {
            	settings.container.empty();
                gridData = jsonObj.data;
                $.each(jsonObj.data, function(i,jo) {
                	if(i%2 == 0) {
                		var newRow = $('<tr></tr>');
                	} else {
                		var newRow = $("<tr class='odd'></tr>");
                	}
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
	                    		case '~href':
	                    			var hrefTD = $("<td></td>");
	                    			$("<a href='" + options.actionAttr.href + jo[options.actionAttr.field] + "' target='" + jo[options.actionAttr.target] + "'>" +options.actionAttr.text + "</a>").appendTo(checkTD);
	                    			hrefTD.appendTo(newRow);
	                    			break;
	                    		case '~contextMenu':
	                    			var actionTD = $("<td></td>");
	                    			actionTD.attr('rowId', jo[settings.actionId])
	                    			actionTD.appendTo(newRow);
	                    			actionTD.contextMenu();
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
                    newRow.attr('rowId', jo[settings.actionId]);
                    newRow.appendTo(settings.container);
                });
                
                settings.pageTD.jqPager({
                	totalItem: jsonObj.dataSize,
                	itemPerPage: jsonObj.pageSize,
                	currentPage: jsonObj.currentPage
                });
            });
        };
        
        settings.invoker.click(function(event) {
        	AJAX_GRID.postAction('page=1');
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
			AJAX_GRID.postAction('page=1');
		}
        return this;
    };
})(jQuery);

//jqpager

(function($) {
	HashContoller = function(hashArr) {
		var hashArr = hashArr.substring(8);
		var pageNumber;
		var pieces = new Array();
		if(_.isEmpty(hashArr)) {
			page = 1;
		} else {
			pieces = hashArr.split('&');
		}
		
		var composeSearchQuery = function(pageNumber) {
			var q = "";
			_.each(pieces, function(piece) {
				var tmp = piece.split('=');
				if(tmp[0] != 'page') {
					q+= tmp[0] + '=' + tmp[1] + '&';
				}
			});
			
			q+= 'page=' + pageNumber;
			return q;
		}
		
		this.getLink = function(pageNumber) {
			return '#search:' + composeSearchQuery(pageNumber);
		}
	};
	
	$.fn.jqPager = function(options) {
		var PAGE_CONTAINER = this;
		PAGE_CONTAINER.options = {
			totalItem: 0,
            itemPerPage: 50,
            currentPage: 1,
            preText: '< 前一页',
            nextText: '后一页 >',
            breakText: "...",
            hashObj: '#',
            linkPagesExtra: 8,
            linkPagesEnds: 1
		}
		
		var hc = new HashContoller(window.location.hash);
		
		PAGE_CONTAINER.buildLink = function(hashObj, pageNumber, text) {
			return $("<a href='" + hc.getLink(pageNumber) + "'>" + text + "</a>");
		}
		
		options = $.extend(PAGE_CONTAINER.options, options);
		
		numberOfPages = Math.ceil(options.totalItem/options.itemPerPage);
		
		PAGE_CONTAINER.empty();
		
		var links = new Array();
		
        for(var i = 1; i <= numberOfPages; i++) {
            if (
                i <= options.linkPagesEnds
        	    || i > numberOfPages - options.linkPagesEnds
        	    || (i >= options.currentPage - options.linkPagesExtra && i <= options.currentPage + options.linkPagesExtra)
            ) {
                if(i != options.currentPage) {
                    links[i] = PAGE_CONTAINER.buildLink(options.hashObj, i, i);
                } else {
                    links[i] = $("<span>" + i + "</span>").addClass('curr');
                }
            } else if (
        	    i == options.currentPage - options.linkPagesExtra - 1
        	    || i == options.currentPage + options.linkPagesExtra + 1
            ) {
            	links[i] = $("<span>" + options.breakText + "</span>").addClass('break');
            }
        }
        
        if (numberOfPages != options.currentPage && numberOfPages != 0) {
        	links[numberOfPages + 1] = PAGE_CONTAINER.buildLink(options.hashObj, options.currentPage + 1, options.nextText).addClass('next');
        } else {
        	links[numberOfPages + 1] = $('<span>' + options.nextText + '</span>').addClass('next');
        }
        
        if (1 != options.currentPage) {
            links[0] = PAGE_CONTAINER.buildLink(options.hashObj, options.currentPage - 1, options.preText).addClass('pre');
        } else {
        	links[0] = $('<span>' + options.preText + '</span>').addClass('pre');
        }
        
        $(links).each(function(i, link) {
        	PAGE_CONTAINER.append(link);
        });
	}
})(jQuery);