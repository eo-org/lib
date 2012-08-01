(function () {
    'use strict';
    require(["model/Data"], function() {
    	var dcView = new DataCollectionView();
    	
    	var AppRouter = Backbone.Router.extend({
        	routes : {
        		"@page/:pageNumber" : "loadPage",
        		"*path" : 'defaultRoute'
    		},
    		loadPage : function(pageNumber) {
    			dcView.loadPage(pageNumber);
    		},
    		defaultRoute : function() {
    			dcView.loadPage(1);
    		}
    	});
    	var appRouter = new AppRouter;
    	Backbone.history.start();
    });
}());