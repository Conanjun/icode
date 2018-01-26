//存修改子节点回带的勾选值
var objList = null;
//角色
var setting = {
	edit: {
		enable: true,
		showRemoveBtn: function(treeId, treeNode) {
      //如果节点下面有子节点则不显示删除按钮
      //判断为顶级节点则不显示删除按钮
      return ! treeNode.isParent;
    },
		showRenameBtn: function(treeId, treeNode) {
      if (treeNode.level == 0) {
        return false;
      }
      return true;
    },
		removeTitle: '删除',
		renameTitle: '修改'
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
		showIcon: false
	},
	async: {
		enable: true,
		url: "../../comb/loadCombs",
		autoParam: ["id"],
		dataFilter: function(treeId, parentNode, responseData) {
      if (responseData.status != 0) {
        yunNoty(responseData);
        return;
      }
      if (responseData) {
        // if(responseData.list && responseData.list.length === 0) {
        // 	return [{
        // 		'Id': 0,
        // 		'ParentId': 0,
        // 		'Name': "来访者角色",
        // 		'open': true
        // 	}];
        // }
        return responseData.list;
      }
      return responseData;
    }
	},
	callback: {
		beforeDrag: function(treeId, treeNodes) {
      return false;
    },
		onClick: function(e, treeId, treeNode) {
			$('#addparNode input[name=pId]').val(treeNode.Id);
			$('#addchildNode input[name=pId]').val(treeNode.Id);
		},
		beforeRemove: function(treeId, treeNode) {
			$.ajax('../../comb/findRelevanceQuestionByCombId?combId='+treeNode.Id,{
				async: false,
				success: function(data) {
					if((data.knowledgeBase) || (data.recycleStand)) {
						$('#notdelmsg').html('此来访者角色中还有标准知识'+(data.knowledgeBase || '0')+'条，回收站知识'+(data.recycleStand || '0')+'条，请去知识库中彻底删除或解绑');
						$('#NotDelClassModal').modal('show');
					} else {
			      $('#DelClassModal').modal('show');
			      $('#DelClassModal [name=classId]').val(treeNode.Id);
					}
				},
				error: function(){
					$('#DelClassModal').modal('show');
					$('#DelClassModal [name=classId]').val(treeNode.Id);
				}
			});
      return false;
    },
		beforeEditName: function(treeId, treeNode, newName, isCancel) {
      if (treeNode.isParent) {
        $('#editpnModal').modal('show');
        $('#editpnModal input[name=pId]').val(treeNode.ParentId);
        $('#editpnModal input[name=name]').val(treeNode.Name);
        $('#editpnModal input[name=combId]').val(treeNode.Id);
      } else {
        $.ajax({
          type: 'get',
          async: false,
          datatype: 'json',
          cache: false,
          //不从缓存中去数据
          url: encodeURI('../../comb/loadComb?combId=' + treeNode.Id),
          success: function(data) {
            if (data.status == 0) {
              $('#editcnModal input[name=pId]').val(data.comb.ParentId);
              $('#editcnModal input[name=combId]').val(data.comb.Id);
              $('#editcnModal input[name=name]').val(data.comb.Name);
              objList = data.comb.Elements;
              $('#editcnModal').modal('show');
            } else {
              yunNoty(data);
            }
          }
        });
      }
      return false;
    },
		onAsyncSuccess: function(event, treeId, treeNode, msg) {
      var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
      treeObj.expandAll(true);
    }
	}
};

$('#confrimdel').click(function() {
	var classId = $('#DelClassModal input[name=classId]').val();
	$.ajax({
		type: 'get',
		async: false,
		datatype: 'json',
		cache: false,
		// 不从缓存中去数据
		url: encodeURI('../../comb/deleteComb?combId=' + classId),
		success: function(data) {
			if (data.status == 0) {
				yunNoty(data);
				var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
				var node = treeObj.getNodeByParam('Id', classId);
				treeObj.removeNode(node, false);
				$('#DelClassModal').modal('hide');
			} else {
				yunNoty(data);
			}
		}
	});
});
//角色结束

//人员属性
var settingUser = {
	check: {
		enable: true,
		chkboxType: {
			"Y": "ps",
			"N": "ps"
		}
	},
	edit: {
		enable: true,
		showRemoveBtn: false,
		showRenameBtn: false,
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
		showIcon: false
	},
	async: {
		enable: true,
		url: "../../comb/loadGroupByName?name=人员",
		autoParam: ["id"],
		dataFilter: function(treeId, parentNode, responseData) {
      if (responseData.status != 0) {
        $('.addUser').hide();
        return;
      }
      if (responseData.group) {
        if (responseData.group.GroupElements) {
          return responseData.group.GroupElements;
        }
      }
    }
	},
	callback: {
		onCheck: function(e, treeId, treeNode) {
      var zTree = $.fn.zTree.getZTreeObj("treeUser"),
      nodes = zTree.getCheckedNodes(true),
      I = "";
      for (var i = 0,
      l = nodes.length; i < l; i++) {
        I += nodes[i].Id + ",";
      }
      $("#addchildNode input[class=elementIdUser]").val(I);
    }
	}
};
//人员属性结束

