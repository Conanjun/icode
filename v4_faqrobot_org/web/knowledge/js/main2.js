$(function() {
	// 收起
	$('body').on('click', '.closeIt', function() {
		$(this).removeClass('closeIt').addClass('openIt');
		$(this).children().removeClass('glyphicon-chevron-left').addClass('glyphicon-chevron-right');
		$(this).css('left', '-12px');
		$('.toShow').hide();
		$('.toHide').removeClass('col-md-10').addClass('col-md-12').css('padding-left', '0');
	});
	// 展开
	$('body').on('click', '.openIt', function() {
		$(this).removeClass('openIt').addClass('closeIt');
		$(this).children().removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-left');
		$(this).css('left', '16.7%');
		$('.toShow').show();
		$('.toHide').removeClass('col-md-12').addClass('col-md-10').css('padding-left', '15px');
	});

	// 新手引导(需要引导的页面的code即为页面名称)
	// 问答总览-queView 添加问题-addQuestion 创建流程-addFlow 问题分类-classify 问题导入-importQuestion 机器人设置-robot 机器人页面设置-payCode 流程详细-editFlow
	//增加code
	Base.request({
		url: 'tipHelp/add',
		params: {
			code: 'queView',
			webId: -1,
		},
		callback: function(data) {
			if(data.status) {//!=0 旧
				// 新手引导(需要引导的页面的code即为页面名称)
					  
			}else {//=0 新
				Base.request({
					url: 'tipHelp/check',
					params: {
						  code: 'queView',
						  webId: -1,
					},
					callback: function(data) {
						  if (data.status) { //旧
						  } else { //新
							introJs().setOptions({
							  'prevLabel': '上一步',
							  'nextLabel': '下一步',
							  'skipLabel': '　',
							  'doneLabel': '　',
							  'showBullets': false, //隐藏直接跳转按钮(避免onchangebug)
							}).start().onexit(function() { //非常规退出
							}).oncomplete(function() { //正常完成
							}).onchange(function(obj) { //已完成当前一步
							  var curNum = parseInt($(obj).attr('data-step').match(/\d+/)[0]); //当前的下标
					
							  $('.tipStep' + (curNum - 1)).hide(); //隐藏前一个
							  $('.tipStep' + (curNum + 1)).hide(); //隐藏后一个
							  $(obj).show(); //显示当前
							});
						  }
					},
					  });
			}
		},
	});

	/*//删除code
    Base.request({
        url: 'tipHelp/del',
        params: {
            code: 'artiMonitorHelp',
            webId: -1,
        },
        callback: function(data) {
            
        },
    });*/
});