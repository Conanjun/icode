// JavaScript Document
var isEdit2 = false;//是否是编辑
var $tr = null;
var $tr2 = null;//是否是编辑
var pageNo = 1;//当前页
// 收起
$('.closeIt').on('click', function() {
    $('.toShow').css('height', 26);
    $('.toHide').removeClass('col-md-10').addClass('col-md-12').css('padding-left', '0');
});
// 展开
$('.openIt').on('click', function() {
    $('.toShow').css('height', 'auto');
    $('.toHide').removeClass('col-md-12').addClass('col-md-10').css('padding-left', '15px');
});
//ajax请求经过的request
var tmpParam='';
function ajaxRequest(url,params,sfun,ffun){
	if(!url) return;
	if(!params) params='';
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,
		url:encodeURI(url),
		data:params,
		success:
		function(data){
	      if(data.status==0){
	      	if(typeof sfun=='function'){
				sfun(data);
			}
	      }else{
			 if(typeof ffun=='function'){
				ffun(data);
			 }
	      	 yunNoty(data);
	      }
	   }
	})
}
//句式组列表
function phraseListTab(pageNo,orderType){
	if(!pageNo)pageNo=1;
	if(!orderType){
		orderType=$('.search_form2').val();
	}else{
		$('.search_form2').val(orderType);
	}

	tmpParam=$('.search_form2').serialize()+'pageSize='+10+'&pageNo='+pageNo+'&orderType='+orderType+'&groupId='+(parseInt($('.search_form').val()) || '')+'&name='+encodeURI($('.searchBy').val())+'&level=1';
	ajaxRequest('../../KnSentenceGroup/getKnSentenceGroupList',tmpParam,function(data){
		dataList(data);
	});
}
function dataList(data){
	if(data.list.Items && data.list.Items.length>0){
		var html = [];
		var tmpList=data.list.Items;
		for(var i=0;i<tmpList.length;i++){
			html += '<tr id="'+tmpList[i].Id+'" ClassId="'+tmpList[i].ClassId+'" SgName="'+tmpList[i].SgName+'" GroupName="'+tmpList[i].ClassName+'">'+
						'<td>'+tmpList[i].SgName+'</td>'+
						'<td style="color:#337ab7;" class="KnCount"><span style="cursor:pointer;display:inline-block;width:15px;height:15px;">'+(tmpList[i].KnCount==null?'0':tmpList[i].KnCount)+'</span></td>'+
						'<td>'+tmpList[i].ClassName+'</td>'+
						'<td>'+tmpList[i].AddUserName+'</td>'+
						'<td>'+tmpList[i].DateTime+'</td>'+
						'<td><a class="commonSentenc"><span class="timeTip glyphicon glyphicon-plus" title="" data-original-title="新增句型"></span></a><a class="editSentenc"><span class="timeTip glyphicon glyphicon-pencil" title="" data-original-title="修改"></span></a><a class="del"><span class="timeTip glyphicon glyphicon-trash" title="" data-original-title="删除"></span></a></td>'+
					'</tr>';
		}
        $('#phraseDiv').find('tbody').html(html);
		$('.intro span,.intro a').css('margin','0 4px');
		//下面开始处理分页
		var options = {
			data:[data.list,'Items','TotalCount'],
			currentPage: data.list.CurrentIndex,
			totalPages: data.list.PageCount,
			alignment:'right',
			onPageClicked: function (event, originalEvent, type, page) {
				pageNo = page;
				phraseListTab(page,$('.search_form2').val());
			}
		};
		setPage('pageList',options);
        $('.timeTip').tooltip();
	}else{
			$('#phraseDiv').find('tbody').html('<tr style=\"text-align:center;\"><td colspan="6"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前记录为空！</td></tr>');
			$('#pageList').html('');
	}
}
var isEdit = false;
//添加句式组问题
$('.add').on('click', function(){
	isEdit = false;
	$('#addSentenceModal').modal('show');
	$('#addSentenceModal .modal-title').text('添加句式组');
	$('#addSentenceForm [name=sgName]').val('');
	$('#addSentenceForm [name=id]').val('');
	$('#addSentenceForm [name=classId]').val('');
	$('#phraseTree').text('全部分类');
})
//修改句式组问题
$('#phraseDiv').on('click','.editSentenc',function(){
	isEdit = true;
	$('#addSentenceModal').modal('show');
	$tr = $(this).parents('tr');

	$('#addSentenceModal .modal-title').text('修改句式组');
	$('#addSentenceForm [name=sgName]').val($tr.attr('sgName'));
	switch($tr.attr('type')) {
		case '0':
			$('#addSentenceForm [name=type]').eq(0).prop({'checked': true});
			break;
		case '1':
			$('#addSentenceForm [name=type]').eq(1).prop({'checked': true});
			break;
		case '3':
			$('#addSentenceForm [name=type]').eq(2).prop({'checked': true});
			break;
	}
	$('#addSentenceForm [name=id]').val($tr.attr('id'));
	$('#addSentenceForm [name=classId]').val($tr.attr('classId'));
	$('#phraseTree').text($tr.attr('GroupName'));
})
//添加句式组
function addSentenceFun(){
	if(isEdit) {
		tmpParam=$("#addSentenceForm").serialize();
		ajaxRequest('../../KnSentenceGroup/doEditKnSentenceGroup',tmpParam,function(data){
			phraseListTab();
			$('#addSentenceModal').modal('hide');
			yunNoty(data);
		});
	}else {
		tmpParam=$("#addSentenceForm").serialize();
		ajaxRequest('../../KnSentenceGroup/doAddKnSentenceGroup',tmpParam,function(data){
			phraseListTab();
			$('#addSentenceModal').modal('hide');
			yunNoty(data);
		});
	}
}
//添加新句式组
$('#phraseDiv').on('click','.commonSentenc,.KnCount span',function(){
	
	$('#addSentenceCommonModal').modal('show');
	var $this=$(this);
	$('.phGroupName').text($(this).parents('tr').find('td:eq(0)').text());
	$('#addSentenceCommonModal input[name=solutionId]').val($this.parent().find('span').html());
	$('#addSentenceCommonModal input[name=level]').val($this.attr('len'));
	//待完善
	$('#addSentenceCommonModal input[name=classId]').val();
	$('#addSentenceCommonModal input[name=type]').val();
	$('#addSentenceCommonModal input[name=siName]').val('');
})
//添加时选择的树
var hideSetting = {
	view: {
		dblClickExpand: false,
		showIcon: false
	},
	data: {
		simpleData : {
		enable : true,
		idKey : "Id",
		pIdKey : "ParentId",
		rootPId : 0
		},
		key : {
			name : "Name"
		}
	},
	async : {
		enable : true,
		url : "../../classes/listClasses?m=11",
		autoParam : ["id"],
		dataFilter : ajaxDataFilter1
	},
	callback: {
		beforeClick: zTreeBeforeClickHide1,
		onClick:function (event, treeId, treeNode, clickFlag){
			if(treeNode){
				//点击的时候获取当前树的节点信息
				$('#addSentenceForm #phraseTree').html(treeNode.Name);
				$('#addSentenceForm input[name=classId]').val(treeNode.Id);
				$("#menuContent").fadeOut("fast");
			}
		},
		onExpand: zTreeOnExpand1
	}
};
function zTreeBeforeClickHide1(treeId, treeNode, clickFlag){
    return !treeNode.isParent;//当是父节点 返回false 不让选取
}
//渲染树结构
function ajaxDataFilter1(treeId, parentNode, responseData) {
	if (responseData) {
		responseData.list.push({ Id:-1, ParentId:0, Name:"全部分类", open:true});
		return responseData.list;
	}
	return responseData;
};
function zTreeOnExpand1(event, treeId, treeNode) {
	//展开的时候滚动条怎么调用？？？？？？？？？
};
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function showMenu() {
	var cityObj = $("#queSel");
	var cityOffset = $("#queSel").offset();
	$("#menuContent").slideDown("fast");
	$("body").bind("mousedown", onBodyDown);
}
//添加模态框出现加载分类树
$('#addSentenceModal').on('show.bs.modal', function(){
	$.fn.zTree.init($("#classTree_phrase"), hideSetting, []);
});


