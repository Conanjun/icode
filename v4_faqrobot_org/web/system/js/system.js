//system模块js
/***********************setParam START***********************/
if (!Array.prototype.find) {
  Object.defineProperty(Array.prototype, 'find', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return kValue;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return undefined.
      return undefined;
    }
  });
}
function switchList(){
  $('#setParamTab').tableAjaxLoader2(4);
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,
		url:encodeURI('../../ConfigMode/listSwitchConfig'),
		success:
		function(data){
			if(data.status===0){
				var s = [];
				if(data.modes.length>0){
					var switchItems=data.modes;
          var arsw = ['web.switch.base.enchat', 'web.switch.base.forbid.enchat', 'web.switch.plus.bus', 'web.switch.plus.foot', 'web.switch.plus.kuaidi', 'web.switch.plus.learn', 'web.switch.plus.restaurant', 'web.switch.plus.time', 'web.switch.plus.translation'];
					for(var i=0;i<switchItems.length;i++){
						s.push('<tr>');
						var infoV=switchItems[i].Info===null?'':switchItems[i].Info;
						s.push('<td>'+infoV+'</td>');
						if(switchItems[i].IntValue===0){
							s.push('<td><a href="#" class="btn btn-sm btn-danger disabled" data-id="switchery-state-text-'+i+'">关闭</a></td>');
							s.push('<td><input type="checkbox" data-render="switchery" data-theme="blue" data-change="check-switchery-state-text-'+i+'" cid="'+i+'" code="'+switchItems[i].Code+'" /></td>');
						} else if(switchItems[i].IntValue==1){
							s.push('<td><a href="#" class="btn btn-sm btn-success disabled" data-id="switchery-state-text-'+i+'">开启</a></td>');
							s.push('<td><input type="checkbox" data-render="switchery" data-theme="blue" data-change="check-switchery-state-text-'+i+'" cid="'+i+'" code="'+switchItems[i].Code+'" checked /></td>');
						}
						s.push('</tr>');
					}
					$('#setParamTab').find('tbody').html(s.join(''));
					renderSwitcher();
					for(var j=0;j<switchItems.length;j++){
						$('[data-change="check-switchery-state-text-'+j+'"]').on("change", function() {
							var codeValue=$(this).attr("code");
							var newValue=$(this).prop("checked")?1:0;
							var id=$(this).attr("cid");
							changeConfigModeValue(codeValue,newValue,id);
						});
					}
				}else{
					$('#setParamTab').find('tbody').html('<tr><td colspan=\"4\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
				}
			}else{
				yunNoty(data);
			}
		}
	});
}

//切换功能开关
function changeConfigModeValue(code,newVal,id) {
	if(!code ){
		return;
	}
	if(newVal!==0 && newVal!=1){
		return;
	}
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,
		url:encodeURI('../../ConfigMode/updateSwitchConfig?code='+code+'&intValue='+newVal),
		success:
		function(data){
			if(data.status===0){
				if(newVal==1){
					$('[data-id="switchery-state-text-'+id+'"]').text('开启').addClass('btn-success').removeClass('btn-danger');
				} else {
					$('[data-id="switchery-state-text-'+id+'"]').text('关闭').removeClass('btn-success').addClass('btn-danger');
				}
				yunNoty(data);
			}else{
				var option = {
					color : "#348fe2",
					secondaryColor : "#dfdfdf",
					className : "switchery",
					disabled : false,
					disabledOpacity : 0.5,
					speed : "0.5s"
				};
				var switcheryA = $('[data-change="check-switchery-state-text-'+id+'"]');
				if(newVal==1){
					switcheryA.removeAttr('checked');
					switcheryA.next().remove();
					var n = new Switchery(switcheryA[0], option);
				} else {
					switcheryA.attr('checked', 'checked');
					switcheryA.next().remove();
					var m = new Switchery(switcheryA[0], option);
				}
				yunNoty(data);
			}
		}
	});
}