//部门属性
var settingDept = {
	check: {
		enable: true,
		chkboxType: {
			"Y": "ps",
			"N": "ps"
		}
	},
	edit: {
		enable: true,
		showRemoveBtn: false,
		showRenameBtn: false,
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
		showIcon: false
	},
	async: {
		enable: true,
		url: "../../comb/loadGroupByName?name=部门",
		autoParam: ["id"],
		dataFilter: function(treeId, parentNode, responseData) {
      if (responseData.status != 0) {
        $('.addDept').hide();
        return;
      }
      if (responseData.group) {
        if (responseData.group.GroupElements) {
          return responseData.group.GroupElements;
        }
      }
    }
	},
	callback: {
		onCheck: function(e, treeId, treeNode) {
      var zTree = $.fn.zTree.getZTreeObj("treeDept"),
      nodes = zTree.getCheckedNodes(true),
      I = "";
      for (var i = 0,
      l = nodes.length; i < l; i++) {
        I += nodes[i].Id + ",";
      }
      $("#addchildNode input[class=elementIdDept]").val(I);
    }
	}
};
//部门属性结束

//渠道属性
var settingSource = {
	check: {
		enable: true,
		chkboxType: {
			"Y": "ps",
			"N": "ps"
		}
	},
	edit: {
		enable: true,
		showRemoveBtn: false,
		showRenameBtn: false,
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
		showIcon: false
	},
	async: {
		enable: true,
		url: "../../comb/loadGroupByName?name=渠道配置组",
		autoParam: ["id"],
		dataFilter: function(treeId, parentNode, responseData) {
      if (responseData.status != 0) {
        $('.addSource').hide();
        return;
      }
      if (responseData.group) {
        if (responseData.group.GroupElements) {
          return responseData.group.GroupElements;
        }
      }
    }
	},
	callback: {
		onCheck: function(e, treeId, treeNode) {
      var zTree = $.fn.zTree.getZTreeObj("treeSource"),
      nodes = zTree.getCheckedNodes(true),
      I = "";
      for (var i = 0,
      l = nodes.length; i < l; i++) {
        I += nodes[i].Id + ",";
      }
      $("#addchildNode input[class=elementIdSource]").val(I);
    }
	}
};
//渠道属性结束

//修改人员属性
var editsettingUser = {
	check: {
		enable: true,
		chkboxType: {
			"Y": "ps",
			"N": "ps"
		}
	},
	edit: {
		enable: true,
		showRemoveBtn: false,
		showRenameBtn: false,
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
		showIcon: false
	},
	async: {
		enable: true,
		url: "../../comb/loadGroupByName?name=人员",
		autoParam: ["id"],
		dataFilter: function(treeId, parentNode, responseData) {
      if (responseData.status != 0) {
        $('.editUser').hide();
        return;
      }
      if (responseData.group) {
        if (responseData.group.GroupElements) {
          var listUser = responseData.group.GroupElements;
          if (objList[responseData.group.Id]) {
            var countJ = '';
            for (var j = 0; j < objList[responseData.group.Id].length; j++) {
              countJ += objList[responseData.group.Id][j] + ',';
            }
            $('#editcnModal input[class=elementIdUser]').val(countJ);
          } else {
            $('#editcnModal input[class=elementIdUser]').val('');
          }
          var ids = $('#editcnModal input[class=elementIdUser]').val();
          var id = ids.split(',');
          var temp = true;
          for (var i = 0; i < listUser.length; i++) {
            var role = listUser[i];
            var idstr = role.Id;
            if (contains(id, idstr)) {
              listUser[i].checked = true;
            } else {
              temp = false;
            }
          }
          return listUser;
        }
      }
    }
	},
	callback: {
		onCheck: function(e, treeId, treeNode) {
      var zTree = $.fn.zTree.getZTreeObj("edittreeUser"),
      nodes = zTree.getCheckedNodes(true),
      I = "";
      for (var i = 0,
      l = nodes.length; i < l; i++) {
        I += nodes[i].Id + ",";
      }
      $("#editChildNode input[class=elementIdUser]").val(I);
    }
	}
};
//修改人员属性结束

