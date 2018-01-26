/**
 * Created by yunwen on 2017/6/19.
 */
/**********全局变量区**********/
var pageClassObj = null;
var onloadObj = null;
var registerEventObj = null;
var functionObj = null;
var interFaceObj = null;
var curChat = null//当前的聊天框
var loadingBox = null;
var tipMsg = '';//解决未知接口


/**********程序入口区**********/
$(function(){
    //loadingBox.open();

    var This = this;
    //获取sysNum
    var sysNum = This.location.search.match(/\?sysNum=(\d*)/);
    if(sysNum) {
        sysNum = sysNum[1];
    }

    pageClassObj(sysNum);
});

pageClassObj = function(sysNum){
    interFaceObj.getServInfo(sysNum);
    interFaceObj.getOnlineUsers();

    var goulTimer = setInterval(function(){
        interFaceObj.getOnlineUsers();
    },1000);

    onloadObj.midBodyLeftCtn_width();
    onloadObj.midBodyCtn_height();
    onloadObj.operateSwitch_height();
    onloadObj.scroll_bind();
    onloadObj.leftState_create();

    registerEventObj.leftState_click();
    registerEventObj.chatSwitch_click();
    registerEventObj.toggleBtn_click();
    registerEventObj.operateSwitch_click();
    registerEventObj.addAsk_click();
    registerEventObj.screen_resize();
};

