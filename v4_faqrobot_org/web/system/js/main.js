var This = this, style = 1, code = '', pageNo1 = 1, pageSize1 = 12, isJpage1 = 0, cosImgStyle = 1, wholeid = -1

$('.input-payCode input[type=text]').add('textarea').add('.goPage-addSrc input').on('focus', function () {
    $(this).select()
})

$('body').on('ifClicked', '.dir1', function () {
    $('.dir-payCode').text('距离浏览器左侧')
})

$('body').on('ifClicked', '.dir2', function () {
    $('.dir-payCode').text('距离浏览器右侧')
})

var clip = new ZeroClipboard($('.copy-payCode'))

clip.on('copy', function () {
    Base.gritter('复制文本成功', false)
})

var ue = UE.getEditor('editor', {
    toolbars: [['undo', 'redo', 'bold', 'italic', 'underline', 'strikethrough', 'source', 'pasteplain', 'selectall', 'preview', 'removeformat', 'time', 'date', 'cleardoc', 'fontfamily', 'fontsize', 'spechars', 'forecolor', 'backcolor', 'fullscreen', 'edittip ']],
    wordCount: true,
    maximumWords: 200
})

ue.addListener('ready', function (editor) {
    //ue.setContent('机器人客服')
    ue.execCommand('focus')
})

$(window).on('resize', function () {
    $('#edui1').css({
        width: '100%'
    })
})

