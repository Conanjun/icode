//智能推荐手动配置的input序号
var QandFIndex = -1;
function addPort() {
	var url = '../../ChatLink/addChatLinkConfig';
	var dataJSON = {};
	if(getUrlParam('id') != null) {
		url = '../../ChatLink/editChatLinkConfig';
		dataJSON.id = getUrlParam('id');
	}
	if($('#portImg').attr('src') != '') {
		dataJSON.themePicPath = $('#portImg').attr('src');
	} else {
		//yunNotyError('请上传知识集图片');
	}
	dataJSON.themeName = $('input[name=themeName]').val();
	dataJSON.helloWord = $('input[name=helloWord]').val();
	dataJSON.unknownWord = $('input[name=unknownWord]').val();
	var pqids = '';
	$('[name=postQueInput]').each(function(){
		if($(this).attr('rel')) {
			pqids += $(this).attr('rel') + ',';
		}
	});
	if(pqids != '') {
		dataJSON.guideQueIds = pqids;
	}
	dataJSON.picUrl = $('#kfImg').attr('src');
	if(dataJSON.picUrl == 'images/kfimg.png') {
		dataJSON.picUrl = window.location.protocol + "//" + (window.location.host + localStorage.getItem('Subdomain')||"") + '/web/temp/images/kfimg.png';
	}
	dataJSON.kfUrl = $('#kfImg').attr('src');
	if(dataJSON.kfUrl == 'images/kfimg.png') {
		dataJSON.kfUrl = window.location.protocol + "//" + (window.location.host + localStorage.getItem('Subdomain')||"") + '/web/temp/images/kfimg.png';
	}
	dataJSON.khUrl = $('#khImg').attr('src');
	if(dataJSON.khUrl == 'images/khimg.png') {
		dataJSON.khUrl = window.location.protocol + "//" + (window.location.host + localStorage.getItem('Subdomain')||"") + '/web/temp/images/khimg.png';
	}
	var labels = '';
	$('.labelDiv').each(function(){
		if($(this).children().attr('rel') && $(this).children().hasClass('label-primary')) {
			labels += $(this).children().attr('rel') + ',';
		}
	});
	if(labels != '') {
		labels = labels.substr(0, labels.length-1);
		dataJSON.labelIds = labels;
	}
	dataJSON.groupIds = $('#queClassId').val();
	
	  $.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		url: encodeURI(url),
		data: dataJSON,
		success: function(data) {
		  if (data.status == 0) {
			  //var url = '/web/temp/addPortDetail.html';
			  //yunNoty(data);
			  var ifT = iframeTab.init({iframeBox: ''});
			  var href = '';
			  yunNoty(data,function(){
				  var ifT = iframeTab.init({iframeBox: ''});
				  ifT.closeActIframe('',parent.$('#tabHeader li[data-num="'+getUrlParam('tmpNum')+'"]').attr('data-tab'));
			  });
			/*var ifb = iframeTab.init({
				iframeBox: ''
			});
			ifb.closeActIframe();
			return;
			  var url = '/web/temp/portList.html';
			  if(getUrlParam('id') != null){
				if(window.top.location.href != window.location.href) {
					$('body').append('<a href="'+url+'?id='+getUrlParam('id')+'" data-num="0" data-name="知识集文字链接" style="display:none;" id="g6">知识集文字链接</a>');
					iframeTab.init({
						iframeBox: ''
					});
					$('#g6').trigger('click');
				} else {
					location.href=url+'?id='+getUrlParam('id');
				}
			  } else {
				if(window.top.location.href != window.location.href) {
					$('body').append('<a href="'+url+'" data-num="0" data-name="知识集文字链接" style="display:none;" id="g6">知识集文字链接</a>');
					iframeTab.init({
						iframeBox: ''
					});
					$('#g6').trigger('click');
				} else {
					location.href=url;
				}
			  }*/
		  } else {
			yunNoty(data);
		  }
		}
	  });
}
$(document).ready(function() {
	$('#portAddForm').validate({
		rules:{
			themeName:{
				required:true
			},
			helloWord:{
				required:true
			},
			unknownWord:{
				required:true
			}
		},
		messages:{
			themeName:{
				required:"请输入知识集名称！"
			},
			helloWord:{
				required:"请输入欢迎语！"
			},
			unknownWord:{
				required:"请输入未知说辞！"
			}
		},
		submitHandler: addPort
	});
	$('#labelDiv').on('click', '.label', function(){
		if($(this).hasClass('label-default')){
		$(this).removeClass('label-default').addClass('label-primary');
		} else {
		$(this).removeClass('label-primary').addClass('label-default');
		}
	});
	//选取分类
	$('#queClassify').on('click', function() {
		$('#QuestionClassModel').modal('show');
	});
	$('#QuestionClassModel').on('show.bs.modal', function () {
		$.fn.zTree.init($("#treeQueClass"),classsetting,[]);
	});
	$('#QuestionClassModel').on('hide.bs.modal', function () {
		$('#QuestionClassModel [name=treeName]').val('');
		$('#QuestionClassModel [name=treeId]').val('');
	});
	$('#selClassBtn').on('click', function() {
		$('#queClassify').val($('#QuestionClassModel [name=treeName]').val());
		$('#queClassId').val($('#QuestionClassModel [name=treeId]').val());
		$('#QuestionClassModel').modal('hide');
	});
	//图片上传
  $('#kfImgUpload').fileupload({
  	url: '../../material/jQueryFileUpload?type=1&materialType=1',
  	dataType: 'json',
  	change: function (e, data) {
  		var flag=true;
  		$.each(data.files, function (index, file) {
  			var str=file.name.substring(file.name.lastIndexOf(".")+1);
        str = str.toLowerCase();
  			if(str== "jpeg" || str== "jpg" || str== "png" || str=="bmp" || str=="gif" ){
  				flag=true;
  			}else{
  				flag=false;
  				yunNotyError("上传文件类型错误，支持以jpeg、jpg、png、bmp、gif结尾的格式文件！");
  			}
  		});
  		return flag;
  	},
  	done: function (e, data) {
  		$.each(data.result.files, function (index, file) {
  			if(file.error != undefined && file.error != ''){
  				yunNoty({
            status: 1,
            message: file.error
          });
          return;
  			}else{
  				$('#kfImg').attr('src',file.url);
  			}
  		});
  	}
  }).bind('fileuploadstart', function (e) {
  	$('#kfImgBtn').css('display','none');
  	$('#kfImgInfo').css('display','inline-block');
  }).bind('fileuploadstop', function (e) {
  	$('#kfImgBtn').css('display','inline-block');
  	$('#kfImgInfo').css('display','none');
  });
  $('#khImgUpload').fileupload({
  	url: '../../material/jQueryFileUpload?type=1&materialType=1',
  	dataType: 'json',
  	change: function (e, data) {
  		var flag=true;
  		$.each(data.files, function (index, file) {
  			var str=file.name.substring(file.name.lastIndexOf(".")+1);
        str = str.toLowerCase();
  			if(str== "jpeg" || str== "jpg" || str== "png" || str=="bmp" || str=="gif" ){
  				flag=true;
  			}else{
  				flag=false;
  				yunNotyError("上传文件类型错误，支持以jpeg、jpg、png、bmp、gif结尾的格式文件！");
  			}
  		});
  		return flag;
  	},
  	done: function (e, data) {
  		$.each(data.result.files, function (index, file) {
  			if(file.error != undefined && file.error != ''){
  				yunNoty({
            status: 1,
            message: file.error
          });
          return;
  			}else{
  				$('#khImg').attr('src',file.url);
  			}
  		});
  	}
  }).bind('fileuploadstart', function (e) {
  	$('#khImgBtn').css('display','none');
  	$('#khImgInfo').css('display','inline-block');
  }).bind('fileuploadstop', function (e) {
  	$('#khImgBtn').css('display','inline-block');
  	$('#khImgInfo').css('display','none');
  });
  $('#portImgUpload').fileupload({
  	url: '../../material/jQueryFileUpload?type=1&materialType=1',
  	dataType: 'json',
  	change: function (e, data) {
  		var flag=true;
  		$.each(data.files, function (index, file) {
  			var str=file.name.substring(file.name.lastIndexOf(".")+1);
        str = str.toLowerCase();
  			if(str== "jpeg" || str== "jpg" || str== "png" || str=="bmp" || str=="gif" ){
  				flag=true;
  			}else{
  				flag=false;
  				yunNotyError("上传文件类型错误，支持以jpeg、jpg、png、bmp、gif结尾的格式文件！");
  			}
  		});
  		return flag;
  	},
  	done: function (e, data) {
  		$.each(data.result.files, function (index, file) {
  			if(file.error != undefined && file.error != ''){
  				yunNoty({
            status: 1,
            message: file.error
          });
          return;
  			}else{
  				$('#portImg').attr('src',file.url);
  			}
  		});
  	}
  }).bind('fileuploadstart', function (e) {
  	$('#portImgBtn').css('display','none');
  	$('#portImgInfo').css('display','inline-block');
  }).bind('fileuploadstop', function (e) {
  	$('#portImgBtn').css('display','inline-block');
  	$('#portImgInfo').css('display','none');
  });
  //智能推荐列表
	$('#queManual').on('click', 'a[name=delpostInput]', function() {
		if($('#queManual a[name=delpostInput]').size() > 1) {
			$(this).parent().parent().remove();
		} else {
            $('#queManual [name=postQueInput]').removeAttr('rel');
            $('#queManual [name=postQueInput]').removeAttr('srel');
			$('#queManual [name=postQueInput]').val('');
		}
	});
	$('#queManual').on('click', '[name=postQueInput]', function() {
		QandFIndex = $(this).parent().parent().index();
		showQueModal();
	});
	$('#queManual').on('click', 'a[name=addpostInput]', function() {
		if($('#queManual a[name=addpostInput]').size() < 5) {
			$('#queManual').append('<div class="QueContainer"><div class="form-group col-md-10"><input class="form-control" type="text" readOnly style="cursor:pointer;" placeholder="请选择推荐的问题" name="postQueInput"></div><div class="form-group col-md-2 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>&nbsp;<a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>');
		}
	});
	$('#queDivNav a').click(function (e) {
		if($(this).attr('href') == '#queManualQue') {
			sQue();
		} else if($(this).attr('href') == '#queManualFlow') {
			fQue();
		}
	});
  enterSubmit($('#search_Que input[name=question]'),addQueSearch);
$.ajax({
	type: 'get',
	datatype: 'json',
	cache: false,
	//不从缓存中去数据
	url: encodeURI('../../label/findAllLabels'),
	success:function(data){
		$('#labelDiv').empty();
		data.list.forEach(function(el){
			$('#labelDiv').append('<div class="labelDiv"><span class="label label-default" style="cursor:pointer;" rel="'+el.Id+'">'+el.LabelName+'</span></div>');
		});
  if(getUrlParam('id') != null) {
	$('title').html('编辑知识集');
	$('.breadcrumb').eq(2).html('编辑知识集');
	$('.page-header').html('编辑知识集');
	$('ol.breadcrumb').find('li.active').html('编辑知识集');
	  $.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		url: encodeURI('../../ChatLink/findChatLinkById?id='+getUrlParam('id')),
		success: function(data) {
		  if (data.status == 0) {
			//yunNoty(data);
			$('[name="themeName"]').val(data.chatLink.ThemeName);
			$('[name="helloWord"]').val(data.chatLink.HelloWord);
			$('[name="unknownWord"]').val(data.chatLink.UnknownWord);
			$('#portImg').attr('src', data.chatLink.ThemePicPath);
			$('#kfImg').attr('src', data.chatLink.KfPic);
			$('#khImg').attr('src', data.chatLink.KhPic);
			//$('#queClassId').val(data.chatLink.GroupIds);
			//$('#queClassify').val(data.chatLink.GroupName);
			if(data.label) {
				var lbs = data.label;
				lbs.forEach(function(el){
					$('.label-default[rel='+el+']').removeClass('label-default').addClass('label-primary');
				});
			}
			if(data.question && data.question.length > 0) {
				$('#queManual').empty();
				data.question.forEach(function(el){
					if(el) {
						$('#queManual').append('<div class="QueContainer"><div class="form-group col-md-10"><input class="form-control" type="text" readOnly style="cursor:pointer;" placeholder="请选择推荐的问题" name="postQueInput" value="'+el.Question+'" rel="'+el.Id+'" srel="'+el.SolutionId+'" ></div><div class="form-group col-md-2 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>&nbsp;<a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>');
					} else {
						$('#queManual').append('<div class="QueContainer"><div class="form-group col-md-10"><input class="form-control" type="text" readOnly style="cursor:pointer;" placeholder="请选择推荐的问题" name="postQueInput"></div><div class="form-group col-md-2 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>&nbsp;<a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>');
					}
				});
			}
			if(data.group) {
				data.group = data.group.filter(function(el) {
					if(el) return true;
					return false;
				});
				$('#queClassId').val(data.group.reduce(function(arr, value) {
					return arr.concat([value.Id]);
				}, []).join(','));
				$('#queClassify').val(data.group.reduce(function(arr, value) {
					return arr.concat([value.Name]);
				}, []).join(','));
			}
		  } else {
			yunNoty(data);
		  }
		}
	  });
  }
	}
});
});
  function addQueSearch(){
  	if($('#queDivNav li').eq(0).hasClass('active')){
  		sQue();
  	}else if($('#queDivNav li').eq(1).hasClass('active')){
  		fQue();
  	}else{
  		sQue();fQue();
  	}
  }

