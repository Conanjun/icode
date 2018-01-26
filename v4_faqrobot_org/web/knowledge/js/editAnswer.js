//富文本
var richtextUE = UE.getEditor('ans_richtext', {
	initialFrameHeight: 300,
	zIndex: 190,
	wordCount:true,
	maximumWords: 20000
});

//流程答案
var flowUE = UE.getEditor('ans_flow', {
	initialFrameHeight: 300,
	zIndex: 190,
	wordCount:true,
	maximumWords: 20000
});

/*********************tree start***********************/
//生效角色树
var setting = {
	check: {
		enable: true,
		chkboxType: { 'Y' : 'ps', 'N' : 'ps' }
	},
	data : {
		simpleData : {
			enable : true,
			idKey : 'Id',
			pIdKey : 'ParentId',
			rootPId : 0
		},
		key : {
			name : 'Name'
		}
	},
	view : {
		dblClickExpand: false,
		selectedMulti : false,
		showIcon: false
	},
	async : {
		enable: true,
		url: '../../comb/loadCombs',
		autoParam: ['id'],
		dataFilter: function(treeId, parentNode, responseData) {
      if (responseData) {
        return responseData.list;
      }
      return responseData;
    }
	},
	callback : {
		beforeClick: function(treeId, treeNode) {
			var zTree = $.fn.zTree.getZTreeObj('treeUserRole');
      zTree.checkNode(treeNode, !treeNode.checked, null, true);
      return false;
    },
	onCheck: function(e, treeId, treeNode) {
		var zTree = $.fn.zTree.getZTreeObj('treeUserRole');
		nodes = zTree.getCheckedNodes(true);
		v = '';
		I = '';
		for (var i=0, l=nodes.length; i<l; i++) {
			if (nodes[i].Leaf == 1) {
				v += nodes[i].Name + ',';
				I += nodes[i].Id + '~';
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
		$('#AddQuesForm input[name=hasChecked]').val(v);
		$('#AddQuesForm input[name=hasCheckedId]').val(I);
      //}
    },
	onAsyncSuccess: function(event, treeId, treeNode) {
		var zTree = $.fn.zTree.getZTreeObj('treeUserRole');
		var IdString = $('#AddQuesForm input[name=hasCheckedId]').val();
		if(IdString) {
			var Ids = IdString.split('~');
			var node = null;
			for(i = 0 ; i < Ids.length; i ++ ) {
				zTree.checkNode( zTree.getNodeByParam( 'Id', Ids[i] ), true );
			}
		}
	}
}
};

function setrolename() {
  $('#rolename').val($('#AddQuesForm input[name=hasChecked]').val());
  $('#roleModel').modal('hide');
}
/*********************tree end***********************/

//选择语音
$('#voiceModel').on('show.bs.modal', function () {
	voiceList(1);
});

function voiceList(pageNo, type1) {
	if (!pageNo) pageNo = 1;
	if (!type1) type1 = '2';
	$('#voiceList').tableAjaxLoader2(3);
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../material/list?pageSize=' + 5 + '&pageNo=' + pageNo + '&type=' + type1),
		data: $('#search_Voice').serialize(),
		success: function(data) {
			if (data.status === 0) {
				if (data.list.length > 0) {
					var html = '';
					for (var i = 0; i < data.list.length; i++) {
						html += '<tr id="list-tr-' + data.list[i].Id + '">';
						html += '<td><input type="radio" name="row_sel_voice" class="select_row" value="' + data.list[i].Id + '"  rel="' + data.list[i].Path + '"/></td>';
						html += '<td>' + data.list[i].Name + '</td>';
						html += '<td><div id="jquery_jplayer_'+ i +'"class="jp-jplayer" path="../../'+ data.list[i].Path +'"></div><div id="jp_container_'+ i +'"class="jp-audio"role="application"aria-label="media player"><div class="jp-type-single"><div class="jp-gui jp-interface"><div class="jp-controls"><button class="jp-play"role="button"tabindex="0">play</button><button class="jp-stop"role="button"tabindex="0">stop</button></div><div class="jp-progress"><div class="jp-seek-bar"><div class="jp-play-bar"></div></div></div><div class="jp-time-holder"><div class="jp-current-time"role="timer"aria-label="time">&nbsp;</div><div class="jp-duration"role="timer"aria-label="duration">&nbsp;</div><div class="jp-toggles"><button class="jp-repeat"role="button"tabindex="0">repeat</button></div></div></div><div class="jp-no-solution"><span>Update Required</span>To play the media you will need to either update your browser to a recent version or update your<a href="http://get.adobe.com/flashplayer/"target="_blank">Flash plugin</a>.</div></div></div></td>';
						html += '</tr>';
					}
					$('#voiceList').find('tbody').html(html);
					icheckInit();
					$('#voiceList td').click(function() {
						$(this).parent().find('.select_row').iCheck('check');
					});
					//下面开始处理分页
					var options = {
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function(event, originalEvent, type, page) {
							voiceList(page, type1);
						}
					};
					setPage('voicepageList', options);
					if(data.list[0]) {
						for(var j=0; j<data.list.length; j++) {
							//jplayer
							$('#jquery_jplayer_'+ j).jPlayer({
								ready: function () {
									$(this).jPlayer('setMedia', {
										m4a: $(this).attr('path'),
									});
								},
								supplied: 'm4a, oga',
								cssSelectorAncestor: '#jp_container_'+ j,
								wmode: 'window',
								globalVolume: true,
								useStateClassSkin: true,
								autoBlur: false,
								smoothPlayBar: true,
								keyEnabled: true
							});
						}
					}
				} else {
					if ($('#search_Voice input[name=name]').val() !== '') {
						$('#voiceList').find('tbody').html('<tr><td colspan=\"3\"  style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;搜索结果为空！</td></tr>');
					} else {
						$('#voiceList').find('tbody').html('<tr><td colspan=\"3\"  style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
					}
					$('#voicepageList').html('');
				}
			} else {
				yunNoty(data);
			}
		}
	});
}

$('#selVoiceBtn').click(function(){
	var id = getSelectedIds_voice();
	$('#voiceId').val(id);
	$('#ans_voice button').html($('#voiceDiv #list-tr-'+id).children('td').eq(1).html());
	if($('#ans_voice button').html() === '') {
		$('#ans_voice button').hide();
	} else {
		$('#ans_voice button').show();
	}
	$('#voiceModel').modal('hide');
});
function getSelectedIds_voice() {
	var cboxs = document.getElementsByName('row_sel_voice');
	if(typeof cboxs=='undefined'){
		return -1;
	}
	var inputvalue='';
	for(var i=0;i<cboxs.length;i++){
		if(cboxs[i].checked===true){
			inputvalue=cboxs[i].value;
		}
	}
	return inputvalue;
}

//选择第三方
$('#otherModel').on('show.bs.modal', function () {
	otherList(1);
});

//第三方列表
function otherList(pageNo) {
	if (!pageNo) pageNo = 1;
	$('#otherList').tableAjaxLoader2(3);
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../thirdOpen/listThirdOpen?type='+0+'&pageSize=' + 5 + '&pageNo=' + pageNo),
		data: $('#search_Other').serialize(),
		success: function(data) {
			if (data.status === 0) {
				if (data.list.length > 0) {
					var html = '';
					for (var i = 0; i < data.list.length; i++) {
						html += '<tr id="list-tr-' + data.list[i].Id + '">';
						html += '<td><input type="radio" name="row_sel_other" class="select_row" value="' + data.list[i].Id + '"/></td>';
						// html += "<td>" + data.list[i].Url + "</td>";
						html += '<td>' + limitstr(data.list[i].Info, 20) + '</td>';
						html += '</tr>';
					}
					$('#otherList').find('tbody').html(html);
					//下面开始处理分页
					var options = {
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function(event, originalEvent, type, page) {
							otherList(page);
						}
					};
					setPage('otherpageList', options);
					icheckInit();
					$('#otherList td').click(function() {
						$(this).parent().find('.select_row').iCheck('check');
					});
				} else {
					if ($('#search_Other input[name=info]').val() !== '') {
						$('#otherList').find('tbody').html('<tr><td colspan=\"3\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;搜索结果为空！</td></tr>');
					} else {
						$('#otherList').find('tbody').html('<tr><td colspan=\"3\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！<br><a href="../../web/platform/portList.html" data-num="0" data-name="第三方列表">点击跳转到第三方列表</a></td></tr>');
						iframeTab.init({iframeBox: ''});
					}
					$('#otherpageList').html('');
				}
			} else {
				yunNoty(data);
			}
		}
	});
}

