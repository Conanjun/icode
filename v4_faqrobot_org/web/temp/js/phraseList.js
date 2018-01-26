// JavaScript Document
var isEdit2 = false;//是否是编辑
var $tr = null;
var $tr2 = null;//是否是编辑
// 收起
$('.closeIt').on('click', function() {
    $('.toShow').css('height', 26);
    $('.toHide').removeClass('col-md-10').addClass('col-md-12').css('padding-left', '0');
});
// 展开
$('.openIt').on('click', function() {
    $('.toShow').css('height', 'auto');
    $('.toHide').removeClass('col-md-12').addClass('col-md-10').css('padding-left', '15px');
});
//ajax请求经过的request
var tmpParam='';
function ajaxRequest(url,params,sfun,ffun){
	if(!url) return;
	if(!params) params='';
	$.ajax({
		type:'post',
		datatype:'json',
		cache:false,
		url:encodeURI(url),
		data:params,
		success:
		function(data){
	      if(data.status==0){
	      	if(typeof sfun=='function'){
				sfun(data);
			}
	      }else{
			 if(typeof ffun=='function'){
				ffun(data);
			 }
	      	 yunNoty(data);
	      }
	   }
	})
}
//句式列表
function phraseListTab(pageNo,orderType){
	if(!pageNo)pageNo=1;
	if(!orderType){
		orderType=$('.search_form2').val();
	}else{
		$('.search_form2').val(orderType);
	}
	tmpParam=$('.search_form2').serialize()+'pageSize='+10+'&pageNo='+pageNo+'&orderType='+orderType+'&groupId='+(parseInt($('.search_form').val()) || '')+'&sentence='+$('.searchBy').val()+'&level=1';
	ajaxRequest('../../Sentence/listSentence',tmpParam,function(data){
		dataList(data);
	});
}
function dataList(data){
	if(data.List && data.List.length>0){
		var html = [];
		var tmpList=data.List;
		for(var i=0;i<tmpList.length;i++){
			html += '<tr Sentence="'+tmpList[i].Sentence+'" len="'+tmpList[i].Length+'" id="'+tmpList[i].Id+'" SolutionId="'+tmpList[i].SolutionId+'" Type="'+tmpList[i].Type+'" GroupId="'+tmpList[i].GroupId+'" GroupName="'+tmpList[i].GroupName+'"><td><p class="bold">'+(i+1)+'.<span>'+tmpList[i].Sentence+'</span>&nbsp;&nbsp;<a href="javascript:;" class="editSentenc" title="编辑句式" len="'+tmpList[i].Length+'" id="'+tmpList[i].Id+'"><i class="timeTip glyphicon glyphicon-pencil" title="编辑句式"></i></a><span class="pull-right">'+tmpList[i].CreateTime+'</span></p><p style="clear:both;"><span>来自：'+tmpList[i].UserName+'</span>|<span>分类：'+tmpList[i].GroupName+'</span>|<a href="javascript:;" title="添加普通句型" class="commonSentenc">普通句型('+(tmpList[i].SubCount==null?'0':tmpList[i].SubCount)+')</a>|<a href="javascript:;" title="删除"><i class="del timeTip glyphicon glyphicon-trash" title="删除"></i></a></p></td></tr>';
		}
		$('#phraseDiv').find('tbody').html(html);
		//下面开始处理分页
		var options = {
			currentPage: data.currentPage,
			totalPages: data.totlePages,
			alignment:'right',
			onPageClicked: function (event, originalEvent, type, page) {
				phraseListTab(page,$('.search_form2').val());
				}
			};
		setPage('pageList',options);
        $('.timeTip').tooltip();
	}else{
			$('#phraseDiv').find('tbody').html('<div style=\"text-align:center;\"><i class=\"icon-exclamation-sign\"></i>&nbsp;&nbsp;当前记录为空！</div>');
			$('#pageList').html('');
	}
}
var isEdit = false;
//添加句式问题
$('.add').on('click', function(){
	isEdit = false;
	$('#addSentenceModal').modal('show');

})
//修改句式问题
$('#phraseDiv').on('click','.editSentenc',function(){
	isEdit = true;
	$('#addSentenceModal').modal('show');
	$tr = $(this).parents('tr');

	$('#addSentenceModal .modal-title').text('修改句式');
	$('#addSentenceForm [name=sentence]').val($tr.attr('sentence'));
	$('#addSentenceForm [name=length]').val($tr.attr('len'));
	switch($tr.attr('type')) {
		case '0':
			$('#addSentenceForm [name=type]').eq(0).prop({'checked': true});
			break;
		case '1':
			$('#addSentenceForm [name=type]').eq(1).prop({'checked': true});
			break;
		case '3':
			$('#addSentenceForm [name=type]').eq(2).prop({'checked': true});
			break;
	}
	$('#addSentenceForm [name=id]').val($tr.attr('id'));
	$('#addSentenceForm [name=groupId]').val($tr.attr('groupId'));
	$('#phraseTree').text($tr.attr('GroupName'));
})
//添加句式
function addSentenceFun(){
	if(isEdit) {
		tmpParam=$("#addSentenceForm").serialize();
		ajaxRequest('../../Sentence/editSentence',tmpParam,function(data){
			phraseListTab();
			$('#addSentenceModal').modal('hide');
			yunNoty(data);
		});
	}else {
		tmpParam=$("#addSentenceForm").serialize();
		ajaxRequest('../../Sentence/AddSentence',tmpParam,function(data){
			phraseListTab();
			$('#addSentenceModal').modal('hide');
			yunNoty(data);
		});
	}
}
//添加普通句型
$('#phraseDiv').on('click','.commonSentenc',function(){
	$('#addSentenceCommonModal').modal('show');
	var $this=$(this);
	$('#addSentenceCommonForm input[name=solutionId]').val($this.parent().find('span').html());
	$('#addSentenceCommonForm input[name=level]').val($this.attr('len'));
	//待完善
	$('#addSentenceCommonForm input[name=groupId]').val();
	$('#addSentenceCommonForm input[name=type]').val();
})

