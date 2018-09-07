;$(function(){
    var defaults = {
		goBack:'goBack'//返回首页按钮
    };
    function KnowDetail(options){
        this.options = $.extend({}, defaults, options);
        this.ansId = '';//答案id
        this.ansType = '';//答案类型
        this.title = 0;//显示标题
		this.localPath = '';//当前域名
    }
    KnowDetail.prototype = {
        init: function(){
			this.initParams()
        },
        /**
         * initParams:获取url中的参数
        */
        initParams:function(){
            var This = this;
            var Request = This.getUrlSearch();
            This.ansId = Request.id,
            This.ansType =  Request.ansType,
            This.title = decodeURI(Request.title);
			//处理富文本路径问题
            This.localPath='http://haikang.faqrobot.cn';
            if(Request.title){
                $('.navbar .title').html(This.title);
            }
			if(This.ansType == 1){
                This.imgTextDetails();//加载图文详情
            }else if(This.ansType == 6){//加载流程详情
                This.processDetail();
            }else{
                This.questionDetails();
            }
            This.goBack()
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
         * imgTextDetails: 图文详情
        */
        imgTextDetails: function(){
            var This = this;
            $.ajax({
				url:'/content/getMsgDetail',//加载图文详情
				type:'post',
				data:{
					appMsgId:This.ansId
				},
				dataType:'json',
				cache:false,
				success:function(data, textStatus, request){
                    if(data.status==0){
                        var html = "";
                        if(data.wxAppMsg && data.wxAppMsg.WxappmsgDetails && data.wxAppMsg.WxappmsgDetails[0]){
                            $('.navbar .title').html(data.wxAppMsg.WxappmsgDetails[0].Title||'图文详情');
                            for(var i = 0;i < data.wxAppMsg.WxappmsgDetails.length;i++){
                                html+= '<div class="showAnsList">'+
                                         '<div class="showAns">'+(data.wxAppMsg.WxappmsgDetails[i].Content||'')+'</div>'+
                                        '</div>';
                            }
						}
						$("#showQuestion").html(html);
						//处理富文本路径问题
						This.richText($('a'),1);
						This.richText($('img'),2);
						This.richText($('video'),2);
						This.richText($('source'),2);
						This.richText($('embed'),2);
						This.richText($('audio'),2);
						$('#showQuestion').viewer({
							url: 'data-original',
						});
                    }else{
						$('#evalTip').html(data.message).show();
                        setTimeout(function(){
                            $('#evalTip').hide();
                        },1500)
					}
                    
				}
			});
        },
        /**
         * processDetail: 流程详情
        */
        processDetail: function(){
            var This = this;
            $.ajax({
				url:'/QuestionHk/findFlowItemDetail',
				type:'post',
				data:{
					fId:This.ansId
				},
				dataType:'json',
				cache:false,
				success:function(data, textStatus, request){
                    var html = "";
                    if(data.status==0){
                        if(data.flowItem){
                            var ans = filterQue(data.flowItem.Info);//处理语音、图片等信息问题 去除_xgn
                            html+= '<div class="showAnsList">'+
                                        '<div class="showAns">'+
											'<div class="page">'+
												(data.flowItem.Content||'')
											+'</div>'+
                                        '</div>'+
                                    '</div>';
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
                        $('#evalTip').html(data.message).show();
                        setTimeout(function(){
                            $('#evalTip').hide();
                        },1500)
                    }
				}
			});
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
					qId:This.ansId
				},
				dataType:'json',
				cache:false,
				success:function(data, textStatus, request){
					if(!data.status||data.status==0){
						var html = "",
							ansHtml = '';//答案为流程，显示流程的内容,不显示答案
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
        goBack: function(){
            var This = this;
            $('#'+This.options.goBack).on('click',function(){
                window.history.go(-1)
            })
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
		 * clickGoBack:点击返回上一层
		*/
		clickGoBack: function(){
			var This = this;
			$('#'+This.options.goBack).on('click',function(e){
				window.history.go(-1)
			});
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
				var ansType = $(this).attr('anstype'),//标识答案类型
					id = $(this).attr("modevalue");//获取答案的id,用于在detail.js中请求
				window.location.href='detail.html?id='+id+'&ansType='+ansType;	
			})
		}
    }
    var KnowDetail = new KnowDetail({});
    KnowDetail.init();
})