IDMark_A = "_a";
//提示还可以输入多少字
$('#insertName').addWordCount(30);
$('#insertNameEdit').addWordCount(30);
var setting = {
	edit: {
		enable: true,
		showRemoveBtn: false,
		showRenameBtn: setRenameBtn,
		renameTitle: '重命名'
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
	view: {
		selectedMulti: false,
		showIcon: false,
		addHoverDom: addHoverDom,
		removeHoverDom: removeHoverDom
	},
	async: {
		enable: true,
		/*
			黄世鹏
			修改：接口重构，pageListClasses改为listClasses，参数mode改为m
		 */
		url: "../../classes/listClasses?m=11&pageSize=1000",
		autoParam: ["id"],
		dataFilter: ajaxDataFilter
	},
	callback: {
		beforeDrop: zTreeOnDropList,
		onDrag: zTreeOnDrag,
		onClick: function(e, treeId, treeNode) {
			var ZTree = $.fn.zTree.getZTreeObj("treeClasses"),
			Nodes = ZTree.getSelectedNodes();
			//有问题？？？
			if (Nodes.length == 0) {
				yunNotyError("请先选择一个节点");
			}
			$('.classifyName').val(Nodes[0].Name);
			$('#groupId').val(Nodes[0].Id);
			$('#hideClassifyId').val(Nodes[0].Id);
			if (treeNode) {
				$('.branchSearch input[name=groupId]').val(treeNode.Id);
				$('.search_form').val(treeNode.Id);
				phraseListTab(1, $('.search_form2').val());
			}
		},
		beforeClick: zTreeBeforeClick,
		beforeRemove: beforeRemove,
		beforeEditName: beforeRename
	}
};

function zTreeOnDrag(event, treeId, treeNodes) {
	$('#addClassForm input[class=dropClass]').val(treeNodes[0].Id);
	$('#addClassForm input[class=dropClassName]').val(treeNodes[0].Name);
};
function zTreeOnDrop(treeId, treeNodes, targetNode, moveType) {
	var classId=$('#addClassForm input[class=dropClass]').val();
	var className=$('#addClassForm input[class=dropClassName]').val();
	var flag  = false;
	$.ajax({
		type:'post',
		async: false,
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../classes/doEditClass'),
		data:'&id='+classId+'&className='+encodeURI(className)+'&pId='+targetNode.Id,
		success:
		function(data){
			if(data.status==0){
				flag= true;
				yunNoty(data);
			 }else{
				yunNoty(data);
			}
		}
	});
	return flag;
};

Array.prototype.max = function(){
	return Math.max.apply({},this)
}
function check(array) {
	if(array && array.length > 0) {
		var temp = [];
		for(var i in array) {
			temp.push(check(array[i].children));
		}
		return temp.max() + 1;
	} else {
		return 1;
	}
}
function zTreeOnDropList(treeId, treeNodes, targetNode, moveType) {
	var classId=$('#addClassForm input[class=dropClass]').val();
	var className=$('#addClassForm input[class=dropClassName]').val();
	if(targetNode.Id == 0) {
		return false;
	}
	var type='';
	if(moveType=='inner') {
		type='2';
	} else if(moveType=='prev') {
		type='0';
	} else if(moveType=='next') {
		type='1';
	}
	if (targetNode.level+check(treeNodes[0].children) > 5) {
		yunNotyError("分类的层级最高为5级！");
		return false;
	}
	var flag  = false;
	$.ajax({
		type:'post',
		async: false,
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../classes/doEditClass'),
		data:'&id='+classId+'&className='+encodeURI(className)+'&pId='+targetNode.Id+'&type='+type,
		success:
		function(data){
			if(data.status==0){
				flag= true;
				yunNoty(data);
			 }else{
				yunNoty(data);
			}
		}
	});
	return flag;
};
//自定义树的操作按钮1
function addHoverDom(treeId, treeNode) {
	var Obj = $("#" + treeNode.tId + "_a");
	if ($("#addBtn_" + treeNode.Id).length > 0) return;
	if (treeNode.level > 4) {
		//yunNotyError("分类的层级最高为5级！");
		//return false;
	} else {
		if (treeNode.tId == "treeClasses_1") {
			var addStr = "<span id='addBtn_" + treeNode.Id + "' title='新增分类' class='button addIcon'></span>";
			Obj.append(addStr);
			var btnAdd = $("#addBtn_" + treeNode.Id);
			if (btnAdd) btnAdd.bind("click",
			function() {
				$('#addClassModal').modal('show');
				$('#addClassForm [name=parentId]').val(treeNode.Id);
			});
			
		}
		var addStr = "<span id='addBtn_" + treeNode.Id + "' title='新增分类' class='button addIcon'></span>";
		Obj.find('.edit').before(addStr);
		var btnAdd = $("#addBtn_" + treeNode.Id);
		if (btnAdd) btnAdd.bind("click",
		function() {
			$('#addClassModal').modal('show');
			$('#addClassForm [name=parentId]').val(treeNode.Id);
		});
	}

	if (treeNode.isParent == false) {
		if ($("#delBtn_" + treeNode.Id).length > 0) return;
		var delStr = "<span id='delBtn_" + treeNode.Id + "' title='删除分类' class='button remove'></span>";
		Obj.find('.edit').after(delStr);
		var btnDel = $("#delBtn_" + treeNode.Id);
		if (btnDel) btnDel.bind("click",
		function() {
			$('#DelClassModal').modal('show');
			$('#DelClassModal [name=classId]').val(treeNode.tId);
		});
	}
}

//自定义树的操作按钮2
function removeHoverDom(treeId, treeNode) {
	$("#addBtn_" + treeNode.Id).unbind().remove();
	$("#addLabel_" + treeNode.Id).unbind().remove();
	if (treeNode.isParent == false) {
		$("#diyBtn_" + treeNode.Id).unbind().remove();
		$("#delBtn_" + treeNode.Id).unbind().remove();
	}
	$("#outBtn_" + treeNode.Id).unbind().remove();
	$("#outflowBtn_" + treeNode.Id).unbind().remove();
}

//如果节点下面有子节点则不显示删除按钮
function setRemoveBtn(treeId, treeNode) {
	//判断为顶级节点则不显示删除按钮
	return !treeNode.isParent;　　　
}

function setRenameBtn(treeId, treeNode) {
	if (treeNode.level == 0) {
		return false;
	}
	return true;
}

//重命名节点
function beforeRename(treeId, treeNode, newName, isCancel) {
	$('#editClassForm input[name=classhideName]').val(treeNode.Name);
	$('#editClassForm input[name=className]').val(treeNode.Name);
	$('#editClassForm input[name=id]').val(treeNode.Id);
	$('#editClassModal').modal('show');
	return false;
}

//删除节点
function beforeRemove(treeId, treeNode) {
	var flag = false;
	$.ajax({
		type: 'get',
		async: false,
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../classes/deleteClassesById?id=' + treeNode.Id),
		success: function(data) {
			if (data.status == 0) {
				flag = true;
				yunNoty(data);
				$('.search_form').val(-1);
				phraseListTab(1);
			} else {
				yunNoty(data);

			}
		}
	});
	return flag;
}

function zTreeBeforeClick(treeId, treeNode, clickFlag) {
	//return !treeNode.isParent;//当是父节点 返回false 不让选取
	if (treeNode.isParent == true) {
		$('.branchSearch input[name=isLeaf]').val(0);
	} else {
		$('.branchSearch input[name=isLeaf]').val(1);
	}
}

//格式化一步获取的json数据
function ajaxDataFilter(treeId, parentNode, responseData) {
	if (responseData) {
    if(responseData.list) {
      responseData.list.push({
        Id: -1,
        ParentId: 0,
        Name: "全部分类",
        open: true
      });
    } else {
      return [{
        Id: -1,
        ParentId: 0,
        Name: "全部分类",
        open: true
      }];
    }
		return responseData.list;
	}
	return responseData;
}
	
//添加子分类表单提交
function doAddClasses() {
	//1.获取属性结构当前的Id代号
	var zTree = $.fn.zTree.getZTreeObj("treeClasses");
	var nodes = zTree.getSelectedNodes();
	if (nodes.length == 0) {
		yunNotyError("请先选择一个分类！");
		return;
	}
	if (nodes[0].level > 4) {
		yunNotyError("分类的层级最高为5级！");
		return;
	}
	if ($('#addClassForm input[name=name]').val().length < 1) {
		yunNotyError("分类名称不能少于1个字符！");
		return;
	}

  var roleIds = '';
  if($('#divnotshow').css('display') != 'none') {
    $('input[name=somerole]').each(function(){
      if($(this).prop('checked')) {
        roleIds += $(this).val() + ',';
      }
    });
    if(roleIds == '') {
      yunNotyError("请至少勾选一个分类所属角色！");
      return;
    } else {
      $('#addClassForm input[name=roleIds]').val(roleIds.substr(0,roleIds.length-1));
    }
  }
	$('#addClassForm input[name=parentId]').val(nodes[0].Id);
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../classes/editClassesInfo?mode=11'),
		data: $("#addClassForm").serialize(),
		success: function(data) {
			if (data.status == 0) {
				yunNoty(data);
				if (data.classes) {
					zTree.addNodes(nodes[0], data.classes);
				}
				$('#addClassForm input[name=name]').val('');
				$('#addClassForm input[name=parentId]').val('');
				$('#addClassForm input[name=roleIds]').val('');
				$('#addClassModal').modal('hide');
			} else {
				yunNoty(data);
			}
		}
	});
}
//修改子分类表单提交
function editClassify() {
	var classId = $('#editClassForm input[name=id]').val();
	var classHideName = $('#editClassForm input[name=classhideName]').val();
	var className = $('#editClassForm input[name=className]').val();

	if (className.length < 1) {
		yunNotyError("分类名称不能少于1个字符！");
		$('#editClassForm input[name=className]').focus();
		return;
	}

	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../classes/doEditClass?mode=11'),
		//data:encodeURI(tempcontent),
		data: $("#editClassForm").serialize(),
		success: function(data) {
			if (data.status == 0) {
				$('#editClassModal').modal('hide');
				var treeObj = $.fn.zTree.getZTreeObj("treeClasses");
				var nodes = treeObj.getNodeByParam("Id", classId, null);
				nodes.Name = className;
				treeObj.updateNode(nodes, true);
				yunNoty(data);
			} else {
				yunNoty(data);
				$('#editClassForm input[name=className]').focus();
			}
		}
	});
}

