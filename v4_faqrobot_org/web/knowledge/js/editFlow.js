var QuestionId = getUrlParam('questionId');
var SolutionId = getUrlParam('solutionId');
var GroupId = getUrlParam('groupId');
var richtextAdd = UE.getEditor('contentAdd', {
    toolbars: [
        [
            'source', '|', 'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor',
            'selectall', 'cleardoc', '|', 'fontfamily', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
            'link', 'unlink', '|', 'imagenone', 'simpleupload', 'insertimage', 'emotion', 'insertvideo', 'attachment', 'map', 'insertframe', 'horizontal', 'date', 'time', 'wordimage'
        ]
    ],
    solutionId: SolutionId,
    initialFrameHeight: 200,
    wordCount: true,
    maximumWords: 20000,
    retainOnlyLabelPasted: true,
    pasteplain: true
});
var richtextEdit = UE.getEditor('contentEdit', {
    toolbars: [
        [
            'source', '|', 'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor',
            'selectall', 'cleardoc', '|', 'fontfamily', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
            'link', 'unlink', '|', 'imagenone', 'simpleupload', 'insertimage', 'emotion', 'insertvideo', 'attachment', 'map', 'insertframe', 'horizontal', 'date', 'time', 'wordimage'
        ]
    ],
    solutionId: SolutionId,
    initialFrameHeight: 200,
    wordCount: true,
    maximumWords: 20000,
    retainOnlyLabelPasted: true,
    pasteplain: true
});
$(document).ready(function () {

    //switchery 初始化
    function renderSwitcher() {
        var green = "#00acac",
            red = "#ff5b57",
            blue = "#348fe2",
            purple = "#727cb6",
            orange = "#f59c1a",
            black = "#2d353c";
        if ($("[data-render=switchery]").length !== 0) {
            $("[data-render=switchery]").each(function () {
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
                t.disabled = $(this).attr("data-disabled") ? true : false;
                t.disabledOpacity = $(this).attr("data-disabled-opacity") ? $(this).attr("data-disabled-opacity") : 0.5;
                t.speed = $(this).attr("data-speed") ? $(this).attr("data-speed") : "0.5s";
                var n = new Switchery(this, t);
            });
        }
    };
    renderSwitcher();

    iframeTab.init({iframeBox: ''});
    $(document).on('click', '.welcomeWords', function () {
        ifbOpenWindowInNewTab('/web/knowledge/queDetail.html?id=' + $(this).attr('questionid'), '问题详细', 'jj');
    });
    richtextAdd.ready(function () {

        /*$('#contentAdd .edui-for-添加流程引导').attr({
         'data-step': "2",
         'data-intro': '点击这里，可以设置相应的流程项！'
         });*/

        // 新手引导(需要引导的页面的code即为页面名称)
        Base.request({
            url: 'tipHelp/check',
            params: {
                code: 'editFlow',
            },
            callback: function (data) {
                if (data.status) {//旧
                } else {//新
                    var a = introJs().setOptions({
                        'prevLabel': '上一步',
                        'nextLabel': '下一步',
                        'skipLabel': '　',
                        'doneLabel': '　',
                        'showBullets': false,//隐藏直接跳转按钮(避免onchangebug)
                    }).start();
                    a.onchange(function (obj) {//已完成当前一步
                        var curNum = parseInt($(obj).attr('data-step').match(/\d+/)[0]);//当前的下标

                        /*// 弹出流程项框
                         if(curNum==2 && !window.a) {
                         console.log(curNum, 'b')
                         a.exit();
                         $('#addFlowModal').modal('show');
                         $('#addFlowModal').on('show.bs.modal', function () {
                         console.log(123)
                         //a.goToStep(2);
                         window.a = true;

	                    	});
	                    }else {
	                		console.log(curNum, 'a')
	                    	$('.tipStep'+ (curNum-1)).hide();//隐藏前一个
		                    $('.tipStep'+ (curNum+1)).hide();//隐藏后一个
		                    $(obj).show();//显示当前
	                    }*/
	                    $('.tipStep'+ (curNum-1)).hide();//隐藏前一个
	                    $('.tipStep'+ (curNum+1)).hide();//隐藏后一个
	                    $(obj).show();//显示当前
	                });


	            }
	        },
	    });
	});

	App.init();
	$('#info').addWordCount(200);
	$('#infoEdit').addWordCount(200);
	//列出流程项
	listFlow();
	//列出相似问法表格
	listSimilar();

	$('body').on('keyup', '#searchString', function(event) {
		if(event.which == '13') {
			listFlowItems();
		}
	});
	$('body').on('keyup', '#searchSimilar', function(event) {
		if(event.which == '13') {
			listSimilar();
		}
	});
	$('body').on('keyup', '#similarQuestion', function(event) {
		if(event.which == '13') {
			addSimilar();
		}
	});
	//ENTER
	$(document).on('keyup', function(e) {
		var $activeEl = $(document.activeElement);

		if($activeEl.is('[placeholder=输入修改后的问题]') && (e.keyCode==13||e.keyCode==108)) {
			$('.ensureQue').trigger('click');
		}
	});
	//流程项跳转
	$('body').on('click', '.wflink', function() {
		$this = $(this);
		var fid = $this.attr('rel');
		var tarObj = $('#wf_'+fid);
		if(tarObj.length==0){
			$.ajax({
				type:'post',
				cache:false,
				url:encodeURI('../../flowitem/getQueAndAnsByFlowId'),
				data:{id:fid},
				success: function(data){
					if(data.status == "0") {
						var que = data.question.Id;
						var gro = data.question.GroupId;
						var sol = data.question.SolutionId;
					var ht = '';
					ht+='/web/knowledge/editFlow.html?questionId='+que+'&groupId='+gro+'&solutionId='+sol+'&flowItemId='+fid;
						ifbOpenWindowInNewTab(ht, '流程详细');
					}
				}
			})
		}
		//所有框恢复初始状态
		$('.Ider').css('border-color', '#E4E4E4');
		$('.Ider').find('.changespan').css('color', '#707478');
		$('.Ider').find('.IderHead').css('background-color', '#fff');
		$('.Ider').find('a.sha').css('color', '#23527c');
		$('.Ider').find('a.sha:hover').css('color', '#23527c');
		//窗口滚动到下一步
		$.scrollTo('#wf_'+fid,500);
		//变化
		tarObj.animate({borderColor: '#DE5246'},800);
		tarObj.find('.changespan').animate({color: '#fff'},800);
		tarObj.find('.IderHead').animate({backgroundColor: '#DE5246'},800);
		//修改和删除标签变白色
		tarObj.find('a.sha').css('color', '#fff');
		tarObj.find('a.sha:hover').css('color', '#fff');
	});

	//添加流程项表单验证
	$('#addFlowForm').validate({
		rules:{
			info:{
				required:true,
				minlength:2,
				maxlength:200
			}
		},
		messages:{
			info:{
				required:'请输入流程项描述！',
				minlength:'流程项描述的长度为2-200个字符！',
				maxlength:'流程项描述的长度为2-200个字符！'
			}
		},
		submitHandler: addFlow
	});
	//修改流程项表单验证
	$('#editFlowForm').validate({
		rules:{
			info:{
				required:true,
				minlength:2,
				maxlength:200
			}
		},
		messages:{
			info:{
				required:'请输入流程项描述！',
				minlength:'流程项描述的长度为2-200个字符！',
				maxlength:'流程项描述的长度为2-200个字符！'
			}
		},
		submitHandler: editFlow
	});
	$('#flowContent').on("mouseenter mouseleave", '.Ider', function(event){
		if(event.type == "mouseenter"){
			//鼠标进入
			$(this).children().find('a.sha').show();
		}else if(event.type == "mouseleave"){
			//鼠标离开
			$(this).children().find('a.sha').hide();
		}
	});

	//修改流程分类模态窗
	$('.treeDivModal').slimScroll({
		height: '400px'
	});
	$('#QuestionClassModel').on('show.bs.modal', function () {
		$.fn.zTree.init($("#treeQueClass"),classsetting,[]);
	});
	$('#QuestionClassModel').on('hide.bs.modal', function () {
		$('#QuestionClassModel [name=treeId]').val('');
	});
	$('#selClassBtn').on('click', function() {
		$.ajax({
			type:'get',
			datatype:'json',
			cache:false,
			url:encodeURI('../../question/editQuestion'),
			data:{
				solutionId: SolutionId,
				questionId: QuestionId,
				groupId: $('#QuestionClassModel [name=treeId]').val(),
				question: $('.queTitle').text()
			},
			success: function(data) {
				if(data.status == 0) {
					$('#chClass').text($('#QuestionClassModel [name=treeName]').val());
					yunNoty(data);
				} else {
					yunNoty(data);
				}
			}
		});
		$('#QuestionClassModel').modal('hide');
	});
});

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

