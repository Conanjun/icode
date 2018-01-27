$(function(){
		var type = 1,
		    orderType = 14,//14：浏览次数倒序
		    queryType = 1,
		    webId = 34,//上线后改为83
		    pageSize = 10,
		    pageNo = 1,
			groupId = 0,
			keepId = 0,
			isSwitch = false,   //是否切换树节点
			searchStr1 ='',
			searchStr2 ='',
			collectPage='',//是否为收藏展示页
			showFlow='',//显示流程和问题
			nowWebpage='';//当前所在页面
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
		//读取url中的值
		var isLogin = Request.iticket;
		var userName=Request.userName;
		var originUrl=window.location.protocol+'//'+window.location.host+window.location.pathname;
		
		/**
		* 获取客户端信息
		*/
		//function browserRedirect() {
	      var sUserAgent = navigator.userAgent.toLowerCase();
	      var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
	      var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
	      var bIsMidp = sUserAgent.match(/midp/i) == "midp";
	      var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	      var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
	      var bIsAndroid = sUserAgent.match(/android/i) == "android";
	      var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
	      var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
			//最新图标显示
			var disType='none';
			//获得收藏状态，用于显示提示框
			function  isNew(getDate){
				//获得问题的时间
				if(getDate.UpdateTime==null||getDate.UpdateTime==''||getDate.UpdateTime==undefined){
					//var queDate= new Date(getDate.AddTime.replace(/-/g, "/"));
					var queDate=getDate.AddTime;
				}else{
					//var queDate= new Date(getDate.UpdateTime.replace(/-/g, "/"));
					var queDate= getDate.UpdateTime;
				}

				//获得系统时间
				var nowDate=new Date(),
					dayMsec=nowDate.getTime()-queDate;//获得毫秒数

				//转化为天数
				var days= parseInt(dayMsec/(1000 * 60 * 60 * 24));
				//获得3天
				if(days>=0&&days<=2){
					disType='inline-block';
				}else{
					disType='none';
				}
			}

			//pc端收藏操作
			function  doCollect(){
				$('#scroll').on('tap','.collect-icon',function(e){
					$(this).off('tap');
					e.stopPropagation();
					e.preventDefault();
					var isColltected =$(this).attr('data-collect'),
						lid=$(this).parents('li').attr('sid');
					var $that=$(this);
					//切换收藏状态
					if(isColltected==0){
						isColltected=1;
					}else{
						isColltected=0;
					}
					if(isLogin){
						$.ajax({
							type:'post',
							url:'/QuestionHk/doEditCollect',
							data:{
								id:lid,
								collect:isColltected,
								userName:userName
							},
							success:function(data){
								if(data.status==0){
									if(isColltected==1){//收藏
										$('#collectTip').html('收藏成功').show();
										$that.removeClass('glyphicon-star-empty')
											.addClass('collected glyphicon-star');
										setTimeout(function(){
											$('#collectTip').hide();
											//重新刷新页面
											restorePage(1);
										},1500);
									}else{//取消收藏
										$('#collectTip').html('取消收藏成功').show();
										$that.removeClass('glyphicon-star collected')
											.addClass('glyphicon-star-empty');
										setTimeout(function(){
											$('#collectTip').hide();
											//重新刷新页面
											restorePage(1);
										},1500);
									}
									$that.attr('data-collect',isColltected);

								}
							}
						})
					}else{
						//$('[name=id]').val(lid);
						//$('[name=webId]').val(webId);
						//$('[name=collect]').val(isColltected);
						$('[name=originUrl]').val(originUrl);
						$("#editCollectForm").submit();
					}
				});
			}

			//移动端收藏操作
			function  doCollectMob(){
				$('#scroll').on('tap','.collect-icon',function(e){
					$(this).off('tap');
					e.stopPropagation();
					e.preventDefault();
					var isColltected =$(this).attr('data-collect'),
						lid=$(this).parents('li').attr('sid');
					var $that=$(this);
					//切换收藏状态
					//切换收藏状态
					if(isColltected==0){
						isColltected=1;
					}else{
						isColltected=0;
					}
					if(isLogin){
						$.ajax({
							type:'post',
							url:'/QuestionHk/doEditCollect',
							data:{
								id:lid,
								// webId:webId,
								collect:isColltected,
								userName:userName
							},
							success:function(data){
								if(data.status==0){
									if(isColltected==1){//收藏
										$('#collectTip').html('收藏成功').show();
										$that.removeClass('glyphicon-star-empty')
											.addClass('collected glyphicon-star');
										setTimeout(function(){
											$('#collectTip').hide();
											//重新刷新页面
											refreshApp(1,'click',1);
										},1500);
									}else{//取消收藏
										$('#collectTip').html('取消收藏成功').show();
										$that.removeClass('glyphicon-star collected')
											.addClass('glyphicon-star-empty');
										setTimeout(function(){
											$('#collectTip').hide();
											//重新刷新页面
											refreshApp(1,'click',1);
										},1500);
									}
									$that.attr('data-collect',isColltected);

								}
							}
						})
					}else{
						//$('[name=id]').val(lid);
						//$('[name=webId]').val(webId);
						//$('[name=collect]').val(isColltected);
						$('[name=originUrl]').val(originUrl);
						$("#editCollectForm").submit();
					}

				});
			}
			//返回父页面
			function restore(){
				var npage=sessionStorage.getItem('pageNum');
				if(npage=='select'){
					$(".showselect").trigger('tap')
						.addClass('mui-active')
						.siblings().removeClass('mui-active')
				}else if(npage=='collect' && isLogin == 1){
					$(".showcollect").trigger('tap')
						.addClass('mui-active')
						.siblings().removeClass('mui-active')
				}else {
					$(".showfhead").trigger('tap')
						.addClass('mui-active')
						.siblings().removeClass('mui-active')
				}
			}

			//设置sessionStorage中的数据
			function setItem(pageName,item,value){
				var sessionItem=pageName+item;
				sessionStorage.setItem(sessionItem,value);
			}
			//读取sessionStorag中的数据
			function getItem(pageName,item,value){
				var sessionItem=pageName+item;
				var result=sessionStorage.getItem(sessionItem,value);
				return result;
			}

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

			//pc端
	      if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
			//	页面加载完成后，开始还原页面
			window.onload=function(){
				restore();
			};
	   		$('.mui-table-view').css('padding','0 5%');//数据列表
	   		$('.fhead a span').css('width','30%');//排序
	   		$('#pullrefresh').css('overflow-y','auto');//下拉刷新容器
	   		$('.mui-bar-nav~.mui-content').css('padding-top','81px');
	   		$('.fhead .imga').css('right','2rem');//向下箭头
			$('.fhead .imgb').css('right','0.3rem');
			$('.fhead .imgc').css('right','1.6rem');
	   		$("#pageList").css({
	   			'float': 'right',
				'margin-top': '60px',
				'margin-right':'14%'
	   		});

	   		//禁止pc端侧滑
			$('.mui-inner-wrap').on('drag', function(event) {
			    event.stopPropagation();
			});
			$('.tree').css('display','block');
	   		$('.mui-table-view').addClass('col-md-9');
	   		$(window).resize(function(){
				$('.mui-off-canvas-wrap').css({
					'overflow-x':'scroll',
					'min-width':'1000px'
				});
				$('.fhead').css('min-width','1000px');
				$('.col-md-12').addClass('col-xs-12');
				$('.col-md-2').addClass('col-xs-3');
				$('.col-md-9').addClass('col-xs-9');
			});

			//pc端加载列表（首页、搜索页、收藏页显示）
	   		function refresh(pageNo,collectShow){
				$.ajax({
					url:'/QuestionHk/doFindQueList',
					type:'post',
					data:{
						question:searchStr1,
						answer:searchStr2,
						type:type,
						orderType:orderType,
						// webId:webId,
						pageSize:pageSize,
						pageNo:pageNo,
						queryType:queryType,//默认1：问题
						groupId:groupId,
						collect:collectShow,//显示收藏情况
						showFlow:showFlow,
						userName:userName
					},
					dataType:'json',
					cache:true,
					async:true,
					success:function(data){
						if(data.status == 0){
							if(data.list){
								//存储问题内容
								var ques='';
								if(data.list.Items != null && data.list.Items.length > 0){
									var html = '';
									for(var i = 0;i < data.list.Items.length;i++){
											/*  taskId = 477 海康优化
											*   搜索的内容是否匹配到问题中的某个字词，匹配到则标记红色
											*/
											if($('#keyword').val()){
												if(data.list.Items[i].Question.match($('#keyword').val())){
													data.list.Items[i].Question = data.list.Items[i].Question.split($('#keyword').val()).join('<span class="AU_replaceTip">'+$('#keyword').val()+'</span>');
												}else{
													data.list.Items[i].Question = data.list.Items[i].Question
												}
											}
											//判断是否添加新图标
											isNew(data.list.Items[i]);
											//提取语音或图片的问题内容
											ques=filterQue(data.list.Items[i].Question);
											html+='<li class="mui-table-view-cell question" sId="'+data.list.Items[i].Id+'" SolutionType = "'+data.list.Items[i].SolutionType+'">'+
												'<div class="border-bottom">'+
												'<h4 class="txt" questionId="'+data.list.Items[i].Id+'">'+(i+1)+'. '+'<img src="images/new.png" style="display:'+disType+'">'+ques+'</h4>'+
												// '<span class="ispan">'+data.list.Items[i].UserName+'</span><span class="ispan ml">'+data.list.Items[i].GroupName+'</span>'+
												'<div style="height:20px;">'+
												'<span class="glyphicon collect-icon img '+(data.list.Items[i].collect ? "collected glyphicon-star" : "glyphicon-star-empty")+'" data-collect="'+data.list.Items[i].collect+'"></span>'+
												// '<span class="img"><img src="images/good.png" class="img1 good"  zId="'+data.list.Items[i].Id+'" dataGood="'+data.list.Items[i].Usefull+'">&nbsp;<i>'+(data.list.Items[i].Usefull ? data.list.Items[i].Usefull : 0)+'</i></span>'+
												// '<span class="img"><img src="images/bad.png" class="img2 bad"  cId="'+data.list.Items[i].Id+'" >&nbsp;<i>'+(data.list.Items[i].Useless ? data.list.Items[i].Useless : 0)+'</i></span>'+
												'<span class="img"><img src="images/eye.png" class="img3 eye"  eId="'+data.list.Items[i].Id+'" >&nbsp;<i>'+(data.list.Items[i].Hits ? data.list.Items[i].Hits : 0)+'</i></span>'+
												'</div>'+
												'</div>'
											'</li>';
											//${data.list.Items[i].collect?'collected glyphicon-star':'glyphicon-star-empty
									}
									$('.cell').html(html);
									$('.tbody1').empty().append(html);

									var options = {
										data: [data.list, 'Items', 'TotalCount'],
										currentPage: data.list.CurrentIndex,
										totalPages: data.list.PageCount ? data.list.PageCount : 1,
										alignment: 'right',
										onPageClicked: function(event, originalEvent, type, page) {
											pageNo = page;
											//保存当前页面的页码 便于返回
											setItem(nowWebpage,'currentPage',pageNo);
											refresh(pageNo,collectPage);
										}
									};
									$('#pageList').bootstrapPaginator(options);
									$('#currentPage').val(data.list.CurrentIndex);
								}else{
									$('.cell').html('<div style="text-align:center;font-size: 1rem;margin-top: 20px;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空</div>');
									$('#pageList').empty();
								}
							}
						}
					},
					error:function(){
						console.log("接口调用失败！");
					}
				});
			}
			//重新加载页面，还原页码  通过读取godetail值判断记录本页面是否进入详情页 未进入则为1位数，进入过为2位
			function restorePage(collectPage){
				var currentPage=1;
					//判断当前页面处于什么页面
				if(sessionStorage.getItem('pageNum')==''||sessionStorage.getItem('pageNum')==null||sessionStorage.getItem('pageNum')==undefined){
					nowWebpage='fhead';
				}else{
					nowWebpage=sessionStorage.getItem('pageNum');
				}
					//获得分类
				if(getItem(nowWebpage,'groupId')==''||getItem(nowWebpage,'groupId')==null||getItem(nowWebpage,'groupId')==undefined){
					groupId=0;
				}else{
					groupId=getItem(nowWebpage,'groupId');
				}
				//zTreeOnAsyncSuccess();
				//获得当前页码
				if(getItem(nowWebpage,'currentPage')==''||getItem(nowWebpage,'currentPage')==null||getItem(nowWebpage,'currentPage')==undefined){
					currentPage=1;
				}else{
					currentPage=getItem(nowWebpage,'currentPage');
				}

				//如果当前页面为搜索页
				if(nowWebpage=='select'){
					//如果queryType 不为空读取queryType
					if(!(sessionStorage.getItem('queryType')==null||sessionStorage.getItem('queryType')==''||sessionStorage.getItem('queryType')==undefined)){
						queryType=sessionStorage.getItem('queryType');
					}else{
						queryType=1;
					}
					//读取keywork 如果不为null则作为查询字符串
					var keyword=sessionStorage.getItem('keyword');
					if((keyword==null||keyword==undefined)){
						keyword='';
					}else{
						if(queryType=='1'){//问题
							searchStr1 =keyword;
							searchStr2 ='';
							$('#keyword').val(keyword);
							$(".selectContanier>.col1").val('问题');
						}else if(queryType=='2'){//答案
							searchStr2 =keyword;
							searchStr1 ='';
							$('#keyword').val(keyword);
							$(".selectContanier>.col1").val('答案');
						}
					}

				}else{//如果不是搜索页，则清空keyword,queryType=1
					queryType=1;
					searchStr1 ='';
					searchStr2 ='';
				}
				//加载当前页面
				refresh(currentPage,collectPage);
			}

			//点击搜索按钮搜索
	   		$(document).on('click','#search',function(){
	   			if($(".selectContanier>.col1").val()=='问题'){
	   				if($('#keyword').val()==undefined||$('#keyword').val()==null){
	   					//searchStr1 = 'question='+'';
	   					searchStr1 ='';
	   				}else{
	   					//searchStr1 = 'question='+$('#keyword').val();
	   					searchStr1 =$('#keyword').val();
	   				}
					//searchStr2 = 'answer='+'';
					searchStr2 ='';
					type = 1;
					queryType = 1;//问题
				}else if($(".selectContanier>.col1").val()=='答案'){
					if($('#keyword').val()==undefined||$('#keyword').val()==null){
						//searchStr2 = 'answer='+'';
						searchStr2 = '';
					}else{
						//searchStr2 = 'answer='+$('#keyword').val();
						searchStr2 =$('#keyword').val();
					}
					//searchStr1 = 'question='+'';
					searchStr1 ='';
					type = 1;
					queryType = 2;//答案
				}
				//存储搜索内容便于返回
				sessionStorage.setItem('queryType',queryType);
				sessionStorage.setItem('keyword',$('#keyword').val());
				refresh(1,collectPage);
			});
			//回车触发搜索
			$("#keyword").on('keyup',function(e){
				e.preventDefault();
				if(e.keyCode == 13){
					$("#search").trigger('click');
				}
			});

			//切换标签
			//首页
			$(".showfhead").on("tap",function(){
				$('.mui-content').css({'top':'37px'});
				$('.search-pc').hide();
				$(".fhead").show();
				$('[name=search]').val('');
				//是否为收藏页 该变量作为请求参数
				collectPage='';
				//设置当前页面的值：首页
				nowWebpage='fhead';
				//记录本页面的代号,以便从子页面返回时，触发对应父页面的事件代理
				sessionStorage.setItem("pageNum",'fhead');
				//加载 首页页面
				restorePage(collectPage);
				//去除收藏按钮功能
				$('#scroll').off('tap','.collect-icon');
			});

			//搜索页
			$(".showselect").on("tap",function(){
				$('.mui-content').css({'top':'37px'});
				$(".fhead").hide();
				$('.search-pc').show();
				$('[name=search]').val('');
				$('.col1').val(0);
				//是否为收藏页:不是
				collectPage='';
				//设置当前页面的值：搜索页
				nowWebpage='select';
				sessionStorage.setItem("pageNum",'select');
				//加载 搜索页 页面
				restorePage(collectPage);
				//去除收藏按钮功能
				$('#scroll').off('tap','.collect-icon');
			});

			//收藏页
			$(".showcollect").on('tap',function(e){
				e.preventDefault();
				$('.mui-content').css({'top':'37px'});
				$('.search-pc').hide();
				$(".fhead").show();
				$('[name=search]').val('');
				searchStr1 ='';
				//是否为收藏页:是
				collectPage=1;
				//设置当前页面的值：收藏页
				nowWebpage='select';
				sessionStorage.setItem("pageNum",'collect');
				//加载 搜索页 页面
				$('[name=question]').val(searchStr1);
				$('[name=answer]').val(searchStr2);
				$('[name=type]').val(type);
				$('[name=orderType]').val(orderType);
				$('[name=queryType]').val(queryType);
				// $('[name=webId]').val(webId);
				$('[name=pageSize]').val(pageSize);
				$('[name=pageNo]').val(pageNo);
				$('[name=groupId]').val(groupId);
				$('[name=collect]').val(1);
				$('[name=showFlow]').val(showFlow);
				$('[name=originUrl]').val(originUrl);
				if(isLogin){
					restorePage(collectPage);
				}else{
					$('#showcollect').submit();
				}
				doCollect();
			});

			//全部
			$("#all").on('tap',function(){
				orderType=14;//浏览次数倒序
				groupId = 0;
				$('li.question').remove();//删除默认出现的数据
				$(".imga").attr("src","images/down.png");
				$(".imgb").attr("src","images/down.png");
				$(".imgc").attr("src","images/down.png");
				//zTreeOnAsyncSuccess();
				refresh(1,collectPage);
				setItem(nowWebpage,'groupId',groupId);
			});

			//浏览次数排序
			var off = true;
			$("#browsetm").on("tap",function(){
				if(off){
					orderType=13;//浏览次数正序
					$('li.question').remove();//删除默认出现的数据
					$(".imga").attr("src","images/up.png");
					refresh(1,collectPage);
					off = false;
				}else{
					orderType=14;//浏览次数倒序
					$('li.question').remove();//删除默认出现的数据
					$(".imga").attr("src","images/down.png");
					refresh(1,collectPage);
					off = true;
				}
			});

			//点赞次数排序
			var on = true;
			$("#zan").on("tap",function(){
				if(on){
					orderType=15;//2：满意度正序
					$('li.question').remove();//删除默认出现的数据
					$(".imgb").attr("src","images/up.png");
					refresh(1,collectPage);
					on = false;
				}else{
					orderType=16;//2：满意度倒序
					$('li.question').remove();//删除默认出现的数据
					$(".imgb").attr("src","images/down.png");
					refresh(1,collectPage);
					on = true;
				}
			});

			//不满意度排序
			var onoff = true;
			$("#cai").on("tap",function(){
				if(onoff){
					orderType=17;//不满意度正序
					$('li.question').remove();//删除默认出现的数据
					$(".imgc").attr("src","images/up.png");
					refresh(1,collectPage);
					onoff = false;
				}else{
					orderType=18;//不满意度倒序
					$('li.question').remove();//删除默认出现的数据
					$(".imgc").attr("src","images/down.png");
					refresh(1,collectPage);
					onoff = true;
				}
			});
			//回到原始页面时 还原状态
			//点击进入问题详情界面
			$("#scroll").on("tap","li",function(){
				var id = $(this).attr("sId");
				var iscollected=$(this).find('.collect-icon').attr('data-collect');
				sessionStorage.setItem('iscollected',iscollected);
				var solutionType = $(this).attr('SolutionType');
				$.ajax({
					type:"post",
					url:"/QuestionHk/doAddHits",
					data:{
						'id':id
						// 'webId':webId
					},
					async:true,
					cache:true,
					success:function(data){
						setTimeout(function(){
							if(isLogin){
								//保存页面的页数
								window.location.href = 'question.html?id='+id+'&solutionType='+solutionType+'&currentPage='+$('#currentPage').val()+'&iticket=1'+'&userName='+userName;
							}else{
								//保存页面的页数
								window.location.href = 'question.html?id='+id+'&solutionType='+solutionType+'&currentPage='+$('#currentPage').val();
							}
						},200)
					}
				});
			});
   			//展示分类
			var classsetting = {
				view: {
					dblClickExpand: false,
					showIcon: false
				},
				data: {
					simpleData: {
						enable: true,
						idKey: "Id",
						pIdKey: "ParentId",
						rootPId: 0
					},
					key: {
						name: "Name"
					}
				},
				async: {
					enable: true,
					url: "/QuestionHk/doFindGroupList",
					autoParam: ["id"],
					dataFilter: ajaxDataFilter
				},
				callback: {
					onClick: ZTreeClassClick,
					beforeClick: zTreeBeforeClick,
					onAsyncSuccess: zTreeOnAsyncSuccess
				}
			};
			//格式化一步获取的json数据
			function ajaxDataFilter(treeId, parentNode, responseData) {
				var list = [];
				if (responseData) {
					responseData.list.push({
						Id: 0,
						ParentId: 0,
						Name: "全部分类",
						open: true
					});
					for(var i = 0;i < responseData.list.length;i++){
						if(responseData.list[i].ParentId == '2089'||responseData.list[i].ParentId == '1558'||responseData.list[i].Id == 2089||responseData.list[i].Id == '1558'){
							//list.push();
						}else{
							list.push(responseData.list[i]);
						}
					}
					responseData.list = list;
					return responseData.list;
				}
				return responseData;
			}
			function ZTreeClassClick(treeId, treeNode) {
				var zTree = $.fn.zTree.getZTreeObj('treeLeftClasses');
				Nodes = zTree.getSelectedNodes();
				$('#toShow [name=groupId]').val(Nodes[0].Id);
				$('#toShow [name=groupName]').val(Nodes[0].Name);
				groupId = $('#toShow [name=groupId]').val();
				//存储树的节点便于返回
				//sessionStorage.setItem("groupId",groupId);
				setItem(nowWebpage,"groupId",groupId);
				refresh(1,collectPage);

			}
			function zTreeBeforeClick(treeId, treeNode, clickFlag) {
				//return ! treeNode.isParent; //当是父节点 返回false不让选取
			}
			function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
				var treeObj = $.fn.zTree.getZTreeObj('treeLeftClasses');
				//返回后停在原先的节点
				if(getItem(nowWebpage,"groupId")==""||getItem(nowWebpage,"groupId")==null||getItem(nowWebpage,"groupId")==undefined){
					var nowGroupId=0;
				}else{
					var nowGroupId=getItem(nowWebpage,"groupId");
				}
				var node= treeObj.getNodeByParam("Id",groupId, null);
				if(node){
					treeObj.selectNode(node);
				}
			}
			function filterP(node) {
				return (node.isParent == false);
			}
			$.fn.zTree.init($('#treeLeftClasses'), classsetting, []);
		  } else {//移动端
			  $('#space').hide();
			  $('.ztree *').css('font-size','16px');
			  //还原进入详情页前的状态
			  window.onload=function(){
				  //如果从子页面返回，读取树节点
				  if(sessionStorage.getItem('goDetail')=='1'){
					  keepId=sessionStorage.getItem('keepIdMob');
					  if(keepId==null||keepId==undefined||keepId==''){
						  keepId=0;
					  }
					 // zTreeOnAsyncSuccess();
					//  var npage = sessionStorage.getItem('pageNum');
					// if(npage=='select'){
					// 	$('.txtselect').css('display','block');
					// 	$(".showselect").addClass('mui-active')
					// 		.siblings().removeClass('mui-active')
					// 	$('.mui-content').css({'top':'96px'});	
					// }else if(npage=='collect' && isLogin == 1){
					// 	$(".showcollect").addClass('mui-active')
					// 		.siblings().removeClass('mui-active')
					// }else {
					// 	$(".showfhead").addClass('mui-active')
					// 		.siblings().removeClass('mui-active')
					// }
					// $('.cell').html(localStorage.getItem('dataSrc'));
					// if(localStorage.getItem('scrollY').split('px')[0] >= 0){
					// 	mui('#pullrefresh').scroll().scrollTo(0,0);
					// }else{
					// 	mui('#pullrefresh').scroll().scrollTo(0,localStorage.getItem('scrollY').split('px')[0]);
					// }
					// mui('#pullrefresh').pullRefresh().refresh(false);
					// $('#pullrefresh').on('touchmove',function(){
					// 	$('#scrollApp').css('transform','0px '+localStorage.getItem("scrollY")+' 0px !important');
					// })
					// sessionStorage.setItem('goDetail',0)
				  }else{
					  	keepId=0;
						//restore();
				  }
				  //恢复搜索页
				  if(sessionStorage.getItem("pageNum")=='select'){
					  if(sessionStorage.getItem('queryTypeMob')){
						  queryType=sessionStorage.getItem('queryTypeMob');
					  }else{
						  queryType=1;
					  }
					  if(queryType==1){
						  if(sessionStorage.getItem('keywordMob')){
							  searchStr1=sessionStorage.getItem('keywordMob');
						  }else{
							  searchStr1='';
						  }
					  }else if(queryType==2){
						  if(sessionStorage.getItem('keywordMob')){
							  searchStr2=sessionStorage.getItem('keywordMob');
						  }else{
							  searchStr2='';
						  }
					  }
				  }
				  restore();
			  };

			  $("h1.mui-title").before('<a class="glyphicon glyphicon-indent-left leftSwitch" style="color:#fff;font-size:25px;line-height:34px;"></a>');
			  $('#toShow').remove();
			  $('#groupTree').slimScroll({
				  height: $(window).height()+ 'px',
				  allowPageScroll: false
			  });
			  $('.tree').css('display','none');
			  $('.mui-table-view').removeClass('col-md-9');
			  $('.col-md-12').css({
				  'padding-left':'0',
				  'padding-right':'0'
			  });
			  $('.fhead a span').css('width','100%');
			  $('.fhead .imga').css('right','2.3rem');
			  $('.fhead .imgb').css('right','0rem');
			  $('.fhead .imgc').css('right','0.5rem');
			  //初始化mui
			  mui.init({
				  pullRefresh: {
					  container: '#pullrefresh',
					  /*down: {
					   callback: pulldownRefresh
					   },*/
					  up: {
							contentinit: '  ',
							contentdown: '  ',
							contentrefresh: '正在加载...',
							contentnomore: '  ',// 可选，请求完毕若没有更多数据时显示的提醒内容；
						  callback: pullupRefresh
					  }
				  }
			  });

			  /**
			   * 上拉加载具体业务实现
			   */
			  var ispullupRefresh=0;//上拉刷新加载内容标记
			  function pullupRefresh() {
				  var pagecount = sessionStorage.getItem('pageCount');
				  pageNo = sessionStorage.getItem('curr');
				  pageNo ++;
				  setTimeout(function() {
					  if(pageNo <= pagecount){
						  mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
						  mui('#pullrefresh').pullRefresh().disablePullupToRefresh();//防止反复刷新
						  ispullupRefresh=1;
						  refreshApp(pageNo,'',collectPage);
					  }else{
						  mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);//参数为true代表没有更多数据了。
					  }
					  /*setTimeout(function(){
					   mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
					   }, 2000);*/ // 显示“没有更多了”2s后执行：关闭向下加载更多功能（直接隐藏了“没有更多”）
				  }, 1500);
			  }
				
			  function showContentMob(data,searchType){
				  if(data.status == 0){
					  //存储问题内容
					  var ques='';
					  if(data.list.Items != null && data.list.Items.length > 0){
						  var html = '';
						  for(var i = 0;i < data.list.Items.length;i++){
							  //恢复搜索
								if(sessionStorage.getItem("pageNum")=='select'){
									if(queryType=='1'){//问题
										$(".col1").eq(0).val('问题');
										$('[name=search]').eq(0).val(searchStr1);
									}else if(queryType=='2'){//答案
										$(".col1").eq(0).val('答案');
										$('[name=search]').eq(0).val(searchStr2);
									}
								}
							  /*  taskId = 477 海康优化
								*   搜索的内容是否匹配到问题中的某个字词，匹配到则标记红色
								*/
								if($('#searchVal').val()){
									if(data.list.Items[i].Question.match($('#searchVal').val())){
										data.list.Items[i].Question = data.list.Items[i].Question.split($('#searchVal').val()).join('<span class="AU_replaceTip">'+$('#searchVal').val()+'</span>');
									}else{
										data.list.Items[i].Question = data.list.Items[i].Question
									}
								}
							  //判断显示new图标
							  isNew(data.list.Items[i]);
							  ques=filterQue(data.list.Items[i].Question);
							  html+='<li class="mui-table-view-cell question" sId="'+data.list.Items[i].Id+'" SolutionType = "'+data.list.Items[i].SolutionType+'">'+
								  '<div class="border-bottom">'+
								  '<h4 class="txt" questionId="'+data.list.Items[i].Id+'">'+((data.list.PageSize)*(data.list.CurrentIndex-1)+(i+1))+'. '+'<img src="images/new.png" style="display: '+disType+'">'+ques+'</h4>'+
								//   '<span class="ispan">'+`${data.list.Items[i].UserName?data.list.Items[i].UserName:'未知'}`+'</span><span class="ispan ml">'+`${data.list.Items[i].GroupName?data.list.Items[i].GroupName:'未知'}`+'</span>'+
								  '<div style="height:20px;">'+
								  '<span class="glyphicon collect-icon img '+(data.list.Items[i].collect ? "collected glyphicon-star" : "glyphicon-star-empty")+'" data-collect="'+data.list.Items[i].collect+'"></span>'+
								//   '<span class="img"><img src="images/good.png" class="img1 good"  zId="'+data.list.Items[i].Id+'" dataGood="'+data.list.Items[i].Usefull+'">&nbsp;<i>'+(data.list.Items[i].Usefull ? data.list.Items[i].Usefull : 0)+'</i></span>'+
								//   '<span class="img"><img src="images/bad.png" class="img2 bad"  cId="'+data.list.Items[i].Id+'" >&nbsp;<i>'+(data.list.Items[i].Useless ? data.list.Items[i].Useless : 0)+'</i></span>'+
								  '<span class="img"><img src="images/eye.png" class="img3 eye"  eId="'+data.list.Items[i].Id+'" >&nbsp;<i>'+(data.list.Items[i].Hits ? data.list.Items[i].Hits : 0)+'</i></span>'+
								  '</div>'+
								  '</div>'+
								  '</li>';
						  }
						  $('.cell .showPage').remove();
						  if(searchType == 'click'){
							  isSwitch = true;
						  }
						  if(isSwitch){
							  $('.cell').html(html);
						  }else{
							  $('.cell').append(html);
						  }
						  $('#currentPage').val(data.list.CurrentIndex);
						  $('#pageCount').val(data.list.PageCount);
						  sessionStorage.setItem('curr',data.list.CurrentIndex);
						  sessionStorage.setItem('pageCount',data.list.PageCount);	
						  if(data.list.Items.length<10){
							  mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);//标识没有更多数据
							  if(ispullupRefresh==1){
								  $('.cell').append('<div class="showPage" style="text-align:center;font-size:15px;font-weight:700;margin-top: 40px;color:#777;">&nbsp;&nbsp;没有更多数据了</div>');
							  }else{
								  $('.cell .showPage').remove();
							  }
							  return ;
						  }else{
							  //启动刷新
							   mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
						  }
						  //数据加载结束重启刷新
						   mui('#pullrefresh').pullRefresh().refresh(true);
					  }else{
						  $('.cell').html('<div class="showPage" style="text-align:center;font-size: 1.1rem;margin-top: 20px;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空</div>');
						  //静止滑动
						  mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
						  //标识没有更多数据
						  mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);//标识没有更多数据
						  return ;
					  }
				  }
			  }
			  function refreshApp(pageNo,searchType,collectShow){
				  if(keepId != groupId){
					  isSwitch = true;
				  }else{
					  isSwitch = false;
				  }
				  groupId = keepId;
				  $.ajax({
					  url:'/QuestionHk/doFindQueList',
					  type:'post',
					  data:{
						  question:searchStr1,
						  answer:searchStr2,
						  type:type,
						  orderType:orderType,
						  queryType:queryType,
						//   webId:webId,
						  pageSize:pageSize,
						  pageNo:pageNo,
						  groupId:groupId,
						  collect:collectShow,//显示收藏情况
						  showFlow:showFlow,
						  userName:userName
					  },
					  dataType:'json',
					  cache:true,
					  async:true,
					  success:function(data){
						  showContentMob(data,searchType);
					  },
					  error:function(){
						  console.log("接口调用失败！");
					  }
				  });
			  }
			 
			  //点击左侧触发滑动
			  $('.leftSwitch').on('tap',function(e){
				  e.stopPropagation();
				  mui('.mui-off-canvas-wrap').offCanvas('show');
			  });

			  //全部
			  $("#all").on('tap',function(){
				  orderType=14;//浏览次数倒序
				  groupId = 0;
				  $('li.question').remove();//删除默认出现的数据
				  $(".imga").attr("src","images/down.png");
				  $(".imgb").attr("src","images/down.png");
				  $(".imgc").attr("src","images/down.png");
				  refreshApp(1,'click',collectPage);
			  });

			  //浏览次数排序
			  var off = true;
			  $("#browsetm").on("tap",function(){
				  if(off){
					  orderType=13;//浏览次数正序
					  $('li.question').remove();//删除默认出现的数据
					  $(".imga").attr("src","images/up.png");
					  //refresh(1);
					  refreshApp(1,'click',collectPage);
					  off = false;
				  }else{
					  orderType=14;//浏览次数倒序
					  $('li.question').remove();//删除默认出现的数据
					  $(".imga").attr("src","images/down.png");
					  refreshApp(1,'click',collectPage);
					  off = true;
				  }
			  });

			  //点赞次数排序
			  var on = true;
			  $("#zan").on("tap",function(){
				  if(on){
					  orderType=15;//2：满意度正序
					  $('li.question').remove();//删除默认出现的数据
					  $(".imgb").attr("src","images/up.png");
					  refreshApp(1,'click',collectPage);
					  on = false;
				  }else{
					  orderType=16;//2：满意度倒序
					  $('li.question').remove();//删除默认出现的数据
					  $(".imgb").attr("src","images/down.png");
					  refreshApp(1,'click',collectPage);
					  on = true;
				  }
			  });

			  //不满意度排序
			  var onoff = true;
			  $("#cai").on("tap",function(){
				  if(onoff){
					  orderType=17;//不满意度正序
					  $('li.question').remove();//删除默认出现的数据
					  $(".imgc").attr("src","images/up.png");
					  //refresh(1);
					  refreshApp(1,'click',collectPage);
					  onoff = false;
				  }else{
					  orderType=18;//不满意度倒序
					  $('li.question').remove();//删除默认出现的数据
					  $(".imgc").attr("src","images/down.png");
					  refreshApp(1,'click',collectPage);
					  onoff = true;
				  }
			  });
			  //阻尼系数
			  var deceleration = mui.os.ios?0.003:0.0009;
			  mui('.mui-content').scroll({
				  bounce: false,
				  indicators: true, //是否显示滚动条
				  deceleration:deceleration
			  });
			  $('.mui-content').css({'top':'37px'});

			  //主页面、搜索页面、收藏页面的跳转
			  $(".showfhead").on("tap",function(){
				  //mui('#pullrefresh').pullRefresh().refresh(true);
				  mui('#pullrefresh').pullRefresh().scrollTo(0,0);
				  $('.mui-content').css({'top':'37px'});
				  $(".txtselect").hide();
				  $(".fhead").show();
				  //$(".msearch").css("color","#929292");
				  $('[name=search]').val('');
				  //清空查询在字符串
				  searchStr1 ='';
				  searchStr2 ='';
				  collectPage='';//是否为收藏页 该变量作为请求参数
				  nowWebpage='fheadMob'; //设置当前页面的值：首页
				  ispullupRefresh=0;//清空下拉刷新标记
				  //记录本页面的代号,以便从子页面返回时，触发对应父页面的事件代理
				  sessionStorage.setItem("pageNum",'fhead');
				  //如果是切换界面，则keepId=0
				  if(sessionStorage.getItem('goDetail')!='1'){
					  keepId=0;
					  sessionStorage.setItem("keepIdMob",keepId);
					  //zTreeOnAsyncSuccess();
				  }
				  //清空本已进入详情页的标记
				  sessionStorage.setItem('goDetail',0);
				  refreshApp(1,'click',collectPage);
				  $('#scroll').off('tap','.collect-icon');
			  });

			  $(".showselect").on("tap",function(){
				  //mui('#pullrefresh').pullRefresh().refresh(true);
				  mui('#pullrefresh').pullRefresh().scrollTo(0,0);
				  //changeCollect=1;
				  $('.mui-content').css({'top':'96px'});
				  $(".fhead").hide();
				  $(".txtselect").show();
				  //$(".msearch").css("color","#C4271E");
				  $('[name=search]').val('');
				  $('.col1').val(0);
				  collectPage='';
				  ispullupRefresh=0;//清空下拉刷新标记
				  //设置当前页面的值：搜索页
				  nowWebpage='selectMob';
				  sessionStorage.setItem("pageNum",'select');
				  //如果是切换界面，则keepId=0
				  if(sessionStorage.getItem('goDetail')!='1'){
					  keepId=0;
					  sessionStorage.setItem("keepIdMob",keepId);
					  //zTreeOnAsyncSuccess();
				  }
				  //清空本已进入详情页的标记
				  sessionStorage.setItem('goDetail',0);

				  refreshApp(1,'click',collectPage);
				  $('#scroll').off('tap','.collect-icon');
			  });

			  //收藏页面
			  $(".showcollect").on('tap',function(){
				  mui('#pullrefresh').pullRefresh().scrollTo(0,0);
				  $('.mui-content').css({'top':'37px'});
				  $(".txtselect").hide();
				  $(".fhead").show();
				  $('[name=search]').val('');
				  searchStr1 ='';
				  searchStr2 ='';
				  collectPage=1;
				  ispullupRefresh=0;//清空下拉刷新标记
				  //设置当前页面的值：收藏页
				  nowWebpage='selectMob';
				  sessionStorage.setItem("pageNum",'collect');

				  //如果是切换界面，则keepId=0
				  if(sessionStorage.getItem('goDetail')!='1'){
					  keepId=0;
					  sessionStorage.setItem("keepIdMob",keepId);
					 // zTreeOnAsyncSuccess();
				  }
				  //清空本已进入详情页的标记
				  sessionStorage.setItem('goDetail',0);

				  $('[name=question]').val(searchStr1);
				  $('[name=answer]').val(searchStr2);
				  $('[name=type]').val(type);
				  $('[name=orderType]').val(orderType);
				  $('[name=queryType]').val(queryType);
				//   $('[name=webId]').val(webId);
				  $('[name=pageSize]').val(pageSize);
				  $('[name=pageNo]').val(pageNo);
				  $('[name=groupId]').val(groupId);
				  $('[name=collect]').val(1);
				  $('[name=showFlow]').val(showFlow);
				  $('[name=originUrl]').val(window.location.href);
				  if(isLogin){
					refreshApp(1,'click',collectPage);
				  }else{
					  $('#showcollect').submit();
				  }

				  doCollectMob();
			  });

			  //回车触发点击搜索
			  $('[name=search]').on('keyup',function(e){
				  $(this).off('keyup');
				  e.preventDefault();
				  if(e.keyCode == 13){
					  $(".query").trigger('tap');
				  }
			  });
			  //点击搜索按钮搜索
			  $(document).on('tap','.query',function(){
				  if($(".col1").val()=='问题'){
					  if($('[name=search]').val() == undefined||$('[name=search]').val() == null){
						  searchStr1 = '';
					  }else{
						  searchStr1 =$('[name=search]').val();
					  }
					  searchStr2 = '';
					  type = 1;//问题
					  queryType = 1;
				  }else if($(".col1").val()=='答案'){
					  if($('[name=search]').val() == undefined||$('[name=search]').val() == null){
						  searchStr2 = '';
					  }else{
						  searchStr2 =$('[name=search]').val();
					  }
					  searchStr1 = '';
					  type = 1;//答案
					  queryType = 2;
				  }

				  //存储搜索的内容
				  sessionStorage.setItem('keywordMob',$('[name=search]').val());
				  sessionStorage.setItem('queryTypeMob',queryType);
				  refreshApp(1,'click',collectPage);
			  });
			  var transform;
			  window.onscroll = function(){
				transform = document.getElementsByClassName('mui-scroll')[1].style.transform;
				// if(transform){
				// 	localStorage.setItem('scrollY',transform.split(', ')[1]);
				// }
			  }
			  //点击进入问题详情界面
			  $("#scroll").on("tap","li",function(){
				  var aEl = $(this).find('a')
				  var id = $(this).attr("sId");
				  var iscollected=$(this).find('.collect-icon').attr('data-collect');
				  sessionStorage.setItem('iscollected',iscollected);
				  var solutionType = $(this).attr('SolutionType');
				  $.ajax({
					  type:"post",
					  url:"/QuestionHk/doAddHits",
					  data:{
						  	'id':id,
					  },
					  async:true,
					  cache:true,
					  success:function(data){
						  setTimeout(function(){
							  localStorage.setItem('dataSrc',$('.cell').html());
							  if(transform){
								localStorage.setItem('scrollY',transform.split(', ')[1]);
							}
							  	if(isLogin){
								  	//保存页面的页数
								  	window.location.href = 'question.html?id='+id+'&solutionType='+solutionType+'&currentPage='+$('#currentPage').val()+'&iticket=1'+'&userName='+userName;
								}else{
								  	//保存页面的页数
								  	window.location.href = 'question.html?id='+id+'&solutionType='+solutionType+'&currentPage='+$('#currentPage').val();
								}
						  },200)
					  }
				  });
			  });
			  var classsetting = {
				  view: {
					  dblClickExpand: true,
					  showIcon: false
				  },
				  data: {
					  simpleData: {
						  enable: true,
						  idKey: "Id",
						  pIdKey: "ParentId",
						  rootPId: 0
					  },
					  key: {
						  name: "Name"
					  }
				  },
				  async: {
					  enable: true,
					  url: "/QuestionHk/doFindGroupList",
					  autoParam: ["id"],
					  dataFilter: ajaxDataFilter
				  },
				  callback: {
					  onClick: ZTreeClassClick1,
					  beforeClick: zTreeBeforeClick1,
					  onAsyncSuccess: zTreeOnAsyncSuccess1
				  }
			  };

			  //格式化一步获取的json数据
			  function ajaxDataFilter(treeId, parentNode, responseData) {
				  var list = [];
				  if (responseData) {
					responseData.list.push({
						Id: 0,
						ParentId: 0,
						Name: "全部分类",
						open: true
					});
					for(var i = 0;i < responseData.list.length;i++){
						if(responseData.list[i].ParentId == '2089'||responseData.list[i].ParentId == '1558'||responseData.list[i].Id == 2089||responseData.list[i].Id == '1558'){
							//list.push();
						}else{
							list.push(responseData.list[i]);
						}
					}
					responseData.list = list;
					  return responseData.list;
				  }
				  return responseData;
			  }
			  //切换树节点点击事件
			  function ZTreeClassClick1(treeId, treeNode) {
				  var zTree = $.fn.zTree.getZTreeObj('treeClasses');
				  Nodes = zTree.getSelectedNodes();
				  $('#groupTree [name=groupName]').val(Nodes[0].Name);
				  $('#groupTree [name=groupId]').val(Nodes[0].Id);
				  keepId = $('#groupTree [name=groupId]').val();
				  mui('#pullrefresh').pullRefresh().refresh(true);
				  mui('#pullrefresh').pullRefresh().scrollTo(0,0);
				  ispullupRefresh=0;
				  //refresh(1);
				  //存储树节点便于返回
				  sessionStorage.setItem("keepIdMob",keepId);
				  refreshApp(1,'click',collectPage);
			  }
			  function zTreeBeforeClick1(treeId, treeNode, clickFlag) {
				  //return ! treeNode.isParent; //当是父节点 返回false不让选取
			  }
			  function zTreeOnAsyncSuccess1(event, treeId, treeNode, msg) {
				  var treeObj = $.fn.zTree.getZTreeObj('treeClasses');
				  //返回后停在原先的树节点
				  var node= treeObj.getNodeByParam("Id",keepId, null);
				  if(node){
					  treeObj.selectNode(node);
				  }

			  }
			  $.fn.zTree.init($('#treeClasses'), classsetting, []);
		  }

	   //}
});


