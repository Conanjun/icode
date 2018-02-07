/* util */
//转小能人工的配置参数
var XN_param = {
	siteid : encodeURIComponent('dd_1000'),
	sellerid : encodeURIComponent('dd_1001'),
	settingid : encodeURIComponent('dd_1000_9999'),
	baseuri : encodeURIComponent('http://nt-download.imip.dangdang.com/js/b2b/update/copydir/'),
	uid : encodeURIComponent('12323'),
	uname : encodeURIComponent('eminyli@163.com'),
	ref : encodeURIComponent(window.location.href),
	tit : encodeURIComponent(document.title),
}

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

//最近订单列表
function dangdangOrders(pageIndex) {
	if(!pageIndex)pageIndex = 1;
	var sessionID = getCookie('sessionID');
	//如果是h5
	if(getUrlParam('productId') != null) {
		$('#hotzero').html('商品详情');
		$('#showhotzero').empty().html('<iframe id="iframeCtn" class="iframeClass" src="" frameborder="0"></iframe>');
		$('#iframeCtn').attr({'src': 'http://product.dangdang.com/robot/'+getUrlParam('productId')+'.html'});
		return;
	}
	//每次查询先清空订单物流信息
	orderLogistics = [];
	$.getJSON('/DdwQuery/loginCheck?sessionID='+sessionID, function (data) {
		if(data.isLogin) {
			custId = data.customerId;
			if(custId) {
				$.ajax({
					type:'post',
					cache:false,
					datatype:'json',
					url:'/DdwQuery/getDDOrders',
					data: {
						custId:custId,
						pageIndex:pageIndex,
						pageSize:10
					},
					success: function(data){
						if(data.status === 0) {
							data = JSON.parse(data.result);
							if(data.orders && data.orders[0]) {
								var order = data.orders;
								var orderHTML = [];
								var orderStatus = '';
								orderHTML.push('<div class="order">');
								for(var i in order) {
									if(order[i].logisticsInfo) {
										var orderLogisticsItem = [];
										for(var j in order[i].logisticsInfo) {
											orderLogisticsItem.push('<p style="color:#999;font-size: 14px;margin:5px;">'+order[i].logisticsInfo[j].time+'&nbsp;&nbsp;&nbsp;'+order[i].logisticsInfo[j].info+'</p>');
										}
										orderLogistics.push(orderLogisticsItem);
									} else {
										orderLogistics.push(['<p style="color:#999;font-size: 14px;margin:5px;">暂无信息</p>']);
									}
									if(i == 0) {
										orderHTML.push('<div class="orderItem" status="open">');
									} else {
										orderHTML.push('<div class="orderItem" status="closed">');
									}
									orderHTML.push('<div class="orderNO">订单编号：<a href="'+order[i].orderDeatilUrl+'" target="_blank">'+order[i].orderId+'</a></div>');
									if(order[i].orderStatus !== undefined) {
										if(order[i].orderStatus == 0) {
											orderStatus = '待付款';
										} else if(order[i].orderStatus == -100) {
											orderStatus = '已取消';
										} else if(order[i].orderStatus == 100) {
											orderStatus = '正在配货';
										} else if(order[i].orderStatus == 200) {
											orderStatus = '已配货';
										} else if(order[i].orderStatus == 300) {
											orderStatus = '已发货';
										} else if(order[i].orderStatus == 400) {
											orderStatus = '已送达';
										} else if(order[i].orderStatus == 1000) {
											orderStatus = '交易成功';
										} else if(order[i].orderStatus == 1100) {
											orderStatus = '交易失败';
										}
									} else {
										orderStatus = '未知状态';
									}
									orderHTML.push('<div class="orderStatus">订单状态：<span>'+orderStatus+'</span></div>');
									if(i == 0) {
										orderHTML.push('<span class="triangle-open"></span>');
									} else {
										orderHTML.push('<span class="triangle-close"></span>');
									}
									orderHTML.push('</div>');

									if(i == 0) {
										orderHTML.push('<div class="orderDetail">');
									} else {
										orderHTML.push('<div class="orderDetail" style="display:none;">');
									}
									orderHTML.push('<div class="orderPhoto">');
									if(order[i].items) {
										for(var k in order[i].items) {
											orderHTML.push('<a href="http://product.dangdang.com/snapshot.php?product_id='+order[i].items[k].productId+'&version='+order[i].items[k].productVersion+'" target="_blank"><img src="'+order[i].items[k].productImgUrl+'" alt="商品图片"></a>');
										}
									}
									orderHTML.push('</div>');
									orderHTML.push('<div class="orderPrice">');
									if(order[i].receiverName) {
										orderHTML.push('订单金额：<span class="dollarColor">￥'+order[i].total+'</span>&nbsp;&nbsp;收货人：<span>'+order[i].receiverName+'</span>');
									} else {
										orderHTML.push('订单金额：<span class="dollarColor">￥'+order[i].total+'</span>&nbsp;&nbsp;收货人：<span>先生/女士</span>');
									}
									orderHTML.push('</div>');
									if(order[i].expectedDeliveryTime !== undefined) {
										var tt1 = new Date(parseInt(order[i].expectedDeliveryTime)).toLocaleDateString();
										if(tt1 !== 'Invalid Date') {
											orderHTML.push('<div class="orderExpress">预计送达时间：'+(tt1)+'</div>');
										}
									}
									orderHTML.push('<div class="orderOpt">');
									orderHTML.push('<button class="orderProgress" style="margin-right: 175px;" orderNumber="'+i+'">订单进度</button>');
									orderHTML.push('<button class="businessHandling">业务办理</button>');
									orderHTML.push('</div>');
									orderHTML.push('</div>');
								}
								orderHTML.push('</div>');
								$('#showhotzero').empty().html(orderHTML.join(''));
								// 分页
								$('#showhotzero').append('<div id="paginator" class="paginator paginator-sm fixedPag"></div>');
								//有bug，会反复执行onPageClick
								// $('#paginator').twbsPagination({
								// 	totalPages: data.pageInfo.pageCount,
								// 	visiblePages: 5,
								// 	first: '&lt;&lt;',
								// 	prev: '&lt;',
								// 	next: '&gt;',
								// 	last: '&gt;&gt;',
								// 	onPageClick: function (event, page) {
								// 		dangdangOrders(page);
								// 	}
								// });
								//调用滚动条插件
								$('#showhotzero').scrollbar({});
								//有bug，会无法拖动
								// $('#showhotzero').slimScroll({
								// 	width: 'auto',
								// 	height: '100%'
								// });
							} else {
								$('#showhotzero').empty().html('<div style="text-align:center; margin-top: 200px;"><img src="skin/robotDD/images/no_orders.png"></div><div class="null" style="color: #C4C4C4;">很抱歉，没有找到相关的订单信息</div>');
							}
						} else {
							$('#showhotzero').empty().html('<div style="text-align:center; margin-top: 200px;"><img src="skin/robotDD/images/no_orders.png"></div><div class="null" style="color: #C4C4C4;">很抱歉，没有找到相关的订单信息</div>');
						}
					}
				});
			}
		} else {
			$('#showhotzero').empty().html('<div style="text-align:center; margin-top: 200px;"><img src="skin/robotDD/images/no_orders.png"></div><div class="null" style="color: #C4C4C4;">您未登录账户，小当家无法看到您近期的订单哦，请点击<a href="javascript:;" id="orderLogin">登录</a></div>');
		}
	});
}
/* util */

