var dragSrcEl = null;

/****************************/
/***********Groups***********/
/****************************/
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
});
