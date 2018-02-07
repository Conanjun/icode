function selectGen () {
    $('#DataSource .selectpicker').selectpicker({
        style: 'btn-primary',
        width: '100%'
    })
    $('#DataSource .selectpicker').on('change', function () {
        query($(this).val())
    })
    $('#myDropdown').on('click', function () {
        $(this).parent().addClass('open')
    })
    $('body').on('click', function (e) {
        if (!$('#myDropdown').parent().find($(e.target)).length) {
            $('#myDropdown').parent().removeClass('open')
        }
    })
//全局变量 获得当前时间
    var myDate = new Date()
    var myDateM = myDate.getMonth() + 1//月
    var myDateD = myDate.getDate()//日
    var myDateHou = myDate.getHours()//时
    var myDateMin = myDate.getMinutes()+2//分

    function updateTime(){
        myDate = new Date()
        myDateM = myDate.getMonth() + 1//月
        myDateD = myDate.getDate()//日
        myDateHou = myDate.getHours()//时
        myDateMin = myDate.getMinutes() + 2//分
    }

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
        query()
    })

    $('.ttw1').on('click', function () { //今天
        updateTime();
        $('#myDropdown').parent().removeClass('open')
        $(this).addClass('open').siblings().removeClass('open')
        $('.ttw').html($(this).text() + '&nbsp;&nbsp;<span class="caret"></span>')
        $('#tm1').val(myDate.getFullYear() + '-' + myDateM + '-' + myDateD + ' ' + '00' + ':' + '00')//今天零点
        $('#tm2').val(myDate.getFullYear() + '-' + myDateM + '-' + myDateD + ' ' + myDateHou + ':' + myDateMin)//现在时间
        query()
    })

    $('.ttw2').on('click', function () { //最近七天
        updateTime();
        $('#myDropdown').parent().removeClass('open')
        $(this).addClass('open').siblings().removeClass('open')
        $('.ttw').html($(this).text() + '&nbsp;&nbsp;<span class="caret"></span>')
        apply()
        query()
    })
    $('.ttw3').on('click', function () { //最近一个月
        updateTime();
        $('#myDropdown').parent().removeClass('open')
        $(this).addClass('open').siblings().removeClass('open')
        $('.ttw').html($(this).text() + '&nbsp;&nbsp;<span class="caret"></span>')
        $('#tm1').val(lastMonthDate() + ' ' + myDateHou + ':' + myDateMin)//一月前的今天
        $('#tm2').val(new Date().getFullYear() + '-' + myDateM + '-' + myDateD + ' ' + myDateHou + ':' + myDateMin)//现在时间
        query()
    })
    $('.ttw4').on('click', function () { //全部
        updateTime();
        $('#myDropdown').parent().removeClass('open')
        $(this).addClass('open').siblings().removeClass('open')
        $('.ttw').html($(this).text() + '&nbsp;&nbsp;<span class="caret"></span>')
        pageNo = 1
        $('#tm1').val('')
        $('#tm2').val('')
        query()
    })
}

function showselect (json) {
    var myChart2 = echarts.init(document.getElementById('main2'), 'macarons')
    var Clen = json.CXList.length
    if (Clen > 20) {
        Clen = 20
    }
    var temp = []
    if (Clen > 0) {
        for (var i = 0; i < Clen; i++) {
            var map = {}
            if (json.CXList[i].Question) {
                map.name = json.CXList[i].Question.length > 15 ? json.CXList[i].Question.substring(0, 15) + '...' : json.CXList[i].Question
            } else {
                map.name = ''
            }
            map.value = json.CXList[i].Count
            temp.push(map)
        }
    } else {
        var map = {}
        map.name = '暂无数据'
        map.value = 0
        temp.push(map)
    }
    // 初始 option2
    var option2 = {
        title: {
            text: '查询功能'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}次({d}%)'
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
            name: '被问次数',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: temp,
        },
        ]
    }
    myChart2.hideLoading()
    myChart2.setOption(option2)
    window.onresize = myChart2.resize
}

