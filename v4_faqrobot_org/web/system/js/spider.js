var jsonList = null;
$(document).ready(function() {
	App.init();
	icheckBindInit();
	$(".form_datetime").datetimepicker({
		language: "zh-CN",
		format: "yyyy-mm-dd hh:ii",
		autoclose: true,
		todayBtn: true,
		minuteStep: 10,
		initialDate:new Date()
	});
	//生成列表
	spiderList(1);

	//添加爬虫模态窗表单验证
	$('#spiderAdd').validate({
		rules:{
			siteName:{
				required:true
			},
			siteUrl:{
				required:true
			}
		},
		messages:{
			siteName:{
				required:'请输入站点名！',
			},
			siteUrl:{
				required:'请输入站点地址！'
			}
		},
		submitHandler: add
	});

	//修改爬虫模态窗表单验证
	$('#spiderEdit').validate({
		rules:{
			siteName:{
				required:true
			},
			siteUrl:{
				required:true
			}
		},
		messages:{
			siteName:{
				required:'请输入站点名！',
			},
			siteUrl:{
				required:'请输入站点地址！'
			}
		},
		submitHandler: edit
	});
	$('#spiderRule').validate({
		submitHandler: rule
	});

	//添加和修改表单重置
	$('#addModal').on('hidden.bs.modal', function () {
		$('#spiderAdd')[0].reset();
	})
	$('#editModal').on('hidden.bs.modal', function () {
		$('#spiderEdit')[0].reset();
	})
	$('#spiderModal').on('hidden.bs.modal', function () {
		$('#spiderRule')[0].reset();
	})
});

//生成列表
function spiderList(pageNo){
	if(!pageNo)pageNo=1;
  $('#spiderList').tableAjaxLoader2(7);
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../spiderWeb/findSpiderWeb?pageSize='+10+'&pageNo='+pageNo),
		success:
		function(data){
			if(data.status===0){
				if(data.list===undefined){
					$('#spiderList').find('tbody').html('<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>当前纪录为空！</td></tr>');
					$('#pageList').html('');
					return;
				}
				if(data.list.length>0){
					jsonList = data.list;
					var html = '';
					for(var i=0;i<data.list.length;i++){
						html += '<tr>';
						html += '<td><input type="checkbox" name="ckb" class="select_row" value="' + data.list[i].Id + '" /></td>';
						html += '<td>'+(data.list[i].SiteName===null?'':data.list[i].SiteName)+'</td>';
						if(data.list[i].Channel == '0'){
							html += '<td>网页</td>';
						} else if(data.list[i].Channel == '1'){
							html += '<td>H5</td>';
						} else {
							html += '<td></td>';
						}
						html += '<td>'+(data.list[i].TimeStart===null?'':data.list[i].TimeStart)+'</td>';
						html += '<td>'+(data.list[i].TimeEnd===null?'':data.list[i].TimeEnd)+'</td>';
						html += '<td>'+(data.list[i].Des===null?'':data.list[i].Des)+'</td>';
						if(data.list[i].IsEffective === 0){
							html += '<td>已启用</td>';
						} else {
							html += '<td style="color:#F00;">已禁用</td>';
						}
            html += '<td><a title="开始爬取" onclick="scrapy('+data.list[i].Id+')" style="cursor:pointer;"><i class="glyphicon glyphicon-play"></i></a>&nbsp;';
						html += '<a title="设置规则" onclick="spider_rule_modal('+data.list[i].Id+')" style="cursor:pointer;"><i class="glyphicon glyphicon-cog"></i></a>&nbsp;';
						html += '<a value="'+data.list[i].Id+'" title="编辑" onclick="spider_edit_modal(this)" style="cursor:pointer;"><i class="glyphicon glyphicon-pencil"></i></a>&nbsp;';
						if(data.list[i].IsEffective === 0){
							html += '<a class="timeTip m-close" data-placement="top" data-toggle="tooltip" data-original-title="点击禁用" href="javascript:void(0);" rel="'+data.list[i].Id+'"><i class="glyphicon glyphicon-ban-circle"></i></a>';
						} else {
							html += '<a class="timeTip m-open" data-placement="top" data-toggle="tooltip" data-original-title="点击启用" href="javascript:void(0);" rel="'+data.list[i].Id+'"><i class="glyphicon glyphicon-ok-circle"></i></a>';
						}
            html += '&nbsp;<a class="timeTip" href="/web/system/spiderDetail.html?id='+data.list[i].Id+'" data-num="0" data-name="爬取详情" data-placement="top" data-toggle="tooltip" data-original-title="爬取详情" title="爬取详情" ><i class="glyphicon glyphicon-list-alt"></i></a>';
            html += '&nbsp;<a class="timeTip" href="javascript:;" onclick="scrapy2('+data.list[i].Id+')" data-placement="top" data-toggle="tooltip" data-original-title="清空爬取数据" title="清空爬取数据" ><i class="glyphicon glyphicon-remove-sign"></i></a>';
						html += '&nbsp;<a href="#" class="m-del" rel="'+data.list[i].Id+'" title="删除" ><i class="glyphicon glyphicon-trash"></i></a>';
						html += '</td>';
						html += '</tr>';
					}
					$('#spiderList').find('tbody').html(html);
					//删除
					$('.m-del').on('click',function(){
						delById(this,'../../spiderWeb/deleteSpiderWeb',spiderList,'pageList');
					});
					//禁用
					$('.m-close').on('click',function(){
						complexEdit('../../spiderWeb/updateEffective',this,spiderList,'pageList',1);
					});
					//启用
					$('.m-open').on('click',function(){
						complexEdit('../../spiderWeb/updateEffective',this,spiderList,'pageList',0);
					});
					$('.timeTip').tooltip();
					icheckListInit();
					//下面开始处理分页
					var options = {
						data: [data, 'list', 'total'],
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function (event, originalEvent, type, page) {
							spiderList(page);
						}
					};
					setPage('pageList',options);
				}else{
					$('#spiderList').find('tbody').html('<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>当前纪录为空！</td></tr>');
					$('#pageList').html('');
				}
			}else{
				yunNoty(data);
			}
		}
	});
}

