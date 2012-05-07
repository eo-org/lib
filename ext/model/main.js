(function () {
    'use strict';
    require(["Datalist"], function() {
    	var dcView = new DataCollectionView();
    	
        Backbone.emulateJSON = true;
        Backbone.emulateHTTP = true;
    	
//    	var AppRouter = Backbone.Router.extend({
//        	routes : {
//    			"/rest/file/groupId/:groupId@page/:pageNumber" : "loadGroupFiles"
//    		},
//    		loadGroupFiles : function(groupId, pageNumber) {
//    			$('#uploadfile').attr('groupId', groupId);
//    			fcView.loadGroupFiles(groupId, pageNumber);
//    		}
//    	});
//    	var appRouter = new AppRouter;
//    	Backbone.history.start();
    });
}());