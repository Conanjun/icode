//角色管理左侧树
var setting = {
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
		showIcon: false
	},
	edit: {
		enable: true,
		showRenameBtn: false,
		showRemoveBtn: setRemoveBtn,
		removeTitle: '删除',
	},
	async: {
		enable: true,
		url: "../../AuthRole/listAll",
		autoParam: ["id"],
		dataFilter: ajaxDataFilter,
		otherParam: {"webId":function(){return $('#rootUser').val();}}
	},
	callback: {
    beforeClick: function(treeId, treeNode, clickFlag) {
      if(treeNode.Id == 0) return false;
    },
		beforeRemove: beforeRemove,
		onAsyncSuccess: zTreeOnAsyncSuccess,
		onClick: function(e, treeId, treeNode) {
			var ZTree = $.fn.zTree.getZTreeObj("treeClasses"),
			Nodes = ZTree.getSelectedNodes();
			$('#repRoleform input[name=name]').val(Nodes[0].Name);
			$('#repRoleform input[name=id]').val(Nodes[0].Id);
			$('#navLi2').addClass('active').siblings().removeClass('active');
			$('#nav-pills-tab-2').addClass('in').addClass('active');
			$('#nav-pills-tab-1').removeClass('in').removeClass('active');
			idGetRole();
		},
	}
};

function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
	var treeObj = $.fn.zTree.getZTreeObj("treeClasses");
	var nodes = treeObj.getNodes()[0].children;
	if (nodes.length > 0) {
		treeObj.selectNode(nodes[0]);
	}
	$('#repRoleform input[name=id]').val(nodes[0].Id);
	idGetRole();
}

//格式化一步获取的json数据
function ajaxDataFilter(treeId, parentNode, responseData) {
	if (responseData) {
		if(responseData.showRoleId === '1') {
			$('#rootUserDiv').show();
		} else {
			$('#rootUserDiv').remove();
		}
		responseData.list.push({
			Id: 0,
			ParentId: 0,
			Name: "角色总览",
			open: true
		});
		$.each(responseData.list,
		function(i, Item) {
			if (Item.showRoleId == 1) {
				Item.Name = Item.Name + '[ ' + Item.Id + ' ]';
			}
		});
		return responseData.list;
	}
	return responseData;
}

//如果节点下面有子节点则不显示删除按钮
function setRemoveBtn(treeId, treeNode) {　　 //判断为顶级节点则不显示删除按钮
	return ! treeNode.isParent;　　　
}

function beforeRemove(treeId, treeNode) {
	if(treeNode.Id < 0) {
		yunNotyError('该角色无法删除！');
		return false;
	}
	$('#delpModal').modal('show');
	$('#delpModal input[name=id]').val(treeNode.Id);
	return false;
}

////////////////角色管理里面的分类树-问答///////////////////
var classsetting = {
	check: {
		enable: true,
		chkboxType: {
			"Y": "ps",
			"N": "ps"
		}
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
		dblClickExpand: false,
		selectedMulti: false,
		showIcon: false
	},
	async: {
		enable: true,
		url: "../../classes/listClasses?m=0",
		autoParam: ["id"],
		dataFilter: ajaxDataFilterSelectRole
	},
	callback: {
		beforeClick: beforeClickclass,
		onCheck: onCheck,
		onAsyncSuccess: onCheck
	}
};

function ajaxDataFilterSelectRole(treeId, parentNode, responseData) {
	if (responseData) {
		var ids = $("#ClassModalREP input[name=hasCheckedId]").val();
		var id = ids.split(',');
		var temp = true;
		responseData.list.push({
			Id: 0,
			ParentId: -1,
			Name: "全部分类",
			open: true
		});
		for (var i = 0; i < responseData.list.length; i++) {
			var role = responseData.list[i];
			var idstr = role.Id;
			var tmpParentId = -1;
			if (contains(id, idstr)) {
				responseData.list[i].checked = true;
				tmpParentId = responseData.list[i].ParentId;
				while (tmpParentId != -1) {
					for (var j = 0; j < responseData.list.length; j++) {
						if (responseData.list[j].Id == tmpParentId) {
							responseData.list[j].checked = true;
							tmpParentId = responseData.list[j].ParentId;
							break;
						}
					}
				}

			} else {
				temp = false;
			}
		}
		return responseData.list;
	}
	return responseData;
}

