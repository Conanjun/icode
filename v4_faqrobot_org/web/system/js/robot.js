//初始化switchery插件
//
var green = '#00acac',
    red = '#ff5b57',
    blue = '#348fe2',
    purple = '#727cb6',
    orange = '#f59c1a',
    black = '#2d353c'
var mySwitchery = null
if ($('[data-render=switchery]').length !== 0) {
    $('[data-render=switchery]').each(function () {
        var e = green
        if ($(this).attr('data-theme')) {
            switch ($(this).attr('data-theme')) {
                case 'red':
                    e = red
                    break
                case 'blue':
                    e = blue
                    break
                case 'purple':
                    e = purple
                    break
                case 'orange':
                    e = orange
                    break
                case 'black':
                    e = black
                    break
            }
        }
        var t = {}
        t.color = e
        t.secondaryColor = $(this).attr('data-secondary-color') ? $(this).attr('data-secondary-color') : '#dfdfdf'
        t.className = $(this).attr('data-classname') ? $(this).attr('data-classname') : 'switchery'
        t.disabled = $(this).attr('data-disabled') ? true : false
        t.disabledOpacity = $(this).attr('data-disabled-opacity') ? $(this).attr('data-disabled-opacity') : 0.5
        t.speed = $(this).attr('data-speed') ? $(this).attr('data-speed') : '0.5s'
        mySwitchery = new Switchery(this, t)
    })
}

//欢迎语推荐按钮
function registerWel_change() {
    $('#yyhSwitch input[data-change="check-switchery-state-text"]').unbind('change').bind('change', function () {
        if ($(this).prop('checked')) {
            $('#yyh').fadeIn()
        } else {
            $('#yyh').fadeOut()
        }
    })
}

//按钮状态修改
function setSwitchery(switchElement, checkedBool) {
    if ((checkedBool && !switchElement.isChecked()) || (!checkedBool && switchElement.isChecked())) {
        switchElement.setPosition(true)
        switchElement.handleOnchange(true)
    }
}

var sourceId = '-1', txt = '全部', rsCount = 0
var longWords = []
var ua = []
var queSetting = []

function addQueSearch() {
    if ($('#queDivNav li').eq(0).hasClass('active')) {
        sQue()
    } else if ($('#queDivNav li').eq(1).hasClass('active')) {
        fQue()
    } else {
        sQue()
        fQue()
    }
}

