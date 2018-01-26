var uploadInterval;
//确认导入
function confirmLoad(obj) {
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false, //不从缓存中去数据
		url: encodeURI('../../WordDocExcel/getStatus'),
		success: function(data) {
			if (data.ProgressToKnowledge == 100) {
				if (data.ErrorMsg != '') {
					yunNoty({
						status: 1,
						message: data.ErrorMsg
					});
				} else {
					yunNoty({
						status: 0,
						message: '导入成功！'
					});
				}
				clearInterval(uploadInterval);
				window.initSrc();
			} else {
				yunNoty({
					status: 0,
					message: '导入进度：' + data.ProgressToKnowledge + '%'
				});
			}
		}
	});
}

$(document).ready(function() {
	//上传
	$(function() {
		'use strict';
		$('#exlfileupload').fileupload({
			url: '../../WordDocExcel/importFile?mode=2',
			dataType: 'json',
			change: function(e, data) {
				var flag = false;
				data.files.forEach(function(el, i) {
					var str = el.name.substring(el.name.lastIndexOf('.') + 1).toLowerCase();
					if (str == 'xls' || str == 'xlsx') {
						flag =  true;
					} else {
						flag =  false;
						yunNotyError('请上传xls或xlsx格式的文件！');
					}
				});
				return flag;
			},
			done: function(e, data) {
				if (data.result.status == 0) {
					yunNoty(data.result);
					uploadInterval = setInterval(confirmLoad, 5000);
				} else {
					yunNoty(data.result);
					$('.fileinput-button').css('display', 'inline-block');
					$('.fileUpLoadingSign').css('display', 'none');
				}
			},
			progressall: function(e, data) {
				var progress = parseInt(data.loaded / data.total * 100, 10);
				$('#exlProgress .progress-bar').css(
					'width',
					progress + '%'
				);
			}
		}).bind('fileuploadstart', function(e) {
			$('.fileinput-button').css('display', 'none');
			$('.fileUpLoadingSign').css('display', 'inline-block');
			$('#exlProgress').show();
		}).bind('fileuploadstop', function(e) {
			$('.fileinput-button').css('display', 'inline-block');
			$('.fileUpLoadingSign').css('display', 'none');
			$('#exlProgress').hide();
			$('#exlProgress .progress-bar').css('width', '0%');
		});
	});
});
	
//判断是否表格词库的词
var isTabFlag = false;
function isTab(){
	if($('#search-input').val()==''){
        isTabFlag = false;
		return false;
	}
	$.ajax({
		type:'post',
		url:'../../wordDoc/listLeftQueryEum',
		data:{'word':$('#search-input').val()},
		async:true,
		cache:true,
		success:function(data){
			if(data.message=='你搜索的是表格词，请问是否打开表格库查看！'){
                isTabFlag = true;
				$('#tabSynonym').modal('show');
				$('#sureTab').click(function(){
					$('#tabSynonym').modal('hide');
					$('#sureTab').attr('href','../../web/knowledge/TabLex.html?text='+$('#search-input').val());
				});
			}else{
                isTabFlag = false;
                $('#tabSynonym').modal('hide');
            }
		}
	});
}


$('#cancelBtn').click(function(){
	$('#tabSynonym').hide();
});

// 删除的对象