loadingBox = new jBox('Tooltip', {
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
/**********dom加载区**********/
onloadObj = {
    'midBodyLeftCtn_width':function(){

        if($('.midBodyCtn').width() < 900){
            $('.midBodyLeftCtn').innerWidth($('.midBodyCtn').width() - $('.midBodyRightCtn').width() + 300);
            $('.toggleBtn').addClass('toLeft');
            $('.midBodyRightCtn').css('right','-300px');
        }else{
            $('.midBodyLeftCtn').innerWidth($('.midBodyCtn').width() - $('.midBodyRightCtn').width());
            $('.toggleBtn').removeClass('toLeft');
            $('.midBodyRightCtn').css('right','0');
        }
    },
    'midBodyCtn_height':function(){
        $('.midBodyCtn').height($('.midCtn').height() - $('.midHeadCtn').height());
    },
    'operateSwitch_height':function(){
        $('.knowBodyCtn').innerHeight($('.chat-box-wrapper').height() - $('.midHeadCtn').height() - $('.knowHeadCtn').height());
    },

    'scroll_bind':function(){
        $('.leftCtn').mCustomScrollbar({
            theme: "light-thin",
            autoHideScrollbar: true

        });
        //生成聊天框顶部用户信息滚动条
        $('.midHeadRightCtn').mCustomScrollbar({
            theme:"dark-thin",
            horizontalScroll: true,
            autoHideScrollbar: true,
            scrollButtons: {
                enable: true,
            },
        });
    },
    //生成左侧状态栏
    'leftState_create':function(data,curChatCtn){
        //console.log(curChatCtn);
        //console.log($(".chatCtn"));
        var jUl, jLi;
        for(var i=0; i<$('.stateBody').length; i++){
            $($('.stateBody')[i]).find('li:not(.hide)').remove();
        }
        if(data){
           for(var i=0; i<data["onlineUsers"].length; i++){
               var onlineUser = data["onlineUsers"][i];
               var stateIndex;
               var needAdd = true;
               //用户cid，唯一辨识
               var cIdData = encodeURI(onlineUser.cId).replace(/%/g, '_-');
               //生成用户对应的状态文字及颜色
               var userState = functionObj.getUserState(onlineUser.state, onlineUser.controlId);
               //生成图片序号
               var onlyIndex = functionObj.getOnlyIndex(cIdData);

               if(needAdd) {
                   switch (onlineUser.state) {
                       case 0://下线
                           stateIndex = 0;
                           break;
                       case 1://聊天
                           stateIndex = 1;
                           break;
                       case 2://监控
                           stateIndex = 2;
                           break;
                       case 3://接管
                           stateIndex = 3;
                           break;
                       case 4://挂起
                           stateIndex = 4;
                           break;
                   }
                   if(onlineUser.state == stateIndex) {
                       jLi = $('li.leftCtn_state_'+stateIndex+'.hide').clone(true).removeClass('hide');
                       jUl = $('li.leftCtn_state_'+stateIndex+'.hide').parent();
                       jLi.attr('cId',cIdData);
                       if(curChatCtn){
                           if(jLi.attr('cId') == curChatCtn.attr('cId')){
                               jLi.addClass('itemActive');
                           }
                       }
                   }

                   if(jLi.find('img').attr('src') != ('images/animal'+(onlyIndex%35 ? onlyIndex%35 : 35)+'.png')){
                       jLi.find('img').attr('src', ('images/animal'+(onlyIndex%35 ? onlyIndex%35 : 35)+'.png'));
                   }
                   if(jLi.find('.ipMsgCtn').html() != onlineUser.ip){
                       jLi.find('.ipMsgCtn').html(onlineUser.ip);
                   }
                   if(jLi.find('.state').html() != userState[1]){
                       jLi.find('.state').html(userState[1]);
                   }
                   jUl.append(jLi);
               }

           }
        }

        //显示各状态栏有多少用户
        for(var i=1; i<=$('.stateBody').length; i++){
            var onlineUserCount = $($('.stateBody')[i-1]).find('li:not(.hide)').length;
            if(onlineUserCount == 0){
                $('.stateHead' + i).find('.userCount').css('display','none');
                $('.stateHead' + i).find('i.fa-caret-down').removeClass('fa-caret-right').addClass('fa-caret-down');

            }else{
                $('.stateHead' + i).find('.userCount').css('display','inline').html(onlineUserCount);
                $('.stateHead' + i).find('i.fa-caret-right').removeClass('fa-caret-right').addClass('fa-caret-down');
                $('.stateBody' + i).slideDown();

            }
        }
    },
};

/**********事件注册区**********/
registerEventObj = {

    /*左侧状态点击展开事件*/
    'leftState_click':function(){
        $('.leftCtn_state').unbind('click').bind('click',function(){
            $(this).children('ul').slideToggle(200);
            if($(this).find('i.fa').hasClass('fa-caret-right')){
                $(this).find('i.fa').addClass('fa-caret-down').removeClass('fa-caret-right');
            }else{
                $(this).find('i.fa').addClass('fa-caret-right').removeClass('fa-caret-down');
            }
        });
    },

    /*点击智能聊天转为被监控*/
    'chatSwitch_click':function(){
        $('.leftCtn_state_click').unbind('click').bind('click',function(event){
            if(event.stopPropagation){
                event.stopPropagation();
            }else{
                event.cancelBubble = true;
            }
            var cId = $(this).attr('cId');
            curChat = $(".chatCtn[cId='"+ cId +"']");
            $(this).addClass('itemActive').siblings().removeClass('itemActive');
            if($(".chatCtn[cId='"+ cId +"']")[0]) {// 已经被监控
                $('[cId='+ cId +']:not(.userMsg, .itemActive)').fadeIn(300).siblings().fadeOut(300);
                $('.chatCtn[cId='+ cId +'] .chatBodyLeftCtnScroll').mCustomScrollbar('scrollTo', 'bottom');
                onloadObj.leftState_create('',$(".chatCtn[cId='"+ cId +"']")[0]);
            }else {
                loadingBox.open();
                interFaceObj.getMonitorUsers(cId, $(this));
            }
        });
    },
    /*人工接管按钮点击事件*/
    'takenBtn_click':function(){
        $('body').on('click', '.takeBtn', function() {
            var $this = $(this),
                cId = $this.parents('.chatCtn').attr('cId');

            interFaceObj.getTakeUsers(cId, $this.parents('.chatCtn'), true);
        });
    },

    /*点击被监控用户显示聊天记录*/
    'beMonitored_click':function(){

    },

    /*右侧操作区点击展开收起事件*/
    'toggleBtn_click':function(){
        $('.toggleBtn').unbind('click').bind('click',function(){
            $(this).toggleClass('toLeft');
            if($(this).hasClass('toLeft')){
                $('.midBodyRightCtn').css('right','-300px');
                $('.midBodyLeftCtn').innerWidth($('.midBodyLeftCtn').innerWidth() + 300);
            }else{
                $('.midBodyRightCtn').css('right','0');
                $('.midBodyLeftCtn').innerWidth($('.midBodyLeftCtn').innerWidth() - 300);
            }

        });
    },

    /*知识库点击切换事件*/
    'operateSwitch_click':function(){
        $('.knowHeadCtn span').unbind('click').bind('click',function(){
            $(this).addClass('active').siblings('span').removeClass('active');
            $('.queShowCtn' + ($(this).index() + 1)).addClass('active').siblings('div').removeClass('active');
        });
    },

    /*新增回复点击事件*/
    'addAsk_click':function(){
        $('.addAskCtn p').unbind('click').bind('click',function(){
            $('.editAskCtn').fadeIn();
        });
        $('.editCancle').unbind('click').bind('click',function(){
            $('.editAskCtn').fadeOut();
        });
        $('.editSave').unbind('click').bind('click',function(){
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
                }
            });
        });
    },

    /*窗口调整事件*/
    'screen_resize':function(){
        $(window).resize(function(){
            onloadObj.midBodyLeftCtn_width();
            onloadObj.midBodyCtn_height();
            onloadObj.operateSwitch_height();
        });
    }
};

