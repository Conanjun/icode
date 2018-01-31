(function($){
	//进入详情页
	//进入子页面 用于移动端标识已经入子页面
	sessionStorage.setItem('goDetail',1);
	//处理富文本路径问题
	var localPath='http://v4.faqrobot.net';//'http://haikang.faqrobot.cn'


	$(document).ready(function(){
		//初始化mui
		mui.init();
		// var webId = 34,//上线后改为83
		var id = 0;
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
		var hid2 = Request.id;//问题的Id值
		var solutionType =  Request.solutionType;
		//页面加载时的收藏按钮的样式
		var isColltected=sessionStorage.getItem("iscollected");
		//获取是否认证
		var isLogin=Request.iticket;
		var userName=Request.userName;

		var originUrl=window.location.protocol+'//'+window.location.host+window.location.pathname+'?id='+hid2+'&solutionType='+solutionType;

			//if(isLogin){
			//	$('#loginTip').show();
			//	setTimeout(function(){
			//		$('#loginTip').hide();
			//	},2000);
			//}


		//加载时收藏的样式
		if(isColltected==1){
			$('#collectBtn').val('取消收藏').addClass('collected');
		}else{
			$('#collectBtn').val('收藏').removeClass('collected');
		}
		questionDetails();
		// if(solutionType == 1){
		// 	questionDetails();
		// }else{
		// 	processDetail();
		// }

		//读取是否去认证 如果触发一次收藏
		if(sessionStorage.getItem('collectLogin')==1&&isLogin==1){
			if(isColltected==0){
				isColltected=1;
			}else{
				isColltected=0;
			}
			//发送ajax请求
			collect(isColltected,$("#collectBtn"));
			sessionStorage.setItem('collectLogin',0);
		}


		getClientInfo();
		$('#back').on('tap',function(e){
			//e.preventDefault();
			if(isLogin){
				window.location.href = window.location.protocol+'//'+window.location.host+'/index.html?iticket=1&userName='+userName;
			}else{
				window.location.href =window.location.protocol+'//'+window.location.host+ '/index.html';
			}

		});

		
		//让指定的DIV始终显示在屏幕正中间   
	    function setDivCenter(divName){   
	        var top = ($(window).height() - $(divName).height())/2;   
	        var left = ($(window).width() - $(divName).width())/2;   
	        var scrollTop = $(document).scrollTop();   
	        var scrollLeft = $(document).scrollLeft();   
	        $(divName).css( { position : 'absolute', 'top' : top + scrollTop, left : left + scrollLeft } ).show();  
	    }

		//收藏 取消收藏请求
		function collect(isCollected,btn){
			var thisBtn=btn;
			var nowCollectStatus=sessionStorage.getItem("iscollected");
			//设置ajax请求完成后运行的函数,
			$.ajax({
					type:'post',
					url:'/QuestionHk/doEditCollect',
					data:{
						id:hid2,
						// webId:webId,
						userName:userName
					},
					success:function(data){
						if(data.status==0){
							if(isColltected==1){//此时为已收藏状态
								$('#collectTip').html('收藏成功').show();
								setTimeout(function(){
									$('#collectTip').hide();
									thisBtn.val('取消收藏').addClass('collected');
								},1500);
							}else{
								$('#collectTip').html('取消收藏成功').show();
								setTimeout(function(){
									$('#collectTip').hide();
									thisBtn.val('收藏').removeClass('collected');
								},1500);
							}
							sessionStorage.setItem("iscollected",isColltected);
						}
					},
					error:function(xhr,statusText,error){
						console.log('请求错误');
					}
			});

		}

		//收藏以及取消收藏
		$("#collectBtn").on('click',function(e){
			e.preventDefault();
			if(isLogin){//认证通过
				if(isColltected==0){
					isColltected=1;
				}else{
					isColltected=0;
				}
				//发送ajax请求
				collect(isColltected,$(this));
			}else{
				//表单提交验证
				//$('[name=id]').val(hid2);
				//$('[name=webId]').val(webId);
				//$('[name=collect]').val(isColltected);

				//标识去认证
				sessionStorage.setItem('collectLogin',1);
				$('[name=originUrl]').val(originUrl);
				$('#collectForm').submit();
			}
		});


		//处理语音、图片等信息问题
		function filterQue(tmpInque){
			if(tmpInque){
				if(new RegExp('__xgn_iyunwen_').test(tmpInque)){
					tmpInque=tmpInque.split('__xgn_iyunwen_');
					tmpInque=tmpInque[0];
				}
			}
			return tmpInque;

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
				/*点赞操作*/
				//验证通后 点赞
				if(sessionStorage.getItem('zanLoginMob')==1&&isLogin==1){
					var aid=sessionStorage.getItem("zanParentMob");
					//发送ajax请求
					ajaxZanMob(aid);
					sessionStorage.setItem('zanLoginMob',0);
				}
				//点赞的请求
				function ajaxZanMob(aid){
					$.ajax({
						type:"post",
						url:"/QuestionHk/doDoAddAnusefull",
						data:{
							// webId:webId,
							qId:hid2,//问题的id
							id:aid,//答案的id
							userName:userName
						},
						async:true,
						dataType:'json',
						cache:true,
						success:function(data){
							if(data.status==0){
								var iszan=data.canOperation;
								if(iszan==0){
									$('html').append('<div class="pull" id="pull"><img src="images/zan.png" class="mod"></div>');
									setDivCenter('#pull');
									setTimeout(function(){
										$('.pull').remove();
										// if(solutionType == 1){
										// 	questionDetails();
										// }else{
										// 	processDetail();
										// }
										questionDetails();
									},1500)
								}else{
									//$('html').append('<div class="pull" id="pull"><div class="mod">取消点赞成功</div></div>');
									//setDivCenter('#pull');
									$('#evalTip').html('取消点赞成功').show();
									setTimeout(function(){
										//$('.pull').remove();
										$('#evalTip').hide();
										// if(solutionType == 1){
										// 	questionDetails();
										// }else{
										// 	processDetail();
										// }
										questionDetails();
									},1500)
								}

							}else{
								alert(data.message);
							}
						}
					});
				}
				//答案点赞、取消点赞
				$(".mui-content").on("tap",".mui-content-padded .img1",function(e){
					var aid=$(this).parents('.mui-content-padded').attr('id');//答案的id
						e.preventDefault();
						if(isLogin){
							ajaxZanMob(aid);
						}else{
							//$('#usefull [name=webId]').val(webId);
							//$('#usefull [name=qId]').val(hid2);
							//$('#usefull [name=id]').val(aid);
							sessionStorage.setItem('zanLoginMob',1);
							sessionStorage.setItem('zanParentMob',aid);

							$('#usefull [name=originUrl]').val(originUrl);

							$('#usefull').submit();
						}
				});

				/*点踩操作*/
				//验证通过后 点踩
				if(sessionStorage.getItem('caiLoginMob')==1&&isLogin==1){
					var aid=sessionStorage.getItem("caiParentMob");
					//发送ajax请求
					ajaxCaiMob(aid);
					sessionStorage.setItem('caiLoginMob',0);
				}
				//点踩请求
				function ajaxCaiMob(aid){
					$.ajax({
						type:"post",
						url:"/QuestionHk/doDoAddAnuseless",
						data:{
							// webId:webId,
							qId:hid2,//问题的id
							id:aid,//答案的id
							userName:userName
						},
						async:true,
						dataType:'json',
						cache:true,
						success:function(data){
							var iscai=data.canOperation;
							if(data.status==0){
								if(iscai==0){
									$('html').append('<div class="pull" id="pull"><img src="images/cai.png" class="mod"></div>');
									setDivCenter('#pull');
									setTimeout(function(){
										$('.pull').remove();
										// if(solutionType == 1){
										// 	questionDetails();
										// }else{
										// 	processDetail();
										// }
										questionDetails();
									},1500)
								}else{
									//$('html').append('<div class="pull" id="pull"><div class="mod">取消点踩成功</div></div>');
									//setDivCenter('#pull');
									$('#evalTip').html('取消点踩成功').show();
									setTimeout(function(){
										//$('.pull').remove();
										$('#evalTip').hide();
										// if(solutionType == 1){
										// 	questionDetails();
										// }else{
										// 	processDetail();
										// }
										questionDetails();
									},1500)
								}
							}else{
								alert(data.message);
							}
						}
					});
				}
				//答案点踩、取消点踩
				$(".mui-content").on("tap",".img2",function(e){
					var aid=$(this).parents('.mui-content-padded').attr('id');
						e.preventDefault();
					if(isLogin){
						ajaxCaiMob(aid);
					}else{
						//$('#usefull [name=webId]').val(webId);
						//$('#usefull [name=qId]').val(hid2);
						//$('#usefull [name=id]').val(aid);
						sessionStorage.setItem('caiLoginMob',1);
						sessionStorage.setItem('caiParentMob',aid);
						$('#useless [name=originUrl]').val(originUrl);

						$('#useless').submit();
					}

				});
			}else{//pc端
				/***点赞操作***/
				//验证通过后执行
				if(sessionStorage.getItem('zanLogin')==1&&isLogin==1){
					var aid=sessionStorage.getItem("zanParent");
					//发送ajax请求
					ajaxZan(aid);
					sessionStorage.setItem('zanLogin',0);
				}
				function ajaxZan(aid){
					$.ajax({
						type: "post",
						url: "/QuestionHk/doDoAddAnusefull",
						data: {
							// webId: webId,
							qId: hid2,//问题的id
							id:aid,//答案的id
							userName:userName
						},
						async: true,
						dataType: 'json',
						cache: true,
						success: function (data) {
							if (data.status == 0) {
								var iszan=data.canOperation;
								//如果iszan=0表示 显示成功
								if (iszan == 0) {
									$('html').append('<div class="pull" id="pull"><img src="images/zan.png" class="mod"></div>');
									setDivCenter('#pull');
									$(".mod").css({
										'top': '36%',
										'left': '37%',
										'margin-top': '0',
										'margin-left': '0',
										'width': '400px',
										'height': '360px'
									});
									setTimeout(function () {
										$('.pull').remove();
										// if (solutionType == 1) {
										// 	questionDetails();
										// } else {
										// 	processDetail();
										// }
										questionDetails();
									}, 1500)
								} else {//取消点赞成功
									$('#evalTip').html('取消点赞成功').show();
									setTimeout(function () {
										//$('.pull').remove();
										$('#evalTip').hide();
										// if (solutionType == 1) {
										// 	questionDetails();
										// } else {
										// 	processDetail();
										// }
										questionDetails();
									}, 1500)
								}
							} else {
								alert(data.message);
							}
						}
					});
				}
				//问题点赞数增加
				$(".mui-content").on("click",".mui-content-padded .img1",function(e){
					var aid=$(this).parents('.mui-content-padded').attr('id');//答案的id
						e.preventDefault();
						if(isLogin) {
							ajaxZan(aid);
						}else{
							sessionStorage.setItem('zanLogin',1);
							sessionStorage.setItem('zanParent',aid);

							$('#usefull [name=originUrl]').val(originUrl);

							$('#usefull').submit();
						}
				});

				/***点踩操作***/
				//验证通过后 点踩
				if(sessionStorage.getItem('caiLogin')==1&&isLogin==1){
					var aid=sessionStorage.getItem("caiParent");
					//发送ajax请求
					ajaxCai(aid);
					sessionStorage.setItem('caiLogin',0);
				}

				function ajaxCai(aid){
					$.ajax({
						type:"post",
						url:"/QuestionHk/doDoAddAnuseless",
						data:{
							// webId:webId,
							qId:hid2,//问题的id
							id:aid,//答案的id
							userName:userName
						},
						async:true,
						dataType:'json',
						cache:true,
						success:function(data){
							if(data.status==0){
								var iscai=data.canOperation;
								if(iscai==0){//点踩
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
										// if(solutionType == 1){
										// 	questionDetails();
										// }else{
										// 	processDetail();
										// }
										questionDetails();
									},1500)
								}else{//取消点踩
									$('#evalTip').html('取消点踩成功').show();
									setTimeout(function(){
										$('#evalTip').hide();
										// if(solutionType == 1){
										// 	questionDetails();
										// }else{
										// 	processDetail();
										// }
										questionDetails();
									},1500)
								}

							}else{
								alert(data.message);
							}

						}
					});
				}

					//答案点踩数增加
				$(".mui-content").on("click",".mui-content-padded .img2",function(e){
					var aid=$(this).parents('.mui-content-padded').attr('id');
					e.preventDefault();
					if(isLogin){
						ajaxCai(aid);
					}else{
						sessionStorage.setItem('caiLogin',1);
						sessionStorage.setItem('caiParent',aid);
						$('#useless [name=originUrl]').val(originUrl);

						$('#useless').submit();
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
					qId:hid2
				},
				dataType:'json',
				cache:false,
				success:function(data, textStatus, request){
					if(!data.status||data.status==0){
						var html = "",
							ansHtml='';//答案为流程，显示流程的内容,不显示答案
						var ques = filterQue(data.question);//处理语音、图片等信息问题 去除_xgn
						//获取答案的类型
						var ansType='';
						if(data.list&&data.list[0]){
							if(data.list.length <= 1){//只有一条答案
								//iszan=data.list[0].UsefullStatue;
								//iscai=data.list[0].UselessStatue;
								ansType=data.list[0].Mode||'';
								if(!data.list[0].Answer){
									data.list[0].Answer = '';
								}
								/**taskId=686 Amend by 赵宇星
								 * 说明：如果答案为流程，则展示该流程的入口,不展示答案
								 * */
								if(ansType==6){
									ansHtml='<div>'+'<a class="flow" ansType="'+ansType+'" modeValue="'+(data.list[0].ModeValue||'')+'">'+(data.list[0].ModeInfo||'')+'</a></div>';
								}else{
									ansHtml=data.list[0].Answer;
								}

								html+= '<div class="mui-content-padded" id="'+hid2+'">'+
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
								html = '<p class="one" style="text-indent: 10px;line-height: 30px;"  id="'+hid2+'">Q:'+ques+'</p>'+html;
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
							/**taskId=686 Amend by 赵宇星 给所有的地址改为链接*/
							// 获取所有的a标签的href属性 并添加标记
							// var herfList=[];
							// $('.page a').each(function(){
							// 	$(this).attr('orginal','1');
							// 	herfList.push($(this).attr('href'));
							// })
							// console.log(herfList);
							// $('.page').each(function(){
							// 	$(this).html(changeLink($(this).html()));
							// })
							// $('.page a[orginal=1]').each(function(i){
							// 	$(this).attr('href',(herfList[i]));
							// })
							

							// filterlink();
							//调整点赞图标的位置	
							// $('.showAns').next('p').css('text-align','left');

						}
					}else{
						$('#evalTip').html('该问题已删除!').show();
                        setTimeout(function(){
                            $('#evalTip').hide();
                        },1500)
					}
				}
			});
		};
		//流程详细(未使用)
		/**taskId=686 显示流程的内容
		 * 说明：将加载问题以及流程的接口合并为一个getAnswerByQid
		*/
		function processDetail(){
			$.ajax({
				type:"post",
				url:"/QuestionHk/getFlowitemByWebId",
				data:{
					// 'webId':webId,
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
							linkAns();
						}
					}
				}
			});
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


		//富文本中问题链接
		function filterlink(){
			$('.welcomeWords').css('color','#747472')
			.attr('title','');
		}

		//处理富文本路径
		function richText(elem,type){
			var pathHead=/(^\/)/;
			for(var i=0;i<elem.length;i++){
				if(type==1){//此标签具有src属性
					var elemHref=elem.eq(i).attr('href');
					if(pathHead.test(elemHref)){
						elem.eq(i).attr('href',localPath+elemHref);
					}
				}else if(type=2){
					var elemSrc=elem.eq(i).attr('src');
					if(pathHead.test(elemSrc)){
						elem.eq(i).attr('src',localPath+elemSrc);
					}
				}
			}
		}

		/**taskId=686 Amend by 赵宇星 给所有的地址改为链接
		 * @parmam str 答案的内容
		 */
		function changeLink(str){
			var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
			// var reg2=/(src="|href=")/g;
			str = str.replace(reg, "<a href='$1$2'>$1$2</a>").replace(/\n/g, "<br />");
			return str;
		}


		// $('body').on('tap', '.wflink', function() {
		// 	$this = $(this);
		// 	var fid = $this.attr('rel');
		// 		title=encodeURI($this.html());
		// 		window.location.href='detail.html?id='+id+'&solutionType='+solutionType+'&title='+title;
		// 	var tarObj = $('#wfl_'+fid);
			
		// 	//所有框恢复初始状态
		// 	$('.Ider').css('border-color', '#E4E4E4');
		// 	$('.Ider').find('.changeDiv').css('color', '#707478');
		// 	$('.Ider').find('.title').css('background-color', '#ECEBEB');
		// 	//窗口滚动到下一步
		// 	window.scrollTo('#wfl_'+fid,800);
			
		// 	//变化
		// 	tarObj.animate({borderColor: '#DE5246'},800);
		// 	tarObj.find('.changeDiv').animate({color: '#fff'},800);
		// 	tarObj.find('.title').animate({backgroundColor: '#DE5246'},800);

		// });
		
	});
})(jQuery);

