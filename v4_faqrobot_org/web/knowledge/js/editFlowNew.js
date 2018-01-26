var QuestionId = getUrlParam('questionId');
var SolutionId = getUrlParam('solutionId');
var GroupId = getUrlParam('groupId');
var richtextAdd = UE.getEditor('contentAdd', {
    toolbars: [
        [
            'source', '|', 'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor',
            'selectall', 'cleardoc', '|', 'fontfamily', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
            'link', 'unlink', '|', 'imagenone', 'simpleupload', 'insertimage', 'emotion', 'insertvideo', 'attachment', 'map', 'insertframe', 'horizontal', 'date', 'time', 'wordimage'
        ]
    ],
    solutionId: SolutionId,
    initialFrameHeight: 200,
    wordCount: true,
    maximumWords: 20000,
    retainOnlyLabelPasted: true,
    pasteplain: true
});
var richtextEdit = UE.getEditor('contentEdit', {
    toolbars: [
        [
            'source', '|', 'undo', 'redo', '|',
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor',
            'selectall', 'cleardoc', '|', 'fontfamily', 'fontsize', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
            'link', 'unlink', '|', 'imagenone', 'simpleupload', 'insertimage', 'emotion', 'insertvideo', 'attachment', 'map', 'insertframe', 'horizontal', 'date', 'time', 'wordimage'
        ]
    ],
    solutionId: SolutionId,
    initialFrameHeight: 200,
    wordCount: true,
    maximumWords: 20000,
    retainOnlyLabelPasted: true,
    pasteplain: true
});
$(document).ready(function () {
    //switchery 初始化
    function renderSwitcher() {
        var green = "#00acac",
            red = "#ff5b57",
            blue = "#348fe2",
            purple = "#727cb6",
            orange = "#f59c1a",
            black = "#2d353c";
        if ($("[data-render=switchery]").length !== 0) {
            $("[data-render=switchery]").each(function () {
                var e = green;
                if ($(this).attr("data-theme")) {
                    switch ($(this).attr("data-theme")) {
                        case "red":
                            e = red;
                            break;
                        case "blue":
                            e = blue;
                            break;
                        case "purple":
                            e = purple;
                            break;
                        case "orange":
                            e = orange;
                            break;
                        case "black":
                            e = black;
                            break;
                    }
                }
                var t = {};
                t.color = e;
                t.secondaryColor = $(this).attr("data-secondary-color") ? $(this).attr("data-secondary-color") : "#dfdfdf";
                t.className = $(this).attr("data-classname") ? $(this).attr("data-classname") : "switchery";
                t.disabled = $(this).attr("data-disabled") ? true : false;
                t.disabledOpacity = $(this).attr("data-disabled-opacity") ? $(this).attr("data-disabled-opacity") : 0.5;
                t.speed = $(this).attr("data-speed") ? $(this).attr("data-speed") : "0.5s";
                var n = new Switchery(this, t);
            });
        }
    };
    renderSwitcher();

    iframeTab.init({iframeBox: ''});
    $(document).on('click', '.welcomeWords', function () {
        ifbOpenWindowInNewTab('/web/knowledge/queDetail.html?id=' + $(this).attr('questionid'), '问题详细', 'jj');
    });
    richtextAdd.ready(function () {

        /*$('#contentAdd .edui-for-添加流程引导').attr({
         'data-step': "2",
         'data-intro': '点击这里，可以设置相应的流程项！'
         });*/

        // 新手引导(需要引导的页面的code即为页面名称)
        Base.request({
            url: 'tipHelp/check',
            params: {
                code: 'editFlow',
                webId: -1,
            },
            callback: function (data) {
                if (data.status) {//旧
                } else {//新
                    var a = introJs().setOptions({
                        'prevLabel': '上一步',
                        'nextLabel': '下一步',
                        'skipLabel': '　',
                        'doneLabel': '　',
                        'showBullets': false,//隐藏直接跳转按钮(避免onchangebug)
                    }).start();
                    a.onchange(function (obj) {//已完成当前一步
                        var curNum = parseInt($(obj).attr('data-step').match(/\d+/)[0]);//当前的下标

                        /*// 弹出流程项框
                         if(curNum==2 && !window.a) {
                         console.log(curNum, 'b')
                         a.exit();
                         $('#addFlowModal').modal('show');
                         $('#addFlowModal').on('show.bs.modal', function () {
                         console.log(123)
                         //a.goToStep(2);
                         window.a = true;

                         });
                         }else {
                         console.log(curNum, 'a')
                         $('.tipStep'+ (curNum-1)).hide();//隐藏前一个
                         $('.tipStep'+ (curNum+1)).hide();//隐藏后一个
                         $(obj).show();//显示当前
                         }*/
                        $('.tipStep' + (curNum - 1)).hide();//隐藏前一个
                        $('.tipStep' + (curNum + 1)).hide();//隐藏后一个
                        $(obj).show();//显示当前
                    });


                }
            },
        });
    });

    App.init();
    $('#info').addWordCount(200);
    $('#infoEdit').addWordCount(200);
    //列出流程项
    listFlow();
    //列出相似问法表格
    listSimilar();

    $('body').on('keyup', '#searchSimilar', function (event) {
        if (event.which == '13') {
            listSimilar();
        }
    });
    $('body').on('keyup', '#similarQuestion', function (event) {
        if (event.which == '13') {
            addSimilar();
        }
    });
    //ENTER
    $(document).on('keyup', function (e) {
        var $activeEl = $(document.activeElement);

        if ($activeEl.is('[placeholder=输入修改后的问题]') && (e.keyCode == 13 || e.keyCode == 108)) {
            $('.ensureQue').trigger('click');
        }
    });
    //流程项跳转
    $('body').on('click', '.wflink', function () {
        $this = $(this);
        var fid = $this.attr('rel');
        var tarObj = $('#wf_' + fid);
        if (tarObj.length == 0) {
            $.ajax({
                type: 'post',
                cache: false,
                url: encodeURI('../../flowitem/getQueAndAnsByFlowId'),
                data: {id: fid},
                success: function (data) {
                    if (data.status == "0") {
                        var que = data.question.Id;
                        var gro = data.question.GroupId;
                        var sol = data.question.SolutionId;
                        var ht = '';
                        ht += '/web/knowledge/editFlow.html?questionId=' + que + '&groupId=' + gro + '&solutionId=' + sol + '&flowItemId=' + fid;
                        ifbOpenWindowInNewTab(ht, '流程详细');
                    }
                }
            })
        }
        //所有框恢复初始状态
        $('.Ider').css('border-color', '#E4E4E4');
        $('.Ider').find('.changespan').css('color', '#707478');
        $('.Ider').find('.IderHead').css('background-color', '#fff');
        $('.Ider').find('a.sha').css('color', '#23527c');
        $('.Ider').find('a.sha:hover').css('color', '#23527c');
        //窗口滚动到下一步
        $.scrollTo('#wf_' + fid, 500);
        //变化
        tarObj.animate({borderColor: '#DE5246'}, 800);
        tarObj.find('.changespan').animate({color: '#fff'}, 800);
        tarObj.find('.IderHead').animate({backgroundColor: '#DE5246'}, 800);
        //修改和删除标签变白色
        tarObj.find('a.sha').css('color', '#fff');
        tarObj.find('a.sha:hover').css('color', '#fff');
    });

    //添加流程项表单验证
    $('#addFlowForm').validate({
        rules: {
            info: {
                required: true,
                minlength: 2,
                maxlength: 200
            }
        },
        messages: {
            info: {
                required: '请输入流程项描述！',
                minlength: '流程项描述的长度为2-200个字符！',
                maxlength: '流程项描述的长度为2-200个字符！'
            }
        },
        submitHandler: addFlow
    });
    //修改流程项表单验证
    $('#editFlowForm').validate({
        rules: {
            info: {
                required: true,
                minlength: 2,
                maxlength: 200
            }
        },
        messages: {
            info: {
                required: '请输入流程项描述！',
                minlength: '流程项描述的长度为2-200个字符！',
                maxlength: '流程项描述的长度为2-200个字符！'
            }
        },
        submitHandler: editFlow
    });
    $('#flowContent').on("mouseenter mouseleave", '.Ider', function (event) {
        if (event.type == "mouseenter") {
            //鼠标进入
            $(this).children().find('a.sha').show();
        } else if (event.type == "mouseleave") {
            //鼠标离开
            $(this).children().find('a.sha').hide();
        }
    });

    //修改流程分类模态窗
    $('.treeDivModal').slimScroll({
        height: '400px'
    });
    $('#QuestionClassModel').on('show.bs.modal', function () {
        $.fn.zTree.init($("#treeQueClass"), classsetting, []);
    });
    $('#QuestionClassModel').on('hide.bs.modal', function () {
        $('#QuestionClassModel [name=treeId]').val('');
    });
    $('#selClassBtn').on('click', function () {
        $.ajax({
            type: 'get',
            datatype: 'json',
            cache: false,
            url: encodeURI('../../question/editQuestion'),
            data: {
                solutionId: SolutionId,
                questionId: QuestionId,
                groupId: $('#QuestionClassModel [name=treeId]').val(),
                question: $('.queTitle').text()
            },
            success: function (data) {
                if (data.status == 0) {
                    $('#chClass').text($('#QuestionClassModel [name=treeName]').val());
                    yunNoty(data);
                } else {
                    yunNoty(data);
                }
            }
        });
        $('#QuestionClassModel').modal('hide');
    });
});

