addCssByLink('http://v3.faqrobot.org/robot/skin/zbj/private/yunStyle.css');
var body = document.getElementsByTagName('body')[0];var div = document.createElement('div');body.appendChild(div);div.outerHTML='<div class="qqchat qqchat_5695"><div class="showchat" style="display: none;"><div class="header"><h2>常见问题</h2></div><ul class="content"></ul><span class="close">&times;</span></div><div class="hidechat"><img class="yunPig" src="http://v3.faqrobot.org/robot/skin/zbj/private/chat-icon.png" /></div></div>';
hasJquery();
setTimeout(function(){
	//操作事件
	$(".qqchat_5695").on("mouseover mouseout", function(e) {
		if(e.type == "mouseover") {
			$(".qqchat_5695 .showchat").show();
		}else {
			$(".qqchat_5695 .showchat").hide();
		}
	});
	$(".qqchat_5695 .close").on("click", function() {
		$(".qqchat_5695 .showchat").hide();
	});
	$('.yunPig').click(function(){
		openWin('http://v3.faqrobot.org/robot/zbj.html?jid=5695','870','600');
	});
	//点击其他问题
	$('.otherQue').click(function(){
		openWin('http://v3.faqrobot.org/robot/zbj.html?jid=5695','870','600');
	})
},800);
function openWin(u, w, h) { 
  var l = (screen.width - w) / 2; 
  var t = (screen.height - h) / 2; 
  var s = 'width=' + w + ', height=' + h + ', top=' + t + ', left=' + l; 
  s += ', toolbar=no, scrollbars=no, menubar=no, location=no, resizable=no'; 
  u=encodeURI(u);
  open(u, 'oWin', s); 
}
//显示聊天窗
function showChatModal(obj){
	openWin('http://v3.faqrobot.org/robot/zbj.html?jid=5695&que='+$(obj).html(),'870','600');
}
//显示常见问题
function commonQue(){
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,
		url:'http://v3.faqrobot.org/servlet/AQ?s=basep&sysNum=14435836731645796&jid=5695',
		dataType:'jsonp',
		callback:'callback',
		success:
		function(data){
			if(data.newAdd && data.newAdd.length>0){
				var temp=[];
				for(var i=0;i<data.newAdd.length;i++){
					temp.push('<li><a href="javascript:;" onclick="showChatModal(this);return false;">'+data.newAdd[i].question+'</a></li>');
				}
				$('.qqchat_5695 .content').html(temp.join(''));
			}
		}
	})
}
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
function hasJquery(){
	if(typeof(jQuery)=="undefined"){
		var src=document.createElement('script');
		src.type="text/javascript";
		src.src="http://v3.faqrobot.org/js/jquery-1.8.1.min.js";
		var heads = document.getElementsByTagName("head");  
		if(heads.length){
			heads[0].appendChild(src);
		}else{
			document.documentElement.appendChild(src);  
		}
	}else{
		
	}
	commonQue();
}