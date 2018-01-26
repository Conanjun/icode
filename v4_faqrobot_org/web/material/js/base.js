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
                    formId: '',//被序列化的formId
                    dataObj: {},//直接传的对象
                    callback: function(){},//回调函数
                },

            options = $.extend({}, defaults, options);
            formData = $.extend({}, This.formatSeriData($('#'+ options.formId).serialize()), options.dataObj);

            $.ajax({
                url: encodeURI(options.url || '...'),//...为基础地址
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
        //格式化秒数->7203化为2时0分3秒
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
        //个位数前面加0
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

    }


    
    window.Base = new Base();




    







});

















































