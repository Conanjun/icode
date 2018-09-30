//定义全局变量
var tmpTel = '',
    //手机号
    tmpName = '',
    //姓名
    tmpArea = '',
    //用户所属区域
    tmpDept = '',
    // 系统名称
    classify2 = '',
    // 总积分
    scoreSum = 0,
    //用户所属部门
    tmpUserId = '',
    //用户名
    fileNum = 0,
    //上传附件的个数
    attachment1 = '',
    attachment2 = '',
    attachment3 = '',
    //附件上传需要转换成64位
    curOrderNo = 0,
    curOrderAll = 0,//服务单页码
    curNoticeNo=0,
    curNoticeAll=0, //公告页码
    tmplink='../',//临时用于测试存放域名的地方，后期可删除

    codeTableArray = [],// 不满意原因数组
    // midea增加开始
    IEVersion = NaN // IE的版本号
    // midea增加结束

// midea增加：在转人工时候触发该方法
function mideacloudInit () {
    // 以下三个方法都为全局方法
    // 渠道连接初始化
    olcsGetInfo.init()
    // 发送消息初始化
    olcsSendHandle()
    // 表情设置
    qqEmoji(2)
}
// midea增加结束

(function() {
    getUserInfo();
    getUserName();

    // midea增加开始
    getIEVersion();
    // midea增加结束

    // midea增加开始
    // 获取IE的版本号，在minichat中也有相同的函数。这么写的原因是，否则ie8会报错
    function getIEVersion() {
        function IETester(userAgent) {
            var UA =  userAgent || navigator.userAgent
            var IENumber = NaN

            if (/msie/i.test(UA)) {
                IENumber = UA.match(/msie (\d+\.\d+)/i)[1]
            }
            if (~UA.toLowerCase().indexOf('trident') && ~UA.indexOf('rv')) {
                IENumber = UA.match(/rv:(\d+\.\d+)/)[1]
            }
            return IENumber
        }

        try {
            IEVersion = Number(IETester())
            console.log('IE的版本是：', IEVersion)
        } catch (err) {
            console.log(err)
        }
    }
    // midea增加结束

    function ChatModel() {
        this.init();
    }
    ChatModel.prototype = {
		newArray: [

        ],
        //初始化
        init: function() {
            var self = this;
            // midea增加开始
            var mideaType = 0;
            // midea增加结束
            // midea注释开始：替换表情，我们替换了机器人的云问表情
            //生成表情
            // var Face = $('#replyContent').face({
            //         src: 'src/yun/',//
            //         rowNum: 6,//
            //         ctnAttr: [0, 40, 70, 70],
            //         targetEl: $(".chatBodyCtn"),
            //         triggerEl: $("#faceBtn"),
            //         hideAdv: true,
            //         callback: function() {
            //             $('#itSend').trigger('click');
            //         }
            // });
            //聊天
            // midea注释结束

            // midea增加开始
            // 正式环境先不加入emoji表情
            // qqEmoji(1);
            sessionStorage.setItem('switchFlag', 'robot');
            // midea增加结束

            FAQ = new Faqrobot({
                logoUrl: './img/logo.png',
                //logo地址 ----------
                logoId: 'logo',
                intelTitleChange: true,
                // 智能聊天是否修改标题
                artiTitleChange: true,
                // 人工时是否修改标题
                artiTitle: '人工客服',
                // 人工时的标题
                robotInfo: 'robotInfo',
                kfPic: 'robot/skin/chat_midea/img/robot.png',
                //客服图标
                khPic: 'robot/skin/chat_midea/img/serv.png',
                //客户图标
                kfHtml:[
                    '<div class="MN_answer_welcome MN_answer"><div class="blocks"><div class="MN_kfName">%robotName%</div><div class="MN_kftime">%formatDate%</div></div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%helloWord%</div></div>',//欢迎语组合
                    '<div class="MN_helpful"><span class="MN_reasonSend">提交</span><span class="MN_yes">满意</span><span class="MN_no">不满意</span></div>',//是否满意组合
                    '<div class="MN_answer" aId="%aId%" cluid="%cluid%"><div class="blocks"><div class="MN_kfName">%robotName%</div><div class="MN_kftime">%formatDate%</div></div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%ansCon%%gusListHtml%%relateListHtml%<div style="margin-top:20px;margin-bottom:10px;"><a class="switchHuman" style="cursor:pointer">点击这里</a>转在线人工服务</div>%commentHtml%</div></div>'//回答组合
                ],// 机器人结构中增加转人工按钮
                formatDate: '%month%月%date%日 %hour%:%minute%:%second%',
                //配置时间格式(默认10:42:52 2016-06-24)
                topQueId: 'commonQue',
                //热门、常见问题Id --------
                quickServId: 'quickLink',
                //快捷服务Id
                thirdUrlId: 'thirdUrl',
                chatCtnId: 'chat-client',
                //聊天展示Id y   --------------
                inputCtnId: 'replyContent',
                //输入框Id y   --------
                sendBtnId: 'itSend',
                //发送按钮Id y   ------
                tipWordId: 'inputTip',
                commentFormId: 'feedBackForm',
                //评论框formId -------
                commentInputCtnId: 'feedBackInput',
                //评论输入框Id ----
                commentSendBtnId: 'feedBackBtn',
                //评论发送按钮Id ---------
                commentTipWordId: 'feedBackTip',
                //评论输入框提示语Id
                artiSearchId: 'artiSearch',
                //智能搜索
                artiSearchCallback: function(data) {
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
                leaveQue: { // 未知问题已回复
                    open: true
                    //是否启用功能
                },
                autoSkip: { //手机不能访问pc页面
                    open: true,
                    //是否启用功能
                    chatUrl: 'h5chat'
                    // 默认跳转的页面
                },
                clearBtnId: 'clearMsg',
                //清除按钮Id
                closeBtnId: 'close',

                // midea注释开始
                // faceModule: {//表情模块
                //     open: true,//是否启用功能
                //     faceObj: Face//表情插件实例
                // },
                // mdiea注释结束
                // midea修改开始
                faceModule: {//表情模块
                    open: false, //是否启用功能，原先为true
                    faceObj: '' //表情插件实例，原先为Face
                },
                // midea修改结束

                //关闭聊天页面
                poweredCtnId: 'power',
                //技术支持Id
                thirdUrlCallBack: function(data, index) {
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
                noticeCallback:function(data){
                    if(data.notice){
                            window.ChatModel.newArray = data.notice;
                            window.ChatModel.newList(1,data.notice);
                    }else{
                        window.ChatModel.newArray = [];
                    }
                },
                initFailCallback:function(data){
                    $('.authMsg').html(data.message);
                    $('.msg-modal').modal('show');
                }
            });
            //调用自动补全插件
            this.initAutocomplete();

            //转人工
            $("#chat").on("click", ".switchHuman",function() {
                // midea增加if判断条件
                if (IEVersion < 10) {
                    layer.msg('当前浏览器版本过低，建议下载更新版本的浏览器：Chrome31+，IE10+，Firefox34+')
                } else {
                    if (sessionStorage.getItem("switchFlag") === "human") {
                        return;
                    }
                    sessionStorage.setItem('switchHuman',1);
                    // midea增加开始：点击转人工的时候清除会话存储，不出现已连接某某某客服
                    if (sessionStorage.getItem('onlineCustomerService')) {
                        sessionStorage.removeItem('onlineCustomerService');
                    };
                    // midea增加结束

                    // midea注释开始
                    // self.emptychat();
                    // midea注释结束

                    // midea增加开始
                    $(".chat-operation").children().eq(0).removeClass('hide');
                    // midea增加结束

                    $(".chat-operation").children().eq(1).removeClass('hide');
                    $(".chat-operation").children().eq(2).removeClass('hide');

                    // midea增加开始：为了转人工服务的时候能显示出第四个工具栏图标
                    $(".chat-operation").children().eq(3).removeClass('hide');
                    // midea增加结束

                    $("#chatFile").removeClass('hide');
                    $(".outWork").removeClass('hide');
                    $(".hint").addClass('hide');
                    $('.input').unbind(); // 清除输入提示事件
                    FAQ.scrollbar.update();
                    FAQ.timerGo = false;
                    FAQ.offline();

                    // midea注释开始
                    // $("#itSend").unbind(); // 删除机器人绑定事件
                    // midea注释结束

                    $('#replyContent').unbind();

                    // midea增加开始
                    // 更新clickFlag的状态
                    olcsSession.clickFlag = false
                    sessionStorage.setItem('switchFlag','human')
                    // 需要把输入框改成div
                    $('#change_dom').html("<div id='replyContent' contenteditable='true' class='chatArea input'></div>")
                    if (mideaType === 0) {
                        // 第一次转人工的时候执行
                        mideacloudInit()
                    } else {
                        // 第二次转人工的时候执行。不能直接执行mdieacloudInit()
                        // 有个回车事件很奇怪，比如在激发机器人的回答建议框时回车，或者在不断退出进入人工的时候
                        // 渠道连接初始化
                        olcsGetInfo.init()
                        // 表情设置
                        qqEmoji(2)
                        // 回车键
                        $('#replyContent').bind('keydown', function (event) {
                            if (event.keyCode === 13) {
                                // console.log('#replyContent keypress robot')
                                event.preventDefault()
                                $('#itSend').click()
                            }
                        })
                    }
                    // 在人工环境下，不允许访客点击机器人环境的列表信息，防止在对话中出现问机器人的问题
                    $('.MN_gusList').bind('click', function () {
                        console.log('.MN_gusList在人工环境不允许点击')
                        return false
                    })
                    // midea增加结束

                    // midea注释开始
                    // $('#itSend').click(function() {
                    //     self.manualChatSend();
                    // });
                    // $('#replyContent').keyup(function(e) {
                    //     if (e.keyCode == 13) { //Enter键发送
                    //         self.manualChatSend();
                    //     }
                    // });
                    // midea注释结束
                }
            });


            // 转机器人
            $(".outWork").click(function() {
                // midea开始
                // 需要把输入框改成textarea
                $('#change_dom').html("<textarea id=\"replyContent\" contenteditable=\"true\" class=\"chatArea input\" placeholder=\"你可以尝试输入类似'美信登陆不成功'、'mip显示异常' 等问题。\"></textarea>")
                qqEmoji(1)
                // 给mideaType赋新的值
                mideaType = 1;
                // 断开后台和IM的连接
                // 若客服在线且客服没有结束会话时
				window.olcsAppraise.showAppraise()
                if (olcsSession.isExistProperty('onLineStatus') && olcsSession.obtainProperty('onLineStatus') === 1 && olcsSession.endByService === 0) {
                    olcsMessage.closeSocket();
                    olcsSession.openSocketStatus = 0;
                } else {
                    // 客服自己结束会话后自己退出人工，或者自己在没有接入IM的时候退出人工（比如客服不在线或者自己没有选择）
                    // olcsSession.endByService = 1 // 客服自己结束会话
                    if (sessionStorage.getItem('onlineCustomerService')) {
                        sessionStorage.removeItem('onlineCustomerService')
                    }
                    // 重置标志位
                    olcsSession.endByService = 0
                    olcsMessage.showTip('您已退出客服，谢谢使用')
                }
                sessionStorage.setItem('switchFlag','robot');
                // midea结束

                // midea注释开始
                // self.emptychat();
                // midea注释结束

                $("#itSend").unbind(); // 删除人工绑定事件
                $('#replyContent').unbind();
                self.initAutocomplete();

                // midea增加开始
                $(".chat-operation").children().eq(0).addClass('hide');
                // midea增加结束

                $(".chat-operation").children().eq(1).addClass('hide');
                $(".chat-operation").children().eq(2).addClass('hide');

                // midea增加开始
                $(".chat-operation").children().eq(3).addClass('hide');
                // midea增加结束

                $("#chatFile").addClass('hide');
                $(".outWork").addClass('hide');
                $(".hint").removeClass('hide');

                // midea增加开始
                $('.MN_gusList').unbind('click');
                // midea增加结束
				FAQ.init(true);
                FAQ.timerGo = true;
                FAQ.scrollbar.update();

                // midea增加开始
                // 及时清除排队的定时器
                if (olcsSession.connectTimeSetting) {
                    clearTimeout(olcsSession.connectTimeSetting)
                    console.log('前：点击时，清除排队定时器', olcsSession.connectTimeSetting)
                    olcsSession.connectTimeSetting = null
                    console.log('后：点击时，清除排队定时器', olcsSession.connectTimeSetting)
                }
                // 及时清除排队显示人数的定时器
                if (olcsSession.waitingTimer) {
                    clearInterval(olcsSession.waitingTimer)
                    console.log('前：点击时，清除排队显示人数定时器', olcsSession.waitingTimer)
                    olcsSession.waitingTimer = null
                    console.log('后：点击时，清除排队显示人数定时器', olcsSession.waitingTimer)
                }
                // 清掉排队的提示语
                // $('#waiting_tips1 #waiting_count').remove()
                // midea增加结束
            });
            //截屏
            this.captureObj = new NiuniuCaptureObject(); //生成实例
            this.captureObj.InitNiuniuCapture(); //初始化控件
            //截屏回调
            this.captureObj.FinishedCallback = function(type, x, y, width, height, info, content, localpath) { //截屏完毕
                if (type == 1) {
                    var format = localpath.substring(localpath.lastIndexOf('.') + 1, localpath.length);
                    var url = 'data:image/' + format + ';base64,'
                    var data = {
                        imgFlow: url + content
                    }
                    FAQ.manualChatSend(data);
                }
            }



            //截屏
            $('.screenBtn', '.chatCtn').unbind('click').bind('click', function() {
                var captureRet = self.captureObj.DoCapture("1.jpg", 0, 3, 0, 0, 0, 0);
                //console.log(captureRet)
                if (!captureRet) { //没有安装控件
                    self.ShowDownLoad();
                }
            });

            // 监听评价建议长度。
            this.listenTextareaLen($(".textareaLen"), $("#textareaVal"));
            this.listenTextareaLen($(".yawpTextareaLen"), $("#yawpTextarea"));


            // 默认满意
            $('#assessOrderForm input[name=survey]').val('satisfaction');

            // 点击满意不满意添加css
            $('#assessOrderForm .isSatisfaction-btn').eq(0).click(function() {
                if ($(this).hasClass('Satisfaction-color') &&
                 ( $('#assessOrderForm .yawp-btn').hasClass('yawpFaction-color')==true||
                   $('#assessOrderForm .unsolved-btn').hasClass('unsolved-color')==true
                 )
                ) {
                    $(this).removeClass('Satisfaction-color');
                    $('#assessOrderForm input[name=survey]').val('');
                    $('.goodDiv').addClass('hide');
                } else {
                    $(this).addClass('Satisfaction-color');
                    $('#assessOrderForm .isSatisfaction-btn').eq(1).removeClass('Satisfaction-color');
                    $('#assessOrderForm .unsolved-btn').removeClass('unsolved-color');
                    $('#assessOrderForm .yawp-btn').removeClass('yawpFaction-color');
                    $('#assessOrderForm input[name=survey]').val('satisfaction');
                    $('.goodDiv').removeClass('hide');
                    $('.badDiv').addClass('hide');
                }
            })
            $('#assessOrderForm .yawp-btn').click(function() {
                if ($(this).hasClass('yawpFaction-color')&&
                 ( $('#assessOrderForm .isSatisfaction-btn').eq(0).hasClass('Satisfaction-color')==true||
                   $('#assessOrderForm .unsolved-btn').hasClass('unsolved-color')==true
                 )
                ) {
                    $(this).removeClass('yawpFaction-color');
                    $('#assessOrderForm input[name=survey]').val('');
                    $('.badDiv').addClass('hide');
                } else {
                    $(this).addClass('yawpFaction-color');
                    // $('#assessOrderForm .isSatisfaction-btn').eq(0).removeClass('yawpFaction-color');
                    $('#assessOrderForm .isSatisfaction-btn').removeClass('Satisfaction-color');
                    $('#assessOrderForm .unsolved-btn').removeClass('unsolved-color');
                    $('#assessOrderForm input[name=survey]').val('dissatisfied');
                    $('.badDiv').removeClass('hide');
                    $('.goodDiv').addClass('hide');
                }
            })


            $('#assessOrderForm .unsolved-btn').click(function() {
                if ($(this).hasClass('unsolved-color')&&
                ( $('#assessOrderForm .isSatisfaction-btn').eq(0).hasClass('Satisfaction-color')==true||
                $('#assessOrderForm .yawp-btn').hasClass('yawpFaction-color')==true
                )) {
                    $(this).removeClass('unsolved-color');
                    $('#assessOrderForm input[name=survey]').val('');
                } else {
                    $(this).addClass('unsolved-color');
                    $('#assessOrderForm .isSatisfaction-btn').removeClass('Satisfaction-color');
                    $('#assessOrderForm input[name=survey]').val('unresolved');
                    $('#assessOrderForm .yawp-btn').removeClass('yawpFaction-color');
                    $('.badDiv').addClass('hide');
                    $('.goodDiv').addClass('hide');
                }
            })

            // 人工选择文件
            $(".chat-file").change(function() {
                var self = this;
                if (this.files.length === 0) {
                    return
                };
                var reader = new FileReader();
                reader.onload = function(e) {
                    var data, format = self.files[0].name;
                    if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(format)) {
                        data = {
                            imgFlow: e.target.result
                        }
                    } else {
                        data = {
                            fileFlow: e.target.result,
                            fileName: format
                        }
                    }
                    FAQ.manualChatSend(data);
                };
                reader.readAsDataURL(this.files[0]);
            });
        },

        //根据是否是Chrome新版本来控制下载不同的控件安装包
        ShowDownLoad: function() {
            if (this.captureObj.IsNeedCrx()) {
                this.ShowChromeInstallDownload();
            } else {
                this.ShowIntallDownload();
            }
        },
        ShowChromeInstallDownload: function() {
            var ret = confirm("您需要先下载Chrome扩展安装包进行安装，点击确定继续!");
            if (ret) {
                window.location.href = "http://www.ggniu.cn/download/CaptureInstallChrome.exe";
            }

        },
        ShowIntallDownload: function() {
            var ret = confirm("您需要先下载控件进行安装，点击确定继续!");
            if (ret) {
                window.location.href = "http://www.ggniu.cn/download/CaptureInstall.exe";
            }
        },


        // 监听数据字数长度
        listenTextareaLen: function(numberDom, inputVal) {
            inputVal.keyup(function() {
                var length = inputVal.val().length;
                //console.log(length);
                if (length > 500) {
                    var val = inputVal.val().slice(0, 500);
                    inputVal.val(val);
                }
                numberDom.html(length)
            });
        },


        // 人工-提交不满意意见
        submitYawp: function() {
            var text = $('#yawpTextarea').val();
           // console.log(text)
        },
        // 初始化input自动提示
        initAutocomplete: function() {
            $('.input').autocomplete({
                url: '../../servlet/AQ?s=ig',
                targetEl: $('.inputCtn'),
                //参照物(用于appendTo和定位)
                posAttr: ['-1px', '138px'],
                //外边框的定位[left bottom]
                itemNum: 10,
                //[int] 默认全部显示
                callback: function(data) { //获取文本后的回调函数
                    $('.sendBtn').trigger('click');
                }
            });
        },
        // 清空聊天
        emptychat: function() {
            $('#replyContent').val('');
            $("#chat-client").empty();
        },
        manualChatSend: function() {
            FAQ.manualChatSend();
        },
        newList:function (pageIndex,data) {
            if(data.length < 1){return};
            var newData = [];
            curNoticeAll = window.ChatModel.newArray.length;
            if(curNoticeAll>0){
                $('#noticeContent .serviceO-page').removeClass('hide');
            }
            data.forEach(function(item){
                item.time = dataTime(item.time);
                newData.push(item);
            });
            $('.noticeAll').html(window.ChatModel.newArray.length);
            curNoticeNo=pageIndex;
            $('#noticeContent .noticeIndex').html(pageIndex || 1 );
            if(newData.length < 1){
                // $('.noticeNext').css('color','#ccc');
                $('.noticeNext').removeClass('triggerBtn').addClass('notTriggerBtn');

                $('#noticeListCon').html('<div class="notice-Context">现在还没有公告哦，去和机器人聊会天吧～</div>');
            }else if(pageIndex < newData.length){
                // $('.noticeNext').css('color','#148DF5');
                $('.noticeNext').removeClass('notTriggerBtn').addClass('triggerBtn');

            }
            var pageIndex = pageIndex-1==-1 ? 0: pageIndex - 1;
            var list = newData.splice(pageIndex,1)[0];
            var html = '<div class="notice-Context">'+
                        '<div>《'+ list.title +'》</div>'+
                        '<div class="not-Con" + title="'+list.keyWords+'" >'+list.keyWords+' </div>'+
                        '<div class="not-foot">'+
                        "<div class='gray'><a class='gray' href='/robot/skin/midea/newsDetail.html?"+decodeURI(list.noticeNo)+"' target='_blank'>查看详情>></a></div>"+
                        '<div class="item state pull-right">'+list.time+'</div>'+
                        '</div></div>';
            $('#noticeListCon').html(html);
            getConHeight();
        }

    }
    window.ChatModel = new ChatModel();
	    // 刷新新闻列表
    // window.ChatModel.newList(0,window.ChatModel.newArray);
}())

// 获取年月日
function dataTime(data) {
    var date
    if(isNaN(new Date(data))) {
        date = NewDate(data);
    }else{
        date = new Date(data);
    }
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.date = date.getDate();
    var currentTime = this.year+'-'+this.month+'-'+this.date;
    return currentTime
}

function NewDate(ds) {
    ds = ds.replace(/-/g, '/');
    ds = ds.replace('T', ' ');
    ds = ds.replace(/(\+[0-9]{2})(\:)([0-9]{2}$)/, ' UTC\$1\$3');
    date = new Date(ds);
    return date
}
var isNormal = true;
var search = window.location.search.indexOf('false');
if(search > 0){
    isNormal = false;
    $('.headerMidea').addClass('hide');
    $("#chat").css({"top":"0px","left":"0%","min-height":"588px"});
    $('#chat').removeClass('col-xs-20');
    $('#chat').addClass('col-xs-24');
    // $(window).on('beforeunload', function() {
    //     if(confirm("确定关闭么？")){
    //         return true;
    //     }else{
    //         return false;
    //     }
    // })
    window.onbeforeunload=function(e){
        e=e||window.event;
        return '';
    }
}

//动态获取聊天区域的高度
function getBodyHeight() {
    var height = (window.innerHeight || document.documentElement.clientHeight) || document.body.clientHeight;
    if (height<=670) {
       // height=670;
    };
    return height;
}
function getConHeight(){
    var h=getBodyHeight();
    if(isNormal){
        $('#chat').css({'height':h-104});
        $('.scoll-reference').height($('#chat').outerHeight() - 225);
        $('.notice-Context').height(h-550);
        $('#accounting').height(h-219);
        $('.serviceO-Context').height(h-575);
    }else{
        $('#chat').css({'height':h});
        $('.scoll-reference').height($('#chat').outerHeight() - 235);
        $('.notice-Context').height(h-455);
        $('#accounting').height(h-125);
        $('.serviceO-Context').height(h-480);
    }
    FAQ.scrollbar.update();
}

setTimeout(function(){
    getConHeight();
},600);


$(window).on('resize', function() {
    getConHeight();
})

var isAdd = false;

var arId1 = '',
    arName1 = '',
    arId3 = '',
    arName3 = '',
    arId2 = '';

//进入页面获取用户信息
function getUserInfo() {
    // midea增加开始
    // 用户职位
    var tmpUserDuty = '',
    //用户所属区域
        tmpUserArea = '',
    //用户所属部门
        tmpUserDept = '',
    //备注
        tmpUserMemo = '';


    function storeProperty(key, value) {
        if (!sessionStorage.getItem('customerInfo')) {
          sessionStorage.setItem('customerInfo', '{}');
        };
        var obj = JSON.parse(sessionStorage.getItem('customerInfo'));
        obj[key] = value;
        sessionStorage.setItem('customerInfo', JSON.stringify(obj));
    };
    // midea增加结束

    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        url: encodeURI(''+tmplink+'/WorkOrderInfo/getUserInfo?loginName=wuzc5'),
        success: function(data) {
            // midea注释开始，替换成true，用于本地测试
            // !data.status
            // midea注释结束
            if (!data.status) {

                tmpTel = data.telphone;
                tmpName = data.username;
                // $('.headerOut .userName').html(tmpName);
                $('.headerOut .userLoginOut').removeClass('hide');
                tmpUserId = data.userId;
                tmpArea = data.area_tierId2;
                tmpDept = data.business_unitId;

                // midea增加开始
                tmpUserDuty = data.duty;
                tmpUserArea = data.area_tierName2;
                tmpUserDept = data.business_unit;
                tmpUserMemo = data.message;

                // 使用假数据
                // tmpUserId = 'liuxw1';
                // tmpUserId = 'wush12';
                // // tmpName = '刘嘻嘻';
                // tmpName = '吴世豪';
                // tmpTel = '18813211111';
                // // tmpUserDept = '采购部门';
                // tmpUserDept = '美的IT';
                // // tmpUserDuty = '程序员'
                // tmpUserDuty = '项目经理'
                // // tmpUserArea = '广州';
                // tmpUserArea = '广州';
                // tmpUserMemo = '测试成功';

                // midea按钮权限
                // 正式环境第一轮上线，部门为“中央研究院”的才可以看到转人工的按钮
                var devGroup = ['liujj10', 'guoxiao1', 'xujj18', 'lizm10', 'shizb1', 'wush12'];
                var existPerson = 0;
                // for (var i = 0; i < devGroup.length; i++) {
                //     // console.log('devGroup[i]:', devGroup[i]);
                //     if (devGroup[i] === tmpUserId) {
                //         existPerson = 1;
                //         break;
                //     }
                // }
                // console.log('existPerson: ', existPerson);
                // 到时候把true去掉就可以
                // if (true || tmpUserDept === '集团总部' || existPerson === 1) {
                //     $('.chat-hint').removeClass('chat-hint_hiden');
                // } else {
                //     $('.chat-hint').remove();
                // }

                // console.log('getUserInfo获取用户信息接口返回正常')
                // sessionStorage存储userId和用户详细信息
                // 访客Id
                storeProperty('userId', tmpUserId);
                // 现在先把访客Id固定写死
                // storeProperty('userId', 'wangwuwu1');
                // 姓名
                storeProperty('name', tmpName);
                // storeProperty('name', '王五六');
                // 电话
                storeProperty('phone', tmpTel);
                // storeProperty('phone', '12112386437');
                // 公司部门
                storeProperty('company', tmpUserDept);
                // storeProperty('company', '惠享云');
                // 职位
                storeProperty('position', tmpUserDuty);
                // storeProperty('position', '总监');
                // 地区
                storeProperty('address', tmpUserArea);
                // storeProperty('address', '佛山顺德北滘镇美的大道6号美的总部大楼B23');
                // 备注
                storeProperty('memo', tmpUserMemo);
                // storeProperty('memo', '使用接口登录的真实数据，调用成功');

                // 在ie的版本10以上才执行 或者 非ie
                if (!IEVersion || IEVersion > 9) {
                    getMideaCustomerId();
                }
                // midea增加结束

                $('[name=userId]').val(tmpUserId);
                // $('[name=username]').val(tmpName);
                // 1级区域
                arId1 =  data.area_tierId1,
                arName1 = data.area_tierName1,

                scoreSum = data.scoreSum;
                $('.scoreSum').html(scoreSum);

                // 2及区域
                arId2 = data.area_tierId2;

                classify2 = data.classify2;

                // 3及区域
                arId3 = data.area_tierId3,
                arName3 = data.area_tierName3,

                // getAllInfo('area', false);
                // getAllInfo('dept', false);
                // getSystemInif();
                getAllInfo('survey_type');
                getSystemInif();

                //自助保障填入联系方式
                $('#selfHelpForm input[name=telphone]').val(tmpTel);
                //获取评价时候的礼物
                if (data.gifts && data.gifts.length > 0) {
                    var giftData = [];
                    for (var i in data.gifts) {
                        if (data.gifts[i].count > 0) {
                            giftData.push('<li class="present" giftId="' + data.gifts[i].id + '">');
                        } else {
                            if(data.scoreSum < data.gifts[i].SURPLUS_GIFT){
                              giftData.push('<li class="present giftgray">');
                            }else{
                              giftData.push('<li class="present">');
                            }
                        }
                        if (data.gifts[i].name == '矿泉水') {
                            giftData.push('<img  title="矿泉水" src="/robot/skin/midea/img/water.jpg">');
                            giftData.push('<div class="present-text"><p>'+ data.gifts[i].SURPLUS_GIFT +'</p></div>');

                        } else if (data.gifts[i].name == '巧克力') {
                            giftData.push('<img  title="巧克力" src="/robot/skin/midea/img/chocolate.jpg">');
                            giftData.push('<div class="present-text"><p>'+ data.gifts[i].SURPLUS_GIFT +'</p></div>');

                        } else if (data.gifts[i].name == '鲜花') {
                            giftData.push('<img title="鲜花" src="/robot/skin/midea/img/flower.jpg">');
                            giftData.push('<div class="present-text"><p>'+ data.gifts[i].SURPLUS_GIFT +'</p></div>');

                        } else if (data.gifts[i].name == '香槟') {
                            giftData.push('<img title="香槟" src="/robot/skin/midea/img/champagne.jpg">');
                            giftData.push('<div class="present-text"><p>'+ data.gifts[i].SURPLUS_GIFT +'</p></div>');
                        }
                        giftData.push('<span class="present-box">');
                        giftData.push('<span class="present-check"></span>');
                        giftData.push('<i class="fa fa-check-circle-o present-ico" aria-hidden="true"></i></span></li>');
                    }
                    $('#giftUl').html(giftData.join(''));
                }
                $('[data-toggle="tooltip"]').tooltip();
                //获取服务单列表
                orderList(curOrderNo);
            }
        },
        error: function() {
            tipMsg('请求失败');
            return;
        }
    });

    // var giftData = [];
    // giftData.push('<li class="present giftgray">');
    // giftData.push('<img  title="矿泉水" src="/robot/skin/midea/img/water.jpg">');
    // giftData.push('<div class="present-text"><p>20</p></div>');
    // giftData.push('<span class="present-box">');
    // giftData.push('<span class="present-check"></span>');
    // giftData.push('<i class="fa fa-check-circle-o present-ico" aria-hidden="true"></i></span></li>');

    // giftData.push('<li class="present">');
    // giftData.push('<img   title="巧克力" src="/robot/skin/midea/img/chocolate.jpg">');
    // giftData.push('<div class="present-text"><p>20</p></div>');
    // giftData.push('<span class="present-box">');
    // giftData.push('<span class="present-check"></span>');
    // giftData.push('<i class="fa fa-check-circle-o present-ico" aria-hidden="true"></i></span></li>');

    // giftData.push('<li class="present">');
    // giftData.push('<img  title="鲜花"src="/robot/skin/midea/img/flower.jpg">');
    // giftData.push('<div class="present-text"><p>20</p></div>');
    // giftData.push('<span class="present-box">');
    // giftData.push('<span class="present-check"></span>');
    // giftData.push('<i class="fa fa-check-circle-o present-ico" aria-hidden="true"></i></span></li>');

    // $('.scoreSum').html(20)
    // $('#giftUl').html(giftData.join(''));

}

