/* util */

//兼容ie
if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  };
}

//判断ie
function isIE(ver){
    var b = document.createElement('b');
    b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
    return b.getElementsByTagName('i').length === 1;
}

//缓动框架 start
function onMove(obj, json, iSpeed, fn) {
    var timer = null;
    var num = 0;
    var iCur = 0;
    var attr = "";
    var iTarget = 0;
    var onoff = true;
    clearInterval(obj.timer);
    obj.timer = setInterval(function() {
        var onoff = true;
        for (var attr in json) {
            iTarget = json[attr];
            if (attr == "opacity") {
                iCur = parseFloat(getStyle(obj, attr)).toFixed(2) * 100;
            } else {
                iCur = parseInt(getStyle(obj, attr));
            }
            if (iCur < iTarget) {
                num = Math.ceil((iTarget - iCur) / iSpeed);
            } else {
                num = Math.floor((iTarget - iCur) / iSpeed);
            }
            if (iCur != iTarget) {
                onoff = false;
            }
            if (attr == "opacity") {
                obj.style[attr] = (iCur + num) / 100;
            } else {
                obj.style[attr] = iCur + num + "px";
            }
        }
        if (onoff) {
            clearInterval(obj.timer);
            if (fn) {
                fn();
            }
        }
    },
    20);
}
function getStyle(obj, attr) {
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
}
//缓动框架 end

//得url参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r !== null) return unescape(r[2]); return null; //返回参数值
}

//得cookies
function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name)==0) return c.substring(name.length,c.length);
	}
	return "";
}
/* util */

var groupIID = '0';

var hidesetting = {
	view: {
		dblClickExpand: false,
		showIcon: false
	},
	data: {
		simpleData : {
		enable : true,
		idKey : "id",
		pIdKey : "parentId",
		rootPId : 0
		},
		key : {
			name : "name"
		}
	},
	async : {
		enable : true,
		url : "/servlet/AQ?s=zstree&act=lc&orderType=2",
		autoParam : ["id"],
		dataFilter : function(treeId, parentNode, responseData) {
			if (responseData) {
				//responseData = JSON.parse(responseData);
				if (responseData.returnMaps) {
					if (responseData.status == -1) {
						alert(responseData.message);
					}
					responseData.returnMaps.classes.push({
						id: 0,
						parentId: 0,
						name: "全部分类",
						open: true
					});
					return responseData.returnMaps.classes;
				} else {
					return responseData;
				}
			}
			return responseData;
		}
	},
	callback: {
		onClick: function(){
			var zTree = $.fn.zTree.getZTreeObj('treeHide');
			Nodes = zTree.getSelectedNodes();
			$('#queSel').html(Nodes[0].name);
			$('#menuContent').fadeOut("fast");
			groupIID = Nodes[0].id;
			sQue(1);
		},
		beforeClick:function(treeId, treeNode, clickFlag) {
			//return !treeNode.isParent;//当是父节点 返回false 不让选取
			if(treeNode.isParent===true){
				$('#search_Que input[name=isLeaf]').val(0);
			}else{
				$('#search_Que input[name=isLeaf]').val(1);
			}
		}
	}
};

function showMenu() {
	var cityObj = $("#queSel");
	var cityOffset = $("#queSel").offset();
	$("#menuContent").slideDown("fast");
	$("body").bind("mousedown", onBodyDown);
	$('#classTree').slimScroll({
		height: '300px'
	});
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}

function sQue(pageNo){
	if(!pageNo)pageNo=1;
	var bbb = '';
	if($('#sword').val() != '') {
	bbb = '&question='+$('#sword').val()
	}
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('/servlet/AQ?s=zstree&act=lq&pageSize=10&pageNo='+pageNo+'&groupId='+groupIID+bbb),
		success:
		function(data){
			//data = JSON.parse(data);
			if(data.status===0){
				data.questionList = data.returnMaps.list;
				if(data.questionList.length>0){
					var html = "";
					for(var i=0;i<data.questionList.length;i++){
						html += '<div class="MN_queList"><span class="MN_queListIndex">'+(i+1)+' </span><span class="MN_guideQue" title="'+data.questionList[i].question+'">'+data.questionList[i].question+'</span></div>';
					}
					$('#hotZeroContent').html(html);
					$("#pageList").bootstrapPaginator({
						data: [data.returnMaps, 'list', 'total'],
						currentPage: data.returnMaps.currentPage,
						totalPages: data.returnMaps.totlePages,
						onPageClicked: function (event, originalEvent, type, page) {
							sQue(page);
						}
					});
					autoHeight();
          $(window).trigger('resize.$')
				}else{
					if($('#sword').val() !==''){
						$('#hotZeroContent').html('<div style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;搜索结果为空！</div>');
					} else {
						$('#hotZeroContent').html('<div style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</div>');
					}
					$('#pageList').html('');
				}
			}
		}
	});
}

