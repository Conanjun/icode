(function($){
	//处理富文本路径问题
	var localPath='http://v4.faqrobot.net';//'http://haikang.faqrobot.cn'


	$(document).ready(function(){
		//初始化mui
		mui.init();
        id = 0;
        //获取url中的信息
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
		var ansId = Request.id,
            ansType =  Request.ansType,
            title=decodeURI(Request.title);
        
        if(title){
            $('.mui-title').html(title);
        }
        

		getClientInfo();
		// $('#back').on('tap',function(e){
		// 	//e.preventDefault();
		// 	if(isLogin){
		// 		window.location.href = window.location.protocol+'//'+window.location.host+'/index.html?iticket=1&userName='+userName;
		// 	}else{
		// 		window.location.href =window.location.protocol+'//'+window.location.host+ '/index.html';
		// 	}

        // });
        /**taskId=686 显示图文、流程详情
		 * 说明：根据答案类型发送不同的请求
		*/
		if(ansType == 1){
			imgTextDetails();//加载图文详情
		}else if(ansType == 6){//加载流程详情
			processDetail();
		}else{
            questionDetails();
        }

		//加载问题详情界面
		function imgTextDetails(){
			$.ajax({
				url:'/content/getMsgDetail',//加载图文详情
				type:'post',
				data:{
					appMsgId:ansId
				},
				dataType:'json',
				cache:false,
				success:function(data, textStatus, request){
                    if(data.status==0){
                        var html = "";
                        if(data.wxAppMsg&&data.wxAppMsg.WxappmsgDetails&&data.wxAppMsg.WxappmsgDetails[0]){
                            $('.mui-title').html(data.wxAppMsg.WxappmsgDetails[0].Title||'图文详情');
                            for(var i=0;i<data.wxAppMsg.WxappmsgDetails.length;i++){
                                html+= '<div class="mui-content-padded">'+
                                         '<div class="showAns">'+(data.wxAppMsg.WxappmsgDetails[i].Content||'')+'</div>'+
                                        '</div>';
                            }
                          
						}
						$(".mui-content").html(html);
						//图片放大
						for(var k = 0;k < $('.showCon .mui-content img').not('.img1,.img2').length;k++){
							if($('.showCon .mui-content img').not('.img1,.img2').eq(k).attr('src')){
								if($('.showCon .mui-content img').not('.img1,.img2').eq(k).parents('.MN_kfCtn').find('figure').length>0){
									
								}else{
									$('.showCon .mui-content img').not('.img1,.img2').eq(k).wrap('<figure><div class="' + $('.showCon .mui-content img').not('.img1,.img2').eq(k).attr('src') + '"><a href="' + $('.showCon .mui-content img').not('.img1,.img2').eq(k).attr('src') + '" data-size="1920x1800"></a></div></figure>');
								}
							}
						}
						//处理富文本路径问题
						richText($('a'),1);
						richText($('img'),2);
						richText($('video'),2);
						richText($('source'),2);
						richText($('embed'),2);
						richText($('audio'),2);
						// filterlink();
                    }else{
						$('#evalTip').html(data.message).show();
                        setTimeout(function(){
                            $('#evalTip').hide();
                        },1500)
					}
                    
				}
			});
		};
	
		//加载流程详情界面
		function processDetail(){
			$.ajax({
				url:'/QuestionHk/findFlowItemDetail',
				type:'post',
				data:{
					fId:ansId
				},
				dataType:'json',
				cache:false,
				success:function(data, textStatus, request){
                    var html = "";
                    if(data.status==0){
                        if(data.flowItem){
                            var ans = filterQue(data.flowItem.Info);//处理语音、图片等信息问题 去除_xgn
                            html+= '<div class="mui-content-padded">'+
                                        '<div class="showAns">'+
											'<div class="page">'+
												(data.flowItem.Content||'')
											+'</div>'+
                                        '</div>'+
                                    '</div>';
                            $(".mui-content").html(html);
                            /**taskId=686 说明
                             * 用于给流程、图文绑定点击事件
                            */
                            linkAns();
                            for(var k = 0;k < $('.showCon .mui-content img').not('.img1,.img2').length;k++){
                                if($('.showCon .mui-content img').not('.img1,.img2').eq(k).attr('src')){
                                    if($('.showCon .mui-content img').not('.img1,.img2').eq(k).parents('.MN_kfCtn').find('figure').length>0){
                                        
                                    }else{
                                        $('.showCon .mui-content img').not('.img1,.img2').eq(k).wrap('<figure><div class="' + $('.showCon .mui-content img').not('.img1,.img2').eq(k).attr('src') + '"><a href="' + $('.showCon .mui-content img').not('.img1,.img2').eq(k).attr('src') + '" data-size="1920x1800"></a></div></figure>');
                                    }
                                }
                            }
                            richText($('a'),1);
    
                            richText($('img'),2);
                            richText($('video'),2);
                            richText($('source'),2);
                            richText($('embed'),2);
                            richText($('audio'),2);
    
                            // filterlink();
                            //调整点赞图标的位置	
                            // $('.showAns').next('p').css('text-align','left');
    
                        }
                    }else{
                        $('#evalTip').html(data.message).show();
                        setTimeout(function(){
                            $('#evalTip').hide();
                        },1500)
                    }
					
				}
			});
        };

        //加载问题详情界面
		function questionDetails(){
			$.ajax({
				url:'/QuestionHk/getAnswerByQid',
				type:'post',
				data:{
					qId:ansId
				},
				dataType:'json',
				cache:false,
				success:function(data, textStatus, request){
					if(!data.status||data.status==0){
						var html = "",
							ansHtml='';//答案为流程，显示流程的内容
						var ques = filterQue(data.question);//处理语音、图片等信息问题 去除_xgn
						//获取答案的类型
						var ansType='';
						if(data.list&&data.list[0]){
							if(data.list.length <= 1){//只有一条答案
								//iszan=data.list[0].UsefullStatue;
								//iscai=data.list[0].UselessStatue;
								ansType=data.list[0].Mode||'';
								if(!data.list[0].Answer){
									data.list[0].Answer = ' ';
								}
								/**taskId=686 Amend by 赵宇星
								 * 说明：如果答案为流程，则展示该流程的入口
								 * */
								if(ansType==6){
									ansHtml='<div>'+'<a class="flow" ansType="'+ansType+'" modeValue="'+(data.list[0].ModeValue||'')+'">'+data.list[0].ModeInfo+'</a></div>';
								}else{
									ansHtml=data.list[0].Answer;
								}
								
								html+= '<div class="mui-content-padded" id="'+ansId+'">'+
										'<p class="one">Q:'+ques+'</p>'+
										'<div class="showAns" ansType="'+ansType+'" modeValue="'+(data.list[0].ModeValue||'')+'">'+
											'<span class="tit">A：</span><div class="page">'+ansHtml+'</div>'+
										'</div>'+
										// '<div class="img">'+
										// 	'<span><img src="images/bad.png" class="img2">'+(data.list[0].Useless ? data.list[0].Useless : 0)+'</span>'+
										// 	'<span><img src="images/good.png" class="img1">'+(data.list[0].Usefull ? data.list[0].Usefull : 0)+'</span>'+
										// '</div>'+
									'</div>';
							}else{
								for(var i = 0; i < data.list.length;i++){
									//iszan=data.list[i].UsefullStatue;
									//iscai=data.list[i].UselessStatue;
									ansType=data.list[i].Mode||'';
									if(!data.list[i].Answer){
										data.list[i].Answer = '';
									}
									/**taskId=686 Amend by 赵宇星
								 * 说明：如果答案为流程，则展示该流程的入口
								 * */
									if(ansType==6){
										ansHtml='<div>'+'<a class="flow" ansType="'+ansType+'" modeValue="'+(data.list[i].ModeValue||'')+'">'+(data.list[i].ModeInfo||'')+'</a>'
										'</div>'	
									}else{
										ansHtml=data.list[i].Answer;
									}
									html+= '<div class="mui-content-padded">'+
											'<div class="showAns" ansType="'+ansType+'" modeValue="'+(data.list[i].ModeValue||'')+'">'+
												'<span class="tit">A'+(i+1)+'：</span><div class="page">'+ansHtml+'</div>'+
											'</div>'+
											// '<p class="img">'+
											// 	'<span><img src="images/bad.png" class="img2">'+(data.list[i].Useless ? data.list[i].Useless : 0)+'</span>'+
											// 	'<span><img src="images/good.png" class="img1">'+(data.list[i].Usefull ? data.list[i].Usefull : 0)+'</span>'+
											// '</p>'+
											'</div>';
								}
								//显示一次问题
								html = '<p class="one" style="text-indent: 10px;line-height: 30px;"  id="'+ansId+'">Q:'+ques+'</p>'+html;
							}
							$(".mui-content").html(html);
							/**taskId=686 说明
							 * 用于给流程、图文绑定点击事件
							*/
							linkAns();
							if(ansType!=1){
								for(var k = 0;k < $('.showCon .mui-content img').not('.img1,.img2').length;k++){
									if($('.showCon .mui-content img').not('.img1,.img2').eq(k).attr('src')){
										if($('.showCon .mui-content img').not('.img1,.img2').eq(k).parents('.MN_kfCtn').find('figure').length>0){
											
										}else{
											$('.showCon .mui-content img').not('.img1,.img2').eq(k).wrap('<figure><div class="' + $('.showCon .mui-content img').not('.img1,.img2').eq(k).attr('src') + '"><a href="' + $('.showCon .mui-content img').not('.img1,.img2').eq(k).attr('src') + '" data-size="1920x1800"></a></div></figure>');
										}
									}
								}
							}
							
							richText($('a'),1);

							richText($('img'),2);
							richText($('video'),2);
							richText($('source'),2);
							richText($('embed'),2);
							richText($('audio'),2);

							// filterlink();
							//调整点赞图标的位置	
							// $('.showAns').next('p').css('text-align','left');

						}
					}else{
						$('#evalTip').html(data.message).show();
                        setTimeout(function(){
                            $('#evalTip').hide();
                        },1500)
					}
				}
			});
		};

		//让指定的DIV始终显示在屏幕正中间   
	    function setDivCenter(divName){   
	        var top = ($(window).height() - $(divName).height())/2;   
	        var left = ($(window).width() - $(divName).width())/2;   
	        var scrollTop = $(document).scrollTop();   
	        var scrollLeft = $(document).scrollLeft();   
	        $(divName).css( { position : 'absolute', 'top' : top + scrollTop, left : left + scrollLeft } ).show();  
	    }

		//处理语音、图片等信息问题
		function filterQue(tmpInque){
			if(tmpInque){
				if(new RegExp('__xgn_iyunwen_').test(tmpInque)){
					tmpInque=tmpInque.split('__xgn_iyunwen_');
					tmpInque=tmpInque[0];
				}
			}
			return tmpInque||'';

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
               
           	if(agentinfo){
				$('.showCon').css({
					'width':'100%',
					'margin':'50px auto 0'
                 });   
            } 
		}
		
		

		//富文本中问题链接
		function filterlink(){
			$('.welcomeWords').css('color','#747472')
			.attr('title','');
		}

		//处理富文本路径
		function richText(elem,type){
			var pathHead=/^\//;
			for(var i=0;i<elem.length;i++){
				if(type==1){//此标签具有src属性
                    var elemHref=elem.eq(i).attr('href');
                    if(elemHref){
                        if(pathHead.test(elemHref)){
                            elem.eq(i).attr('href',localPath+elemHref);
                        }
                    }
					
				}else if(type=2){
                    var elemSrc=elem.eq(i).attr('src');
                    if(elemSrc){
                        if(pathHead.test(elemSrc)){
                            elem.eq(i).attr('src',localPath+elemSrc);
                        }
                    }
					
				}
			}
		}


      /**taskId=686 Amend by 赵宇星 绑定事件点击 
		 *说明：1、流程项的跳转 流程关联标准问题，查看跳转detail.html查看具体信息
				2、流程关联标准问题，查看跳转detail.html查看具体信息问题详细页面展示流程入口第一项，点击流程项标题进入查看流程项内容
				3、图文点击时加载详情 
		 * */
		function linkAns(){
			$('.welcomeWords').on('tap',function(){
				var ansType='',//标识答案类型
					id=$(this).attr("questionid"),//获取答案的id,用于在detail.js中请求
					title=encodeURI($(this).html());
				window.location.href='detail.html?id='+id+'&ansType='+ansType+'&title='+title;
			})
			$('.wflink').on('tap',function(){
				var $this = $(this),
					id = $this.attr('rel'),
					title=encodeURI($this.html()),
					ansType=6;//标识答案类型
				window.location.href='detail.html?id='+id+'&ansType='+ansType+'&title='+title;
			})
			$('.flow').on('tap',function(){
				var ansType=$(this).attr('anstype'),//标识答案类型
					id=$(this).attr("modevalue"),//获取答案的id,用于在detail.js中请求
					title=encodeURI($(this).html());
				window.location.href='detail.html?id='+id+'&ansType='+ansType+'&title='+title;
			})
			$('[anstype=1]').on('tap',function(){
				var ansType=$(this).attr('anstype'),//标识答案类型
					id=$(this).attr("modevalue");//获取答案的id,用于在detail.js中请求
				window.location.href='detail.html?id='+id+'&ansType='+ansType;	
			})

		}

		
	});
})(jQuery);
