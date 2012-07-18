(function () {
    require(["headfile", "model/Headfile"], function() {
		var tlcView = new HeadfileCollectionView();
    });
	
	Backbone.emulateJSON = true;
	Backbone.emulateHTTP = true;
}());