$(document).ready(function () {
    Base.request({
        url: 'tipHelp/check',
        params: {
            code: 'robot',
        },
        callback: function (data) {
            if (data.status) { } else {
                introJs().setOptions({
                    prevLabel: '上一步',
                    nextLabel: '下一步',
                    skipLabel: '　',
                    doneLabel: '　',
                    showBullets: false
                }).start().onexit(function () { }).oncomplete(function () { }).onchange(function (obj) {
                    var curNum = parseInt($(obj).attr('data-step').match(/\d+/)[0])
                    $('.tipStep' + (curNum - 1)).hide()
                    $('.tipStep' + (curNum + 1)).hide()
                    $(obj).show()
                })
            }
        }
    })
    App.init()
    $('#queManual').on('click', '.zntjo', function () {
        if ($(this).parent().next().children().val() != '') {
            $(this).html('智能推荐')
            if ($(this).hasClass('btn-white')) {
                $(this).removeClass('btn-white').addClass('btn-primary')
            }
            $(this).parent().next().children().val('').attr('rel', 0)
        }
    })
    $('#queManual').on('click', 'a[name=delpostInput]', function () {
        if ($('#queManual a[name=delpostInput]').size() > 1) {
            $(this).parent().parent().remove()
        } else {
            $('#queManual [name=postQueInput]').removeAttr('rel');
            $('#queManual [name=postQueInput]').removeAttr('srel');
            $('#queManual [name=postQueInput]').val('')
        }
    })
    $('#queManual').on('click', '[name=postQueInput]', function () {
        QandFIndex = $(this).parent().parent().index()
        showQueModal()
    })
    $('#queManual').on('click', 'a[name=addpostInput]', function () {
        if ($('.QueContainer').length < 5)
            $('#queManual').append('<div class="QueContainer row"><div class="form-group col-xs-2"><button type="button" class="btn btn-primary zntjo">智能推荐</button></div><div class="form-group col-xs-8"><input class="form-control" type="text" readOnly style="cursor:pointer;" placeholder="暂无数据，待被问后自动填充智能推荐问题，也可点击手动选择推荐问题" name="postQueInput" rel="0"></div><div class="form-group col-xs-2 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>&nbsp;<a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>')
    })
    $('#queDivNav a').click(function (e) {
        if ($(this).attr('href') == '#queManualQue') {
            sQue()
        } else if ($(this).attr('href') == '#queManualFlow') {
            fQue()
        }
    })
    $(document).on('click', '.ars', function () {
        if ($('.rsc').length <= 9) {
            // $('.rsc:last').after('<div class="form-group rsc"><label class="control-label col-md-1"></label><div class="col-md-9"><textarea type="text" placeholder="请输入未知说辞" data-rs="rs" data-rd="robotspeak'+(++rsCount)+'" id="robotspeak'+(rsCount)+'"></textarea></div><div class="col-md-2"><a href="javascript:;" class="m-l-5 drs"><span class="fa fa-minus-circle fa-2x"></span></a></div></div>');
            rsCount++;
            $('#notknow').after('<div class="form-group rsc"><label class="control-label col-md-2"></label><div class="col-md-9 col-xs-10"><textarea type="text" placeholder="请输入未知说辞" data-rs="rs" data-rd="robotspeak' + (rsCount) + '" id="robotspeak' + (rsCount) + '"></textarea></div><div class="col-md-1 col-xs-2"><a href="javascript:;" class="m-l-5 drs"><span class="fa fa-minus-circle fa-2x"></span></a></div></div>')
            UE.getEditor('robotspeak' + rsCount, {
                initialFrameHeight: 150,
                wordCount: true,
                maximumWords: 3e3,
                zIndex: 500,
                pasteplain:true
            })
            UE.getEditor('robotspeak' + rsCount).ready(function () {
                if (txt == '网页' || txt == 'APP') {
                    $('.edui-editor-toolbarboxouter').show();
                } else {
                    $('.edui-editor-toolbarboxouter').hide();
                }
            })
        }
    })
    $(document).on('click', '.drs', function () {
        if ($('.rsc').length == 1) {
            UE.getEditor($(this).parent().prev().children('textarea').data('rd')).setContent('');
        } else {
            $(this).parents('.rsc').remove();
        }
    })
    enterSubmit($('#search_Que input[name=question]'), addQueSearch)
    setInterval(function () {
        if ($('.edui-editor').css('position') != 'absolute') {
            $('.edui-editor').css('width', 'auto')
        }
    }, 1e3)
    $('#robotname').addWordCount(10);
    $('#robotNameDetail').addWordCount(20);
    getInfo();
    $('#robot_tab').validate({
        rules: {
            robotName: {
                required: true,
                minlength: 1,
                maxlength: 10
            },
            url: {
                required: true,
                url: true
            },
            helloWord: {
                minlength: 20,
                maxlength: 1e3
            },
            unknownWord: {
                minlength: 20,
                maxlength: 3e3
            }
        },
        messages: {
            robotName: {
                required: '请输入机器人名称！',
                minlength: '请输入至少1个字符！',
                maxlength: '请输入不多于10个字符！'
            },
            url: {
                required: '请输入LOGO地址！',
                url: '请输入有效的网址！'
            },
            helloWord: {
                minlength: '请输入不少于20个字符！',
                maxlength: '请输入不多于1000个字符！'
            },
            unknownWord: {
                minlength: '请输入不少于20个字符！',
                maxlength: '请输入不多于3000个字符！'
            }
        },
        submitHandler: Addbaba
    })
    $('#fileupload').fileupload({
        url: '../../material/jQueryFileUpload?type=1&materialType=1',
        dataType: 'json',
        change: function (e, data) {
            var flag = true
            $.each(data.files, function (index, file) {
                var str = file.name.substring(file.name.lastIndexOf('.') + 1);
                str = str.toLowerCase();
                if (str == 'jpeg' || str == 'jpg' || str == 'png' || str == 'bmp' || str == 'gif') {
                    flag = true
                } else {
                    flag = false
                    yunNotyError('上传文件错误，支持以jpeg、jpg、png、bmp、gif结尾的格式文件！')
                }
            })
            return flag
        },
        done: function (e, data) {
            $.each(data.result.files, function (index, file) {
                if (file.error != undefined && file.error != '') {
                    var obj = {}
                    obj.status = 1
                    obj.message = file.error
                    yunNoty(obj)
                    return
                }
                if (file.url != '') {
                    $('#imgLogo').attr('src', file.url)
                    $('#url').val(file.url)
                    $('#logoUrl').val(file.url)
                }
            })
        }
    })

    //欢迎语推荐按钮
    registerWel_change()

})

$('#url').on('blur', function () {
    $('#imgLogo').attr('src', $(this).val())
    $('#logoUrl').val($(this).val())
})

UE.getEditor('robotwelome', {
    initialFrameHeight: 150,
    wordCount: true,
    maximumWords: 1e3,
    zIndex: 500,
    pasteplain:true
})

UE.getEditor('robotspeak0', {
    initialFrameHeight: 150,
    wordCount: true,
    maximumWords: 3e3,
    zIndex: 500,
    pasteplain:true
})

var flag_add = false

