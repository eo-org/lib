Backbone.old_sync = Backbone.sync;
Backbone.sync = function(method, model, options) {
    var new_options =  _.extend({
        beforeSend: function(xhr) {
            xhr.setRequestHeader('X-Section-Id', sectionId);
        }
    }, options)
    Backbone.old_sync(method, model, new_options);
};
Backbone.emulateJSON = true;
(function () {
	'use strict';
    require(["model/Ad"], function() {
    	var acView = new AdCollectionView();
    });
}());