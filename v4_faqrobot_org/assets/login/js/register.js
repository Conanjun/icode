//检测用户名是否正确
$.validator.addMethod("isUserName",
function(value, element) {
	var reg = /^[a-zA-Z][a-zA-Z0-9_]{4,14}$/;
	return this.optional(element) || reg.test(value);
},
"用户名为字母、数字或下划线组合，首字符必须为字母，长度在5-15位之间！");

//检测手机号是否正确
$.validator.addMethod("isMobile",
function(value, element) {
	var length = value.length;
	var regPhone = /^1([3578]\d|4[57])\d{8}$/;
	return this.optional(element) || (length == 11 && regPhone.test(value));
},
"请正确填写您的手机号码！");

//检测密码安全性
$.validator.addMethod("isSave",
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

//检测用户名与密码
$.validator.addMethod("NotEqualTo",
function(value, element) {
	if (value == $('#userName').val()) return false;
	else return true;
},
"密码不能和用户名一致！");

$.validator.addMethod("uniqueUserName", function(value, element) {
	var isSuccess = false;
	$.ajax({
		type: 'POST',
		url: 'reg/isValidUserName',
		data: 'userName='+value,
		async: false,
		dataType: 'json',
		success: function(data){
			if(data.status === 0)
				isSuccess = true;
		}
	});
	return isSuccess;
}, "用户名已存在！");

$.validator.addMethod("uniqueEmail", function(value, element) {
	var isSuccess = false;
	$.ajax({
		type: 'POST',
		url: 'reg/isValidEmail',
		data: 'email='+value,
		async: false,
		dataType: 'json',
		success: function(data){
			if(data.status === 0)
				isSuccess = true;
		}
	});
	return isSuccess;
}, "该邮箱已被注册！");

//表单验证
var validator = $('#register').validate({
	rules: {
		userName: {
			required: true,
			isUserName: true,
			uniqueUserName: true
		},
		telNum: {
			required: true,
			isMobile: true
		},
		telVerifyCode: {
			required: true,
			number: true,
			maxlength: 6,
			minlength: 6
		},
		passWord: {
			required: true,
			isSave: true,
			NotEqualTo: true
		},
		passWordagain: {
			equalTo: '#passWord'
		},
		email: {
			required: true,
			email: true,
			uniqueEmail: true
		},
		company: {
			required: true
		}
	},
	messages: {
		userName: {
			required: '请输入用户名！',
			isUserName: '用户名至少5位字母、数字或下划线组合，首字符必须为字母！',
			uniqueUserName: '用户名已存在！'
		},
		telNum: {
			required: '请输入手机号！',
			isMobile: '请输入正确的手机号！'
		},
		telVerifyCode: {
			required: '请输入验证码！',
			number: '请输入正确的验证码！',
			maxlength: '请输入正确的验证码！',
			minlength: '请输入正确的验证码！'
		},
		passWord: {
			required: '请输入密码！',
			isSave: '密码安全太低，请重设！',
			NotEqualTo: '密码不能和用户名一致！'
		},
		passWordagain: {
      equalTo: '两次输入的密码不一致！'
		},
		email: {
			required: '请输入邮箱！',
			email: '请输入正确的邮箱！'
		},
		company: {
			required: '请输入公司名称！'
		}
	},
	submitHandler: register
});

//注册
var flag_add = false;
function register() {
	$('.done').hide();
	$('.REGing').show();
	if (flag_add) {
		return;
	}
	flag_add = true;
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('Reg/doRegByTel'),
		data: $("#register").serialize(),
		success: function(data) {
			flag_add = false;
			if (data.status == 0) {
				//location.href = "getreset.html";
				$('.REG_container4').hide();
				$('.REG_circle_2').removeClass('BG_Blue');
				$('.REG_circle_2').addClass('BG_Grey');
				$('.REG_circle_3').removeClass('BG_Grey');
				$('.REG_circle_3').addClass('BG_Blue');
				$('.REG_word_2').removeClass('Color_Blue');
				$('.REG_word_2').addClass('Color_Grey');
				$('.REG_word_3').removeClass('Color_Grey');
				$('.REG_word_3').addClass('Color_Blue');
				$('.REG_container5').show();
				//settimelogin();
			} else {
				$('.done').show();
				$('.REGing').hide();
				yunNoty(data);
			}
		}
	});
}

