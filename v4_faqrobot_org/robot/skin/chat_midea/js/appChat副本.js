//定义全局变量
var tmpTel = '',
    //手机号
    tmpName = '',
    //姓名
    tmpArea = '',
    //用户所属区域
    tmpDept = '',
    //用户所属部门
    tmpUserId = '',
    //用户名 
    fileNum = 0,
    //上传附件的个数
    attachment1 = {},
    attachment2 = {},
    attachment3 = {},
    //附件上传需要转换成64位
    curOrderNo = 1,
    curOrderAll = 1; //服务单页码 
    tmplink='http://10.73.19.54:8080/iyunwen';//临时用于测试存放域名的地方
(function() {
    getUserInfo();

    function ChatModel() {
        this.init();
    }
    ChatModel.prototype = {
        //初始化
        init: function() {
            var self = this;
            //生成表情
            $('.chatArea', $('.chatCtn')).face({
                src: 'src/yun/',
                //表情包路径
                rowNum: 5,
                //每行最多显示数量，此属性不适用于常用语
                ctnAttr: ['0px', '20px', '40px', '40px'],
                //[left bottom width height] 表情框相对targetEl位置和里面的表情格子宽高  要写单位
                triggerEl: $('.moodBtn', $('.chatCtn')),
                //触发按钮(不存在则自己生成，不要由a包裹)
                targetEl: $('.chatBodyCtn', $('.chatCtn')),
                //父级参照物(用于appendTo和定位)
                hideAdv: true,
                //是否隐藏广告
                callback: function(data) {},
            });

            //聊天
            FAQ = new Faqrobot({
                logoUrl: './img/logo_max.png',
                //logo地址 ----------
                logoId: 'logo',
                intelTitleChange: true,
                // 智能聊天是否修改标题
                artiTitleChange: true,
                // 人工时是否修改标题
                artiTitle: '人工客服',
                // 人工时的标题
                robotInfo: 'robotInfo',
                kfPic: 'robot/skin/midea/img/robot.png',
                //客服图标
                khPic: 'robot/skin/midea/img/serv.png',
                //客户图标
                formatDate: '%month%月%date%日 %hour%:%minute%:%second%',
                //配置时间格式(默认10:42:52 2016-06-24)
                topQueId: 'commonQue',
                //热门、常见问题Id --------
                quickServId: 'quickLink',
                //快捷服务Id
                thirdUrlId: 'thirdUrl',
                chatCtnId: 'chat-client',
                //聊天展示Id y   --------------
                inputCtnId: 'replyContent',
                //输入框Id y   --------
                sendBtnId: 'itSend',
                //发送按钮Id y   ------
                tipWordId: 'inputTip',
                commentFormId: 'feedBackForm',
                //评论框formId -------
                commentInputCtnId: 'feedBackInput',
                //评论输入框Id ----
                commentSendBtnId: 'feedBackBtn',
                //评论发送按钮Id ---------
                commentTipWordId: 'feedBackTip',
                //评论输入框提示语Id
                artiSearchId: 'artiSearch',
                //智能搜索
                artiSearchCallback: function(data) {
                    if (data.fullTextSearch) {
                        $('.thirdURL').addClass('thirdURLRecommend');
                        $('.artiSearch').removeClass('artiSearchHide');
                        $('.itemCtn').css('width', '25%');
                        $('.itemHead4').trigger('click');
                    } else {
                        $('.artiSearch').addClass('artiSearchHide');
                        if ($('.thirdURL').hasClass('thirdURLRecommend')) {
                            //存在推荐链接
                            $('.itemCtn').removeAttr('style');
                        }
                        if ($('.itemHead4').is('.itemHeadFocus')) {
                            $('.itemHead1').trigger('click');
                        } else {
                            $('#artiSearch').hide();
                        }
                    }

                },
                leaveQue: { // 未知问题已回复
                    open: true,
                    //是否启用功能
                },
                autoSkip: { //手机不能访问pc页面
                    open: true,
                    //是否启用功能
                    chatUrl: 'h5chat',
                    // 默认跳转的页面
                },
                clearBtnId: 'clearMsg',
                //清除按钮Id
                closeBtnId: 'close',
                //关闭聊天页面
                poweredCtnId: 'power',
                //技术支持Id
                thirdUrlCallBack: function(data, index) {
                    if (!index) index = 0;
                    if (data.robotAnswer[index].thirdUrl && data.robotAnswer[index].thirdUrl.url) {
                        $('.thirdURL').removeClass('thirdURLRecommend');
                        $('.itemHead5').trigger('click');
                        $('.itemCtn').css('width', '25%');
                        if (!$('.artiSearch').hasClass('artiSearchHide')) {
                            $('.artiSearch').addClass('artiSearchHide')
                        }
                        $('#' + FAQ.options.thirdUrlId + ' iframe').attr('src', data.robotAnswer[index].thirdUrl.url);
                    } else {
                        $('.thirdURL').addClass('thirdURLRecommend');
                        $('.itemCtn').removeAttr('style');
                        $('.itemHead1').trigger('click');
                    };
                }
            });
            //调用自动补全插件
            this.initAutocomplete();

            //转人工
            $("#switchHuman").click(function() {
                self.emptychat();
                $(".chat-operation").children().eq(1).removeClass('hide');
                $(".chat-operation").children().eq(2).removeClass('hide');
                $("#chatFile").removeClass('hide');
                $(".outWork").removeClass('hide');
                $(".hint").addClass('hide');
                $('.input').unbind(); // 清除输入提示事件
                FAQ.scrollbar.update();
                FAQ.timerGo = false;
                FAQ.offline();
                $("#itSend").unbind(); // 删除机器人绑定事件
                $('#replyContent').unbind();
                $('#itSend').click(function() {
                    self.manualChatSend();
                });
                $('#replyContent').keyup(function(e) {
                    if (e.keyCode == 13) { //Enter键发送
                        self.manualChatSend();
                    }
                });
            });


            // 转机器人
            $(".outWork").click(function() {
                self.emptychat();
                $("#itSend").unbind(); // 删除人工绑定事件
                $('#replyContent').unbind();
                self.initAutocomplete();
                $(".chat-operation").children().eq(1).addClass('hide');
                $(".chat-operation").children().eq(2).addClass('hide');
                $("#chatFile").addClass('hide');
                $(".outWork").addClass('hide');
                $(".hint").removeClass('hide');
                FAQ.timerGo = true;
                FAQ.init(true);
                FAQ.scrollbar.update();
            });
            //截屏
            this.captureObj = new NiuniuCaptureObject(); //生成实例
            this.captureObj.InitNiuniuCapture(); //初始化控件
            //截屏回调
            this.captureObj.FinishedCallback = function(type, x, y, width, height, info, content, localpath) { //截屏完毕
                if (type == 1) {
                    var format = localpath.substring(localpath.lastIndexOf('.') + 1, localpath.length);
                    var url = 'data:image/' + format + ';base64,'
                    var data = {
                        imgFlow: url + content
                    }
                    FAQ.manualChatSend(data);
                }
            }


            //截屏
            $('.screenBtn', '.chatCtn').unbind('click').bind('click', function() {
                var captureRet = self.captureObj.DoCapture("1.jpg", 0, 3, 0, 0, 0, 0);
                console.log(captureRet)
                if (!captureRet) { //没有安装控件
                    self.ShowDownLoad();
                }
            });

            // 监听评价建议长度。
            this.listenTextareaLen($(".textareaLen"), $("#textareaVal"));
            this.listenTextareaLen($(".yawpTextareaLen"), $("#yawpTextarea"));


            // 点击满意不满意添加css
            $('#assessOrderForm .isSatisfaction-btn').eq(0).click(function() {
                if ($(this).hasClass('Satisfaction-color')) {
                    $(this).removeClass('Satisfaction-color');
                    $('#assessOrderForm input[name=survey]').val('');
                    $('.goodDiv').addClass('hide');
                } else {
                    $(this).addClass('Satisfaction-color');
                    $('#assessOrderForm .isSatisfaction-btn').eq(1).removeClass('Satisfaction-color');
                    $('#assessOrderForm .unsolved-btn').removeClass('unsolved-color');
                    $('#assessOrderForm input[name=survey]').val('satisfaction');
                    $('.goodDiv').removeClass('hide');
                    $('.badDiv').addClass('hide');
                }
            })
            $('#assessOrderForm .isSatisfaction-btn').eq(1).click(function() {
                if ($(this).hasClass('Satisfaction-color')) {
                    $(this).removeClass('Satisfaction-color');
                    $('#assessOrderForm input[name=survey]').val('');
                    $('.badDiv').addClass('hide');
                } else {
                    $(this).addClass('Satisfaction-color');
                    $('#assessOrderForm .isSatisfaction-btn').eq(0).removeClass('Satisfaction-color');
                    $('#assessOrderForm .unsolved-btn').removeClass('unsolved-color');
                    $('#assessOrderForm input[name=survey]').val('dissatisfied');
                    $('.badDiv').removeClass('hide');
                    $('.goodDiv').addClass('hide');
                }
            })
            $('#assessOrderForm .unsolved-btn').click(function() {
                if ($(this).hasClass('unsolved-color')) {
                    $(this).removeClass('unsolved-color');
                    $('#assessOrderForm input[name=survey]').val('');
                } else {
                    $(this).addClass('unsolved-color');
                    $('#assessOrderForm .isSatisfaction-btn').removeClass('Satisfaction-color');
                    $('#assessOrderForm input[name=survey]').val('unresolved');
                    $('.badDiv').addClass('hide');
                    $('.goodDiv').addClass('hide');
                }
            })

            // 人工选择文件
            $(".chat-file").change(function() {
                var self = this;
                if (this.files.length === 0) {
                    return
                };
                var reader = new FileReader();


                reader.onload = function(e) {
                    var data, format = self.files[0].name;
                    if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(format)) {
                        data = {
                            imgFlow: e.target.result
                        }
                    } else {
                        data = {
                            fileFlow: e.target.result,
                            fileName: format
                        }
                    }
                    FAQ.manualChatSend(data);
                };
                reader.readAsDataURL(this.files[0]);
            });



        },
        //转义表情
        replaceFace: function(data, bool) {
            var src = 'src/',
                faceType = ['云问表情', 'png', 'png'],
                face = { //表情包
                    '云问表情': [
                        ['[微笑]', '/::)'],
                        ['[色]', '/::B'],
                        ['[得意]', '/:8-)'],
                        ['[流泪]', '/::<'],
                        ['[害羞]', '/::$'],
                        ['[闭嘴]', '/::X'],
                        ['[发怒]', '/::@'],
                        ['[呲牙]', '/::D'],
                        ['[惊讶]', '/::O'],
                        ['[难过]', '/::('],
                        ['[酷]', '/::+'],
                        ['[愉快]', '/:,@-D'],
                        ['[流汗]', '/::L'],
                        ['[奋斗]', '/:,@f'],
                        ['[疑问]', '/:?'],
                        ['[晕]', '/:,@@'],
                        ['[委屈]', '/:P-(']
                    ],
                };
            for (var i in face) {
                if (i == faceType[0]) {
                    for (var j = 0; j < face[i].length; j++) { //考虑到含有特殊字符，不用正则
                        while (data.indexOf(face[i][j][0]) + 1) {
                            var index = data.indexOf(face[i][j][0]),
                                len = face[i][j][0].length,
                                str1 = data.substr(0, index),
                                str2 = data.substr(index + len);
                            data = str1 + (bool ? face[i][j][1] : ('<img src="' + src  + 'yun'+j + '.' + faceType[2] + '">')) + str2;
                        }
                        if (!bool) {
                            while (data.indexOf(face[i][j][1]) + 1) {
                                var index = data.indexOf(face[i][j][1]),
                                    len = face[i][j][1].length,
                                    str1 = data.substr(0, index),
                                    str2 = data.substr(index + len);
                                data = str1 + '<img src="' + src +'yun'+ j + '.' + faceType[2] + '">' + str2;
                            }
                        }
                    }
                }
            }
            return data;
        },
        //根据是否是Chrome新版本来控制下载不同的控件安装包
        ShowDownLoad: function() {
            if (this.captureObj.IsNeedCrx()) {
                this.ShowChromeInstallDownload();
            } else {
                this.ShowIntallDownload();
            }
        },
        ShowChromeInstallDownload: function() {
            var ret = confirm("您需要先下载Chrome扩展安装包进行安装，点击确定继续!");
            if (ret) {
                window.location.href = "http://www.ggniu.cn/download/CaptureInstallChrome.exe";
            }

        },
        ShowIntallDownload: function() {
            var ret = confirm("您需要先下载控件进行安装，点击确定继续!");
            if (ret) {
                window.location.href = "http://www.ggniu.cn/download/CaptureInstall.exe";
            }
        },


        // 监听数据字数长度
        listenTextareaLen: function(numberDom, inputVal) {
            inputVal.keyup(function() {
                var length = inputVal.val().length;
                console.log(length);
                if (length > 500) {
                    var val = inputVal.val().slice(0, 500);
                    inputVal.val(val);
                }
                numberDom.html(length)
            });
        },


        // 人工-提交不满意意见
        submitYawp: function() {
            var text = $('#yawpTextarea').val();
            console.log(text)
        },
        // 初始化input自动提示
        initAutocomplete: function() {
            $('.input').autocomplete({
                url: '../../servlet/AQ?s=ig',
                targetEl: $('.inputCtn'),
                //参照物(用于appendTo和定位)
                posAttr: ['-1px', '138px'],
                //外边框的定位[left bottom]
                itemNum: 10,
                //[int] 默认全部显示
                callback: function(data) { //获取文本后的回调函数
                    $('.sendBtn').trigger('click');
                }
            });
        },
        // 清空聊天
        emptychat: function() {
            $('#replyContent').val('');
            $("#chat-client").empty();
        },
        manualChatSend: function() {
            FAQ.manualChatSend();
        }
    }
    window.ChatModel = new ChatModel();

}())
//进入页面获取用户信息

