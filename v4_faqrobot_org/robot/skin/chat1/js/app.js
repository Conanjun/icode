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
        logoUrl: 'robot/skin/chat1/images/logo_max.png',//logo地址 ----------
        logoId: 'logo',// ----------
        webNameId: 'title',//公司名称Id
        intelTitleChange: true,// 智能聊天是否修改标题
        intelTitle: '',// 智能聊天时的标题
        artiTitleChange: true,// 人工时是否修改标题
        artiTitle: '人工客服',// 人工时的标题
        titleInsteadId: 'titles',// 代替标题Id
        webInfoId: 'intro',//公司简介Id
        //userInfoId: 'userInfoId',//用户信息Id
        kfPic: 'robot/skin/chat1/images/robot.png',  //客服图标
        khPic: 'robot/skin/chat1/images/serv.png', //客户图标
        formatDate: '%month%月%date%日 %hour%:%minute%:%second%',//配置时间格式(默认10:42:52 2016-06-24)
        //appHtml: '',// 页面结构
        //appJs: '',// 页面js
        topQueId: 'commonQue',//热门、常见问题Id --------
        //newQueId: 'newQueId',//新增问题Id
        //recommendQueId: 'recommendQueId',//推荐问题Id
        quickServId: 'quickLink',//快捷服务Id
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
        commentFormId: 'feedBackForm',//评论框formId -------
        commentInputCtnId: 'feedBackInput',//评论输入框Id ----
        commentSendBtnId: 'feedBackBtn',//评论发送按钮Id ---------
        commentTipWordId: 'feedBackTip',//评论输入框提示语Id
        //commentTipWord: '描述您的意见和建议，以便我们提升服务水平和质量，谢谢您',//评论输入框提示语
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
        leaveQue: {// 未知问题已回复
            open: true,//是否启用功能
        },
        autoSkip: {//手机不能访问pc页面
            open: true,//是否启用功能
            chatUrl: 'h5chat',// 默认跳转的页面
        },
        faceModule: {//表情模块
            open: true,//是否启用功能
            faceObj: Face,//表情插件实例
        },
        configModule: {//配置模块
            open: true,//是否启用功能
            block1: '.head',//块1-头部
            block2: '.bodyLeftTop',//块2-聊天显示框
            block3: '.bodyLeftBottom',//块3-输入框
            block4: '.bodyRight',//块4-功能框
            bannerCtn: '.headRight',//导航元素
            customCtn: '.bodyRightCtx',//自定义频道
        },
        poweredCtnId: 'power',//技术支持Id
        sendcallback: function(question) {//点击发送按钮的回调
        },
        getCallback: function(answer,data) {//获取到答案后的回调
          
            try{
                play(answer, 'xiaoyan',data);// 文字转语音
            }catch(e) {}
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

    // 手风琴效果
    $('.itemCtx:not(:first)').hide();
    $('body').on('click', '.itemHead', function() {
        $(this).siblings('.itemCtx').slideDown(300);
        $(this).parent().siblings('.itemCtn').find('.itemCtx').slideUp(300);
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

    /* tts开始 */
    var audioPalyUrl = "http://h5.xf-yun.com/audioStream/";

    /**
      * 初始化Session会话
      * url                 连接的服务器地址（可选）
      * reconnection        客户端是否支持断开重连
      * reconnectionDelay   重连支持的延迟时间   
      */
    var session = new IFlyTtsSession({
        'url'                : 'ws://h5.xf-yun.com/tts.do',
        'reconnection'       : true,
        'reconnectionDelay'  : 30000
    });
    /* 音频播放对象 */
    window.iaudio = null;
    /* 音频播放状态 0:未播放且等待音频数据状态，1:正播放且等待音频数据状态，2：未播放且不等待音频数据*/
    var audio_state = 0;
    /***********************************************local Variables**********************************************************/

    function play(content, vcn, data){
        reset();
        
        //ssb_param = {"appid": '577ca2ac', "appkey":"9a77addd1154848d", "synid":"12345", "params" : "ent=aisound,appid=577ca2ac,aue=lame,vcn="+vcn};

        //session.start(ssb_param, content, function (err, obj)
        //{
            //var audio_url = audioPalyUrl + obj.audio_url;
            // if( audio_url != null && audio_url != undefined )
            // {
                // window.iaudio.src = audio_url;
                // window.iaudio.play();
            // }
        //});
        if(data.robotAnswer[0].answerVoicePath && data.robotAnswer[0].answerVoicePath!=''){
            var audio_url = data.robotAnswer[0].answerVoicePath;
             if( audio_url != null && audio_url != undefined )
             {
                 window.iaudio.src =window.location.protocol+'//'+ window.location.host+'/'+audio_url;
                 window.iaudio.play();
             }
        }
        else{
            $.ajax({
                 type: "POST",
                 url: "https://v2text.faqrobot.net/voice/textToVoiceForPage.do",
                 dataType: 'jsonp',
                 data: {
                     text: content
                 },
                 success: function(data) {
                     var audio_url = data.value;
                     if( audio_url != null && audio_url != undefined )
                     {
                         window.iaudio.src = audio_url;
                         window.iaudio.play();
                     }
                 },
                 error: function(data) {
                     console.error(data);
                 }
            });
        }
    };

    /**
      * 停止播放音频
      *
      */
    function stop() {
        audio_state = 2;
        window.iaudio.pause();
    }

    function start() {
        audio_state = 1;
        window.iaudio.play();
    }

    /**
      * 重置音频缓存队列和播放对象
      * 若音频正在播放，则暂停当前播放对象，创建并使用新的播放对象.
      */
    function reset()
    {
        audio_array = [];    
        audio_state = 0;
        if(window.iaudio != null)
        {
            window.iaudio.pause();
        }
        window.iaudio = new Audio();
        window.iaudio.src = '';
    };
    /* tts结束 */

    /* iat开始 */

    // 语音结果回调
    function iatCallback(status, result) {
        if(status) {
            FAQ.showMsg(result);
        }else {
            result=result.substr(0,result.length-1);
            $('.input').val(result);
            $('.sendBtn').trigger('click');
        }
    }

    var iflytek = (function(document){
        var iat_result = document.getElementById('iat_result');
        var tip = document.getElementById('a');
        var volumeTip = document.getElementById('volume');
        volumeTip.width = parseFloat(window.getComputedStyle(tip, null).width) -100;
        var volumeWrapper = document.getElementById('canvas_wrapper');
        var oldText = tip.innerHTML;
        /* 标识麦克风按钮状态，按下状态值为true，否则为false */
        var mic_pressed = false;
        var volumeEvent = (function () {
            var lastVolume = 0;
            var eventId = 0;
            var canvas = volumeTip,
                cwidth = canvas.width,
                cheight = canvas.height;
            var ctx = canvas.getContext('2d');
            var gradient = ctx.createLinearGradient(0, 0, cwidth, 0);
            var animationId;
            gradient.addColorStop(1, 'red');
            gradient.addColorStop(0.8, 'yellow');
            gradient.addColorStop(0.5, '#9ec5f5');
            gradient.addColorStop(0, '#c1f1c5');

            volumeWrapper.style.display = "none";

            var listen = function(volume){
                lastVolume = volume;
            };
            var draw = function(){
                if(volumeWrapper.style.display == "none"){
                    cancelAnimationFrame(animationId);
                }
                ctx.clearRect(0, 0, cwidth, cheight);
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 1 + lastVolume*cwidth/30, cheight);
                animationId = requestAnimationFrame(draw);
            };
            var start = function(){
                animationId = requestAnimationFrame(draw);
                volumeWrapper.style.display = "block";
            };
            var stop = function(){
                clearInterval(eventId);
                volumeWrapper.style.display = "none";
            };
            return {
                "listen":listen,
                "start":start,
                "stop":stop
            };
        })();
        /***********************************************local Variables**********************************************************/

        /**
         * 初始化Session会话
         */
        var session = new IFlyIatSession({
            "callback":{
                "onResult": function (err, result) {
                    /* 若回调的err为空或错误码为0，则会话成功，可提取识别结果进行显示*/
                    if (err == null || err == undefined || err == 0) {
                        if (result == '' || result == null)
                            //iat_result.innerHTML = "没有获取到识别结果";
                            iatCallback(1, '没有获取到识别结果');
                        else
                            iatCallback(0, result);
                            //iat_result.innerHTML = result;
                        /* 若回调的err不为空且错误码不为0，则会话失败，可提取错误码 */
                    } else {
                        iatCallback(1, result);
                        //iat_result.innerHTML = 'error code : ' + err + ", error description : " + result;
                    }
                    mic_pressed = false;
                    volumeEvent.stop();
                },
                "onVolume": function (volume) {
                    volumeEvent.listen(volume);
                },
                "onError":function(){
                    mic_pressed = false;
                    volumeEvent.stop();
                },
                "onProcess":function(status){
                    var tip = '';
                    switch (status){
                        case 'onStart':
                            tip = "服务初始化...";
                            break;
                        case 'normalVolume':
                        case 'started':
                            tip = "倾听中...";
                            break;
                        case 'onStop':
                            tip = "等待结果...";
                            break;
                        case 'onEnd':
                            tip = oldText;
                            break;
                        case 'lowVolume':
                            tip = "倾听中...(声音过小)";
                            break;
                        default:
                            tip = status;
                    }
                    $('.iatTip').text(tip);
                }
            }
        });

        if(!session.isSupport()){
            tip.innerHTML = "当前浏览器不支持！";
            return;
        }

        var play = function() {
            if (!mic_pressed) {
                var ssb_param = {
                    "grammar_list": null,
                    "params": "appid=577ca2ac,appidkey=9a77addd1154848d, lang = sms, acous = anhui, aue=speex-wb;-1, usr = mkchen, ssm = 1, sub = iat, net_type = wifi, rse = utf8, ent =sms16k, rst = plain, auf  = audio/L16;rate=16000, vad_enable = 1, vad_timeout = 5000, vad_speech_tail = 500, compress = igzip"
                };
                iat_result.innerHTML = '   ';
                /* 调用开始录音接口，通过function(volume)和function(err, obj)回调音量和识别结果 */
                session.start(ssb_param);
                mic_pressed = true;
                volumeEvent.start();
            }
            else {
                //停止麦克风录音，仍会返回已传录音的识别结果.
                session.stop();
            }
        }

        /**
         * 取消本次会话识别
         */
        var cancel = function() {
            session.cancel();
        }

        tip.addEventListener("click",function(){
            play();
        });
        //页面不可见，断开麦克风调用
        document.addEventListener("visibilitychange",function(){
            if(document.hidden == true){
                session.kill();
            }
        });
    })(document)
    /* iat结束 */

});