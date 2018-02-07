// 智能推荐手动配置的input序号
var QandFIndex = -1;
// 如果是从中转站添加
var transferStationFlag = false;
var tsItem = null;
var similarFlag = true;
var channelOther = [];
richtextUE = UE.getEditor('ans_richtext', {
    initialFrameHeight: 300,
    zIndex: 190,
    wordCount: true,
    maximumWords: 20000
});
if (getUrlParam('tsFlag')) {
    $('#cm02').show();
    $('#cm01').hide();
    transferStationFlag = true;
    tsItem = getSessionStorage('ts_tsItem');


    var tsJSON = null;
    if (tsItem) {
        tsJSON = JSON.parse(tsItem);
    }

    $('#question').val(tsJSON.Question);
    $('#queClassify').val(tsJSON.ComeGroupName);
    $('#ClassesIds').val(tsJSON.GroupId);

    /*==========初始化相似问题==========*/
    if (tsJSON.Learnque) {
        var learnQue = tsJSON.Learnque.substr(0, tsJSON.Learnque.length - 1).split(',');
        var learnQueInput = '';
        $.each(learnQue, function (i, item) {
            learnQueInput += '<div class="form-group"><div class="col-md-offset-2 col-md-8 input-group"><input class="form-control" type="text" placeholder="请填写相似问法" name="similarQueInput" maxlength="200" value="' + item + '"><a href="javascript:;" name="delSimilarInput" class="input-group-addon"><span class="fa fa-times"></span></a></div></div>';
        });
        $('#addSimilarInput').parent().prev().empty().before(learnQueInput);
    }


    if (tsJSON.Mode == '0') {
        $('#AnswerNav a[href="#text"]').tab('show');
        $('#ans_text').val(tsJSON.Answer);
    } else if (tsJSON.Mode == '1') {
        $('#AnswerNav a[href="#picture"]').tab('show');
        $('#pictureId').val(tsJSON.ModeValue);
        if (tsJSON.Answer !== undefined) {
            $('#pictureShow').html(tsJSON.Answer);
        }
    } else if (tsJSON.Mode == '2') {
        $('#AnswerNav a[href="#richtext"]').tab('show');
        richtextUE.addListener('ready', function () {
            richtextUE.setContent(tsJSON.Answer);
        });
    } else if (tsJSON.Mode == '3') {
        $('#AnswerNav a[href="#voice"]').tab('show');
        $('#voiceId').val(tsJSON.ModeValue);
        if (data.material !== undefined) {
            $('#ans_voice button').html(data.material.Name);
        }
        if ($('#ans_voice button').html() === '') {
            $('#ans_voice button').hide();
        } else {
            $('#ans_voice button').show();
        }
    } else if (tsJSON.Mode == '4') {
        $('#AnswerNav a[href="#other"]').tab('show');
        $('#otherId').val(tsJSON.ModeValue);
        if (data.thirdOpen !== undefined) {
            $('#ans_other button').html(data.thirdOpen.Info);
        }
        if ($('#ans_other button').html() === '') {
            $('#ans_other button').hide();
        } else {
            $('#ans_other button').show();
        }
    } else if (tsJSON.Mode == '6') {
        $('#AnswerNav a[href="#flow"]').tab('show');
        $('title').html('修改流程描述');
        $('.breadcrumb').eq(2).html('修改流程描述');
        $('.page-header').html('修改流程描述');
        $('ol.breadcrumb').find('li.active').html('修改流程描述');
        $('#labelAoF').html('流程描述');
        $('#labelEQ').html('流程');
        //是流程就删除其他tab
        $('#AnswerNav a[href="#flow"]').parent().siblings().remove();
        flowUE.addListener('ready', function () {
            flowUE.setContent(tsJSON.Answer);
        });
        flowUE.setContent(tsJSON.Answer);
    } else if (tsJSON.Mode == '7') {
        $('#AnswerNav a[href="#form"]').tab('show');
        $('#formId').val(tsJSON.ModeValue);
        if (tsJSON.Answer !== undefined) {
            $('#ans_form button').html(tsJSON.Answer);
        }
        if ($('#ans_form button').html() === '') {
            $('#ans_form button').hide();
        } else {
            $('#ans_form button').show();
        }
    } else if (tsJSON.Mode == '8') {
        $('#AnswerNav a[href="#rg"]').tab('show');
        $('#ans_rg').val(tsJSON.Answer);
    } else if (tsJSON.Mode == '11') {
        $('#AnswerNav a[href="#ask"]').tab('show');
        $('#askId').val(tsJSON.ModeValue);
        if (data.thirdOpen !== undefined) {
            $('#ans_ask button').html(data.thirdOpen.Info);
        }
        if ($('#ans_ask button').html() === '') {
            $('#ans_ask button').hide();
        } else {
            $('#ans_ask button').show();
        }
    }
    $('#AddQuesForm input[name=thirdUrl]').val(tsJSON.ThirdUrl);
    if (getUrlParam('ComeFrom')) {
        $.ajax({
            url: '../../landray/LandrayQuestion/getQueList',
            type: 'post',
            data: {
                type: tsJSON.Type,
                comeFrom: tsJSON.ComeFrom,
                comeGroupId: tsJSON.ComeGroupId,
                comeQuestionId: tsJSON.ComeId
            },
            dataType: 'json',
            success: function (data) {
                if (data.thirdList && data.thirdList.length > 0) {
                    var template = Handlebars.compile($('#left-template').html());
                    var html = template(data.thirdList[0]);
                    $('#left-container').html(html);
                    // 设置问题和分类不可修改
                    $('#question-static-col').removeClass('hide');
                    $('#question-col').addClass('hide');
                    $('#question-label').html($('#question').val());
                    if (data.thirdList[0].GroupId) {
                        $('#ClassesIds').val(data.thirdList[0].GroupId);
                        $('#ClassesLabel').removeClass('hide');
                        $('#queClassify').addClass('hide');
                        $('#ClassesLabel').html(data.thirdList[0].ComeGroupName);
                    }
                    /*taskId = 684 知识中转站添加渠道修改项
                        新增知识时将已经设置的渠道信息展示出来
                    */
                    if(data.thirdList[0].Other){
                        if(data.thirdList[0].Other.split(',')){
                            channelOther = data.thirdList[0].Other.split(',');
                        }
                    }
                }
            }
        });
    } else {
        var template = Handlebars.compile($('#left-kefu-template').html());
        var html = template(tsJSON);
        $('#left-container').html(html);
    }
}

