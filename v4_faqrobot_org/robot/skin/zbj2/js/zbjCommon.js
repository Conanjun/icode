$(function(){
	var webId="";
	var jId="";
	var sysNum="";
	var url="";
	var body = document.getElementsByTagName('body')[0];var div = document.createElement('div');body.appendChild(div);div.outerHTML="<div style='position:fixed;top:40%;  right: 5px;visibility:visible; border: 0px;z-index:1000;' class='iyunwen_js_class'><a href='' target='blank'><img src='http://v3.faqrobot.org/upload/web/14435836731645796/20151123/75561448242560597.png'></a></div>";
	$("script").each(function(){
		if($(this).attr("webId")){  //判断是否为机器人链接
			webId=$(this).attr("webId");   //获取webId
			jId=$(this).attr("jId");       //获取jId
		}
	});
	
	
		switch(webId){
			case "19203":   //猪八戒雇主
				sysNum="149750804604820959";
				url="zbj.html";
				break;
			case "19205":  //猪八戒服务商
				sysNum="149750805214520963";
				url="zbjProvider.html";
				break;
			case "19207":  //天蓬网雇主
				sysNum="149750805597620967";
				url="tpw.html";
				break;
			case "19209":  //天蓬网服务商
				sysNum="149750806038320971";
				url="tpwProvider.html";
				break;
			case "19211":  //八戒财税
				sysNum="149750806524820975";
				url="bjcs.html";
				break;
			case "19213":  //待定
				sysNum="149750806926820979";
				url="zbj.html";
				break;
		}
		
		var href="http://zbj.faqrobot.cn/robot/"+url+"?sysNum="+sysNum+"&jid="+jId;
		
		$("a",".iyunwen_js_class").attr("href",href);
	
});