//[下一步]按钮
function checkStep1() {
	if(validator.element( "#userName" ) === false) {
		return false;
	} else if(validator.element( "#passWord" ) === false) {
		return false;
	} else if(validator.element( "#passWordagain" ) === false) {
		return false;
	}
  return true;
}
function goNext() {
  if(!checkStep1()){
    return false;
  }
	if($('#agreement').prop('checked') == false) {
		yunNotyError('您未同意并接受《云问科技服务条款》！');
		return false;
	}
	clickTwo();
}

//点‘2’
function clickTwo() {
	$('.REG_container3').hide();
	$('.REG_circle_1').removeClass('BG_Blue');
	$('.REG_circle_1').addClass('BG_Grey');
	$('.REG_circle_2').removeClass('BG_Grey');
	$('.REG_circle_2').addClass('BG_Blue');
	$('.REG_word_1').removeClass('Color_Blue');
	$('.REG_word_1').addClass('Color_Grey');
	$('.REG_word_2').removeClass('Color_Grey');
	$('.REG_word_2').addClass('Color_Blue');
	$('.REG_container4').show();
  $('.REG_container5').hide();
}

//点‘1’
function clickOne() {
	$('.REG_container4').hide();
	$('.REG_circle_2').removeClass('BG_Blue');
	$('.REG_circle_2').addClass('BG_Grey');
	$('.REG_circle_1').removeClass('BG_Grey');
	$('.REG_circle_1').addClass('BG_Blue');
	$('.REG_word_2').removeClass('Color_Blue');
	$('.REG_word_2').addClass('Color_Grey');
	$('.REG_word_1').removeClass('Color_Grey');
	$('.REG_word_1').addClass('Color_Blue');
	$('.REG_container3').show();
  $('.REG_container5').hide();
}

var flag_code = false;
//获取手机验证码
function getTelCode(obj) {
	var telNum = $('#telNum').val();
	var regPhone = /^1([3578]\d|4[57])\d{8}$/;
	if (!regPhone.test(telNum)) return false;
	if (flag_code) return;
	flag_code = true;
	$('#telNum').attr('readonly', true);
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('Reg/sendTelcode'),
		data: 'telNum=' + telNum,
		success: function(data) {
			flag_code = false;
			if (data.status == 0) {
				settime($('#register .getcode'));
			} else {
				$('#telNum').attr('readonly', false);
				if (data.message == '该手机号已注册') {
					validator.showErrors({
						"telNum": "该手机号已注册！"
					});
				}
				yunNoty(data);
			}
		}
	});
}

//倒计时
var countdown1 = 300;
function settime(obj) {
	if (countdown1 == 0) {
		obj.attr("disabled", false);
		obj.html("再次发送验证码");
		obj.removeAttr('style');
		countdown1 = 300;
		return;
	} else {
		obj.attr("disabled", true);
		obj.css('background-color', '#ccc');
		obj.css('border-color', '#ccc');
		if (countdown1 < 10) {
			countdown1 = '0' + countdown1;
		}
		obj.html("重新发送(" + countdown1 + ")");
		countdown1--;
	}
	setTimeout(function() {
		settime(obj)
	},
	1000)
}

//倒计时
var countdown2 = 5;
function settimelogin() {
	if (countdown2 == 0) {
		location.href = "index.html";
	} else {
		$('#autoCount').html(countdown2 + "s");
		countdown2--;
	}
	setTimeout(function() {
		settimelogin();
	},
	1000)
}

