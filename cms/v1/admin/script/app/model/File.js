FileDiv = Backbone.Model.extend({
	defaults: {
		id: null,
		urlname: "",
		filename: "",
		size: "",
		uploadTime: ""
	}
});

FileCollection = Backbone.Collection.extend({
	model: FileDiv,
	url: "http://file.eo.test/rest/file/",
	parse: function(resp) {
		this.pageInfo = {
			"currentPage": resp.currentPage,
			"dataSize": resp.dataSize,
			"pageSize": resp.pageSize
		};
		return resp.data;
	}
});

FileView = Backbone.View.extend({
	tagName: "li",
	events: {
		'click .remove': "removeFile"
	},
	render: function() {
		$(this.el).html("<li>abc</li>");
		
		return this;
	},
	removeFile: function(e) {
		e.preventDefault();
		if(confirm('delete file ' + this.model.get('filename'))) {
			var EL = this.el
			this.model.destroy({success: function(model, response) {
				$(EL).remove();
			}});
		}
	}
});

FileCollectionView = Backbone.View.extend({
	el: $('ul.file-list'),
	events: {
		
	},
	initialize: function() {
		this.collection = new FileCollection();
		this.collection.bind('reset', _.bind(this.render, this));
		this.collection.bind('add', _.bind(this.prependItemView, this));
	},
	getCollection: function() {
		return this.collection
	},
	render: function() {
		var TH = this;
		$(this.el).empty();
		_(this.collection.models).each(function(file) {
			TH.addItemView(file);
		}, this);
		this.renderPaginator();
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
	addItemView: function(file) {
		var fileView = new FileView({
			model: file
		});
		$(this.el).append(fileView.render().el);
	},
	prependItemView: function(item) {
		var fileView = new FileView({
			model: item
		});
		$(this.el).prepend(fileView.render().el);
	},
	loadGroupFiles: function(groupId, pageNumber) {
		this.groupId = groupId;
		this.collection.fetch({data: {'filter_groupId': groupId, 'filter_page': pageNumber}});
	}
});