//问题分类树
var classsetting = {
    view: {
        dblClickExpand: false,
        showIcon: false
    },
    data: {
        simpleData: {
            enable: true,
            idKey: "Id",
            pIdKey: "ParentId",
            rootPId: 0
        },
        key: {
            name: "Name"
        }
    },
    async: {
        enable: true,
        url: "../../classes/listClasses?m=0",
        autoParam: ["id"],
        dataFilter: ajaxDataFilter
    },
    callback: {
        onClick: ZTreeClassClick,
        beforeClick: zTreeBeforeClick,
        onAsyncSuccess: zTreeOnAsyncSuccess
    }
};

//格式化一步获取的json数据
function ajaxDataFilter(treeId, parentNode, responseData) {
    if (responseData) {
        if (responseData.status == -1) {
            yunNoty(responseData);
        }
        responseData.list.push({
            Id: 0,
            ParentId: 0,
            Name: "全部分类",
            open: true
        });
        return responseData.list;
    }
    return responseData;
}
function ZTreeClassClick(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj('treeQueClass');
    Nodes = zTree.getSelectedNodes();
    $('#QuestionClassModel [name=treeName]').val(Nodes[0].Name);
    $('#QuestionClassModel [name=treeId]').val(Nodes[0].Id);
}
function zTreeBeforeClick(treeId, treeNode, clickFlag) {
    return !treeNode.isParent; //当是父节点 返回false不让选取
}
function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
    var treeObj = $.fn.zTree.getZTreeObj("treeClasses");
    //treeObj.expandAll(true);
}

