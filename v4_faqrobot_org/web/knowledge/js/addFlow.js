	//switchery 初始化
	function renderSwitcher() {
		var green = "#00acac",
		red = "#ff5b57",
		blue = "#348fe2",
		purple = "#727cb6",
		orange = "#f59c1a",
		black = "#2d353c";
	    if ($("[data-render=switchery]").length !== 0) {
	        $("[data-render=switchery]").each(function() {
	            var e = green;
	            if ($(this).attr("data-theme")) {
	                switch ($(this).attr("data-theme")) {
	                case "red":
	                    e = red;
	                    break;
	                case "blue":
	                    e = blue;
	                    break;
	                case "purple":
	                    e = purple;
	                    break;
	                case "orange":
	                    e = orange;
	                    break;
	                case "black":
	                    e = black;
	                    break;
	                }
	            }
	            var t = {};
	            t.color = e;
	            t.secondaryColor = $(this).attr("data-secondary-color") ? $(this).attr("data-secondary-color") : "#dfdfdf";
	            t.className = $(this).attr("data-classname") ? $(this).attr("data-classname") : "switchery";
	            t.disabled = $(this).attr("data-disabled") ? true: false;
	            t.disabledOpacity = $(this).attr("data-disabled-opacity") ? $(this).attr("data-disabled-opacity") : 0.5;
	            t.speed = $(this).attr("data-speed") ? $(this).attr("data-speed") : "0.5s";
	            var n = new Switchery(this, t);
	        });
	    }
	};
	renderSwitcher();
	var switchStatus = 0;
	$('#intelMatchContainer input[data-change="check-switchery-state-text"]').on("change",function(){
		switchStatus = $(this).attr("checked")?1:0;
		if(switchStatus==0){
			//不启用
			$("#switchContent").css('display','none');
		}
		if(switchStatus==1){
			//启用
			$("#switchContent").css('display','block');
		}
	});

