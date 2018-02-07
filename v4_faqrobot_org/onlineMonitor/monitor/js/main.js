/* 1 */
;$(function() {
    var This = this,
        level = 1,//当前客户级别
        $curInput = null,//当前的输入框
        $curChat = null,//当前的聊天框
        $curMonitor = null,//当前的监控框
        uploader = null,//上传的实例
        uploader2 = null,//上传文件的实例
        loginUser = null,//客服基本信息
        webConfig = null,//站点基本信息
        isLogin = true,//是否登录
        isV3 = false,//true-v3、false-v35
        tipMsg = '',//解决未知接口
        groupId = '',//getQueList 传的参数
        chatRecord = {},//存放用户聊天记录
        monitorName = "";//接管状态下客服名称

    //获取sysNum
    var sysNum = This.location.search.match(/\?sysNum=(\d*)/);

    if(sysNum) {
        sysNum = sysNum[1];
    }

    //loading
    var loadingBox = new jBox('Tooltip', {
        width: '100%',
        height: '100%',
        content: $('.loading'),
        target: $('body'),
        addClass: 'loadingBox',
        overlay: true,
        position: {
            x: 'center',
            y: 'center',
        },
        animation: false,
    });

    loadingBox.open();

    //获取客服信息 -> url = '/user/getLoginUser'
    MN_Base.request({
        url: 'user/getLoginUser',
        params: {
            sysNum: sysNum,
        },
        callback: function(data) {
            if(data.status) {
                new jBox('Notice', {
                    content: data.message,
                    color: 'red',
                    autoClose: '3000',
                    onCloseComplete: function() {
                        document.location.href = '/login.html';
                    },
                });
            }else {//正常
                loginUser = data.loginUser;
                webConfig = data.webConfig;
                level = data.loginUser.Level;
                if(webConfig.AdminId) {
                    isV3 = false;//v35
                }
                runStep1();

                $('.webSite').attr('href', webConfig.WebSite || '');
                $('.leftHeadCtn .custName').html(MN_Base.addDots((webConfig.WebName || ''), 8));
                $('.leftHeadCtn .custQue').html(MN_Base.addDots(MN_Base.getPlainText(webConfig.Info || ''), 9));

                //提示放大
                new jBox('Mouse', {
                    maxWidth: '200px',
                    attach: $('.leftHeadCtn .itemCtn'),
                    content: (webConfig.Info || ''),
                    animation: false,
                });
            }
        },
    });


    //全局断点
    function runStep1() {

        //浏览器缩放
        $(window).on('resize', function() {
            setBodyPos();
            setRightBodyCtnHeight();
            setMidCtnWidth();
            setMidCtnPostion()
            setMidHeadRightCtnWidth();
            setMidBodyCtnHeight();
            setQueShowCtnHeight1();
            //setQueShowCtnHeight2();
            setMidBodyLeftCtnWidth();
            setMidBodyLeftCtnHeight();
            //setChatBodyLeftCtnWidth();
            //setChatBodyRightCtnHeight();
            setChatBodyLeftCtnHeight();
            //setChatAreaWidth();

            //在线用户滚动条更新
            $('.rightBodyCtn').mCustomScrollbar('update');
        });

        /******定位*******/
        setBodyPos();
        setRightBodyCtnHeight();
        setMidCtnWidth();
        setMidCtnPostion();
        setMidHeadRightCtnWidth();
        setMidBodyCtnHeight();
        setQueShowCtnHeight1();
        //setQueShowCtnHeight2();
        setMidBodyLeftCtnWidth();
        setMidBodyLeftCtnHeight();
        //setChatBodyLeftCtnWidth();
        //setChatBodyRightCtnHeight();
        setChatBodyLeftCtnHeight();
        //setChatAreaWidth();

        //自适应的方法
        function setBodyPos() {
            $('.body').css({'left': ($(window).width()-$('.body').width())/2, 'top': ($(window).height()-$('.body').height())/2});
        }
        function setRightBodyCtnHeight() {
            $('.rightBodyCtn').height($('.leftCtn').outerHeight() - $('.leftHeadCtn').outerHeight());
            //$('.rightBodyCtn').height($('.body').outerHeight() - $('.rightHeadCtn').outerHeight());
        }
        function setMidCtnWidth() {
            $('.midCtn').width($('.body').outerWidth() - ($('.leftCtn').outerWidth()));
        }
        function setMidCtnPostion() {
            $('.midCtn').css({'left': $('.leftCtn').outerWidth() + $('.leftCtn').offset().left});
        }
        function setMidHeadRightCtnWidth() {
            $('.midHeadRightCtn').width($('.midHeadCtn').outerWidth()/* - $('.midHeadLeftCtn').outerWidth() - 1*/);
        }
        function setMidBodyCtnHeight() {
            $('.midBodyCtn').height($('.body').outerHeight() - $('.midHeadCtn').outerHeight());
        }
        //get
        function getRestPartHeight() {
            return $('.midBodyRightCtn').outerHeight() - $('.knowHeadCtn').outerHeight(true) - parseInt($('.knowBodyCtn').css('margin-top'))*2 - parseInt($('.knowBodyCtn>.queShowCtn').css('padding-top'))*2;
        }
        function setQueShowCtnHeight1() {
            $('.knowBodyCtn>.queShowCtn').height(getRestPartHeight()/**.65*/);
        }
        function setQueShowCtnHeight2() {
            $('.knowFootCtn .queShowCtn').height(getRestPartHeight()*.35);
        }
        function setMidBodyLeftCtnWidth() {
            if(!parseInt($('.midBodyRightCtn').css('right'))) {
                $('.midBodyLeftCtn').width($('.midCtn').outerWidth() - $('.midBodyRightCtn').outerWidth());
            }
        }
        function setMidBodyLeftCtnHeight() {
            $('.midBodyLeftCtn').height($('.midBodyCtn').outerHeight());
        }

        function setChatBodyLeftCtnWidth() {
            $('.chatBodyLeftCtn', $curChat).width($('.midBodyLeftCtn').outerWidth() - $('.chatBodyRightCtn', $curChat).outerWidth() - 10);
        }
        function setChatBodyRightCtnHeight() {
            $('.chatBodyRightCtn', $curChat).height($('.body').outerHeight() - $('.midHeadCtn').outerHeight() - $('.chatHeadCtn', $curChat).outerHeight() - $('.chatFootCtn', $curChat).outerHeight());
        }
        function setChatBodyLeftCtnHeight() {
            $('.chatBodyLeftCtn', $curChat).height($('.body').outerHeight() - $('.midHeadCtn').outerHeight() - $('.chatHeadCtn', $curChat).outerHeight() - $('.chatFootCtn', $curChat).outerHeight());
        }
        function setChatAreaWidth() {
            $('.chatArea', $curChat).width($('.chatFootCtn', $curChat).outerWidth() - $('.sendBtn', $curChat).outerWidth() - parseInt($('.areaCtn', $curChat).css('paddingLeft'))*3 - parseInt($('.chatArea', $curChat).css('paddingLeft'))*2);
        }

        //新手引导
        //增加code
        MN_Base.request({
            url: 'tipHelp/check',
            params: {
                code: 'artiMonitorHelp',
            },
            callback: function(data) {
                loadingBox.close();
                $('.body').animate({'opacity': 1});
                $(window).trigger('resize');
                if(data.status) {//旧
                    runStep2();
                    $('.intro').hide();
                }else {//新
                    /*
                        taskid=713,黄世鹏
                        修改：教学演示错位
                        逻辑：定位到屏幕中央
                    */ 
                    $('.intro').show();
                    //1
                    $('.intro').append('<div class="tipStep1 tipStep" data-step="1" data-intro="现在跟我一起学习如何使用人工监控吧！"></div>');
                    //2
                    $('.intro').append('<div class="tipStep2 tipStep" data-step="2" data-intro="这里是当前在线的用户，您可以通过点击当前用户进行监控和查看用户信息"></div>');
                    //3
                    $('.intro').append('<div class="tipStep3 tipStep" data-step="3" data-intro="已被监控的用户可以对其进行停止监控，或者进行人工接管操作"></div>');
                    //4
                    $('.intro').append('<div class="tipStep4 tipStep" data-step="4" data-intro="管理员在此处可以标记用户的身份信息"></div>');
                    //5
                    $('.intro').append('<div class="tipStep5 tipStep" data-step="5" data-intro="被接管的用户进入被接管的分组"></div>');
                    //6
                    $('.intro').append('<div class="tipStep6 tipStep" data-step="6" data-intro="转人工后可查看用户转人工的原因，若发现恶意转人工，管理员可将当前用户加入黑名单"></div>');
                    //7
                    $('.intro').append('<div class="tipStep7 tipStep" data-step="7" data-intro="转人工后管理员可发送表情、截屏、上传文件等"></div>');
                    //8
                    $('.intro').append('<div class="tipStep8 tipStep" data-step="8" data-intro="客服可在机器人业务后台搜索知识回复用户"></div>');
                    //9
                    $('.intro').append('<div class="tipStep9 tipStep" data-step="9" data-intro="根据用户咨询的内容，机器人自动去业务后台匹配答案，辅助客服服务用户"></div>');
                    //10
                    $('.intro').append('<div class="tipStep10 tipStep" data-step="10" data-intro="设置客服回复频率较高的内容，提升工作效率"></div>');
                    //11
                    $('.intro').append('<div class="tipStep11 tipStep" data-step="11" data-intro="您已经完成新手引导的学习，开始体验吧！"></div>');

                    $('.tipStep').hide();
                    $('.tipStep1').show();

                    introJs().setOptions({
                        'prevLabel': '← 上一步',
                        'nextLabel': '下一步 →',
                        'skipLabel': '跳过',
                        'doneLabel': '完成',
                        'showBullets': false,//隐藏直接跳转按钮(避免onchangebug)
                        'showProgress': true,
                    }).start().onexit(function() {//非常规退出
                        $('.tipStep').remove();
                        $('.tipStep7Ctn').remove();
                        $('.intro').hide();
                        runStep2();
                    }).oncomplete(function() {//正常完成
                        $('.tipStep').remove();
                        $('.tipStep7Ctn').remove();
                        $('.intro').hide();
                        runStep2();
                    }).onchange(function(obj) {//已完成当前一步
                        var curNum = parseInt($(obj).attr('class').match(/\d+/)[0]);//当前的下标

                        $('.tipStep'+ (curNum-1)).hide();//隐藏前一个
                        $('.tipStep'+ (curNum+1)).hide();//隐藏后一个
                        $(obj).show();//显示当前
                    });
                    runStep2();
                }
            },
        });

        /*//删除code
        MN_Base.request({
            url: 'tipHelp/del',
            params: {
                code: 'artiMonitorHelp',
                webId: -1,
            },
            callback: function(data) {

            },
        });*/


        //全局断点
        function runStep2() {
            //截屏
            var captureObj = new NiuniuCaptureObject();//生成实例
            captureObj.InitNiuniuCapture();//初始化控件

            captureObj.FinishedCallback = function(type, x, y, width, height, info, content, localpath) {//截屏完毕
                if(type == 1) {
                    $.ajax({
                        url: '../../MaterialNoAuth/doSaveScreenPic',
                        data: {'picData': content},
                        type: 'post',
                        success: function(data) {
                            if(data.status) {
                                new jBox('Notice', {
                                    content: data.message,
                                    color: 'red',
                                    autoClose: '3000',
                                });
                            }else {
                                content = '<img class="imgBox" src="/'+ data.url +'">';

                                $('.chatTalkCtn', $curChat).append('<div class="servCtn"><span class="time">'+ MN_Base.getFormatDate() +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (webConfig.RobotName || '') +'</p><div>'+ content +'</div><i class="tri"></i></div></div>');


                                $('.monitorTalkCtn', $curMonitor).append('<div class="servCtn"><span class="time">'+ MN_Base.getFormatDate() +'</span><div class="wordCtn"><p class="name">'+ (webConfig.RobotName || '') +'</p><div>'+ content +'</div><i class="tri"></i></div></div>');

                                $('.chatBodyLeftCtnScroll', $curChat).mCustomScrollbar('scrollTo', 'bottom');

                                srcToolTip.close();

                                sendMsg($curChat.attr('cId'), content);


                                var $imgBox = $('.imgBox:last', $curChat);
                                //放大图片
                                new jBox('Tooltip', {
                                    attach: $imgBox.parent(),
                                    title: data.url.match(/\/(\d+\.jpg)/)[1],
                                    content: content,
                                    trigger: 'click',
                                    target: $('body'),
                                    overlay: true,
                                    position: {
                                        x: 'center',
                                        y: 'center',
                                    },
                                    animation: false,
                                    closeOnClick: 'body',
                                    closeOnEsc: true,
                                });
                                //提示放大
                                new jBox('Mouse', {
                                    attach: $imgBox.parent(),
                                    content: '点击放大',
                                    animation: false,
                                    closeOnClick: 'body',
                                });

                            }
                        }
                    });

                }
            }

            //声音提示
            $("#div").jPlayer({
                ready: function (event) {
                    $(this).jPlayer("setMedia", {
                        m4a: "src/msg2.mp3",
                    });
                },
                swfPath: "src",
                supplied: "m4a, oga",
            });

            //桌面提示变量
            var noticeTimer = null,
                noticeTitle = $('title').text();

            //左边部分滚动条
            $('.itemBody').mCustomScrollbar({
                theme: "dark-thin",
            });

            //左边手风琴菜单
            $('.leftCtn .itemTitle').on('click', function() {
                $(this).addClass('itemTitleFocus').next().stop().slideDown().parents('.items').siblings('.items').find('.itemTitle').removeClass('itemTitleFocus').next().stop().slideUp();
            })

            //在线用户滚动条生成
            $('.rightBodyCtn').mCustomScrollbar({
                theme:"light-thin",
            });

            //在线监控滚动条
            $('.midHeadRightCtn').mCustomScrollbar({
                theme:"dark-thin",
                horizontalScroll: true,
                autoHideScrollbar: true,
                scrollButtons: {
                    enable: true,
                },
            });

            //用户信息纵向滚动条
            $('.chatBodyRightCtn').mCustomScrollbar({
                theme:"dark-thin",
            });

            //知识库整体滚动条
            $('.knowBodyCtn>.queShowCtn').mCustomScrollbar({
                theme:"dark-thin",
                autoHideScrollbar: true,
            });

            /******jBox开始*******/
            //输入框提示信息
            if($('[richRanNum]', $('.chatCtn'))){
                $('[richRanNum]', $('.chatCtn')).each(function(i,item) {
                    new jBox('Mouse', {
                        maxWidth: '200px',
                        attach: item,
                        content: $(item).attr('data-title'),
                        animation:false,
                        closeOnClick: 'body',
                    });
                });
            }


            //在线用户tip
            new jBox('Tooltip', {
                attach: $('.rightHeadCtn'),
                content: $('.sortTip'),
                trigger: 'click',
                target: $('.rightHeadCtn'),
                offset: {
                    x: 40,
                    y: 20,
                },
                pointer: 'center: 15',
                animation: false,
                closeOnClick: 'body',
            });

            //搜索提示
            new jBox('Mouse', {
                attach: $('.search'),
                content: '搜索',
                animation: false,
                closeOnClick: 'body',
            });

            //选择发送图片还是文件
            var sendPicBox = new jBox('Tooltip', {
                content: $('.cosSrcCtn'),
                target: $('body'),
                position: {
                    x: 'center',
                    y: 'center',
                },
                overlay: true,
                animation: false,
                closeOnClick: 'body',
            });

            //上传图片
            uploader = WebUploader.create({
                server: '../../../material/jQueryFileUpload?type=1&materialType=1',
                swf: 'js/Uploader.swf',
                pick: $('.cosPicBtn'),
                duplicate: true,
                auto: true,
            });

            //上传文件
            uploader2 = WebUploader.create({
                server: '../../../material/jQueryFileUpload?type=4&materialType=4',
                swf: 'js/Uploader.swf',
                pick: $('.cosExlBtn'),
                duplicate: true,
                auto: true,
            });

            //开始上传 图片
            uploader.on( 'uploadStart', function( file ) {
                sendPicBox.close();

                $('.chatTalkCtn', $('.chatCtn')).append('<div id="'+ file.id +'" class="upFileCtn"><p class="upFileName">'+ file.name +'</p><div class="upFileOuter"><span class="upFileInner"></span></div></div>');

                $('.chatBodyLeftCtnScroll', $('.chatCtn')).mCustomScrollbar('scrollTo', 'bottom');
            });

            //上传中 图片
            uploader.on( 'uploadProgress', function( file, percentage ) {
                $('#'+ file.id).find('.upFileInner').css({'width': percentage*100 +'%'});
            });

            //获取服务端返回的数据 图片
            uploader.on( 'uploadAccept', function( object, data ) {
                if(data.status == 1){
                    new jBox('Notice', {
                        content: data.message,
                        color: 'red',
                        autoClose: '3000',
                    });
                }else{
                    $('#'+ object.file.id).fadeOut(function() {
                        $(this).remove();
                    });

                    if(data.files[0].error) {
                        new jBox('Notice', {
                            content: data.files[0].error,
                            color: 'red',
                            autoClose: '3000',
                        });
                    }else {
                        sendPicBox.close();

                        $('.chatTalkCtn', $('.chatCtn')).append('<div class="servCtn"><span class="time">'+ MN_Base.getFormatDate() +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (webConfig.RobotName || '') +'</p><div><img class="imgBox" src="'+ data.files[0].url +'"></div><i class="tri"></i></div></div>');


                        sendMsg($curChat.attr('cId'), '<img src="'+ data.files[0].url +'">');
                        $('.chatBodyLeftCtnScroll', $('.chatCtn')).mCustomScrollbar('scrollTo', 'bottom');

                        var $imgBox = $('.imgBox:last', $('.chatCtn'));
                        //放大图片
                        new jBox('Tooltip', {
                            attach: $imgBox.parent(),
                            title: data.files[0].name,
                            content: '<img class="imgBox" src="'+ data.files[0].url +'">',
                            trigger: 'click',
                            target: $('body'),
                            overlay: true,
                            position: {
                                x: 'center',
                                y: 'center',
                            },
                            animation: false,
                            closeOnClick: 'body',
                            closeOnEsc: true,
                        });
                        //提示放大
                        new jBox('Mouse', {
                            attach: $imgBox.parent(),
                            content: '点击放大',
                            animation: false,
                            closeOnClick: 'body',
                        });
                    }
                }


            });

            //开始上传 文件
            uploader2.on( 'uploadStart', function( file ) {
                sendPicBox.close();

                $('.chatTalkCtn', $('.chatCtn')).append('<div id="'+ file.id +'" class="upFileCtn"><p class="upFileName">'+ file.name +'</p><div class="upFileOuter"><span class="upFileInner"></span></div></div>');

                $('.chatBodyLeftCtnScroll', $('.chatCtn')).mCustomScrollbar('scrollTo', 'bottom');
            });

            //上传中 文件
            uploader2.on( 'uploadProgress', function( file, percentage ) {
                $('#'+ file.id).find('.upFileInner').css({'width': percentage*100 +'%'});
            });

            //获取服务端返回的数据 文件
            uploader2.on( 'uploadAccept', function( object, data ) {
                if(data.status == 1){
                    new jBox('Notice', {
                        content: data.message,
                        color: 'red',
                        autoClose: '3000',
                    });
                }else{
                    $('#'+ object.file.id).fadeOut(function() {
                        $(this).remove();
                    });

                    if(data.files[0].error) {
                        new jBox('Notice', {
                            content: data.files[0].error,
                            color: 'red',
                            autoClose: '3000',
                        });
                    }else {
                        sendPicBox.close();

                        $('.chatTalkCtn', $('.chatCtn')).append('<div class="servCtn"><span class="time">'+ MN_Base.getFormatDate() +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (webConfig.RobotName || '') +'</p><div><a href="'+ data.files[0].url +'" target="_blank"><span style="border-bottom: 1px solid #019eef;">点击下载文件 > '+ data.files[0].name +'</span></a></div><i class="tri"></i></div></div>');

                        sendMsg($('.chatCtn').attr('cId'), '<a href="'+ data.files[0].url +'" target="_blank"><span style="border-bottom: 1px solid #019eef;">点击下载文件 > '+ data.files[0].name +'</span></a>');
                        $('.chatBodyLeftCtnScroll', $('.chatCtn')).mCustomScrollbar('scrollTo', 'bottom');
                    }
                }


            });

            /******jBox结束*******/


            //调用表情插件
            $('.chatArea', $('.chatCtn')).face({
                src: 'src/yun/',//表情包路径
                rowNum: 5,//每行最多显示数量，此属性不适用于常用语
                ctnAttr: ['0px', '0px', '40px', '40px'],//[left bottom width height] 表情框相对targetEl位置和里面的表情格子宽高  要写单位
                triggerEl: $('.moodBtn', $('.chatCtn')),//触发按钮(不存在则自己生成，不要由a包裹)
                targetEl: $('.chatBodyCtn', $('.chatCtn')),//父级参照物(用于appendTo和定位)
                hideAdv: true,//是否隐藏广告
                callback: function(data) {
                },
            });


            //排序
            $('.sortTip p').on('click', function(e) {
                $(this).addClass('sortFocus').siblings().removeClass('sortFocus');

                if($(this).is('.defaultSort')) {//默认排序
                    sortObj('defaultsortnum');
                }
                if($(this).is('.stateSort')) {//状态排序
                    sortObj('statesortnum');
                }
                if($(this).is('.msgSort')) {//消息数排序
                    sortObj('msgsortnum');
                }
            });

            //传参排序
            function sortObj(attr) {
                var $rightItemCtn = $('.rightBodyCtn .itemCtn'),
                    len = $rightItemCtn.length,
                    objArr = [];

                $rightItemCtn.each(function() {
                    objArr.push($(this));
                });

                objArr.sort(function(a, b) {
                    return $(b).attr(attr) - $(a).attr(attr);
                });

                $rightItemCtn.each(function(i) {

                    if(len > i+1) {
                        $(this).delay(i*100).animate({'opacity': 0}, 300);
                    }else {
                        $(this).delay(i*100).animate({'opacity': 0}, 300, function() {
                            for(var j=0; j<len; j++) {
                                $('.rightBodyCtn .mCSB_container').append(objArr[j]);
                            }

                            var $rightItemCtn = $('.rightBodyCtn .itemCtn');

                            $rightItemCtn.each(function(j) {
                                $(this).delay(j*100).animate({'opacity': 1}, 300);
                            });
                        });
                    }
                });
            }

            $('.quickWordCtn').on('mouseover mouseout click', '.item, .quickQueNumFocus', function(e) {
                if($(this).is('.item')) {
                    if(e.type == 'mouseover') {
                        $(this).find('.quickQueNum').addClass('quickQueNumFocus');
                    }
                    if(e.type == 'mouseout') {
                        $(this).find('.quickQueNum').removeClass('quickQueNumFocus');
                    }
                    if(e.type == 'click') {//直接回复
                        if($curInput) {
                            if($curInput.parents('.chatFootCtn').css('display') != 'none') {
                                $curInput.val($(this).find('.quickQueWord').attr('data-title'));
                                $curInput.siblings('.sendBtn').trigger('click');
                            }
                        }
                    }
                }
                //删除快捷回复 -> url = '/QuickReply/delQuickReply'
                if($(this).is('.quickQueNumFocus')) {
                    if(e.type == 'click') {
                        MN_Base.request({
                            url: 'QuickReply/delQuickReply',
                            params: {
                                id: $(this).attr('Id'),
                            },
                            callback: function(data) {//重新渲染快捷回复
                                getQuickGroup();
                            },
                        });
                        return false;//阻止冒泡
                    }
                }
            });

            getQuickGroup();
            //快捷回复分组 -> url = '/QuickReply/getAllGroupName'
            function getQuickGroup() {
                MN_Base.request({
                    url: 'QuickReply/getAllGroupName',
                    params: {},
                    callback: function(data) {
                        var isExist = [];//是否存在该问题分类
                        for(var i=0; i<data.list.length; i++) {
                            isExist[i] = 1;
                            if(data.list[i].Name == 'onlyGroupName') {//存在直接获取
                                isExist[i] = 0;
                                getQuickAns();//获取快捷回复列表
                            }
                        }
                        var res = 1;
                        for(var i=0; i<isExist.length; i++) {
                            res *= isExist[i];
                        }
                        if(res) {//不存在则新建 -> url = '/QuickReply/addGroupName'
                            MN_Base.request({
                                url: 'QuickReply/addGroupName',
                                params: {
                                    groupName: 'onlyGroupName',
                                },
                                callback: function(data) {
                                    if(!data.status) {
                                        getQuickAns();//获取快捷回复列表

                                    }
                                },
                            });
                        }
                    },
                });
            }

            //快捷回复分组下的答案 -> url = '/QuickReply/getAllQuickReply'
            function getQuickAns() {
                MN_Base.request({
                    url: 'QuickReply/getAllQuickReply',
                    params: {},
                    callback: function(data) {
                        //渲染快捷回复
                        var html = '',
                            ranNum = parseInt(Math.random()*100000);
                        if(data.status == 0){
                            for(var i=0; i<data.List.length; i++) {
                                html += '<div class="item"><span class="quickQueNum" data-title="删除该回复" Id="'+ data.List[i].Id +'">'+ (i+1) +'</span><span quickRanNum="'+ (ranNum+i) +'" class="quickQueWord" data-title="'+ data.List[i].Content +'">'+ MN_Base.addDots(data.List[i].Content, 13) +'</span></div>';
                            }

                            $('.quickWordCtn').attr({'groupId': groupId}).empty().append(html);

                            $('.quickWordCtn .item').each(function(i) {
                                var $quickRanNum = $('[quickRanNum="'+ (ranNum+i) +'"]');
                                new jBox('Mouse', {
                                    maxWidth: '200px',
                                    attach: $quickRanNum,
                                    content: $quickRanNum.attr('data-title'),
                                    animation: false,
                                    closeOnClick: 'body',
                                });
                                new jBox('Mouse', {
                                    maxWidth: '200px',
                                    attach: $quickRanNum.prev(),
                                    content: '删除该回复',
                                    animation: false,
                                    closeOnClick: 'body',
                                });
                            });
                        }else{
                            $('.quickWordCtn').attr({'groupId': groupId}).empty().append(html);
                        }
                    },
                });
            }

            //新增回复 -> url = '/QuickReply/addReply'
            $('.editSave').on('click', function() {
                MN_Base.request({
                    url: 'QuickReply/addReply',
                    params: {
                        content: $('.editAskArea').val(),
                    },
                    callback: function(data) {//重新渲染快捷回复
                        if(data.status) {
                            new jBox('Notice', {
                                content: data.message,
                                color: 'red',
                                autoClose: '3000',
                            });
                        }else {
                            $('.editAskArea').val('');
                            getQuickGroup();
                        }
                    },
                });
            });

            //ENTER
            $(document).on('keyup', function(e) {
                var $activeEl = $(document.activeElement);

                if($activeEl.is('.editAskArea') && (e.keyCode==13||e.keyCode==108)) {
                    $('.editSave').trigger('click');
                }
            });

            //新增回答
            $('.addAskCtn p').on('click', function() {
                $('.editAskCtn').fadeIn(100);
                $('.editAskArea').focus();
            })

            //关闭新增回答
            $('.editCancle').on('click', function() {
                $('.editAskCtn').fadeOut(100);
            });

            // 收缩 midBodyRightCtn
            $('.toDir').on('click', function() {
                if($(this).is('.toRight')) {
                    $(this).removeClass('toRight').addClass('toLeft');
                    $('.midBodyRightCtn').animate({
                        right: -$('.midBodyRightCtn').outerWidth()
                    }, 300);
                    $('.midBodyLeftCtn').animate({
                        width: '100%'
                    }, 300);
                }else {
                    $(this).removeClass('toLeft').addClass('toRight');
                    $('.midBodyRightCtn').animate({
                        right: 0
                    }, 300);
                    $('.midBodyLeftCtn').animate({
                        width: $('.midCtn').outerWidth() - $('.midBodyRightCtn').outerWidth()
                    }, 300);
                }
            })

            //获取问题分类
            MN_Base.request({
                url: 'classes/listClasses',
                params: {
                    m: 0,
                },
                callback: function(data) {
                    if(data.status) {
                        new jBox('Notice', {
                            content: data.message,
                            color: 'red',
                            autoClose: '3000',
                        });
                    }else {
                        if(data.list[0]) {
                            for(var i=0; i<data.list.length; i++) {
                                groupId += data.list[i].Id +','
                            }
                        }

                        //搜索知识库
                        $('.knowToolHead .search').on('click', function() {
                            getQues($(this).prev().val(), $('.knowToolBody:first'), groupId);
                        });
                        getQues('', $('.knowToolBody:first'), groupId);
                    }
                },
            });

            //ENTER
            $(document).on('keyup', function(e) {
                var $activeEl = $(document.activeElement);

                if($activeEl.is('.knowToolHead input') && (e.keyCode==13||e.keyCode==108)) {
                    $('.knowToolHead .search').trigger('click');
                }
            });

            //获取知识库问题 -> url = '/question/getQueList'
            function getQues(question, $obj, groupId) {
                MN_Base.request({
                    type: 'post',
                    url: 'question/getQueList',
                    params: {
                        pageSize: 5,
                        pageNo: 1,
                        orderType: 4,
                        queryType: 1,
                        groupId: groupId,
                        solutionType: 1,//只是问题
                        question: question,
                    },
                    callback: function(data) {
                        if(!data.status) {
                            renderQues(data, $obj);
                        }
                    },
                });
            }
            //渲染知识库问题
            function renderQues(data, $obj) {
                var html = '',
                    $curObj = $obj;

                if($obj.prev('.knowToolHead')[0]) {//渲染到知识库
                    if(isV3) {//v3
                        for(var i=0; i<data.questionList.length; i++) {
                            html += '<div class="item"><p class="que" title="'+ (data.questionList[i].Question || '') +'">'+ (i+1) +'. '+ MN_Base.addDots((data.questionList[i].Question || ''), 14) +'</p><div class="ansCtn"><div class="ans"><span class="ansIndex">答案：</span><span class="ansChildren">'+ (data.questionList[i].Answer || '') +'</span><span class="edit">编辑</span><span class="reply">回复</span></div></div><div class="cosAskMaskCtn"><span class="look">查看详细</span><div class="cosAskMask"></div></div></div>';
                        }
                    }else {//v35
                        for(var i=0; i<data.questionList.length; i++) {
                            var answer = '',
                                index = 0;
                            for(var j=0; j<data.questionList[i].ListAnswer.length; j++) {
                                var showAns = false;//改答案是否要展示
                                var ListRule = data.questionList[i].ListAnswer[j].ListRule;
                                if(!ListRule) {
                                    showAns = true;
                                    index++;
                                }
                                if(ListRule) {
                                    if(ListRule[0]) {
                                        for(var m=0; m<ListRule.length; m++) {
                                            if((ListRule[m].type.indexOf('1')+1) && (ListRule[m].roleIds.indexOf('0')+1)) {
                                                showAns = true;
                                                index++;
                                            }
                                        }
                                    }
                                }

                                if(showAns) {
                                    answer += '<div class="ans" sId="'+ data.questionList[i].ListAnswer[j].SolutionId +'" aId="'+ data.questionList[i].ListAnswer[j].Id +'"><span class="ansIndex">答案'+ index +'：</span><span class="ansChildren">'+ (data.questionList[i].ListAnswer[j].Answer || '') +'</span><span class="edit">编辑</span><span class="reply">回复</span></div>';
                                }else {//没有网页的答案时，展示其他渠道答案
                                    answer += '<div class="ans" sId="'+ data.questionList[i].ListAnswer[j].SolutionId +'" aId="'+ data.questionList[i].ListAnswer[j].Id +'"><span class="ansIndex">答案'+ (index+1) +'：</span><span class="ansChildren">'+ (data.questionList[i].ListAnswer[j].Answer || '') +'</span><span class="edit">编辑</span><span class="reply">回复</span></div>';
                                    break;
                                }
                            }
                            answer = '<div class="item"><p class="que" title="'+ (data.questionList[i].Question || '') +'">'+ (i+1) +'. '+ MN_Base.addDots((data.questionList[i].Question || ''), 14) +'</p><div class="ansCtn">'+ answer +'</div><div class="cosAskMaskCtn"><span class="look">查看详细</span><div class="cosAskMask"></div></div></div>';
                            html += answer;
                        }
                    }
                }else {//渲染到推荐答案
                    if(isV3) {//v3
                        for(var i=0; i<data.questionList.length; i++) {
                            html += '<div class="item"><div class="ansCtn"><div class="ans"><span class="ansIndex">答案：</span><span class="ansChildren">'+ (data.questionList[i].Answer || '') +'</span><span class="edit">编辑</span><span class="reply">回复</span></div></div><div class="cosAskMaskCtn"><span class="look">查看详细</span><div class="cosAskMask"></div></div></div>';
                        }
                    }else {//v35
                        for(var i=0; i<data.questionList.length; i++) {
                            var answer = '',
                                index = 0;
                            for(var j=0; j<data.questionList[i].ListAnswer.length; j++) {
                                var showAns = false;//改答案是否要展示
                                var ListRule = data.questionList[i].ListAnswer[j].ListRule;
                                if(!ListRule) {
                                    showAns = true;
                                    index++;
                                }
                                if(ListRule) {
                                    if(ListRule[0]) {
                                        for(var m=0; m<ListRule.length; m++) {
                                            if((ListRule[m].type.indexOf('1')+1) && (ListRule[m].roleIds.indexOf('0')+1)) {
                                                showAns = true;
                                                index++;
                                            }
                                        }
                                    }
                                }

                                if(showAns) {
                                    answer += '<div class="ans" sId="'+ data.questionList[i].ListAnswer[j].SolutionId +'" aId="'+ data.questionList[i].ListAnswer[j].Id +'"><span class="ansIndex">答案'+ index +'：</span><span class="ansChildren">'+ (data.questionList[i].ListAnswer[j].Answer || '') +'</span><span class="edit">编辑</span><span class="reply">回复</span></div>';
                                }else {//没有网页的答案时，展示其他渠道答案
                                    answer += '<div class="ans" sId="'+ data.questionList[i].ListAnswer[j].SolutionId +'" aId="'+ data.questionList[i].ListAnswer[j].Id +'"><span class="ansIndex">答案'+ (index+1) +'：</span><span class="ansChildren">'+ (data.questionList[i].ListAnswer[j].Answer || '') +'</span><span class="edit">编辑</span><span class="reply">回复</span></div>';
                                    break;
                                }
                            }
                            answer = '<div class="item"><div class="ansCtn">'+ answer +'</div><div class="cosAskMaskCtn"><span class="look">查看详细</span><div class="cosAskMask"></div></div></div>';
                            html += answer;
                        }
                    }
                }

                //$curObj.empty().append(html || '<div class="noResult">当前无结果</div>');
                $curObj.empty().append(html);

                //知识库单个问题滚动条
                $.each($('.ansCtn'), function() {
                    $(this).mCustomScrollbar({
                        theme: "rounded-dark",
                        autoHideScrollbar: true,
                    });
                });

                //直接回复
                $('.reply').off('click').on('click', function() {
                    if($curInput) {
                        if($curInput.parents('.chatFootCtn').css('display') != 'none') {
                            var content = $(this).prevAll('.ansChildren').html();

                            $('.chatTalkCtn', $curChat).append('<div class="servCtn"><span class="time">'+ MN_Base.getFormatDate() +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (webConfig.RobotName || '') +'</p><div>'+ content +'</div><i class="tri"></i></div></div>');
                            $('.monitorTalkCtn', $curMonitor).append('<div class="servCtn"><span class="time">'+ MN_Base.getFormatDate() +'</span><div class="wordCtn"><p class="name">'+ (webConfig.RobotName || '') +'</p><div>'+ content +'</div><i class="tri"></i></div></div>');
                            $('.chatBodyLeftCtnScroll', $curChat).mCustomScrollbar('scrollTo', 'bottom');
                            sendMsg($curChat.attr('cId'), content, '', $(this).parents('.ans'));
                        }
                    }
                });

                //编辑回复
                $('.edit').off('click').on('click', function() {
                    if($curInput) {
                        if($curInput.parents('.chatFootCtn').css('display') != 'none') {
                            $curInput.val($(this).prevAll('.ansChildren').text());
                        }
                    }
                });
            }

            //知识库单个问题弹出框
            $('.midBodyRightCtn').on('mouseenter mouseleave click','.item, .look, .knowToolBtn, .quickAskBtn, .userMsgBtn', function(e) {
                var $this = $(this);

                //切换//easeInExpo
                if(e.type == 'click' && $this.is('.knowToolBtn')) {
                    $this.addClass('knowBtnFocus').siblings().removeClass('knowBtnFocus');
                    $('.knowToolCtn').stop().show().siblings().stop().hide();
                    $('.knowToolHead input').focus();
                }
                if(e.type == 'click' && $this.is('.quickAskBtn')) {
                    $this.addClass('knowBtnFocus').siblings().removeClass('knowBtnFocus');
                    $('.quickAskCtn').stop().show().siblings().stop().hide();
                }
                if(e.type == 'click' && $this.is('.userMsgBtn')) {
                    $this.addClass('knowBtnFocus').siblings().removeClass('knowBtnFocus');
                    $('.userMsgCtn').stop().show().siblings().stop().hide();
                }

                //移入
                if(e.type == 'mouseenter' && $this.is('.item')) {
                    $this.find('.cosAskMaskCtn').stop().fadeIn(300);
                }
                //移出
                if(e.type == 'mouseleave' && $this.is('.item')) {
                    $this.find('.cosAskMaskCtn').stop().fadeOut(300).siblings('.ansCtn').stop().animate({'height': 30}, 300);

                }
                //点击
                if(e.type=='click' && $this.is('.look')) {
                    $this.parents('.cosAskMaskCtn').stop().fadeOut(300).siblings('.ansCtn').stop().animate({'height': 200}, 300);
                }
            });

            //缩放左边
            $('.leftClose').on('click', function() {
                var isClose = $(this).attr('isClose');

                //chatBodyLeftCtn
                if(isClose) {//1->缩
                    $('.leftCtn').stop().animate({'left': 0}, 300, function() {
                        $(window).trigger('resize');
                    });
                    $('.midCtn').stop().animate({'left': $('.leftCtn').outerWidth(), 'width': $('.body').outerWidth() - $('.rightCtn').outerWidth() - $('.leftCtn').outerWidth()}, 300, function() {
                        $(window).trigger('resize');
                    });
                    $('.midHeadRightCtn').stop().animate({'width': $('.body').outerWidth() - $('.rightCtn').outerWidth() - $('.midHeadLeftCtn').outerWidth() - 1 - $('.leftCtn').outerWidth()}, 300, function() {
                        $(window).trigger('resize');
                    });
                    $(this).attr({'isClose': 0});

                    $('.midBodyLeftCtn').stop().animate({'width': $('.midBodyLeftCtn').outerWidth() - $('.leftCtn').outerWidth()}, 300, function() {
                        $(window).trigger('resize');
                    });
                }else {//0->放
                    $('.leftCtn').stop().animate({'left': -$('.leftCtn').outerWidth()}, 300, function() {
                        $(window).trigger('resize');
                    });
                    $('.midCtn').stop().animate({'left': 0, 'width': $('.body').outerWidth() - $('.rightCtn').outerWidth()}, 300, function() {
                        $(window).trigger('resize');
                    });
                    $('.midHeadRightCtn').stop().animate({'width': $('.body').outerWidth() - $('.rightCtn').outerWidth() - $('.midHeadLeftCtn').outerWidth() - 1}, 300, function() {
                        $(window).trigger('resize');
                    });
                    $(this).attr({'isClose': 1});

                    $('.midBodyLeftCtn').stop().animate({'width': $('.midBodyLeftCtn').outerWidth() + $('.leftCtn').outerWidth()}, 300, function() {
                        $(window).trigger('resize');

                    });


                }
            });

            $('.leftBodyCtn .items').eq(0).siblings().hide();


            //禁止刷新
            /*$(document).on('keydown', function(e) {
                if(e.keyCode == 116) {
                    return false;
                }
            });*/

            //禁用菜单
            //MN_Base.banCtxMenu();

            /*******在线用户******/

            //定时请求
            var timer = setInterval(getOnlineUsers, 1500);

            getOnlineUsers();
            //获取在线用户信息 -> s=goul
            function getOnlineUsers() {
                if(tipMsg == '未知的接口...') {//用户长时间离开
                    tipMsg = '等待用户刷新';
                    new jBox('Notice', {
                        content: '您长时间未进行操作，请刷新后继续...',
                        color: 'red',
                        autoClose: false,
                        onCloseComplete: function() {
                            location.reload();
                        }
                    });
                }else if(tipMsg == '等待用户刷新'){
                }else if(tipMsg == '请重新登录.'){
                    document.location.href = '/login.html';
                }else if(tipMsg == '您的账号在其他地方登陆，您被迫下线，请注意账号安全并重新登录！'){
                    document.location.href = '/login.html';
                }else {
                    MN_Base.request({
                        url: 'servlet/Monitor',
                        params: {
                            s: 'goul',
                        },
                        callback: function(data) {

                            tipMsg = data.message;
                            if(data.status) {//x
                                var login = false;
                                if(data.message == '请重新登陆！') {
                                    login = true;
                                }
                                if(data.message != '未知的接口...') {
                                    new jBox('Notice', {
                                        content: data.message,
                                        color: 'red',
                                        autoClose: '3000',
                                        onCloseComplete: function() {
                                            if(login) {
                                                document.location.href = '/login.html';
                                            }
                                        }
                                    });
                                }
                            }else {//y
                                loadingBox.close();
                                $('.body').animate({'opacity': 1});
                                renderOnlineUsers(data);
                            }
                        },
                    });
                }
            }

            //渲染在线用户
            function renderOnlineUsers(data) {
                var $onlineUsers = $('.rightBodyCtn .itemCtn:not(.groupCtn)'),
                    len = $onlineUsers.length,
                    onlineUsers = data.onlineUsers,
                    html = '',
                    ranNum = parseInt(Math.random()*100000);

                //当前排队人数
                if(len) {
                    $('.body .leftCtn').addClass('leftCtnEmpty');
                }else {
                    $('.body .leftCtn').removeClass('leftCtnEmpty');
                }

                //当前无在线监控
                var $monitorUsers = $('.midHeadRightCtn .itemCtn');

                if($monitorUsers.eq(0)[0]) {
                    $('.midHeadRightCtn').removeClass('midHeadRightCtnFocus');
                }else {
                    $('.midHeadRightCtn').addClass('midHeadRightCtnFocus');
                }

                //当前无进行对话
                var $takeUsers = $('.midBodyLeftCtn .chatCtn');

                if($takeUsers.css('display') != 'none') {
                    $('.midBodyLeftCtn').removeClass('midBodyLeftCtnFocus');
                }else {
                    $('.midBodyLeftCtn').addClass('midBodyLeftCtnFocus');
                }

                //当前无推荐问题
                var $artiQues = $('.knowFootCtn .item');

                if($artiQues.eq(0)[0]) {
                    $('.knowFootCtn').removeClass('knowFootCtnFocus');
                }else {
                    $('.knowFootCtn').addClass('knowFootCtnFocus');
                }

                for(var i=0; i<onlineUsers.length; i++) {
                    var onlineUser = onlineUsers[i],
                        cIdData = encodeURI(onlineUser.cId).replace(/%/g, '_-'),
                        nickName = onlineUsers[i].name,
                        needAdd = true,
                        className = getClassName(onlineUser.state, onlineUser.controlId),
                        groupCtn = '';

                    //更新状态文字
                    var $onlineUser = $('.rightBodyCtn .itemCtn[cId = "'+cIdData+'"]');
                    //用户拉黑状态
                    $onlineUser.attr('userLevel',onlineUser.userLevel);



                    var cIdAttr = $onlineUser.attr('cId');

                    //更新在线时长
                    if(cIdData == $('.chatHeadCtn').attr('cId')){
                        $('.takeLiveBtn').html(MN_Base.formatSecond(onlineUser.onlineTime));
                    }

                    //更新
                    if(cIdData == cIdAttr) {
                        if(onlineUser.state == 0 || onlineUser.state==4) {//下线状态不再显示
                            $onlineUser.remove();
                        }
                        $onlineUser.find('.state').removeClass().addClass('state '+ className[0]).text(className[1]);
                        $onlineUser.attr({'ranNum': ranNum});
                        $onlineUser.attr({'state': onlineUser.state});

                        needAdd = false;

                        // 更新分组信息
                        switch(onlineUser.state) {
                            case 1:// 智能聊天
                                groupCtn = 'groupCtn1';
                                break;
                            case 2:// 被监控
                                groupCtn = 'groupCtn2';
                                break;
                            case 3:// 被接管
                            case 5:// 被接管
                            case 7:// 被监控
                            case 8:// 被监控
                                groupCtn = 'groupCtn3';
                                break;
                            case 0:// 已下线
                            case 4:// 已挂起
                                groupCtn = 'groupCtn4';
                                break;
                        }

                        if($onlineUser.attr('class')){
                            if($onlineUser.attr('class').replace(/[^\d]*/g, '') != groupCtn.replace(/[^\d]*/g, '')){
                                $onlineUser.removeClass('groupCtn1next groupCtn2next groupCtn3next groupCtn4next').addClass(groupCtn +'next');
                            }
                        }

                        //用户昵称
                        if(nickName){
                            $onlineUser.find('.ipMsgCtn').html(nickName);
                        }

                        $('.groupCtn').each(function(key, item) {
                            if($(item).find('.groupTri').hasClass('groupTriToB')) {// 展开
                                $(item).nextAll('.groupCtn'+ $(item).attr('sortIndex') +'next').fadeIn(100);
                            }else {
                                $(item).nextAll('.groupCtn'+ $(item).attr('sortIndex') +'next').fadeOut(100);
                            }
                        })
                    }

                    //更新姓名
                    var $monitorItemCtn = $('.longDiv .chatHeadCtn');
                    if(cIdData == $monitorItemCtn.attr('cId')) {
                        $monitorItemCtn.find('.custMsgCtn').text(MN_Base.addDots(onlineUser.name, 3));
                    }

                    //转人工触发原因和拉入黑名单按钮
                    if(onlineUser.cId == $('.itemCtnFocus').attr('cId')){
                        switch(parseInt($('.itemCtnFocus').attr('state'))){
                            case 3:
                            case 5:
                            case 7:
                            case 8:
                                $('.longDiv').find('.reasonCtn').css("display","inline");
                                $('.longDiv').find('.reasonBtn').html(onlineUser.turnPeopleReason);
                                $('.longDiv').find('.defriendCtn').css("display","inline");
                                if($('.itemCtnFocus').attr('userLevel') == -1){
                                    $('.longDiv').find('.unlockingBtn').fadeIn(100);
                                    $('.longDiv').find('.defriendBtn').fadeOut(100);
                                }else{
                                    $('.longDiv').find('.unlockingBtn').fadeOut(100);
                                    $('.longDiv').find('.defriendBtn').fadeIn(100);
                                }
                                break;
                            case 0:
                            case 1:
                            case 2:
                            case 4:
                                $('.longDiv').find('.reasonCtn').css("display","none");
                                $('.longDiv').find('.defriendCtn').css("display","none");
                                break;
                        }


                    }



                    //新增
                    if(needAdd) {
                        var onlyIndex = getOnlyIndex(cIdData);//图片序号
                        if(onlineUser.state &&  onlineUser.state!=4) {//!=0 下线状态不再显示
                            html = '<div class="'+ groupCtn +'next itemCtn" cId="'+ cIdData +'" ranNum="'+ ranNum +'" state="'+ onlineUser.state +'" isClick="0" artiNum="0" defaultSortNum="'+ onlyIndex +'" stateSortNum="0" msgSortNum="0"><div class="onlineMask" flashNum="0"></div><div class="item"><div class="queTipLeft"><div class="imgCtn"><img src="images/animal'+ (onlyIndex%35 ? onlyIndex%35 : 35) +'.png"></div><div class="userTxtCtn"><div class="ipMsgCtn">'+ (getSource(onlineUser.sourceId)=='网页'?'IP：'+onlineUser.ip||'':getSource(onlineUser.sourceId)+'客户') +'</div><div class="state '+ className[0] +'">'+ className[1] +'</div></div></div><div class="queTipRight"><div class="queTime">刚刚收到</div><div class="queNum">0</div></div></div></div>';

                            var $userMsg = $('.userMsg');
                            $userMsg.attr('cId',cIdData);
                            $userMsg.find('userHeadCtn').children('span:first').html(onlineUser.name || '');
                            $userMsg.find('.userAddr').html(onlineUser.addr || '');
                            $userMsg.find('.userIp').html(onlineUser.ip || '');
                            $userMsg.find('.userLoadTimes').html('第'+onlineUser.loadTimes || ''+'次');
                            $userMsg.find('.userSystem').html(onlineUser.sysInfo || '');
                            $userMsg.find('.userBrower').html(onlineUser.broswer || '');
                            $userMsg.find('.userLiveTime').html(onlineUser.onlineTime || '');
                            if(groupCtn) {
                                $('.rightBodyCtn .mCSB_container'+ (groupCtn? ' .'+ groupCtn +'next':'')).after(html);

                            }else {
                                $('.rightBodyCtn .mCSB_container').append(html);
                            }
                            $('[cId="'+ cIdData +'"]').hide();
                        }
                    }
                }

                //更新按钮样式(是否能点击)
                switch (parseInt($('.itemCtnFocus').attr('state'))||0) {
                    case 0://下线
                    case 1://智能聊天
                    case 4://挂起
                        //客户刷新聊天界面(销毁对应)
                        var $monitorItemCtn = $('.longDiv .chatHeadCtn');
                        var $monitorCtn = $('.monitorCtn');
                        var $takeItemCtn = $('.chatBodyRightCtn');
                        var $chatCtn = $('.chatCtn');
                        $monitorItemCtn.fadeOut(100);
                        $takeItemCtn.fadeOut(100);
                        $chatCtn.slideUp(100);

                        $.each($monitorCtn, function(i, itemObj) {
                            $(this).slideUp(function() {
                                $(this).remove();
                            });
                        });
                        break;
                    case 2://被监控
                        //接管自动转为监控(销毁对应)
                        var $monitorCtn = $('.monitorCtn');
                        var $takeItemCtn = $('.onlineTalk .itemCtn');
                        var $chatCtn = $('.chatCtn');

                        $.each($monitorCtn, function(i, itemObj) {
                            $(this).fadeIn(300);
                        });

                        $('.chatFootCtnOther', $chatCtn).fadeIn(100);
                        $('.chatFootCtn', $chatCtn).fadeOut(100);
                        break;
                    case 3://与云问客服聊天// #1
                    case 5://与第三方客服聊天
                    case 7://与第三方客服聊天，同时被监控着
                    case 8://与云问客服聊天，同时被监控着
                        $('.chatFootCtnOther', $chatCtn).fadeOut(100);
                        $('.chatFootCtn', $chatCtn).fadeIn(100);

                        break;
                }

                //转人工
                $onlineUsers = $('.rightBodyCtn .itemCtn:not(.groupCtn)');
                for(var j=0; j<onlineUsers.length; j++) {
                    $.each($onlineUsers, function(i, obj) {
                        if(onlineUsers[j].events && onlineUsers[j].events!='') {//有人工请求
                            if(onlineUsers[j].cId == $(obj).attr('cId')) {
                                $(obj).prevAll('.groupCtn').eq(0).after($(obj))
                                $(obj).attr({'artiNum': parseInt($(obj).attr('artiNum'))+1});

                                flashTip($(obj).find('.onlineMask'), 5);

                                new jBox('Notice', {
                                    content: '有访客请求人工接入',
                                    color: 'red',
                                    autoClose: '5000',
                                    animation: 'tada',
                                });

                                $('.jp-play').trigger('click');

                                //桌面提示
                                showMsgNotification('转人工提示', '有访客请求接入');
                            }
                        }else {
                        }
                    });
                }

                //被监控客户及时更新信息
                if(data.msgList[0]) {
                    var $chatCtn = $('.chatCtn');//接管框

                    for(var i=0; i<data.msgList.length; i++) {
                        var cId = encodeURI(data.msgList[i].cId).replace(/%/g, '_-');
                        var msgList = data.msgList[i].msgList;

                        if(cId == $('.chatCtn[cid="' + cId + '"]').attr('cid')){

                            var html = "";

                            //问题推荐答案(每次以最后一个为准)
                            for(var k=0; k<msgList.length; k++) {
                                if(k == msgList.length-1) {
                                    getQues(data.msgList[i].msgList[k].askMsg, $('.knowToolBody:last'), groupId);
                                }
                            }

                            //设置头像
                            var picSrc = '';
                            var cId = encodeURI(data.msgList[i].cId).replace(/%/g, '_-');
                            if(cId  == $('.rightBodyCtn .itemCtn[cId="'+cId+'"]').attr('cId')) {
                                picSrc = $('.rightBodyCtn .itemCtn[cId="'+cId+'"]').find('img').attr('src');
                            }

                            // var newMeg = [{
                            //   ansMsg:'http://v4.faqrobot.net/upload/web/1507794753170749/20171114/29031510659835770.mp3',
                            //   ansUserId:"fengxin",
                            //   ansUserName:'fengxin',
                            //   askMsg:"测试语音",
                            //   askUserId:"5cnzAaTVCti7leA",
                            //   askUserName:"江苏省南京市 电信",
                            //   time:"2017-12-07 10:57:05"
                            // }];

                            //添加到聊天框
                            $.each(msgList, function(key, value) {
                                var newansMsg = value.ansMsg;;
                                // if(value.ansMsg.indexOf('.mp3') > 0){
                                //   newansMsg = '<p>若无法播放，请点击<a href="'+newansMsg+'" target="_blank" style="color:#008CEE">下载</a></p><br/><audio src="'+ newansMsg +'" controls="controls">您的浏览器不支持 audio 标签。</audio>'
                                // }
                              
                                html = (value.askMsg?'<div class="custCtn"><span class="time">'+ value.time +'</span><div class="wordCtn"><img class="chatPic" src="'+ picSrc +'"><p class="name">'+ (value.askUserName || '') +'</p><p>'+ replaceFace(value.askMsg) +'</p><i class="tri"></i></div></div>':'')+(newansMsg?'<div class="servCtn'+ ((value.ansUserName || '')?'':' _servCtn') +'"><span class="time">'+ (value.time || '') +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (value.ansUserName || '') +'</p><p>'+ replaceFace(newansMsg) +'</p><i class="tri"></i></div></div>':'');

                                $('.chatCtn[cid="' + cId + '"]').find('.chatTalkCtn').append(html);
                                var chatTalkCtnArr = $('.chatCtn[cid="' + cId + '"]').find('.chatTalkCtn');
                                if(chatTalkCtnArr.children().length>10){
                                    var newHtml = chatTalkCtnArr.children().splice(chatTalkCtnArr.children().length-10,chatTalkCtnArr.children().length);
                                    $('.chatCtn[cid="' + cId + '"]').find('.chatTalkCtn').html(newHtml);
                                }
                                $('.chatCtn[cid="' + cId + '"]').find('.chatBodyLeftCtnScroll').mCustomScrollbar('scrollTo', 'bottom');
                                var $imgBox = $('.upload_imgBox:last', $curChat);
                                if($imgBox[0]) {
                                    //放大图片
                                    new jBox('Tooltip', {
                                        attach: $imgBox.parent(),
                                        title: $imgBox.attr('src').match(/\/(\d+\.jpg)/)[1],
                                        content: $imgBox.clone(),
                                        trigger: 'click',
                                        target: $('body'),
                                        overlay: true,
                                        position: {
                                            x: 'center',
                                            y: 'center',
                                        },
                                        animation: false,
                                        closeOnClick: 'body',
                                        closeOnEsc: true,
                                    });
                                    //提示放大
                                    new jBox('Mouse', {
                                        attach: $imgBox.parent(),
                                        content: '点击放大',
                                        animation: false,
                                        closeOnClick: 'body',
                                    });
                                }
                            })
                        }

                        $.each(msgList, function(key, msgObj){
                            if($('.itemCtnFocus').attr('cId') != msgObj.askUserId && $('.itemCtn[cId="'+ msgObj.askUserId +'"]').attr('state') == 2){//如果是当前的话，那就不累计
                                // 累计未读消息数和时间
                                var $queTipRight = $('.itemCtn[cId="'+ msgObj.askUserId +'"] .queTipRight');
                                var $queNum = $('.itemCtn[cId="'+ msgObj.askUserId +'"] .queNum');
                                var $queTime = $('.itemCtn[cId="'+ msgObj.askUserId +'"] .queTime');
                                $queNum.text((+$queNum.text())+1);
                                if(+$queNum.text()) {
                                    $queNum.text((+$queNum.text())-1);
                                    $queTipRight.fadeIn(100);

                                }else {
                                    $queTipRight.fadeOut(100);
                                }
                                $queTime.text(getFormatDate());
                            }
                        });

                        if(chatRecord[cId]){
                            chatRecord[cId].msgList = chatRecord[cId].msgList.concat(msgList);
                        }else{
                            chatRecord[cId] = {};
                            chatRecord[cId].msgList = msgList;
                        }

                        var curMsgLen = chatRecord[cId].msgList.length;

                        if(curMsgLen > 10){
                            chatRecord[cId].msgList = chatRecord[cId].msgList.splice(curMsgLen-10, curMsgLen);
                        }
                    }
                }

                // 更新分组信息
                $.each($('.groupCtn'), function(i, obj) {
                    var sortIndex = $(obj).attr('sortIndex');
                    $.each($('.rightBodyCtn .itemCtn[cId]'), function(j, itemCtnObj) {

                        if($(itemCtnObj).prevAll('.groupCtn').eq(0).attr('class').replace(/[^\d]*/g, '') != $(itemCtnObj).attr('class').replace(/[^\d]*/g, '')) {
                            $(obj).after($('.groupCtn'+ sortIndex +'next'));
                        }
                    })

                    var nextAllLen = $(obj).nextAll('.groupCtn'+ sortIndex +'next').length;

                    $('.queNum', obj).text(nextAllLen);
                    if(nextAllLen) {
                        $('.queTipRight', obj).fadeIn(100);
                    }else {
                        $('.queTipRight', obj).fadeOut(100);
                    }
                })

                //未读消息个数
                var $itemCtn = $('.rightCtn .itemCtn');

                //被监控时
                var $monitorCtn = $('.monitorCtn');

                $.each($itemCtn, function(j, itemObj) {
                    if($(itemObj).attr('state') == 2){
                        if($(itemObj).find('.queTipRight').css('display') != 'none'){
                            var $queNum = $(itemObj).find('.queNum');
                            var $queTime = $(itemObj).find('.queTime');
                            var num = 0;
                            for(var i=0; i<data.msgList.length; i++) {
                                if(encodeURI(data.msgList[i].cId).replace(/%/g, '_-') == $(itemObj).attr('cId')) {
                                    num = data.msgList[i].msgList.length;
                                }
                            }
                            if(num) {
                                $queNum.show().text(parseInt($queNum.text() || 0) + num);
                            }
                        }else {
                            $(itemObj).find('.queNum').hide().text('');
                        }
                    }

                });

                //被接管时
                var $chatCtn = $('.chatCtn');
                var $talkCtn = $('.onlineTalk .itemCtn');
                var $userCtn = $('.rightBodyCtn .itemCtn');

                //重置请求数
                $.each($userCtn, function(i, obj) {
                    if($(obj).attr('state') == 3) {
                        $(obj).attr({'artiNum': 0});

                        $(obj).find('.onlineMask').animate({'opacity': 0}, 300);
                    }
                });

                $.each($itemCtn, function(j, itemObj){
                    if($(itemObj).attr('state') == 3){
                        if($('.chatCtn').attr('cId') != $(itemObj).attr('cId')){
                            var $queNum = $(itemObj).find('.queNum');
                            var $queTime = $(itemObj).find('.queTime');
                            var num = 0;
                            for(var i=0; i<data.msgList.length; i++) {
                                if(encodeURI(data.msgList[i].cId).replace(/%/g, '_-') == $(itemObj).attr('cId')) {
                                    num = data.msgList[i].msgList.length;
                                    for(var m=0; m<data.msgList[i].msgList.length; m++) {

                                        if(m == data.msgList[i].msgList.length - 1) {
                                            var queTime = data.msgList[i].msgList[m].time;
                                            $.each($talkCtn, function() {
                                                if($(this).attr('cId') == encodeURI(data.msgList[i].cId).replace(/%/g, '_-')) {
                                                    var word = replaceFace(data.msgList[i].msgList[m].askMsg);

                                                    $(this).find('.custQue').text(MN_Base.addDots(word, 9)).attr({'title': word});
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                            if(num) {
                                $queNum.parent().fadeIn(100);
                                $("#div").jPlayer('play');
                                $queTime.text(queTime);
                                $queTime.text(getFormatDate());
                                $queNum.show().text(parseInt($queNum.text() || 0) + num);
                            }
                        }else {
                            $(itemObj).find('.queNum').hide().text('');
                        }
                    }
                });

                //排序相关数量
                $onlineUsers.each(function() {
                    //状态排序数
                    var artinum = $(this).attr('artinum'),
                        allNum = 0;

                    for(var i=0; i<artinum; i++) {
                        allNum += 10;
                    }
                    allNum += $(this).attr('state');
                    $(this).attr({'statesortnum': allNum});

                    //消息排序数
                    $(this).attr({'msgsortnum': $(this).find('.queNum').text() || 0});

                });

            }

            //拉入黑名单
            $(".defriendBtn").unbind('click').bind('click',function(){
                $('#makeSure').fadeIn();
            });
            $('#cancel').unbind('click').bind('click',function(){
                $('#makeSure').fadeOut();
                $('#makeSure').find('textarea').val('');
            });
            $('#ok').unbind('click').bind('click',function(){
                var textContent = $('#makeSure').find('textarea').val();
                var cId = $('.itemCtnFocus').attr('cId');
                MN_Base.request({
                    type: 'post',
                    url: 'ChatUser/doLevel',
                    params: {
                        cId: cId,
                        chatuserLevel: -1,
                        info: textContent,
                    },
                    callback: function(data) {
                        if(!data.status) {
                            new jBox('Notice', {
                                content: "拉黑"+data.message,
                                color: 'green',
                                autoClose: '3000',
                            });
                        }else{
                            new jBox('Notice', {
                                content: data.message,
                                color: 'red',
                                autoClose: '3000',
                            });
                        }
                    },
                });
                MN_Base.request({
                    url: 'servlet/Monitor',
                    params: {
                        s: 'uul',
                        cId: cId,
                        userLevel: -1,
                    },
                    callback: function(data) {
                        if(data.status != 0){
                            new jBox('Notice', {
                                content: data.message,
                                color: 'red',
                                autoClose: '3000',
                            });
                        }
                    },
                });
                $('#makeSure').fadeOut();
                $('#makeSure').find('textarea').val('');
            });
            //解除拉黑
            $('.unlockingBtn').unbind('click').bind('click',function(){
                var cId = $('.itemCtnFocus').attr('cId');
                MN_Base.request({
                    type: 'post',
                    url: 'ChatUser/doLevel',
                    params: {
                        cId: cId,
                        chatuserLevel: 0
                    },
                    callback: function(data) {
                        if(!data.status) {
                            new jBox('Notice', {
                                content: data.message,
                                color: 'green',
                                autoClose: '3000',
                            });
                        }else{
                            new jBox('Notice', {
                                content: data.message,
                                color: 'red',
                                autoClose: '3000',
                            });
                        }
                    },
                });
                MN_Base.request({
                    url: 'servlet/Monitor',
                    params: {
                        s: 'uul',
                        cId: cId,
                        userLevel: 0,
                    },
                    callback: function(data) {
                        if(data.status != 0){
                            new jBox('Notice', {
                                content: data.message,
                                color: 'red',
                                autoClose: '3000',
                            });
                        }
                    },
                });

            });

            //悬浮转人工提示消失
            $('body').on('mouseover', function() {
                clearInterval(noticeTimer);
                $('title').text(noticeTitle);
            });

            function showMsgNotification(title, msg) {
                var Notification = window.Notification || window.mozNotification || window.webkitNotification;

                if(Notification) {//支持桌面通知
                    if(Notification.permission == "granted") {//已经允许通知
                        var instance = new Notification(title, {
                            body: msg,
                            icon: "images/faq_title.png",
                        });
                    }else {
                        Notification.requestPermission(function(status) {
                            if (status === "granted") {//用户允许
                                var instance = new Notification(title, {
                                    body: msg,
                                    icon: "images/faq_title.png"
                                });
                            }else {//用户禁止
                                return false
                            }
                        });
                    }
                }else {//不支持(IE等)
                    var index = 0;

                    clearInterval(noticeTimer);
                    noticeTimer = setInterval(function() {
                        if(index%2) {
                            $('title').text('【　　　　　】'+ noticeTitle);//这里是中文全角空格，其他不行
                        }else {
                            $('title').text('【新人工请求】'+ noticeTitle);
                        }
                        index++;

                        if(index > 20) {
                            clearInterval(noticeTimer);
                        }
                    }, 500);
                }
            }

            //闪烁提示
            function flashTip($obj, num) {
                $obj.animate({'opacity': 1}, 300, function() {
                    $obj.animate({'opacity': .5}, 300, function() {
                        if(parseInt($obj.attr('flashNum')) == num) {
                            $obj.attr({'flashNum': 0});
                            return;
                        }
                        flashTip($obj, num);
                        $obj.attr({'flashNum': parseInt($obj.attr('flashNum'))+1});
                    });
                });
            }

            function getOnlyIndex(cId) {
                var num = 0;

                for(var i=0; i<cId.length; i++) {
                    if(!/\d+/.test(cId[i])) {
                        num += cId[i].charCodeAt();
                    }
                }
                return num;
            }

            function getClassName(state, controlId) {
                var className = [];

                switch (state) {
                    case 0://下线
                        className[0] = 'greyStateFocus';
                        className[1] = '已下线';
                        break;
                    case 1://聊天
                        className[0] = 'greenStateFocus';
                        className[1] = '智能聊天';
                        break;
                    case 2://监控
                        className[0] = 'yellowStateFocus';
                        className[1] = '被监控';
                        break;
                    case 3://接管
                    case 8://监控
                        className[0] = 'redStateFocus';
                        className[1] = '被云问客服'+ (controlId[0]||'') +'接管';
                        break;
                    case 4://挂起
                        className[0] = 'greyStateFocus';
                        className[1] = '已挂起';
                        break;
                    case 5://第三方客服
                    case 7://监控
                        className[0] = 'purpleStateFocus';
                        className[1] = '被第三方客服'+ (controlId[0]||'') +'接管';
                        break;
                }

                return className;
            }

            /*******监控*******/

            //获取被接管用户信息 -> s=gc
            function getTakeUsers(cId, $takeBtn, bool, data) {
                if(bool) {// 是接管
                    loadingBox.open();
                    MN_Base.request({
                        url: 'servlet/Monitor',
                        params: {
                            s: 'gc',
                            cId: cId,
                        },
                        callback: function(data) {
                            if(data.status) {
                                new jBox('Notice', {
                                    content: data.message,
                                    color: 'red',
                                    autoClose: '3000',
                                });
                            }else {
                                monitorName = data["msgList"][0]["msgList"][0]["ansUserName"];
                                renderTakeUsers(data, $takeBtn);
                                $('.chatCtn[cId="'+ cId +'"] .chatFootCtnOther').fadeOut(100);
                                $('.chatCtn[cId="'+ cId +'"] .chatFootCtn').fadeIn(100);
                                $('.chatCtn[cId="'+ cId +'"] .chatArea').focus();

                                //添加到接管框
                                $.each(data.msgList, function(key, value) {//加头像
                                    html = (value.askMsg?'<div class="custCtn"><span class="time">'+ value.time +'</span><div class="wordCtn"><img class="chatPic" src="'+ picSrc +'"><p class="name">'+ (value.askUserName || '') +'</p><p>'+ replaceFace(value.askMsg) +'</p><i class="tri"></i></div></div>':'')+(value.ansMsg?'<div class="servCtn"><span class="time">'+ (value.time || '') +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (value.ansUserName || '') +'</p><p>'+ replaceFace(value.ansMsg) +'</p><i class="tri"></i></div></div>':'');
                                    $('.timeTip').parent().hide();
                                    $('.chatCtn[cId="'+ cId +'"] .chatTalkCtn').append(html);
                                });
                                loadingBox.close();
                            }
                        },
                    });
                }else {// 是监控
                    renderTakeUsers(data, $takeBtn);
                }
            }

            var askUserName = '';
            var pageNoN = 1;
            var pageSize = 21;
            var newRobotName = '';
            //获取被监控用户信息 -> s=gw
            function getMonitorUsers(cId, $obj) {
                MN_Base.request({
                    url: 'servlet/Monitor',
                    params: {
                        s: 'gw',
                        cId: cId,
                    },
                    callback: function(data) {
                        askUserName = data.name;
                        pageNoN = 1;
                        $('.chatCtn').find('.chatTalkCtn').empty();
                        newRobotName = data.monitorId ? data.monitorId[0] : 'faqrobot';
                        findHistoryLog(cId,pageNoN,pageSize)
                        if(data.status) {
                            new jBox('Notice', {
                                content: data.message,
                                color: 'red',
                                autoClose: '3000',
                            });
                        }else {
                            getTakeUsers(cId, $obj, false, data);
                        }
                    },
                });
            }

            

            //渲染被接管用户
            function renderTakeUsers(data, $takeBtn) {
                if($takeBtn.is('.itemCtn')) {// 监控
                    MN_Base.request({
                        url: 'watch/findByClientId',
                        params: {
                            clientId: $takeBtn.attr('cId'),
                        },
                        callback: function(userMsg) {
                            var html = '',
                                cId = $takeBtn.attr('cId'),
                                bindData = null;//获取的聊天信息

                            //相应的被监控div暂时隐藏
                            var $monitorItemCtn = $('.longDiv .chatHeadCtn');
                            var $monitorCtn = $('.monitorCtn');

                            if(cId == $monitorItemCtn.attr('cId')) {
                                $monitorItemCtn.hide();
                            }

                            $.each($monitorCtn, function(i, itemObj) {
                                if(cId == $(this).attr('cId')) {
                                    $(this).slideUp();
                                }
                            });

                            $.each(data.msgList, function(key, obj) {
                                if(cId == obj.cId) {
                                    bindData = obj.msgList;
                                }
                            });


                            //设置头像
                            var $picItem = $('.rightBodyCtn .itemCtn[cId="'+cId+'"]'),
                                picSrc = '';

                            picSrc = $picItem.find('img').attr('src');


                            //智能聊天情况下将聊天记录加入数组中
                            if($takeBtn.hasClass('groupCtn1next')){
                                chatRecord[cId] = {};
                                chatRecord[cId].msgList = bindData || [];

                            }

                            //判断当前是否是被监控或被接管的状态，将聊天记录加入数组中
                            if($takeBtn.hasClass('groupCtn2next') || $takeBtn.hasClass('groupCtn3next')){
                                if(chatRecord[cId]){
                                    bindData = chatRecord[cId].msgList;
                                }
                            }

                            

                            if(false) {
                                //减少dom加载
                                if(bindData.length > 10){
                                    bindData = bindData.splice(bindData.length-10, bindData.length);
                                }
                                // if(){
                                //     html += '<div class="chatRecord">查看更多消息</div>'
                                // }
                                $.each(bindData, function(key, obj) {
                                    if(key != 'jboxContentAppended') {
                                        html += (
                                            obj.askMsg ? 
                                            '<div class="custCtn">'+
                                                '<span class="time">'+ (obj.time || '') +'</span>'+
                                                '<div class="wordCtn">'+
                                                    '<img class="chatPic" src="'+ picSrc +'">'+
                                                    '<p class="name">'+ (obj.askUserName || '') +'</p><p>'+ replaceFace(obj.askMsg || '') +'</p>'+
                                                    '<i class="tri"></i>'+
                                                '</div>'+
                                            '</div>'
                                            :''
                                        ) 
                                        + 
                                        (obj.ansMsg ?
                                            '<div class="servCtn'+ ((obj.ansUserName || '')?'':' _servCtn') +'">'+
                                                '<span class="time">'+ (obj.time || '') +'</span>'+
                                                '<div class="wordCtn">'+
                                                    '<img class="chatPic" src="images/robot.png"><p class="name">'+ (obj.ansUserName || '') +'</p>'+
                                                    '<div>'+ (obj.ansMsg || '') +'</div>'+
                                                    '<i class="tri"></i>'+
                                                '</div>'+
                                            '</div>'
                                            :''
                                        );
                                    }
                                });

                               
                            }

                            var pData = data;
                            // 邀请评价uuid
                            MN_Base.request({//先监控
                                url: 'Supervise/saveInformation',
                                params: {
                                    userId: loginUser.Id,
                                    cid: cId
                                },
                                callback: function(data) {
                                    var onlyIndex = getOnlyIndex(cId);//图片序号

                                    $('.longDiv').find('.chatHeadCtn').attr('cId',cId);
                                    $('.longDiv').find('.imgCtn').children('img').attr('src','images/animal'+ (onlyIndex%35 ? onlyIndex%35 : 35) +'.png');
                                    $('.longDiv').find('.userName').attr('title',userMsg.UserCard?userMsg.UserCard.Name:( (pData.name?pData.name:'') || '访客'));
                                    $('.longDiv').find('.userName').html(userMsg.UserCard?userMsg.UserCard.Name:( (pData.name?pData.name:'') || '访客'));
                                    $('.longDiv').find('.userSourceId').attr('title',getSource(pData.sourceId));
                                    $('.longDiv').find('.userSourceId').html(getSource(pData.sourceId));
                                    $('.longDiv').find('.userAddr').attr('title',pData.addr || '');
                                    $('.longDiv').find('.userAddr').html(pData.addr || '');
                                    $('.longDiv').find('.userIp').attr('title',pData.ip || '');
                                    $('.longDiv').find('.userIp').html(pData.ip || '');
                                    $('.longDiv').find('.takeLiveBtn').html(MN_Base.formatSecond(pData.onlineTime));
                                    $('.longDiv').find('.takeTimeBtnCtn').html(pData.loadTimes || '');
                                    $('.longDiv').fadeIn(100);

                                    $('.userMsgCtn').find('.chatBodyRightCtn').attr('cId',cId);
                                    $('.userMsgCtn').find('.nameCtn').children('input').val(userMsg.UserCard.Name || pData.name || '访客');
                                    $('.userMsgCtn').find('.nameCtn').children('input').attr('title',userMsg.UserCard.Name || pData.name || '访客');
                                    $('.userMsgCtn').find('.emailCtn').children('input').val(userMsg.UserCard.Email || '');
                                    $('.userMsgCtn').find('.emailCtn').children('input').attr('title',userMsg.UserCard.Email || '');
                                    $('.userMsgCtn').find('.addrCtn').children('input').val(userMsg.UserCard.Addr || '');
                                    $('.userMsgCtn').find('.addrCtn').children('input').attr('title',userMsg.UserCard.Addr || '');
                                    $('.userMsgCtn').find('.telNumCtn').children('input').val(userMsg.UserCard.TelNum || '');
                                    $('.userMsgCtn').find('.telNumCtn').children('input').attr('title',userMsg.UserCard.TelNum || '');
                                    $('.userMsgCtn').find('.qqCtn').children('input').val(userMsg.UserCard.Qq || '');
                                    $('.userMsgCtn').find('.qqCtn').children('input').attr(userMsg.UserCard.Qq || '');
                                    $('.userMsgCtn').find('.browerCtn').children('input').val(pData.broswer || '');
                                    $('.userMsgCtn').find('.browerCtn').children('input').attr('title',pData.broswer || '');
                                    $('.userMsgCtn').find('.sysCtn').children('input').val(pData.sysInfo || '');
                                    $('.userMsgCtn').find('.sysCtn').children('input').attr('title',pData.sysInfo || '');

                                    var ranNum = parseInt(Math.random()*100000),$chatCtn = $('.chatCtn');
                                    $('.chatCtn').attr('cId',cId);
                                    $('.chatCtn').find('.moodBtn').attr('richRanNum',ranNum);
                                    $('.chatCtn').find('.screenBtn').attr('richRanNum',ranNum+1);
                                    $('.chatCtn').find('.sendPicBtn').attr('richRanNum',ranNum+2);
                                    $('.chatCtn').find('.picBtn').attr('richRanNum',ranNum+3);
                                    $('.chatCtn').find('.fileBtn').attr('richRanNum',ranNum+4);
                                    $('.chatCtn').find('.commentBtn').attr('richRanNum',ranNum+5);
                                    $('.chatCtn').find('.commentBtn').attr('uuid',data.uuid);
                                    // $('.chatCtn').find('.chatTalkCtn').html(html || '<div class="custCtn"><span class="timeTip">当前无进行对话</span></div>');
                                    $('.chatCtn').fadeIn(100);

                                    var $imgBox = $('.upload_imgBox', $chatCtn);

                                    $imgBox.each(function() {
                                        //放大图片
                                        new jBox('Tooltip', {
                                            attach: $(this).parent(),
                                            title: $(this).attr('src').match(/\/(\d+\.jpg)/)[1],
                                            content: $(this).clone(),
                                            trigger: 'click',
                                            target: $('body'),
                                            overlay: true,
                                            position: {
                                                x: 'center',
                                                y: 'center',
                                            },
                                            animation: false,
                                            closeOnClick: 'body',
                                            closeOnEsc: true,
                                            zIndex: 100000,
                                        });
                                        //提示放大
                                        new jBox('Mouse', {
                                            attach: $(this).parent(),
                                            content: '点击放大',
                                            animation: false,
                                            closeOnClick: 'body',
                                            zIndex: 100000,
                                        });
                                    });

                                    //修改用户信息->邮箱/电话/QQ
                                    $('.chatMsgCtn input').unbind('blur').bind('blur',function() {
                                        if($(this).val() != $(this).attr('title')) {
                                            editUserMsg(decodeURI(cId), [$(this).attr('name'), $(this).val()], $(this), $chatCtn);
                                        }
                                    });

                                    //左侧滚动
                                    $('.chatBodyLeftCtnScroll', $chatCtn).mCustomScrollbar({
                                        theme: "dark-thin",
                                        autoHideScrollbar: true,
                                    });
                                    setTimeout(function() {
                                        $(window).trigger('resize');
                                        $('.chatBodyLeftCtnScroll', $chatCtn).mCustomScrollbar('scrollTo', 'bottom');
                                    }, 500);
                                    //右侧滚动
                                    $('.chatBodyRightCtn', $chatCtn).mCustomScrollbar({
                                        theme: "dark-thin",
                                    });

                                    $('[cId="'+ cId +'"]:not(.userMsg, .itemCtn)').fadeIn(100);

                                    loadingBox.close();
                                    takeEvent($monitorCtn, '', $chatCtn);
                                 },
                             });
                        }
                    });
                }
            }


            var historyLogArray = [];
            // 获取聊天记录
            function findHistoryLog(cId,pageNo,pageSize) {
                MN_Base.request({
                    url: './servlet/Monitor?s=ghc&cId='+ cId,
                    params: {
                        pageNo:pageNo || 1,
                        pageSize:pageSize || 21,
                    },
                    callback: function(data) {
                        if(data.status == 0) {
                            var html = '';  
                            var aa = {
                              "historyChatLog":[
                                {"DateTime":1511746399006,"question":"6",type:'text'},
                                {"DateTime":1511746397763,"question":"5",type:'text'},
                                {"DateTime":1511746396981,"question":"4",type:'text'},
                                {"DateTime":1511746396246,type:'text'},
                                {"DateTime":1511746396246,
                                "answer":"http://v4.faqrobot.net/upload/web/1507794753170749/20171114/29031510659835770.mp3",
                                "question":"3",
                                'type':'voice'
                                },
                                {"DateTime":1511746395376,"answer":"通过官网抢抢购页面购买我们的最新产品。","question":"23",type:'text'}
                              ],
                              "message":"成功","msgList":[],"pageNo":1,"pageSize":20,"status":0
                            }
                            // var newData = aa.historyChatLog.reverse()
                            var newData = data.historyChatLog.reverse();
                            if(newData.length > 0){
                                $('#chatRecordId').remove();
                                var array = [];
                                pageNoN = pageNoN + 1;
                                if(newData.length > 20){
                                    html += '<div class="chatRecord" id="chatRecordId">查看更多消息</div> <div class="chatId'+ pageNoN +'"></div>';
                                    historyLogArray.push(newData[20]);
                                    var logData = newData.slice(0);
                                    array = logData.splice(1,21);
                                }else{
                                    array = newData;
                                }

                                array.forEach(function(item) {
                                    html += historyLogTmpl(item,cId);
                                });
                            }

                            $('.chatCtn').find('.chatTalkCtn').prepend(html || '<div class="custCtn"><span class="timeTip">当前无进行对话</span></div>');
                            setTimeout(function() {
                                // $('.chatBodyLeftCtnScroll').mCustomScrollbar('update');
                                $('.chatBodyLeftCtnScroll').mCustomScrollbar('scrollTo', '.chatId'+Number(pageNoN-1),{
                                    scrollInertia:0
                                });
                            },200)
                            
                        }
                    }
                });
                
            }

            $('.chatTalkCtn').on('click','#chatRecordId',function() {
                findHistoryLog(clientIdN,pageNoN);
            })


            function historyLogTmpl(item,cId) {
                //设置头像
                var $picItem = $('.rightBodyCtn .itemCtn[cId="'+cId+'"]'),
                picSrc = '';
                picSrc = $picItem.find('img').attr('src');


                var newAnswer = item.answer;
                if(newAnswer && item.type){
                  if(item.type =='voice'){
                    newAnswer = '<p>若无法播放，请点击<a style="color:#008CEE" href="'+newAnswer+'" target="_blank">下载</a></p><br/><audio src="'+ newAnswer +'" controls="controls">您的浏览器不支持 audio 标签。</audio>'
                  }
                }
            

                return (
                    item.question && !newAnswer ? 
                    '<div class="custCtn">'+
                        '<span class="time">'+ (dataTime(item.DateTime) || '') +'</span>'+
                        '<div class="wordCtn">'+
                            '<img class="chatPic" src="'+ picSrc +'">'+
                            '<p class="name">'+ askUserName +'</p><p>'+ replaceFace(item.question || '') +'</p>'+
                            '<i class="tri"></i>'+
                        '</div>'+
                    '</div>'
                    :''
                ) 
                + 
                (newAnswer && !item.question?
                    '<div class="servCtn">'+
                        '<span class="time">'+ (dataTime(item.DateTime) || '') +'</span>'+
                        '<div class="wordCtn">'+
                            '<img class="chatPic" src="images/robot.png"><p class="name">'+ 'faqrobot' +'</p>'+
                            '<div>'+ (newAnswer || '') +'</div>'+
                            '<i class="tri"></i>'+
                        '</div>'+
                    '</div>'
                    :''
                )
                +
                (item.question && newAnswer ?
                '<div class="custCtn">'+
                    '<span class="time">'+ (dataTime(item.DateTime) || '') +'</span>'+
                    '<div class="wordCtn">'+
                        '<img class="chatPic" src="'+ picSrc +'">'+
                        '<p class="name">'+ askUserName +'</p><p>'+ replaceFace(item.question || '') +'</p>'+
                        '<i class="tri"></i>'+
                    '</div>'+
                '</div>'+

                '<div class="servCtn">'+
                    '<span class="time">'+ (dataTime(item.DateTime) || '') +'</span>'+
                    '<div class="wordCtn">'+
                        '<img class="chatPic" src="images/robot.png"><p class="name">'+ newRobotName +'</p>'+
                        '<div>'+ (newAnswer || '') +'</div>'+
                        '<i class="tri"></i>'+
                    '</div>'+
                '</div>'
                : '');

            }

            // 获取年月日
            function dataTime(data) {
                var date = new Date(data);
                this.year = date.getFullYear();
                this.month = date.getMonth() + 1;
                this.date = date.getDate();
                this.hours = date.getHours(); //获取当前小时数(0-23)
                this.miuutes = date.getMinutes(); //获取当前分钟数(0-59)
                this.seconds = date.getSeconds()
                var currentTime = this.year+'-'+this.month+'-'+this.date+ ' ' + (this.hours < 10 ? '0'+this.hours : this.hours ) + ':' + (this.miuutes < 10 ? '0'+ this.miuutes : this.miuutes);
                return currentTime
            }

            $(window).on('beforeunload unload', function() {
                var $itemCtn = $('.rightBodyCtn .itemCtn');

                $.each($itemCtn, function() {
                    var $this = $(this);

                    $.ajax({
                        url: encodeURI('/servlet/Monitor?s=rw&cId='+$this.attr('cId')),
                        type: 'post',
                        cache: false,//IE下有用
                    });
                    $.ajax({
                        url: encodeURI('/servlet/Monitor?s=rc&cId='+$this.attr('cId')),
                        type: 'post',
                        cache: false,//IE下有用
                    });

                    //释放监控
                    /*MN_Base.request({
                        params: {
                            s: 'rw',
                            cId: $this.attr('cId'),
                        },
                    });
                    //释放接管
                    MN_Base.request({
                        params: {
                            s: 'rc',
                            cId: $this.attr('cId'),
                        },
                    });*/
                });
            });

            //接管按钮事件
            $('body').on('click', '.takeBtn', function() {
                var $this = $(this),
                    cId = $this.parents('.chatCtn').attr('cId');
                $('.longDiv').find('.reasonCtn').fadeIn(100);
                getTakeUsers(cId, $this.parents('.chatCtn'), true);
            });

            // 展开闭合分组
            $('.rightBodyCtn').undelegate('.groupCtn','click').delegate('.groupCtn','click',function(){
                if($('.groupTri', this).is('.groupTriToB')) {// 展开
                    $(this).nextAll('.groupCtn'+ $(this).attr('sortIndex') +'next').stop(true).fadeIn(100);
                    $('.groupTri', this).removeClass('groupTriToB').addClass('groupTriToR');
                }else {
                    $(this).nextAll('.groupCtn'+ $(this).attr('sortIndex') +'next').stop(true).fadeOut(100);
                    $('.groupTri', this).removeClass('groupTriToR').addClass('groupTriToB');
                }
            });

            var clientIdN = '';
            //在线用户点击事件
            $('.rightBodyCtn').undelegate('.next','click').delegate('.next','click',function(){
                var cId = $(this).attr('cId');
                clientIdN = $(this).attr('cId');
                $curChat = $('.chatCtn[cId="'+ cId +'"]');
                $(this).addClass('itemCtnFocus').siblings().removeClass('itemCtnFocus');
                $('.onlineMask', this).removeAttr('style');
                $('.queTipRight', this).fadeOut(100);
                if($('.chatCtn[cId="'+ cId +'"]')[0]) {// 已经被监控
                    //$('[cId='+ cId +']:not(.userMsg, .itemCtn)').fadeIn(300);
                    $('.chatCtn[cId="'+ cId +'"] .chatBodyLeftCtnScroll').mCustomScrollbar('scrollTo', 'bottom');
                }else {
                    loadingBox.open();

                }
                getMonitorUsers(cId, $(this));
            });



            // sourceId对应文字
            function getSource(sourceId) {
                var msg = '';
                switch(sourceId) {
                    case 0:
                        msg = '网页';
                        break;
                    case 1:
                        msg = '微信';
                        break;
                    case 2:
                        msg = 'API';
                        break;
                    case 3:
                        msg = 'APP';
                        break;
                    case 4:
                        msg = '微博';
                        break;
                    case 5:
                        msg = '支付宝';
                        break;
                    case 6:
                        msg = 'H5';
                        break;
                    case 7:
                        msg = 'IOS';
                        break;
                    case 8:
                        msg = '安卓';
                        break;
                    case 9:
                        msg = '大屏';
                        break;
                    case 10:
                        msg = '云问网页';
                        break;
                    case 11:
                        msg = '钉钉';
                        break;
                    case 12:
                        msg = 'V4网页';
                        break;
                    case 100:
                        msg = '全部';
                        break;
                }
                return msg;
            }

            //修改访客信息 -> s=ui url = /watch/updateProperty
            function editUserMsg(clientId, editMsg, $this, $ctn) {
                if(editMsg[0]=='email' && !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(editMsg[1]))) {
				   if($this.val()){
					    new jBox('Notice', {
							content: '邮箱格式不正确',
							color: 'red',
							autoClose: '3000'
						});
						$this.focus();
				   }
				   return; 
                }
                if(editMsg[0]=='telNum' && !(/(^(\d{2,4}[-_－—]?)?\d{3,8}([-_－—]?\d{3,8})?([-_－—]?\d{1,7})?$)|(^0?1[35]\d{9}$)/.test(editMsg[1]))) {
                    if($this.val()){
						new jBox('Notice', {
							content: '电话格式不正确',
							color: 'red',
							autoClose: '3000'
						});
						$this.focus();
					}
					return;
                }
                if(editMsg[0]=='qq' && !(/^[1-9][0-9]{4,9}$/.test(editMsg[1]))) {
                    if($this.val()){
						new jBox('Notice', {
							content: 'QQ格式不正确',
							color: 'red',
							autoClose: '3000'
						});
						$this.focus();
					}
					return;
                }
                MN_Base.request({
                    url: 'servlet/Monitor',
                    params: {
                        s: 'ui',
                        cId: decodeURI(clientId.replace(/_-/g, '%')),
                        param: editMsg[0],
                        value: editMsg[1],
                    },
                    callback: function(data) {
                        editUserMsgCallback(data, $this, $ctn)
                    },
                });
            }

            //修改后的事件回调
            function editUserMsgCallback(data, $this, $ctn) {
                if(data.status) {
                    new jBox('Notice', {
                        content: $this.prev().text()+'修改失败',
                        color: 'red',
                        autoClose: '3000'
                    });
                    $this.addClass('inputFocus');
                }else {//正常
                    new jBox('Notice', {
                        content: $this.prev().text()+'修改'+data.message,
                        color: 'green',
                        autoClose: '3000',
                    });
                    $this.removeClass();
                    $('[cId="'+ $ctn.attr('cId') +'"]').find('.userName').text($('[cId="'+ $ctn.attr('cId') +'"] [name]').val());
                }
                $this.attr({'title': $this.val()});
            }

            //图片素材框
            var srcToolTip = new jBox('Tooltip', {
                content: '',
                trigger: 'click',
                target: $('body'),
                overlay: true,
                position: {
                    x: 'center',
                    y: 'center',
                },
                animation: false,
                closeOnClick: 'body',
            });

            //接管事件->sildeDown/关闭/滚动条/右侧缩放/输入框/只显示一个div/qq表情
            function takeEvent($monitorCtn, $itemCtn, $chatCtn) {
                $curInput = $('.chatArea', $chatCtn);
                $curChat = $chatCtn;
                $curMonitor = $monitorCtn;

                var cId = $chatCtn.attr('cId');

                $('.stopTakeCtn').unbind('click').bind('click', function() {
                    //从在线接管框中消除
                    releaseTake(cId, function(data) {
                        $('.longDiv').find('.reasonCtn').css("display","none");
                        $('.chatCtn[cId="'+ cId +'"] .chatFootCtnOther').fadeIn(100);
                        $('.chatCtn[cId="'+ cId +'"] .chatFootCtn').fadeOut(100);

                        //添加到接管框
                        $.each(data.msgList, function(key, value) {//加头像
                            html = (value.askMsg?'<div class="custCtn"><span class="time">'+ value.time +'</span><div class="wordCtn"><img class="chatPic" src="'+ picSrc +'"><p class="name">'+ (value.askUserName || '') +'</p><p>'+ replaceFace(value.askMsg) +'</p><i class="tri"></i></div></div>':'')+(value.ansMsg?'<div class="servCtn"><span class="time">'+ (value.time || '') +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (value.ansUserName || '') +'</p><p>'+ replaceFace(value.ansMsg) +'</p><i class="tri"></i></div></div>':'');
                            $('.chatCtn[cId="'+ cId +'"] .chatTalkCtn').append(html);

                        });
                    });
                });

                // 自动打开访客信息
                $('.userMsgBtn').trigger('click');
                $('.chatBodyRightCtn[cId="'+ cId +'"]').show().siblings().hide();


                $('.sendBtn').unbind('click').bind('click', function(){
                    //设置头像
                    var $picItem = $('.rightBodyCtn .itemCtn'),
                        picSrc = '';

                    $.each($picItem, function() {
                        if(cId == $(this).attr('cId')) {
                            picSrc = $(this).find('img').attr('src');
                        }
                    });

                    var content = $('.chatArea', $chatCtn).val().replace(/\n+/g, '');

                    //不通过接口获取(即时显示)
                    if(content) {//不能为空
                        $('.chatTalkCtn', $chatCtn).append('<div class="servCtn"><span class="time">'+ MN_Base.getFormatDate() +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (monitorName || '') +'</p><div>'+ replaceFace(content) +'</div><i class="tri"></i></div></div>');
                        $('.monitorTalkCtn', $monitorCtn).append('<div class="servCtn"><span class="time">'+ MN_Base.getFormatDate() +'</span><div class="wordCtn"><p class="name">'+ (monitorName || '') +'</p><div>'+ replaceFace(content) +'</div><i class="tri"></i></div></div>');

                        $('.chatArea', $chatCtn).val('');
                        $('.chatBodyLeftCtnScroll', $chatCtn).mCustomScrollbar('scrollTo', 'bottom');

                        sendMsg(cId, content);
                    }
                });

                //截屏
                $('.screenBtn', $curChat).unbind('click').bind('click',function(){
                    var captureRet = captureObj.DoCapture("pic.jpg", 0, 3, 0, 0, 0, 0);

                    if(!captureRet) {//没有安装控件
                        ShowDownLoad();
                    }
                });

                //选择发送图片还是文件
                $('.sendPicBtn', $curChat).on('click', function() {

                    sendPicBox.open();
                });

                //发送图片
                $('.picBtn', $chatCtn).on('click', function() {
                    MN_Base.request({
                        url: 'material/list',
                        params: {
                            type: '1',
                            pageSize: 10,
                            pageNo: 1,
                        },
                        callback: function(data) {
                            var html = '';

                            if(data.list[0]) {
                                for(var i=0; i<data.list.length; i++) {
                                    html += '<div class="show"><img src="/'+ data.list[i].Path +'"><div class="nameCtn"><p class="name">'+ data.list[i].Name +'</p></div></div>';
                                }


                                html = '<div class="bodyRight"><div class="bodyMiddle-ctn"><div class="bodyMiddle">'+ html +'</div></div><div class="pageNav-ctn"><div class="pageNav"><span class="prevPageChange pageChange"><i class="prevPage"></i></span><span class="pageNum"><label>'+ data.currentPage +'</label><span>/</span><label>'+ data.totlePages +'</label></span><span class="nextPageChange pageChange"><i class="nextPage"></i></span><input type="text"><p class="pageGo">跳转</p></div></div></div>';
                            }else {
                                html = '<div class="bodyRight"><div class="bodyMiddle-ctn"><div class="bodyMiddle" style="text-align: center;">没有更多了</div></div>';
                            }

                            srcToolTip.setContent(html).open();

                            $('.bodyRight').attr({'type': '1'});

                        },
                    });
                });

                //发送文件
                $('.fileBtn', $chatCtn).on('click', function() {
                    MN_Base.request({
                        url: 'material/list',
                        params: {
                            type: '4',
                            pageSize: 10,
                            pageNo: 1,
                        },
                        callback: function(data) {
                            var html = '';

                            if(data.list[0]) {
                                for(var i=0; i<data.list.length; i++) {
                                    html += '<div class="show"><img src="images/file_big.png" fileName="'+ data.list[i].Name +'" filePath="'+ data.list[i].Path +'"><div class="nameCtn"><p class="name">'+ data.list[i].Name +'</p></div></div>';
                                }


                                html = '<div class="bodyRight"><div class="bodyMiddle-ctn"><div class="bodyMiddle">'+ html +'</div></div><div class="pageNav-ctn"><div class="pageNav"><span class="prevPageChange pageChange"><i class="prevPage"></i></span><span class="pageNum"><label>'+ data.currentPage +'</label><span>/</span><label>'+ data.totlePages +'</label></span><span class="nextPageChange pageChange"><i class="nextPage"></i></span><input type="text"><p class="pageGo">跳转</p></div></div></div>';
                            }else {
                                html = '<div class="bodyRight"><div class="bodyMiddle-ctn"><div class="bodyMiddle" style="text-align: center;">没有更多了</div></div>';
                            }

                            srcToolTip.setContent(html).open();

                            $('.bodyRight').attr({'type': '4'});

                        },
                    });
                });

                //邀请评价
                $('.commentBtn', $chatCtn).unbind('click').bind('click', function() {
                    $('.chatArea', $chatCtn).val('<div class="RG_comment"><div class="RG_commentTip">请您对我们的人工服务进行<a><span class="RG_commentBtn" uuid="'+ $(this).attr('uuid') +'" style="border-bottom: 1px solid #019eef; cursor: pointer;">评价</span></a></div></div>');
                    $('.sendBtn', $chatCtn).trigger('click');
                });

                //键盘事件
                $(document).on('keyup', function(e) {
                    if(e.keyCode==13 && $(document.activeElement)[0] == $('.chatArea', $chatCtn)[0]) {//Enter键发送
                        $('.sendBtn', $chatCtn).trigger('click');
                    }
                });
            }

            //点击发送图片/文件
            $('body').on('click', '.show', function() {
                var $img = $(this).find('img'),
                    title = $img.next('.nameCtn').find('.name').text(),
                    $imgClone = $img.clone().addClass('imgBox');

                if(parseInt($('.bodyRight').attr('type')) == 4) {//发送文件
                    content = '<a href="/'+ $img.attr('filePath') +'" target="_blank"><span style="border-bottom: 1px solid #019eef;">点击下载文件 > '+ $img.attr('fileName') +'</span></a>';
                }else {
                    content = $imgClone[0].outerHTML;
                }

                $('.chatTalkCtn', $curChat).append('<div class="servCtn"><span class="time">'+ MN_Base.getFormatDate() +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (monitorName || '') +'</p><div>'+ content +'</div><i class="tri"></i></div></div>');


                $('.monitorTalkCtn', $curMonitor).append('<div class="servCtn"><span class="time">'+ MN_Base.getFormatDate() +'</span><div class="wordCtn"><p class="name">'+ (monitorName || '') +'</p><div>'+ content +'</div><i class="tri"></i></div></div>');

                $('.chatBodyLeftCtnScroll', $curChat).mCustomScrollbar('scrollTo', 'bottom');

                srcToolTip.close();

                sendMsg($curChat.attr('cId'), content);

                if(parseInt($('.bodyRight').attr('type')) == 1) {//发送图片
                    var $imgBox = $('.imgBox:last', $curChat);
                    //放大图片
                    new jBox('Tooltip', {
                        attach: $imgBox.parent(),
                        title: title,
                        content: content,
                        trigger: 'click',
                        target: $('body'),
                        overlay: true,
                        position: {
                            x: 'center',
                            y: 'center',
                        },
                        animation: false,
                        closeOnClick: 'body',
                        closeOnEsc: true,
                    });
                    //提示放大
                    new jBox('Mouse', {
                        attach: $imgBox.parent(),
                        content: '点击放大',
                        animation: false,
                        closeOnClick: 'body',
                    });
                }
            });

            //chat左右缩放
            $('body').on('click', '.chatShowBtn', function() {
                var $chatCtn = $(this).parents('.chatCtn'),
                    w = $chatCtn.width();

                if(!parseInt($(this).attr('isShow'))) {//当前处于隐藏状态
                    $(this).siblings('.chatBodyLeftCtn').animate({'width': w - 200}, 300);
                    $(this).siblings('.chatBodyRightCtn').animate({'width': 200}, 300);


                    $(this).text('隐藏').attr({'isShow': 1});
                    $(window).trigger('resize');
                }else {
                    $(this).siblings('.chatBodyLeftCtn').animate({'width': w}, 300);
                    $(this).siblings('.chatBodyRightCtn').animate({'width': 0}, 300);


                    $(this).text('编辑').attr({'isShow': 0});
                    $(window).trigger('resize');
                }
            });

            //切换素材页面
            $('body').on('click', '.prevPageChange, .nextPageChange, .pageGo',function(e) {
                var curNum = parseInt($('.pageNum label:first').text()),
                    maxNum = parseInt($('.pageNum label:last').text()),
                    type = $(this).parents('.bodyRight').attr('type');

                if($(this).is('.prevPageChange')) {//向前翻
                    if(curNum != 1) {
                        getImgSrc(curNum - 1, type);
                    }
                }

                if($(this).is('.nextPageChange')) {//向后翻
                    if(curNum != maxNum) {
                        getImgSrc(curNum + 1, type);
                    }
                }

                if($(this).is('.pageGo')) {//跳转页
                    var goNum = parseInt($(this).prev().val());

                    if(/\d+/g.test(goNum) && goNum>=1 && goNum<=maxNum) {
                        getImgSrc(goNum, type);
                    }else {
                        new jBox('Notice', {
                            content: '请输入正确的页码',
                            color: 'red',
                            autoClose: '3000',
                        });
                    }
                }
            });

            //转义表情
            function replaceFace(data, bool) {
                var src = 'src/yun/',
                    faceType = ['云问表情', 'png', 'png'],
                    face = {//表情包
                    '云问表情': [
                        ['[微笑]', '/::)'],
                        ['[色]', '/::B'],
                        ['[得意]', '/:8-)'],
                        ['[流泪]', '/::<'],
                        ['[害羞]', '/::$'],
                        ['[闭嘴]', '/::X'],
                        ['[发怒]', '/::@'],
                        ['[呲牙]', '/::D'],
                        ['[惊讶]', '/::O'],
                        ['[难过]', '/::('],
                        ['[酷]', '/::+'],
                        ['[愉快]', '/:,@-D'],
                        ['[流汗]', '/::L'],
                        ['[奋斗]', '/:,@f'],
                        ['[疑问]', '/:?'],
                        ['[晕]', '/:,@@'],
                        ['[委屈]', '/:P-(']
                    ],
                };
                for(var i in face) {
                    if(i == faceType[0]) {
                        for(var j=0; j<face[i].length; j++) {//考虑到含有特殊字符，不用正则
                            while(data.indexOf(face[i][j][0])+1) {
                                var index = data.indexOf(face[i][j][0]),
                                    len = face[i][j][0].length,
                                    str1 = data.substr(0, index),
                                    str2 = data.substr(index+len);
                                data = str1 + (bool?face[i][j][1]:('<img src="'+ src + j +'.'+ faceType[2] +'">')) + str2;
                            }
                            if(!bool) {
                                while(data.indexOf(face[i][j][1])+1) {
                                    var index = data.indexOf(face[i][j][1]),
                                        len = face[i][j][1].length,
                                        str1 = data.substr(0, index),
                                        str2 = data.substr(index+len);
                                    data = str1 +'<img src="'+ src + j +'.'+ faceType[2] +'">'+ str2;
                                }
                            }
                        }
                    }
                }
                return data;
            }

            //获取格式化时间
            function getFormatDate() {
                var today = new Date(),
                    year = today.getFullYear(),
                    month = MN_Base.addZero(today.getMonth() + 1),
                    date = MN_Base.addZero(today.getDate()),
                    hour = MN_Base.addZero(today.getHours()),
                    minute = MN_Base.addZero(today.getMinutes()),
                    second = MN_Base.addZero(today.getSeconds());

                return hour + ":" + minute + ":" + second;
            }

            //根据是否是Chrome新版本来控制下载不同的控件安装包
            function ShowDownLoad() {
                if(captureObj.IsNeedCrx()) {
                    ShowChromeInstallDownload();
                }else {
                    ShowIntallDownload();
                }
            }

            function ShowChromeInstallDownload() {
                var ret = confirm("您需要先下载Chrome扩展安装包进行安装，点击确定继续!");

                if(ret) {
                    window.location.href="http://www.ggniu.cn/download/CaptureInstallChrome.exe";
                }

            }

            function ShowIntallDownload() {
                var ret = confirm("您需要先下载控件进行安装，点击确定继续!");

                if(ret) {
                    window.location.href="http://www.ggniu.cn/download/CaptureInstall.exe";
                }
            }

            //请求图片/文件素材
            function getImgSrc(curNum, type) {

                MN_Base.request({
                    url: 'material/list',
                    params: {
                        type: type,
                        pageSize: 10,
                        pageNo: curNum,
                    },
                    callback: function(data) {
                        if(data.list[0]) {
                            var html = '';



                            for(var i=0; i<data.list.length; i++) {
                                var path = '/'+ data.list[i].Path;

                                if(type == '4') {
                                    path = 'images/file_big.png';
                                }
                                html += '<div class="show"><img src="'+ path +'" fileName="'+ data.list[i].Name +'" filePath="'+ data.list[i].Path +'"><div class="nameCtn"><p class="name">'+ data.list[i].Name +'</p></div></div>';
                            }

                            $('body .bodyMiddle').empty().append(html);
                            $('.pageNum label:first').text(data.currentPage);
                            $('.pageNum label:last').text(data.totlePages);
                        }

                    },
                });
            }

            //发送消息 -> s=sm
            function sendMsg(cId, content, callback, $ans) {
                var link = content.split('').reverse().join('').match(/[^'"]+(?=['"]=(crs|ferh))/g);
                if(link) {
                    if(link[0]) {
                        link = link[0].split('').reverse().join('');
                    }
                }
                var extraParams = {};
                if(link) {
                    if(/gif|jpeg|bmp|jpg|png/.test(content)) {// 图片
                        extraParams['img'] = link;
                    }else {// 其他
                        extraParams['file'] = link;
                    }
                }
                MN_Base.request({
                    url: 'servlet/Monitor',
                    type: 'post',
                    params: $.extend({
                        s: 'sm',
                        cId: decodeURI(cId.replace(/_-/g, '%')),
                        content: content,
                        sId: $ans&&$ans.attr('sId'),
                        aId: $ans&&$ans.attr('aId'),
                    }, extraParams),
                    callback: function(data) {
						if(data.status) {
							new jBox('Notice', {
								content: data.message,
								color: 'red',
								autoClose: '3000',
							});
						}else {
                            $('.chatCtn[cId="'+ cId +'"] .chatArea').focus()
                            if(callback) {
                                callback(data);
                            }

                            //将接管状态下的聊天内容存入chatRecord中
                            var msgList = [
                                {
                                    "ansMsg":data["msgList"][0]["msgList"][0]["ansMsg"],
                                    "ansUserId":data["msgList"][0]["msgList"][0]["ansUserId"],
                                    "ansUserName":data["msgList"][0]["msgList"][0]["ansUserName"],
                                    "askMsg":"",
                                    "askUserId":"",
                                    "askUserName":"",
                                    "time":data["msgList"][0]["msgList"][0]["time"]
                                }
                            ];
                            if(chatRecord[cId]){
                                chatRecord[cId].msgList = chatRecord[cId].msgList.concat(msgList);
                            }else{
                                chatRecord[cId] = {};
                                chatRecord[cId].msgList = msgList;
                            }
                        }
                    },
                });
            }

            //停止监控
            $('body').on('click', '.monitorCloseBtn', function() {
                var cId = $('.chatCtn').attr('cId');
                releaseMonitor(cId, function(data) {
                    $('[cId="'+ cId +'"]:not(.itemCtn)').fadeOut();
                });
            });

            //释放接管 -> s=rc
            function releaseTake(cId, callback) {
                loadingBox.open();
                MN_Base.request({
                    url: 'servlet/Monitor',
                    params: {
                        s: 'rc',
                        cId: cId,
                    },
                    callback: function(data) {
                        if(data.status) {
                            new jBox('Notice', {
                                content: data.message,
                                color: 'red',
                                autoClose: '3000',
                            });
                        }else {//正常
                            if(callback) {
                                callback(data);
                            }
                            loadingBox.close();
                        }
                    },
                });
            }

            //释放监控 -> s=rw
            function releaseMonitor(cId, callback) {
                loadingBox.open();
                MN_Base.request({
                    url: 'servlet/Monitor',
                    params: {
                        s: 'rw',
                        cId: decodeURI(cId.replace(/_-/g, '%')),
                    },
                    callback: function(data) {
                        if(data.status) {
                            new jBox('Notice', {
                                content: data.message,
                                color: 'red',
                                autoClose: '3000',
                            });
                        }else {//正常
                            if(callback) {
                                callback(data);
                            }
                            loadingBox.close();
                        }
                    },
                });
            }

        }
    }
});