function showPie (json) {
    var myChart1 = echarts.init(document.getElementById('main'), 'macarons')
    var len = json.List.length
    if (len > 20) {
        len = 20
    }
    var temp = []
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            var map = {}
            if (json.List[i].Question) {
                map.name = json.List[i].Question.length > 15 ? json.List[i].Question.substring(0, 15) + '...' : json.List[i].Question
            } else {
                map.name = ''
            }
            map.value = json.List[i].Count
            temp.push(map)
        }
    } else {
        var map = {}
        map.name = '暂无数据'
        map.value = 0
        temp.push(map)
    }
    // 初始 option1
    var option1 = {
        title: {
            text: '咨询功能'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}次({d}%)'
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
            name: '被问次数',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            data: temp,
        },
        ]
    }
    myChart1.hideLoading()
    myChart1.setOption(option1)
    window.onresize = myChart1.resize
}

function showtable (json) {
    var table = ''
    var html = ''
    var Nlen = json.CXList.length;//查询
    var Zlen = json.List.length;//咨询
    if (Nlen == 0) {
        table += '<tr>'
        table += '<td colspan=4 style=\'text-align:center\'><i class=\'glyphicon glyphicon-warning-sign\'></i>暂无数据</td>'
        table += '</tr>'
        $('#visitDataTable').html(table)
    }
    if (Zlen == 0) {
        html += '<tr>'
        html += '<td colspan=4 style=\'text-align:center\'><i class=\'glyphicon glyphicon-warning-sign\'></i>暂无数据</td>'
        html += '</tr>'
        $('#vistZXTable').html(html)
    }
    for (var t = 0; t < Nlen; t++) {
        table += '<tr>'
        table += '<td class="tab_tr_bg">' + (json.CXList[t].Question || '') + '</td>'
        table += '<td>'+(json.CXList[t].GroupName || '')+'</td>'
        table += '<td>'+(json.CXList[t].GroupType || '')+'</td>'
        table += '<td class="tab_tr_sec_bg">' + json.CXList[t].Count + '</td>'
        table += '</tr>'
    }
    $('#visitDataTable').html(table)
    for (var k = 0; k < Zlen; k++) {
        html += '<tr>'
        html += '<td class="tab_tr_bg">' + (json.List[k].Question || '') + '</td>'
        html += '<td>'+(json.List[k].GroupName || '')+'</td>'
        html += '<td>'+(json.List[k].GroupType || '')+'</td>'
        html += '<td class="tab_tr_sec_bg">' + json.List[k].Count + '</td>'
        html += '</tr>'
    }
    $('#vistZXTable').html(html)
}

/* function showal (json) {   //查询所有的
    var table = ''
    var Nlen = json.List.length
    var Clen = json.CXList.length
    var s3 = []
    if (Nlen == 0 && Clen == 0) {
        table += '<tr >'
        table += '<td colspan=2 style=\'text-align:center\'><i class=\'glyphicon glyphicon-warning-sign\'></i>暂无数据</td>'
        table += '</tr>'
        $('#visitDataTable').html(table)
        return
    }
    s3 = json.CXList.concat(json.List)

    function sortarr (s3) {              //排序
        for (var i = 0; i < s3.length - 1; i++) {
            for (var j = 0; j < s3.length - 1 - i; j++) {
                if (s3[j].Count < s3[j + 1].Count) {
                    var temp = s3[j]
                    s3[j] = s3[j + 1]
                    s3[j + 1] = temp
                }
            }
        }
        return s3
    }

    sortarr(s3)
    for (var t2 = 0; t2 < s3.length; t2++) {
        if (s3.length > 30) {
            s3.length = 30
        }
        table += '<tr>'
        table += '<td class="tab_tr_bg">' + (s3[t2].Question || '') + '</td>'
        table += '<td class="tab_tr_sec_bg">' + s3[t2].Count + '</td>'
        table += '</tr>'
    }

    $('#visitDataTable').html(table)
} */