function Addbaba() {
    if (flag_add) {
        return
    }
    flag_add = true
    var helloWord = ''
    var unknownWord = []
    if (txt == '网页' || txt == 'APP' || txt == 'API') {
        helloWord = UE.getEditor('robotwelome').getContent()
        $('[data-rs="rs"]').each(function () {
            unknownWord.push(UE.getEditor($(this).data('rd')).getContent())
        })
    } else {
        helloWord = UE.getEditor('robotwelome').getPlainTxt()
        $('[data-rs="rs"]').each(function () {
            unknownWord.push(UE.getEditor($(this).data('rd')).getPlainTxt())
        })
    }
    var fd = new FormData()
    if ($('#yyh').css('display') == 'none') {
    } else {
        $('[name=postQueInput]').each(function () {
            if ($(this).attr('rel') !== '0') {
                fd.append('status', 1)
                fd.append('questionIds', $(this).attr('rel'))
            } else {
                fd.append('status', 2)
                fd.append('questionIds', 0)
            }
        })
    }
    fd.append('robotName', $('#robot_tab [name=robotName]').val())
    fd.append('robotNameDetail', $('#robot_tab [name=robotNameDetail]').val())
    fd.append('url', $('#robot_tab input[name=url]').val())
    fd.append('logoUrl', $('#robot_tab [name=logoUrl]').val())
    fd.append('id', $('#robot_tab [name=id]').val())
    fd.append('helloWord', helloWord)
    unknownWord.forEach(function (el) {
        fd.append('unknownWord', el)
    })
    fd.append('sourceId', sourceId)
    if ($('.styleSelect').val() == '-1') {
        fd.append('rule', 3)
    } else {
        fd.append('rule', 2)
    }
    fd.append('ruleId', sourceId)
    $.ajax({
        type: 'post',
        datatype: 'json',
        processData: false,
        contentType: false,
        cache: false,
        url: encodeURI('../../RobotSetting/editWebConfigInfo'),
        data: fd,
        success: function (data) {
            flag_add = false
            if (data.status == 0) {
                yunNoty(data)
            } else {
                yunNoty(data)
            }
        }
    })
}

function clearinput() {
    $('#robot_tab').find('input').val('');
    UE.getEditor('robotwelome').setContent('');
    for (var i = 0; i < $('.rsc').length; i++) {
        UE.getEditor('robotspeak' + (i + 1)).setContent('');
    }
}

