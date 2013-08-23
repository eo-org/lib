var MESSAGE_CURRENT_EDIT_MODEL = null;
var MESSAGE_ELEMENT_COLLECTION;

Option = Backbone.Model.extend({
	defaults: {
		'code': '',
		'label': '选项',
		'sort': 0
	}
});
OptionCollection = Backbone.Collection.extend({
	model: Option,
	comparator: function(mo) {
		return mo.get('sort');
	}
});
OptionEditorView = Backbone.View.extend({
	tagName: 'li',
	className: 'option-item ui-state-content',
	events: {
		'keyup .op-input': "elementUpdate",
		'click .op-add': "opAdd",
		'click .op-remove': "opRemove"
	},
	render: function(OC) {
		var template = _.template($('#option-editor-template').html());
		$(this.el).html(template(this.model.toJSON()));
		return this;
	},
	opAdd: function() {
		var sortNumber = this.model.get('sort') + 0.5;
		var uuid = guidGenerator();
		var opModel = new Option({
			'code': uuid, 'label': '新选项', 'sort': sortNumber
		});
		MESSAGE_CURRENT_EDIT_MODEL.optionCollection.add(opModel);
		MESSAGE_CURRENT_EDIT_MODEL.updateView();
	},
	opRemove: function(e) {
		MESSAGE_CURRENT_EDIT_MODEL.optionCollection.remove(this.model);
		MESSAGE_CURRENT_EDIT_MODEL.updateView();
	},
	elementUpdate: function(e) {
		var val = $(e.currentTarget).val();
		this.model.set('label', val);
		MESSAGE_CURRENT_EDIT_MODEL.updateView();
	}
});
OptionEditorCollectionView = Backbone.View.extend({
	initialize: function() {
		this.collection = this.options.opCollection;
		this.el = this.options.editorContainer;
		this.collection.bind('add', this.render, this);
		this.collection.bind('remove', this.render, this);
		this.render();
	},
	render: function() {
		this.el.empty();
		_.each(this.collection.models, function(opModel, idx) {
			opModel.set('sort', idx);
			var opEditorView = new OptionEditorView({
				model: opModel
			});
			this.el.append(opEditorView.render().el);
		}, this);
	}
});

Element = Backbone.Model.extend({
	defaults: {
		id: 0,
		type: "",
		label: "",
		description: "",
		options: null,
		required: false,
		sort: null,
		classNames: ""
	},
	initialize: function() {
		this.optionCollection = new OptionCollection();
		_.each(this.get('options'), function(op) {
			this.optionCollection.add(op);
		}, this);
	},
	updateOptions: function() {
		var type = this.get('type');
		if($.inArray(type, ['select', 'radio', 'multicheckbox']) >= 0) {
			var ops = [];
			_.each(this.optionCollection.models, function(optionModel) {
				ops.push(optionModel.toJSON());
			});
			this.set('options', ops);
		}
	},
	updateView: function() {
		this.updateOptions();
		this.trigger('updateView');
	}
});

ElementCollection = Backbone.Collection.extend({
	model: Element
});

ElementView = Backbone.View.extend({
	tagName: 'li',
	className: 'form-element',
	events: {
		"click": "activeEditor"
	},
	initialize: function() {
		this.model.on('change', this.render, this);
		this.model.on('remove', this.removeView, this);
		this.model.on('updateView', this.render, this);
	},
	render: function() {
		var template = _.template($('#element-template').html());
		$(this.el).empty();
		$(this.el).attr('id', this.model.get('id'));
		$(this.el).html(template(this.model.toJSON()));
		return this;
	},
	activeEditor: function(e) {
		e.preventDefault();
		MESSAGE_CURRENT_EDIT_MODEL = this.model;
		EEV.render();
	},
	removeView: function(e) {
		this.remove();
		EEV.clear();
	}
});

ElementCollectionView = Backbone.View.extend({
	el: $('ul#element-collection'),
	events: {
		
	},
	initialize: function() {
		var TH = this;
		var elements = this.options.mfModel.get('elements');
		this.viewPointer = [];
		
		MESSAGE_ELEMENT_COLLECTION = this.options.elementCollection;
		MESSAGE_ELEMENT_COLLECTION.bind('add', this.addItem, this);
		
		_.each(elements, function(element) {
			MESSAGE_ELEMENT_COLLECTION.add(element);
		});
		this.creator = new ElementCreatorView();
	},
	render: function() {
		var TH = this;
		$(this.el).empty();
		_(MESSAGE_ELEMENT_COLLECTION.models).each(function(attributeModel) {
			TH.addItem(attributeModel);
		}, this);
	},	
	addItem: function(modelObj) {
		var elementView = new ElementView({model: modelObj});
		$(this.el).append(elementView.render().el);
	}
});

ElementCreatorView = Backbone.View.extend({
	el: $('ul#element-library'),
	events: {
		'click li.element-item': "createNew"
	},
	createNew: function(e) {
		var type = $(e.currentTarget).data('type');
		var label = $(e.currentTarget).data('label');
		var optionsArr = [];
		if($.inArray(type, ['select', 'radio', 'multicheckbox']) >= 0) {
			optionsArr.push({code: 0, label : '选项一', sort: 0});
			optionsArr.push({code: 1, label : '选项二', sort: 1});
			optionsArr.push({code: 2, label : '选项三', sort: 2});
		}
		var uuid = guidGenerator();
		MESSAGE_ELEMENT_COLLECTION.add({
			id: uuid,
			type: type,
			label: label,
			description: "",
			required: false,
			sort: MESSAGE_ELEMENT_COLLECTION.length,
			options: optionsArr
		});
	},
});

ElementEditorView = Backbone.View.extend({
	el: $('#element-editor'),
	events: {
		"keyup .attribute-field": "updateModel",
		'click .el-remove-button': "elRemove"
	},
	render: function() {
		var editTemplate = _.template($('#element-editor-template').html());
		$(this.el).html(editTemplate(MESSAGE_CURRENT_EDIT_MODEL.toJSON()));
		var OC = $(this.el).find('.option-container');
		var opEditorCollection = new OptionEditorCollectionView({
			editorContainer: OC,
			opCollection: MESSAGE_CURRENT_EDIT_MODEL.optionCollection
		});
		
		$(".messageform-control").tabs( "option", "active", 1 );
		return this;
	},
	clear: function() {
		$(this.el).html("<div>No Element Is Selected!</div>");
		return this;
	},
	updateModel: function(e) {
		var fieldName = $(e.currentTarget).attr('name');
		var fieldValue = $(e.currentTarget).val();
		MESSAGE_CURRENT_EDIT_MODEL.set(fieldName, fieldValue);
	},
	elRemove: function(e) {
		e.preventDefault();
		MESSAGE_ELEMENT_COLLECTION.remove(MESSAGE_CURRENT_EDIT_MODEL);
	}
});

var EEV = new ElementEditorView();