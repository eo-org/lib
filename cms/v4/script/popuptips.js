$(document).ready(function(){
	$.fn.loading = function(string){
		$(this).click(function(){
			if(!$('.conseal').attr('class')){
				$('body').append('<div class=conseal style="border-radius: 4px 4px 4px 4px;line-height:30px;background:#E0E0E0;width:260px;height:32px;position:fixed;bottom:0;right:28px;display:block;"><div class=consealTips>'+string+'</div></div>');
				$('.consealTips').css({
					background:'url(attribute-editor_files/load.gif) no-repeat',
					width: '200px',
					height: '32px',
					'margin-left': '10px',
					'padding-left':'50px'
				});
				$('.conseal').animate(
					{bottom: '40px'},
					500
				);
			}
			//$('.attribute-library-item').moveLoading();
		});
	}
	$.fn.moveLoading = function(){
		$('.conseal').animate(
			{
				bottom: '0px',
			},
			500,
			function(){
				$('.conseal').remove();
			}
		);
	}
	$.fn.affirm = function(){
		$('body').append('<div class=affirm style="border-radius: 7px 7px 7px 7px;line-height:30px;text-align: center;width:260px;height:30px;background: #FFA500;position:fixed;top: 57px;right:-260px"><div class=save-sort>保存排序</div></div>');
		$('.affirm').animate(
			{
				right: '28', 
			},
			1000
		);
	}
	$.fn.moveAffirm = function(){
		$('.affirm').animate(
			{
				right: '-260px', 
			},
			1000
		);
	}
	//$('.attribute-library-item').loading("123");
	//$('.attribute-library-item').affirm();
	//$('.attribute-library-item').moveAffirm();
})