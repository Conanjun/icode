/**   
* jquery.dragMove.js plugin   
*/    
;(function($, window, document, undefined) {    
    
    var plugName = "dragMove",    
        defaults = {    
            childClass: '.drag',// 
            limit: false,// 限制在窗口内    
            callback: function($move, $replace) {}// 交换位置成功后的回调    
        };    
    
    function Drag($this, options) {    
        this.name = plugName;    
        this.defaults = defaults;    
        this.options = $.extend({}, defaults, options);    
        this.init();    
    }    
    
    Drag.prototype = {    
        init: function() {    
            this.handle();  
        },    
        handle: function() {  
            var This = this;  
  
            // 拖动时禁止选择文本    
            $('<style>.DR_select{-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}.DR_maxIndex{z-index:99999}.DR_fixed{position:fixed !important;}.DR_holder{display:inline-block;background:#eee;outline:2px dashed #ddd;vertical-align:middle;}.DR_mid{vertical-align:middle;}</style>').appendTo('head');   
            $('[DR_drag]').addClass('DR_mid'); 

            $(document).on('mousedown.DR', This.options.childClass, function(e) { 
                if($('[DR_move]').length) return false;
                var $p = $(this).parent();
                $p.attr('DR_move', true);
                var posX = $(this).position().left,// inner左上点相对outer左上点的位置    
                    posY = $(this).position().top,    
                    offX = e.offsetX,// 鼠标相对inner内部的位置    
                    offY = e.offsetY,    
                    mouseX = e.clientX,// 鼠标位置    
                    mouseY = e.clientY,    
                    oWidth = $p.width(),    
                    oHeight = $p.height();  
                
                $p.css({
                    width: $p.width(),    
                    height: $p.height()  
                });
                if(+$p.attr('DR_replace')) {// 拖动交换
                    window.DR_replace = true;
                    // 占位  
                    $('<i class="DR_holder"></i>').css({    
                        width: $p.outerWidth(),    
                        height: $p.outerHeight()    
                    }).addClass($('[DR_move]')[0].className).insertBefore($('[DR_move]')); 
                }else {// 单纯拖动
                    window.DR_replace = false;
                }
  
                $('body').addClass('DR_select');   
                $('[DR_move]').addClass('DR_maxIndex DR_fixed');
                if(window.DR_replace) {
                    $('[DR_move]').css({    
                        left: mouseX - posX - offX,    
                        top: mouseY - posY - offY    
                    });
                }
  
                $(document).on('mousemove.DR', function(e) {  
                    mouseX = e.clientX;    
                    mouseY = e.clientY;    
    
                    var diffX = mouseX - posX - offX,    
                        diffY = mouseY - posY - offY,    
                        maxW = $(window).width() - $('[DR_move]').outerWidth();    
                        maxH = $(window).height() - $('[DR_move]').outerHeight();    
    
                    // 限制范围    
                    if(This.options.limit) {    
                        if(diffX <= 0) {    
                            diffX = 0;    
                        }    
                        if(diffX >= maxW) {    
                            diffX = maxW;    
                        }    
                        if(diffY <= 0) {    
                            diffY = 0;    
                        }    
                        if(diffY >= maxH) {    
                            diffY = maxH;    
                        }    
                    }    
    
                    $('[DR_move]').css({'left': diffX, 'top': diffY});  
                });  
            });  
  
            $(document).on('mouseup.DR', function() {  
                if(!$('[DR_move]').length) return false;
                if(window.DR_replace) {// 拖动交换
                    window.DR_replace = false;
                    var $that = $('[DR_move]'), 
                        DR_drag = $that.attr('DR_drag'),
                        $all = $(This.options.childClass).parent('[DR_drag='+ DR_drag +']:not([DR_move])');// 相同的组才可交换位置  
                    if($all[0]) {// >=1
                        $all.each(function(i) {  
                            var $obj = $(this),
                                col_c = $that.offset().left + $that.outerWidth()/2,
                                row_c = $that.offset().top + $that.outerHeight()/2,
                                left = $obj.offset().left,
                                left_w = $obj.offset().left + $obj.outerWidth(),
                                top = $obj.offset().top,
                                top_h = $obj.offset().top + $obj.outerHeight();  
                            if(left<col_c && left_w>col_c && top<row_c && top_h>row_c) { 
                                window.$DR_obj = $obj;
                                // 删除虚线框    
                                $obj.after($('.DR_holder').clone().addClass('DR_holder_clone'));  
                                $('.DR_holder:not(.DR_holder_clone)').replaceWith($obj);  
                    
                                $that.stop().animate({  
                                    left: $('.DR_holder_clone').offset().left,  
                                    top: $('.DR_holder_clone').offset().top  
                                }, 100, function() {  
                                    window.$DR_obj && This.options.callback($that, window.$DR_obj);
                                    window.$DR_obj = null;
                                    $('.DR_holder_clone').replaceWith($that);  
                                    $that.removeAttr('style').removeAttr('DR_move');  
                                    $that.removeClass('DR_maxIndex DR_fixed');  
                                });  
                            }else {  
                                $that.stop().animate({  
                                    left: $('.DR_holder').offset().left,  
                                    top: $('.DR_holder').offset().top  
                                }, 100, function() {  
                                    window.$DR_obj && This.options.callback($that, window.$DR_obj);
                                    window.$DR_obj = null;
                                    $('.DR_holder').replaceWith($that);  
                                    $that.removeAttr('style').removeAttr('DR_move');  
                                    $that.removeClass('DR_maxIndex DR_fixed');
                                });  
                            }  
                        });
                    }else {// 0
                        $that.stop().animate({  
                            left: $('.DR_holder').offset().left,  
                            top: $('.DR_holder').offset().top  
                        }, 300, function() {  
                            $('.DR_holder').replaceWith($that);  
                            $that.removeAttr('style').removeAttr('DR_move');  
                            $that.removeClass('DR_maxIndex DR_fixed');

                        });
                    }
                }else {// 单纯拖动
                    $('[DR_move]').removeAttr('DR_move');  
                }
                  
                $('body').removeClass('DR_select');  
                $(document).off('mousemove.DR');  
            });  
        },  
    }    
    
    $.fn.extend({    
        dragMove: function(options) {    
            return this.each(function() {    
                new Drag($(this), options);    
            })    
        }    
    })    
})(jQuery, window, document);

