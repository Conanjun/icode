// JavaScript Document
var wxId='';//微信公众号
var allName=[];
var curmenuValue='',curmenuPreValue='';
$(document).ready(function(){
	// 美化滚动条
	
	$('.bodyMiddle-ctn').slimScroll({
		height: '400px',
	});

	$('.emotion').qqFace({
		id : 'facebox', 
		assign:'words', 
		path:'../material/images/arclist/'	//表情存放的路径
	});
	/*$('.context-ctn input[name=btnStyle]').iCheck({
		radioClass : 'iradio_flat-grey',
		checkboxClass : 'icheckbox_flat-grey',
	});*/

	icheckInit();
	wxh();
	//点击添加菜单
	$('.topLeft').on('click','.menuBar1',function(){
		if(!wxId){
			tip('请选择微信公众号','error');
			return;
		}
		$('.context-ctn .topRight-error').hide().siblings('.topRight').show();
		clearRightCon();
		$('.topLeft .menuBar').html('<div class="menuBar2 menu-focus"><span class="menuBar2-ctn"><i class="titleIcon"></i><span class="menuTitle">菜单名称</span><input class="nameValue" type="hidden"  name="catename[0][0]" value=""><input class="act_type" type="hidden" name="type[0][0]"><input class="act_value" type="hidden" name="value[0][0]"><input class="act_key" type="hidden" name="key[0][0]" ></span><div class="menuList menu-focus-color"><i class="triangle triangle1"></i><i class="triangle triangle2"></i><div class="menuList-items"><div class="menuList-item-add"><i class="menuList-item-addBtn"></i></div></div></div></div><div class="menuBar2"><div class="menuBar2-add"><i class="menuBar2-addBtn"></i></div></div>');
		$('#menuName').val($('.menuBar .menu-focus .menuTitle').text());
	})
	//创建菜单
	$('.topLeft .menuBar').on('click','.menuBar2 .menuBar2-add',function(){
		clearRightCon();
		var allObj=$(this).parent();
		var curLen=allObj.index();
		//去掉其他的menu_focus样式
		var childMenuLen=allObj.siblings().find('.menuList .menuList-item');
		for(var i=0;i<childMenuLen.length;i++){
			childMenuLen.eq(i).removeClass('menu-focus');
		}
		allObj.siblings().removeClass('menu-focus').find('.menuList').hide().removeClass('menu-focus-color');
		if(curLen==1){
			$('.topLeft .menuBar').find('.menuBar2').eq(0).addClass('menuBar3');
			$('.topLeft .menuBar').find('.menuBar2').eq(1).addClass('menu-focus menuBar3').html('<span class="menuBar2-ctn"><i class="titleIcon"></i><span class="menuTitle">菜单名称</span><input class="nameValue" type="hidden"  name="catename[1][0]" value=""><input class="act_type" type="hidden" name="type[1][0]"><input class="act_value" type="hidden" name="value[1][0]"><input class="act_key" type="hidden" name="key[1][0]" ></span><div class="menuList menu-focus-color"><i class="triangle triangle1"></i><i class="triangle triangle2"></i><div class="menuList-items"><div class="menuList-item-add"><i class="menuList-item-addBtn"></i></div></div></div>');
			$('.topLeft .menuBar').append('<div class="menuBar2 menuBar3"><div class="menuBar2-add"><i class="menuBar2-addBtn"></i></div></div>')
		}else if(curLen==2){
			$('.topLeft .menuBar').find('.menuBar2').eq(2).addClass('menu-focus').html('<span class="menuBar2-ctn"><i class="titleIcon"></i><span class="menuTitle">菜单名称</span><input class="nameValue" type="hidden"  name="catename[2][0]" value=""><input class="act_type" type="hidden" name="type[2][0]"><input class="act_value" type="hidden" name="value[2][0]"><input class="act_key" type="hidden" name="key[2][0]"></span><div class="menuList menu-focus-color"><i class="triangle triangle1"></i><i class="triangle triangle2"></i><div class="menuList-items"><div class="menuList-item-add"><i class="menuList-item-addBtn"></i></div></div></div>');
		}
		$('#menuName').val($('.menu-focus .menuTitle').text());
	});
	
	$('.topLeft .menuBar').on('click','.menuBar2 .menuBar2-ctn',function(){
		//点击切换清空右侧框内容
		clearRightCon();
		var tmpObj=$(this).parent();
		tmpObj.addClass('menu-focus').find('.menuList').addClass('menu-focus-color').show();
		tmpObj.find('.menuList .menuList-item').removeClass('menu-focus');
		tmpObj.siblings().removeClass('menu-focus').find('.menuList').removeClass('menu-focus-color').hide();
		tmpObj.siblings().find('.menuList .menuList-item').removeClass('menu-focus');
		//此处判断是否有自菜单
		var curLength=$('.menu-focus .menuList-item').length;
		var tmpNameValue=$(this).find('input[class=nameValue]').val();
		$('.topRight #menuName').val(tmpNameValue);
		curmenuPreValue=tmpNameValue;
		curmenuValue=$(this).find('input[class=nameValue]').attr('name');
		if(curLength==0){
			//此处判断当前菜单下是否含有子菜单，如果有，超过5个则没有添加按钮，反之有添加按钮
			menuList();
			//展示当前的内容
			var tmpType=$(this).find('input[class=act_type]').val();
            var tmpValue=$(this).find('input[class=act_value]').val();
			showCon(tmpType, tmpValue);
            
            var tmpTypeN = $(".upSrc-btn-on").attr('type');
            var tmpValueN = $(".upSrc-btn-on").attr('val');
			// showCon(tmpTypeN, tmpValueN);
            
			$(this).find('input[class=act_type]').val(tmpType);
			//展示右侧添加内容区域
			$('.topRight .menuError').hide().siblings('.topRight-bottom').show();
		}else{
			$('.topRight .topRight-ctx').find('.menuError').show();
			$('.topRight .topRight-ctx').find('.topRight-bottom').hide();
		}
	});
	//点击创建子菜单添加子菜单
	$('.topLeft .menuBar').on('click','.menuList-item-add',function(){
		clearRightCon();
		//获取父级元素 的索引
		var tmpIndex=$(this).parents('.menuBar2').index();
		//获取当前元素的同辈元素的个数
		var curLen=$(this).parent().find('.menuList-item').length;
		$(this).parent().find('.menuList-item').removeClass('menu-focus');
		var tmpInput='<input type="hidden" name="catename['+tmpIndex+']['+(curLen+1)+']" class="nameValue"><input type="hidden" name="type['+tmpIndex+']['+(curLen+1)+']" class="act_type"><input type="hidden" name="value['+tmpIndex+']['+(curLen+1)+']"  class="act_value"><input type="hidden" name="key['+tmpIndex+']['+(curLen+1)+']"  class="act_key"><div class="menuList-item-ctx">子菜单名称</div>';
		$(this).before('<div class="menuList-item menu-focus">'+tmpInput+'</div>');
        $(this).parents('.menuBar2').removeClass('menu-focus');
		$('#menuName').val($('.menu-focus .menuList-item-ctx').text());
		//如果当前已经很创建5个了
		if(curLen>=4){
			$(this).remove();
		}

	});
	//点击已经添加的子菜单进入修改，添加信息页面
	$('.topLeft .menuBar').on('click','.menuList-item',function(){
		//如果当前是新增的则显示目前的数据
		clearRightCon();
		$(this).addClass('menu-focus').siblings().removeClass('menu-focus');
		$(this).parents('.menuBar2').removeClass('menu-focus');
		var type=$(this).find('input[class=act_type]').val();
		var value=$(this).find('input[class=act_value]').val();
		if(!type){
			
		}else{
            // var tmpTypeN = $(".upSrc-btn-on").attr('type');
            // var tmpValueN = $(".upSrc-btn-on").attr('val');
            // showCon(tmpTypeN, tmpValueN);
            
			showCon(type, value);
			if(value){
				$('.upSrc-body-select').show().siblings().hide();				
			}
		}
		//点击菜单将菜单名称传到当前编辑的菜单框中
		$('.topRight #menuName').val($(this).find('.menuList-item-ctx').html());
		curmenuPreValue=$(this).find('.menuList-item-ctx').html();
		curmenuValue=$(this).find('input[class=nameValue]').attr('name');
	})
	
	//内容点击触发相应的资源
	$('.context').on('click', '.chooseSrc, .chooseBtn, .deleteMenu, .save, .preview', function(e) {
		var oe = e || event,
			$target = $(this);
		$('.mk-mask, .mk-mark').remove();
	
		//图文框
		if($target.is('.chooseSrc1')) {
			//$('.popup').fadeIn(100).children('.msg-ctx').show().siblings(':not(.mask)').hide();
			$('#modal-dialog-msg').modal('show');
			//渲染图文列表
			imgTextList();
		}
		//图片框
		if($target.is('.chooseSrc2')) {
			//$('.popup').fadeIn(100).children('.pic-ctx').show().siblings(':not(.mask)').hide();
			$('#modal-dialog-pic').modal('show');
			$('#picPage .mk-mask').hide();
			//渲染图片列表
			picList();
		}
		//语音框
		if($target.is('.chooseSrc3')) {
			//$('.popup').fadeIn(100).children('.audio-ctx').show().siblings(':not(.mask)').hide();
			$('#modal-dialog-audio').modal('show')
			//渲染语音列表
			vedioList();
		}
		//视频框
		if($target.is('.chooseSrc4')) {
			$('.popup').fadeIn(100).children('.video-ctx').show().siblings(':not(.mask)').hide();
			$('.video-ctx .show, .shows').mask();
		}
		//答案框
		if($target.is('.chooseSrc5')) {
			$('#modal-dialog-ans').modal('show');
			//$('.popup').fadeIn(100).children('.ans-ctx').show().siblings(':not(.mask)').hide();
			//渲染答案列表
			ansList();
		}
		//网页框
		if($target.is('.chooseBtn')) {
			$('.popup').fadeIn(100).children('.web-ctx').show().siblings(':not(.mask)').hide();
		}
		//删除框
		var isflag = false;
		if($target.is('.deleteMenu')) {
			for(var i = 0;i < $('.menuBar div').length;i++){
				if($('.menuBar div').eq(i).hasClass('menu-focus')){
					isflag = true;
				}
			}
			if(!isflag){
				yunNotyError('请选择一个菜单进行删除！');
			}else{
				//获取删除当前菜单的名称
				var tmpMenu=$(this).parent().siblings('.topRight-middle').find('#menuName').val();
				$('.popup .delete-ctx .msgCtn').find('.msg').html('删除后"'+tmpMenu+'"菜单下设置的内容将被删除,确认删除？');
				$('.popup').fadeIn(100).children('.delete-ctx').show().siblings(':not(.mask)').hide();
			}
		}
		//发布框
		if($target.is('.save')) {
			checkmenu()
			// $('.popup').fadeIn(100).children('.release-ctx').show().siblings(':not(.mask)').hide();
		}
		//预览框
		if($target.is('.preview')) {
			$('.popup').fadeIn(100).children('.view-ctx').show().siblings(':not(.mask)').hide();
			preview();
		}
	})

	//鼠标滚动(手机端无滚轮)
	$('.view-ctx').on('mousewheel', function(event, delta) {
		delta = -delta;//
		var marginTop = parseInt($(this).css('marginTop'))
		if(delta<0) {//向上滚
			if(marginTop <= -250) {
				marginTop+=10;
			}
		}

		if(delta>0) {//向下滚
			if(marginTop >= -450) {
				marginTop-=10;
			}
		}

		$(this).css('marginTop', marginTop)
		return false;
	});
	
	//选择内容后点击保存
	$('.foot').on('click', '.confirm-msg, .confirm-pic, .confirm-audio, .confirm-video, .confirm-web, .confirm-release, .confirm-ans', function() {
		//选中图文点击保存
		if($(this).is('.confirm-msg')) {
			var tempClass=$('.bodyMiddle .mk-masked').parent().attr('class');
			var tempValue=$('.bodyMiddle .mk-masked').parent().attr('rel');
			var temp=$('.bodyMiddle .mk-masked').parent().html();
			$('.selectCtn1 .selectCtx').empty().append('<div class="'+tempClass+'">'+temp+'</div>');
			$('.selectCtn1 .selectCtx').find('.mk-masked').next().remove();
            $('.selectCtn1 .selectCtx').find('.mk-masked').remove();

            $('.upSrc-btn1').attr('type','5');
            $('.upSrc-btn1').attr('val',tempValue);
            
			$('.menu-focus').find('input[class=act_type]').val(5);
			$('.menu-focus').find('input[class=act_value]').val(tempValue);
		}
		//选中图片点击保存
		if($(this).is('.confirm-pic')) {
			var temp=$('.bodyMiddle .mk-masked').parent().html();
			var tempValue=$('.bodyMiddle .mk-masked').parent().attr('rel');
			$('.selectCtn2 .selectCtx').empty().append('<div class="show">'+temp+'</div>');
			$('.selectCtn2 .selectCtx').find('.mk-masked').next().remove();
            $('.selectCtn2 .selectCtx').find('.mk-masked').remove();

            $('.upSrc-btn2').attr('type','2');
            $('.upSrc-btn2').attr('val',tempValue);

			$('.menu-focus').find('input[class=act_type]').val(2);
			$('.menu-focus').find('input[class=act_value]').val(tempValue);
		}
		if($(this).is('.confirm-audio')) {
			var cboxs = document.getElementsByName('vedioRdo');
			if(typeof cboxs=="undefined"){
				return "";
			}
			var inputvalue="";
			for(var i=0;i<cboxs.length;i++){
				if(cboxs[i].checked==true){
					inputvalue=cboxs[i].value;	
				}		
			}
			var obj=$('.check_'+inputvalue)
			var tmpCon='<div class="show "><i></i><div><p class="title">'+obj.find('td').eq(1).html()+'</p><p class="time">'+obj.find('td').eq(2).html()+'</p></div></div>';
			$('.selectCtn3 .selectCtx').empty().append(tmpCon);
            
            $('.upSrc-btn3').attr('type','3');
            $('.upSrc-btn3').attr('val',inputvalue);


			$('.menu-focus').find('input[class=act_type]').val(3);
			$('.menu-focus').find('input[class=act_value]').val(inputvalue);
		}
		if($(this).is('.confirm-video')) {
			$('.selectCtn4 .selectCtx').empty().append(This.chooseStr);
            /******************/
            $('.upSrc-btn3').attr('type','4');
            
			$('.menu-focus').find('input[class=act_type]').val(4);
		}
		
		if($(this).is('.confirm-ans')) {
			//选中答案
			var tmpObj=$('#modal-dialog-ans .ansTab').find('input:radio');
			var tmpValue='';
			$.each(tmpObj, function(i, authItem){
				if(authItem.checked==true){
					tmpValue=authItem.value;
				}
			});
			var ansObj=$('.ans_'+tmpValue+'').children('td').eq(1).find('div').html();
			$('.selectCtn5 .selectCtx').html(ansObj);
			$('.selectCtn5 .conAns').css({'overflow':'auto','max-width':'450px','max-height':'250px'});
            
            $('.upSrc-btn5').attr('type','101');
            $('.upSrc-btn5').attr('val',tmpValue);
            
            $('.menu-focus').find('input[class=act_type]').val(101);
			$('.menu-focus').find('input[class=act_value]').val(tmpValue);
		}
		if($(this).is('.confirm-web')) {
			
		}
		//发布
		if($(this).is('.confirm-release')) {
			publishWx();
		}
		$('.popup').fadeOut(100);
	});
	
	
	//取消预览
	$('.popup .view-ctx').find('.endView').click(function(){
        $('.popup').fadeOut(100).children('.view-ctx').hide();
		$('html').removeClass('overFlowY');
		$('.view-ctx .phoneBottom .menuBar-v').html('')
	})
	
	//文本的设置与修改
	$('.topRight .choooseText').blur(function(){
        $('.upSrc-btn6').attr('type','1');
        $('.upSrc-btn6').attr('val',wxface($(this).val()));


		$('.menu-focus').find('input[class=act_type]').val(1);
		$('.menu-focus').find('input[class=act_value]').val(wxface($(this).val()));
	})
	//点击删除回复初始状态
	$('.upSrc-body-select .delete-select').on('click', function() {
		$(this).siblings().empty();
		$(this).parents('.upSrc-body-select').hide().siblings().show();
		$(".menu-focus input[class=act_value]").val("")
	});

	//选中内容后取显示出取消的按钮
	$('.foot').on('click', '.confirm-msg, .confirm-pic, .confirm-audio, .confirm-video, .confirm-ans, .confirm-delete, .cancel, .head i', function(e) {
		var oe = e || event,
			$target = $(this);

		//各种选择素材按钮显隐
		if($target.is('.confirm-msg')) {
			$('#modal-dialog-msg').modal('hide');
			$('.upSrc-body-ctx').hide().siblings().show();
			$('.selectCtn1').show().siblings().hide();
		}
		if($target.is('.confirm-pic')) {
			$('#modal-dialog-pic').modal('hide');
			$('.upSrc-body-ctx').hide().siblings().show();
			$('.selectCtn2').show().siblings().hide();

		}
		if($target.is('.confirm-audio')) {
			
			$('#modal-dialog-audio').modal('hide');
			$('.upSrc-body-ctx').hide().siblings().show();
			$('.selectCtn3').show().siblings().hide();
		}
		if($target.is('.confirm-video')) {
			$('.upSrc-body-ctx').hide().siblings().show();
			$('.selectCtn4').show().siblings().hide();
		}
		if($target.is('.confirm-ans')) {
			$('#modal-dialog-ans').modal('hide');
			$('.upSrc-body-ctx').hide().siblings().show();
			$('.selectCtn5').show().siblings().hide();
		}

		//删除菜单确认
		if($target.is('.confirm-delete, .cancel, .head i')) {
			if($target.is('.confirm-delete')) {
				//判断当前是跟菜单还是子菜单
				var curObj=$('.topLeft .menuBar .menuBar2');
				//跟菜单
				if(curObj.hasClass('menu-focus')){					
					//删除该菜单下的所有菜单名称
					var menuObj=$('.topLeft .menuBar .menu-focus');
					allName.splice($.inArray(menuObj.find('.menuTitle').html(),allName),1);
					var menuList=menuObj.find('.menuList-item');
					for(var i=0;i<menuList.length;i++){
						var str=menuList.eq(i).find('.menuList-item-ctx').html();
						allName.splice($.inArray(str,allName),1);
					}
					var curLen=curObj.length;
					if(curLen==2){
						$('.topLeft .menuBar').html('<div class="menuBar1"><i></i><span>添加菜单</span></div>');
					}else if(curLen==3){
						//如果有三个menuBar2，再判断是不是三个子菜单
						if(curObj.eq(2).find('.menuBar2-add').length>0){
							curObj.removeClass('menuBar3');
							$('.topLeft .menuBar').find('.menu-focus').remove();
						}else{
							$('.topLeft .menuBar').find('.menu-focus').remove();
							$(".menuBar").append('<div class="menuBar2 menuBar3"><div class="menuBar2-add"><i class="menuBar2-addBtn"></i></div></div>')
						}
					}
					// 删除跟菜单之后需要将当前索引更新一下
					var parents=$(".topLeft .menuBar").find("span[class=menuBar2-ctn]")
					var length=parents.size();
					for(var i=0;i<length;i++){
						// 修改根菜单索引
						parents.eq(i).find('input[class="nameValue"]').attr('name','catename['+i+'][0]');
						parents.eq(i).find('input[class="act_type"]').attr('name','type['+i+'][0]');
						parents.eq(i).find('input[class="act_value"]').attr('name','value['+i+'][0]');
						parents.eq(i).find('input[class="act_key"]').attr('name','key['+i+'][0]');
						// 修改子菜单索引
						var sonObj=parents.eq(i).next().find(".menuList-items ").find(".menuList-item");
						var sonLength=sonObj.size();
						for(var j=0;j<sonLength;j++){
							var jnext=j+1
							sonObj.eq(j).find('input[class="nameValue"]').attr('name','catename['+i+']['+jnext+']');
							sonObj.eq(j).find('input[class="act_type"]').attr('name','type['+i+']['+jnext+']');
							sonObj.eq(j).find('input[class="act_value"]').attr('name','value['+i+']['+jnext+']');
							sonObj.eq(j).find('input[class="act_key"]').attr('name','key['+i+']['+jnext+']');
						}
					}
				}else{
					//子菜单
					
					//删除子菜单之后需要将当前索引更新一下
					var allObj=$('.topLeft .menuBar').find('.menu-focus');
					var parentIndex=allObj.parents('.menuBar2').index();
					var curIndex=allObj.index();
					var parent=allObj.parent();
					var childIndex=parent.find('.menuList-item').length;
					var tmp=childIndex-curIndex;
					for(var m=0;m<tmp;m++){
						var edit=curIndex+m;
						parent.find('.menuList-item input[name="catename['+parentIndex+']['+(edit+1)+']"]').attr('name','catename['+parentIndex+']['+edit+']');
						parent.find('.menuList-item input[name="type['+parentIndex+']['+(edit+1)+']"]').attr('name','type['+parentIndex+']['+edit+']');
						parent.find('.menuList-item input[name="value['+parentIndex+']['+(edit+1)+']"]').attr('name','value['+parentIndex+']['+edit+']');
						parent.find('.menuList-item input[name="key['+parentIndex+']['+(edit+1)+']"]').attr('name','key['+parentIndex+']['+edit+']');	
					}
					//删除掉当前菜单名
					var curValue=allObj.find('.menuList-item-ctx').html();
					allName.splice($.inArray(curValue,allName),1);
					//如果当前子菜单小于5个了，需要给出添加按钮
					if(allObj.siblings().length<5){
						if(allObj.siblings().length==0){
							$('.menu-focus-color .menuList-items').html('<div class="menuList-items"><div class="menuList-item-add"><i class="menuList-item-addBtn"></i></div></div>');
						}else{
							if($('.menu-focus-color .menuList-items').find('.menuList-item-add').length>0){
								
							}else{
								$('.menu-focus-color .menuList-items').append('<div class="menuList-item-add"><i class="menuList-item-addBtn"></i></div>');
							}
						}
						//显示跟菜单的内容
						//allObj.parents('.menuBar2').find('.menuBar2-ctn').trigger('click');
					}
					$('.topLeft .menuBar').find('.menu-focus').remove();
				}
				//删除之后清空右侧内容
				clearRightCon();
			}
			$('.popup').fadeOut(100);
		}
	});


	btnChooseDiv()
	
	//输入菜单名称
	$('.topRight #menuName').blur(function(){
		
		//判断当前的菜单名称是否符合要求
		var tmpValue=$(this).val();
		if(tmpValue=='' || tmpValue=='子菜单名称'){
			// tip('请输入菜单名称','error');
			$('.menu-focus').find('input[class=nameValue]').val(tmpValue)
			// return;
		}else{
			if(curmenuPreValue==tmpValue){
			
			}else{
				if($('.menu-focus').hasClass('menuList-item')){
					curmenuPreValue=$('.menu-focus input[class=nameValue]').val();
					if(curmenuValue==$('.menu-focus input[class=nameValue]').attr('name')){
						allName.splice($.inArray(curmenuPreValue,allName),1);					
					}else{
						curmenuValue=$('.menu-focus input[class=nameValue]').attr('name');
					}
					$('.menu-focus').find('.menuList-item-ctx').html(tmpValue)
					$('.menu-focus').find('input[class=nameValue]').val(tmpValue);
				}else{
					curmenuPreValue=$('.menu-focus .menuBar2-ctn input[class=nameValue]').val();
					if(curmenuValue==$('.menu-focus .menuBar2-ctn input[class=nameValue]').attr('name')){
						allName.splice($.inArray(curmenuPreValue,allName),1);					
					}else{
						curmenuValue=$('.menu-focus .menuBar2-ctn input[class=nameValue]').attr('name');
					}
					$('.menu-focus .menuTitle').html(tmpValue);
					$('.menu-focus .menuBar2-ctn').find('input[class=nameValue]').val(tmpValue);
				}
				checkArray(tmpValue);
			}
		}
	}).focus(function(){
	});
	
	//输入Url地址
	$('.topRight #inputLink').blur(function(){
		var tmpValue=$(this).val();
		var sear=new RegExp('http://');
		var sear2=new RegExp('https://');
		if(!sear.test(tmpValue)){
			if(!sear2.test(tmpValue)){
				tmpValue='http://'+tmpValue;
			}
		}
		if(!validUrl(tmpValue)){
			tip('请输入有效的url地址','error');
			return;
		}
		
		/*
		放置内容同
		*/
		if($('.menu-focus').hasClass('menuList-item')){
			$('.menu-focus input[class=act_value]').val(tmpValue);
			$('.menu-focus input[class=act_type]').val(6);
		}else{
			$('.menu-focus .act_value').val(tmpValue);
			$('.menu-focus .act_type').val(6);
		}
		
	}).focus(function(){
		//$(this).val('');
	})
	//预览点击菜单切换跟菜单
	$('.phoneBottom .menuBar-v').on('click','.menuBar2-ctn',function(){
		$(this).siblings('.menuList').show();
		$(this).parent().siblings().find('.menuList').hide();
		if($(this).siblings().find('.menuList-item').length==0){
            // console.log('val:'+$(".upSrc-btn-on").attr('type')+'val:'+$(".upSrc-btn-on").attr('val'))
            // console.log('val:'+$(this).find('input[class=act_type]').val()+'val:'+$(this).find('input[class=act_value]').val())

			var typeN = $(this).children('.act_type').val();
            var valN =  $(this).children('.act_value').val();
      		preview_ans(typeN,valN)

			// preview_ans($(this).find('input[class=act_type]').val(),$(this).find('input[class=act_value]').val())
		}
	})
	//预览点击子菜单给出设置的答案
	$('.phoneBottom .menuBar-v').on('click','.menuList-item-ctx',function(){
		var tmpType=$(this).siblings('input[class="act_type"]').val();
		var tmpValue=$(this).siblings('input[class="act_value"]').val();
        $(this).parents('.menuList').hide();;
	   
		preview_ans(tmpType,tmpValue)

	})
	//新建图文消息
	$('.msg-ctx').on('click','#newCreateImgText',function(){
		var href="web/material_old/Upload-img-texts.html";
		but_click(3,315,href,'添加图文',true,false);
	})
	
	///设置答案中点击新建跳转到相应的内容
	$('.topRight .upSrc-body').on('click','#addNewBtn_5,#addNewBtn_3,#addNewBtn_2,#addNewBtn_1',function(){
		$target = $(this);
		var tmpHref='';
		if($target.is('#addNewBtn_5')) {
			if(window.top.location.href != window.location.href) {
				$('body').append('<a href="../../web/knowledge/addQuestion.html" data-num="0" data-name="添加问题" style="display:none;" id="g6">添加问题</a>');
				iframeTab.init({
					iframeBox: ''
				});
				$('#g6').trigger('click');
			} else {
				location.href="../../web/knowledge/addQuestion.html";
			}
		}
		if($target.is('#addNewBtn_3') || $target.is('#addNewBtn_2')) {
			if(window.top.location.href != window.location.href) {
				$('body').append('<a href="../../web/material/addSrc.html" data-num="0" data-name="添加素材" style="display:none;" id="g7">添加素材</a>');
				iframeTab.init({
					iframeBox: ''

				});
				$('#g7').trigger('click');
			} else {
				location.href="../../web/material/addSrc.html";
			}
		}
		if($target.is('#addNewBtn_1')) {
			if(window.top.location.href != window.location.href) {
				$('body').append('<a href="../../web/material/imgTexts.html" data-num="0" data-name="新建图文消息" style="display:none;" id="g8">新建图文消息</a>');
				iframeTab.init({
					iframeBox: ''
				});
				$('#g8').trigger('click');
			} else {
				location.href="../../web/material/imgTexts.html";
			}
		}
	})
	//点击tr选中radio
	$('.ans-ctx .bodyMiddle .ansTab').on('click','tr',function(){
		
		if($(this).hasClass("selected")){
			$(this).removeClass("selected").find(":radio").iCheck('uncheck');
		}else{
			$(this).addClass("selected").find(":radio").iCheck('check');
			$(this).siblings().removeClass("selected");
		} 
		
	});
	$('#modal-dialog-pic').on('show.bs.modal', function () {
		$.fn.zTree.init($("#treeHide"),hidesetting,[]);
		hideMenu();
	});
});

