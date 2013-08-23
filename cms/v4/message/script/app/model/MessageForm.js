MessageForm = Backbone.Model.extend({
	defaults: {
		id: null,
		label: "未标题表单",
		description: "未标题表单",
		elements: null,
		classNames: ""
	},
	url: function() {
		var base = '/adminrest/messagerest-messageform.json/';
		if(this.isNew()) { 
			return base;
		} else {
			return base + this.id;
		}
	}
});
MessageFormView = Backbone.View.extend({
	el: $("#message-form"),
	initialize: function() {
		this.model = this.options.mfModel;
		this.model.on('change', this.render, this);
		this.render();
	},
	render: function() {
		var template = _.template($('#message-form-template').html());
		$(this.el).html(template(this.model.toJSON()));
	},
	getModel: function() {
		return this.model;
	}
});
MessageFormEditorView = Backbone.View.extend({
	el: $('#message-form-editor'),
	events: {
		"keyup .attribute-field": "updateModel"
	},
	initialize: function() {
		var TH = this;
		this.model = this.options.mfModel;
		this.elementCollection = this.options.elementCollection;
		this.render();
		
		$('#save-message-form').click(function(e) {
			e.preventDefault();
			TH.saveForm();
		});
	},
	render: function() {
		var template = _.template($('#message-form-editor-template').html());
		$(this.el).html(template(this.model.toJSON()));
	},
	updateModel: function(e) {
		var fieldName = $(e.currentTarget).attr('name');
		var fieldValue = $(e.currentTarget).val();
		this.model.set(fieldName, fieldValue);
	},
	saveForm: function() {
		var prompt = Prompt.getInstance().showLoadingBox();
		var sortIds = $('#element-collection').sortable("toArray");
		var elementModels = this.elementCollection.models;
		elementModels.sort(function(a, b) {
			var aId = a.get('id').toString();
			var bId = b.get('id').toString();
			var aPos = sortIds.indexOf(aId);
			var bPos = sortIds.indexOf(bId);
			return aPos - bPos;
		});
		
		this.model.set('elements', elementModels);
		this.model.save(null, {
			success: function() {
				prompt.hideLoadingBox();
			}
		});
		
		
	}
});