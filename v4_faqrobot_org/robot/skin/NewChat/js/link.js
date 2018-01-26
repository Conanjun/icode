/**
 * Created by Administrator on 2017/3/17 0017.
 */
window.onload=function() {
    var body = document.body;

    //js中动态的去加载css文件和js文件
    var dynamicLoading = {
        css: function (path) {
            if (!path || path.length === 0) {
                throw new Error('argument "path" is required !');
            }
            var head = document.getElementsByTagName('head')[0];
            var link = document.createElement('link');
            link.href = path;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            head.appendChild(link);
        },
        js: function (path) {
            if (!path || path.length === 0) {
                throw new Error('argument "path" is required !');
            }
            var head = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');
            script.src = path;
            script.type = 'text/javascript';
            head.appendChild(script);
        }
    };

    var swiper_script = createEl('script', {'src': 'jquery-1.8.3.min.js?dev='+ Math.random()});
    swiper_script.onload = function() {$
        //点击事件的效果
        var num = 0;
        var Mydiv = document.getElementById("mydiv");
        var Myp = document.getElementById("myp");

        Myp.onclick = function (e) {
            if (num == 0) {
                num = 1;
                Mydiv.style.display = 'block';
                Myp.style.right = '272px';
                Mydiv.style.right = '0';
            }
            else if (num == 1) {
                num = 0;
                Mydiv.style.display = 'none';
                Myp.style.right = '0';
            }
            if (e && e.stopPropagation) {
                // this code is for Mozilla and Opera
                e.stopPropagation();
            } else if (window.event) {
                // this code is for IE
                window.event.cancelBubble = true;
            }
        };
        $(window)[0].onclick=function(){
            console.log(1)
            if (num == 1) {
                num = 0;
                Mydiv.style.display = 'none';
                Myp.style.right = '0';
            }
        };
    }
    document.querySelector('head').appendChild(swiper_script);

    dynamicLoading.css("/robot/skin/NewChat/css/show.css?sysNum=1476067342641247");//动态调用css的文件
    createDIV();
    function createDIV() {
        var div = document.createElement("div");//创建元素div
        p = document.createElement("p");//创建元素p
        iframe = document.createElement("iframe");//创建元素iframe
        body.appendChild(div);//在body中添加div
        body.appendChild(p);//在body中添加p
        div.appendChild(iframe);//在body中添加iframe
        iframe.setAttribute('frameborder', '0');//定义元素的属性 和值
        iframe.setAttribute('scrolling', 'no');//定义元素的属性 和值
        div.setAttribute("id", "mydiv");//定义元素的id 和属性名

        p.setAttribute("id", "myp");

        iframe.src = "/robot/Chatpage.html?sysNum=1000000";

        //兼容浏览器的冒泡事件


        //和height()函数方法的效果是一致的都是为了解决浏览器的视口高度的值再实时监听着body中的元素和body的高度变化

        simheight();
        function simheight() { //函数：获取尺寸
            //获取浏览器窗口高度
            var winHeight = 0;
            if (window.innerHeight)
                winHeight = window.innerHeight;
            else if ((document.body) && (document.body.clientHeight))
                winHeight = document.body.clientHeight;
            //通过深入Document内部对body进行检测，获取浏览器窗口高度
            if (document.documentElement && document.documentElement.clientHeight)
                winHeight = document.documentElement.clientHeight;
            //高度计算
            //高度计算
            document.getElementById("mydiv").style.height = winHeight + "px";

        }

        window.onresize = simheight;//浏览器窗口发生变化时同时变化DIV高度  实时的监听着浏览的高度是否在变化
        elentheight();
        function elentheight() { //函数：获取尺寸
            //获取浏览器窗口高度
            var winHeight = 0;
            if (window.innerHeight)
                winHeight = window.innerHeight;
            else if ((document.body) && (document.body.clientHeight))
                winHeight = document.body.clientHeight;
            //通过深入Document内部对body进行检测，获取浏览器窗口高度
            if (document.documentElement && document.documentElement.clientHeight)
                winHeight = document.documentElement.clientHeight;
            //高度计算
            document.body.style.height = winHeight + "px";
        }

    };

    function createEl(tagName, attrs, style, text) {
        var el = document.createElement(tagName);


        if (attrs) {
            for (key in attrs) {
                if (key == "className") {
                    el.className = attrs[key];
                } else if (key == "id") {
                    el.id = attrs[key];
                } else {
                    el.setAttribute(key, attrs[key]);
                }
            }
        }

        if (style) {
            for (key in style) {
                el.style[key] = style[key];
            }
        }


        if (text) {
            el.appendChild(document.createTextNode(text));
        }


        return el;
    }
};
