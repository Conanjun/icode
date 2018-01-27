(function($) {})(jQuery);
var _yunNotyBool = 0;
function yunNoty(data, fun, stick) {
	if (data.status == -1) {
		data.clallback = function() {
			var fromurl = top.location.href;
			var urlId = "";
			if (fromurl && fromurl.indexOf("#") < 0) {
				urlId = fromurl.substring(fromurl.indexOf("#") + 1, fromurl.length);
				if (urlId.length > 10) {
					urlId = "";
				}
			}
			top.location.href = "/login.html?from=" + urlId;
		};
	}
	var option = {
		title: "提醒",
		text: data.message,
		time: data.timeout ? data.timeout: 3000,
		class_name: data.status == 0 ? "": "gritter-light",
		after_close: data.clallback ? data.clallback: false
	};
	if(stick === true) {
		option = $.extend(option, {sticky: true});
	}
	if(!_yunNotyBool) $.gritter.add(option);
	if (data.status == -1) _yunNotyBool = 1;
	if (typeof fun == 'function') {
		setTimeout(fun, 1500);
	} else {}
}

function yunNotyError(msg, fun, stick) {
	var option = {
		title: "提醒",
		text: msg,
		time: 4000,
		class_name: "gritter-light"
	};
	if(stick === true) {
		option = $.extend(option, {sticky: true});
	}
	$.gritter.add(option);
	if (typeof fun == 'function') {
		setTimeout(fun, 1800);
	} else {}
}

//截取字符串
function limitstr(chinese_string, len) {
	if (!chinese_string) return;
	if (chinese_string.length > len) {
		var new_text = chinese_string.substring(0, len) + "...";
		return new_text;
	}
	return chinese_string;
}

//设置ajax分页
function setPage(domId, options) {
	$('#' + domId).bootstrapPaginator(options);
}

//icheck
function icheckBindInit() {
	$('table').on('ifClicked', '.select_rows',
		function() {
			var tableid = $(this).data('tableid');
			var ckbs = $('#' + tableid).find('input[name=ckb]').filter(function(ind, el){
				return $(el).data('del') != 1;
			});
			if ($(this)[0].checked) {
				ckbs.iCheck('uncheck');
			} else {
				ckbs.iCheck('check');
			}
		});
}

function icheckListInit() {
	//不勾选全选
	$('.select_rows').iCheck('uncheck');
	$('.select_row').on('ifUnchecked',
		function() {
			$('.select_rows').iCheck('uncheck');
		});
	//初始化ickeck
	icheckInit();
}

//获取部分选中的checkbox的value
function getSelectedIds() {
	var cboxs = document.getElementsByName('ckb');
	if (typeof cboxs == "undefined") {
		return "";
	}
	var inputvalue = "";

	for (var i = 0; i < cboxs.length; i++) {
		if (cboxs[i].checked === true) {
			inputvalue += cboxs[i].value + ",";
		}
	}
	inputvalue = inputvalue.substring(0,inputvalue.length-1);
	return inputvalue;
}

//修改或进行其他操作后展示当前页
function listCurrentPage(listFun,pageListID) {
	var pageNo = $('#'+ pageListID +' .active a').html();
	listFun(pageNo);
}

//通用的批量删除方法
function selectDel(ids, url, fun, pageId) {
	if (ids === '') {
		ids = getSelectedIds();
	}
	if (ids === "") {
		return false;
	}
	if (url === "") {
		return false;
	}
	$.getJSON(url, "ids=" + ids,
		function(data) {
			if (data.status === 0) {
				var ids_array = ids.split(",");
				for (i = 0; i < ids_array.length; i++) {
					$('#list-tr-' + ids_array[i]).hide();
				}
				if (typeof fun == "function") {
					if (pageId) {
						var page = $('#' + pageId + ' .active a').html();
						var oT = $('input[name=orderType]').val();
						if($('.m-del')!==undefined) {
							if($('.m-del').size()==ids_array.length) page-=1;
							if(page<1) page=1;
						}
						if (oT) {
							fun(page, oT);
						} else {
							fun(page);
						}

					} else {
						fun();
					}
				}
				$('.select_rows').attr('checked', false);
				yunNoty(data);
			} else {
				yunNoty(data);
			}
		});
	return false;
}

