;$(function() {
    //调用表情插件
   
   var Face = $('.textarea').face({
       src: 'src/yun/',//表情路径
       open: false,
   });
   var FAQ ='';
       FAQ = new Faqrobot({
           logoUrl: 'skin/demo/image/logo.png',//logo地址 ----------
           logoId: 'logo',
           intelTitleChange: true,// 智能聊天是否修改标题
           artiTitleChange: true,// 人工时是否修改标题
           artiTitle: '人工客服',// 人工时的标题
           robotInfo:'robotInfo',
           /**
            * taskid=554 顾荣  ppmoney客服头像与机器人 2018/1/5
            * 原因：区分是机器人客服还是人工客服
            * 修改：添加服图标分为机器人和人工客服
            */
           kfPic: 'robot/skin/zbj2/images/servIcon.png',  //客服图标
           kf_Robot_Pic: 'robot/skin/zbj2/images/servIcon.png',  //机器人客服图标
           kf_Person_Pic: 'robot/skin/zbj2/images/servIcon.png',  //人工客服图标
           kf_Robot_Name:'',//机器人客服名字，此处只是声明个变量，不用赋值
           kf_Person_Name:'',//人工客服名字
           khPic: 'robot/skin/zbj2/images/userIcon.png', //客户图标
           formatDate: '%month%月%date%日 %hour%:%minute%:%second%',//配置时间格式(默认10:42:52 2016-06-24)
           topQueId: 'showhotone',//热门、常见问题Id --------
           quickServId: 'showhotthree',//快捷服务Id
           recommendLinkId: 'showhottwo',//推荐问题Id
           thirdUrlId:'thirdUrl',
           chatCtnId: 'left_content',//聊天展示Id y   --------------
           inputCtnId: 'sendtxt',//输入框Id y   --------
           sendBtnId: 'inputPR',//发送按钮Id y   ------
           copyrightId:'copyright',// 版权及联系我们
           tipWordId: 'inputTip',
           tipWord: '请完整描述您的问题，比如:如何发布服务',//输入框提示语
           commentFormId: 'feedBackForm',//评论框formId -------
           commentInputCtnId: 'feedBackInput',//评论输入框Id ----
           commentSendBtnId: 'feedBackBtn',//评论发送按钮Id ---------
           commentTipWordId: 'feedBackTip',//评论输入框提示语Id
           artiSearchId: 'artiSearch',//智能搜索
           artiSearchCallback: function(data) {
               if(data.fullTextSearch) {
                   $('.thirdURL').addClass('thirdURLRecommend');
                   $('.artiSearch').removeClass('artiSearchHide');
                   $('.itemCtn').css('width', '25%');
                   $('.itemHead4').trigger('click');
               }else {
                   $('.artiSearch').addClass('artiSearchHide');
                   if($('.thirdURL').hasClass('thirdURLRecommend')){
                       //存在推荐链接
                       $('.itemCtn').removeAttr('style');
                   }
                   if($('.itemHead4').is('.itemHeadFocus')) {
                       $('.itemHead1').trigger('click');
                   }else {
                       $('#artiSearch').hide();
                   }
               }

           },
           leaveQue: {// 未知问题已回复
               open: true,//是否启用功能
           },
           autoSkip: {//手机不能访问pc页面
               open: true,//是否启用功能
               chatUrl: 'h5chat',// 默认跳转的页面
           },
           clearBtnId: 'clearScreen',//清除按钮Id
           closeBtnId: 'closeBtn',//关闭聊天页面
           faceModule: {//表情模块
               open: true,//是否启用功能
               faceObj: Face,//表情插件实例
           },
           poweredCtnId: 'power',//技术支持Id
           thirdUrlCallBack:function(data,index){
               if(!index)index=0;
               if(data.robotAnswer[index].thirdUrl && data.robotAnswer[index].thirdUrl.url){
                   $('.thirdURL').removeClass('thirdURLRecommend');
                   $('.itemHead5').trigger('click');
                   $('.itemCtn').css('width', '25%');
                   if(!$('.artiSearch').hasClass('artiSearchHide')){
                       $('.artiSearch').addClass('artiSearchHide')
                   }
                   $('#'+ FAQ.options.thirdUrlId+' iframe').attr('src',data.robotAnswer[index].thirdUrl.url);
                }else{
                   $('.thirdURL').addClass('thirdURLRecommend');
                   $('.itemCtn').removeAttr('style');
                   $('.itemHead1').trigger('click');
                };
           },
           topQueCallBack:function(){//热门问题
                formatQueULList();
           },
           recommendLinkCallBack:function(data){//推荐资讯
                setRecommendHot();
                recommendRoll();
           },
           initCallback:function(data){
            window.uselessReasonItems = data.uselessReasonItems
                this.kfHtml[0]='<div class="MN_answer_welcome MN_answer"><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%helloWord%</div><div class="MN_kfName">%robotName%</div></div>'
                this.kfHtml[1]='<div class="MN_helpful" style="margin-top: 8px;padding-top: 8px;"><span class="MN_reasonSend">提交</span><span style="color:#999; font-size:12px;">以上内容对您有帮助吗？</span><span class="MN_yes robot_review_yes"></i>有帮助</span><span class="MN_no"></i>无帮助</span></div>',//是否满意组合
                this.kfHtml[2]='<div class="MN_answer" aId="%aId%" cluid="%cluid%"><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%ansCon%%gusListHtml%%relateListHtml%%commentHtml%</div><div class="MN_kfName">%robotName%</div></div>'//回答组合
                this.khHtml='<div class="MN_ask"><div class="MN_khCtn"><img class="MN_khImg" src="%khPic%"><i class="MN_khTriangle1 MN_triangle"></i><i class="MN_khTriangle2 MN_triangle"></i>%askWord%</div><div class="MN_khName">我</div></div>'//客户结构
           }
       });
       FAQ.relateListStart=1;//智能推荐排序从1开始


    var maxTopQuestions=7;			//最多展示的常见问题的个数
   //bodyRight调用滚动条插件
   /**
   * taskid=802 后台通用功能，快捷服务本地打开 顾荣 2018/2/9
   * 添加：点击快捷服务可在iframe中打开网页
   */

   if($('#itemCtxCtnBox').length > 0){
     var bodyRight_scrollbar = $('#itemCtxCtnBox').scrollbar({
       'autoBottom': false,//内容改变，是否自动滚动到底部
     });
   }

   $(".itemBtnCtn .itemCtn").click(function(){
       setTimeout(function(){
           bodyRight_scrollbar.update()
       },100)
   })

   //调用自动补全插件
   $('.input').autocomplete({
       url: 'servlet/AQ?s=ig',
           targetEl: $('.inputCtn'),//参照物(用于appendTo和定位)
           posAttr: ['0px', '100px'],//外边框的定位[left bottom]
           itemNum: 10,//[int] 默认全部显示
           callback: function(data) {//获取文本后的回调函数
               $('.sendBtn').trigger('click');
       }
   });

  
   //icheck
   $('[type=checkbox]').iCheck({
       checkboxClass: 'icheckbox_square-blue',
       radioClass: 'iradio_square-blue',
   });

   //单选按钮
   $('.servYes').on('click', function() {
       $(this).addClass('servYes_hover').siblings('.servCos').removeClass('servNo_hover').next().removeAttr('checked');
       $(this).next().prop({'checked': 'checked'});
       $('.servNoReason').hide();
       bodyRight_scrollbar.update();
   });
   $('.servNo').on('click', function() {
       $(this).addClass('servNo_hover').siblings('.servCos').removeClass('servYes_hover').next().removeAttr('checked');
       $(this).next().prop({'checked': 'checked'});
       $('.servNoReason').show();
       bodyRight_scrollbar.update();
   });

   // 切换标签页效果
   $('.itemCtx:not(:first)').hide();
   $('body').on('click', '.itemHead', function() {
       $('.itemHead').removeClass('itemHeadFocus');
       $(this).addClass('itemHeadFocus');
       $('.itemCtx').hide();
       $('.itemCtx[index="'+ $(this).attr('index') +'"]').show();
   });

   // 人工评价
   $('body').on('click', '.RG_commentBtn', function() {
       window.uuid = $(this).attr('uuid');// 客服要求客户评价
       $('.itemHead3').trigger('click');
   });

   var maxSize = [960, 880],//1:1 尺寸
       autoSize = [];//实时尺寸

   
   set_whole_size();
   set_body_height();
   set_bodyLeftTop_height();
//    set_bodyLeft_width();
   set_bodyright_iframe_height();
   formatQueULList();
   $(window).on('resize.TH', function() {
       set_whole_size();
       set_body_height();
       set_bodyLeftTop_height();
    //    set_bodyLeft_width();
       set_bodyright_iframe_height();
   });

   function set_whole_size() {
       var winW = $('body').width(),
           winH = $('body').height();
       
       autoSize[0] = winW>=maxSize[0] ? maxSize[0] : winW;
       autoSize[1] = winH>=maxSize[1] ? maxSize[1] : winH;

       $('.whole').css({
           'width': autoSize[0],
           'height': autoSize[1],
           'margin-left': -autoSize[0]/2,
           'margin-top': -autoSize[1]/2,
       });
   }
   function set_body_height() {
       $('.body').height($('.whole').outerHeight() - $('.head').outerHeight());
   }
   function set_bodyLeftTop_height() {
       $('.bodyLeftTop').height($('.bodyLeft').outerHeight() - $('.bodyLeftBottom').outerHeight());
   }
   function set_bodyLeft_width() {
       $('.bodyLeft').width($('.whole').outerWidth() - $('.bodyRight').outerWidth());
   }
    function set_bodyright_iframe_height() {
       $('#thirdUrl iframe').height($('.bodyRight').outerHeight() - 50);
   }
   function getUrlParam(name) {
       var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
       var r = window.location.search.substr(1).match(reg);  //匹配目标参数
       if (r !== null) return decodeURIComponent(r[2]); return null; //返回参数值
   }

   /* 热门问题样式 Add by zhaoyuxing
    *作用：1、设置显示热门的条数 2、前三条显示“hot”标注
   */
  function formatQueULList(){
    var queList=$('#showhotone .MN_queList'),
        queListLength=queList.length;
    var hotHtml='<span class="hot"></span>',
        newHtml='<span class="new"></span>' ;    //hot标志的模板
    if(queListLength>=maxTopQuestions){
        for(var i=maxTopQuestions;i<queListLength;i++){
            queList.eq(i).hide();
        }
    }
    //设置显示“hot”标注的条数
    var num=0;
     if(queListLength>=3){
        num=1;
        queList.eq(2).append(newHtml);
    }else if(queListLength==2){
        num=1;
    }else if(queListLength==1){
        num=0;
    }
    
    if(queListLength>0){
        for(var j=0;j<=num;j++){
            queList.eq(j).append(hotHtml);
        }
    }
    
}

    /* 推荐信息增加hot字样 Add by zhaoyuxing
    *作用：1、前2条显示“hot”标注
   */
  function setRecommendHot(){
    var recommendList=$('#showhottwo').children(),
    recommendListLen=recommendList.length;
    var hotHtml='<span class="hot"></span>';  

    if(recommendListLen>=2){
        recommendList.eq(0).append(hotHtml);
        recommendList.eq(1).append(hotHtml);
    }else if(recommendListLen==1){
        recommendList.eq(0).append(hotHtml);
    }
  }

    /* 推荐信息滚动 Add by zhaoyuxing
    *作用：1、设置显示热门的条数 2、前三条显示“hot”标注
   */
  function recommendRoll(){
      
     var wholeH = $(".fuzb2 #recomdCtn").height(),//获取整个推荐显示框的高度
        contentH=$(".fuzb2 #showhottwo").height();//获取整个推荐内容的高度
    var recList=$('#showhottwo').html();
    for(var i=0;i<15;i++){
        if(contentH<wholeH){
            $(".fuzb2 #showhottwo").append(recList);
            contentH=$(".fuzb2 #showhottwo").height();
        }else{
            break;
        }
    }

    var xTimer,
        $target = $("#recomdCtn"),
        $up = $target.parent();
        $down = $('#showhottwo');
    $target.on("mouseout", function() {
        xTimer = setInterval(function() {
            $down.css({"top":"-=.2px"});
            if(parseInt($down.css("top")) <-contentH/10) {
                $down.css({"top":"0"});
            };
        }, 10);
    });
    $target.on("mouseover", function() {
        clearInterval(xTimer);
    });
    
    xTimer = setInterval(function() {
        $down.css({"top":"-=.2px"});
        if(parseInt($down.css("top")) <-contentH/10) {
            $down.css({"top":"0"});
        };
    }, 10);
   
  }

   //调用自动补全插件
   $('#sendtxt').autocomplete({
        url: 'servlet/AQ?s=ig',
            targetEl: $('.b-f-ctn'),//参照物(用于appendTo和定位)
            posAttr: ['0px', '123px'],//外边框的定位[left bottom]
            itemNum: 10,//[int] 默认全部显示
            callback: function(data) {//获取文本后的回调函数
                $('#inputPR').trigger('click');
        }
    });





    

   /*原*/

	//初始化一些常用的DOM对象
	// var nu=[];
	// var chatContDIv = $("#"+options.chatContDiv);
	// var parentchatContDIv=chatContDIv.parent();
	// var $input = $(input);
    // //提示条
    // var showerrorDiv=$("#"+options.showErrorId);
	// var timeout;
	// var previousValue = "";
	// //<<<<<<<<
	// var comeUrl=window.location.href.split('?');
	// var getjid=[];
	// if(comeUrl[1]){
	// 	if(comeUrl[1].indexOf("jid=")!==-1){
	// 		getjid=comeUrl[1].split('&');
	// 	}else{
	// 		getjid=[''];
	// 	}
    // }
  

});

 