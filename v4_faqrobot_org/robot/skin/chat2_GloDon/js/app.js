; $(function () {
    //调用表情插件
    function set_chatScroll_height() {
        var winW = $(window).width(),
            winH = $(window).height();
        $('html').css('fontSize', winW < 750 ? winW : 750);
    }
    var Face = $('#input').face({
        src: 'src/gld/',//表情路径
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
    function FAQInit(token){
        FAQ = new Faqrobot({
            logoUrl: 'robot/skin/chat2_GloDon/images/logo_max.png',//logo地址 ----------
            logoId: 'logo',
            isGLDPc:true,//判断是否广联达pc端
            gldToken:token,//广联达token
            isEvaluated:false,//是否对人工客服评价过
            intelTitleChange: true,// 智能聊天是否修改标题
            artiTitleChange: true,// 人工时是否修改标题
            artiTitle: '人工客服',// 人工时的标题
            robotInfo: 'robotInfo',
            /**
             * taskid=554 顾荣  ppmoney客服头像与机器人 2018/1/5
             * 原因：区分是机器人客服还是人工客服
             * 修改：添加服图标分为机器人和人工客服
             */
            kfPic: 'robot/skin/chat2_GloDon/images/robot.png',  //客服图标
            kf_Robot_Pic: 'robot/skin/chat2_GloDon/images/robot.png',  //机器人客服图标
            kf_Person_Pic: 'robot/skin/chat2_GloDon/images/person.png',  //人工客服图标
            kh_Person_Login:'robot/skin/chat2_GloDon/images/serv.png',//登录后客户图标
            kf_Robot_Name: '',//机器人客服名字，此处只是声明个变量，不用赋值
            kf_Person_Name: '人工客服',//人工客服名字
            khPic: 'robot/skin/chat2_GloDon/images/serv.png', //客户图标
            khLoginPic:'robot/skin/chat2_GloDon/images/servLogin.png',
            noticeTitle: 'noticeTitle', //公告标题
            noticeText: 'noticeText', //公告正文
            noticeDate: 'noticeDate', //公告时间
            telecontrolModal:'telecontrolModal',//远程控制框
            kfInviteModal:'kfInviteModal',//满意度评价框
            evaluateUrl:'evaluateUrl',//满意度评价链接
            isShowShade: 'isShowShade',
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
                $('.itemCtn').css('width', '25%');
                // 文档检索bug,文档检索出现时输入引导消失  提交人：顾荣 2018/4/23
                $(".itemHeadFocus").removeClass("itemHeadFocus");
                $(".itemHead4").addClass("itemHeadFocus");
                $("#artiSearch").show().siblings('.itemCtx').hide();
            }
        });
    }
    
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

    var maxSize = ['100%', '100%'],//1:1 尺寸
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
                $('.editDetail .corpation').css('padding-top', '10px')
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
                $('.editDetail .corpation').css('padding-top', '10px')
                $('.selectFont').addClass('hide');
            }
            $('.corpation .icon').removeClass('active');
        }
    })
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
    /********************广联达定制****************************/
    //bodyRight调用滚动条插件
    var bodyRight_scrollbar = $('.bodyRight').scrollbar({
        'autoBottom': false,//内容改变，是否自动滚动到底部
    });
    var hasGetToken = false; // 是否已调用获取token的方法
    gldInit()
    /**
     * 初始化方法
    */
    function gldInit(){
        if (!hasGetToken) {
            getTokenFn();//获取token
        }
        teleControl()//远程操控
        openCutImages()//截图功能
        closeNoticeModal()//关闭公告模态框
        robotEvaluate()//对机器人评价
    }
    /**
     * 获取token方法
    */
    function getTokenFn() {
        try {
            hasGetToken = true;
            if (window.GetToken()) {
                // alert("获得token为： " + data.token);
                FAQInit(window.GetToken());
            } else {
                // alert('无法调用获取token方法')
                FAQInit();
            }
        } catch (error) {
            FAQInit();
        }
    }
    
    /**
     * 是否允许客服远程控制
    */
    function teleControl(){
        var controlData = {
            isAccept:0,//是否接受远程  0：不接受，1：接受
            sessionInfo:'',//会话信息
            sessionAddress:''//会话地址
        }
        //确认接受远程控制
        $('#acceptControl').on('click',function(){
            try{
                window.DisSession();//断开远程
            }catch(e){}
            window.getNewSession = function(){
                controlData.isAccept = 1;
                controlData.sessionInfo = window.GetSession()//获取远程会话session
                controlData.sessionAddress = window.GetSlUrl()//获取远程会话地址
                if(controlData.sessionInfo == '' || controlData.sessionAddress == ''){
                    FAQ.showMsg('远程信息获取失败！')
                }
                FAQ.teleControl(controlData)
            }
        })
        //不接受远程控制
        $('#noAcceptControl').on('click',function(){
            controlData.isAccept = 0;
            controlData.sessionInfo = ''
            controlData.sessionAddress = ''
            FAQ.teleControl(controlData)
        })
    }
    /**
     * 截图功能：客户端嵌入截图插件
    */
    function openCutImages(){
        $('#screenImage').unbind('click').bind('click',function(){
            try{
                window.OpenCutImage()
            }catch(e){}
        });
    }
    /**
     * 关闭公告模态框
    */
    function closeNoticeModal(){
       $('.noticeModal .close').on('click',function(){
            $('#noticeModal').hide()
        }) 
    }
    /**
     * 对机器人和客服进行评价
    */
    function robotEvaluate(){
        $('#saveDialogform .rad').hover(function(){
            $('#saveDialogform .rad').removeClass('blue')
            $(this).addClass('blue')
        },function(){
            $('#saveDialogform .rad').removeClass('blue')
        })
        $('#saveDialogform .rad').on('click',function(){
            clearForm()
            $(this).addClass('active')
            if($(this).is('#unsolved') && $('.MN_List .MN_unstais').length > 0){
               $('#unstatisList').show() 
            }else{
                $('#unstatisList').hide()
            }
        })
        $('body').on('mouseenter','.MN_List .MN_unstais',function(){
            $('.MN_List .MN_unstais').removeClass('blue')
            $(this).addClass('blue')
        }).on('mouseleave','.MN_List .MN_unstais',function(){
            $('.MN_List .MN_unstais').removeClass('blue')
        })
        $('body').on('click','.MN_List .MN_unstais',function(){
            if($(this).hasClass('active')){
                $(this).removeClass('active')
            }else{
                $(this).addClass('active')
            }
        })
        // 提交评价
        $('#commitComment').on('click',function(){
            var level = 1;
            var unstais = '';
            for (var i = 0; i < $("#saveDialogform .rad").length; i++) {
                if ($("#saveDialogform .rad").eq(i).hasClass('active')) {
                    if ($("#saveDialogform .rad").eq(i).attr('rel') == '不满意') {
                        level = 0;
                    } else {
                        level = 1;
                    }
                }
            }
            for (var i = 0; i < $(".MN_List .MN_unstais").length; i++) {
                if ($('.MN_List .MN_unstais').eq(i).hasClass('active')) {
                    unstais += $('.MN_List .MN_unstais').eq(i).text() + ',';
                }
            }
            FAQ.request({
                params:{
                    s: 'fadeback',
                    sourceId: FAQ.options.sourceId,
                    content: $('#stapin').val(),
                    level: level,
                    sub: unstais
                },
                callback:function(data){
                    if (data.status) {
                        FAQ.showMsg(data.message);
                    }else{
                        layer.msg('感谢您的评价！')
                        setTimeout(function(){
                          try{
                            window.CloseApp()
                          }catch(e){}
                        },1500)
                    }
                    $('#closeFeedBack').trigger('click')
                }
            })
        })
        //暂不评价
        $('#noComment,#closeFeedBack').on('click',function(){
            clearForm()
            $('#dialogFeedModal').hide()
            $('#saveDialogform label.rad').eq(0).trigger('click')
            $('#saveDialogform label.rad').eq(0).addClass('active')
            FAQ.offline()
            try{
                window.CloseApp()
            }catch(e){}
        })
        //恢复默认
        function clearForm(){
            $('#stapin').val('')
            $('.MN_List .MN_unstais').removeClass('active')
            $('#saveDialogform .rad').removeClass('active')
        }
        /**
         * 访客主动评价
        */
        $('#evaluate').on('click',function(){
            FAQ.options.isEvaluated = true;
            FAQ.evaluate()
        })
    }
    /**
     * 供客户端调用展示满意度评价
    */
    window.showEvaluate = function(){
        FAQ.showEvaluate()//展示满意度评价
    }
    /**
     * 供客户端调用授权后初始化页面
    */
    window.initBaseInfo = function(){
        var paramsData={
            s: 'p',
            jid: FAQ.options.jid,
            sourceId: FAQ.options.sourceId,//0->网页 1->微信 3->h5
            productNo: FAQ.options.productId
        };
        /**
         * 广联达聊天页面定制 需传入token
         */
        try{
            if(window.GetToken()){
                paramsData.access_token = window.GetToken();
            }
        }catch(error){

        }
        FAQ.request({
            params:paramsData,
            callback:function(data){
                // TaskId=388, 任务单逻辑描述:如果认证未成功，弹出提示后不调取任何接口.
                if(data.status == -1){
                    FAQ.options.tologinUrl(data)//taskid = 367 身份认证跳转
                    FAQ.showMsg(data.message);
                }
                FAQ.timerGo = true//控制定时请求
                FAQ.options.initCallback(data)
                $('#' + FAQ.options.inputCtnId).removeAttr('readonly')
                FAQ.setLogo(data)//设置logo->客服图标/客户图标
                //s=p接口时，保存欢迎语
                //FAQ.robotHelloWord=data.helloWord;
                /**
                * 如果下线后再初始化不推送欢迎语和闪退恢复记录
                * taskId:406 闪退时不显示欢迎语以及导问 必须2层判断，后台可能传输null []  data.talkMessageList[0]
                */
                if(!FAQ.isOffline){
                    if(data.talkMessageList&&data.talkMessageList[0]){                
                        var talkMessageList = FAQ.filterContent(data.talkMessageList)
                        if(talkMessageList.length > 0){
                            data.talkMessageList = talkMessageList;
                        }
                        FAQ.flashOutDeal(data);
                    }else{
                        //FAQ.sayHello(data)//欢迎语
                        //FAQ.welcomeguideQue(data)//猜你想问。
                    }
                }
                if (FAQ.options.configModule.open) {
                    FAQ.configWin(data)// 配置窗口w
                }
                if (FAQ.options.historyModule.open) {
                    FAQ.historyRecord(1)// 历史记录
                }
                FAQ.request({
                    params:{
                        s:'aq',
                        question:'TransferToManpower'
                    },
                    callback:function(data){
                        FAQ.askQueBack(data)
                    }
                })
            }
        })
    }
    /**
     * 供客户端调用获取图片的base64路径
    */
    window.afterPrtScr = function () {
        var img = ''//base64
        try{
            img = window.GetImagePath()
        }catch(e){

        }
        FAQ.sendScreenPic(img)
    }
    /**
     * 供客户端调用在最大化、默认值时页面滚动到底部
    */
    window.scrollBottom = function(){
        setTimeout(function(){
            FAQ.scrollbar.update()
            FAQ.scrollbarUpdate()
        },100)
    }
});// end of function