$('#selOtherBtn').click(function(){
	var id = getSelectedIds_other();
	$('#otherId').val(id);
	$('#ans_other button').html($('#otherDiv #list-tr-'+id).children('td').eq(2).html());
	if($('#ans_other button').html() === '') {
		$('#ans_other button').hide();
	} else {
		$('#ans_other button').show();
	}
	$('#otherModel').modal('hide');
});

$('#search_Other input[name=info]').keyup(function(event) {
	if(event.keyCode == 13) {
		otherList();
	}
});

function getSelectedIds_other() {
	var cboxs = document.getElementsByName('row_sel_other');
	if(typeof cboxs=='undefined'){
		return -1;
	}
	var inputvalue='';
	for(var i=0;i<cboxs.length;i++){
		if(cboxs[i].checked===true){
			inputvalue=cboxs[i].value;
		}
	}
	return inputvalue;
}

//选择自定义AskToken
$('#askModel').on('show.bs.modal', function () {
	askList(1);
});

//AskToken列表
function askList(pageNo) {
	if (!pageNo) pageNo = 1;
	$('#askList').tableAjaxLoader2(3);
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../thirdOpen/listThirdOpen?type='+1+'&pageSize=' + 5 + '&pageNo=' + pageNo),
		data: $('#search_Ask').serialize(),
		success: function(data) {
			if (data.status === 0) {
				if (data.list.length > 0) {
					var html = '';
					for (var i = 0; i < data.list.length; i++) {
						html += '<tr id="list-ask-' + data.list[i].Id + '">';
						html += '<td><input type="radio" name="row_sel_ask" class="select_row" value="' + data.list[i].Id + '"/></td>';
						html += '<td>' + data.list[i].Url + '</td>';
						html += '<td>' + limitstr(data.list[i].Info, 20) + '</td>';
						html += '</tr>';
					}
					$('#askList').find('tbody').html(html);
					//下面开始处理分页
					var options = {
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function(event, originalEvent, type, page) {
							askList(page);
						}
					};
					setPage('askpageList', options);
					icheckInit();
					$('#timePicker').on('ifChecked', function() {
						$('#dateTime').show();
					}).on('ifUnchecked', function() {
						$('#dateTime').hide();
						$('#ansRuleForm [name=StartTime]').val('');
						$('#ansRuleForm [name=EndTime]').val('');
					});
					$('#askList td').click(function() {
						$(this).parent().find('.select_row').iCheck('check');
					});
				} else {
					if ($('#search_Ask input[name=info]').val() !== '') {
						$('#askList').find('tbody').html('<tr><td colspan=\"3\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;搜索结果为空！</td></tr>');
					} else {
						$('#askList').find('tbody').html('<tr><td colspan=\"3\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！<br><a href="../../web/platform/askTokenList.html" data-num="0" data-name="AskToken列表">点击跳转到AskToken列表</a></td></tr>');
					}
					$('#askpageList').html('');
				}
			} else {
				yunNoty(data);
			}
		}
	});
}

$('#selAskBtn').click(function(){
	var id = getSelectedIds_ask();
	$('#askId').val(id);
	$('#ans_ask button').html($('#askDiv #list-ask-'+id).children('td').eq(2).html());
	if($('#ans_ask button').html() === '') {
		$('#ans_ask button').hide();
	} else {
		$('#ans_ask button').show();
	}
	$('#askModel').modal('hide');
});

$('#search_Ask button').click(function() {
	askList();
});

$('#search_Ask input[name=info]').keyup(function(event) {
	if(event.keyCode == 13) {
		askList();
	}
});

function getSelectedIds_ask() {
	var cboxs = document.getElementsByName('row_sel_ask');
	if(typeof cboxs=='undefined'){
		return -1;
	}
	var inputvalue='';
	for(var i=0;i<cboxs.length;i++){
		if(cboxs[i].checked===true){
			inputvalue=cboxs[i].value;
		}
	}
	return inputvalue;
}

//选择二维数组
$('#tabModel').on('show.bs.modal', function () {
	tabArrayList(1);
});

//二维数组
function tabArrayList(pageNo) {
	if (!pageNo) pageNo = 1;
	$('#tabList').tableAjaxLoader2(3);
	$('[name="orderType"]').val(4);
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../DimensionExcel/listRelationWord?word='+$('#search_Tab input[name=info]').val()+'&pageSize=' + 5 + '&pageNum=' + pageNo + '&orderType=2'),
		data: $('#search_Tab').serialize(),
		success: function(data) {
			if (data.status === 0) {
				if (data.list.length > 0) {
					var html = '';
					for (var i = 0; i < data.list.length; i++) {
						html += '<tr id="list-tab-' + data.list[i].Id + '">';
						html += '<td><input type="radio" name="row_sel_tab" class="select_row" value="' + data.list[i].Id + '"/></td>';
						html += '<td>' + data.list[i].Name + '</td>';
						html += '</tr>';
					}
					$('#tabList').find('tbody').html(html);
					//下面开始处理分页
					var options = {
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function(event, originalEvent, type, page) {
							tabArrayList(page);
						}
					};
					setPage('tabpageList', options);
					icheckInit();
					$('#timePicker').on('ifChecked', function() {
						$('#dateTime').show();
					}).on('ifUnchecked', function() {
						$('#dateTime').hide();
						$('#ansRuleForm [name=StartTime]').val('');
						$('#ansRuleForm [name=EndTime]').val('');
					});
					$('#tabList td').click(function() {
						$(this).parent().find('.select_row').iCheck('check');
					});
				} else {
					if ($('#search_Tab input[name=info]').val() !== '') {
						$('#tabList').find('tbody').html('<tr><td colspan=\"3\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;搜索结果为空！</td></tr>');
					} else {
						$('#tabList').find('tbody').html('<tr><td colspan=\"3\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！<br><a href="../../web/knowledge/queryTab.html" data-num="0" data-name="表格查询问答列表">点击跳转到表格查询问答列表</a></td></tr>');
					}
					$('#tabpageList').html('');
				}
			} else {
				yunNoty(data);
			}
		}
	});
}

