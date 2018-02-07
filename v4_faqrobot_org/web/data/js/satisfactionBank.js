/**地图的series中的data*/
var seriesData = []
var legendData = []

/**存储groupId*/
var groupId=0;
/*
 根据返回的json,将地图数据进行加载
 */
function showPie (json) {
    var myChart1 = echarts.init(document.getElementById('main'), 'macarons')
    seriesData = []
    legendData = []
    var answer = json.Answer
    if (answer !== null) {
        var valueMap = {}
        valueMap.name = '有帮助'
        valueMap.value = json.Answer.Usefull
        seriesData.push(valueMap)

        legendData.push('有帮助')

        var valueMap = {}
        valueMap.name = '无帮助'
        valueMap.value = json.Answer.Useless
        seriesData.push(valueMap)

        legendData.push('无帮助')

        if (json.Answer.EvaluateNone >= 0) {
            var valueMap = {}
            valueMap.name = '未评价'
            valueMap.value = json.Answer.EvaluateNone
            seriesData.push(valueMap)
            legendData.push('未评价')
        }
        // 初始 option1
        option1 = {
            title: {
                text: '题库满意度统计'
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}次({d}%)'
            },
            legend: {
                data: legendData
            },
            toolbox: {
                show: true,
                x: 'right',
                y: 'center',
                orient: 'vertical',
                feature: {
                    dataView: {
                        show: true,
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
                name: '对回答满意次数',
                type: 'pie',
                radius: '65%',
                center: ['50%', '50%'],
                data: seriesData
            }]
        }

        myChart1.hideLoading()
        myChart1.setOption(option1)
        window.onresize = myChart1.resize
    } else {
        myChart1.hideLoading()
        myChart1.setOption({
            title: {
                text: '题库满意度统计'
            },
            series: [{
                name: '暂无数据！',
                type: 'pie',
                radius: '65%',
                center: ['50%', '50%'],
                data: [{name: '暂无数据', value: 0}]
            }]
        })
        window.onresize = myChart1.resize
    }
}

function showtable (json) {
    var table = ''
    if (json.Answer !== null) {
        table += '<tr>'
        table += '<td class="tab_tr_bg">' + json.GroupName + '</td>'
        table += '<td class="tab_tr_bg">' + json.Answer.Usefull + '</td>'
        table += '<td class="tab_tr_sec_bg"">' + json.Answer.Useless + '</td>'
        var allCount = json.Answer.Usefull + json.Answer.Useless

        if (json.Answer.EvaluateNone >= 0) {
            var tdLen = $('#tableHead th').length
            //console.info($('#tableHead th').eq(3).html()=='总次数');
            if ($('#tableHead th').eq(3).html() == '总次数') {
                $('#tableHead th').eq(tdLen - 1).before('<th>对回答未评价次数</th>')
            }
            table += '<td class="tab_tr_sec_bg"">' + json.Answer.EvaluateNone + '</td>'
            allCount += json.Answer.EvaluateNone
        }
        table += '<td class="tab_tr_sec_bg"">' + allCount + '</td>'
        table += '</tr>'
        $('#visitDataTable').html(table)
    } else {
        table += '<tr >'
        table += '<td colspan=5 style=\'text-align:center\'><i class=\'glyphicon glyphicon-warning-sign\'></i>暂无数据</td>'
        table += '</tr>'
        $('#visitDataTable').html(table)
        return
    }
}

function queryAllc () {
    //列出图表
    var rePath = '../../report/BankSatisfaction/getSatisCount?groupId='+groupId+'&type=0&startTime=' + $('[name=startT]').val() + '&endTime=' + $('[name=endT]').val()
    var saveisBusiness = $('#byisBusiness .selectpicker').val()
    if (saveisBusiness) {
        rePath += '&isBusiness=' + saveisBusiness
    }
    $.getJSON(rePath, function (json) {
        if (json.status != 0) {
            yunNoty(json)
            return
        }
        $.fn.zTree.init($('#treeClasses'), setting, [])
        /*保留树节点 Id*/
        var treeObj = $.fn.zTree.getZTreeObj('treeClasses');
        var node= treeObj.getNodeByParam("Id",groupId, null);
        if(node){
            treeObj.selectNode(node);
        };
        showPie(json)
        showtable(json)
    })
}

function queryc (confirmBtn) {
    if (confirmBtn) {
        var sValue = $('#tm1').val().split('-')
        var eValue = $('#tm2').val().split('-')
        $('.ttw').html(sValue[1] + '月' + sValue[2].split(' ')[0] + '日' + '-' + eValue[1] + '月' + eValue[2].split(' ')[0] + '日' + '&nbsp;<span class="caret"></span>')
    }
    var url = '../../report/BankSatisfaction/getSatisCount'
    var title = '题库满意度统计'
    var STime = $('[name=startT]').val()
    var ETime = $('[name=endT]').val()
    var d1 = new Date(STime.replace(/\-/g, '\/')).getTime()
    var d2 = new Date(ETime.replace(/\-/g, '\/')).getTime()
    if (STime == '' || ETime == '') {
        yunNotyError('请输入完整的时间段！')
        return false
    }
    if (STime != '' && ETime != '' && d1 >= d2) {
        yunNotyError('开始时间不能大于结束时间！')
        return false
    }
    url += '?type=0&startTime=' + STime + '&endTime=' + ETime
    var saveisBusiness = $('#byisBusiness .selectpicker').val()
    if (saveisBusiness) {
        url += '&isBusiness=' + saveisBusiness
    }
    //传输groupId
    url+='&groupId='+groupId;
    $.ajax({
        type: 'get',
        dataType: 'json',
        cache: false,
        url: encodeURI(url),
        success: function (data) {
            if (data.status == 0) {
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

function OutExcel (num) {
    var startTime = $('#tm1').val()
    var endTime = $('#tm2').val()
    var saveisBusiness = $('#byisBusiness .selectpicker').val()//导出报表 访客类型
    var url = '../../report/BankSatisfaction/getSatisCount?useFullType=' + num + '&type=0'
    url += '&excelFlag=1'
    if (startTime != '' && endTime != '') {//精确时间
        url += '&startTime=' + startTime + '&endTime=' + endTime
    }
    if (saveisBusiness) {
        url += '&isBusiness=' + saveisBusiness
    }
    //传输groupId
    url+='&groupId='+groupId;
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
        url: '../../classes/listClasses?m=0',
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
    var saveisBusiness = $('#byisBusiness .selectpicker').val()

    groupId=treeNode.Id;
    var rePath = '../../report/BankSatisfaction/getSatisCount?groupId=' + treeNode.Id + '&startTime=' + startTime + '&endTime=' + endTime + '&type=0';
    if (saveisBusiness) {
        rePath += '&isBusiness=' + saveisBusiness
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
