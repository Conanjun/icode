//智能推荐手动配置的input序号
var QandFIndex = -1;
var bigID = -1;
var editFlag = false;
function addPortDetail() {
	var dataJSON = {};
	var array = [];
	var temp = {};
	$('.pictip').each(function(){
		temp.pointX = $(this).position().left;
		temp.pointY = $(this).position().top;
		temp.width = $('#portImg').width();
		temp.height = $('#portImg').height();
		//temp.content = $(this).data('q');
		temp.content = $(this).children('span.w').html();
		temp.type = 1;
		temp.direction = ($(this).children('.pictipdot').hasClass('left')) ? 1 : 0;
		array.push(temp);
	});
	dataJSON.chatLinkId = bigID;
	dataJSON.jsonArray = JSON.stringify(array);
	  $.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		url: encodeURI('../../ChatLink/saveThemeImageInfo'),
		data: dataJSON,
		success: function(data) {
		  if (data.status == 0) {
			yunNoty(data);
		  } else {
			yunNoty(data);
		  }
		}
	  });
}

function addQueSearch(){
if($('#queDivNav li').eq(0).hasClass('active')){
	sQue();
}else if($('#queDivNav li').eq(1).hasClass('active')){
	fQue();
}else{
	sQue();fQue();
}
}

$(document).ready(function() {
	$('#portImg').on('click', function(){
		$('#queManualModal').modal('show');
	});
	var ML = 0,
		MR = 0,
		MX = 0,
		MY = 0;
	$('body').on('mousedown', '.pictipdot', function(e){
		e.stopPropagation();
		ML = e.clientX;
		MR = e.clientY;
	});
	$('body').on('mouseup', '.pictipdot', function(e){
		e.stopPropagation();
		var movex = Math.abs(e.clientX - ML);
		var movey = Math.abs(e.clientY - MR);
		if(movex < 3 && movey < 3) {
			$(this).toggleClass('left');
		}
	});
	$(document).on('mousedown.DRAG', '.pictip', function(e) {
		MX = e.clientX;
		MY = e.clientY;
		var self = this;
		$(self).addClass('DR_select');
		var posX = $(this).position().left,// inner左上点相对outer左上点的位置
			posY = $(this).position().top,
			offX = e.offsetX,// 鼠标相对inner内部的位置
			offY = e.offsetY,
			mouseX = e.clientX,// 鼠标位置
			mouseY = e.clientY;
		$(document).on('mousemove.DRAG', function(e) {
			//mouseX = e.clientX;
			//mouseY = e.clientY;

			var diffX = posX + (e.clientX - mouseX),
				diffY = posY + (e.clientY - mouseY),
				maxW = $(window).width() - $('[DR_move]').outerWidth();
				maxH = $(window).height() - $('[DR_move]').outerHeight();

			// 限制范围
			//~ if(diffX <= 0) {
				//~ diffX = 0;
			//~ }
			//~ if(diffX >= maxW) {
				//~ diffX = maxW;
			//~ }
			//~ if(diffY <= 0) {
				//~ diffY = 0;
			//~ }
			//~ if(diffY >= maxH) {
				//~ diffY = maxH;
			//~ }

			$(self).css({'left': diffX, 'top': diffY});
		});
		$(document).on('mouseup.DRAG', function(e) {
			$(document).off('mousemove.DRAG');
			$(document).off('mouseup.DRAG');
			$(self).removeClass('DR_select');
			var movex = Math.abs(e.clientX - MX);
			var movey = Math.abs(e.clientY - MY);
			if(movex < 3 && movey < 3) {
				//修改
				if($(e.target).hasClass('d')) {
				} else {
					editFlag = true;
					QandFIndex = $(self).data('time');
					$('#word').val($(self).children('span.w').html());
					$('#queManualModal').modal('show');
				}
			} else {
				editFlag = false;
			}
		});
	});
	$.fn.zTree.init($("#treeHide"),hidesetting,[]);
	$('#queDivNav a').click(function (e) {
		if($(this).attr('href') == '#queManualQue') {
			sQue();
		} else if($(this).attr('href') == '#queManualFlow') {
			fQue();
		}
	});
  enterSubmit($('#search_Que input[name=question]'),addQueSearch);
  if(getUrlParam('id') != null) {
	  bigID = getUrlParam('id');
	//$('title').html('修改接待入口');
	//$('.breadcrumb').eq(2).html('修改接待入口');
	//$('.page-header').html('修改接待入口');
	//$('ol.breadcrumb').find('li.active').html('修改接待入口');
	
	  $.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		url: encodeURI('../../ChatLink/findChatLinkById?id='+getUrlParam('id')),
		success: function(data) {
		  if (data.status == 0) {
			//yunNoty(data);
			$('#portImg').attr('src', data.chatLink.ThemePicPath);
		  } else {
			yunNoty(data);
		  }
		}
	  });
	  $.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		url: encodeURI('../../ChatLink/getImgInfoByChatLinkId?chatLinkId='+getUrlParam('id')),
		success: function(data) {
		  if (data.status == 0) {
			//yunNoty(data);
			data.chatlinkBackImg.forEach(function(el, i){
				$('#container').append('<div class="pictip" data-q="'+el.Content+'" data-time="'+i+'" style="left: '+el.PointX+'px; top: '+el.PointY+'px;"><div class="pictipdot"></div><span class="w">'+el.Content+'</span><span class="d" title="点击删除"></span></div>');
			});
			$('.pictip .d').off('click').on('click', function(e){
				e.stopPropagation();
				$(this).parent().remove();
			});
		  } else {
			yunNoty(data);
		  }
		}
	  });
  }
});

