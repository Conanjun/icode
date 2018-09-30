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

    //显示发送按钮
    $('.textarea').on('input', function() {
        if($(this).val()) {
            $('.sendMsg').show()
            $(".addbtn").hide()
            // $('.sendBtn').show().siblings().hide();
        }else {
            $('.sendMsg').hide()
            $(".addbtn").show()
            //$('.addbtn').show().siblings().hide();
        }
    });
    var timer = null;

    //隐藏更多
    $('.view').on('click', function(e) {//不能用body hack ios
        if($(e.target).parents("#sendFace").size()|| $(e.target).is('.addbtn')) {
            $('.editHide').show();
        }else {
            $('.editHide').hide();
            timerSetHeight();
        }
    });
    $('.textarea').on('blur', function() {
        timerSetHeight();
        if(timerDown1){
            clearInterval(timerDown1)
        } 
        $('#sctoTop').show()
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
    /**
        * taskId=494;顾荣
        * 原因：在ios浏览器上弹出软键盘留言板布局会乱
        * 修改：删除原本的layer弹出框
        */   
        // layerCtn = layer.open({
        //     type: 1,
        //     title: '留言',
        //     content: $('.leaveMsgLayer'),
        //     area: ['1rem', '100%'],
        //     end: function() {	
        //         //taskid=402 顾荣 任务：留言面板 2017.12.20 清除表单验证
        //         $("#leaveMsgForm .form-group>label").remove()			
        //         $('.text-error').removeClass("text-error helper-font-small")
        //         set_chatScroll_height();
        //     },
        // });
        //taskid=402 顾荣 任务：留言面板 2017.12.20
        // 点击返回聊天页关闭留言板
        // $("#backMessage").click(function(){
        //     parent.layer.close(layerCtn)
        // })
        $("#leaveMsgBox").css("display","block");
        FAQ.writeMsg()
    });


    //taskid=402 顾荣 任务：留言面板 2017.12.20
    // 添加a链接弹出框
    $("body").on("click",".LeaveMsg",function(){
    /**
        * taskId=494;顾荣
        * 原因：在ios浏览器上弹出软键盘留言板布局会乱
        * 修改：删除原本的layer弹出框
        */ 
        // layerCtn = layer.open({
        //     type: 1,
        //     title: '留言',
        //     content: $('.leaveMsgLayer'),
        //     area: ['1rem', '100%'],
        //     end: function() {
        //         //taskid=403 顾荣 任务：留言面板 2017.12.20 清除表单验证
        //         $("#leaveMsgForm .form-group>label").remove()
        //         $('.text-error').removeClass("text-error helper-font-small")
        //         set_chatScroll_height();
        //     },
        // });
        // $("#backMessage").click(function(){
        //     parent.layer.close(layerCtn)
        // })
        $("#leaveMsgBox").css("display","block");
        FAQ.writeMsg()
    })


    /*点击输入框下面图标变蓝*/
    // $('body').on('click',function(e){
    //     //图片
    //     if($(e.target).is('#sendPic input')){
    //         $(e.target).parent().addClass('sendPicClick');
    //         $(e.target).parents('.editCtn_com').siblings().find('span').removeClass('sendVoiceClick sendCameraClick sendFaceClick sendFileClick commonQueClick feedbackClick leaveMsgClick');
    //         $(e.target).parent().siblings('p').addClass('btnClass')
    //     }
    //     //语音
    //     else if($(e.target).is('#sendVoice')){
    //         $(e.target).addClass('sendVoiceClick');
    //         $(e.target).parent().siblings().find('span').removeClass('sendPicClick sendCameraClick sendFaceClick sendFileClick commonQueClick feedbackClick leaveMsgClick');
    //         addClassFN(e.target)
    //     }
    //     //拍照
    //     else if($(e.target).is('#sendCamera')){
    //         $(e.target).addClass('sendCameraClick');
    //         $(e.target).parent().siblings().find('span').removeClass('sendPicClick sendVoiceClick sendFaceClick sendFileClick commonQueClick feedbackClick leaveMsgClick');
    //         addClassFN(e.target)
    //     }
    //     //表情
    //     else if($(e.target).is('#sendFace')){
    //         $(e.target).addClass('sendFaceClick');
    //         $(e.target).parent().siblings().find('span').removeClass('sendPicClick sendVoiceClick sendCameraClick sendFileClick commonQueClick feedbackClick leaveMsgClick');
    //         // $(e.target).siblings('p').addClass('btnClass');
    //         addClassFN(e.target)
    //     }
    //     //文件
    //     else if($(e.target).is('#sendFile')){
    //         $(e.target).addClass('sendFileClick');
    //         $(e.target).parent().siblings().find('span').removeClass('sendPicClick sendVoiceClick sendCameraClick sendFaceClick commonQueClick feedbackClick leaveMsgClick');
    //         addClassFN(e.target)
    //     }
    //     //常见问题
    //     else if($(e.target).is('#sendCommonQue')){
    //         $(e.target).addClass('commonQueClick');
    //         $(e.target).parent().siblings().find('span').removeClass('sendPicClick sendVoiceClick sendCameraClick sendFaceClick sendFileClick feedbackClick leaveMsgClick');
    //         addClassFN(e.target)
    //     }
    //     //意见反馈
    //     else if($(e.target).is('#sendFeedBack')){
    //         $(e.target).addClass('feedbackClick');
    //         $(e.target).parent().siblings().find('span').removeClass('sendPicClick sendVoiceClick sendCameraClick sendFaceClick sendFileClick commonQueClick leaveMsgClick');
    //         addClassFN(e.target)
    //     }
    //     //留言
    //     else if($(e.target).is('#sendLeaveMsg')){
    //         $(e.target).addClass('leaveMsgClick');
    //         $(e.target).parent().siblings().find('span').removeClass('sendPicClick sendVoiceClick sendCameraClick sendFaceClick sendFileClick commonQueClick feedbackClick');
    //         addClassFN(e.target)
    //     }else{
    //         /*点击其他变回原来的颜色*/
    //         $('.editCtn_com span').removeClass('sendPicClick sendVoiceClick sendCameraClick sendFaceClick sendFileClick commonQueClick feedbackClick leaveMsgClick');
    //         $('.editCtn_com p').removeClass('btnClass')
    //     }

    //     function addClassFN (ele) {
    //       $(ele).siblings('p').addClass('btnClass')
    //     }
    // });

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
        isWKXT:true,//判断是否为五矿信托
        isH5WKXT:true,
        isEmptySayHello:true,//欢迎语时清页面
        leaveQue: {// 未知问题已回复
            open: true,//是否启用功能
        },
        autoOffline: false,//是否会自动下线
        noView: ['.MN_kfImg', '.MN_khImg', '.FA_upFileNoImg', '.msg-item-wrapper img'],
        faceModule: {//表情模块
            open: true,//是否启用功能
            faceObj: Face,//表情插件实例
        },
        // helpfulModule: {//答案满意度模块
        //     open: true,//是否启用功能
        //     yesCallback: function($obj, msg) {//满意的回调
        //         $obj.text(msg || '感谢您的评价！');
        //     },
        //     noCallback: function($obj, msg) {//不满意的回调
        //         if(window.uselessReasonItems) {
        //             if(window.uselessReasonItems[0]) {
        //                 $('.MN_reasonSend', $obj).css('display', 'inline-block').siblings().hide();

        //                 var html = '';
        //                 for(var i=0; i<window.uselessReasonItems.length; i++) {
        //                     var checked = '';
        //                     if(!i) {
        //                         checked = 'checked';
        //                     }
        //                     html += '<div class="MN_reasonItem"><input id="MN_reason'+ i +'" type="radio" value="'+ window.uselessReasonItems[i].tId +'" name="reasonType" '+ checked +'><label for="MN_reason'+ i +'">'+ window.uselessReasonItems[i].reason +'</label></div>';
        //                 }
        //                 $obj.before('<form class="MN_reasonForm"><div class="MN_reasonCtn"><p class="MN_reasonTitle">非常抱歉没能解决您的问题，请反馈未解决原因，我们会根据您的反馈进行优化与完善！</p>'+ html +'<div class="MN_reasonContent"><textarea name="content" placeholder="您的意见"></textarea></div></div></form>');
        //             }else {
        //                 $obj.text(msg || '感谢您的评价！');
        //             }
        //         }else {
        //             $obj.text(msg || '感谢您的评价！');
        //         }
        //     }
        // },
        initCallback: function(data) {//初始化基本信息的回调
            window.uselessReasonItems = data.uselessReasonItems;
        },
        sendCallback: function() {//点击发送按钮的回调
            //$('.addbtn').show().siblings().hide();
            $('.sendMsg').hide()
            $('.addbtn').show()
            $('.sendMsg').css('display','block !important');
            !FAQ.robot._html && $('.textarea').focus();// 防止键盘拉起
        },
        commentCallback: function() {//评论后的回调
            layer.close(layerCtn);
        },
        leaveMsgCallback: function() {//留言后的回调
            layer.close(layerCtn);
        },
        isPC: function (bool) {
            var userAgentInfo = navigator.userAgent
            var Agents = ['android', 'iphone',
            'symbianos', 'windows phone',
            'ipad', 'ipod']
            var flag = true
            for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.toLowerCase().indexOf(Agents[v]) > 0) {
              if (bool) {
                return Agents[v]
              }
              flag = false
              break
            }
            }
            return flag
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
                        var chatStyle = '.front .chatHeight{height:' + parseInt($(document).height() -470) + 'px !important}';
                    }
                    $('head').append('<style>' + chatStyle + '</style>');
                    // alert('修改页面高度3.3');
                    $('#' + this.inputCtnId).on('focus', function () {
                        // var inputHight = $('.editCtn' ).height()
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
                } else {
                    var frontHeight = $('.' +this.frontId).height();
                    var textareaHeight = $('.' + this.editCtn).height();
                    var editCtnTop = frontHeight-textareaHeight;
                    var self = this;
                    $('#' + this.editCtn).on('focus', function (e) {
                        if($(e.target).is($('#' + this.inputCtnId))){
                            var timerDowm=setTimeout(function(){
                                FAQ.scrollbar.update()
                                FAQ.scrollbar.scrollTo('bottom')
                                $('document').scrollTop(1000000,200)
                                clearTimeout(timerDowm)
                            },200)
                        }
                    });
                }
            } else {
                function get_android_version() {
                    var ua = navigator.userAgent.toLowerCase();
                    var version = null;
                    if (ua.indexOf("android") > 0) {
                        var reg = /android [\d._]+/gi;
                        var v_info = ua.match(reg);
                        version = (v_info + "").replace(/[^0-9|_.]/ig, "").replace(/_/ig, "."); //得到版本号4.2.2
                        // version = parseInt(version.split('.')[0]);// 得到版本号第一位
                    }
        
                    return version;
                }
                // var version = get_android_version() ;
                // alert(version);
                var self = this;
                $('.' + this.editCtn).css('position', 'fixed');
                var timer1;
                $('.' + this.editCtn).on('focus', function () {
                    timer1 = setTimeout(function () {
                        self.scrollIntoView(false);
                    }, 100)
                });

                $('.' +this.editCtn).on('blur', function () {
                    if (timer1) {
                        clearInterval(timer1);
                    }
                });
            }
        },
        //显示水印
        addWaterMarker:function(inf){
            if(inf){
                if(inf.name&&inf.mobile){
                    var str=inf.name+inf.mobile.substr(inf.mobile.length-4)
                    var can = document.createElement('canvas');
                    var chatCtnId = document.getElementById('chatCtn');
                    chatCtnId.appendChild(can);

                    can.width=100;
                    can.height=100;
                    can.style.display='none';


                    var cans = can.getContext('2d');
                    cans.rotate(-20*Math.PI/180);
                    cans.font = "14px Microsoft JhengHei"; 
                    cans.fillStyle = "rgba(17, 17, 17, 0.20)";
                    cans.textAlign = 'center'; 
                    cans.textBaseline = 'left';
                    cans.fillText(str,can.width/3,can.height/2);

                    chatCtnId.style.backgroundImage="url("+can.toDataURL("image/png")+")";                     
                }           
            }
        },
        servLeaveMsg: function () {
            // taskid=402 顾荣 任务:留言面板 保存留言
            var validator1=$('#leaveMsgForm').validate({
                rules:{
                    name:{
                        minlength:2,
                        maxlength:10,
                    },
                    telNum:{
                        telFlag:true
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
                        minlength:"请输入2~10个字符！",
                        maxlength:"请输入2~10个字符！"
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
                var messageName=$("#leaveMsgForm input[name=name]").val().trim()//姓名
                var messagePhone=$("#leaveMsgForm input[name=telNum]").val().trim()//电话号码
                var messageEmail=$("#leaveMsgForm input[name=email]").val().trim()//电子邮箱
                var messageTxt=$("#leaveMsgForm #leaveMsgCtn").val().trim()//留言内容
    
                // 收集来源的关键词
                var entranceWords = ''
                for (var i = 0; i < FAQ.options.entranceWords.length; i++) {
                    entranceWords += (MN_Base.getParam(FAQ.options.entranceWords[i], document.referrer) || '') + ','
                }
                $.ajax({
                    type:'post',
                    datatype:'json',
                    cache:false,//不从缓存中去数据,
                    url:encodeURI('../servlet/appChat'),
                    data:{
                        s: 'leavemsg',
                        sourceId:FAQ.options.sourceId,
                        sysNum:FAQ.options.sysNum,
                        entrance:document.referrer,
                        entranceWords:entranceWords,
                        name:messageName,
                        telNum:messagePhone,
                        email:messageEmail,
                        content:messageTxt,
                    },
                    success:function(data){
                        if(data.status==0){
                            $("#successMessage").css("display","block")
                        }else{
                            FAQ.showMsg(data.message)  
                        }
                    }
                })

            }
            //给留言板中的按钮绑定事件
            $("#messageAgain").click(function(){//点击继续留言返回留言板
                $("#leaveMsgForm").find("input").val('');
                $("#leaveMsgCtn").val("");
                $("#successMessage").css("display","none");
                $("#imgsDiv").html("")
                validator1.resetForm()
                $('.text-error').removeClass("text-error helper-font-small")
            });
            $("#backMessage").click(function(){//点击返回聊天关闭留言板返回聊天
                $("#leaveMsgForm").find("input").val('');
                $("#leaveMsgCtn").val("")
                $("#successMessage").css("display","none");
                $("#leaveMsgBox").css("display","none")
                $("#imgsDiv").html("")
                validator1.resetForm()
                $('.text-error').removeClass("text-error helper-font-small")
            })
            $("#closeLeaveMsgBox").click(function(){//点击‘x’关闭留言板返回聊天
                $("#leaveMsgForm").find("input").val('');
                $("#leaveMsgCtn").val("")
                $("#leaveMsgBox").css("display","none")
                $("#imgsDiv").html("")
                validator1.resetForm()
                $('.text-error').removeClass("text-error helper-font-small")
            })
        },
    });
    $('.sendBtn').on('click.FA', function() {
        $('.textarea').focus();
        setTimeout(function(){
            $('.textarea').focus();
        }, 50);
    });
    
    var timerDown = null;
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
    
    var timerDown1=null
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
            clearInterval(timerDown1)
        if(FAQ.isiOS){
            timerDown1=setInterval(function(){
                $('body').scrollTop(1000000); 
            },1000)
        }
        if(!FAQ.options.isPC()){
            $("#sctoTop").hide()
        }
    });

    $('.view').on('touchmove',function(){
        $("textarea").blur()
        clearInterval(timerDown);
    })

    if(FAQ.options.isPC()){
        $("#sendLeaveMsg").css("display",'none');
        $(".editCtn_com").css('width','33.3333%')
    }
    
    // 人工评价
    $('body').on('click', '.RG_commentBtn', function() {
        window.uuid = $(this).attr('uuid');// 客服要求客户评价
        $('#sendFeedBack').trigger('click');
    });

    $ttt=$("<img id='sctoTop' src='./skin/h5chat_WKXT/images/stoTop.png'></img>")
    $ttt.css({
        'width':'40px',
        'height':'40px',
        'position':'fixed',
        'bottom':'120px',
        'right':'20px',
        'border-radius':'4px',
        'opacity':'0.3',
    })

    $ttt.click(function(){
        $('.textarea').blur() 
        FAQ.scrollbar.scrollTo('top',true)
        return false
    })

    $(".chatScroll").append($ttt)
    $('body').on('click',".MN_record",function(){
        $('#sctoTop').show()
    })

    var touchtime = new Date().getTime();
        $('body').on('touchend',".MN_kfCtn",function(){
        if( new Date().getTime() - touchtime < 300 ){//两次点击间隔为300ms时视为双击
            $obj=$(this).clone()
            $obj.find('img.MN_kfImg,i.MN_triangle,div.MN_helpful').remove();
            $("div#bigAnswerDiv").empty().append($obj).show()
        }else{
            touchtime = new Date().getTime();
        }
    })

    var bigAnswertouch = true;
    $('div#bigAnswerDiv').on('touchstart', function(e){
        bigAnswertouch = true;
    });
    $('div#bigAnswerDiv').on('touchmove', function(e){
        bigAnswertouch = false;
    });
    $('div#bigAnswerDiv').on('touchend', function(e){
        if (bigAnswertouch == true){
            $('div#bigAnswerDiv').empty().hide()
        }
    })


});