$('#addCode').add('#editCode').on('click', function (e) {
    var url = 'ChatLink/add'
    if (e.target === $('#editCode')[0]) {
        url = 'ChatLink/edit'
    }
    switch (style) {
        case 1:
            var ctn = ue.getContent(), dis1 = $('input[name=mLeft]').val(), dis2 = $('input[name=mBtom]').val(),
                pageName = '', direction = ''
            $('input[name=pageName]').each(function () {
                if ($(this).is(':checked')) {
                    pageName = $(this).val()
                }
            })
            $('input[name=direction]').each(function () {
                if ($(this).is(':checked')) {
                    direction = $(this).val()
                }
            })
            var param1 = {
                info: ctn,
                editorValue: ctn,
                style: style,
                pageName: pageName,
                direction: direction,
                mLeft: dis1,
                mBtom: dis2,
                themeId: $('#enterReception').val()
            }
            if (e.target === $('#editCode')[0]) {
                param1.id = wholeid
            }
            if (ctn) {
                if (dis1) {
                    if (dis2) {
                        Base.request({
                            url: url,
                            params: param1,
                            callback: function (data) {
                                if (data.status) {
                                    Base.gritter(data.message, false)
                                } else {
                                    Base.gritter(data.message, true)
                                    $('#code-payCode').val(data.CODE)
                                    code = data.CODE
                                }
                            }
                        })
                    } else {
                        Base.gritter('请设置图标位置', false)
                    }
                } else {
                    Base.gritter('请设置图标位置', false)
                }
            } else {
                Base.gritter('请输入链接文字', false)
                ue.focus(true)
                $('body').scrollTop($('#editor').offset().top)
            }
            break

        case 2:
            var dis1 = $('input[name=mLeft]').val(), dis2 = $('input[name=mBtom]').val(), pageName = '', direction = '',
                picUrl = '', styleRdo = ''
            $('input[name=pageName]').each(function () {
                if ($(this).is(':checked')) {
                    pageName = $(this).val()
                }
            })
            $('input[name=direction]').each(function () {
                if ($(this).is(':checked')) {
                    direction = $(this).val()
                }
            })
            $('input[name=styleRdo]').each(function (i) {
                if ($(this).is(':checked')) {
                    styleRdo = $(this).val()
                    picUrl = $('.picUrl').eq(i).attr('src')
                }
            })
            var param2 = {
                style: style,
                pageName: pageName,
                direction: direction,
                mLeft: dis1,
                mBtom: dis2,
                picUrl: picUrl,
                styleRdo: styleRdo,
                themeId: $('#enterReception').val()
            }
            if (e.target === $('#editCode')[0]) {
                param2.id = wholeid
            }
            if (dis1) {
                if (dis2) {
                    Base.request({
                        url: url,
                        params: param2,
                        callback: function (data) {
                            if (data.status) {
                                Base.gritter(data.message, false)
                            } else {
                                Base.gritter(data.message, true)
                                $('#code-payCode').val(data.CODE)
                                code = data.CODE
                            }
                        }
                    })
                } else {
                    Base.gritter('请设置图标位置', false)
                }
            } else {
                Base.gritter('请设置图标位置', false)
            }
            break

        case 3:
            var dis1 = $('input[name=mLeft]').val(), dis2 = $('input[name=mBtom]').val(), pageName = '', direction = '',
                picUrl = '', styleR = ''
            $('input[name=pageName]').each(function () {
                if ($(this).is(':checked')) {
                    pageName = $(this).val()
                }
            })
            $('input[name=direction]').each(function () {
                if ($(this).is(':checked')) {
                    direction = $(this).val()
                }
            })
            $('input[name=styleR]').each(function (i) {
                if ($(this).is(':checked')) {
                    styleR = $(this).val()
                    picUrl = $('.picUrl2').eq(i).attr('src')
                }
            })
            var param3 = {
                style: style,
                pageName: pageName,
                direction: direction,
                mLeft: dis1,
                mBtom: dis2,
                picUrl: picUrl,
                styleR: styleR,
                themeId: $('#enterReception').val()
            }
            if (e.target === $('#editCode')[0]) {
                param3.id = wholeid
            }
            if (dis1) {
                if (dis2) {
                    Base.request({
                        url: url,
                        params: param3,
                        callback: function (data) {
                            if (data.status) {
                                Base.gritter(data.message, false)
                            } else {
                                Base.gritter(data.message, true)
                                $('#code-payCode').val(data.CODE)
                                code = data.CODE
                            }
                        }
                    })
                } else {
                    Base.gritter('请设置图标位置', false)
                }
            } else {
                Base.gritter('请设置图标位置', false)
            }
            break

        case 4:
            var dis1 = $('input[name=mLeft]').val(), dis2 = $('input[name=mBtom]').val(),
                width = $('input[name=width]').val(), height = $('input[name=height]').val(), pageName = '',
                direction = '', picUrl = $('.cosImg-payCode img').attr('src')
            kfPic = $('.cosImg-payCode1 img').attr('src')
            khPic = $('.cosImg-payCode2 img').attr('src')
            mode = ''
            $('input[name=pageName]').each(function () {
                if ($(this).is(':checked')) {
                    pageName = $(this).val()
                }
            })
            $('input[name=direction]').each(function () {
                if ($(this).is(':checked')) {
                    direction = $(this).val()
                }
            })
            $('input[name=mode]').each(function (i) {
                if ($(this).is(':checked')) {
                    mode = $(this).val()
                }
            })
            var param4 = {
                style: style,
                pageName: pageName,
                direction: direction,
                mLeft: dis1,
                mBtom: dis2,
                picUrl: picUrl,
                mode: mode,
                width: width,
                height: height,
                kfPic: kfPic,
                khPic: khPic,
                themeId: $('#enterReception').val()
            }
            if (e.target === $('#editCode')[0]) {
                param4.id = wholeid
            }
            if (dis1) {
                if (dis2) {
                    Base.request({
                        url: url,
                        params: param4,
                        callback: function (data) {
                            if (data.status) {
                                Base.gritter(data.message, false)
                            } else {
                                Base.gritter(data.message, true)
                                $('#code-payCode').val(data.CODE)
                                code = data.CODE
                            }
                        }
                    })
                } else {
                    Base.gritter('请设置图标位置', false)
                }
            } else {
                Base.gritter('请设置图标位置', false)
            }
            break
    }
})

$('.prev-payCode').on('click', function () {
    $('.iyunwen_js_class').remove()
    $('body').append(code)
})

function initSrc () {
    Base.request({
        url: 'material/list',
        params: {
            type: 1,
            pageNo: pageNo1,
            pageSize: pageSize1
        },
        callback: function (data) {
            if (data.status) {
                Base.gritter(data.message, false)
            } else {
                var html = ''
                if (data.list[0]) {
                    for (var i = 0; i < data.list.length; i++) {
                        html += '<span class="imgGallery" Id="' + data.list[i].Id + '"><img src="../../' + data.list[i].Path + '" alt="' + data.list[i].Name + '" title="' + data.list[i].Name + '"></span>'
                    }
                    var options = {
                        currentPage: data.currentPage,
                        totalPages: data.totlePages ? data.totlePages : 1,
                        alignment: 'right',
                        onPageClicked: function (event, originalEvent, type, page) {
                            pageNo1 = page
                            initSrc()
                        }
                    }
                    $('#itemContainer').bootstrapPaginator(options)
                } else {
                    html += '<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>'
                    $('#itemContainer').empty()
                }
                $('.loadImg-payCode').empty().append(html)
            }
        }
    })
}

