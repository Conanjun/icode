var TabLexList = null;
function UrlSearch(){
	var name,value;
	var str=location.href; //取得整个地址栏
	var num=str.indexOf("?")
	str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]

	var arr=str.split("&"); //各个参数放到数组里
	for(var i=0;i < arr.length;i++){
		num=arr[i].indexOf("=");
		if(num>0){
			name=arr[i].substring(0,num);
			value=arr[i].substr(num+1);
			this[name]=value;
		}
	}
}
var Request=new UrlSearch(); //实例化
var searchtempNum = Request.text;
$(document).ready(function() {
	App.init();
	iframeTab.init({iframeBox: ''});
	$('#lexicon-left').slimScroll({
		height: $(window).height()+ 'px'
    });
    if(searchtempNum == undefined || null || ''){
		searchtempNum = '';
    }
	$('#search-input').val(decodeURI(searchtempNum));

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
		if (sessionStorage) {
            sessionStorage.setItem("lx_list", JSON.stringify(TabLexList));
		}
		ifbOpenWindowInNewTab('/web/knowledge/LexiconEdit.html?word='+$('#first').val(), '词库');
	});

	$(document).on('click', '#addnewword', function(){
		ifbOpenWindowInNewTab('/web/knowledge/LexiconEdit.html', '词库');
	});

	$(document).undelegate('#search','click').delegate('#search','click', function(){
		$('.first-in').removeClass('hide');
		$('.first-out').addClass('hide');
		getTabLex($('#search-input').val());
		initSrc($('#search-input').val(),1);
	});
	$('#search').trigger('click');
	$(document).on('keyup', '#search-input', function(e){
		if(e.keyCode == 13) {
			$('#search').trigger('click');
		}
	});
	
	$(document).on('click', '.lexicon-head', function(e) {
		$('.lexicon-sons').addClass('hide');
		$(this).next().removeClass('hide');
		$('.lexicon-head-focus').removeClass('lexicon-head-focus');
		$(this).addClass('lexicon-head-focus');
		//initSrc();
	});
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
	$(obj).parents('.word-content').find('.word-selected').html($(obj).find('.w').text());
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
  	
	//getTabLex(tempNum);
function getTabLex(word) {
	$.ajax({
		type: 'get',
		datatype: 'json',
		cache: false,
		url: encodeURI('../../wordDoc/listLeftQueryEum'),
		data:{'word':word},
		success: function(data) {
			$('#lexicon-left').empty();
			if(data.conditionList) {
				var map = {};
				var html = '';
				data.conditionList.forEach(function(el, i) {
					if(map[el.Word] == undefined) {
						map[el.Word] = [];
					}
					map[el.Word].push(el.Tyc);
				});
				Object.keys(map).forEach(function(ei, i) {
					$('#lexicon-left').append('<button type="button" class="btn btn-white m-t-10 parentNode lexicon-head" style="display:block;z-index:2;position:relative;">'+ei+'</button>');
					var tempNode = $('<div class="lexicon-sons hide"></div>');
					map[ei].forEach(function(ek, j) {
						tempNode.append('<button type="button" class="btn btn-white m-t-10 m-l-20 lexicon-left-son">'+ek+'<div class="lexicon-line"></div></button>');
					});
					$('#lexicon-left').append(tempNode);
                });
                $('.lexicon-head').eq(0).trigger('click');
			}
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
	
	var idStr = '', //是否传id
		mode = 8,
		queryStr = '',
        pageNo = 1, //当前页
        pageSize = 15; //每页数量
	//检测synonym的位数 1-10
      jQuery.validator.addMethod("synonymNumber",
        function(value, element) {
          var pros = value.split(/,|，/);
          for (var i in pros) {
            if (pros[i].length < 1 || pros[i].length > 10) {
              return false;
            }
          }
          return true;
        }, "单个同义词的长度应在1-10位之间！");
		
      //添加
      $("#synonym").addWordCount(100);
      $('#add_form').validate({
        rules: {
          tablex: {
            required: true,
            synonymNumber: true
          }
        },
        messages: {
          tablex: {
            required: "请输入同义词！",
            synonymNumber: '单个同义词的长度应在1-10位之间！'
          }
        },
        submitHandler:addSynonym
      });
  	
    function addSynonym() {
      $.ajax({
        url: '../../wordDoc/editWordDocInfo',
        data: {
        	'word':$("#wordSy").val(),
            'tyc': $('#synonym').val().replace(/，/g, ','),
            'mode':2
        },
        success: function(data) {

					/**
					 * taskid=623    同义词添加修改返回信息错误   2018/1/10
					 * 原因：返回参数改变；
					 * 修改：变更返回参数
					 */
						if(data.status===1){
							yunNotyError(data.message, false);
						}else{
							if(data.messageError){
								yunNotyError(data.messageError, false);
							};
							if(data.messageSuccess){
								var json={
									status:0,
									message:data.messageSuccess
								}
								yunNoty(json)
								$('#addModal').modal('hide');
								initSrc();
							}
						}
        }
      });
    }
    $("body").delegate('.parentNode','click',function(){
		var text = $(this).text();
		initSrc(text,1);
	});
	function initSrc(queryStr,pageNo) {
        $('#synonymList').tableAjaxLoader2(7);
        $.ajax({
          url: '../../wordDoc/list',
          data: {
            mode: 7,
            pageNo: pageNo,
            pageSize: pageSize,
            orderType:1,
            queryStr:queryStr,
            updateYN:0
        },
          success: function(data) {
              var html = '';
              if (data.list!="") {
                for (var i = 0; i < data.list.length; i++) {
                  html += '<tr Id="' + (data.list[i].Id || "") + '">'+
                  '<td>' +(data.list[i].Word || "") +'</td>'+
                  '<td>'+(data.list[i].Tyc || "") +'</td>'+
                  '<td><a href="" class="addSy" data-num="0" data-toggle="modal" data-target="#addModal">添加</a></td></tr>';
                }
				$('#synonymList tbody').empty().append(html);
				//点击添加同义词
				$("#synonymList").delegate('.addSy','click',function(){
					$('#synonym').val('');
					var wordSy = $(this).parents('tr').find('td:eq(0)').text();
					var tyc = $(this).parents('tr').find('td:eq(1)').text();
					$("#wordSy").val(wordSy);
				});
                var options = {
                  data: [data, 'list', 'total'],
                  currentPage: data.currentPage,
                  totalPages: data.totlePages ? data.totlePages :1,
                  alignment: 'right',
                  onPageClicked: function(event, originalEvent, type, page) {
                    pageNo = page;
                    initSrc(queryStr,pageNo);
                  }
                };
                $('#itemContainer').bootstrapPaginator(options);

              } else {
					  html += '<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
					  $('#itemContainer').empty();
              }
              $('tbody').empty().append(html);
          }
        });
      }

