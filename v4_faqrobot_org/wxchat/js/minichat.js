/**************************** BEGIN ****************************/
/**
* jquery.faqrobot.js plugin 1.2.0
*
* Copyright (c) 2016/3/20 Han Wenbo
*
*   %aId% <=> aId -> 答案编号
*   %cluid% <=> cluid -> 上下文编号
*   %kfPic% <=> this.robot.kfPic -> 客服图片
*   %khPic% <=> this.robot.khPic -> 客户图片
*   %robotName% <=> this.robot.robotName -> 机器人姓名
*   %helloWord% <=> data.webConfig.helloWord -> 欢迎语
*   %formatDate% <=> this.getFormatDate() -> 格式时间
*   %ansCon% <=> data.robotAnswer[0].ansCon -> 机器人答案
*   %gusListHtml% <=> gusListHtml -> 推荐问题结构
*   %relateListHtml% <=> relateListHtml -> 相关问题结构
*   %commentHtml% <=> commentHtml -> 问题满意结构 
*
**/

;(function($, window, document, undefined) {
    
    var plugName = "faqrobot",
        defaults = {
			sysNum: 1000000,//客户唯一标识
            jid: 0,//自定义客服客户图标
			robotName: 'FaqRobot',//机器人名称
			logoUrl: '',//logo地址
			logoId: 'logoId',//logo地址
			webNameId: 'webNameId',//公司名称Id
			webName: '云问科技',//公司名称
			webInfoId: 'webInfoId',//公司简介Id
			webInfo: '唯一的不同是处处不同',//公司简介
            userInfoId: 'userInfoId',//用户信息Id
            kfPic: '',  //客服图标
            khPic: '', //客户图标
            kfHtml: [
                '<div class="MN_answer"><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%helloWord%</div><div class="MN_kftime">%formatDate%</div></div>',//欢迎语组合
                '<div class="MN_helpful"><span class="MN_reasonSend">提交</span><span class="MN_yes">满意</span><span class="MN_no">不满意</span></div>',//是否满意组合
                '<div class="MN_answer" aId="%aId%" cluid="%cluid%"><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%ansCon%%gusListHtml%%relateListHtml%%commentHtml%</div><div class="MN_kftime">%formatDate%</div></div>'//回答组合
            ],//客服结构(所有的属性和%xxx%都必须存在)
            khHtml: '<div class="MN_ask"><div class="MN_khName">我</div><div class="MN_khCtn"><img class="MN_khImg" src="%khPic%"><i class="MN_khTriangle1 MN_triangle"></i><i class="MN_khTriangle2 MN_triangle"></i>%askWord%</div><div class="MN_khtime">%formatDate%</div></div>',//客户结构
            formatDate: '%hour%:%minute%:%second% %year%-%month%-%date%',//配置时间格式(默认10:42:52 2016-06-24)
            topQueId: 'topQueId',//热门、常见问题Id
            newQueId: 'newQueId',//新增问题Id
            recommendQueId: 'recommendQueId',//推荐问题Id
            quickServId: 'quickServId',//快捷服务Id
            recommendLinkId: 'recommendLinkId',//推荐咨询Id
            maxQueNum: 100,//最多展示问题条数
            maxQueLen: 100,//最多展示问题字数
			showMsgId: 'showMsgId',//展示信息Id
			chatCtnId: 'chatCtnId',//聊天展示Id
			inputCtnId: 'inputCtnId',//输入框Id
			sendBtnId: 'sendBtnId',//发送按钮Id
            tipWordId: 'tipWordId',//输入框提示语Id
            tipWord: '请输入您要咨询的问题',//输入框提示语
            remainWordId: 'remainWordId',
            remainWordNum: '100',
            commentFormId: 'commentFormId',//评论框formId
            commentInputCtnId: 'commentInputCtnId',//评论输入框Id
            commentSendBtnId: 'commentSendBtnId',//评论发送按钮Id
            commentTipWordId: 'commentTipWordId',//评论输入框提示语Id
            commentTipWord: '输入您的意见，以便我们提升服务水平和质量！',//评论输入框提示语
            leaveMsgFormId: 'leaveMsgFormId',//留言框formId
            leaveMsgInputCtnId: 'leaveMsgInputCtnId',//留言输入框Id
            leaveMsgSendBtnId: 'leaveMsgSendBtnId',//留言发送按钮Id
            leaveMsgTipWordId: 'leaveMsgTipWordId',//留言输入框提示语Id
            leaveMsgTipWord: '输入您的建议，我们会尽快为您处理！',//留言输入框提示语
            cosFontId: 'cosFontId',//选择字体Id(待完善)
            clearBtnId: 'clearBtnId',//清除按钮Id
            closeBtnId: 'closeBtnId',//关闭聊天页面
            poweredCtnId: 'poweredCtnId',//技术支持Id
            thirdUrl: '',//未登录第三方账户，跳转至此链接
			sourceId: 0,//客户来源
			ajaxType: 'get',//请求类型
			jsonp: false,//是否跨域
        	prefix: '../../',//地址前缀(可能是绝对路径)
        	jPlayer: 'false',//是否使用高级媒体播放器
        	upFileModule: {//上传文件模块
        		open: false,//是否启用功能
        		maxNum: 0,//最大上传数量，0为不限制
        		triggerId: 'triggerId',//触发上传按钮
        		startcall: function() {},//上传文件前的回调
        		callback: function() {},//上传文件后的回调
        	},
        	faceModule: {//表情模块
				open: false,//是否启用功能
				faceObj: {},//表情插件实例
        	},
        	starModule: {//星座模块
				open: false,//是否启用功能
        		triggerId: 'triggerId',//触发星座按钮
        	},
        	weatherModule: {//天气模块
				open: false,//是否启用功能
        		triggerId: 'triggerId',//触发天气按钮
        	},
        	helpfulModule: {//答案满意度模块
        	},
        	historyModule: {//历史记录模块
        	    open: true,//是否启用功能
        	},
        	autoOffline: true,//是否会自动下线
        	autoOnline: true,//是否会自动上线
    		noView: ['.MN_kfImg', '.MN_khImg', '.FA_upFileNoImg'],//图片放大预览 all/全不能预览 或者 指定不能预览的class['.MN_kfImg', '.MN_khImg', '.FA_upFileNoImg']
        	initCallback: function(data) {//初始化基本信息的回调
        		window.uselessReasonItems = data.uselessReasonItems;
        	},
        	sendCallback: function(question) {},//点击发送按钮的回调
        	commentCallback: function() {},//评论后的回调
        	leaveMsgCallback: function() {},//留言后的回调
        };

    window.Faqrobot = Faqrobot;

    function Faqrobot(options) {
        this.name = plugName;
        this.defaults = defaults;
        this._options = options;
        this.options = $.extend({}, defaults, options);
        this.robot = {};//机器人基本信息
        this.$obj = {};//元素集合
        this.isOffline = false;//当前是否下线
        this.init();
    }

    Faqrobot.prototype = {
        init: function() {
            this.getHrefInfo();//获取网址->网址有jid或sysNum，则相应配置参数失效
            this.initOffline();//关闭、刷新网页前请求下线->s=offline
            if(!this.options.jsonp) {//不跨域
            	this.initBaseInfo();//初始化基本信息->s=p->logo
            }
            this.initInput();//输入框准备->剩余字数/提示语
            this.askFlwQue();//回答引导问题->s=aq
            this.askGuideQue();//回答引导问题->s=aq
            if(this.options.upFileModule.open) {
            	this.upFile();//上传文件->s=uf
            }
            this.queComment();//问题满意度评价->s=addulc
            this.initComment();//服务满意评价度准备->提示语
            this.initLeaveMsg();//留言准备->提示语
            this.timeRequest();//定时请求->s=kl
            this.scrollbar();//调用滚动条插件
            this.clearRecord();//清除聊天记录
            this.closeWeb();//关闭网页
            if(this.options.starModule.open) {
            	this.star();//星座模块
            }
            if(this.options.weatherModule.open) {
            	this.weather();//天气模块
            }
            this.preview();
        },
        //获取网址->网址有jid或sysNum，则相应配置参数失效
        getHrefInfo: function() {
            var search = window.location.search,
                sysNum = search.match(/sysNum=(\d*[a-zA-Z]*[^?|^#|^&]*)/),
                jid = search.match(/jid=(\d+)/),
                sourceId = search.match(/sourceId=(\d+)/);
                
            if(sysNum) {
                this.options.sysNum = sysNum[1];
            }
            if(jid) {
                this.options.jid = jid[1];
            }
            if(sourceId) {
                this.options.sourceId = sourceId[1];
            }
            /*this.eventType = 'click';
            if(!MN_Base.isPC()) {// hack ios 点击document不失去焦点
                this.eventType = 'touchend';
            }*/
        },
        //初始化基本信息->s=p->logo/欢迎语/快捷服务/热门问题/用户信息
        initBaseInfo: function() {
        	var This = this;
        	$('#'+ This.options.inputCtnId).attr('readonly', 'readonly');
        	This.request({
        		params: {
                    s: 'p',
                    jid: This.options.jid,
        			sourceId: This.options.sourceId,//0->网页 1->微信 3->h5
        		},
        		callback: function(data) {
            		This.timerGo = true;//控制定时请求
        			This.options.initCallback(data);
        			$('#'+ This.options.inputCtnId).removeAttr('readonly');
        			This.setLogo(data);//设置logo->客服图标/客户图标
        			This.sayHello(data);//欢迎语
                    This.quickService(data);//快捷服务
                    This.recommendLink(data);//推荐资讯
                    This.topQue(data);//热门、常见问题
                    This.newQue(data);//新增问题
                    This.userInfo(data);//用户信息
                    This.poweredBy(data);//技术支持
                    if(This.options.configModule.open) {
            			This.configWin(data);// 配置窗口
                    }
                    if(This.options.historyModule.open) {
            			This.historyRecord();// 历史记录
            			This.recordEvent();// 历史记录
                    }
        		},
        	});
        },
        // 历史记录
        historyRecord: function() {
        	var This = this;
        	This.recordIndex = This.recordIndex ? ++This.recordIndex : 1;

    		This.request({
    			params: {
    	            s: 'hl',
    	            index: This.recordIndex
    			},
    			callback: function(data) {
    	    		if(data.status) {
    	    		}else {
    	    			if(data.list) {
    	    				if(data.list[0]) {
    	    					var html = '',
    	    						recordData = '';
    	    					This.scrollbar.options.autoBottom = false;// 防止自动滚动到底部
    	    					$('.MN_record').remove();// 防抖动
    	    					$('#'+ This.options.chatCtnId).prepend('<div class="MN_record">查看更多消息</div>');
    	    					for(var i=data.list.length-1; i>=0; i--) {
    	    						var _data = JSON.parse('{"robotAnswer":[{"ansCon":"'+ (data.list[i].reply).replace(/"/g, '\'').replace(/\s/g, '') +'", "time": "'+ data.list[i].dateTime +'"}]}');

    	    						recordData += (data.list[i].question?This.customHtml(This.replaceFace(data.list[i].question), data.list[i].dateTime):'') + (data.list[i].reply?This.robotHtml(_data):'');
    	    					}
    	    					$('.MN_record').attr('recordData', recordData.replace(/"/g, '\''));
    	    				}else {
    	    					This.scrollbar.options.autoBottom = false;// 防止自动滚动到底部
    	    					$('.MN_record').remove();// 防抖动
    	    				}
    	    			}else {
    	    				This.scrollbar.options.autoBottom = false;// 防止自动滚动到底部
    	    				$('.MN_record').remove();// 防抖动
    	    			}
    	    		}
    			},
    		});
        },
        // 查看历史记录
        recordEvent: function() {
        	var This = this;
        	$('#'+ This.options.chatCtnId).on('click.FA', '.MN_record', function() {
        		This.historyRecord();
        		var oldH = This.$obj.$chatCtnId.outerHeight();
    	    	This.$obj.$chatCtnId.prepend($(this).attr('recordData'));
        		var newH = This.$obj.$chatCtnId.outerHeight();
        		This.scrollbar.scrollTo(newH-oldH, true);// css 方式滚动
        	});
        },
        //设置logo->客服图标/客户图标
        setLogo: function(data) {
        	var $logoId = this.$obj.$logoId = $('#'+ this.options.logoId),
        		$webNameId = this.$obj.$webNameId = $('#'+ this.options.webNameId),
        		$webInfoId = this.$obj.$webInfoId = $('#'+ this.options.webInfoId);

            this.robot.kfPic = data.skinConfig ? data.skinConfig.kfPic : this.options.prefix+this.options.kfPic,//客服图标
            this.robot.khPic = data.skinConfig ? data.skinConfig.khPic : this.options.prefix+this.options.khPic;//客户图标
        	$logoId.attr({'src': data.webConfig.logoUrl || this.options.prefix+this.options.logoUrl});
    		$webNameId.text(data.webConfig.webName || this.options.webName);
    		$webInfoId.text(MN_Base.addDots($.trim(MN_Base.getPlainText(data.webConfig.info || this.options.webInfo)), 20));
    		if(!this.options.jsonp) {// 非跨域
    			document.title = data.webConfig.webName || this.options.webName;
    		}
    		//hack在微信等webview中无法修改document.title的情况
    		var $iframe = $('<iframe src="'+ (data.webConfig.logoUrl || this.options.prefix+this.options.logoUrl) +'"></iframe>').hide();
    		$iframe.on('load',function() {
    		    setTimeout(function() {
    		        $iframe.off('load').remove();
    		    }, 0);
    		}).appendTo('body');
        },
        //欢迎语
        sayHello: function(data) {
            this.$obj.$chatCtnId.empty().append(this.robotHtml(data));
        },
        scrollbarUpdate: function() {
        	this.scrollbar.scrollTo('bottom');
        },
        //机器人结构
        robotHtml: function(data, index) {
        	index = index || 0;//默认渲染机器人的第一句话
            var html = '',
                baseRobotHtml = '',
                gusListHtml = '',
                relateListHtml = '',
                commentHtml = '',
                aId = data.robotAnswer&&data.robotAnswer[index] ? data.robotAnswer[index].aId : 0,//
                cluid = data.robotAnswer&&data.robotAnswer[index] ? data.robotAnswer[index].cluid : 0;//查询问题上下文

            //机器人整体结构
            if(data.webConfig) {//欢迎语结构
                this.robot.robotName = data.webConfig.robotName;//机器人名字
                //%%
                var helloWord = data.webConfig.helloWord;
                if(data.chatLink) {
                	if(data.chatLink.helloWord) {
                		helloWord = data.chatLink.helloWord;
                	}
                }
                html = this.options.kfHtml[0].replace(/%aId%/g, aId).replace(/%cluid%/g, cluid).replace(/%kfPic%/g, this.robot.kfPic).replace(/%robotName%/g, this.robot.robotName).replace(/%helloWord%/g, helloWord).replace(/%formatDate%/g, this.getFormatDate());
            }else if(data.robotAnswer) {//机器人答案
            	if(data.robotAnswer[index]) {
                    //智能推荐相关问题结构->.MN_guideQue必须存在，搜索#.MN_guideQue查看原因
                    var has_ydWords = false;//是否已有上提示
                    if(data.robotAnswer[index].gusList) {
	                    if(!data.robotAnswer[index].relateList[0] && data.robotAnswer[index].gusList[0]) {
	                        var gusList = data.robotAnswer[index].gusList;
	                        if(gusList.length>0){
								gusListHtml= '<p>您是否要咨询以下问题？</p>';
	                        	has_ydWords = true;
							}
							for(var i=0; i<gusList.length; i++) {
	                            gusListHtml += '<div class="MN_gusList"><span>'+ (i+1) +'. </span><span class="MN_guideQue" sId="'+ gusList[i].solutionId +'" title="'+ gusList[i].seedQuestion.question +'">'+ gusList[i].seedQuestion.question +'</span></div>';
	                        }
	                    }
                    }

                    //智能推荐相关问题的上下提示
                    if(data.robotAnswer[index].gusWords) {
	                    if(!data.robotAnswer[index].relateList[0] && data.robotAnswer[index].gusWords) {
	                        var gusWords = data.robotAnswer[index].gusWords,
	                        	ydWords = '';

	                        if(!has_ydWords) {
	                        	ydWords = '<p>'+ (gusWords.ydWords || '您是否要咨询以下问题？') +'</p>';
	                        }
	                        gusListHtml = ydWords + gusListHtml +'<p>'+ gusWords.afterWords +'</p>';
	                    }
                	}

                    //手动设置相关问题结构->.MN_guideQue必须存在，搜索#.MN_guideQue查看原因
                    if(data.robotAnswer[index].relateList) {
                    	if(data.robotAnswer[index].relateList[0]) {
                    	    var relateList = data.robotAnswer[index].relateList;

                    	    for(var i=0; i<relateList.length; i++) {
                    	        relateListHtml += '<div class="MN_relateList"><span>'+ (i+1) +'. </span><span class="MN_guideQue" sId="'+ relateList[i].solutionId +'" title="'+ relateList[i].question +'">'+ relateList[i].question +'</span></div>';
                    	    }
                    	}
                    }

                    //是否满意结构
                    if(data.robotAnswer[index].aId>1000) {//aId!=0->需要评价
                        //%%
                        commentHtml = this.options.kfHtml[1];
                    }
                    var ansCon = data.robotAnswer[index].ansCon;
                    //%%
                    html = this.options.kfHtml[2].replace(/%kfPic%/g, this.robot.kfPic).replace(/%robotName%/g, this.robot.robotName).replace(/%ansCon%/g, this.replaceFace(ansCon)).replace(/%formatDate%/g, data.robotAnswer[index].time?this.getFormatDate(data.robotAnswer[index].time):this.getFormatDate()).replace(/%gusListHtml%/g, gusListHtml).replace(/%relateListHtml%/g, relateListHtml).replace(/%commentHtml%/g, commentHtml).replace(/%aId%/g, aId).replace(/%cluid%/g, cluid);
            	}
            }else {//彻底下线
                this.showMsg(data.message);//请重新刷新访问
            }

            return html;
        },
        //客户结构
        customHtml: function(word, time) {
            var html = '';

            html = this.options.khHtml.replace(/%khPic%/g, this.robot.khPic).replace(/%askWord%/g, word).replace(/%formatDate%/g, time?this.getFormatDate(time):this.getFormatDate());
            return html;
        },
        //快捷服务
        quickService: function(data) {
            if(!this._options.quickServId) {//不配置直接返回
                return;
            }

            var $quickServId = this.$obj.$quickServId = $('#'+ this.options.quickServId),//快捷服务Id
                quickLink = data.quickLink,
                str = '';
                
            //快捷服务结构
            if(quickLink[0]) {
                for(var i=0; i<quickLink.length; i++) {
                    str += '<a class="MN_quickLink" href="'+ quickLink[i].linkUrl +'" target="_blank"><img src="'+ quickLink[i].imageUrl +'"><p>'+ quickLink[i].name +'</p></a>';
                }
                $quickServId.empty().append(str);
            }
            
        },
        //推荐资讯
        recommendLink: function(data) {
            if(!this._options.recommendLinkId) {//不配置直接返回
                return;
            }
            var $recommendLinkId = this.$obj.$recommendLinkId = $('#'+ this.options.recommendLinkId),//推荐资讯Id
                chatFormSugLink = data.chatFormSugLink,
                str = '';
                
            //推荐资讯结构
            if(chatFormSugLink[0]) {
                for(var i=0; i<chatFormSugLink.length; i++) {
                    if(chatFormSugLink[i].type) {//1->图片
                        str += '<a class="MN_imgRecommendLink" href="'+ chatFormSugLink[i].linkUrl +'" target="_blank"><img src="'+ chatFormSugLink[i].content +'"></a>';
                    }else {//0->文字
                        str += '<a class="MN_wordRecommendLink" href="'+ chatFormSugLink[i].linkUrl +'" target="_blank"><p>'+ chatFormSugLink[i].content +'</p></a>';
                    }
                }
                $recommendLinkId.empty().append(str);
            }
            
        },
        //问题结构->热门、常见/新增/推荐
        queHtml: function(queList) {
            var str = '';

            //问题结构->.MN_guideQue必须存在，搜索#.MN_guideQue查看原因
            if(queList[0]) {
                for(var i=0; i<queList.length; i++) {
                    if(i+1 > this.options.maxQueNum) {//限制条数
                        break;
                    }
                    var question = queList[i].question,
                        maxQueLen = this._options.maxQueLen;

                    if(maxQueLen && maxQueLen<question.length) {//限制字数
                        question = question.substr(0, this.options.maxQueLen) +'...';
                    }

                    str += '<div class="MN_queList"><span class="MN_queListIndex">'+ (i+1) +' </span><span class="MN_guideQue" sId="'+ (queList[i].solutionId+1) +'" title="'+ queList[i].question +'">'+ question +'</span></div>';
                }
            }
            return str;
        },
        //热门、常见问题
        topQue: function(data) {
            if(!this._options.topQueId) {//不配置直接返回
                return;
            }

            var $topQueId = this.$obj.$topQueId = $('#'+ this.options.topQueId),//热门问题Id
                topAsk = data.topAsk;
            
            $topQueId.empty().append(this.queHtml(topAsk));
        },
        //新增问题
        newQue: function(data) {
            if(!this._options.newQueId) {//不配置直接返回
                return;
            }

            var $newQueId = this.$obj.$newQueId = $('#'+ this.options.newQueId),//新增问题Id
                newAdd = data.newAdd;

            $newQueId.empty().append(this.queHtml(newAdd));
        },
        //推荐问题
        recommendQue: function(data, index) {
        	index = index ? index : 0;//默认渲染机器人的第一句话
            if(!this._options.recommendQueId) {//不配置直接返回
                return;
            }

            var $recommendQueId = this.$obj.$recommendQueId = $('#'+ this.options.recommendQueId),//推荐问题Id
                relateLessList = data.robotAnswer[index].relateLessList;

            $recommendQueId.empty().append(this.queHtml(relateLessList));
        },
        //用户信息
        userInfo: function (data) {
            if(!this._options.userInfoId) {//不配置直接返回
                return;
            }

            var $userInfoId = this.$obj.$userInfoId = $('#'+ this.options.userInfoId),//用户信息Id
                str = '';

            var info = data.webConfig.info || data.company.info || '',//简介
            	webName = data.webConfig.webName || data.company.webName || '',//名称
            	serviceQq = data.webConfig.serviceQq || data.company.qq || '',//QQ
            	serviceTel = data.webConfig.serviceTel || data.company.tel || '',//电话
            	webSite = data.webConfig.webSite || data.company.webSite || '',//网址
            	address = data.company.address || '',//地址
            	notice = data.company.notice || '',//通知
            	openTime = data.company.openTime || '';//工作时间

            if(info) {
                str += '<div class="MN_info MN_userInfo"><span>简介：'+ info +'</span></div>';
            }
            if(webName) {
                str += '<div class="MN_webName MN_userInfo"><span>名称：'+ webName +'</span></div>';
            }
            if(serviceQq) {
                str += '<div class="MN_serviceQq MN_userInfo"><span>QQ：'+ serviceQq +'</span></div>';
            }
            if(serviceTel) {
                str += '<div class="MN_serviceTel MN_userInfo"><span>电话：'+ serviceTel +'</span></div>';
            }
            if(webSite) {
                str += '<div class="MN_webSite MN_userInfo"><span>网址：'+ webSite +'</span></div>';
            }
            if(address) {
                str += '<div class="MN_address MN_userInfo"><span>地址：'+ address +'</span></div>';
            }
            if(notice) {
                str += '<div class="MN_notice MN_userInfo"><span>通知：'+ notice +'</span></div>';
            }
            if(openTime) {
                str += '<div class="MN_openTime MN_userInfo"><span>工作时间：'+ openTime +'</span></div>';
            }

            $userInfoId.empty().append(str);

        },
        //调用滚动条插件
        scrollbar: function() {
        	this.scrollbar = this.$obj.$chatCtnId.parent().scrollbar({
        		// autoBottom: true,//内容改变，是否自动滚动到底部
				stopCallback: function(top, direction) {//停止时事件回调
					if(direction<0) {
						$('.MN_record').trigger('click.FA');
					}
				},
        	});
        },
        //发送问题->s=aq
        askQue: function() {
            var This = this,
                question = This.$obj.$inputCtnId.val().replace(/\n+/g, '');//发送的问题

    	    This.scrollbar.options.autoBottom = true;// 恢复自动滚动到底部
            if(question) {//问题不为空
                This.options.sendCallback(question);//点击发送按钮的回调
                if(question.indexOf('%我要发文件%')+1) {//发文件
                	This.$obj.$chatCtnId.append(This.customHtml('<div class="FA_'+ question.match(/ran\d+/) +' FA_upFileCtn">loading...</div>'));//添加我的话
                }else {//问问题
                	This.$obj.$chatCtnId.append(This.customHtml(This.replaceFace(This.$obj.$inputCtnId.val())));//添加我的话
                	if(This.robot.html) {// 当 This.robot.html 不为空时，走模拟数据
                		data = JSON.parse('{"robotAnswer":[{"ansCon":"'+ (This.robot.html).replace(/"/g, '\'').replace(/\s/g, '') +'"}]}');
                		This.$obj.$chatCtnId.append(This.robotHtml(data));//添加机器人的话
                		This.recommendQue(data);//推荐问题
                	}else {
                		This.request({
                		    params: {
                		        s: 'aq',
                		        question: question,
                		    },
                		    callback: function(data) {
            		    		This.$obj.$chatCtnId.append(This.robotHtml(data));//添加机器人的话
            		    		This.recommendQue(data);//推荐问题
                		    }
                		});
                	}
                }
                This.robot.html = '';
                This.$obj.$inputCtnId.val('');//清空输入框
                $(document).trigger('keyup');

            }
        },
        //转义表情
        replaceFace: function(data) {
			if(this.options.faceModule.open) {
				var src = this.options.faceModule.faceObj.options.src,
					faceType = this.options.faceModule.faceObj.obj.faceType,
					face = this.options.faceModule.faceObj.obj.face;

				for(var i in face) {
					if(i == faceType[0]) {
						for(var j=0; j<face[i].length; j++) {//考虑到含有特殊字符，不用正则
							while(data.indexOf(face[i][j][1])+1) {
								var index = data.indexOf(face[i][j][1]),
									len = face[i][j][1].length,
									str1 = data.substr(0, index),
									str2 = data.substr(index+len);
								data = str1 +'<img src="'+ src + j +'.'+ faceType[2] +'">'+ str2;
							}
						}
					}
				}
			}
        	return data;
        },
        //回答流程问题->s=getflw
        askFlwQue: function() {
            var This = this;

            $('body').on('click.FA', '.wflink', function() {//.wflink是后台约定，无法改变
                var $This = $(this);

                This.$obj.$chatCtnId.append(This.customHtml($This.text()));//添加我的话
                This.request({
                    params: {
                        s: 'getflw',
                        fid: $This.attr('rel'),
                        question: $This.text(),
                    },
                    callback: function(data) {
                        This.$obj.$chatCtnId.append(This.robotHtml(data));//添加机器人的话
                    }
                });
            });
        },
        //回答引导问题->s=aq
        askGuideQue: function() {
            var This = this;

            $('body').on('click.FA', '.MN_queList, .MN_gusList, .MN_gusList, .MN_relateList', function() {//#.MN_guideQue的父级是必不可少的
                var $This = $(this).find('.MN_guideQue');

                This.$obj.$chatCtnId.append(This.customHtml($This.attr('title')));//添加我的话
                This.request({
                    params: {
                        s: 'aq',
                        sId: $This.attr('sId'),
                        question: $This.attr('title'),
                    },
                    callback: function(data) {
                        This.$obj.$chatCtnId.append(This.robotHtml(data));//添加机器人的话
                    }
                });
            });
        },
        //问题满意度评价->s=addulc
        queComment: function() {
            var This = this;

            This.$obj.$chatCtnId.on('click.FA', '.MN_yes, .MN_no', function() {
                var $This = $(this),
                    s = 'addufc';//满意

                if($This.is('.MN_no')) {
                    s = 'addulc';//不满意
                }

                This.request({
                    params: {
                        s: s,
                        aId: $This.parents('.MN_answer').attr('aId'),
                        cluid: $This.parents('.MN_answer').attr('cluid'),
                    },
                    callback: function(data) {
                    	if(This.options.helpfulModule.open) {
                    		var $helpful = $This.parents('.MN_helpful');
                    		if(s=='addufc') {
                    			This.options.helpfulModule.yesCallback($helpful);
                    		}else {
                    			This.options.helpfulModule.noCallback($helpful);
                    		}
                    	}else {
                        	$This.parents('.MN_helpful').text('感谢您的评价！');
                    	}
                    }
                });
            });

            // 答案不满意原因
            This.$obj.$chatCtnId.on('click.FA', '.MN_reasonSend', function() {
                var $This = $(this),
                	$form = $This.parents('.MN_helpful').prev('.MN_reasonForm');
                This.request({
                    params: {
                    	s: 'ulreason',
                    	aId: $This.parents('.MN_answer').attr('aId'),
                    	cluid: $This.parents('.MN_answer').attr('cluid'),
                    },
                    $formObj: $form,
                    callback: function(data) {
                    	if(!data.status) {
                    		$form.remove();
                        	$This.parents('.MN_helpful').text('感谢您的评价！');
                    	}
                    }
                });
            });
            
        },
        //上传文件->s=uf
        upFile: function() {
        	var This = this;
        	var $file = $('<input type="file" class="FA_file" multiple="multiple">').css({
        		'padding': 100,
        		'opacity': 0
        	}).appendTo($('#'+ this.options.upFileModule.triggerId));

        	H5_upload('../../servlet/AQ?s=uf', this.options.upFileModule.maxNum, $file, this.$obj.$chatCtnId, function(ran) {
		    	$('#'+ This.options.inputCtnId).val('%我要发文件%'+ ran);
    			$('#'+ This.options.sendBtnId).trigger('click.FA');
    			This.options.upFileModule.startcall && This.options.upFileModule.startcall();
        	}, function(data, ran) {  
        		if(data.status) {
        			This.showMsg(data.message);
        			$('.FA_'+ ran).parents('.MN_ask').remove();
        		}else {
        			var html = '';
        			for(var i=0,len=data.sendUrlMsg.length; i<len; i++) {
        				switch(data.sendUrlMsg[i].type){
        					case 0://非图片
        						html += '<div class="FA_upFileItem"><a href="'+ data.sendUrlMsg[i].url +'" target="_blank"><img class="FA_upFileImg FA_upFileNoImg" src="'+ base64 +'"><p class="FA_upFileName">'+ data.sendUrlMsg[i].name +'</p></a></div>';
        						break;
        					case 1://图片，不加a，防止跳转
        						html += '<div class="FA_upFileItem"><img class="FA_upFileImg" src="'+ data.sendUrlMsg[i].url +'"><p class="FA_upFileName">'+ data.sendUrlMsg[i].name +'</p></div>';
        						break;
        				}
        			}
        			$('.FA_'+ ran).empty().append(html);
        		}
        	});
        },
        //星座模块
        star: function() {
        	var This = this;

        	$('head').append('<link rel="stylesheet" href="images/star.css?t='+ new Date() +'">');
        	$('#'+ This.options.starModule.triggerId).on('click.FA', function() {
        		This.robot.html = '';
                This.$obj.$inputCtnId.val('星座分析');
                var starArr = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座' ];

                for(var i=0; i<12; i++) {
                	This.robot.html += '<span class="FA_starCtn" title="'+ starArr[i] +'"><i class="FA_icon-star icon-star'+ (i+1) +'"></i><p class="FA_star">'+ starArr[i] +'</p></span>';
                }
                This.$obj.$sendBtnId.trigger('click.FA');
        	});

        	This.$obj.$chatCtnId.on('click', '.FA_starCtn', function() {
        		var $This = $(this);
        		This.$obj.$inputCtnId.val($This.attr('title'));
                This.request({
                	prefix: 'http://webchat.faqrobot.org/servlet/api/apiservice',
            		dataType: 'jsonp',
                    params: {
                        key: 'jiandanwentichaxun',
                        state: 'constellation',
                        consName: $This.attr('title'),
                        type: 'today',
                    },
                    callback: function(data) {
                    	if(data.result == 200) {//y
		            		This.robot.html = '<div class="FA_starCtn_float">'+ $This[0].outerHTML +'<span class="FA_starCtn_down">'+ data.response+ '</span></div>';
			                This.$obj.$sendBtnId.trigger('click.FA');
                    	}
                    }
                });
        	});
        },
        //天气模块
        weather: function() {
        	var This = this;
        	$('#'+ This.options.weatherModule.triggerId).on('click.FA', function() {
        		if(This.robot.ip) {
        			This.getWeather(This.robot.ip);
        		}else {
        			This.request({//获取ip
        				prefix: 'http://chaxun.1616.net/s.php',
        				dataType: 'jsonp',
        			    params: {
        			        type: 'ip',
        			        output: 'json'
        			    },
        			    callback: function(data) {
        			    	This.robot.ip = data.Ip;
        			    	This.getWeather(This.robot.ip);
        			    }
        			});
        		}
                
        	});

        	$(This.$obj.$chatCtnId, '.FA_star').on('click', function() {
        		
        	});
        },
        getWeather: function(ip) {
        	var This = this;
            This.$obj.$inputCtnId.val('今天天气怎么样？');
            This.request({
            	prefix: 'http://webchat.faqrobot.org/servlet/api/apiservice',
        		dataType: 'jsonp',
                params: {
                    key: 'jiandanwentichaxun',
                    state: 'weather',
                    ip: This.robot.ip,
                    type: 'json',
                },
                callback: function(data) {
                    if(data.result == 100) {//y
                    	if(data.list[0]) {
                    		var picUrl = data.list[0].dayPictureUrl;
                    		if(This.isNight() == 'night') {//黑夜
                    			picUrl = data.list[0].nightPictureUrl;
                    		}
		            		This.robot.html = '<div class="FA_weather"><img src="'+ picUrl +'"><p>'+ data.city +' '+ data.list[0].weather + data.list[0].temperature +'</p><p>'+ data.sug +'</p></div>';

			                //点击发送
			                This.$obj.$sendBtnId.trigger('click.FA');
                    	}
                	}
                }
            });
        },
        //技术支持
        poweredBy: function(data) {
            var $poweredCtnId = this.$obj.$poweredCtnId = $('#'+ this.options.poweredCtnId);//技术支持框

            if(data.webConfig.level >= 3) {
                $poweredCtnId.remove();
            }
        },
        //输入框准备->剩余字数/提示语
        initInput: function() {
            var This = this,
                $inputCtnId = This.$obj.$inputCtnId = $('#'+ This.options.inputCtnId),//输入框
                $tipWordId = This.$obj.$tipWordId = $('#'+ This.options.tipWordId),//提示语
                $remainWordId = This.$obj.$remainWordId = $('#'+ This.options.remainWordId),//剩余字数
                $sendBtnId = This.$obj.$sendBtnId = $('#'+ This.options.sendBtnId),//发送按钮
                $chatCtnId = This.$obj.$chatCtnId = $('#'+ This.options.chatCtnId);//聊天显示框

            //预处理
            $tipWordId.text(This.options.tipWord);
            $remainWordId.text(This.options.remainWordNum);

            //判断浏览器类型
            var isIE = false,
                browser = This.myBrowser();

            if (browser == "IE") {
                isIE = true;
                $tipWordId.show();
            }else {
                isIE = false;
            	$inputCtnId.attr({'placeholder': This.options.tipWord}).focus();
                $tipWordId.hide();
            }

            //键盘事件
            $(document).on('keyup.FA', function(e) {
                This.remainWord($inputCtnId, $tipWordId, $remainWordId);
                var isInputCtn = $(document.activeElement).is('#'+ This.options.inputCtnId);

                if(e.keyCode==13 && isInputCtn) {//Enter键发送
                    This.askQue();
                }
            });

            //文本框改变事件
            $inputCtnId.on('input.FA, propertychange.FA', function(e) {
                $(document).trigger('keyup');
                $tipWordId.hide();
            });

            //鼠标事件
            $inputCtnId.on('focus.FA, blur.FA', function(e) {
                if(isIE) {
                    if(e.type == 'focus') {
                    	if($(this).val()) {
                            $(document).trigger('keyup');
                            $tipWordId.hide();
                    	}
                    }else {
                    	if(!$(this).val()) {
                        	$tipWordId.show();
                    	}
                    }
                }
            });
            $tipWordId.on('click.FA', function(e) {
                $inputCtnId.trigger('focus');
            });

    		//点击发送
            $sendBtnId.on('click.FA', function() {
                This.askQue();
            	setTimeout(function(){
            		$inputCtnId.focus();
            	}, 50);
            });
        },
        //服务满意评价度准备->提示语
        initComment: function() {
            var This = this,
                $commentFormId = This.$obj.$commentFormId = $('#'+ This.options.commentFormId),//评论框
                $commentInputCtnId = This.$obj.$commentInputCtnId = $('#'+ This.options.commentInputCtnId),//评论输入框
                $commentTipWordId = This.$obj.$commentTipWordId = $('#'+ This.options.commentTipWordId),//评论输入框提示语
                $commentSendBtnId = This.$obj.$commentSendBtnId = $('#'+ This.options.commentSendBtnId);//评论发送按钮

            //预处理
            $commentTipWordId.text(This.options.commentTipWord);

            //判断浏览器类型
            var isIE = false,
                browser = This.myBrowser();

            if (browser == "IE") {
                isIE = true;
                $commentTipWordId.show();
            }else {
                isIE = false;
            	$commentInputCtnId.attr({'placeholder': This.options.commentTipWord});
                $commentTipWordId.hide();
            }

            
            $commentInputCtnId.on('input.FA, propertychange.FA', function(e) {
                $(document).trigger('keyup');
                $commentTipWordId.hide();
            });

            //鼠标事件
            $commentInputCtnId.on('focus.FA, blur.FA', function(e) {
                if(isIE) {
                    if(e.type == 'focus') {
                    	if($(this).val()) {
                            $(document).trigger('keyup');
                            $commentTipWordId.hide();
                    	}
                    }else {
                    	if(!$(this).val()) {
                        	$commentTipWordId.show();
                    	}
                    }
                }
            });
            $commentTipWordId.on('click.FA', function(e) {
                $commentInputCtnId.trigger('focus');
            });

            //点击发送
            $commentSendBtnId.on('click.FA', function() {
                This.servComment();
            });
        },
        //服务满意度评价->s=fadeback
        servComment: function() {
            var This = this,
                sub = '',
                $inputs = $('input[type=checkbox]', This.$obj.$commentFormId);

            for(var i=0; i<$inputs.length; i++) {
                var $input = $inputs.eq(i);

                if($input.prop('checked')) {
                    sub += $input.val() + ',';
                }
            }

            This.request({
                params: {
                    s: 'fadeback',
                    sub: sub,//多个原因集合(必需参数)
                },
                $formObj: $('#'+ This.options.commentFormId),//被序列化的form表单
                callback: function(data) {
                    if(data.status) {
                    	This.showMsg(data.message);
                    }else {
                    	This.options.commentCallback(data);

                    	if(MN_Base.isPC()) {
                        	//询问框
                        	layer.msg(data.message +'您是否还有其他问题？', {
								time: 20000, //20s后自动关闭
								btn: ['继续问答', '关闭'],
    							area: This.getSuitSize(),
								cancel: function() {// 关闭当前页面
                        			This.closeWebPage();
								}
                        	});
        	            }else {
                        	layer.msg(data.message);
        	            }
                    }
                }
            });
        },
        //留言准备->提示语
        initLeaveMsg: function() {
            var This = this,
                $leaveMsgFormId = This.$obj.$leaveMsgFormId = $('#'+ This.options.leaveMsgFormId),//评论框
                $leaveMsgInputCtnId = This.$obj.$leaveMsgInputCtnId = $('#'+ This.options.leaveMsgInputCtnId),//评论输入框
                $leaveMsgTipWordId = This.$obj.$leaveMsgTipWordId = $('#'+ This.options.leaveMsgTipWordId),//评论输入框提示语
                $leaveMsgSendBtnId = This.$obj.$leaveMsgSendBtnId = $('#'+ This.options.leaveMsgSendBtnId);//评论发送按钮

            //预处理
            $leaveMsgTipWordId.text(This.options.leaveMsgTipWord);

            //判断浏览器类型
            var isIE = false,
                browser = This.myBrowser();

            if (browser == "IE") {
                isIE = true;
                $leaveMsgTipWordId.show();
            }else {
                isIE = false;
            	$leaveMsgInputCtnId.attr({'placeholder': This.options.leaveMsgTipWord});
                $leaveMsgTipWordId.hide();
            }

            //鼠标事件
            $leaveMsgInputCtnId.on('focus.FA, blur.FA', function(e) {
                if(isIE) {
                    if(e.type == 'focus') {
                    	if($(this).val()) {
                            $(document).trigger('keyup');
                            $leaveMsgTipWordId.hide();
                    	}
                    }else {
                    	if(!$(this).val()) {
                        	$leaveMsgTipWordId.show();
                    	}
                    }
                }
            });
            $leaveMsgTipWordId.on('click.FA', function(e) {
                $leaveMsgInputCtnId.trigger('focus');
            });

            //点击发送
            $leaveMsgSendBtnId.on('click.FA', function() {
                This.servLeaveMsg();
            });
        },
        //留言->s=leavemsg
        servLeaveMsg: function() {
            var This = this;

            This.request({
                params: {
                    s: 'leavemsg',
                },
                $formObj: $('#'+ This.options.leaveMsgFormId),//被序列化的form表单
                callback: function(data) {
                    This.showMsg(data.message);
                    if(!data.status) {
                    	This.options.leaveMsgCallback();
                    }
                }
            });
        },
        //是否开始计时
        beginCount: function(bool) {
            this.timerGo = bool;

        	if(bool) {//开始定时请求
    			this.initBaseInfo();//初始化基本信息->s=p->logo
        	}else {
                this.offline();
        	}
        },
        //定时请求->s=kl
        timeRequest: function() {
            var This = this,
                tspan = 2000;//请求间隔

            $(window).on('focus', function() {
            	This.mouseIsOn = true;
            });
            $(window).on('blur', function() {
            	This.mouseIsOn = false;
            });

            (function resetTimer() {
                var timer = setInterval(function() {
                	if(This.timerGo) {//阻塞请求
                		This.request({
                		    params: {
                		        s: 'kl',
                		    },
                		    callback: function(data) {
                		    	//人工对话
                		    	if(data.robotAnswer) {
                		    		if(data.robotAnswer[0]) {
                		    			for(var i=0,len=data.robotAnswer.length; i<len; i++) {
            		    	        		This.$obj.$chatCtnId.append(This.robotHtml(data, i));//添加机器人的话
        		    	        				This.recommendQue(data, i);//推荐问题
                		    			}
                		    		}
                		    	}

                		        clearInterval(timer);
                		        if(data.status == -1) {// 接口返回状态错误时，重新上线

                		        }else if(data.tspan < 2000) {
                		        	tspan = data.tspan*1000;
                		            resetTimer();
                		            This.timerGo = true;
                		            return;
                		        }// else 
                		        // s=p重新上线
            		        	if(This.options.autoOnline) {
            		        		if(This.mouseIsOn) {// 鼠标在窗口内部
                		    			This.request({
                		    				params: {
                		    		            s: 'p',
                		    		            jid: This.options.jid,
                		    					sourceId: This.options.sourceId,//0->网页 1->微信 3->h5
                		    				},
        		    						callback: function(data) {
                								tspan = 10000;//请求间隔
                		            			resetTimer();
        		    							This.timerGo = true;
        		    						}
                		    			});
            		        		}
            		        	}else {
        		        			if(This.options.autoOffline) {//可自动下线
        		        		    	This.offline();
        		        			}
        		        		    This.timerGo = false;
            		        	}
                		    }
                		});
                	}
                }, tspan);
            })();
        },
        //图片放大预览
        preview: function() {
        	var This = this;
        	$('<div class="FA_previewCtn"><span  class="FA_previewClose">×</span><i  class="FA_previewMask"></i><div class="FA_previewImgCtn"></div></div>').hide().appendTo('body');
        	$('.FA_previewImgCtn, .FA_previewClose').on('click.FA', function(e) {
            		if(e.target.className != 'FA_previewImg') {
            			$('.FA_previewCtn').hide().find('img').remove();
            		}
        		});
        	if(This.options.noView != 'all') {
        		This.$obj.$chatCtnId.on('click.FA', 'img', function(e) {
        			var noViewArr = [];
        			for(var i=0; i<This.options.noView.length; i++) {
        				noViewArr[i] = 1;
        				if($(e.target).is(This.options.noView[i])) {
        					noViewArr[i] = 0;
        				}
        			}
        			if(!(noViewArr.join('').indexOf('0')+1)) {
            			MN_Base.getNaturalSize(e.target, function(w, h) {
            				var $img = $('<img class="FA_previewImg" src="'+ e.target.src +'">').css({
            					width: w,
            					height: h,
            					marginTop: -h/2,
            					marginLeft: -w/2,
            				}).appendTo($('.FA_previewImgCtn'));
            				$('.FA_previewCtn').show();
            				if(w > $(window).width()) {
            					$img.css({
            						marginLeft: 0,
            						left: 0
            					});
            				}
            				if(h > $(window).height()) {
            					$img.css({
            						marginTop: 0,
            						top: 0
            					});
            				}
            			})
        			}
        		});
        	}
        },
        //关闭网页
        closeWeb: function() {
            if(!this._options.closeBtnId) {//不配置直接返回
                return;
            }

            var This = this,
                $closeBtnId = this.$obj.$closeBtnId = $('#'+ this.options.closeBtnId);//关闭按钮

            $closeBtnId.on('click.FA', function() {
                if(confirm('确定要退出吗？')) {
                    This.closeWebPage();
                }
            });
        },
        //关闭浏览器兼容
        closeWebPage: function() {
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
        },
        //关闭、刷新网页前请求下线->s=offline
        initOffline: function() {
            var This = this;

            $(window).on('beforeunload.FA, unload.FA', function() {
                This.offline();
            });
        },
        //下线请求->s=offline
        offline: function() {
            this.request({
                params: {
                    s: 'offline',
                }
            });
        },
        //剩余字数统计
        remainWord: function($input, $tip, $word) {
            var nowNum = 0,
                maxNum = this.options.remainWordNum,
                word = $input.val(),
                len = word.toString().length;

            if(len > maxNum) {
                word = word.substr(0, maxNum);
                $input.val(word);
                len = word.toString().length;
            }
            $word.text(maxNum - len);
        },
        //判断浏览器类型
        myBrowser: function() {
            var userAgent = navigator.userAgent,
                isOpera = userAgent.indexOf("Opera") > -1;

            if (isOpera) {
                return "Opera";
            };
            if (userAgent.indexOf("Firefox") > -1) {
                return "FF";
            }
            if (userAgent.indexOf("Chrome") > -1){
                return "Chrome";
            }
            if (userAgent.indexOf("Safari") > -1) {
                return "Safari";
            }
            if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
                return "IE";
            };
        },
        //清除聊天记录
        clearRecord: function() {
            var This = this,
                $clearBtnId = this.$obj.$clearBtnId = $('#'+ this.options.clearBtnId);

            $clearBtnId.on('click.FA', function() {
                This.$obj.$chatCtnId.children().eq(0).siblings().remove();
            });
        },

        //请求->所有的请求都需要经过(特殊的除外)
		request: function(options) {
			var This = this,
			    params = {//必须参数
			    	sysNum: This.options.sysNum,
			    	sourceId: This.options.sourceId
			    },
			    defaults = {
			        $formObj: $(),//被序列化的form表单
			        dataObj: {},
			        callback: function(){},//回调函数(callback)
			    },
			options = $.extend({}, defaults, options);
			formData = $.extend({}, This.formatSeriData(decodeURIComponent((options.$formObj.serialize()))), options.dataObj);

			if(This.options.jsonp) {//jsonp 需要配置绝对地址
				if(!This.options.prefix.match(/^http/)) {
					layer.msg('开发者提醒：当前跨域，请配置绝对地址');
				}
			}else {

			}


			$.ajax({
			    url: encodeURI(options.prefix || (This.options.prefix + 'servlet/AQ')),//...为基础地址
			    type: This.options.ajaxType,//默认get
			    dataType: options.dataType || (This.options.jsonp?'jsonp':'json'),//默认json
			    data: $.extend({}, params, options.params, formData),
			    cache: false,//IE下有用
			    success: function(data) {
			        if(data) {
			        	if(data.status) {//x
			        		if(data.status == -1) {//站点不存在/长时间离开
			        			if(data.message == '您长时间没有交互信息，请重新刷新访问.') {
			        				if(!This.options.autoOnline) {
			        		    		This.showMsg(data.message);
			        				}
			        			}else {
			        		    	This.showMsg(data.message);
			        			}
			        		    return;
			        		}else if(data.status == -2) {//未登录第三方账户
			        			This.showMsg(data.message, function() {
			        			    window.location.href = This.options.thirdUrl;
			        			});
			        			return;
			        		}else {
			            		options.callback(data);
			        		}
			        	}else {//y
			            	options.callback(data);
			        	}
			            
			        }
			    },
			});
		},
        //格式化被序列化后的数据->a=1&b=2化为{a:1, b:2}
        formatSeriData: function(data) {
            if(!data) {
                return;
            }
            var obj = '',
                dot = ',',      
                arr = data.match(/[^&]+/g);

            for(var i=0; i<arr.length; i++) {
                var str = arr[i].match(/([^=]+)=([^=]*)/);
                if(i==arr.length - 1) {
                    dot = '';
                }
                obj += '"'+ str[1] +'"' +":"+ '"'+ str[2] +'"'+ dot;
            }
            return JSON.parse('{'+ obj +'}');
        },
		//信息提示
		showMsg: function(message, callback) {
			layer.msg(message, {
				shift: 0,
				area: this.getSuitSize()
			}, function() {
				if(callback) {
				    callback();
				}
			});
			$(window).trigger('resize');
		},
		// 获取提示框合适的大小
		getSuitSize: function() {
			return MN_Base.isPC()?'400px':'0.8rem';
		},
        //获取格式化时间
        getFormatDate: function(time) {// 2016-11-21 09:36:43
            time = time ? time.match(/(\d+)-(\d+)-(\d+)\s(\d+):(\d+):(\d+)/) : [];
            var today = new Date(),
                year = time[1] || today.getFullYear(),
                month = time[2] || this.addZero(today.getMonth() + 1),
                date = time[3] || this.addZero(today.getDate()),
                hour = time[4] || this.addZero(today.getHours()),
                minute = time[5] || this.addZero(today.getMinutes()),
                second = time[6] || this.addZero(today.getSeconds());

            var result = this.options.formatDate.replace(/%hour%/g, hour).replace(/%minute%/g, minute).replace(/%second%/g, second).replace(/%year%/g, year).replace(/%month%/g, month).replace(/%date%/g, date);

            return result;
        },
        //是否是黑夜 7/8-18/19-day 20/21-6/7-night
        isNight: function() {
        	var today = new Date(),
        	    hour = this.addZero(today.getHours());
        	if(hour>=7 && hour <=19) {
        		return 'day';
        	}else {
        		return 'night';
        	}
        },
        //个位数前面加0
        addZero: function(num) {
            return num<10 ? "0" + num : num;
        },
    }

})(MN, window, document);
/**************************** END ****************************/

