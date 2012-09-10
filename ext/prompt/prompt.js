var Prompt = (function() {
	var instantiated;
	var documentheight = null;
	var documentwidth = null;
	
	var loadingBoxEl = null;
	var hintBoxEl = null;
	var hintBoxContent = null;
	var maskBoxEl = null;
	var editorEl = null;
	var closeEl = null;
	
	function init() {
		loadingBoxEl = $('<div class="loading-box info-prompt">Processing...</div>');
		
		hintBoxEl = $('<div class="hint-box warning-prompt"><div class="icon"></div></div>');
		hintBoxContentEl = $('<div class="content"></div>');
		hintBoxEl.append(hintBoxContentEl);
		
		maskBoxEl = $('<div class="mask-box"></div>');
		editorEl = $('<div class="mask-inner-editor"></div>');
		closeEl = $('<div class="mask-inner-editor-close"></div>');
		
		closeEl.click(function() {
			instantiated.hideMask();
		});
		
		$('body').append(loadingBoxEl);
		$('body').append(hintBoxEl);
		$('body').append(maskBoxEl);
		$('body').append(editorEl);
		$('body').append(closeEl);
	};
	function prompt() {
		return {
			getDocumentDim: function() {
				documentheight = $(document).height();
				documentwidth = $(document).width();
			},
			showLoadingBox: function() {
				loadingBoxEl.animate(
					{'bottom': '40px'},
					500
				);
				return instantiated;
			},
			hideLoadingBox: function() {
				loadingBoxEl.animate(
					{
						'bottom': '-80px',
					},
					500
				);
				return instantiated;
			},
			appendHintBoxContent: function(content) {
				hintBoxContentEl.html(content);
				return instantiated;
			},
			showHintBox: function() {
				hintBoxEl.animate(
					{
						'right': '28px', 
					},
					500
				);
			},
			hideHintBox: function() {
				hintBoxEl.animate(
					{
						'right': '-300px', 
					},
					500
				);
			},
			appendEditorContent: function(content) {
				editorEl.html(content);
				return instantiated;
			},
			showMask: function(tTop) {
				maskBoxEl.css({
					'display':'block',
					'width': documentwidth,
					'height': documentheight
				});
				tTop = tTop == undefined ? 100 : tTop;
				
				var leftW = (parseInt(documentwidth) - 500)/2;
				editorEl.css({
					'display':'block',
					'top': tTop+'px',
					'left': leftW+'px'
				});
				closeEl.css({
					'display':'block',
					'top': tTop - 6 + 'px',
					'left': leftW + 510 + 'px'
				});
				return instantiated;
			},
			hideMask: function(){
				maskBoxEl.css('display','none');
				editorEl.css('display','none');
				closeEl.css('display','none');
			}
		}
	}
	return {
		getInstance :function(){
			if(!instantiated){
				init();
				instantiated = prompt();
			}
			return instantiated; 
		}
	}
})();

$(document).ready(function() {
	Prompt.getInstance().getDocumentDim();
	var p = Prompt.getInstance();
	$('.ajax-content-prompt-trigger').on('click', function(e) {
		e.preventDefault();
		var url = $(this).attr('href');
		$.ajax({
			url: url,
			data: {'format': 'html'},
			dataType: 'html',
			beforeSend: function() {
				p.showLoadingBox();
			},
			success: function(data) {
				p.appendEditorContent(data);
				p.hideLoadingBox();
				p.showMask();
			}
		});
	});
	$('.mask-inner-editor').on('click', '.ajax-content-prompt-button a', function(e) {
		e.preventDefault();
		var form = $('.mask-inner-editor form:first');
		var postData = form.serialize();
		postData+= '&format=html';
		var url = $(this).attr('href');
		$.ajax({
			url: url,
			type: 'POST',
			data: postData,
			dataType: 'html',
			beforeSend: function() {
				p.showLoadingBox();
			},
			success: function(data) {
				p.hideLoadingBox();
				if(data != 'success') {
					p.appendEditorContent(data);
				} else {
					p.hideMask();
				}
			}
		});
	})
});
