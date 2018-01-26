
//检测手机号是否正确
jQuery.validator.addMethod("isMobile", function(value, element) {
    var length = value.length;
    var regPhone = /^1([3578]\d|4[57])\d{8}$/;
    return this.optional(element) || ( length == 11 && regPhone.test( value ) );
}, "请正确填写您的手机号码！");

//检测API用户列表的角色选择是否正确
jQuery.validator.addMethod("isApiRole", function(value, element) {
	var i=0;
	var j=0;
    var length = value.length;
	while(i<length){
		if(value[i]==",")j++;
		i++;
	}
    return value != "请选择角色" && j<5;
}, "请选择至少一个至多五个角色！");

//检测只能是英文字母
jQuery.validator.addMethod("isABC", function(value, element) {
	var chrABC = /^([a-zA-Z.]+)$/;
    return this.optional(element) || (chrABC.test(value));
}, "只能输入字母！");

//验证固化和手机
jQuery.validator.addMethod("isTel", function(value, element) {
	var mobileRule = /^1([3578]\d|4[57])\d{8}$/;
	var telephoneRule1 = /^(\d{3}-)?\d{8}$/;
	var telephoneRule2 = /^(\d{4}-)?\d{7}$/;
	return this.optional(element) || mobileRule.test(value) || telephoneRule1.test(value) || telephoneRule2.test(value);
}, "请正确输入您的电话！");

//验证微博应用验证码
jQuery.validator.addMethod("isWeiBo", function(value, element) {
	var reg = /^[^\u4e00-\u9fa5]{0,}$/;
	return this.optional(element) || reg.test(value);
}, "微博应用验证码包含字母、数字或者英文符号！");

//验证支付宝应用验证码
jQuery.validator.addMethod("isZhiFuBao", function(value, element) {
	var reg = /^[^\u4e00-\u9fa5]{0,}$/;
	return this.optional(element) || reg.test(value);
}, "支付宝公钥包含字母、数字或者英文符号！");