var deleteObj = null;
// handlebars模板
var templateWordContainer = null;
var templateWordContentNil = null;
var templateDelConfirmString = null;
var templateWordContentList = null;
// 词库列表数据
var lexiconList = null;
$(document).ready(function() {
	App.init();
	iframeTab.init({iframeBox: ''});
	templateWordContainer = Handlebars.compile($('#word-container').html());
	templateWordContentNil = Handlebars.compile($('#word-content-nil').html());
	templateDelConfirmString = Handlebars.compile($('#del-confirm-string').html());
	templateWordContentList = Handlebars.compile($('#word-content-list').html());

	$('#lexicon-left').slimScroll({
		height: $(window).height() + 'px'
	});
	// 单个词点击事件
	$(document).on('click', '.word-container', function(){
		var self = this;
		if($(self).hasClass('active')) {
			//$(self).removeClass('active');
		} else {
			triggerSingle(self);
		}
		activeChildren($(self).attr('cid'));
	});

	// 单个词双击事件
	$(document).on('dblclick', '.word-container', function(e){
		e.preventDefault();
	});

	$(document).on('click', '#commit', function(){
		// 点编辑时存储数据,在修改词库页面取出
		if (sessionStorage) {
			sessionStorage.setItem('lx_list', JSON.stringify(lexiconList));
		}
		
		ifbOpenWindowInNewTab('/web/knowledge/LexiconEdit.html?word='+$('#first').val(), '编辑词库');
	});

	$(document).on('click', '#addnewword', function(){
        $('#modal-dialog').modal('show');
        $('input[name="word"]').val('');
	});

	// 需要判断这个词在词库中存不存在，
	// 若不存在，可以创建，跳到下方页面，
	// 若已存在，给出提示，在此词库页面中搜索这个词,不跳转
	$(document).on('click', '#createWord', function(){
        $.ajax({
            type:'post',
            url:'../../wordDoc/listLeftQueryEum',
            data:{'word':$('input[name="word"]').val()},
            async:true,
            cache:true,
            success:function(data){
                if(data.message=='你搜索的是表格词，请问是否打开表格库查看！'){
                    $('#tabSynonym .modal-body .form-group').text('你添加的是表格词，请问是否打开表格库查看！');
                    $('#tabSynonym').modal('show');
                    $('#sureTab').click(function(){
                        $('#tabSynonym').modal('hide');
                        $('#sureTab').attr('href','../../web/knowledge/TabLex.html?text='+$('input[name="word"]').val());
                    });
                }else{
                    $('#tabSynonym').modal('hide');
                    $.getJSON('../../wordDoc/listLeftEum?word='+$('#createWordValue').val(), function(data) {
                        var ll = data.list.filter(function(el){
                            if(el.Word == $('#createWordValue').val())
                                return true;
                            return false;
                        });
                        if(ll.length > 0) {
                            $('#search-input').val($('#createWordValue').val());
                            $('#search').trigger('click');
                            $('#modal-dialog').modal('hide');
                        } else {
                            // 如果是创建,需要给创建词库页面一个新的初始数据,并通过lowestWord判断是新增而不是修改
                            if (sessionStorage) {
                                sessionStorage.setItem('lx_list', JSON.stringify([{
                                    'Word': $('#createWordValue').val(),
                                    'Tyc': $('#createWordValue').val(),
                                    'Id': 110,
                                    'lowestWord': true
                                }]));
                                $('#modal-dialog').modal('hide');
                            }
                            ifbOpenWindowInNewTab('/web/knowledge/LexiconEdit.html?word='+$('#createWordValue').val(), '创建词库');
                        }
                    });
                }
            }
        });
		
	});

	// 搜索按钮点击
	$(document).on('click', '#search', function(){
		isTab();
		// 从接口获取数据
		getLexicon();
		// 生成树
		getLexiconList();
		//$('.first-in').removeClass('hide');
		//$('.first-out').addClass('hide');
	});

	$(document).on('keyup', '#search-input', function(e){
		if(e.keyCode == 13) {
			$('#search').trigger('click');
		}
	});

	// 单击父级
	$(document).on('click', '.word-father', function(e) {
		$('#search-input').val($(this).children().text());
		$('#search').trigger('click');
	});

	// 单击左栏子级
	$(document).on('click', '.lexicon-left-son', function(e) {
		$('#search-input').val($(this).text());
		$('#search').trigger('click');
	});

	// 单击左栏父级
	$(document).on('click', '.lexicon-head', function(e) {
		$('.lexicon-sons').addClass('hide');
		$(this).next().removeClass('hide');
		$('.lexicon-head-focus').removeClass('lexicon-head-focus');
		$(this).addClass('lexicon-head-focus');
		$('#first').val($(this).text());
		getLexiconList($(this).text());
    });
    // 从接口获取数据
	getLexicon();
	//$('#search').trigger('click');
});

