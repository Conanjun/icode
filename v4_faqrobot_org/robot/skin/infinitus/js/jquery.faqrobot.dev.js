/*
 * jQuery faqrobot plugin 1.1
 *
 * Copyright (c) 2012 wang qingchen  qcwang@iyunwen.com
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.faqrobot.js 15 2014-03-25 10:30:27Z wang qingchen $
 */

;(function($) {

$.fn.extend({
	faqrobot: function(sysNum, options) {
		var isSysNum = typeof sysNum == "number";
		options = $.extend({}, $.FaqRobot.defaults, {
            //默认配置选项
			sysNum: isSysNum ? sysNum : 10000
			
		}, options);
		
		return this.each(function() {
			new $.FaqRobot(this, options);
		});
	}
});


    $.FaqRobot = function(input,options) {
		//自动补全参数配置
        var acoption = {
            //width: $("#"+options.inputMsgArea).width(),
            max: 10,
            delay: 100,
            matchSubset:false,//自动查询缓存
            scroll: false,
            //minChars: 2,
            scrollHeight: 400,
            dataType: 'json',
            selectFirst:false,
            highlight:function(value, term) {
                var terms = term.split('');
                var none = "";
                $.each(terms, function(i, n){
                    if(none.indexOf(n)==-1){
                        none+=n;
                        value=value.replace(new RegExp("(?![^&;]+;)(?!<[^<>]*)(" + n.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, "\\$1") + ")(?![^<>]*>)(?![^&;]+;)", "gi"), "<strong>$1</strong>");
                    }
                });
                return value.replace('<strong></strong>','');
            },
            parse: function(data) {
                var rows = [];
                for(var i=0; i<data.list.length; i++){
                    rows[rows.length] = {
                        data:data.list[i],
                        result:data.list[i].question
                    };
                }
                return rows;
            },
            formatItem: function(row, i, max) {
                //return '<span>[' + row.ht + ']</span>'+i + '. ' + row.q ;
                return i + '. ' + row.question ;
            },
            formatMatch: function(row, i, max) {
                return row;
                return row.question + row.hits;
            },
            formatResult: function(row) {
                return row;
                return row.question;
            }

        };

	
	//初始化一些常用的DOM对象
	var nu=[];
	var chatContDIv = $("#"+options.chatContDiv);
	var parentchatContDIv=chatContDIv.parent();
	var $input = $(input);
    //提示条
    var showerrorDiv=$("#"+options.showErrorId);
	var timeout;
	var previousValue = "";
    //*******************************各种绑定事件开始*************************************//
	
	/*^^^^^^^^^^^^^^^^^^^*/
    //文本框发生的事件

        $input.focus(function(){
            if($(this).val()==$(this).attr("oldvalue")){
                $(this).val("");
            }
            $(this).css("color","#333");
            $(this).parent().addClass("robot_inputon");
        }).blur(function(){
                if($(this).val()==""){
                    $(this).val($(this).attr("oldvalue"));
                    $(this).css("color","#999");
                } else{
                    $(this).css("color","#333");
                }
                $(this).parent().removeClass("robot_inputon");
          }).autocomplete(options.basePath+'AQ?s=ig&sysNum='+options.sysNum, acoption).result(function(event, row, formatted) {
                event.preventDefault();
          }).keyup(function(event){
                var e = event || window.event;
                if(e.keyCode==27){
                    $(this).unautocomplete();
                }
                isHotKey = (hkey=='Enter' && !e.ctrlKey && e.keyCode==13)||
                    (hkey=='CtrlEnter' && e.ctrlKey && e.keyCode==13);
                if( isHotKey ){
                    sendeMsg();
                    return false;
                }
                return true;
            }).keydown(function(){
                word_clu(this);
            });


    //下面开始绑定意见反馈
        if(options.fadeBackId && options.fadeBackId.length>2){
            $('#'+options.fadeBackId).on('click',function(){
				fadeback(this);
			})
        }
	//下面开始faqrobot主要的方法的书写
	
	//请求的基本函数，所有的与服务器的请求全都必须经过这个方法
	function request(url, successed, failure,dataType,params) {
		if( (typeof url == "string") && (url.length > 0) ){
			var extraParams = {
				timestamp: +new Date(),
				dataType :	dataType || options.dataType
			};
			extraParams = $.extend({}, extraParams, params);
			$.each(options.extraParams, function(key, param) {
				extraParams[key] = typeof param == "function" ? param() : param;
			});
			
			$.ajax({
				dataType: options.dataType,
				url: encodeURI(url),
				data: extraParams,
				success: function(data) {
					var parsed = options.parse && options.parse(data) || parse(data);
					if(parsed.status<0 && typeof failure == "function"){
						failure(parsed);
						return;
					}
					if(parsed.status==-1){
						if(requestTimes<5){
							initRobotBaseInfo();
							requestTimes++;
						}else{
							options.showErrorMsg &&options.showErrorMsg(data) || showErrorMsg(parsed.message || "请求信息错误，请刷新！");
							return;
						}
					}
					if(parsed.status==-2){//身份认证错误，需要重新登录
                        options.showErrorMsg&&options.showErrorMsg(data) || showErrorMsg(parsed.message || "您的信息认证未通过，请重新认证！",options.authUrl);
						return;
					}
					keepCount=0;//如果有消息发送，请求的次数恢复到0；
					getNewTime(parsed);
					if(typeof successed == "function"){
						successed(parsed);
					}
					/*^^^^^^^^^*/
					//自动滚动到底部  left_content  sendtxt  inputPR
					var scrollTop = $("#"+options.chatContDiv)[0].scrollHeight;
					$("#"+options.chatContDiv).scrollTop(scrollTop);
					return;
				},
				error:function() {
					var parsed = options.showErrorMsg && options.showErrorMsg(data) || showErrorMsg("数据请求错误，请刷新！");
				}
			});
			
		}
	};
	//展示错误的消息内容
	function showErrorMsg(msg,otherUrl,timeOut){
		//此部分是展示错误信息的方法
        showErrorDiv(msg,function(){
				if(otherUrl && typeof otherUrl == "string" ){
					location.href=otherUrl;//第三方的地址跳转
				}
			});
	}
	//解析请求获取的各种数据
	function parse(data){
		return data;
	}
	//初始化机器人的基本信息
	function initRobotBaseInfo(){
		//赋值站点的唯一识别的站点标示
		if(window.location.href.indexOf("sysNum=")!==-1){
			options.sysNum=window.location.href.split("sysNum=")[1].replace("#","");
		}
		$input.attr('oldvalue',options.inputMagOldvalue);
		$input.text(options.inputMagOldvalue);
		var infoUrl = options.basePath +'AQ?s=p&sysNum='+options.sysNum+'&sourceId='+options.sourceId;
		request(infoUrl,sayHello);
		
	}
	//初始化机器人获取问题
	
	function getQueryString(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return r[2];
		return null;
	}
	
	var r_intQuesUrl = function(){
		var queTxt = getQueryString("qa");//获取问题的文字
		var que = getQueryString("q");//获取问题的文字
		
		if(queTxt){
			queTxt = decodeURI(queTxt);
			showMyWordsToForm(queTxt);
			askQue(queTxt);
		}
		if(que){
			que = decodeURI(que);
			$input.val(que);
		}
	}
	
	
	//展示机器人的各种基本信息内容
	function sayHello(data){
		
		$input.focus();
        if(data.status==-1){
            showErrorDiv("网络有点不给力，请刷新页面尝试。");
            return;
        }
        if(data.status==-2){//身份认证错误，需要重新登录
            showErrorDiv("您的信息认证未通过，请重新认证！");
            location.href=data.loginurl;
            return;
        }
		//设置机器人的名字
		if(typeof data.webConfig.robotName!="undefined"){
			options.robotName=data.webConfig.robotName;
		}
		if(typeof data.webConfig.logoUrl!="undefined"){
			options.logoUrl=data.webConfig.logoUrl==''?"skin/chat5/images/logo.png":data.webConfig.logoUrl;
			$('#'+options.logoDiv).attr('src',options.logoUrl);
		}
		
		//是否付费
		if(typeof data.webConfig.level!="undefined" &&  data.webConfig.level>=2 && typeof data.webConfig.webName !='undefined'){
			$(document).attr("title",data.webConfig.webName);
		}else{
			$(document).attr("title",'Faqrobot智能业务问答机器人');
		}
		if(typeof data.webConfig.level!="undefined" &&  data.webConfig.level>=3){
			$('#devP').hide();
		}
		
		//初始化问题
		r_intQuesUrl();
        //引导问题
        init_leadQuestions(data);
		//常见问题
		init_topQuestions(data.topAsk);
		//新增的问题
		init_newQuestions(data.newAdd);
		//基本信息
		init_baseInfo(data);
		//配置快捷服务
		init_quickLink(data.quickLink);
		//未解决原因
		options.unsolvedReason=data.uselessReasonItems;
		
        $("#"+options.sendBtn).click(function(){
            sendeMsg();
        });
        $("#"+options.clearScreen).click(function(){
            var welcomP= $("<div/>").addClass("msgleft");
            var welcomCont= chatContDIv.find("div").first().html();
            chatContDIv.html('');
			init_leadQuestions(data);
        });
}
	
	 //流程问题的查看
    $('.wflink').live('click',function() {
        $this = $(this);
        var fid = $this.attr('rel');
        var cont=$this.html();
        var s_q_url=options.basePath+'AQ?s=getflw&sysNum='+options.sysNum+'&question='+encodeURI(cont)+'&fid='+fid+'&nocache='+new Date().getTime();
	
        $.getJSON(
            s_q_url,
            function(data){
                if(data.status==0){
                    showMyWordsToForm(cont);
                    showRobotWordsToForm(data);
                }else{
					showErrorDiv(data.message);
				}
            });
    });
	//接入人工
	 $('.faqevent').on('click',function() {
		 var hrefValue=$(this).attr('href');
		  var msgValue=$(this).html();
         var hrefUrl=options.basePath+'AQ?'+hrefValue+'&sysNum='+options.sysNum+'&nocache='+new Date().getTime();
		 
		  //首先把自己的问题内容显示到聊天框里面去
          showMyWordsToForm(msgValue);
            //请求数据
		  request(hrefUrl,showRobotWordsToForm,0,options.dataType,{});
		 return false;
	 });
	 
	 //查看历史记录
	 $("#input .record").click(function() {
		$(".record-ctn").fadeIn(100);
		searchHistory();
	 });
	 function searchHistory(){
		var s_q_url=options.basePath+'AQ?s=history&sysNum='+options.sysNum+'&nocache='+new Date().getTime();
        $.getJSON(
            s_q_url,
            function(data){
                if(data.status==0){
					if(data.historyLog && data.historyLog.length>0){
						var temp=[];
						for(var i=0;i<data.historyLog.length;i++){
							temp.push('<div class="r-c-ctn r-c-custom"><span class="name me">我：</span><i class="time me">'+data.historyLog[i].time+'</i><div class="say-word">'+data.historyLog[i].question+'</div></div>');
							temp.push('<div class="r-c-ctn r-c-serv"><span class="name">机器人：</span><i class="time">'+data.historyLog[i].time+'</i><div class="say-word">'+data.historyLog[i].answer+'</div></div>');
							
						}
						$('#robotHistory').html(temp.join(''));
					}else{
						$('#robotHistory').html('<p style="text-align:center;">当前记录为空</p>');
					}
                }else{
					showErrorDiv(data.message);
				}
            });
	 }
	 //未解决问题原因
	 function init_unsolvedReason(data){
		 var tmpCon=[];
		 if(data && data.length>0){
			tmpCon.push('<form class="unsolved">');
		 	tmpCon.push('<p>非常抱歉没能解决您的问题，请反馈未解决原因，我们会根据您的反馈进行优化与完善！</p>');
			var sear=new RegExp('其他');
			var tmp='';
			for(var i=0;i<data.length;i++){
				if(sear.test(data[i].reason)){
					tmp='<a href="javascript:;"><label><input type="radio" value="'+data[i].tId+'" name="reasonRadio">'+data[i].reason+'</label></a>';
				}else{
					tmpCon.push('<a href="javascript:;"><label><input type="radio" value="'+data[i].tId+'" name="reasonRadio">'+data[i].reason+'</label></a>');
				}
			}
			tmpCon.push(tmp);
			tmpCon.push('<span>其他（请填写宝贵意见）</span>');
			tmpCon.push('<textarea name="content"></textarea><br>');
			tmpCon.push('<button type="button" class="subreasonForm">提交</button>');
			tmpCon.push('</form>');
		 }
		 return tmpCon.join('');
	 }
	 
	 //配置快捷服务问题
	function init_quickLink(quickLink){
		if(options.quickLink && options.quickLink.length>2 && quickLink && quickLink.length>0 ){
			var html=[];
			for(var i=0;i<quickLink.length;i++){
				html.push('<a href="'+quickLink[i].linkUrl+'" target="_blank"><img src="'+quickLink[i].imageUrl+'"><br><span>'+quickLink[i].name+'</span>')
			}
			$('#'+options.quickLink+' a').after(html.join(''));
		}
	}

    //更改引导问题
    function init_leadQuestions(data){
		var allObj = '<div class="serv chat-ctn"><span class="serv-icon"></span><div class="serv-ctn"><i class="triangle triangle1"></i><i class="triangle triangle2"></i><span class="r2-name">'+options.robotName+'</span><div class="say-word pre-say-word">'+data.webConfig.helloWord+'</div><i class="time">'+getTime()+'</i></div></div>';
        chatContDIv.html(allObj);
    }
	//更改最常见的问题的列表
	function init_topQuestions(orderList){
		if(options.topQuestionDiv && options.topQuestionDiv.length>2 && typeof orderList!="undefined" && orderList.length>1 ){
            formatQueULList(options.topQuestionDiv,orderList);
		}
	}
	//更改新增加问题的列表
	function init_newQuestions(orderList){
		if(options.newQuestionDiv && options.newQuestionDiv.length>2 && typeof orderList!="undefined" && orderList.length>1 ){
            formatQueULList(options.newQuestionDiv,orderList);
		}
	}
	//更改基本的站点的信息
	function init_baseInfo(data){
		var cardhtml2='<dl>';
		if(options.baseInfoDiv && options.baseInfoDiv.length>2){
			if(typeof data.webConfig!="undefined"){
			  var cardhtml2='<dl>';
			  if(typeof data.webConfig.webName!="undefined"){
					cardhtml2+='<dt>名称：'+data.webConfig.webName+'</dt>';
			  }
			  if(typeof data.webConfig.serviceTel!="undefined"){
				    cardhtml2+='<dt>电话：'+data.webConfig.serviceTel+'</dt>';
			  }
			  if(typeof data.webConfig.webSite!="undefined"){
					cardhtml2+='<dt>网址：<a href="'+data.webConfig.webSite+'" target="_black">'+data.webConfig.webSite+'</a></dt>';
			  }
			}
			if(data.advList && data.advList.length>0){
				for(var i=0;i<data.advList.length;i++){
					var style=data.advList[i].type;
					if(style==0){
						cardhtml2+='<dt>'+data.advList[i].name+'：'+data.advList[i].value+'</dt>';
					}else if(style==1){
						if(data.advList[i].value.indexOf('<')==0 && data.advList[i].value.indexOf('>')>0){
							cardhtml2+='<dt>'+data.advList[i].name+'：'+data.advList[i].value+'';
						}else{
							cardhtml2+='<dt>'+data.advList[i].name+'：<a href="javascript:;" href="'+data.advList[i].value+'" target="_blank">'+data.advList[i].value+'</a></dt>';
						}
					}else if(style==2){
						if(data.advList[i].value.indexOf('<')==0 && data.advList[i].value.indexOf('>')>0){
							cardhtml2+='<dt>'+data.advList[i].name+'：'+data.advList[i].value+'';
						}else{
							cardhtml2+='<dt>'+data.advList[i].name+'：<br><img src="'+data.advList[i].value+'">';
						}
					
					}else if(style==3){
						if(data.advList[i].value.indexOf('<')==0 && data.advList[i].value.indexOf('>')>0){
							cardhtml2+='<dt>'+data.advList[i].name+'：'+data.advList[i].value+'';
						}else{
							cardhtml2+='<dt>'+data.advList[i].name+'：<a href="http://wpa.qq.com/msgrd?v=3&uin='+data.advList[i].value+'&site=qq&menu=yes" target="_blank"><img alt="'+data.advList[i].name+'" src="images/Service1.png"></a>';
						}
					}
					
				}
			}
		}
		cardhtml2+='</dl>';
	 	$("#"+options.baseInfoDiv).html(cardhtml2);
	}
	

	
    //向页面的元素赋值html内容
    function setInerHtml(targetId,htm){
        if(targetId && targetId.length>2 && htm && htm.length>0 ){
            $("#"+targetId).html(htm);
        }
    }
    //列表的数据，列表的class,列表显示的条数,每一行列表的数目
    function formatQueULList(targetId,list,ulclass,maxCount,maxWords){
        if(!list)return "";
		$("#"+targetId).empty();
		var element = $("<dl/>").appendTo($("#"+targetId));
        var max = limitNumberOfItems(list.length);
        for (var i=0; i < max; i++) {
            if (!list[i]){
                continue;
            }
            var  lielement = $("<dt/>").html(i+1+'.&nbsp;&nbsp;');
            var formattedCont = options.formatBaseQueCount && options.formatBaseQueCount(list[i], i+1, max,options.queConMaxWordsCount)||formatBaseQueCount(list[i], i+1, max);
            if ( formattedCont === false )
                continue;
            var childElement= $("<a/>");
            childElement.html(formattedCont)
            .appendTo(lielement)
            .attr("href","javascript:void(0)")
            .attr("title",list[i].question)
            .attr("aid",list[i].solutionId)
            .click(function(){
                $this = $(this);
                askQue($this.attr("title"),$this.attr("aid"));
                return false;
            }) ;
            lielement.appendTo(element);
        }
    }

    //截取字符串操作
    function limitstr(chinese_string,maxcount) {
        if(!maxcount)return chinese_string;
        if (chinese_string.length > maxcount) {
            var new_text = chinese_string.substring(0, maxcount) + "...";
            return new_text;
        }
        return chinese_string;
    }
    function formatBaseQueCount(row, i, max){
        return limitstr(row.question);
    }
    function limitNumberOfItems(available) {
        return options.maxTopQuestions && options.maxTopQuestions < available
            ? options.maxTopQuestions
            : available;
    }

	//出现错误提示框
    function showErrorDiv(msg,fun){
        showerrorDiv.find('span').html(msg);
        showerrorDiv.find('span').delay(1000).fadeTo("slow", 0.2).fadeTo("slow", 1).fadeOut(2000,function(){
			showerrorDiv.find('span').html('');
			if(typeof fun == "function"){
				fun();
			}
		}).stop();
    }
	/*********************下面是机器人网络交互的部分*************************/
	//点击发送按钮所做的事件
    function sendeMsg(){
        var s_msg='';
        s_msg=$input.val();
		s_msg =$xss(s_msg,'html');
        if(s_msg==''){
            return;
        }
		if(s_msg=='请用一句简单的话描述您的需求，如&#34;怎么修改手机号&#34;'){
			 return;
		}
        $input.val('');
        $('.ac_results').hide();
        if(s_msg.length==1 && s_msg>0 && typeof nu[s_msg-1]!="undefined" ){
            s_msg =nu[s_msg-1];nu=[];
        }
		var fontsizeTemp=$("#fz").val().replace('px','')*1;
		s_msg='<span style="font-size:'+fontsizeTemp+'px">'+s_msg+'</span>';
        askQue(s_msg);
		$("#"+options.wordremain).html(100);
		$input.focus();
    }

    //点击问题回复的事件
	function askQue(msg,slutionId){
        if(msg && msg.length>0){
            var askUrl = options.basePath +'AQ?s=aq';
            if(slutionId && slutionId++>0){
                askUrl+='&sId='+slutionId+'&sysNum='+options.sysNum;
            }
            //首先把自己的问题内容显示到聊天框里面去
            showMyWordsToForm(msg);
			msg=msg.replace(/<[^>]+>/g,"");
			if(userId){
				
				if(msg=='购买记录' ||msg=='我的报酬' || msg=='我的纷享币' || msg=='消费积分' || msg=='培训积分' || msg=='账户余额' || msg=='我的职级' || msg=='业务资格有效期' || msg=='我的月刊' || msg=='我的信息' || msg=='我的优惠券' || msg=='我的短信'){
					var tmpHtml='<div class="serv chat-ctn"><span class="serv-icon"></span><div class="serv-ctn"><i class="triangle triangle1"></i><i class="triangle triangle2"></i><div><span class="r-name">'+options.robotName+'</span><p class="say-word">店主在外努力拓展业务中，我要帮她保守秘密喔！谢谢您的理解！</p><i class="time">'+getTime()+'</i></div><div class="ishaveyong"></div></div></div><p class="spacing15"></p>';
					chatContDIv.append(tmpHtml);
					chatContDIv.scrollTop(chatContDIv[0].scrollHeight);
				}
				else{
					request(askUrl,showRobotWordsToForm,0,options.dataType,{question:msg});
				}
			}else{
				request(askUrl,showRobotWordsToForm,0,options.dataType,{question:msg});
			}
			
        }
		
    }
    //向聊天框里面写入自己所说的话，展示出来
	function showMyWordsToForm(msg){
        if(!msg && msg.length==0)return;
            //TODO 完善展示自己内容的方法
        var formattedCont = options.showMyWords && options.showMyWords(msg,getTime())||createMyWordsHtml(msg,getTime());
        chatContDIv.append(formattedCont);
		chatContDIv.scrollTop(chatContDIv[0].scrollHeight);
	}
	
	//获取我自己讲话的页面的结构
    function createMyWordsHtml(msg,time){
		var myword='<div class="customer chat-ctn"><span class="serv-icon"></span><div class="serv-ctn"><i class="triangle triangle1"></i><i class="triangle triangle2"></i><div class="say-word"><span>'+msg+'</span></div><i class="time">'+time+'</i></div> </div><div class="cl"></div>';
        return myword;
    }
	

    //展示机器人的答案
    function showRobotWordsToForm(data){
        if(!data && data.length==0)return;
        //TODO 完善展示自己内容的方法
		var formattedCont=options.showRobotWords && options.showRobotWords(data,getTime())||createRobotWordsHtml(data,getTime());
	    chatContDIv.append(formattedCont);
		chatContDIv.scrollTop(chatContDIv[0].scrollHeight);
	}

     //获取机器回答的页面的结构
    function createRobotWordsHtml(data,time){
		if(typeof data.robotAnswer =="undefined" ||data.robotAnswer.length==0){
			return '';
		}
		//
		var allItems;
		var ansItemObj;
		for(var i=0;i<data.robotAnswer.length;i++){
			ansItemObj = data.robotAnswer[i];
			
			var tmp = createRobotWordsHtmlItem(ansItemObj,time);
			if(allItems){
				allItems.after(tmp);
			}else{
				allItems = tmp;
			}
		}
		return allItems;
    }
	
	
	function createRobotWordsHtmlItem(ansItem,time){
		var beforeWords='';
		var afterWords='';
		//定义引导问题前后的提示语
		if(typeof ansItem.gusWords !='undefined' && ansItem.gusWords!=null ){
			beforeWords=ansItem.gusWords.ydWords==''?'您是不是要咨询以下问题，请点击或回复数字进行选择：':ansItem.gusWords.ydWords;
			afterWords=ansItem.gusWords.afterWords==''?'':ansItem.gusWords.afterWords;
		}else{
			beforeWords='您是不是要咨询以下问题，请点击或回复数字进行选择：';
			afterWords='';
		}
		if(!ansItem){
			return '';
		}
		//机器人的结构
		var allObj=$('<div/>').addClass('serv chat-ctn');
		var all_logo=$('<span/>').addClass('serv-icon').appendTo(allObj);
		var all_con=$('<div/>').addClass('serv-ctn').appendTo(allObj);
		var xtriangle1 = $("<i>").addClass("triangle triangle1").appendTo(all_con);
		var xtriangle2 = $("<i>").addClass("triangle triangle2").appendTo(all_con);
		//var all_div_text=$('<div/>').addClass('kftext').appendTo(all_con);
		var all_robot_chat=$('<div/>').html('<span class="r-name">'+options.robotName+'</span>').appendTo(all_con);
		var all_robot_info=$('<p/>').addClass("say-word").appendTo(all_robot_chat);
		all_robot_info.after('<i class="time">'+getTime()+'</i>');
		//是否有用
		var all_if_use=$('<div/>').addClass('ishaveyong').appendTo(all_con);
		allObj.after('<p class="spacing15"></p>');
         //有无帮助
        if( typeof ansItem.aId!="undefined" && ansItem.aId!=0){
            var aid=ansItem.aId;
			var uid=ansItem.cluid;
            var helpDiv=$('<div/>').addClass("helper_aid_"+aid).attr('cluid',uid).appendTo(all_if_use);
            $('<a/>').addClass("robot_review_yes").attr("helptag",1).attr("aid",aid).attr('cluid',uid).click(helpclick).html('<span></span>已解决').appendTo(helpDiv);
            $('<a/>').addClass("robot_review_no showReason").attr("helptag",0).attr("aid",aid).attr('cluid',uid).click(helpclick).html('<code></code>未解决').appendTo(helpDiv);
        }else{
        }
        //相关问题(右侧应该配置div的ID)
        if( typeof ansItem.aId!="undefined" && ansItem.aId!=0){
            if(options.sugQuestionDiv && options.sugQuestionDiv.length>2 && typeof ansItem.relateLessList!="undefined" && ansItem.relateLessList.length>1 ){
                var rightCon_relate=$('<div/>').addClass("relateTxt").appendTo(all_robot_info);
                var relatelist=ansItem.relateLessList;
                if(!relatelist)return "";
                var  element = $("<dl/>").appendTo(rightCon_relate);
                var  lielement = $("<dt/>").html("你是否还想问如下问题：").appendTo(element).css('color','red');
                var max = limitNumberOfItems(relatelist.length);
                for (var i=0; i < max; i++) {
                    if (!relatelist[i]){
                        continue;
                    }
                    var formattedCont = options.formatBaseQueCount && options.formatBaseQueCount(relatelist[i], i+1, max,options.queConMaxWordsCount)||formatBaseQueCount(relatelist[i], i+1, max);
                    if ( formattedCont === false )
                        continue;
                    var ddElement= $("<dd/>").appendTo(element).html((i+1)+'.&nbsp;');
                    var childElement= $("<a/>");
                    childElement.html(formattedCont)
                        .appendTo(ddElement)
                        .attr("href","javascript:void(0)")
                        .attr("title",relatelist[i].question)
                        .attr("aid",relatelist[i].solutionId)
                        .click(function(){
                            $this = $(this);
                            askQue($this.attr("title"),$this.attr("aid"));
                            return false;
                        }) ;
						nu[i] =relatelist[i].question;
                }
              rightCon_relate.after($("<div/>").addClass("clear"));
            }
        }
		if(ansItem.ansCon!="" && ansItem.ansCon.length>0){
            var listAll = '';
			var curCon=ansItem.ansCon;
			if(ansItem.msgType=='voice'){
				//语音答案
				curCon='<p>若无法播放，请点击<a href="'+ansItem.ansCon+'" target="_blank">下载</a></p><br/>';
				curCon+='<audio src="'+ansItem.ansCon+'" controls="controls">您的浏览器不支持 audio 标签。</audio>';
				

			}else if(ansItem.msgType=='image'){
				//图片答案
				curCon='<img src="'+curCon+'" class="imgBox">';
			}else if(ansItem.msgType=='vedio'){
				//视频答案
				
				curCon='<p>若无法播放，请点击<a href="'+ansItem.ansCon+'" target="_blank">下载</a></p><br/>'
				curCon+='<video src="'+ansItem.ansCon+'" controls="controls">您的浏览器不支持 video 标签。</video>';
			}
            all_robot_info.html(curCon);
			showThirdWeb(ansItem);
        }
		
		//推荐问题
		if(ansItem.relateList.length>0){
            var  lielement = $("<dl/>").append('<dt>'+beforeWords+'</dt>').appendTo(all_robot_info);
            var answerlist=ansItem.relateList;
            for(i=0;i<answerlist.length;i++){
                var title=$.trim(answerlist[i].question);
                var aid=answerlist[i].solutionId;
                var ddElement= $("<dd/>").appendTo(lielement).html((i+1)+'.&nbsp;');
                var childElement= $("<a/>");
                childElement.html(title)
                    .appendTo(ddElement)
                    .attr("href","javascript:void(0)")
                    .attr("title",title)
                    .attr("aid",answerlist[i].solutionId)
                    .click(function(){
                        $this = $(this);
                        askQue($this.attr("title"),$this.attr("aid"));
                        return false;
                    }) ;
					nu[i] = title;
            }
			$("<dt/>").html(afterWords).appendTo(lielement);
			return allObj;
        }
		
        if(ansItem.gusList.length>0){
            var  lielement = $("<dl/>").append('<dt>'+beforeWords+'</dt>').appendTo(all_robot_info);
            var answerlist=ansItem.gusList;
            for(i=0;i<answerlist.length;i++){
                var title=$.trim(answerlist[i].seedQuestion.question);
                var aid=answerlist[i].solutionId;
                var ddElement= $("<dd/>").appendTo(lielement).html((i+1)+'.&nbsp;');
                var childElement= $("<a/>");
                childElement.html(title)
                    .appendTo(ddElement)
                    .attr("href","javascript:void(0)")
                    .attr("title",title)
                    .attr("aid",answerlist[i].solutionId)
                    .click(function(){
                        $this = $(this);
                        askQue($this.attr("title"),$this.attr("aid"));
                        return false;
                    }) ;
					nu[i] = title;
            }
			$("<dt/>").html(afterWords).appendTo(lielement);
			return allObj;
        }
        return allObj;
    }
    //下线的事件
    function offLine(){
       var s_q_url=options.basePath+'AQ?s=offline&nocache='+new Date().getTime();
	    $.getJSON(
            s_q_url,
            function(data){
				if(data.status==0){
					/*if(requestTimes<5){
						initRobotBaseInfo();
						requestTimes++;
					}else{
						return;
					}
					*/
				}
        });
    }
	//定时请求的方法
	function keepAlive(){
		if(!(typeof dt == 'undefined')){
				clearTimeout(dt);
		}
		if(s_tspan<100 && keepCount<240){//如果连续请求40次没数据返回，则下线
			keepCount++;
			var s_time=s_tspan*1000;
			dt=setTimeout(autoRequest,s_time);//定时代理函数
		}else{
			offLine();
			
	    }
	}
	//发送消息之后重新获取请求的间隔时间
	function getNewTime(data){
		if(!(typeof data.tspan == 'undefined')){ 
				if(!(s_tspan==data.tspan)){//如果不相等，则重新获取请求的时间间隔；
					s_tspan=data.tspan;
				}	
				keepAlive();
		}
	}
	//主动去请求的方法
	function autoRequest(){
		var s_tempmeg=$.trim($input.text());
		var autoR_url=options.basePath+'AQ?s=kl'
		$.ajax({
			type:'post',
			datatype:'json',
			cache:false,
			url:options.basePath+'AQ?s=kl',
			data:'question='+encodeURI(s_tempmeg),
			success:
			function(data){
				if(data.status==0){
					getNewTime(data);
					if(data.robotAnswer && data.robotAnswer.length>0){
						showRobotWordsToForm(data);
					}
				}else{
					var obj=eval('({"robotAnswer":{"ansCon":"您已下线，感谢您的使用！如果需要再次聊天，请重新打开或刷新本页面！","status":0,"tspan":2}})');
					showRobotWordsToForm(obj);
				}
			}
		})
	}
   //字数统计
    function word_clu(obj){
        var lenE = obj.value.length;
        var lenC = 0;
        var CJK = obj.value.match(/[\u4E00-\u9FA5\uF900-\uFA2D]/g);
        if (CJK != null) lenC += CJK.length;
		var inputMax=$(obj).attr("maxLength");
        var remainword = inputMax - lenC - lenE;
        if(remainword<=0){
            var tmp = 0;
            var cut = obj.value.substring(0, obj.maxLength);
            for (var i=0; i<cut.length; i++){
                tmp += /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(cut.charAt(i)) ? 2 : 1;
                if (tmp > obj.maxLength) break;
            }
            obj.value = cut.substring(0, i);
            $("#"+options.wordremain).html(0);
            return false;
        }
        $("#"+options.wordremain).html(remainword);
    }

    //是否有帮助的统计功能
    function helpclick(){
            $this = $(this);
            var aid = $this.attr("aid");
			var uid=$this.attr("cluid");
            var usefull=$this.attr("helptag");
            $('.helper_aid_'+aid).text('感谢您的评价!').css('color','#666');
            var s_q_url='';
            if(usefull==1){
                s_q_url=options.basePath+'AQ?s=addufc&aId='+aid+'&cluid='+uid+'&sysNum='+options.sysNum;
            }else{
                s_q_url=options.basePath+'AQ?s=addulc&aId='+aid+'&cluid='+uid+'&sysNum='+options.sysNum;
				showReason(aid);
            }
            request(s_q_url);
     }
	 //未解决的原因
	 function showReason(aid){
		var tmpObj=$('.helper_aid_'+aid);
		tmpObj.parent('.ishaveyong').siblings('div').find('.say-word').after(init_unsolvedReason(options.unsolvedReason));
		tmpObj.parent('.ishaveyong').siblings('div').find('.subreasonForm').attr('cluid',tmpObj.attr('cluid'));
		tmpObj.parent('.ishaveyong').css('visibility','hidden');
	 }
	 //提交未解决的原因
	  chatContDIv.on('click','.subreasonForm',function(){
		  var reasonType=''
		  var curObj=$(this).parent().find('input:radio');
		  var tmoObj=$(this).parents('.serv-ctn');
		  $.each(curObj,function(i,items){
			 if(items.checked==true){
					reasonType=items.value;
			  }
		  })
		  if(reasonType=='' && $(this).parent().find('textarea[name=content]').val()==''){
			showErrorDiv('请反馈未解决您问题的原因');
			return; 
		  }
		  if(reasonType=='' && $(this).parent().find('textarea[name=content]').val()!=''){
			 reasonType=$(this).parent().find('a:last input[name=reasonRadio]').val();
		  }
		  $.ajax({
				type:'get',
				datatype:'json',
				cache:false,
				url:encodeURI(options.basePath+'AQ?s=ulreason&cluid='+$(this).attr('cluid')),
				data:$(this).parent().serialize()+'&reasonType='+reasonType,
				success:
					function(data){
						if(data.status==0){
							tmoObj.find('.ishaveyong').css('visibility','visible').html('<div style="color:#666;">感谢您的反馈&nbsp;!&nbsp;如需转人工，请点击"<a href="javascript:;" class="robot_people" style="text-indent:0;">这里</a>"。</div>');
							tmoObj.find('.unsolved').hide();
						}else{
							showErrorDiv(data.message);
						}
					}
			});
	  })
	 
    //****************************************公用方法******************************************//
    function removeHTMLTag(str) {
        if (!str)
            return "";
        str = str.replace(/<\/?[^>]*>/g, '');
        str = str.replace(/[ | ]*\n/g, '\n');
        str = str.replace(/\n[\s| | ]*\r/g, '\n');
        str = str.replace(/&nbsp;/ig, '');
        str = str.replace(/(^\s*)|(\s*$)/g, "");
        str=str.replace(/[\r\n]/g,"");
        return str;
    }
	
	
    //意见反馈
    function fadeback(obj){
        $this =$(obj);
        var fadeform =  $this.parents('form');
        var fadeUrl=options.basePath+'AQ?s=fadeback&sysNum='+options.sysNum;
		var listchk = fadeform.find("input[name='reason[]']");
        var val2="";
		for(i=0;i<listchk.length;i++){
            if(listchk[i].checked){
                val2 += listchk[i].value+',';
            }
        }
		if(fadeform.find('input[name=level]:checked').val()==0){
			if(val2==''){
				var tmp=$('<p/>').html('请勾选您不满意的原因');
				fadeform.find('#subForm').before(tmp);
				return;
			}
		}
        fadeform.find('input[name=sub]').val(val2);
        $.ajax({
            type:'get',
            datatype:'json',
            cache:false,
            url:encodeURI(fadeUrl),
            data:fadeform.serialize(),
            success:
                function(data){
					if(data.status==0){
						$('.goodDiv').show().siblings().hide();
					}else{
						showErrorDiv(data.message);
						$(".c-ctn").stop().fadeOut(100,function(){
							fadeform[0].reset();
							$('.goodDiv').hide().siblings().show();
							fadeform.find('.rdoLabel').show();
							fadeform.find('.lessReason').hide();
						});
					}
                }
        });
    }
	window.onbeforeunload = function(event) {
	    offLine();
	}
    initRobotBaseInfo();
	/******************额外的一些方法**************************/
	//获取聊天的时间
	function getTime(){
			var now= new Date();
			var year=now.getFullYear();
			var month=now.getMonth()+1;
			var day=now.getDate();
			var hour=now.getHours();
			var minute=now.getMinutes();
			var second=now.getSeconds();
			return year+"-"+month+"-"+day+" "+hour+":"+minute+":"+second;
	}
	//显示第三方链接
	function showThirdWeb(data){
		if(data.thirdUrl && data.thirdUrl.url){
			$("#"+options.sugQuestionDiv).attr('src',data.thirdUrl.url);
			$('#bodyRight .b-r-top').find('.b-r-btn').eq(2).addClass('btn-click').siblings().removeClass('btn-click');
			$('#bodyRight .b-r-body').find('li').eq(2).show().siblings().hide();
		}
	}
	function $xss(str,type){
	//空过滤
	if(!str){
	return str===0 ? "0" : "";
	}
	
	switch(type){
	case "none": //过度方案
	return str+"";
	break;
	case "html": //过滤html字符串中的XSS
	return str.replace(/[&'"<>\/\\\-\x00-\x09\x0b-\x0c\x1f\x80-\xff]/g, function(r){
	return r
	}).replace(/ /g, " ").replace(/\r\n/g, "").replace(/\n/g,"").replace(/\r/g,"");
	break;
	case "htmlEp": //过滤DOM节点属性中的XSS
	return str.replace(/[&'"<>\/\\\-\x00-\x1f\x80-\xff]/g, function(r){
	return "&#" + r.charCodeAt(0) + ";"
	});
	break;
	case "url": //过滤url
	return escape(str).replace(/\+/g, "%2B");
	break;
	case "miniUrl":
	return str.replace(/%/g, "%25");
	break;
	case "script":
	return str.replace(/[\\"']/g, function(r){
	return "\\" + r;
	}).replace(/%/g, "\\x25").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\x01/g, "\\x01");
	break;
	case "reg":
	return str.replace(/[\\\^\$\*\+\?\{\}\.\(\)\[\]]/g, function(a){
	return "\\" + a;
	});
	break;
	default:
	return escape(str).replace(/[&'"<>\/\\\-\x00-\x09\x0b-\x0c\x1f\x80-\xff]/g, function(r){
	return "&#" + r.charCodeAt(0) + ";"
	}).replace(/ /g, " ").replace(/\r\n/g, "<br />").replace(/\n/g,"<br />").replace(/\r/g,"<br />");
	break;
	}
	}
	
	//卡号查询
	$('#searchCard').click(function(){
			askQue('<span>卡号查询</span>');
	})
	//专卖店查询
	$('#searchExc').click(function(){
			askQue('<span>专卖店查询</span>');
	})
	//账户余额
	$('#accountHas').click(function(){
			askQue('<span>账户余额</span>');
	})
	//我的报酬
	$('#myPay').click(function(){
			askQue('<span>我的报酬</span>');
	})
	//消费积分
	$('#points').click(function(){
			askQue('<span>消费积分</span>');
	})
	//纷享荟积分
	$('#sharePoints').click(function(){
			askQue('<span>我的纷享币</span>');
	})
	//购买记录
	$('#buyHistory').click(function(){
			askQue('<span>购买记录</span>');
	})
	//优惠券
	$('#coupon').click(function(){
			askQue('<span>我的优惠券</span>');
	})
	//我的月刊
	$('#mymonthly').click(function(){
			askQue('<span>我的月刊</span>');
	})
	//我的短信
	$('#mymessage').click(function(){
			askQue('<span>我的短信</span>');
	})
	//我的信息
	$('#myInfo').click(function(){
			askQue('<span>我的信息</span>');
	})
	//有效期查询
	$('#validSearch').click(function(){
			askQue('<span>业务资格有效期</span>');
	})
	//我的有效职级查询
	$('#levelSearch').click(function(){
			askQue('<span>我的职级</span>');
	})
	//优惠卡
	$('#youhuika').click(function(){
			askQue('<span>优惠卡有效期查询</span>');
	})
	//培训积分
	$('#peixun').click(function(){
			askQue('<span>培训积分</span>');
	})
	
	//满意度评价拍板砖
	$('#c-form input[name=level]').change(function(){
		var tmpValue=$(this).val();
		if(tmpValue==1){
			$('#c-form .lessReason').hide();
		}else{
			$('.rdoLabel').hide();
			$('#c-form .lessReason').show();
		}
	})
	$('#c-form input[type=checkbox]').change(function(){
		$('#c-form .btnDiv').find('p').remove();
	})
	
	
};
$.FaqRobot.defaults = {
	cluid:'',							//有无帮助的时候传过去
	basePath:"./",						//基本的一个站点的根路径信息
	sysNum: 2000000,
	robotName:"FaqRobot",				//机器人的名称
	logoUrl:"skin/demo/image/logo.png",
	logoDiv:"weblogo",  				//配置站点logo地址的div的id
	chatContDiv:"chatContentDiv", 		//配置聊天对话内容的div的id
	inputMsgArea : "inputMessage",		//配置用户输入内容的input的id
	inputMagOldvalue:"inputMagOldvalue",//配置用户输入框中的oldValue
	sendBtn :"sendBtn",					//配置发送按钮的id
	closeBtn :"closeBtn",				//关闭聊天窗口的id代号
	baseInfoDiv :"Contact_us",			//配置站点基本信息展示的id
	advInfoDiv:"advInfoDiv",			//配置其他的联系方式等等信息
	topQuestionDiv :"topQuestions",		//配置常见问题展示的id
	newQuestionDiv :"newQuestions",		//配置新增问题的展示的id
	sugQuestionDiv :"sugQuestions",		//配置推荐问题的展示的id
	viewUrlDiv :"viewUrlDiv",			//配置
	dataType : "json",					//json,jsonp
	extraParams :"",					//其他的请求的参数集合
	webUrl :"http://www.faqrobot.org",	//站点的url地址
	authUrl:"",							//需要登录认证的Url地址，当认证失败的时候跳转
	maxTopQuestions:7,					//最多展示的常见问题的个数
    queConMaxWordsCount:0,              //常见问题配置的时候最多显示问题的字数
    showMyWords:function(msg,time){
	
	},                				    //配置展示自己说话内容的html片段
    showRobotWords:false,               //配置展示机器人回答内容的html片段
    autoswitch:0,                       //提示开关
    wordremain:'wordremain',            //配置字符统计的id
    clearScreen:'clearScreen',          //清空记录的id
    fadeBackId:'fadeBackId',            //意见反馈id
    showErrorId:'showErrorId',          //显示出错框div的ID
	quickLink:'quickLink',
	sourceId:0,                //区分访客来自网页还是微信
	unsolvedReason:'',         //无限极未解决问题

    //隐藏的自定方法
    formatWebLog:false,
    formatBaseQueCount:false,
    showErrorMsg:false,	
	teachMetalk:'teachMetalk',    		//chat55中教我说话id，不用可以去掉
	fadeBackIdLink:'fadeBackIdLink'     //chat55中满意度评价id，不用可以去掉
};
})(jQuery);