// midea开始
// 访客登录机器人页面获取customerId
function getMideaCustomerId() {
    // 从机器人接口获取用户信息后再执行改方法
    if(olcsSession.isExistStorage('userId')) {
        var mideaCustomerId = olcsGetInfo.getCustomerInfo();
        if (mideaCustomerId) {
            // 访客登录机器人页面获取customerId
            mideaCustomerId = mideaCustomerId;
            console.log('登录机器人页，根据特征值获取访客id');
        } else {
            // 由访客信息创建customerId
            mideaCustomerId = olcsGetInfo.createCustomer();
            console.log('登录机器人页，由访客信息创建访客id');
        }
        sessionStorage.setItem('mideaCustomerId', mideaCustomerId);
        return mideaCustomerId;
    }
}
// midea结束

/**
 * 获取用户名
*/
function getUserName() {
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        url: encodeURI(''+tmplink+'/WorkOrderInfo/getUserInfoBy4A'),
        success: function(data) {
            if (!data.status) {
                tmpName = data.username;
                $('.headerOut .userName').html(tmpName);
                $('[name=username]').val(tmpName);
            }
        },
        error: function() {
            tipMsg('请求失败');
            return;
        }
    });
}


function getSystemInif() {
    $.when( getAllInfo('area', false), getAllInfo('dept', false)).done(function (argument1,argument2) {
        tmpArea = $(".areaSelect option:selected").val();
        tmpDept = $(".deptSelect option:selected").val();
        getAllInfo('belong_system', true);
    });
}