//对查询功能的表格展示
function showselecttable (json) {
    var table = ''
    var Clen = json.CXList.length
    if (Clen == 0) {
        table += '<tr >'
        table += '<td colspan=2 style=\'text-align:center\'><i class=\'glyphicon glyphicon-warning-sign\'></i>暂无数据</td>'
        table += '</tr>'
        $('#visitDataTable').html(table)
        return
    }
    for (var j = 0; j < Clen; j++) {
        table += '<tr>'
        table += '<td class="tab_tr_bg">' + (json.CXList[j].Question || '') + '</td>'
        table += '<td class="tab_tr_sec_bg">' + json.CXList[j].Count + '</td>'
        table += '</tr>'
    }
    $('#visitDataTable').html(table)
}
/*
 * taskId = 330  多维度热点分析统计报表优化
 * 年龄由下拉框改为输入框
 * 处理逻辑：1，年龄输入框要么全部为空，要么全部填写，
 *          2，对年龄范围进行判断，范围为1-100正整数，最小年龄小于最大年龄
 */
var age = '';
$('.searchBtn').on('click',function(){
    if($('.minAge').val() == '' && $('.maxAge').val() == '' ){
        age = ''
        query();
    }else{
        if($('.minAge').val() == '' || $('.maxAge').val() == ''){
            yunNotyError('年龄请输入完整！');
        }else{
            if(Number($('.minAge').val()) >= Number($('.maxAge').val())){
                yunNotyError('最小年龄不能大于等于最大年龄！');
            }else if($('.minAge').val() < 1 || $('.minAge').val() >= 100){
                if($('.minAge').val() == 100){
                    yunNotyError('最小年龄不能为100！');
                }else{
                    yunNotyError('年龄请输入1-100的正整数！');    
                }
            }else if($('.maxAge').val() <= 1 || $('.maxAge').val() > 100){
                if($('.maxAge').val() == 1){
                    yunNotyError('最大年龄不能为1！');
                }else{
                    yunNotyError('年龄请输入1-100的正整数！');
                }
            }else{
                age = Number($('.minAge').val()) + '-' + Number($('.maxAge').val())
                query()
            }
        }
    }
})
/**
 *  查询数据图表中的数据
 *  @param  sourceId  渠道信息的id值
 *  @param  company  公司信息
 *  @param  rank  职级信息
 *  @param  identity  身份信息
 *  @param  sex  性别信息
 *  @param  msgType  问题格式信息
 *  @param  bazaar  市场信息
 *  @param  selectSourceFlag  判断是否是第一次加载渠道信息
 *  @param  confirmBtn  判断渠道信息的id值
 */