//switchery 初始化
var renderSwitcher = function() {
	if ($("[data-render=switchery]").length !== 0) {
		$("[data-render=switchery]").each(function() {
			var n = new Switchery(this, {
				color : "#348fe2",
				secondaryColor : "#dfdfdf",
				className : "switchery",
				disabled : false,
				disabledOpacity : 0.5,
				speed : "0.5s"
			});
		});
	}
};
/***********************setParam END***********************/

/***********************visitorLog START***********************/
function logList(pageNo, orderType) {
	if (!pageNo) pageNo = 1;
	if (!orderType) orderType = 4;
  $('#log_list').tableAjaxLoader2(4);
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../operationLog/list?pageSize=' + 20 + '&pageNo=' + pageNo + '&orderType=' + orderType),
		//data:$("#search_form").serialize(),
		success: function(data) {
			if (data.status === 0) {
				var s = [];
				if (data.list.length > 0) {
					for (var i = 0; i < data.list.length; i++) {
						s.push('<tr id="list-tr-' + data.list[i].Id + '">');
						s.push('<td>' + data.list[i].Brief + '</td>');
						if (data.list[i].Type === 0) {
							s.push('<td>未操作</td>');
						} else if (data.list[i].Type == 1) {
							s.push('<td style="color:#5bb75b">添加</td>');
						} else if (data.list[i].Type == 2) {
							s.push('<td style="color:#f00">删除</td>');
						} else if (data.list[i].Type == 3) {
							s.push('<td style="color:#e46815">修改</td>');
						} else if (data.list[i].Type == 6) {
							s.push('<td style="color:#5b94b7">导出</td>');
						}
						s.push('<td>' + data.list[i].UserName + '</td>');
						s.push('<td>' + data.list[i].Time + '</td>');
					}
					s.push('</tr>');
					$('#log_list').find('tbody').html(s.join(''));
					var options = {
						data: [data, 'list', 'total'],
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function(event, originalEvent, type, page) {
							logList(page, orderType);
						}
					};
					setPage('pageList', options);
				} else {
					$('#log_list').find('tbody').html('<tr><td colspan=\"4\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>当前纪录为空</td></tr>');
					$('#pageList').html('');
				}
			} else {
				yunNoty(data);
			}
		}
	});
}
/***********************visitorLog END***********************/

