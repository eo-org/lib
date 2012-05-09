/*
 * fix for IE
 */
if(!Array.indexOf) {
  Array.prototype.indexOf = function (obj, start) {
    for (var i = (start || 0); i < this.length; i++) {
      if (this[i] == obj) {
        return i;
      }
    }
  }
}
/*
 * END fix for IE
 */

$.fn.Product = function() {};
$.fn.Product.Config = function(opt) {
	var PRODUCT = this;
	var selectors;
	var qtyCounter;
	var responsor;
	
	PRODUCT.ops = {
		basePrice: 0
	};
	PRODUCT.ops = $.extend(PRODUCT.ops, opt);
	
	var fillSelector = function(currentIndex, el) {
		var attributeId = $(el).attr('attributeId');
		var currentOptions = getAttributeOptions(attributeId);
		
		$(el).empty();
		$(el).append("<option value='0'>---请选择---</option>");
		if(currentIndex == 0) {
			for(var i = 0; i < currentOptions.length; i++) {
				$(el).append("<option value='" + currentOptions[i].id + "'>" + currentOptions[i].label + "</option>");
			}
		} else {
			var allowedProducts = getAllowedProducts(currentIndex);
			for(var i = 0; i < currentOptions.length; i++) {
				for(var j = 0; j < currentOptions[i].products.length; j++){
					if(allowedProducts.indexOf(currentOptions[i].products[j]) > -1) {
						$(el).append("<option value='" + currentOptions[i].id + "'>" + currentOptions[i].label + "</option>");
					}
				}
			}
		}
	};
	
	var getAttributeOptions = function(attributeId) {
        if(PRODUCT.ops.attributes[attributeId]) {
            return PRODUCT.ops.attributes[attributeId].options;
        }
    };
	
    var getAllowedProducts = function(currentIndex) {
    	var allowedProducts = [];
    	var attributeId = $(PRODUCT.ops.selectors[0]).attr('attributeId');
    	var optionId = $(PRODUCT.ops.selectors[0]).val();
    	var options = getAttributeOptions(attributeId);
    	for(var i = 0; i < options.length; i++) {
    		if(options[i].id == optionId) {
    			allowedProducts = options[i].products;
    		}
    	}
    	for(var i = 0; i < currentIndex; i++) {
    		var subAllowedProducts = [];
    		var attributeId = $(PRODUCT.ops.selectors[i]).attr('attributeId');
    		var optionId = $(PRODUCT.ops.selectors[i]).val();
    		var options = getAttributeOptions(attributeId);
    		for(var j = 0; j < options.length; j++) {
    			if(options[j].id == optionId) {
    				subAllowedProducts = options[j].products;
        		}
    		}
    		alert(subAllowedProducts);
    		for(var k = 0; k < allowedProducts.length; k++) {
    			if(subAllowedProducts.indexOf(allowedProducts[k]) == -1) {
    				allowedProducts.splice(k, 1);
    			}
    		}
    	}
    	alert(allowedProducts);
    	return allowedProducts;
    };
    
	this.initSelectors = function(ops) {
		PRODUCT.ops.selectors = ops.selectors;
		PRODUCT.qtyCounter = ops.qtyCounter;
		PRODUCT.responsor = ops.responsor;
		if(PRODUCT.ops.selectors.length == 0) {
			PRODUCT.qtyCounter.empty();
			for(var j = 1; j < 10; j++) {
				PRODUCT.qtyCounter.append("<option value='" + j + "'>" + j + "</option>");
			}
			PRODUCT.responsor.val(PRODUCT.ops.productId);
		}
		PRODUCT.ops.selectors.each(function(i, sel) {
			if(i == 0) {
				fillSelector(i, sel);
			} else {
				$(sel).attr('disabled', 'disabled');
			}
			
			$(sel).bind('change', function() {
				if(i + 1 >= PRODUCT.ops.selectors.length) {
					var allowedProducts = getAllowedProducts(i);
					var productId = allowedProducts[0];
					PRODUCT.qtyCounter.empty();
					for(var j = 1; j < 10; j++) {
						PRODUCT.qtyCounter.append("<option value='" + j + "'>" + j + "</option>");
					}
					PRODUCT.responsor.val(productId);
				} else {
					var nextEl = PRODUCT.ops.selectors[i + 1];
					$(nextEl).attr('disabled', false);
					fillSelector(i + 1, nextEl);
				}
			});
		});
	};
	return this;
};