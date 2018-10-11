; $(function () {
    var timerDown = null; // 滚动到底部定时器
    FastClick.attach(document.body);
    set_chatScroll_height();

    /*收缩工具栏时，调整聊天页面的高度*/
    function set_chatScroll_height() {
        var winW = $('html').width(),
            winH = $('html').height();
        $('html').css('fontSize', winW < 750 ? winW : 750);

        $('.chatScroll').height(winH - $('.editCtn').outerHeight());
    }
    /**
     * 微信/app共用页面，app中打开隐藏语音功能
    */
    function isWechat(){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.indexOf('micromessenger')!=-1){
           return true 
        }else{
            return false
        }
    }

    if(!isWechat()){
        $('.voiceBtn').hide();
        $('.editShow').css('padding-left','13px')
    }
        
    $(window).on('resize', function () {
        set_chatScroll_height();
    });

    /**
     * 调用自动补全插件 
     * */
    $('.textarea').autocomplete({
        url: 'servlet/appChat?s=ig',//[string]
        targetEl: $('.editShow'),//参照物(用于appendTo和定位)
        posAttr: ['0rem', '0.133rem'],//外边框的定位[left bottom]
        itemNum: 5,//[int] 默认全部显示
        callback: function (data) {//获取文本后的回调函数
            //由于发送按钮被隐藏，直接调用发送事件
            $('.sendBtn').trigger('click');

        }
    });

    /**处理输入引导接口延时问题
     * 点击发送按钮后，延时检测输入框是否有文字，如果没有则隐藏输入引导
     * */ 
    var delay = null;
    function clearAU (){
        delay=setInterval(function(){
            if(!$('.textarea').val()){
                $('.AU_outerCtn').hide();
            }
        },100)
    }


    /**
     * 滚动到底部定时器
    */
    var timer = null;

    /**
     * 显示隐藏工具栏
     * */
    $('.view').on('click', function (e) {//不能用body hack ios
        var _target = $(e.target);
        if (_target.is('.faceBtn') || _target.is('.expendBtn')) {
            $('.editHide').show();
            if ( $('.textareaCtn').hasClass('hide')) {
                $('.voiceBtn').find('i').attr('class', 'iconfont icon-yuyin');
                $('.textareaCtn').removeClass('hide');
                $('#a').addClass('hide');
            }
        } else if (_target.is('#chatCtn') || _target.parents().is('#chatCtn')) {
            $('.editHide').hide();
            $('.sendFaceCtn').removeClass('hide');
            $('.keyboardCtn').addClass('hide');
        }
        timerSetHeight()
            .then(function (data) {
                FAQ.scrollbar.update()
                FAQ.scrollbarUpdate()
            })
    });

    /**
     * 输入框事件绑定
 
    */
    $('.textarea').on('input', function () {
        if ($(this).val().replace(/\s+/g, '')) {
            $('.sendBtn').removeClass('hide');
            $('.addBtn').addClass('hide');
        } else {
            $('.sendBtn').addClass('hide');
            $('.addBtn').removeClass('hide');
        }
    }).on('focus', function () {
        // 工具栏收缩
        if ($('.FA_backCtn').css('display') == 'block') {
           $('.editHide').hide();
        } else {
            $('.editHide').hide();
        }
        $('.sendFaceCtn').removeClass('hide');
        $('#keyboard').addClass('hide');
        timerSetHeight()
            .then(function (data) {
                FAQ.scrollbar.update()
                FAQ.scrollbarUpdate()
            })
    }).on('blur', function () {
        timerSetHeight()
            .then(function (data) {
                if (isTouchMove) {
                    isTouchMove = false; // 复位
                    return false;
                }
                FAQ.scrollbar.update()
            })
    });

    /**
     * 点击表情按钮
    */
    $('#sendFace').on('click.FA', function () {
        $(this).addClass('hide');
        $('#keyboard').removeClass('hide');
        if ($('.textareaCtn').hasClass('hide')) {
            $('.voiceBtn').find('i').attr('class', 'iconfont icon-yuyin');
            $('.textareaCtn').removeClass('hide');
            $('#a').addClass('hide');
        }
    })

    /**
     * 点击键盘切换
    */
    $('#keyboard').on('click.FA', function () {
        $('.textarea').focus();
        $(this).addClass('hide');
        $('#sendFace').removeClass('hide');
        $('.editHide').hide();
    })

    /**
     * 功能按钮切换背景
     */
    $('body').on('click', '.editCtn_com', function (e) {
        var that = this;
        $(that).find('.icon-ctn').addClass('active');
        setTimeout(function () {
            $(that).find('.icon-ctn').removeClass('active');
        }, 1000);
    });

    /**
     * 滑动事件
     * */ 
    var isTouchMove = false;
    $('.chatScroll').on('touchmove', function (e) {
        isTouchMove = true;
        $('#sendFace').removeClass('hide');
        $('#keyboard').addClass('hide');
        $('.textarea').blur();
        $('.editHide').hide();
    })

    // 定时设置高度
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


    //调用表情插件
    var Face = $('.textarea').face({
        src: 'src/dw/',//表情路径 takId 408 自如表情
        rowNum: 7,//每行最多显示数量，此属性不适用于常用语
        ctnAttr: ['0rem', '0rem', '0.133rem', '0.122rem'],//[left bottom width height] 表情框相对targetEl位置和里面的表情格子宽高  要写单位
        triggerEl: $('.faceBtn'),//触发按钮(不存在则自己生成，不要由a包裹)
        targetEl: $('.editHide'),//父级参照物(用于appendTo和定位)
        hideAdv: true,//是否隐藏广告
        setMaxNum_y: 15,// 设置表情显示的行数
        callback: function () {
            $('#sendBtn').removeClass('hide');
            $('.keyboardCtn').removeClass('hide');
            $('.addBtn').addClass('hide');
            $('#sendFace').addClass('hide');
            $('.textarea').blur();
            $('.editHide').show();
        },
    });



    var layerCtn = null;//所有的弹出层

    //常见问题
    $('.commonQueCtn').on('click', function () {
        $('.commonQueModal').show()
        $('#commonQueLayer').height($('.commonQueModal').height() - 40)
    });
    /**
     * 选择常见问题
     * */
    $('body').on('click', function (e) {
        if (e.target.className == 'MN_queList') {
            $('.commonQueModal').hide();
            set_chatScroll_height();
        }
        if (e.target.parentNode) {
            if (e.target.parentNode.className == 'MN_queList') {
                $('.commonQueModal').hide();
                set_chatScroll_height();
            }
        }
        // 关闭各种框
        if (e.target.className == 'pull-right closePage') {
            $(e.target).find('.closePage').trigger('click');
        }
    });

    /**
     * 意见反馈
     * */
    $('#sendFeedBack').on('click', function () {
        $('.feedbackModal').show();
    });

    /**
     * 选择满意不满意展示不满意原因
    */
    $('.MN_marginCtn').eq(0).on('click', function () {
        $('.noSatiCtn').hide();
    });
    $('.MN_marginCtn').eq(1).on('click', function () {
        $('.noSatiCtn').show();
    });
    
    /**
     * 留言
     * */
    $('#sendLeaveMsg').on('click', function () {
        $("#leaveMsgBox").css("display", "block");
        FAQ.writeMsg()
    });
    //taskid=402 顾荣 任务：留言面板 2017.12.20
    // 添加a链接弹出框
    $("body").on("click", ".LeaveMsg", function () {
        /**
       * taskId=494;顾荣
       * 原因：在ios浏览器上弹出软键盘留言板布局会乱
       * 修改：删除原本的layer弹出框
       */
        $("#leaveMsgBox").css("display", "block");
        FAQ.writeMsg()
    })
    /**
     * 关闭模态框按钮
    */
    function closeModal () {
        var This = this
        //地图
        // This.options.closeLocation.on('click', function () {
        //     This.options.sendLocation.hide()
        // })
        //常见问题
        $('.commonQueModal .closePage').on('click', function () {
           $('.commonQueModal').hide()
        })
        //意见反馈
        $('.feedbackModal .closePage').on('click', function () {
            $('.feedbackModal').hide()
        })
    }

    closeModal () 

    //faqrobot
    var FAQ = new Faqrobot({
            isSelfSetInputTop:true,
            preventAdjust:true,
            setInputTop: true,
            interface: 'servlet/appChat',
            logoUrl: 'robot/skin/wxChat_deppon/images/logo@2x.png', //logo地址 ----------
            //sysNum: 1000000,//客户唯一标识
            //jid: 0,//自定义客服客户图标
            //robotName: 'FaqRobot',//机器人名称
            logoId: 'logo',// ----------
            webNameId: 'MN_logoWord',//公司名称Id
            intelTitleChange: true,// 智能聊天是否修改标题
            intelTitle: '',// 智能聊天时的标题
            artiTitleChange: true,// 人工时是否修改标题
            artiTitle: '人工客服',// 人工时的标题
            titleInsteadId: 'title',// 代替标题Id
            kfPic: 'robot/skin/wxChat_deppon/images/robot.png', //客服图标
            kf_Robot_Pic: 'robot/skin/wxChat_deppon/images/robot.png', //机器人客服图标
            kf_Person_Pic: 'robot/skin/wxChat_deppon/images/robot.png', //人工客服图标
            kf_Robot_Name: '', //机器人客服名字，此处只是声明个变量，不用赋值
            kf_Person_Name: '', //人工客服名字
            khPic: 'robot/skin/wxChat_deppon/images/user.png', //客户图标  
            formatDate: '%month%月%date%日 %hour%:%minute%:%second%',//配置时间格式(默认10:42:52 2016-06-24)
            topQueId: 'commonQueLayer',//热门、常见问题Id --------
            frontId:'front', // frontId获取页面高度用来设定input的定位
            editCtn: 'editCtn',// 为设定输入框定位
            chatCtnId: 'chatCtn',//聊天展示Id y   --------------
            inputCtnId: 'textarea',//输入框Id y   --------
            sendBtnId: 'sendBtn',//发送按钮Id y   ------
            shakeScreenModal:'shakeScreenModal',//抖屏模态框
            thirdUrlId: 'orderBox',
            showMyOrder:'showMyOrder',//展示下单页面
            preventHide: false,// true:机器人聊天时 仍然显示发送文件、图片功能,地理位置
            upFileModule: {//上传文件模块
                open: true,//是否启用功能
                maxNum: 0,//最大上传数量，0为不限制
                triggerId: 'sendPic',//触发上传按钮
                startcall: function () {//上传文件前的回调
                    set_chatScroll_height();
                },
                callback: function () {//上传文件后的回调
                    var timerDowm=setTimeout(function(){
                        FAQ.scrollbar.update()
                        FAQ.scrollbar.scrollTo('bottom', true);
                        clearTimeout(timerDowm)
                    },2000)
                },
            },
            upFileModuleCam: {//上传文件模块
                open: true,//是否启用功能
                maxNum: 0,//最大上传数量，0为不限制
                triggerId: 'sendCamera',//触发上传按钮
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
            initCallback: function (data) {//初始化基本信息的回调
                window.uselessReasonItems = data.uselessReasonItems;
            },
            sendCallback: function () {//点击发送按钮的回调
                clearAU();
                $('.addBtn').removeClass('hide');
                $('#sendFace').removeClass('hide');

                $('.keyboardCtn').addClass('hide');
                $('#sendBtn').addClass('hide');

                !FAQ.robot._html && $('.textarea').focus(); // 防止键盘拉起
                setTimeout(function () {
                    $('.textarea').focus();
                }, 50);
            },
            commentCallback: function () {//评论后的回调
                $('.feedbackModal .closePage').trigger('click')
            },
            leaveMsgCallback: function () {//留言后的回调
                layer.close(layerCtn);
            },
            thirdUrlCallBack: function(data, index){//推荐链接的回调
                if (!index) index = 0;
                if (data.robotAnswer[index].thirdUrl && data.robotAnswer[index].thirdUrl.url) {
                    $('#'+FAQ.options.thirdUrlId).show()
                    $('#' + FAQ.options.showMyOrder).html('<iframe width="100%" style="border:none;" height="100%" src="'+data.robotAnswer[index].thirdUrl.url+'"></iframe>');
                    $('#' + FAQ.options.showMyOrder +' iframe').height($('#'+FAQ.options.thirdUrlId).height()-45)
                }
            },
            // 设置输入框top值的高度：解决键盘遮挡输入框bug
            setInputTop: function () {
                // 判断是否为ios
                var u = navigator.userAgent, app = navigator.appVersion;
                var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                var str = navigator.userAgent.toLowerCase();
                var ver = str.match(/cpu iphone os (.*?) like mac os/);
                if (ver) {
                    var version1 = ver[1].split('_')[0];
                    var version2 = ver[1].split('_')[1];
                }
                if (isiOS) {
                    if (version1 == '11' && version2 >0 && version2 < 3) {
                        var phoneWidth = $(window).width();
                        var phoneHeight = $(window).height();
                        if (phoneWidth == 375) {
                            if (phoneHeight >= 635) {// iphone X
                                var chatStyle = '.front .chatHeight{height:' + parseInt($(document).height() - 450) + 'px !important}';
                            } else { 
                                var chatStyle = '.front .chatHeight{height:' + parseInt($(document).height() - 390) + 'px !important}';
                            }
                        } else if (phoneWidth == 414) {// iphone plus
                             // 区分微信与safari 浏览器
                            var ua = navigator.userAgent.toLowerCase();
                            if(ua.indexOf('micromessenger')!=-1){
                                var chatStyle = '.front .chatHeight{height:' + parseInt($(document).height() -470) + 'px !important}';
                            }else{
                                var chatStyle = '.front .chatHeight{height:' + parseInt($(document).height() -450) + 'px !important}';
                            }

                        }
                        $('head').append('<style>' + chatStyle + '</style>');

                        $('#' + this.inputCtnId).on('focus', function () {
                            $('.chatScroll').addClass('chatHeight');
                            $('.front').height(($('.chatScroll').height()+120));
                            var timerDowm=setTimeout(function(){
                                FAQ.scrollbar.update()
                                FAQ.scrollbar.scrollTo('bottom')
                                clearTimeout(timerDowm)
                            },200);
                        });
                        $('.' + this.inputCtnId).on('blur', function (e) {
                            $('.chatScroll').removeClass('chatHeight');
                            $('.front').height($(document).height());
                            if(isTouchMove){
                                isTouchMove = false;
                                return ;
                            }else{
                                var timerDowm=setTimeout(function(){
                                    FAQ.scrollbar.update()
                                    FAQ.scrollbar.scrollTo('bottom', true);
                                    clearTimeout(timerDowm)
                                },200)
                            }
                        });
                    }
                }
            }
    });
    
   
    /***
     * 自动滚动到底部，不能去除，防止键盘遮挡
     * */ 
    $('.textarea').on('focus', function (e) {
        var j = 0;
        clearInterval(timerDown);
        timerDown = setInterval(function () {
            $('body').scrollTop(1000000);
            FAQ.scrollbar.scrollTo('bottom', true);
            if (j >= 5) {
                clearInterval(timerDown);
            }
            j++;
        }, 100);
    });

    $('.textarea').click(function () {
        $('.textarea').focus();
    })


    // 人工评价
    $('body').on('click', '.RG_commentBtn', function () {
        window.uuid = $(this).attr('uuid');// 客服要求客户评价
        $('.feedback').trigger('click');
    });

    /**
     * 抖屏
    */
    $('#sendShakeScreen').on('click',function(){
        FAQ.sendShakeScreen()
        setTimeout(function(){
            $('.shakeScreenCtn').removeClass('clicked')
            $('#shakeScreenModal').hide()
        },2000)
    })

    /**
     * 结束人工
     */
    $('#sendEndCustom').on('click',function(){
        FAQ.sendEndCustom()
    })
    
    /**
     * 关闭下单模态框
     * */
    $('#closeOrderBox').on('click',function(){
        $('#orderBox').hide()
    })
    
    /**
     * 语音功能
    */
    $('.voiceBtn').on('click',function(){
        if($('.textareaCtn').hasClass('hide')){
            $(this).find('i').attr('class','iconfont icon-yuyin');
            $('.textareaCtn').removeClass('hide');
            $('#a').addClass('hide');
        }else{
            $(this).find('i').attr('class','iconfont icon-jianpan1');
            $('.textareaCtn').addClass('hide');
            $('#a').removeClass('hide'); 
        }
    })
    $('#a').on('touchstart',function(e){
        e.preventDefault();
        startRecord(e)
    })
        .on('touchend',function(e){
            e.preventDefault();
            stopRecord(e)
        })
        .on('touchmove',function(e){
            e.preventDefault();
            touchMove(e)
        })

    
    function ready(){
        wx.ready(function() {
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
            wx.startRecord({
                success: function() {
                    setTimeout(() => {
                        wx.stopRecord({
                            success: res => {},
                            fail: function(res) {}
                        });
                    }, 300);
                },
                cancel: () => {
                    alert("用户拒绝授权录音");
                }
            });
        });
    }

    function getWXdata(){
        $.ajax({
            url:'/weixin/getWeiXinSignature?appId=wxb625c16e447e061b&appSecret=da042fd1542773107e0743b7ae96f3a2&url='+encodeURIComponent(location.href.split('#')[0]),
            type:'post',
            success:function(data){
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.appId, // 必填，公众号的唯一标识
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.signature, // 必填，签名
                    jsApiList: [
                      "startRecord",
                      "stopRecord",
                      "onVoiceRecordEnd",
                      "playVoice",
                      "translateVoice"
                    ] // 必填，需要使用的JS接口列表
                });
                ready();
            }
        })
    }


   var  START = '',END = '',
        posStart = 0,posEnd = 0,
        posMov = 0,
        recordTimer = null ;

    /**
     * @function startRecord 开始录音
     * */ 
    function startRecord(event){
        START = new Date().getTime();
        posStart = event.originalEvent.targetTouches[0].pageY;
        recordTimer = setTimeout(() => {
            if($('.record-shade').hasClass('hide')){
                $('.record-shade,.icon-wrapper').removeClass('hide');
                $('.move-cancel').addClass('hide');
            }
        wx.startRecord({
            success: function() {},
            cancel: () => {
                $('.record-shade,.icon-wrapper').addClass('hide');
                alert("用户拒绝授权录音");
            }
        });
        }, 300);
    }

    /**
     * 停止录音
     */ 
    function stopRecord(event){
        END = new Date().getTime();
        posEnd = event.originalEvent.changedTouches[0].pageY;
        // 上划150像素，取消录音
        if (posStart - posEnd > 100) {
            $('.record-shade, .move-cancel').addClass('hide')
            wx.stopRecord();
            return;
        }

        if (END - START < 300) {
            initShow();
            // 点击提示“录音时间太短”
            $('.record-shade, .record-tip').removeClass('hide');
            setTimeout(() => {
                initShow();
            }, 1000);

            END = 0;
            START = 0;
            //小于300ms，不录音
            clearTimeout(recordTimer);
        } else {
            $('.record-shade, .icon-wrapper').addClass('hide')
            wx.stopRecord({
                success: res => {
                    $('.record-shade, .icon-wrapper').addClass('hide')
                    localId = res.localId;
                    translateVoice();
                },
                fail: function(res) {
                    // alert(JSON.stringify(res));
                }
            });
        }
    }

    function initShow(){
        $('.record-shade, .icon-wrapper, .move-cancel, .record-tip').addClass('hide')
    }
     // 播放语音
    function playVoice() {
        wx.playVoice({
            localId: localId, // 需要播放的音频的本地ID，由stopRecord接口获得
            success: function() {},
            fail: function(res) {
                alert(resizeTo);
            }
        });
    }
    // 语音转文字
    function translateVoice() {
        wx.translateVoice({
            localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: res => {
                FAQ.askQue(res.translateResult)// 语音识别的结果
            }
        });
    }
    // 上划动作
    function touchMove(event) {
        posMove = 0;
        posMove = event.originalEvent.targetTouches[0].pageY;
        if (posStart - posMove > 100) {
            $('.icon-wrapper').addClass('hide')
            $('.move-cancel').removeClass('hide')
        } else {
            $('.move-cancel').addClass('hide')
            $('.icon-wrapper').removeClass('hide')
        }
    }
    getWXdata()
}) 