function getUserInfo() {
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        url: encodeURI(''+tmplink+'/WorkOrderInfo/getUserInfo?loginName=wuzc5'),
        success: function(data) {
            if (!data.status) {
                tmpTel = data.telphone;
                tmpName = data.username;
                tmpUserId = data.userId;
                tmpArea = data.area_tierId2;
                tmpDept = data.business_unitId;
                getAllInfo('belong_system', true);
                getAllInfo('area', false);
                getAllInfo('dept', false);
                //自助保障填入联系方式
                $('#selfHelpForm input[name=telphone]').val(tmpTel);
                //获取评价时候的礼物
                if (data.gifts && data.gifts.length > 0) {
                    var giftData = [];
                    for (var i in data.gifts) {
                        if (data.gifts[i].count > 0) {
                            giftData.push('<li class="present" giftId="' + data.gifts[i].id + '">');
                        } else {
                            giftData.push('<li class="present giftgray">');
                        }
                        if (data.gifts[i].name == '矿泉水') {
                            giftData.push('<img title="矿泉水" src="./img/water.jpg">');
                        } else if (data.gifts[i].name == '巧克力') {
                            giftData.push('<img title="巧克力" src="./img/chocolate.jpg">');
                        } else if (data.gifts[i].name == '鲜花') {
                            giftData.push('<img title="鲜花" src="./img/flower.jpg">');
                        } else if (data.gifts[i].name == '香槟') {
                            giftData.push('<img title="香槟" src="./img/champagne.jpg">');
                        }
                        giftData.push('<span class="present-box">');
                        giftData.push('<span class="present-check"></span>>');
                        giftData.push('<i class="fa fa-check-circle-o present-ico" aria-hidden="true"></i></span></li>');
                    }
                    $('#giftUl').html(giftData.join(''));
                }
                //获取服务单列表
                orderList();

            }
        },
        error: function() {
            FAQ.showMsg('请求失败');
            return;
        }
    });
}
//获取系统名称，区域，部门