var _Layindex = null;
var _BOTTOMLENGTH = 20;
//全局存订单物流详情
var orderLogistics = [];
$(function() {
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

	document.getElementById('weblogo').onload = function() {
		$('.robot_top_name').css('left', $('#weblogo').width() + 40);
	};

	$('body').on('click', '#orderLogin', function() {
		showMsgBox('orderLogin', '', '');
		_MsgBoxClosed();
	});

	//查询订单信息
	dangdangOrders();

	//绑定回答中转人工事件
	var _LOGIN_ID = 0;
	$('body').on('click', '.faqevent', function() {
		$(this).attr('id', 'DD_LOGIN_'+_LOGIN_ID);
		var sessionID = getCookie('sessionID');
		$.getJSON('/DdwQuery/loginCheck?sessionID='+sessionID, function (data) {
			if(data.isLogin) {
				//打开小能的页面
				location.href='http://nt-downt.imip.dangdang.com/t2d/chat.php?siteid='+XN_param.siteid+'&sellerid='+XN_param.sellerid+'&settingid='+XN_param.settingid+'&baseuri='+XN_param.baseuri+'&ref='+XN_param.ref+'&tit='+XN_param.tit;
			} else {
				_LOGIN_ID += 1;
				showMsgBox('DD_LOGIN_'+(_LOGIN_ID-1), '', '');
				_MsgBoxClosed();
			}
		});
		return false;
	});

	//绑定页面中转人工按钮事件
	$('body').on('click', '#ArtiServicePica', function() {
		var sessionID = getCookie('sessionID');
		$.getJSON('/DdwQuery/loginCheck?sessionID='+sessionID, function (data) {
			if(data.isLogin) {
				//打开小能的页面
				location.href='http://nt-downt.imip.dangdang.com/t2d/chat.php?siteid='+XN_param.siteid+'&sellerid='+XN_param.sellerid+'&settingid='+XN_param.settingid+'&baseuri='+XN_param.baseuri+'&ref='+XN_param.ref+'&tit='+XN_param.tit;
			} else {
				showMsgBox('ArtiServicePica', '', '');
				_MsgBoxClosed();
			}
		});
	});

	/* function _XiaoNengMsgBoxClosed() {
		var XiaoNengMsgBoxClosedTimeOut = setInterval(function() {
			if($('.ntalk-window-containter').css('display') == 'none' || $('.ntalk-window-containter').length === 0) {
				clearInterval(XiaoNengMsgBoxClosedTimeOut);
				$('#backdrop').hide();
			} else {
				$('#backdrop').height($(window).height());
				$('#backdrop').show();
			}
		}, 1000);
	} */

	//在调用相应弹窗showMsgBox后再开启定时器，检测到窗口隐藏后再关闭定时器
	function _MsgBoxClosed() {
		var MsgBoxClosedTimeOut = setInterval(function() {
			if($('#LoginWindow').css('display') == 'none' || $('#LoginWindow').length === 0) {
				clearInterval(MsgBoxClosedTimeOut);
				dangdangOrders();
			}
		}, 2000);
	}
	//获取天气
	var url = 'http://chaxun.1616.net/s.php?type=ip&output=json&callback=?&_=' + Math.random();
	$.getJSON(url, function (data) {
		$.ajax({
			url: encodeURI('http://webchat.faqrobot.org/servlet/api/apiservice'),
			type: 'get',
			dataType: 'jsonp',
			cache: false,
			data: {
				key: 'jiandanwentichaxun',
				state: 'weather',
				ip: data.Ip,
				type: 'json',
				callback: '123456789'
			},
			success: function(data) {
				if(data.sug) {
					$('#wearSug').html('着装：'+ data.sug);
				}
				if(data.list) {
					if(data.list[0]) {
						$('.weatherDetail').html(data.city + ' ' + data.list[0].weather + ' ' + data.list[0].temperature);
						if(data.list[0].weather == '雨夹雪') {
							$('.weatherImg').addClass('icon-Sleet');
						} else if(data.list[0].weather == '多云') {
							$('.weatherImg').addClass('icon-partly');
						} else if(data.list[0].weather == '阴') {
							$('.weatherImg').addClass('icon-cloudy');
						} else if(data.list[0].weather.indexOf('雷') !== -1) {
							$('.weatherImg').addClass('icon-Thunder');
						} else if(data.list[0].weather.indexOf('雪') !== -1) {
							$('.weatherImg').addClass('icon-snow');
						} else if(data.list[0].weather.indexOf('雨') !== -1) {
							$('.weatherImg').addClass('icon-rain');
						} else {//晴或其他
							$('.weatherImg').addClass('icon-sun');
						}
					}
				}
			}
		});
	});


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
		logoUrl: 'robot/skin/robotDD/images/head.png',
		//logo地址
		logoId: 'weblogo',
		//logo地址
		//userInfoId: 'userInfoId',//用户信息Id
		kfPic: 'robot/skin/robotDD/images/head.png',
		//客服图标
		khPic: 'robot/skin/robotDD/images/head_user.png',
		//客户图标
		kfHtml: ['<div class="MN_answer_welcome MN_answer"><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%helloWord%</div><div class="MN_kftime">%formatDate%</div></div>', //欢迎语组合
		'<div class="MN_helpful"><span class="MN_is">以上内容是否解决了您的问题？</span><span class="MN_reasonSend">提交</span><span class="MN_yes" title="解决"></span><span class="MN_no" title="未解决"></span></div>', //是否满意组合
		'<div class="MN_answer" aId="%aId%" cluid="%cluid%"><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%ansCon%%gusListHtml%%relateListHtml%%commentHtml%</div><div class="MN_kftime">%formatDate%</div></div>' //回答组合
		],
		//客服结构(所有的属性和%xxx%都必须存在)
		newQueId: 'showhotone',
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
		noView: ['.MN_kfImg', '.MN_khImg', '.orderLeft img', '.msg-item-wrapper img'],
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
			if(data.moods) {
				for(var i in data.moods) {
					if(data.moods[i].key == 'mood') {
						$('#moodSpan').empty().append(data.moods[i].valueString);
						//调用滚动条插件
						$('#showhotthree').scrollbar({});
					}
				}
			} else if($('#showhotthree').height() < $('#hotThreeContent').height()) {
				//调用滚动条插件
				$('#showhotthree').scrollbar({});
			}
			if(data.quickLink) {
				var linkHTML = [];
				for(var j in data.quickLink) {
					if(j % 3 === 0) {
						linkHTML.push('<div class="row">');
					}
					linkHTML.push('<a href="'+data.quickLink[j].linkUrl+'" target="_blank"><div class="col"><div class="pic"><img src="'+data.quickLink[j].imageUrl+'" alt="'+data.quickLink[j].name+'"></div><p>'+data.quickLink[j].name+'</p></div></a>');
					if(j % 3 === 2 || j == data.quickLink.length) {
						linkHTML.push('</div>');
					}
				}
				$('#showhottwo').html(linkHTML.join(''));
			}
			if(data.uselessReasonItems) {
				window.uselessReasonItems = data.uselessReasonItems;
			}
		}
	});

	//聊天框右侧四栏的切换
	$(".contentRight .navRow").on('mouseover', function() {
		var self = this;
		var end = 0;
		var endTime = '5';
		if ($(self).is('#hotzero')) {
			end = 0;
		} else if ($(self).is('#hotone')) {
			end = 87;
		} else if ($(self).is('#hottwo')) {
			end = 174;
		} else if ($(self).is('#hotthree')) {
			end = 261;
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
		//$(".popFont").hide();
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
			$('.lPic img').attr('src', 'skin/robotDD/images/tips1.png');
		} else {
			$('.lPic img').attr('src', 'skin/robotDD/images/tips' + (serial * 1 + 1) + '.png');
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
		$('.lPic img').attr('src', 'skin/robotDD/images/tips' + serial + '.png');
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
	// $("#love").on('mouseover mouseout', function(event) {
		// if (event.type == "mouseover") {
			// $(this).attr('class', 'icon-my_hover');
		// } else if (event.type == "mouseout") {
			// $(this).attr('class', 'icon-my_normal');
		// }
	// });
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
	//人工客户
	$("#ArtiServicePica").on('mouseover mouseout', function(event) {
		if (event.type == "mouseover") {
			//鼠标悬浮
			$(this).attr('src', 'skin/robotDD/images/kefu_1.png');
		} else if (event.type == "mouseout") {
			//鼠标离开
			$(this).attr('src', 'skin/robotDD/images/kefu_2.png');
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
	});

	var robotSideBar0 = $('.robot_hot').eq(0).scrollbar({});

    //聊天框最近订单打开和关闭效果
	$('body').on('click', '.orderItem', function() {
		if($(this).attr('status') == 'closed') {
			$(this).next().animate({height: 'toggle', opacity: 'toggle'}, "300", function() {
				$(window).trigger('resize');
			});
			$(this).find('.triangle-close').addClass('triangle-open').removeClass('triangle-close');
			$(this).attr('status', 'open');
			$(this).css('background-color', '#FBFBFB');
		} else {
			$(this).next().animate({height: 'toggle', opacity: 'toggle'}, "300", function() {
				$(window).trigger('resize');
			});
			$(this).find('.triangle-open').addClass('triangle-close').removeClass('triangle-open');
			$(this).attr('status', 'closed');
			$(this).css('background-color', '#FFF');
		}
	});

	//订单详情
	$('body').on('click', '.orderProgress',
	function() {
		var orders = orderLogistics[$(this).attr('orderNumber')*1];
		var contents = '';
		for(var i=0; i< orders.length; i++) {
			contents += orders[i];
		}
		layer.open({
			title: false,
			type: 1,
			area: '750px',
			shadeClose: true,
			content: '<div style="text-indent:5px;">'+contents+'</div>'
		});
	});

	//
	$('body').on('click', '.businessHandling',
	function() {
		window.open('http://myhome.dangdang.com/');
	});

	var tiaoxiArray = [
		'你能干嘛？',
		'你是男的女的？',
		'我想和你做朋友',
		'卖个萌',
		'你是复读机呀',
		'唱首歌',
		'跳个舞',
		'天气不错啊',
		'爱你',
		'你有男朋友吗？',
		'你喜欢什么',
		'你累吗',
		'我累了',
		'你会做家务吗？',
		'说你爱我',
		'你好可爱',
		'我不想上班怎么办',
		'我今天的桃花运',
		'我是你的男朋友吗？',
		'你体重多少',
		'幸福的关键字是什么',
		'明天聊',
		'你觉得我怎么样？',
		'讲个笑话吧',
		'我帅吗？',
		'做我的女朋友吧',
		'你会做饭吗？',
		'背首诗啊',
		'天王盖地虎',
		'挖掘机技术哪家强'
	];
	$('#tiaoxi').on('click', function() {
		var content = $('#message').val();
		$('#message').val(tiaoxiArray[rnd(1,30)]);
		$('#sendBtn').trigger('click');
		$('#message').val(content);
	});

	function rnd(m, n) {
		return parseInt((Math.random()*(n-m) + m), 10);
	}

	//讲笑话
	$('#telJoke').on('click', function() {
		var content = $('#message').val();
		$('#message').val('讲笑话');
		$('#sendBtn').trigger('click');
		$('#message').val(content);
	});

	//星座分析
	$('#telStar').on('click', function() {
		addAask('今天我的星座运势如何？');
		addAanswer('<div>请问您想知道哪个星座的运势？</div><div class="starRow"><div class="constellation"><div class="icon-baiyang"></div><div class="constellationName">白羊座</div></div><div class="constellation"><div class="icon-jinniu"></div><div class="constellationName">金牛座</div></div><div class="constellation"><div class="icon-shuangzi"></div><div class="constellationName">双子座</div></div><div class="constellation"><div class="icon-juxiec"></div><div class="constellationName">巨蟹座</div></div></div><div class="starRow"><div class="constellation"><div class="icon-shizi"></div><div class="constellationName">狮子座</div></div><div class="constellation"><div class="icon-chunv"></div><div class="constellationName">处女座</div></div><div class="constellation"><div class="icon-tiancheng"></div><div class="constellationName">天秤座</div></div><div class="constellation"><div class="icon-tianxie"></div><div class="constellationName">天蝎座</div></div></div><div class="starRow"><div class="constellation"><div class="icon-sheshou"></div><div class="constellationName">射手座</div></div><div class="constellation"><div class="icon-mojie"></div><div class="constellationName">摩羯座</div></div><div class="constellation"><div class="icon-shuipin"></div><div class="constellationName">水瓶座</div></div><div class="constellation"><div class="icon-shuangyu"></div><div class="constellationName">双鱼座</div></div></div>');
	});

	//具体星座
	$('body').on('click', '.constellation', function() {
        var self = this;
		addAask($(self).children('.constellationName').html());
		$.ajax({
			url: encodeURI('http://webchat.faqrobot.org/servlet/api/apiservice'),
			type: 'get',
			dataType: 'jsonp',
			cache: false,
			data: {
				key: 'jiandanwentichaxun',
				state: 'constellation',
				consName: $(self).children('.constellationName').html(),
				type: 'today',
				callback: '123456789'
			},
			success: function(data) {
				if(data.response) {
					addAanswer('<div class="ansStarPic">'+$(self).html()+'</div><div class="ansStarText">'+data.response+'</div>');
				}
			}
		});
	});

	//聊天框添加问题
	function addAask(myAsk) {
		FAQ.$obj.$chatCtnId.append(FAQ.customHtml(myAsk));
	}

	//聊天框添加答案
	function addAanswer(myAnswer) {
		FAQ.$obj.$chatCtnId.append(FAQ.robotHtml({'message':'','nowState':1,'robotAnswer':[{'aId':0,'ansCon':myAnswer,'answerType':0,'cluid':'','gusList':[],'gusWords':null,'msgType':'text','question':{'aId':0,'answer':'','comb_id':'','comb_name':'','hits':0,'level':0,'question':'','solutionId':0,'sourceScope':'','time':'','url':'','useFull':0,'useLess':0},'relateLessList':[],'relateList':[],'relateListStartSelectIndex':0,'showQue':false,'terms':[],'thirdUrl':null}],'status':0,'tspan':2}));
	}

	//机器人答案推荐商品换一换
	$('body').on('click', '.changeitem', function() {
		if($(this).attr('rank') === undefined) {
			if($(this).siblings('.goodOuter').size()<=2) {
				$(this).attr('rank',-1);
				return;
			} else {
				$(this).attr('length', $(this).siblings('.goodOuter').size());
			}
			$(this).attr('rank',2);
		}
		if($(this).attr('rank') != -1) {
			var i = parseInt($(this).attr('rank'));
			var len = parseInt($(this).attr('length'));
			$(this).siblings('.goodOuter').hide();
			if(i < len) {
				$(this).siblings('.goodOuter').eq(i).show();
			} else {
				i = 0;
				$(this).siblings('.goodOuter').eq(i).show();
			}
			i++;
			if(i < len) {
				$(this).siblings('.goodOuter').eq(i).show();
			} else {
				i = 0;
				$(this).siblings('.goodOuter').eq(i).show();
			}
			i++;
			$(this).attr('rank', i);
		}
	});

  $('body').on('click', '.orderBottom', function(){
    $(this).parent().find('.orderWhole').show();
    $(this).append('<div style="display:none;">1</div>');
    $(this).hide();
  });
  $('body').on('click', '.orderWhole', function(){
		var content = $('#message').val();
		$('#message').val($(this).find('.orderIdd').text());
		$('#sendBtn').trigger('click');
		$('#message').val(content);
    $(this).addClass('orderWholeClicked').removeClass('orderWhole');
  });
});
