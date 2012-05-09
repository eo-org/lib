
(function($) {

  $.widget("ui.ajaxPager", {
    _init: function() {
      this.numberOfPages = 0;
      for (k in this.options.pages)
      	this.numberOfPages++;
      this.currentPage = this.options.page;
      
      this.element.html(this._render());
      this.element.append(this._renderLinks());
      
      this.setPage(this.currentPage);
      
      return this;
    },
    
    _render: function () {
    
      var pager = this;
      
//      // find predfined pages
//      elements = this.element.children('*');
//            
//      this.element.empty();
//      
//      $.each(elements,function(t,element){
//        if ($(element).attr('class').search(/page(\d+)/)!=-1) {
//          pager.options.pages.splice([$(element).attr('class').match(/page(\d+)/)[1]-1],0, {
//            content: $(element).html(),
//            type: "string",
//          });
//        }
//        
//      });
      
      var holder = $("<div class='ajaxPagerPages'><div class='ajaxPagerCurrentPage'></div></div>");
      // temp holder
//      var holder = $("<div></div>");
      
      // page holder
//      this.pagesE = $("<div class='ajaxPagerPages'><div class='ajaxPagerCurrentPage'></div></div>");
//      holder.append(this.pagesE);
      
      var pages = Array();

      var a = this;
      // foreach page
      $.each(this.options.pages, function (k,page) {
        var page = this;
        pages[k]={};
//        if (typeof page == 'string' && pager.type == 'string') {
//          page = {
//            content: page,
//          }
//        } else if (typeof page == 'string') {
          page = {
            url: page,
          }
//        }
        pages[k].options = page;
        pages[k].pageNumber = k+1;
      });
      
      this.pages = pages;
      $.each(pages, function (k,page) {

        if (typeof page != 'object' || typeof page.options != 'object') {
          i++;
          return true;
        }
        
        // add the global on show function to the page if it doesnt have one
//        if (typeof page.options.onShow=='function') {
//          page.options._onShow = function (i) {
//            page.options.onShow(i);
//            a.options.onPageShow(i); 
//          }; 
//          
//        } else {
//          page.options._onShow = function (i) {
//            a.options.onPageShow(i);
//          };
//        }
        
        // add the global on load function to the page if it doesnt have one
//        if (typeof page.options.onLoad=='function') {
//          page.options._onLoad = function (i) {
//            page.options.onLoad(i);
//            a.options.onPageLoad(i); 
//            page.loaded=true;
//          }; 
//          
//        } else {
          page.options._onLoad = function (i) {
            a.options.onPageLoad(i);
            page.loaded=true;
          };
//        }
        
//        // if page type is undefined use the default
//        if (typeof page.options.type != 'string') {
//          page.options.type = pager.options.type;
//        }
//        
//        // if page on demand is undefined use the default
//        if (typeof page.options.preLoad == 'undefined') {
//          if (pager.options.preLoad===true) {
//            page.options.preLoad = true;
//          } else {
//            page.options.preLoad = false;
//          }
//          
//        }
//          
//        // add the global selector to the page if it doesn't have one
//        if (page.options.selector!=false && typeof page.options.selector!='string' && typeof a.options.selector=='string') {
//          page.options.selector = a.options.selector.replace(/{i}/g, k+1);
//        } 
//        // if not on demand load
//        if (page.options.preLoad || page.options.type == 'element' || page.options.type=='string') {
//          pager._loadPage(page);
//        }

      });
      return holder;
    },
    
    // set the page to pageNumber
    setPage: function (pageNumber) {
      
      // save pageNumber
      this.currentPage = pageNumber;
      
      if (!this.pages[pageNumber-1].loaded) {
        // load the page
        this.loadPage(pageNumber);
      }
      
      this._preLoad(this.pages[pageNumber-1]);
      
      // refresh
      this._refresh();
      
      // refresh links
      this._refreshLinks();
      
      //this.options.pages[pageNumber].ong);
      return this;
      
    },
    
    // set page to one more than current
    nextPage: function () {
      this.setPage(this.currentPage+1);
      return this;
    },
    
    // set page to one less than current
    previousPage: function () {
      this.setPage(this.currentPage-1);
      return this;
    },
    
    // set to first page
    firstPage: function () {
      this.setPage(1);
    },
    
    // set to last page
    lastPage: function () {
      this.setPage(this.numberOfPages);
    },
    
    // refresh the status on pages and links
    _refresh: function () {
      
      //this.pagesE.find('.ajaxPagerCurrentPage').html(this.pages[this.currentPage-1].content);
      
    },
    
    _refreshLinks: function () {
      var pager = this;
      pager.linksE.find('*').remove();
      
      $.each(this.pages,function (k,page) {
        if ((typeof pager.pages[k] == 'object')
        	&& ( k+1<=pager.options.linkPagesStart
        		|| k>=pager.numberOfPages-pager.options.linkPagesEnd
        		|| ( k>=pager.currentPage-pager.options.linkPagesBefore-1 && k<=pager.currentPage+pager.options.linkPagesAfter-1)
        		|| (k+1<pager.currentPage && pager.options.linkPagesBefore==0)
        		|| (k+1>pager.currentPage && pager.options.linkPagesAfter==0)
        		)
        ) {
          pager.links[k] = $("<a>"+(k+1)+"</a>");
          
          if (k+1==pager.currentPage) {
//            pager.links[k].addClass('active').css('text-decoration','underline');
//          } else {
            pager.links[k].addClass('disabled').addClass('current');
          }
          
          pager.links[k][0].pageNumber = k+1;
          
//          pager.links[k].click(function () {
//            if($(this).hasClass('active')) { pager.setPage(this.pageNumber); }
//          });
          pager.linksE.append(pager.links[k]);
        } else if (
        	k==pager.currentPage-pager.options.linkPagesBefore-2
        	|| k==pager.currentPage+pager.options.linkPagesAfter
        ) {
          pager.links[k] = $("<div class='ajaxPagerPageBreak'>"+pager.options.linkPagesBreak+"</div>");
          pager.linksE.append(pager.links[k]);
        }
      });
      
      // add previous link
      if (this.options.previous) {
        previousLink = $('<div class="ajaxPagerPreviousLink">'+this.options.previousText+'</div>')
          .css('cursor','pointer')
          .click(function () { if($(this).hasClass('active')) { pager.previousPage() }});
        // set status
        if (1!=pager.currentPage) {
          previousLink.addClass('active').css('text-decoration','underline');
        } else {
          previousLink.addClass('disabled').addClass('current');
        } 
        this.linksE.prepend(previousLink);
      }
      
      // add first link
      if (this.options.first) {
        firstLink = $('<div class="ajaxPagerFirstLink">'+this.options.firstText+'</div>')
          .css('cursor','pointer')
          .click(function () { if($(this).hasClass('active')) { pager.firstPage() }});
          
        // set status
        if (1!=pager.currentPage) {
          firstLink.addClass('active').css('text-decoration','underline');
        } else {
          firstLink.addClass('disabled').addClass('current');
        } 
        this.linksE.prepend(firstLink);
      }
      
      // add next link
      if (this.options.next) {
        nextLink = $('<div class="ajaxPagerNextLink">'+this.options. nextText+'</div>')
          .css('cursor','pointer')
          .click(function () { if($(this).hasClass('active')) { pager.nextPage() }});
        // set status
        if (pager.numberOfPages!=pager.currentPage) {
          nextLink.addClass('active').css('text-decoration','underline');
        } else {
          nextLink.addClass('disabled').addClass('current');
        }  
        this.linksE.append(nextLink);
      }
      
      // add last link
      if (this.options.last) {
        lastLink = $('<div class="ajaxPagerLastLink">'+this.options.lastText+'</div>')
          .css('cursor','pointer')
          .click(function () { if($(this).hasClass('active')) { pager.lastPage() }});
        // set status
        if (pager.numberOfPages!=pager.currentPage) {
          lastLink.addClass('active').css('text-decoration','underline');
        } else {
          lastLink.addClass('disabled').addClass('current');
        } 
        this.linksE.append(lastLink);
      }
    },
    
    
    _renderLinks: function () {
      this.links = Array();
      this.linksE = $('<div id="pager"></div>');
      this._refreshLinks();
      return this.linksE;
    },
    
    loadPage: function (pageNumber) {
      this._loadPage(this.pages[pageNumber-1]);
    },
    
    _preLoad: function (page) {
      if (this.options.preLoad>1) {
        for(i=0;i<=this.options.preLoad;i++) {
          if (!this.pages[page.pageNumber+i].loaded) {
            this._loadPage(this.pages[page.pageNumber+i]);
          }
          
        }
      }
    },
    
    _loadPage: function (page) {
      pager = this;
      // generate page content
      switch (page.options.type) {
        
        // for static strings
        case "string":
          page.content = page.options.content;
          page.options._onLoad(page.pageNumber);         
          break;
          
        // for ajax
        case "ajax":
          
          // set content to "Loading..."
          page.content = "Loading...";
          
          $.ajax({
            'url': page.options.url,
            success: function (data) {
              
              if (typeof page.options.selector != 'undefined' && page.options.selector != false) {
                page.content = $(page.options.selector,$("<div>"+data+"</div>")).html();
              } else if ($(data).find('body').length>0) {
                page.content = $(data).find('body').html();
              } else {
                page.content = data;
              }
              
              pager._refresh();
              page.options._onLoad(page.pageNumber);
              
            }
            
          });
          break;
          
        
        // for iframes
        case "iframe":

          page.content = '<iframe src ="'+page.options.url+'"><p>Your browser does not support iframes.</p></iframe>';
          page.options._onLoad(k+1);
          break;
        
        // other elements
        case "element":

          if ($(page.options.selector).length>0) {          
            page.content = $(page.options.selector).html()
          };
          if (page.options.destroyOriginal) {
            $(page.options.selector).remove();
          }
          page.options._onLoad(page.pageNumber);
          break;
          
      }
        
    },
    reloadPage: function (pageNumber) {
      this.pages[pageNumber-1].loaded = false;
      this.loadPage(pageNumber);
      this._refresh();
    }
    
    
  });
  
  $.extend($.ui.ajaxPager, {
    defaults: {
      previous: true,
      previousText: "&lt;",
      next: true,
      nextText: "&gt;",
      first: true,
      firstText: "&#x7c;&lt;",
      last: true,
      lastText: "&gt;&#x7c;",
      linkPagesStart: 2,
      linkPagesBefore: 5,
      linkPagesAfter: 5,
      linkPagesEnd: 2,
      linkPagesBreak: "...",
      linkPagesMax: 0,
      onDemand: 0,
      page: 1,
      type: 'string',
      onPageShow: function () {},
      onPageLoad: function () {},
      
    }
  });
  
})(jQuery);