var flag_ensureQue = false;
var tmpNum = parent.$('#tabHeader li[data-tab="' + location.href + '"]').attr('data-num');//此处将tmpNum定义成了data-num
//列出流程问题和答案
function listFlow() {
    var dataJSON = {
        id: QuestionId
    };
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        url: encodeURI('../../question/getQuestionById'),
        data: dataJSON,
        success: function (data) {
            if (data.status == 0) {
                var html = '';
                if (data.question) {
                    var ListAnswer = data.question.ListAnswer,
                        ansStr = '',
                        ansThisIndex = '';

                    for (var j = 0; j < ListAnswer.length; j++) {
                        var ansItem_focus = '';
                        if (!j) {//第一个答案
                            ansItem_focus = 'ansItem_focus';
                        }
                        if (ListAnswer.length > 1) {
                            ansThisIndex = j + 1;
                        }
                        var EnterflowItem = '';
                        var efiSpan = '';
                        if (ListAnswer[j].ModeValue !== null && ListAnswer[j].ModeInfo !== null) {
                            // if(ListAnswer[j].ModeInfo !== null) {
                            EnterflowItem = '#' + ListAnswer[j].ModeValue + '-' + ListAnswer[j].ModeInfo;
                            efiSpan = '<span class="dot">|</span>';
                        }
                        var AnswerStatus = '';
                        AnswerStatus += '<option value="0">已发布</option><option value="-1">暂存</option><option value="-2">等待审核</option><option value="-3">返回修改</option><option value="-4">已过期</option><option value="-5">等待生效</option>';

                        ansStr += '<div class="ansItem ' + ansItem_focus + '" Id="' + ListAnswer[j].Id + '" GroupId="' + ListAnswer[j].GroupId + '" SolutionId="' + ListAnswer[j].SolutionId + '" Webid="' + ListAnswer[j].Webid + '" SubSolutionId="' + ListAnswer[j].SubSolutionId + '"><div class="ansItemCtn"><span class="timeTip ansItemImg" style="background:url(' + "./images/flow.png" + ') no-repeat" title="" data-original-title="流程"></span><span class="ansIndex">流程描述' + ansThisIndex + '</span><div class="listAnswer">' + ListAnswer[j].Answer + '</div></div><div class="ansItemFrom"><span>来自:<em>' + ListAnswer[j].UserName + '</em></span><span class="dot">|</span>' + showRule(ListAnswer[j], data.sourceList) + '<span>浏览<em>' + (ListAnswer[j].Hits || 0) + '</em>次</span><span class="dot">|</span><a><span><select cur="' + ListAnswer[j].AnswerStatus + '">' + AnswerStatus + '</select></span></a><span class="dot">|</span><span><span class="glyphicon glyphicon-thumbs-up" title="赞"></span><em>' + (ListAnswer[j].Usefull || 0) + '</em>次</span><span class="dot">|</span><span><span class="glyphicon glyphicon-thumbs-down" title="踩"></span><em>' + (ListAnswer[j].Useless || 0) + '</em>次</span><span class="dot">|</span>';
                        //生效时间配置
                        var timeStr = "";
                        if (ListAnswer[j].TimeLiness == 1) {
                            if (ListAnswer[j].StartTime && ListAnswer[j].EndTime) {
                                timeStr = '<span>生效时间：' + ListAnswer[j].StartTime + '-' + ListAnswer[j].EndTime + '</span><span class="dot">|</span>'
                            } else if (ListAnswer[j].StartTime) {
                                timeStr = '<span>起始时间：' + ListAnswer[j].StartTime + '</span><span class="dot">|</span>'
                            } else if (ListAnswer[j].EndTime) {
                                timeStr = '<span>结束时间：' + ListAnswer[j].EndTime + '</span><span class="dot">|</span>'
                            }
                        } else {
                            timeStr = "";
                        }
                        ansStr += timeStr;
                        ansStr += '<a href="editAnswer.html?solutionId=' + ListAnswer[j].SolutionId + '&groupId=' + ListAnswer[j].GroupId + '&answerId=' + ListAnswer[j].Id + '&question=' + data.question.Question + '&tmpNum=' + tmpNum + '" data-num="0" data-name="修改流程描述"><span class="timeTip glyphicon glyphicon-pencil" title="编辑流程描述"></span></a>' + efiSpan + '<a href="javascript:;" class="flowSelectA timeTip" title="选择该描述的入口流程项" fid="' + ListAnswer[j].Id + '">' + (EnterflowItem === '' ? '<span class="glyphicon glyphicon-th-list"></span>' : EnterflowItem) + '</a>';
                        if (ListAnswer.length > 1) {
                            ansStr += efiSpan + '<a><span class="oneDelAns timeTip glyphicon glyphicon-trash" title="删除流程描述"></span></a>';
                        }
                        ansStr += '</div></div>';

                    }
                    var Status = '';
                    Status += '<option value="0">已发布</option><option value="-1">暂存</option><option value="-2">等待审核</option><option value="-3">返回修改</option><option value="-4">已过期</option><option value="-5">等待生效</option>';

                    var editAnswer = '<a href="editAnswer.html?solutionId=' + data.question.SolutionId + '&groupId=' + data.question.GroupId + '&question=' + data.question.Question + '&isFlow=1' + '&tmpNum=' + tmpNum + '" data-num="0" data-name="新增流程描述"><span class="timeTip glyphicon glyphicon-plus" title="新增流程描述"></span></a>';
                    if (data.question.SolutionType == 2) {
                        editAnswer = '';
                    }

                    var labelName = data.question.LabelName;
                    if (labelName == null) {
                        labelName = "无";
                    }

                    //html += '<tr Id="'+ data.question.Id +'" GroupId="'+ data.question.GroupId +'" SolutionId="'+ data.question.SolutionId +'"><td style="border-top: none;padding: 0;"><div class="theWholeCtn"><legend>流程</legend><div class="titleCtn margint10"><span class="queTitle">'+ data.question.Question +'</span><a><span class="editQue timeTip glyphicon glyphicon-edit" title="修改流程"></span></a></div>  <div class="queWholeCtn margint10"><span>来自:<em>'+ data.question.UserName +'</em></span><span class="dot">|</span><span>分类:<a class="editClass" id="chClass"><em>'+ ListAnswer[0].GroupName +'</em></a></span><span class="dot">|</span><span>标签:<a class="editLabels"><em>' + labelName + '</em></a></span><span class="dot">|</span><span>浏览<em>'+ (data.question.Hits || 0) +'次</em></span><span class="dot">|</span><a><span><select class="editStatus" cur="'+ data.question.Status +'">'+ Status +'</select></span></a><span><span class="dot">|</span><span class="glyphicon glyphicon-thumbs-up" title="赞"></span><em>'+ (data.question.Usefull || 0) +'</em>次</span><span class="dot">|</span><span><span class="glyphicon glyphicon-thumbs-down" title="踩"></span><em>'+ (data.question.Useless || 0) +'</em>次</span></span><span class="dot">|</span><span>'+ editAnswer +'</span><a><span class="oneDelQue timeTip glyphicon glyphicon-trash" title="删除流程"></span></a></div></div>  <div class="theWholeCtn"><legend>流程描述</legend><div class="queCtn">'+ ansStr +'</div></div></td></tr>';
                    var entityList = '';
                    if (data.question.Entitys) {
                        entityList = data.question.Entitys;
                    } else {
                        entityList = '';
                    }
                    html += '<tr Id="' + data.question.Id + '" entity="' + entityList + '" sgId="' + data.question.SgId + '" GroupId="' + data.question.GroupId + '" SolutionId="' + data.question.SolutionId + '"><td style="border-top: none;padding: 0;"><div class="theWholeCtn"><legend>流程</legend><div class="titleCtn margint10"><span class="queTitle">' + data.question.Question + '</span><a><span class="editQue timeTip glyphicon glyphicon-edit" title="修改流程"></span></a></div>  <div class="queWholeCtn margint10"><span>来自:<em>' + data.question.UserName + '</em></span><span class="dot">|</span><span>分类:<a class="editClass" id="chClass"><em class="timeTip" data-original-title="选择分类：问题分类是创建知识的基础，不建分类无法创建知识">' + ListAnswer[0].GroupName + '</em></a></span><span class="dot">|</span><span>标签:<a class="editLabels"><em  class="timeTip" data-original-title="选择标签：便于解决知识交叉分类的需求">' + labelName + '</em></a></span><span class="dot">|</span>' + ('<span class="interTerm1">智能句式:<a style="cursor: pointer;" data-toggle="modal tooltip" data-type="SgName"><em>' + (data.question.SgName || '暂无') + '</em></a><span class="spanInter" style="opacity:0;"></span></span><span class="dot">|</span>') + '<span>浏览<em>' + (data.question.Hits || 0) + '次</em></span><span class="dot">|</span><a><span><select class="editStatus" cur="' + data.question.Status + '">' + Status + '</select></span></a><span><span class="dot">|</span><span class="glyphicon glyphicon-thumbs-up" title="赞"></span><em>' + (data.question.Usefull || 0) + '</em>次</span><span class="dot">|</span><span><span class="glyphicon glyphicon-thumbs-down" title="踩"></span><em>' + (data.question.Useless || 0) + '</em>次</span></span><span class="dot">|</span><span>' + editAnswer + '</span><a><span class="oneDelQue timeTip glyphicon glyphicon-trash" title="删除流程"></span></a></div></div>  <div class="theWholeCtn"><legend>流程描述</legend><div class="queCtn">' + ansStr + '</div></div></td></tr>';

                }
                $('.tbody1').empty().append(html);
                if (sessionStorage.getItem('sentenceValue') == 1) {
                    $('.interTerm1').css('display', 'inline-block');
                    $('.interTerm1').next().css('display', 'inline-block');
                } else {
                    $('.interTerm1').css('display', 'none');
                    $('.interTerm1').next().css('display', 'none');
                }
                clickLabelEdit();  //修改标签
                $('.interTerm1>a').hover(function () {
                    if ($(".queWholeCtn").parents('tr').attr('sgid') === "null") {
                        $("[data-toggle~=tooltip]").tooltip({
                            'html':true,
                            'title':"<div>智能句式：在添加问题时引用该句式组，即可用句式组下面的问法去咨询该问题</div>",
                            'placement':"right",
                            'template':'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="min-width: 200px;text-align: left"></div></div>'
                        }).tooltip('show');
                    } else {
                        sentenceInter();
                    }
                }, function () {
                    $(".spanInter").html('');
                    $(".spanInter").css('opacity', 0);
                });

                $('.interTerm1 a').click(function () {
                    $('#modal-intelTerm').modal('show');
                    $('#EntitysList .entityTio').val();
                    $('#EntitysList .entityTio').val($('.interTerm1').parents('tr').attr('entity'));
                    $('[name="checkedId"]').val($(".queWholeCtn").parents('tr').attr('sgid'));
                });
                $('#chClass').click(function () {
                    $('#QuestionClassModel').modal('show');
                });

                $('.timeTip').tooltip();
                $('.ansItemCtn .listAnswer').each(function () {
                    if ($(this).height() == 400) {
                        $(this).slimScroll({
                            allowPageScroll: false,
                            height: '100%',
                        }).trigger('mouseout')
                    }
                })
                groupId2 = $('.tbody1 tr').attr('groupid');
                solutionId2 = $('.tbody1 tr').attr('solutionId');
                $("#modal-intelTerm input[name=solutionId]").val(solutionId2);
                $('select').each(function () {
                    switch (parseInt($(this).attr('cur'))) {
                        case 0:
                            $('option', $(this)).eq(0).attr({'selected': 'true'});
                            break;
                        case -1:
                            $('option', $(this)).eq(1).attr({'selected': 'true'});
                            break;
                        case -2:
                            $('option', $(this)).eq(2).attr({'selected': 'true'});
                            break;
                        case -3:
                            $('option', $(this)).eq(3).attr({'selected': 'true'});
                            break;
                        case -4:
                            $('option', $(this)).eq(4).attr({'selected': 'true'});
                            break;
                        case -5:
                            $('option', $(this)).eq(5).attr({'selected': 'true'});
                            break;
                    }
                    /*if($(this).is('.editStatus')) {
                     if(parseInt($(this).attr('cur'))) {
                     $('select:not(.editStatus)').attr({'disabled': 'true'}).addClass('notSelect');
                     }
                     }*/
                });

                //修改问题
                $('body').on('click', '.editQue', function () {
                    var $titleCtn = $(this).parents('.titleCtn'),
                        $editTitleCtn = $('<div><input type="text" name="simiQue" class="form-control" placeholder="输入修改后的问题" style="max-width: 60%; display: inline-block; margin: 5px 10px 5px 0;"></td><td></td><td><a class="ensureQue"><span class="timeTip glyphicon glyphicon-ok" title="确定" style="margin-right: 5px;"></span></a><a class="cannelQue"><span class="timeTip glyphicon glyphicon-remove" title="取消"></span></a></div>');

                    if (!$titleCtn.next().find('.ensureQue')[0]) {
                        $titleCtn.after($editTitleCtn);
                        $editTitleCtn.hide().fadeIn();
                        $('.timeTip').tooltip();
                        $editTitleCtn.find('input').val($titleCtn.find('.queTitle').text()).focus();
                    }
                });

                //确认修改问题
                $('body').on('click', '.ensureQue', function () {
                    var $tr = $(this).parents('tr'),
                        $input = $(this).prev('input'),
                        question = $input.val();

                    if (flag_ensureQue) {
                        return;
                    }
                    flag_ensureQue = true;
                    $.ajax({
                        type: 'get',
                        datatype: 'json',
                        cache: false,
                        url: encodeURI('../../question/editQuestion'),
                        data: {
                            solutionId: $tr.attr('solutionId'),
                            groupId: $tr.attr('groupId'),
                            questionId: $tr.attr('id'),
                            question: question,
                        },
                        success: function (data) {
                            flag_ensureQue = false;
                            if (data.status == "0") {
                                yunNoty(data);
                                $tr.find('.queTitle').text(question);
                                $input.parent().fadeOut(function () {
                                    $(this).remove();
                                });
                            } else {
                                yunNoty(data);
                            }
                        }
                    });
                });

                //取消修改问题
                $('body').on('click', '.cannelQue', function () {
                    var $div = $(this).parent('div');
                    $div.fadeOut(function () {
                        $(this).remove();
                    });
                });

                //添加问题
                $('.addQue').on('click', function () {
                    var ifT = iframeTab.init({iframeBox: ''});
                    ifT.refreshTab('/web/knowledge/addQuestion.html', '新增流程');
                });


                //修改问题状态
                $('body').on('change', 'select', function () {
                    var $tr = $(this).parents('tr'),
                        $ansItem = $(this).parents('.ansItem'),
                        status = 0;

                    $('option', $(this)).each(function (i) {
                        if ($(this).prop('selected')) {
                            status = i;
                        }
                    });

                    switch (status) {
                        case 0:
                            status = 0;
                            break;
                        case 1:
                            status = -1;
                            break;
                        case 2:
                            status = -2;
                            break;
                        case 3:
                            status = -3;
                            break;
                        case 4:
                            status = -4;
                            break;
                        case 5:
                            status = -5;
                            break;
                    }

                    if ($(this).is('.editStatus')) {
                        $.ajax({
                            type: 'get',
                            datatype: 'json',
                            cache: false,
                            url: encodeURI('../../question/doUpdateStatus'),
                            data: {
                                solutionId: $tr.attr('solutionId'),
                                status: status
                            },
                            success: function (data) {
                                yunNoty(data);
                            }
                        });
                    } else {
                        $.ajax({
                            type: 'get',
                            datatype: 'json',
                            cache: false,
                            url: encodeURI('../../answer/updateStatus'),
                            data: {
                                answerId: $ansItem.attr('id'),
                                groupId: $ansItem.attr('groupId'),
                                status: status
                            },
                            success: function (data) {
                                yunNoty(data);
                            }
                        });
                    }
                });
                $('.ansItem').on('mouseenter mouseleave', function (event) {
                    if (event.type == "mouseenter") {
                        //鼠标进入
                        $(this).addClass('ansItem_focus');
                    } else if (event.type == "mouseleave") {
                        //鼠标离开
                        $(this).removeClass('ansItem_focus');
                    }
                });
                $('.flowSelectA').on('click', function () {
                    $('#flowSelectModel').modal('show');
                    $('#flowAnswerId').val($(this).attr('fid'));
                    listFlowItemModal();
                });
                listFlowItems();
            }
        }
    });
}