$(document).ready(function () {
    App.init();
    iframeTab.init({ iframeBox: '' });
    $('#question').addWordCount(200);
    $('#ans_text').addWordCount(200);
    $('#max5').tooltip();
    //获取配置项列表信息
    getRule();
    //富文本
    UE.getEditor('ans_richtext', {
        initialFrameHeight: 300,
        zIndex: 190,
        wordCount: true,
        maximumWords: 20000
    });

    //流程答案
    UE.getEditor('ans_flow', {
        initialFrameHeight: 300,
        zIndex: 190,
        wordCount: true,
        maximumWords: 20000
    });

    //答案tab切换
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        if ($(e.target).attr('href') == '#flow') {
            //隐藏并关闭智能推荐
            $('#queGroup').hide();
            $('a[href="#queOff"]').tab('show');
        } // newly activated tab
        if ($(e.relatedTarget).attr('href') == '#flow') {
            $('#queGroup').show();
        } // previous active tab
    });

    //相似问法模态窗
    $('#similarQueForm').on('click', 'a[name=delSimilarInput]', function () {
        $(this).parent().parent().remove();
    });
    // $('#similarQueForm').on('blur', 'input[name=similarQueInput]', function() {
    // if($(this).val().length < 2) {
    // yunNotyError("相似问法长度需在2-200个字符之间！");
    // $(this).val('');
    // }
    // });
    $('#addSimilarInput').click(function () {
        $(this).parent().before('<div class="form-group"><div class="col-md-offset-2 col-md-8 input-group"><input class="form-control" type="text" placeholder="请填写相似问法" name="similarQueInput" maxlength="200"><a href="javascript:;" name="delSimilarInput" class="input-group-addon"><span class="fa fa-times"></span></a></div></div>');
    });

    //词库优化模态窗
    $('#optimizeFormAddress').tagit();

    //生效渠道
    $('body').on('click', 'a[fid]', function (e) {
        if ($(e.target).hasClass('btn-primary')) {
            $(e.target).removeClass('btn-primary');
            $(e.target).attr('ckb', 0);
        } else {
            $(e.target).addClass('btn-primary');
            $(e.target).attr('ckb', 1);
        }
    });
    $('body').on('ifClicked', '#wayAll', function () {
        if ($(this)[0].checked) {
            $('a[fid]').removeClass('btn-primary');
            $('a[fid]').attr('ckb', 0);
        } else {
            $('a[fid]').addClass('btn-primary');
            $('a[fid]').attr('ckb', 1);
        }
    });
    //生效时间
    $('.form_datetime').datetimepicker({
        language: 'zh-CN',
        format: 'yyyy-mm-dd hh:ii',
        autoclose: true,
        todayBtn: true,
        minuteStep: 10,
        startDate: new Date(),
        initialDate: new Date(),
        zIndex: 2000
    });
    $('#timePicker').iCheck('uncheck');
    $('#timePicker').on('ifChecked', function () {
        $('#dateTime').show();
    }).on('ifUnchecked', function () {
        $('#dateTime').hide();
        $('#ansRuleForm [name=StartTime]').val('');
        $('#ansRuleForm [name=EndTime]').val('');
    });
    //生效角色ztree滚动条
    $('.treeDiv').slimScroll({
        height: '200px'
    });
    //生效角色ztree初始化
    $.fn.zTree.init($('#treeUserRole'), setting, []);
    //生效角色单击展开所有按钮
    $('.expandURA').click(function () {
        showTree('treeUserRole', true);
    });
    //生效角色单击折叠所有按钮
    $('.expandURN').click(function () {
        showTree('treeUserRole', false);
    });

    //选择问题分类模态窗
    $('.treeDivModal').slimScroll({
        height: '400px'
    });
    $('#QuestionClassModel').on('show.bs.modal', function () {
        $.fn.zTree.init($('#treeQueClass'), classsetting, []);
    });
    $('#QuestionClassModel').on('hide.bs.modal', function () {
        $('#QuestionClassModel [name=treeName]').val('');
        $('#QuestionClassModel [name=treeId]').val('');
    });
    $('#queClassify').on('click', function () {
        $('#QuestionClassModel').modal('show');
    });
    $('#selClassBtn').on('click', function () {
        $('#queClassify').val($('#QuestionClassModel [name=treeName]').val());
        $('input[name=ClassesIds]').val($('#QuestionClassModel [name=treeId]').val());
        $('#QuestionClassModel').modal('hide');
    });


    //选择标签模态框
    $('#labelClassify').click(function () {
        $('#labelTxt').html('');
        $('#labelClassModel').modal('show');
    });
    $('#labelClassModel').on('show.bs.modal', function () {
        labelList();

    });

    $('#selLabelBtn').click(function () {     //确定选择标签
        var checkb = $('#labelTxt').find('input[type=\'checkbox\']');
        var label = '';
        var id = '';
        $(checkb).each(function () {
            if ($(this).prop('checked')) {
                label += $(this).parent().parent().next().text() + ',';
                id += $(this).attr('value') + ',';
            }
        });

        $('#labelClassify').val(label.substring(0, label.length - 1));
        $('#labelesIds').attr('value', id.substring(0, id.length - 1));
        $('#labelClassModel').modal('hide');
    });

    var labelList = function () {     //已有标签列表
        $.post('../../label/findAllLabels', {
        }, function (data) {
            if (data.status == 0) {
                var renderTo = $('#labelTxt');
                $('#labelTxt').html('');
                if (data.list.length > 0) {
                    $(data.list).each(function (i, t) {
                        var item = $('<div class=\'item\'></div>').appendTo(renderTo);
                        var checkbDiv = $('<div class="checkbDiv"></div>').appendTo(item);
                        var checkb = $('<input type="checkbox" class="checkb"/>').appendTo(checkbDiv);
                        var label = $('<div class=\'itemTxt\'></div>').text(t.LabelName).appendTo(item);
                        checkb.attr('value', t.Id);
                        item.attr('value', t.Id);
                    });
                    icheckInit();
                    $('#timePicker').on('ifChecked', function () {
                        $('#dateTime').show();
                    }).on('ifUnchecked', function () {
                        $('#dateTime').hide();
                        $('#ansRuleForm [name=StartTime]').val('');
                        $('#ansRuleForm [name=EndTime]').val('');
                    });
                    $('.itemTxt').each(function () {
                        $(this).click(function () {
                            var chec = $(this).prev().find('.checkb');
                            if ($(chec).prop('checked')) {
                                $(chec).iCheck('uncheck');
                            }
                            else {
                                $(chec).iCheck('check');
                            }
                        });
                    });

                    var labelIds = $('#labelesIds').attr('value');
                    var labelIdsList = new Array();
                    labelIdsList = labelIds.split(',');

                    $('.checkb').each(function () {
                        if ($.inArray($(this).attr('value'), labelIdsList) >= 0) {
                            $(this).iCheck('check');
                        }
                    });

                }
                else {
                    var html = '';
                    html += '<div style="width:100%;text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</div>';
                    $('#labelTxt').empty().append(html);
                }
            }
        });
    };

    function setScroll() {  //已有标签滚动条
        $('#labelTxt').slimScroll({
            height: '400px',
            /*alwaysVisible: true,*/
        });
    }
    setScroll();
    $(window).on('resize', setScroll);


    //智能推荐列表
    $('#queManual').on('click', '.zntjo', function () {
        if ($(this).parent().next().children().val() != '') {
            $(this).toggleClass('btn-primary').toggleClass('btn-white');
            $(this).parent().next().children().val('').attr('rel', 0);
        }
    });

    $('#queManual').on('click', 'a[name=delpostInput]', function () {
        if ($('#queManual a[name=delpostInput]').size() > 1) {
            $(this).parent().parent().remove();
        } else {
            $('#queManual [name=postQueInput]').removeAttr('rel');
            $('#queManual [name=postQueInput]').removeAttr('srel');
            $('#queManual [name=postQueInput]').val('');
        }
    });
    $('#queManual').on('click', '[name=postQueInput]', function () {
        QandFIndex = $(this).parent().parent().index();
        showQueModal();
    });
    $('#queManual').on('click', 'a[name=addpostInput]', function () {
        if ($('#queManual a[name=addpostInput]').size() < 5) {
            $('#queManual').append('<div class="QueContainer row"><div class="form-group col-xs-2"><button type="button" class="btn btn-primary zntjo">智能推荐</button></div><div class="form-group col-xs-8"><input class="form-control" type="text" readOnly style="cursor:pointer;" placeholder="此条为智能推荐,可选择问题手动推荐" name="postQueInput" rel="0"></div><div class="form-group col-xs-2 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>&nbsp;<a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>');
        }
    });
    $('#queDivNav a').click(function (e) {
        if ($(this).attr('href') == '#queManualQue') {
            sQue();
        } else if ($(this).attr('href') == '#queManualFlow') {
            fQue();
        }
    });

    $('#question').on('blur', function () {
        if ($(this).val().length <= 1) {
            yunNotyError('问题长度需在2-200个字符之间！');
            $(this).val('');
        }
    });
    $('#ans_text').on('blur', function () {
        if ($(this).val().length == 1) {
            yunNotyError('答案长度需在2-200个字符之间！');
            $(this).val('');
        }
    });
    $('.formSubmit').click(function () {
        Add();
    });
    setInterval(function () {
        var addFlag = true;
        //问题内容
        var question = $('#question').val();
        if (question === '' || question.length < 2 || question.length > 200) {
            addFlag = false;
        }
        //问题分组ID
        var groupId = $('input[name=ClassesIds]').val();
        if (groupId === '') {
            addFlag = false;
        }
        //消息类型 0文本 1图文 2富文本 3声音 4第三方 6流程 7报表
        var mode = -1;
        //图文或语音或第三方ID
        var modeValue = '';
        //答案内容
        var answer = '';
        if ($('#text').hasClass('active')) {
            mode = 0;
            answer = $('#ans_text').val();
            if (answer === '' || answer.length < 2 || answer.length > 200) {
                addFlag = false;
            }
        } else if ($('#richtext').hasClass('active')) {
            mode = 2;
            answer = UE.getEditor('ans_richtext').getContent();
            if (answer === '' || answer.length < 2 || answer.length > 20000) {
                addFlag = false;
            }
        } else if ($('#voice').hasClass('active')) {
            mode = 3;
            modeValue = $('#voiceId').val();
            if (modeValue === '') {
                addFlag = false;
            }
        } else if ($('#picture').hasClass('active')) {
            mode = 1;
            modeValue = $('#pictureId').val();
            if (modeValue === '') {
                addFlag = false;
            }
        } else if ($('#other').hasClass('active')) {
            mode = 4;
            modeValue = $('#otherId').val();
            if (modeValue === '') {
                addFlag = false;
            }
        } else if ($('#flow').hasClass('active')) {
            mode = 6;
            answer = UE.getEditor('ans_flow').getContent();
            if (answer === '' || answer.length < 2 || answer.length > 20000) {
                addFlag = false;
            }
        } else if ($('#form').hasClass('active')) {
            mode = 7;
            modeValue = $('#formId').val();
            if (modeValue === '') {
                addFlag = false;
            }
        } else if ($('#rg').hasClass('active')) {
            mode = 8;
            answer = $('#ans_rg').val();
            if (answer === '') {
                addFlag = false;
            }
        } else if ($('#ask').hasClass('active')) {
            mode = 11;
            modeValue = $('#askId').val();
            if (modeValue === '') {
                addFlag = false;
            }
        }
        if (addFlag === true) {
            $('.formSubmit').unbind('click').bind('click', function () {
                Add();
            });
            $('.formSubmit').removeAttr('disabled');
        } else {
            $('.formSubmit').unbind('click');
            $('.formSubmit').css('pointer-events', 'all').attr('disabled', true);
        }
    }, 500);
    //实时监控input中的值变化   非IE
    $('#question')[0].oninput = function () {
        check_question($(this));
    };
    //实时监控input中的值变化   IE
    $('#question')[0].onpropertychange = function () {
        check_question($(this));
    };
    $(document).on('blur', '[name="form_Question"]', function () {
        var question = $(this).val().trim();
        //判断该问题是否在相似问法中存在
        $('[name=similarQueInput]').each(function () {
            if ($(this).val().trim() == question) {
                yunNotyError("该问题已存在！");
                return;
            }
        });
        $.get("../../question/isExistQue", 'question='+encodeURI(question)+'&level=1', function (data) {
            if (data.message == '该问题已存在！') {
                yunNoty(data);
            }
        });
    });
    //相似问法删除事件
    $('#similarQueForm').on('click', 'a[name=delSimilarInput]', function () {
        if ($('[name="similarQueInput"]').length > 1) {
            var question = $(this).parent().parent().prev().find('[name="similarQueInput"]').val().trim();//先获取当前输入框的上一个输入框的值，在做删除
            $(this).parent().parent().remove();
        }
    });
    //相似问法手动添加事件
    $('#addSimilarInput').click(function (e) {
        /*
        * TaskId = 427 添加相似问题时需要判重判空，重复或空时不能新增输入框
        * 修改：点击添加输入框按钮时根据接口判重，如果报错则直接return
        */
        var addBtn = e.target || event.srcElement;

        var question = $(addBtn).parent().prev().find('[name="similarQueInput"]').val();
        //判断是否与当前创建的问题重复
        if (question == $('[name="form_Question"]').val()) {
            yunNotyError("该问题正在被创建！");
            return;
        }
        //前端判重
        if (checkSimilarQue(question)) {
            yunNotyError("该问题已存在！");
            return;
        }
        //后台判重
        $.get("../../question/isExistQue", 'question='+encodeURI(question)+'&level='+0, function (data) {
            if (data.status == 1) {
                yunNotyError(data.message);
                return;
            } else if (checkSimilarQue(question)) {

            } else {
                $(addBtn).parent().before('<div class="form-group"><div class="col-md-offset-2 col-md-8 input-group"><input class="form-control" type="text" placeholder="请填写相似问法" name="similarQueInput" maxlength="200"><a href="javascript:;" name="delSimilarInput" class="input-group-addon"><span class="fa fa-times"></span></a></div></div>');
            }
            
        });
    });
});

function getInfo() {
    $.ajax({
        url: '../../question/getQueListByMode',
        type: 'post',
        data: {
            suggestMode: 2
        },
        dataType: 'json',
        async: true,
        cache: false,
        success: function (data) {
        }
    });
}
//前端判断相似问法是否重复
function checkSimilarQue(question) {
    var count = 0;
    $('[name=similarQueInput]').each(function () {
        if ($(this).val().trim() == question) {
            count++;
        }
    });
    if (count > 1) {
        return true;
    }
    return false;
}

function checkMagnet() {
    var f = 1;
    $('[name=similarQueInput]').each(function () {
        if ($(this).val().length == 1) {
            f = 0;
        }
    });
    if (!f) {
        yunNotyError('相似问法长度需在2-200个字符之间！');
        return false;
    }
    //后台判重
    var question = $('#addSimilarInput').parent().prev().find('[name="similarQueInput"]').val();
    
    //判断是否与当前创建的问题重复
    if(question == $('[name="form_Question"]').val()){
        yunNotyError("不能添加重复的问法！");
        return;
    }
        
    $.get("../../question/isExistQue", 'question='+encodeURI(question)+'&level=0', function (data) {
        if(data.status == 1){
            if(data.message == "该问题已存在！"){
                yunNotyError("不能添加重复的问法！");
            }else{
                yunNotyError(data.message);
            }
        }else if(checkSimilarQue(question)){
            yunNotyError("不能添加重复的问法！");
        }else{
            $('#similarQueModal').modal('hide');
        }
    });
}

function clearMagnet() {
    $('[name=similarQueInput]').each(function () {
        $(this).parents('.form-group').remove();
    });
    similarFlag = true;
    $('#similarQueModal').modal('hide');
}

enterSubmit($('#search_Que input[name=question]'), addQueSearch);
function addQueSearch() {
    if ($('#queDivNav li').eq(0).hasClass('active')) {
        sQue();
    } else if ($('#queDivNav li').eq(1).hasClass('active')) {
        fQue();
    } else {
        sQue(); fQue();
    }
}

function setrolename() {
    $('#rolename').val($('#AddQuesForm input[name=hasChecked]').val());
    $('#roleModel').modal('hide');
}
/*********************tree start***********************/
//生效角色树
var setting = {
    check: {
        enable: true,
        chkboxType: { 'Y': 'ps', 'N': 'ps' }
    },
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
        dblClickExpand: false,
        selectedMulti: false,
        showIcon: false
    },
    async: {
        enable: true,
        url: '../../comb/loadCombs',
        autoParam: ['id'],
        dataFilter: function (treeId, parentNode, responseData) {
            if (responseData) {
                return responseData.list;
            }
            return responseData;
        }
    },
    callback: {
        beforeClick: function (treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj('treeUserRole');
            zTree.checkNode(treeNode, !treeNode.checked, null, true);
            return false;
        },
        onCheck: function (e, treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj('treeUserRole');
            nodes = zTree.getCheckedNodes(true);
            v = '';
            I = '';
            for (var i = 0, l = nodes.length; i < l; i++) {
                if (nodes[i].Leaf == 1) {
                    v += nodes[i].Name + ',';
                    I += nodes[i].Id + '~';
                }
            }
            if (v.length > 0) v = v.substring(0, v.length - 1);
            if (I.length > 0) I = I.substring(0, I.length - 1);
            // if(nodes.length>5){
            // 	yunNotyError('每个用户最多可以添加5个角色！');
            // 	$("#AddQuesForm input[name=hasChecked]").val('');
            // 	$("#AddQuesForm input[name=hasCheckedId]").val('');
            // 	return;
            // }else{
            $('#AddQuesForm input[name=hasChecked]').val(v);
            $('#AddQuesForm input[name=hasCheckedId]').val(I);
            //}
        },
        onAsyncSuccess: function (event, treeId, treeNode) {
            var zTree = $.fn.zTree.getZTreeObj('treeUserRole');
            var IdString = $('#AddQuesForm input[name=hasCheckedId]').val();
            if (IdString) {
                var Ids = IdString.split('~');
                var node = null;
                for (i = 0; i < Ids.length; i++) {
                    zTree.checkNode(zTree.getNodeByParam('Id', Ids[i]), true);
                }
            }
        }
    }
};