function getInfo() {
    var str = '';
    if ($('.styleSelect').val() == '-1' || $('.styleSelect').val() === null) {
        str = 'rule=3'
    } else {
        str = 'rule=2'
    }
    $.getJSON('../../RobotSetting/getRobotByRuleId?' + str + '&ruleId=' + sourceId, function (data) {
        if (data.status == 0) {
            $('#spaceLimit span').text(data.spaceLimit);
            $('#hid').val(data.webConfig.Id);
            $('#robotname').val(data.webConfig.RobotName);
            $('#robotNameDetail').val(data.webConfig.RobotNameDetail);
            if (data.webConfig.LogoUrl) {
                $('#tab-1').tab('show');
                $('#imgLogo').attr('src', data.webConfig.LogoUrl);
                $('#url').val(data.webConfig.LogoUrl);
                $('#logoUrl').val(data.webConfig.LogoUrl);
            } else {
                $('#tab-2').tab('show');
            }
            if (data.webConfig.ChannelDemoList instanceof Array) {
                var hWords = data.webConfig.ChannelDemoList.filter(function (el) {
                    return el.Mode == 1;
                })
                if (hWords.length == 0) {
                    hWords.push({
                        StringValue: ''
                    })
                }
                // UE.getEditor('robotwelome').ready(function () {
                setTimeout(function () {
                    UE.getEditor('robotwelome').setContent(hWords[0].StringValue);
                }, 200)
                // })
                // UnknownWord
                $('.rsc').remove();
                longWords = data.webConfig.ChannelDemoList.filter(function (el) {
                    return el.Mode == 2;
                })
                var ll = longWords.length;
                ua = [];
                for (var i = 0; i < ll; i++) {
                    ua.push(++rsCount);
                    // $('#notknow').after('<div class="form-group rsc"><label class="control-label col-md-1"></label><div class="col-md-9"><textarea type="text" placeholder="请输入未知说辞" data-rs="rs" data-rd="robotspeak'+(rsCount)+'" id="robotspeak'+(rsCount)+'"></textarea></div><div class="col-md-2"><a href="javascript:;" class="m-l-5 drs"><span class="fa fa-minus-circle fa-2x"></span></a></div></div>');
                    $('#notknow').after('<div class="form-group rsc"><label class="control-label col-md-2"></label><div class="col-md-9 col-xs-10"><textarea type="text" placeholder="请输入未知说辞" data-rs="rs" data-rd="robotspeak' + (rsCount) + '" id="robotspeak' + (rsCount) + '"></textarea></div><div class="col-md-1 col-xs-2"><a href="javascript:;" class="m-l-5 drs"><span class="fa fa-minus-circle fa-2x"></span></a></div></div>')
                    UE.getEditor('robotspeak' + rsCount, {
                        initialFrameHeight: 150,
                        wordCount: true,
                        maximumWords: 3e3,
                        zIndex: 500,
                        pasteplain:true
                    })
                }
                for (var j = 0; j < ua.length; j++) {
                    (function (k) {
                        setTimeout(function () {
                            UE.getEditor('robotspeak' + ua[k]).setContent(longWords[k].StringValue);
                        }, 200)
                    })(j)
                }
                queSetting = data.webConfig.ChannelDemoList.filter(function (el) {
                    return el.Mode == 3
                })
            } else {
                rsCount++;
                UE.getEditor('robotwelome').ready(function () {
                    UE.getEditor('robotwelome').setContent('');
                })
                $('.rsc').remove();
                // $('#notknow').after('<div class="form-group rsc"><label class="control-label col-md-1"></label><div class="col-md-9"><textarea type="text" placeholder="请输入未知说辞" data-rs="rs" data-rd="robotspeak'+(++rsCount)+'" id="robotspeak'+(rsCount)+'"></textarea></div><div class="col-md-2"><a href="javascript:;" class="m-l-5 drs"><span class="fa fa-minus-circle fa-2x"></span></a></div></div>');
                $('#notknow').after('<div class="form-group rsc"><label class="control-label col-md-2"></label><div class="col-md-9 col-xs-10"><textarea type="text" placeholder="请输入未知说辞" data-rs="rs" data-rd="robotspeak' + (rsCount) + '" id="robotspeak' + (rsCount) + '"></textarea></div><div class="col-md-1 col-xs-2"><a href="javascript:;" class="m-l-5 drs"><span class="fa fa-minus-circle fa-2x"></span></a></div></div>')

                UE.getEditor('robotspeak' + rsCount, {
                    initialFrameHeight: 150,
                    wordCount: true,
                    maximumWords: 3e3,
                    zIndex: 500,
                    pasteplain:true
                })
            }
            // ???

            $('#queManual').empty();
            for (var i = 0; i < 5; i++) {
                var el = data.question[i];
                if ($('#queManual').children('.QueContainer').size() < 5) {
                    if (el) {
                        if (el.Question) {
                            if (judgeIf(el.Id)) {
                                //Amend By zhaoyuxing At 20171213 单号:369
                                //说明：去除字符串拼接的‘el.Question ’变量，采用DOM操作进行添加
                                $('#queManual').append('<div class="QueContainer row"><div class="form-group col-md-2"><button type="button" class="btn btn-white zntjo">手动推荐</button></div><div class="form-group col-md-8"><input class="form-control" type="text" readOnly style="cursor:pointer;" placeholder="暂无数据，待被问后自动填充智能推荐问题，也可点击手动选择推荐问题" name="postQueInput" value="（浏览' + el.Hits + '次）'+ '" rel="' + el.Id + '" srel="' + el.SolutionId + '" ></div><div class="form-group col-md-2 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>&nbsp;<a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>')
                                var _thisInput=$('[name=postQueInput]').eq(i);
                                var hits=_thisInput.val();
                                _thisInput.val(hits+el.Question);
                            } else {
                                //Amend By zhaoyuxing At 20171213 单号:369
                                //说明：去除字符串拼接的‘el.Question ’变量，采用DOM操作进行添加
                                $('#queManual').append('<div class="QueContainer row"><div class="form-group col-md-2"><button type="button" class="btn btn-primary zntjo">智能推荐</button></div><div class="form-group col-md-8"><input class="form-control" type="text" readOnly style="cursor:pointer;" placeholder="暂无数据，待被问后自动填充智能推荐问题，也可点击手动选择推荐问题" name="postQueInput" value="（浏览' + el.Hits + '次）' + el.Question + '" rel="' + el.Id + '" srel="' + el.SolutionId + '" ></div><div class="form-group col-md-2 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>&nbsp;<a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>')
                                var _thisInput=$('[name=postQueInput]').eq(i);
                                var hits=_thisInput.val();
                                _thisInput.val(hits+el.Question);
                            }
                        } else {
                            $('#queManual').append('<div class="QueContainer row"><div class="form-group col-md-2"><button type="button" class="btn btn-primary zntjo">智能推荐</button></div><div class="form-group col-md-8"><input class="form-control" type="text" readOnly style="cursor:pointer;" placeholder="暂无数据，待被问后自动填充智能推荐问题，也可点击手动选择推荐问题" name="postQueInput" value="" rel="0" srel="0" ></div><div class="form-group col-md-2 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>&nbsp;<a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>')
                        }
                        setSwitchery(mySwitchery, true);
                        $('#yyh').fadeIn();
                    } else {
                        setSwitchery(mySwitchery, false);
                        $('#yyh').fadeOut();
                        $('#queManual').append('<div class="QueContainer row"><div class="form-group col-md-2"><button type="button" class="btn btn-primary zntjo">智能推荐</button></div><div class="form-group col-md-8"><input class="form-control" type="text" readOnly style="cursor:pointer;" placeholder="暂无数据，待被问后自动填充智能推荐问题，也可点击手动选择推荐问题" name="postQueInput" value="" rel="0" srel="0" ></div><div class="form-group col-md-2 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>&nbsp;<a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>')
                    }
                }
            }
            $('.edui-editor-toolbarboxouter').hide();
            var optionHtml = ''
            if (data.sourceList) {
                for (var i = 0; i < data.sourceList.length; i++) {
                    optionHtml += '<option value="' + data.sourceList[i].DicCode + '">' + data.sourceList[i].DicDesc + '</option>'
                }
            }
            $('.styleSelect').append('<option value=\'-1\'>全部</option>' + optionHtml);
            if (txt == '网页' || txt == 'APP') {
                $('.edui-editor-toolbarboxouter').show();
            } else {
                $('.edui-editor-toolbarboxouter').hide();
            }
        } else if (data.status == -1) {
            data.clallback = function () {
                top.location.href = '../../login.html';
            }
            data.timeout = 1500
        } else {
            yunNoty(data)
        }
    })
}

