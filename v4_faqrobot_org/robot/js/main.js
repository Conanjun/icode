
	//头部icon上移效果
	$(".robot_topR ul").hover(function(){
		$(this).addClass("robot_topRon")
	},function(){
		$(this).removeClass("robot_topRon")
	});	
	
	//满意度上移
	$(".robot_review_yes").live('mouseover',function(){
		$(this).addClass("yeson")
	});
	$(".robot_review_yes").live('mouseout',function(){
		$(this).removeClass("yeson")
	});
	$(".robot_review_no").live('mouseover',function(){
		$(this).addClass("noon")
	});
	$(".robot_review_no").live('mouseout',function(){
		$(this).removeClass("noon")
	});
	
	
	//清空记录上移效果
	$(".robot_write_clear").hover(function(){
		$(this).addClass("clearon")
	},function(){
		$(this).removeClass("clearon");
	});
	//发送移上效果
	$(".robot_send").hover(function(){
		$(this).addClass("sendon")
	},function(){
		$(this).removeClass("sendon")
	});
	//右侧列表伸缩效果
	
	$(".robot_contentR .hottitle").click(function(){
		if($(this).hasClass("hottitle_on")){
			return;					
		}else{
			$(".robot_contentR ul").removeClass("hottitle_on");
			$(".robot_contentR div").slideUp();
			$(this).addClass("hottitle_on")				
			$("#show"+$(this).attr("id")).slideDown();
		}	
	});
	
	
	//热点问题伸缩效果
/*	$(".robot_hot dt").click(function(){
     $(this).siblings("dd").slideToggle();

     });*/
		
	//左右折叠
	$(".robot_jt ul").hover(function(){
		if($(this).hasClass("jt_left")){
			$(this).addClass("jt_lefton");	
		}else{
			$(this).addClass("jt_righton");	
		}	
		$(this).parent().addClass("jt_hover");	
	},function(){
		$(this).removeClass("jt_lefton");	
		$(this).removeClass("jt_righton");	
		$(this).parent().removeClass("jt_hover");			
	});	
	
	$(".robot_jt ul").click(function(){
		if($(this).hasClass("jt_left")){
			$(this).removeClass("jt_left");
			$(".robot_contentR").animate({"right":"0px","width":"384px"});
			$(".robot_jt").animate({"right":"384px"});
			$(".robot_contentL").animate({"margin-right":"393px"});
            $(".showWaring").animate({"width":"570px"});
		}else{
			$(this).addClass("jt_left");
			$(".robot_contentR").animate({"width":"0px"});
			$(".robot_jt").animate({"right":"0px"});
			$(".robot_contentL").animate({"margin-right":"9px"});
            $(".showWaring").animate({"width":"954px"})
		}
	});	
	//快捷服务上移效果
	$(".robot_chadd").hover(function(){
		$(this).addClass("chaddon")
	},function(){
		$(this).removeClass("chaddon")
	});
	$(".robot_youhq").hover(function(){
		$(this).addClass("youhqon")
	},function(){
		$(this).removeClass("youhqon")
	});

	$(".robot_chajf").hover(function(){
		$(this).addClass("chajfon")
	},function(){
		$(this).removeClass("chajfon")
	});

    //意见反馈
    $(".rdoGood").click(function(){
        $(".hid").hide();
    })
    $(".rdoBad").click(function(){
        $(".hid").show();
    })
    function dialog(width,height){
		$(".hid").hide();
        $(".fadeBackModal").css({display:"block",width:$(document).width()+"px",height:$(document).height()+"px",top:0,left:0});
        $(".fadeBackContent .close").click(function(){
            $(".fadeBackModal").animate({opacity:"0.15"},"normal",function(){$(this).hide();});
            $(".fadeBackContent").animate({top:($(document).scrollTop()-(height=="auto"?300:parseInt(height)))+"px"},"normal",function(){$(this).hide();});
        });
        $(".fadeBackModal").animate({opacity:"0.5"},"normal");
        $(".fadeBackContent").show();

        $(".fadeBackContent").css({left:(($(document).width())/2-(parseInt(width)/2))+"px",top:($(document).scrollTop()-(height=="auto"?300:parseInt(height)))+"px",width:width});
        $(".fadeBackContent").animate({top:($(document).scrollTop()+50)+"px"},"normal");
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
return "&#" + r.charCodeAt(0) + ";"
}).replace(/ /g, "").replace(/\r\n/g, "").replace(/\n/g,"").replace(/\r/g,"");
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
