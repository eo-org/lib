Backbone.old_sync = Backbone.sync;
Backbone.sync = function(method, model, options) {
    var new_options =  _.extend({
        beforeSend: function(xhr) {
            xhr.setRequestHeader('X-Thread-Id', appThreadId);
        }
    }, options)
    Backbone.old_sync(method, model, new_options);
};
Backbone.emulateJSON = true;
(function () {
    require(["model/Post"], function() {
		var pcView = new PostCollectionView();
    });
	
}());