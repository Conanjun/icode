/**
* jquery.sortable.js plugin
*
*
*
*
*/
;(function($, window, document, undefined) {
	
	var plugName = "sortable",
		defaults = {

		};
	
	function Sortable(el,options) {
		this.name = plugName;
		this.$el = el;
		this.$childs = null;
		this.isDown = false;
		this.isEnd = true;
		this._options = options;
		this.defaults = $.extend({}, defaults, options);
		this.init();
		if(typeof this._options == 'string') {
			if(this._options == 'destroy') {
				this.destroy();
			}
		}
	}

	Sortable.prototype = {
		init: function() {
			this.disabledText();
			var $el = this.$el,
				This = this;

			this.$childs = this.$el.children();
			var $currentChild = null;
			var $spaceDiv = $("<div>").addClass("sr-marked");
			//绑定事件
			this.$childs.off('mousedown.s').on("mousedown.s", function(e) {
				if(!This.isEnd) return;
				This.isDown = true;
				var oe = e || event;
				$currentChild  = $(this);
				var oldPageX = oe.pageX,
					oldPageY = oe.pageY;
				var oldPos = $currentChild.position();

				This.isEnd = false;

					
				//生成占位
				$spaceDiv.insertAfter($currentChild);
				$currentChild.css({"position": "absolute", "z-index":"999", "top": $spaceDiv.position().top - $spaceDiv.height()});

				$(document).off('mousemove.s').on("mousemove.s", function(e) {
					var oe = e || event;

					var left = oe.pageX - oldPageX,
						top = oe.pageY - oldPageY + oldPos.top;

					$currentChild.css({
						"left": left,
						"top": top
					});

					This.replaceElement($currentChild, $spaceDiv);

				});
			})

			$(document).on("mouseup.s", function() {
				if(!This.isDown) return;
				This.isDown = false;
				$(document).off("mousemove.s");
				$currentChild.animate({
					"left": $spaceDiv.position().left,
					"top": $spaceDiv.position().top
				}, 100, function() {
					$currentChild.removeAttr("style");
					$spaceDiv.replaceWith($currentChild);
					This.isEnd = true;
				});
			});
		},
		destroy: function() {
			this.$childs.off("mousedown.s");
			$(document).off("mouseup.s");
			$("body").attr("onselectstart", "").css("user-select", "");
		},
		disabledText: function() {
			$("body").attr("onselectstart", "return false").css("user-select", "none");
		},
		replaceElement: function($currentObj, $spaceObj) {
			var $replaceEls = this.$childs.not($currentObj).not($spaceObj);
			var currentOffset = $currentObj.offset();
			var currentW = $currentObj.width();
			var currentH = $currentObj.height();

			$replaceEls.each(function(i) {
				var replaceOffset =  $(this).offset();
				if(Math.abs(currentOffset.left-replaceOffset.left)<currentW/2 && Math.abs(currentOffset.top-replaceOffset.top)<currentH/2) {
					if($(this).next(".sr-marked").length) {
						$(this).insertAfter($spaceObj);
					}else {
						$(this).insertBefore($spaceObj);
					}
				}
			})
		}

	}

	$.fn.extend({
		sortable: function(options) {
			return this.each(function() {
				new Sortable($(this), options);
			})
		}
	})
		


})(jQuery, window, document);









