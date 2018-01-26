/**
* jquery.mask.js plugin
*
*
*
*
*/
;(function($, window, document, undefined) {
	
	var plugName = "mask",
		defaults = {

		};
	
	function Mask(el,options) {
		this.name = plugName;
		this.$el = el;
		this.$mask = null;
		this.$mark = null;
		this.defaults = $.extend({}, defaults, options);
		if(typeof options == 'string') {
			this.destory();
		}else {
			this.init();
		}
	}

	Mask.prototype = {
		init: function() {
			var This = this;
			this.$el.off('mouseenter.m mouseleave.m click.m').on('mouseenter.m mouseleave.m click.m', function(e) {
				var oe = e || event,
					$target = $(this);
				var	xpos = $(this).outerWidth()/2,
					ypos = $(this).outerHeight()/2,
					direct = "";
				var x = oe.offsetX;
				var y = oe.offsetY;
				direct = This.getDir(xpos, ypos, x, y);
				This.moveMask(oe.type, direct, This.$mask)
			});

			this.$mask = this.maskEle(this.$el);
			this.$mark = this.markEle(this.$el);
			$('#picPage .mk-mask:last').remove();
		},
		maskEle: function($obj) {
			var w = $obj.outerWidth(),
				h = $obj.outerHeight();


			return $('<div>').addClass('mk-mask').css({
				'position': 'absolute',
				'width': '100%',
				'height': '100%',
				'left': '-100%',
				'top': '-100%',
			}).appendTo($obj);
		},
		markEle: function($obj) {
			var w = $obj.outerWidth(),
				h = $obj.outerHeight();

			return $('<i>').addClass('mk-mark').appendTo($obj);
		},
		getDir: function(xpos, ypos, x, y) {
			var angle = Math.atan((x - xpos)/(y - ypos))*180/Math.PI;

			if(angle>-45 && angle<45 && y>ypos){
				direct = "down";
			}
			if(angle>-45 && angle<45 && y<ypos){
				direct = "up";
			}
			if(((angle>-90 && angle<-45) || (angle>45 && angle<90)) && x>xpos){
				direct = "right";
			}
			if(((angle>-90 && angle<-45) || (angle>45 && angle<90)) && x<xpos){
				direct = "left";
			}

			return direct;
		},
		moveMask: function(type, dir, $obj) {
			var w = $obj.outerWidth(),
				h = $obj.outerHeight();

			if(type == "mouseenter") {
				switch(dir) {
					case "down":
						$obj.css({"left": "0px", "top": h}).stop(true,true).animate({"top": "0px"}, "fast");	
						break;
					case "up":
						$obj.css({"left": "0px", "top": -h}).stop(true,true).animate({"top": "0px"}, "fast");	
						break;
					case "right":
						$obj.css({"left": w, "top": "0px"}).stop(true,true).animate({"left": "0px"}, "fast");	
						break;
					case "left":
						$obj.css({"left": -w, "top": "0px"}).stop(true,true).animate({"left": "0px"}, "fast");	
						break;
				}
			}else if(type == "mouseleave") {
				switch(dir) {
					case "down":
						$obj.stop(true,true).animate({"top": h}, "fast");	
						break;
					case "up":
						$obj.stop(true,true).animate({"top": -h}, "fast");	
						break;
					case "right":
						$obj.stop(true,true).animate({"left": w}, "fast");	
						break;
					case "left":
						$obj.stop(true,true).animate({"left": -w}, "fast");	
						break;
				}
			}else {
				this.$mark.show();
				this.$el.off('mouseenter.m mouseleave.m click.m');
				$obj.addClass('mk-masked');
				//
				this.$el.siblings().find('.mk-mask').remove();
				this.$el.siblings().find('.mk-mark').remove();
				this.$el.siblings().mask();

				this.$el.parent().siblings().children().find('.mk-mask').remove();
				this.$el.parent().siblings().children().find('.mk-mark').remove();
				this.$el.parent().siblings().children().mask();
			}
		},
		destory: function() {
			this.$el.off('mouseenter.m mouseleave.m click.m');
			$('.mk-mask').remove();
			$('.mk-mark').remove();
		}

	}

	$.fn.extend({
		mask: function(options) {
			return this.each(function() {
				new Mask($(this),options);
			})
		}
	})
})(jQuery, window, document);