$('.goPage-addSrc a').on('click', function () {
    $('.holder').jPages(parseInt($('.goPage-addSrc input').val()))
    return false
})

$('.cosImgBtn-payCode').on('click', function () {
    cosImgStyle = 1
    initSrc()
})

$('.cosImgBtn-payCode1').on('click', function () {
    cosImgStyle = 2
    initSrc()
})

$('.cosImgBtn-payCode2').on('click', function () {
    cosImgStyle = 3
    initSrc()
})

$('body').on('click', '.imgGallery', function () {
    switch (cosImgStyle) {
        case 1:
            $('.cosImg-payCode').empty().append($('img', $(this)).clone())
            var pic = new Image()
            pic.onload = function () {
                $('[name=width]').val(pic.width)
                $('[name=height]').val(pic.height)
            }
            pic.src = $('img', $(this)).attr('src')
            break

        case 2:
            $('.cosImg-payCode1').empty().append($('img', $(this)).clone())
            break

        case 3:
            $('.cosImg-payCode2').empty().append($('img', $(this)).clone())
            break
    }
    $('#modal-dialog').modal('hide')
})

$('.tabClick-addSrc').each(function (i) {
    $(this).on('click', function () {
        $('.iyunwen_js_class').remove()
        style = i + 1
        if (i == 4) {
            $('.itemCtner').hide()
            $('.m').show()
            initSrc1()
        } else {
            $('.itemCtner').show()
            $('.m').hide()
        }
        $('#code-payCode').val('')
    })
})

var pageNo = 1, pageSize = 10, name = '', isJpage = 0, orderType = 2

function initSrc1 () {
    Base.request({
        url: 'ChatLink/list',
        params: {
            orderType: orderType,
            pageNo: pageNo,
            pageSize: pageSize
        },
        callback: function (data) {
            if (data.status) {
                Base.gritter(data.message, false)
            } else {
                var html = ''
                if (data.list[0]) {
                    for (var i = 0; i < data.list.length; i++) {
                        var str = ''
                        if (data.list[i].Level) {
                            str = '<a href="configuration.html?id=' + data.list[i].Id + '"><i class="timeTip one-note-payCode glyphicon glyphicon-asterisk" title="页面备注修改"></i></a>'
                        } else {
                            str = '<a><i class="timeTip one-del-payCode glyphicon glyphicon-trash" title="删除"></i></a>'
                        }
                        switch (data.list[i].Style) {
                            case 1:
                                html += '<tr Id="' + data.list[i].Id + '" VisitUrl="' + data.list[i].VisitUrl + '"><td><div title="' + data.list[i].Info + '">' + data.list[i].Info + '</div></td><td>链接式</td><td>静态文本<td>' + (data.list[i].DescInfo || '') + '</td><td><a><i class="timeTip previewBtn glyphicon glyphicon-eye-open" title="预览"></i></a><a><i class="timeTip editBtn glyphicon glyphicon-pencil" title="编辑"></i>' + str + '</a><a><i class="timeTip getCodeBtn glyphicon glyphicon-hand-up" title="获取代码" href="#modal-getCode" data-toggle="modal"></i></a></td></tr>'
                                break

                            case 2:
                                html += '<tr Id="' + data.list[i].Id + '" VisitUrl="' + data.list[i].VisitUrl + '"><td><img src="' + data.list[i].PicUrl + '" alt="' + data.list[i].PageName + '" title="' + data.list[i].PageName + '"></td><td>图标式</td><td>静态图片<td>' + (data.list[i].DescInfo || '') + '</td><td><a><i class="timeTip previewBtn glyphicon glyphicon-eye-open" title="预览"></i></a><a><i class="timeTip editBtn glyphicon glyphicon-pencil" title="编辑"></i>' + str + '</a><a><i class="timeTip getCodeBtn glyphicon glyphicon-hand-up" title="获取代码" href="#modal-getCode" data-toggle="modal"></i></a></td></tr>'
                                break

                            case 3:
                                html += '<tr Id="' + data.list[i].Id + '" VisitUrl="' + data.list[i].VisitUrl + '"><td><img src="' + data.list[i].PicUrl + '" alt="' + data.list[i].PageName + '" title="' + data.list[i].PageName + '"></td><td>浮窗式</td><td>漂浮图片<td>' + (data.list[i].DescInfo || '') + '</td><td><a><i class="timeTip previewBtn glyphicon glyphicon-eye-open" title="预览"></i></a><a><i class="timeTip editBtn glyphicon glyphicon-pencil" title="编辑"></i>' + str + '</a><a><i class="timeTip getCodeBtn glyphicon glyphicon-hand-up" title="获取代码" href="#modal-getCode" data-toggle="modal"></i></a></td></tr>'
                                break

                            case 4:
                                var iconStyle = '静态图片'
                                if (data.list[i].Mode) {
                                    iconStyle = '漂浮图片'
                                }
                                html += '<tr Id="' + data.list[i].Id + '" VisitUrl="' + data.list[i].VisitUrl + '"><td><img src="' + data.list[i].PicUrl + '" alt="' + data.list[i].PageName + '" title="' + data.list[i].PageName + '"></div></td><td>自定义</td><td>' + iconStyle + '<td>' + (data.list[i].DescInfo || '') + '</td><td><a><i class="previewBtn glyphicon glyphicon-eye-open" title="预览"></i></a><a><i class="timeTip editBtn glyphicon glyphicon-pencil" title="编辑"></i>' + str + '</a><a><i class="timeTip getCodeBtn glyphicon glyphicon-hand-up" title="获取代码" href="#modal-getCode" data-toggle="modal"></i></a></td></tr>'
                                break
                        }
                    }
                    var options = {
                        data: [data, 'list', 'total'],
                        currentPage: data.currentPage,
                        totalPages: data.totlePages ? data.totlePages : 1,
                        alignment: 'right',
                        onPageClicked: function (event, originalEvent, type, page) {
                            pageNo = page
                            initSrc1()
                        }
                    }
                    $('#itemContainer1').bootstrapPaginator(options)
                    $('#itemContainer1').css({
                        width: '100%'
                    })
                    $('#itemContainer1 ul').css({
                        'float': 'right'
                    })
                } else {
                    html += '<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>'
                    $('#itemContainer1').empty()
                }
                $('.table tbody').empty().append(html)
                $('.timeTip').tooltip()
            }
        }
    })
}

