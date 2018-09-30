//天蓬网右侧服务栏
addCssByLink('http://zbj.faqrobot.cn/robot/skin/zbj2/css/tpwServiceEmployer.css');
hasJquery();

window.onload=function(){
	
	var webId="";
	var jId="";
	var sysNum="";
	var url="";
	
	$("script").each(function(){
		if($(this).attr("src").indexOf("faqrobot")>=0){  //判断是否为机器人链接
			webId=$(this).attr("webId");   //获取webId
			jId=$(this).attr("jId");       //获取jId
		}
	});
	
	switch(webId){
			case "19207":  //天蓬网雇主
				sysNum="149750805597620967";
				src="http://zbj.faqrobot.cn/robot/tpwEmployerDialog.html?sysNum="+sysNum+"&jid="+jId;
				break;
			case "19209":  //天蓬网服务商
				sysNum="149750806038320971";
				src="http://zbj.faqrobot.cn/robot/tpwProviderDialog.html?sysNum="+sysNum+"&jid="+jId;
				break;
		}
	
	var body=document.getElementsByTagName('body')[0];
	var div=document.createElement('div');
	body.appendChild(div);
	div.outerHTML='<div class="aw-wrapper retractFixed retract"><div id="dialog"><div id="prompt" class="hidden"><img src=""/></div><img src="http://zbj.faqrobot.cn/robot/skin/zbj2/images/tpwLogoLogo.png" class="openImg"/><h3 class="aw-title aw-dragger hidden" style="opacity: 1; padding-top: 3px; display: block; height: 5px;font-size: 12px;">猜您想问：</h3>'
		+'<ul class="aw-content hidden" id="aw-content" style="opacity: 1; display: block;"></ul><ul class="aw-default-tool"><li class="aw-default-tool-item"><img src="http://zbj.faqrobot.cn/robot/skin/zbj2/images/jisuzixun.png" class="itemImg jisu"/>'
    	+'<span class="span hidden">极速咨询</span><div class="hoverjisu hidden">极速咨询</div></li><li class="aw-default-tool-item item"><img src="http://zbj.faqrobot.cn/robot/skin/zbj2/images/lianxikefu.png" class="itemImg lianxi"/><span class="span hidden">联系客服</span>'
    	+'<div class="hoverlianxi hidden">联系客服</div></li></ul></div><div class="dialogIframe"><iframe src="'+src+'" id="dialogIframe" name="dialogIframe"></iframe></div></div>';

	BindEvent(sysNum,jId);
	$(".dialogIframe").addClass("opacity");
	$("#dialogIframe").addClass("opacity");
};

function addCssByLink(url){  
    var link=document.createElement("link");  
	var meta=document.createElement("meta");
    link.setAttribute("rel", "stylesheet");  
    link.setAttribute("type", "text/css");  
    link.setAttribute("href", url); 
	meta.setAttribute("name", "renderer");  
    meta.setAttribute("content","ie-stand");  
    var heads = document.getElementsByTagName("head");  
    if(heads.length){
        heads[0].appendChild(link);
		heads[0].appendChild(meta);  
    }else {
        document.documentElement.appendChild(link);  
		document.documentElement.appendChild(meta);  
	}
} 

function closeIframe(){   //关闭iframe
	if(!$(".dialogIframe").hasClass("opacity")){
		$(".dialogIframe").addClass("opacity");
		$("#dialogIframe").addClass("opacity");
		$(".aw-wrapper").removeClass("openIframe");
		if(!$(".aw-wrapper").hasClass("retract")){
		$(".openImg").attr("src","http://zbj.faqrobot.cn/robot/skin/zbj2/images/tpwLogoLogo.png");
		}
	}
}

