
$(function() {
	
	
	//iCheck
	$("input[type=radio]").iCheck({ 
		radioClass: 'iradio_flat-blue', 
		checkedRadioClass: 'checked',
	});
	
	
	//.body高度设置
	function setBodyHeight() {
		var ctnH = $(".container").height() - 50;
		$(".body").height(ctnH - $(".header").outerHeight());
	}
	
	//.bodyLeft宽度设置
	function setBodyLeftWidth() {
		var bodyW = $(".body").width();
		$(".bodyLeft").width(bodyW - $(".bodyRight").width());
	}
	
	//.b-r-body高度设置
	function setBodyRightHeight() {
		var bodyH = $(".bodyRight").height()
		$(".b-r-body").height(bodyH - $(".b-r-header").outerHeight());
	}
	
	//.psBarC的高度
	function setpsBarCHeight() {
		var bodyLeftH = $(".bodyLeft").height();
		$(".psBarC").height(bodyLeftH - $(".bodyFooter").outerHeight());
	}
	
	//顺序不能乱
	setBodyHeight();
	setpsBarCHeight();
	setBodyRightHeight();
	setBodyLeftWidth();
	//浏览器缩放
	$(window).resize(function() {
		setBodyHeight();
		setpsBarCHeight();
		setBodyRightHeight();
		setBodyLeftWidth();
	});
	
	//右侧选项卡切换
	$(".b-r-h-ctn div").each(function(i) {
		$(this).on("click", function() {
			$(this).addClass("click").siblings(":not(.contact)").removeClass("click");
			$(".b-r-body div").eq(i).stop().fadeIn(100).siblings(":not(.contact)").stop().hide();
		});
	});
	
	(function() {
		//关闭窗口
		$(".h-r-close").click(function() {
			$(".cl-ctn").stop().fadeIn(100);
		});
		$(".cl-ctn").click(function() {
			$(this).stop().fadeOut(100);
		});
		$("#cl-yes").click(function() {
			$(".cl-ctn").stop().fadeOut(100, function() {
				CloseWebPage();
			});
		});
		$("#cl-no").click(function() {
			$(".cl-ctn").stop().fadeOut(100);
		});
		$("#close").click(function(e) {
			var oe = e || event;
			oe.stopPropagation();
		});
	})();
	
	//关闭浏览器兼容
	function CloseWebPage() {
	    if (navigator.userAgent.indexOf("MSIE") > 0) {
	        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
	            window.opener = null;
	            window.close();
	        } else {
	            window.open('', '_top');
	            window.top.close();
	        }
	    } else if (navigator.userAgent.indexOf("Firefox") > 0) {
	        window.location.href = 'about:blank ';
	    } else {
	        window.opener = null;
	        window.open('', '_self', '');
	        window.close();
	    }
	}
	
	
})












































