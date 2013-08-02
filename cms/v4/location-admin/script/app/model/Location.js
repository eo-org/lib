Location = Backbone.Model.extend({
	defaults: {
		id: null,
		lable: '',
		tel: '',
		provinceName: '',
		cityName: '',
		countyName: '',
		provinceId: '',
		cityId: '',
		countyId: '',
		addressDetail: '',
		latlon: '',
		fullAddress: ''
	}
});

LocationCollection = Backbone.Collection.extend({
	model: Location,
	url: "/adminrest/locationrest-location.json",
	parse: function(retContent) {
		var resp = retContent;
		this.pageInfo = {
			"currentPage": resp.currentPage,
			"dataSize": resp.dataSize,
			"pageSize": resp.pageSize
		};
		this.groupCount = resp.groupCount;
		return resp.data;
	}
});

LocationView = Backbone.View.extend({
	tagName: "li",
	events:{
		'click .remove': 'remove'
	},
	initialize: function() {
		this.model.on('change', this.render, this);
	},
	render: function() {
		var template = _.template($("#location-row").html());
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

LocationCollectionView = Backbone.View.extend({
	el: $('ul.json-location-container'),
	events: {
		
	},
	initialize: function(){
		var TH = this;
		this.collection = new LocationCollection();
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
		var locationView = new LocationView({
			model:item
		});
		$(this.el).append(locationView.render().el);
	},
});