//选择智能句式组后匹配出对应下面的句式
function sentenceInter() {
    var html = '系统已生成下列几种句式：<br />';
    $.ajax({
        type: "post",
        url: "../../KnSentenceItem/getKSItemList",
        async: true,
        cache: true,
        data: {'sgId': $(".queWholeCtn").parents('tr').attr('sgid')},
        success: function (data) {
            if (data.status == 0) {
                var list = data.knList;
                if (list.length === 0) {
                    html = '这个句式组下没有句式！<br />';
                }
                //如果配置项sentenceShow==0且大于5条，则只显示5条；否则全部显示
                if(sessionStorage.getItem('sentenceShow')==0){
                    if (list.length >= 5) {
                        for (var i = 0; i < 5; i++) {
                            html += (i + 1) + '.' + list[i].SiName + '<br />';
                        }
                    } else {
                        for (var i = 0; i < list.length; i++) {
                            html += (i + 1) + '.' + list[i].SiName + '<br />';
                        }
                    }
                }else{
                    for (var i = 0; i < list.length; i++) {
                        html += (i + 1) + '.' + list[i].SiName + '<br />';
                    }
                }
                $('[data-toggle~=tooltip]').tooltip({
                    'html':true,
                    'title':html,
                    'placement':"right",
                    'template':'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="min-width: 200px;text-align:left;"></div></div>'
                }).tooltip('show');
            }
        }
    })
}


//设置句式树
var termsetting = {
    view: {
        dblClickExpand: false,
        showIcon: false
    },
    data: {
        simpleData: {
            enable: true,
            idKey: "Id",
            pIdKey: "ParentId",
            rootPId: 0
        },
        key: {
            name: "Name"
        }
    },
    async: {
        enable: true,
        url: "../../classes/listClasses?m=11",
        autoParam: ["id"],
        dataFilter: ajaxDataFilterNew
    },
    callback: {
        onClick: ZTreeClassTermClickNew,
        onAsyncSuccess: zTreeOnAsyncSuccessNew
    }
};
function ZTreeClassTermClickNew(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj('treeTermClass');
    Nodes = zTree.getSelectedNodes();
    $('#modal-intelTerm input[name=treeName]').val(Nodes[0].Name);
    $('#modal-intelTerm input[name=treeId]').val(Nodes[0].Id);
    termList(1);
}
function zTreeOnAsyncSuccessNew(event, treeId, treeNode, msg) {
    var treeObj = $.fn.zTree.getZTreeObj("treeClasses");
    //treeObj.expandAll(true);
}
//格式化一步获取的json数据
function ajaxDataFilterNew(treeId, parentNode, responseData) {
    if (responseData) {
        if (responseData.status == -1) {
            yunNoty(responseData);
        }
        responseData.list.push({
            Id: -1,
            ParentId: 0,
            Name: "全部分类",
            open: true
        });
        return responseData.list;
    }
    return responseData;
}
$('#modal-intelTerm').on('show.bs.modal', function () {
    $.fn.zTree.init($("#treeTermClass"), termsetting, []);
    /*$('#affix1inner').slimScroll({
     height: $(window).height()-300+ 'px',
     allowPageScroll: false
     });*/
    $('#modal-intelTerm input[name=treeId]').val(0);
    termList(1);
});
//句式组内容列表
var pageNum = 1;
function termList(pageNum) {
    if (!pageNum) pageNum = 1;
    $('#termTable').tableAjaxLoader2(2);
    $.ajax({
        type: "post",
        url: "../../KnSentenceGroup/getKnSentenceGroupList?pageSize=8&pageNo=" + pageNum + "&groupId=" + (parseInt($('#modal-intelTerm input[name=treeId]').val()) || ''),
        async: true,
        cache: true,
        success: function (data) {
            if (data.list.Items && data.list.Items.length > 0) {
                var html = [];
                var temp = data.list.Items;
                for (var i = 0; i < temp.length; i++) {
                    html += '<tr id="' + temp[i].Id + '" ClassId="' + temp[i].ClassId + '" SgName="' + temp[i].SgName + '">' +
                        '<td><input type="radio" name="match"></td>' +
                        '<td>' + temp[i].SgName + '</td>' +
                        '</tr>';
                }
                $("#termTable tbody").html(html);

                icheckInit();
                //单选框点击事件
                $('#termTable tr input[name=match]').on('ifClicked',function(){
                    $('[name="checkedId"]').val($(this).parents('tr').attr('id'));
                });
                //表格点击事件
                $('#termTable tr').click(function () {
                    $(this).find('input[name=match]').iCheck('check');
                    $('[name="checkedId"]').val($(this).attr('id'));
                });
                for (var i = 0; i < $('#termTable tbody tr').length; i++) {
                    if ($('#termTable tbody tr').eq(i).attr('id') == $(".queWholeCtn").parents('tr').attr('sgid')) {
                        $('#termTable tbody tr').eq(i).find('input[name=match]').iCheck('check');
                        $('[name="checkedId"]').val($(".queWholeCtn").parents('tr').attr('sgid'));
                    }
                }
                //下面开始处理分页
                var options = {
                    currentPage: data.currentPage,
                    totalPages: data.totlePages,
                    onPageClicked: function (event, originalEvent, type, page) {
                        termList(page);
                    }
                };
                setPage('termPageList', options);
            } else {
                $('#termTable').find('tbody').html('<tr><td colspan=\"4\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>  当前纪录为空！</td></tr>');
                $('#termPageList').html('');
            }
        }
    });
}

var entitysTioAtr = '';
// 添加智能句式
$('.addTerm').on('click', function () {
    $("#EntitysList .entityTio").each(function (i) {
        if ($("#EntitysList .entityTio").eq(i).val() != '') {
            entitysTioAtr += $("#EntitysList .entityTio").eq(i).val() + ',';
        }
    });

    $(".queWholeCtn").parents('tr').attr('sgid', $("#termTable td .iradio_flat-blue.checked").parents('tr').attr('id'));
    $.ajax({
        url: '../../KnSentencegroupSolution/doEditKSSolution',
        type: 'post',
        data: {
            'solutionStr': $('#modal-intelTerm input[name=solutionId]').val(),
            'sgId': ($('[name="checkedId"]').val() != "null") ? $('[name="checkedId"]').val() : '',
            'entitys': entitysTioAtr.substring(0, entitysTioAtr.length - 1)
        },
        success: function (data) {
            if (data.status == 0) {
                yunNoty(data);
                $('#modal-intelTerm').modal('hide');
                window.location.reload();
            } else {
                yunNoty(data);
            }
        }
    });
});

var $ansItem = null,
    $tr = null;
//确认删除答案或问题
$('#delYes').on('click', function () {
    var title = $('#tipTitle').text();
    if (title == '删除答案') {
        $.ajax({
            type: 'get',
            datatype: 'json',
            cache: false,
            url: encodeURI('../../answer/deleteAnswer'),
            data: {
                solutionId: $ansItem.attr('solutionId'),
                groupId: $ansItem.attr('id'),
                id: $ansItem.attr('id'),
            },
            success: function (data) {
                if (data.status == "0") {
                    yunNoty(data);
                    $('#delAnsConfirm').modal('hide');
                    listFlow();
                } else {
                    yunNoty(data);
                }
            }
        });
    }
    if (title == '删除问题') {
        $.ajax({
            type: 'get',
            datatype: 'json',
            cache: false,
            url: encodeURI('../../Question/delOptQuestionByIds'),
            data: {
                ids: $tr.attr('id'),
            },
            success: function (data) {
                if (data.status == "0") {
                    yunNoty(data, function () {
                        var ifT = iframeTab.init({iframeBox: ''});
                        ifT.closeActIframe('', parent.$('#tabHeader li[data-num="' + getUrlParam('tmpNum') + '"]').attr('data-tab'));
                    });
                    $('#delAnsConfirm').modal('hide');
                } else {
                    yunNoty(data);
                }
            }
        });
    }
});

//删除答案或问题
$('body').on('click', '.oneDelAns, .multDelAns, .oneDelQue, .multDelQue', function (e) {
    $ansItem = $(this).parents('.ansItem');
    $tr = $(this).parents('tr');
    var ansItemLen = $tr.find('.ansItem').length;
    if ($(e.target).is('.oneDelAns')) {//单个删除答案
        if (ansItemLen == 1) {
            var tmpOBj = {"message": "问题至少要有一个答案", "status": 1};
            yunNoty(tmpOBj);
        } else {
            $('#delAnsConfirm').modal('show');
            $('#tipTitle').text('删除答案');
            $('#tipWord').text('确认删除该答案？');
        }
    }
    if ($(e.target).is('.oneDelQue')) {//单个删除问题
        $('#delAnsConfirm').modal('show');
        $('#tipTitle').text('删除问题');
        $('#tipWord').text('删除该问题将会一并删除与之相关的答案、相似问法，确认删除该问题？');
    }
});

//选择答案对应的流程项
function listFlowItemModal(bool) {
    var url = null;
    if (!bool) {
        url = '../../flowItem/findFlowItemsById' + '?solutionId=' + SolutionId;
    } else {
        url = '../../flowItem/findAll';
    }
    $('#flowList').tableAjaxLoader2(3);
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        //不从缓存中去数据
        url: encodeURI(url),
        data: $('#search_flowItem').serialize(),
        success: function (data) {
            if (data.status == 0) {
                if (data.list == undefined) {
                    $('#flowList').find('tbody').html('<tr><td colspan=\"3\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
                    return;
                }
                if (data.list.length > 0) {
                    if (!bool) {
                        data.list = data.list.filter(function (ee) {
                            return ee.OrderId === 1;
                        })
                    }
                    var html = "";
                    for (var i = 0; i < data.list.length; i++) {
                        html += "<tr id=\"list-tr-" + data.list[i].Id + "\">";
                        html += "<td><input type=\"radio\" name=\"row_sel_flow\" class=\"select_row\" value=\"" + data.list[i].Id + "\"/></td>";
                        html += "<td>" + data.list[i].Info + "</td>";
                        html += "<td>" + data.list[i].Time + "</td>";
                        html += "</tr>";
                    }
                    $('#flowList').find('tbody').html(html);
                    icheckInit();
                    $('#flowList td').click(function () {
                        $(this).parent().find('input[name=row_sel_flow]').iCheck('check');
                    });
                } else {
                    $('#flowList').find('tbody').html('<tr><td colspan=\"3\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
                }
            } else {
                yunNoty(data);
            }
        }
    });
}

