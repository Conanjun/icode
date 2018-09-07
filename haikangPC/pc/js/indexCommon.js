/**add by zhaoyuxing at 2018.9.3
 * indexCommon.js作用：
 * 1、编写index页面公共方法
 * 2、封装请求并进行统一管理
*/

/**
 * @object 接口统一管理对象 用于存储所有接口url
*/

var prefix = '../../';// 后端接口路径
var api = {
    doFindGroupList: prefix + 'QuestionHk/doFindGroupList',// 获取分类树
    doFindQueList: prefix + 'QuestionHk/doFindQueList',// 获取知识列表
    doEditCollect: prefix + 'QuestionHk/doEditCollect',// 首页收藏操作接口
    doAddHits: prefix + 'QuestionHk/doAddHits' // 进入详情页，增加浏览次数
}


/**
 * @function 封装ajax请求
 * @param params 对象，对象中可包括
 *  {
 *      url:url,  // 字符串 请求接口地址
 *      type:type, // 请求的类型
 *      data:data, // 请求的入参 
 *      successCallBack:successCallBack // 回调函数  请求成功回调
 *      errorCallback:errorCallback // 回调函数 请求失败回调 
 *  }
*/

function intercept(params) {
    var req = $.extend({}, params)
    req.type = req.type || 'post';
    req.data = req.data || {};
    if (!req.errorCallback) {
        req.errorCallback = function () {
            throw new Error('接口调用失败')
        }
    }
    $.ajax({
        url: req.url,
        type: req.type,
        data: req.data,
        success: function (data) {
            if (req.successCallBack) {
                req.successCallBack(data);
            }
        },
        error: function (data) {
            req.errorCallback(data);
        }
    })
}

/**
 * @function 构造函数 将url查询字符串 转化为对象形式
 * @return 对象 查询字符的对象形式
 * 使用方法：new 出实例 
 * var request = new UrlSearch() ;
 *  if(request.code){
 *      username= request.username
 *  }
 * 
 * */
function UrlSearch() {
    var search = window.location.search;//取得url中的查询字符串
    if (!search) {
        this['code'] = false;
    } else {
        this['code'] = true;
        search = search.substr(1); // 取得所有参数   stringvar.substr(start [, length ]
        var arr = search.split("&"); //各个参数放到数组里
        for (var i = 0; i < arr.length; i++) {
            var num = arr[i].indexOf("=");
            if (num > 0) {
                this[arr[i].substr(0, num)] = arr[i].substr(num + 1)
            }
        }
    }
}

/**
 * @function 封装设置localStorage的方法，存储时设置保存时间，以便设置过期
*/
function setLocalStorage(key, value) {
    var curtime = new Date().getTime(); // 获取当前时间 ，转换成JSON字符串序列 
    var valueDate = JSON.stringify({
        val: value,
        timer: curtime
    });
    try {
        localStorage.setItem(key, valueDate);
    } catch (e) {

    }
}

/**
 * @function 封装获取localStorage的方法，验证存储的值是否过期，如果过期则清除当前存储的值
 * 目前设置过期时间为1天
*/
function getLocalStorage(key) {
    var exp = 1000 * 60 * 60 * 24; // 过期时间 ：一天的毫秒数1000 * 60 * 60 * 24
    if (localStorage.getItem(key)) {
        var vals = localStorage.getItem(key); // 获取本地存储的值 
        var dataObj = JSON.parse(vals); // 将字符串转换成JSON对象
        // 如果(当前时间 - 存储的元素在创建时候设置的时间) > 过期时间 
        var isTimed = (new Date().getTime() - dataObj.timer) > exp;
        if (isTimed) {
            localStorage.removeItem(key);
            return null;
        } else {
            var newValue = dataObj.val;
        }
        return newValue;
    } else {
        return null;
    }
}