$('.styleSelect').on('change', function () {
    sourceId = $('option:selected', this).val();
    txt = $('option:selected', this).text();
    getRobotBySourceId()
})

function getRobotBySourceId() {
    if ($('.styleSelect').val() == '-1') {
        str = 'rule=3'
    } else {
        str = 'rule=2'
    }
    $.getJSON('../../RobotSetting/getRobotByRuleId?' + str + '&ruleId=' + sourceId, function (data) {
        if (data.status == 0) {
            if (data.webConfig.ChannelDemoList instanceof Array) {
                var hWords = data.webConfig.ChannelDemoList.filter(function (el) {
                    return el.Mode == 1
                })
                if (hWords.length == 0) {
                    hWords.push({
                        StringValue: ''
                    })
                }
                // UE.getEditor('robotwelome').ready(function () {
                setTimeout(function () {
                    UE.getEditor('robotwelome').setContent(hWords[0].StringValue);
                }, 200)
                // })
                // UnknownWord
                $('.rsc').remove();
                longWords = data.webConfig.ChannelDemoList.filter(function (el) {
                    return el.Mode == 2
                })
                var ll = longWords.length;
                ua = [];
                for (var i = 0; i < ll; i++) {
                    ua.push(++rsCount);
                    // $('#notknow').after('<div class="form-group rsc"><label class="control-label col-md-1"></label><div class="col-md-9"><textarea type="text" placeholder="请输入未知说辞" data-rs="rs" data-rd="robotspeak'+(rsCount)+'" id="robotspeak'+(rsCount)+'"></textarea></div><div class="col-md-2"><a href="javascript:;" class="m-l-5 drs"><span class="fa fa-minus-circle fa-2x"></span></a></div></div>');
                    $('#notknow').after('<div class="form-group rsc"><label class="control-label col-md-2"></label><div class="col-md-9 col-xs-10"><textarea type="text" placeholder="请输入未知说辞" data-rs="rs" data-rd="robotspeak' + (rsCount) + '" id="robotspeak' + (rsCount) + '"></textarea></div><div class="col-md-1 col-xs-2"><a href="javascript:;" class="m-l-5 drs"><span class="fa fa-minus-circle fa-2x"></span></a></div></div>')
                    UE.getEditor('robotspeak' + rsCount, {
                        initialFrameHeight: 150,
                        wordCount: true,
                        maximumWords: 3e3,
                        zIndex: 500,
                        pasteplain:true
                    })
                }
                for (var j = 0; j < ua.length; j++) {
                    (function (k) {
                        // UE.getEditor('robotspeak' + ua[k]).ready(function () {
                        setTimeout(function () {
                            UE.getEditor('robotspeak' + ua[k]).setContent(longWords[k].StringValue)
                        }, 200)
                        // })
                    })(j)
                }
                queSetting = data.webConfig.ChannelDemoList.filter(function (el) {
                    return el.Mode == 3
                })
            } else {
                rsCount++;
                UE.getEditor('robotwelome').ready(function () {
                    UE.getEditor('robotwelome').setContent('')
                })
                $('.rsc').remove();
                // $('#notknow').after('<div class="form-group rsc"><label class="control-label col-md-1"></label><div class="col-md-9"><textarea type="text" placeholder="请输入未知说辞" data-rs="rs" data-rd="robotspeak'+(++rsCount)+'" id="robotspeak'+(rsCount)+'"></textarea></div><div class="col-md-2"><a href="javascript:;" class="m-l-5 drs"><span class="fa fa-minus-circle fa-2x"></span></a></div></div>');
                $('#notknow').after('<div class="form-group rsc"><label class="control-label col-md-2"></label><div class="col-md-9 col-xs-10"><textarea type="text" placeholder="请输入未知说辞" data-rs="rs" data-rd="robotspeak' + (rsCount) + '" id="robotspeak' + (rsCount) + '"></textarea></div><div class="col-md-1 col-xs-2"><a href="javascript:;" class="m-l-5 drs"><span class="fa fa-minus-circle fa-2x"></span></a></div></div>')
                UE.getEditor('robotspeak' + rsCount, {
                    initialFrameHeight: 150,
                    wordCount: true,
                    maximumWords: 3e3,
                    zIndex: 500,
                    pasteplain:true
                })
            }
            // ???
            $('#queManual').empty();
            for (var i = 0; i < 5; i++) {
                var el = data.question[i];
                if ($('#queManual').children('.QueContainer').size() < 5) {
                    if (el) {
                        if (el.Question) {
                            if (judgeIf(el.Id)) {
                                $('#queManual').append('<div class="QueContainer row"><div class="form-group col-md-2"><button type="button" class="btn btn-white zntjo">手动推荐</button></div><div class="form-group col-md-8"><input class="form-control" type="text" readOnly style="cursor:pointer;" placeholder="暂无数据，待被问后自动填充智能推荐问题，也可点击手动选择推荐问题" name="postQueInput" value="（浏览' + el.Hits + '次）' + el.Question + '" rel="' + el.Id + '" srel="' + el.SolutionId + '" ></div><div class="form-group col-md-2 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>&nbsp;<a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>')
                            } else {
                                $('#queManual').append('<div class="QueContainer row"><div class="form-group col-md-2"><button type="button" class="btn btn-primary zntjo">智能推荐</button></div><div class="form-group col-md-8"><input class="form-control" type="text" readOnly style="cursor:pointer;" placeholder="暂无数据，待被问后自动填充智能推荐问题，也可点击手动选择推荐问题" name="postQueInput" value="（浏览' + el.Hits + '次）' + el.Question + '" rel="' + el.Id + '" srel="' + el.SolutionId + '" ></div><div class="form-group col-md-2 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>&nbsp;<a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>')
                            }
                        } else {
                            $('#queManual').append('<div class="QueContainer row"><div class="form-group col-md-2"><button type="button" class="btn btn-primary zntjo">智能推荐</button></div><div class="form-group col-md-8"><input class="form-control" type="text" readOnly style="cursor:pointer;" placeholder="暂无数据，待被问后自动填充智能推荐问题，也可点击手动选择推荐问题" name="postQueInput" value="" rel="0" srel="0" ></div><div class="form-group col-md-2 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>&nbsp;<a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>')
                        }
                        setSwitchery(mySwitchery, true);
                        $('#yyh').fadeIn();
                    } else {
                        setSwitchery(mySwitchery, false);
                        $('#yyh').fadeOut();
                        $('#queManual').append('<div class="QueContainer row"><div class="form-group col-md-2"><button type="button" class="btn btn-primary zntjo">智能推荐</button></div><div class="form-group col-md-8"><input class="form-control" type="text" readOnly style="cursor:pointer;" placeholder="暂无数据，待被问后自动填充智能推荐问题，也可点击手动选择推荐问题" name="postQueInput" value="" rel="0" srel="0" ></div><div class="form-group col-md-2 m-l-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>&nbsp;<a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>')
                    }

                }
            }
        } else if (data.status == -1) {
            data.clallback = function () {
                top.location.href = '../../login.html'
            }
            data.timeout = 1500
        } else {
            yunAlert(data)
        }
        if (txt == '网页' || txt == 'APP') {
            $('.edui-editor-toolbarboxouter').show()
        } else {
            $('.edui-editor-toolbarboxouter').hide()
        }
        /**
         * taskid=663 每个渠道都可以设置欢迎语问题引导 顾荣 2018/1/19
         * 修改：所有渠道都展示欢迎语问题引导
         */
        
        // if (txt == '微信' || txt == '微博' || txt == '支付宝' || txt == 'API') {
        //     $('#yyhSwitch').add('#yyh').hide();
        //     setSwitchery(mySwitchery, false)
        // } else {
            $('#yyhSwitch').add('#yyh').show();
            if (data.question && data.question.length > 0) {
                setSwitchery(mySwitchery, true)
            } else {
                setSwitchery(mySwitchery, false);
                $('#yyh').hide()
            }
        // }
    })
}