// icheck初始化之后绑定事件
function btnChooseDiv(){
	//切换是否菜单内容是消息还是链接
	$('.btnChoose #sendMsg').on('ifChecked',function(){
		$('.upSrcCtn .jumpPage-body').hide().siblings().show();
	});
	$('.btnChoose #jumbPage').on('ifChecked',function(){// todooooo
		$('.upSrcCtn .jumpPage-body').show().siblings().hide();
		//如果菜单内容是链接那么传过去的type是0
		if($('.menu-focus').find('input[class=act_type]').val() != 0) {
			// $('#inputLink').val('');
		}
	}).on('ifUnchecked',function(){
		//$('.menu-focus').find('input[class=act_type]').val('');
	});
}
function filterP(node) {
	return (node.isParent == false);
}
function showMenu() {
	var cityObj = $("#queSel");
	var cityOffset = $("#queSel").offset();
	$("#menuContent").slideDown("fast");
	$("body").bind("mousedown", onBodyDown);
	$('#classTree').slimScroll({
		height: '300px'
	});
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}
var hidesetting = {
	view: {
		dblClickExpand: false,
		showIcon: false
	},
	data: {
		simpleData : {
		enable : true,
		idKey : "Id",
		pIdKey : "ParentId",
		rootPId : 0
		},
		key : {
			name : "Name"
		}
	},
	async : {
		enable : true,
		url : '../../classes/pageListClasses?mode=9&pageSize=1000',
		autoParam : ["id"],
		dataFilter : function(treeId, parentNode, responseData) {
			if (responseData) {
				if (responseData.status == -1) {
					yunNoty(responseData);
				}
				responseData.list.push({
					Id: 0,
					ParentId: 0,
					Name: "全部分类",
					open: true
				});
				return responseData.list;
			}
			return responseData;
		}
	},
	callback: {
		onClick: function(event, treeId, treeNode, clickFlag){
			var treeObj = $.fn.zTree.getZTreeObj(treeId);
			Nodes = treeObj.getSelectedNodes();
			$('#queSel').html(Nodes[0].Name);
            $('.selQueX').val(Nodes[0].Id);

			$("#menuContent").fadeOut("fast");
			picList(1);
		},
		onAsyncSuccess: function(event, treeId, treeNode, msg) {
			var treeObj = $.fn.zTree.getZTreeObj(treeId);

      //$('.selQueX').val(0);
      picList(1);
			if($('#queManualQue').hasClass('active')) {
				sQue(1);
			}else if($('#queManualFlow').hasClass('active')) {
				fQue(1);
			}
		},
		beforeClick:function(treeId, treeNode, clickFlag) {
			//return !treeNode.isParent;//当是父节点 返回false 不让选取
			if(treeNode.isParent===true){
				$('#search_Que input[name=isLeaf]').val(0);
			}else{
				$('#search_Que input[name=isLeaf]').val(1);
			}
		}
	}
};