var flag_ensureQue = false;
var tmpNum=parent.$('#tabHeader li[data-tab="'+location.href+'"]').attr('data-num');//此处将tmpNum定义成了data-num
//列出流程问题和答案
function listFlow() {
	var dataJSON = {
		id : QuestionId
	};
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,
		url:encodeURI('../../question/getQuestionById'),
		data:dataJSON,
		success: function(data) {
			if(data.status == 0) {
				var html ='';
				if(data.question) {
					var ListAnswer = data.question.ListAnswer,
					ansStr = '',
					ansThisIndex = '';

					for(var j=0; j<ListAnswer.length; j++) {
						var ansItem_focus = '';
						if(!j) {//第一个答案
							ansItem_focus = 'ansItem_focus';
						}
						if(ListAnswer.length > 1) {
							ansThisIndex = j+1;
						}
						var EnterflowItem = '';
						var efiSpan = '';
						if(ListAnswer[j].ModeValue !== null) {
							EnterflowItem = '#' + ListAnswer[j].ModeValue + '-' + ListAnswer[j].ModeInfo;
							efiSpan = '<span class="dot">|</span>';
						}
						var AnswerStatus = '';
						AnswerStatus += '<option value="0">已发布</option><option value="-1">暂存</option><option value="-2">等待审核</option><option value="-3">返回修改</option><option value="-4">已过期</option><option value="-5">等待生效</option>';

                        ansStr += '<div class="ansItem '+ ansItem_focus +'" Id="'+ ListAnswer[j].Id +'" GroupId="'+ ListAnswer[j].GroupId +'" SolutionId="'+ ListAnswer[j].SolutionId +'" Webid="'+ ListAnswer[j].Webid +'" SubSolutionId="'+ ListAnswer[j].SubSolutionId +'"><div class="ansItemCtn"><span class="timeTip ansItemImg" style="background:url(' + "./images/flow.png" + ') no-repeat" title="" data-original-title="流程"></span><span class="ansIndex">流程描述'+ ansThisIndex +'</span><div class="listAnswer">'+ ListAnswer[j].Answer +'</div></div><div class="ansItemFrom"><span>来自:<em>'+ ListAnswer[j].UserName +'</em></span><span class="dot">|</span>'+showRule(ListAnswer[j],data.sourceList)+'<span>浏览<em>'+ (ListAnswer[j].Hits || 0) +'</em>次</span><span class="dot">|</span><a><span><select cur="'+ ListAnswer[j].AnswerStatus +'">'+ AnswerStatus +'</select></span></a><span class="dot">|</span><span><span class="glyphicon glyphicon-thumbs-up" title="赞"></span><em>'+ (ListAnswer[j].Usefull || 0) +'</em>次</span><span class="dot">|</span><span><span class="glyphicon glyphicon-thumbs-down" title="踩"></span><em>'+ (ListAnswer[j].Useless || 0) +'</em>次</span><span class="dot">|</span>';
						//生效时间配置
                        var timeStr = "";
                        if(ListAnswer[j].TimeLiness == 1){
                            if(ListAnswer[j].StartTime && ListAnswer[j].EndTime){
                                timeStr = '<span>生效时间：' + ListAnswer[j].StartTime + '-' + ListAnswer[j].EndTime + '</span><span class="dot">|</span>'
                            } else if(ListAnswer[j].StartTime) {
                                timeStr = '<span>起始时间：' + ListAnswer[j].StartTime + '</span><span class="dot">|</span>'
                            } else if(ListAnswer[j].EndTime) {
                                timeStr = '<span>结束时间：' + ListAnswer[j].EndTime + '</span><span class="dot">|</span>'
                            }
						}else{
                            timeStr = "";
						}
                        ansStr += timeStr;

						ansStr +='<a href="editAnswer.html?solutionId='+ ListAnswer[j].SolutionId +'&groupId='+ ListAnswer[j].GroupId +'&answerId='+ ListAnswer[j].Id + '&question=' + data.question.Question + '&tmpNum='+tmpNum+'" data-num="0" data-name="修改流程描述"><span class="timeTip glyphicon glyphicon-pencil" title="编辑流程描述"></span></a>'+efiSpan+'<a href="javascript:;" class="flowSelectA" fid="'+ ListAnswer[j].Id +'">'+(EnterflowItem===''?'<span class="timeTip glyphicon glyphicon-th-list" title="选择该描述的入口流程项"></span>':EnterflowItem)+'</a>';
						if(ListAnswer.length > 1) {
							ansStr += efiSpan+'<a><span class="oneDelAns timeTip glyphicon glyphicon-trash" title="删除流程描述"></span></a>';
						}
						ansStr += '</div></div>';
					}

					var Status = '';
					Status += '<option value="0">已发布</option><option value="-1">暂存</option><option value="-2">等待审核</option><option value="-3">返回修改</option><option value="-4">已过期</option><option value="-5">等待生效</option>';

					var editAnswer = '<a href="editAnswer.html?solutionId='+ data.question.SolutionId +'&groupId='+ data.question.GroupId + '&question=' + data.question.Question +'&isFlow=1'+'&tmpNum='+tmpNum+'" data-num="0" data-name="新增流程描述"><span class="timeTip glyphicon glyphicon-plus" title="新增流程描述"></span></a>';
					if(data.question.SolutionType == 2) {
						editAnswer = '';
					}
					
					var labelName=data.question.LabelName;
						if(labelName==null){
							labelName="无";
					}
					var entityList = '';
					if(data.question.Entitys){
						entityList = data.question.Entitys;
					}else{
						entityList = '';
					}

					html += '<tr Id="'+ data.question.Id +'" entity="'+entityList+'" sgId="'+data.question.SgId+'" GroupId="'+ data.question.GroupId +'" SolutionId="'+ data.question.SolutionId +'"><td style="border-top: none;padding: 0;"><div class="theWholeCtn"><legend>流程</legend><div class="titleCtn margint10"><span class="queTitle">'+ data.question.Question +'</span><a><span class="editQue timeTip glyphicon glyphicon-edit" title="修改流程"></span></a></div>  <div class="queWholeCtn margint10"><span>来自:<em>'+ data.question.UserName +'</em></span><span class="dot">|</span><span>分类:<a class="editClass" id="chClass"><em class="timeTip" data-original-title="选择分类：问题分类是创建知识的基础，不建分类无法创建知识">'+ ListAnswer[0].GroupName +'</em></a></span><span class="dot">|</span><span>标签:<a class="editLabels"><em class="timeTip" data-original-title="标签：便于解决知识交叉分类的需求">' + labelName + '</em></a></span><span class="dot">|</span>'+('<span class="interTerm1">智能句式:<a style="cursor: pointer;" data-toggle="modal tooltip" data-type="SgName"><em>' + (data.question.SgName || '暂无') + '</em></a><span class="spanInter" style="opacity:0;"></span></span><span class="dot">|</span>')+'<span>浏览<em>'+ (data.question.Hits || 0) +'次</em></span><span class="dot">|</span><a><span><select class="editStatus" cur="'+ data.question.Status +'">'+ Status +'</select></span></a><span><span class="dot">|</span><span class="glyphicon glyphicon-thumbs-up" title="赞"></span><em>'+ (data.question.Usefull || 0) +'</em>次</span><span class="dot">|</span><span><span class="glyphicon glyphicon-thumbs-down" title="踩"></span><em>'+ (data.question.Useless || 0) +'</em>次</span></span><span class="dot">|</span><span>'+ editAnswer +'</span><a><span class="oneDelQue timeTip glyphicon glyphicon-trash" title="删除流程"></span></a></div></div>  <div class="theWholeCtn"><legend>流程描述</legend><div class="queCtn">'+ ansStr +'</div></div></td></tr>';

				}
				$('.tbody1').empty().append(html);
				if(sessionStorage.getItem('sentenceValue') == 1){
					$('.interTerm1').css('display','inline-block');
					$('.interTerm1').next().css('display','inline-block');
				}else{
					$('.interTerm1').css('display','none');
					$('.interTerm1').next().css('display','none');
				}
				/*$('.interTerm1').tooltip({
		          	'placement':'right'
		        });*/
				clickLabelEdit();  //修改标签
				
				$('.interTerm1>a').hover(function(){
					if($(".queWholeCtn").parents('tr').attr('sgid')==="null"){
						//$(".spanInter").css('opacity',1);
						//var html="<div>智能句式：在添加问题时引用该句式组，即可用句式组下面的问法去咨询该问题</div>"
						//$(".spanInter").html(html);
						$("[data-toggle~=tooltip]").tooltip({
							'html':true,
							'title':"<div>智能句式：在添加问题时引用该句式组，即可用句式组下面的问法去咨询该问题</div>",
							'placement':"right",
							'template':'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="min-width: 200px;text-align: left"></div></div>'
						}).tooltip('show');
					}else{
						sentenceInter();
					}	
				},function(){
					$(".spanInter").html('');
					$(".spanInter").css('opacity',0);
				});

				$('.interTerm1 a').click(function(){
					$('#modal-intelTerm').modal('show');
					$('#EntitysList .entityTio').val();
					$('#EntitysList .entityTio').val($('.interTerm1').parents('tr').attr('entity'));
					$('[name="checkedId"]').val($(".queWholeCtn").parents('tr').attr('sgid'));
				});

				
			
				$('.timeTip').tooltip();
				$('.ansItemCtn .listAnswer').each(function () {
					if ($(this).height() == 400) {
						$(this).slimScroll({
							allowPageScroll: false,
							height: '100%',
						}).trigger('mouseout')
					}
				})
				$('#chClass').click(function() {
					$('#QuestionClassModel').modal('show');
				});

				groupId2 = $('.tbody1 tr').attr('groupid');
				solutionId2 = $('.tbody1 tr').attr('solutionId');
				$("#modal-intelTerm input[name=solutionId]").val(solutionId2);
				$('select').each(function() {
					switch(parseInt($(this).attr('cur'))) {
						case 0:
						$('option', $(this)).eq(0).attr({'selected': 'true'});
						break;
						case -1:
						$('option', $(this)).eq(1).attr({'selected': 'true'});
						break;
						case -2:
						$('option', $(this)).eq(2).attr({'selected': 'true'});
						break;
						case -3:
						$('option', $(this)).eq(3).attr({'selected': 'true'});
						break;
						case -4:
						$('option', $(this)).eq(4).attr({'selected': 'true'});
						break;
						case -5:
						$('option', $(this)).eq(5).attr({'selected': 'true'});
						break;
					}
					/*if($(this).is('.editStatus')) {
						if(parseInt($(this).attr('cur'))) {
							$('select:not(.editStatus)').attr({'disabled': 'true'}).addClass('notSelect');
						}
					}*/
				});

				//修改问题
				$('body').on('click', '.editQue', function() {
					var $titleCtn = $(this).parents('.titleCtn'),
					$editTitleCtn = $('<div><input type="text" name="simiQue" class="form-control" placeholder="输入修改后的问题" style="max-width: 60%; display: inline-block; margin: 5px 10px 5px 0;"></td><td></td><td><a class="ensureQue"><span class="timeTip glyphicon glyphicon-ok" title="确定" style="margin-right: 5px;"></span></a><a class="cannelQue"><span class="timeTip glyphicon glyphicon-remove" title="取消"></span></a></div>');

					if(!$titleCtn.next().find('.ensureQue')[0]) {
						$titleCtn.after($editTitleCtn);
						$editTitleCtn.hide().fadeIn();
						$('.timeTip').tooltip();
						$editTitleCtn.find('input').val($titleCtn.find('.queTitle').text()).focus();
					}
				});

				//确认修改问题
				$('body').on('click', '.ensureQue', function() {
					var $tr = $(this).parents('tr'),
						$input = $(this).prev('input'),
						question = $input.val();

					if (flag_ensureQue) {
						return;
					}
					flag_ensureQue = true;
					$.ajax({
						type:'post',
						datatype:'json',
						cache:false,
						url:encodeURI('../../question/editQuestion'),
						data:{
							solutionId: $tr.attr('solutionId'),
							groupId: $tr.attr('groupId'),
							questionId: $tr.attr('id'),
							question: question,
						},
						success: function(data) {
							flag_ensureQue = false;
							if(data.status == "0") {
								yunNoty(data);
								$tr.find('.queTitle').text(question);
								$input.parent().fadeOut(function() {
									$(this).remove();
								});
							} else {
								yunNoty(data);
							}
						}
					});
				});

				//取消修改问题
				$('body').on('click', '.cannelQue', function() {
					var $div = $(this).parent('div');
					$div.fadeOut(function() {
						$(this).remove();
					});
				});

				//添加问题
				$('.addQue').on('click', function() {
          var ifT = iframeTab.init({iframeBox: ''});
          ifT.refreshTab('/web/knowledge/addQuestion.html','新增流程');
				});


				//修改问题状态
				$('body').on('change', 'select', function() {
					var $tr = $(this).parents('tr'),
					$ansItem = $(this).parents('.ansItem'),
					status = 0;

					$('option', $(this)).each(function(i) {
						if($(this).prop('selected')) {
							status = i;
						}
					});

					switch(status) {
						case 0:
							status = 0;
							break;
						case 1:
							status = -1;
							break;
						case 2:
							status = -2;
							break;
						case 3:
							status = -3;
							break;
						case 4:
							status = -4;
							break;
						case 5:
							status = -5;
							break;
					}

					if($(this).is('.editStatus')) {
						$.ajax({
							type:'get',
							datatype:'json',
							cache:false,
							url:encodeURI('../../question/doUpdateStatus'),
							data:{
								solutionId: $tr.attr('solutionId'),
								status: status
							},
							success: function(data) {
								yunNoty(data);
							}
						});
					}else {
						$.ajax({
							type:'get',
							datatype:'json',
							cache:false,
							url:encodeURI('../../answer/updateStatus'),
							data:{
								answerId: $ansItem.attr('id'),
								groupId: $ansItem.attr('groupId'),
								status: status
							},
							success: function(data) {
								yunNoty(data);
							}
						});
					}
				});
				$('.ansItem').on('mouseenter mouseleave', function(event) {
					if(event.type == "mouseenter"){
						//鼠标进入
						$(this).addClass('ansItem_focus');
					}else if(event.type == "mouseleave"){
						//鼠标离开
						$(this).removeClass('ansItem_focus');
					}
				});
				$('.flowSelectA').on('click', function() {
					$('#flowSelectModel').modal('show');
					$('#flowAnswerId').val($(this).attr('fid'));
					listFlowItemModal();
				});
				listFlowItems();
			}
		}
	});
}

	//选择智能句式组后匹配出对应下面的句式
	function sentenceInter(){
		var html = '系统已生成下列几种句式：<br />';
		$.ajax({
			type:"post",
			url:"../../KnSentenceItem/getKSItemList",
			async:true,
			cache:true,
			data:{'sgId':$(".queWholeCtn").parents('tr').attr('sgid')},
			success:function(data){
				if(data.status==0){
					var list = data.knList;
					if(list.length===0){
						html = '这个句式组下没有句式！<br />';
					}
					//如果配置项sentenceShow==0且大于5条，则只显示5条；否则全部显示
					if(sessionStorage.getItem('sentenceShow')==0){
						if(list.length>=5) {
							for (var i = 0; i < 5; i++) {
								html += (i + 1) + '.' + list[i].SiName + '<br />';
							}
						}else{
                            for(var i = 0;i < list.length;i++){
                                html += (i+1)+'.'+list[i].SiName+'<br />';
                            }
                        }
					}else{
						for(var i = 0;i < list.length;i++){
							html += (i+1)+'.'+list[i].SiName+'<br />';
						}
					}
						$(".spanInter").css('opacity',1);
					$('[data-toggle~=tooltip]').tooltip({
						'html':true,
						'title':html,
						'placement':"right",
						'template':'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="min-width: 200px;text-align:left;"></div></div>'
					}).tooltip('show');
				}
			}
		})
	}
