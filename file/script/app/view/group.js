GroupView = Backbone.View.extend({
	tagName: "li",
	events: {
		"mouseover": "showActions",
		"mouseout": "hideActions",
		"click .text-label": "triggerLoadGroupFilesHash",
		"click .edit": "edit",
		"click .destroy": "destroy",
		"keypress .input-label": "updateOnEnter",
		"dragover .load-group":"dragOverEvent",
		"dragleave .load-group":"dragLeaveEvent",
		"drop .load-group":"dropEvent"
	},
	render: function() {
		var template = _.template($('#group-template').html());
		var json = this.model.toJSON();
		$(this.el).attr('groupId', json.id).addClass('load-group');
		$(this.el).html(template(json));

		this.textDiv = this.$('.text-label');
		this.editDiv = this.$('.edit-label');
		this.input = this.$('.input-label');

		var TH = this;
		this.input.bind('blur', function() {
			var t = TH.textDiv.text();
			TH.input.val(t);
			TH.close();
		});
		return this;
	},
	showActions: function() {
		this.$('.actions').show();
	},
	hideActions: function() {
		this.$('.actions').hide();
	},
	edit: function(e) {
		this.textDiv.hide();
		this.editDiv.show();
		this.input.focus();
	},
	destroy: function(e) {
		e.preventDefault();
		if(confirm('确定删除此目录，目录文件将被归入未分类文件夹')) {
			var EL = this.el
			this.model.destroy({success: function(model, response) {
				$(EL).remove();
			}});
		}
	},
	updateOnEnter: function(e) {
		if (e.keyCode == 13) {
			var newVal = this.input.val();
			if(newVal != "") {
				this.model.save({label: newVal});
				this.textDiv.text(newVal);
				this.close();
			}
		}
	},
	close: function() {
		this.textDiv.show();
		this.editDiv.hide();
	},
	triggerLoadGroupFilesHash: function(e) {
		e.preventDefault();
		$(this.el).siblings().removeClass('selected');
		$(this.el).addClass('selected');
		window.location.hash = "/groupId:" + this.model.id + "@page:1";
	},
	dragOverEvent: function(e){
		if (e.preventDefault) {
			e.preventDefault();
		}
		$(e.currentTarget).css('background','#E0E0E0');
		e.preventDefault();
		e.dataTransfer = e.originalEvent.dataTransfer;
		e.dataTransfer.dropEffect = 'move';
		return false;
	},
	dragLeaveEvent: function(e){
		$(e.currentTarget).css('background','#F4F3F2');
	},
	dropEvent: function(e){
		if (e.stopPropagation) {
            e.stopPropagation();
        }
		e.dataTransfer = e.originalEvent.dataTransfer;
		var cid = e.dataTransfer.getData('text/html');
		console.log(cid);
		$(e.currentTarget).css('background','#F4F3F2');
		return false;
	}
});

GroupCollectionView = Backbone.View.extend({
	el: $('ul.group-list'),
	events: {
		"click #label-affirm": "createOnEnter"
	},
	initialize: function() {
		var TH = this;
		this.input = $('#label-create');
		this.collection = new GroupCollection();
		this.collection.fetch({success: function() {
			TH.render();
		}});

		this.collection.bind('add', this.addItem,  this);
	},
	render: function() {
		var TH = this;
		_(this.collection.models).each(function(item) {
			TH.addItem(item);
		}, this);
	},
	addItem: function(item) {
		var groupView = new GroupView({
			model: item
		});
		$(this.el).append(groupView.render().el);
	},
	createOnEnter: function(e) {
		var val = this.input.val();
		if( val == '') return;

		this.collection.create({label: val}, {wait: true});
		this.input.val('');
	}
/*  	afterOneSentNum: function() {
		this.collection;
    }  */
});