//修改子分类回车
enterSubmit($('#editClassForm input[name=className]'),editClassify);

//确认清空问题
$('#confrimClearQue').click(function() {
	$.ajax({
		type: 'get',
		async: false,
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../Question/clearGroup?groupId=' + $('.gId').val()),
		success: function(data) {
			if (data.status == 0) {
				yunNoty(data);
				$('#clearModal').modal('hide');
			} else {
				yunNoty(data);
			}
		}
	});
});
//确认删除分类
$('#confrimdel').click(function() {
	var classId = $('#DelClassModal input[name=classId]').val();
	var treeObj = $.fn.zTree.getZTreeObj("treeClasses");
	var node = treeObj.getNodeByTId(classId);
	treeObj.removeNode(node, true);
	$('#DelClassModal').modal('hide');
});

	$.fn.zTree.init($("#treeClasses"), setting, []);
	$('#addClassForm').validate({
		submitHandler: doAddClasses
	});
	$('#editClassForm').validate({
		submitHandler: editClassify
	});

/* ************ */
//导入句式组
loadingfn("#exlfileupload","../../KnSentenceGroup/doImportSentence","../../KnSentenceGroup/getStatus","phraseListTab")
/*
 btnDom               上传按钮的id或class
 uploadUrl            上传excel的路径
 getgetStatusUrl      获取上传进度的路径
 tablefn              页面表格生成的函数名字符串
 setintertime         获取进度的计时器间隔，不写为400ms
 */
