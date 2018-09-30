/**taskId=823 plantdata 定制聊天页面 add by zhaoyuxing 
 * 说明：plantData对象为定制的方面和变量，在minichat.js中调用
 * */ 
window.plantData={
    /**taskId=823 满意度评价结构 add by zhaoyuxing 
     * 说明：在minichat.js中将默认的kfhtml覆盖
     * */ 
    kfHtml: [
        '<div class="MN_answer_welcome MN_answer"><div class="MN_kftime">%formatDate%</div><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%helloWord%</div></div>',//欢迎语组合
        '<div class="MN_helpful"><div class="MN_yes"><p class="usefull"></p>有用</div><span class="line"></span><span class="MN_no"><i class="useless"></i>没用</span></div>',//满意度评价组合
        '<div class="MN_answer" aId="%aId%" cluid="%cluid%"><div class="MN_kftime">%formatDate%</div><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn_outer"><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%ansCon%%gusListHtml%%relateListHtml%</div>%commentHtml%</div></div>'//回答组合
    ],//客服结构(所有的属性和%xxx%都必须存在)
    tipWord:'北京小桔',
    perviousTime:new Date(),//前一次会话时间间隔
    hlperviousTime:'',//历史信息前一次时间间隔
    hlInter:'',//历史信息的时间间隔
    inter:'',//相邻2次会话之间的时间间隔
    setInterTime:30,//设置时间显示的间隔 单位s
    // taskId=823 plant调整同一客户发送内容的间隔 add by zhaoyuxing
    adjustMargin:function(){
        var _nowChatEle=$('#chatCtn>:last-child'),
        _preChatEle=_nowChatEle.prev(),
        nowChat=_nowChatEle.attr('class'),
        preChat=_preChatEle.attr('class');
        if(nowChat==preChat){
            _nowChatEle.css('padding-top','1px');
            _preChatEle.css('padding-bottom','1px');
        }
    },
    hlAdjustMargin:function(index){
        var hlList=$('.MN_answer_welcome').prevAll().not('.MN_record'),
            nowEle='',
            nextEle='';
        for(var i=0;i<hlList.length;i++){
            _nowEle=hlList.eq(i).attr('class');
            _nextEle=hlList.eq(i+1).attr('class');
            if(_nowEle==_nextEle){
                hlList.eq(i).css('padding-top','1px');
                hlList.eq(i+1).css('padding-bottom','1px');
            }    
        }
    },
    showTime(time,year,month,date,hour,minute,second,result){
        if(time){//历史记录查看
            var hlDate=new Date(year,month-1,date,hour,minute,second);
            if(plantData.hlperviousTime){
                plantData.hlInter=(hlDate.getTime()-plantData.hlperviousTime.getTime())/1000;
                plantData.hlperviousTime=hlDate;
                if(plantData.hlInter>plantData.setInterTime){
                    return result;
                }else{
                    return '';
                }
            }else{//首次查看聊天记录 直接显示时间 并记录当前时间 
                plantData.hlperviousTime=hlDate;
                return result;
            }
        }else{//聊天
            if(plantData.perviousTime){
                plantData.inter=(today.getTime()-plantData.perviousTime.getTime())/1000;
                plantData.perviousTime=today;
                /**taskId=823 plantdata定制，间隔n秒才会显示时间 Add By zhaoyuxing
                 * 说明：记录前一次会话发送事件与本次时间相减，获得差值；小于设置的间隔则返回空
                * plantData对象在chat2_plantdata.html中定义全局变量
                */
                if(plantData.inter>plantData.setInterTime){
                    return result;
                }else{
                    // if(This.isCallInit==1){
                    //   return result;
                    // }
                    return '';
                }
            }else{
                plantData.perviousTime=today;
                return result;
            }
        }
    }
}
        