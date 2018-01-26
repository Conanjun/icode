$(function(){
	//标签点击
	$('#label').on('click','.item',function(e){
		if(!$(e.target).is('.itemSpan')){
			$('#labelQuestion').html('');
			$('#labelPageList').html('');
			var id=$(this).attr('id');  //当前标签id
			$('.item').removeClass('labelCheck');
			$(this).addClass('labelCheck');
			$('.addlabelQuestion').attr('labelId',id);    //给问题打标签按钮附加当前选中的标签id
			$('#delAll').attr('labelId',id);
			questionList(1,id);
		}
	});
	var labelList=function(){     //已有标签列表
		$.post('../../label/findAllLabels',function(data){
			if(data.status==0){
				var renderTo=$('#labelTxt');
				$('#labelTxt').html('');
				if(data.list.length>0){
					$(data.list).each(function(i,t){
						var item=$('<div class=\'item\'></div>').appendTo(renderTo);
						var itemTxt=$('<div class=\'itemTxt\'></div>').appendTo(item);
						itemTxt.text(t.LabelName);
						var itemSpan=$('<div class=\'itemSpan\'></div>').appendTo(item);
						var del=$('<span class=\'glyphicon glyphicon-trash m-del del\' data-toggle=\'tooltip\' data-placement=\'top\' title=\'删除标签\'></span>').appendTo(itemSpan);
						var edit=$('<span class=\'timeTip glyphicon glyphicon-pencil edit\' data-toggle=\'tooltip\' data-placement=\'top\' title=\'编辑标签\'></span>').appendTo(itemSpan);
						del.attr('id',t.Id);
						edit.attr('id',t.Id);
						item.attr('id',t.Id);
					});
							
					$('.item:eq(0)').addClass('labelCheck');
					//labelItem();
					//editLabel();
					//delLabel();
							
					questionList(1,data.list[0].Id);//展示第一个标签下的问题
					$('.addlabelQuestion').attr('labelId',data.list[0].Id);    //给问题打标签按钮附加当前选中的标签id
					$('#delAll').attr('labelId',data.list[0].Id);
				}
				else{
					var html='';
					html += '<div style="width:100%;text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</div>';
				            $('#labelTxt').empty().append(html);
				}
			}
			else{
				yunNotyError(data.message);
			}
		});
	};
	labelList();
			
	function setScroll(){  //已有标签滚动条
			    $('#labelTxt').slimScroll({
			        height: '400px',
			        /*alwaysVisible: true,*/
			    });
	}
	setScroll();
	$(window).on('resize',setScroll);

			
	$('#addLabel').click(function(){  //添加标签
		$('.u-cancel1').click();
		$('.u-cancel').click();
		//$('.select_rows').iCheck('uncheck');
		if($('#labelInput')[0]==undefined){
			$('#labelTxt').prepend('<div class="item"><input type="text" id="labelInput"/><a class="u-add" title="确定" style="cursor:pointer;">确定</a>&nbsp;&nbsp;<a class="u-cancel" title="取消" style="cursor:pointer; ">取消</a></div>');
		}
		$('.u-cancel').click(function(){
			$(this).parent().remove();
		});
		$('.u-add').click(function(){  //确认添加
			var labelTxt=$(this).prev().val();
			$(this).parent().remove();
			$.post('../../label/addLabel',{
				labelName:labelTxt,
				labelType:1
			},function(json){
				if(json.status==0){
					yunNoty(json);
					labelList();
					check('#checkAll','.checkb');  //标签下已有问题
					check('#checkAllFlow','.rowsel2');  //流程
					check('#checkAllQuestion','.rowsel1');  //问题
				}
				else{
					yunNotyError(json.message);
				}
			});
		});
		$('#labelInput').keydown(function(event){
			if (event.which == 13){
				$('.u-add').click();
			}
		});
		$('body').unbind().click(function(e){
			if(!$(e.target).is('.u-cancel')&&!$(e.target).is('#labelInput')&&!$(e.target).is('#addLabel')
							&&!$(e.target).is('.u-cancel1')&&!$(e.target).is('#editLabel')&&!$(e.target).is('.u-add1')
							&&!$(e.target).is('.u-add')){
				$('body').unbind('click');
				//$(".u-add").click();
			}
		});
	});

	//标签删除事件
	$('#label').on('click','.del',function(event){
		event.stopPropagation();
		var id=$(this).attr('id');
		$('#delLabelBtn').attr('value',id);
		$('#delLabel').modal('show');
	});
			
	$('#delLabel').on('show.bs.modal', function () {  //标签删除模态框
		$('#delLabelBtn').unbind().click(function(){
			var id=$(this).attr('value');
			$.post('../../label/deleteByIds',{
				id:id,
				ids:id
			},function(json){
				if(json.status==0){
					yunNoty(json);
					$('#delLabel').modal('hide');
					labelList();
				}
				else{
					yunNotyError(json.message);
				}
			});
		});
	});
	var tmptext='';//此变量用于编辑标签的时候存放标签的名称
	//编辑标签
	$('#label').on('click','.edit',function(event){
		var t=$(this);
		$('.u-cancel1').click();
		$('.u-cancel').click();
		event.stopPropagation();
		var id=$(this).attr('id');
		var html=$($(this).parent().parent()).prop('innerHTML');  //获取当前一列内的html
		var labelTxt=tmptext=$(this).parent().prev().text();   //获取当前值
		$(this).parent().prev().remove();
		var renderTo=$(this).parent().parent();
		var input=$('<input type="text" id="editLabel"/>').appendTo(renderTo);
		$('#hidtext').val($(this).attr('id'));
		//$(".u-add1").attr("title",$(this).attr("id"))
		input.val(labelTxt);
		var a=$('<a class="u-add1" title="确定" style="cursor:pointer;">确定</a>&nbsp;&nbsp;<a class="u-cancel1" title="取消" style="cursor:pointer; ">取消</a>').appendTo(renderTo);
		$(this).parent().remove();
		$('.u-cancel1').click(function(){
			$(renderTo).html('');
			$(renderTo).append(html);
		});
				
		$(input).keydown(function(event){
			if (event.which == 13){
				$('.u-add1').click();
				labelList()
			}
		});
		$('body').unbind().click(function(e){
			if(!$(e.target).is('.u-cancel1')&&!$(e.target).is('#editLabel')&&!$(e.target).is('#addLabel')
							&&!$(e.target).is('.u-cancel')&&!$(e.target).is('#labelInput')&&!$(e.target).is('.u-add')
							&&!$(e.target).is('.u-add1')){
				$('body').unbind('click');
				$('.u-add1u-add1').click();
			}
		});
	});

   				$('#label').on('click','.u-add1',function(event){
		event.stopPropagation();
		var labelName=$(this).siblings('#editLabel').val();
		if((tmptext!=labelName)){
			$.post('../../label/editLabel',{
				id:$(this).parent().attr('id'),
				labelType:1,
				labelName:labelName
			},function(json){
				if(json.status==0){
					yunNoty(json);
					$('.u-cancel1').click();
					$(this).parent().find('.itemTxt').text(labelName);
					//$(this).parent().click();
					check('#checkAll','.checkb');  //标签下已有问题
					check('#checkAllFlow','.rowsel2');  //流程
					check('#checkAllQuestion','.rowsel1');  //问题
					labelList();
				}
				else{
					yunNotyError(json.message);
				}
			});
			//sessionStorage.setItem('tab',$('#cunchu').html());
			//var url1="labelList.html?id="+$("#hidtext").val();
			//window.location.href=url1;
			//sessionStorage.getItem("tab");
		}
		else{
			$('.u-cancel1').click();
		}
	});
			
	var questionList=function(pageNo,labelId){      //展示当前选中标签已有的问题
		$.post('../../label/findLabelById',{
			pageNo:pageNo,
			labelId:labelId,
			pageSize:15
		},function(data){
			if(data.status==0){
				var renderTo=$('#labelQuestion');
				$('#labelQuestion').html('');
				$('#checkAll').iCheck('uncheck');
				questionIds.splice(0,questionIds.length);
				flowIds.splice(0,flowIds.length);
				if(data.list.length>0){
					$(data.list).each(function(i,t){
						var questionItem=$('<div class=\'questionItem\'></div>').appendTo(renderTo);
						var questionInput=$('<div class=\'questionInput\'></div>').appendTo(questionItem);
						var input=$('<input type=\'checkbox\' class=\'checkb\'/>').appendTo(questionInput);
						var questionTxt=$('<div class=\'questionTxt\'></div>').appendTo(questionItem);
						questionTxt.text(t.Question);
						input.attr('value',t.Id);
					});
					icheckInit();
					$('.questionItem').each(function(){
						$(this).click(function(){
							var chec=$(this).find('.checkb');
							if($(chec).prop('checked')){
								$(chec).iCheck('uncheck');
							}
							else{
								$(chec).iCheck('check');
							}
						});
					});
							
						
							
					var options = {
				              data: [data, 'list', 'total'],
				              currentPage: data.currentPage,
				              totalPages: data.totlePages ? data.totlePages : 1,
				              alignment: 'right',
				              onPageClicked: function(event, originalEvent, type, page) {
				                pageNo = page;
				                questionList(pageNo,$('#delAll').attr('labelId'));
				              }
				            };
				            $('#labelPageList').bootstrapPaginator(options);
				}
				else {
					var html='';
				            html += '<div style="width:100%;text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</div>';
				            $('#labelQuestion').empty().append(html);
				            $('#labelPageList').html('');
			          	}
			}
		});
	};
			
	$('#delAll').click(function(){     //批量移除事件
		var check=$('#labelQuestion').find('input[type=\'checkbox\']');
		var questionListIds='';
		var labelId=$(this).attr('labelId');
		$(check).each(function(){
			if($(this).prop('checked')){
				questionListIds+=$(this).attr('value')+',';
			}
		});
		if(!questionListIds==''){
			$('#delQuestionBtn').attr('labelId',labelId);
			$('#delQuestionBtn').attr('questionListIds',questionListIds);
			$('#delQuestion').modal('show');
		}
		else{
			yunNotyError('请选择需要移除的问题！');
		}
	});
			
	$('#delQuestion').on('show.bs.modal',function(){
		$('#delQuestionBtn').unbind().click(function(){
			var labelId=$(this).attr('labelId');
			var questionListIds=$(this).attr('questionListIds');
			$.post('../../label/deleteLabelAndSolutionConfigRelation',{
				labelId:labelId,
				solutionIds:questionListIds
			},function(json){
				if(json.status==0){
					yunNoty(json);
					$('#delQuestion').modal('hide');
					questionList(1,labelId);
				}
				else{
					yunNotyError(json.message);
				}
			});
		});
	});
			
			
			
	check('#checkAll','.checkb');  //标签下已有问题
	check('#checkAllFlow','.rowsel2');  //流程
	// check('#checkAllQuestion','.rowsel1');  //问题
	
	function check(checkId,find){
		//全选
		$('body').on('ifChecked', checkId, function() {
			$(find).iCheck('check');
		});
		//全不选
		$('body').on('ifUnchecked', checkId, function() {
			$(find).iCheck('uncheck');
		});
	}
			
			
			
	/**
			* 问题添加标签确定事件
			*/
	$('#queManualConfirm').click(function() {
		var QueSolutionid='';
		if($('#queManualQue').hasClass('active')) {   //问题
			QueSolutionid=questionIds.join(',');
		}else if($('#queManualFlow').hasClass('active')) {     //流程
			QueSolutionid=flowIds.join(',');
		}
		var url='';
				
		if($('#queManualQue').hasClass('active')) {   //问题
			labelType = 1;
		}else if($('#queManualFlow').hasClass('active')) {     //流程
			labelType = 2;
		}
				
		$.post('../../label/modifyLabel',{    //标签添加问题或流程请求
			solutionIds:QueSolutionid,
			id:$('#delAll').attr('labelId'),
			labelType:labelType
		},function(json){
			if(json.status==0){
				questionIds.splice(0,questionIds.length);
				flowIds.splice(0,flowIds.length);
				yunNoty(json);
				$('#addlabelQuestion').modal('hide');
				questionList(1,$('#delAll').attr('labelId'));
			}
		});
	});
			
});