//分类树
var setting = {
	data : {
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
	view : {
		selectedMulti : false,
		showIcon: false
	},
	async : {
		enable : true,
		url : "../../classes/listClasses?m=0",
		autoParam : ["id"],
		dataFilter : ajaxDataFilter
	},
	callback : {
		onClick: function (event, treeId, treeNode, clickFlag){
				if(treeNode){
					$('.search_form').val(treeNode.Id);
				   	phraseListTab(1, $('.search_form2').val());
				}
			}
	}
};
//添加时选择的树
var hideSetting = {
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
		url : "../../classes/listClasses?m=0",
		autoParam : ["id"],
		dataFilter : ajaxDataFilter
	},
	callback: {
		beforeClick: zTreeBeforeClickHide,
		onClick:function (event, treeId, treeNode, clickFlag){
			if(treeNode){
				//点击的时候获取当前树的节点信息
				$('#addSentenceForm #phraseTree').html(treeNode.Name);
				$('#addSentenceForm input[name=groupId]').val(treeNode.Id);
				$("#menuContent").fadeOut("fast");
			}
		},
		onExpand: zTreeOnExpand
	}
};
function zTreeBeforeClickHide(treeId, treeNode, clickFlag){
    return !treeNode.isParent;//当是父节点 返回false 不让选取
}
//渲染树结构
function ajaxDataFilter(treeId, parentNode, responseData) {
	if (responseData) {
		responseData.list.push({ Id:0, ParentId:0, Name:"全部分类", open:true});
		return responseData.list;
	}
	return responseData;
};
function zTreeOnExpand(event, treeId, treeNode) {
	//展开的时候滚动条怎么调用？？？？？？？？？
};
function onBodyDown(event) {
	if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
		hideMenu();
	}
}
function hideMenu() {
	$("#menuContent").fadeOut("fast");
	$("body").unbind("mousedown", onBodyDown);
}
function showMenu() {
	var cityObj = $("#queSel");
	var cityOffset = $("#queSel").offset();
	$("#menuContent").slideDown("fast");
	$("body").bind("mousedown", onBodyDown);
}
//添加模态框出现加载分类树
$('#addSentenceModal').on('show.bs.modal', function(){
	$.fn.zTree.init($("#classTree_phrase"), hideSetting, []);
});
/* ************ */
//导入句式
var uploader = WebUploader.create({
    server: '../../Sentence/importSentence',
    swf: '../common/js/Uploader.swf',
    pick: $('.import'),
    fileNumLimit: 1,
    duplicate: true,
    auto: true,
});
//加入队列之前
uploader.on( 'beforeFileQueued', function( file ) {
    if(!file.size) {
        Base.gritter('文件大小为空！', false);
    }
});
//获取服务端返回的数据
uploader.on( 'uploadAccept', function( object, data ) {
    if(data.status) {
        Base.gritter(data.message, false);
    }else {
        Base.gritter(data.message, true);
        phraseListTab(1,$('.search_form2').val())
    }
});
//上传开始
uploader.on( 'startUpload', function( file, percentage ) {
    $('.progress-striped').show();
});
//上传进度
uploader.on( 'uploadProgress', function( file, percentage ) {
    $('.progress-bar').css({'width': percentage*100 +'%'});
});
//限制单次上传数量
uploader.on( 'uploadFinished', function( object, data ) {
    $('.progress-bar').css({'width': 0});
    $('.progress-striped').hide();
    uploader.reset();
});

