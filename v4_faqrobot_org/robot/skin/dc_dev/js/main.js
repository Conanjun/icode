
//头部icon上移效果
$(".robot_topR ul").hover(function () {
    $(this).addClass("robot_topRon")
}, function () {
    $(this).removeClass("robot_topRon")
});

//满意度上移
$(".robot_review_yes").live('mouseover', function () {
    $(this).addClass("yeson")
});
$(".robot_review_yes").live('mouseout', function () {
    $(this).removeClass("yeson")
});
$(".robot_review_no").live('mouseover', function () {
    $(this).addClass("noon")
});
$(".robot_review_no").live('mouseout', function () {
    $(this).removeClass("noon")
});


//清空记录上移效果
$(".robot_write_clear").hover(function () {
    $(this).addClass("clearon")
}, function () {
    $(this).removeClass("clearon");
});
//发送移上效果
$(".robot_send").hover(function () {
    $(this).addClass("sendon")
}, function () {
    $(this).removeClass("sendon")
});
//右侧列表伸缩效果

$(".robot_contentR .hottitle").click(function () {
    if ($(this).hasClass("hottitle_on")) {
        return;
    } else {
        $(".robot_contentR ul").removeClass("hottitle_on");
        $(".robot_contentR div").slideUp();
        $(this).addClass("hottitle_on")
        $("#show" + $(this).attr("id")).slideDown();
    }
});


//热点问题伸缩效果
/*	$(".robot_hot dt").click(function(){
     $(this).siblings("dd").slideToggle();

     });*/

//左右折叠
$(".robot_jt ul").hover(function () {
    if ($(this).hasClass("jt_left")) {
        $(this).addClass("jt_lefton");
    } else {
        $(this).addClass("jt_righton");
    }
    $(this).parent().addClass("jt_hover");
}, function () {
    $(this).removeClass("jt_lefton");
    $(this).removeClass("jt_righton");
    $(this).parent().removeClass("jt_hover");
});

$(".robot_jt ul").click(function () {
    if ($(this).hasClass("jt_left")) {
        $(this).removeClass("jt_left");
        $(".robot_contentR").show();
        $(".robot_jt").css({ "right": "384px" });
        $(".robot_contentL").css({ "margin-right": "393px" });
        // $(".showWaring").css({ "margin-right": "393px" });
    } else {
        $(this).addClass("jt_left");
        $(".robot_contentR").hide();
        $(".robot_jt").css({ "right": "0px" });
        $(".robot_contentL").css({ "margin-right": "9px" });
        // $(".showWaring").css({ "margin-right": "9px" })
    }
});



//意见反馈
$(".rdoGood").click(function () {
    $(".hid").slideUp(100);
})
$(".rdoBad").click(function () {
    $(".hid").slideDown(100);
})
//关闭评价框
$(".close").click(function () {
    $(".fadeBackModal").fadeOut(100);
    $(".fadeBackContent").fadeOut(100);
});
//意见反馈
$(".clickFeedBack").click(function () {
    $(".fadeBackModal").fadeIn(100);
    $(".fadeBackContent").fadeIn(100);
});
function dialog(width, height) {
    $(".hid").hide();
    $(".fadeBackModal").css({ display: "block", width: $(document).width() + "px", height: $(document).height() + "px", top: 0, left: 0 });
    $(".fadeBackContent .close").unbind('click').bind('click', function () {
        $(".fadeBackModal").animate({ opacity: "0.15" }, "normal", function () { $(this).hide(); });
        $(".fadeBackContent").animate({ top: ($('.chat_wrap').scrollTop() - (height == "auto" ? 300 : parseInt(height))) + "px" }, "normal", function () { $(this).hide(); });
    });
    $(".fadeBackModal").animate({ opacity: "0.5" }, "normal");
    $(".fadeBackContent").show();

    $(".fadeBackContent").css({ left: (($('.chat_wrap').width()) / 2 - (parseInt(width) / 2)) + "px", top: ($('.chat_wrap').scrollTop() - (height == "auto" ? 300 : parseInt(height))) + "px", width: width });
    $(".fadeBackContent").animate({ top: ($(document).scrollTop() + 50) + "px" }, "normal");
}
function dialogleaveMsg(width, height) {
    $(".fadeBackModal1").css({ display: "block", width: $(document).width() + "px", height: $(document).height() + "px", top: 0, left: 0 });
    $(".fadeBackContent1 .close").click(function () {
        $(".fadeBackModal1").animate({ opacity: "0.15" }, "normal", function () { $(this).hide(); });
        $(".fadeBackContent1").animate({ top: ($(document).scrollTop() - (height == "auto" ? 300 : parseInt(height))) + "px" }, "normal", function () { $(this).hide(); });
    });
    $(".fadeBackModal1").animate({ opacity: "0.5" }, "normal");
    $(".fadeBackContent1").show();

    $(".fadeBackContent1").css({ left: (($(document).width()) / 2 - (parseInt(width) / 2)) + "px", top: ($(document).scrollTop() - (height == "auto" ? 300 : parseInt(height))) + "px", width: width });
    $(".fadeBackContent1").animate({ top: ($(document).scrollTop() + 50) + "px" }, "normal");
}

