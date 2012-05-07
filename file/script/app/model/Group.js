GroupDiv = Backbone.Model.extend({
	defaults: {
		id: null,
		label: "",
		fileCount: 0
	}
});

GroupCollection = Backbone.Collection.extend({
	model: GroupDiv,
	url: "/rest/group/",
	parse: function(resp) {
		return resp.data;
	}
});