//确定选择
$('#selFlowBtn').click(function () {
    var id = getSelectedIds_flow();
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        //不从缓存中去数据
        url: encodeURI('../../flowitem/doEditModeValue'),
        data: {
            answerId: $('#flowAnswerId').val(),
            mode: 6,
            modeValue: id
        },
        success: function (data) {
            if (data.status == "0") {
                yunNoty(data);
                if (data.Id) {
                    $('a[fid=' + $('#flowAnswerId').val() + ']').html('#' + data.Id + '-' + data.Info);
                    if (!$('a[fid=' + $('#flowAnswerId').val() + ']').prev().hasClass('dot')) {
                        $('a[fid=' + $('#flowAnswerId').val() + ']').before('<span class="dot">|</span>').after('<span class="dot">|</span>');
                    }
                } else {
                    $('a[fid=' + $('#flowAnswerId').val() + ']').html('<span class="timeTip glyphicon glyphicon-th-list" title="选择该描述的入口流程项"><span>');
                    $('a[fid=' + $('#flowAnswerId').val() + ']').prev().remove();
                    $('a[fid=' + $('#flowAnswerId').val() + ']').after().remove();
                }
                $('#flowSelectModel').modal('hide');
            } else {
                yunNoty(data);
            }
        }
    });
});

$('#search_flowItem input[name=content]').keyup(function (event) {
    if (event.keyCode == 13) {
        listFlowItemModal();
    }
});

function getSelectedIds_flow() {
    var cboxs = document.getElementsByName('row_sel_flow');
    if (typeof cboxs == "undefined") {
        return -1;
    }
    var inputvalue = "";
    for (var i = 0; i < cboxs.length; i++) {
        if (cboxs[i].checked == true) {
            inputvalue = cboxs[i].value;
        }
    }
    return inputvalue;
}

//列出相似问法列表
function listSimilar(pageNo, orderType) {
    var question = $('#searchSimilar').val();
    if (!pageNo)pageNo = 1;
    if (!orderType) {
        orderType = $('input[name=orderType]').val();
    } else {
        $('input[name=orderType]').val(orderType);
    }
    var dataJSON = {
        question: question,
        solutionId: SolutionId,
        groupId: GroupId,
        pageNo: pageNo,
        pageSize: 10,
        orderType: orderType
    };
    $('#similarList').tableAjaxLoader2(4);
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,//不从缓存中去数据
        url: encodeURI('../../question/findSimilarQuestion'),
        data: dataJSON,
        success: function (data) {
            if (data.status == 0) {
                if (data.listSimilar == undefined) {
                    $('#similarList').find('tbody').html('<tr><td colspan=\"4\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>  当前纪录为空！</td></tr>');
                    $('#similarPageList').html('');
                    return;
                }
                if (data.listSimilar.length > 0) {
                    var html = "";
                    for (var i = 0; i < data.listSimilar.length; i++) {
                        html += "<tr id=\"list-tr-" + data.listSimilar[i].Id + "\" SolutionId=" + data.listSimilar[i].SolutionId + ">";
                        // if(data.listSimilar[i].Question.length>100) {
                        // 	html += "<td style='word-break:break-all'><a class='cutText' title='"+data.listSimilar[i].Question+"'>"+data.listSimilar[i].Question.substring(0,100)+"...</a></td>";
                        // } else {
                        html += "<td style='word-break:break-all'>" + data.listSimilar[i].Question + "</td>";
                        //}
                        html += "<td>" + data.listSimilar[i].SimilarCount + "</td>";
                        html += "<td>" + data.listSimilar[i].AddTime + "</td>";
                        html += "<td><a class='addSiToj'><span class='timeTip glyphicon glyphicon-plus' title='添加到句式组'></span></a><a rel=\"" + data.listSimilar[i].Id + "\" title=\"编辑\" class=\"editSim\" style=\"cursor:pointer;\"><i class=\"glyphicon glyphicon-pencil\"></i></a>  <a class=\"m-del\" title=\"删除\" rel=\"" + data.listSimilar[i].Id + "\" style=\"cursor:pointer; \" ><i class=\"glyphicon glyphicon-trash\" ></i></a></td>";
                        html += "</tr>";
                    }
                    $('#similarList').find('tbody').html(html);
                    //相似问法的操作列的删除按钮
                    $('.m-del').on('click', function () {
                        del_similar(this);
                    });
                    $(".addSiToj").click(function () {
                        var $tr = $(this).parents('tr');
                        //var simiId = $tr.attr('id');
                        var solutionId = $tr.attr('solutionId');
                        var simiQue = $tr.attr('id').split('-');
                        var simiQue1 = simiQue[2];
                        var simiId = simiQue1;
                        addSiToj(simiId, solutionId, simiQue1);
                    });
                    //下面开始处理分页
                    var options = {
                        currentPage: data.currentPage,
                        totalPages: data.totlePages,
                        onPageClicked: function (event, originalEvent, type, page) {
                            listSimilar(page);
                        }
                    };
                    setPage('similarPageList', options);
                } else {
                    $('#similarList').find('tbody').html('<tr><td colspan=\"4\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>  当前纪录为空！</td></tr>');
                    $('#similarPageList').html('');
                }
            } else {
                yunNoty(data);
            }
        }
    });
}
var entitysStr = '';
//点击加号添加相似问法
function addSiToj(simiId, solutionId, simiQue1) {
    $.ajax({
        type: "post",
        url: "../../KnSentenceGroup/siToJs",
        data: {"simiId": simiId, "solutionId": solutionId},
        async: true,
        cache: true,
        success: function (data) {
            if (data.status == 0) {
                if (data.flag) {
                    yunNoty(data);
                    $("#similarAddModal").modal('hide');
                } else {
                    $("#similarAddModal").modal('show');
                    for (var i = 0; i < $("#form_entity .entitys").length; i++) {
                        if ($("#form_entity .entitys").eq(i).val() == '') {
                            $("#form_entity .entitys").eq(i).parent().parent().remove();
                        }
                    }
                    if (data.entitySi != '' && data.entitySo != '') {
                        if (data.entitySi != data.entitySo) {
                            $('#similarAddModal .alert').css('display', 'block');
                        } else {
                            $('#similarAddModal .alert').css('display', 'none');
                        }
                        if ($("#form_entity .entityInit1").length > 0 && $("#form_entity .entityInit2").length > 0) {
                            $("#form_entity .entityInit2").val(data.entitySi);
                            $("#form_entity .entityInit1").val(data.entitySo);
                        } else {
                            $("#form_entity").html('<div class="form-group"><label class="col-md-3 control-label">当前相似问法实体<span class="red">&nbsp;*</span></label>' +
                                '<div class="col-md-7" >' +
                                '<textarea class="form-control entitys entityInit2" style="resize:none;">' + data.entitySi + '</textarea>' +
                                '</div></div>' +
                                '<div class="form-group"><label class="col-md-3 control-label">当前标准问题实体<span class="red">&nbsp;*</span></label><div class="col-md-7" >' +
                                '<textarea class="form-control entitys entityInit1" style="resize:none;">' + data.entitySo + '</textarea>' +
                                '<p class="help-block">多个实体用“，”隔开</p></div></div>');
                        }

                    }

                    if (data.entitySi == null || data.entitySi == '') {
                        if ($("#form_entity .entityInit1").length > 0) {
                            $("#form_entity .entityInit1").val(data.entitySo);
                        } else {
                            $("#form_entity").html('<div class="form-group"><label class="col-md-3 control-label">当前相似问法实体<span class="red">&nbsp;*</span></label>' +
                                '<div class="col-md-7" >' +
                                '<textarea class="form-control entitys entityInit2" style="resize:none;">' + data.entitySi + '</textarea>' +
                                '</div></div>' +
                                '<div class="form-group"><label class="col-md-3 control-label">当前标准问题实体<span class="red">&nbsp;*</span></label><div class="col-md-7" >' +
                                '<textarea class="form-control entitys entityInit1" style="resize:none;">' + data.entitySo + '</textarea>' +
                                '<p class="help-block">多个实体用“，”隔开</p></div></div>');
                        }

                    }
                    if (data.entitySo == null || data.entitySo == '') {
                        if ($("#form_entity .entityInit2").length > 0) {
                            $("#form_entity .entityInit2").val(data.entitySi);
                        } else {
                            $("#form_entity").html('<div class="form-group"><label class="col-md-3 control-label">当前相似问法实体<span class="red">&nbsp;*</span></label>' +
                                '<div class="col-md-7" >' +
                                '<textarea class="form-control entitys entityInit2" style="resize:none;">' + data.entitySi + '</textarea>' +
                                '</div></div>' +
                                '<div class="form-group"><label class="col-md-3 control-label">当前标准问题实体<span class="red">&nbsp;*</span></label><div class="col-md-7" >' +
                                '<textarea class="form-control entitys entityInit1" style="resize:none;">' + data.entitySo + '</textarea>' +
                                '<p class="help-block">多个实体用“，”隔开</p></div></div>');
                        }
                    }

                    $("#similarBtn").unbind('click').bind('click', function () {
                        entitysStr = '';
                        var simiQuestion = simiQue1;
                        var sgName = $("#addSentenceForm input[name=sgName]").val();
                        var classId = $("#addSentenceForm input[name=classId]").val();
                        $("#addSentenceForm .entitys").each(function (i) {
                            if ($("#addSentenceForm .entitys").eq(i).val() != '') {
                                entitysStr += $("#addSentenceForm .entitys").eq(i).val();
                            }
                        });
                        simiBtnQuestion(simiQuestion, sgName, solutionId, classId, entitysStr);
                    });
                }
            } else {
                yunNoty(data);
            }
        }
    });
}

