function getTimeName (value) {
    if (value == 1) {
        return '最近12小时'
    }
    if (value == 2) {
        return '最近24小时'
    }
    if (value == 3) {
        return '昨天'
    }
    if (value == 4) {
        return '最近7天'
    }
    if (value == 5) {
        return '最近30天'
    }
    return ''
}

function getFullHour (hour) {
    if (hour < 10) {
        return '0' + hour + ':00'
    } else {
        return hour + ':00'
    }
}

/*
	生成下拉列表，页面加载完成后执行
*/
function selectGen () {
    $('#DataSource .selectpicker').selectpicker({
        style: 'btn-primary',
        width: '100%'
    })
    $('#DataSource .selectpicker').on('change', function () {
        sourceType($(this).val())
    })
    $('#byTimePiece .selectpicker').selectpicker({
        style: 'btn-primary',
        width: '100%'
    })
    $('#byTimePiece .selectpicker').on('change', function () {
        queryDays($(this).val())
    })
    $('#myDropdown').on('click', function () {
        $(this).parent().addClass('open')
    })
    $('body').on('click', function (e) {
        if (!$('#myDropdown').parent().find($(e.target)).length) {
            $('#myDropdown').parent().removeClass('open')
        }
    })
}

function selectGen_new () {
    $('#DataSource .selectpicker').selectpicker({
        style: 'btn-primary',
        width: '100%'
    })
    $('#DataSource .selectpicker').on('change', function () {
        queryAll()
    })
    $('#byTimePiece .selectpicker').selectpicker({
        style: 'btn-primary',
        width: '100%'
    })
    $('#byTimePiece .selectpicker').on('change', function () {
        queryAll()
    })


    //全局变量 获得当前时间
    var myDate = new Date()
    var myDateM = myDate.getMonth() + 1//月
    var myDateD = myDate.getDate()//日
    var myDateHou = myDate.getHours()//时
    var myDateMin = myDate.getMinutes() + 2//分


    if (myDateM < 10) {//判断现在月份格式
        myDateM = '0' + myDateM
    }
    if (myDateD < 10) {//判断现在日期格式
        myDateD = '0' + myDateD
    }
    if (myDateHou < 10) {//判断现在小时格式
        myDateHou = '0' + myDateHou
    }
    if (myDateMin < 10) {//判断现在分钟格式
        myDateMin = '0' + myDateMin
    }


    function updateTime(){
        myDate = new Date()
        myDateM = myDate.getMonth() + 1//月
        myDateD = myDate.getDate()//日
        myDateHou = myDate.getHours()//时
        myDateMin = myDate.getMinutes() + 2//分
        if (myDateM < 10) {//判断现在月份格式
            myDateM = '0' + myDateM
        }
        if (myDateD < 10) {//判断现在日期格式
            myDateD = '0' + myDateD
        }
        if (myDateHou < 10) {//判断现在小时格式
            myDateHou = '0' + myDateHou
        }
        if (myDateMin < 10) {//判断现在分钟格式
            myDateMin = '0' + myDateMin
        }
    }


    //页面初始化 默认一周自动填充时间
    function apply () {//获取一周前时间
        var newDatew = new Date()
        newDatew.setTime(newDatew.getTime() - 7 * 24 * 60 * 60 * 1000)//此时newDatew变成了一周前的时间
        var weekMon = newDatew.getMonth() + 1//一周前的月份
        if (weekMon < 10) {weekMon = '0' + (newDatew.getMonth() + 1)}

        var weekDay = newDatew.getDate()//一周前的日
        if (weekDay < 10) {weekDay = '0' + newDatew.getDate()}

        var week = newDatew.getFullYear() + '-' + weekMon + '-' + weekDay
        $('#tm1').val(week + ' ' + myDateHou + ':' + myDateMin)//一周前的现在
        $('#tm2').val(myDate.getFullYear() + '-' + myDateM + '-' + myDateD + ' ' + myDateHou + ':' + myDateMin)//今天的时间
    }

    apply()

    //获得上月今天的方法
    function lastMonthDate () {
        var vYear = myDate.getFullYear()
        var vMon = myDate.getMonth() + 1
        var vDay = myDate.getDate()
        //每个月的最后一天日期（为了使用月份便于查找，数组第一位设为0）
        var daysInMonth = new Array(0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31)
        if (vMon == 1) {
            vYear = myDate.getFullYear() - 1
            vMon = 12
        } else {
            vMon = vMon - 1
        }
        //若是闰年，二月最后一天是29号
        if (vYear % 4 == 0 && vYear % 100 != 0) {
            daysInMonth[2] = 29
        }
        if (daysInMonth[vMon] < vDay) {
            vDay = daysInMonth[vMon]
        }
        if (vDay < 10) {
            vDay = '0' + vDay
        }
        if (vMon < 10) {
            vMon = '0' + vMon
        }
        var LastMonthDate = vYear + '-' + vMon + '-' + vDay
        return LastMonthDate
    }

    $('#myDropdown').on('click', function () {
        $(this).parent().addClass('open')
    })
    $('body').on('click', function (e) {
        if (!$('#myDropdown').parent().find($(e.target)).length) {
            $('#myDropdown').parent().removeClass('open')
        }
    })

    $('.ttw0').on('click', function () { //昨天
        updateTime();
        $('#myDropdown').parent().removeClass('open')
        $(this).addClass('open').siblings().removeClass('open')
        var newDate1 = new Date()//获取当前时间
        newDate1.setTime(newDate1.getTime() - 24 * 60 * 60 * 1000)//当前时间设置成昨天时间
        var yestM = newDate1.getMonth() + 1 //昨天的月
        if (yestM < 10) {
            yestM = '0' + yestM
        }
        var yestD = newDate1.getDate()//昨天的日
        if (yestD < 10) {
            yestD = '0' + yestD
        }
        var yesterday = newDate1.getFullYear() + '-' + yestM + '-' + yestD
        $('.ttw').html($(this).text() + '&nbsp;&nbsp;<span class="caret"></span>')
        $('#tm1').val(yesterday + ' ' + '00' + ':' + '00')//昨天的时间
        $('#tm2').val(new Date().getFullYear() + '-' + myDateM + '-' + myDateD + ' ' + '00' + ':' + '00')//现在的时间
        queryAll()
    })

    $('.ttw1').on('click', function () { //今天
        updateTime();
        $('#myDropdown').parent().removeClass('open')
        $(this).addClass('open').siblings().removeClass('open')
        $('.ttw').html($(this).text() + '&nbsp;&nbsp;<span class="caret"></span>')
        $('#tm1').val(myDate.getFullYear() + '-' + myDateM + '-' + myDateD + ' ' + '00' + ':' + '00')//今天零点
        $('#tm2').val(myDate.getFullYear() + '-' + myDateM + '-' + myDateD + ' ' + myDateHou + ':' + myDateMin)//现在时间
        queryAll()
    })

    $('.ttw2').on('click', function () { //最近七天
        updateTime();
        $('#myDropdown').parent().removeClass('open')
        $(this).addClass('open').siblings().removeClass('open')
        $('.ttw').html($(this).text() + '&nbsp;&nbsp;<span class="caret"></span>')
        apply()
        queryAll()
    })
    $('.ttw3').on('click', function () { //最近一个月
        updateTime();
        $('#myDropdown').parent().removeClass('open')
        $(this).addClass('open').siblings().removeClass('open')
        $('.ttw').html($(this).text() + '&nbsp;&nbsp;<span class="caret"></span>')
        $('#tm1').val(lastMonthDate() + ' ' + myDateHou + ':' + myDateMin)//一月前的今天
        $('#tm2').val(new Date().getFullYear() + '-' + myDateM + '-' + myDateD + ' ' + myDateHou + ':' + myDateMin)//现在时间
        queryAll()
    })
    $('.ttw4').on('click', function () { //全部
        $('#myDropdown').parent().removeClass('open')
        $(this).addClass('open').siblings().removeClass('open')
        $('.ttw').html($(this).text() + '&nbsp;&nbsp;<span class="caret"></span>')
        $('#tm1').val('')
        $('#tm2').val('')
        queryAll()
    })
}

