var iconCount = 1;
var flag = false;
var queType = 1;//问题类型
var configStatus = 0;//自动手动，默认自动
//获取配置的功能项
function getParam(urlId) {
    var sear = new RegExp('http://');
    if (sear.test(urlId)) {
        urlId = '';
    }
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,//不从缓存中去数据
        url: encodeURI('../../ChatFormConfig/listChatForm'),
        success:
            function (data) {
                if (data.status === 0) {
                    var html = '';
                    html += '<select class="selectpicker">';
                    if (data.List.length > 0) {
                        for (var i = 0; i < data.List.length; i++) {
                            if (data.List[i].Name == '快捷服务') {
                                $('.kuaijiefuwu').val(data.List[i].Id);
                                continue;
                            }
                            if (data.List[i].Name == '推荐资讯') {
                                $('#recommendForm1 input[name=configId]').val(data.List[i].Id);
                                $('#recommendForm2 input[name=configId]').val(data.List[i].Id);
                                continue;
                            }
                            //if(data.List[i].Name=='新增问题'){
                            //html += '<option value="'+data.List[i].Type+'" rel="'+data.List[i].Id+'">常见问题</option>';
                            //}else{
                            html += '<option value="' + data.List[i].Type + '" rel="' + data.List[i].Id + '">' + data.List[i].Name + '</option>';
                            //}
                        }
                        $('#configId').val(data.List[1].Id);
                        queConfig(data.List[1].Id);
                        //列出问题列表
                        //getParamCon(data.List[1].Id);
                    }
                    html += '</select>';
                    $('#param_con').html(html);
                    //快捷服务列表
                    kuaiList();
                    //推荐资讯列表
                    recommendList();
                    //下拉列表
                    $('.selectpicker').selectpicker({
                        style: 'btn-primary',
                        width: '100px'
                    });
                    //在常见问题和热门问题之间切换
                    $('#param_con .selectpicker').on('change', function () {
                        var curValue = $(this).val();
                        var configid = $(this).find('option[value=' + $(this).val() + ']').attr('rel');
                        $('#configId').val(configid);
                        queConfig(configid);
                        //getParamCon(configid);
                    });
                } else {
                    yunNoty(data);
                }
            }
    });
}

function queConfig(configid) {
    $.ajax({
        type: "get",
        url: "../../ChatFormConfigQuestion/getQuestionConfig?configId=" + configid,
        async: true,
        cache: false,
        success: function (data) {
            var ChatLinkId, GroupId, LabelId = '';
            if (data.status == 0) {
                if (data.config) {
                    if (data.config.ChatLinkId == null) {
                        ChatLinkId = null;
                        $("#knowClassify").val('默认不选');
                    } else {
                        ChatLinkId = data.config.ChatLinkId;
                        $("#knowClassify").val(data.config.ChatLinkName);
                        $("#knowsIds").val(data.config.ChatLinkId);
                    }
                    if (data.config.GroupId == null) {
                        GroupId = null;
                        $("#queClassify").val('默认全选');
                    } else {
                        GroupId = data.config.GroupId;
                        $("#queClassify").val(data.config.GroupName);
                        $("#ClassesIds").val(data.config.GroupId);
                    }
                    if (data.config.LabelId == null) {
                        LabelId = null;
                        $("#labelClassify").val('默认不选');
                    } else {
                        LabelId = data.config.LabelId;
                        $("#labelClassify").val(data.config.LabelName);
                        $("#labelesIds").val(data.config.LabelId);
                    }
                    getParamCon(configid, ChatLinkId, GroupId, LabelId);
                } else {
                    ChatLinkId = null, GroupId = null, LabelId = null;
                    getParamCon(configid, ChatLinkId, GroupId, LabelId);
                }
            }
        }
    });
}

/*==========问题分类树========*/
var quesetting = {
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
            checked: 'checked',
            name: "Name"
        }
    },
    check: {
        enable: true,
        chkStyle: 'checkbox',
        chkDisabled: false,
        chkboxType: { "Y": "ps", "N": "ps" }
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
        onAsyncSuccess: zTreeOnAsyncSuccess,
        onCheck: zTreeOnCheck
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
}
function zTreeBeforeClick(treeId, treeNode, clickFlag) {
    return !treeNode.isParent; //当是父节点 返回false不让选取
}
function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
    //var treeObj = $.fn.zTree.getZTreeObj("treeQueClass");
    CheckAllNodes();
}

function zTreeOnCheck(event, treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj('treeQueClass');
    Nodes = zTree.getCheckedNodes();
    var nodes = zTree.getNodes();
    var nodesChild = nodes[0].children;
    var nodesArr = [];
    for (var i in nodesChild) {
        var checked = nodesChild[i].checked;
        if (!checked) {
            zTree.checkNode(nodes[0], false);
        }
    }
    var vName = "", vId = '';
    for (var i = 0; i < Nodes.length; i++) {
        vName += Nodes[i].Name + ",";
        vId += Nodes[i].Id + ",";
    }
    $('#QuestionClassModel [name=queName]').val(vName.substring(0, vName.length - 1));
    $('#QuestionClassModel [name=queId]').val(vId.substring(0, vId.length - 1));
}
function CheckAllNodes() {
    var treeObj = $.fn.zTree.getZTreeObj("treeQueClass");
    var nodes = treeObj.getNodes();
    var nodesChild = nodes[0].children;
    var nodesArr = [];
    var ClassesIds = $("#ClassesIds").val();
    var ClassesIdsList = new Array();
    ClassesIdsList = ClassesIds.split(",");
    for (var i = 0; i < ClassesIdsList.length; i++) {
        var node = treeObj.getNodeByParam('Id', ClassesIdsList[i]);
        treeObj.checkNode(node, true, true);//指定选中ID的节点  
    }
    for (var i in nodesChild) {
        var checked = nodesChild[i].checked;
        if (!checked) {
            treeObj.checkNode(nodes[0], false);
        }
    }
    if ($("#queClassify").val() == '默认全选') {
        treeObj.checkAllNodes(true);
    }
}
function filterP(node) {
    return (node.isParent == false);
}

/*==========选择问题分类模态窗==========*/
$('.treeDivModal').slimScroll({
    height: '400px'
});
$('#QuestionClassModel').on('show.bs.modal', function () {
    $.fn.zTree.init($("#treeQueClass"), quesetting, []);
});
$('#QuestionClassModel').on('hide.bs.modal', function () {
    $('#QuestionClassModel [name=treeName]').val('');
    $('#QuestionClassModel [name=treeId]').val('');
});
$('#queClassify').on('click', function () {
    $('#QuestionClassModel').modal('show');
});
$('#queClassBtn').on('click', function () {
    zTreeOnCheck();
    $('#queClassify').val($('#QuestionClassModel [name=queName]').val());
    $('input[name=ClassesIds]').val($('#QuestionClassModel [name=queId]').val());
    saveQuestion();
    getParamCon($('#configId').val(), $("#knowsIds").val(), $('#QuestionClassModel [name=queId]').val(), $("#labelesIds").val());
    $('#QuestionClassModel').modal('hide');
});