// 展示子元素
function activeChildren(cid){
	if(cid) {
		//如果可以在下一排找到子节点
		if($('[fid="'+cid+'"]').length > 0) {
			var eq0 = $('[fid="'+cid+'"]').eq(0);
			eq0.parents('.word-content').removeClass('hide');
			eq0.parent().children('.word-container').addClass('hide');
			$('[fid="'+cid+'"]').removeClass('hide');
			triggerSingle(eq0);
			activeChildren(eq0.attr('cid'));
		//没有就显示无,且隐藏之后的所有层
		} else {
			hideAfter($('[cid="'+cid+'"]'));
		}
	}
}

// 标记单行子元素
function triggerSingle(obj) {
	//$('.word-container').removeClass('active');
	$(obj).siblings().removeClass('active');
	$(obj).addClass('active');
	var chineseWord = Utils.numberToChinese($(obj).parents('.word-content').index()+1) + '级词语';
	// $(obj).parents('.word-content').find('.word-selected').html($(obj).find('.w').text());
	$(obj).parents('.word-content').find('.word-selected').html(chineseWord);
}

// util 隐藏当前行之后的元素
function hideAfter(obj) {
	var pa0 = obj.parents('.word-content');
	if(pa0.nextAll()){
		pa0.nextAll().find('.word-container').addClass('hide');
		//更改左栏文字
		pa0.nextAll().find('.word-selected').html(' ');
		pa0.nextAll().addClass('hide');
		$('#word-tail').removeClass('hide');
	}
}

// 生成左栏
function getLexicon() {
	$.ajax({
		type: 'get',
		datatype: 'json',
        cache: false,
		url: encodeURI('../../wordDoc/listLeftEum?word=' + $('#search-input').val()),
		success: function(data) {
			$('#lexicon-left').empty();
			if(data.list) {
				if(data.list[0]) {
					$('#first').val(data.list[0].Word);
				}
				var map = {};
				data.list.forEach(function(el, i) {
					if(map[el.Word] == undefined) {
						map[el.Word] = [];
					}
					map[el.Word].push(el.Tyc);
				});
				Object.keys(map).forEach(function(ei, i) {
                    if(isTabFlag){
                        return;
                    }else{
                        $('#lexicon-left').append('<button type="button" class="btn m-t-10 lexicon-head">'+ei+'</button>');
                    }
					var tempNode = $('<div class="lexicon-sons hide"></div>');
					map[ei].forEach(function(ek, j) {
						tempNode.append('<button type="button" class="btn m-t-10 m-l-20 lexicon-left-son">'+ek+'<div class="lexicon-line"></div></button>');
                    });
                    if(isTabFlag){
                        return;
                    }else{
                        $('#lexicon-left').append(tempNode);
                    }
                });
                if(isTabFlag){
                    return;
                }else{
                    $('.lexicon-head').eq(0).trigger('click');
                }
			}
		},
		error: function(data) {
			yunNotyError('接口请求失败!');
		}
	});
}