//二维数组表头
function tabArrayThead(){
    var tabId = $('#tabId').val();
    var answerId = getUrlParam('answerId');
    var tabStr = "";
    var selectedCount = 0; //被选中的标签数
    $.ajax({
        url:'../../DimensionExcel/findDimensionFirstLine',
        type:'post',
        dataType:'json',
        data:{
            id:tabId,
			answerId:answerId
        },
        cache:false,
        success:function(data){
            if(data.list){
                tabStr = '<a class="tabTitle btn btn-white m-r-5 m-t-5" tabId="" href="javascript:void(0)">' + data.main + '</a>' + '： ';
                $.each(data.list, function(i, item){
                	if(item.selecting){
                        tabStr += '<a class="btn btn-primary m-r-5 m-t-5" tabId="'+i+'" tat="1">'+item.xson+'</a>';
					}else if(item.selected){
                        tabStr += '<a class="timeTip btn btn-white m-r-5 m-t-5 isSelected" tabId="'+i+'" tat="0" title="'+item.question+'" style="color:#ddd;cursor: not-allowed;" href="javascript:void(0)">'+item.xson+'</a>';
					}else{
                        tabStr += '<a class="btn btn-white m-r-5 m-t-5" tabId="'+i+'" tat="0">'+item.xson+'</a>';
					}

					if(item.selecting){
						selectedCount++;
					}

                });

                $('#tabArrayThead').html(tabStr);
                //判断是否有标签被选中，若没有，则选择主标签
                if(selectedCount == 0){
					$('#tabArrayThead .tabTitle').removeClass('btn-white').addClass('btn-primary')
				}else{
                    $('#tabArrayThead .tabTitle').removeClass('btn-priamry').addClass('btn-white')
				}
                $('.timeTip').tooltip();
            }

        }
    });

    //选择表头
    $('#tabArrayThead').on('click','a[tabId]',function(e){
        var src = e.target||window.event.srcElement;
        if($(src).hasClass('btn-white')&&!$(src).hasClass('isSelected')){
            $(src).removeClass('btn-white').addClass('btn-primary').attr('tat',1).siblings('a').removeClass('btn-primary').addClass('btn-white').attr('tat',0);
            
        }
        if($(src).hasClass('tabTitle')){
            $(src).removeAttrs('tat');
        }
    });

}

$('#selTabBtn').click(function(){
	var id = getSelectedIds_tab();
	$('#tabId').val(id);
	$('#ans_tab button').html($('#tabDiv #list-tab-'+id).children('td').eq(1).html());
	if($('#ans_tab button').html() === '') {
		$('#ans_tab button').hide();
	} else {
		$('#ans_tab button').show();
	}
	//选择表头
    tabArrayThead();
	$('#tabModel').modal('hide');
});

$('#search_Tab button').click(function() {
	tabArrayList();
});

$('#search_Tab input[name=info]').keyup(function(event) {
	if(event.keyCode == 13) {
		$('#search_Tab button').trigger('click');
	}
});

function getSelectedIds_tab() {
	var cboxs = document.getElementsByName('row_sel_tab');
	if(typeof cboxs=='undefined'){
		return -1;
	}
	var inputvalue='';
	for(var i=0;i<cboxs.length;i++){
		if(cboxs[i].checked===true){
			inputvalue=cboxs[i].value;
		}
	}
	return inputvalue;
}

//选择表单
$('#formModel').on('show.bs.modal', function () {
	formList(1);
});

//表单列表
function formList(pageNo) {
	if (!pageNo) pageNo = 1;
	$('#formList').tableAjaxLoader2(3);
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../StepForm/list?pageSize=' + 10 + '&pageNo=' + pageNo + '&orderType=4'),
		success: function(data) {
			if (data.status === 0) {
				if (data.List.length > 0) {
					var html = '';
					for (var i = 0; i < data.List.length; i++) {
						html += '<tr id="list-tr-' + data.List[i].Id + '">';
						html += '<td><input type="radio" name="row_sel_form" class="select_row" value="' + data.List[i].Id + '"/></td>';
						html += '<td>' + data.List[i].Name + '</td>';
						html += '<td>' + data.List[i].AddTime + '</td>';
						html += '</tr>';
					}
					$('#formList').find('tbody').html(html);
					//下面开始处理分页
					var options = {
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function(event, originalEvent, type, page) {
							formList(page);
						}
					};
					setPage('formpageList', options);
					icheckInit();
					$('#formList td').click(function() {
						$(this).parent().find('.select_row').iCheck('check');
					});
				} else {
					$('#formList').find('tbody').html('<tr><td colspan=\"3\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
					$('#formpageList').html('');
				}
			} else {
				yunNoty(data);
			}
		}
	});
}

$('#selFormBtn').click(function(){
	var id = getSelectedIds_form();
	$('#formId').val(id);
	$('#ans_form button').html($('#formDiv #list-tr-'+id).children('td').eq(1).html());
	if($('#ans_form button').html() === '') {
		$('#ans_form button').hide();
	} else {
		$('#ans_form button').show();
	}
	$('#formModel').modal('hide');
});

function getSelectedIds_form() {
	var cboxs = document.getElementsByName('row_sel_form');
	if(typeof cboxs=='undefined'){
		return -1;
	}
	var inputvalue='';
	for(var i=0;i<cboxs.length;i++){
		if(cboxs[i].checked===true){
			inputvalue=cboxs[i].value;
		}
	}
	return inputvalue;
}

//选择视频
$('#videoModel').on('show.bs.modal', function () {
	videoList(1);
});
var uploader;
$('#videoModel').on('shown.bs.modal', function () {
	resetUploader(3,'#videoUpload');
});
$(videoModel).on('hide.bs.modal', function () {
	uploader.destroy();
});

function videoList(pageNo, type1) {
	if (!pageNo) pageNo = 1;
	if (!type1) type1 = '3';
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../material/list?pageSize=' + 6 + '&pageNo=' + pageNo + '&type=' + type1),
		success: function(data) {
			if (data.status === 0) {
				if (data.list.length > 0) {
					$('#videoibh').css('display','none');
					var renderTo=$('#videoBody');
					$('#videoBody').html('');
					var ul=$('<ul id=\'videoUl\'></ul>').appendTo(renderTo);
					for (var i = 0; i < data.list.length; i++) {
						var li=$('<li class=\'videoLi\'></li>').appendTo(ul);
						var src=data.list[i].Path;
						var video=$('<video src=\'/'+src+'\' controls=\'controls\'>您的浏览器不支持 video 标签。</video>').appendTo(li);						
						li.data('Id',data.list[i].Id);
						li.data('src',data.list[i].Path);
					}
					$('.videoLi').each(function(){
						$(this).click(function(){
							$('#vodeoId').val($(this).data('Id'));
							var src=$(this).data('src');
							$('#vodeoId').prevAll().children('video').attr('src','/'+src);
							$('#vodeoId').prev().css('display','block');
							
							if($('#delVideo')[0] == undefined) {
								$('#videoShow').after('<div style="margin-top:4px;"><div class="btn btn-default" id="delVideo">删除</div></div>');
							}
							$('#videoModel').modal('hide');
							
						});
					});
					//下面开始处理分页
					var options = {
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function(event, originalEvent, type, page) {
							videoList(page, type1);
						}
					};
					setPage('videopageList', options);
			} else {
				$('#videoBody').html('');
				$('#videoibh').css('display','block');
			}
		}
		}
	});
}

