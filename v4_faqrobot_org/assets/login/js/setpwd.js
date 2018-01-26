//检测密码安全性
jQuery.validator.addMethod("isSave",
function(pw, element) {
	if (pw.length < 5) return false;
	var c = 0;
	if (/[a-z]+/.test(pw)) c++;
	if (/[A-Z]+/.test(pw)) c++;
	if (/[0-9]+/.test(pw)) c++;
	if (/[^a-zA-Z0-9]+/.test(pw)) c++;
	if (c < 2) {
		var s = "0123456789abcdefghigklmnopqrstuvwxyz";
		var arr = pw.toLowerCase().split('');
		var idx = s.indexOf(arr[0]);
		if (idx > -1) {
			var arr2 = s.split('');
			for (var i = 0; i < arr.length; i++) {
				if (idx + 1 >= arr2.length || arr[i] != arr2[idx + i]) {
					c++;
					break;
				}
			}
		}
	}
	if (c > 1) {
		if (pw.length > 7) c++;
		if (/[^a-zA-Z0-9]+/.test(pw)) c++;
	}
	if (pw.replace(/(.)\1+/, "").length == 0) {
		c = 1;
	}
	if (c > 4) c = 4;
	if (c <= 1) {
		return false;
	} else {
		return true;
	}
},
"密码安全太低，请重设！");

//表单验证
var validator = $('#findPwd').validate({
	rules: {
		passWord: {
			required: true,
			isSave: true
		},
		check_password: {
			required: true,
			equalTo: "#passWord"
		}
	},
	messages: {
		passWord: {
			required: '请输入密码！'
		},
		check_password: {
			required: '请再次输入密码！',
			equalTo: '两次输入的密码不一致！'
		}
	}
});

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

$(document).ready(function() {
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,
		url:encodeURI('findPwd/setPwd?key='+getUrlParam('key')),
		success:
		function(data){
			if(data.status==0){
				$('#loading').hide();
				$('#NewPwd').show();
			}else{
				$('#failedM').html(data.message);
				$('#loading').hide();
				$('#failed').show();
			}
		}
	});
	//键盘事件
	$('#telNum_by_Tel').on('keyup', function(e) {
		if(e.keyCode == 13) {
			checkTel();
		}
	});
});

//修改密码
var flag_resetByTel = false;
function resetPwd_tel() {
	//验证两次输入是否一致
	if(validator.element( "#passWord" ) === false) {
		return false;
	} else if(validator.element( "#check_password" ) === false) {
		return false;
	}
	if(flag_resetByTel) return;
	flag_resetByTel = true;
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('findPwd/doResetPwd'),
		data: 'passWord=' + $('#passWord').val(),
		success: function(data) {
			flag_resetByTel = false;
			if (data.status == 0) {
				//显示成功页面
				$('#NewPwd').hide();
				$('#reSuccess').show();
				settimelogin();
			} else {
				yunNoty(data);
			}
		}
	});
}

//倒计时
var countdown2 = 3;
function settimelogin() {
	if (countdown2 == 0) {
		location.href = "login.html";
	} else {
		$('#autoCount').html(countdown2 + "s");
		countdown2--;
	}
	setTimeout(function() {
		settimelogin();
	},
	1000)
}