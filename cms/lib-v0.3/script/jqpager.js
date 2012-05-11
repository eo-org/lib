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