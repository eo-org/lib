(function () {
	'use strict';
    require(["model/AdSection"], function() {
    	var ascView = new AdSectionCollectionView();
    	Backbone.emulateJSON = true;
		Backbone.emulateHTTP = true;
    });
}());