var QuestionId = getUrlParam('questionId');
var SolutionId = getUrlParam('solutionId');
var GroupId = getUrlParam('groupId');
var AnswerId = getUrlParam('answerId');
$('#AnswerId').val(AnswerId);
//智能推荐手动配置的input序号
var QandFIndex = -1;
//流程答案
var flowUE = UE.getEditor('ans_flow', {
	initialFrameHeight: 300,
	zIndex: 190,
	wordCount:true,
	maximumWords: 20000
});
$(document).ready(function() {
	// 新手引导(需要引导的页面的code即为页面名称)
	Base.request({
		url: 'tipHelp/check',
		params: {
			code: 'addFlow',
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


	App.init();
  iframeTab.init({iframeBox: ''});
	setInterval(function() {
		if($('.edui-editor').css('position') != 'absolute') {
			$('.edui-editor').css('width', 'auto');
		}
	},1000);
	$('#question').addWordCount(200);
	if(QuestionId !== null) {
		$('title').html('修改流程');
		$('.breadcrumb').eq(2).html('修改流程');
		$('.page-header').html('修改流程');
		$('ol.breadcrumb').find('li.active').html('修改流程');
		$('#formSubmit').html('修改');
		//删除是否重复添加的按钮
		$('#isAgain').hide();
		$('#isAgainSpan').hide();
		$('#AddQuesForm').children().eq(4).children().children().eq(1).remove();
		//$('#AddQuesForm').children().eq(0).hide();
		findFlowDetail(QuestionId);
	} else {
		$('title').html('创建流程');
		$('.breadcrumb').eq(2).html('创建流程');
		$('.page-header').html('创建流程');
	}
	//获取配置项列表信息
	getRule();

	//生效渠道
	$('body').on('click', 'a[fid]', function(e) {
		if($(e.target).hasClass('btn-primary')) {
			$(e.target).removeClass('btn-primary');
			$(e.target).attr('ckb', 0);
		} else {
			$(e.target).addClass('btn-primary');
			$(e.target).attr('ckb', 1);
		}
	});
	$('body').on('ifClicked', '#wayAll', function() {
		if ($(this)[0].checked) {
      $('a[fid]').removeClass('btn-primary');
			$('a[fid]').attr('ckb', 0);
		} else {
      $('a[fid]').addClass('btn-primary');
			$('a[fid]').attr('ckb', 1);
		}
	});
	//生效时间
	$(".form_datetime").datetimepicker({
		language: "zh-CN",
		format: "yyyy-mm-dd hh:ii",
		autoclose: true,
		todayBtn: true,
		minuteStep: 10,
		startDate: new Date(),
		initialDate: new Date(),
		zIndex: 2000
	});
	$('#timePicker').iCheck('uncheck');
	$('#timePicker').on('ifChecked', function() {
		$('#dateTime').show();
	}).on('ifUnchecked', function() {
		$('#dateTime').hide();
		$('#ansRuleForm [name=StartTime]').val('');
		$('#ansRuleForm [name=EndTime]').val('');
	});
	//生效角色ztree滚动条
	$('.treeDiv').slimScroll({
		height: '200px'
	});
  //生效角色ztree初始化
  $.fn.zTree.init($("#treeUserRole"),setting,[]);
	//生效角色单击展开所有按钮
	$('.expandURA').click(function(){
		showTree('treeUserRole',true);
	});
	//生效角色单击折叠所有按钮
	$('.expandURN').click(function(){
		showTree('treeUserRole',false);
	});

	//选择流程分类模态窗
	$('.treeDivModal').slimScroll({
		height: '400px'
	});
	$('#QuestionClassModel').on('show.bs.modal', function () {
		$.fn.zTree.init($("#treeQueClass"),classsetting,[]);
	});
	$('#QuestionClassModel').on('hide.bs.modal', function () {
		$('#QuestionClassModel [name=treeName]').val('');
		$('#QuestionClassModel [name=treeId]').val('');
	});
	$('#queClassify').on('click', function() {
		$('#QuestionClassModel').modal('show');
	});
	$('#selClassBtn').on('click', function() {
		$('#queClassify').val($('#QuestionClassModel [name=treeName]').val());
		$('input[name=ClassesIds]').val($('#QuestionClassModel [name=treeId]').val());
		$('#QuestionClassModel').modal('hide');
	});

	$('#question').on('blur', function() {
		if($(this).val().length <= 1) {
			yunNotyError("流程名称长度需在2-200个字符之间！");
			$(this).val('');
		}
	});
	// $('#flow_text').on('blur', function() {
	// 	if($(this).val().length == 1) {
	// 		yunNotyError("流程描述长度需在2-20000个字符之间！");
	// 		$(this).val('');
	// 	}
	// });
	
	//选择标签模态框
	$("#labelClassify").click(function(){
		$("#labelTxt").html("");
		$("#labelClassModel").modal("show");
	});
	$('#labelClassModel').on('show.bs.modal', function () {
		labelList();
		
	});
	
	$("#selLabelBtn").click(function(){     //确定选择标签
		var checkb=$("#labelTxt").find("input[type='checkbox']");
		var label="";
		var id="";
		$(checkb).each(function(){
			if($(this).prop("checked")){
				label+=$(this).parent().parent().next().text()+",";
				id+=$(this).attr("value")+",";
			}
		});
		
		$("#labelClassify").val(label.substring(0,label.length-1));
		$("#labelesIds").attr("value",id.substring(0,id.length-1));
		$("#labelClassModel").modal("hide");
	});
	
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
					$('#timePicker').on('ifChecked', function() {
						$('#dateTime').show();
					}).on('ifUnchecked', function() {
						$('#dateTime').hide();
						$('#ansRuleForm [name=StartTime]').val('');
						$('#ansRuleForm [name=EndTime]').val('');
					});
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
					
					var labelIds=$("#labelesIds").attr("value");
					var labelIdsList=new Array();
					labelIdsList=labelIds.split(",");
					
					$(".checkb").each(function(){
						if($.inArray($(this).attr("value"),labelIdsList)>=0){
							$(this).iCheck("check");
						}
					});
					
				}
				else{
					var html="";
					html += '<div style="width:100%;text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</div>';
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
	
	
	
	$('#formSubmit').on('click', AdF);
	function AdF() {
		if(QuestionId !== null) {
			EditFlow();
		} else {
			AddFlow();
		}
	}
	setInterval(function() {
		var addFlag = true;
		//问题内容
		var question = $('#question').val();
		if(question === '' || question.length < 2 || question.length > 200) {
			addFlag = false;
		}
		//问题分组ID
		var groupId = $('input[name=ClassesIds]').val();
		if(groupId === '') {
			addFlag = false;
		}
		var answer = UE.getEditor('ans_flow').getContent();
		if(answer === '' || answer.length < 2 || answer.length > 20000) {
			addFlag = false;
		}
		if(addFlag === true) {
			$('#formSubmit').unbind('click').bind('click',function(){
				AdF();
			});
			$('#formSubmit').removeAttr('disabled');
		} else {
			$('#formSubmit').unbind('click');
			$('#formSubmit').css('pointer-events', 'all').attr('disabled', true);
		}
	},500);
});

function setrolename() {
  $('#rolename').val($('#AddQuesForm input[name=hasChecked]').val());
  $('#roleModel').modal('hide');
}
/*********************tree start***********************/
//生效角色树
var setting = {
	check: {
		enable: true,
		chkboxType: { "Y" : "ps", "N" : "ps" }
	},
	data : {
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
	view : {
		dblClickExpand: false,
		selectedMulti : false,
		showIcon: false
	},
	async : {
		enable: true,
		url: "../../comb/loadCombs",
		autoParam: ["id"],
		dataFilter: function(treeId, parentNode, responseData) {
      if (responseData) {
        return responseData.list;
      }
      return responseData;
    }
	},
	callback : {
		beforeClick: function(treeId, treeNode) {
      var zTree = $.fn.zTree.getZTreeObj("treeUserRole");
      zTree.checkNode(treeNode, !treeNode.checked, null, true);
      return false;
    },
		onCheck: function(e, treeId, treeNode) {
      var zTree = $.fn.zTree.getZTreeObj("treeUserRole");
      nodes = zTree.getCheckedNodes(true);
      v = "";
      I = "";
      for (var i=0, l=nodes.length; i<l; i++) {
        if (nodes[i].Leaf == 1) {
          v += nodes[i].Name + ",";
          I += nodes[i].Id + "~";
        }
      }
      if (v.length > 0 ) v = v.substring(0, v.length-1);
      if (I.length > 0 ) I = I.substring(0, I.length-1);
      // if(nodes.length>5){
      // 	yunNotyError('每个用户最多可以添加5个角色！');
      // 	$("#AddQuesForm input[name=hasChecked]").val('');
      // 	$("#AddQuesForm input[name=hasCheckedId]").val('');
      // 	return;
      // }else{
        $("#AddQuesForm input[name=hasChecked]").val(v);
        $("#AddQuesForm input[name=hasCheckedId]").val(I);
      //}
    },
		onAsyncSuccess: function(event, treeId, treeNode) {
      var zTree = $.fn.zTree.getZTreeObj("treeUserRole");
      var IdString = $("#AddQuesForm input[name=hasCheckedId]").val();
      if(IdString) {
        var Ids = IdString.split('~');
        var node = null;
        for(i = 0 ; i < Ids.length; i ++ ) {
          zTree.checkNode( zTree.getNodeByParam( "Id", Ids[i] ), true );
        }
      }
    }
	}
};

//流程分类树
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
		url: "../../classes/listClasses?m=0",
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
	$('#QuestionClassModel [name=treeName]').val(Nodes[0].Name);
	$('#QuestionClassModel [name=treeId]').val(Nodes[0].Id);
}
function zTreeBeforeClick(treeId, treeNode, clickFlag) {
	return ! treeNode.isParent; //当是父节点 返回false不让选取
}
function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
	var treeObj = $.fn.zTree.getZTreeObj("treeClasses");
	//treeObj.expandAll(true);
}

//手动选择句式树
  var termsetting = {
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
      url: "../../classes/listClasses?m=11",
      autoParam: ["id"],
      dataFilter: ajaxDataFilter1
    },
    callback: {
      onClick: ZTreeClassTermClick,
      onAsyncSuccess: zTreeOnAsyncSuccess
    }
  };
  
  //格式化一步获取的json数据
function ajaxDataFilter1(treeId, parentNode, responseData) {
	if (responseData) {
		if (responseData.status == -1) {
			yunNoty(responseData);
		}
		responseData.list.push({
			Id: -1,
			ParentId: 0,
			Name: "全部分类",
			open: true
		});
		return responseData.list;
	}
	return responseData;
}
  function ZTreeClassTermClick(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj('treeTermClass');
    Nodes = zTree.getSelectedNodes();
    $('#modal-intelTerm input[name=treeName]').val(Nodes[0].Name);
    $('#modal-intelTerm input[name=treeId]').val(Nodes[0].Id);
    termList(1);
  }
  
  //手动选择句式内容列表
  var pageNum = 1;
  function termList(pageNum){
  	if(!pageNum) pageNum=1;
  	$('#termTable').tableAjaxLoader2(2);
  	$.ajax({
  		type:"post",
  		url:"../../KnSentenceGroup/getKnSentenceGroupList?pageSize=8&pageNo="+pageNum+"&groupId="+(parseInt($('#modal-intelTerm input[name=treeId]').val()) || ''),
  		async:true,
  		cache:true,
  		success:function(data){
  			if(data.list.Items && data.list.Items.length>0){
  				var html = [];
  				var temp = data.list.Items;
  				for(var i=0;i<temp.length;i++){
  					html+='<tr id="'+temp[i].Id+'" ClassId="'+temp[i].ClassId+'" SgName="'+temp[i].SgName+'">'+
  									'<td><input type="radio" name="match"></td>'+
  									'<td>'+temp[i].SgName+'</td>'+
  								'</tr>';
  				}
  				$("#termTable tbody").html(html);
  				$('#termTable td').click(function() {
					$(this).parent().find('input[name=match]').iCheck('check');
				});
				icheckListInit();
				$("#termTable td input[name=match]").on('ifChecked',function(){
				    var checkedState = $(this).prop('checked');//记录当前选中状态  
				    $(this).iCheck('check'); 
				    if(checkedState){  
				        $(this).iCheck('uncheck'); 
				    }  
				});
				
  				//下面开始处理分页
				var options = {
					currentPage: data.currentPage,
					totalPages: data.totlePages,
					onPageClicked: function (event, originalEvent, type, page) {
						termList(page);
					}
				};
				setPage('termPageList',options);
			}else{
				$('#termTable').find('tbody').html('<div style=\"width:172%;text-align:center;\"><i class=\"icon-exclamation-sign\"></i>&nbsp;&nbsp;当前记录为空！</div>');
				$('#termPageList').html('');
			}
  		}
  	});
  }
  	var sgIds = '';
  	$("#modal-intelTerm .addTerm").click(function(){
		var oHtml = '';
		for(var i = 0;i < $('#termTable td .iradio_flat-blue').length;i++){
			if($('#termTable td .iradio_flat-blue').eq(i).hasClass('checked')){
				sgIds = $('#termTable td .iradio_flat-blue').eq(i).parents('tr').attr('id');
				var text = $('#termTable td .iradio_flat-blue').eq(i).parent().siblings().text();
				oHtml = '<label style="width:100%;">'+
						'<input type="radio" name="ckb" checked/>'+
						'<span class="timeTip" style="margin-left:10px;">'+text+'</span>'+
						'<a href="javascript:;" class="pull-right delSentence">删除</a>'+
						'</label>';
				$("#myTabContent #relGroup").html(oHtml);
				/*$(".timeTip").tooltip({
					'placement':'right'
				});*/
				icheckListInit();
				sentenceInter();
			}
		}
	});
	//已选择的句式点击删除
  $('#relGroup').on('click','.delSentence',function(){
  		 $('#relGroup').html('');
  		 $('#similarGroup').html('').addClass('hide');
		 sgIds='';
  })
  //选择智能句式组后匹配出对应下面的句式
	function sentenceInter(){
		$.ajax({
			type:"post",
			url:"../../KnSentenceItem/getKSItemList",
			async:true,
			cache:true,
			data:{'sgId':sgIds},
			success:function(data){
				if(data.status==0){
					var list = data.knList;
					if(list.length>0){
						var html = '系统已生成下列几种句式：<br />';
						for(var i = 0;i < (list.length>5?'5':list.length);i++){
							html += (i+1)+'.'+list[i].SiName+'<br />';
						}
						$("#similarGroup").html(html).removeClass('hide');
					}
				}
			}
		})
	}
  
  //点击实体增加减少时
	 $('#EntitysList').on('click', 'a[name=delentityInput]', function() {
	    if ($('#EntitysList a[name=delentityInput]').size() > 1) {
	      $(this).parent().parent().remove();
	    } else {
	      
	    }
	  });
  
  $('#EntitysList').on('click', 'a[name=addentityInput]', function() {
    if ($('#EntitysList a[name=addentityInput]').size() < 4) {
      $('#EntitysList').append('<div class="col-md-12" style="padding-left:0;padding-right:0;margin-top: 10px;">'+
									'<div class="col-md-7" style="padding:0;">'+
										'<input type="text" class="entitys"/>'+
									'</div>'+
									'<div class="col-md-4 m-t-5 m-l-5" style="padding:0;">'+
                                       ' <a href="javascript:;" name="delentityInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>'+
                                        '<a href="javascript:;" name="addentityInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a>'+
                                    '</div></div>');
    }
  });
  
  //手动选择模态框
 $('#modal-intelTerm').on('show.bs.modal', function() {
    $.fn.zTree.init($("#treeTermClass"), termsetting, []);
    $('#affix1inner').slimScroll({
	    height: $(window).height()+ 'px',
	    allowPageScroll: false
	  });
    termList(1);
  });

/*********************tree end***********************/

//创建流程ajax
var flag_add = false;
function AddFlow() {
	//流程内容
	var question = $('#question').val();
	if(question === '' || question.length < 2 || question.length > 200) {
		yunNotyError("流程名称长度需在2-200个字符之间！");
		return false;
	}
	//流程分组ID
	var groupId = $('input[name=ClassesIds]').val();
	if(groupId === '') {
		yunNotyError("请选择流程分类！");
		return false;
	}
	//如果启用则判断实体、句式组不能为空
	if(switchStatus == 1){
		if($("#EntitysList .entitys").val()==''){
			yunNotyError("实体不能为空！");
			return false;
		}
		if($("#macthPharse").text() == ''){
			if($('#relGroup').html()==''){
				yunNotyError("请手动选择句式组！");
				return false;
			}
		}
	}
	//标签id集合
	var labelidsL=$('input[name=labelesIds]').val();
	
	//消息类型 6流程
	var mode = 6;
	//流程生效否0是1
	var answerTimeLiness = 0;
	//流程生效起
	var answerStartTime = '';
	//流程生效止
	var answerEndTime = '';
	//答案内容
	var answer = '';
	//答案生效规则
	var effectiveRules = [];
	var wSgId = '';
	//answer = $('#flow_text').val();
	answer = flowUE.getContent();
	if(answer === '' || answer.length < 2 || answer.length > 20000) {
		yunNotyError("流程描述长度需在2-20000个字符之间！");
		return false;
	}
	if($('#AddQuesForm [name=StartTime]').val() !== '' && $('#AddQuesForm [name=EndTime]').val() !== '') {
		answerStartTime = $('#AddQuesForm [name=StartTime]').val();
		answerEndTime = $('#AddQuesForm [name=EndTime]').val();
		answerTimeLiness = 1;
	}
	var effectiveRule1 = {
		'type' : 1,
		'roleIds' : ""
	};
	$('#DivRule_Way a.btn-primary').each(function() {
		effectiveRule1.roleIds += $(this).attr('fid')+",";
	});
	if(effectiveRule1.roleIds === "") {
		effectiveRule1.roleIds = "-1";
	} else {
		effectiveRule1.roleIds = effectiveRule1.roleIds.substring(0,effectiveRule1.roleIds.length-1);
	}
	//console.log(effectiveRule1.roleIds);
	var effectiveRule2 = {
		'type' : 2,
		'roleIds' : ""
	};
	if($('#AddQuesForm input[name=hasCheckedId]').length) {
  	effectiveRule2.roleIds = $('#AddQuesForm input[name=hasCheckedId]').val().split('~').join(',');
	} else {
		effectiveRule2.roleIds = "";
	}
	if(effectiveRule2.roleIds === "") {
		effectiveRule2.roleIds = "-1";
	}
	//console.log(effectiveRule2.roleIds);
	effectiveRules.push(effectiveRule1);
	effectiveRules.push(effectiveRule2);
	effectiveRules = JSON.stringify(effectiveRules);
	//console.log(JSON.stringify(effectiveRules));
	var entitysStr='';
	$("#EntitysList .entitys").each(function(i){
		if($("#EntitysList .entitys").eq(i).val()!=''){
			entitysStr += $("#EntitysList .entitys").eq(i).val()+',';
		}
	});
	
	var dataJSON = {
		question:question,
		groupId:groupId,
		labelIds:labelidsL,//标签id集合
		mode:mode,
		answerTimeLiness:answerTimeLiness,
		answerStartTime:answerStartTime,
		answerEndTime:answerEndTime,
		answer:answer,
		suggestMode:0,
		effectiveRules:effectiveRules,
		qiYong:switchStatus,
		entitys:entitysStr.substring(0,entitysStr.length-1),
		wSgId : $("#wSgId").val()
	};
	//console.log(dataJSON);
	if (flag_add) {
		return;
	}
	flag_add = true;
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../question/doAddQueAndAns'),
		data: dataJSON,
		success: function(data) {
			flag_add = false;
			if (data.status === 0) {
				yunNoty(data,function() {
					if($('#isAgain').attr('checked') != 'checked') {
						var href = "/web/knowledge/editFlow.html?solutionId="+data.solutionId+"&groupId="+groupId+"&questionId="+data.questionId;
            			var ifT = iframeTab.init({iframeBox: ''});
						ifT.refreshTab(href,'流程详细');
					} else {
						//清空表单
						$('#question').val('');
						//$('#flow_text').val('');
						flowUE.setContent('');
						$('#ruleDiv').html('');
						$('#ansRuleStartTime').val('');
						$('#ansRuleEndTime').val('');
						$('#queClassify').val('');
						$('#ClassesIds').val('');
						$('#labelClassify').val('');
						$('#labelesIds').val('');
			            $('a[fid]').removeClass('btn-primary').addClass('btn-white');
			            var treeObj = $.fn.zTree.getZTreeObj("treeUserRole");
			            treeObj.checkAllNodes(false);
			            $('#AddQuesForm input[name=hasChecked]').val('');
			            $('#AddQuesForm input[name=hasCheckedId]').val('');
			            $('#timePicker').iCheck('uncheck');
			            $('#dateTime').hide();
			            $('#AddQuesForm [name=StartTime]').val('');
			            $('#AddQuesForm [name=EndTime]').val('');
						$('#colRight').hide();
						$('#simiYinContainerHide').hide();
						$('.oneTips').hide();
					}
				});
			} else {
                if(data.message == '该问题已存在！'){
                    yunNotyError('该流程已存在！');
                }
			}
		}
	});
}

