//platform模块js

/***********************authList START***********************/
//列出表格
var listthirdAuthPageData = null;
function listthirdAuthPage(pageNo){
	//不勾选全选
	$('.select_rows').iCheck('uncheck');
	if(!pageNo)pageNo=1;
	$('#ThirdAuthList').tableAjaxLoader2(6);
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../thirdAuth/listThirdAuth?pageSize='+10+'&pageNo='+pageNo),
		//data:encodeURI(tempcontent),
		success:
		function(data){
			if(data.status===0){
				if(data.list===undefined){
					$('.select_rows').iCheck('uncheck');
					$('#ThirdAuthList').find('tbody').html('<tr><td colspan="6" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
					$('#pageList').html('');
					return;
				}
				if(data.list.length>0){
					listthirdAuthPageData = data.list;
					var html = [];
					for(var i=0;i<data.list.length;i++){
						html.push('<tr id="list-tr-'+data.list[i].Id+'">');
						html.push('<td><input type="checkbox" name="ckb" class="select_row" value="'+data.list[i].Id+'" /></td>');
						if(data.list[i].Info===null){
							html.push( '<td title=""></td>');
						}else{
							html.push( '<td title="'+data.list[i].Info+'">'+limitstr(data.list[i].Info,10)+'</td>');
						}
						html.push( '<td>');
						html.push(data.list[i].Status==0?'关闭':'开启');
						html.push('</td>');
						html.push( '<td>'+getSourceName(data.list[i].SourceId)+'</td>');
						html.push( '<td>');
						html.push(data.list[i].Time===null?'':data.list[i].Time);
						html.push('</td>');
						html.push('<td><a href="javascript:;" class="sepV_a" title="编辑" rel="'+data.list[i].Id+'" style="cursor:pointer" onclick="editthirdAuthModal(this)"><i class="glyphicon glyphicon-pencil"></i></a>&nbsp;&nbsp;<a href="javascript:;" class="m-del" rel="'+data.list[i].Id+'" title="删除" style="cursor:pointer" ><i class="glyphicon glyphicon-trash" ></i></a></td>');
						html.push('</tr>');
					}
					$('#ThirdAuthList').find('tbody').html(html.join(''));
					//单个删除
					$('.m-del').on('click',function(){
						var self = this;
						$(self).adcCreator(function() {
							delById(self,'../../thirdAuth/deleteThirdAuthById',listthirdAuthPage,'pageList');
						});
					});
					icheckListInit();
					//下面开始处理分页
					var options = {
						data: [data, 'list', 'total'],
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function (event, originalEvent, type, page) {
							listthirdAuthPage(page);
						}
					};
				setPage('pageList',options);
				}else{
					$('.select_rows').iCheck('uncheck');
					$('#ThirdAuthList').find('tbody').html('<tr><td colspan="6" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
					$('#pageList').html('');
				}
			}else{
				yunNoty(data);
			}
		}
	});
}

//添加第三方认证表单提交
var flag_auth_add=false;
function addAuth(){
	if(flag_auth_add){
		return;
	}
	flag_auth_add=true;
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../thirdAuth/editThirdAuthInfo'),
		data:$("#ThirdAuth_form").serialize(),
		success:
		function(data){
			flag_auth_add=false;
			if(data.status===0){
				yunNoty(data);
				$('#addModal').modal('hide');
				listCurrentPage(listthirdAuthPage,'pageList');
			}else{
				yunNoty(data);
			}
		}
	});
}

//修改第三方认证表单提交
function savethirthSub(){
	saveModal('../../thirdAuth/editThirdAuthInfo','save_form','myModal',listthirdAuthPage,'pageList');
}

