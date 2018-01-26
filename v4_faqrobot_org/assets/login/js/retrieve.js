//检测用户名是否正确
jQuery.validator.addMethod("isUserName",
function(value, element) {
	var reg = /^[a-zA-Z][a-zA-Z0-9_]{4,14}$/;
	return this.optional(element) || reg.test(value);
},
"用户名至少5位字母、数字或下划线组合，首字符必须为字母！");

//检测手机号是否正确
jQuery.validator.addMethod("isMobile",
function(value, element) {
	var length = value.length;
	var regPhone = /^1([3578]\d|4[57])\d{8}$/;
	return this.optional(element) || (length == 11 && regPhone.test(value));
},
"请正确填写您的手机号码！");

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

//检测用户名与密码
jQuery.validator.addMethod("NotEqualTo",
function(value, element) {
	if (value == $('#userName').val()) return false;
	else return true;
},
"密码不能和用户名一致！");

//表单验证
var validator = $('#findPwd').validate({
	rules: {
		userName: {
			required: true,
			isUserName: true
		},
		telNum_by_Tel: {
			required: true,
			isMobile: true
		},
		code_by_Tel: {
			required: true,
			maxlength: 4,
			minlength: 4
		},
		telVerifyCode_by_Tel: {
			required: true,
			number: true,
			maxlength: 6,
			minlength: 6
		},
    email_by_Name: {
      required: true,
      email: true
    },
		passWord: {
			required: true,
			isSave: true,
			NotEqualTo: true
		},
		check_password: {
			required: true,
			equalTo: "#passWord"
		}
	},
	messages: {
		userName: {
			required: '请输入用户名！'
		},
		telNum_by_Tel: {
			required: '请输入手机号！'
		},
		code_by_Tel: {
			required: '请输入图形验证码！',
			maxlength: '请输入正确的图形验证码！',
			minlength: '请输入正确的图形验证码！'
		},
		telVerifyCode_by_Tel: {
			required: '请输入验证码！',
			number: '请输入正确的验证码！',
			maxlength: '请输入正确的验证码！',
			minlength: '请输入正确的验证码！'
		},
    email_by_Name: {
      required: '请输入邮箱地址！',
      email: '请输入正确的邮箱地址！'
    },
		passWord: {
			required: '请输入密码！',
			NotEqualTo: '密码不能和用户名一致！'
		},
		check_password: {
			required: '请再次输入密码！',
			equalTo: '两次输入的密码不一致！'
		}
	}
});

$(document).ready(function() {
    // var winH = $(window).height();
    // if (winH < 635) {
        // $('.REG_end').css('position', 'static');
    // } else {
        // $('.REG_end').css('position', 'fixed');
    // }
	//键盘事件
	$('#telNum_by_Tel').on('keyup', function(e) {
		if(e.keyCode == 13) {
			checkTel();
		}
	});
	// $('#userName').on('keyup', function(e) {
		// if(e.keyCode == 13) {
			// checkName();
		// }
	// });
	// $('#code_by_Name').on('keyup', function(e) {
		// if(e.keyCode == 13) {
			// checkName();
		// }
	// });
	//图片验证码
	$('.vcodeImg').on('click', function() {
		$(this).attr({'src': '/ImageCode?'+Math.random()});
	});
	// $(window).on('resize.MN', function() {
		// var winH = $(window).height();
		// if (winH < 635) {
			// $('.REG_end').css('position', 'static');
		// } else {
			// $('.REG_end').css('position', 'fixed');
		// }
	// });
});