//问题分类树
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
	check: {
		enable: true
	},
	async: {
		enable: true,
		url: "../../classes/listClasses?m=0",
		autoParam: ["id"],
		dataFilter: function(treeId, parentNode, responseData) {
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
		onCheck: function(event, treeId, treeNode) {
			var treeObj = $.fn.zTree.getZTreeObj(treeId);
			var nodes = treeObj.getCheckedNodes(true);
			var count = 0;
			var arr = [];
			var arrN = [];
			nodes.forEach(function(el){
				if(!el.isParent) {
					count++;
					arr.push(el.Id);
					arrN.push(el.Name);
				}
			});
			if(count) {
				$('#QuestionClassModel [name=treeName]').val(arrN.join(','));
				$('#QuestionClassModel [name=treeId]').val(arr.join(','));
			} else {
				$('#QuestionClassModel [name=treeName]').val('');
				$('#QuestionClassModel [name=treeId]').val('');
			}
		},
		beforeClick: function(treeId, treeNode, clickFlag) {
			return false;
		},
		onAsyncSuccess: function(event, treeId, treeNode, msg) {
			$('#QuestionClassModel [name=treeName]').val($('#queClassify').val());
			$('#QuestionClassModel [name=treeId]').val($('#queClassId').val());
			if($('#queClassId').val()) {
				var arr = $('#queClassId').val().split(',').map(function(el){
					return el * 1;
				});
				function filterInArr(node) {
					return $.inArray(node.Id, arr) >= 0;
				}
				var treeObj = $.fn.zTree.getZTreeObj(treeId);
				var nodes = treeObj.getNodesByFilter(filterInArr); // 查找节点集合
				for (var i=0, l=nodes.length; i < l; i++) {
					treeObj.checkNode(nodes[i], true, false, false);
				}
			}
		}
	}
};

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

