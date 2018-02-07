var nav = null
window.htmlSAVE = []
var LEFT_SIDEBAR_WIDTH = '200px'

//根据改动后的导航栏修改右侧content的位置
var handleContentNav = function () {
    if ($(window).width() > 768) {
        $('#contentNav').css('margin-left', $('#sidebar').outerWidth() + $('#sidebarLeft').outerWidth())
        //$('#contentNav').animate({'margin-left': $('#sidebar').outerWidth()}, 'fast');
    } else {
        $('#contentNav').css('margin-left', '8px')
    }
}

var expandSideBar = function () {
    $('#sidebarLeft').width(LEFT_SIDEBAR_WIDTH)
    $('#sidebarLeftInner').show()
    $('#sidebarLeft').removeClass('sidebarLeftMin')
}

var collapseSideBar = function () {
    $('#sidebarLeft').width('8px')
    $('#sidebarLeftInner').hide()
    $('#sidebarLeft').addClass('sidebarLeftMin')
}

//单击一级菜单栏改变二级菜单栏
var handleChangeHTML = function () {
    $('[data-changeSide]').click(function () {
        var self = this
        //去除一级菜单高亮
        $('li.has-sub').removeClass('active')
        //给自己的父级li添加高亮
        $(self).closest('li').addClass('active')
        //确定二级菜单的高度
        $('#sidebarLeftInner').height($('#sidebarLeft').innerHeight() - 64)
        //如果是平台对接，插入一个隐藏的锚点
        if ($(self).data('changeside') == 5) {
            //隐藏掉
            window.htmlSAVE[5] += '<a class="hide" href="web/platform/apiList.html" data-num="0" data-reload="ja">平台对接</a>'
        }
        //插入对应的二级菜单
        $('#sidebarLeftInner').empty().html(window.htmlSAVE[$(self).data('changeside')])
        //二级菜单生成滚动条
        $('#sidebarLeftInner').slimScroll({
            height: $('#sidebarLeftInner').height(),
            position: 'left',
            color: '#ffffff'
        })
        $('#sidebarLeftInner a[data-num]').click(function () {
            $('#sidebarLeftInner a[data-num]').removeClass('active')
            $(this).addClass('active')
            /*
            * 打开“智能学习”和“未知问题”页面初始化sessionStorage中的groupId值
            * 由于这两页面需要通过sessionStorge中的groupId来记录用户操作，所以页面进入时需要初始化
            */
            if($(this).attr('href').indexOf("intelLearnList")>-1){
                sessionStorage.setItem('intel_groupId',0);
                sessionStorage.setItem('intel_pageNo',1);
            }
            if($(this).attr('href').indexOf("unknowQueNew")>-1){
                sessionStorage.setItem('unknow_groupId',0);
                sessionStorage.setItem('unknow_pageNo',1);
            }
            
        })
        if ($(self).data('changeside') == 0) {
            //首页默认打开首页并隐藏二级菜单
            $('a[href="web/home/home.html"]').trigger('click')
            if (!$('#sidebarLeft').hasClass('sidebarLeftMin')) {
                collapseSideBar()
            }
        } else if ($(self).data('changeside') === 1) {
            //知识库默认打开问答总览
            $('a[href="web/knowledge/queView.html"]').trigger('click')
            if ($('#sidebarLeft').hasClass('sidebarLeftMin')) {
                expandSideBar()
            }
        } else if ($(self).data('changeside') === 2) {
            //跳转到添加素材
            $('a[href="web/material/addSrc.html"]').trigger('click')
            if ($('#sidebarLeft').hasClass('sidebarLeftMin')) {
                expandSideBar()
            }
        } else if ($(self).data('changeside') === 3) {
            //跳转到企业信息
            $('a[href="web/system/company.html"]').trigger('click')
            if ($('#sidebarLeft').hasClass('sidebarLeftMin')) {
                expandSideBar()
            }
        } else if ($(self).data('changeside') === 4) {
            //跳转到总体次数统计
            $('a[href="web/data/visitData.html"]').trigger('click')
            if ($('#sidebarLeft').hasClass('sidebarLeftMin')) {
                expandSideBar()
            }
        } else if ($(self).data('changeside') === 6) {
            //跳转到用户列表
            $('a[href="web/staff/userList.html"]').trigger('click')
            if ($('#sidebarLeft').hasClass('sidebarLeftMin')) {
                expandSideBar()
            }
        } else if ($(self).data('changeside') === 5 && $(self).attr('title') == '平台对接') {
            //平台对接并隐藏二级菜单
            if (window.location.host != 'v3.faqrobot.org') {
                $('a[href="web/platform/apiList.html"]').trigger('click')
                if ($('#sidebarLeft').hasClass('sidebarLeftMin')) {
                    //collapseSideBar();
                    expandSideBar()
                }
            } else {
                $('a[href="web/platform/wechatListYun.html"]').trigger('click')
                expandSideBar()
            }

        } else if ($(self).data('changeside') === 7) {
            //帮助默认打开帮助并隐藏二级菜单
            $('a[href="web/help/help.html"]').trigger('click')
            if (!$('#sidebarLeft').hasClass('sidebarLeftMin')) {
                collapseSideBar()
            }
        } else {
            //一级菜单栏收缩时展示tooltip
            var t = 'page-sidebar-minified'
            var n = '#page-container'
            // if (!$(n).hasClass(t)) {
            // 	//如果一级菜单没有收缩，自动收缩
            //   $(n).addClass(t);
            //   $('[data-toggle=tooltip]').tooltip();
            // }
            if ($('#sidebarLeft').hasClass('sidebarLeftMin')) {
                expandSideBar()
            }
        }
        handleContentNav()
    })
}
var handleMobileSidebarToggle = function () {
    var e = false
    $('.sidebar').on('click touchstart',
        function (t) {
            if ($(t.target).closest('.sidebar').length !== 0) {
                e = true
            } else {
                e = false
                t.stopPropagation()
            }
        })
    $(document).on('click touchstart',
        function (t) {
            if ($(t.target).closest('.sidebar').length === 0) {
                e = false
            }
            if (!t.isPropagationStopped() && e !== true) {
                if ($('#page-container').hasClass('page-sidebar-toggled')) {
                    $('#page-container').removeClass('page-sidebar-toggled')
                }
                if ($(window).width() < 979) {
                    if ($('#page-container').hasClass('page-with-two-sidebar')) {
                        $('#page-container').removeClass('page-right-sidebar-toggled')
                    }
                }
            }
        })
    $('[data-click=right-sidebar-toggled]').click(function (e) {
        e.stopPropagation()
        var t = '#page-container'
        var n = 'page-right-sidebar-collapsed'
        n = $(window).width() < 979 ? 'page-right-sidebar-toggled' : n
        if ($(t).hasClass(n)) {
            $(t).removeClass(n)
        } else {
            $(t).addClass(n)
        }
        if ($(window).width() < 480) {
            $('#page-container').removeClass('page-sidebar-toggled')
        }
    })
    $('[data-click=sidebar-toggled]').click(function (e) {
        e.stopPropagation()
        var t = 'page-sidebar-toggled'
        var n = '#page-container'
        if ($(n).hasClass(t)) {
            $(n).removeClass(t)
        } else {
            $(n).addClass(t)
        }
        if ($(window).width() < 480) {
            $('#page-container').removeClass('page-right-sidebar-toggled')
        }
    })
}
var handleSidebarMinifyLeft = function () {
    $('[data-click=sidebar-minify-left]').click(function (e) {
        e.preventDefault()
        if ($('#sidebarLeft').hasClass('sidebarLeftMin')) {
            expandSideBar()
        } else {
            collapseSideBar()
        }
        handleContentNav()
        $(window).trigger('resize')
    })
}
var handleSidebarMinify = function () {
    $('[data-click=sidebar-minify]').click(function (e) {
        e.preventDefault()
        var t = 'page-sidebar-minified'
        var n = '#page-container'
        if ($(n).hasClass(t)) {
            $(n).removeClass(t)
            $('#dedentg').attr('src', 'web/common/images/fa-dedent.png')
            $('.navbar-brand').html('<img src="web/common/images/logo.jpg" class="navbar-logo">FAQ Robot')
            $('.navbar-brand').css('width', '174px').css('padding', '10px').css('margin-right', '10px')
            $('.navbar-logo').css('margin-left', '0px')
            $('[data-toggle=tooltip]').tooltip('destroy')
            /**
             * 判断是否展示logo
             */
            changeShowLogo()
        } else {
            $(n).addClass(t)
            $('#dedentg').attr('src', 'web/common/images/fa-indent.png')
            $('.navbar-brand').html('<img src="web/common/images/logo.jpg" class="navbar-logo">')
            $('.navbar-brand').css('width', '58px').css('padding', '10px 5px').css('margin-right', '0px')
            $('.navbar-logo').css('margin-left', '5px')
            $('[data-toggle=tooltip]').tooltip()
            changeShowLogo()
        }
        handleContentNav()
        $(window).trigger('resize')
    })
}

