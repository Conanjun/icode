;$(function() {
    //根据不同账号去掉+号
	var tmpsysNum=getUrlParam('sysNum'),ifCurSysNum=false;
	if(tmpsysNum=='149750804604820959' || tmpsysNum=='149750805214520963' || tmpsysNum=='149750805597620967' || tmpsysNum=='149750806038320971'){
		ifCurSysNum=true;
	}
	if(ifCurSysNum){
		$('#sendBtn').show().siblings().hide();
	}
	FastClick.attach(document.body);
    set_chatScroll_height();
    function set_chatScroll_height() {
        var winW = $(window).width(),
            winH = $(window).height();
        $('html').css('fontSize', winW<750 ? winW : 750);
        $('.chatScroll').height(winH-$('.editCtn').outerHeight());
    }

    $(window).on('resize', function() {
        set_chatScroll_height();
    });

    //显示发送按钮
    $('.textarea').on('input', function() {
        if(!ifCurSysNum){
			if($(this).val()) {
				$('.sendBtn').show().siblings().hide();
			}else {
				$('.addbtn').show().siblings().hide();
			}
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
	//调用自动补全插件
    $('.textarea').autocomplete({
        url: '../../servlet/appChat?s=ig',//[string]
        targetEl: $('.editShow'),//参照物(用于appendTo和定位)
        posAttr: ['0rem', '0.133rem'],//外边框的定位[left bottom]
        itemNum: 5,//[int] 默认全部显示
        callback: function(data) {//获取文本后的回调函数
            $('.sendBtn').trigger('click');
        }
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
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); 
		var r = window.location.search.substr(1).match(reg);  
		if (r !== null) return decodeURIComponent(r[2]); return null; 
	}

    //调用表情插件
    var Face = $('.textarea').face({
        src: 'src/yun/',//表情路径
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
    var FAQ = new Faqrobot({
        interface:'servlet/appChat',
		//sysNum: 1000000,//客户唯一标识
        //jid: 0,//自定义客服客户图标
        //robotName: 'FaqRobot',//机器人名称
        logoUrl: 'robot/skin/h5chat/images/logo@2x.png',//logo地址 ----------
        logoId: 'logo',// ----------
        webNameId: 'MN_logoWord',//公司名称Id
        intelTitleChange: true,// 智能聊天是否修改标题
        intelTitle: '',// 智能聊天时的标题
        artiTitleChange: true,// 人工时是否修改标题
        artiTitle: '人工客服',// 人工时的标题
        titleInsteadId: 'title',// 代替标题Id
        //userInfoId: 'userInfoId',//用户信息Id
        kfPic: 'robot/skin/h5chatzbj/images/zbj.png',  //客服图标
        khPic: 'robot/skin/h5chatzbj/images/userIcon.png', //客户图标
        formatDate: '%month%月%date%日 %hour%:%minute%:%second%',//配置时间格式(默认10:42:52 2016-06-24)
        topQueId: 'commonQueLayer',//热门、常见问题Id --------
        kfHtml: [
            '<div class="MN_answer_welcome MN_answer"><div class="MN_kftime">%formatDate%</div><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%helloWord%</div></div>',//欢迎语组合
            '<div class="MN_helpful" style="margin-top: 8px;padding-top: 8px;border-top: 1px solid #e1e1e1;"><span class="MN_reasonSend">提交</span><span class="MN_yes">有帮助</span><span class="MN_no">无帮助</span></div>',//是否满意组合
            '<div class="MN_answer" aId="%aId%" cluid="%cluid%"><div class="MN_kftime">%formatDate%</div><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%ansCon%%gusListHtml%%relateListHtml%%commentHtml%</div></div>',//回答组合
            '<div class="MN_answer" aId="%aId%" cluid="%cluid%"><div class="MN_kftime">%formatDate%</div><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%ansCon%%gusListHtml%%relateListHtml% <div style="margin-top:5px"><div style="float:right">%commentHtml%</div> <div class="foldBtn pull-left"><span class="foldBtn-icon"><i class="fa fa-angle-down"></i></span><span class="fold-txt">查看更多</span></div></div> </div></div>'//折叠回答组合
          ],//客服结构(所有的属性和%xxx%都必须存在)
          setInputTop:true,
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
        upFileModule: {//上传文件模块
            open: true,//是否启用功能
            maxNum: 2,//最大上传数量，0为不限制
            triggerId: 'sendPic',//触发上传按钮
            startcall: function() {//上传文件前的回调
                set_chatScroll_height();
            },
            callback: function() {//上传文件后的回调
            },
        },
        upFileModuleCam: {//上传文件模块
            open: true,//是否启用功能
            maxNum: 0,//最大上传数量，0为不限制
            triggerId:'takePhoto',//触发上传按钮
            startcall: function() {//上传文件前的回调
                set_chatScroll_height();
            },
            callback: function() {//上传文件后的回调
            },
        },
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
        sourceId:tmpsourceId,//客户来源
        //ajaxType: 'get',
        leaveQue: {// 未知问题已回复
            open: true,//是否启用功能
        },
        autoOffline: false,//是否会自动下线
        noView: ['.MN_kfImg', '.MN_khImg', '.FA_upFileNoImg', '.msg-item-wrapper img'],
        faceModule: {//表情模块
            open: true,//是否启用功能
            faceObj: Face,//表情插件实例
        },
        helpfulModule: {//答案满意度模块
            open: true,//是否启用功能
            yesCallback: function($obj, msg) {//满意的回调
                $obj.text(msg || '感谢您的评价！');
            },
            noCallback: function($obj, msg) {//不满意的回调
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
                        $obj.text(msg || '感谢您的评价！');
                    }
                }else {
                    $obj.text(msg || '感谢您的评价！');
                }
            }
        },
        initCallback: function(data) {//初始化基本信息的回调
            window.uselessReasonItems = data.uselessReasonItems;
        },
        sendCallback: function() {//点击发送按钮的回调
            if(!ifCurSysNum){
				$('.addbtn').show().siblings().hide();
			}
            !FAQ.robot._html && $('.textarea').focus();// 防止键盘拉起
        },
        commentCallback: function() {//评论后的回调
            layer.close(layerCtn);
        },
        leaveMsgCallback: function() {//留言后的回调
            layer.close(layerCtn);
        },
    });
    FAQ.relateListStart=1;
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

    
    
    // 人工评价
    $('body').on('click', '.RG_commentBtn', function() {
        window.uuid = $(this).attr('uuid');// 客服要求客户评价
        $('.feedback').trigger('click');
    });



});

