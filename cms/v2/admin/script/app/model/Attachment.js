Attachment = Backbone.Model.extend({defaults:{
	filetype: 'graphic',
	filename: '',
	urlname: ''
}});

//AttachmentCollection = Backbone.Collection.extend({
//	model: Attachment,
//	url: '/'
//});

AttachmentView = Backbone.View.extend({
	tagName: 'li',
	events:{},
	render: function() {
		console.log(this.model.get('filetype'));
		if(this.model.get('filetype') == 'graphic') {
			var template = _.template($('#graphic-template').html());
		} else {
			//var template = _.template($('#product-add-template').html());
		}
		$(this.el).html(template(this.model.toJSON()));
		
		return this;
	}
});

AttachmentCollectionView = Backbone.View.extend({
	el: $('ul#graphic-list'),
	events: {
		
	},
	initialize: function() {
		var TH = this;
		$(this.options.attachmentObjList).each(function(i, attaObj) {
			attaModel = new Attachment();
			attaModel.set(attaObj);
			TH.append(attaModel);
		});
	},
	render: function() {
		return this;
	},
	append: function(item) {
		var view = new AttachmentView({
			model: item
		});
		$(this.el).prepend(view.render().el);
	}
});