$('body').on('click', '.previewBtn', function () {
    var $tr = $(this).parents('tr'), visiturl = $tr.attr('visiturl')
    var tmpId = $tr.attr('id')
    if (tmpId >= 5418 && tmpId <= 5745) {
        visiturl = '<!-- FAQRobot Button BEGIN -->    <script src=\'http://' + window.location.host + '/robot/skin/zbj/priview/14435836731645796_' + tmpId + '.js\' language=\'JavaScript\'>    </script><!-- FAQRobot Button END   -->'
    }
    $('.iyunwen_js_class').remove()
    $('body').append(visiturl)
})

$('body').on('click', '.editBtn', function () {
    $('#editCode').show()
    var $tr = $(this).parents('tr'), id = $tr.attr('id')
    wholeid = id
    Base.request({
        url: 'ChatLink/getById',
        params: {
            id: id
        },
        callback: function (data) {
            if (data.status) {
                Base.gritter(data.message, false)
            } else {
                Base.gritter(data.message, true)
                var style = data.logo.Style
                $('.tabClick-addSrc').eq(style - 1).trigger('click')
                switch (style) {
                    case 1:
                        ue.setContent(data.logo.Info)
                        $('input[name=mLeft]').val(data.logo.Mleft)
                        $('input[name=mBtom]').val(data.logo.Mbtom)
                        $('input[name=pageName]').each(function () {
                            if ($(this).val() == data.logo.PageName) {
                                $(this).iCheck('check')
                            }
                        })
                        $('input[name=direction]').each(function () {
                            if ($(this).val() == data.logo.Direction) {
                                $(this).iCheck('check')
                            }
                        })
                        $('.code-payCode').val(data.logo.VisitUrl)
                        break

                    case 2:
                        $('input[name=styleRdo]').each(function () {
                            if ($(this).val() == data.logo.Mode) {
                                $(this).iCheck('check')
                            }
                        })
                        $('input[name=mLeft]').val(data.logo.Mleft)
                        $('input[name=mBtom]').val(data.logo.Mbtom)
                        $('input[name=pageName]').each(function () {
                            if ($(this).val() == data.logo.PageName) {
                                $(this).iCheck('check')
                            }
                        })
                        $('input[name=direction]').each(function () {
                            if ($(this).val() == data.logo.Direction) {
                                $(this).iCheck('check')
                            }
                        })
                        $('.code-payCode').val(data.logo.VisitUrl)
                        break

                    case 3:
                        $('input[name=styleR]').each(function () {
                            if ($(this).val() == data.logo.Mode) {
                                $(this).iCheck('check')
                            }
                        })
                        $('input[name=mLeft]').val(data.logo.Mleft)
                        $('input[name=mBtom]').val(data.logo.Mbtom)
                        $('input[name=pageName]').each(function () {
                            if ($(this).val() == data.logo.PageName) {
                                $(this).iCheck('check')
                            }
                        })
                        $('input[name=direction]').each(function () {
                            if ($(this).val() == data.logo.Direction) {
                                $(this).iCheck('check')
                            }
                        })
                        $('.code-payCode').val(data.logo.VisitUrl)
                        break

                    case 4:
                        $('input[name=mode]').each(function () {
                            if ($(this).val() == data.logo.Mode) {
                                $(this).iCheck('check')
                            }
                        })
                        $('input[name=mLeft]').val(data.logo.Mleft)
                        $('input[name=mBtom]').val(data.logo.Mbtom)
                        $('input[name=pageName]').each(function () {
                            if ($(this).val() == data.logo.PageName) {
                                $(this).iCheck('check')
                            }
                        })
                        $('input[name=direction]').each(function () {
                            if ($(this).val() == data.logo.Direction) {
                                $(this).iCheck('check')
                            }
                        })
                        $('.cosImg-payCode img').attr({
                            src: data.logo.PicUrl
                        })
                        $('.cosImg-payCode1 img').attr({
                            src: data.logo.KfPic
                        })
                        $('.cosImg-payCode2 img').attr({
                            src: data.logo.KhPic
                        })
                        $('.code-payCode').val(data.logo.VisitUrl)
                        break
                }
            }
        }
    })
})

