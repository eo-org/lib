Domain = Backbone.Model.extend({
	defaults:{
		id: null,
		domainName: "",
		isActive: true,
		isDefault: false,
	},
	validate: function(attrs,options){
		var patrn = /[\w+]/;
		if(!patrn.exec(attrs.domainName)){
			return 'The model is null ！';
		};
	}
});

DomainCollection = Backbone.Collection.extend({
	model: Domain,
	url: "/adminrest/adminrest-domain.json"
});

DomainView = Backbone.View.extend({
	tagName: 'li',
	events:{
		'click .edit'	: 'editValue'
	},
	initialize: function(){
		this.model.on('change',this.update,this);
		this.model.on('destroy',this.destroy,this);
	},
	render: function(){
		var template = _.template($('#domain-item-template').html());
		$(this.el).html(template(this.model.toJSON()));
		
		return this;
	},
	editValue: function(){		
		var domain = new DomainEditorView({
			model: this.model
		});
		domain.render();
	},
	destroy: function() {
		$(this.el).remove();
	}
});

DomainCollectionView = Backbone.View.extend({
	domainCollection: null,
	el: $('ul.site-domain'),
	initialize: function(){
		TH = this;
		this.collection = new DomainCollection();
		domainCollection = this.collection;
		this.collection.bind('add',_.bind(this.modelAdd,this));
		
		this.collection.fetch();
	},
	render: function(){
		var TH = this;
		_(this.collection.models).each(function(item){
			TH.modelAdd(item);
		},this)
		
		return this;
	},
	modelAdd: function(item){
		var domainView = new DomainView({
			model:item
		}); 
		$(this.el).prepend(domainView.render().el);
	}
});

DomainEditorView = Backbone.View.extend({
	events:{
		'click .edit-save': 'save',
		'click .edit-delete' : 'remove'
	},
	render: function(){
		$(this.el).attr('class', 'editAll');
		var editorTemplate = _.template($('#domain-editor').html());
		$(this.el).html(editorTemplate(this.model.toJSON()));
		
		Prompt.getInstance().showMask();
		Prompt.getInstance().appendEditorContent(this.el);
		
		return this;
	},
	save: function(){
		var file = $(this.el).find('.edit-value');
		var data = {};
		file.each(function(i,j){
			data[$(j).attr('name')] = $(j).val();
		});
		if(this.model.set(data)) {
			if(this.model.get('id') == null){
				domainCollection.add(this.model);
			};
			this.model.save(data, {
				success: function(model,response){
					Prompt.getInstance().hideMask();
				}
			});
		} else {
			alert('域名不能为空');
		}
	},
	remove: function() {
		if(confirm('确定要结束域名的绑定吗？')){
			var request = this.model.destroy({
				success:function(model) {
					Prompt.getInstance().hideMask();
				}
			});
		}
	}
});