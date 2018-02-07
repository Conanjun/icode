
//staff模块js

/***********************userList START***********************/
//动态生成用户列表
function listUser(pageNo){
	if(!pageNo)pageNo=1;
	$('#userList').tableAjaxLoader2(7);
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../user/list?pageSize='+10+'&pageNo='+pageNo),
		data:$('#user_form').serialize(),
		success:
			function(data){
				if(data.status===0){
					if(data.list===undefined){
						$('#userList').find('tbody').html('<tr><td colspan=\"7\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>  当前纪录为空！</td></tr>');
						$('#pageList').html('');
						return;
					}
					if(data.list.length>0){
						var html = "";
						for(var i=0;i<data.list.length;i++){
							html += "<tr id=\"list-tr-"+data.list[i].Id+"\">";
							var name=data.list[i].UserName===null?'':data.list[i].UserName;
							html += "<td>"+name+"</td>";
							var nicheng=data.list[i].Name===null?'':data.list[i].Name;
							html += "<td>"+nicheng+"</td>";
							var num=data.list[i].TelNum===null?'':data.list[i].TelNum;
							html += "<td>"+num+"</td>";
							var email=data.list[i].Email===null?'':data.list[i].Email;
							html += "<td>"+email+"</td>";
							var QQ=data.list[i].Qq===null?'':data.list[i].Qq;
							html += "<td>"+QQ+"</td>";
							/*
								taskid=698,黄世鹏
								开发：添加状态列
							*/
							if(data.list[i].Status==0){
								html += "<td >启用</td>";
							}else{
								html += "<td style='color:red'>禁用</td>";
							}
							if(data.list[i].RoleName==='' || data.list[i].RoleName===null){
								html += "<td></td>";
							}else{
								html += "<td><span title=\""+data.list[i].RoleName+"\">"+limitstr(data.list[i].RoleName,30)+"</span></td>";
							}
							/*
								taskid=698,黄世鹏
								开发：添加改变状态的图标
							*/
							if(data.list[i].Status==0){
								html += "<td id="+data.list[i].Id+"> <a style='color:#337ab7' ><i  value=\""+data.list[i].Id+"\" style=\"cursor:pointer\" class=\"timeTip edit-synonym glyphicon glyphicon-ok\" title=\"点击禁用此用户\"></i></a>  <a  value=\""+data.list[i].Id+"\" title=\"编辑\" onclick=\"repModal(this)\" style=\"cursor:pointer;\"><i class=\"glyphicon glyphicon-pencil\"></i></a>  <a class=\"timeTip\" data-placement=\"top\" data-toggle=\"tooltip\" data-original-title=\"重置密码\" href=\"javascript:void(0);\" rel=\""+data.list[i].Id+"\" onClick=\"resetPwd(this); return false;\"><i class=\"glyphicon glyphicon-refresh\"></i></a>  <a class=\"m-del\" title=\"删除\" rel=\""+data.list[i].Id+"\" style=\"cursor:pointer; \" ><i class=\"glyphicon glyphicon-trash\" ></i></a></td>";
								html += "</tr>";
							}else{
								html += "<td id="+data.list[i].Id+"> <a style='color:#337ab7' ><i value=\""+data.list[i].Id+"\"  style=\"cursor:pointer\" class=\"timeTip edit-synonym glyphicon glyphicon-remove\" title=\"点击启用此用户\"></i></a>  <a value=\""+data.list[i].Id+"\" title=\"编辑\" onclick=\"repModal(this)\" style=\"cursor:pointer;\"><i class=\"glyphicon glyphicon-pencil\"></i></a>  <a class=\"timeTip\" data-placement=\"top\" data-toggle=\"tooltip\" data-original-title=\"重置密码\" href=\"javascript:void(0);\" rel=\""+data.list[i].Id+"\" onClick=\"resetPwd(this); return false;\"><i class=\"glyphicon glyphicon-refresh\"></i></a>  <a class=\"m-del\" title=\"删除\" rel=\""+data.list[i].Id+"\" style=\"cursor:pointer; \" ><i class=\"glyphicon glyphicon-trash\" ></i></a></td>";
							}
							html += "</tr>";
						}
						$('#userList').find('tbody').html(html);
						//单个删除
						$('.m-del').on('click',function(){
							var self = this;
							$(self).adcCreator(function() {
								delById(self,'../../user/doDel',listUser,'pageList');
							});
						});
						$('.timeTip').tooltip();
						//下面开始处理分页
						var options = {
							data: [data, 'list', 'total'],
							currentPage: data.currentPage,
							totalPages: data.totlePages,
							onPageClicked: function (event, originalEvent, type, page) {
								listUser(page);
							}
						};
						setPage('pageList',options);
					}else{
						$('#userList').find('tbody').html('<tr><td colspan=\"7\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>  当前纪录为空！</td></tr>');
						$('#pageList').html('');
					}
				}else{
					yunNoty(data);
				}
			}
	});
}
/*
	taskid=698,黄世鹏
	开发：改变状态的方法
*/
$('body').on('click', '.edit-synonym', function() {
	var id = $(this).parents('td').attr('id');
	if ($(this).parents('tr').find('td').eq(5).text()=='启用') {
		status = 4;
	} else {
		/*
			taskid=724,黄世鹏
			开发：当点击启用时，同时弹出弹出编辑按钮的模态框。
		 */
		status = 0;
		repModal(this);
	};
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,
		url:encodeURI('../../user/editStatus'),
		data:{
			id: id,
			status: status,
		},
		success:
			function(data){
				if(status=4){
					listCurrentPage(listUser,'pageList');
				}
					yunNoty(data);
			}
	});
	
});

