$(function(){
		var type = 1,
		    orderType = 14,//14：浏览次数倒序
		    queryType = 1,
		    webId = 34,
		    pageSize = 10,
		    pageNo = 1,
			groupId = 0,
			keepId = 0,
			isSwitch = false,   //是否切换树节点
			searchStr1 = 'question=',
			searchStr2 = 'answer=';
		browserRedirect();
		/**
		* 获取客户端信息
		*/
		function browserRedirect() {
	      var sUserAgent = navigator.userAgent.toLowerCase();
	      var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
	      var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
	      var bIsMidp = sUserAgent.match(/midp/i) == "midp";
	      var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	      var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
	      var bIsAndroid = sUserAgent.match(/android/i) == "android";
	      var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
	      var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
	      if (!(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM)) {
	      	var oHtml = '<input type="text" class="isearch" style="width:10% !important;margin-right:15%;">'+
		   					'<div class="select1" style="background:none;position:absolute;width:18%;right:3%;top:-2px;">'+
								'<select class="col1" style="width:50%;opacity:1;height:30px;line-height:30px;">'+
									'<option>问题</option>'+
									'<option>答案</option>'+
								'</select>'+
								'<span class="mui-icon down" style="right:30px;top:9px;height:29px;line-height:30px;">'+
									'<svg class="icon xjiantou" >'+
										'<use xlink:href="#icon-jiantou-copy"></use>'+
									'</svg>'+
								'</span>'+
								'<span class="mui-icon mui-icon-search hsearch" style="right:0;float:inherit;cursor:pointer;"></span>'+
							'</div>';
		   			
	   		$('.mui-bar-nav').append(oHtml);
	   		$('.mui-table-view').css('padding','0 5%');
	   		$('.mui-bar-tab').css('display','none');
	   		$('.fhead a span').css('width','30%');
	   		$('#pullrefresh').css('overflow-y','auto');
	   		$('.mui-bar-nav~.mui-content').css('padding-top','81px');
	   		$('.fhead .imga').css('right','-0.4rem');
			$('.fhead .imgb').css('right','0.3rem');
			$('.fhead .imgc').css('right','1.6rem');
	   		$("#pageList").css({
	   			'float': 'right',
				'margin-top': '60px',
				'margin-right':'14%'
	   		});
	   		$(".isearch").on('keyup',function(e){
	   			e.preventDefault();
	   			if(e.keyCode == 13){
	   				$(".hsearch").trigger('click');
	   			}
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
					'min-width':'1200px'
				});
				$('.fhead').css('min-width','1400px');
				$('.col-md-12').addClass('col-xs-12');
				$('.col-md-2').addClass('col-xs-3');
				$('.col-md-9').addClass('col-xs-9');
			});
	   		function refresh(pageNo){
				$.ajax({
					url:'/QuestionHk/doFindQueList?'+searchStr1+'&'+searchStr2,
					type:'post',
					data:{
						type:type,
						orderType:orderType,
						webId:webId,
						pageSize:pageSize,
						pageNo:pageNo,
						queryType:queryType,//默认1：问题
						groupId:groupId
					},
					dataType:'json',
					cache:true,
					async:true,
					success:function(data){
						if(data.status == 0){
							if(data.list){
								if(data.list.Items != null && data.list.Items.length > 0){
									var html = '';
									for(var i = 0;i<data.list.Items.length;i++){
										html+='<li class="mui-table-view-cell question" sId="'+data.list.Items[i].Id+'" SolutionType = "'+data.list.Items[i].SolutionType+'">'+
													'<div class="border-bottom">'+
													   '<h4 class="txt" questionId="'+data.list.Items[i].Id+'">'+(i+1)+'. '+data.list.Items[i].Question+'</h4>'+
									            	   '<span class="ispan">创建：'+data.list.Items[i].UserName+'</span><span class="ispan ml">分类：'+data.list.Items[i].GroupName+'</span>'+
									            	   '<div style="height:20px;">'+
													   '<span class="img"><img src="images/good.png" class="img1 good"  zId="'+data.list.Items[i].Id+'" dataGood="'+data.list.Items[i].Usefull+'">&nbsp;<i>'+(data.list.Items[i].Usefull ? data.list.Items[i].Usefull : 0)+'</i></span>'+
													   '<span class="img"><img src="images/bad.png" class="img2 bad"  cId="'+data.list.Items[i].Id+'" >&nbsp;<i>'+(data.list.Items[i].Useless ? data.list.Items[i].Useless : 0)+'</i></span>'+
													   '<span class="img"><img src="images/eye.png" class="img3 eye"  eId="'+data.list.Items[i].Id+'" >&nbsp;<i>'+(data.list.Items[i].Hits ? data.list.Items[i].Hits : 0)+'</i></span>'+
													   '</div>'+
													'</div>'
												'</li>';
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
						                refresh(pageNo);
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
	   		console.log(sessionStorage.getItem('currentPage'));
	   		if((sessionStorage.getItem('currentPage') == 'undefined')||(sessionStorage.getItem('currentPage') == '')||(sessionStorage.getItem('currentPage') == null)){
	   			refresh(1);
	   		}else{
	   			refresh(sessionStorage.getItem('currentPage'));
	   		}
	   		
			//点击搜索按钮搜索
	   		$(document).on('click','.hsearch',function(){
	   			if($(".col1").val()=='问题'){
	   				if($('.isearch').val()==undefined||$('.isearch').val()==null){
	   					searchStr1 = 'question='+'';
	   				}else{
	   					searchStr1 = 'question='+$('.isearch').val();
	   				}
					searchStr2 = 'answer='+'';
					type = 1;
					queryType = 1;//问题
				}else if($(".col1").val()=='答案'){
					if($('.isearch').val()==undefined||$('.isearch').val()==null){
						searchStr2 = 'answer='+'';
					}else{
						searchStr2 = 'answer='+$('.isearch').val();
					}
					searchStr1 = 'question='+'';
					type = 1;
					queryType = 2;//答案
				}
				refresh(1);
			});
			//全部
			$("#all").on('tap',function(){
				orderType=14;//浏览次数倒序
				groupId = 0;
				$('li.question').remove();//删除默认出现的数据
				$(".imga").attr("src","images/down.png");
				$(".imgb").attr("src","images/down.png");
				$(".imgc").attr("src","images/down.png");
				refresh(1);
			})
			
			//浏览次数排序
			var off = true;
			$("#browsetm").on("tap",function(){
				if(off){
					orderType=13;//浏览次数正序
					$('li.question').remove();//删除默认出现的数据
					$(".imga").attr("src","images/up.png");
					refresh(1);
					off = false;
				}else{
					orderType=14;//浏览次数倒序
					$('li.question').remove();//删除默认出现的数据
					$(".imga").attr("src","images/down.png");
					refresh(1);
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
					refresh(1);
					on = false;
				}else{
					orderType=16;//2：满意度倒序
					$('li.question').remove();//删除默认出现的数据
					$(".imgb").attr("src","images/down.png");
					refresh(1);
					on = true;
				}
			});
			
			//不满意度排序
			var onoff = true;
			$("#cai").on("tap",function(){
				if(onoff){
					orderType=18;//不满意度正序
					$('li.question').remove();//删除默认出现的数据
					$(".imgc").attr("src","images/up.png");
					refresh(1);
					onoff = false;
				}else{
					orderType=17;//不满意度倒序
					$('li.question').remove();//删除默认出现的数据
					$(".imgc").attr("src","images/down.png");
					refresh(1);
					onoff = true;
				}
			});
			//点击进入问题详情界面
			$("#scroll").on("click","li",function(){
				var id = $(this).attr("sId");
				var solutionType = $(this).attr('SolutionType');
				$.ajax({
					type:"post",
					url:"/QuestionHk/doAddHits",
					data:{
						'id':id,
						'webId':webId
					},
					async:true,
					cache:true,
					success:function(data){
						setTimeout(function(){
							window.location.href = 'question.html?id='+id+'&solutionType='+solutionType+'&currentPage='+$('#currentPage').val();
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
					url: "/QuestionHk/doFindGroupList?webId="+webId,
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
				if (responseData) {
					responseData.list.push({
						Id: 0,
						ParentId: 0,
						Name: "全部分类",
						open: true
					});
					return responseData.list;
				}
				return responseData;
			}
			function ZTreeClassClick(treeId, treeNode) {
				var zTree = $.fn.zTree.getZTreeObj('treeLeftClasses');
				Nodes = zTree.getSelectedNodes();
				$('.tree [name=groupId]').val(Nodes[0].Id);
				$('.tree [name=groupName]').val(Nodes[0].Name);
				groupId = $('.tree [name=groupId]').val();
				refresh(1);
			}
			function zTreeBeforeClick(treeId, treeNode, clickFlag) {
				//return ! treeNode.isParent; //当是父节点 返回false不让选取
			}
			function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
				var treeObj = $.fn.zTree.getZTreeObj('treeLeftClasses');
			}
			function filterP(node) {
				return (node.isParent == false);
			}
			$.fn.zTree.init($('#treeLeftClasses'), classsetting, []);
	      } else {
	      	$("h1.mui-title").before('<a class="glyphicon glyphicon-indent-left leftSwitch" style="color:#fff;font-size:18px;line-height:34px;"></a>');
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
			$('.fhead .imga').css('right','-1.3rem');
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
						contentrefresh: '正在加载...',
						callback: pullupRefresh
					}
				}
			});
		        
			/**
			 * 上拉加载具体业务实现
			 */
			function pullupRefresh() {
				var pagecount=$("#pageCount").val();  
	            	pageNo = $("#currentPage").val();  
	            	pageNo ++;
				setTimeout(function() {
					if(pageNo <= pagecount){
						refresh(pageNo);
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(false); //参数为true代表没有更多数据了。
					}else{
						mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
					}
					/*setTimeout(function(){
					    mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
					}, 2000);*/ // 显示“没有更多了”2s后执行：关闭向下加载更多功能（直接隐藏了“没有更多”）
				}, 1500);
			}
			refresh(1);
			
			/**
			 * 下拉刷新具体业务实现
			 */
		
			/*function pulldownRefresh() {
				pageNo = $("#currentPage").val();  
	            pageNo--;
	            if(pageNo < 1){
	            	pageNo = 1;
	            }
				setTimeout(function() {
					refresh();
					mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
				}, 1500);
			}
	        if (mui.os.plus) {
	            mui.plusReady(function() {
	                setTimeout(function() {
	                    mui('#pullrefresh').pullRefresh().pulldownLoading(); 
	                }, 500);
	            });
	        } else {
	            mui.ready(function() {
	                mui('#pullrefresh').pullRefresh().pulldownLoading();
	            });
	        }*/
			function refresh(pageNo,searchType){
				if(keepId != groupId){
					isSwitch = true;
				}else{
					isSwitch = false;
				}
				groupId = keepId;
				$.ajax({
					url:'/QuestionHk/doFindQueList?'+searchStr1+'&'+searchStr2,
					type:'post',
					data:{
						type:type,
						orderType:orderType,
						queryType:queryType,
						webId:webId,
						pageSize:pageSize,
						pageNo:pageNo,
						groupId:groupId
					},
					dataType:'json',
					cache:true,
					async:true,
					success:function(data){
						if(data.status == 0){
							if(data.list.Items != null && data.list.Items.length > 0){
								var html = '';
								for(var i = 0;i<data.list.Items.length;i++){
									html+='<li class="mui-table-view-cell question" sId="'+data.list.Items[i].Id+'" SolutionType = "'+data.list.Items[i].SolutionType+'">'+
												'<div class="border-bottom">'+
												   '<h4 class="txt" questionId="'+data.list.Items[i].Id+'">'+((data.list.PageSize)*(data.list.CurrentIndex-1)+(i+1))+'. '+data.list.Items[i].Question+'</h4>'+
								            	   '<span class="ispan">创建：'+data.list.Items[i].UserName+'</span><span class="ispan ml">分类：'+data.list.Items[i].GroupName+'</span>'+
								            	   '<div style="height:20px;">'+
												   '<span class="img"><img src="images/good.png" class="img1 good"  zId="'+data.list.Items[i].Id+'" dataGood="'+data.list.Items[i].Usefull+'">&nbsp;<i>'+(data.list.Items[i].Usefull ? data.list.Items[i].Usefull : 0)+'</i></span>'+
												   '<span class="img"><img src="images/bad.png" class="img2 bad"  cId="'+data.list.Items[i].Id+'" >&nbsp;<i>'+(data.list.Items[i].Useless ? data.list.Items[i].Useless : 0)+'</i></span>'+
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
								
							}else{
								$('.cell').html('<div class="showPage" style="text-align:center;font-size: 1.1rem;margin-top: 20px;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空</div>');
								//mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
							}
						}
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
				refresh(1);
			})
			
			//浏览次数排序
			var off = true;
			$("#browsetm").on("tap",function(){
				if(off){
					orderType=13;//浏览次数正序
					$('li.question').remove();//删除默认出现的数据
					$(".imga").attr("src","images/up.png");
					refresh(1);
					off = false;
				}else{
					orderType=14;//浏览次数倒序
					$('li.question').remove();//删除默认出现的数据
					$(".imga").attr("src","images/down.png");
					refresh(1);
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
					refresh(1);
					on = false;
				}else{
					orderType=16;//2：满意度倒序
					$('li.question').remove();//删除默认出现的数据
					$(".imgb").attr("src","images/down.png");
					refresh(1);
					on = true;
				}
			});
			
			//不满意度排序
			var onoff = true;
			$("#cai").on("tap",function(){
				if(onoff){
					orderType=18;//不满意度正序
					$('li.question').remove();//删除默认出现的数据
					$(".imgc").attr("src","images/up.png");
					refresh(1);
					onoff = false;
				}else{
					orderType=17;//不满意度倒序
					$('li.question').remove();//删除默认出现的数据
					$(".imgc").attr("src","images/down.png");
					refresh(1);
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
			//主页面和搜索页面的跳转
			$(".showfhead").on("tap",function(){
				$('.mui-content').css({'top':'37px'});
				$(".txtselect").hide();
				$(".fhead").show();
				$(".msearch").css("color","#929292");
				$('[name=search]').val('');
				searchStr1 = 'question='+' ';
				refresh(1,'click');
			});
			
			$(".showselect").on("tap",function(){
				mui('#pullrefresh').pullRefresh().refresh(true);
				$('.mui-content').css({'top':'96px'});
				$(".fhead").hide();
				$(".txtselect").show();
				$(".msearch").css("color","#C4271E");
				$('[name=search]').val('');
				$('.col1').val(0);
			});
			//回车触发点击搜索
			$('[name=search]').on('keyup',function(e){
	   			e.preventDefault();
	   			if(e.keyCode == 13){
	   				$(".query").trigger('tap');
	   			}
	   		});
			//点击搜索按钮搜索
	   		$(document).on('tap','.query',function(){
	   			if($(".col1").val()=='问题'){
	   				if($('[name=search]').val() == undefined||$('[name=search]').val() == null){
	   					searchStr1 = 'question='+'';
	   				}else{
	   					searchStr1 = 'question='+$('[name=search]').val();
	   				}
					searchStr2 = 'answer='+'';
					type = 1;//问题
					queryType = 1;
				}else if($(".col1").val()=='答案'){
					if($('[name=search]').val() == undefined||$('[name=search]').val() == null){
						searchStr2 = 'answer='+'';
					}else{
						searchStr2 = 'answer='+$('[name=search]').val();
					}
					searchStr1 = 'question='+'';
					type = 1;//答案
					queryType = 2;
				}
				refresh(1,'click');
			});
			
			//点击进入问题详情界面
			$("#scroll").on("tap","li",function(){
				var id = $(this).attr("sId");
				var solutionType = $(this).attr('SolutionType');
				$.ajax({
					type:"post",
					url:"/QuestionHk/doAddHits",
					data:{
						'id':id,
						'webId':webId
					},
					async:true,
					cache:true,
					success:function(data){
						setTimeout(function(){
							window.location.href = 'question.html?id='+id+'&solutionType='+solutionType;
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
					url: "/QuestionHk/doFindGroupList?webId="+webId,
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
				if (responseData) {
					responseData.list.push({
						Id: 0,
						ParentId: 0,
						Name: "全部分类",
						open: true
					});
					return responseData.list;
				}
				return responseData;
			}
			//切换树节点点击事件
			function ZTreeClassClick(treeId, treeNode) {
				var zTree = $.fn.zTree.getZTreeObj('treeClasses');
				Nodes = zTree.getSelectedNodes();
				$('#groupTree [name=groupName]').val(Nodes[0].Name);
				$('#groupTree [name=groupId]').val(Nodes[0].Id);
				keepId = $('#groupTree [name=groupId]').val();
				mui('#pullrefresh').pullRefresh().scrollTo(0,0);
				refresh(1);
				mui('#pullrefresh').pullRefresh().refresh(true);
			}
			function zTreeBeforeClick(treeId, treeNode, clickFlag) {
				//return ! treeNode.isParent; //当是父节点 返回false不让选取
			}
			function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
				var treeObj = $.fn.zTree.getZTreeObj('treeClasses');
			}
			$.fn.zTree.init($('#treeClasses'), classsetting, []);
	      }
	   }
	
});