function findFlowDetail(id) {
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../question/getQuestionById'+'?id='+id),
		success: function(data) {
			if (data.status === 0) {
				//接口
				var k = 0;
				//$('#AnswerId').val(data.question.ListAnswer[0].Id);
				for(var i=0; i < data.question.ListAnswer.length; i++) {
					if(data.question.ListAnswer[i].Id == $('#AnswerId').val()) {
						k = i;
					}
				}
				AnswerListRule = data.question.ListAnswer[k].ListRule;
				if(AnswerListRule !== undefined) {
					if(AnswerListRule.length>0) {
						for(var m in AnswerListRule) {
							if(AnswerListRule[m].type == 1) {
								$.each(AnswerListRule[m].roleIds.split(','), function() {
									if(this == '1')
										$('#ruleDiv').append('<div class="delAble m-r-5 m-t-5"><a class="btn btn-info" disabled id="ansRuleWayWeb">网页</a><span title="点击删除"></span></div>');
									if(this == '2')
										$('#ruleDiv').append('<div class="delAble m-r-5 m-t-5"><a class="btn btn-info" disabled id="ansRuleWayWeChat">微信</a><span title="点击删除"></span></div>');
								});
							}
						}
						for(var n in AnswerListRule) {
							if(AnswerListRule[n].type == 2) {
								for(var j in AnswerListRule[n].roleIds) {
									for(var key in AnswerListRule[n].roleIds[j]) {
										$('#ruleDiv').append('<div class="delAble m-r-5 m-t-5"><a class="btn btn-success" disabled name="ansRuleRole" rel="'+key+'">'+AnswerListRule[n].roleIds[j][key]+'</a><span title="点击删除"></span></div>');
									}
								}
							}
						}
						//给除了时间的span绑定事件
						$('.delAble span').click(function() {
							$(this).parent().remove();
						});
					}
				}
				if(data.question.ListAnswer[k].TimeLiness == 1) {
					$('#ansRuleStartTime').val(data.question.ListAnswer[k].StartTime.substring(0,16));
					$('#ansRuleEndTime').val(data.question.ListAnswer[k].EndTime.substring(0,16));
					$('#ruleDiv').append('<div class="delAble m-r-5 m-t-5"><a class="btn btn-white" disabled id="ansRuleTime">'+$("#ansRuleStartTime").val()+' - '+$("#ansRuleEndTime").val()+'</a><span title="点击删除"></span></div>');
					//给时间的span绑定事件
					$('#ansRuleTime').parent().find('span').on('click', function() {
						$('#ansRuleStartTime').val('');
						$('#ansRuleEndTime').val('');
						$(this).parent().remove();
					});
				}
				//生成span
				if(data.question.ListAnswer[k].Mode == '6') {
					//$('#flow_text').val(data.question.ListAnswer[k].Answer);
					flowUE.addListener("ready", function() {
						flowUE.setContent(data.question.ListAnswer[k].Answer);
					});
				}
				if(data.question.Question !== null) {
					$('#question').val(data.question.Question);
				}
				if(data.question.GroupId !== null) {
					$('input[name=ClassesIds]').val(data.question.GroupId);
				}
				if(data.question.GroupName !== null) {
					$('#queClassify').val(data.question.GroupName);
				}
			} else {
				yunNoty(data);
			}
		}
	});
}

