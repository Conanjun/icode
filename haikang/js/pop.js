(function($){
	$(function(){
		
		var mod1 = '<div class="pull"><img src="images/zan.png" class="mod"></div>';
		var mod2 = '<div class="pull"><img src="images/cai.png" class="mod"></div>';
		
		
		//$("#scroll")要选取不是动态生成的父元素id
		$("#scroll").on("tap",".img1",function(e){
			e.stopPropagation();//阻止事件冒泡即可
			$("html").append(mod1);
			
			$(".pull").not($(".mod")).on("tap",function(){
				$(".pull").remove();
			});
			alert(1);
		});
		$("#scroll").on("tap",".img2",function(e){
			e.stopPropagation();//阻止事件冒泡即可
			alert(2);
			$("html").append(mod2);
			$(".pull").not($(".mod")).on("tap",function(){
				$(".pull").remove();
			});
		});
		
		
		//非动态生成
		$(".img1").on("tap",function(e){
			e.stopPropagation();//阻止事件冒泡即可
			alert(3);
			$("html").append(mod1);
			$(".pull").not($(".mod")).on("tap",function(){
				$(".pull").remove();
			});
		});
		$(".img2").on("tap",function(e){
			e.stopPropagation();//阻止事件冒泡即可
			alert(4);
			$("html").append(mod2);
			$(".pull").not($(".mod")).on("tap",function(){
				$(".pull").remove();
			});
		});
	});
})(jQuery);