var $ansItem = null,
	$tr = null;
//确认删除答案或问题
$('#delYes').on('click', function() {
	var title = $('#tipTitle').text();
	if(title == '删除答案') {
		$.ajax({
			type:'get',
			datatype:'json',
			cache:false,
			url:encodeURI('../../answer/deleteAnswer'),
			data:{
				solutionId: $ansItem.attr('solutionId'),
				groupId: $ansItem.attr('id'),
				id: $ansItem.attr('id'),
			},
			success: function(data) {
				if(data.status == "0") {
					yunNoty(data);
					$('#delAnsConfirm').modal('hide');
					listFlow();
				} else {
					yunNoty(data);
				}
			}
		});
	}
	if(title == '删除流程') {//没有关联关系  确定删除
		queDetele('#delAnsConfirm');
	}
});

//删除答案或问题
$('body').on('click', '.oneDelAns, .multDelAns, .oneDelQue, .multDelQue', function(e) {
	$ansItem = $(this).parents('.ansItem');
	$tr = $(this).parents('tr');
	var ansItemLen = $tr.find('.ansItem').length;
	if($(e.target).is('.oneDelAns')) {//单个删除答案
		if(ansItemLen == 1) {
			var tmpOBj={"message":"问题至少要有一个答案","status":1};
			yunNoty(tmpOBj);
		}else {
			$('#delAnsConfirm').modal('show');
			$('#tipTitle').text('删除答案');
			$('#tipWord').text('确认删除该答案？');
		}
	}
	/*
	 *  taskId = 543 删除问题、流程、流程项的处理
	 *  1、单个删除时查询流程是否存在关联关系
	 *     如果data.ref存在且data.ref等于1则有关联关系：
	 *  2、有关联关系时判断是否能进入回收站：
	 *      （1）：如果data.canNotRenewSolutionList的长度为0：
	 *            可以进入回收站
	 *      （2）否则不能进入回收站：
	 *            通过SolutionType判断关联的是流程还是问题  SolutionType==1 问题   SolutionType==2 流程
	 *            删除点击删除全部时不进入回收站
	 *@param  _tr:删除的问题或流程的id
	 *@param  isQue:判断删除的是流程还是问题
	 *@param  html：拼接关联的问题或流程
	 *@param  corSetId：不进入回收站的id
	 *@param  nowId 页面选中的id
	 *@param  flowId:引用的id
	 */
	if($(e.target).is('.oneDelQue')) {
		var _tr = $(e.target).parents('tr').attr('id');
		var html = '';
		var corSetId = '';
		var flowId = '';
		var nowId = '';
		Base.request({
			url: 'question/findSolutionCor',
			params: {
				ids: _tr
			},
			callback: function (data) {
				if(data.status == 0){
					if(data.ref && data.ref == 1){
						$('#flowDelModel').modal('show');
						for(var i = 0;i < data.solutionList.length;i++){
							if(data.solutionList[i].SolutionType == 1){
								html+='<p><a href="../../web/knowledge/queDetail.html?id='+data.solutionList[i].Id+'" data-num="0" data-name="问题详细">'+data.solutionList[i].Question+'</a></p>';
							}else{
								html+='<p><a href="../../web/knowledge/editFlow.html?questionId='+data.solutionList[i].Id+'&groupId='+data.solutionList[i].GroupId+'&solutionId='+data.solutionList[i].SolutionId+'&tmpNum='+tmpNum+'" data-num="0" data-name="流程详细">'+data.solutionList[i].Question+'</a></p>';
							}
						}
						if(data.canNotRenewSolutionList.length == 0){
							//进入回收站
							relationMine = 1;
							$('#flowDelModel .flowTipWord').html('&nbsp;&nbsp;删除该流程将会一并删除与之相关的答案、相似问法，确认删除该流程？（删除的流程可在知识库回收站中找回）');
						}else{
							//不进入回收站
							for(var j = 0;j < data.canNotRenewSolutionList.length;j++){
								corSetId += data.canNotRenewSolutionList[j].Id+',';
							}
							relationMine = 0;
							$('#flowDelModel .flowTipWord').html('&nbsp;&nbsp;删除该流程将会一并删除与之相关的答案、相似问法，确认删除该流程？（引用了其他问题或流程，删除后不可恢复！）');
						}
						/*引用的标问的id*/
						for(var i = 0;i < data.resultIds.length;i++){
							flowId += data.resultIds[i]+',';
						}
						/*关联的标问的id*/
						for(var i = 0;i < data.deleteSolutionIds.length;i++){
							nowId += data.deleteSolutionIds[i]+',';
						}
						$('#flowDelModel .nowId').val(nowId.substring(0,nowId.length-1));
						$('#flowDelModel .corSetId').val(corSetId.substring(0,corSetId.length-1));
						$('#flowDelModel .flowId').val(flowId.substring(0,flowId.length-1));
						$('#flowDelModel .flowList').html(html);
					}else{
						if(data.canNotRenewSolutionList.length == 0){
							relationMine = 1;
							$('#delAnsConfirm #tipWord').html('&nbsp;&nbsp;删除该流程将会一并删除与之相关的答案、相似问法，确认删除该流程？（删除的问题可在知识库回收站中找回）');
						}else{
							relationMine = 0;
							$('#delAnsConfirm #tipWord').html('&nbsp;&nbsp;删除该流程将会一并删除与之相关的答案、相似问法，确认删除该流程？（引用了其他问题或流程，删除后不可恢复！）');
						}
						//不进入回收站
						for(var j = 0;j < data.canNotRenewSolutionList.length;j++){
							corSetId += data.canNotRenewSolutionList[j].Id+',';
						}
						/*引用的标问的id*/
						for(var i = 0;i < data.resultIds.length;i++){
							flowId += data.resultIds[i]+',';
						}
						/*关联的标问的id*/
						for(var i = 0;i < data.deleteSolutionIds.length;i++){
							nowId += data.deleteSolutionIds[i]+',';
						}
						$('#delAnsConfirm').modal('show')
						$('#tipTitle').text('删除流程')
						$('#tipWord').text('删除该流程将会一并删除与之相关的答案、相似问法，确认删除该流程？（删除的流程可在知识库回收站中找回）')
						$('#delAnsConfirm .nowId').val(nowId.substring(0,nowId.length-1));
						$('#delAnsConfirm .corSetId').val(corSetId.substring(0,corSetId.length-1));
						$('#delAnsConfirm .flowId').val(flowId.substring(0,flowId.length-1));
						$('#delAnsConfirm .delAnsFlowId').val(_tr);
					}
				}else{
					Base.gritter(data.message, false)
				}
			},
		})
	}
});
/* 流程存在关联关系 点击删除全部 */
$('#selflowAllBtn').on('click',function(){
	queDetele('#flowDelModel');
})
function queDetele(obj){
	//ID : flowId加上nowId去重
	var NowID = $(obj).find('.nowId').val();
	var FlowId = $(obj).find('.flowId').val();
	var Ids = [];
	if(NowID){
		Ids.push(NowID);
	}
	if(FlowId){
		Ids.push(FlowId);
	}
	Array.prototype.unique3 = function(){
		var res = [];
		var json = {};
		for(var i = 0;i < this.length;i++){
			if(!json[this[i]]){
				res.push(this[i]);
				json[this[i]] = 1;
			}
		}
		return res;
	}
	if(relationMine == 1){//进入回收站
		Base.request({
			url: 'question/delOptQuestionByIds',//有关联关系  删除全部
			params: {
				ids:Ids.unique3().toString()
			},
			callback: function (data) {
				$(obj).modal('hide');
				if (data.status) {
					Base.gritter(data.message, false)
				} else {
					$.gritter.add({
						title: "提醒",
						text: data.message,
						time: 3000,
						after_close: function () {
							var ifT = iframeTab.init({ iframeBox: '' });
							ifT.closeActIframe('', parent.$('#tabHeader li[data-num="' + getUrlParam('tmpNum') + '"]').attr('data-tab'));
						}
					});
				}
			},
		})
	}else{
		Base.request({
			url: 'question/delOptQuestionByIds',//删除关联关系
			params: {
				ids:Ids.unique3().toString()
			},
			callback: function (data) {
				if (data.status) {
					Base.gritter(data.message, false)
				} else {
					Base.request({
						type:'get',
						cache:false,
						url: 'question/clearQuestionByIds',//不进入回收站
						params: {
							ids:$(obj).find('.corSetId').val()
						},
						callback: function (data) {
							$(obj).modal('hide');
							$.gritter.add({
								title: "提醒",
								text: data.message,
								time: 3000,
								after_close: function () {
									var ifT = iframeTab.init({ iframeBox: '' });
									ifT.closeActIframe('', parent.$('#tabHeader li[data-num="' + getUrlParam('tmpNum') + '"]').attr('data-tab'));
								}
							});
						},
					})
				}

			},
		})
	}
}
//选择答案对应的流程项
function listFlowItemModal(bool) {
	var url = null;
	if(!bool) {
		url = '../../flowItem/findFlowItemsById'+'?solutionId='+SolutionId;
	} else {
		url = '../../flowItem/findAll';
	}
	$('#flowList').tableAjaxLoader2(3);
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI(url),
		data: $('#search_flowItem').serialize(),
		success: function(data) {
			if (data.status == 0) {
				if(data.list==undefined){
					$('#flowList').find('tbody').html('<tr><td colspan=\"3\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
					return;
				}
				if (data.list.length > 0) {
					var html = "";
					for (var i = 0; i < data.list.length; i++) {
						html += "<tr id=\"list-tr-" + data.list[i].Id + "\">";
						html += "<td><input type=\"radio\" name=\"row_sel_flow\" class=\"select_row\" value=\"" + data.list[i].Id + "\"/></td>";
						html += "<td>" + data.list[i].Info + "</td>";
						html += "<td>" + data.list[i].Time + "</td>";
						html += "</tr>";
					}
					$('#flowList').find('tbody').html(html);
					icheckInit();
					$('#flowList td').click(function() {
						$(this).parent().find('input[name=row_sel_flow]').iCheck('check');
					});
				} else {
					$('#flowList').find('tbody').html('<tr><td colspan=\"3\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
				}
			} else {
				yunNoty(data);
			}
		}
	});
}

