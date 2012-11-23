var restUrl = window.restUrl;

var paginatorTemplate = _.template(
	"<div class='page-pre'></div>" +
	"<div class='page-displayer'>" +
		"Page <input id='currentPageNumber' type='text' name='currentPage' value='{{currentPageNumber}}' /> / <span id='totalPageNumber'>{{totalPageNumber}}</span>" +
	"</div>" +
	"<div class='page-next'></div>" +
	"<div class='data-size'>total item: {{dataSize}}</div>"
);

Data = Backbone.Model.extend();

DataCollection = Backbone.Collection.extend({
	model: Data,
	url: restUrl,
	parse: function(resp) {
		this.pageInfo = {
			"currentPage": resp.currentPage,
			"dataSize": resp.dataSize,
			"pageSize": resp.pageSize
		};
		this.groupCount = resp.groupCount;
		return resp.data;
	}
});

DataView = Backbone.View.extend({
	tagName: "tr",
	events: {
		'click .ajax-to-trash'	: 'trash'
	},
	render: function() {
		if(this.model.get('status') == 'trash') {
			var template = _.template($('#data-trash-row').html());
		} else {
			var template = _.template($('#data-row').html());
		}
		$(this.el).html(template({
			data: this.model.toJSON()
		}));
		if(this.bgDiff == 1) {
			$(this.el).addClass('odd');
		}
		return this;
	},
	setIdx: function(idx) {
		this.bgDiff = idx % 2;
	},
	trash: function(e) {
		e.preventDefault();
		var idx = $(e.currentTarget).attr('data-id');
		$(this.el).animate({
			'opacity': 0
		}, function() {$(this).css('display', 'none');})
		this.model.destroy();
	}
});