function filterP(node) {
	return (node.isParent == false);
}
//智能推荐树
var hidesetting = {
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
		url : "../../classes/listClasses?m=0",
		autoParam : ["id"],
		dataFilter : function(treeId, parentNode, responseData) {
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
		onClick: function(event, treeId, treeNode, clickFlag){
			var treeObj = $.fn.zTree.getZTreeObj(treeId);
			Nodes = treeObj.getSelectedNodes();
			$('#queSel').html(Nodes[0].Name);
			var array = treeObj.getNodesByFilter(filterP, false, treeNode);
			if(array.length > 0) {
				var groupId = '';
				for(var i in array) {
					groupId += (array[i].Id) + ',';
				}
				$('.selQueX').val(groupId);
			} else {
				$('.selQueX').val(treeNode.Id);
			}
			$("#menuContent").fadeOut("fast");
			if($('#queManualQue').hasClass('active')) {
				sQue(1);
			}else if($('#queManualFlow').hasClass('active')) {
				fQue(1);
			}
		},
		onAsyncSuccess: function(event, treeId, treeNode, msg) {
			var treeObj = $.fn.zTree.getZTreeObj(treeId);
			var array = treeObj.getNodesByFilter(filterP);
			if(array.length > 0) {
				var groupId = '';
				for(var i in array) {
					groupId += (array[i].Id) + ',';
				}
				$('.selQueX').val(groupId);
			} else {
				$('.selQueX').val(treeNode.Id);
			}
			if($('#queManualQue').hasClass('active')) {
				sQue(1);
			}else if($('#queManualFlow').hasClass('active')) {
				fQue(1);
			}
		},
		beforeClick:function(treeId, treeNode, clickFlag) {
    	//return !treeNode.isParent;//当是父节点 返回false 不让选取
    	if(treeNode.isParent===true){
    		$('#search_Que input[name=isLeaf]').val(0);
    	}else{
    		$('#search_Que input[name=isLeaf]').val(1);
    	}
    }
	}
};

var selQ = '';
/**
* 手动设置智能推荐确定
*/
$('#queManualConfirm').click(function() {
	if($('#word').val() == '') {
		yunNotyError('请输入文字链接！');
		return false;
	}
	var id = getSelectedIds_aQue();
	var SolutionId = getSelectedSolutionIds_aQue();
	var targetInput = $('.pictip[data-time='+QandFIndex+']');
	$('#queManualModal').modal('hide');
	if(!editFlag) {
		$('#container').append('<div class="pictip" data-q="'+selQ+'" data-time="'+Date.now()+'"><div class="pictipdot"></div><span class="w">'+$('#word').val()+'</span><span class="d" title="点击删除"></span></div>');
	} else {
		targetInput.data('q', selQ);
		targetInput.children('span.w').html($('#word').val());
		editFlag = false;
	}
	$('.pictip .d').off('click').on('click', function(e){
		e.stopPropagation();
		$(this).parent().remove();
	});
});

