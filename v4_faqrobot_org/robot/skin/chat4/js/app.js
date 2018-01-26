
$(function() {
	
	
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
	
	//.psBarC的高度
	function setpsBarCHeight() {
		var bodyLeftH = $(".bodyLeft").height();
		$(".psBarC").height(bodyLeftH - $(".bodyFooter").outerHeight());
	}
	
	//.bodyLeft宽度设置
	function setBodyLeftWidth() {
		var bodyW = $(".body").width();
		$(".bodyLeft").width(bodyW - $(".bodyRight").width());
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
	$('.b-r-header [data-tab]').on('click', function() {
		$(this).addClass("click").siblings().removeClass("click");
		$('.b-r-body [data-tab='+ $(this).attr('data-tab') +']').show().siblings().hide();
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

	//调用自动补全插件
	$('.input').autocomplete({
	    url: 'servlet/AQ?s=ig',//[string]
	    //prefix: 'http://d3.faqrobot.org/',//[string]
	    //url: 'servlet/AQ?s=ig',//[string]
	    //jsonp: true,//是否跨域
	    targetEl: $('.inputCtn'),//参照物(用于appendTo和定位)
	    posAttr: ['0px', '100px'],//外边框的定位[left bottom]
	    itemNum: 10,//[int] 默认全部显示
	    callback: function(data) {//获取文本后的回调函数
	        $('.sendBtn').trigger('click');
	    }
	});

	//调用表情插件
	var Face = $('.textarea').face({
	    src: 'src/yun/',//表情路径
	    open: false,
	});

	//faqrobot
	var FAQ = new Faqrobot({
	    //sysNum: 1000000,//客户唯一标识
	    //jid: 0,//自定义客服客户图标
	    //robotName: 'FaqRobot',//机器人名称
	    logoUrl: 'robot/skin/chat4/images/logo.png',//logo地址 ----------
	    logoId: 'weblogo',// ----------
	    webNameId: 'title',//公司名称Id
	    intelTitleChange: true,// 智能聊天是否修改标题
	    intelTitle: '',// 智能聊天时的标题
	    artiTitleChange: true,// 人工时是否修改标题
	    artiTitle: '人工客服',// 人工时的标题
        titleInsteadId: 'titles',// 代替标题Id
	    //userInfoId: 'userInfoId',//用户信息Id
    	webInfoId: 'webInfoId',//公司简介Id
	    kfPic: 'robot/skin/chat4/images/robot.png',  //客服图标
	    khPic: 'robot/skin/chat4/images/user.png', //客户图标
	    formatDate: '%month%月%date%日 %hour%:%minute%:%second%',//配置时间格式(默认10:42:52 2016-06-24)
	    topQueId: 'commonQue',//热门、常见问题Id --------
	    //newQueId: 'newQueId',//新增问题Id
	    //recommendQueId: 'recommendQueId',//推荐问题Id
	    quickServId: 'quickLink',//快捷服务Id
	    //recommendLinkId: 'recommendLinkId',//推荐咨询Id
	    //maxQueNum: 100,//最多展示问题条数
	    //maxQueLen: 100,//最多展示问题字数
	    //showMsgId: 'showMsgId',//展示信息Id
	    chatCtnId: 'left_content',//聊天展示Id y   --------------
	    inputCtnId: 'sendtxt',//输入框Id y   --------
	    sendBtnId: 'inputPR',//发送按钮Id y   ------
	    tipWordId: 'inputTip',//输入框提示语Id ----
	    //tipWord: '请输入您要咨询的问题',//输入框提示语
	    remainWordId: 'wordremain',
	    remainWordNum: '100',
	    commentFormId: 'c-form',//评论框formId -------
	    commentInputCtnId: 'c-textarea',//评论输入框Id ----
	    commentSendBtnId: 'submit',//评论发送按钮Id ---------
	    commentTipWordId: 'feedBackTip',//评论输入框提示语Id
	    //commentTipWord: '描述您的意见和建议，以便我们提升服务水平和质量，谢谢您',//评论输入框提示语
	    /*artiSearchId: 'artiSearch',//智能搜索
	    artiSearchCallback: function(data) {
	        if(data.fullTextSearch) {
	            $('.artiSearch').removeClass('artiSearchHide');
	            $('.itemCtn').css('width', '25%');
	            $('.itemHead4').trigger('click');
	        }else {
	            $('.artiSearch').addClass('artiSearchHide');
	            $('.itemCtn').removeAttr('style');
	            if($('.itemHead4').is('.itemHeadFocus')) {
	                $('.itemHead1').trigger('click');
	            }else {
	                $('#artiSearch').hide();
	            }
	        }

	    },*/
	    //leaveMsgFormId: 'leaveMsgForm',//留言框formId ---------
	    //leaveMsgInputCtnId: 'leaveMsgCtn',//留言输入框Id ---------
	    //leaveMsgSendBtnId: 'leaveMsgBtn',//留言发送按钮Id --------
	    //leaveMsgTipWordId: 'leaveMsgTipWordId',//留言输入框提示语Id
	    //leaveMsgTipWord: '输入您的建议，我们会尽快为您处理！',//留言输入框提示语
        leaveQue: {// 未知问题已回复
            open: true,//是否启用功能
        },
	    autoSkip: {//手机不能访问pc页面
	        open: true,//是否启用功能
	        chatUrl: 'h5chat',// 默认跳转的页面
	    },
	    clearBtnId: 'clearScreen',//清除按钮Id
	    closeBtnId: 'h-r-close',//关闭聊天页面
	    //poweredCtnId: 'poweredCtnId',//技术支持Id
	    //thirdUrl: '',//未登录第三方账户，跳转至此链接
	    //sourceId: 0,//客户来源
	    //ajaxType: 'get',
	    //jsonp: true,//是否跨域
	    //prefix: 'http://d3.faqrobot.org/',//地址前缀(可能是绝对路径)
	    faceModule: {//表情模块
	        open: true,//是否启用功能
	        faceObj: Face,//表情插件实例
	    },
	    poweredCtnId: 'adv',//技术支持Id
	    sendcallback: function() {//点击发送按钮的回调
	    },
	    commentCallback: function() {//评论后的回调
	    },
	    leaveMsgCallback: function() {//评论后的回调
	    },
	});

	//icheck
	$('[type=radio]').iCheck({
	    checkboxClass: 'icheckbox_square-blue',
	    radioClass: 'iradio_square-blue',
	});
	
	// 人工评价
	$('body').on('click', '.RG_commentBtn', function() {
        window.uuid = $(this).attr('uuid');// 客服要求客户评价
	    $('#fadeBackIdLink').trigger('click');
	});

})












































