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
        groupId = '';//getQueList 传的参数

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
        animation: 'zoomOut',
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
                    animation: 'zoomOut',
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
            $('.rightBodyCtn').height($('.body').outerHeight() - $('.rightHeadCtn').outerHeight());
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
        /*//增加code
         MN_Base.request({
         url: 'tipHelp/add',
         params: {
         code: 'artiMonitorHelp',
         webId: -1,
         },
         callback: function(data) {
         if(data.status) {//!=0 旧

         }else {//=0 新

         }
         },
         });*/

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

        //检查code
        MN_Base.request({
            url: 'tipHelp/check',
            params: {
                code: 'artiMonitorHelp',
            },
            callback: function(data) {
                if(data.status) {//旧
                    runStep2();
                }else {//新
                    loadingBox.close();
                    $('.body').animate({'opacity': 1});
                    $(window).trigger('resize');
                    //1
                    $('body').append('<div class="tipStep1 tipStep" data-step="1" data-intro="现在跟我一起学习如何使用人工监控吧！"></div>');
                    //2
                    $('.rightBodyCtn').append('<div class="tipStep2 tipStep" data-step="2" data-intro="这里是当前在线的用户，您可以通过点击当前用户进行监控和查看用户信息"></div>');
                    //3
                    $('.midBodyCtn').append('<div class="tipStep3 tipStep" data-step="3" data-intro="点击监控或接管按钮来监控和接管该用户"></div>');
                    //4
                    $('.midHeadRightCtn').append('<div class="tipStep4 tipStep" data-step="4" data-intro="被监控用户将出现在这里，点击该用户查看聊天信息"></div>');
                    //5
                    $('.midBodyLeftCtn').append('<div class="tipStep5 tipStep" data-step="5" data-intro="被监控用户的聊天内容会即时刷新，点击接管按钮接管该用户"></div>');
                    //6
                    $('.midBodyLeftCtn').append('<div class="tipStep6 tipStep" data-step="6" data-intro="点击编辑按钮，弹出用户信息框，在此编辑用户的信息，信息即时保存"></div>');
                    //7
                    $('.midBodyLeftCtn').append('<div class="tipStep7Ctn"><div class="tipStep7 tipStep" data-step="7" data-intro="您可以通过点击停止接管按钮来释放当前会话，用户回到监控列表"></div></div>');
                    //8
                    $('.knowBodyCtn').append('<div class="tipStep8 tipStep" data-step="8" data-intro="这里是快捷回复的内容，你可以通过新增回复按钮进行添加快捷回复"></div>');
                    //9
                    $('.knowBodyCtn').append('<div class="tipStep9 tipStep" data-step="9" data-intro="这里是后台知识库的内容，你可以通过不同的回复方式进行回复来访者"></div>');
                    //10
                    $('body').append('<div class="tipStep10 tipStep" data-step="10" data-intro="您已经完成新手引导的学习，开始体验吧！"></div>');

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

                        runStep2();
                    }).oncomplete(function() {//正常完成
                        $('.tipStep').remove();
                        $('.tipStep7Ctn').remove();

                        runStep2();
                    }).onchange(function(obj) {//已完成当前一步
                        var curNum = parseInt($(obj).attr('class').match(/\d+/)[0]);//当前的下标

                        $('.tipStep'+ (curNum-1)).hide();//隐藏前一个
                        $('.tipStep'+ (curNum+1)).hide();//隐藏后一个
                        $(obj).show();//显示当前
                    });
                }
            },
        });

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
                                    animation: 'zoomOut',
                                    closeOnClick: 'body',
                                    closeOnEsc: true,
                                });
                                //提示放大
                                new jBox('Mouse', {
                                    attach: $imgBox.parent(),
                                    content: '点击放大',
                                    animation: 'zoomOut',
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


            //左边整体滚动条
            $('.leftCtn').mCustomScrollbar({
                theme: "light-thin",
                autoHideScrollbar: true,

            });


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
                theme:"dark-thin",
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
                animation: 'zoomOut',
                closeOnClick: 'body',
            });

            //搜索提示
            new jBox('Mouse', {
                attach: $('.search'),
                content: '搜索',
                animation: 'zoomOut',
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
                animation: 'zoomOut',
                closeOnClick: 'body',
            });

            //上传图片
            uploader = WebUploader.create({
                server: '../../../material/jQueryFileUpload?type=1',
                swf: 'js/Uploader.swf',
                pick: $('.cosPicBtn'),
                duplicate: true,
                auto: true,
            });

            //上传文件
            uploader2 = WebUploader.create({
                server: '../../../material/jQueryFileUpload?type=4',
                swf: 'js/Uploader.swf',
                pick: $('.cosExlBtn'),
                duplicate: true,
                auto: true,
            });

            //开始上传 图片
            uploader.on( 'uploadStart', function( file ) {
                sendPicBox.close();

                $('.chatTalkCtn', $curChat).append('<div id="'+ file.id +'" class="upFileCtn"><p class="upFileName">'+ file.name +'</p><div class="upFileOuter"><span class="upFileInner"></span></div></div>');

                $('.chatBodyLeftCtnScroll', $curChat).mCustomScrollbar('scrollTo', 'bottom');
            });

            //上传中 图片
            uploader.on( 'uploadProgress', function( file, percentage ) {
                $('#'+ file.id).find('.upFileInner').css({'width': percentage*100 +'%'});
            });

            //获取服务端返回的数据 图片
            uploader.on( 'uploadAccept', function( object, data ) {
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

                    $('.chatTalkCtn', $curChat).append('<div class="servCtn"><span class="time">'+ MN_Base.getFormatDate() +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (webConfig.RobotName || '') +'</p><div><img class="imgBox" src="'+ data.files[0].url +'"></div><i class="tri"></i></div></div>');


                    sendMsg($curChat.attr('cId'), '<img src="'+ data.files[0].url +'">');
                    $('.chatBodyLeftCtnScroll', $curChat).mCustomScrollbar('scrollTo', 'bottom');

                    var $imgBox = $('.imgBox:last', $curChat);
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
                        animation: 'zoomOut',
                        closeOnClick: 'body',
                        closeOnEsc: true,
                    });
                    //提示放大
                    new jBox('Mouse', {
                        attach: $imgBox.parent(),
                        content: '点击放大',
                        animation: 'zoomOut',
                        closeOnClick: 'body',
                    });
                }
            });

            //开始上传 文件
            uploader2.on( 'uploadStart', function( file ) {
                sendPicBox.close();

                $('.chatTalkCtn', $curChat).append('<div id="'+ file.id +'" class="upFileCtn"><p class="upFileName">'+ file.name +'</p><div class="upFileOuter"><span class="upFileInner"></span></div></div>');

                $('.chatBodyLeftCtnScroll', $curChat).mCustomScrollbar('scrollTo', 'bottom');
            });

            //上传中 文件
            uploader2.on( 'uploadProgress', function( file, percentage ) {
                $('#'+ file.id).find('.upFileInner').css({'width': percentage*100 +'%'});
            });

            //获取服务端返回的数据 文件
            uploader2.on( 'uploadAccept', function( object, data ) {
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

                    $('.chatTalkCtn', $curChat).append('<div class="servCtn"><span class="time">'+ MN_Base.getFormatDate() +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (webConfig.RobotName || '') +'</p><div><a href="'+ data.files[0].url +'" target="_blank"><span style="border-bottom: 1px solid #019eef;">点击下载文件 > '+ data.files[0].name +'</span></a></div><i class="tri"></i></div></div>');

                    sendMsg($curChat.attr('cId'), '<a href="'+ data.files[0].url +'" target="_blank"><span style="border-bottom: 1px solid #019eef;">点击下载文件 > '+ data.files[0].name +'</span></a>');
                    $('.chatBodyLeftCtnScroll', $curChat).mCustomScrollbar('scrollTo', 'bottom');
                }
            });

            /******jBox结束*******/




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
                                Id: $(this).attr('Id'),
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
                    params: {

                    },
                    callback: function(data) {
                        var isExist = [];//是否存在该问题分类

                        for(var i=0; i<data.list.length; i++) {
                            isExist[i] = 1;
                            if(data.list[i].Name == 'onlyGroupName') {//存在直接获取
                                isExist[i] = 0;
                                getQuickAns(data.list[i].Id);//获取快捷回复列表
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
                                        getQuickAns(data.Classes.Id);//获取快捷回复列表

                                    }
                                },
                            });
                        }
                    },
                });
            }

            //快捷回复分组下的答案 -> url = '/QuickReply/getAllByGroupId'
            function getQuickAns(groupId) {
                MN_Base.request({
                    url: 'QuickReply/getAllByGroupId',
                    params: {
                        groupId: groupId,
                    },
                    callback: function(data) {
                        //渲染快捷回复
                        var html = '',
                            ranNum = parseInt(Math.random()*100000);

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
                                animation: 'zoomOut',
                                closeOnClick: 'body',
                            });
                            new jBox('Mouse', {
                                maxWidth: '200px',
                                attach: $quickRanNum.prev(),
                                content: '删除该回复',
                                animation: 'zoomOut',
                                closeOnClick: 'body',
                            });
                        });
                    },
                });
            }

            //新增回复 -> url = '/QuickReply/addReply'
            $('.editSave').on('click', function() {
                MN_Base.request({
                    url: 'QuickReply/addReply',
                    params: {
                        groupId: $('.quickWordCtn').attr('groupId'),
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
                $('.editAskCtn').fadeIn(300);
                $('.editAskArea').focus();
            })

            //关闭新增回答
            $('.editCancle').on('click', function() {
                $('.editAskCtn').fadeOut(300);
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
                            html += '<div class="item"><i class="tri"></i><div class="ansCtn"><div class="ans"><span class="ansIndex">答案：</span><span class="ansChildren">'+ (data.questionList[i].Answer || '') +'</span><span class="edit">编辑</span><span class="reply">回复</span></div></div><div class="cosAskMaskCtn"><span class="look">查看详细</span><div class="cosAskMask"></div></div></div>';
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
                            answer = '<div class="item"><i class="tri"></i><div class="ansCtn">'+ answer +'</div><div class="cosAskMaskCtn"><span class="look">查看详细</span><div class="cosAskMask"></div></div></div>';
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
            var timer = setInterval(getOnlineUsers, 1000);

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

                if($takeUsers.eq(0)[0]) {
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
                        needAdd = true;

                    var className = getClassName(onlineUser.state, onlineUser.controlId),
                        groupCtn = '';

                    //更新文字状态
                    for(var j=0; j<$onlineUsers.length; j++) {
                        var $onlineUser = $onlineUsers.eq(j),
                            cIdAttr = $onlineUser.attr('cId');

                        //更新
                        if(cIdData == cIdAttr) {
                            if(onlineUser.state == 0) {//下线状态不再显示
                                $onlineUser.remove();
                            }

                            $onlineUser.find('.state').removeClass().addClass('state '+ className[0]).text(className[1]);
                            $onlineUser.attr({'ranNum': ranNum});
                            $onlineUser.attr({'state': onlineUser.state});

                            //更新信息
                            var $userBox = $('#'+ $onlineUser.attr('boxId'));
                            $userBox.find('.userLoadTimes').text('第'+ onlineUser.loadTimes +'次');

                            $userBox.find('.userLiveTime').text(onlineUser.onlineTime);
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
                            var $itemCtn = $('.rightBodyCtn .itemCtn[cId='+ cIdAttr +']');
                            $itemCtn.removeClass('groupCtn1next groupCtn2next groupCtn3next groupCtn4next').addClass(groupCtn +'next');

                            $('.groupCtn').each(function() {
                                if($('.groupTri', this).is('.groupTriToB')) {// 展开
                                    $(this).nextAll('.groupCtn'+ $(this).attr('sortIndex') +'next').fadeIn(300);
                                }else {
                                    $(this).nextAll('.groupCtn'+ $(this).attr('sortIndex') +'next').fadeOut(300);
                                }
                            })
                        }
                    }

                    //更新姓名
                    var $monitorItemCtn = $('.longDiv .chatHeadCtn');

                    $.each($monitorItemCtn, function(i, itemObj) {
                        if(cIdData == $(this).attr('cId')) {
                            $(this).find('.custMsgCtn').text(MN_Base.addDots(onlineUser.name, 3));
                        }
                    });

                    //更新是否可以点击状态、销毁
                    var $userMsg = $('.userMsg');
                    for(var j=0; j<$userMsg.length; j++) {
                        var $this = $userMsg.eq(j);
                        if(cIdData == $this.attr('cId')) {
                            //更新姓名
                            $this.find('.userHeadCtn span').eq(0).text(onlineUser.name);
                            //更新按钮样式(是否能点击)
                            switch (onlineUser.state) {
                                case 0://下线
                                case 1://智能聊天
                                case 4://挂起

                                    //客户刷新聊天界面(销毁对应)
                                    var $monitorItemCtn = $('.longDiv .chatHeadCtn');
                                    var $monitorCtn = $('.monitorCtn');
                                    var $takeItemCtn = $('.chatBodyRightCtn');
                                    var $chatCtn = $('.chatCtn');
                                    $.each($monitorItemCtn, function(i, itemObj) {
                                        if(cIdData == $(this).attr('cId')) {
                                            $(this).fadeOut(function() {
                                                $(this).remove();
                                            });
                                        }
                                    });
                                    $.each($monitorCtn, function(i, itemObj) {
                                        if(cIdData == $(this).attr('cId')) {
                                            $(this).slideUp(function() {
                                                $(this).remove();
                                            });
                                        }
                                    });
                                    $.each($takeItemCtn, function(i, itemObj) {
                                        if(cIdData == $(this).attr('cId')) {
                                            $(this).slideUp(function() {
                                                $(this).remove();
                                            });
                                        }
                                    });
                                    $.each($chatCtn, function(j, chatObj) {
                                        if(cIdData == $(this).attr('cId')) {
                                            $(this).slideUp(function() {
                                                $(this).remove();
                                            });
                                        }
                                    });
                                    break;
                                case 2://被监控
                                    //接管自动转为监控(销毁对应)
                                    var $monitorCtn = $('.monitorCtn');
                                    var $takeItemCtn = $('.onlineTalk .itemCtn');
                                    var $chatCtn = $('.chatCtn');

                                    $.each($monitorCtn, function(i, itemObj) {
                                        if(cIdData == $(this).attr('cId')) {
                                            $(this).fadeIn(300);
                                        }
                                    });
                                    $.each($takeItemCtn, function(i, itemObj) {
                                        if(cIdData == $(this).attr('cId')) {
                                            $(this).fadeOut(1000, function() {
                                                $(this).remove();
                                            });
                                        }
                                    });
                                    $.each($chatCtn, function(j, chatObj) {
                                        if(cIdData == $(this).attr('cId')) {
                                            $('.chatFootCtnOther', this).fadeIn(300);
                                            $('.chatFootCtn', this).fadeOut(300);
                                        }
                                    });
                                case 3://与云问客服聊天// #1
                                case 5://与第三方客服聊天
                                case 7://与第三方客服聊天，同时被监控着
                                case 8://与云问客服聊天，同时被监控着
                                    if(onlineUser.monitorId) {
                                        if(onlineUser.monitorId[0]) {
                                            $.each(onlineUser.monitorId, function(key, val) {
                                                if(loginUser.UserName == val) {// #1
                                                }
                                            });
                                        }
                                    }

                                    if(onlineUser.controlId) {
                                        if(onlineUser.controlId[0]) {
                                            $.each(onlineUser.controlId, function(key, val) {
                                                if(loginUser.UserName == val) {// #1
                                                }
                                            });
                                        }
                                    }
                                    break;
                            }
                        }

                        var $onlineUser = $onlineUsers.eq(j),
                            cIdAttr = $onlineUser.attr('cId');

                        //更新
                        if(cIdData == cIdAttr) {
                            $onlineUser.find('.state').text(className[1]);
                            $onlineUser.attr({'ranNum': ranNum});
                            $onlineUser.attr({'state': onlineUser.state});

                            //小状态的颜色控制
                            $onlineUser.find('.state').removeClass().addClass('state '+ className[0]);

                            //更新信息
                            var $userBox = $('#'+ $onlineUser.attr('boxId'));
                            $userBox.find('.userLoadTimes').text('第'+ onlineUser.loadTimes +'次');
                            $userBox.find('.userLiveTime').text(MN_Base.formatSecond(onlineUser.onlineTime));

                            needAdd = false;

                            //chat在线时长
                            var $chatCtn = $('.chatCtn');

                            $chatCtn.each(function() {
                                if(cIdData == $(this).attr('cId')) {
                                    $(this).find('.takeLiveBtn').text(MN_Base.formatSecond(onlineUser.onlineTime));
                                }
                            });
                        }

                    }

                    //新增
                    if(needAdd) {
                        var onlyIndex = getOnlyIndex(cIdData);//图片序号
                        if(onlineUser.state) {//!=0 下线状态不再显示
                            html = '<div class="'+ groupCtn +'next itemCtn" cId="'+ cIdData +'" ranNum="'+ ranNum +'" state="'+ onlineUser.state +'" isClick="0" artiNum="0" defaultSortNum="'+ onlyIndex +'" stateSortNum="0" msgSortNum="0"><div class="onlineMask" flashNum="0"></div><div class="item"><div class="queTipLeft"><div class="imgCtn"><img src="images/animal'+ (onlyIndex%35 ? onlyIndex%35 : 35) +'.png"></div><div class="userTxtCtn"><div class="ipMsgCtn">'+ (getSource(onlineUser.sourceId)=='网页'?'IP：'+onlineUser.ip||'':getSource(onlineUser.sourceId)+'客户') +'</div><div class="state '+ className[0] +'">'+ className[1] +'</div></div></div><div class="queTipRight"><div class="queTime">刚刚收到</div><div class="queNum">0</div></div></div></div>';

                            var $userMsg = $('<div class="userMsg" cId="'+ cIdData +'"><div class="userHeadCtn"><span>'+ (onlineUser.name || '') +'</span><span class="userAddr">'+ (onlineUser.addr || '') +'</span></div><div class="userBodyCtn"><div class="userItem"><span>IP：</span><span class="userIp userWord">'+ (onlineUser.ip || '') +'</span></div><div class="userItem"><span>登录次数：</span><span class="userLoadTimes userWord">第'+ (onlineUser.loadTimes || '') +'次</span></div><div class="userItem"><span>系统：</span><span class="userSystem userWord">'+ (onlineUser.sysInfo || '') +'</span></div><div class="userItem"><span>浏览器：</span><span class="userBrower userWord">'+ (onlineUser.broswer || '') +'</span></div><div class="userItem"><span>在线时长：</span><span class="userLiveTime userWord">'+ (onlineUser.onlineTime || '') +'</span></div><div class="userItem"><span>停留页面：</span><span class="userAim userWord">在线咨询</span></div></div><div class="userFootCtn"><input class="takeBtn"type="button"value="接管"><input class="monitorBtn"type="button"value="监控"></div></div>');

                            if(groupCtn) {
                                $('.rightBodyCtn .mCSB_container'+ (groupCtn? ' .'+ groupCtn +'next':'')).after(html);

                            }else {
                                $('.rightBodyCtn .mCSB_container').append(html);
                            }
                            $('[cId='+ cIdData +']').hide();
                            $('body').append($userMsg);

                            /*//找出当前
                             $onlineUsers = $('.rightBodyCtn .itemCtn');
                             $onlineUsers.each(function(i, dom) {
                             if($(dom).attr('cId') == ''+ cIdData) {
                             var $ipMsgCtn = $('.ipMsgCtn', $(this));
                             switch(onlineUser.sourceId) {
                             case 0://网页
                             break;
                             case 1://微信
                             $ipMsgCtn.text('微信客户');
                             break;
                             case 4://微博
                             $ipMsgCtn.text('微博客户');
                             break;
                             case 5://支付宝
                             $ipMsgCtn.text('支付宝客户');
                             break;
                             }
                             }
                             });*/
                        }

                    }
                }

                //转人工
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
                        $.each($chatCtn, function(index, obj) {
                            if(encodeURI(data.msgList[i].cId).replace(/%/g, '_-') == $(obj).attr('cId')) {//数据==监控头
                                //被接管状态不再智能回复(只可跟客服聊天)
                                for(var m=0; m<data.onlineUsers.length; m++) {
                                    if(encodeURI(data.msgList[i].cId).replace(/%/g, '_-') == encodeURI(data.onlineUsers[m].cId).replace(/%/g, '_-')) {
                                        //刷新接管框的信息
                                        var msgList = data.msgList[i].msgList,
                                            html = '';

                                        //问题推荐答案(每次以最后一个为准)
                                        for(var k=0; k<msgList.length; k++) {
                                            if(k == msgList.length-1) {
                                                getQues(data.msgList[i].msgList[k].askMsg, $('.knowToolBody:last'), groupId);
                                            }
                                        }


                                        //设置头像
                                        var $picItem = $('.rightBodyCtn .itemCtn'),
                                            picSrc = '';

                                        $.each($picItem, function() {
                                            if(encodeURI(data.msgList[i].cId).replace(/%/g, '_-')  == $(this).attr('cId')) {
                                                picSrc = $(this).find('img').attr('src');
                                            }
                                        });

                                        //添加到接管框
                                        $.each(msgList, function(key, value) {//加头像
                                            html = (value.askMsg?'<div class="custCtn"><span class="time">'+ value.time +'</span><div class="wordCtn"><img class="chatPic" src="'+ picSrc +'"><p class="name">'+ (value.askUserName || '') +'</p><p>'+ replaceFace(value.askMsg) +'</p><i class="tri"></i></div></div>':'')+(value.ansMsg?'<div class="servCtn'+ ((value.ansUserName || '')?'':' _servCtn') +'"><span class="time">'+ (value.time || '') +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (value.ansUserName || '') +'</p><p>'+ replaceFace(value.ansMsg) +'</p><i class="tri"></i></div></div>':'');

                                            if(value.askUserId != $('.itemCtnFocus').attr('cId')) {// 如果是当前的话，那就不累计
                                                // 累计未读消息数和时间
                                                var $queTipRight = $('.itemCtn[cId='+ value.askUserId +'] .queTipRight');
                                                var $queNum = $('.itemCtn[cId='+ value.askUserId +'] .queNum');
                                                var $queTime = $('.itemCtn[cId='+ value.askUserId +'] .queTime');
                                                $queNum.text((+$queNum.text())+1);
                                                if(+$queNum.text()) {
                                                    $queTipRight.fadeIn(300);
                                                }else {
                                                    $queTipRight.fadeOut(300);
                                                }
                                                $queTime.text(getFormatDate());
                                            }

                                            $.each($chatCtn, function() {
                                                if(data.msgList[i].cId == $(this).attr('cId')) {
                                                    $('.chatTalkCtn', $(this)).append(html);
                                                    $('.chatBodyLeftCtnScroll', $(this)).mCustomScrollbar('scrollTo', 'bottom');

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
                                                            animation: 'zoomOut',
                                                            closeOnClick: 'body',
                                                            closeOnEsc: true,
                                                        });
                                                        //提示放大
                                                        new jBox('Mouse', {
                                                            attach: $imgBox.parent(),
                                                            content: '点击放大',
                                                            animation: 'zoomOut',
                                                            closeOnClick: 'body',
                                                        });
                                                    }
                                                }

                                            });

                                        });
                                    }
                                }


                            }
                        });

                    }


                }

                // 更新分组信息
                $.each($('.groupCtn'), function(i, obj) {
                    var sortIndex = $(obj).attr('sortIndex');
                    $.each($('.rightBodyCtn .itemCtn[cId]'), function(j, itemCtnObj) {
                        //console.log($(itemCtnObj).prevAll('.groupCtn').eq(0))
                        if($(itemCtnObj).prevAll('.groupCtn').eq(0).attr('class').replace(/[^\d]*/g, '') != $(itemCtnObj).attr('class').replace(/[^\d]*/g, '')) {
                            $(obj).after($('.groupCtn'+ sortIndex +'next'));
                        }
                    })

                    var nextAllLen = $(obj).nextAll('.groupCtn'+ sortIndex +'next').length;

                    $('.queNum', obj).text(nextAllLen);
                    if(nextAllLen) {
                        $('.queTipRight', obj).fadeIn(300);
                    }else {
                        $('.queTipRight', obj).fadeOut(300);
                    }
                })

                //未读消息个数
                var $itemCtn = $('.rightCtn .itemCtn');

                //被监控时
                var $monitorCtn = $('.monitorCtn');

                $.each($monitorCtn, function(i, monitorObj) {
                    $.each($itemCtn, function(j, itemObj) {
                        if($(monitorObj).attr('cId') == $(itemObj).attr('cId') && $(itemObj).attr('state') == 2) {
                            if($(monitorObj).parents('.jBox-wrapper').css('display') != 'block') {
                                var $queNum = $(itemObj).find('.queNum');
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

                $.each($chatCtn, function(i, chatObj) {
                    $.each($itemCtn, function(j, itemObj) {
                        if($(chatObj).attr('cId') == $(itemObj).attr('cId') && $(itemObj).attr('state') == 3) {


                            if($(chatObj).attr('cId') != $curInput.parents('.chatCtn').attr('cId')) {
                                var $queNum = $(itemObj).find('.queNum');
                                var num = 0;

                                for(var i=0; i<data.msgList.length; i++) {
                                    if(encodeURI(data.msgList[i].cId).replace(/%/g, '_-') == $(itemObj).attr('cId')) {
                                        num = data.msgList[i].msgList.length;
                                        for(var m=0; m<data.msgList[i].msgList.length; m++) {
                                            if(m == data.msgList[i].msgList.length - 1) {
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
                                    $queNum.show().text(parseInt($queNum.text() || 0) + num);
                                }
                            }else {
                                $(itemObj).find('.queNum').hide().text('');
                            }

                            //
                            var $queNum = $(itemObj).find('.queNum');
                            var num = 0;

                            for(var i=0; i<data.msgList.length; i++) {
                                if(encodeURI(data.msgList[i].cId).replace(/%/g, '_-') == $(itemObj).attr('cId')) {
                                    num = data.msgList[i].msgList.length;
                                    for(var m=0; m<data.msgList[i].msgList.length; m++) {
                                        if(m == data.msgList[i].msgList.length - 1) {
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

                            //
                        }
                    });
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
                                renderTakeUsers(data, $takeBtn);
                                $('.chatCtn[cId='+ cId +'] .chatFootCtnOther').fadeOut(300);
                                $('.chatCtn[cId='+ cId +'] .chatFootCtn').fadeIn(300);
                                $('.chatCtn[cId='+ cId +'] .chatArea').focus();

                                //添加到接管框
                                $.each(data.msgList, function(key, value) {//加头像
                                    html = (value.askMsg?'<div class="custCtn"><span class="time">'+ value.time +'</span><div class="wordCtn"><img class="chatPic" src="'+ picSrc +'"><p class="name">'+ (value.askUserName || '') +'</p><p>'+ replaceFace(value.askMsg) +'</p><i class="tri"></i></div></div>':'')+(value.ansMsg?'<div class="servCtn"><span class="time">'+ (value.time || '') +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (value.ansUserName || '') +'</p><p>'+ replaceFace(value.ansMsg) +'</p><i class="tri"></i></div></div>':'');
                                    $('.chatCtn[cId='+ cId +'] .chatTalkCtn').append(html);
                                });
                                loadingBox.close();
                            }
                        },
                    });
                }else {// 是监控
                    renderTakeUsers(data, $takeBtn);
                }
            }

            //获取被监控用户信息 -> s=gw
            function getMonitorUsers(cId, $obj) {
                MN_Base.request({
                    url: 'servlet/Monitor',
                    params: {
                        s: 'gw',
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
                            getTakeUsers(cId, $obj, false, data);
                        }
                    },
                });
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

                getTakeUsers(cId, $this.parents('.chatCtn'), true);
            });

            // 展开闭合分组
            $('.rightBodyCtn').on('click', '.groupCtn', function() {
                if($('.groupTri', this).is('.groupTriToB')) {// 展开
                    $(this).nextAll('.groupCtn'+ $(this).attr('sortIndex') +'next').stop(true).fadeIn(300);
                    $('.groupTri', this).removeClass('groupTriToB').addClass('groupTriToR');
                }else {
                    $(this).nextAll('.groupCtn'+ $(this).attr('sortIndex') +'next').stop(true).fadeOut(300);
                    $('.groupTri', this).removeClass('groupTriToR').addClass('groupTriToB');
                }
            });

            //在线用户点击事件
            $('.rightBodyCtn').on('click', '.itemCtn:not(.groupCtn)', function() {
                var cId = $(this).attr('cId');
                $curChat = $('.chatCtn[cId='+ cId +']');
                $(this).addClass('itemCtnFocus').siblings().removeClass('itemCtnFocus');
                $('.onlineMask', this).removeAttr('style');
                $('.queTipRight', this).fadeOut(300);
                if($('.chatCtn[cId='+ cId +']')[0]) {// 已经被监控
                    $('[cId='+ cId +']:not(.userMsg, .itemCtn)').fadeIn(300).siblings().fadeOut(300);
                    $('.chatCtn[cId='+ cId +'] .chatBodyLeftCtnScroll').mCustomScrollbar('scrollTo', 'bottom');
                }else {
                    loadingBox.open();
                    getMonitorUsers(cId, $(this));
                }
            });


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



                            $.each($monitorItemCtn, function(i, itemObj) {
                                if(cId == $(this).attr('cId')) {
                                    $(this).animate({'width': 0}, 300, function() {
                                        $(this).hide();
                                    });
                                }
                            });
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
                            var $picItem = $('.rightBodyCtn .itemCtn'),
                                picSrc = '';

                            $.each($picItem, function() {
                                if(cId == $(this).attr('cId')) {
                                    picSrc = $(this).find('img').attr('src');
                                }
                            });

                            if(bindData) {
                                $.each(bindData, function(key, obj) {
                                    if(key != 'jboxContentAppended') {
                                        html += (obj.askMsg?'<div class="custCtn"><span class="time">'+ (obj.time || '') +'</span><div class="wordCtn"><img class="chatPic" src="'+ picSrc +'"><p class="name">'+ (obj.askUserName || '') +'</p><p>'+ replaceFace(obj.askMsg || '') +'</p><i class="tri"></i></div></div>':'') + (obj.ansMsg?'<div class="servCtn'+ ((obj.ansUserName || '')?'':' _servCtn') +'"><span class="time">'+ (obj.time || '') +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (obj.ansUserName || '') +'</p><div>'+ (obj.ansMsg || '') +'</div><i class="tri"></i></div></div>':'');

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
                                    $('.longDiv').append('<div class="chatHeadCtn" cId="'+ cId +'"><span class="imgCtn"><img src="images/animal'+ (onlyIndex%35 ? onlyIndex%35 : 35) +'.png"><span class="userName" title="'+ (userMsg.UserCard?userMsg.UserCard.Name:( (pData.name?pData.name:'') || '访客')) +'">'+ (userMsg.UserCard?userMsg.UserCard.Name:( (pData.name?pData.name:'') || '访客')) +'</span></span><span class="chatHeadUserCtn"><span>渠道：</span><span class="userSourceId" title="'+ getSource(pData.sourceId) +'">'+ getSource(pData.sourceId) +'</span></span><span class="chatHeadUserCtn"><span>区域：</span><span class="userAddr" title="'+ (pData.addr || '') +'">'+ (pData.addr || '') +'</span></span><span class="chatHeadUserCtn"><span>ip：</span><span class="userIp">'+ (pData.ip || '') +'</span></span><span class="takeLiveCtn chatHeadUserCtn"><span>会话时长：</span><span class="takeLiveBtn">'+ (MN_Base.formatSecond(pData.loadTimes)) +'</span></span><span class="takeTimeCtn chatHeadUserCtn"><span>访问次数：</span><span class="takeTimeBtnCtn">第<span class="takeTimeBtn">'+ (pData.onlineTime || '') +'</span>次访问</span></span></div>');

                                    $('.userMsgCtn').append('<div class="chatBodyRightCtn" cId="'+ cId +'"><div class="chatMsgCtn"><form id="chatMsgForm"><div class="nameCtn"><i title="姓名">姓名</i><input type="text"name="name" placeholder="姓名" value="'+ (userMsg.UserCard.Name || pData.name || '访客') +'" title="'+ (userMsg.UserCard.Name || pData.name || '访客') +'"></div><div class="emailCtn"><i title="邮箱">邮箱</i><input type="text"name="email" placeholder="邮箱" value="'+ (userMsg.UserCard.Email || '') +'" title="'+ (userMsg.UserCard.Email || '') +'"></div><div class="addrCtn"><i title="地址">地址</i><input type="text"name="addr" placeholder="地址" value="'+ (userMsg.UserCard.Addr || '') +'" title="'+ (userMsg.UserCard.Addr || '') +'"></div><div class="telNumCtn"><i title="电话">电话</i><input type="text"name="telNum" placeholder="电话" value="'+ (userMsg.UserCard.TelNum || '') +'" title="'+ (userMsg.UserCard.TelNum || '') +'"></div><div class="qqCtn"><i title="QQ">QQ</i><input type="text"name="qq" placeholder="QQ" value="'+ (userMsg.UserCard.Qq || '') +'" title="'+ (userMsg.UserCard.Qq || '') +'"></div><div class="browerCtn"><i title="浏览器">浏览器</i><input readonly="readonly" type="text"name="brandNo" placeholder="浏览器" value="'+ (pData.broswer || '') +'" title="'+ (pData.broswer || '') +'"></div><div class="sysCtn"><i title="系统">系统</i><input readonly="readonly" type="text"name="sys" placeholder="系统" value="'+ (pData.sysInfo || '') +'" title="'+ (pData.sysInfo || '') +'"></div></form></div></div>');

                                    var ranNum = parseInt(Math.random()*100000),
                                        $chatCtn = $('<div class="chatCtn" cId="'+ cId +'" style="display: none;"><div class="chatBodyCtn"><div class="chatBodyLeftCtn"><div class="chatBodyLeftCtnScroll"><div class="chatTalkCtn">'+ (html || '<div class="custCtn"><span class="timeTip">当前无进行对话</span></div>') +'</div></div></div></div><div class="chatFootCtn"><div class="richTextCtn"><span class="moodBtn" data-title="发送表情" richRanNum="'+ (ranNum) +'"></span><span class="screenBtn" data-title="截取屏幕" richRanNum="'+ (ranNum+1) +'"></span><span class="sendPicBtn" data-title="本地上传" richRanNum="'+ (ranNum+2) +'"></span><span class="picBtn" data-title="发送图片" richRanNum="'+ (ranNum+3) +'"></span><span class="fileBtn" data-title="发送文件" richRanNum="'+ (ranNum+4) +'"></span><span class="commentBtn" data-title="邀请评价" uuid="'+ data.uuid +'" richRanNum="'+ (ranNum+5) +'"></span></div><div class="areaCtn"><textarea class="chatArea" placeholder="请输入您的回答~"></textarea><span class="sendBtn">发送</span><span class="stopTakeCtn">停止接管</span></div></div><div class="chatFootCtnOther"><div class="monitorToCtn"><span class="monitorCloseBtn">停止监控</span><span class="takeBtn">人工接管</span></div></div></div>');
                                    $('.midBodyLeftCtn').find('.chatCtn').fadeOut(300);//隐藏其他
                                    $('.midBodyLeftCtn').append($chatCtn);

                                    $('[richRanNum]', $chatCtn).each(function(i) {
                                        var $richRanNum = $('[richRanNum="'+ (ranNum+i) +'"]');
                                        new jBox('Mouse', {
                                            maxWidth: '200px',
                                            attach: $richRanNum,
                                            content: $richRanNum.attr('data-title'),
                                            animation: 'zoomOut',
                                            closeOnClick: 'body',
                                        });
                                    });

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
                                            animation: 'zoomOut',
                                            closeOnClick: 'body',
                                            closeOnEsc: true,
                                            zIndex: 100000,
                                        });
                                        //提示放大
                                        new jBox('Mouse', {
                                            attach: $(this).parent(),
                                            content: '点击放大',
                                            animation: 'zoomOut',
                                            closeOnClick: 'body',
                                            zIndex: 100000,
                                        });
                                    });



                                    //修改用户信息->邮箱/电话/QQ
                                    $('.chatMsgCtn input').blur(function() {
                                        if($(this).val() != $(this).attr('title')) {
                                            editUserMsg(decodeURI(cId), [$(this).attr('name'), $(this).val()], $(this), $chatCtn);
                                        }
                                    });
                                    $chatCtn.fadeIn(300);
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

                                    $('[cId='+ cId +']:not(.userMsg, .itemCtn)').fadeIn(300).siblings().fadeOut(300);

                                    loadingBox.close();
                                    takeEvent($monitorCtn, '', $chatCtn);
                                },
                            });
                        }
                    });
                }
            }

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
                    new jBox('Notice', {
                        content: '邮箱格式不正确',
                        color: 'red',
                        autoClose: '3000'
                    });
                    $this.focus();
                    return;
                }
                if(editMsg[0]=='telNum' && !(/(^(\d{2,4}[-_－—]?)?\d{3,8}([-_－—]?\d{3,8})?([-_－—]?\d{1,7})?$)|(^0?1[35]\d{9}$)/.test(editMsg[1]))) {
                    new jBox('Notice', {
                        content: '电话格式不正确',
                        color: 'red',
                        autoClose: '3000'
                    });
                    $this.focus();
                    return;
                }
                if(editMsg[0]=='qq' && !(/^[1-9][0-9]{4,9}$/.test(editMsg[1]))) {
                    new jBox('Notice', {
                        content: 'QQ格式不正确',
                        color: 'red',
                        autoClose: '3000'
                    });
                    $this.focus();
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
                    $('[cId='+ $ctn.attr('cId') +']').find('.userName').text($('[cId='+ $ctn.attr('cId') +'] [name]').val());
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
                animation: 'zoomOut',
                closeOnClick: 'body',
            });

            //接管事件->sildeDown/关闭/滚动条/右侧缩放/输入框/只显示一个div/qq表情
            function takeEvent($monitorCtn, $itemCtn, $chatCtn) {
                $curInput = $('.chatArea', $chatCtn);
                $curChat = $chatCtn;
                $curMonitor = $monitorCtn;

                var cId = $chatCtn.attr('cId');

                $('.stopTakeCtn', $chatCtn).on('click', function() {
                    //从在线接管框中消除
                    releaseTake(cId, function(data) {
                        $('.chatCtn[cId='+ cId +'] .chatFootCtnOther').fadeIn(300);
                        $('.chatCtn[cId='+ cId +'] .chatFootCtn').fadeOut(300);

                        //添加到接管框
                        $.each(data.msgList, function(key, value) {//加头像
                            html = (value.askMsg?'<div class="custCtn"><span class="time">'+ value.time +'</span><div class="wordCtn"><img class="chatPic" src="'+ picSrc +'"><p class="name">'+ (value.askUserName || '') +'</p><p>'+ replaceFace(value.askMsg) +'</p><i class="tri"></i></div></div>':'')+(value.ansMsg?'<div class="servCtn"><span class="time">'+ (value.time || '') +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (value.ansUserName || '') +'</p><p>'+ replaceFace(value.ansMsg) +'</p><i class="tri"></i></div></div>':'');
                            $('.chatCtn[cId='+ cId +'] .chatTalkCtn').append(html);
                            $('.chatBodyLeftCtnScroll', $(this));
                        });
                    });
                });

                // 自动打开访客信息
                $('.userMsgBtn').trigger('click');
                $('.chatBodyRightCtn[cId='+ cId +']').show().siblings().hide();

                //调用表情插件
                $('.chatArea', $chatCtn).face({
                    src: 'src/yun/',//表情包路径
                    rowNum: 5,//每行最多显示数量，此属性不适用于常用语
                    ctnAttr: ['0px', '0px', '40px', '40px'],//[left bottom width height] 表情框相对targetEl位置和里面的表情格子宽高  要写单位
                    triggerEl: $('.moodBtn', $chatCtn),//触发按钮(不存在则自己生成，不要由a包裹)
                    targetEl: $('.chatBodyCtn', $chatCtn),//父级参照物(用于appendTo和定位)
                    hideAdv: true,//是否隐藏广告
                    callback: function(data) {
                    },
                });

                $('.sendBtn', $chatCtn).click(function(){
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
                        $('.chatTalkCtn', $chatCtn).append('<div class="servCtn"><span class="time">'+ MN_Base.getFormatDate() +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (webConfig.RobotName || '') +'</p><div>'+ replaceFace(content) +'</div><i class="tri"></i></div></div>');

                        $('.monitorTalkCtn', $monitorCtn).append('<div class="servCtn"><span class="time">'+ MN_Base.getFormatDate() +'</span><div class="wordCtn"><p class="name">'+ (webConfig.RobotName || '') +'</p><div>'+ replaceFace(content) +'</div><i class="tri"></i></div></div>');

                        $('.chatArea', $chatCtn).val('');
                        $('.chatBodyLeftCtnScroll', $chatCtn).mCustomScrollbar('scrollTo', 'bottom');

                        sendMsg(cId, content);
                    }
                });

                //截屏
                $('.screenBtn', $curChat).on('click', function() {
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
                $('.commentBtn', $chatCtn).on('click', function() {
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

                $('.chatTalkCtn', $curChat).append('<div class="servCtn"><span class="time">'+ MN_Base.getFormatDate() +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (webConfig.RobotName || '') +'</p><div>'+ content +'</div><i class="tri"></i></div></div>');


                $('.monitorTalkCtn', $curMonitor).append('<div class="servCtn"><span class="time">'+ MN_Base.getFormatDate() +'</span><div class="wordCtn"><p class="name">'+ (webConfig.RobotName || '') +'</p><div>'+ content +'</div><i class="tri"></i></div></div>');

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
                        animation: 'zoomOut',
                        closeOnClick: 'body',
                        closeOnEsc: true,
                    });
                    //提示放大
                    new jBox('Mouse', {
                        attach: $imgBox.parent(),
                        content: '点击放大',
                        animation: 'zoomOut',
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
                            $('.chatCtn[cId='+ cId +'] .chatArea').focus()
                            if(callback) {
                                callback(data);
                            }
                        }
                    },
                });
            }

            //停止监控
            $('body').on('click', '.monitorCloseBtn', function() {
                var cId = $(this).parents('.chatCtn').attr('cId');
                releaseMonitor(cId, function(data) {
                    $('[cId='+ cId +']:not(.itemCtn)').fadeOut(function() {
                        $(this).remove();
                    });
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
