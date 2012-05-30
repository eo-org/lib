 FileView = Backbone.View.extend({
	tagName: "li",
	events: {
		'click .remove': "removeFile",
		'click .amend': "editname",
		'dblclick': "postFileUrl",
		'keypress .inputamend-label': "updateOnfilename"
	},
	render: function() {
		var template = _.template($('#file-template').html());
		$(this.el).html(template(this.model.toJSON()));
		
		this.input = this.$('.inputamend-label');
		this.amend = this.$('.text-amend');
		var TH=this;
		this.input.bind('blur',function(){
			$(this).val(TH.amend.text());
			TH.close();
		});	
		return this;
	},
	removeFile: function(e) {
		e.preventDefault();
		if(confirm('delete file ' + this.model.get('filename'))) {
			var EL = this.el;
			this.model.destroy({success: function(model, response) {
				$(EL).remove();
			}});
		}
	},
	editname: function(){
		this.$('.text-amend').hide();
		this.$('.amend-label').show();
		this.$('.inputamend-label').focus();
	},
	close: function(){
		this.$('.amend-label').hide();
		this.$('.text-amend').show();
	},
	updateOnfilename: function(e){
		if(e.keyCode == 13){
			var newVals = this.input.val();
			if(newVals != ''){
				this.model.save({filename: newVals});
				this.amend.text(newVals);
				this.close();
			}
		}
	},
	postFileUrl: function() {
		if(window.opener) {
			window.opener.postMessage(window.ORG_CODE + '/' + this.model.get('urlname'), '*');
			window.close();
		} else if(window.parent) {
			window.parent.postMessage(window.ORG_CODE + '/' + this.model.get('urlname'), '*');
			window.close();
		}
	}
});

FileCollectionView = Backbone.View.extend({
	el: $('ul.file-list'),
	events: {
		
	},
	initialize: function() {
		
		this.collection = new FileCollection();
		this.collection.bind('reset', _.bind(this.render, this));
		this.collection.bind('add', _.bind(this.prependItemView, this));
	},
	getCollection: function() {
		return this.collection
	},
	render: function() {
		var TH = this;
		$(this.el).empty();
		_(this.collection.models).each(function(file) {
			TH.addItemView(file);
		}, this);
		
		this.renderPaginator();
	},
	renderPaginator: function() {
		var pageInfo = this.collection.pageInfo;
		var paginatorContainer = $('ul.paginator');
		var pageNumber = Math.ceil(pageInfo.dataSize / pageInfo.pageSize);
		
		paginatorContainer.empty();
		for(var i = 1; i <= pageNumber; i++) {
			if(i == pageInfo.currentPage) {
				paginatorContainer.append('<li class="current"><a href="#/groupId:' + this.groupId + '@page:' + i + '">' + i + '</a></li>');
			} else {
				paginatorContainer.append('<li><a href="#/groupId:' + this.groupId + '@page:' + i + '">' + i + '</a></li>');
			}
		}
	},
	addItemView: function(file) {
		var fileView = new FileView({
			model: file
		});
		$(this.el).append(fileView.render().el);
	},
	prependItemView: function(item) {
 		var fileView = new FileView({ 
			model: item
		});
		$(this.el).prepend(fileView.render().el); 
		
	},
	loadGroupFiles: function(groupId, pageNumber) {
		this.groupId = groupId;
		this.collection.fetch({data: {'groupId': groupId, 'page': pageNumber}});
	},
 	afterOneSent: function(item) {
		this.collection.add([item]);
    }
});