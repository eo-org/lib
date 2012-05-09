//(function($) {
//	var filterGroups;
//	
//	$.fn.ProductFilter = function(options) {}
//	
//	function explodeHash(cleanHash) {
//		var hashArray = cleanHash.split('&');
//		var hashObject = {};
//		$(hashArray).each(function(i, ha){
//			if(ha != '') {
//				var temp = ha.split('=');
//				hashObject[temp[0]] = temp[1];
//			}
//<<<<<<< .mine
//		});
//		return hashObject;
//	};
//	
//	$.fn.rewriteHash = function(hashObj) {
//		var groupKey = $(this).attr('group');
//		var opt = $(this).attr('opt');
//		
//        var hashString = "";
//        var noCurrentKey = true;
//        for(key in hashObj) {
//        	if(key == groupKey) {
//        		noCurrentKey = false;
//        	} else {
//        		if(key != 'page') {
//        			hashString += key + '=' + hashObj[key] + '&';
//        		}
//        	}
//=======
//			
//			var ajaxPage = $('#ajax-page');
//			var pageCover = $("<div></div>").addClass('ajax-loading-large').addClass('page-cover')
//			    .css('opacity', 0.7)
//			    .css('height', ajaxPage.height());
//			
//			ajaxPage.append(pageCover);
//			
//			var postURL = '/product-list/get-product-list-json/var/' + currentHash
//			
//            var container = $('dl#product-list-container');
//            var categoryId = container.attr('category-id');
//            var purposeId = container.attr('purpose-id');
//            if(typeof(categoryId) != 'undefined' && categoryId != '') {
//            	postURL += '/categoryId/' + categoryId;
//            }
//            if(typeof(purposeId) != 'undefined' && purposeId != '') {
//            	postURL += '/purposeId/' + purposeId;
//            }
////            alert(postURL);
//            $.getJSON(
//        		postURL,
//                function(jsonObj) {
//                	if(jsonObj.sql) {
//                		alert(jsonObj.sql);
//                	}
//                    pageCover.remove();
//                    
//                    var currentPage = parseInt(tempHashObj['page']);
//                    var totalItem = parseInt(jsonObj.qty);
//                    var itemPerPage = 16;
//                    container.empty();
//				    
//                    var links = renderLinks({
//                        totalItem: totalItem,
//                        itemPerPage: itemPerPage,
//                        currentPage: currentPage,
//                        preText: '前一页',
//                        nextText: '后一页',
//                        breakText: "...",
//                        hashObj: tempHashObj
//                    });
//                    
//                    var pagerTop = $('#pager-top');
//                    var pagerBotton = $('#pager-bottom');
//                    pagerTop.empty();
//                    pagerBotton.empty();
//				    $.each(links, function(j, a) {
//				        pagerTop.append(a);
//				    });
//				    pagerTop.clone().appendTo(pagerBotton);
//				    
//				    var sorters = $('#sorter a');
//                    var sortersKey = ['new', 'rank', 'priceup', 'pricedown'];
//                    sorters.each(function(i, s){
//                        var sorterHashString = "";
//                        tempHashObj['sort'] = sortersKey[i];
//                        tempHashObj['page'] = 1;
//                        for(key in tempHashObj) {
//                            sorterHashString += key+'='+tempHashObj[key]+'&';
//                        }
//                        $(s).attr('href', '#' + sorterHashString.slice(0, -1));
//                    });
//                    
//                    if(jsonObj.product.length == 0) {
//                        $("<dd>产品列表为空</dd>").attr('class', 'no-product').appendTo(container);
//                    }
//					
//                    $.each(jsonObj.product, function(i,jo) {
//                        $("<dd>"
//						    +"<a href='/product-detail/" + jo.entityId+ "'>"
//                            + "<img  src='" + jo.thumbPath + "' alt='" + jo.alt + "'>"
//                            + "</a>"
//							+"<div>"
//							+"<a href='/product-detail/" + jo.entityId+ "'>"
//							+ jo.name
//							+ "</a>"
//							+"<span class='pre-price'>"
//							+"售价：￥" + jo.price
//							+"</span>"
//							+"<!--span class='number-price'>"
//							+"会员价："  + jo.price
//							+"</span-->"
//							+"</div>"
//                            + "</dd>"
//                        ).appendTo(container);
//                    });
//                }
//            );
//        } else {
//            window.location.hash = hashObj.previousHash;
//>>>>>>> .r120
//        }
//        
//        if(noCurrentKey) {
//        	hashString += groupKey + '=' + opt + '&';
//        }
//        
//		$(this).attr('href', '#' + hashString + 'page=1');
//	}
//	
//	$.fn.ProductFilter.init = function(options) {
//		filterGroups = new Array();
//		
//		var priceMax = options.priceMax || 0;
//		
//		$('.filter-attr').each(function(i, attrObj) {
//			$(attrObj).click(function(event) {
//				var xPox = $(this).css('width');
//				var yPos = $(this).attr('yPos');
//				var status = $(this).attr('status');
//				if(status == 'checked') {
//					$(this).attr('status', '');
//					$(this).stop().animate(
//						{backgroundPosition: '0px ' + yPos}, 
//						{duration: 500}
//					);
//				} else {
//					$(this).attr('status', 'checked');
//					$(this).stop().animate(
//						{backgroundPosition: '-' + xPox + ' ' + yPos}, 
//						{duration: 500}
//					);
//				}
//				setHash();
//			});
//			filterGroups.push($(attrObj));
//		});
//		
//		
//		$('#filter-price').slider({
//			max: priceMax,
//		 	range: true,
//		  	step: 10,
//		 	values: [0, priceMax],
//		  	slide: function(event, ui) {
//		  		$('#price-min').html(ui.values[0]);
//		  		$('#price-max').html(ui.values[1]);
//		  	},
//		  	change: function(event, ui) {
//		  		setHash();
//		  	}
//		});
//		
//		//init set filters;
//		setHash();
//		
//		//init set filters;
//	}
//	
//	
//	function setHash() {
//		//var newHash = "";
//		var currentHash = window.location.hash.slice(1);
//		
//		var hashObj = explodeHash(currentHash);
//		alert(hashObj);
//		
//		for(key in filterGroups) {
//			filterGroups[key].rewriteHash(hashObj);
//		}
//		
//		
//		//window.location.hash = newHash + 'page=1';
////		
////		alert(currentHash);
//		
////		$('.filter-attr').each(function(i, attrObj) {
////			$(this).attr('href', '#wulalal');
////		});
////
////		'price-range=' + $('#filter-price').slider('option', 'values') + '&';
//		
//		
//	};
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	
//	$(window.location).bind('change', function(event, hashObj) {
////		currentHash = hashObj.currentHash.slice(1);
////		if(validateHash(currentHash)) {
////			var tempHashObj = explodeHash(currentHash);
////			if(hashObj.previousHash == "") {
////				for(key in filterGroups) {
////					filterGroups[key].setFromHash(tempHashObj);
////				}
////			}
////			
////			var ajaxPage = $('#ajax-page');
////			var pageCover = $("<div></div>").addClass('ajax-loading-large').addClass('page-cover')
////			    .css('opacity', 0.7)
////			    .css('height', ajaxPage.height());
////			
////			ajaxPage.append(pageCover);
////			
////			var postURL = '/product-list/get-product-list-json/var/' + currentHash
////			
////            var container = $('dl#product-list-container');
////            var categoryId = container.attr('category-id');
////            var purposeId = container.attr('purpose-id');
////            if(typeof(categoryId) != 'undefined' && categoryId != '') {
////            	postURL += '/categoryId/' + categoryId;
////            }
////            if(typeof(purposeId) != 'undefined' && purposeId != '') {
////            	postURL += '/purposeId/' + purposeId;
////            }
//////            alert(postURL);
////            $.getJSON(
////        		postURL,
////                function(jsonObj) {
////                	if(jsonObj.sql) {
////                		alert(jsonObj.sql);
////                	}
////                    pageCover.remove();
////                    
////                    var currentPage = parseInt(tempHashObj['page']);
////                    var totalItem = parseInt(jsonObj.qty);
////                    var itemPerPage = 16;
////                    container.empty();
////				    
////                    var links = renderLinks({
////                        totalItem: totalItem,
////                        itemPerPage: itemPerPage,
////                        currentPage: currentPage,
////                        preText: '前一页',
////                        nextText: '后一页',
////                        breakText: "...",
////                        hashObj: tempHashObj
////                    });
////                    
////                    var pagerTop = $('#pager-top');
////                    var pagerBotton = $('#pager-bottom');
////                    pagerTop.empty();
////                    pagerBotton.empty();
////				    $.each(links, function(j, a) {
////				        pagerTop.append(a);
////				    });
////				    pagerTop.clone().appendTo(pagerBotton);
////				    
////				    var sorters = $('#sorter a');
////                    var sortersKey = ['new', 'rank', 'priceup', 'pricedown'];
////                    sorters.each(function(i, s){
////                        var sorterHashString = "";
////                        tempHashObj['sort'] = sortersKey[i];
////                        tempHashObj['page'] = 1;
////                        for(key in tempHashObj) {
////                            sorterHashString += key+'='+tempHashObj[key]+'&';
////                        }
////                        $(s).attr('href', '#' + sorterHashString.slice(0, -1));
////                    });
////                    
////                    if(jsonObj.product.length == 0) {
////                        $("<dd>产品列表为空</dd>").attr('class', 'no-product').appendTo(container);
////                    }
////					
////                    $.each(jsonObj.product, function(i,jo) {
////                        $("<dd>"
////						    +"<a href='/product-detail/" + jo.entityId+ "'>"
////                            + "<img  src='" + jo.thumbPath + "' alt='" + jo.alt + "'>"
////                            + "</a>"
////							+"<div>"
////							+"<a href='/product-detail/" + jo.entityId+ "'>"
////							+ jo.name
////							+ "</a>"
////							+"<span class='pre-price'>"
////							+"原价：" + jo.price
////							+"</span>"
////							+"<!--span class='number-price'>"
////							+"会员价："  + jo.price
////							+"</span-->"
////							+"</div>"
////                            + "</dd>"
////                        ).appendTo(container);
////                    });
////                }
////            );
////        } else {
////            window.location.hash = hashObj.previousHash;
////        }
//    });
//	
//    function renderLinks(options) {
//        var linkPagesExtra = 2;
//        var linkPagesEnds = 1;
//        
//        links = Array();
//        numberOfPages = Math.ceil(options.totalItem/options.itemPerPage);
//        
//        for(var i = 1; i <= numberOfPages; i++) {
//            if (
//                i <= linkPagesEnds
//        	    || i > numberOfPages - linkPagesEnds
//        	    || (i >= options.currentPage - linkPagesExtra && i <= options.currentPage + linkPagesExtra)
//            ) {
//                if(i != options.currentPage) {
//                    links[i] = buildLink(options.hashObj, i);
//                } else {
//                    links[i] = $("<span>" + i + "</span>").addClass('curr');
//                }
//            } else if (
//        	    i == options.currentPage - linkPagesExtra - 1
//        	    || i == options.currentPage + linkPagesExtra + 1
//            ) {
//              links[i] = $("<span>" + options.breakText + "</span>").addClass('break');
//            }
//        }
//    
//        if (numberOfPages != options.currentPage && numberOfPages != 0) {
//            nextLink = buildLink(options.hashObj, options.currentPage + 1, options.nextText).addClass('next');
//            links[numberOfPages + 1] = nextLink;
//        } else {
//            nextLink = $('<span>' + options.nextText + '</span>').addClass('next');
//        }
//        
//        if (1 != options.currentPage) {
//            preLink = $('<a>' + options.preText+'</a>').attr('href', '#page=' + (options.currentPage - 1)).addClass('pre');
//            preLink = buildLink(options.hashObj, options.currentPage - 1, options.preText).addClass('pre');
//            links[0] = preLink;
//        } else {
//            preLink = $('<span>' + options.preText + '</span>').addClass('pre');
//        }    
//        
////        links[0] = preLink;
////        links[numberOfPages + 1] = nextLink;
//        
//        return links;
//    };
//    
//    function buildLink(tempHashObj, pageNumber, label)
//    {
//        tempHashObj['page'] = pageNumber;
//        var pageHashString = "";
//        for(key in tempHashObj) {
//            pageHashString += key+'='+tempHashObj[key]+'&';
//        }
//        if(label == null) {
//            return $('<a>' + pageNumber + '</a>').attr('href', '#'+pageHashString.slice(0, -1));
//        } else {
//            return $('<a>' + label + '</a>').attr('href', '#'+pageHashString.slice(0, -1));
//        }
//    }
//    
//	function validateHash() {
//		return true;
//	};
//	
//	function unsetCheckbox(groupKey) {
//		$(".filter-attr[group='" + groupKey + "']").each(function() {
//			this.checked = false;
//		});
//	};
//})(jQuery);
