IDMark_A = "_a";
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
		url: "../../classes/pageListClasses?mode=9&pageSize=1000",
		autoParam: ["id"],
		dataFilter: ajaxDataFilter
	},
	callback: {
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
				listBrunch(1);
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

//自定义树的操作按钮1
function addHoverDom(treeId, treeNode) {
	var Obj = $("#" + treeNode.tId + "_a");
	if ($("#addBtn_" + treeNode.Id).length > 0) return;
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
	if (treeNode.isParent == false) {
		$("#diyBtn_" + treeNode.Id).unbind().remove();
		$("#delBtn_" + treeNode.Id).unbind().remove();
	}
	$("#outBtn_" + treeNode.Id).unbind().remove();
	$("#outflowBtn_" + treeNode.Id).unbind().remove();
}

// function beforeDrag(treeId, treeNodes) {
// 	return false;
// }

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

//获取ztree的数据列表

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

	$('#addClassForm input[name=parentId]').val(nodes[0].Id);
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../classes/editClassesInfo'),
		data: $("#addClassForm").serialize(),
		success: function(data) {
			if (data.status == 0) {
				yunNoty(data);
				if (data.classes) {
					zTree.addNodes(nodes[0], data.classes);
				}
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
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../classes/doEditClass'),
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

var INTERVAL;
$(document).ready(function() {
	App.init();
	//角色ztree滚动条
	$('.treeDivLeft').slimScroll({
		height: '600px'
	});
	$.fn.zTree.init($("#treeClasses"), setting, []);
	$('#addClassForm').validate({
		submitHandler: doAddClasses
	});
	$('#editClassForm').validate({
		submitHandler: editClassify
	});
	//清空表单
	$('#addClassModal').on('hidden.bs.modal', function () {
		$('#addClassForm input').val('');
		$('#addClassForm input[name=mode]').val('9');
	});
	$('#editClassModal').on('hidden.bs.modal', function () {
		$("#editClassForm input").val('');
		$('#editClassForm input[name=mode]').val('9');
	});
});