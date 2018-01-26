//日期排序yyyy-mm-dd
function ymd_up (a, b) {
    var c = a.split('-')
    var d = parseInt(c[0] + '' + c[1] + '' + c[2])
    var e = b.split('-')
    var f = parseInt(e[0] + '' + e[1] + '' + e[2])
    return (d > f) ? 1 : -1
}

//日期小时排序yyyy-mm-dd-hh
function ymdh_up (a, b) {
    var c = a.split('-')
    var d = parseInt(c[0] + '' + c[1] + '' + c[2] + '' + c[3])
    var e = b.split('-')
    var f = parseInt(e[0] + '' + e[1] + '' + e[2] + '' + e[3])
    return (d > f) ? 1 : -1
}

//报表全局变量
var dateArray = []
var dataArray1 = []//lineVisit 访问次数
var dataArray2 = []//lineTimes 访问人数
function analysis (json) {
    //图表变量
    var myChart1 = echarts.init(document.getElementById('main'), 'macarons')
    var ListVisit = json.ListVisit
    var ListTimes = json.ListTimes
    //清空全局变量
    dateArray = []
    dataArray1 = []
    dataArray2 = []
    var dataMap = {}
    var mapArray = []
    if (!ListVisit && !ListTimes) {
        dateArray.push('一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月')
        dataArray1.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
        dataArray2.push(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    } else {
        if (json.IntervalDays > 3) {
            //存访问次数
            for (var i = 0; i < ListVisit.length; i++) {
                if (dataMap[ListVisit[i].Day]) {
                    if (isNaN(parseInt(dataMap[ListVisit[i].Day].visits))) {
                        dataMap[ListVisit[i].Day].visits = ListVisit[i].LogItems
                    } else {
                        dataMap[ListVisit[i].Day].visits = dataMap[ListVisit[i].Day].visits + ListVisit[i].LogItems
                    }
                } else {
                    dataMap[ListVisit[i].Day] = {}
                    dataMap[ListVisit[i].Day].visits = ListVisit[i].LogItems
                }
            }
            //存访问人数
            for (var j = 0; j < ListTimes.length; j++) {
                if (dataMap[ListTimes[j].Day]) {
                    if (isNaN(parseInt(dataMap[ListTimes[j].Day].times))) {
                        dataMap[ListTimes[j].Day].times = ListTimes[j].LogItems
                    } else {
                        dataMap[ListTimes[j].Day].times = dataMap[ListTimes[j].Day].times + ListTimes[j].LogItems
                    }
                } else {
                    dataMap[ListTimes[j].Day] = {}
                    dataMap[ListTimes[j].Day].times = ListTimes[j].LogItems
                }
            }
            //存日期
            mapArray = []
            for (var x in dataMap) {
                mapArray.push(x)
            }
            //日期排序
            mapArray.sort(ymd_up)
            //向报表List中写数据
            for (var y in mapArray) {
                var z = dataMap[mapArray[y]]
                //date
                dateArray[y] = mapArray[y]
                //lineVisit
                if (z.visits) {
                    dataArray1[y] = z.visits
                } else {
                    dataArray1[y] = 0
                }
                //lineTimes
                if (z.times) {
                    dataArray2[y] = z.times
                } else {
                    dataArray2[y] = 0
                }
            }
        } else {
            var tmpH = ''
            //存访问次数
            for (var k = 0; k < ListVisit.length; k++) {
                if (ListVisit[k].Hour < 10) {
                    tmpH = '-0' + ListVisit[k].Hour
                } else {
                    tmpH = '-' + ListVisit[k].Hour
                }
                if (dataMap[ListVisit[k].Day + tmpH]) {
                    if (isNaN(parseInt(dataMap[ListVisit[k].Day + tmpH].visits))) {
                        dataMap[ListVisit[k].Day + tmpH].visits = ListVisit[k].LogItems
                    } else {
                        dataMap[ListVisit[k].Day + tmpH].visits = dataMap[ListVisit[k].Day + tmpH].visits + ListVisit[k].LogItems
                    }
                } else {
                    dataMap[ListVisit[k].Day + tmpH] = {}
                    dataMap[ListVisit[k].Day + tmpH].visits = ListVisit[k].LogItems
                }
            }
            //存访问人数
            for (var o = 0; o < ListTimes.length; o++) {
                if (ListTimes[o].Hour < 10) {
                    tmpH = '-0' + ListTimes[o].Hour
                } else {
                    tmpH = '-' + ListTimes[o].Hour
                }
                if (dataMap[ListTimes[o].Day + tmpH]) {
                    if (isNaN(parseInt(dataMap[ListTimes[o].Day + tmpH].times))) {
                        dataMap[ListTimes[o].Day + tmpH].times = ListTimes[o].LogItems
                    } else {
                        dataMap[ListTimes[o].Day + tmpH].times = dataMap[ListTimes[o].Day + tmpH].times + ListTimes[o].LogItems
                    }
                } else {
                    dataMap[ListTimes[o].Day + tmpH] = {}
                    dataMap[ListTimes[o].Day + tmpH].times = ListTimes[o].LogItems
                }
            }
            tmpH = null
            //存日期
            mapArray = []
            for (var m in dataMap) {
                mapArray.push(m)
            }
            //日期排序
            mapArray.sort(ymdh_up)
            //向报表List中写数据
            for (var n in mapArray) {
                var l = dataMap[mapArray[n]]
                //date
                dateArray[n] = mapArray[n].substring(mapArray[n].length - 2, mapArray[n].length) + ':00'
                //lineVisit
                if (l.visits) {
                    dataArray1[n] = l.visits
                } else {
                    dataArray1[n] = 0
                }
                //lineTimes
                if (l.times) {
                    dataArray2[n] = l.times
                } else {
                    dataArray2[n] = 0
                }
            }
        }
    }

    //画图一
    // 初始 option1
    option1 = {
        title: {
            text: '访客访问次数及人数统计'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['访问次数', '访问人数'],
            orient: 'horizontal',
            left: 'center'
        },
        xAxis: [{
            type: 'category',
            boundaryGap: true,
            data: dateArray,
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#cccccc',
                    type: 'solid',
                    width: 1
                }
            },
            axisLabel: {
                rotate: 15,
                textStyle: {
                    color: '#339933',
                    fontSize: 12
                }
            }
        }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#cccccc',
                    type: 'solid',
                    width: 1
                }
            },
            axisLabel: {
                formatter: '{value}次 '
            }
        }],
        toolbox: {
            show: true,
            x: 'right',
            y: 'center',
            orient: 'vertical',
            feature: {
                dataView: {
                    show: false,
                    readOnly: true
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        series: [{
            name: '访问次数',
            type: 'line',
            data: dataArray1
        },
            {
                name: '访问人数',
                type: 'line',
                data: dataArray2
            }]
    }

    myChart1.hideLoading()
    myChart1.setOption(option1)

    $(window).resize(function () {
        $(myChart1).resize()
    })

    //画表格
    var table = ''
    if (dataArray1.length === 0 && dataArray2.length === 0) {
        table += '<tr >'
        table += '<td colspan=4 style=\'text-align:center\'><i class=\'glyphicon glyphicon-warning-sign\'></i>暂无数据</td>'
        table += '</tr>'
        $('#visitDataTable').html(table)
    } else {
        for (var t = dateArray.length - 1; t >= 0; t--) {
            table += '<tr class="body-row">'
            table += '<td class="col1">' + dateArray[t] + '</td>'
            if (getSourceName($('#saveSourceId').val()) == '') {
                table += '<td class="col1">' + '全部' + '</td>'
            } else {
                table += '<td class="col1">' + getSourceName($('#saveSourceId').val()) + '</td>'
            }
            table += '<td class="col3">' + dataArray1[t] + '</td>'
            table += '<td class="col3">' + dataArray2[t] + '</td>'
            table += '</tr>'
        }
    }
    $('#visitDataTable').html(table)
}

/**
 时间段查询
 */
var robotList_local = []
var selectSourceFlag = true

function queryDays (num) {
    var url = '../../report/LoginSummary/findLoginSummaryFromRobotName',
        title = '访客访问次数统计',
        fun = function (json) {
            analysis(json)
        }
    var sourceId = $('#saveSourceId').val()
    url += '?timeSelect=' + num
    if (sourceId !== undefined) {
        url += '&sourceId=' + sourceId
    }
    var chatlinkId = $('#saveRobot').val()
    if (chatlinkId !== undefined) {
        url += '&chatlinkId=' + chatlinkId
    }
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        url: encodeURI(url),
        error: function (xhr) {
            yunNotyError('接口请求失败！')
        },
        success: function (data) {
            if (data.status === 0) {
                if (data.sourceList) {
                    if (data.sourceList[0]) {
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
                                width: '100px'
                            })
                            $('#DataSource .selectpicker').on('change', function () {
                                sourceType($(this).val())
                            })
                            robotList_local = data.RobotList
                            var html_R = '<select class="selectpicker">'
                            html_R += '<option value="-1">机器人名称</option>'
                            for (var n in data.RobotList) {
                                html_R += '<option value="' + data.RobotList[n].Id + '">' + data.RobotList[n].Name + '</option>'
                            }
                            html_R += '</select>'
                            $('#byRobot').empty().append(html_R)
                            $('#byRobot .selectpicker').selectpicker({
                                style: 'btn-primary',
                                width: 'auto'
                            })
                            $('#byRobot .selectpicker').on('change', function () {
                                RobotType($(this).val())
                            })
                            selectSourceFlag = false
                        }
                    }
                }
                /* 将精确时间的起始时间和结束时间设置为空 */
                $('[name=startT]').val('')
                $('[name=endT]').val('')
                /* 存储隐藏域时间段值 */
                $('#saveValue').attr('value', num)
                /* 设置新标题 */
                var NewTitle = getTimeName(num)
                if (NewTitle !== '') {
                    title += ' - ' + NewTitle
                }
                var sourceId = $('#saveSourceId').val()
                var sourceName = getSourceName(sourceId)
                if (sourceName !== '') {
                    title += ' (' + sourceName + ')'
                }
                var robotId = $('#saveRobot').val()
                var robotName = getRobotName(robotId)
                if (robotName !== '') {
                    title += ' 　　机器人：' + robotName
                }
                $('#chartHead').text(title)
                if (typeof fun === 'function') {
                    fun(data)
                }
            } else {
                yunNoty(data)
            }
        }
    })
}

