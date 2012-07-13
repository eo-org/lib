var Prompt = (function(){
	var instantiated;
	var documentheight = $(window).height();
	var documentwidth = $(document).width();
	
	var loadingBoxEl = null;
	var hintBoxEl = null;
	var maskBoxEl = null;
	var contentEditorEl = null;
	var contentEditorCloseEl = null;
	
	function init() {
		loadingBoxEl = $('<div class="loading-box">Loading...</div>');
		hintBoxEl = $('<div class="hint-box"></div>');
		maskBoxEl = $('<div class="mask-box"></div>');
		contentEditorEl = $('<div class="content-editor"></div>');
		contentEditorCloseEl = $('<div class="content-editor-close">x</div>');
		
		$('body').append(loadingBoxEl);
		$('body').append(hintBoxEl);
		$('body').append(maskBoxEl);
		$('body').append(contentEditorEl);
		$('body').append(contentEditorCloseEl);
		$('.content-editor-close').bind('click',function(){ Prompt.getInstance().closeMask() });
	};
	function mask(){
		return {
			showLoadingBox: function(){
				loadingBoxEl.animate(
					{'bottom': '40px'},
					500
				);
			},
			hiddenLoadingBox: function(){
				loadingBoxEl.animate(
					{
						'bottom': '-40px',
					},
					500
				);
			},
			showHintBox: function(content){
				hintBoxEl.html(content);
				hintBoxEl.animate(
					{
						'right': '28px', 
					},
					1000
				);
			},
			hiddenHintBox: function(){
				hintBoxEl.animate(
					{
						'right': '-260px', 
					},
					1000
				);
			},
			showMask: function(){
				maskBoxEl.css({
					'display':'block',
					'width': documentwidth,
					'height': documentheight
				});
			},
			contentEditor: function(Ttop,content){
				contentEditorEl.html(content);
				var leftW = (parseInt(documentwidth) - 500)/2;
				contentEditorEl.css({
					'display':'block',
					'top': Ttop+'px',
					'left': leftW+'px'
				});
				contentEditorCloseEl.css({
					'display':'block',
					'top': Ttop-6+'px',
					'left': leftW+500+10+'px'
				});
			},
			closeMask: function(){
				maskBoxEl.css('display','none');
				contentEditorEl.css('display','none');
				contentEditorCloseEl.css('display','none');
			}
		}
	}
	return {
		getInstance :function(){
			if(!instantiated){
				init();
				instantiated = mask();
			}
			return instantiated; 
		}
	}
})()