//确定选择
$('#selFlowBtn').click(function(){
	var id = getSelectedIds_flow();
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../flowitem/doEditModeValue'),
		data: {
			answerId: $('#flowAnswerId').val(),
			mode: 6,
			modeValue: id
		},
		success: function(data) {
			if(data.status == "0") {
				yunNoty(data);
				if(data.Id) {
					$('a[fid='+$('#flowAnswerId').val()+']').html('#' + data.Id + '-' + data.Info);
					if(!$('a[fid='+$('#flowAnswerId').val()+']').prev().hasClass('dot')) {
						$('a[fid='+$('#flowAnswerId').val()+']').before('<span class="dot">|</span>').after('<span class="dot">|</span>');
					}
				} else {
					$('a[fid='+$('#flowAnswerId').val()+']').html('<span class="timeTip glyphicon glyphicon-th-list" title="选择该描述的入口流程项"><span>');
					$('a[fid='+$('#flowAnswerId').val()+']').prev().remove();
					$('a[fid='+$('#flowAnswerId').val()+']').after().remove();
				}
				$('#flowSelectModel').modal('hide');
			} else {
				yunNoty(data);
			}
		}
	});
});

$('#search_flowItem input[name=content]').keyup(function(event) {
	if(event.keyCode == 13) {
		listFlowItemModal();
	}
});

