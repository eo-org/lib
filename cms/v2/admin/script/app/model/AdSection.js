AdSection = Backbone.Model.extend({
	defaults: {
		id: null,
		label: null,
		preview: []
	}
});

AdSectionCollection = Backbone.Collection.extend({
	model: AdSection,
	url: "/rest/ad-section"
});

AdSectionView = Backbone.View.extend({
	tagName: "li",
	events:{
		'click .adsection-handle': "adSectionHandle"
	},
	render: function() {
		var template = _.template($("#ad-section").html());
		$(this.el).html(template(this.model.toJSON()));
		return this;
	},
	adSectionHandle: function(){
		console.log(this.model.get('id'));
		window.location.href="ad.html?id="+this.model.get('id');
	}
});

AdSectionCollectionView = Backbone.View.extend({
	el: $('ul.ad-section'),
	collection: null,
	events: {
		
	},
	initialize: function(){
		var TH = this;
		this.collection = new AdSectionCollection();
		this.collection.fetch({success: function() {
			TH.render();
		}});
		collection = this.collection;
		
		this.collection.bind('add', this.addItemView, this);
	},
	render: function(){
		var TH = this;
		$(this.el).empty();
		_(this.collection.models).each(function(file){
			TH.addItemView(file);
		},this);
	},
	addItemView: function(adSection){
		var adSectionView = new AdSectionView({
			model:adSection
		});
		$(this.el).append(adSectionView.render().el);
	},
	appendItemView: function(item){
		var adSectionView = new AdSectionView({
			model:item
		});
		//console.log(adSectionView.render().el);
		$(this.el).prepend(adSectionView.render().el);
	}
});

AdSectionEditorView = Backbone.View.extend({
	events: {
		"click .action-dd": "create"
	},
	render: function() {
		var template = _.template($("#ad-section-editor").html());
		$(this.el).html(template(this.model.toJSON()));
		return this;
	},
	create: function() {
		var fields = $(this.el).find('.value-field');
		var data = {};
		var options = [];
		fields.each(function(i, f) {
			if($(f).attr('name') == 'option') {
				if($(f).val() !== '') {
					options.push({'label': $(f).val()});
				}
			} else {
				data[$(f).attr('name')] = $(f).val();
			}
			data['options'] = options;
		});
		this.model.set(data);
		
		collection.add(this.model);
		this.model.save();
		
		Prompt.getInstance().hideMask();
	}
});