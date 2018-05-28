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
        $('.chatScroll').height(winH-$('.editCtn').outerHeight()-40);
    }

    $(window).on('resize', function() {
        set_chatScroll_height();
    });

	//调用自动补全插件 taskId=408 自如定制 点击推荐内容后，自动发送信息
    $('.textarea').autocomplete({
        url: 'servlet/appChat?s=ig',//[string]
        targetEl: $('.editShow'),//参照物(用于appendTo和定位)
        posAttr: ['0rem', '0.133rem'],//外边框的定位[left bottom]
        itemNum: 5,//[int] 默认全部显示
        callback: function(data) {//获取文本后的回调函数
            //由于发送按钮被隐藏，直接调用发送事件
            $('.sendBtnNew').trigger('click');

        }
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
    
    $(document).on('touchstart',function(e){
        if(!$(e.target).is('.textarea')) {
             $('.textarea').blur(); 
        } 
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
        //src: 'src/yun/',//表情路径
        src: 'src/sq/',//表情路径 takId 408 自如表情
        rowNum: 7,//每行最多显示数量，此属性不适用于常用语
        lineNum: 3,//多少列
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
    $('.commonQueCtn').on('click', function() {
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
    $('#sendLeaveMsg').on('click', function() {
        // layerCtn = layer.open({
        //     type: 1,
        //     title: '吐糟',
        //     content: $('#leaveMsgBox'),
        //     area: ['1rem', '100%'],
        //     end: function() {
        //         set_chatScroll_height();
        //     },
        // });
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
        $("#leaveMsgBox").css("display","block");
        FAQ.writeMsg()
    })
    /*TaskId:  408 自如页面定制
    *原因：无修改颜色 删除图标变蓝代码
    */
    /*点击输入框下面图标变蓝*/


    // authUser.photoUrl

    var FAQ;

    function FAQInit(token) {
        //faqrobot
        FAQ = new Faqrobot({
            isSQ: true, // 是否是上汽
            token: token,
            isEmptySayHello: isEmptySayHello,
            setInputTop: true,
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
            sendBtnId: 'sendBtnNew',//发送按钮Id y   ------
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
                $('.addbtn').show();
                $('#textarea').focus()
                $('#sendBtnNew').hide();
            },
            commentCallback: function() {//评论后的回调
                layer.close(layerCtn);
            },
            leaveMsgCallback: function() {//留言后的回调
                layer.close(layerCtn);
            },
        });
    }


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
  
    $('.textarea').click(function() {
        $('.textarea').focus();
    })
        
    
    // 人工评价
    $('body').on('click', '.RG_commentBtn', function() {
        window.uuid = $(this).attr('uuid');// 客服要求客户评价
        $('.feedback').trigger('click');
    });


   


    /*********************************************************************************
     *                              上汽定制
     **********************************************************************************/

    // 整车商城入口参数（展示，传入s=aq）
    var businessOrderNo = '';
    var refundNo = '';
    var isEmptySayHello = false;
    var goodsDataContent = '';
    var hasGetToken = false; // 是否已调用获取token的方法

     SQinit();


     function SQinit() {
        //  获取商品或订单详情
        getDetail();
        // 获取url参数
        getUrlArgument();
        // 获取token 初始化机器人
        if(!hasGetToken){
            getTokenFn();
        }
     }


    $('#location').click(function() {
        window.getLocation(function(data) {
            $('#chatCtn').append(data)
        });
    });



    function getUrlArgument() {
        var businessOrderNo = getUrlQuery('businessOrderNo');
        var refundNo = getUrlQuery('refundNo');
        if(!businessOrderNo && !refundNo ){
            return
        };
        isEmptySayHello = true;
        // alert('订单编号(businessOrderNo:)'+(businessOrderNo?businessOrderNo:''));
        // alert('退款编号(refundNo:)'+(refundNo?refundNo:''));
        renderGood({
            businessOrderNo:businessOrderNo,
            refundNo:refundNo
        },'',true)
        // 获取token 初始化机器人
        if(!hasGetToken){
            getTokenFn();
        }
    }

    /**
     * 获取商品或订单详情
     */
    function getDetail() {
        var goodId = getUrlQuery('id');
        var method = getUrlQuery('method');
        if(!goodId || !method){
            return 
        }
        isEmptySayHello = true;     
        $.ajax({
            type: 'post',
            url: '../getSQGoods?id='+goodId+'&method='+method,
            data:{},
            cache:false,
            async: false,
            success: function(data) {
                renderGood(data,method);
                goodsDataContent = data ;
                // 获取token 初始化机器人
                if(!hasGetToken){
                    getTokenFn();
                }
                // alert('商品信息'+data);
                // alert('method:'+method);
            }
        })


        // 测试
        // var goodsData = {
        //     id:null,
        //     name:'多slu到货通知多slu到货通知多slu到货通知多slu到货通知多slu到货通知多sl',
        //     price:'16.88-25.18万',
        //     link: 'http://139.199.58.172/index.php/wap/item-detail.html?item_id=150',
        //     img_url:'../robot/skin/h5chat/images/robot.png'
        // };

        // var orderForm = {
        //     id:321321321321321,
        //     createtime:"2018-04-17 13:39:17",
        //     status: "已下单等待付款",
        //     link: 'http://139.199.58.172/index.php/wap/trade-detail.html?tid=229654156456'
        // }
        // renderGood(goodsData,method)
        
    }


    /**
     * 展示商品或订单详情
     */
    function renderGood(data,method,vehicle) {
        if(!vehicle){
            data = JSON.parse(data);
        }
        if(method == 'itemCallback'){
            $('#chatCtn').append(
                '<div class="goodModule" style="background: #fff; padding: 8px 20px;">'+
                    '<div style="width:15%;display:inline-block;float:left;"><img src="'+ data.img_url +'"></div>'+
                    '<div style="display:inline-block;width:80%;padding-left:10px;">'+
                        '<span style="width:100%;" class="pull-left">'+ data.name +'</span>'+
                        '<span style="width:100%; margin-top:2px;color: #000;" class="pull-left">￥'+ data.price +'</span>'+
                    '</div>'+
                    '<span class="emitGoods" style="width:100%; display: inline-block;display: flex;justify-content: center;"><button class="btn btn-primary" style="margin-top:10px;" type="button">发送详情</button></span>'+
                '</div>'
            )
        }else if(method == 'tradeCallback'){
            $('#chatCtn').append(
                '<div class="goodModule" style="background: #fff; margin-top:10px;">'+
                    '<div style="display:inline-block;width:100%;">'+
                        '<span style="width:100%;" class="pull-left">订单号：'+ data.id +'</span>'+
                        '<span style="width:100%;margin-top:2px;" class="pull-left">创建时间：'+ data.createtime +'</span>'+
                        '<span style="width:100%; margin-top:2px;" class="pull-left">状态：'+ data.status +'</span>'+
                        '<span class="emitGoods" style="width:100%;margin-left: -45px; display: inline-block;display: flex;justify-content: center;"><button class="btn btn-primary" style="margin-top:5px;" type="button">发送详情</button></span>'+
                    '</div>'+
                '</div>'
            )
        }

        if(vehicle){
            var refundNo = '';
            if(data.refundNo){
                refundNo = '<span style="width:100%; margin-top:5px;" class="pull-left">退款编号：'+ data.refundNo +'</span>'
            }
            $('#chatCtn').append(
                '<div class="goodModule" style="background: #fff; margin-top:10px;">'+
                    '<div style="display:inline-block;width:100%;">'+
                        '<span style="width:100%;" class="pull-left">订单编号：'+ data.businessOrderNo +'</span>'+
                        refundNo+
                        '<span class="emitGoods" style="width:100%;margin-left: -45px; display: inline-block;display: flex;justify-content: center;"><button class="btn btn-primary" style="margin-top:10px;" type="button">发送详情</button></span>'+
                    '</div>'+
                '</div>'
            )
        }
    }


    $('body').on('click','.emitGoods>button',function() {
        var sysNum =  getUrlQuery('sysNum');
        var method = getUrlQuery('method') ? getUrlQuery('method') : '';
        var refundNo = getUrlQuery('refundNo') ? getUrlQuery('refundNo') : '';
        var businessOrderNo = getUrlQuery('businessOrderNo') ? getUrlQuery('businessOrderNo'): '' ;
 
        $.ajax({
            url:'../servlet/appChat',
            type:'post',
            data:{
                sysNum: sysNum,
                s: 'aq',
                question: '发送商品详情',
                method: method,
                dataContent: goodsDataContent,
                refundNo:refundNo,
                businessOrderNo:businessOrderNo,
                sendMessage:1
            },
            cache:false, 
            success:function(data){
                if(data.status == 0){
                    layer.msg("发送成功"); 
                }else{
                    layer.msg("网络连接不良请稍候再试"); 
                }
            }
        })
    })

    
    $('.backQuit').click(function() {
        var goodId = getUrlQuery('id');
        var method = getUrlQuery('method');
        var businessOrderNo = getUrlQuery('businessOrderNo');
        var refundNo = getUrlQuery('refundNo');
        // 关闭页面时，机器人下线
        // alert('机器人下线')
        FAQ.offline();
        // 离开页面跟踪方法
        leavePage();
        closeWebView('default',function(data) {
            $('#chatCtn').append(data)
        });
        // if(!goodId && !method && !businessOrderNo && !refundNo){
        //     closeWebView('default',function(data) {
        //         $('#chatCtn').append(data)
        //     });
        // }else{
        //     window.history.go(-1);
        // }
    })

    /**
     * 上汽获取token
     */
    function getTokenFn() {
        try {
            hasGetToken = true ;
            if(typeof getToken === 'function'){
                getToken(
                    function(data){
                        // alert("获得token " + data.token);
                        FAQInit(data.token);
                    }
                );
            }else{
                // alert('无法调用获取token方法')
                FAQInit();
            }
        } catch (error) {
			FAQInit();
		}
    }


    /**
     * 是否展示售前售后按钮(暂时不做，0730后)
     */
    function isShowServie() {
        var source = getUrlQuery('source');
        if(socurce === 1){
            $('.service').removeClass('hide');
        }
    }
});




// 获取 url参数
function getUrlQuery(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return false;
}

//离开页面跟踪
function leavePage(){
    tracker.sendActivityEnd({
        activity: '100413',// 页面id
        user_type: 'member'
    });
}

