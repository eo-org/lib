(function () {
	'use strict';
    require(["model/Ad"], function() {
    	var acView = new AdCollectionView();
    	Backbone.emulateJSON = true;
		Backbone.emulateHTTP = true;
    });
}());