/*===========选择标签模态框=============*/
$("#labelClassify").click(function () {
    $("#labelTxt").html("");
    $("#LabelClassModel").modal("show");
});
$('#LabelClassModel').on('show.bs.modal', function () {
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
    if ($(checkb).length == $(checkb).prop('checked').length) {
        id = null;
    }
    $("#labelClassify").val(label.substring(0, label.length - 1));
    $("#labelesIds").attr("value", id.substring(0, id.length - 1));
    saveQuestion();
    getParamCon($('#configId').val(), $("#knowsIds").val(), $('#QuestionClassModel [name=queId]').val(), $("#labelesIds").val());
    $("#LabelClassModel").modal("hide");
});
var labelList = function () {     //已有标签列表
    $.post("/label/findAllLabels", {
    }, function (data) {
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

                var labelIds = $("#labelesIds").attr("value");
                var labelIdsList = new Array();
                labelIdsList = labelIds.split(",");
                $(".checkb").each(function (i, item) {
                    if ($.inArray($(item).attr("value"), labelIdsList) >= 0) {
                        $(item).iCheck("check");
                    }
                });
                if ($("#labelClassify").val() == '默认不选') {
                    $("#labelTxt .checkb").iCheck('uncheck');
                }
            }
            else {
                var html = "";
                html += '<div style="width:100%;text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</div>';
                $('#labelTxt').empty().append(html);
            }
        }
    });
}

/*============选择知识集模态框===========*/
$("#knowClassify").click(function () {
    $("#knowTxt").html("");
    $("#KnowClassModel").modal("show");
});
$('#KnowClassModel').on('show.bs.modal', function () {
    knowList();
});
$("#KnowClassBtn").click(function () {     //确定选择知识集
    var checkb = $("#knowTxt").find("input[type='checkbox']");
    var know = "";
    var id = "";
    $(checkb).each(function (i) {
        if ($(this).prop("checked")) {
            know += $(this).parent().parent().next().text() + ",";
            id += $(this).attr("value") + ",";
        }
    });
    if ($(checkb).length == $(checkb).prop('checked').length) {
        id = null;
    }
    $("#knowClassify").val(know.substring(0, know.length - 1));
    $("#knowsIds").attr("value", id.substring(0, id.length - 1));
    saveQuestion();
    getParamCon($('#configId').val(), $("#knowsIds").val(), $('#QuestionClassModel [name=queId]').val(), $("#labelesIds").val());
    $("#KnowClassModel").modal("hide");
});
var knowList = function () {     //已有知识集列表
    $.post("/ChatLink/listChatLink", {
    }, function (data) {
        if (data.status == 0) {
            var renderTo = $("#knowTxt");
            $("#knowTxt").html("");
            if (data.list.length > 0) {
                $(data.list).each(function (i, t) {
                    var item = $("<div class='item'></div>").appendTo(renderTo);
                    var checkbDiv = $('<div class="checkbDiv"></div>').appendTo(item);
                    var checkb = $('<input type="checkbox" class="checkb"/>').appendTo(checkbDiv);
                    var know = $("<div class='itemTxt'></div>").text(t.ThemeName).appendTo(item);
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
                var labelIds = $("#knowsIds").attr("value");
                var labelIdsList = new Array();
                labelIdsList = labelIds.split(",");
                $(".checkb").each(function (i, item) {
                    if ($.inArray($(item).attr("value"), labelIdsList) >= 0) {
                        $(item).iCheck("check");
                    }
                });
                if ($("#knowClassify").val() == '默认不选') {
                    $("#knowTxt .checkb").iCheck('uncheck');
                }
            }
            else {
                var html = "";
                html += '<div style="width:100%;text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</div>';
                $('#knowTxt').empty().append(html);
            }
        }
    });
}

/*点击保存*/
function saveQuestion() {
    if ($("#param_con .selectpicker .pull-left").text() == '新增问题') {
        queType = 1;
    } else {
        queType = 2;
    }
    $.ajax({
        type: "get",
        url: "/ChatFormConfigQuestion/saveQuestionConfig",
        data: {
            'configId': $('#configId').val(),
            'ChatlinkId': $("#knowsIds").val(),
            'groupId': $('input[name=ClassesIds]').val(),
            'labelId': $("#labelesIds").val(),
            'queType': queType,
            'configStatus': configStatus
        },
        async: true,
        cache: false,
        success: function (data) {

        }
    });
}

/***********************配置问题 START***********************/
//列出配置问题
function getParamCon(configid, ChatLinkId, GroupId, LabelId) {
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,//不从缓存中去数据
        url: encodeURI('../../ChatFormConfigQuestion/listQuestion?pageSize=100&configId=' + configid),
        data: {
            'ChatlinkIds': ChatLinkId,
            'groupIds': GroupId,
            'labelIds': LabelId
        },
        success: function (data) {
            if (data.status === 0) {
                if (data.List) {
                    if (data.List.length > 0) {
                        var html = [];
                        for (var i = 0; i < data.List.length; i++) {
                            $('.currPage').html(i + 1);
                            html.push('<tr>');
                            html.push('<td>' + data.List[i].Question + '</td>');
                            html.push('<td><a Id=\"' + data.List[i].Qid + '\" SolId=\"' + data.List[i].SolutionId + '\" title=\"删除\" name=\"deleteIcon\" style=\"cursor:pointer;\"><i class=\"glyphicon glyphicon-trash\"></i></a></td>');
                            html.push('</tr>');
                        }
                        $('#QuestionList').find('tbody').html(html.join(''));
                        $('a[name=deleteIcon]').on('click', function () {
                            var self = this;
                            $(self).adcCreator(function () {
                                delQuestion(self);
                            });
                        });
                    } else {
                        $('#QuestionList').find('tbody').html('<tr><td colspan=\"2\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>  当前纪录为空！</td></tr>');
                    }
                } else {
                    $('#QuestionList').find('tbody').html('<tr><td colspan=\"2\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>  当前纪录为空！</td></tr>');
                }
                var s = [];
                //自动配置
                if (data.CurrentStatus == 0) {
                    $('#QuestionList').find('thead tr th:eq(1)').text('');
                    for (var i = 0; i < $('#QuestionList').find('tbody tr').length; i++) {
                        $('#QuestionList').find('tbody tr').eq(i).find('td:eq(1)').text('');
                    }
                    configStatus = 0;
                    s.push('<a href="#" class="btn btn-danger disabled" data-id="switchery-state-text">自动</a>&nbsp;&nbsp;&nbsp;');
                    s.push('<input type="checkbox" data-render="switchery" data-theme="blue" data-change="check-switchery-state-text" value="0" />');
                    $('#btnAuto').html(s.join(''));
                    //处理添加问题和保存两个按钮
                    if ($('#addProblemBtn').length <= 0) {
                        $('#param_con').append('<a data-toggle="modal" class="btn btn-primary" id="addProblemBtn" href="#comqueModal" style="display: none; margin-bottom: 10px; margin-left:10px;">添加问题</a>');
                        $('#param_con').append('<a class="btn btn-warning" id="saveProblemBtn" style="display: none; margin-bottom: 10px; margin-left:10px;" onclick="saveOption()">保存问题配置</a>');
                    } else if (!$('#addProblemBtn').is(':hidden')) {
                        $('#addProblemBtn').hide();
                        $('#saveProblemBtn').hide();
                    }
                    $('#showDiv').show();
                    $('#QuestionList').show();
                    renderSwitcher();
                    $('[data-change="check-switchery-state-text"]').on("change", function () {
                        var status = $(this).prop("checked") ? 1 : 0;
                        changeConfigModeQue(status);
                    });
                    //手动配置
                } else if (data.CurrentStatus == 1) {
                    $('#QuestionList').find('thead tr th:eq(1)').text('操作');
                    configStatus = 1;
                    s.push('<a href="#" class="btn btn-success disabled" data-id="switchery-state-text">手动</a>&nbsp;&nbsp;&nbsp;');
                    s.push('<input type="checkbox" data-render="switchery" data-theme="blue" data-change="check-switchery-state-text" value="1" checked />');
                    $('#btnAuto').html(s.join(''));
                    //处理添加问题和保存两个按钮
                    if ($('#addProblemBtn').length <= 0) {
                        $('#param_con').append('<a data-toggle="modal" class="btn btn-primary" id="addProblemBtn" href="#comqueModal" style="display: inline-block; margin-bottom: 10px; margin-left:4px;">添加问题</a>');
                        $('#param_con').append('<a class="btn btn-warning" id="saveProblemBtn" style="display: inline-block; margin-bottom: 10px; margin-left:4px;" onclick="saveOption()">保存问题配置</a>');
                    } else if ($('#addProblemBtn').is(':hidden')) {
                        $('#addProblemBtn').show();
                        $('#saveProblemBtn').show();
                    }
                    $('#showDiv').hide();
                    $('#QuestionList').show();
                    renderSwitcher();
                    $('[data-change="check-switchery-state-text"]').on("change", function () {
                        var status = $(this).prop("checked") ? 1 : 0;
                        changeConfigModeQue(status);
                    });

                }
            }
        }
    });
}

