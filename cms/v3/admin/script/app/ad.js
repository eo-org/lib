Backbone.old_sync = Backbone.sync;
Backbone.sync = function(method, model, options) {
    var new_options =  _.extend({
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Section_Id', sectionId);
        }
    }, options)
    Backbone.old_sync(method, model, new_options);
};

(function () {
	'use strict';
    require(["model/Ad"], function() {
    	var acView = new AdCollectionView();
    	Backbone.emulateJSON = true;
		Backbone.emulateHTTP = true;
    });
}());