//接待入口管理批量删除传id
function selectDel2(id, url, fun, pageId) {
	if (id === '') {
		id = getSelectedIds();
	}
	if (id === "") {
		return false;
	}
	if (url === "") {
		return false;
	}
	$.getJSON(url, "id=" + id,
		function(data) {
			if (data.status === 0) {
				var id_array = id.split(",");
				for (i = 0; i < id_array.length; i++) {
					$('#list-tr-' + id_array[i]).hide();
				}
				if (typeof fun == "function") {
					if (pageId) {
						var page = $('#' + pageId + ' .active a').html();
						var oT = $('input[name=orderType]').val();
						if($('.m-del')!==undefined) {
							if($('.m-del').size()==ids_array.length) page-=1;
							if(page<1) page=1;
						}
						if (oT) {
							fun(page, oT);
						} else {
							fun(page);
						}

					} else {
						fun();
					}
				}
				$('.select_rows').attr('checked', false);
				yunNoty(data);
			} else {
				yunNoty(data);
			}
		});
	return false;
}

//通用的单个删除方法
var _customGetJSONFlag=false;
function delById(obj, url, fun, pageId) {
	var $this = $(obj);
	if (typeof url == 'undefined') {
		return;
	}
	if (typeof pageId == 'undefined') {
		return;
	}
	if(_customGetJSONFlag){
		return;
	}
	_customGetJSONFlag=true;
	$.getJSON(url, 'ids=' + $this.attr('rel') + '&id=' + $this.attr('rel'),
		function(data) {
			setTimeout(function(){_customGetJSONFlag=false;}, 1000);
			if (data.status === 0) {
				if (typeof fun == "function") {
					var page = $('#' + pageId + ' .active a').html();
					if($('.m-del')!==undefined) {
						if($('.m-del').size()==1) page-=1;
						if(page<1) page=1;
					}
					fun(page);
				}
				yunNoty(data);
			} else {
				yunNoty(data);
			}
		});
}

//修改列表模态框保存按钮
function saveModal(url, formId, modalId, fun, pageId) {
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI(url),
		data: $("#" + formId).serialize(),
		success: function(data) {
			if (data.status === 0) {
				$('#' + modalId).modal('hide');
				if (typeof fun == "function") {
					var page = $('#' + pageId + ' .active a').html();
					var oT = $('input[name=orderType]').val();
					if (!oT) {
						fun(page);
					} else if (oT && pageId) {
						fun(page, oT);
					} else {
						fun();
					}
				}
				yunNoty(data);
			} else {
				yunNoty(data);
			}
		}
	});
}

//简单的禁用、启用等的方法
function simpleEdit(url, obj, fun, pageId, status, ids) {
	if (typeof status == "undefined") status = '';
	if (typeof ids == "undefined") ids = '';
	var curObj = $(obj).attr('rel');
	if (typeof curObj == "undefined") curObj = '';
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI(url),
		data: 'id=' + curObj + '&status=' + status + '&ids=' + ids,
		success: function(data) {
			if (data.status === 0) {
				if (typeof fun == "function") {
					var page = $('#' + pageId + ' .active a').html();
					var oT = $('input[name=orderType]').val();
					if (!oT) {
						fun(page);
					} else {
						fun(page, oT);
					}
				}
				yunNoty(data);
			} else {
				yunNoty(data);
			}
		}
	});
}

//配置参数请求地址
function request(obj, url, fun) {
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI(url),
		data: $(obj).parents('form').serialize(),
		success: function(data) {
			if (data.status === 0) {
				if (typeof fun == "function") {
					fun();
				}
				yunNoty(data);
			} else {
				yunNoty(data);
			}

		}
	});
}