function loadingfn(btnDom,uploadUrl,getgetStatusUrl,tablefn,setintertime){
	// 间隔时间
	var times=400;
	if(setintertime){
		var times=setintertime;
	}
	// 定义计时器
	var INTERVAL;
	// 进度条dom写入页面
	var jindutiaostr='<div id="exlProgress" style="position:fixed;z-index:99;top:0;right:0;background-color:rgba(0,0,0,0.4);width:100%;height:100%;display:none">';
	jindutiaostr+='<div style="width:329px;margin:25% auto;">';
	jindutiaostr+='<h4 style="text-align:center;color:#1296db;font-size:18px;font-family:'+'微软雅黑'+';text-shadow:1px 1px 2px  #FFFFFF;font-weight:700">Loading...</h4>';
	jindutiaostr+='<div class="progress progress-striped active" style="height:10px;background-color:#dadada;box-shadow:inset 0px 0px 3px lightgray;">';
	jindutiaostr+='<div class="progress-bar" style="background-color:#33b5e2"></div></div></div></div>';
	$("body").append(jindutiaostr);
	//上传
	$(function() {
		'use strict';
		$(btnDom).fileupload({
			url: uploadUrl,
			dataType: 'json',
			change: function(e, data) {
				var flag = true;
				$.each(data.files, function(index, file) {
					var str = file.name.substring(file.name.lastIndexOf(".") + 1);
					if (str == "xls" || str == "xlsx") {
						flag = true;
					} else {
						flag = false;
						yunNotyError("请上传xls或xlsx格式的文件！");
					}
				});
				return flag;
			},
			done: function(e, data) {
				if (data.result.status == 0) {
					$('#exlProgress').show();
					yunNoty(data.result);
					INTERVAL = setInterval(confirmLoad,times)
				} else {
					yunNoty(data.result);
					$('#exlProgress').hide();
					$('#exlProgress .progress-bar').css('width', '0%');
					$('.fileinput-button').css('display', 'inline-block');
					$('.fileUpLoadingSign').css('display', 'none');
				}
			},
		}).bind('fileuploadstart', function(e) {
			$('.fileinput-button').css('display', 'none');
			$('.fileUpLoadingSign').css('display', 'inline-block');
			$('#exlProgress').show();
		}).bind('fileuploadstop', function(e) {
			$('.fileinput-button').css('display', 'inline-block');
			$('.fileUpLoadingSign').css('display', 'none');
		});
	});
	//确认导入
	function confirmLoad(obj) {
		$.ajax({
			type: 'get',
			datatype: 'json',
			cache: false, //不从缓存中去数据
			url: encodeURI(getgetStatusUrl),
			success: function(data) {
				var progress=data.ProgressToKnowledge;
				if (data.ProgressToKnowledge == 100) {
					if (data.ErrorMsg != '') {
						yunNoty({
							status: 1,
							message: data.ErrorMsg
						});
					} else {
						yunNoty({
							status: 0,
							message: '导入成功！'
						});
						window.location.reload();
					}
					clearInterval(INTERVAL);
					$('#exlProgress .progress-bar').css(
						'width',
						progress + '%'
					)
					$('#exlProgress h4').text(
						"Loading..."+progress + '%'
					)
					setTimeout(function(){
						$('#exlProgress').hide();
						$('#exlProgress .progress-bar').css('width', '0%');
						eval(tablefn+"()")
					},1000)
				} else {
					$('#exlProgress .progress-bar').css(
						'width',
						progress + '%'
					)
					$('#exlProgress h4').text(
						"Loading..."+progress + '%'
					)
				}
			},
			error:function(){
				clearInterval(INTERVAL);
				$('#exlProgress').hide();
				$('#exlProgress .progress-bar').css('width', '0%');
				eval(tablefn+"()")
			}
		});
	}
}
//导出Excel
$('.export').on('click', function() {
	document.location.href = '../../KnSentenceGroup/exPortK?excelFlag=1';
});

