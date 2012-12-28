Treeleaf = Backbone.Model.extend({
	defaults: {
		id: null,
		label: '',
		link: '',
		alias: '',
		layoutAlias: '',
		className: '',
		iconName: '',
		bannerName: '',
		parentId: 0,
		sort: 0,
		description: '',
		disabled: 'no'
	},
	validate: function(attrs){	
		if(attrs.label == ''){
			return 'The model is null';
		}
	}
});

TreeleafCollection = Backbone.Collection.extend({
	model: Treeleaf,
	url: "/rest/treeleaf.json"
});

TreeleafView = Backbone.View.extend({
	tagName: 'li',
	className: 'treeleaf-item',
	events: {
		"dragstart .drag-handle": "dragStartEvent",
		"dragend .drag-handle": "dragEndEvent",
		"click .edit": "showEditor"
	},
	initialize: function() {
		this.model.on('change', this.update, this);
		this.model.on('destroy', this.destroy, this);
	},
	render: function() {
		var template = _.template($('#treeleaf-item-template').html());
		$(this.el).html(template(this.model.toJSON()));
		$(this.el).attr({
			'id': this.model.get('id'),
			'parent-id': this.model.get('parentId')
		});
		
		return this;
	},
	update: function() {
		if(this.model.hasChanged('id')) {
			var template = _.template($('#treeleaf-item-template').html());
			$(this.el).html(template(this.model.toJSON()));
			$(this.el).attr({
				'id': this.model.get('id'),
				'parent-id': parentId
			});
			$(this.el).children('.leaf-line').addClass('changed');
		} else {
			var ulEl = $(this.el).children('ul');
			var parentId = $(this.el).attr('parent-id');
			
			var template = _.template($('#treeleaf-item-template').html());
			$(this.el).html(template(this.model.toJSON()));
			$(this.el).attr({
				'id': this.model.get('id'),
				'parent-id': parentId
			});
			$(this.el).children('.leaf-line').addClass('changed');
			
			$(this.el).find('ul').replaceWith(ulEl);
		}
	},
	destroy: function(model, resp) {
		var nextDropEl = $(this.el).next();
		nextDropEl.remove();
		$(this.el).remove();
	},
	dragStartEvent: function(e) {
		e.dataTransfer.effectAllowed = 'move';
		var dragEl = $(e.currentTarget).parents('li:first');
		
		e.dataTransfer.setData('text', dragEl.attr('id'));
		dragEl.css('display', 'none');
		dragEl.next().css('display', 'none');
	},
	dragEndEvent: function(e) {
		$(this.el).css('display', 'block');
		$(this.el).next().css('display', 'block');
	},
	showEditor: function(e){
		var viewId = $(e.target).attr('id');
		
		var treeleafEditView = new TreeleafEditorView({
			model:treeleafCollection.get(viewId)
		});
	
		treeleafEditView.render();
	}
});

TreeleafCollectionView = Backbone.View.extend({
	treeleafCollection: null,
	el: $('ul.container'),
	events: {
		"dragover .drop-to-sort": "dragOverEvent",
		"dragleave .drop-to-sort": "dragLeaveEvent",
		"drop .drop-to-sort": "dropEvent"
	},
	prompt: Prompt.getInstance().appendHintBoxContent("树状结构已经改变，请点击<保存结构>以保存新的结构"),
	initialize: function() {
		var TH = this;
		this.collection = new TreeleafCollection();
		this.collection.bind('add',this.addItem,this);
		this.collection.comparator = function(attr) {
			return attr.get('sort');
		};
		this.collection.fetch({success: function() {
			TH.render();
		}});
		treeleafCollection = this.collection;
	},
	render: function() {
		var TH = this;
		var container = $(this.el);
		
//		$(this.el).empty();
		
		_(this.collection.models).each(function(model) {
			if(model.get('parentId') === '') {
				model.set('parentId', 0);
				this.prompt.showHintBox();
			}
			TH.addItem(model);
		}, this);
	},
	addItem: function(model) {
		var treeleafView = new TreeleafView({
			model: model
		});
		
		if(model.get('parentId') == 0) {
			var container = $(this.el);
		} else {
			var container = $('#' + model.get('parentId')).children('ul');
		}
		if(container.length === 0) {
			container = $(this.el);
		}
		container.append(treeleafView.render().el);
		container.append("<li class='drop-to-sort' parent-id='" + model.get('parentId') + "'></li>");
	},
	dragOverEvent: function(e) {
		$(e.currentTarget).css('background', 'blue');
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
		return false;
	},
	dragLeaveEvent: function(e) {
		$(e.currentTarget).css('background', 'transparent');
	},
	dropEvent: function(e) {
		if (e.stopPropagation) {
			e.stopPropagation();
		}
		this.prompt.showHintBox();
		
		var id = e.dataTransfer.getData('text');
		var preSib = $(e.currentTarget);
		var parentId = preSib.attr('parent-id');
		
		var viewEl = $('#' + id);
		var nextDropEl = viewEl.next();
		
		preSib.css('background', 'transparent');
		
		try {
			nextDropEl.insertAfter(preSib);
			nextDropEl.attr('parent-id', parentId);
			viewEl.insertAfter(preSib);
			viewEl.attr('parent-id', parentId);
			viewEl.children('.leaf-line').addClass('changed');
		} catch(err) {
			console.log(err);
			return false;
		}
		return false;
	}
});

TreeleafEditorView = Backbone.View.extend({
	events: {
		'click .edit-save' : 'saveModel',
		'click .edit-delete' : 'deleteModel'
	},
	render: function() {
		
		var template = _.template($('#treeleaf-editor').html());
		$(this.el).html(template(this.model.toJSON()));
		
		Prompt.getInstance().showMask();
		Prompt.getInstance().appendEditorContent(this.el);
		
		if(this.model.get('id') == null){
			$('.edit-delete').css({'display':'none'});
		}
		
		return this; 
	},
	saveModel: function() {
		var labels = $(this.el).find('.edit-value');
		var data = {};	
		labels.each(function(i,j) {
			data[$(j).attr('name')] = $(j).val();
		});
		
		if(this.model.set(data)){
			if(this.model.isNew()) {
				treeleafCollection.add(this.model);
			}
			this.model.save(data, {success:function(model, response) {
				Prompt.getInstance().hideMask();
				Prompt.getInstance().showHintBox();
			}});			
		} else {
			alert('链接名不能为空！');
		}
	},
	deleteModel: function(){
		if(confirm('确定要删除吗？')){
			var request = this.model.destroy({
				success:function(model) {
					Prompt.getInstance().hideMask();
				},
				error: function(model, resp) {
					alert(resp.responseText);
				}
			});
		}
	}
});