//导出Excel
$('.export').on('click', function() {
	document.location.href = '../../Sentence/exPortSentence?excelFlag=1';
});

//排序
$('.sort1').on('click', function() {//默认排序
   $('.sortWord').html($(this).text()+'&nbsp;' +'<span class="caret"></span>');
   $('.search_form2').val(4);
   phraseListTab(1,$('.search_form2').val())
});
$('.sort2').on('click', function() {//句式长度正序
   $('.sortWord').html($(this).text()+'&nbsp;' +'<span class="caret"></span>');
   $('.search_form2').val(100);
   phraseListTab(1,$('.search_form2').val())
});
$('.sort3').on('click', function() {//句式长度倒序
   $('.sortWord').html($(this).text()+'&nbsp;' +'<span class="caret"></span>');
   $('.search_form2').val(101);
   phraseListTab(1,$('.search_form2').val())
});
$('.sort4').on('click', function() {//时间倒序
   $('.sortWord').html($(this).text()+'&nbsp;' +'<span class="caret"></span>');
   $('.search_form2').val(4);
   phraseListTab(1,$('.search_form2').val())
});
$('.sort5').on('click', function() {//时间正序
   $('.sortWord').html($(this).text()+'&nbsp;' +'<span class="caret"></span>');
   $('.search_form2').val(3);
   phraseListTab(1,$('.search_form2').val())
});

var pageSize2 = 10,
    pageNo2 = 1,
    id2 = 0;

//删除
$('body').on('click', '.del', function() {
  var self = this;
  $(self).adcCreator(function() {
    somedel(self);
  });
});
function somedel(obj) {
	var $tr = $(obj).parents('tr');
	id2 = $tr.attr('id');
	Base.request({
		url: 'Sentence/delSentence',
		params: {
			id: id2,
		},
		callback: function(data) {
	        if(data.status) {
	            Base.gritter(data.message, false);
	        }else {
	            Base.gritter(data.message, true);
   				phraseListTab(1,$('.search_form2').val())
	        }
	    },
	});
}

$('body').on('click', '.commonSentenc', function() {
	var $tr = $(this).parents('tr');
	id2 = $tr.attr('id');
});


//普通句型列表
$('#profile-tab').on('click', function() {
	pageNo2 = 1;
	initSrc2();
});

function initSrc2() {
    $('#ttt2').tableAjaxLoader2(3);
    Base.request({
        url: 'Sentence/findSentenceById',
        params: {
            pageSize: pageSize2,
            pageNo: pageNo2,
            id: id2,
        },
        callback: function(data) {
            if(data.status) {
                Base.gritter(data.message, false);
            }else {
                var html ='';
                if(data.List[0]) {
                    for(var i=0; i<data.List.length; i++) {
                        html += '<tr Id="'+ data.List[i].Id +'" SolutionId="'+ data.List[i].SolutionId +'" Sentence="'+ data.List[i].Sentence +'" Length="'+ data.List[i].Length +'" TestQue="'+ (data.List[i].TestQue || '') +'" TestRes="'+ (data.List[i].TestRes || '') +'"><td><span class="simQue">'+ data.List[i].Sentence +'</span></td><td style="white-space:nowrap;"><span>'+ data.List[i].CreateTime +'</span></td><td><a class=""><span class="editWord timeTip glyphicon glyphicon-pencil" title="编辑" style="cursor: pointer;"></span></a><a class="delWord"><span class="timeTip glyphicon glyphicon-trash" title="删除" style="cursor: pointer; margin-left: 5px;"></span></a></td></tr>';
                    }

                    var options = {
                        currentPage: data.currentPage,
                        totalPages: data.totlePages ? data.totlePages : 1,
                        alignment: 'right',
                        onPageClicked: function(event, originalEvent, type, page) {
                            pageNo2 = page;
                            initSrc2();
                        }
                    };
                    $('#itemContainer2').bootstrapPaginator(options);
                }else {
                    html += '<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
                    $('#itemContainer2').empty();
                }
                $('.tbody2').empty().append(html);
                $('.timeTip').tooltip();


            }
        },
    });
}



