var isEdit = getUrlParam('word');
// 删除的对象
var deleteObj = null;//.del-span
var synonymEditObj = null;//.word-container
// handlebars模板
var templateWordContainer = null;
var templateWordContentNil = null;
var templateDelConfirmString = null;
var templateWordContentList = null;
// 鼠标双击的参数 @DELAY 第二次点击的延时 @clicks 记录点击次数 @timer setTimeout对象
var DELAY = 300, clicks = 0, timer = null;
// 词库列表数据
var lexiconList = null;
// 记录当前已选中的词,重新加载页面之后需要展示
var activeWords = [];
// 同义词对象
var synonymTyc = null;
// 是否修改的是当前页的顶级词
var editTopFlag = false;


$(document).ready(function () {
    App.init();
    iframeTab.init({ iframeBox: '' });
    templateWordContainer = Handlebars.compile($("#word-container").html());
    templateWordContentNil = Handlebars.compile($("#word-content-nil").html());
    templateDelConfirmString = Handlebars.compile($("#del-confirm-string").html());
    templateWordContentList = Handlebars.compile($("#word-content-list").html());
    if (sessionStorage) {
        lexiconList = JSON.parse(getSessionStorage("lx_list"));
    }
    
    // 单个词点击事件
    $(document).on('click', '.word-container', function () {
        var self = this;
        clicks++;  //count clicks
        if (clicks === 1) {
            timer = setTimeout(function () {
                if ($(self).hasClass('active')) {
                    //$(self).removeClass('active');
                } else {
                    triggerSingle(self);
                }
                activeChildren($(self).attr('cid'));
                clicks = 0;             //after action performed, reset counter
            }, DELAY);
        } else {
            clearTimeout(timer);    //prevent single-click action
            synonymEditObj = self;
            $('#synonym-dialog').modal('show');
            $('#synonym-tyc').val($(self).find('.w').text());
            $('#synonym-word-before').val($(self).find('.w').text());
            $('#synonym-form [name=ttc]').val('');
            synonymTyc = $(self).find('.w').text();
            $('#synonym-id').val($(self).attr('editid'));
            showNatureList(synonymTyc);
            $.ajax({
                type: 'get',
                datatype: 'json',
                cache: false,
                url: encodeURI('../../wordDoc/list'),
                data: {
                    queryStr: $(self).find('.w').text(),
                    mode: 2,
                    pageNo: 1,
                    pageSize: 10
                },
                success: function (data) {
                    if (data.status == 0) {
                        if (data.list && data.list[0]) {
                            $('#synonym-form [name=ttc]').val(data.list[0].Tyc);
                        }
                    }
                },
                error: function (data) {
                    yunNotyError('接口请求失败!');
                }
            });

            if ($(this).parents('.word-content').index() == 0) {
                // $('#synonym-word').val($('#first').val());
                $('#synonym-word').val($('#parentBtn').text());
            } else {
                $('#synonym-word').val($(this).parents('.word-content').prev().find('.word-container.active').children('.w').text());
            }
            clicks = 0;             //after action performed, reset counter
        }
    });

    // 单个词双击事件
    $(document).on('dblclick', '.word-container', function (e) {
        e.preventDefault();
    });

    // 最上方的首个词双击事件
    $(document).on('dblclick', '#parentBtn', function (e) {
        if ($('.w').text()) {
            $('#synonym-dialog').modal('show');

        } else {
            yunNotyError('请先添加子集！');
        }
        editTopFlag = true;

        $('#synonym-tyc').val($(this).text());
        $('#synonym-word-before').val($(this).text());
        $('#synonym-form [name=ttc]').val('');
        synonymTyc = $(this).text();
        showNatureList(synonymTyc);
        $.ajax({
            type: 'get',
            datatype: 'json',
            cache: false,
            url: encodeURI('../../wordDoc/list'),
            data: {
                queryStr: synonymTyc,
                mode: 2,
                pageNo: 1,
                pageSize: 10
            },
            success: function (data) {
                if (data.status == 0) {
                    if (data.list && data.list[0]) {
                        $('#synonym-form [name=ttc]').val(data.list[0].Tyc);
                    }
                }
            },
            error: function (data) {
                yunNotyError('接口请求失败!');
            }
        });

    });
    //词性列表展示
    function showNatureList(synonymTyc) {
        $.ajax({
            type: "post",
            url: "../../wordDoc/showNatureList",
            async: true,
            cache: true,
            success: function (data) {
                var html = '';
                if (data.status == 0) {
                    if (data.natureList.length>0) {
                        for (var i = 0; i < data.natureList.length; i++) {
                            html += '<option value="' + data.natureList[i].IntValue + '">' + data.natureList[i].StrValue + '</option>';
                        }
                        $("#feature").html(html);
                        getNature(synonymTyc);
                    }else{
                        /**
                         * taskid=623    同义词添加修改返回信息错误   2018/1/10
                         * 原因：返回数组为空时拿不到词性；
                         * 修改：为空时添加一个为无的词性
                         */
                        html += '<option value="' + 0 + '">' + '无' + '</option>';
                        $("#feature").html(html);
                        getNature(synonymTyc);
                    }
                }
            },
            error: function (data) {
                yunNotyError('接口请求失败!');
            }
        });
    }
    //选择词汇时获取词性
    function getNature(synonymTyc) {
        $.ajax({
            type: "post",
            url: "../../wordDoc/getCurrentNature",
            data: { 'queryStr': synonymTyc },
            async: true,
            cache: true,
            success: function (data) {
                if (data.status == 0) {
                    $("#feature").val(data.natureId);
                    $("#synonym-feature").val(data.natureId);
                }
            },
            error: function (data) {
                yunNotyError('接口请求失败!');
            }
        });
    }

    // 修改确认点击事件
    $(document).on('click', '#synonym-modal-confirm', function (e) {
        //$.judgeEum($('#synonym-word').val(), $('#synonym-tyc').val()).then(function(){
        $.ajax({
            type: 'post',
            url: '../../wordDoc/listLeftQueryEum',
            data: { 'word': $('#synonym-tyc').val() },
            async: true,
            cache: true,
            success: function (data) {
                if (data.message == '你搜索的是表格词，请问是否打开表格库查看！') {
                    $('#tabSynonym1').modal('show');
                    $('#sureTab').click(function () {
                        $('#tabSynonym1').modal('hide');
                        $('#sureTab').attr('href', '../../web/knowledge/TabLex.html?text=' + $('#synonym-tyc').val());
                    });
                } else {
                    addWordTable();
                }
            }
        });
        function addWordTable() {
            if (editTopFlag == false) {
                if ($('#synonym-word-before').val() != $('#synonym-tyc').val()) {
                    var This = synonymEditObj;
                    $.ajax({
                        type: 'get',
                        datatype: 'json',
                        cache: false,
                        url: encodeURI('../../wordDoc/updateEum'),
                        data: $('#synonym-form').serialize(),
                        success: function (data) {
                            if (data.status === 0) {
                                //成功
                                $(synonymEditObj).find('.w').text($('#synonym-tyc').val());
                                //标记更新的词
                                activeWords = activeWords.map(function (el) {
                                    if (el == synonymTyc) {
                                        return $('#synonym-tyc').val();
                                    } else {
                                        return el;
                                    }
                                })
                                getLexiconList(1);
                                $('#synonym-dialog').modal('hide');
                            } else {
                                yunNoty(data);
                            }
                        },
                        error: function (data) {
                            yunNotyError('接口请求失败!');
                            $('#synonym-dialog').modal('hide');
                        }
                    });
                    $.ajax({
                        type: 'POST',
                        datatype: 'json',
                        cache: false,
                        url: encodeURI('../../wordDoc/doNatureEdit?queryStr=' + $("#synonym-tyc").val() + '&natureId=' + $("#feature").val()),
                        success: function (data) {
                            if (data.status == 0) {
                                yunNoty(data);
                                getLexiconList(1);
                                $('#synonym-dialog').modal('hide');
                            } else {
                                yunNoty(data);
                            }
                        },
                        error: function (data) {
                            yunNotyError('接口请求失败!');
                            $('#synonym-dialog').modal('hide');
                        }
                    });
                } else if ($("#synonym-feature").val() != $("#feature").val()) {
                    $.ajax({
                        type: 'POST',
                        datatype: 'json',
                        cache: false,
                        url: encodeURI('../../wordDoc/doNatureEdit?queryStr=' + $("#synonym-tyc").val() + '&natureId=' + $("#feature").val()),
                        success: function (data) {
                            if (data.status == 0) {
                                yunNoty(data);
                                getLexiconList(1);
                                $('#synonym-dialog').modal('hide');
                            } else {
                                yunNoty(data);
                            }
                        },
                        error: function (data) {
                            yunNotyError('接口请求失败!');
                            $('#synonym-dialog').modal('hide');
                        }
                    });

                } else {
                    // $('#synonym-dialog').modal('hide');
                }
            } else {
                // 修改首词
                if ($('#synonym-word-before').val() != $('#synonym-tyc').val()) {
                    $.ajax({
                        type: 'get',
                        datatype: 'json',
                        cache: false,
                        url: encodeURI('../../wordDoc/updateEum'),
                        data: {
                            id: lexiconList[0].Id,
                            word: $('#synonym-tyc').val(),
                            tyc: lexiconList[0].Tyc
                        },
                        success: function (data) {
                            yunNoty(data);
                            if (data.status == 0) {
                                $('#parentBtn').text($('#synonym-tyc').val());
                                getLexiconList(1);
                                $('#synonym-dialog').modal('hide');
                                setTimeout(function(){
                                    window.location.href = window.location.href.split('?')[0]+'?word='+encodeURI($('#synonym-tyc').val())
                                },1000)
                            }
                        },
                        error: function (data) {
                            yunNotyError('接口请求失败!');
                            $('#synonym-dialog').modal('hide');
                        }
                    });
                    if ($("#synonym-feature").val() != $("#feature").val()) {
                        $.ajax({
                            type: 'POST',
                            datatype: 'json',
                            cache: false,
                            url: encodeURI('../../wordDoc/doNatureEdit?queryStr=' + $("#synonym-tyc").val() + '&natureId=' + $("#feature").val()),
                            success: function (data) {
                                if (data.status == 0) {
                                    yunNoty(data);
                                    getLexiconList(1);
                                    $('#synonym-dialog').modal('hide');
                                } else {
                                    yunNoty(data);
                                }
                            },
                            error: function (data) {
                                yunNotyError('接口请求失败!');
                                $('#synonym-dialog').modal('hide');
                            }
                        });
                    }
                } else if ($("#synonym-feature").val() != $("#feature").val()) {
                    $.ajax({
                        type: 'POST',
                        datatype: 'json',
                        cache: false,
                        url: encodeURI('../../wordDoc/doNatureEdit?queryStr=' + $("#synonym-tyc").val() + '&natureId=' + $("#feature").val()),
                        success: function (data) {
                            if (data.status == 0) {
                                yunNoty(data);
                                getLexiconList(1);
                                $('#synonym-dialog').modal('hide');
                            } else {
                                yunNoty(data);
                            }
                        },
                        error: function (data) {
                            yunNotyError('接口请求失败!');
                            $('#synonym-dialog').modal('hide');
                        }
                    });
                }
                editTopFlag = false;
                //$('#synonym-dialog').modal('hide');
            }
            // 保存同义词
            $.ajax({
                type: 'get',
                datatype: 'json',
                cache: false,
                url: encodeURI('../../wordDoc/list'),
                data: {
                    queryStr: $('#synonym-tyc').val(),
                    mode: 2,
                    pageNo: 1,
                    pageSize: 10
                },
                success: function (data) {
                    if (data.status == 0) {
                        if ($('#synonym-form [name=ttc]').val().trim() === '') {
                            // 删除同义词
                            if (data.list[0]) {
                                $.ajax({
                                    type: 'post',
                                    datatype: 'json',
                                    cache: false,
                                    url: encodeURI('../../wordDoc/delWordDocById'),
                                    data: {
                                        id: data.list[0].Id
                                    },
                                    success: function (data) {
                                        if (data.status) {
                                            yunNoty(data);
                                        } else {
                                            yunNoty(data);
                                            $('#synonym-dialog').modal('hide');
                                        }
                                    }
                                });
                            } else {
                                // 如果同义词已删除，即返回的data.list为空[]									
                                $('#synonym-dialog').modal('hide')
                            }
                            return;
                        } else if (data.list[0]) {
                            // 修改
                            $.ajax({
                                type: 'post',
                                datatype: 'json',
                                cache: false,
                                url: encodeURI('../../wordDoc/editWordDocInfo'),
                                data: {
                                    id: data.list[0].Id,
                                    mode: 2,
                                    word: $('#synonym-tyc').val(),
                                    tyc: $('#synonym-form [name=ttc]').val()
                                },
                                success: function (data) {
                                    /**
                                     * taskid=623    同义词添加修改返回信息错误   2018/1/10
                                     * 原因：返回参数改变；
                                     * 修改：变更返回参数
                                     */
                                    if(data.status===1){
                                        yunNotyError(data.message, false);
                                    }else{
                                        if(data.messageError){
                                            yunNotyError(data.messageError, false);
                                        };
                                        if(data.messageSuccess){
                                            var json={
                                                status:0,
                                                message:data.messageSuccess
                                            }
                                            yunNoty(json)
                                            $('#synonym-dialog').modal('hide');
                                        }
                                    }
                                }
                            });
                            return;
                        }
                    }
                    // 新增
                    $.ajax({
                        type: 'post',
                        datatype: 'json',
                        cache: false,
                        url: encodeURI('../../wordDoc/editWordDocInfo'),
                        data: {
                            mode: 2,
                            word: $('#synonym-tyc').val(),
                            tyc: $('#synonym-form [name=ttc]').val()
                        },
                        success: function (data) {
                            /**
                             * taskid=623    同义词添加修改返回信息错误   2018/1/10
                             * 原因：返回参数改变；
                             * 修改：变更返回参数
                             */
                            if(data.status===1){
                                yunNotyError(data.message, false);
                            }else{
                                if(data.messageError){
                                    yunNotyError(data.messageError, false);
                                };
                                if(data.messageSuccess){
                                    var json={
                                        status:0,
                                        message:data.messageSuccess
                                    }
                                    yunNoty(json)
                                    $('#synonym-dialog').modal('hide');
                                }
                            }

                        }
                    });
                },
                error: function (data) {
                    yunNotyError('接口请求失败!');
                }
            });
        }
    });

    // 删除点击事件
    $(document).on('click', '.del-span', function (e) {
        e.stopPropagation();
        $('#delete-dialog').modal('show');
        var father = null;
        if ($(this).parents('.word-content').index() == 0) {
            // father = $('#first').val();
            father = $('#parentBtn').text();
        } else {
            father = $(this).parents('.word-content').prev().find('.word-container.active').children('.w').text();
        }
        $('#delete-span').html(templateDelConfirmString({
            father: father,
            children: $(this).parent().find('.w').text()
        }));
        deleteObj = this;
    });

    // 删除确认点击事件
    $(document).on('click', '#del-modal-confirm', function (e) {
        if (true) {
            var This = deleteObj;
            $.ajax({
                type: 'get',
                datatype: 'json',
                cache: false,
                url: encodeURI('../../wordDoc/deleteEum?id=' + $(This).parent().attr('editid')),
                success: function (data) {
                    //成功
                    if ($(This).parent().hasClass('active')) {
                        //触发同级其他一个节点的点击事件
                        var arrJ = $(This).parents('.word-container').siblings('.word-container').not('.active').not('.hide');
                        if (arrJ.toArray().length == 0) {
                            hideAfter($(This), 1);
                        }
                        $(This).parents('.word-container').siblings('.word-container').not('.active').not('.hide').eq(0).trigger('click');
                    }
                    deleteChildren($(This).parent().attr('cid'));
                    yunNoty(data);
                    $('#delete-dialog').modal('hide');
                },
                error: function (data) {
                    yunNotyError('接口请求失败!');
                    $('#delete-dialog').modal('hide');
                }
            });
        } else {
            var This = deleteObj;
            if ($(This).parent().hasClass('active')) {
                //触发同级其他一个节点的点击事件
                var arrJ = $(This).parents('.word-container').siblings('.word-container').not('.active').not('.hide');
                if (arrJ.toArray().length == 0) {
                    hideAfter($(This), 1);
                }
                $(This).parents('.word-container').siblings('.word-container').not('.active').not('.hide').eq(0).trigger('click');
            }
            deleteChildren($(This).parent().attr('cid'));
            $('#delete-dialog').modal('hide');
        }
    });
    
    var enterFlag = '';
    // 添加子节点回车事件
    $(document).on('keyup', '.add-word-input', function (e) {
        if (e.keyCode == 13 && $(this).val().trim()) {
            if ($(this).val().trim() != '') {
                var that = $(this).val().trim();
                var _This = $(this);
                $.ajax({
                    type: 'post',
                    url: '../../wordDoc/listLeftQueryEum',
                    data: { 'word': that },
                    async: true,
                    cache: true,
                    success: function (data) {
                        if (data.message == '你搜索的是表格词，请问是否打开表格库查看！') {
                            enterFlag = 1;
                            $('#tabSynonym1').modal('show');
                            $('#sureTab').click(function () {
                                $('#tabSynonym1').modal('hide');
                                $('#sureTab').attr('href', '../../web/knowledge/TabLex.html?text=' + that);
                                _This.val('');
                            });
                        } else {
                            enterFlag = 1;
                            keyCallback(_This);
                        }
                    }
                });
            }
        }
    });

    $(document).on('blur', '.add-word-input', function (e) {
        if(enterFlag==1){
            enterFlag = '';
            return;
        }
        if ($(this).val().trim() != '') {
            var that1 = $(this).val().trim();
            var _This1 = $(this);
            $.ajax({
                type: 'post',
                url: '../../wordDoc/listLeftQueryEum',
                data: { 'word': that1 },
                async: true,
                cache: true,
                success: function (data) {
                    if (data.message == '你搜索的是表格词，请问是否打开表格库查看！') {
                        $('#tabSynonym1').modal('show');
                        $('#sureTab').click(function () {
                            $('#tabSynonym1').modal('hide');
                            $('#sureTab').attr('href', '../../web/knowledge/TabLex.html?text=' + that1);
                            _This1.val('');
                        });
                    } else {
                        keyCallback(_This1);
                    }
                }
            });
        }
    });
    

    function keyCallback(self) {
        var word = $(self).parents('.word-content').prev().find('.word-container.active').find('.w').text();
        if (!word) {
            // word = $('#first').val();
            word = $('#parentBtn').text();
        }

        // 判断新增的词汇是否重复的deferred对象
        $.judgeEum = function (word, tyc) {
            return $.Deferred(function (dfd) {
                dfd.resolve();
                // $.ajax({
                //     type: 'post',
                //     datatype: 'json',
                //     cache: false,
                //     url: encodeURI('../../wordDoc/addJudgeEum'),
                //     data: {
                //         word: word,
                //         tyc: tyc
                //     },
                //     success: function (data) {
                //         var hasArr = [];
                //         $('.w').each(function () {
                //             hasArr.push($(this).text());
                //         });
                //         hasArr.push($('#parentBtn').text());
                //         var ffg = true;
                //         for (var q = 0; q < hasArr.length; q++) {
                //             if (tyc == hasArr[q]) {
                //                 ffg = false;
                //                 break;
                //             }
                //         }
                //         if (data.status == 0) {
                //             //yunNoty(data);
                //             dfd.resolve();
                //         } else {
                //             //yunNoty(data);
                //             dfd.reject();
                //         }
                //         if (ffg == false) {
                //             //yunNotyError('不能添加重复的词汇!');
                //             dfd.reject();
                //             return;
                //         }
                //     },
                //     error: function (data) {
                //         yunNotyError('接口请求失败!');
                //         dfd.reject();
                //     }
                // });
            });
        }


        $.judgeEum(word, $(self).val()).then(function () {     
            if (true) {
                var fword = $(self).parents('.word-content').prev().find('.word-container.active').find('.w').text();
                var fcid = $(self).parents('.word-content').prev().find('.word-container.active').attr('cid');
                if (!fword) {
                    // fword = $('#first').val();
                    fword = $('#parentBtn').text();
                }
                if (!fcid) {
                    // fcid = $('#first').val();
                    fcid = $('#parentBtn').text();
                }
                var fd = new FormData();
                fd.append('word', fword);
                fd.append('tyc', $(self).val());
                $.ajax({
                    type: 'post',
                    datatype: 'json',
                    cache: false,
                    url: encodeURI('../../wordDoc/addEum'),
                    processData: false,
                    contentType: false,
                    data: fd,
                    success: function (data) {
                        // 如果是新建的一级词汇
                        if (($(self).closest('.word-content').index() + 1) == $('.word-content:not(.hide)').length) {
                            activeWords.push($(self).val());
                        }
                        if (data.status == 0) {
                            yunNoty(data);
                            // getLexiconList(1);
                        } else {
                            yunNoty(data);
                        }
                        getLexiconList(1);
                        return;
                    },
                    error: function (data) {
                        yunNotyError('接口请求失败!');
                        //通用
                        $(self).val('');
                    }
                });
            } else {
                var fcid = $(self).parents('.word-content').prev().find('.word-container.active').attr('cid');
                if (!fcid) {
                    // fcid = $('#first').val();
                    fcid = $('#parentBtn').text();
                }
                //成功
                $(self).parent().before(templateWordContainer({
                    cid: $(self).val(),
                    fid: fcid || 0,
                    name: $(self).val()
                }));
                //通用
                $(self).val('');
            }
        });
    }

    
    // 添加子集点击事件
    $(document).on('click', '#add-subclass', function (e) {
        var addflag = $('.word-content').not('.hide').last().find(".selc").find(".word-selected").html()
        if (addflag !== " " && addflag !== "&nbsp;") {
            if ($('.word-content.hide').length > 0) {
                $('.word-content.hide').eq(0).removeClass('hide');
            } else {
                $('#word-tail').before(templateWordContentNil());
            }
        }
    });

    if (isEdit) {
        getLexiconListFromStorage();
    } else {
        $('.lexicon-edit').append('<div id="word-tail" class="row" style="font-size: 0;padding:12px;"><div class="col-md-3 col-xs-3 f-s-14">&nbsp;</div><div class="col-md-9 col-xs-9 f-s-14"><a href="javascript:;" id="add-subclass">添加子集</a></div></div>');
    }
});

