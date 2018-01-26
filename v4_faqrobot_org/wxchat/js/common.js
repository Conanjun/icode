var extend = require('extend').extend

function Common() {
}

Common.prototype = {
	// 请求
	request: function(obj) {
		var This = this
		wx.request({
		    url: obj.url || '',
		    data: obj.data,
		    header: obj.header,
		    method: obj.method,
		    success: obj.success,
		    fail: obj.fail,
		    complete: obj.complete
		})
	},
	// 提示框
	showToast: function(obj) {
		wx.showToast({
			title: obj.title
		})
	},
	// 继承
	extend: extend,
	
}

exports.Common = new Common()