function judgeIf(id) {
    var flag = false;
    queSetting.forEach(function (el) {
        if (el.IntValue == id) {
            if (el.Status == 1) {
                flag = true
            }
        }
    })
    return flag
}

function filterP(node) {
    return node.isParent == false
}

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
        dataFilter: function (treeId, parentNode, responseData) {
            if (responseData) {
                if (responseData.status == -1) {
                    yunNoty(responseData)
                }
                responseData.list.push({
                    Id: 0,
                    ParentId: 0,
                    Name: '全部分类',
                    open: true
                })
                return responseData.list
            }
            return responseData
        }
    },
    callback: {
        onClick: function (event, treeId, treeNode, clickFlag) {
            var treeObj = $.fn.zTree.getZTreeObj(treeId)
            Nodes = treeObj.getSelectedNodes()
            $('#queSel').html(Nodes[0].Name)
            var array = treeObj.getNodesByFilter(filterP, false, treeNode)
            if (array.length > 0) {
                var groupId = ''
                for (var i in array) {
                    groupId += array[i].Id + ','
                }
                $('.selQueX').val(groupId)
            } else {
                $('.selQueX').val(treeNode.Id)
            }
            $('#menuContent').fadeOut('fast')
            if ($('#queManualQue').hasClass('active')) {
                sQue(1)
            } else if ($('#queManualFlow').hasClass('active')) {
                fQue(1)
            }
        },
        onAsyncSuccess: function (event, treeId, treeNode, msg) {
            var treeObj = $.fn.zTree.getZTreeObj(treeId)
            var array = treeObj.getNodesByFilter(filterP)
            if (array.length > 0) {
                var groupId = ''
                for (var i in array) {
                    groupId += array[i].Id + ','
                }
                $('.selQueX').val(groupId)
            } else {
                $('.selQueX').val(treeNode.Id)
            }
            if ($('#queManualQue').hasClass('active')) {
                sQue(1)
            } else if ($('#queManualFlow').hasClass('active')) {
                fQue(1)
            }
        },
        beforeClick: function (treeId, treeNode, clickFlag) {
            if (treeNode.isParent === true) {
                $('#search_Que input[name=isLeaf]').val(0)
            } else {
                $('#search_Que input[name=isLeaf]').val(1)
            }
        }
    }
}

