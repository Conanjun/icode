;$(function() {
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

	//调用自动补全插件
    $('.textarea').autocomplete({
        url: 'servlet/appChat?s=ig',//[string]
        targetEl: $('.editShow'),//参照物(用于appendTo和定位)
        posAttr: ['0rem', '0.133rem'],//外边框的定位[left bottom]
        itemNum: 5,//[int] 默认全部显示
        callback: function(data) {//获取文本后的回调函数
            $('.sendBtn').trigger('click');
        }
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
    });

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
        triggerEl: $('.faceBtn'),//触发按钮(不存在则自己生成，不要由a包裹)
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
    $('.commonQue').on('click', function() {
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
    $('.feedback').on('click', function() {
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
    $('.leaveMsg').on('click', function() {
        $("#leaveMsgBox_FWK").css("display","block");
        FAQ.writeMsg()
    });


    //taskid=402 顾荣 任务：留言面板 2017.12.20
    // 添加a链接弹出框
    $("body").on("click",".LeaveMsg",function(){
        $("#leaveMsgBox_FWK").css("display","block");
        FAQ.writeMsg()
    })
    /*点击输入框下面图标变蓝*/
    $('body').on('click',function(e){
        //图片
        if($(e.target).is('#sendPic input')){
            $(e.target).parent().addClass('sendPicClick');
            $(e.target).parents('.editCtn_com').siblings().find('span').removeClass('sendVoiceClick sendCameraClick sendFaceClick sendFileClick commonQueClick feedbackClick leaveMsgClick');
        }
        //语音
        else if($(e.target).is('#sendVoice')){
            $(e.target).addClass('sendVoiceClick');
            $(e.target).parent().siblings().find('span').removeClass('sendPicClick sendCameraClick sendFaceClick sendFileClick commonQueClick feedbackClick leaveMsgClick');
        }
        //拍照
        else if($(e.target).is('#sendCamera')){
            $(e.target).addClass('sendCameraClick');
            $(e.target).parent().siblings().find('span').removeClass('sendPicClick sendVoiceClick sendFaceClick sendFileClick commonQueClick feedbackClick leaveMsgClick');
        }
        //表情
        else if($(e.target).is('#sendFace')){
            $(e.target).addClass('sendFaceClick');
            $(e.target).parent().siblings().find('span').removeClass('sendPicClick sendVoiceClick sendCameraClick sendFileClick commonQueClick feedbackClick leaveMsgClick');
        }
        //文件
        else if($(e.target).is('#sendFile')){
            $(e.target).addClass('sendFileClick');
            $(e.target).parent().siblings().find('span').removeClass('sendPicClick sendVoiceClick sendCameraClick sendFaceClick commonQueClick feedbackClick leaveMsgClick');
        }
        //常见问题
        else if($(e.target).is('#sendCommonQue')){
            $(e.target).addClass('commonQueClick');
            $(e.target).parent().siblings().find('span').removeClass('sendPicClick sendVoiceClick sendCameraClick sendFaceClick sendFileClick feedbackClick leaveMsgClick');
        }
        //意见反馈
        else if($(e.target).is('#sendFeedBack')){
            $(e.target).addClass('feedbackClick');
            $(e.target).parent().siblings().find('span').removeClass('sendPicClick sendVoiceClick sendCameraClick sendFaceClick sendFileClick commonQueClick leaveMsgClick');
        }
        //留言
        else if($(e.target).is('#sendLeaveMsg')){
            $(e.target).addClass('leaveMsgClick');
            $(e.target).parent().siblings().find('span').removeClass('sendPicClick sendVoiceClick sendCameraClick sendFaceClick sendFileClick commonQueClick feedbackClick');
        }else{
            /*点击其他变回原来的颜色*/
            $('.editCtn_com span').removeClass('sendPicClick sendVoiceClick sendCameraClick sendFaceClick sendFileClick commonQueClick feedbackClick leaveMsgClick');
        }
    });

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
        //userInfoId: 'userInfoId',//用户信息Id
        /**
         * taskid=554 顾荣  ppmoney客服头像与机器人 2018/1/5
         * 原因：区分是机器人客服还是人工客服
         * 修改：添加服图标分为机器人和人工客服
         */
        kfPic: 'robot/skin/h5chat/images/robot.png',  //客服图标
        kf_Robot_Pic: 'robot/skin/h5chat/images/robot.png',  //机器人客服图标
        kf_Person_Pic: 'robot/skin/h5chat/images/robot.png',  //人工客服图标
        kf_Robot_Name:'',//机器人客服名字，此处只是声明个变量，不用赋值
        kf_Person_Name:'',//人工客服名字

        khPic: 'robot/skin/h5chat/images/user.png', //客户图标
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
        //tipWordId: 'tipWord',//输入框提示语Id ----
        //tipWord: '请输入您要咨询的问题',//输入框提示语
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
                        $obj.before('<form class="MN_reasonForm"><div class="MN_reasonCtn"><p class="MN_reasonTitle">非常抱歉没能解决您的问题，请反馈未解决原因，我们会根据您的反馈进行优化与完善！</p>'+ html +'<div class="MN_reasonContent"><textarea name="content" placeholder="您的意见"></textarea></div></div></form>');
                    }else {
                        $obj.text(msg || '感谢您的评价！');
                    }
                }else {
                    $obj.text(msg || '感谢您的评价！');
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
    });

    
    
    // 人工评价
    $('body').on('click', '.RG_commentBtn', function() {
        window.uuid = $(this).attr('uuid');// 客服要求客户评价
        $('.feedback').trigger('click');
    });
    //
    /**
     * taskid=714 提单人：樊静 福维克聊天，留言页面定制 提交人:顾荣
     * 修改：将验证的表单id以及验证规则做修改
     */
    $("#leaveMsgCtn").attr("placeholder","请输入您的问题描述，我们会尽快为你处理！")
    var validator2=$('#leaveMsgForm_FWK').validate({
        rules:{
            name:{
                required:true,
                minlength:2,
                maxlength:10,
            },
            telNum:{
                required:true,
                telFlag:true
            },
            qq:{
                number:true,
                minlength:5,
                maxlength:12 
            },
            email:{
                emailFlag:true,
            },
            content:{
                required:true,
            }
        },
        messages:{
            name:{
                required:"请输入名字",
                minlength:"请输入2~10个字符！",
                maxlength:"请输入2~10个字符！"
            },
            telNum:{
                required:"请输入手机号码",
            },
            qq:{
                number:"请输入正确的QQ号码！",
                minlength:"请输入正确的QQ号码！",
                maxlength:"请输入正确的QQ号码！"
            },
            content:{
                required:"留言不能为空！",
            }
        },
        submitHandler: msgSubmit
    });
    $.validator.addMethod("emailFlag",function(value,element,params){  
      var emailreg=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)$/  
      if(emailreg.test(value.trim())||value.trim()==""){
          return true;
      }else{
          return false;
      } 
    },"请输入正确格式的邮箱！");
    /**
     * taskId=494;顾荣 2017.12.27
    * 修改：优化手机号码正则
    */
    $.validator.addMethod("telFlag",function(value,element,params){
      var telNumReg=/^1[0-9]{10}$/  
      if(telNumReg.test(value.trim())||value.trim()==""){
          return true;
      }else{
          return false;
      }
    },"请输入正确格式的手机号码！")

      function msgSubmit(){
          var messageName=$("#leaveMsgForm_FWK input[name=name]").val().trim()//姓名
          var messagePhone=$("#leaveMsgForm_FWK input[name=telNum]").val().trim()//电话号码
          var messageQQ=$("#leaveMsgForm_FWK input[name=qq]").val().trim()//QQ号码
          var messageEmail=$("#leaveMsgForm_FWK input[name=email]").val().trim()//电子邮箱
          var messageTxt=$("#leaveMsgForm_FWK #leaveMsgCtn").val().trim()//留言内容
          //获取图片路径信息
          var imgUrls=[]
          for(var i=0;i<$(".imgdivs").size();i++){
            if($(".imgdivs").eq(i).attr("rel")){
              imgUrls.push($(".imgdivs").eq(i).attr("rel"));          
            }
          }
          imgUrls=imgUrls.join(',')
          var dataJson={
            Name:messageName,
            Mobile:messagePhone,
            QQ:messageQQ,
            Email:messageEmail,
            Question:messageTxt,
            ImageUrl:imgUrls  
          };
          $.ajax({
              type:'post',
              datatype:'json',
              async:false,
              cache:false,//不从缓存中去数据,
              url:'http://faqrobot.vorwerk.com.cn/api/Question/AddInfo',
              data:JSON.stringify(dataJson),
              success:function(data){
                if(data.success==true){
                    $("#successMessage").css("display","block")
                }else if(data.success==false){
                    layer.msg(data.description) 
                } 
              },
              contentType:'application/json',
              error:function(){
                        layer.msg("请求失败！") 
                }
          })

      }
      //给留言板中的按钮绑定事件
      $("#messageAgain_FWK").click(function(){//点击继续留言返回留言板
        $("#leaveMsgForm_FWK").find("input").val('');
        $("#leaveMsgCtn").val("");
        $("#successMessage").css("display","none");
        $("#imgsDiv").html("")
        validator2.resetForm()
        $('.text-error').removeClass("text-error helper-font-small")
      });
      $("#backMessage_FWK").click(function(){//点击返回聊天关闭留言板返回聊天
        $("#leaveMsgForm_FWK").find("input").val('');
        $("#leaveMsgCtn").val("")
        $("#successMessage").css("display","none");
        $("#leaveMsgBox_FWK").css("display","none")
        $("#imgsDiv").html("")
        validator2.resetForm()
        $('.text-error').removeClass("text-error helper-font-small")
      })
      $("#closeLeaveMsgBox_FWK").click(function(){//点击‘x’关闭留言板返回聊天
        $("#leaveMsgForm_FWK").find("input").val('');
        $("#leaveMsgCtn").val("")
        $("#leaveMsgBox_FWK").css("display","none")
        $("#imgsDiv").html("")
        validator2.resetForm()
        $('.text-error').removeClass("text-error helper-font-small")
      })


});

