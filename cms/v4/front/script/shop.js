$(document).ready(function() {
	$('.add-to-cart').click(function() {
		var pId = $(this).attr('product-id');
		$.ajax({
			type: "GET",
			url: '/shop/index/add-json/product-id/' + pId,
			dataType: 'json',
			success: function(obj) {
				if(obj.result == 'success') {
					alert('您购买的产品已经加入购物车！');
				} else {
					alert('产品添加失败！');
				}
			}
		});
	});
	
	var al = $('#address-list');
	var asc = $('#address-selector-confirm');
	var getAddressList = function() {
		$.ajax({
			type: "GET",
			url: '/user/address/list/format/html',
			dataType: "html",
			success: function(html) {
				al.append(html);
				asc.html('确定');
				asc.attr('status', 'set');
			}
		});
	};
	
	var setAddressToCart = function() {
		var addressId = $('input[name=address]:checked').val();
		if(addressId == undefined) {
			alert('请选着需要配送的地址，或者创建一个新的配送地址');
		} else {
			$.ajax({
				type: "GET",
				url: '/shop/order/set-address-json/address-id/' + addressId,
				dataType: "json",
				success: function(obj) {
					al.empty();
					al.append(obj.fullAddress);
					asc.html('修改');
					asc.attr('status', 'select');
				}
			});
		}
	}
	
	/**
	 * get user selected address and save it with the current cart
	 */
	getAddressList();
	$('#address-selector-confirm').click(function() {
		if($(this).attr('status') == 'set') {
			setAddressToCart();
		} else {
			getAddressList();
		}
	});
	
	/**
	 * delete item line in cart
	 */
	$('.item-delete-action').click(function(e) {
		e.preventDefault();
		var THIS = $(this);
		var productId = THIS.attr('product-id');
		$.ajax({
			type: "GET",
			url: '/shop/index/delete-json/product-id/' + productId,
			dataType: "json",
			success: function(obj) {
				if(obj.result == 'success') {
					var spd = $('#cart-subtotal-displayer');
					spd.html(obj.subtotal);
					var tr = THIS.parents('tr').filter(':first');
					tr.remove();
				}
			}
		});
	});
});