function beforeClickclass(treeId, treeNode) {
	if ($('.tab-content .tab-pane').eq(0).hasClass('active')) {
		var zTree1 = $.fn.zTree.getZTreeObj("treeRoleClass");
		zTree1.checkNode(treeNode, !treeNode.checked, null, true);
		return false;
	}
	if ($('.tab-content .tab-pane').eq(1).hasClass('active')) {
		var zTree2 = $.fn.zTree.getZTreeObj("treeRoleREPClass");
		zTree2.checkNode(treeNode, !treeNode.checked, null, true);
		return false;
	}
}

function onCheck(e, treeId, treeNode) {
	var zTree2 = $.fn.zTree.getZTreeObj("treeRoleREPClass"),
	nodes2 = zTree2.getCheckedNodes(true),
	editNames = "";
	editIds = "";
	for (var j = 0,
	l2 = nodes2.length; j < l2; j++) {
		editNames += nodes2[j].Name + ",";
		editIds += nodes2[j].Id + ",";
	}
	if (editIds.length > 0) editIds = editIds.substring(0, editIds.length - 1);
	if (editNames.length > 0) editNames = editNames.substring(0, editNames.length - 1);
	$("#ClassModalREP input[name=hasChecked]").val(editNames);
	$("#ClassModalREP input[name=hasCheckedId]").val(editIds);
}
$('#listDiv').slimScroll({
	height: '400px',
	/*alwaysVisible: true,*/
});
////////////////角色管理里面的分类树-素材///////////////////
var materialsetting = {
	check: {
		enable: true,
		chkboxType: {
			"Y": "ps",
			"N": "ps"
		}
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
		dblClickExpand: false,
		selectedMulti: false,
		showIcon: false
	},
	async: {
		enable: true,
		url: "../../classes/pageListClasses?mode=9",
		autoParam: ["id"],
		dataFilter: ajaxDataFilterMaterial
	},
	callback: {
		beforeClick: beforeClickMaterial,
		onCheck: onCheckMaterial,
		onAsyncSuccess: onCheckMaterial
	}
};

function ajaxDataFilterMaterial(treeId, parentNode, responseData) {
	if (responseData) {
		var ids = $("#ClassModalREP input[name=hasCheckedIdMaterial]").val();
		var id = ids.split(',');
		var temp = true;
		responseData.list.push({
			Id: 0,
			ParentId: -1,
			Name: "全部分类",
			open: true
		});
		for (var i = 0; i < responseData.list.length; i++) {
			var role = responseData.list[i];
			var idstr = role.Id;
			var tmpParentId = -1;
			if (contains(id, idstr)) {
				responseData.list[i].checked = true;
				tmpParentId = responseData.list[i].ParentId;
				while (tmpParentId != -1) {
					for (var j = 0; j < responseData.list.length; j++) {
						if (responseData.list[j].Id == tmpParentId) {
							responseData.list[j].checked = true;
							tmpParentId = responseData.list[j].ParentId;
							break;
						}
					}
				}

			} else {
				temp = false;
			}
		}
		return responseData.list;
	}
	return responseData;
}

function beforeClickMaterial(treeId, treeNode) {
	if ($('.tab-content .tab-pane').eq(0).hasClass('active')) {
		var zTree1 = $.fn.zTree.getZTreeObj("treeMaterialClass");
		zTree1.checkNode(treeNode, !treeNode.checked, null, true);
		return false;
	}
	if ($('.tab-content .tab-pane').eq(1).hasClass('active')) {
		var zTree2 = $.fn.zTree.getZTreeObj("treeMaterialREPClass");
		zTree2.checkNode(treeNode, !treeNode.checked, null, true);
		return false;
	}
}

function onCheckMaterial(e, treeId, treeNode) {
	var zTree2 = $.fn.zTree.getZTreeObj("treeMaterialREPClass"),
	nodes2 = zTree2.getCheckedNodes(true),
	editNames = "";
	editIds = "";
	for (var j = 0,
	l2 = nodes2.length; j < l2; j++) {
		editNames += nodes2[j].Name + ",";
		editIds += nodes2[j].Id + ",";
	}
	if (editIds.length > 0) editIds = editIds.substring(0, editIds.length - 1);
	if (editNames.length > 0) editNames = editNames.substring(0, editNames.length - 1);
	$("#ClassModalREP input[name=hasCheckedMaterial]").val(editNames);
	$("#ClassModalREP input[name=hasCheckedIdMaterial]").val(editIds);
}
/////////////////来访者角色树////////////////////////
var visitersetting = {
	check: {
		enable: true,
		chkboxType: {
			"Y": "ps",
			"N": "ps"
		}
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
		dblClickExpand: false,
		selectedMulti: false,
		showIcon: false
	},
	async: {
		enable: true,
		url: "../../comb/loadCombs",
		autoParam: ["id"],
		dataFilter: ajaxDataFilterSelectvisiterRole
	},
	callback: {
		beforeClick: beforeClickVisiter,
		onCheck: onCheckVisiter
	}
};

