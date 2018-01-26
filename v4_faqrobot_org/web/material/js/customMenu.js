// JavaScript Document


//搜索答案
searchQA('menuAns','menuQueAns_form','answer','level',hasAnsList);
btnClick('menuQueAns_form','btnAns','menuQueAns_form','answer','level',hasAnsList);

//回答中的已有答案回答
function hasAnsList(pageNo){
	var answerYalue=$('#menuQueAns_form input[name=answer]').val();
	if(!pageNo)pageNo=1;
	$('#replayList').find('ol').html('<li style=\"text-align:center;\"><img src=\"../../images/ajax_loader.gif\"></li>');
	$.ajax({
	type:'get',
	datatype:'json',
	cache:false,//不从缓存中去数据
	url:encodeURI('../../answer/listQA?pageSize='+15+'&pageNo='+pageNo+"&groupId="+$('.repaly_groupId').val()+"&isLeaf="+$('#que_modal .isLeaf').val()+"&answer="+answerYalue+'&status='+0),
	data:'level='+$('#menuQueAns_form input[name=level]').val(),
	success:
	function(data){
		if (data.status==0){
				var s = [];//暂时存储html代码
		if(data.ListQue.length>0){
			for(var i=0;i<data.ListQue.length;i++){
				s.push('<li class="checked menu'+data.ListQue[i].SolutionId+'">');
				s.push('<label class="yun_well_reply">');
				s.push('<div><span style="float:left;"><input type="radio" name="ckb" class="select_row" value='+data.ListQue[i].SolutionId+' style="margin-top:-5px;"/></span><span class="dateT">'+data.ListQue[i].Time+'</span></div>');
				s.push('<div class="hasAnsCon" rel="'+data.ListQue[i].Question+'" qId=\"'+data.ListQue[i].SolutionId+'\">&nbsp;'+data.ListQue[i].Answer+'</div>');
				s.push('</label></li>');
			}
			$('#replayList').find('ol').html(s.join(''));
			$('.xTop').css('margin-top','0px');
			//下面开始处理分页
			var options = {
				currentPage: data.currentPage,
				totalPages: data.totlePages,
				alignment:'right',
				onPageClicked: function (event, originalEvent, type, page) {
					hasAnsList(page);
					}
				};
			setPage('replaypageList',options);
			yun_scroll();
		}else{
				$('#replayList').find('ol').html('<li style=\"text-align:center;\"><i class=\"icon-exclamation-sign\"></i>&nbsp;&nbsp;当前纪录为空</li>');
				$('#replaypageList').html('');
				$('.xTop').css('margin-top','11px');
		}
		}else{
			yunAlert(data);
		}
	}
	})
}


function wxh(){
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../wxConfig/listWxConfig'),
		success:
		function(data){
			if(data.status == 0){
				var html ='';
				html += '<select class="selectpicker">';
				html += '<option value="">请选择需要操作的公众号</option>';
				if(data.list.length>0){
					for(var i = 0;i<data.list.length;i++){
						if(data.list[i].AppId == null){
							
						} else {
							var zzhName=data.list[i].Name==null?'未知公众号名称':data.list[i].Name;
							html += '<option value="'+data.list[i].Id+'">'+zzhName+'</option>';
						}
					}
				}
				html += '</select>';
				$('#wxh').html(html);
				//下拉列表
				 $('.selectpicker').selectpicker({
					style: 'btn-navbar',
					size: 10,
					//width: '80%',
				});
			}		
		}
	})
}
function boxheight(){
	if($('#menu_box_left .menu_box_body').height()<=$('#menu_box_right .menu_box_body').height()){
		$('.menu_border').height($('#menu_box_right .menu_box_body').height()+55);
	} else {
		$('.menu_border').height($('#menu_box_left .menu_box_body').height()+55);
	}
}

//添加二级菜单
$(document).on('click','.add_2',function(){
	var i;
	var j;
	j = $(this).parents('dl').index();
	i = $(this).parents('dt').siblings('dd').length;
	$("#submenu_index").val(j);
	if(i>=5){
		yunAlertError("二级菜单最多只能添加5个");
	} else {
		$('#menu_modal .modal-footer .Determine').attr("onClick","add_2_menu("+j+","+(i+1)+")");
		$('#menu_modal').modal('show');
		boxheight();
	}
})
//修改菜单
$(document).on('click','.pencil',function(){
	var menu_title;
	var i;
	var j;
	i = $(this).parents('dl').index();
	j = $(this).parents('dd').index();
	$("#submenu_index").val(i);
	$("#submenu").val(j);
	menu_title = $(this).parent().siblings('input').val();
	$('#menuname').val(menu_title);
	$('#menu_modal .modal-footer .Determine').attr("onClick","update_menu('"+menu_title+"')");
	$('#menu_modal').modal('show');
})
//删除菜单
$(document).on('click','.trash',function(){
	var j;
	j = $(this).parents('dd').index();
	if(j == -1){
		if($(this).parents('dl').children('dd').length>0){
			yunAlertError('该菜单有子节点，无法删除');
			return;
		}
		$(this).parents('dl').remove();
		
	}else{
		var name = $(this).parents("dd").children(".nameValue").val();
		var nameStr;
		nameStr = $('#nameStr').val();
		if(nameStr != '' && nameStr != null){
			var names = nameStr.split(",");
			for(var i=0; i<names.length; i++){
				if(names[i] == name){
					nameStr = nameStr.replace(","+name,"");
				}
			}
		}
		$('#nameStr').val(nameStr);
		$('#delMenu').modal('show');
		confirmDel(this);
	}
	boxheight();
})
//确认删除菜单
function confirmDel(obj){
	$('#delMenuBtn').click(function(){
		$(obj).parents('dd').remove();
		$('#delMenu').modal('hide');
	})
}
//点击二级菜单
$(document).on('click','dl dd',function(){
	$(".control-group")[0].reset();
	$(this).addClass('current');
	$(this).siblings().removeClass('current');
	$(this).parent('dl').siblings().children().removeClass('current');

	var type = $(this).children('.act_type').val();
	var value = $(this).children('.act_value').val();
	if(type==undefined || type=="" || type==null || value==undefined || value=="" || value==null){
		$('#menu2').addClass('active');
		$('#menu2').siblings().removeClass('active');
	}else{
		showAction(type,value);
	}
	boxheight();
})
//点击菜单显示相应的动作 
function showAction(type,value){
	if(!type){
		return;
	}
	if(!value){
		return;
	}
	if(type == 6){
			$('#menu7 .controls p').text(value);
			$('#menu7').addClass('active');
			$('#menu7').siblings().removeClass('active');
		}else{
			$('#menu5 .controls #imgTxt_check').remove();
			$('#menu5 .controls #img_check').remove();
			
			//文本
				if(type == 1){
					value=iconface(value);
					$('#menu5 .controls p').html(replace_em(value));
					$('#menu5 .controls').find('.conDiv').html('');
					
				}
				//图片，语音，视频
				if(type == 2 || type == 3 || type == 4){
					$('#menu5 .controls p').text('');
					getMaterialById(value, type);
				}
				//图文
				if(type == 5){
					$('#menu5 .controls p').text('');
					getImgTxtById(value);
				}
				//答案
				if(type == 101){
					closeWin(value);
					
				}
				$('#menu5').addClass('active');
				$('#menu5').siblings().removeClass('active');
		}
}


