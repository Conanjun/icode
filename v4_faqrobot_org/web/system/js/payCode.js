var This = this, style = 1, code = "", pageNo1 = 1, pageSize1 = 12, isJpage1 = 0, cosImgStyle = 1, wholeid = -1;

var pageNo = 1, pageSize = 10, name = "", isJpage = 0, orderType = 2;

var chatlinklist = [];

function initSrc1() {
    Base.request({
        url: "ChatLink/list",
        params: {
            orderType: orderType,
            pageNo: pageNo,
            pageSize: pageSize
        },
        callback: function(data) {
            if (data.status) {
                Base.gritter(data.message, false);
            } else {
                var html = "";
                if (data.list[0]) {
					data.list.forEach(function(el, i){
						if (data.list[i].Id >= 5418 && data.list[i].Id <= 5745) {
							data.list[i].VisitUrl = "<!-- FAQRobot Button BEGIN -->    <script src='http://" + window.location.host + "/robot/skin/zbj/priview/14435836731645796_" + data.list[i].Id + ".js' webId='"+data.list[i].WebId+"' jid='"+data.list[i].Id+"' language='JavaScript'>    </script><!-- FAQRobot Button END   -->";
						}
					});
					chatlinklist = data.list;
                    for (var i = 0; i < data.list.length; i++) {
                        var str = "";
                        if (data.list[i].Level) {
                            str = '<a href="configuration.html?id=' + data.list[i].Id + '"><i class="timeTip one-note-payCode glyphicon glyphicon-asterisk" title="页面备注修改"></i></a>';
                        } else {
                            str = '<a><i class="timeTip one-del-payCode glyphicon glyphicon-trash"  title="删除"></i></a>';
                        }
                        switch (data.list[i].Style) {
                          case 1:
                            html += '<tr><td><div title="' + data.list[i].Info + '">' + data.list[i].Info + "</div></td><td>链接式</td><td>静态文本<td>" + (data.list[i].DescInfo || "") + '</td><td><a><i class="timeTip previewBtn glyphicon glyphicon-eye-open" title="预览"></i></a><a><i class="timeTip editBtn glyphicon glyphicon-pencil" title="编辑"></i>' + str + '</a><a><i class="timeTip getCodeBtn glyphicon glyphicon-hand-up" title="获取代码" href="#modal-getCode" data-toggle="modal"></i></a></td></tr>';
                            break;

                          case 2:
                            html += '<tr><td><img src="' + data.list[i].PicUrl + '" alt="' + data.list[i].PageName + '" title="' + data.list[i].PageName + '"></td><td>图标式</td><td>静态图片<td>' + (data.list[i].DescInfo || "") + '</td><td><a><i class="timeTip previewBtn glyphicon glyphicon-eye-open" title="预览"></i></a><a><i class="timeTip editBtn glyphicon glyphicon-pencil" title="编辑"></i>' + str + '</a><a><i class="timeTip getCodeBtn glyphicon glyphicon-hand-up" title="获取代码" href="#modal-getCode" data-toggle="modal"></i></a></td></tr>';
                            break;

                          case 3:
                            html += '<tr><td><img src="' + data.list[i].PicUrl + '" alt="' + data.list[i].PageName + '" title="' + data.list[i].PageName + '"></td><td>浮窗式</td><td>漂浮图片<td>' + (data.list[i].DescInfo || "") + '</td><td><a><i class="timeTip previewBtn glyphicon glyphicon-eye-open" title="预览"></i></a><a><i class="timeTip editBtn glyphicon glyphicon-pencil" title="编辑"></i>' + str + '</a><a><i class="timeTip getCodeBtn glyphicon glyphicon-hand-up" title="获取代码" href="#modal-getCode" data-toggle="modal"></i></a></td></tr>';
                            break;

                          case 4:
                            var iconStyle = "静态图片";
                            if (data.list[i].Mode) {
                                iconStyle = "漂浮图片";
                            }
                            html += '<tr><td><img src="' + data.list[i].PicUrl + '" alt="' + data.list[i].PageName + '" title="' + data.list[i].PageName + '"></div></td><td>自定义</td><td>' + iconStyle + "<td>" + (data.list[i].DescInfo || "") + '</td><td><a><i class="previewBtn glyphicon glyphicon-eye-open" title="预览"></i></a><a><i class="timeTip editBtn glyphicon glyphicon-pencil" title="编辑"></i>' + str + '</a><a><i class="timeTip getCodeBtn glyphicon glyphicon-hand-up" title="获取代码" href="#modal-getCode" data-toggle="modal"></i></a></td></tr>';
                            break;
                        }
                    }
                    var options = {
                        data: [ data, "list", "total" ],
                        currentPage: data.currentPage,
                        totalPages: data.totlePages ? data.totlePages : 1,
                        alignment: "right",
                        onPageClicked: function(event, originalEvent, type, page) {
                            pageNo = page;
                            initSrc1();
                        }
                    };
                    $("#itemContainer1").bootstrapPaginator(options);
                    $("#itemContainer1").css({
                        width: "100%"
                    });
                    $("#itemContainer1 ul").css({
                        "float": "right"
                    });
                } else {
                    html += '<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
                    $("#itemContainer1").empty();
                }
                $(".table tbody").empty().append(html);
                $(".timeTip").tooltip();
            }
        }
    });
}

$("body").on("click", ".previewBtn", function() {
    $(".iyunwen_js_class").remove();
    $("body").append(chatlinklist[$(this).parents("tr").index()].VisitUrl);
});

$("body").on("click", ".editBtn", function() {
	ifbOpenWindowInNewTab('/web/system/payCodeList.html?id='+chatlinklist[$(this).parents("tr").index()].Id, '获取代码');
});


var delThis = '';
$("body").on("click", ".one-del-payCode", function() {
    $('#delete').modal('show');
    delThis = this;
});

$("#deleteSave").click(function(){
    var id = chatlinklist[$(delThis).parents("tr").index()].Id;
    Base.request({
        url: "ChatLink/delete",
        params: {
            id: id
        },
        callback: function(data) {
            if (data.status) {
                Base.gritter(data.message, false);
            } else {
                Base.gritter(data.message, true);
                if ($(".one-del-payCode").length == 1) {
                    if (pageNo >= 2) {
                        pageNo -= 1;
                    }
                }
                initSrc1();
                $('#delete').modal('hide');
            }
        }
    });
})



$("body").on("click", ".one-note-payCode", function() {
    var $tr = $(this).parents("tr"), id = $tr.attr("Id");
});

$("body").on("click", ".getCodeBtn", function() {
    $(".getCodeInput").val(chatlinklist[$(this).parents("tr").index()].VisitUrl);
});

$(".simSort1").on("click", function() {
    $(".sortWord").html($(this).text() + '<span class="caret"></span>');
    orderType = 1;
    pageNo = 1;
    initSrc1();
});

$(".simSort2").on("click", function() {
    $(".sortWord").html($(this).text() + '<span class="caret"></span>');
    orderType = 2;
    pageNo = 1;
    initSrc1();
});

$(".simSort3").on("click", function() {
    $(".sortWord").html($(this).text() + '<span class="caret"></span>');
    orderType = 3;
    pageNo = 1;
    initSrc1();
});

$(".simSort4").on("click", function() {
    $(".sortWord").html($(this).text() + '<span class="caret"></span>');
    orderType = 4;
    pageNo = 1;
    initSrc1();
});
