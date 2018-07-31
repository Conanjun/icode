var bridge = getJsBridge();
console.log(bridge)
alert(bridge)

function getToken(callback) {
    bridge.call("getToken", {},
                function(v) {
                // console.log(v);
                var re = JSON.parse(v);
                if (typeof callback == "function")
                callback(re)
                }
                )
}


function openWebView(url_, callback) {
    bridge.call("openWebView", { url: url_ },
                function(v) {
                var re = JSON.parse(v);
                if (typeof callback == "function")
                callback(re)
                
                })
}

function closeWebView(to_,callback) {
    bridge.call("closeWebView", {to:to_},
                function(v) {
                var re = JSON.parse(v);
                if (typeof callback == "function")
                callback(re)
                }
                )
}

function serviceError(code_, callback) {
    bridge.call("serviceError", { code: code_ },
                function(v) {
                var re = JSON.parse(v);
                if (typeof callback == "function")
                callback(re)
                }
                )
}

function share(title_,content_,imgUrl_, callback) {
    bridge.call("share", { title: title_,content:content_,imgUrl:imgUrl_ },
                function(v) {
                var re = JSON.parse(v);
                if (typeof callback == "function")
                callback(re)
                }
                )
}

function pay(payType_,ordId_,price_, callback) {
    bridge.call("pay", { payType:payType_,ordId:ordId_,price:price_},
                function(v) {
                var re = JSON.parse(v);
                if (typeof callback == "function")
                callback(re)
                }
                )
}

function statistics(event_,value_, callback) {
    bridge.call("statistics", { event: event_,value:value_ },
                function(v) {
                var re = JSON.parse(v);
                if (typeof callback == "function")
                callback(re)
                }
                )
}

function getLocation(callback) {
    bridge.call("getLocation", {},
                function(v) {
                // console.log(v);
                var re = JSON.parse(v);
                if (typeof callback == "function")
                callback(re)
                }
                )
}

function copy(value_,callback) {
    bridge.call("copy", {value:value_},
                function(v) {
                // console.log(v);
                var re = JSON.parse(v);
                if (typeof callback == "function")
                callback(re)
                }
                )
}

function scan(callback) {
    bridge.call("scan", {},
                function(v) {
                // console.log(v);
                var re = JSON.parse(v);
                if (typeof callback == "function")
                callback(re)
                }
                )
}