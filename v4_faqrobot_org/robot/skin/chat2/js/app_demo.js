;$(function() {

    //bodyRight调用滚动条插件
    var bodyRight_scrollbar = $('.bodyRight').scrollbar({
        'autoBottom': false,//内容改变，是否自动滚动到底部
    });

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
        logoUrl: 'robot/skin/chat2/images/logo_max.png',//logo地址 ----------
        logoId: 'logo',// ----------
        webNameId: 'title',//公司名称Id
        //userInfoId: 'userInfoId',//用户信息Id
        kfPic: 'robot/skin/chat2/images/robot.png',  //客服图标
        khPic: 'robot/skin/chat2/images/serv.png', //客户图标
        formatDate: '%month%月%date%日 %hour%:%minute%:%second%',//配置时间格式(默认10:42:52 2016-06-24)
        topQueId: 'commonQue',//热门、常见问题Id --------
		relateQueId: 'feedBackForm',
        //newQueId: 'newQueId',//新增问题Id
        //recommendQueId: 'recommendQueId',//推荐问题Id
       // quickServId: 'quickLink',//快捷服务Id
        //recommendLinkId: 'recommendLinkId',//推荐咨询Id
        //maxQueNum: 100,//最多展示问题条数
        //maxQueLen: 100,//最多展示问题字数
        //showMsgId: 'showMsgId',//展示信息Id
        chatCtnId: 'chatCtn',//聊天展示Id y   --------------
        inputCtnId: 'input',//输入框Id y   --------
        sendBtnId: 'sendBtn',//发送按钮Id y   ------
        tipWordId: 'inputTip',//输入框提示语Id ----
        //tipWord: '请输入您要咨询的问题',//输入框提示语
        //remainWordId: 'MN_remainWordNum',
        //remainWordNum: '100',
       // commentFormId: 'feedBackForm',//评论框formId -------
        commentInputCtnId: 'feedBackInput',//评论输入框Id ----
        commentSendBtnId: 'feedBackBtn',//评论发送按钮Id ---------
        commentTipWordId: 'feedBackTip',//评论输入框提示语Id
        //commentTipWord: '描述您的意见和建议，以便我们提升服务水平和质量，谢谢您',//评论输入框提示语
        artiSearchId: 'artiSearch',//智能搜索
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

        },
		 relateQueCallback: function(data) {
            if( data.relateList.length>0) {
                $('.itemHead3').trigger('click');
            }
        },
        //leaveMsgFormId: 'leaveMsgForm',//留言框formId ---------
        //leaveMsgInputCtnId: 'leaveMsgCtn',//留言输入框Id ---------
        //leaveMsgSendBtnId: 'leaveMsgBtn',//留言发送按钮Id --------
        //leaveMsgTipWordId: 'leaveMsgTipWordId',//留言输入框提示语Id
        //leaveMsgTipWord: '输入您的建议，我们会尽快为您处理！',//留言输入框提示语

        clearBtnId: 'clearMsg',//清除按钮Id
        closeBtnId: 'close',//关闭聊天页面
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
        poweredCtnId: 'power',//技术支持Id
        sendcallback: function() {//点击发送按钮的回调
        },
        commentCallback: function() {//评论后的回调
        },
        leaveMsgCallback: function() {//评论后的回调
        },
    });

    //FAQ.beginCount(true);//初始化信息


    //icheck
    $('[type=checkbox]').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
    });

    //单选按钮
    $('.servYes').on('click', function() {
        $(this).addClass('servYes_hover').siblings('.servCos').removeClass('servNo_hover').next().removeAttr('checked');
        $(this).next().prop({'checked': 'checked'});
        $('.servNoReason').hide();
        bodyRight_scrollbar.update();
    });
    $('.servNo').on('click', function() {
        $(this).addClass('servNo_hover').siblings('.servCos').removeClass('servYes_hover').next().removeAttr('checked');
        $(this).next().prop({'checked': 'checked'});
        $('.servNoReason').show();
        bodyRight_scrollbar.update();
    });

    // 切换标签页效果
    $('.itemCtx:not(:first)').hide();
    $('body').on('click', '.itemHead', function() {
        $('.itemHead').removeClass('itemHeadFocus');
        $(this).addClass('itemHeadFocus');
        $('.itemCtx').hide();
        $('.itemCtx[index="'+ $(this).attr('index') +'"]').show();
    });

    var maxSize = [960, 880],//1:1 尺寸
        autoSize = [];//实时尺寸

    
    set_whole_size();
    set_body_height();
    set_bodyLeftTop_height();
    set_bodyLeft_width();

    $(window).on('resize.TH', function() {
        set_whole_size();
        set_body_height();
        set_bodyLeftTop_height();
        set_bodyLeft_width();
    });

    function set_whole_size() {
        var winW = $('body').width(),
            winH = $('body').height();
        
        autoSize[0] = winW>=maxSize[0] ? maxSize[0] : winW;
        autoSize[1] = winH>=maxSize[1] ? maxSize[1] : winH;

        $('.whole').css({
            'width': autoSize[0],
            'height': autoSize[1],
            'margin-left': -autoSize[0]/2,
            'margin-top': -autoSize[1]/2,
        });
    }
    function set_body_height() {
        $('.body').height($('.whole').outerHeight() - $('.head').outerHeight());
    }
    function set_bodyLeftTop_height() {
        $('.bodyLeftTop').height($('.bodyLeft').outerHeight() - $('.bodyLeftBottom').outerHeight());
    }
    function set_bodyLeft_width() {
        $('.bodyLeft').width($('.whole').outerWidth() - $('.bodyRight').outerWidth());
    }

});