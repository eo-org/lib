Backbone.old_sync = Backbone.sync;
Backbone.sync = function(method, model, options) {
    var new_options =  _.extend({
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Tree_Type', tree.type);
            xhr.setRequestHeader('Tree_Id', tree.id);
        }
    }, options)
    Backbone.old_sync(method, model, new_options);
};

(function () {
    'use strict';
    require(["treeleaf", "model/Treeleaf"], function() {
    	var tlcView = new TreeleafCollectionView();
    });
}());