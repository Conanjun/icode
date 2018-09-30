; $(function () {
    /********************************************
        * FaqrobotApp 构造函数以及原型对象*
        主要包含三部分:
        参数设置：定义原型对象方法中需要用到的变量
        构造函数：创建实例对象，并通过init方法进行初始化
        原型对象：定义对象常用的方法
     * *****************************************/

   /**
     * 默认参数部分
     * @param 用于存放需要用到的Dom元素或者元素的id、class值
     * 
    */
    var defaults = {
        window: $(window),
        html: $('html'),
        body: $('body'),
        chatScroll: $('.chatScroll'),// 滚动外框
        loadMask:$('#loadMask'),//初始化加载框
        view: $('.view'),//页面显示区域，用于绑定快捷服务展开/收缩事件 不能用body hack ios
        textarea: $('.textarea'),// 输入框元素
        sendBtn: $('.sendBtn'),// 发送按钮
        addBtn: $('.addBtn'),// 快捷服务展开按钮
        sendFaceBtn: $('#sendFace'), // 表情按钮
        keyboardBtn: $('#keyboard'),// 切换为键盘按钮
        faceBack: $('.FA_backCtn'),// 表情框元素
        editCtn: $('.editHide'),// 快捷服务元素
        editShow: $('.editShow'),// 输入框元素行
        sendFeedBack: $('#sendFeedBack'),//意见反馈按钮
        sendFileId: 'sendPhoto,sendPicture',//需要绑定上传文件事件的元素id
        sendfaceIconClass: 'faceBtn',// 发送表情图标按钮class值
        expendbtnIconClass: 'expendBtn',// 快捷服务栏图标按钮class值
        chatCtnId: 'chatCtn' ,// 滚动内部元素的id
        nativeBtnClass:'nativeBtn',// 跳转原生页面按钮class
        sendCommonQue: $('#sendCommonQue'),//常见问题按钮
        commonQueModal: $('.commonQueModal'),//常见问题模态框
        closeCommonQue:$('.commonQueModal .closePage'),//常见问题关闭按钮
        commonQueLayer:$('#commonQueLayer'),
        feedbackModal: $('.feedbackModal'),//意见反馈模态框
        closefeedback:$('.feedbackModal .closePage'),//意见反馈关闭按钮
        leaveMsgBox: $('#leaveMsgBox'),//留言模态框
        MN_marginCtn: $('.MN_marginCtn'),//满意不满意选项
        noSatiCtn: $('.noSatiCtn'),//不满意原因
        sendLocation: $('.sendLocation'),//地理位置模态框
        locationInfo: $('.locationInfo'),//显示发送地理位置模态框按钮
        mapList: $('#mapList'),//展示附近地址列表
        allmap: $('#allmap'),//展示地图的div
        header: $('.location .header'),//地理位置模态框头部
        locCheck: 'locCheck',//地址列表的选择框的父级span
        check: 'check',//第一个地址的选择框父级span
        sendLocationId: $('#sendLocation'),//发送地图到聊天框的按钮
        mapInput: 'mapInput',//地址列表的选择框
        closeLocation: $('.sendLocation .closePage')//关闭地图模态框按钮
    }

    /**
     * FaqrobotApp 构造函数，用于创建实例对象，并通过init方法进行初始化
     * @param options 类型对象 实例化FaqrobotApp时传入，其中可包含变量或方法
     * 使用方式：建议定制部分用到的方法以及变量通过该方式传入，对象内使用通过this.options.变量/方法名
     * 
    */
    function FaqrobotApp(options) {
        this.options = $.extend({}, defaults, options);// 合并传入参数与默认参数
        this.isTouchMove = false;// 记录当前是否处于滑动状态（作用：滑动页面失去焦点时，输入框失去焦点，但是内容无需滚动最底部）
        this.init();// 实例化时调用的方法
    }

    /**
     * FaqrobotApp 原型对象
     * 作用：方法的集合
    */
    FaqrobotApp.prototype = {
        /**
         * @function 页面加载时必要加载的方法
         * 说明：set_chatScroll_height() resize()必须在实例faqrobot前调用以及初始化表情插件、输入引导插件前调用，具体函数的作用见响应函数模块注释
         */
        init: function () {
            this.set_chatScroll_height();
            this.resize();
            this.switchFaceBtn();
            this.RGComment();
            this.hideEdit();
            this.commonQueModal();
            this.chooseCommonQue();
            this.feedBackModal();
            this.sendLeaveMsg();
            this.switchStatis();
            this.sendMapModal();
            this.chooseLocation();
            this.sendLocation();
            this.closeModal();
        },
        /**
         *  @function 在Faqrobot 类实例化以后才可执行的方法，这些方法中需要用到FAQ对象中的方法
         *
         */
        afterInstant: function () {
            this.bindFileup();
            this.bindTextare();
            this.quickServChange();
        },
        /**
         * @function 设置屏幕尺寸方法
         * 作用：设置页面聊天内容显示区域的尺寸，在聊天区域尺寸发生改变时调用，一般结合定时器使用提高准确性
         * @example 展开/收缩快捷服务区域时
         */
        set_chatScroll_height: function () {
            var winW = $(window).width(),
                winH = $(window).height();
            this.options.html.css('fontSize', winW < 750 ? winW : 750);
            this.options.chatScroll.height(winH - $('.editCtn').outerHeight());
        },
        /**
         * @function 定时设置页面高度
         * 作用：定时设置页面高度，增加屏幕尺寸计算的准确性
         *      采用promise，可在.then方法中设置回调
         * @example 一般用于聊天过程中（聊天区域大小变化频率较快）屏幕尺寸的展开/收缩快捷服务区域时地用，then方法中的回调为将页面滚动到底部
         */
        timerSetHeight: function () {
            var That = this;
            var p = new Promise(function (resolve, reject) {
                var i = 0, timer = null;
                clearInterval(timer);
                timer = setInterval(function () {
                    That.set_chatScroll_height();
                    if (i >= 5) {
                        resolve();
                        clearInterval(timer);
                    }
                    i++;
                }, 100);
            })
            return p;
        },
        /**
         * @function 页面input绑定文件上传功能
         * 说明：将页面上的指定的input框绑定文件上传事件，绑定方式通过调用FAQ对象的sendFile方法
         * 注意：必须在FAQ实例化后调用
        */
        bindFileup: function () {
            if (this.options.sendFileId) {
                var sendIdList = this.options.sendFileId.split(',');
                for (var i = 0; i < sendIdList.length; i++) {
                    FAQ.sendFile(sendIdList[i]);
                }
            }
        },
        /**
        * @event 屏幕大小改变时，调整页面尺寸
        * 说明：必须在实例化表情插件、输入引导、Faqrobt前调用
        */
        resize: function () {
            var That = this;
            this.options.window.on('resize', function () {
                That.set_chatScroll_height();
            })
        },

        /**
         * 输入框事件集合
         * @event 用于绑定输入框输入文字、获取焦点、失去焦点时的操作
        */
        bindTextare: function () {
            var That = this;
            // 输入文字
            this.options.textarea.on('input', function () {
                if ($(this).val().replace(/\s+/g, '')) {
                    That.options.sendBtn.removeClass('hide');
                    That.options.addBtn.addClass('hide');
                } else {
                    That.options.sendBtn.addClass('hide');
                    That.options.addBtn.removeClass('hide');
                }
            })
                // 获取焦点
                .on('focus', function () {
                    if (That.options.faceBack.css('display') == 'block') {
                        That.options.editCtn.show();
                    } else {
                        That.options.editCtn.hide();
                    }
                    That.options.sendFaceBtn.removeClass('hide');
                    That.options.keyboardBtn.addClass('hide');

                    That.timerSetHeight()
                        .then(function (data) {
                            FAQ.scrollbar.update()
                            FAQ.scrollbarUpdate()
                        })
                })
                // 失去焦点   页面重新计算尺寸，内容滚动最底部
                .on('blur', function () {
                    That.timerSetHeight()
                        .then(function (data) {
                            if (That.isTouchMove) {
                                That.isTouchMove = false; // 复位
                                return false;
                            }
                            FAQ.scrollbar.update()
                        })
                })
        },
        /**
         * @event 快捷服务展开以及收缩操作
         * 点击表情、加号按钮时，展示快捷服务区域
         * 点击聊天区域且快捷服务展示时，隐藏快捷服务区域并将页面滚动到最底部
         *
        */
        quickServChange: function () {
            var That = this;
            this.options.view.on('click', function (e) {
                var _target = $(e.target);
                if (_target.is("." + That.options.sendfaceIconClass) || _target.is("." + That.options.expendbtnIconClass)) {
                    That.options.editCtn.show();
                    That.timerSetHeight()
                        .then(function (data) {
                            FAQ.scrollbar.update()
                            FAQ.scrollbarUpdate()
                        })
                }else if (_target.is('#' + That.options.chatCtnId) || _target.parents().is('#' + That.options.chatCtnId)) {
                    if (That.options.editCtn.css('display') == "block") {// 快捷服务显示时，点击页面隐藏
                        That.options.editCtn.hide();
                        That.options.sendFaceBtn.removeClass('hide');
                        That.options.keyboardBtn.addClass('hide');
                        That.timerSetHeight()
                            .then(function (data) {
                                FAQ.scrollbar.update()
                                FAQ.scrollbarUpdate()
                            })
                    }
                }
            })
        },

        /**
        * @event 键盘-表情按钮切换事件
        *  点击表情时表情按钮替换为键盘按钮；
        *  点击键盘，输入框获取焦点，弹出键盘，并将键盘按钮转化为表情隐藏快捷服务区域
       */
        switchFaceBtn: function () {
            var That = this;
            That.options.sendFaceBtn.on('click.FA', function () {
                $(this).addClass('hide');
                That.options.keyboardBtn.removeClass('hide');
            })
            That.options.keyboardBtn.on('click.FA', function () {
                $(this).addClass('hide');
                That.options.textarea.focus();
                That.options.sendFaceBtn.removeClass('hide');
                That.options.editCtn.hide();
            })
        },

        /**
         * @event 页面滑动时，隐藏快捷服务功能栏
         * 滑动页面时，如果任务栏处于展开状态，隐藏快捷服务栏，输入框失去焦点（隐藏键盘）并将表情按钮显示，键盘按钮隐藏；否则不做操作
         *  
        */
        hideEdit: function () {
            var That = this;
            That.options.chatScroll.on('touchmove', function (e) {
                if(That.options.editCtn.css('display') == 'block'){
                    That.isTouchMove = true;
                    That.options.textarea.blur();
                    That.options.editCtn.hide();
                    That.timerSetHeight();
                    That.options.sendFaceBtn.removeClass('hide');
                    That.options.keyboardBtn.addClass('hide');
                }
            })
        },
        /**
         * @event 人工邀请评价
         * 说明：人工邀请评价带有class='RG_commentBtn'按钮，点击后展示会话满意度评价评价框
        */
        RGComment: function () {
            this.options.body.on('click', '.RG_commentBtn', function () {
                window.uuid = $(this).attr('uuid');// 客服要求客户评价
                this.options.sendFeedBack.trigger('click');
            });
        },
        /**
         * @function 调用s=offline 接口机器人下线
         * 使用场景：在app中退出当前机器人页面或app进入后台运行时，由app端调用该方法
        */
        offline: function(){
            // alert('下线')
            FAQ.options.hideOfflineWord = true;// 用于app进入后台时，下线不显示下线提示语
            FAQ.offline(); 
        },
         /**
         * @function 调用s=p 接口机器人上线
         * 使用场景：在app从后台唤醒时，由app端调用该方法是机器人上线
         * 注意：
         * 1、初始化前设置历史记录页码：请求历史记录时，重新初始化机器人时，如果当前页码不是0，则默认会将当前页码+1，而缺少一次记录，顾需要-1
         * 2、将isGOffline设置为false 否则页面记录当前处于下线，输入引导无效
        */
        online: function(){
            FAQ.recordIndex -= 1;// 历史记录保持退出前的聊天内容；
            FAQ.initBaseInfo();
            FAQ.timeRequest();
            isGOffline = false;// 重新进入输入引导可用
            android.getClientId(FAQ.options.saveClientId)
        },
         /**
         * @function  添加按钮跳转原生页按钮
         * 说明：在FAQ s=aq接口获得答案后调用，即getCallback()，可根据需要重写方法
         * @param answer 答案文本
         * @param data 答案数据
         * 实现方法：答案有推荐链接时（data.robotAnswer[0].thirdUrl.url有值），给当前答案显示框内增加按钮，点击后跳转到原生页面
         *          跳转通过a标签的href属性实现跳转，href格式与安卓端自行约定
         * 
        */
        addGoNativeBtn:function(answer, data){
             /*组织app所需的数据*/
            if (data.robotAnswer[0].thirdUrl) {
                var url = data.robotAnswer[0].thirdUrl.url;
                if(url.indexOf('tonative')>0){
                    var nativeUrl =  url.split('/')[3] + '://tonative/param';
                    if($('.MN_kfCtn:last .MN_helpful')){
                        $('.MN_kfCtn:last .MN_helpful').before('<div class="go-native"><a class="nativeBtn" href='+nativeUrl+' target="_blank">'+'点击跳转原生页'+'</a></div>')
                    }else{
                        $('.MN_kfCtn:last').append('<div class="go-native"><a class="nativeBtn" href='+nativeUrl+' target="_blank">'+'点击跳转原生页'+'</a></div>');
                    }
                }
            }
        },
        /**
         * @function 常见问题模态框
         * 点击常见问题触发模态框展示，列出当前所有的常见问题
         */
        commonQueModal: function () {
            var This = this
            //常见问题
            This.options.sendCommonQue.on('click', function () {
                This.options.commonQueModal.show()
                This.options.commonQueLayer.height(This.options.commonQueModal.height()-40)
            });
        },
        /**
         * @function 选择常见问题发送
         * 选择相应的常见问题触发消息发送
         */
        chooseCommonQue: function () {
            var This = this
            This.options.body.on('click', function (e) {
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
        /**
         * @function 意见反馈模态框
         * 点击意见反馈触发模态框展示，可以进行意见输入，不满意原因选择
         */
        feedBackModal: function () {
            var This = this
            This.options.sendFeedBack.on('click', function () {
                This.options.feedbackModal.show()
            });
        },
        /**
         * @function 留言模态框
         * 点击留言触发模态框展示，可以进行留言信息输入提交
         */
        sendLeaveMsg: function () {
            var This = this
            This.options.body.on("click", "#sendLeaveMsg,.LeaveMsg", function () {
                This.options.leaveMsgBox.css("display", "block");
                FAQ.writeMsg()
            })
        },
        /**
         * @function 切换满意不满意
         */
        switchStatis: function () {
            var This = this
            This.options.MN_marginCtn.eq(0).on('click', function () {
                This.options.noSatiCtn.hide();
            });
            This.options.MN_marginCtn.eq(1).on('click', function () {
                This.options.noSatiCtn.show();
            });
        },
        /**
         * @function    地理位置模态框
         * 说明：自动定位到当前用户所在的位置，可以选择附近的任一位置进行发送给人工客服
         */
        sendMapModal:function(){
            var This = this
            This.options.sendLocation.hide()
            This.options.locationInfo.on('click', function () {
                This.options.sendLocation.show()
                This.showLocation()
                This.options.mapList.height(This.options.sendLocation.height() - (This.options.header.height()+30) - This.options.allmap.height())
                This.options.loadMask.show()
                This.options.mapList.scrollTop(0)
            })
        },
        /**
         * @function    显示当前位置信息
         * 说明：定位访客地理信息
         */
        showLocation:function(){
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
        /**
         * @function    获取附近十个坐标点
         * @param  lat   经度
         * @param  lng   纬度
         */
        getNearbyLoc:function(lat, lng){
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
        /**
         * @function    选择发送的位置
         * 说明：在切换位置坐标时重新标记地图，随着选择位置不同地图展示的点不同
         */
        chooseLocation:function(){
            //点击每个位置选中
            var This = this
            This.options.body.on('click', '#mapList li', function () {
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
        /**
         * @function    发送位置
         * 说明：点击发送，可发送选择的位置，点击位置信息可以跳转到地图页
         */
        sendLocation:function(){
            var This = this
            //发送位置
            This.options.sendLocationId.on('click', function () {
                for (var i = 0; i < $('.' + This.options.mapInput).length; i++) {
                    if ($('.' + This.options.mapInput).eq(i).prop('checked')) {
                        This.latitude = $('.' + This.options.mapInput).eq(i).parents('li').attr('lat')
                        This.longitude = $('.' + This.options.mapInput).eq(i).parents('li').attr('lng')
                        This.content = $('.' + This.options.mapInput).eq(i).parents('li').attr('content')
                        // This.imgHtml = '<a href="http://api.map.baidu.com/marker?location='+This.latitude+','+This.longitude+'&title=我的位置&content='+This.content+'&output=html"><span class="staticImage">' + This.content + '</span><img src="http://api.map.baidu.com/staticimage/v2?ak=BaEzOp4PU6aGZvO6zR5U1Q1Woek1Uun6&zoom=18&center=' + This.longitude + ',' + This.latitude + '&markers=' + This.longitude + ',' + This.latitude + '"/></a>'
                        This.imgHtml = '<a class="map">' + This.content + '<img src="http://api.map.baidu.com/staticimage/v2?ak=BaEzOp4PU6aGZvO6zR5U1Q1Woek1Uun6&zoom=18&center=' + This.longitude + ',' + This.latitude + '&markers=' + This.longitude + ',' + This.latitude + '"/></a>'
                        This.options.closeLocation.trigger('click')
                        FAQ.askQue(This.imgHtml)
                    }
                }
                $('.map').on('click', function () {
                    var Request = This.UrlSearch($(this).find('img').attr('src'));
                    var markers = Request.markers;
                    var content = $(this).text();
                   // window.location.href='http://api.map.baidu.com/marker?location='+markers.split(',')[1]+','+markers.split(',')[0]+'&title=我的位置&content='+content+'&output=html'
                    window.open('http://api.map.baidu.com/marker?location='+markers.split(',')[1]+','+markers.split(',')[0]+'&title=我的位置&content='+content+'&output=html','_blank'); 
                });
            })
        },
        /**
         * @function    获取URL中各个参数
         * @param url  url、src、href等路径
         */
        UrlSearch:function(url){
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
        /**
         * @function    关闭底部常见问题，意见反馈，地图模态框
         */
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
    };

    var app = new FaqrobotApp();

    /**
     * @object 用于与原生app端交互，app调用js的方法
     * 注意：与app交互的方法必须挂载到window上，并且在实例化FaqrobotApp后定义
    */
    window.interNative = {
        offline: function(){
            app.offline();
        },
        online: function(){
            app.online();
        }
    }

    FastClick.attach(document.body);


    /**
     * 表情插件 构造函数在 minichat.js中,封装成方法，通过调用方法进行实例化
     * @function face 用于初始化表情插件
     * 注意：必须在Faqrobot实例化前调用，FaqrobotApp实例化后调用
     * */
    var Face = app.options.textarea.face({
        src: 'src/yun/',// 表情路径
        rowNum: 7,// 每行最多显示数量
        ctnAttr: ['0rem', '0rem', '0.133rem', '0.122rem'],// [left bottom width height] 表情框相对targetEl位置和里面的表情格子宽高  要写单位
        triggerEl:  app.options.sendFaceBtn,// 触发按钮(不存在则自己生成，不要由a包裹)
        targetEl: app.options.editCtn,// 父级参照物(用于appendTo和定位)
        hideAdv: true,// 是否隐藏广告
        callback: function () { // 选择表情后的回调
            /**
             * 显示发送按钮、以及切换键盘按钮、键盘收起、表情选择框显示
            */
            app.options.sendBtn.removeClass('hide');
            app.options.keyboardBtn.removeClass('hide');
            app.options.addBtn.addClass('hide');
            app.options.sendFaceBtn.addClass('hide');
            app.options.textarea.blur();
            app.options.editCtn.show();
        },
        ish5chatApp: true // 自增参数，在minichat.js中使用，用于控制h5chatApp页面表情的特有显示方式
    });

    
    /**
     * faqrobot 实例化 
     * 构造函数在minichat.js中
     * 注意：在表情插件、FaqrobotApp后实例化
     * */
    var FAQ = new Faqrobot({
        interface: 'servlet/appChat',
        setInputTop: false,//默认开启ios11键盘遮挡问题
        ish5chatApp: true,
        saveClientId:'saveClientId',
        //sysNum: 1000000,//客户唯一标识
        //jid: 0,//自定义客服客户图标
        //robotName: 'FaqRobot',//机器人名称
        logoUrl: 'robot/skin/h5chat/images/logo@2x.png',//logo地址 ----------
        logoId: 'logo',// ----------
        webNameId: 'MN_logoWord',//公司名称Id
        intelTitleChange: true,// 智能聊天是否修改标题
        intelTitle: '',// 智能聊天时的标题
        artiTitleChange: true,// 人工时是否修改标题
        artiTitle: '人工客服',// 人工时的标题
        titleInsteadId: 'title',// 代替标题Id
        //userInfoId: 'userInfoId',//用户信息Id
        /**
         * taskid=554 顾荣  ppmoney客服头像与机器人 2018/1/5
         * 原因：区分是机器人客服还是人工客服
         * 修改：添加服图标分为机器人和人工客服
         */
        kfPic: 'robot/skin/h5chat/images/robot.png',  //客服图标
        kf_Robot_Pic: 'robot/skin/h5chat/images/robot.png',  //机器人客服图标
        kf_Person_Pic: 'robot/skin/h5chat/images/robot.png',  //人工客服图标
        kf_Robot_Name: '',//机器人客服名字，此处只是声明个变量，不用赋值
        kf_Person_Name: '',//人工客服名字

        khPic: 'robot/skin/h5chat/images/user.png', //客户图标
        formatDate: '%month%月%date%日 %hour%:%minute%:%second%',//配置时间格式(默认10:42:52 2016-06-24)
        topQueId: 'commonQueLayer',//热门、常见问题Id --------
        //newQueId: 'newQueId',//新增问题Id
        //recommendQueId: 'recommendQueId',//推荐问题Id
        //quickServId: 'MN_quickServer',//快捷服务Id
        //recommendLinkId: 'recommendLinkId',//推荐咨询Id
        //maxQueNum: 100,//最多展示问题条数
        //maxQueLen: 100,//最多展示问题字数
        //showMsgId: 'showMsgId',//展示信息Id
        chatCtnId: 'chatCtn',//聊天展示Id y   --------------
        inputCtnId: 'textarea',//输入框Id y   --------
        sendBtnId: 'sendBtn',//发送按钮Id y   ------
        //tipWordId: 'tipWord',//输入框提示语Id ----
        //tipWord: '请输入您要咨询的问题',//输入框提示语
        //remainWordId: 'MN_remainWordNum',
        //remainWordNum: '100',
        upFileModule: {//上传文件模块
            open: true,//是否启用功能
            maxNum: 0,//最大上传数量，0为不限制
            triggerId: 'sendPic',//触发上传按钮
            startcall: function () {//上传文件前的回调
                app.set_chatScroll_height();
            },
            callback: function () {//上传文件后的回调
            },
        },
        commentFormId: 'feedbackForm',//评论框formId -------
        commentInputCtnId: 'commentCtn',//评论输入框Id ----
        commentSendBtnId: 'commentBtn',//评论发送按钮Id ---------
        //commentTipWordId: 'MN_commentTip',//评论输入框提示语Id
        //commentTipWord: '描述您的意见和建议，以便我们提升服务水平和质量，谢谢您',//评论输入框提示语
        leaveMsgFormId: 'leaveMsgForm',//留言框formId ---------
        leaveMsgInputCtnId: 'leaveMsgCtn',//留言输入框Id ---------
        leaveMsgSendBtnId: 'leaveMsgBtn',//留言发送按钮Id --------
        //leaveMsgTipWordId: 'leaveMsgTipWordId',//留言输入框提示语Id
        //leaveMsgTipWord: '输入您的建议，我们会尽快为您处理！',//留言输入框提示语

        //clearBtnId: 'MN_clearBtn',//清除按钮Id
        //closeBtnId: 'closeBtnId',//关闭聊天页面
        //poweredCtnId: 'poweredCtnId',//技术支持Id
        //thirdUrl: '',//未登录第三方账户，跳转至此链接
        sourceId: tmpsourceId,//客户来源
        //ajaxType: 'get',
        leaveQue: {// 未知问题已回复
            open: true,//是否启用功能
        },
        autoOffline: false,//是否会自动下线
        noView: ['.MN_kfImg', '.MN_khImg', '.FA_upFileNoImg', '.msg-item-wrapper img'],
        faceModule: {//表情模块
            open: true,//是否启用功能
            faceObj: Face,//表情插件实例
        },
        preventAdjust: true,// 禁止快捷服务按钮自动计算宽度
        preventHide: false,// true:机器人聊天时 仍然显示发送文件、图片功能
        initCallback: function (data) {//初始化基本信息的回调
            window.uselessReasonItems = data.uselessReasonItems;
            try {
                // 设置安卓端头部的标题
                android.setTitle(data.webConfig.webName || '');
            } catch (error) {
                
            }
        },
        sendCallback: function () {//点击发送按钮的回调
            /**
             * 显示展开快捷按钮、表情按钮
             * 隐藏键盘切换、发送按钮
             * 键盘弹起（输入框获取焦点）
            */
            app.options.addBtn.removeClass('hide');
            app.options.sendFaceBtn.removeClass('hide');

            app.options.keyboardBtn.addClass('hide');
            app.options.sendBtn.addClass('hide');

            !FAQ.robot._html &&  app.options.textarea.focus();// 防止键盘拉起

        },
        commentCallback: function () {//评论后的回调
            app.options.closefeedback.trigger('click')
        },
        leaveMsgCallback: function () {//留言后的回调
            layer.close(layerCtn);
        },
        /**
         * 获取到答案后的回调
         * @param answer-文本答案
         * @param data-接口返回数据
        */
        getCallback: function (answer, data) {
            app.addGoNativeBtn(answer, data);
        }
    });

    /**
     * Faqrobot 类实例化以后执行的方法，具体说明见FaqrobotApp构造函数
     * 
    */
    app.afterInstant();


   /**
     * 输入引导 构造函数在 minichat.js中,封装成方法，通过调用方法进行实例化
     * @function autocomplete 用于初始化输入引导插件
     * 注意：必须在Faqrobot实例化后调用
     * */
    app.options.textarea.autocomplete({
        url: 'servlet/appChat?s=ig&sysNum=' + FAQ.options.sysNum,// 输入引导接口
        targetEl: app.options.editShow,// 参照物(用于appendTo和定位)
        posAttr: ['0rem', '0.133rem'],// 外边框的定位[left bottom]
        itemNum: 5,// [int] 显示输入引导的数量  默认全部显示
        callback: function (data) {// 点击输入引导文本后的回调函数
           app.options.sendBtn.trigger('click');
        }
    });

});