//获取系统名称，区域，部门
function getAllInfo(param, isAll) {
    var tParam = 'type=' + param;
    if (isAll) {
        $('#selfHelpForm .deptSelect').find("option[value]")
        tParam = tParam + '&paramOne=' + tmpDept + '&paramTwo=' + tmpArea;
    };
    return $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        url: encodeURI(''+tmplink+'/WorkOrderInfo/codeTable'),
        data: tParam,
        success: function(data) {
            if (!data.status) {
                if (data.list && data.list.length > 0) {
                    var tmpData = [];
                    //如果当前是不满意的原因
                    if (param == 'survey_type') {
                        codeTableArray = data.list;
                        var spanData = [];
                        for (var i in data.list) {
                            if(data.list[i].code && data.list[i].name){
                                if(i==0){
                                    spanData.push('<span class="label label-default label-select" id="' + data.list[i].code + '">' + data.list[i].name + '</span>');
                                }else{
                                    spanData.push('<span class="label label-default" id="' + data.list[i].code + '">' + data.list[i].name + '</span>');
                                }
                            }
                        }
                        $('#showReason').html(spanData.join(''));
                    } else {
                        for (var i in data.list) {
                            if(data.list[i].name && data.list[i].code) {
                                tmpData.push('<option value="' + data.list[i].code + '">' + data.list[i].name + '</option>');
                            }
                        }
                        //如果当前是所属区域
                        if (param == 'area') {
                            $('#selfHelpForm .areaSelect').html(tmpData.join(''));
                            //根据用户带过来的信息自动定位到该信息
                            if (tmpArea) {
                                $('#selfHelpForm .areaSelect').find("option[value='" + tmpArea + "']").attr("selected", true);
                            }else{
                                $('#selfHelpForm .areaSelect').find("option:first").attr("selected", true);
                            };
                        }
                        //如果当前是所属部门
                        if (param == 'dept') {
                            $('#selfHelpForm .deptSelect').html(tmpData.join(''));
                            //根据用户带过来的信息自动定位到该信息
                            if (tmpDept) {
                                $('#selfHelpForm .deptSelect').find("option[value='" + tmpDept + "']").attr("selected", true);
                            }else{
                                $('#selfHelpForm .deptSelect').find("option:first").attr("selected", true);
                            };
                        }

                        //如果当前是系统
                        if (param == 'belong_system') {
                            $('#selfHelpForm .sysSelect').html(tmpData.join(''));

                            if(tmpArea && tmpDept && tmpArea !='' && tmpDept!='' && classify2 && classify2!=''){
                              $('#selfHelpForm .sysSelect').find("option[value='" + classify2 + "']").attr("selected", true);
                            }
                        }
                    }
                }

            }
        },
        error: function() {
            tipMsg('请求失败');
            return;
        }
    });
}
//点击右上角退出按钮
$('.userLoginOut').click(function(){
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false, //不从缓存中去数据
        url: encodeURI('/WorkOrderInfo/loginOut'),
        success: function (data) {
            if (data.status === 0) {
				if(typeof(data.logoutUrl)=='undefined'){	
					window.location.href = "http://oamuat.midea.com.cn/sso-service/CleanupCookie2?app=http://10.16.86.219:12580/robot/midea.html?sysNum=1476067342641247";
				}else{
					window.location.href = data.logoutUrl;
				}
            }
        }
    })
})
//部门和区域的select只要其中一个元素值变动，系统名称也要相应变动
$('#selfHelpForm').on('change', '.deptSelect,.areaSelect', function() {
    if ($(this).is('.deptSelect')) {
        tmpDept = $(this).children('option:selected').val();
    }
    if ($(this).is('.areaSelect')) {
        tmpArea = $(this).children('option:selected').val();
    }
    getAllInfo('belong_system', true);
})

 //获取上传附件的类型
