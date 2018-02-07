/**************************** BEGIN ****************************/
/**
* base.js v-1.2.0
* 
* Copyright (c) 2016/3/3 Han Wenbo
*
* Here are some common public methods!
*
**/

;(function($, window, document, undefined) {
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
        //请求->所有的请求都需要经过(特殊的除外)
        request: function(options) {
            var This = this,
                params = {//必须参数
                    //todo...
                },
                defaults = {
                    formId: '',//被序列化的formId
                    callback: function(){},//回调函数
                },

            options = $.extend({}, defaults, options);
            formData = This.formatSeriData($('#'+ options.formId).serialize());

            $.ajax({
                url: encodeURI(options.url || '/servlet/Monitor'),
                type: options.type || 'get',
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
        /*loadPage({
            container: 'body',
            url: 'index.html',
            beforeSend: function() {
            },
            success: function() {
            },
        });*/
        loadPage: function(options) {
            var defaults = {
                    container: '',//承载容器
                    beforeSend: function(){},//请求前
                    success: function(){},//请求后
                },

            options = $.extend({}, defaults, options);

            $.ajax({
                url: encodeURI(options.url +'?dev='+ new Date()),
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
        //判断IE的版本(非ie返回undefined)
        ieVersion: function(){  
            var browser = navigator.appName;
            var b_version = navigator.appVersion;
            var version = b_version.split(";");
            var trim_Version = "";
            if(!version[1]) return;
            trim_Version = version[1].replace(/[ ]/g, "");
            if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE6.0") {
                return 6;
            } else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE7.0") {
                return 7;
            } else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE8.0") {
                return 8;
            } else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE9.0") {
                return 9;
            }
        },
        //获取光标位置
        getCursortPos: function(obj) {
            var CaretPos = 0;   // IE Support
            if(document.selection) {
            obj.focus();
                var Sel = document.selection.createRange();
                Sel.moveStart('character', -obj.value.length);
                CaretPos = Sel.text.length;
            }
            // Firefox support
            else if(obj.selectionStart || obj.selectionStart == '0')
                CaretPos = obj.selectionStart;
            return CaretPos;
        },
        //设置光标位置
        setCaretPos: function(obj, pos) {
            if(obj.setSelectionRange) {
                obj.focus();
                obj.setSelectionRange(pos, pos);
            }else if(obj.createTextRange) {
                var range = obj.createTextRange();
                range.collapse(true);
                range.moveEnd('character', pos);
                range.moveStart('character', pos);
                range.select();
            }
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
        addDots: function(str, num, type) {
            if(type) {//true 中文算两个字符
               var result = '',
                   len = 0;

               for(var i=0; i<str.length; i++) {
                   if(len < num) {
                       if(str[i].match(/[^\x00-\xff]+/)) {//匹配双字节字符(包括汉字)  [\u4e00-\u9fa5]能匹配中文字符
                           len += 1;
                       }else {
                           len += .5;
                       }
                       result += str[i];
                   }else {
                       result += '...';
                       break;
                   }
               }
               return result; 
            }else {
            str += '';
            if(str.length > num) {
                str = str.substr(0, num) +'...';
            }
            return str;
           }
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

    };

    window.MN_Base = new Base();



})(jQuery, window, document);

/**************************** END ****************************/