//过滤标签
function $xss(str, type) {
	//空过滤
	if (!str) {
		return str === 0 ? "0": "";
	}
	switch (type) {
		case "none":
			//过度方案
			return str + "";
		case "html":
			//过滤html字符串中的XSS
			return str.replace(/[&'"<>\/\\\-\x00-\x09\x0b-\x0c\x1f\x80-\xff]/g,
				function(r) {
					return "&#" + r.charCodeAt(0) + ";";
				}).replace(/ /g, " ").replace(/\r\n/g, "<br />").replace(/\n/g, "<br />").replace(/\r/g, "<br />");
		case "htmlEp":
			//过滤DOM节点属性中的XSS
			return str.replace(/[&'"<>\/\\\-\x00-\x1f\x80-\xff]/g,
				function(r) {
					return "&#" + r.charCodeAt(0) + ";";
				});
		case "url":
			//过滤url
			return escape(str).replace(/\+/g, "%2B");
		case "miniUrl":
			return str.replace(/%/g, "%25");
		case "script":
			return str.replace(/[\\"']/g,
				function(r) {
					return "\\" + r;
				}).replace(/%/g, "\\x25").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\x01/g, "\\x01");
		case "reg":
			return str.replace(/[\\\^\$\*\+\?\{\}\.\(\)\[\]]/g,
				function(a) {
					return "\\" + a;
				});
		default:
			return escape(str).replace(/[&'"<>\/\\\-\x00-\x09\x0b-\x0c\x1f\x80-\xff]/g,
				function(r) {
					return "&#" + r.charCodeAt(0) + ";";
				}).replace(/ /g, " ").replace(/\r\n/g, "<br />").replace(/\n/g, "<br />").replace(/\r/g, "<br />");
	}
}

//展开分类
$(".expandAll").bind("click", expandAll);
function expandAll() {
	var zTree = $.fn.zTree.getZTreeObj("treeClasses");
	zTree.expandAll(true);
	return false;
}

$(".expandNot").bind("click", expandNot);
function expandNot() {
	var zTree = $.fn.zTree.getZTreeObj("treeClasses");
	zTree.expandAll(false);
	return false;
}

$(".expandListAll").bind("click", expandAll);
function expandAll() {
	var zTree = $.fn.zTree.getZTreeObj("treeClasses");
	zTree.expandAll(true);
	return false;
}

//资源，角色富名称tree展开节点
function showTree(treeId, flag) {
	var rolezTree = $.fn.zTree.getZTreeObj(treeId);
	rolezTree.expandAll(flag);
	return false;
}

//资源，角色生效时间问题
function setTimeValid(formId) {
	if (!formId) formId = '';
	$('#' + formId + ' input[name=timeLiness_temp]').on('ifChecked',
		function() {
			$('#' + formId + ' input[name=timeLiness_temp]').val(1);
		});
}

function setTimeUnValid(formId) {
	if (!formId) formId = '';
	$('#' + formId + ' input[name=timeLiness_temp]').on('ifUnchecked',
		function() {
			$('#' + formId + ' input[name=timeLiness_temp]').val(0);
		});
}


//验证url
function validUrl(value){
	// contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
	return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
}

//验证电话号码
function validTel(telValue){
	var isPhone=/^(1[3,5,8,7]{1}[\d]{9})|(((400)-(\d{3})-(\d{4}))|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{3,7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
	if(!isPhone.test(telValue)){ //如果用户输入的值不同时满足手机号和座机
		return false;
	}else{
		return true;
	}
}

//转化为 日+小时+分+秒
function formatTime(longTime) {
	var time = parseFloat(longTime);
	if (time !== null && time !== "") {
		if (time < 60) {
			var s = time;
			time = s + '秒';
		} else if (time >= 60 && time < 3600) {
			var m = parseInt(time / 60);
			var s1 = parseInt(time % 60);
			time = m + "分钟" + s1 + "秒";
		} else if (time >= 3600 && time < 86400) {
			var hh = parseInt(time / 3600);
			var mm = parseInt(time % 3600 / 60);
			var ss = parseInt(time % 3600 % 60 % 60);
			time = hh + "小时" + mm + "分钟" + ss + "秒";
		} else if (time >= 86400) {
			var d4 = parseInt(time / 86400);
			var h4 = parseInt(time % 86400 / 3600);
			var m4 = parseInt(time % 86400 % 3600 / 60);
			var s4 = parseInt(time % 86400 % 3600 % 60 % 60);
			time = d4 + '天' + h4 + "小时" + m4 + "分钟" + s4 + "秒";
		}
	}
	return time;
}

//资源，角色删除事件
function delData(delFormId, url, modalId, cb, treeId) {
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		url: encodeURI(url),
		data: $('#' + delFormId).serialize(),
		success: function(data) {
			if (data.status === 0) {
				yunNoty(data);
				$('#' + modalId).modal('hide');
				cb && cb();
				if (treeId) {
					var zTree = $.fn.zTree.getZTreeObj(treeId);
					zTree.reAsyncChildNodes(null, "refresh");
				}
			} else {
				yunNoty(data);
			}
		}
	});
}

//判断元素是否存在另一个元素中
function contains(array, testId) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] == testId) {
			return true;
		}
	}
	return false;
}
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r !== null) return decodeURIComponent(r[2]); return null; //返回参数值
}
//按回车键提交表单  xgn
function enterSubmit(obj,fun){
	if(!obj) return;
	if(!fun) return;
	obj.keydown(function(event){
		if(event.keyCode==13){
			event.preventDefault();
			fun();
			return;
		}
	});
}
//此处将来访者渠道和生效渠道区分开   xgn
function  showRule(data,sourceList){
	var ruleQDHtml = '';//渠道
	var ruleVisiterHtml='';//角色
	var ruleHtml='';
	if(data.ListRule) {
		if(data.ListRule[0]) {
			for(var k=0; k<data.ListRule.length; k++) {
				if(data.ListRule[k].type == 1) {
					$.each(data.ListRule[k].roleIds.split(','), function() {
						for(var m in sourceList) {
							if(sourceList[m].DicCode == this) {
								ruleQDHtml += sourceList[m].DicDesc+',';
							}
						}
					});
				}else {
					if(data.ListRule[k]) {
						for(var m in data.ListRule[k].roleIds) {
							for(var n in data.ListRule[k].roleIds[m]) {
								ruleVisiterHtml += data.ListRule[k].roleIds[m][n] +',';
							}
						}
					}
				}
			}
		}
	}
	if(ruleQDHtml){
		ruleHtml +='生效渠道:'+ruleQDHtml;
	}
	ruleHtml=ruleHtml.replace(/,$/, '');
	if(ruleVisiterHtml){

		ruleHtml +=(ruleHtml?'<span class="dot">|</span>':'') +'来访者角色:'+ruleVisiterHtml;
	}
	ruleHtml=ruleHtml.replace(/,$/, '');
	if(ruleHtml === '') {
		return '';
	} else {
		return ruleHtml+'<span class="dot">|</span>';
	}
}

