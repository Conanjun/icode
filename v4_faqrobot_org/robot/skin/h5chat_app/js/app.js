; $(function () {
    // alert('3')
   
    FastClick.attach(document.body);

    function set_chatScroll_height() {
        var winW = $(window).width(),
            winH = $(window).height();
        $('html').css('fontSize', winW < 750 ? winW : 750);
        $('.chatScroll').height(winH - $('.editCtn').outerHeight());
    }

    $(window).on('resize', function () {
        set_chatScroll_height();
    });

    set_chatScroll_height();

    //调用表情插件
    var Face = $('.textarea').face({
        src: 'src/yun/',//表情路径
        rowNum: 7,//每行最多显示数量，此属性不适用于常用语
        ctnAttr: ['0rem', '0rem', '0.133rem', '0.122rem'],//[left bottom width height] 表情框相对targetEl位置和里面的表情格子宽高  要写单位
        triggerEl: $('#sendFace'),//触发按钮(不存在则自己生成，不要由a包裹)
        targetEl: $('.editHide'),//父级参照物(用于appendTo和定位)
        hideAdv: true,//是否隐藏广告
        callback: function () {
            $('#sendBtn').removeClass('hide');
            $('.keyboardCtn').removeClass('hide');
            $('.addBtn').addClass('hide');
            $('#sendFace').addClass('hide');
            $('.textarea').blur();
            $('.editHide').show();
        },
        ish5chatApp:true
    });

  
    // 定时设置高度
    var timer = null;
    function timerSetHeight() {
        var p = new Promise(function (resolve, reject) {
            var i = 0;
            clearInterval(timer);
            timer = setInterval(function () {
                set_chatScroll_height();
                if (i >= 5) {
                    resolve();
                    clearInterval(timer);
                }
                i++;
            }, 100);
        })
        return p;
    }

    //faqrobot
    var FAQ = new Faqrobot({
        interface: 'servlet/appChat',
        setInputTop: false,//默认开启ios11键盘遮挡问题
        ish5chatApp:true,
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
        kf_Robot_Name: '',//机器人客服名字，此处只是声明个变量，不用赋值
        kf_Person_Name: '',//人工客服名字

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
        sendFileIdExpend:'sendPhoto',//上传按钮id
        upFileModule: {//上传文件模块
            open: true,//是否启用功能
            maxNum: 0,//最大上传数量，0为不限制
            triggerId: 'sendPic',//触发上传按钮
            startcall: function () {//上传文件前的回调
                set_chatScroll_height();
            },
            callback: function () {//上传文件后的回调
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
        sourceId: tmpsourceId,//客户来源
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
        preventAdjust: true,// 禁止快捷服务按钮自动计算宽度
        preventHide: true,// 机器人聊天时 仍然显示发送文件、图片功能
        initCallback: function (data) {//初始化基本信息的回调
            window.uselessReasonItems = data.uselessReasonItems;
            console.log(data.webConfig.webName);
            try {
                android.setTitle(data.webConfig.webName);
            } catch (error) {
                
            }
            
        },
        sendCallback: function () {//点击发送按钮的回调
            $('.addBtn').removeClass('hide');
            $('#sendFace').removeClass('hide');

            $('.keyboardCtn').addClass('hide');
            $('#sendBtn').addClass('hide');

            !FAQ.robot._html && $('.textarea').focus();// 防止键盘拉起
            setTimeout(function () {
                $('.textarea').focus();
            }, 50);
        },
        commentCallback: function () {//评论后的回调
            layer.close(layerCtn);
        },
        leaveMsgCallback: function () {//留言后的回调
            layer.close(layerCtn);
        }
    });

    // 绑定拍照按钮照片上传事件
    FAQ.sendFile(FAQ.options.sendFileIdExpend);
    FAQ.sendFile('sendPicture');

    //调用自动补全插件
    // taskid= 1133 输入引导的sourceId 统一在minichat中获取 amend by zhaoyuxing
    $('.textarea').autocomplete({
        url: 'servlet/appChat?s=ig&sysNum=' + FAQ.options.sysNum,
        targetEl: $('.editShow'),//参照物(用于appendTo和定位)
        posAttr: ['0rem', '0.133rem'],//外边框的定位[left bottom]
        itemNum: 5,//[int] 默认全部显示
        callback: function (data) {//获取文本后的回调函数
            $('.sendBtn').trigger('click');
        }
    });

   

    /****************输入框事件*****************/
    //输入文字 显示发送按钮
    $('.textarea').on('input', function () {
        if ($(this).val().replace(/\s+/g, '')) {
            $('.sendBtn').removeClass('hide');
            $('.addBtn').addClass('hide');
        } else {
            $('.sendBtn').addClass('hide');
            $('.addBtn').removeClass('hide');
        }
    });

    $('.textarea').on('blur', function () {
        // $('#sendFace').removeClass('hide');
        // $('#keyboard').addClass('hide');
        timerSetHeight()
            .then(function (data) {
                if(isTouchMove){
                    isTouchMove = false; // 复位
                    return false;
                }
                FAQ.scrollbar.update()
                // FAQ.scrollbarUpdate()
            })
    });

    // 获取焦点
    $('.textarea').on('focus', function () {
        // 工具栏收缩
        // if ($('.FA_backCtn').css('display') == 'block') {
        //     $('.editHide').hide();
        // } else {
        //     $('.editHide').hide();
        // }
        $('.editHide').hide();
        $('#sendFace').removeClass('hide');
        $('#keyboard').addClass('hide');

        timerSetHeight()
            .then(function (data) {
                FAQ.scrollbar.update()
                FAQ.scrollbarUpdate()
            })
    });

    /****************输入框事件*****************/


    //隐藏更多
    $('.view').on('click', function (e) {//不能用body hack ios
        var _target = $(e.target);
        if (_target.is('.faceBtn') || _target.is('.expendBtn')) {
            $('.editHide').show();
            timerSetHeight()
                .then(function (data) {
                    FAQ.scrollbar.update()
                    FAQ.scrollbarUpdate()
                })
        } else if (_target.is('#chatCtn') || _target.parents().is('#chatCtn')) {
            if($('.editHide').css('display') == "block"){// 任务栏隐藏时，点击页面无需将消息滚动到最底部
                $('.editHide').hide();
                $('#sendFace').removeClass('hide');
                $('#keyboard').addClass('hide');
                timerSetHeight()
                    .then(function (data) {
                        FAQ.scrollbar.update()
                        FAQ.scrollbarUpdate()
                    })
                }             
        }
       
    });

    /******************常见问题、留言、意见反馈模态框*************************/
    var layerCtn = null;//所有的弹出层

    //常见问题
    $('#sendCommonQue').on('click', function () {
        layerCtn = layer.open({
            type: 1,
            title: '常见问题',
            content: $('.commonQueLayer'),
            area: ['1rem', '100%'],
            end: function () {
                set_chatScroll_height();
            },
        });
    });

    //选择常见问题(事件委托)
    $('body').on('click', function (e) {
        if (e.target.className == 'MN_queList') {
            layer.close(layerCtn);
        }
        if (e.target.parentNode) {
            if (e.target.parentNode.className == 'MN_queList') {
                layer.close(layerCtn);
            }
        }
        // 关闭各种框
        if (e.target.className == 'layui-layer-setwin') {
            $(e.target).find('.layui-layer-close').trigger('click');
        }
    });

    //意见反馈
    $('#sendFeedBack').on('click', function () {
        layerCtn = layer.open({
            type: 1,
            title: '意见反馈',
            content: $('.feedbackLayer'),
            area: ['1rem', '100%'],
            end: function () {
                set_chatScroll_height();
            },
        });
    });

    $('.MN_marginCtn').eq(0).on('click', function () {
        $('.noSatiCtn').hide();
    });
    $('.MN_marginCtn').eq(1).on('click', function () {
        $('.noSatiCtn').show();
    });

    //留言
    $('#sendLeaveMsg').on('click', function () {
        $("#leaveMsgBox").css("display", "block");
        FAQ.writeMsg()
    });


    //taskid=402 顾荣 任务：留言面板 2017.12.20
    // 添加a链接弹出框
    $("body").on("click", ".LeaveMsg", function () {
        $("#leaveMsgBox").css("display", "block");
        FAQ.writeMsg()
    })

    /******************常见问题、留言、意见反馈模态框*************************/



    /**
     * taskid=784;赵永平
     * h5页面添加标签图片按钮……描述并点击后整体变色
     * 添加字体样式
     */
    /*点击输入框下面图标背景变灰*/
    $('body').on('click', '.editCtn_com', function (e) {
        var that = this;
        $(that).find('.icon-ctn').addClass('active');
        setTimeout(function () {
            $(that).find('.icon-ctn').removeClass('active');
        }, 1000);
    }
    );


    // 输入框获取焦点
    // $('.sendBtn').on('click.FA', function () {
    //     $('.textarea').focus();
    //     setTimeout(function () {
    //         $('.textarea').focus();
    //     }, 50);
    // });

    // 键盘-表情按钮切换
    $('#keyboard').on('click.FA', function () {
        $('.textarea').focus();
        $(this).addClass('hide');
        $('#sendFace').removeClass('hide');
        $('.editHide').hide();
    })

     $('#sendFace').on('click.FA',function(){
        $(this).addClass('hide');
        $('#keyboard').removeClass('hide');
     })

    // 人工评价
    $('body').on('click', '.RG_commentBtn', function () {
        window.uuid = $(this).attr('uuid');// 客服要求客户评价
        $('#sendFeedBack').trigger('click');
    });

    var isTouchMove = false; // 滑动页面失去焦点时，无需滚动最底部
    $('.chatScroll').on('touchmove', function (e) {
        isTouchMove = true;
        $('.textarea').blur();
        $('.editHide').hide();
        set_chatScroll_height();
        $('#sendFace').removeClass('hide');
        $('#keyboard').addClass('hide');
    })    
});

