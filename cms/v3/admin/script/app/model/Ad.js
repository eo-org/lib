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
	url: "/rest/ad.json"
});

AdView = Backbone.View.extend({
	tagName: "li",
	events:{
		'click .ad-edit': "showeditValue",
		'click .ad-delete': "deleteEl"
	},
	initialize: function(){
		this.model.on('change',this.update,this);
	},
	render: function(){
		var template = _.template($('#ad').html());
		$(this.el).html(template(this.model.toJSON()));
		return this;
	},
	showeditValue: function(){
		var adEditView = new AdEditorView({
			model: this.model
		});

		adEditView.render();
	},
	update: function(){
		if(!this.model.hasChanged('id')){
			var template = _.template($('#ad').html());
			$(this.el).html(template(this.model.toJSON()));
			Prompt.getInstance().hideMask();
		}
	},
	deleteEl: function(){
		var EL = this.el;
		if(confirm('确定要删除吗？')){
			this.model.destroy({success:function(model,response){
				$(EL).remove();
			}});
		}
	}
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
		
		var prompt = Prompt.getInstance().appendEditorContent(this.el).showMask();
		
		return this;
	},
	create: function(){
		var fields = $(this.el).find('.value-field');
		var data = {};
		fields.each(function(i, f) {
			data[$(f).attr('name')] = $(f).val();
		});
		this.model.set(data);
		if(this.model.get('id') == null){
			adCollection.add(this.model);
		}
		this.model.save({
			success: function(model,response){
				Prompt.getInstance().hideMask();
			}
		});
	}
});