/**
 按时间查询
 */
function query () {
    var url = '../../report/LoginSummary/findLoginSummaryFromRobotName',
        title = '访客访问次数统计',
        fun = function (json) {
            analysis(json)
        }
    var STime = $('[name=startT]').val()
    var ETime = $('[name=endT]').val()
    var sourceId = $('#saveSourceId').val()
    var d1 = new Date(STime.replace(/\-/g, '\/')).getTime()
    var d2 = new Date(ETime.replace(/\-/g, '\/')).getTime()
    if (STime === '' || ETime === '') {
        yunNotyError('请输入完整的时间段！')
        return false
    }
    if (STime !== '' && ETime !== '' && d1 >= d2) {
        yunNotyError('开始时间不能大于结束时间！')
        return false
    }
    url += '?startT=' + STime + '&endT=' + ETime
    if (sourceId !== undefined) {
        url += '&sourceId=' + sourceId
    }
    var chatlinkId = $('#saveRobot').val()
    if (chatlinkId !== undefined) {
        url += '&chatlinkId=' + chatlinkId
    }
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        url: encodeURI(url),
        error: function (xhr) {
            yunNotyError('接口请求失败！')
        },
        success: function (data) {
            if (data.status === 0) {
                //存储时间值
                $('#saveValue').attr('value', -1)
                $('#saveStartTime').attr('value', STime)
                $('#saveEndTime').attr('value', ETime)
                title += ' - 从  ' + STime + '  到  ' + ETime
                var sourceName = getSourceName(sourceId)
                if (sourceName !== '') {
                    title += ' (' + sourceName + ')'
                }
                var robotId = $('#saveRobot').val()
                var robotName = getRobotName(robotId)
                if (robotName !== '') {
                    title += ' 　　机器人：' + robotName
                }
                $('#chartHead').text(title)
                if (typeof fun === 'function') {
                    fun(data)
                }
            } else {
                yunNoty(data)
            }
        }
    })
}

