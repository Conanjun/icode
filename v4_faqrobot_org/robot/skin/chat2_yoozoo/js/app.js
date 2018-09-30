; $(function () {
    //调用表情插件
    $('.timeTip').tooltip();
    var Face = $('.textarea').face({
        src: 'src/yun/',//表情路径
        open: false,
    });
    var FAQ = '';
    if (getUrlParam('lan') && getUrlParam('lan') == 'en') {
        //英文模式
        FAQ = new Faqrobot({
            logoUrl: 'robot/skin/chat2/images/logo_max.png',//logo地址 ----------
            logoId: 'logo',
            intelTitleChange: true,// 智能聊天是否修改标题
            artiTitleChange: true,// 人工时是否修改标题
            artiTitle: 'customer service',// 人工时的标题
            robotInfo: 'robotInfo',
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
            kfPic: 'robot/skin/chat2/images/robot.png',  //客服图标
            kf_Robot_Pic: 'robot/skin/chat2/images/robot.png',  //机器人客服图标
            kf_Person_Pic: 'robot/skin/chat2/images/robot.png',  //人工客服图标
            kf_Robot_Name: '',//机器人客服名字，此处只是声明个变量，不用赋值
            kf_Person_Name: '',//人工客服名字

            khPic: 'robot/skin/chat2/images/serv.png', //客户图标
            formatDate: '%hour%:%minute%:%second% %year%-%month%-%date%',//配置时间格式(默认10:42:52 2016-06-24)
            topQueId: 'commonQue',//热门、常见问题Id --------
            quickServId: 'quickLink',//快捷服务Id
            thirdUrlId: 'thirdUrl',
            chatCtnId: 'chatCtn',//聊天展示Id y   --------------
            inputCtnId: 'input',//输入框Id y   --------
            sendBtnId: 'sendBtn',//发送按钮Id y   ------
            tipWordId: 'inputTip',
            copyrightId: 'copyright',// 版权及联系我们
            tipWord: 'please input here',//输入框提示语
            commentTipWord: 'Enter your comments, so that we can improve the service level and quality! ',
            commentFormId: 'feedBackForm',//评论框formId -------
            commentInputCtnId: 'feedBackInput',//评论输入框Id ----
            commentSendBtnId: 'feedBackBtn',//评论发送按钮Id ---------
            commentTipWordId: 'feedBackTip',//评论输入框提示语Id
            remainWordNum: '300',
            artiSearchId: 'artiSearch',//智能搜索
            artiSearchCallback: function (data) {
                if (data.fullTextSearch) {
                    $('.thirdURL').addClass('thirdURLRecommend');
                    $('.artiSearch').removeClass('artiSearchHide');
                    $('.itemCtn').css('width', '25%');
                    $('.itemHead4').trigger('click');
                } else {
                    $('.artiSearch').addClass('artiSearchHide');
                    if ($('.thirdURL').hasClass('thirdURLRecommend')) {
                        //存在推荐链接
                        $('.itemCtn').removeAttr('style');
                    }
                    if ($('.itemHead4').is('.itemHeadFocus')) {
                        $('.itemHead1').trigger('click');
                    } else {
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
            initCallback: function (data) {//初始化基本信息的回调
                $('body').css('opacity',1);
                window.uselessReasonItems = data.uselessReasonItems
            },
            helpfulModule: {//答案满意度模块
                open: true,//是否启用功能
                yesCallback: function ($obj, msg) {//满意的回调
                    $obj.text('Thank you for your evaluation! ');
                },
                noCallback: function ($obj, msg) {//不满意的回调
                    if (window.uselessReasonItems) {
                        if (window.uselessReasonItems[0]) {
                            $('.MN_reasonSend', $obj).css('display', 'inline-block').siblings().hide();

                            var html = '';
                            for (var i = 0; i < window.uselessReasonItems.length; i++) {
                                var checked = '';
                                if (!i) {
                                    checked = 'checked';
                                }
                                html += '<div class="MN_reasonItem"><input id="MN_reason' + i + '" type="radio" value="' + window.uselessReasonItems[i].tId + '" name="reasonType" ' + checked + '><label for="MN_reason' + i + '">' + window.uselessReasonItems[i].reason + '</label></div>';
                            }
                            $obj.before('<form class="MN_reasonForm"><div class="MN_reasonCtn"><p class="MN_reasonTitle">We are very sorry to have failed to solve your problem. Please give us your reasons and we will optimize and perfect it according to your feedback! </p>' + html + '<div class="MN_reasonContent"><textarea name="content" placeholder="您的意见"></textarea></div></div></form>');
                        } else {
                            $obj.text('Thank you for your evaluation! ');
                        }
                    } else {
                        $obj.text('Thank you for your evaluation! ');
                    }
                }
            },
            thirdUrlCallBack: function (data, index) {
                if (!index) index = 0;
                if (data.robotAnswer[index].thirdUrl && data.robotAnswer[index].thirdUrl.url) {
                    $('.thirdURL').removeClass('thirdURLRecommend');
                    $('.itemHead5').trigger('click');
                    $('.itemCtn').css('width', '25%');
                    if (!$('.artiSearch').hasClass('artiSearchHide')) {
                        $('.artiSearch').addClass('artiSearchHide')
                    }
                    $('#' + FAQ.options.thirdUrlId + ' iframe').attr('src', data.robotAnswer[index].thirdUrl.url);
                } else {
                    $('.thirdURL').addClass('thirdURLRecommend');
                    $('.itemCtn').removeAttr('style');
                    $('.itemHead1').trigger('click');
                };
            },
            tologinUrl: function (data) {
                /**
              *   taskid = 435 身份认证：
              *   说明：s=p接口中获取地址，进行页面跳转，进行认证，并将原页面地址作为参数backUrl传入
              * */
                if (data.loginUrl) {
                    var appid = encodeURIComponent(window.btoa(124));
                    // var backUrl = encodeURIComponent(window.btoa(document.referrer || 'http://yoozoo.faqrobot.cn/robot/youzu.html'));
                    var backUrl = encodeURIComponent(window.btoa(window.location.href));
                    if (data.loginUrl.indexOf('?') > 0) {
                        window.location.href = data.loginUrl + "&appid=" + appid + "&backurl=" + backUrl;
                    } else {
                        window.location.href = data.loginUrl + "?appid=" + appid + "&backurl=" + backUrl;
                    }
                }
            }
        });
    } else {
        FAQ = new Faqrobot({
            logoUrl: 'robot/skin/chat2/images/logo_max.png',//logo地址 ----------
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
            kfPic: 'robot/skin/chat2_yoozoo/images/robot.png',  //客服图标
            kf_Robot_Pic: 'robot/skin/chat2_yoozoo/images/robot.png',  //机器人客服图标
            kf_Person_Pic: 'robot/skin/chat2_yoozoo/images/robot.png',  //人工客服图标
            kf_Robot_Name: '',//机器人客服名字，此处只是声明个变量，不用赋值
            kf_Person_Name: '',//人工客服名字

            khPic: 'robot/skin/chat2_yoozoo/images/serv.png', //客户图标
            formatDate: '%month%月%date%日 %hour%:%minute%:%second%',//配置时间格式(默认10:42:52 2016-06-24)
            topQueId: 'commonQue',//热门、常见问题Id --------
            quickServId: 'quickLink',//快捷服务Id
            thirdUrlId: 'thirdUrl',
            chatCtnId: 'chatCtn',//聊天展示Id y   --------------
            inputCtnId: 'input',//输入框Id y   --------
            sendBtnId: 'sendBtn',//发送按钮Id y   ------
            copyrightId: 'copyright',// 版权及联系我们
            tipWordId: 'inputTip',
            commentFormId: 'feedBackForm',//评论框formId -------
            commentInputCtnId: 'feedBackInput',//评论输入框Id ----
            commentSendBtnId: 'feedBackBtn',//评论发送按钮Id ---------
            commentTipWordId: 'feedBackTip',//评论输入框提示语Id
            artiSearchId: 'artiSearch',//智能搜索
            artiSearchCallback: function (data) {
                if (data.fullTextSearch) {
                    $('.thirdURL').addClass('thirdURLRecommend');
                    $('.artiSearch').removeClass('artiSearchHide');
                    $('.itemCtn').css('width', '25%');
                    $('.itemHead4').trigger('click');
                } else {
                    $('.artiSearch').addClass('artiSearchHide');
                    if ($('.thirdURL').hasClass('thirdURLRecommend')) {
                        //存在推荐链接
                        $('.itemCtn').removeAttr('style');
                    }
                    if ($('.itemHead4').is('.itemHeadFocus')) {
                        $('.itemHead1').trigger('click');
                    } else {
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
            initCallback: function (data) {//初始化基本信息的回调
                $('body').css('opacity',1);
                window.uselessReasonItems = data.uselessReasonItems
            },
            thirdUrlCallBack: function (data, index) {
                if (!index) index = 0;
                if (data.robotAnswer[index].thirdUrl && data.robotAnswer[index].thirdUrl.url) {
                    $('.thirdURL').removeClass('thirdURLRecommend');
                    $('.itemHead5').trigger('click');
                    $('.itemCtn').css('width', '25%');
                    if (!$('.artiSearch').hasClass('artiSearchHide')) {
                        $('.artiSearch').addClass('artiSearchHide')
                    }
                    $('#' + FAQ.options.thirdUrlId + ' iframe').attr('src', data.robotAnswer[index].thirdUrl.url);
                } else {
                    $('.thirdURL').addClass('thirdURLRecommend');
                    $('.itemCtn').removeAttr('style');
                    $('.itemHead1').trigger('click');
                };
            },
            tologinUrl: function (data) {
                /**
               *   taskid = 435 身份认证：
               *   说明：s=p接口中获取地址，进行页面跳转，进行认证，并将原页面地址作为参数backUrl传入
               * */
                if (data.loginUrl) {
                    var appid = encodeURIComponent(window.btoa(124));
                    // var backUrl = encodeURIComponent(window.btoa(document.referrer || 'http://yoozoo.faqrobot.cn/robot/youzu.html'));
                    var backUrl = encodeURIComponent(window.btoa(window.location.href));
                    if (data.loginUrl.indexOf('?') > 0) {
                        window.location.href = data.loginUrl + "&appid=" + appid + "&backurl=" + backUrl;
                    } else {
                        window.location.href = data.loginUrl + "?appid=" + appid + "&backurl=" + backUrl;
                    }
                } 
            }
        });
    }
    //faqrobot

    //bodyRight调用滚动条插件
    /**
    * taskid=802 后台通用功能，快捷服务本地打开 顾荣 2018/2/9
    * 添加：点击快捷服务可在iframe中打开网页
    */

    if ($('#itemCtxCtnBox').length > 0) {
        var bodyRight_scrollbar = $('#itemCtxCtnBox').scrollbar({
            'autoBottom': false,//内容改变，是否自动滚动到底部
        });
    }

    $(".itemBtnCtn .itemCtn").click(function () {
        setTimeout(function () {
            bodyRight_scrollbar.update()
        }, 100)
    })

    //调用自动补全插件
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
        bodyRight_scrollbar.update();
    });
    $('.servNo').on('click', function () {
        $(this).addClass('servNo_hover').siblings('.servCos').removeClass('servYes_hover').next().removeAttr('checked');
        $(this).next().prop({ 'checked': 'checked' });
        $('.servNoReason').show();
        bodyRight_scrollbar.update();
    });

    // 切换标签页效果
    $('.itemCtx:not(:first)').hide();
    $('body').on('click', '.itemHead', function () {
        $('.itemHead').removeClass('itemHeadFocus');
        $(this).addClass('itemHeadFocus');
        $('.itemCtx').hide();
        $('.itemCtx[index="' + $(this).attr('index') + '"]').show();
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


    /**
        * taskid=802 后台通用功能，快捷服务本地打开 顾荣 2018/2/9
        * 添加：点击快捷服务可在iframe中打开网页
        */


    $("#serveIframe").css("height", ($(".bodyRight").css("height").split("px")[0] - $(".itemBtnCtn").css("height").split("px")[0]))
    $(".itemCtxCtn").css("width", $("#itemCtxCtnBox").css("width"))
    $("#itemCtxCtnBox").css("height", ($(".bodyRight").css("height").split("px")[0] - $(".itemBtnCtn").css("height").split("px")[0]))
    $(window).resize(function () {
        $("#serveIframe").css("height", ($(".bodyRight").css("height").split("px")[0] - $(".itemBtnCtn").css("height").split("px")[0]))
        $(".itemCtxCtn").css("width", $("#itemCtxCtnBox").css("width"))
        $("#itemCtxCtnBox").css("height", ($(".bodyRight").css("height").split("px")[0] - $(".itemBtnCtn").css("height").split("px")[0]))
    })
    $("#quickLink").on("click", "a.MN_quickLink", function () {//点击快捷服务时，在iframe内打开网页
        if ($(this).attr("target") == undefined) {//如果快捷服务为本地窗口打开则在本地窗口打开
            $("#serveIframe").css("display", "block");
            $("#serveIframe").addClass("noclose");
            $("#serveIframe").find("#quickIframe").attr("src", $(this).attr("href"));
            return false;
        }
    })
    $("#cloQuIframe").click(function () {//点击返回时，在关闭iframe网页
        $("#serveIframe").css("display", "none");
        $("#serveIframe").removeClass("noclose");
        $("#serveIframe").find("#quickIframe").attr("src", "");
    })
    $(".itemBtnCtn .itemCtn").click(function () {//切换右侧时隐藏iframe
        if (!$(this).hasClass("quickLink")) {
            $("#serveIframe").css("display", "none")
        } else if ($("#serveIframe").hasClass("noclose")) {
            $("#serveIframe").css("display", "block")
            $("#serveIframe").find("iframe").attr("scrolling", "auto")
        }
    })
    $("span#feedBackBtn").unbind('click')
    // 意见反馈提交
    $("div#feedBackBtn").unbind('click').on('click', function () {
        var cont = $("textarea#queAndadv").val().trim()//聊天内容
        var nameEmailPhone = $("#linaxiType").val().trim()//访客信息
        var nameEmailPhoneArr = nameEmailPhone.split('+')
        var name = nameEmailPhoneArr[0]//姓名
        var telephoneRule3 = /^1([3578]\d|4[57])\d{8}$/;
        var telephoneRule1 = /^(\d{3}-)?\d{8}$/;
        var telephoneRule2 = /^(\d{4}-)?\d{7}$/;
        var emailreg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)$/;
        var email = '';//邮箱
        var phone = '';//电话
        if (!cont) {
            layer.msg('请填写问题与意见！')
            return false;
        }
        if (!nameEmailPhone) {
            layer.msg('请填写访客信息！')
            return false;
        }
        for (var i = 1; i < nameEmailPhoneArr.length; i++) {
            if (nameEmailPhoneArr.length < 4 && nameEmailPhoneArr[i]) {
                if (telephoneRule1.test(nameEmailPhoneArr[i]) || telephoneRule2.test(nameEmailPhoneArr[i]) || telephoneRule3.test(nameEmailPhoneArr[i])) {
                    phone = nameEmailPhoneArr[i]
                } else if (emailreg.test(nameEmailPhoneArr[i])) {
                    email = nameEmailPhoneArr[i]
                } else {
                    layer.msg('邮箱或者电话格式不正确！')
                    return false;
                }
            }
        }
        var sourceId = 0;
        var soureg = new RegExp('sourceId=(\d*[a-zA-Z]*[^?|^#|^&]*)');
        var sourcematch = location.href.match(soureg)
        if (sourcematch) {
            sourceId = sourcematch[1]
        }
        var sysNum = '';
        var sysreg = new RegExp('sysNum=(\d*[a-zA-Z]*[^?|^#|^&]*)');
        var sysmatch = location.href.match(sysreg)
        if (sysmatch) {
            sysNum = sysmatch[1]
        }
        $.ajax({
            type: 'post',
            datatype: 'json',
            cache: false,//不从缓存中去数据,
            url: encodeURI('../servlet/AQ'),
            data: {
                s: 'leavemsg',
                sourceId: sourceId,
                sysNum: sysNum,
                name: name,
                telNum: phone,
                email: email,
                content: cont,
            },
            success: function (data) {
                if (data.status == 0) {
                    $("textarea#queAndadv,input#linaxiType").val("")
                    layer.msg('提交成功！')
                } else {
                    layer.msg(data.message)
                }
            },
            error: function () {
                layer.msg('提交失败！请稍后再试')
            }
        })
    })

    $("#linaxiType,#queAndadv").mouseover(function () {
        $(this).attr('placeholder', '')
    })
    $("#linaxiType").mouseout(function () {
        $(this).attr('placeholder', '昵称+邮箱/手机号')
    })
    $("#queAndadv").mouseout(function () {
        $(this).attr('placeholder', '留下您的反馈意见！以便我们提升服务水平和质量!')
    })
});