function getFileType(name) {
    var fileName=name,extStart=fileName.lastIndexOf("."),fileFlag=false;
    fileName=fileName.substring(extStart+1, fileName.length).toUpperCase();
    if(
        fileName=='XLSX' || fileName=='XLS' ||
        fileName=='PPTX' || fileName=='PPT' ||
        fileName=='PDF' || fileName=='DOC' ||
        fileName=='DOCX' || fileName=='MSG' ||
        fileName=='CSV' || fileName=='TXT' ||
        fileName=='JPG' || fileName=='PNG' ||
        fileName=='BPM' || fileName=='GIF' ||
        fileName=='RAR' || fileName=='ZIP'
    ){
        fileFlag=true;
    }else{
        fileFlag=false;
    }
    return fileFlag;
}
 //自助保障中的附件可上传3个，解决方法是：每个附件都对应一个obj，删除后清空对应obj中的数据
$('#fileOne').on('change', '#fileupOne', function() {
    var fileName='';
    if (!this.files) {
        var tmpValue = this.value;
        tmpValue = tmpValue.split('\\');
        fileName = tmpValue[tmpValue.length - 1];
        attachment1=this;
    } else {
        fileName = this.files[0].name;
        attachment1=this.files[0];
    }
    if(!getFileType(fileName)){
        tipMsg('请上传以下格式的文件：office、txt、bmp、jpg、gif、rar、zip');
        attachment1='';
        $('#fileupOne').replaceWith('<input type="file" id="fileupOne"  name="attachment1"/>');
        return;
    };

    if(!fileChange(this)){
        tipMsg('文件不得超过5M！');
        attachment1='';
        $('#fileupOne').replaceWith('<input type="file" id="fileupOne"  name="attachment1"/>');
        return;
    }


    var obj = $(this).parent().parent();
   //展示附件的名称
    $('#hasUp').append('<p class="relative">' + fileName + '&nbsp;&nbsp;<span class="flowIco-remove delFile" aria-hidden="true" style="color: #f00;" param="fileOne"></span></p>');
    //判断当前已经上传了几个附件了
    if ($('#hasUp p').length > 2) {
        obj.addClass('hide');
    } else {
        obj.addClass('hide').next().removeClass('hide');
    }
    // $('#fileupOne').replaceWith('<input type="file" id="fileupOne"  name="attachment1"/>');
});

// var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
function fileChange(target) {
    var fileSize = 0;
    if (!target.files) {
    //   var filePath = target.value;
    //   var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
    //   var file = fileSystem.GetFile(filePath);
    //   fileSize = file.Size;
        return true
    } else {
     fileSize = target.files[0].size;
    }
     var size = fileSize / 1024;
     if(size>5000){
      return false;
     }
     return true;
}

var isIE = isIEFN();
function isIEFN() {
    if(!!window.ActiveXObject || "ActiveXObject" in window)
      return true
      else
      return false
}

// $('#accounting').mLoading();