//问题分类树
var classsetting = {
    view: {
        dblClickExpand: false,
        showIcon: false
    },
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
    async: {
        enable: true,
        url: '../../classes/listClasses?m=0',
        autoParam: ['id'],
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
            Name: '全部分类',
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
    var treeObj = $.fn.zTree.getZTreeObj('treeClasses');
    //treeObj.expandAll(true);
}

function filterP(node) {
    return (node.isParent == false);
}

//智能推荐树
var hidesetting = {
    view: {
        dblClickExpand: false,
        showIcon: false
    },
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
    async: {
        enable: true,
        url: '../../classes/listClasses?m=0',
        autoParam: ['id'],
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
            $('#menuContent').fadeOut('fast');
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
        beforeClick: hidezTreeBeforeClick
    }
};

function hidezTreeBeforeClick(treeId, treeNode, clickFlag) {
    //return !treeNode.isParent;//当是父节点 返回false 不让选取
    if (treeNode.isParent === true) {
        $('#search_Que input[name=isLeaf]').val(0);
    } else {
        $('#search_Que input[name=isLeaf]').val(1);
    }
}
/*********************tree end***********************/

/**
* 输入问题校验
*/
function check_question(e) {
    $.get("../../question/isExistQue", 'question='+encodeURI(e.val())+'&level=1', function (data) {
        $(".entitys").eq(0).val(data.entity || "");
        if (data.status === 0 && data.result) {
            if (data.result) {
                var trueexistQue = JSON.parse(data.result);
                var getCheckQue = trueexistQue.getCheckQue;
                var seggedWord = trueexistQue.seggedWord;
                var stopWord = trueexistQue.stopWord;
                var allSeggedWord = trueexistQue.allSeggedWord;
                var sentence = trueexistQue.sentence;
                var groupId = trueexistQue.groupId;
                if (groupId) {
                    $("#wSgId").val(groupId);
                }
                $('#colRight').show();
                $('#simiYinContainerHide').show();
                $('.oneTips').show();
                if (sessionStorage.getItem('sentenceValue') == 1) {
                    if (getCheckQue) {
                        if (getCheckQue.length) {
                            var html = [];
                            for (var i = 0; i < getCheckQue.length; i++) {
                                if (getCheckQue[i].matchQuestion) {
                                    /*
                                     * taskId = 426 相似问题进入流程
                                     * 通过后台返回的参数solutionType判断，1为问题，2为流程
                                     */
                                    if(getCheckQue[i].matchQuestion.solutionType == 1){
                                        html.push('<div class="col-md-12"><a data-num="0" data-name="问题详细"  href="../../web/knowledge/queDetail.html?id=' + getCheckQue[i].matchQuestion.solutionId + '" sid="' + getCheckQue[i].matchQuestion.id + '"  rel="' + getCheckQue[i].matchQuestion.solutionId + '" class="searchDetailQue_a">' + (i + 1) + '.&nbsp;' + getCheckQue[i].matchQuestion.question + '</a></div>');
                                    }else{
                                        html.push('<div class="col-md-12"><a data-num="0" data-name="流程详细"  href="../../web/knowledge/editFlow.html?questionId=' + getCheckQue[i].matchQuestion.solutionId + '&solutionId='+ getCheckQue[i].matchQuestion.solutionId +'&groupId='+getCheckQue[i].matchQuestion.groupId+'" sid="' + getCheckQue[i].matchQuestion.id + '"  rel="' + getCheckQue[i].matchQuestion.solutionId + '" class="searchDetailQue_a">' + (i + 1) + '.&nbsp;' + getCheckQue[i].matchQuestion.question + '</a></div>');
                                    }
                                }
                            }
                            $('#simiYin').html('<div class="col-md-12 col-xs-12 m-5" style="padding-left:0;padding-right:0;">此问题已存在以下相似问法：</div><div class="simiQueLt"></div>');
                            $('.simiQueLt').append(html.join(''));
                            if (e.val() !== '') {
                                var terms = e.val().split('');
                                var aValue = $('.simiQueLt').html();
                                $.each(terms, function (i, n) {
                                    if (aValue.indexOf(n) > 0) {
                                        //$('.simiQueLt').highlight(n);
                                    }
                                });
                            }
                        }
                        $('#simiYinContainer').show();
                        $('#intelMatchContainer').show();
                    } else {
                        $('#simiYinContainer').hide();
                        $('#intelMatchContainer').hide();
                    }
                    var oHtml = [];
                    if (allSeggedWord) {
                        if (allSeggedWord.length) {
                            var lexFea = [];
                            $("#phraseFeat").css('display', 'block');
                            var allSegged = [
                                ['n', 'nbp', 'nba', 'nf', 'nb', 'nbc', 'nl'],
                                ['gi', 'nx', 'gm', 'nh', 'gbc', 'nz', 'g', 'j', 'gb', 'gg', 'gc', 'nhd', 'gp'],
                                ['np'],
                                ['nit', 'ntcb', 'ni', 'ntu', 'nts', 'ntcf', 'nth', 'nic', 'ntch', 'nt', 'ntc', 'nis', 'nto'],
                                ['t', 'tg'],
                                ['f', 's'],
                                ['nsf', 'ns'],
                                ['nm', 'nhm', 'nmc'],
                                ['nr', 'nr1', 'nr2', 'nrf', 'nrj', 'nn', 'nnt', 'nnd'],
                                ['vf', 'vx', 'v', 'vl', 'vshi', 'vi', 'vd', 'vyou', 'vn'],
                                ['vo'],
                                ['a', 'ad', 'al', 'an', 'z', 'o'],
                                ['b', 'bl'],
                                ['d', 'dg', 'dl'],
                                ['p', 'pbei', 'pba', 'c', 'cc'],
                                ['r', 'ry', 'rg', 'rys', 'rzs', 'rz', 'ryt', 'rzt', 'ryv', 'rzv', 'rr', 'Rg'],
                                ['u', 'ude2', 'uls', 'uzhe', 'usuo', 'ude1', 'uzhi', 'uyy', 'ule', 'udeng', 'ude3', 'ulian', 'uguo', 'udh', 'y', 'yg', 'e'],
                                ['m', 'q', 'mq', 'qt', 'qg', 'qv', 'mg', 'Mg'],
                                ['w', 'wp', 'wyy', 'ws', 'wkz', 'wyz', 'wn', 'wt', 'wd', 'wj', 'ww', 'wm', 'wky', 'wf'],
                                ['l', 'x', 'h', 'k', 'xu', 'i', 'end', 'begin'],
                                ['g', 'ng', 'ag', 'vg', 'xx', 'bg'],
                                ['stop']
                            ];
                            for (var i = 0; i < allSeggedWord.length; i++) {
                                for (var j = 0; j < allSegged.length; j++) {
                                    for (var z = 0; z < allSegged[j].length; z++) {
                                        if (allSegged[j][z] == allSeggedWord[i].nature) {
                                            var segged = allSegged[j][0];
                                            switch (segged) {
                                                case 'n':
                                                    oHtml.push('<span class="m-5" style="background:#488FCE;">' + allSeggedWord[i].word + '</span>');
                                                    lexFea.push('<div class="col-md-12 col-xs-12" style="background:#488FCE;">名词</div>');
                                                    break;
                                                case 'gi':
                                                    oHtml.push('<span class="m-5" style="background:#96DBF8;">' + allSeggedWord[i].word + '</span>');
                                                    lexFea.push('<div class="col-md-12 col-xs-12" style="background:#96DBF8;">专有名词</div>');
                                                    break;
                                                case 'np':
                                                    oHtml.push('<span class="m-5" style="background:#96DBF8;">' + allSeggedWord[i].word + '</span>');
                                                    lexFea.push('<div class="col-md-12 col-xs-12" style="background:#96DBF8;">属性名词</div>');
                                                    break;
                                                case 'nit':
                                                    oHtml.push('<span class="m-5" style="background:#41e3f2;">' + allSeggedWord[i].word + '</span>');
                                                    lexFea.push('<div class="col-md-12 col-xs-12" style="background:#41e3f2;">机构名词</div>');
                                                    break;
                                                case 't':
                                                    oHtml.push('<span class="m-5" style="background:#41f6ba;">' + allSeggedWord[i].word + '</span>');
                                                    lexFea.push('<div class="col-md-12 col-xs-12" style="background:#41f6ba;">时间名词</div>');
                                                    break;
                                                case 'f':
                                                    oHtml.push('<span class="m-5" style="background:#C9AACA;">' + allSeggedWord[i].word + '</span>');
                                                    lexFea.push('<div class="col-md-12 col-xs-12" style="background:#C9AACA;">方位名词</div>');
                                                    break;
                                                case 'nsf':
                                                    oHtml.push('<span class="m-5" style="background:#D07F7F;">' + allSeggedWord[i].word + '</span>');
                                                    lexFea.push('<div class="col-md-12 col-xs-12" style="background:#D07F7F;">地点名词</div>');
                                                    break;
                                                case 'nm':
                                                    oHtml.push('<span class="m-5" style="background:#379bf4;">' + allSeggedWord[i].word + '</span>');
                                                    lexFea.push('<div class="col-md-12 col-xs-12" style="background:#379bf4;">产品名词</div>');
                                                    break;
                                                case 'nr':
                                                    oHtml.push('<span class="m-5" style="background:#8B0A50;">' + allSeggedWord[i].word + '</span>');
                                                    lexFea.push('<div class="col-md-12 col-xs-12" style="background:#8B0A50;">人名</div>');
                                                    break;
                                                case 'vf':
                                                    oHtml.push('<span class="m-5" style="background:#DA70D6;">' + allSeggedWord[i].word + '</span>');
                                                    lexFea.push('<div class="col-md-12 col-xs-12" style="background:#DA70D6;">动词</div>');
                                                    break;
                                                case 'vo':
                                                    if (allSeggedWord[i].word.length == 1) {
                                                        oHtml.push('<span class="m-5" style="background:red;">' + allSeggedWord[i].word + '</span>');
                                                    } else {
                                                        oHtml.push('<span class="m-5" style="background:#f58096;">' + allSeggedWord[i].word + '</span>');
                                                    }
                                                    break;
                                                case 'a':
                                                    oHtml.push('<span class="m-5" style="background:#ffd799;">' + allSeggedWord[i].word + '</span>');
                                                    lexFea.push('<div class="col-md-12 col-xs-12" style="background:#ffd799;">形容词</div>');
                                                    break;
                                                case 'b':
                                                    oHtml.push('<span class="m-5" style="background:#ecd74c;">' + allSeggedWord[i].word + '</span>');
                                                    lexFea.push('<div class="col-md-12 col-xs-12" style="background:#ecd74c;">限定词</div>');
                                                    break;
                                                case 'd':
                                                    oHtml.push('<span class="m-5" style="background:#FFCCCB;">' + allSeggedWord[i].word + '</span>');
                                                    lexFea.push('<div class="col-md-12 col-xs-12" style="background:#FFCCCB;">副词</div>');
                                                    break;
                                                case 'p':
                                                    oHtml.push('<span class="m-5" style="background:#99CC67;">' + allSeggedWord[i].word + '</span>');
                                                    lexFea.push('<div class="col-md-12 col-xs-12" style="background:#99CC67;">介词/连词</div>');
                                                    break;
                                                case 'r':
                                                    oHtml.push('<span class="m-5" style="background:#9ACCCD;">' + allSeggedWord[i].word + '</span>');
                                                    lexFea.push('<div class="col-md-12 col-xs-12" style="background:#9ACCCD;">代词</div>');
                                                    break;
                                                case 'u':
                                                    oHtml.push('<span class="m-5" style="background:#4DD9E6;">' + allSeggedWord[i].word + '</span>');
                                                    lexFea.push('<div class="col-md-12 col-xs-12" style="background:#4DD9E6;">助词</div>');
                                                    break;
                                                case 'm':
                                                    oHtml.push('<span class="m-5" style="background:#FF9899;">' + allSeggedWord[i].word + '</span>');
                                                    lexFea.push('<div class="col-md-12 col-xs-12" style="background:#FF9899;">量词</div>');
                                                    break;
                                                case 'w':
                                                    oHtml.push('<span class="m-5" style="background:#C4C4C4;">' + allSeggedWord[i].word + '</span>');
                                                    lexFea.push('<div class="col-md-12 col-xs-12" style="background:#C4C4C4;">标点符号</div>');
                                                    break;
                                                case 'l':
                                                    oHtml.push('<span class="m-5" style="background:#c5c5c5;">' + allSeggedWord[i].word + '</span>');
                                                    lexFea.push('<div class="col-md-12 col-xs-12" style="background:#c5c5c5;">其它</div>');
                                                    break;
                                                case 'g':
                                                    if (allSeggedWord[i].word.length == 1) {
                                                        oHtml.push('<span class="m-5" style="background:red;">' + allSeggedWord[i].word + '</span>');
                                                    } else {
                                                        oHtml.push('<span class="m-5" style="background:#CAFF70;">' + allSeggedWord[i].word + '</span>');
                                                    }
                                                    break;
                                                case 'stop':
                                                    oHtml.push('<span class="m-5" style="background:#8F8F8F;">' + allSeggedWord[i].word + '</span>');
                                                    lexFea.push('<div class="col-md-12 col-xs-12" style="background:#8F8F8F;">停用词</div>');
                                                    break;
                                            }
                                        }
                                    }
                                }
                            }
                            var new_Lexfea = [];
                            for (var k = 0; k < lexFea.length; k++) {
                                var items = lexFea[k];
                                if ($.inArray(items, new_Lexfea) == -1) {
                                    new_Lexfea.push(items);
                                }
                            }
                            $(".termResu1 .termResu1Con").html(oHtml);
                            var isRed = false;
                            for (var i = 0; i < $('.termResu1Con span').length; i++) {
                                if ($('.termResu1Con span').eq(i).attr('style') == 'background:red;') {
                                    isRed = true;
                                }
                            }
                            if (isRed) {
                                $('.termTips').css('display', 'block');
                                $(".oneTips").html('已识别到您的问题中有不明确的单字词语，在右侧红色标出，请自行选择补充！');
                            } else {
                                $('.termTips').css('display', 'none');
                                $(".oneTips").html('');
                            }
                            $(".LexiFeats").html(new_Lexfea);
                            $('#termResuContainer').show();
                        } else {
                            $('#termResuContainer').hide();
                            $("#phraseFeat").css('display', 'none');
                        }
                    }
                    if (sentence) {
                        $('#intelMatchContainer .switchery').trigger('click');
                        $("#macthPharse").text('系统匹配：' + sentence);
                    }
                } else {
                    if (getCheckQue) {
                        if (getCheckQue.length) {
                            var html = [];
                            for (var i = 0; i < getCheckQue.length; i++) {
                                if (getCheckQue[i].matchQuestion) {
                                    /*
                                     * taskId = 426 相似问题进入流程
                                     * 通过后台返回的参数solutionType判断，1为问题，2为流程
                                     */
                                    if(getCheckQue[i].matchQuestion.solutionType == 1){
                                        html.push('<div class="col-md-12"><a data-num="0" data-name="问题详细"  href="../../web/knowledge/queDetail.html?id=' + getCheckQue[i].matchQuestion.solutionId + '" sid="' + getCheckQue[i].matchQuestion.id + '"  rel="' + getCheckQue[i].matchQuestion.solutionId + '" class="searchDetailQue_a">' + (i + 1) + '.&nbsp;' + getCheckQue[i].matchQuestion.question + '</a></div>');
                                    }else{
                                        html.push('<div class="col-md-12"><a data-num="0" data-name="流程详细"  href="../../web/knowledge/editFlow.html?questionId=' + getCheckQue[i].matchQuestion.solutionId + '&solutionId='+ getCheckQue[i].matchQuestion.solutionId +'&groupId='+getCheckQue[i].matchQuestion.groupId+'" sid="' + getCheckQue[i].matchQuestion.id + '"  rel="' + getCheckQue[i].matchQuestion.solutionId + '" class="searchDetailQue_a">' + (i + 1) + '.&nbsp;' + getCheckQue[i].matchQuestion.question + '</a></div>');
                                    }
                                }
                            }
                            $('#simiYinHide').html('<div class="col-md-12 col-xs-12 m-5" style="padding-left:0;padding-right:0;">此问题已存在以下相似问法：</div><div class="simiQueLtHide"></div>');
                            $('.simiQueLtHide').append(html.join(''));
                            if (e.val() !== '') {
                                var terms = e.val().split('');
                                var aValue = $('.simiQueLtHide').html();
                                $.each(terms, function (i, n) {
                                    if (aValue.indexOf(n) > 0) {
                                        //$('.simiQueLt').highlight(n);
                                    }
                                });
                            }
                            $('#simiYinContainerHide').show();
                        } else {
                            $('#simiYinContainerHide').hide();
                        }
                    }
                }
            }
        } else {
            if (data.message == '该问题已存在！') {
                //yunNotyError('该问题已存在！');
            } else {
                $('#simiYinContainer').hide();
                $('#simiYinContainerHide').hide();
                $("#intelMatchContainer").hide();
                $("#termResuContainer").hide();
                $("#phraseFeat").hide();
            }
        }
    });
}


/*=========新增词性=========*/
//手动选择句式树
var termsetting = {
    view: {
        dblClickExpand: false,
        showIcon: false
    },
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
    async: {
        enable: true,
        url: '../../classes/listClasses?m=11',
        autoParam: ['id'],
        dataFilter: ajaxDataFilter1
    },
    callback: {
        onClick: ZTreeClassTermClick,
        onAsyncSuccess: zTreeOnAsyncSuccess
    }
};
//格式化一步获取的json数据
function ajaxDataFilter1(treeId, parentNode, responseData) {
    if (responseData) {
        if (responseData.status == -1) {
            yunNoty(responseData);
        }
        responseData.list.push({
            Id: -1,
            ParentId: 0,
            Name: '全部分类',
            open: true
        });
        return responseData.list;
    }
    return responseData;
}
function ZTreeClassTermClick(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj('treeTermClass');
    Nodes = zTree.getSelectedNodes();
    $('#modal-intelTerm input[name=treeName]').val(Nodes[0].Name);
    $('#modal-intelTerm input[name=treeId]').val(Nodes[0].Id);
    termList(1);
}
//手动选择句式内容列表
var pageNum = 1;
function termList(pageNum) {
    if (!pageNum) pageNum = 1;
    $('#termTable').tableAjaxLoader2(2);
    $.ajax({
        type: 'post',
        url: '../../KnSentenceGroup/getKnSentenceGroupList?pageSize=8&pageNo=' + pageNum + '&groupId=' + (parseInt($('#modal-intelTerm input[name=treeId]').val()) || ''),
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
                $('#termTable tbody').html(html);
				/*$('#termTable td').click(function() {
                  $(this).parent().find('input[name=match]').iCheck('check');
              });*/

                icheckListInit();
                $('#termTable td input[name=match]').on('ifChecked', function () {
                    var checkedState = $(this).prop('checked');//记录当前选中状态
                    $(this).iCheck('check');
                    if (checkedState) {
                        $(this).iCheck('uncheck');
                    }
                });

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
                $('#termTable').find('tbody').html('<tr><td colspan="2" style=\"text-align:center;\"><i class=\"icon-exclamation-sign\"></i>&nbsp;&nbsp;当前记录为空！</td></tr>');
                $('#termPageList').html('');
            }
        }
    });
}
var sgIds;
$('#modal-intelTerm .addTerm').click(function () {
    var oHtml = '';
    for (var i = 0; i < $('#termTable td .iradio_flat-blue').length; i++) {
        if ($('#termTable td .iradio_flat-blue').eq(i).hasClass('checked')) {
            sgIds = $('#termTable td .iradio_flat-blue').eq(i).parents('tr').attr('id');
            var text = $('#termTable td .iradio_flat-blue').eq(i).parent().siblings().text();
            oHtml = '<label style="width:100%;">' +
                '<input type="radio" name="ckb" checked/>' +
                '<span class="timeTip">' + text + '</span>' +
                '<a href="javascript:;" class="pull-right delSentence">删除</a>' +
                '</label>';
            $('#myTabContent #relGroup').html(oHtml);
			/*$(".timeTip").tooltip({
                'placement':'right'
            });*/
            icheckListInit();
            sentenceInter();
        }
    }
});

