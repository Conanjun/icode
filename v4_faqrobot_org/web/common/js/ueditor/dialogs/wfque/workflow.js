var range = editor.selection.getRange(),
link = range.collapsed ? editor.queryCommandValue("link") : editor.selection.getStart(),
url,
text = $G('text'),
rangeLink = domUtils.findParentByTagName(range.getCommonAncestor(), 'a', true),
orgText,
link = domUtils.findParentByTagName(link, "a", true);

if (link) {
	//选中了一个a标签
	url = utils.html(link.getAttribute('_href') || link.getAttribute('href', 2));
	if (rangeLink === link && !link.getElementsByTagName('img').length) {
		text.removeAttribute('disabled');
		orgText = text.value = link[browser.ie ? 'innerText' : 'textContent'];//a标签内的文字
	} else {
		text.setAttribute('disabled', 'true');
		text.value = '仅支持选中一个跳转';
	}
} else {
	if (range.collapsed) {
		text.removeAttribute('disabled');
		text.value = '';
	} else {
		text.setAttribute('disabled', 'true');
		text.value = '仅支持选中一个跳转';
	}
}

dialog.onok = function () {
	$('.singleAnsCos').each(function() {
		if ($(this).prop('checked')) {
			qbIndex = $(this).parents('tr').index();
		}
	});
	var obj = {
		'href': 'javascript:void(0);',
		'class': 'welcomeWords',
		'title': '点击查看具体信息',
		'_href': 'javascript:void(0);'
	};
	var textV = '';
	var idV = '';
	if (qbIndex > -1) {
		textV = qbList[qbIndex].Question;
		idV = qbList[qbIndex].Id;
	} else {
		return false;
	}
	obj.question = textV;
	obj.questionid = idV;
	if (orgText && textV != orgText) {
		// 注释掉因此不会变更a标签中的innerText
		// link[browser.ie ? 'innerText': 'textContent'] = obj.textValue = textV;
		// range.selectNode(link).select()
	}
	if (range.collapsed) {
		//没有选中文字
		obj.textValue = textV;
	}
	editor.execCommand('link', utils.clearEmptyAttrs(obj));
	dialog.close();
};

var pageNo2 = 1, //当前页
pageSize2 = 5, //每页数量
isJpage2 = 0, //是否已实例化jpage
groupId = '0',
solutionId = 0,
isLeaf = 1,
answer = '',
question = '',
status = 0,
level = 1,
ids = 0,
queryStr = '?question=',
qbIndex = -1,
qbList = [];

$("#menuContent").hide();
domUtils.on(window, 'load', function () {
	$("#menuContent").hide();
	$.fn.zTree.init($("#treeHide"), hidesetting, []);
	hideMenu();
	enterSubmit($("#search_Que input[name=question]"), sQue);
	//问题、答案搜索 queryStr
	$('.sort2_1').on('click', function () {
		$('.sort2_0').html($(this).text() + '<span class="caret"></span>');
		queryStr = '?question=';
	});
	$('.sort2_2').on('click', function () {
		$('.sort2_0').html($(this).text() + '<span class="caret"></span>');
		queryStr = '?answer=';
	});
	//回答页面搜索
	$('.btnSearch2').on('click', function () {
		answer = $('.search-input-addSrc2').val();
		pageNo2 = 1;
		answer = '';
		sQue();
	});
	// 点击td自动选中input
	$('body').on('click', '.cosInput', function () {
		$(this).parents('tr').find('input').iCheck('check');
	})
});

function filterP(node) {
	return node.isParent == false;
}

var hidesetting = {
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
		url: (localStorage.getItem('Subdomain')||"")+"/classes/listClasses?m=0",
		autoParam: ["id"],
		dataFilter: function (treeId, parentNode, responseData) {
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
	},
	callback: {
		onClick: function (event, treeId, treeNode, clickFlag) {
			var treeObj = $.fn.zTree.getZTreeObj(treeId);
			Nodes = treeObj.getSelectedNodes();
			$("#queSel").html(Nodes[0].Name);
			var array = treeObj.getNodesByFilter(filterP, false, treeNode);
			if (array.length > 0) {
				var groupIdz = "";
				for (var i in array) {
					groupIdz += array[i].Id + ",";
				}
				groupId = groupIdz;
			} else {
				groupId = treeNode.Id;
			}
            $("#menuContent").fadeOut("fast");
            pageNo=1;
			sQue();
		},
		onAsyncSuccess: function (event, treeId, treeNode, msg) {
			var treeObj = $.fn.zTree.getZTreeObj(treeId);
			var array = treeObj.getNodesByFilter(filterP);
			if (array.length > 0) {
				var groupIdz = "";
				for (var i in array) {
					groupIdz += array[i].Id + ",";
				}
				groupId = groupIdz;
			} else {
				groupId = treeNode.Id;
			}
			sQue(1);
		},
		beforeClick: function (treeId, treeNode, clickFlag) {
			if (treeNode.isParent === true) {
				$("#search_Que input[name=isLeaf]").val(0);
			} else {
				$("#search_Que input[name=isLeaf]").val(1);
			}
		}
	}
};

$("#queManualConfirm").click(function () {
	var addFlag = false;
	var id = getSelectedIds_aQue();
	var SolutionId = getSelectedSolutionIds_aQue();
	var targetInput = $("#queManual [name=postQueInput]").eq(QandFIndex);
	if (targetInput.val() === "") {
		addFlag = true;
  }
  if(id){
    targetInput.attr("rel", id);
    targetInput.attr("Srel", SolutionId);
    targetInput.val($("#queDiv #list-tr-" + id).children("td").eq(1).html());
    targetInput.parent().prev().children().toggleClass('btn-primary').toggleClass('btn-white');
    $("#queManualModal").modal("hide");
    if (addFlag) {
      // $("#queManual").append('');
    }
  }else{
      yunNotyError('请选择问题！');
  }
});