DataCollectionView = Backbone.View.extend({
	el: $('.datalist'),
	events: {
		'click .group-counter'		: 'regroup',
		'click .s-index'			: 'resort',
		'change #currentPageNumber'	: 'repage',
		'click .query-invoker'		: 'requery',
		'click .page-pre'			: 'prePage',
		'click .page-next'			: 'nextPage'
	},
	initialize: function() {
		this.tbody = $(this.el).find('.datalist-body');
		this.thead = $(this.el).find('.datalist-head');
		/*******StatusCount********/
		this.groupCountContainer = this.thead.find('.group-count');
		/*******Sort********/
		this.sortIndexes = this.thead.find('.s-index');
		this.sortIndexes.each(function(i, obj) {
			$(obj).append("<div class='ui-icon-sort'></div>");
		});
		/*******Paginator********/
		this.paginatorContainer = $('#datalist-paginator');
		this.pageInfo = null;
		this.pageInputEl = null;
		/*******Query********/
		this.queryIndexes = this.thead.find('.q-index');
		
		/*==================*/
		
		this.collection = new DataCollection();
		this.collection.bind('reset', _.bind(this.render, this));
	},
	render: function() {
		var TH = this;
		this.tbody.empty();
		_(this.collection.models).each(function(data, idx) {
			TH.addItemView(data, idx);
		}, this);
		this.rePaginateRender();
		if(this.collection.groupCount) {
			this.reGroupCountRender();
		}
	},
	addItemView: function(data, idx) {
		var dataView = new DataView({
			model: data
		});
		dataView.setIdx(idx);
		this.tbody.append(dataView.render().el);
	},
	prePage: function() {
		if(this.pageInfo.currentPage == 1) {
			alert('firt page already');
		} else {
			var p = this.pageInputEl.val();
			p--;
			this.pageInputEl.val(p);
			this.load();
		}
	},
	nextPage: function() {
		var totalPageNumber = Math.ceil(this.pageInfo.dataSize / this.pageInfo.pageSize);
		
		if(this.pageInfo.currentPage >= totalPageNumber) {
			alert('last page already');
			this.pageInputEl.val(totalPageNumber);
		} else {
			var p = this.pageInputEl.val();
			p++;
			this.pageInputEl.val(p);
			this.load();
		}
	},
	rePaginateRender: function() {
		this.pageInfo = this.collection.pageInfo;
		var totalPageNumber = Math.ceil(this.pageInfo.dataSize / this.pageInfo.pageSize);
		
		this.paginatorContainer.html(paginatorTemplate({
			totalPageNumber: totalPageNumber,
			currentPageNumber: this.pageInfo.currentPage,
			dataSize: this.pageInfo.dataSize
		}));
		this.pageInputEl = this.paginatorContainer.find('#currentPageNumber');
		
		
		
		
		
//		this.currentPageDisplayer.val(pageInfo.currentPage);
//		this.totalPageNumberDisplayer.html(totalPageNumber);
		
//		paginatorContainer.empty();
//		for(var i = 1; i <= pageNumber; i++) {
//			if(i == pageInfo.currentPage) {
//				paginatorContainer.append('<li class="current"><a href="#@page/' + i + '">' + i + '</a></li>');
//			} else {
//				paginatorContainer.append('<li><a href="#@page/' + i + '">' + i + '</a></li>');
//			}
//		}
	},
	reGroupCountRender: function() {
		if(this.groupCountContainer.text() != "") {
			return true;
		}
		this.groupCount = this.collection.groupCount;
		var retval = this.groupCount.retval;
		var countAll = this.groupCount.count;
		var content = "";
		var contentTrashLi = "";
		$(retval).each(function(i, val) {
			if(val['status'] != null) {
				if(val['status'] == 'trash') {
					countAll -= val['count'];
					contentTrashLi = "<li class='trash group-counter' data-groupname='" + val['status'] + "'>" + val['status'] + " <span>(" + val['count'] + ")</span></li>";
				} else {
					content += "<li class='group-counter' data-groupname='" + val['status'] + "'>" + val['status'] + " <span>(" + val['count'] + ")</span></li>";
				}
			}
		});
		
		content = "<li class='group-counter' data-groupname='all'>all <span>(" + countAll + ")</span></li>" + content + contentTrashLi;
		this.groupCountContainer.html("<ul>" + content + "</ul>");
	},
	resort: function(e) {
		var sortState = $(e.currentTarget).attr('sort');
		
		this.sortIndexes.each(function(i, obj) {
			$(obj).removeAttr('sort');
			$(obj).removeClass('up-arrow');
			$(obj).removeClass('down-arrow');
		});
		if(sortState == undefined) {
			$(e.currentTarget).attr('sort', 'asc');
			$(e.currentTarget).addClass('up-arrow');
		} else if(sortState == 'asc') {
			$(e.currentTarget).attr('sort', 'desc');
			$(e.currentTarget).addClass('down-arrow');
		} else {
			$(e.currentTarget).attr('sort', 'asc');
			$(e.currentTarget).addClass('up-arrow');
		}
		this.load();
	},
	repage: function() {
		var pageToLoad = this.pageInputEl.val();
		var totalPageNumber = Math.ceil(this.pageInfo.dataSize / this.pageInfo.pageSize);
		
		if(pageToLoad > totalPageNumber || pageToLoad < 1) {
			
		} else {
			this.load();
		}
	},
	requery: function() {
		this.load();
	},
	regroup: function(e) {
		var selectedGroup = e.currentTarget;
		$(selectedGroup).addClass('active').siblings().removeClass('active');
		this.qGroup = $(selectedGroup).data('groupname');
		this.load();
	},
	load: function() {
		var sIndex = '_id';
		var sOrder = -1;
		var qGroup = 'all';
		this.sortIndexes.each(function(i, obj) {
			if($(obj).attr('sort') != undefined) {
				sIndex = $(obj).attr('s-index');
				sOrder = $(obj).attr('sort') == 'asc' ? 1 : -1;
			}
		});
		
		if(this.qGroup) {
			qGroup = this.qGroup;
		}
		
		var pageToLoad = 1;
		if(this.pageInputEl != null) {
			pageToLoad = this.pageInputEl.val();
		}
		
		var queryStr = "";
		this.queryIndexes.each(function(i, obj) {
			if($(obj).val() != "") {
				var idx = $(obj).attr('q-index');
				queryStr+= idx + ':' + $(obj).val() + '-';
			}
		});
		
		if(queryStr.length == 0) {
			queryStr = 'none';
		} else {
			queryStr = queryStr.slice(0, -1);
		}
		
		this.collection.fetch({data: {
			'page': pageToLoad,
			'sIndex': sIndex,
			'sOrder': sOrder,
			'qGroup': qGroup,
			'query': queryStr
		}});
	}
});