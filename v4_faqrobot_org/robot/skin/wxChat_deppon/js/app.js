;
$(function () {
    var defaults = {
        /********************************
         *           变量区
         * @param   $window    
         * @param   $html    
         * @param   $body
         * @param   loadMask    加载框
         * @param   chatScroll    聊天框
         * @param   editCtn    底部
         * @param   textarea    输入框
         * @param   sendBtn    发送按钮
         * @param   addBtn    加号
         * @param   FA_backCtn    表情框
         * @param   editHide    底部功能区
         * @param   sendFace    表情
         * @param   keyboard    键盘按钮
         * @param   view    整个聊天页面
         * @param   sendCommonQue    常见问题按钮
         * @param   commonQueModal  常见问题模态框
         * @param   commonQueLayer  常见问题列表框
         * @param   closeCommonQue   常见问题关闭按钮
         * @param   sendFeedBack    意见反馈按钮
         * @param   feedbackModal   意见反馈模态框
         * @param   closefeedback   意见反馈关闭按钮
         * @param   leaveMsgBox   留言模态框
         * @param   shakeScreenCtn     抖屏按钮
           @param   shakeScreenModal    抖屏模态框
         * @param   MN_marginCtn   满意不满意选项
         * @param   noSatiCtn   不满意原因
         * @param   editShow    输入框部分
         * @param   sendLocation    地理位置模态框
         * @param   locationInfo    显示发送地理位置模态框按钮
         * @param   mapList    展示附近地址列表
         * @param   allmap    展示地图的div
         * @param   header    地理位置模态框头部
         * @param   locCheck    地址列表的选择框的父级span
         * @param   check    第一个地址的选择框父级span
         * @param   sendLocationId    发送地图到聊天框的按钮
         * @param   mapInput    地址列表的选择框
         * @param   closeLocation    关闭地图模态框按钮
         * @param   recordShade    录音遮罩
         * @param   iconWrapper     语音图标
         * @param   moveCancel  上滑取消
         * @param   recordTip  录音状态提示
         * @param   orderBox    我要下单弹框
         * @param   closeOrderBox   关闭下单模态框按钮
         * @param   sendEndCustom   结束人工按钮
         ********************************/
        $window: $(window),
        $html: $('html'),
        $body: $('body'),
        loadMask: $('#loadMask'),
        chatScroll: $('.chatScroll'),
        editCtn: $('.editCtn'),
        textarea: $('.textarea'),
        textareaCtn: $('.textareaCtn'),
        voiceBtn: $('.voiceBtn'),
        longTapBtn: $('#a'),
        sendBtn: $('.sendBtn'),
        addBtn: $('.addBtn'),
        FA_backCtn: $('.FA_backCtn'),
        editHide: $('.editHide'),
        sendFace: $('#sendFace'),
        keyboard: $('#keyboard'),
        keyboardCtn: $('.keyboardCtn'),
        view: $('.view'),
        sendCommonQue: $('#sendCommonQue'),
        commonQueModal: $('.commonQueModal'),
        commonQueLayer: $('#commonQueLayer'),
        closeCommonQue: $('.commonQueModal .closePage'),
        sendFeedBack: $('#sendFeedBack'),
        feedbackModal: $('.feedbackModal'),
        closefeedback: $('.feedbackModal .closePage'),
        leaveMsgBox: $('#leaveMsgBox'),
        shakeScreenCtn: 'shakeScreenCtn',
        shakeScreenModal: 'shakeScreenModal',
        MN_marginCtn: $('.MN_marginCtn'),
        noSatiCtn: $('.noSatiCtn'),
        editShow: $('.editShow'),
        sendLocation: $('.sendLocation'),
        locationInfo: $('.locationInfo'),
        mapList: $('#mapList'),
        allmap: $('#allmap'),
        header: $('.location .header'),
        locCheck: 'locCheck',
        check: 'check',
        sendLocationId: $('#sendLocation'),
        mapInput: 'mapInput',
        closeLocation: $('.sendLocation .closePage'),
        recordShade: 'record-shade',
        iconWrapper: 'icon-wrapper',
        moveCancel: 'move-cancel',
        recordTip: 'record-tip',
        orderBox: $('#orderBox'),
        closeOrderBox: $('#closeOrderBox'),
        sendEndCustom: $('#sendEndCustom')
    };

    function FAQWx(options) {
        this.options = $.extend({}, defaults, options);
        /********************************
         *           变量区
         * @param   timer    定时设置高度
         * @param   layerCtn    所有的弹出层
         * @param   isTouchMove    滑动页面失去焦点时，无需滚动最底部
         * @param   latitude    纬度
         * @param   longitude    经度
         * @param   content    选取的具体位置
         * @param   imgHtml    拼接地址的字符
         * @param   firstAddress    第一个地址信息
         * @param   pois    存储位置信息数组
         * @param   map    地图对象
         * @param   point    坐标点
         * @param   geolocation    位置信息
         * @param   Face    表情
         ********************************/
        this.timer = null;
        this.layerCtn = null;
        this.isTouchMove = false;
        this.latitude = '';
        this.longitude = '';
        this.content = '';
        this.imgHtml = '';
        this.firstAddress = '';
        this.pois = [];
        this.map = '';
        this.point = '';
        this.geolocation = '';
        this.Face = '';
        this.START = '',
            this.END = '',
            this.posStart = 0,
            this.posEnd = 0,
            this.posMove = 0,
            this.localId = '',
            this.recordTimer = null;
    }

    FAQWx.prototype = {
        /********************************
         *           方法区
         * @event   init  初始化所有方法
         * @event   set_chatScroll_height   设置聊天框的高度
         * @event   window_resize   窗口大小改变
         * @event   timerSetHeight  定时设置聊天框高度
         * @event   bindTextare    输入框输入文字、获取焦点、失去焦点事件
         * @event   hideMore    点击body出输入框部分其他位置隐藏
         * @event   commonQueModal  常见问题模态框
         * @event   chooseCommonQue   选择常见问题
         * @event   feedBackModal   意见反馈模态框
         * @event   sendLeaveMsg    留言模态框
         * @event   sendShake 点击抖屏按钮发送
         * @event   switchStatis    切换满意不满意按钮
         * @event   editSwitchBg    点击输入框下方功能图标切换背景
         * @event   getInputFocus   输入框获取焦点
         * @event   switchKeyboardFace  切换键盘和表情
         * @event   comment    人工邀请用户评价
         * @event   chatScrollMove  聊天框滑动
         * @event   autoComplete    输入引导展示框
         * @event   showFace   调用表情插件展示表情
         * @event   sendMapModal    发送地图模态框
         * @event   showLocation    显示当前位置信息
         * @event   getNearbyLoc    获取附近十个坐标点
         * @event   chooseLocation  选择发送的位置
         * @event   sendLocation    发送位置
         * @event   closeModal   关闭各种模态框
         * @event   UrlSearch   获取URL中各个参数
         * @event   voiceSwitch 切换语音和键盘图标
         * @event   getWXdata   获取微信的token
         * @event   sendVoiceOperation  发送语音文件
         * @event   closeBox  关闭操作
         ********************************/
        init: function () {
            FastClick.attach(document.body)
            this.set_chatScroll_height()
            this.window_resize()
            this.bindTextare()
            this.hideMore()
            this.commonQueModal()
            this.chooseCommonQue()
            this.feedBackModal()
            this.sendLeaveMsg()
            this.sendShake()
            this.switchStatis()
            this.editSwitchBg()
            this.getInputFocus()
            this.switchKeyboardFace()
            this.comment()
            this.chatScrollMove()
            this.showFace()
            this.sendMapModal()
            this.chooseLocation()
            this.sendLocation()
            this.closeModal()
            this.voiceSwitch()
            this.getWXdata()
            this.sendVoiceOperation()
            this.closeBox()
        },
        autoComplete: function () {
            var This = this
            This.options.textarea.autocomplete({
                url: 'servlet/appChat?s=ig&sysNum=' + FAQ.options.sysNum,
                targetEl: This.options.editShow, //参照物(用于appendTo和定位)
                posAttr: ['0rem', '0.133rem'], //外边框的定位[left bottom]
                itemNum: 5, //[int] 默认全部显示
                callback: function (data) { //获取文本后的回调函数
                    This.options.sendBtn.trigger('click');
                }
            });
        },
        bindTextare: function () {
            var This = this
            This.options.textarea.on('input', function () {
                if ($(this).val().replace(/\s+/g, '')) {
                    This.options.sendBtn.removeClass('hide');
                    This.options.addBtn.addClass('hide');
                } else {
                    This.options.sendBtn.addClass('hide');
                    This.options.addBtn.removeClass('hide');
                }
            }).on('focus', function () {
                // 工具栏收缩
                if (This.options.FA_backCtn.css('display') == 'block') {
                    This.options.editHide.hide();
                } else {
                    This.options.editHide.hide();
                }
                This.options.sendFace.removeClass('hide');
                This.options.keyboard.addClass('hide');
                This.timerSetHeight()
                    .then(function (data) {
                        FAQ.scrollbar.update()
                        FAQ.scrollbarUpdate()
                    })
            }).on('blur', function () {
                This.timerSetHeight()
                    .then(function (data) {
                        if (This.isTouchMove) {
                            This.isTouchMove = false; // 复位
                            return false;
                        }
                        FAQ.scrollbar.update()
                    })
            });
        },
        commonQueModal: function () {
            var This = this
            //常见问题
            This.options.sendCommonQue.on('click', function () {
                This.options.commonQueModal.show()
                This.options.commonQueLayer.height(This.options.commonQueModal.height() - 40)
            });
        },
        chooseCommonQue: function () {
            var This = this
            This.options.$body.on('click', function (e) {
                if (e.target.className == 'MN_queList') {
                    This.options.commonQueModal.hide();
                    This.set_chatScroll_height();
                }
                if (e.target.parentNode) {
                    if (e.target.parentNode.className == 'MN_queList') {
                        This.options.commonQueModal.hide();
                        This.set_chatScroll_height();
                    }
                }
                // 关闭各种框
                if (e.target.className == 'pull-right closePage') {
                    $(e.target).find('.closePage').trigger('click');
                }
            });
        },
        comment: function () {
            var This = this
            This.options.$body.on('click', '.RG_commentBtn', function () {
                window.uuid = $(this).attr('uuid'); // 客服要求客户评价
                This.options.sendFeedBack.trigger('click');
            });
        },
        chatScrollMove: function () {
            var This = this
            This.options.chatScroll.on('touchmove', function (e) {
                This.isTouchMove = true;
                This.options.sendFace.removeClass('hide');
                This.options.keyboard.addClass('hide');
                This.options.textarea.blur();
                This.options.editHide.hide();
            })
        },
        chooseLocation: function () {
            //点击每个位置选中
            var This = this
            This.options.$body.on('click', '#mapList li', function () {
                if ($(this).find('div').hasClass('firstLi')) {
                    $(this).find('.check').css('display', 'block')
                    $('.' + This.options.locCheck).css('display', 'none')
                    $(this).find('.check input').prop('checked', true)
                } else {
                    $('.' + This.options.locCheck).css('display', 'none')
                    $('.' + This.options.check).css('display', 'none')
                    $(this).find('.locCheck').css('display', 'block')
                    $(this).find('.locCheck input').prop('checked', true)
                }
                This.latitude = $(this).attr('lat')
                This.longitude = $(this).attr('lng')
                This.map.clearOverlays()
                var retriveInit = []
                retriveInit.push({
                    lat: This.latitude,
                    lng: This.longitude
                })
                This.point = new BMap.Point(This.longitude, This.latitude);
                This.map.centerAndZoom(This.point, 15);
                var mk = new BMap.Marker(This.point);
                This.map.addOverlay(mk);
            })
        },
        closeModal: function () {
            var This = this
            //地图
            This.options.closeLocation.on('click', function () {
                This.options.sendLocation.hide()
            })
            //常见问题
            This.options.closeCommonQue.on('click', function () {
                This.options.commonQueModal.hide()
            })
            //意见反馈
            This.options.closefeedback.on('click', function () {
                This.options.feedbackModal.hide()
            })
        },
        closeBox: function () {
            var This = this
            //关闭下单模态框
            This.options.closeOrderBox.on('click', function () {
                This.options.orderBox.hide()
            })
            //结束人工
            This.options.sendEndCustom.on('click', function () {
                FAQ.sendEndCustom()
            })
        },
        editSwitchBg: function () {
            var This = this
            This.options.$body.on('click', '.editCtn_com', function (e) {
                var that = this;
                $(that).find('.icon-ctn').addClass('active');
                setTimeout(function () {
                    $(that).find('.icon-ctn').removeClass('active');
                }, 1000);
            });
        },
        feedBackModal: function () {
            var This = this
            This.options.sendFeedBack.on('click', function () {
                This.options.feedbackModal.show()
            });
        },
        getInputFocus: function () {
            var This = this
            This.options.sendBtn.on('click.FA', function () {
                This.options.textarea.focus();
                setTimeout(function () {
                    This.options.textarea.focus();
                }, 50);
            });
        },
        getNearbyLoc: function (lat, lng) {
            var html = ''
            var This = this
            $.ajax({
                url: 'http://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=' + lat + ',' + lng + '&output=json&pois=1&ak=BaEzOp4PU6aGZvO6zR5U1Q1Woek1Uun6',
                dataType: 'jsonp',
                success: function (data) {
                    This.firstAddress = data.result.addressComponent
                    This.pois = data.result.pois
                    html = '<li lat="' + This.pois[0].point.y + '" lng="' + This.pois[0].point.x + '" content="' + This.pois[0].addr + '"><div class="firstLi">' + This.pois[0].name + '(' + This.firstAddress.district + '' + This.firstAddress.street + '' + This.firstAddress.street_number + ')</div><span class="check"><input class="mapInput" type="radio" name="address" checked/></span></li>'
                    for (var i = 0; i < This.pois.length; i++) {
                        html += '<li lat="' + This.pois[i].point.y + '" lng="' + This.pois[i].point.x + '" content="' + This.pois[i].addr + '"><div class="locList"><p class="name">' + This.pois[i].name + '</p><p class="address">' + This.pois[i].addr + '</p></div><span class="locCheck"><input type="radio" name="address" class="mapInput"/></span></li>'
                    }
                    This.options.mapList.html(html)
                    This.options.loadMask.hide()
                }
            });
        },
        getWXdata: function () {
            var This = this;
            $.ajax({
                url: '/weixin/getWeiXinSignature?appId=wxb625c16e447e061b&appSecret=da042fd1542773107e0743b7ae96f3a2&url=' + encodeURIComponent(location.href.split('#')[0]),
                type: 'post',
                success: function (data) {
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: data.appId, // 必填，公众号的唯一标识
                        timestamp: data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: data.nonceStr, // 必填，生成签名的随机串
                        signature: data.signature, // 必填，签名
                        jsApiList: [
                            "startRecord",
                            "stopRecord",
                            "onVoiceRecordEnd",
                            "playVoice",
                            "translateVoice"
                        ] // 必填，需要使用的JS接口列表
                    });
                    This.ready();
                }
            })
        },
        hideMore: function () {
            var This = this;
            //隐藏更多
            This.options.view.on('click', function (e) { //不能用body hack ios
                var _target = $(e.target);
                if (_target.is('.faceBtn') || _target.is('.expendBtn')) {
                    This.options.editHide.show();
                    if (This.options.textareaCtn.hasClass('hide')) {
                        This.options.voiceBtn.find('i').attr('class', 'iconfont icon-yuyin');
                        This.options.textareaCtn.removeClass('hide');
                        This.options.longTapBtn.addClass('hide');
                    }
                } else if (_target.is('#chatCtn') || _target.parents().is('#chatCtn')) {
                    This.options.editHide.hide();
                    This.options.sendFace.removeClass('hide');
                    This.options.keyboard.addClass('hide');
                }
                This.timerSetHeight()
                    .then(function (data) {
                        FAQ.scrollbar.update()
                        FAQ.scrollbarUpdate()
                    })
            });
        },
        set_chatScroll_height: function () {
            var winW = $(window).width(),
                winH = $(window).height();
            this.options.$html.css('fontSize', winW < 750 ? winW : 750);
            this.options.chatScroll.height(winH - this.options.editCtn.outerHeight());
        },
        sendShake: function () {
            var This = this;
            $('.' + This.options.shakeScreenCtn).on('click', function () {
                FAQ.sendShakeScreen()
                setTimeout(function () {
                    $('.' + This.options.shakeScreenCtn).removeClass('clicked')
                    $('#' + This.options.shakeScreenModal).hide()
                }, 2000)
            })
        },
        sendLeaveMsg: function () {
            var This = this
            This.options.$body.on("click", "#sendLeaveMsg,.LeaveMsg", function () {
                This.options.leaveMsgBox.css("display", "block");
                FAQ.writeMsg()
            })
        },
        switchStatis: function () {
            var This = this
            This.options.MN_marginCtn.eq(0).on('click', function () {
                This.options.noSatiCtn.hide();
            });
            This.options.MN_marginCtn.eq(1).on('click', function () {
                This.options.noSatiCtn.show();
            });
        },
        switchKeyboardFace: function () {
            var This = this
            This.options.keyboard.on('click.FA', function () {
                This.options.textarea.focus();
                $(this).addClass('hide');
                This.options.sendFace.removeClass('hide');
                This.options.editHide.hide();
            })
            This.options.sendFace.on('click.FA', function () {
                $(this).addClass('hide');
                This.options.keyboard.removeClass('hide');
                if (This.options.textareaCtn.hasClass('hide')) {
                    This.options.voiceBtn.find('i').attr('class', 'iconfont icon-yuyin');
                    This.options.textareaCtn.removeClass('hide');
                    This.options.longTapBtn.addClass('hide');
                }
            })
        },
        showFace: function () {
            var This = this
            //调用表情插件
            This.Face = This.options.textarea.face({
                src: 'src/dw/', //表情路径
                rowNum: 7, //每行最多显示数量，此属性不适用于常用语
                ctnAttr: ['0rem', '0rem', '0.133rem', '0.122rem'], //[left bottom width height] 表情框相对targetEl位置和里面的表情格子宽高  要写单位
                triggerEl: This.options.sendFace, //触发按钮(不存在则自己生成，不要由a包裹)
                targetEl: This.options.editHide, //父级参照物(用于appendTo和定位)
                hideAdv: true, //是否隐藏广告
                setMaxNum_y: 15,// 设置表情显示的行数
                callback: function () {
                    This.options.sendBtn.removeClass('hide');
                    This.options.keyboardCtn.removeClass('hide');
                    This.options.addBtn.addClass('hide');
                    This.options.sendFace.addClass('hide');
                    This.options.textarea.blur();
                    This.options.editHide.show();
                },
            });
        },
        sendMapModal: function () {
            var This = this
            This.options.sendLocation.hide()
            This.options.locationInfo.on('click', function () {
                This.options.sendLocation.show()
                This.options.editHide.hide()
                This.showLocation()
                This.options.mapList.height(This.options.sendLocation.height() - (This.options.header.height() + 30) - This.options.allmap.height())
                This.options.loadMask.show()
                This.options.mapList.scrollTop(0)
            })
        },
        showLocation: function () {
            var This = this
            This.map = new BMap.Map("allmap");
            This.point = new BMap.Point(116.331398, 39.897445);
            This.map.centerAndZoom(This.point, 15);
            This.geolocation = new BMap.Geolocation();
            This.geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    var mk = new BMap.Marker(r.point);
                    This.map.addOverlay(mk);
                    This.map.centerAndZoom(r.point, 15);
                    This.map.panTo(r.point);
                    This.latitude = r.point.lat
                    This.longitude = r.point.lng
                    This.getNearbyLoc(r.point.lat, r.point.lng)
                } else {
                    alert('failed' + this.getStatus());
                }
            }, {
                    enableHighAccuracy: true
                })
        },
        sendLocation: function () {
            var This = this
            //发送位置
            This.options.sendLocationId.on('click', function () {
                for (var i = 0; i < $('.' + This.options.mapInput).length; i++) {
                    if ($('.' + This.options.mapInput).eq(i).prop('checked')) {
                        This.latitude = $('.' + This.options.mapInput).eq(i).parents('li').attr('lat')
                        This.longitude = $('.' + This.options.mapInput).eq(i).parents('li').attr('lng')
                        This.content = $('.' + This.options.mapInput).eq(i).parents('li').attr('content')
                        This.imgHtml = '<a class="map">' + This.content + '<img src="http://api.map.baidu.com/staticimage/v2?ak=BaEzOp4PU6aGZvO6zR5U1Q1Woek1Uun6&zoom=18&center=' + This.longitude + ',' + This.latitude + '&markers=' + This.longitude + ',' + This.latitude + '"/></a>'
                        This.options.closeLocation.trigger('click')
                        FAQ.askQue(This.imgHtml)
                    }
                }
                $('.map').on('click', function () {
                    var Request = This.UrlSearch($(this).find('img').attr('src'));
                    var markers = Request.markers;
                    var content = $(this).text();
                    window.open('http://api.map.baidu.com/marker?location=' + markers.split(',')[1] + ',' + markers.split(',')[0] + '&title=我的位置&content=' + content + '&output=html', '_blank');
                });
            })
        },
        timerSetHeight: function () {
            var This = this
            var p = new Promise(function (resolve, reject) {
                var i = 0;
                clearInterval(This.timer);
                This.timer = setInterval(function () {
                    This.set_chatScroll_height();
                    if (i >= 5) {
                        resolve();
                        clearInterval(This.timer);
                    }
                    i++;
                }, 100);
            })
            return p;
        },
        UrlSearch: function (url) {
            var request = {};
            var name, value;
            var str = url; //取得整个地址栏
            var num = str.indexOf("?")
            str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

            var arr = str.split("&"); //各个参数放到数组里
            for (var i = 0; i < arr.length; i++) {
                num = arr[i].indexOf("=");
                if (num > 0) {
                    name = arr[i].substring(0, num);
                    value = arr[i].substr(num + 1);
                    request[name] = value;
                }
            }
            return request;
        },
        voiceSwitch: function () {
            var This = this;
            // 语音功能
            This.options.voiceBtn.on('click', function () {
                if (This.options.textareaCtn.hasClass('hide')) {
                    $(this).find('i').attr('class', 'iconfont icon-yuyin');
                    This.options.textareaCtn.removeClass('hide');
                    This.options.longTapBtn.addClass('hide');
                } else {
                    $(this).find('i').attr('class', 'iconfont icon-jianpan1');
                    This.options.textareaCtn.addClass('hide');
                    This.options.longTapBtn.removeClass('hide');
                }
            })
        },
        window_resize: function () {
            var This = this
            This.options.$window.on('resize', function () {
                This.set_chatScroll_height();
            });
        },
        ready: function () {
            wx.ready(function () {
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                wx.startRecord({
                    success: function () {
                        setTimeout(() => {
                            wx.stopRecord({
                                success: res => { },
                                fail: function (res) { }
                            });
                        }, 300);
                    },
                    cancel: () => {
                        alert("用户拒绝授权录音");
                    }
                });
            });
        },
        sendVoiceOperation: function () {
            var This = this;
            This.options.longTapBtn.on('touchstart', function (e) {
                e.preventDefault();
                This.startRecord(e)
            })
            This.options.longTapBtn.on('touchend', function (e) {
                e.preventDefault();
                This.stopRecord(e)
            })
            This.options.longTapBtn.on('touchmove', function (e) {
                e.preventDefault();
                This.touchMove(e)
            })
        },
        // 开始录音
        startRecord: function (event) {
            var This = this;
            START = new Date().getTime();
            posStart = event.originalEvent.targetTouches[0].pageY;
            recordTimer = setTimeout(() => {
                if ($('.' + This.options.recordShade).hasClass('hide')) {
                    $('.' + This.options.recordShade + ', .' + This.options.iconWrapper).removeClass('hide');
                    $('.' + This.options.moveCancel).addClass('hide');
                }
                wx.startRecord({
                    success: function () { },
                    cancel: () => {
                        $('.' + This.options.recordShade + ', .' + This.options.iconWrapper).addClass('hide');
                        alert("用户拒绝授权录音");
                    }
                });
            }, 300);
        },
        // 停止录音
        stopRecord: function (event) {
            var This = this;
            END = new Date().getTime();
            posEnd = event.originalEvent.changedTouches[0].pageY;
            // 上划150像素，取消录音
            if (posStart - posEnd > 100) {
                $('.' + This.options.recordShade + ', .' + This.options.moveCancel).addClass('hide')
                wx.stopRecord();
                return;
            }

            if (END - START < 300) {
                This.initShow();
                // 点击提示“录音时间太短”
                $('.' + This.options.recordShade + ', .' + This.options.recordTip).removeClass('hide');
                setTimeout(() => {
                    This.initShow();
                }, 1000);

                END = 0;
                START = 0;
                //小于300ms，不录音
                clearTimeout(recordTimer);
            } else {
                $('.' + This.options.recordShade + ', .' + This.options.iconWrapper).addClass('hide')
                wx.stopRecord({
                    success: res => {
                        $('.' + This.options.recordShade + ', .' + This.options.iconWrapper).addClass('hide')
                        localId = res.localId;
                        This.translateVoice();
                    },
                    fail: function (res) {
                        // alert(JSON.stringify(res));
                    }
                });
            }
        },
        // 播放语音
        playVoice: function () {
            wx.playVoice({
                localId: localId, // 需要播放的音频的本地ID，由stopRecord接口获得
                success: function () { },
                fail: function (res) {
                    alert(resizeTo);
                }
            });
        },
        // 语音转文字
        translateVoice: function () {
            //sendAudio();
            wx.translateVoice({
                localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: res => {
                    FAQ.askQue(res.translateResult)// 语音识别的结果
                }
            });
        },
        // 上划动作
        touchMove: function (event) {
            var This = this;
            posMove = 0;
            posMove = event.originalEvent.targetTouches[0].pageY;
            if (posStart - posMove > 100) {
                $('.' + This.options.iconWrapper).addClass('hide')
                $('.' + This.options.moveCancel).removeClass('hide')
            } else {
                $('.' + This.options.moveCancel).addClass('hide')
                $('.' + This.options.iconWrapper).removeClass('hide')
            }
        },
        //隐藏所有
        initShow: function () {
            var This = this
            $('.' + This.options.recordShade + ', .' + This.options.iconWrapper + ', .' + This.options.moveCancel + ', .' + This.options.recordTip).addClass('hide')
        }
    }
    var FAQWX = new FAQWx({});
    FAQWX.init();
    var FAQ = new Faqrobot({
        interface: 'servlet/appChat',
        logoUrl: 'robot/skin/wxChat_deppon/images/logo@2x.png', //logo地址 ----------
        logoId: 'logo', // ----------
        webNameId: 'MN_logoWord', //公司名称Id
        intelTitleChange: true, // 智能聊天是否修改标题
        intelTitle: '', // 智能聊天时的标题
        artiTitleChange: true, // 人工时是否修改标题
        artiTitle: '人工客服', // 人工时的标题
        titleInsteadId: 'title', // 代替标题Id
        shakeScreenModal: 'shakeScreenModal',//抖屏模态框
        showMyOrder: 'showMyOrder',//展示下单页面
        thirdUrlId: 'orderBox',
        kfPic: 'robot/skin/wxChat_deppon/images/robot.png', //客服图标
        kf_Robot_Pic: 'robot/skin/wxChat_deppon/images/robot.png', //机器人客服图标
        kf_Person_Pic: 'robot/skin/wxChat_deppon/images/robot.png', //人工客服图标
        kf_Robot_Name: '', //机器人客服名字，此处只是声明个变量，不用赋值
        kf_Person_Name: '', //人工客服名字
        khPic: 'robot/skin/wxChat_deppon/images/user.png', //客户图标
        formatDate: '%month%月%date%日 %hour%:%minute%:%second%', //配置时间格式(默认10:42:52 2016-06-24)
        topQueId: 'commonQueLayer', //热门、常见问题Id --------
        chatCtnId: 'chatCtn', //聊天展示Id y   --------------
        inputCtnId: 'textarea', //输入框Id y   --------
        sendBtnId: 'sendBtn', //发送按钮Id y   ------
        commentFormId: 'feedbackForm', //评论框formId -------
        commentInputCtnId: 'commentCtn', //评论输入框Id ----
        commentSendBtnId: 'commentBtn', //评论发送按钮Id ---------
        leaveMsgFormId: 'leaveMsgForm', //留言框formId ---------
        leaveMsgInputCtnId: 'leaveMsgCtn', //留言输入框Id ---------
        leaveMsgSendBtnId: 'leaveMsgBtn', //留言发送按钮Id --------
        sourceId: tmpsourceId, //客户来源
        autoOffline: false, //是否会自动下线
        preventAdjust: true,
        preventHide: false,// true:机器人聊天时 仍然显示发送文件、图片功能,地理位置
        upFileModule: { //上传文件模块
            open: true, //是否启用功能
            maxNum: 0, //最大上传数量，0为不限制
            triggerId: 'sendPic', //触发上传按钮
            startcall: function () { //上传文件前的回调
                FAQWX.set_chatScroll_height();
            },
            callback: function () { //上传文件后的回调
            },
        },
        leaveQue: { // 未知问题已回复
            open: true, //是否启用功能
        },
        noView: ['.MN_kfImg', '.MN_khImg', '.FA_upFileNoImg', '.msg-item-wrapper img'],
        faceModule: { //表情模块
            open: true, //是否启用功能
            faceObj: FAQWX.Face, //表情插件实例
        },
        initCallback: function (data) { //初始化基本信息的回调
            window.uselessReasonItems = data.uselessReasonItems;
        },
        sendCallback: function () { //点击发送按钮的回调
            $('.addBtn').removeClass('hide');
            $('#sendFace').removeClass('hide');

            $('.keyboardCtn').addClass('hide');
            $('#sendBtn').addClass('hide');

            !FAQ.robot._html && $('.textarea').focus(); // 防止键盘拉起
            setTimeout(function () {
                $('.textarea').focus();
            }, 50);
        },
        commentCallback: function () { //评论后的回调
            FAQWX.options.closefeedback.trigger('click')
        },
        leaveMsgCallback: function () { //留言后的回调
            layer.close(layerCtn);
        },
        thirdUrlCallBack: function (data, index) {//推荐链接的回调
            if (!index) index = 0;
            if (data.robotAnswer[index].thirdUrl && data.robotAnswer[index].thirdUrl.url) {
                $('#' + FAQ.options.thirdUrlId).show()
                $('#' + FAQ.options.showMyOrder).html('<iframe width="100%" style="border:none;" height="100%" src="' + data.robotAnswer[index].thirdUrl.url + '"></iframe>');
                $('#' + FAQ.options.showMyOrder + ' iframe').height($('#' + FAQ.options.thirdUrlId).height() - 45)
            }
        },
    
    });
    FAQWX.autoComplete();
});