/**
* 获取智能推荐选中问题的Id
* @param {null}
* @return {Integer} 选中的Id
*/
function getSelectedIds_aQue() {
	var cboxs = null;
	if($('#queManualQue').hasClass('active')){
		cboxs = document.getElementsByName('row_sel1');
	}
	else if($('#queManualFlow').hasClass('active')){
		cboxs = document.getElementsByName('row_sel2');
	}
	if(typeof cboxs=="undefined"){
		return -1;
	}
	var inputvalue="";
	for(var i=0;i<cboxs.length;i++){
		if(cboxs[i].checked===true){
			inputvalue=cboxs[i].value;
		}
	}
	return inputvalue;
}
/**
* 获取智能推荐选中流程的Id
* @param {null}
* @return {Integer} 选中的Id
*/
function getSelectedSolutionIds_aQue() {
	var cboxs = null;
	if($('#queManualQue').hasClass('active')){
		cboxs = document.getElementsByName('row_sel1');
	}
	else if($('#queManualFlow').hasClass('active')){
		cboxs = document.getElementsByName('row_sel2');
	}
	if(typeof cboxs=="undefined"){
		return -1;
	}
	var inputvalue="";
	for(var i=0;i<cboxs.length;i++){
		if(cboxs[i].checked===true){
			inputvalue=cboxs[i].getAttribute('solutionid');
			selQ=cboxs[i].getAttribute('q');
		}
	}
	return inputvalue;
}

//智能推荐模态窗中的树
function showMenu() {
	var cityObj = $("#queSel");
	var cityOffset = $("#queSel").offset();
	$("#menuContent").slideDown("fast");
	$("body").bind("mousedown", onBodyDown);
	$('#classTree').slimScroll({
		height: '300px'
	});
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}

$('#queManualModal').on('show.bs.modal', function () {
	//
	hideMenu();
});

//智能推荐问题模态窗列表
function sQue(pageNo){
	if(!pageNo)pageNo=1;
	$('#ansList').tableAjaxLoader2(2);
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../question/getQueListByMode?pageSize=8&pageNo='+pageNo+'&solutionType=1'),
		data:$("#search_Que").serialize(),
		success:
		function(data){
			if(data.status===0){
				if(data.questionList.length>0){
					var html = "";
					var existIds=[];
					$('#queManual').find('input[name=postQueInput]').each(function(){
						existIds.push($(this).attr('rel')*1);
					});
					for(var i=0;i<data.questionList.length;i++){
						if($.inArray(data.questionList[i].Id, existIds)>=0){
  						html += '<tr id="list-tr-'+data.questionList[i].Id+'">';
  						html += '<td><input disabled="" type="radio" name="row_sel1" value="'+data.questionList[i].Id+'" solutionId="'+data.questionList[i].SolutionId+'"></td>';
  						if(data.questionList[i].AnswerStatus==-4){
  							html += '<td class="dueTd">'+data.questionList[i].Question+'<a class="btn btn-xs btn-danger m-l-5">已过期</a></td>';
  						}else{
  							html += '<td style="word-break: break-all;">'+data.questionList[i].Question+'</td>';
  						}
  						html += '</tr>';
						} else {
  						html += '<tr id="list-tr-'+data.questionList[i].Id+'">';
  						html += '<td><input type="radio" name="row_sel1" value="'+data.questionList[i].Id+'" solutionId="'+data.questionList[i].SolutionId+'" q="'+data.questionList[i].Question+'"></td>';
  						if(data.questionList[i].AnswerStatus==-4){
  							html += '<td class="dueTd">'+data.questionList[i].Question+'<a class="btn btn-xs btn-danger m-l-5">已过期</a></td>';
  						}else{
  							html += '<td style="word-break: break-all;">'+data.questionList[i].Question+'</td>';
  						}
  						html += '</tr>';
            }
					}
					$('#ansList').find('tbody').html(html);
					// $('#ansList td').click(function() {
						// $(this).parent().find('input[name=row_sel1]').attr("checked",'true');
					// });
					icheckInit();
					$('#timePicker').on('ifChecked', function() {
						$('#dateTime').show();
					}).on('ifUnchecked', function() {
						$('#dateTime').hide();
						$('#ansRuleForm [name=StartTime]').val('');
						$('#ansRuleForm [name=EndTime]').val('');
					});
					$('#ansList td').click(function() {
						$(this).parent().find('input[name=row_sel1]:enabled').iCheck('check');
					});
					//下面开始处理分页
					var options = {
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function (event, originalEvent, type, page) {
							sQue(page);
						}
					};
					setPage('quepageList',options);
				}else{
					if($('#search_Que input[name=question]').val() !==''){
						$('#ansList').find('tbody').html('<tr><td colspan=\"2\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;搜索结果为空！</td></tr>');
					} else {
						$('#ansList').find('tbody').html('<tr><td colspan=\"2\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
					}
					$('#quepageList').html('');
				}
			}else{
				yunNoty(data);
			}
		}
	});
}