//切换功能开关
function changeConfigModeQue(opened) {
    if (opened != 0 && opened != 1) {
        return;
    }
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,//不从缓存中去数据
        url: encodeURI('../../ChatFormConfig/alterChatFormStatus?configId=' + $('#configId').val()),
        data: 'status=' + opened,
        success:
            function (data) {
                if (data.status === 0) {
                    if (opened == 1) {
                        $('[data-id="switchery-state-text"]').text('手动');
                        $('[data-id="switchery-state-text"]').addClass('btn-success');
                        $('[data-id="switchery-state-text"]').removeClass('btn-danger');
                        $('#QuestionList').show();
                        $('#addProblemBtn').show();
                        $('#saveProblemBtn').show();
                        $('#showDiv').hide();
                        getParamCon($('#configId').val());
                    } else {
                        $('[data-id="switchery-state-text"]').text('自动');
                        $('[data-id="switchery-state-text"]').removeClass('btn-success');
                        $('[data-id="switchery-state-text"]').addClass('btn-danger');
                        $('#QuestionList').show();
                        $('#addProblemBtn').hide();
                        $('#saveProblemBtn').hide();
                        $('#showDiv').show();
                        var ChatLinkId = $("#knowsIds").val(), GroupId = $('#QuestionClassModel [name=queId]').val(), LabelId = $("#labelesIds").val();
                        queConfig($('#configId').val());
                        getParamCon($('#configId').val(), ChatLinkId, GroupId, LabelId);
                    }
                    yunNoty(data);
                } else {
                    yunNoty(data);
                }
            }
    });
}
//模态窗确认按钮onclick
function getQueId() {
    var ids = getSelectedIds_aQue();
    if (ids == '') {
        yunNotyError('请选择一个问题');
        return;
    }
    var sds = getSelectedSolutionIds_aQue();
    var question = $('#queDiv #list-tr-' + ids).children('td').eq(1).html();
    $('#comqueModal').modal('hide');
    addQuestion(ids, sds, question);
    $('#xswfIndex').val('');
}
//新增问题
function addQuestion(ids, sds, question) {
    var configId = $('#configId').val();
    var qIds = '';
    var sIds = '';
    var length = $('#QuestionList a[name=deleteIcon]').length;
    if (length > 99) {
        yunNotyError('问题最多能配置100个');
        return;
    }
    //不发起请求，只是给表格增加一行
    //$('.currPage').html(length+1);
    var html = [];
    html.push('<tr>');
    html.push('<td>' + question + '</td>');
    html.push('<td><a Id=\"' + ids + '\" SolId=\"' + sds + '\" title=\"删除\" name=\"deleteIcon\" style=\"cursor:pointer;\"><i class=\"glyphicon glyphicon-trash\"></i></a></td>');
    html.push('</tr>');
    if ($('#QuestionList').html().indexOf('glyphicon-warning-sign') >= 0) {
        $('#QuestionList').find('tbody').html(html.join(''));
    } else {
        $('#QuestionList').find('tbody').append(html.join(''));
    }
    $('a[name=deleteIcon]').off('click').on('click', function () {
        var self = this;
        $(self).adcCreator(function () {
            delQuestion(self);
        });
    });
}

//删除问题
function delQuestion(obj) {
    var configId = $('#configId').val();
    var qIds = '';
    var sIds = '';
    var length = $('#QuestionList a[name=deleteIcon]').length;
    if (length < 2) {
        yunNotyError('问题最少需配置1个');
        return;
    }
    $(obj).parents('tr').hide('slow', function () {
        $(this).remove();
    });
}

//保存问题
function saveOption() {
    var configId = $('#configId').val();
    var qIds = '';
    var sIds = '';
    $('#QuestionList').find('a[name=deleteIcon]').each(function () {
        qIds += $(this).attr('Id') + ',';
        sIds += $(this).attr('SolId') + ',';
    });
    if (qIds.length > 0) {
        qIds = qIds.substring(0, qIds.length - 1);
    }
    if (sIds.length > 0) {
        sIds = sIds.substring(0, sIds.length - 1);
    }
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,//不从缓存中去数据
        url: encodeURI('../../ChatFormConfigQuestion/addQuestion?configId=' + configId),
        data: 'qIds=' + qIds + '&solutionIds=' + sIds,
        success:
            function (data) {
                if (data.status === 0) {
                    yunNoty({ status: "0", message: "保存问题配置成功" });
                    getParamCon(configId);
                } else {
                    yunNoty(data);
                }
            }
    });
}

//switchery 初始化
var green = "#00acac",
    red = "#ff5b57",
    blue = "#348fe2",
    purple = "#727cb6",
    orange = "#f59c1a",
    black = "#2d353c";
