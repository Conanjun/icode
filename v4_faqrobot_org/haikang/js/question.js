//sessionStorage.setItem("ceshiid",$(this).attr("sId"));//先放入到缓冲中

(function($){
	$(document).ready(function(){
		//初始化mui
		mui.init();
		var webId = 34,
		id = 0;
		function UrlSearch(){
		   var name,value; 
		   var str=location.href; //取得整个地址栏
		   var num=str.indexOf("?") 
		   str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
		
		   var arr=str.split("&"); //各个参数放到数组里
		   for(var i=0;i < arr.length;i++){ 
		   num=arr[i].indexOf("="); 
			    if(num>0){ 
			     	name=arr[i].substring(0,num);
			     	value=arr[i].substr(num+1);
			     	this[name]=value;
			    } 
		    } 
		} 
		var Request=new UrlSearch(); //实例化
		var hid2 = Request.id;
		var solutionType =  Request.solutionType;
		var currentPage = Request.currentPage;
		if(solutionType == 1){
			$('.mui-title').html('问题详细');
			questionDetails();
		}else{
			$('.mui-title').html('流程详细');
			processDetail();
		}
		getClientInfo();
		$('.mui-action-back').click(function(){
			window.location.href = 'index.html';
			sessionStorage.setItem('currentPage',currentPage);
		});
		
		//让指定的DIV始终显示在屏幕正中间   
	    function setDivCenter(divName){   
	        var top = ($(window).height() - $(divName).height())/2;   
	        var left = ($(window).width() - $(divName).width())/2;   
	        var scrollTop = $(document).scrollTop();   
	        var scrollLeft = $(document).scrollLeft();   
	        $(divName).css( { position : 'absolute', 'top' : top + scrollTop, left : left + scrollLeft } ).show();  
	    } 
		
		/**
		* 获取客户端信息
		*/
		function getClientInfo(){  
		   var userAgentInfo = navigator.userAgent;  
		   var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
		   var agentinfo = null;  
		   	for (var i = 0; i < Agents.length; i++) {  
		       if (userAgentInfo.indexOf(Agents[i]) > 0) { agentinfo = userAgentInfo; break; }  
		   	} 
		   	//移动端
			if(agentinfo){
				$('.showCon').css({
					'width':'100%',
					'margin':'50px auto 0'
				});
				//问题点赞数增加
				$(".mui-content").on("tap",".mui-content-padded .img1",function(e){
					if($('.showCon').attr('ansid') != $(this).parents('.mui-content-padded').attr('id')){//点赞答案Id
						e.preventDefault();
						$.ajax({
							type:"post",
							url:"/QuestionHk/doAddusefull",
							data:{
								webId:webId,
								id:hid2
							},
							async:true,
							dataType:'json',
							cache:true,
							success:function(data){
								if(data.status==0){
									$('html').append('<div class="pull" id="pull"><img src="images/zan.png" class="mod"></div>');
									setDivCenter('#pull');
									setTimeout(function(){
										$('.pull').remove();
										if(solutionType == 1){
											questionDetails();
										}else{
											processDetail();
										}
									},1500)
								}else{
									alert(data.message);
								}
							}
						});
						$.ajax({
							type:"post",
							url:"/QuestionHk/doAddAnusefull",
							data:{
								webId:webId,
								id:$(this).parents('.mui-content-padded').attr('id')
							},
							async:true,
							dataType:'json',
							cache:true,
							success:function(data){
								if(data.status==0){
									
								}else{
									alert(data.message);
								}
							}
						});
						$('.showCon').attr('ansid',$(this).parents('.mui-content-padded').attr('id'));
					}
				});
				//答案点踩数增加
				$(".mui-content").on("tap",".img2",function(e){
					if($('.showCon').attr('CaiAppId') != $(this).parents('.mui-content-padded').attr('id')){//点踩答案Id
						e.preventDefault();
						$.ajax({
							type:"post",
							url:"/QuestionHk/doAdduseless",
							data:{
								webId:webId,
								id:hid2
							},
							async:true,
							dataType:'json',
							cache:true,
							success:function(data){
								if(data.status==0){
									$('html').append('<div class="pull" id="pull"><img src="images/cai.png" class="mod"></div>');
									setDivCenter('#pull');
									setTimeout(function(){
										$('.pull').remove();
										if(solutionType == 1){
											questionDetails();
										}else{
											processDetail();
										}
									},1500)
								}else{
									alert(data.message);
								}
							}
						});
						$.ajax({
							type:"post",
							url:"/QuestionHk/doAddAnuseless",
							data:{
								webId:webId,
								id:$(this).parents('.mui-content-padded').attr('id')
							},
							async:true,
							dataType:'json',
							cache:true,
							success:function(data){
								if(data.status==0){
									/*$('html').append('<div class="pull"><img src="images/cai.png" class="mod"></div>');
									setTimeout(function(){
										$('.pull').remove();
										if(solutionType == 1){
											questionDetails();
										}else{
											processDetail();
										}
									},1500)*/
								}else{
									alert(data.message);
								}
							}
						});
						$('.showCon').attr('CaiAppId',$(this).parents('.mui-content-padded').attr('id'));
					}
				});
			}else{//pc端
				//问题点赞数增加
				$(".mui-content").on("click",".mui-content-padded .img1",function(e){
					if($('.showCon').attr('ZanId') != $(this).parents('.mui-content-padded').attr('id')){//点赞答案Id
						e.preventDefault();
						$.ajax({
							type:"post",
							url:"/QuestionHk/doAddusefull",
							data:{
								webId:webId,
								id:hid2
							},
							async:true,
							dataType:'json',
							cache:true,
							success:function(data){
								if(data.status==0){
									$('html').append('<div class="pull" id="pull"><img src="images/zan.png" class="mod"></div>');
									setDivCenter('#pull');
									$(".mod").css({
										'top':'36%',
										'left':'37%',
										'margin-top':'0',
										'margin-left':'0',
										'width':'400px',
										'height':'360px'
									});
									setTimeout(function(){
										$('.pull').remove();
										if(solutionType == 1){
											questionDetails();
										}else{
											processDetail();
										}
									},1500)
								}else{
									alert(data.message);
								}
							}
						});
						$.ajax({
							type:"post",
							url:"/QuestionHk/doAddAnusefull",
							data:{
								webId:webId,
								id:$(this).parents('.mui-content-padded').attr('id')
							},
							async:true,
							dataType:'json',
							cache:true,
							success:function(data){
								if(data.status==0){
									
								}else{
									alert(data.message);
								}
							}
						});
						$('.showCon').attr('ZanId',$(this).parents('.mui-content-padded').attr('id'));
					}
				});
				//答案点踩数增加
				$(".mui-content").on("click",".mui-content-padded .img2",function(e){
					if($('.showCon').attr('CaiId') != $(this).parents('.mui-content-padded').attr('id')){//点踩答案Id
						e.preventDefault();
						$.ajax({
							type:"post",
							url:"/QuestionHk/doAdduseless",
							data:{
								webId:webId,
								id:hid2
							},
							async:true,
							dataType:'json',
							cache:true,
							success:function(data){
								if(data.status==0){
									$('html').append('<div class="pull" id="pull"><img src="images/cai.png" class="mod"></div>');
									setDivCenter('#pull');
									$(".mod").css({
										'top':'36%',
										'left':'35%',
										'margin-top':'0',
										'margin-left':'0',
										'width':'400px',
										'height':'360px'
									});
									setTimeout(function(){
										$('.pull').remove();
										if(solutionType == 1){
											questionDetails();
										}else{
											processDetail();
										}
									},1500)
								}else{
									alert(data.message);
								}
							}
						});
						$.ajax({
							type:"post",
							url:"/QuestionHk/doAddAnuseless",
							data:{
								webId:webId,
								id:$(this).parents('.mui-content-padded').attr('id')
							},
							async:true,
							dataType:'json',
							cache:true,
							success:function(data){
								if(data.status==0){
									/*$('html').append('<div class="pull"><img src="images/cai.png" class="mod"></div>');
									$(".mod").css({
										'top':'36%',
										'left':'35%',
										'margin-top':'0',
										'margin-left':'0',
										'width':'400px',
										'height':'360px'
									});
									setTimeout(function(){
										$('.pull').remove();
										if(solutionType == 1){
											questionDetails();
										}else{
											processDetail();
										}
									},1500)*/
								}else{
									alert(data.message);
								}
							}
						});
						$('.showCon').attr('CaiId',$(this).parents('.mui-content-padded').attr('id'));//当前行的id
					}
				});
			}
		}
		
		
		//加载问题详情界面
		function questionDetails(){
			$.ajax({
				url:'/QuestionHk/getAnswerByQid',
				type:'post',
				data:{
					webId:webId,
					qId:hid2
				},
				dataType:'json',
				cache:false,
				success:function(data){
					var html = "";
					var ques = data.question;
					if(data.list){
						if(data.list.length <= 1){
							if(data.list[0].Answer == ''||data.list[0].Answer == undefined||data.list[0].Answer == null){
								data.list[0].Answer = ' ';
							}
							html+= '<div class="mui-content-padded" id="'+data.list[0].Id+'">'+
									'<p class="one">Q:'+data.question+'</p>'+
									'<p class="showAns">'+
										'<span class="tit">A：</span><span class="page">'+(data.list[0].Answer)+'</span>'+
									'</p>'+
									'<p class="img">'+
										'<span><img src="images/good.png" class="img1">'+(data.list[0].Usefull ? data.list[0].Usefull : 0)+'</span>'+
										'<span><img src="images/bad.png" class="img2">'+(data.list[0].Useless ? data.list[0].Useless : 0)+'</span>'+
									'</p>'+
								'</div>';
						}else{
							for(var i = 0; i < data.list.length;i++){
								if(data.list[i].Answer == ''||data.list[i].Answer == undefined||data.list[i].Answer == null){
									data.list[i].Answer = '';
								}
								html+= '<div class="mui-content-padded" id="'+data.list[i].Id+'">'+
										'<p class="showAns">'+
											'<span class="tit">A'+(i+1)+'：</span><span class="page">'+(data.list[i].Answer)+'</span>'+
										'</p>'+
										'<p class="img">'+
											'<span><img src="images/good.png" class="img1">'+(data.list[i].Usefull ? data.list[i].Usefull : 0)+'</span>'+
											'<span><img src="images/bad.png" class="img2">'+(data.list[i].Useless ? data.list[i].Useless : 0)+'</span>'+
										'</p>'+
									'</div>';
							}
							html = '<p class="one" style="text-indent: 10px;line-height: 30px;">Q:'+ques+'</p>'+html;
						}
						$(".mui-content").html(html);
						$('.showAns').next('p').css('text-align','center');
					}
				}
			});
		};
		
		//流程详细
		function processDetail(){
			$.ajax({
				url:'/QuestionHk/getAnswerByQid',
				type:'post',
				data:{
					webId:webId,
					qId:hid2
				},
				dataType:'json',
				cache:false,
				success:function(data){
					var html = "";
					if(data.list){
						for(var i = 0; i < data.list.length;i++){
							html+= '<div class="mui-content-padded" id="'+data.list[i].Id+'">'+
									'<div class="one">Q:'+data.question+'</div>'+
									'<div class="showAns">'+
										'<span class="tit">A'+(i+1)+'：</span>'+data.list[i].Answer+
									'</div>'+
									'<p class="img" style="text-align:right;float:inherit;">'+
										'<span><img src="images/bad.png" class="img2">'+(data.list[i].Useless ? data.list[i].Useless : 0)+'</span>'+
										'<span><img src="images/good.png" class="img1">'+(data.list[i].Usefull ? data.list[i].Usefull : 0)+'</span>'+
									'</p>'+
								'</div>';
						}
						$(".mui-content").html(html);
						$('.showAns').next('p').css('text-align','center');
					}
				}
			});
			
			$.ajax({
				type:"post",
				url:"/QuestionHk/getFlowitemByWebId",
				data:{
					'webId':webId,
					'solutionId':hid2
				},
				async:true,
				cache:true,
				success:function(data){
					var html = '';
					var info = '';
					if(data.status==0){
						if(data.list && data.list.length > 0){
							for(var i = 0;i < data.list.length;i++){
								if(data.list[i].Info.split('、')[1] == undefined){
									info = data.list[i].Info;
								}else{
									info = data.list[i].Info.split('、')[1];
								}
								html += '<div class="mui-content-padded Ider" id="wfl_'+data.list[i].Id+'">'+
										'<div class="title IderHead"><div class="changeDiv">#'+data.list[i].Id+' ' +info+'</div></div>'+
										'<div class="data">'+data.list[i].Content+'</div>'+
									'</div>';	
							}
							$(".flow").html(html);
						}
					}
				}
			});
		}
		//流程项跳转
	$('body').on('tap', '.wflink', function() {
		$this = $(this);
		var fid = $this.attr('rel');
		var tarObj = $('#wfl_'+fid);
		
		//所有框恢复初始状态
		$('.Ider').css('border-color', '#E4E4E4');
		$('.Ider').find('.changeDiv').css('color', '#707478');
		$('.Ider').find('.title').css('background-color', '#ECEBEB');
		//窗口滚动到下一步
		window.scrollTo('#wfl_'+fid,800);
		
		//变化
		tarObj.animate({borderColor: '#DE5246'},800);
		tarObj.find('.changeDiv').animate({color: '#fff'},800);
		tarObj.find('.title').animate({backgroundColor: '#DE5246'},800);

	});
		
	});
})(jQuery);