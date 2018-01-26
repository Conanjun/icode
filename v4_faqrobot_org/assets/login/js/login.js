//表单验证
var validator = $('#loginForm').validate({
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

$(document).ready(function() {
    //区分当前站点是否是单点
	if(window.location.host != 'v3.faqrobot.org') {
	  $('.footer .container').addClass('hide');
	  $('.header .navbar-right').addClass('hide');
	  $('.plus').addClass('hide');
	  $('.topRight').addClass('hide');
	}
	
	// ie8以下不给登录
    if(Base.ieVersion()<=8) {
    	$('.ieTip').show();

    	$('.ieTipCtn').animate({
    		'marginTop': -390
    	}, {
    		duration: 1500,
    		easing: 'easeOutBounce',
    	});
    	
    	return false;
    }

    autoLogin();


	//图片验证码
	$('.vcodeImg').on('click', function() {
		$(this).attr({'src': './ImageCode?'+Math.random()});
	});
	$('#passWord').add('#code').on('keyup', function(e) {
		if(e.keyCode == 13) {
			$('#loginForm').submit();
		}
	});
	
	$('#changePasswd').on('click', function() {
		if($(this).hasClass('fa-eye')) {
			$(this).addClass('fa-eye-slash');
			$(this).removeClass('fa-eye');
			$('#passWord').val($('#passWordShow').val());
			$('#passWord').show();
			$('#passWordShow').hide();
			validator.resetForm();
			validator.element("#passWord");
		} else {
			$(this).addClass('fa-eye');
			$(this).removeClass('fa-eye-slash');
			$('#passWordShow').val($('#passWord').val());
			$('#passWordShow').show();
			$('#passWord').hide();
			validator.resetForm();
			validator.element("#passWordShow");
		}
	});
	$('#passWord').on('blur keyup', function() {
		$('#passWordShow').val($('#passWord').val());
	});
	$('#passWordShow').on('blur keyup', function() {
		$('#passWord').val($('#passWordShow').val());
	});

});

//登录
var flag_login = false;
var loginCount = 0;
function login() {
	if(Cookies.get('loginCount') === undefined || isNaN(Cookies.get('loginCount'))) {
		loginCount = 0;
	} else {
		loginCount = +Cookies.get('loginCount');
	}
	//后台验证
	if(loginCount >= 5) {
		yunNoty({
			message: '您当前输入错误次数过多，请5分钟后再来登录...',
			status: '1'
		});
		var date = new Date();
		date.setTime(date.getTime()+5*60*1000);
		Cookies.set('loginCount', ++loginCount, { expires: date });
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
					username = $('#userName').val(),
					epwd = $('#passWord').val(),
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
                            var Subdomain = '/' + window.top.location.pathname.split('/')[1];//子域名
                            if(Subdomain.indexOf('.html')>-1){  //如果没有子域名
                                Subdomain = "";
                            }
                            //存入Session Storage
                            localStorage.setItem('Subdomain',Subdomain);

							window.location.href = (localStorage.getItem('Subdomain')||"") + "/index.html";
						} else {
							var date = new Date();
							date.setTime(date.getTime()+30*60*1000);
							//统计当天输入错误次数
							Cookies.set('loginCount', ++loginCount, { expires: date });
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

//自动登录
function autoLogin() {
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		url: encodeURI('user/isLogin'),
		success: function(data) {
			if (data.status == 0) {
                var Subdomain = '/' + window.top.location.pathname.split('/')[1];//子域名
                if(Subdomain.indexOf('.html')>-1){  //如果没有子域名
                    Subdomain = "";
                }
                //存入Session Storage
                localStorage.setItem('Subdomain',Subdomain);
                window.location.href = (localStorage.getItem('Subdomain')||"") + "/index.html";
			}
		}
	});
}