//help模块js
function calculateDivider() {
    var e = 4;
    if ($(this).width() <= 480) {
        e = 1
    } else if ($(this).width() <= 767) {
        e = 2
    } else if ($(this).width() <= 980) {
        e = 3
    }
    return e
}
var handleIsotopesGallery = function() {
    "use strict";
	$(".gallery").each(function(){
		var e = $(this);
		var t = calculateDivider();
		var n = $(e).width() - 20;
		var r = n / t;
		$(e).isotope({
			resizable: false,
			masonry: {
				columnWidth: r
			}
		});
		$(window).smartresize(function() {
			var t = calculateDivider();
			var n = $(e).width() - 20;
			var r = n / t;
			$(e).isotope({
				masonry: {
					columnWidth: r
				}
			})
		});
	});
};
var Gallery = function() {
    "use strict";
    return {
        init: function() {
            handleIsotopesGallery()
        }
    }
} ()

function playVedio(title,src,posterSrc) {
	$("#vedioPlayerModal").modal('show');
	//$("#jquery_jplayer_1").jPlayer("clearMedia");
	$("#jquery_jplayer_1").jPlayer("setMedia", {
		title: title,
		flv: src,
		poster: posterSrc
	});
}