//手动选择模态框
$('#modal-intelTerm').on('show.bs.modal', function () {
    $.fn.zTree.init($('#treeTermClass'), termsetting, []);
    $('#affix1inner').slimScroll({
        height: '400px',
        allowPageScroll: false
    });
    termList(1);
});
//已选择的句式点击删除
$('#relGroup').on('click', '.delSentence', function () {
    $('#relGroup').html('');
    $('#similarGroup').html('').addClass('hide');
});
//选择智能句式组后匹配出对应下面的句式
function sentenceInter() {
    var html = '';
    $.ajax({
        type: 'post',
        url: '../../KnSentenceItem/getKSItemList',
        async: true,
        cache: true,
        data: { 'sgId': sgIds },
        success: function (data) {
            if (data.status == 0) {
                var list = data.knList;
                if (list && list.length > 0) {
                    html = '系统已生成下列几种句式：<br />';
                    if (list.length >= 5) {
                        for (var i = 0; i < 5; i++) {
                            html += (i + 1) + '.' + list[i].SiName + '<br />';
                        }
                    } else {
                        for (var i = 0; i < list.length; i++) {
                            html += (i + 1) + '.' + list[i].SiName + '<br />';
                        }
                    }
                    $('#similarGroup').html(html).removeClass('hide');
                }

            }
        }
    });
}
//点击实体增加减少时
$('#EntitysList').on('click', 'a[name=delentityInput]', function () {
    if ($('#EntitysList a[name=delentityInput]').size() > 1) {
        $(this).parent().parent().remove();
    } else {

    }
});

$('#EntitysList').on('click', 'a[name=addentityInput]', function () {
    if ($('#EntitysList a[name=addentityInput]').size() < 4) {
        $('#EntitysList').append('<div class="col-md-12" style="padding-left:0;padding-right:0;margin-top: 10px;">' +
            '<div class="col-md-7" style="padding:0;">' +
            '<input type="text" class="entitys"/>' +
            '</div>' +
            '<div class="col-md-4 m-t-5 m-l-5" style="padding:0;">' +
            ' <a href="javascript:;" name="delentityInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>' +
            '<a href="javascript:;" name="addentityInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a>' +
            '</div></div>');
    }
});


/**
* 手动设置智能推荐确定
*/
$('#queManualConfirm').click(function () {
    var addFlag = false;
    var id = getSelectedIds_aQue();
    var SolutionId = getSelectedSolutionIds_aQue();
    var targetInput = $('#queManual [name=postQueInput]').eq(QandFIndex);
    if (targetInput.val() === '') {
        addFlag = true;
    }

    if(id){
      targetInput.attr('rel', id);
      targetInput.attr('Srel', SolutionId);
      targetInput.val($('#queDiv #list-tr-' + id).children('td').eq(1).html());
      targetInput.parent().prev().children().removeClass('btn-primary').addClass('btn-white');
      $('#queManualModal').modal('hide');
      if (addFlag) {
          if ($('#queManual a[name=addpostInput]').size() < 5) {
              $('#queManual').append('<div class="QueContainer row"><div class="form-group col-xs-2"><button type="button" class="btn btn-primary zntjo">智能推荐</button></div><div class="form-group col-xs-8"><input class="form-control" type="text" readOnly style="cursor:pointer;" placeholder="此条为智能推荐,可选择问题手动推荐" name="postQueInput" rel="0"></div><div class="form-group col-xs-2 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>&nbsp;<a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>');
          }
      }
    }else{
        yunNotyError('请选择推荐问题！');
    }

});

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
    if (typeof cboxs == 'undefined') {
        return -1;
    }
    var inputvalue = '';
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
    if (typeof cboxs == 'undefined') {
        return -1;
    }
    var inputvalue = '';
    for (var i = 0; i < cboxs.length; i++) {
        if (cboxs[i].checked === true) {
            inputvalue = cboxs[i].getAttribute('solutionid');
        }
    }
    return inputvalue;
}
/**
* 智能推荐列表的滚动条
*/
// $('#queManualQueTable').slimScroll({
// height: '400px'
// });