//排序
$('.sort1').on('click', function() {//默认排序
   $('.sortWord').html($(this).text()+'&nbsp;' +'<span class="caret"></span>');
   $('.search_form2').val(4);
   phraseListTab(1,$('.search_form2').val())
});

$('.sort4').on('click', function() {//时间倒序
   $('.sortWord').html($(this).text()+'&nbsp;' +'<span class="caret"></span>');
   $('.search_form2').val(4);
   phraseListTab(1,$('.search_form2').val())
});
$('.sort5').on('click', function() {//时间正序
   $('.sortWord').html($(this).text()+'&nbsp;' +'<span class="caret"></span>');
   $('.search_form2').val(3);
   phraseListTab(1,$('.search_form2').val())
});

var pageSize2 = 10,
    pageNo2 = 1,
    id2 = 0;

//删除
$('body').on('click', '.del', function() {
  var self = this;
  $(self).adcCreator(function() {
    somedel(self);
  });
});
function somedel(obj) {
	var $tr = $(obj).parents('tr');
	id2 = $tr.attr('id');
	Base.request({
		url: 'KnSentenceGroup/doDeleteKnSentenceGroup',
		params: {
			id: id2,
		},
		callback: function(data) {
	        if(data.status) {
	            Base.gritter(data.message, false);
	        }else {
	            Base.gritter(data.message, true);
   				phraseListTab(1,$('.search_form2').val());
	        }
	    },
	});
}

