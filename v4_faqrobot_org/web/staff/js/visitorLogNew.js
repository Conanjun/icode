
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
	dataP[$('#ABC').attr('name')]=$('#ABC').val()
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
					// 如果经过身份认证将下面th添到表格头里
					if($("a[class=chooseName]").size()>0&&$("#visiterlogList thead>tr th").size()!=($("#showcheckbox li").size()+2)){
						var ths='';
						for(var i=0;i<$(".addlist span").size();i++){
							switch ($(".addlist span").eq(i).html()) {
								case '姓名':
									ths += '<th class="nameTd">姓名</th>';										
									break;
								case '联系电话':
									ths += '<th class="phoneTd">联系方式</th>';								
									break;
								case '身份类型':
									ths += '<th class="identifyTd">身份类型</th>';									
									break;
								case '公司':
									ths += '<th class="companyTd">公司</th>';									
									break;
								case '会员等级':
									ths += '<th class="UserLevelTd">会员等级</th>';									
									break;
								case '卡号':
									ths += '<th class="cardTd">卡号</th>';									
									break;
								default:
									break;
							}
						}
						$("#visiterlogList thead>tr").prepend(ths)
					}
					if(data.list.length>0){
						var html = "";
						for(var i=0;i<data.list.length;i++){
							html += "<tr id=\"list-tr-"+data.list[i].ChatUserId+"\">";
							var nameStr=data.list[i].CardName||'';
							var TelNumStr=data.list[i].TelNum||'';
							var IdentityStr=data.list[i].Identity||'';
							var CardCompanyStr=data.list[i].CardCompany||'';
							var UserLevelStr=data.list[i].UserLevel||'';
							var UserIdStr=data.list[i].UserId||'';
							// 如果经过身份认证将下面td添到表格里
							for(var j=0;j<$(".addlist span").size();j++){
								switch ($(".addlist span").eq(j).html()) {
									case '姓名':
										html += '<td class="nameTd">'+nameStr+'</td>';										
										break;
									case '联系电话':
										html += '<td class="phoneTd">'+TelNumStr+'</td>';								
										break;
									case '身份类型':
										html += '<td class="identifyTd">'+IdentityStr+'</td>';									
										break;
									case '公司':
										html += '<td class="companyTd">'+CardCompanyStr+'</td>';									
										break;
									case '会员等级':
										html += '<td class="UserLevelTd">'+UserLevelStr+'</td>';									
										break;
									case '卡号':
										html += '<td class="cardTd">'+UserIdStr+'</td>';									
										break;
									default:
										break;
								}
							}
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
								html +="<td class='channelsTd'>"+data.list[i].SourceId+data.list[i].Name+"</td>";
							}
							if(data.list[i].LogItems===0){
								html += "<td class='recordsTd' style='color:#cd2c68'>"+data.list[i].LogItems+"</td>";
							}else{
								html += "<td class='recordsTd'>"+data.list[i].LogItems+"</td>";
							}
							html += "<td class='loginsTd'>"+data.list[i].LoadTimes+"</td>";
							if(data.list[i].StayTime===0)
							{
								html += "<td class='standsTd' style='color:#cd2c68'>0秒</td>";
							}else{
								html += "<td class='standsTd'>"+formatTime(data.list[i].StayTime)+"</td>";
							}
							html += "<td class='startTd'>"+data.list[i].StartTime+"</td>";
							html += "<td class='endTd'>"+data.list[i].EndTime+"</td>";
							html += "<td class='addresssTd'>"+data.list[i].Location+"</td>";
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
					// 选择显示内容多选框
					var uncheckedArr=$("#showcheckbox input[type=checkbox]:not(:checked)") //选择显示内容中未选中的input框
					// 遍历未选中input框，隐藏对应的列
					for(var i=0;i<uncheckedArr.size();i++){
						$('.'+$(uncheckedArr[i]).attr('name')).hide()	
					}
					$("#showcheckbox p").html($("#showcheckbox input[type=checkbox]:checked").size()+'/'+$("#showcheckbox input[type=checkbox]").size())
				}else{
					yunNoty(data);
				}
			}
	});
}
/***********************visitorLog END***********************/



