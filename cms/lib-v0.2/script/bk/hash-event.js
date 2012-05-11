(function($) {
    var hashVar = "";
    var prevHashVar = "";
    var intIntervalTime = 100;
    
    var checkHash = function() {
        if (hashVar != window.location.hash) {
            prevHashVar = hashVar;
            hashVar = window.location.hash;
            $(window.location).trigger(
                "change", {currentHash: hashVar, previousHash: prevHashVar}
            );
        }
    }
    
    setInterval(checkHash, intIntervalTime);
    
    $.fn.jqHash = function(hString) {
    	var hashString = hString.slice(1);
    	var hashArr = hashString.split('&');
    	
    	
    	
    	this.getValue = function(name) {
    		var value = null;
    		$(hashArr).each(function(i, hashItem) {
        		var tmp = hashItem.split('=');
        		if(tmp[0] == name) {
        			value = tmp[1];
        		}
        	});
    		return value;
    	}
    	
    	return this;
    }
})( jQuery );