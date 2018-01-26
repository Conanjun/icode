// JavaScript Document
//提示配置项
 var opts = {
	"closeButton": true,
	"debug": false,
	"positionClass": "toast-top-right toast-success",
	"toastClass": "black",
	"onclick": null,
	"showDuration": "100",
	"hideDuration": "1000",
	"timeOut": "5000",
	"extendedTimeOut": "1000",
	"showEasing": "swing",
	"hideEasing": "linear",
	"showMethod": "fadeIn",
	"hideMethod": "fadeOut"
};
var s_tspan=10;//主动请求的时间间隔
var s_state=0;//聊天的状态
var baseUrl= 'http://127.0.0.1:10098/robot/';
	baseUrl= '../';
var s_q_url="";//问题的url
var s_a_url="";//获取相关问题答案的url地址
var s_sysNum="";
var hkey = "Enter";//hotKey
var t_count=0;//运行的代理的次数，测试用
//$.ajaxTimeout(5000);
var dt;//定时器
var rname='FAQRobot';

var option={
	basePath:'../../servlet/',
	chatContDiv:'left_content',
	inputMagOldvalue:'请在这里用一句简单的话提问',
	sendBtn:'sendBtn',
	inputMsgArea:'message',
	clearScreen:'clearScreen',
	kfUrl:'images/logo.png',  //客服图标
	khUrl:'images/ask.png', //客户图标
	sugQuestionDiv:'relateList',
	wordremain:'wordremain'
};

function FrameLoad(){
	var d_left_content=document.getElementById("left_content");
	var iyunwen_content=document.getElementById("iyunwen_row");
	var winHeight = getBodyHeight();
	if(winHeight<700){
		winHeight=700;
	}
    d_left_content.style.height = winHeight - 230 + "px";
	iyunwen_content.style.height = winHeight - 96 + "px";
}

function getBodyHeight() {
	var height = (window.innerHeight || document.documentElement.clientHeight) || document.body.clientHeight;
	return height;
}
window.onresize=function(){
	FrameLoad();
}

//收缩左右
$('#classLeft').click(function(){
	if($(this).hasClass('cancelLeft')){
		$(this).removeClass('cancelLeft');
		$('#classLeft').css('background-image','url(images/left.png)');
		$('.treeDiv').addClass('col-sm-2').show();
		if($('#classright').hasClass('cancelRight')){
			$('.contentDiv').removeClass('col-sm-12').addClass('col-sm-10');
		}else{
			$('.contentDiv').removeClass('col-sm-10').addClass('col-sm-8');
		}
	}else{
		$(this).addClass('cancelLeft');
		$('#classLeft').css('background-image','url(images/right.png)');
		$('.treeDiv').removeClass('col-sm-2').hide();
		if($('#classright').hasClass('cancelRight')){
			$('.contentDiv').removeClass('col-sm-10').addClass('col-sm-12');
		}else{
			$('.contentDiv').removeClass('col-sm-8').addClass('col-sm-10');
		}
	}
})


$('#classright').click(function(){
	if($(this).hasClass('cancelRight')){
		$(this).removeClass('cancelRight');
		$('#classright').css('background-image','url(images/right.png)');
		$('.relateDiv').addClass('col-sm-2').show();
		if($('#classLeft').hasClass('cancelLeft')){
			$('.contentDiv').removeClass('col-sm-12').addClass('col-sm-10');
		}else{
			$('.contentDiv').removeClass('col-sm-10').addClass('col-sm-8');
		}
	}else{
		$(this).addClass('cancelRight');
		$('#classright').css('background-image','url(images/left.png)');
		$('.relateDiv').removeClass('col-sm-2').hide();
		if($('#classLeft').hasClass('cancelLeft')){
			$('.contentDiv').removeClass('col-sm-10').addClass('col-sm-12');
		}else{
			$('.contentDiv').removeClass('col-sm-8').addClass('col-sm-10');
		}
	}
})

