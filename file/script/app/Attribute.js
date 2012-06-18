Attribute = Backbone.Model.extend({
	defaults: {
		id: null,
		attributesetId: null,
		description: "",
		type: "",
		label: "",
		required: false,
		sort: null,
		options: null
	}
});

AttributeCollection = Backbone.Collection.extend({
	model: Attribute,
	url: "/rest/attribute"
});

AttributeView = Backbone.View.extend({
	events: {
		"dragover .drop-to-sort": "dragOverEvent",		//拖动过程中鼠标经过的元素 被拖动元素在目标元素内移动
		"dragleave .drop-to-sort": "dragLeaveEvent",	//拖动过程中鼠标经过的元素 被拖动元素离开目标元素的范围
		"drop .drop-to-sort": "dropEvent",				//拖放的目标元素 有其他元素拖动到本元素中 释放拖动
		
		"dragstart": "dragStartEvent",					//被拖动的元素 开始拖动动作
		"dragend": "dragEndEvent" 						//拖动的元素 拖动结束
	},
	initialize: function() {
		this.model.on('change', this.modelChanged, this);
	},
	render: function() {
		var template = _.template($('#attribute-template').html());
		$(this.el).html(template(this.model.toJSON()));
		return this;
	},
	modelChanged: function() {
		this.render();
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
		var thCId = this.model.cid;
		var cid = e.dataTransfer.getData('text');
		
		return false;
	},
	dragStartEvent: function(e) {
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text', this.model.cid);
		$(this.el).css('opacity', '0.4');
	},
	dragEndEvent: function() {
		$(this.el).css('opacity', '1');
	}
});

AttributeEditorView = Backbone.View.extend({
	events: {
		"click .attribute-save": "saveModel",
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
//		var data = {};
//		data[field.attr('name')] = field.val();
		this.model.set(data);
		this.model.save();
	}
});

AttributeCollectionView = Backbone.View.extend({
	el: $('div.attribute-list'),
	events: {
		"click .attribute-library-item": "createNew",
		"click .attribute-solid-item a": "editItem"
	},
	initialize: function() {
		var TH = this;
		this.attributesetId = $(this.el).attr('attributesetId');
		this.collection = new AttributeCollection();
//		this.render();
//		this.collection.bind('reset', _.bind(this.render, this));
//		this.collection.bind('add', _.bind(this.prependItemView, this));
		
		this.collection.fetch({success: function() {
			TH.render();
		}});
		
		this.collection.bind('add', this.addItem, this);
		
//		this.editorView = new AttributeEditorView();
//		this.editorView.render();
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
		
//		var editorContainer = $(this.el).find('.attribute-editor');
//		editorContainer.append(this.editorView.render().el);
//		this.renderPaginator();
	},
	addItem: function(attribute) {
		var attributeView = new AttributeView({
			model: attribute
		});
		var attrContainer = $(this.el).find('.attribute-current');
		attrContainer.append(attributeView.render().el);
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
			sort: null,
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
	}
//	prependItemView: function(item) {
//		var fileView = new FileView({
//			model: item
//		});
//		$(this.el).prepend(fileView.render().el);
//	},
//	loadGroupFiles: function(groupId, pageNumber) {
//		this.groupId = groupId;
//		this.collection.fetch({data: {'groupId': groupId, 'page': pageNumber}});
//	}
});