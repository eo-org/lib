ProductImage = Backbone.Model.extend({
	defaults:{
		id: null,
		urlname: '',
		filename: '',
		filepath: ''
	}
});

ProductImageCollection = Backbone.Collection.extend({
	model: ProductImage,
	url: "/rest/Product-Image"
});

ProductImageCollectionView = Backbone.View.extend({
	productimageCollection: null,
	el: $('ul#product-list'),
	events: {
		
	},
	initialize: function(){
		TH = this;
		this.collection = new ProductImageCollection();
		productimageCollection = this.collection;
		this.collection.bind('add',_.bind(this.modelappend,this));
		
		this.collection.fetch({success: function(){
			TH.render();
		}});
	},
	render: function(){
		_(this.collection.models).each(function(item){
			TH.modelappend(item);
		},this);
		
		return this;
	},
	getobject: function(data){
		console.log(data);
		this.model.set(data);
		productimageCollection.add(this.model);
	},
	modelappend: function(item){
		var productimageView = new ProductImageView({
			model: item
		});
		$(this.el).prepend(productimageView.render().el);
	}
});

ProductImageView = Backbone.View.extend({
	tagName: 'li',
	events:{},
	initialize:function(){
		
	},
	render: function(){
		var template = _.template($('#product-add-template').html());
		$(this.el).html(template(this.model.toJSON()));
		
		return this;
	}
});