function autoHeight() {
	$('.hotZeroWrapper').height($('#showhotzero').outerHeight()-$('#searchWrapper').outerHeight()-$('#pageList').outerHeight()-30);
}

var _Layindex = null;
var _BOTTOMLENGTH = 20;
$(function() {
	$("#menuContent").hide();
    //初始化聊天框高度
	var winH = $(window).height();
	if (winH < 835 && winH > 540) {
		$('.container').height(winH - 40 - 1 - _BOTTOMLENGTH);
		$('.content').height(winH - 100 - 1 - _BOTTOMLENGTH);
		$('.writeRoot').height(winH - 295 - 1 - _BOTTOMLENGTH);
		$('.contentRight').height(winH - 100 - 1 - _BOTTOMLENGTH);
		$('.robot_hot').height(winH- 140 - 1 - _BOTTOMLENGTH);
		$('html').height(winH - 40 - 1);
		$('body').height(winH - 40 - 1);
	} else if (winH >= 835) {
		$('html').height(winH - 40);
		$('body').height(winH - 40);
		$('.container').height(795 - _BOTTOMLENGTH);
		$('.content').height(735 - _BOTTOMLENGTH);
		$('.writeRoot').height(541 - _BOTTOMLENGTH);
		$('.contentRight').height(735 - _BOTTOMLENGTH);
		$('.robot_hot').height(695 - _BOTTOMLENGTH);
	}
	autoHeight();

	document.getElementById('weblogo').onload = function() {
		$('.robot_top_name').css('left', $('#weblogo').width() + 40);
	};

	//调用表情插件
    var Face = $('#message').face({
        src: 'src/dang/',//表情路径
        rowNum: 6,//每行最多显示数量，此属性不适用于常用语
		btnAttr: [20, 5, 20, 20],
		ctnAttr: [0, 40, 70, 70],
        targetEl: $("#faceRoot"),
        triggerEl: $("#faceBtn"),
        hideAdv: true,
        callback: function() {
			$('#sendBtn').trigger('click');
        }
    });
	//调用自动补全插件
	$("#message").autocomplete({
		url: '/servlet/AQ?s=ig',
		targetEl: $("#faceRoot"),
		posAttr: [0, 5],
		itemNum: 10,
		callback: function(data) {
			$("#sendBtn").trigger('click');
		}
	});
    
	var sysNum = getUrlParam('sysNum');
	var sourceId = getUrlParam('sourceId');
	//调用faqrobot插件
	var FAQ = new Faqrobot({
		//客户唯一标识
		sysNum: sysNum?sysNum:'dd_1000',
		sourceId: sourceId?sourceId:'10',
		//jid: 0,//自定义客服客户图标
		//robotName: 'FaqRobot',//机器人名称
		logoUrl: 'robot/skin/robotDDi/images/head.png',
		//logo地址
		logoId: 'weblogo',
		//logo地址
		//userInfoId: 'userInfoId',//用户信息Id
		kfPic: 'robot/skin/robotDDi/images/head.png',
		//客服图标
		khPic: 'robot/skin/robotDDi/images/head_user.png',
		//客户图标
		kfHtml: ['<div class="MN_answer"><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%helloWord%</div><div class="MN_kftime">%formatDate%</div></div>', //欢迎语组合
		'<div class="MN_helpful"><span class="MN_is">以上内容是否解决了您的问题？</span><span class="MN_reasonSend">提交</span><span class="MN_yes" title="解决"></span><span class="MN_no" title="未解决"></span></div>', //是否满意组合
		'<div class="MN_answer" aId="%aId%" cluid="%cluid%"><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%ansCon%%gusListHtml%%relateListHtml%%commentHtml%</div><div class="MN_kftime">%formatDate%</div></div>' //回答组合
		],
		//客服结构(所有的属性和%xxx%都必须存在)
		newQueId: 'showhottwo',
		topQueId: 'showhotone',
		//热门、常见问题Id
		chatCtnId: 'chatContent',
		//聊天展示Id y
		inputCtnId: 'message',
		//输入框Id y
		sendBtnId: 'sendBtn',
		//发送按钮Id y
		tipWordId: 'hdnTipWord',
		//输入框提示语Id
		tipWord: '请输入您要咨询的问题',
		//输入框提示语
		remainWordId: 'hdnWord',
		//remainWordNum: '100',
		commentFormId: 'feedbackForm',
		//评论框formId
		commentInputCtnId: 'cont',
		//评论输入框Id
		commentSendBtnId: 'fadeBackId',
		//评论发送按钮Id
		commentTipWordId: 'hdnCommentTip',
		//评论输入框提示语Id
		commentTipWord: '描述您的意见和建议，以便我们提升服务水平和质量，谢谢您',
		//评论输入框提示语
		clearBtnId: 'clearBtn',
		//清除按钮Id
		closeBtnId: 'closeBtn',
		//关闭聊天页面
		ajaxType: 'get',
        faceModule: {//表情模块
            open: true,//是否启用功能
            faceObj: Face,//表情插件实例
        },
		noView: ['.MN_kfImg', '.MN_khImg'],
		formatDate: '%year%-%month%-%date% %hour%:%minute%:%second%', //配置时间格式(默认10:42:52 2016-06-24)
		autoOffline: false,
		commentCallback: function(data) {//评论后的回调
		    if(!data.status) {
		        if(+$('[name=level]:checked').val()) {//满意
		            layer.msg('能帮到您小当好开心的呢，我会继续努力的哦^_^');
		        }else {
		            layer.msg('没有让您满意小当感到万分心痛，我会继续学习~');
		        }
				layer.close(_Layindex);
		    }
		},
		helpfulModule: {//答案满意度模块
            open: true,//是否启用功能
            yesCallback: function($obj) {//满意的回调
                $obj.text('感谢您的评价！');
            },
            noCallback: function($obj) {//不满意的回调
                if(window.uselessReasonItems) {
                    if(window.uselessReasonItems[0]) {
                        $('.MN_reasonSend', $obj).css('display', 'inline-block').siblings().hide();

                        var html = '';
                        for(var i=0; i<window.uselessReasonItems.length; i++) {
                            var checked = '';
                            if(!i) {
                                checked = 'checked';
                            }
                            html += '<div class="MN_reasonItem"><input id="MN_reason'+ i +'" type="radio" value="'+ window.uselessReasonItems[i].tId +'" name="reasonType" '+ checked +'><label for="MN_reason'+ i +'">'+ window.uselessReasonItems[i].reason +'</label></div>';
                        }
                        $obj.before('<form class="MN_reasonForm"><div class="MN_reasonCtn"><p class="MN_reasonTitle">非常抱歉没能解决您的问题，请反馈未解决原因，我们会根据您的反馈进行优化与完善！</p>'+ html +'<div class="MN_reasonContent"><textarea name="content" placeholder="您的意见"></textarea></div></div></form>');
                    }else {
                        $obj.text('感谢您的评价！');
                    }
                }else {
                    $obj.text('感谢您的评价！');
                }
            }
        },
		initCallback: function(data) {
			if(data.uselessReasonItems) {
				window.uselessReasonItems = data.uselessReasonItems;
			}
			//知识库
			$.fn.zTree.init($("#treeHide"),hidesetting,[]);
			sQue(1);
		}
	});
	
	//调用滚动条插件
	$('.hotZeroWrapper').scrollbar({
		autoBottom: false
	});

	//聊天框右侧四栏的切换
	$(".contentRight .navRow").on('mouseover', function() {
		var self = this;
		var end = 0;
		var endTime = '5';
		if ($(self).is('#hotzero')) {
			end = 0;
		} else if ($(self).is('#hotone')) {
			end = 116;
		} else if ($(self).is('#hottwo')) {
			end = 232;
		}
		//鼠标悬浮如果超过200ms滑动,否则不滑动
		var timer = setInterval(function() {
			if(!isIE(8)) {
				if($(self).filter(':hover').length > 0){
					if ($(self).hasClass("navRowOn")) {
						return;
					} else {
						$(".contentRight div").removeClass("navRowOn");
						$("#show" + $(self).attr("id")).siblings('.robot_hot').hide();
						$(self).addClass("navRowOn");
						$("#show" + $(self).attr("id")).show();
						$('#slider').stop().animate({left:end}, endTime);
					}
				}
			} else {
				if ($(self).hasClass("navRowOn")) {
					return;
				} else {
					$(".contentRight div").removeClass("navRowOn");
					$("#show" + $(self).attr("id")).siblings('.robot_hot').hide();
					$(self).addClass("navRowOn");
					$("#show" + $(self).attr("id")).show();
					$('#slider').css('left', end);
				}
			}
			clearInterval(timer);
		}, 100);
	});

	//聊天框右上角×号关闭
	$(".robot_top_cross").on('click', function() {
		if (confirm('确定要退出吗？')) {
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
	});

	//聊天框小提示变化
	$(".Panel_word").on('mouseenter mouseleave', function(event) {
		if (event.type == "mouseenter") {
			//鼠标悬浮如果超过300ms显示,否则不显示
			var timer = setInterval(function() {
				if($('.Panel_word:hover').length > 0){
					$(".popTips:not(:animated)").fadeIn();
				}
				clearInterval(timer);
			}, 300);
		} else if (event.type == "mouseleave") {
			//鼠标离开
			$(".popTips:not(:animated)").fadeOut();
		}
	});
    //聊天框小提示关闭
	$(".popClose").on('click', function() {
		$(".popTips").hide();
	});

    //聊天框意见反馈弹窗单选框优化
	$('input[type=radio]').add('input[type=checkbox]').iCheck({
		checkboxClass: 'icheckbox_square-red',
		radioClass: 'iradio_square-red',
		cursor: true
	});

	//聊天框意见反馈切换
	/*$("#rdoGood").on('ifChecked',
	function() {
		$("#hid").hide();
	});
	$("#rdoBad").on('ifChecked',
	function() {
		$("#hid").show();
	});*/

	//聊天框意见反馈
	$("#love").on('click', function() {
		_Layindex = layer.open({
			type: 1,
			title: "满意度评价",
			skin: 'layui-layer-rim',
			//加上边框
			area: ['400px', '335px'],
			//宽高
			content: $(".fadeBackContent")
		});
	});

	//聊天框调节字号和字号功能
	$("body").on('click', function() {
		$(".popFont").hide();
	});
	$("#font").on('click', function(event) {
		$(".popFont").show();
		event.stopPropagation();
	});
	$(".popFont").on('click', function(event) {
		event.stopPropagation();
	});
	$("#fonts").on('change', function() {
		$(".writeRoot").css("font-size", $("#fonts").val());
		$("#message").css("font-size", $("#fonts").val());
		FAQ.scrollbar.update();
		FAQ.scrollbar.scrollTo('bottom', 1);
	});
	$("#fontf").on('change', function() {
		$(".writeRoot").css("font-family", $("#fontf").val());
		$("#message").css("font-family", $("#fontf").val());
		//$(".popFont").hide();
	});

	//聊天框小提示切换
	var oul = document.getElementById("tipMsg");
	$('.imgRight').on('click', function() {
		var arr = [];
		for (var i = 0; i < oul.childNodes.length; i++) {
			if (oul.childNodes[i].nodeType == 1) {
				arr.push(i);
			}
		}
		var serial = $(oul.childNodes[arr[0]]).attr('orderT');
		if (serial == '5') {
			$('.lPic img').attr('src', 'skin/robotDDi/images/tips1.png');
		} else {
			$('.lPic img').attr('src', 'skin/robotDDi/images/tips' + (serial * 1 + 1) + '.png');
		}
		onMove(oul, {left: -260},10, function() {
			oul.appendChild(oul.childNodes[arr[0]]);
			oul.style.left = "0px";
		});
	});
	$('.imgLeft').on('click', function() {
		var arr = [];
		for (var i = 0; i < oul.childNodes.length; i++) {
			if (oul.childNodes[i].nodeType == 1) {
				arr.push(i);
			}
		}
		var serial = $(oul.childNodes[arr[arr.length - 1]]).attr('orderT');
		$('.lPic img').attr('src', 'skin/robotDDi/images/tips' + serial + '.png');
		oul.insertBefore(oul.childNodes[arr[arr.length - 1]], oul.childNodes[1]);
		oul.style.left = "-260px";
		onMove(oul, {left: 0},10);
	});

	//聊天框小提示按钮颜色变化
	$(".popClose").on('mouseover mouseout', function(event) {
		if(event.type == "mouseover") {
			$(this).css('color', '#FF2832');
		} else if(event.type == "mouseout") {
			$(this).css('color', 'rgb(198, 198, 198)');
		}
	});

	//聊天框图片按钮颜色变化
	$("#faceBtn").on('mouseover mouseout', function(event) {
		if (event.type == "mouseover") {
			//鼠标悬浮
			$(this).attr('class', 'icon-bq_hover');
		} else if (event.type == "mouseout") {
			//鼠标离开
			$(this).attr('class', 'icon-bq_normal');
		}
	});
	$("#font").on('mouseover mouseout', function(event) {
		if (event.type == "mouseover") {
			//鼠标悬浮
			$(this).attr('class', 'icon-font_hover');
		} else if (event.type == "mouseout") {
			//鼠标离开
			$(this).attr('class', 'icon-font_normal');
		}
	});
	$("#love").on('mouseover mouseout', function(event) {
		if (event.type == "mouseover") {
			//鼠标悬浮
			$(this).attr('class', 'icon-my_hover');
		} else if (event.type == "mouseout") {
			//鼠标离开
			$(this).attr('class', 'icon-my_normal');
		}
	});
	$("#trash").on('mouseover mouseout', function(event) {
		if (event.type == "mouseover") {
			//鼠标悬浮
			$(this).attr('class', 'icon-clear_hover');
		} else if (event.type == "mouseout") {
			//鼠标离开
			$(this).attr('class', 'icon-clear_normal');
		}
	});
	$(".Panel_word").on('mouseover mouseout', function(event) {
		if (event.type == "mouseover") {
			//鼠标悬浮
			$('#skill').attr('class', 'icon-tips_hover');
		} else if (event.type == "mouseout") {
			//鼠标离开
			$('#skill').attr('class', 'icon-tips_normal');
		}
	});
	$("#tipToLeft").on('mouseover mouseout', function(event) {
		if (event.type == "mouseover") {
			//鼠标悬浮
			$(this).attr('class', 'icon-tips_left_hover');
		} else if (event.type == "mouseout") {
			//鼠标离开
			$(this).attr('class', 'icon-tips_left_normal');
		}
	});
	$("#tipToRight").on('mouseover mouseout', function(event) {
		if (event.type == "mouseover") {
			//鼠标悬浮
			$(this).attr('class', 'icon-tips_right_hover');
		} else if (event.type == "mouseout") {
			//鼠标离开
			$(this).attr('class', 'icon-tips_right_normal ');
		}
	});
	$("body").on('mouseover mouseout', '.MN_yes img', function(event) {
		if (event.type == "mouseover") {
			//鼠标悬浮
			$(this).css('opacity', '0.5');
		} else if (event.type == "mouseout") {
			//鼠标离开
			$(this).css('opacity', '1');
		}
	});
	$("body").on('mouseover mouseout', '.MN_no img', function(event) {
		if (event.type == "mouseover") {
			//鼠标悬浮
			$(this).css('opacity', '0.5');
		} else if (event.type == "mouseout") {
			//鼠标离开
			$(this).css('opacity', '1');
		}
	});

    //聊天框窗口高度变化
	$(window).on('resize.$', function() {
		var winW = $(window).width(),
			winH = $(window).height(),
			HEIGHT = 1;
		if (winH <= 836 && winH > 540) {
			$('html').height(winH - 40 - HEIGHT);
			$('body').height(winH - 40 - HEIGHT);
			$('.container').height(winH- 40 - HEIGHT - _BOTTOMLENGTH);
			$('.content').height(winH - 100 - HEIGHT - _BOTTOMLENGTH);
			$('.writeRoot').height(winH - 295 - HEIGHT - _BOTTOMLENGTH);
			$('.contentRight').height(winH - 100 - HEIGHT - _BOTTOMLENGTH);
			$('.robot_hot').height(winH- 140 - HEIGHT - _BOTTOMLENGTH);
		} else {
			if (winH <= 540) {
				$('html').height(836);
				$('body').height(795);
			} else if (winH > 836) {
				$('html').height(winH - 40);
				$('body').height(winH - 40);
			}
			$('.container').height(795 - _BOTTOMLENGTH);
			$('.content').height(735 - _BOTTOMLENGTH);
			$('.writeRoot').height(541 - _BOTTOMLENGTH);
			$('.contentRight').height(735 - _BOTTOMLENGTH);
			$('.robot_hot').height(695 - _BOTTOMLENGTH);
		}
		autoHeight();
	});
});