function checkStep2() {
	if($('#userName').val() != '') {
		return false;
	} else if($('#passWord').val() != '') {
		return false;
	} else if($('#passWordagain').val() != '') {
		return false;
	}
  return true;
}
$(document).ready(function() {
	//图片验证码
    if(window.location.host != 'v3.faqrobot.org') {
	  $('.topRight').addClass('hide');
	}
	$('.vcodeImg').on('click', function() {
		$(this).attr({'src': '/ImageCode?'+Math.random()});
	});
	$('#passWord').add('#code').on('keyup', function(e) {
		if(e.keyCode == 13) {
			$('#loginForm').submit();
		}
	});
  $('#userName').on('focus', function(){
    $('.s1').hide().eq(0).show();
  });
  $('#passWord').on('focus', function(){
    $('.s1').hide().eq(1).show();
  });
  $('#passWordagain').on('focus', function(){
    $('.s1').hide().eq(2).show();
  });
  $('#email').on('focus', function(){
    $('.s2').hide().eq(0).show();
  });
  $('#company').on('focus', function(){
    $('.s2').hide().eq(1).show();
  });
  $('#telNum').on('focus', function(){
    $('.s2').hide().eq(2).show();
  });
  $('#telVerifyCode').on('focus', function(){
    $('.s2').hide().eq(3).show();
  });
  var ggggg = setInterval(function(){
    if(checkStep2()) {
      $('#gogogo').attr('onclick', 'goNext()');
      $('#gogogo').removeAttr('style');
      $('#gogogo').removeClass('disabled');
      clearInterval(ggggg);
    }
  }, 500);
});

//表单验证
var validator2 = $('#loginForm').validate({
	rules: {
		un: {
			required: true,
			minlength: 3
		},
		code: {
			required: true,
			maxlength: 4,
			minlength: 4
		},
		pwd: {
			required: true
		}
	},
	messages: {
		un: {
			required: '请输入用户名！',
			minlength: '请输入正确的用户名！'
		},
		code: {
			required: '请输入图形验证码！',
			maxlength: '请输入正确的图形验证码！',
			minlength: '请输入正确的图形验证码！'
		},
		pwd: {
			required: '请输入密码！'
		}
	},
    submitHandler: login
});

//登录
var flag_login = false;
var loginCount = 0;
function login() {
	if($.cookie('loginCount') === undefined || isNaN($.cookie('loginCount'))) {
		loginCount = 0;
	} else {
		loginCount = +$.cookie('loginCount');
	}
	//后台验证
	if(loginCount >= 5) {
		yunNoty({
			message: '您当前输入错误次数过多，请半小时后再来登录...',
			status: '1'
		});
		var date = new Date();
		date.setTime(date.getTime()+30*60*1000);
		$.cookie('loginCount', ++loginCount, {expires: date});
	}else {
		if(flag_login) return;
		flag_login = true;
		$.ajax({
		  type: 'post',
		  cache: false,
		  url: 'login/keyPair',
		  dataType: 'json',
		  success: function(data) {
			  if(data.status) {
				  if(data.status !== 0) {
					yunNoty(data);
					return;
				  }
			  }
				var modulus = data.Modulus,
					exponent = data.Exponent,
					username = $('#userNamel').val(),
					epwd = $('#passWordl').val(),
					un = null,
					pwd = null;
				if (username.length != 256) {
					var publicKey = RSAUtils.getKeyPair(exponent, '', modulus);
					un = RSAUtils.encryptedString(publicKey, username);
				}
				if (epwd.length != 256) {
					var publicKey = RSAUtils.getKeyPair(exponent, '', modulus);
					pwd = RSAUtils.encryptedString(publicKey, epwd);
				}
				dataJson = {
					un: un,
					pwd: pwd,
					code: $('#code').val()
				}
				if($('#autoLogin').prop('checked')) {
					dataJson.saveFlag = true;
				}
				$.ajax({
					type: 'post',
					datatype: 'json',
					cache: false,
					url: encodeURI('login/login'),
					//data: $('#loginForm').serialize(),
					data: dataJson,
					success: function(data) {
						flag_login = false;
						if (data.status == 0) {
							window.location.href = "/index.html";
						} else {
							var date = new Date();
							date.setTime(date.getTime()+30*60*1000);
							$.cookie('loginCount', ++loginCount, {expires: date});//统计当天输入错误次数
							if(data.showCode) {
								$('#code').removeClass('hide');
								$('.vcodeImg').removeClass('hide');
							}
							yunNoty(data);
							$('.vcodeImg').trigger('click');
						}
					}
				});
			}
		});
	}
}