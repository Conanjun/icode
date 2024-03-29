;$(function() {
    FastClick.attach(document.body);

    set_chatScroll_height();
    /*收缩工具栏时，调整聊天页面的高度*/
    function set_chatScroll_height() {
        var winW = $(window).width(),
            winH = $(window).height();
        $('html').css('fontSize', winW<750 ? winW : 750);
        
        /*TaskId:  408 自如页面定制
        *原因：直接嵌入自如app 无头部样式，显示为全屏
        *修改：chatScroll的高度设置
        */
        $('.chatScroll').height(winH-$('.editCtn').outerHeight());
    }

    $(window).on('resize', function() {
        set_chatScroll_height();
    });

    //显示发送按钮
    $('.textarea').on('input', function() {
        if($(this).val()) {
            // $('.sendMsg').addClass('sendBtn');
             $('.sendBtnNew').show();
             $('.addbtn').hide();
            // $('.sendBtn').show().siblings().hide();
        }else {
            // $('.sendMsg').removeClass('sendBtn');
            //$('.addbtn').show().siblings().hide();
            $('.sendBtnNew').hide();
            $('.addbtn').show();
        }
    });
    var timer = null;

     //408 自动滚动到底部
    //function  goToBottom(){
    //    var j = 0,
    //       timerDrop=null;
    //       timerDrop = setInterval(function() {
    //        $('body').scrollTop(2000000);
    //        FAQ.scrollbar.scrollTo('bottom', true);
    //        if(j>=5) {
    //            clearInterval(timerDrop);
    //        }
    //        j++;
    //    }, 100);
    //}

    //隐藏更多
    //taskId:408 显示功能显示以及隐藏 聊天窗口的高度调整
    $('.view').on('click', function(e) {//不能用body hack ios
        if($(e.target).is('.faceBtn') || $(e.target).is('.addbtn')) {
             $('.editHide').show();
        }else {
            $('.editHide').hide();
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
        //src: 'src/yun/',//表情路径
        src: 'src/zr/',//表情路径 takId 408 自如表情
        rowNum: 7,//每行最多显示数量，此属性不适用于常用语
        ctnAttr: ['0rem', '0rem', '0.133rem', '0.122rem'],//[left bottom width height] 表情框相对targetEl位置和里面的表情格子宽高  要写单位
        triggerEl: $('.faceBtn'),//触发按钮(不存在则自己生成，不要由a包裹)
        targetEl: $('.editHide'),//父级参照物(用于appendTo和定位)
        hideAdv: true,//是否隐藏广告
        callback: function() {
            //$('.editHide').hide();
            // $('.sendBtn').show().siblings().hide();
            $('.sendBtnNew').show();
            $('.addbtn').hide();
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
        layerCtn = layer.open({
            type: 1,
            title: '留言',
            content: $('.leaveMsgLayer'),
            area: ['1rem', '100%'],
            end: function() {
                set_chatScroll_height();
            },
        });
    });
    /*TaskId:  408 自如页面定制
    *原因：无修改颜色 删除图标变蓝代码
    */
    /*点击输入框下面图标变蓝*/

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
        vipInsert:'vipInsert',//接入客服模态框
        cancelInsert:'cancelInsert',//取消接入客服
        sureInsert:'sureInsert',//确定接入客服
        vipQuestion:'vipQuestion',//vip转人工时发送问题
        //userInfoId: 'userInfoId',//用户信息Id
        kfPic: 'robot/skin/h5chat/images/robot.png',  //客服图标
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
        
        //taskId:408 设置上传图片触发按钮的id值
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
        upFileModuleCam: {//上传文件模块
            open: true,//是否启用功能
            maxNum: 0,//最大上传数量，0为不限制
            triggerId:'sendCamera',//触发上传按钮
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
            $('.sendBtn').removeClass('sendBtn');
            $('.sendMsg').css('display','block !important');
            !FAQ.robot._html && $('.textarea').focus();// 防止键盘拉起
        },
        commentCallback: function() {//评论后的回调
            layer.close(layerCtn);
        },
        leaveMsgCallback: function() {//留言后的回调
            layer.close(layerCtn);
        },
    });

    $('.sendBtn').on('click.FA', function() {
        $('.textarea').focus();
        setTimeout(function(){
            $('.textarea').focus();
        }, 50);
    });
    
    var timerDown = null;
    // 自动滚动到底部
    $('.textarea').on('focus', function(e) {
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

    
	//调用自动补全插件 taskId=408 自如定制 点击推荐内容后，自动发送信息
    $('.textarea').autocomplete({
        url: 'servlet/appChat?s=ig&sourceId='+FAQ.options.sourceId+'&sysNum='+FAQ.options.sysNum,
        targetEl: $('.editShow'),//参照物(用于appendTo和定位)
        posAttr: ['0rem', '0.133rem'],//外边框的定位[left bottom]
        itemNum: 5,//[int] 默认全部显示
        callback: function(data) {//获取文本后的回调函数
            //由于发送按钮被隐藏，直接调用发送事件
            $('.sendBtnNew').trigger('click');

        }
    });
    
    /*TaskId:  418 自如页面定制
    *说明：选择满意度评价操作评级 推送功能
    *sessionStorage中的helpCtnShow值记录评价框是否已经推送： 1 已推送 0未推送
    */
    var faqrobotModule={
         /* 418 自如页面定制 满意度评价模板结构 s=>fadeback*/
         /**taskIdId=780自如定制，人工邀请五星评价内容 Amend By zhaoyuxing 
          * 说明：修改满意度评价样式，增加显示等级文案以及原因
         */
        staHtml:'<div class="MN_answer"><div class="MN_fkCtn"><div class="helpCtn"><p class="help-title">请您对本次服务做出评价：<span class="helpfull-close">&times;</span></p><div class="helpfull-contanier"><input type="hidden" id="helpLevel" value="-1"><span class="helpGrade" data-grade="1"><i class="fa fa-star-o"></i></span><span class="helpGrade" data-grade="2"><i class="fa fa-star-o"></i></span><span class="helpGrade" data-grade="3"><i class="fa fa-star-o"></i></span><span class="helpGrade" data-grade="4"><i class="fa fa-star-o"></i></span><span class="helpGrade" data-grade="5"><i class="fa fa-star-o"></i></span></div><p class="staWord">非常不满意，各方面都差</p><input type="hidden" id="staReason"><div class="staReasonList"></div><div><textarea id="helpContent" class="help-content"  placeholder="其他想说的。您对小如的服务有任何意见建议都欢迎反馈给产品经理改进哦（您的留言最多可输入200字，选填）" maxlength="200"></textarea></div><div class="helpfull-commit helpfull-commit-disable"><span id="helpComBtn">提交反馈</span></div></div></div></div>',
        staWordList:['非常不满意，各方面都差','不满意，比较差','一般，仍然努力','比较满意，仍可改善','非常满意，服务五星'],//点击等级显示的文案
        staReasonList:[['问题根本没解决','机器人答非所问','服务态度差','人工客服不专业','对自如政策不满意','对管家服务不满意'],['问题已经解决了','服务态度好','有责任心','积极暖心']],//显示的原因
      //信息提示
      showMsg: function (message, callback) {
        if (message == '缺少参数!') {
          message = '请您填写完整!'
        }
        layer.msg(message, {
          shift: 0,
          area: this.getSuitSize()
        }, function () {
          if (callback) {
            callback()
          }
        })
        $(window).trigger('resize')
      },
       // 获取提示框合适的大小
      getSuitSize: function () {
        return MN_Base.isPC() ? '400px' : '0.8rem'
      },
      /*用于添加评价框后，事件的绑定*/
      doSta:function(){
        var This=this;
        //绑定关闭窗口
        $('.helpfull-close').off('click').on('click',function(){
            $(this).parents('.MN_answer').remove();
            //如果未评价，则isShow清零
            if(sessionStorage.getItem('isShow')!='已评价'){
                sessionStorage.setItem('isShow',0); 
            }
        })
        //星级评价 点击 操作样式
        /**taskIdId=780自如定制，人工邀请五星评价内容 Amend By zhaoyuxing 
          * 说明：点击五星评价时，重新加载并文案以及原因，清空原先已选择的原因，提交按钮至灰
          * 功能：不满意的原因绑定点击事件，并将原因存入input中
         */

        //默认显示6条问题的原因
        var reasonHtmlDefault='';
       
        for(var i=0;i<This.staReasonList[0].length;i++){
            reasonHtmlDefault+='<div class="staReasonItem" isselected=false>'+This.staReasonList[0][i]+'</div>';
        }
        $('.staReasonList').html(reasonHtmlDefault);

        $('.helpGrade').on('click',function(){
            var _this=$(this);
            var count=_this.attr('data-grade');
            var level='';//评价等级 4非常不满意 0不满意  2一般  1满意 3非常满意
            var _staWord=$('.staWord');//存储评价文案内容
            // 将等级存入#helpLevel元素中
            if(count==1){
                level=4;
            }else if(count==2){
                level=0;
            }else if(count==3){
                level=2;
            }else if(count==4){
                level=1;
            }else{
                level=3;
            }
            $('#helpLevel').val(level);
           
            for(var i=0;i<count;i++){
                $('.helpGrade').eq(i).css('color','#FFA000')
                    .children().removeClass('fa-star-o')
                    .addClass('fa-star')
            }
            
            //处理重新选择：下一个星是否已选，若已选择，则删除之后所有已选择样式
            var reChoose=_this.next().children().hasClass('fa-star');
            if(reChoose){
               for(var j=count;j<5;j++){
                    $('.helpGrade').eq(j).css('color','#9F9F9F')
                    .children().removeClass('fa-star')
                    .addClass('fa-star-o')
               }
            }
             //显示等级文案
             _staWord.html(This.staWordList[count-1]);
             _staWord.show();
 
            //显示问题的原因
             var reasonHtml='';
             var reasonType='';//用于存储原因显示的类型：0 1-4星的原因 1 5星的原因
             if(count==5){
                 reasonType=1 
             }else{
                 reasonType=0 
             }
             for(var i=0;i<This.staReasonList[reasonType].length;i++){
                 reasonHtml+='<div class="staReasonItem" isselected=false>'+This.staReasonList[reasonType][i]+'</div>';
             }
             $('.staReasonList').html(reasonHtml);
             //切换评价等级时，清空已经存储的评价原因,按钮至灰
             $('#staReason').val('');
             $('#helpComBtn').parent().addClass('helpfull-commit-disable');
        })
        /**taskIdId=780自如定制，人工邀请五星评价内容 Amend By zhaoyuxing 
          * 说明：修改满意度评价样式，增加显示等级文案以及原因
          * 功能：不满意的原因绑定点击事件，并将原因存入input中,并使得按钮可用
         */
      
        var _reasonInput= $('#staReason');
        $('.staReasonList').off('click').on('click','.staReasonItem',function(){
            $(this).toggleClass('staReasonItem-selected');
            var noselect=eval($(this).attr('isselected'));//获取当前标签选中的状态
            $(this).attr('isselected',!noselect);

            var reason='';//存储s=faceBack sub的值,每次添加评价框时，清空内容
            //获得所有被选中的选项的原因
            $('.staReasonItem[isselected=true]').each(function(){
                reason+=$(this).html()+',';
            });

            _reasonInput.val(reason.substring(0,reason.length-1));
            if(_reasonInput.val()&&$('#helpLevel').val()!=-1){
                $('#helpComBtn').parent().removeClass('helpfull-commit-disable');
            }else{
                $('#helpComBtn').parent().addClass('helpfull-commit-disable');
            }
        })

        $('#helpContent').on('touchstart',function(e){
            $(this).focus();
        })
        $("#helpContent").on('touchmove',function(e){
            if (e.stopPropagation) {       
                    e.stopPropagation(); 
                }else {            
                    window.event.cancelBubble = true; 
              } 
        })     
      }
    }
      //taskId: 418 自如页面定制 满意度评价 点击满意度评价按钮s=fadeback，推送评价框
    $('.feedbackCtn').on('click.FA',function(){
            //机器人聊天状态下 用于存储评价框是否已推送 防止重复推送
            if(sessionStorage.getItem('isShow')=='已评价'&&sessionStorage.getItem('evaluationType')==0){
                faqrobotModule.showMsg('您好，您已评价过，感谢您对我们工作的支持！');
            }else if(sessionStorage.getItem('isShow')==1&&sessionStorage.getItem('evaluationType')==0){//已显示评价框 不作操作
                return;
            }else if(sessionStorage.getItem('isShowP')=='已评价'&&sessionStorage.getItem('evaluationType')==1){// 人工已主动评价
                faqrobotModule.showMsg('您好，您已评价过，感谢您对我们工作的支持！');
            }else{
                //客服触发满意度评价时，确保当前页面仅有一个评价框，清除页面上其他的评价框
                if($('.helpCtn').length){
                    for(var i=0;i<$('.helpCtn').length;i++){
                        $('.helpCtn').eq(i).parents('.MN_answer').remove();
                    }
                }
                $('#chatCtn').append(faqrobotModule.staHtml);
                //自动滚动到底部
                var j = 0;
                var timer = setInterval(function() {
                    $('body').scrollTop(1000000);
                    FAQ.scrollbar.scrollTo('bottom', true);
                    if(j>=5) {
                        clearInterval(timer);
                    }
                    j++;
                }, 100);
                 //在机器人状态时，已显示评价框，则不再显示评价框
                if(sessionStorage.getItem('evaluationType')==0){
                    sessionStorage.setItem('isShow',1);
                    sessionStorage.setItem('isClose',0);
                }    

                faqrobotModule.doSta();
            }
    })  

    /*taskId=879 自如定制push消息需求  Add by zhaoyuxing
    *说明：1、提供一个全局的方法（下线），与自如app交互；当app进入后台是，自动调用该方法
    *    2、在调用下线请求前，必须清空定时器，防止下线后调用其他接口
    *    3、提供一个全局的方法（上线），与自如app交互；当从app进入页面时，自动调用该方法
     */
    window.ZIROOMAppBackStage=function (){
        FAQ.clearInterTimer();
        FAQ.offline();
    }

    window.ZIROOMAppComeActive=function(){
        //清空页面
        FAQ.clearAllRecord();
        FAQ.recordIndex=0;
        FAQ.initBaseInfo();
        FAQ.timeRequest();
        var timerDown = setInterval(function() {
            FAQ.scrollbar.scrollTo('bottom', true);
                $('body').scrollTop(1000000);
                clearInterval(timerDown);
        }, 100);
    }
    /**
     * 说明：点击“否”取消接入VIP客服，点击“是”确定接入VIP客服,点击“点我解决”弹出模态框
    */ 
    vipInsert()
    function vipInsert(){
        //否
        $('#'+FAQ.options.cancelInsert).on('click',function(){
            $('.'+FAQ.options.vipInsert).modal('hide')
        })
        //是
        $('#'+FAQ.options.sureInsert).on('click',function(){
            FAQ.pushChannel()
        })
    }
});

