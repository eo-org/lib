Ad = Backbone.Model.extend({
	defaults: {
		id: null,
		sectionId: "",
		label: "",
		link: "",
		filename: "",
		description: ""
	}
});

AdCollection = Backbone.Collection.extend({
	model: Ad,
	url: ""
});

AdView = Backbone.View.extend({
	tagName: "li",
	events:{
		'click .ad-edit': "editValue",
		'click .ad-delete': "deleteEl"
	},
	render: function(){
		$(this.el).attr("class","ad-comtainer");
		var template = _.template($('#adEl').html());
		$(this.el).html(template(this.model.toJSON()));
		
		//console.log(this.model);
		return this;
	},
	editValue: function(e){
		var adEditView = new AdEditView({
			model:this.model
		});
		
		e.preventDefault();
		var itemId = $(e.target).attr('id',this.model.get('id'));
		adEditView.render().el;
	},
	deleteEl: function(){
		var EL = this.el;
		this.model.destroy({success:function(model,response){
			$(EL).remove();
		}});
	}
});

AdCollectionView = Backbone.View.extend({
	el: $('ul.ad'),
	events:{
		
	},
	initialize: function(){
		TH = this;
		
		this.collection = new AdCollection();
/* 		this.collection.fetch({success: function(){
			TH.render();
		}}); 
*/
		this.collection.bind('add',_.bind(this.modelAdd,this))
		this.collection.bind('change',_.bind(this.modelChange,this));
		this.setValue();
	},
	render: function(){
		var TH = this;
		_(this.collection.models).each(function(item){
			TH.modelAdd(item);
		},this);
	},
	modelAdd: function(item){
		var adView = new AdView({
			model:item
		});
		//console.log(adView);
		$(this.el).prepend(adView.render().el);
	},
	modelChange: function(){
		//alert(this.model.get('id'));
	},
	setValue: function(){
		this.collection.add([{id: "1",sectionId: "2",label: "文章格式",link: "./",filename: "abc",description: "测试"}]);
		this.collection.add([{id: "2",sectionId: "3",label: "文章格",link: "./",filename: "bc",description: "测1"}]);
		this.collection.add([{id: "3",sectionId: "4",label: "文章",link: "./",filename: "c",description: "测2"}]);
	}
}); 

AdEditView = Backbone.View.extend({
	tagName:"li",
	events:{
		'click .ad-save': "saveValue"
	},
	render: function(){
		$(this.el).attr("class","ad-edit-comtainer");
		var template = _.template($('#edit-adEl').html());
		$(this.el).html(template(this.model.toJSON()));
		Prompt.getInstance().showMask();
		Prompt.getInstance().contentEditor(100,this.el);
		
		this.filename = $('.ad-filename');
		this.lable = $('.ad-lable');
		this.description = $('.ad-description');
		this.link = $('.ad-link');
		
		this.editFilename = this.$('.edit-filename');
		this.editLable = this.$('.edit-lable');
		this.editDescription = this.$('.edit-description');
		this.editLink = this.$('.edit-link');
		
		return this;
	},
	saveValue: function(){
		var newFV = this.editFilename.val();
		var newLb = this.editLable.val();
		var newDsp = this.editDescription.val();
		var newL = this.editLink.val();
		
		if(newFV != ""&&newLb != ""&&newDsp != ""&&newL != ""){
			//this.model.save({filename: newFV,label: newLb,description: newDsp,link: newL});
			
			this.filename.text('filename:'+newFV);
			this.lable.text('lable:'+newLb);
			this.description.text('description:'+newDsp);
			this.link.text('link:'+newL);
			
			Prompt.getInstance().closeMask();
		}
	}
});