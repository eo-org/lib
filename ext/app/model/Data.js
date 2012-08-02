var restUrl = window.restUrl;

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
		return resp.data;
	}
});

DataView = Backbone.View.extend({
	tagName: "tr",
	render: function() {
		var template = _.template($('#data-row').html());
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
	}
});

DataCollectionView = Backbone.View.extend({
	el: $('table.datalist > tbody'),
	initialize: function() {
		this.collection = new DataCollection();
		this.collection.bind('reset', _.bind(this.render, this));
	},
	render: function() {
		var TH = this;
		$(this.el).empty();
		_(this.collection.models).each(function(data, idx) {
			TH.addItemView(data, idx);
		}, this);
		this.renderPaginator();
	},
	addItemView: function(data, idx) {
		var dataView = new DataView({
			model: data
		});
		dataView.setIdx(idx);
		$(this.el).append(dataView.render().el);
	},
	renderPaginator: function() {
		var pageInfo = this.collection.pageInfo;
		var paginatorContainer = $('#datalist-paginator');
		var pageNumber = Math.ceil(pageInfo.dataSize / pageInfo.pageSize);
		
		paginatorContainer.empty();
		for(var i = 1; i <= pageNumber; i++) {
			if(i == pageInfo.currentPage) {
				paginatorContainer.append('<li class="current"><a href="#@page/' + i + '">' + i + '</a></li>');
			} else {
				paginatorContainer.append('<li><a href="#@page/' + i + '">' + i + '</a></li>');
			}
		}
	},
	loadPage: function(pageNumber) {
		this.collection.fetch({data: {'page': pageNumber}});
	}
});