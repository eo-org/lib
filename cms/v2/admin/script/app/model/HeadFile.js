HeadFile = Backbone.Model.extend({
	defaults:{
		id: null,
		type: "",
		filename: ""
	},
	validate: function(attrs){
		if(attrs.type == '' || attrs.filename == ''){
			Prompt.getInstance().hideMask();
			return 'The model is null';
		}
	}
});

HeadFileCollection = Backbone.Collection.extend({
	model: HeadFile,
	url: "/rest/head-file"
});

HeadFileCollectionView = Backbone.View.extend({
	headfileCollection: null,
	el: $('ul.head-files'),
	events: {
		
	},
	initialize: function(){
		TH = this;
		this.collection = new HeadFileCollection();
		headfileCollection = this.collection;
		this.collection.bind('add',_.bind(this.modelAdd,this));
		
		this.collection.fetch({success: function(){
			TH.render();
		}});
	},
	render: function(){
		var TH = this;
		_(this.collection.models).each(function(item){
			TH.modelAdd(item);
		},this)
		
		return this;
	},
	modelAdd: function(item){
		var headfileView = new HeadFileView({
			model:item
		}); 
		$(this.el).prepend(headfileView.render().el);
	}
});

HeadFileView = Backbone.View.extend({
	tagName: 'li',
	events:{
		'click .action-edit': 'editValue'
	},
	initialize: function(){
		this.model.on('change',this.update,this);
		this.model.on('destroy',this.destroy,this);
	},
	render: function(){
		var template = _.template($('#headfile-item-template').html());
		$(this.el).html(template(this.model.toJSON()));
		
		return this;
	},
	editValue: function(){		
		var headfile = new HeadFileedit({
			model: this.model
		});
		headfile.render();
	},
	update: function(){
		if(this.model.hasChanged('id')){
			
		}else{
			
		}
	},
	destroy: function(model, resp){
		$(this.el).remove();
	}
});

HeadFileedit = Backbone.View.extend({
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
		
		if(this.model.get('id') == null){
			$('.edit-delete').css({'display':'none'});
		}
		
		return this;
	},
	saveValue: function(){
		var file = $(this.el).find('.edit-value');
		var data = {};
		file.each(function(i,j){
			data[$(j).attr('name')] = $(j).val();
		});
		this.model.set(data);

		if(this.model.isValid()){
			if(this.model.get('id') == null){
				headfileCollection.add(this.model);
			};
		}else{
			alert('文件名和文件类型不能为空！');
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