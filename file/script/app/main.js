Backbone.old_sync = Backbone.sync;
Backbone.sync = function(method, model, options) {
    var new_options =  _.extend({
        beforeSend: function(xhr) {
            var siteId = window.SITE_ID;
            xhr.setRequestHeader('X-Site-Id', siteId);
        }
    }, options)
    Backbone.old_sync(method, model, new_options);
};

(function () {
    'use strict';
//    require(["model/File", "model/Group", "view/file", "view/group","Attribute"], function() {
    require(["model/File", "model/Group", "view/file", "view/group"], function() {
        var fcView = new FileCollectionView();
    	var gcView = new GroupCollectionView();
		var fileCollect = fcView.getCollection();
		var groupCollect = gcView.setfileCollection(fileCollect);
//		var AttView = new AttributeCollectionView();
//    	var files;
//    	var fileUploader = new FileUploader({
//    		url: '/rest/file/',
//    		afterOneSent: function(item) {
//    			var fc = fcView.getCollection();
//    			fc.add([item]);
//    		}
//    	});
//    	$('#uploadfile').change(function(e) {
//    		var files = document.querySelector("#uploadfile").files;
//    		fileUploader.process(files);
//    		$('#uploadfile').val();
//    	});
//    	fileUploader.process(files);
    	
    	
    	
        Backbone.emulateJSON = true;
        Backbone.emulateHTTP = true;
    	
    	var AppRouter = Backbone.Router.extend({
        	routes : {
    			"/groupId\::groupId@page\::pageNumber" : "loadGroupFiles"
    		},
    		loadGroupFiles : function(groupId, pageNumber) {
    			$('.file-container').attr('groupId', groupId);
    			fcView.loadGroupFiles(groupId, pageNumber);
    		}
    	});
    	var appRouter = new AppRouter;
    	Backbone.history.start();
    });
}());