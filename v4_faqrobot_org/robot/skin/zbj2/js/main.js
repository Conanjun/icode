
$(function() {
	
	
	
	
	
	//左右折叠按钮背景高度
	function setCloseRightHeight() {
		var psBarCH = $(".psBarC").outerHeight();
		$(".closeRight").height(psBarCH);
	}
	
	(function() {
		//箭头图标切换
		var onoff = true;
		$(".closeRight").hover(function() {
			if(onoff) {
				$("span", this).removeClass().addClass("arrow arrowRightOn");
			} else {
				$("span", this).removeClass().addClass("arrow arrowLeftOn");
			}
		}, function() {
			if(onoff) {
				$("span", this).removeClass().addClass("arrow arrowRight");
			} else {
				$("span", this).removeClass().addClass("arrow arrowLeft");
			}
			
		});
		
		$(".closeRight").click(function() {
			if(onoff) {
				$(".bodyLeft").animate({"width":"100%"}, 100);
				$(".bodyRight").animate({"width":"0%"}, 100);
			} else {
				$(".bodyLeft").animate({"width":"75%"}, 100);
				$(".bodyRight").animate({"width":"25%"}, 100);
			}
			onoff = !onoff;
		});
	})();
	
	
	

	
	//iCheck
	$("input[type=radio]").iCheck({ 
		radioClass: 'iradio_flat-blue', 
		checkedRadioClass: 'checked',
	});
	
	//.body高度设置
	function setBodyHeight() {
		var ctnH = $(".container").height();
		$(".body").height(ctnH - $(".header").outerHeight());
	}
	//.b-r-body高度设置
	function setBodyRightHeight() {
		var bodyH = $(".bodyRight").height();
		$(".b-r-body").height(bodyH - $(".b-r-header").outerHeight());
	}
	
	// //.psBarC的高度
	// function setpsBarCHeight() {
	// 	var bodyLeftH = $(".bodyLeft").height();
	// 	$(".psBarC").height(bodyLeftH - $(".bodyFooter").outerHeight());
	// }
	//bodyLeftTop的高度
	function setpsBarCHeight() {
		var bodyLeftH = $(".bodyLeft").height();
		$(".bodyLeftTop").height(bodyLeftH - $(".bodyFooter").outerHeight());
	}

	//.bodyLeft宽度设置
	function setBodyLeftWidth() {
		var bodyW = $(".body").width();
		$(".bodyLeft").width(bodyW - $(".bodyRight").width());
	}
	
	//顺序不能乱
	setBodyHeight();
	setpsBarCHeight();
	setCloseRightHeight();
	setBodyRightHeight();
	// setBodyLeftWidth();
	
	//浏览器缩放
	$(window).resize(function() {
		setBodyHeight();
		setpsBarCHeight();
		setCloseRightHeight();
		setBodyRightHeight();
		// setBodyLeftWidth();
		
		var window_width = window.innerWidth
			|| document.documentElement.clientWidth
			|| document.body.clientWidth;
		var l = (screen.width - 870) / 2; 
		var t = (screen.height - 600) / 2; 
		if(window_width < 800) {
			setTimeout(function() {
				window.resizeTo(870, 600);
				window.moveTo(l, t);
			}, 100);
		}else{
		}
	});
	
	//右侧选项卡切换
	$(".b-r-h-ctn div").each(function(i) {
		$(this).on("click", function() {
			$(this).addClass("click").siblings().removeClass("click");
			$(".b-r-body div").eq(i).stop().fadeIn(100).siblings().stop().hide();
		});
	});
	
	(function() {
		//评论弹框
		var onoff = true;
		$(".comment").click(function() {
			onoff = true;
			$(".c-ctn").stop().fadeIn(100);
		});

		$(".c-ctn").click(function() {
			if(onoff) {
				$(this).stop().fadeOut(100);
			}else {
				$(this).stop().fadeOut(100, function() {
					CloseWebPage();
				});
			}
		});
		$("#submit").click(function() {
			if(onoff) {
				$(".c-ctn").stop().fadeOut(100);
			}else {
				$(".c-ctn").stop().fadeOut(100, function() {
					CloseWebPage();
				});
			}
		});
		$("#cancel").click(function() {
			if(onoff) {
				$(".c-ctn").stop().fadeOut(100);
			}else {
				$(".c-ctn").stop().fadeOut(100, function() {
					CloseWebPage();
				});
			}
		});
		
		$("#comment").click(function(e) {
			e.stopPropagation();
		});
		
		//图片预览
	
	$('body').on('click','img',function(){
		clearTK();
		var bgBox=$('<div/>').addClass('mskeLayBg').appendTo($('body'));
		var conBox=$('<div/>').addClass('mskelayBox').appendTo($('body'));
		var closeBox=$('<div/>').addClass('mskeClose').appendTo($('body'));
		var childBox=$('<div/>').addClass('mske_html').html('<img src="'+$(this).attr('src')+'">').appendTo(conBox);	
		var obj=$('body .mskelayBox img');
		if(obj.width()>800){
			$('body .mskelayBox').css('margin-left','-400px');
		}else{
			$('body .mskelayBox').css('margin-left','-'+obj.width()/2+'px');
			$('body .mskelayBox').css('margin-top','-'+obj.height()/2+'px')	
		}
		if(obj.height()>800){
			$('body .mskelayBox').css('margin-top','-400px');
		}else{
			$('body .mskelayBox').css('margin-left','-'+obj.width()/2+'px');
			$('body .mskelayBox').css('margin-top','-'+obj.height()/2+'px')	
		}
	})
	$('body').on('click','.mske_html img,.mskeClose,.mskeLayBg',function(){
		clearTK();
	})
	function clearTK(){
		$('body .mskeLayBg').remove();
		$('body .mskelayBox').remove();
		$('body .mskeClose').remove();
	}
	

		//关闭窗口
		$(".h-r-close").click(function() {
			$(".cl-ctn,.closeMask").stop().fadeIn(100);
		});
		$(".cl-ctn").click(function() {
			$(".cl-ctn,.closeMask").stop().fadeOut(100);
		});
		$("#cl-yes").click(function() {
			onoff = false;
			$(".cl-ctn,.closeMask").stop().fadeOut(100, function() {
				$(".c-ctn").stop().fadeIn(100);
			});
			CloseWebPage();
		});
		$("#cl-no").click(function() {
			$(".cl-ctn,.closeMask").stop().fadeOut(100);
		});
		$("#close").click(function(e) {
			e.stopPropagation();
		});
	})();
	
	
	//关闭浏览器兼容

function CloseWebPage(){
 if (navigator.userAgent.indexOf("MSIE") > 0) {
	alert('ie');
  if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
   window.opener = null;
   window.close();
  } else {
   window.open('', '_top');
   window.top.close();
  }
 }
 else if (navigator.userAgent.indexOf("Firefox") > 0) {
	 alert('foxfire');
  window.location.href = 'about:blank ';
 } else {
  window.opener = null;
  window.open('', '_self', '');
  window.close();
 }
}
	
	
})














