/***********************feedback START***********************/
function fadeBackList(pageNo, orderType) {
	//不勾选全选
	$('.select_rows').iCheck('uncheck');
	if (!pageNo) pageNo = 1;
	if (!orderType) {
		orderType = $('input[name=orderType]').val();
	} else {
		$('input[name=orderType]').val(orderType);
	}
  $('#fadeBack_list').tableAjaxLoader2(5);
	$.getJSON("../../Evaluation/list", "pageSize=20&pageNo=" + pageNo + "&orderType=" + orderType,
	function(data) {
		if (data.status === 0) {
			if(data.List===undefined){
				$('#fadeBack_list').find('tbody').html('<tr><td colspan=\"5\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>当前纪录为空！</td></tr>');
				$('#fadebackpageList').html('');
				return;
			}
			$('.zanToday').html(data.TodaySupport);
			$('.zanTotal').html(data.AllSupport);
			$('.bzToday').html(data.TodayUnSupport);
			$('.bzTotal').html(data.AllUnSupport);
			if (data.List.length > 0) {
				var html = "";
				for (var i = 0; i < data.List.length; i++) {
					if (data.List[i].Readed === 1|| data.List[i].watched===true) {
						html += "<tr id=\"list-tr-" + data.List[i].Id + "\">";
					} else {
						html += "<tr class=\"notRead\" id=\"list-tr-" + data.List[i].Id + "\">";
					}
					html += "<td><input type=\"checkbox\" name=\"ckb\" class=\"select_row\" value=\"" + data.List[i].Id + "\" /></td>";
					if (data.List[i].Sub === null) {
						html += "<td></td>";
					} else {
						html += "<td>" + data.List[i].Sub + "</td>";
					}
					if (data.List[i].Content === null) {
						html += "<td></td>";
					} else {
						html += "<td>" + data.List[i].Content + "</td>";
					}
					if (data.List[i].Level == 1) {
						html += "<td>满意</td>";
					} else {
						html += "<td>不满意</td>";
					}
					html += "<td>" + data.List[i].DateTime + "</td>";
					if(data.List[i].Readed === 1 || data.List[i].watched===true) {
						html +="<td><a href=\"javascript:void(0);\" style=\"color:#999;\" title=\"查看聊天记录\" rel=\""+data.List[i].ChatUserId+"\" cv=\""+data.List[i].ChatVersion+"\" onclick=\"lookChat(this);return false;\">查看聊天记录&nbsp;<span>已读</span></a></td>";
					} else {
						html +="<td><a href=\"javascript:void(0);\" title=\"查看聊天记录\" rel=\""+data.List[i].ChatUserId+"\" cv=\""+data.List[i].ChatVersion+"\" onclick=\"lookChat(this);return false;\">查看聊天记录</a></td>";
					}
					/*html += "<td><a href=\"javascript:;\"  rel=\""+data.List[i].ChatUserId+"\" cv=\""+data.List[i].ChatVersion+"\" onclick=\"lookChat(this);return false;\" style=\"margin-right:10px;\">查看聊天记录</a></td>";*/
					html += "</tr>";
				}

				$('#fadeBack_list').find('tbody').html(html);
				icheckListInit();
				$('#piliang').removeClass("btn-primary").addClass("btn-default").attr("disabled",true)			
				$('.select_rows,.select_row').on('ifChanged',function(){
					if($('#fadeBack_list .select_row:checked').length>0){
						$('#piliang').removeClass("btn-default").addClass("btn-primary").attr('disabled', false);
					}else{
						$('#piliang').removeClass("btn-primary").addClass("btn-default").attr('disabled', true);
					}
				});


				//下面开始处理分页
				var options = {
					data: [data, 'List', 'total'],
					currentPage: data.currentPage,
					totalPages: data.totlePages,
					onPageClicked: function(event, originalEvent, type, page) {
						fadeBackList(page, orderType);
					}
				};
				setPage('fadebackpageList', options);
			} else {
				$('#fadeBack_list').find('tbody').html('<tr><td colspan=\"5\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>当前纪录为空！</td></tr>');
				$('#fadebackpageList').html('');
			}
		} else {
			yunNoty(data);
		}
	});
}

function hasRead(ids) {
	if (ids === '') {
		ids = getSelectedIds();
	}
	if (ids === "") {
		return false;
	}
	$.getJSON("../../Evaluation/doSetReaded", "ids=" + ids + "&readed=" + 1,
	function(data) {
		if (data.status === 0) {
			$('.select_rows').attr('checked', false);
			var page = $('#fadebackpageList .active a').html();
			var oT = $('input[name=orderType]').val();
			fadeBackList(page, oT);
			yunNoty(data);
		} else {
			yunNoty(data);
		}
	});
	return false;
}
/***********************feedback END***********************/

