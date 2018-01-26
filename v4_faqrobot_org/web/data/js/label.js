/**地图的series中的data*/
var seriesData = []
var legendData = []

/*
			根据返回的json,将地图数据进行加载
		 */
function showPie (json) {
    var myChart1 = echarts.init(document.getElementById('main'), 'macarons')
    seriesData = []
    legendData = []
    var pre = -1,
        ti = -1
    json.list.sort(function (a, b) {
        return a.Id - b.Id
    })
    for (var i = 0; i < json.list.length; i++) {
        if (json.list[i].Id === pre) {
            seriesData[ti].value = seriesData[ti].value + json.list[i].Num
        } else {
            seriesData.push({
                name: json.list[i].Name,
                value: json.list[i].Num
            })
            legendData.push(json.list[i].Name)
            ti++
        }
        pre = json.list[i].Id
    }
    if (seriesData.length == 0) {
        seriesData.push({
            name: '暂无数据',
            value: 0
        })
    }
    // 初始 option1
    option1 = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}次({d}%)'
        },
        legend: {
            orient: 'horizontal',
            x: 'center',
            data: legendData
        },
        toolbox: {
            show: true,
            x: 'right',
            y: 'center',
            orient: 'vertical',
            feature: {
                dataView: {
                    show: false,
                    readOnly: false
                },
                restore: {
                    show: true
                }
            }
        },
        calculable: true,
        series: [{
            name: '未知问题标签',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: seriesData
        }]
    }

    myChart1.hideLoading()
    myChart1.setOption(option1)
    window.onresize = myChart1.resize
}

function showtable (json) {
    var table = ''
    if (json.list && json.list[0]) {
        var all = 0
        for (var o = 0; o < json.list.length; o++) {
            all += json.list[o].Num
        }
        for (var i = 0; i < json.list.length; i++) {
            table += '<tr>'
            table += '<td>' + json.list[i].Day + '</td>'
            table += '<td>' + json.list[i].Name + '</td>'
            table += '<td>' + json.list[i].Num + '</td>'
            var allp = json.list[i].Num / all
            table += '<td>' + (allp * 100).toFixed(2) + '%</td>'
            table += '</tr>'
        }
    } else {
        table = '<tr><td colspan=4 style="text-align:center;">暂无数据</td></tr>'
    }
    $('#visitDataTable').html(table)
}

function queryAllc () {
    //列出图表
    var rePath = '/report/UnQuestion/tagList?groupId=0'
    rePath += '&timeSelect=' + $('#byTimePiece .selectpicker').val()
    $.getJSON(rePath,
        function (json) {
            if (json.status != 0) {
                yunNoty(json)
                return
            }
            showPie(json)
            showtable(json)
        })
}

var ffg = true

function queryc (confirmBtn) {
    if (confirmBtn) {
        var sValue = $('#tm1').val().split('-')
        var eValue = $('#tm2').val().split('-')
        $('.ttw').html(sValue[1] + '月' + sValue[2].split(' ')[0] + '日' + '-' + eValue[1] + '月' + eValue[2].split(' ')[0] + '日' + '&nbsp;<span class="caret"></span>')
    }
    var url = '/report/UnQuestion/tagList'
    var title = '未知问题标签占比统计'
    var STime = $('[name=startT]').val()
    var ETime = $('[name=endT]').val()
    var d1 = new Date(STime.replace(/\-/g, '\/')).getTime()
    var d2 = new Date(ETime.replace(/\-/g, '\/')).getTime()
    if (STime === '' || ETime === '') {
    } else if (STime !== '' && ETime !== '' && d1 >= d2) {
        yunNotyError('开始时间不能大于结束时间！')
        return false
    }
    url += '?startT=' + STime + '&endT=' + ETime
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        url: encodeURI(url),
        success: function (data) {
            if (data.status == 0) {

                if (ffg) {
                    $.fn.zTree.init($('#treeClasses'), setting, [])
                    ffg = false
                }

                showPie(data)
                showtable(data)
                //存储时间值
                $('#saveStartTime').attr('value', STime)
                $('#saveEndTime').attr('value', ETime)
                title += ' - 从  ' + STime + '  到  ' + ETime
                //$('#chartHead').text(title);
            } else {
                yunNoty(data)
            }
        }
    })
}

function OutExcel () {
    var startTime = $('#saveStartTime').val()
    var endTime = $('#saveEndTime').val()
    var url = '/report/UnQuestion/tagList?groupId=0'
    url += '&excelFlag=1'
    if (startTime != '' && endTime != '') {
        url += '&startT=' + startTime + '&endT=' + endTime
    }
    location.href = url
}

/* 初始化ztree */
var setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: 'Id',
            pIdKey: 'ParentId',
            rootPId: 0
        },
        key: {
            name: 'Name'
        }
    },
    view: {
        selectedMulti: false,
        showIcon: false
    },
    async: {
        enable: true,
        url: '/classes/listClasses?m=10',
        autoParam: ['id'],
        dataFilter: ajaxDataFilter
    },
    callback: {
        onClick: treeClick
    }
}

function treeClick (event, treeId, treeNode, clickFlag) {
    var startTime = $('[name=startT]').val()
    var endTime = $('[name=endT]').val()
    var rePath = '/report/UnQuestion/tagList?groupId=' + treeNode.Id
    if (startTime != '' && endTime != '') {
        rePath += '&startT=' + startTime + '&endT=' + endTime
    } else {
        rePath += '&timeSelect=' + $('#byTimePiece .selectpicker').val()
    }
    $.getJSON(rePath,
        function (json) {
            if (json.status != 0) {
                yunNoty(json)
                return
            }
            showPie(json)
            showtable(json)
        })
}

function ajaxDataFilter (treeId, parentNode, responseData) {
    if (responseData) {
        responseData.list.push({
            Id: 0,
            ParentId: 0,
            Name: '全部分类',
            open: true
        })
        return responseData.list
    }
    return responseData
}