$('#fileTwo').on('change', '#fileupTwo', function() {
    var fileName='';
    if (!this.files) {
        var tmpValue = this.value;
        tmpValue = tmpValue.split('\\');
        fileName = tmpValue[tmpValue.length - 1];
        attachment2=this;
    } else {
        fileName = this.files[0].name;
        attachment2=this.files[0];
    }
    if(!getFileType(fileName)){
        tipMsg('请上传以下格式的文件：office、txt、bmp、jpg、gif、rar、zip');
        attachment2='';
        $('#fileupTwo').replaceWith('<input type="file" id="fileupTwo" name="attachment2" />');
        return;
    };
    if(!fileChange(this)){
        tipMsg('文件不得超过5M！');
        attachment2='';
        $('#fileupTwo').replaceWith('<input type="file" id="fileupTwo" name="attachment2" />');
        return;
    }
    var obj = $(this).parent().parent();
    $('#hasUp').append('<p class="relative">' + fileName + '&nbsp;&nbsp;<span class="flowIco-remove delFile" aria-hidden="true" style="color: #f00;" param="fileTwo"></span></p>');
    if ($('#hasUp p').length > 2) {
        obj.addClass('hide');
    } else {
        obj.addClass('hide').next().removeClass('hide');
    }
});
$('#fileThree').on('change', '#fileupThree', function() {
    var fileName='';
    if (!this.files) {
        var tmpValue = this.value;
        tmpValue = tmpValue.split('\\');
        fileName = tmpValue[tmpValue.length - 1];
        attachment3=this;
    } else {
        fileName = this.files[0].name;
        attachment3=this.files[0];
    }
    if(!getFileType(fileName)){
        tipMsg('请上传以下格式的文件：office、txt、bmp、jpg、gif、rar、zip');
        attachment3='';
        $('#fileupThree').replaceWith('<input type="file" id="fileupThree" name="attachment3" />');
        return;
    };
    if(!fileChange(this)){
        tipMsg('文件不得超过5M！');
        attachment3='';
        $('#fileupThree').replaceWith('<input type="file" id="fileupThree" name="attachment3" />');
        return;
    }
    var obj = $(this).parent().parent();
    $('#hasUp').append('<p class="relative">' + fileName + '&nbsp;&nbsp;<span class="flowIco-remove delFile" aria-hidden="true" style="color: #f00;" param="fileThree"></span></p>');
    if ($('#hasUp p').length > 2) {
        obj.addClass('hide');
    } else {
        obj.addClass('hide').next().removeClass('hide');
    }
});
//删除附件后
$('#hasUp').on('click', '.delFile', function() {
    $(this).parent().remove();
    var tmpParam = $(this).attr('param');
    $('#' + tmpParam).removeClass('hide').siblings('.divFile').addClass('hide');
    if (tmpParam == 'fileThree') {
        attachment3 = '';
    } else if (tmpParam == 'fileTwo') {
        attachment2 = '';
    } else if (tmpParam == 'fileOne') {
        attachment1 = '';
    }
})
var flagTrue=false;

var handlerFlag = 0;

function setOnloadCallBask(obj, event, handler) {
//for most explores
    if (null != obj && null != obj.addEventListener) {
        obj.addEventListener(event, handler, false);
    }
    //for IE
    if (null != obj && null != obj.attachEvent) {
        obj.attachEvent('onload', handler);
    }
    //not support
    // else {
    //     //选择dom元素错误
    //     throw new Error('不支持该dom元素');
    // }
}
/*
*call back.
*/
function ActionHandler()  {
    // alert('111')
    //文档加载或刷新时也会调用，因此需要通过标志位控制，提交时将标志位置为1，在这里处理之后修改标志位为0
    if(0 != handlerFlag)  {
        // alert('ggg')
        //do action
        var value = document.getElementById("formIframe").contentWindow.document.body.innerHTML;
        if(null!=value){
        var obj = eval("("+value+")");
        if(obj.status==0){
        // top.document.location.href="resource.shtml";
            //表单提交完成后清空
            flagTrue = false;
            $('#fileupOne').replaceWith('<input type="file" id="fileupOne" name="attachment1" />');
            $('#fileupTwo').replaceWith('<input type="file" id="fileupTwo"  name="attachment2"/>');
            $('#fileupThree').replaceWith('<input type="file" id="fileupThree"  name="attachment3"/>');
            attachment3 = '';
            attachment2 = '';
            attachment1 = '';
            $('#hasUp').html('');
            $('#fileOne').removeClass('hide').siblings('.divFile').addClass('hide');
            $('#description').val('');
            //刷新工单列表
            orderList();
            $("#accounting").mLoading('hide');
            tipMsg('您的报障已经提交成功，我们会尽快处理。');
            $('#subUpdate').removeClass('disabled');
        }else{
            flagTrue = false;
            $('#subUpdate').removeClass('disabled');
            tipMsg('请求失败');
            $("#accounting").mLoading('hide');
            return;
        }
        // else {
        //     window.parent.doNotice(obj.message);
        // }
    }
    //update flag.
        handlerFlag = 0;
    }
}

//提交自助保障信息
// function selfHelp(form) {
function selfHelp() {
    handlerFlag = 1;
    if(flagTrue){
        return;
    }
    flagTrue=true;
    $('#subUpdate').addClass('disabled');
    if($('#selfHelpForm input[name=telphone]').val()==''){
        $('#subUpdate').removeClass('disabled');
        tipMsg('请输入联系方式');
        flagTrue=false;
        return;
    }
    if($('#selfHelpForm textarea[name=description]').val()==''){
        $('#subUpdate').removeClass('disabled');
        tipMsg('请输入问题描述');
        flagTrue=false;
        return;
    }

    // 防止xss
    var telphoneXss = $xss($('#selfHelpForm input[name=telphone]').val(),'html');
    var descriptionXss = $xss($('#description').val(),'html');
    $('#selfHelpForm input[name=telphone]').val(telphoneXss);
    $('#description').val(descriptionXss);

    // 如果修改过2级区域就传入用户信息带过来的1、3级区域id和name
    if(arId2 == $('#selfHelpForm .areaSelect').val()){
      $('.arId1').val(arId1);
      $('.arName1').val(arName1);
      $('.arId3').val(arId3);
      $('.arName3').val(arName3);
    }else{
        $('.arId1').val('');
        $('.arName1').val('');
        $('.arId3').val('');
        $('.arName3').val('');
    }

    $('.bName').val($('#selfHelpForm .deptSelect  option:selected').text());
    $('.arName2').val($('#selfHelpForm .areaSelect  option:selected').text());


    if(flagTrue){
        $('#selfHelpForm').submit();
        $("#accounting").mLoading({
            text:"提交中"
        });
        // if(isIE){
        //     setTimeout(function(){
        //     //表单提交完成后清空
        //     $('#fileupOne').replaceWith('<input type="file" id="fileupOne" name="attachment1" />');
        //     $('#fileupTwo').replaceWith('<input type="file" id="fileupTwo"  name="attachment2"/>');
        //     $('#fileupThree').replaceWith('<input type="file" id="fileupThree"  name="attachment3"/>');
        //     attachment3 = '';
        //     attachment2 = '';
        //     attachment1 = '';
        //     $('#hasUp').html('');
        //     $('#fileOne').removeClass('hide').siblings('.divFile').addClass('hide');
        //     $('#description').val('');
        //     //刷新工单列表
        //     orderList();
        //     $("#accounting").mLoading('hide');
        //     tipMsg('您的报障已经提交成功，我们会尽快处理。');
        //     $('#subUpdate').removeClass('disabled');
        //     },5000);
        // }else{
        //     //注意这里最好在文档加载完成的时候再获取元素，否则可能获取到的一直是null
        //     setOnloadCallBask(document.getElementById("formIframe"),'load',ActionHandler);
        // }
        setOnloadCallBask(document.getElementById("formIframe"),'load',ActionHandler);
    }








    /**
     * Amend by zhaoyuxing 兼容ie9
     * 说明：不使用插件实现
     */

    // var formData = new FormData(form);
    // var formData = new FormData();
    // formData.append('attachment1',attachment1);
    // formData.append('attachment2',attachment2);
    // formData.append('attachment3',attachment3);

    // formData.append('bName',$('#selfHelpForm .deptSelect  option:selected').text());
    // formData.append('arName2',$('#selfHelpForm .areaSelect  option:selected').text());


    // 如果修改过2级区域就传入用户信息带过来的1、3级区域id和name
    // if(arId2 == $('#selfHelpForm .areaSelect').val()){
    //   formData.append('arId1',arId1);
    //   formData.append('arName1',arName1);
    //   formData.append('arId3',arId3);
    //   formData.append('arName3',arName3);
    // }
    // var formData=[];
    // formData.dept_tier=$('[name=dept_tier]').val();
    // formData.telphone=$('[name=dept_tier]').val();
    // formData.dept_tier=$('[name=dept_tier]').val();
    // formData.dept_tier=$('[name=dept_tier]').val();

    // $.ajax({
    //     type: 'post',
    //     datatype: 'json',
    //     cache: false,
    //     url: encodeURI(''+tmplink+'/WorkOrderInfo/ticketAdd?userId=' + tmpUserId + '&username=' + tmpName),
    //     data:formData,
    //     processData: false,
    //     contentType: false,
    //     success: function(data) {
    //         flagTrue=false;
    //         if (!data.status) {
    //             //表单提交完成后清空
    //             $('#fileupOne').replaceWith('<input type="file" id="fileupOne"  />');
    //             $('#fileupTwo').replaceWith('<input type="file" id="fileupTwo"  />');
    //             $('#fileupThree').replaceWith('<input type="file" id="fileupThree"  />');
    //             attachment3 = '';
    //             attachment2 = '';
    //             attachment1 = '';
    //             $('#hasUp').html('');
    //             $('#fileOne').removeClass('hide').siblings('.divFile').addClass('hide');
    //             $('#description').val('');
    //             // $('#selfHelpForm')[0].reset();
    //             // $('#selfHelpForm input[name=telphone]').val(tmpTel);
    //             //刷新工单列表
    //             orderList();
    //             $("#accounting").mLoading('hide');

    //             tipMsg('您的报障已经提交成功，我们会尽快处理。');
    //             $('#subUpdate').removeClass('disabled');
    //         } else {
    //             $('#subUpdate').removeClass('disabled');
    //             tipMsg(data.message);
    //             $("#accounting").mLoading('hide');
    //         }
    //     },
    //     error: function() {
    //         $('#subUpdate').removeClass('disabled');
    //         tipMsg('请求失败');
    //         $("#accounting").mLoading('hide');
    //         return;
    //     }
    // });
}