// $('#queManualFlowTable').slimScroll({
// height: '400px'
// });

//智能推荐模态窗中的树
function showMenu() {
    var cityObj = $('#queSel');
    var cityOffset = $('#queSel').offset();
    $('#menuContent').slideDown('fast');
    $('body').bind('mousedown', onBodyDown);
    $('#classTree').slimScroll({
        height: '300px'
    });
}
function hideMenu() {
    $('#menuContent').fadeOut('fast');
    $('body').unbind('mousedown', onBodyDown);
}
function onBodyDown(event) {
    if (!(event.target.id == 'menuBtn' || event.target.id == 'menuContent' || $(event.target).parents('#menuContent').length > 0)) {
        hideMenu();
    }
}

//智能推荐问题模态框显示
function showQueModal() {
    $('#queManualModal').modal('show');
}

$('#queManualModal').on('show.bs.modal', function () {
    $.fn.zTree.init($('#treeHide'), hidesetting, []);
    hideMenu();
});

//智能推荐问题模态窗列表
function sQue(pageNo) {
    if (!pageNo) pageNo = 1;
    $('#ansList').tableAjaxLoader2(2);
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,//不从缓存中去数据
        url: encodeURI('../../question/getQueListByMode?pageSize=8&pageNo=' + pageNo + '&solutionType=1'),
        data: $('#search_Que').serialize(),
        success:
            function (data) {
                if (data.status === 0) {
                    if (data.questionList.length > 0) {
                        var html = '';
                        var existIds = [];
                        $('#queManual').find('input[name=postQueInput]').each(function () {
                            existIds.push($(this).attr('rel') * 1);
                        });
                        for (var i = 0; i < data.questionList.length; i++) {
                            //禁用列表中已经存在的问题
                            if ($.inArray(data.questionList[i].Id, existIds) >= 0) {
                                html += '<tr id="list-tr-' + data.questionList[i].Id + '">';
                                html += '<td><input disabled="" type="radio" name="row_sel1" value="' + data.questionList[i].Id + '" solutionId="' + data.questionList[i].SolutionId + '"></td>';
                                if (data.questionList[i].AnswerStatus == -4) {
                                    html += '<td class="dueTd">' + data.questionList[i].Question + '<a class="btn btn-xs btn-danger m-l-5">已过期</a></td>';
                                } else {
                                    html += '<td style=\'word-break: break-all;\'>' + data.questionList[i].Question + '</td>';
                                }
                                html += '</tr>';
                            } else {
                                html += '<tr id="list-tr-' + data.questionList[i].Id + '">';
                                html += '<td><input type="radio" name="row_sel1" value="' + data.questionList[i].Id + '" solutionId="' + data.questionList[i].SolutionId + '"></td>';
                                if (data.questionList[i].AnswerStatus == -4) {
                                    html += '<td class="dueTd">' + data.questionList[i].Question + '<a class="btn btn-xs btn-danger m-l-5">已过期</a></td>';
                                } else {
                                    html += '<td style=\'word-break: break-all;\'>' + data.questionList[i].Question + '</td>';
                                }
                                html += '</tr>';
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
        type: 'post',
        datatype: 'json',
        cache: false,//不从缓存中去数据
        url: encodeURI('../../question/getQueListByMode?pageSize=8&pageNo=' + pageNo + '&solutionType=2'),
        data: $('#search_Que').serialize(),
        success:
            function (data) {
                if (data.status === 0) {
                    if (data.questionList.length > 0) {
                        var html = '';
                        var existIds = [];
                        $('#queManual').find('input[name=postQueInput]').each(function () {
                            existIds.push($(this).attr('rel') * 1);
                        });
                        for (var i = 0; i < data.questionList.length; i++) {
                            //禁用列表中已经存在的问题
                            if ($.inArray(data.questionList[i].Id, existIds) >= 0) {
                                html += '<tr id="list-tr-' + data.questionList[i].Id + '">';
                                html += '<td><input disabled="" type="radio" name="row_sel2" value="' + data.questionList[i].Id + '" solutionId="' + data.questionList[i].SolutionId + '"></td>';
                                if (data.questionList[i].AnswerStatus == -4) {
                                    html += '<td class="dueTd">' + data.questionList[i].Question + '<a class="btn btn-xs btn-danger b-l-5">已过期</a></td>';
                                } else {
                                    html += '<td style=\'word-break: break-all;\'>' + data.questionList[i].Question + '</td>';
                                }
                                html += '</tr>';
                            } else {
                                html += '<tr id="list-tr-' + data.questionList[i].Id + '">';
                                html += '<td><input type="radio" name="row_sel2" value="' + data.questionList[i].Id + '" solutionId="' + data.questionList[i].SolutionId + '"></td>';
                                if (data.questionList[i].AnswerStatus == -4) {
                                    html += '<td class="dueTd">' + data.questionList[i].Question + '<a class="btn btn-xs btn-danger b-l-5">已过期</a></td>';
                                } else {
                                    html += '<td style=\'word-break: break-all;\'>' + data.questionList[i].Question + '</td>';
                                }
                                html += '</tr>';
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

//选择语音
$('#voiceModel').on('show.bs.modal', function () {
    voiceList(1);
});

function voiceList(pageNo, type1) {
    if (!pageNo) pageNo = 1;
    if (!type1) type1 = '2';
    $('#voiceList').tableAjaxLoader2(3);
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        //不从缓存中去数据
        url: encodeURI('../../material/list?pageSize=' + 5 + '&pageNo=' + pageNo + '&type=' + type1),
        data: $('#search_Voice').serialize(),
        success: function (data) {
            if (data.status === 0) {
                if (data.list.length > 0) {
                    var html = '';
                    for (var i = 0; i < data.list.length; i++) {
                        html += '<tr id="list-tr-' + data.list[i].Id + '">';
                        html += '<td><input type="radio" name="row_sel_voice" class="select_row" value="' + data.list[i].Id + '"  rel="' + data.list[i].Path + '"/></td>';
                        html += '<td>' + data.list[i].Name + '</td>';
                        html += '<td><div id="jquery_jplayer_' + i + '"class="jp-jplayer" path="../../' + data.list[i].Path + '"></div><div id="jp_container_' + i + '"class="jp-audio"role="application"aria-label="media player"><div class="jp-type-single"><div class="jp-gui jp-interface"><div class="jp-controls"><button class="jp-play"role="button"tabindex="0">play</button><button class="jp-stop"role="button"tabindex="0">stop</button></div><div class="jp-progress"><div class="jp-seek-bar"><div class="jp-play-bar"></div></div></div><div class="jp-time-holder"><div class="jp-current-time"role="timer"aria-label="time">&nbsp;</div><div class="jp-duration"role="timer"aria-label="duration">&nbsp;</div><div class="jp-toggles"><button class="jp-repeat"role="button"tabindex="0">repeat</button></div></div></div><div class="jp-no-solution"><span>Update Required</span>To play the media you will need to either update your browser to a recent version or update your<a href="http://get.adobe.com/flashplayer/"target="_blank">Flash plugin</a>.</div></div></div></td>';
                        html += '</tr>';
                    }
                    $('#voiceList').find('tbody').html(html);
                    icheckInit();
                    $('#timePicker').on('ifChecked', function () {
                        $('#dateTime').show();
                    }).on('ifUnchecked', function () {
                        $('#dateTime').hide();
                        $('#ansRuleForm [name=StartTime]').val('');
                        $('#ansRuleForm [name=EndTime]').val('');
                    });
                    $('#voiceList td').click(function () {
                        $(this).parent().find('.select_row').iCheck('check');
                    });
                    //下面开始处理分页
                    var options = {
                        currentPage: data.currentPage,
                        totalPages: data.totlePages,
                        onPageClicked: function (event, originalEvent, type, page) {
                            voiceList(page, type1);
                        }
                    };
                    setPage('voicepageList', options);
                    if (data.list[0]) {
                        for (var j = 0; j < data.list.length; j++) {
                            //jplayer
                            $('#jquery_jplayer_' + j).jPlayer({
                                ready: function () {
                                    $(this).jPlayer('setMedia', {
                                        m4a: $(this).attr('path'),
                                    });
                                },
                                supplied: 'm4a, oga',
                                cssSelectorAncestor: '#jp_container_' + j,
                                wmode: 'window',
                                globalVolume: true,
                                useStateClassSkin: true,
                                autoBlur: false,
                                smoothPlayBar: true,
                                keyEnabled: true
                            });
                        }
                    }
                } else {
                    if ($('#search_Voice input[name=name]').val() !== '') {
                        $('#voiceList').find('tbody').html('<tr><td colspan=\"3\"  style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;搜索结果为空！</td></tr>');
                    } else {
                        $('#voiceList').find('tbody').html('<tr><td colspan=\"3\"  style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！<br><a href="../../web/material/addSrc.html" data-num="0" data-name="添加素材">点击跳转到添加素材页面</a></td></tr>');
                    }
                    $('#voicepageList').html('');
                }
            } else {
                yunNoty(data);
            }
        }
    });
}

$('#selVoiceBtn').click(function () {
    var id = getSelectedIds_voice();
    $('#voiceId').val(id);
    $('#ans_voice button').html($('#voiceDiv #list-tr-' + id).children('td').eq(1).html());
    if ($('#ans_voice button').html() === '') {
        $('#ans_voice button').hide();
    } else {
        $('#ans_voice button').show();
    }
    $('#voiceModel').modal('hide');
});
function getSelectedIds_voice() {
    var cboxs = document.getElementsByName('row_sel_voice');
    if (typeof cboxs == 'undefined') {
        return -1;
    }
    var inputvalue = '';
    for (var i = 0; i < cboxs.length; i++) {
        if (cboxs[i].checked === true) {
            inputvalue = cboxs[i].value;
        }
    }
    return inputvalue;
}

//选择第三方
$('#otherModel').on('show.bs.modal', function () {
    otherList(1);
});

//第三方列表
function otherList(pageNo) {
    if (!pageNo) pageNo = 1;
    $('#otherList').tableAjaxLoader2(3);
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        //不从缓存中去数据
        url: encodeURI('../../thirdOpen/listThirdOpen?type=' + 0 + '&pageSize=' + 5 + '&pageNo=' + pageNo),
        data: $('#search_Other').serialize(),
        success: function (data) {
            if (data.status === 0) {
                if (data.list.length > 0) {
                    var html = '';
                    for (var i = 0; i < data.list.length; i++) {
                        html += '<tr id="list-tr-' + data.list[i].Id + '">';
                        html += '<td><input type="radio" name="row_sel_other" class="select_row" value="' + data.list[i].Id + '"/></td>';
                        html += '<td>' + data.list[i].Url + '</td>';
                        html += '<td>' + limitstr(data.list[i].Info, 20) + '</td>';
                        html += '</tr>';
                    }
                    $('#otherList').find('tbody').html(html);
                    //下面开始处理分页
                    var options = {
                        currentPage: data.currentPage,
                        totalPages: data.totlePages,
                        onPageClicked: function (event, originalEvent, type, page) {
                            otherList(page);
                        }
                    };
                    setPage('otherpageList', options);
                    icheckInit();
                    $('#timePicker').on('ifChecked', function () {
                        $('#dateTime').show();
                    }).on('ifUnchecked', function () {
                        $('#dateTime').hide();
                        $('#ansRuleForm [name=StartTime]').val('');
                        $('#ansRuleForm [name=EndTime]').val('');
                    });
                    $('#otherList td').click(function () {
                        $(this).parent().find('.select_row').iCheck('check');
                    });
                } else {
                    if ($('#search_Other input[name=info]').val() !== '') {
                        $('#otherList').find('tbody').html('<tr><td colspan=\"3\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;搜索结果为空！</td></tr>');
                    } else {
                        $('#otherList').find('tbody').html('<tr><td colspan=\"3\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！<br><a href="../../web/platform/portList.html" data-num="0" data-name="接口列表">点击跳转到接口列表</a></td></tr>');
                    }
                    $('#otherpageList').html('');
                }
            } else {
                yunNoty(data);
            }
        }
    });
}

$('#selOtherBtn').click(function () {
    var id = getSelectedIds_other();
    $('#otherId').val(id);
    $('#ans_other button').html($('#otherDiv #list-tr-' + id).children('td').eq(2).html());
    if ($('#ans_other button').html() === '') {
        $('#ans_other button').hide();
    } else {
        $('#ans_other button').show();
    }
    $('#otherModel').modal('hide');
});

$('#search_Other input[name=info]').keyup(function (event) {
    if (event.keyCode == 13) {
        otherList();
    }
});

function getSelectedIds_other() {
    var cboxs = document.getElementsByName('row_sel_other');
    if (typeof cboxs == 'undefined') {
        return -1;
    }
    var inputvalue = '';
    for (var i = 0; i < cboxs.length; i++) {
        if (cboxs[i].checked === true) {
            inputvalue = cboxs[i].value;
        }
    }
    return inputvalue;
}


//选择自定义AskToken
$('#askModel').on('show.bs.modal', function () {
    askList(1);
});

//AskToken列表
function askList(pageNo) {
    if (!pageNo) pageNo = 1;
    $('#askList').tableAjaxLoader2(3);
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        //不从缓存中去数据
        url: encodeURI('../../thirdOpen/listThirdOpen?type=' + 1 + '&pageSize=' + 5 + '&pageNo=' + pageNo),
        data: $('#search_Ask').serialize(),
        success: function (data) {
            if (data.status === 0) {
                if (data.list.length > 0) {
                    var html = '';
                    for (var i = 0; i < data.list.length; i++) {
                        html += '<tr id="list-ask-' + data.list[i].Id + '">';
                        html += '<td><input type="radio" name="row_sel_ask" class="select_row" value="' + data.list[i].Id + '"/></td>';
                        html += '<td>' + data.list[i].Url + '</td>';
                        html += '<td>' + limitstr(data.list[i].Info, 20) + '</td>';
                        html += '</tr>';
                    }
                    $('#askList').find('tbody').html(html);
                    //下面开始处理分页
                    var options = {
                        currentPage: data.currentPage,
                        totalPages: data.totlePages,
                        onPageClicked: function (event, originalEvent, type, page) {
                            askList(page);
                        }
                    };
                    setPage('askpageList', options);
                    icheckInit();
                    $('#timePicker').on('ifChecked', function () {
                        $('#dateTime').show();
                    }).on('ifUnchecked', function () {
                        $('#dateTime').hide();
                        $('#ansRuleForm [name=StartTime]').val('');
                        $('#ansRuleForm [name=EndTime]').val('');
                    });
                    $('#askList td').click(function () {
                        $(this).parent().find('.select_row').iCheck('check');
                    });
                } else {
                    if ($('#search_Ask input[name=info]').val() !== '') {
                        $('#askList').find('tbody').html('<tr><td colspan=\"3\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;搜索结果为空！</td></tr>');
                    } else {
                        $('#askList').find('tbody').html('<tr><td colspan=\"3\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！<br><a href="../../web/platform/askTokenList.html" data-num="0" data-name="接口列表">点击跳转到接口列表</a></td></tr>');
                    }
                    $('#askpageList').html('');
                }
            } else {
                yunNoty(data);
            }
        }
    });
}

$('#selAskBtn').click(function () {
    var id = getSelectedIds_ask();
    $('#askId').val(id);
    $('#ans_ask button').html($('#askDiv #list-ask-' + id).children('td').eq(2).html());
    if ($('#ans_ask button').html() === '') {
        $('#ans_ask button').hide();
    } else {
        $('#ans_ask button').show();
    }
    $('#askModel').modal('hide');
});

$('#search_Ask input[name=info]').keyup(function (event) {
    if (event.keyCode == 13) {
        otherList();
    }
});

function getSelectedIds_ask() {
    var cboxs = document.getElementsByName('row_sel_ask');
    if (typeof cboxs == 'undefined') {
        return -1;
    }
    var inputvalue = '';
    for (var i = 0; i < cboxs.length; i++) {
        if (cboxs[i].checked === true) {
            inputvalue = cboxs[i].value;
        }
    }
    return inputvalue;
}




//选择表单
$('#formModel').on('show.bs.modal', function () {
    formList(1);
});

//表单列表
function formList(pageNo) {
    if (!pageNo) pageNo = 1;
    $('#formList').tableAjaxLoader2(3);
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        //不从缓存中去数据
        url: encodeURI('../../StepForm/list?pageSize=' + 10 + '&pageNo=' + pageNo + '&orderType=4'),
        success: function (data) {
            if (data.status === 0) {
                if (data.List.length > 0) {
                    var html = '';
                    for (var i = 0; i < data.List.length; i++) {
                        html += '<tr id="list-tr-' + data.List[i].Id + '">';
                        html += '<td><input type="radio" name="row_sel_form" class="select_row" value="' + data.List[i].Id + '"/></td>';
                        html += '<td>' + data.List[i].Name + '</td>';
                        html += '<td>' + data.List[i].AddTime + '</td>';
                        html += '</tr>';
                    }
                    $('#formList').find('tbody').html(html);
                    //下面开始处理分页
                    var options = {
                        currentPage: data.currentPage,
                        totalPages: data.totlePages,
                        onPageClicked: function (event, originalEvent, type, page) {
                            otherList(page);
                        }
                    };
                    setPage('formpageList', options);
                    icheckInit();
                    $('#timePicker').on('ifChecked', function () {
                        $('#dateTime').show();
                    }).on('ifUnchecked', function () {
                        $('#dateTime').hide();
                        $('#ansRuleForm [name=StartTime]').val('');
                        $('#ansRuleForm [name=EndTime]').val('');
                    });
                    $('#formList td').click(function () {
                        $(this).parent().find('.select_row').iCheck('check');
                    });
                } else {
                    $('#formList').find('tbody').html('<tr><td colspan=\"3\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
                    $('#formpageList').html('');
                }
            } else {
                yunNoty(data);
            }
        }
    });
}

$('#selFormBtn').click(function () {
    var id = getSelectedIds_form();
    $('#formId').val(id);
    $('#ans_form button').html($('#formDiv #list-tr-' + id).children('td').eq(1).html());
    if ($('#ans_form button').html() === '') {
        $('#ans_form button').hide();
    } else {
        $('#ans_form button').show();
    }
    $('#formModel').modal('hide');
});

function getSelectedIds_form() {
    var cboxs = document.getElementsByName('row_sel_form');
    if (typeof cboxs == 'undefined') {
        return -1;
    }
    var inputvalue = '';
    for (var i = 0; i < cboxs.length; i++) {
        if (cboxs[i].checked === true) {
            inputvalue = cboxs[i].value;
        }
    }
    return inputvalue;
}


//选择视频
$('#videoModel').on('show.bs.modal', function () {
    videoList(1);
});
var uploader;
$('#videoModel').on('shown.bs.modal', function () {
    resetUploader(3, '#videoUpload');
});
$(videoModel).on('hide.bs.modal', function () {
    uploader.destroy();
});

function videoList(pageNo, type1) {
    if (!pageNo) pageNo = 1;
    if (!type1) type1 = '3';
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        //不从缓存中去数据
        url: encodeURI('../../material/list?pageSize=' + 6 + '&pageNo=' + pageNo + '&type=' + type1),
        success: function (data) {
            if (data.status === 0) {
                if (data.list.length > 0) {
                    $('#videoibh').css('display', 'none');
                    var renderTo = $('#videoBody');
                    $('#videoBody').html('');
                    var ul = $('<ul id=\'videoUl\'></ul>').appendTo(renderTo);
                    for (var i = 0; i < data.list.length; i++) {
                        var li = $('<li class=\'videoLi\'></li>').appendTo(ul);
                        var src = data.list[i].Path;
                        var video = $('<video src=\'/' + src + '\' controls=\'controls\'>您的浏览器不支持 video 标签。</video>').appendTo(li);
                        li.data('Id', data.list[i].Id);
                        li.data('src', data.list[i].Path);
                    }
                    $('.videoLi').each(function () {
                        $(this).click(function () {
                            $('#vodeoId').val($(this).data('Id'));
                            var src = $(this).data('src');
                            $('#vodeoId').prevAll().children('video').attr('src', '/' + src);
                            $('#vodeoId').prev().css('display', 'block');

                            if ($('#delVideo')[0] == undefined) {
                                $('#videoShow').after('<div style="margin-top:4px;"><div class="btn btn-default" id="delVideo">删除</div></div>');
                            }
                            $('#videoModel').modal('hide');

                        });
                    });
                    //下面开始处理分页
                    var options = {
                        currentPage: data.currentPage,
                        totalPages: data.totlePages,
                        onPageClicked: function (event, originalEvent, type, page) {
                            videoList(page, type1);
                        }
                    };
                    setPage('videopageList', options);
                } else {
                    $('#videoBody').html('');
                    $('#videoibh').css('display', 'block');
                }
            }
        }
    });
}

$('body').on('click', '#delVideo', function () {
    $('#videoShow').children('video').attr('src', '');
    $('#videoShow').css('display', 'none');
    $('#vodeoId').val('');
    $(this).parent().remove();
});




//选择图片
$('#onlyPictureModel').on('show.bs.modal', function () {
    $('#ibh').hide();
    onlyImgTextList(1);
});
$('#onlyPictureModel').on('shown.bs.modal', function () {
    resetUploader(1, '#onlyImgUpload');
});
$('#onlyPictureModel').on('hide.bs.modal', function () {
    uploader.destroy();
});

//生成uploader
function resetUploader(type, render) {

    //上传素材
    uploader = WebUploader.create({
        server: '../../material/jQueryFileUpload?type=' + type + '&materialType=' + type,
        swf: '../common/js/Uploader.swf',
        pick: $(render),
        duplicate: true,
        auto: true,
    });
    //加入队列之前
    uploader.on('beforeFileQueued', function (file) {
        if (!file.size) {
            Base.gritter('文件大小为空！', false);
        }
        if (file.size > 10240000) {
            var msg = '文件大小不能超过10M';
            Base.gritter(msg, false);
            return false;
        }

    });
    //获取服务端返回的数据
    uploader.on('uploadAccept', function (object, data) {
        var error = data.files[0].error,
            msg = '上传文件成功';

        if (error) {
            Base.gritter(error, false);
        } else {
            Base.gritter(msg, true);
            if (type == 1) {
                onlyImgTextList(1);
            }
            else if (type == 3) {
                videoList(1, 3);
            }
        }
    });
    //上传开始
    uploader.on('startUpload', function (file, percentage) {
        $('.progress-striped').show();
    });
    //上传进度
    uploader.on('uploadProgress', function (file, percentage) {
        $('.progress-bar').css({ 'width': percentage * 100 + '%' });
    });
    //限制单次上传数量
    uploader.on('uploadFinished', function (object, data) {
        $('.progress-bar').css({ 'width': 0 });
        $('.progress-striped').hide();
        uploader.reset();
    });
}

//图片列表
function onlyImgTextList(pageNo) {
    if (!pageNo) pageNo = 1;
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        //不从缓存中去数据
        url: encodeURI('../../material/list?pageSize=' + 6 + '&pageNo=' + pageNo + '&type=1'),
        success: function (json) {
            if (json.status === 0) {
                if (json.list.length === 0) {
                    $('#op').empty();
                    $('#onlyPictureibh').css('display', 'block');
                } else {
                    $('#onlyPictureibh').css('display', 'none');
                    $('#op').empty();
                    var renderTo = ('#op');
                    var ul = $('<ul classs=\'onlyImgUl\'></ul>').appendTo(renderTo);
                    for (var i in json.list) {  //图片生成
                        var li = $('<li class=\'onlyImgLi\'></li>').appendTo(ul);
                        var img = $('<img src=\'/' + json.list[i].Path + '\' />').appendTo(li);
                        li.data('Id', json.list[i].Id);
                        li.data('src', json.list[i].Path);
                    }

                    $('.onlyImgLi').each(function () {
                        $(this).click(function () {
                            $('#OnlyPictureId').val($(this).data('Id'));
                            var src = $(this).data('src');
                            $('#OnlyPictureId').prevAll().children('img').attr('src', '/' + src);
                            $('#OnlyPictureId').prev().css('display', 'block');

                            if ($('#delOnlyPicture')[0] == undefined) {
                                $('#OnlyPictureShow').after('<div style="margin-top:4px;"><div class="btn btn-default" id="delOnlyPicture">删除</div></div>');
                            }
                            $('#onlyPictureModel').modal('hide');

                        });
                    });

                    //下面开始处理分页
                    var options = {
                        currentPage: json.currentPage,
                        totalPages: json.totlePages,
                        onPageClicked: function (event, originalEvent, type, page) {
                            onlyImgTextList(page);
                        }
                    };
                    setPage('OnlyPicturepageList', options);
                }
            } else {
                yunNoty(json.result);
            }

        }
    });
}