function BindEvent(sysNum,jId){  //注册事件
	
	var url="/servlet/AQ?s=p&sysNum="+sysNum+"&jid="+jId;
	
	$.ajax({   //生成问题列表
		dtype:'post',
		datatype:'json',
		url: url,
		success: function(data) {
		   var renderTo=$("#aw-content");
			for(var i in data.topAsk){
				var j=0;
				var li=$("<li class='aw-lineitem'></li>").appendTo(renderTo);
				var a=$("<a class='aw-item' href='#' data-type='knowledge' data-src=''></a>").text(data.topAsk[i].question).appendTo(li);
				$(li).click(function(){
    				if($(".dialogIframe").hasClass("opacity")){
		    			$(".dialogIframe").removeClass("opacity");
		    			$("#dialogIframe").removeClass("opacity");
		    			$(".aw-wrapper").addClass("openIframe");
		    			$(".openImg").attr("src","http://zbj.faqrobot.cn/robot/skin/zbj2/images/tpwLogoLogo.png");
		    		}
		    		var question=$(this).text();
		    		$(window.frames["dialogIframe"].document).find("#sendtxt").val(question); 
		    		$(window.frames["dialogIframe"].document).find("#inputPR").click(); 
    			});
			}
			$(".aw-lineitem").last().children().addClass("last");
		},
		error:function() {
		}
	});

	$(".openImg").click(function(){
	if($(".aw-wrapper").hasClass("openIframe")&&$(".aw-wrapper").hasClass("retract")){ //判断现在是否是缩小状态打开了iframe
			$(this).attr("src","http://zbj.faqrobot.cn/robot/skin/zbj2/images/tpwLogoLogo.png");
			$(".aw-content").removeClass("hidden");
			$(".aw-title").removeClass("hidden");
			$(this).css("top","-90px");
			$(this).css("left","18px");
			$(this).css("width","82px");
			$(".span").removeClass("hidden");
			$("#dialog").css("width","120");
			$(".aw-wrapper").removeClass("retractFixed").addClass("openFixed");
			$(".dialogIframe").css("top","-135px");
			$(".aw-wrapper").removeClass("retract");
			$(".dialogIframe").css("right","-2px");
			$("#prompt").addClass("hidden");
		} else
			if($(".aw-wrapper").hasClass("retract")){  //是否只是在缩小的状态，并没有打开iframe
				$(this).attr("src","http://zbj.faqrobot.cn/robot/skin/zbj2/images/tpwLogoLogo.png");
    			$(".aw-content").removeClass("hidden");
    			$(".aw-title").removeClass("hidden");
    			$(this).css("top","-90px");
    			$(this).css("left","18px");
    			$(this).css("width","82px");
    			$(".span").removeClass("hidden");
    			$("#dialog").css("width","120");
    			$(".aw-wrapper").removeClass("retractFixed").addClass("openFixed");
    			$(".dialogIframe").css("top","-135px");
    			$(".aw-wrapper").removeClass("retract");
    			$(".dialogIframe").css("right","-2px");
    			$("#prompt").addClass("hidden");
			}
		else if(!$(".aw-wrapper").hasClass("retract")){    //不在缩小状态时候点击                                                    
			$(this).attr("src","http://zbj.faqrobot.cn/robot/skin/zbj2/images/tpwLogoLogo.png");
			$(".aw-content").addClass("hidden");
			$(".aw-title").addClass("hidden");
			$(this).css("top","-51px");
			$(this).css("left","-2px");
			$(this).css("width","40px");
			$(".span").addClass("hidden");
			$("#dialog").css("width","41");
			$(".aw-wrapper").addClass("retractFixed").removeClass("openFixed");
			$(".aw-wrapper").addClass("retract");
			$(".dialogIframe").css("top","-185px");
			$("#prompt").addClass("hidden");
		}
	});
	
	$(".aw-default-tool-item").hover(function(){  //急速咨询和联系客服hover事件
		if($(".aw-wrapper").hasClass("retract")){
		$(this).children().next().next().removeClass("hidden");
		$(this).children().next().next().addClass("bcolor");
		}
	},function(){
		$(this).children().next().next().addClass("hidden");
		$(this).children().next().next().removeClass("bcolor");
	});
	
	
	$(".aw-default-tool-item").each(function(){
		$(this).click(function(){
			if($(".dialogIframe").hasClass("opacity")){
    			$(".dialogIframe").removeClass("opacity");
    			$("#dialogIframe").removeClass("opacity");
    			$(".aw-wrapper").addClass("openIframe");
    			$(".openImg").attr("src","http://zbj.faqrobot.cn/robot/skin/zbj2/images/tpwLogoLogo.png");
				$(".aw-content").removeClass("hidden");
    			$(".aw-title").removeClass("hidden");
    			$(".openImg").css("top","-90px");
    			$(".openImg").css("left","18px");
    			$(".openImg").css("width","82px");
    			$(".span").removeClass("hidden");
    			$("#dialog").css("width","120");
    			$(".aw-wrapper").removeClass("retractFixed").addClass("openFixed");
    			$(".dialogIframe").css("top","-135px");
    			$(".aw-wrapper").removeClass("retract");
    			$(".dialogIframe").css("right","-2px");
    			$(this).children().next().next().addClass("hidden");
    		}
		});
	});
	
	$(".openImg").hover(function(){   //提示语hover事件
		if($(".aw-wrapper").hasClass("retract")){
			$("#prompt").removeClass("hidden");
			$("#prompt").children("img").attr("src","http://zbj.faqrobot.cn/robot/skin/zbj2/images/tpwclick-open.png");
			$("#prompt").css("right","25px");
			$("#prompt").css("top","-120px");
		}else if(!$(".aw-wrapper").hasClass("retract")){
			$("#prompt").removeClass("hidden");
			$("#prompt").children("img").attr("src","http://zbj.faqrobot.cn/robot/skin/zbj2/images/tpwclick-retract.png");
			$("#prompt").css("right","80px");
			$("#prompt").css("top","-150px");
		}
	},function(){
		$("#prompt").addClass("hidden");
	});
	
}

function hasJquery(){
	if(typeof(jQuery)=="undefined"){
		var src=document.createElement('script');
		src.type="text/javascript";
		src.src="http://zbj.faqrobot.cn/robot/skin/zbj2/js/jquery-1.10.1.min.js";
		var heads = document.getElementsByTagName("head");  
		if(heads.length){
			heads[0].appendChild(src);
		}else{
			document.documentElement.appendChild(src);  
		}		
	}else{
	}
}