function simiBtnQuestion(simiQuestion, sgName, solutionId, classId, entitysStr) {
    $.ajax({
        type: "post",
        url: "../../KnSentencegroupSolution/insertJSZandJS",
        data: {
            'entitySi': $('.entityInit2').val(),
            'entitySo': $('.entityInit1').val(),
            'solutionId': solutionId,
            'sgName': sgName,
            'classId': classId,
            'simiQuestion': simiQuestion
        },
        async: true,
        cache: true,
        success: function (data) {
            if (data.status == 0) {
                yunNoty(data);
                $("#similarAddModal").modal('hide');
            } else {
                yunNoty(data);
            }
            if (data.resultMap1) {
                if (data.resultMap1.status == 0) {
                    yunNoty(data.resultMap1);
                } else {
                    yunNotyError(data.resultMap1.message);
                }
            }
            if (data.resultMap2) {
                if (data.resultMap2.status == 0) {
                    yunNoty(data.resultMap2);
                } else {
                    yunNotyError(data.resultMap2.message);
                }
            }
        }
    })
}
//点击加号实体增加减少时
$('#addSentenceForm').on('click', 'a[name=delentityInput]', function () {
    if ($('#addSentenceForm a[name=delentityInput]').size() > 1) {
        $(this).parent().parent().remove();
    }
});

$('#addSentenceForm').on('click', 'a[name=addentityInput]', function () {
    if ($('#addSentenceForm a[name=addentityInput]').size() < 4) {
        $('#addSentenceForm #form_entity').append(
            '<div class="col-md-8 col-xs-8" style="margin-top: 10px;">' +
            '<div class="col-md-7 col-xs-7" style="padding:0;">' +
            '<input type="text" class="entitys"/>' +
            '</div>' +
            '<div class="col-md-3 col-xs-s m-t-5 m-l-5" style="padding:0;">' +
            ' <a href="javascript:;" name="delentityInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>' +
            '<a href="javascript:;" name="addentityInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a>' +
            '</div></div>');
    }
});

//点击智能句式实体增加减少时
$('#modal-intelTerm').on('click', 'a[name=delentityTioInput]', function () {
    if ($('#modal-intelTerm a[name=delentityTioInput]').size() > 1) {
        $(this).parent().parent().remove();
    } else {

    }
});

$('#modal-intelTerm').on('click', 'a[name=addentityTioInput]', function () {
    if ($('#modal-intelTerm a[name=addentityTioInput]').size() < 4) {
        $('#modal-intelTerm #EntitysList').append('<div class="col-md-12" style="margin-top:10px;padding:0;">' +
            '<div class="col-md-7" style="padding:0;">' +
            '<input type="text" class="entityTio"/>' +
            '</div>' +
            '<div class="col-md-4 m-t-5 m-l-5" style="padding:0;">' +
            ' <a href="javascript:;" name="delentityTioInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>' +
            '<a href="javascript:;" name="addentityTioInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a>' +
            '</div></div>');
    }
});

//点击加号添加句式组树
var hideAddSetting = {
    view: {
        dblClickExpand: false,
        showIcon: false
    },
    data: {
        simpleData: {
            enable: true,
            idKey: "Id",
            pIdKey: "ParentId",
            rootPId: 0
        },
        key: {
            name: "Name"
        }
    },
    async: {
        enable: true,
        url: "../../classes/listClasses?m=11",
        autoParam: ["id"],
        dataFilter: ajaxDataFilter2
    },
    callback: {
        beforeClick: zTreeBeforeClickHide2,
        onClick: function (event, treeId, treeNode, clickFlag) {
            if (treeNode) {
                //点击的时候获取当前树的节点信息
                $('#addSentenceForm #phraseTree').html(treeNode.Name);
                $('#addSentenceForm input[name=classId]').val(treeNode.Id);
                $("#menuContent1").fadeOut("fast");
            }
        },
        onExpand: zTreeOnExpand2
    }
};
function zTreeBeforeClickHide2(treeId, treeNode, clickFlag) {
    return !treeNode.isParent;//当是父节点 返回false 不让选取
}
//渲染树结构
function ajaxDataFilter2(treeId, parentNode, responseData) {
    if (responseData) {
        responseData.list.push({Id: -1, ParentId: 0, Name: "全部分类", open: true});
        return responseData.list;
    }
    return responseData;
};
function zTreeOnExpand2(event, treeId, treeNode) {
    //展开的时候滚动条怎么调用？？？？？？？？？
};
function onBodyDown2(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "menuContent1" || $(event.target).parents("#menuContent1").length > 0)) {
        hideMenu2();
    }
}
function hideMenu2() {
    $("#menuContent1").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown2);
}
function showMenu1() {

    $("#menuContent1").slideDown("fast");
    $("body").bind("mousedown", onBodyDown2);
}
//添加模态框出现加载分类树
$('#similarAddModal').on('show.bs.modal', function () {
    $.fn.zTree.init($("#classTree_phrase"), hideAddSetting, []);
});
$("#phraseTree").off('click').on('click', showMenu1);

//添加相似问法
var flag_sim_add = false;
function addSimilar() {
    var question = $('#similarQuestion').val();
    var dataJSON = {
        solutionId: SolutionId,
        groupId: GroupId,
        question: question
    };
    if (flag_sim_add) {
        return;
    }
    flag_sim_add = true;
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,//不从缓存中去数据
        url: encodeURI('../../question/addSimilarQuestion'),
        data: dataJSON,
        success: function (data) {
            flag_sim_add = false;
            if (data.status == 0) {
                yunNoty(data);
                listSimilar();
                $('#similarQuestion').val('');
                return false;
            } else {
                yunNoty(data);
            }
        }
    });
}

//修改相似问法
$('body').on('click', '.editSim', function () {
    var id = $(this).attr('rel'),
        $tr = $(this).parents('tr'),
        $simTr = $('<tr><td><input type="text" class="form-control ensureSimInput" placeholder="输入修改后的问题" maxlength="200"></td><td style="vertical-align: middle;"><a class="ensureSim" rel="' + id + '" href="javascript:;"><span class="toolTip glyphicon glyphicon-ok" title="确定"></span></a>&nbsp;&nbsp;<a class="cannelSim" href="javascript:;"><span class="toolTip glyphicon glyphicon-remove" title="取消"></span></a></td><td></td><td></td></tr>');

    if (!$tr.next().find('.ensureSim')[0]) {
        $tr.after($simTr);
        $simTr.hide().fadeIn();
        $('.toolTip').tooltip();

        $simTr.find('input').val($('#list-tr-' + id).children().eq(0).html()).focus();
    }
});

var flag_sim_edit = false;
//确认修改相似问法
$('body').on('click', '.ensureSim', function () {
    var id = $(this).attr('rel'),
        $tr = $(this).parents('tr'),
        question = $tr.find('input').val()

    var dataJSON = {
        id: id,
        groupId: GroupId,
        question: question
    };
    if (flag_sim_edit) {
        return;
    }
    flag_sim_edit = true;
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,//不从缓存中去数据
        url: encodeURI('../../question/editSimilarQuestion'),
        data: dataJSON,
        success: function (data) {
            flag_sim_edit = false;
            if (data.status == 0) {
                yunNoty(data);
                $('#list-tr-' + id).children().eq(0).html(question);
                $tr.fadeOut(function () {
                    $(this).remove();
                });
                return false;
            } else {
                yunNoty(data);
            }
        }
    });
});
$('body').on('keypress', '.ensureSimInput', function (event) {
    if (event.keyCode == "13") {
        var self = $(this).parent().next().children('a');
        var id = self.attr('rel'),
            $tr = self.parents('tr'),
            question = $tr.find('input').val()

        var dataJSON = {
            id: id,
            groupId: GroupId,
            question: question
        };
        if (flag_sim_edit) {
            return;
        }
        flag_sim_edit = true;
        $.ajax({
            type: 'post',
            datatype: 'json',
            cache: false,//不从缓存中去数据
            url: encodeURI('../../question/editSimilarQuestion'),
            data: dataJSON,
            success: function (data) {
                flag_sim_edit = false;
                if (data.status == 0) {
                    yunNoty(data);
                    $('#list-tr-' + id).children().eq(0).html(question);
                    $tr.fadeOut(function () {
                        $(this).remove();
                    });
                    return false;
                } else {
                    yunNoty(data);
                }
            }
        });
    }
});