$('body').on('click', '#delVideo', function() {
	$('#videoShow').children('video').attr('src','');
	$('#videoShow').css('display', 'none');
	$('#vodeoId').val('');
	$(this).parent().remove();
});




//选择图片
$('#onlyPictureModel').on('show.bs.modal', function () {
	$('#ibh').hide();
	onlyImgTextList(1);
});
$('#onlyPictureModel').on('shown.bs.modal', function () {
	resetUploader(1,'#onlyImgUpload');
});
$('#onlyPictureModel').on('hide.bs.modal', function () {
	uploader.destroy();
});

//生成uploader
function resetUploader(type,render) {
	
	//上传素材
	uploader = WebUploader.create({
		server: '../../material/jQueryFileUpload?type='+type+'&materialType='+type,
		swf: '../common/js/Uploader.swf',
		pick: $(render),
		duplicate: true,
		auto: true,
	});
	//加入队列之前
	uploader.on( 'beforeFileQueued', function( file ) {
		if(!file.size) {
			Base.gritter('文件大小为空！', false);
		}
		if(file.size > 10240000) {
			var msg = '文件大小不能超过10M';
			Base.gritter(msg, false);
			return false;
		}
		
	});
	//获取服务端返回的数据
	uploader.on( 'uploadAccept', function( object, data ) {
		var error = data.files[0].error,
			msg = '上传文件成功';

		if(error) {
			Base.gritter(error, false);
		}else {
			Base.gritter(msg, true);
			if(type==1){
				onlyImgTextList(1);
			}
			else if(type==3){
				videoList(1,3);
			}
		}
	});
	//上传开始
	uploader.on( 'startUpload', function( file, percentage ) {
		$('.progress-striped').show();
	});
	//上传进度
	uploader.on( 'uploadProgress', function( file, percentage ) {
		$('.progress-bar').css({'width': percentage*100 +'%'});
	});
	//限制单次上传数量
	uploader.on( 'uploadFinished', function( object, data ) {
		$('.progress-bar').css({'width': 0});
		$('.progress-striped').hide();
		uploader.reset();
	});
}

//图片列表
function onlyImgTextList(pageNo) {
	if (!pageNo) pageNo = 1;
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../material/list?pageSize=' + 6 + '&pageNo=' + pageNo+'&type=1'),
		success: function(json) {
			if (json.status === 0) {
				if (json.list.length === 0) {
					$('#op').empty();
					$('#onlyPictureibh').css('display','block');
				} else {
					$('#onlyPictureibh').css('display','none');
					$('#op').empty();
					var renderTo=('#op');
					var ul=$('<ul classs=\'onlyImgUl\'></ul>').appendTo(renderTo);
					for (var i in json.list) {  //图片生成
						var li=$('<li class=\'onlyImgLi\'></li>').appendTo(ul);
						var img=$('<img src=\'/'+json.list[i].Path+'\' />').appendTo(li);
						li.data('Id',json.list[i].Id);
						li.data('src',json.list[i].Path);
					}
					
					$('.onlyImgLi').each(function(){
						$(this).click(function(){
							$('#OnlyPictureId').val($(this).data('Id'));
							var src=$(this).data('src');
							$('#OnlyPictureId').prevAll().children('img').attr('src','/'+src);
							$('#OnlyPictureId').prev().css('display','block');
							
							if($('#delOnlyPicture')[0] == undefined) {
								$('#OnlyPictureShow').after('<div style="margin-top:4px;"><div class="btn btn-default" id="delOnlyPicture">删除</div></div>');
							}
							$('#onlyPictureModel').modal('hide');
							
						});
					});
					
					//下面开始处理分页
					var options = {
						currentPage: json.currentPage,
						totalPages: json.totlePages,
						onPageClicked: function(event, originalEvent, type, page) {
							onlyImgTextList(page);
						}
					};
					setPage('OnlyPicturepageList', options);
				}
			} else {
				yunNoty(json.result);
			}

		}
	});
}

$('body').on('click', '#delOnlyPicture', function() {
	$('#OnlyPictureShow').children('img').attr('src','');
	$('#OnlyPictureShow').css('display', 'none');
	$('#OnlyPictureId').val('');
	$(this).parent().remove();
});



//选择图文
$('#pictureModel').on('show.bs.modal', function () {
	$('#ibh').hide();
	imgTextList(1);
});

//图文列表
function imgTextList(pageNo) {
	if (!pageNo) pageNo = 1;
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../Wxappmsg/list?pageSize=' + 6 + '&pageNo=' + pageNo),
		success: function(json) {
			if (json.result.status === 0) {
				if (json.result.list.length === 0) {
					$('#ibh').show();
				} else {
					$('#ib0').empty();
					$('#ib1').empty();
					$('#ib2').empty();
					for (var i = 0; i < json.result.list.length; i++) {
						var imgTxtHtml = '';
						if (json.result.list[i].wxappmsgDetails.length == 1) {
							imgTxtHtml += '<div class="m-t-5 m-b-5" name="pictureBlock">';
							imgTxtHtml += '<div style="border: 1px solid #D4D4D4; border-radius: 3px; max-height: 280px; overflow: hidden;padding: 5px;">';
							imgTxtHtml += '<input type="hidden" class="idValue" value="' + json.result.list[i].id + '"/>';
							imgTxtHtml += '<div class="head-msg-item" style="display: inline-block; width: 100%; position: relative;">';
							imgTxtHtml += '<h4 style="max-width: 320px;position: absolute;background: none repeat scroll 0 0 rgba(0, 0, 0, 0.6) !important;bottom: 0;margin: 0;width: 100%;color: #fff;overflow: hidden;"><span style="word-wrap: break-word;padding: 0 4px;line-height: 28px;">'+json.result.list[i].wxappmsgDetails[0].title+'</span></h4>';
							imgTxtHtml += '<p style="padding: 4px 8px;"><span>'+json.result.list[i].timeStr+'</span></p>';
							imgTxtHtml += '<div style="height: 160px; overflow: hidden; width: 100%;"><img src="'+json.result.list[i].wxappmsgDetails[0].imgUrl+'" style="min-height: 50px; width: 100%; max-width: 320px;"></div>';
							imgTxtHtml += '</div></div>';
						} else {
							imgTxtHtml += '<div class="m-t-5 m-b-5" name="pictureBlock">';
							imgTxtHtml += '<div style="border: 1px solid #D4D4D4; border-radius: 3px;">';
							imgTxtHtml += '<input type="hidden" class="idValue" value="' + json.result.list[i].id + '"/>';
							imgTxtHtml += '<div class="head-msg-item" style="display: inline-block; width: 100%; position: relative;">';
							imgTxtHtml += '<h4 style="max-width: 320px;position: absolute;background: none repeat scroll 0 0 rgba(0, 0, 0, 0.6) !important;bottom: 0;margin: 0;width: 100%;color: #fff;overflow: hidden;"><span style="word-wrap: break-word;padding: 0 4px;line-height: 28px;">'+json.result.list[i].wxappmsgDetails[0].title+'</span></h4>';
							imgTxtHtml += '<p style="padding: 4px 8px;"><span>'+json.result.list[i].timeStr+'</span></p>';
							imgTxtHtml += '<div style="height: 160px; overflow: hidden; width: 100%;"><img src="'+json.result.list[i].wxappmsgDetails[0].imgUrl+'" style="min-height: 50px; width: 100%; max-width: 320px;"></div>';
							imgTxtHtml += '</div>';
							for(var j = 1; j < json.result.list[i].wxappmsgDetails.length; j++){
								imgTxtHtml += '<div style="border-top: 1px solid #D4D4D4;"></div>';
								imgTxtHtml += '<div class="sub-msg-item" style="max-width: 320px; margin:5px 0; padding:10px 12px;">';
								imgTxtHtml += '<div style="display: table;"></div>';
								imgTxtHtml += '<div style="width: 66.67%;float: left;min-height: 1px;"><h4><span>'+json.result.list[i].wxappmsgDetails[j].title+'</span></h4></div>';
								imgTxtHtml += '<div style="width: 33.33%;float: left;min-height: 1px;"><img src="'+json.result.list[i].wxappmsgDetails[j].imgUrl+'" style="border: 1px solid #b2b8bd;display: block;max-width: 100%;height: auto;"></div>';
								imgTxtHtml += '<div style="display: table; clear: both;"></div>';
								imgTxtHtml += '</div>';
							}
							imgTxtHtml += '</div></div>';
						}
						$('#ib' + (i%3)).append(imgTxtHtml);
					}
					$('div[name=pictureBlock]').click(function() {
						$('#pictureId').val($(this).find('input.idValue').val());
						$(this).children().css('min-width','322px');
						$('#pictureShow').html($(this).prop('innerHTML'));
						$(this).children().find('div.thumbnail').css('border-color', 'red');
						$('#pictureModel').modal('hide');
					});
					//下面开始处理分页
					var options = {
						currentPage: json.result.currentPage,
						totalPages: json.result.totlePages,
						onPageClicked: function(event, originalEvent, type, page) {
							imgTextList(page);
						}
					};
					setPage('picturepageList', options);
				}
			} else {
				yunNoty(json.result);
			}

		}
	});
}

