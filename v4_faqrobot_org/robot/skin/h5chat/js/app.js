;$(function() {
    FastClick.attach(document.body);

    set_chatScroll_height();
    function set_chatScroll_height() {
        var winW = $(window).width(),
            winH = $(window).height();
        $('html').css('fontSize', winW<750 ? winW : 750);
        $('.chatScroll').height(winH-$('.editCtn').outerHeight() - 20);
    }

    $(window).on('resize', function() {
        set_chatScroll_height();
    });

    //显示发送按钮
    $('.textarea').on('input', function() {
        if($(this).val()) {
            $('.sendMsg').addClass('sendBtn');
            $('.sendBtn').show().siblings().hide();
        }else {
            $('.sendMsg').removeClass('sendBtn');
            //$('.addbtn').show().siblings().hide();
        }
    });
    var timer = null;

    //隐藏更多
    $('.view').on('click', function(e) {//不能用body hack ios
        if($(e.target).is('.faceBtn') || $(e.target).is('.addbtn')) {
            $('.editHide').show();
        }else {
            //$('.editHide').hide();
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


    //调用表情插件
    var Face = $('.textarea').face({
        src: 'src/yun/',//表情路径
        rowNum: 7,//每行最多显示数量，此属性不适用于常用语
        ctnAttr: ['0rem', '0rem', '0.133rem', '0.122rem'],//[left bottom width height] 表情框相对targetEl位置和里面的表情格子宽高  要写单位
        triggerEl: $('#sendFace'),//触发按钮(不存在则自己生成，不要由a包裹)
        targetEl: $('.editHide'),//父级参照物(用于appendTo和定位)
        hideAdv: true,//是否隐藏广告
        callback: function() {
            //$('.editHide').hide();
            $('.sendBtn').show().siblings().hide();
            setTimeout(function(){
                $('.textarea').focus();
            }, 50);
        },
    });

    

    var layerCtn = null;//所有的弹出层

    //常见问题
    $('#sendCommonQue').on('click', function() {
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
    $('#sendFeedBack').on('click', function() {
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
    $('#sendLeaveMsg').on('click', function() {
    /**
        * taskId=494;顾荣
        * 原因：在ios浏览器上弹出软键盘留言板布局会乱
        * 修改：删除原本的layer弹出框
        */   
        // layerCtn = layer.open({
        //     type: 1,
        //     title: '留言',
        //     content: $('.leaveMsgLayer'),
        //     area: ['1rem', '100%'],
        //     end: function() {	
        //         //taskid=402 顾荣 任务：留言面板 2017.12.20 清除表单验证
        //         $("#leaveMsgForm .form-group>label").remove()			
        //         $('.text-error').removeClass("text-error helper-font-small")
        //         set_chatScroll_height();
        //     },
        // });
        //taskid=402 顾荣 任务：留言面板 2017.12.20
        // 点击返回聊天页关闭留言板
        // $("#backMessage").click(function(){
        //     parent.layer.close(layerCtn)
        // })
        $("#leaveMsgBox").css("display","block");
        FAQ.writeMsg()
    });


    //taskid=402 顾荣 任务：留言面板 2017.12.20
    // 添加a链接弹出框
    $("body").on("click",".LeaveMsg",function(){
    /**
        * taskId=494;顾荣
        * 原因：在ios浏览器上弹出软键盘留言板布局会乱
        * 修改：删除原本的layer弹出框
        */ 
        // layerCtn = layer.open({
        //     type: 1,
        //     title: '留言',
        //     content: $('.leaveMsgLayer'),
        //     area: ['1rem', '100%'],
        //     end: function() {
        //         //taskid=403 顾荣 任务：留言面板 2017.12.20 清除表单验证
        //         $("#leaveMsgForm .form-group>label").remove()
        //         $('.text-error').removeClass("text-error helper-font-small")
        //         set_chatScroll_height();
        //     },
        // });
        // $("#backMessage").click(function(){
        //     parent.layer.close(layerCtn)
        // })
        $("#leaveMsgBox").css("display","block");
        FAQ.writeMsg()
    })

    /**
     * taskid=784;赵永平
     * h5页面添加标签图片按钮……描述并点击后整体变色
     * 添加字体样式
     */
    /*点击输入框下面图标变蓝*/
    $('body').on('click',function(e){
        //表情
        if($(e.target).is('#sendFace') || $(e.target).is('.faceBtn') || e.target.innerHTML == '表情'){
            $('.editCtn_com span').removeClass('sendPicClick sendVoiceClick sendCameraClick sendFaceClick sendFileClick commonQueClick feedbackClick leaveMsgClick');
            if(e.target.innerHTML == '表情'){
              $(e.target).siblings('span').addClass('sendFaceClick');
            }else if($(e.target).is('#sendFace')){
              $(e.target).children('span').addClass('sendFaceClick');
            }else{
              $(e.target).addClass('sendFaceClick');
            }
            // $(e.target).siblings('p').addClass('btnClass');
            addClassFN(e.target)
        }else{
            /*点击其他变回原来的颜色*/
            $('.editCtn_com span').removeClass('sendPicClick sendVoiceClick sendCameraClick sendFaceClick sendFileClick commonQueClick feedbackClick leaveMsgClick');
            $('.editCtn_com p').removeClass('btnClass')
        }
        function addClassFN (ele) {
          $(ele).siblings('p').addClass('btnClass')
        }
    });
    /**
     * taskid=784
     * h5chat底部表情等，增加选中范围和描述文字，并变蓝色
     */
    $('.editCtn_com').click(function (e) {
          if(!$(this).is('.sendFaceCtn')){
            e.stopPropagation();
            $(this).siblings('.editCtn_com').children('span,p').removeClass('btnClass sendPicClick sendVoiceClick sendCameraClick sendFaceClick sendFileClick commonQueClick feedbackClick leaveMsgClick');
            $(this).children('p').addClass('btnClass');
          }
          if($(this).is('.sendPicCtn')){// 图片
            btnAddClass(this,'sendPicClick');
          }else if($(this).is('.sendVoiceCtn')){// 语音
            btnAddClass(this,'sendVoiceClick');
          }else if($(this).is('.takePhotoCtn')){// 拍照
            btnAddClass(this,'sendCameraClick');
          }else if($(this).is('.sendFaceCtn')){ // 表情
            btnAddClass(this,'sendFaceClick');
            $(this).children('p').addClass('btnClass');
          }else if($(this).is('.sendFileCtn')){ //文件
            btnAddClass(this,'sendFileClick');
          }else if($(this).is('.commonQueCtn')){//常见问题
            btnAddClass(this,'commonQueClick');
          }else if($(this).is('.feedbackCtn')){ //意见反馈
            btnAddClass(this,'feedbackClick');
          }else if($(this).is('.leaveMsgCtn')){ //留言
            btnAddClass(this,'leaveMsgClick');
          }
    })
    
    function btnAddClass (self,Class) {
      $(self).children('span').addClass(Class);
    }



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
        /**
         * taskid=554 顾荣  ppmoney客服头像与机器人 2018/1/5
         * 原因：区分是机器人客服还是人工客服
         * 修改：添加服图标分为机器人和人工客服
         */
        kfPic: 'robot/skin/h5chat/images/robot.png',  //客服图标
        kf_Robot_Pic: 'robot/skin/h5chat/images/robot.png',  //机器人客服图标
        kf_Person_Pic: 'robot/skin/h5chat/images/robot.png',  //人工客服图标
        kf_Robot_Name:'',//机器人客服名字，此处只是声明个变量，不用赋值
        kf_Person_Name:'',//人工客服名字

        khPic: 'robot/skin/h5chat/images/user.png', //客户图标
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
        upFileModule: {//上传文件模块
            open: true,//是否启用功能
            maxNum: 0,//最大上传数量，0为不限制
            triggerId: 'sendPic',//触发上传按钮
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
        // helpfulModule: {//答案满意度模块
        //     open: true,//是否启用功能
        //     yesCallback: function($obj, msg) {//满意的回调
        //         $obj.text(msg || '感谢您的评价！');
        //     },
        //     noCallback: function($obj, msg) {//不满意的回调
        //         if(window.uselessReasonItems) {
        //             if(window.uselessReasonItems[0]) {
        //                 $('.MN_reasonSend', $obj).css('display', 'inline-block').siblings().hide();

        //                 var html = '';
        //                 for(var i=0; i<window.uselessReasonItems.length; i++) {
        //                     var checked = '';
        //                     if(!i) {
        //                         checked = 'checked';
        //                     }
        //                     html += '<div class="MN_reasonItem"><input id="MN_reason'+ i +'" type="radio" value="'+ window.uselessReasonItems[i].tId +'" name="reasonType" '+ checked +'><label for="MN_reason'+ i +'">'+ window.uselessReasonItems[i].reason +'</label></div>';
        //                 }
        //                 $obj.before('<form class="MN_reasonForm"><div class="MN_reasonCtn"><p class="MN_reasonTitle">非常抱歉没能解决您的问题，请反馈未解决原因，我们会根据您的反馈进行优化与完善！</p>'+ html +'<div class="MN_reasonContent"><textarea name="content" placeholder="您的意见"></textarea></div></div></form>');
        //             }else {
        //                 $obj.text(msg || '感谢您的评价！');
        //             }
        //         }else {
        //             $obj.text(msg || '感谢您的评价！');
        //         }
        //     }
        // },
        initCallback: function(data) {//初始化基本信息的回调
            window.uselessReasonItems = data.uselessReasonItems;
        },
        sendCallback: function() {//点击发送按钮的回调
            //$('.addbtn').show().siblings().hide();
            $('.sendBtn').removeClass('sendBtn');
            $('.sendMsg').css('display','block !important');
            !FAQ.robot._html && $('.textarea').focus();// 防止键盘拉起
        },
        commentCallback: function() {//评论后的回调
            layer.close(layerCtn);
        },
        leaveMsgCallback: function() {//留言后的回调
            layer.close(layerCtn);
        }
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

    
    
    // 人工评价
    $('body').on('click', '.RG_commentBtn', function() {
        window.uuid = $(this).attr('uuid');// 客服要求客户评价
        $('#sendFeedBack').trigger('click');
    });

        
    //调用自动补全插件
    // taskid= 1133 输入引导的sourceId 统一在minichat中获取 amend by zhaoyuxing
    $('.textarea').autocomplete({
        url: 'servlet/appChat?s=ig&sysNum='+FAQ.options.sysNum,
        targetEl: $('.editShow'),//参照物(用于appendTo和定位)
        posAttr: ['0rem', '0.133rem'],//外边框的定位[left bottom]
        itemNum: 5,//[int] 默认全部显示
        callback: function(data) {//获取文本后的回调函数
            $('.sendBtn').trigger('click');
        }
    });
});

