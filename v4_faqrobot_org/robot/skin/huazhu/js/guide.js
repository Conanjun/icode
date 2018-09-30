define(function(require, exports, module) {
	function GUIDE() {
		this.init();
	}
	GUIDE.prototype = {
		init: function() {
			this.vue();
		},
		vue: function() {
			new Vue({  
			    el: '#view',  
			    data: function () {
            return {
              translateY: 400,
              isshow: 'none'
            }
			    },
			    created: function() {
			    	var This = this;
			    	var pic = new Image();  

	                pic.onload = function(e) { //加载完毕后(建议)   
	                	var winW = document.body.clientWidth;  
	                	This.translateY = 800*winW/pic.width;// 计算高度
                    This.isshow = 'block';
	                }  
	                pic.src = './skin/huazhu/images/bg_guide.png'; //这句放在onload后面(兼容ie8)   
			    },
			    methods: {
			    	
			    }
			});  
		}
	}

	exports.GUIDE = GUIDE
})