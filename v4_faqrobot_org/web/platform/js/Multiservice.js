//同步多客服人员和聊天记录
function synchronous(url, params, fun) {
	if (!url) return;
	if (!params) params = '';
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		url: encodeURI(url),
		data: 'wxId=' + $('.wxId').val() + '&' + params,
		success: function(data) {
			if (data.status == 0) {
				yunNoty(data);
				if (typeof fun == 'function') {
					fun();
				}
			} else {
				yunNoty(data);
			}
		}
	});
}
//获取客服人员列表
function dkfList(pageNo, wxId) {
	if (!pageNo) pageNo = 1;
	$('#dkfList').find('tbody').html('<tr><td colspan=\"2\" style=\"text-align:center;\"><img src=\"../common/images/ajax_loader.gif\"></td></tr>');
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		url: encodeURI('../../Dkf/getKfUsers?pageSize=' + 2 + '&pageNo=' + pageNo),
		data: 'wxId=' + wxId,
		success: function(data) {
			if (data.status == 0) {
				var s = []; //暂时存储html代码
				if (data.list.length > 0) {
					for (var i = 0; i < data.list.length; i++) {
						s.push('<tr>');
						s.push('<td>' + data.list[i].Name + '</td>');
						s.push('<td >' + data.list[i].DateTime + '</td>');
						s.push('</tr>');
					}
					$('#dkfList').find('tbody').html(s.join(''));
					//下面开始处理分页
					var options = {
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						alignment: "right",
						onPageClicked: function(event, originalEvent, type, page) {
							dkfchatRecord(page, wxId);
						}
					};
					setPage('dkfpageList',options);
				} else {
					$('#dkfList').find('tbody').html('<tr><td colspan=\"2\" style=\"text-align:center;\">当前纪录为空！</td></tr>');
					$('#dkfpageList').html('');
				}
			} else {
				yunNoty(data);
			}
		}
	})
}
//获取客服聊天记录
function dkfchatRecord(pageNo, wxId) {
	if (!pageNo) pageNo = 1;
	$('#dkfChatTab').find('tbody').html('<tr><td colspan=\"5\" style=\"text-align:center;\"><img src=\"../common/images/ajax_loader.gif\"></td></tr>');
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		url: encodeURI('../../Dkf/getRecordList?pageSize=' + 10 + '&pageNo=' + pageNo),
		data: 'wxId=' + wxId,
		success: function(data) {
			if (data.status == 0) {
				var s = []; //暂时存储html代码
				if (data.list.length > 0) {
					for (var i = 0; i < data.list.length; i++) {
						s.push('<tr>');
						s.push('<td>' + data.list[i].Worker + '</td>');
						s.push('<td>' + data.list[i].Openid + '</td>');
						var operCode = data.list[i].Opercode == 2002 ? '客服发送': '客户收到';
						s.push('<td>' + operCode + '</td>');
						s.push('<td>' + data.list[i].Text + '</td>');
						s.push('<td>' + data.list[i].Time + '</td>');
						s.push('</tr>');
					}
					$('#dkfChatTab').find('tbody').html(s.join(''));
					//下面开始处理分页
					var options = {
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						alignment: "right",
						onPageClicked: function(event, originalEvent, type, page) {
							dkfchatRecord(page, wxId);
						}
					};
					setPage('dkfrecord',options);
				} else {
					$('#dkfChatTab').find('tbody').html('<tr><td colspan=\"5\" style=\"text-align:center;\">当前纪录为空！</td></tr>');
					$('#dkfrecord').html('');
				}
			} else {
				yunNoty(data);
			}
		}
	})
}
//同步多客服和多客服消息
$('#sysDkf').click(function() {
	synchronous('../../Dkf/doSyncKflist', '',
	function() {
		dkfList(1, $('.wxId').val());
	});
});

$('#sysRecords').click(function() {
	synchronous('../../Dkf/doSyncKfRecord', '',
	function() {
		dkfchatRecord(1, $('.wxId').val());
	});
})
//开启同步客服人员开关
$('input[id="switch-kf"]').on('switchChange.bootstrapSwitch',
function(event, state) {
	if (state == false) {
		synchronous('../../Dkf/turnOnKfList', 'turnOn=0')
	} else if (state == true) {
		synchronous('../../Dkf/turnOnKfList', 'turnOn=1')
	}
});
//开启同步客服聊天记录开关
$('input[id="switch-kfmsg"]').on('switchChange.bootstrapSwitch',
function(event, state) {
	if (state == false) {
		synchronous('../../Dkf/turnOnKfRecord', 'turnOn=0')
	} else if (state == true) {
		synchronous('../../Dkf/turnOnKfRecord', 'turnOn=1')
	}
});
//微信号列表
function wxlist() {
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../wxConfig/listWxConfig'),
		success: function(data) {
			if (data.status == 0) {
				getsysNum();
				var html = '';
				html += '<select class="selectpicker">';

				if (data.list.length > 0) {
					$('.wxId').val(data.list[0].Id);
					$('.kfBtn').val(data.list[0].Kflist);
					$('.kfrBtn').val(data.list[0].Kfrecord);
					switchkfBtn(data.list[0].Kflist);
					switchkfRBtn(data.list[0].Kfrecord);
					dkfchatRecord(1, data.list[0].Id);
					dkfList(1, data.list[0].Id);
					for (var i = 0; i < data.list.length; i++) {
						if (data.list[i].AppId == null) {

						} else {
							var zzhName = data.list[i].Name == null ? '未知公众号名称': data.list[i].Name;
							html += '<option value="' + data.list[i].Id + '" rel="' + data.list[i].Kfrecord + '"  kf="' + data.list[i].Kflist + '">' + zzhName + '</option>';
						}
					}
				}
				html += '</select>';
				$('#wxh').html(html);
				//下拉列表
				$('.selectpicker').selectpicker({
					style: 'btn-navbar',
					size: 10,
					//width: '80%',
				});
			} else {
				yunNoty(data);
			}
		}
	})
}
//根据微信号渲染已有菜单信息
$('#wxh').on('change', 'select',
function() {
	if ($(this).val() == '') {
		return;
	} else {
		$('.wxId').val($(this).val());
		//dkfchatRecord(1,$(this).val());
		dkfList(1, $(this).val());
	}
	var kf = $(this).find('option[value=' + $(this).val() + ']').attr('kf');
	var kfr = $(this).find('option[value=' + $(this).val() + ']').attr('rel');
	$('.kfBtn').val(kf);
	$('.kfrBtn').val(kfr);
	switchkfBtn(kf);
	switchkfRBtn(kfr);
})

//显示相应的开关按钮
function switchkfBtn(value) {
	if (value == 1) {
		$('#switch-kf').bootstrapSwitch('state', true, true);
	} else if (value == 0) {
		$('#switch-kf').bootstrapSwitch('state', false, false);
	}
}
function switchkfRBtn(value) {
	if (value == 1) {
		$('#switch-kfmsg').bootstrapSwitch('state', true, true);
	} else if (value == 0) {
		$('#switch-kfmsg').bootstrapSwitch('state', false, false);
	}
}
//获取sysNum值
function getsysNum() {
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		url: encodeURI('../../user/getLoginUser'),
		success: function(data) {
			if (data.status == 0) {
				$('#sysNumSpan').text(data.webConfig.SysNum);
			}
		}
	});
}