$(document).ready(function() {
    App.init();

    //实例化编辑器
    var ue = UE.getEditor('editor', {
        toolbars: [
            [
                'undo', //撤销
                'redo', //重做
                'bold', //加粗
                'italic', //斜体
                'underline', //下划线
                'strikethrough', //删除线
                'source', //源代码
                'pasteplain', //纯文本粘贴模式
                'selectall', //全选
                'preview', //预览
                'removeformat', //清除格式
                'time', //时间
                'date', //日期
                'cleardoc', //清空文档
                'fontfamily', //字体
                'fontsize', //字号
                'spechars', //特殊字符
                'forecolor', //字体颜色
                'backcolor', //背景色
                'fullscreen', //全屏
                'edittip ', //编辑提示
            ]
        ],
        wordCount:true,
        maximumWords: 200,
        initialFrameHeight: 200,
        zIndex: 65
    });
    UE.getEditor('robotwelome', {
        toolbars: [
            ['fullscreen', 'source', 'undo', 'redo', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc']
        ],
        //initialFrameWidth: $('#robotwelome').width(),
        initialFrameHeight: 240,
        wordCount:true,
        maximumWords: 300,
        zIndex: 65
    });
    UE.getEditor('robotspeak', {
        toolbars: [
            ['fullscreen', 'source', 'undo', 'redo', 'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc']
        ],
        //initialFrameWidth: $('#robotspeak').width(),
        initialFrameHeight: 240,
        wordCount:true,
        maximumWords: 300,
        zIndex: 65
    });

	listChatWindow();
	//机器人列表
	//listRobot();

    $('#txs').on('click', function() {
        $('#avatarType').val('tx');
        $('#avatar-dialog').modal('show');
    });
    $('#txImgWidth').on('change', function() {
        if($(this).val() < 800 && $(this).val() >= 0) {
            $('#txImg').css('width', $(this).val());
        } else {
            $(this).val(56);
            $('#txImg').css('width', 56);
        }
    });
    $('#txImgHeight').on('change', function() {
        if($(this).val() < 600 && $(this).val() >= 0) {
            $('#txImg').css('height', $(this).val());
        } else {
            $(this).val(56);
            $('#txImg').css('height', 56);
        }
    });
    $('#kfs').on('click', function() {
        $('#avatarType').val('kf');
        $('#avatar-dialog').modal('show');
    });
    $('#khs').on('click', function() {
        $('#avatarType').val('kh');
        $('#avatar-dialog').modal('show');
    });
    //选择自定义头像
    $('#avatar-dialog').on('show.bs.modal', function() {
        listAvatar();
    });
    $('body').on('click', '.imgGallery', function() {
        if($('#avatarType').val() == 'tx') {
            $('#txImg').attr('src', $(this).children('img').attr('src'));
            $('#txImg').attr('alt', $(this).children('img').attr('alt'));
            $('#txImg').show();
        }
        if($('#avatarType').val() == 'kf') {
            $('#kfImg').attr('src', $(this).children('img').attr('src'));
            $('#kfImg').attr('alt', $(this).children('img').attr('alt'));
        }
        if($('#avatarType').val() == 'kh') {
            $('#khImg').attr('src', $(this).children('img').attr('src'));
            $('#khImg').attr('alt', $(this).children('img').attr('alt'));
        }
        $('#avatar-dialog').modal('hide');
    });
	$('#dir1').on('ifChecked', function(event){
		$('#div_left').show();
		$('#div_right').hide();
		$('#r_right').val('');
	});
	$('#dir2').on('ifChecked', function(event){
		$('#div_left').hide();
		$('#div_right').show();
		$('#r_left').val('');
	});

    //配置推荐问题
    $('.treeDivOfConfigure').slimScroll({
        height: '300px'
    });

    $('#addProblemBtn').hide();
    $('#saveProblemBtn').hide();
    $('#ProblemGroup').hide();
    $('#yy').on('ifClicked', function() {
        $('#addProblemBtn').hide();
        $('#saveProblemBtn').hide();
        $('#ProblemGroup').hide();
    });
    $('#nn').on('ifClicked', function() {
        $('#addProblemBtn').show();
        $('#saveProblemBtn').show();
        $('#ProblemGroup').show();
    });

    //复制文本
    var clip = new ZeroClipboard($('#copy-payCode'));

    clip.on("copy", function(){
        yunNoty({message:'复制文本成功', status:0});
    });

	//列表显示
	$('#myTab a:last').on('show.bs.tab', function() {
		listRobot();
	});

	//只有使用场景是弹出新窗口才展示聊天窗口和聊天皮肤
	$('#dir6').on('ifUnchecked', function() {
		$('#selWindow').hide();
		$('#chatWindow').val('0');
	});
	$('#dir6').on('ifChecked', function() {
		$('#selWindow').show();
		$('#chat1').show().siblings().hide();
	});
	$('#dir5').on('ifChecked', function() {
		$('#small').show().siblings().hide();
	});
	$('#dir7').on('ifChecked', function() {
		$('#AppFees1').show().siblings().hide();
	});
	$('#dir8').on('ifChecked', function() {
		$('#h5chat').show().siblings().hide();
	});

	//生成代码
	$('#codeGenerate').on('click', function() {
		var url = '';
		//图片页面
		var picUrl = '',
			style = '',
			mode = $('input[name=mode]').val(),
			width = $('#txImgWidth').val(),
			height = $('#txImgHeight').val(),
			direction = $('input[name=direction]').val(),
			left = $('#r_left').val(),
			right = $('#r_right').val(),
			bottom = $('#r_bottom').val(),
			popubType = $('input[name=pop]:checked').val(),
			configId = $('#chatWindow').val(),
			kfPic = $("#kfImg").attr("src"),
			khPic = $("#khImg").attr("src"),
			helloWord = UE.getEditor('robotwelome').getContent(),
			unknowWord = UE.getEditor('robotspeak').getContent(),
			guideQuestion = '';
			//pageName = $('input[name=pageName]').val();
		//获取入口头像url
		$('#myNav').children().each(function(index) {
			if($(this).hasClass('active')) {
				style = index;
				if(index == 1) {
					picUrl = $('input[name=styleRdo]:checked').parents('span.styleParent').find('img').attr('src');
				} else if(index == 2) {
					picUrl = $('input[name=styleR]:checked').parents('span.styleParent').find('img').attr('src');
				} else if(index == 3) {
					picUrl = $('#txImg').attr('src');
				}
			}
		});
		//获取引导问题
		if($('#nn').prop('checked')) {
			$('#QuestionList').find('a[name=deleteIcon]').each(function(){
				guideQuestion += $(this).attr('Id') + ',';
			});
			guideQuestion = guideQuestion.substring(0,guideQuestion.length-1);
		}
		kfPic = canonical_uri(kfPic);
		khPic = canonical_uri(khPic);
		var dataJSON = {
			name: $('#r_name').val(),					//配置名称
			info: UE.getEditor('editor').getContent(),	//文字内容
			mode: mode,									//图标模式 0：静态 1：漂浮
			width: width,								//宽度
			height: height,								//高度
			direction: direction,						//0：右侧 1：左侧
			mLeft: left,								//距离左边
			mRight: right,								//距离右边
			mBtom: bottom,								//距离下面
			configId: configId,							//聊天窗口配置id
			kfPic: kfPic,								//客服头像地址
			khPic: khPic,								//客户头像地址
			helloWord: helloWord,						//欢迎词
			unknowWord: unknowWord,						//未知说词
			guideQuestion: guideQuestion,				//引导问题
			style: style								//入口样式
		};
		//popubType:窗口弹出方式
		//pageName:聊天窗口皮肤
		if(popubType == '0') {
			dataJSON.popubType = popubType;
		} else if(popubType == '1') {
			dataJSON.popubType = popubType;
			//dataJSON.pageName = pageName;
			dataJSON.pageName = 'chat1';
		} else if(popubType == '2') {
			dataJSON.pageName = 'mobileFees1';
		} else if(popubType == '3') {
			dataJSON.pageName = 'h5chat';
		}
		if($('#r_id').val() != '') {
			dataJSON.id = $('#r_id').val();
			url = '../../chatlink/edit';
		} else {
			url = '../../chatlink/add';
		}
		//console.log(picUrl);
		if(picUrl != '') {
			picUrl = canonical_uri(picUrl);
			dataJSON.picUrl = picUrl;
		}
		$.ajax({
			type:'post',
			datatype:'json',
			cache:false,
			url:encodeURI('../../chatlink/add'),
			data: dataJSON,
			success: function(data) {
				if(data.status===0) {
					yunNoty(data);
					$('#r_id').val('');
					$('#code-payCode').val(data.CODE);
					//$('#myTab a:last').tab('show');
				} else {
					yunNoty(data);
				}
			}
		});
	});
});

//选择头像列表
function listAvatar(pageNo) {
    if(!pageNo)pageNo=1;
    $.ajax({
        type:'post',
        datatype:'json',
        cache:false,//不从缓存中去数据
        url:encodeURI('../../material/list?pageSize='+12+'&pageNo='+pageNo+'&type=1'),
        success:
        function(data){
            if(data.status===0){
                if(data.list[0]) {
                    var html ='';
                    for(var i=0; i<data.list.length; i++) {
                        html += '<span class="imgGallery" Id="'+ data.list[i].Id +'"><img class="img-responsive" src="../../'+ data.list[i].Path +'" alt="'+ data.list[i].Name +'" title="'+ data.list[i].Name +'"></span>';
                    }
                    var options = {
                        currentPage: data.currentPage,
                        totalPages: data.totlePages,
                        onPageClicked: function (event, originalEvent, type, page) {
                            listAvatar(page);
                        }
                    };
                    setPage('pageList',options);
                }else {
                    var html = '<div style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</div>';
                    $('#pageList').empty();
                }
                $('#avatarDiv').empty().append(html);
            }else{
                yunNoty(data);
            }
        }
    });
}

/* 机器人列表开始 */
function listChatWindow() {
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,
		url:encodeURI('/ChatWindowConfig/list'),
		success: function(data) {
			if(data.status===0) {
				$('#chatWindow').empty().append('<option value="0">请选择</option>');
				for(var i=0; i<data.list.length; i++) {
					$('#chatWindow').append('<option value="'+data.list[i].Id+'">'+data.list[i].Name+'</option>');
				}
			}
		}
	});
}