var selectSourceFlag = true;
function query (confirmBtn) {
    var sourceId = $('#DataSource .selectpicker').val() //数据源
    var company = $('#iyunwen_company').val() || ''
    var rank = $('#iyunwen_rank').val() || ''
    var identity = $('#iyunwen_indentify').val() || ''
    var sex = $('#iyunwen_sex').val()
    var msgType = $('#iyunwen_question').children('option:selected').val() //将问题格式所选的val传到后台
    var bazaar = $('#iyunwen_market').children('option:selected').val()  //将所属市场所选的值传到后台
    if (confirmBtn) {
        var sValue = $('#tm1').val().split('-')
        var eValue = $('#tm2').val().split('-')
        $('.ttw').html(sValue[1] + '月' + sValue[2].split(' ')[0] + '日' + '-' + eValue[1] + '月' + eValue[2].split(' ')[0] + '日' + '&nbsp;<span class="caret"></span>')
    }
    var dataJSON = {
        sourceId: sourceId,
        company: company,
        rank: rank,
        identity: identity,
        age: age,
        sex: sex,
        msgType: msgType,
        bazaar: bazaar,
    }
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
    }
    $.ajax({
        type: 'get',
        dataType: 'json',
        cache: false,
        data: dataJSON,
        url: '../../report/HotspotIssues/getHotsIssues',
        success: function (data) {
            if (data.status == 0) {
               // $('#iyunwen_service').change(function () {
                    if ($('#iyunwen_service').children('option:selected')) {
                        var selectedval = $('#iyunwen_service').children('option:selected').val()
                        if (selectedval == -1) {  //查全部
                            //showal(data)
                            $('#myTab li:eq(0)').addClass('active');
                            $('#myTab li:eq(1)').removeClass('active');
                            $('#CXTab').addClass('active in');
                            $('#ZXTab').removeClass('active in');
                        }
                        if (selectedval == 0) {  //查询
                            $('#myTab li:eq(0)').addClass('active');
                            $('#myTab li:eq(1)').removeClass('active');
                            $('#CXTab').addClass('active in');
                            $('#ZXTab').removeClass('active in');
                        }
                        if (selectedval == 1) {  //咨询
                            $('#myTab li:eq(0)').removeClass('active');
                            $('#myTab li:eq(1)').addClass('active');
                            $('#CXTab').removeClass('active in');
                            $('#ZXTab').addClass('active in');
                        }
                    }
               // })
                //通过selectSourceFlag判断，只在第一次加载时获取渠道信息
                if(data.sourceList){
                    if(data.sourceList[0]){
                        if(selectSourceFlag){
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
                                query($(this).val())
                            })
                            selectSourceFlag = false
                        }
                    }
                }
                // 存储类别值 
                $('#saveSourceId').attr('value', confirmBtn)
                // 设置新标题 
                var title = '多维度热点问题分析'
                var sourceName = getSourceName(confirmBtn)
                if (sourceName !== '') {
                    title += ' (' + sourceName + ')'
                }
                $('#chartHead').text(title)
                showPie(data)
                showtable(data)
                showselect(data)
            } else {
                yunNoty(data)
            }
        }
    })
}

/**
 导出Excel
 */
var ageData = ''
$('.outExecl').on('click',function(){
    if($('.minAge').val() == '' && $('.maxAge').val() == '' ){
        ageData = ''
        OutExcel();
    }else{
        if($('.minAge').val() == '' || $('.maxAge').val() == ''){
            yunNotyError('年龄请输入完整！');
        }else{
            if(Number($('.minAge').val()) >= Number($('.maxAge').val())){
                yunNotyError('最小年龄不能大于等于最大年龄！');
            }else if($('.minAge').val() < 1 || $('.minAge').val() >= 100){
                if($('.minAge').val() == 100){
                    yunNotyError('最小年龄不能为100！');
                }else{
                    yunNotyError('年龄请输入1-100的正整数！');
                }
            }else if($('.maxAge').val() <= 1 || $('.maxAge').val() > 100){
                if($('.maxAge').val() == 1){
                    yunNotyError('最大年龄不能为1！');
                }else{
                    yunNotyError('年龄请输入1-100的正整数！');
                }
            }else{
                ageData = Number($('.minAge').val()) + '-' + Number($('.maxAge').val())
                OutExcel()
            }
        }
    }
})
function OutExcel () {
    var sourceId = $('#DataSource .selectpicker').val() //数据源
    var company = $('#iyunwen_company').val()
    var rank = $('#iyunwen_rank').val()
    var identity = $('#iyunwen_indentify').val()
    var age = ageData
    var sex = $('#iyunwen_sex').val()
    var msgType = $('#iyunwen_question').children('option:selected').val() //将问题格式所选的val添加参数
    var bazaar = $('#iyunwen_market').children('option:selected').val()  //将所属市场所选的值添加参数

    var sValue = $('#tm1').val().split('-')
    var eValue = $('#tm2').val().split('-')
    $('.ttw').html(sValue[1] + '月' + sValue[2].split(' ')[0] + '日' + '-' + eValue[1] + '月' + eValue[2].split(' ')[0] + '日' + '&nbsp;<span class="caret"></span>')
    var STime = $('[name=startT]').val()
    var ETime = $('[name=endT]').val()
    var d1 = new Date(STime.replace(/\-/g, '\/')).getTime()
    var d2 = new Date(ETime.replace(/\-/g, '\/')).getTime()

    var queryString = '../../report/HotspotIssues/getHotsIssues?sourceId=' + sourceId + '&company=' + encodeURI(company) + '&startT=' + STime + '&endT=' + ETime + '&msgType=' + encodeURI(msgType) + '&bazaar=' + encodeURI(bazaar) + '&rank=' + encodeURI(rank) + '&identity=' + encodeURI(identity) + '&age=' + encodeURI(age) + '&sex=' + sex
    location.href = queryString + '&excelFlag=1'
    return
}