$('body').on('click', '.commonSentenc,.KnCount span', function() {
	var $tr = $(this).parents('tr');
	id2 = $tr.attr('id');
	initSrc2();
});


//普通句型列表
$('#profile-tab').on('click', function() {
	pageNo2 = 1;
	initSrc2();
});

function initSrc2() {
    $('#ttt2').tableAjaxLoader2(2);
    Base.request({
        url: 'KnSentenceItem/getKSItemList',
        params: {
            pageSize: pageSize2,
            pageNo: pageNo2,
            sgId: id2,
            orderType:4
        },
        callback: function(data) {
            if(data.status) {
                Base.gritter(data.message, false);
            }else {
                var html ='';
                if(data.list.Items && data.list.Items.length>0) {
                	var temp = data.list.Items;
                    for(var i=0; i < temp.length; i++) {
                        html += '<tr Id="'+ temp[i].Id +'" SgId="'+ temp[i].SgId +'" SiName="'+ temp[i].SiName +'"><td><span class="simQue">'+ temp[i].SiName +'</span></td><td style="white-space:nowrap;"><span>'+ temp[i].DateTime +'</span></td><td><a class=""><span class="editWord timeTip glyphicon glyphicon-pencil" title="编辑" style="cursor: pointer;"></span></a><a class="delWord"><span class="timeTip glyphicon glyphicon-trash" title="删除" style="cursor: pointer; margin-left: 5px;"></span></a></td></tr>';
                    }

                    var options = {
                    	data:[data.list,'Items','TotalCount'],
                        currentPage: data.list.CurrentIndex,
                        totalPages: data.list.PageCount,
                        alignment: 'right',
                        onPageClicked: function(event, originalEvent, type, page) {
                            pageNo2 = page;
                            initSrc2();
                        }
                    };
                    $('#itemContainer2').bootstrapPaginator(options);
                }else {
                    html += '<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
                    $('#itemContainer2').empty();
                }
                $('.tbody2').empty().append(html);
                $('.timeTip').tooltip();


            }
        },
    });
}