var renderSwitcher = function () {
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

function filterP(node) {
    return (node.isParent == false);
}
//树的初始化START
var hidesetting = {
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
        onClick: function (event, treeId, treeNode, clickFlag) {
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            Nodes = treeObj.getSelectedNodes();
            $('#queSel').html(Nodes[0].Name);
            var array = treeObj.getNodesByFilter(filterP, false, treeNode);
            if (array.length > 0) {
                var groupId = '';
                for (var i in array) {
                    groupId += (array[i].Id) + ',';
                }
                $('.selQueX').val(groupId);
            } else {
                $('.selQueX').val(treeNode.Id);
            }
            $("#menuContent").fadeOut("fast");
            if ($('#queManualQue').hasClass('active')) {
                sQue(1);
            } else if ($('#queManualFlow').hasClass('active')) {
                fQue(1);
            }
        },
        onAsyncSuccess: function (event, treeId, treeNode, msg) {
            var treeObj = $.fn.zTree.getZTreeObj(treeId);
            var array = treeObj.getNodesByFilter(filterP);
            if (array.length > 0) {
                var groupId = '';
                for (var i in array) {
                    groupId += (array[i].Id) + ',';
                }
                $('.selQueX').val(groupId);
            } else {
                $('.selQueX').val(treeNode.Id);
            }
            if ($('#queManualQue').hasClass('active')) {
                sQue(1);
            } else if ($('#queManualFlow').hasClass('active')) {
                fQue(1);
            }
        },
        beforeClick: hidezTreeBeforeClick,
        onExpand: function () {
            //yun_scroll();
        }
    }
};
//格式化一步获取的json数据
function ajaxDataFilter(treeId, parentNode, responseData) {
    if (responseData) {
        responseData.list.push({ Id: 0, ParentId: 0, Name: "全部分类", open: true });
        return responseData.list;
    }
    return responseData;
}
function hidezTreeBeforeClick(treeId, treeNode, clickFlag) {
    //return !treeNode.isParent;//当是父节点 返回false 不让选取
    if (treeNode.isParent == true) {
        $('#search_Que input[name=isLeaf]').val(0);
    } else {
        $('#search_Que input[name=isLeaf]').val(1);
    }
}

function zTreeBeforeClick(treeId, treeNode, clickFlag) {
    return !treeNode.isParent;//当是父节点 返回false不让选取
}

//树的初始化END

/**
* 获取智能推荐选中问题的Id
* @param {null}
* @return {Integer} 选中的Id
*/
function getSelectedIds_aQue() {
    var cboxs = null;
    if ($('#queManualQue').hasClass('active')) {
        cboxs = document.getElementsByName('row_sel1');
    }
    else if ($('#queManualFlow').hasClass('active')) {
        cboxs = document.getElementsByName('row_sel2');
    }
    if (typeof cboxs == "undefined") {
        return -1;
    }
    var inputvalue = "";
    for (var i = 0; i < cboxs.length; i++) {
        if (cboxs[i].checked === true) {
            inputvalue = cboxs[i].value;
        }
    }
    return inputvalue;
}
/**
* 获取智能推荐选中流程的Id
* @param {null}
* @return {Integer} 选中的Id
*/
function getSelectedSolutionIds_aQue() {
    var cboxs = null;
    if ($('#queManualQue').hasClass('active')) {
        cboxs = document.getElementsByName('row_sel1');
    }
    else if ($('#queManualFlow').hasClass('active')) {
        cboxs = document.getElementsByName('row_sel2');
    }
    if (typeof cboxs == "undefined") {
        return -1;
    }
    var inputvalue = "";
    for (var i = 0; i < cboxs.length; i++) {
        if (cboxs[i].checked === true) {
            inputvalue = cboxs[i].getAttribute('solutionid');
        }
    }
    return inputvalue;
}

//智能推荐模态窗中的树
function showMenu() {
    var cityObj = $("#queSel");
    var cityOffset = $("#queSel").offset();
    $("#menuContent").slideDown("fast");
    $("body").bind("mousedown", onBodyDown);
    $('#classTree').slimScroll({
        height: '300px'
    });
}
function hideMenu() {
    $("#menuContent").fadeOut("fast");
    $("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
    if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
        hideMenu();
    }
}

//添加问题模态框显示
function showQueModal(obj) {
    $('#xswfIndex').val($(obj).attr('rel'));
    $('#comqueModal').modal('show');
}
$('#comqueModal').on('show.bs.modal', function () {
    $.fn.zTree.init($("#treeHide"), hidesetting, []);
    //$('#queSel').html('');
    hideMenu();
});

//智能推荐问题模态窗列表
function sQue(pageNo) {
    if (!pageNo) pageNo = 1;
    $('#ansList').tableAjaxLoader2(2);
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,//不从缓存中去数据
        url: encodeURI('../../question/getQueListByMode?pageSize=8&pageNo=' + pageNo + '&solutionType=1'),
        data: $("#search_Que").serialize(),
        success:
            function (data) {
                if (data.status === 0) {
                    if (data.questionList.length > 0) {
                        var html = "";
                        var existIds = [];
                        $('#queManual').find('input[name=postQueInput]').each(function () {
                            existIds.push($(this).attr('rel') * 1);
                        });
                        for (var i = 0; i < data.questionList.length; i++) {
                            //去除禁用列表中已经存在的问题
                            if ($.inArray(data.questionList[i].Id, existIds) >= 0) {
                                html += "<tr id=\"list-tr-" + data.questionList[i].Id + "\">";
                                html += "<td><input disabled='' type=\"radio\" name=\"row_sel1\" value=\"" + data.questionList[i].Id + "\" solutionId=\"" + data.questionList[i].SolutionId + "\"></td>";
                                if (data.questionList[i].AnswerStatus == -4) {
                                    html += "<td class=\"dueTd\">" + data.questionList[i].Question + "<a class=\"btn btn-xs btn-danger m-l-5\">已过期</a></td>";
                                } else {
                                    html += "<td style='word-break: break-all;'>" + data.questionList[i].Question + "</td>";
                                }
                                html += "</tr>";
                            } else {
                                html += "<tr id=\"list-tr-" + data.questionList[i].Id + "\">";
                                html += "<td><input type=\"radio\" name=\"row_sel1\" value=\"" + data.questionList[i].Id + "\" solutionId=\"" + data.questionList[i].SolutionId + "\"></td>";
                                if (data.questionList[i].AnswerStatus == -4) {
                                    html += "<td class=\"dueTd\">" + data.questionList[i].Question + "<a class=\"btn btn-xs btn-danger m-l-5\">已过期</a></td>";
                                } else {
                                    html += "<td style='word-break: break-all;'>" + data.questionList[i].Question + "</td>";
                                }
                                html += "</tr>";
                            }
                        }
                        $('#ansList').find('tbody').html(html);
                        // $('#ansList td').click(function() {
                        // $(this).parent().find('input[name=row_sel1]').attr("checked",'true');
                        // });
                        icheckInit();
                        $('#timePicker').on('ifChecked', function () {
                            $('#dateTime').show();
                        }).on('ifUnchecked', function () {
                            $('#dateTime').hide();
                            $('#ansRuleForm [name=StartTime]').val('');
                            $('#ansRuleForm [name=EndTime]').val('');
                        });
                        $('#ansList td').click(function () {
                            $(this).parent().find('input[name=row_sel1]').iCheck('check');
                        });
                        //下面开始处理分页
                        var options = {
                            currentPage: data.currentPage,
                            totalPages: data.totlePages,
                            onPageClicked: function (event, originalEvent, type, page) {
                                sQue(page);
                            }
                        };
                        setPage('quepageList', options);
                    } else {
                        if ($('#search_Que input[name=question]').val() !== '') {
                            $('#ansList').find('tbody').html('<tr><td colspan=\"2\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;搜索结果为空！</td></tr>');
                        } else {
                            $('#ansList').find('tbody').html('<tr><td colspan=\"2\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
                        }
                        $('#quepageList').html('');
                    }
                } else {
                    yunNoty(data);
                }
            }
    });
}