function ajaxDataFilterSelectvisiterRole(treeId, parentNode, responseData) {
	if (responseData) {
		var id = $('#repRoleform input[name=combGroupIds]').val().split(',');
		var temp = true;
		var visiterList = responseData.list;
		for (var i = 0; i < visiterList.length; i++) {
			var role = visiterList[i];
			var idstr = role.Id;
			var tmpParentId = -1;
			if (contains(id, idstr)) {
				visiterList[i].checked = true;
			} else {
				temp = false;
			}
		}
		return visiterList;
	}
	return responseData;
}

function beforeClickVisiter(treeId, treeNode) {
	if ($('.tab-content .tab-pane').eq(0).hasClass('active')) {
		var zTree1 = $.fn.zTree.getZTreeObj("treeRoleVisiter");
		zTree1.checkNode(treeNode, !treeNode.checked, null, true);
		return false;
	}
	if ($('.tab-content .tab-pane').eq(1).hasClass('active')) {
		var zTree2 = $.fn.zTree.getZTreeObj("treeRoleeditVisiter");
		zTree2.checkNode(treeNode, !treeNode.checked, null, true);
		return false;
	}
}

function oncheckCommon(treeId, formId, name, id, editTreeId, editformId, flag) {
	if ($('.tab-content .tab-pane').eq(0).hasClass('active')) {
		oncheckCommon_child(treeId, formId, name, id, flag);
	}
	if ($('.tab-content .tab-pane').eq(1).hasClass('active')) {
		oncheckCommon_child(editTreeId, editformId, name, id, flag);
	}
}

function onCheckVisiter(e, treeId, treeNode) {
	var zTree2 = $.fn.zTree.getZTreeObj("treeRoleeditVisiter"),
	nodes2 = zTree2.getCheckedNodes(true),
	editNames = "";
	editIds = "";
	for (var j = 0,
	l2 = nodes2.length; j < l2; j++) {
		editNames += nodes2[j].Name + ",";
		editIds += nodes2[j].Id + ",";
	}
	if (editNames.length > 0) editNames = editNames.substring(0, editNames.length - 1);
	$("#sel_visiter_edit_Role input[name=hasChecked]").val(editNames);
	$("#sel_visiter_edit_Role input[name=hasCheckedId]").val(editIds);
}

//生效时间问题
$('body').on('ifClicked', '[name=timeLiness_temp]',
function() {
	if ($(this)[0].checked) {
		$('#repRoleform input[name=timeLiness_temp]').val(0);
		$('#qiRoleTime').css('display','none');
	} else {
		$('#repRoleform input[name=timeLiness_temp]').val(1);
		$('#qiRoleTime').css('display','block');
	}
});

//全选/反选问题
$('.auth_list').on('ifClicked', '.resIds',
function() {
	if ($(this)[0].checked) {
		$(this).parents('form').find('.selAll').iCheck('uncheck');
		$(this).parents('ul').find('.mokuaiSel').iCheck('uncheck');
	}
});

//角色全选，反选的问题
function roleSel(formId) {
	$('#' + formId).on('ifClicked', '.selAll',
	function() {
		if ($(this)[0].checked) {
			$('#' + formId + ' .auth_list').find('input.resFids').iCheck('uncheck');
			$('#' + formId + ' .auth_list').find('input.resIds:not([not])').iCheck('uncheck');
		} else {
			$('#' + formId + ' .auth_list').find('input.resFids').iCheck('check');
			$('#' + formId + ' .auth_list').find('input.resIds:not([not])').iCheck('check');
		}
	});
}

function roleFSel(formId) {
	$('#' + formId).on('ifClicked', '.resFids',
	function() {
		if ($(this)[0].checked) {
			$('#' + formId + ' .auth_list .auth_ul_'+$(this).attr('id')).find('input.resIds:not([not])').iCheck('uncheck');
		} else {
			$('#' + formId + ' .auth_list .auth_ul_'+$(this).attr('id')).find('input.resIds:not([not])').iCheck('check');
		}
	});
}

