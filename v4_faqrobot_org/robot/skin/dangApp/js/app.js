;$(function() {
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
    $('.editCtn_com').width(100/(showNum-3) +'%');

    //调用表情插件
    var Face = $('.textarea').face({
        src: 'src/dang/',//表情路径
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

    //调用自动补全插件
    $('.textarea').autocomplete({
        url: '../../servlet/AQ?s=ig',//[string]
        targetEl: $('.editShow'),//参照物(用于appendTo和定位)
        posAttr: ['0rem', '0.133rem'],//外边框的定位[left bottom]
        itemNum: 5,//[int] 默认全部显示
        callback: function(data) {//获取文本后的回调函数
            $('.sendBtn').trigger('click');
        }
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
            title: '满意度',
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
        //$('.noSatiCtn').show();
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

    //讲个笑话
    $('.speakJoke').on('click', function() {
        $('.textarea').val('讲笑话');
        $('.sendBtn').trigger('click');
        set_chatScroll_height();
    });

    $('body').on('click', '.orderBottom', function(){
        $(this).parent().find('.orderWhole').show();
        $(this).append('<div style="display:none;">1</div>');
        $(this).hide();
    });
    $('body').on('click', '.orderWhole', function(){
            var content = $('#textarea').val();
            $('#textarea').val($(this).find('.orderIdd').text());
            $('#sendBtn').trigger('click');
            //$('#textarea').val(content);
            //$(this).addClass('orderWholeClicked').removeClass('orderWhole');
    });
        var FAQ = new Faqrobot({
        setInputTop:false,//当当移动端默认不开启ios11键盘遮挡问题
        //sysNum: 1000000,//客户唯一标识
        //jid: 0,//自定义客服客户图标
        //robotName: 'FaqRobot',//机器人名称
        logoUrl: 'robot/skin/dangApp/images/logo@2x.png',//logo地址 ----------
        logoId: 'logo',// ----------
        webNameId: 'MN_logoWord',//公司名称Id
        //userInfoId: 'userInfoId',//用户信息Id
        kfPic: 'robot/skin/dangApp/images/robot.png',  //客服图标
        khPic: 'robot/skin/dangApp/images/user.png', //客户图标
        formatDate: '%month%月%date%日 %hour%:%minute%:%second%',//配置时间格式(默认10:42:52 2016-06-24)
        //topQueId: 'commonQueLayer',//热门、常见问题Id --------
        newQueId: 'commonQueLayer',//新增问题Id
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
        //ajaxType: 'post',
        autoOffline: false,//是否会自动下线
        faceModule: {//表情模块
            open: true,//是否启用功能
            faceObj: Face,//表情插件实例
        },
        weatherModule: {//天气模块
            open: true,//是否启用功能
            triggerId: 'checkCloud',//触发天气按钮
        },
        noView: ['.MN_kfImg', '.MN_khImg', '.FA_upFileNoImg', '.msg-item-wrapper img'],
        sendCallback: function() {//点击发送按钮的回调
            $('.addbtn').show().siblings().hide();
            !FAQ.robot._html && $('.textarea').focus();// 防止键盘拉起
        },
        commentCallback: function(data) {//评论后的回调
            layer.close(layerCtn);
            if(!data.status) {
                if(+$('[name=level]:checked').val()) {//满意
                    layer.msg('能帮到您小当好开心的呢，我会继续努力的哦^_^', {
                        area: '0.8rem'
                    });
                }else {
                    layer.msg('没有让您满意小当感到万分心痛，我会继续学习~', {
                        area: '0.8rem'
                    });
                }
            }
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
        FAQ.robot._html = $(this).text();
        FAQ.askQue();
    });

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

	//获取页面中a标签，添加点击事件
    $('#chatCtn').undelegate('a','click').delegate('a','click',function(){
        var tmpHref=$(this).attr('href');
		//当当APP中点击超链接，判断当前a标签是否设置了链接地址，如果设置了，并且不带有任何class就是一个单纯的链接地址
        if(tmpHref){
            if(tmpHref.indexOf('http')>=0 && typeof($(this).attr('class'))=="undefined"){
                location.href = $(this).attr('href');
                return false;
            }
        }

    })
    // 人工评价
    $('body').on('click', '.RG_commentBtn', function() {
        window.uuid = $(this).attr('uuid');// 客服要求客户评价
        $('.feedback').trigger('click');
    });
});