function OutExcel () {
    var url = '../../report/LoginSummary/findLoginSummaryFromRobotName'

    var num = $('#saveValue').val()
    var sourceId = $('#saveSourceId').val()
    //var orderType = $('#saveOrderType').val();
    url += '?excelFlag=1'
    if (num != -1) {//时间段
        url += '&timeSelect=' + num
    } else {//精确时间
        var startTime = $('#saveStartTime').val()
        var endTime = $('#saveEndTime').val()
        url += '&startT=' + startTime + '&endT=' + endTime
    }
    if (sourceId !== undefined) {
        url += '&sourceId=' + sourceId
    }
    var chatlinkId = $('#saveRobot').val()
    if (chatlinkId !== undefined) {
        url += '&chatlinkId=' + chatlinkId
    }
    location.href = url
}

function sourceType (num) {
    var Sid = num,
        url = '../../report/LoginSummary/findLoginSummaryFromRobotName',
        title = '访客访问次数统计',
        fun = function (json) {
            analysis(json)
        }
    url += '?sourceId=' + Sid
    var chatlinkId = $('#saveRobot').val()
    if (chatlinkId !== undefined) {
        url += '&chatlinkId=' + chatlinkId
    }
    var num = $('#saveValue').val()
    if (num != -1) {//时间段
        url += '&timeSelect=' + num
        $.ajax({
            type: 'get',
            datatype: 'json',
            cache: false,
            url: encodeURI(url),
            error: function (xhr) {
                yunNotyError('接口请求失败！')
            },
            success: function (data) {
                if (data.status === 0) {
                    /* 存储类别值 */
                    $('#saveSourceId').attr('value', Sid)
                    /* 设置新标题 */
                    var NewTitle = getTimeName(num)
                    if (NewTitle !== '') {
                        title += ' - ' + NewTitle
                    }
                    var sourceName = getSourceName(Sid)
                    if (sourceName !== '') {
                        title += ' (' + sourceName + ')'
                    }
                    var robotId = $('#saveRobot').val()
                    var robotName = getRobotName(robotId)
                    if (robotName !== '') {
                        title += ' 　　机器人：' + robotName
                    }
                    $('#chartHead').text(title)
                    if (typeof fun === 'function') {
                        fun(data)
                    }
                } else {
                    yunNoty(data)
                }
            }
        })
    } else {//精确时间
        var startTime = $('#saveStartTime').val()
        var endTime = $('#saveEndTime').val()
        url += '&startT=' + startTime + '&endT=' + endTime
        $.ajax({
            type: 'get',
            datatype: 'json',
            cache: false,
            url: encodeURI(url),
            success: function (data) {
                if (data.status === 0) {
                    /* 存储类别值 */
                    $('#saveSourceId').attr('value', Sid)
                    /* 设置新标题 */
                    title += ' - 从  ' + startTime + '  到  ' + endTime
                    var sourceName = getSourceName(Sid)
                    if (sourceName !== '') {
                        title += ' (' + sourceName + ')'
                    }
                    var robotId = $('#saveRobot').val()
                    var robotName = getRobotName(robotId)
                    if (robotName !== '') {
                        title += ' 　　机器人：' + robotName
                    }
                    $('#chartHead').text(title)
                    if (typeof fun === 'function') {
                        fun(data)
                    }
                } else {
                    yunNoty(data)
                }
            }
        })
    }
}