function getAllInfo(param, isAll) {
    var tParam = 'type=' + param;
    if (isAll) {
        tParam = tParam + '&paramOne=' + tmpArea + '&paramTwo=' + tmpDept;
    };
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        url: encodeURI(''+tmplink+'/WorkOrderInfo/codeTable'),
        data: tParam,
        success: function(data) {
            if (!data.status) {
                if (data.list && data.list.length > 0) {
                    var tmpData = [];
                    //如果当前是不满意的原因
                    if (param == 'survey_type') {
                        var spanData = [];
                        for (var i in data.list) {
                            spanData.push('<span class="label label-default" id="' + data.list[i].code + '">' + data.list[i].name + '</span>');
                        }
                        $('#showReason').html(spanData.join(''));
                    } else {
                        for (var i in data.list) {
                            tmpData.push('<option value="' + data.list[i].code + '">' + data.list[i].name + '</option>');
                        }
                        //如果当前是所属区域
                        if (param == 'area') {
                            $('#selfHelpForm .areaSelect').html(tmpData.join(''));
                            //根据用户带过来的信息自动定位到该信息
                            if (tmpArea) {
                                $('#selfHelpForm .areaSelect').find("option[value='" + tmpArea + "']").attr("selected", true);
                            };
                        }
                        //如果当前是所属部门
                        if (param == 'dept') {
                            $('#selfHelpForm .deptSelect').html(tmpData.join(''));
                            //根据用户带过来的信息自动定位到该信息
                            if (tmpDept) {
                                $('#selfHelpForm .deptSelect').find("option[value='" + tmpDept + "']").attr("selected", true);
                            };
                        }
                        //如果当前是系统
                        if (param == 'belong_system') {
                            $('#selfHelpForm .sysSelect').html(tmpData.join(''));
                        }
                    }
                }

            }
        },
        error: function() {
            FAQ.showMsg('请求失败');
            return;
        }
    });
}
//部门和区域的select只要其中一个元素值变动，系统名称也要相应变动
$('#selfHelpForm').on('change', '.deptSelect,.areaSelect', function() {
    if ($(this).is('.deptSelect')) {
        tmpDept = $(this).children('option:selected').val();
    }
    if ($(this).is('.areaSelect')) {
        tmpArea = $(this).children('option:selected').val();
    }
    getAllInfo('belong_system', true);
})
//附件上传转化成64位