function fresh(){
	listCurrentPage(listUser,'pageList');
}

//添加用户表单提交
var flag_user_add=false;
function doAddUser(){
	if($('#addUser input[name=resName]').val()=="请选择角色"){
		yunNotyError('请选择角色！');
		return;
	}
	if(flag_user_add){
		return;
	}
	flag_user_add=true;
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../user/doAddUser'),
		data:$("#addUser").serialize(),
		success:
			function(data){
				flag_user_add=false;
				if(data.status===0){
					yunNoty(data);
					$('#addModal').modal('hide');
					listCurrentPage(listUser,'pageList');
				}else{
					yunNoty(data);
				}
			}
	});
}

//搜索框重置
function resetSearch(){
	$('#user_form')[0].reset();
}

//用户列表的操作列的重置密码按钮
function resetPwd(obj){
	$('#resetPwd').modal('show');
	$('#repsetPwdForm input[name=id]').val($(obj).attr('rel'));
}

//重置密码
function repUserPwd(){
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../user/reSetPwdById'),
		data:$("#repsetPwdForm").serialize(),
		success:
			function(data){
				if(data.status===0){
					yunNoty(data);
					$('#resetPwd').modal('hide');
				}else{
					yunNoty(data);
				}
			}
	});
}

//用户列表的操作列的修改表单按钮
function repModal(obj) {
	var UserId = $(obj).attr("value");
	$('#repUser_form input[name=id]').val(UserId);
	getUserInfo(UserId);
	$("#editModal").modal('show');
}

//填充修改模态窗的表单
function getUserInfo(UserId){
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,
		url:encodeURI('../../user/findById?Id='+UserId),
		success:
			function(data){
				if(data.status===0){
					$('#repUser_form .un').val(data.user_Exist.UserName);
					$('#repUser_form input[name=telNum]').val(data.user_Exist.TelNum);
					$('#repUser_form input[name=name]').val(data.user_Exist.Name);
					$('#repUser_form input[name=qq]').val(data.user_Exist.Qq);
					$('#repUser_form input[name=email]').val(data.user_Exist.Email);
					$('#repUser_form input[name=resName]').val(data.user_Exist.RoleName);
					$('#repUser_form input[name=roleIds]').val(data.roleIds);
					$("#repUser_form input[name=hasChecked]").val(data.user_Exist.RoleName);
					$("#repUser_form input[name=hasCheckedId]").val(data.roleIds);
				}
			}
	});
}

//修改用户表单提交
var flag_user_edit=false;
function repUserInfo(){
	if(flag_user_edit){
		return;
	}
	flag_user_edit=true;
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,
		url:encodeURI('../../user/edit'),
		data:$('#repUser_form').serialize(),
		success:
			function(data){
				flag_user_edit=false;
				if(data.status===0){
					yunNoty(data);
					$('#editModal').modal('hide');
					listCurrentPage(listUser,'pageList');
				}else{
					yunNoty(data);
				}
			}
	});
}
/***********************userList END***********************/


