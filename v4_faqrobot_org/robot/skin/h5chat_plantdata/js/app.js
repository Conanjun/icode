;$(function() {
    var timerOutDown = null
    FastClick.attach(document.body);

    set_chatScroll_height();
    function set_chatScroll_height() {
        var winW = $(window).width(),
            winH = $(window).height();
        $('html').css('fontSize', winW<750 ? winW : 750);
        $('.chatScroll').height(winH-$('.editCtn').outerHeight());
    }

    $(window).on('resize', function() {
        set_chatScroll_height();
    });

    //显示发送按钮
    $('.textarea').on('input', function() {
        if($(this).val()) {
            $('.sendMsg').addClass('sendBtn');
            $('.sendBtn').show().siblings().hide();
        }else {
            $('.sendMsg').removeClass('sendBtn');
            //$('.addbtn').show().siblings().hide();
        }
    });
    var timer = null;

    //隐藏更多
    $('.view').on('click', function(e) {//不能用body hack ios
        if($(e.target).is('.faceBtn') || $(e.target).is('.addbtn')) {
            $('.editHide').show();
        }else {
            //$('.editHide').hide();
            timerSetHeight();
        }
    });

    $('.textarea').on('blur', function() {
        timerSetHeight();
        if(timerOutDown){
            clearTimeout(timerOutDown)            
        }
    });
    $("#chatCtn").on('touchmove',function(){
        $('.textarea').blur();
    })
    // 定时设置高度
    function timerSetHeight() {
        var i = 0;
        clearInterval(timer);
        timer = setInterval(function() {
            set_chatScroll_height();
            if(i>=5) {
                clearInterval(timer);
            }
            i++;
        }, 100);
    }


    //调用表情插件
    var Face = $('.textarea').face({
        src: 'src/yun/',//表情路径
        rowNum: 7,//每行最多显示数量，此属性不适用于常用语
        ctnAttr: ['0rem', '0rem', '0.133rem', '0.122rem'],//[left bottom width height] 表情框相对targetEl位置和里面的表情格子宽高  要写单位
        triggerEl: $('#sendFace'),//触发按钮(不存在则自己生成，不要由a包裹)
        targetEl: $('.editHide'),//父级参照物(用于appendTo和定位)
        hideAdv: true,//是否隐藏广告
        callback: function() {
            //$('.editHide').hide();
            $('.sendBtn').show().siblings().hide();
            setTimeout(function(){
                $('.textarea').focus();
            }, 50);
        },
    });

    

    var layerCtn = null;//所有的弹出层

    //常见问题
    $('#sendCommonQue').on('click', function() {
        layerCtn = layer.open({
            type: 1,
            title: '常见问题',
            content: $('.commonQueLayer'),
            area: ['1rem', '100%'],
            end: function() {
                set_chatScroll_height();
            },
        });
    });

    //推荐问题
    $('#commonQueBtn').on('click', function() {
        layerCtn = layer.open({
            type: 1,
            title: '推荐问题',
            content: $('.commonQueList'),
            area: ['1rem', '100%'],
            end: function() {
                set_chatScroll_height();
            },
        });
        $(".commonQueList").parents('.layui-layer').find('div.layui-layer-title').css({
            'height':"48px",
            'line-height':"48px",
            'text-align':'center',
            'background-color':"#303133",
            'color':"#c0c4cc",
            'padding':'0px',
            'border-bottom':'none'
        });
        $(".commonQueList").parents('.layui-layer').find('span.layui-layer-setwin>a.layui-layer-close').html('&times').css({
            'color':'#c0c4cc',
            'font-size':'24px'
        })
        $(".commonQueList").parents('.layui-layer').find('span.layui-layer-setwin').css('padding-top',"6px")
    });
    
    //选择常见问题(事件委托)
    $('body').on('click', function(e) {
        if(e.target.className=='MN_queList') {
            layer.close(layerCtn);
        }
        if(e.target.parentNode) {
            if(e.target.parentNode.className=='MN_queList') {
                layer.close(layerCtn);
            }
        }
        // 关闭各种框
        if(e.target.className=='layui-layer-setwin') {
            $(e.target).find('.layui-layer-close').trigger('click');
        }
    });

    //意见反馈
    $('#sendFeedBack').on('click', function() {
        layerCtn = layer.open({
            type: 1,
            title: '意见反馈',
            content: $('.feedbackLayer'),
            area: ['1rem', '100%'],
            end: function() {
                set_chatScroll_height();
            },
        });
    });
    $('.MN_marginCtn').eq(0).on('click', function() {
        $('.noSatiCtn').hide();
    });
    $('.MN_marginCtn').eq(1).on('click', function() {
        $('.noSatiCtn').show();
    });

    //留言
    $('#sendLeaveMsg').on('click', function() {
        $("#leaveMsgBox").css("display","block");
        FAQ.writeMsg()
    });


    //taskid=402 顾荣 任务：留言面板 2017.12.20
    // 添加a链接弹出框
    $("body").on("click",".LeaveMsg",function(){
        $("#leaveMsgBox").css("display","block");
        FAQ.writeMsg()
    })
    /**
     * taskid=784;赵永平
     * h5页面添加标签图片按钮……描述并点击后整体变色
     * 添加字体样式
     */
    /*点击输入框下面图标变蓝*/
    $('body').on('click',function(e){
        //表情
        if($(e.target).is('#sendFace') || $(e.target).is('.faceBtn') || e.target.innerHTML == '表情'){
            $('.editCtn_com span').removeClass('sendPicClick sendVoiceClick sendCameraClick sendFaceClick sendFileClick commonQueClick feedbackClick leaveMsgClick');
            if(e.target.innerHTML == '表情'){
              $(e.target).siblings('span').addClass('sendFaceClick');
            }else if($(e.target).is('#sendFace')){
              $(e.target).children('span').addClass('sendFaceClick');
            }else{
              $(e.target).addClass('sendFaceClick');
            }
            // $(e.target).siblings('p').addClass('btnClass');
            addClassFN(e.target)
        }else{
            /*点击其他变回原来的颜色*/
            $('.editCtn_com span').removeClass('sendPicClick sendVoiceClick sendCameraClick sendFaceClick sendFileClick commonQueClick feedbackClick leaveMsgClick');
            $('.editCtn_com p').removeClass('btnClass')
        }
        function addClassFN (ele) {
          $(ele).siblings('p').addClass('btnClass')
        }
    });
    /**
     * taskid=784
     * h5chat底部表情等，增加选中范围和描述文字，并变蓝色
     */
    $('.editCtn_com').click(function (e) {
          if(!$(this).is('.sendFaceCtn')){
            e.stopPropagation();
            $(this).siblings('.editCtn_com').children('span,p').removeClass('btnClass sendPicClick sendVoiceClick sendCameraClick sendFaceClick sendFileClick commonQueClick feedbackClick leaveMsgClick');
            $(this).children('p').addClass('btnClass');
          }
          if($(this).is('.sendPicCtn')){// 图片
            btnAddClass(this,'sendPicClick');
          }else if($(this).is('.sendVoiceCtn')){// 语音
            btnAddClass(this,'sendVoiceClick');
          }else if($(this).is('.takePhotoCtn')){// 拍照
            btnAddClass(this,'sendCameraClick');
          }else if($(this).is('.sendFaceCtn')){ // 表情
            btnAddClass(this,'sendFaceClick');
            $(this).children('p').addClass('btnClass');
          }else if($(this).is('.sendFileCtn')){ //文件
            btnAddClass(this,'sendFileClick');
          }else if($(this).is('.commonQueCtn')){//常见问题
            btnAddClass(this,'commonQueClick');
          }else if($(this).is('.feedbackCtn')){ //意见反馈
            btnAddClass(this,'feedbackClick');
          }else if($(this).is('.leaveMsgCtn')){ //留言
            btnAddClass(this,'leaveMsgClick');
          }
    })
    
    function btnAddClass (self,Class) {
      $(self).children('span').addClass(Class);
    }



    //faqrobot
    var FAQ = new Faqrobot({
        interface:'servlet/appChat',
		//sysNum: 1000000,//客户唯一标识
        //jid: 0,//自定义客服客户图标
        //robotName: 'FaqRobot',//机器人名称
        logoUrl: 'robot/skin/h5chat/images/logo@2x.png',//logo地址 ----------
        logoId: 'logo',// ----------
        webNameId: 'MN_logoWord',//公司名称Id
        intelTitleChange: true,// 智能聊天是否修改标题
        intelTitle: '',// 智能聊天时的标题
        artiTitleChange: true,// 人工时是否修改标题
        artiTitle: '人工客服',// 人工时的标题
        titleInsteadId: 'title',// 代替标题Id
        h5plantdata:true,
        kfHtml: [
            '<div class="MN_answer_welcome MN_answer"><div class="MN_kftime">%formatDate%</div><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%helloWord%</div></div>',//欢迎语组合
            '<div class="MN_helpful"><span class="MN_reasonSend">提交</span><div class="MN_yes"><div class="usefull"></div>有用</div><span class="line"></span><span class="MN_no"><div class="useless"></div>没用</span></div>',//满意度评价组合
            '<div class="MN_answer" aId="%aId%" cluid="%cluid%"><div class="MN_kftime">%formatDate%</div><div class="MN_kfName">%robotName%</div><div style="display:inline-block" class="MN_kfCtn_outer"><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%ansCon%%gusListHtml%%relateListHtml%</div>%commentHtml%</div></div>'//回答组合
        ],//客服结构(所有的属性和%xxx%都必须存在)
        //userInfoId: 'userInfoId',//用户信息Id
        /**
         * taskid=554 顾荣  ppmoney客服头像与机器人 2018/1/5
         * 原因：区分是机器人客服还是人工客服
         * 修改：添加服图标分为机器人和人工客服
         */
        kfPic: 'robot/skin/h5chat_plantdata/images/robot.png',  //客服图标
        kf_Robot_Pic: 'robot/skin/h5chat_plantdata/images/robot.png',  //机器人客服图标
        kf_Person_Pic: 'robot/skin/h5chat_plantdata/images/robot.png',  //人工客服图标
        kf_Robot_Name:'',//机器人客服名字，此处只是声明个变量，不用赋值
        kf_Person_Name:'',//人工客服名字

        khPic: 'robot/skin/h5chat_plantdata/images/user.png', //客户图标
        formatDate: '%month%月%date%日 %hour%:%minute%:%second%',//配置时间格式(默认10:42:52 2016-06-24)
        topQueId: 'commonQueLayer',//热门、常见问题Id --------
        //newQueId: 'newQueId',//新增问题Id
        //recommendQueId: 'recommendQueId',//推荐问题Id
        //quickServId: 'MN_quickServer',//快捷服务Id
        //recommendLinkId: 'recommendLinkId',//推荐咨询Id
        //maxQueNum: 100,//最多展示问题条数
        //maxQueLen: 100,//最多展示问题字数
        //showMsgId: 'showMsgId',//展示信息Id
        chatCtnId: 'chatCtn',//聊天展示Id y   --------------
        inputCtnId: 'textarea',//输入框Id y   --------
        sendBtnId: 'sendBtn',//发送按钮Id y   ------
        tipWord: '北京小桔',//输入框提示语
        //remainWordId: 'MN_remainWordNum',
        //remainWordNum: '100',
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
        sourceId:tmpsourceId,//客户来源
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
        helpfulModule: {//答案满意度模块
            open: true,//是否启用功能
            yesCallback: function($obj, msg) {//满意的回调
                $obj.text(msg || '感谢您的评价！');
            },
            noCallback: function ($obj, msg,data,self) {//不满意的回调
                /**
                 * taskid=781
                 * 添加转人工条件，判断robotAnswer长度大于1则不显示不满意回答
                 * 界面提示robotAnswer[1]的对话
                 */
                var newAnswer = data.robotAnswer || [];
                if (window.uselessReasonItems && newAnswer.length < 2) {
                  if (window.uselessReasonItems[0]) {
                    self.scrollbar.options.autoBottom = false;
                    $('.MN_reasonSend', $obj).css('display', 'inline-block').siblings().hide()
      
                    var html = ''
                    for (var i = 0; i < window.uselessReasonItems.length; i++) {
                      var checked = ''
                      if (!i) {
                        checked = 'checked'
                      }
                      html += '<div class="MN_reasonItem"><input id="MN_reason' + i + '" type="radio" value="' + window.uselessReasonItems[i].tId + '" name="reasonType" ' + checked + '><label for="MN_reason' + i + '">' + window.uselessReasonItems[i].reason + '</label></div>'
                    }
                    $obj.parent().find("div.MN_kfCtn").append('<form class="MN_reasonForm"><div class="MN_reasonCtn"><p class="MN_reasonTitle">非常抱歉没能解决您的问题，请反馈未解决原因，我们会根据您的反馈进行优化与完善！</p>' + html + '<div class="MN_reasonContent"><textarea name="content" placeholder="您的意见"></textarea></div></div></form>')
                  } else {
                    self.scrollbar.options.autoBottom = false;
                    $obj.text(newAnswer[0].ansCon || '感谢您的评价！');
                    if(newAnswer.length > 1){
                      sedMsg()
                    }
                  }
                } else {
                  self.scrollbar.options.autoBottom = false;
                  $obj.text(newAnswer[0].ansCon || '感谢您的评价！');
                  if(newAnswer.length > 1){
                    sedMsg()
                  }
                }
      
                function sedMsg() {
                  data.robotAnswer.splice(0,1);
                  self.$obj.$chatCtnId.append(self.robotHtml(data));
                  self.scrollbar.scrollTo('bottom', true);
                }
      
              }
        },
        initCallback: function(data) {//初始化基本信息的回调
            window.uselessReasonItems = data.uselessReasonItems;
        },
        sendCallback: function() {//点击发送按钮的回调
            //$('.addbtn').show().siblings().hide();
            $('.sendBtn').removeClass('sendBtn');
            $('.sendMsg').css('display','block !important');
            !FAQ.robot._html && $('.textarea').focus();// 防止键盘拉起
        },
        commentCallback: function() {//评论后的回调
            layer.close(layerCtn);
        },
        leaveMsgCallback: function() {//留言后的回调
            layer.close(layerCtn);
        }
    });
    $('.sendBtn').on('click.FA', function() {
        $('.textarea').focus();
        setTimeout(function(){
            $('.textarea').focus();
        }, 50);
    });
    
    var timerDown = null;
    // 自动滚动到底部
    $('.textarea').on('focus', function() {
        var j = 0;
        clearInterval(timerDown);
        timerDown = setInterval(function() {
            $('body').scrollTop(1000000);
            FAQ.scrollbar.scrollTo('bottom', true);
            if(j>=5) {
                clearInterval(timerDown);
            }
            j++;
        }, 100);
        clearTimeout(timerOutDown)
        if(FAQ.isiOS){
            timerOutDown=setTimeout(function(){
                $('.textarea').focus();
            },1000)            
        }
    });

    
    
    // 人工评价
    $('body').on('click', '.RG_commentBtn', function() {
        window.uuid = $(this).attr('uuid');// 客服要求客户评价
        $('#sendFeedBack').trigger('click');
    });


    //调用自动补全插件
    $('.textarea').autocomplete({
        url: 'servlet/appChat?s=ig&sourceId='+FAQ.options.sourceId+'&sysNum='+FAQ.options.sysNum,//[string]
        targetEl: $('.editShow'),//参照物(用于appendTo和定位)
        posAttr: ['0rem', '0.133rem'],//外边框的定位[left bottom]
        itemNum: 5,//[int] 默认全部显示
        callback: function(data) {//获取文本后的回调函数
            $('.sendBtn').trigger('click');
        }
    });
    var thirdComUrl='http://kgrobot.plantdata.ai/QATemplates/recommend/template-2.html?'
    if(location.host=='bot.plantdata.ai'){
        thirdComUrl='http://kgrobot.plantdata.ai/QATemplates/recommend/template-2.html?'
    }else if(location.host=='testbot.plantdata.ai'){
        thirdComUrl='http://test.plantdata.ai/QATemplates/recommend/template-2.html?'
    }
    thirdComUrl+='sysNum='+FAQ.options.sysNum+'&'
    thirdComUrl+='WLH='+window.location.host;
    $("iframe#commonQueIfr").attr('src',thirdComUrl)
    window.FAQ=FAQ

    $('body').on('touchstart', '.MN_yes,.MN_no', function() {
        $(this).addClass('hov')
    });
    $('body').on('touchend', '.MN_yes,.MN_no', function() {
        $(this).removeClass('hov')
    });

});
/**taskId=823 plantdata 定制聊天页面 add by zhaoyuxing 
 * 说明：plantData对象为定制的方面和变量，在minichat.js中调用
 * */ 