//机器人列表
var robotList = [];
function listRobot(pageNo) {
    if(!pageNo)pageNo=1;
    $('#RobotList').tableAjaxLoader2(5);
    $.ajax({
        type:'post',
        datatype:'json',
        cache:false,//不从缓存中去数据
        url:encodeURI('/chatlink/list?pageSize='+1000+'&pageNo='+1),
        success:
        function(data){
            if(data.status===0){
                var html ='';
                if(data.list[0]) {
					robotList = data.list;
                    for(var i=0; i<data.list.length; i++) {
                        html += '<tr>';
						if(data.list[i].Name) {
							html += '<td>'+data.list[i].Name+'</td>';
						} else {
							html += '<td></td>';
						}
						if(data.list[i].CreateTime) {
							html += '<td>'+data.list[i].CreateTime+'</td>';
						} else {
							html += '<td></td>';
						}
						if(data.list[i].UpdateTime) {
							html += '<td>'+data.list[i].UpdateTime+'</td>';
						} else {
							html += '<td></td>';
						}
						html += '<td>'+data.list[i].VisitUrl.replace(/</g, '&lt;').replace(/>/g, '&gt;')+'</td>';
						html += '<td style="font-size:14px;" id="'+data.list[i].Id+'"><a href="javascript:;" class="m-r-5 robotPreview" r_id="'+i+'"><i class="glyphicon glyphicon-eye-open" title="预览"></i></a><a href="javascript:;" class="m-r-5 robotEdit" r_id="'+i+'"><i class="glyphicon glyphicon-pencil" title="编辑"></i></a><a href="javascript:;" class="m-r-5 robotDel" r_id="'+i+'"><i class="glyphicon glyphicon-trash" title="删除"></i></a></td>';
                    }
                }else {
                    html = '<tr><td colspan="5" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
                }
                $('#RobotList').find('tbody').empty().append(html);
            }else{
                yunNoty(data);
            }
        }
    });
}

