(function() {
    /*
     * 可配置参数 
     * width   弹出框的宽          默认值1100
     * height  弹出框的高          默认值 690
     * imgsrc  it助手的图标路径
     * openUrl 弹出框的地址
     * iright  图标距离窗口右边距离 默认px
     * ibottom 图标距离窗口底边距离 默认px
    */
    var url = document.getElementById('entranceScript').src;
    // 获取途径
    var mideaSource = GetQueryString('mideaSource');
    var receiveId = GetQueryString('receiveId');
    var groupId = GetQueryString('groupId');

    function domainURI(str){  
        var durl=/http:\/\/([^\/]+)\//i;  
        domain = str.match(durl);
        if(domain){
            return domain[0];
        }
        return '';  
     }  

    
    // 获取script配置参数
    function GetQueryString(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = url.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }

    function ITRobotICO(parameter) {
        this.iHeight = parameter.height || 690;
        this.iWidth = parameter.width || 1100;
        this.location = domainURI(url)
        this.imgsrc = parameter.imgsrc || this.location + 'robot/skin/chat_midea/img/robotIT.png';
        this.openUrl = parameter.openUrl || this.location + 'robot/midea.html?sysNum=1476067342641247&false' + '&mideaSource=' + mideaSource + '&receiveId=' + receiveId + '&groupId=' + groupId;
        this.icoBottom = parameter.ibottom || 0;
        this.icoRight = parameter.iright || 0;
        this.rightImg = this.location + 'robot/skin/chat_midea/img/right.png';
        this.leftImg = this.location + 'robot/skin/chat_midea/img/left.png';
        
        
        this.init();
        this.addEvent();
    }

    ITRobotICO.prototype = {
        isUnfold: true,
        arrows:'',
        Itrobot:'',
        ITico:'',
        arrowsImg:'',
        init: function(){
            this.addHtml();
            this.arrows = document.getElementById('arrows');
            this.Itrobot = document.getElementById('Itrobot');
            this.ITico = document.getElementById('ITico');
            this.arrowsImg = document.getElementById('arrowsImg');
        },
        // 插入dom
        addHtml: function() {
            var ITicoClass = 'style=\'height: 70px;position: fixed;right: '+ this.icoRight +'px; bottom: '+ this.icoBottom +'px;z-index:9999;\'';
            var arrows = 'style=\'float: left; position: relative;height: 100%;cursor: pointer;width: 10px;border-right: 1px solid #14A0E8;border-radius: 6px 0px 0px 6px;background: #1AB2F3;\'';
            var arrowsImg = 'style=\'position: absolute;top: 30px;left: 3px;\'';
            var ItrobotClass = 'style=\'float: right;position: relative;width: 49px;height: 70px;background: #1AB2F3;border-radius: 0px 6px 6px 0px;\'';
            var ItrobotImg = 'style=\'position: absolute;right: 8px;top: 6px; cursor: pointer;\'';
            var imgsrc = this.imgsrc;
            var rightImg = this.rightImg;
            
            document.body.insertAdjacentHTML(
                'afterend',
                '<div id=\'ITico\'  '+ ITicoClass +'>'+
                    '<div id=\'arrows\' '+ arrows +'><img id="arrowsImg"  '+ arrowsImg +' src= '+ rightImg +' /></div>'+
                    '<div id="Itrobot"  '+ ItrobotClass +'>'+
                        '<img '+ ItrobotImg +' src="'+ imgsrc +'"/>'+
                    '</div>'+
                '</div>'
            )
        },
        // 添加点击时间
        addEvent: function() {
            var self = this;
            this.arrows.onclick =  function() {
                self.changeUnfold()
            }

            this.Itrobot.onclick = function() {
                self.openChat()
            }
        },
        // 收缩it服务图标
        changeUnfold: function() {
            if(this.isUnfold){
                arrowsImg.src = this.leftImg;
                ITico.style.right = '0px';
                Itrobot.style.display = 'none';
                this.isUnfold = false;
            }else{
                arrowsImg.src = this.rightImg;
                ITico.style.right = '20px';
                Itrobot.style.display = '';
                this.isUnfold = true;
            }
        },
        // 弹出聊天页面
        openChat: function() {
            var iHeight = this.iHeight || 705;
            var iWidth = this.iWidth || 1100;
            var iTop = (window.screen.availHeight - 30 - iHeight) / 2; 
            var iLeft = (window.screen.availWidth - 10 - iWidth) / 2; 
            var url = this.openUrl;
            window.open(url,"chatModal",'height=' + iHeight + ',innerHeight=' + iHeight + ',width=' + iWidth + ',innerWidth=' + iWidth + ',top=' + iTop + ',left=' + iLeft + ',status=no,toolbar=no,menubar=no,location=no,resizable=no,scrollbars=0,titlebar=no'); 
        }
    }


 
    new ITRobotICO({
        width:GetQueryString('width'),
        height:GetQueryString('height'),
        ibottom:GetQueryString('ibottom'),
        iright:GetQueryString('iright'),
        imgsrc:GetQueryString('imgsrc'),
        openUrl:GetQueryString('openUrl'),
    });

  

}())