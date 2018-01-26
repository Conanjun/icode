(function($){	
	var setting={
		check: {
	    	enable: false
	    },
	    data: {
	        simpleData: {
	            enable: true
	        }
	    },
	    callback: {
			onClick: zTreeOnClick
		}
	};
	
		
	var zList=[];
	
//	var promise =$.ajax({
//		url:"QuestionHk/doFindGroupList",
//		data:{webId:73,mode:0},
//		type:"get",
//		async:false,
//		error:function(){
//			alert("tree error");
//		}
//		
//		
//	});
//	promise.done(function(data){
//		
//		$.each(data.list, function(i,item) {
//			zList.push({
//				id:item.Id,
//				pId:item.ParentId,
//				name:item.Name,
//				groupId:item.groupId,
//				open:false
//			});
//			
//		});
//	});
	
	var attrId = {};
	
//	模拟数据
	var retree = function(){
		$.each(datastree.list, function(i,item) {
			zList.push({
				id:item.Id,
				pId:item.ParentId,
				name:item.Name,
				open:false
			});
			attrId.a = item.Id;
		});
		
	};
	
	function showIconForTree(treeId, treeNode) {
		return !treeNode.isParent;
	};
	
	$(document).ready(function(){
		$.fn.zTree.init($("#treeDemo"), setting, zList);
	});
		
	//retree();	
	
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
			url: "/QuestionHk/doFindGroupList?webId=83",
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
			if (responseData.status == -1) {
				yunNoty(responseData);
			}
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
		var zTree = $.fn.zTree.getZTreeObj('treeQueClass');
		Nodes = zTree.getSelectedNodes();
		$('#QuestionClassModel [name=groupName]').val(Nodes[0].Name);
		$('#QuestionClassModel [name=groupId]').val(Nodes[0].Id);
	}
	function zTreeBeforeClick(treeId, treeNode, clickFlag) {
		return ! treeNode.isParent; //当是父节点 返回false不让选取
	}
	function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
		var treeObj = $.fn.zTree.getZTreeObj("treeClasses");
		//treeObj.expandAll(true);
	}
	$.fn.zTree.init($("#treeeClasses"), classsetting, []);
	
	
	
	var refresh = function(){
		$.ajax({
			url:'QuestionHk/doFindQueList',
			type:'post',
			data:{
				type:1,
				orderType:4,//2：默认浏览次数倒序
				webId:73,
				pageSize:5,
				pageNo:1,
			},
			dataType:'json',
			cache:false,
			success:function(data){
				if(data.status != 0){
	//					mui.toast(data.message);
					return;
				}else{
						
	//					mui.toast(data.message);
	//					var table = document.body.querySelector('.mui-table-view');
					var table = document.body.querySelector('.cell');
					if(data.list.List != null && data.list.List.length > 0){
						for(var i = 0;i<data.list.List.length;i++){
							var li = document.createElement('li');
							li.className = 'mui-table-view-cell question';
							li.innerHTML = '<div class="border-bottom">'+
										   '<h4 class="txt">'+data.list.List[i].AddUserId+'. '+data.list.List[i].Question+'</h4>'+
						            	   '<span class="ispan">创建：'+data.list.List[i].AddUserName+i+'</span><span class="ispan ml">分类：'+data.list.List[i].GroupName+'</span>'+
						            	   '<span class="img"><img src="images/bad.png" class="img2"><i>'+(data.list.List[i].Hits)+'</i></span>'+
										   '<span class="img"><img src="images/good.png" class="img1"><i>'+(data.list.List[i].Usefull)+'</i></span>'+
										   '<span class="img"><img src="images/eye.png" class="img3"><i>'+(data.list.List[i].Useless)+'</i></span>'+
										   '</div>';
							table.appendChild(li);	
						}
					}
					
				}
			}
		});
	};
	function zTreeOnClick(clickFlag) {
		$('li.question').remove();
//		console.log(attrId.a);	
	    refresh();
	};

})(jQuery);