//添加页面预览
$('body').on('click', '#preview', function() {
	if($('#code-payCode').val() != null) {
		$('.iyunwen_js_class').remove();
		$('body').append($('#code-payCode').val());
	}
});

//列表预览
$('body').on('click', '.robotPreview', function() {
	$('.iyunwen_js_class').remove();
	$('body').append(robotList[parseInt($(this).attr('r_id'))].VisitUrl);
});

//修改回带
$('body').on('click', '.robotEdit', function() {
	var robotObj = robotList[parseInt($(this).attr('r_id'))];
	$('#r_id').val(robotObj.Id);
	$('#r_name').val(robotObj.Name);
	if(robotObj.Style == 1) {
		$('a[href="#default-tab-1"]').tab('show');
		UE.getEditor('editor').setContent(robotObj.Info);
	} else if(robotObj.Style == 2) {
		$('a[href="#default-tab-2"]').tab('show');
		$('input[name=styleRdo]').eq(0).iCheck('check');
	} else if(robotObj.Style == 3) {
		$('a[href="#default-tab-3"]').tab('show');
		$('input[name=styleR]').eq(0).iCheck('check');
	} else if(robotObj.Style == 4) {
		$('a[href="#default-tab-4"]').tab('show');
		if(robotObj.Mode == 0) {
			$('input[name=mode]').eq(0).iCheck('check');
		} else {
			$('input[name=mode]').eq(1).iCheck('check');
		}
		$('#txImgWidth').val(robotObj.Width);
		$('#txImg').css('width', robotObj.Width);
		$('#txImgHeight').val(robotObj.Height);
		$('#txImg').css('height', robotObj.Height);
		$('#txImg').attr('src', robotObj.PicUrl).show();
	}
	if(robotObj.Direction === 0) {			//right
		$('#dir2').iCheck('check');
		$('#r_right').val(robotObj.Mright);
		$('#div_right').show();
		$('#div_left').hide();
	} else if(robotObj.Direction === 1) {	//left
		$('#dir1').iCheck('check');
		$('#r_left').val(robotObj.Mleft);
		$('#div_right').hide();
		$('#div_left').show();
	}
	if(robotObj.PopubType === 0) {
		$('input[name=pop]').eq(1).iCheck('check');
		$('#selWindow').hide();
		$('#chatWindow').val('0');
	} else if(robotObj.PopubType === 1) {
		$('input[name=pop]').eq(0).iCheck('check');
		$('#selWindow').show();
	}
	$('#r_bottom').val(robotObj.Mbtom);
	$('#chatWindow').val(robotObj.ConfigId);
	if(robotObj.KfPic) {
		$('#kfImg').attr('src', robotObj.KfPic);
	}
	if(robotObj.KhPic) {
		$('#khImg').attr('src', robotObj.KhPic);
	}
	if(robotObj.HelloWord) {
		UE.getEditor('robotwelome').setContent(robotObj.HelloWord);
	}
	if(robotObj.UnknowWord) {
		UE.getEditor('robotspeak').setContent(robotObj.UnknowWord);
	}
	if(robotObj.GuideQuestion) {
		$('#nn').iCheck('check');
        $('#addProblemBtn').show();
        $('#saveProblemBtn').show();
        $('#ProblemGroup').show();
		var GQ = robotObj.GuideQuestion;
		for(var i in GQ) {
			addRow(GQ[i].question, GQ[i].id);
		}
	} else {
		$('#yy').iCheck('check');
        $('#addProblemBtn').hide();
        $('#saveProblemBtn').hide();
        $('#ProblemGroup').hide();
	}
	$('#code-payCode').val(robotObj.VisitUrl);
	$('#myTab a:first').tab('show');
});