$('body').on('click', '#delOnlyPicture', function () {
    $('#OnlyPictureShow').children('img').attr('src', '');
    $('#OnlyPictureShow').css('display', 'none');
    $('#OnlyPictureId').val('');
    $(this).parent().remove();
});







//选择图文
$('#pictureModel').on('show.bs.modal', function () {
    $('#ibh').hide();
    imgTextList(1);
});

//图文列表
function imgTextList(pageNo) {
    if (!pageNo) pageNo = 1;
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        //不从缓存中去数据
        url: encodeURI('../../Wxappmsg/list?pageSize=' + 6 + '&pageNo=' + pageNo),
        success: function (json) {
            if (json.result.status === 0) {
                if (json.result.list.length === 0) {
                    $('#ibh').show();
                } else {
                    $('#ib0').empty();
                    $('#ib1').empty();
                    $('#ib2').empty();
                    /*
                        黄世鹏，
                        修改：后台接口重构，将返回的参数名第一个字母大写
                    */
                    for (var i = 0; i < json.result.list.length; i++) {
                        var imgTxtHtml = '';
                        if (json.result.list[i].WxappmsgDetails.length == 1) {
                            imgTxtHtml += '<div class="m-t-5 m-b-5" name="pictureBlock">';
                            imgTxtHtml += '<div style="border: 1px solid #D4D4D4; border-radius: 3px; max-height: 280px; overflow: hidden;padding: 5px;">';
                            imgTxtHtml += '<input type="hidden" class="idValue" value="' + json.result.list[i].Id + '"/>';
                            imgTxtHtml += '<div class="head-msg-item" style="display: inline-block; width: 100%; position: relative;">';
                            imgTxtHtml += '<h4 style="max-width: 320px;position: absolute;background: none repeat scroll 0 0 rgba(0, 0, 0, 0.6) !important;bottom: 0;margin: 0;width: 100%;color: #fff;overflow: hidden;"><span style="word-wrap: break-word;padding: 0 4px;line-height: 28px;">' + json.result.list[i].WxappmsgDetails[0].Title + '</span></h4>';
                            imgTxtHtml += '<p style="padding: 4px 8px;"><span>' + json.result.list[i].TimeStr + '</span></p>';
                            imgTxtHtml += '<div style="height: 160px; overflow: hidden; width: 100%;"><img src="' + json.result.list[i].WxappmsgDetails[0].ImgUrl + '" style="min-height: 50px; width: 100%; max-width: 320px;"></div>';
                            imgTxtHtml += '</div></div>';
                        } else {
                            imgTxtHtml += '<div class="m-t-5 m-b-5" name="pictureBlock">';
                            imgTxtHtml += '<div style="border: 1px solid #D4D4D4; border-radius: 3px;">';
                            imgTxtHtml += '<input type="hidden" class="idValue" value="' + json.result.list[i].Id + '"/>';
                            imgTxtHtml += '<div class="head-msg-item" style="display: inline-block; width: 100%; position: relative;">';
                            imgTxtHtml += '<h4 style="max-width: 320px;position: absolute;background: none repeat scroll 0 0 rgba(0, 0, 0, 0.6) !important;bottom: 0;margin: 0;width: 100%;color: #fff;overflow: hidden;"><span style="word-wrap: break-word;padding: 0 4px;line-height: 28px;">' + json.result.list[i].WxappmsgDetails[0].Title + '</span></h4>';
                            imgTxtHtml += '<p style="padding: 4px 8px;"><span>' + json.result.list[i].TimeStr + '</span></p>';
                            imgTxtHtml += '<div style="height: 160px; overflow: hidden; width: 100%;"><img src="' + json.result.list[i].WxappmsgDetails[0].ImgUrl + '" style="min-height: 50px; width: 100%; max-width: 320px;"></div>';
                            imgTxtHtml += '</div>';
                            for (var j = 1; j < json.result.list[i].WxappmsgDetails.length; j++) {
                                imgTxtHtml += '<div style="border-top: 1px solid #D4D4D4;"></div>';
                                imgTxtHtml += '<div class="sub-msg-item" style="max-width: 320px; margin:5px 0; padding:10px 12px;">';
                                imgTxtHtml += '<div style="display: table;"></div>';
                                imgTxtHtml += '<div style="width: 66.67%;float: left;min-height: 1px;"><h4><span>' + json.result.list[i].WxappmsgDetails[j].Title + '</span></h4></div>';
                                imgTxtHtml += '<div style="width: 33.33%;float: left;min-height: 1px;"><img src="' + json.result.list[i].WxappmsgDetails[j].ImgUrl + '" style="border: 1px solid #b2b8bd;display: block;max-width: 100%;height: auto;"></div>';
                                imgTxtHtml += '<div style="display: table; clear: both;"></div>';
                                imgTxtHtml += '</div>';
                            }
                            imgTxtHtml += '</div></div>';
                        }
                        $('#ib' + (i % 3)).append(imgTxtHtml);
                    }
                    $('div[name=pictureBlock]').click(function () {
                        $('#pictureId').val($(this).find('input.idValue').val());
                        $(this).children().css('min-width', '322px');
                        $('#pictureShow').html($(this).prop('innerHTML')).css('display', 'inline-block');
                        if ($('#delPicture')[0] == undefined) {
                            $('#pictureShow').after('<div><div class="btn btn-default" id="delPicture">删除</div></div>');
                        }
                        $(this).children().find('div.thumbnail').css('border-color', 'red');
                        $('#pictureModel').modal('hide');
                    });
                    //下面开始处理分页
                    var options = {
                        currentPage: json.result.currentPage,
                        totalPages: json.result.totlePages,
                        onPageClicked: function (event, originalEvent, type, page) {
                            imgTextList(page);
                        }
                    };
                    setPage('picturepageList', options);
                }
            } else {
                yunNoty(json.result);
            }

        }
    });
}