//智能推荐流程模态窗列表
function fQue(pageNo) {
    if (!pageNo) pageNo = 1;
    $('#flowList').tableAjaxLoader2(2);
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,//不从缓存中去数据
        url: encodeURI('../../question/getQueListByMode?pageSize=8&pageNo=' + pageNo + '&solutionType=2'),
        data: $("#search_Que").serialize(),
        success:
            function (data) {
                if (data.status === 0) {
                    if (data.questionList.length > 0) {
                        var html = "";
                        var existIds = [];
                        $('#queManual').find('input[name=postQueInput]').each(function () {
                            existIds.push($(this).attr('rel') * 1);
                        });
                        for (var i = 0; i < data.questionList.length; i++) {
                            //禁用列表中已经存在的问题
                            if ($.inArray(data.questionList[i].Id, existIds) >= 0) {
                                html += "<tr id=\"list-tr-" + data.questionList[i].Id + "\">";
                                html += "<td><input type=\"radio\" name=\"row_sel2\" value=\"" + data.questionList[i].Id + "\" solutionId=\"" + data.questionList[i].SolutionId + "\"></td>";
                                if (data.questionList[i].AnswerStatus == -4) {
                                    html += "<td class=\"dueTd\">" + data.questionList[i].Question + "<a class=\"btn btn-xs btn-danger b-l-5\">已过期</a></td>";
                                } else {
                                    html += "<td style='word-break: break-all;'>" + data.questionList[i].Question + "</td>";
                                }
                                html += "</tr>";
                            } else {
                                html += "<tr id=\"list-tr-" + data.questionList[i].Id + "\">";
                                html += "<td><input type=\"radio\" name=\"row_sel2\" value=\"" + data.questionList[i].Id + "\" solutionId=\"" + data.questionList[i].SolutionId + "\"></td>";
                                if (data.questionList[i].AnswerStatus == -4) {
                                    html += "<td class=\"dueTd\">" + data.questionList[i].Question + "<a class=\"btn btn-xs btn-danger b-l-5\">已过期</a></td>";
                                } else {
                                    html += "<td style='word-break: break-all;'>" + data.questionList[i].Question + "</td>";
                                }
                                html += "</tr>";
                            }
                        }
                        $('#flowList').find('tbody').html(html);
                        // $('#flowList td').click(function() {
                        // $(this).parent().find('input[name=row_sel2]').attr("checked",'true');
                        // });
                        icheckInit();
                        $('#timePicker').on('ifChecked', function () {
                            $('#dateTime').show();
                        }).on('ifUnchecked', function () {
                            $('#dateTime').hide();
                            $('#ansRuleForm [name=StartTime]').val('');
                            $('#ansRuleForm [name=EndTime]').val('');
                        });
                        $('#flowList td').click(function () {
                            $(this).parent().find('input[name=row_sel2]').iCheck('check');
                        });
                        //下面开始处理分页
                        var options = {
                            currentPage: data.currentPage,
                            totalPages: data.totlePages,
                            onPageClicked: function (event, originalEvent, type, page) {
                                fQue(page);
                            }
                        };
                        setPage('flowpageList', options);
                    } else {
                        if ($('#search_Que input[name=question]').val() !== '') {
                            $('#flowList').find('tbody').html('<tr><td colspan=\"2\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;搜索结果为空！</td></tr>');
                        }
                        else {
                            $('#flowList').find('tbody').html('<tr><td colspan=\"2\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
                        }
                        $('#flowpageList').html('');
                    }
                } else {
                    yunNoty(data);
                }
            }
    });
}

/***********************配置问题 END***********************/

/***********************快捷服务 START***********************/
function upIcon(obj) {
    var cutSrc = $(obj).parent().find('img').attr('src');
    if (cutSrc != 'js/add.png') {
        flag = true;
        $('#iconModal input[name=id]').val($(obj).parent().find('input[name=id]').val());
        $('#iconModal input[name=name]').val($(obj).parent().find('input[name=name]').val());
        $('#iconModal input[name=linkUrl]').val($(obj).parent().find('input[name=linkUrl]').val());
        var imgUrl = $(obj).parent().find('img').attr('src');
        $('#iconModal input[name=imageUrl]').val(imgUrl);
        $('#iconModal .kuaiIcon').find('img').attr('src', imgUrl);
    }
    $('#iconModal').modal('show');
    $('#iconModal .clickPar').val($(obj).attr('rel'));
}

$('#fileupload').fileupload({
    url: '../../material/jQueryFileUpload?type=1&materialType=1',
    dataType: 'json',
    change: function (e, data) {
        var flag = true;
        $.each(data.files, function (index, file) {
            var str = file.name.substring(file.name.lastIndexOf(".") + 1);
            str = str.toLowerCase();//转为小写
            if (str == "jpeg" || str == "jpg" || str == "png" || str == "bmp" || str == "gif") {
                flag = true;
            } else {
                flag = false;
                yunNotyError("上传文件错误，支持以jpeg、jpg、png、bmp、gif结尾的格式文件！");
            }
        });
        return flag;
    },
    done: function (e, data) {
        $.each(data.result.files, function (index, file) {
            if (file.error != undefined && file.error != '') {
                var obj = {};
                obj.status = 1;
                obj.message = file.error;
                yunNoty(obj); return;
            } else {
                var curV = $('#iconModal .clickPar').val();
                $('div[rel="' + curV + '"]').find('img').attr('src', file.url);
                $('#kuaijieForm input[name=imageUrl]').val(file.url);
                $('.kuaiIcon img').attr('src', file.url);
            }
        });
    }
});
$('#kuaijieForm input[name=linkUrl]').keydown(function (event) {

    if (event.keyCode == 13) {
        alert();
        addIcon();
        return;
    }
});