/***********************apiUserList STRAT***********************/
//动态生成API用户列表
var api_that;
function apiUserlist(pageNo){
	if(!pageNo)pageNo=1;
	$('#apiUserlist').tableAjaxLoader2(9);
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../apiUser/list?pageSize='+10+'&pageNo='+pageNo),
		success:
			function(data){
				if(data.status===0){
					if(data.list===undefined){
						$('#apiUserlist').find('tbody').html('<tr><td colspan=\"9\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>  当前纪录为空！</td></tr>');
						$('#pageList').html('');
						return;
					}
					if(data.list.length>0){
						var html = "";
						for(var i=0;i<data.list.length;i++){
							html += "<tr>";
							html += "<td>"+data.list[i].UserName+"</td>";
							html += "<td>"+data.list[i].PassWord+"</td>";
							var name=data.list[i].Name===null?'':data.list[i].Name;
							html += "<td>"+name+"</td>";
							var email=data.list[i].Email===null?'':data.list[i].Email;
							html += "<td>"+email+"</td>";
							//var tel=data.list[i].TelNum===null?'':data.list[i].TelNum;
							//html += "<td>"+tel+"</td>";
							var qq=data.list[i].Qq===null?'':data.list[i].Qq;
							html += "<td>"+qq+"</td>";
							if(data.list[i].RoleName){
								html += "<td>"+limitstr(data.list[i].RoleName,30)+"</td>";
							}else{
								html += "<td></td>";
							}
							if(data.list[i].Status === 0){
								html += "<td>已启用</td>";
							} else {
								html += "<td style=\"color:#F00;\">已禁用</td>";
							}
							html += "<td><a value=\""+data.list[i].Id+"\" title=\"编辑\" onclick=\"APIrepModal(this)\" style=\"cursor:pointer;\"><i class=\"glyphicon glyphicon-pencil\"></i></a>&nbsp;&nbsp;";
							if(data.list[i].Status === 0){
								html += "<a class=\"timeTip ban_a\" data-placement=\"top\" data-toggle=\"tooltip\" data-original-title=\"点击禁用\" href=\"javascript:void(0);\"  rel=\""+data.list[i].Id+"\"><i class=\"glyphicon glyphicon-ban-circle\" ></i></a>";
							} else {
								html += "<a class=\"timeTip ok_a\" data-placement=\"top\" data-toggle=\"tooltip\" data-original-title=\"点击启用\" href=\"javascript:void(0);\" rel=\""+data.list[i].Id+"\"><i class=\"glyphicon glyphicon-ok-circle\" ></i></a>";
							}
							html += "&nbsp;&nbsp;<a class=\"timeTip refresh_a\" data-placement=\"top\" data-toggle=\"tooltip\" data-original-title=\"重置密码\" href=\"javascript:void(0);\" rel=\""+data.list[i].Id+"\" ><i class=\"glyphicon glyphicon-refresh\" ></i></a>";
							html += "&nbsp;&nbsp;<a class=\"timeTip token_a\" data-access='"+data.list[i].UserName+"' data-token='"+data.list[i].PassWord+"' data-placement=\"top\" data-toggle=\"tooltip\" data-original-title=\"获取access token\" href=\"javascript:void(0);\" rel=\""+data.list[i].Id+"\" ><i class=\"glyphicon glyphicon-info-sign\" ></i></a>";
							html += "&nbsp;&nbsp;<a href=\"#\" class=\"m-del\"  rel=\""+data.list[i].Id+"\" title=\"删除\" ><i class=\"glyphicon glyphicon-trash\" ></i></a>";
							html += "</td>";
							html += "</tr>";
						}
						$('#apiUserlist').find('tbody').html(html);
						//删除
						$('.m-del').on('click',function(){
							var self = this;
							$(self).adcCreator(function() {
								delById(self,'../../apiUser/doDel',apiUserlist,'pageList');
							});
						});
						//密码重置
						$('.refresh_a').on('click',function(){
							$('#ApiResetPwd').modal('show');
							api_that = this;
						});
						//禁用
						$('.ban_a').on('click',function(){
							simpleEdit('../../apiUser/doEditStatus',this,apiUserlist,'pageList',1);
						});
						//启用
						$('.ok_a').on('click',function(){
							simpleEdit('../../apiUser/doEditStatus',this,apiUserlist,'pageList',0);
						});
						$('.token_a').on('click', function() {
							$('#access').html('获取access_token地址：<br>'+window.location.origin+'/Token/getToken?appId='+$(this).attr('data-access')+'&secret='+$(this).attr('data-token'));
							access_url = '../../Token/getToken?appId='+$(this).attr('data-access')+'&secret='+$(this).attr('data-token');
							$('#token').html('');
							$('#token').hide();
							$('#tokenTitle').hide();
							$('#access_token').modal('show');
						});
						$('.timeTip').tooltip();
						//下面开始处理分页
						var options = {
							data: [data, 'list', 'total'],
							currentPage: data.currentPage,
							totalPages: data.totlePages,
							onPageClicked: function (event, originalEvent, type, page) {
								apiUserlist(page);
							}
						};
						setPage('pageList',options);
					}else{
						$('#apiUserlist').find('tbody').html('<tr><td colspan=\"9\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>  当前纪录为空！</td></tr>');
						$('#pageList').html('');
					}
				}else{
					yunNoty(data);
				}
			}
	});
}
$('#ApiResetPwd').on('show.bs.modal', function(){
	$('#sureResetPwd').unbind('click').bind('click',function(){
		simpleEdit('../../apiUser/reSetPwdById',api_that,apiUserlist,'pageList');
		$('#ApiResetPwd').modal('hide');
	})
})
//添加API用户表单提交
var flag_APIuser_add=false;
function addapiUser(){
	if($('#apiUseradd input[name=resName]').val()=="请选择角色"){
		yunNotyError('请选择角色！');
		return;
	}
	if(flag_APIuser_add){
		return;
	}
	flag_APIuser_add=true;
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../apiUser/doAddUser'),
		data:$("#apiUseradd").serialize(),
		success:
			function(data){
				flag_APIuser_add=false;
				if(data.status===0){
					yunNoty(data);
					$('#addModal').modal('hide');
					listCurrentPage(apiUserlist,'pageList');
				} else {
					yunNoty(data);
				}
			}
	});
}

