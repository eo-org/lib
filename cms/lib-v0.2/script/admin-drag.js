var dragSrcEl = null;

/****************************/
/***********Groups***********/
/****************************/


//$(document).ready(function() {
//$(".blackbox").bind('AdminControlLoad', function() {
//	var dragUls = $('.tree-structure ul');
//	var dragHandles = $('.tree-structure div.handle');
//	var dragLis = dragHandles.parents('li').filter(':first');
//	
//	dragUls.each(function(i, dragUl) {
//		var emptyLi = document.createElement('li');
//		emptyLi.className = 'empty';
//		emptyLi.draggable = 'ture';
//		$(emptyLi).appendTo($(dragUl));
//	});
//	dragHandles.each(function(i, handle) {
//		handle.draggable = 'ture';
//		handle.addEventListener('dragstart', handleDragStart, false);
//		handle.addEventListener('dragend', handleDragEnd, false);
//		handle.addEventListener('drop', function(e) {
//			if (e.stopPropagation) e.stopPropagation();
//			return false;
//		}, false);
//		
//		var parentLi = $(handle).parents('li').filter(':first');
//		var emptyLi = document.createElement('li');
//		emptyLi.className = 'empty';
//		emptyLi.draggable = 'ture';
//		$(emptyLi).insertBefore(parentLi);
//	});
//	
//	var allLis = $('.tree-structure li');
//	allLis.each(function(i, liEl) {
//		if(liEl.className == 'solid') {
//			liEl.addEventListener('dragover', handleDragOver, false);
//			liEl.addEventListener('dragleave', handleDragLeave, false);
//			liEl.addEventListener('drop', handleDrop, false);
//		} else if(liEl.className == 'empty') {
//			liEl.addEventListener('dragover', handleDragOverEmpty, false);
//			liEl.addEventListener('dragleave', handleDragLeaveEmpty, false);
//			liEl.addEventListener('drop', handleDropEmpty, false);
//		}
//	});
//});
//});



$(document).ready(function() {
	var dragHandles = $('.tree-structure div.handle');
	dragHandles.bind('dragstart', function(evt) {
		dragSrcEl = $(this).parents('li').filter(':first');
		var prevEmpty = dragSrcEl.prev('li');
		dragSrcEl.css('display', 'none');
		prevEmpty.css('display', 'none');
		
		evt.dataTransfer.effectAllowed = 'move';
		evt.dataTransfer.setData('text/html', 'the group name');
	}).bind('dragend', function(evt) {
		var prevEmpty = dragSrcEl.prev('li');
		prevEmpty.css('display', 'block');
		var nextEmpty = dragSrcEl.next('li');
		nextEmpty.css('display', 'block');
		dragSrcEl.css({'opacity':0.2});
		dragSrcEl.css('display', 'block');
		dragSrcEl.animate({'opacity':1}, 800);
		dragSrcEl = null;
		return false;
	});
	
	var dropLis = $('.tree-structure li.dropable');
	$(dropLis).live('dragover', function(evt) {
		evt.preventDefault();
		$(this).css('border', '1px dotted #777');
	}).bind('dragleave', function(evt) {
		evt.preventDefault();
		$(this).css('border', 'none');
	}).bind('drop', function(evt) {
		evt.stopPropagation();
		$(this).css('border', 'none');
		var prevEmpty = dragSrcEl.prev('li');
		var oldParentUl = dragSrcEl.parents('ul').filter(':first');
		if($(this).hasClass('empty')) {
			//move with empty slot in front of the cell
			prevEmpty.insertBefore(this);
			dragSrcEl.insertBefore(this);
			
			var newParentLi = $(this).parents('li').filter(':first');
			if(newParentLi[0] == null) {
				dragSrcEl.attr('parentId', 0);
			} else {
				dragSrcEl.attr('parentId', newParentLi.attr('id'));
			}
		} else if($(this).hasClass('solid')) {
			var newParentUl = $(this).children('ul').filter(':first');
			if(newParentUl[0] == null) {
				newParentUl = $('<ul></ul>');
				var emptyLi = $("<li class='empty group dropable'></li>");
				$(emptyLi).appendTo(newParentUl);
			}
			dragSrcEl.appendTo(newParentUl);
			prevEmpty.appendTo(newParentUl);
			
			newParentUl.appendTo(this);
			dragSrcEl.attr('parentId', $(this).attr('id'));
		}
		//remove old empty parent, containing only one empty slot
		if(oldParentUl.children().size() == 1) {
			oldParentUl.remove();
		}
		return false; 
	});
//	dropLis.droppable(
//		'text',
//		//drag enter
//		function() {
//			$(this).css('border', '1px dotted #777');
//		},
//		//drag leave
//		function() {
//			$(this).css({'border': '1px solid #ddd'});
//		},
//		//drop
//		function(e) {
//			alert('??');
////			$.ajax({
////				type: "GET",
////				url: '/admin/file/move-file-json/filename/' + e.dataTransfer.getData('text') + '/groupId/' + $(this).attr('aid'),
////				success: function(json) {
////					if(json.result != 'success') {
////						alert(json.msg);
////					} else {
////						$(dragSrcEl).remove();
////						dragSrcEl = null;
////					}
////				}
////			});
//		}
//	);
});