function getSelectedIds_flow() {
	var cboxs = document.getElementsByName('row_sel_flow');
	if(typeof cboxs=="undefined"){
		return -1;
	}
	var inputvalue="";
	for(var i=0;i<cboxs.length;i++){
		if(cboxs[i].checked==true){
			inputvalue=cboxs[i].value;
		}
	}
	return inputvalue;
}

//列出流程项
function listFlowItems() {
	var content = $('#searchString').val();
	var dataJSON = {
		solutionId : SolutionId,
		content : content
	};
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,
		url:encodeURI('../../flowItem/findFlowItemsById'),
		data:dataJSON,
		success: function(data) {
			if(data.status == 0) {
				var list = data.list;
				if(list!=null && list.length>0) {
					var HTML = "";
					HTML += "<div class='col-md-12'>";
					for(var i in list) {
						HTML += "<div class='col-md-12 Ider' id='wf_"+ list[i].Id +"' rel='"+ list[i].Id +"'>";
						HTML += "<div class='col-md-12 IderHead p-t-5 p-b-5'><div class='changespan' style='display:inline-block;'>#" + list[i].Id + "&nbsp;&nbsp;<span>" + list[i].Info + "</span></div>";
						HTML += "<div style='display:inline-block;float:right;'>";
						HTML += "<a title='编辑' class='sha' onclick='edit_flow(this)' rel='"+ list[i].Id +"' style='cursor:pointer;display:none;'><i class='glyphicon glyphicon-pencil'></i></a>&nbsp;&nbsp;";
						HTML += "<a title='删除' class='sha' onclick='flowItemModal(this)' rel='"+ list[i].Id +"' style='cursor:pointer;display:none;'><i class='glyphicon glyphicon-trash'></i></a></div></div>";
						HTML += "<div class='col-md-12 m-t-10'>" + list[i].Content + "</div>";
						HTML += "</div>";
					}
					HTML += "<div class='col-md-offset-5 col-md-2'><a data-toggle='modal' class='btn btn-primary' href='#addFlowModal'>添加新的流程项</a></div>";
					HTML += "</div>";
					$('#flowContent').html(HTML);
					if(getUrlParam('flowItemId')){
						$('#content #wf_'+getUrlParam('flowItemId')+'').css('border-color','rgb(222, 82, 70)');
						$('#content #wf_'+getUrlParam('flowItemId')+'').children('.IderHead').css({'background-color':'rgb(222, 82, 70)','color':'white'});
					}
				} else {
					if(content != '') {
						$('#flowContent').html('<div class="col-md-12" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;搜索纪录为空！</td>');
					} else {
						$('#flowContent').html('<div class="col-md-offset-5 col-md-2"><a data-toggle="modal" class="btn btn-primary" href="#addFlowModal">流程项为空，快去添加吧~</a></div>');
					}
				}
			}
		}
	});
}

//添加流程项
var flag_Flow_add = false;
function addFlow(){
	var info = $('#info').val();
	//var content = $('#contentAdd').val();
	var content = richtextAdd.getContent();
	var dataJSON = {
		solutionId : SolutionId,
		groupId : GroupId,
		info : info,
		content : content
	};
	if (flag_Flow_add) {
		return;
	}
	flag_Flow_add = true;
	$.ajax({
	type:'post',
	datatype:'json',
	cache:false,//不从缓存中去数据
	url:encodeURI('../../flowItem/editFlowItems'),
	data:dataJSON,
	success:
	function(data){
		flag_Flow_add = false;
		if(data.status==0){
			yunNoty(data);
			listFlowItems();
			$('#info').val('');
			//$('#content').val('');
			//richtextAdd.addListener("ready", function() {
				richtextAdd.setContent('');
			//});
			$('#addFlowModal').modal('hide');
			return false;
		 }else{
			yunNoty(data);
		}
	}
	});
}

//修改流程项
function edit_flow(obj){
    if(richtextEdit.queryCommandState('source') == 1){
        richtextEdit.execCommand('source');
    }
	var id=$(obj).attr('rel');
	$('#flowId').val(id);
	$('#infoEdit').val($(obj).parent().siblings().children().html());
	// richtextEdit.addListener("ready", function() {
	// 	richtextEdit.setContent($(obj).parent().siblings().children().html());
	// });
	richtextEdit.setContent($(obj).parent().parent().siblings().html());
	$('#editFlowModal').modal('show');
}
var flag_Flow_edit = false;
function editFlow(){
	var id = $('#flowId').val();
	var info = $('#infoEdit').val();
	var content = richtextEdit.getContent();
	var dataJSON = {
		id : id,
		solutionId : SolutionId,
		groupId : GroupId,
		info : info,
		content : content
	};
	if (flag_Flow_edit) {
		return;
	}
	flag_Flow_edit = true;
	$.ajax({
	type:'post',
	datatype:'jsonp',
	cache:false,//不从缓存中去数据
	url:encodeURI('../../flowitem/editFlowItems'),
	data:dataJSON,
	success:
	function(data){
		flag_Flow_edit = false;
		if(data.status==0){
			yunNoty(data);
			listFlowItems();
			//richtextEdit.addListener("ready", function() {
				richtextEdit.setContent('');
			//});
			$('#editFlowModal').modal('hide');
			return false;
		}else{
			yunNoty(data);
		}
	}
	});
}
/*
 *  taskId = 543 删除问题、流程、流程项的处理
 *  1、单个删除时查询流程是否存在关联关系
 *     如果data.ref存在且data.ref等于1则有关联关系：
 *  2、有关联关系时判断是否能进入回收站：
 *      （1）：如果data.canNotRenewSolutionList的长度为0：
 *            可以进入回收站
 *      （2）否则不能进入回收站：
 *            通过SolutionType判断关联的是流程还是问题  SolutionType==1 问题   SolutionType==2 流程
 *            删除点击删除全部时不进入回收站
 *@param  _tr:删除的问题或流程的id
 *@param  isQue:判断删除的是流程还是问题
 *@param  html：拼接关联的问题或流程
 *@param corSetId:不进入回收站时的标问id
 *@param  flowId:该流程的关联关系id
 */
