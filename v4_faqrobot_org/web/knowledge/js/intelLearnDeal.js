//富文本答案
var richtextUE = UE.getEditor('ans-textarea', {
    initialFrameHeight: 200,
    zIndex: 90,
    wordCount: true,
    maximumWords: 20000
});
$(document).ready(function () {
    var SolutionId = getUrlParam('solutionId');
    //一键清空

    $('#ok').click(function () {
        $.ajax({
            type: "get",
            url: "../../LearnQue/delLQueAll",
            cache: false,
            data: { 'type': 2, 'solutionId': SolutionId },
            success: function (data) {
                if (data.status == 0) {
                    $('.tableA').tableAjaxLoader2(7);
                    yunNoty(data);
                    initSrc();
                } else {
                    yunNotyError(data.message);
                }
            }
        });
        $('#makeSure').modal('hide');
    });

    /*============判断农信配置是否启用=============*/
    function nxQiYong(flag) {
        if (sessionStorage.getItem('qAndACloseValue') == 1) {
            $(".ansAndLearn").css({
                'pointer-events': 'all'
            });
            $('.ansAndLearn').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled');
            if (flag) {
                if ($('.nav-pills li').eq(1).hasClass('active')) {
                    $(".justAns").css({
                        'pointer-events': 'painted'
                    });
                    $('.justAns').removeClass('btn-default').addClass('btn-primary').attr('disabled', false);
                } else {
                    $(".justAns,.ansAndLearn").css({
                        'pointer-events': 'painted'
                    });
                    $('.justAns').removeClass('btn-default').addClass('btn-primary').attr('disabled', false);
                    $('.ansAndLearn').removeClass('btn-default').addClass('btn-primary').attr('disabled', false);
                }
            } else {
                if ($('.nav-pills li').eq(1).hasClass('active')) {
                    $(".justAns").css({
                        'pointer-events': 'all'
                    });
                    $('.justAns').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled');
                } else {
                    $(".justAns,.ansAndLearn").css({
                        'pointer-events': 'all'
                    });
                    $('.justAns').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled');
                    $('.ansAndLearn').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled');
                }
            }
        } else {
            if (flag) {
                $(".justAns,.ansAndLearn").css({
                    'pointer-events': 'painted'
                });
                $('.justAns').removeClass('btn-default').addClass('btn-primary').attr('disabled', false);
                $('.ansAndLearn').removeClass('btn-default').addClass('btn-primary').attr('disabled', false);
                return false;
            } else {
                $(".justAns,.ansAndLearn").css({
                    'pointer-events': 'all'
                });
                $('.justAns').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled');
                $('.ansAndLearn').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled');
            }
        }
    }
    //$('#modal-dialog-ans .ans-textarea').addWordCount(20000);
    //datetimepicker配置项
    $(".form_datetime").datetimepicker({
        language: "zh-CN",
        format: "yyyy-mm-dd hh:ii",
        autoclose: true,
        todayBtn: true,
        minuteStep: 10,
        initialDate: new Date(),
        zIndex: 1500,
    });

    $('.edit-textarea').addWordCount(200);

    var This = this;
    var type = 2, //素材类型
        pageNo = 1, //当前页
        pageSize = 20, //每页数量
        orderType = 4,
        isLeaf = 0,
        groupId = 0,
        inQue = '', //搜索的问题
        isJpage = 0, //是否已实例化jpage
        delPage = 0, //是否删除jpage
        solutionId = 0,//问题标识
        startT = '',
        endT = '',
        sourceType = -1;

    //渲染问题详情
    var search = This.location.search;
    var isHttp = new RegExp('http');
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r !== null) return decodeURIComponent(r[2]); return null; //返回参数值
    }
    solutionId = getUrlParam('solutionId');
    startT = getUrlParam('startT');
    endT = getUrlParam('endT');
    sourceType = getUrlParam('sourceType');
    function initSrc() {
        $('.multCos').iCheck('uncheck');
        Base.request({
            type: 'get',
            url: 'LearnQue/list',
            cache: false,
            params: {
                type: type,
                pageNo: pageNo,
                pageSize: pageSize,
                orderType: orderType,
                solutionId: solutionId,
                startT: startT,
                endT: endT,
                source: sourceType
            },
            callback: function (data) {
                if (data.status) {
                    Base.gritter(data.message, false);
                } else {
                    if (!$('.creat')[0]) {
                        var efftiveTime = '';

                        if (data.answer.TimeLiness == 1) {
                            if (data.answer.StartTime == null || data.answer.StartTime == null) {
                                efftiveTime = '未设置';
                            } else {
                                efftiveTime = data.answer.StartTime + '&nbsp;—&nbsp;' + data.answer.EndTime;
                            }
                        } else {
                            efftiveTime = '未设置';
                        }

                        $('.msgCtn').append('<div class="fontLeft">创建者:<span class="creat">' + data.answer[0].Name + '</span>&nbsp;&nbsp;|&nbsp;&nbsp;' + (data.answer[0].GroupName ? '分类:<span class="group" >' + (data.answer[0].GroupName || '') + '</span>&nbsp;&nbsp;|&nbsp;&nbsp;' : '') + '<span>来访者角色：</span><span class="visiterRole" >未设置</span><span>&nbsp;&nbsp;|</span>&nbsp;&nbsp;浏览<span class="hits">' + data.answer[0].Hits + '</span>次&nbsp;&nbsp;|&nbsp;&nbsp;生效时间：<span class="efftiveTime">' + efftiveTime + '</span><span class="time" style="float:right;">' + data.answer[0].AddTime + '</span></div>');

                        $('.queListCtn div').append(data.answer[0].Question);
                        $('.ansListCtn .msgOuterCtn div:first').before(data.answer[0].Answer);

                        //获取来访者角色
                        Base.request({
                            type: 'get',
                            url: 'comb/findSolutionComb',
                            cache: false,
                            params: {
                                id: solutionId,
                            },
                            callback: function (data) {
                                if (data.status) {
                                    Base.gritter(data.message, false);
                                } else {
                                    var rolesArr = [];
                                    if (data.roles[0]) {
                                        for (var i = 0; i < data.roles.length; i++) {
                                            rolesArr.push(data.roles[i].Name);
                                        }
                                        $('.visiterRole').text(rolesArr);
                                    }
                                    if (rolesArr[0]) { } else {
                                        $('.visiterRole').prev().remove();
                                        $('.visiterRole').next().remove();
                                        $('.visiterRole').remove();
                                    }
                                }
                            },
                        });
                    }

                    var html = '';
                    var tmpInque = "";
                    var tmpInqueArr = [];
                    if (data.List[0]) {
                        for (var i = 0; i < data.List.length; i++) {
                            var sourceName = '未知渠道';
                            for (var m = 0; m < data.sourceList.length; m++) {
                                if (data.List[i].SourceId == data.sourceList[m].DicCode) {
                                    sourceName = data.sourceList[m].DicDesc;
                                }
                            }

                            /*TaskId:  401 访客消息为语音，处理后不显示【语音标识】
                             *说明：保存问题的类型 msgType
                             *修改：将接收到问题的类型作为属性，存储到其所在标签的的自定义属性msgType中
                             */
                            html += '<tr Id="' + data.List[i].Id + '" GroupId="' + data.List[i].GroupId + '" ChatUserId="' + data.List[i].ChatUserId + '" ChatVersion="' + data.List[i].ChatVersion + '"><td><input class="singleCos" type="checkbox"></td>';
                            tmpInque = data.List[i].InQue;
                            tmpInqueArr.push(data.List[i].InQue);
                            if (data.List[i].MsgType == 1) {
                                //未知问题中包含图片
                                if (tmpInque) {
                                    if (new RegExp('__xgn_iyunwen_').test(tmpInque)) {
                                        tmpInque = (tmpInque.split('__xgn_iyunwen_')[1] || '');
                                        if (isHttp.test(tmpInque)) {
                                            tmpInque = '<img src="' + tmpInque + '">';
                                        } else {
                                            tmpInque = '<img src="/' + tmpInque + '">';
                                        }
                                    }
                                }

                            } else if (data.List[i].MsgType == 2) {
                                //未知问题中包含语音
                                if (tmpInque) {
                                    if (new RegExp('__xgn_iyunwen_').test(tmpInque)) {
                                        tmpInque = tmpInque.split('__xgn_iyunwen_');
                                        //添加【语音】标识
                                        tmpInque = '【语音】' + tmpInque[0];
                                    }else{
                                        //Amend by zhaoyx at 2017/12/21 处理问题类型为语音 不含'__xgn_iyunwen_' 未显示【语音】的bug
                                        tmpInque = '【语音】' + tmpInque;
                                    }
                                    if (tmpInque.substr(tmpInque.length - 1, 1) == '。') {
                                        tmpInque = tmpInque.split('。')[0];
                                    }
                                }
                              }
                            html += '<td msgType="'+data.List[i].MsgType+'">' + tmpInque + '</td>'
                            html +='<td style="width: 70px;">' + (data.List[i].SourceName||"") + '</td><td>' + sourceName +'：智能客服'+ '</td><td style="width: 150px;">' + data.List[i].DateTime + '</td><td style="width: 135px;"><a index="'+i+'" class="checkChat" href="javascript:;" title="查看聊天记录" data-toggle="modal" data-target="#chatModal" rel="'+data.List[i].ChatUserId+'" cv="'+data.List[i].ChatVersion+'"><i class="timeTip clickBtn glyphicon glyphicon-eye-open" title="查看聊天记录"></i></a><a href="javascript:;"><i class="timeTip go clickBtn glyphicon glyphicon-ok" title="通过"></i><i class="timeTip editGo clickBtn glyphicon glyphicon-edit" title="编辑通过" data-toggle="modal" data-target="#modal-dialog-edit"></i><i class="timeTip ans clickBtn glyphicon glyphicon-pencil huida" title="回答" data-toggle="modal" data-target="#modal-dialog-ans"></i><i class="timeTip ig clickBtn glyphicon glyphicon-trash" title="删除"></i></a></td></tr>';
                        
                            
                        }
                        var options = {
                            data: [data, 'List', 'total'],
                            currentPage: data.currentPage,
                            totalPages: data.totlePages ? data.totlePages : 1,
                            alignment: 'right',
                            onPageClicked: function (event, originalEvent, type, page) {
                                pageNo = page;
                                initSrc();
                            }
                        };
                        $('#itemContainer').bootstrapPaginator(options);
                    } else {
                        html += '<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前无待处理问题，请换一批问题学习！</td></tr>';
                        $('#itemContainer').empty();
                        setTimeout(function () {
                            var ifT = iframeTab.init({ iframeBox: '' });
                            ifT.closeActIframe('', parent.$('#tabHeader li[data-num="' + getUrlParam('tmpNum') + '"]').attr('data-tab'));
                        }, 3000);
                    }
                    $('.tbody1').empty().append(html);
                    $('.timeTip').tooltip();
                    $(".huida").click(function () {
                        $(".justAns,.ansAndLearn").css({
                            'pointer-events': 'all'
                        });
                        $('.justAns').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled');
                        $('.ansAndLearn').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled');
                    });
                    icheckInit();
                    $('.chats').slimScroll({
                        height: ($(window).height() - 300) + 'px'
                    });

                    //绑定lookChat方法点击事件
                    $('.tbody1').undelegate('.checkChat', 'click').delegate('.checkChat', 'click', function () {
                        lookChat(this, tmpInqueArr[$(this).attr('index')]);
                    });
                }
            },
        });
    }
    initSrc();

    //全部忽略事件
    $('body').on('click', '.go, .ig, .mult-go, .mult-ig', function () {
        delPage = 1;
        isJpage = 0;

        if ($(this).is('.go')) { //通过
            var $tr = $(this).parents('tr'),
                ids = $tr.attr('Id');

            Base.request({
                type: 'get',
                url: 'LearnQue/doPassLearnQue',
                cache: false,
                params: {
                    ids: ids,
                    solutionId: solutionId,
                },
                callback: function (data) {
                    if (data.status) {
                        Base.gritter(data.message, false);
                    } else {
                        Base.gritter(data.message, true);
                        initSrc();
                    }
                },
            });
        }
        if ($(this).is('.ig')) { //忽略
            var $tr = $(this).parents('tr'),
                ids = $tr.attr('Id');

            Base.request({
                type: 'get',
                url: 'LearnQue/doIgnoreQues',
                cache: false,
                params: {
                    ids: ids,
                },
                callback: function (data) {
                    if (data.status) {
                        Base.gritter(data.message, false);
                    } else {
                        Base.gritter(data.message, true);
                        initSrc();
                    }
                },
            });
        }
        if ($(this).is('.mult-go')) { //批量通过
            var ids = [];

            $('.singleCos').each(function () {
                var $tr = $(this).parents('tr'),
                    id = $tr.attr('Id');

                if ($(this).is(':checked')) {
                    ids.push(id);
                }
            });

            Base.request({
                type: 'get',
                url: 'LearnQue/doPassLearnQue',
                cache: false,
                params: {
                    ids: ids.toString(),
                    solutionId: solutionId,
                },
                callback: function (data) {
                    if (data.status) {
                        var msg = data.message;
                        if (msg == '参数不能为空！') {
                            msg = '勾选要通过的问题';
                        }
                        Base.gritter(msg, false);
                    } else {
                        Base.gritter(data.message, true);
                        initSrc();
                    }
                },
            });
        }
        if ($(this).is('.mult-ig')) { //批量忽略
            var ids = [];

            $('.singleCos').each(function () {
                var $tr = $(this).parents('tr'),
                    id = $tr.attr('Id');

                if ($(this).is(':checked')) {
                    ids.push(id);
                }
            });

            Base.request({
                type: 'get',
                url: 'LearnQue/doIgnoreQues',
                cache: false,
                params: {
                    ids: ids.toString(),
                },
                callback: function (data) {
                    if (data.status) {
                        var msg = data.message;
                        if (msg == '参数不能为空') {
                            msg = '勾选要删除的问题';
                        }
                        Base.gritter(msg, false);
                    } else {
                        Base.gritter(data.message, true);
                        initSrc();
                    }
                },
            });
        }
    });

    var pageNo1 = 1, //当前页
        pageSize1 = 10, //每页数量
        isJpage1 = 0, //是否已实例化jpage
        startTime = '',
        endTime = '',
        content = '',
        chatUserId = '',
        chtvs = '';

    //配置模态框
    $('#modal-dialog-record').on('hidden.bs.modal', function () {
        $('#clearChatRe').trigger('click');
    });

    //调出编辑通过
    $('body').on('click', '.editGo', function () {
        var $tr = $(this).parents('tr');
        /*TaskId:  401 访客消息为语音，处理后不显示【语音】标识
         *原因：点击编辑通过时，问题类型为语音，去除【语音】标识后传给后台
         *修改：增加判断，读取问题的msgType属性，如果为2，则滤除标识
         */
        $('.edit-textarea').attr({
            id: $tr.attr('id'),
        });

        var msgType=$tr.find('td:eq(1)').attr('msgType');//获取问题类型
        var queContent=$tr.find('td:eq(1)').text();
        if(msgType==2){
            queContent=queContent.split('【语音】')[1];
        }
        $('.edit-textarea').val(queContent);

    });

    //确认通过
    $('.edit-ensure').on('click', function () {

        Base.request({
            type: 'get',
            url: 'LearnQue/doPassEditQue',
            cache: false,
            params: {
                solutionId: solutionId,
                formatQue: $('.edit-textarea').val(),
                id: $('.edit-textarea').attr('id'),
            },
            callback: function (data) {
                if (data.status) {
                    Base.gritter(data.message, false);
                } else {
                    Base.gritter(data.message, true);

                    isJpage = 0;
                    initSrc();
                    $('#modal-dialog-edit').modal('hide');
                }
            },
        });
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

    //ENTER
    $(document).on('keyup', function (e) {
        var $activeEl = $(document.activeElement);

        if ($activeEl.is('.tipsearch') && (e.keyCode == 13 || e.keyCode == 108)) {
            $('#searchChatRe').trigger('click');
        }
        if ($activeEl.is('.search-input-addSrc2') && (e.keyCode == 13 || e.keyCode == 108)) {
            $('.btnSearch2').trigger('click');
        }
    });

    //全选
    $('body').on('ifChecked', '.multCos', function () {
        $('.singleCos').iCheck('check');
    });
    //全不选
    $('body').on('ifUnchecked', '.multCos', function () {
        $('.singleCos').iCheck('uncheck');
    });

    //跳转
    $('.goPage-addSrc a').on('click', function () {
        $('.holder').jPages(parseInt($('.goPage-addSrc input').val()));
        return false;
    });

    //全选文本
    $('.goPage-addSrc input').on('focus', function () {
        $(this).select();
    });

    //排序
    $('.sort1').on('click', function () { //默认
        $('.sortgo').html($(this).text() + '<span class="caret"></span>');
        orderType = 3;
        pageNo = 1;
        initSrc();
    });
    $('.sort2').on('click', function () { //时间正序
        $('.sortgo').html($(this).text() + '<span class="caret"></span>');
        orderType = 3;
        pageNo = 1;
        initSrc();
    });
    $('.sort3').on('click', function () { //时间倒序
        $('.sortgo').html($(this).text() + '<span class="caret"></span>');
        orderType = 4;
        pageNo = 1;
        initSrc();
    });

    var pageNo2 = 1, //当前页
        pageSize2 = 5, //每页数量
        isJpage2 = 0, //是否已实例化jpage
        groupId = 0,
        solutionId2 = 0,
        isLeaf = 1,
        answer = '',
        question = '',
        status = 0,
        level = 1,
        ids = 0,
        queryStr = '?question=';

    $('.fromCtn').add('.textareaCtn').hide();

    //回答
    function ansQue() {
        Base.request({
            type: 'get',
            url: 'question/getQueList' + queryStr + answer + $('.search-input-addSrc2').val(),
            cache: false,
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
                    Base.gritter(data.message, false);
                } else {
                    var html = '';
                    if (data.questionList && data.questionList[0]) {
                        for (var i = 0; i < data.questionList.length; i++) {
                            html += '<tr Id="' + (data.questionList[i].Id || '') + '"  SolutionId="' + (data.questionList[i].SolutionId || '') + '">';
                            html += '<td style="text-align: center;"><input class="singleAnsCos" type="radio" name="ansQue"></td>';
                            if (data.questionList[i].SolutionType == 2) {
                                var link = '/web/knowledge/editFlow.html?questionId=' + data.questionList[i].Id + '&groupId=' + data.questionList[i].GroupId + '&solutionId=' + data.questionList[i].SolutionId;
                                html += '<td class="cosInput clickop" data-link="' + link + '" data-isf="1">' + (data.questionList[i].Question || '') + '</td>';
                            } else {
                                link = '/web/knowledge/queDetail.html?id=' + data.questionList[i].Id;
                                html += '<td class="cosInput clickop" data-link="' + link + '" data-isf="0">' + (data.questionList[i].Question || '') + '</td>';
                            }
                            html += '<td class="cosInput" style="position:relative;"><div class="minheight1" style="max-width: 300px;">';
                            data.questionList[i].ListAnswer.forEach(function (el, i) {
                                if (i == 0) {
                                    html += '<div class="ccca">' + (el.Answer || '') + '</div>';
                                } else {
                                    html += '<div class="ccca" style="display:none;">' + (el.Answer || '') + '</div>';
                                }
                            });
                            if (data.questionList[i].ListAnswer.length > 1) {
                                html += '</div><span style="position:absolute;top:10px;right:0;"><i class="fa fa-chevron-up rotog"></span></td>';
                            } else {
                                html += '</div></td>';
                            }
                            html += '<td>' + (data.questionList[i].AddTime || '') + '</td></tr>';
                        }
                        var options = {
                            currentPage: data.currentPage,
                            totalPages: data.totlePages ? data.totlePages : 1,
                            alignment: 'right',
                            onPageClicked: function (event, originalEvent, type, page) {
                                pageNo2 = page;
                                ansQue();
                            }
                        };
                        $('#itemContainer2').bootstrapPaginator(options);
                    } else {
                        html += '<td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td>';
                        $('#itemContainer2').empty();
                    }
                    $('.tbody2').empty().append(html);
                    $('.timeTip').tooltip();

                    $('input[name=ansQueInput]').on('keyup', function () {
                        var aalen2 = $('input[name=ansQueInput]').val();
                        nxQiYong($('.singleAnsCos:checked').length > 0 && aalen2.length >= 2);
                    });
                    $('.singleAnsCos').on('ifChanged', function () {
                        var aalen = $('input[name=ansQueInput]').val();
                        nxQiYong($('.singleAnsCos:checked').length > 0 && aalen.length >= 2);
                    });
                    icheckInit();
                    $('.minheight').each(function () {
                        var height = $(this).height;
                        if (height > 100) {
                            height = 100;
                        }
                        // $('.minheight').slimScroll({
                        // height: height,
                        // });
                    })
                    $('.slimScrollBar').hide();
                    $('.rotog').on('click', function () {
                        if ($(this).hasClass('fa-chevron-up')) {
                            $(this).removeClass('fa-chevron-up').addClass('fa-chevron-down');
                            $(this).parent().parent().find('.minheight1').children(':not(:first-child)').show();
                        } else {
                            $(this).removeClass('fa-chevron-down').addClass('fa-chevron-up');
                            $(this).parent().parent().find('.minheight1').children(':not(:first-child)').hide();
                        }
                    });
                    $('.clickop').on('dblclick', function () {
                        if ($(this).data('isf')) {
                            ifbOpenWindowInNewTab($(this).data('link'), '流程详细');
                        } else {
                            ifbOpenWindowInNewTab($(this).data('link'), '问题详细');
                        }
                    });
                }
            },
        });
    }

    // 点击td自动选中input
    $('body').on('click', '.cosInput', function () {
        $(this).parents('tr').find('input').iCheck('check');
    })

    //问题
    function queQue() {
        Base.request({
            type: 'get',
            url: 'question/listQue',
            cache: false,
            params: {
                pageNo: pageNo2,
                pageSize: pageSize2,
                groupId: groupId,
                isLeaf: isLeaf,
                question: question,
            },
            callback: function (data) {
                if (data.status) {
                    Base.gritter(data.message, false);
                } else {
                    var html = '';
                    if (data.ListQue[0]) {
                        for (var i = 0; i < data.ListQue.length; i++) {
                            html += '<tr Id="' + (data.ListQue[i].Id || '') + '"  SolutionId="' + (data.ListQue[i].SolutionId || '') + '"><td><input class="singleAnsCos" type="radio" name="ansQue"></td><td class="cosInput">' + (data.ListQue[i].Question || '') + '</td><td class="cosInput">' + (data.ListQue[i].Time || '') + '</td></tr>';
                        }

                        var options = {
                            currentPage: data.currentPage,
                            totalPages: data.totlePages ? data.totlePages : 1,
                            alignment: 'right',
                            onPageClicked: function (event, originalEvent, type, page) {
                                pageNo2 = page;
                                queQue();
                            }
                        };
                        $('#itemContainer2').bootstrapPaginator(options);
                    } else {
                        html += '<td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td>';
                        $('#itemContainer2').empty();
                    }
                    $('.tbody2').empty().append(html);
                    $('.timeTip').tooltip();
                    icheckInit();


                }
            },
        });
    }

    //调出回答
    /*TaskId:  401 访客消息为语音，处理后不显示【语音】标识
     *原因：点击回答时，问题类型为语音，去除【语音】标识后传给后台
     *修改：增加判断，读取问题的msgType属性，如果为2，则滤除标识
     */
    $('body').on('click', '.ans', function () {
        var treeObj = $.fn.zTree.getZTreeObj("ztree2");
        //treeObj.expandAll(false);

        var $tr = $(this).parents('tr'),
            answer1 = $tr.find('td:eq(1)').text();

        ids = $tr.attr('id');
        var msgType=$tr.find('td:eq(1)').attr('msgType');//获取问题类型
        if(msgType==2){
            answer1=answer1.split('【语音】')[1];
        }
        $('input[name=ansQueInput]').val(answer1);
        answer = '';
        ansQue();
    });

    var RoleName = [],
        CombIds = [],
        role = false;

    //确认回答
    $('.justAns').add('.ansAndLearn').on('click', function () {
        if ($(this).is('.justAns')) { //仅回答
            learnFlag = 0;
        }
        if ($(this).is('.ansAndLearn')) { //回答并学习
            learnFlag = 1;
        }

        $('.singleAnsCos').each(function () {
            if ($(this).prop('checked')) {
                solutionId2 = $(this).parents('tr').attr('solutionId');
            }
        });

        answer = $('input[name=ansQueInput]').val();

        if (role) { //可选择来访者角色
            var roleIds1 = '';
            $('.changeChannel').each(function () {
                if (+$(this).attr('go')) {
                    roleIds1 += $(this).attr('diccode') + ',';
                }
            });
            if (roleIds1) {
                roleIds1 = roleIds1.substring(0, roleIds1.length - 1);
            } else {
                roleIds1 = '-1';
            }
            CombIds = []
            CombIds = CombIds.join(',');
            if (!CombIds) {
                CombIds = '-1';
            }
            if (groupId || learnFlag === 0) {
                Base.request({
                    type: 'get',
                    url: 'LearnQue/doFixByNewAnswer',
                    cache: false,
                    params: {
                        fixMode: 4,
                        ids: ids,
                        answer: richtextUE.getContent(),//;$('.ans-textarea').val(),
                        learnFlag: learnFlag,
                        groupId: groupId,
                        formatQue: answer,
                        effectiveRules: '[{"type":1,"roleIds":"' + roleIds1 + '"},{"type":2,"roleIds":"' + CombIds + '"}]',
                    },
                    callback: function (data) {
                        if (data.status) {
                            Base.gritter(data.message, false);
                        } else {
                            Base.gritter(data.message, true);

                            $('#modal-dialog-ans').modal('hide');
                            groupId = 0;
                            richtextUE.setContent('');
                            //$('.ans-textarea').val();
                            initSrc();
                        }
                    },
                });
            } else {
                Base.gritter('请选择一个分类', false);
            }
        } else { //不可选择来访者角色
            Base.request({
                type: 'get',
                url: 'LearnQue/doFixByOtherAnswer',
                cache: false,
                params: {
                    fixMode: 3,
                    ids: ids,
                    formatQue: answer,
                    learnFlag: learnFlag,
                    groupId: groupId,
                    solutionId: solutionId2,
                },
                callback: function (data) {
                    if (data.status) {
                        Base.gritter(data.message, false);
                    } else {
                        Base.gritter(data.message, true);

                        $('#modal-dialog-ans').modal('hide');
                        groupId = 0;
                        initSrc();
                    }
                },
            });
        }
    });

    $('#modal-dialog-ans').on('hidden.bs.modal', function (e) {
        groupId = 0;
        $('#modal-dialog-ans .selectQue').text('全部分类');
        $('.search-input-addSrc2').val('');
        $('a[href=#nav-pills-tab-1]').trigger('click');
        $('a[href=#nav-pills-tab-1]').parent().addClass('active').siblings().removeClass('active');
        richtextUE.setContent('');
        //$('.ans-textarea').val('');

        //重置生效渠道
        $('.changeChannel').each(function () {
            $(this).removeClass('btn-primary').attr('go', '0');
        });
    })

    //合并回答
    $('.ansOneTime').on('click', function () {
        $('#modal-dialog-ans').modal('show');
        ids = [];
        var answer1 = [];
        $('.singleCos').each(function () {
            var $tr = $(this).parents('tr'),
                id = $tr.attr('Id');

            if ($(this).is(':checked')) {
                ids.push(id);
                answer1.push($tr.find('td:eq(1)').text());
            }
        });

        ids = ids.toString();
        $('input[name=ansQueInput]').val(answer1);
        answer = '';
        ansQue();

    });

    //回答页面搜索
    $('.btnSearch2').on('click', function () {
        question = $('.search-input-addSrc2').val();
        pageNo2 = 1;

        if ($('.sort2_0')[0].style.display == 'none') {
            queQue();
        } else {
            ansQue();
        }
    });
    //问题、答案搜索 queryStr
    $('.sort2_1').on('click', function () {
        $('.sort2_0').html($(this).text() + '<span class="caret"></span>');
        queryStr = '?question=';
    });
    $('.sort2_2').on('click', function () {
        $('.sort2_0').html($(this).text() + '<span class="caret"></span>');
        queryStr = '?answer=';
    });

    $('.fromCtn').hide();
    $('.hideCtn').show();
    $('.showCtn').hide();

    //切换列表
    $('a[href=#nav-pills-tab-1]').on('click', function () {
        $(".justAns,.ansAndLearn").css({
            'pointer-events': 'all'
        });
        $('.justAns').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled');
        $('.ansAndLearn').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled');
        role = false;
        $('.fromCtn').hide();
        $('.hideCtn').show();
        $('.showCtn').hide();
        $('.sort2_0').show();
        groupId = 0;
        $('#modal-dialog-ans .selectQue').text('全部分类');
        $('#gggggggg').html('答案');
        answer = '';
        pageNo2 = 1;
        ansQue();
    });
    $('a[href=#nav-pills-tab-2]').on('click', function () {
        groupId = 0;
        $('#modal-dialog-ans .selectQue').text('全部分类');
        richtextUE.setContent('')
        role = true;
        $('.fromCtn').show();
        $('.hideCtn').hide();
        $('.showCtn').show();
        $(".justAns,.ansAndLearn").css({
            'pointer-events': 'all'
        });
        $('.justAns').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled');
        $('.ansAndLearn').removeClass('btn-primary').addClass('btn-default').attr('disabled', 'disabled');
        //对编辑答案回答下 回答和仅回答按钮的操作  加选择改变事件监听
        $('input[name=ansQueInput]').on('keyup', function () {
            var aalen2 = $('input[name=ansQueInput]').val();
            answer = UE.getEditor('ans-textarea').getContent();
            nxQiYong(answer.length > 0 && aalen2.length >= 2);
            return false;
        });

        UE.getEditor('ans-textarea').on('keyup', function (e) {
            answer = UE.getEditor('ans-textarea').getContent();
            var aalen4 = $('input[name=ansQueInput]').val();
            nxQiYong(answer.length > 0 && aalen4.length >= 2);
        });
    });
    $('a[href=#nav-pills-tab-3]').on('click', function () {
        groupId = 0;
        $('#modal-dialog-ans .selectQue').text('全部分类');
        role = false;
        $('.fromCtn').hide();
        $('.hideCtn').show();
        $('.showCtn').hide();
        $('.sort2_0').hide();
        $('#gggggggg').html('问题');
        pageNo2 = 1;
        queQue();
    });

    //跳转
    $('.goPage-addSrc2 a').on('click', function () {
        $('.holder2').jPages(parseInt($('.goPage-addSrc2 input').val()));
        return false;
    });

    //全选文本
    $('.goPage-addSrc input').on('focus', function () {
        $(this).select();
    });

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
        callback: {
            onClick: function (event, treeId, treeNode) {
                $('.closeAll2').trigger('click');
                groupId = treeNode.id - 1;
                isJpage2 = 0;
                pageNo2 = 1;
                /*
                * taskId = 429 智能学习未知问题编辑答案回答时，多次变价仅回答并学习按钮不置灰
                *  判断是否是已有答案回答，如果是则执行ansQue
                */
                if($('.nav-pills li.active a[href="#nav-pills-tab-1"]').text() == '已有答案回答'){
                    ansQue();
                }
                $('#ztree2').fadeOut();
                $('.selectQue').html(treeNode.name);
            },
        }
    };


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
                RoleName = [];
                CombIds = [];

                var treeObj3 = $.fn.zTree.getZTreeObj("ztree3");
                var nodes3 = treeObj3.getCheckedNodes(true);

                for (var i = 0; i < nodes3.length; i++) {
                    RoleName.push(nodes3[i].name);
                    CombIds.push(nodes3[i].id);
                }
                $('.roleInput').attr({
                    title: RoleName,
                }).val(RoleName);
            },
        }
    };

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


                    $.fn.zTree.init($("#ztree2"), setting2, formatData);
                } else {

                }

            }
        },
    });

    //获取来访者角色分类
    Base.request({
        url: 'comb/loadCombs',
        params: {
            m: 0,
        },
        callback: function (data) {
            if (data.status) {
                Base.gritter(data.message, false);
            } else {
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
                    formatData[len]['name'] = '全部角色';
                    formatData[len]['pId'] = 0;
                    formatData[len]['id'] = 1;


                    $.fn.zTree.init($("#ztree3"), setting3, formatData);

                } else {

                }

            }
        },
    });

    // 显隐分类
    $('body').on('click', function (e) {
        if ($(e.target).is('.selectQue')) {// || $(e.target).hasClass('switch')) {
            $('#ztree2').fadeIn();
            $('#ztree2 li:first').slimScroll({
                height: '300px',
            });
        } else {
            $('#ztree2').fadeOut();
        }
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
    $('#ztree2').on('click', function (e) {
        e.stopPropagation();
    });

    //获取生效渠道
    Base.request({
        url: 'Configuration/listItem',
        params: {},
        callback: function (data) {
            if (data.status) {
                Base.gritter(data.message, false);
            } else {
                //生效渠道
                if (data.listItem[0].IsDisplay) { //不展示
                    $('.channelCtn').remove();
                } else {
                    var html = '';
                    if (data.listItem[0].DicList) {
                        for (var i = 0; i < data.listItem[0].DicList.length; i++) {
                            html += '<a href="javascript:;" class="btn btn-sm btn-white changeChannel" DicCode="' + data.listItem[0].DicList[i].DicCode + '" go="0" style="margin: 2px;">' + data.listItem[0].DicList[i].DicDesc + '</a>';
                        }
                    }
                    $('.channel').append(html);
                }

                //生效角色
                if (data.listItem[1].IsDisplay) { //不展示
                    $('.roleCtn').remove();
                }

            }
        },
    });
    //切换选择渠道
    $('body').on('click', '.changeChannel', function () {
        if (+($(this).attr('go'))) { //1
            $(this).attr('go', '0');
            $(this).removeClass('btn-primary');
        } else {
            $(this).attr('go', '1');
            $(this).addClass('btn-primary');
        }
    });

});