//链接到其他页面的方法
function but_click(moduleId,id,href,title,ifRefresh,isclose){
	if(typeof title=='undefined')title='';
	if(typeof ifRefresh=='undefined')ifRefresh=true;
	if(typeof isclose=='undefined')isclose=false;
	if(top.topManager){
		top.topManager.openPage({
		title:title,
		moduleId  :''+ moduleId,
		id : ''+id,
		href : ''+href,
		//如果打开是否刷新
		reload : ifRefresh,
		//关闭当前页
		isClose : isclose,
		});
	}else{
		href=href.split('/');
		location.href=href[2];
	}
}
//清空右侧内容
function clearRightCon(){
	$('.topRight #menuName').val('');
	$('.topRight .upSrc-head').find('a').eq(0).trigger('click');
	$('.topRight .upSrc-body').find('.upSrc-body-ctx').show();
	$('.topRight .upSrc-body').find('.upSrc-body-select').hide();
	$('.topRight .upSrc-body-select').find('.selectCtx').html('');
	$('.topRight .upSrc-body-select').find('.choooseText').val('');
	$('.topRight .topRight-ctx').find('.menuError').hide();
	$('.topRight .topRight-ctx').find('.topRight-bottom').show();
	$('.topRight #inputLink').val('');
	//$('.topRight .btnChoose>a').eq(0).find('input[name=btnStyle]').iCheck('check');
	upSrcStyle(6);
}