//修改部门属性
var editsettingDept = {
	check: {
		enable: true,
		chkboxType: {
			"Y": "ps",
			"N": "ps"
		}
	},
	edit: {
		enable: true,
		showRemoveBtn: false,
		showRenameBtn: false,
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
		showIcon: false
	},
	async: {
		enable: true,
		url: "../../comb/loadGroupByName?name=部门",
		autoParam: ["id"],
		dataFilter: function(treeId, parentNode, responseData) {
      if (responseData.status != 0) {
        $('.editDept').hide();
        return;
      }
      if (responseData.group) {
        if (responseData.group.GroupElements) {
          var listDept = responseData.group.GroupElements;
          if (objList[responseData.group.Id]) {
            var countJ = '';
            for (var j = 0; j < objList[responseData.group.Id].length; j++) {
              countJ += objList[responseData.group.Id][j] + ',';
            }
            $('#editcnModal input[class=elementIdDept]').val(countJ);
          } else {
            $('#editcnModal input[class=elementIdDept]').val('');
          }
          var ids = $('#editcnModal input[class=elementIdDept]').val();
          var id = ids.split(',');
          var temp = true;
          for (var i = 0; i < listDept.length; i++) {
            var role = listDept[i];
            var idstr = role.Id;
            if (contains(id, idstr)) {
              listDept[i].checked = true;
            } else {
              temp = false;
            }
          }
          return listDept;
        }
      }
    }
	},
	callback: {
		onCheck: function(e, treeId, treeNode) {
      var zTree = $.fn.zTree.getZTreeObj("edittreeDept"),
      nodes = zTree.getCheckedNodes(true),
      I = "";
      for (var i = 0,
      l = nodes.length; i < l; i++) {
        I += nodes[i].Id + ",";
      }
      $("#editChildNode input[class=elementIdDept]").val(I);
    }
	}
};
//修改部门属性结束

//修改渠道属性
var editsettingSource = {
	check: {
		enable: true,
		chkboxType: {
			"Y": "ps",
			"N": "ps"
		}
	},
	edit: {
		enable: true,
		showRemoveBtn: false,
		showRenameBtn: false,
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
		showIcon: false
	},
	async: {
		enable: true,
		url: "../../comb/loadGroupByName?name=渠道配置组",
		autoParam: ["id"],
		dataFilter: function(treeId, parentNode, responseData) {
      if (responseData.status != 0) {
        $('.editSource').hide();
        return;
      }
      if (responseData.group) {
        if (responseData.group.GroupElements) {
          var listSource = responseData.group.GroupElements;
          if (objList[responseData.group.Id]) {
            var countJ = '';
            for (var j = 0; j < objList[responseData.group.Id].length; j++) {
              countJ += objList[responseData.group.Id][j] + ',';
            }
            $('#editcnModal input[class=elementIdSource]').val(countJ);
          } else {
            $('#editcnModal input[class=elementIdSource]').val('');
          }
          var ids = $('#editcnModal input[class=elementIdSource]').val();
          var id = ids.split(',');
          var temp = true;
          for (var i = 0; i < listSource.length; i++) {
            var role = listSource[i];
            var idstr = role.Id;
            if (contains(id, idstr)) {
              listSource[i].checked = true;
            } else {
              temp = false;
            }
          }
          return listSource;
        }
      }
    }
	},
	callback: {
		onCheck: function(e, treeId, treeNode) {
      var zTree = $.fn.zTree.getZTreeObj("edittreeSource"),
      nodes = zTree.getCheckedNodes(true),
      I = "";
      for (var i = 0,
      l = nodes.length; i < l; i++) {
        I += nodes[i].Id + ",";
      }
      $("#editChildNode input[class=elementIdSource]").val(I);
    }
	}
};
//修改渠道属性结束

//添加父节点
function doAddNodes() {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	var nodes = zTree.getSelectedNodes();
	if (nodes.length == 0) {
		yunNotyError("请先选择一个来访角色！");
		return;
	}
	var nameValue = $('#addparNode input[name=name]').val();
	if (nameValue.length <= 0) {
		yunNotyError("请输入父节点名称！");
		return;
	}
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../comb/addComb'),
		data: $("#addparNode").serialize(),
		success: function(data) {
			if (data.status == 0) {
				yunNoty(data);
				$('#addparNode')[0].reset();
				if (data.comb) {
					zTree.addNodes(nodes[0], data.comb);
				}
			} else {
				yunNoty(data);
			}
		}
	});
}

//修改父节点
function editNodes() {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	var nodes = zTree.getSelectedNodes();
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../comb/editComb'),
		data: $("#editParNode").serialize(),
		success: function(data) {
			if (data.status == 0) {
				yunNoty(data);
				$('#editParNode')[0].reset();
				$('#editpnModal').modal('hide');
				zTree.reAsyncChildNodes(null, "refresh");
			} else {
				yunNoty(data);
			}
		}
	});
}

