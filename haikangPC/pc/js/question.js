;$(function(){
    var defaults = {
		collectBtn:'collectBtn',//收藏按钮
		collectForm:'collectForm',//收藏提交form表单
		goBack:'goBack'//返回首页按钮
    };
    function OnlineKnow(options){
        this.options = $.extend({}, defaults, options);
        this.questionId = '';//问题id
        this.solutionType = '';//问题类型
        this.isColltected = 0;//是否收藏
        this.isLogin = '';//是否登录
		this.userName = '';//用户名
		this.mobile = '';//手机号
		this.originUrl = '';//原始路径
		this.localPath = '';//当前域名
    }
    OnlineKnow.prototype = {
        init: function(){
			this.initParams()
        },
        /**
         * initParams:获取url中的参数
        */
        initParams:function(){
            var This = this;
            var Request = This.getUrlSearch();
            This.questionId = Request.id;
            This.solutionType = Request.solutionType;
            This.isLogin = Request.iticket;
			This.userName = Request.userName || '';
			This.mobile = Request.mobile || '';
			if(Request.mobile){
				This.userName = Request.mobile
			}
			This.isColltected = sessionStorage.getItem("iscollected");
			This.originUrl = window.location.protocol+'//'+window.location.host+window.location.pathname+'?id='+This.questionId+'&solutionType='+This.solutionType;
			//进入子页面 用于移动端标识已经入子页面
			sessionStorage.setItem('goDetail',1);
			//处理富文本路径问题
			This.localPath='http://haikang.faqrobot.cn';
			This.initStyle()
			This.questionDetails()
			This.clickCollect()
			This.clickGoBack()
        },
        /**
         * getUrlSearch:获取url地址
        */
        getUrlSearch: function(){
            var request = {};
            var name,value; 
            var str = location.href; //取得整个地址栏
            var num = str.indexOf("?")
            str = str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
            var arr = str.split("&"); //各个参数放到数组里
            for(var i=0;i < arr.length;i++){ 
                num = arr[i].indexOf("="); 
                if(num > 0){ 
                    name = arr[i].substring(0,num);
                    value = arr[i].substr(num+1);
                    request[name] = value;
                } 
            }
            return request;
		},
		/**
		 * initStyle：初始化样式
		*/
		initStyle: function(){
			var This = this;
			//加载时收藏的样式
			if(This.isColltected == 1){
				$('#'+This.options.collectBtn).val('取消收藏').addClass('collected');
			}else{
				$('#'+This.options.collectBtn).val('收藏').removeClass('collected');
			}
			//读取是否去认证 如果触发一次收藏
			if(sessionStorage.getItem('collectLogin') == 1 && This.isLogin == 1){
				if(This.isColltected == 0){
					This.isColltected = 1;
				}else{
					This.isColltected = 0;
				}
				//发送ajax请求
				This.collect($('#'+This.options.collectBtn));
				sessionStorage.setItem('collectLogin',0);
			}
		},
        /**
         * questionDetails:获取问题详情
        */
        questionDetails: function(){
			var This = this
            $.ajax({
				url:'/QuestionHk/getAnswerByQid',
				type:'post',
				data:{
					qId:This.questionId
				},
				dataType:'json',
				cache:false,
				success:function(data, textStatus, request){
					if(!data.status||data.status==0){
						var html = "",
							ansHtml='';//答案为流程，显示流程的内容,不显示答案
						var ques = This.filterQue(data.question);//处理语音、图片等信息问题 去除_xgn
						//获取答案的类型
						var ansType='';
						if(data.list && data.list[0]){
							if(data.list.length <= 1){//只有一条答案
								ansType = data.list[0].Mode||'';
								if(!data.list[0].Answer){
									data.list[0].Answer = '';
								}
								/**taskId=686 Amend by 赵宇星
								 * 说明：如果答案为流程，则展示该流程的入口,不展示答案
								 * */
								if(ansType == 6){
									ansHtml = '<div>'+'<a class="flow" ansType="'+ansType+'" modeValue="'+(data.list[0].ModeValue||'')+'">'+(data.list[0].ModeInfo||'')+'</a></div>';
								}else{
									ansHtml = data.list[0].Answer;
								}

								html+= '<div class="list-group" id="'+This.questionId+'">'+
										'<p class="one">Q:'+ques+'</p>'+
										'<div class="showAns" ansType="'+ansType+'" modeValue="'+(data.list[0].ModeValue||'')+'">'+
											'<span class="tit">A：</span><div class="page">'+ansHtml+'</div>'+
										'</div>'+
									'</div>';
							}else{
								for(var i = 0; i < data.list.length;i++){
									ansType = data.list[i].Mode||'';
									if(!data.list[i].Answer){
										data.list[i].Answer = '';
									}
									/**taskId=686 Amend by 赵宇星
									 * 说明：如果答案为流程，则展示该流程的入口
									 * */
									if(ansType == 6){
										ansHtml = '<div>'+'<a class="flow" ansType="'+ansType+'" modeValue="'+(data.list[i].ModeValue||'')+'">'+(data.list[i].ModeInfo||'')+'</a>'
										'</div>'	
									}else{
										ansHtml = data.list[i].Answer;
									}
									html+= '<div class="list-group">'+
											'<div class="showAns" ansType="'+ansType+'" modeValue="'+(data.list[i].ModeValue||'')+'">'+
												'<span class="tit">A'+(i+1)+'：</span><div class="page">'+ansHtml+'</div>'+
											'</div>'+
											'</div>';
								}
								//显示一次问题
								html = '<p class="one" style="text-indent: 10px;line-height: 30px;"  id="'+This.questionId+'">Q:'+ques+'</p>'+html;
							}
							$("#showQuestion").html(html);
							/**taskId=686 说明
							 * 用于给流程、图文绑定点击事件
							*/
							This.linkAns();
							This.richText($('a'),1);
							This.richText($('img'),2);
							This.richText($('video'),2);
							This.richText($('source'),2);
							This.richText($('embed'),2);
							This.richText($('audio'),2);
							$('#showQuestion').viewer({
								url: 'data-original',
							});
						}
					}else{
						$('#evalTip').html('该问题已删除!').show();
                        setTimeout(function(){
                            $('#evalTip').hide();
                        },1500)
					}
				}
			});
		},
		/**
		 * filterQue:处理语音、图片等信息问题
		 * tmpInque: 去掉答案中带有__xgn_iyunwen_标志
		*/
		filterQue: function(tmpInque){
			if(tmpInque){
				if(new RegExp('__xgn_iyunwen_').test(tmpInque)){
					tmpInque=tmpInque.split('__xgn_iyunwen_');
					tmpInque=tmpInque[0];
				}
			}
			return tmpInque;
		},
		/**
		 * collect:收藏 取消收藏请求
		*/
		collect: function(thisBtn){
			var This = this;
			var nowCollectStatus = sessionStorage.getItem("iscollected");
			var userName = This.userName;
			// ie 浏览器中需要将username进行encode编码
			if(This.isIE()){
				userName = encodeURI(userName)
			}
			//设置ajax请求完成后运行的函数,
			$.ajax({
					type:'post',
					url:'/QuestionHk/doEditCollect',
					data:{
						id:This.questionId,
						userName:userName,
						mobile:This.mobile
					},
					success:function(data){
						if(data.status==0){
							if(This.isColltected==1){//此时为已收藏状态
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
							sessionStorage.setItem("iscollected",This.isColltected);
						}
					},
					error:function(xhr,statusText,error){
						console.log('请求错误');
					}
			});

		},
		/**
		 * clickCollect:点击进行收藏或取消收藏
		*/
		clickCollect: function(){
			var This = this;
			//收藏以及取消收藏
			$('#'+This.options.collectBtn).on('click',function(e){
				e.preventDefault();
				if(This.isLogin){//认证通过
					if(This.isColltected == 0){
						This.isColltected = 1;
					}else{
						This.isColltected = 0;
					}
					//发送ajax请求
					This.collect($(this));
				}else{
					//标识去认证
					sessionStorage.setItem('collectLogin',1);
					$('[name=originUrl]').val(This.originUrl);
					$('#'+This.options.collectForm).submit();
				}
			});
		},
		/**
		 * clickGoBack:点击返回上一层
		*/
		clickGoBack: function(){
			var This = this;
			$('#'+This.options.goBack).on('click',function(e){
				if(This.isLogin){
					window.location.href = window.location.protocol+'//'+window.location.host+'/pc/index.html?iticket=1&userName='+This.userName+'&mobile='+This.mobile;
				}else{
					window.location.href =window.location.protocol+'//'+window.location.host+ '/pc/index.html';
				}
			});
		},
		/** 
		*  linkAns: 说明：	 1、流程项的跳转 流程关联标准问题，查看跳转detail.html查看具体信息
							2、流程关联标准问题，查看跳转detail.html查看具体信息问题详细页面展示流程入口第一项，点击流程项标题进入查看流程项内容
							3、图文点击时加载详情 
		*/
		linkAns: function(){
			var This = this;
			$('.welcomeWords').on('click',function(){
				var ansType='',//标识答案类型
					id = $(this).attr("questionid"),//获取答案的id,用于在detail.js中请求
					title = encodeURI($(this).html());
				window.location.href='detail.html?id='+id+'&ansType='+ansType+'&title='+title;
			})
			$('.wflink').on('click',function(){
				var $this = $(this),
					 id = $this.attr('rel'),
					title = encodeURI($this.html()),
					ansType = 6;//标识答案类型
				window.location.href='detail.html?id='+id+'&ansType='+ansType+'&title='+title;
			})
			$('.flow').on('click',function(){
				var ansType = $(this).attr('anstype'),//标识答案类型
					id = $(this).attr("modevalue"),//获取答案的id,用于在detail.js中请求
					title = encodeURI($(this).html());
				window.location.href='detail.html?id='+id+'&ansType='+ansType+'&title='+title;
			})
			$('[anstype=1]').on('click',function(){
				var ansType=$(this).attr('anstype'),//标识答案类型
					id=$(this).attr("modevalue");//获取答案的id,用于在detail.js中请求
				window.location.href='detail.html?id='+id+'&ansType='+ansType;	
			})

		},
		/**
		 * richText:处理富文本路径
		*/
		richText: function(elem,type){
			var This = this;
			var pathHead = /(^\/)/;
			for(var i = 0;i < elem.length;i++){
				if(type == 1){//此标签具有src属性
					var elemHref = elem.eq(i).attr('href');
					if(pathHead.test(elemHref)){
						elem.eq(i).attr('href',This.localPath+elemHref);
					}
				}else if(type = 2){
					var elemSrc = elem.eq(i).attr('src');
					if(pathHead.test(elemSrc)){
						elem.eq(i).attr('src',This.localPath+elemSrc);
						elem.eq(i).attr('data-original',This.localPath+elemSrc);
					}
				}
			}
		},
		 /**
		 * @function 获得浏览器是否为ie
		*/
		isIE: function () {
			var u = navigator.userAgent;
			if (u.indexOf('Trident') > -1) {
				return true;
			} else {
				return false;
			}
		},
    }
    var OnlineKnow = new OnlineKnow({});
    OnlineKnow.init();
})