//显示普通句型
$('body').on('click', '.commonSentenc,.KnCount', function() {
	$tr = $(this).parents('tr');
});

//ENTER
$('[name="siName"]').on('keyup', function(e){
	e.preventDefault();
	if(e.keyCode == 13) {
		$('.addWord').trigger('click');
	}
});
//修改句型
$('body').on('click', '.editWord', function() {
	$tr2 = $(this).parents('tr');
	$('[name=testQue]').val($tr2.attr('testQue'));
	$('[name=testRes]').val($tr2.attr('testRes'));
	$('[name=solutionId]').val($tr2.attr('solutionId'));
	var $tr = $(this).parents('tr'),
      $simQue = $tr.find('.simQue'),
      $simTr = $('<tr><td colspan="2"><input type="text" class="form-control" placeholder="输入修改后的句型" maxlength="200"></td><td style="vertical-align: middle;"><a class="ensureSim"><span class="timeTip glyphicon glyphicon-ok" title="确定"></span></a><a class="cannelSim"><span class="timeTip glyphicon glyphicon-remove" title="取消"></span></a></td></tr>');

    if (!$tr.next().find('.ensureSim')[0]) {
      $tr.after($simTr);
      $simTr.hide().fadeIn();
      $('.timeTip').tooltip();
      $simTr.find('input').val($simQue.text()).focus();
    }
});
 //确认修改句型
  $('body').on('click', '.ensureSim', function() {
    editGroupQue(this);
  });