function turnbase64(obj) {
    var finalResult = '';
    if (typeof FileReader == 'undefined') {
        var realPath, xmlHttp, xml_dom, tmpNode, imgBase64Data;
        realPath = obj.value; //获取文件的真实本地路径.
        xmlHttp = new ActiveXObject("MSXML2.XMLHTTP");
        xmlHttp.open("POST", realPath, false);
        xmlHttp.send("");
        xml_dom = new ActiveXObject("MSXML2.DOMDocument");
        tmpNode = xml_dom.createElement("tmpNode");
        tmpNode.dataType = "bin.base64";
        tmpNode.nodeTypedValue = xmlHttp.responseBody;
        imgBase64Data = "data:image/bmp;base64," + tmpNode.text.replace(/\n/g, "");
        finalResult = imgBase64Data;
        console.log(imgBase64Data);
    } else {
        var reader = new FileReader();
        reader.readAsDataURL(obj.files[0]);
        reader.onload = function(e) {
            finalResult = e.target.result;
            console.log(e.target.result);
        };
    }
    return finalResult;
}
$('#fileOne').on('change', '#fileupOne', function() {
    if (!this.files) {
        var tmpValue = this.value;
        tmpValue = tmpValue.split('\\');
        attachment1.name = tmpValue[tmpValue.length - 1]
    } else {
        attachment1.name = this.files[0].name;
    }

    var obj = $(this).parent().parent();
    attachment1.content = turnbase64(this);
    $('#hasUp').append('<p>' + this.files[0].name + '&nbsp;&nbsp;<span class="glyphicon glyphicon-remove delFile" aria-hidden="true" style="color: #f00;" param="fileOne"></span></p>');
    if ($('#hasUp p').length > 2) {
        obj.addClass('hide');
    } else {
        obj.addClass('hide').next().removeClass('hide');
    }
    $('#fileupOne').replaceWith('<input type="file" id="fileupOne"  />');
});
$('#fileTwo').on('change', '#fileupTwo', function() {
    if (!this.files) {
        var tmpValue = this.value;
        tmpValue = tmpValue.split('\\');
        attachment2.name = tmpValue[tmpValue.length - 1]
    } else {
        attachment2.name = this.files[0].name;
    }

    var obj = $(this).parent().parent();
    attachment2.content = turnbase64(this);
    $('#hasUp').append('<p>' + this.files[0].name + '&nbsp;&nbsp;<span class="glyphicon glyphicon-remove delFile" aria-hidden="true" style="color: #f00;" param="fileTwo"></span></p>');
    if ($('#hasUp p').length > 2) {
        obj.addClass('hide');
    } else {
        obj.addClass('hide').next().removeClass('hide');
    }

    $('#fileupTwo').replaceWith('<input type="file" id="fileupTwo"  />');
});
$('#fileThree').on('change', '#fileupThree', function() {
    if (!this.files) {
        var tmpValue = this.value;
        tmpValue = tmpValue.split('\\');
        attachment3.name = tmpValue[tmpValue.length - 1]
    } else {
        attachment3.name = this.files[0].name;
    }

    var obj = $(this).parent().parent();
    attachment3.content = turnbase64(this);
    $('#hasUp').append('<p>' + this.files[0].name + '&nbsp;&nbsp;<span class="glyphicon glyphicon-remove delFile" aria-hidden="true" style="color: #f00;" param="fileThree"></span></p>');
    if ($('#hasUp p').length > 2) {
        obj.addClass('hide');
    } else {
        obj.addClass('hide').next().removeClass('hide');
    }
    $('#fileupThree').replaceWith('<input type="file" id="fileupThree"  />');
});
//删除附件后
$('#hasUp').on('click', '.delFile', function() {
    $(this).parent().remove();
    var tmpParam = $(this).attr('param');
    $('#' + tmpParam).removeClass('hide').siblings('.divFile').addClass('hide');
    if (tmpParam == 'fileThree') {
        attachment3 = {};
        console.log(attachment3);
    } else if (tmpParam == 'fileTwo') {
        attachment2 = {};
        console.log(attachment2);
    } else if (tmpParam == 'fileOne') {
        attachment1 = {};
        console.log(attachment1);
    }
})
//提交自助保障信息