/***********************loginLog STRAT*********************/
function loginList(pageNo, orderType) {
	if (!pageNo) pageNo = 1;
	if (!orderType) {
		orderType = $('input[name=orderType]').val();
	} else {
		$('input[name=orderType]').val(orderType);
	}
	var gST=$('#log_Query input[name=startT]').val();
	var gEt=$('#log_Query input[name=endT]').val();
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
  $('#replayList').tableAjaxLoader2(7);
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../loginLog/list?pageSize=' + 20 + '&pageNo=' + pageNo + '&orderType=' + orderType),
		data: $("#log_Query").serialize(),
		success: function(data) {
			if (data.status === 0) {
				var s = [];
				if (data.List.length > 0) {
					for (var i = 0; i < data.List.length; i++) {
						s.push('<tr>');
						s.push('<td>');
						s.push(data.List[i].Username === null ? '&nbsp;': data.List[i].Username);
						s.push('</td>');
						s.push('<td>');
						s.push(data.List[i].Name === null ? '&nbsp;': data.List[i].Name);
						s.push('</td>');
						s.push('<td>');
						s.push(data.List[i].Datetime === null ? '&nbsp;': data.List[i].Datetime);
						s.push('</td>');
						s.push('<td>');
						s.push(data.List[i].Ipaddress === null ? '&nbsp;': data.List[i].Iptddress);
						s.push('</td>');
						s.push('<td>');
						s.push(data.List[i].Address === null ? '&nbsp;': data.List[i].Address);
						s.push('</td>');
						s.push('<td>');
						s.push(data.List[i].Groupname === null ? '&nbsp;': data.List[i].Groupname);
						s.push('</td>');
						s.push('<td>第');
						s.push(data.List[i].Logintimes === null ? '&nbsp;': data.List[i].Logintimes);
						s.push('次登录</td>');
						s.push('</tr>');
					}
					$('#replayList').find('tbody').html(s.join(''));
					//下面开始处理分页
					var options = {
						data: [data, 'List', 'total'],
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function(event, originalEvent, type, page) {
							loginList(page, orderType);
						}
					};
					setPage('userLoginPageList', options);
				} else {
					$('#replayList').find('tbody').html('<tr><td colspan="7" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空</td></tr>');
					$('#userLoginPageList').html('');
				}
			} else {
				yunNoty(data);
			}
		}
	});
}
/*************************loginLog END****************************/

/*************************feedbackList START****************************/
//模态框显示
$('#newsList').on('click','.m-edi',function(){
	$('#ediModal').modal('show')
});
function listfadeBackPage(pageNo) {
	//不勾选全选
	$('.select_rows').iCheck('uncheck');
	if (!pageNo) pageNo = 1;
  $('#fadebackList').tableAjaxLoader2(6);
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../fadeback/list?pageSize=' + 10 + '&pageNo=' + pageNo),
		//data:encodeURI(tempcontent),
		success: function(data) {
			if (data.status === 0) {
				$('.pageTotal').html(data.total);
				if(data.total===0) {
					$('.currPage').html(0);
				}
				if(data.list===undefined){
					$('#fadebackList').find('tbody').html('<tr><td colspan=\"6\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
					$('#pageList').html('');
					return;
				}
				if (data.list.length > 0) {
					var html = "";
					for (var i = 0; i < data.list.length; i++) {
						$('.currPage').html(i + 1);
						html += "<tr id=\"list-tr-" + data.list[i].Id + "\">";
						html += "<td><input type=\"checkbox\" name=\"ckb\" class=\"select_row\" value=\"" + data.list[i].Id + "\" /></td>";
						html += "<td>";
						html += data.list[i].Name === null ? '&nbsp;': data.list[i].Name;
						html += "</td>";
						html += "<td>";
						html += data.list[i].Title === null ? '&nbsp;': data.list[i].Title;
						html += "</td>";
						if (data.list[i].Level === 0) {
							html += "<td>未评价</td>";
						} else if (data.list[i].Level == 1) {
							html += "<td>非常满意</td>";
						} else if (data.list[i].Level == 2) {
							html += "<td>一般</td>";
						} else {
							html += "<td>很不满意</td>";
						}

						html += "<td>";
						html += data.list[i].ClassName === null ? '&nbsp;': data.list[i].ClassName;
						html += "</td>";
						html += "<td><a class=\"m-del\" rel=\"" + data.list[i].Id + "\" style=\"cursor:pointer;\" ><i class=\"glyphicon glyphicon-trash\" ></i></a></td>";
						html += "</tr>";
					}
					$('#fadebackList').find('tbody').html(html);
					//单个删除
					$('.m-del').on('click',function(){
						delById(this,'../../fadeback/doDel',listfadeBackPage,'pageList');
					});
					icheckListInit();
					//下面开始处理分页
					var options = {
						data: [data, 'list', 'total'],
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function(event, originalEvent, type, page) {
							listfadeBackPage(page);
						}
					};

					setPage('pageList', options);
				} else {
					$('#fadebackList').find('tbody').html('<tr><td colspan=\"6\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
					$('#pageList').html('');
				}
			} else {
				yunNoty(data);
			}
		}
	});
}
/*************************feedbackList END******************************/

