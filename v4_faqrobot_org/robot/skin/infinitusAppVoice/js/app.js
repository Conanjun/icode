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
	var myElement = document.getElementById('pressVoice'),robotCon = document.getElementById('robotFront');
	var mc = new Hammer(myElement),robot = new Hammer(robotCon),soundsPress=null,soundsTap=null,soundsPanUp=null,soundsPanDown=null,tipLay=null;
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
                'src': 'skin/infinitusAppVoice/js/'+ name +'.js?dev=' + Math.random()
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
				upToQi(filePath,1);
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
				upToQi(filePath,1);
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
            //评价完成后退出
			// if(!sessionStorage.getItem('isShow') && sessionStorage.getItem('isAQ')){
			// 	if(FAQ.options.nowStateNew == 0){
			// 		var entranceWords = ''
			// 		for (var i = 0; i < FAQ.options.entranceWords.length; i++) {
			// 			entranceWords += (window.MN_Base.getParam(FAQ.options.entranceWords[i], document.referrer) || '') + ','
			// 		}
			// 		FAQ.request({
			// 			params:{
			// 				's':'p',
			// 				'sysNum':FAQ.options.sysNum,
			// 				'sourceId':FAQ.options.sourceId,
			// 				'entrance':document.referrer,
			// 				'entranceWords':entranceWords,
			// 				'jid':FAQ.options.jid
			// 			},
			// 			callback:function(data){
			// 				$('#satius').modal('show');
			// 				$('input[name="pinjia"]').eq(0).prop('checked',true);
			// 				$('input[name="pinjia"]').eq(1).prop('checked',false);
			// 				$('.unstatisRession').addClass('hide');
			// 			}
			// 		})
			// 	}else{
			// 		$('#satius').modal('show');
			// 		$('input[name="pinjia"]').eq(0).prop('checked',true);
			// 		$('input[name="pinjia"]').eq(1).prop('checked',false);
			// 		$('.unstatisRession').addClass('hide');
			// 	}
			// }else{
				cordova.require("cordova/exec")(null, null, "BSLTransfer", "returnBack", [true, '', '']);
			//}
            //cordova.require("cordova/exec")(null, null, "BSLTransfer", "returnBack", [true, '', '']);
			//FAQ.offline();
        });
		window.a = false;
		// 监听状态
		cordova.require("cordova/exec")(function(result) {
			if(result) {// 1-后到前
				//location.reload();
				FAQ.tspan = 2000*1000;
				$(document).trigger('dblclick');
			}else {// 0-前到后
				//$('.returnBack').trigger('click');
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
	function upToQi(filePath,type,data1,sendAgainCall) {//type==1  图片文件   type==2 语音文件  type==3  断网环境下重新发送语音文件   timeLengthTmp  断网情况下的录音时长
		if(!type)type==1;
		var uploadPath = [],ran='';
		if(type==1){
			ran = ('robot/app/'+ Math.random()).replace(/\./g, '') +'.png';// 路径
		}else{
			ran = ('robot/app/'+ Math.random()).replace(/\./g, '') +'.wav';
		}
		uploadPath.push(ran);
		// 获取 token
		MN_Base.request({
			url: 'LuckyInfo/getUpToken',
			callback: function(data) {
				cordova.require("cordova/exec")(function(isSuccess) {
					if(isSuccess) {
						var src = 'http://robotcdn.infinitus.com.cn/'+ ran;
						if(type==1){
							FAQ.askQue('<img src="'+ src +'">','image');
						}
						if(type==2 || type==3){
							var obj=null;
							eval("obj="+data1);
							if(type==3){
								//点击重发的时候将上一个对话删除，用新的替换
								if(typeof sendAgainCall=='function'){
									sendAgainCall(src);
								}
							}else{
								FAQ.askQue('<img src="/robot/skin/infinitusAppVoice/images/voice_icon_08@2x.png" style="width:50%;" class="playAudio"  alt="'+obj.result.word+'" filePath="'+obj.result.filePath+'"><audio src="'+src+'" style="display:none;" controls="controls">您的浏览器不支持 audio 标签。</audio><span class="voiceClum">'+obj.result.timeLength+'"</span>','voice'); 
							}
						}
					}else{
						FAQ.askQue('上传失败','',true); 
					}
				}, null,"Upload", "uploadFileByByte", [filePath, uploadPath, '', '', data.UpToken])
			}
		});
	}
	//播放语音
	$('#chatCtn').on('click','.MN_khCtn',function(){
		var allThis=$(this);
		//有网络播放
		if($(this).find('.playAudio').length>0){
			var $this=$(this).find('.playAudio');
			//alert($this.attr('filePath'));
			if($this.length>0){
				var min=($this.siblings('.voiceClum').html().replace('"','') || 0);
				$this.attr('src','/robot/skin/infinitusAppVoice/images/voice2.gif');
				cordova.require("cordova/exec")(null,null,"VoiceWordPlugin","playRecord",[{
					"url":$this.attr('filePath'),
					"isAutospeaker":false
				}])
				Countdown();
				function Countdown() {
					if (min >= 1) {
						min -= 1;
						setTimeout(function() {
							Countdown();
						}, 1000);
					}else{
						$this.attr('src','/robot/skin/infinitusAppVoice/images/voice_icon_08@2x.png');
					}
				}
			}	
		}
		//上传语音失败，点击再次上传
		if($(this).find('.sendAgain').length>0){
			var $this=$(this).find('.sendAgain');
			var vedioTmp=$this.attr('con'),tl=$this.attr('timelength');
			layer.confirm('重发该消息？', {
			  skin:'confirmXgn',
			  btn: ['取消','确定'] //按钮
			}, function(index){
			  layer.close(index);
			}, function(){
				checkNetWork(function(){
					$this.html('发送中……');
					//有网络将之前的语音文件重新上传翻译
					cordova.require("cordova/exec")(function(data){
						if(data){
							var obj=null;
							eval("obj="+data);
							if(obj.result.type==1){
								//alert('断网重新发送：'+data+'----上次录音时长'+tl);
								if(obj.result.word){
									//上传到七牛云
									var filePath = [];
									filePath.push(obj.result.filePath.replace('file://','').replace('/file:',''));
									upToQi(filePath,3,data,function(src){
										//alert(src);
										allThis.parent().remove();
										FAQ.askQue('<img src="/robot/skin/infinitusAppVoice/images/voice_icon_08@2x.png" style="width:50%;" class="playAudio"  alt="'+obj.result.word+'" filePath="'+obj.result.filePath+'"><audio src="'+src+'" style="display:none;" controls="controls">您的浏览器不支持 audio 标签。</audio><span class="voiceClum">'+tl+'"</span>','voice');
									});
									
								}else{
									allThis.parent().remove();
									if(obj.result.timeLength<2){
										if(!soundsTap){
											soundsTap=layer.msg('<img src="/robot/skin/infinitusAppVoice/images/voice_icon_07@2x.png"><br>说话时间太短', {time: 3000});
										}
									}else{
										var obj={"robotAnswer":[{"ansCon":"<p>小极没听清楚你说了什么，请重新向小极提问</p>"}]};
										FAQ.$obj.$chatCtnId.append(FAQ.robotHtml(obj));				
									}
								}
								FAQ.scrollbar.update();
								FAQ.scrollbarUpdate();
							}
						}
					},null,"VoiceWordPlugin","startSpeech",[{"filePath":vedioTmp}]);
				},function(){
					tipLayFun('当前无网络');
				})
			});
		}
	})
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
		var tmpSrc=$(this).attr('src');
		if(tmpSrc=='/robot/skin/infinitusAppVoice/images/voice_icon_08@2x.png' || tmpSrc=='/robot/skin/infinitusAppVoice/images/voice2.gif'){}else{
			cenariusOpenLightApp(this.src);
		}
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
			//e.preventDefault();
			//cordova.require("cordova/exec")(null,null,"VoiceWordPlugin","cancelSpeech",[]);
			layer.close(soundsTap);soundsTap=null;
			layer.close(soundsPress);soundsPress=null;
			layer.close(soundsPanUp);soundsPanUp=null;
			layer.close(soundsPanDown);soundsPanDown=null;
			myElement.style.backgroundColor='#fff';
			$('#pressVoice').html('按住 说话');
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
			useSetFont:1,
			setInputTop:false,
			interface: 'servlet/appChat',//网页端和H5页面调用的接口不同。分别为AQ和AppChat
			logoUrl: 'robot/skin/infinitusApp/images/logo@2x.png',//logo地址 ----------
			logoId: 'logo',// ----------
			webNameId: 'MN_logoWord',//公司名称Id
			intelTitleChange: true,// 智能聊天是否修改标题
			intelTitle: '智能客服小极',// 智能聊天时的标题
			artiTitleChange: true,// 人工时是否修改标题
			artiTitle: '无限极',// 人工时的标题
			//userInfoId: 'userInfoId',//用户信息Id
			kfPic: 'robot/skin/infinitusApp/images/robot.png',  //客服图标
			khPic: 'robot/skin/infinitusApp/images/user.png', //客户图标
			kfHtml: [
				'<div class="MN_answer_welcome MN_answer"><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%helloWord%</div><div class="MN_kftime">%formatDate%</div></div>',//欢迎语组合
				'<div class="MN_helpful"><span class="MN_reasonSend">提交</span><span class="MN_yes">解决</span><span class="MN_no">未解决</span></div>',//是否满意组合
                '<div class="MN_answer" aId="%aId%" cluid="%cluid%"><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%ansCon%%gusListHtml%%relateListHtml%%commentHtml%</div><div class="MN_kftime">%formatDate%</div></div>',//回答组合
                '<div class="MN_answer" aId="%aId%" cluid="%cluid%"><div class="MN_kftime">%formatDate%</div><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%ansCon%%gusListHtml%%relateListHtml% <div style="margin-top:5px"><div style="float:right">%commentHtml%</div> <div class="foldBtn pull-left"><span class="foldBtn-icon"><i class="fa fa-angle-down"></i></span><span class="fold-txt">查看更多</span></div></div> </div></div>'//折叠回答组合
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
				
			},
			commentCallback: function() {//评论后的回调
				layer.close(layerCtn);
			},
			leaveMsgCallback: function() {//留言后的回调
				layer.close(layerCtn);
			},
		});

        $('.good').on('click',function(){
            $('.unstatisRession').addClass('hide');
        })
        $('.bad').on('click',function(){
        for (var i = 0; i < $("[name=ckb]").length; i++) {
                $("[name=ckb]").eq(i).prop('checked',false);
            }
            $('#contentVal').val('');
            $('.unstatisRession').removeClass('hide');
        })
        $('#submitBtn').on('click',function(){
            var level = 1;
            var unstais = '';
            for (var i = 0; i < $("[name=pinjia]").length; i++) {
                if ($('[name=pinjia]').eq(i).prop('checked')) {
                    if ($('[name=pinjia]').eq(i).val() == '不满意') {
                        level = 0;
                    } else {
                        level = 1;
                    }
                }
            }
            for (var i = 0; i < $("[name=ckb]").length; i++) {
                if ($('[name=ckb]').eq(i).prop('checked')) {
                    unstais += $('[name=ckb]').eq(i).val() + ',';
                }
            }
            if (unstais == '' && $('#contentVal').val() != '') {
                unstais = '不满意';
            }
    
            FAQ.request({
                url:'../../servlet/appChat',
                params:{
                    s: 'fadeback',
                    sourceId: 0,
                    content: $('#contentVal').val(),
                    level: level,
                    sub: unstais
                },
                callback:function(data){
                    if(data.status){
                        if(data.message == '缺少参数!'){
                            layer.msg("请填写完整")
                        }else{
                            layer.msg(data.message)
                        }
                    }else{
                        $('.choose').addClass('hide');
                        $('.unstatisRession').addClass('hide');
                        $('.feedBack').removeClass('hide');
                        $('#satius .modal-footer').addClass('hide');
                        sessionStorage.setItem('isShow', '已评价');
                        setTimeout(function(){
                            $('#satius').modal('hide');
                            $('.returnBack').trigger('click');
                        },3000)
                    }
                }
            })
        })


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
		// $('body').on('click.FA', '.welcomeWords', function() {
		// 	console.log($(this).attr('rel'))
		// 	if($(this).attr('rel')){
		// 		FAQ.robot._html = $(this).attr('rel');
		// 		FAQ.robot.guide = false;// 退出引导
		// 	}else{
		// 		FAQ.robot._html = $(this).text();
		// 	}
		// 	FAQ.askQue();
		// });
		
		//语音和文字的切换
		
		$('.editCtn .cosStyle').on('click','.goinput',function(){
			$(this).addClass('goVideo').removeClass('goinput');
			$('.editCtn .cosInput .textareaCtn').hide().siblings().show();
			$('.cosBtn .addbtn').show().siblings().hide();
		})
		$('.editCtn .cosStyle').on('click','.goVideo',function(){
			$(this).addClass('goinput').removeClass('goVideo');
			$('.editCtn .cosInput .textareaCtn').show().siblings().hide();
			if($('#textarea').val()!=''){
				$('.cosBtn .addbtn').hide().siblings().show();
			}
		})
		//切换成语音的时候按住
		
		robot.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
		
		mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
		mc.on("tap press panup pandown panend pressup", function(ev) {
			if(ev.type=='press'){
				 //按压开始其他状态重置
				$('#pressVoice').addClass('pressVoiceBtn');
				myElement.style.backgroundColor='#e8e8e8';
				$('#pressVoice').html('松开 结束');
				layer.close(soundsTap);soundsTap=null;
				layer.close(soundsPanUp);soundsPanUp=null;
				layer.close(soundsPanDown);soundsPanDown=null;
				if(!soundsPress){
					checkNetWork(function(){
						soundsPress=layer.msg('<img src="/robot/skin/infinitusAppVoice/images/voice_icon_05@2x.png"><br><br>手指上滑，取消发送', {time: 2000000});
						cordova.require("cordova/exec")(function(data){
							if(data){
								var obj=null;
								eval("obj="+data);
								if(obj.result.status==3){
									layer.close(soundsPress);soundsPress=null;
									myElement.style.backgroundColor='#fff';
									$('#pressVoice').removeClass('pressVoiceBtn');
									layer.alert('您当前没有录音权限，<br>请前往隐私设置', {icon: 6});
									$('#pressVoice').html('按住 说话');
									return;
								}
								
								if(obj.result.type==1){
									//alert(data);
									layer.close(soundsPress);soundsPress=null;
									myElement.style.backgroundColor='#fff';
									$('#pressVoice').removeClass('pressVoiceBtn');
									$('#pressVoice').html('按住 说话');
									
									if(obj.result.timeLength<=60){
										if(obj.result.word){
										//上传到七牛云
											var filePath = [];
											filePath.push(obj.result.filePath.replace('file://',''));
											upToQi(filePath,2,data);
										}else{
											if(obj.result.timeLength<2){
												if(!soundsTap){
													soundsTap=layer.msg('<img src="/robot/skin/infinitusAppVoice/images/voice_icon_07@2x.png"><br>说话时间太短', {time: 3000});
												}
											}else{
												var obj={"robotAnswer":[{"ansCon":"<p>小极没听清楚你说了什么，请重新向小极提问</p>"}]};
												FAQ.$obj.$chatCtnId.append(FAQ.robotHtml(obj));			
											}
										}
										FAQ.scrollbar.update();
										FAQ.scrollbarUpdate();
									}else{
										cordova.require("cordova/exec")(null,null,"VoiceWordPlugin","endSpeech",[]);
									}
								}
							}else{
								cordova.require("cordova/exec")(null,null,"VoiceWordPlugin","cancelSpeech",[]);
							}
						},null,"VoiceWordPlugin","startSpeech",[]); 
					},function(){
						soundsPress=layer.msg('手指上滑，取消发送', {time: 2000000});
						cordova.require("cordova/exec")(function(data){
							 //无网络开始录音
							if(data){
								layer.close(soundsPress);soundsPress=null;
								myElement.style.backgroundColor='#fff';
								$('#pressVoice').html('按住 说话');
								$('#pressVoice').removeClass('pressVoiceBtn');
								var obj=null;
								eval("obj="+data);
								//安卓没有权限录音给出提示信息
								if(obj.status==3){
									//alert('无网络：无权限');
									layer.alert('您当前没有录音权限，<br>请前往隐私设置', {icon: 6});
									return;
								}
								//alert(data);
								if(obj.timeLength<=60){
									FAQ.askQue('<span class="sendAgain" con="'+obj.filePath+'" timelength="'+obj.timeLength+'">点击重新发送</span><span style="position: absolute;width: 20px;height: 20px;background: #eb6100; border-radius: 50%;text-align: center;right: 108px;">!</span><audio src="" style="display:none;" controls="controls">您的浏览器不支持 audio 标签。</audio>','',true); 
									FAQ.scrollbar.update();
									FAQ.scrollbarUpdate();
								}else{
									//超出60秒结束录音
									cordova.require("cordova/exec")(null,null,"VoiceWordPlugin","endRecord",[]);
								}
							}else{
								//取消录音相当于删除这个录音文件
								cordova.require("cordova/exec")(null,null,"VoiceWordPlugin","cancelRecord",[]);
							}
						},null,"VoiceWordPlugin","startRecord",[]);
					})
					
				}
			}else if(ev.type=='panup'){
				 //上滑
				if($('#pressVoice').hasClass('pressVoiceBtn')){
					layer.close(soundsTap);soundsTap=null;
					layer.close(soundsPress);soundsPress=null;
					var tmpY=''+ev.deltaY+'';
					tmpY=tmpY.substring(1);
					if(tmpY>50){
						if(!soundsPanUp){
							layer.close(soundsPanDown);soundsPanDown=null;
							soundsPanUp=layer.msg('<img src="/robot/skin/infinitusAppVoice/images/voice_icon_06@2x.png"><br><p style="background:#b82d2d; color:#fff; border-radius:5px; padding:3px 5px;">松开手指，取消发送</p>',{
								time: 2000000
							});
							$('#pressVoice').html('松开手指，取消发送');
						}
					}
				}
			}else if(ev.type=='pandown'){
				//下滑
				if($('#pressVoice').hasClass('pressVoiceBtn')){
					layer.close(soundsTap);soundsTap=null;
					layer.close(soundsPress);soundsPress=null;
					var downY=''+ev.deltaY+'';
					downY=downY.substring(1);
					if(downY<20){
						layer.close(soundsPanUp);soundsPanUp=null;
						if(!soundsPanDown){
							soundsPanDown=layer.msg('<img src="/robot/skin/infinitusAppVoice/images/voice_icon_05@2x.png"><br><br>手指上滑，取消发送', {time: 2000000});
							$('#pressVoice').html('松开 结束');
						}
					}
				}
				
			}else if(ev.type=='panend'){
				//手指上滑取消
				if(soundsPanUp){
					layer.close(soundsPanUp);soundsPanUp=null;
					checkNetWork(function(){
						cordova.require("cordova/exec")(null,null,"VoiceWordPlugin","cancelSpeech",[]) 
					},function(){
						cordova.require("cordova/exec")(null,null,"VoiceWordPlugin","cancelRecord",[]);
					})
				}else{
					//下滑抬手发送语音
					layer.close(soundsPanDown);soundsPanDown=null;
					checkNetWork(function(){
						cordova.require("cordova/exec")(null,null,"VoiceWordPlugin","endSpeech",[]);
					},function(){
						cordova.require("cordova/exec")(null,null,"VoiceWordPlugin","endRecord",[]);
					})
				}
				myElement.style.backgroundColor='#fff';
				$('#pressVoice').html('按住 说话');
			}else if(ev.type=='pressup'){
				//手指长按松开
				//结束会话
				checkNetWork(function(){
					cordova.require("cordova/exec")(null,null,"VoiceWordPlugin","endSpeech",[]);
				},function(){
					cordova.require("cordova/exec")(null,null,"VoiceWordPlugin","endRecord",[]);
				}) 
				myElement.style.backgroundColor='#fff';
				$('#pressVoice').html('按住 说话');
			}
		});
	}
	function checkNetWork(successCall,failureCall){
		cordova.require("cordova/exec")(function(netWorkStatus){//statu  int 0没有网络，1gprs网络，2wifi网络 
			if(netWorkStatus){
				//有网络的情况
				if(typeof successCall=='function'){
					successCall();
				}
			}else{
				//无网络的情况
				if(typeof failureCall=='function'){
					failureCall();
				}
			}
		}, function (error) {}, "BSLNetwork", "checkNetState", []);
	}
	function tipLayFun(msg){
		tipLay=layer.msg(msg);
		//提示3秒后将提示信息重置
		setTimeout(function(){layer.close(tipLay);tipLay=null;},3000)
	}   
});