//预览的时候点击显示菜单的答案
function preview_ans(type,value){
	if(!type)return;
	
	var tmpCom='';
	if(type==1 || type==6){
		if(type==1){
			value=replace_em(iconface(value));
		}
		$('.view-ctx .phoneMiddle').append('<div class="selectCtn1"><img src="images/1.jpg" class="serv"><div class="selectCtx"><p class="preview_ans">'+value+'<p></div></div>');
	}else if(type == 2 || type ==3 || type == 4){
		$.ajax({
			type:'get',
			datatype:'json',
			cache:false,//不从缓存中去数据
			url:encodeURI('../../material/findById?id='+value),
			success:
			function(json){
				if(json.status == 0){
					if(type == 2){
						$('.view-ctx .phoneMiddle').append('<div class="selectCtn1"><img src="images/1.jpg" class="serv"><div class="selectCtx"><div class="show"><img alt="" src="../../'+json.material.Path+'"><div class="nameCtn"><p class="name">'+json.material.Name+'</p></div></div></div></div>');
					}
					if(type == 3){
						$('.view-ctx .phoneMiddle').append('<div class="selectCtn1"><img src="images/1.jpg" class="serv"><div class="selectCtx"><div class="show"><i></i><div><p class="title">'+json.material.Name+'</p><p class="time">'+json.material.Time+'</p></div></div></div></div>');
					}
					if(type == 4){
						//视频
					}
				}else{
					tip(data.result.message,'error');
				}
			}
			});
	}else if(type==5){
		$.ajax({
			type:'get',
			datatype:'json',
			cache:false,//不从缓存中去数据
			url:'../../Wxappmsg/findById?id='+value,
			success:
			function(json){
				if(json.result.status == 0){
					var imgTxtHtml = [];
					if(json.result.wxappmsg){
						var wxlist=json.result.wxappmsg;
						if(wxlist.wxappmsgDetails.length>0){
							if(wxlist.wxappmsgDetails.length == 1){
								imgTxtHtml.push('<div class="show"><a href="javascript:;" target="_blank"><p class="title">'+wxlist.wxappmsgDetails[0].title+'</p></a>');
                imgTxtHtml.push('<p class="time">'+wxlist.timeStr+'</p>');
                /**
                 * taksID=435 
                 * 原因：自定菜单展示预览图片，会有重复的内容。
                 * 修改：删除重复的内容（<p class="desc">'+wxlist.wxappmsgDetails[0].content+'</p>）
                 */
								imgTxtHtml.push('<div class="pic"><img src="'+wxlist.wxappmsgDetails[0].imgUrl+'" alt=""><div class="showMask"></div><a href="javascript:;" target="_blank"><p class="desc">'+wxlist.wxappmsgDetails[0].content+'</p></a></div></div>');
							}else{
								imgTxtHtml.push('<div class="shows"><div class="showsTop"><p class="time">'+wxlist.timeStr+'</p>');
								imgTxtHtml.push('<div class="pic"><img src="'+wxlist.wxappmsgDetails[0].imgUrl+'" alt=""><div class="showMask"></div><a href="#" target="_blank"><p class="desc">'+wxlist.wxappmsgDetails[0].title+'</p></a></div></div>');
								for(var m=1;m<wxlist.wxappmsgDetails.length;m++){
									imgTxtHtml.push('<div class="showsBelow"><a href="#" target="_blank"><p class="title">'+wxlist.wxappmsgDetails[m].title+'</p></a><img src="'+wxlist.wxappmsgDetails[m].imgUrl+'" alt=""></div>');
								}
								imgTxtHtml.push('</div>');
							}
						}
						$('.view-ctx .phoneMiddle').append('<div class="selectCtn1"><img src="images/1.jpg" class="serv"><div class="selectCtx">'+imgTxtHtml.join('')+'</div></div>');
					}else{
						return;
					}
				}else{
					tip(data.message,'error');
				}
			}
		});
	}else if(type==101){
		$.ajax({
			type:'get',
			datatype:'json',
			cache:false,//不从缓存中去数据
			url:'../../question/getQuestionById?id='+value,
			success:
			function(data){
				if (data.status==0){
					if(data.question.ListAnswer[0]){
						$('.view-ctx .phoneMiddle').append('<div class="selectCtn1"><img src="images/1.jpg" class="serv"><div class="selectCtx">'+data.question.ListAnswer[0].Answer+'</div></div>');
					}
				}else{
					tip(data.message,'error');
				}
			}
		})
	}
	$('.view-ctx .phoneMiddle-ctn').scrollTop($('.view-ctx .phoneMiddle-ctn')[0].scrollHeight);
}

//验证url
function validUrl(value){
	return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
}

