Backbone.emulateJSON = true;
(function () {
    require(["head-file", "model/HeadFile"], function() {
		var tlcView = new HeadFileCollectionView();
    });
}());