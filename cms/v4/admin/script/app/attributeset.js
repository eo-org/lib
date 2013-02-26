Backbone.old_sync = Backbone.sync;
Backbone.sync = function(method, model, options) {
    var new_options =  _.extend({
        beforeSend: function(xhr) {
        	xhr.setRequestHeader('X-Attributeset-Id', attributeset.id);
        	xhr.setRequestHeader('X-Attributeset-Type', attributeset.type);
        }
    }, options)
    Backbone.old_sync(method, model, new_options);
};
Backbone.emulateJSON = true;
(function () {
    'use strict';
    require(["model/Attribute"], function() {
    	var acView = new AttributeCollectionView();
    });
}());