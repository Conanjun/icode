;$(function() {
	FastClick.attach(document.body);

    set_chatScroll_height();
    function set_chatScroll_height() {
        var winW = $(window).width(),
            winH = $(window).height();
        $('html').css('fontSize', winW<750 ? winW : 750);
        $('.chatScroll').height(winH-$('.barCtn').outerHeight()-$('.editCtn').outerHeight());
    }

    $(window).on('resize', function() {
        set_chatScroll_height();
    });

    /* App 对接 BEGIN */
	var FAQ = null;
    var agent = '';
    if(MN_Base.isPC(true) == 'android') {
        agent = 'cordova_android';
    }else {
		agent = 'cordova_ios';
	}

    // 定义函数
    function runAsync(name) {
        // 直接返回 Promise 实例
        return new Promise(function(resolve, reject){
            //做一些异步操作
            var script = createEl('script', {
                'src': 'skin/infinitusApp/js/'+ name +'.js?dev=' + Math.random()
            });
            script.onload = function() {
                resolve();
            }
            $('head')[0].appendChild(script);
        });
    }

    // 将返回的 Promise 实例添加进数组
    var runAsyncArray = [];
    runAsyncArray.push(runAsync('require'), runAsync(agent));

    Promise
    .all(runAsyncArray)// 执行所有的 Promise
    .then(function(data) {
		// 隐藏菜单栏
		cordova.require("cordova/exec")(function() {
		}, null, "BSLTools", "handlerNavigationBarItem", [{title: '', hide: true, rightItems: [{title: '', hide: true, tag: '', delete: false}], leftItem: {title: '', hide: true, tag: '', delete: false}}]);
		
		// 发送图片
        $('.sendPic').on('click', function() {
            cordova.require("cordova/exec")(function(photos) {
				var filePath = [];
				filePath.push(JSON.parse(photos)[0].pic);
				upToQi(filePath);
            }, null, "ImageHandle", "chooseLocalPhotos", [{
				"maximumImagesCount": 1,
				'maxSize': 100
			}])
        });
		
		// 拍照发送
        $('.takePhoto').on('click', function() {
			cordova.require("cordova/exec")(function(photoUrl) {
				var filePath = [];
				filePath.push(photoUrl);
				upToQi(filePath);
			}, null, "ImageHandle", "takePhoto", [0.1, 0])
        });
		
        // 呼叫400
        $('.call400').on('click', function() {
            cordova.require("cordova/exec")(null, null, "BSLTools", "makePhoneCall", ['4008001188'])
        });
		
		// 附近专卖店
        $('.nearMail').on('click', function() {
			cenariusOpenLightApp('https://www.baidu.com');
        });
		
		// 退出服务
		$('.returnBack').on('click', function() {
			cordova.require("cordova/exec")(null, null, "BSLTransfer", "returnBack", [true, '', '']);
			//FAQ.offline();
        });
		window.a = false;
		// 监听状态
		cordova.require("cordova/exec")(function(result) {
			if(result) {// 1-后到前
				//location.reload();
				//alert('1');
				FAQ.tspan = 2000*1000;
				$(document).trigger('dblclick');
			}else {// 0-前到后
				//$('.returnBack').trigger('click');
				//alert('2');
				FAQ.mouseIsOn = false;
				FAQ.offline();
			}
		}, null,"BSLTools", "enterBackground", []);
		
		var index = 0;
		$('.title').on('click', function() {
			if(index >= 10) {
				$('.test').show();
			}
			index++;
		})
    });
	
	// 上传到七牛
	function upToQi(filePath) {
		var uploadPath = [];
		var ran = ('robot/app/'+ Math.random()).replace(/\./g, '') +'.png';// 路径
		uploadPath.push(ran);
		// 获取 token
		MN_Base.request({
			url: 'LuckyInfo/getUpToken',
			callback: function(data) {
				cordova.require("cordova/exec")(function(isSuccess) {
					var src = 'http://robotcdn.infinitus.com.cn/'+ ran;
					if(isSuccess) {
						$('.textarea').val('<img src="'+ src +'">');
						$('.sendBtn').trigger('click');
						//$('.textarea').val(src);
					}else {
						//alert(isSuccess)
					}
				}, null,"Upload", "uploadFileByByte", [filePath, uploadPath, '', '', data.UpToken])
			}
		});
	}
	
	// 打开链接
	$('body').on('click', 'a', function() {
		var href = this.href,
			title = $(this).text();
		if(/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\*\+,;=]|:|@)|\/|\?)*)?$/i.test(href)) {// 网址
			if(MN_Base.isPC(true) == 'android') {
				if(/\.(doc|docx|wps|xls|ppt|pptx|txt|rar|pdf|dwg|exe|jpg|bmp|swf)$/i.test(href)) {// 文档
					cordova.require("cordova/exec")(null, null, 'BSLTools', 'openLocalFile', [{'isOther':'true', 'isNotExist':'true', 'downloadUrl':href, 'localFile':'', 'fileName': title}]);
					return false;
				}else {// 网页
					cenariusOpenLightApp(href);
					return false;
				}
			}else {
				cenariusOpenLightApp(href);
				return false;
			}
			
		}
	})
	
	// 图片预览
	$('.chatCtn').on('click', 'img:not(.MN_kfImg, .MN_khImg, .FA_upFileNoImg, .msg-item-wrapper img)', function() {
		//alert($(this).attr('src'))
		cenariusOpenLightApp(this.src);
	})
	
	function cenariusOpenLightApp(url) {
		cenariusSend("web", { "url": url });
		//cenariusSend("web", { "url": url , "jNavInfo": {"navigationBar":(1)}, "sTitle":"导航标题"});
	}

	function cenariusSend(widgetName, parameter) {
		var cenariusIframe = document.createElement('iframe');
		cenariusIframe.style.display = 'none';
		cenariusIframe.src = "cenarius://cenarius-container/widget/" + widgetName + "?data=" + encodeURI(JSON.stringify(parameter));
		document.documentElement.appendChild(cenariusIframe);
		setTimeout(function () { document.documentElement.removeChild(cenariusIframe) }, 0)
	}

    function createEl(tagName, attrs, style, text) {
        var el = document.createElement(tagName);

        if (attrs) {
            for (key in attrs) {
                if (key == "className") {
                    el.className = attrs[key];
                } else if (key == "id") {
                    el.id = attrs[key];
                } else {
                    el.setAttribute(key, attrs[key]);
                }
            }
        }
        if (style) {
            for (key in style) {
                el.style[key] = style[key];
            }
        }
        if (text) {
            el.appendChild(document.createTextNode(text));
        }
        return el;
    }

    /* App 对接 END */
	

	var goTimer = setInterval(function() {
		if(parseInt($('html').css('fontSize'))) {// 防止rem为0
			go();
			clearInterval(goTimer);
		}
	}, 100)
	
	function go() {
		//显示发送按钮
		$('.textarea').on('input', function() {
			if($(this).val()) {
				$('.sendBtn').show().siblings().hide();
			}else {
				$('.addbtn').show().siblings().hide();
			}
		});
		var timer = null;

		//隐藏更多
		$('.view').on('click', function(e) {//不能用body hack ios
			if($(e.target).is('.faceBtn') || $(e.target).is('.addbtn')) {
				$('.editHide').show();
			}else {
				$('.editHide').hide();
				timerSetHeight();
			}
		});
		
		$('.textarea').on('blur', function() {
			timerSetHeight();
		});
		
		// 定时设置高度
		function timerSetHeight() {
			var i = 0;
			clearInterval(timer);
			timer = setInterval(function() {
				set_chatScroll_height();
				if(i>=5) {
					clearInterval(timer);
				}
				i++;
			}, 100);
		}

		//调整功能宽度(防止某些功能隐藏)
		var showNum = 0;
		for(var i=0,len=$('.editCtn_com').length; i<len; i++) {
			if($('.editCtn_com').eq(i).css('display') != 'none') {
				showNum++;
			}
		}
		$('.editCtn_com').width(100/showNum +'%');

		//调用表情插件
		var Face = $('.textarea').face({
			src: 'src/wx/',//表情路径
			rowNum: 7,//每行最多显示数量，此属性不适用于常用语
			ctnAttr: ['0rem', '0rem', '0.133rem', '0.122rem'],//[left bottom width height] 表情框相对targetEl位置和里面的表情格子宽高  要写单位
			triggerEl: $('.faceBtn'),//触发按钮(不存在则自己生成，不要由a包裹)
			targetEl: $('.editHide'),//父级参照物(用于appendTo和定位)
			hideAdv: true,//是否隐藏广告
			callback: function() {
				$('.editHide').hide();
				$('.sendBtn').show().siblings().hide();
				setTimeout(function(){
					$('.textarea').focus();
				}, 50);
			},
		});


		var layerCtn = null;//所有的弹出层

		//常见问题
		$('.commonQue').on('click', function() {
			layerCtn = layer.open({
				type: 1,
				title: '常见问题',
				content: $('.commonQueLayer'),
				area: ['1rem', '100%'],
				end: function() {
					set_chatScroll_height();
				},
			});
		});

		//选择常见问题(事件委托)
		$('body').on('click', function(e) {
			if(e.target.className=='MN_queList') {
				layer.close(layerCtn);
			}
			if(e.target.parentNode) {
				if(e.target.parentNode.className=='MN_queList') {
					layer.close(layerCtn);
				}
			}
			// 关闭各种框
			if(e.target.className=='layui-layer-setwin') {
				$(e.target).find('.layui-layer-close').trigger('click');
			}
		});

		//意见反馈
		$('.feedback').on('click', function() {
			layerCtn = layer.open({
				type: 1,
				title: '意见反馈',
				content: $('.feedbackLayer'),
				area: ['1rem', '100%'],
				end: function() {
					set_chatScroll_height();
				},
			});
		});
		$('.MN_marginCtn').eq(0).on('click', function() {
			$('.noSatiCtn').hide();
		});
		$('.MN_marginCtn').eq(1).on('click', function() {
			$('.noSatiCtn').show();
		});

		//留言
		$('.leaveMsg').on('click', function() {
			layerCtn = layer.open({
				type: 1,
				title: '留言',
				content: $('.leaveMsgLayer'),
				area: ['1rem', '100%'],
				end: function() {
					set_chatScroll_height();
				},
			});
		});

		//faqrobot
		FAQ = new Faqrobot({
			//sysNum: 1000000,//客户唯一标识
			//jid: 0,//自定义客服客户图标
			//robotName: 'FaqRobot',//机器人名称
			logoUrl: 'robot/skin/infinitusApp/images/logo@2x.png',//logo地址 ----------
			logoId: 'logo',// ----------
			webNameId: 'MN_logoWord',//公司名称Id
			intelTitleChange: true,// 智能聊天是否修改标题
			intelTitle: '智能客服小极',// 智能聊天时的标题
			artiTitleChange: true,// 人工时是否修改标题
			artiTitle: '人工客服',// 人工时的标题
			//userInfoId: 'userInfoId',//用户信息Id
			kfPic: 'robot/skin/infinitusApp/images/robot.png',  //客服图标
			khPic: 'robot/skin/infinitusApp/images/user.png', //客户图标
			kfHtml: [
				'<div class="MN_answer_welcome MN_answer"><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%helloWord%</div><div class="MN_kftime">%formatDate%</div></div>',//欢迎语组合
				'<div class="MN_helpful"><span class="MN_reasonSend">提交</span><span class="MN_yes">解决</span><span class="MN_no">未解决</span></div>',//是否满意组合
				'<div class="MN_answer" aId="%aId%" cluid="%cluid%"><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%ansCon%%gusListHtml%%relateListHtml%%commentHtml%</div><div class="MN_kftime">%formatDate%</div></div>'//回答组合
			],//客服结构(所有的属性和%xxx%都必须存在)
			formatDate: '%month%月%date%日 %hour%:%minute%:%second%',//配置时间格式(默认10:42:52 2016-06-24)
			topQueId: 'commonQueLayer',//热门、常见问题Id --------
			//newQueId: 'newQueId',//新增问题Id
			//recommendQueId: 'recommendQueId',//推荐问题Id
			//quickServId: 'MN_quickServer',//快捷服务Id
			//recommendLinkId: 'recommendLinkId',//推荐咨询Id
			//maxQueNum: 100,//最多展示问题条数
			//maxQueLen: 100,//最多展示问题字数
			//showMsgId: 'showMsgId',//展示信息Id
			chatCtnId: 'chatCtn',//聊天展示Id y   --------------
			inputCtnId: 'textarea',//输入框Id y   --------
			sendBtnId: 'sendBtn',//发送按钮Id y   ------
			//tipWordId: 'tipWord',//输入框提示语Id ----
			//tipWord: '请输入您要咨询的问题',//输入框提示语
			//remainWordId: 'MN_remainWordNum',
			//remainWordNum: '100',
			/*upFileModule: {//上传文件模块
				open: true,//是否启用功能
				maxNum: 2,//最大上传数量，0为不限制
				triggerId: 'sendPic',//触发上传按钮
				startcall: function() {//上传文件前的回调
					set_chatScroll_height();
				},
				callback: function() {//上传文件后的回调
				},
			},*/
			commentFormId: 'feedbackForm',//评论框formId -------
			commentInputCtnId: 'commentCtn',//评论输入框Id ----
			commentSendBtnId: 'commentBtn',//评论发送按钮Id ---------
			//commentTipWordId: 'MN_commentTip',//评论输入框提示语Id
			//commentTipWord: '描述您的意见和建议，以便我们提升服务水平和质量，谢谢您',//评论输入框提示语
			leaveMsgFormId: 'leaveMsgForm',//留言框formId ---------
			leaveMsgInputCtnId: 'leaveMsgCtn',//留言输入框Id ---------
			leaveMsgSendBtnId: 'leaveMsgBtn',//留言发送按钮Id --------
			//leaveMsgTipWordId: 'leaveMsgTipWordId',//留言输入框提示语Id
			//leaveMsgTipWord: '输入您的建议，我们会尽快为您处理！',//留言输入框提示语

			//clearBtnId: 'MN_clearBtn',//清除按钮Id
			//closeBtnId: 'closeBtnId',//关闭聊天页面
			//poweredCtnId: 'poweredCtnId',//技术支持Id
			//thirdUrl: '',//未登录第三方账户，跳转至此链接
			sourceId: 3,//客户来源
			//ajaxType: 'get',
			autoOffline: false,//是否会自动下线
			//noView: ['.MN_kfImg', '.MN_khImg', '.FA_upFileNoImg', '.msg-item-wrapper img'],
			noView: 'all',
			faceModule: {//表情模块
				open: true,//是否启用功能
				faceObj: Face,//表情插件实例
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
			initCallback: function(data) {//初始化基本信息的回调
				window.uselessReasonItems = data.uselessReasonItems;
				$('.title').text(data.webConfig.webName);
			},
			sendCallback: function() {//点击发送按钮的回调
				$('.addbtn').show().siblings().hide();
				!FAQ.robot._html && $('.textarea').focus();// 防止键盘拉起
				
				/*$('.chatCtn').append('图片1<img src="https://ocstest.infinitus.com.cn/live800/downloadserver?companyID=8932&amp;fid=14872388353288932158&amp;act=0&amp;fna=2017-02-16--17-53-20.JPEG">图片2<img src="https://ocstest.infinitus.com.cn/live800/downloadserver?companyID=8932&amp;fid=14872388822448932158&amp;act=0&amp;fna=IMG_20161207_142522.png">');*/
			},
			commentCallback: function() {//评论后的回调
				layer.close(layerCtn);
			},
			leaveMsgCallback: function() {//留言后的回调
				layer.close(layerCtn);
			},
		});

		$('.sendBtn').on('click.FA', function() {
			$('.textarea').focus();
			setTimeout(function(){
				$('.textarea').focus();
			}, 50);
		});
		
		var timerDown = null;
		// 自动滚动到底部
		$('.textarea').on('focus', function() {
			var j = 0;
			clearInterval(timerDown);
			timerDown = setInterval(function() {
				$('body').scrollTop(1000000);
				FAQ.scrollbar.scrollTo('bottom', true);
				if(j>=5) {
					clearInterval(timerDown);
				}
				j++;
			}, 100);
		});

		// 快捷发送欢迎语(防止键盘拉起)
		$('body').on('click.FA', '.welcomeWords', function() {
			if($(this).attr('rel')){
				FAQ.robot._html = $(this).attr('rel');
				FAQ.robot.guide = false;// 退出引导
			}else{
				FAQ.robot._html = $(this).text();
			}
			FAQ.askQue();
		});
	}

		

});