//添加表单提交
var flag_spider_add=false;
function add(){
	if(flag_spider_add){
		return;
	}
	flag_spider_add=true;
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../spiderWeb/insertSpiderWeb'),
		data:$("#spiderAdd").serialize(),
		success:
		function(data){
			flag_spider_add=false;
			if(data.status===0){
				yunNoty(data);
				$('#addModal').modal('hide');
				listCurrentPage(spiderList,'pageList');
			} else {
				yunNoty(data);
			}
		}
	});
}

function scrapy(id) {
  $('#scrapyRule input[name=spiderWebId]').val(id);
  $("#scrapyModal").modal('show');
}
function scrapy2(id) {
  $('#scrapy2Rule input[name=spiderWebId]').val(id);
  $("#scrapy2Modal").modal('show');
}
function startScrapy() {
  $.ajax({
    type: 'get',
    datatype: 'json',
    cache: false,
    url: encodeURI('../../Spider/begin?spiderWebId='+$('#scrapyRule input[name=spiderWebId]').val()),
    success: function(data) {
      yunNoty(data);
      if(data.status === 0) {
        $('#scrapyModal').modal('hide');
      }
    }
  });
}
function endScrapy() {
  $.ajax({
    type: 'get',
    datatype: 'json',
    cache: false,
    url: encodeURI('../../SpiderData/delAllDataByWebId?spiderWebId='+$('#scrapy2Rule input[name=spiderWebId]').val()),
    success: function(data) {
      yunAlert(data);
      if(data.status === 0) {
        $('#scrapy2Modal').modal('hide');
      }
    }
  });
}

//列表的操作列的修改表单按钮
function spider_edit_modal(obj) {
	var index = $(obj).parents('tr').index();
	$('#spiderEdit input[name=id]').val(jsonList[index].Id);
	$('#spiderEdit input[name=siteName]').val(jsonList[index].SiteName);
	$('#spiderEdit input[name=siteUrl]').val(jsonList[index].SiteUrl);
	$('#spiderEdit select[name=channel]').val(jsonList[index].Channel);
	$('#spiderEdit input[name=timeStart]').val(jsonList[index].TimeStart);
	$('#spiderEdit input[name=timeEnd]').val(jsonList[index].TimeEnd);
	$('#spiderEdit input[name=des]').val(jsonList[index].Des);
	$("#editModal").modal('show');
}