//智能推荐流程模态窗列表
function fQue(pageNo){
	if(!pageNo)pageNo=1;
	$('#flowList').tableAjaxLoader2(2);
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../question/getQueListByMode?pageSize=8&pageNo='+pageNo+'&solutionType=2'),
		data:$("#search_Que").serialize(),
		success:
		function(data){
			if(data.status===0){
				if(data.questionList.length>0){
					var html = "";
					var existIds=[];
					$('#queManual').find('input[name=postQueInput]').each(function(){
						existIds.push($(this).attr('rel')*1);
					});
					for(var i=0;i<data.questionList.length;i++){
						if($.inArray(data.questionList[i].Id, existIds)>=0){
  						html += '<tr id="list-tr-'+data.questionList[i].Id+'">';
  						html += '<td><input disabled="" type="radio" name="row_sel2" value="'+data.questionList[i].Id+'" solutionId="'+data.questionList[i].SolutionId+'"></td>';
  						if(data.questionList[i].AnswerStatus==-4){
  							html += '<td class="dueTd">'+data.questionList[i].Question+'<a class="btn btn-xs btn-danger m-l-5">已过期</a></td>';
  						}else{
  							html += '<td style="word-break: break-all;">'+data.questionList[i].Question+'</td>';
  						}
  						html += '</tr>';
						} else {
  						html += '<tr id="list-tr-'+data.questionList[i].Id+'">';
  						html += '<td><input type="radio" name="row_sel2" value="'+data.questionList[i].Id+'" solutionId="'+data.questionList[i].SolutionId+'" q="'+data.questionList[i].Question+'"></td>';
  						if(data.questionList[i].AnswerStatus==-4){
  							html += '<td class="dueTd">'+data.questionList[i].Question+'<a class="btn btn-xs btn-danger m-l-5">已过期</a></td>';
  						}else{
  							html += '<td style="word-break: break-all;">'+data.questionList[i].Question+'</td>';
  						}
  						html += '</tr>';
            }
					}
					$('#flowList').find('tbody').html(html);
					// $('#flowList td').click(function() {
						// $(this).parent().find('input[name=row_sel2]').attr("checked",'true');
					// });
					icheckInit();
					$('#timePicker').on('ifChecked', function() {
						$('#dateTime').show();
					}).on('ifUnchecked', function() {
						$('#dateTime').hide();
						$('#ansRuleForm [name=StartTime]').val('');
						$('#ansRuleForm [name=EndTime]').val('');
					});
					$('#flowList td').click(function() {
						$(this).parent().find('input[name=row_sel2]:enabled').iCheck('check');
					});
					//下面开始处理分页
					var options = {
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function (event, originalEvent, type, page) {
							fQue(page);
						}
					};
					setPage('flowpageList',options);
				}else{
					if($('#search_Que input[name=question]').val() !==''){
						$('#flowList').find('tbody').html('<tr><td colspan=\"2\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;搜索结果为空！</td></tr>');}
					else{
						$('#flowList').find('tbody').html('<tr><td colspan=\"2\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
					}
					$('#flowpageList').html('');
				}
			}else{
				yunNoty(data);
			}
		}
	});
}
