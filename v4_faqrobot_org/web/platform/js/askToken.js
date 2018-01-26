
/***********************AskTokenList START***********************/
//列出表格
var listaskTokenPageData = null;
function listAskTokenPage(pageNo){
	//不勾选全选
	$('.select_rows').iCheck('uncheck');
	if(!pageNo)pageNo=1;
	$('#AskTokenList').tableAjaxLoader2(7);
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../thirdOpen/listThirdOpen?type='+1+'&pageSize='+10+'&pageNo='+pageNo),
		//data:encodeURI(tempcontent),
		success:
		function(data){
			if(data.status===0){
				if(data.list===undefined){
					$('.select_rows').iCheck('uncheck');
					$('#AskTokenList').find('tbody').html('<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
					$('#askPageList').html('');
					return;
				}
				if(data.list.length>0){
					var html = [];
					listaskTokenPageData = data.list;
					for(var i=0;i<data.list.length;i++){
						html.push( '<tr id="list-tr-'+data.list[i].Id+'">');
						html.push( '<td><input type="checkbox" name="ckb" class="select_row" value="'+data.list[i].Id+'" /></td>');
						if(data.list[i].Info===null){
							html.push( '<td title=""></td>');
						}else{
							html.push( '<td title="'+data.list[i].Info+'">'+data.list[i].Info+'</td>');
						}
						html.push('<td>'+data.list[i].ClassName+'</td>');
						/*html.push( '<td>');
						html.push(data.list[i].Status==0?'停用':'启用');
						html.push('</td>');*/
						/*html.push('<td>');
						html.push(data.list[i].Auth==0?'不需要':'需要');
						html.push('</td>');
						html.push('<td>'+getSourceName(data.list[i].SourceId)+'</td>');*/
						html.push('<td>');
						html.push(data.list[i].Time==0?'':data.list[i].Time);
						html.push('</td>');
						html.push('<td><a href="javascript:;" class="sepV_a" rel="'+data.list[i].Id+'"  title="编辑" style="cursor:pointer" onclick="editAskTokenModal(this)" ><i class="glyphicon glyphicon-pencil"></i></a>&nbsp;&nbsp; <a href="javascript:;" class="m-del" title="删除" rel="'+data.list[i].Id+'" style="cursor:pointer;" ><i class="glyphicon glyphicon-trash" ></i></a></td>');
						html.push('</tr>');
					}
					$('#AskTokenList').find('tbody').html(html.join(''));
					//单个删除
					$('.m-del').on('click',function(){
						var self = this;
						$(self).adcCreator(function() {
							delById(self,'../../thirdOpen/deleteThirdOpenById?type=1',listAskTokenPage,'askPageList');
						});
					});
					icheckListInit();
					//下面开始处理分页
					var options = {
						data: [data, 'list', 'total'],
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function (event, originalEvent, type, page) {
							listAskTokenPage(page);
						}
					};
					setPage('askPageList',options);
				}else{
					$('.select_rows').iCheck('uncheck');
					$('#AskTokenList').find('tbody').html('<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
					$('#askPageList').html('');
				}
			}else{
				yunNoty(data);
			}
		}
	});
}

//添加AskToken接口表单提交
var flag_port_add=false;
function addAsk(){
	if(flag_port_add){
		return;
	}
	flag_port_add=true;
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../thirdOpen/editThirdOpenInfo?type=1'),
		data:$("#AskToken_form").serialize(),
		success:
		function(data){
			flag_port_add=false;
			if(data.status===0){
				yunNoty(data);
				$('#addModal').modal('hide');
				listCurrentPage(listAskTokenPage,'askPageList');
			}else{
				yunNoty(data);
			}
		}
	});
}

//修改AskToken接口表单提交
function saveAskSub(){
	saveModal('../../thirdOpen/editThirdOpenInfo?type=1','save_form','myModal',listAskTokenPage,'askPageList');
}

//填充模态窗
function editAskTokenModal(obj){
	var index = $(obj).parents('tr').index();
	$('#save_form input[name=url]').val(listaskTokenPageData[index].Url);
	$('#save_form textarea[name=info]').val(listaskTokenPageData[index].Info);
	$('#save_form input[name=className]').val(listaskTokenPageData[index].ClassName);
	$('#save_form input[name=methodName]').val(listaskTokenPageData[index].MethodName);
	$('#save_form textarea[name=errorWords]').val(listaskTokenPageData[index].ErrorWords);
	$('#save_form textarea[name=authWords]').val(listaskTokenPageData[index].AuthWords);
	$('#save_form input[name=requestRegex]').val(listaskTokenPageData[index].RequestRegex);
	$('#save_form input[name=maxerrtoler]').val(listaskTokenPageData[index].Maxerrtoler);
	/*var askIf = listaskTokenPageData[index].Status;
	if(askIf=='1'){
		$('#save_form input[name=status]:eq(0)').iCheck('check');
	}else{
		$('#save_form input[name=status]:eq(1)').iCheck('check');
	}
	
	$('#save_form select[name=sourceId]').val(listaskTokenPageData[index].SourceId);*/
	$('#hideid').val(listaskTokenPageData[index].Id);
	$('#myModal').modal('show');
}
/***********************AskTokenList END***********************/