// var iframe = document.getElementById("formIframe");
// iframe.onload = iframe.onreadystatechange = function(){
//    if (iframe.attachEvent){
//     iframe.attachEvent("onload", function(){
//         alert("Local iframe is now loaded.");
//         ActionHandler();
//     });
//     } else {
//         iframe.addEventListener("load", function(){
//             alert("Local iframe is now loaded.");
//             ActionHandler();
//         });
//     }
// }

var orderPromise;
//获取工单列表
function orderList(pageNum, pageSize) {
    if (!pageNum) pageNum = 1;
    if (!pageSize) pageSize = 2;
    orderPromise = $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        url: encodeURI(''+tmplink+'/WorkOrderInfo/ticketList'),
        data: 'role=0&type=all&pageNum=' + pageNum + '&pageSize=' + pageSize + '&asc=false',
        success: function(data) {
            if (!data.status) {
                //展示分页，如果当前没数据就不展示分页
                if(data.totle>0){
                    $('#orderSerivcePage .serviceO-page').removeClass('hide');
                }
                if (data.list && data.list.length > 0) {
                    //展示服务单当前页数
                    curOrderNo=pageNum;
                    $('#orderSerivcePage .pageIndex').html(pageNum);
                    curOrderAll = Math.ceil(data.totle / 2);
                    if(curOrderNo == curOrderAll){
                        $('.servicePageNext').removeClass('triggerBtn').addClass('notTriggerBtn');

                    }else{
                        $('.servicePageNext').removeClass('notTriggerBtn').addClass('triggerBtn');

                    }
                    if(curOrderNo == 1){
                        $('.servicePagePre').removeClass('triggerBtn').addClass('notTriggerBtn');
                    }else if(curOrderNo > 1){
                        $('.servicePagePre').removeClass('notTriggerBtn').addClass('triggerBtn');
                    }
                    $('#orderSerivcePage .pageAll').html(curOrderAll);
                    var orderHtml = [];
                    for (var i in data.list) {
                        if(data.list[i].ticketId &&  data.list[i].description){
                            orderHtml.push('<div class="serviceO-Context radius">');
                            orderHtml.push('<div class="serviceOC-titl">');
                            orderHtml.push('<div>单号:<b class="pointer" data-toggle="modal" data-target="#chatModal" id="' + data.list[i].ticketId + '" onclick="showOrderDetail(this)">' + data.list[i].ticketId + '</b></div>');
                            //服务单当前状态
                            //当前状态status＝60，并且surveystatus＝0是已关闭
                            if (orderStatus(data.list[i].status)=='解决' && data.list[i].surveyStatus == 0) {
                                orderHtml.push('<div class="pull-right state">已关闭</div>');
                            }else{
                                orderHtml.push('<div class="pull-right state">' + orderStatus(data.list[i].status) + '</div>');
                            }

                            orderHtml.push('</div>');
                            orderHtml.push('<div class="serviceOC-context">' + data.list[i].description + '</div>');
                            orderHtml.push('<div class="serviceOC-foot"><div class="item state">' + data.list[i].create_time + '</div>');

                            //当前状态status＝60，并且surveystatus＝0是已关闭
                            if (orderStatus(data.list[i].status)=='解决') {
                                if (data.list[i].surveyStatus == 1) {
                                    //当前服务单可评价
                                    orderHtml.push('<div class="pull-right gray" data-toggle="modal" data-target="#evaluateModal" ticketId="' + data.list[i].ticketId + '" onclick="assessgetInfo(this)">评价</div>');
                                };
                            } else {
                                orderHtml.push('<div class="pull-right gray expediteOrder"><span class="expediteOrderSpan">催单</span>');
                                orderHtml.push('<div class="expediteModel radius hide">');
                                orderHtml.push('<div class="triangle_border_up"><span></span></div>');
                                orderHtml.push('<div class="expedite-content">');
                                orderHtml.push('该工单已被催单<span class="red">' + data.list[i].reminderCount + '</span>次，请确认是否要催单?</div>');
                                orderHtml.push('<div class="expedite-foot">');
                                orderHtml.push('<a href＝"javascript:;" class="btn btn-default pull-right expedite-close">暂不需要</a><a href="#;" role="button" class="btn btn-primary pull-right evaluate-color evaluateOrderFn" id="' + data.list[i].ticketId + '" num="' + data.list[i].reminderCount + '" style="margin-right:20px;">我要催单</a>');
                                orderHtml.push('</div></div></div>');
                            }
                            orderHtml.push('</div></div>');
                        }
                    }
                    $('#orderSerivceTemplate').html(orderHtml.join(''));
                } else {
                    //服务单为空情况下的处理
                    //展示分页，如果当前没数据就不展示分页
                    $('#orderSerivcePage .serviceO-page').addClass('hide');
                    $('#orderSerivcePage .pageIndex').html(0);
                    $('#orderSerivcePage .pageAll').html(0);
                    $('#orderSerivceTemplate').html('<div class="serviceO-Context style="max-height: 133px;" radius"><div class="serviceOC-titl"><div style="text-align:center">现在还没有服务单哦～</div></div></div>');
                }
            } else {
                tipMsg(data.message);
            }
        },
        error: function() {
            tipMsg('请求失败');
            return;
        }
    });
}
//服务单点击上一页
$('.servicePagePre').click(function() {
    // $('.servicePageNext').css('color','#148DF5');
    $('.servicePageNext').addClass('triggerBtn');

    //如果当前没有服务单
    if(curOrderAll==0 ||  curOrderNo==1){
        return;
    }
    if (curOrderNo > 1) {
        curOrderNo--;
        // $(this).css('color','#148DF5');
        $(this).removeClass('notTriggerBtn').addClass('triggerBtn');

    } else {
        curOrderNo = 1;
        // $(this).css('color','#ccc');
        $(this).removeClass('triggerBtn').addClass('notTriggerBtn');

    }
    $('#orderSerivcePage .pageIndex').html(curOrderNo);
    orderList(curOrderNo);
})
$('.servicePageNext').click(function() {
    // $('.servicePagePre').css('color','#148DF5');
    $('.servicePagePre').addClass('triggerBtn');

    //如果当前没有服务单
    if(curOrderAll==0 || curOrderNo == curOrderAll){
        return;
    }
    if (curOrderNo < curOrderAll) {
        curOrderNo++;
        // $(this).css('color','#148DF5');
        $(this).removeClass('notTriggerBtn').addClass('triggerBtn');

    } else {
        curOrderNo = curOrderAll;
        // $(this).css('color','#ccc');
        $(this).removeClass('triggerBtn').addClass('notTriggerBtn');

    }
    $('#orderSerivcePage .pageIndex').html(curOrderNo);
    orderList(curOrderNo);
})

//单号状态

function orderStatus(status) {
    var curStatus = '';
    if (typeof status == "number") {
        status += '';
    }
    switch (status) {
    case '10':
        curStatus = '创建'
        break;
    case '20':
        curStatus = '分派'
        break;
    case '30':
        curStatus = '处理中'
        break;
    case '40':
        curStatus = '处理中'
        break;
    case '50':
        curStatus = '处理中'
        break;
    case '60':
        curStatus = '解决'
        break;
    default:
        curStatus = '未知'
        break;
    }
    return curStatus;
}
//查看服务单详情