$('#queManualConfirm').click(function () {
    var addFlag = false
    var id = getSelectedIds_aQue()
    var SolutionId = getSelectedSolutionIds_aQue()
    var hits = $('#list-tr-' + id).attr('hits')
    var targetInput = $('#queManual [name=postQueInput]').eq(QandFIndex)
    if (targetInput.val() === '') {
        addFlag = true
    }


    if(id){
      targetInput.attr('rel', id)
      targetInput.attr('Srel', SolutionId)
      targetInput.val('（浏览' + hits + '次）' + $('#queDiv #list-tr-' + id).children('td').eq(1).html())
      targetInput.parent().prev().children().removeClass('btn-primary').addClass('btn-white')
      targetInput.parent().prev().children().html('手动推荐')
      $('#queManualModal').modal('hide')
      if (addFlag) {
          // $("#queManual").append('');
      }
    }else{
        yunNotyError('请选择推荐问题！');
    }

})

function getSelectedIds_aQue() {
    var cboxs = null
    if ($('#queManualQue').hasClass('active')) {
        cboxs = document.getElementsByName('row_sel1')
    } else if ($('#queManualFlow').hasClass('active')) {
        cboxs = document.getElementsByName('row_sel2')
    }
    if (typeof cboxs == 'undefined') {
        return -1
    }
    var inputvalue = ''
    for (var i = 0; i < cboxs.length; i++) {
        if (cboxs[i].checked === true) {
            inputvalue = cboxs[i].value
        }
    }
    return inputvalue
}

function getSelectedSolutionIds_aQue() {
    var cboxs = null
    if ($('#queManualQue').hasClass('active')) {
        cboxs = document.getElementsByName('row_sel1')
    } else if ($('#queManualFlow').hasClass('active')) {
        cboxs = document.getElementsByName('row_sel2')
    }
    if (typeof cboxs == 'undefined') {
        return -1
    }
    var inputvalue = ''
    for (var i = 0; i < cboxs.length; i++) {
        if (cboxs[i].checked === true) {
            inputvalue = cboxs[i].getAttribute('solutionid')
        }
    }
    return inputvalue
}

function showMenu() {
    var cityObj = $('#queSel')
    var cityOffset = $('#queSel').offset()
    $('#menuContent').slideDown('fast')
    $('body').bind('mousedown', onBodyDown)
    $('#classTree').slimScroll({
        height: '300px'
    })
}

function hideMenu() {
    $('#menuContent').fadeOut('fast')
    $('body').unbind('mousedown', onBodyDown)
}

function onBodyDown(event) {
    if (!(event.target.id == 'menuBtn' || event.target.id == 'menuContent' || $(event.target).parents('#menuContent').length > 0)) {
        hideMenu()
    }
}

function showQueModal() {
    $('#queManualModal').modal('show')
}

$('#queManualModal').on('show.bs.modal', function () {
    $.fn.zTree.init($('#treeHide'), hidesetting, [])
    hideMenu()
})