//新增修改答案ajax
var flag_add = false;
var URL = '';
function Edit() {
	//如果是修改答案
	if(AnswerId !== null) {
		URL = '../../answer/doEditAnswer?answerId='+AnswerId;
	//如果是添加答案
	} else {
		URL = '../../answer/addAnswer';
	}
	//url中的问题ID
	if(SolutionId === '') {
		yunNotyError('没有问题ID，无法添加或修改答案，请关闭当前页面重试！');
		return false;
	}
	//url中的问题分组ID
	if(GroupId === '') {
		yunNotyError('没有问题分类，无法添加或修改答案，请关闭当前页面重试！');
		return false;
	}
	//消息类型 0文本 1图文 2富文本 3声音 4第三方
	var mode = -1;
	//图文或语音或第三方ID
	var modeValue = '';
	//问题生效否0是1
	var answerTimeLiness = 0;
	//问题生效起
	var answerStartTime = '';
	//问题生效止
	var answerEndTime = '';
	//答案内容
	var answer = '';
	//第三方链接
	var thirdUrl = $('#AddQuesForm input[name=thirdUrl]').val().trim();
	//答案生效规则
	var effectiveRules = [];

    $.each($('#tabArrayThead').find('a[tabId]'), function(i, item){
        if($(item).attr('tat') == 1){
            answer = $(item).html();
        }
    });

    if($('#text').hasClass('active')) {
		mode = 0;
		answer = $('#ans_text').val();
		if(answer === '' || answer.length < 2 || answer.length > 200) {
			yunNotyError('答案长度需在2-200个字符之间！');
			return false;
		}
	} else if($('#richtext').hasClass('active')) {
		mode = 2;
		answer = richtextUE.getContent();
		if(answer === '' || answer.length < 2 || answer.length > 20000) {
			yunNotyError('答案长度需在2-20000个字符之间！');
			return false;
		}
	} else if($('#voice').hasClass('active')) {
		mode = 3;
		modeValue = $('#voiceId').val();
		if(modeValue === '') {
			yunNotyError('请选择语音答案！');
			return false;
		}
	} else if($('#onlyPicture').hasClass('active')) {
		mode = 3;
		modeValue = $('#OnlyPictureId').val();
		if(modeValue === '') {
			yunNotyError('请选择图片答案！');
			return false;
		}
	} else if($('#video').hasClass('active')) {
		mode = 3;
		modeValue = $('#vodeoId').val();
		if(modeValue === '') {
			yunNotyError('请选择视频答案！');
			return false;
		}
	} else if($('#picture').hasClass('active')) {
		mode = 1;
		modeValue = $('#pictureId').val();
		if(modeValue === '') {
			yunNotyError('请选择图文答案！');
			return false;
		}
	} else if($('#other').hasClass('active')) {
		mode = 4;
		modeValue = $('#otherId').val();
		if(modeValue === '') {
			yunNotyError('请选择第三方答案！');
			return false;
		}
	} else if($('#flow').hasClass('active')) {
		mode = 6;
		answer = flowUE.getContent();
		if(answer === '' || answer.length < 2 || answer.length > 20000) {
			yunNotyError('流程答案长度需在2-20000个字符之间！');
			return false;
		}
	} else if($('#form').hasClass('active')) {
		mode = 7;
		modeValue = $('#formId').val();
		if(modeValue === '') {
			yunNotyError('请选择报表答案！');
			return false;
		}
	} else if($('#rg').hasClass('active')) {
		mode = 8;
		// answer = $('#ans_rg').val();
		answer = '转人工问题';
		if(answer === '') {
			yunNotyError('请填写转人工答案！');
			return false;
		}
	} else if($('#ask').hasClass('active')) {
		mode = 11;
		modeValue = $('#askId').val();
		if(modeValue === '') {
			yunNotyError('请选择自定义AskToken！');
			return false;
		}
	}else if($('#tabArray').hasClass('active')) {
		mode = 10;
		modeValue = $('#tabId').val();
		if(modeValue === '') {
			yunNotyError('请选择二维数组！');
			return false;
		}
	}else if($('#order').hasClass('active')) {
		mode = 12;
		answer = $('#ans_order').val();
		if(answer === '' || answer.length < 2 || answer.length > 200) {
			yunNotyError('答案长度需在2-200个字符之间！');
			return false;
		}
	}
	// taskid=467  顾荣 推荐链接返回错误bug 链接不为空或者不为“http://”或者不符合正则则返回格式不正确 2017/12/21
	var urlreg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%/~\+#])?/;
	if (thirdUrl!= ''&&thirdUrl!= 'http://'&&!thirdUrl.match(urlreg)) {
        yunNotyError("网址格式不正确！");
        return;
    }
	if($('#AddQuesForm [name=StartTime]').val() !== '' || $('#AddQuesForm [name=EndTime]').val() !== '') {
		answerStartTime = $('#AddQuesForm [name=StartTime]').val();
		answerEndTime = $('#AddQuesForm [name=EndTime]').val();
		answerTimeLiness = 1;
	}
	// if($('#otherName').val() != '') {
	// 	thirdUrl = $('#otherName').val();
	// }
	var effectiveRule1 = {
		'type' : 1,
		'roleIds' : ''
	};
	$('#DivRule_Way a.btn-primary').each(function() {
		effectiveRule1.roleIds += $(this).attr('fid')+',';
	});
	if(effectiveRule1.roleIds === '') {
		effectiveRule1.roleIds = '-1';
	} else {
		effectiveRule1.roleIds = effectiveRule1.roleIds.substring(0,effectiveRule1.roleIds.length-1);
	}
	//console.log(effectiveRule1.roleIds);
	var effectiveRule2 = {
		'type' : 2,
		'roleIds' : ''
	};
	if($('#DivRule_Role input[name=hasCheckedId]').length) {
  	effectiveRule2.roleIds = $('#DivRule_Role input[name=hasCheckedId]').val().split('~').join(',');
	} else {
		effectiveRule2.roleIds = '';
	}
	if(effectiveRule2.roleIds === '') {
		effectiveRule2.roleIds = '-1';
	}
	//console.log(effectiveRule2.roleIds);
	effectiveRules.push(effectiveRule1);
	effectiveRules.push(effectiveRule2);
	effectiveRules = JSON.stringify(effectiveRules);
    //console.log(JSON.stringify(effectiveRules));
    if(isFlow && isFlow == '1'){
        mode = 6;
    }
	var dataJSON = {
		solutionId : SolutionId,
		groupId : GroupId,
		mode : mode,
		modeValue : modeValue,
		timeLiness : answerTimeLiness,
		startTime : answerStartTime,
		endTime : answerEndTime,
		answer : answer,
		thirdUrl : thirdUrl,
		effectiveRules : effectiveRules
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
		url: encodeURI(URL),
		data: dataJSON,
		success: function(data) {
			flag_add = false;
			if (data.status === 0) {
				yunNoty(data,function() {
					if(AnswerId === null && $('#isAgain').attr('checked') == 'checked') {
						//清空表单
						$('#question').val('');
						$('#ans_text').val('');
						UE.getEditor('ans_richtext').setContent('');
						$('#pictureShow').html('');
						$('#pictureId').val('');
						$('#ans_voice button').hide();
						$('#voiceId').val('');
						$('#ans_other button').hide();
						$('#otherName').val('');
						$('#otherId').val('');
						$('#ans_ask button').hide();
						$('#askName').val('');
						$('#askId').val('');
						$('#ans_tab button').hide();
						$('#tabName').val('');
						$('#tabId').val('');
						$('#ans_form button').hide();
						$('#formId').val('');
						$('#similarQueForm [name=similarQueInput]').each(function() {
							$(this).val('');
						});
						$('#ruleDiv').html('');
						$('#ansRuleStartTime').val('');
						$('#ansRuleEndTime').val('');
						$('#queClassify').val('');
						$('#ClassesIds').val('');
						$('.QueContainer input[name=postQueInput]').each(function() {
							$(this).val('');
							$(this).attr('rel', '');
							$(this).attr('srel', '');
						});
						$('a[fid]').removeClass('btn-primary').addClass('btn-white');
						var treeObj = $.fn.zTree.getZTreeObj('treeUserRole');
						treeObj.checkAllNodes(false);
						$('#AddQuesForm input[name=hasChecked]').val('');
						$('#AddQuesForm input[name=hasCheckedId]').val('');
						$('#timePicker').iCheck('uncheck');
						$('#dateTime').hide();
						$('#AddQuesForm [name=StartTime]').val('');
						$('#AddQuesForm [name=EndTime]').val('');
					} else {
						var ifT = iframeTab.init({iframeBox: ''});
						ifT.closeActIframe('',parent.$('#tabHeader li[data-num="'+getUrlParam('tmpNum')+'"]').attr('data-tab'));
					}
				});
			} else {
				yunNoty(data);
			}

		}
	});
}