/**********各类方法区**********/
functionObj = {
    //生成用户对应的状态及颜色
    'getUserState':function(state, controlId){
        var userState = [];

        switch (state) {
            case 0://下线
                userState[0] = 'greyActive';
                userState[1] = '已下线';
                break;
            case 1://聊天
                userState[0] = 'greenActive';
                userState[1] = '智能聊天';
                break;
            case 2://监控
                userState[0] = 'yellowActive';
                userState[1] = '被监控';
                break;
            case 3://接管
            case 8://监控
                userState[0] = 'redActive';
                userState[1] = '被云问客服'+ (controlId[0]||'') +'接管';
                break;
            case 4://挂起
                userState[0] = 'greyActive';
                userState[1] = '已挂起';
                break;
            case 5://第三方客服
            case 7://监控
                userState[0] = 'purpleActive';
                userState[1] = '被第三方客服'+ (controlId[0]||'') +'接管';
                break;
        }

        return userState;
    },
    //生成图片序号
    'getOnlyIndex':function(cId){
        var num = 0;
        for(var i=0; i<cId.length; i++) {
            if(!/\d+/.test(cId[i])) {
                num += cId[i].charCodeAt();
            }
        }
        return num;
    },
    //转义表情
    'replaceFace':function(data, bool){
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
    },
    //sourceId对应文字
    'getSource':function(sourceId){
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
    },
    //接管事件->sildeDown/关闭/滚动条/右侧缩放/输入框/只显示一个div/qq表情
    'takeEvent':function($monitorCtn, $itemCtn, $chatCtn){
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
                    html = (value.askMsg?'<div class="custCtn"><span class="time">'+ value.time +'</span><div class="wordCtn"><img class="chatPic" src="'+ picSrc +'"><p class="name">'+ (value.askUserName || '') +'</p><p>'+ functionObj.replaceFace(value.askMsg) +'</p><i class="tri"></i></div></div>':'')+(value.ansMsg?'<div class="servCtn"><span class="time">'+ (value.time || '') +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (value.ansUserName || '') +'</p><p>'+ functionObj.replaceFace(value.ansMsg) +'</p><i class="tri"></i></div></div>':'');
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
                $('.chatTalkCtn', $chatCtn).append('<div class="servCtn"><span class="time">'+ MN_Base.getFormatDate() +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (webConfig.RobotName || '') +'</p><div>'+ functionObj.replaceFace(content) +'</div><i class="tri"></i></div></div>');

                $('.monitorTalkCtn', $monitorCtn).append('<div class="servCtn"><span class="time">'+ MN_Base.getFormatDate() +'</span><div class="wordCtn"><p class="name">'+ (webConfig.RobotName || '') +'</p><div>'+ functionObj.replaceFace(content) +'</div><i class="tri"></i></div></div>');

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
    },
};