//分类树
//初始化ztree
  var setting = {
		data : {
			simpleData : {
				enable : true,
				/*idKey : "Id",
				pIdKey : "ParentId",
				rootPId : 0*/
			},
			/*key : {
				name : "Name"
			}*/
		},
		view : {
			selectedMulti : false,
			showIcon: false
		},
		/*async : {
			enable : true,
			url : "../../classes/listClasses?m=0",
			autoParam : ["id"],
			dataFilter : ajaxDataFilter
		},*/
		callback : {
			onClick: function (event, treeId, treeNode, clickFlag){
					if(treeNode){
						treeObj = $.fn.zTree.getZTreeObj(treeId);
						var array = treeObj.getNodesByFilter(filterP, false, treeNode);
						if(array.length > 0) {
							groupId = '';
							for(var i in array) {
								groupId += (array[i].id-1) + ',';
							}
						} else {
							groupId = treeNode.id-1;
						}
						FrameLoad();
						$('.nav-tabs li').eq(0).addClass('active').siblings().removeClass('active');
						$('.tab-content .tab-pane').eq(0).addClass('active').siblings().removeClass('active');
						listPanpect(1,treeNode.Id);
					}
			},
			beforeClick: zTreeBeforeClick
		}

	  };

	var treeObj = null,
		groupId = '';
	//获取问题分类
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,
		url:encodeURI('../../classes/listClasses?m=0'),
		success:
		function(data){
  			if(data.status) {
  				Base.gritter(data.message, false);
  			}else {
  				var html ='';
  				if(data.list[0]) {
  					var formatData = [],
  						len = data.list.length;
  					//var j = 0;
  					for(var key in data.list) {
  						formatData[key] = {};
  						formatData[key]['name'] = data.list[key]['Name'];
  						formatData[key]['pId'] = data.list[key]['ParentId']+1;
  						formatData[key]['id'] = data.list[key]['Id']+1;
  						// if(data.list[key].Isleaf == 1) {
  							// j++;
  						// }
  					}
  					//console.log(j)

  					formatData[len] = {};
  					formatData[len]['name'] = '全部分类';
  					formatData[len]['pId'] = 0;
  					formatData[len]['id'] = 1;
  					formatData[len]['open'] = true;

  					$.fn.zTree.init($("#treeClasses"), setting, formatData);
  					treeObj = $.fn.zTree.getZTreeObj("treeClasses");
                    var array = treeObj.getNodesByFilter(filterP);
                    if(array.length > 0) {
                        groupId = '';
                        for(var i in array) {
                            groupId += (array[i].id-1) + ',';
                        }
                    } else {
                        groupId = treeNode.id-1;
                    }
                    pageNo=1;
					listPanpect();
  				}else {

  				}
  			}
	   	}
	})

	function filterP(node) {
		return (node.isParent == false);
	}

	  function zTreeBeforeClick(treeId, treeNode, clickFlag) {
			if(treeNode.isParent==true){
				$('#searchQue input[name=isLeaf]').val(0);
			}else{
				$('#searchQue input[name=isLeaf]').val(1);
			}
	  };

	//格式化一步获取的json数据
	function ajaxDataFilter(treeId, parentNode, responseData) {
		if (responseData) {
			responseData.list.push({ Id:0, ParentId:0, Name:"全部分类", open:true});
			return responseData.list;
		}
		return responseData;
	};

	function showTree(treeId,flag){
		var rolezTree = $.fn.zTree.getZTreeObj(treeId);
		rolezTree.expandAll(flag);
		return false;
	}

	$('#searchQue input').keydown(function(event){
		if(event.keyCode==13){
			listPanpect();
		 	return false;
		}
	})

	//搜索的内容

	$('#selectAns').click(function(){
		$('#searchBtnCon').html(' 答案 <span class="caret"></span>');
		$('#searchQue .conType').attr('name','answer');
    $('#searchQue [name=queryType]').val(2);
	})
	$('#selectQue').click(function(){
		$('#searchBtnCon').html(' 问题 <span class="caret"></span>');
		$('#searchQue .conType').attr('name','question');
    $('#searchQue [name=queryType]').val(1);
	})

	//问答总览
	function listPanpect(pageNo/*,groupId*/){
		if(!pageNo)pageNo=1;
		//if(!groupId) groupId=0;
		$('#home').find('ol').html('<li style="text-align:center;"><img src="../../images/loading.gif"></li>');
			$.ajax({
			type:'get',
			datatype:'json',
			cache:false,
			url:encodeURI('../../question/getQueList?pageSize='+15+'&pageNo='+pageNo+'&groupId='+groupId),
			data:$('#searchQue').serialize(),
			success:
			function(data){
			  if(data.status==0){
				$('.titleNum').html(data.total);
				if(data.questionList.length>0){
					var html = [];
					for(var i=0;i<data.questionList.length;i++){
						$('.pageNum').html(i+1);
						html.push('<li>');
						html.push('<p><span style="font-weight:bold;">'+(i+1)+'.&nbsp;问题:'+data.questionList[i].Question+'</span><span class="pull-right">'+data.questionList[i].AddTime+'</span></p>');
						if(data.questionList[i].ListAnswer){
							var tmpansList=data.questionList[i].ListAnswer;
							if(tmpansList.length>1){
								for(var j=0;j<tmpansList.length;j++){
									html.push('<div class="conDiv"><span class="label label-primary">答案'+(j+1)+'：</span>'+tmpansList[j].Answer+'</div>');
								}
							}else{
								html.push('<div class="conDiv"><span class="label label-primary">答案：</span>'+tmpansList[0].Answer+'</div>');
							}
						}else{
							html.push('<div class="conDiv">答案:无答案</div>');
						}
						html.push('<p style="margin-bottom:0px;">来自:'+data.questionList[i].UserName+'&nbsp;&nbsp;|&nbsp;&nbsp;分类:'+data.questionList[i].GroupName+'&nbsp;&nbsp;|&nbsp;&nbsp;');
						var sNUm=data.questionList[i].SimilarNum==null?0:data.questionList[i].SimilarNum;
						html.push('相似问法:<span style="color:#2873b7">'+sNUm+'</span>个&nbsp;&nbsp;|&nbsp;&nbsp;浏览:<span style="color:#2873b7">'+data.questionList[i].Hits+'</span>次</p>');
						html.push('</li>');
					}
					$('#home').find('ol').html(html.join(''));
					//下面开始处理分页
					var options = {
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						alignment:'right',
						onPageClicked: function (event, originalEvent, type, page) {
							listPanpect(page,groupId);
							}
						};
					$('#pageList').bootstrapPaginator(options);
					$('#showPageNum').show();
				}else{
					$('#home').find('ol').html('<li style="text-align:center;">当前记录为空！</li>');
					$('#pageList').html('');
					$('#showPageNum').hide();
				}
			  }else if(data.status==-1){
					 toastr.error(data.message, opts);
					 location.href="../../../login.html";
			  }else{
				  toastr.error(data.message, opts);
			  }
		   }
		})
	}