$('body').on('click', '.one-del-payCode', function () {
    var $tr = $(this).parents('tr'), id = $tr.attr('Id')
    Base.request({
        url: 'ChatLink/delete',
        params: {
            id: id
        },
        callback: function (data) {
            if (data.status) {
                Base.gritter(data.message, false)
            } else {
                Base.gritter(data.message, true)
                if ($('.one-del-payCode').length == 1) {
                    if (pageNo >= 2) {
                        pageNo -= 1
                    }
                }
                initSrc1()
            }
        }
    })
})

$('body').on('click', '.one-note-payCode', function () {
    var $tr = $(this).parents('tr'), id = $tr.attr('Id')
})

$('body').on('click', '.getCodeBtn', function () {
    var $tr = $(this).parents('tr'), visiturl = $tr.attr('visiturl')
    $('.getCodeInput').val(visiturl)
})

$('.simSort1').on('click', function () {
    $('.sortWord').html($(this).text() + '<span class="caret"></span>')
    orderType = 1
    pageNo = 1
    initSrc1()
})

$('.simSort2').on('click', function () {
    $('.sortWord').html($(this).text() + '<span class="caret"></span>')
    orderType = 2
    pageNo = 1
    initSrc1()
})

$('.simSort3').on('click', function () {
    $('.sortWord').html($(this).text() + '<span class="caret"></span>')
    orderType = 3
    pageNo = 1
    initSrc1()
})

$('.simSort4').on('click', function () {
    $('.sortWord').html($(this).text() + '<span class="caret"></span>')
    orderType = 4
    pageNo = 1
    initSrc1()
})

$('.goPage-addSrc a').on('click', function () {
    $('.holder').jPages(parseInt($('.goPage-addSrc input').val()))
    return false
})

