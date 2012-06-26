Bookpage = Backbone.Model.extend({
	defaults: {
		id: null,
		label: null,
		link: null,
		parentId: 0,
		level: 1,
		sort: 0
	}
});

BookpageCollection = Backbone.Collection.extend({
	model: Bookpage,
	url: "/rest/bookpage"
});

BookpageView = Backbone.View.extend({
	tagName: 'li',
	className: 'bookpage-item',
	events: {
		"dragstart .drag-handle": "dragStartEvent",
		"dragend .drag-handle": "dragEndEvent",
//		"dragover": "dragOverEvent",
//		"dragleave": "dragLeaveEvent",
//		"drop": "dropEvent"
	},
//	initialize: function() {
//		this.model.on('change', this.modelChanged, this);
//	},
	render: function() {
		var template = _.template($('#bookpage-item-template').html());
		$(this.el).html(template(this.model.toJSON()));
		$(this.el).attr({
			'id': this.model.get('id'),
			'parent-id': this.model.get('parentId'),
			'label': this.model.get('label')
		});
		return this;
	},
//	modelChanged: function() {
//		this.render();
//	},
//	
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
//	dragOverEvent: function(e) {
//		$(e.currentTarget).css('background', 'blue');
//		e.preventDefault();
//		e.dataTransfer.dropEffect = 'move';
//		return false;
//	},
//	dragLeaveEvent: function(e) {
//		$(e.currentTarget).css('background', 'transparent');
//	},
//	dropEvent: function(e) {
//		if (e.stopPropagation) {
//			e.stopPropagation();
//		}
//		
//		var parent = e.currentTarget;
////		dragEl
//		try {
//			//console.log(this.cid);
//			//var parent = e.currentTarget;
//			dragEl.insertAfter(parent);
//			parentLevel = $(parent).attr('level');
//			dragEl.attr('level', intval(parentLevel) + 1);
//			dragModel.level += parentLevel;
//		} catch(err) {
//			return false;
//		}
		
		
		
		
		
//		preSib.children('.drop-to-sort').css('background', 'red');
//		if(preSib.attr('data-cid') == cid) {
//			return false;
//		}
//		try {
//			var viewEl = this.viewPointer[cid];
//			$(viewEl.el).insertAfter(preSib);
//		} catch(err) {
//			console.log(err);
//			return false;
//		}
//		return false;
//	}
});

BookpageCollectionView = Backbone.View.extend({
	el: $('ul.container'),
	events: {
//		"click .attribute-library-item": "createNew",
//		"click .attribute-solid-item a": "editItem",
//		"click .save-sort": "ajaxSaveSort",
		"dragover .drop-to-sort": "dragOverEvent",
		"dragleave .drop-to-sort": "dragLeaveEvent",
		"drop .drop-to-sort": "dropEvent"
	},
	initialize: function() {
		var TH = this;
//		this.attributesetId = $(this.el).attr('attributesetId');
//		this.viewPointer = [];
		this.collection = new BookpageCollection();
		this.collection.comparator = function(attr) {
			return attr.get('sort');
		};
		this.collection.fetch({success: function() {
			TH.render();
		}});
//		
//		this.collection.bind('add', this.addItem, this);
	},
//	getCollection: function() {
//		return this.collection
//	},
	render: function() {
		var TH = this;
		var container = $(this.el);
		
		_(this.collection.models).each(function(model) {
			TH.addItem(model);
		}, this);
	},	
	addItem: function(model) {
		var bookpageView = new BookpageView({
			model: model
		});
		
		if(model.get('parentId') == 0) {
			var container = $(this.el);
		} else {
			var container = $('#' + model.get('parentId')).children('ul');
		}
		if(container.length) {
			container.append(bookpageView.render().el);
			container.append("<li class='drop-to-sort' parent-id='" + model.get('parentId') + "'></li>");
		}
	},
//	createNew: function(e) {
//		var attributesetId = this.attributesetId;
//		var type = $(e.target).attr('attribute-type');
//		var label = $(e.target).attr('label');
//		var optionsArr = [];
//		if($.inArray(['select', 'radio', 'multicheckbox'], type)) {
//			optionsArr.push({label : '选项一'});
//			optionsArr.push({label : '选项二'});
//			optionsArr.push({label : '选项三'});
//		}
//		this.collection.create({
//			attributesetId: attributesetId,
//			description: "元素描述",
//			type: type,
//			label: label,
//			required: false,
//			sort: this.collection.length,
//			options: optionsArr
//		}, {wait: true});
//	},
//	editItem: function(e) {
//		e.preventDefault();
//		
//		var itemId = $(e.target).attr('attribute-id');
//		var attributeModel = this.collection.get(itemId);
//		var editorView = new AttributeEditorView({
//			model: attributeModel
//		});
//		
//		var editorContainer = $(this.el).find('.attribute-editor');
//		editorContainer.empty();
//		editorContainer.append(editorView.render().el);
//	},
//	ajaxSaveSort: function() {
//		var sortedIds = [];
//		$('.lightbox-trigger').each(function(idx ,attrEl) {
//			sortedIds.push($(attrEl).attr('attribute-id'));
//		});
//		var sortedIdsStr = sortedIds.join(',');
//
//		console.log(sortedIds);
//		$.ajax({
//			url:'/admin/attributeset/resort-attributes',
//			type: 'POST',
//			data: {'sortedIdsStr': sortedIdsStr},
//			success: function(html) {
//				alert('done');
//			}
//		});
//	},
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
		} catch(err) {
			console.log(err);
			return false;
		}
		return false;
	}
});