/**
* 输入流程校验
*/
function check_flow(e){
    $.get("../../question/isExistQue", 'question='+encodeURI(e.val())+'&level=1', function (data) {
        $(".entitys").eq(0).val(data.entity||"");
		if(data.status===0&&data.result){
	        if(data.result) {
				var trueexistQue = JSON.parse(data.result);
				var getCheckQue = trueexistQue.getCheckQue;
				var seggedWord = trueexistQue.seggedWord;
				var stopWord = trueexistQue.stopWord;
				var allSeggedWord = trueexistQue.allSeggedWord;
				var sentence = trueexistQue.sentence;
				var groupId = trueexistQue.groupId;
				if(groupId){
					$("#wSgId").val(groupId);
				}
				$('#colRight').show();
				$('#simiYinContainerHide').show();
				$('.oneTips').show();
				if(sessionStorage.getItem('sentenceValue') == 1){
					if(getCheckQue){
						if (getCheckQue.length) {
							var html=[];
							for(var i=0;i<getCheckQue.length;i++){
								if(getCheckQue[i].matchQuestion){
									/*
									 * taskId = 426 相似问题进入流程
									 * 通过后台返回的参数solutionType判断，1为问题，2为流程
									 */
									if(getCheckQue[i].matchQuestion.solutionType == 1){
										html.push('<div class="col-md-12"><a data-num="0" data-name="问题详细"  href="../../web/knowledge/queDetail.html?id=' + getCheckQue[i].matchQuestion.solutionId + '" sid="' + getCheckQue[i].matchQuestion.id + '"  rel="' + getCheckQue[i].matchQuestion.solutionId + '" class="searchDetailQue_a">' + (i + 1) + '.&nbsp;' + getCheckQue[i].matchQuestion.question + '</a></div>');
									}else{
										html.push('<div class="col-md-12"><a data-num="0" data-name="流程详细"  href="../../web/knowledge/editFlow.html?questionId=' + getCheckQue[i].matchQuestion.solutionId + '&solutionId='+ getCheckQue[i].matchQuestion.solutionId +'&groupId='+getCheckQue[i].matchQuestion.groupId+'" sid="' + getCheckQue[i].matchQuestion.id + '"  rel="' + getCheckQue[i].matchQuestion.solutionId + '" class="searchDetailQue_a">' + (i + 1) + '.&nbsp;' + getCheckQue[i].matchQuestion.question + '</a></div>');
									}
								}
							}
							$('#simiYin').html('<div class="col-md-12 col-xs-12 m-5" style="padding-right: 0;padding-left: 0;">此流程已存在以下相似问法：</div><div class="simiQueLt"></div>');
							$('.simiQueLt').append(html.join(''));
							if(e.val() !== '') {
								var terms = e.val().split('');
								var aValue=$('.simiQueLt').html();
								$.each(terms, function(i, n){
									if(aValue.indexOf(n)>0){
										//$('.simiQueLt').highlight(n);
									}
								});
							}
						}
						$('#simiYinContainer').show();
						$("#intelMatchContainer").show();
					}else{
						$('#simiYinContainerHide').hide();
						$("#intelMatchContainer").hide();
					}
					var oHtml = [];
					if(allSeggedWord){
						if(allSeggedWord.length){
							var lexFea = [];
							$("#phraseFeat").css('display','block');
							var allSegged = [
								['n','nbp','nba','nf','nb','nbc','nl'],
								['gi','nx','gm','nh','gbc','nz','g','j','gb','gg','gc','nhd','gp'],
								['np'],
								['nit','ntcb','ni','ntu','nts','ntcf','nth','nic','ntch','nt','ntc','nis','nto'],
								['t','tg'],
								['f','s'],
								['nsf','ns'],
								['nm','nhm','nmc'],
								['nr','nr1','nr2','nrf','nrj','nn','nnt','nnd'],
								['vf','vx','v','vl','vshi','vi','vd','vyou','vn'],
								['vo'],
								['a','ad','al','an','z','o'],
								['b','bl'],
								['d','dg','dl'],
								['p','pbei','pba','c','cc'],
								['r','ry','rg','rys','rzs','rz','ryt','rzt','ryv','rzv','rr','Rg'],
								['u','ude2','uls','uzhe','usuo','ude1','uzhi','uyy','ule','udeng','ude3','ulian','uguo','udh','y','yg','e'],
								['m','q','mq','qt','qg','qv','mg','Mg'],
								['w','wp','wyy','ws','wkz','wyz','wn','wt','wd','wj','ww','wm','wky','wf'],
								['l','x','h','k','xu','i','end','begin'],
								['g','ng','ag','vg','xx','bg'],
								['stop']
							];
							for(var i=0;i < allSeggedWord.length;i++){
								for(var j = 0;j < allSegged.length;j++){
									for(var z = 0;z < allSegged[j].length;z++){
										if(allSegged[j][z] == allSeggedWord[i].nature){
											var segged = allSegged[j][0];
											switch(segged){
												case 'n':
													oHtml.push('<span class="m-5" style="background:#488FCE;">'+allSeggedWord[i].word+'</span>');
													lexFea.push('<div class="col-md-12 col-xs-12" style="background:#488FCE;">名词</div>');
													break;
												case 'gi':
													oHtml.push('<span class="m-5" style="background:#96DBF8;">'+allSeggedWord[i].word+'</span>');
													lexFea.push('<div class="col-md-12 col-xs-12" style="background:#96DBF8;">专有名词</div>');
													break;
												case 'np':
													oHtml.push('<span class="m-5" style="background:#96DBF8;">'+allSeggedWord[i].word+'</span>');
													lexFea.push('<div class="col-md-12 col-xs-12" style="background:#96DBF8;">属性名词</div>');
													break;
												case 'nit':
													oHtml.push('<span class="m-5" style="background:#41e3f2;">'+allSeggedWord[i].word+'</span>');
													lexFea.push('<div class="col-md-12 col-xs-12" style="background:#41e3f2;">机构名词</div>');
													break;
												case 't':
													oHtml.push('<span class="m-5" style="background:#41f6ba;">'+allSeggedWord[i].word+'</span>');
													lexFea.push('<div class="col-md-12 col-xs-12" style="background:#41f6ba;">时间名词</div>');
													break;
												case 'f':
													oHtml.push('<span class="m-5" style="background:#C9AACA;">'+allSeggedWord[i].word+'</span>');
													lexFea.push('<div class="col-md-12 col-xs-12" style="background:#C9AACA;">方位名词</div>');
													break;
												case 'nsf':
													oHtml.push('<span class="m-5" style="background:#D07F7F;">'+allSeggedWord[i].word+'</span>');
													lexFea.push('<div class="col-md-12 col-xs-12" style="background:#D07F7F;">地点名词</div>');
													break;
												case 'nm':
													oHtml.push('<span class="m-5" style="background:#379bf4;">'+allSeggedWord[i].word+'</span>');
													lexFea.push('<div class="col-md-12 col-xs-12" style="background:#379bf4;">产品名词</div>');
													break;
												case 'nr':
													oHtml.push('<span class="m-5" style="background:#8B0A50;">'+allSeggedWord[i].word+'</span>');
													lexFea.push('<div class="col-md-12 col-xs-12" style="background:#8B0A50;">人名</div>');
													break;
												case 'vf':
													oHtml.push('<span class="m-5" style="background:#DA70D6;">'+allSeggedWord[i].word+'</span>');
													lexFea.push('<div class="col-md-12 col-xs-12" style="background:#DA70D6;">动词</div>');
													break;
												case 'vo':
													if(allSeggedWord[i].word.length == 1){
														oHtml.push('<span class="m-5" style="background:red;">'+allSeggedWord[i].word+'</span>');
													}else{
														oHtml.push('<span class="m-5" style="background:#f58096;">'+allSeggedWord[i].word+'</span>');
													}
													break;
												case 'a':
													oHtml.push('<span class="m-5" style="background:#ffd799;">'+allSeggedWord[i].word+'</span>');
													lexFea.push('<div class="col-md-12 col-xs-12" style="background:#ffd799;">形容词</div>');
													break;
												case 'b':
													oHtml.push('<span class="m-5" style="background:#ecd74c;">'+allSeggedWord[i].word+'</span>');
													lexFea.push('<div class="col-md-12 col-xs-12" style="background:#ecd74c;">限定词</div>');
													break;
												case 'd':
													oHtml.push('<span class="m-5" style="background:#FFCCCB;">'+allSeggedWord[i].word+'</span>');
													lexFea.push('<div class="col-md-12 col-xs-12" style="background:#FFCCCB;">副词</div>');
													break;
												case 'p':
													oHtml.push('<span class="m-5" style="background:#99CC67;">'+allSeggedWord[i].word+'</span>');
													lexFea.push('<div class="col-md-12 col-xs-12" style="background:#99CC67;">介词/连词</div>');
													break;
												case 'r':
													oHtml.push('<span class="m-5" style="background:#9ACCCD;">'+allSeggedWord[i].word+'</span>');
													lexFea.push('<div class="col-md-12 col-xs-12" style="background:#9ACCCD;">代词</div>');
													break;
												case 'u':
													oHtml.push('<span class="m-5" style="background:#4DD9E6;">'+allSeggedWord[i].word+'</span>');
													lexFea.push('<div class="col-md-12 col-xs-12" style="background:#4DD9E6;">助词</div>');
													break;
												case 'm':
													oHtml.push('<span class="m-5" style="background:#FF9899;">'+allSeggedWord[i].word+'</span>');
													lexFea.push('<div class="col-md-12 col-xs-12" style="background:#FF9899;">量词</div>');
													break;
												case 'w':
													oHtml.push('<span class="m-5" style="background:#C4C4C4;">'+allSeggedWord[i].word+'</span>');
													lexFea.push('<div class="col-md-12 col-xs-12" style="background:#C4C4C4;">标点符号</div>');
													break;
												case 'l':
													oHtml.push('<span class="m-5" style="background:#c5c5c5;">'+allSeggedWord[i].word+'</span>');
													lexFea.push('<div class="col-md-12 col-xs-12" style="background:#c5c5c5;">其它</div>');
													break;
												case 'g':
													if(allSeggedWord[i].word.length == 1){
														oHtml.push('<span class="m-5" style="background:red;">'+allSeggedWord[i].word+'</span>');
													}else{
														oHtml.push('<span class="m-5" style="background:#CAFF70;">'+allSeggedWord[i].word+'</span>');
													}
													break;
												case 'stop':
													oHtml.push('<span class="m-5" style="background:#8F8F8F;">'+allSeggedWord[i].word+'</span>');
													lexFea.push('<div class="col-md-12 col-xs-12" style="background:#8F8F8F;">停用词</div>');
													break;
											}
										}
									}
								}
							}
							var new_Lexfea = [];
							for(var k = 0;k < lexFea.length;k++){
								var items = lexFea[k];
								if($.inArray(items,new_Lexfea)==-1){
									new_Lexfea.push(items);
								}
							}
							$(".termResu1 .termResu1Con").html(oHtml);
							var isRed = false;
							for(var i = 0;i < $('.termResu1Con span').length;i++){
								if($('.termResu1Con span').eq(i).attr('style') == 'background:red;'){
									isRed = true;
								}
							}
							if(isRed){
								$('.termTips').css('display','block');
								$(".oneTips").html('已识别到您的流程中有不明确的单字词语，在右侧红色标出，请自行选择补充！');
							}else{
								$('.termTips').css('display','none');
								$(".oneTips").html('');
							}

							$(".LexiFeats").html(new_Lexfea);
							$('#termResuContainer').show();
						}else{
							$('#termResuContainer').hide();
							//$("#phraseFeat").css('display','none');
						}
					}
					if(sentence){
						$('#intelMatch .switchery').trigger('click');
						$("#macthPharse").text('系统匹配：'+sentence);
					}
				}else{
					if(getCheckQue){
						if (getCheckQue.length) {
							var html=[];
							for(var i=0;i<getCheckQue.length;i++){
								if(getCheckQue[i].matchQuestion){
									/*
									 * taskId = 426 相似问题进入流程
									 * 通过后台返回的参数solutionType判断，1为问题，2为流程
									 */
									if(getCheckQue[i].matchQuestion.solutionType == 1){
										html.push('<div class="col-md-12"><a data-num="0" data-name="问题详细"  href="../../web/knowledge/queDetail.html?id=' + getCheckQue[i].matchQuestion.solutionId + '" sid="' + getCheckQue[i].matchQuestion.id + '"  rel="' + getCheckQue[i].matchQuestion.solutionId + '" class="searchDetailQue_a">' + (i + 1) + '.&nbsp;' + getCheckQue[i].matchQuestion.question + '</a></div>');
									}else{
										html.push('<div class="col-md-12"><a data-num="0" data-name="流程详细"  href="../../web/knowledge/editFlow.html?questionId=' + getCheckQue[i].matchQuestion.solutionId + '&solutionId='+ getCheckQue[i].matchQuestion.solutionId +'&groupId='+getCheckQue[i].matchQuestion.groupId+'" sid="' + getCheckQue[i].matchQuestion.id + '"  rel="' + getCheckQue[i].matchQuestion.solutionId + '" class="searchDetailQue_a">' + (i + 1) + '.&nbsp;' + getCheckQue[i].matchQuestion.question + '</a></div>');
									}
								}
							}
							$('#simiYinHide').html('<div class="col-md-12 col-xs-12 m-5" style="padding-left:0;padding-right:0;">此问题已存在以下相似问法：</div><div class="simiQueLtHide"></div>');
							$('.simiQueLtHide').append(html.join(''));
							if(e.val() !== '') {
								var terms = e.val().split('');
								var aValue=$('.simiQueLtHide').html();
								$.each(terms, function(i, n){
									if(aValue.indexOf(n)>0){
										//$('.simiQueLt').highlight(n);
									}
								});
							}
						}
						$('#simiYinContainerHide').show();
					}else{
						$('#simiYinContainerHide').hide();
					}
				}
			}
		} else {
		    if(data.message == '该问题已存在！') {
		       // yunNotyError('该流程已存在！');
		    }else {
				$('#simiYinContainer').hide();
				$('#simiYinContainerHide').hide();
				$("#intelMatchContainer").hide();
				$("#termResuContainer").hide();
				$("#phraseFeat").hide();
	      	}
    	}
	});
}
	//实时监控input中的值变化   非IE
	$('#question')[0].oninput = function () {
		check_flow($(this));
	};
	//实时监控input中的值变化   IE
	$('#question')[0].onpropertychange = function () {
		check_flow($(this));
	};

	$(document).on('blur', '[name="form_Question"]', function () {
        var question = $(this).val().trim();
        $.get("../../question/isExistQue", 'question='+encodeURI(question)+'&level=1', function (data) {
            if (data.message == '该问题已存在！') {
                yunNotyError('该流程已存在！');
            } 
        });
    });
   
