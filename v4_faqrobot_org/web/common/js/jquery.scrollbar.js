/**************************** BEGIN ****************************/
/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright 2015 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
;!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});
/**************************** END ****************************/

/**************************** BEGIN ****************************/
/**
* jquery.scrollbar.js
* 
* Copyright (c) 2016/5/25 Han Wenbo
*
**/

;(function($, window, document, undefined) {
	var plugName = "scrollbar",
		defaults = {
			backClass: 'SC_backClass',
			frontClass: 'SC_frontClass',
			autoBottom: true,//内容改变，是否自动滚动到底部
			moveCallback: function(top, direction) {},//运动时事件回调
			stopCallback: function(top, direction) {},//停止时事件回调
		};
	
	function Scrollbar($el, options) {
		this.plugName = plugName;
		this.$el = $el;
		this.prop = {};
		this.child = {};
		this.el = {};
		this.defaults = defaults;
		this.options = $.extend({}, defaults, options);
		this.init();
	}

	Scrollbar.prototype = {
		init: function() {
			this.variable();//声明变量
			this.baseEl();//生成滚动条的背景栏和拖动按钮
			this.event();//绑定事件
		},
		//声明变量
		variable: function() {
			this.winW = $(window).width();
			this.winH = $(window).height();

			this.el.width = this.$el.width();
			this.el.height = this.$el.height();
			this.el.outerWidth = this.$el.outerWidth();
			this.el.outerHeight = this.$el.outerHeight();
			this.el.pos = this.$el.position();
			this.el.position = this.$el.position();
			this.el.borderWidth = parseInt(this.$el.css('borderTopWidth'));

			this.$child = this.$el.children(':not(script):eq(0)');
			this.child.width = this.$child.width();
			this.child.height = this.$child.height();
			this.child.outerWidth = this.$child.outerWidth();
			this.child.outerHeight = this.$child.outerHeight();
			if(this.child.outerHeight<this.el.outerHeight) {//限制最小高度
				this.child.outerHeight = this.el.outerHeight;
			}
			this.child.pos = this.$child.position();
			this.child.position = this.$child.position();
			this.child.borderWidth = parseInt(this.$child.css('borderTopWidth'));

			this.maxScroll = this.child.outerHeight-this.el.height;//div最大滚动距离
			this.delta = 1;//
			this.deltaFactor = 40;//滚动一次移动的距离
			this.curPos = 0;
		},
		//生成滚动条的背景栏和拖动块
		baseEl: function() {
			var style = 
				'.SC_outer {'+
					'overflow: hidden;'+
				'}'+
				'.SC_inner {'+
					'position: absolute;'+
					'top: 0;'+
					'left: 0;'+
				'}'+
				'.SC_backCtn {'+
				    'height: 100%;'+
				    'position: absolute;'+
				    'top: 0;'+
				    'right: 2px;'+
				'}'+
				'.SC_backClass {/*可配置*/'+
				    'background: #000;'+
				    'background: rgba(0, 0, 0, 0.4);'+
				    'width: 2px;'+
				    'border-radius: 20px;'+
				'}'+
				'.SC_frontCtn {'+
				    'position: absolute;'+
				    'top: 0;'+
				    'cursor: pointer;'+
				'}'+
				'.SC_frontClass {/*可配置*/'+
				    'background: #fff;'+
				    'background: rgba(255, 255, 255, 0.75);'+
				    'width: 4px;'+
				    'height: 30px;'+
				    'border-radius: 5px;'+
				'}'+
				'.SC_frontClass:hover {/*可配置*/'+
				    'background: rgba(255, 255, 255, 1);';+
				'}'+
				'.SC_select_no {'+
				    '-moz-user-select: none;/*火狐*/'+
				    '-webkit-user-select: none;/*webkit浏览器*/'+
				    '-ms-user-select: none;/*IE10*/'+
				    '-khtml-user-select: none;/*早期浏览器*/'+
				    'user-select: none;'+
				'}';
			$('head').append('<style>'+ style +'</style>');
			if(this.$el.css('position')=='static') {
				this.$el.css('position', 'relative');
			}
			this.$el.addClass('SC_outer');
			this.$child.addClass('SC_inner');
			//背景栏
			this.$SC_backCtn = $('<div class="SC_backCtn"></div>').addClass(this.options.backClass).hide().appendTo(this.$el);

			//拖动块
			this.$SC_frontCtn = $('<div class="SC_frontCtn"></div>').addClass(this.options.frontClass).appendTo(this.$SC_backCtn);

			this.frontLeft = (parseInt(this.$SC_backCtn.width())-parseInt(this.$SC_frontCtn.width()))/2;

			this.$SC_frontCtn.css({
				left: this.frontLeft,
			});
			this.maxTop = this.el.height-this.$SC_frontCtn.height();//拖动块最大top
			this.ratio = this.maxScroll/this.maxTop;//比率
		},
		//绑定事件
		event: function() {
			var This = this,
				oldX = 0,  
				oldY = 0,
				diffX = 0,
				diffY = 0,
				touchTimer = null;

			if(document.addEventListener) {//手机端(防止IE8-报错)
				This.$el[0].addEventListener('touchstart', function(e) {  
					var targetTouches = e.targetTouches[0];  
					oldX = targetTouches.pageX;  
					oldY = targetTouches.pageY;  
				});

				This.$el[0].addEventListener('touchmove', function(e) {
					clearInterval(touchTimer);
					This.$SC_backCtn.add(This.$SC_frontCtn).fadeIn();
					e.preventDefault();//阻止页面滚动  
							  
					var targetTouches = e.targetTouches[0];  

					var newX = targetTouches.pageX,  
						newY = targetTouches.pageY; 

					diffX = newX - oldX;
					diffY = newY - oldY;  

					var childTop = This.$child.position().top,
						elH = This.$el.outerHeight(),
						childH = This.$child.outerHeight();

					if(childTop<0 && childH>elH-childTop) {
						This.$child.css({'top': '+='+ diffY});
						This.$SC_frontCtn.css({'top': -(This.$child.position().top)/This.ratio});
					}else {
						This.$child.css({'top': '+='+ diffY/3});
					}

					oldX = newX;  
					oldY = newY;  
				});

				This.$el[0].addEventListener('touchend', function(e) { 
					var targetTouches = e.targetTouches[0];  

					var childTop = This.$child.position().top,
						elH = This.$el.outerHeight(),
						childH = This.$child.outerHeight();

					if(childTop>=0) {//上出现空白
						This.$child.stop().animate({'top': '0'}, 300, function() {
							This.$SC_backCtn.add(This.$SC_frontCtn).fadeOut();
						});
						This.options.stopCallback(parseInt(This.$child.css('top')), -1);
					}else if(childH<=elH-childTop) {
						if(childH < elH) {//下出现空白
							This.$child.stop().animate({'top': '0'}, 300, function() {
								This.$SC_backCtn.add(This.$SC_frontCtn).fadeOut();
							});
						}else {
							This.$child.stop().animate({'top': elH-childH}, 300, function() {
								This.$SC_backCtn.add(This.$SC_frontCtn).fadeOut();
							});
						}
						This.options.stopCallback(parseInt(This.$child.css('top')), 1);
					}else {//缓动停止
						clearInterval(touchTimer);
						touchTimer = setInterval(function() {
							childTop = This.$child.position().top;//更新childTop

							if(childTop>=0) {//上出现空白
								This.$child.css({'top': '0'});
								clearInterval(touchTimer);
								This.options.stopCallback(parseInt(This.$child.css('top')), -1);
							}else if(childH<=elH-childTop) {//下出现空白
								This.$child.css({'top': elH-childH});
								clearInterval(touchTimer);
								This.options.stopCallback(parseInt(This.$child.css('top')), 1);
							}else {//运动中
								if(Math.abs(diffY)>1) {
									This.$child.css({'top': '+='+ diffY});
									This.$SC_frontCtn.css({'top': -(This.$child.position().top)/This.ratio});
									diffY *= .95;
								}else {
									This.$SC_backCtn.add(This.$SC_frontCtn).fadeOut();
									clearInterval(touchTimer);
								}
								This.options.moveCallback(parseInt(This.$child.css('top')), -diffY<0?-1:1);
							}
						}, 20);
					}
					
				});
			}

			//鼠标滚动(手机端无滚轮)
			This.$el.add(This.$SC_backCtn).add(This.$SC_frontCtn).on('mousewheel.SC', function(event, delta) {
				This.delta = -delta;//

				if(This.delta<0) {//向上滚
					var top = Math.abs(parseInt(This.$child.css('top'))),
						once = Math.abs(This.delta*This.deltaFactor);

					if(top<once) {
						once = top;
					}
					This.curPos += once;
					This.$child.css({
						top: This.curPos,
					});

					This.$SC_frontCtn.css({
						top: -This.curPos/This.ratio,
					});
				}

				if(This.delta>0) {//向下滚
					var top = Math.abs(parseInt(This.$child.css('top'))),
						bottom = Math.abs(parseInt(This.maxScroll-top)),
						once = Math.abs(This.delta*This.deltaFactor);

					if(bottom<once) {
						once = bottom;
					}
					This.curPos += -once;
					This.$child.css({
						top: This.curPos,
					});

					This.$SC_frontCtn.css({
						top: -This.curPos/This.ratio,
					});
				}
				This.options.moveCallback(parseInt(This.$child.css('top')), This.delta);
				return false;
			});

			//鼠标按下拖动
			This.$SC_frontCtn.on('mousedown.SC', function(e) {
				$(document).on('selectstart.SC', function() {//禁选文字(兼容ie低版本)
					return false;
				});
				$('body').addClass('SC_select_no');//禁选文字(兼容火狐)

				var clientY = e.clientY,
					top = parseInt($(this).css('top'));//开始的top

				var oldClientY = e.clientY;

				$(document).on('mousemove.SC', function(e) {
					var newClientY = e.clientY,
						endTop = top+newClientY-clientY;//最终的top

					var diffClientY = newClientY-oldClientY;//判断拖动的方向
					oldClientY = e.clientY;

					if(endTop <= 0) {
						endTop = 0;
					}
					if(endTop >= This.maxTop) {//
						endTop = This.maxTop;
					}

					This.$SC_frontCtn.css({//拖动按钮滚动
						top: endTop,
					});

					This.$child.css({//div滚动
						top: -endTop*This.ratio,
					});
					This.options.moveCallback(parseInt(This.$child.css('top')), diffClientY<0?-1:1);
				});
			});

			//取消拖动
			$(document).on('mouseup.SC', function() {
				$(this).off('mousemove.SC');
				$(document).off('selectstart.SC');
				$('body').removeClass('SC_select_no');
			});

			//监听内容变化(兼容性不好)
			/*This.$child.on('DOMNodeInserted.SC', function() {
				This.update();//更新
			});*/

			This.text = This.$el.text();

			This.timer = setInterval(function() {
				var newtext = This.$el.text();

				if(This.text != newtext) {
					This.update();
					This.text = This.$el.text();
					if(This.options.autoBottom) {
						This.scrollTo('bottom');
					}
				}
			}, 100);

			//浏览器缩放
			$(window).on('resize.SC', function() {
				This.update();//更新
			});

			//渐隐渐显
			This.$el.hover(function() {
				This.$SC_backCtn.stop().fadeIn();
			}, function() {
				This.$SC_backCtn.stop().fadeOut();
			});
		},
		//更新
		update: function() {
			this.el.height = this.$el.height();
			this.el.outerHeight = this.$el.outerHeight();
			this.child.outerHeight = this.$child.outerHeight();

			if(this.child.outerHeight<this.el.outerHeight) {//限制最小高度
				this.child.outerHeight = this.el.outerHeight;
			}

			this.maxScroll = this.child.outerHeight-this.el.height;//div最大滚动距离

			this.maxTop = this.el.height-this.$SC_frontCtn.height();//拖动块最大top
			this.ratio = this.maxScroll/this.maxTop;//比率

			if(this.maxTop <= -this.curPos/this.ratio) {//继续往下拖防止出现空白
				this.scrollTo('bottom');
			}else {
				this.$SC_frontCtn.css({
					top: -this.curPos/this.ratio,
				});
			}
		},
		//滚动至 ['top'] ['bottom'] [int]
		scrollTo: function(pos, bool) {
			if(pos == 'top') {
				this.curPos = 0;
			}
			if(pos == 'bottom') {
				this.curPos = -this.maxScroll;
			}
			if(/\d+/.test(pos)) {
				this.curPos = -pos;
			}

			if(bool) {// css
				this.$child.stop().css({
					top: this.curPos,
				}, 300);

				this.$SC_frontCtn.stop().css({
					top: -this.curPos/this.ratio,
				}, 300);
			}else {// animate
				this.$child.stop().animate({
					top: this.curPos,
				}, 300);

				this.$SC_frontCtn.stop().animate({
					top: -this.curPos/this.ratio,
				}, 300);
			}
		},
		
	}

	$.fn.extend({
		scrollbar: function(options) {
			return new Scrollbar($(this), options);
		}
	})
})(jQuery, window, document);
/**************************** END ****************************/