/*************************newsList START********************************/
function listNewsPage(pageNo) {
	if (!pageNo) pageNo = 1;
  $('#newsList').tableAjaxLoader2(5);
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../news/list?pageSize=' + 10 + '&pageNo=' + pageNo),
		//data:encodeURI(tempcontent),
		success: function(data) {
			if (data.status === 0) {
				if(data.list===undefined){
					$('#newsList').find('tbody').html('<tr><td colspan=\"5\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-sign\"></i>当前纪录为空！</td></tr>');
					$('#pageList').html('');
					return;
				}
				if (data.list.length > 0 && data.list[0].Id!=88) {
					var html = "";
					for (var i = 0; i < data.list.length; i++) {
						if(data.list[i].Id!=88){
							html += "<tr id=\"" + data.list[i].Id + "\" groupId="+data.list[i].GroupId+">";
							html += "<td cid="+data.list[i].NoticeNo+">";
							html += data.list[i].Title === null ? '&nbsp;': data.list[i].Title;
							html += "</td>";
							html += "<td>";
							html += data.list[i].KeyWords === null ? '&nbsp;': data.list[i].KeyWords;
							html += "</td>";
							if (data.list[i].Status === 0) {
								html += "<td>不发表</td>";
							} else if (data.list[i].Status == 1) {
								html += "<td>发表</td>";
							}
							if (data.list[i].Mode === 0) {
								html += "<td>新闻</td>";
							} else if (data.list[i].Mode == 1) {
								html += "<td>产品动态</td>";
							} else if (data.list[i].Mode == 2) {
								html += "<td>行业新闻</td>";
							} else if (data.list[i].Mode == 3) {
								html += "<td>通知</td>";
							} else if (data.list[i].Mode == 4) {
								html += "<td>公告</td>";
							}
							if (data.list[i].Mode != 4) {
								html += "<td><input type='hidden' value='"+data.list[i].Content+"'/><a data-toggle=\"tooltip\" data-original-title=\"修改\" class=\"m-edi\" style=\"cursor:pointer;margin-right: 6px;\" ><i class=\"glyphicon glyphicon-pencil\" ></i></a><a data-toggle=\"tooltip\" data-original-title=\"删除\" class=\"m-del\" rel=\"" + data.list[i].Id + "\" style=\"cursor:pointer;\" ><i class=\"glyphicon glyphicon-trash\" ></i></a></td>";
							} else if (sys){
								html += "<td><a data-toggle=\"tooltip\" data-original-title=\"删除\" class=\"m-del\" rel=\"" + data.list[i].Id + "\" style=\"cursor:pointer;\" ><i class=\"glyphicon glyphicon-trash\" ></i></a></td>";
							} else {
								html += "<td></td>";
							}
							html += "</tr>";
						}
					}


					$('#newsList').find('tbody').html(html);
					$('[data-toggle="tooltip"]').tooltip();
					//单个删除
					$('.m-del').on('click',function(){
						delById(this,'../../news/doDel',listNewsPage,'pageList');
					});
					//下面开始处理分页
					var options = {
						data: [data, 'list', 'total'],
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function(event, originalEvent, type, page) {
							listNewsPage(page);
						}
					};
					setPage('pageList', options);
				} else {
					$('#newsList').find('tbody').html('<tr><td colspan=\"5\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-sign\"></i>当前纪录为空！</td></tr>');
					$('#pageList').html('');
				}
			} else {
				yunNoty(data);
			}
		}
	});
}
/***************************newsList END****************************/