window.plantData={
    /**taskId=823 满意度评价结构 add by zhaoyuxing 
     * 说明：在minichat.js中将默认的kfhtml覆盖
     * */ 
    perviousTime:new Date(),//前一次会话时间间隔
    hlperviousTime:'',//历史信息前一次时间间隔
    hlInter:'',//历史信息的时间间隔
    inter:'',//相邻2次会话之间的时间间隔
    setInterTime:30,//设置时间显示的间隔 单位s
    // taskId=823 plant调整同一客户发送内容的间隔 add by zhaoyuxing
    adjustMargin:function(){
        var _nowChatEle=$('#chatCtn>:last-child'),
        _preChatEle=_nowChatEle.prev(),
        nowChat=_nowChatEle.attr('class'),
        preChat=_preChatEle.attr('class');
        if(nowChat==preChat){
            _nowChatEle.css('padding-top','8px');
            _preChatEle.css('padding-bottom','8px');
        }
    },
    hlAdjustMargin:function(index){
        var hlList=$('.MN_answer_welcome').prevAll().not('.MN_record'),
            nowEle='',
            nextEle='';
        for(var i=0;i<hlList.length;i++){
            _nowEle=hlList.eq(i).attr('class');
            _nextEle=hlList.eq(i+1).attr('class');
            if(_nowEle==_nextEle){
                hlList.eq(i).css('padding-top','8px');
                hlList.eq(i+1).css('padding-bottom','8px');
            }    
        }
    },
    showTime(time,year,month,date,hour,minute,second,result){
        if(time){//历史记录查看
            var hlDate=new Date(year,month-1,date,hour,minute,second);
            if(plantData.hlperviousTime){
                plantData.hlInter=(hlDate.getTime()-plantData.hlperviousTime.getTime())/1000;
                plantData.hlperviousTime=hlDate;
                if(plantData.hlInter>plantData.setInterTime){

                    return result+'<div style="height:12px;"></div>';
                }else{
                    return '';
                }
            }else{//首次查看聊天记录 直接显示时间 并记录当前时间 
                plantData.hlperviousTime=hlDate;
                return result+'<div style="height:12px;"></div>';
            }
        }else{//聊天
            if(plantData.perviousTime){
                plantData.inter=(today.getTime()-plantData.perviousTime.getTime())/1000;
                plantData.perviousTime=today;
                /**taskId=823 plantdata定制，间隔n秒才会显示时间 Add By zhaoyuxing
                 * 说明：记录前一次会话发送事件与本次时间相减，获得差值；小于设置的间隔则返回空
                * plantData对象在chat2_plantdata.html中定义全局变量
                */
                if(plantData.inter>plantData.setInterTime){
                    return result;
                }else{
                    // if(This.isCallInit==1){
                    //   return result;
                    // }
                    return '';
                }
            }else{
                plantData.perviousTime=today;
                return result+'<div style="height:12px;"></div>';
            }
        }
    }

}
   
function answerQue(info){
    FAQ.askQue(decodeURI(info))
    $(".commonQueList").parents('.layui-layer').find('span.layui-layer-setwin').click()
}