// 展示子元素
function activeChildren(cid, recursive) {
    if (cid) {
        //如果可以在下一排找到子节点
        if ($('[fid="' + cid + '"]').length > 0) {
            var eq0 = $('[fid="' + cid + '"]').eq(0);
            eq0.parents('.word-content').removeClass('hide');
            eq0.parent().children('.word-container').addClass('hide');
            $('[fid="' + cid + '"]').removeClass('hide');
            triggerSingle(eq0);
            if (recursive === undefined) {
                activeChildren(eq0.attr('cid'));
            }
            //没有就显示无,且隐藏之后的所有层
        } else {
            hideAfter($('[cid="' + cid + '"]'));
        }
    }
}

// 标记单行子元素
function triggerSingle(obj) {
    //$('.word-container').removeClass('active');
    $(obj).siblings().removeClass('active');
    $(obj).addClass('active');
    var chineseWord = Utils.numberToChinese($(obj).parents('.word-content').index() + 1) + '级词语';
    // $(obj).parents('.word-content').find('.word-selected').html($(obj).find('.w').text());
    $(obj).parents('.word-content').find('.word-selected').html(chineseWord);
}

// 删除子元素
function deleteChildren(cid) {
    if (cid) {
        $('[cid="' + cid + '"]').remove();
        //如果可以在下一排找到子节点
        if ($('[fid="' + cid + '"]').length > 0) {
            $('[fid="' + cid + '"]').each(function () {
                deleteChildren($(this).attr('cid'));
            });
            //没有
        }
    }
}