function flowItemModal(obj){
    //delFlow(obj);
	var html = '';
	var corSetId = '';
	var flowId = '';
	var nowId = '';
	$.ajax({
		type:'post',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../question/deleteFlowItemById'),
		data:{
			id:$(obj).attr('rel'),
			solutionId:SolutionId
		},
		success:function(data){
			if(data.status==0){
				if(data.ref && data.ref == 1){
						$('#flowItemDelModel').modal('show');
						for(var i = 0;i < data.questionList.length;i++){
							if(data.questionList[i].SolutionType == 1){
								html+='<p><a href="../../web/knowledge/queDetail.html?id='+data.questionList[i].Id+'" data-num="0" data-name="问题详细">'+data.questionList[i].Question+'</a></p>';
							}else{
								html+='<p><a href="../../web/knowledge/editFlow.html?questionId='+data.questionList[i].Id+'&groupId='+data.questionList[i].GroupId+'&solutionId='+data.questionList[i].SolutionId+'&tmpNum='+tmpNum+'" data-num="0" data-name="流程详细">'+data.questionList[i].Question+'</a></p>';
							}
							/*要删除的标问的id*/
							flowId += data.questionList[i].Id+',';
						}
						if(data.canNotRenewSolutionList.length == 0){
							//可以进入回收站
							relationMine = 1;
						}else{
							//不进入回收站
							for(var j = 0;j < data.canNotRenewSolutionList.length;j++){
								nowId += data.canNotRenewSolutionList[j].Id+',';
							}
							relationMine = 0;
						}
						for(var i = 0;i < data.refFlowItemIdList.length;i++){
							corSetId += data.refFlowItemIdList[j]+',';
						}
						$('#flowItemDelModel .nowId').val(nowId.substring(0,nowId.length-1));
						$('#flowItemDelModel .corSetId').val(corSetId.substring(0,corSetId.length-1));
						$('#flowItemDelModel .flowId').val(flowId.substring(0,flowId.length-1));
						$('#flowItemDelModel .flowList').html(html);
				}else{
					$('#delFlowItemConfirm').modal('show')
					$('#delFlowItemConfirm .flowItemRel').val($(obj).attr('rel'));
				}
			}else{
				yunNoty(data);
			}
		}
	});
}
/* 流程项存在关联关系，删除全部 */
$('#selflowItemBtn').on('click',function(){
	flowDelete('#flowItemDelModel')
})
/* 流程项不存在关联关系 确定删除流程项 */
$('#delFlowItem').off('click').on('click',function(){
	$.getJSON('../../question/deleteFlowItemByIds', 'ids=' +$('#delFlowItemConfirm .flowItemRel').val(),
		function(data) {
			if (data.status == 0) {
				listFlowItems();
				yunNoty(data);
				$('#delFlowItemConfirm').modal('hide');
				return false;
			} else {
				yunNoty(data);
			}
		});
});
function flowDelete(obj){
	// relationMine==1 进入回收站，relationMine==0 不进入回收站
	if(relationMine == 1){
		Base.request({
			url: 'question/deleteFlowItemByIds',//删除流程项
			params: {
				ids:$(obj).find('.corSetId').val()
			},
			callback: function (data) {
				Base.request({
					url: 'question/delOptQuestionByIds',//删除标准问题
					params: {
						ids:$(obj).find('.flowId').val()
					},
					callback: function (data) {
						if(data.status == 0){
							Base.gritter(data.message, true)
							$(obj).modal('hide');
							listFlowItems();
						}else{
							Base.gritter(data.message, false)
						}
					},
				})
			},
		})
	}else{
		Base.request({
			url: 'question/deleteFlowItemByIds',//删除关联关系
			params: {
				ids:$(obj).find('.corSetId').val()
			},
			callback: function (data) {
				Base.request({
					url: 'question/delOptQuestionByIds',//删除标准问题
					params: {
						ids:$(obj).find('.flowId').val()
					},
					callback: function (data) {
						Base.request({
							type:'get',
							cache:false,
							url: 'question/clearQuestionByIds',//不进入回收站
							params: {
								ids:$(obj).find('.nowId').val()
							},
							callback: function (data) {
								if(data.status == 0) {
									yunNoty(data,function() {
										var ifT = iframeTab.init({iframeBox: ''});
										ifT.closeActIframe('',parent.$('#tabHeader li[data-num="'+getUrlParam('tmpNum')+'"]').attr('data-tab'));
									});
									$(obj).modal('hide');
								} else {
									yunNoty(data);
								}
							},
						})
					},
				})
			},
		})
	}
}
//设置句式树
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
      dataFilter: ajaxDataFilterNew
    },
    callback: {
      onClick: ZTreeClassTermClickNew,
      onAsyncSuccess: zTreeOnAsyncSuccessNew
    }
  };
  function ZTreeClassTermClickNew(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj('treeTermClass');
    Nodes = zTree.getSelectedNodes();
    $('#modal-intelTerm input[name=treeName]').val(Nodes[0].Name);
    $('#modal-intelTerm input[name=treeId]').val(Nodes[0].Id);
    termList(1);
  }
   function zTreeOnAsyncSuccessNew(event, treeId, treeNode, msg) {
    var treeObj = $.fn.zTree.getZTreeObj("treeClasses");
    //treeObj.expandAll(true);
  }
  //格式化一步获取的json数据
  function ajaxDataFilterNew(treeId, parentNode, responseData) {
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
  $('#modal-intelTerm').on('show.bs.modal', function() {
    $.fn.zTree.init($("#treeTermClass"), termsetting, []);
    /*$('#affix1inner').slimScroll({
	    height: $(window).height()-300+ 'px',
	    allowPageScroll: false
	});*/
	$('#modal-intelTerm input[name=treeId]').val(0);
    termList(1);
  });
  //句式组内容列表
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

  				icheckInit();
				//单选框点击事件
				$('#termTable tr input[name=match]').on('ifClicked',function(){
					$('[name="checkedId"]').val($(this).parents('tr').attr('id'));
				})
				//表格点击事件
  				$('#termTable tr').click(function() {
					$(this).find('input[name=match]').iCheck('check');
					$('[name="checkedId"]').val($(this).attr('id'));
				});
				for(var i = 0; i < $('#termTable tbody tr').length;i++){
					if($('#termTable tbody tr').eq(i).attr('id') == $(".queWholeCtn").parents('tr').attr('sgid')){
						$('#termTable tbody tr').eq(i).find('input[name=match]').iCheck('check');
						$('[name="checkedId"]').val($(".queWholeCtn").parents('tr').attr('sgid'));
					}
				}
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
						$('#termTable').find('tbody').html('<tr><td colspan=\"4\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>  当前纪录为空！</td></tr>');
						$('#termPageList').html('');
				}
  		}
  	});
  }

// 添加智能句式
var switchStatus = 1;
$('#intelMatchContainer input[data-change="check-switchery-state-text"]').on("change",function(){
	switchStatus = $(this).attr("checked")?1:0;
	if(switchStatus==0){
		//不启用
		$('[name=match]').iCheck('uncheck');
		$("#termTable td .iradio_flat-blue.checked").parents('tr').attr('id','');
	}
});
$('.addTerm').on('click', function() {
	var entitysTioAtr = $("#EntitysList .entityTio").val();
	if(switchStatus==0){
		//不启用
		$("#termTable td .iradio_flat-blue.checked").parents('tr').attr('id','');
	}
	$(".queWholeCtn").parents('tr').attr('sgid',$("#termTable td .iradio_flat-blue.checked").parents('tr').attr('id'));
	$.ajax({
		url: '../../KnSentencegroupSolution/doEditKSSolution',
		type:'post',
		data:{
			'solutionStr':$('#modal-intelTerm input[name=solutionId]').val(),
			'sgId':($('[name="checkedId"]').val() != "null") ? $('[name="checkedId"]').val() : '',
			'entitys':entitysTioAtr,
			'qiYong':switchStatus
		},
		success: function(data) {
			if(data.status == 0){
				yunNoty(data);
				$('#modal-intelTerm').modal('hide');
				window.location.reload();
			}else{
				yunNoty(data);
			}
		}
	});
});