function findAnswerDetail(id) {
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../answer/findAnswerById'+'?id='+id),
		success: function(data) {
			if (data.status === 0) {
				//接口
				var answerHasRole = false;
				if(data.listRule !== undefined) {
					if(data.listRule.length>0) {
						for(var i in data.listRule) {
							if(data.listRule[i].type == 1) {
								$.each(data.listRule[i].roleIds.split(','), function() {
									$('#DivRule_WayItem [fid='+this+']').addClass('btn-primary');
								});
							}
						}
						for(var j in data.listRule) {
							if(data.listRule[j].type == 2) {
								var type2val = '';
	              var type2value = '';
								for(var k in data.listRule[j].roleIds) {
									for(var key in data.listRule[j].roleIds[k]) {
										type2val = type2val + key + '~';
	                  type2value = type2value + data.listRule[j].roleIds[k][key] + ',';
									}
								}
								$('#AddQuesForm input[name=hasCheckedId]').val(type2val);
								$('#rolename').val(type2value);
								//生效角色ztree初始化
								$.fn.zTree.init($('#treeUserRole'),setting,[]);
								answerHasRole = true;
							}
						}
						//如果答案没有设置来访者角色
						if(!answerHasRole) {
							$.fn.zTree.init($('#treeUserRole'),setting,[]);
						}
					}
				} else {
					//如果答案没有设置渠道和来访者角色
					$.fn.zTree.init($('#treeUserRole'),setting,[]);
				}
				if(data.answer.TimeLiness == 1) {
					if(data.answer.StartTime) {
						$('#AddQuesForm [name=StartTime]').val(data.answer.StartTime.substring(0,16));
					}
					if(data.answer.EndTime) {
						$('#AddQuesForm [name=EndTime]').val(data.answer.EndTime.substring(0,16));
					}
					$('#timePicker').iCheck('check');
					$('#dateTime').show();
					$('#timePicker').on('ifChecked', function() {
						$('#dateTime').show();
					}).on('ifUnchecked', function() {
						$('#dateTime').hide();
						$('#AddQuesForm [name=StartTime]').val('');
						$('#AddQuesForm [name=EndTime]').val('');
					});
				}
				//$('#ansRuleForm input[name=roleIds]').val('');
				//$('#ansRuleForm input[name=roleNames]').val('');
				//生成span
				//如果不是流程，删除流程tab
				if(data.answer.Mode != '6') {
					$('#AnswerNav a[href="#flow"]').parent().remove();
					$('title').html('修改答案');
					$('.breadcrumb').eq(2).html('修改答案');
					$('.page-header').html('修改答案');
					$('ol.breadcrumb').find('li.active').html('修改答案');
				}
				if(data.answer.Mode == '0') {
					$('#AnswerNav a[href="#text"]').tab('show');
					$('#ans_text').val(data.answer.Answer);
				} else if(data.answer.Mode == '1') {
					$('#AnswerNav a[href="#picture"]').tab('show');
					$('#pictureId').val(data.answer.ModeValue);
					if(data.answer.Answer !== undefined) {
						$('#pictureShow').html(data.answer.Answer);
					}
				} else if(data.answer.Mode == '2') {
					$('#AnswerNav a[href="#richtext"]').tab('show');
					richtextUE.addListener('ready', function() {
						richtextUE.setContent(data.answer.Answer);
					});
					richtextUE.setContent(data.answer.Answer);
				} else if(data.answer.Mode == '3') {
					if(data.answer.Material){
						switch(data.answer.Material.Type){
						case 1:  //图片
							$('#AnswerNav a[href="#onlyPicture"]').tab('show');
							$('#OnlyPictureId').val(data.answer.ModeValue);
							$('#OnlyPictureShow').children('img').attr('src','/'+data.answer.Material.Path);
							$('#OnlyPictureId').prev().css('display','block');
							if($('#delOnlyPicture')[0] == undefined) {
								$('#OnlyPictureShow').after('<div style="margin-top:4px;"><div class="btn btn-default" id="delOnlyPicture">删除</div></div>');
							}
							break;
						case 2:  //音频
							$('#AnswerNav a[href="#voice"]').tab('show');
							$('#voiceId').val(data.answer.ModeValue);
							if(data.answer.Material !== undefined) {
								$('#ans_voice button').html(data.answer.Material.Name);
							}
							if($('#ans_voice button').html() === '') {
								$('#ans_voice button').hide();
							} else {
								$('#ans_voice button').show();
							}
							break;
						case 3:  //视频
							$('#AnswerNav a[href="#video"]').tab('show');
							$('#vodeoId').val(data.answer.ModeValue);
							$('#videoShow').children('video').attr('src','/'+data.answer.Material.Path);
							$('#vodeoId').prev().css('display','block');
							if($('#delVideo')[0] == undefined) {
								$('#videoShow').after('<div style="margin-top:4px;"><div class="btn btn-default" id="delVideo">删除</div></div>');
							}
							break;
						}
					}
				} else if(data.answer.Mode == '4') {
					$('#AnswerNav a[href="#other"]').tab('show');
					$('#otherId').val(data.answer.ModeValue);
					if(data.thirdOpen !== undefined) {
						$('#ans_other button').html(data.thirdOpen.Info);
					}
					if($('#ans_other button').html() === '') {
						$('#ans_other button').hide();
					} else {
						$('#ans_other button').show();
					}
				} else if(data.answer.Mode == '6') {
					$('#AnswerNav').html('<li class=""><a href="#flow" data-toggle="tab">流程</a></li>');
					$('#AnswerNav a[href="#flow"]').tab('show');
					$('title').html('修改流程描述');
					$('.breadcrumb').eq(2).html('修改流程描述');
					$('.page-header').html('修改流程描述');
					$('ol.breadcrumb').find('li.active').html('修改流程描述');
					$('#labelAoF').html('流程描述');
					$('#labelEQ').html('流程');
					//是流程就删除其他tab
					$('#AnswerNav a[href="#flow"]').parent().siblings().remove();
					flowUE.addListener('ready', function() {
						flowUE.setContent(data.answer.Answer);
					});
					flowUE.setContent(data.answer.Answer);
				} else if(data.answer.Mode == '7') {
					$('#AnswerNav a[href="#form"]').tab('show');
					$('#formId').val(data.answer.ModeValue);
					if(data.answer.Answer !== undefined) {
						$('#ans_form button').html(data.answer.Answer);
					}
					if($('#ans_form button').html() === '') {
						$('#ans_form button').hide();
					} else {
						$('#ans_form button').show();
					}
				} else if(data.answer.Mode == '8') {
					$('#AnswerNav a[href="#rg"]').tab('show');
					$('#ans_rg').val(data.answer.Answer);
				}else if(data.answer.Mode == '11') {
					$('#AnswerNav a[href="#ask"]').tab('show');
					$('#askId').val(data.answer.ModeValue);
					if(data.thirdOpen !== undefined) {
						$('#ans_ask button').html(data.thirdOpen.Info);
					}
					if($('#ans_ask button').html() === '') {
						$('#ans_ask button').hide();
					} else {
						$('#ans_ask button').show();
					}
				}else if(data.answer.Mode == '10') {
					$('#AnswerNav a[href="#tabArray"]').tab('show');
					$('#tabId').val(data.answer.ModeValue);

					tabArrayThead();

					if(data.dimensionQuery.Name !== undefined) {
						$('#ans_tab button').html(data.dimensionQuery.Name);
					}
					if($('#ans_tab button').html() === '') {
						$('#ans_tab button').hide();
					} else {
						$('#ans_tab button').show();
					}
				}else if(data.answer.Mode == '12') {
					$('#AnswerNav a[href="#order"]').tab('show');
					$('#ans_order').val(data.answer.Answer);
				}
				if(data.answer.ThirdUrl){
					$('#AddQuesForm input[name=thirdUrl]').val(data.answer.ThirdUrl);
				}else{
					$('#AddQuesForm input[name=thirdUrl]').val('http://');
				}
			} else {
				yunNoty(data);
			}
		}
	});
}