//选择标签模态框
var clickLabelEdit = function () {
    $(".editLabels").click(function () {
        $("#labelTxt").html("");
        $("#labelClassModel").modal("show");
    });
}

$('#labelClassModel').on('show.bs.modal', function () {
    labelList();
});

$("#selLabelBtn").click(function () {     //确定选择标签
    var checkb = $("#labelTxt").find("input[type='checkbox']");
    var label = "";
    var id = "";
    $(checkb).each(function () {
        if ($(this).prop("checked")) {
            label += $(this).parent().parent().next().text() + ",";
            id += $(this).attr("value") + ",";
        }
    });

    label = label.substring(0, label.length - 1);
    id = id.substring(0, id.length - 1);

    var questionId = "";

    var $tr = $(".editLabels").parents('tr');
    questionId = $tr.attr('solutionid');

    $.post("/question/editQueLabel", {
        labelIds: id,
        questionId: questionId
    }, function (json) {
        if (json.status == 0) {
            yunNoty(json);
            $("#labelClassModel").modal("hide");
            if (label == "") {
                $('.editLabels em').text("无");
            }
            else {
                $('.editLabels em').text(label);
            }
        }
        else {
            yunNotyError(json.message);
            $("#labelClassModel").modal("hide");
        }
    });
});


var labelList = function () {     //已有标签列表
    $.post("/label/findAllLabels", {}, function (data) {
        if (data.status == 0) {
            var renderTo = $("#labelTxt");
            $("#labelTxt").html("");
            if (data.list.length > 0) {
                $(data.list).each(function (i, t) {
                    var item = $("<div class='item'></div>").appendTo(renderTo);
                    var checkbDiv = $('<div class="checkbDiv"></div>').appendTo(item);
                    var checkb = $('<input type="checkbox" class="checkb"/>').appendTo(checkbDiv);
                    var label = $("<div class='itemTxt'></div>").text(t.LabelName).appendTo(item);
                    checkb.attr("value", t.Id);
                    item.attr("value", t.Id);
                });
                icheckInit();
                $(".itemTxt").each(function () {
                    $(this).click(function () {
                        var chec = $(this).prev().find(".checkb")
                        if ($(chec).prop("checked")) {
                            $(chec).iCheck("uncheck");
                        }
                        else {
                            $(chec).iCheck("check");
                        }
                    });
                });

                var labelIds = $('.editLabels em').text();
                var labelIdsList = new Array();
                labelIdsList = labelIds.split(",");

                $(".itemTxt").each(function () {
                    if ($.inArray($(this).text(), labelIdsList) >= 0) {
                        $(this).prev().find(".checkb").iCheck("check");
                    }
                });

            }
            else {
                var html = "";
                html += '<div style="width:100%;text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</div>';
                $('#labelTxt').empty().append(html);
            }
        }
    });
}

function setScroll() {  //已有标签滚动条
    $("#labelTxt").slimScroll({
        height: "400px",
        /*alwaysVisible: true,*/
    });
}
setScroll();
$(window).on("resize", setScroll);


//取消修改相似问法
$('body').on('click', '.cannelSim', function () {
    var $tr = $(this).parents('tr');

    $tr.fadeOut(function () {
        $(this).remove();
    });
});

//删除相似问法
function del_similar(obj) {
    $.getJSON('../../question/deleteSimilarQuestion', 'id=' + $(obj).attr('rel') + '&groupId=' + GroupId,
        function (data) {
            if (data.status == 0) {
                $(obj).parents('tr').hide('slow',
                    function () {
                        var page = $('#similarPageList .active a').html();
                        var oT = $('input[name=orderType]').val();
                        if ($('.m-del') != undefined) {
                            if ($('.m-del').size() == 1) page -= 1;
                            if (page < 1) page = 1;
                        }
                        listSimilar(page, oT);
                        yunNoty(data);
                        return false;
                    });
            } else {
                yunNoty(data);
            }
        });
}


//列出流程项
function listFlowItems() {
    var dataJSON = {
        solutionId: SolutionId
    };
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        url: encodeURI('../../flowItem/findFlowItemsById'),
        data: dataJSON,
        success: function (data) {
            var flows = []; // 流程根节点
            var listTemp = {}; // 临时
            if (data.status == 0) {
                var list = data.list;
                if (list != null && list.length > 0) {
                    // 将orderId==1的节点插入flows中
                    list.forEach(function (el) {
                        if (el.OrderId == 1) {
                            flows.push(el);
                        }
                    });
                    flows.forEach(function (el) {
                        ids = [];
                        // 将list转换为树结构
                        genFlow(el.Id, list, listTemp);
                        // 根据listTemp生成树
                        genTree(listTemp, ids);
                        // 重置listTemp
                        listTemp = {};
                    });
                }
            }
        }
    });
}

/*
 * 将list转换为树结构
 * @param id 节点id
 * @param list 剩余的节点
 * @param tree 当前树节点
 */
function genFlow(id, list, tree) {
    var obj = null; // 是否能找到子节点,如果可以找到,赋值给obj
    var start = null; // 通过start起始标记切割流程项数组
    ids.push(id);
    // 在list中找到子节点
    list.forEach(function (eg, i) {
        if (eg.Id == id) {
            obj = eg;
            start = i;
        }
    });
    if (obj) {
        list.splice(start, 1);
        // 树节点增加属性(g6必须的属性)
        tree.children = []; // g6子集
        tree.title = obj.Info; // 流程项名称
        tree.name = getover5(obj.Info); // 显示的流程项名称
        if (obj.Content) {
            var ar = obj.Content.match(/rel="([\\u0000-\\uFFFF]+?)"/g); // 匹配出流程项内容中的子流程信息
            // 匹配id
            if (ar) {
                for (var i = 0; i < ar.length; i++) {
                    var cid = ar[i].slice(5, ar[i].length - 1); // 从匹配到的字符串中取出id
                    // 将richtext中的rel替换为info
                    list.forEach(function (eq) {
                        if (eq.Id == cid) {
                            obj.Content = obj.Content.replace('rel="' + cid + '"', 'rel="' + eq.Info + '"');
                        }
                    });
                    tree.richtext = obj.Content; // 流程项详细
                    var ch = {};
                    // 插入子节点
                    tree.children.push(ch);
                    genFlow(cid, list, ch); // 递归生成子节点
                }
            } else {
                tree.richtext = obj.Content;
            }
        } else {
            tree.richtext = '';
        }
    }
}

// 裁剪标题
function getover5(str) {
    if (str.length <= 5)
        return str;
    return str.substring(0, 5) + '...';
}

$(document).ready(function () {
    $('#btnAddFlowModal').on('click', function () {
        isAddNew = true;
        $('#addFlowModal').modal('show');
    });
    // 保存
    $(document).on('click', '.tree-save', function () {
        $(this).attr('disabled', 'disabled');
        // 通过id查找到需要保存的树
        var tid = $(this).parent().prev().attr('id');
        // 获取树的数据
        var json = trees[tid].treeObj.save().source;
        //去除富文本内容中的<br/>，避免页面内容多次换行
        if(json.richtext.indexOf('<br/>')>-1){
            var tempArr = json.richtext.split('<br/>');
            var tempStr = "";
            $.each(tempArr, function(i, item){
                tempStr += item;
            });
            json.richtext = tempStr;
        }
        var dataJSON = {
            solutionId: SolutionId,
            groupId: GroupId,
            json: JSON.stringify(json),
            ids: (trees[tid].ids ? trees[tid].ids.join(',') : '')
        };
        $.ajax({
            type: 'post',
            datatype: 'json',
            cache: false,
            url: encodeURI('../../flowItem/saveFlowItems'),
            data: dataJSON,
            success: function (data) {
                // 保存后重新加载页面
                yunNoty(data, function () {
                    location.reload();
                });
            }
        });
    });
    // 删除
    $(document).on('click', '.tree-del', function () {
        var self = this;
        $(self).adcCreator(function () {
            someonedel(self);
        });
    });
    // 确认删除
    function someonedel(item) {
        var tid = $(item).parent().prev().attr('id');
        // 通过id删除流程项
        var dataJSON = {
            solutionId: SolutionId,
            groupId: GroupId,
            ids: (trees[tid].ids ? trees[tid].ids.join(',') : '')
        };
        $.ajax({
            type: 'post',
            datatype: 'json',
            cache: false,
            url: encodeURI('../../flowItem/saveFlowItems'),
            data: dataJSON,
            success: function (data) {
                if (data.status == 0) {
                    yunNoty(data);
                    $('#' + tid).parent().remove();
                    delete trees[tid];
                }
            }
        });
    }
});

var infoEditg = null; // 修改的原info
var trees = {}; // 流程集合
var isOpen = false; // 右键菜单是否打开标记
var isAddNew = false; // 是否新建流程
var itemg = null; // 右击选中item
var treeg = null; // 右击选中tree
var ids = []; // 流程id

