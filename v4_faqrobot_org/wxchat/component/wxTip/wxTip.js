var WxParse = require('../wxParse/wxParse.js')

function WxTip() {
}

WxTip.prototype = {
	init: function(dataName, target) {
		this.dataName = dataName
		this.target = target
	},
	wxParse: function(temArrayName, html, num, target) {
		num = num || 1

		for(var i=0; i<num; i++){
		    WxParse.wxMoreParse('moreData'+i, 'html', html, target)
		}

		WxParse.wxParseTemArray(temArrayName, "moreData", num, target)
	},
	WxTip_cancel: function() {
		console.log(this)
		console.log(this.dataName)
  		/*var obj = JSON.parse('{"'+ this.dataName +'":""}')
		obj[this.dataName] = !this.target[this.dataName]
		
		this.target.setData(obj)*/
	}
}

exports.WxTip = new WxTip

