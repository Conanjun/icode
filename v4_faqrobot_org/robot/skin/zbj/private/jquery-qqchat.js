/*
*	qqchat plugin
*/
;(function($){
	$.fn.extend({
		qqchat : function(options) {
			//default para
			options = $.extend({
				src : "",
				xpos : "right",
				ypos : "bottom"
			}, options);
			var This = this,
				winW = $(window).width(),
				winH = $(window).height(),
				left = 0,
				top = 0;
			//init
			This.children(".showchat").hide();
			//window resize
			$(window).resize(function() {
				winW = $(window).width();
				winH = $(window).height();
				left = winW - This.outerWidth();
				top = winH - This.outerHeight();
				This.css({
					"position" : "fixed",
					"left" : left,
					"top" : top,
				});
			});
			//chat-icon
			var $img = $("<img src="+options.src+" />")
			.appendTo(This.children(".hidechat"));
			//chat position
			if(!parseInt(options.xpos) || !parseInt(options.ypos)) {
				if(options.xpos == "right") {
					left = winW - This.outerWidth();
				}
				if(options.ypos == "bottom") {
					top = winH - This.outerHeight();
				}
			}
			//This position
			This.css({
				"position" : "fixed",
				"left" : left,
				"top" : top,
			});
			//mouse event
			This.children(".hidechat").on("mousemove", function() {
				This.children(".showchat").show();
			});
			This.find(".close").on("click", function() {
				This.children(".showchat").hide();
			});
		}
	});
})(jQuery);