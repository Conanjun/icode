$(document).ready(function () {
    var tmpNum = parent.$('#tabHeader li[data-tab="' + location.href + '"]').attr('data-num');//获取当前url中的data-num
    var This = this,
        id = 0,
        solutionId2 = 0,
        groupId2 = 0;

    id = This.location.href.match(/\?id=(\d+)/);

    if (id) {
        id = id[1];
    }

    //ENTER
    $(document).on('keyup', function (e) {
        var $activeEl = $(document.activeElement);

        if ($activeEl.is('input[name=question]') && (e.keyCode == 13 || e.keyCode == 108)) {
            $('.lookFor').trigger('click');
        }
    });

    //ENTER
    $(document).on('keyup', function (e) {
        var $activeEl = $(document.activeElement);

        if ($activeEl.is('input[name=simiQue]') && (e.keyCode == 13 || e.keyCode == 108)) {
            $('.ensureQue').trigger('click');
        }
    });
    var entityList = '';
    /**taskId=558  智能推荐功能优化 Amend by 赵宇星 
     * 功能：用于存储当前的推荐问题状态，用于切换状态时显示刷新按钮使用
     */
    var SuggestModeTab='';

    /**taskId=558  智能推荐功能优化 Amend by 赵宇星 
     * 功能：获取智能推荐填充问题
     */
    var sugQuestionList=[];//智能推荐填充问题数组
    function initSrc() {
        Base.request({
            url: 'question/getQuestionById',
            params: {
                id: id,
            },
            callback: function (data) {
                if (data.status) {
                    Base.gritter(data.message, false);
                } else {
                    var html = '';
                    if (data.question) {
                        var ListAnswer = data.question.ListAnswer,
                            ansStr = '',
                            ansThisIndex = '';
                        for (var j = 0; j < ListAnswer.length; j++) {
                            var ansItem_focus = '';
                            if (!j) { //第一个答案
                                ansItem_focus = 'ansItem_focus';
                            }
                            if (ListAnswer.length > 1) {
                                ansThisIndex = j + 1;
                            }

                            //问题答案类型对应的小图标
                            var imgMode = '', imgTitle = '';
                            /**taskId=719 答案类型为视频时，显示视频名称 add by 赵宇星
                             * 说明：判断答案类型，如果为视频；则创建一个元素填充视频名称，拼接在答案下面
                            */
                            var audioName='',audioNameEle='';
                            switch (ListAnswer[j].Mode) {
                                case 0:
                                    imgMode = 'text.png';
                                    imgTitle = '文本';
                                    break;
                                case 1:
                                    imgMode = 'img-text.png';
                                    imgTitle = '图文';
                                    break;
                                case 2:
                                    imgMode = 'fwb.png';
                                    imgTitle = '富文本';
                                    break;
                                case 3:
                                    if (ListAnswer[j].Material) {
                                        switch (ListAnswer[j].Material.Type) {
                                            case 1:
                                                imgMode = 'img.png';
                                                imgTitle = '图片';
                                                break;
                                            case 2:
                                                imgMode = 'video.png';
                                                imgTitle = '语音';
                                                break;
                                            case 3:
                                                imgMode = 'audio.png';
                                                imgTitle = '视频';
                                                audioName=ListAnswer[j].Material.Name||'';
                                                audioNameEle="<p class='video-name'>视频名称："+audioName+"</p>";
                                                break;
                                        }
                                    }

                                    break;
                                case 4:
                                    imgMode = 'dsf.png';
                                    imgTitle = '第三方';
                                    break;
                                case 6:
                                    imgMode = 'flow.png';
                                    imgTitle = '流程';
                                    break;
                                case 7:
                                    imgMode = 'form.png';
                                    imgTitle = '表单数据';
                                    break;
                                case 8:
                                    imgMode = 'monitor.png';
                                    imgTitle = '转人工';
                                    break;
                                case 10:
                                    imgMode = 'datasearch.png';
                                    imgTitle = '二维表格';
                                    break;
                                case 12:
                                    imgMode = 'instructions.png';
                                    imgTitle = '指令';
                                    break;
                                case 13:
                                    imgMode = 'graph.png';
                                    imgTitle = '知识图谱';
                                    break;
                                default:
                                    imgMode = 'custom.png';
                                    imgTitle = '场景';
                                    break;
                            }

                            var AnswerStatus = '';
                            AnswerStatus += '<option value="0">已发布</option><option value="-2">等待审核</option><option value="-3">被退回</option><option value="-4">已过期</option><option value="-5">等待生效</option>';

                            var imgstr = '';
                            if (imgMode == 'custom.png') {
                                imgstr = 'style="background:url(images/' + imgMode + ') no-repeat; background-size: cover !important;"'
                            } else {
                                imgstr = 'style="background:url(images/' + imgMode + ') no-repeat"'
                            }
                            /**taskId=719 答案类型为视频时，显示视频名称 add by 赵宇星
                             * 说明：在ListAnswer[j].Answer 后拼接audioNameEle
                            */
                            ansStr += '<div class="ansItem ' + ansItem_focus + '" Id="' + ListAnswer[j].Id + '" GroupId="' + ListAnswer[j].GroupId + '" SolutionId="' + ListAnswer[j].SolutionId + '" Webid="' + ListAnswer[j].Webid + '" SubSolutionId="' + ListAnswer[j].SubSolutionId + '"><div class="ansItemCtn"><span class="timeTip ansItemImg" ' + imgstr + ' title="' + imgTitle + '"></span><span class="ansIndex">答案' + ansThisIndex + '</span>' + ListAnswer[j].Answer + audioNameEle + '</div><div class="ansItemFrom"><span>来自:<em>' + ListAnswer[j].UserName + '</em></span><span class="dot">|</span>' + showRule(ListAnswer[j], data.sourceList)+ '<span>浏览<em>' + (ListAnswer[j].Hits || 0) + '</em>次</span><span class="dot">|</span><a><span><select cur="' + ListAnswer[j].AnswerStatus + '">' + AnswerStatus + '</select></span></a><span class="dot">|</span><span><span class="glyphicon glyphicon-thumbs-up" title="赞"></span><em>' + (ListAnswer[j].Usefull || 0) + '</em>次</span><span class="dot">|</span><span><span class="glyphicon glyphicon-thumbs-down" title="踩"></span><em>' + (ListAnswer[j].Useless || 0) + '</em>次</span><span class="dot">|</span>' + (ListAnswer[j].StartTime ? '<span>生效时间：' + ListAnswer[j].StartTime + '-' + ListAnswer[j].EndTime + '</span><span class="dot">|</span>' : '') + '<a class="lookBe" href="#modal-history" data-toggle="modal"><span class="timeTip glyphicon glyphicon-eye-open" title="历史版本"></span></a><a href="../../web/knowledge/editAnswer.html?solutionId=' + ListAnswer[j].SolutionId + '&groupId=' + ListAnswer[j].GroupId + '&answerId=' + ListAnswer[j].Id + '&question=' + encodeURIComponent(data.question.Question) + '&tmpNum=' + tmpNum + '" data-num="0" data-name="编辑答案"><span class="timeTip glyphicon glyphicon-pencil" title="编辑答案"></span></a>' + (ListAnswer.length - 1 ? '<a><span class="oneDelAns timeTip glyphicon glyphicon-trash" title="删除答案"></span></a>' : '') + '</div></div>';
                        }

                        var Status = '';
                        Status += '<option value="0">已发布</option><option value="-2">等待审核</option><option value="-3">被退回</option><option value="-4">已过期</option><option value="-5">等待生效</option>';

                        var editAnswer = '<a href="../../web/knowledge/editAnswer.html?solutionId=' + data.question.SolutionId + '&groupId=' + data.question.GroupId + '&question=' + data.question.Question + '&tmpNum=' + tmpNum + '" data-num="0" data-name="新增答案"><span class="timeTip glyphicon glyphicon-plus" title="新增答案"></span></a>';
                        if (data.question.SolutionType == 2) {
                            editAnswer = '';
                        }

                        var labelName = data.question.LabelName;
                        if (labelName == null) {
                            labelName = "无";
                        }

                        if (data.question.Entitys) {
                            entityList = data.question.Entitys;
                        } else {
                            entityList = '';
                        }
                        var tmpRequestRegex = '';
                        if (data.question.RequestRegex) {
                            tmpRequestRegex = data.question.RequestRegex;
                            tmpRequestRegex = tmpRequestRegex.replace('<', '&lt').replace('>', '&gt;')
                        }

                        html += '<tr Id="' + data.question.Id + '" entity="' + entityList + '" sgId="' + data.question.SgId + '" GroupId="' + data.question.GroupId + '" SolutionId="' + data.question.SolutionId + '"><td style="border-top: none;"><div class="theWholeCtn"><legend>问题<!-- <button class="pull-right btn btn-white" onclick="history.go(-1);">返回上一页</button> --></legend><div class="titleCtn margint10"><span class="queTitle">' + data.question.Question + '</span><a><span class="editQue timeTip glyphicon glyphicon-edit" title="修改问题"></span></a></div>  <div class="queWholeCtn margint10"><span>来自:<em>' + data.question.UserName + '</em></span><span class="dot">|</span><span>分类:<a class="editClass"><em class="timeTip" data-original-title="选择分类：问题分类是创建知识的基础，不建分类无法创建知识">' + ListAnswer[0].GroupName + '</em></a></span><span class="dot">|</span><span>标签:<a class="editLabels"><em  class="timeTip" data-original-title="标签：便于解决知识交叉分类的需求">' + labelName + '</em></a></span><span class="dot">|</span>' + ('<span>关键词:<a style="cursor: pointer;" href="#modal-keyword" data-type="keyword" data-toggle="modal" class="keyWord"><em  class="timeTip" data-original-title="设置关键词：关键词添加用逗号隔开，当访客问题中涉及到该关键词，给出该问题的答案。若多个问题添加该关键词，机器人匹配给出反问引导">' + (data.question.Keyword || '暂无') + '</em></a></span><span class="dot">|</span>') + ('<span>公式:<a style="cursor: pointer;" href="#modal-formula" data-toggle="modal" data-type="RequestRegex" class="requestRegex"><em  class="timeTip" data-original-title="设置公式：判断用户问题是否符合该正则表达式，若符合，给出该问题的答案">' + (tmpRequestRegex || '暂无') + '</em></a></span><span class="dot">|</span>') + ('<span class="interTerm1" title="" style="display:none;">智能句式:<a style="cursor: pointer;" data-toggle="modal tooltip" data-type="SgName"><em class="timeTip">' + (data.question.SgName || '暂无') + '</em></a><span class="spanInter" style="opacity:0;"></span></span><span class="dot">|</span>') + '<span>浏览<em>' + (data.question.Hits || 0) + '次</em></span><span class="dot">|</span><a><span><select class="editStatus" cur="' + data.question.Status + '">' + Status + '</select></span></a><span><span class="dot">|</span><span class="glyphicon glyphicon-thumbs-up" title="赞"></span><em>' + (data.question.Usefull || 0) + '</em>次</span><span class="dot">|</span><span><span class="glyphicon glyphicon-thumbs-down" title="踩"></span><em>' + (data.question.Useless || 0) + '</em>次</span></span><span class="dot">|</span><span>' + editAnswer + '<a class="queEditor"><span class="oneDelQue timeTip glyphicon glyphicon-trash" title="删除问题"></span></a></span></div></div>  <div class="theWholeCtn"><legend>答案</legend><div class="queCtn">' + ansStr + '</div></div></td></tr>';

                        //智能推荐
                        /*taskId=558  智能推荐功能优化 按照顺序显示问题推荐 不显示浏览次数
                        *说明：按照SuggestQuestion[i].SuggestQuestionOrder的顺序显示，从1开始顺序；如果出现断序，则插入智能推荐
                        */ 
                        var sugQuesNum=data.question.SugQuestionNum;//该问题后台返回问题推荐的数量,用户设置的推荐问题条数
                        var SuggestQuestion = data.question.SuggestQuestion;//获取问题推荐的数组，可能多于设置的条数

                        var len = sugQuesNum;
                        $('#queManual').empty();
                        var p=0;//遍历数组SuggestQuestion[]
                        for (var j = 1; j <=len; j++) {//该循环用来计数 用于对比手动推荐问题序号SugQuestionOrder
                            if (SuggestQuestion[p]) {
                                //计数变量与当前问题的排序号一致，正常显示
                                if(SuggestQuestion[p].SugQuestionOrder==j){
                                    if (SuggestQuestion[p].EditIf == 0) {//存储智能推荐的内容
                                        sugQuestionList.push(SuggestQuestion[p]);
                                        //Amend By zhaoyuxing At 20171213 单号:369
                                        //说明：去除字符串拼接的‘SuggestQuestion[p].Question’变量，采用查找元素进行添加 不显示聊天记录 
                                        $('#queManual').append('<div class="QueContainer row interQ"><div class="form-group col-xs-2 col-sm-1"><button type="button" class="btn btn-primary zntjo">智能</button></div><div class="form-group col-xs-7 col-sm-5"><input class="form-control" type="text" readonly style="cursor:pointer" placeholder="暂无数据，待被问后自动填充智能推荐问题，也可点击手动选择推荐问题" name="postQueInput" value="（浏览' + dataFilter(SuggestQuestion[p].Hits) + '次）'+ '" rel="' + SuggestQuestion[p].Id + '" srel="' + SuggestQuestion[p].SolutionId + '"></div><div class="form-group col-xs-3 col-sm-2 m-t-5 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a> <a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>');
                                        var _thisInput=$('[name=postQueInput]').eq(j-1);
                                        // var hits=_thisInput.val();
                                        _thisInput.val(SuggestQuestion[p].Question);
                                    } else {
                                        //Amend By zhaoyuxing At 20171213 单号:369
                                        //说明：去除字符串拼接的‘SuggestQuestion[p].Question’变量，采用查找元素进行添加
                                        $('#queManual').append('<div class="QueContainer row"><div class="form-group col-xs-2 col-sm-1"><button type="button" class="btn btn-white zntjo">手动</button></div><div class="form-group col-xs-7 col-sm-5"><input class="form-control" type="text" readonly style="cursor:pointer" placeholder="暂无数据，待被问后自动填充智能推荐问题，也可点击手动选择推荐问题" name="postQueInput" value="（浏览' + dataFilter(SuggestQuestion[p].Hits) + '次）'+ '" rel="' + SuggestQuestion[p].Id + '" srel="' + SuggestQuestion[p].SolutionId + '"></div><div class="form-group col-xs-3 col-sm-2 m-t-5 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a> <a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>');
    
                                        var _thisInput=$('[name=postQueInput]').eq(j-1);
                                        // var hits=_thisInput.val();
                                        _thisInput.val(SuggestQuestion[p].Question);
                                    }
                                    p++;
                                }else{ //计数变量与当前问题的排序号不一致，插入空的智能推荐
                                    $('#queManual').append('<div class="QueContainer row interQ"><div class="form-group col-xs-2 col-sm-1"><button type="button" class="btn btn-primary zntjo">智能</button></div><div class="form-group col-xs-7 col-sm-5"><input class="form-control" type="text" readonly style="cursor:pointer" placeholder="暂无数据，待被问后自动填充智能推荐问题，也可点击手动选择推荐问题" name="postQueInput"></div><div class="form-group col-xs-3 col-sm-2 m-t-5 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a> <a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>');
                                }
                            } else {//推荐问题无值，插入智能推荐
                                $('#queManual').append('<div class="QueContainer row interQ"><div class="form-group col-xs-2 col-sm-1"><button type="button" class="btn btn-primary zntjo">智能</button></div><div class="form-group col-xs-7 col-sm-5"><input class="form-control" type="text" readonly style="cursor:pointer" placeholder="暂无数据，待被问后自动填充智能推荐问题，也可点击手动选择推荐问题" name="postQueInput"></div><div class="form-group col-xs-3 col-sm-2 m-t-5 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a> <a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>');
                            }
                        }
                        
                        SuggestModeTab=data.question.SuggestMode;//保存推荐问题状态
                        //存储多余智能推荐条数的问题
                        for(var q=len;q<SuggestQuestion.length;q++){
                            sugQuestionList.push(SuggestQuestion[q]);
                        }
                        switch (data.question.SuggestMode) {
                            case 0: //关闭
                                $('.recomBtn').eq(0).trigger('click');
                                $('.recomBtn a').eq(0).trigger('click');
                                break;

                            case 2: //智能推荐
                                $('.recomBtn').eq(1).trigger('click');
                                $('.recomBtn a').eq(1).trigger('click');
                                break;
                        }
                    }


                    $('#keypopi').tooltip({
                        'html': true,
                        'title': '<div style="width:180px">关键词添加用逗号隔开，当访客问题中涉及到该关键词，给出该问题的答案。若多个问题添加该关键词，机器人匹配给出反问引导。</div>',
                        'template': '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
                    });
                    $('.tbody1').empty().append(html);
                    if (sessionStorage.getItem('sentenceValue') == 1) {
                        $('.interTerm1').css('display', 'inline-block');
                        $('.interTerm1').next().css('display', 'inline-block');
                    } else {
                        $('.interTerm1').css('display', 'none');
                        $('.interTerm1').next().css('display', 'none');
                    }
                    /*=============判断农信配置是否开启================*/
                    if (sessionStorage.getItem('qAndACloseValue') == 1) {
                        $('.titleCtn .glyphicon-edit').removeClass('editQue timeTip').addClass('editQueGrey').removeAttr('title');
                        $('.queEditor .glyphicon-trash').removeClass('oneDelQue timeTip').addClass('oneDelQueGrey').removeAttr('title');
                    } else {
                        $('.titleCtn .glyphicon-edit').addClass('editQue timeTip').removeClass('editQueGrey').attr('title', '修改问题');
                        $('.queEditor .glyphicon-trash').addClass('oneDelQue timeTip').removeClass('oneDelQueGrey').attr('title', '删除问题');
                    }


                    $('.timeTip').tooltip();
                    $('.interTerm1').tooltip({
                        'placement': 'right'
                    });

                    clickLabelEdit();  //修改标签
                    $('.interTerm1>a').hover(function () {
                        if ($(".queWholeCtn").parents('tr').attr('sgid') === "null") {
                            $(".spanInter").css('opacity', 1);
                            //var html = "<div>智能句式：在添加问题时引用该句式组，即可用句式组下面的问法去咨询该问题</div>"
                            //$(".spanInter").html(html);
                            $("[data-toggle~=tooltip]").tooltip({
                                'html': true,
                                'title': "<div>智能句式：在添加问题时引用该句式组，即可用句式组下面的问法去咨询该问题</div>",
                                'placement': "right",
                                'template': '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="min-width: 200px;text-align: left"></div></div>'
                            }).tooltip('show');
                        } else {
                            sentenceInter();
                        }
                    }, function () {
                        $(".spanInter").html('');
                        $(".spanInter").css('opacity', 0);
                    });

                    $('.interTerm1 a').click(function () {
                        $("#modal-intelTerm .entityTio").val('');
                        $('#modal-intelTerm').modal('show');
                        $("#modal-intelTerm .entityTio").val($(".queWholeCtn").parents('tr').attr('entity'));
                        $('[name="checkedId"]').val($(".queWholeCtn").parents('tr').attr('sgid'));
                    });
                    $('.ansItemCtn').find('img').each(function () {
                        if ($(this).attr('style') == undefined) {
                            var container = $('<a data-lightbox="roadtrip">' + $(this).prop("outerHTML") + '</a>');
                            container.attr('href', $(this).attr('src'));
                            $(this).after(container);
                            $(this).remove();
                        }
                    });

                    groupId2 = $('.tbody1 tr').attr('groupid');
                    solutionId2 = $('.tbody1 tr').attr('solutionId');
                    $("#modal-intelTerm input[name=solutionId]").val(solutionId2);
                    initSrc2();


                    $('select').each(function () {
                        var cur = parseInt($(this).attr('cur'));
                        $('option[value=' + cur + ']', $(this)).attr({
                            'selected': 'true'
                        });
                    });


                }
            },
        });
    }

    initSrc();
    $('[data-toggle="tooltip"]').tooltip();

    //选择智能句式组后匹配出对应下面的句式
    function sentenceInter() {
        var html = '系统已生成下列几种句式：<br />';
        $.ajax({
            type: "post",
            url: "../../KnSentenceItem/getKSItemList",
            async: true,
            cache: true,
            data: { 'sgId': $(".queWholeCtn").parents('tr').attr('sgid') },
            success: function (data) {
                if (data.status == 0) {
                    var list = data.knList;
                    if (list.length <= 0) {
                        html = '这个句式组下没有句式！<br />';
                    }
                    //如果配置项sentenceShow==0且大于5条，则只显示5条；否则全部显示
                    if (sessionStorage.getItem('sentenceShow') == 0) {
                        if (list.length >= 5) {
                            for (var i = 0; i < 5; i++) {
                                html += (i + 1) + '.' + list[i].SiName + '<br />';
                            }
                        } else {
                            for (var i = 0; i < list.length; i++) {
                                html += (i + 1) + '.' + list[i].SiName + '<br />';
                            }
                        }
                    } else {
                        for (var i = 0; i < list.length; i++) {
                            html += (i + 1) + '.' + list[i].SiName + '<br />';
                        }
                    }
                    $(".spanInter").css('opacity', 1);
                    //$(".spanInter").html(html);
                    $('[data-toggle~=tooltip]').tooltip({
                        'html': true,
                        'title': html,
                        'placement': "right",
                        'template': '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner" style="min-width: 200px;text-align:left;"></div></div>'
                    }).tooltip('show');
                }
            }
        })
    }

    $('#modal-keyword').on('show.bs.modal', function () {
        $('#highLevelForm input[name=keyWord]').val(($('[data-type=keyword] em').text() == '暂无' ? '' : $('[data-type=keyword] em').text()));
        //$('#highLevelForm input[name=requestRegex]').val(($('[data-type=RequestRegex] em').text()=='暂无'?'':$('[data-type=RequestRegex] em').text()));
        $('#highLevelForm input[name=groupId]').val($('[data-type=RequestRegex] em').parents('tr').attr('groupid'));
        $('#highLevelForm input[name=solutionId]').val($('[data-type=RequestRegex] em').parents('tr').attr('solutionid'));
    })
    $('#modal-keyword').on('hidden.bs.modal', function () {
        $('.inputKey').val('');
    })

    $('#modal-formula').on('show.bs.modal', function () {
        //$('#highLevelForm input[name=keyWord]').val(($('[data-type=keyword] em').text()=='暂无'?'':$('[data-type=keyword] em').text()));
        $('#highFormulaForm input[name=requestRegex]').val(($('[data-type=RequestRegex] em').text() == '暂无' ? '' : $('[data-type=RequestRegex] em').text()));
        $('#highFormulaForm input[name=groupId]').val($('[data-type=RequestRegex] em').parents('tr').attr('groupid'));
        $('#highFormulaForm input[name=solutionId]').val($('[data-type=RequestRegex] em').parents('tr').attr('solutionid'));
    })
    $('#modal-formula').on('hidden.bs.modal', function () {
        $('.inputKey').val('');
    })

    //ENTER
    $(document).on('keyup', function (e) {
        var $activeEl = $(document.activeElement);

        if ($activeEl.is('.inputKey') && (e.keyCode == 13 || e.keyCode == 108)) {
            $('.addKeyWord').trigger('click');
        }
    });

    // 添加关键字
    $('.addKeyWord').on('click', function () {
        Base.request({
            url: 'question/editQuestionInfo',
            params: {
                keyWord: $('#highLevelForm input[name=keyWord]').val(),
                requestRegex: $('.requestRegex em').text() == '暂无' ? '' : $('.requestRegex em').text(),
                questionId: $('.tbody1 tr').attr('id'),
                solutionId: $('#highLevelForm input[name=solutionId]').val(),
                groupId: $('#highLevelForm input[name=groupId]').val()
            },
            callback: function (data) {
                if (data.status) {
                    Base.gritter(data.message, false);
                } else {
                    Base.gritter(data.message, true);
                    $('#modal-keyword').modal('hide');
                    initSrc();
                }
            },
        });
    })
    // 添加公式
    $('.addFormula').on('click', function () {
        Base.request({
            url: 'question/editQuestionInfo',
            params: {
                keyWord: $('.keyWord em').text() == '暂无' ? '' : $('.keyWord em').text(),
                requestRegex: $('#highFormulaForm input[name=requestRegex]').val(),
                questionId: $('.tbody1 tr').attr('id'),
                solutionId: $('#highFormulaForm input[name=solutionId]').val(),
                groupId: $('#highFormulaForm input[name=groupId]').val()
            },
            callback: function (data) {
                if (data.status) {
                    Base.gritter(data.message, false);
                } else {
                    Base.gritter(data.message, true);
                    $('#modal-formula').modal('hide');
                    initSrc();
                }
            },
        });
    })

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

    var being = false;
    //确认修改问题
    $('body').on('click', '.ensureQue', function () {
        var $tr = $(this).parents('tr'),
            $input = $(this).prev('input'),
            question = $input.val();


        if (!being) {
            being = true;
            Base.request({
                url: 'question/editQuestion',
                params: {
                    solutionId: $tr.attr('solutionId'),
                    groupId: $tr.attr('groupId'),
                    questionId: $tr.attr('id'),
                    question: question,
                },
                callback: function (data) {
                    if (data.status) {
                        Base.gritter(data.message, false);
                    } else {
                        Base.gritter(data.message, true);
                        if (!data.status) {
                            $tr.find('.queTitle').text(question);
                            $input.parent().fadeOut(function () {
                                being = false;
                                $(this).remove();
                            });
                        }
                    }
                },
            });
        }

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
        This.location.href = 'addQuestion.html';
    });

    //取消修改问题
    /*$('body').on('click', '.notSelect', function() {
     $.gritter.add({
     title: "提醒",
     text: '请先发布问题',
     });
     });*/

    //修改问题状态
    $('body').on('change', 'select', function () {
        var $tr = $(this).parents('tr'),
            $ansItem = $(this).parents('.ansItem'),
            status = 0;

        $('option', $(this)).each(function (i) {
            if ($(this).prop('selected')) {
                status = $(this).val();
            }
        });

        if ($(this).is('.editStatus')) {
            Base.request({
                url: 'question/doUpdateStatus',
                params: {
                    solutionId: $tr.attr('solutionId'),
                    status: status,
                },
                callback: function (data) {
                    yunNoty(data);
                },
            });
        } else {
            Base.request({
                url: 'answer/updateStatus',
                params: {
                    answerId: $ansItem.attr('id'),
                    groupId: $ansItem.attr('groupId'),
                    status: status,
                },
                callback: function (data) {
                    yunNoty(data);
                },
            });
        }


    });

    //导入问题
    $('.importQue').on('click', function () {
        This.location.href = 'importQuestion.html';
    });

    /*taskId=558  智能推荐功能优化
    *说明：创建变量，doSetSugQuestions接口所需参数
    */ 
    var suggestMode = 0,//是否开启问题推荐功能 0：关闭 2：开始
        sugQIds = '',//问题id
        sugSids = '',
        sugQuestionOrders='';//手动推荐的位置顺序

    //手动添加推荐问题
    $('.reflashRec').on('click', function () {
        var index = 0;
        sugQIds = '';
        sugSids = '';
        sugQuestionOrders='';
        $('.recomBtn').each(function (i) {
            if ($(this).is('.active')) {
                index = i;
            }
        });

        switch (index) {
            case 0:
                suggestMode = 0;
                break;
            case 1:
                suggestMode = 2;
                break;
        }
        /*taskId=558  智能推荐功能优化 Amend by 赵宇星
        *说明：获取手动推荐问题id，以及顺序
        *修改：仅传输手动推荐
        */ 
        $('input[name=postQueInput]').each(function (i) {
            if ($(this).attr('srel')) {
                if ($(this).parent().prev().children().hasClass('btn-white')) {
                    sugQIds += $(this).attr('rel') + ',';
                    sugSids += $(this).attr('srel') + ',';
                    sugQuestionOrders+=(i+1)+',';//i必须从1开始，
                } 
            }
            i++;
        });
        sugQIds = sugQIds.replace(/\,$/, '');
        sugSids = sugSids.replace(/\,$/, '');
        sugQuestionOrders=sugQuestionOrders.replace(/\,$/, '');
        // editIfs = editIfs.replace(/\,$/, '');

        /*taskId=558  智能推荐功能优化 Amend by 赵宇星
        *说明：点击刷新按钮，仅发送手动推荐的内容
        *修改：去除editIfs，增加sugQuestionNum 问题推荐总数，sugQuestionOrders 手动推荐问题的序号
        */ 

        //获取问题推荐的总条数
        var sugQuestionNum=$('#queManual .QueContainer').length;
        if(sugQuestionNum==0){
            sugQuestionNum='';
        }
        Base.request({
            url: 'question/doSetSugQuestions', 
            params: {
                solutionId: $('.tbody1 tr').attr('solutionid'),//问题Id
                suggestMode: suggestMode,//是否开启问题推荐功能 0：关闭 2：开始
                sugQIds: sugQIds,//问题id
                sugSids: sugSids,
                sugQuestionNum:sugQuestionNum,//问题推荐的总条数
                sugQuestionOrders:sugQuestionOrders//手动推荐的位置顺序
            },
            callback: function (data) {
                yunNoty(data);
                //重新加载页面
                window.location.reload();
            },
        });
    });


    /*taskId=558  智能推荐功能优化 add by zhaoyuxing 
    *说明：默认状态下无刷新按钮，切换推荐问题状态时，出现刷新按钮
    */ 
    $('.recomBtn').on('click',function(){
        var nowTab='';
        if($(this).children().html()=='关闭'){
            nowTab=0;
        }else if($(this).children().html()=='问题推荐'){
            nowTab=2;
        }
        if(nowTab!=SuggestModeTab){
            $('.reflashRec').css('display','inline-block');
        }
    })

    var $ansItem = null,
        $tr = null;
    //确认删除答案或问题
    $('#delYes').on('click', function () {
        var title = $('#tipTitle').text();

        if (title == '删除答案') {
            Base.request({
                url: 'answer/deleteAnswer',
                params: {
                    solutionId: $ansItem.attr('solutionId'),
                    groupId: $ansItem.attr('id'),
                    id: $ansItem.attr('id'),
                },
                callback: function (data) {
                    $('#delAnsConfirm').modal('hide');
                    if (data.status) {
                        yunNoty(data);
                    } else {
                        yunNoty(data);
                        isJpage = 0;
                        initSrc();
                    }
                },
            });
        }
        if (title == '删除问题') {
            queDetele('#delAnsConfirm');
        }
    });

    //删除答案或问题
    $('body').on('click', '.oneDelAns, .multDelAns, .oneDelQue, .multDelQue', function (e) {
        $ansItem = $(this).parents('.ansItem');
        $tr = $(this).parents('tr');

        var ansItemLen = $tr.find('.ansItem').length;

        if ($(e.target).is('.oneDelAns')) { //单个删除答案
            if (ansItemLen == 1) {
                var tmpOBj = {
                    "message": "问题至少要有一个答案",
                    "status": 1
                };
                yunNoty(tmpOBj);
            } else {
                $('#delAnsConfirm').modal('show');
                $('#tipTitle').text('删除答案');
                $('#tipWord').text('确认删除该答案？');
            }
        }
        /*
         *  taskId = 543 删除问题、流程、流程项的处理
         *  1、单个删除时查询问题或流程是否存在关联关系
         *     如果data.ref存在且data.ref等于1则有关联关系：
         *  2、有关联关系时判断是否能进入回收站：
         *      （1）：如果data.canNotRenewSolutionList的长度为0：
         *            可以进入回收站
         *      （2）否则不能进入回收站：
         *            通过SolutionType判断关联的是流程还是问题  SolutionType==1 问题   SolutionType==2 流程
         *            删除点击删除全部时不进入回收站
         *@param  _tr:删除的问题或流程的id
         *@param  isQue:判断删除的是流程还是问题
         *@param  html：拼接关联的问题或流程
         *@param  corSetId：不进入回收站的id
         *@param  nowId 页面选中的id
         *@param  flowId:引用的id
         */
        if ($(e.target).is('.oneDelQue')) {
            var _tr = $(e.target).parents('tr').attr('id');//该问题或流程的id
            var html = '';
            var corSetId = '';
            var flowId = '';
            var nowId = '';
            Base.request({
                url: 'question/findSolutionCor',
                params: {
                    ids: _tr
                },
                callback: function (data) {
                    if(data.status == 0){
                        if(data.ref && data.ref == 1){
                            $('#queDelModel').modal('show');
                            for(var i = 0;i < data.solutionList.length;i++){
                                if(data.solutionList[i].SolutionType == 1){
                                    html+='<p><a href="../../web/knowledge/queDetail.html?id='+data.solutionList[i].Id+'" data-num="0" data-name="问题详细">'+data.solutionList[i].Question+'</a></p>';
                                }else{
                                    html+='<p><a href="../../web/knowledge/editFlow.html?questionId='+data.solutionList[i].Id+'&groupId='+data.solutionList[i].GroupId+'&solutionId='+data.solutionList[i].SolutionId+'&tmpNum='+tmpNum+'" data-num="0" data-name="流程详细">'+data.solutionList[i].Question+'</a></p>';
                                }
                            }
                            if(data.canNotRenewSolutionList.length == 0){
                                //可以进入回收站
                                relationMine = 1;
                                $('#queDelModel .delQueAnsTitle').html('&nbsp;&nbsp;删除该问题将会一并删除与之相关的答案、相似问法，确认删除该问题？（删除的问题或流程可在知识库回收站中找回）');
                            }else{
                                //不进入回收站的id
                                for(var j = 0;j < data.canNotRenewSolutionList.length;j++){
                                    corSetId += data.canNotRenewSolutionList[j].Id+',';
                                }
                                relationMine = 0;
                                $('#queDelModel .delQueAnsTitle').html('&nbsp;&nbsp;删除该问题将会一并删除与之相关的答案、相似问法，确认删除该问题？（引用了其他问题或流程，删除后不可恢复！）');
                            }
                            /*引用的标问的id*/
                            for(var i = 0;i < data.resultIds.length;i++){
                                flowId += data.resultIds[i]+',';
                            }
                            /*关联的id*/
                            for(var i = 0;i < data.deleteSolutionIds.length;i++){
                                nowId += data.deleteSolutionIds[i]+',';
                            }
                            $('#queDelModel .nowId').val(nowId.substring(0,nowId.length-1));
                            $('#queDelModel .corSetId').val(corSetId.substring(0,corSetId.length-1));
                            $('#queDelModel .flowId').val(flowId.substring(0,flowId.length-1));
                            $('#queDelModel .flowList').html(html);
                        }else{
                            if(data.canNotRenewSolutionList.length == 0){
                                relationMine = 1;
                                $('#delAnsConfirm #tipWord').html('&nbsp;&nbsp;删除该问题将会一并删除与之相关的答案、相似问法，确认删除该问题？（删除的问题或流程可在知识库回收站中找回）');
                            }else{
                                relationMine = 0;
                                $('#delAnsConfirm #tipWord').html('&nbsp;&nbsp;删除该问题将会一并删除与之相关的答案、相似问法，确认删除该问题？（引用了其他问题或流程，删除后不可恢复！）');
                            }
                            //不是进入回收站
                            for(var j = 0;j < data.canNotRenewSolutionList.length;j++){
                                corSetId += data.canNotRenewSolutionList[j].Id+',';
                            }
                            /*引用的标问的id*/
                            for(var i = 0;i < data.resultIds.length;i++){
                                flowId += data.resultIds[i]+',';
                            }
                            /*关联的标问的id*/
                            for(var i = 0;i < data.deleteSolutionIds.length;i++){
                                nowId += data.deleteSolutionIds[i]+',';
                            }
                            $('#delAnsConfirm').modal('show')
                            $('#delAnsConfirm .nowId').val(nowId.substring(0,nowId.length-1));
                            $('#delAnsConfirm .corSetId').val(corSetId.substring(0,corSetId.length-1));
                            $('#delAnsConfirm .flowId').val(flowId.substring(0,flowId.length-1));
                            $('#delAnsConfirm .delAnsFlowId').val(_tr);
                        }
                    }else{
                        Base.gritter(data.message, false)
                    }
                },
            })
        }
    });
    /* 存在关联关系  点击删除全部 */
    $('#selQueBtn').on('click',function(){
        queDetele('#queDelModel');
    })
    function queDetele(obj){
        //获得选中问题或流程的id放入ids[]中
        var ids = []
        $('.singleCos').each(function () {
            var $tr = $(this).parents('tr'),
                id = $tr.attr('Id')
            if ($(this).is(':checked')) {
                ids.push(id)
            }
        })
        //ID : flowId加上nowId去重
        var NowID = $(obj).find('.nowId').val();
        var FlowId = $(obj).find('.flowId').val();
        var Ids = [];
        if(NowID){
            Ids.push(NowID);
        }
        if(FlowId){
            Ids.push(FlowId);
        }
        Array.prototype.unique3 = function(){
            var res = [];
            var json = {};
            for(var i = 0;i < this.length;i++){
                if(!json[this[i]]){
                    res.push(this[i]);
                    json[this[i]] = 1;
                }
            }
            return res;
        }
        if(relationMine == 1){//进入回收站
            Base.request({
                url: 'question/delOptQuestionByIds',//有关联关系  删除全部
                params: {
                    ids:Ids.unique3().toString()
                },
                callback: function (data) {
                    $(obj).modal('hide');
                    if (data.status) {
                        Base.gritter(data.message, false)
                    } else {
                        $.gritter.add({
                            title: "提醒",
                            text: data.message,
                            time: 3000,
                            after_close: function () {
                                var ifT = iframeTab.init({ iframeBox: '' });
                                ifT.closeActIframe('', parent.$('#tabHeader li[data-num="' + getUrlParam('tmpNum') + '"]').attr('data-tab'));
                            }
                        });
                    }

                },
            })
        }else{
            Base.request({
                url: 'question/delOptQuestionByIds',//删除关联关系
                params: {
                    ids:Ids.unique3().toString()
                },
                callback: function (data) {
                    if (data.status) {
                        Base.gritter(data.message, false)
                    } else {
                        Base.request({
                            type:'get',
                            cache:false,
                            url: 'question/clearQuestionByIds',//不进入回收站
                            params: {
                                ids:$(obj).find('.corSetId').val()
                            },
                            callback: function (data) {
                                $(obj).modal('hide');
                                $.gritter.add({
                                    title: "提醒",
                                    text: data.message,
                                    time: 3000,
                                    after_close: function () {
                                        var ifT = iframeTab.init({ iframeBox: '' });
                                        ifT.closeActIframe('', parent.$('#tabHeader li[data-num="' + getUrlParam('tmpNum') + '"]').attr('data-tab'));
                                    }
                                });
                            },
                        })
                    }

                },
            })
        }
    }
    var pageNo2 = 1, //当前页
        pageSize2 = 10, //每页数量
        isJpage2 = 0, //是否已实例化jpage
        delPage2 = 0, //是否删除jpage
        question2 = '',
        orderType2 = 4;
    var simiQue = 0;
    var entitysStr = '';

    function initSrc2() {
        Base.request({
            url: 'question/findSimilarQuestion',
            params: {
                pageSize: pageSize2,
                pageNo: pageNo2,
                solutionId: solutionId2,
                groupId: groupId2,
                question: question2,
                orderType: orderType2,
            },
            callback: function (data) {
                if (data.status) {
                    Base.gritter(data.message, false);
                } else {
                    var html = '';
                    if (data.listSimilar[0]) {
                        for (var i = 0; i < data.listSimilar.length; i++) {
                            html += '<tr Id="' + data.listSimilar[i].Id + '" SolutionId="' + data.listSimilar[i].SolutionId + '"><td><span class="simQue">' + data.listSimilar[i].Question + '</span></td><td><span class="viewTimes">' + (data.listSimilar[i].Hits || 0) + '</span></td><td style="white-space:nowrap;"><span>' + data.listSimilar[i].AddTime + '</span></td><td><a class="addSiToj"><span class="timeTip glyphicon glyphicon-plus" title="添加到句式组"></span></a><a class=""><span class="editSim timeTip glyphicon glyphicon-pencil" title="修改"></span></a><a class="delSimilar"><span class="timeTip glyphicon glyphicon-trash" title="删除"></span></a></td></tr>';
                        }
                        var options = {
                            data: [data, 'listSimilar', 'total'],
                            currentPage: data.currentPage,
                            totalPages: data.totlePages ? data.totlePages : 1,
                            alignment: 'right',
                            onPageClicked: function (event, originalEvent, type, page) {
                                pageNo2 = page;
                                initSrc2();
                            }
                        };
                        $('#itemContainer2').bootstrapPaginator(options);
                    } else {
                        html += '<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
                        $('#itemContainer2').empty();
                    }
                    $('.tbody2').empty().append(html);
                    if (sessionStorage.getItem('sentenceValue') == 1) {
                        $('.tbody2 .addSiToj').css('display', 'inline-block');
                    } else {
                        $('.tbody2 .addSiToj').css('display', 'none');
                    }
                    $('.timeTip').tooltip();
                    $(".addSiToj").click(function () {
                        var $tr = $(this).parents('tr');
                        var simiId = $tr.attr('id');
                        var solutionId = $tr.attr('solutionId');
                        //simiQue = $tr.find('td').eq(0).text();
                        addSiToj(simiId, solutionId);
                    });

                }
            },
        });
    }

    //ENTER
    $(document).on('keyup', function (e) {
        var $activeEl = $(document.activeElement);
        if ($activeEl.is('.inputSim') && (e.keyCode == 13 || e.keyCode == 108)) {
            $('.addSim').trigger('click');
        }
    });

    var entitysStr = '';
    //点击加号添加相似问法
    function addSiToj(simiId, solutionId) {
        $.ajax({
            type: "post",
            url: "../../KnSentenceGroup/siToJs",
            data: { "simiId": simiId, "solutionId": (solutionId||"") },
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

                        $("#similarBtn").off('click').click(function () {
                            entitysStr = '';
                            var simiQuestion = simiId;
                            var sgName = $("#addSentenceForm input[name=sgName]").val();
                            var classId = $("#addSentenceForm input[name=classId]").val();
                            $("#addSentenceForm .entitys").each(function (i) {
                                if ($("#addSentenceForm .entitys").eq(i).val() != '') {
                                    entitysStr += $("#addSentenceForm .entitys").eq(i).val() + ',';
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
            $('#form_entity').append(
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
            $('#modal-intelTerm #EntitysList').append('<div class="col-md-12" style="padding:0;margin-top:10px;">' +
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
            responseData.list.push({ Id: -1, ParentId: 0, Name: "全部分类", open: true });
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
        /*var cityObj = $("#queSel");
         var cityOffset = $("#queSel").offset();*/
        $("#menuContent1").slideDown("fast");
        $("body").bind("mousedown", onBodyDown2);
    }

    //添加模态框出现加载分类树
    $('#similarAddModal').on('show.bs.modal', function () {
        $.fn.zTree.init($("#classTree_phrase"), hideAddSetting, []);
    });
    $("#phraseTree").off('click').on('click', showMenu1);


    //添加相似问法
    $('body').on('click', '.addSim', function () {
        groupId2 = $('.tbody1 tr').attr('groupid');
        solutionId2 = $('.tbody1 tr').attr('solutionId');
        var question = $('.inputSim').val();

        Base.request({
            url: 'question/addSimilarQuestion',
            params: {
                solutionId: solutionId2,
                groupId: groupId2,
                question: question,
            },
            callback: function (data) {
                if (data.status) {
                    yunNoty(data);
                } else {
                    yunNoty(data);
                    $('#addSimilarModal').modal('hide');
                    $('.inputSim').val('');
                    initSrc2();
                }
            },
        });
    });

    //修改相似问法
    $('body').on('click', '.editSim', function () {
        var $tr = $(this).parents('tr'),
            $simQue = $tr.find('.simQue'),
            $simTr = $('<tr><td colspan="3"><input type="text" class="form-control" name="simiQue" placeholder="输入修改后的问题" maxlength="200"></td><td style="vertical-align: middle;"><a class="ensureSim"><span class="timeTip glyphicon glyphicon-ok" title="确定"></span></a><a class="cannelSim"><span class="timeTip glyphicon glyphicon-remove" title="取消"></span></a></td></tr>');

        if (!$tr.next().find('.ensureSim')[0]) {
            $tr.after($simTr);
            $simTr.hide().fadeIn();
            $('.timeTip').tooltip();

            $simTr.find('input').val($simQue.text()).focus();
        }
    });

    //确认修改相似问法
    $('body').on('click', '.ensureSim', function () {
        var $tr = $(this).parents('tr'),
            question = $tr.find('input').val()

        Base.request({
            url: 'question/editSimilarQuestion',
            params: {
                id: $tr.prev().attr('id'),
                groupId: groupId2,
                question: question,
            },
            callback: function (data) {
                if (data.status) {
                    yunNoty(data);
                } else {
                    yunNoty(data);
                    $tr.prev().find('.simQue').text(question);
                    $tr.fadeOut(function () {
                        $(this).remove();
                    });
                }
            },
        });
    });

    //ENTER
    $(document).on('keyup', function (e) {
        var $activeEl = $(document.activeElement);

        if ($activeEl.is('[name=simiQue]') && (e.keyCode == 13 || e.keyCode == 108)) {
            $('.ensureSim').trigger('click');
        }
    });

    //取消修改相似问法
    $('body').on('click', '.cannelSim', function () {
        var $tr = $(this).parents('tr');

        $tr.fadeOut(function () {
            $(this).remove();
        });
    });

    //删除问法
    $('body').on('click', '.delSimilar', function () {
        var $tr = $(this).parents('tr');

        Base.request({
            url: 'question/deleteSimilarQuestion',
            params: {
                id: $tr.attr('id'),
                groupId: groupId2,
            },
            callback: function (data) {
                if (data.status) {
                    Base.gritter(data.message, false);
                } else {
                    Base.gritter(data.message, true);
                    if ($('.delSimilar').length == 1) {
                        if (pageNo2 >= 2) {
                            pageNo2 -= 1;
                        }
                    }
                    initSrc2();
                }
            },
        });
    });

    //相似问法排序
    $('.simSort1').on('click', function () {
        $('.sortWord').html($(this).text() + '<span class="caret"></span>');
        orderType2 = 4;
        initSrc2();
    });
    $('.simSort2').on('click', function () {
        $('.sortWord').html($(this).text() + '<span class="caret"></span>');
        orderType2 = 3;
        initSrc2();
    });
    $('.simSort3').on('click', function () {
        $('.sortWord').html($(this).text() + '<span class="caret"></span>');
        orderType2 = 4;
        initSrc2();
    });
    $('.simSort4').on('click', function () {
        $('.sortWord').html($(this).text() + '<span class="caret"></span>');
        orderType2 = 5;
        initSrc2();
    });
    $('.simSort5').on('click', function () {
        $('.sortWord').html($(this).text() + '<span class="caret"></span>');
        orderType2 = 6;
        initSrc2();
    });

    //搜索相似问法
    $('.searchInput').on('click', function () {
        question2 = $('#searchSimilar').val();
        initSrc2();
    });

    //ENTER
    $(document).on('keyup', function (e) {
        var $activeEl = $(document.activeElement);

        if ($activeEl.is('#searchSimilar') && (e.keyCode == 13 || e.keyCode == 108)) {
            $('.searchInput').trigger('click');
        }
    });

    //当前加背景
    $('body').on('mouseover', '.ansItem', function () {
        var $td = $(this).parents('td');

        $(this).addClass('ansItem_focus').siblings().removeClass('ansItem_focus');
    });

    //全选
    $('body').on('ifChecked', '.multCos', function () {
        $('.singleCos').iCheck('check');
    });
    //全不选
    $('body').on('ifUnchecked', '.multCos', function () {
        $('.singleCos').iCheck('uncheck');
    });

    //历史版本
    var pageNo3 = 1, //当前页
        pageSize3 = 10, //每页数量
        isJpage3 = 0, //是否已实例化jpage
        delPage3 = 0, //是否删除jpage
        solutionId3 = 0,
        groupId3 = 0,
        subSolutionId3 = 0;

    function initSrc3() {
        Base.request({
            url: 'answer/getHistoryVersion',
            params: {
                pageSize: pageSize3,
                pageNo: pageNo3,
                subSolutionId: subSolutionId3,
            },
            callback: function (data) {
                if (data.status) {
                    Base.gritter(data.message, false);
                } else {
                    var html = '';
                    if (data.list[0]) {
                        for (var i = 0; i < data.list.length; i++) {
                            html += '<tr Id="' + (data.list[i].Id || '') + '" GroupId="' + data.list[i].GroupId + '"><td><span class="simQue">' + data.list[i].Answer + '</span><span class="viewTimes"> [ 浏览' + (data.list[i].Hits || 0) + '次 ]</span>';
                            if (data.list[i].Usefull && data.list[i].Usefull !== 0) {
                                html += '<span class="dot">|</span><a href="../../web/knowledge/satisfaction.html?solutionId=' + data.list[i].SolutionId + '&useFullType=1&count=' + data.list[i].Usefull + '" data-num="0" data-name="满意度评价详细">';
                                html += '<span><span class="glyphicon glyphicon-thumbs-up" title="赞"></span><em>' + data.list[i].Usefull + '</em>次</span></a>';
                            } else {
                                html += '<span class="dot">|</span><span><span class="glyphicon glyphicon-thumbs-up" title="赞"></span><em>0</em>次</span>';
                            }
                            if (data.list[i].Useless && data.list[i].Useless !== 0) {
                                html += '<span class="dot">|</span><a href="../../web/knowledge/satisfaction.html?solutionId=' + data.list[i].SolutionId + '&useFullType=2&count=' + data.list[i].Useless + '" data-num="0" data-name="满意度评价详细">';
                                html += '<span><span class="glyphicon glyphicon-thumbs-down" title="踩"></span><em>' + data.list[i].Useless + '</em>次</span></a>';
                            } else {
                                html += '<span class="dot">|</span>';
                                html += '<span><span class="glyphicon glyphicon-thumbs-down" title="踩"></span><em>0</em>次</span>';
                            }
                            html += '</td>';
                            html += '<td style="white-space:nowrap;"><span>' + data.list[i].UserName + '</span><br><span>' + data.list[i].AddTime + '</span></td></tr>';
                        }

                        var options = {
                            data: [data, 'list', 'total'],
                            currentPage: data.currentPage,
                            totalPages: data.totlePages ? data.totlePages : 1,
                            alignment: 'right',
                            onPageClicked: function (event, originalEvent, type, page) {
                                //Amend by zhaoyuxing At 20171213 无单号 修改bug
                               //说明：修改历史记录分页bug 分页时接收页码的变量为pageNo3 将原来的pageNo 改为 pageNo3
                                pageNo3 = page;
                                initSrc3();
                            }
                        };
                        $('#itemContainer3').bootstrapPaginator(options);
                    } else {
                        html += '<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
                        $('#itemContainer3').empty();
                    }
                    $('.tbody3').empty().append(html);
                    $('.timeTip').tooltip();


                }
            },
        });
    }

    //弹出历史版本框
    $('body').on('click', '.lookBe', function () {
        var $ansItem = $(this).parents('.ansItem');

        $('.ansItemCtnClone').empty().append($ansItem.find('.ansItemCtn').clone());

        subSolutionId3 = $ansItem.attr('subSolutionId');
        isJpage3 = 0;
        initSrc3();
    });

    //跳转
    $('.goPage-addSrc3 a').on('click', function () {
        $('.holder1').jPages(parseInt($('.goPage-addSrc3 input').val()));
        return false;
    });

    //全选
    $('.goPage-addSrc3 input').on('focus', function () {
        $(this).select();
    });

    //智能推荐列表
    /*taskId=558  智能推荐功能优化 Amend by 赵宇星
    *说明：1、默认状态刷新按钮隐藏，对推荐进行了操作（如关闭、开启智能推荐、修改智能推荐，  增加推荐、删除推荐），则出现刷新按钮
        2、手动推荐转为智能推荐时，页面中所有的智能推荐的问题按照后台返回的顺序显示
        3、点击智能推荐时，切换为手动推荐，执行手动推荐的逻辑
    */
    $("#queManual").on("click", ".zntjo", function () {
        if( $(this).html()=='手动'){//手动推荐切换为智能推荐时，1、原先有智能推荐的值，则还原改值；2、原先无值，但有多余的推荐问题，若有则添加多余；3、无多余的推荐问题，添加空的智能推荐
            if ($(this).parent().next().children().val() != '') {
                $(this).html('智能');
                $(this).parent().parent().addClass('interQ');
                if ($(this).hasClass('btn-white')) {
                    $(this).removeClass('btn-white').addClass('btn-primary');
                }
                refreshInterQ();
            }
        }else if( $(this).html()=='智能'){
            QandFIndex = $(this).parent().parent().index();
            showQueModal();
            $('.reflashRec').css('display','inline-block');
        }
        $('.reflashRec').css('display','inline-block');
    });

    $('#queManual').on('click', 'a[name=delpostInput]', function () {
        if ($('#queManual a[name=delpostInput]').size() > 1) {
            $(this).parent().parent().remove();
        } else {
            $('#queManual [name=postQueInput]').removeAttr('rel');
            $('#queManual [name=postQueInput]').removeAttr('srel');
            $('#queManual [name=postQueInput]').val('');
        }
        $("#queManual a[name=addpostInput] span").show()
        if ($("#queManual a[name=delpostInput]").length <= 1) {
            $("#queManual a[name=delpostInput] span").hide()
        }
        $('.reflashRec').css('display','inline-block');
    });


    /*taskId=558  智能推荐功能优化
    *说明：点击输入框显示刷新按钮
    */ 
    $('#queManual').on('click', '[name=postQueInput]', function () {
        QandFIndex = $(this).parent().parent().index();
        showQueModal();
        $('.reflashRec').css('display','inline-block');
    });

    /*taskId=558  智能推荐功能优化
    *说明：去除手动推荐与后台返回的所有智能推荐去重
    */ 
    function filterRepeat(sug){
        var handQ=[];//用于存储手动推荐的内容的id
        $('#queManual .btn-white').each(function(index,ele){
            handQ[($(ele).parent().next().children().attr('rel'))]=1;
        })
        if(handQ[sug.Id]){
            return false;
        }else{
            return true;
        }
    }
    /*taskId=558  智能推荐功能优化
    *说明：始终在按照后台传来智能推荐问题的顺序显示智能推荐
    */ 
    function refreshInterQ(){
        $('#queManual .interQ').each(function(index,ele){//给每个推荐问题重新赋值
            if(sugQuestionList[index]){//如果有智能推荐则填充智能推荐内容
                //去重
                if(filterRepeat(sugQuestionList[index])){
                    $(ele).find('input').eq(0).attr('rel',sugQuestionList[index].Id)  
                    .attr('srel',sugQuestionList[index].SolutionId)
                    .val(sugQuestionList[index].Question);  
                }else{
                    index++;
                }
            }else{//没有则添加空内容
                $(ele).find('input').eq(0).attr('rel',0)  
                                .attr('srel',0)
                                .val('')        
            }
        })
    }
    /*taskId=558  智能推荐功能优化
    *说明：开启智能推荐 推荐问题最多10条，最少1条；点击添加时，页面中的智能推荐按照后台传来的顺序重新显示
    *修改：点击加号增加时:显示刷新按钮；queManual（推荐问题表单）等于10条，隐藏增加按钮；等于1条，隐藏减少按钮;
    */ 
    
    $('#queManual').on('click', 'a[name=addpostInput]', function () {
        if ($('#queManual a[name=addpostInput]').size() < 10) {

            $('#queManual').append('<div class="QueContainer row interQ"><div class="form-group col-xs-2 col-sm-1"><button type="button" class="btn btn-primary zntjo">智能</button></div><div class="form-group col-xs-7 col-sm-5"><input class="form-control" type="text" readOnly style="cursor:pointer;" placeholder="暂无数据，待被问后自动填充智能推荐问题，也可点击手动选择推荐问题" name="postQueInput" rel="0"></div><div class="form-group col-xs-3 col-sm-2 m-t-5 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>&nbsp;<a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>');

            refreshInterQ();
        }
        $("#queManual a[name=delpostInput] span").show()
        if ($("#queManual a[name=addpostInput]").length >= 10) {
            $("#queManual a[name=addpostInput] span").hide()
        }
        $('.reflashRec').css('display','inline-block');
    });
    $('#queDivNav a').click(function (e) {
        if ($(this).attr('href') == '#queManualQue') {
            sQue();
        } else if ($(this).attr('href') == '#queManualFlow') {
            fQue();
        }
    });

    $('.lookFor').on('click', function () {
        addQueSearch();
    })
    // 搜索
    function addQueSearch() {
        if ($('#queDivNav li').eq(0).hasClass('active')) {
            sQue();
        } else if ($('#queDivNav li').eq(1).hasClass('active')) {
            fQue();
        } else {
            sQue();
            fQue();
        }
    }

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
        $('#QuestionClassModel input[name=treeName]').val(Nodes[0].Name);
        $('#QuestionClassModel input[name=treeId]').val(Nodes[0].Id);
    }

    function zTreeBeforeClick(treeId, treeNode, clickFlag) {
        return !treeNode.isParent; //当是父节点 返回false不让选取
    }

    function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
        var treeObj = $.fn.zTree.getZTreeObj("treeClasses");
        //treeObj.expandAll(true);
    }

    function filterP(node) {
        return (node.isParent == false);
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
                Name: "全部分类",
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
                    $('#termTable tr input[name=match]').on('ifClicked', function () {
                        $('[name="checkedId"]').val($(this).parents('tr').attr('id'));
                    })
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
                    $("#tabTitle").text('');
                    $('#termTable').find('tbody').html('<tr><td colspan=\"4\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>  当前纪录为空！</td></tr>');
                    $('#termPageList').html('');
                }
            }
        });
    }

    // 添加智能句式
    var switchStatus = 1;
    $('#intelMatchContainer input[data-change="check-switchery-state-text"]').on("change", function () {
        switchStatus = $(this).attr("checked") ? 1 : 0;
        if (switchStatus == 0) {
            //不启用
            $('[name=match]').iCheck('uncheck');
            $("#termTable td .iradio_flat-blue.checked").parents('tr').attr('id', '');
        }
    });
    $('.addTerm').on('click', function () {
        var entitysTioAtr = $("#EntitysList .entityTio").val();
        if (switchStatus == 0) {
            //不启用
            $("#termTable td .iradio_flat-blue.checked").parents('tr').attr('id', '');
        }
        $(".queWholeCtn").parents('tr').attr('sgid', $("#termTable td .iradio_flat-blue.checked").parents('tr').attr('id'));
        $.ajax({
            url: '../../KnSentencegroupSolution/doEditKSSolution',
            type: 'post',
            data: {
                'solutionStr': $('#modal-intelTerm input[name=solutionId]').val(),
                'sgId': ($('[name="checkedId"]').val() != "null") ? $('[name="checkedId"]').val() : '',
                'entitys': entitysTioAtr,
                'qiYong': switchStatus
            },
            success: function (data) {
                if (data.status == 0) {
                    yunNoty(data);
                    $('#modal-intelTerm').modal('hide');
                    initSrc();
                } else {
                    yunNoty(data);
                }
            }
        });
    });


    //智能推荐树
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
            beforeClick: hidezTreeBeforeClick
        }
    };

    function hidezTreeBeforeClick(treeId, treeNode, clickFlag) {
        //return !treeNode.isParent;//当是父节点 返回false 不让选取
        if (treeNode.isParent == true) {
            $('#search_Que input[name=isLeaf]').val(0);
        } else {
            $('#search_Que input[name=isLeaf]').val(1);
        }
    }

    /*********************tree end***********************/

    /**
     * 手动设置智能推荐确定  不显示浏览次数
     */
    $('#queManualConfirm').click(function () {
        var addFlag = false;
        var id = getSelectedIds_aQue();
        var SolutionId = getSelectedSolutionIds_aQue();
        var hits = $('#list-tr-' + id).attr('hits');
        var targetInput = $('#queManual [name=postQueInput]').eq(QandFIndex);
        if (targetInput.val() === '') {
            addFlag = true;
        }
        if(id){
          targetInput.attr('rel', id);
          targetInput.attr('Srel', SolutionId);
          targetInput.val( $('#queDiv #list-tr-' + id).children('td').eq(1).html());
          targetInput.parent().prev().children().removeClass('btn-primary').addClass('btn-white');
          targetInput.parent().prev().children().html('手动');
          //taskId=558 切换为手动推荐后去除父元素中智能推荐class标记
          targetInput.parent().parent().removeClass('interQ');
          $(this).parent().parent()
          $('#queManualModal').modal('hide');
          refreshInterQ();
          if (addFlag) {
              /*if ($('#queManual a[name=addpostInput]').size() < 5) {
               $('#queManual').append('<div class="QueContainer row"><div class="form-group col-xs-2"><button type="button" class="btn btn-primary zntjo">智能推荐</button></div><div class="form-group col-xs-8"><input class="form-control" type="text" readOnly style="cursor:pointer;" placeholder="此条为智能推荐,可选择问题手动推荐" name="postQueInput" rel="0"></div><div class="form-group col-xs-2 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>&nbsp;<a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div');
               }*/
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
        } else if ($('#queManualFlow').hasClass('active')) {
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
        } else if ($('#queManualFlow').hasClass('active')) {
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

    /**
     * 智能推荐列表的滚动条
     */
    // $('#queManualQueTable').slimScroll({
    // height: '400px'
    // });

    // $('#queManualFlowTable').slimScroll({
    // height: '400px'
    // });

    // 显示分类树
    $('#queSel').on('click', function () {
        showMenu();
    })

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

    //智能推荐问题模态框显示
    function showQueModal() {
        $('#queManualModal').modal('show');
    }

    $('#queManualModal').on('show.bs.modal', function () {
        $.fn.zTree.init($("#treeHide"), hidesetting, []);
        hideMenu();
    });
 
    //智能推荐问题模态窗列表
    function sQue(pageNo) {
        if (!pageNo) pageNo = 1;
        $.ajax({
            type: 'post',
            datatype: 'json',
            cache: false, //不从缓存中去数据
            url: encodeURI('../../question/getQueListByMode?pageSize=8&pageNo=' + pageNo + '&solutionType=1'),
            data: $("#search_Que").serialize(),
            success: function (data) {
                if (data.status === 0) {
                    if (data.questionList.length > 0) {
                        var html = "";
                        var existIds = [];
                        $('#queManual').find('input[name=postQueInput]').each(function () {
                            existIds.push($(this).attr('rel') * 1);
                        });
                        existIds.push(parseInt(window.location.href.match(/\?id=(\d+)/)[1]));
                        for (var i = 0; i < data.questionList.length; i++) {
                            //禁止列表中已经存在的问题被选择
                            if ($.inArray(data.questionList[i].Id, existIds) >= 0) {
                                html += "<tr id=\"list-tr-" + data.questionList[i].Id + "\" hits='" + dataFilter(data.questionList[i].Hits)+ "'>";
                                html += "<td><input disabled='' type=\"radio\" name=\"row_sel1\" value=\"" + data.questionList[i].Id + "\" solutionId=\"" + data.questionList[i].SolutionId + "\"></td>";
                                if (data.questionList[i].AnswerStatus == -4) {
                                    html += "<td class=\"dueTd\">" + data.questionList[i].Question + "<a class=\"btn btn-xs btn-danger m-l-5\">已过期</a></td>";
                                } else {
                                    html += "<td style='word-break: break-all;'>" + data.questionList[i].Question + "</td>";
                                }
                                html += "</tr>";
                            } else {
                                html += "<tr id=\"list-tr-" + data.questionList[i].Id + "\" hits='" + dataFilter(data.questionList[i].Hits)+ "'>";
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
                        icheckInit();
                        $('#ansList td').click(function () {
                            $(this).parent().find('input[name=row_sel1]:enabled').iCheck('check');
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
        $.ajax({
            type: 'post',
            datatype: 'json',
            cache: false, //不从缓存中去数据
            url: encodeURI('../../question/getQueListByMode?pageSize=8&pageNo=' + pageNo + '&solutionType=2'),
            data: $("#search_Que").serialize(),
            success: function (data) {
                if (data.status === 0) {
                    if (data.questionList.length > 0) {
                        var html = "";
                        var existIds = [];
                        $('#queManual').find('input[name=postQueInput]').each(function () {
                            existIds.push($(this).attr('rel') * 1);
                        });
                        for (var i = 0; i < data.questionList.length; i++) {
                            //禁止列表中已经存在的问题
                            if ($.inArray(data.questionList[i].Id, existIds) >= 0) {
                                html += "<tr id=\"list-tr-" + data.questionList[i].Id + "\" hits='" + dataFilter(data.questionList[i].Hits) + "'>";
                                html += "<td><input disabled='' type=\"radio\" name=\"row_sel2\" value=\"" + data.questionList[i].Id + "\" solutionId=\"" + data.questionList[i].SolutionId + "\"></td>";
                                if (data.questionList[i].AnswerStatus == -4) {
                                    html += "<td class=\"dueTd\">" + data.questionList[i].Question + "<a class=\"btn btn-xs btn-danger b-l-5\">已过期</a></td>";
                                } else {
                                    html += "<td style='word-break: break-all;'>" + data.questionList[i].Question + "</td>";
                                }
                                html += "</tr>";
                            } else {
                                html += "<tr id=\"list-tr-" + data.questionList[i].Id + "\" hits='" + dataFilter(data.questionList[i].Hits)+ "'>";
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
                        icheckInit();
                        $('#flowList td').click(function () {
                            $(this).parent().find('input[name=row_sel2]:enabled').iCheck('check');
                        });

                        // $('#flowList td').click(function () {
                        //     $(this).parent().find('input[name=row_sel2]').iCheck('check');
                        // });
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
                        } else {
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

    // 点击td自动选中input
    $('body').on('click', '.cosInput', function () {
        $(this).parents('tr').find('input').iCheck('check');
    })


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

        $.post("../../question/editQueLabel", {
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
        $.post("../../label/findAllLabels", {}, function (data) {
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


    //选择问题分类模态窗
    $('.treeDivModal').slimScroll({
        height: '400px'
    });
    $('#modal-intelTerm').on('show.bs.modal', function () {
        $.fn.zTree.init($("#treeTermClass"), termsetting, []);
        /*$('#affix1inner').slimScroll({
         height: $(window).height()-300+ 'px',
         allowPageScroll: false
         });*/
        $('#modal-intelTerm input[name=treeId]').val(0);
        termList(1);
    });
    $('#QuestionClassModel').on('show.bs.modal', function () {
        $.fn.zTree.init($("#treeQueClass"), classsetting, []);
    });
    $('#QuestionClassModel').on('hide.bs.modal', function () {
        $('#QuestionClassModel [name=treeName]').val('');
        $('#QuestionClassModel [name=treeId]').val('');
    });

    var solutionId2 = 0,
        questionId2 = 0;

    $('body').on('click', '.editClass', function () {
        $('#QuestionClassModel').modal('show');

        var $tr = $(this).parents('tr');
        solutionId2 = $tr.attr('solutionId');
        questionId2 = $tr.attr('id');
    });

    $('#selClassBtn').on('click', function () {
        var $tr = $(this).parents('tr'),
            queClass = $('#QuestionClassModel [name=treeName]').val();

        if (queClass) {
            Base.request({
                url: 'question/editQuestion',
                params: {
                    solutionId: solutionId2,
                    questionId: questionId2,
                    groupId: $('#QuestionClassModel [name=treeId]').val(),
                    question: $('.queTitle').text(),
                },
                callback: function (data) {
                    if (data.status) {
                        Base.gritter(data.message, false);
                    } else {
                        Base.gritter(data.message, true);
                        $('.editClass em').text(queClass);
                        $('#QuestionClassModel').modal('hide');
                    }
                },
            });
        }
    });
});