function childRoleSel(formId) {
	$('#' + formId + ' .auth_list').on('ifClicked', '.mokuaiSel',
	function() {
		var curId = $(this).attr('rel');
		if ($(this)[0].checked) {
			$('#' + formId + ' .auth_ul_' + curId).find('input.resIds').iCheck('uncheck');
		} else {
			$('#' + formId + ' .auth_ul_' + curId).find('input.resIds').iCheck('check');
		}
	});
}

var flag_add = false;
//添加角色
function addRole() {
	if (flag_add) {
		return;
	}
	var tt = $('#repRoleform input[name=timeLiness_temp]').val();
	var zTree = $.fn.zTree.getZTreeObj("treeClasses");
	var nodes = zTree.getNodes();
	flag_add = true;
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		url: encodeURI('../../AuthRole/createRole?timeLiness=' + tt),
		data: $("#repRoleform").serialize(),
		success: function(data) {
			flag_add = false;
			if (data.status == 0) {
				yunNoty(data);
				zTree.reAsyncChildNodes(null, "refresh");
				$('#repRoleform input[name=name]').val('');
				$('#repRoleform input[name=info]').val('');
				$('#repRoleform #SELCLASS').val('');
				$('#repRoleform .auth_list').find('input.resIds').iCheck('uncheck');
				$('#repRoleform input[value=40]').iCheck('check');
				$('#repRoleform input[value=56]').iCheck('check');
				$('#repRoleform input[name=classesIds]').val('');
			} else {
				yunNoty(data);
			}
		}
	});
}

//修改角色
var repRole_flag = 1;
var repRole_countdown_time = 4;
var click_lock = 0;
function repRole() {
	if(click_lock) {
		return;
	}
	if($('#repRoleform input[name=id]').val() < 0 && repRole_flag) {
		click_lock = 1;
		$.gritter.add({
			title: "警告",
			text: '修改角色将影响所有云上客户，请谨慎操作！（<span id="repRole_countdown">5</span>s后再次点击即可保存）',
			time: 5000,
			class_name: "gritter-light"
		});
		var repRole_countdown = setInterval(function() {
			if(repRole_countdown_time !== 0) {
				$('#repRole_countdown').html(repRole_countdown_time--);
			} else {
				clearInterval(repRole_countdown);
				repRole_countdown_time = 4;
				repRole_flag = 0;
				click_lock = 0;
			}
		}, 1000);
		return;
	}
	repRole_flag=1;
	if(flag_add) return;
	if($('.u-submit-name').val()){
		$('#repRoleform input[name=name]').val($('.u-submit-name').val());
	}else{
		$('#repRoleform input[name=name]').val($('.artreeselected>span').html());
	}
	var tt = $('#repRoleform input[name=timeLiness_temp]').val();
	if(tt == '1'){
        var startTime = $('#repRoleform input[name="startTime"]').val();
        var endTime = $('#repRoleform [name="endTime"]').val();
        if(startTime == "" && endTime == ""){
			tt = 0;
		}
	}
	var classId = $('#repRoleform input[name=id]').val();
	var className = $('#repRoleform input[name=name]').val();
	flag_add = true;
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		url: encodeURI('../../AuthRole/updateRole?timeLiness=' + tt),
		data: $("#repRoleform").serialize(),
		success: function(data) {
			flag_add = false;
			if (data.status == 0) {
				getRoleList();
				yunNoty(data);
			} else {
				yunNoty(data);
			}
		}
	});
}
//根据id获取相应的角色信息
function idGetRole() {
	//每次点击节点的时候重新设置权限
	$('#repRoleform input[type=checkbox]').iCheck('uncheck');

	var RID = $('#repRoleform input[name=id]').val();
	if (!RID) {
		return;
	}
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		url: encodeURI('../../AuthRole/findById?id=' + RID),
		success: function(data) {
			if (data.status === 0) {
				if (data.role) {
                    $('#visitereditRole').val(data.role.CombName);
					$('#repRoleform input[name=name]').val(data.role.Name);
					$('#repRoleform input[name=id]').val(data.role.Id);
					$('#repRoleform input[name=info]').val(data.role.Info);
					var timeS = data.role.TimeStart == null ? '': data.role.TimeStart;
					var timeE = data.role.TimeEnd == null ? '': data.role.TimeEnd;
					if (timeS && timeS.length < 16) {
						timeS = timeS + ' 00:00';
					}
					if (timeE && timeE.length < 16) {
						timeE = timeE + ' 00:00';
					}
					$("#ClassModalREP input[name=hasCheckedId]").val(data.role.GroupIds);
					$("#ClassModalREP input[name=hasCheckedIdMaterial]").val(data.role.GroupIds);
					$('#repRoleform input[name=startTime]').val(timeS.substring(0, 16));
					$('#repRoleform input[name=endTime]').val(timeE.substring(0, 16));
					if (data.role.TimeStart || data.role.TimeEnd) {
						$('#repRoleform input[name=timeLiness_temp]').iCheck('check');
						$('#repRoleform input[name=timeLiness_temp]').val(1);
						$("#qiRoleTime").show();
					} else {
						$('#repRoleform input[name=timeLiness_temp]').iCheck('uncheck');
						$('#repRoleform input[name=timeLiness_temp]').val(0);
						$("#qiRoleTime").hide();
					}
					if (data.role.Level == 1) {
						$('#selLevelRole option:eq(1)').attr("selected", true);
					} else {
						$('#selLevelRole option:eq(0)').attr("selected", true);
					}
					if (data.role.ListModule) {
						$('#repRoleform input.resIds').iCheck('uncheck');
						for (var i in data.role.ListModule) {
							if ($('#repRoleform .auth' + data.role.ListModule[i].Id).length) {
								$('#repRoleform .auth' + data.role.ListModule[i].Id).find('input.resIds').iCheck('check');
							}
						}
						$('#repRoleform input[value=40]').iCheck('check');
						$('#repRoleform input[value=56]').iCheck('check');
					}
					if(data.role.GroupNames || data.role.GroupNames == '') {
						$('#repRoleform #repSELCLASS').val(data.role.GroupNames);
					}
					if(data.role.GroupIds || data.role.GroupIds == '') {
						$('#repRoleform input[name=classesIds]').val(data.role.GroupIds);
					}
					if(data.role.CombGroupIds || data.role.CombGroupIds == '') {
						$('#repRoleform input[name=combGroupIds]').val(data.role.CombGroupIds);
					}
				} else {
					return;
				}
				//如果权限没值，默认状态
				$('#repRoleform .checkbox').remove('.setTime');
			} else {
				yunNoty(data);
			}
		}
	});
}