function showOrderDetail(obj) {
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        url: encodeURI(''+tmplink+'/WorkOrderInfo/ticketDetail'),
        data: 'ticketId=' + $(obj).attr('id'),
        success: function(data) {
            if (!data.status) {
                if (data.list && data.list.length > 0) {
                    var orderDetail = [];
                    for (var i in data.list) {
                        var nowStatus = orderStatus(data.list[i].status);
                        orderDetail.push('<form class="form-horizontal">');
                        orderDetail.push('<div class="form-group serve">');
                        orderDetail.push('<label  class="col-xs-4 col-sm-6 col-md-6 col-lg-4 control-label">服务详情</label></div>');
                        orderDetail.push('<div class="form-group" style="margin-bottom:55px;"><label  class="not-Weight col-xs-4 col-sm-6 col-md-6 col-lg-4 control-label colorA4"></label><div class="col-sm-16 col-md-16  col-xs-16">');
                        orderDetail.push('<div class="serveProcess">');
                        //创建状态
                        if (nowStatus == '创建') {
                            orderDetail.push('<div class="process-round roundPass-color"><div class="process-text"><span class="flowIco-ok"></span></div><span class="process-time">创建<br>' + (data.list[i].create_time ? data.list[i].create_time : '') + '</span></div>');
                            orderDetail.push('<div class="crosswise"></div><div class="process-round"><div class="process-text"><span class="flowIco-inbox"></span></div><span class="process-time">分派</span></div>');
                            orderDetail.push('<div class="crosswise"></div><div class="process-round"><div class="process-text"><span class="flowIco-refresh"></span></span></div><span class="process-time">处理中</span></div>');
                            orderDetail.push('<div class="crosswise"></div><div class="process-round"><div class="process-text"><span class="flowIco-record"></span></div><span class="process-time">关闭</span></div>');

                        } else if (nowStatus == '分派') {
                            orderDetail.push('<div class="process-round roundPass-color-ing"><div class="process-text"><span class="flowIco-ok"></span></div><span class="process-time">新建<br>' + (data.list[i].create_time ? data.list[i].create_time : '') + '</span></div>');
                            orderDetail.push('<div class="crosswise roundPass-color"></div><div class="process-round roundPass-color"><div class="process-text"><span class="flowIco-inbox"></span></div><span class="process-time">分派</span></div>');
                            orderDetail.push('<div class="crosswise"></div><div class="process-round"><div class="process-text"><span class="flowIco-refresh"></span></span></div><span class="process-time">处理中</span></div>');
                            orderDetail.push('<div class="crosswise"></div><div class="process-round"><div class="process-text"><span class="flowIco-record"></span></div><span class="process-time">关闭</span></div>');
                        } else if (nowStatus == '处理中') {
                            orderDetail.push('<div class="process-round roundPass-color-ing"><div class="process-text"><span class="flowIco-ok"></span></div><span class="process-time">新建<br>' + (data.list[i].create_time ? data.list[i].create_time : '') + '</span></div>');
                            orderDetail.push('<div class="crosswise roundPass-color-ing"></div><div class="process-round roundPass-color-ing"><div class="process-text"><span class="flowIco-inbox"></span></div><span class="process-time">已分派<br>' + (data.list[i].acceptTime ? data.list[i].acceptTime : '') + '</span></div>');
                            orderDetail.push('<div class="crosswise roundPass-color"></div><div class="process-round roundPass-color"><div class="process-text"><span class="flowIco-refresh"></span></span></div><span class="process-time">处理中</span></div>');
                            orderDetail.push('<div class="crosswise"></div><div class="process-round"><div class="process-text"><span class="flowIco-record"></span></div><span class="process-time">关闭</span></div>');
                        }else{
                            orderDetail.push('<div class="process-round roundPass-color-ing"><div class="process-text"><span class="flowIco-ok"></span></div><span class="process-time">新建<br>' + (data.list[i].create_time ? data.list[i].create_time : '') + '</span></div>');
                            orderDetail.push('<div class="crosswise roundPass-color-ing"></div><div class="process-round roundPass-color-ing"><div class="process-text"><span class="flowIco-inbox"></span></div><span class="process-time">已分派<br>' + (data.list[i].acceptTime ? data.list[i].acceptTime : '') + '</span></div>');
                            orderDetail.push('<div class="crosswise processPass-color-ing"></div><div class="process-round roundPass-color-ing"><div class="process-text"><span class="flowIco-refresh"></span></span></div><span class="process-time">已处理<br>' + (data.list[i].close_time ? data.list[i].close_time : '') + '</span></div>');
                            orderDetail.push('<div class="crosswise processPass-color-ing"></div><div class="process-round roundPass-color-ing"><div class="process-text"><span class="flowIco-record"></span></div><span class="process-time">关闭</span></div>');
                        }

                        orderDetail.push('</div></div></div>');

                        //单号
                        orderDetail.push('<div class="form-group"><label  class="not-Weight col-xs-4 col-sm-6 col-md-6 col-lg-4 control-label colorA4">单号:</label><div class="col-sm-8 col-md-8  col-xs-8"><label class="control-label not-Weight">' + data.list[i].ticketId + '</label>');
                        if(orderStatus(data.list[i].status)=='解决' && data.list[i].surveyStatus == 0){
                            //关闭状态
                            orderDetail.push('<span href="javascript:;" class="evaluate-btn">已关闭</span>');
                        }else{
                            orderDetail.push('<span href="javascript:;" class="evaluate-btn">' + nowStatus + '</span>');
                        }

                        orderDetail.push('</div></div>');
                        //系统名称
                        if(data.list[i].chr_category){
                            orderDetail.push('<div class="form-group"><label class="not-Weight col-xs-4 col-sm-6 col-md-6 col-lg-4 control-label colorA4">系统名称:</label><div class="col-lg-16 col-md-16 col-xs-16"><label class="control-label not-Weight">' + data.list[i].chr_category + '</label> </div></div>');
                        }
                        //问题描述
                        orderDetail.push('<div class="form-group"><label class="not-Weight col-xs-4 col-sm-6 col-md-6 col-lg-4 control-label colorA4">问题描述:</label><div class="col-lg-16 col-md-16 col-xs-16" style="margin-top:7px;"><p style="word-wrap: break-word;">' + data.list[i].description + '</p></div></div>');
                        if (data.list[i].requestAttach && data.list[i].requestAttach.length > 0) {
                             //附件附件
                            orderDetail.push('<div class="form-group"><label class="not-Weight col-xs-4 col-sm-6 col-md-6 col-lg-4 control-label colorA4">附件:</label><div class="col-lg-16 col-md-16 col-xs-16">');
                            console.log('附件' + data.list[i].requestAttach)
                            var tmpAttach = data.list[i].requestAttach,
                                attachData = [];
                            for (var n in tmpAttach) {
                                attachData.push('<div class="file-img">');
                                attachData.push('<a href="http://itsm.midea.com:8888/SN_InterFace_Midea/attach?type=requestAttach&id=' + tmpAttach[n].id + '&category=com.task.midea_cn" class="filePath" target="_blank"><span>' + tmpAttach[n].name + '</span></a>');
                                attachData.push('</div></br>');
                            }
                            orderDetail.push(attachData.join(''));
                        }
                        orderDetail.push('</div></div>');
                        //催单次数
                        orderDetail.push('<div class="form-group"><label class="not-Weight col-xs-4 col-sm-6 col-md-6 col-lg-4 control-label colorA4">催单次数:</label><div class="col-lg-16 col-md-16 col-xs-16"><label class="control-label not-Weight urgeOrderNum" style="display: inline-block;float: left;">' + data.list[i].reminder_count + '次</label>');

                        if(orderStatus(data.list[i].status)=='解决' && data.list[i].surveyStatus == 0){

                        }else{
                            if(data.list[i].surveyStatus == 1){}else{
                                // orderDetail.push('<div class="gray expediteOrder" style="margin-left:30px;"><a href="javascript:;" class="btn btn-default evaluate-color expediteOrderSpan">我要催单</a>');
                                orderDetail.push('<div class="gray expediteOrder" style="margin-left:30px;"><span class="expediteOrderSpan" style="padding-top: 6px;display: inline-block;">我要催单</span>');
                                orderDetail.push('<div class="expediteModel radius hide">');
                                orderDetail.push('<div class="triangle_border_up"><span></span></div>');
                                orderDetail.push('<div class="expedite-content">');
                                orderDetail.push('该工单已被催单<span class="red">' + data.list[i].reminder_count + '</span>次，请确认是否要催单?</div>');
                                orderDetail.push('<div class="expedite-foot">');
                                orderDetail.push('<a href＝"javascript:;" class="btn btn-default pull-right expedite-close">暂不需要</a><a href="javascript:;" class="btn btn-primary pull-right evaluate-color evaluateOrderFn" id="' + data.list[i].ticketId + '" num="' + data.list[i].reminder_count + '" detail="1" style="margin-right:20px;">我要催单</a>');
                                orderDetail.push('</div></div></div>');
                            }
                        }
                        orderDetail.push('</div></div>');
                       //展示工程师名字
                        if(data.list[i].is_show_engineer==1 && data.list[i].engineerName){//展示工程师名称
                            if(orderStatus(data.list[i].status)!='解决'){
                                orderDetail.push('<div class="form-group"><label class="not-Weight col-xs-4 col-sm-6 col-md-6 col-lg-4 control-label colorA4">工程师:</label><div class="col-lg-16 col-md-16 col-xs-16"><label class="control-label not-Weight" style="display: inline-block;float: left;">'+(data.list[i].engineerName?data.list[i].engineerName:'')+'<img src="/robot/skin/midea/img/logo1.png" style="width:18px; margin-left:8px;" id="'+data.list[i].engineerId+'" class="meixin" /></label></div></div>');
                            }
                        }
                        //处理人，解决方案
                        //评价展示
                        if (data.list[i].surveyStatus == 1) {
                            //
                            orderDetail.push('<div class="form-group"><div class="page-header col-lg-offset-2 col-lg-20"></div></div>');
                            if(orderStatus(data.list[i].status)!='解决'){
                                orderDetail.push('<div class="form-group"><label class="not-Weight col-xs-4 col-sm-6 col-md-6 col-lg-4 control-label colorA4">处理人:</label><div class="col-lg-16 col-md-16 col-xs-16"><label class="control-label not-Weight">' + data.list[i].engineerName + '</label> </div></div>');
                            }

                            orderDetail.push('<div class="form-group"><label class="not-Weight col-xs-4 col-sm-6 col-md-6 col-lg-4 control-label colorA4">解决方案:</label><div class="col-lg-16 col-md-16 col-xs-16"><label class="control-label not-Weight">' + (data.list[i].resolveDes ? data.list[i].resolveDes : '') + '</label></div></div>');
                            if (data.list[i].resolveAttach && data.list[i].resolveAttach.length > 0) {
                                //附件附件
                               orderDetail.push('<div class="form-group"><label class="not-Weight col-xs-4 col-sm-6 col-md-6 col-lg-4 control-label colorA4">解决方案附件:</label><div class="col-lg-16 col-md-16 col-xs-16">');
                               console.log('附件' + data.list[i].resolveAttach)
                               var tmpAttach = data.list[i].resolveAttach,
                                   attachData = [];
                               for (var n in tmpAttach) {
                                   attachData.push('<div class="file-img">');
                                   attachData.push('<a href="http://itsm.midea.com:8888/SN_InterFace_Midea/attach?type=resolveAttach&id=' + tmpAttach[n].id + '&category=com.task.midea_cn" class="filePath" target="_blank"><span>' + tmpAttach[n].name + '</span></a>');
                                   attachData.push('</div></br>');
                               }
                               orderDetail.push(attachData.join(''));
                           }
                           orderDetail.push('</div></div>');
                            orderDetail.push('<div class="form-group"><div class="col-sm-offset-19 col-lg-10 Process-foot"><button type="button" class="btn btn-default evaluate-color" data-toggle="modal" data-target="#evaluateModal" ticketId="' + $(obj).attr('id') + '" onclick="assessgetInfo(this)">评价</button> <button data-dismiss="modal" aria-label="Close" aria-hidden="true"  type="botton" class="btn btn-default">返回</button></div></div>');



                        } else {
                            if(data.list[i].survey!='3' && data.list[i].survey!='1'){
                                orderDetail.push('<div class="form-group"><div class="col-sm-offset-19 col-lg-10 Process-foot"><button data-dismiss="modal" aria-label="Close" aria-hidden="true"  type="botton" class="btn btn-default">返回</button></div></div>');
                            }
                        }

                        // jieje
                        if(data.list[i].survey=='3' || data.list[i].survey=='1'){
                            var survey = '<span style="color:#87d074;">满意</span>';
                            if(data.list[i].survey=='3'){
                                survey = '<span style="color:red;">不满意</span>';
                            }

                            //关闭状态
                            orderDetail.push(
                            '<div class="form-group">'+
                                '<label class="not-Weight col-xs-4 col-sm-6 col-md-6 col-lg-4 control-label colorA4">解决方案:</label>'+
                                '<div class="col-lg-16 col-md-16 col-xs-16">'+
                                    '<label class="control-label not-Weight urgeOrderNum" style="display: inline-block;float: left;">'+
                                        data.list[i].resolveDes+
                                    '</label>'+
                                '</div>'+
                            '</div>')

                            if (data.list[i].resolveAttach && data.list[i].resolveAttach.length > 0) {
                                    //附件附件
                                orderDetail.push('<div class="form-group"><label class="not-Weight col-xs-4 col-sm-6 col-md-6 col-lg-4 control-label colorA4">解决方案附件:</label><div class="col-lg-16 col-md-16 col-xs-16">');
                                var tmpAttach = data.list[i].resolveAttach,
                                    attachData = [];
                                for (var n in tmpAttach) {
                                    attachData.push('<div class="file-img">');
                                    attachData.push('<a href="http://itsm.midea.com:8888/SN_InterFace_Midea/attach?type=resolveAttach&id=' + tmpAttach[n].id + '&category=com.task.midea_cn" class="filePath" target="_blank"><span>' + tmpAttach[n].name + '</span></a>');
                                    attachData.push('</div></br>');
                                }
                                orderDetail.push(attachData.join(''));
                            }
                            orderDetail.push('</div></div>');

                            orderDetail.push(
                            '<div class="form-group">'+
                                '<label class="not-Weight col-xs-4 col-sm-6 col-md-6 col-lg-4 control-label colorA4">评价内容:</label>'+
                                '<div class="col-lg-16 col-md-16 col-xs-16">'+
                                    '<label class="control-label not-Weight urgeOrderNum" style="display: inline-block;float: left;">'+
                                    survey+
                                    '</label>'+
                                '</div>'+
                           '</div>')





                           if(data.list[i].survey=='3'){
                                if(data.list[i].unsatisfactory_cause && data.list[i].unsatisfactory_cause != ''){
                                    var text = '';
                                    codeTableArray.forEach(function(item){
                                        if(data.list[i].unsatisfactory_cause == item.code){
                                            text = item.name;
                                        }
                                    });
                                    orderDetail.push(
                                        '<div class="form-group">'+
                                            '<label class="not-Weight col-xs-4 col-sm-6 col-md-6 col-lg-4 control-label colorA4">不满意原因:</label>'+
                                            '<div class="col-lg-16 col-md-16 col-xs-16">'+
                                                '<label class="control-label not-Weight urgeOrderNum" style="display: inline-block;float: left; color:red">'+
                                                text+
                                                '</label>'+
                                            '</div>'+
                                    '</div>')
                                }
                           }

                           orderDetail.push('<div class="form-group"><div class="col-sm-offset-19 col-lg-10 Process-foot"><button data-dismiss="modal" aria-label="Close" aria-hidden="true"  type="botton" class="btn btn-default">返回</button></div></div>');
                        }


                        orderDetail.push('</form>');
                    }
                    $('#chat-modal').html(orderDetail.join(''));
                };
            } else {
                tipMsg(data.message);
            }
        },
        error: function() {
            tipMsg('请求失败');
            return;
        }
    });
}
// 服务单详情点击美信发起客户端
$('#chat-modal').on('click','.meixin',function(){
    location.href='meicloud://Message/?uid='+$(this).attr('id');
})
//评价框弹出后加载当前服务单的相关信息
function assessgetInfo(obj) {
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        url: encodeURI(''+tmplink+'/WorkOrderInfo/ticketDetail'),
        data: 'ticketId=' + $(obj).attr('ticketId'),
        success: function(data) {
            if (!data.status) {
                //展示工程师及工程师ID,单号
                if (data.list && data.list.length > 0) {
                    // $('#evaluateDetail').html('<label class="control-label not-Weight jobId" jobid="4"><b>' + data.list[0].engineerName + '</b></label><label class="control-label not-Weight">工号' + data.list[0].engineerId + '</label>');
                    $('#evaluateDetail').html('<label class="control-label not-Weight jobId" jobid="4"><b>' + data.list[0].engineerName + '</b></label>');

                    $('#danhao').html(data.list[0].ticketId);
                }
            } else {
                tipMsg(data.message);
            }
        },
        error: function() {
            tipMsg('请求失败');
            return;
        }
    });
    //获取服务单Id
    $('#assessOrderForm input[name=ticketId]').val($(obj).attr('ticketId'));
    getAllInfo('survey_type');
}
//点击勾选礼物，只能单选
$('#giftUl').on('click', '.present', function() {
    if (!$(this).hasClass('giftgray')) {
        if($(this).children('.present-box').hasClass('show')){
            //取消选中
            $(this).children('.present-box').removeClass('show');
            //清空giftid
            $('#assessOrderForm input[name=gift_Id]').val('');
        }else{
            $(this).children('.present-box').addClass('show');
            $('#assessOrderForm input[name=gift_Id]').val($(this).attr('giftid'));
            $(this).siblings().children('.present-box').removeClass('show');
        }
    }
});
//选择不满意的原因
$('#showReason').on('click', 'span', function() {
    $(this).addClass('label-select').siblings().removeClass('label-select');
    $('#assessOrderForm input[name=surveyType]').val($(this).attr('id'));
});

