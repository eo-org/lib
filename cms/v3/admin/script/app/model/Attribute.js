Attribute = Backbone.Model.extend({
	defaults: {
		id: null,
		attributesetId: null,
		type: "",
		code: "",
		label: "",
		description: "",
		required: false,
		sort: null,
		className: null,
		options: null
	}
});

AttributeCollection = Backbone.Collection.extend({
	model: Attribute,
	url: "/rest/attribute"
});

AttributeView = Backbone.View.extend({
	tagName: 'div',
	className: 'attribute-solid-item drag-handle',
	events: {
		"dragstart": "dragStartEvent",
		"dragend": "dragEndEvent"
	},
	initialize: function() {
		this.model.on('change', this.modelChanged, this);
	},
	render: function() {
		var template = _.template($('#attribute-template').html());
		$(this.el).html(template(this.model.toJSON()));
		$(this.el).attr('draggable', 'true');
		$(this.el).attr('data-cid', this.cid);
		return this;
	},
	modelChanged: function() {
		this.render();
	},
	
	dragStartEvent: function(e) {
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text', this.cid);
		$(this.el).css('opacity', '0.2');
	},
	dragEndEvent: function(e) {
		$(this.el).css('opacity', '1');
	}
});

AttributeCollectionView = Backbone.View.extend({
	el: $('div.attribute-list'),
	events: {
		"click .attribute-library-item": "createNew",
		"click .attribute-solid-item a": "editItem",
		"click .save-sort": "ajaxSaveSort",
		"dragover .drop-to-sort": "dragOverEvent",
		"dragleave .drop-to-sort": "dragLeaveEvent",
		"drop .drop-to-sort": "dropEvent"
	},
	initialize: function() {
		var TH = this;
		this.attributesetId = $(this.el).attr('attributesetId');
		this.viewPointer = [];
		this.collection = new AttributeCollection();
		this.collection.comparator = function(attr) {
			return attr.get('sort');
		};
		this.collection.fetch({success: function() {
			TH.render();
		}});
		
		this.collection.bind('add', this.addItem, this);
	},
	getCollection: function() {
		return this.collection
	},
	render: function() {
		var TH = this;
		var attrContainer = $(this.el).find('.attribute-current');
		attrContainer.empty();
		_(this.collection.models).each(function(attr) {
			TH.addItem(attr);
		}, this);
	},	
	addItem: function(attribute) {
		var attributeView = new AttributeView({
			model: attribute
		});
		this.viewPointer[attributeView.cid] = attributeView;
//		var index = this.collection.indexOf(attribute);

		
		var attrContainer = $(this.el).find('.attribute-current');
		attrContainer.append(attributeView.render().el);
//		console.log(attributeView.render().el);
//		attrContainer.append("");
		
//		console.log(index);
//		alert('next');
		
	},
	createNew: function(e) {
		var attributesetId = this.attributesetId;
		var type = $(e.target).attr('attribute-type');
		var label = $(e.target).attr('label');
		var optionsArr = [];
		if($.inArray(['select', 'radio', 'multicheckbox'], type)) {
			optionsArr.push({label : '选项一'});
			optionsArr.push({label : '选项二'});
			optionsArr.push({label : '选项三'});
		}
		this.collection.create({
			attributesetId: attributesetId,
			description: "元素描述",
			type: type,
			label: label,
			required: false,
			sort: this.collection.length,
			options: optionsArr
		}, {wait: true});
	},
	editItem: function(e) {
		e.preventDefault();
		
		var itemId = $(e.target).attr('attribute-id');
		var attributeModel = this.collection.get(itemId);
		var editorView = new AttributeEditorView({
			model: attributeModel
		});
		
		var editorContainer = $(this.el).find('.attribute-editor');
		editorContainer.empty();
		editorContainer.append(editorView.render().el);
	},
	ajaxSaveSort: function() {
		var sortedIds = [];
		$('.lightbox-trigger').each(function(idx ,attrEl) {
			sortedIds.push($(attrEl).attr('attribute-id'));
		});
		var sortedIdsStr = sortedIds.join(',');

		console.log(sortedIds);
		$.ajax({
			url:'/admin/attributeset/resort-attributes',
			type: 'POST',
			data: {'sortedIdsStr': sortedIdsStr},
			success: function(html) {
				alert('done');
			}
		});
	},
	dragOverEvent: function(e) {
		$(e.currentTarget).css('background', 'blue');
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
		return false;
	},
	dragLeaveEvent: function(e) {
		$(e.currentTarget).css('background', 'red');
	},
	dropEvent: function(e) {
		if (e.stopPropagation) {
			e.stopPropagation();
		}
		
		var cid = e.dataTransfer.getData('text');
		var preSib = $(e.currentTarget).parent();
		preSib.children('.drop-to-sort').css('background', 'red');
		if(preSib.attr('data-cid') == cid) {
			return false;
		}
		try {
			var viewEl = this.viewPointer[cid];
			$(viewEl.el).insertAfter(preSib);
		} catch(err) {
			console.log(err);
			return false;
		}
		return false;
	}
});

AttributeEditorView = Backbone.View.extend({
	events: {
		"click .attribute-save": "saveModel",
		"click .attribute-delete": "deleteModel",
		"click .option-add": "addNewOption",
		"click .option-remove": "removeOption"
	},
	render: function() {
		var template = _.template($('#attribute-editor-template').html());
		$(this.el).html(template(this.model.toJSON()));
		return this;
	},
	addNewOption: function() {
		var oc = $(this.el).find('.option-container');
		oc.append("<li class='option-item'><input class='attribute-field' type='text' name='option' value='' /> <span class='option-remove op-remove'>-</span></li>");
	},
	removeOption: function(e) {
		var liOption = $(e.currentTarget).parent('li:first');
		liOption.remove();
	},
	saveModel: function(e) {
		var fields = $(this.el).find('.attribute-field');
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
		this.model.save();
	},
	deleteModel: function(e) {
		this.model.destroy();
	}
});