var selectSourceFlag = true
var queryAll_Flag = true

function queryAll (pageNo, confirmBtn) {
    if (confirmBtn) {
        var sValue = $('#tm1').val().split('-')
        var eValue = $('#tm2').val().split('-')
        $('.ttw').html(sValue[1] + '月' + sValue[2].split(' ')[0] + '日' + '-' + eValue[1] + '月' + eValue[2].split(' ')[0] + '日' + '&nbsp;<span class="caret"></span>')
    }
    /*
     * 必须的参数
     */
    //请求url
    var url = $('#saveURL').val()
    //从html中获取报表标题
    var title = $('.page-header-span').html()

    /*
     * 可选的参数
     */
    //数据来源
    var sourceId = $('#DataSource .selectpicker').val()
    //未知问题是否处理，仅用于未知问题页面
    var saveUnQuestionType = $('#byUnknown .selectpicker').val()
    //全部处理状态，仅用于未知问题页面
    var saveUnQuestionType2 = $('#byUnknown2 .selectpicker').val()
    //可选择（全部，新访客，老访客），仅用于总体次数统计
    var saveloadTimes = $('#byloadTimes .selectpicker').val()
    //可选择（全部，有效访客，无效访客），仅用于总体次数统计
    var savelogItems = $('#bylogItems .selectpicker').val()
    //可选择（全部，业务，聊天），仅用于问题匹配率和题库满意度
    var saveisBusiness = $('#byisBusiness .selectpicker').val()
    //可选择（全部，文本，语音），仅用于问题匹配率无限极定制
    var savebyChatType = $('#byChatType .selectpicker').val()
    //可选择（全部客服，第三方客服，云问客服），仅用于转人工次数统计
    var saveCusSer = $('#DTT .selectpicker').val()
    //可选择（未知问题，智能学习），仅用于问题处理工作量统计
    var saveunt = $('#untrue .selectpicker').val()
    //排序loginSummary.html
    var orderLS = $('#saveOrderType').val()

    /*Amend by zhaoyuxing At 20171213
    *taskId：332 无限极定制，增加子公司筛选条件loginSummary_wxj.html
    *说明： 选择子公司时，将下拉框中的内容存入companys变量中
    */
    var companys=$('#branchOffice .selectpicker').val();
    /*taskId:418  自如定制报表 evalution_zr.html
    *自如报表，则增加字段customerType
    * */
    var customerType=$('#evalZR').val();
    //拼装参数
    var dataJSON = {}
    if (0) {
        //时间段
        dataJSON.timeSelect = $('#byTimePiece .selectpicker').val()
    } else if (1) {
        //精确时间
        var STime = $('[name=startT]').val()
        var ETime = $('[name=endT]').val()
        var d1 = new Date(STime.replace(/\-/g, '\/')).getTime()
        var d2 = new Date(ETime.replace(/\-/g, '\/')).getTime()
        if (STime === '' || ETime === '') {
        } else if (STime !== '' && ETime !== '' && d1 >= d2) {
            yunNotyError('开始时间不能大于结束时间！')
            return false
        } else {
            dataJSON.startT = STime
            dataJSON.endT = ETime
            //url+='?startT=' + STime + '&endT=' + ETime;
        }
    }
    //url+='?timeSelect=' + $('#byTimePiece .selectpicker').val();

    if (sourceId !== undefined) {
        //url+='&sourceId='+sourceId;
        dataJSON.sourceId = sourceId
    }
    if (orderLS !== undefined) {
        dataJSON.orderType = orderLS
    }
    if ($('#pageList li.active a').length > 0) {
        //url+='&pageNo='+$('#pageList li.active a').html();
        dataJSON.pageNo = $('#pageList li.active a').html()
        dataJSON.pageSize = 10
    }
    if ($('#saveURL').val() == '../../Advertise/ReportList') {
        dataJSON.pageNo = $('#pageNo').val()
        dataJSON.pageSize = 30
    }
    if (pageNo) {
        dataJSON.pageNo = pageNo
        dataJSON.pageSize = 10
    }
    if (saveUnQuestionType) {
        //url+='&fixMode='+saveUnQuestionType;
        dataJSON.fixMode = saveUnQuestionType
    }
    if (saveUnQuestionType2) {
        //url+='&fixMode='+saveUnQuestionType;
        dataJSON.mode = saveUnQuestionType2
    }
    if (saveloadTimes) {
        //url+='&loadTimes='+saveloadTimes;
        dataJSON.loadTimes = saveloadTimes
    }
    if (savelogItems) {
        //url+='&logItems='+savelogItems;
        dataJSON.logItems = savelogItems
    }
    if (saveisBusiness) {
        //url+='&isBusiness='+saveisBusiness;
        dataJSON.isBusiness = saveisBusiness
    }
    if (savebyChatType) {
        //url+='&msgType='+savebyChatType;
        dataJSON.msgType = savebyChatType
    }
    if (saveCusSer) {
        //url+='&CustomType ='+saveCusSer;
        dataJSON.CustomType = saveCusSer
    }
    if (saveunt) {
        //url+='&type ='+saveunt;
        dataJSON.type = saveunt
    }
    //仅用于转人工次数统计
    if ($('[name=clientName]').val()) {
        dataJSON.clientName = $('[name=clientName]').val()
    }
    //仅用于转人工次数统计
    if ($('[name=customer]').val()) {
        dataJSON.customer = $('[name=customer]').val()
    }
    /*add by zhaoyuxing At 20171213
    *taskId：332 用于loginSummary_wxj.html查询子公司
    * 说明：如果选择子公司，将子公司名称作为请求参数发送ajax请求
    */
    if(companys){
        dataJSON.companys=companys;
    }
    /*taskId:418  自如定制报表 evalution_zr.html
     *自如报表，则增加字段customerType
     * */
    if(customerType){
        dataJSON.customerType =1;
    }

    //ajax请求
    if (queryAll_Flag) {
        queryAll_Flag = false
    } else {
        return
    }
    $('table:not(.table-condensed)').each(function (i) {
        var colspan = 1
        if ($(this).find('th').length && $(this).find('th').length > 0) colspan = $(this).find('th').length
        if ($(this).find('tbody').find('tr').length == 0) {
            $(this).find('tbody').empty().html('<tr style="background:#fff;"><td colspan="' + colspan + '"><div class="ajax-spinner-bars"><div class="bar-1"></div><div class="bar-2"></div><div class="bar-3"></div><div class="bar-4"></div><div class="bar-5"></div><div class="bar-6"></div><div class="bar-7"></div><div class="bar-8"></div><div class="bar-9"></div><div class="bar-10"></div><div class="bar-11"></div><div class="bar-12"></div><div class="bar-13"></div><div class="bar-14"></div><div class="bar-15"></div><div class="bar-16"></div></div></td></tr>')
        }
    })
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        url: encodeURI(url),
        data: dataJSON,
        error: function (xhr) {
            yunNotyError('接口请求失败！')
        },
        success: function (data) {
            queryAll_Flag = true
            if (data.status === 0) {

                $('#levelType').change(function () {
                    if ($(this).children('option:selected')) {
                        var selectedval = $(this).children('option:selected').val()   //获取全部分类下拉框选中的值
                        if (selectedval == -1) {    //查全部等级分类
                            if (data.countList == null) {
                                table += '<tr >'
                                table += '<td colspan=3 style=\'text-align:center\'><i class=\'glyphicon glyphicon-warning-sign\'></i>暂无数据</td>'
                                table += '</tr>'
                                $('#visitDataTable').html(table)
                            } else {
                                showtable(data)
                            }
                        }
                        if (selectedval == 0) {     //一级分类

                            if (data.classList_1 == null) {
                                table += '<tr >'
                                table += '<td colspan=3 style=\'text-align:center\'><i class=\'glyphicon glyphicon-warning-sign\'></i>暂无数据</td>'
                                table += '</tr>'
                                $('#visitDataTable').html(table)
                            } else {
                                showtable_1(data)
                            }
                        }
                        if (selectedval == 1) {     //二级分类
                            if (data.classList_2 == null) {
                                table += '<tr >'
                                table += '<td colspan=3 style=\'text-align:center\'><i class=\'glyphicon glyphicon-warning-sign\'></i>暂无数据</td>'
                                table += '</tr>'
                                $('#visitDataTable').html(table)
                            } else {
                                showtable_2(data)
                            }
                        }
                        if (selectedval == 2) {     //三级分类
                            if (data.classList_3 == null) {
                                table += '<tr >'
                                table += '<td colspan=3 style=\'text-align:center\'><i class=\'glyphicon glyphicon-warning-sign\'></i>暂无数据</td>'
                                table += '</tr>'
                                $('#visitDataTable').html(table)
                            } else {
                                showtable_3(data)
                            }
                        }
                        if (selectedval == 3) {   //四级分类
                            var table = ''
                            if (data.classList_4 == null) {
                                table += '<tr >'
                                table += '<td colspan=3 style=\'text-align:center\'><i class=\'glyphicon glyphicon-warning-sign\'></i>暂无数据</td>'
                                table += '</tr>'
                                $('#visitDataTable').html(table)
                            } else {
                                showtable_4(data)
                            }
                        }
                        if (selectedval == 4) {   //五级分类
                            if (data.classList_5 == null) {
                                table += '<tr >'
                                table += '<td colspan=3 style=\'text-align:center\'><i class=\'glyphicon glyphicon-warning-sign\'></i>暂无数据</td>'
                                table += '</tr>'
                                $('#visitDataTable').html(table)
                            } else {
                                showtable_5(data)
                            }
                        }
                    }
                })

                if (data.sourceList) {
                    if (data.sourceList[0]) {
                        //仅在第一次ajax请求时生成渠道select
                        if (selectSourceFlag) {
                            var html = '<select class="selectpicker">'
                            html += '<option value="-1">全部渠道</option>'
                            for (var m in data.sourceList) {
                                html += '<option value="' + data.sourceList[m].DicCode + '">' + data.sourceList[m].DicDesc + '</option>'
                            }
                            html += '</select>'
                            $('#DataSource').empty().append(html)
                            $('#DataSource .selectpicker').selectpicker({
                                style: 'btn-primary',
                                width: '100%'
                            })
                            $('#DataSource .selectpicker').on('change', function () {
                                queryAll()
                            })
                            selectSourceFlag = false
                        }
                    }
                }
                /* 设置新标题 */
                if ($('#option1').hasClass('active')) {
                    var NewTitle = getTimeName($('#byTimePiece .selectpicker').val())
                    if (NewTitle !== '') {
                        title += ' - ' + NewTitle
                    }
                } else if ($('#option2').hasClass('active')) {
                    title += ' - 从  ' + STime + '  到  ' + ETime
                }
                var sourceName = getSourceName(sourceId)
                if (sourceName !== '') {
                    title += ' (' + sourceName + ')'
                }
                //$('#chartHead').text(title);
                if (typeof callback_chart === 'function') {
                    callback_chart(data)
                    if ($('#saveURL').val() == '../../Advertise/ReportList') {
                        if (data.list.length > 0) {
                            var options = {
                                data: [data, 'list', 'total'],
                                currentPage: data.currentPage,
                                totalPages: data.totlePages ? data.totlePages : 1,
                                alignment: 'right',
                                onPageClicked: function (event, originalEvent, type, page) {
                                    pageNo = page
                                    $('#pageNo').val(pageNo)
                                    queryAll(pageNo, confirmBtn)
                                    callback_chart(data)
                                }
                            }
                            $('#pageList').bootstrapPaginator(options)
                        }
                    }
                }
            } else {
                yunNoty(data)
            }
        }
    })
}