//填充模态窗
function editthirdAuthModal(obj){
	var index = $(obj).parents('tr').index();
	$('#save_form input[name=authUrl]').val(listthirdAuthPageData[index].AuthUrl);
	$('#save_form input[name=loginUrl]').val(listthirdAuthPageData[index].LoginUrl);
	$('#save_form input[name=authClassName]').val(listthirdAuthPageData[index].AuthClassName);
	$('#save_form input[name=authMethodName]').val(listthirdAuthPageData[index].AuthMethodName);
	$('#save_form textarea[name=info]').val(listthirdAuthPageData[index].Info);
	$('#save_form textarea[name=authWords]').val(listthirdAuthPageData[index].AuthWords);
	$('#hideid').val(listthirdAuthPageData[index].Id);
	var openOr = listthirdAuthPageData[index].Status;
	if(openOr=='1'){
		$('#save_form input[name=status]:eq(1)').iCheck('check');
	}else{
		$('#save_form input[name=status]:eq(0)').iCheck('check');
	}
	var trueOr  = listthirdAuthPageData[index].Level;
	if(trueOr=='1'){
		$('#save_form input[name=level]:eq(1)').iCheck('check');
	}else{
		$('#save_form input[name=level]:eq(0)').iCheck('check');
	}
	$('#save_form select[name=sourceId]').val(listthirdAuthPageData[index].SourceId);
	$('#myModal').modal('show');
}
/***********************authList END***********************/

/***********************portList START***********************/
//列出表格
var listthirdOpenPageData = null;
function listthirdOpenPage(pageNo){
	//不勾选全选
	$('.select_rows').iCheck('uncheck');
	if(!pageNo)pageNo=1;
	$('#ThirdOpenList').tableAjaxLoader2(7);
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../thirdOpen/listThirdOpen?type='+0+'&pageSize='+10+'&pageNo='+pageNo),
		//data:encodeURI(tempcontent),
		success:
		function(data){
			if(data.status===0){
				if(data.list===undefined){
					$('.select_rows').iCheck('uncheck');
					$('#ThirdOpenList').find('tbody').html('<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
					$('#pageList').html('');
					return;
				}
				if(data.list.length>0){
					var html = [];
					listthirdOpenPageData = data.list;
					for(var i=0;i<data.list.length;i++){
						html.push( '<tr id="list-tr-'+data.list[i].Id+'">');
						html.push( '<td><input type="checkbox" name="ckb" class="select_row" value="'+data.list[i].Id+'" /></td>');
						if(data.list[i].Info===null){
							html.push( '<td title=""></td>');
						}else{
							html.push( '<td title="'+data.list[i].Info+'">'+data.list[i].Info+'</td>');
						}
						html.push( '<td>');
						html.push(data.list[i].Status==0?'停用':'启用');
						html.push('</td>');
						html.push('<td>');
						html.push(data.list[i].Auth==0?'不需要':'需要');
						html.push('</td>');
						html.push('<td>'+getSourceName(data.list[i].SourceId)+'</td>');
						html.push('<td>');
						html.push(data.list[i].Time==0?'':data.list[i].Time);
						html.push('</td>');
						html.push('<td><a href="javascript:;" class="sepV_a" rel="'+data.list[i].Id+'"  title="编辑" style="cursor:pointer" onclick="editthirdOpenModal(this)" ><i class="glyphicon glyphicon-pencil"></i></a>&nbsp;&nbsp; <a href="javascript:;" class="m-del" title="删除" rel="'+data.list[i].Id+'" style="cursor:pointer;" ><i class="glyphicon glyphicon-trash" ></i></a></td>');
						html.push('</tr>');
					}
					$('#ThirdOpenList').find('tbody').html(html.join(''));
					//单个删除
					$('.m-del').on('click',function(){
						var self = this;
						$(self).adcCreator(function() {
							delById(self,'../../thirdOpen/deleteThirdOpenById?type=0',listthirdOpenPage,'pageList');
						});
					});
					icheckListInit();
					//下面开始处理分页
					var options = {
						data: [data, 'list', 'total'],
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function (event, originalEvent, type, page) {
							listthirdOpenPage(page);
						}
					};
					setPage('pageList',options);
				}else{
					$('.select_rows').iCheck('uncheck');
					$('#ThirdOpenList').find('tbody').html('<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
					$('#pageList').html('');
				}
			}else{
				yunNoty(data);
			}
		}
	});
}

