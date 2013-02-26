/****************************************************/
/**Form Element Drag*********************************/
/****************************************************/
$(document).ready(function() {
	var prevEmpty = null;
	
	$('.element-library-item').draggable(function() {
		var dropLis = $('.element-dropable');
		dropLis.css({'background':'#0077bb', 'opacity':1});
		
		dragSrcEl = $(this);
		dragSrcEl.css('opacity', 0.2);
		
		if(dragSrcEl.attr('elementType') != undefined) {
			prevEmpty = $("<li class='element-dropable'></li>");
			return {
				effect: 'copy',
				'el': $(this).attr('elementType')
			};
		} else {
			prevEmpty = dragSrcEl.prev('li');
			return {
				effect: 'move',
				'el': $(this).html(),
			};
		}
	}, function() {
		var dropLis = $('.element-dropable');
		dropLis.css({opacity: 0});
		dragSrcEl.animate({opacity: 1}, function() {
			dragSrcEl = null;
			prevEmpty = null;
		});
	});
	
	$('.element-dropable').droppable(
		'el',
		function() {
			$(this).css({'background':'#2299dd'});
		},
		function() {
			$(this).css({'background':'#0077bb'});
		},
		function(e) {
			if(dragSrcEl.attr('element-type') != undefined) {
				var dropEl = $(this);
				var elType = dragSrcEl.attr('element-type');
				var formid = $('#formname').val();
				var resp = $.ajax({
					type: "POST",
					url: '/admin/attributeset/get-element-template/type/' + elType + '/id/' + formid + '/format/html',
					success: function(html) {
						if(resp.getResponseHeader('result') == 'success') {
							var newDrop = $("<li class='element-dropable'></li>");
							newDrop.insertBefore(dropEl);
							$(html).insertBefore(dropEl);
						} else {
							alert('error');
						}
					}
				});
			} else {
				prevEmpty.insertBefore(this);
				dragSrcEl.insertBefore(this);
			}
		}
	);
});