/*
 * 导出Excel
 */
function exportExcel_new () {
    var url = $('#saveURL').val()
    url += '?excelFlag=1'
    if (0) {
        //时间段
        url += '&timeSelect=' + $('#byTimePiece .selectpicker').val()
    } else if (1) {
        //精确时间
        var STime = $('[name=startT]').val()
        var ETime = $('[name=endT]').val()
        var d1 = new Date(STime.replace(/\-/g, '\/')).getTime()
        var d2 = new Date(ETime.replace(/\-/g, '\/')).getTime()
        if (STime === '' || ETime === '') {
        } else if (STime !== '' && ETime !== '' && d1 >= d2) {
            yunNotyError('开始时间不能大于结束时间！')
            return false
        } else {
            url += '&startT=' + STime + '&endT=' + ETime
        }
    }
    var sourceId = $('#DataSource .selectpicker').val()
    if (sourceId !== undefined) {
        url += '&sourceId=' + sourceId
    }
    var orderType = $('#saveOrderType').val()
    if (orderType !== undefined) {
        url += '&orderType=' + orderType
    }
    //if(orderType != undefined) {
    //	url += '&orderType=' + orderType;
    //}
    var saveUnQuestionType = $('#byUnknown .selectpicker').val()
    //全部处理状态，仅用于未知问题页面
    var saveUnQuestionType2 = $('#byUnknown2 .selectpicker').val()
    if (saveUnQuestionType !== undefined) {
        url += '&fixMode=' + saveUnQuestionType
    }
    if (saveUnQuestionType2 !== undefined) {
        url += '&mode=' + saveUnQuestionType2
    }
    var saveloadTimes = $('#byloadTimes .selectpicker').val()
    if (saveloadTimes) {
        url += '&loadTimes=' + saveloadTimes
    }
    var savelogItems = $('#bylogItems .selectpicker').val()
    if (savelogItems) {
        url += '&logItems=' + savelogItems
    }
    var saveisBusiness = $('#byisBusiness .selectpicker').val()
    if (saveisBusiness) {
        url += '&isBusiness=' + saveisBusiness
    }
    var savebyChatType = $('#byChatType .selectpicker').val()
    if (savebyChatType) {
        url += '&msgType=' + savebyChatType
    }
    var saveuntr = $('#untrue .selectpicker').val()
    if (saveuntr) {
        url += '&type=' + saveuntr
    }

    /*Amend by zhaoyuxing At 20171213
    *taskId:332 无限极定制报表loginSummary_wxj.html
    *说明：导出报表时增加子公司参数
    * */
    var companys=$('#branchOffice .selectpicker').val();
    if (companys) {
        url += '&companys=' + companys
    }
    /*taskId:418  自如定制报表 evalution_zr.html
     *自如报表，则增加字段customerType
     * */
    var customerType=$('#evalZR').val();
    if (customerType) {
        url += '&customerType=1';
    }

    location.href = url
}