$('body').on('click', '#delPicture', function () {
    $('#pictureShow').html('').css('display', 'none');
    $('#pictureId').val('');
    $(this).parent().remove();
});

//switchery 初始化
function renderSwitcher() {
    var green = '#00acac',
        red = '#ff5b57',
        blue = '#348fe2',
        purple = '#727cb6',
        orange = '#f59c1a',
        black = '#2d353c';
    if ($('[data-render=switchery]').length !== 0) {
        $('[data-render=switchery]').each(function () {
            var e = green;
            if ($(this).attr('data-theme')) {
                switch ($(this).attr('data-theme')) {
                    case 'red':
                        e = red;
                        break;
                    case 'blue':
                        e = blue;
                        break;
                    case 'purple':
                        e = purple;
                        break;
                    case 'orange':
                        e = orange;
                        break;
                    case 'black':
                        e = black;
                        break;
                }
            }
            var t = {};
            t.color = e;
            t.secondaryColor = $(this).attr('data-secondary-color') ? $(this).attr('data-secondary-color') : '#dfdfdf';
            t.className = $(this).attr('data-classname') ? $(this).attr('data-classname') : 'switchery';
            t.disabled = $(this).attr('data-disabled') ? true : false;
            t.disabledOpacity = $(this).attr('data-disabled-opacity') ? $(this).attr('data-disabled-opacity') : 0.5;
            t.speed = $(this).attr('data-speed') ? $(this).attr('data-speed') : '0.5s';
            var n = new Switchery(this, t);
        });
    }
}
renderSwitcher();
var switchStatus = 0;
$('#intelMatchContainer input[data-change="check-switchery-state-text"]').on('change', function () {
    switchStatus = $(this).attr('checked') ? 1 : 0;
    if (switchStatus == 0) {
        //不启用
        $('#switchContent').css('display', 'none');
    }
    if (switchStatus == 1) {
        //启用
        $('#switchContent').css('display', 'block');
    }
});