//点击一级菜单
$(document).on('click','dl dt',function(){
	$(".control-group")[0].reset();
	$(this).addClass('current');
	$(this).siblings().removeClass('current');
	$(this).parent('dl').siblings().children().removeClass('current');
	if($(this).siblings('dd').length == 0){//如果菜单下面没有子菜单，直接显示内容
		
		var type = $(this).children('.act_type').val();
		var value = $(this).children('.act_value').val();
		if(type==undefined || type=="" || type==null || value==undefined || value=="" || value==null){
			
			//如果没有设置内容，则显示各种内容
			$('#menu2').addClass('active');
			$('#menu2').siblings().removeClass('active');
		}else{
			showAction(type,value);
		}
	} else {
		
		//如果有子菜单，那么父菜单无法设置动作
		$('#menu6').addClass('active');
		$('#menu6').siblings().removeClass('active');
	}
	boxheight();
});
//根据id获取问题
function closeWin(id){
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:'../../question/getQuestionBySolutionId?solutionId='+id,
		success:
		function(data){
			if (data.status==0){
				$('#menu5 .controls p').html('查看答案详细：<a href="../knowledge/question_detail.html?id='+id+'">'+data.question.Question+'</a>');
				$('#menu5 .controls').find('.conDiv').html('');
			
			}else{
				yunAlert(data);
			}
			    
		}
	})
	
}

//根据id获取图文
function getImgTxtById(id){
	$.ajax({
	type:'get',
	datatype:'json',
	cache:false,//不从缓存中去数据
	url:'../../Wxappmsg/findById?id='+id,
	success:
	function(json){
		if(json.result.status == 0){
			var imgTxtHtml = '';
			if(json.result.wxappmsg){
				var wxlist=json.result.wxappmsg;
				if(wxlist.wxappmsgDetails.length>0){
					if(wxlist.wxappmsgDetails.length == 1){
						imgTxtHtml += '<div style=\"margin:0 auto; width:350px;\">';
						imgTxtHtml += '<div id=\"imgTxt_check\" class=\"b-dib vt msg-col\" style=\"text-align:center;\">';
						imgTxtHtml += '<div class=\"msg-item-wrapper\">';
						imgTxtHtml += '<div class=\"msg-item appmsgItem\">';
						imgTxtHtml += '<h4 class=\"msg-t\"><span class=\"i-title\">'+wxlist.wxappmsgDetails[0].title+'</span></h4>';
						imgTxtHtml += '<p class=\"msg-meta\"><span class=\"msg-date\">'+wxlist.timeStr+'</span></p>';
						imgTxtHtml += '<div class=\"cover\">';
						imgTxtHtml += '<p class=\"default-tip\" style=\"display:none\">封面图片</p> ';
						imgTxtHtml += '<img src=\"'+wxlist.wxappmsgDetails[0].imgUrl+'\" class=\"i-img\">';
						imgTxtHtml += '<p class=\"msg-text\"></p>';
						imgTxtHtml += '</div></div>';
						imgTxtHtml += '<span class=\"img_active\"><i class=\"icon-ok icon-white\"></i></span> </div></div>';
					}else{
						imgTxtHtml += '<div style=\"margin:0 auto; width:350px;\">';
						imgTxtHtml += '<div id=\"imgTxt_check\" class=\"b-dib vt msg-col\">';
						imgTxtHtml += '<div class=\"msg-item-wrapper\">';
						imgTxtHtml += '<div class=\"msg-item multi-msg\">';
						imgTxtHtml += '<div id=\"appmsgItem1\" class=\"appmsgItem\">';
						imgTxtHtml += '<p class=\"msg-meta\"> <span class=\"msg-date\">'+wxlist.timeStr+'</span></p>';
						imgTxtHtml += '<div class=\"cover\">';
						imgTxtHtml += '<p class=\"default-tip\" style=\"display:none\">封面图片</p>';
						imgTxtHtml += '<h4 class=\"msg-t\"><span class=\"i-title\">'+wxlist.wxappmsgDetails[0].title+'</span></h4>';
						imgTxtHtml += '<img src=\"'+wxlist.wxappmsgDetails[0].imgUrl+'\" class=\"i-img\"> ';
						imgTxtHtml += '</div></div>';
						for(var j = 1; j < wxlist.wxappmsgDetails.length; j++){
							imgTxtHtml += '<div class=\"rel sub-msg-item appmsgItem\" id=\"appmsgItem2\">';
							imgTxtHtml += '<span class=\"thumb\">';
							imgTxtHtml += '<span class=\"default-tip\" style=\"display:none\">缩略图</span>';
							imgTxtHtml += '<img src=\"'+wxlist.wxappmsgDetails[j].imgUrl+'\" class=\"i-img\">';
							imgTxtHtml += '</span>';
							imgTxtHtml += '<h4 class=\"msg-t\">';
							imgTxtHtml += '<span class=\"i-title\">'+wxlist.wxappmsgDetails[j].title+'</span>';
							imgTxtHtml += '</h4></div>';	       
						}
						imgTxtHtml += '</div></div>';
						imgTxtHtml += '<span class=\"img_active\"><i class=\"icon-ok icon-white\"></i></span></div> ';
						imgTxtHtml += '</div>';
					}
				}
				$('#menu5 .controls').find('.conDiv').html(imgTxtHtml);
				boxheight();
			} else {
				return;
			}
	}
	}
	});
}
//根据id和type获取素材
function getMaterialById(id,type){
	var request = "id="+id;
	$.ajax({
	type:'get',
	datatype:'json',
	cache:false,//不从缓存中去数据
	url:encodeURI('../../material/findById?'+request),
	success:
	function(json){
		if(json.status == 0){
			if(type == 2){
				var picHtml = '<div style=\"margin:0 auto; width:350px;\">';
				picHtml += '<div id=\"img_check\" class=\"b-dib vt msg-col\">';
				picHtml += '<div class=\"cover imgSize\"> <img src=\"../../'+json.material.Path+'\" class=\"i-img\" style=\"width:80%;\"> </div></div>';
				$('#menu5 .controls').find('.conDiv').html(picHtml);
				boxheight();
			}
			if(type == 3){
				$('#menu5 .controls p').text(json.material.Name);
				boxheight();
			}
			if(type == 4){
				$('#menu5 .controls p').text(json.material.Name);
				boxheight();
			}
		}
	}
	});
}

