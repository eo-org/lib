//Backbone.old_sync = Backbone.sync;
//Backbone.sync = function(method, model, options) {
//    var new_options =  _.extend({
//        beforeSend: function(xhr) {
//        	xhr.setRequestHeader('X-Attributeset-Id', attributeset.id);
//        	xhr.setRequestHeader('X-Attributeset-Type', attributeset.type);
//        }
//    }, options)
//    Backbone.old_sync(method, model, new_options);
//};
//Backbone.emulateJSON = true;
//var MESSAGE_MAX_ID_COUNT = 1;
(function () {
    'use strict';
    require(["model/Element", "model/MessageForm"], function() {
    	if(MESSAGE_FORM_ID == "") {
    		var messageFormModel = new MessageForm();
			var elementCollection = new ElementCollection();
			
			var mfView = new MessageFormView({
				mfModel: messageFormModel
			});
			var ecView = new ElementCollectionView({
	    		mfModel: messageFormModel,
	    		elementCollection: elementCollection
	    	});
	    	var mfeView = new MessageFormEditorView({
	    		mfModel: messageFormModel,
	    		elementCollection: elementCollection
	    	});
	    	console.log('fefefe');
		} else {
			var messageFormModel = new MessageForm({id: MESSAGE_FORM_ID});
			var elementCollection = new ElementCollection();
			
			messageFormModel.fetch({success: function() {
				var mfView = new MessageFormView({
					mfModel: messageFormModel
				});
				var ecView = new ElementCollectionView({
		    		mfModel: messageFormModel,
		    		elementCollection: elementCollection
		    	});
		    	var mfeView = new MessageFormEditorView({
		    		mfModel: messageFormModel,
		    		elementCollection: elementCollection
		    	});
			}});
		}
    	//mfeView.setElementModelCollection(ecView.getCollection());
    });
}());