
$(function() {
	// 收起
	$('.closeIt').on('click', function() {
		$('.toShow').css('height', 26);
		$('.toHide').removeClass('col-md-10').addClass('col-md-12').css('padding-left', '0');
	});
	// 展开
	$('.openIt').on('click', function() {
		$('.toShow').css('height', 'auto');
		$('.toHide').removeClass('col-md-12').addClass('col-md-10').css('padding-left', '15px');
	});
	if ($().datetimepicker) {
		$('.form_datetime').datetimepicker({
			language: 'zh-CN',
			format: 'yyyy-mm-dd hh:ii',
			autoclose: true,
			todayBtn: true,
			minuteStep: 10,
			initialDate: new Date(),
			zIndex: 1500
		});
	}
	// 剩余字数统计
	$('#modal-dialog [name=word]').addWordCount(100);
});