//验证url
function validUrl(value) {
    // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
    return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
}

function $xss(str, type) {
    //空过滤
    if (!str) {
        return str === 0 ? "0" : "";
    }

    switch (type) {
        case "none": //过度方案
            return str + "";
            break;
        case "html": //过滤html字符串中的XSS
            return str.replace(/[&'"<>\/\\\-\x00-\x09\x0b-\x0c\x1f\x80-\xff]/g, function (r) {
                return "&#" + r.charCodeAt(0) + ";"
            }).replace(/ /g, "").replace(/\r\n/g, "").replace(/\n/g, "").replace(/\r/g, "");
            break;
        case "htmlEp": //过滤DOM节点属性中的XSS
            return str.replace(/[&'"<>\/\\\-\x00-\x1f\x80-\xff]/g, function (r) {
                return "&#" + r.charCodeAt(0) + ";"
            });
            break;
        case "url": //过滤url
            return escape(str).replace(/\+/g, "%2B");
            break;
        case "miniUrl":
            return str.replace(/%/g, "%25");
            break;
        case "script":
            return str.replace(/[\\"']/g, function (r) {
                return "\\" + r;
            }).replace(/%/g, "\\x25").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\x01/g, "\\x01");
            break;
        case "reg":
            return str.replace(/[\\\^\$\*\+\?\{\}\.\(\)\[\]]/g, function (a) {
                return "\\" + a;
            });
            break;
        default:
            return escape(str).replace(/[&'"<>\/\\\-\x00-\x09\x0b-\x0c\x1f\x80-\xff]/g, function (r) {
                return "&#" + r.charCodeAt(0) + ";"
            }).replace(/ /g, " ").replace(/\r\n/g, "<br />").replace(/\n/g, "<br />").replace(/\r/g, "<br />");
            break;
    }
}


/***************************************
 *   右侧常见问题与快捷服务切换
 * @param   parentClass  最外层元素class
 * @param   id1  
 * @param   id2   切换的两按钮
***************************************/
function switchBtn(parentClass, id1, id2) {
    $('.' + parentClass).find('li').on('click', function (index) {
        if (!$(this).is('.active')) {
            $(this).addClass('active').siblings('li').removeClass('active');
            if ($(this).is('.' + id1)) {
                $('#' + id1).addClass('active').siblings('div').removeClass('active');
            }
            if ($(this).is('.' + id2)) {
                $('#' + id2).addClass('active').siblings('div').removeClass('active');
            }
        }

    });
}
switchBtn('switchBtnWrap', 'hotQuestion', 'quickService');

/********************************************
 *         字数统计
 * @param    className   统计字数外层元素class
 * @param    textareaId  输入框id
*********************************************/
function wordCount(className, textareaId) {
    $('#' + textareaId).on('keyup', function (e) {
        $('.' + className).find('span').html($('#' + textareaId).val().length);
    });
}
wordCount('wordCount', 'message');

/******************************
 *     人工客服快捷按钮
 * @event    askQue    s=aq接口
*******************************/
function staffService() {
    $('.staffService').on('click', function () {
        askQue('转人工服务');
    });
}
staffService();

/**
 * 聊天框自适应高度
*/
var maxSize = [960, 650],//1:1 尺寸
    autoSize = [];//实时尺寸
function set_chat_size() {
    var winW = $('body').width(),
        winH = $('body').height();

    autoSize[0] = winW >= maxSize[0] ? maxSize[0] : winW;
    autoSize[1] = winH >= maxSize[1] ? maxSize[1] : winH;

    $('.chat_wrap').css({
        'width': autoSize[0],
        'height': autoSize[1],
        'margin-left': -autoSize[0] / 2,
        'margin-top': -autoSize[1] / 2,
    });
}
function set_content_height() {
    $('.robot_content').height($('.chat_wrap').outerHeight() - $('.robot_top').outerHeight());
}
function set_chatbox_height() {
    $('#about').height($('.robot_content').outerHeight() - $('.robot_write').outerHeight());
    $('.robot_jt ul').height($('.robot_content').outerHeight() - $('.robot_write').outerHeight());
}
$(window).resize(function () {
    set_chat_size();
    set_content_height();
    set_chatbox_height();
});
set_chat_size();
set_content_height();
set_chatbox_height();