function selfHelp() {
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        url: encodeURI(''+tmplink+'/WorkOrderInfo/ticketAdd?userId=' + tmpUserId + '&username=' + tmpName),
        data: $('#selfHelpForm').serialize() + '&attachment1=' + JSON.stringify(attachment1) + '&attachment2' + JSON.stringify(attachment2) + '&attachment3' + JSON.stringify(attachment3),
        success: function(data) {
            if (!data.status) {
                //表单提交完成后清空
                $('#selfHelpForm')[0].reset();
                $('#hasUp').html('');
                $('#fileOne').removeClass('hide').siblings('.divFile').addClass('hide');
                //刷新工单列表
                orderList();
                attachment3 = {};
                attachment2 = {};
                attachment1 = {};
                FAQ.showMsg(data.message);
            } else {
                FAQ.showMsg(data.message);
            }
        },
        error: function() {
            FAQ.showMsg('请求失败');
            return;
        }
    });
}
//获取工单列表

function orderList(pageNum, pageSize) {
    if (!pageNum) pageNum = 1;
    if (!pageSize) pageSize = 2;
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        url: encodeURI(''+tmplink+'/WorkOrderInfo/ticketList'),
        data: 'role=0&type=all&pageNum=' + pageNum + '&pageSize=' + pageSize + '&asc=false',
        success: function(data) {
            if (!data.status) {
                if (data.list && data.list.length > 0) {
                    //展示服务单当前页数

                    curOrderAll = Math.ceil(data.totle / 2);
                    console.log('zongyeshu:' + curOrderAll);
                    $('#orderSerivcePage .pageAll').html(curOrderAll);
                    var orderHtml = [];
                    for (var i in data.list) {
                        orderHtml.push('<div class="serviceO-Context radius">');
                        orderHtml.push('<div class="serviceOC-titl">');
                        orderHtml.push('<div>单号:<b>' + data.list[i].ticketId + '</b></div>');
                        //服务单当前状态
                        orderHtml.push('<div class="pull-right state">' + orderStatus(data.list[i].status) + '</div>');
                        orderHtml.push('</div>');
                        orderHtml.push('<div class="serviceOC-context" data-toggle="modal" data-target="#chatModal" id="' + data.list[i].ticketId + '" onclick="showOrderDetail(this)">' + data.list[i].description + '</div>');
                        orderHtml.push('<div class="serviceOC-foot"><div class="item state">' + data.list[i].create_time + '</div>');
                        if (data.list[i].surveyStatus == 1) {
                            //当前服务单可评价
                            orderHtml.push('<div class="pull-right gray" data-toggle="modal" data-target="#evaluateModal" ticketId="' + data.list[i].ticketId + '" onclick="assessgetInfo(this)">评价</div></div></div>');
                        } else {
                            orderHtml.push('<div class="pull-right gray expediteOrder"><span class="expediteOrderSpan">催单</span>');
                            orderHtml.push('<div class="expediteModel radius hide">');
                            orderHtml.push('<span class="expedite-assign"></span>');
                            orderHtml.push('<div class="expedite-content">');
                            orderHtml.push('该工单已被催单<span class="red">' + data.list[i].reminderCount + '</span>次，请确认是否要催单?</div>');
                            orderHtml.push('<div class="expedite-foot">');
                            orderHtml.push('<button type="botton" class="btn btn-default pull-right expedite-close">暂不需要</button><button type="botton" class="btn btn-primary pull-right evaluate-color evaluateOrderFn" id="' + data.list[i].ticketId + '" num="' + data.list[i].reminderCount + '" style="margin-right:20px;">我要催单</button>');
                            orderHtml.push('</div></div></div></div></div>');
                        }
                    }
                    $('#orderSerivceTemplate').html(orderHtml.join(''));
                } else {
                    //服务单为空情况下的处理
                    $('#orderSerivcePage .pageIndex').html(0);
                    $('#orderSerivcePage .pageAll').html(0);
                    $('#orderSerivceTemplate').html('<div class="serviceO-Context radius"><div class="serviceOC-titl"><div style="text-align:center">现在还没有服务单哦～</div></div></div>');
                }
            } else {
                FAQ.showMsg(data.message);
            }
        },
        error: function() {
            FAQ.showMsg('请求失败');
            return;
        }
    });
}
//服务单点击上一页
$('.servicePagePre').click(function() {
    if (curOrderNo > 1) {
        curOrderNo--;
    } else {
        curOrderNo = 1;
    }
    $('#orderSerivcePage .pageIndex').html(curOrderNo);
    orderList(curOrderNo);
})
$('.servicePageNext').click(function() {
    if (curOrderNo < curOrderAll) {
        curOrderNo++;
    } else {
        curOrderNo = curOrderAll;
    }
    $('#orderSerivcePage .pageIndex').html(curOrderNo);
    orderList(curOrderNo);
})

