/**
* base.js
* 
* Copyright (c) 2016/3/3 Han Wenbo
*
* Here are some common public methods!
*
**/


;$(function() {

    function Base() {
    }

    Base.prototype = {
        init: function() {
        },
        //请求->所有的请求都需要经过(特殊的除外)
        /*Base.request({
            url: '...',
            params: {
            },
            callback: function(data) {
            },
        });*/
        request: function(options) {
            var This = this,
                params = {//必须参数
                    //
                },
                defaults = {
                    prefix: '../../',//接口路径前缀(不能写根路径)
                    formId: '',//被序列化的formId
                    dataObj: {},
                    callback: function(){},//回调函数
                },
            options = $.extend({}, defaults, options);
            formData = $.extend({}, This.formatSeriData(decodeURIComponent(($('#'+ options.formId).serialize()))), options.dataObj);//中文乱码,使用decodeURIComponent解码即可
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
        },
        //加载页面(相当于$('xxx').load())
        /*Base.loadPage({
            url: '../common/nav.html',
            beforeSend: function() {
            },
            success: function() {
            },
        });*/
        loadPage: function(options) {
            var defaults = {
                    container: 'body',//承载容器
                    beforeSend: function(){},//请求前
                    success: function(){},//请求后
                },

            options = $.extend({}, defaults, options);

            $.ajax({
                url: encodeURI(options.url),
                type: 'get',
                cache: false,
                beforeSend: function() {
                    options.beforeSend();
                },
                success: function(data) {
                    options.success();
                    data = data.replace(/css\">/g, 'css?_='+ Math.random() +'\">');

                    $(options.container).append(data);

                }
            });
        },
        //格式化被序列化后的数据->a=1&b=2化为{a:1, b:2}
        formatSeriData: function(data) {
            if(!data) {
                return;
            }
            var obj = '',
                dot = ',',      
                arr = data.match(/[^&]+/g);

            for(var i=0; i<arr.length; i++) {
                var str = arr[i].match(/([^=]+)=([^=]*)/);
                if(i==arr.length - 1) {
                    dot = '';
                }
                obj += '"'+ str[1] +'"' +":"+ '"'+ str[2] +'"'+ dot;
            }
            return JSON.parse('{'+ obj +'}');
        },
        //判断浏览器类型  
        myBrowser: function(){  
            var userAgent = navigator.userAgent,  
                isOpera = userAgent.indexOf("Opera") > -1;  

            if (isOpera) {  
                return "Opera";  
            };  
            if (userAgent.indexOf("Firefox") > -1) {  
                return "FF";  
            }  
            if (userAgent.indexOf("Chrome") > -1){  
                return "Chrome";  
            }  
            if (userAgent.indexOf("Safari") > -1) {  
                return "Safari";  
            }  
            if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {  
                return "IE";  
            };  
        },
        //判断手机还是pc->true是pc
        /*if(Base.isPC()) {
            return;
        }*/
        isPC: function () {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                        "SymbianOS", "Windows Phone",
                        "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        },
        //禁用菜单
        banCtxMenu: function() {
            $(document).on("contextmenu",function(e){
                return false;
            });
        },
        //获取格式化时间
        getFormatDate: function() {
            var today = new Date(),
                year = today.getFullYear(),
                month = this.addZero(today.getMonth() + 1),
                date = this.addZero(today.getDate()),
                hour = this.addZero(today.getHours()),
                minute = this.addZero(today.getMinutes()),
                second = this.addZero(today.getSeconds());

            return year + "-" + month + "-" + date + ' ' + hour + ":" + minute + ":" + second;
        },
        //格式化秒数->7203秒化为02时00分03秒
        formatSecond: function(num) {
            var second = this.addZero(parseInt(num%60)) +'秒',
                minute = this.addZero(parseInt(num/60%60)) +'分',
                hour = this.addZero(parseInt(num/60/60%60)) +'时';

            if(hour == '00时') {
                hour = '';
                if(minute == '00分') {
                    minute = '';
                }
                
            }
            return hour + minute + second;
        },
        //格式化毫秒数->7203毫秒化为00分07秒20(原203，最后一位省略)毫秒
        /*//设置倒计时
        var t = 900000,//15分钟
            timer = setInterval(function() {
            $('.time').text(Base.formatMillisecond(t));
            if(t <= 0) {
                Base.layerMsg('中奖用户已揭晓，确认并跳转查看', function() {
                    this.location.href = '';
                });
                clearInterval(timer);
            }
            t -= 25;
        }, 25);*/
        formatMillisecond: function(num) {
            var millisecond = num%1000,
                second = this.addZero(parseInt(num/1000%60)) +':',
                minute = this.addZero(parseInt(num/1000/60%60)) +':';

            millisecond = millisecond>99 ? (millisecond+'').substring(0, (millisecond+'').length-1) : millisecond;
            millisecond = this.addZero(parseInt(millisecond));

            return minute + second + millisecond;
        },
        //个位数前面加0(num必须为int)
        addZero: function(num) {
            return num<10 ? "0" + num : num;
        },
        //多余字数加省略号
        addDots: function(str, num) {
            str += '';
            if(str.length > num) {
                str = str.substr(0, num) +'...';
            }
            return str;
        },
        //不重复获取1-maxRandom的数字，可设置允许出现的最大数
        getRandomNum: function(maxRandom, maxNum) {
            var arrA = [];
            var arrX = [];
            var arr = [];
            for(var m=0; m<maxRandom; m++) {
                var res = false;
                var ran = Math.ceil(Math.random()*maxRandom);

                while(!res) {
                    var x = 1;

                    for(var i=0; i<arrA.length; i++) {
                        if(ran != arrA[i]) {
                            arrX[i] = 1;
                        }else {
                            arrX[i] = 0;
                        }
                    }

                    for(var j=0; j<arrX.length; j++) {
                        x *= arrX[j];
                    }
                    if(x) {
                        res = true;
                        arrA.push(ran);
                    }else {
                        ran = Math.ceil(Math.random()*maxRandom);

                    }

                }
            }
            for(var i=0; i<arrA.length; i++) {
                if(maxNum < arrA[i]) {
                    arrA[i] = arrA[i]%maxNum ? arrA[i]%maxNum  : maxNum;
                }
            }

            return arrA;
        },
        //弹出提示框 (应用layer.js)
        /*Base.layerMsg(data.message);*/
        layerMsg: function(msg, callback) {
            var index = layer.open({
                title: false,
                shadeClose: true,
                content: msg,
                closeBtn: 0,
                area: ['270px'],
                end: function() {
                    if(callback) {
                        callback();
                    }else {
                        layer.close(index);
                    }
                }
            });
        },
        //将b转化为kb或m
        formatSize: function(num) {
            var kb = num/1024,
                mb = num/1024/1024;

            if(kb < 1024) {
                return kb.toFixed(1) +'KB';
            }else {
                return mb.toFixed(1) +'MB';
            }
        },
        //弹出提示框 (应用jquery.gritter.js)
        /*Base.gritter(data);*/
        gritter: function(msg, bool) {
            if(bool) {//y
                $.gritter.add({
                    title: "提醒",
                    text: msg,
                    time: 3000,
                });
            }else {//x
                if(msg == '请重新登陆！') {
                    $.gritter.add({
                        title: "提醒",
                        text: msg,
                        time: 3000,
                        after_close: function() {
                            top.location.href = '../../../login.html';//待完善
                        },
                        class_name: "gritter-light",
                    });
                }else {
                    $.gritter.add({
                        title: "提醒",
                        text: msg,
                        time: 3000,
                        class_name: "gritter-light",
                    });
                }
            }
        },
        // 判断网址
        url: function(url) {
            return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
        },
        // 获取纯文本
        getPlainText: function(str) {
            return (str+'').replace(/<[^>]*>|/g, '');
        }, 
        getNaturalSize: function(img, fn) {  
            if (img.naturalWidth) { //这属性很怪异(时而有效)      
                fn(img.naturalWidth, img.naturalHeight);  
            } else {  
                var pic = new Image();  

                pic.onload = function() { //加载完毕后(建议)      
                    fn(pic.width, pic.height);  
                }  
                pic.src = img.src; //这句放在onload后面(兼容ie8)      
            }  
        },  
    }


    
    window.Base = new Base();



    







});
















