;$(function() {
    // 通用方法
    function Common() {
        this.init();
    }
    Common.prototype = {
        init: function() {

        },
        // 下拉改变文字
        dropdown: function() {
            $('.dropdown-menu a').on('click', function() {
                $(this).parents('ul').prev().html($(this).text() + ' <span class="caret"></span>');
            });
        },
        tooltip: function() {
            $('.timeTip').css('cursor', 'pointer').tooltip();
        }
    }
    var common = new Common();

    // app
    function App() {
        this.holder = 'images/holder.png';
        this.parentNum = 0;
        this.channelStyle = 0;// 0-横排 1-纵排
        this.pageNo = 1;
        this.pageSize = 20;
        this.$tr = null;
        this.init();
    }
    App.prototype = {
        init: function() {
            this.allWins();
            this.createWin();
            this.ueditor();
            this.gradX();
            this.parentHandle();
        },
        allWins: function() {
            //ENTER
            $(document).on('keydown', function(e) {
                var $activeEl = $(document.activeElement);
                
                if($activeEl.is('.winNameInput') && (e.keyCode==13||e.keyCode==108)) {
                    return false;
                }
            });
            $(document).on('keyup', function(e) {
                var $activeEl = $(document.activeElement);
                
                if($activeEl.is('.winNameInput') && (e.keyCode==13||e.keyCode==108)) {
                    $('.ensureName').trigger('click');
                }
            });

            // 调用插件
            $('body').dragMove({  
                limit: true,// 限制在窗口内  
                callback: function($move, $replace) {
                    if($move.attr('dr_drag') == 2) {// 交换频道
                        var t1 = $move.attr('seq'),
                            t2 = $replace.attr('seq');
                        Base.request({
                            url: 'Channel/update',
                            params: {
                                channelId: $move.attr('Id'),
                                name: $move.attr('ChannelName'),
                                seq: t2,
                                contentShowType: $move.attr('contentShowType')
                            },
                            callback: function(data) {
                                if(data.status) {
                                    Base.gritter(data.message, false);
                                }else {
                                    $move.attr({
                                        seq: t2,
                                        index: t2
                                    });
                                }
                            },
                        });
                        Base.request({
                            url: 'Channel/update',
                            params: {
                                channelId: $replace.attr('Id'),
                                name: $replace.attr('ChannelName'),
                                seq: t1,
                                contentShowType: $replace.attr('contentShowType')
                            },
                            callback: function(data) {
                                if(data.status) {
                                    Base.gritter(data.message, false);
                                }else {
                                    Base.gritter(data.message, true);
                                    $replace.attr({
                                        seq: t1,
                                        index: t1
                                    });
                                }
                            },
                        });
                    }
                    if($move.attr('dr_drag') == 3) {// 交换服务
                        var t1 = $move.attr('seq'),
                            t2 = $replace.attr('seq');

                        Base.request({
                            url: 'ChannelValues/update',
                            params: {
                                id: $move.attr('id'),
                                channelId: $('[p='+ $move.parents('.childBtnCtn-item').attr('c') +']').attr('id'),
                                valueType: $move.attr('valueType'),
                                text: $move.attr('text'),
                                pic: $move.attr('pic'),
                                link: $move.attr('link'),
                                seq: t2
                            },
                            callback: function(data) {
                                if(data.status) {
                                    Base.gritter(data.message, false);
                                }else {
                                    $move.attr({
                                        seq: t2,
                                        index: t2
                                    });
                                }
                            },
                        });
                        Base.request({
                            url: 'ChannelValues/update',
                            params: {
                                id: $replace.attr('id'),
                                channelId: $('[p='+ $replace.parents('.childBtnCtn-item').attr('c') +']').attr('id'),
                                valueType: $replace.attr('valueType'),
                                text: $replace.attr('text'),
                                pic: $replace.attr('pic'),
                                link: $replace.attr('link'),
                                seq: t1
                            },
                            callback: function(data) {
                                if(data.status) {
                                    Base.gritter(data.message, false);
                                }else {
                                    Base.gritter(data.message, true);
                                    $replace.attr({
                                        seq: t1,
                                        index: t1
                                    });
                                }
                            },
                        });
                    }
                    if($move.attr('dr_drag') == 4) {// 交换链接
                        var t1 = $move.attr('seq'),
                            t2 = $replace.attr('seq');

                        Base.request({
                            url: 'ChatBanner/update',
                            params: {
                                id: $move.attr('id'),
                                configId: window.config.Id,
                                text: $move.attr('text'),
                                pic: $move.attr('pic'),
                                link: $move.attr('link'),
                                seq: t2
                            },
                            callback: function(data) {
                                if(data.status) {
                                    Base.gritter(data.message, false);
                                }else {
                                    $move.attr({
                                        seq: t2,
                                        index: t2
                                    });
                                }
                            },
                        });
                        Base.request({
                            url: 'ChatBanner/update',
                            params: {
                                id: $replace.attr('id'),
                                configId: window.config.Id,
                                text: $replace.attr('text'),
                                pic: $replace.attr('pic'),
                                link: $replace.attr('link'),
                                seq: t1
                            },
                            callback: function(data) {
                                if(data.status) {
                                    Base.gritter(data.message, false);
                                }else {
                                    Base.gritter(data.message, true);
                                    $replace.attr({
                                        seq: t1,
                                        index: t1
                                    });
                                }
                            },
                        });
                    }
                }  
            }); 

            // 快捷创建服务
            $('body').on('click', '.noDrag', function() {
                var $cur = $(this).parents('.quickServ-item'),
                    $p = $('.childBtnCtn-item:visible'),
                    ran = $p.attr('c');

                if($p.length) {// 有频道处于显示状态
                    if($('[_style=2]', $p)[0]) {
                        Base.gritter('该频道含有自定义内容，不能添加', false);
                    }else {
                        var style = 0;
                        if($('[_style=1]', $p)[0]) {
                            style = 1;
                        }

                        if($('.serv-item', $p).length == 20) {
                            Base.gritter('该频道最多20个服务', false);
                            return;
                        }
                        Base.request({
                            url: 'ChannelValues/create',
                            params: {
                                channelId: $('[p='+ ran +']').attr('id'),
                                valueType: 1,
                                text: $cur.attr('name'),
                                pic: $cur.attr('imageurl'),
                                //link: $cur.attr('linkurl'),
                                seq: (This.maxIndex($('.serv-item', $p))+1)
                            },
                            callback: function(data) {
                                if(data.status) {
                                    Base.gritter(data.message, false);
                                }else {
                                    Base.gritter(data.message, true);
                                    var params = '';
                                    for(var key in data.values) {
                                        params += key+'="'+ (''+ data.values[key] || '') +'" ';
                                    }
                                    $('.childScrollCtn', $p).append('<div class="serv-item" index="'+ (This.maxIndex($('.serv-item', $p))+1) +'" _style="'+ style +'" '+ params +'  DR_drag="3" DR_replace="1"><div class="btn-group-vertical"><button class="editServ btn btn-xs btn-primary" data-toggle="modal" data-target="#editC"><span class="glyphicon glyphicon-pencil"></span> 编辑服务</button><button class="delServ btn btn-xs btn-primary"><span class="glyphicon glyphicon-trash"></span> 删除服务</button></div><img src="'+ data.values.Pic +'"><div class="editorText">'+ data.values.Text +'</div><i class="drag"></i></div>');
                                    if(+$p.attr('type')) {// 纵排
                                        $p.find('.serv-item').removeClass().addClass('serv-item width1 serv-item-left');
                                        $('.serv-item').addClass('serv-item-h');
                                        $('.childScrollCtn').css('overflow', 'auto');
                                        $p.find('img').addClass('img_col').siblings('.editorText').addClass('p_col');
                                        if(style == 2) {
                                            $('.serv-item', $p).addClass('serv-item-editor');
                                        }
                                    }else {
                                        $p.find('.serv-item').removeClass().addClass('serv-item width4');
                                        $('.serv-item').removeClass('serv-item-h');
                                        $('.childScrollCtn').css('overflow', 'visible');
                                        $p.find('img').addClass('img_row').siblings('.editorText').addClass('p_row');
                                    }
                                }
                            },
                        });
                    }
                }else {
                    Base.gritter('请先选择一个频道', false);
                }
            });

            $('.bigNav a:eq(1)').tab('show');
            var This = this;
            
            // 所有快捷服务
            Base.request({
                url: 'ConfigMode/listSwitchConfig',
                params: {},
                callback: function(data) {
                    if(data.status) {
                        Base.gritter(data.message, false);
                    }else {
                        var html ='';
                        if(data.modes[0]) {
                            getWins();
                            for(var i=0; i<data.modes.length; i++) {
                                var params = '';
                                for(var key in data.modes[i]) {
                                    params += key+'="'+ (''+ data.modes[i][key] || '') +'" ';
                                }
                                if(data.modes[i].Info.split('：')[0]=='寒暄库' || data.modes[i].Info.split('：')[0]=='禁止库' || data.modes[i].Info.split('：')[0]=='联网聊天库') {
                                    continue;
                                }
                                var ImageUrl = '';
                                switch(data.modes[i].Info.split('：')[0]) {
                                    case '空气质量':
                                        ImageUrl = '/web/common/images/web.switch.plus.aiq.gif';
                                        break;
                                    case '菜谱查询':
                                        ImageUrl = '/web/common/images/web.switch.plus.cookbook.gif';
                                        break;
                                    case '成语查询':
                                        ImageUrl = '/web/common/images/web.switch.plus.idiom.gif';
                                        break;
                                    case '讲笑话':
                                        ImageUrl = '/web/common/images/web.switch.plus.joke.gif';
                                        break;
                                    case '智能计算':
                                        ImageUrl = '/web/common/images/web.switch.plus.math.gif';
                                        break;
                                    case '手机号码查询':
                                        ImageUrl = '/web/common/images/web.switch.plus.phone.gif';
                                        break;
                                    case '汇率转换':
                                        ImageUrl = '/web/common/images/web.switch.plus.rateconversion.gif';
                                        break;
                                    case '成语查询':
                                        ImageUrl = '/web/common/images/web.switch.plus.idiom.gif';
                                        break;
                                    case '同步翻译':
                                        ImageUrl = '/web/common/images/web.switch.plus.translate.gif';
                                        break;
                                    case '单位换算':
                                        ImageUrl = '/web/common/images/web.switch.plus.unitconversion.gif';
                                        break;
                                    case '天气查询':
                                        ImageUrl = '/web/common/images/web.switch.plus.weather.gif';
                                        break;

                                }
                                html += '<div class="quickServ-item col-md-3" '+ params +' name="'+ data.modes[i].Info.split('：')[0] +'" imageurl="http://'+ location.host + ImageUrl +'"><div class="imgCtn"><img src="http://'+ location.host + ImageUrl +'"></div><p>'+ data.modes[i].Info.split('：')[0] +'</p><i class="noDrag" title="点击在选中频道新建此服务"></i></div>';
                            }
                        }else {
                            html += '<div class="emptyTip"><span colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;没有快捷服务！</span></div>';
                        }
                        $('.quickServ').empty().append(html);
                    }
                },
            });

            // 所有窗口
            function getWins() {
                Base.request({
                    url: 'ChatWindowConfig/list',
                    params: {
                        pageNum: This.pageNo,
                        pageSize: This.pageSize
                    },
                    callback: function(data) {
                        if(data.status) {
                            Base.gritter(data.message, false);
                        }else {
                            var html ='';
                            if(data.list[0]) {
                                for(var i=0; i<data.list.length; i++) {
                                    var channelShowType = '';
                                    if(data.list[i].ChannelShowType == 0) {
                                        channelShowType = '横放';
                                    }
                                    if(data.list[i].ChannelShowType == 1) {
                                        channelShowType = '竖放';
                                    }
                                    var params = '';
                                    for(var key in data.list[i]) {
                                        params += key+'="'+ (''+ data.list[i][key] || '') +'" ';
                                    }
                                    html += '<tr id="'+ data.list[i].Id +'"><td>'+ data.list[i].Name +'</td><td>'+ data.list[i].CreateTime +'</td><td>'+ (data.list[i].UpdateTime || '') +'</td><td><img src="'+ (data.list[i].Logo || '') +'"></td><td>'+ channelShowType +'</td><td style="white-space: nowrap;"><a class=""><span class="editThisWin timeTip glyphicon glyphicon-pencil" title="修改" style="margin: 0 2px; cursor: pointer;"></span></a><a class="delThisWin"><span class="timeTip glyphicon glyphicon-trash" title="删除" style="margin: 0 2px; cursor: pointer;"></span></a></td></tr>';
                                }

                                var options = {
                                    currentPage: data.currentPage,
                                    totalPages: data.totlePages ? data.totlePages : 1,
                                    alignment: 'right',
                                    onPageClicked: function(event, originalEvent, type, page) {
                                        This.pageNo = page;
                                        getWins();
                                    }
                                };
                                $('#itemContainer').bootstrapPaginator(options);
                            }else {
                                html += '<tr class="emptyTip"><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
                                $('#itemContainer').empty();
                            }
                            $('.tbody').empty().append(html);
                            $('.timeTip').tooltip();

                            
                        }
                    },
                });
            }

            var pageNo1 = 1,
                pageSize1 = 12;
                initSrc()
            function initSrc() {
                Base.request({
                    url: 'material/list',
                    params: {
                        type: 1,
                        pageNo: pageNo1,
                        pageSize: pageSize1,
                    },
                    callback: function(data) {
                        if(data.status) {
                            Base.gritter(data.message, false);
                        }else {
                            var html ='';
                            if(data.list) {
                                if(data.list[0]) {
                                    for(var i=0; i<data.list.length; i++) {
                                        html += '<span class="imgGallery" Id="'+ data.list[i].Id +'"><img src="http://'+ location.host +'/'+ data.list[i].Path +'" alt="'+ data.list[i].Name +'" title="'+ data.list[i].Name +'"></span>';
                                    }

                                    var options = {
                                        currentPage: data.currentPage,
                                        totalPages: data.totlePages ? data.totlePages : 1,
                                        alignment: 'right',
                                        onPageClicked: function(event, originalEvent, type, page) {
                                            pageNo1 = page;
                                            initSrc();
                                        }
                                    };
                                    $('#itemContainer3').bootstrapPaginator(options);
                                }else {
                                    html += '<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
                                    $('#itemContainer3').empty();
                                }
                            }
                            $('.loadImg-payCode').empty().append(html);
                        }
                    },
                });
            }
            // 选择logo
            $('body').on('click', '.imgGallery', function() {
                var logo = $('img', this).attr('src');
                switch(window.cosLogo) {
                    case 1:// logo
                        Base.request({
                            url: 'ChatWindowConfig/update',
                            params: {
                                id: window.config.Id,
                                logo: logo
                            },
                            callback: function(data) {
                                if(data.status) {
                                    Base.gritter(data.message, false);
                                }else {
                                    Base.gritter(data.message, true);
                                    $('.logoCtn img').attr('src', logo);
                                    $('#modal-dialog').modal('hide');
                                }
                            },
                        });
                        break;
                    case 2:// 导航
                        $('.c_img').val(logo);
                        $('#modal-dialog').modal('hide');
                        break;
                }
            });
            // 选择图片
            $('.cosLogo').on('click', function() {
                $('#modal-dialog').modal('show');
                return false;
            });
            $('.cosLogo').on('click', function() {
                window.cosLogo = +$(this).attr('class').match(/\d/)[0];
            });

            // 显示城市
            $('#city').on('change', function() {
                var checked = 0;
                if($(this).prop('checked')) {
                    checked = 0;
                }else {
                    checked = 1;
                }
                Base.request({
                    url: 'ChatWindowConfig/update',
                    params: {
                        id: window.config.Id,
                        showCity: checked
                    },
                    callback: function(data) {
                        if(data.status) {
                            Base.gritter(data.message, false);
                        }else {
                            Base.gritter(data.message, true);
                        }
                    },
                });
            });
            // 显示天气
            $('#weather').on('change', function() {
                var checked = 0;
                if($(this).prop('checked')) {
                    checked = 0;
                }else {
                    checked = 1;
                }
                Base.request({
                    url: 'ChatWindowConfig/update',
                    params: {
                        id: window.config.Id,
                        showWeather: checked
                    },
                    callback: function(data) {
                        if(data.status) {
                            Base.gritter(data.message, false);
                        }else {
                            Base.gritter(data.message, true);
                        }
                    },
                });
            });

            // 编辑回填
            $('body').on('click', '.editThisWin', function() {
                This.$tr = $(this).parents('tr');
                Base.request({
                    url: 'ChatWindowConfig/findById',
                    params: {
                        id: This.$tr.attr('id')
                    },
                    callback: function(data) {
                        if(data.status) {
                            Base.gritter(data.message, false);
                        }else {
                            window.config = data.config;
                            This.channelStyle = data.config.ChannelShowType;
                            $('.winName').text(data.config.Name).attr({
                                'Id': data.config.Id,
                                'ChannelShowType': data.config.ChannelShowType,
                            });
                            $('.bigNav a:eq(0)').tab('show');
                            data.config.Logo && $('.logoCtn img').attr('src', data.config.Logo);
                            $('#weather').prop('checked', !data.config.ShowWeather);
                            $('#city').prop('checked', !data.config.ShowCity);

                            if(data.config.BgColor) {
                                var BgColor = JSON.parse(data.config.BgColor);
                                for(var i=0; i<BgColor.length; i++) {
                                    This.$block = $('.pickerColor').parent().eq(i);
                                    if(BgColor[i]) {
                                        This.createGradX(BgColor[i]);
                                    }
                                }
                            }

                            // 导航
                            if(data.config.ListBanner[0]) {
                                $('.quickChildCtn').empty();
                                for(var i=0; i<data.config.ListBanner.length; i++) {
                                    var ran = (''+ Math.random()).replace(/\./, '');
                                    var params = '';
                                    for(var key in data.config.ListBanner[i]) {
                                        params += key+'="'+ (''+ data.config.ListBanner[i][key] || '') +'" ';
                                    }
                                    $('.quickChildCtn').append('<div class="quickBtn-item" p="'+ ran +'" index="'+ data.config.ListBanner[i].Seq +'" '+ params +' DR_drag="4" DR_replace="1"><div class="btn-group-vertical"><button class="editQuick btn btn-xs btn-primary" data-toggle="modal" data-target="#editC"><span class="glyphicon glyphicon-pencil"></span> 编辑跳转</button><button class="delQuick btn btn-xs btn-primary"><span class="glyphicon glyphicon-trash"></span> 删除跳转</button></div>'+ (data.config.ListBanner[i].Pic?'<img class="link_img" src="'+ data.config.ListBanner[i].Pic +'">':'<img class="link_img" src="'+ data.config.ListBanner[i].Pic +'" style="display: none;">') +'<p class="link_p '+ (data.config.ListBanner[i].Pic?'':'link_p_60') +'">'+ data.config.ListBanner[i].Text +'</p><i class="drag"></i></div>');
                                }
                            }
                            // 频道
                            if(data.config.ListChannel[0]) {
                                $('.parentBtnCtn').find('.parentBtn-item').remove();
                                $('.childBtnCtn-item').remove();
                                This.parentNum = data.config.ListChannel.length;
                                for(var i=0; i<data.config.ListChannel.length; i++) {
                                    var ran = (''+ Math.random()).replace(/\./, '');
                                    var params = '';
                                    for(var key in data.config.ListChannel[i]) {
                                        params += key+'="'+ (''+ data.config.ListChannel[i][key] || '') +'" ';
                                    }
                                    // 频道
                                    var $parentBtn_item = $('<div class="parentBtn-item" p="'+ ran +'" index="'+ data.config.ListChannel[i].Seq +'" '+ params +'  DR_drag="2" DR_replace="1"><div class="btn-group-vertical"><button class="showChild btn btn-xs btn-primary"><span class="glyphicon glyphicon-th"></span> 显示频道</button><button class="editChild btn btn-xs btn-primary" data-toggle="modal" data-target="#editP"><span class="glyphicon glyphicon-pencil"></span> 编辑频道</button><button class="delChild btn btn-xs btn-primary"><span class="glyphicon glyphicon-trash"></span> 删除频道</button></div><p>'+ data.config.ListChannel[i].ChannelName +'</p><i class="drag"></i></div>');
                                    $('.parentBtnCtn').append($parentBtn_item);

                                    // 服务框
                                    var $childBtnCtn_item = $('<div class="childBtnCtn-item" c="'+ ran +'" type="'+ data.config.ListChannel[i].ContentShowType +'"><div class="btn-group-vertical"><button class="addServ btn btn-xs btn-primary"  data-toggle="modal" data-target="#editC"><span class="glyphicon glyphicon-plus"></span> 添加服务</button><button class="changeServ btn btn-xs btn-primary"><span class="glyphicon glyphicon-th"></span> 切换方式</button></div><div class="childScrollCtn"></div></div>');
                                    $('.childBtnCtn').append($childBtnCtn_item);
                                    for(var j=0; j<data.config.ListChannel[i].Values.length; j++) {
                                        // 服务
                                        var params = '';
                                        for(var key in data.config.ListChannel[i].Values[j]) {
                                            if(key == 'ValueType') {
                                                data.config.ListChannel[i].Values[j][key]--;
                                            }
                                            params += key+'="'+ (''+ data.config.ListChannel[i].Values[j][key] || '').replace(/\"/g, '\'') +'" ';
                                        }
                                        var img = data.config.ListChannel[i].Values[j].Pic ? '<img src="'+ data.config.ListChannel[i].Values[j].Pic +'">' : '';
                                        if(data.config.ListChannel[i].Values[j].ValueType == 2) {
                                            img = '';
                                        }
                                        $('.childScrollCtn', $childBtnCtn_item).append('<div class="serv-item" index="'+ data.config.ListChannel[i].Values[j].Seq +'" _style="'+ (data.config.ListChannel[i].Values[j].ValueType) +'" '+ params +'  DR_drag="3" DR_replace="1"><div class="btn-group-vertical"><button class="editServ btn btn-xs btn-primary" data-toggle="modal" data-target="#editC"><span class="glyphicon glyphicon-pencil"></span> 编辑服务</button><button class="delServ btn btn-xs btn-primary"><span class="glyphicon glyphicon-trash"></span> 删除服务</button></div>'+ img +'<div class="editorText">'+ data.config.ListChannel[i].Values[j].Text +'</div><i class="drag"></i></div>');
                                        if(+$childBtnCtn_item.attr('type')) {// 纵排
                                            $childBtnCtn_item.find('.serv-item').removeClass().addClass('serv-item width1 serv-item-left');
                                            $('.serv-item', $childBtnCtn_item).addClass('serv-item-h');
                                            $('.childScrollCtn', $childBtnCtn_item).css('overflow', 'auto');
                                            $childBtnCtn_item.find('img').addClass('img_col').siblings('.editorText').addClass('p_col');
                                            if(data.config.ListChannel[i].Values[j].ValueType == 2) {
                                                $('.serv-item', $childBtnCtn_item).addClass('serv-item-editor');
                                            }
                                        }else {
                                            $childBtnCtn_item.find('.serv-item').removeClass().addClass('serv-item width4');
                                            $('.serv-item', $childBtnCtn_item).removeClass('serv-item-h');
                                            $('.childScrollCtn', $childBtnCtn_item).css('overflow', 'visible');
                                            $childBtnCtn_item.find('img').addClass('img_row').siblings('.editorText').addClass('p_row');
                                        }
                                    }
                                    
                                    // 频道、频道框排列
                                    if(data.config.ChannelShowType) {// 纵排
                                        $('.parentBtn-item').removeClass().addClass('parentBtn-item width1');
                                    }else {
                                        $('.parentBtn-item').removeClass().addClass('parentBtn-item width'+ (i+1));
                                    }
                                    if(data.config.ChannelShowType) {// 纵排
                                        //$('.childBtnCtn-item').removeClass().addClass('childBtnCtn-item height'+ (i+1));
                                        //$('.childBtnCtn').addClass('height'+ (i+1));
                                    }
                                    
                                }
                            }
                        }
                    },
                });
            });
            // 删除
            $('body').on('click', '.delThisWin', function() {
                This.$tr = $(this).parents('tr');
                Base.request({
                    url: 'ChatWindowConfig/delete',
                    params: {
                        id: This.$tr.attr('id')
                    },
                    callback: function(data) {
                        if(data.status) {
                            Base.gritter(data.message, false);
                        }else {
                            Base.gritter(data.message, true);
                            getWins();
                        }
                    },
                });
            });

            // 新建
            $('.bigNav a:eq(0)').on('shown.bs.tab', function (e) {
                if(!$('.winName').text()) {
                    $('#winModal').modal('show');
                }
            })
            // 列表
            $('.bigNav a:eq(1)').on('shown.bs.tab', function (e) {
                getWins();
            })
        },
        // 创建新窗口
        createWin: function() {
            $('#winModal').on('show.bs.modal', function() {
                var text = $('.winName').text();
                if(text) {
                    $('[data-dismiss]').show();
                }else {
                    $('[data-dismiss]').hide();
                }
            });
            $('#winModal').on('hide.bs.modal', function() {
                $('.winNameInput').val('');
                var text = $('.winName').text();
                if(text) {
                    $('[data-dismiss]').show();
                }else {
                    return false;
                }
            });
            $('.editWinName').on('click', function() {
                $('.winNameInput').val($('.winName').text());
            });
            // 确认名称
            $('.ensureName').on('click', function() {
                if($('.winName').text()) {// 修改
                    Base.request({
                        url: 'ChatWindowConfig/update',
                        params: {
                            id: window.config.Id,
                            name: $('.winNameInput').val()
                        },
                        callback: function(data) {
                            if(data.status) {
                                Base.gritter(data.message, false);
                            }else {
                                Base.gritter(data.message, true);
                                $('.winName').text(data.config.Name).attr('Id', data.config.Id);
                                $('#winModal').modal('hide');
                            }
                        },
                    });
                }else {// 新增
                    Base.request({
                        url: 'ChatWindowConfig/create',
                        params: {
                            name: $('.winNameInput').val()
                        },
                        callback: function(data) {
                            if(data.status) {
                                Base.gritter(data.message, false);
                            }else {
                                Base.gritter(data.message, true);
                                $('.winName').text(data.config.Name).attr('Id', data.config.Id);
                                $('#winModal').modal('hide');
                                window.config = data.config;
                                // 更新
                                Base.request({
                                    url: 'ChatWindowConfig/update',
                                    params: {
                                        id: data.config.Id,
                                        name: data.config.Name,
                                        channelShowType: data.config.ChannelShowType || 0// 0-横放 1-竖放
                                    },
                                    callback: function(data) {
                                        if(data.status) {
                                            Base.gritter(data.message, false);
                                        }else {
                                            $('.winName').attr('ChannelShowType', data.config.ChannelShowType);
                                        }
                                    },
                                });
                            }
                        },
                    });
                }
            });
        },
        // 富文本
        ueditor: function() {
            this.editor = UE.getEditor('servEditor', {
                initialFrameHeight: 100,
            });
        },
        // 颜色选择器
        gradX: function() {
            var This = this;
            $(document).on('contextmenu', function(e) {  
                $('.pickerColor').show();
                if($('.CM_contextmenu')[0]) {  
      
                }else {
                    var $style = $('<style>.CM_contextmenu{width:200px;padding:2px 0;position:fixed;z-index:99999;background:#fff;border:1px solid #ddd;}.CM_head {border-bottom: 1px solid #dcdcdc;}.CM_head, .CM_item{padding:5px 10px;position:relative;cursor:default;font-size:12px;}.CM_item:hover{color:#fff;background:#4281F4;}</style>').appendTo('head');  
                    var $div = $('<div class="CM_contextmenu"><div class="CM_cosBlock CM_head">选择下列块设置颜色</div><div class="CM_block CM_item" index="1">块1</div><div class="CM_block CM_item" index="2">块2</div><div class="CM_block CM_item" index="3">块3</div><div class="CM_block CM_item" index="4">块4</div><div class="CM_saveBlock CM_item">保存当前颜色</div><div class="CM_closeBlock CM_item">关闭颜色选择器</div>').appendTo('body');  
                }  
      
                $('.CM_contextmenu').show().css({  
                    left: e.clientX,  
                    top: e.clientY,  
                });  
      
                return false;  
            });  
      
            //隐藏菜单
            $('body').on('click', function(e) {  
                if(!$(e.target).is('.CM_contextmenu') && !$(e.target).is('.CM_item, .CM_cosBlock')) {  
                    $('.CM_contextmenu').hide();  
                }  
            });

            // 显示pickercolor
            $('body').on('click', function(e) {  
                // 选择某个块
                if($(e.target).is('.CM_block')) {  
                    $('.CM_contextmenu').hide();  
                    $('#gradX').show();  
                    var $pickerColor = $('.pickerColor'+ $(e.target).attr('index'));
                    This.$block = $pickerColor.parent();
                    This.createGradX(This.$block.attr('pickercolor'));
                }
                // 保存当前颜色
                if($(e.target).is('.CM_saveBlock')) {  
                    var bgColor = [];
                    $('.pickerColor').parent().each(function(i) {
                        bgColor.push($(this).attr('pickercolor') || '');
                    });
                    Base.request({
                        url: 'ChatWindowConfig/update',
                        params: {
                            id: window.config.Id,
                            name: window.config.Name,
                            bgColor: JSON.stringify(bgColor)
                        },
                        callback: function(data) {
                            if(data.status) {
                                Base.gritter(data.message, false);
                            }else {
                                Base.gritter(data.message, true);
                                $('.CM_contextmenu').hide();  
                                $('#gradX').hide();  
                                $('.pickerColor').hide();
                            }
                        },
                    });
                }
                // 关闭颜色选择器
                if($(e.target).is('.CM_closeBlock')) {  
                    $('.CM_contextmenu').hide();  
                    $('#gradX').hide();  
                    $('.pickerColor').hide();
                }
            });
        },
        // 创建pickercolor
        createGradX: function(colorArr) {
            var This = this,
                type = 'linear',
                direction = 'left',
                targets = [This.$block],
                sliders = [];
            if(colorArr) {
                if(colorArr.indexOf('linear')+1) {
                    type = 'linear';
                }
                if(colorArr.indexOf('circle')+1) {
                    type = 'circle';
                }
                if(colorArr.indexOf('ellipse')+1) {
                    type = 'ellipse';
                }
                direction = colorArr.match(/-gradient\(([a-zA-Z\s]+)\s,/)[1];
                direction = direction=='center' ? 'center center' : direction;
                var copy = JSON.parse(colorArr)[0];
                for(var i in copy) {
                    sliders[i] = {};
                    for(var j in copy[i]) {
                        sliders[i].color = copy[i][0];
                        sliders[i].position = copy[i][1];
                    }
                }
            }
            gradX("#gradX", {  
                type: type,
                direction: direction,
                targets: [this.$block],
                sliders: sliders,
                change: function(stops, styles) {  
                    This.$block.attr('pickercolor', JSON.stringify([stops, styles]));
                    if(!$('.dragMove')[0]) {
                        $('#gradX').append('<span class="dragMove drag glyphicon glyphicon-move"></span>');
                    }
                }  
            });
        },
        // 频道操作
        parentHandle: function() {
            var This = this;
            // 添加跳转
            $('.addLink').on('click', function() {
                window.addLink = true;
                $('#editC').modal('show');
                $('#editC li').hide();
                $('.c_link').parents('.form-group').show();
            });
            // 编辑跳转
            $('body').on('click', '.editQuick', function() {
                window.addLink = true;
                window.$quickBtn_item = $(this).parents('.quickBtn-item');
                $('#editC li:not(:first)').hide();
                $('.c_link').parents('.form-group').show();
                $('.c_name').val(window.$quickBtn_item.attr('text'));
                $('.c_img').val(window.$quickBtn_item.attr('pic'));
                $('.c_link').val(window.$quickBtn_item.attr('link'));
            });
            // 删除跳转
            $('body').on('click', '.delQuick', function() {
                var $p = $(this).parents('.quickBtn-item');

                Base.request({
                    url: 'ChatBanner/delete',
                    params: {
                        id: $p.attr('id')
                    },
                    callback: function(data) {
                        if(data.status) {
                            Base.gritter(data.message, false);
                        }else {
                            Base.gritter(data.message, true);
                            $p.remove();
                        }
                    },
                });
            });
            $('#editP').on('hide.bs.modal', function() {
                $('input', this).val('');
            });
            // 添加频道
            $('#editP .ensure').on('click', function() {
                var name = $('#editP [name]').val();
                if(name.length && name.length<=4) {// 最多4个字
                    if(window.$parentBtn_item) {// 修改
                        Base.request({
                            url: 'Channel/update',
                            params: {
                                channelId: window.$parentBtn_item.attr('Id'),
                                name: name,
                                seq: window.$parentBtn_item.attr('seq'),
                                contentShowType: window.$parentBtn_item.attr('contentShowType')
                            },
                            callback: function(data) {
                                if(data.status) {
                                    Base.gritter(data.message, false);
                                }else {
                                    Base.gritter(data.message, true);
                                    $('#editP').modal('hide');
                                    $('p', window.$parentBtn_item).text(name);
                                }
                            },
                        });
                    }else {// 新增
                        Base.request({
                            url: 'Channel/create',
                            params: {
                                configId: $('.winName').attr('Id'),
                                name: name,
                                seq: (This.maxIndex($('.parentBtnCtn .parentBtn-item'))+1),
                                contentShowType: 0
                            },
                            callback: function(data) {
                                if(data.status) {
                                    Base.gritter(data.message, false);
                                }else {
                                    $('#editP').modal('hide');
                                    Base.gritter(data.message, true);
                                    $('.childBtnCtn').hide();
                                    $('.height').remove();
                                    var ran = (''+ Math.random()).replace(/\./, '');
                                    This.parentNum++;
                                    var params = '';
                                    for(var key in data.channel) {
                                        params += key+'="'+ (''+ data.channel[key] || '') +'" ';
                                    }
                                    $('.parentBtnCtn').append('<div class="parentBtn-item" p="'+ ran +'" index="'+ (This.maxIndex($('.parentBtnCtn .parentBtn-item'))+1) +'" '+ params +'  DR_drag="2" DR_replace="1"><div class="btn-group-vertical"><button class="showChild btn btn-xs btn-primary"><span class="glyphicon glyphicon-th"></span> 显示频道</button><button class="editChild btn btn-xs btn-primary" data-toggle="modal" data-target="#editP"><span class="glyphicon glyphicon-pencil"></span> 编辑频道</button><button class="delChild btn btn-xs btn-primary"><span class="glyphicon glyphicon-trash"></span> 删除频道</button></div><p>'+ name +'</p><i class="drag"></i></div>');
                                    $('.childBtnCtn').append('<div class="childBtnCtn-item" c="'+ ran +'" type="0"><div class="btn-group-vertical"><button class="addServ btn btn-xs btn-primary"  data-toggle="modal" data-target="#editC"><span class="glyphicon glyphicon-plus"></span> 添加服务</button><button class="changeServ btn btn-xs btn-primary"><span class="glyphicon glyphicon-th"></span> 切换方式</button></div><div class="childScrollCtn"></div></div>');
                                    if(This.channelStyle) {// 纵排
                                        $('.parentBtn-item').removeClass().addClass('parentBtn-item width1');
                                    }else {
                                        $('.parentBtn-item').removeClass().addClass('parentBtn-item width'+ This.parentNum);
                                    }
                                    if(This.channelStyle) {// 纵排
                                        //$('.childBtnCtn-item').removeClass().addClass('childBtnCtn-item width'+ This.parentNum);
                                    }
                                }
                            },
                        });
                    }
                }else {
                    Base.gritter('请输入频道名称，最多4个字', false);
                }
            });
            // 编辑频道-新增
            $('body').on('click', '.addParent', function() {
                window.$parentBtn_item = null;
            });
            // 编辑频道-修改
            $('body').on('click', '.editChild', function() {
                window.$parentBtn_item = $(this).parents('.parentBtn-item');
                $('#editP [name]').val(window.$parentBtn_item.attr('channelname'));
            });
            // 删除频道
            $('body').on('click', '.delChild', function() {
                var $p = $(this).parents('.parentBtn-item'),
                    ran = $p.attr('p');
                Base.request({
                    url: 'Channel/delete',
                    params: {
                        channelId: $p.attr('id')
                    },
                    callback: function(data) {
                        if(data.status) {
                            Base.gritter(data.message, false);
                        }else {
                            Base.gritter(data.message, true);
                            This.parentNum--;
                            $p.remove();
                            $('[c='+ ran +']').remove();
                            $('.height').remove();
                            $('.childBtnCtn').hide();
                            if(!This.channelStyle) {
                                $('.parentBtn-item').removeClass().addClass('parentBtn-item width'+ This.parentNum);
                            }
                        }
                    },
                });
            });
            // 切换频道方式
            $('body').on('click', '.changeParent', function() {
                Base.request({
                    url: 'ChatWindowConfig/update',
                    params: {
                        id: $('.winName').attr('id'),
                        name: $('.winName').text(),
                        channelShowType: +!+$('.winName').attr('channelshowtype')// 0-横放 1-竖放
                    },
                    callback: function(data) {
                        if(data.status) {
                            Base.gritter(data.message, false);
                        }else {
                            Base.gritter(data.message, true);
                            $('.winName').attr('ChannelShowType', data.config.ChannelShowType);
                            $('.height').remove();
                            $('.childBtnCtn').hide();
                            This.channelStyle = data.config.ChannelShowType;
                            if(This.channelStyle) {// 纵排
                                $('.parentBtn-item').removeClass().addClass('parentBtn-item width1');
                            }else {
                                $('.parentBtn-item').removeClass().addClass('parentBtn-item width'+ This.parentNum);
                            }
                        }
                    },
                });
            });
            // 显示子频道
            $('body').on('click', '.showChild', function() {
                var $p = $(this).parents('.parentBtn-item'),
                    ran = $p.attr('p');
                if(This.channelStyle) {// 纵排
                    $('.height').remove();
                    $p.after('<div class="height height'+ This.parentNum +'"></div>');
                    $('.childBtnCtn').removeClass().addClass('childBtnCtn height'+ This.parentNum +' top'+ $p.attr('index'));
                }
                $('.childBtnCtn').show();
                $('[c='+ ran +']').show().siblings().hide();
            });
            var pageNo = 1,
                pageSize = 10;
            getQues();
            // 获取问题
            function getQues() {
                Base.request({
                    url: 'question/listQue',
                    params: {
                        pageNo: pageNo,
                        pageSize: pageSize
                    },
                    callback: function(data) {
                        if(data.status) {
                            Base.gritter(data.message, false);
                        }else {
                            var html ='';
                            if(data.ListQue[0]) {
                                for(var i=0; i<data.ListQue.length; i++) {
                                    var params = '';
                                    for(var key in data.ListQue[i]) {
                                        params += key+'="'+ (''+ data.ListQue[i][key] || '') +'" ';
                                    }
                                    var checked = '';
                                    if(!i) {
                                        checked = 'checked';
                                    }
                                    html += '<tr '+ params +'><td><input type="radio" name="text" value="'+ data.ListQue[i].Question +'" '+ checked +'></td><td>'+ data.ListQue[i].Question +'</td></tr>';
                                }

                                var options = {
                                    currentPage: data.currentPage,
                                    totalPages: data.totlePages ? data.totlePages : 1,
                                    alignment: 'right',
                                    onPageClicked: function(event, originalEvent, type, page) {
                                        pageNo = page;
                                        getQues();
                                    }
                                };
                                $('#itemContainer2').bootstrapPaginator(options);
                            }else {
                                html += '<tr class="emptyTip"><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
                                $('#itemContainer2').empty();
                            }
                            $('.tbody2').empty().append(html);
                            $('.timeTip').tooltip();

                            
                        }
                    },
                });
            }
            /*// 添加服务-新增
            $('body').on('click', '.addParent', function() {
                window.$parentBtn_item = null;
            });
            // 添加服务-修改
            $('body').on('click', '.editChild', function() {
                window.$parentBtn_item = $(this).parents('.parentBtn-item');
                $('#editP [name]').val(window.$parentBtn_item.attr('channelname'));
            });*/
            // 掉出添加服务
            $('body').on('click', '.addServ', function() {
                window.$childBtnCtn_item = $(this).parents('.childBtnCtn-item');
                $('#editC li').show();
                window.addLink = false;
                $('.c_link').parents('.form-group').hide();
            });
            // 掉出修改服务
            $('body').on('click', '.editServ', function() {
                window.$childBtnCtn_item = $(this).parents('.childBtnCtn-item');
                var $p = window.$serv_item = $(this).parents('.serv-item');

                var style = $p.attr('_style');
                $('#editC li a:eq('+ style +')').tab('show');
                $('#editC li').hide();

                $('.c_name').val($p.attr('text'));
                $('.c_img').val($p.attr('pic'));
                This.editor.setContent($p.attr('text'));
                window.addLink = false;
                $('.c_link').parents('.form-group').hide();
            });
            // 添加服务
            $('#editC .ensure').on('click', function() {
                if(window.addLink) {// 链接
                    if($('.c_name').val() || Base.url($('.c_img').val())) {
                        if(Base.url($('.c_link').val())) {
                            if(window.$quickBtn_item) {// 修改
                                request({
                                    url: 'ChatBanner/update',
                                    params: {
                                        id: window.$quickBtn_item.attr('id'),
                                        configId: window.config.Id,
                                        seq: window.$quickBtn_item.attr('seq')
                                    },
                                    $formObj: $('.form0'),//被序列化的form表单
                                    callback: function(data) {
                                        if(data.status) {
                                            Base.gritter(data.message, false);
                                        }else {
                                            Base.gritter(data.message, true);
                                            for(var key in data.banner) {
                                                window.$quickBtn_item.attr(key, data.banner[key]||'');
                                            }
                                            if(data.banner.Pic) {
                                                $('p', window.$quickBtn_item).text(data.banner.Text).removeClass('link_p_60');
                                                $('img', window.$quickBtn_item).attr('src', data.banner.Pic).show();

                                            }else {
                                                $('p', window.$quickBtn_item).text(data.banner.Text).addClass('link_p_60');
                                                $('img', window.$quickBtn_item).attr('src', data.banner.Pic).hide();
                                            }
                                            $('#editC').modal('hide');
                                        }
                                    },
                                });
                            }else {// 新增
                                var $p = $('.quickCtn');
                                if($('.quickBtn-item', $p).length == 5) {
                                    Base.gritter('最多5个跳转', false);
                                    return;
                                }
                                request({
                                    url: 'ChatBanner/create',
                                    params: {
                                        configId: window.config.Id,
                                        seq: (This.maxIndex($('.quickBtn-item'))+1)
                                    },
                                    $formObj: $('.form0'),//被序列化的form表单
                                    callback: function(data) {
                                        if(data.status) {
                                            Base.gritter(data.message, false);
                                        }else {
                                            Base.gritter(data.message, true);
                                            $('#editC').modal('hide');
                                            var ran = (''+ Math.random()).replace(/\./, '');
                                            var params = '';
                                            for(var key in data.banner) {
                                                params += key+'="'+ (''+ data.banner[key] || '') +'" ';
                                            }
                                            $('.quickChildCtn').append('<div class="quickBtn-item" p="'+ ran +'" index="'+ (This.maxIndex($('.quickCtn .quickBtn-item'))+1) +'" '+ params +' DR_drag="4" DR_replace="1"><div class="btn-group-vertical"><button class="editQuick btn btn-xs btn-primary" data-toggle="modal" data-target="#editC"><span class="glyphicon glyphicon-pencil"></span> 编辑跳转</button><button class="delQuick btn btn-xs btn-primary"><span class="glyphicon glyphicon-trash"></span> 删除跳转</button></div>'+ (data.banner.Pic?'<img class="link_img" src="'+ data.banner.Pic +'">':'<img class="link_img" src="'+ data.banner.Pic +'" style="display: none;">') +'<p class="link_p '+ (data.banner.Pic?'':'link_p_60') +'">'+ data.banner.Text +'</p><i class="drag"></i></div>');
                                        }
                                    },
                                });
                            }
                        }else {
                            Base.gritter('链接不正确', false);
                        }
                    }else {
                        Base.gritter('名称和图片至少填写一项或图片链接不正确', false);
                    }
                }else {// 服务
                    if(window.$serv_item) {// 修改
                        var style = window.$serv_item.attr('_style');
                        $('.editC li a:eq('+ style +')').tab('show');
                        $('#editC li').each(function(i) {
                            if($(this).is('.active')) {
                                if(i == 0) {
                                    if($('.c_name').val() || Base.url($('.c_img').val())) {
                                        addServ($('.form'+ i), i, true);
                                    }else {
                                        Base.gritter('名称和图片至少填写一项或图片链接不正确', false);
                                    }
                                }
                                if(i == 1) {
                                    if(+window.$childBtnCtn_item.attr('type')) {
                                        addServ($('.form'+ i), i, true);
                                    }else {
                                        Base.gritter('知识库问题仅支持竖向排列', false);
                                    }
                                }
                                if(i == 2) {
                                    if(+window.$childBtnCtn_item.attr('type')) {
                                        addServ($('.form'+ i), i, true);
                                    }else {
                                        Base.gritter('自定义内容仅支持竖向排列且同频道下不能有其他服务', false);
                                    }
                                }
                            }
                        });
                    }else {// 新增
                        $('#editC li').each(function(i) {
                            if($(this).is('.active')) {
                                if(i == 0) {
                                    if($('.c_name').val() || Base.url($('.c_img').val())) {
                                        addServ($('.form'+ i), i);
                                    }else {
                                        Base.gritter('名称和图片至少填写一项或图片链接不正确', false);
                                    }
                                }
                                if(i == 1) {
                                    if(+window.$childBtnCtn_item.attr('type')) {
                                        addServ($('.form'+ i), i);
                                    }else {
                                        Base.gritter('知识库问题仅支持竖向排列', false);
                                    }
                                }
                                if(i == 2) {
                                    if(+window.$childBtnCtn_item.attr('type') && !$('.serv-item', window.$childBtnCtn_item).length) {
                                        addServ($('.form'+ i), i);
                                    }else {
                                        Base.gritter('自定义内容仅支持竖向排列且同频道下不能有其他服务', false);
                                    }
                                }
                            }
                        });
                    }
                }
            });
            $('#editC').on('hide.bs.modal', function() {
                window.$serv_item = null;
                $('.form0 input').val('');
                This.editor.setContent('');
                window.$quickBtn_item = null;
            });
            function addServ($form, style, edit) {
                var $p = window.$childBtnCtn_item,
                    ran = window.$childBtnCtn_item.attr('c'),
                    suffix = '';
                if(style == 2) {// 富文本
                    suffix = '?text='+ This.editor.getContent();
                }
                if(edit) {// 修改
                    request({
                        url: 'ChannelValues/update'+ suffix,
                        params: {
                            id: window.$serv_item.attr('id'),
                            channelId: $('[p='+ ran +']').attr('id'),
                            valueType: +window.$serv_item.attr('_style')+1,
                            seq: (This.maxIndex($('.serv-item', $p))+1)
                        },
                        $formObj: $form,
                        callback: function(data) {
                            if(data.status) {
                                Base.gritter(data.message, false);
                            }else {
                                Base.gritter(data.message, true);
                                for(var key in data.values) {
                                    window.$serv_item.attr(key, (''+data.values[key]||'').replace(/\"/g, '\''));
                                }
                                if(style == 2) {// 富文本
                                    $('.editorText', window.$serv_item).empty().append(data.values.Text);
                                }else {
                                    $('.editorText', window.$serv_item).text(data.values.Text);
                                    $('.img_row', window.$serv_item).attr('src', data.values.Pic);
                                }
                                $('img', window.$serv_item).text(data.values.Pic);
                                $('#editC').modal('hide');
                            }
                        },
                    });
                }else {// 新增
                    if($('.serv-item', $p).length == 20) {
                        Base.gritter('该频道最多20个服务', false);
                        return;
                    }
                    request({
                        url: 'ChannelValues/create'+ suffix,
                        params: {
                            channelId: $('[p='+ ran +']').attr('id'),
                            valueType: style+1,
                            seq: (This.maxIndex($('.serv-item', $p))+1)
                        },
                        $formObj: $form,
                        callback: function(data) {
                            if(data.status) {
                                Base.gritter(data.message, false);
                            }else {
                                Base.gritter(data.message, true);
                                $('#editC').modal('hide');
                                var params = '';
                                for(var key in data.values) {
                                    params += key+'="'+ (''+ data.values[key] || '').replace(/\"/g, '\'') +'" ';
                                }
                                var img = data.values.Pic ? '<img src="'+ data.values.Pic +'">' : '';
                                if(style == 2) {
                                    img = '';
                                }
                                $('.childScrollCtn', $p).append('<div class="serv-item" index="'+ (This.maxIndex($('.serv-item', $p))+1) +'" _style="'+ style +'" '+ params +'  DR_drag="3" DR_replace="1"><div class="btn-group-vertical"><button class="editServ btn btn-xs btn-primary" data-toggle="modal" data-target="#editC"><span class="glyphicon glyphicon-pencil"></span> 编辑服务</button><button class="delServ btn btn-xs btn-primary"><span class="glyphicon glyphicon-trash"></span> 删除服务</button></div>'+ img +'<div class="editorText">'+ data.values.Text +'</div><i class="drag"></i></div>');
                                if(+$p.attr('type')) {// 纵排
                                    $p.find('.serv-item').removeClass().addClass('serv-item width1 serv-item-left');
                                    $('.serv-item', $p).addClass('serv-item-h');
                                    $('.childScrollCtn', $p).css('overflow', 'auto');
                                    $p.find('img').addClass('img_col').siblings('.editorText').addClass('p_col');
                                    if(style == 2) {
                                        $('.serv-item', $p).addClass('serv-item-editor');
                                    }
                                }else {
                                    $p.find('.serv-item').removeClass().addClass('serv-item width4');
                                    $('.serv-item', $p).removeClass('serv-item-h');
                                    $('.childScrollCtn', $p).css('overflow', 'visible');
                                    $p.find('img').addClass('img_row').siblings('.editorText').addClass('p_row');
                                }
                            }
                        },
                    });
                }
            }
            function request(options) {
                var params = {//必须参数
                        //
                    },
                    defaults = {
                        prefix: '../../',//接口路径前缀(不能写根路径)
                        $formObj: $(),//被序列化的form表单
                        dataObj: {},
                        callback: function(){},//回调函数
                    },

                options = $.extend({}, defaults, options);
                formData = $.extend({}, Base.formatSeriData((options.$formObj.serialize())), options.dataObj);//中文乱码,使用decodeURIComponent解码即可
                $.ajax({
                    url: encodeURI(options.prefix + (options.url || '...')),//...为基础地址
                    type: 'get',
                    dataType: options.dataType || 'json',
                    data: $.extend({}, params, options.params, formData),
                    cache: false,//IE下有用
                    success: function(data) {
                        if(data) {
                            options.callback(data);
                        }
                    }
                });
            }
            // 切换服务方式
            $('body').on('click', '.changeServ', function() {
                var $p = $(this).parents('.childBtnCtn-item'),
                    ran = $p.attr('c'),
                    contentshowtype = +$('[p='+ ran +']').attr('contentshowtype')==1?0:1;// 应该要改变成的类型
                if($('[_style=1], [_style=2]', $p)[0]) {
                    Base.gritter('该频道含有知识库问题或自定义内容，不能切换', false);
                    return;
                }
                Base.request({
                    url: 'Channel/update',
                    params: {
                        channelId: $('[p='+ ran +']').attr('Id'),
                        name: $('[p='+ ran +']').attr('channelname'),
                        seq: $('[p='+ ran +']').attr('seq'),
                        contentShowType: contentshowtype
                    },
                    callback: function(data) {
                        if(data.status) {
                            Base.gritter(data.message, false);
                        }else {
                            Base.gritter(data.message, true);
                            $('[p='+ ran +']').attr('contentshowtype', contentshowtype);
                            $p.attr('type', +$p.attr('type')?0:1);
                            if(+$p.attr('type')) {// 纵排
                                $p.find('.serv-item').removeClass().addClass('serv-item width1 serv-item-left');
                                $('.serv-item').addClass('serv-item-h');
                                $('.childScrollCtn').css('overflow', 'auto');
                                $p.find('img').removeClass().addClass('img_col').siblings('.editorText').removeClass().addClass('p_col editorText');
                            }else {
                                $p.find('.serv-item').removeClass().addClass('serv-item width4');
                                $('.serv-item').removeClass('serv-item-h');
                                $('.childScrollCtn').css('overflow', 'visible');
                                $p.find('img').removeClass().addClass('img_row').siblings('.editorText').removeClass().addClass('p_row editorText');
                            }
                        }
                    },
                });
            });
            // 删除服务
            $('body').on('click', '.delServ', function() {
                var $p = $(this).parents('.serv-item');
                Base.request({
                    url: 'ChannelValues/delete',
                    params: {
                        id: $p.attr('id')
                    },
                    callback: function(data) {
                        if(data.status) {
                            Base.gritter(data.message, false);
                        }else {
                            Base.gritter(data.message, true);
                            $p.remove();
                        }
                    },
                });
            });
        },
        maxIndex: function($obj) {
            var num = 0;
            $obj.each(function() {
                num = +$(this).attr('index')>num ? +$(this).attr('index') :num;
            });
            return num;
        }
    }

    new App();

    function Chat() {
        this.init();
    }
    Chat.prototype = {
        init: function() {
        },
        
    }

    new Chat();
});

















