//API用户列表的操作列的修改表单按钮
function APIrepModal(obj) {
	var UserId = $(obj).attr("value");
	$('#repUser_form input[name=id]').val(UserId);
	getAPIUserInfo(UserId);
	$("#editModal").modal('show');
}

//填充修改模态窗的表单
function getAPIUserInfo(UserId){
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,
		url:encodeURI('../../apiUser/findById?id='+UserId),
		success:
			function(data){
				if(data.status===0){
					$('#repUser_form .un').val(data.apiUser.UserName);
					$('#repUser_form input[name=name]').val(data.apiUser.Name);
					$('#repUser_form input[name=email]').val(data.apiUser.Email);
					$('#repUser_form input[name=qq]').val(data.apiUser.Qq);
					$('#repUser_form input[name=userName]').val(data.apiUser.UserName);
					$('#repUser_form input[name=passWord]').val(data.apiUser.PassWord);
					$('#repUser_form input[name=resName]').val(data.apiUser.RoleName);
					$('#repUser_form input[name=roleIds]').val(data.roleIds);
					$("#repUser_form input[name=hasChecked]").val(data.apiUser.RoleName);
					$("#repUser_form input[name=hasCheckedId]").val(data.roleIds);
				}
			}
	});
}

//修改API用户表单提交
var flag_APIuser_edit=false;
function repAPIUserInfo(){
	if(flag_APIuser_edit){
		return;
	}
	flag_APIuser_edit=true;
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,
		url:encodeURI('../../apiUser/edit'),
		data:$('#repUser_form').serialize(),
		success:
			function(data){
				flag_APIuser_edit=false;
				if(data.status===0){
					yunNoty(data);
					$('#editModal').modal('hide');
					listCurrentPage(apiUserlist,'pageList');
				}else{
					yunNoty(data);
				}
			}
	});
}
/***********************apiUserList END***********************/

/***********************cardList START***********************/
//动态生成用户名片列表
function listCardPage(pageNo){
	if(!pageNo)pageNo=1;
	$('#cardList').tableAjaxLoader2(6);
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../usercard/list?pageSize='+20+'&pageNo='+pageNo),
		data:$('#searchName').serialize(),
		//data:encodeURI(tempcontent),
		success:
			function(data){
				if(data.status===0){
					if(data.list===undefined){
						$('#cardList').find('tbody').html('<tr><td colspan=\"6\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>  当前纪录为空！</td></tr>');
						$('#pageList').html('');
						return;
					}
					if(data.list.length>0){
						var html = "";
						for(var i=0;i<data.list.length;i++){
							html += "<tr id=\"list-tr-"+data.list[i].Id+"\">";
							var name=data.list[i].Name===null?'':data.list[i].Name;
							html += "<td>"+name+"</td>";
							switch (data.list[i].Sex){
								case 0:
								html += "<td>未知</td>";
								break;
								case 1:
								html += "<td>男</td>";
								break;
								case 2:
								html += "<td>女</td>";
								break;
								default:
								html += "<td>未知</td>";
								break;
							}
							var qq=data.list[i].Qq===null?'':data.list[i].Qq;
							var email=data.list[i].Email===null?'':data.list[i].Email;
							var wName=data.list[i].WxName===null?'':data.list[i].WxName;
							var telNum=data.list[i].TelNum===null?'':data.list[i].TelNum;
							html += "<td>"+qq+"</td>";
							html += "<td>"+email+"</td>";
							html += "<td>"+wName+"</td>";
							html += "<td>"+telNum+"</td>";
							html += "<td> <a rel=\""+data.list[i].Id+"\" class=\"m-del\" style=\"cursor:pointer;\"><i class=\"glyphicon glyphicon-trash\" ></i></a></td>";
							html += "</tr>";
						}
						$('#cardList').find('tbody').html(html);
						$('.m-del').on('click',function(){
							var self = this;
							$(self).adcCreator(function() {
								delById(self,'../../usercard/doDel',listCardPage,'pageList');
							});
						});
						icheckInit();
						//下面开始处理分页
						var options = {
							data: [data, 'list', 'total'],
							currentPage: data.currentPage,
							totalPages: data.totlePages,
							onPageClicked: function (event, originalEvent, type, page) {
								listCardPage(page);
							}
						};
						setPage('pageList',options);
					}else{
						$('#cardList').find('tbody').html('<tr><td colspan=\"6\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>  当前纪录为空！</td></tr>');
						$('#pageList').html('');
					}
				}else{
					yunNoty(data);
				}
			}
	});
}