//评价服务单
function assessOrder(obj) {
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        url: encodeURI(''+tmplink+'/WorkOrderInfo/ticketEvaluation'),
        data: $('#assessOrderForm').serialize(),
        success: function(data) {
            if (!data.status) {
                $('#assessOrderForm')[0].reset();
                $(obj).siblings().trigger('click');
                // orderList(curOrderNo);
                getUserInfo()//重新加载用户信息和服务单
                $('#evaluateModal').modal('hide');// 关闭评价modal
                $('#chatModal').modal('hide');// 关闭服务单详情modal
                tipMsg('感谢您的评价');
            } else {
                tipMsg(data.message);
                $(obj).siblings().trigger('click');
            }
        },
        error: function() {
            tipMsg('请求失败');
            return;
        }
    });
}


$(document).click(function(e){
    $('.expediteModel').addClass('hide');
});

// 显示催单modal
$('#orderSerivceTemplate,#chat-modal').on('click', '.expediteOrderSpan', function(e) {
    $(this).siblings('.expediteModel').removeClass('hide');
    e.stopPropagation();
});
// 关闭催单modal
$('#orderSerivceTemplate').on('click', '.expedite-close', function() {
    $(this).parents('.expediteModel').addClass('hide');
});

$('#chatTab').click(function() {
  getConHeight();
})

$('#serveTab').click(function(){
  getConHeight();
})

var danFlag=false;//立flag，防止瞬间重复提交表单
//点击催单  有两处催单，服务单列表和服务单详情中
$('#orderSerivceTemplate,#chat-modal').on('click', '.evaluateOrderFn', function() {
    if(danFlag){
        return;
    }
    danFlag=true;
    var obj = $(this);
    var tmpNum = obj.attr('num');
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        url: encodeURI(''+tmplink+'/WorkOrderInfo/ticketReminder'),
        data: 'sourse=MX&ticketId=' + obj.attr('id'),
        success: function(data) {
            danFlag=false;
            if (!data.status) {
                var tiem = null;
                // 服务单详情里面的点击催单之后自动加一
                if(obj.attr('detail')){
                    //服务单列表里面点击催单之后自动加1
                    obj.parents('.expediteOrder').siblings('label').html(((tmpNum) * 1 + 1)+'次');
                }else{
                    //服务单列表里面点击催单之后自动加1
                    obj.parent().siblings('.expedite-content').find('.red').html((tmpNum) * 1 + 1);
                }

                Promise.all([orderPromise])
                    .then(function (data) {
                        $(obj).addClass('disabled');
                        tiem = setTimeout(function() {
                            $(obj).removeClass('disabled');
                        }, 1000 * 10);
                    });

                obj.parents('.expediteModel').addClass('hide');
                tipMsg('催单成功');
            } else {
                tipMsg(data.message);
                obj.parents('.expediteModel').addClass('hide');
            }
        },
        error: function() {
            tipMsg('请求失败');
            return;
        }
    });
});

//公告点击上一页
$('.noticePre').click(function() {
    //如果当前没有公告
    if(curNoticeAll==0){
        return;
    }
    if (curNoticeNo > 1) {
        curNoticeNo--;
        if(curNoticeNo == 1){
            // $(this).css('color','#ccc');
            $(this).removeClass('triggerBtn').addClass('notTriggerBtn');
            $('.noticeNext').removeClass('notTriggerBtn').addClass('triggerBtn');
        }else{
            // $(this).css('color','#148DF5');
            $(this).removeClass('notTriggerBtn').addClass('triggerBtn');

        }
    } else {
        curNoticeNo = 1;
        // $(this).css('color','#ccc');
        $(this).removeClass('triggerBtn').addClass('notTriggerBtn');


        return;
    }


    window.ChatModel.newList(curNoticeNo,window.ChatModel.newArray);
    getConHeight()
})

$('.noticeNext').click(function() {
    if (curNoticeNo < curNoticeAll) {
        curNoticeNo++;
        if(curNoticeNo == curNoticeAll){
            // $(this).css('color','#ccc');
            $(this).removeClass('triggerBtn').addClass('notTriggerBtn');

        }else{
            // $(this).css('color','#148DF5');
            $(this).removeClass('notTriggerBtn').addClass('triggerBtn');

        }
    } else {
        curNoticeNo = curNoticeAll;
        // $(this).css('color','#ccc');
        $(this).removeClass('triggerBtn').addClass('notTriggerBtn');

        return;
    }
    if(curNoticeNo > 1 ){
        // $('.noticePre').css('color','#148DF5');
        $('.noticePre').removeClass('notTriggerBtn').addClass('triggerBtn');

    }
    window.ChatModel.newList(curNoticeNo,window.ChatModel.newArray);
    getConHeight()

})


// $('.serviceOrder').click(function() {
//   tipMsg('asdasdasdasd');
// })

$('#chatTab').click(function(){
  setTimeout(function(){
    getConHeight();
    FAQ.scrollbar.scrollTo('bottom')
  });
})
//提示信息框，IE8下面alert
function tipMsg(msg){
    if(typeof FAQ == 'undefined'){
        alert(msg);
    }else{
        FAQ.showMsg(msg);
    }
}