//部门下拉框
function getParam () {
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        //不从缓存中去数据
        url: encodeURI('../../report/HotspotIssues/getCompanys'),
        success: function (data) {
            if (data.status == 0) {
                var html = ''
                html += '<select id="iyunwen_company" class=" selectpicker">'
                html += '<option value="">请选择公司</option>'
                if (data.List.length) {
                    for (var i = 0; i < data.List.length; i++) {
                        html += '<option value="' + data.List[i].Company + '" >' + data.List[i].Company + '</option>'
                    }
                }
                html += '</select>'
                $('#deptDiv').append(html)
                $('#deptDiv .selectpicker').selectpicker({
                    style: 'btn-primary',
                    width: '100%'
                })
            }
        }
    })
}

//获取职级
function getlevel () {
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        //不从缓存中去数据
        url: encodeURI('../../report/HotspotIssues/getRanks'),
        success: function (data) {
            if (data.status == 0) {
                var html = ''
                html += '<select id="iyunwen_rank" class="selectpicker">'
                html += '<option value="">请选择职级</option>'
                if (data.List.length) {
                    for (var i = 0; i < data.List.length; i++) {
                        html += '<option value="' + data.List[i].Rank + '" >' + data.List[i].Rank + '</option>'
                    }
                }
                html += '</select>'
                $('#levelDiv').append(html)
                $('#levelDiv .selectpicker').selectpicker({
                    style: 'btn-primary',
                    width: '100%'
                })
            }
        }
    })
}

//获取身份信息
function getindentify () {
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        //不从缓存中去数据
        url: encodeURI('../../report/HotspotIssues/getIdentity'),
        success: function (data) {
            if (data.status == 0) {
                var html = ''
                html += '<select id="iyunwen_indentify" class="form-control">'
                html += '<option value="">请选择身份</option>'
                if (data.List.length) {
                    for (var i = 0; i < data.List.length; i++) {
                        html += '<option value="' + data.List[i].Identity + '" >' + data.List[i].Identity + '</option>'
                    }
                }
                html += '</select>'
                $('#indentifyDiv').append(html)
                $('#indentifyDiv #iyunwen_indentify').selectpicker({
                    style: 'btn-primary',
                    width: '100%'
                })
            }
        }
    })
}
var selectSourceFlag = true
/* function sourceType (num) {
    var sourceId = $('#DataSource .selectpicker').val() //数据源
    var company = $('#iyunwen_company').val() || ''
    var rank = $('#iyunwen_rank').val() || ''
    var identity = $('#iyunwen_indentify').val() || ''
    var sex = $('#iyunwen_sex').val()
    var msgType = $('#iyunwen_question').children('option:selected').val() //将问题格式所选的val传到后台
    var bazaar = $('#iyunwen_market').children('option:selected').val()||''  //将所属市场所选的值传到后台
    var dataJSON = {
        sourceId: sourceId,
        company: company,
        rank: rank,
        identity: identity,
        age: age,
        sex: sex,
        msgType: msgType,
        bazaar: bazaar,
    }
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
    }
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        data: dataJSON,
        url: '../../report/HotspotIssues/getHotsIssues',
        success: function (data) {
            if (data.status === 0) {
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
                           sourceType($(this).val())
                      })
                selectSourceFlag = false
                //存储类别值
                $('#saveSourceId').attr('value', num)
                //设置新标题 
                var title = '多维度热点问题分析'
                var sourceName = getSourceName(num)
                if (sourceName !== '') {
                    title += ' (' + sourceName + ')'
                }
                $('#chartHead').text(title)
                showPie(data)
                showselect(data)
                showtable(data)
            } else {
                yunNoty(data)
            }
        }
    })
} */