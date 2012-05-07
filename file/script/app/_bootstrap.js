/****************************************************/
/**Backbone Router***********************************/
/****************************************************/
$(document).ready(function() {
	/*******************************/
	/*Backbone.js read and set hash*/
	/*******************************/
	AdminRouteController = Backbone.Router.extend({
		routes			: {
			"/admin/*query@*filterParam": "updateWithFilter"
		},
		updateWithFilter : function(query, filterParam) {
			EventMessenger.trigger("updateWithFilter", filterParam);
		},
	});

	var ARC = new AdminRouteController;
	Backbone.history.start();
});












var Item = Backbone.Model.extend({
	defaults: {
		part1: 'hello',
		part2: 'world'
	}
});

var List = Backbone.Collection.extend({
	model: Item
});

$(document).ready(function() {
	var ListView = Backbone.View.extend({
		el: $('body'),
		events: {
			'click #add': 'addItem'
		},
		initialize: function() {
			_.bindAll(this, 'render', 'addItem'); // fixes loss of context for 'this' within methods
			
			this.collection = new List();
			this.collection.bind('add', this.appendItem);
			
			this.counter = 0;
			this.render(); // not all views are self-rendering. This one is.
		},
		render: function() {
			$(this.el).append("<button id='add'>Add list item</button>");
			$(this.el).append("<ul> <li>hello world</li> </ul>");
		},
		addItem: function() {
			this.counter++;
			$('ul', $(this.el)).append("<li>hello</li>");
		}
	});
	
	var listView = new ListView();
});