//添加第三方接口表单提交
var flag_port_add=false;
function addOpen(){
	if(flag_port_add){
		return;
	}
	flag_port_add=true;
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../thirdOpen/editThirdOpenInfo?type=0'),
		data:$("#ThirdOpen_form").serialize(),
		success:
		function(data){
			flag_port_add=false;
			if(data.status===0){
				yunNoty(data);
				$('#addModal').modal('hide');
				listCurrentPage(listthirdOpenPage,'pageList');
			}else{
				yunNoty(data);
			}
		}
	});
}

//修改第三方接口表单提交
function saveOpenSub(){
	saveModal('../../thirdOpen/editThirdOpenInfo?type=0','save_form','myModal',listthirdOpenPage,'pageList');
}

//填充模态窗
function editthirdOpenModal(obj){
	var index = $(obj).parents('tr').index();
	$('#save_form input[name=url]').val(listthirdOpenPageData[index].Url);
	$('#save_form textarea[name=info]').val(listthirdOpenPageData[index].Info);
	$('#save_form input[name=className]').val(listthirdOpenPageData[index].ClassName);
	$('#save_form input[name=methodName]').val(listthirdOpenPageData[index].MethodName);
	$('#save_form textarea[name=errorWords]').val(listthirdOpenPageData[index].ErrorWords);
	$('#save_form textarea[name=authWords]').val(listthirdOpenPageData[index].AuthWords);
	$('#save_form input[name=requestRegex]').val(listthirdOpenPageData[index].RequestRegex);
	var openIf = listthirdOpenPageData[index].Status;
	if(openIf=='1'){
		$('#save_form input[name=status]:eq(0)').iCheck('check');
	}else{
		$('#save_form input[name=status]:eq(1)').iCheck('check');
	}
	var authIf = listthirdOpenPageData[index].Auth;
	if(authIf=='1'){
		$('#save_form input[name=auth]:eq(0)').iCheck('check');
	}else{
		$('#save_form input[name=auth]:eq(1)').iCheck('check');
	}
	$('#save_form select[name=sourceId]').val(listthirdOpenPageData[index].SourceId);
	$('#hideid').val(listthirdOpenPageData[index].Id);
	$('#myModal').modal('show');
}
/***********************portList END***********************/

/***********************wechatList START***********************/
//列出表格
var listWeixinPageData = null;
function listWeixinPage(pageNo){
	//不勾选全选
	$('.select_rows').iCheck('uncheck');
	if(!pageNo)pageNo=1;
	$('#wxList').tableAjaxLoader2(6);
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../wxConfig/listWxConfig?pageSize='+10+'&pageNo='+pageNo),
		//data:encodeURI(tempcontent),
		success:
		function(data){
			if(data.status===0){
				if(data.list===undefined){
					$('#wxList').find('tbody').html('<tr><td colspan="6" style="text-align:center;"><i class="icon-exclamation-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
					$('#pageList').html('');
					return;
				}
				if(data.list.length>0 ){
					listWeixinPageData = data.list;
					var html = '';
					for(var i=0;i<data.list.length;i++){
						html += '<tr id="list-tr-"+data.list[i].Id+"">';
						html += '<td><input type="checkbox" name="ckb" class="select_row" value="'+data.list[i].Id+'" /></td>';
						var name=data.list[i].Name===null?'未知公众号名称':data.list[i].Name;
						html += '<td>'+name+'</td>';
						var ThemeName = data.list[i].ThemeName == null?'':data.list[i].ThemeName;
						html += '<td>'+ThemeName+'</td>';
						if(data.list[i].Type==0){
							html += '<td>订阅号</td>';
						}else if(data.list[i].Type==1){
							html += '<td>服务号</td>';
						}else if(data.list[i].Type==2){
							html += '<td>企业号</td>';
						}else{
							html += '<td>&nbsp;</td>';
						}
						if(data.list[i].Mode==0){
							html +='<td>停止使用</td>';
						}else if(data.list[i].Mode==1){
							html +='<td>试用</td>';
						}else if(data.list[i].Mode==2){
							html +='<td>正常使用</td>';
						}else{
							html +='<td></td>';
						}
						html += '<td><a href="#" title="获取对接信息" style="cursor:pointer" onclick="obtainURL(this,'+data.list[i].Id+')">获取对接信息</a></td>';
						var canNotEdit = 0;
						if(data.list[i].AddStyle) {
							if(data.list[i].AddStyle == 1) {
								canNotEdit = 1;
							}
						}
						html += '<td><a href="#" class="sepV_a" title="编辑" style="cursor:pointer" onclick="editweixinModal(this)"><i class="glyphicon glyphicon-pencil"></i></a>&nbsp;&nbsp;<a class="m-del" rel="'+data.list[i].Id+'" style="cursor:pointer;" title="删除"><i class="glyphicon glyphicon-trash"></i></a></td>';
						html += '</tr>';
					}
					$('#wxList').find('tbody').html(html);
					//单个删除
					$('.m-del').on('click',function(){
						var self = this;
						$(self).adcCreator(function() {
							delById(self,'../../wxConfig/deleteWxConfigById',listWeixinPage,'pageList');
						});
					});
					icheckListInit();
					//下面开始处理分页
					var options = {
						data: [data, 'list', 'total'],
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function (event, originalEvent, type, page) {
							listWeixinPage(page);
						}
					};
					setPage('pageList',options);
				}else{
					$('.select_rows').iCheck('uncheck');
					$('#wxList').find('tbody').html('<tr><td colspan="6" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
					$('#pageList').html('');
				}
			}else{
				yunNoty(data);
			}
		}
	});
}