//选择内容切换
function upSrcStyle(num){
	$('.chooseSrc').removeClass().addClass('chooseSrc chooseSrc'+ num);
	for(var i=1; i<7; i++) {
		$('.upSrc-icon'+ i +'-off').removeClass('upSrc-icon'+ i +'-on');
		$('.upSrc-btn'+ i).removeClass('upSrc-btn-on');
	}
	$('.upSrc-icon'+ num +'-off').addClass('upSrc-icon'+ num +'-on');
	$('.upSrc-btn'+ num).addClass('upSrc-btn-on');
	if(num==6){
		$('.upSrc-body .upSrc-body-ctx').hide().siblings().show();
		$('.upSrc-body-select .selectCtn6').show().siblings().hide();
	}else{
		$('.newMsg').attr('id','addNewBtn_'+num+'');
		$('.newMsg p').text('新建'+ $('.upSrc-btn'+ num).text());
		if($('.upSrc-body-select .selectCtn'+num+' .selectCtx').html() == '') {
			$('.upSrc-body-select').hide().siblings().show();
		}else {
			$('.upSrc-body-select').show().siblings().hide();
		}
	}
	$('.selectCtn'+num+'').show().siblings().hide();
}


//点击菜单显示相应的内容
function showCon(type, value){
	if(!type){return}
	if(type==6){
		//radio第二个选中
		$('.topRight input[name=btnStyle]:last').iCheck('check');
		$('.topRight .jumpPage-body').show().siblings().hide();
		$('.topRight #inputLink').val(value);
	}else{
		$('.topRight input[name=btnStyle]:first').iCheck('check');
		$('.topRight .jumpPage-body').hide().siblings().show();
		if(type==5){
			upSrcStyle(1);	
		}else
		if(type==101){
			upSrcStyle(5);	
		}else{
			upSrcStyle(type);
		}
		//文本
		if(type==1){
			upSrcStyle(6);
			value=iconface(value);
			$('.upSrc-body-select .choooseText').val(value);
		}
		//图片\语音\视频
		if(type == 2 || type ==3 || type == 4){
			getMaterialById(value,type);
		}
		//图文
		if(type == 5){
			getImgTxtById(value);
		}
		//答案
		if(type==101){
			getAns(value);
		}
	}
}
function tip(msg,type){
	/*$('.noty').noty({
		text:msg,
		type:type
	})*/
	
	$.gritter.add({
		title: "提醒",
		text: msg,
		class_name: type == 'error' ? "gritter-light": ""
	});
}

//初始化公众号
function wxh(){
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,
		url:encodeURI('../../wxConfig/listWxConfig'),
		success:
		function(data){
			if(data.status==0){
				var html=[];
				html.push('<select class="selInfo shortselect" >');
				if(data.list.length>0){
					for(var i=0;i<data.list.length;i++){
						if(data.list[i].AppId!=null){
							var curName=data.list[i].Name==null?'未知公众号名称':data.list[i].Name;
							html.push('<option value="'+data.list[i].Id+'">'+curName+'</option>');
						}
					}
				}
				html.push('</select>');
				$('#zzhDiv').html(html.join(''));
				$("#zzhDiv .shortselect").selectpick({
					container: '#zzhDiv',
					onSelect: function(value,text){
						getzzhInfo(value);
						//alert("这是回调函数，选中的值："+value+" \n选中的下拉框文本："+text);
					} 
				});
				if(data.list[0] && data.list[0].Id){
					getzzhInfo(data.list[0].Id);
				}
			} 
		}
	})
}


//点击公众号获取当前公众号的信息
function  getzzhInfo(value){
	var len=0;//标记当前有多少个菜单
	wxId=value;
	if(wxId==''){
		$('.context .menuBar').html('<div class="menuBar1"><i></i><span> 添加菜单</span></div>');
		return;
	}
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,
		url:encodeURI('../../Wx_Btn/findBywxConfigId?wxId='+wxId),
		success:
		function(json){
		$("#nameStr").val("");
		if(json.status == 0){
			$('.topRight-error').hide();
			$('.topRight').show();
			if(json.list != null && json.list.length>0){
				$('.context-ctn .topRight-error').hide().siblings('.topRight').show();
				var indexX = -1;
				var indexY = 0;
				var fId;
				
				$('.context .menuBar').html("");
				for(var m=0;m<json.list.length;m++){
					if(json.list[m].FatherBtnId==0){
						len++;
					}
				}
				for(var i=0; i<json.list.length; i++){
					//将所有已设置的菜单名放置到allName数组中
					allName.push(json.list[i].Name);
					if(json.list[i].FatherBtnId==0){
						childLen=0;
						var html=[];
						fId = json.list[i].Id;
						indexX +=1;
						indexY = 0;
						if(len<2){
							if(indexX<1){
								html.push('<div class="menuBar2 menu-focus" >');
								html.push('<span class="menuBar2-ctn"><i class="titleIcon"></i><span class="menuTitle">'+json.list[i].Name+'</span>');
								html.push('<input type="hidden" class="nameValue" name="catename['+indexX+']['+indexY+']" value="'+json.list[i].Name+'">');
								html.push('<input type="hidden" class="act_type" value="'+json.list[i].ActType+'" name="type['+indexX+']['+indexY+']"/>');
								html.push('<input type="hidden" class="act_value" value="'+json.list[i].ActValue+'" name="value['+indexX+']['+indexY+']"/>');
								html.push('<input type="hidden" class="act_key" value="'+json.list[i].Key+'" name="key['+indexX+']['+indexY+']"/>');
								html.push('</span>');
								html.push('<div class="menuList menu-focus-color">');
							}else{
								html.push('<div class="menuBar2" >');
								html.push('<span class="menuBar2-ctn"><i class="titleIcon"></i><span class="menuTitle">'+json.list[i].Name+'</span>');
								html.push('<input type="hidden" class="nameValue" name="catename['+indexX+']['+indexY+']" value="'+json.list[i].Name+'">');
								html.push('<input type="hidden" class="act_type" value="'+json.list[i].ActType+'" name="type['+indexX+']['+indexY+']"/>');
								html.push('<input type="hidden" class="act_value" value="'+json.list[i].ActValue+'" name="value['+indexX+']['+indexY+']"/>');
								html.push('<input type="hidden" class="act_key" value="'+json.list[i].Key+'" name="key['+indexX+']['+indexY+']"/>');
								html.push('</span>');
								html.push('<div class="menuList menu-focus-color" style="display:none;">');
							}
						}else{
					    	if(indexX<1){
								html.push('<div class="menuBar2 menuBar3 menu-focus" >');
								html.push('<span class="menuBar2-ctn"><i class="titleIcon"></i><span class="menuTitle">'+json.list[i].Name+'</span>');
								html.push('<input type="hidden" class="nameValue" name="catename['+indexX+']['+indexY+']" value="'+json.list[i].Name+'">');
								html.push('<input type="hidden" class="act_type" value="'+json.list[i].ActType+'" name="type['+indexX+']['+indexY+']"/>');
								html.push('<input type="hidden" class="act_value" value="'+json.list[i].ActValue+'" name="value['+indexX+']['+indexY+']"/>');
								html.push('<input type="hidden" class="act_key" value="'+json.list[i].Key+'" name="key['+indexX+']['+indexY+']"/>');
								html.push('</span>');
								html.push('<div class="menuList menu-focus-color">');
							}else{
								html.push('<div class="menuBar2 menuBar3" >');
								html.push('<span class="menuBar2-ctn"><i class="titleIcon"></i><span class="menuTitle">'+json.list[i].Name+'</span>');
								html.push('<input type="hidden" class="nameValue" name="catename['+indexX+']['+indexY+']" value="'+json.list[i].Name+'">');
								html.push('<input type="hidden" class="act_type" value="'+json.list[i].ActType+'" name="type['+indexX+']['+indexY+']"/>');
								html.push('<input type="hidden" class="act_value" value="'+json.list[i].ActValue+'" name="value['+indexX+']['+indexY+']"/>');
								html.push('<input type="hidden" class="act_key" value="'+json.list[i].Key+'" name="key['+indexX+']['+indexY+']"/>');
								html.push('</span>');
								html.push('<div class="menuList menu-focus-color" style="display:none;">');
							}
						}
						html.push('<i class="triangle triangle1"></i><i class="triangle triangle2"></i>');
						html.push('<div class="menuList-items" id="hasItems_'+indexX+'">');
						html.push('</div>');
						html.push('</div></div>');
						$('.context .menuBar').append(html.join(''));
					}else if(json.list[i].FatherBtnId == fId){
						var children=[];
						indexY +=1;
						children.push('<div class="menuList-item">');
						children.push('<input type="hidden" class="nameValue" name="catename['+indexX+']['+indexY+']" value="'+json.list[i].Name+'">');
						children.push('<input type="hidden" class="act_type" value="'+json.list[i].ActType+'" name="type['+indexX+']['+indexY+']"/>');
						children.push('<input type="hidden" class="act_value" value="'+json.list[i].ActValue+'" name="value['+indexX+']['+indexY+']"/>');
						children.push('<input type="hidden" class="act_key" value="'+json.list[i].Key+'" name="key['+indexX+']['+indexY+']"/>');
						children.push('<div class="menuList-item-ctx searchMenuCon">'+json.list[i].Name+'</div>');
						children.push('</div>');
						$('#hasItems_'+indexX).append(children.join(''));
						
					}else if(json.list[i].FatherBtnId != fId){
						childLen=0;
					}
				}
	
				if(len==1){
					$('.context .menuBar').append('<div class="menuBar2"><div class="menuBar2-add"><i class="menuBar2-addBtn"></i></div></div>');
				}else if(len==2){
					$('.context .menuBar').append('<div class="menuBar2 menuBar3"><div class="menuBar2-add"><i class="menuBar2-addBtn"></i></div></div>');
				}
				//判断当前子菜单是否有5个子菜单
				for(var i=0;i<len;i++){
					var parentObj=$('.context .menuBar .menuBar2').eq(i);
					var curLength=parentObj.find('.menuList-item').length;
					if(curLength<5){
						parentObj.find('.menuList-items').append('<div class="menuList-item-add"><i class="menuList-item-addBtn"></i></div>');
					}
				}
				$('.topLeft .menuBar2-ctn').eq(0).trigger('click');
			}else{
				$('.context .menuBar').html('<div class="menuBar1"><i></i><span> 添加菜单</span></div>');
				$('.context-ctn .topRight-error').show().siblings('.topRight').hide();
			}
		} else {
			tip(json.message,'error');
		}
	}
	})
}
//查看当前有多少个子菜单,如果小于5个则添加创建按钮
function menuList(){
	var curLength=$('.menu-focus .menuList-item').length;
	if(curLength<5){
		if($('.menu-focus .menuList-items').find('.menuList-item-add').length>0){
			return;
		}else{
			$('.menu-focus .menuList-items').append('<div class="menuList-item-add"><i class="menuList-item-addBtn"></i></div>');
		}
	}
}
//图文列表
function imgTextList(pageNo){
	if(!pageNo)pageNo=1;
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,
		url:encodeURI('../../Wxappmsg/list?pageSize='+5+'&pageNo='+pageNo),
		success:
		function(data){
			if(data.result.status==0){
				var curList=data.result.list;
				//获取数据总个数，然后根据一页显示的条数判断一共有多少页
				//向上取整
				var temp=data.result.total;
				temp=Math.ceil(temp/15);
				if(curList.length<0){
					$('#modal-dialog-msg .bodyMiddle').html('目前还没有图文哦~快去添加吧');
					$('#imgTextPage').html('');
				}else{

					var html=[];
					var htmlRight=[];
					for(var i=0;i<curList.length;i++){
						var curImg=curList[i].wxappmsgDetails;
						if((i+1)%2==1){
							if(curImg.length==1){
								//单图文
								html.push('<div class="show" rel="'+curList[i].id+'"><a href="javascript:;" target="_blank"><p class="title">'+curImg[0].title+'</p></a>');
								html.push('<p class="time">'+curList[i].timeStr+'</p>');
								html.push('<div class="pic"><img src="'+curImg[0].imgUrl+'" alt=""><div class="showMask"></div><a href="javascript:;" target="_blank"><p class="desc">'+curImg[0].content+'</p></a></div><p class="desc">'+curImg[0].content+'</p></div>');
							}else{
								//多图文
								html.push('<div class="shows" rel="'+curList[i].id+'"><div class="showsTop"><p class="time">'+curList[i].timeStr+'</p>');
								html.push('<div class="pic"><img src="'+curImg[0].imgUrl+'" alt=""><div class="showMask"></div><a href="#" target="_blank"><p class="desc">'+curImg[0].title+'</p></a></div></div>');
								for(var m=1;m<curImg.length;m++){
									html.push('<div class="showsBelow"><a href="#" target="_blank"><p class="title">'+curImg[m].title+'</p></a><img src="'+curImg[m].imgUrl+'" alt=""></div>');
								}
								html.push('</div>');
							}
							$('#modal-dialog-msg .showLeft').html(html.join(''));
						}else{
							if(curImg.length==1){
								//单图文
								htmlRight.push('<div class="show" rel="'+curList[i].id+'"><a href="javascript:;" target="_blank"><p class="title">'+curImg[0].title+'</p></a>');
								htmlRight.push('<p class="time">'+curList[i].timeStr+'</p>');
								htmlRight.push('<div class="pic"><img src="'+curImg[0].imgUrl+'" alt=""><div class="showMask"></div><a href="javascript:;" target="_blank"><p class="desc">'+curImg[0].content+'</p></a></div><p class="desc">'+curImg[0].content+'</p></div>');
							}else{
								//多图文
								htmlRight.push('<div class="shows" rel="'+curList[i].id+'"><div class="showsTop"><p class="time">'+curList[i].timeStr+'</p>');
								htmlRight.push('<div class="pic"><img src="'+curImg[0].imgUrl+'" alt=""><div class="showMask"></div><a href="#" target="_blank"><p class="desc">'+curImg[0].title+'</p></a></div></div>');
								for(var m=1;m<curImg.length;m++){
									htmlRight.push('<div class="showsBelow"><a href="#" target="_blank"><p class="title">'+curImg[m].title+'</p></a><img src="'+curImg[m].imgUrl+'" alt=""></div>');
								}
								htmlRight.push('</div>');
							}
							$('#modal-dialog-msg .showRight').html(htmlRight.join(''));
                        }
                        setTimeout(function() {
                            $('#modal-dialog-msg .show, .shows').mask();
                        }, 50)
					}
					var options = {
						currentPage: data.result.currentPage,
						totalPages: data.result.totlePages,
						alignment:'right',
						onPageClicked: function (event, originalEvent, type, page) {
							imgTextList(page);

						}
					};
					$('#imgTextPage').bootstrapPaginator(options);
				}
			}else{
				tip(data.result.message,'error');
			}
		}
	})
}

