; $(function () {
    //调用表情插件
    function set_chatScroll_height() {
        var winW = $(window).width(),
            winH = $(window).height();
        $('html').css('fontSize', winW < 750 ? winW : 750);
    }
    var Face = $('#input').face({
        src: 'src/dw/',//表情路径
        rowNum: 7,//每行最多显示数量，此属性不适用于常用语
        ctnAttr: ['0', '30px', '45px', '46px'],//[left bottom width height] 表情框相对targetEl位置和里面的表情格子宽高  要写单位
        triggerEl: $('.emoj'),//触发按钮(不存在则自己生成，不要由a包裹)
        targetEl: $('.showFace'),//父级参照物(用于appendTo和定位)
        hideAdv: true,//是否隐藏广告
        setMaxNum_y: 15,// 设置表情显示的行数
        callback: function () {
            //$('.editHide').hide();
            //$('.sendBtn').show().siblings().hide();
            setTimeout(function () {
                $('#input').focus();
            }, 50);
        },
    });
    var FAQ = '';

    FAQ = new Faqrobot({
        
        logoUrl: 'robot/skin/chat2/images/logo_max.png',//logo地址 ----------
        logoId: 'logo',
        intelTitleChange: true,// 智能聊天是否修改标题
        artiTitleChange: true,// 人工时是否修改标题
        artiTitle: '人工客服',// 人工时的标题
        robotInfo: 'robotInfo',
        isDeppon: true,
        shakeScreen: 'shakeScreen',//抖屏按钮
        shakeScreenModal: 'shakeScreenModal',//抖屏模态框
        refuseEvaluate: false,//拒绝评价
        endCustomBtn: 'endCustomBtn',//结束人工
        /**
         * taskid=554 顾荣  ppmoney客服头像与机器人 2018/1/5
         * 原因：区分是机器人客服还是人工客服
         * 修改：添加服图标分为机器人和人工客服
         */
        recommendLinkId: 'recommendLinkId',
        recommendLinkCallBack: recommendLinkCallBack,
        kfPic: 'robot/skin/chat2/images/robot.png',  //客服图标
        kf_Robot_Pic: 'robot/skin/chat2/images/robot.png',  //机器人客服图标
        kf_Person_Pic: 'robot/skin/chat2_deppon/images/staffService.png',  //人工客服图标
        kf_Robot_Name: '',//机器人客服名字，此处只是声明个变量，不用赋值
        kf_Person_Name: '小邦手',//人工客服名字
        klCallback: klCallbackFn,
        khPic: 'robot/skin/chat2/images/serv.png', //客户图标
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
        quickCallback: quickCallback,
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
        artiSearchCallback: function (data) {
            if (data.fullTextSearch) {
                $('.thirdURL').addClass('thirdURLRecommend');
                $('.artiSearch').removeClass('artiSearchHide');
                $('.itemCtn').css('width', '49%');
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
        thirdUrlCallBack: function (data, index) {
            if (!index) index = 0;
            if (data.robotAnswer[index].thirdUrl && data.robotAnswer[index].thirdUrl.url) {
                $('.thirdURL').removeClass('thirdURLRecommend');
                $('.itemHead5').trigger('click');
                // $('.itemCtn').css('width', '49%');
                $('#modalOrderIframe').find('iframe').attr('src', data.robotAnswer[index].thirdUrl.url)
                $('.myMail').trigger('click');
                if (!$('.artiSearch').hasClass('artiSearchHide')) {
                    $('.artiSearch').addClass('artiSearchHide')
                }
                $('#' + FAQ.options.thirdUrlId + ' iframe').attr('src', data.robotAnswer[index].thirdUrl.url);
            } else {
                $('.thirdURL').addClass('thirdURLRecommend');
                $('.itemCtn').removeAttr('style');
                //$('.itemHead1').trigger('click');
            };
        },
       
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
            $('.itemCtn').css('width', '49%');
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
        set_tab()
    });

    var orign = 0
    function set_tab() {
        var winW = $('body').width() - 40,
            leftW = $('.headLeft').width(),
            rightW = $('.headRight').width() > winW ? parseInt((winW - leftW) / 130) * 130 : $('.headRight').width(),
            nWidth = rightW + leftW,
            cWidth = nWidth - winW
        if (cWidth > 0) {
            var cont = parseInt(cWidth / 130) + 1
            $('.headRight').width(rightW - 130 * cont)
        } else if (rightW < orign) {
            var cont = parseInt(-cWidth / 130)
            $('.headRight').width(rightW + 130 * cont)
        }
    }
    function set_whole_size() {
        var winW = $('body').width(),
            winH = $('body').height();

        // autoSize[0] = winW>=maxSize[0] ? maxSize[0] : winW;
        autoSize[1] = winH >= maxSize[1] ? maxSize[1] : winH;
        if (winW <= 1000) {
            $('.whole').css({
                'width': '1000px',
                'height': '100%',
            });
        } else {
            $('.whole').css({
                'width': '100%',
                'height': '100%',
                // 'margin-left': -autoSize[0]/2,
                // 'margin-top': -autoSize[1]/2,
            });
        }
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
    // $("#itemCtxCtnBox").css("height",($(".bodyRight").css("height").split("px")[0]-$(".itemBtnCtn").css("height").split("px")[0]))    
    $(window).resize(function () {
        $("#serveIframe").css("height", ($(".bodyRight").css("height").split("px")[0] - $(".itemBtnCtn").css("height").split("px")[0]))
        $(".itemCtxCtn").css("width", $("#itemCtxCtnBox").css("width"))
        // $("#itemCtxCtnBox").css("height",($(".bodyRight").css("height").split("px")[0]-$(".itemBtnCtn").css("height").split("px")[0]))
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
    //taskId = 517PC端页面优化
    $('body').on('click', function (e) {
        if ($(e.target).is('.font') || $(e.target).is('.emoj') || $(e.target).is('.pic input') || $(e.target).is('.file input') || $(e.target).is('.pinjia') || $(e.target).is('.screenshots') || $(e.target).is('.artificial')) {
            $('.corpation .icon').removeClass('active');
            $(e.target).addClass('active');
            if ($(e.target).is('.font')) {
                $('.selectFont').removeClass('hide');
                $('.editDetail .corpation').css('padding-top', '5px')
            } else {
                $('.selectFont').addClass('hide');
                $('.editDetail .corpation').css('padding-top', '15px')
            }
            if ($(e.target).parent().is('.pic')) {
                $(e.target).parent().addClass('active')
            }
            if ($(e.target).parent().is('.screenshots')) {
                $(e.target).parent().addClass('active')
            }
            if ($(e.target).parent().is('.file')) {
                $(e.target).parent().addClass('active')
            }
            if ($(e.target).parent().is('.artificial')) {
                $(e.target).parent().addClass('active')
            }
        } else {
            if ((!$(e.target).is('#fontFamliy')) && (!$(e.target).is('#fontSize'))) {
                $('.editDetail .corpation').css('padding-top', '15px')
                $('.selectFont').addClass('hide');
            }
            $('.corpation .icon').removeClass('active');
        }
    })
    // $('.corpation .pic,.corpation .file').hide()
    //taskId = 517PC端页面优化，修改字体，保存字体样式和大小
    $('#fontFamliy').on('change', function () {
        sessionStorage.setItem('fontFamliy', $('#fontFamliy').val());
        var fontFamliy = sessionStorage.getItem('fontFamliy');
        $('html,body,#chatCtn div, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, fieldset, lengend, button, input, textarea, th, td, a').css('font-family', fontFamliy)
        setTimeout(function () {
            FAQ.scrollbar.update()
            FAQ.scrollbarUpdate()
        }, 300)
    })
    $('#fontSize').on('change', function () {
        sessionStorage.setItem('fontSize', $('#fontSize').val());
        var fontSize = sessionStorage.getItem('fontSize') + 'px';
        $('html,body,#chatCtn div, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, fieldset, lengend, button, input, textarea, th, td, a').css('font-size', fontSize);
        setTimeout(function () {
            FAQ.scrollbar.update()
            FAQ.scrollbarUpdate()
        }, 300)
    })

    /**************************德邦定制 start**************************/
    //初始化
    var captureObj = new NiuniuCaptureObject();//生成实例
    var quickList = [];
    depponInit()//初始化
    function depponInit() {
        captureObj.InitNiuniuCapture();//初始化控件
        captureObj.VersionCallback = function () { }
        $('.corpation .pic,.corpation .file,#endCustomBtn').addClass('hide')//默认隐藏
        sendLeaveMessage()//留言功能
        cutImages()//截图
        evaluation()//满意度评价
        sendShake()//抖屏功能
        endCustom()//结束人工
    }
    //满意度评价
    function evaluation() {
        $("[name=satisfaction][value=2]").parent().css('background-position', '-111px -15px');
        $("[name=satisfaction]").unbind('click').bind('click', function () {
            if ($(this).prop('checked')) {
                $(this).attr('checked', 'true')
                $(this).parent().css('background-position', '-111px -15px');
                $(this).parents('.rad').siblings().find('a').css('background-position', '-96px -15px');
            }
        });
        $('.pinjiaNew').click(function () {
            $('#dialogEvaluationModal').modal('show')
        })
        $('#dialogDBSave').click(function () {
            var content = $('#stapinContext').val();
            var level = $("[name=satisfaction]:checked").val();
            $.ajax({
                type: 'post',
                datatype: 'json',
                url: encodeURI('../../servlet/AQ'),
                data: {
                    s: 'evaluate',
                    sourceId: 0,
                    sysNum: FAQ.options.sysNum,
                    content: content,
                    level: level
                },
                success: function (data) {
                    if (data.status == 0) {
                        layer.msg('已收到您的评价，再次感谢您的支持！', {
                            time: 5000,
                            btn: ['关闭'],
                            area: '450px',
                            // yes: function () {
                            //     window.close()
                            // },
                            // end: function () {
                            //     window.close()
                            // }
                        })
                        $('#dialogEvaluationModal').modal('hide')
                    } else {
                        layer.msg(data.message)
                    }
                }
            })
        })
    }
    //留言功能
    function sendLeaveMessage() {
        $('#leaveMessageDBModal .timeOptions').append(createOptiom())
        var leaveMessageDBForm = $('#leaveMessageDBForm').validate({
            rules: {
                name: {
                    required: true
                },
                phoneNumber: {
                    required: true
                },
                content: {
                    required: true,
                }
            },
            messages: {
                name: '请输入姓名',
                phoneNumber: '请输入移动电话',
                content: '请输入留言内容'
            },
            submitHandler: leaveMessageDBSubmit
        });
        $('#leaveMessageDBSubmit').click(function () {
            $('#leaveMessageDBForm').submit();
        });
        function leaveMessageDBSubmit() {

        }
        $('#leaveMessageDBModal').on('hide.bs.modal', function () {
            leaveMessageDBForm.resetForm();
            $('#leaveMessageDBForm')[0].reset();
        })
    }
    //选择满意度评价级别
    function createOptiom() {
        var timeLen = 25;
        var tmpl = ''
        for (var i = 0; i < timeLen; i++) {
            tmpl += '<option value=' + i + '>' + i + '</option>'
        }
        return tmpl
    }
    //截屏
    function cutImages() {
        $('.screenshots').unbind('click').bind('click', function () {
            var captureRet = captureObj.DoCapture("pic.jpg", 0, 0, 0, 0, 0, 0);
            if (captureRet === 2) {//没有安装控件
                ShowIntallDownload();
            }
        });
    }
    //判断是否下载截图插件
    function ShowIntallDownload() {
        var ret = confirm("您需要先下载控件进行安装，点击确定继续!");
        if (ret) {
            window.location.href = "http://www.ggniu.cn/download/CaptureInstall.exe";
        }
    }
    // 截图完成回调
    captureObj.FinishedCallback = function (type, x, y, width, height, info, content, localpath) {
        FAQ.sendScreenPic(content);
    }
    // 获取推荐资讯回调
    function recommendLinkCallBack(data) {
        if (data && data.chatFormSugLink) {
            $('.newsListContent .list').empty();
            var tmpl = '';
            data.chatFormSugLink.forEach(function (item, index) {
                if (index == 0) {
                    tmpl += '<li class="active"><a href="' + item.linkurl + '" target="_blank"><img src="' + item.content + '" /></a></li>'
                } else {
                    tmpl += '<li><a href="' + item.linkurl + '" target="_blank"><img src="' + item.content + '" /></a></li>'
                }
            })
            $('.newsListContent .list').append(tmpl)
            setInterval(setInvalNews, 3000)
        }
    }
    // 定时展示轮播
    function setInvalNews() {
        var newsImg = Array.prototype.slice.call($('.newsListContent li'));
        for (var i = 0; i < newsImg.length; i++) {
            if ($(newsImg[i]).hasClass('active')) {
                $(newsImg[i]).removeClass('active');
                if ($(newsImg[i]).next().length > 0) {
                    $(newsImg[i]).next().addClass('active');
                    break;
                } else {
                    $(newsImg[0]).addClass('active')
                    break;
                }
            }
        }
    }
    // 转人工 智能聊天回调
    function klCallbackFn(data) {
        if (data && data.data instanceof Array && data.data.length > 0) {
            data.data.forEach(function (item) {
                if (item.content) {
                    $('.MN_answer[cluid=' + item.content + ']').remove();
                }
                if (item.eventResultType === 2) {
                    FAQ.options.refuseEvaluate = true;
                    $('#dialogEvaluationModal').modal('show')
                }
            })
        }
        // 人工
        if (data.nowState == 3 || data.nowState == 5) {
            $('#screenshots').removeClass('hide');
            $('#artificial').addClass('hide');
            $('.corpation .file').removeClass('hide');
            $('#endCustomBtn').removeClass('hide');
            $('.pinjiaNew').removeClass('hide');
            $('.pinjia').addClass('hide');
            $('.' + FAQ.options.shakeScreen).removeClass('hide')
        } else {
            //机器人
            $('.' + FAQ.options.shakeScreen).addClass('hide')
            $('.pinjiaNew').addClass('hide');
            $('.pinjia').removeClass('hide');
            $('.corpation .file').addClass('hide');
            $('#screenshots').addClass('hide');
            $('#endCustomBtn').addClass('hide');
            $('#artificial').removeClass('hide');
        }
    }
    // 快捷服务回调
    function quickCallback(data) {
        if (data && data.quickLink) {
            var quickList = [];
            quickList = data.quickLink;
            var dom = $('.quickContent')
            var quickTmpl = '';
            data.quickLink.forEach(function (item) {
                quickTmpl += createQuick(item);
            })
            setTimeout(function () {
                dom.empty().append(quickTmpl);
                $('.quickContent').width(data.quickLink.length * 130)
                orign = $('.quickContent').width()
                set_tab()
            }, 200)
        }

    }
    //创建快捷服务
    function createQuick(data) {
        var targetTmpl = data.mediumType === 0 ? 'target="_blank"' : '';
        var tmpl = '<li>' +
            '<a ' + targetTmpl + ' href="' + data.linkUrl + '">' +
            '<div class="dbIco">' +
            '<img src="' + data.imageUrl + '"/>' +
            '</div>' +
            '<span>' + data.name + '</span>' +
            '</a>' +
            '</li>'
        return tmpl
    }
    //点击抖屏按钮，发送抖屏消息
    function sendShake() {
        $('.' + FAQ.options.shakeScreen).on('click', function () {
            FAQ.sendShakeScreen()
            setTimeout(function () {
                $('.' + FAQ.options.shakeScreen).removeClass('clicked')
                $('#' + FAQ.options.shakeScreenModal).hide()
            }, 2000)
        })
    }
    //结束人工评价
    function endCustom() {
        $('#' + FAQ.options.endCustomBtn).on('click', function () {
            $('#endCustomModal').modal('show');
        })
        $('#confirmShutDown').on('click', function () {
            FAQ.sendEndCustom()
            $('#endCustomModal').modal('hide');
        });
        $('.closeEndCustom').on('click', function () {
            $('#endCustomModal').modal('hide');
        });
    }
    // 德邦快捷服务埋点
    function buriedPoint() {
        $('body').on('click', '.myMail,.dbHeader>li', function () {
            dataLayer.push({
                'event': 'ua event',
                'eventCategory': '快捷服务',
                'eventAction': $(this).text().replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]$/g, ''),
                'eventLabel': '点击'
            });
        })

    }
    buriedPoint();
    /**************************德邦定制 嗯对**************************/
});