//修改句型方法
function editGroupQue(obj){
	var $group = $(obj).parents('tr'),
    	group = $group.find('input').val();
	$('[name=level]').val(0);
	$('[name=solutionId]').val($tr.attr('solutionId'));
	$('[name=classId]').val($tr.attr('classId'));
	$('[name=testQue]').val(1);
	$('[name=testRes]').val(1);
	Base.request({
		url: 'KnSentenceItem/doEditKSItem',
		params: {
			id: $tr2.attr('id'),
			siName:group
		},
		callback: function(data) {
	        if(data.status) {
	            Base.gritter(data.message, false);
	        }else {
	            Base.gritter(data.message, true);
	            initSrc2();
    			$('[name=siName]').val('');
	        }
	    },
	});
}
//ENTER
  $(document).on('keyup', function(e) {
    var $activeEl = $(document.activeElement);
    if ($activeEl.is('[placeholder=输入修改后的句型]') && (e.keyCode == 13 || e.keyCode == 108)) {
      $('.ensureSim').trigger('click');
    }
  });

  //取消修改相似问法
  $('body').on('click', '.cannelSim', function() {
    var $cancleTr = $(this).parents('tr');
    $cancleTr.fadeOut(function() {
      $(this).remove();
    });
  });

//确认添加
$('.addWord').on('click', function() {
    $('[name=level]').val(0);
    $('[name=solutionId]').val($tr.attr('solutionId'));
    $('[name=groupId]').val($tr.attr('id'));
	Base.request({
		url: 'KnSentenceItem/doAddKSItem',
		params: {
			sgId:$("[name=groupId]").val(),
			siName:$("[name=siName]").val()
		},
		callback: function(data) {
	        if(data.status) {
	            Base.gritter(data.message, false);
	        }else {
	            Base.gritter(data.message, true);
   				initSrc2();
				phraseListTab(pageNo,$('.search_form2').val());
    			$('[name=siName]').val('');
	        }
	    },
	});
});

//删除普通句型
$('body').on('click', '.delWord', function() {
	var $tr = $(this).parents('tr');
	Base.request({
		url: 'KnSentenceItem/doDeleteKSItem',
		params: {
			ids: $tr.attr('id'),
		},
		callback: function(data) {
	        if(data.status) {
	            Base.gritter(data.message, false);
	        }else {
	            Base.gritter(data.message, true);
				   initSrc2();
				   phraseListTab(1);
	        }
	    },
	});
});

//下载
$('.down').on('click', function() {
	document.location.href = '../../wordDocExcel/exportTemplate?mode=12';
});

//搜索
$(document).on('click','.btnSearch', function() {
	// Base.request({
	// 	url: 'KnSentenceGroup/getKnSentenceGroupList',
	// 	params: {
	// 		level: 1,
	// 		name: $('.searchBy').val()
	// 	},
	// 	callback: function(data) {
	//         if(data.status) {
	//             Base.gritter(data.message, false);
	//         }else {
	//             Base.gritter(data.message, true);
   				phraseListTab(1, $('.search_form2').val());
	//         }
	//     },
	// });
});

//ENTER
$('.searchBy').on('keyup', function(e){
	e.preventDefault();
	if(e.keyCode == 13) {
		$('.btnSearch').trigger('click');
	}
});