function  showQuDao(data,sourceList){
	var ruleQDHtml = '';//渠道
	var ruleVisiterHtml='';//角色
	var ruleHtml='';
	if(data.ListRule) {
		if(data.ListRule[0]) {
			for(var k=0; k<data.ListRule.length; k++) {
				if(data.ListRule[k].type == 1) {
					$.each(data.ListRule[k].roleIds.split(','), function() {
						for(var m in sourceList) {
							if(sourceList[m].DicCode == this) {
								ruleQDHtml += sourceList[m].DicDesc+',';
							}
						}
					});
				}else {
					if(data.ListRule[k]) {
						for(var m in data.ListRule[k].roleIds) {
							for(var n in data.ListRule[k].roleIds[m]) {
								ruleVisiterHtml += data.ListRule[k].roleIds[m][n] +',';
							}
						}
					}
				}
			}
		}
	}
	ruleQDHtml=ruleQDHtml.replace(/,$/, '');
	if(ruleQDHtml){
		ruleHtml +='生效渠道:'+ruleQDHtml+'<span class="dot">|</span>';
	}
	return ruleHtml;
}
function  showJueSe(data,sourceList){
	var ruleQDHtml = '';//渠道
	var ruleVisiterHtml='';//角色
	var ruleHtml='';
	if(data.ListRule) {
		if(data.ListRule[0]) {
			for(var k=0; k<data.ListRule.length; k++) {
				if(data.ListRule[k].type == 1) {
					$.each(data.ListRule[k].roleIds.split(','), function() {
						for(var m in sourceList) {
							if(sourceList[m].DicCode == this) {
								ruleQDHtml += sourceList[m].DicDesc+',';
							}
						}
					});
				}else {
					if(data.ListRule[k]) {
						for(var m in data.ListRule[k].roleIds) {
							for(var n in data.ListRule[k].roleIds[m]) {
								ruleVisiterHtml += data.ListRule[k].roleIds[m][n] +',';
							}
						}
					}
				}
			}
		}
	}
	ruleVisiterHtml=ruleVisiterHtml.replace(/,$/, '');
	if(ruleVisiterHtml){
		ruleHtml +='来访者角色:'+ruleVisiterHtml+'<br>';
	}
	return ruleHtml;
}
$.fn.addWordCount = function(num) {
	var self = this;
	if(num === undefined) {
		num = 500;
	}
	if(self[0] === undefined) {
		return false;
	}
	if(self[0].tagName !== 'INPUT' && self[0].tagName !== 'TEXTAREA') {
		return false;
	}
	function genWordCount() {
		var HTML = '';
		if(self.val().length > num) {
			HTML = '<span style="color:#EA5200">'+self.val().length+'/0</span>';
		} else {
			HTML = self.val().length+'/'+(num-self.val().length);
		}
		if(self.parent().children('[wordcount=true]').length) {
			self.parent().children('.wordCountTag').html(HTML);
		} else {
			self.after('<span class="wordCountTag pull-right" wordcount="true">'+HTML+'</span>');
		}
	}
	self.bind('input propertychange', function() {
		genWordCount();
	});
	setInterval(function() {
		genWordCount();
	}, 1200);
};