//var handleDragStart = function(e) {
//	dragSrcEl = $(this).parents('li').filter(':first');
//	
//	dragSrcEl.css('display', 'none');
//	e.dataTransfer.effectAllowed = 'move';
//	e.dataTransfer.setData('text/html', dragSrcEl.innerHTML);
//};
//var handleDragEnd = function(e) {
//	dragSrcEl.css('display', 'block');
//	return false;
//};
//
//var handleDragOver = function(e) {
//	if (e.preventDefault) e.preventDefault();
//	e.dataTransfer.dropEffect = 'move';
//	this.style.border = '1px dashed #999';
//	return false;
//};
//var handleDragLeave = function(e) {
//	this.style.border = '1px solid #ddd';
//};
//var handleDrop = function(e) {
//	if (e.stopPropagation) e.stopPropagation();
//	this.style.border = '1px solid #ddd';
//	if(dragSrcEl[0] != this) {
//		var oldParentUl = dragSrcEl.parents('ul').filter(':first');
//		var newParentUl = $(this).children('ul').filter(':first');
//		if(newParentUl[0] == null) {
//			newParentUl = $('<ul></ul>');
//			var emptyLi = document.createElement('li');
//			emptyLi.className = 'empty';
//			emptyLi.draggable = 'ture';
//			emptyLi.addEventListener('dragover', handleDragOverEmpty, false);
//			emptyLi.addEventListener('dragleave', handleDragLeaveEmpty, false);
//			emptyLi.addEventListener('drop', handleDropEmpty, false);
//			$(emptyLi).appendTo(newParentUl);
//		}
//		var prevEmpty = dragSrcEl.prev('li');
//		dragSrcEl.appendTo(newParentUl);
//		prevEmpty.appendTo(newParentUl);
//		
//		newParentUl.appendTo(this);
//		dragSrcEl.attr('parentId', $(this).attr('id'));
//		//remove old empty parent, containing only one empty slot
//		if(oldParentUl.children().size() <= 1) {
//			oldParentUl.remove();
//		}
//	}
//	return false;
//};
////--------------drop on empty slot--------------//
////--------------to reorder items----------------//
//var handleDragOverEmpty = function(e) {
//	if (e.preventDefault) e.preventDefault();
//	e.dataTransfer.dropEffect = 'move';
//	this.style.border = '1px dashed #999';
//	return false;
//};
//var handleDragLeaveEmpty = function(e) {
//	this.style.border = '1px solid white';
//}
//var handleDropEmpty = function(e) {
//	if (e.stopPropagation) e.stopPropagation();
//	this.style.border = '1px solid white';
//	
//	var prevEmpty = dragSrcEl.prev('li');
//	var oldParentUl = dragSrcEl.parents('ul').filter(':first');
//	//move with empty slot in front of the cell
//	if(prevEmpty[0] != $(this)[0]) {
//		prevEmpty.insertBefore(this);
//		dragSrcEl.insertBefore(this);
//		
//		//remove old empty parent, containing only one empty slot
//		if(oldParentUl.children().size() == 1) {
//			oldParentUl.remove();
//		}
//	}
//	var newParentLi = $(this).parents('li').filter(':first');
//	if(newParentLi[0] == null) {
//		dragSrcEl.attr('parentId', 0);
//	} else {
//		dragSrcEl.attr('parentId', newParentLi.attr('id'));
//	}
//	return false;
//};
//
//$(document).ready(function() {
//	$(".blackbox").bind('AdminControlLoad', function() {
//		var dragUls = $('.tree-structure ul');
//		var dragHandles = $('.tree-structure div.handle');
//		var dragLis = dragHandles.parents('li').filter(':first');
//		
//		dragUls.each(function(i, dragUl) {
//			var emptyLi = document.createElement('li');
//			emptyLi.className = 'empty';
//			emptyLi.draggable = 'ture';
//			$(emptyLi).appendTo($(dragUl));
//		});
//		dragHandles.each(function(i, handle) {
//			handle.draggable = 'ture';
//			handle.addEventListener('dragstart', handleDragStart, false);
//			handle.addEventListener('dragend', handleDragEnd, false);
//			handle.addEventListener('drop', function(e) {
//				if (e.stopPropagation) e.stopPropagation();
//				return false;
//			}, false);
//			
//			var parentLi = $(handle).parents('li').filter(':first');
//			var emptyLi = document.createElement('li');
//			emptyLi.className = 'empty';
//			emptyLi.draggable = 'ture';
//			$(emptyLi).insertBefore(parentLi);
//		});
//		
//		var allLis = $('.tree-structure li');
//		allLis.each(function(i, liEl) {
//			if(liEl.className == 'solid') {
//				liEl.addEventListener('dragover', handleDragOver, false);
//				liEl.addEventListener('dragleave', handleDragLeave, false);
//				liEl.addEventListener('drop', handleDrop, false);
//			} else if(liEl.className == 'empty') {
//				liEl.addEventListener('dragover', handleDragOverEmpty, false);
//				liEl.addEventListener('dragleave', handleDragLeaveEmpty, false);
//				liEl.addEventListener('drop', handleDropEmpty, false);
//			}
//		});
//	});
//});