//关闭上传图片的modal
function addIcon() {
    var urlvalue = $('#iconModal input[name=linkUrl]').val();
    if (!validUrl(urlvalue)) {
        yunNotyError("请输入有效的url地址");
        return;
    }
    if (flag) {
        flag = false;
    } else {
        if (urlvalue == '') {
            yunNotyError("您没有输入快捷服务的链接地址");
            return;
        }
        iconCount++;
        $('.quickly').append('<div class="upKuai" rel="kuai_' + iconCount + '"><span titlt="点击删除" id="delImg"></span><img src="js/add.png" onClick="upIcon(this)" title="点击上传图标" ><input type="hidden" name="id" ><input type="hidden" name="name"><input type="hidden" name="linkUrl" ></div>');
    }
    $('.progress-bar').css('width', 0);
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,//不从缓存中去数据
        url: encodeURI('../../ChatFormConfigLink/addLinkMenu?configId=' + $('.kuaijiefuwu').val()),
        data: $('#kuaijieForm').serialize(),
        success:
            function (data) {
                if (data.status === 0) {
                    yunNoty(data);
                    kuaiList();
                    $('#iconModal').modal('hide');
                } else {
                    yunNoty(data);
                }
            }
    });
}

$('#iconModal').on('hidden.bs.modal', function () {
    $('#kuaijieForm input').val('');
    $('.kuaiIcon img').attr('src', 'js/add.png');
});

//列出菜单项
function kuaiList() {
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,//不从缓存中去数据
        url: encodeURI('../../ChatFormConfigLink/listLinkMenu?configId=' + $('.kuaijiefuwu').val()),
        success:
            function (data) {
                if (data.status === 0) {
                    if (data.List.length > 0) {
                        var html = [];
                        var hasNum = 6 - data.List.length;
                        for (var i = 0; i < data.List.length; i++) {
                            html.push('<div rel="kuai_' + (i + 1) + '" class="upKuai">');
                            html.push('<span title="点击删除"></span><img src="' + data.List[i].ImageUrl + '" onclick="upIcon(this)" title="点击上传图标">');
                            html.push('<input type="hidden" name="id" value="' + data.List[i].Id + '">');
                            html.push('<input type="hidden" name="name" value="' + data.List[i].Name + '">');
                            html.push('<input type="hidden" name="linkUrl" value="' + data.List[i].LinkUrl + '">');
                            html.push('</div>');
                        }
                        if (hasNum > 0) {
                            html.push('<div class="upKuai" rel="kuai_' + (hasNum + 6) + '"><img src="js/add.png" onclick="upIcon(this)" title="点击上传图标"><input type="hidden" name="id" ><input type="hidden" name="name"><input type="hidden" name="linkUrl" ></div>');
                        }
                        $('.quickly').html(html.join(''));
                        //删除菜单项
                        $('.upKuai span').on('click', function (event) {
                            var id = $(this).parent().find('input[name=id]').val();
                            $(this).adcCreator(function () {
                                var that = this;
                                if (id == '') {
                                    return;
                                }
                                delIcon(that, id);
                            })

                        });
                    } else {
                        $('.quickly').html('<div class="upKuai" rel="kuai_1"><img src="js/add.png" onclick="upIcon(this)" ><input type="hidden" name="id" ><input type="hidden" name="name"><input type="hidden" name="linkUrl" ></div>');
                    }
                } else {
                    yunNoty(data);
                }
            }
    });
}

function delIcon(obj, id) {
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,//不从缓存中去数据
        url: encodeURI('../../ChatFormConfigLink/delLinkMenu?id=' + id),
        success:
            function (data) {
                if (data.status === 0) {
                    kuaiList();
                    yunNoty(data);
                } else {
                    yunNoty(data);
                }
            }
    });
}
/***********************快捷服务 END***********************/

/***********************文字图片资讯 START***********************/
//资讯列表
function recommendList(pageNo) {
    if (!pageNo) pageNo = 1;
    $('#recommendTab').find('tbody').html('<tr><td colspan=\"4\" style=\"text-align:center;\"><img src=\"../common/images/ajax_loader.gif\"></td></tr>');
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,//不从缓存中去数据
        url: encodeURI('../../ChatFormConfigSugLink/list?pageSize=' + 10 + '&pageNo=' + pageNo + '&configId=' + $('#recommendForm1 input[name=configId]').val()),
        success:
            function (data) {
                if (data.status === 0) {
                    if (data.List.length > 0) {
                        var html = [];
                        for (var i = 0; i < data.List.length; i++) {
                            html.push('<tr>');
                            if (data.List[i].Type == 0) {
                                html.push('<td>' + data.List[i].Content + '</td>');
                            } else {
                                html.push('<td><img alt="资讯图片" class="img-responsive" src="' + data.List[i].Content + '" style="width:50px;" ></td>');
                            }
                            html.push('<td style="width:225px;">' + data.List[i].Linkurl + '</td>');
                            html.push('<td>' + data.List[i].DateTime + '</td>');
                            html.push('<td><a href="javascript:;" rel="' + data.List[i].Id + '" type="' + data.List[i].Type + '" ImgSrc="' + data.List[i].Content + '" onclick="editRecommend(this)"><i class="glyphicon glyphicon-pencil"></i></a>&nbsp;&nbsp;&nbsp;<a class="m-delgg" rel="' + data.List[i].Id + '" style="cursor:pointer;" ><i class="glyphicon glyphicon-trash" ></i></a></td>');
                            html.push('</tr>');
                        }
                        $('#recommendTab').find('tbody').html(html.join(''));
                        //删除推荐资讯
                        $('.m-delgg').on('click', function () {
                            var self = this;
                            $(self).adcCreator(function () {
                                delById(self, '../../ChatFormConfigSugLink/doDel', recommendList, 'remomendPage');
                            });
                        });
                        //下面开始处理分页
                        var options = {
                            currentPage: data.currentPage,
                            totalPages: data.totlePages,
                            onPageClicked: function (event, originalEvent, type, page) {
                                recommendList(page);
                            }
                        };
                        setPage('remomendPage', options);
                    } else {
                        $('#recommendTab').find('tbody').html('<tr><td colspan=\"4\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
                        $('#remomendPage').html('');
                    }
                } else {
                    yunNoty(data);
                }
            }
    });
}

//添加文字资讯
var flag_Recomend1_add = false;
function addRecommed1() {
    if (flag_Recomend1_add) {
        return;
    }
    flag_Recomend1_add = true;
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,//不从缓存中去数据
        url: encodeURI('../../ChatFormConfigSugLink/doAdd?type=0'),
        data: $("#recommendForm1").serialize(),
        success:
            function (data) {
                flag_Recomend1_add = false;
                if (data.status === 0) {
                    yunNoty(data);
                    $('#addModalWord').modal('hide');
                    recommendList(1);
                } else {
                    yunNoty(data);
                }
            }
    });
}