//单号状态

function orderStatus(status) {
    var curStatus = '';
    if (typeof status == "number") {
        status += '';
    }
    switch (status) {
    case '10':
        curStatus = '创建'
        break;
    case '20':
        curStatus = '处理中'
        break;
    case '30':
        curStatus = '处理中'
        break;
    case '40':
        curStatus = '处理中'
        break;
    case '50':
        curStatus = '处理完成'
        break;
    case '60':
        curStatus = '待评价'
        break;
    default:
        curStatus = '未知'
        break;
    }
    return curStatus;
}
//查看服务单详情

function showOrderDetail(obj) {
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        url: encodeURI(''+tmplink+'/WorkOrderInfo/ticketDetail'),
        data: 'ticketId=' + $(obj).attr('id'),
        success: function(data) {
            if (!data.status) {
                if (data.list && data.list.length > 0) {
                    var orderDetail = [];
                    for (var i in data.list) {
                        var nowStatus = orderStatus(data.list[i].status);
                        orderDetail.push('<form class="form-horizontal">');
                        orderDetail.push('<div class="form-group serve">');
                        orderDetail.push('<label  class="col-xs-2 col-sm-3 col-md-3 col-lg-2 control-label">服务详情</label></div>');
                        orderDetail.push('<div class="form-group" style="margin-bottom:55px;"><label  class="not-Weight col-xs-2 col-sm-3 col-md-3 col-lg-2 control-label colorA4"></label><div class="col-sm-8 col-md-8  col-xs-8">');
                        orderDetail.push('<div class="serveProcess">');
                        //创建状态
                        if (nowStatus == '创建') {
                            orderDetail.push('<div class="process-round roundPass-color-ing"><div class="process-text"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></div><span class="process-time">创建<br>' + (data.list[i].create_time ? data.list[i].create_time : '') + '</span></div>');
                            orderDetail.push('<div class="crosswise processPass-color"></div><div class="process-round roundPass-color"><div class="process-text"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></div><span class="process-time">分派<br>' + (data.list[i].assignTime ? data.list[i].assignTime : '') + '</span></div>');
                            orderDetail.push('<div class="crosswise"></div><div class="process-round"><div class="process-text"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></div><span class="process-time">处理完成<br>' + (data.list[i].close_time ? data.list[i].close_time : '') + '</span></div>');

                        } else if (nowStatus == '处理中') {
                            orderDetail.push('<div class="process-round roundPass-color-ing"><div class="process-text"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></div><span class="process-time">创建<br>' + (data.list[i].create_time ? data.list[i].create_time : '') + '</span></div>');
                            orderDetail.push('<div class="crosswise processPass-color-ing"></div><div class="process-round roundPass-color-ing"><div class="process-text"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></div><span class="process-time">分派<br>' + (data.list[i].assignTime ? data.list[i].assignTime : '') + '</span></div>');
                            orderDetail.push('<div class="crosswise processPass-color"></div><div class="process-round roundPass-color"><div class="process-text"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></div><span class="process-time">处理完成<br>' + (data.list[i].close_time ? data.list[i].close_time : '') + '</span></div>');
                        } else if (nowStatus == '处理完成' || nowStatus == '待评价') {
                            orderDetail.push('<div class="process-round roundPass-color-ing"><div class="process-text"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></div><span class="process-time">创建<br>' + (data.list[i].create_time ? data.list[i].create_time : '') + '</span></div>');
                            orderDetail.push('<div class="crosswise processPass-color-ing"></div><div class="process-round roundPass-color-ing"><div class="process-text"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></div><span class="process-time">分派<br>' + (data.list[i].assignTime ? data.list[i].assignTime : '') + '</span></div>');
                            orderDetail.push('<div class="crosswise processPass-color-ing"></div><div class="process-round roundPass-color-ing"><div class="process-text"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></div><span class="process-time">处理完成<br>' + (data.list[i].close_time ? data.list[i].close_time : '') + '</span></div>');
                        }
                        if (data.list[i].surveyStatus == 1) {
                            orderDetail.push('<div class="crosswise processPass-color"></div><div class="process-round roundPass-color"><div class="process-text"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></div><span class="process-time">评价</span></div></div>');
                        } else {
                            orderDetail.push('<div class="crosswise"></div><div class="process-round"><div class="process-text"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></div><span class="process-time">评价</span></div></div>');
                        }
                        orderDetail.push('</div></div>');

                        //单号
                        orderDetail.push('<div class="form-group"><label  class="not-Weight col-xs-2 col-sm-3 col-md-3 col-lg-2 control-label colorA4">单号:</label><div class="col-sm-4 col-md-4  col-xs-4"><label class="control-label not-Weight">' + data.list[i].ticketId + '</label><button type="botton" class="btn evaluate-btn">' + nowStatus + '</button></div></div>');
                        //系统名称
                        orderDetail.push('<div class="form-group"><label class="not-Weight col-xs-2 col-sm-3 col-md-3 col-lg-2 control-label colorA4">系统名称:</label><div class="col-lg-8 col-md-8 col-xs-8"><label class="control-label not-Weight">' + data.list[i].chr_category + '</label> </div></div>');
                        //问题描述
                        orderDetail.push('<div class="form-group"><label class="not-Weight col-xs-2 col-sm-3 col-md-3 col-lg-2 control-label colorA4">问题描述:</label><div class="col-lg-8 col-md-8 col-xs-8" style="margin-top:7px;">' + data.list[i].description + '</div></div>');
                        //附件
                        orderDetail.push('<div class="form-group"><label class="not-Weight col-xs-2 col-sm-3 col-md-3 col-lg-2 control-label colorA4">附件:</label><div class="col-lg-8 col-md-8 col-xs-8">');
                        console.log('附件' + data.list[i].requestAttach)

                        if (data.list[i].requestAttach && data.list[i].requestAttach.length > 0) {
                            var tmpAttach = data.list[i].requestAttach,
                                attachData = [];
                            for (var n in tmpAttach) {
                                attachData.push('<div class="file-img">');
                                attachData.push('<a href="http://10.24.64.224/SN_InterFace_Midea/attach?type=requestAttach&id=' + tmpAttach[n].id + '&category=com.task.midea_cn" class="filePath"><span>' + tmpAttach[n].name + '</span></a>');
                                attachData.push('</div>');
                            }
                            orderDetail.push(attachData.join(''));
                        }
                        orderDetail.push('</div></div>');
                        //催单次数
                        orderDetail.push('<div class="form-group"><label class="not-Weight col-xs-2 col-sm-3 col-md-3 col-lg-2 control-label colorA4">催单次数:</label><div class="col-lg-8 col-md-8 col-xs-8"><label class="control-label not-Weight">' + data.list[i].reminder_count + '次</label></div></div>');
                        //处理人，解决方案
                        //评价展示
                        if (data.list[i].surveyStatus == 1) {
                            //
                            orderDetail.push('<div class="form-group"><div class="page-header col-lg-offset-1 col-lg-10"></div></div>');
                            orderDetail.push('<div class="form-group"><label class="not-Weight col-xs-2 col-sm-3 col-md-3 col-lg-2 control-label colorA4">处理人:</label><div class="col-lg-8 col-md-8 col-xs-8"><label class="control-label not-Weight">' + data.list[i].engineerName + '</label> </div></div><div class="form-group"><label class="not-Weight col-xs-2 col-sm-3 col-md-3 col-lg-2 control-label colorA4">解决方案:</label><div class="col-lg-8 col-md-8 col-xs-8"><label class="control-label not-Weight">' + (data.list[i].resolveMethod ? data.list[i].resolveMethod : '') + '</label></div></div>');
                            orderDetail.push('<div class="form-group"><div class="col-lg-offset-2 col-sm-offset-3 col-md-offset-3 col-xs-offset-2 col-lg-10 col-xs-10 col-md-8 col-sm-8 Process-foot"><button data-dismiss="modal" aria-label="Close" aria-hidden="true" style="margin-right:20px" type="botton" class="btn btn-default pull-right">返回</button><button type="button" class="btn btn-default pull-right evaluate-color" data-toggle="modal" data-target="#evaluateModal" ticketId="' + $(obj).attr('id') + '" onclick="assessgetInfo(this)">评价</button></div></div>');
                        } else {
                            orderDetail.push('<div class="form-group"><div class="col-lg-offset-2 col-sm-offset-3 col-md-offset-3 col-xs-offset-2 col-lg-10 col-xs-10 col-md-8 col-sm-8 Process-foot"><button data-dismiss="modal" aria-label="Close" aria-hidden="true" style="margin-right:20px" type="botton" class="btn btn-default pull-right">返回</button></div></div>');
                        }
                        orderDetail.push('</form>');
                    }
                    $('#chat-modal').html(orderDetail.join(''));
                };
            } else {
                FAQ.showMsg(data.message);
            }
        },
        error: function() {
            FAQ.showMsg('请求失败');
            return;
        }
    });
}
//评价框弹出后加载当前服务单的相关信息