$('#editcnModal').on('show.bs.modal', function () {
	$.fn.zTree.init($("#edittreeUser"), editsettingUser, []);
	$.fn.zTree.init($("#edittreeDept"), editsettingDept, []);
	$.fn.zTree.init($("#edittreeSource"), editsettingSource, []);
})

//修改子节点
function editChlidNodes() {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	var nodes = zTree.getSelectedNodes();
	var uValue = $("#editChildNode input[class=elementIdUser]").val();
	var dValue = $("#editChildNode input[class=elementIdDept]").val();
	$("#editChildNode input[name=elementId]").val(uValue + '' + dValue);
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../comb/editFullComb'),
		data: $("#editChildNode").serialize(),
		success: function(data) {
			if (data.status == 0) {
				yunNoty(data);
				$('#editChildNode')[0].reset();
				$('#editcnModal').modal('hide');
				zTree.reAsyncChildNodes(null, "refresh");
			} else {
				yunNoty(data);
			}
		}
	});
}

//添加子节点
function doAddChildNodes() {
	var zTree = $.fn.zTree.getZTreeObj("treeDemo");
	var nodes = zTree.getSelectedNodes();
	if (nodes.length == 0) {
		yunNotyError("请先选择父节点！");
		return;
	}
	var nameValue = $('#addchildNode input[name=name]').val();
	if (nameValue.length <= 0) {
		yunNotyError("请输入节点名称！");
		return;
	}
	var uV = $('#addchildNode input[class=elementIdUser]').val();
	var dV = $('#addchildNode input[class=elementIdDept]').val();
	var sV = $('#addchildNode input[class=elementIdSource]').val();
  //添加接口，elementId将所有的角色主键id拼接，用逗号分隔(uV与dV已有逗号所以直接拼接即可)
	$('#addchildNode input[name=elementId]').val(uV + dV + sV);
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../comb/addFullComb'),
		data: $("#addchildNode").serialize(),
		success: function(data) {
			if (data.status == 0) {
				yunNoty(data);
				$('#addchildNode')[0].reset();
				if (data.comb) {
					zTree.addNodes(nodes[0], data.comb);
				}
				//添加完成清空所有子节点
				if(sV){
					var SourceNOde=$.fn.zTree.getZTreeObj("treeSource");
					SourceNOde.checkAllNodes(false);
				}
				if(uV){
					var UserNOde=$.fn.zTree.getZTreeObj("treeUser");
					UserNOde.checkAllNodes(false);
				}
				if(dV){
					var deptNOde=$.fn.zTree.getZTreeObj("treeDept");
					deptNOde.checkAllNodes(false);
				}
				
			} else {
				yunNoty(data);
			}
		}
	});
}

//显示属性导入
var liTitle = $('#navPill').find('li');
liTitle.eq(0).click(function() {
	liTitle.eq(2).addClass('hide');
});
liTitle.eq(1).click(function() {
	liTitle.eq(2).removeClass('hide');
	$.fn.zTree.init($("#treeDept"), settingDept, []);
	$.fn.zTree.init($("#treeUser"), settingUser, []);
	$.fn.zTree.init($("#treeSource"), settingSource, []);
});

//人员属性导入
//上传
$(function() {
	'use strict';
	$('#exlfileupload').fileupload({
		url: '../../comb/importPersonProperty',
		dataType: 'json',
		change: function(e, data) {
			var flag = true;
			$.each(data.files,
			function(index, file) {
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
			yunNoty(data.result);
			if (data.result.status == 0) {
				$.fn.zTree.init($("#treeUser"), settingUser, []);
			}
		},
		progressall: function(e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('#exlProgress .progress-bar').css('width', progress + '%');
		}
	}).bind('fileuploadstart',
	function(e) {
		$('#exlProgress').show();
	}).bind('fileuploadstop',
	function(e) {
		$('#exlProgress').hide();
	});
})

//部门属性导入
$(function() {
	'use strict';
	$('#exlfileuploadDept').fileupload({
		url: '../../comb/importDeptProperty',
		dataType: 'json',
		change: function(e, data) {
			var flag = true;
			$.each(data.files,
			function(index, file) {
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
			yunNoty(data.result);
			if (data.result.status == 0) {
				$.fn.zTree.init($("#treeDept"), settingDept, []);
			}
		},
		progressall: function(e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10);
			$('#exlProgressDept .progress-bar').css('width', progress + '%');
		}
	}).bind('fileuploadstart',
	function(e) {
		$('#exlProgressDept').show();
	}).bind('fileuploadstop',
	function(e) {
		$('#exlProgressDept').hide();
	});
})