function RobotType (chatlinkId) {
    var url = '../../report/LoginSummary/findLoginSummaryFromRobotName',
        title = '访客访问次数统计',
        fun = function (json) {
            analysis(json)
        }
    url += '?chatlinkId=' + chatlinkId
    var sourceId = $('#saveSourceId').val()
    if (sourceId !== undefined) {
        url += '&sourceId=' + sourceId
    }
    var num = $('#saveValue').val()
    if (num != -1) {//时间段
        url += '&timeSelect=' + num
        $.ajax({
            type: 'get',
            datatype: 'json',
            cache: false,
            url: encodeURI(url),
            error: function (xhr) {
                yunNotyError('接口请求失败！')
            },
            success: function (data) {
                if (data.status === 0) {
                    /* 存储类别值 */
                    $('#saveRobot').attr('value', chatlinkId)
                    /* 设置新标题 */
                    var NewTitle = getTimeName(num)
                    if (NewTitle !== '') {
                        title += ' - ' + NewTitle
                    }
                    var sourceName = getSourceName(sourceId)
                    if (sourceName !== '') {
                        title += ' (' + sourceName + ')'
                    }
                    var robotId = $('#saveRobot').val()
                    var robotName = getRobotName(robotId)
                    if (robotName !== '') {
                        title += ' 　　机器人：' + robotName
                    }
                    $('#chartHead').text(title)
                    if (typeof fun === 'function') {
                        fun(data)
                    }
                } else {
                    yunNoty(data)
                }
            }
        })
    } else {//精确时间
        var startTime = $('#saveStartTime').val()
        var endTime = $('#saveEndTime').val()
        url += '&startT=' + startTime + '&endT=' + endTime
        $.ajax({
            type: 'get',
            datatype: 'json',
            cache: false,
            url: encodeURI(url),
            success: function (data) {
                if (data.status === 0) {
                    /* 存储类别值 */
                    $('#saveRobot').attr('value', chatlinkId)
                    /* 设置新标题 */
                    title += ' - 从  ' + startTime + '  到  ' + endTime
                    var sourceName = getSourceName(sourceId)
                    if (sourceName !== '') {
                        title += ' (' + sourceName + ')'
                    }
                    var robotId = $('#saveRobot').val()
                    var robotName = getRobotName(robotId)
                    if (robotName !== '') {
                        title += ' 　　机器人：' + robotName
                    }
                    $('#chartHead').text(title)
                    if (typeof fun === 'function') {
                        fun(data)
                    }
                } else {
                    yunNoty(data)
                }
            }
        })
    }
}

function getRobotName (id) {
    for (var i in robotList_local) {
        if (id == robotList_local[i].Id) {
            return robotList_local[i].Name
        }
    }
    return ''
}