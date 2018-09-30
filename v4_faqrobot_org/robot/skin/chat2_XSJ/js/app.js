;$(function() {
     //调用表情插件
     function set_chatScroll_height() {
        var winW = $(window).width(),
            winH = $(window).height();
        $('html').css('fontSize', winW<750 ? winW : 750);
        // $('.chatScroll').height(winH-$('.editCtn').outerHeight() - 20);
    }
    var Face = $('#input').face({
        // src: 'src/yun/',//表情路径
        // open: true,
        src: 'src/yun/',//表情路径
        rowNum: 7,//每行最多显示数量，此属性不适用于常用语
        ctnAttr: ['0', '22px', '45px', '44px'],//[left bottom width height] 表情框相对targetEl位置和里面的表情格子宽高  要写单位
        triggerEl: $('.emoj'),//触发按钮(不存在则自己生成，不要由a包裹)
        targetEl: $('.showFace'),//父级参照物(用于appendTo和定位)
        hideAdv: true,//是否隐藏广告
        callback: function() {
            //$('.editHide').hide();
            //$('.sendBtn').show().siblings().hide();
            setTimeout(function(){
                $('#input').focus();
            }, 50);
        },
    });
    var FAQ ='';
    if(getUrlParam('lan') && getUrlParam('lan')=='en'){
        //英文模式
        FAQ = new Faqrobot({
            logoUrl: 'robot/skin/chat2_XSJ/images/logo_max.png',//logo地址 ----------
            logoId: 'logo',
            intelTitleChange: true,// 智能聊天是否修改标题
            artiTitleChange: true,// 人工时是否修改标题
            artiTitle: 'customer service',// 人工时的标题
            robotInfo:'robotInfo',
             kfHtml: [
                    '<div class="MN_answer_welcome MN_answer"><div class="MN_kftime">%formatDate%</div><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%helloWord%</div></div>',//欢迎语组合
                    '<div class="MN_helpful"><span class="MN_reasonSend">submit</span><span class="MN_yes">Satisfied</span><span class="MN_no">Dissatisfied</span></div>',//是否满意组合
                    '<div class="MN_answer" aId="%aId%" cluid="%cluid%"><div class="MN_kftime">%formatDate%</div><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%ansCon%%gusListHtml%%relateListHtml%%commentHtml%</div></div>'//回答组合
                ],//客服结构(所有的属性和%xxx%都必须存在)
            /**
             * taskid=554 顾荣  ppmoney客服头像与机器人 2018/1/5
             * 原因：区分是机器人客服还是人工客服
             * 修改：添加服图标分为机器人和人工客服
             */
            kfPic: 'robot/skin/chat2_XSJ/images/robot.png',  //客服图标
            kf_Robot_Pic: 'robot/skin/chat2_XSJ/images/robot.png',  //机器人客服图标
            kf_Person_Pic: 'robot/skin/chat2_XSJ/images/robot.png',  //人工客服图标
            kf_Robot_Name:'',//机器人客服名字，此处只是声明个变量，不用赋值
            kf_Person_Name:'',//人工客服名字

            khPic: 'robot/skin/chat2_XSJ/images/serv.png', //客户图标
            formatDate: '%hour%:%minute%:%second% %year%-%month%-%date%',//配置时间格式(默认10:42:52 2016-06-24)
            topQueId: 'commonQue',//热门、常见问题Id --------
            newQueId: 'newAdd',
            quickServId: 'quickLink',//快捷服务Id
            thirdUrlId:'thirdUrl',
            chatCtnId: 'chatCtn',//聊天展示Id y   --------------
            inputCtnId: 'input',//输入框Id y   --------
            sendBtnId: 'sendBtn',//发送按钮Id y   ------
            tipWordId: 'inputTip',
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
            copyrightId:'copyright',// 版权及联系我们
            tipWord: 'please input here',//输入框提示语
            commentTipWord: 'Enter your comments, so that we can improve the service level and quality! ',
            commentFormId: 'feedBackForm',//评论框formId -------
            commentInputCtnId: 'feedBackInput',//评论输入框Id ----
            commentSendBtnId: 'feedBackBtn',//评论发送按钮Id ---------
            commentTipWordId: 'feedBackTip',//评论输入框提示语Id
            remainWordNum: '300',
            artiSearchId: 'artiSearch',//智能搜索
            artiSearchCallback: function(data) {
                if(data.fullTextSearch) {
                    $('.thirdURL').addClass('thirdURLRecommend');
                    $('.artiSearch').removeClass('artiSearchHide');
                    $('.itemCtn').css('width', '25%');
                    $('.itemHead4').trigger('click');
                }else {
                    $('.artiSearch').addClass('artiSearchHide');
                    if($('.thirdURL').hasClass('thirdURLRecommend')){
                        //存在推荐链接
                        $('.itemCtn').removeAttr('style');
                    }
                    if($('.itemHead4').is('.itemHeadFocus')) {
                        $('.itemHead1').trigger('click');
                    }else {
                        $('#artiSearch').hide();
                    }
                }

            },
            leaveQue: {// 未知问题已回复
                open: true,//是否启用功能
            },
            leaveMsgTipWord: 'Enter your suggestions, we will deal with you as soon as possible! ',
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
            helpfulModule: {//答案满意度模块
                open: true,//是否启用功能
                yesCallback: function($obj, msg) {//满意的回调
                    $obj.text('Thank you for your evaluation! ');
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
                            $obj.before('<form class="MN_reasonForm"><div class="MN_reasonCtn"><p class="MN_reasonTitle">We are very sorry to have failed to solve your problem. Please give us your reasons and we will optimize and perfect it according to your feedback! </p>'+ html +'<div class="MN_reasonContent"><textarea name="content" placeholder="您的意见"></textarea></div></div></form>');
                        }else {
                            $obj.text('Thank you for your evaluation! ');
                        }
                    }else {
                        $obj.text('Thank you for your evaluation! ');
                    }
                }
            },
            thirdUrlCallBack:function(data,index){
                if(!index)index=0;
                if(data.robotAnswer[index].thirdUrl && data.robotAnswer[index].thirdUrl.url){
                    $('.thirdURL').removeClass('thirdURLRecommend');
                    $('.itemHead5').trigger('click');
                    $('.itemCtn').css('width', '25%');
                    if(!$('.artiSearch').hasClass('artiSearchHide')){
                        $('.artiSearch').addClass('artiSearchHide')
                    }
                    $('#'+ FAQ.options.thirdUrlId+' iframe').attr('src',data.robotAnswer[index].thirdUrl.url);
                 }else{
                    $('.thirdURL').addClass('thirdURLRecommend');
                    $('.itemCtn').removeAttr('style');
                    $('.itemHead1').trigger('click');
                 };
            }
        });
    }else{
        FAQ = new Faqrobot({
            logoUrl: 'robot/skin/chat2_XSJ/images/logo_max.png',//logo地址 ----------
            logoId: 'logo',
            intelTitleChange: true,// 智能聊天是否修改标题
            artiTitleChange: true,// 人工时是否修改标题
            artiTitle: '人工客服',// 人工时的标题
            robotInfo:'robotInfo',
            /**
             * taskid=554 顾荣  ppmoney客服头像与机器人 2018/1/5
             * 原因：区分是机器人客服还是人工客服
             * 修改：添加服图标分为机器人和人工客服
             */
            kfPic: 'robot/skin/chat2_XSJ/images/robot.png',  //客服图标
            kf_Robot_Pic: 'robot/skin/chat2_XSJ/images/robot.png',  //机器人客服图标
            kf_Person_Pic: 'robot/skin/chat2_XSJ/images/robot.png',  //人工客服图标
            kf_Robot_Name:'',//机器人客服名字，此处只是声明个变量，不用赋值
            kf_Person_Name:'',//人工客服名字

            khPic: 'robot/skin/chat2_XSJ/images/serv.png', //客户图标
            formatDate: '%month%月%date%日 %hour%:%minute%:%second%',//配置时间格式(默认10:42:52 2016-06-24)
            topQueId: 'commonQue',//热门、常见问题Id --------
            newQueId: 'newAdd',
            quickServId: 'quickLink',//快捷服务Id
            thirdUrlId:'thirdUrl',
            chatCtnId: 'chatCtn',//聊天展示Id y   --------------
            inputCtnId: 'input',//输入框Id y   --------
            sendBtnId: 'sendBtn',//发送按钮Id y   ------
            copyrightId:'copyright',// 版权及联系我们
            tipWordId: 'inputTip',
            sendFileId:'sendFile',//发送文件
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
            commentFormId: 'feedBackForm',//评论框formId -------
            commentInputCtnId: 'feedBackInput',//评论输入框Id ----
            commentSendBtnId: 'feedBackBtn',//评论发送按钮Id ---------
            commentTipWordId: 'feedBackTip',//评论输入框提示语Id
            artiSearchId: 'artiSearch',//智能搜索
            artiSearchCallback: function(data) {
                if(data.fullTextSearch) {
                    $('.thirdURL').addClass('thirdURLRecommend');
                    $('.artiSearch').removeClass('artiSearchHide');
                    $('.itemCtn').css('width', '25%');
                    $('.itemHead4').trigger('click');
                }else {
                    $('.artiSearch').addClass('artiSearchHide');
                    if($('.thirdURL').hasClass('thirdURLRecommend')){
                        //存在推荐链接
                        $('.itemCtn').removeAttr('style');
                    }
                    if($('.itemHead4').is('.itemHeadFocus')) {
                        $('.itemHead1').trigger('click');
                    }else {
                        $('#artiSearch').hide();
                    }
                }

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
            thirdUrlCallBack:function(data,index){
                if(!index)index=0;
                if(data.robotAnswer[index].thirdUrl && data.robotAnswer[index].thirdUrl.url){
                    $('.thirdURL').removeClass('thirdURLRecommend');
                    $('.itemHead5').trigger('click');
                    $('.itemCtn').css('width', '25%');
                    if(!$('.artiSearch').hasClass('artiSearchHide')){
                        $('.artiSearch').addClass('artiSearchHide')
                    }
                    $('#'+ FAQ.options.thirdUrlId+' iframe').attr('src',data.robotAnswer[index].thirdUrl.url);
                 }else{
                    $('.thirdURL').addClass('thirdURLRecommend');
                    $('.itemCtn').removeAttr('style');
                    //$('.itemHead1').trigger('click');
                 };
            }
        });
    }
    //faqrobot
    
    //bodyRight调用滚动条插件
    /**
    * taskid=802 后台通用功能，快捷服务本地打开 顾荣 2018/2/9
    * 添加：点击快捷服务可在iframe中打开网页
    */

    if($('#itemCtxCtnBox').length > 0){
      var bodyRight_scrollbar = $('#itemCtxCtnBox').scrollbar({
        'autoBottom': false,//内容改变，是否自动滚动到底部
      });
    }

    $(".itemBtnCtn .itemCtn").click(function(){
        setTimeout(function(){
            bodyRight_scrollbar.update()
        },100)
    })

    //调用自动补全插件
    // taskid= 1133 输入引导的sourceId 统一在minichat中获取 amend by zhaoyuxing
    $('.input').autocomplete({
        url: 'servlet/AQ?s=ig&sysNum='+FAQ.options.sysNum,
            targetEl: $('.inputCtn'),//参照物(用于appendTo和定位)
            posAttr: ['0px', '100px'],//外边框的定位[left bottom]
            itemNum: 10,//[int] 默认全部显示
            callback: function(data) {//获取文本后的回调函数
                $('.sendBtn').trigger('click');
        },
        igfullTextSearch: function(data) {
            $('.thirdURL').addClass('thirdURLRecommend');
            $('.artiSearch').removeClass('artiSearchHide');
            $('.itemCtn').css('width', '25%');
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

    // 人工评价
    $('body').on('click', '.RG_commentBtn', function() {
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
    $(window).on('resize.TH', function() {
        set_whole_size();
        set_body_height();
        set_bodyLeftTop_height();
        set_bodyLeft_width();
		set_bodyright_iframe_height();
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
	 function set_bodyright_iframe_height() {
        $('#thirdUrl iframe').height($('.bodyRight').outerHeight() - 50);
    }
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r !== null) return decodeURIComponent(r[2]); return null; //返回参数值
    }


/**
    * taskid=802 后台通用功能，快捷服务本地打开 顾荣 2018/2/9
    * 添加：点击快捷服务可在iframe中打开网页
    */


    $("#serveIframe").css("height",($(".bodyRight").css("height").split("px")[0]-$(".itemBtnCtn").css("height").split("px")[0]))
    $(".itemCtxCtn").css("width",$("#itemCtxCtnBox").css("width"))
    $("#itemCtxCtnBox").css("height",($(".bodyRight").css("height").split("px")[0]-$(".itemBtnCtn").css("height").split("px")[0]))    
    $(window).resize(function () { 
        $("#serveIframe").css("height",($(".bodyRight").css("height").split("px")[0]-$(".itemBtnCtn").css("height").split("px")[0]))
        $(".itemCtxCtn").css("width",$("#itemCtxCtnBox").css("width"))
        $("#itemCtxCtnBox").css("height",($(".bodyRight").css("height").split("px")[0]-$(".itemBtnCtn").css("height").split("px")[0]))
    })
    $("#quickLink").on("click","a.MN_quickLink",function(){//点击快捷服务时，在iframe内打开网页
        if($(this).attr("target")==undefined){//如果快捷服务为本地窗口打开则在本地窗口打开
            $("#serveIframe").css("display","block");
            $("#serveIframe").addClass("noclose");
            $("#serveIframe").find("#quickIframe").attr("src",$(this).attr("href"));
            return false;            
        }
    })
    $("#cloQuIframe").click(function(){//点击返回时，在关闭iframe网页
        $("#serveIframe").css("display","none");
        $("#serveIframe").removeClass("noclose");
        $("#serveIframe").find("#quickIframe").attr("src",""); 
    })
    $(".itemBtnCtn .itemCtn").click(function(){//切换右侧时隐藏iframe
        if(!$(this).hasClass("quickLink")){
            $("#serveIframe").css("display","none")
        }else if($("#serveIframe").hasClass("noclose")){
            $("#serveIframe").css("display","block")
            $("#serveIframe").find("iframe").attr("scrolling","auto")
        }
    })
    //taskId = 517PC端页面优化
    $('body').on('click',function(e){
        if($(e.target).is('.font') || $(e.target).is('.emoj') || $(e.target).is('.pic input') || $(e.target).is('.file input') || $(e.target).is('.pinjia')){
            $('.corpation .icon').removeClass('active');
            $(e.target).addClass('active');
            if($(e.target).is('.font')){
                $('.selectFont').removeClass('hide');
                $('.editDetail .corpation').css('padding-top','5px')
            }else{
                $('.selectFont').addClass('hide');
                $('.editDetail .corpation').css('padding-top','10px')
            }
            if($(e.target).parent().is('.pic')){
                $(e.target).parent().addClass('active')
            }
            if($(e.target).parent().is('.file')){
                $(e.target).parent().addClass('active')
            }
        }else{
            if((!$(e.target).is('#fontFamliy')) && (!$(e.target).is('#fontSize'))){
                $('.editDetail .corpation').css('padding-top','10px')
                $('.selectFont').addClass('hide');
            }
            $('.corpation .icon').removeClass('active');
        }
    })
    $('.corpation .pic,.corpation .file').hide()
    //taskId = 517PC端页面优化，修改字体，保存字体样式和大小
    $('#fontFamliy').on('change',function(){
        sessionStorage.setItem('fontFamliy',$('#fontFamliy').val());
        var fontFamliy = sessionStorage.getItem('fontFamliy');
        $('html,body,#chatCtn div, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, fieldset, lengend, button, input, textarea, th, td, a').css('font-family',fontFamliy)
        setTimeout(function(){
            FAQ.scrollbar.update()
            FAQ.scrollbarUpdate()
        },300)
    })
    $('#fontSize').on('change',function(){
        sessionStorage.setItem('fontSize',$('#fontSize').val());
        var fontSize = sessionStorage.getItem('fontSize')+'px';
        $('html,body,#chatCtn div, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, fieldset, lengend, button, input, textarea, th, td, a').css('font-size',fontSize);
        setTimeout(function(){
            FAQ.scrollbar.update()
            FAQ.scrollbarUpdate()
        },300)
    })
});