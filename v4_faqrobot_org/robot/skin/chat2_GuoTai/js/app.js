;$(function() {
     //调用表情插件
    
    var Face = $('.textarea').face({
        src: 'src/yun/',//表情路径
        open: false,
    });
    var FAQ ='';
    if(getUrlParam('lan') && getUrlParam('lan')=='en'){
        //英文模式
        FAQ = new Faqrobot({
            logoUrl: 'robot/skin/chat2_GuoTai/images/logo.png',//logo地址 ----------
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
            kfPic: 'robot/skin/chat2_GuoTai/images/logo.png',  //客服图标
            khPic: 'robot/skin/chat2_GuoTai/images/kehu.png', //客户图标
            formatDate: '%hour%:%minute%:%second% %year%-%month%-%date%',//配置时间格式(默认10:42:52 2016-06-24)
            topQueId: 'commonQue',//热门、常见问题Id --------
            quickServId: 'quickLink',//快捷服务Id
            thirdUrlId:'thirdUrl',
            chatCtnId: 'chatCtn',//聊天展示Id y   --------------
            inputCtnId: 'input',//输入框Id y   --------
            sendBtnId: 'sendBtn',//发送按钮Id y   ------
            tipWordId: 'inputTip',
            tipWord: 'please input here',//输入框提示语
            commentTipWord: 'Enter your comments, so that we can improve the service level and quality! ',
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
            leaveMsgTipWord: 'Enter your suggestions, we will deal with you as soon as possible! ',
            autoSkip: {//手机不能访问pc页面
                open: true,//是否启用功能
                chatUrl: 'h5chat',// 默认跳转的页面
            },
            clearBtnId: 'clearBtn',//清除按钮Id
            closeBtnId: 'closeBtn',//关闭聊天页面
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
            logoUrl: 'robot/skin/chat2_GuoTai/images/logo.png',//logo地址 ----------
            logoId: 'logo',
            intelTitleChange: true,// 智能聊天是否修改标题
            artiTitleChange: true,// 人工时是否修改标题
            artiTitle: '人工客服',// 人工时的标题
            robotInfo:'robotInfo',
            kfPic: 'robot/skin/chat2_GuoTai/images/logo.png',  //客服图标
            khPic: 'robot/skin/chat2_GuoTai/images/kehu.png', //客户图标
            formatDate: '%month%月%date%日 %hour%:%minute%:%second%',//配置时间格式(默认10:42:52 2016-06-24)
            topQueId: 'commonQue',//热门、常见问题Id --------
            quickServId: 'quickLink',//快捷服务Id
            thirdUrlId:'thirdUrl',
            chatCtnId: 'chatCtn',//聊天展示Id y   --------------
            inputCtnId: 'input',//输入框Id y   --------
            sendBtnId: 'sendBtn',//发送按钮Id y   ------
            tipWordId: 'inputTip',
            commentFormId: 'feedBackForm',//评论框formId -------
            commentInputCtnId: 'feedBackInput',//评论输入框Id ----
            commentSendBtnId: 'feedBackBtn',//评论发送按钮Id ---------
            commentTipWordId: 'feedBackTip',//评论输入框提示语Id
            artiSearchId: 'artiSearch',//智能搜索
            operationSystemName:true,//是否在s=p接口发送operationSystemName参数
            
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
            clearBtnId: 'clearBtn',//清除按钮Id
            closeBtnId: 'closeBtn',//关闭聊天页面
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
                    $('.itemHead1').trigger('click');
                 };
            }
        });
    }
    //faqrobot
    
    //bodyRight调用滚动条插件
    var bodyRight_scrollbar = $('#commonQueBox').scrollbar({
        'autoBottom': false,//内容改变，是否自动滚动到底部
    });

    //调用自动补全插件
    $('.input').autocomplete({
        url: 'servlet/AQ?s=ig',
            targetEl: $('.inputCtn'),//参照物(用于appendTo和定位)
            posAttr: ['0px', '100px'],//外边框的定位[left bottom]
            itemNum: 10,//[int] 默认全部显示
            callback: function(data) {//获取文本后的回调函数
                $('.sendBtn').trigger('click');
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



    //点击满意度评价弹出满意度评价框
    $("#loveBtn").click(function(){
        // if($("input[name=satis]").eq(0).prop('checked')){
        $("input[name=satis]").eq(0).attr("checked",true)
        $("input[name=satis]").eq(0).parent().css('background-position','-111px -15px');
        $("input[name=satis]").eq(1).parent().css('background-position','-96px -15px');
        $('#muiList').html('');            
        // }
        $('#dialogFeedModal').removeClass('fade');
        $('#dialogFeedModal').addClass('show');
    })
    //聊天框调节字号和字号功能
    $("body").on('click', function() {
        $(".popFont").hide();
      });
      $("#font").on('click', function(event) {
        $(".popFont").show();
        event.stopPropagation();
      });
      $(".popFont").on('click', function(event) {
        event.stopPropagation();
      });
      $("#fonts").on('change', function() {
        $(".bodyLeftTop").css("font-size", $("#fonts").val());
        $(".MN_kfCtn>p").css("font-size", $("#fonts").val());
        $("#input").css("font-size", $("#fonts").val());
        // $(".popFont").hide();
        $("#chatCtn").css("opacity",0)
        setTimeout(function() {
            $("#chatCtn").css("opacity",1)
            FAQ.scrollbar.update()
            FAQ.scrollbar.scrollTo('bottom') 
        }, 300);
          
      });
      $("#fontf").on('change', function() {
        $(".bodyLeftTop").css("font-family", $("#fontf").val());
        $(".MN_kfCtn>p").css("font-family", $("#fontf").val());
        $("#input").css("font-family", $("#fontf").val());
        // $(".popFont").hide();   
      });


      //调用表情插件
      var Face = $('#input').face({
          src: 'src/yun/',//表情路径
          rowNum: 5,//每行最多显示数量，此属性不适用于常用语
          btnAttr: [20, 5, 20, 20],
          ctnAttr: [0, 40, 70, 70],
          targetEl: $("#faceRoot"),
          triggerEl: $("#faceBtn"),
          hideAdv: true,
          callback: function() {
        $('#sendBtn').trigger('click');
          }
      });

      //聊天框小提示变化
      $(".Panel_word").on('mouseenter mouseleave', function(event) {
        if (event.type == "mouseenter") {
          //鼠标悬浮如果超过300ms显示,否则不显示
          var timer = setInterval(function() {
            if($('.Panel_word:hover').length > 0){
              $(".popTips:not(:animated)").fadeIn();
            }
            clearInterval(timer);
          }, 300);
        } else if (event.type == "mouseleave") {
          //鼠标离开
          $(".popTips:not(:animated)").fadeOut();
        }
      });
      //聊天框小提示关闭
        $(".popClose").on('click', function() {
            $(".popTips").hide();
        });
        //聊天框小提示变色
        $("#tipToLeft").on('mouseover mouseout', function(event) {
            if (event.type == "mouseover") {
                //鼠标悬浮
                $(this).attr('class', 'icon-tips_left_hover');
            } else if (event.type == "mouseout") {
                //鼠标离开
                $(this).attr('class', 'icon-tips_left_normal');
            }
        });
        $("#tipToRight").on('mouseover mouseout', function(event) {
            if (event.type == "mouseover") {
                //鼠标悬浮
                $(this).attr('class', 'icon-tips_right_hover');
            } else if (event.type == "mouseout") {
                //鼠标离开
                $(this).attr('class', 'icon-tips_right_normal ');
            }
        });
        //聊天框小提示切换
        var oul = document.getElementById("tipMsg");
        $('.imgRight').on('click', function() {
            var arr = [];
            for (var i = 0; i < oul.childNodes.length; i++) {
                if (oul.childNodes[i].nodeType == 1) {
                    arr.push(i);
                }
            }
            var serial = $(oul.childNodes[arr[0]]).attr('orderT');
            if (serial == '3') {
                $('.lPic img').attr('src', './skin/chat2_GuoTai/images/tip1.png');
            } else {
                $('.lPic img').attr('src', './skin/chat2_GuoTai/images/tip' + (serial * 1 + 1) + '.png');
            }
            onMove(oul, {left: -260},10, function() {
                oul.appendChild(oul.childNodes[arr[0]]);
                oul.style.left = "0px";
            });
        });
        $('.imgLeft').on('click', function() {
            var arr = [];
            for (var i = 0; i < oul.childNodes.length; i++) {
                if (oul.childNodes[i].nodeType == 1) {
                    arr.push(i);
                }
            }
            var serial = $(oul.childNodes[arr[arr.length - 1]]).attr('orderT');
            $('.lPic img').attr('src', './skin/chat2_GuoTai/images/tip' + serial + '.png');
            oul.insertBefore(oul.childNodes[arr[arr.length - 1]], oul.childNodes[1]);
            oul.style.left = "-260px";
            onMove(oul, {left: 0},10);
        });

        //缓动框架 start
        function onMove(obj, json, iSpeed, fn) {
            var timer = null;
            var num = 0;
            var iCur = 0;
            var attr = "";
            var iTarget = 0;
            var onoff = true;
            clearInterval(obj.timer);
            obj.timer = setInterval(function() {
                var onoff = true;
                for (var attr in json) {
                    iTarget = json[attr];
                    if (attr == "opacity") {
                        iCur = parseFloat(getStyle(obj, attr)).toFixed(2) * 100;
                    } else {
                        iCur = parseInt(getStyle(obj, attr));
                    }
                    if (iCur < iTarget) {
                        num = Math.ceil((iTarget - iCur) / iSpeed);
                    } else {
                        num = Math.floor((iTarget - iCur) / iSpeed);
                    }
                    if (iCur != iTarget) {
                        onoff = false;
                    }
                    if (attr == "opacity") {
                        obj.style[attr] = (iCur + num) / 100;
                    } else {
                        obj.style[attr] = iCur + num + "px";
                    }
                }
                if (onoff) {
                    clearInterval(obj.timer);
                    if (fn) {
                        fn();
                    }
                }
            },
            20);
        }
        function getStyle(obj, attr) {
            return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
        }
        //缓动框架 end
        /**
         * taskid=675 国泰基金跨界服务功能优化 顾荣 2018/1/22
         * 添加：点击跨界服务可在iframe中打开网页
         */
        $("#serveIframe").css("height",($(".bodyRight").css("height").split("px")[0]-$(".itemBtnCtn").css("height").split("px")[0]))
        $("#commonQueBox").css("height",($(".body").css("height").split("px")[0]-$(".itemBtnCtn").css("height").split("px")[0]))
        $(window).resize(function () { 
            $("#serveIframe").css("height",($(".bodyRight").css("height").split("px")[0]-$(".itemBtnCtn").css("height").split("px")[0]))
            $("#commonQueBox").css("height",($(".body").css("height").split("px")[0]-$(".itemBtnCtn").css("height").split("px")[0]))
        })
        $("#quickLink").on("click","a.MN_quickLink",function(){//点击快捷服务时，在iframe内打开网页
            $("#serveIframe").css("display","block");
            $("#serveIframe").addClass("noclose");
            $("#serveIframe").find("#quickIframe").attr("src",$(this).attr("href"));
            return false;    
        })
        $("#cloQuIframe").click(function(){//点击返回时时，在关闭iframe网页
            $("#serveIframe").css("display","none");
            $("#serveIframe").removeClass("noclose");
            $("#serveIframe").find("#quickIframe").attr("src",""); 
        })
        $(".itemBtnCtn .itemCtn").click(function(){//切换右侧时影藏iframe
            if(!$(this).hasClass("quickLink")){
                $("#serveIframe").css("display","none")
            }else if($("#serveIframe").hasClass("noclose")){
                $("#serveIframe").css("display","block")
                $("#serveIframe").find("iframe").attr("scrolling","auto")
            }
        })
});