/**********数据交互区**********/
interFaceObj = {
    /*获取客服信息 -> url = '/user/getLoginUser'*/
    'getServInfo':function(sysNum){
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
                    //interFaceObj.runStep1();

                    $('.webSite').attr('href', webConfig.WebSite || '');
                    $('.leftHeadCtn .custName').html(MN_Base.addDots((webConfig.WebName || ''), 8));
                    $('.leftHeadCtn .custQue').html(MN_Base.addDots(MN_Base.getPlainText(webConfig.Info || ''), 9));

                    //提示放大
                    new jBox('Mouse', {
                        maxWidth: '200px',
                        attach: $('.leftHeadCtn'),
                        content: (webConfig.Info || ''),
                        animation: 'zoomOut',
                    });
                }
            },
        });
    },

    /*获取在线用户信息 -> s=goul*/
    'getOnlineUsers':function(){
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
                        $('.chat-box-wrapper').animate({'opacity':1});
                        onloadObj.leftState_create(data,curChat);
                    }
                },
            });
        }
    },

    /*获取被监控用户信息 -> s=gw*/
    'getMonitorUsers':function(cId, $obj){
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
                    interFaceObj.getTakeUsers(cId, $obj, false, data);
                }
                loadingBox.close();
            },
        });
    },

    /*获取被接管用户信息 -> s=gc*/
    'getTakeUsers':function(cId, $takeBtn, bool, data){
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
                        interFaceObj.renderTakeUsers(data, $takeBtn);
                        $('.chatCtn[cId='+ cId +'] .chatFootCtnOther').fadeOut(300);
                        $('.chatCtn[cId='+ cId +'] .chatFootCtn').fadeIn(300);
                        $('.chatCtn[cId='+ cId +'] .chatArea').focus();

                        //添加到接管框
                        $.each(data.msgList, function(key, value) {//加头像
                            html = (value.askMsg?'<div class="custCtn"><span class="time">'+ value.time +'</span><div class="wordCtn"><img class="chatPic" src="'+ picSrc +'"><p class="name">'+ (value.askUserName || '') +'</p><p>'+ functionObj.replaceFace(value.askMsg) +'</p><i class="tri"></i></div></div>':'')+(value.ansMsg?'<div class="servCtn"><span class="time">'+ (value.time || '') +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (value.ansUserName || '') +'</p><p>'+ functionObj.replaceFace(value.ansMsg) +'</p><i class="tri"></i></div></div>':'');
                            $('.chatCtn[cId='+ cId +'] .chatTalkCtn').append(html);
                        });
                        loadingBox.close();
                    }
                },
            });
        }else {// 是监控
            interFaceObj.renderTakeUsers(data, $takeBtn);
        }
    },

    /*渲染被接管用户*/
    'renderTakeUsers':function(data, $takeBtn){
        if($takeBtn.is('.itemActive')) {// 监控
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
                    var $monitorItemCtn = $('.chatHead_wrapper .chatHeadCtn');
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
                    var $picItem = $('.leftCtn_state .itemActive'),
                        picSrc = '';

                    $.each($picItem, function() {
                        if(cId == $(this).attr('cId')) {
                            picSrc = $(this).find('img').attr('src');
                        }
                    });

                    if(bindData) {
                        $.each(bindData, function(key, obj) {
                            if(key != 'jboxContentAppended') {
                                html += (obj.askMsg?'<div class="custCtn"><span class="time">'+ (obj.time || '') +'</span><div class="wordCtn"><img class="chatPic" src="'+ picSrc +'"><p class="name">'+ (obj.askUserName || '') +'</p><p>'+ functionObj.replaceFace(obj.askMsg || '') +'</p><i class="tri"></i></div></div>':'') + (obj.ansMsg?'<div class="servCtn'+ ((obj.ansUserName || '')?'':' _servCtn') +'"><span class="time">'+ (obj.time || '') +'</span><div class="wordCtn"><img class="chatPic" src="images/robot.png"><p class="name">'+ (obj.ansUserName || '') +'</p><div>'+ (obj.ansMsg || '') +'</div><i class="tri"></i></div></div>':'');

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
                            var onlyIndex = functionObj.getOnlyIndex(cId);//图片序号
                            $('.chatHead_wrapper').append('<div class="chatHeadCtn" cId="'+ cId +'"><span class="imgCtn"><img src="images/animal'+ (onlyIndex%35 ? onlyIndex%35 : 35) +'.png"><span class="userName" title="'+ (userMsg.UserCard?userMsg.UserCard.Name:( (pData.name?pData.name:'') || '访客')) +'">'+ (userMsg.UserCard?userMsg.UserCard.Name:( (pData.name?pData.name:'') || '访客')) +'</span></span><span class="chatHeadUserCtn"><span>渠道：</span><span class="userSourceId" title="'+ functionObj.getSource(pData.sourceId) +'">'+ functionObj.getSource(pData.sourceId) +'</span></span><span class="chatHeadUserCtn"><span>区域：</span><span class="userAddr" title="'+ (pData.addr || '') +'">'+ (pData.addr || '') +'</span></span><span class="chatHeadUserCtn"><span>ip：</span><span class="userIp">'+ (pData.ip || '') +'</span></span><span class="takeLiveCtn chatHeadUserCtn"><span>会话时长：</span><span class="takeLiveBtn">'+ (MN_Base.formatSecond(pData.loadTimes)) +'</span></span><span class="takeTimeCtn chatHeadUserCtn"><span>访问次数：</span><span class="takeTimeBtnCtn">第<span class="takeTimeBtn">'+ (pData.onlineTime || '') +'</span>次访问</span></span></div>');

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
                            //takeEvent($monitorCtn, '', $chatCtn);
                        },
                    });
                }
            });
        }
    },


    /*获取被监控聊天信息数据*/
    'getMonitorMsg':function(){
        MN_Base.request({
            url: 'servlet/Monitor',
            params: {
                s: 'gw',
                cId: '5'
            },
            callback: function(data) {//重新渲染快捷回复
                console.log(data.msgList);
            }
        });
    }
};