$(document).ready(function () {
    $.ajax({
        type: 'get',
        datatype: 'json',
        cache: false,
        //不从缓存中去数据
        url: encodeURI('../../ChatLink/listChatLink?pageSize=100&pageNo=1'),
        success: function (data) {
            if (data.status == 0) {
                if (data.list == undefined) {
                    // $('#pageList').html('');
                    return
                }
                if (data.list.length > 0) {
                    data.list.forEach(function (el) {
                        $('#enterReception').append('<option value="' + el.Id + '">' + el.ThemeName + '</option>')
                    })
                }
            }
        }
    })
    iframeTab.init({
        iframeBox: ''
    })
//	$('.iconImgSel1').hide();
//	$('.iconImgSel2').hide();
//	$('.iconImgSel3').hide();
    //先判断渠道
    $.getJSON('../../Configuration/showSourceByWebId', function (data) {
        data.listSource.forEach(function (el) {
            if (el.DicCode === 0) {
                $('.iconImgSel1').show()
            }
            if (el.DicCode === 1) {
                $('.iconImgSel2').show()
            }
            if (el.DicCode === 3) {
                $('.iconImgSel3').show()
            }
        })
    })
    if (getUrlParam('id')) {
        wholeid = getUrlParam('id')
        $('#editCode').show()
        Base.request({
            url: 'ChatLink/getById',
            params: {
                id: getUrlParam('id')
            },
            callback: function (data) {
                if (data.status) {
                    Base.gritter(data.message, false)
                } else {
                    Base.gritter(data.message, true)
                    var style = data.logo.Style
                    $('.tabClick-addSrc').eq(style - 1).trigger('click')
                    switch (style) {
                        case 1:
                            // ue.addListener('ready', function (editor) {
                            //     ue.setContent(data.logo.Info)
                            // })
                            //ready初始化有时无法回填改为延时0.5s回填
                            setTimeout(() => {
                                ue.setContent(data.logo.Info)
                            }, 500);
                            $('input[name=mLeft]').val(data.logo.Mleft)
                            $('input[name=mBtom]').val(data.logo.Mbtom)
                            $('input[name=pageName]').each(function () {
                                if ($(this).val() == data.logo.PageName) {
                                    $(this).iCheck('check')
                                }
                            })
                            $('input[name=direction]').each(function () {
                                if ($(this).val() == data.logo.Direction) {
                                    $(this).iCheck('check')
                                }
                            })
                            $('.code-payCode').val(data.logo.VisitUrl)
                            break

                        case 2:
                            $('input[name=styleRdo]').each(function () {
                                if ($(this).val() == data.logo.Mode) {
                                    $(this).iCheck('check')
                                }
                            })
                            $('input[name=mLeft]').val(data.logo.Mleft)
                            $('input[name=mBtom]').val(data.logo.Mbtom)
                            $('input[name=pageName]').each(function () {
                                if ($(this).val() == data.logo.PageName) {
                                    $(this).iCheck('check')
                                }
                            })
                            $('input[name=direction]').each(function () {
                                if ($(this).val() == data.logo.Direction) {
                                    $(this).iCheck('check')
                                }
                            })
                            $('.code-payCode').val(data.logo.VisitUrl)
                            break

                        case 3:
                            $('input[name=styleR]').each(function () {
                                if ($(this).val() == data.logo.Mode) {
                                    $(this).iCheck('check')
                                }
                            })
                            $('input[name=mLeft]').val(data.logo.Mleft)
                            $('input[name=mBtom]').val(data.logo.Mbtom)
                            $('input[name=pageName]').each(function () {
                                if ($(this).val() == data.logo.PageName) {
                                    $(this).iCheck('check')
                                }
                            })
                            $('input[name=direction]').each(function () {
                                if ($(this).val() == data.logo.Direction) {
                                    $(this).iCheck('check')
                                }
                            })
                            $('.code-payCode').val(data.logo.VisitUrl)
                            break

                        case 4:
                            $('input[name=mode]').each(function () {
                                if ($(this).val() == data.logo.Mode) {
                                    $(this).iCheck('check')
                                }
                            })
                            $('input[name=mLeft]').val(data.logo.Mleft)
                            $('input[name=mBtom]').val(data.logo.Mbtom)
                            $('input[name=pageName]').each(function () {
                                if ($(this).val() == data.logo.PageName) {
                                    $(this).iCheck('check')
                                }
                            })
                            $('input[name=direction]').each(function () {
                                if ($(this).val() == data.logo.Direction) {
                                    $(this).iCheck('check')
                                }
                            })
                            $('.cosImg-payCode img').attr({
                                src: data.logo.PicUrl
                            })
                            $('.cosImg-payCode1 img').attr({
                                src: data.logo.KfPic
                            })
                            $('.cosImg-payCode2 img').attr({
                                src: data.logo.KhPic
                            })
                            $('.code-payCode').val(data.logo.VisitUrl)
                            break
                    }
                    if (data.logo.PageName == 'appChat') {
                        $('[href="#app-tab"]').trigger('click')
                    } else if (data.logo.PageName == 'wxChat') {
                        $('[href="#wx-tab"]').trigger('click')
                    }
                    if (data.logo.ThemeId) {
                        setTimeout(function () {
                            $('#enterReception').val(data.logo.ThemeId)
                        }, 500)
                    }
                }
            }
        })
    }
})