function getSelectedIds_aQue() {
	var cboxs = null;
	if ($("#queManualQue").hasClass("active")) {
		cboxs = document.getElementsByName("row_sel1");
	} else if ($("#queManualFlow").hasClass("active")) {
		cboxs = document.getElementsByName("row_sel2");
	}
	if (typeof cboxs == "undefined") {
		return -1;
	}
	var inputvalue = "";
	for (var i = 0; i < cboxs.length; i++) {
		if (cboxs[i].checked === true) {
			inputvalue = cboxs[i].value;
		}
	}
	return inputvalue;
}

function getSelectedSolutionIds_aQue() {
	var cboxs = null;
	if ($("#queManualQue").hasClass("active")) {
		cboxs = document.getElementsByName("row_sel1");
	} else if ($("#queManualFlow").hasClass("active")) {
		cboxs = document.getElementsByName("row_sel2");
	}
	if (typeof cboxs == "undefined") {
		return -1;
	}
	var inputvalue = "";
	for (var i = 0; i < cboxs.length; i++) {
		if (cboxs[i].checked === true) {
			inputvalue = cboxs[i].getAttribute("solutionid");
		}
	}
	return inputvalue;
}

function showMenu() {
	var cityObj = $("#queSel");
	var cityOffset = $("#queSel").offset();
	$("#menuContent").slideDown("fast");
	$("body").bind("mousedown", onBodyDown);
	$("#classTree").slimScroll({
		height: "300px"
	});
}

function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}

function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
		hideMenu();
	}
}

function showQueModal() {
	$("#queManualModal").modal("show");
}

function sQue(pageNo) {
	if (!pageNo)
		pageNo = 1;
	$("#ansList").tableAjaxLoader2(2);
	$.ajax({
		type: "get",
		datatype: "json",
		cache: false,
		url: encodeURI((localStorage.getItem('Subdomain')||"")+"/question/getQueList" + queryStr + answer + $('.search-input-addSrc2').val()),
		data: {
			pageNo: pageNo2,
			pageSize: pageSize2,
			groupId: groupId,
			isLeaf: isLeaf,
			status: status,
			level: level
		},
		success: function (data) {
			if (data.status) {
				Base.gritter(data.message, false);
			} else {
				var html = '';
				if (data.questionList && data.questionList[0]) {
					qbList = data.questionList;
					for (var i = 0; i < data.questionList.length; i++) {
						html += '<tr Id="' + (data.questionList[i].Id || '') + '"  SolutionId="' + (data.questionList[i].SolutionId || '') + '">';
						html += '<td style="text-align: center;"><input class="singleAnsCos" type="radio" name="ansQue"></td>';
						if (data.questionList[i].SolutionType == 2) {
							var link = '/web/knowledge/editFlow.html?questionId=' + data.questionList[i].Id + '&groupId=' + data.questionList[i].GroupId + '&solutionId=' + data.questionList[i].SolutionId;
							html += '<td class="cosInput clickop" data-link="' + link + '" data-isf="1" style="padding-top:15px;">' + (data.questionList[i].Question || '') + '</td>';
						} else {
							link = '/web/knowledge/queDetail.html?id=' + data.questionList[i].Id;
							html += '<td class="cosInput clickop" data-link="' + link + '" data-isf="0" style="padding-top:15px;">' + (data.questionList[i].Question || '') + '</td>';
						}
						html += '<td class="cosInput" style="position:relative;"><div class="minheight1" style="max-width: 300px;">';
						data.questionList[i].ListAnswer.forEach(function (el, i) {
							if (i == 0) {
								html += '<div class="ccca">' + (el.Answer || '') + '</div>';
							} else {
								html += '<div class="ccca" style="display:none;">' + (el.Answer || '') + '</div>';
							}
						});
						if (data.questionList[i].ListAnswer.length > 1) {
							html += '</div><span style="position:absolute;top:10px;right:0;"><i class="fa fa-chevron-up rotog"></span></td>';
						} else {
							html += '</div></td>';
						}
					}
					var options = {
						currentPage: data.currentPage,
						totalPages: data.totlePages ? data.totlePages : 1,
						alignment: 'right',
						onPageClicked: function (event, originalEvent, type, page) {
							pageNo2 = page;
							sQue();
						}
					};
					$('#quepageList').bootstrapPaginator(options);
				} else {
					html += '<td colspan="3" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td>';
					$('#quepageList').empty();
				}
				$('#ansList tbody').empty().append(html);
				$('.timeTip').tooltip();
				icheckInit();
				$('.minheight').each(function () {
					var height = $(this).height;
					if (height > 100) {
						height = 100;
					}
				})
				$('.slimScrollBar').hide();
				$('.rotog').on('click', function () {
					if ($(this).hasClass('fa-chevron-up')) {
						$(this).removeClass('fa-chevron-up').addClass('fa-chevron-down');
						$(this).parent().parent().find('.minheight1').children(':not(:first-child)').show();
					} else {
						$(this).removeClass('fa-chevron-down').addClass('fa-chevron-up');
						$(this).parent().parent().find('.minheight1').children(':not(:first-child)').hide();
					}
				});

			}
		}
	});
}