/***************************parameterList START*********************/
function ParametersPage(pageNo) {
	if (!pageNo) pageNo = 1;
  var code = $('#pm_search input[name=code]').val();
  var value = $('#pm_search input[name=value]').val();
  $('#Parameterslist').tableAjaxLoader2(4);
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../configMode/list?pageSize=' + 10 + '&pageNo=' + pageNo),
    data: {
      code: code,
      value: value
    },
		success: function(data) {
			if (data.status === 0) {
				if(data.List===undefined){
					$('#Parameterslist').find('tbody').html('<tr><td colspan=\"4\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-sign\"></i>当前纪录为空！</td></tr>');
					$('#Parameterspage').html('');
					return;
				}

				if (data.List.length > 0) {
					var s = [];
					for (var i = 0; i < data.List.length; i++) {
						s.push('<tr class="delTr">');
						s.push('<td colspan="5" style="padding: 0;">');
						s.push('<form style="margin:0;"><input type="hidden" name="id" value="' + data.List[i].Id + '">');
						s.push('<table width="100%" class="table" style="margin: 0;"><tr><td width="250"><div style="width:200px;">');
						s.push('<label class="control-label" style="word-wrap: break-word;word-break: break-all;">' + data.List[i].Code + '</label></div>');
						s.push('</td><td width="100">');
						s.push('<input type="text" name="intValue" value="' + data.List[i].IntValue + '" class="form-control">');
						s.push('</td><td>');
						s.push('<textarea name="stringValue" value="'+$xss(data.List[i].StringValue, 'html')+'" class="form-control" style="resize:none;">'+$xss(data.List[i].StringValue, 'html')+'</textarea>');
						s.push('</td><td width="150">'+(data.List[i].Info?data.List[i].Info:'   ')+'</td><td width="90">');
						s.push('<input type="hidden" name="code" value="' + data.List[i].Code + '"><a class="timeTip fm_update" data-placement="top" data-toggle="tooltip" data-original-title="更新"  href="javascript:void(0);"><i class="glyphicon glyphicon-refresh"></i></a>&nbsp;<a class="timeTip fm_reset" data-placement="top" data-toggle="tooltip" data-original-title="恢复默认设置" href="javascript:void(0);"><i class="glyphicon glyphicon-repeat"></i></a>&nbsp;<a href="javascript:void(0);" class="fm_del" title="删除"><i class="glyphicon glyphicon-trash"></i></a>');
						s.push('</td></tr></table></form>');
						s.push('</td>');
						s.push('</tr>');
					}
					$('#Parameterslist').find('tbody').html(s.join(''));
					$('.timeTip').tooltip();
					$(".fm_update").on('click',function(){
						request(this,'../../configMode/updateConfigMode',ParametersPage);
						if($(this).parents('tr').find("tr").find('td:eq(0)').text() == 'conf.attack.knowledge.sentence'){
							sessionStorage.setItem('sentenceValue',$(this).parents('tr').find('td:eq(1) input').val());
						}
						if($(this).parents('tr').find("tr").find('td:eq(0)').text() == 'conf.attack.knowledge.checklog'){
							sessionStorage.setItem('checklogValue',$(this).parents('tr').find('td:eq(1) input').val());
						}
						if($(this).parents('tr').find("tr").find('td:eq(0)').text() == 'conf.attack.knowledge.close'){
							sessionStorage.setItem('qAndACloseValue',$(this).parents('tr').find('td:eq(1) input').val());
						}
						if($(this).parents('tr').find("tr").find('td:eq(0)').text() == 'switch.learnque.third.knowledge'){
							sessionStorage.setItem('thirdKnowledgeSystem',$(this).parents('tr').find('td:eq(1) input').val());
						}
						/*
							 taskId=490 黄世鹏
							 原因：聊天记录导出
						*/
						if($(this).parents('tr').find("tr").find('td:eq(0)').text() == 'switch.chatlog.export.show'){
							sessionStorage.setItem('chatLogExportShow',$(this).parents('tr').find('td:eq(1) input').val());
						}
					});
					//删除
					$(".fm_del").on('click',function(){
						var that=this;
						$(this).adcCreator(function(){
							request(that,'../../configMode/deleteByCode',ParametersPage);
						})

					});
					//恢复默认设置
					$(".fm_reset").on('click',function(){
						request(this,'../../configMode/findByCode',ParametersPage);
					});
					//下面开始处理分页
					var options = {
						data: [data, 'List', 'total'],
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function(event, originalEvent, type, page) {
							ParametersPage(page);
						}
					};
					setPage('Parameterspage', options);
				} else {
					$('#Parameterslist').find('tbody').html('<tr><td colspan=\"4\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-sign\"></i>当前纪录为空！</td></tr>');
					$('#Parameterspage').html('');
				}
			} else {
				yunNoty(data);
			}
		}
	});
}