function getSourceName(sourceId) {
	if(typeof sourceId != 'number' && typeof sourceId != 'string')return '';
	if(window._ywSource) {
		return window._ywSource[sourceId] || '全部';
	} else {
		var temp = '';
		$.ajax({
			async: false,
			cache: false,
			dataType: 'json',
			url:'/Configuration/showSourceByWebId',
			success:function(data){
				var arr = {};
				if(data.listSource && data.listSource[0]) {
					data.listSource.forEach(function(el){
						arr[el.DicCode] = el.DicDesc;
					});
				}
				window._ywSource = arr
				temp = window._ywSource[sourceId] || '全部';
			}
		});
		return temp;
	}
}

function getSessionStorage(teststr) {
	if(sessionStorage) {
		var str = sessionStorage.getItem(teststr);
		if(str !== '' && str !== 'null' && str !== 'undefined') {
			return str;
		}
	}
	return '';
}

$.fn.addDeleteConfirm = function(cb) {
	var self = this;
	var pos = $(self).position();
	var $delCheck = $('<div id="ADCCheck" style="position:absolute;z-index:6667;" />').css('top', pos.top-40).css('left', pos.left-42).append('<div style="background-color: #ff9101;border-radius: 2px;color: #fff;padding: 5px;">是否确定删除？</div>');
	var $delInfo = $('<div id="ADCInfo" style="position:absolute;z-index:6667;width:100px;" />').css('top', pos.top).css('left', pos.left-42).append('<button id="btn-ok-ensure" class="btn btn-xs btn-danger" style="margin-right:27px;"><i class="icon icon-check-circle"></i>确定</button><button id="btn-cancel-ensure" class="btn btn-xs btn-primary"><i class="icon icon-times-circle"></i>取消</button>')
	var $delBD = $('<div id="ADCBackDrop" style="position:absolute;width:100%;z-index:6666;cursor:pointer;top:0;left:0;background:rgba(0,0,0,0.5);" />').css('height', $(document).height());
	$delBD.append($delCheck).append($delInfo);
	$delBD.hide().appendTo($('body')).fadeIn('300');
	$('#btn-cancel-ensure').add('#ADCBackDrop').off('click').on('click', function() {
		$('#ADCBackDrop').fadeOut('250').remove();
	});
	$('#btn-ok-ensure').off('click').on('click', function() {
		cb(self);
		$('#ADCBackDrop').fadeOut('250').remove();
	});
};

