HeadFile = Backbone.Model.extend({
	defaults:{
		id: null,
		type: "",
		filename: "",
		folder: "file"
	},
	validate: function(attrs,options){
		var patrn = /[\w+]([.]{1}[j]{1}[s]{1}$|[.]{1}[c]{1}[s]{2}$)/;
		if(!patrn.exec(attrs.filename)){
			return 'The model is null ！';
		};
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
		var headfile = new HeadFileEditView({
			model: this.model
		});
		headfile.render();
	},
	update: function(){
		if(!this.model.hasChanged('id')){
			var template = _.template($('#headfile-item-template').html());
			$(this.el).html(template(this.model.toJSON()));
		}
	},
	destroy: function(model, resp){
		$(this.el).remove();
	}
});

HeadFileEditView = Backbone.View.extend({
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
		var types = data['filename'].split('.');
		data['type'] = types[types.length-1];
		if(this.model.set(data)){
			if(this.model.get('id') == null){
				headfileCollection.add(this.model);
			};
			this.model.save(this.model,{success:function(model,response){
				Prompt.getInstance().hideMask();
			}});
		}else{
			alert('文件名不能为空且文件名后缀必须为.css和.js！');
		}
	},
	deleteModel: function(){
		if(confirm('确定要删除吗？')){	
			this.model.destroy({
				success: function(model,response){
					Prompt.getInstance().hideMask();
				},
				error: function(){
					alert(resp.responseText);
				}
			});
		}
	}
});