////////////////////////获取权限列表////////////////////////////////
function getRoles() {
	//页面加载的样式
	$('.auth_list').tableAjaxLoader2(1);
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		url: encodeURI('../../AuthModule/listAll'),
		success: function(data) {
			if (data.status === 0) {
				showAuthList(data);
				icheckInit();
				$('#listDiv .artree').eq(0).trigger('click');
				return;
			} else {
				yunNoty(data);
			}
		}
	});
}
function showAuthList(data) {
	if (data.list.length > 0) {
		var authDiv = $('.auth_list').html('');
		$.each(data.list,
		function(i, authItem) {
			if (authItem.Level === 0) {

				var ul = $('<div/>').addClass("auth_ul_" + authItem.Id+" col-md-12 col-xs-12");
				if (i > 1) {
					ul.append('<br>');
				}
				if(authItem.Name == '默认权限') {
					ul.append('<span class="abc" style="display: none;"><strong>' + authItem.Name + '</strong>&nbsp;</span><div class="col-md-10 col-xs-10 rightRole'+authItem.Id+'"><ul></ul></div>');
				}else {
					ul.append('<div class="li_inline col-md-2 col-xs-2" style="padding-left:0;padding-right:0;"><input type="checkbox" id="'+ authItem.Id +'" class="resFids">&nbsp;<label>' + authItem.Name + '</label>&nbsp;</div><div class="col-md-10 col-xs-10 rightRole'+authItem.Id+'"><ul></ul></div>');
				}
				authDiv.append(ul);
				for (var j in authItem.ChildModule) {
					if(authItem.ChildModule[j] == '默认权限') {
						authDiv.find(".auth_ul_" + authItem.Id+" .rightRole"+authItem.Id+" ul").append(createAutnItemLi(authItem.ChildModule[j]));
					}else {
						authDiv.find(".auth_ul_" + authItem.Id+" .rightRole"+authItem.Id+" ul").append(createAutnItemLi(authItem.ChildModule[j]));
					}
				}
			}
		});
		$('.timeTip').tooltip();
	}
}
setInterval(function() {
	$('.abc').next().hide();
}, 100);
function createAutnItemLi(ChildModule) {
	var checked = '';
	if(ChildModule.Id == 40 || ChildModule.Id == 56) {
		checked = 'checked not';
	}
	var ckbTime = $('<span/>').append('<input type="checkbox" class="resIds" name="moduleIds" value="' + ChildModule.Id + '" ' + checked +' >&nbsp;' + ChildModule.Name).addClass('auth' + ChildModule.Id + '');
	var li = $('<li/>').addClass('auth_ul_li_' + ChildModule.Id).append(ckbTime);
	return li;
}