/**
* 手动设置智能推荐确定
*/
$('#queManualConfirm').click(function() {
	var addFlag = false;
	var id = getSelectedIds_aQue();
	var SolutionId = getSelectedSolutionIds_aQue();
	var targetInput = $('#queManual [name=postQueInput]').eq(QandFIndex);
	if(targetInput.val() === '') {
		addFlag = true;
	}
	targetInput.attr('rel', id);
	targetInput.attr('Srel', SolutionId);
	targetInput.val($('#queDiv #list-tr-'+id).children('td').eq(1).html());
	$('#queManualModal').modal('hide');
	if(addFlag) {
		if($('#queManual a[name=addpostInput]').size() < 5) {
			$('#queManual').append('<div class="QueContainer"><div class="form-group col-md-10"><input class="form-control" type="text" readOnly style="cursor:pointer;" placeholder="请选择推荐的问题" name="postQueInput"></div><div class="form-group col-md-2 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>&nbsp;<a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>');
		}
	}
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

//智能推荐问题模态框显示
function showQueModal(){
	$('#queManualModal').modal('show');
}

$('#queManualModal').on('hidden.bs.modal', function () {
	$('#queManualModal [name="question"]').val('');
	$('#queDivNav [href="#queManualQue"]').trigger('click');
});
$('#queManualModal').on('show.bs.modal', function () {
	$.fn.zTree.init($("#treeHide"),hidesetting,[]);
	$('#queSel').html('全部分类');
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
  						html += '<td><input type="radio" name="row_sel1" value="'+data.questionList[i].Id+'" solutionId="'+data.questionList[i].SolutionId+'"></td>';
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
  						html += '<td><input type="radio" name="row_sel2" value="'+data.questionList[i].Id+'" solutionId="'+data.questionList[i].SolutionId+'"></td>';
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