//修改资讯
function editRecommend(obj) {
    var tempObj = $(obj).parents('tr').children('td');
    var tempType = $(obj).attr('type');
    if (tempType == 0) {
        $('#recommendForm3 input[name=configId]').val($('#recommendForm1 input[name=configId]').val());
        $('#recommendForm3 input[name=content]').val(tempObj.eq(0).html());
        $('#recommendForm3 input[name=linkurl]').val(tempObj.eq(1).html());
        $('#recommendForm3 input[name=id]').val($(obj).attr('rel'));
        $('#editModalWord').modal('show');
    } else if (tempType == 1) {
        $('#recommendForm4 input[name=configId]').val($('#recommendForm2 input[name=configId]').val());
        $('#recommendForm4 input[name=content]').val($(obj).attr('imgsrc'));
        $('#recommendForm4 input[name=linkurl]').val(tempObj.eq(1).html());
        $('#recommendForm4 img').attr('src', $(obj).attr('imgsrc'));
        $('#recommendForm4 input[name=id]').val($(obj).attr('rel'));
        $('#editModalPic').modal('show');
    }
}

var flag_Recomend1_edit = false;
function editRecommed1() {
    if (flag_Recomend1_edit) {
        return;
    }
    flag_Recomend1_edit = true;
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,//不从缓存中去数据
        url: encodeURI('../../ChatFormConfigSugLink/doEdit?type=0'),
        data: $('#recommendForm3').serialize(),
        success:
            function (data) {
                flag_Recomend1_edit = false;
                if (data.status === 0) {
                    yunNoty(data);
                    $('#editModalWord').modal('hide');
                    recommendList(1);
                } else {
                    yunNoty(data);
                }
            }
    });
}

//推荐资讯上传图片
$('#recommendImg').fileupload({
    url: '../../material/jQueryFileUpload?type=1&materialType=1',
    dataType: 'json',
    change: function (e, data) {
        var flag = true;
        $.each(data.files, function (index, file) {
            var str = file.name.substring(file.name.lastIndexOf(".") + 1);
            if (str == "jpeg" || str == "JPEG" || str == "jpg" || str == "JPG" || str == "png" || str == "PNG" || str == "bmp" || str == "BMP" || str == "gif" || str == "GIF") {
                flag = true;
            } else {
                flag = false;
                yunNotyError("上传文件错误，支持以jpeg、jpg、png、bmp、gif结尾的格式文件！");
            }
        });
        return flag;
    },
    done: function (e, data) {
        $.each(data.result.files, function (index, file) {
            if (file.error != undefined && file.error != '') {
                var obj = {};
                obj.status = 1;
                obj.message = file.error;
                yunNoty(obj); return;
            } else {
                $('#recommendForm2 input[name=content]').val(file.url);
                $('#infoImg').attr('src', file.url);
            }
        });
    }
}).bind('fileuploadstart', function (e) {
    $('.fileinput-button').css('display', 'none');
    $('.fileUpLoadingSign').css('display', 'inline-block');
}).bind('fileuploadstop', function (e) {
    $('.fileinput-button').css('display', 'inline-block');
    $('.fileUpLoadingSign').css('display', 'none');
});

//添加图片资讯
var flag_Recomend2_add = false;
function addRecommed2() {
    if (flag_Recomend2_add) {
        return;
    }
    if ($('#recommendForm2 input[name=content]').val() == '') {
        yunNotyError('请上传图片！');
        return;
    }
    flag_Recomend2_add = true;
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,//不从缓存中去数据
        url: encodeURI('../../ChatFormConfigSugLink/doAdd?type=1'),
        data: $("#recommendForm2").serialize(),
        success:
            function (data) {
                flag_Recomend2_add = false;
                if (data.status === 0) {
                    yunNoty(data);
                    $('#addModalPic').modal('hide');
                    recommendList(1);
                } else {
                    yunNoty(data);
                }
            }
    });
}

//编辑时上传
$('#editrecommendImg').fileupload({
    url: '../../material/jQueryFileUpload?type=1&materialType=1',
    dataType: 'json',
    change: function (e, data) {
        var flag = true;
        $.each(data.files, function (index, file) {
            var str = file.name.substring(file.name.lastIndexOf(".") + 1);
            if (str == "jpeg" || str == "jpg" || str == "png" || str == "bmp" || str == "gif") {
                flag = true;
            } else {
                flag = false;
                yunNotyError("上传文件错误，支持以jpeg、jpg、png、bmp、gif结尾的格式文件！");
            }
        });
        return flag;
    },
    done: function (e, data) {
        $.each(data.result.files, function (index, file) {
            if (file.error != undefined && file.error != '') {
                var obj = {};
                obj.status = 1;
                obj.message = file.error;
                yunNoty(obj); return;
            } else {
                $('#recommendForm4 input[name=content]').val(file.url);
                $('#editinfoImg').attr('src', file.url);
            }
        });
    }
}).bind('fileuploadstart', function (e) {
    $('.fileinput-button').css('display', 'none');
    $('.fileUpLoadingSign').css('display', 'inline-block');
}).bind('fileuploadstop', function (e) {
    $('.fileinput-button').css('display', 'inline-block');
    $('.fileUpLoadingSign').css('display', 'none');
});


var flag_Recomend2_edit = false;
function editRecommed2() {
    if (flag_Recomend2_edit) {
        return;
    }
    if ($('#recommendForm4 input[name=content]').val() == '') {
        yunNotyError('请上传图片！');
        return;
    }
    flag_Recomend2_edit = true;
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,//不从缓存中去数据
        url: encodeURI('../../ChatFormConfigSugLink/doEdit?type=1'),
        data: $('#recommendForm4').serialize(),
        success:
            function (data) {
                flag_Recomend2_edit = false;
                if (data.status === 0) {
                    yunNoty(data);
                    $('#editModalPic').modal('hide');
                    recommendList(1);
                } else {
                    yunNoty(data);
                }
            }
    });
}

function changeToPic() {
    $('#recommendForm4 input[name=configId]').val($('#recommendForm2 input[name=configId]').val());
    $('#recommendForm4 input[name=content]').val('');
    $('#recommendForm4 input[name=linkurl]').val($('#recommendForm3 input[name=linkurl]').val());
    $('#recommendForm4 input[name=id]').val($('#recommendForm3 input[name=id]').val());
    $('#editModalWord').modal('hide');
    $('#editModalPic').modal('show');
}

function changeToWord() {
    $('#recommendForm3 input[name=configId]').val($('#recommendForm1 input[name=configId]').val());
    $('#recommendForm3 input[name=content]').val('');
    $('#recommendForm3 input[name=linkurl]').val($('#recommendForm4 input[name=linkurl]').val());
    $('#recommendForm3 input[name=id]').val($('#recommendForm4 input[name=id]').val());
    $('#editModalPic').modal('hide');
    $('#editModalWord').modal('show');
}
/***********************文字图片资讯 END***********************/

/***********************配置标签START***********************/
//公用方法
function Base() {
}

