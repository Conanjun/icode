var clicks = new Array();
var HtoneSpace = {
    leftcallback: "",
    rightcallback: "",
    getLocation: "",
    JavascriptBridge: function connectWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) {
            callback(WebViewJavascriptBridge);
        } else {
            document.addEventListener('WebViewJavascriptBridgeReady', function () {
                callback(WebViewJavascriptBridge);
            }, false);
        }
    },
    //注册接收通知页面Key
    registerHtoneWebNotification: function (key) {
        //注册页面绑定的key，用于区分不同界面的标识
        try {
            uc.setCurrentWebViewTag(key);
        } catch (e) {
            //苹果的
            HtoneSpace.JavascriptBridge(function () {
                try {
                    window.WebViewJavascriptBridge.callHandler('registerWebNotification', { 'webKey': key }, '');
                } catch (ex) {
                    //alert("接口不存在2");
                }
            })
        }
    },
    //取消注册
    removeNotification: function (key) {
        try {
            window.WebViewJavascriptBridge.callHandler('removeWebNotification', { 'webKey': key }, '');
        } catch (e) {
        }
    },
    Refresh: function () {
        location.reload();
    },
    getUrl: function () {
        var curWwwPath = window.document.location.href;
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        var localhostPaht = curWwwPath.substring(0, pos);
        return localhostPaht;
    },
    addParaForUrl: function (url, str) {
        if (url.indexOf("http") !== -1 || url.indexOf("https") !== -1) {
            if (url.indexOf("?") != -1) {
                url = url + "&" + str;
            } else {
                url = url + "?" + str;
            }
        }
        return url;
    },
    //打开新页面
    openHToneURL: function (URL, title) {

        clicks.push(new Date());

        if (clicks.length > 1 && (clicks[clicks.length - 1].getTime() - clicks[clicks.length - 2].getTime()) < 2000) {
            return;
        }
        var Url = URL;
        if (Url.indexOf("http") == -1) {
            if (Url.indexOf("?") == -1) {
                Url = HtoneSpace.getUrl() + Url + "?time=" + new Date().getTime();
            } else {
                Url = HtoneSpace.getUrl() + Url + "&time=" + new Date().getTime();
            }
        }
        try {
            uc.loadUrl(Url);
        } catch (e) {
            setTimeout(function () {
                try {
                    Url = encodeURI(Url);
                    window.WebViewJavascriptBridge.callHandler("openURL", { "URL": Url, "title": title }, "")
                }
                catch (ex) {
                    window.open(Url);
                }
            }, 0)
        }
    },



    //设置导航栏
    setNavigationBar: function (title, position, leftCallback, rightCallBack, getLocations) {
        if (leftCallback instanceof Function) HtoneSpace.leftcallback = leftCallback;
        if (rightCallBack instanceof Function) HtoneSpace.rightcallback = rightCallBack;
        if (getLocations instanceof Function) HtoneSpace.getLocation = getLocations;
        var title = title;//导航栏标题
        var color = '';//导航栏背景色r,g,b格式，例如 color = '255,255,255';
        var rightButton = '';//右边按钮名称
        if (position != "") {
            rightButton = position;
        }
        var showClose = "0";//0：不显示返回按钮旁的关闭按钮，1：显示关闭按钮
        var enableGoBack = "0";//0 ：表示由网页来控制返回按钮的点击事件，1：表示客户端放弃控制导航栏返回按钮点击事件
        var paramt = { 'title': title, 'color': color, 'rightTitle': rightButton, 'showClose': showClose, 'enableGoBack': enableGoBack };
        try {
            uc.setNavigationBarInfo(JSON.stringify(paramt));
        } catch (e) {
            HtoneSpace.JavascriptBridge(function () {
                try {
                    window.WebViewJavascriptBridge.callHandler('setNavigationBarInfo', paramt, '');
                }
                catch (ex) {
                    //alert("您调用的接口不存在");
                }
            });
        }
    },
    //关闭页面
    dismissWebView: function () {
        try {
            uc.closeActivity();
        }
        catch (e) {
            setTimeout(function () {
                try {
                    window.WebViewJavascriptBridge.callHandler('dismissWebView', '', '');
                }
                catch (ex) {
                    //alert('您调用的接口不存在');
                }
            }, 0)
        }
    },
    //调用指定Tab页的js
    callWebViewJs: function (key, js) {
        try {
            uc.callWebViewJs(key, js);
        } catch (e) {
            setTimeout(function () {
                try {
                    window.WebViewJavascriptBridge.callHandler('postWebNotification', { 'webKey': key, 'function': js }, ''); //调用指定页面的指定方法
                } catch (ex) {
                }
            }, 10)
        }
    },
    init: function (rightInit) {
        HtoneSpace.JavascriptBridge(function (bridge) {
            bridge.init(function (message, responseCallback) {
                var data = { 'Javascript Responds': 'Wee!' };
                responseCallback(data);
            });
            bridge.registerHandler('onBnClickedReturn', function (data, responseCallback) {
                onBnClickedReturn();
            });
            if (rightInit) {
                bridge.registerHandler('onBnClickedMore', function (data, responseCallback) {
                    onBnClickedMore();
                });
                bridge.registerHandler('getCurrentLocationResult', function (data, responseCallback) {
                    getCurrentLocationResult(data);
                });
            }
        });
    },
    getUserInfo: function (url, loadObj) {
        $(loadObj).show();
        if (arguments[arguments.length - 1] instanceof Function) {
            callback = arguments[arguments.length - 1];
        }
        var spanTimeVersion = "";
        var spanTime = "";
        var date1 = new Date();
        var data = { 'code': 200, 'describe': '' };
        try {
            spanTimeVersion = "安卓";
            var result = uc.getCurrentUserInfo();
            data.result = result;
            var date2 = new Date();
            spanTime = date2.getTime() - date1.getTime()  //时间差的毫秒数
            HtoneSpace.getUserInfoCallback(data, url, loadObj, spanTimeVersion, spanTime);
        } catch (e) {
            try {
                var date3 = new Date();
                spanTimeVersion = "IOS";
                HtoneSpace.JavascriptBridge(function () {
                    window.WebViewJavascriptBridge.callHandler('getMyInfo', '', function (result) {
                        data.result = result;
                        var date4 = new Date();
                        spanTime = date4.getTime() - date3.getTime()  //时间差的毫秒数
                        HtoneSpace.getUserInfoCallback(data, url, loadObj, spanTimeVersion, spanTime)
                    });
                })
            } catch (e) {
                data.code = 300;
                data.describe = 'interface is fail';
                $(loadObj).hide();
            }
        }
    },
    getUserInfoCallback: function (data, url, loadObj, spanTimeVersion, spanTime) {
        if (data != null && data != undefined && data != "") {
            try {
                var result = JSON.parse(data.result);
                if (result != null && result != "" && result != undefined) {
                    if (result.accNbr) {
                        $.ajax({
                            type: "get",
                            url: "/Home/Index",
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader("user_id", result.accNbr);
                            },
                            success: function (xmlDoc, textStatus, xhr) {
                                if (xhr.status == 200) {
                                    $(loadObj).hide();
                                    HtoneSpace.openHToneURL(url);
                                }
                            }, error: function (e) {
                                $(loadObj).hide();
                                HtoneSpace.openHToneURL(url);
                            }
                        });
                    } else {
                        $(loadObj).hide();
                        HtoneSpace.openHToneURL(url);
                    }
                } else {
                    $(loadObj).hide();
                    HtoneSpace.openHToneURL(url);
                }
            } catch (e) {
                HtoneSpace.openHToneURL(url);
            }
        } else {
            $(loadObj).hide();
            HtoneSpace.openHToneURL(url);
        }
    },

    getCurUserInfo: function (callback) {
        try {
            var userInfo = uc.getCurrentUserInfo();
            if (callback instanceof Function)
                callback(userInfo);
            //return userInfo || '';
        } catch (e) {
            try {
                HtoneSpace.JavascriptBridge(function () {
                    window.WebViewJavascriptBridge.callHandler('getMyInfo', '', function (userInfo) {
                        //return userInfo || '';
                        if (callback instanceof Function)
                            callback(userInfo);
                    });
                })
            } catch (e) {
                //return '';
                if (callback instanceof Function)
                    callback('');
            }

        }
    }
}

function onBnClickedReturn() {
    if (HtoneSpace.leftcallback instanceof Function) {
        HtoneSpace.leftcallback();
    }
}

function onBnClickedMore() {
    if (HtoneSpace.rightcallback instanceof Function) {
        HtoneSpace.rightcallback();
    }
}

function updateLocationResult(jsondata) {
    stopLocationTrack();
    var loc = eval("(" + jsondata + ")");
    initMap(loc);

}

function getCurrentLocationResult(data) {
    if (HtoneSpace.getLocation instanceof Function) {
        HtoneSpace.getLocation(data);
    }
}