// util 隐藏当前行之后的元素
function hideAfter(obj, flag) {
    var pa0 = obj.parents('.word-content');
    if (flag) {
        pa0.find('.word-container').addClass('hide');
        pa0.find('.word-selected').html(' ');
        pa0.addClass('hide');
    }
    if (pa0.nextAll()) {
        pa0.nextAll().find('.word-container').addClass('hide').removeClass('active');
        //更改左栏文字
        pa0.nextAll().find('.word-selected').html(' ');
        pa0.nextAll().addClass('hide');
        $('#word-tail').removeClass('hide');
    }
    activeWords = [];
    $('.word-container.active').each(function () {
        activeWords.push($(this).attr('cid'));
    });
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getLexiconListFromStorage() {
    var htmlArr = [];
    var level = 0;
    $('#parentBtn').text(getUrlParam('word'));
    if (lexiconList.length > 0 && lexiconList[0].lowestWord) {
    } else {
        genLexiconItem(lexiconList, htmlArr, level);
        $('.lexicon-edit').empty();
        htmlArr.forEach(function (el) {
            $('.lexicon-edit').append(templateWordContentList({
                list: el
            }));
        });
    }

    $('.lexicon-edit').append('<div id="word-tail" class="row" style="font-size: 0;padding:12px;"><div class="col-md-3 col-xs-3 f-s-14">&nbsp;</div><div class="col-md-9 col-xs-9 f-s-14"><a href="javascript:;" id="add-subclass">添加子集</a></div></div>');
    //生成完图只显示第一个词
    $('[cid]').eq(0).trigger('click');

}

function getLexiconList(reload) {
    var htmlArr = [];
    var level = 0;
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        url: encodeURI('../../wordDoc/listRightEum?word=' + $('#parentBtn').text()), // $('#first').val()),
        success: function (data) {
            lexiconList = data.list;
            if (sessionStorage) {
                sessionStorage.setItem("lx_list", JSON.stringify(lexiconList));
            }
            genLexiconItem(data.list, htmlArr, level);
            $('.lexicon-edit').empty();
            htmlArr.forEach(function (el) {
                $('.lexicon-edit').append(templateWordContentList({
                    list: el
                }));
            });

            $('.lexicon-edit').append('<div id="word-tail" class="row" style="font-size: 0;padding:12px;"><div class="col-md-3 col-xs-3 f-s-14">&nbsp;</div><div class="col-md-9 col-xs-9 f-s-14"><a href="javascript:;" id="add-subclass">添加子集</a></div></div>');
            if (reload === undefined) {
                //生成完图只显示第一个词
                $('[cid]').eq(0).trigger('click');
            } else {
                triggerSingle($('[cid="' + activeWords[0] + '"]'));
                activeWords.forEach(function (el) {
                    triggerSingle($('[cid="' + el + '"]'));
                    hideAfter($('[cid="' + el + '"]'));
                    activeChildren(el, 1);
                });
                // triggerSingle($('[cid="'+activeWords[activeWords.length-1]+'"]'));
                // hideAfter($('[cid="'+activeWords[activeWords.length-1]+'"]'));				
            }
        },
        // error: function (data) {
        //     yunNotyError('接口请求失败!');
        // }
    });
}

