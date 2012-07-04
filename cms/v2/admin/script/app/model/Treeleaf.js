Treeleaf = Backbone.Model.extend({
	defaults: {
		id: null,
		label: null,
		link: null,
		parentId: 0,
		sort: 0
	}
});

TreeleafCollection = Backbone.Collection.extend({
	model: Treeleaf,
	url: "/rest/treeleaf"
});

TreeleafView = Backbone.View.extend({
	tagName: 'li',
	className: 'treeleaf-item',
	events: {
		"dragstart .drag-handle": "dragStartEvent",
		"dragend .drag-handle": "dragEndEvent",
		"click .quick-edit": "quickEdit"
	},
	render: function() {
		var template = _.template($('#treeleaf-item-template').html());
		$(this.el).html(template(this.model.toJSON()));
		$(this.el).attr({
			'id': this.model.get('id'),
			'parent-id': this.model.get('parentId'),
			'label': this.model.get('label')
		});
		return this;
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
	quickEdit: function(e) {
		alert('ok');
	}
});

TreeleafCollectionView = Backbone.View.extend({
	el: $('ul.container'),
	events: {
		"dragover .drop-to-sort": "dragOverEvent",
		"dragleave .drop-to-sort": "dragLeaveEvent",
		"drop .drop-to-sort": "dropEvent"
	},
	initialize: function() {
		var TH = this;
		this.collection = new TreeleafCollection();
		this.collection.comparator = function(attr) {
			return attr.get('sort');
		};
		this.collection.fetch({success: function() {
			TH.render();
		}});
	},
	render: function() {
		var TH = this;
		var container = $(this.el);
		
		_(this.collection.models).each(function(model) {
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
		if(container.length) {
			container.append(treeleafView.render().el);
			container.append("<li class='drop-to-sort' parent-id='" + model.get('parentId') + "'></li>");
		}
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