function getLexiconList(wordTemp) {
	var htmlArr = [];
	var level = 0;
	if(wordTemp === undefined || '') {
		wordTemp = $('#search-input').val();
	}

	$.ajax({
		type: 'get',
		datatype: 'json',
        cache: false,
		url: encodeURI('../../wordDoc/listRightEum?word=' + wordTemp),
		success: function(data) {
			if(data.list && data.list.length > 0) {
				lexiconList = data.list;
				genLexiconItem(data.list, htmlArr, level);
				$('.first-in').removeClass('hide');
				$('.first-out').addClass('hide');
			} else {
				$('.first-in').addClass('hide');
				$('.first-out').html('搜索结果为空');
				$('.first-out').removeClass('hide');
			}
			$('.lexicon-list').empty();
			htmlArr.forEach(function(el) {
				$('.lexicon-list').append(templateWordContentList({
					list: el
				}));
			});
			if(data.father && data.father.length > 0) {
				$('.word-father').remove();
				data.father.forEach(function(el){
					$('#father').after('<div class="word-father"><label>'+el.Word+'</label></div>');
				});
				$('#father-container').removeClass('hide');
				// 如果搜索不出且又有父级
				if(data.list == null) {
					$('.first-in').removeClass('hide');
					$('.first-out').addClass('hide');
					$('#first').val($('#search-input').val());
					$('.lexicon-list').append(templateWordContentList({
						list: [{
							fid: data.father[0].Word,
							cid: $('#search-input').val()
						}]
					}));
					lexiconList = [{
						'Word': $('#search-input').val(),
						'Tyc': $('#search-input').val(),
						'Id': 110,
						'lowestWord': true
					}];
				}
			} else {
				$('#father-container').addClass('hide');
			}
			//生成完图只显示第一个词
			$('[cid]').eq(0).trigger('click');
		},
		error: function(data) {
			yunNotyError('接口请求失败!');
		}
	});
}

function genLexiconItem(listThis, listArr, level) {
	listThis.forEach(function(el, i) {
		if(listArr[level]) {
			listArr[level].push({
				cid: el.Tyc,
				fid: el.Word
			});
		} else {
			listArr[level] = [{
				cid: el.Tyc,
				fid: el.Word
			}];
		}
		if(el.List && el.List.length > 0) {
			genLexiconItem(el.List, listArr, level+1);
		}
	});
}

/*
    工具包
*/ 
var Utils={ 
	/*
        单位
    */ 
	units:'个十百千万@#%亿^&~', 
	/*
        字符
    */ 
	chars:'零一二三四五六七八九', 
	/*
        数字转中文
        @number {Integer} 形如123的数字
        @return {String} 返回转换成的形如 一百二十三 的字符串             
    */ 
	numberToChinese:function(number){ 
		var a=(number+'').split(''),s=[],t=this; 
		if(a.length>12){ 
			throw new Error('too big'); 
		}else{ 
			for(var i=0,j=a.length-1;i<=j;i++){ 
				if(j==1||j==5||j==9){//两位数 处理特殊的 1*  
					if(i==0){ 
						if(a[i]!='1')s.push(t.chars.charAt(a[i])); 
					}else{ 
						s.push(t.chars.charAt(a[i])); 
					} 
				}else{ 
					s.push(t.chars.charAt(a[i])); 
				} 
				if(i!=j){ 
					s.push(t.units.charAt(j-i)); 
				} 
			} 
		} 
		//return s;  
		return s.join('').replace(/零([十百千万亿@#%^&~])/g,function(m,d,b){//优先处理 零百 零千 等  
			b=t.units.indexOf(d); 
			if(b!=-1){ 
				if(d=='亿')return d; 
				if(d=='万')return d; 
				if(a[j-b]=='0')return '零'; 
			} 
			return ''; 
		}).replace(/零+/g,'零').replace(/零([万亿])/g,function(m,b){// 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的  
			return b; 
		}).replace(/亿[万千百]/g,'亿').replace(/[零]$/,'').replace(/[@#%^&~]/g,function(m){ 
			return {'@':'十','#':'百','%':'千','^':'十','&':'百','~':'千'}[m]; 
		}).replace(/([亿万])([一-九])/g,function(m,d,b,c){ 
			c=t.units.indexOf(d); 
			if(c!=-1){ 
				if(a[j-c]=='0')return d+'零'+b; 
			} 
			return m; 
		}); 
	} 
}; 