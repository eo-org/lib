Headfile = Backbone.Model.extend({
	defaults:{
		id: null,
		type: "",
		filename: ""
	}
});

HeadfileCollection = Backbone.Collection.extend({
	model: Headfile,
	url: ""
});

HeadfileCollectionView = Backbone.View.extend({
	el: $('ul.head-file'),
	events: {
		
	},
	initialize: function(){
		this.collection = new HeadfileCollection();
		
		this.collection.bind('add',_.bind(this.modelAdd,this));
		
		//this.collection.fetch({success: function(){
		//	this.render();
		//}});
		this.setValue();
	},
	render: function(){
		var TH = this;
		_(this.collection.models).each(function(item){
			TH.modelAdd(item);
		},this)
		
		return this;
	},
	modelAdd: function(item){
		var headfileView = new HeadfileView({
			model:item
		}); 
		$(this.el).prepend(headfileView.render().el);
	},
	setValue: function(){
		this.collection.add([{id: "1",type: "css",filename: "cs.css"}]);
	}
});

HeadfileView = Backbone.View.extend({
	tagName: 'li',
	events:{
		'click .edit-all': 'editValue',
	},
	render: function(){
		var template = _.template($('#headfile-item-template').html());
		$(this.el).html(template(this.model.toJSON()));
		
		return this;
	},
	editValue: function(){
		var headfile = new Headfileedit({
			model: this.model
		});
		headfile.render().el;
	}
});

Headfileedit = Backbone.View.extend({
	events:{
		'click .edit-save':'saveValue',
		'click .delete':'deleteModel'
	},
	render: function(){
		var edittemplate = _.template($('#headfile-edititem-template').html());
		$(this.el).html(edittemplate(this.model.toJSON()));
		
		Prompt.getInstance().showMask();
		Prompt.getInstance().appendEditorContent(this.el);
		
		return this;
	},
	saveValue: function(){
		
	},
	deleteModel: function(){
		
	}
});