//新增问题ajax
var flag_add = false;
function Add() {
    var comeFromFlag = getUrlParam('ComeFrom');
    //问题内容
    var question = $('#question').val();
    if (question === '' || question.length < 2 || question.length > 200) {
        yunNotyError('问题长度需在2-200个字符之间！');

        return false;

    }
    //问题分组ID
    var groupId = $('input[name=ClassesIds]').val();
    if (groupId === '') {
        yunNotyError('请选择问题分类！');
        $('#QuestionClassModel').modal('show');
        return false;
    }

    //如果启用则判断实体、句式组不能为空
    if (switchStatus == 1) {
        if ($('#EntitysList .entitys').val() == '') {
            yunNotyError('实体不能为空！');
            return false;
        }
        if ($('#macthPharse').text() == '') {
            if ($('#relGroup').html() == '') {
                yunNotyError('请手动选择句式组！');
                return false;
            }
        }
    }

    //标签id集合
    var labelidsL = $('input[name=labelesIds]').val();

    var uurl = '';
    if (transferStationFlag) {
        if (comeFromFlag == 1) {
            uurl = '/landray/LandrayQuestion/editQueStatus';
        } else if (comeFromFlag == 0) {
            uurl = '/QAToKnowledge/editByQAId';
        } else if (comeFromFlag == 2) {
            uurl = '/landray/LandrayQuestion/editThirdKnowledge';
        }
    } else {
        uurl = '/question/doAddQueAndAns';
    }
    //消息类型 0文本 1图文 2富文本 3声音 4第三方 6流程 7报表
    var mode = -1;
    //图文或语音或第三方ID
    var modeValue = '';
    //问题生效否0是1
    var answerTimeLiness = 0;
    //问题生效起
    var answerStartTime = '';
    //问题生效止
    var answerEndTime = '';
    //答案内容
    var answer = '';
    //推荐模式 0关 1手动 2智能
    var suggestMode = 0;
    //第三方链接
    var thirdUrl = '';
    //推荐问题ID
    var sugQIds = '';
    //推荐问题solutionID
    var sugSids = '';
    //是否重复添加
    var isAgain = false;
    //答案生效规则
    var effectiveRules = [];
    //相似问法
    var similarQues = '';
    var editIfs = '';
    var wSgId = '';
    if ($('#text').hasClass('active')) {
        mode = 0;
        answer = $('#ans_text').val();
        if (answer === '' || answer.length < 2 || answer.length > 200) {
            yunNotyError('答案长度需在2-200个字符之间！');
            return false;
        }
    } else if ($('#richtext').hasClass('active')) {
        mode = 2;
        answer = UE.getEditor('ans_richtext').getContent();
        if (answer === '' || answer.length < 2 || answer.length > 20000) {
            yunNotyError('答案长度需在2-20000个字符之间！');
            return false;
        }
    } else if ($('#voice').hasClass('active')) {
        mode = 3;
        modeValue = $('#voiceId').val();
        if (modeValue === '') {
            yunNotyError('请选择语音答案！');
            return false;
        }
    } else if ($('#onlyPicture').hasClass('active')) {
        mode = 3;
        modeValue = $('#OnlyPictureId').val();
        if (modeValue === '') {
            yunNotyError('请选择图片答案！');
            return false;
        }
    } else if ($('#video').hasClass('active')) {
        mode = 3;
        modeValue = $('#vodeoId').val();
        if (modeValue === '') {
            yunNotyError('请选择视频答案！');
            return false;
        }
    } else if ($('#picture').hasClass('active')) {
        mode = 1;
        modeValue = $('#pictureId').val();
        if (modeValue === '') {
            yunNotyError('请选择图文答案！');
            return false;
        }
    } else if ($('#other').hasClass('active')) {
        mode = 4;
        modeValue = $('#otherId').val();
        if (modeValue === '') {
            yunNotyError('请选择第三方答案！');
            return false;
        }
    } else if ($('#flow').hasClass('active')) {
        mode = 6;
        answer = UE.getEditor('ans_flow').getContent();
        if (answer === '' || answer.length < 2 || answer.length > 20000) {
            yunNotyError('流程答案长度需在2-20000个字符之间！');
            return false;
        }
    } else if ($('#form').hasClass('active')) {
        mode = 7;
        modeValue = $('#formId').val();
        if (modeValue === '') {
            yunNotyError('请选择报表答案！');
            return false;
        }
    } else if ($('#rg').hasClass('active')) {
        mode = 8;
        answer = $('#ans_rg').val();
        if (answer === '') {
            yunNotyError('请填写转人工答案！');
            return false;
        }
    } else if ($('#ask').hasClass('active')) {
        mode = 11;
        modeValue = $('#askId').val();
        if (modeValue === '') {
            yunNotyError('请选择自定义AskToken！');
            return false;
        }
    }
    if ($('#AddQuesForm [name=StartTime]').val() !== '' || $('#AddQuesForm [name=EndTime]').val() !== '') {
        answerStartTime = $('#AddQuesForm [name=StartTime]').val();
        answerEndTime = $('#AddQuesForm [name=EndTime]').val();
        answerTimeLiness = 1;
    }
    if ($('#queOff').hasClass('active')) {
        suggestMode = 0;
    } else if ($('#queManual').hasClass('active')) {
        suggestMode = 1;
    } else if ($('#queAuto').hasClass('active')) {
        suggestMode = 2;
    }
    // #otherName存的是第三方链接的名称
    // thirdUrl需传推荐链接，目前暂时不传
    // if($('#otherName').val() != '') {
    // 	thirdUrl = $('#otherName').val();
    // }
    if ($('#queManual [name=postQueInput]').size() > 0) {
        $('#queManual [name=postQueInput]').each(function () {
            if ($(this).attr('rel') !== undefined) {
                sugQIds += $(this).attr('rel') + ',';
                sugSids += $(this).attr('srel') + ',';
            }
        });
        sugQIds = sugQIds.substring(0, sugQIds.length - 1);
        sugSids = sugSids.substring(0, sugSids.length - 1);
    }
    if (suggestMode == 1 && sugQIds === '') {
        yunNotyError('请手动添加智能推荐！');
        return false;
    }
    var effectiveRule1 = {
        'type': 1,
        'roleIds': ''
    };
    $('#DivRule_Way a.btn-primary').each(function () {
        effectiveRule1.roleIds += $(this).attr('fid') + ',';
    });
    if (effectiveRule1.roleIds === '') {
        effectiveRule1.roleIds = '-1';
    } else {
        effectiveRule1.roleIds = effectiveRule1.roleIds.substring(0, effectiveRule1.roleIds.length - 1);
    }

    var effectiveRule2 = {
        'type': 2,
        'roleIds': ''
    };
    if ($('#AddQuesForm input[name=hasCheckedId]').length) {
        effectiveRule2.roleIds = $('#AddQuesForm input[name=hasCheckedId]').val().split('~').join(',');
    }
    if (effectiveRule2.roleIds === '') {
        effectiveRule2.roleIds = '-1';
    }

    effectiveRules.push(effectiveRule1);
    effectiveRules.push(effectiveRule2);
    effectiveRules = JSON.stringify(effectiveRules);

    if ($('#isAgain').attr('checked') == 'checked') {
        isAgain = true;
    }
    if ($('#similarQueForm [name=similarQueInput]').size() > 0) {
        $('#similarQueForm [name=similarQueInput]').each(function () {
            if ($(this).val() !== '') {
                similarQues += $(this).val() + ',';
            }
        });
        similarQues = similarQues.substring(0, similarQues.length - 1);
    }

    var entityStr = '';
    $('#EntitysList .entitys').each(function (i) {
        if ($('#EntitysList .entitys').eq(i).val() != '') {
            entityStr += $('#EntitysList .entitys').eq(i).val() + ',';
        }
    });

    var dataJSON = null;
    if (transferStationFlag) {
        var tsJSON = null;
        if (tsItem) {
            tsJSON = JSON.parse(tsItem);
        }
        if (comeFromFlag == 0 || comeFromFlag == 1) {
            dataJSON = {
                question: question,
                groupId: groupId,
                labelIds: labelidsL, //标签id集合
                mode: mode,
                modeValue: modeValue,
                timeLiness: answerTimeLiness,
                startTime: answerStartTime,
                endTime: answerEndTime,
                answer: answer,
                suggestMode: suggestMode,
                sugQIds: sugQIds,
                sugSids: sugSids,
                effectiveRules: effectiveRules,
                similarQues: similarQues,
                sgIds: sgIds,
                entitys: entityStr.substring(0, entityStr.length - 1),
                qiYong: switchStatus,
                id: tsJSON.Id,
                wSgId: $('#wSgId').val()
            };
            if (comeFromFlag) {
                dataJSON.solutionId = tsJSON.SolutionId;
                dataJSON.type = 1;//tsJSON.Type;
                dataJSON.comeFrom = tsJSON.ComeFrom;
                dataJSON.comeGroupId = tsJSON.ComeGroupId;
                dataJSON.comeQuestionId = tsJSON.ComeId;
                dataJSON.status = 3;
                dataJSON.comeAnswerId = tsJSON.ComeAnswerId;
            }
        } else if (comeFromFlag == 2) {
            dataJSON = {
                labelIds: labelidsL,
                question: question,
                groupId: groupId,
                mode: mode,
                modeValue: modeValue,
                answerTimeLiness: answerTimeLiness,
                answerStartTime: answerStartTime,
                answerEndTime: answerEndTime,
                answer: answer,
                suggestMode: suggestMode,
                sugQIds: sugQIds,
                sugSids: sugSids,
                effectiveRules: effectiveRules,
                similarQues: similarQues,
                sgIds: sgIds,
                entitys: entityStr.substring(0, entityStr.length - 1),
                qiYong: switchStatus,
                id: tsJSON.Id,
                wSgId: $('#wSgId').val(),
                learnqueId: getUrlParam('learnQueId'),
                status: status
            };
        }


    } else {
        dataJSON = {
            question: question,
            groupId: groupId,
            labelIds: labelidsL,  //标签id集合
            mode: mode,
            modeValue: modeValue,
            answerTimeLiness: answerTimeLiness,
            answerStartTime: answerStartTime,
            answerEndTime: answerEndTime,
            answer: answer,
            suggestMode: suggestMode,
            sugQIds: sugQIds,
            sugSids: sugSids,
            effectiveRules: effectiveRules,
            similarQues: similarQues
        };
    }
    if ($('#pointWords').val() != '') {
        dataJSON.pointWords = $('#pointWords').val();
    }
    if ($('#thirdUrl').val() != '') {
        dataJSON.thirdUrl = $('#thirdUrl').val();
    }
    if ($('#keyWord').val() != '') {
        dataJSON.keyWord = $('#keyWord').val();
    }
    if ($('#termsIds').val() != '') {
        dataJSON.termsIds = $('#termsIds').val();
    }
    if ($('#requestRegex').val() != '') {
        dataJSON.requestRegex = $('#requestRegex').val();
    }

    if (flag_add) {
        return;
    }
    flag_add = true;
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        //不从缓存中去数据
        url: encodeURI(uurl),
        data: dataJSON,
        success: function (data) {
            flag_add = false;
            if (data.status === 0) {
                if (transferStationFlag) {
                    yunNoty(data, function () {
                        var ifT = iframeTab.init({ iframeBox: '' });
                        ifT.closeActIframe('', parent.$('#tabHeader li[data-num="' + getUrlParam('tmpNum') + '"]').attr('data-tab'));
                    });
                } else {
                    yunNoty(data, function () {
                        var ifT = iframeTab.init({ iframeBox: '' });
                        var href = '';
                        if (!isAgain) {
                            if (mode == 6) {
                                href = '/web/knowledge/editFlow.html?questionId=' + data.questionId + '&groupId=' + groupId + '&solutionId=' + data.solutionId;
                                ifT.refreshTab(href, '流程详细');
                            } else {
                                href = '/web/knowledge/queDetail.html?id=' + data.questionId;
                                ifT.refreshTab(href, '问题详细');
                            }
                        } else {
                            //清空表单
                            $('#question').val('');
                            $('#ans_text').val('');
                            UE.getEditor('ans_richtext').setContent('');
                            $('#pictureShow').html('').css('display', 'none');
                            $('#pictureId').val('');
                            $('#ans_voice button').hide();
                            $('#voiceId').val('');
                            $('#ans_other button').hide();
                            $('#otherName').val('');
                            $('#otherId').val('');
                            $('#ans_ask button').hide();
                            $('#askName').val('');
                            $('#askId').val('');
                            $('#ans_form button').hide();
                            $('#formId').val('');
                            $('#similarQueForm [name=similarQueInput]').each(function () {
                                $(this).val('');
                            });
                            $('#ruleDiv').html('');
                            $('#ansRuleStartTime').val('');
                            $('#ansRuleEndTime').val('');
                            $('#queClassify').val('');
                            $('#ClassesIds').val('');
                            $('#labelClassify').val('');
                            $('#labelesIds').val('');
                            $('.QueContainer input[name=postQueInput]').each(function () {
                                $(this).val('');
                                $(this).attr('rel', '');
                                $(this).attr('srel', '');
                            });
                            $('#pointWords').val('');
                            $('#thirdUrl').val('');
                            $('#keyWord').val('');
                            $('#termsIds').val('');
                            $('#requestRegex').val('');
                            $('a[fid]').removeClass('btn-primary').addClass('btn-white');
                            var treeObj = $.fn.zTree.getZTreeObj('treeUserRole');
                            treeObj.checkAllNodes(false);
                            $('#AddQuesForm input[name=hasChecked]').val('');
                            $('#AddQuesForm input[name=hasCheckedId]').val('');
                            $('#timePicker').iCheck('uncheck');
                            $('#dateTime').hide();
                            $('#AddQuesForm [name=StartTime]').val('');
                            $('#AddQuesForm [name=EndTime]').val('');
                            $('#colRight').hide();
                            $('#simiYinContainerHide').hide();
                            $('.oneTips').hide();
                            if (getUrlParam('id')) {
                                href = '/web/knowledge/transferStation.html';
                                ifT.refreshTab(href, '知识中转站');
                            }
                        }
                    });
                }
            } else {
                yunNoty(data);
            }
        }
    });
}
/*  taskId = 684 知识中转站添加渠道修改项
    新增页面展示上次设置的渠道
*/
function getRule() {
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        //不从缓存中去数据
        url: encodeURI('../../Configuration/listAllItem'),
        success: function (data) {
            if (data.status === 0) {
                var List = [];
                if (data.listItem) {
                    List = data.listItem;
                } else {
                    return;
                }
                for (var i in List) {
                    if (List[i].ConfigItemDesc == '生效渠道') {
                        if (List[i].IsDisplay === 1) {
                            $('#DivRule_Way').remove();
                        } else if (List[i].IsDisplay === 0) {
                            $.ajax({
                                type: 'post',
                                datatype: 'json',
                                cache: false,
                                //不从缓存中去数据
                                url: encodeURI('../../Configuration/listValue'),
                                data: {
                                    itemId: List[i].Id
                                },
                                success: function (data) {
                                    if (data.status === 0) {
                                        if (data.listValue) {
                                            $('#DivRule_WayItem').empty();
                                            $('#DivRule_WayItem').append('<input id="wayAll" type="checkbox"><label for="wayAll" style="margin: 5px;">全选</label>');
                                            $('#wayAll').iCheck({
                                                checkboxClass: 'icheckbox_flat-blue',
                                                radioClass: 'iradio_flat-blue',
                                                cursor: true
                                            });
                                            for (var key in data.listValue) {
                                                $('#DivRule_WayItem').append('<a class="btn btn-white m-r-5 m-b-5" fid="' + data.listValue[key].DicCode + '">' + data.listValue[key].DicDesc + '</a>');
                                            }
                                            for(var i = 0;i < channelOther.length;i++){
                                                for(var j = 0;j < $('#DivRule_WayItem a.btn').length;j++){
                                                    if(channelOther[i] == $('#DivRule_WayItem a.btn').eq(j).text()){
                                                        $('#DivRule_WayItem a.btn').eq(j).addClass('btn-primary').attr('ckb','1');
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    } else if (List[i].ConfigItemDesc == '生效角色') {
                        if (List[i].IsDisplay === 1) {
                            $('#DivRule_Role').remove();
                        }
                    } else if (List[i].ConfigItemDesc == '生效时间') {
                        if (List[i].IsDisplay === 1) {
                            $('#DivRule_Time').remove();
                            $('#dateTime').remove();
                        }
                    }
                }
            }
        }
    });
}
