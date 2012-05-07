Data = Backbone.Model.extend();

DataCollection = Backbone.Collection.extend({
	model: Data,
	url: "/rest/org/",
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
		return this;
	},
});

DataCollectionView = Backbone.View.extend({
	el: $('table.data'),
	initialize: function() {
		this.collection = new DataCollection();
		this.collection.bind('reset', _.bind(this.render, this));
		this.collection.fetch();
	},
	render: function() {
		var TH = this;
		$(this.el).empty();
		_(this.collection.models).each(function(data) {
			TH.addItemView(data);
		}, this);
		this.renderPaginator();
	},
	addItemView: function(data) {
		var dataView = new DataView({
			model: data
		});
		$(this.el).append(dataView.render().el);
	},
	renderPaginator: function() {
		var pageInfo = this.collection.pageInfo;
		var paginatorContainer = $('ul.paginator');
		var pageNumber = Math.ceil(pageInfo.dataSize / pageInfo.pageSize);
		
		paginatorContainer.empty();
		for(var i = 1; i <= pageNumber; i++) {
			if(i == pageInfo.currentPage) {
				paginatorContainer.append('<li class="current"><a href="#/rest/file/groupId/' + this.groupId + '@page/' + i + '">' + i + '</a></li>');
			} else {
				paginatorContainer.append('<li><a href="#/rest/file/groupId/' + this.groupId + '@page/' + i + '">' + i + '</a></li>');
			}
		}
	},
});