function genLexiconItem(listThis, listArr, level) {
    if (listThis) {
        listThis.forEach(function (el, i) {
            if (listArr[level]) {
                listArr[level].push({
                    cid: el.Tyc,
                    fid: el.Word,
                    editid: el.Id
                });
            } else {
                listArr[level] = [{
                    cid: el.Tyc,
                    fid: el.Word,
                    editid: el.Id
                }];
            }
            if (el.List && el.List.length > 0) {
                genLexiconItem(el.List, listArr, level + 1);
            }
        });
    }
}

/*
    工具包
*/
var Utils = {
    /*
        单位
    */
    units: '个十百千万@#%亿^&~',
    /*
        字符
    */
    chars: '零一二三四五六七八九',
    /*
        数字转中文
        @number {Integer} 形如123的数字
        @return {String} 返回转换成的形如 一百二十三 的字符串             
    */
    numberToChinese: function (number) {
        var a = (number + '').split(''), s = [], t = this;
        if (a.length > 12) {
            throw new Error('too big');
        } else {
            for (var i = 0, j = a.length - 1; i <= j; i++) {
                if (j == 1 || j == 5 || j == 9) {//两位数 处理特殊的 1*  
                    if (i == 0) {
                        if (a[i] != '1') s.push(t.chars.charAt(a[i]));
                    } else {
                        s.push(t.chars.charAt(a[i]));
                    }
                } else {
                    s.push(t.chars.charAt(a[i]));
                }
                if (i != j) {
                    s.push(t.units.charAt(j - i));
                }
            }
        }
        //return s;  
        return s.join('').replace(/零([十百千万亿@#%^&~])/g, function (m, d, b) {//优先处理 零百 零千 等  
            b = t.units.indexOf(d);
            if (b != -1) {
                if (d == '亿') return d;
                if (d == '万') return d;
                if (a[j - b] == '0') return '零'
            }
            return '';
        }).replace(/零+/g, '零').replace(/零([万亿])/g, function (m, b) {// 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的  
            return b;
        }).replace(/亿[万千百]/g, '亿').replace(/[零]$/, '').replace(/[@#%^&~]/g, function (m) {
            return { '@': '十', '#': '百', '%': '千', '^': '十', '&': '百', '~': '千' }[m];
        }).replace(/([亿万])([一-九])/g, function (m, d, b, c) {
            c = t.units.indexOf(d);
            if (c != -1) {
                if (a[j - c] == '0') return d + '零' + b
            }
            return m;
        });
    }
}; 