//根据手机号找回_验证手机号/提交验证码
var flag_Tel1 = false;
var flag_Tel2 = false;
var checkTel_Username = '';
function checkTel() {
	if ($('#Pwd_by_Tel_2').css('display') == 'none') {
		//提交验证手机号
		if(validator.element( "#telNum_by_Tel" ) === false) {
			return false;
		}
		if (flag_Tel1) return;
		flag_Tel1 = true;
		$.ajax({
			type: 'post',
			datatype: 'json',
			cache: false,
			//不从缓存中去数据
			url: encodeURI('FindPwd/checkTelNum'),
			data: 'telNum=' + $('#telNum_by_Tel').val(),
			success: function(data) {
				flag_Tel1 = false;
				if (data.status == 0) {
					$('#telNum_by_Tel').attr("readonly","readonly");
					$('#Pwd_by_Tel_2').show();
					$('#Pwd_by_Tel_3').show();
					checkTel_Username = data.userName;
				} else {
					if (data.message != "") {
						validator.showErrors({
							"telNum_by_Tel": data.message
						});
					}
					//yunNoty(data);
				}
			}
		});
	} else {
		if(validator.element( "#code_by_Tel" ) === false) {
			return false;
		} else if(validator.element( "#telVerifyCode_by_Tel" ) === false) {
			return false;
		}
		//提交验证码
		if (flag_Tel2) return;
		flag_Tel2 = true;
		$.ajax({
			type: 'post',
			datatype: 'json',
			cache: false,
			//不从缓存中去数据
			url: encodeURI('FindPwd/verifyCodeByPhone'),
			data: {
				telNum: $('#telNum_by_Tel').val(),
				code: $('#telVerifyCode_by_Tel').val()
			},
			success: function(data) {
				flag_Tel2 = false;
				if (data.status == 0) {
					$('#Pwd_top').hide();
					$('#Pwd_by_Tel').hide();
					$('#NewPwd').show();
				} else {
					yunNoty(data);
				}
			}
		});
	}
}

var flag_code = false;
//获取手机验证码 手机号
function getTelCode(obj) {
	if (flag_code) return;
	flag_code = true;
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('FindPwd/sendTelcode'),
		data: 'code=' + $('#code_by_Tel').val() + '&userName=' + checkTel_Username,
		success: function(data) {
			flag_code = false;
			if (data.status == 0) {
				settime($('#getcode_by_Tel'));
			} else {
				yunNoty(data);
			}
		}
	});
}

//根据手机号找回_修改密码
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
		url: encodeURI('FindPwd/forgetPwdByTel'),
		data: 'pwd=' + $('#passWord').val(),
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

//根据用户名找回_验证手机号/提交验证码
var flag_Name1 = false;
var flag_Name2 = false;
function checkName() {
	if ($('#telNum_by_Name').css('display') == 'none' && $('#email_by_Name').css('display') == 'none') {
		//提交验证用户名
		if(validator.element( "#userName" ) === false) {
			return false;
		}
		if (flag_Name1) return;
		flag_Name1 = true;
		$.ajax({
			type: 'post',
			datatype: 'json',
			cache: false,
			//不从缓存中去数据
			url: encodeURI('FindPwd/checkUserName'),
			data: 'userName=' + $('#userName').val(),
			success: function(data) {
				flag_Name1 = false;
				if (data.status == 0) {
					$('#userName').attr("readonly","readonly");
					if(data.telNum != null) {
						$('#telNum_by_Name').show();
						$('#Pwd_by_Name_3').show();
						$('#Pwd_by_Name_4').show();
						$('#telNum_by_Name').val(data.telNum);
					} else if(data.email != null) {
						$('#email_by_Name').show();
						$('#Pwd_by_Name_3').show();
						$('#email_by_Name').val(data.email);
					}
				} else {
					if (data.message != "") {
						validator.showErrors({
							"userName": data.message
						});
					}
					//yunNoty(data);
				}
			}
		});
	} else {
		var NameURL = '';
		var dataJSON = {};
		//提交验证码
		if($('#email_by_Name').css('display') == 'none') {
			//验证手机必填项
			if(validator.element( "#code_by_Name" ) === false) {
				return false;
			} else if(validator.element( "#telVerifyCode_by_Name" ) === false) {
				return false;
			}
			NameURL = 'FindPwd/verifyCode';
			dataJSON = {
				code: $('#telVerifyCode_by_Name').val(),
				userName: $('#userName').val()
			}
		} else {
			//验证邮箱必填项
			if(validator.element( "#code_by_Name" ) === false) {
				return false;
			}
			NameURL = 'FindPwd/forgetPwd';
			dataJSON = {
				code: $('#code_by_Name').val(),
				email: $('#email_by_Name').val()
			}
		}
		if (flag_Name2) return;
		flag_Name2 = true;
		$.ajax({
			type: 'post',
			datatype: 'json',
			cache: false,
			//不从缓存中去数据
			url: encodeURI(NameURL),
			data: dataJSON,
			success: function(data) {
				flag_Name2 = false;
				if (data.status == 0) {
					if($('#email_by_Name').css('display') == 'none') {
						//手机验证码成功，重置密码
						$('#NewPwd').show();
					} else {
						//邮箱，发送邮件
						$('#emailSuccess').show();
					}
					$('#Pwd_top').hide();
					$('#Pwd_by_Name').hide();
				} else {
					if($('#email_by_Name').css('display') == 'none') {
						//手机验证错误提示
						yunNoty(data);
					} else {
						//邮箱验证错误提示
						validator.showErrors({
							"code_by_Name": data.message
						});
    					$('.vcodeImg').trigger('click');
					}
				}
			}
		});
	}
}