//图片列表
function picList(pageNo){
	if(!pageNo)pageNo=1;
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,
		url:encodeURI('../../material/list?type=1&pageSize='+15+'&pageNo='+pageNo+'&groupId='+$('.selQueX').val()),
		success:
		function(data){
			if(data.status==0){
				if(data.list.length>0){
					var tmpHtml=[];
					var temp=data.total;
				    temp=Math.ceil(temp/15);
					for(var i=0;i<data.list.length;i++){
						tmpHtml.push('<div class="show" rel="'+data.list[i].Id+'"><img src="../../'+data.list[i].Path+'" alt=""><div class="nameCtn"><p class="name">'+data.list[i].Name+'</p></div></div>');
					}
					$('#modal-dialog-pic .bodyMiddle').html(tmpHtml.join(''));
					$('#modal-dialog-pic .show, .show').mask();
				    var options = {
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						alignment:'right',
						onPageClicked: function (event, originalEvent, type, page) {
							picList(page);
						}
					};
					$('#picPage').bootstrapPaginator(options);
					icheckInit();
					btnChooseDiv()
				}else{
					$('#modal-dialog-pic .bodyMiddle').html('<p style="text-align:center;">当前记录为空，快去添加吧~</p>');
					$('#picPage').html('');
				}
			}else{
				tip(data.result.message,'error');
			}
		}
	})
}
//语音列表
function vedioList(pageNo){
	if(!pageNo)pageNo=1;
		$.ajax({
		type:'post',
		datatype:'json',
		cache:false,
		url:encodeURI('../../material/list?type='+2+'&pageSize='+8+'&pageNo='+pageNo),
		success:
		function(data){
			if(data.status==0){
				if(data.list.length>0){
					var html=[];
					for(var i=0;i<data.list.length;i++){
						html.push('<tr class="check_'+data.list[i].Id+'">');
						html.push('<td><input id="'+ i +'" type="radio" name="vedioRdo" value="'+data.list[i].Id+'"></td>');
						html.push('<td><label for="'+ i +'" style="display: block;cursor:pointer;">'+data.list[i].Name+'</label></td>');
						html.push('<td><label for="'+ i +'" style="display: block;cursor:pointer;">'+data.list[i].Time+'</label></td>');
						html.push('</tr>');
						/*html.push('<div class="show check_'+data.list[i].Id+'"><label >');
						html.push('<input type="radio" name="vedioRdo" value="'+data.list[i].Id+'">');
						html.push('<p class="title">'+data.list[i].Name+'</p>');
						html.push('<p class="time">'+data.list[i].Time+'</p>');
						html.push('</label></div>');*/
					}
					$('#modal-dialog-audio .ansTab').html(html.join(''));
					$('#modal-dialog-audio input[name=vedioRdo]').iCheck({
						radioClass : 'iradio_flat-grey',
						checkboxClass : 'icheckbox_flat-grey',
					});
					var options = {
		            currentPage: data.currentPage,
		            totalPages: data.totlePages,
					alignment:'right',
					onPageClicked: function (event, originalEvent, type, page) {
						vedioList(page);
					}
		            };
					$('#vedioPage').bootstrapPaginator(options);
					icheckInit();
					btnChooseDiv()
				}else{
					$('.audio-ctx .bodyMiddle').html('<p style="text-align:center;">当前记录为空，快去添加吧~</p>');
					$('#vedioPage').html('');
				}
			}else{
				tip(data.result.message,'error');
			}
		}
	})
}
//答案列表
function ansList(pageNo){
	if(!pageNo)pageNo=1;
		$.ajax({
		type:'post',
		datatype:'json',
		cache:false,
		url:encodeURI('../../question/listAns?pageSize='+8+'&pageNo='+pageNo),
		data:$('.searchForm').serialize(),
		success:
		function(data){
			if(data.status==0){
				if(data.ListQue.length>0){
					var html=[];
					for(var i=0;i<data.ListQue.length;i++){
						if(data.ListQue[i].Answer){
							html.push('<tr class="ans_'+data.ListQue[i].SolutionId+'">');
							html.push('<td style="width:20px;"><input type="radio" name="ansRdo" value="'+data.ListQue[i].SolutionId+'"></td>');

								html.push('<td class="cosInput"><div class="conAns">'+data.ListQue[i].Answer+'</div></td>');
							html.push('<td class="cosInput" style="width:150px;">'+data.ListQue[i].Time+'</td>');
							html.push('</tr>');
						}
					}
					$('#modal-dialog-ans .ansTab').find('tbody').html(html.join(''));
					/*$('#modal-dialog-ans input[name=ansRdo]').iCheck({
						radioClass : 'iradio_flat-grey',
						checkboxClass : 'icheckbox_flat-grey',
					});*/
					icheckInit();
					btnChooseDiv()
					var options = {
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						alignment:'right',
						onPageClicked: function (event, originalEvent, type, page) {
							ansList(page);
						}
		            };
					$('#ansPage').bootstrapPaginator(options);

					$('.conAns').each(function() {
					    var height = $(this).height;
					    if(height>100) {
					        height = 100;
					    }
					    $('.conAns').slimScroll({
					        height: height,
					    });
					})
				}else{
					$('#modal-dialog-ans .ansTab').find('tbody').html('<tr><td colspan="3" style="text-align:center;">当前记录为空，快去添加吧~</td></tr>');
				}
			}else{
				$('#ansPage').html('');
				tip(data.result.message,'error');
				
			}
		}
	})
}


