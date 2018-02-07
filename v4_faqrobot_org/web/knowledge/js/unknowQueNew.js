var defineType = 3
//富文本答案
var richtextUE = UE.getEditor('ans-textarea', {
    initialFrameHeight: 200,
    zIndex: 90,
    wordCount: true,
    maximumWords: 20000
})
$(document).ready(function () {
    $('.ans-textarea').addWordCount(20000);
    //datetimepicker配置项
    $('.form_datetime').datetimepicker({
        language: 'zh-CN',
        format: 'yyyy-mm-dd hh:ii',
        autoclose: true,
        todayBtn: true,
        minuteStep: 10,
        initialDate: new Date(),
        zIndex: 1500,
    })
    $('.toShow').slimScroll({
        height: $(window).height() - 200 + 'px',
        allowPageScroll: false
    })
    $('.has').click(function () {
        defineType = 3
    })
    $('.hasnt').click(function () {
        defineType = 0
    })
    $('.talk').click(function () {
        defineType = 1
    })
    $('.meaningLess').click(function () {
        defineType = 2
    })

    $('.search-input-addSrc').val(getUrlParam('q'))
    var sonq = ''
    if (getUrlParam('q')) {
        sonq = getUrlParam('q')
        $('.notmSearch').show()
    }
    $('.notmSearch').on('click', function () {
        $.ajax({
            type: 'get',
            cache: false,
            datatype: 'json',
            url: encodeURI('../../WarnDataDetail/ignoreWord'),
            data: {
                word: sonq
            },
            success: function (data) {
                if (data.status === 0) {
                    yunNoty({
                        status: 0,
                        message: '[' + sonq + '] 忽略成功！'
                    })
                    $('.notmSearch').hide()
                }
            }
        })
    })

    var selectSourceFlag = true

    var This = this
    var type = 1, //素材类型
        isInit = true,
        pageNo = 1, //当前页
        pageSize = 20, //每页数量
        orderType = 4,
        isLeaf = 0,
        groupId = 0,
        ttw = 4,
        defineFlag = 'tab',
        inQue = '', //搜索的问题
        isJpage = 0, //是否已实例化jpage
        delPage = 0, //是否删除jpage
        sourceType = -1
    inQue = getUrlParam('q')

    function initSrc(confirmBtn) {
        if (confirmBtn) {
            if ($('#tm1').val() && $('#tm2').val()) {
                var sValue = $('#tm1').val().split('-')
                var eValue = $('#tm2').val().split('-')
                $('.ttw').html('').html(sValue[1] + '月' + sValue[2].split(' ')[0] + '日' + '-' + eValue[1] + '月' + eValue[2].split(' ')[0] + '日' + '&nbsp;<span class="caret"></span>')
            } else if (!($('#tm1').val() || $('#tm2').val())) {
                //两个时间框均为空
            } else {
                //单个时间框为空
                yunNotyError("请填写完整时间范围");
                return;
            }
        }
        $('.multCos').iCheck('uncheck')
        if (defineFlag == 'tab') {
            if (defineType == 3) {
                $('#manman').attr('src', 'images/man-blue.png')
                $('#rrobot').attr('src', 'images/robot-blue.png')
            } else {
                $('#manman').attr('src', 'images/man-grey.png')
                $('#rrobot').attr('src', 'images/robot-grey.png')
            }
        } else {
            $('.nav-tabs').children().removeClass('active')
            $('.tab-content').children().removeClass('active')
            $('a[href="t1"]').parent().addClass('active')
            $('#t1').addClass('active')
            if ($('#manman').attr('src') == 'images/man-grey.png' && $('#rrobot').attr('src') == 'images/robot-grey.png') {
                defineType = 0
            } else if ($('#manman').attr('src') == 'images/man-blue.png' && $('#rrobot').attr('src') == 'images/robot-grey.png') {
                defineType = 5
            } else if ($('#manman').attr('src') == 'images/man-grey.png' && $('#rrobot').attr('src') == 'images/robot-blue.png') {
                defineType = 4
            } else if ($('#manman').attr('src') == 'images/man-blue.png' && $('#rrobot').attr('src') == 'images/robot-blue.png') {
                defineType = 3
            }
        }
        $('#tb01').tableAjaxLoader2(8)
        var isHttp = new RegExp('http')
        //选择分类时，需要初始化分页，即从第一页开始
        if (isInit) {
            pageNo = 1;
        } else {
            pageNo = sessionStorage.getItem('unknow_pageNo') || 1;
        }
        groupId = sessionStorage.getItem('unknow_groupId') || 0;
        
        Base.request({
            type: 'get',
            url: 'LearnQue/newList',
            cache: false,
            params: {
                type: type,
                pageNo: pageNo,
                pageSize: pageSize,
                orderType: orderType,
                isLeaf: isLeaf,
                groupId: groupId,
                inQue: inQue,
                startT: $('[name=startT]').val(),
                endT: $('[name=endT]').val(),
                source: sourceType,
            },
            callback: function (data) {
                if (data.status) {
                    Base.gritter(data.message, false)
                } else {
                    if (data.sourceList) {
                        if (data.sourceList[0]) {
                            if (selectSourceFlag) {
                                var html = '<li><a class="sol" href="#" data-sol="-1">全部渠道</a></li>'
                                for (var m in data.sourceList) {
                                    html += '<li><a class="sol" href="javascript:;" data-sol="' + data.sourceList[m].DicCode + '">' + data.sourceList[m].DicDesc + '</a></li>'
                                }
                                $('#DataSourceUL').empty().append(html)
                                $('#DataSourceUL a').on('click', function () {
                                    pageNo = 1
                                    sourceType = $(this).attr('data-sol')
                                    if (sourceType == '-1') {
                                        $('.sourceType').html('全部渠道<span class="caret"></span>')
                                    } else {
                                        $('.sourceType').html(getSourceName(sourceType) + '<span class="caret"></span>')
                                    }
                                    initSrc()
                                })
                                selectSourceFlag = false
                            }
                        }
                    }
                    var setting3 = {
                        data: {
                            simpleData: {
                                enable: true,
                            },
                        },
                        view: { //不显示图标
                            showIcon: false
                        },
                        check: {
                            enable: true,
                        },
                        callback: {
                            onCheck: function (event, treeId, treeNode) {
                                RoleName = []
                                CombIds = []
                                var treeObj3 = $.fn.zTree.getZTreeObj('ztree3')
                                var nodes3 = treeObj3.getCheckedNodes(true)
                                for (var i = 0; i < nodes3.length; i++) {
                                    RoleName.push(nodes3[i].name)
                                    CombIds.push(nodes3[i].id)
                                }
                                $('.roleInput').attr({
                                    title: RoleName,
                                }).val(RoleName)
                            }
                        }
                    }
                    //获取来访者角色分类
                    Base.request({
                        type: 'get',
                        url: 'comb/loadCombs',
                        cache: false,
                        params: {
                            m: 0,
                        },
                        callback: function (data) {
                            if (data.status) {
                                Base.gritter(data.message, false)
                            } else {
                                var html = ''
                                if (data.list) {
                                    if (data.list[0]) {
                                        var formatData = [],
                                            len = data.list.length

                                        for (var key in data.list) {
                                            formatData[key] = {}
                                            formatData[key]['name'] = data.list[key]['Name']
                                            formatData[key]['pId'] = data.list[key]['ParentId'] + 1
                                            formatData[key]['id'] = data.list[key]['Id'] + 1
                                        }

                                        formatData[len] = {}
                                        formatData[len]['name'] = '全部角色'
                                        formatData[len]['pId'] = 0
                                        formatData[len]['id'] = 1

                                        $.fn.zTree.init($('#ztree3'), setting3, formatData)

                                    } else {

                                    }
                                }
                            }
                        },
                    })
                    var html = ''
                    var tmpInque = "";
                    var tmpInqueArr = [];
                    var blackName = '<li class="dropdown getMoreCor" style="display:inline-block;">'+
                                        '<a class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" href="#">更多操作<span class="caret"></span></a>'+
                                        '<ul class="dropdown-menu" style="min-width: 80px !important;right: 0;left:auto;">'+
                                            '<li class="igA clickBtn"><a href="#">加入黑名单</a></li>'+
                                            '<li class="addMark clickBtn addreMark"><a href="#">添加备注</a></li>'+
                                            '<li class="addMark clickBtn editreMark hide"><a href="#">编辑备注</a></li>'+
                                        '</ul>'+
                                    '</li>'
                    if (data.List[0]) {
                        for (var i = 0; i < data.List.length; i++) {
                            tmpInque = data.List[i].InQue;
                            tmpInqueArr.push(data.List[i].InQue);
                            if (data.List[i].MsgType == 1) {
                                //未知问题中包含图片
                                if (tmpInque) {
                                    if (new RegExp('__xgn_iyunwen_').test(tmpInque)) {
                                        tmpInque = (tmpInque.split('__xgn_iyunwen_')[1] || '')
                                        if (isHttp.test(tmpInque)) {
                                            tmpInque = '<img src="' + tmpInque + '">'
                                        } else {
                                            tmpInque = '<img src="/' + tmpInque + '">'
                                        }
                                    }
                                }

                            } else if (data.List[i].MsgType == 2) {
                                //未知问题中包含语音
                                if (tmpInque) {
                                    if (new RegExp('__xgn_iyunwen_').test(tmpInque)) {
                                        tmpInque = tmpInque.split('__xgn_iyunwen_')
                                        //添加【语音】标识
                                        tmpInque = '【语音】' + tmpInque[0];

                                    } else {
                                        //Amend by zhaoyx at 2017/12/21 处理问题类型为语音 不含'__xgn_iyunwen_' 未显示【语音】的bug
                                        tmpInque = '【语音】' + tmpInque;
                                    }
                                    if (tmpInque.substr(tmpInque.length - 1, 1) == '。') {
                                        tmpInque = tmpInque.split('。')[0];
                                    }
                                }
                            }

                            html += '<tr Id="' + data.List[i].Id + '" InQue="' + tmpInque + '" GroupId="' + data.List[i].GroupId + '" ChatUserId="' + data.List[i].ChatUserId + '" ChatVersion="' + data.List[i].ChatVersion + '"><td><input class="singleCos" type="checkbox"></td>'
                            html += '<td style="padding-left:0;padding-right:0"><img title="移动分类" class="timeTip move" width="15" src="images/hand-blue.png" style="width:15px;" alt="机器人" /></td>'

                            /*保存问题类型*/
                            html += '<td msgType="' + data.List[i].MsgType + '">' + tmpInque + '</td>'
                            if(data.List[i].GroupId == -1){//寒暄
                                html += '<td style="white-space:nowrap;cursor:pointer" class="unknowQue"><a>寒暄分类</a></td>'
                            }else if(data.List[i].GroupId == -2){//无意义
                                html += '<td style="white-space:nowrap;cursor:pointer" class="unknowQue"><a>无意义分类</a></td>'
                            }else if(data.List[i].GroupId == 0){//业务未分类
                                html += '<td style="white-space:nowrap;cursor:pointer" class="unknowQue"><a>业务未分类</a></td>'
                            }else{//其他
                                html += '<td style="white-space:nowrap;cursor:pointer" class="unknowQue"><a>' + data.List[i].GroupName + '</a></td>'
                            }
                            if (data.List[i].AddWayType == '0') {
                                html += '<td class="tbshow"><img width="15" style="margin-left: 18px;" src="images/robot-blue.png" alt="机器人" /></td>'
                            } else if (data.List[i].AddWayType == '1') {
                                html += '<td class="tbshow"><img width="15" src="images/man-blue.png" alt="人工" /></td>'
                            } else {
                                html += '<td style="white-space:nowrap;" class="tbshow"></td>'
                            }
                            if (data.List[i].SourceName) {
                                html += '<td style="white-space:nowrap;">' + data.List[i].SourceName + '</td>'
                            } else {
                                html += '<td style="white-space:nowrap;"></td>'
                            }
                            if (data.List[i].watched === false) {
                                html += '<td style="white-space:nowrap;">' + data.List[i].DateTime + '</td><td><a class="isRemark" style="cursor:pointer;">'+ (data.List[i].Remark || '') +'</a></td><td style="white-space:nowrap;"><a index="' + i + '" class="checkChat" href="javascript:;" title="查看聊天记录" rel="' + data.List[i].ChatUserId + '" cv="' + data.List[i].ChatVersion + '"><i class="timeTip clickBtn glyphicon glyphicon-eye-open" title="查看聊天记录"></i></a><a><i class="timeTip ans clickBtn glyphicon glyphicon-pencil" title="回答" data-toggle="modal" data-target="#modal-dialog-ans"></i><i class="timeTip ig clickBtn glyphicon glyphicon-trash" title="删除"></i><i class="timeTip igSame clickBtn glyphicon glyphicon-ban-circle" title="删除相同"></i>'+blackName+'</a></td></tr>'
                            } else {
                                html += '<td style="white-space:nowrap;">' + data.List[i].DateTime + '</td><td><a class="isRemark" style="cursor:pointer;">'+ (data.List[i].Remark || '') +'</a></td><td style="white-space:nowrap;"><a index="' + i + '" class="checkChat" href="javascript:;" title="查看聊天记录" rel="' + data.List[i].ChatUserId + '" cv="' + data.List[i].ChatVersion + '"><i class="timeTip clickBtn glyphicon glyphicon-eye-open" style="color:#094e8a" title="查看聊天记录"></i></a><a><i class="timeTip ans clickBtn glyphicon glyphicon-pencil" title="回答" data-toggle="modal" data-target="#modal-dialog-ans"></i><i class="timeTip ig clickBtn glyphicon glyphicon-trash" title="删除"></i><i class="timeTip igSame clickBtn glyphicon glyphicon-ban-circle" title="删除相同"></i>'+blackName+'</a></td></tr>'
                            }

                            //绑定lookChat方法点击事件
                            $('#tb01').undelegate('.checkChat', 'click').delegate('.checkChat', 'click', function () {
                                lookChat(this, tmpInqueArr[$(this).attr('index')]);
                            });
                        }
                        var options = {
                            data: [data, 'List', 'total'],
                            currentPage: (data.currentPage > data.totlePages ? data.totlePages : data.currentPage),
                            totalPages: data.totlePages ? data.totlePages : 1,
                            alignment: 'right',
                            onPageClicked: function (event, originalEvent, type, page) {
                                pageNo = page
                                sessionStorage.setItem('unknow_pageNo', pageNo);
                                isInit = false;
                                initSrc()
                            }
                        }
                        $('#itemContainer').bootstrapPaginator(options)
                    } else {
                        html += '<tr><td colspan="8" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>'
                        $('#itemContainer').html('')
                    }
                    $('.tbody1').empty().append(html)
                    $('.timeTip').tooltip()
                    icheckInit()
                    $('.getMoreCor').on('click',function(){
                        var This = this;
                        setTimeout(function(){
                            if($(This).hasClass('open')){
                                if($(This).parents('tr').find('td').eq(7).find('a').html()){
                                    $(This).find('.editreMark').removeClass('hide');
                                    $(This).find('.addreMark').addClass('hide');
                                }
                            }
                        },10)
                    })
                    if ($('a[href="t1"]').parent().hasClass('active')) {
                        $('.tbshow').removeClass('tbhide')
                    } else {
                        $('.tbshow').addClass('tbhide')
                    }
                }
            },
        })
    }
    
    
    //一键清空
    $('#ok').on('click', function () {
        $('#makeSure').hide()
        $.ajax({
            type: 'post',
            data: { 'defineType': "", 'type': 1 },
            url: '../../LearnQue/delAll',
            success: function (data) {
                if (data.status == 0) {
                    $('.tbody1').empty().html('<td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td>')
                    initSrc()
                    yunNoty(data)
                } else {
                    yunNotyError(data.message)
                    initSrc()
                }
            }
        })
    })
    /*
    * 页面分类树，记录每次点击的节点，用于页面刷新后保持点击的节点
    */
    function resee1() {
        var setting1 = {
            data: {
                simpleData: {
                    enable: true,
                },
            },
            view: { //不显示图标
                showIcon: false
            },
            async: {
                enable: true,
                url: '../../classes/listClasses?m=' + 0,
                dataFilter: function (treeId, parentNode, data) {
                    if (data.status) {
                        Base.gritter(data.message, false)
                    } else {
                        var html = ''
                        if (data.list[0]) {
                            var formatData1 = [];
                            var len = data.list.length;
                        
                            for (var key in data.list) {
                                var dk = data.list[key]
                                formatData1[key] = {}
                                formatData1[key]['name'] = dk['Name']
                                formatData1[key]['pId'] = dk['ParentId'] + 1
                                formatData1[key]['id'] = dk['Id'] + 1
                            }
                          
                            formatData1[len] = {}
                            formatData1[len]['name'] = '全部分类'
                            formatData1[len]['pId'] = 0
                            formatData1[len]['id'] = 1  
                            formatData1[len]['open'] = true
                            /*
                            * taskId = 716 未知问题分类增加‘业务未知分类’和‘寒暄未知分类’两个节点
                            */
                            formatData1[len+1] = {}
                            formatData1[len+1]['name'] = '寒暄分类（系统分类）'
                            formatData1[len+1]['pId'] = 1
                            formatData1[len+1]['id'] = -10//原本为0，但ztree节点id不能为0，此处定义为-10，做映射
                            formatData1[len+1]['open'] = true
                            formatData1[len+2] = {}
                            formatData1[len+2]['name'] = '无意义分类（系统分类）'
                            formatData1[len+2]['pId'] = 1
                            formatData1[len+2]['id'] = -1
                            formatData1[len+2]['open'] = false
                            formatData1[len+3] = {}
                            formatData1[len+3]['name'] = '业务未分类（系统分类）'
                            formatData1[len+3]['pId'] = 1
                            formatData1[len+3]['id'] = -2
                            formatData1[len+3]['open'] = false
                            return formatData1;

                        }
                    }
                    /*
                    $.ajax('../../LearnQue/getListCount', {
                        type: 'get',
                        datatype: 'json',
                        cache: false, //不从缓存中去数据
                        success: function (data6) {
                            if (data.status) {
                                Base.gritter(data.message, false)
                            } else {
                                var html = ''
                                if (data.list[0]) {
                                    var formatData1 = [];
                                    var len = data.list.length;
                                    var countg = 0
                                
                                    for (var key in data.list) {
                                        var dk = data.list[key]
                                        formatData1[key] = {}
                                        formatData1[key]['name'] = dk['Name']
                                        if (data6.list[dk['Id']]) {
                                            formatData1[key]['name'] = formatData1[key]['name'] + '【' + data6.list[dk['Id']] + '个问题】'
                                            countg += data6.list[dk['Id']]
                                        }
                                        formatData1[key]['pId'] = dk['ParentId'] + 1
                                        formatData1[key]['id'] = dk['Id'] + 1
                                    }
                                  
                                    formatData1[len] = {}
                                    formatData1[len]['name'] = '全部分类' + '【' + countg + '个问题】'
                                    formatData1[len]['pId'] = 0
                                    formatData1[len]['id'] = 1  
                                    formatData1[len]['open'] = true
                                    formatData1[len+1] = {}
                                    formatData1[len+1]['name'] = '业务未知分类（系统分类）'
                                    formatData1[len+1]['pId'] = 1
                                    formatData1[len+1]['id'] = -10//原本为0，但ztree节点id不能为0，此处定义为-10，做映射
                                    formatData1[len+1]['open'] = true
                                    formatData1[len+2] = {}
                                    formatData1[len+2]['name'] = '寒暄未知分类（系统分类）'
                                    formatData1[len+2]['pId'] = 1
                                    formatData1[len+2]['id'] = -1
                                    formatData1[len+2]['open'] = false
                                    $.fn.zTree.init($('#ztree1'), setting1, formatData1);//获取数据后重新初始化一次分类树

                                }
                            }
                        },
                    })
                    */
                }
            },
            callback: {
                onClick: function (event, treeId, treeNode) {
                    if(treeNode.id == '-10'){
                        groupId = -1;
                    }else{
                        groupId = treeNode.id - 1
                    }
                    sessionStorage.setItem('unknow_groupId', (groupId || 0));
                    pageNo = 1;
                    isInit = true;
                    initSrc()
                },
                onAsyncSuccess: function (event, treeId, treeNode) {
                    var zTree = $.fn.zTree.getZTreeObj("ztree1");
                    if (sessionStorage.getItem('unknow_groupId')) {
                        isInit = false;
                        if(parseInt(sessionStorage.getItem('unknow_groupId')) == -1){
                            var Node = zTree.getNodeByParam('id', -10, null);
                        }else{
                            var Node = zTree.getNodeByParam('id', (parseInt(sessionStorage.getItem('unknow_groupId')) + 1), null);
                        }
                        zTree.selectNode(Node);
                    }
                }
            }
        };
        $.fn.zTree.init($('#ztree1'), setting1, []);

    }
    resee1();

    //回答问题模态框中问题分类树
    function resee2() {
        var setting2 = {
            data: {
                simpleData: {
                    enable: true,
                },
            },
            view: { //不显示图标
                showIcon: false
            },
            check: {
                //enable: true,
            },
            async: {
                enable: true,
                url: '../../classes/listClasses?m=' + 0,
                dataFilter: function (treeId, parentNode, data) {
                    if (data.status) {
                        Base.gritter(data.message, false)
                    } else {
                        var html = ''
                        if (data.list[0]) {
                            /*TaskId = 416 回答弹框中的分类树，不用显示【XXX个问题】
                            *原因：回答问题弹框中分类树与未知问题页面中的分类树共用同一个数组formatData
                            *修改：声明两个数组，存放不同的内容
                            */
                            var formatData2 = [],
                                len = data.list.length,
                                countg = 0
                            for (var key in data.list) {
                                var dk = data.list[key]
                                formatData2[key] = {}
                                formatData2[key]['name'] = dk['Name']
                                formatData2[key]['pId'] = dk['ParentId'] + 1
                                formatData2[key]['id'] = dk['Id'] + 1
                            }
                            formatData2[len] = {}
                            formatData2[len]['name'] = '全部分类'
                            formatData2[len]['pId'] = 0
                            formatData2[len]['id'] = 1
                            formatData2[len]['open'] = true
                            return formatData2;
                        }
                    }
                }
            },
            callback: {
                onClick: function (event, treeId, treeNode) {
                    $('.closeAll2').trigger('click')
                    groupId = treeNode.id - 1
                    pageNo2 = 1
                    /*
                     * taskId = 429 智能学习未知问题编辑答案回答时，多次变价仅回答并学习按钮不置灰
                     *  判断是否是已有答案回答，如果是则执行ansQue
                     */
                    if ($('.nav-pills li.active a[href="#navpill6661"]').text() == '已有答案回答') {
                        ansQue();
                    }
                    $('#ztree2').fadeOut()
                    $('.selectQue').html(treeNode.name)
                }
            }
        }
        $.fn.zTree.init($('#ztree2'), setting2, [])

    }
    resee2()

    /*
    * taskId = 683 页面分类树，通过点击表格中分类，弹出分类树弹框进行选择
    * 新增：分类树ztree4，通过点击表格中分类弹出模态框，进行选择分类
    */
    function resee4(){
        var unknowClass = "";
        var nodeId = 0;
        var _td = "";//保留点击表格中分类的this
        //分类树初始化
        var setting4 = {
            data: {
                simpleData: {
                    enable: true,
                },
            },
            view: { //不显示图标
                showIcon: false
            },
            async: {
                enable: true,
                url: '../../classes/listClasses?m=' + 0,
                dataFilter: function (treeId, parentNode, data) {
                    if (data.status) {
                        Base.gritter(data.message, false)
                    } else {
                        var html = ''
                        if (data.list[0]) {
                            var formatData4 = [];
                            var len = data.list.length;
                            for (var key in data.list) {
                                var dk = data.list[key]
                                formatData4[key] = {}
                                formatData4[key]['name'] = dk['Name']
                                formatData4[key]['pId'] = dk['ParentId'] + 1
                                formatData4[key]['id'] = dk['Id'] + 1
                            }
                            formatData4[len] = {}
                            formatData4[len]['name'] = '全部分类'
                            formatData4[len]['pId'] = 0
                            formatData4[len]['id'] = 1
                            formatData4[len]['open'] = true
                            return formatData4;
                        }
                    }
                }
            },
            callback: {
                onClick: function (event, treeId, treeNode) {
                    unknowClass = treeNode.name;
                    nodeId = treeNode.id;
                    $(_td).parent('tr').attr('groupId', nodeId - 1);
                },
                onAsyncSuccess: function (event, treeId, treeNode) {
                    var zTree = $.fn.zTree.getZTreeObj("ztree4");
                    //保留当前选择的节点
                    var Node = zTree.getNodeByParam('id', parseInt($(_td).parent('tr').attr('groupId'))+1, null);
                    zTree.selectNode(Node);
                }
            }
        };
        

        //表格中分类点击事件注册，弹出分类模态框
        $('.tbody1').undelegate('unknowQue', 'click').delegate('.unknowQue', 'click', function(){
            $.fn.zTree.init($('#ztree4'), setting4, []);
            $('#queClassModel').modal('show');
            $('#ztree4').slimScroll({
                height: '300px',
            })
            _td = this;//保留this
        })

        //分类模态框确实事件注册，修改页面分类，并将数据传入后台
        $('#selClassBtn').unbind('click').bind('click', function(){
            $(_td).find('a').html(unknowClass);
            $('#queClassModel').modal('hide');
            groupId = nodeId - 1;
            Base.request({
                type: 'post',
                cache: false,
                url: 'LearnQue/ensureGroup',
                params: {
                    groupId: groupId,
                    id: $(_td).parent('tr').attr('id'),
                    addType: 1
                },
                callback: function (data) {
                    if (data.status) {
                        Base.gritter(data.message, false)
                    } else {
                        Base.gritter(data.message, true)
                        resee1();
                    }
                },
            })
        });
    }
    resee4()

    /* 判断是单点还是云上，云上没有未知问题标签列表 */
    var isDandian = false,
        ignoreWhich = '' // #1

    if (isDandian) {
        $('.dandain').show()
        $('#myfather').append('<iframe id="myFrame" name="myFrame" src="Unknown_mark.html" frameborder="0" width="100%" height="100%"></iframe>')
        window.onload = function () { //常用的$(function() {})此时省略
            var $document = $(window.frames['myFrame'].document)
            $document.find('head').append('<style>' +
                'body {padding: 0; background:#fff;}' +
                '#content {display: none!important;}' +
                '.bolda {display: none!important;}' +
                '.boldc {border: none!important;}' +
                '.list {display: none!important;}' +
                '.aa {display: none!important;}' +
                '.a, .rowNav .panel-body, .rowNav .panel-body .col-md-2, .boldb {padding: 0!important; margin: 0!important;}' +
                '</style>')

            //$('.branchSearch input[name=groupId]').val(treeNode.Id);

            // 选择一个未知问题标签
            $('#ensureCos').on('click', function () {

                //doIgnoreQues doIgnoreSameQues doIgnoreQues #1
                var ignoreId = ''
                if (ignoreWhich == 'doIgnoreSameQues') {
                    ignoreId = 'id'
                } else {
                    ignoreId = 'ids'
                }

                if ($document.find('.curSelectedNode')[0]) {
                    if (+$document.find('#isleaf').val()) { // #4
                        $.ajax({
                            type: 'get',
                            datatype: 'json',
                            cache: false, //不从缓存中去数据
                            url: encodeURI('../../LearnQue/' + ignoreWhich + '?' + ignoreId + '=' + (isType(window.$obj, 'string') ? window.$obj : window.$obj.attr('id'))) + '&classId=' + $document.find('.branchSearch input[name=groupId]').val(),
                            success: function (data) {
                                if (data.status) {
                                    var msg = data.message
                                    if (msg == '参数不能为空') {
                                        msg = '勾选要忽略的问题'
                                    }
                                    Base.gritter(msg, false)
                                } else {
                                    $('#dandianModal').modal('hide')
                                    initSrc();
                                    resee1();
                                    Base.gritter(data.message, true)
                                }
                            }
                        })
                    } else {
                        yunNotyError('请选择一个子分类')
                    }
                } else {
                    yunNotyError('请先选择一个分类')
                }
            })

        }
    } else {
        $('.dandain').hide()
    }

    // 判断类型 array number string date function regexp object boolean null undefined
    function isType(obj, type) {
        return Object.prototype.toString.call(obj).toLowerCase() === '[object ' + type + ']'
    }

    //全部忽略事件
    $('body').on('click', '.ig, .igSame, .igA, .addMark, .isRemark, .mult-editClassify, .mult-ig, .mult-igA', function () {
        delPage = 1

        if ($(this).is('.ig')) { //忽略
            var $tr = $(this).parents('tr'),
                ids = $tr.attr('Id')

            ignoreWhich = 'doIgnoreQues' // #1
            window.$obj = $tr
            $(this).adcCreator(function () {
                if (isDandian) {
                    $('#dandianModal').modal('show')
                } else {
                    Base.request({
                        type: 'get',
                        cache: false,
                        url: 'LearnQue/doIgnoreQues',
                        params: {
                            ids: ids,
                        },
                        callback: function (data) {
                            if (data.status) {
                                Base.gritter(data.message, false)
                            } else {
                                Base.gritter(data.message, true)
                                if ($('.ig').length == 1) {
                                    if (pageNo >= 2) {
                                        pageNo -= 1
                                    }
                                }
                                initSrc();
                                resee1();
                            }
                        },
                    })
                }
            })

        }
        if ($(this).is('.igSame')) { //忽略相同
            var $tr = $(this).parents('tr'),
                id = $tr.attr('Id')

            ignoreWhich = 'doIgnoreSameQues' // #1
            window.$obj = $tr
            $(this).adcCreator(function () {
                if (isDandian) {
                    $('#dandianModal').modal('show')
                } else {
                    Base.request({
                        type: 'get',
                        cache: false,
                        url: 'LearnQue/doIgnoreSameQues',
                        params: {
                            id: id,
                        },
                        callback: function (data) {
                            if (data.status) {
                                Base.gritter(data.message, false)
                            } else {
                                Base.gritter(data.message, true)
                                if ($('.ig').length == 1) {
                                    if (pageNo >= 2) {
                                        pageNo -= 1
                                    }
                                }
                                initSrc();
                                resee1();
                            }
                        },
                    })
                }
            }, {}, { title: '删除相同问题？', content: '确定删除选定项目的相同问题？' })

        }
        if ($(this).is('.igA')) { //加入黑名单
            var $tr = $(this).parents('tr'),
                ids = $tr.attr('Id');
            $(this).adcCreator(function () {
                Base.request({
                    type: 'get',
                    cache: false,
                    url: 'LearnQue/doIgnoreForever',
                    params: {
                        ids: ids,
                    },
                    callback: function (data) {
                        if (data.status) {
                            var msg = data.message
                            if (msg == '参数不能为空') {
                                msg = '勾选要永久忽略的问题'
                            }
                            Base.gritter(msg, false)
                        } else {
                            Base.gritter(data.message, true)
                            if ($('.ig').length == 1) {
                                if (pageNo >= 2) {
                                    pageNo -= 1
                                }
                            }
                            initSrc()
                            resee1();
                        }
                    },
                })

            }, {}, { title: '加入黑名单？', content: '是否确定将该项目加入黑名单？' })
        }
        /*
            taskId = 704 未知问题批量修改问题分类
        */
        if ($(this).is('.addMark')){//添加备注
            $('#editReMarkModel').modal('show');
            $('#editReMarkModel textarea[name="remark"]').addWordCount(200)
            var $id = $(this).parents('tr').attr('Id');
            $('#editReMarkModel [name="id"]').val($id); 
            $('#editReMarkModel textarea').val($(this).parents('tr').find('td').eq(7).find('a').html());
        }
        if ($(this).is('.isRemark') && $(this).html()){//添加备注
            $('#editReMarkModel').modal('show');
            $('#editReMarkModel textarea[name="remark"]').addWordCount(200)
            var $id = $(this).parents('tr').attr('Id');
            $('#editReMarkModel [name="id"]').val($id);
            $('#editReMarkModel textarea').val($(this).html());
        }
        if ($(this).is('.mult-editClassify')){//批量修改问题分类
            //分类树初始化
            var setting5 = {
                data: {
                    simpleData: {
                        enable: true,
                    },
                },
                view: { //不显示图标
                    showIcon: false
                },
                async: {
                    enable: true,
                    url: '../../classes/listClasses?m=' + 0,
                    dataFilter: function (treeId, parentNode, data) {
                        if (data.status) {
                            Base.gritter(data.message, false)
                        } else {
                            var html = ''
                            if (data.list[0]) {
                                var formatData4 = [];
                                var len = data.list.length;
                                for (var key in data.list) {
                                    var dk = data.list[key]
                                    formatData4[key] = {}
                                    formatData4[key]['name'] = dk['Name']
                                    formatData4[key]['pId'] = dk['ParentId'] + 1
                                    formatData4[key]['id'] = dk['Id'] + 1
                                }
                                formatData4[len] = {}
                                formatData4[len]['name'] = '全部分类'
                                formatData4[len]['pId'] = 0
                                formatData4[len]['id'] = 1
                                formatData4[len]['open'] = true
                                return formatData4;
                            }
                        }
                    }
                },
                callback: {
                    onClick: function (event, treeId, treeNode) {
                        nodeName = treeNode.name;
                        nodeId = treeNode.id - 1;
                        $('#editQueClassModel input[name="treeName"]').val(nodeName);
                        $('#editQueClassModel input[name="treeId"]').val(nodeId);
                    },
                    onAsyncSuccess: function (event, treeId, treeNode) {
                        var zTree = $.fn.zTree.getZTreeObj("ztree5");
                    }
                }
            };
            $.fn.zTree.init($('#ztree5'), setting5, []);
            $('#editQueClassModel').modal('show');
            $('#ztree5').slimScroll({
                height: '300px',
            })
            
        }
        if ($(this).is('.mult-ig')) { //批量删除
            var ids = []

            $('.singleCos').each(function () {
                var $tr = $(this).parents('tr'),
                    id = $tr.attr('Id')

                if ($(this).is(':checked')) {
                    ids.push(id)
                }
            })

            ignoreWhich = 'doIgnoreQues' // #1
            window.$obj = ids.toString()
            $(this).adcCreator(function () {
                if (isDandian) {
                    $('#dandianModal').modal('show')
                } else {
                    Base.request({
                        type: 'get',
                        cache: false,
                        url: 'LearnQue/doIgnoreQues',
                        params: {
                            ids: ids.toString(),
                        },
                        callback: function (data) {
                            if (data.status) {
                                var msg = data.message
                                if (msg == '参数不能为空') {
                                    msg = '勾选要忽略的问题'
                                }
                                Base.gritter(msg, false)
                            } else {
                                Base.gritter(data.message, true)
                                if ($('.ig').length == ids.length) {
                                    if (pageNo >= 2) {
                                        pageNo -= 1
                                    }
                                }
                                initSrc();
                                resee1();
                            }
                        },
                    })
                }
            }, {}, { title: '批量删除？', content: '是否删除所有已选项？' })

        }
        if ($(this).is('.mult-igA')) { //批量加入黑名单
            var ids = []

            $('.singleCos').each(function () {
                var $tr = $(this).parents('tr'),
                    id = $tr.attr('Id')

                if ($(this).is(':checked')) {
                    ids.push(id)
                }
            })
            $(this).adcCreator(function () {
                Base.request({
                    type: 'get',
                    cache: false,
                    url: 'LearnQue/doIgnoreForever',
                    params: {
                        ids: ids.toString(),
                    },
                    callback: function (data) {
                        if (data.status) {
                            var msg = data.message
                            if (msg == '参数不能为空') {
                                msg = '勾选要永久忽略的问题'
                            }
                            Base.gritter(msg, false)
                        } else {
                            Base.gritter(data.message, true)
                            if ($('.ig').length == ids.length) {
                                if (pageNo >= 2) {
                                    pageNo -= 1
                                }
                            }
                            initSrc();
                            resee1();
                        }
                    },
                })
            }, {}, { title: '批量加入黑名单？', content: '是否确定将所选项永久加入黑名单？' })
        }
    })

    /*
        taskId=704 未知问题批量修改问题分类
        点击确定时进行修改
        ids:修改的问题id
        groupId:选择的问题分类
        addType:1
    */
    $('#editQueClassBtn').on('click',function(){
        var ids = []
        $('.singleCos').each(function () {
            var $tr = $(this).parents('tr'),
                id = $tr.attr('Id')
            if ($(this).is(':checked')) {
                ids.push(id)
            }
        })
        Base.request({
            type: 'get',
            cache: false,
            url: 'LearnQue/ensureGroupPL',
            params: {
                ids: ids.toString(),
                groupId:$('#editQueClassModel input[name="treeId"]').val(),
                addType:1
            },
            callback: function (data) {
                if (data.status) {
                    var msg = data.message
                    if (msg == '参数不能为空') {
                        msg = '勾选要忽略的问题'
                    }
                    Base.gritter(msg, false)
                } else {
                    Base.gritter(data.message, true)
                    $('#editQueClassModel').modal('hide');
                    if ($('.ig').length == ids.length) {
                        if (pageNo >= 2) {
                            pageNo -= 1
                        }
                    }
                    initSrc();
                    resee1();
                }
            },
        })
    })
    //点击确定修改备注
    $('#editReMarkBtn').on('click',function(){
        $.ajax({
            type: 'get',
            cache: false,
            url: '../../LearnQue/updateRemark',
            data: $('#editReMarkModel form').serialize(),
            success: function (data) {
                if (data.status) {
                    yunNoty(data)
                } else {
                    yunNoty(data);
                    $('#editReMarkModel').modal('hide');
                    initSrc();
                    resee1();
                }
            },
        })
    })

    //ENTER
    $(document).on('keyup', function (e) {
        var $activeEl = $(document.activeElement)

        if ($activeEl.is('.tipsearch') && (e.keyCode == 13 || e.keyCode == 108)) {
            $('#searchChatRe').trigger('click')
        }
        if ($activeEl.is('.search-input-addSrc2') && (e.keyCode == 13 || e.keyCode == 108)) {
            $('.btnSearch2').trigger('click')
        }
    })

    //全选
    $('body').on('ifChecked', '.multCos', function () {
        $('.singleCos').iCheck('check')
    })
    //全不选
    $('body').on('ifUnchecked', '.multCos', function () {
        $('.singleCos').iCheck('uncheck')
    })

    //搜索
    $('.btnSearch').on('click', function () {
        isJpage = 0
        pageNo = 1
        inQue = $('.search-input-addSrc').val()
        initSrc(1)
    })
    //ENTER
    $(document).on('keyup', function (e) {
        var $activeEl = $(document.activeElement)

        if ($activeEl.is('.search-input-addSrc') && (e.keyCode == 13 || e.keyCode == 108)) {
            $('.btnSearch').trigger('click')
        }
    })

    //跳转
    $('.goPage-addSrc a').on('click', function () {
        $('.holder').jPages(parseInt($('.goPage-addSrc input').val()))
        return false
    })

    //全选文本
    $('.goPage-addSrc input').on('focus', function () {
        $(this).select()
    })

    var isMove = false, //是否在移动状态
        $move = null, //移动的div
        treeObj = null

    var timeOut
    interval = 1000 / 60
    timeNum = 0;
    $(document).on('mouseup', '.move', function () {
        if ($move) {
            $move.remove()
            clearTime()
        }
    })

    //生成移动元素
    $(document).on('mousedown', '.move', function (e) {
        var $tr = $(this).parents('tr'),
            moveTxt = $tr.find('td:eq(1)').text()

        isMove = true
        if ($move) {
            $move.remove()
        }
        $move = $('<div>' + moveTxt + '--请拖动到左侧相应的问题分类，松开鼠标取消</div>').css({
            'position': 'fixed',
            'left': e.clientX + 10,
            'top': e.clientY - 30,
            'zIndex': 10000,
            'background': '#D9E0E7',
            'padding': '5px 10px',
            'borderRadius': '5px',
        }).attr({
            id: $tr.attr('id'),
            class: 'movel666'
        }).appendTo('body')
    })
    //取消移动
    $(document).on({
        dragleave: function (e) { //拖离
            e.preventDefault();
            clearTime()
        },
        drop: function (e) { //拖后放
            e.preventDefault()
            if (isMove && $(e.target).parents('li')[0]) {
                var tId = $(e.target).parents('li')[0].id
                var treeObj = $.fn.zTree.getZTreeObj('ztree1')
                var node = treeObj.getNodeByTId(tId)
                if (node) {
                    Base.request({
                        type: 'get',
                        cache: false,
                        url: 'LearnQue/ensureGroup',
                        params: {
                            groupId: node.id - 1,
                            id: $move.attr('id'),
                            addType: 1
                        },
                        callback: function (data) {
                            if (data.status) {
                                Base.gritter(data.message, false)
                            } else {
                                Base.gritter(data.message, true)
                                initSrc()
                            }
                            $('#' + node.tId + '_check').trigger('click')
                        },
                    })
                    resee1();
                }
            }
            isMove = false
            $move.remove()
            clearTime()
            return false
        },
        dragenter: function (e) { //拖进
            e.preventDefault()
            clearTime()
        },
        dragover: function (e) { //拖来拖去
            e.preventDefault();
            if (isMove) {
                if (getScrollTop() > 0) {
                    var hei = e.originalEvent.clientY - getScrollTop()
                    if (getScollH(hei) == 1) {
                        startUpTime();
                    } else if (getScollH(hei) == 2) {
                        startDownTime()
                    } else {
                        clearTime()
                    }

                } else {
                    var h = e.originalEvent.clientY - 195
                    if (getScollH(h) == 1) {
                        startUpTime()
                    } else if (getScollH(h) == 2) {
                        startDownTime()
                    } else {
                        clearTime()
                    }
                }

                $move.css({
                    'left': e.originalEvent.clientX + 10,
                    'top': e.originalEvent.clientY - 30,
                });
            }
        },
    })



    function clearTime() {
        if (timeOut) {
            clearInterval(timeOut);
            timeOut = null;
        }
    }


    function startUpTime() {

        if (!timeOut) {
            timeOut = setInterval(function () {
                timeNum += 5;
                if (timeNum < 0) { timeNum = 0; return };
                $('#scoll').slimScroll({ scrollTo: timeNum });
            }, interval)
        }
    }

    function startDownTime() {
        if (!timeOut) {
            timeOut = setInterval(function () {
                timeNum -= 5;
                if (timeNum < 0) { timeNum = 0; return };
                $('#scoll').slimScroll({ scrollTo: timeNum });
            }, interval)
        }
    }



    function getScrollTop() {
        var scrollPos;
        if (window.pageYOffset) {
            scrollPos = window.pageYOffset;
        }
        else if (document.compatMode && document.compatMode != 'BackCompat') { scrollPos = document.documentElement.scrollTop; }
        else if (document.body) { scrollPos = document.body.scrollTop; }
        return scrollPos;
    }


    function getScollH(scollpageY) {
        var ztree1H = $("#scoll").height();
        var half = Number(ztree1H / 2).toFixed(1);
        if (scollpageY - half > 20) {
            return 1;
        } else if (scollpageY - half < -20) {
            return 2;
        } else if (scollpageY - half > 10 || scollpageY - half < -10) {
            return 0
        }


    }


    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {
        defineFlag = 'tab'
        if (e.target == $('a[href="t1"]')[0]) { //已分类
            defineType = 3
            pageNo = 1
            $('#alertUn').html('<strong>友情提示：</strong> 学习机器人未知的问题。您也可以在这里回复客户的问题哦！他们下次来访时可以看到哦！')
            initSrc()
        } else if (e.target == $('a[href="t2"]')[0]) { //未分类
            defineType = 0
            pageNo = 1
            $('#alertUn').html('<strong>友情提示：</strong> 这里是未分类的未知问题，您可以在这里把问题分类，也可以直接回复客户的问题哦！')
            initSrc()
        } else if (e.target == $('a[href="t3"]')[0]) { //寒暄
            defineType = 1
            pageNo = 1
            $('#alertUn').html('<strong>友情提示：</strong> 这里是访客和机器人的日常聊天内容。')
            initSrc()
        } else if (e.target == $('a[href="t4"]')[0]) { //无意思
            defineType = 2
            pageNo = 1
            $('#alertUn').html('<strong>友情提示：</strong> 这里是和业务无关的无意义的问题，您可以选择一键忽略哦。')
            initSrc()
        }
    })
    if (getUrlParam('q')) {
        $('a[href=t2]').trigger('click')
    }
    $('#manman').on('click', function () {
        if ($(this).attr('src') == 'images/man-blue.png' && $('#rrobot').attr('src') == 'images/robot-grey.png') {
            return
        }
        defineFlag = 'td'
        if ($(this).attr('src') == 'images/man-blue.png') {
            $(this).attr('src', 'images/man-grey.png')
        } else {
            $(this).attr('src', 'images/man-blue.png')
        }
        pageNo = 1
        initSrc()
    })
    $('#rrobot').on('click', function () {
        if ($(this).attr('src') == 'images/robot-blue.png' && $('#manman').attr('src') == 'images/man-grey.png') {
            return
        }
        defineFlag = 'td'
        if ($(this).attr('src') == 'images/robot-blue.png') {
            $(this).attr('src', 'images/robot-grey.png')
        } else {
            $(this).attr('src', 'images/robot-blue.png')
        }
        pageNo = 1
        initSrc()
    })

    //全局变量 获得当前时间
    var myDate = new Date()
    var myDateM = myDate.getMonth() + 1//月
    var myDateD = myDate.getDate()//日
    var myDateHou = myDate.getHours()//时
    var myDateMin = myDate.getMinutes() + 2//分

    function updateTime() {
        myDate = new Date();
        myDateM = myDate.getMonth() + 1;//月
        myDateD = myDate.getDate();//日
        myDateHou = myDate.getHours();//时
        myDateMin = myDate.getMinutes() + 2;//分
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
    function apply() {//获取一周前时间
        var newDatew = new Date()
        newDatew.setTime(new Date() - 7 * 24 * 60 * 60 * 1000)//此时newDatew变成了一周前的时间
        var weekMon = newDatew.getMonth() + 1//一周前的月份
        if (weekMon < 10) { weekMon = '0' + (newDatew.getMonth() + 1) }

        var weekDay = newDatew.getDate()//一周前的日
        if (weekDay < 10) { weekDay = '0' + newDatew.getDate() }

        var week = newDatew.getFullYear() + '-' + weekMon + '-' + weekDay
        $('#tm1').val(week + ' ' + myDateHou + ':' + myDateMin)//一周前的现在
        $('#tm2').val(myDate.getFullYear() + '-' + myDateM + '-' + myDateD + ' ' + myDateHou + ':' + myDateMin)//今天的时间
        initSrc()
    }

    apply()

    //获得上月今天的方法
    function lastMonthDate() {
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

    //点击弹出下拉菜单
    $('#myDropdown').on('click', function () {
        $(this).parent().toggleClass('open')
    })

    $('body').on('click', function (e) {
        if (!$('#myDropdown').parent().find($(e.target)).length) {
            $('#myDropdown').parent().removeClass('open')
        }
    })

    $('.ttw0').on('click', function () { //昨天
        updateTime();
        $('#myDropdown').parent().removeClass('open')
        $('.ttw').html($(this).text() + '<span class="caret"></span>')
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
        pageNo = 1
        var yesterday = newDate1.getFullYear() + '-' + yestM + '-' + yestD
        $('.ttw').html($(this).text() + '<span class="caret"></span>')
        $('#tm1').val(yesterday + ' ' + '00' + ':' + '00')//昨天的时间
        $('#tm2').val(new Date().getFullYear() + '-' + myDateM + '-' + myDateD + ' ' + '00' + ':' + '00')//现在的时间
        initSrc()
    })

    $('.ttw1').on('click', function () { //今天
        updateTime();
        $('#myDropdown').parent().removeClass('open')
        $('.ttw').html($(this).text() + '<span class="caret"></span>')
        pageNo = 1
        $('#tm1').val(myDate.getFullYear() + '-' + myDateM + '-' + myDateD + ' ' + '00' + ':' + '00')//今天零点
        $('#tm2').val(myDate.getFullYear() + '-' + myDateM + '-' + myDateD + ' ' + myDateHou + ':' + myDateMin)//现在时间
        initSrc()
    })

    $('.ttw2').on('click', function () { //最近七天
        updateTime();
        $('#myDropdown').parent().removeClass('open')
        $('.ttw').html($(this).text() + '<span class="caret"></span>')
        apply()
    })
    $('.ttw3').on('click', function () { //最近一个月
        updateTime();
        $('#myDropdown').parent().removeClass('open')
        $('.ttw').html($(this).text() + '<span class="caret"></span>')
        pageNo = 1
        $('#tm1').val(lastMonthDate() + ' ' + myDateHou + ':' + myDateMin)//一月前的今天
        $('#tm2').val(new Date().getFullYear() + '-' + myDateM + '-' + myDateD + ' ' + myDateHou + ':' + myDateMin)//现在时间
        initSrc()
    })
    $('.ttw4').on('click', function () { //全部
        updateTime();
        $('#myDropdown').parent().removeClass('open')
        $('.ttw').html($(this).text() + '<span class="caret"></span>')
        pageNo = 1
        $('#tm1').val('')
        $('#tm2').val('')
        initSrc()
    })

    //排序
    $('.sort1').on('click', function () { //默认
        $('.sort0_0').html($(this).text() + '<span class="caret"></span>')
        orderType = 3
        pageNo = 1
        initSrc()
    })
    $('.sort2').on('click', function () { //时间正序
        $('.sort0_0').html($(this).text() + '<span class="caret"></span>')
        orderType = 3
        pageNo = 1
        initSrc()
    })
    $('.sort3').on('click', function () { //时间倒序
        $('.sort0_0').html($(this).text() + '<span class="caret"></span>')
        orderType = 4
        pageNo = 1
        initSrc()
    })
    $('.sort4').on('click', function () { //问题内容正序
        $('.sort0_0').html($(this).text() + '<span class="caret"></span>')
        orderType = 33
        pageNo = 1
        initSrc()
    })
    $('.sort5').on('click', function () { //问题内容倒序
        $('.sort0_0').html($(this).text() + '<span class="caret"></span>')
        orderType = 34
        pageNo = 1
        initSrc()
    })
    $('.sort6').on('click', function () { //提问数量正序
        $('.sort0_0').html($(this).text() + '<span class="caret"></span>')
        orderType = 31
        pageNo = 1
        initSrc()
    })
    $('.sort7').on('click', function () { //提问数量倒序
        $('.sort0_0').html($(this).text() + '<span class="caret"></span>')
        orderType = 32
        pageNo = 1
        initSrc()
    })

    //导出exl
    $('.outExl').on('click', function () {
        location.href = '../../LearnQue/newList?pageSize=' + 10000 + '&pageNo=' + 1 + '&orderType=' + 4 + '&type=' + 1 + '&excelFlag=' + 1 + '&startT=' + ($('[name=startT]').val() || '') + '&endT=' + ($('[name=endT]').val() || '')
    })
    //导出exl2
    $('.outExl2').on('click', function () {
        var time = new Date().getTime();
        location.href = '../../report/LearnQuestion/showChart?excelFlag=1' + '&startT=' + ($('[name=startT]').val() || '') + '&endT=' + ($('[name=endT]').val() || '')+'&sourceId='+sourceType+'&type=1'+'&noCache='+time
    })

    var pageNo2 = 1, //当前页
        pageSize2 = 5, //每页数量
        isJpage2 = 0, //是否已实例化jpage
        groupId = 0,
        solutionId = 0,
        isLeaf = 1,
        answer = '',
        question = '',
        status = 0,
        level = 1,
        ids = 0,
        queryStr = '?question='

    $('.fromCtn').add('.textareaCtn').hide()

    //回答
    function ansQue() {
        Base.request({
            //url: 'question/listAns' + queryStr + answer + $('.search-input-addSrc2').val(),
            url: 'question/getQueList' + queryStr + answer + $('.search-input-addSrc2').val(),
            params: {
                pageNo: pageNo2,
                pageSize: pageSize2,
                groupId: groupId,
                isLeaf: isLeaf,
                status: status,
                level: level,
            },
            callback: function (data) {
                if (data.status) {
                    Base.gritter(data.message, false)
                } else {
                    var html = ''
                    if (data.questionList && data.questionList[0]) {
                        for (var i = 0; i < data.questionList.length; i++) {
                            html += '<tr Id="' + (data.questionList[i].Id || '') + '"  SolutionId="' + (data.questionList[i].SolutionId || '') + '">'
                            html += '<td style="text-align: center;"><input class="singleAnsCos" type="radio" name="ansQue"></td>'
                            if (data.questionList[i].SolutionType == 2) {
                                var link = '/web/knowledge/editFlow.html?questionId=' + data.questionList[i].Id + '&groupId=' + data.questionList[i].GroupId + '&solutionId=' + data.questionList[i].SolutionId
                                html += '<td class="cosInput clickop" data-link="' + link + '" data-isf="1">' + (data.questionList[i].Question || '') + '</td>'
                            } else {
                                link = '/web/knowledge/queDetail.html?id=' + data.questionList[i].Id
                                html += '<td class="cosInput clickop" data-link="' + link + '" data-isf="0">' + (data.questionList[i].Question || '') + '</td>'
                            }
                            html += '<td class="cosInput" style="position:relative;"><div class="minheight1" style="max-width: 300px;">'
                            data.questionList[i].ListAnswer.forEach(function (el, i) {
                                if (i == 0) {
                                    html += '<div class="ccca">' + (el.Answer || '') + '</div>'
                                } else {
                                    html += '<div class="ccca" style="display:none;">' + (el.Answer || '') + '</div>'
                                }
                            })
                            if (data.questionList[i].ListAnswer.length > 1) {
                                html += '</div><span style="position:absolute;top:10px;right:0;"><i class="fa fa-chevron-up rotog"></span></td>'
                            } else {
                                html += '</div></td>'
                            }
                            html += '<td>' + (data.questionList[i].AddTime || '') + '</td></tr>'
                        }
                        var options = {
                            currentPage: data.currentPage,
                            totalPages: data.totlePages ? data.totlePages : 1,
                            alignment: 'right',
                            onPageClicked: function (event, originalEvent, type, page) {
                                pageNo2 = page

                                ansQue()
                            }
                        }
                        $('#itemContainer2').bootstrapPaginator(options)
                    } else {
                        html += '<td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td>'
                        $('#itemContainer2').empty()
                    }
                    $('.tbody2').empty().append(html)
                    $('.timeTip').tooltip()

                    //对已有答案回答和仅回答下的 回答和仅回答按钮，确定按钮的操作
                    $('input[name=ansQueInput662]').on('keyup', function () {
                        var aalen2 = $('input[name=ansQueInput662]').val()
                        nxQiYong($('.singleAnsCos:checked').length > 0 && aalen2.length >= 2)
                    })
                    $('.singleAnsCos').on('ifChanged', function () {
                        var aalen = $('input[name=ansQueInput662]').val()
                        nxQiYong($('.singleAnsCos:checked').length > 0 && aalen.length >= 2)
                    })

                    icheckInit()
                    $('.minheight').each(function () {
                        var height = $(this).height
                        if (height > 100) {
                            height = 100
                        }
                        // $('.minheight').slimScroll({
                        // height: height,
                        // });
                    })
                    $('.slimScrollBar').hide()
                    $('.rotog').on('click', function () {
                        if ($(this).hasClass('fa-chevron-up')) {
                            $(this).removeClass('fa-chevron-up').addClass('fa-chevron-down')
                            $(this).parent().parent().find('.minheight1').children(':not(:first-child)').show()
                        } else {
                            $(this).removeClass('fa-chevron-down').addClass('fa-chevron-up')
                            $(this).parent().parent().find('.minheight1').children(':not(:first-child)').hide()
                        }
                    })
                    $('.clickop').on('dblclick', function () {
                        if ($(this).data('isf')) {
                            ifbOpenWindowInNewTab($(this).data('link'), '流程详细')
                        } else {
                            ifbOpenWindowInNewTab($(this).data('link'), '问题详细')
                        }
                    })

                }
            },
        })
    }

    // 点击td自动选中input
    $('body').on('click', '.cosInput', function () {
        $(this).parents('tr').find('input').iCheck('check')
    })

    /*============判断农信配置是否启用=============*/
    function nxQiYong(flag) {
        if (sessionStorage.getItem('qAndACloseValue') == 1) {
            $('.ansAndLearn').css({
                'pointer-events': 'all'
            })
            $('.ansAndLearn').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled')
            if (flag) {
                if ($('.nav-pills li').eq(1).hasClass('active')) {
                    $('.justAns').css({
                        'pointer-events': 'painted'
                    })
                    $('.justAns').removeClass('btn-default').addClass('btn-primary').attr('disabled', false)
                } else {
                    $('.justAns,.ansAndLearn').css({
                        'pointer-events': 'painted'
                    })
                    $('.justAns').removeClass('btn-default').addClass('btn-primary').attr('disabled', false)
                    $('.ansAndLearn').removeClass('btn-default').addClass('btn-primary').attr('disabled', false)
                }
            } else {
                if ($('.nav-pills li').eq(1).hasClass('active')) {
                    $('.justAns').css({
                        'pointer-events': 'all'
                    })
                    $('.justAns').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled')
                } else {
                    $('.justAns,.ansAndLearn').css({
                        'pointer-events': 'all'
                    })
                    $('.justAns').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled')
                    $('.ansAndLearn').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled')
                }
            }
        } else {
            if (flag) {
                $('.justAns,.ansAndLearn').css({
                    'pointer-events': 'painted'
                })
                $('.justAns').removeClass('btn-default').addClass('btn-primary').attr('disabled', false)
                $('.ansAndLearn').removeClass('btn-default').addClass('btn-primary').attr('disabled', false)
            } else {
                $('.justAns,.ansAndLearn').css({
                    'pointer-events': 'all'
                })
                $('.justAns').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled')
                $('.ansAndLearn').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled')
            }
        }
    }

    //问题
    function queQue() {
        Base.request({
            url: 'question/listQue',
            params: {
                pageNo: pageNo2,
                pageSize: pageSize2,
                groupId: groupId,
                isLeaf: isLeaf,
                question: $('.search-input-addSrc2').val(),
            },
            callback: function (data) {
                if (data.status) {
                    Base.gritter(data.message, false)
                } else {
                    var html = ''
                    if (data.ListQue[0]) {
                        for (var i = 0; i < data.ListQue.length; i++) {
                            html += '<tr Id="' + (data.ListQue[i].Id || '') + '"  SolutionId="' + (data.ListQue[i].SolutionId || '') + '"><td><input class="singleAnsCos" type="radio" name="ansQue"></td><td class="cosInput">' + (data.ListQue[i].Question || '') + '</td><td class="cosInput" style="white-space: nowrap;">' + (data.ListQue[i].Time || '') + '</td></tr>'
                        }

                        var options = {
                            currentPage: data.currentPage,
                            totalPages: data.totlePages ? data.totlePages : 1,
                            alignment: 'right',
                            onPageClicked: function (event, originalEvent, type, page) {
                                pageNo2 = page
                                queQue()
                            }
                        }
                        $('#itemContainer_ask').bootstrapPaginator(options)
                    } else {
                        html += '<td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td>'
                        $('#itemContainer_ask').empty()
                    }
                    $('.tbody2').empty().append(html)
                    $('.timeTip').tooltip()
                    icheckInit()

                }
            },
        })
    }

    //调出回答
    $('body').on('click', '.ans', function () {
        var treeObj = $.fn.zTree.getZTreeObj('ztree2')
        //treeObj.expandAll(false);

        var $tr = $(this).parents('tr'),
            answer1 = $tr.find('td:eq(2)').text(),
            msgType = $tr.find('td:eq(2)').attr('msgType');
        ids = $tr.attr('id');
        //去除【语音】标识
        /*
           taskid=531,黄世鹏
           修改：每次学习未知问题，还需要重新选择分类
        */
        groupName = $tr.find('td:eq(3)').text();
        _groupId = $tr.attr('groupId');
        if (msgType == 2) {
            answer1 = answer1.split('【语音】')[1];
        }
        $('input[name=ansQueInput662]').val(answer1)
        answer = ''
        $('a[href=#navpill6661]').trigger('click')
        //ansQue();
    })

    var RoleName = [],
        CombIds = [],
        role = false

    //确认回答
    $('.justAns').add('.ansAndLearn').on('click', function () {
        if ($(this).is('.justAns')) { //仅回答
            learnFlag = 0
        }
        if ($(this).is('.ansAndLearn')) { //回答并学习
            learnFlag = 1
        }

        $('.singleAnsCos').each(function () {
            if ($(this).prop('checked')) {
                solutionId = $(this).parents('tr').attr('solutionId')
            }
        })

        answer = $('input[name=ansQueInput662]').val()

        if (role) { //可选择来访者角色
            var roleIds1 = ''
            $('.changeChannel').each(function () {
                if (+$(this).attr('go')) {
                    roleIds1 += $(this).attr('diccode') + ','
                }
            })
            if (roleIds1) {
                roleIds1 = roleIds1.substring(0, roleIds1.length - 1)
            } else {
                roleIds1 = '-1'
            }
            CombIds = []
            CombIds = CombIds.join(',')
            if (!CombIds) {
                CombIds = '-1'
            }
            if (groupId || learnFlag === 0) {
                Base.request({
                    url: 'LearnQue/doFixByNewAnswer',
                    params: {
                        fixMode: 4,
                        ids: ids,
                        answer: richtextUE.getContent(),
                        learnFlag: learnFlag,
                        groupId: groupId,
                        formatQue: answer,
                        effectiveRules: '[{"type":1,"roleIds":"' + roleIds1 + '"},{"type":2,"roleIds":"' + CombIds + '"}]',
                    },
                    callback: function (data) {
                        if (data.status) {
                            Base.gritter(data.message, false)
                        } else {
                            Base.gritter(data.message, true)
                            $('#modal-dialog-ans').modal('hide')
                            groupId = 0
                            initSrc()
                        }
                    },
                })
            } else {
                Base.gritter('请选择一个分类', false)
            }
        } else { //不可选择来访者角色
            if (solutionId) {
                Base.request({
                    url: 'LearnQue/doFixByOtherAnswer',
                    params: {
                        fixMode: 3,
                        ids: ids,
                        formatQue: answer,
                        learnFlag: learnFlag,
                        groupId: groupId,
                        solutionId: solutionId,
                    },
                    callback: function (data) {
                        if (data.status) {
                            //if ($(this).is('.ansAndLearn')) { //回答并学习
                            //  learnFlag = 1;
                            //}
                            Base.gritter(data.message, false)
                        } else {
                            Base.gritter(data.message, true)
                            $('#modal-dialog-ans').modal('hide')
                            groupId = 0
                            initSrc()
                        }
                    },
                })
            }
        }
        resee2()
    })

    $('#modal-dialog-ans').on('hidden.bs.modal', function (e) {
        groupId = 0
        isLeaf = 1
        answer = ''
        question = ''
        status = 0
        level = 1
        ids = 0
        richtextUE.setContent('')
        $('.search-input-addSrc2').val('')
        $('a[href=#navpill6661]').trigger('click')
        $('a[href=#navpill6661]').parent().addClass('active').siblings().removeClass('active')
        richtextUE.setContent('')

        //重置生效渠道
        $('.changeChannel').each(function () {
            $(this).removeClass('btn-primary').attr('go', '0')
        })
    })

    //合并回答
    $('.ansOneTime').on('click', function () {
        ids = []
        var answer1 = []
        $('.singleCos').each(function () {
            var $tr = $(this).parents('tr'),
                id = $tr.attr('Id'),
                //去除【语音】标识
                msgType = $tr.find('td:eq(2)').attr('msgType');
            if ($(this).is(':checked')) {
                ids.push(id);
                var pushAns = $tr.find('td:eq(2)').text();
                if (msgType == 2) {
                    pushAns = pushAns.split('【语音】')[1];
                }
                answer1.push(pushAns);
            }
        })
        ids = ids.toString()
        if (ids) {
            $('#modal-dialog-ans').modal('show')
            $('input[name=ansQueInput662]').val(answer1)
            answer = ''
            ansQue()
        } else {
            Base.gritter('选择您要合并的回答', false)
        }
    })

    //回答页面搜索
    $('.btnSearch2').on('click', function () {

        answer = $('.search-input-addSrc2').val()
        pageNo2 = 1
        answer = ''
        if ($('.sort2_0')[0].style.display == 'none') {
            queQue()
        } else {
            ansQue()
        }
    })
    //问题、答案搜索 queryStr
    $('.sort2_1').on('click', function () {
        $('.sort2_0').html($(this).text() + '<span class="caret"></span>')
        queryStr = '?question='
    })
    $('.sort2_2').on('click', function () {
        $('.sort2_0').html($(this).text() + '<span class="caret"></span>')
        queryStr = '?answer='
    })

    $('.fromCtn').hide()
    $('.hideCtn').show()
    $('.showCtn').hide()
    $('.dsf_knowledge').hide()
    $('.sureBtn').hide()

    var pageNo3 = 1
    var pageSize3 = 10
    var dsf_Id = 0      //第三方知识系统id
    var dsf_type = 0

    //切换列表
    $('a[href=#navpill6661]').on('click', function () {
        groupId = 0;
        $('#modal-dialog-ans .selectQue').text('全部分类');
        role = false
        $('.classifyCtn').show()
        $('.fromCtn').hide()
        $('.hideCtn').show()
        $('.showCtn').hide()
        $('.sort2_0').show()
        $('.dsf_knowledge').hide()
        $('#gggg662').html('答案详细')
        $('.sureBtn').hide()
        $('.justAns').show()
        $('.ansAndLearn').show()
        richtextUE.setContent('')
        answer = ''
        pageNo2 = 1
        ansQue()
        $('.justAns,.ansAndLearn').css({
            'pointer-events': 'all'
        })
        $('.justAns').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled')
        $('.ansAndLearn').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled')
        $('.singleAnsCos').iCheck('uncheck')
        aalen2 = $('input[name=ansQueInput662]').val()
        nxQiYong($('.singleAnsCos:checked').length > 0 && aalen2.length >= 2)
    })
    $('a[href=#navpill6662]').on('click', function () {
        role = true
        $('.classifyCtn').show()
        $('.fromCtn').show()
        $('.hideCtn').hide()
        $('.showCtn').show()
        $('.dsf_knowledge').hide()
        $('.sureBtn').hide()
        $('.justAns').show()
        $('.ansAndLearn').show()
        /*
             taskid=531,黄世鹏
            修改：每次学习未知问题，还需要重新选择分类
         */
        if (groupName == '未知分类' || groupName == '寒暄分类' || groupName == '无意义分类' || groupName == '业务未分类' || !groupName) {
            $('#modal-dialog-ans .selectQue').text('全部分类');
            groupId = 0;
        } else {
            groupId = _groupId;
            $('#modal-dialog-ans .selectQue').text(groupName);
        }
        UE.getEditor('ans-textarea').getContent('');
        //对编辑答案回答下 回答和仅回答按钮的操作  加选择改变事件监听
        $('.justAns,.ansAndLearn').css({
            'pointer-events': 'all'
        })
        $('.justAns').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled')
        $('.ansAndLearn').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled')
        $('input[name=ansQueInput662]').on('keyup', function () {
            var aalen2 = $('input[name=ansQueInput662]').val()
            answer = UE.getEditor('ans-textarea').getContent()
            nxQiYong(answer.length > 0 && aalen2.length >= 2)
        })
        /*
         * taskId = 646 智能学习，未知问题选择编辑答案回答优化
         * 将ueditor的keyup事件改成selectionchange事件
         * */
        UE.getEditor('ans-textarea').on('selectionchange', function (e) {
            answer = UE.getEditor('ans-textarea').getContent()
            var aalen4 = $('input[name=ansQueInput662]').val()
            nxQiYong(aalen4.length >= 2 && answer.length > 0)
        })
    })
    $('a[href=#navpill6663]').on('click', function () {
        groupId = 0;
        $('#modal-dialog-ans .selectQue').text('全部分类');
        var aalen2 = $('input[name=ansQueInput662]').val()
        if ($('.dsf_sys:checked').length > 0 && aalen2.length >= 2) {
            $('.sureBtn').css('pointer-events', 'all').attr('disabled', false)
        }
        else {
            $('.sureBtn').css('pointer-events', 'all').attr('disabled', true)
        }
        role = true
        $('.classifyCtn').hide()
        $('.hideCtn').hide()
        $('.showCtn').hide()
        $('.dsf_knowledge').show()
        $('.sureBtn').show()
        $('.justAns').hide()
        $('.ansAndLearn').hide()
        richtextUE.setContent('')
        answer = ''
        dsf_knowledge_init(pageNo3)
    })

    //第三方知识系统回答配置项
    if (sessionStorage.getItem('thirdKnowledgeSystem') == 0) {
        $("#thirdKnowledgeConf").css("display", "none")
    } else if ((sessionStorage.getItem('thirdKnowledgeSystem') == 1)) {
        $("#thirdKnowledgeConf").css("display", "inline-block")
    }

    /*==========查询第三方知识系统信息==========*/
    function dsf_knowledge_init(pageNo) {
        //接口
        $.ajax({
            url: '../../ThirdMiddleCompany/list',
            data: {
                pageNo: pageNo,
                pageSize: pageSize3
            },
            type: 'post',
            dataType: 'json',
            cache: false,
            success: function (data) {
                if (data.status == 0) {
                    var html = ''
                    if (data.list[0]) {
                        $.each(data.list, function (i, item) {
                            html += '<tr dsf_Id="' + item.Id + '" dsf_type="' + item.Type + '"><td><input class="dsf_sys" type="radio" name="dsf_sys"></td><td>' + item.Name + '</td><td>' + (item.Type == 1 ? '调用第三方' : '第三方获取') + '</td></tr>'
                        })
                    } else {
                        html = '<tr><td colspan="2" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>'
                    }
                    $('.dsf_tbody').html(html)
                    //下面开始处理分页
                    var options = {
                        data: [data, 'list', 'total'],
                        currentPage: data.currentPage,
                        totalPages: data.totlePages,
                        onPageClicked: function (event, originalEvent, type, page) {
                            pageNo = page
                            dsf_knowledge_init(page)
                        }
                    }
                    $('#itemContainer3').bootstrapPaginator(options)
                    $('.sureBtn').css('pointer-events', 'all').attr('disabled', true)
                    $('input[name=ansQueInput662]').on('keyup', function () {
                        var aalen2 = $('input[name=ansQueInput662]').val()

                        if ($('.dsf_sys:checked').length > 0 && aalen2.length >= 2) {
                            $('.sureBtn').css('pointer-events', 'all').attr('disabled', false)
                        }
                        else {
                            $('.sureBtn').css('pointer-events', 'all').attr('disabled', true)
                        }
                    })
                    $('.dsf_sys').on('ifChanged', function () {
                        var aalen = $('input[name=ansQueInput662]').val()
                        if ($('.dsf_sys:checked').length > 0 && aalen.length >= 2) {
                            $('.sureBtn').css('pointer-events', 'all').attr('disabled', false)
                        } else {
                            $('.sureBtn').css('pointer-events', 'all').attr('disabled', true)
                        }
                    })
                    icheckInit()
                }
            }
        })
    }

    /*==========第三方知识系统回答确认按钮==========*/
    function dsf_sureBtn_click() {
        $('.sureBtn').on('click', function (e) {
            var src = e.target || window.event.srcElement
            $.each($('.dsf_sys'), function (i, item) {
                if ($(item).prop('checked')) {
                    dsf_type = $(item).parents('tr').attr('dsf_type')
                    dsf_Id = $(item).parents('tr').attr('dsf_Id')
                }
            })
            $.ajax({
                url: '../../learnque/doFixByThirdSystem',
                data: {
                    ids: ids,
                    type: dsf_type,
                    thirdCompanyId: dsf_Id,
                    formatQue: $('[name="ansQueInput662"]').val()
                },
                type: 'post',
                dataType: 'json',
                cache: false,
                success: function (data) {
                    if (data.status == 0) {
                        yunNoty(data)
                        initSrc()
                        $(src).next('a').trigger('click')
                        $('#modal-dialog-ans').modal('hide')
                    } else {
                        yunNotyError(data.message)
                    }

                }
            })

        })
    }

    dsf_sureBtn_click()

    //跳转
    $('.goPage-addSrc2 a').on('click', function () {
        $('.holder2').jPages(parseInt($('.goPage-addSrc2 input').val()))
        return false
    })

    //全选文本
    $('.goPage-addSrc input').on('focus', function () {
        $(this).select()
    })

    //展开所有
    $('.openAll').on('click', function () {
        var treeObj = $.fn.zTree.getZTreeObj('ztree1')
        treeObj.expandAll(true)
    })
    //折叠所有
    $('.closeAll').on('click', function () {
        var treeObj = $.fn.zTree.getZTreeObj('ztree1')
        treeObj.expandAll(false)
    })

    // 显隐分类
    $('body').on('click', function (e) {
        if ($(e.target).is('.selectQue') || $(e.target).hasClass('switch') && $(e.target).parents('#ztree2').length > 0) {
            $('#ztree2').fadeIn()
            $('#ztree2 li:first').slimScroll({
                height: '300px',
            })
        } else {
            $('#ztree2').fadeOut()
        }
    })

    //展开所有
    $('.openAll2').on('click', function () {
        var treeObj2 = $.fn.zTree.getZTreeObj('ztree2')
        treeObj2.expandAll(true)
    })
    //折叠所有
    $('.closeAll2').on('click', function () {
        var treeObj2 = $.fn.zTree.getZTreeObj('ztree2')
        treeObj2.expandAll(false)
    })

    //展开所有
    $('.openAll3').on('click', function () {
        var treeObj3 = $.fn.zTree.getZTreeObj('ztree3')
        treeObj3.expandAll(true)
    })
    //折叠所有
    $('.closeAll3').on('click', function () {
        var treeObj3 = $.fn.zTree.getZTreeObj('ztree3')
        treeObj3.expandAll(false)
    })

    //获取生效渠道
    Base.request({
        url: 'Configuration/listItem',
        params: {},
        callback: function (data) {
            if (data.status) {
                Base.gritter(data.message, false)
            } else {
                //生效渠道
                if (data.listItem[0].IsDisplay) { //不展示
                    $('.channelCtn').remove()
                } else {
                    var html = ''
                    if (data.listItem[0].DicList) {
                        for (var i = 0; i < data.listItem[0].DicList.length; i++) {
                            html += '<a href="javascript:;" class="btn btn-sm btn-white changeChannel" DicCode="' + data.listItem[0].DicList[i].DicCode + '" go="0" style="margin: 2px;">' + data.listItem[0].DicList[i].DicDesc + '</a>'
                        }
                    }
                    $('.channel').append(html)
                }

                //生效角色
                if (data.listItem[1].IsDisplay) { //不展示
                    $('.roleCtn').remove()
                }

            }
        },
    })
    //切换选择渠道
    $('body').on('click', '.changeChannel', function () {
        if (+($(this).attr('go'))) { //1
            $(this).attr('go', '0')
            $(this).removeClass('btn-primary')
        } else {
            $(this).attr('go', '1')
            $(this).addClass('btn-primary')
        }
    })


})