//editWord timeTip glyphicon glyphicon-pencil" title="编辑"></span></a><a class="delWord">

//编辑普通句型
$('body').on('click', '.editWord', function() {
	isEdit2 = true;
	$('#home-tab').text('修改普通句型');
	$tr2 = $(this).parents('tr');

	$('#home-tab').tab('show');


	$('[name=sentence]').val($tr2.attr('sentence'));
	$('[name=length]').val($tr2.attr('length'));
	$('[name=testQue]').val($tr2.attr('testQue'));
	$('[name=testRes]').val($tr2.attr('testRes'));
	$('[name=solutionId]').val($tr2.attr('solutionId'));


});

//显示普通句型
$('body').on('click', '.commonSentenc', function() {
	$tr = $(this).parents('tr');
});

//
$('#addSentenceCommonModal').on('hidden.bs.modal', function () {
	isEdit2 = false;
});
//确认添加
$('.addWord').on('click', function() {
	if(isEdit2) {//修改
		$('[name=level]').val(0);
		$('[name=solutionId]').val($tr.attr('solutionId'));
		$('[name=groupId]').val($tr.attr('groupId'));
        $('[name=type]').val($tr.attr('type'));
		$('[name=testQue]').val(1);
		$('[name=testRes]').val(1);
		Base.request({
			url: 'Sentence/editSentence',
			params: {
				id: $tr2.attr('id'),
			},
			$formObj: $('#addSentenceCommonForm'),
			callback: function(data) {
		        if(data.status) {
		            Base.gritter(data.message, false);
		        }else {
		            Base.gritter(data.message, true);
		            $('#addSentenceCommonModal').modal('hide')
	   				phraseListTab(1);
        			$('[name=sentence]').val('');
        			$('[name=length]').val('');
		        }
		    },
		});
	}else {//添加
        $('[name=level]').val(0);
        $('[name=solutionId]').val($tr.attr('solutionId'));
        $('[name=groupId]').val($tr.attr('groupId'));
        $('[name=type]').val($tr.attr('type'));
		Base.request({
			url: 'Sentence/AddSentence',
			params: {
			},
			$formObj: $('#addSentenceCommonForm'),
			callback: function(data) {
		        if(data.status) {
		            Base.gritter(data.message, false);
		        }else {
		            Base.gritter(data.message, true);
		            $('#addSentenceCommonModal').modal('hide')
	   				phraseListTab(1);
        			$('[name=sentence]').val('');
        			$('[name=length]').val('');
		        }
		    },
		});
	}
});

//删除普通句型
$('body').on('click', '.delWord', function() {
	var $tr = $(this).parents('tr');

	Base.request({
		url: 'Sentence/delSentence',
		params: {
			id: $tr.attr('id'),
		},
		callback: function(data) {
	        if(data.status) {
				Base.gritter(data.message, false);
	        }else {
	            Base.gritter(data.message, true);
				initSrc2();
				phraseListTab(1);
	        }
	    },
	});
});

//下载
$('.down').on('click', function() {
	document.location.href = '../../wordDocExcel/exportTemplate?mode=1';
});

//搜索
$('.btnSearch').on('click', function() {
	Base.request({
		url: 'Sentence/listSentence',
		params: {
			level: 1,
			groupId: $('.search_form2').val(),
			sentence: $('.searchBy').val(),
		},
		callback: function(data) {
	        if(data.status) {
	            Base.gritter(data.message, false);
	        }else {
	            //Base.gritter(data.message, true);
   				phraseListTab(1, $('.search_form2').val());
	        }
	    },
	});
});

//ENTER
$(document).on('keyup', function(e) {
    var $activeEl = $(document.activeElement);

    if($activeEl.is('.searchBy') && (e.keyCode==13||e.keyCode==108)) {
        $('.btnSearch').trigger('click');
    }
});