//访问问题分级统计页面  导出报表  二级分类
function exportExcel_new2 () {
    var url = $('#saveURL').val()
    url += '?excelFlag=6'
    if (0) {
        //时间段
        url += '&timeSelect=' + $('#byTimePiece .selectpicker').val()
    } else if (1) {
        //精确时间
        var STime = $('[name=startT]').val()
        var ETime = $('[name=endT]').val()
        var d1 = new Date(STime.replace(/\-/g, '\/')).getTime()
        var d2 = new Date(ETime.replace(/\-/g, '\/')).getTime()
        if (STime === '' || ETime === '') {
        } else if (STime !== '' && ETime !== '' && d1 >= d2) {
            yunNotyError('开始时间不能大于结束时间！')
            return false
        } else {
            url += '&startT=' + STime + '&endT=' + ETime
        }
    }
    var sourceId = $('#DataSource .selectpicker').val()
    if (sourceId !== undefined) {
        url += '&sourceId=' + sourceId
    }
    var orderType = $('#saveOrderType').val()
    if (orderType !== undefined) {
        url += '&orderType=' + orderType
    }
    //if(orderType != undefined) {
    //	url += '&orderType=' + orderType;
    //}
    var saveUnQuestionType = $('#byUnknown .selectpicker').val()
    if (saveUnQuestionType !== undefined) {
        url += '&fixMode=' + saveUnQuestionType
    }
    var saveloadTimes = $('#byloadTimes .selectpicker').val()
    if (saveloadTimes) {
        url += '&loadTimes=' + saveloadTimes
    }
    var savelogItems = $('#bylogItems .selectpicker').val()
    if (savelogItems) {
        url += '&logItems=' + savelogItems
    }
    var saveisBusiness = $('#byisBusiness .selectpicker').val()
    if (saveisBusiness) {
        url += '&isBusiness=' + saveisBusiness
    }
    var savebyChatType = $('#byChatType .selectpicker').val()
    if (savebyChatType) {
        url += '&msgType=' + savebyChatType
    }
    var saveuntr = $('#untrue .selectpicker').val()
    if (saveuntr) {
        url += '&type=' + saveuntr
    }
    location.href = url
}