//表单提交
var flag_card_add=false;
function addCard(){
	if(flag_card_add){
		return;
	}
	flag_card_add=true;
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,
		url:encodeURI('../../usercard/doAddUser'),
		data:$("#addCard_form").serialize(),
		success:
			function(data){
				flag_card_add=false;
				if(data.status===0){
					yunNoty(data);
					$('#addModal').modal('hide');
					listCurrentPage(listCardPage,'pageList');
				}else{
					yunNoty(data);
				}
			}
	});
}
/***********************cardList END***********************/

/***********************importUser START***********************/
function problem_Import(pageNo,orderType){
	if(!pageNo)pageNo=1;
	if(!orderType)orderType=2;
	$('#problemList').tableAjaxLoader2(7);
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../user/listMiddleUser?pageSize='+20+'&pageNo='+pageNo+'&orderType='+orderType),
		success:
			function(data){
				if (data.status===0){
					if(data.List===undefined){
						$('#problemList').find('tbody').html('<tr><td colspan="7" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空</td></tr>');
						$('#problemPageList').html('');
						return;
					}
					var s = [];//暂时存储html代码
					var Status='';//导入状态
					if(data.List.length>0){
						for(var i=0;i<data.List.length;i++){
							s.push('<tr>');
							s.push('<td>'+data.List[i].UserName+'</td>');
							s.push('<td>'+data.List[i].Name+'</td>');
							s.push('<td>'+data.List[i].RoleName+'</td>');
							if(data.List[i].TelNum !== ""){
								s.push('<td>'+data.List[i].TelNum+'</td>');
							} else {
								s.push('<td>--</td>');
							}
							if(data.List[i].City !== ""){
								s.push('<td>'+data.List[i].City+'</td>');
							} else {
								s.push('<td>--</td>');
							}
							if(data.List[i].ImportStatus == 1){
								s.push('<td><span class="label label-danger" style="line-height:2; font-size:90%">导入失败</span></td>');
							} else if(data.List[i].ImportStatus == 2){
								s.push('<td><span class="label label-warning" style="line-height:2; font-size:90%">等待导入</span></td>');
								$("#files button").show()
							} else if(data.List[i].ImportStatus == 3){
								s.push('<td><span class="label label-success" style="line-height:2; font-size:90%">导入成功</span></td>');
							} else {
								s.push('<td>--</td>');
							}
							s.push('<td>'+data.List[i].Result+'</td>');
							s.push('</tr>');
						}
						$('#problemList').find('tbody').html(s.join(''));
						//下面开始处理分页
						var options = {
							data: [data, 'List', 'total'],
							currentPage: data.currentPage,
							totalPages: data.totlePages,
							onPageClicked: function (event, originalEvent, type, page) {
								problem_Import(page,orderType);
							}
						};
						setPage('problemPageList',options);
					}else{
						$('#problemList').find('tbody').html('<tr><td colspan="7" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空</td></tr>');
						$('#problemPageList').html('');
					}
				}else{
					yunNoty(data);
				}
			}
	});
}
/***********************importUser END***********************/