//选择分类弹出框
showModal('SELCLASS', '', 'ClassModalOut');
$('#ClassModalOut').on('show.bs.modal', function () {
	$.fn.zTree.init($("#treeRoleClass"), classsetting, []);
	$.fn.zTree.init($("#treeMaterialClass"), materialsetting, []);
})
$('#selClassBtn').click(function() {
	var name = $("#ClassModalOut input[name=hasChecked]").val();
	var Id = $("#ClassModalOut input[name=hasCheckedId]").val();
	var nameM = $("#ClassModalOut input[name=hasCheckedMaterial]").val();
	var IdM = $("#ClassModalOut input[name=hasCheckedIdMaterial]").val();
	$('#ClassModalOut').modal('hide');
	//
	// 确定时四个input的值合并成两个
	//
	$('#repRoleform #SELCLASS').val(name+','+nameM);
	$('#repRoleform input[name=classesIds]').val(Id+','+IdM);
})
//修改角色分类
showModal('repSELCLASS', '', 'ClassModalREP');
$('#ClassModalREP').on('show.bs.modal', function () {
	$.fn.zTree.init($("#treeRoleREPClass"), classsetting, []);
	$.fn.zTree.init($("#treeMaterialREPClass"), materialsetting, []);
})
$('#selrepClassBtn').click(function() {
	var name = $("#ClassModalREP input[name=hasChecked]").val();
	var Id = $("#ClassModalREP input[name=hasCheckedId]").val();
	var nameM = $("#ClassModalREP input[name=hasCheckedMaterial]").val();
	var IdM = $("#ClassModalREP input[name=hasCheckedIdMaterial]").val();
	$('#ClassModalREP').modal('hide');
	//
	// 确定时四个input的值合并成两个
	//
	$('#repRoleform #repSELCLASS').val(name+','+nameM);
	$('#repRoleform input[name=classesIds]').val(Id+','+IdM);
})

//选择来访者角色弹出框
showModal('visiterRole', '', 'sel_visiter_Role');
$('#sel_visiter_Role').on('show.bs.modal', function () {
	$.fn.zTree.init($("#treeRoleVisiter"), visitersetting, []);
})
$('#sel_visiter_btn').click(function() {
	var name = $("#sel_visiter_Role input[name=hasChecked]").val();
	var Id = $("#sel_visiter_Role input[name=hasCheckedId]").val();
	$('#sel_visiter_Role').modal('hide');
	$('#repRoleform #visiterRole').val(name);
	$('#repRoleform input[name=combGroupIds]').val(Id);
})
//修改来访者角色
showModal('visitereditRole', '', 'sel_visiter_edit_Role');
$('#sel_visiter_edit_Role').on('show.bs.modal', function () {
	$.fn.zTree.init($("#treeRoleeditVisiter"), visitersetting, []);
})
$('#sel_visiter_btn_edit').click(function() {
	var name = $("#sel_visiter_edit_Role input[name=hasChecked]").val();
	var Id = $("#sel_visiter_edit_Role input[name=hasCheckedId]").val();
	$('#sel_visiter_edit_Role').modal('hide');
	$('#repRoleform #visitereditRole').val(name);
	$('#repRoleform input[name=combGroupIds]').val(Id);
})

//点击显示模态窗口
function showModal(clickBtn, clickClass, modalId) {
	if (!clickBtn) {
		clickBtn = '';
	} else {
		$('#' + clickBtn).on('click',
		function() {
			$('#' + modalId).modal('show');
		})
	}
	if (!clickClass) {
		clickBtn = '';
	} else {
		$('.' + clickClass).on('click',
		function() {
			$('#' + modalId).modal('show');
		})
	}
}