$.fn.adcCreator = function(cb, bb, message) {
	if(message == undefined) {
		message = {
			title: '确认删除？',
			content: '确定要删除您所选的内容？'
		};
	} else {
		if(!message.title) message.title = '确认删除？';
		if(!message.content) message.content = '确定要删除您所选的内容？';
	}
	if(typeof bb == 'function') {
		if(!bb(this)) {
			return false;
		}
	}
	var self = this;
	var $delBD = $('<div class="modal" id="ADCDELModal" aria-hidden="false"><div class="modal-backdrop fade in" style="height: 5000px" id="ADCBackDrop"></div><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h4 class="modal-title">'+(message.title)+'</h4></div><div class="modal-body"><p>'+(message.content)+'</p></div><div class="modal-footer"><a href="javascript:;" class="btn btn-sm btn-primary" id="adc-ok-ensure">确认</a> <a href="javascript:;" class="btn btn-sm btn-white" id="adc-cancel-ensure">取消</a></div></div></div></div>');
	$delBD.hide().appendTo($('body')).fadeIn('300');
	$('#adc-cancel-ensure').add('#ADCBackDrop').off('click').on('click', function() {
		$('#ADCDELModal').fadeOut('250').remove();
	});
	$('#adc-ok-ensure').off('click').on('click', function() {
		cb(self);
		$('#ADCDELModal').fadeOut('250').remove();
	});
}

$.fn.tableAjaxLoader1 = function(colspan,timeout) {
	var self = this;
	if(colspan == undefined)colspan = 1;
	if(timeout == undefined)timeout = 300;
	//setTimeout(function(){
	//if($(self).find('tbody').find('tr').length == 0) {
	$(self).find('tbody').empty().html('<tr style="background:#fff;"><td colspan="'+colspan+'"><div class="loading-custom"></div></td></tr>');
	//}
	//},timeout);
}

$.fn.tableAjaxLoader2 = function(colspan,timeout) {
	var self = this;
	if(colspan == undefined)colspan = 1;
	if(timeout == undefined)timeout = 300;
	if($(self).find('th').length && $(self).find('th').length > 0)colspan = $(self).find('th').length;
	//setTimeout(function(){
	//if($(self).find('tbody').find('tr').length == 0) {
	$(self).find('tbody').empty().html('<tr style="background:#fff;"><td colspan="'+colspan+'"><div class="ajax-spinner-bars"><div class="bar-1"></div><div class="bar-2"></div><div class="bar-3"></div><div class="bar-4"></div><div class="bar-5"></div><div class="bar-6"></div><div class="bar-7"></div><div class="bar-8"></div><div class="bar-9"></div><div class="bar-10"></div><div class="bar-11"></div><div class="bar-12"></div><div class="bar-13"></div><div class="bar-14"></div><div class="bar-15"></div><div class="bar-16"></div></div></td></tr>');
	//}
	//},timeout);
}

function ifbOpenWindowInNewTab(url, title, id){
	if(id == undefined) {
		id = 'ifbOpenWindowInNewTabId'
	}
	$('#'+id).remove();
	if(iframeTab) {
		if(window.top.location.href != window.location.href) {
			url = window.location.protocol + "//" + window.location.host + url;
			$('body').append('<a href="'+ url+'" data-num="0" data-name="'+title+'" style="display:none;" id="'+id+'">'+title+'</a>');
			iframeTab.init({
				iframeBox: ''
			});
			$('#'+id).trigger('click');
		} else {
			location.href=url;
		}
	} else {
		location.href=url;
	}
}
