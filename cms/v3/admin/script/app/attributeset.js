Backbone.old_sync = Backbone.sync;
Backbone.sync = function(method, model, options) {
    var new_options =  _.extend({
        beforeSend: function(xhr) {
        	xhr.setRequestHeader('Attributeset_Id', attributeset.id);
        }
    }, options)
    Backbone.old_sync(method, model, new_options);
};

(function () {
    'use strict';
    require(["model/Attribute"], function() {
    	var acView = new AttributeCollectionView();
    });
}());