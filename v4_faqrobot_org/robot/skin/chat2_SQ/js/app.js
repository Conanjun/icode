; $(function () {
    /**
     * 上汽定制：根据url参数切换头部背景颜色
     * 说明：headerType=1 名爵  其他默认为黑色
     * */
    setHeader();

    //调用表情插件
    function set_chatScroll_height() {
        var winW = $(window).width(),
            winH = $(window).height();
        $('html').css('fontSize', winW < 750 ? winW : 750);
        // $('.chatScroll').height(winH-$('.editCtn').outerHeight() - 20);
    }
    var Face = $('#input').face({
        // src: 'src/yun/',//表情路径
        // open: true,
        src: 'src/sq/',//表情路径
        rowNum: 7,//每行最多显示数量，此属性不适用于常用语
        ctnAttr: ['0', '25px', '45px', '44px'],//[left bottom width height] 表情框相对targetEl位置和里面的表情格子宽高  要写单位
        triggerEl: $('.emoj'),//触发按钮(不存在则自己生成，不要由a包裹)
        targetEl: $('.showFace'),//父级参照物(用于appendTo和定位)
        hideAdv: true,//是否隐藏广告
        callback: function () {
            setTimeout(function () {
                $('#input').focus();
            }, 50);
        },
    });
    var FAQ = '';
    FAQ = new Faqrobot({
        isSQPc: true,
        logoUrl: 'robot/skin/chat2_SQ/images/logo_max.png',//logo地址 ----------
        logoId: 'logo',
        intelTitleChange: true,// 智能聊天是否修改标题
        artiTitleChange: true,// 人工时是否修改标题
        artiTitle: '人工客服',// 人工时的标题
        robotInfo: 'robotInfo',
        /**
         * taskid=554 顾荣  ppmoney客服头像与机器人 2018/1/5
         * 原因：区分是机器人客服还是人工客服
         * 修改：添加服图标分为机器人和人工客服
         */
        kfPic: 'robot/skin/chat2_SQ/images/robot.png',  //客服图标
        kf_Robot_Pic: 'robot/skin/chat2_SQ/images/robot.png',  //机器人客服图标
        kf_Person_Pic: 'robot/skin/chat2_SQ/images/robot.png',  //人工客服图标
        kf_Robot_Name: '',//机器人客服名字，此处只是声明个变量，不用赋值
        kf_Person_Name: '',//人工客服名字

        khPic: 'robot/skin/chat2_SQ/images/serv.png', //客户图标
        formatDate: '%month%月%date%日 %hour%:%minute%:%second%',//配置时间格式(默认10:42:52 2016-06-24)
        topQueId: 'commonQue',//热门、常见问题Id --------
        newQueId: 'newAdd',
        quickServId: 'quickLink',//快捷服务Id
        thirdUrlId: 'thirdUrl',
        chatCtnId: 'chatCtn',//聊天展示Id y   --------------
        inputCtnId: 'input',//输入框Id y   --------
        sendBtnId: 'sendBtn',//发送按钮Id y   ------
        copyrightId: 'copyright',// 版权及联系我们
        tipWordId: 'inputTip',
        sendFileId: 'sendFile',//发送文件
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
        commentFormId: 'feedBackForm',//评论框formId -------
        commentInputCtnId: 'feedBackInput',//评论输入框Id ----
        commentSendBtnId: 'feedBackBtn',//评论发送按钮Id ---------
        commentTipWordId: 'feedBackTip',//评论输入框提示语Id
        artiSearchId: 'artiSearch',//智能搜索
        artiSearchCallback: function (data) { // 无智能搜索功能

        },
        leaveQue: {// 未知问题已回复
            open: true,//是否启用功能
        },
        autoSkip: {//手机不能访问pc页面
            open: true,//是否启用功能
            chatUrl: 'h5chat',// 默认跳转的页面
        },
        clearBtnId: 'clearMsg',//清除按钮Id
        closeBtnId: 'close',//关闭聊天页面
        faceModule: {//表情模块
            open: true,//是否启用功能
            faceObj: Face,//表情插件实例
        },
        poweredCtnId: 'power',//技术支持Id
        thirdUrlCallBack: function (data, index) { // 无智能搜索功能

        }
    });
    //faqrobot


    //调用自动补全插件
    // taskid= 1133 输入引导的sourceId 统一在minichat中获取 amend by zhaoyuxing
    $('.input').autocomplete({
        url: 'servlet/AQ?s=ig&sysNum=' + FAQ.options.sysNum,
        targetEl: $('.inputCtn'),//参照物(用于appendTo和定位)
        posAttr: ['0px', '100px'],//外边框的定位[left bottom]
        itemNum: 10,//[int] 默认全部显示
        callback: function (data) {//获取文本后的回调函数
            $('.sendBtn').trigger('click');
        },
        igfullTextSearch: function (data) {
            $('.thirdURL').addClass('thirdURLRecommend');
            $('.artiSearch').removeClass('artiSearchHide');
            // $('.itemCtn').css('width', '25%');
            // 文档检索bug,文档检索出现时输入引导消失  提交人：顾荣 2018/4/23
            $(".itemHeadFocus").removeClass("itemHeadFocus");
            $(".itemHead4").addClass("itemHeadFocus");
            $("#artiSearch").show().siblings('.itemCtx').hide();
        }
    });


    //icheck
    $('[type=checkbox]').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
    });

    //单选按钮
    $('.servYes').on('click', function () {
        $(this).addClass('servYes_hover').siblings('.servCos').removeClass('servNo_hover').next().removeAttr('checked');
        $(this).next().prop({ 'checked': 'checked' });
        $('.servNoReason').hide();
        // bodyRight_scrollbar.update();
    });
    $('.servNo').on('click', function () {
        $(this).addClass('servNo_hover').siblings('.servCos').removeClass('servYes_hover').next().removeAttr('checked');
        $(this).next().prop({ 'checked': 'checked' });
        $('.servNoReason').show();
        // bodyRight_scrollbar.update();
    });



    // 人工评价
    $('body').on('click', '.RG_commentBtn', function () {
        window.uuid = $(this).attr('uuid');// 客服要求客户评价
        $('.itemHead3').trigger('click');
    });

    var maxSize = [960, 880],//1:1 尺寸
        autoSize = [];//实时尺寸


    set_whole_size();
    set_body_height();
    set_bodyLeftTop_height();
    set_bodyLeft_width();
    set_bodyright_iframe_height();
    $(window).on('resize.TH', function () {
        set_whole_size();
        set_body_height();
        set_bodyLeftTop_height();
        set_bodyLeft_width();
        set_bodyright_iframe_height();
    });

    function set_whole_size() {
        var winW = $('body').width(),
            winH = $('body').height();

        autoSize[0] = winW >= maxSize[0] ? maxSize[0] : winW;
        autoSize[1] = winH >= maxSize[1] ? maxSize[1] : winH;

        $('.whole').css({
            'width': autoSize[0],
            'height': autoSize[1],
            'margin-left': -autoSize[0] / 2,
            'margin-top': -autoSize[1] / 2,
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
    function set_bodyright_iframe_height() {
        $('#thirdUrl iframe').height($('.bodyRight').outerHeight() - 50);
    }
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r !== null) return decodeURIComponent(r[2]); return null; //返回参数值
    }

    //taskId = 517PC端页面优化
    $('body').on('click', function (e) {
        if ($(e.target).is('.font') || $(e.target).is('.emoj') || $(e.target).is('.pic input') || $(e.target).is('.file input') || $(e.target).is('.pinjia') || $(e.target).is('.msg')) {
            $('.corpation .icon').removeClass('active');
            $(e.target).addClass('active');
            if ($(e.target).is('.font')) {
                $('.selectFont').removeClass('hide');
                $('.editDetail .corpation').css('padding-top', '5px')
            } else {
                $('.selectFont').addClass('hide');
                $('.editDetail .corpation').css('padding-top', '7px')
            }
            if ($(e.target).parent().is('.pic')) {
                $(e.target).parent().addClass('active')
            }
            if ($(e.target).parent().is('.file')) {
                $(e.target).parent().addClass('active')
            }
            // 留言功能
            // if($(e.target).is('#msgBtn')){
            //     $('#MessageBoardModal').show();  
            // }
        } else {
            if ((!$(e.target).is('#fontFamliy')) && (!$(e.target).is('#fontSize'))) {
                $('.editDetail .corpation').css('padding-top', '7px')
                $('.selectFont').addClass('hide');
            }
            $('.corpation .icon').removeClass('active');
        }
    })
    $('.corpation .pic,.corpation .file').show()
    //taskId = 517PC端页面优化，修改字体，保存字体样式和大小
    $('#fontFamliy').on('change', function () {
        sessionStorage.setItem('fontFamliy', $('#fontFamliy').val());
        var fontFamliy = sessionStorage.getItem('fontFamliy');
        $('html,body,#chatCtn div, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, fieldset, lengend, button, input, textarea, th, td, a,.MN_queList').css('font-family', fontFamliy)
        setTimeout(function () {
            FAQ.scrollbar.update()
            FAQ.scrollbarUpdate()
        }, 300)
    })
    $('#fontSize').on('change', function () {
        sessionStorage.setItem('fontSize', $('#fontSize').val());
        var fontSize = sessionStorage.getItem('fontSize') + 'px';
        $('html,body,#chatCtn div, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, fieldset, lengend, button, input, textarea, th, td, a,.MN_queList').css('font-size', fontSize);
        setTimeout(function () {
            FAQ.scrollbar.update()
            FAQ.scrollbarUpdate()
        }, 300)
    })


    /************上汽定制开始******************/

    // 题库满意度评价 点击满意不满意后，文字左对齐
    $('#chatCtn').on('click', '.MN_helpful', function (e) {
        $(this).css('text-align', 'left');
        $(this).find('.MN_reasonSend').css('float', 'right');
    })


    //bodyRight调用滚动条插件
    var bodyRight_scrollbar = $('.bodyRight').scrollbar({
        'autoBottom': false,//内容改变，是否自动滚动到底部
    });
    /**
     * 上汽定制：根据url参数切换头部背景颜色
     * 说明：headerType=1 名爵  其他默认为黑色
     * */
    function setHeader (){
        var type = getUrlQuery('headerType');
        if(type == 1){
            $('.whole .head').css('background','#CB1500');
            $('.whole .sendBtn').css('background','rgb(203, 21, 0)')
        }
    }

    // 获取 url参数
    function getUrlQuery(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return false;
    }
  
    $('#commonQue').on('mouseover','.MN_queList',function(){
        $(this).find('.MN_queListIndex').css('color','#008CEE')
    })
    $('#commonQue').on('mouseleave','.MN_queList',function(){
        $(this).find('.MN_queListIndex').css('color','#333')
    })

});// end of function
