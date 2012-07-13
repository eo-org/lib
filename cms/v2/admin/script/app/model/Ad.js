Ad = Backbone.Model.extend({
	defaults: {
		id: null,
		sectionId: null,
		filename: null,
		link: null,
		label: null,
		description: null
	}
});

AdCollection = Backbone.Collection.extend({
	model: Ad,
	url: "/rest/ad"
});

AdView = Backbone.View.extend({
	tagName: "li",
	events:{
//		'click .ad-edit': "editValue",
//		'click .ad-delete': "deleteEl"
	},
	render: function(){
		var template = _.template($('#ad').html());
		$(this.el).html(template(this.model.toJSON()));
		return this;
	}
//	editValue: function(e){
//		var adEditView = new AdEditView({
//			model:this.model
//		});
//		
//		e.preventDefault();
//		var itemId = $(e.target).attr('id',this.model.get('id'));
//		adEditView.render().el;
//	},
//	deleteEl: function(){
//		var EL = this.el;
//		this.model.destroy({success:function(model,response){
//			$(EL).remove();
//		}});
//	}
});

AdCollectionView = Backbone.View.extend({
	el: $('ul.ad'),
	adCollection: null,
	events:{
		
	},
	initialize: function() {
		var TH = this;
		this.collection = new AdCollection();
		this.collection.fetch({success: function() {
			TH.render();
		}});
		this.collection.bind('add', this.addItemView, this);
		
		adCollection = this.collection;
	},
	render: function() {
		var TH = this;
		$(this.el).empty();
		_(this.collection.models).each(function(item){
			TH.addItemView(item);
		},this);
	},
	addItemView: function(item) {
		var adView = new AdView({
			model:item
		});
		$(this.el).append(adView.render().el);
	},
	modelChange: function(){
		//alert(this.model.get('id'));
	}
}); 

AdEditorView = Backbone.View.extend({
	tagName:"li",
	events:{
		'click .action-dd': "create"
	},
	render: function(){
		var template = _.template($('#ad-editor').html());
		$(this.el).html(template(this.model.toJSON()));
		return this;
	},
	create: function(){
		var fields = $(this.el).find('.value-field');
		var data = {};
		fields.each(function(i, f) {
			data[$(f).attr('name')] = $(f).val();
		});
		this.model.set(data);
		
		adCollection.add(this.model);
		this.model.save();
		Prompt.getInstance().hideMask();
	}
});