//删除
$('body').on('click', '.robotDel', function() {
	var self = $(this);
	$.getJSON('../../chatlink/delete', 'id=' + robotList[parseInt(self.attr('r_id'))].Id,
	function(data) {
		if (data.status === 0) {
			self.parents('tr').hide('slow',
			function() {
				listRobot();
				yunNoty(data);
			});
		} else {
			yunNoty(data);
		}
	});
});
/* 机器人列表结束 */

//给默认配置增加一行
function addRow(question, id, sd) {
	var html=[];
	html.push('<tr>');
	html.push('<td>'+question+'</td>');
	html.push('<td><a Id="'+id+'" SolId="'+sd+'" title="删除" name="deleteIcon" style="cursor:pointer; font-size: 16px;"><i class="fa fa-trash"></i></a></td>');
	html.push('</tr>');
	if($('#QuestionList').html().indexOf('glyphicon-warning-sign')>=0) {
		$('#QuestionList').find('tbody').html(html.join(''));
	} else {
		$('#QuestionList').find('tbody').append(html.join(''));
	}
	$('a[name=deleteIcon]').on('click',function(){
		delQuestion(this);
	});
}

/* 选择问题开始 */
//列出配置问题
function getParamCon(){
  $('#QuestionList').tableAjaxLoader2(2);
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../rujia/CouponDetail/showQuestion?pageSize=50'),
		success:
		function(data){
			if(data.status === 0){
				if(data.List.length>0){
					var html=[];
					for(var i=0;i<data.List.length;i++){
						html.push('<tr>');
						html.push('<td>'+data.List[i].Question+'</td>');
						html.push('<td><a Id="'+data.List[i].QuestionId+'" SolId="'+data.List[i].SolutionId+'" title="删除" name="deleteIcon" style="font-size: 16px;"><i class="fa fa-trash"></i></a></td>');
						html.push('</tr>');
					}
					$('#QuestionList').find('tbody').html(html.join(''));
					$('a[name=deleteIcon]').on('click',function(){
						delQuestion(this);
					});
				}else{
					$('#QuestionList').find('tbody').html('<tr><td colspan="2" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>当前纪录为空！</td></tr>');
				}
			}
		}
	});
}

