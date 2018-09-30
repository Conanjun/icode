
$(function() {
	
	
	//右侧选项卡切换
	$("#bodyRight .b-r-top span").each(function(i) {
		$(this).click(function() {
			$(this).addClass("btn-click").siblings().removeClass("btn-click");
			$("#bodyRight .b-r-body li").eq(i).show().siblings().hide();
		});
	});
	

	
	//字体大小选择
	$("#fz").change(function() {
		$("#sendtxt").css({"font-size" : $(this).val()});
	});
	
	(function() {
		//评论弹框
		var onoff = true;
		
		$(".c-ctn").click(function() {
			$(this).stop().fadeOut(100);
		});
		$("#submit").click(function() {
			$(".c-ctn").stop().fadeOut(100);
		});
		$("#cancel").click(function() {
			closePingJia();
			
		});
		
		$("#comment").click(function(e) {
			e.stopPropagation();
		});
		

		//关闭窗口
		$(".close").click(function() {
			$(".cl-ctn").stop().fadeIn(100);
		});
		$(".cl-ctn").click(function() {
			$(this).stop().fadeOut(100);
		});
		$("#cl-yes").click(function() {
			onoff = false;
			$(".cl-ctn").stop().fadeOut(100, function() {
				$(".c-ctn").stop().fadeIn(100);
			});
		});
		$("#cl-no").click(function() {
			$(".cl-ctn").stop().fadeOut(100);
		});
		$("#close").click(function(e) {
			e.stopPropagation();
		});
	})();
	
	
	//历史记录弹框  
	$(".r-c-close-icon").click(function() {
		$(".record-ctn").fadeOut(100);
		
	});
	$(".r-c-ctx").click(function(e) {
		e.stopPropagation();
	});
	$(".record-ctn").click(function() {
		$(".record-ctn").fadeOut(100);
	});
	$('#closediagio').click(function(){
		$(".record-ctn").fadeOut(100);
	})
	
	/**去除页面滚动条失效bug Amend by zhaoyuxing 
	 * 说明：setBChat()作用为设置SC_inner的高度，如果SC_inner高度固定，则滚动区域高度固定为聊天窗大小，则失效
	 *处理：不使用该方法
	*/
	// setBChat();
	function setBChat() {
		$(".b-chat").height($(".b-left").height() - $(".b-input").height() - 25);
	}
	
	//浏览器缩放
	$(window).resize(function() {
		// setBChat();
	});
	
	$('#left_content').on('click','.robot_people',function(){
		sendCMD();
	})
	function sendCMD() {
		window.top.postMessage('{"cmdNum":"10001","time":"'+new Date().getTime()+'"}', "*");
	}
	
})
//满意度评价框
function showIdea(){
	onoff = true;
	$(".c-ctn").stop().fadeIn(100);
}

//关闭评价框
function closePingJia(){
	$(".c-ctn").stop().fadeOut(100);
}
//关闭窗口
function closeParentPage() {
	window.top.postMessage('{"cmdNum":"10002","time":"'+new Date().getTime()+'"}', "*"); 
}
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r != null) return unescape(r[2]); return null; //返回参数值
}
