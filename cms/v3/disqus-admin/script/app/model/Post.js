Post = Backbone.Model.extend({
	defaults: {
		id: null,
		content: '',
		created: ''
	}
});

PostCollection = Backbone.Collection.extend({
	model: Post,
	url: "/adminrest/disqusrest-post.json"
});

PostView = Backbone.View.extend({
	tagName: "li",
	events:{
		'click .remove': 'remove'
	},
	initialize: function() {
		this.model.on('change', this.render, this);
	},
	render: function() {
		var template = _.template($("#post-row").html());
		$(this.el).html(template(this.model.toJSON()));
		return this;
	},
	remove: function(){
		var EL = this.el;
		if(confirm('确定要删除吗？')){
			this.model.destroy({success:function(model,response){
				$(EL).remove();
			}});
		}
	}
});

PostCollectionView = Backbone.View.extend({
	el: $('ul.json-post-container'),
	events: {
		
	},
	initialize: function(){
		var TH = this;
		this.collection = new PostCollection();
		this.collection.fetch({success: function() {
			TH.render();
		}});
		this.collection.bind('add', this.addItemView, this);
	},
	render: function(){
		var TH = this;
		$(this.el).empty();
		_(this.collection.models).each(function(item){
			TH.addItemView(item);
		},this);
	},
	addItemView: function(item){
		var postView = new PostView({
			model:item
		});
		$(this.el).append(postView.render().el);
	},
});