//根据id 获取素材内容
function getMaterialById(id,type){
	$.ajax({
	type:'get',
	datatype:'json',
	cache:false,//不从缓存中去数据
	url:encodeURI('../../material/findById?id='+id),
	success:
	function(json){
		if(json.status == 0){
			upSrcStyle(type);
			$('.upSrc-body-ctx').hide().siblings().show();
			if(type == 2){
				var picHtml = '<div class="show"><img alt="" src="../../'+json.material.Path+'"><div class="nameCtn"><p class="name">'+json.material.Name+'</p></div></div>';
			    $('.selectCtn2').show().siblings().hide();
				$('.selectCtn2 .selectCtx').html(picHtml);
			}
			if(type == 3){
				var tmpCon='<div class="show"><i></i><div><p class="title">'+json.material.Name+'</p><p class="time">'+json.material.Time+'</p></div></div>';
				$('.selectCtn3').show().siblings().hide();
			    $('.selectCtn3 .selectCtx').empty().append(tmpCon);
			}
			if(type == 4){
				//视频
			}
		}else{
			tip(data.result.message,'error');
		}
	}
	});
}
//根据id获取图文内容
function getImgTxtById(id){
	if(!id)return;
	$.ajax({
	type:'get',
	datatype:'json',
	cache:false,//不从缓存中去数据
	url:'../../Wxappmsg/findById?id='+id,
	success:
	function(json){
		if(json.result.status == 0){
			var imgTxtHtml = [];
			if(json.result.wxappmsg){
				var wxlist=json.result.wxappmsg;
				if(wxlist.wxappmsgDetails.length>0){
					if(wxlist.wxappmsgDetails.length == 1){
						imgTxtHtml.push('<div class="show"><a href="javascript:;" target="_blank"><p class="title">'+wxlist.wxappmsgDetails[0].title+'</p></a>');
            imgTxtHtml.push('<p class="time">'+wxlist.timeStr+'</p>');
            /**
             * taksID=435 
             * 原因：自定菜单展示预览图片，会有重复的内容。
             * 修改：删除重复的内容（<p class="desc">'+wxlist.wxappmsgDetails[0].content+'</p>）
             */
						imgTxtHtml.push('<div class="pic"><img src="'+wxlist.wxappmsgDetails[0].imgUrl+'" alt=""><div class="showMask"></div><a href="javascript:;" target="_blank"><p class="desc">'+wxlist.wxappmsgDetails[0].content+'</p></a></div></div>');
					}else{
						imgTxtHtml.push('<div class="shows"><div class="showsTop"><p class="time">'+wxlist.timeStr+'</p>');
						imgTxtHtml.push('<div class="pic"><img src="'+wxlist.wxappmsgDetails[0].imgUrl+'" alt=""><div class="showMask"></div><a href="#" target="_blank"><p class="desc">'+wxlist.wxappmsgDetails[0].title+'</p></a></div></div>');
						for(var m=1;m<wxlist.wxappmsgDetails.length;m++){
							imgTxtHtml.push('<div class="showsBelow"><a href="#" target="_blank"><p class="title">'+wxlist.wxappmsgDetails[m].title+'</p></a><img src="'+wxlist.wxappmsgDetails[m].imgUrl+'" alt=""></div>');
						}
						imgTxtHtml.push('</div>');
					}
				}
				$('.upSrc-body-ctx').hide().siblings().show();
			    $('.selectCtn1').show().siblings().hide();
			    $('.selectCtn1 .selectCtx').empty().append(imgTxtHtml.join(''));
			} else {
				var imgTxtHtml="<div><p style='color:red'>该图文已从图文列表删除！请删除后重新编辑</p> <br></div>"
				$('.selectCtn1 .selectCtx').empty().append(imgTxtHtml);
				return;
			}
		}else{
			tip(json.message,'error');
		}
	}
	});
}
//根据id获取问题
function getAns(id){
	if(!id)return;
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:'../../question/getQuestionById?id='+id,
		success:
		function(data){
			if (data.status==0){
				$('.upSrc-body-ctx').hide().siblings().show();
			    $('.selectCtn5').show().siblings().hide();
					$('.selectCtn5 .selectCtx').html(data.question.ListAnswer[0].Answer);
			}else{
				tip(data.message,'error');
			}
			    
		}
	})
	
}
// 检查菜单名是否填写
function checkmenu(){
	var tmpValue=$('#allData .act_value');
	var tmp='';
	var t1='';
	var t2='';
	for(var i=0;i<tmpValue.length;i++){
		/*if($(tmpValue.eq(i)).parent('span').next().find('.menuList-item')[0]) {
			break;
		}*/
		tmp=tmpValue.eq(i).attr('name').split('[');
		t1=parseInt(tmp[1].replace(']',''));
		t2=parseInt(tmp[2].replace(']',''));
		if(tmpValue[i].value=='' && tmp[2].replace(']','')!=0){
			if(tmpValue.eq(i).parent().hasClass('menuBar2-ctn')){
			}else{
				tip('请为第'+(t1+1)+'菜单下第'+(t2)+'个子菜单设置动作','error');
				return false;
			}
		}
		if(i+1<tmpValue.length){
			var tmp2=tmpValue.eq(i+1).attr('name').split('[')[2].replace(']','');
			if(tmpValue[i].value==''&& tmp[2].replace(']','')==0&&tmp2==0){
				var t3=parseInt(tmp[1].replace(']',''));
				tip('请为第'+(t3+1)+'菜单下设置动作','error');
				return false;
			}
		}else{
			if(tmpValue[i].value==''&& tmp[2].replace(']','')==0){
				var t3=parseInt(tmp[1].replace(']',''));
				tip('请为第'+(t3+1)+'菜单下设置动作','error');
				return false;
			}
		}
		if(tmpValue.eq(i).siblings('input[class=nameValue]').val()==''){
			if(t2==0){
				if(i+1<tmpValue.length){
					var tmp2=tmpValue.eq(i+1).attr('name').split('[')[2].replace(']','');
					if(tmp2==0){
						tip('请为第'+(t1+1)+'个菜单设置菜单名','error');
						return false;
					}
				}else{
					tip('请为第'+(t1+1)+'个菜单设置菜单名','error');
					return false;
				}
			}else{
				tip('请为第'+(t1+1)+'菜单下第'+(t2)+'个子菜单设置菜单名','error');
				return false;
			}
		}
	}
	$('.popup').fadeIn(100).children('.release-ctx').show().siblings(':not(.mask)').hide()
}

