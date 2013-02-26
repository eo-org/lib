AdSection = Backbone.Model.extend({
	defaults: {
		id: null,
		label: '',
		preview: []
	},
	initialize: function() {
		this.on('invalid', this.invalid, this);
	},
	validate: function(attrs, options) {
		if(attrs.label == '') {
			return '广告组名不能为空';
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
		this.model.on('invalid', this.invalid);
		
		var fields = $(this.el).find('.value-field');
		var data = {};
		
		fields.each(function(i, f) {
			data[$(f).attr('name')] = $(f).val();
		});
		if(this.model.set(data, {validate:true})){
			if(this.model.isNew()) {
				adSectionCollection.add(this.model);
			}
			this.model.save(data, {success:function(){
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
	},
	invalid: function(model, error) {
		alert('AdSection error: ' + error);
	}
});