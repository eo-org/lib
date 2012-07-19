Headfile = Backbone.Model.extend({
	defaults:{
		id: null,
		type: "",
		filename: ""
	}
});

HeadfileCollection = Backbone.Collection.extend({
	model: Headfile,
	url: "/rest/head-file"
});

HeadfileCollectionView = Backbone.View.extend({
	collection: null,
	el: $('ul.head-files'),
	events: {
		
	},
	initialize: function(){
		TH = this;
		this.collection = new HeadfileCollection();
		collection = this.collection;
		this.collection.bind('add',_.bind(this.modelAdd,this));
		
		this.collection.fetch({success: function(){
			TH.render();
		}});
		
		//this.setValue();
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
		this.collection.add([{id: "2",type: "js",filename: "cs.js"}]);
	}
});

HeadfileView = Backbone.View.extend({
	tagName: 'li',
	events:{
		'click .action-edit': 'editValue'
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
		headfile.render();
	}
});

Headfileedit = Backbone.View.extend({
	events:{
		'click .edit-save':'saveValue',
		'click .edit-delete':'deleteModel'
	},
	render: function(){
		$(this.el).attr('class','editAll');
		var edittemplate = _.template($('#headfile-edititem-template').html());
		$(this.el).html(edittemplate(this.model.toJSON()));
		
		Prompt.getInstance().showMask();
		Prompt.getInstance().appendEditorContent(this.el);
		
		return this;
	},
	saveValue: function(){
		var file = $(this.el).find('.edit-value');
		var data = {};
		file.each(function(i,j){
			data[$(j).attr('name')] = $(j).val();
		});
		this.model.set(data);
		if(this.model.get('id') == null){
			collection.add(this.model);
		}
		this.model.save(this.model,{success:function(model,response){
			Prompt.getInstance().hideMask();
		}});
	},
	deleteModel: function(){
		this.model.destroy({success:function(model,response){
			Prompt.getInstance().hideMask();
		}});
	}
});