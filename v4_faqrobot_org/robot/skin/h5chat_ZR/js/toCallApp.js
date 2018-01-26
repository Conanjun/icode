// admin － Happy
// time  － 20170818
// desc  － h5调app交互

// alert(window.location.href);

var ZIROOMAppCommon = {    // 当前app版本
    app_version : "",
    _app_version : "",
    //现在版本
    _app_version_str : "",
    _app_version_arr : [],
    //临界版本
    _app_version_os_str : "",
    _app_version_os_arr : [],
    //比较版本高低
    compareVersion:function(_app_version_os){
        // 版本初始化
        ZIROOMAppCommon.initVersionArrAndStr();

        ZIROOMAppCommon._app_version_arr = ZIROOMAppCommon._app_version.split(".");
        ZIROOMAppCommon._app_version_os_arr = _app_version_os.split(".");

        for(var i = 0 ; i < ZIROOMAppCommon._app_version_arr.length ; i ++){
            ZIROOMAppCommon._app_version_str+=ZIROOMAppCommon._app_version_arr[i];
        }
        for(var j = 0 ; j < ZIROOMAppCommon._app_version_os_arr.length ; j ++){
            ZIROOMAppCommon._app_version_os_str+=ZIROOMAppCommon._app_version_os_arr[j];
        }

        ZIROOMAppCommon._app_version_str = ZIROOMAppCommon.addZero(ZIROOMAppCommon._app_version_str);
        ZIROOMAppCommon._app_version_os_str =ZIROOMAppCommon.addZero(ZIROOMAppCommon._app_version_os_str);

        if(parseInt(ZIROOMAppCommon._app_version_str) < parseInt(ZIROOMAppCommon._app_version_os_str)){
            //旧的
            return 'old';
        }else{
            //新的
            return 'new';
        }
    },
    // 版本号初始化
    initVersionArrAndStr:function(){
        ZIROOMAppCommon._app_version_arr = [];
        ZIROOMAppCommon._app_version_os_arr = [];
        ZIROOMAppCommon._app_version_str = "";
        ZIROOMAppCommon._app_version_os_str = "";
    },
    //版本号拼接0 兼容个版本号比较（10位数字）
    addZero:function(str){
        var len = str.length;
        var zero_str="";
        if(len < 10){
            for(var i = 0 ; i < (10-len) ; i ++){
                zero_str+="0";
            }
            return str+zero_str;
        }
    },
    // 获取url参数
    getUrlParameter:function (strParame){
        var args = new Object( );
        var query = location.search.substring(1);

        var pairs = query.split("&");
        for(var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('=');
            if (pos == -1) continue;
            var argname = pairs[i].substring(0,pos);
            var value = pairs[i].substring(pos+1);
            value = decodeURIComponent(value);
            args[argname] = value;
        }
        return args[strParame];
    },
    loadScript:function(_JsId,_JsSrc){
        $.getScript(_JsSrc+'?'+ new Date().getTime(),function(response,status){
            var oldjs = null;
            var t = null;
            var _oldJs = document.getElementById(_JsId);
            if(_oldJs) _oldJs.parentNode.removeChild(_oldJs);
            var scriptObj = document.createElement("script");
            scriptObj.src  = _JsSrc +'?'+ new Date().getTime();
            scriptObj.type = "text/javascript";
            scriptObj.id   = _JsId;
            document.getElementsByTagName("head")[0].appendChild(scriptObj);
            return true;
         });
    },
    //判断手机类型
    ismobile:function(test){
        var u = navigator.userAgent,
        app = navigator.appVersion;
        if(/AppleWebKit.*Mobile/i.test(navigator.userAgent) || (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent)))
        {
            if(window.location.href.indexOf("?mobile")<0)
            {
                try{
                    if(/iPhone|mac|iPod|iPad/i.test(navigator.userAgent))
                        {return '0';}
                    else
                        {return '1';}
                }
                catch(e){}
            }
        }
        else if( u.indexOf('iPad') > -1)
            {return '0';}
        else
            {return '1';}
    }
}
var ZIROOMApp = {
    // 初始化app
    initApp:function(paramsArr){
        // 获取当前app版本
        ZIROOMAppCommon._app_version = ZIROOMAppCommon.getUrlParameter('app_version')||localStorage.app_version||'0.0.0';
//      alert("版本号="+ZIROOMAppCommon.getUrlParameter('app_version'));
        var pla=ZIROOMAppCommon.ismobile(1);
        var currentItemCallback;
        var isGetLoginInfoAndLonin = false;
        var _index;
        if(pla=='0')
        {

            function setupWebViewJavascriptBridge(callback) {
                if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
                if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
                window.WVJBCallbacks = [callback];
                var WVJBIframe = document.createElement('iframe');
                WVJBIframe.style.display = 'none';
                WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
                document.documentElement.appendChild(WVJBIframe);
                setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
            }

            setupWebViewJavascriptBridge(function(bridge) {
                var uniqueId = 1;
                function log(message, data) {
                    var log = document.getElementById('log')
                    var el = document.createElement('div')
                    el.className = 'logLine'
                    el.innerHTML = uniqueId++ + '. ' + message + ':<br/>' + JSON.stringify(data)
                    if (log.children.length) { log.insertBefore(el, log.children[0]) }
                    else { log.appendChild(el) }
                }
                function appLogin(){
                    bridge.callHandler(
                        'regiterHanderH5ToApp', //方法名
                        {
                            "type":"",
                            "function":"login",//参数名
                            "parameter":{}//数据
                        },
                        function(responseData) {}
                    );
                }
                //h5调App
                $.each(paramsArr,function(index,item){
                    // console.log(paramsArr,index,item);
                    if(item.ele && item.ele != ""){
                        $("body").delegate(item.ele,'click',function(){
                            var _this = $(this);
                            if(item.flag){
                                item.flag = false;
                                var mainParam = ZIROOMApp.mainApp(item);
                                currentItemCallback = mainParam.callback;
                                if(item.type == "登录自定义"){
                                    isGetLoginInfoAndLonin = true;
                                }else{
                                    isGetLoginInfoAndLonin = false;
                                }
                                // console.log(mainParam);
                                if(item.type == "服务"){
                                    if(ZIROOMAppCommon.compareVersion(mainParam.ios) == "new"){
                                        bridge.callHandler(
                                            'regiterHanderH5ToApp', //方法名
                                            mainParam.params.new,
                                            function(responseData) {}
                                        );
                                    }else{
                                        if(mainParam.params.old){
                                            bridge.callHandler(
                                                mainParam.params.old,
                                                {'param': {}},
                                                function (responseData) {}
                                            );
                                        }else{
                                            if(item.oldCallback && item.oldCallback != ""){
                                                item.oldCallback();
                                            }else{
                                                if($("#upModel").length > 0){
                                                    $("#upModel").show();
                                                }else{
                                                    $("body").append('<div id="upModel" class="S_upModel"><div class="S_upModel_main"><p>请下载最新版APP</p><ul class="S_upModel_btn clearfix"><li><a href="javascript:$(\'#upModel\').hide();">取消</a></li><li><a href="javascript:$(\'#upModel\').hide();window.location.href=\'http://a.app.qq.com/o/simple.jsp?pkgname=com.ziroom.ziroomcustomer\'" target="_blank">去更新</a></li></ul></div></div>')
                                                }
                                            }
                                        }
                                    }
                                }else{
                                    if(item.type == "参数"){
                                        for(var k in mainParam.params.new.parameter){
                                            if(typeof(mainParam.params.new.parameter[k]) == "string" && mainParam.params.new.parameter[k].indexOf("data-") != -1){
                                                mainParam.params.new.parameter[k] = $(item.ele).attr(mainParam.params.new.parameter[k]);
                                            }
                                        }
                                    }
//                                  alert("版本比较="+ZIROOMAppCommon.compareVersion(mainParam.ios));
//                                  alert("fn="+mainParam.params.new.fn);
//                                  alert(JSON.stringify(mainParam.params.new.parameter));

                                    if(ZIROOMAppCommon.compareVersion(mainParam.ios) == "new"){
                                        if(mainParam.params.new.function == "openPdf"){
                                            // ios无需交互直接打开即可
                                            window.location.href = mainParam.params.new.parameter.pdfUrl;
                                        }else{
                                            bridge.callHandler(
                                                'regiterHanderH5ToApp', //方法名
                                                mainParam.params.new,
                                                function(responseData) {}
                                            );
                                        }
                                    }else{
                                        if(item.oldCallback && item.oldCallback != ""){
                                            item.oldCallback();
                                        }else{
                                            if($("#upModel").length > 0){
                                                $("#upModel").show();
                                            }else{
                                                $("body").append('<div id="upModel" class="S_upModel"><div class="S_upModel_main"><p>请下载最新版APP</p><ul class="S_upModel_btn clearfix"><li><a href="javascript:$(\'#upModel\').hide();">取消</a></li><li><a href="javascript:$(\'#upModel\').hide();window.location.href=\'http://a.app.qq.com/o/simple.jsp?pkgname=com.ziroom.ziroomcustomer\'" target="_blank">去更新</a></li></ul></div></div>')
                                            }
                                        }
                                    }
                                }
                                setTimeout(function(){item.flag = true;},300);
                            }
                        })
                    }else{
                       var mainParam = ZIROOMApp.mainApp(item);
                                currentItemCallback = mainParam.callback;
                                if(item.type == "登录自定义"){
                                    isGetLoginInfoAndLonin = true;
                                }else{
                                    isGetLoginInfoAndLonin = false;
                                }
                                // console.log(mainParam);
                                if(item.type == "服务"){
                                    if(ZIROOMAppCommon.compareVersion(mainParam.ios) == "new"){
                                        bridge.callHandler(
                                            'regiterHanderH5ToApp', //方法名
                                            mainParam.params.new,
                                            function(responseData) {}
                                        );
                                    }else{
                                        if(mainParam.params.old){
                                            bridge.callHandler(
                                                mainParam.params.old,
                                                {'param': {}},
                                                function (responseData) {}
                                            );
                                        }else{
                                            if(item.oldCallback && item.oldCallback != ""){
                                                item.oldCallback();
                                            }else{
                                                if($("#upModel").length > 0){
                                                    $("#upModel").show();
                                                }else{
                                                    $("body").append('<div id="upModel" class="S_upModel"><div class="S_upModel_main"><p>请下载最新版APP</p><ul class="S_upModel_btn clearfix"><li><a href="javascript:$(\'#upModel\').hide();">取消</a></li><li><a href="javascript:$(\'#upModel\').hide();window.location.href=\'http://a.app.qq.com/o/simple.jsp?pkgname=com.ziroom.ziroomcustomer\'" target="_blank">去更新</a></li></ul></div></div>')
                                                }
                                            }
                                        }
                                    }
                                }else{
                                    // console.log(mainParam.params.new);
                                    if(item.type == "参数"){
                                        for(var k in mainParam.params.new.parameter){
                                            if(typeof(mainParam.params.new.parameter[k]) == "string" && mainParam.params.new.parameter[k].indexOf("data-") != -1){
                                                mainParam.params.new.parameter[k] = $(item.ele).attr(mainParam.params.new.parameter[k]);
                                            }
                                        }
                                    }

//                                  alert("版本比较="+ZIROOMAppCommon.compareVersion(mainParam.ios));
//                                  alert("fn="+mainParam.params.new.fn);
//                                  alert(JSON.stringify(mainParam.params.new.parameter));

                                    // console.log(ZIROOMAppCommon.compareVersion(mainParam.ios));
                                    if(ZIROOMAppCommon.compareVersion(mainParam.ios) == "new"){
                                        bridge.callHandler(
                                            'regiterHanderH5ToApp', //方法名
                                            mainParam.params.new,
                                            function(responseData) {}
                                        );
                                    }else{
                                        if(item.oldCallback && item.oldCallback != ""){
                                            item.oldCallback();
                                        }else{
                                            if($("#upModel").length > 0){
                                                $("#upModel").show();
                                            }else{
                                                $("body").append('<div id="upModel" class="S_upModel"><div class="S_upModel_main"><p>请下载最新版APP</p><ul class="S_upModel_btn clearfix"><li><a href="javascript:$(\'#upModel\').hide();">取消</a></li><li><a href="javascript:$(\'#upModel\').hide();window.location.href=\'http://a.app.qq.com/o/simple.jsp?pkgname=com.ziroom.ziroomcustomer\'" target="_blank">去更新</a></li></ul></div></div>')
                                            }
                                        }
                                    }
                                }
                    }
                })
                //app调h5
                bridge.registerHandler("regiterHanderAppToH5", function(data, responseCallback) {
                    //app调用H5
                    // alert(JSON.stringify(data));
                    if(typeof(data) == "string"){
                        data=eval('('+data+')');
                    }
//                  alert(data.function);
                    // 获取登录状态信息
                    if(data.function == "sendLoginInfo"){
                        // app里面登录状态参数 - 可能是邮箱登录没有手机号 需根据需求调整
                        // alert(isGetLoginInfoAndLonin+'-'+currentItemCallback);
                        if(data.parameter.token != ""){
                            isGetLoginInfoAndLonin = false;
                        }
                        if(!isGetLoginInfoAndLonin && currentItemCallback && currentItemCallback != ""){
                            currentItemCallback(data.parameter);
                        }

                        if(isGetLoginInfoAndLonin){//登录状态组合
                            isGetLoginInfoAndLonin = false;
                            appLogin();
                        }
                    }
                    // 上传照片 － 示例 目前仅限海燕计划上传学生证和照片
                    if(data.function == "hyUploadImgResultUrl"){
                        // data.parameter.url 返回url
                        if(data.parameter.message == "success"){

                        }
                    }
                    if(data.function == "hyUploadStuIdCardResultUrl"){
                        // data.parameter.url 返回url
                        if(data.parameter.message == "success"){

                        }
                    }
                    // 上传照片 － 公用
                    if(data.function == "commonUploadImgResultUrl"){
                        // data.parameter.url 返回url
                        if(data.parameter.message == "success"){
                            currentItemCallback(data.parameter.url);
                        }
                    }

                });
            });
        }
        else if(pla=='1')
        {
            //android
            //1 引入文件
            ZIROOMAppCommon.loadScript('WebViewJavascriptBridge','//static8.ziroom.com/fecommon/library/app/WebViewJavascriptBridge.js');
            //2 交互
            setTimeout(function(){
                //函数定义
                function connectWebViewJavascriptBridge(callback) {
                    if (window.WebViewJavascriptBridge) {
                        return callback(WebViewJavascriptBridge)
                    } else {
                        document.addEventListener(
                            'WebViewJavascriptBridgeReady'
                            , function() {
                                callback(WebViewJavascriptBridge)
                            },
                            false
                            );
                    }
                }

                 //函数调用
                 connectWebViewJavascriptBridge(function(bridge) {
                    bridge.init(function(message, responseCallback) {
                        var data = {
                            'Javascript Responds': 'Wee!'
                        };
                        responseCallback(data);
                    });

                    bridge.registerHandler("regiterHanderAppToH5", function(data, responseCallback) {
                        //app调用H5
                        // alert(JSON.stringify(data));
                        if(typeof(data) == "string"){
                            data=eval('('+data+')');
                        }
//                      alert(data.function);
                        // 获取登录状态信息
                        if(data.function == "sendLoginInfo"){
                            // app里面登录状态参数 - 可能是邮箱登录没有手机号 需根据需求调整
                            // alert(isGetLoginInfoAndLonin+'-'+currentItemCallback);
                            if(data.parameter.token != ""){
                                isGetLoginInfoAndLonin = false;
                            }
                            if(!isGetLoginInfoAndLonin && currentItemCallback && currentItemCallback != ""){
                                currentItemCallback(data.parameter);
                            }

                            if(isGetLoginInfoAndLonin){//登录状态组合
                                isGetLoginInfoAndLonin = false;
                                appLogin();
                            }
                        }
                        // 上传照片 － 示例 目前仅限海燕计划上传学生证和照片
                        if(data.function == "hyUploadImgResultUrl"){
                            // data.parameter.url 返回url
                            if(data.parameter.message == "success"){

                            }
                        }
                        if(data.function == "hyUploadStuIdCardResultUrl"){
                            // data.parameter.url 返回url
                            if(data.parameter.message == "success"){

                            }
                        }
                        // 上传照片 － 公用
                        if(data.function == "commonUploadImgResultUrl"){
                            // data.parameter.url 返回url
                            if(data.parameter.message == "success"){
                                currentItemCallback(data.parameter.url);
                            }
                        }
                    });
                });
                function appLogin(){
                    window.WebViewJavascriptBridge.callHandler(
                        'regiterHanderH5ToApp', //方法名
                        {
                            "type":"",
                            "function":"login",//参数名
                            "parameter":{}//数据
                        },
                        function(responseData) {}
                    );
                }
                //h5调App
                $.each(paramsArr,function(index,item){
                    // console.log(paramsArr,index,item);
                    if(item.ele && item.ele != ""){
                        $("body").delegate(item.ele,'click',function(){
                            var _this = $(this);
                            if(item.flag){
                                item.flag = false;
                                var mainParam = ZIROOMApp.mainApp(item);
                                currentItemCallback = mainParam.callback;
                                if(item.type == "登录自定义"){
                                    isGetLoginInfoAndLonin = true;
                                }else{
                                    isGetLoginInfoAndLonin = false;
                                }
                                // console.log(mainParam);
                                if(item.type == "服务"){
                                    if(ZIROOMAppCommon.compareVersion(mainParam.android) == "new"){
                                        window.WebViewJavascriptBridge.callHandler(
                                            'regiterHanderH5ToApp', //方法名
                                            mainParam.params.new,
                                            function(responseData) {}
                                        );
                                    }else{
                                        if(mainParam.params.old){
                                            window.WebViewJavascriptBridge.callHandler(
                                                mainParam.params.old,
                                                {'param': {}},
                                                function (responseData) {}
                                            );
                                        }else{
                                            if(item.oldCallback && item.oldCallback != ""){
                                                item.oldCallback();
                                            }else{
                                                if($("#upModel").length > 0){
                                                    $("#upModel").show();
                                                }else{
                                                    $("body").append('<div id="upModel" class="S_upModel"><div class="S_upModel_main"><p>请下载最新版APP</p><ul class="S_upModel_btn clearfix"><li><a href="javascript:$(\'#upModel\').hide();">取消</a></li><li><a href="javascript:$(\'#upModel\').hide();window.location.href=\'http://a.app.qq.com/o/simple.jsp?pkgname=com.ziroom.ziroomcustomer\'" target="_blank">去更新</a></li></ul></div></div>')
                                                }
                                            }
                                        }
                                    }
                                }else{
                                    // console.log(mainParam.params.new);
                                    if(item.type == "参数"){
                                        for(var k in mainParam.params.new.parameter){
                                            if(typeof(mainParam.params.new.parameter[k]) == "string" && mainParam.params.new.parameter[k].indexOf("data-") != -1){
                                                mainParam.params.new.parameter[k] = $(item.ele).attr(mainParam.params.new.parameter[k]);
                                            }
                                        }
//                                      alert(mainParam.params.new.parameter.fid);
                                    }
                                    // console.log(ZIROOMAppCommon.compareVersion(mainParam.android));
                                    if(ZIROOMAppCommon.compareVersion(mainParam.android) == "new"){
                                        window.WebViewJavascriptBridge.callHandler(
                                            'regiterHanderH5ToApp', //方法名
                                            mainParam.params.new,
                                            function(responseData) {}
                                        );
                                    }else{
                                        if(item.oldCallback && item.oldCallback != ""){
                                            item.oldCallback();
                                        }else{
                                            if($("#upModel").length > 0){
                                                $("#upModel").show();
                                            }else{
                                                $("body").append('<div id="upModel" class="S_upModel"><div class="S_upModel_main"><p>请下载最新版APP</p><ul class="S_upModel_btn clearfix"><li><a href="javascript:$(\'#upModel\').hide();">取消</a></li><li><a href="javascript:$(\'#upModel\').hide();window.location.href=\'http://a.app.qq.com/o/simple.jsp?pkgname=com.ziroom.ziroomcustomer\'" target="_blank">去更新</a></li></ul></div></div>')
                                            }
                                        }
                                    }
                                }
                                setTimeout(function(){item.flag = true;},300);
                            }
                        })
                    }else{
                       var mainParam = ZIROOMApp.mainApp(item);
                                currentItemCallback = mainParam.callback;
                                if(item.type == "登录自定义"){
                                    isGetLoginInfoAndLonin = true;
                                }else{
                                    isGetLoginInfoAndLonin = false;
                                }
                                // console.log(mainParam);
                                if(item.type == "服务"){
                                    if(ZIROOMAppCommon.compareVersion(mainParam.android) == "new"){
                                        window.WebViewJavascriptBridge.callHandler(
                                            'regiterHanderH5ToApp', //方法名
                                            mainParam.params.new,
                                            function(responseData) {}
                                        );
                                    }else{
                                        if(mainParam.params.old){
                                            window.WebViewJavascriptBridge.callHandler(
                                                mainParam.params.old,
                                                {'param': {}},
                                                function (responseData) {}
                                            );
                                        }else{
                                            if(item.oldCallback && item.oldCallback != ""){
                                                item.oldCallback();
                                            }else{
                                                if($("#upModel").length > 0){
                                                    $("#upModel").show();
                                                }else{
                                                    $("body").append('<div id="upModel" class="S_upModel"><div class="S_upModel_main"><p>请下载最新版APP</p><ul class="S_upModel_btn clearfix"><li><a href="javascript:$(\'#upModel\').hide();">取消</a></li><li><a href="javascript:$(\'#upModel\').hide();window.location.href=\'http://a.app.qq.com/o/simple.jsp?pkgname=com.ziroom.ziroomcustomer\'" target="_blank">去更新</a></li></ul></div></div>')
                                                }
                                            }
                                        }
                                    }
                                }else{
                                    // console.log(mainParam.params.new);
                                    if(item.type == "参数"){
                                        for(var k in mainParam.params.new.parameter){
                                            if(typeof(mainParam.params.new.parameter[k]) == "string" && mainParam.params.new.parameter[k].indexOf("data-") != -1){
                                                mainParam.params.new.parameter[k] = $(item.ele).attr(mainParam.params.new.parameter[k]);
                                            }
                                        }
                                    }
                                    // console.log(ZIROOMAppCommon.compareVersion(mainParam.android));
                                    if(ZIROOMAppCommon.compareVersion(mainParam.android) == "new"){
                                        window.WebViewJavascriptBridge.callHandler(
                                            'regiterHanderH5ToApp', //方法名
                                            mainParam.params.new,
                                            function(responseData) {}
                                        );
                                    }else{
                                        if(item.oldCallback && item.oldCallback != ""){
                                            item.oldCallback();
                                        }else{
                                            if($("#upModel").length > 0){
                                                $("#upModel").show();
                                            }else{
                                                $("body").append('<div id="upModel" class="S_upModel"><div class="S_upModel_main"><p>请下载最新版APP</p><ul class="S_upModel_btn clearfix"><li><a href="javascript:$(\'#upModel\').hide();">取消</a></li><li><a href="javascript:$(\'#upModel\').hide();window.location.href=\'http://a.app.qq.com/o/simple.jsp?pkgname=com.ziroom.ziroomcustomer\'" target="_blank">去更新</a></li></ul></div></div>')
                                            }
                                        }
                                    }
                                }
                    }
                })
           },300);
        }
    },
    // 服务参数转换－新旧版本参数
    getFwCanShu:function (fw){
        var appFwOld = "";
        switch(fw)
        {   //日常保洁
            case 'toCleanRichang':
                appFwOld='clean_richang';
            break;
            //深度保洁
            case 'toCleanShendu':
                appFwOld='clean_shendu';
            break;
            //自如小搬
            case 'toMoveXiaoban':
                appFwOld='move_xiaoban';
            break;
            //自如厢货
            case 'toMoveTruck':
                appFwOld='move_truck';
            break;
            // 保洁储值卡
            case 'toCardClean':
                appFwOld='card_clean';
            break;
            // 消杀保洁
            case 'toCleanXiaosha':
                appFwOld='toCleanXiaosha';
            break;
            // 开荒保洁
            case 'toCleanKaihuang':
                appFwOld='toCleanKaihuang';
            break;
            // 民宿保洁
            case 'toCleanMinsu':
                appFwOld='toCleanMinsu';
            break;
            // 擦玻璃
            case 'toCleanCaboli':
                appFwOld='toCleanCaboli';
            break;
            // 专业除螨
            case 'toCleanChuman':
                appFwOld='toCleanChuman';
            break;
            // 水路管件
            case 'toRepairShuiluguanjian':
                appFwOld='toRepairShuiluguanjian';
            break;
            // 灯具电路
            case 'toRepairDengjudianlu':
                appFwOld='toRepairDengjudianlu';
            break;
            // 开锁换锁
            case 'toRepairKaisuohuansuo':
                appFwOld='toRepairKaisuohuansuo';
            break;
            // 空调清洗
            case 'toRepairKongtiaoqingxi':
                appFwOld='toRepairKongtiaoqingxi';
            break;
            // 优品家具
            case 'toUpinJiaju':
                appFwOld='toUpinJiaju';
            break;
            // 维修储值卡
            case 'toCardRepair':
                appFwOld='toCardRepair';
            break;
            // 关闭页面
            case 'closeAppPage':
                appFwOld='toFinshWeb';
            break;
            // 搬家列表
            case 'toMoveList':
                appFwOld='';
            break;
            // 保洁列表
            case 'toCleanList':
                appFwOld='';
            break;
            // 个人中心
            case 'toMyZiroom':
                appFwOld='';
            break;
            // 合同列表
            case 'toZiroomerContractList':
                appFwOld='';
            break;


        }
        return appFwOld;
    },
    // 各方法对应参数返回
    mainApp:function(item){
        // console.log(item);
        var data = {params:{}};
        var type = item.type,fn = item.fn,params = item.params;
        data.callback = item.callback;
        data.oldCallback = item.oldCallback;
        if(type == "服务"){
            // 跳转服务：开荒保洁（android5.2.8，iOS5.2.2)
            data.android = "5.2.8";
            data.ios = "5.2.2";
            data.params.new = {
                "type":"inner",
                "function":fn,//参数名
                "parameter":{}//数据
            };
            data.params.old = ZIROOMApp.getFwCanShu(fn);
        }else{
            switch(fn){
                //我的合同
                case "http://ZRQuestionDetailLinkToUrlTypeContract.ziroom.com":
                    data.android = "5.4.6";
                    data.ios = "5.4.5";
                    data.params.new = {
                        "type":"",
                        "function":"http://ZRQuestionDetailLinkToUrlTypeContract.ziroom.com",
                        "parameter":params
                    }
                break;
                //我的保洁
                case "http://ZRQuestionDetailLinkToUrlTypeDailycleaningOrderList.ziroom.com":
                    data.android = "5.4.6";
                    data.ios = "5.4.5";
                    data.params.new = {
                        "type":"",
                        "function":"http://ZRQuestionDetailLinkToUrlTypeDailycleaningOrderList.ziroom.com",
                        "parameter":params
                    }
                break;
                //双周保洁
                case "http://ZRQuestionDetailLinkToUrlTypeFortnight.ziroom.com":
                    data.android = "5.4.6";
                    data.ios = "5.4.5";
                    data.params.new = {
                        "type":"",
                        "function":"http://ZRQuestionDetailLinkToUrlTypeFortnight.ziroom.com",
                        "parameter":params
                    }
                break;
                //日常保洁
                case "http://ZRQuestionDetailLinkToUrlTypeDailycleaning.ziroom.com":
                    data.android = "5.4.6";
                    data.ios = "5.4.5";
                    data.params.new = {
                        "type":"",
                        "function":"http://ZRQuestionDetailLinkToUrlTypeDailycleaning.ziroom.com",
                        "parameter":params
                    }
                break;
                //消杀
                case "http://ZRQuestionDetailLinkToUrlTypeXiaoSha.ziroom.com":
                    data.android = "5.4.6";
                    data.ios = "5.4.5";
                    data.params.new = {
                        "type":"",
                        "function":"http://ZRQuestionDetailLinkToUrlTypeXiaoSha.ziroom.com",
                        "parameter":params
                    }
                break;
                //深度
                case "http://ZRQuestionDetailLinkToUrlTypeShendu.ziroom.com":
                    data.android = "5.4.6";
                    data.ios = "5.4.5";
                    data.params.new = {
                        "type":"",
                        "function":"http://ZRQuestionDetailLinkToUrlTypeShendu.ziroom.com",
                        "parameter":params
                    }
                break;
                //开荒
                case "http://ZRQuestionDetailLinkToUrlTypeKaihuang.ziroom.com":
                    data.android = "5.4.6";
                    data.ios = "5.4.5";
                    data.params.new = {
                        "type":"",
                        "function":"http://ZRQuestionDetailLinkToUrlTypeKaihuang.ziroom.com",
                        "parameter":params
                    }
                break;
                //搬家
                case "http://ZRQuestionDetailLinkToUrlTypeHousemoving.ziroom.com":
                    data.android = "5.4.6";
                    data.ios = "5.4.5";
                    data.params.new = {
                        "type":"",
                        "function":"http://ZRQuestionDetailLinkToUrlTypeHousemoving.ziroom.com",
                        "parameter":params
                    }
                break;
                //我的搬家
                case "http://ZRQuestionDetailLinkToUrlTypeHousemovingOrderList.ziroom.com":
                    data.android = "5.4.6";
                    data.ios = "5.4.5";
                    data.params.new = {
                        "type":"",
                        "function":"http://ZRQuestionDetailLinkToUrlTypeHousemovingOrderList.ziroom.com",
                        "parameter":params
                    }
                break;
                //在线报修
                case "http://ZRQuestionDetailLinkToUrlTypeRepair.ziroom.com":
                    data.android = "5.4.6";
                    data.ios = "5.4.5";
                    data.params.new = {
                        "type":"",
                        "function":"http://ZRQuestionDetailLinkToUrlTypeRepair.ziroom.com",
                        "parameter":params
                    }
                break;
                //我的报修
                case "http://ZRQuestionDetailLinkToUrlTypeRepairOrderList.ziroom.com":
                    data.android = "5.4.6";
                    data.ios = "5.4.5";
                    data.params.new = {
                        "type":"",
                        "function":"http://ZRQuestionDetailLinkToUrlTypeRepairOrderList.ziroom.com",
                        "parameter":params
                    }
                break;
                //宽带
                case "http://ZRQuestionDetailLinkToUrlTypeKuanDai.ziroom.com":
                    data.android = "5.4.6";
                    data.ios = "5.4.5";
                    data.params.new = {
                        "type":"",
                        "function":"http://ZRQuestionDetailLinkToUrlTypeKuanDai.ziroom.com",
                        "parameter":params
                    }
                break;
                //我的管家
                case "http://ZRQuestionDetailLinkToUrlTypeHousekeeper.ziroom.com":
                    data.android = "5.4.6";
                    data.ios = "5.4.5";
                    data.params.new = {
                        "type":"",
                        "function":"http://ZRQuestionDetailLinkToUrlTypeHousekeeper.ziroom.com",
                        "parameter":params
                    }
                break;
                //智能门锁
                case "http://ZRQuestionDetailLinkToUrlTypeIintelligentlock.ziroom.com":
                    data.android = "5.4.6";
                    data.ios = "5.4.5";
                    data.params.new = {
                        "type":"",
                        "function":"http://ZRQuestionDetailLinkToUrlTypeIintelligentlock.ziroom.com",
                        "parameter":params
                    }
                break;
                //投诉反馈
                case "http://ZRQuestionDetailLinkToUrlTypeSuggestions.ziroom.com":
                    data.android = "5.4.6";
                    data.ios = "5.4.5";
                    data.params.new = {
                        "type":"",
                        "function":"http://ZRQuestionDetailLinkToUrlTypeSuggestions.ziroom.com",
                        "parameter":params
                    }
                break;

            }
        }
        return data;
    }
};
// 调用参数解析示例
var paramsArrDemo = [
    {
        flag:true,//默认为true,用于防刷
        type:"服务",//类型，服务相关－服务 需要动态设置参数的－参数 房源列表－整租、友家、业主直租、（不限为空即可） 登录自定义的-登录自定义
        ele:".btn",//自定义触发相应交互的dom className
        fn:"addApp",//调app的方法
        params:{//相应方法需要的特定的参数必须
            "needparams":""//支持自定义属性动态取值data- 或其他直接取、赋值方式
        },
        callback:"appBack",// App调用前端H5 处理app返回的参数－目前只有登录有返回（后续调用上传照片也可能需要）
        oldCallback:"upload"//自定义旧版本交互方法名 为空时－默认提示更新
    }
];