//一级菜单添加
$('.add_1').click(function(){
	var i;
	i = $('.dl_length dl').length;
	if(i>=3){
		yunAlertError("一级菜单最多只能添加3个");
	} else {
		$('#menu_modal .modal-footer .Determine').attr("onClick","add_1_menu("+i+")");
		$('#menu_modal').modal('show');
		boxheight();
	}
})
//enter键搜索
pullEnter('vedioForm',listVoice);
pullEnter('fileForm',listVideo);


//发送页面
$('.send').click(function(e) {
	$('#menu3').addClass('active');
	$('#menu3').siblings().removeClass('active');
	$('.on_return').addClass('on_page_1');
	$('.on_return').removeClass('on_page_2');
	$('#words').val('');
	boxheight();
});
//url页面
$('.url').click(function(e) {
	$('#menu4').addClass('active');
	$('#menu4').siblings().removeClass('active');
	$('.on_return').addClass('on_page_1');
	$('.on_return').removeClass('on_page_2');
	$('#url').val('');
	boxheight();
});
//返回选择动作
$('.on_return').click(function(e) {
	$('#menu2').addClass('active');
	$('#menu2').siblings().removeClass('active');
	boxheight();
});
//微信表情转化
function replace_em(str){
	str = str.replace(/\</g,'&lt;');
	str = str.replace(/\>/g,'&gt;');
	str = str.replace(/\n/g,'<br/>');
	str = str.replace(/\[em_([0-9]*)\]/g,'<img src="../../web_mini/arclist/$1.gif" border="0" />');
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


//保存信息
$('.next_page_2').click(function(e) {
	var form = $('#myTabContent .active').attr('id');
	var formType = 0;
	var formValue = '';
	if(form=='pencil'){
		formType = 1;
		formValue = $('#words').val();
		$('#menu5 .controls p').html(replace_em(formValue));
		$('#menu5 .controls').find('.conDiv').html('');
		formValue=wxface(formValue);

		
		
		
	}
	if(form=='picture'){
		formType = 2;
		formValue = $('.control-group #image_value').val();
		$('#menu5 .controls p').text('');
		getMaterialById(formValue, 2);
	}
	if(form=='volume'){
		formType = 3;
		formValue = $('.control-group #voice_value').val();
		$('#menu5 .controls p').text($('.control-group #voice_value').attr("name"));
		$('#menu5 .controls').find('.conDiv').html('');
	}
	if(form=='facetime'){
		formType = 4;
		formValue = $('.control-group #video_value').val();
		$('#menu5 .controls p').text($('.control-group #video_value').attr("name"));
		$('#menu5 .controls').find('.conDiv').html('');
	}
	
	//用图文回答,点击保存之后显示图片
	if(form=='film'){
		formType = 5;
		formValue = $('.control-group #imgTxt_value').val();//选中图文的id
		$('#menu5 .controls p').text('');
		getImgTxtById(formValue);//根据id请求接口获取图文html
	}
	
	//用答案回答，点击保存之后显示相应答案的问题
	if(form=='que'){
		formType = 101;
		formValue = $('.control-group #queTxt_value').val();
        var con=$('.control-group #queTxt_value').attr("name");
		con=$xss(con,'html');
		var Id=$('.control-group #queTxt_value').attr("qId");
		$('#menu5 .controls p').html('查看答案详细：<a href="../knowledge/question_detail.html?id='+Id+'">'+con+'</a>');
		$('#menu5 .controls').find('.conDiv').html('');
		
	}
	$('#menu5').addClass('active');
	$('#menu5').siblings().removeClass('active');
	var name = $('.current .nameValue').attr('name');
	name = name.substring(8,name.length);
	var typeHtml = '<input type="hidden" class="act_type" value="'+formType+'" name="type'+name+'"/>';
	var valueHtml = '<input type="hidden" class="act_value" value="'+formValue+'" name="value'+name+'"/>';
	$('.current .act_type').remove();
	$('.current .act_value').remove();
	$('.current').append(typeHtml);
	$('.current').append(valueHtml);
	boxheight();
});


//保存URL
$('.next_page_3').click(function(e) {
	var formType = 6;
	var formValue = $('#url').val();
	var sear=new RegExp('http://');
	if(!sear.test(formValue)){
		formValue='http://'+formValue;
	}
	
	if(formValue == ""){
		yunAlertError("请输入正确的URL"); 
		return;
	}
	if(!validUrl(formValue)){
		yunAlertError("请输入正确的URL"); 
		return;
	}
	$('#menu7 .controls p').text(formValue);
	$('#menu7').addClass('active');
	$('#menu7').siblings().removeClass('active');
	var name = $('.current .nameValue').attr('name');
	name = name.substring(8,name.length);
	var typeHtml = '<input type="hidden" class="act_type" value="'+formType+'" name="type'+name+'"/>';
	var valueHtml = '<input type="hidden" class="act_value" value="'+formValue+'" name="value'+name+'"/>';
	$('.current .act_type').remove();
	$('.current .act_value').remove();
	$('.current').append(typeHtml);
	$('.current').append(valueHtml);
	boxheight();
});
//修改信息
$('.update_info').click(function(e) {
	$('#menu2').addClass('active');
	$('#menu2').siblings().removeClass('active');
	boxheight();
});
//获取语音素材列表
$('.voice_btn').click(function(e) {
	listVoice();
});
//获取视频素材列表
$('.video_btn').click(function(e) {
	listVideo();
});

//根据微信号渲染已有菜单信息
$('#wxh select').live('change',function(){
	if($(this).val() == ''){
		return;
	}else{
		loadInfo($(this).val());
	}
})

//页面初始化拼接已有菜单页面信息
function loadInfo(id){
	$.ajax({
	type:'get',
	datatype:'json',
	cache:false,//不从缓存中去数据
	url:encodeURI('../../Wx_Btn/findBywxConfigId?wxId='+id),
	success:
	function(json){
		$("#nameStr").val("");
		if(json.status == 0){
			if(json.list != null){
				var indexX = -1;
				var indexY = 0;
				var fId;
				$('.dl_length').html("");
				for(var i=0; i<json.list.length; i++){
					if(json.list[i].FatherBtnId==0){
						var s;
						fId = json.list[i].Id;
						indexX +=1;
						indexY = 0;
						s = '<dl class="d2_length dl_'+indexX+'"><dt>';
						s += '<i class="caret"></i>';
						s += '<a data-toggle="tab" href="#" class="menu_link">'+json.list[i].Name+'</a>';
						s += '<input type="hidden" class="nameValue" name="catename['+indexX+']['+indexY+']" value="'+json.list[i].Name+'">';
						s += '<input type="hidden" class="act_type" value="'+json.list[i].ActType+'" name="type['+indexX+']['+indexY+']"/>';
						s += '<input type="hidden" class="act_value" value="'+json.list[i].ActValue+'" name="value['+indexX+']['+indexY+']"/>';
						s += '<input type="hidden" class="act_key" value="'+json.list[i].Key+'" name="key['+indexX+']['+indexY+']"/>';
						s += '<span class="menu_opr">';
						s += '<a class="icon-plus add_2" href="#"></a>';
						s += '<a class="icon-pencil pencil" href="#"></a>';
						s += '<a class="icon-trash trash" href="#"></a>';
						s += '</span>';
						s += '</dt>';
						s += '</dl>';
						$('.dl_length').append(s);
					}else if(json.list[i].FatherBtnId == fId){
						var s;
						indexY +=1;
						s = '<dd>';
						s += '<i class="icon_dot">●</i>';
						s += '<a href="#" class="menu_link">'+json.list[i].Name+'</a>';
						s += '<input type="hidden" class="nameValue" name="catename['+indexX+']['+indexY+']" value="'+json.list[i].Name+'">';
						s += '<input type="hidden" class="act_type" value="'+json.list[i].ActType+'" name="type['+indexX+']['+indexY+']"/>';
						s += '<input type="hidden" class="act_value" value="'+json.list[i].ActValue+'" name="value['+indexX+']['+indexY+']"/>';
						s += '<input type="hidden" class="act_key" value="'+json.list[i].Key+'" name="key['+indexX+']['+indexY+']"/>';
						s += '<span class="menu_opr">';
						s += '<a class="icon-pencil pencil" href="#"></a>';
						s += '<a class="icon-trash trash" href="#"></a>';
						s += '</span>';
						s += '</dd>';
						$('.dl_'+indexX).append(s);
					}
					$("#nameStr").val($("#nameStr").val()+","+json.list[i].Name);
				}
				boxheight();
			}
		} else {
 			yunAlert(json);
		}
	}
	});
}

//获取语音素材
function listVoice(pageNo){
	if(!pageNo)pageNo=1;
	var request = "name="+$('.voice_btn').prev().val();
	$.ajax({
	type:'get',
	datatype:'json',
	cache:false,//不从缓存中去数据
	url:encodeURI('../../material/list?type=2'+'&'+request+'&pageSize='+20+'&pageNo='+pageNo),
	success:
	function(json){
		if(json.list.length == 0){
	    	$("#volume_modal #voiceDiv").empty();
	    	$("#volume_modal #voiceDiv").append('<tr><td colspan=\"8\" style=\"text-align:center;\"><i class=\"icon-exclamation-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
	    }else{
	    	var s = '';
	    	$("#volume_modal #voiceDiv").empty();
	    	for(var i = 0;i<json.list.length;i++){
	    		///图片列表展示
	    		s += '<tr>';
	    		s += '<td><input type=\"radio\" name=\"optionsVoice\" value=\"'+json.list[i].Id+'\" checked></td>';
          		s += '<td>'+json.list[i].Name+'</td>';
          		s += '</tr>';
	    	}
	    	$('#voiceDiv').append(s);
	    	$('#voiceDiv').parent().parent().append('<div id=\"VpageList2\"></div>');
	    	//下面开始处理分页
      		var options = {
	            currentPage: json.currentPage,
	            totalPages: json.totlePages,
				alignment:'right',
				onPageClicked: function (event, originalEvent, type, page) {
					listVoice(page);
				}
	            };
	        setPage('VpageList2',options);
	    }
	}
	});
}

//获取视频素材
function listVideo(pageNo){
	if(!pageNo)pageNo=1;
	var name = $('.video_btn').prev().val();
	var request = "";
	if(name != ''){
		request = "name="+name;
	}else{
		request ="1=1";
	}
	 
	$.ajax({
	type:'get',
	datatype:'json',
	cache:false,//不从缓存中去数据
	url:encodeURI('../../material/list?type=3'+'&'+request+'&pageSize='+20+'&pageNo='+pageNo),
	success:
	function(json){
		if(json.list.length == 0){
	    	$("#facetime_modal #videoDiv").empty();
	    	$("#facetime_modal #videoDiv").append('<tr><td colspan=\"8\" style=\"text-align:center;\"><i class=\"icon-exclamation-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
	    }else{
	    	var s = '';
	    	$("#facetime_modal #videoDiv").empty();
	    	for(var i = 0;i<json.list.length;i++){
	    		///图片列表展示
	    		s += '<tr>';
	    		s += '<td><input type=\"radio\" name=\"optionsVideo\" value=\"'+json.list[i].Id+'\" checked></td>';
          		s += '<td>'+json.list[i].Name+'</td>';
          		s += '</tr>';
	    	}
	    	$('#videoDiv').append(s);
	    	$('#videoDiv').parent().parent().append('<div id=\"VpageList3\"></div>');
	    	//下面开始处理分页
      		var options = {
	            currentPage: json.currentPage,
	            totalPages: json.totlePages,
				alignment:'right',
				onPageClicked: function (event, originalEvent, type, page) {
					listVideo(page);
				}
	            };
	        setPage('VpageList3',options);
	    }
	}
	});
}
	
//修改菜单实现
function update_menu(menu_name){
	var submenu_index;
	var submenu_title;
	var submenu;
	
	var tmpValueX = $('#menuname').val();
	$('#menuname').val($xss(tmpValueX,'html'));

	submenu_title = $('#menuname').val();
	submenu_index = $('#submenu_index').val();
	submenu = $('#submenu').val();
	
	var nameStr;
	nameStr = $('#nameStr').val();
	if(nameStr != '' && nameStr != null){
		var names = nameStr.split(",");
		for(var i=0; i<names.length; i++){
			if(names[i] == menu_name){
				nameStr = nameStr.replace(","+menu_name,"");
			}
		}
	}
	$('#nameStr').val(nameStr);
	if(nameStr != '' && nameStr != null){
		var names = nameStr.split(",");
		for(var t=0; t<names.length; t++){
			if(names[t] == submenu_title){
				yunAlertError('该菜单名已存在');
				return;
			}
		}
	}
	$('#nameStr').val(nameStr+","+submenu_title);
	
	
	if(submenu == -1){
		$('dl').eq(submenu_index).find('dt .menu_link').html(submenu_title);
		$('dl').eq(submenu_index).find('dt .nameValue').val(submenu_title);
	} else {
		$('dl').eq(submenu_index).children().eq(submenu).children('.menu_link').html(submenu_title);
		$('dl').eq(submenu_index).children().eq(submenu).children('.nameValue').val(submenu_title);
	}
	$('#menu_modal').modal('hide');
	closes();
}
//添加一级菜单
function add_1_menu(i){
	if($('#menuname').val() == ''){
		yunAlertError('请输入菜单名');
	} else {
		var menutitle;
		menutitle = $('#menuname').val();
		var nameStr;
		nameStr = $('#nameStr').val();
		if(nameStr != '' && nameStr != null){
			var names = nameStr.split(",");
			for(var t=0; t<names.length; t++){
				if(names[t] == menutitle){
					yunAlertError('该菜单名已存在');
					return;
				}
			}
		}
		$('#nameStr').val(nameStr+","+menutitle);
		var s;
		s = '<dl class="d2_length"><dt>';
		s += '<i class="caret"></i>';
		s += '<a data-toggle="tab" href="#" class="menu_link">'+menutitle+'</a>';
		s += '<input type="hidden" class="nameValue" name="catename['+i+'][0]" value="'+menutitle+'">';
		s += '<span class="menu_opr">';
		s += '<a class="icon-plus add_2" href="#"></a>';
		s += '<a class="icon-pencil pencil" href="#"></a>';
		s += '<a class="icon-trash trash" href="#"></a>';
		s += '</span>';
		s += '</dt></dl>';
		$('.dl_length').append(s);
		$('#menu_modal').modal('hide');
		closes();
	}
}
//添加二级菜单
function add_2_menu(i,j){
	var menutitle;
	var submenu_index;
	var s;
	if($('#menuname').val() == ''){
		yunAlertError('请输入菜单名');
	} else {
		
		var tmpValueX = $('#menuname').val();
		$('#menuname').val($xss(tmpValueX,'html'));

		menutitle = $('#menuname').val();
		var nameStr;
		nameStr = $('#nameStr').val();
		if(nameStr != '' && nameStr != null){
			var names = nameStr.split(",");
			for(var t=0; t<names.length; t++){
				if(names[t] == menutitle){
					yunAlertError('该菜单名已存在');
					return;
				}
			}
		}
		$('#nameStr').val(nameStr+","+menutitle);
		submenu_index = $('#submenu_index').val();
		s = '<dd>';
		s += '<i class="icon_dot">●</i>';
		s += '<a href="#" class="menu_link">'+menutitle+'</a>';
		s += '<input type="hidden" class="nameValue" name="catename['+i+']['+j+']" value="'+menutitle+'">';
		s += '<span class="menu_opr">';
		s += '<a class="icon-pencil pencil" href="#"></a>';
		s += '<a class="icon-trash trash" href="#"></a>';
		s += '</span>';
		s += '</dd>';
		$('.d2_length').eq(submenu_index).append(s);
		$(":hidden[name='type["+i+"][0]']").prop('value', 'null');
		$(":hidden[name='value["+i+"][0]']").prop('value', '');
		$('#menu_modal').modal('hide');
		closes();
	}
}
//关闭对话框，清除内容
function closes(){
	$('#menuname').val('');
	$('#submenu_index').val('');
	$('#submenu').val('');
}
//初始化滚动条
function modal_scroll(id){
	$('#'+id).on('shown',function(){
		yun_scroll();
	});
}
//分页设置
function setPage(domId,options){
   $('#'+domId).bootstrapPaginator(options);
}
//获取图片素材
function listImage(pageNo){
	if(!pageNo)pageNo=1;
	 
	$.ajax({
	type:'get',
	datatype:'json',
	cache:false,//不从缓存中去数据
	url:encodeURI('../../material/list?type='+1+'&pageSize='+20+'&pageNo='+pageNo),
	success:
	function(json){
	  if(json.status==0){
		if(json.list.length == 0){
	    	$("#picture_modal .content").empty().append("<p style=\"text-align:center\"><i class=\"icon-exclamation-sign\"></i>暂无图片！</p>");
			$('#VpageList').html('');
	    }else{
	    	var s = '';
	    	$("#picture_modal .content").empty();
	    	for(var i = 0;i<json.list.length;i++){
	    		///图片列表展示
	    		s += '<div class=\"b-dib vt msg-col img_hover\">';
	    		s += '<div class=\"cover\"> <img src=\"../../'+json.list[i].Path+'\" class=\"i-img\" name=\"'+json.list[i].Name+'\" id=\"'+json.list[i].Id+'\"> </div>';
          		s += '<span class=\"img_active\"><i class=\"icon-ok icon-white\"></i></span> </div>';
	    	}
	    	s += '<div id=\"VpageList\"></div>';
	    	$('#picDiv').append(s);
	    	//下面开始处理分页
      		var options = {
	            currentPage: json.currentPage,
	            totalPages: json.totlePages,
				alignment:'right',
				onPageClicked: function (event, originalEvent, type, page) {
					listImage(page);
					}
	            };
	        setPage('VpageList',options);
	    	//选择图片
			$('#picDiv .img_hover').click(function(e){
				$(this).addClass('active_img');
				$(this).siblings().removeClass('active_img');
				$(this).css("border","3px solid #F00");
				$(this).siblings().css("border","3px solid #FFF");
			});
			
	    }
	  }else{
			yunAlert(data);	 
	 }
	}
	});
}

//图片
function picture_btn(){
	modal_scroll('picture_modal');
	listImage();
	$('#picture_modal').modal('show');
}	
//语音
function volume_btn(){
	modal_scroll('volume_modal');
	listVoice();
	$('#volume_modal').modal('show');
}
//视频
function facetime_btn(){
	modal_scroll('facetime_modal');
	listVideo();
	$('#facetime_modal').modal('show');
}
//获取图文素材
function listImgTxt(pageNo){
	if(!pageNo)pageNo=1;
	 
	$.ajax({
	type:'get',
	datatype:'json',
	cache:false,//不从缓存中去数据
	url:encodeURI('../../Wxappmsg/list?pageSize='+20+'&pageNo='+pageNo),
	success:
	function(json){
	   if(json.result.status==0){
		if(json.result.list.length == 0){
			$("#img_boxs").empty().append("<p style=\"text-align:center\"><i class=\"icon-exclamation-sign\"></i>暂无图文！</p>");
	    }else{
	    	$("#img_boxs").empty();
	    	for(var i = 0;i<json.result.list.length;i++){
	    		var imgTxtHtml = '';
	    		if((i+1)%2==1){
	    			if(json.result.list[i].wxappmsgDetails.length == 1){
	    				imgTxtHtml += '<div class=\"b-dib vt msg-col yun_float_left img_hover\">';
	    				imgTxtHtml += '<input type=\"hidden\" class=\"idValue\" id=\"'+json.result.list[i].id+'\" value=\"'+json.result.list[i].wxappmsgDetails[0].title+'\"/>';
			    		imgTxtHtml += '<div class=\"msg-item-wrapper\">';
			    		imgTxtHtml += '<div class=\"msg-item appmsgItem\">';
			    		imgTxtHtml += '<h4 class=\"msg-t\"><span class=\"i-title\">'+json.result.list[i].wxappmsgDetails[0].title+'</span></h4>';
			    		imgTxtHtml += '<p class=\"msg-meta\"><span class=\"msg-date\">'+json.result.list[i].timeStr+'</span></p>';
			    		imgTxtHtml += '<div class=\"cover\">';
			    		imgTxtHtml += '<p class=\"default-tip\" style=\"display:none\">封面图片</p> ';
			    		imgTxtHtml += '<img src=\"'+json.result.list[i].wxappmsgDetails[0].imgUrl+'\" class=\"i-img\">';
			    		imgTxtHtml += '<p class=\"msg-text\"></p>';
			    		imgTxtHtml += '</div></div>';
			    		imgTxtHtml += '<span class=\"img_active\"><i class=\"icon-ok icon-white\"></i></span> </div>';
	    			}else{
	    				imgTxtHtml += '<div class=\"b-dib vt msg-col yun_float_left img_hover\">';
	    				imgTxtHtml += '<input type=\"hidden\" class=\"idValue\" id=\"'+json.result.list[i].id+'\" value=\"'+json.result.list[i].wxappmsgDetails[0].title+'\"/>';
	    				imgTxtHtml += '<div class=\"msg-item-wrapper\">';
	    				imgTxtHtml += '<div class=\"msg-item multi-msg\">';
	    				imgTxtHtml += '<div id=\"appmsgItem1\" class=\"appmsgItem\">';
	    				imgTxtHtml += '<p class=\"msg-meta\"> <span class=\"msg-date\">'+json.result.list[i].timeStr+'</span></p>';
	    				imgTxtHtml += '<div class=\"cover\">';
	    				imgTxtHtml += '<p class=\"default-tip\" style=\"display:none\">封面图片</p>';
	    				imgTxtHtml += '<h4 class=\"msg-t\"><span class=\"i-title\">'+json.result.list[i].wxappmsgDetails[0].title+'</span></h4>';
	    				imgTxtHtml += '<img src=\"'+json.result.list[i].wxappmsgDetails[0].imgUrl+'\" class=\"i-img\"> ';
	    				imgTxtHtml += '</div></div>';
	    				for(var j = 1; j < json.result.list[i].wxappmsgDetails.length; j++){
		    				imgTxtHtml += '<div class=\"rel sub-msg-item appmsgItem\" id=\"appmsgItem2\">';
		    				imgTxtHtml += '<span class=\"thumb\">';
		    				imgTxtHtml += '<span class=\"default-tip\" style=\"display:none\">缩略图</span>';
		    				imgTxtHtml += '<img src=\"'+json.result.list[i].wxappmsgDetails[j].imgUrl+'\" class=\"i-img\">';
		    				imgTxtHtml += '</span>';
		    				imgTxtHtml += '<h4 class=\"msg-t\">';
		    				imgTxtHtml += '<span class=\"i-title\">'+json.result.list[i].wxappmsgDetails[j].title+'</span>';
		    				imgTxtHtml += '</h4></div>';	       
	    				}
	          
	    				imgTxtHtml += '</div></div>';
	    				imgTxtHtml += '<span class=\"img_active\"><i class=\"icon-ok icon-white\"></i></span> </div>';
	    			}
	    		}else{
	    			if(json.result.list[i].wxappmsgDetails.length == 1){
	    				imgTxtHtml += '<div class=\"b-dib vt msg-col yun_float_right img_hover\">';
	    				imgTxtHtml += '<input type=\"hidden\" class=\"idValue\" id=\"'+json.result.list[i].id+'\" value=\"'+json.result.list[i].wxappmsgDetails[0].title+'\"/>';
			    		imgTxtHtml += '<div class=\"msg-item-wrapper\">';
			    		imgTxtHtml += '<div class=\"msg-item appmsgItem\">';
			    		imgTxtHtml += '<h4 class=\"msg-t\"><span class=\"i-title\">'+json.result.list[i].wxappmsgDetails[0].title+'</span></h4>';
			    		imgTxtHtml += '<p class=\"msg-meta\"><span class=\"msg-date\">'+json.result.list[i].timeStr+'</span></p>';
			    		imgTxtHtml += '<div class=\"cover\">';
			    		imgTxtHtml += '<p class=\"default-tip\" style=\"display:none\">封面图片</p> ';
			    		imgTxtHtml += '<img src=\"'+json.result.list[i].wxappmsgDetails[0].imgUrl+'\" class=\"i-img\">';
			    		imgTxtHtml += '<p class=\"msg-text\"></p>';
			    		imgTxtHtml += '</div></div>';
			    		imgTxtHtml += '<span class=\"img_active\"><i class=\"icon-ok icon-white\"></i></span> </div>';
	    			}else{
	    				imgTxtHtml += '<div class=\"b-dib vt msg-col yun_float_right img_hover\">';
	    				imgTxtHtml += '<input type=\"hidden\" class=\"idValue\" id=\"'+json.result.list[i].id+'\" value=\"'+json.result.list[i].wxappmsgDetails[0].title+'\"/>';
	    				imgTxtHtml += '<div class=\"msg-item-wrapper\">';
	    				imgTxtHtml += '<div class=\"msg-item multi-msg\">';
	    				imgTxtHtml += '<div id=\"appmsgItem1\" class=\"appmsgItem\">';
	    				imgTxtHtml += '<p class=\"msg-meta\"> <span class=\"msg-date\">'+json.result.list[i].timeStr+'</span></p>';
	    				imgTxtHtml += '<div class=\"cover\">';
	    				imgTxtHtml += '<p class=\"default-tip\" style=\"display:none\">封面图片</p>';
	    				imgTxtHtml += '<h4 class=\"msg-t\"><span class=\"i-title\">'+json.result.list[i].wxappmsgDetails[0].title+'</span></h4>';
	    				imgTxtHtml += '<img src=\"'+json.result.list[i].wxappmsgDetails[0].imgUrl+'\" class=\"i-img\"> ';
	    				imgTxtHtml += '</div></div>';
	    				for(var j = 1; j < json.result.list[i].wxappmsgDetails.length; j++){
		    				imgTxtHtml += '<div class=\"rel sub-msg-item appmsgItem\" id=\"appmsgItem2\">';
		    				imgTxtHtml += '<span class=\"thumb\">';
		    				imgTxtHtml += '<span class=\"default-tip\" style=\"display:none\">缩略图</span>';
		    				imgTxtHtml += '<img src=\"'+json.result.list[i].wxappmsgDetails[j].imgUrl+'\" class=\"i-img\">';
		    				imgTxtHtml += '</span>';
		    				imgTxtHtml += '<h4 class=\"msg-t\">';
		    				imgTxtHtml += '<span class=\"i-title\">'+json.result.list[i].wxappmsgDetails[j].title+'</span>';
		    				imgTxtHtml += '</h4></div>';	       
	    				}
	          
	    				imgTxtHtml += '</div></div>';
	    				imgTxtHtml += '<span class=\"img_active\"><i class=\"icon-ok icon-white\"></i></span> </div>';
	    			}
	    		}
    			
                $("#img_boxs").append(imgTxtHtml);  
                //选择图文
				$('#img_boxs .img_hover').click(function(e){
					$(this).addClass('active_img');
					$(this).siblings().removeClass('active_img');
					$(this).css("border","3px solid #F00");
					$(this).siblings().css("border","3px solid #FFF");
				});               
	    	}
	    	$("#img_boxs").append('<div class=\"yun_clera_h\"></div>');
	    	$("#img_boxs").append('<div id=\"VpageList4\"></div>');  
	    	 //下面开始处理分页
      		var options = {
	            currentPage: json.result.currentPage,
	            totalPages: json.result.totlePages,
				alignment:'right',
				onPageClicked: function (event, originalEvent, type, page) {
					listImgTxt(page);
					}
	            };
	        setPage('VpageList4',options);            
	    }
	  }else{
		   yunAlert(json.result); 
	 }
	}
	  });
}
//问题
function que_btn(){
	$('#que_modal').modal('show');
}
afterModal('que_modal',function(){
	$.fn.zTree.init($("#treeHide"), setting, []);
	hasAnsList();
	yun_scroll();
})
//图文
function film_btn(){
	listImgTxt();
	$('#film_modal').modal('show');
	modal_scroll('film_modal');
}
//选择图片
function add_img(id){
	if($('#'+id+' .active_img').length<1){
		yunAlertError("请选择图片");
		return;
	}
	var value = $('#'+id+' .active_img img').attr('id');
	var name = $('#'+id+' .active_img img').attr('name');
	$('.control-group #image').val(name);
	$('.control-group #image_value').attr({value:value,name:name});
	$('#picture_modal').modal('hide');
}

//选择答案
function addQueTxt(){
	var IDS=getSelectedId();
	var value=$('.menu'+IDS).find('.hasAnsCon').attr('rel');
	var Id=$('.menu'+IDS).find('.hasAnsCon').attr('qId');
	$('#que #queTxt').val(value);
	$('#que #queTxt_value').attr({value:IDS,name:value,qId:Id});
	$('#que_modal').modal('hide');
}


//选择图文
function addImgTxt(id){
	if($('#'+id+' .active_img').length<1){
		yunAlertError("请选择图文");
		return;
	}
	var value = $('#'+id+' .active_img .idValue').attr('id');
	var name = $('#'+id+' .active_img .idValue').val();
	$('.control-group #imgTxt').val(name);
	$('.control-group #imgTxt_value').attr({value:value,name:name});
	$('#film_modal').modal('hide');
}

//选择语音
function addVoice(id){
	var value = $('#'+id+' input[name="optionsVoice"]:checked').val();
	var name = $('#'+id+' input[name="optionsVoice"]:checked').parent().next().text();
	$('.control-group #voice').val(name);
	$('.control-group #voice_value').attr({value:value,name:name});
	$('#volume_modal').modal('hide');
}

//选择视频
function addVideo(id){
	var value = $('#'+id+' input[name="optionsVideo"]:checked').val();
	var name = $('#'+id+' input[name="optionsVideo"]:checked').parent().next().text();
	$('.control-group #video').val(name);
	$('.control-group #video_value').attr({value:value,name:name});
	$('#facetime_modal').modal('hide');
}

//发布菜单
$('.publish').click(function() {
	var data=$('.dl_length').serialize();//获取值
	var dl_length = $('.dl_length dl').length;
	for(var i=0;i<dl_length;i++){
		var length = $('.dl_length').children('dl').eq(i).children().length;
		if(length>1){
			for(var j=1;j<length;j++){
				var value = $('.dl_length').children('dl').eq(i).children().eq(j).children(".act_value").length;
				if(value<=0){
					yunAlertError("每个菜单下必须设置动作");
					return;
				}
			}
		} else {
			var value = $('.dl_length').children('dl').eq(i).children('dt').children(".act_value").length;
			if(value<=0){
				yunAlertError("每个菜单下必须设置动作");
				return;
			}
		}
	}
	var wxh = $('#wxh select').val();//获取微信号
	if(wxh == ''){
		yunAlertError("请选择微信号");
		return;
	}
  /*  data= decodeURIComponent(data,true);//防止中文乱码*/
    var json=DataDeal.formToJson(data);//转化为json
    var request = "request="+json;
	if(publish){
		return;
	}
	publish=true;
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
				yunAlert(data);
			}
			else{
				yunAlert(data);
			}
		}
			
	});	
});

//删除公众号

$('#del_material_wx').click(function(){
	$('#delWxModal').modal('show');})
	
$('#delMenuWxBtn').click(function(){
	var wxh = $('#wxh select').val();
	if(!wxh){
		yunAlertError('请选择您要删除的微信号');
		return;
	}
	$.ajax({
		type:'post',
		dataType:"json",
		cache:false,
		url:"../../Wx_Btn/deleteWXMenu?wxId="+wxh,
		success:
		function(data){
			if(data.status==0){
				$('#delWxModal').modal('hide');
				$('#menu_list .dl_length').html('');
				yunAlert(data);
			}
			else{
				yunAlert(data);
			}
		}
	});	
})