$(document).ready(function () {
    var tmpNum = parent.$('#tabHeader li[data-tab="' + location.href + '"]').attr('data-num')//获取当前url中的data-num
    $('.affixing').affix({
        offset: {
            top: 160
        }
    })
    $('#affix1inner').slimScroll({
        height: $(window).height() - 290 + 'px',
        allowPageScroll: false
    })
    /*====================判断农信配置是否开启==================*/
    if (sessionStorage.getItem('qAndACloseValue') == 1) {//开启
        $('.addQue').removeClass('btn-primary').addClass('btn-default addQGrey')
        $('.addQue').removeAttr('href data-num data-name')//添加问题
        $('.queClass').removeClass('btn-primary').addClass('btn-default queClassGrey')
        $('.queClass').removeAttr('href data-num data-name')//问题分类
        $('.importQue').removeClass('btn-primary').addClass('btn-default queImportGrey')
        $('.importQue').removeAttr('href data-num data-name')//批量导入
    } else {
        $('.addQue').removeClass('addQGrey btn-default').addClass('btn-primary')
        $('.addQue').attr({
            'href': '../../web/knowledge/addQuestion.html',
            'data-num': 0,
            'data-name': '添加问题'
        })
        $('.queClass').removeClass('queClassGrey btn-default').addClass('btn-primary')
        $('.queClass').attr({
            'href': '../../web/knowledge/classify.html',
            'data-num': 0,
            'data-name': '问题分类'
        })
        $('.importQue').removeClass('queImportGrey btn-default').addClass('btn-primary')
        $('.importQue').attr({
            'href': '../../web/knowledge/importQuestion.html',
            'data-num': 0,
            'data-name': '批量导入'
        })
    }

    $(window).scroll(function () {
        if ($(document).scrollTop() >= 156) {
            $('#affix1').css({
                'top': 0,
                'left': '30px',
                'position': 'fixed'
            })
            $('#affixM').css({
                'position': 'relative'
            })
            $('#affixM').addClass('col-md-offset-3').addClass('col-sm-offset-3')

            $('#affix2').css({
                'top': 0,
                'right': '40px',
                'position': 'fixed',
                'width': $('#affixM').width()
            })

        } else {
            $('#affix1,#affix2,#affixM').css({
                'position': 'static'
            })
            $('#affixM').removeClass('col-md-offset-3').removeClass('col-sm-offset-3')
        }
    })

    $(window).resize(function () {
        $('#affix2').css({
            'width': $('#affixM').width()
        })
    })

    iframeTab.init({
        iframeBox: ''
    })

    //生成移动分类树
    var settingEdit = {
        data: {
            simpleData: {
                enable: true
            }
        },
        view: {
            selectedMulti: false,
            showIcon: false
        },
        callback: {
            onClick: function (event, treeId, treeNode, clickFlag) {
                if (treeNode) {
                    $('#YDGroupId').val(treeNode.id)
                }
            },
            beforeClick: function (treeId, treeNode, clickFlag) {
                console.log(treeNode.id)
                if (treeNode.isParent == true) {
                    Base.gritter('问题不能移动到父分类下', false)
                    return false
                }
            },
            onDblClick: function (event, treeId, treeNode) {
                $('#YDYes').trigger('click')
            }
        }
    }
    var This = this,
        pageNo = 1, //当前页
        pageSize = 10, //每页数量
        orderType = 0,
        isLeaf = 0,
        groupA = 0,
        groupId = 0,
        solutionType = null,
        isJpage = 0, //是否已实例化jpage
        answerStatus = '',
        status = '',
        queryType = '',
        searchStr = 'question=',
        queStr = '',
        timer = null,
        sourceType = -1

    if (sessionStorage) {
        pageNo = getSessionStorage('qv_pageNo')
        orderType = getSessionStorage('qv_orderType')
        groupId = getSessionStorage('qv_groupId')//分类树，各个子分类的id值
        answerStatus = getSessionStorage('qv_answerStatus')
        status = getSessionStorage('qv_status')
        queryType = getSessionStorage('qv_queryType')
        solutionType = getSessionStorage('qv_solutionType')
        searchStr = getSessionStorage('qv_searchStr') || 'question=';
        queStr = getSessionStorage('qv_queStr') || "";
        $('.searchBy').val(queStr)
        if (getSessionStorage('qv_sortWord2')) {
            $('.sortWord2').html(getSessionStorage('qv_sortWord2'))
        }
        if (getSessionStorage('qv_sortWord')) {
            $('.sortWord').html(getSessionStorage('qv_sortWord'))
        }
        if (getSessionStorage('qv_solutionTypeWord')) {
            $('.solutionType').html(getSessionStorage('qv_solutionTypeWord'))
        }
    }

    var setting1 = {
        data: {
            simpleData: {
                enable: true,
            }
        },
        view: { //不显示图标
            showIcon: false
        },
        callback: {
            onClick: function (event, treeId, treeNode) {
                //存选中的节点id，以便刷新后重新check
                if (sessionStorage) {
                    sessionStorage.setItem('pp_selectedNodeId', treeNode.id)
                }
                treeObj = $.fn.zTree.getZTreeObj(treeId)
                var array = treeObj.getNodesByFilter(filterP, false, treeNode)
                if (array.length > 0) {
                    groupId = ''
                    for (var i in array) {
                        groupId += (array[i].id - 1) + ','//获得子节点的id值-1后，拼接
                    }
                } else {
                    groupId = treeNode.id - 1
                }

                isJpage = 0
                pageNo = 1
                queStr = $('.searchBy').val();

                initSrc()
            },
        }
    }

    function filterP (node) {
        return (node.isParent == false)
    }


    var isAll = false;
    if (!window.classes) {
        //获取问题分类
        Base.request({
            url: 'classes/listClasses',
            params: {
                m: 0,
            },
            callback: function (data) {
                if (data.status) {
                    Base.gritter(data.message, false)
                } else {
                    window.classes = true
                    var html = ''
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
                        formatData[len]['name'] = '全部分类'
                        formatData[len]['pId'] = 0
                        formatData[len]['id'] = 1
                        formatData[len]['open'] = true

                        $.fn.zTree.init($('#ztree1'), setting1, formatData)
                        $.fn.zTree.init($('#treeeClasses'), settingEdit, formatData)
                        $('.simScrollTip').slimScroll({
                            height: $(window).height() - 290 + 'px',
                            allowPageScroll: false
                        })
                        //获得ztress1树对象
                        treeObj = $.fn.zTree.getZTreeObj('ztree1');
                        if (!groupId) { // 链接中有groupId
                            //根据自定义规则搜索节点数据 JSON 对象集合 或 单个节点数据
                            var array = treeObj.getNodesByFilter(filterP)//获得非父节点
                            if (array.length > 0) {
                                groupId = ''
                                for (var i in array) {
                                    groupId += (array[i].id - 1) + ','
                                }
                            } else {
                                groupId = treeNode.id - 1
                            }
                        }
                        //获得选择节点的id值
                        if (sessionStorage.getItem('pp_selectedNodeId')) {
                            var treeObj = $.fn.zTree.getZTreeObj('ztree1')
                            var node = treeObj.getNodeByParam('id', sessionStorage.getItem('pp_selectedNodeId'), null)
                            if (node) {
                                treeObj.selectNode(node)//选中指定节点
                            }
                        }
                        //点击全部分类时，groupId=0
                        $('#ztree1_1_span').on('click',function(){
                            isAll = true;
                        })
                        //加载相应资源
                        initSrc()
                    }
                }
            },
        })
    }
    var selectSourceFlag = true
    var initSrc = function () {
        $('.multCos').iCheck('uncheck')
        $('#tabd').tableAjaxLoader2(1)
        if(isAll){
            groupId = 0;
        }
        /*
        * taskId = 679 搜索问题中带有“+”和“&”报错
        * 原因：参数通过url传到后台会被解析
        * 修改：统一通过post方式，由data传入后台
        */
        var dataJson = {
            pageNo: pageNo,
            pageSize: pageSize,
            orderType: orderType,//排序类型
            isLeaf: isLeaf,
            solutionType: solutionType,
            groupId: groupId,
            answerStatus: answerStatus,
            status: status,
            queryType: queryType,
            source: sourceType
        }
        dataJson[searchStr.substr(0,searchStr.length-1)] = queStr;
        
        Base.request({
            //查询类型 查询关键字
            url: 'question/getQueList',
            params: dataJson,
            callback: function (data) {
                isAll = false;
                if (data.status) {
                    Base.gritter(data.message, false)
                } else {
                    //加载全部渠道列表  绑定事件：各个项目显示对应的内容
                    if (data.sourceList) {
                        if (data.sourceList[0]) {
                            //加载全部渠道列表
                            if (selectSourceFlag) {
                                var html = '<li><a class="sol" href="#" data-sol="-1">全部渠道</a></li>'
                                for (var m in data.sourceList) {
                                    html += '<li><a class="sol" href="javascript:;" data-sol="' + data.sourceList[m].DicCode + '">' + data.sourceList[m].DicDesc + '</a></li>'
                                }
                                $('#DataSourceUL').empty().append(html)
                                $('#DataSourceUL a').on('click', function () {
                                    pageNo = 1
                                    sourceType = $(this).attr('data-sol')
                                    //菜单栏 显示的类型
                                    if (sourceType == '-1') {
                                        $('.sourceType').html('全部渠道<span class="caret"></span>')
                                    } else {
                                        $('.sourceType').html(getSourceName(sourceType) + '<span class="caret"></span>')
                                    }
                                    //加载相关信息
                                    initSrc()
                                })
                                selectSourceFlag = false
                            }
                        }
                    }

                    var html = ''
                    //加载查询到的内容
                    if (data.questionList[0]) {
                        //查询的内容显示，拼接成字符串html（未添加至dom树）
                        for (var i = 0; i < data.questionList.length; i++) {
                            var ListAnswer = data.questionList[i].ListAnswer,
                                ansStr = '',
                                ansThisIndex = '',
                                allAns = '',
                                delStr = '';
                            /*
                            * taskId = 682 数据ListAnswer为空时，页面报错
                            * 修改：过滤空数据
                            */
                            if(ListAnswer.length > 0){
                                for (var j = 0; j < ListAnswer.length; j++) {
                                    var ansItem_focus = '',
                                        display = 'style="display: none;"'
                                    if (!j) { //第一个答案 显示
                                        ansItem_focus = 'ansItem_focus'
                                        display = ''
                                    }
                                    //该问题有多个答案 显示答案个数
                                    if (ListAnswer.length > 1) {
                                        ansThisIndex = j + 1
                                        allAns = '<a><span class="getAll timeTip glyphicon glyphicon-chevron-down" title="' + ListAnswer.length + '个答案"></span></a>'
                                        delStr = '<a><span class="oneDelAns timeTip glyphicon glyphicon-trash" title="删除答案"></span></a>'
                                    }
    
                                    var AnswerStatus = ''//答案状态显示
                                    switch (ListAnswer[j].AnswerStatus) {
                                        case 0:
                                            AnswerStatus = '已发布'
                                            break
                                        case -1:
                                            AnswerStatus = '暂存'
                                            break
                                        case -2:
                                            AnswerStatus = '等待审核'
                                            break
                                        case -3:
                                            AnswerStatus = '被退回'
                                            break
                                        case -4:
                                            AnswerStatus = '已过期'
                                            break
                                        case -5:
                                            AnswerStatus = '等待生效'
                                            break
                                    }
    
                                    //问题答案类型对应的小图标
                                    var imgMode = '', imgTitle = ''//图标类型  鼠标移入图标时的文本
                                    /**taskId=719 答案类型为视频时，显示视频名称 add by 赵宇星
                                     * 说明：判断答案类型，如果为视频；则创建一个元素填充视频名称，拼接在答案下面
                                    */
                                    var audioName='',audioNameEle='';
                                    switch (data.questionList[i].ListAnswer[j].Mode) {
                                        case 0:
                                            imgMode = 'text.png'
                                            imgTitle = '文本'
                                            break
                                        case 1:
                                            imgMode = 'img-text.png'
                                            imgTitle = '图文'
                                            break
                                        case 2:
                                            imgMode = 'fwb.png'
                                            imgTitle = '富文本'
                                            break
                                        case 3:
                                            if (data.questionList[i].ListAnswer[j].Material) {
                                                switch (data.questionList[i].ListAnswer[j].Material.Type) {
                                                    case 1:
                                                        imgMode = 'img.png'
                                                        imgTitle = '图片'
                                                        break
                                                    case 2:
                                                        imgMode = 'video.png'
                                                        imgTitle = '语音'
                                                        break
                                                    case 3:
                                                        imgMode = 'audio.png';
                                                        imgTitle = '视频';
                                                        audioName=ListAnswer[j].Material.Name||'';
                                                        audioNameEle="<p class='video-name'>视频名称："+audioName+"</p>";
                                                        break
                                                }
                                            }
                                            break
                                        case 4:
                                            imgMode = 'dsf.png'
                                            imgTitle = '第三方'
                                            break
                                        case 6:
                                            imgMode = 'flow.png'
                                            imgTitle = '流程'
                                            break
                                        case 7:
                                            imgMode = 'form.png'
                                            imgTitle = '表单数据'
                                            break
                                        case 8:
                                            imgMode = 'monitor.png'
                                            imgTitle = '转人工'
                                            break
                                        case 10:
                                            imgMode = 'datasearch.png'
                                            imgTitle = '二维数据查询'
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
                                            imgMode = 'custom.png'
                                            imgTitle = '场景'
                                            break
                                    }
                                    //显示 对应 的图标
                                    var imgstr = ''
                                    if (imgMode == 'custom.png') {
                                        imgstr = 'style="background:url(images/' + imgMode + ') no-repeat; background-size: cover !important;"'
                                    } else {
                                        imgstr = 'style="background:url(images/' + imgMode + ') no-repeat"'
                                    }
                                    //新增答案链接  参数：问题的信息
                                    var editAnswer = '<a href="../../web/knowledge/editAnswer.html?solutionId=' + data.questionList[i].SolutionId + '&groupId=' + data.questionList[i].GroupId + '&question=' + encodeURIComponent(data.questionList[i].Question) + '&tmpNum=' + tmpNum + '" data-num="0" data-name="新增答案"><span class="timeTip glyphicon glyphicon-plus" title="新增答案"></span></a>',
                                        //问题详细  链接
                                        link = '../../web/knowledge/queDetail.html?id=' + data.questionList[i].Id + '',
                                        //编辑答案 参数：答案信息
                                        link2 = '../../web/knowledge/editAnswer.html?solutionId=' + ListAnswer[j].SolutionId + '&groupId=' + ListAnswer[j].GroupId + '&answerId=' + ListAnswer[j].Id + '&question=' + encodeURIComponent(data.questionList[i].Question) + '&tmpNum=' + tmpNum,
                                        queType = ''
                                    //问题类型为流程
                                    if (data.questionList[i].SolutionType == 2) {
                                        //新增流程链接  参数：问题
                                        editAnswer = '<a href="../../web/knowledge/editAnswer.html?solutionId=' + data.questionList[i].SolutionId + '&groupId=' + data.questionList[i].GroupId + '&question=' + encodeURIComponent(data.questionList[i].Question) + '&tmpNum=' + tmpNum + '&isFlow=1" data-num="0" data-name="新增流程描述"><span class="timeTip glyphicon glyphicon-plus" title="新增流程描述"></span></a>'
                                        //跳转编辑流程
                                        link = '../../web/knowledge/editFlow.html?questionId=' + data.questionList[i].Id + '&groupId=' + data.questionList[i].GroupId + '&solutionId=' + data.questionList[i].SolutionId + '&tmpNum=' + tmpNum
                                        //新增流程链接  参数：答案
                                        link2 = '../../web/knowledge/editAnswer.html?solutionId=' + ListAnswer[j].SolutionId + '&groupId=' + ListAnswer[j].GroupId + '&questionId=' + data.questionList[i].Id + '&answerId=' + ListAnswer[j].Id + '&question=' + encodeURIComponent(data.questionList[i].Question) + '&tmpNum=' + tmpNum
                                        queType = '[流程]'
                                    }
                                    //加载显示  答案框
                                    //外框div
                                    ansStr += '<div class="ansItem ' + ansItem_focus + '" ' + display + ' Id="' + ListAnswer[j].Id + '" GroupId="' + ListAnswer[j].GroupId + '" SolutionId="' + ListAnswer[j].SolutionId + '" Webid="' + ListAnswer[j].Webid + '"subSolutionId="' + ListAnswer[j].SubSolutionId + '">'
    
                                    var answer = ListAnswer[j].Answer
                                    //嵌套 显示答案图标 内容
                                     /**taskId=719 答案类型为视频时，显示视频名称 add by 赵宇星
                                     * 说明：在ListAnswer[j].Answer 后拼接audioNameEle
                                    */
                                    ansStr += '<div class="ansItemCtn"><span class="timeTip ansItemImg" ' + imgstr + ' title="' + imgTitle + '"></span><span class="ansIndex">答案' + ansThisIndex + '</span><div class="listAnswer">' + (ListAnswer[j].Answer || '') + audioNameEle+'</div></div>'
                                    //嵌套  显示  来自——已发布
                                    /*
                                    * taskId = 480 自如知识库同步，问答总览增加区域维度展示
                                    * 根据ruleMode来判断，如果为0则展示生效角色，如果为1则展示区域维度
                                    * 通过type判断父级来对应展示   添加方法showQuYu
                                    * */
                                    ansStr += '<div class="ansItemFrom">' + showJueSe(ListAnswer[j], data.sourceList) + showQuYu(ListAnswer[j], data.sourceList) + '<span>来自:<em>' + ListAnswer[j].UserName + '</em></span>'
                                    ansStr += '<span class="dot">|</span>' + showQuDao(ListAnswer[j], data.sourceList) + '<span>浏览<em>' + (ListAnswer[j].Hits || 0) + '</em>次</span>'
                                    ansStr += '<span class="dot">|</span><span>' + AnswerStatus + '</span>'
                                    ansStr += '<span class="dot">|</span>'
    
                                    //如果用户已经评价  则跳转到满意度页面 否则只显示次数，不跳转
                                    if (ListAnswer[j].Usefull && ListAnswer[j].Usefull !== 0) {
                                        ansStr += '<a href="../../web/knowledge/satisfaction.html?solutionId=' + ListAnswer[j].SolutionId + '&useFullType=1&count=' + ListAnswer[j].Usefull + '" data-num="0" data-name="满意度评价详细">'
                                        ansStr += '<span><span class="glyphicon glyphicon-thumbs-up" title="赞"></span><em>' + ListAnswer[j].Usefull + '</em>次</span></a>'
                                    } else {
                                        ansStr += '<span><span class="glyphicon glyphicon-thumbs-up" title="赞"></span><em>0</em>次</span>'
                                    }
    
                                    if (ListAnswer[j].Useless && ListAnswer[j].Useless !== 0) {
                                        ansStr += '<span class="dot">|</span><a href="../../web/knowledge/satisfaction.html?solutionId=' + ListAnswer[j].SolutionId + '&useFullType=2&count=' + ListAnswer[j].Useless + '" data-num="0" data-name="满意度评价详细">'
                                        ansStr += '<span><span class="glyphicon glyphicon-thumbs-down" title="踩"></span><em>' + ListAnswer[j].Useless + '</em>次</span></a><span class="dot">|</span>'
                                    } else {
                                        ansStr += '<span class="dot">|</span>'
                                        ansStr += '<span><span class="glyphicon glyphicon-thumbs-down" title="踩"></span><em>0</em>次</span><span class="dot">|</span>'
                                    }
    
                                    //有生效时间等信息则显示
                                    var timeStr = '';
                                    if(ListAnswer[j].TimeLiness == 1){
                                        if (ListAnswer[j].StartTime && ListAnswer[j].EndTime) {
                                            timeStr = '<span>生效时间：' + ListAnswer[j].StartTime + '-' + ListAnswer[j].EndTime + '</span><span class="dot">|</span>'
                                        } else if (ListAnswer[j].StartTime) {
                                            timeStr = '<span>起始时间：' + ListAnswer[j].StartTime + '<span class="dot">|</span>'
                                        } else if (ListAnswer[j].EndTime) {
                                            timeStr = '<span>结束时间：' + ListAnswer[j].EndTime + '<span class="dot">|</span>'
                                        }
                                    }else{
                                        timeStr = "";
                                    }
                                    ansStr += timeStr;
    
                                    //编辑答案图标以及链接  delStr多个答案时显示,查看历史记录
                                    //Amend by zhaoyuxing At 20171213 需求：徐冠男
                                    //说明：将‘查看历史记录’文字改为图标
                                    ansStr += '<a class="lookBe timeTip" href="#modal-history" data-toggle="modal"><span class="timeTip glyphicon glyphicon-eye-open" title="历史版本"></span></a>'+'<a href="' + link2 + '" data-num="0" data-name="修改答案"><span class="timeTip glyphicon glyphicon-pencil" title="编辑答案"></span></a>' + delStr + '</div></div>'
                                }
                            
                                //答案（ansStr）div 显示结束

                                var Status = '',
                                    isOver = ''
                                switch (data.questionList[i].Status) {
                                    case 0:
                                        Status = '已发布'
                                        break
                                    case -1:
                                        Status = '暂存'
                                        break
                                    case -2:
                                        Status = '等待审核'
                                        break
                                    case -3:
                                        Status = '被退回'
                                        break
                                    case -4:
                                        Status = '已过期'
                                        isOver = '<div class="isOver"><img src="images/overdue.png"></div>'
                                        break
                                    case -5:
                                        Status = '等待生效'
                                        break
                                }
                                /*taskId=558 智能推荐优化 ：推荐问题的次数显示配置的推荐总数 amend by 赵宇星
                                *说明：获取 question/getQueList 字段SugQuestionNum
                                */
                                var  askMode = [];
                                if(data.questionList[i].SugQuestionNum){
                                    askMode[i] = '推荐问题(' + data.questionList[i].SugQuestionNum + ')';
                                }
                            
                                
                                //显示问题推荐
                                html += '<tr class="gg0"><td class="gg1"></td><td class="gg1"></td></tr>'
                                //显示问题行
                                html += '<tr Id="' + data.questionList[i].Id + '" GroupId="' + data.questionList[i].GroupId + '" SolutionId="' + data.questionList[i].SolutionId + '" SolutionType="' + data.questionList[i].SolutionType + '" SolutionType="' + data.questionList[i].SolutionType + '">'
                                //嵌套  第一列 复选框
                                html += '<td width="30"><input class="singleCos" type="checkbox"></td>'
                                //第二列 显示问题 根据 link的地址字符串内容判断data-name
                                html += '<td><div class="titleCtn"><a class="queDetailBtn" href=' + link + ' data-num="0" data-name="' + ((link.indexOf('editFlow') + 1) ? '流程详细' : '问题详细') + '">'
                                html += '<span class="queTitle">' + data.questionList[i].Question + queType + '</span></a>' +
                                    '<a><span class="editQue timeTip glyphicon glyphicon-edit" title="修改问题"></span></a>' +
                                    allAns + '<span style="float: right;">' + (data.questionList[i].UpdateTime || data.questionList[i].AddTime) + '</span></div>'
                                //显示 答案部分 显示问题信息行
                                html += '<div class="queCtn">' + isOver + ansStr + '</div>' +
                                    '<div class="queRight"><div>来自:<em>' + data.questionList[i].UserName + '</em></div><span class="dot">|</span>'
                                /*taskId=558 智能推荐优化 ：推荐问题的次数显示配置的推荐总数 amend by 赵宇星
                                *说明：获取 question/getQueList 字段SugQuestionNum 没有值时不显示问题推荐
                                */      
                                data.questionList[i].SugQuestionNum ? html += '<div><em>' + askMode[i] + '</em></div><span class="dot">|</span>' : ''
                                html += '<div>分类:<em>' + data.questionList[i].GroupName + '</em></div><span class="dot">|</span>' + (data.questionList[i].Keyword ? '<div>关键词:<em>' + data.questionList[i].Keyword + '</em></div><span class="dot">|</span>' : '') + (data.questionList[i].SgName ? '<div class="innerTim">智能句式:<em>' + data.questionList[i].SgName + '</em></div><span class="dot">|</span>' : '')

                                var labelName = data.questionList[i].LabelName

                                //所属标签没有值时不显示
                                labelName == null ? '' : html += '<div>所属标签:<em>' + labelName + '</em></div><span class="dot">|</span>'

                                html += '<div>浏览<em>' + (data.questionList[i].Hits || 0) + '次</em></div><span class="dot">|</span><div>' + Status + '</div>'
                                html += '<span class="dot">|</span><div>'
                                //满意度
                                if (data.questionList[i].Usefull && data.questionList[i].Usefull !== 0) {
                                    html += '<a href="../../web/knowledge/satisfaction.html?solutionId=' + ListAnswer[0].SolutionId + '&useFullType=1&count=' + data.questionList[i].Usefull + '" data-num="0" data-name="满意度评价详细">'
                                    html += '<span class="glyphicon glyphicon-thumbs-up" title="赞"></span><em>' + data.questionList[i].Usefull + '</em>次</a>'
                                } else {
                                    html += '<span class="glyphicon glyphicon-thumbs-up" title="赞"></span><em>0</em>次'
                                }
                                html += '<span class="dot">|</span>'
                                if (data.questionList[i].Useless && data.questionList[i].Useless !== 0) {
                                    html += '<a href="../../web/knowledge/satisfaction.html?solutionId=' + ListAnswer[0].SolutionId + '&useFullType=2&count=' + data.questionList[i].Useless + '" data-num="0" data-name="满意度评价详细">'
                                    html += '<span class="glyphicon glyphicon-thumbs-down" title="踩"></span><em>' + data.questionList[i].Useless + '</em>次</a>'
                                } else {
                                    html += '<span class="glyphicon glyphicon-thumbs-down" title="踩"></span><em>0</em>次'
                                }
                                html += '</div>'
                                //相似问法
                                html += '<span class="dot">|</span><a class="similar" href="#modal-dialog" data-toggle="modal"><span class="">' + data.questionList[i].SimilarCount + '个相似问法</span>'
                                html += '<a><span class="dot">|</span><div class="queEditor">' + editAnswer + '<span class="oneDelQue timeTip glyphicon glyphicon-trash" title="删除问题"></span></a></div></div></td></tr>'
                            }
                        }

                        //分页的设置
                        var options = {
                            data: [data, 'questionList', 'total'],
                            currentPage: data.currentPage,
                            totalPages: data.totlePages ? data.totlePages : 1,
                            alignment: 'right',//控件的对齐方式
                            onPageClicked: function (event, originalEvent, type, page) {
                                pageNo = page
                                initSrc()
                                var moveTo = new MoveTo()
                                var target = document.getElementById('moveTo')
                                moveTo.move(target)
                            }
                        }
                        //分页
                        $('#itemContainer').bootstrapPaginator(options)
                    } else {
                        //无查询的相关内容
                        html += '<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>'
                        $('#itemContainer').empty()
                    }

                    if (sessionStorage) {
                        sessionStorage.setItem('qv_pageNo', pageNo)//当前的页码
                        sessionStorage.setItem('qv_orderType', orderType)//排序类型
                        sessionStorage.setItem('qv_groupId', groupId)//所在的树id
                        sessionStorage.setItem('qv_answerStatus', answerStatus)//答案状态（是否发布）
                        sessionStorage.setItem('qv_status', status)//问题状态（是否发布）
                        sessionStorage.setItem('qv_queryType', queryType)//查询问题类型
                        sessionStorage.setItem('qv_solutionType', solutionType)//答案类型
                        sessionStorage.setItem('qv_searchStr', searchStr)//查询的类型（问题、答案、标签）
                        sessionStorage.setItem('qv_queStr', queStr)//查询字符串
                        sessionStorage.setItem('qv_sortWord2', $('.sortWord2').html())//搜索内容的类型（问题、答案、标签）
                        sessionStorage.setItem('qv_sortWord', $('.sortWord').html())//排序
                        sessionStorage.setItem('qv_solutionTypeWord', $('.solutionType').html())//问题、流程
                    }
                    //在表格中加入查询到的内容
                    $('.tbody1').empty().append(html)
                    //智能句式
                    if (sessionStorage.getItem('sentenceValue') == 1) {
                        $('.innerTim').css('display', 'inline-block')
                        $('.innerTim').next().css('display', 'inline-block')
                    } else {
                        $('.innerTim').css('display', 'none')
                        $('.innerTim').next().css('display', 'none')
                    }
                    /*=============判断农信配置是否开启================*/
                    for (var i = 0; i < $('.queDetailBtn').length; i++) {
                        if ($('.queDetailBtn').eq(i).attr('data-name') == '问题详细') {
                            if (sessionStorage.getItem('qAndACloseValue') == 1) {
                                $('.titleCtn .glyphicon-edit').eq(i).removeClass('editQue timeTip').addClass('editQueGrey').removeAttr('title')
                                $('.queEditor .glyphicon-trash').eq(i).removeClass('oneDelQue timeTip').addClass('oneDelQueGrey').removeAttr('title')
                            } else {
                                $('.titleCtn .glyphicon-edit').eq(i).addClass('editQue timeTip').removeClass('editQueGrey').attr('title', '修改问题')
                                $('.queEditor .glyphicon-trash').eq(i).addClass('oneDelQue timeTip').removeClass('oneDelQueGrey').attr('title', '删除问题')
                            }
                        }
                    }

                    $('.timeTip').tooltip()
                    icheckInit()
                    $('.ansItemCtn .listAnswer').each(function () {
                        if ($(this).height() == 400) {
                            $(this).slimScroll({
                                allowPageScroll: false,
                                height: '100%',
                            }).trigger('mouseout')
                        }
                    })
                    //答案为图片，将图片改为链接显示
                    $('.ansItemCtn').find('img').each(function () {
                        if ($(this).attr('style') == undefined) {
                            var container = $('<a data-lightbox="roadtrip">' + $(this).prop('outerHTML') + '</a>')
                            container.attr('href', $(this).attr('src'))
                            $(this).after(container)
                            $(this).remove()
                        }
                    })

                    //如果问题类型为流程，则不显示查看历史
                    $("[solutiontype=2]").find('.lookBe').hide();



                }
            },
        })
    }
    window.initSrc = initSrc

    allQueView()

    //问题总览
    function allQueView () {
        Base.request({
            url: 'learnQue/getParamsValue',
            params: {},
            callback: function (data) {
                if (data.status) {} else {
                    //显示标准问
                    data.solutionTotalCount?$('[data-name=standardQue]>span').html(data.solutionTotalCount):$('[data-name=standardQue]').hide();
                    //显示相似问法
                    data.simiQueCount?$('[ data-name=simiQueCount]>span').html(data.simiQueCount):$('[ data-name=simiQueCount]').hide();
                    //显示未知问题
                    data.UnQues ? $('.beHandle').text(data.UnQues) : $('.beHandle').parent().parent().hide()
                    //智能学习待处理
                    data.learnQueCount?$('#intelLearnList>span').html(data.learnQueCount):$('#intelLearnList').parent().hide();
                    //被退回问题
                    data.returnEditCount ? $('.beTurnback').text(data.returnEditCount) : $('.beTurnback').parent().hide();

                    //需要处理问题
                    data.needCheck ? $('.beReview').text(data.needCheck) : $('.beReview').parent().hide()

                    if (data.needCheck == 0) {
                        $('.beReview').css('cursor', 'default')
                    }
                    if (data.returnEditCount == 0) {
                        $('.beTurnback').css('cursor', 'default')
                    }
                }
            },
        })
    }

    //点击待审核问题，直接执行审核状态所绑定的事件
    $('.beReview').on('click', function () {
        if ($(this).html() != '0') {
            $('.sort6').trigger('click')
        }
    })
    //被退回问题
    $('.beTurnback').on('click', function () {
        if ($(this).html() != '0') {
            $('.sort9').trigger('click')
        }
    })

    //ENTER
    $(document).on('keyup', function (e) {
        var $activeEl = $(document.activeElement)
        //输入相似问法
        if ($activeEl.is('.inputSim') && (e.keyCode == 13 || e.keyCode == 108)) {
            $('.addSim').trigger('click')
        }
    })

    //展开全部答案
    $('body').on('click', '.getAll', function () {
        var $td = $(this).parents('td')

        if ($(this).is('.glyphicon-chevron-down')) {
            $td.find('.ansItem:not(:first)').stop().slideDown()
            $(this).addClass('glyphicon-chevron-up').removeClass('glyphicon-chevron-down')
        } else {
            $td.find('.ansItem:not(:first)').stop().slideUp()
            $(this).addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up')
        }
    })

    //修改问题
    $('body').on('click', '.editQue', function () {
        var $titleCtn = $(this).parents('.titleCtn'),
            $editTitleCtn = $('<div><input type="text" class="form-control" placeholder="输入修改后的问题" style="max-width: 60%; display: inline-block; margin: 5px 10px 5px 0;"></td><td></td><td><a class="ensureQue"><span class="timeTip glyphicon glyphicon-ok" title="确定" style="margin-right: 5px;"></span></a><a class="cannelQue"><span class="timeTip glyphicon glyphicon-remove" title="取消"></span></a></div>')
        //如果处于非编辑模式
        if (!$titleCtn.next().find('.ensureQue')[0]) {
            $titleCtn.after($editTitleCtn)
            $editTitleCtn.hide().fadeIn()
            $('.timeTip').tooltip()

            $editTitleCtn.find('input').val($titleCtn.find('.queTitle').text().replace(/\[流程\]$/, '')).focus()
        }
    })

    //确认修改问题
    $('body').on('click', '.ensureQue', function () {
        var $tr = $(this).parents('tr'),
            $input = $(this).prev('input'),
            question = $input.val()

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
                    Base.gritter(data.message, false)
                } else {
                    Base.gritter(data.message, true)
                    var text = $tr.find('.queTitle').text()
                    $tr.find('.queTitle').text((text.indexOf('[流程]') + 1) ? question + '[流程]' : question)
                    //修改框消失
                    $input.parent().fadeOut(function () {
                        $(this).remove()
                    })
                    initSrc()
                }
            },
        })
    })

    //ENTER
    $(document).on('keyup', function (e) {
        var $activeEl = $(document.activeElement)

        if ($activeEl.is('[placeholder=输入修改后的问题]') && (e.keyCode == 13 || e.keyCode == 108)) {
            $('.ensureQue').trigger('click')
        }
    })

    //取消修改问题
    $('body').on('click', '.cannelQue', function () {
        var $div = $(this).parent('div')

        $div.fadeOut(function () {
            $(this).remove()
        })
    })

    //导出问题
    $('.sort2_2').on('click', function () {
        This.location.href = '../../question/getQueList?pageNo=' + pageNo + '&pageSize=10&orderType=' + orderType + '&groupId=' + groupId + '&answerStatus=' + answerStatus + '&status=' + status + '&queryType=' + queryType + '&excelFlag=1&' + searchStr + queStr
    })

    var $ansItem = null,
        $tr = null
    //删除答案或问题
    $('#delYes').on('click', function () {
        var title = $('#tipTitle').text()

        if (title == '删除答案') {
            Base.request({
                url: 'answer/deleteAnswer',
                params: {
                    solutionId: $ansItem.attr('solutionId'),
                    groupId: $ansItem.attr('groupid'),
                    id: $ansItem.attr('id'),
                },
                callback: function (data) {
                    $('#delAnsConfirm').modal('hide')
                    if (data.status) {
                        Base.gritter(data.message, false)
                    } else {
                        Base.gritter(data.message, true)
                        isJpage = 0
                        initSrc()
                    }
                },
            })
        }
        if (title == '删除问题') {
            queDetele('#delAnsConfirm');
        }
        if (title == '删除流程') {//没有关联关系  确定删除流程
            queDetele('#delAnsConfirm');
        }
        if (title == '批量删除问题') {
            var ids = []//存储对应问题的id值

            $('.singleCos').each(function () {
                var $tr = $(this).parents('tr'),
                    id = $tr.attr('Id')

                if ($(this).is(':checked')) {
                    ids.push(id)
                }
            })

            if (ids.toString()) {
                Base.request({
                    url: 'question/delOptQuestionByIds',
                    params: {
                        ids: ids.toString(),
                    },
                    callback: function (data) {
                        $('#delAnsConfirm').modal('hide')
                        if (data.status) {
                            Base.gritter(data.message, false)
                        } else {
                            Base.gritter(data.message, true)
                            //全选删除，切换为前一页
                            if ($('.oneDelQue').length == ids.length) {
                                if (pageNo >= 2) {
                                    pageNo -= 1
                                }
                            }
                            initSrc()
                        }
                    },
                })
            } else {
                $('#delAnsConfirm').modal('hide')
                Base.gritter('勾选您要删除的问题', false)
            }
        }
    })

    //确认删除答案或问题
    $('body').on('click', '.oneDelAns, .multDelAns, .oneDelQue', function (e) {
        $ansItem = $(this).parents('.ansItem')//答案
        $tr = $(this).parents('tr')//问题

        var ansItemLen = $tr.find('.ansItem').length

        if ($(e.target).is('.oneDelAns')) { //单个删除答案
            if (ansItemLen == 1) {
                var tmpOBj = {
                    'message': '问题至少要有一个答案',
                    'status': 1
                }
                yunNoty(tmpOBj)//提示框
            } else {
                $('#delAnsConfirm').modal('show')
                $('#tipTitle').text('删除答案')
                $('#tipWord').text('确认删除该答案？')
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
            var isQue = $(e.target).parents('tr').find('.queDetailBtn').attr('data-name');//判断点击的是流程还是问题
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
                                if(isQue == '问题详细'){
                                    $('#queDelModel .modal-title').text('删除问题');
                                    $('#queDelModel .delQueAnsTitle').html('&nbsp;&nbsp;删除该问题将会一并删除与之相关的答案、相似问法，确认删除该问题？（删除的问题可在知识库回收站中找回）');
                                    $('#queDelModel .delAllTitle').html('&nbsp;&nbsp;该问题与其他流程存在被引用关系，删除将导致引用流程无法正常使用，您可以解除引用关系后再进行删除，');
                                }else{
                                    $('#queDelModel .modal-title').text('删除流程');
                                    $('#queDelModel .delQueAnsTitle').html('&nbsp;&nbsp;删除该流程将会一并删除与之相关的答案、相似问法，确认删除该流程？（删除的流程可在知识库回收站中找回）');
                                    $('#queDelModel .delAllTitle').html('&nbsp;&nbsp;该流程与其他流程存在被引用关系，删除将导致引用流程无法正常使用，您可以解除引用关系后再进行删除，');
                                }
                            }else{
                                //不是进入回收站
                                for(var j = 0;j < data.canNotRenewSolutionList.length;j++){
                                    corSetId += data.canNotRenewSolutionList[j].Id+',';
                                }
                                relationMine = 0;
                                if(isQue == '问题详细'){
                                    $('#queDelModel .modal-title').text('删除问题');
                                    $('#queDelModel .delQueAnsTitle').html('&nbsp;&nbsp;删除该问题将会一并删除与之相关的答案、相似问法，确认删除该问题？（引用了其他问题或流程，删除后不可恢复！）');
                                    $('#queDelModel .delAllTitle').html('&nbsp;&nbsp;该问题与其他流程存在被引用关系，删除将导致引用流程无法正常使用，您可以解除引用关系后再进行删除，');
                                }else{
                                    $('#queDelModel .modal-title').text('删除流程');
                                    $('#queDelModel .delQueAnsTitle').html('&nbsp;&nbsp;删除该流程将会一并删除与之相关的答案、相似问法，确认删除该流程？（引用了其他问题或流程，删除后不可恢复！）');
                                    $('#queDelModel .delAllTitle').html('&nbsp;&nbsp;该流程与其他流程存在被引用关系，删除将导致引用流程无法正常使用，您可以解除引用关系后再进行删除，');
                                }
                            }
                            /*引用的标问的id*/
                            for(var i = 0;i < data.resultIds.length;i++){
                                flowId += data.resultIds[i]+',';
                            }
                            /*关联的标问的id*/
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
                                if(isQue == '问题详细'){
                                    $('#tipTitle').text('删除问题')
                                    $('#tipWord').text('删除该问题将会一并删除与之相关的答案、相似问法，确认删除该问题？（删除的问题可在知识库回收站中找回）')
                                }else{
                                    $('#tipTitle').text('删除流程')
                                    $('#tipWord').text('删除该流程将会一并删除与之相关的答案、相似问法，确认删除该流程？（删除的流程可在知识库回收站中找回）')
                                }
                            }else{
                                relationMine = 0;
                                if(isQue == '问题详细'){
                                    $('#tipTitle').text('删除问题')
                                    $('#tipWord').text('删除该问题将会一并删除与之相关的答案、相似问法，确认删除该问题？（引用了其他问题或流程，删除后不可恢复！）')
                                }else{
                                    $('#tipTitle').text('删除流程')
                                    $('#tipWord').text('删除该流程将会一并删除与之相关的答案、相似问法，确认删除该流程？（引用了其他问题或流程，删除后不可恢复！）')
                                }
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
    })
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
                        Base.gritter(data.message, true)
                        //全选删除，切换为前一页
                        if ($('.oneDelQue').length == ids.length) {
                            if (pageNo >= 2) {
                                pageNo -= 1
                            }
                        }
                        initSrc()
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
                            },
                        })
                        Base.gritter(data.message, true)
                        //全选删除，切换为前一页
                        if ($('.oneDelQue').length == ids.length) {
                            if (pageNo >= 2) {
                                pageNo -= 1
                            }
                        }
                        initSrc()
                    }

                },
            })
        }
    }
    //异步处理
    setInterval(function () {
        var ids = []
        //获得选中行的id放入ids[]中
        $('.singleCos').each(function () {
            var $tr = $(this).parents('tr'),
                id = $tr.attr('Id')

            if ($(this).is(':checked')) {
                ids.push(id)
            }
        })
        //无多选时，禁止使用修改问题分类、批量删除，移除对应事件
        if(sessionStorage.getItem('qAndACloseValue') == 1){
            $('.multDelQue').css('cursor', 'not-allowed').css('color', '#aaa');
            $('.multDelQue').off('click', findCorrelation);
            if (!ids.toString()) {
                $('.multYDQue').css('cursor', 'not-allowed').css('color', '#aaa');
                $('.multYDQue').off('click', yyidongfenlei);
            } else {
                $('.multYDQue').css('cursor', 'pointer').css('color', '#666');
                $('.multYDQue').off('click', yyidongfenlei).on('click', yyidongfenlei);
            }
        }else{
            if (!ids.toString()) {
                $('.multYDQue').css('cursor', 'not-allowed').css('color', '#aaa');
                $('.multYDQue').off('click', yyidongfenlei);
                $('.multDelQue').css('cursor', 'not-allowed').css('color', '#aaa');
                $('.multDelQue').off('click', findCorrelation);
            } else {
                $('.multYDQue').css('cursor', 'pointer').css('color', '#666');
                $('.multYDQue').off('click', yyidongfenlei).on('click', yyidongfenlei);
                $('.multDelQue').css('cursor', 'pointer').css('color', '#666');
                $('.multDelQue').off('click', findCorrelation).on('click', findCorrelation);
            }
        }

    }, 500)
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
     * @param nowId 页面选中的id
     *@param  flowId:该问题或流程的关联关系id
     */
    //批量删除问题或流程判断是否存在关联关系
    function findCorrelation(){
        var ids = [];
        var isQue = [];//判断是流程还是问题
        var isHasQue = false;
        var html = '';
        var corSetId = '';
        var flowId = '';
        var nowId = '';
        $('.singleCos').each(function () {
            var $tr = $(this).parents('tr'),
                id = $tr.attr('Id')
            if ($(this).is(':checked')) {
                isQue.push($(this).parents('tr').find('.queDetailBtn').attr('data-name'))//判断是流程还是问题
                ids.push(id)
            }
        })
        for(var i = 0;i < isQue.length;i++){
            if(isQue[i] == '问题详细'){
                isHasQue = true;
            }
        }
        Base.request({
            url: 'question/findSolutionCor',
            params: {
                ids: ids.toString()
            },
            callback: function (data) {
                if(data.status == 0){
                    if(data.ref && data.ref == 1){
                        $('#queDelModel').modal('show');
                        $('#queDelModel .modal-title').html('批量删除问题');
                        $('#queDelModel .delAllTitle').html('&nbsp;&nbsp;这些问题与其他流程存在被引用关系，删除将导致引用流程无法正常使用，您可以解除引用关系后再进行删除，');
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
                            $('#queDelModel .delQueAnsTitle').html('&nbsp;&nbsp;删除这些问题将会一并删除与之相关的答案、相似问法，确认批量删除问题？（删除这些问题可在知识库回收站中找回）');
                        }else{
                            //不是进入回收站
                            for(var j = 0;j < data.canNotRenewSolutionList.length;j++){
                                corSetId += data.canNotRenewSolutionList[j].Id+',';
                            }
                            relationMine = 0;
                            $('#queDelModel .delQueAnsTitle').html('&nbsp;&nbsp;删除这些问题将会一并删除与之相关的答案、相似问法，确认批量删除问题？（引用了其他问题或流程，删除后不可恢复！）');
                        }
                        /*引用的标问的id*/
                        for(var i = 0;i < data.resultIds.length;i++){
                            flowId += data.resultIds[i]+',';
                        }
                        /*页面选中的id*/
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
                            $('#tipWord').html('删除这些问题将会一并删除与之相关的答案、相似问法，确认批量删除问题？（删除的问题可在知识库回收站中找回）')
                        }else{
                            relationMine = 0;
                            $('#tipWord').html('删除这些问题将会一并删除与之相关的答案、相似问法，确认批量删除问题？（引用了其他问题或流程，删除后不可恢复！）')
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
                        $('#tipTitle').html('批量删除问题')
                        $('#delAnsConfirm .nowId').val(nowId.substring(0,nowId.length-1));
                        $('#delAnsConfirm .corSetId').val(corSetId.substring(0,corSetId.length-1));
                        $('#delAnsConfirm .flowId').val(flowId.substring(0,flowId.length-1));
                        $('#delAnsConfirm .delAnsFlowId').val(ids.toString());
                    }
                }else{
                    Base.gritter(data.message, false)
                }
            },
        })
    }

    //移动分类确认
    function yyidongfenlei () {
        var ids = []

        $('.singleCos').each(function () {
            var $tr = $(this).parents('tr'),
                id = $tr.attr('Id')

            if ($(this).is(':checked')) {
                ids.push(id)
            }
        })

        if (!ids.toString()) {
            Base.gritter('您未选择需要移动的问题', false)
            return false
        }
        $('#YDConfirm').modal('show')
    }

    //移动分类执行
    $('#YDYes').on('click', function () {
        var ids = []

        $('.singleCos').each(function () {
            var $tr = $(this).parents('tr'),
                id = $tr.attr('Id')

            if ($(this).is(':checked')) {
                ids.push(id)
            }
        })

        if (ids.toString()) {
            Base.request({
                url: 'question/moveQuestionClassify',
                params: {
                    ids: ids.toString(),
                    groupId: $('#YDGroupId').val() - 1
                },
                callback: function (data) {
                    $('#YDConfirm').modal('hide')
                    if (data.status) {
                        Base.gritter(data.message, false)
                    } else {
                        Base.gritter(data.message, true)
                        isJpage = 0
                        initSrc()
                    }
                },
            })
        } else {
            Base.gritter('您未选择需要移动的问题', false)
        }
    })

    var pageNo2 = 1, //当前页
        pageSize2 = 10, //每页数量
        isJpage2 = 0, //是否已实例化jpage
        delPage2 = 0, //是否删除jpage
        solutionId2 = 0,
        groupId2 = 0

    //用于查找相似问法
    function initSrc2 () {
        $('#tb02').tableAjaxLoader2(1)
        Base.request({
            url: 'question/findSimilarQuestion',
            params: {
                pageSize: pageSize2,
                pageNo: pageNo2,
                solutionId: solutionId2,
                groupId: groupId2,
            },
            callback: function (data) {
                if (data.status) {
                    yunNoty(data)
                } else {
                    var html = ''
                    //拼接相似问法表格
                    /*taskId:328 查看历史记录
                     *说明：增加修改人以及修改时间字段的显示
                     * 修改：增加data.listSimilar[i].UserName  ，data.listSimilar[i].UpdateTime字段的显示
                     * */
                    if (data.listSimilar[0]) {
                        for (var i = 0; i < data.listSimilar.length; i++) {
                            html += '<tr Id="' + data.listSimilar[i].Id + '" SolutionId="' + data.listSimilar[i].SolutionId + '" totalList="' + data.total + '">'
                            html += '<td><span class="simQue">' + data.listSimilar[i].Question + '</span><span class="viewTimes"> [ 浏览' + (data.listSimilar[i].Hits || 0) + '次 ]</span></td>'
                            html+= '<td style="white-space: nowrap;"><span>' + (data.listSimilar[i].UserName||'未知')+ '</span></td>'
                            html+= '<td style="white-space: nowrap;"><span>' + (data.listSimilar[i].UpdateTime||'未知') + '</span></td>'
                            html += '<td style="white-space: nowrap;"><a class=""><span class="editSim timeTip glyphicon glyphicon-pencil" title="修改"></span></a>'
                            html += '<a class="delSimilar"><span class="timeTip glyphicon glyphicon-trash" title="删除"></span></a></td></tr>'
                        }

                        var options = {
                            data: [data, 'listSimilar', 'total'],
                            currentPage: data.currentPage,
                            totalPages: data.totlePages ? data.totlePages : 1,
                            alignment: 'right',
                            onPageClicked: function (event, originalEvent, type, page) {
                                pageNo2 = page
                                initSrc2()
                            }
                        }
                        $('#itemContainer2').bootstrapPaginator(options)
                    } else {
                        html += '<tr class="emptyTip"><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>'
                        $('#itemContainer2').empty()
                    }
                    //加载相似问法Dom
                    $('.tbody2').empty().append(html)
                    $('.timeTip').tooltip()
                }
            },
        })
    }

    var $similar = null
    //绑定相似问法事件，并显示
    $('body').on('click', '.similar', function () {
        $('.inputSim').val('')//模态框中的输入框
        var $tr = $(this).parents('tr')
        $similar = $(this).find('span')
        solutionId2 = $tr.attr('solutionId')
        groupId2 = $tr.attr('groupId')
        pageNo2 = 1
        initSrc2()//加载相似问法

        $('.queShow').text('标准问题：' + $('.queTitle', $tr).text() || '')
        //获得当前问题的id
        $('.tbody2').attr({
            'solutionid': solutionId2
        })
    })

    //添加相似问法
    $('body').on('click', '.addSim', function () {
        var question = $('.inputSim').val()
        //如果问题为空，提示用户输入问题，return
        if (!question) {
            yunNotyError('请输入问题')
            return
        }
        var curSolutionId = $('.tbody2').attr('solutionid')

        Base.request({
            url: 'question/addSimilarQuestion',
            params: {
                solutionId: solutionId2,
                groupId: groupId2,
                question: question,
            },
            callback: function (data) {
                if (data.status) {
                    Base.gritter(data.message, false)
                } else {
                    Base.gritter(data.message, true)
                    $('.inputSim').val('')

                    //更新相似问法个数
                    $('.tbody1 tr').each(function () {

                        if (solutionId2 == curSolutionId) {
                            $similar.text((Number($('.tbody2 tr').attr('totallist')) || 0) + 1 + '个相似问法')
                        }
                    })
                    initSrc2()
                }
            },
        })
    })

    //修改相似问法
    $('body').on('click', '.editSim', function () {
        var $tr = $(this).parents('tr'),
            $simQue = $tr.find('.simQue'),
            $simTr = $('<tr><td><input type="text" class="form-control" placeholder="输入修改后的问题" maxlength="200"></td><td style="vertical-align: middle;"><a class="ensureSim"><span class="timeTip glyphicon glyphicon-ok" title="确定"></span></a><a class="cannelSim"><span class="timeTip glyphicon glyphicon-remove" title="取消"></span></a></td><td></td><td></td></tr>')

        if (!$tr.next().find('.ensureSim')[0]) {
            $tr.after($simTr)
            $simTr.hide().fadeIn()
            $('.timeTip').tooltip()

            $simTr.find('input').val($simQue.text()).focus()
        }
    })

    //确认修改相似问法
    $('body').on('click', '.ensureSim', function () {
        editSimiQue(this)
    })

    //按回车键提交修改相似问法表单     未完成

    /*$('#simiQueTab').on('change','input[name=simiQue]',function(event){
      alert('111');
      if(event.keyCode==13){
        event.preventDefault();
        editSimiQue(this);
        return;
      }
    })*/

    //修改相似问法
    function editSimiQue (obj) {
        var $tr = $(obj).parents('tr'),
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
                    yunNoty(data)
                } else {
                    yunNoty(data);
                    /*taskId:328 查看历史记录
                    *说明：修改历史记录时，重新加载历史列表，获取内容，修改人以及修改时间
                    * */
                    initSrc2();
                    //$tr.prev().find('.simQue').text(question)
                    //$tr.fadeOut(function () {
                    //    $(this).remove()
                    //})

                }
            },
        })
    }

    //ENTER
    $(document).on('keyup', function (e) {
        var $activeEl = $(document.activeElement)

        if ($activeEl.is('[placeholder=输入修改后的问题]') && (e.keyCode == 13 || e.keyCode == 108)) {
            $('.ensureSim').trigger('click')
        }
    })

    //取消修改相似问法
    $('body').on('click', '.cannelSim', function () {
        var $tr = $(this).parents('tr')

        $tr.fadeOut(function () {
            $(this).remove()
        })
    })

    //删除问法
    $('body').on('click', '.delSimilar', function () {
        var $tr = $(this).parents('tr'),
            curSolutionId = $('.tbody2').attr('solutionid')

        Base.request({
            url: 'question/deleteSimilarQuestion',
            params: {
                id: $tr.attr('id'),
                groupId: groupId2,
            },
            callback: function (data) {
                if (data.status) {
                    Base.gritter(data.message, false)
                } else {
                    Base.gritter(data.message, true)
                    if ($('.delSimilar').length == 1) {
                        if (pageNo2 >= 2) {
                            pageNo2 -= 1
                        }
                    }

                    //更新相似问法个数
                    $('.tbody1 tr').each(function () {
                        if (solutionId2 == curSolutionId) {
                            //$(this).find('.similar span').text('' + ($('.tbody2 tr').length-1) + '个相似问法');
                            $similar.text(($('.tbody2 tr').attr('totallist') || 0) - 1 + '个相似问法')
                        }
                    })
                    initSrc2()
    
                }
            },
        })
    })

    //当前加背景
    $('body').on('mouseover', '.ansItem', function () {
        var $td = $(this).parents('td')

        $(this).addClass('ansItem_focus').siblings().removeClass('ansItem_focus')
    })

    //搜索
    $('.btnSearch').on('click', function () {
        pageNo = 1
        isJpage = 0
        queStr = $('.searchBy').val()
        initSrc()
    })
    //修改搜索框的类型  并收集相应参数
    $('.sortQue').on('click', function () {
        $('.sortWord2').html($(this).text() + '&nbsp;' + '<span class="caret"></span>')
        pageNo = 1
        isJpage = 0
        searchStr = 'question='
        queStr = $('.searchBy').val()
        queryType = 1
        //initSrc();
    })
    $('.sortAns').on('click', function () {
        $('.sortWord2').html($(this).text() + '&nbsp;' + '<span class="caret"></span>')
        pageNo = 1
        isJpage = 0
        searchStr = 'answer='
        queStr = $('.searchBy').val()
        queryType = 2
        //initSrc();
    })
    $('.sortLabel').on('click', function () {
        $('.sortWord2').html($(this).text() + '&nbsp;' + '<span class="caret"></span>')
        pageNo = 1
        isJpage = 0
        searchStr = 'labelName='
        queStr = $('.searchBy').val()
        queryType = 3
        //initSrc();
    })

    //ENTER 搜索框
    $(document).on('keyup', function (e) {
        var $activeEl = $(document.activeElement)

        if ($activeEl.is('.searchBy') && (e.keyCode == 13 || e.keyCode == 108)) {
            $('.btnSearch').trigger('click')
        }
    })

    //跳转
    $('.goPage-addSrc1 a').on('click', function () {
        $('.holder1').jPages(parseInt($('.goPage-addSrc1 input').val()))
        return false
    })

    //全选 //输入对应的页面on focus
    $('.goPage-addSrc1 input').on('focus', function () {
        $(this).select()
    })

    //排序：显示对应文本，收集参数，重新加载
    $('.sort1').on('click', function () { //默认排序
        $('.sortWord').html($(this).text() + '<span class="caret"></span>')
        status = ''
        orderType = 0
        pageNo = 1
        initSrc()
    })
    $('.sort2').on('click', function () { //时间正序
        $('.sortWord').html($(this).text() + '<span class="caret"></span>')
        status = ''
        orderType = 1
        pageNo = 1
        initSrc()
    })
    $('.sort3').on('click', function () { //时间倒序
        $('.sortWord').html($(this).text() + '<span class="caret"></span>')
        status = ''
        orderType = 2
        pageNo = 1
        initSrc()
    })
    $('.sort4').on('click', function () { //浏览量正序
        $('.sortWord').html($(this).text() + '<span class="caret"></span>')
        status = ''
        orderType = 3
        pageNo = 1
        initSrc()
    })
    $('.sort5').on('click', function () { //浏览量倒序
        $('.sortWord').html($(this).text() + '<span class="caret"></span>')
        status = ''
        orderType = 4
        pageNo = 1
        initSrc()
    })
    $('.sort6').on('click', function () { //审核状态
        $('.sortWord').html($(this).text() + '<span class="caret"></span>')
        status = -2
        pageNo = 1
        initSrc()
    })
    $('.sort7').on('click', function () { //过期状态
        $('.sortWord').html($(this).text() + '<span class="caret"></span>')
        status = -4
        pageNo = 1
        initSrc()
    })
    $('.sort8').on('click', function () { //发布状态
        $('.sortWord').html($(this).text() + '<span class="caret"></span>')
        status = 0
        pageNo = 1
        initSrc()
    })
    $('.sort9').on('click', function () { //被退回
        $('.sortWord').html($(this).text() + '<span class="caret"></span>')
        status = -3
        pageNo = 1
        initSrc()
    })
    $('.sort14').on('click', function () { //等待生效
        $('.sortWord').html($(this).text() + '<span class="caret"></span>')
        status = -5
        pageNo = 1
        initSrc()
    })
    $('.sort10').on('click', function () { //满意倒序
        $('.sortWord').html($(this).text() + '<span class="caret"></span>')
        status = ''
        orderType = 6
        pageNo = 1
        initSrc()
    })
    $('.sort11').on('click', function () { //满意正序
        $('.sortWord').html($(this).text() + '<span class="caret"></span>')
        status = ''
        orderType = 5
        pageNo = 1
        initSrc()
    })
    $('.sort12').on('click', function () { //不满意倒序
        $('.sortWord').html($(this).text() + '<span class="caret"></span>')
        status = ''
        orderType = 8
        pageNo = 1
        initSrc()
    })
    $('.sort13').on('click', function () { //不满意正序
        $('.sortWord').html($(this).text() + '<span class="caret"></span>')
        status = ''
        orderType = 7
        pageNo = 1
        initSrc()
    })

    //全选
    $('body').on('ifChecked', '.multCos', function () {
        $('.singleCos').iCheck('check')
    })
    //全不选
    $('body').on('ifUnchecked', '.multCos', function () {
        $('.singleCos').iCheck('uncheck')
    })

    //问题/流程
    $('.sT0').on('click', function () { //问题和流程
        $('.solutionType').html($(this).text() + '<span class="caret"></span>')
        solutionType = null
        pageNo = 1
        initSrc()
    })
    $('.sT1').on('click', function () { //问题
        $('.solutionType').html($(this).text() + '<span class="caret"></span>')
        solutionType = 1
        pageNo = 1
        initSrc()
    })
    $('.sT2').on('click', function () { //流程
        $('.solutionType').html($(this).text() + '<span class="caret"></span>')
        solutionType = 2
        pageNo = 1
        initSrc()
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

    //历史版本
    var pageNo3 = 1, //当前页
        pageSize3 = 10, //每页数量
        isJpage3 = 0, //是否已实例化jpage
        subSolutionId3 = 0;

    //历史版本请求
    function initSrc3() {
        Base.request({
            url: 'answer/getHistoryVersion',
            params: {
                pageSize: pageSize3,
                pageNo: pageNo3,
                subSolutionId:subSolutionId3,
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
    $('body').on('click', '.lookBe', function (e) {
        e.preventDefault();
        var $ansItem = $(this).parents('.ansItem');

        $('.ansItemCtnClone').empty().append($ansItem.find('.ansItemCtn').clone());

        subSolutionId3 = $ansItem.attr('subsolutionid');
        isJpage3 = 0;
        initSrc3();
    });
})
