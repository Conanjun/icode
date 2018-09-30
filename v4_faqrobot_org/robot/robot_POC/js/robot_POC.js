// taskid = 509 网页嵌入方式封装 Amend by zhaoyuxing 2018/5/17
(function () {
    /***********************************************
    *               机器人设置项目
    * @param     chatType1    当前页面弹框形式页面地址
    * @param     chatType2    新标签页打开形式页面地址
    * @param     robotScriptId  引入的本js的script标签id
    * @param     iconSrc      机器人客服机器人图标路径
    * @param     iconCss      机器人客服图标样式
    * @param     chatWinCss   弹窗方式打开的聊天页面样式
    * 如需增加或修改默认值，可通过定义新的对象，在实例化Faqrobot时传入
   ***********************************************/
    var defaults = {
        chatType1: '/robot/miniChat_poc.html',
        chatType2: '/robot/chat2.html',
        robotScriptId: 'robotScript',
        iconSrc: "/robot/robot_POC/icon_images/robot_icon.png",//图标路径
        iconCss: "width: 150px;height: 57px;position: fixed; bottom:10px;right:10px;",
        chatWinCss: 'width:360px;height:550px;position:absolute;bottom:65px;right:0; z-index:999; border:none; box-shadow:0px 0px 30px #aaa;display:none'
    }


    function Faqrobot(options) {
        this.defaults = $.extend({}, defaults, options);    //机器人设置项目 创建实例时传入
        this.robotType = 1;         //聊天框打开方式
        this.robotScript = $('#' + this.defaults.robotScriptId); // 引入的本js的script标签元素
        this.dragId = 'drag';       // 机器人客服图标id
        this.chatWinId = 'chatWin';// 弹窗聊天页面id
        this.chatType1 = '';     // 当前页面弹框形式页面地址
        this.chatType2 = '';     // 当前页面弹框形式页面地址
        this.iconSrc = '';      //客服图标的地址
        this.body = $('body');
        this.window = $(window);
        this.init(); //初始化实现页面功能
    }

    Faqrobot.prototype = {
        init: function () {
            this.getOpenType();
            this.loadResource();
            this.dragLogo();
        },
        /**
         * 页面中添加图标以及聊天框
         * */
        loadResource: function () {
            this.body.append('<div id="' + this.dragId + '" style="background-image:url(\'' + this.iconSrc + '\');' + this.defaults.iconCss + '" ></div>');
            
            //type =1 时 页面中添加弹框
            if (this.robotType == 1) {
                var drag = $('#' + this.dragId);
                var chatWin = '<iframe id="' + this.chatWinId + '" src="' + this.chatType1 + '" style="' + this.defaults.chatWinCss + '"></iframe>'
                drag.append(chatWin);
                this.closeChatWin();
            }
        },
         /**
         * 弹框加载结束后，页面绑定事件，点击页面空白处，收起弹框
        * */
        closeChatWin: function () {
            var chatWinEle = $('#' + this.chatWinId);
            var that = this;
            this.window.on('click', function (e) {
                if ($(e.target).attr('id') != that.dragId) {
                    chatWinEle.slideUp();
                }
            });
        },
         /**
         * 获取需要展示的聊天框类型 type = 1  本页面打开 2 新页面打开
        * 获取用户的环境、机器人的sysNum
        * */
        getOpenType: function () {
            /*获取文件所处环境的一级域名*/
            if(this.robotScript.attr('src').indexOf('?') == -1){
                throw new Error ("引入js时请传入参数");
                return;
            }
            var location = (this.robotScript.attr('src').split('?')[0]).split('/');

            /*获取需要展示的聊天框类型以及sysnum*/
            if((this.robotScript.attr('src').split('?')[1]).indexOf('&') == -1){
                throw new Error ("引入js时传入参数缺少");
                return;
            }
            var param = (this.robotScript.attr('src').split('?')[1]).split('&');
            var sysNum = '', paramObj = {};

            param.forEach(item => {
                paramObj[item.split('=')[0]] = item.split('=')[1]
            });
            this.robotType = paramObj.type || '1';
            this.renderLocation(location || 'v4.faqrobot.net', paramObj.sysNum || '3000000');
        },
        /**
        * 根据设置的路径、展示的聊天框类型以及sysNum，整合聊天框路径
        * @param location 聊天框的以及域名
        * @param sysNum   聊天页面对应的sysNum
        * */
        renderLocation: function (location, sysNum) {
            this.chatType1 = location[0] + '//' + location[2] + this.defaults.chatType1 + "?sysNum=" + sysNum;
            this.chatType2 = location[0] + '//' + location[2] + this.defaults.chatType2 + "?sysNum=" + sysNum;
            this.iconSrc = location[0] + '//' + location[2] + this.defaults.iconSrc;
        },
         /**
         * 实现图标拖拽功能
        * */
        dragLogo: function () {
            var x = 0, y = 0,   //获取鼠标x坐标，y坐标
                l = 0, t = 0;   //图标的左部和顶部的偏移量
            var isDown = false; //可移动开关
            var drag = $('#' + this.dragId);    //图标元素
            var that = this;

            /*鼠标按下事件：获取当前鼠标以及图标位置*/
            drag.on('mousedown', function (e) {
                x = e.clientX;
                y = e.clientY;

                //获取左部和顶部的偏移量
                l = drag.offset().left;
                t = drag.offset().top;

                isDown = true;
                drag.css('cursor', 'move')
            })

            /*鼠标移动，修改图标位置*/
            this.window.on('mousemove', function (e) {
                if (isDown == false) {
                    return;
                }
                //移动后鼠标的x坐标，y坐标
                var nx = e.clientX;
                var ny = e.clientY;
                //计算移动后的左偏移量和顶部的偏移量
                var nl = nx - (x - l);
                var nt = ny - (y - t);

                //设置图标位置
                drag.css('left', nl + 'px');
                drag.css('top', nt + 'px');
            })


            /*鼠标抬起事件，禁止图标移动；停止移动状态点击图标展示聊天页面*/
            drag.on('mouseup', function (e) {
                var newX = e.clientX;
                var newY = e.clientY;

                //鼠标点击图标时， 显示机器人聊天页面
                if (x == newX && y == newY) {
                    if (that.robotType == 1) {
                        var chatWinEle = $('#' + that.chatWinId)    //聊天框元素
                        //聊天框打开或收缩
                        if ($(e.target || event.srcElement).attr('id') == that.dragId) {
                            if (chatWinEle.is(':visible')) {
                                chatWinEle.slideUp();
                            } else {
                                chatWinEle.slideDown();
                            }
                        } else {
                            chatWinEle.slideUp();
                        }
                    } else if (that.robotType == 2) {
                        //位置相同的操作
                        if ($(e.target || event.srcElement).attr('id') == that.dragId) {
                            window.open(that.chatType2);
                        }
                    }
                }
                isDown = false;
                drag.css('cursor', 'default');
            })

            /*响应式：窗口大小改变，图标位置回右下角*/
            this.window.resize(function () {
                drag.css({
                    'left': '',
                    'top': '',
                    'right': '10px',
                    'bottom': '10px'
                })
            })
        },
    }

    //创建对象的实例
    FAQ = new Faqrobot();

})()