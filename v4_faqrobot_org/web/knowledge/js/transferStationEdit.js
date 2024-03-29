var tsItem = null;
tsItem = getSessionStorage('ts_tsItem');
var tsJSON = null;
var thirdJSON = null;
if(tsItem) {
	tsJSON = JSON.parse(tsItem);
}
/*  taskId = 684 知识中转站添加渠道修改项
    listAnswer : 问题的某一条答案
    channelList ： 某一条答案的生效渠道
*/
var listAnswer = null;
var channelList = null;
if(getUrlParam('ComeFrom')) {
    $.ajax({
        url: '../../landray/LandrayQuestion/getQueList',
        type:'post',
        data:{
            type: tsJSON.Type,
            comeFrom: tsJSON.ComeFrom,
            comeGroupId: tsJSON.ComeGroupId,
            comeQuestionId: tsJSON.ComeId
        },
        dataType:'json',
        success: function(data){
            if(data.thirdList && data.thirdList.length > 0) {
                thirdJSON = data.thirdList[0];
                var template = Handlebars.compile($('#left-template').html());
                var html = template(data.thirdList[0]);
                /*
                * taskid=459 农信配置项修改知识
                *
                * */
                if(sessionStorage.getItem('qAndACloseValue') == 1){//开启
                    if(!getUrlParam('del')){
                        $('.leftSame').removeClass('col-md-6').addClass('col-md-6');
                        $('.rightSame').removeClass('col-md-6').addClass('col-md-6');
                        $('#left-container').prev().text('知识库知识');
                        $('#right-container').prev().text('同步知识');
                        $('#right-container').html(html);
                        $('#right-container').append('<div class="col-md-2" style="padding-left:0;margin-bottom:10px;"><button class="btn btn-primary save">保存</button></div>');

                    }else{
                        $('.leftSame').removeClass('col-md-9').addClass('col-md-3');
                        $('.rightSame').removeClass('col-md-3').addClass('col-md-9');
                        $('#left-container').prev().text('待修改知识');
                        $('#right-container').prev().text('修改知识');
                        $('#left-container').html(html);
                    }
                }else{
                    $('.leftSame').removeClass('col-md-9').addClass('col-md-3');
                    $('.rightSame').removeClass('col-md-3').addClass('col-md-9');
                    $('#left-container').prev().text('待修改知识');
                    $('#right-container').prev().text('修改知识');
                    $('#left-container').html(html);
                }
                // 设置问题和分类不可修改
                $('#question-static-col').removeClass('hide');
                $('#question-col').addClass('hide');
                $('#question-label').html($('#question').val());
                if(data.thirdList[0].GroupId) {
                    $('#ClassesIds').val(data.thirdList[0].GroupId);
                    $('#ClassesLabel').removeClass('hide');
                    $('#queClassify').addClass('hide');
                    $('#ClassesLabel').html(data.thirdList[0].ComeGroupName);
                }
            }
            function getStatus(AnswerType) {
                switch(AnswerType) {
                case 0:
                    return '已发布';
                    break;
                case -1:
                    return '暂存';
                    break;
                case -2:
                    return '等待审核';
                    break;
                case -3:
                    return '被退回';
                    break;
                case -4:
                    return '已过期';
                    break;
                case -5:
                    return '等待生效';
                    break;
                default:
                    return '';
                }
            }
            /*  taskId = 684 知识中转站添加渠道修改项
                获取配置的渠道信息展示到页面
            */
            function getRule(){
                if (data.sourceList) {
                    $('#DivRule_WayItem').empty();
                    $('#DivRule_WayItem').append('<input id="wayAll" type="checkbox"><label for="wayAll" style="margin: 5px;">全选</label>');
                    $('#wayAll').iCheck({
                        checkboxClass: 'icheckbox_flat-blue',
                        radioClass: 'iradio_flat-blue',
                        cursor: true
                    });
                    for (var key in data.sourceList) {
                        $('#DivRule_WayItem').append('<a class="btn btn-white m-r-5 m-b-5" fid="' + data.sourceList[key].DicCode + '">' + data.sourceList[key].DicDesc + '</a>');
                    }
                    if(data.question.ListAnswer.length > 0){
                        for(var i = 0;i < data.question.ListAnswer.length;i++){
                            if(data.thirdList[0].AnswerId == data.question.ListAnswer[i].Id){
                                if(data.question.ListAnswer[i].ListRule){
                                    if(data.question.ListAnswer[i].ListRule.length > 0){
                                        if(data.question.ListAnswer[i].ListRule[0].ruleMode == 0){
                                            var channel = [];
                                            $.each(data.question.ListAnswer[i].ListRule[0].roleIds.split(','), function() {
                                                for(var m in data.sourceList) {
                                                    if(data.sourceList[m].DicCode == this) {
                                                        channel.push(data.sourceList[m].DicDesc);
                                                    }
                                                }
                                            });
    
                                            for(var i=0;i < channel.length;i++){
                                                for(var j = 0;j < $('#DivRule_WayItem a.btn').length;j++){
                                                    if(channel[i] == $('#DivRule_WayItem a.btn').eq(j).text()){
                                                        $('#DivRule_WayItem a.btn').eq(j).addClass('btn-primary').attr('ckb','1');
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            } 
                        }
                    }
                }
            }
            
            if(data.question) {
                var editId = null;
                if(data.thirdList[0].Type == 2){
                    if(data.thirdList[0] && data.thirdList[0].AnswerType) {
                        // 新增
                        if(data.thirdList[0].AnswerType == 1) {
                            /*  taskId = 684 知识中转站添加渠道修改项
                                修改页面新增答案时展示渠道
                            */
                            data.question.ListAnswer.forEach(function(x, no){
                                listAnswer = data.question.ListAnswer[no];
                                if(listAnswer.ListRule){
                                    channelList = showQuDao(listAnswer,data.sourceList);
                                    channelList = channelList.split('<span class="dot">|</span>')[0];
                                    data.question.ListAnswer[no].listAnswer = channelList;
                                }
                            })
                            
                            data.question.ListAnswer.push({
                                Id: 'abc',
                                Answer: '',
                                isTextArea: true,
                                isChannel:true
                            });
                            
                        // 修改
                        } else if(data.thirdList[0].AnswerType == 2) {
                            var thirdId = data.thirdList[0].AnswerId;
                            /*  taskId = 684 知识中转站添加渠道修改项
                                修改页面修改答案时展示渠道
                            */
                            data.question.ListAnswer.forEach(function(x, no){
                                listAnswer = data.question.ListAnswer[no];
                                if(listAnswer.ListRule){
                                    channelList = showQuDao(listAnswer,data.sourceList);
                                    channelList = channelList.split('<span class="dot">|</span>')[0];
                                    data.question.ListAnswer[no].listAnswer = channelList;
                                }
                            })
                            data.question.ListAnswer.forEach(function(x, no){
                                if(x.Id == thirdId) {
                                    editId = thirdId;
                                    data.question.ListAnswer[no].isTextArea = true;
                                    data.question.ListAnswer[no].isChannel = true;
                                }
                            });
                        // 删除
                        } else if(data.thirdList[0].AnswerType == 3) {
                            var thirdId = data.thirdList[0].AnswerId;
                            /*  taskId = 684 知识中转站添加渠道修改项
                                修改页面删除答案时展示渠道
                            */
                            data.question.ListAnswer.forEach(function(x, no){
                                listAnswer = data.question.ListAnswer[no];
                                if(listAnswer.ListRule){
                                    channelList = showQuDao(listAnswer,data.sourceList);
                                    channelList = channelList.split('<span class="dot">|</span>')[0];
                                    data.question.ListAnswer[no].listAnswer = channelList;
                                }
                            })
                            data.question.ListAnswer.forEach(function(x, no){
                                if(x.Id == thirdId) {
                                    editId = thirdId;
                                    data.question.ListAnswer[no].isDel = true;
                                }
                            });
                        }
                    }
                    data.question.StatusValue = getStatus(data.question.Status);
                    data.question.ListAnswer.map(function(x){
                        x.AnswerStatusValue = getStatus(x.AnswerStatus);
                    });
                }
                
                if(getUrlParam('del')) {
                    var template = Handlebars.compile($('#right-del-template').html());
                    var html = template(data.question);
                    $('#right-container').html(html);
                    $('.del').on('click', function(e){
                        e.preventDefault();
                        $.ajax({
                            url: '../../landray/LandrayQuestion/editQueStatus',
                            type:'post',
                            data:{
                                type: tsJSON.Type,
                                comeFrom: tsJSON.ComeFrom,
                                comeQuestionId: tsJSON.ComeId,
                                id: tsJSON.Id,
                                status: 3,
                                solutionId: thirdJSON.SolutionId,
                                comeGroupId: thirdJSON.ComeGroupId,
                                comeAnswerId: thirdJSON.ComeAnswerId
                            },
                            dataType:'json',
                            success: function(data){
                                yunNoty(data, function() {
                                    var ifT = iframeTab.init({iframeBox: ''});
                                    ifT.closeActIframe('',parent.$('#tabHeader li[data-num="'+getUrlParam('tmpNum')+'"]').attr('data-tab'));
                                });
                            }
                        });
                    });
                } else {
                    var template = Handlebars.compile($('#right-template').html());
                    var html = template(data.question);
                    /*
                    * taskid = 459 农信社配置修改时同步知识展示在右侧，知识库知识在左侧，保存
                    *
                    * */
                    if(sessionStorage.getItem('qAndACloseValue') == 1){
                        var oHtml = '<div class="titleCtn row" style="margin-top:10px;padding: 5px 0;border:1px solid #e2e7eb;">'+
                                        '<div class="col-md-2 question">问题</div>'+
                                        '<div class="col-md-10">'+
                                        '<span class="queTitle" style="color: #666;">'+data.question.Question+'</span>'+
                                        '<div class="queRight">'+
                                        '<span style="float: right;">'+data.question.AddTime+'</span>'+
                                        '<span>来自 : <em>'+data.question.UserName+'</em></span><span class="dot">|</span>'+
                                        '<span>分类 : <em>'+data.question.GroupName+'</em></span><span class="dot">|</span>'+
                                        '<span>浏览 <em>'+(data.question.Hits ? data.question.Hits:0)+'</em> 次</span><span class="dot">|</span>'+
                                        '<span>已发布</span><span class="dot">|</span>'+
                                        '<span>'+
                                        '<span class="glyphicon glyphicon-thumbs-up" title="赞"></span> <em>'+(data.question.Usefull?data.question.Usefull:0)+'</em> 次'+
                                        '<span class="dot">|</span>'+
                                        '<span class="glyphicon glyphicon-thumbs-down" title="踩"></span> <em>'+(data.question.Useless?data.question.Useless:0)+'</em> 次'+
                                        '</span></div></div></div>';

                        for(var i = 0;i < data.question.ListAnswer.length;i++){
                            if(data.question.ListAnswer[i].Answer){
                                oHtml+='<div class="queCtn row " rel="'+data.question.ListAnswer[i].Id+'" style="margin-top:10px">'+
                                    '<div class="col-md-2">答案</div><div class="col-md-8"><div>'+
                                    '<div class="ansItemCtn"><span class="ansTitle" style="color: #666;">'+data.question.ListAnswer[i].Answer+'</span></div>'+
                                    '<div class="ansItemFrom">'+
                                    '<span>来自 : <em>'+data.question.ListAnswer[i].UserName+'</em></span>'+
                                    '<span class="dot">|</span>'+
                                    '<span>浏览 <em>'+(data.question.ListAnswer[i].Hits?data.question.ListAnswer[i].Hits:0)+'</em> 次</span><span class="dot">|</span>'+
                                    '<span>'+data.question.ListAnswer[i].AnswerStatusValue+'</span>'+
                                    '<span class="dot">|</span>'+
                                    '<span><span class="glyphicon glyphicon-thumbs-up" title="赞"></span> <em>'+(data.question.ListAnswer[i].Usefull?data.question.ListAnswer[i].Usefull:0)+'</em> 次</span>'+
                                    '<span class="dot">|</span>'+
                                    '<span><span class="glyphicon glyphicon-thumbs-down" title="踩"></span> <em>'+(data.question.ListAnswer[i].Useless?data.question.ListAnswer[i].Useless:0)+'</em> 次</span>'+
                                    '</div></div></div></div>'
                            }
                        }
                            $('#left-container').html('<div>'+oHtml+'</div>');
                    }else{
                        $('#right-container').html(html);
                        data.question.ListAnswer.forEach(function(el){
                            if(el.isTextArea) {
                                UE.getEditor(''+el.Id, {
                                    initialFrameHeight: 150,
                                    wordCount: true,
                                    maximumWords: 3e3
                                });
                                (function(eg){
                                    UE.getEditor(''+eg.Id).ready(function() {
                                        UE.getEditor(''+eg.Id).setContent(eg.Answer);
                                    });
                                })(el);
                            }
                        });
                    }
                    getRule();
                    $('.save').on('click', function(e){
                        var answer = '';
                        var dataJSON = {};
                        if(sessionStorage.getItem('qAndACloseValue') == 1){
                            answer = $('#right-container .ansIndex').next().text();
                            dataJSON = {
                                type: tsJSON.Type,
                                comeFrom: tsJSON.ComeFrom,
                                comeGroupId: tsJSON.ComeGroupId,
                                comeQuestionId: tsJSON.ComeId,
                                comeAnswerId: tsJSON.ComeAnswerId,
                                id: tsJSON.Id,
                                status: 3,
                                solutionId: thirdJSON.SolutionId,
                                question: $('.queTitle').html(),
                                answer: answer,
                                mode: thirdJSON.Mode,
                                answerType: thirdJSON.AnswerType
                            }
                        }else{
                            answer = UE.getEditor($(this).parent().parent().siblings('.queCtn:last').attr('rel')).getContent();
                            Add();
                            dataJSON = {
                                type: tsJSON.Type,
                                comeFrom: tsJSON.ComeFrom,
                                comeGroupId: tsJSON.ComeGroupId,
                                comeQuestionId: tsJSON.ComeId,
                                comeAnswerId: tsJSON.ComeAnswerId,
                                id: tsJSON.Id,
                                status: 3,
                                solutionId: thirdJSON.SolutionId,
                                question: $('.queTitle').html(),
                                answer: answer,
                                mode: thirdJSON.Mode,
                                answerType: thirdJSON.AnswerType,
                                effectiveRules:effectiveRules
                            }
                        }
                        e.preventDefault();
                        $.ajax({
                            url: '../../landray/LandrayQuestion/editQueStatus',
                            type:'post',
                            data:dataJSON,
                            dataType:'json',
                            success: function(data){
                                if(data.status == 0){
                                    yunNoty(data, function() {
                                        var ifT = iframeTab.init({iframeBox: ''});
                                        ifT.closeActIframe('',parent.$('#tabHeader li[data-num="'+getUrlParam('tmpNum')+'"]').attr('data-tab'));
                                    });
                                }else{
                                    yunNoty(data);
                                }
                            }
                        });
                    });
                    $('.saveDD').on('click', function(e){
                        e.preventDefault();
                        $.ajax({
                            url: '../../landray/LandrayQuestion/editQueStatus',
                            type:'post',
                            data:{
                                type: tsJSON.Type,
                                comeFrom: tsJSON.ComeFrom,
                                comeGroupId: tsJSON.ComeGroupId,
                                comeQuestionId: tsJSON.ComeId,
                                comeAnswerId: tsJSON.ComeAnswerId,
                                id: tsJSON.Id,
                                status: 3,
                                solutionId: thirdJSON.SolutionId,
                                question: $('.queTitle').html(),
                                answer: thirdJSON.Answer,
                                mode: thirdJSON.Mode,
                                answerType: thirdJSON.AnswerType
                            },
                            dataType:'json',
                            success: function(data){
                                yunNoty(data, function() {
                                    var ifT = iframeTab.init({iframeBox: ''});
                                    ifT.closeActIframe('',parent.$('#tabHeader li[data-num="'+getUrlParam('tmpNum')+'"]').attr('data-tab'));
                                });
                            }
                        });
                    });
                }
            } else {
                if(tsJSON.Type == 2) {
                    location.href = '/web/knowledge/transferStationAdd.html?tsFlag=true&ComeFrom=1';
                } else if(tsJSON.Type == 3) {
                    $('#right-container').html('<div style="text-align:center;margin-top:15px;font-size:18px;">云问知识库中暂没有该问题,无法删除</div>');
                } else {
                    $('#right-container').html('<div style="text-align:center;margin-top:15px;font-size:18px;">云问知识库中暂没有该问题,请按顺序处理第三方知识库的问题</div>');
                }
            }
        }
    });
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
    //答案生效渠道
    var effectiveRules = [];
    var effectiveRule1 = {
        'type': 1,
        'roleIds': ""
    };
    function Add(){
        /*  taskId = 684 知识中转站添加渠道修改项
            保存时添加渠道参数effectiveRules
        */
        $('#DivRule_WayItem a.btn-primary').each(function () {
            effectiveRule1.roleIds += $(this).attr('fid') + ",";
        });
        if (effectiveRule1.roleIds === "") {
            effectiveRule1.roleIds = "-1";
        } else {
            effectiveRule1.roleIds = effectiveRule1.roleIds.substring(0, effectiveRule1.roleIds.length - 1);
        }
        effectiveRules.push(effectiveRule1);
        effectiveRules = JSON.stringify(effectiveRules);
    }
}