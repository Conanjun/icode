$('body').on('click','a[href^=javascript]',function(){
    creatFrame($(this).text())
})
function creatFrame(x){
    if($('#plantIframe')){
        $('#plantIframe').remove()
    }
        var frame=document.createElement('iframe');
        var loc='poc.faqrobot.cn';
        var regwlh = new RegExp('WLH=(\d*[a-zA-Z]*[^?|^#|^&]*)');
		var wlh = location.href.match(regwlh);//获取wlh
		if (wlh) {
			loc=wlh[1];
		}
        frame.id='plantIframe';
        frame.src='http://'+loc+'/robot/iframe.html?#'+x;
        frame.style.display='none';
        document.body.appendChild(frame)
}