function sQue(pageNo) {
    if (!pageNo) pageNo = 1
    $('#ansList').tableAjaxLoader2(2)
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        url: encodeURI('../../question/getQueListByMode?pageSize=8&pageNo=' + pageNo + '&solutionType=1'),
        data: $('#search_Que').serialize(),
        success: function (data) {
            if (data.status === 0) {
                if (data.questionList.length > 0) {
                    var html = ''
                    var existIds = []
                    $('#queManual').find('input[name=postQueInput]').each(function () {
                        existIds.push($(this).attr('rel') * 1)
                    })
                    for (var i = 0; i < data.questionList.length; i++) {
                        //禁止列表中已经存在的问题被选择
                        if ($.inArray(data.questionList[i].Id, existIds) >= 0) {
                            html += '<tr id="list-tr-' + data.questionList[i].Id + '" hits="' + data.questionList[i].Hits + '">'
                            html += '<td><input disabled="" type="radio" name="row_sel1" value="' + data.questionList[i].Id + '" solutionId="' + data.questionList[i].SolutionId + '"></td>'
                            if (data.questionList[i].AnswerStatus == -4) {
                                html += '<td class="dueTd">' + data.questionList[i].Question + '<a class="btn btn-xs btn-danger m-l-5">已过期</a></td>'
                            } else {
                                html += '<td style="word-break: break-all;">' + data.questionList[i].Question + '</td>'
                            }
                            html += '</tr>'
                        } else {
                            html += '<tr id="list-tr-' + data.questionList[i].Id + '" hits="' + data.questionList[i].Hits + '">'
                            html += '<td><input type="radio" name="row_sel1" value="' + data.questionList[i].Id + '" solutionId="' + data.questionList[i].SolutionId + '"></td>'
                            if (data.questionList[i].AnswerStatus == -4) {
                                html += '<td class="dueTd">' + data.questionList[i].Question + '<a class="btn btn-xs btn-danger m-l-5">已过期</a></td>'
                            } else {
                                html += '<td style="word-break: break-all;">' + data.questionList[i].Question + '</td>'
                            }
                            html += '</tr>'
                        }
                    }
                    $('#ansList').find('tbody').html(html)
                    icheckInit()
                    $('#timePicker').on('ifChecked', function () {
                        $('#dateTime').show()
                    }).on('ifUnchecked', function () {
                        $('#dateTime').hide()
                        $('#ansRuleForm [name=StartTime]').val('')
                        $('#ansRuleForm [name=EndTime]').val('')
                    })
                    $('#ansList td').click(function () {
                        $(this).parent().find('input[name=row_sel1]:enabled').iCheck('check')
                    })
                    var options = {
                        currentPage: data.currentPage,
                        totalPages: data.totlePages,
                        onPageClicked: function (event, originalEvent, type, page) {
                            sQue(page)
                        }
                    }
                    setPage('quepageList', options)
                } else {
                    if ($('#search_Que input[name=question]').val() !== '') {
                        $('#ansList').find('tbody').html('<tr><td colspan="2" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;搜索结果为空！</td></tr>')
                    } else {
                        $('#ansList').find('tbody').html('<tr><td colspan="2" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>')
                    }
                    $('#quepageList').html('')
                }
            } else {
                yunNoty(data)
            }
        }
    })
}

function fQue(pageNo) {
    if (!pageNo) pageNo = 1
    $('#flowList').tableAjaxLoader2(2)
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        url: encodeURI('../../question/getQueListByMode?pageSize=8&pageNo=' + pageNo + '&solutionType=2'),
        data: $('#search_Que').serialize(),
        success: function (data) {
            if (data.status === 0) {
                if (data.questionList.length > 0) {
                    var html = ''
                    var existIds = []
                    $('#queManual').find('input[name=postQueInput]').each(function () {
                        existIds.push($(this).attr('rel') * 1)
                    })
                    for (var i = 0; i < data.questionList.length; i++) {
                        if ($.inArray(data.questionList[i].Id, existIds) >= 0) {
                            html += '<tr id="list-tr-' + data.questionList[i].Id + '" hits="' + data.questionList[i].Hits + '">'
                            html += '<td><input disabled="" type="radio" name="row_sel2" value="' + data.questionList[i].Id + '" solutionId="' + data.questionList[i].SolutionId + '"></td>'
                            if (data.questionList[i].AnswerStatus == -4) {
                                html += '<td class="dueTd">' + data.questionList[i].Question + '<a class="btn btn-xs btn-danger m-l-5">已过期</a></td>'
                            } else {
                                html += '<td style="word-break: break-all;">' + data.questionList[i].Question + '</td>'
                            }
                            html += '</tr>'
                        } else {
                            html += '<tr id="list-tr-' + data.questionList[i].Id + '" hits="' + data.questionList[i].Hits + '">'
                            html += '<td><input type="radio" name="row_sel2" value="' + data.questionList[i].Id + '" solutionId="' + data.questionList[i].SolutionId + '"></td>'
                            if (data.questionList[i].AnswerStatus == -4) {
                                html += '<td class="dueTd">' + data.questionList[i].Question + '<a class="btn btn-xs btn-danger m-l-5">已过期</a></td>'
                            } else {
                                html += '<td style="word-break: break-all;">' + data.questionList[i].Question + '</td>'
                            }
                            html += '</tr>'
                        }
                    }
                    $('#flowList').find('tbody').html(html)
                    icheckInit()
                    $('#timePicker').on('ifChecked', function () {
                        $('#dateTime').show()
                    }).on('ifUnchecked', function () {
                        $('#dateTime').hide()
                        $('#ansRuleForm [name=StartTime]').val('')
                        $('#ansRuleForm [name=EndTime]').val('')
                    })
                    $('#flowList td').click(function () {
                        $(this).parent().find('input[name=row_sel2]:enabled').iCheck('check')
                    })
                    var options = {
                        currentPage: data.currentPage,
                        totalPages: data.totlePages,
                        onPageClicked: function (event, originalEvent, type, page) {
                            fQue(page)
                        }
                    }
                    setPage('flowpageList', options)
                } else {
                    if ($('#search_Que input[name=question]').val() !== '') {
                        $('#flowList').find('tbody').html('<tr><td colspan="2" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;搜索结果为空！</td></tr>')
                    } else {
                        $('#flowList').find('tbody').html('<tr><td colspan="2" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>')
                    }
                    $('#flowpageList').html('')
                }
            } else {
                yunNoty(data)
            }
        }
    })
}