function assessgetInfo(obj) {
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        url: encodeURI(''+tmplink+'/WorkOrderInfo/ticketDetail'),
        data: 'ticketId=' + $(obj).attr('ticketId'),
        success: function(data) {
            if (!data.status) {
                //展示工程师及工程师ID,单号
                if (data.list && data.list.length > 0) {
                    $('#evaluateDetail').html('<label class="control-label not-Weight jobId" jobid="4"><b>' + data.list[0].engineerName + '</b></label><label class="control-label not-Weight">工号' + data.list[0].engineerId + '</label>');
                    $('#danhao').html(data.list[0].ticketId);
                }
            } else {
                FAQ.showMsg(data.message);
            }
        },
        error: function() {
            FAQ.showMsg('请求失败');
            return;
        }
    });
    //获取服务单Id
    $('#assessOrderForm input[name=ticketId]').val($(obj).attr('ticketId'));
    getAllInfo('survey_type');
}
//点击勾选礼物
$('#giftUl').on('click', '.present', function() {
    if (!$(this).hasClass('giftgray')) {
        $(event.currentTarget).children('.present-box').toggleClass('show');
        $('#assessOrderForm input[name=gift_Id]').val($(this).attr('giftId'));
    }
})
//选择不满意的原因
$('#showReason').on('click', 'span', function() {
    $(this).addClass('label-select').siblings().removeClass('label-select');
    $('#assessOrderForm input[name=surveyType]').val($(this).attr('id'));
})
//评价服务单