//添加流程项
function addFlow() {
    var info = $('#info').val();
    var content = richtextAdd.getContent();
    if (content == '' || content == null) {
        yunNotyError('流程项内容不可为空!');
        return false;
    }
    // 一颗空树的基本结构
    var data = {
        "children": [],
        "title": info,
        "name": getover5(info),
        "richtext": content
    };
    // 如果是流程的第一个流程项
    if (isAddNew) {
        genTree(data);
    } else {
        itemg.get('model').children.push({
            "children": [],
            "title": info,
            "name": getover5(info),
            "richtext": content
        });
        // <p><br/></p> 插入一个新的子流程项
        var tailstr = '<p><a href=\"javascript:void(0);\" class=\"wflink\" rel=\"' + info + '\" name=\"wfl_' + info + '\" title=\"点击查看具体信息\">' + info + '</a></p>';
        if (itemg.get('model').richtext) {
            itemg.get('model').richtext = itemg.get('model').richtext.concat(tailstr);
        } else {
            itemg.get('model').richtext = tailstr;
        }
        treeg.update(itemg, itemg.get('model'));
        // 如果是autosize自动缩放画布
        treeg.autoSize();
        var temptreeid = null;
        for (var q in trees) {
            if (trees[q].treeObj == treeg) {
                temptreeid = q;
            }
        }
        treeg.changeSize($('.tree-save').parent().width(), $('#' + temptreeid).height());
        // 清空临时的变量
        itemg = null;
        treeg = null;
    }

    $('#info').val('');
    richtextAdd.setContent('');
    $('#addFlowModal').modal('hide');
}

// 生成一个流程
function genTree(data, tids) {
    var tempId = getRandomInt(10, 10000);
    $('#flowContainer').append('<div class="m-t-10 p-10" style="border:1px solid #ddd;border-radius: 2px;"><div id="' + tempId + '" class="treeCav" ></div><div class="row" style="text-align:center;"><button class="btn btn-primary m-r-5 tree-save">保存</button><button class="btn btn-default tree-del">删除</button></div></div>');

    // 生成一个新的g6树,具体可以参看g6文档-https://antv.alipay.com/g6/doc
    var tree = new G6.Tree({
        id: tempId,
        height: 250,
        //fitView: 'lc',
        fitView: 'autoSize',
        layoutCfg: {
            getHGap: function () {
                return 40;
            },
            getVGap: function () {
                return 10;
            },
        },
    });
    // 把这棵树的信息插入trees数组
    trees[tempId] = {
        id: tempId,
        treeObj: tree
    };
    if (tids) {
        trees[tempId].ids = tids;
    }
    tree.source(data);
    // 生成自定义节点
    tree.node()
        .shape('customNode')
        .label(function (obj) {
            return obj.name;
        })
        .style({
            fillOpacity: 1
        })
        .size(100);
    tree.edge().shape('smoothArrow');
    tree.render();
    // 双击修改事件
    tree.on('dblclick', function (ev) {
        itemg = ev.item;
        treeg = tree;
        edit_flow();
    });
    // 右键菜单
    tree.on('contextmenu', function (ev) {
        ev.domEvent.preventDefault();
        if (G6.Util.isNode(ev.item)) {
            var x = ev.domEvent.clientX,
                y = ev.domEvent.clientY,
                windowWidth = window.innerWidth,
                contextmenu = '<div id="tabContextmenu" class="tab-contextmenu open">' +
                    '<ul class="dropdown-menu">' +
                    '<li><a href="javascript: void(0)" data-btn="addChildNode">创建子节点</a></li>' +
                    '<li><a href="javascript: void(0)" data-btn="removeExceptAct">删除当前节点</a></li>' +
                    '</ul>' +
                    '</div>',
                contextmenuWidth = 180;
            if (isOpen) {
                $('#tabContextmenu').addClass('open');
            } else {
                $('body').after(contextmenu);
                isOpen = true;
            }
            if (windowWidth - x > contextmenuWidth) {
                $('#tabContextmenu').css('left', x);
            } else {
                $('#tabContextmenu').css('right', contextmenuWidth);
            }
            $('#tabContextmenu').css('top', y);
            function closeContextMenu() { // 关闭右键菜单
                $('body').off('click.hide.context');
                $('#tabContextmenu').removeClass('open');
                $(document).off('click.context.remove.pl', '[data-btn="addChildNode"]').off('click.context.remove.sing', '[data-btn="removeExceptAct"]');
            }

            $(document).on('click.context.remove.pl', '[data-btn="addChildNode"]', function () { // 创建子节点
                isAddNew = false;
                $('#addFlowModal').modal('show');
                var newModel = ev.item.get('model');
                itemg = ev.item;
                treeg = tree;
                closeContextMenu();
            });
            $(document).on('click.context.remove.sing', '[data-btn="removeExceptAct"]', function () {
                // 删除父级富文本中的超链接
                itemg = ev.item;
                treeg = tree;
                infoEditg = itemg.get('model').title;
                var pid = getParentId(itemg.get('model').id, treeg.save().source);
                var itemp = treeg.find(pid);
                if (itemp) {
                    // 匹配出流程项内容中的子流程信息并删除
                    var richtexttemp = itemp.get('model').richtext;
                    var regex = new RegExp('<a href="javascript:void\\(0\\);" class="wflink" rel="' + infoEditg + '" name="wfl_([\\u0000-\\uFFFF]+?)" title="点击查看具体信息">([\\u0000-\\uFFFF]+?)<\\/a>', 'g');
                    itemp.get('model').richtext = richtexttemp.replace(regex, '');
                    treeg.update(itemp, itemp.get('model'));
                    // 删除当前节点
                    tree.remove(ev.item.get('model'));
                } else {
                    yunNotyError('流程第一项不可删除!');
                }
                // 清空临时变量
                itemg = null;
                treeg = null;
                closeContextMenu();
            });
            $('body').on('click.hide.context', closeContextMenu);
        }
    });
}

// 获取父级id
function getParentId(id, obj) {
    if (id == obj.id) {
        return null;
    }
    var pid = obj.id;
    if (obj.children) {
        for (var i = 0; i < obj.children.length; i++) {
            // 找到子节点和自身id相同的节点,就是父节点
            if (obj.children[i].id == id) {
                return pid;
            } else {
                var pp = getParentId(id, obj.children[i]);
                if (pp) {
                    return pp;
                }
            }
        }
    }
}

//修改流程项
function edit_flow() {
    if(richtextEdit.queryCommandState('source') == 1){
        richtextEdit.execCommand('source');
    }

    infoEditg = itemg.get('model').title;
    $('#infoEdit').val(itemg.get('model').title);
    richtextEdit.setContent(itemg.get('model').richtext || '');
    $('#editFlowModal').modal('show');
}

// 修改流程
function editFlow() {
    // 修改自己
    var info = $('#infoEdit').val();
    var content = richtextEdit.getContent();
    if (content == '' || content == null) {
        yunNotyError('流程项内容不可为空!');
        return false;
    }
    // 修改自己的属性
    itemg.get('model').title = info;
    itemg.get('model').name = getover5(info);
    itemg.get('model').richtext = content;
    treeg.update(itemg, itemg.get('model'));
    // 修改父级
    if (itemg.get('model').id != treeg.save().source.id) {
        // 通过id查找到需要修改的树
        var pid = getParentId(itemg.get('model').id, treeg.save().source);
        var itemp = treeg.find(pid);
        // 更新父节点的详细信息
        var richtexttemp = itemp.get('model').richtext;
        // 匹配和替换父节点的详细信息中的子节点信息
        var regex = new RegExp('<a href="javascript:void\\(0\\);" class="wflink" rel="' + infoEditg + '" name="wfl_([\\u0000-\\uFFFF]+?)" title="点击查看具体信息">([\\u0000-\\uFFFF]+?)<\\/a>', 'g');
        var arr = regex.exec(richtexttemp);
        if (arr) {
            var oldstr = '<a href="javascript:void(0);" class="wflink" rel="' + infoEditg + '" name="wfl_' + arr[1] + '" title="点击查看具体信息">' + arr[2] + '</a>';
            // var newstr = '<a href="javascript:void(0);" class="wflink" rel="'+info+'" name="wfl_'+info+'" title="点击查看具体信息">'+arr[1]+'</a>';
            var newstr = '<a href="javascript:void(0);" class="wflink" rel="' + info + '" name="wfl_' + info + '" title="点击查看具体信息">' + info + '</a>';
            richtexttemp = richtexttemp.replace(oldstr, newstr);
            itemp.get('model').richtext = richtexttemp;
            treeg.update(itemp, itemp.get('model'));
        }
    }
    itemg = null;
    treeg = null;

    richtextEdit.setContent('');
    $('#editFlowModal').modal('hide');
}

// 随机生成id
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 注册定制节点,具体可以参看g6文档-https://antv.alipay.com/g6/doc
G6.registNode('customNode', {
    draw: function (cfg, group) {
        return group.addShape('rect', {
            attrs: {
                x: cfg.x - cfg.size * 0.5,
                y: cfg.y - cfg.size * 0.15,
                width: cfg.size,
                height: cfg.size * 0.3,
                fill: 'rgba(52,142,226,1)',
                stroke: 'rgba(52,142,226,1)',
                radius: 3
            }
        });
    },
    afterDraw: function (cfg, group, keyShape) {
        var origin = cfg.origin;
        var labelAttrs = {
            text: origin.name,
            fill: '#fff',
            textAlign: 'center',
            textBaseline: 'middle',
            fontSize: 15,
            x: cfg.x,
            y: cfg.y,
        };
        group.addShape('text', {
            attrs: labelAttrs,
        });
    }
});
;