//发布微信
function publishWx(){
	
	var wxh = $('#zzhDiv select').val()||"";//获取微信号
	var request="request="+DataDeal.formToJson($('#allData').serialize());
	$.ajax({
		type:'post',
		dataType:"json",
		cache:false,
		url:"../../wx_Btn/publishWx_Btn?wxId="+wxh,
		data:request,
		success:
		function(data){
			publish=false;
			if(data.status==0){
				tip(data.message,'success');
			}
			else{
				tip(data.message,'error');
			}
		}
			
	});	
}
var DataDeal = {
//将从form中通过$('#form').serialize()获取的值转成json
   formToJson: function (data) {
	   data=data.replace(/&/g,"\",\"");
	   data=data.replace(/=/g,"\":\"");
	   data="{\""+data+"\"}";
	   return data;
	}
};
//判断元素是否在数组中，如果在删除，不在添加
function checkArray(str){
	if(!str)str='';
	if($.inArray(str, allName)>=0){
		tip('该菜单名已存在','error');
		return; 
	}else{
		allName.push(str);
	}
}
//预览菜单
function preview(){
	var con=$('.topLeft .menuBar').html();
    $('.view-ctx .phoneBottom .menuBar-v').html(con);

    setTimeout(function() {
        var height = $('.view-ctx').find('.menuList','.menu-focus-color').height();
        if(height <= 0){
            $('.view-ctx').find('.triangle','.triangle1').addClass('hide');
        }else{
            $('.view-ctx').find('.triangle','.triangle1').removeClass('hide');
        }
    },50)
    $('html').addClass('overFlowY');
}
//微信表情转化
function replace_em(str){
	str = str.replace(/\</g,'&lt;');
	str = str.replace(/\>/g,'&gt;');
	str = str.replace(/\n/g,'<br/>');
	str = str.replace(/\[em_([0-9]*)\]/g,'<img src="images/arclist/$1.gif" border="0" />');
	return str;
}
//将微信传输字符转换为微信能够接收的形式
function wxface(str){
	var tempStr='';
	if(!str)return;
	tempStr=str.replace(/\[em_0\]/g,'/微笑').replace(/\[em_1\]/g,'/撇嘴').replace(/\[em_2\]/g,'/色').replace(/\[em_3\]/g,'/发呆').replace(/\[em_4\]/g,'/得意').replace(/\[em_5\]/g,'/流泪').replace(/\[em_6\]/g,'/害羞').replace(/\[em_7\]/g,'/闭嘴').replace(/\[em_8\]/g,'/睡').replace(/\[em_9\]/g,'/大哭').replace(/\[em_10\]/g,'/尴尬').replace(/\[em_11\]/g,'/发怒').replace(/\[em_12\]/g,'/调皮').replace(/\[em_13\]/g,'/呲牙').replace(/\[em_14\]/g,'/惊讶').replace(/\[em_15\]/g,'/难过').replace(/\[em_16\]/g,'/酷').replace(/\[em_17\]/g,'/冷汗').replace(/\[em_18\]/g,'/抓狂').replace(/\[em_19\]/g,'/吐').replace(/\[em_20\]/g,'/偷笑').replace(/\[em_21\]/g,'/可爱').replace(/\[em_22\]/g,'/白眼').replace(/\[em_23\]/g,'/傲慢').replace(/\[em_24\]/g,'/饥饿').replace(/\[em_25\]/g,'/困').replace(/\[em_26\]/g,'/惊恐').replace(/\[em_27\]/g,'/流汗').replace(/\[em_28\]/g,'/憨笑').replace(/\[em_29\]/g,'/大兵').replace(/\[em_30\]/g,'/奋斗').replace(/\[em_31\]/g,'/咒骂').replace(/\[em_32\]/g,'/疑问').replace(/\[em_33\]/g,'/嘘').replace(/\[em_34\]/g,'/晕').replace(/\[em_35\]/g,'/折磨').replace(/\[em_36\]/g,'/衰').replace(/\[em_37\]/g,'/骷髅').replace(/\[em_38\]/g,'/敲打').replace(/\[em_39\]/g,'/再见').replace(/\[em_40\]/g,'/擦汗').replace(/\[em_41\]/g,'/抠鼻').replace(/\[em_42\]/g,'/鼓掌').replace(/\[em_43\]/g,'/糗大了').replace(/\[em_44\]/g,'/坏笑').replace(/\[em_45\]/g,'/左哼哼').replace(/\[em_46\]/g,'/右哼哼').replace(/\[em_47\]/g,'/哈欠').replace(/\[em_48\]/g,'/鄙视').replace(/\[em_49\]/g,'/委屈').replace(/\[em_50\]/g,'/快哭了').replace(/\[em_51\]/g,'/阴险').replace(/\[em_52\]/g,'/亲亲').replace(/\[em_53\]/g,'/吓').replace(/\[em_54\]/g,'/可怜').replace(/\[em_55\]/g,'/菜刀').replace(/\[em_56\]/g,'/西瓜').replace(/\[em_57\]/g,'/啤酒').replace(/\[em_58\]/g,'/篮球').replace(/\[em_59\]/g,'/乒乓').replace(/\[em_60\]/g,'/咖啡').replace(/\[em_61\]/g,'/饭').replace(/\[em_62\]/g,'/猪头').replace(/\[em_63\]/g,'/玫瑰').replace(/\[em_64\]/g,'/凋谢').replace(/\[em_65\]/g,'/示爱').replace(/\[em_66\]/g,'/爱心').replace(/\[em_67\]/g,'/心碎').replace(/\[em_68\]/g,'/蛋糕').replace(/\[em_69\]/g,'/闪电').replace(/\[em_70\]/g,'/炸弹').replace(/\[em_71\]/g,'/刀').replace(/\[em_72\]/g,'/足球').replace(/\[em_73\]/g,'/瓢虫').replace(/\[em_74\]/g,'/便便').replace(/\[em_75\]/g,'/月亮').replace(/\[em_76\]/g,'/太阳').replace(/\[em_77\]/g,'/礼物').replace(/\[em_78\]/g,'/拥抱').replace(/\[em_79\]/g,'/强').replace(/\[em_80\]/g,'/弱').replace(/\[em_81\]/g,'/握手').replace(/\[em_82\]/g,'/胜利').replace(/\[em_83\]/g,'/抱拳').replace(/\[em_84\]/g,'/勾引').replace(/\[em_85\]/g,'/拳头').replace(/\[em_86\]/g,'/差劲').replace(/\[em_87\]/g,'/爱你').replace(/\[em_88\]/g,'/NO').replace(/\[em_89\]/g,'/OK').replace(/\[em_90\]/g,'/爱情');
	return tempStr;
}
//将微信接收的表情转换为显示的图标
function iconface(str){
	var tempStr='';
	if(!str)return;
	tempStr=str.replace(/\/微笑/g,'[em_0]').replace(/\/撇嘴/g,'[em_1]').replace(/\/色/g,'[em_2]').replace(/\/发呆/g,'[em_3]').replace(/\/得意/g,'[em_4]').replace(/\/流泪/g,'[em_5]').replace(/\/害羞/g,'[em_6]').replace(/\/闭嘴/g,'[em_7]').replace(/\/睡/g,'[em_8]').replace(/\/大哭/g,'[em_9]').replace(/\/尴尬/g,'[em_10]').replace(/\/发怒/g,'[em_11]').replace(/\/调皮/g,'[em_12]').replace(/\/呲牙/g,'[em_13]').replace(/\/惊讶/g,'[em_14]').replace(/\/难过/g,'[em_15]').replace(/\/酷/g,'[em_16]').replace(/\/冷汗/g,'[em_17]').replace(/\/抓狂/g,'[em_18]').replace(/\/吐/g,'[em_19]').replace(/\/偷笑/g,'[em_20]').replace(/\/可爱/g,'[em_21]').replace(/\/白眼/g,'[em_22]').replace(/\/傲慢/g,'[em_23]').replace(/\/饥饿/g,'[em_24]').replace(/\/困/g,'[em_25]').replace(/\/惊恐/g,'[em_26]').replace(/\/流汗/g,'[em_27]').replace(/\/憨笑/g,'[em_28]').replace(/\/大兵/g,'[em_29]').replace(/\/奋斗/g,'[em_30]').replace(/\/咒骂/g,'[em_31]').replace(/\/疑问/g,'[em_32]').replace(/\/嘘/g,'[em_33]').replace(/\/晕/g,'[em_34]').replace(/\/折磨/g,'[em_35]').replace(/\/衰/g,'[em_36]').replace(/\/骷髅/g,'[em_37]').replace(/\/敲打/g,'[em_38]').replace(/\/再见/g,'[em_39]').replace(/\/擦汗/g,'[em_40]').replace(/\/抠鼻/g,'[em_41]').replace(/\/鼓掌/g,'[em_42]').replace(/\/糗大了/g,'[em_43]').replace(/\/坏笑/g,'[em_44]').replace(/\/左哼哼/g,'[em_45]').replace(/\/右哼哼/g,'[em_46]').replace(/\/哈欠/g,'[em_47]').replace(/\/鄙视/g,'[em_48]').replace(/\/委屈/g,'[em_49]').replace(/\/快哭了/g,'[em_50]').replace(/\/阴险/g,'[em_51]').replace(/\/亲亲/g,'[em_52]').replace(/\/吓/g,'[em_53]').replace(/\/可怜/g,'[em_54]').replace(/\/菜刀/g,'[em_55]').replace(/\/西瓜/g,'[em_56]').replace(/\/啤酒/g,'[em_57]').replace(/\/篮球/g,'[em_58]').replace(/\/乒乓/g,'[em_59]').replace(/\/咖啡/g,'[em_60]').replace(/\/饭/g,'[em_61]').replace(/\/猪头/g,'[em_62]').replace(/\/玫瑰/g,'[em_63]').replace(/\/凋谢/g,'[em_64]').replace(/\/示爱/g,'[em_65]').replace(/\/爱心/g,'[em_66]').replace(/\/心碎/g,'[em_67]').replace(/\/蛋糕/g,'[em_68]').replace(/\/闪电/g,'[em_69]').replace(/\/炸弹/g,'[em_70]').replace(/\/刀/g,'[em_71]').replace(/\/足球/g,'[em_72]').replace(/\/瓢虫/g,'[em_73]').replace(/\/便便/g,'[em_74]').replace(/\/月亮/g,'[em_75]').replace(/\/太阳/g,'[em_76]').replace(/\/礼物/g,'[em_77]').replace(/\/拥抱/g,'[em_78]').replace(/\/强/g,'[em_79]').replace(/\/弱/g,'[em_80]').replace(/\/握手/g,'[em_81]').replace(/\/胜利/g,'[em_82]').replace(/\/抱拳/g,'[em_83]').replace(/\/勾引/g,'[em_84]').replace(/\/拳头/g,'[em_85]').replace(/\/差劲/g,'[em_86]').replace(/\/爱你/g,'[em_87]').replace(/\/NO/g,'[em_88]').replace(/\/OK/g,'[em_89]').replace(/\/爱情/g,'[em_90]');
	return tempStr;
}


