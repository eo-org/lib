(function($) {
    $.fn.AjaxGrid = function(options) {
    	var AJAX_GRID = this;
    	
        displayFields = options.displayFields;
        fieldOptions = options.fieldOptions || {};
        container = options.container || $('#grid-container');
        invoker = options.invoker || $('#grid-invoker');
        gridFormContainer = options.gridForm || $('#grid-form-container');
        pageTD = options.pageTD || $('#page-TD');
        defaultFilters = options.defaultFilters || {};
        
        this.gridAction = function(gridData) {
            var newRow = $('<tr></tr>');
            var checkTD = $("<td></td>");
            $("<input type='checkbox' name='pIds[" + gridData.entityId + "]' checked='checked' />").click(function() {
                $(this).closest('tr').remove();
            }).appendTo(checkTD);
            checkTD.appendTo(newRow);
            
            for(key in displayFields) {
                $("<td>" + gridData[displayFields[key]] + "</td>").appendTo(newRow);
            }
            newRow.appendTo(gridFormContainer);
        }
        
        gridAction = options.gridAction || this.gridAction;
        
        action = options.action || 'checkbox';
        
        var url = invoker.attr('url');
        var filters = $('.filter-field');
        
        AJAX_GRID.postAction = function(hashObj) {
        	var currentHash = hashObj.currentHash;
        	
        	var tmp = $().jqHash(currentHash);
        	tmp.getValue('page');
        	
            var varString = '';
            for(var filter in defaultFilters) {
            	varString += 'filter_' + filter + '/' + defaultFilters[filter] + '/';
            }
            $.each(filters, function(i, f) {
                if($(f).val() != '') {
                    varString += $(f).attr('name') + '/' + $(f).val() + '/';
                } else if($(f).attr('name').slice(0, 1) == '@') {
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
                
            	container.empty();
                gridData = jsonObj.data;
                $.each(jsonObj.data, function(i,jo) {
                    var newRow = $('<tr></tr>');
                    var checkTD = $("<td></td>");
                    if(action == 'checkbox') {
                        $("<input type='checkbox' name='' />").click(function(event) {
                            if($(this).attr('checked')) {
                                gridAction(jo);
                            }
                        }).appendTo(checkTD);
                    } else if(action == 'href'){
                        $("<a href='" + options.actionAttr.href + jo[options.actionAttr.field] + "' target='" + jo[options.actionAttr.target] + "'>" + options.actionAttr.text + "</a>").appendTo(checkTD);
                    }
                    checkTD.appendTo(newRow);
                    for (key in displayFields) {
						if(fieldOptions[displayFields[key]] != undefined) {
							var td = fieldOptions[displayFields[key]][jo[displayFields[key]]];
						} else {
							var td = jo[displayFields[key]];
						}
						$("<td>" + td + "</td>").appendTo(newRow);
                    }
                    
                    newRow.appendTo(container);
                });
                
                $('#page-TD').jqPager({
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
        
        invoker.click(function(event) {
        	AJAX_GRID.postAction({currentHash: '#page=1', previousHash: '#'});
        });
        $(window).keydown(function(event){
	       	if(event.keyCode === 13 ){
	       		invoker.click(); 
	       	}
        });
        return this;
    };
})(jQuery);