//修改表单提交
var flag_spider_edit=false;
function edit(){
	if(flag_spider_edit){
		return;
	}
	flag_spider_edit=true;
	$.ajax({
	type:'post',
	datatype:'json',
	cache:false,
	url:encodeURI('../../spiderWeb/updateSpiderWeb'),
	data:$('#spiderEdit').serialize(),
	success:
	function(data){
		flag_spider_edit=false;
		if(data.status===0){
 			yunNoty(data);
			$('#editModal').modal('hide');
			listCurrentPage(spiderList,'pageList');
		}else{
			yunNoty(data);
		}
	}
	});
}


		function spider_rule_modal(id) {
			$.ajax({
				type: 'get',
				datatype: 'json',
				cache: false,
				//不从缓存中去数据
				url: encodeURI('../../SpiderRule/findRuleByWebId?pageSize=10&pageNo=1&spiderWebId='+id),
				success: function(data) {
					if(data.status === 0) {
						if(data.list) {
							if(data.list[0]) {
			$('#spiderRule input[name=pageRegex]').val((data.list[0].PageRegex?data.list[0].PageRegex:''));
			$('#spiderRule input[name=contentRegex]').val((data.list[0].ContentRegex?data.list[0].ContentRegex:''));
			$('#spiderRule input[name=firstRule]').val((data.list[0].FirstClassesRule?data.list[0].FirstClassesRule:''));
			$('#spiderRule input[name=secondRule]').val((data.list[0].SecondClassesRule?data.list[0].SecondClassesRule:''));
			$('#spiderRule input[name=titleRule]').val((data.list[0].TitleRule?data.list[0].TitleRule:''));
			$('#spiderRule input[name=summaryRule]').val((data.list[0].SummaryRule?data.list[0].SummaryRule:''));
			$('#spiderRule input[name=contentRule]').val((data.list[0].ContentRule?data.list[0].ContentRule:''));
			$('#spiderRule input[name=timeRule]').val((data.list[0].PublishTimeRule?data.list[0].PublishTimeRule:''));
			$('#spiderRule input[name=tagRule]').val((data.list[0].TagRule?data.list[0].TagRule:''));
			$('#spiderRule input[name=fNameRule]').val((data.list[0].FileNameRule?data.list[0].FileNameRule:''));
			$('#spiderRule input[name=fPathRule]').val((data.list[0].FilePathRule?data.list[0].FilePathRule:''));
			$('#spiderRule input[name=authorRule]').val((data.list[0].AuthorRule?data.list[0].AuthorRule:''));
							}
						}
					}
			$('#spiderRule input[name=spiderWebId]').val(id);
			$("#spiderModal").modal('show');
				}
			});
		}

		function delRule() {
			$.ajax({
				type: 'get',
				datatype: 'json',
				cache: false,
				//不从缓存中去数据
				url: encodeURI('../../SpiderRule/delRuleByWebId?spiderWebId='+$('#spiderRule input[name=spiderWebId]').val()),
				success: function(data) {
					if(data.status === 0) {
						yunNoty(data);
						$('#spiderRule')[0].reset();
					} else {
						yunNoty(data);
					}
				}
			});
		}
		var flag_ww_rule=false;
		function rule(){
			if(flag_ww_rule){
				return;
			}
			flag_ww_rule=true;
			$.ajax({
				type:'post',
				datatype:'json',
				cache:false,//不从缓存中去数据
				url:encodeURI('../../SpiderRule/addRuleByWebId'),
				data:$("#spiderRule").serialize(),
				success:
				function(data){
					flag_ww_rule=false;
					if(data.status===0){
						yunNoty(data);
						$('#spiderModal').modal('hide');
					}else{
						yunNoty(data);
					}
				}
			});
		}
function complexEdit(url, obj, fun, pageId, status, ids) {
	var curObj = $(obj).attr('rel');
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI(url),
		data: 'id=' + curObj + '&isEffective=' + status,
		success: function(data) {
			if (data.status === 0) {
				if (typeof fun == "function") {
					var page = $('#' + pageId + ' .active a').html();
					var oT = $('input[name=orderType]').val();
					if (!oT) {
						fun(page);
					} else {
						fun(page, oT);
					}
				}
				yunNoty(data);
			} else {
				yunNoty(data);
			}
		}
	});
}