//列出相似问法列表
function listSimilar(pageNo,orderType){
	var question = $('#searchSimilar').val();
	if(!pageNo)pageNo=1;
	if(!orderType){
		orderType=$('input[name=orderType]').val();
	}else{
		$('input[name=orderType]').val(orderType);
	}
	var dataJSON = {
		question : question,
		solutionId : SolutionId,
		groupId : GroupId,
		pageNo : pageNo,
		pageSize : 10,
		orderType : orderType
	};
	$('#similarList').tableAjaxLoader2(4);
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../question/findSimilarQuestion'),
		data:dataJSON,
		success:
		function(data){
			if(data.status==0){
				if(data.listSimilar==undefined){
					$('#similarList').find('tbody').html('<tr><td colspan=\"4\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>  当前纪录为空！</td></tr>');
					$('#similarPageList').html('');
					return;
				}
				if(data.listSimilar.length>0){
					var html = "";
					for(var i=0;i<data.listSimilar.length;i++){
						html += "<tr id=\"list-tr-"+data.listSimilar[i].Id+"\" SolutionId="+data.listSimilar[i].SolutionId+">";
						// if(data.listSimilar[i].Question.length>100) {
						// 	html += "<td style='word-break:break-all'><a class='cutText' title='"+data.listSimilar[i].Question+"'>"+data.listSimilar[i].Question.substring(0,100)+"...</a></td>";
						// } else {
							html += "<td style='word-break:break-all'>"+data.listSimilar[i].Question+"</td>";
						//}
						html += "<td>"+data.listSimilar[i].Hits+"</td>";
						html += "<td>"+data.listSimilar[i].AddTime+"</td>";
						html += "<td><a class='addSiToj'><span class='timeTip glyphicon glyphicon-plus' title='添加到句式组'></span></a><a rel=\""+data.listSimilar[i].Id+"\" title=\"编辑\" class=\"editSim\" style=\"cursor:pointer;\"><i class=\"glyphicon glyphicon-pencil\"></i></a>  <a class=\"m-del\" title=\"删除\" rel=\""+data.listSimilar[i].Id+"\" style=\"cursor:pointer; \" ><i class=\"glyphicon glyphicon-trash\" ></i></a></td>";
						html += "</tr>";
					}
					$('#similarList').find('tbody').html(html);
					if(sessionStorage.getItem('sentenceValue') == 1){
						$('#similarList .addSiToj').css('display','inline-block');
					}else{
						$('#similarList .addSiToj').css('display','none');
					}
					//相似问法的操作列的删除按钮
					$('.m-del').on('click',function(){
						del_similar(this);
					});
					$(".addSiToj").click(function(){
						var $tr = $(this).parents('tr');
						//var simiId = $tr.attr('id');
						var solutionId = $tr.attr('solutionId');
						var simiQue = $tr.attr('id').split('-');
						var simiQue1 = simiQue[2];
						var simiId = simiQue1;
						addSiToj(simiId,solutionId,simiQue1);
					});
					//下面开始处理分页
					var options = {
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function (event, originalEvent, type, page) {
							listSimilar(page);
						}
					};
					setPage('similarPageList',options);
				}else{
					$('#similarList').find('tbody').html('<tr><td colspan=\"4\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>  当前纪录为空！</td></tr>');
					$('#similarPageList').html('');
				}
			}else{
				yunNoty(data);
			}
		}
	});
}
	var entitysStr = '';
	//点击加号添加相似问法
	function addSiToj(simiId,solutionId,simiQue1){
		$.ajax({
			type:"post",
			url:"../../KnSentenceGroup/siToJs",
			data:{"simiId":simiId,"solutionId":(solutionId||"")},
			async:true,
			cache:true,
			success:function(data){
				if(data.status == 0){
					if(data.flag){
						yunNoty(data);
						$("#similarAddModal").modal('hide');
					}else{
						$("#similarAddModal").modal('show');
						for(var i = 0;i < $("#form_entity .entitys").length;i++){
							if($("#form_entity .entitys").eq(i).val()==''){
								$("#form_entity .entitys").eq(i).parent().parent().remove();
							}
						}
						if(data.entitySi!=''&&data.entitySo!=''){
							if(data.entitySi != data.entitySo){
								$('#similarAddModal .alert').css('display','block');
							}else{
								$('#similarAddModal .alert').css('display','none');
							}
							if($("#form_entity .entityInit1").length>0&&$("#form_entity .entityInit2").length>0){
								$("#form_entity .entityInit2").val(data.entitySi);
								$("#form_entity .entityInit1").val(data.entitySo);
							}else{
								$("#form_entity").html('<div class="form-group"><label class="col-md-3 control-label">当前标准问题实体<span class="red">&nbsp;*</span></label><div class="col-md-7" >'+
                                                            '<textarea class="form-control entitys entityInit1" style="resize:none;">'+data.entitySo+'</textarea>'+
                                                            '</div></div>'+
                                                        '<div class="form-group"><label class="col-md-3 control-label">当前相似问法实体<span class="red">&nbsp;*</span></label>'+
                                                            '<div class="col-md-7" >'+
                                                            '<textarea class="form-control entitys entityInit2" style="resize:none;">'+data.entitySi+'</textarea>'+
                                                            '<p class="help-block">多个实体用“，”隔开</p></div></div>');
							}

						}

						if(data.entitySi==null||data.entitySi==''){
							if($("#form_entity .entityInit1").length>0){
								$("#form_entity .entityInit1").val(data.entitySo);
							}else{
								$("#form_entity").html('<div class="form-group"><label class="col-md-3 control-label">当前标准问题实体<span class="red">&nbsp;*</span></label><div class="col-md-7" >'+
                                                            '<textarea class="form-control entitys entityInit1" style="resize:none;">'+data.entitySo+'</textarea>'+
                                                            '</div></div>'+
                                                        '<div class="form-group"><label class="col-md-3 control-label">当前相似问法实体<span class="red">&nbsp;*</span></label>'+
                                                            '<div class="col-md-7" >'+
                                                            '<textarea class="form-control entitys entityInit2" style="resize:none;">'+data.entitySi+'</textarea>'+
                                                            '<p class="help-block">多个实体用“，”隔开</p></div></div>');
							}

						}
						if(data.entitySo==null||data.entitySo==''){
							if($("#form_entity .entityInit2").length>0){
								$("#form_entity .entityInit2").val(data.entitySi);
							}else{
								$("#form_entity").html('<div class="form-group"><label class="col-md-3 control-label">当前标准问题实体<span class="red">&nbsp;*</span></label><div class="col-md-7" >'+
                                                            '<textarea class="form-control entitys entityInit1" style="resize:none;">'+data.entitySo+'</textarea>'+
                                                            '</div></div>'+
                                                        '<div class="form-group"><label class="col-md-3 control-label">当前相似问法实体<span class="red">&nbsp;*</span></label>'+
                                                            '<div class="col-md-7" >'+
                                                            '<textarea class="form-control entitys entityInit2" style="resize:none;">'+data.entitySi+'</textarea>'+
                                                            '<p class="help-block">多个实体用“，”隔开</p></div></div>');
							}
						}

						$("#similarBtn").unbind('click').bind('click',function(){
							entitysStr = '';
							var simiQuestion = simiQue1;
							var sgName = $("#addSentenceForm input[name=sgName]").val();
							var classId = $("#addSentenceForm input[name=classId]").val();
							$("#addSentenceForm .entitys").each(function(i){
								if($("#addSentenceForm .entitys").eq(i).val()!=''){
									entitysStr += $("#addSentenceForm .entitys").eq(i).val();
								}
							});
							simiBtnQuestion(simiQuestion,sgName,solutionId,classId,entitysStr);
						});
					}
				}else{
					yunNoty(data);
				}
			}
		});
	}
	
	function simiBtnQuestion(simiQuestion,sgName,solutionId,classId,entitysStr){
		$.ajax({
			type:"post",
			url:"../../KnSentencegroupSolution/insertJSZandJS",
			data:{
				'entitySi':$('.entityInit2').val(),
				'entitySo':$('.entityInit1').val(),
				'solutionId':solutionId,
				'sgName':sgName,
				'classId':classId,
				'simiQuestion':simiQuestion
			},
			async:true,
			cache:true,
			success:function(data){
				if(data.status==0){
					yunNoty(data);
					$("#similarAddModal").modal('hide');
				}else{
					yunNoty(data);
				}
				if(data.resultMap1){
					if(data.resultMap1.status == 0){
						yunNoty(data.resultMap1);
					}else{
						yunNotyError(data.resultMap1.message);
					}
				}
				if(data.resultMap2){
					if(data.resultMap2.status == 0){
						yunNoty(data.resultMap2);
					}else{
						yunNotyError(data.resultMap2.message);
					}
				}

			}
		})
	}
	//点击加号实体增加减少时
	 $('#addSentenceForm').on('click', 'a[name=delentityInput]', function() {
	    if ($('#addSentenceForm a[name=delentityInput]').size() > 1) {
			$(this).parent().parent().remove();
	    } 
	  });
  
  	$('#addSentenceForm').on('click', 'a[name=addentityInput]', function() {
	    if ($('#addSentenceForm a[name=addentityInput]').size() < 4) {
	      $('#addSentenceForm #form_entity .newAddEntity').append(
	      	'<div class="row" style="line-height:38px;">'+
	      		'<label class="col-md-3 control-label"></label>'+
	      		'<div class="col-md-5">'+
					'<input type="text" class="entitys"/>'+
				'</div>'+
				'<div class="col-md-2 m-t-5 m-l-5">'+
					'<a href="javascript:;" name="delentityInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>'+
					'<a href="javascript:;" name="addentityInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a>'+
				'</div>'+
			'</div>');
	    }
	});
	
	//点击智能句式实体增加减少时
	 $('#modal-intelTerm').on('click', 'a[name=delentityTioInput]', function() {
	    if ($('#modal-intelTerm a[name=delentityTioInput]').size() > 1) {
	      $(this).parent().parent().remove();
	    } else {
	      
	    }
	  });
  
  $('#modal-intelTerm').on('click', 'a[name=addentityTioInput]', function() {
    if ($('#modal-intelTerm a[name=addentityTioInput]').size() < 4) {
      $('#modal-intelTerm #EntitysList').append('<div class="col-md-12" style="margin-left:25px;margin-top:10px;">'+
      														'<div class="col-md-7" style="padding:0;">'+
																'<input type="text" class="entityTio"/>'+
															'</div>'+
															'<div class="col-md-4 m-t-5 m-l-5" style="padding:0;">'+
                                       ' <a href="javascript:;" name="delentityTioInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>'+
                                        '<a href="javascript:;" name="addentityTioInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a>'+
                                    '</div></div>');
    }
  });

	//点击加号添加句式组树
	var hideAddSetting = {
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
			dataFilter : ajaxDataFilter2
		},
		callback: {
			beforeClick: zTreeBeforeClickHide2,
			onClick:function (event, treeId, treeNode, clickFlag){
				if(treeNode){
					//点击的时候获取当前树的节点信息
					$('#addSentenceForm #phraseTree').html(treeNode.Name);
					$('#addSentenceForm input[name=classId]').val(treeNode.Id);
					$("#menuContent1").fadeOut("fast");
				}
			},
			onExpand: zTreeOnExpand2
		}
	};
	function zTreeBeforeClickHide2(treeId, treeNode, clickFlag){
	    return !treeNode.isParent;//当是父节点 返回false 不让选取
	}
	//渲染树结构
	function ajaxDataFilter2(treeId, parentNode, responseData) {
		if (responseData) {
			responseData.list.push({ Id:-1, ParentId:0, Name:"全部分类", open:true});
			return responseData.list;
		}
		return responseData;
	};
	function zTreeOnExpand2(event, treeId, treeNode) {
		//展开的时候滚动条怎么调用？？？？？？？？？
	};
	function onBodyDown2(event) {
		if (!(event.target.id == "menuBtn" || event.target.id == "menuContent1" || $(event.target).parents("#menuContent1").length>0)) {
			hideMenu2();
		}
	}
	function hideMenu2() {
		$("#menuContent1").fadeOut("fast");
		$("body").unbind("mousedown", onBodyDown2);
	}
	function showMenu1() {
		
		$("#menuContent1").slideDown("fast");
		$("body").bind("mousedown", onBodyDown2);
	}
	//添加模态框出现加载分类树
	$('#similarAddModal').on('show.bs.modal', function(){
		$.fn.zTree.init($("#classTree_phrase"), hideAddSetting, []);
	});
	$("#phraseTree").off('click').on('click',showMenu1);
	

