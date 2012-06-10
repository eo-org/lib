(function () {
    'use strict';
    require(["model/Attribute"], function() {
    	var acView = new AttributeCollectionView();
//    	ecView.addElementView("{'id':'123','formId':'123','label':'123'}");
//    	var gcView = new GroupCollectionView();
    	
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
//    	
//    	var AppRouter = Backbone.Router.extend({
//        	routes : {
//    			"/rest/file/groupId/:groupId@page/:pageNumber" : "loadGroupFiles"
//    		},
//    		loadGroupFiles : function(groupId, pageNumber) {
//    			$('.file-container').attr('groupId', groupId);
//    			fcView.loadGroupFiles(groupId, pageNumber);
//    		}
//    	});
//    	var appRouter = new AppRouter;
//    	Backbone.history.start();
    });
}());