function changeShowLogo() {
  var isShowLogoValue = sessionStorage.getItem('showLogoValue');
  if(isShowLogoValue && isShowLogoValue==0){
    $('.navbar-brand').empty();
  }
}


var handlePageContentView = function () {
    'use strict'
    $.when($('#page-loader').addClass('hide')).done(function () {
        $('#page-container').addClass('in')
    })
}

$(function () {
    //页面初始化时，左侧一级菜单收起
    $('#page-container').addClass('page-sidebar-minified')
    $('#dedentg').attr('src', 'web/common/images/fa-indent.png')
    // $('.navbar-brand').html('<img src="web/common/images/logo.jpg" class="navbar-logo">')
    $('.navbar-brand').css('width', '58px').css('padding', '10px 5px').css('margin-right', '0px')
    $('.navbar-logo').css('margin-left', '5px')
    $('[data-toggle=tooltip]').tooltip()

    handleMobileSidebarToggle()
    handleContentNav()
    handleSidebarMinify()
    handleSidebarMinifyLeft()
    handlePageContentView()
    var This = this
    //浏览器缩放
    $(window).on('resize', function () {
        setContentH() //content高度
        handleContentNav()
    })

    //content高度
    function setContentH () {
        $('#contentNav').height($('body').outerHeight() - $('#header').outerHeight())
        $('#tabBody').height($('#contentNav').outerHeight() - $('.tabs-header').outerHeight())
    }

    //tabs左右调节位置
    $('#toRight').click(function () {
        var widthTotal = 0,
            widthContainer = $('.tabs-header').outerWidth(true) - $('#toRight').outerWidth(true) - $('#toLeft').outerWidth(true),
            widthMove = 100,
            realMove = 0,
            translateBefore = 0
        $('.tabs-header li').each(function () {
            widthTotal += $(this).outerWidth(true)
        })
        translateBefore = getTransformX($('#tabs-ul'))
        if (translateBefore) {
            realMove = widthTotal + getTransformX($('#tabs-ul')) - widthContainer
        } else {
            realMove = widthTotal - widthContainer
            translateBefore = 0
        }
        if (realMove - widthMove > 0) {
            $('#tabs-ul').css('transform', 'translateX(-' + (widthMove - translateBefore) + 'px)')
        } else {
            $('#tabs-ul').css('transform', 'translateX(-' + (realMove - translateBefore) + 'px)')
        }
    })
    $('#toLeft').click(function () {
        var translateBefore = 0,
            widthMove = -100
        translateBefore = getTransformX($('#tabs-ul'))
        if (translateBefore) {
            if (translateBefore - widthMove < 0) {
                $('#tabs-ul').css('transform', 'translateX(-' + (widthMove - translateBefore) + 'px)')
            } else {
                $('#tabs-ul').css('transform', 'translateX(0px)')
            }
        }
    })
    $('body').on('click', 'a[href="web/knowledge/queView.html"]', function () {
        if (sessionStorage) {
            sessionStorage.setItem('qv_pageNo', 1)
            sessionStorage.setItem('qv_groupId', 0)
            sessionStorage.setItem('qv_answerStatus', '')
            sessionStorage.setItem('qv_status', '')
            sessionStorage.setItem('qv_queryType', '')
            sessionStorage.setItem('qv_solutionType', '')
            sessionStorage.setItem('qv_searchStr', 'question=')
            sessionStorage.setItem('qv_queStr', '')
            sessionStorage.setItem('qv_sortWord', '')
            sessionStorage.setItem('qv_sortWord2', '')
            sessionStorage.setItem('qv_solutionTypeWord', '')
            sessionStorage.setItem('pp_selectedNodeId', '')
        }
    })

    function getTransformX (obj) {
        var transformMatrix = obj.css('-webkit-transform') ||
            obj.css('-moz-transform') ||
            obj.css('-ms-transform') ||
            obj.css('-o-transform') ||
            obj.css('transform')
        var matrix = transformMatrix.replace(/[^0-9\-.,]/g, '').split(',')
        var x = matrix[12] || matrix[4] //translate x
        return parseInt(x)
    }

    $('#buyTable').slimScroll({
        height: '400px'
    })

    var hdnWebId = ''
    var cosTrade = 0
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false, //不从缓存中去数据
        url: encodeURI('user/getLoginUser'),
        success: function (data) {
            if (data.status === 0) {
                if (data.loginUser) {
                    if (data.loginUser.UserName) {
                        $('#userName').html(data.loginUser.UserName)
                    }
                    if (data.loginUser.WebId) {
                        hdnWebId = data.loginUser.WebId
                        sessionStorage.setItem('Wid', data.loginUser.WebId)
                    }
                    if (data.webConfig.SysNum) {
                        sessionStorage.setItem('sysNum', data.webConfig.SysNum)
                    }
                    if (data.loginUser.Level || data.loginUser.Level == 0) {
                        sessionStorage.setItem('level', data.loginUser.Level)
                    }
                    // 菜单
                    if (data.loginUser.SystemMenus) {
                        var html = '',
                            faArr = ['fa-laptop', 'fa-key', 'fa-file-text-o', 'fa-cog', 'fa-line-chart', 'fa-codepen', 'fa-male', 'fa-gavel', 'fa-clock-o', 'fa-cogs', 'fa-qrcode']
                        if (data.loginUser.SystemMenus[0]) {
                            for (var i = 0; i < data.loginUser.SystemMenus.length; i++) {
                                window.htmlSAVE[i] = ''
                                for (var j = 0; j < data.loginUser.SystemMenus[i].ModuleMenus.length; j++) {
                                    var __html = ''
                                    for (var k = 0; k < data.loginUser.SystemMenus[i].ModuleMenus[j].PageMenus.length; k++) {
                                        var NewUrl = data.loginUser.SystemMenus[i].ModuleMenus[j].PageMenus[k].NewUrl
                                        if (NewUrl && !(NewUrl.indexOf('#') + 1)) {
                                            //data-parent存这个锚点属于第几个模块
                                            /*
                                            * taskId = 747 动态配置页面标题和面包屑 by 司徒棋巽
                                            */
                                            __html += '<li><a href="' + NewUrl + '" data-parent="' + i + '" data-me="' + j + k + '" data-num="0" data-reload="ja" data-firstLevel="' + data.loginUser.SystemMenus[i].Name + '" data-secondLevel="' + data.loginUser.SystemMenus[i].ModuleMenus[j].PageMenus[k].Name + '">' + data.loginUser.SystemMenus[i].ModuleMenus[j].PageMenus[k].Name + '</a></li>'
                                        }
                                    }
                                    window.htmlSAVE[i] += '<h5 class="m-t-20 m-l-10">' + data.loginUser.SystemMenus[i].ModuleMenus[j].Name + '</h5><ul class="nav nav-pills nav-stacked nav-inbox">' + __html + '</ul>'
                                }
                                html += '<li class="has-sub"><a href="javascript:;" data-changeSide="' + i + '" data-toggle="tooltip" data-placement="right" title="' + data.loginUser.SystemMenus[i].Name + '" > <i class="fa ' + faArr[(data.loginUser.SystemMenus[i].Id-1)] + '" ></i> <span>' + data.loginUser.SystemMenus[i].Name + '</span></a></li>'
                            }
                        }
                        $('.allLi').append(html)
                        handleChangeHTML()
                        $('[data-changeSide=0]').trigger('click')
                        //$('[data-click=sidebar-minify-left]').trigger('click');
                        nav = iframeTab.init({
                            iframeBox: ''
                        })
                        $('a[href="web/home/home.html"]').trigger('click')
                        setContentH()
                        go()


                        //机器人和我的账户显示
                        $('.faqrobot,.myAccountWrap').removeClass('hide');
                    }
                }
                //控制人工客服、客服平台是否可见
                if (data.keFuValue == 0) {
                    $('.monitor,.kfknplat').addClass('hide');
                }else{
                    $('.monitor,.kfknplat').removeClass('hide');
                }
                if (data.webConfig) {
                    $('#kfLink').attr('href', 'web/kf/index.html?sysNum=' + data.webConfig.SysNum)
                    $('#robotLink').attr('href', (data.webConfig.ChatUrl || 'robot/chat2.html') + '?sysNum=' + data.webConfig.SysNum)
                    cosTrade = data.webConfig.Trade
                }
            }else if(data.status == -101){
                 // 美的退出登陆配置跳转地址
                  window.location.href = 'login.html';
            }else {
                if (data.message == '请重新登陆！') {
                    location = 'login.html'
                }
            }
        }
    })
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false, //不从缓存中去数据
        url: encodeURI('user/loginConfigInfo'),
        success: function (data) {
            if (data.sentenceValue != null) {
                sessionStorage.setItem('sentenceValue', data.sentenceValue)
            }
            if (data.checklogValue != null) {
                sessionStorage.setItem('checklogValue', data.checklogValue)
            }
            if (data.qAndACloseValue != null) {
                sessionStorage.setItem('qAndACloseValue', data.qAndACloseValue)
            }
            if (data.thirdKnowledgeSystem != null) {
                sessionStorage.setItem('thirdKnowledgeSystem', data.thirdKnowledgeSystem)
            }
            if(data.sentenceShow!=null){
                sessionStorage.setItem("sentenceShow",data.sentenceShow);
            }
            if(data.advertiseAddShow!=null){
                sessionStorage.setItem("advertiseAddShow",data.advertiseAddShow);
            }
            if(data.chatUserDeleteShow!=null){
                sessionStorage.setItem("chatUserDeleteShow",data.chatUserDeleteShow);
            }
            /*
              taskId=490 黄世鹏
				      原因：聊天记录导出
             */
            if(data.chatLogExportShow!=null){
                sessionStorage.setItem("chatLogExportShow",data.chatLogExportShow);
            }
            /**
             * taskid=634
             * 添加是否显示login
             */
            if(data.showLogoValue!=null){
              sessionStorage.setItem("showLogoValue",data.showLogoValue);
              changeShowLogo();
            }
        }
    })

    // 断点
    function go () {

        $.ajax({
            type: 'get',
            cache: false,
            url: encodeURI('WarnDataDetail/getWarn'),
            success: function (data) {
                if (data.status === 0) {
                    $('#jljiu').html('未知关键词：' + data.words)
                    $('#wModal').modal('show')
                }
            }
        })
        $('#m-ok-ensure').click(function () {
            $('body').append('<a href="web/knowledge/unknowQueNew.html" data-num="0" data-name="未知问题" style="display:none;" id="g6">未知问题</a>')
            iframeTab.init({
                iframeBox: ''
            })
            $('#g6').trigger('click')
            $('#wModal').modal('hide')
        })
        $('#m-cancel-ensure').click(function () {
            $.ajax({
                type: 'get',
                cache: false,
                url: encodeURI('WarnDataDetail/notNoticeOnce'),
                success: function (data) {
                    if (data.status === 0) {
                        yunNoty(data)
                        $('#wModal').modal('hide')
                    }
                }
            })
        })
        $.ajax({
            url:encodeURI('Configuration/listAllItem')
        })


        // 获取最新新闻
        $.ajax({
            url:encodeURI('news/list'),
            data:{status: 1},
            success:function(data){
                if (data.status) {} else {
                    if (data.sysNews) {
                        if (data.sysNews[0]) {
                            var html = ''
                            for (var i = 0; i < data.sysNews.length; i++) {
                                var params = ''
                                for (var key in data.sysNews[i]) {
                                    params += key + '="' + ('' + data.sysNews[i][key] || '').replace(/\"/g, '\'') + '" '
                                }

                                html += '<li class="media" ' + params + '><a class="showNotice" data-toggle="modal" href="#noticeModal"><div class="media-body"><h6 class="media-heading">' + data.sysNews[i].Title + '</h6><div class="text-muted f-s-11">' + data.sysNews[i].Time + '</div></div></a></li>'
                            }
                            $('.sysNotice ul').append(html)
                            $('body .showNotice').trigger('click')
                        } else {
                            $('.sysNotice').hide()
                        }
                    } else {
                        $('.sysNotice').hide()
                    }
                }
            }
        })

        $('#noticeModal').on('hidden.bs.modal', function (e) {
            $('.sysNotice').hide()
        })
        // 已看过
        $('body').on('click', '.showNotice', function () {
            var $li = $(this).parent()
            if (!($li.siblings().length - 1)) {
                $('.redDot').hide()
            }
            $('.n-title').text($li.attr('title'))
            $('.n-keyWords').text($li.attr('keyWords'))
            $('.n-content').html($li.attr('content'))
            $('.n-startTime').text($li.attr('StartTime'))
            $('.n-endTime').text($li.attr('EndTime'))
            Base.request({
                url: 'news/doAdd',
                params: {
                    addWay: 1,
                    newsid: $li.attr('id'),
                    title: $li.attr('title'),
                    keyWords: $li.attr('keyWords'),
                    groupName: $li.attr('groupName') || '公告',
                    mode: $li.attr('mode'),
                    cId: $li.attr('cId'),
                    newsid: $li.attr('id'),
                    content: $li.attr('content'),
                    status: $li.attr('Status'),
                    startTime: $li.attr('StartTime'),
                    endTime: $li.attr('EndTime'),
                },
                callback: function (data) {
                    if (data.status) {} else {
                        if (data.sysNews) {}
                    }
                },
            })
            $li.remove()
        })

        // 获取所有行业
        $.ajax({
            url:encodeURI('Trade/getTradeInfo'),
            success:function(data){
                if (data.status) {} else {
                    if (data.tradeList) {
                        if (data.tradeList[0]) {
                            var html = ''
                            for (var i = 0; i < data.tradeList.length; i++) {
                                html += '<a class="cosTrade btn btn-white m-r-5 m-b-5" fid="0" ckb="0" DicCode="' + data.tradeList[i].DicCode + '">' + data.tradeList[i].DicName + '</a>'
                            }
                            $('#tradeKnowledge .modal-body').empty().append(html)
                            var index = 0
                            $('.cosTrade').each(function (i, j) {
                                if (+$(this).attr('DicCode') == cosTrade) {
                                    index = i
                                    $('.ensureImport').show().text('更新行业知识').siblings(':not([data-dismiss])').hide()
                                    $('#tradeKnowledge .modal-body').append('<i class="mask"></i>')
                                }
                            })
                            cosTrade = index ? cosTrade : data.tradeList[0].DicCode
                            $('.cosTrade').eq(index).removeClass('btn-white').addClass('btn-primary')
                        }
                    }
                }
            }
        })
        //检查code
        $.ajax({
            url:encodeURI('tipHelp/check'),
            data:{
                code: 'index',
            },
            success:function(data){
                if (data.status) { //旧
                    if (cosTrade) {
                        $.ajax({
                            url: 'Trade/needUpdate',
                            data: {
                                trade: cosTrade
                            },
                            success: function (data) {
                                if (data.status) {
                                    Base.gritter(data.message, false)
                                } else {
                                    if (data.needUpdate) { // 1-需要
                                        $('#tradeKnowledge').modal('show')
                                    } else { // 0-不需要
                                        $('.import-trade').addClass('hide')
                                    }
                                }
                            },
                        })
                    } else {
                        // $('.import-trade').removeClass('hide')
                    }
                } else { //新
                    // 行业知识功能为完善，暂时注释
                    // $.ajax({
                    //     url: 'Configuration/listAllItem',
                    //     success: function (data) {
                    //         if (data.status) {
                    //             Base.gritter(data.message, false)
                    //         } else {
                    //             $('#tradeKnowledge').modal('show')
                    //         }
                    //     },
                    // })
                }
                if (window.location.host == 'v3.faqrobot.org') {
                    $('.import-trade').addClass('hide')
                }
            }
        })

        if (window.location.host == 'v3.faqrobot.org') {
            $('.telli').show()
        }
        // 选择行业
        $('body').on('click', '.cosTrade', function () {
            cosTrade = $(this).attr('DicCode')
            $(this).removeClass('btn-white').addClass('btn-primary').siblings().removeClass('btn-primary').addClass('btn-white')
        })

        // 确认选择行业
        $('#tradeKnowledge .ensureOnly').on('click', function () {
            if (cosTrade) {
                Base.request({
                    url: 'Trade/saveTrade',
                    params: {
                        trade: cosTrade,
                    },
                    callback: function (data) {
                        if (data.status) {
                            Base.gritter(data.message, false)
                        } else {
                            Base.gritter(data.message, true)
                            $('#tradeKnowledge').modal('hide')
                            $('.import-trade').removeClass('hide')
                        }
                    },
                })
            } else {
                Base.gritter('选择您的行业', false)
            }
        })

        // 确认并导入行业知识
        $('#tradeKnowledge .ensureImport').on('click', function () {
            if (cosTrade) {
                Base.request({
                    url: 'Trade/saveTrade',
                    params: {
                        trade: cosTrade,
                    },
                    callback: function (data) {
                        if (data.status) {
                            Base.gritter(data.message, false)
                        } else {
                            Base.request({
                                url: 'Trade/initTradeQue',
                                params: {
                                    trade: cosTrade,
                                },
                                callback: function (data) {
                                    if (data.status) {
                                        Base.gritter(data.message, false)
                                    } else {
                                        Base.gritter(data.message, true)
                                        $('#tradeKnowledge').modal('hide')
                                        $('.import-trade').addClass('hide')
                                        window.hide = true
                                    }
                                },
                            })
                        }
                    },
                })
            } else {
                Base.gritter('选择您的行业', false)
            }
        })

        $('#tradeKnowledge').on('hidden.bs.modal', function (e) {
            if (!window.hide) {
                $('.import-trade').removeClass('hide')
            }
        })

        //处理链接跳转
        // $('body').on('click', '.childLink', function() {

        // var url = $(this).attr('href').match(/#([a-zA-Z]+)\/([a-zA-Z]+)/),
        // parentUrl = url[1],
        // childUrl = url[2];

        // $('#iframeCtn').attr({'src': '/web/'+ parentUrl +'/'+ childUrl +'.html'});

        // $('li.active').removeClass('active');
        // $(this).parents('li').addClass('active');
        // Pace.restart();
        // });

        //当前页面
        var url = This.location.href.match(/#([^\/]+)\/(.+)/)

        //生成childLink的href
        // $('.childLink').each(function() {
        // var childUrl = $(this).attr('href').match(/#(.+)/),
        // parentUrl = $(this).parents('.parentLink').attr('data-link');
        // if(childUrl) {
        // childUrl = childUrl[1];
        // }

        // $(this).attr({'href': '#'+ parentUrl +'/'+ childUrl});
        // });

        //根据#号后边的值设置左侧菜单的样式
        // if(url) {
        // var parentUrl = url[1],
        // childUrl = url[2],
        // $childLink = $('.childLink'),
        // $linkBtn = null;

        // for(var i=0; i<$childLink.length; i++) {
        // if($childLink.eq(i).attr('href') == ('#'+parentUrl+'/'+childUrl)) {
        // $linkBtn = $childLink.eq(i);
        // break;
        // }
        // }

        // $('li.active').removeClass('active');
        // $linkBtn.trigger('click').parents('li').addClass('active');

        // $linkBtn.parents('.sub-menu').each(function() {
        // $(this).show();
        // });
        // }

        $('#logout').click(function () {
            $.ajax({
                type: 'post',
                datatype: 'json',
                cache: false, //不从缓存中去数据
                url: encodeURI('login/logout'),
                success: function (data) {
                    if (data.status === 0) {
                        yunNoty(data, function () {
                            window.location.href = (localStorage.getItem('Subdomain')||"") + "/login.html";
                        })
                    }else if(data.status === 101){
                        // 美的退出登陆配置跳转地址
                        yunNoty(data, function () {
                          window.location.href = data.url;
                        })
                    }
                }
            })
        })

        //账户体验图片变化
        $('#div_bus').on('mouseover mouseout',
            function (event) {
                if (event.type == 'mouseover') {
                    $('#img_bus').attr('src', 'web/common/images/icon_bus_hover.png')
                } else if (event.type == 'mouseout') {
                    $('#img_bus').attr('src', 'web/common/images/icon_bus.png')
                }
            })
        $('#div_gaoji').on('mouseover mouseout',
            function (event) {
                if (event.type == 'mouseover') {
                    $('#img_gaoji').attr('src', 'web/common/images/icon_gaoji_hover.png')
                } else if (event.type == 'mouseout') {
                    $('#img_gaoji').attr('src', 'web/common/images/icon_gaoji.png')
                }
            })
        $('#div_profession').on('mouseover mouseout',
            function (event) {
                if (event.type == 'mouseover') {
                    $('#img_profession').attr('src', 'web/common/images/icon_profession_hover.png')
                } else if (event.type == 'mouseout') {
                    $('#img_profession').attr('src', 'web/common/images/icon_profession.png')
                }
            })

        //切换体验显示与隐藏
        $('#btnExp').click(function () {
            $('#account_exp').toggle()
        })

        var hdnAccountLevel = -1
        var hdnNum = -1
        //版本信息
        $('#accountModal').on('show.bs.modal', function () {
            $.ajax({
                type: 'post',
                datatype: 'json',
                cache: false, //不从缓存中去数据
                url: encodeURI('../../AccountInfo/showAccountInfo2'),
                success: function (data) {
                    if (data.status === 0) {
                        /////
                        // data.AccountInfo.Level = 5;
                        // data.AccountInfo.TruOut = 0;
                        // data.AccountInfo.IsTryOuted = 0;
                        /////
                        data.AccountInfo.Level = data.AccountInfo.Level ? data.AccountInfo.Level : 2
                        hdnAccountLevel = data.AccountInfo.Level
                        hdnNum = data.AccountInfo.UseDays
                        //回带账户名称
                        $('#account_name').html(data.AccountInfo.UserName)
                        if (data.AccountInfo.IsTryOuted === 0) {
                            $('#btnExp').show()
                        }
                        //试用
                        if (data.AccountInfo.TrialLevel) {
                            if (data.AccountInfo.TryOutUnUseDays) {
                                $('#account_type_try').parent('p').show()
                                if (data.AccountInfo.TrialLevel == 3) {
                                    $('#account_type_try').html('FaqRobot商用版（188元/月）')
                                }
                                if (data.AccountInfo.TrialLevel == 4) {
                                    $('#account_type_try').html('FaqRobot高级版（488元/月）')
                                }
                                if (data.AccountInfo.TrialLevel == 5) {
                                    $('#account_type_try').html('FaqRobot专业版（888元/月）')
                                }
                                $('#account_time_try').html(data.AccountInfo.TryOutUseDays)
                                $('#account_time_tryL').html(data.AccountInfo.TryOutUnUseDays)
                            }
                        }
                        //未试用免费
                        if (data.AccountInfo.Level == 2) {
                            $('#account_type_free').parent('p').show()
                            $('#account_time_free').html(data.AccountInfo.UseDays)
                            $('#btnBuy').show()
                            //未试用付费
                        } else {
                            $('#account_type_paid').parent('p').show()
                            if (data.AccountInfo.Level == 3) {
                                $('#account_type_paid').html('FaqRobot商用版（188元/月）')
                            }
                            if (data.AccountInfo.Level == 4) {
                                $('#account_type_paid').html('FaqRobot高级版（488元/月）')
                            }
                            if (data.AccountInfo.Level == 5) {
                                $('#account_type_paid').html('FaqRobot专业版（888元/月）')
                            }
                            $('#account_time_paid').html(data.AccountInfo.UseDays)
                            $('#account_time_paidL').html(data.AccountInfo.UnUseDays)
                            $('#btnUpdate').show()
                            $('#btnRenew').show()
                            $('#btnPay').show()
                        }
                    } else {
                        yunNoty(data)
                    }
                }
            })
        })

        //点击体验
        $('.acBorder').click(function () {
            var toDegree = ''
            if ($(this)[0] == $('#div_bus')[0]) {
                toDegree = 3
                if (hdnAccountLevel == 3) {
                    yunNotyError('您已经在使用商用版，请选择其他版本！')
                    return
                }
                if (hdnAccountLevel == 4) {
                    yunNotyError('您正在使用专业版，请选择其他高级版本！')
                    return
                }
            } else if ($(this)[0] == $('#div_gaoji')[0]) {
                toDegree = 4
                if (hdnAccountLevel == 4) {
                    yunNotyError('您已经在使用高级版，请选择其他版本！')
                    return
                }
            } else if ($(this)[0] == $('#div_profession')[0]) {
                toDegree = 5
            }
            if (hdnAccountLevel == 5) {
                yunNotyError('您已经在使用专业版，无法体验！')
                return
            }
            $.ajax({
                type: 'post',
                datatype: 'json',
                cache: false, //不从缓存中去数据
                url: encodeURI('../../AccountInfo/exchangeVersion'),
                data: 'toDegree=' + toDegree,
                success: function (data) {
                    if (data.status === 0) {
                        yunNoty({
                            'message': '设置成功，现在去体验新版本吧！',
                            'status': 0
                        }, function () {
                            window.location.href = 'index.html'
                        })
                    } else {
                        yunNoty(data)
                    }
                }
            })
        })

        //版本升级
        $('#btnBuy').click(function () {
            $(this).attr('href', '/purChase.html?webId=' + hdnWebId)
            $(this).attr('target', '_blank')
        })
        $('#btnRenew').click(function () {
            $(this).attr('href', '/purChase.html?webId=' + hdnWebId + '&version=' + hdnAccountLevel + '&type=100&num=' + hdnNum)
            $(this).attr('target', '_blank')
        })
        $('#btnUpdate').click(function () {
            $(this).attr('href', '/purChase.html?webId=' + hdnWebId + '&version=' + hdnAccountLevel + '&type=1&num=' + hdnNum)
            $(this).attr('target', '_blank')
        })

        //购买记录
        $('#payModal').on('show.bs.modal', function () {
            $.ajax({
                type: 'get',
                datatype: 'json',
                cache: false, //不从缓存中去数据
                url: encodeURI('../../AccountInfo/showPayRecords'),
                success: function (data) {
                    if (data.status === 0) {
                        if (data.List && data.List.length > 0) {
                            var html = []
                            for (var i = 0; i < data.List.length; i++) {
                                html.push('<tr>')
                                html.push('<td>' + data.List[i].Subject + '</td>')
                                html.push('<td>' + data.List[i].TotleFee + '</td>')
                                html.push('<td>' + data.List[i].ProductNum + '</td>')
                                html.push('<td>' + data.List[i].Time + '</td>')
                                html.push('</tr>')
                            }
                            $('#payDataTable').html(html.join(''))
                        } else {
                            $('#payDataTable').html('<tr><td colspan="4" style="text-align:center;">暂无购买记录！</td></tr>')
                        }
                    } else {
                        yunNoty(data)
                    }
                }
            })
        })

        $('#btnSimple').click(function () {
            $.ajax({
                type: 'post',
                datatype: 'json',
                cache: false, //不从缓存中去数据
                url: encodeURI('../../user/skinExchange?skinId=' + 0),
                success: function (data) {
                    if (data.status === 0) {
                        location.href = 'web_mini/index.html'
                    } else {
                        yunAlert(data)
                    }
                }
            })
        })

        $('#btnPay').click(function () {
            $('#accountModal').modal('hide')
            $('#payModal').modal('show')
        })
        $('#btnAccount').click(function () {
            $('#payModal').modal('hide')
            $('#accountModal').modal('show')
        })
    }
})