//添加相似问法
var flag_sim_add = false;
function addSimilar(){
	var question = $('#similarQuestion').val();
	var dataJSON = {
		solutionId : SolutionId,
		groupId : GroupId,
		question : question
	};
	if (flag_sim_add) {
		return;
	}
	flag_sim_add = true;
	$.ajax({
	type:'post',
	datatype:'json',
	cache:false,//不从缓存中去数据
	url:encodeURI('../../question/addSimilarQuestion'),
	data:dataJSON,
	success:
	function(data){
		flag_sim_add = false;
		if(data.status==0){
			yunNoty(data);
			listSimilar();
			$('#similarQuestion').val('');
			return false;
		 }else{
			yunNoty(data);
		}
	}
	});
}

//修改相似问法
$('body').on('click', '.editSim', function() {
	var id=$(this).attr('rel'),
		$tr = $(this).parents('tr'),
		$simTr = $('<tr><td colspan="3"><input type="text" class="form-control ensureSimInput" placeholder="输入修改后的问题" maxlength="200"></td><td style="vertical-align: middle;"><a class="ensureSim" rel="'+id+'" href="javascript:;"><span class="toolTip glyphicon glyphicon-ok" title="确定"></span></a>&nbsp;&nbsp;<a class="cannelSim" href="javascript:;"><span class="toolTip glyphicon glyphicon-remove" title="取消"></span></a></td>></tr>');

	if(!$tr.next().find('.ensureSim')[0]) {
		$tr.after($simTr);
		$simTr.hide().fadeIn();
		$('.toolTip').tooltip();

		$simTr.find('input').val($('#list-tr-'+id).children().eq(0).html()).focus();
	}
});

var flag_sim_edit = false;
//确认修改相似问法
$('body').on('click', '.ensureSim', function() {
	var id=$(this).attr('rel'),
		$tr = $(this).parents('tr'),
		question = $tr.find('input').val()

	var dataJSON = {
		id : id,
		groupId : GroupId,
		question : question
	};
	if (flag_sim_edit) {
		return;
	}
	flag_sim_edit = true;
	$.ajax({
	type:'post',
	datatype:'json',
	cache:false,//不从缓存中去数据
	url:encodeURI('../../question/editSimilarQuestion'),
	data:dataJSON,
	success:
	function(data){
		flag_sim_edit = false;
		if(data.status==0){
			yunNoty(data);
			$('#list-tr-'+id).children().eq(0).html(question);
			$tr.fadeOut(function() {
				$(this).remove();
			});
			return false;
		}else{
			yunNoty(data);
		}
	}
	});
});
$('body').on('keypress', '.ensureSimInput', function(event) {
	if(event.keyCode == "13") {
		var self = $(this).parent().next().children('a');
		var id=self.attr('rel'),
			$tr = self.parents('tr'),
			question = $tr.find('input').val()

		var dataJSON = {
			id : id,
			groupId : GroupId,
			question : question
		};
		if (flag_sim_edit) {
			return;
		}
		flag_sim_edit = true;
		$.ajax({
		type:'post',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../question/editSimilarQuestion'),
		data:dataJSON,
		success:
		function(data){
			flag_sim_edit = false;
			if(data.status==0){
				yunNoty(data);
				$('#list-tr-'+id).children().eq(0).html(question);
				$tr.fadeOut(function() {
					$(this).remove();
				});
				return false;
			}else{
				yunNoty(data);
			}
		}
		});
	}
});

//选择标签模态框
  var clickLabelEdit=function(){
	  $(".editLabels").click(function(){
	$("#labelTxt").html("");
	$("#labelClassModel").modal("show");
  });
  }
  
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
		
		label=label.substring(0,label.length-1);
		id=id.substring(0,id.length-1);
		
		var questionId="";

		var $tr = $(".editLabels").parents('tr');
		questionId = $tr.attr('solutionid');
		
		$.post("/question/editQueLabel",{
			labelIds:id,
			questionId:questionId
		},function(json){
			if(json.status==0){
				yunNoty(json);
				$("#labelClassModel").modal("hide");
				if(label==""){
					$('.editLabels em').text("无");
				}
				else{
					$('.editLabels em').text(label);
				}
			}
			else{
				yunNotyError(json.message);
				$("#labelClassModel").modal("hide");
			}
		});
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



//取消修改相似问法
$('body').on('click', '.cannelSim', function() {
	var $tr = $(this).parents('tr');

	$tr.fadeOut(function() {
		$(this).remove();
	});
});

//删除相似问法
function del_similar(obj){
	$.getJSON('../../question/deleteSimilarQuestion', 'id=' + $(obj).attr('rel') + '&groupId=' + GroupId,
	function(data) {
		if (data.status == 0) {
			$(obj).parents('tr').hide('slow',
			function() {
				var page = $('#similarPageList .active a').html();
				var oT=$('input[name=orderType]').val();
				if($('.m-del')!=undefined) {
					if($('.m-del').size()==1) page-=1;
					if(page<1) page=1;
				}
				listSimilar(page,oT);
				yunNoty(data);
				return false;
			});
		} else {
			yunNoty(data);
		}
	});
}
