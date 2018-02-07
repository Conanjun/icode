var This = this,
    pageNo = 1,
    //当前页
    pageSize = 10,
    //每页数量
    orderType = 1,
    isLeaf = 0,
    groupA = 0,
    groupId = 0,
    solutionType = null,
    isJpage = 0,
    //是否已实例化jpage
    answerStatus = '',
    status = '',
    queryType = 1,
    searchStr = 'question=',
    queStr = '',
    timer = null,
    sourceType = -1,
    stateType = "",
    sourceId = 0,
    question = '',
    answer = '',
    customServiceName = '',
    startTime = '',
    endTime = '',
    tsArr = [],
    selectSourceFlag = true,
    comeFrom = null;

function getComeFrom(ComeFrom) {
    return ComeFrom ? '第三方知识库' : '人工客服';
}

function getAnswerType(AnswerType) {
    switch (AnswerType) {
        case 1:
            return '新增';
            break;
        case 2:
            return '修改';
            break;
        case 3:
            return '删除';
            break;
    }
}

/*==========全部问题来源==========*/
function getQueSource(comeFrom) {
    switch (comeFrom) {
        case null:
            $('.queSourceType').html('全部问题来源&nbsp;<span class="caret"></span>');
            break;
        case 0:
            $('.queSourceType').html('客服&nbsp;<span class="caret"></span>');
            break;
        case 1:
            $('.queSourceType').html('第三方知识同步&nbsp;<span class="caret"></span>');
            break;
        case 2:
            $('.queSourceType').html('第三方知识系统回答&nbsp;<span class="caret"></span>');
            break;
    }
    listPorts();
}
//getQueSource(comeFrom);
/*=========全部问题来源选择事件===========*/
$('#queSourceUL a').on('click', function () {
    pageNo = 1;
    comeFrom = parseInt($(this).attr('data-sol'));
    if (comeFrom == -1) {
        comeFrom = null;
    }
    getQueSource(comeFrom);
});