//模态窗确认按钮onclick
function getQueId(){
	var ids=getSelectedIds_que();
	if(ids==''){
		yunNotyError('请选择一个问题');
		return;
	}
	var sds=$('#list-tr-'+ids+' input[name=row_sel]').attr('solutionid');
	var question=$('#list-tr-'+ids).find('td').eq(1).html();
	$('#comqueModal').modal('hide');
	addQuestion(ids,sds,question);
	$('#xswfIndex').val('');
}
function getSelectedIds_que(){
	var cboxs = document.getElementsByName('row_sel');
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

//新增问题
function addQuestion(ids,sds,question){
	var length=$('#QuestionList a[name=deleteIcon]').length;
	if(length>19){
		yunNotyError('问题最多能配置20个');
		return;
	}
	var html=[];
	html.push('<tr>');
	html.push('<td>'+question+'</td>');
	html.push('<td><a Id="'+ids+'" SolId="'+sds+'" title="删除" name="deleteIcon" style="cursor:pointer; font-size: 16px;"><i class="fa fa-trash"></i></a></td>');
	html.push('</tr>');
	if($('#QuestionList').html().indexOf('glyphicon-warning-sign')>=0) {
		$('#QuestionList').find('tbody').html(html.join(''));
	} else {
		$('#QuestionList').find('tbody').append(html.join(''));
	}
	$('a[name=deleteIcon]').on('click',function(){
		delQuestion(this);
	});
}

//删除问题
function delQuestion(obj){
	$(obj).parents('tr').hide('slow',function(){
		$(this).remove();
	});
}

//保存问题
// function saveOption(){
// 	var configId=$('#configId').val();
// 	var qIds='';//questionId
// 	var sIds='';//solutionId
// 	var qs = '';//question
// 	$('#QuestionList').find('a[name=deleteIcon]').each(function(){
// 		// qIds.push($(this).attr('Id'));
// 		// sIds.push($(this).attr('SolId'));
// 		// qs.push($(this).parent().prev().html());
// 		qIds += 'questionIds=' + $(this).attr('Id') + '&';
// 		sIds += 'solutionIds=' + $(this).attr('SolId') + '&';
// 		qs += 'questions=' + $(this).parent().prev().html() + '&';
// 	});
// 	qs = qs.substring(0,qs.length-1);
// 	$.ajax({
// 		type:'get',
// 		datatype:'json',
// 		cache:false,//不从缓存中去数据
// 		url:encodeURI('../../rujia/CouponDetail/addShowQuestion?'+qIds+sIds+qs),
// 		success: function(data){
// 			if(data.status === 0){
// 				yunNoty({status:"0",message:"保存问题配置成功"});
// 				getParamCon();
// 			}else{
// 				yunNoty(data);
// 			}
// 		}
// 	});
// }


//树的初始化START
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
		dataFilter : ajaxDataFilter
	},
	callback: {
		onClick: function(){
			onTreeClick('treeHide','queSel','selQueX','menuContent',sQue)
		},
		beforeClick:hidezTreeBeforeClick
	}
};
//格式化一步获取的json数据
function ajaxDataFilter(treeId, parentNode, responseData) {
	if (responseData) {
		responseData.list.push({ Id:0, ParentId:0, Name:"全部分类", open:true});
		return responseData.list;
	}
	return responseData;
};
function hidezTreeBeforeClick(treeId, treeNode, clickFlag) {
	//return !treeNode.isParent;//当是父节点 返回false 不让选取
	if(treeNode.isParent==true){
		$('#search_Que input[name=isLeaf]').val(0);
	}else{
		$('#search_Que input[name=isLeaf]').val(1);
	}
};