//添加
function addParameters() {
	if ($('#name').val() === "") {
		yunNotyError('参数名不能为空！！！');
		return;
	}
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../configMode/addConfigMode'),
		data: $("#pm_add").serialize(),
		success: function(data) {
			if (data.status === 0) {
				yunNoty(data);
				listCurrentPage(ParametersPage,'Parameterspage');
        $('#name').val('');
			} else {
				yunNoty(data);
			}
		}
	});
}

//应用配置
function configuration() {
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../configMode/reloadSysConfig'),
		success: function(data) {
			if (data.status === 0) {
				yunNoty(data);
				listCurrentPage(ParametersPage,'Parameterspage');
			} else {
				yunNoty(data);
			}
		}
	});
}
/***************************parameterList END***********************/
/*************************修改**************/
$('body').on('click', '.m-edi', function() {
	var aaa=$(this).parents('tr');
	$('#ediModal [name=title]').val(aaa.find('td').eq(0).html());
	$('#ediModal [name=keyWords]').val(aaa.find('td').eq(1).html());
	$('#ediModal [name=cId]').val(aaa.find('td').eq(0).attr('cid'));
	var statusValue = aaa.find('td').eq(2).html();
	if(statusValue=='不发表'){
		$('#ediModal .status input[value=0]').iCheck('check');
	}else{
		$('#ediModal .status input[value=1]').iCheck('check');
	}
	var statusNews = aaa.find('td').eq(3).html();
	if(statusNews=='新闻'){
		$('#ediModal .news input[value=0]').iCheck('check');
	}else if(statusNews=='产品动态'){
		$('#ediModal .news input[value=1]').iCheck('check');
	}else if(statusNews=='行业分析'){
		$('#ediModal .news input[value=2]').iCheck('check');
	}else if(statusNews=='通知'){
		$('#ediModal .news input[value=3]').iCheck('check');
	}
	$('#ediModal input[name=id]').val(aaa.attr('id'));
	UE.getEditor('contAfter').setContent($(this).siblings('input').val());
	$('#ediModal').modal('show');
	$.ajax({
		url:"../../classes/listClasses?m=0",
		type:'post',
		datatype:'json',
		cache:false,//不从缓存中去数据
		success:function(data){
			for(var i=0;i<data.list.length;i++){
				if(data.list[i].Id==aaa.attr("groupid")){					
					$('#ediModal [name=groupName]').val(data.list[i].Name);	
					$('#ediModal [name=groupId]').val(data.list[i].Id);
				}
			}
		}
	})
});