var AnswerId = getUrlParam('answerId');
var SolutionId = getUrlParam('solutionId');
var GroupId = getUrlParam('groupId');
var isFlow = getUrlParam('isFlow');
var eQuestion = getUrlParam('question');
$(document).ready(function() {
	App.init();
	$('#question').addWordCount(200);
	$('#ans_text').addWordCount(200);
	getRule();
	$('#formCancel').on('click', function() {
		var ifT = iframeTab.init({iframeBox: ''});
		ifT.closeActIframe('',parent.$('#tabHeader li[data-num="'+getUrlParam('tmpNum')+'"]').attr('data-tab'));
	});
	if(isFlow && isFlow == '1') {
		$('#labelEQ').html('流程');
	}
	$('#eQuestion').val(eQuestion);
	if(AnswerId === null) {
		if(isFlow && isFlow == '1') {
			$('#AnswerNav a[href="#flow"]').tab('show');
			$('#AnswerNav').hide();
			$('#AnswerNav a[href="#flow"]').parent().siblings().remove();
			$('title').html('新增流程描述');
			$('.breadcrumb').eq(2).html('新增流程描述');
			$('.page-header').html('新增流程描述');
			$('ol.breadcrumb').find('li.active').html('新增流程描述');
			$('#labelAoF').html('流程描述');
            $('#formCancel').after('<input type="checkbox" id="isAgain"><span class="m-l-5" id="isAgainSpan">是否连续新增流程描述</span>');
		} else {
			$('#AnswerNav a[href="#flow"]').parent().remove();
			$('title').html('新增答案');
			$('.breadcrumb').eq(2).html('新增答案');
			$('.page-header').html('新增答案');
			$('ol.breadcrumb').find('li.active').html('新增答案');
			$('#formCancel').after('<input type="checkbox" id="isAgain"><span class="m-l-5" id="isAgainSpan">是否连续新增答案</span>');
			// taskid= 顾荣 如果为新增答案thirdUrl则输入'http://'
			$('#AddQuesForm input[name=thirdUrl]').val('http://');
		}
		$('#isAgain').iCheck({
			checkboxClass: 'icheckbox_flat-blue',
			radioClass: 'iradio_flat-blue',
			cursor: true
		});
		//生效角色ztree初始化
		$.fn.zTree.init($('#treeUserRole'),setting,[]);
	}

	//答案tab切换
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		if($(e.target).attr('href') == '#flow') {
			//隐藏并关闭智能推荐
			$('#queGroup').hide();
			$('a[href="#queOff"]').tab('show');
		} // newly activated tab
		if($(e.relatedTarget).attr('href') == '#flow') {
			$('#queGroup').show();
		} // previous active tab
	});

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
	$('.form_datetime').datetimepicker({
		language: 'zh-CN',
		format: 'yyyy-mm-dd hh:ii',
		autoclose: true,
		todayBtn: true,
		minuteStep: 10,
		startDate: new Date(),
		initialDate: new Date(),
		zIndex: 2000
	});
	$('#timePicker').on('ifChecked', function() {
		$('#dateTime').show();
	}).on('ifUnchecked', function() {
		$('#dateTime').hide();
		$('#AddQuesForm [name=StartTime]').val('');
		$('#AddQuesForm [name=EndTime]').val('');
	});
	//生效角色ztree滚动条
	$('.treeDiv').slimScroll({
		height: '200px'
	});
	//生效角色单击展开所有按钮
	$('.expandURA').click(function(){
		showTree('treeUserRole',true);
	});
	//生效角色单击折叠所有按钮
	$('.expandURN').click(function(){
		showTree('treeUserRole',false);
	});

	$('#question').on('blur', function() {
		if($(this).val().length < 2) {
			yunNotyError('问题长度需在2-200个字符之间！');
			$(this).val('');
		}
	});
	// $('#ans_text').on('blur', function() {
	// 	if($(this).val().length < 2) {
	// 		yunNotyError("答案长度需在2-200个字符之间！");
	// 		$(this).val('');
	// 	}
	// });
	$('#formSubmit').unbind('click').bind('click',function() {
		Edit();
	});

	setInterval(function() {
		var addFlag = true;
		//消息类型 0文本 1图文 2富文本 3声音 4第三方 6流程 7报表
		var mode = -1;
		//图文或语音或第三方ID
		var modeValue = '';
		//答案内容
		var answer = '';
		if($('#text').hasClass('active')) {
			mode = 0;
			answer = $('#ans_text').val();
			if(answer === '' || answer.length < 2 || answer.length > 200) {
				addFlag = false;
			}
		} else if($('#richtext').hasClass('active')) {
			mode = 2;
			answer = UE.getEditor('ans_richtext').getContent();
			if(answer === '' || answer.length < 2 || answer.length > 20000) {
				addFlag = false;
			}
		} else if($('#voice').hasClass('active')) {
			mode = 3;
			modeValue = $('#voiceId').val();
			if(modeValue === '') {
				addFlag = false;
			}
		} else if($('#picture').hasClass('active')) {
			mode = 1;
			modeValue = $('#pictureId').val();
			if(modeValue === '') {
				addFlag = false;
			}
		} else if($('#other').hasClass('active')) {
			mode = 4;
			modeValue = $('#otherId').val();
			if(modeValue === '') {
				addFlag = false;
			}
		} else if($('#flow').hasClass('active')) {
			mode = 6;
			answer = UE.getEditor('ans_flow').getContent();
			if(answer === '' || answer.length < 2 || answer.length > 20000) {
				addFlag = false;
			}
		} else if($('#form').hasClass('active')) {
			mode = 7;
			modeValue = $('#formId').val();
			if(modeValue === '') {
				addFlag = false;
			}
		} else if($('#rg').hasClass('active')) {
			mode = 8;
			answer = $('#ans_rg').val();
			if(answer === '') {
				addFlag = false;
			}
		}else if($('#ask').hasClass('active')) {
			mode = 11;
			modeValue = $('#askId').val();
			if(modeValue === '') {
				addFlag = false;
			}
		}else if($('#tabArray').hasClass('active')) {
			mode = 10;
			modeValue = $('#tabId').val();
			if(modeValue === '') {
				addFlag = false;
			}
		}
		if(addFlag === true) {
			$('#formSubmit').unbind('click').bind('click', Edit);
			$('#formSubmit').removeAttr('disabled');
		} else {
			$('#formSubmit').unbind('click');
			$('#formSubmit').css('pointer-events', 'all').attr('disabled', true);
		}
	},500);
});

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
                    for (var i in List) {
                        if (List[i].ConfigItemDesc == '生效渠道') {
                            if (List[i].IsDisplay === 1) {
                                $('#DivRule_Way').remove();
                            } else if (List[i].IsDisplay === 0) {
                                $.ajax({
                                    type: 'post',
                                    datatype: 'json',
                                    cache: false,
                                    //不从缓存中去数据
                                    url: encodeURI('../../Configuration/listValue'),
                                    data: {
                                        itemId: List[i].Id
                                    },
                                    success: function (data) {
                                        if (data.status === 0) {
                                            if (data.listValue) {
                                                $('#DivRule_WayItem').empty();
                                                $('#DivRule_WayItem').append('<input id="wayAll" type="checkbox"><label for="wayAll" style="margin: 5px;">全选</label>');
                                                $('#wayAll').iCheck({
                                                    checkboxClass: 'icheckbox_flat-blue',
                                                    radioClass: 'iradio_flat-blue',
                                                    cursor: true
                                                });
                                                for (var key in data.listValue) {
                                                    $('#DivRule_WayItem').append('<a class="btn btn-white m-r-5 m-b-5" fid="' + data.listValue[key].DicCode + '">' + data.listValue[key].DicDesc + '</a>');
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        } else if (List[i].ConfigItemDesc == '生效角色') {
                            if (List[i].IsDisplay === 1) {
                                $('#DivRule_Role').remove();
                            }
                        } else if (List[i].ConfigItemDesc == '生效时间') {
                            if (List[i].IsDisplay === 1) {
                                $('#DivRule_Time').remove();
                                $('#dateTime').remove();
                            }
                        } else if (List[i].ConfigItemDesc == '答案模式') {
                            var dicList = List[i].DicList;
                            var html = '';
                            var dicType = '';
                            for (var j = 0; j < dicList.length; j++) {
                                if(dicList[j].DicType == 'answer_type'){
                                    switch(dicList[j].DicCode){
                                        case 0:
                                            dicType = 'text';
                                            break;
                                        case 1:
                                            dicType = 'richtext';
                                            break;
                                        case 2:
                                            dicType = 'picture';
                                            break;
                                        case 3:
                                            dicType = 'other';
                                            break;
                                        case 4:
                                            dicType = 'onlyPicture';
                                            break;
                                        case 5:
                                            dicType = 'video';
                                            break;
                                        case 6:
                                            dicType = 'voice';
                                            break;
                                        case 7:
                                            dicType = 'form';
                                            break;
                                        case 8:
                                            dicType = 'rg';
                                            break;
                                        case 9:
                                            dicType = 'ask';
                                            break;
                                        case 10:
                                            dicType = 'tabArray';
                                            break;
                                        case 12:
                                            dicType = 'order';
                                            break;
                                    }
                                }
                                if (dicList[j].DicDesc == '场景式问答') {
                                    html += '<li id="moreform"><a href="#' + dicType + '" data-toggle="tab">' + dicList[j].DicDesc + '</a></li>';
                                } else {
                                    html += '<li><a href="#' + dicType + '" data-toggle="tab">' + dicList[j].DicDesc + '</a></li>';
                                }
                            }
                            $('#AnswerNav').html(html);
                            $('#AnswerNav').children('li:first-child').addClass('active');
                            var hrefStr = $('#AnswerNav').find('.active').children('a').attr('href');
                            $(hrefStr).addClass('active in');
                        }
                    }
                }
				if(AnswerId !== null) {
				    findAnswerDetail(AnswerId);
				}
			}
		}
	});
}