//修改流程ajax
var flag_edit_question = false;
var flag_edit_answer = false;
function EditFlow() {
	var AnswerId = $('#AnswerId').val();
	//流程内容
	var question = $('#question').val();
	if(question === '' || question.length < 2 || question.length > 200) {
		yunNotyError("流程名称长度需在2-200个字符之间！");
		return false;
	}
	//流程分组ID
	var groupId = $('input[name=ClassesIds]').val();
	if(groupId === '') {
		yunNotyError("请选择流程分类！");
		return false;
	}
	//标签id集合
	var labelidsL=$('input[name=labelesIds]').val();
	//消息类型 6流程
	var mode = 6;
	//流程生效否0是1
	var answerTimeLiness = 0;
	//流程生效起
	var answerStartTime = '';
	//流程生效止
	var answerEndTime = '';
	//答案内容
	var answer = '';
	//答案生效规则
	var effectiveRules = [];
	//answer = $('#flow_text').val();
	answer = flowUE.getContent();
	if(answer === '' || answer.length < 2 || answer.length > 20000) {
		yunNotyError("流程描述长度需在2-20000个字符之间！");
		return false;
	}
	if($('#AddQuesForm [name=StartTime]').val() !== '' && $('#AddQuesForm [name=EndTime]').val() !== '') {
		answerStartTime = $('#AddQuesForm [name=StartTime]').val();
		answerEndTime = $('#AddQuesForm [name=EndTime]').val();
		answerTimeLiness = 1;
	}
	var effectiveRule1 = {
		'type' : 1,
		'roleIds' : ""
	};
	$('#DivRule_Way a.btn-primary').each(function() {
		effectiveRule1.roleIds += $(this).attr('fid')+",";
	});
	if(effectiveRule1.roleIds === "") {
		effectiveRule1.roleIds = "-1";
	} else {
		effectiveRule1.roleIds = effectiveRule1.roleIds.substring(0,effectiveRule1.roleIds.length-1);
	}
	//console.log(effectiveRule1.roleIds);
	var effectiveRule2 = {
		'type' : 2,
		'roleIds' : ""
	};
	if($('#AddQuesForm input[name=hasCheckedId]').length) {
  	effectiveRule2.roleIds = $('#AddQuesForm input[name=hasCheckedId]').val().split('~').join(',');
	} else {
		effectiveRule2.roleIds = "";
	}
	if(effectiveRule2.roleIds === "") {
		effectiveRule2.roleIds = "-1";
	}
	//console.log(effectiveRule2.roleIds);
	effectiveRules.push(effectiveRule1);
	effectiveRules.push(effectiveRule2);
	effectiveRules = JSON.stringify(effectiveRules);
	//console.log(JSON.stringify(effectiveRules));
	var dataJSON1 = {
		question : question,
		groupId : groupId,
		labelIds:labelidsL, //标签id集合
		solutionId : SolutionId,
		questionId : QuestionId
	};
	var dataJSON2 = {
		answerId : AnswerId,
		solutionId : SolutionId,
		groupId : groupId,
		labelIds:labelidsL, //标签id集合
		mode : 6,
		modeValue : '',
		timeLiness : answerTimeLiness,
		startTime : answerStartTime,
		endTime : answerEndTime,
		answer : answer,
		effectiveRules : effectiveRules
	};
	//console.log(dataJSON);
	if (flag_edit_question) {
		return;
	}
	flag_edit_question = true;
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../question/editQuestion'),
		data: dataJSON1,
		success: function(data) {
			flag_edit_question = false;
			if (data.status === 0) {
				if (flag_edit_answer) {
					return;
				}
				flag_edit_answer = true;
				$.ajax({
					type: 'post',
					datatype: 'json',
					cache: false,
					//不从缓存中去数据
					url: encodeURI('../../answer/doEditAnswer'),
					data: dataJSON2,
					success: function(data) {
						flag_edit_answer = false;
						if (data.status === 0) {
							yunNoty(data,function() {
									history.go(-1);
							});
						} else {
							yunNoty(data);
						}
					}
				});
			} else {
				yunNoty(data);
			}
		}
	});
}

