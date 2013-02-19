AdSection = Backbone.Model.extend({
	defaults: {
		id: null,
		label: '',
		preview: []
	},
	validate: function(attrs,options){
		if(attrs.label == ''){
			alert('广告组名不能为空！');
			return 'The model is null !';
		};
	}
});

AdSectionCollection = Backbone.Collection.extend({
	model: AdSection,
	url: "/adminrest/adminrest-ad-section.json"
});

AdSectionView = Backbone.View.extend({
	tagName: "li",
	events:{
		'click .adsection-handle': "adSectionHandle",
		'click .action-edit': "showAdEditValue"
	},
	initialize: function() {
		this.model.on('change', this.render, this);
		this.model.on('destroy', this.destroy,this);
	},
	render: function() {
		var template = _.template($("#ad-section").html());
		$(this.el).html(template(this.model.toJSON()));
		return this;
	},
	adSectionHandle: function(){
		console.log(this.model.get('id'));
		window.location.href="ad.html?id="+this.model.get('id');
	},
	showAdEditValue: function(){
		var adsectioneditorView = new AdSectionEditorView({
			model: this.model
		});
		adsectioneditorView.render();
	},
	destroy: function(model, resp){
		$(this.el).remove();
	}
});

AdSectionCollectionView = Backbone.View.extend({
	el: $('ul.ad-section'),
	adSectionCollection: null,
	events: {
		
	},
	initialize: function(){
		var TH = this;
		this.collection = new AdSectionCollection();
		this.collection.fetch({success: function() {
			TH.render();
		}});
		this.collection.bind('add', this.addItemView, this);
		
		adSectionCollection = this.collection;
	},
	render: function(){
		var TH = this;
		$(this.el).empty();
		_(this.collection.models).each(function(item){
			TH.addItemView(item);
		},this);
	},
	addItemView: function(item){
		var adSectionView = new AdSectionView({
			model:item
		});
		$(this.el).append(adSectionView.render().el);
	},
	appendItemView: function(item){
		var adSectionView = new AdSectionView({
			model:item
		});
		$(this.el).prepend(adSectionView.render().el);
	}
});

AdSectionEditorView = Backbone.View.extend({
	events: {
		"click .action-dd": "create",
		"click .action-ss": "deleteValue"
	},
	render: function() {
		var template = _.template($("#ad-section-editor").html());
		$(this.el).html(template(this.model.toJSON()));
		
		var prompt = Prompt.getInstance().appendEditorContent(this.el).showMask();
		
		return this;
	},
	create: function() {
		var fields = $(this.el).find('.value-field');
		var data = {};
		
		fields.each(function(i, f) {
			data[$(f).attr('name')] = $(f).val();
		});
		if(this.model.set(data)){
			if(this.model.get('id') == null){
				adSectionCollection.add(this.model);
			}
			this.model.save(this.model,{success:function(){
				Prompt.getInstance().hideMask();
			}});
		};
	},
	deleteValue: function(){
		if(confirm('确定要删除吗？')){
			this.model.destroy({
				success: function(model,response){
					Prompt.getInstance().hideMask();
				}
			});
		}
	}
});