/***********************visitorLog START***********************/
//访客日志列表
var selectSourceFlag = true;
function visiterLog(pageNo,orderType,confirmBtn){

	if(confirmBtn){
		var sValue=$('#tm1').val().split('-');
		var eValue=$('#tm2').val().split('-');
		$('.ttw').html('').html(sValue[1]+'月'+sValue[2].split(' ')[0]+'日'+'-'+ eValue[1]+'月'+eValue[2].split(' ')[0]+'日'+ '&nbsp;<span class="caret"></span>');
	}
	if(!pageNo)pageNo=1;
	if(!orderType){
		orderType=$('input[name=orderType]').val();
	}else{
		$('input[name=orderType]').val(orderType);
		switch(orderType) {
			case 3:
				$('#biandong').html('时间正序 <span class="caret"></span>');
				break;
			case 4:
				$('#biandong').html('时间倒序 <span class="caret"></span>');
				break;
			case 27:
				$('#biandong').html('访客类型正序 <span class="caret"></span>');
				break;
			case 28:
				$('#biandong').html('访客类型倒序 <span class="caret"></span>');
				break;
		}
	}
	var gST=$('#visiterLog_Query input[name=startT]').val();
	var gEt=$('#visiterLog_Query input[name=endT]').val();
	if(gST==='' && gEt!==''){
		yunNotyError('请输入起始时间！');
		return;
	}
	if(gST!=='' && gEt===''){
		yunNotyError('请输入结束时间！');
		return;
	}
	var startgST = new Date(gST.replace("-", "/").replace("-", "/"));
	var endgEt = new Date(gEt.replace("-", "/").replace("-", "/"));
	if(endgEt<startgST){
		yunNotyError('起始时间不能小于结束时间！！');
		return;
	}
	var dataP = new Object();
	if($('#ABC').attr('name') == 'keywords'){
		dataP.keywords = $('#ABC').val();
	}else{
		dataP.location = $('#ABC').val();
	}
	$('#visiterlogList').tableAjaxLoader2(9);
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../loginsummary/getList?pageSize='+20+'&pageNo='+pageNo+'&orderType='+orderType+'&sourceId='+$('#Choice_Query').val()+'&startT='+gST+'&endT='+gEt+'&logItems='+$('#LogItems_Query').val()+'&level='+$('#Level_Query').val()+'&loadTimes='+$('#vType_Query').val()),
		data:dataP,
		success:
			function(data){
				if(data.status===0){
					if(data.list===undefined){
						$('#visiterlogList').find('tbody').html('<tr><td colspan=\"9\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>  当前纪录为空！</td></tr>');
						$('#logpageList').html('');
						return;
					}
					if(data.sourceList) {
						if(data.sourceList[0]) {
							if(selectSourceFlag) {
								var html = '<select class="selectpicker" id="Choice_Query">';
								html += '<option value="-1">全部渠道</option>';
								for(var m in data.sourceList) {
									html += '<option value="'+data.sourceList[m].DicCode+'">'+data.sourceList[m].DicDesc+'</option>';
								}
								html += '</select>';
								$('#DataSource').empty().append(html);
								$('#Choice_Query').selectpicker({
									style: 'btn-primary',
									width: '100%'
								});
								selectSourceFlag = false;
							}
						}
					}
					if(data.list.length>0){
						var html = "";
						for(var i=0;i<data.list.length;i++){
							html += "<tr id=\"list-tr-"+data.list[i].ChatUserId+"\">";
							html += '<td>'+getSourceName(data.list[i].SourceId);
							if(data.list[i].Id){
								html +="(&nbsp;<span class=\"bold\" style=\"color:#5bb75b;\">&nbsp;id="+data.list[i].Id+"&nbsp;</span>&nbsp;)</td>";
							}else{
								html +="(&nbsp;Id="+data.list[i].ChatUserId+"&nbsp;)</td>";
							}
							if(data.list[i].SourceId!=null){
								switch (data.list[i].SourceId){
									case 0:
									data.list[i].SourceId = '网页账号:';
									break;
									case 1:
										if(data.list[i].Type!=null) {
											switch (data.list[i].Type) {
												case 0 :
													data.list[i].SourceId = '订阅号:';
													break;
												case 1 :
													data.list[i].SourceId = '服务号:';
													break;
												case 2 :
													data.list[i].SourceId = '企业号:';
													break;
											}
										}else if(data.list[i].Type==null){
											data.list[i].SourceId = ' '
										}
										break;
									case 2:
									data.list[i].SourceId = 'API:';
										break;
									case 3:
									data.list[i].SourceId = 'APP:';
										break;
									case 4:
									data.list[i].SourceId = '微博:';
										break;
									case 5:
									data.list[i].SourceId = '支付宝:';
										break;
									case 6:
									data.list[i].SourceId = '手机端:';
										break;
									case 7:
									data.list[i].SourceId = 'Ios端:';
										break;
									case 8:
									data.list[i].SourceId = '安卓端:';
										break;
									case 9:
									data.list[i].SourceId = '大屏端:';
										break;
									case 10:
									data.list[i].SourceId = '云问网页:'
										break;
								}
								if(data.list[i].Name==null){
									data.list[i].Name = '（未知账号）';
								}
								html +="<td>"+data.list[i].SourceId+data.list[i].Name+"</td>";
							}
							if(data.list[i].LogItems===0){
								html += "<td style='color:#cd2c68'>"+data.list[i].LogItems+"</td>";
							}else{
								html += "<td>"+data.list[i].LogItems+"</td>";
							}
							html += "<td>"+data.list[i].LoadTimes+"</td>";
							if(data.list[i].StayTime===0)
							{
								html += "<td style='color:#cd2c68'>0秒</td>";
							}else{
								html += "<td>"+formatTime(data.list[i].StayTime)+"</td>";
							}
							html += "<td>"+data.list[i].StartTime+"</td>";
							html += "<td>"+data.list[i].EndTime+"</td>";
							html += "<td>"+data.list[i].Location+"</td>";
							if(data.list[i].LogItems===0 && data.list[i].StayTime===0){
								if(data.list[i].watched===false) {
									html +="<td><a href=\"javascript:void(0);\" style='color:#999' title=\"查看聊天记录\" rel=\""+data.list[i].ChatUserId+"\" cv=\""+data.list[i].ChatVersion+"\" onclick=\"lookChat(this);return false;\">查看聊天记录</a></td>";
								} else {
									html +="<td><a href=\"javascript:void(0);\" style=\"color:#999;\" title=\"查看聊天记录\" rel=\""+data.list[i].ChatUserId+"\" cv=\""+data.list[i].ChatVersion+"\" onclick=\"lookChat(this);return false;\">查看聊天记录&nbsp;<span>已读</span></a></td>";
								}
							}else{
								if(data.list[i].watched===false) {
									html +="<td><a href=\"javascript:void(0);\" title=\"查看聊天记录\" rel=\""+data.list[i].ChatUserId+"\" cv=\""+data.list[i].ChatVersion+"\" onclick=\"lookChat(this);return false;\">查看聊天记录</a></td>";
								} else {
									html +="<td><a href=\"javascript:void(0);\" style=\"color:#999;\" title=\"查看聊天记录\" rel=\""+data.list[i].ChatUserId+"\" cv=\""+data.list[i].ChatVersion+"\" onclick=\"lookChat(this);return false;\">查看聊天记录&nbsp;<span>已读</span></a></td>";
								}
							}
							html += "</tr>";
						}
						$('#visiterlogList').find('tbody').html(html);
						//下面开始处理分页
						var options = {
							data: [data, 'list', 'total'],
							currentPage: data.currentPage,
							totalPages: data.totlePages,
							onPageClicked: function (event, originalEvent, type, page) {
								visiterLog(page);
							}
						};
						setPage('logpageList',options);
					}else{
						$('#visiterlogList').find('tbody').html('<tr><td colspan=\"9\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>  当前纪录为空！</td></tr>');
						$('#logpageList').html('');
					}
				}else{
					yunNoty(data);
				}
			}
	});
}
/***********************visitorLog END***********************/