//添加公众号表单验证
var flag_wechat_add=false;
function setWeChat(){
	if(flag_wechat_add){
		return;
	}
	flag_wechat_add=true;
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../wxConfig/editWxConfigInfo'),
		data:$("#wx_form").serialize(),
		success:
		function(data){
			flag_wechat_add=false;
			if(data.status===0){
				yunNoty(data,function(){
					$('#addModal').modal('hide');
					listCurrentPage(listWeixinPage,'pageList');
				});
			}else{
				yunNoty(data);
			}
		}
	});
}

//添加企业号表单验证
function setConpany(){
	if(flag_wechat_add){
		return;
	}
	flag_wechat_add=true;
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../wxConfig/editWxConfigInfo'),
		data:$("#company_form").serialize(),
		success:
		function(data){
			flag_wechat_add=false;
			if(data.status===0){
				yunNoty(data,function(){
					$('#addModalCo').modal('hide');
					listCurrentPage(listWeixinPage,'pageList');
				});
			}else{
				yunNoty(data);
			}
		}
	});
}

//获取对接信息
function obtainURL(obj,id){
	var index = $(obj).parents('tr').index();
	var token = listWeixinPageData[index].Token;
	var EncodingAESKey = listWeixinPageData[index].EncodingAESKey;
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../WXConfig/getUrlToWx?id='+id),
		success:
		function(data){
			if(data.status===0){
				$('#obtainURL').modal('show');
				var html='';
				html += '<tr><th width="30%" style="text-align: right; vertical-align:middle;">URL:</th><td width="70%" style="word-wrap: break-word;word-break: break-all;">'+data.urlToWx+'</td></tr>';
				html += '<tr><th style="text-align: right;">token:</th><td style="word-wrap: break-word;word-break: break-all;">'+(token==null?'':token)+'</td></tr>';
				html += '<tr><th style="text-align: right;">EncodingAESKey:</th><td style="word-wrap: break-word;word-break: break-all;">'+(EncodingAESKey==null?'':EncodingAESKey)+'</td></tr>';
				$('#wx_info').html(html);
			} else {
				yunNoty(data);
			}
		}
	});
}

