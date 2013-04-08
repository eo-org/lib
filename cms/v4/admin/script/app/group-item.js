Backbone.old_sync = Backbone.sync;
Backbone.sync = function(method, model, options) {
    var new_options =  _.extend({
        beforeSend: function(xhr) {
        	xhr.setRequestHeader('X-Group-Type', groupType);
        }
    }, options)
    Backbone.old_sync(method, model, new_options);
};
Backbone.emulateJSON = true;
(function () {
    'use strict';
    require(["model/GroupItem"], function() {
    	var gicView = new GroupItemCollectionView();
    });
}());