/***********************visitorBlacklist START*********************/
//访客黑名单列表
var selectSourceFlag = true;
function vistorBlacklist(pageNo,orderType){
	var address = $('#ABC').val();
	var sourceId = $('#DataSource #Choice_Query').val();

	if(!pageNo)pageNo=1;
	if(!orderType){
		orderType=$('input[name=orderType]').val();
	}else{
		$('input[name=orderType]').val(orderType);
		switch(orderType) {
			case 3:
				$('#biandong').html('时间升序 <span class="caret"></span>');
				break;
			case 4:
				$('#biandong').html('时间降序 <span class="caret"></span>');
				break;
		}
	}
	$('#visiterlogList').tableAjaxLoader2(9);
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../ChatUser/getList?userLevel='+$('#visiterlogList').attr('tableType')+'&pageSize=10&pageNo='+pageNo+'&orderType='+orderType+'&address='+address+'&sourceId='+sourceId),
		success:
			function(data){
				if(data.status===0){
					if(data.list===undefined){
						$('#visiterlogList').find('tbody').html('<tr><td colspan=\"9\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>  当前纪录为空！</td></tr>');
						$('#logpageList').html('');
						return;
					}
					if(data.sourceList) {
						if(data.sourceList[0]) {
							if(selectSourceFlag) {
								var html = '<select class="selectpicker" id="Choice_Query">';
								html += '<option value="">全部渠道</option>';
								for(var m in data.sourceList) {
									html += '<option value="'+data.sourceList[m].DicCode+'">'+data.sourceList[m].DicDesc+'</option>';
								}
								html += '</select>';
								$('#DataSource').empty().append(html);
								$('#Choice_Query').selectpicker({
									style: 'btn-primary',
									width: '100%'
								});
								selectSourceFlag = false;
							}
						}
					}
					if(data.list.length>0){
						var html = "";
						for(var i=0;i<data.list.length;i++){
							html += "<tr id="+data.list[i].Id+">";
							if(data.list[i].SourceId!=null){
								switch (data.list[i].SourceId){
									case 0:
										data.list[i].SourceId = '网页账号';
										break;
									case 1:
										if(data.list[i].Type!=null) {
											switch (data.list[i].Type) {
												case 0 :
													data.list[i].SourceId = '订阅号';
													break;
												case 1 :
													data.list[i].SourceId = '服务号';
													break;
												case 2 :
													data.list[i].SourceId = '企业号';
													break;
											}
										}else if(data.list[i].Type==null){
											data.list[i].SourceId = '微信';
										}
										break;
									case 2:
										data.list[i].SourceId = 'API';
										break;
									case 3:
										data.list[i].SourceId = 'APP';
										break;
									case 4:
										data.list[i].SourceId = '微博';
										break;
									case 5:
										data.list[i].SourceId = '支付宝';
										break;
									case 6:
										data.list[i].SourceId = '手机端';
										break;
									case 7:
										data.list[i].SourceId = 'Ios端';
										break;
									case 8:
										data.list[i].SourceId = '安卓端';
										break;
									case 9:
										data.list[i].SourceId = '大屏端';
										break;
									case 10:
										data.list[i].SourceId = '云问网页';
										break;
								}
								if(data.list[i].Name==null){
									data.list[i].Name = '';
									html +="<td>"+data.list[i].SourceId+'(id='+data.list[i].Id+')'+"</td>";
								}else{
									html +="<td>"+data.list[i].SourceId+':'+data.list[i].Name+"</td>";
								}

							}
							if(data.list[i].Info!=null){
								html += "<td>"+data.list[i].Info+"</td>";
							}else{
								html += "<td></td>";
							}
							html += "<td>"+data.list[i].SourceId+"</td>";
							if(data.list[i].Address!=null){
								html += "<td>"+data.list[i].Address+"</td>";
							}else{
								html += "<td>"+'未知地址'+"</td>";
							}
							if($('#visiterlogList').attr('tableType')==-1){
								if(data.list[i].CserviceName!=null){
									html += "<td>"+data.list[i].CserviceName+"</td>";
								}else{
									html += "<td></td>";
								}
							}
							
							if(data.list[i].LastLoginTime!=null){
								html += "<td>"+data.list[i].LastLoginTime+"</td>";
							}else{
								html += "<td>"+'未知时间'+"</td>";
							}
							if(data.list[i].watched===false) {
								html +="<td><a href=\"javascript:void(0);\" title=\"查看聊天记录\" rel=\""+data.list[i].Id+"\" cv=\""+data.list[i].ChatVersion+"\" onclick=\"lookChat(this);return false;\">查看聊天记录</a></td>";
							} else {
								html +="<td><a href=\"javascript:void(0);\" style=\"color:#999;\" title=\"查看聊天记录\" rel=\""+data.list[i].Id+"\" cv=\""+data.list[i].ChatVersion+"\" onclick=\"lookChat(this);return false;\">查看聊天记录&nbsp;<span>已读</span></a></td>";
							}
							html += '<td><a class="delRow" href="#makeSure" data-toggle="modal"  rel="'+data.list[i].Id+'" title="删除"><i class="glyphicon glyphicon-trash" ></i></a></td>';

							html += "</tr>";
						}
						$('#visiterlogList').find('tbody').html(html);

						//下面开始处理分页

						var options = {
							data: [data, 'list', 'total'],
							currentPage: data.currentPage,
							totalPages: data.totlePages,
							onPageClicked: function (event, originalEvent, type, page) {
								vistorBlacklist(page);
							}
						};
						setPage('logpageList',options);
					}else{
						$('#visiterlogList').find('tbody').html('<tr><td colspan=\"9\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>  当前纪录为空！</td></tr>');
						$('#logpageList').html('');
					}
				}else{
					yunNoty(data);
				}
			}
	});
}
/***********************visitorBlacklist END*********************/

