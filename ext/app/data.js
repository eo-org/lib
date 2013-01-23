if(window['XRequestHeader'] != undefined) {
	Backbone.old_sync = Backbone.sync;
	Backbone.sync = function(method, model, options) {
	    var new_options =  _.extend({
	        beforeSend: function(xhr) {
	        	_.each(window['XRequestHeader'],function(val, key) {
	        		xhr.setRequestHeader(key, val);
	        	});
	        }
	    }, options)
	    Backbone.old_sync(method, model, new_options);
	};
}
//Backbone.emulateJSON = true;
(function () {
    'use strict';
    require(["model/Data"], function() {
    	var dcView = new DataCollectionView();
    	dcView.load();
    });
}());