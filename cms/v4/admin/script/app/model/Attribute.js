Attribute = Backbone.Model.extend({
	defaults: {
		id: null,
		type: "",
		code: "",
		label: "",
		description: "",
		options: null,
		required: false,
		sort: null
	},
	validate: function(attrs, options){
		var errorMsg = "";
		var pattern = new RegExp("^[a-z]+$");
		if(!pattern.exec(attrs.code)) {
			errorMsg = 'Attribute Code is not valid';
		}
		var pattern = new RegExp("^[a-z0-9]+$");
		_.each(attrs.optionsCode, function (code, idx) {
			if(!pattern.exec(code)) {
				errorMsg = 'option code [' + code + '] is not valid';
			}
		});
		if(errorMsg != "") {
			return errorMsg;
		}
	}
});

AttributeCollection = Backbone.Collection.extend({
	model: Attribute,
	url: "/adminrest/adminrest-attribute.json"
});

AttributeView = Backbone.View.extend({
	tagName: 'div',
	className: 'attribute-solid-item drag-handle',
	events: {
		"click a.lightbox-trigger": "editItem",
		"dragstart": "dragStartEvent",
		"dragend": "dragEndEvent"
	},
	initialize: function() {
		this.model.on('change', this.modelChanged, this);
		this.model.on('destroy', this.destroy, this);
		this.model.on('invalid', this.invalid, this);
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
	editItem: function(e) {
		e.preventDefault();
		var aev = new AttributeEditorView({
			model: this.model
		});
		aev.render();
	},
	dragStartEvent: function(e) {
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text', this.cid);
		$(this.el).css('opacity', '0.2');
	},
	dragEndEvent: function(e) {
		$(this.el).css('opacity', '1');
	},
	destroy: function() {
		$(this.el).remove();
	},
	invalid: function(model, error) {
		alert('Attribute error: ' + error);
	}
});

AttributeCollectionView = Backbone.View.extend({
	el: $('div.attribute-list'),
	events: {
		//"click .attribute-library-item": "createNew",
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
		
		this.creator = new AttributeCreatorView();
		this.creator.setCollection(this.collection);
	},
	getCollection: function() {
		return this.collection
	},
	render: function() {
		var TH = this;
		var attrContainer = $(this.el).find('.attribute-current');
		attrContainer.empty();
		_(this.collection.models).each(function(attributeModel) {
			TH.addItem(attributeModel);
		}, this);
	},	
	addItem: function(attributeModel) {
		var attributeView = new AttributeView({
			model: attributeModel
		});
		this.viewPointer[attributeView.cid] = attributeView;
		var attrContainer = $(this.el).find('.attribute-current');
		attrContainer.append(attributeView.render().el);
	},
	createNew: function(e) {
		var attributesetId = this.attributesetId;
		var type = $(e.target).attr('attribute-type');
		var label = $(e.target).attr('label');
		var optionsArr = [];
//		if($.inArray(['select', 'radio', 'multicheckbox'], type)) {
//			optionsArr.push({label : '选项一'});
//			optionsArr.push({label : '选项二'});
//			optionsArr.push({label : '选项三'});
//		}
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

AttributeCreatorView = Backbone.View.extend({
	el: $('div.attribute-library'),
	events: {
		"click .attribute-library-item": "createNew"
//		"click .save-sort": "ajaxSaveSort",
//		"dragover .drop-to-sort": "dragOverEvent",
//		"dragleave .drop-to-sort": "dragLeaveEvent",
//		"drop .drop-to-sort": "dropEvent"
	},
//	initialize: function() {
//		var TH = this;
//		this.attributesetId = $(this.el).attr('attributesetId');
//		this.viewPointer = [];
//		this.collection = new AttributeCollection();
//		this.collection.comparator = function(attr) {
//			return attr.get('sort');
//		};
//		this.collection.fetch({success: function() {
//			TH.render();
//		}});
//		
//		this.collection.bind('add', this.addItem, this);
//	},
	setCollection: function(collection) {
		this.collection = collection;
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
			type: type,
			code: 'default',
			label: label,
			description: "元素描述",
			required: false,
			sort: this.collection.length,
			options: optionsArr
		});
//		this.collection.create({
//			attributesetId: attributesetId,
//			description: "元素描述",
//			type: type,
//			label: label,
//			required: false,
//			sort: this.collection.length,
//			options: optionsArr
//		}, {wait: true});
	},
});

AttributeEditorView = Backbone.View.extend({
	events: {
		"click .attribute-save": "saveModel",
		"click .attribute-delete": "deleteModel",
		"click .option-add": "addNewOption",
		"click .option-remove": "removeOption"
	},
	render: function() {
		$(this.el).attr('class','editAll');
		var editTemplate = _.template($('#attribute-editor-template').html());
		$(this.el).html(editTemplate(this.model.toJSON()));
		
		Prompt.getInstance().showMask();
		Prompt.getInstance().appendEditorContent(this.el);
		
		return this;
	},
	addNewOption: function() {
		var oc = $(this.el).find('.option-container');
		oc.append(
			"<li class='option-item'>" +
			"<label>code</label> <input class='attribute-field' type='text' group-tag='option' name='code' value='' />" +
			"<label>label</label> <input class='attribute-field' type='text' group-tag='option' name='label' value='' />" +
			"<span class='option-remove op-remove'>-</span>" +
			"</li>"
		);
	},
	removeOption: function(e) {
		var liOption = $(e.currentTarget).parent('li:first');
		liOption.remove();
	},
	saveModel: function(e) {
		var fields = $(this.el).find('.attribute-field');
		var data = {};
		var optionsCode = [];
		var optionsLabel = [];
		fields.each(function(i, f) {
			if($(f).attr('group-tag') == 'option') {
				if($(f).attr('name') == 'code') {
					optionsCode.push($(f).val());
				} else if($(f).attr('name') == 'label') {
					optionsLabel.push($(f).val());
				}
			} else {
				data[$(f).attr('name')] = $(f).val();
			}
		});
		data['optionsCode'] = optionsCode;
		data['optionsLabel'] = optionsLabel;
		
		if(this.model.set(data)){
			this.model.save(data, {success:function(model, response) {
				Prompt.getInstance().hideMask();
			}});
		}
	},
	deleteModel: function(e) {
		if(confirm('确定要删除吗？')){
			var request = this.model.destroy({
				success:function(model) {
					Prompt.getInstance().hideMask();
				}
			});
		}
	}
});