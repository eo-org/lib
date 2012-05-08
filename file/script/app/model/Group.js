GroupDiv = Backbone.Model.extend({
	defaults: {
		id: null,
		label: "",
		fileCount: 0
	}
});

GroupCollection = Backbone.Collection.extend({
	model: GroupDiv,
	url: "/rest/group/?orgCode=" + window.ORG_CODE,
	parse: function(resp) {
		return resp.data;
	}
});