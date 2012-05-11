(function($) {
	$.fn.updateCart = function(options) {
		$.each($(this), function(i, qtyInput) {
			$(qtyInput).blur(function() {
				if($(this).val() != $(this).attr('oldValue')) {
					var currObj = $(this);
					
					var oldValue = currObj.attr('oldValue');
					var newValue = currObj.val();
					$.getJSON('/cart/adjust-json/productId/' + $(this).attr('productId') + '/qty/' + newValue, function(jsonObj) {
						if(jsonObj.result) {
							currObj.attr('oldValue', jsonObj.itemCount);
							currObj.val(jsonObj.itemCount);
							options.productCount.html(jsonObj.productCount);
							options.productTotal.html('￥' + jsonObj.productTotal.toFixed(0));
							currObj.parents('tr').children('.item-total').html('￥' + jsonObj.itemTotal.toFixed(0));
						} else {
							alert('对不起,此项产品的库存不足了!');
							currObj.val(oldValue);
						}
					});
				}
			});
		});
	};
	
	$.fn.addToCart = function(productIdObj, qty, callback) {
		var jsonStr = '/cart/add-json';
		
		for(var key in productIdObj) {
			switch(key) {
				case 'entityId':
					jsonStr+= '/entityId/' + productIdObj[key] + '/qty/' + qty;
					break;
				case 'crossSellEntityIds':
					jsonStr+= '/crossSellEntityIds/' + productIdObj[key].join(',');
					break;
			}
		}
		
		$.getJSON(jsonStr, function(jsonObj) {
			if(jsonObj.result) {
				globalCartDisplyStatus = 'none';
				response = {
					result:true,
					name: jsonObj.name,
					price: jsonObj.price,
					qty: jsonObj.qty
				};
				callback(response);
			} else {
				response = {result:false};
				callback(response);
				alert('对不起,此项产品的库存不足了!');
			}
		});
	};
})(jQuery);