function getRule() {
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../Configuration/listAllItem'),
		success: function(data) {
			if(data.status === 0) {
				var List = [];
				if(data.listItem) {
					List = data.listItem;
				} else {
					return;
				}
				for(var i in List) {
					if(List[i].ConfigItemDesc == '生效渠道') {
						if(List[i].IsDisplay === 1) {
							$('#DivRule_Way').remove();
						} else if(List[i].IsDisplay === 0) {
							$.ajax({
								type: 'post',
								datatype: 'json',
								cache: false,
								//不从缓存中去数据
								url: encodeURI('../../Configuration/listValue'),
								data: {
									itemId: List[i].Id
								},
								success: function(data) {
									if(data.status === 0) {
										if(data.listValue) {
											$('#DivRule_WayItem').empty();
                      $('#DivRule_WayItem').append('<input id="wayAll" type="checkbox"><label for="wayAll" style="margin: 5px;">全选</label>');
                      $('#wayAll').iCheck({
                        checkboxClass: 'icheckbox_flat-blue',
                        radioClass: 'iradio_flat-blue',
                        cursor: true
                      });
											for(var key in data.listValue) {
												$('#DivRule_WayItem').append('<a class="btn btn-white m-r-5 m-b-5" fid="'+data.listValue[key].DicCode+'">'+data.listValue[key].DicDesc+'</a>');
											}
										}
									}
								}
							});
						}
					} else if(List[i].ConfigItemDesc == '生效角色') {
						if(List[i].IsDisplay === 1) {
							$('#DivRule_Role').remove();
						}
					} else if(List[i].ConfigItemDesc == '生效时间') {
						if(List[i].IsDisplay === 1) {
							$('#DivRule_Time').remove();
							$('#dateTime').remove();
						}
					}
				}
			}
		}
	});
}
