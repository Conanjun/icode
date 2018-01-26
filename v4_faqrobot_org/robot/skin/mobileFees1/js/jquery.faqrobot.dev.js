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
        var acoption = {
           // width: 500,
            max: 10,
            delay: 500,
            matchSubset:false,//自动查询缓存
            scroll: false,
            minChars: 2,
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
	var comeUrl=window.location.href.split('?');
	var getjid=[];
	if(comeUrl[1].indexOf("jid=")!==-1){
		getjid=comeUrl[1].split('&');
	}else{
		getjid=[''];
	}
    //*******************************各种绑定事件开始*************************************//
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
                    $(this).css("color","#ccc");
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
                isHotKey = (!e.ctrlKey && e.keyCode==13)||
                    (e.ctrlKey && e.keyCode==13);
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
            $('#'+options.fadeBackId).click(fadeback);
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
						options.showErrorMsg &&options.showErrorMsg(data) || setTimeout(showErrorMsg(parsed.message || "请求信息错误，请刷新！"),2000);
						return;
					}
					if(parsed.status==-2){//身份认证错误，需要重新登录
                        options.showErrorMsg&&options.showErrorMsg(data) || setTimeout(showErrorMsg(parsed.message || "您的信息认证未通过，请重新认证！",options.authUrl),2000);
						return;
					}
					keepCount=0;//如果有消息发送，请求的次数恢复到0；
					getNewTime(parsed);
					if(typeof successed == "function"){
						successed(parsed);
					}
					
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
		$input.attr('value',options.inputMagOldvalue);
		$input.attr('oldvalue',options.inputMagOldvalue);
		$input.text(options.inputMagOldvalue);
		//options.basePath
		var infoUrl = options.basePath +'AQ?s=p&sysNum='+options.sysNum+'&'+getjid[0]+'&sourceId='+options.sourceId;
		request(infoUrl,sayHello);
		
	}
	//展示机器人的各种基本信息内容
	function sayHello(data){
		var fromurl  = location.href;
		if(!fromurl || fromurl==""){}
		urlId=fromurl.split("?"); 
		
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
			options.logoUrl=data.webConfig.logoUrl==''?"skin/mobileFees1/images/logo.png":data.webConfig.logoUrl;
			$('#'+options.logoDiv).attr('src',options.logoUrl);
		}
		//设置机器人聊天图标
		if(typeof data.skinConfig !='undefined'){
			if(typeof data.skinConfig.kfPic !='undefined'){
				options.kfUrl=data.skinConfig.kfPic==''?options.logoUrl:data.skinConfig.kfPic;
			}
			if(typeof data.skinConfig.khPic !='undefined'){
				options.khUrl=data.skinConfig.khPic==''?options.khUrl:data.skinConfig.khPic;
			}
		}else{
			options.kfUrl=options.logoUrl;
		}
		//是否付费
		if(typeof data.webConfig.level!="undefined" &&  data.webConfig.level<3){
			if(urlId[0].indexOf('Fees')>0){
				location.href="mobileFree.html?sysNum="+options.sysNum;
			}
		}else{
			//$(document).attr("title",data.webConfig.webName);
			var $body = $('body');
			document.title =data.webConfig.webName;
			// hack在微信等webview中无法修改document.title的情况
			var $iframe = $('<iframe src="/favicon.ico"></iframe>').on('load', function() {
			setTimeout(function() {
			$iframe.off('load').remove()
			}, 0)
			}).appendTo($body)
			
			
		}
		

		//初始化webLogo地址
        var webloghtml= options.formatWebLog && options.formatWebLog(data) || init_webLogo(data);
        setInerHtml(options.logoDiv,webloghtml);
        //引导问题
        init_leadQuestions(data);
		//常见问题
		init_topQuestions(data.topAsk);
		//新增的问题
		init_newQuestions(data.newAdd);
		//基本信息
		init_baseInfo(data.webConfig);
		//更改其他展示的信息
		init_advInfo(data);
        $("#"+options.sendBtn).click(function(){
            sendeMsg();
        });
        $("#"+options.clearScreen).click(function(){
            var welcomP= $("<div/>").addClass("robot_question");
            var welcomCont= chatContDIv.find("div").first().html();
            chatContDIv.html('');
            welcomP.html(welcomCont).appendTo(chatContDIv);
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
	 $('.faqevent').live('click',function() {
		 var hrefValue=$(this).attr('href');
		  var msgValue=$(this).html();
         var hrefUrl=options.basePath+'AQ?'+hrefValue+'&sysNum='+options.sysNum+'&nocache='+new Date().getTime();
		 
		  //首先把自己的问题内容显示到聊天框里面去
          showMyWordsToForm(msgValue);
            //请求数据
		  request(hrefUrl,showRobotWordsToForm,0,options.dataType,{});
		 return false;
	 });
 
    //更改logo地址
	function init_webLogo(data){
		if(options.logoDiv && options.logoDiv.length>2 && typeof data.logo!="undefined" && data.logo.length>20 ){
			var webName = typeof data.webName!="undefined"?data.webName:"logo";
			var webUrl = typeof data.webSite!="undefined"?data.webSite:"#";
			var imgsrc='<a href="'+webUrl+'" target="_black"><img class="logo" alt="'+webName+'" src="'+data.logo+'"/></a>';
            return imgsrc;
		}
        return "";
	}
    //更改引导问题
    function init_leadQuestions(data){
		var allObj=$('<div/>').addClass('staff-msg');
		var robot_info=$('<div/>').addClass('name').appendTo(allObj).html(options.robotName);
		var robot_logo=$('<div/>').addClass('logoSize').html('<img class="img-circle" src='+options.kfUrl+'>').appendTo(allObj);
		var robot_icon=$('<div/>').addClass('msg logoMsg').appendTo(allObj);
		var robot_icon_small=$('<div/>').addClass('content').appendTo(robot_icon);//放置答案内容
		var robot_con=$('<span/>').addClass('msg-status').appendTo(robot_icon);
      
        //未回复问题
        if(options.chatContDiv && options.chatContDiv.length>2 && typeof data.leaveQue!="undefined" && data.leaveQue.length>1 ){
         //   helo+='<div class="f_deft"><p>您好，我是机器人<span class="nameTag">'+rname+'</span>，这里有您的留言，查看留言请点击<a href="javascript:void(0)" id="showLeaveMsg"> 这里.</a></p></div>';
           /* rightCon_robotWords.html('<p>您好，我是机器人<span class="nameTag">'+data.webConfig.robotName+'</span>,这里有您的留言，查看留言请点击</p>');
            var listq=data.leaveQue;
            if(listq.length>0){
                var leaveQueDl=$('<dl/>');
                for(var tt=0;tt<listq.length;tt++){
                   $('<dt/>').html('<span >问题'+(tt+1)+'：</span>'+listq[tt].question+'').appendTo(leaveQueDl);
                   $('<dd/>').html('<span >回复：</span>'+listq[tt].answer+'').appendTo(leaveQueDl);
                 }
            }*/
        }else{
            robot_icon_small.html(data.webConfig.helloWord);
			
		}
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
		if(options.baseInfoDiv && options.baseInfoDiv.length>2 && typeof data.webConfig!="undefined"&& data.webConfig.length>1 ){
			var cardhtml2='<div class="Contact_us"><strong>联系我们：</strong>';
 				  if(typeof data.webConfig.webName!="undefined"){
 					    cardhtml2+='<p>名称：'+data.webConfig.webName+'</p>';
 				  }
 				  if(typeof data.webConfig.serviceTel!="undefined"){
 					  cardhtml2+='<p>电话：'+data.webConfig.serviceTel+'</p>';
 				  }
 				  if(typeof data.webConfig.webSite!="undefined"){
 					     cardhtml2+='<p>网址：<a href="'+data.webConfig.webSite+'" target="_black">'+data.webConfig.webSite+'</a></p>';
 				  }
				  cardhtml2+='</div>';
	 			$("#"+options.baseInfoDiv).html(cardhtml2);
		}
	}
	//更改其他展示的信息
	function init_advInfo(data){
		if(options.advInfoDiv && options.advInfoDiv.length>2 && typeof data.webConfig!="undefined" && data.webConfig.length>1){
			var cardhtml2='<table>';
 				  		if(typeof data.webConfig.serviceQq!="undefined"){
 					   		cardhtml2+='<tr><td>Q Q：</td><td><a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin='+data.webConfig.serviceQq+'&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:'+data.webConfig.serviceQq+':51" alt="QQ在线客服" title="QQ在线客服"/></a></td></tr>';
 				  		}
 				  		if(typeof data.advs!="undefined"){
 				  			var lists = data.advs;
	 				  		for(i=0;i<lists.length;i++){
								var name=$.trim(lists[i].name);
								var value=$.trim(lists[i].value);
								var type=lists[i].type;
								if(type==0){//文字
									cardhtml2+='<tr><td>'+name+'：</td><td>'+value+'</td></tr>';
								}else if(type==1){//链接
									cardhtml2+='<tr><td>'+name+'：</td><td>'+value+'</td></tr>';
								}else if(type==2){//图片
									cardhtml2+='<tr><td>'+name+'：</td><td>'+value+'</td></tr>';
								}else if(type==3){//qq
									cardhtml2+='<tr><td>'+name+'：</td><td><a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin='+value+'&site=qq&menu=yes"><img border="0" src="http://wpa.qq.com/pa?p=2:'+value+':51" alt="'+name+'" title="'+name+'"/></a></td></tr>';
								}
							}
 				  		}
 				  		cardhtml2+='</table>';
	 			$("#"+options.advInfoDiv).html(cardhtml2);
		}
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
        var element = $("<dl/>").appendTo($("#"+targetId));
        var max = limitNumberOfItems(list.length);
        for (var i=0; i < max; i++) {
            if (!list[i]){
                continue;
            }
            var  lielement = $("<dt/>");
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
    //
    function limitNumberOfItems(available) {
        return options.maxTopQuestions && options.maxTopQuestions < available
            ? options.maxTopQuestions
            : available;
    }
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
	//出现错误提示框
    function showErrorDiv(msg,fun){
        showerrorDiv.fadeIn(800);
        showerrorDiv.find('span').html(msg);
        showerrorDiv.delay(1000).fadeTo("slow", 0.2).fadeTo("slow", 1).fadeOut(800,function(){
			if(typeof fun == "function"){
				fun();
			}
		});
    }
	/*********************下面是机器人网络交互的部分*************************/
	//点击发送按钮所做的事件
    function sendeMsg(){
        var s_msg='';
        s_msg=$input.val();
		s_msg=$xss(s_msg,'html')
        if(s_msg==''){
            return;
        }
		if(s_msg==options.inputMagOldvalue){
			 return;
		}
        $input.val('');
        $('.ac_results').hide();
        if(s_msg.length==1 && s_msg>0 && typeof nu[s_msg-1]!="undefined" ){
            s_msg =nu[s_msg-1];nu=[];
        }
        askQue(s_msg);
		$("#"+options.wordremain).html(100);
		$input.focus();
    }
	
	//过滤XSS
	
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
return "&#" + r.charCodeAt(0) + ";"
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

    //点击问题回复的事件
	function askQue(msg,slutionId){
		options.curQue=msg;
        if(msg && msg.length>0){
            var askUrl = options.basePath +'AQ?s=aq';
            if(slutionId && slutionId++>0){
                askUrl+='&sId='+slutionId+'&sysNum='+options.sysNum;
            }
            //首先把自己的问题内容显示到聊天框里面去
            showMyWordsToForm(msg);
            //请求数据
            request(askUrl,showRobotWordsToForm,0,options.dataType,{question:msg});
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
		var myword='<div  class="client-msg" data-type="text"><div class="logoSize" style="right:0"><img class="img-circle" alt="" src="'+options.khUrl+'"></div><div class="msg rightLogo"><div class="content">'+msg+'</div><span class="msg-status"></span> </div> </div>';
        return myword;
    }

    //展示机器人的答案
    function showRobotWordsToForm(data){
        if(!data && data.length==0)return;
        //TODO 完善展示自己内容的方法
        var formattedCont = options.showRobotWords && options.showRobotWords(data,getTime())||createRobotWordsHtml(data,getTime());
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
		if(typeof ansItem.gusWords !='undefined' && ansItem.gusWords!=null){
			beforeWords=ansItem.gusWords.ydWords==''?'您是不是要咨询下面的问题？':ansItem.gusWords.ydWords;
			afterWords=ansItem.gusWords.afterWords==''?'':ansItem.gusWords.afterWords;
		}else{
			beforeWords='您是不是要咨询下面的问题？';
			afterWords='';
		}
		
		if(!ansItem){
			return '';
		}
		var allObj=$('<div/>').addClass('staff-msg');
		var robot_info=$('<div/>').addClass('name').appendTo(allObj).html(options.robotName);
		var robot_logo=$('<div/>').addClass('logoSize').html('<img class="img-circle" src='+options.kfUrl+'>').appendTo(allObj);
		var robot_icon=$('<div/>').addClass('msg logoMsg').appendTo(allObj);
		var robot_icon_small=$('<div/>').addClass('content').appendTo(robot_icon);//放置答案内容
		var robot_icon_relate=$('<div/>').addClass('content').appendTo(robot_icon);//放置相关问题
		var robot_icon_more=$('<div/>').addClass('content').appendTo(robot_icon);//放置相关问题
		var robot_con=$('<span/>').addClass('msg-status').appendTo(robot_icon);		
		//有无帮助
		var robot_help=$('<div/>').addClass('content').appendTo(robot_icon);
		
		/*******************************************************************************************************/
		
        //填充数据
         //有无帮助
        if( typeof ansItem.aId!="undefined" && ansItem.aId!=0){
            var aid=ansItem.aId;
			var cluid=ansItem.cluid;
            robot_help.addClass("helper_aid_"+aid).addClass("helper");
            $('<a/>').addClass("robot_review_yes").attr("helptag",1).attr("aid",aid).attr("uid",cluid).click(helpclick).html('<span class="robot_help_yes"></span>').appendTo(robot_help);
            $('<a/>').addClass("robot_review_no").attr("helptag",0).attr("aid",aid).attr("uid",cluid).click(helpclick).html('<span class="robot_help_no"></span>').appendTo(robot_help);

        }
		
		 
        //相关推荐问题
        if( typeof ansItem.aId!="undefined" && ansItem.aId!=0){
            if(options.sugQuestionDiv && options.sugQuestionDiv.length>2 && typeof ansItem.relateLessList!="undefined" && ansItem.relateLessList.length>1 ){
                var relatelist=ansItem.relateLessList;
                if(!relatelist)return "";
                var  lielement = $("<span/>").addClass('question').html("你是否还想问如下问题：").appendTo(robot_icon_relate);
				var ulElement=$('<ol/>').appendTo(robot_icon_relate);
                var max = limitNumberOfItems(relatelist.length);
                for (var i=0; i < max; i++) {
                    if (!relatelist[i]){
                        continue;
                    }
                    var formattedCont = options.formatBaseQueCount && options.formatBaseQueCount(relatelist[i], i+1, max,options.queConMaxWordsCount)||formatBaseQueCount(relatelist[i], i+1, max);
                    if ( formattedCont === false )
                        continue;
                    var ddElement= $("<li/>").appendTo(ulElement);
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
            }
        }
		if(ansItem.ansCon!="" && ansItem.ansCon.length>0){
			var listAll = '';
			robot_icon_small.html(ansItem.ansCon);
		}
		//推荐问题
		if(ansItem.relateList.length>0){
			var  lielement = $("<dl/>").append('<dt>'+beforeWords+'</dt>').appendTo(robot_icon_more);
            var relatelist=ansItem.relateList;
			var ul_Element=$('<ol/>').appendTo(robot_icon_more);
            for(i=0;i<relatelist.length;i++){
                var title=$.trim(relatelist[i].question);
                var aid=relatelist[i].solutionId;
                var ddElement= $("<li/>").appendTo(ul_Element);
                var childElement= $("<a/>");
                childElement.html(title)
                    .appendTo(ddElement)
                    .attr("href","javascript:void(0)")
                    .attr("title",title)
                    .attr("aid",relatelist[i].solutionId)
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
            var  lielement = $("<span/>").addClass('question').html(beforeWords).appendTo(robot_icon_more);
			var ul_Element=$('<ol/>').appendTo(robot_icon_more);
            var answerlist=ansItem.gusList;
            for(i=0;i<answerlist.length;i++){
                var title=$.trim(answerlist[i].seedQuestion.question);
                var aid=answerlist[i].solutionId;

                var ddElement= $("<li/>").appendTo(ul_Element);
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
			$("<span/>").addClass('question').html(afterWords).appendTo(robot_icon_more);
            return allObj;
        }
        if(ansItem.ansCon==""){
            var answer=ansItem;
            if(typeof ansItem.sq!="undefined"){
                answer = '关于问题  "<b>'+ansItem.sq+'</b>" 的回复：</br>'+answer;
            }
            robot_icon_small.html(' ');
            return allObj;
        }
        robot_icon_small.html(replaceFace(ansItem.ansCon));
        return allObj;
    }
    //下线的事件
    function offLine(){
       var s_q_url=options.basePath+'AQ?s=offline&nocache='+new Date().getTime();
	    $.getJSON(
            s_q_url,
            function(data){
				if(data.status==0){
					var obj=eval('({"robotAnswer":{"ansCon":"您已下线，感谢您的使用！如果需要再次聊天，请重新打开或刷新本页面！","status":0,"tspan":2}})');
					showRobotWordsToForm(obj);
					
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
		$.ajax({
			type:'post',
			datatype:'json',
			cache:false,
			url:options.basePath+'AQ?s=kl',
			data:'question='+options.curQue,
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
       // alert(remainword);
        $("#"+options.wordremain).html(remainword);
    }

    //是否有帮助的统计功能
    function helpclick(){
            $this = $(this);
            var aid = $this.attr("aid");
			var uid= $this.attr("uid");
            var usefull=$this.attr("helptag");
            $('.helper_aid_'+aid).html('感谢您的评价！');
            var s_q_url='';
            if(usefull==1){
                s_q_url=options.basePath+'AQ?s=addufc&aId='+aid+'&cluid='+uid+'&sysNum='+options.sysNum;
            }else{
                s_q_url=options.basePath+'AQ?s=addulc&aId='+aid+'&cluid='+uid+'&sysNum='+options.sysNum;
            }
            request(s_q_url);
        }
    //****************************************公用方法******************************************//
    function removeHTMLTag(str) {
        if (!str)
            return "";
        str = str.replace(/<\/?[^>]*>/g, '');
        str = str.replace(/[ | ]*\n/g, '\n');
        str = str.replace(/\n[\s| | ]*\r/g, '\n');
        str = str.replace(/ /ig, '');
        str = str.replace(/(^\s*)|(\s*$)/g, "");
        str=str.replace(/[\r\n]/g,"");
        return str;
    }
    //意见反馈
    function fadeback(){
        $this =$(this);
        var fadeform =  $this.parents('form');
        var fadeUrl=options.basePath+'AQ?s=fadeback&sysNum='+options.sysNum;
        var val2="";
        var listchk = $("input[name='reason[]']");
        for(i=0;i<listchk.length;i++){
            if(listchk[i].checked){
                val2 += listchk[i].value+',';
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
                       $('.fadeBackModal').fadeOut(800);
                       $('.fadeBackContent').fadeOut(800);
					    fadeform[0].reset();
                        showErrorDiv(data.message);
                    }else{
                        $('.fadeBackModal').fadeOut(800);
                        $('.fadeBackContent').fadeOut(800);
						fadeform[0].reset();
                        showErrorDiv(data.message);
                    }
                }
        });
    }
	
	window.onbeforeunload = function(event) {
	    offLine();
	}
	
	
    initRobotBaseInfo();

	//转义表情
    function replaceFace(data) {
        var src = 'src/yun/',
            face = {//表情包
            '云问表情': [
                ['微笑', '/::)'],
                ['撇嘴', '/::~'],
                ['色', '/::B'],
                ['发呆', '/::|'],
                ['得意', '/:8-)'],
                ['流泪', '/::<'],
                ['害羞', '/::$'],
                ['闭嘴', '/::X'],
                ['尴尬', '/::-|'],
                ['发怒', '/::@'],//10
                ['调皮', '/::P'],
                ['呲牙', '/::D'],
                ['惊讶', '/::O'],
                ['难过', '/::('],
                ['酷', '/::+'],
                ['吐', '/::T'],
                ['偷笑', '/:,@P'],
                ['愉快', '/:,@-D'],
                ['困', '/:|-)'],
                ['惊恐', '/::!'],//10
                ['流汗', '/::L'],
                ['憨笑', '/::>'],
                ['奋斗', '/:,@f'],
                ['疑问', '/:?'],
                ['嘘', '/:,@x'],
                ['晕', '/:,@@'],
                ['衰', '/:,@!'],
                ['骷髅', '/:!!!'],
                ['再见', '/:bye'],
                ['糗大了', '/:&-('],//10
                ['坏笑', '/:B-)'],
                ['鄙视', '/:>-|'],
                ['委屈', '/:P-('],
                ['亲亲', '/::*'],
                ['可怜', '/:8*'],
                ['玫瑰', '/:rose'],
                ['凋谢', '/:fade'],
                ['嘴唇', '/:showlove'],
                ['爱心', '/:heart'],
                ['心碎', '/:break']
            ],
        };
        for(var i in face) {
            switch(i) {
                case '云问表情':
                    for(var j=0; j<face[i].length; j++) {//考虑到含有特殊字符，不用正则
                        while(data.indexOf(face[i][j][1])+1) {
                            var index = data.indexOf(face[i][j][1]),
                                len = face[i][j][1].length,
                                str1 = data.substr(0, index),
                                str2 = data.substr(index+len);
                            data = str1 +'<img src="'+ src+j +'.gif">'+ str2;
                        }
                    }
                    break;
            }
        }
        return data;
    }
};


$.FaqRobot.defaults = {
	curQue:'',							//存放当前的输入框中的问题
	basePath:"./",						//基本的一个站点的根路径信息
	sysNum: 2000000,
	robotName:"FaqRobot",				//机器人的名称
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
	kfUrl:'skin/fees1/image/logo.png',  //客服图标
	khUrl:'skin/mobileFees1/images/ask.png', //客户图标
	sourceId:0,							//判断访客来自网页还是微信

    //隐藏的自定方法
    formatWebLog:false,
    formatBaseQueCount:false,
    showErrorMsg:false
};
})(jQuery);