function listPorts(confirmBtn) {
    if (confirmBtn) {
        var sValue = $('#tm1').val().split('-');
        var eValue = $('#tm2').val().split('-');
        var startT = $('[name=startT]').val();
        var endT = $('[name=endT]').val();
        if (startT && endT) {
            if ($('#tm1').val() && $('#tm2').val()) {
                $('.ttw').html(sValue[1] + '月' + sValue[2].split(' ')[0] + '日' + '-' + eValue[1] + '月' + eValue[2].split(' ')[0] + '日' + '&nbsp;<span class="caret"></span>');
            }
        } else if (!(startT || endT)) {
            //两个时间框均为空
        } else {
            //单个时间框为空
            yunNotyError("请填写完整时间范围");
            return;
        }

    }
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        url: encodeURI('../../QAToKnowledge/list?' + searchStr + queStr),
        data: {
            type: stateType,
            comeFrom: comeFrom,
            groupId: groupId,
            sourceId: sourceType,
            queryType: queryType,
            orderType: orderType,
            pageNo: pageNo,
            pageSize: pageSize,
            startTime: $('#tm1').val(),
            endTime: $('#tm2').val()
        },
        success: function (data) {
            if (data.status == 0) {
                if (data.sourceList) {
                    if (data.sourceList[0]) {
                        if (selectSourceFlag) {
                            var html = '<li><a class="sol" href="#" data-sol="-1">全部渠道</a></li>';
                            for (var m in data.sourceList) {
                                html += '<li><a class="sol" href="javascript:;" data-sol="' + data.sourceList[m].DicCode + '">' + data.sourceList[m].DicDesc + '</a></li>';
                            }
                            $('#DataSourceUL').empty().append(html);
                            $('#DataSourceUL a').on('click', function () {
                                pageNo = 1;
                                sourceType = $(this).attr('data-sol');
                                if (sourceType == '-1') {
                                    $('.sourceType').html('全部渠道<span class="caret"></span>');
                                } else {
                                    $('.sourceType').html(getSourceName(sourceType) + '<span class="caret"></span>');
                                }
                                listPorts();
                            });

                            $('#stateSourceUL a').on('click', function () {
                                pageNo = 1;
                                stateType = $(this).attr('data-sol');
                                if (stateType == '-1') {
                                    stateType = '';
                                    $('.stateType').html('全部状态 <span class="caret"></span>');
                                } else if (stateType == '1') {
                                    $('.stateType').html('新增 <span class="caret"></span>');
                                } else if (stateType == '2') {
                                    $('.stateType').html('修改 <span class="caret"></span>');
                                } else if (stateType == '3') {
                                    $('.stateType').html('删除 <span class="caret"></span>');
                                }
                                listPorts();
                            });

                            selectSourceFlag = false;
                        }
                    }
                }
                if (data.list == undefined) {
                    $("#listContainer").html('<div class="row text-center"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</div>');
                    $("#pageList").html("");
                    return;
                }
                if (data.list.length > 0) {
                    tsArr = data.list;
                    data.list.map(function (x) {
                        x.QaSource = getSourceName(x.QaSourceId);
                        x.ComeFromValue = getComeFrom(x.ComeFrom);
                        x.TypeValue = getAnswerType(x.Type);
                        x.AnswerTypeValue = getAnswerType(x.AnswerType);
                        /**
                         * taskid=517 索菲亚知识中转站客服添加问题添加到知识中站点击不了 2017/12/29
                         * 修改：当为客服添加问题时，添加到客服图标置灰
                         */
                        x.AddKnowledge = (x.ComeFrom == 2||x.ComeFrom == 0) ? false : (x.Type == 1 ? true : false);
                    });
                    var source = $("#list-item-template").html();
                    var template = Handlebars.compile(source);
                    var html = template(data);
                    $("#listContainer").html(html);
                    $('.timeTip').tooltip();
                    /*
                     * taskid = 463 农信忽略按钮只有管理员账号可以操作，子用户不可以操作忽略按钮
                     * 解决：通过user/getLoginUser接口返回对象loginUser中Level参数判断，如果为1代表管理员，其他代表子用户
                     * */
                    if(sessionStorage.getItem('level') != 1){
                        //管理员权限
                        $('.del i').css({
                            'cursor': 'not-allowed',
                            'color': 'rgb(170, 170, 170)'
                        })
                    }
                    $(".ckb").iCheck({
                        checkboxClass: "icheckbox_flat-blue",
                        radioClass: "iradio_flat-blue",
                        cursor: true
                    });
                    $("#ckAll").iCheck("uncheck");
                    $(".ckb").on("ifUnchecked", function () {
                        $("#ckAll").iCheck("uncheck");
                    });
                    $('.searchSi').click(function () {
                        var index = $(this).data("id");
                        var tTemp = tsArr.filter(function (el) {
                            return el.Id == index;
                        });
                        $.get("../../question/isExistQue", 'question=' + encodeURI(tTemp[0].Question) + '&level=1', function (data) {
                            if (data.status === 0 && data.result) {
                                var result = JSON.parse(data.result);
                                if (result.getCheckQue && result.getCheckQue.length > 0) {
                                    var html = [];
                                    for (var i = 0; i < result.getCheckQue.length; i++) {
                                        var curList = result.getCheckQue;
                                        if (curList[i].matchQuestion) {
                                            html.push('<div class="m-5">' + curList[i].matchQuestion.question + '</div>');
                                        }
                                    }
                                    $('#similarQuestionContainer').html(html.join(''));
                                    $('#similarQuestion').modal('show');
                                } else {
                                    yunNotyError('该问题没有相似问法!');
                                }
                            } else {
                                yunNotyError('该问题没有相似问法!');
                            }
                        });
                    });
                    //添加到知识库
                    $('.add').on('click', function (e) {
                        var src = e.target || window.event.srcElement;
                        var id = $(src).parent().attr('data-id');
                        if ($(src).attr('data-comefrom') != 2) {
                            var addUrl = '../../landray/LandrayQuestion/editQues';
                        } else {
                            var addUrl = '../../landray/LandrayQuestion/editStatusByIds';
                        }
                        $.ajax({
                            url: addUrl,
                            data: {
                                ids: id,
                                status: 3
                            },
                            dataType: 'json',
                            cache: false,
                            type: 'post',
                            success: function (data) {
                                if (data.status == 0) {
                                    yunNoty(data);
                                    listPorts();
                                } else {
                                    yunNotyError(data.message);
                                }
                            }
                        });
                    });

                    //编辑
                    $(".edit").click(function (e) {
                        var src = e.target || window.event.srcElement;
                        var learnQueId = $(src).parent().attr('data-learnQueId');
                        var index = $(this).data("id");
                        var tTemp = tsArr.filter(function (el) {
                            return el.Id == index;
                        });

                        if (sessionStorage) {
                            sessionStorage.setItem("ts_tsItem", JSON.stringify(tTemp[0]));
                        }
                        if (tTemp[0].ComeFrom == 0) {
                            // 人工客服
                        /**
                             * taskid=517 索菲亚知识中转站客服添加问题添加到知识中站点击不了 2017/12/29
                             * 原因：当为客服添加问题时，未传ComeForm参数导致报错
                             * 修改：追加ComeForm参数
                             */
                            ifbOpenWindowInNewTab('/web/knowledge/transferStationAdd.html?ComeFrom=0&tsFlag=true&tmpNum=' + tmpNum, '新增知识');
                            return;
                        }
                        // 第三方知识库     第三方知识系统回答
                        //点击处理先判断是不是来自第三方的，如果是，需要请求getQueList，根据接口返回的status为1，提示信息，为0进入下面的页面----xgn20170818
                        if (tTemp[0].ComeFrom == 1 || tTemp[0].ComeFrom == 2) {
                            $.ajax({
                                url: '../../landray/LandrayQuestion/getQueList',
                                type: 'post',
                                data: {
                                    id: index,//新增一个参数当前数据的id
                                    type: tTemp[0].Type,
                                    comeFrom: tTemp[0].ComeFrom,
                                    comeGroupId: tTemp[0].ComeGroupId,
                                    comeQuestionId: tTemp[0].ComeId
                                },
                                dataType: 'json',
                                success: function (data) {
                                    if (data.status == 1) {
                                        yunNoty(data);
                                    } else {
                                        if (tTemp[0].ComeFrom == 1) {
                                            if (tTemp[0].Type == 1) {
                                                ifbOpenWindowInNewTab('/web/knowledge/transferStationAdd.html?tsFlag=true&ComeFrom=1&tmpNum=' + tmpNum, '新增知识');
                                            } else if (tTemp[0].Type == 2) {
                                                ifbOpenWindowInNewTab('/web/knowledge/transferStationEdit.html?tsFlag=true&ComeFrom=1&tmpNum=' + tmpNum + '&time=' + Date.parse(new Date()), '修改答案');
                                            } else if (tTemp[0].Type == 3) {
                                                ifbOpenWindowInNewTab('/web/knowledge/transferStationEdit.html?del=1&ComeFrom=1&tmpNum=' + tmpNum, '删除问题');
                                            }
                                        } else if (tTemp[0].ComeFrom == 2) {
                                            if (tTemp[0].Type == 1) {
                                                ifbOpenWindowInNewTab('/web/knowledge/transferStationAdd.html?tsFlag=true&ComeFrom=2&tmpNum=' + tmpNum + '&learnQueId=' + learnQueId, '新增知识');
                                            } else if (tTemp[0].Type == 2) {
                                                ifbOpenWindowInNewTab('/web/knowledge/transferStationEdit.html?tsFlag=true&ComeFrom=2&tmpNum=' + tmpNum + '&time=' + Date.parse(new Date()), '修改答案');
                                            } else if (tTemp[0].Type == 3) {
                                                ifbOpenWindowInNewTab('/web/knowledge/transferStationEdit.html?del=1&ComeFrom=2&tmpNum=' + tmpNum, '删除问题');
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    });

                    //单个删除
                    $('.del').on('click', function () {
                        var self = this;
                        /*
                        * taskid = 463 农信忽略按钮只有管理员账号可以操作，子用户不可以操作忽略按钮
                        * 解决：通过user/getLoginUser接口返回对象loginUser中Level参数判断，如果为1代表管理员，其他代表子用户
                        * */
                        if(sessionStorage.getItem('level') == 1){
                            $(self).adcCreator(function () {
                                var index = $(self).data("id");
                                var tTemp = tsArr.filter(function (el) {
                                    return el.Id == index;
                                });
                                if (tTemp[0].ComeFrom == 0) {
                                    Base.request({
                                        url: 'QAToKnowledge/editByQAIds',
                                        params: {
                                            ids: $(self).data('id'),
                                            isShow: 1
                                        },
                                        callback: function (data) {
                                            if (data.status) {
                                                Base.gritter(data.message, false);
                                            } else {
                                                Base.gritter(data.message, true);
                                                isJpage = 0;
                                            }
                                            listPorts();
                                        }
                                    });
                                } else if (tTemp[0].ComeFrom == 1) {
                                    $.ajax({
                                        url: '../../landray/LandrayQuestion/editQueStatus',
                                        type: 'post',
                                        data: {
                                            type: tTemp[0].Type,
                                            comeQuestionId: tTemp[0].ComeId,
                                            id: tTemp[0].Id,
                                            status: 2
                                        },
                                        dataType: 'json',
                                        success: function (data) {
                                            yunNoty(data);
                                            listPorts();
                                        }
                                    });
                                } else if (tTemp[0].ComeFrom == 2) {
                                    $.ajax({
                                        url: '../../landray/LandrayQuestion/editStatusByIds',
                                        type: 'post',
                                        data: {
                                            ids: tTemp[0].Id,
                                            status: 2
                                        },
                                        dataType: 'json',
                                        success: function (data) {
                                            yunNoty(data);
                                            listPorts();
                                        }
                                    });
                                }
                            }, undefined, {
                                title: '确认忽略？',
                                content: '您确定要忽略该知识吗？此操作会忽略该知识后续的所有操作。'
                            });
                        }
                    });
                    var options = {
                        data: [data, "list", "total"],
                        currentPage: data.currentPage,
                        totalPages: data.totlePages,
                        onPageClicked: function (event, originalEvent, type, page) {
                            pageNo = page;
                            listPorts();
                        }
                    };
                    setPage("pageList", options);
                } else {
                    $("#listContainer").html('<div class="row text-center"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</div>');
                    $("#pageList").html("");
                }
            } else {
                yunNoty(data);
                if (data.list == undefined) {
                    $("#listContainer").html('<div class="row text-center"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</div>');
                    $("#pageList").html("");
                    return;
                }
            }
        }
    });
}
//移动分类

function yyidongfenlei() {
    var ids = [];

    $('.ckb').each(function () {
        if ($(this).is(':checked')) {
            ids.push($(this).data('id'));
        }
    });

    if (!ids.toString()) {
        Base.gritter('您未选择需要移动的问题', false);
        return false;
    }
    $('#YDConfirm').modal('show');
}

function piliangshanchu() {
    var ids = [];

    $('.ckb').each(function () {
        if ($(this).is(':checked')) {
            ids.push($(this).data('id'));
        }
    });

    if (!ids.toString()) {
        Base.gritter('您未选择需要删除的问题', false);
        return false;
    }
    $('#pcConfirm').modal('show');
}
//移动分类确认
$('#YDYes').on('click', function () {
    var ids = [];

    $('.ckb').each(function () {
        if ($(this).is(':checked')) {
            ids.push($(this).data('id'));
        }
    });

    if (ids.toString()) {
        Base.request({
            url: 'QAToKnowledge/editByQAIds',
            params: {
                ids: ids.toString(),
                groupId: $('#YDGroupId').val() - 1
            },
            callback: function (data) {
                $('#YDConfirm').modal('hide');
                if (data.status) {
                    Base.gritter(data.message, false);
                } else {
                    Base.gritter(data.message, true);
                    isJpage = 0;
                    listPorts();
                }
            },
        });
    } else {
        Base.gritter('您未选择需要移动的问题', false);
    }
});
$('#pcYes').on('click', function () {
    var ids = [];

    $('.ckb').each(function () {
        if ($(this).is(':checked')) {
            ids.push($(this).data('id'));
        }
    });

    if (ids.toString()) {
        Base.request({
            url: 'QAToKnowledge/editByQAIds',
            params: {
                ids: ids.toString(),
                isShow: 1
            },
            callback: function (data) {
                $('#pcConfirm').modal('hide');
                if (data.status) {
                    Base.gritter(data.message, false);
                } else {
                    Base.gritter(data.message, true);
                    isJpage = 0;
                    listPorts();
                }
            },
        });
    } else {
        Base.gritter('您未选择需要删除的问题', false);
    }
});


$('.confirm').click(function () {
    $('#myDropdown').parent().removeClass('open');
    //$('.btnSearch').trigger('click');
});
//全局变量 获得当前时间
var myDate = new Date();
var myDateM = myDate.getMonth() + 1; //月
var myDateD = myDate.getDate(); //日
var myDateHou = myDate.getHours(); //时
var myDateMin = myDate.getMinutes() + 2; //分
function updateTime() {
    myDate = new Date();
    myDateM = myDate.getMonth() + 1;//月
    myDateD = myDate.getDate();//日
    myDateHou = myDate.getHours();//时
    myDateMin = myDate.getMinutes() + 2;//分
}
if (myDateM < 10) { //判断现在月份格式
    myDateM = "0" + myDateM;
}
if (myDateD < 10) { //判断现在日期格式
    myDateD = "0" + myDateD;
}
if (myDateHou < 10) { //判断现在小时格式
    myDateHou = "0" + myDateHou;
}
if (myDateMin < 10) { //判断现在分钟格式
    myDateMin = "0" + myDateMin;
}
//页面初始化 默认一周自动填充时间

function apply() { //获取一周前时间
    var newDatew = new Date();
    newDatew.setTime(newDatew.getTime() - 7 * 24 * 60 * 60 * 1000); //此时newDatew变成了一周前的时间
    var weekMon = newDatew.getMonth() + 1; //一周前的月份
    if (weekMon < 10) {
        weekMon = '0' + (newDatew.getMonth() + 1)
    };
    var weekDay = newDatew.getDate(); //一周前的日
    if (weekDay < 10) {
        weekDay = '0' + newDatew.getDate()
    };
    var week = newDatew.getFullYear() + "-" + weekMon + "-" + weekDay;
    $('#tm1').val(week + ' ' + myDateHou + ':' + myDateMin); //一周前的现在
    $('#tm2').val(myDate.getFullYear() + '-' + myDateM + '-' + myDateD + ' ' + myDateHou + ':' + myDateMin); //今天的时间
    getQueSource(comeFrom);
}
apply();

//获得上月今天的方法

function lastMonthDate() {
    var vYear = myDate.getFullYear();
    var vMon = myDate.getMonth() + 1;
    var vDay = myDate.getDate();
    //每个月的最后一天日期（为了使用月份便于查找，数组第一位设为0）
    var daysInMonth = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    if (vMon == 1) {
        vYear = myDate.getFullYear() - 1;
        vMon = 12;
    } else {
        vMon = vMon - 1;
    }
    //若是闰年，二月最后一天是29号
    if (vYear % 4 == 0 && vYear % 100 != 0) {
        daysInMonth[2] = 29;
    }
    if (daysInMonth[vMon] < vDay) {
        vDay = daysInMonth[vMon];
    }
    if (vDay < 10) {
        vDay = "0" + vDay;
    }
    if (vMon < 10) {
        vMon = "0" + vMon;
    }
    var LastMonthDate = vYear + "-" + vMon + "-" + vDay;
    return LastMonthDate;
}
$('#myDropdown').on('click', function () {
    $(this).parent().addClass('open');
});
$('body').on('click', function (e) {
    if (!$('#myDropdown').parent().find($(e.target)).length) {
        $('#myDropdown').parent().removeClass('open');
    }
});

$('.ttw0').on('click', function () { //昨天
    updateTime();
    $('#myDropdown').parent().removeClass('open');
    $(this).addClass("open").siblings().removeClass("open");
    var newDate1 = new Date(); //获取当前时间
    newDate1.setTime(newDate1.getTime() - 24 * 60 * 60 * 1000); //当前时间设置成昨天时间
    var yestM = newDate1.getMonth() + 1; //昨天的月
    if (yestM < 10) {
        yestM = "0" + yestM;
    }
    var yestD = newDate1.getDate(); //昨天的日
    if (yestD < 10) {
        yestD = "0" + yestD;
    }
    var yesterday = newDate1.getFullYear() + "-" + yestM + "-" + yestD;
    $('.ttw').html($(this).text() + '&nbsp;&nbsp;<span class="caret"></span>');
    $('#tm1').val(yesterday + ' ' + '00' + ':' + '00'); //昨天的时间
    $('#tm2').val(new Date().getFullYear() + '-' + myDateM + '-' + myDateD + ' ' + '00' + ':' + '00'); //现在的时间
    listPorts();
});

$('.ttw1').on('click', function () { //今天
    updateTime();
    $('#myDropdown').parent().removeClass('open');
    $(this).addClass("open").siblings().removeClass("open");
    $('.ttw').html($(this).text() + '&nbsp;&nbsp;<span class="caret"></span>');
    $('#tm1').val(myDate.getFullYear() + '-' + myDateM + '-' + myDateD + ' ' + '00' + ':' + '00'); //今天零点
    $('#tm2').val(myDate.getFullYear() + '-' + myDateM + '-' + myDateD + ' ' + myDateHou + ':' + myDateMin); //现在时间
    listPorts();
});

$('.ttw2').on('click', function () { //最近七天
    updateTime();
    $('#myDropdown').parent().removeClass('open');
    $(this).addClass("open").siblings().removeClass("open");
    $('.ttw').html($(this).text() + '&nbsp;&nbsp;<span class="caret"></span>');
    apply();
});
$('.ttw3').on('click', function () { //最近一个月
    updateTime();
    $('#myDropdown').parent().removeClass('open');
    $(this).addClass("open").siblings().removeClass("open");
    $('.ttw').html($(this).text() + '&nbsp;&nbsp;<span class="caret"></span>');
    $('#tm1').val(lastMonthDate() + ' ' + myDateHou + ':' + myDateMin); //一月前的今天
    $('#tm2').val(new Date().getFullYear() + '-' + myDateM + '-' + myDateD + ' ' + myDateHou + ':' + myDateMin); //现在时间
    listPorts();
});
$('.ttw4').on('click', function () { //全部
    updateTime();
    $('#myDropdown').parent().removeClass('open');
    $(this).addClass("open").siblings().removeClass("open");
    $('.ttw').html($(this).text() + '&nbsp;&nbsp;<span class="caret"></span>');
    pageNo = 1;
    $('#tm1').val('');
    $('#tm2').val('');
    listPorts();
});
$(document).ready(function () {
    var tmpNum = parent.$('#tabHeader li[data-tab="' + location.href + '"]').attr('data-num'); //获取当前url中的data-num

    $('#ckAll').on('ifClicked', function () {
        var ckbs = $('.ckb');
        if ($(this)[0].checked) {
            ckbs.iCheck('uncheck');
        } else {
            ckbs.iCheck('check');
        }
    });
    iframeTab.init({
        iframeBox: ''
    });

    setInterval(function () {
        var ids = [];

        $('.ckb').each(function () {
            if ($(this).is(':checked')) {
                ids.push($(this).data('id'));
            }
        });

        if (!ids.toString()) {
            $('.multYDQue').css('cursor', 'not-allowed').css('color', '#aaa');
            $('.multYDQue').off('click', yyidongfenlei);
            $('.multDelQue').css('cursor', 'not-allowed').css('color', '#aaa');
            $('.multDelQue').off('click', piliangshanchu);
        } else {
            $('.multYDQue').css('cursor', 'pointer').css('color', '#666');
            $('.multYDQue').off('click', yyidongfenlei).on('click', yyidongfenlei);
            $('.multDelQue').css('cursor', 'pointer').css('color', '#666');
            $('.multDelQue').off('click', piliangshanchu).on('click', piliangshanchu);
        }
    }, 500);
    //生成移动分类树
    var settingEdit = {
        data: {
            simpleData: {
                enable: true
            }
        },
        view: {
            selectedMulti: false,
            showIcon: false
        },
        callback: {
            onClick: function (event, treeId, treeNode, clickFlag) {
                if (treeNode) {
                    $('#YDGroupId').val(treeNode.id);
                }
            },
            beforeClick: function (treeId, treeNode, clickFlag) {
                if (treeNode.isParent == true) {
                    Base.gritter('问题不能移动到父分类下', false);
                    return false;
                }
            },
            onDblClick: function (event, treeId, treeNode) {
                $('#YDYes').trigger('click');
            }
        }
    };
    var setting1 = {
        data: {
            simpleData: {
                enable: true,
            }
        },
        view: { //不显示图标
            showIcon: false
        },
        callback: {
            onClick: function (event, treeId, treeNode) {
                //存选中的节点id，以便刷新后重新check
                if (sessionStorage) {
                    // sessionStorage.setItem('pp_selectedNodeId', treeNode.id);
                }
                treeObj = $.fn.zTree.getZTreeObj(treeId);
                // var array = treeObj.getNodesByFilter(filterP, false, treeNode);
                // if (array.length > 0) {
                // groupId = '';
                // for (var i in array) {
                // groupId += (array[i].id - 1) + ',';
                // }
                // } else {
                // groupId = treeNode.id - 1;
                // }
                groupId = treeNode.id - 1;
                isJpage = 0;
                pageNo = 1;
                listPorts();
            },
        }
    };

    function filterP(node) {
        return (node.isParent == false);
    }
    if (!window.classes) {
        //获取问题分类
        Base.request({
            url: 'classes/listClasses',
            params: {
                m: 0,
            },
            callback: function (data) {
                if (data.status) {
                    Base.gritter(data.message, false);
                } else {
                    window.classes = true;
                    var html = '';
                    if (data.list[0]) {
                        var formatData = [],
                            len = data.list.length;
                        for (var key in data.list) {
                            formatData[key] = {};
                            formatData[key]['name'] = data.list[key]['Name'];
                            formatData[key]['pId'] = data.list[key]['ParentId'] + 1;
                            formatData[key]['id'] = data.list[key]['Id'] + 1;
                        }

                        formatData[len] = {};
                        formatData[len]['name'] = '全部分类';
                        formatData[len]['pId'] = 0;
                        formatData[len]['id'] = 1;
                        formatData[len]['open'] = true;

                        $.fn.zTree.init($("#ztree1"), setting1, formatData);
                        $.fn.zTree.init($("#treeeClasses"), settingEdit, formatData);
                        treeObj = $.fn.zTree.getZTreeObj("ztree1");
                        if (!groupId) { // 链接中有groupId
                            // var array = treeObj.getNodesByFilter(filterP);
                            // if (array.length > 0) {
                            // groupId = '';
                            // for (var i in array) {
                            // groupId += (array[i].id - 1) + ',';
                            // }
                            // } else {
                            // groupId = treeNode.id - 1;
                            // }
                            // groupId = treeNode.id - 1;
                        }
                        if (sessionStorage.getItem("pp_selectedNodeId")) {
                            var treeObj = $.fn.zTree.getZTreeObj("ztree1");
                            var node = treeObj.getNodeByParam("id", sessionStorage.getItem("pp_selectedNodeId"), null);
                            if (node) {
                                treeObj.selectNode(node);
                            }
                        }
                        //listPorts();
                    }
                }
            },
        });
    }
    //搜索
    $('.btnSearch').on('click', function () {
        pageNo = 1;
        isJpage = 0;
        queStr = $('.searchBy').val();
        listPorts();
    });
    $('.sortQue').on('click', function () {
        $('.sortWord2').html($(this).text() + '&nbsp;' + '<span class="caret"></span>');
        pageNo = 1;
        isJpage = 0;
        searchStr = 'question=';
        queStr = $('.searchBy').val();
        question = $('.searchBy').val();
        answer = '';
        customServiceName = '';
        queryType = 1;
        //listPorts();
    });
    $('.sortAns').on('click', function () {
        $('.sortWord2').html($(this).text() + '&nbsp;' + '<span class="caret"></span>');
        pageNo = 1;
        isJpage = 0;
        searchStr = 'answer=';
        queStr = $('.searchBy').val();
        question = '';
        answer = $('.searchBy').val();
        customServiceName = '';
        queryType = 2;
        //listPorts();
    });
    $('.sortKf').on('click', function () {
        $('.sortWord2').html($(this).text() + '&nbsp;' + '<span class="caret"></span>');
        pageNo = 1;
        isJpage = 0;
        searchStr = 'customServiceName=';
        queStr = $('.searchBy').val();
        question = '';
        answer = '';
        customServiceName = $('.searchBy').val();
        queryType = 3;
        //listPorts();
    });


    // 数据数滑块
    $('#affix1inner').slimScroll({
        height: $(window).height() - 290 + 'px',
        allowPageScroll: false
    });
    //ENTER
    $(document).on('keyup', function (e) {
        var $activeEl = $(document.activeElement);

        queStr = $('.searchBy').val();
        if ($activeEl.is('.searchBy') && (e.keyCode == 13 || e.keyCode == 108)) {
            listPorts();
        }
    });

    //跳转
    $('.goPage-addSrc1 a').on('click', function () {
        $('.holder1').jPages(parseInt($('.goPage-addSrc1 input').val()));
        return false;
    });

    //全选
    $('.goPage-addSrc1 input').on('focus', function () {
        $(this).select();
    });

    //排序
    $('.sort1').on('click', function () { //默认排序
        $('.sortWord').html($(this).text() + '<span class="caret"></span>');
        status = '';
        orderType = 2;
        pageNo = 1;
        listPorts();
    });
    $('.sort2').on('click', function () { //时间正序
        $('.sortWord').html($(this).text() + '<span class="caret"></span>');
        status = '';
        orderType = 1;
        pageNo = 1;
        listPorts();
    });
    $('.sort3').on('click', function () { //时间倒序
        $('.sortWord').html($(this).text() + '<span class="caret"></span>');
        status = '';
        orderType = 2;
        pageNo = 1;
        listPorts();
    });
    $('.sort4').on('click', function () { //浏览量正序
        $('.sortWord').html($(this).text() + '<span class="caret"></span>');
        status = '';
        orderType = 3;
        pageNo = 1;
        listPorts();
    });
    $('.sort5').on('click', function () { //浏览量倒序
        $('.sortWord').html($(this).text() + '<span class="caret"></span>');
        status = '';
        orderType = 4;
        pageNo = 1;
        listPorts();
    });


    //展开所有
    $('.openAll').on('click', function () {
        var treeObj = $.fn.zTree.getZTreeObj("ztree1");
        treeObj.expandAll(true);
    });
    //折叠所有
    $('.closeAll').on('click', function () {
        var treeObj = $.fn.zTree.getZTreeObj("ztree1");
        treeObj.expandAll(false);
    });

    //展开所有
    $('.openAll2').on('click', function () {
        var treeObj2 = $.fn.zTree.getZTreeObj("ztree2");
        treeObj2.expandAll(true);
    });
    //折叠所有
    $('.closeAll2').on('click', function () {
        var treeObj2 = $.fn.zTree.getZTreeObj("ztree2");
        treeObj2.expandAll(false);
    });

    //展开所有
    $('.openAll3').on('click', function () {
        var treeObj3 = $.fn.zTree.getZTreeObj("ztree3");
        treeObj3.expandAll(true);
    });
    //折叠所有
    $('.closeAll3').on('click', function () {
        var treeObj3 = $.fn.zTree.getZTreeObj("ztree3");
        treeObj3.expandAll(false);
    });
});