var flag_code_name = false;
//获取手机验证码 用户名
function getNameCode(obj) {
	if (flag_code_name) return;
	flag_code_name = true;
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('FindPwd/sendTelcode'),
		data: {
			userName: $('#userName').val(),
			code: $('#code_by_Name').val()
		},
		success: function(data) {
			flag_code_name = false;
			if (data.status == 0) {
				settime($('#getcode_by_Name'));
			} else {
				yunNoty(data);
			}
		}
	});
}

//邮箱找回
function checkEmail() {
  $.getJSON('/FindPwd/findPwdByEmail?email='+$('#email_by_Name').val(), function(data) {
    if(data.status === 0) {
      $('#Pwd_by_Name').hide();
      $('#emailSuccess').show();
      var mailattr = '';
      var mailend = $('#email_by_Name').val().split('@')[1].toLowerCase();
      if (mailend.indexOf('outlook')>=0 || mailend.indexOf('hotmail')>=0) {
        mailattr = '//login.live.com';
      } else if (mailend.indexOf('sina')>=0) {
        mailattr = '//mail.sina.com.cn';
      } else if (mailend.indexOf('qq')>=0) {
        mailattr = '//mail.qq.com';
      } else if (mailend.indexOf('139')>=0) {
        mailattr = '//mail.10086.cn';
      } else if (mailend.indexOf('sohu')>=0) {
        mailattr = '//mail.sohu.com';
      } else if (mailend.indexOf('126')>=0) {
        mailattr = '//mail.126.com/';
      } else if (mailend.indexOf('163')>=0) {
        mailattr = '//mail.163.com/';
      } else if (mailend.indexOf('gmail')>=0) {
        mailattr = '//accounts.google.com/AccountChooser?service=mail&continue=https://mail.google.com/mail/';
      } else {
        mailattr = '//mail.' + mailend;
      }
      $('#somemail').attr('href', mailattr);
    } else {
      validator.showErrors({
        "email_by_Name": data.message
      });
    }
  });
}

function checkEmailAgain() {
  $.getJSON('/FindPwd/findPwdByEmail?email='+$('#email_by_Name').val(), function(data) {
    yunNoty(data);
  });
}

//切换到邮箱找回
function clickTwo() {
	$('#NewPwd').hide();
	$('#Pwd_by_Tel').hide();
	$('#Pwd_by_Tel_2').hide();
	$('#Pwd_by_Tel_3').hide();
  $('#emailSuccess').hide();
	$('#telNum_by_Tel').removeAttr("readonly");
	$('.Pwd_rect').eq(0).removeClass('BG_Blue').addClass('BG_Grey').removeClass('Color_Blue').addClass('Color_Grey');
	$('.Pwd_rect').eq(1).removeClass('BG_Grey').addClass('BG_Blue').removeClass('Color_Grey').addClass('Color_Blue');
	$('#Pwd_by_Name').show();
}

//切换到手机号找回
function clickOne() {
	$('#NewPwd').hide();
	$('#Pwd_by_Name').hide();
	$('#telNum_by_Name').hide();
	$('#email_by_Name').show();
	$('#Pwd_by_Name_3').hide();
	$('#Pwd_by_Name_4').hide();
  $('#emailSuccess').hide();
	$('#userName').removeAttr("readonly");
	$('.Pwd_rect').eq(0).removeClass('BG_Grey').addClass('BG_Blue').removeClass('Color_Grey').addClass('Color_Blue');
	$('.Pwd_rect').eq(1).removeClass('BG_Blue').addClass('BG_Grey').removeClass('Color_Blue').addClass('Color_Grey');
	$('#Pwd_by_Tel').show();
}