function assessOrder() {
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        url: encodeURI(''+tmplink+'/WorkOrderInfo/ticketEvaluation'),
        data: $('#assessOrderForm').serialize(),
        success: function(data) {
            if (!data.status) {
                FAQ.showMsg('感谢您的评价');
                $('#assessOrderForm')[0].reset();
            } else {
                FAQ.showMsg(data.message);
            }
        },
        error: function() {
            FAQ.showMsg('请求失败');
            return;
        }
    });
}

// 显示催单modal
$('#orderSerivceTemplate').on('click', '.expediteOrderSpan', function() {
    $(this).siblings('.expediteModel').removeClass('hide');
})
// 关闭催单modal
$('#orderSerivceTemplate').on('click', '.expedite-close', function() {
    $(this).parents('.expediteModel').addClass('hide');
})
//点击催单
$('#orderSerivceTemplate').on('click', '.evaluateOrderFn', function() {
    var obj = $(this);
    var tmpNum = obj.attr('num');
    $.ajax({
        type: 'post',
        datatype: 'json',
        cache: false,
        url: encodeURI(''+tmplink+'/WorkOrderInfo/ticketReminder'),
        data: 'sourse=MX&ticketId=' + obj.attr('id'),
        success: function(data) {
            if (!data.status) {
                obj.parent().siblings('.expedite-content').find('.red').html((tmpNum) * 1 + 1);
                obj.attr('disabled', 'disabled');
                var tiem = setTimeout(function() {
                    obj.removeAttr('disabled');
                }, 1000 * 10);
                tiem = null;
                obj.siblings('.expediteModel').addClass('hide');
                FAQ.showMsg('催单成功');
            } else {
                FAQ.showMsg(data.message);
            }
        },
        error: function() {
            FAQ.showMsg('请求失败');
            return;
        }
    });
})