//填充模态窗
function editweixinModal(obj){
	var index = $(obj).parents('tr').index();
	var curObj=$(obj).parents('tr').children('td');
	$('#company_form_edit .ztreeName3').html(curObj.eq(2).html()==''?'暂未选择知识集':curObj.eq(2).html());
	$('#save_form .ztreeName4').html(curObj.eq(2).html()==''?'暂未选择知识集':curObj.eq(2).html());//将themeid显示到页面上
	//$('#company_form_edit input[name=themeId]').val(listWeixinPageData[index].ThemeId);
	//$('#save_form input[name=themeId]').val(listWeixinPageData[index].ThemeId);
	$('.dataSave')[0].reset();
	var temp = listWeixinPageData[index].Type;
	if(listWeixinPageData[index].AddStyle) {
		if(listWeixinPageData[index].AddStyle == 1) {
			$('#myModal').find('input[type=text]').attr('readonly','readonly');
			$('#myModal').find('input[type=radio]').iCheck('disable');
		}
	}
	//企业号
	if(temp==2){
		$('#company_form_edit').show();
		$('#save_form').hide();
		$('#repairCompany').show();
		$('#repairPublic').hide();
		$('#company_form_edit input[name=id]').val(listWeixinPageData[index].Id);
		$('#company_form_edit input[name=name]').val(listWeixinPageData[index].Name);
	//公众号
	}else{
		$('#company_form_edit').hide();
		$('#save_form').show();
		$('#repairCompany').hide();
		$('#repairPublic').show();
		$('#save_form input[name=id]').val(listWeixinPageData[index].Id);
		$('#save_form input[name=name]').val(listWeixinPageData[index].Name);
		var ecMode=listWeixinPageData[index].EncryptionMode;
		if(ecMode==0){
			$('#save_form input[name=encryptionMode]').eq(0).iCheck('check');
		}else if(ecMode==1){
			$('#save_form input[name=encryptionMode]').eq(1).iCheck('check');
		}else if(ecMode==2){
			$('#save_form input[name=encryptionMode]').eq(2).iCheck('check');
		}
	}
	$('.dataSave input[name=appId]').val(listWeixinPageData[index].AppId);
	$('.dataSave input[name=agentId]').val(listWeixinPageData[index].AgentId);
	$('.dataSave input[name=appSecret]').val(listWeixinPageData[index].AppSecret);
	$('.dataSave input[name=token]').val(listWeixinPageData[index].Token);
	$('.dataSave input[name=encodingAESKey]').val(listWeixinPageData[index].EncodingAESKey);
	$('.dataSave .helloWord').val(listWeixinPageData[index].Helloword);
	$('.dataSave .unknownWord').val(listWeixinPageData[index].UnknownWord);
	var typeIf=listWeixinPageData[index].Type;
	if(typeIf=='0'){
		$('#save_form input[name=type]').eq(0).iCheck('check');
	}else if(typeIf=='1'){
		$('#save_form input[name=type]').eq(1).iCheck('check');
	}else if(typeIf=='2'){
		$('#company_form_edit .type').val(2);
	}
	var typeIf=listWeixinPageData[index].Mode;
	if(typeIf=='0'){
		$('.dataSave input[name=mode]').eq(0).iCheck('check');
	}else if(typeIf=='1'){
		$('.dataSave input[name=mode]').eq(1).iCheck('check');
	}else if(typeIf=='2'){
		$('.dataSave input[name=mode]').eq(2).iCheck('check');
	}
	$('#myModal').modal('show');
}




function reppublic(){
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../wxConfig/editWxConfigInfo'),
		data:$("#save_form").serialize(),
		success:
		function(data){
			if(data.status===0){
				$('#myModal').modal('hide');
				listCurrentPage(listWeixinPage,'pageList');
				yunNoty(data);
			 }else{
				yunNoty(data);
			}
		}
	});
}

function repCompany(){
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../wxConfig/editWxConfigInfo'),
		data:$("#company_form_edit").serialize(),
		success:
		function(data){
			if(data.status===0){
				$('#myModal').modal('hide');
				listCurrentPage(listWeixinPage,'pageList');
				yunNoty(data);
			 }else{
				yunNoty(data);
			}
		}
	});
}

//用给定字母随机生成一串字符
function generateKey(len) {
　　len = len || 43;
　　var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}
/***********************wechatList END***********************/