Base.prototype = {
    request: function (options) {
        var This = this,
            params = {//必须参数
                //
            },
            defaults = {
                prefix: '../../ChatFormConfigMood/',//接口路径前缀(不能写根路径)
                formId: '',//被序列化的formId
                dataObj: {},
                callback: function () { },//回调函数
            },
            options = $.extend({}, defaults, options);
        formData = $.extend({}, This.formatSeriData(decodeURIComponent(($('#' + options.formId).serialize()))), options.dataObj);//中文乱码,使用decodeURIComponent解码即可
        $.ajax({
            url: encodeURI(options.prefix + (options.url || '...')),//...为基础地址
            type: 'get',
            dataType: options.dataType || 'json',
            data: $.extend({}, params, options.params, formData),
            cache: false,//IE下有用
            success: function (data) {
                if (data) {
                    options.callback(data);
                }
            }
        });
    },
    formatSeriData: function (data) {
        if (!data) {
            return;
        }
        var obj = '',
            dot = ',',
            arr = data.match(/[^&]+/g);

        for (var i = 0; i < arr.length; i++) {
            var str = arr[i].match(/([^=]+)=([^=]*)/);
            if (i == arr.length - 1) {
                dot = '';
            }
            obj += '"' + str[1] + '"' + ":" + '"' + str[2] + '"' + dot;
        }
        return JSON.parse('{' + obj + '}');
    },
    // 判断类型 array number string date function regexp object boolean null undefined
    isType: function (obj, type) {
        return Object.prototype.toString.call(obj).toLowerCase() === '[object ' + type + ']';
    }
}

// 配置标签
function Mood() {
    Base.call(this);
    $.extend(Mood.prototype, Base.prototype);
    this.init();
    this.ue = UE.getEditor('container', {
        toolbars: [
            [
                'undo', //撤销
                'redo', //重做
                'preview', //预览
                'time', //时间
                'date', //日期
                'cleardoc', //清空文档
                'fontfamily', //字体
                'fontsize', //字号
                'simpleupload', //单图上传
                'emotion', //表情
                'spechars', //特殊字符
                'forecolor', //字体颜色
                'backcolor', //背景色
                'fullscreen', //全屏
            ]
        ],
        zIndex: 2
    });
    this.ueEdit = UE.getEditor('container-edit', {
        toolbars: [
            [
                'undo', //撤销
                'redo', //重做
                'preview', //预览
                'time', //时间
                'date', //日期
                'cleardoc', //清空文档
                'fontfamily', //字体
                'fontsize', //字号
                'simpleupload', //单图上传
                'emotion', //表情
                'spechars', //特殊字符
                'forecolor', //字体颜色
                'backcolor', //背景色
                'fullscreen', //全屏
            ]
        ],
        // zIndex: 3
    });
    this.$tr = null;
}

Mood.prototype = {
    init: function () {
        this.list();
        this.add();
        this.edit();
        this.del();
    },
    list: function (pageNo, pageSize) {
        var This = this;
        This.request({
            url: 'list',
            params: {
                pageNo: pageNo || 1,
                pageSize: pageSize || 15
            },
            callback: function (data) {
                if (data.status) {
                    yunNoty(data);
                } else {
                    var html = '<tr><td colspan=\"3\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
                    if (data.list) {
                        if (data.list[0]) {
                            html = '';
                            for (var i = 0; i < data.list.length; i++) {
                                html += '<tr Id="' + (data.list[i].Id || '') + '" ConfigId="' + (data.list[i].ConfigId || '') + '" Key="' + (data.list[i].Key || '') + '" KeyString="' + (data.list[i].KeyString || '') + '" ValueString="' + ((data.list[i].ValueString || '').replace(/"/g, '\'')) + '"><td>' + (data.list[i].Key || '') + '</td><td>' + (data.list[i].KeyString || '') + '</td><td>' + (data.list[i].ValueString || '') + '</td><td><a href="javascript:;"><i class="moodEdit glyphicon glyphicon-pencil"></i></a> <a href="javascript:;"><i class="moodDel glyphicon glyphicon-trash"></i></a></td></tr>';
                            }
                        }
                    }
                    $('#moodTab tbody').empty().append(html);
                    // 下面开始处理分页
                    var options = {
                        currentPage: data.currentPage,
                        totalPages: data.totlePages,
                        alignment: 'right',
                        onPageClicked: function (event, originalEvent, type, page) {
                            This.list(page);
                        }
                    };
                    setPage('moodPage', options);
                }
            },
        });
    },
    add: function () {
        var This = this;
        $('.moodBtn').off('click').on('click', function () {
            var key = $('#moodForm [name=key]').val(),
                keyString = $('#moodForm [name=keyString]').val(),
                valueString = This.ue.getContent();

            var configId = location.href.match(/configId=(\d+)/) || 0;
            if (This.isType(configId, 'array')) {
                configId = configId[1];
            }

            if (!$('#moodForm [name=key]').val()) {
                yunNoty({ message: '请输入配置值' });
                return;
            }
            if (This.ue.getContentTxt().length > 50) {
                yunNoty({ message: '配置内容最大50个字符' });
                return;
            }
            This.request({
                url: 'addMood',
                params: {
                    key: key,
                    keyString: keyString,
                    valueString: valueString,
                    configId: configId
                },
                callback: function (data) {
                    yunNoty(data);
                    if (!data.status) {
                        $('#moodForm [name=key]').val('');
                        $('#moodForm [name=keyString]').val('');
                        This.ue.setContent('');
                        This.list();
                    }
                },
            });
        });
    },
    edit: function () {
        var This = this;

        $('body').on('click', '.moodEdit', function () {
            This.$tr = $(this).parents('tr');
            $('#moodForm-edit [name=key]').val(This.$tr.attr('Key'));
            $('#moodForm-edit [name=keyString]').val(This.$tr.attr('KeyString'));
            This.ueEdit.setContent(This.$tr.attr('ValueString'));
            $('#editMoodModal').modal('show');
        });

        $('.editMoodEnsure').on('click', function () {
            This.request({
                url: 'editMood',
                params: {
                    id: This.$tr.attr('id'),
                    key: $('#moodForm-edit [name=key]').val(),
                    keyString: $('#moodForm-edit [name=String]').val(),
                    valueString: This.ueEdit.getContent(),
                    configId: This.$tr.attr('configId')
                },
                callback: function (data) {
                    yunNoty(data);
                    if (!data.status) {
                        $('#editMoodModal').modal('hide');
                        This.list();
                    }
                },
            });
        });
    },
    del: function () {
        var This = this;
        $('body').on('click', '.moodDel', function () {
            var $tr = $(this).parents('tr'),
                Id = $tr.attr('Id'),
                ConfigId = $tr.attr('ConfigId');
            $(This).adcCreator(function () {
                This.request({
                    url: 'delMood',
                    params: {
                        id: Id,
                        configId: ConfigId
                    },
                    callback: function (data) {
                        yunNoty(data);
                        if (!data.status) {
                            This.list();
                        }
                    },
                });
            })
        });
    },
}
/***********************配置标签END***********************/