//生成placeholder
function bindPH(name) {
	var input = $('input[name='+name+']');
	if(!input.val()) {
		input.parent().addClass('placeholder'+name+'');
	}
	input.on('focus', function() {
		input.parent().removeClass('placeholder'+name+'');
	});

	input.on('blur', function() {
		if(!input.val()) {
			input.parent().addClass('placeholder'+name+'');
		}
	});
}

//倒计时
var countdown1 = 120;
function settime(obj) {
	if (countdown1 == 0) {
		obj.attr("disabled", false);
		obj.html("再次发送验证码");
		obj.removeAttr('style');
		countdown1 = 120;
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

$(function(){
  //声明所有的电子邮件变量
  var mail=new Array("qq.com","163.com","hotmail.com","outlook.com","sina.com.cn","126.com","gmail.com","vip.qq.com","sohu.com","139.com","vip.sina.com");
  //生成一个个li，并加入到ul中
  for(var i=0;i<mail.length;i++){
    var liElement=$("<li class=\"autoli\"><span class=\"ex\"></span><span class=\"at\">@</span><span class=\"tail\">"+mail[i]+"</span></li>");
    liElement.appendTo("ul.list");
  }
  //首先让list隐藏起来
  $("ul.list").hide();
  
  $("#email_by_Name").keyup(function(event){
    //键入的内容不是上下箭头和回车
    if(event.keyCode!=38&&event.keyCode!=40&&event.keyCode!=13){
      //如果输入的值不是空或者不以空格开头
      if($.trim($(this).val())!=""&& $.trim($(this).val()).match(/^@/)==null){
        $("ul.list").show();
        //如果当前有已经高亮的下拉选项卡，那么将其移除
        if($("ul.list li:visible").hasClass("lilight")){
          $("ul.list li").removeClass("lilight");
        }
        //如果还存在下拉选项卡，那么将其高亮
        if($("ul.list li:visible")){
          $("ul.list li:visible:eq(0)").addClass("lilight");
        }
      }else{
      //否则不进行显示
        $("ul.list").hide();
        $("ul.list li").removeClass("lilight");
      }
      //输入的内容还没有包括@符号
      if($.trim($(this).val()).match(/.*@/)==null){
        $(".list li .ex").text($(this).val());
      }else{
      //输入的符号已经包含了@
        var str = $(this).val();
        var strs = str.split("@");
        $(".list li .ex").text(strs[0]);
        if($(this).val().length>=strs[0].length+1){
          tail=str.substr(strs[0].length+1);
          $(".list li .tail").each(function(){
            //如果数组中的元素是以文本中的后缀开头，那么就显示，否则不显示
            if(!($(this).text().match(tail)!=null&&$(this).text().indexOf(tail)==0)){
              //隐藏其他的li
              $(this).parent().hide();
            }else{
              //显示所在的li
              $(this).parent().show();
            }
          });
        }
      }
    }
    //按了回车时，将当前选中的元素写入到文本框中
    if(event.keyCode==13){
      $("#email_by_Name").val($("ul.list li.lilight:visible").text());
      $("ul.list").hide();
    }
  });
  
  //监听上下方向键
  $("#email_by_Name").keydown(function(event){
    //下方向键按下了
    if(event.keyCode==40){
      if($("ul.list li").is(".lilight")){
        if($("ul.list li.lilight").nextAll().is("li:visible")){
          $("ul.list li.lilight").removeClass("lilight").next("li").addClass("lilight");
        }
      }
    }
    //下方向键按下了
    if(event.keyCode==38){
      if($("ul.list li").is(".lilight")){
        if($("ul.list li.lilight").prevAll().is("li:visible")){
          $("ul.list li.lilight").removeClass("lilight").prev("li").addClass("lilight");
        }
      }
    }
  });
  
  //当鼠标点击某个下拉项时，选中该项，下拉列表隐藏
  $("ul.list li").click(function(){
    $("#email_by_Name").val($(this).text());
    $("ul.list").hide();
  });
  
  //当鼠标划过某个下拉项时，选中该项，下拉列表隐藏
  $("ul.list li").hover(function(){
    $("ul.list li").removeClass("lilight");
    $(this).addClass("lilight");
  });
  
  //当鼠标点击其他位置，下拉列表隐藏
  $(document).click(function(){
    $("ul.list").hide();
  });			
});