function zTreeBeforeClick(treeId, treeNode, clickFlag) {
	return !treeNode.isParent;//当是父节点 返回false不让选取
};

function showMenu() {
	var cityObj = $("#queSel");
	var cityOffset = $("#queSel").offset();
	$("#menuContent").slideDown("fast");
	$("body").bind("mousedown", onBodyDown);
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

//判断参数是否为空
function isNUll(can1, can2, can3, can4) {
	if (can1 === undefined) {
		return;
	}
	if (can2 === undefined) {
		return;
	}
	if (can3 === undefined) {
		return;
	}
	if (can4 === undefined) {
		return;
	}
}
function onTreeClick(TreeId, showMenuId, groupId, menuId, fun) {
	isNUll(TreeId, showMenuId, groupId);
	var zTree = $.fn.zTree.getZTreeObj(TreeId);
	Nodes = zTree.getSelectedNodes();
	$('#' + showMenuId).html(Nodes[0].Name);
	$('.' + groupId).val(Nodes[0].Id);
	$("#" + menuId).fadeOut("fast");
	if (typeof fun == 'function') {
		fun();
	}
}
//树的初始化END

//添加问题模态框显示
function  showQueModal(obj){
	$('#xswfIndex').val($(obj).attr('rel'));
	$('#comqueModal').modal('show');
}
$('#comqueModal').on('show.bs.modal', function () {
	$.fn.zTree.init($("#treeHide"),hidesetting,[]);
	hideMenu();
	sQue(1);
});

//添加问题模态窗列表
function sQue(pageNo){
	if(!pageNo)pageNo=1;
  $('#ansList').tableAjaxLoader2(2);
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../question/getQueListByMode?pageSize='+15+'&pageNo='+pageNo+'&solutionType=1'),
		data:$("#search_Que").serialize(),
		success:
		function(data){
			if(data.status===0){
				if(data.questionList.length>0){
					var html = "";
					var existIds=[];
					$('#QuestionList').find('a[name=deleteIcon]').each(function(){
						existIds.push($(this).attr('Id')*1);
					});
					for(var i=0;i<data.questionList.length;i++){
						//禁用列表中已经存在的问题
						if($.inArray(data.questionList[i].Id, existIds)>=0){
							html += '<tr id="list-tr-'+data.questionList[i].Id+'">';
                            html += '<td><input disabled="" type="radio" name="row_sel" value="'+data.questionList[i].Id+'" solutionId="'+data.questionList[i].SolutionId+'"></td>';
                            if(data.questionList[i].AnswerStatus==-4){
                                html += '<td class="dueTd">'+data.questionList[i].Question+'<img src="../images/overdue.png" class="overdueImg"></td>';
                            }else{
                                html += '<td>'+data.questionList[i].Question+'</td>';
                            }
                            html += '</tr>';
						}else{
                            html += '<tr id="list-tr-'+data.questionList[i].Id+'">';
                            html += '<td><input type="radio" name="row_sel" value="'+data.questionList[i].Id+'" solutionId="'+data.questionList[i].SolutionId+'"></td>';
                            if(data.questionList[i].AnswerStatus==-4){
                                html += '<td class="dueTd">'+data.questionList[i].Question+'<img src="../images/overdue.png" class="overdueImg"></td>';
                            }else{
                                html += '<td>'+data.questionList[i].Question+'</td>';
                            }
                            html += '</tr>';
                        }
						
					}
					$('#ansList').find('tbody').html(html);
                    $('#treeDiv').slimScroll();
                    icheckInit();
					$('#ansList td').click(function() {
						$(this).parent().find('input[name=row_sel]').iCheck('check');
					});
					//下面开始处理分页
					var options = {
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						alignment:'right',
						onPageClicked: function (event, originalEvent, type, page) {
							sQue(page);
						}
					};
					setPage('quepageList',options);
				}else{
					if($('#search_Que input[name=question]').val() !=''){
						$('#ansList').find('tbody').html('<tr><td colspan="2" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;搜索结果为空！</td></tr>');}
					else{
						$('#ansList').find('tbody').html('<tr><td colspan="2" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
					}
					$('#quepageList').html('');
				}
			}else{
				yunNoty(data);
			}
		}
	});
}
/* 选择问题结束 */

//取绝对地址
function canonical_uri(src, base_path) {
console.log('************start*************');
    var root_page = /^[^?#]*\//.exec(location.href)[0],
    root_domain = /^\w+\:\/\/\/?[^\/]+/.exec(root_page)[0],
    absolute_regex = /^\w+\:\/\//;
    // is `src` is protocol-relative (begins with // or ///), prepend protocol
    if (/^\/\/\/?/.test(src)) {
        src = location.protocol + src;
    }
    // is `src` page-relative? (not an absolute URL, and not a domain-relative path, beginning with /)
    else if (!absolute_regex.test(src) && src.charAt(0) != "/") {
        // prepend `base_path`, if any
        src = (base_path || "") + src;
    }


	// 处理../../
	if(/^..\/..\//.exec(src)) {
		root_page = root_page.replace(/\w+\/\w+\/$/,'');
		src = src.replace(/^..\/..\//, '');
	}
    // make sure to return `src` as absolute
    return absolute_regex.test(src) ? src: ((src.charAt(0) == "/" ? root_domain: root_page) + src);
}
