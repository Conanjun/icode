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
		url: "../../classes/pageListClasses?mode=0&pageSize=1000",
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
				// listBrunch(1);
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
		data:'&id='+classId+'&className='+className+'&pId='+targetNode.Id,
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
		data:'&id='+classId+'&className='+className+'&pId='+targetNode.Id+'&type='+type,
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

var labelList=function(){     //已有标签列表
		$.post("/label/findAllLabels",{
		},function(data){
			if(data.status==0){
				var renderTo=$("#labelTxt");
				$("#labelTxt").html("");
				if(data.list.length>0){
					$(data.list).each(function(i,t){
						var item=$("<div class='item'></div>").appendTo(renderTo);
						var checkbDiv=$('<div class="checkbDiv"></div>').appendTo(item);
						var checkb=$('<input type="checkbox" class="checkb"/>').appendTo(checkbDiv);
						var label=$("<div class='itemTxt'></div>").text(t.LabelName).appendTo(item);
						checkb.attr("value",t.Id);
						item.attr("value",t.Id);
					});
					icheckInit();
					$(".itemTxt").each(function(){
						$(this).click(function(){
							var chec=$(this).prev().find(".checkb")
							if($(chec).prop("checked")){
								$(chec).iCheck("uncheck");
							}
							else{
								$(chec).iCheck("check");
							}
						});
					});
					
					var labelIds=$('.editLabels em').text();
					var labelIdsList=new Array();
					labelIdsList=labelIds.split(",");
					
					$(".itemTxt").each(function(){
						if($.inArray($(this).text(),labelIdsList)>=0){
							$(this).prev().find(".checkb").iCheck("check");
						}
					});
					
				}
				else{
					html += '<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
					$('#labelTxt').empty().append(html);
				}
			}
		});
	}
	
	function setScroll(){  //已有标签滚动条
			    $("#labelTxt").slimScroll({
			        height: "400px",
			        /*alwaysVisible: true,*/
			    });
			}
			setScroll();
			$(window).on("resize",setScroll);

	$("#selLabelBtn").click(function(){   //确定选择标签
		var checkb=$("#labelTxt").find("input[type='checkbox']");
		var id="";
		$(checkb).each(function(){
			if($(this).prop("checked")){
				id+=$(this).attr("value")+",";
			}
		});
		var groupId=$(this).attr("value");
		$.post("/question/editLabelByGroupId",{
			groupId:groupId,
			labelIds:id
		},function(json){
			if(json.status==0){
				yunNoty(json);
				$("#labelClassModel").modal("hide");
			}
			else{
				yunNotyError(json.message);
			}
		});
		
		
	});		
	

	$('#labelClassModel').on('show.bs.modal', function () {
			labelList();
		});

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
			
			//添加标签
			var addLabel="<span id='addLabel_" + treeNode.Id + "' title='新增标签' class='button addLabel'></span>";
			Obj.append(addLabel);
			var btnAddLabel = $("#addLabel_" + treeNode.Id);
			if (btnAddLabel) btnAddLabel.bind("click",
			function() {
				$('#labelClassModel').modal('show');
				$('#selLabelBtn').attr("value",treeNode.Id);
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
		
		
		//添加标签
		var addLabel="<span id='addLabel_" + treeNode.Id + "' title='新增标签' class='button addLabel'></span>";
		Obj.find('.edit').before(addLabel);
		var btnAddLabel = $("#addLabel_" + treeNode.Id);
		if (btnAddLabel) btnAddLabel.bind("click",
		function() {
			$('#labelClassModel').modal('show');
			$('#selLabelBtn').attr("value",treeNode.Id);
		});
	}

	if (treeNode.isParent == false) {
		if ($("#diyBtn_" + treeNode.Id).length > 0) return;
		var editStr = "<span id='diyBtn_" + treeNode.Id + "' title='清空该分类下问题' class='button clearIcon'></span>";
		Obj.find('.edit').after(editStr);
		var btn = $('#diyBtn_' + treeNode.Id);
		if (btn) btn.bind('click',
			function() {
				// mark
				$.ajax({
					type: 'get',
					datatype: 'json',
					cache: false,
					//不从缓存中去数据
					url: encodeURI('../../question/getQueList?pageSize=10&pageNo=1&groupId='+treeNode.Id+'&isLeaf=1'),
					// data: $('.branchSearch').serialize(),
					success: function(data) {
						if(data.total){
							$('#clearModal').modal('show');
							$('#clearModal .gId').val(treeNode.Id);
						}else{
							yunNotyError("该分类下没有问题！")
						}
					}
				})
			});
	}

	if ($("#outBtn_" + treeNode.Id).length > 0) return;
	var editOutStr = "<span id='outBtn_" + treeNode.Id + "' title='导出该分类下问题' class='button outIcon'></span><span id='outflowBtn_" + treeNode.Id + "' title='导出该分类下流程' class='button outflowIcon'></span>";
	Obj.find('.edit').after(editOutStr);
	var btnOut = $("#outBtn_" + treeNode.Id);
	if (btnOut) btnOut.bind("click",
	function() {
		$('#ExportQueModal').modal('show');
		$('#ExportQueModal .roleId').val(treeNode.Id);
		return false;
	});
	var btnflowOut = $("#outflowBtn_" + treeNode.Id);
	if (btnflowOut) btnflowOut.bind("click",
	function() {
		$('#ExportFlowModal').modal('show');
		$('#ExportFlowModal input[name=groupId]').val(treeNode.Id);
		return false;
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
	$("#addLabel_" + treeNode.Id).unbind().remove();
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
    if(responseData.list) {
      responseData.list.push({
        Id: 0,
        ParentId: 0,
        Name: "全部分类",
        open: true
      });
    } else {
      return [{
        Id: 0,
        ParentId: 0,
        Name: "全部分类",
        open: true
      }];
    }
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
		url: encodeURI('../../classes/editClassesInfo'),
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

//添加主干词表单提交
function doAddBrunch() {
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../brunchWords/editBrunchWordsInfo'),
		//data:encodeURI(tempcontent),
		data: $("#addMainWordForm").serialize(),
		success: function(data) {
			if (data.status == 0) {
				yunNoty(data);
				$('#addMainWordModal').modal('hide');
				var page = $('#pageList .active a').html();
				listBrunch(page);
			} else {
				yunNoty(data);
			}
		}
	});
}

//修改主干词表单提交
function saveBrunch() {
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../brunchWords/editBrunchWordsInfo'),
		data: $("#editMainWordForm").serialize(),
		success: function(data) {
			if (data.status == 0) {
				yunNoty(data);
				$('#editMainWordModal').modal('hide');
				var page = $('#pageList .active a').html();
				listBrunch(page);
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

//确认导出问题
$('#confrimOutQue').click(function() {
	var roleId = $('#ExportQueModal .roleId').val();
	$('#ExportQueModal').modal('hide');
	location.href = "../../QuestionExcel/exportTxtAnsQue?groupIds=" + roleId;
});

//确认导出流程
$('#confrimOutFlow').click(function() {
	var groupId = $('#ExportFlowModal input[name=groupId]').val();
	$('#ExportFlowModal').modal('hide');
	location.href = "../../FlowExcel/exportFlowSimilars?groupIds=" + groupId;
});

//确认删除分类
$('#confrimdel').click(function() {
	var classId = $('#DelClassModal input[name=classId]').val();
	var treeObj = $.fn.zTree.getZTreeObj("treeClasses");
	var node = treeObj.getNodeByTId(classId);
	treeObj.removeNode(node, true);
	$('#DelClassModal').modal('hide');
});

//列出主干词表格
function listBrunch(pageNo) {
	//不勾选全选
	$('.select_rows').iCheck('uncheck');
	if (!pageNo) pageNo = 1;
	$('#brunchList').tableAjaxLoader2(5);
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../brunchWords/listBrunchWords?pageSize=' + 10 + '&pageNo=' + pageNo),
		data: $('.branchSearch').serialize(),
		success: function(data) {
			if (data.status == 0) {
				if(data.list==undefined){
					$('#brunchList').find('tbody').html('<tr><td colspan=\"5\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
					$('#pageList').html('');
					return;
				}
				if (data.list.length > 0) {
					var html = "";
					for (var i = 0; i < data.list.length; i++) {
						html += "<tr id=\"list-tr-" + data.list[i].Id + "\">";
						html += "<td><input type=\"checkbox\" name=\"ckb\" class=\"select_row\" value=\"" + data.list[i].Id + "\" /></td>";
						html += "<td>" + data.list[i].Words + "</td>";
						if (data.list[i].Level == null) {
							html += "<td>&nbsp;</td>";
						} else if (data.list[i].Level == '0') {
							html += "<td>高级</td>";
						} else if (data.list[i].Level == '1') {
							html += "<td>一般</td>";
						}
						html += "<td>" + data.list[i].AddUserName + "</td>";
						html += "<td><a href=\"javascript:;\" class=\"sepV_a\" title=\"Edit\" onclick=\"repBrunch(this)\" rel=\"" + data.list[i].GroupId + "\" srel=\"" + data.list[i].Level + "\"><i class=\"glyphicon glyphicon-pencil\"></i></a>&nbsp;&nbsp;";
						html += "<a href=\"javascript:;\" class=\"m-del\" rel=\"" + data.list[i].Id + "\"><i class=\"glyphicon glyphicon-trash\" ></i></a></td>";
						html += "</tr>";
					}
					$('#brunchList').find('tbody').html(html);
					$('.m-del').on('click',function(){
						delById(this,'../../brunchWords/deleteBrunchWordsById',listBrunch,'pageList');
					});
					//不勾选全选
					$('.select_rows').iCheck('uncheck');
					$('.select_row').on('ifUnchecked',
					function() {
						$('.select_rows').iCheck('uncheck');
					});
					//初始化ickeck
					$('input.select_row').iCheck({
						checkboxClass: 'icheckbox_flat-blue',
						radioClass: 'iradio_flat-blue',
						cursor: true
					});
					//下面开始处理分页
					var options = {
						data: [data, 'list', 'total'],
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function(event, originalEvent, type, page) {
							listBrunch(page);
						}
					};
					setPage('pageList', options);
				} else {
					$('#brunchList').find('tbody').html('<tr><td colspan=\"5\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
					$('#pageList').html('');
				}
			} else {
				yunNoty(data);
			}
		}
	});
}

//填写修改主干词表单
function repBrunch(obj) {
	var getid = $(obj).parents('tr').children('td').find('input[name=ckb]').val();
	$('#editWords').val($(obj).parents('tr').children('td').eq(1).html());
	$('#hideId').val(getid);
	$('#editMainWordForm input[name=groupId]').val($(obj).attr('rel'));
	$('#editMainWordForm input[name=level]').val($(obj).attr('srel'));
	$("#editMainWordModal").modal('show');
}

//确认导入
function confirmLoad(obj){
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../classes/getStatus'),
		success:
		function(data){
			if(data.ProgressToKnowledge==100){
				if(data.ErrorMsg != '') {
					yunNoty({status:1,message:data.ErrorMsg});
				} else {
					yunNoty({status:0,message:'导入成功！'});
				}
				clearInterval(INTERVAL);
				setTimeout(function(){
					window.location.reload();
				},2000)
				listBrunch();
			}else{
				yunNoty({status:0,message:'导入进度：'+data.ProgressToKnowledge+'%'});
			}
		}
	});
}

var INTERVAL;
$(document).ready(function() {
	// 新手引导(需要引导的页面的code即为页面名称)
	Base.request({
        url: 'tipHelp/add',
        params: {
            code: 'classify',
            webId: -1,
        },
        callback: function(data) {
            if(data.status) {//!=0 旧

            }else {//=0 新
				Base.request({
					url: 'tipHelp/check',
					params: {
						code: 'classify',
						webId: -1,
					},
					callback: function(data) {
						if(data.status) {//旧
						}else {//新
							introJs().setOptions({
								'prevLabel': '上一步',
								'nextLabel': '下一步',
								'skipLabel': '　',
								'doneLabel': '　',
								'showBullets': false,//隐藏直接跳转按钮(避免onchangebug)
							}).start().onexit(function() {//非常规退出
							}).oncomplete(function() {//正常完成
							}).onchange(function(obj) {//已完成当前一步
								var curNum = parseInt($(obj).attr('data-step').match(/\d+/)[0]);//当前的下标

								$('.tipStep'+ (curNum-1)).hide();//隐藏前一个
								$('.tipStep'+ (curNum+1)).hide();//隐藏后一个
								$(obj).show();//显示当前
							});
						}
					},
				});
            }
        },
    });


	App.init();
	icheckBindInit();
	//上传
	$(function () {
		'use strict';
		$('#exlfileupload').fileupload({
			url: '../../classes/importClasses',
			dataType: 'json',
      add: function (e, data) {
        var roleIds = '';
        if($('#divnotshow2').css('display') != 'none') {
          $('input[name=somerole2]').each(function(){
            if($(this).prop('checked')) {
              roleIds += $(this).val() + ',';
            }
          });
          if(roleIds == '') {
            yunNotyError("请至少勾选一个分类所属角色！");
            return false;
          } else {
            data.url = '/classes/importClasses?roleIds='+roleIds.substr(0,roleIds.length-1);
            data.submit();
          }
        }
        data.submit();
      },
			change: function (e, data) {
				var flag=true;
				$.each(data.files, function (index, file) {
					var str=file.name.substring(file.name.lastIndexOf(".")+1);
					if(str== "xls" || str== "xlsx"){
						flag=true;
					}else{
						flag=false;
						yunNotyError("请上传xls或xlsx格式的文件！");
					}
				});
				return flag;

			},
			done: function (e, data) {
				if(data.result.status==0){
					yunNoty(data.result);
					INTERVAL = setInterval(confirmLoad, 5000);
				}
				else{
					yunNoty(data.result);
					$('.fileinput-button').css('display','inline-block');
					$('.fileUpLoadingSign').css('display','none');
				}
			},
			progressall: function (e, data) {
				var progress = parseInt(data.loaded / data.total * 100, 10);
				$('#exlProgress .progress-bar').css(
					'width',
					progress + '%'
				);
			}
		}).bind('fileuploadstart', function (e) {
			$('.fileinput-button').css('display','none');
			$('.fileUpLoadingSign').css('display','inline-block');
			$('#exlProgress').show();
		}).bind('fileuploadstop', function (e) {
			$('.fileinput-button').css('display','inline-block');
			$('.fileUpLoadingSign').css('display','none');
			$('#exlProgress').hide();
			$('#exlProgress .progress-bar').css('width', '0%');
		});
	});
	//角色ztree滚动条
	$('.treeDivLeft').slimScroll({
		height: '600px'
	});
	$.fn.zTree.init($("#treeClasses"), setting, []);
	$('#addMainWordForm').validate({
		submitHandler: doAddBrunch
	});
	$('#editMainWordForm').validate({
		submitHandler: saveBrunch
	});
	$('#addClassForm').validate({
		submitHandler: doAddClasses
	});
	$('#editClassForm').validate({
		submitHandler: editClassify
	});
	//生效时间
	$(".form_datetime").datetimepicker({
		language: "zh-CN",
		format: "yyyy-mm-dd hh:ii",
		autoclose: true,
		todayBtn: true,
		minuteStep: 10,
		startDate: new Date(),
		initialDate: new Date()
	});
	$('#tlmePicker').iCheck('uncheck');
	//清空表单
	$('#addMainWordModal').on('hidden.bs.modal', function () {
		$('#addMainWordForm input[name=words]').val('');
		$('#tlmePicker').iCheck('uncheck');
		$('#DelClassModal').modal('hide');
	})
	$('#editMainWordModal').on('hidden.bs.modal', function () {
		$('#editMainWordModal input').val('');
	})
	$('#addClassModal').on('hidden.bs.modal', function () {
		$('#addClassForm input').val('');
	})
	$('#editClassModal').on('hidden.bs.modal', function () {
		$("#editClassForm input").val('');
	})

	listBrunch();

	//控制添加主干词表单datetimepicker的显示
	$('#tlmePicker').on('ifChecked', function() {
		$('#dateTimeSelT').show();
		$('#addMainWordForm [name=StartTime]').val('');
		$('#addMainWordForm [name=EndTime]').val('');
	}).on('ifUnchecked', function() {
		$('#dateTimeSelT').hide();
	});
  $.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../User/findRolesByUserId'),
		success:
		function(data){
			if(data.level){
        for(var i=0; i < data.list.length; i++) {
          $('#divnotrole').append('<input name="somerole" value="'+data.list[i].Id+'" id="bbb'+data.list[i].Id+'" type="checkbox"><label for="bbb'+data.list[i].Id+'" style="display: inline-block;padding:0 5px;margin-bottom:0">'+data.list[i].Name+'</label>');
          $('#divnotrole2').append('<input name="somerole2" value="'+data.list[i].Id+'" id="bbb2'+data.list[i].Id+'" type="checkbox"><label for="bbb2'+data.list[i].Id+'" style="display: inline-block;padding:0 5px;margin-bottom:0">'+data.list[i].Name+'</label>');
        }
        $('#divnotshow').show();
        $('#divnotshow2').show();
			}
		}
  });
});