/*
 * 初始化日期控件
 */
function formatDateTime () {
    $('.form_datetime').datetimepicker({
        language: 'zh-CN',
        format: 'yyyy-mm-dd hh:ii',
        autoclose: true,
        todayBtn: true,
        minuteStep: 10,
        initialDate: new Date()
    })
}

/*
 * 初始化标题栏的radio button
 */
function InitHeaderRadio () {
    $('#TimeQuery').hide()
    $('#option1').on('click', function () {
        $('#byTimePiece').show()
        $('#TimeQuery').hide()
    })
    $('#option2').on('click', function () {
        $('#byTimePiece').hide()
        $('#TimeQuery').show()
    })
}

function getStandardProvince (province) {
    var provinceList = []
    provinceList.push('北京')
    provinceList.push('天津')
    provinceList.push('上海')
    provinceList.push('重庆')
    provinceList.push('河北')
    provinceList.push('河南')
    provinceList.push('云南')
    provinceList.push('辽宁')
    provinceList.push('黑龙江')
    provinceList.push('湖南')
    provinceList.push('安徽')
    provinceList.push('山东')
    provinceList.push('新疆')
    provinceList.push('江苏')
    provinceList.push('浙江')
    provinceList.push('江西')
    provinceList.push('湖北')
    provinceList.push('广西')
    provinceList.push('甘肃')
    provinceList.push('山西')
    provinceList.push('内蒙古')
    provinceList.push('陕西')
    provinceList.push('吉林')
    provinceList.push('福建')
    provinceList.push('贵州')
    provinceList.push('广东')
    provinceList.push('青海')
    provinceList.push('西藏')
    provinceList.push('四川')
    provinceList.push('宁夏')
    provinceList.push('海南')
    provinceList.push('台湾')
    provinceList.push('香港')
    provinceList.push('澳门')

    for (var i = 0; i < provinceList.length; i++) {
        if (province.indexOf(provinceList[i]) >= 0) {
            return provinceList[i]
        }
    }
    return province
}

function getStandardLocation (location) {

    if (endWith(location, '市')) {
        return location.substring(0, location.length - 1)
    }
    if (endWith(location, '州')) {
        return location.substring(0, location.length - 1)
    }
    if (endWith(location, '地区')) {
        return location.substring(0, location.length - 2)
    }
    return location
}

function isExistInLocationDataList (location) {
    for (var standardLocation in locationDataList) {
        if (standardLocation == location) {
            return true
        }
    }
    return false
}

function endWith (str, endStr) {
    var reg = new RegExp(endStr + '$')
    return reg.test(str)
}

/* 默认选择时间为30天以内,用当前时间减去30天 */
function MinusDays (date, days) {
    var nd = new Date(date)
    nd = nd.valueOf()
    nd = nd - days * 24 * 60 * 60 * 1000
    nd = new Date(nd)
    return nd
}
