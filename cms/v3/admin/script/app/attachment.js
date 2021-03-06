Backbone.emulateJSON = true;
(function () {
	require(["model/Attachment"], function() {
		var acView;
		acView = new AttachmentCollectionView({'attachmentObjList': attachmentBackboneSourceObj});
		
		window.appendAttachmentListener = function(data, caller) {
			attachmentType = $(caller).attr('name');
			console.log(data);
			attaModel = new Attachment();
			attaModel.set(data);
			attaModel.set('filetype', attachmentType);
			acView.append(attaModel);
		}
    });
}());