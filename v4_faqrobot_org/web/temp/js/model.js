// JavaScript Document
var modelList = [];
//添加表单
function addFrom(){
	$.ajax({
	type:'post',
	datatype:'json',
	cache:false,//不从缓存中去数据
	url:encodeURI('../../DisplayModel/doSave'),
	data:$("#sub_Form").serialize(),
	success:
	function(data){
		if(data.status==0){
			yunNoty(data);
			formList();
			$('#addfromModal').modal('hide');
			$('#sub_Form')[0].reset();
		 }else{
			yunNoty(data);
		}
	}
	});
}
//分布式提交表单列表
function formList(pageNo){
	if(!pageNo)pageNo=1;
	$('#formTabList').tableAjaxLoader2(8);
	$.ajax({
	type:'post',
	datatype:'json',
	cache:false,//不从缓存中去数据
	url:encodeURI('../../DisplayModel/list?pageSize='+15+'&pageNo='+pageNo),
	success:
	function(data){
		if(data.status==0){
			if(data.list.length>0){
        modelList = data.list;
				var temp=[];
				for(var i=0;i<data.list.length;i++){
					temp.push('<tr>');
          temp.push('<td>'+ (data.list[i].Name||'') +'</td>');
          temp.push('<td>'+ (data.list[i].Info||'') +'</td>');
          temp.push('<td>'+ (data.list[i].TopWords||'') +'</td>');
          temp.push('<td>'+ (data.list[i].MaxShowItemCount||'') +'</td>');
					if(data.list[i].OutSelect===0){
            temp.push('<td>展示</td>');
					}else if(data.list[i].OutSelect===1){
            temp.push('<td>不展示</td>');
					}else if(data.list[i].OutSelect===2){
            temp.push('<td>有值展示，无值不展示</td>');
					}
          temp.push('<td>'+ (data.list[i].BeforeWords||'') +'</td>');
          temp.push('<td>'+ (data.list[i].AfterWords||'') +'</td>');
					temp.push('<td><a href="modelChildren.html?id='+data.list[i].Id+'" title="数据模型项"><i class="glyphicon glyphicon-book"></i></a>&nbsp;&nbsp;<a href="javascript:;" rel="'+data.list[i].Id+'" title="编辑" onclick="editForm(this);"><i class="glyphicon glyphicon-pencil"></i></a>&nbsp;&nbsp;<a href="javascript:;" class="delfrom" rel="'+data.list[i].Id+'" title="删除"><i class="glyphicon glyphicon-trash"></i></a></td>');
					temp.push('</tr>');
				}
				$('#formTabList').find('tbody').html(temp.join(''));
				var options = {
          currentPage: data.currentPage,
          totalPages: data.totlePages,
					alignment:'right',
					onPageClicked: function (event, originalEvent, type, page) {
						formList(page);
					}
        };
        setPage('formpage',options);
			}else{
				$('#formTabList').find('tbody').html('<tr><td colspan="8" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>当前纪录为空！</td></tr>');
				$('#formpage').html('')
			}
		 }else{
			yunNoty(data);
		}
	}
	});
}
//删除分布式表单
$('#formTabList').on('click', '.delfrom', function(){
	var self = this;
	$(self).adcCreator(function() {
		delById(self,'../../DisplayModel/doDelById',formList,'formpage');
	});
});
//编辑分布式表单
function editForm(obj){
  var i = $(obj).parents('tr').index();
  $('#edit_Form input[name=id]').val(modelList[i].Id);
  $('#edit_Form input[name=name]').val(modelList[i].Name);
  $('#edit_Form input[name=info]').val(modelList[i].Info);
  $('#edit_Form textarea[name=topWords]').val(modelList[i].TopWords);
  $('#edit_Form input[name=maxShowItemCount]').val(modelList[i].MaxShowItemCount);
  $('#edit_Form input[name=beforeWords]').val(modelList[i].BeforeWords);
  $('#edit_Form input[name=afterWords]').val(modelList[i].AfterWords);
  $('#edit_Form input[name=outSelect]').eq(modelList[i].OutSelect).attr({'checked': 'checked'});
  $('#editfromModal').modal('show');
}
function editFrom(){
	$.ajax({
	type:'post',
	datatype:'json',
	cache:false,//不从缓存中去数据
	url:encodeURI('../../DisplayModel/doModify'),
	data:$("#edit_Form").serialize(),
	success:
	function(data){
		if(data.status==0){
			yunNoty(data);
			$('#editfromModal').modal('hide');
			$('#edit_Form')[0].reset();
			formList();
		 }else{
			yunNoty(data);
		}
	}
	});
}
var modelChildrenList = [];
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
var modelId=getUrlParam('id');
//添加表单项
function addfromChild(){
	var perAdd = $('#perAdd').val();
	var patt1 = new RegExp('{接口数据}');
	if(perAdd == '{接口数据}' || !patt1.test(perAdd)){
		customReply = '';
	}else{
		customReply = perAdd;
	}
	$.ajax({
	type:'post',
	datatype:'json',
	cache:false,//不从缓存中去数据
	url:encodeURI('../../DisplayModelItem/doSave?modelId='+modelId+'&customReply='+customReply),
	data:$("#addformChild").serialize(),
	success:
	function(data){
		if(data.status==0){
			yunNoty(data);
			$('#addfromChildModal').modal('hide');
			$("#addformChild")[0].reset();
			fromChild(1);
		}else{
			yunNoty(data);
		}
	}
	});
}
//渲染表单项
function fromChild(pageNo){
	if(!pageNo)pageNo=1;
	$('#formChildTabList').tableAjaxLoader2(8);
	$.ajax({
	type:'post',
	datatype:'json',
	cache:false,//不从缓存中去数据
	url:encodeURI('../../DisplayModelItem/findByFormId?pageSize='+15+'&pageNo='+pageNo+'&modelId='+modelId),
	success:
	function(data){
		if(data.status==0){
			if(data.DisplayModelItem && data.DisplayModelItem.length>0){
        modelChildrenList = data.DisplayModelItem;
        data.list = data.DisplayModelItem;
				var temp=[];
				for(var i=0;i<data.list.length;i++){
					temp.push('<tr>');
          temp.push('<td>'+ (data.list[i].Code||'') +'</td>');
          temp.push('<td>'+ (data.list[i].CommandWords||'') +'</td>');
          temp.push('<td>'+ (data.list[i].ShowWords||'') +'</td>');
          temp.push('<td>'+ (data.list[i].OrderId||'') +'</td>');
					if(data.list[i].ShowType===0){
            temp.push('<td>展示</td>');
					}else if(data.list[i].ShowType===1){
            temp.push('<td>不展示</td>');
					}else if(data.list[i].ShowType===2){
            temp.push('<td>有值展示，无值不展示</td>');
					}
					if(data.list[i].AnswerType===0){
            temp.push('<td>固定回复</td>');
					}else if(data.list[i].AnswerType===1){
            temp.push('<td>接口数据</td>');
					}
          temp.push('<td>'+ (data.list[i].Reply||'') +'</td>');
					temp.push('<td><a href="javascript:;" rel="'+data.list[i].Id+'" title="编辑" onclick="editformChild(this);"><i class="glyphicon glyphicon-pencil"></i></a>&nbsp;&nbsp;<a href="javascript:;" class="delfromChild" rel="'+data.list[i].Id+'" title="删除"><i class="glyphicon glyphicon-trash"></i></a></td>');
					temp.push('</tr>');
				}
				$('#formChildTabList').find('tbody').html(temp.join(''));
				var options = {
          currentPage: data.currentPage,
          totalPages: data.totlePages,
					alignment:'right',
					onPageClicked: function (event, originalEvent, type, page) {
						fromChild(page);
					}
        };
        setPage('formChildpage',options);
			}else{
				$('#formChildTabList').find('tbody').html('<tr><td colspan="8" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>当前纪录为空！</td></tr>');
				$('#formChildpage').html('')
			}
		 }else{
			yunNoty(data);
		}
	}
	});
}
//修改表单项
function editformChild(obj){
  var i = $(obj).parents('tr').index();
  $('#editformChild input[name=id]').val(modelChildrenList[i].Id);
  $('#editformChild input[name=code]').val(modelChildrenList[i].Code);
  $('#editformChild input[name=commandWords]').val(modelChildrenList[i].CommandWords);
  $('#editformChild input[name=showWords]').val(modelChildrenList[i].ShowWords);
  $('#editformChild input[name=orderId]').val(modelChildrenList[i].OrderId);
  $('#editformChild input[name=showType]').eq(modelChildrenList[i].ShowType).attr({'checked': 'checked'});
  $('#editformChild input[name=answerType]').eq(modelChildrenList[i].AnswerType).attr({'checked': 'checked'});
  if(modelChildrenList[i].CustomReply == ''){
  	modelChildrenList[i].CustomReply = '{接口数据}';
  }
  $('#editformChild #perEdit').val(modelChildrenList[i].CustomReply);
  $('#editformChild input[name=reply]').val(modelChildrenList[i].Reply);
    if(modelChildrenList[i].AnswerType == 0) {
      $('#relEdit').html('固定回复内容');
      $('#perReplyEdit').css('display','none');
    } else {
      $('#relEdit').html('缺省回复内容');
      $('#perReplyEdit').css('display','block');
    }
  $('#editfromChildModal').modal('show');
}
//修改表单项
function editfromChild(){
	var perEdit = $('#perEdit').val();
	var patt1 = new RegExp('{接口数据}');
	if(perEdit == '{接口数据}' || !patt1.test(perEdit)){
		customReply = '';
	}else{
		customReply = perEdit;
	}
	$.ajax({
	type:'post',
	datatype:'json',
	cache:false,//不从缓存中去数据
	url:encodeURI('../../DisplayModelItem/doModify?modelId='+modelId+'&customReply='+customReply),
	data:$("#editformChild").serialize(),
	success:
	function(data){
		if(data.status==0){
			yunNoty(data);
			$('#editfromChildModal').modal('hide');
			$("#editformChild")[0].reset();
			fromChild(1);
		 }else{
			yunNoty(data);
		}
	}
	});
}
//删除表单项
$('#formChildTabList').on('click', '.delfromChild', function(){
	var self = this;
	$(self).adcCreator(function() {
		delById(self,'../../DisplayModelItem/delById',function(){fromChild(1);},'formChildpage');
	});
});
