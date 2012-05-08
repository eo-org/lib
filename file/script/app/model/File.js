FileDiv = Backbone.Model.extend({
	defaults: {
		id: null,
		urlname: "",
		filename: "",
		isImage: null,
		size: "",
		uploadTime: ""
	}
});

FileCollection = Backbone.Collection.extend({
	model: FileDiv,
	url: "/rest/file/?orgCode=" + window.ORG_CODE,
	parse: function(resp) {
		this.pageInfo = {
			"currentPage": resp.currentPage,
			"dataSize": resp.dataSize,
			"pageSize": resp.pageSize
		};
		return resp.data;
	}
});