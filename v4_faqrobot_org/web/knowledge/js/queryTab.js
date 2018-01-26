	var uploadInterval;
	var fileEdit = true;
	function cleanAll(){
		$('#leadFile,#filename').val('');
		$('#lead_form .fileName').html('');
		$('#rheTemInfo').html('');
		$('#type1').iCheck('check');
		$('#failRheInfo').html('对不起，查询不到<img src="images/X.png" class="imgX"/><img src="images/Y.png" class="imgY"/>的结果');
		$(".iradio_flat-blue").removeAttr('checked');
	}
	$('#leadInTab').click(function(){
		fileEdit = true;
		uploadFile(fileEdit);
		$('.tabName').val('');
		$("#tabId").val('');
		cleanAll();
	});

	// 进度条dom写入页面
	var jindutiaostr='<div id="exlProgress" style="position:fixed;z-index:99;top:0;right:0;background-color:rgba(0,0,0,0.4);width:100%;height:100%;display:none">';
	    jindutiaostr+='<div style="width:329px;margin:25% auto;">';
	    jindutiaostr+='<h4 style="text-align:center;color:#1296db;font-size:18px;font-family:'+'微软雅黑'+';text-shadow:1px 1px 2px  #FFFFFF;font-weight:700">Loading...</h4>';
	    jindutiaostr+='<div class="progress progress-striped active" style="height:10px;background-color:#dadada;box-shadow:inset 0px 0px 3px lightgray;">';
	    jindutiaostr+='<div class="progress-bar" style="background-color:#33b5e2"></div></div></div></div>';
	$("#leadTabModal").append(jindutiaostr)
	// 确认导入
	function confirmLoad(obj) {
		$.ajax({
			type: 'get',
			datatype: 'json',
			cache: false, //不从缓存中去数据
			url: encodeURI('../../DimensionExcel/getStatus'),
			success: function(data) {
				var progress=data.ProgressToKnowledge;
				if(data.ProgressToKnowledge==0){
					if(data.ErrorMsg!==null){
						clearInterval(uploadInterval);
						$('#exlProgress').hide();
			            $('#exlProgress .progress-bar').css('width', '0%');
					}
				}
				if (data.ProgressToKnowledge == 100) {
					if (data.ErrorMsg != '') {
						yunNoty({
							status: 1,
							message: data.ErrorMsg
						});
						$('#queDelModal').modal('show');
						$('.queDelTip').html(data.ErrorMsg);
					} else {
						yunNoty({
							status: 0,
							message: '导入成功！'
						});
						$('.fileName').html(data.SuccessResult.Name);
						$("#rheInsert_X,#failInsert_X,.x-Info1,#queInsert_X").text('+X('+data.SuccessResult.TitleX+')');
						$("#rheInsert_Y,#failInsert_Y,.y-Info1,#queInsert_Y").text('+Y('+data.SuccessResult.TitleY+')');
						$("#x-queRheInfo").val('请问您要问的('+data.SuccessResult.TitleX+')是？');
						$("#y-queRheInfo").val('请问您要问的('+data.SuccessResult.TitleY+')是？');
					}
					clearInterval(uploadInterval);
					$('#exlProgress .progress-bar').css(
	                  'width',progress + '%'
	                )
	                $('#exlProgress h4').text(
	                  "Loading..."+progress + '%'
	                ) 
					setTimeout(function(){
						$('#exlProgress').hide();
			            $('#exlProgress .progress-bar').css('width', '0%');
			        },1000)
				} else {
	                $('#exlProgress .progress-bar').css(
	                  'width',
	                  progress + '%'
	                )
	                $('#exlProgress h4').text(
	                  "Loading..."+progress + '%'
	                )   
				}
			},
			error:function(){
              clearInterval(uploadInterval);
              $('#exlProgress').hide();
              $('#exlProgress .progress-bar').css('width', '0%');
            }
		});
	}

	$('#queDelButton').on('click',function(){
		$('#queDelModal').modal('hide');
	});

	function uploadFile(fileEdit){
		if(fileEdit){
			$('#leadFile').fileupload({
				url: '/DimensionExcel/importFile?mode=7',
				dataType: 'json',
				change: function(e, data) {
					var flag = false;
					data.files.forEach(function(el, i) {
						var str = el.name.substring(el.name.lastIndexOf(".") + 1).toLowerCase();
						if (str == "xls" || str == "xlsx") {
							flag =  true;
						} else {
							flag =  false;
							yunNotyError("请上传xls或xlsx格式的文件！");
						}
					});
					return flag;
				},
				done: function(e, data) {
					if (data.result.status == 0) {
						yunNoty(data.result);
						uploadInterval = setInterval(confirmLoad, 400);
					} else {
						yunNoty(data.result);
						$('#exlProgress').hide();
						$('#exlProgress .progress-bar').css('width', '0%');
						$('.fileinput-button').css('display', 'inline-block');
						$('.fileUpLoadingSign').css('display', 'none');
					}
				},
				// }
			}).bind('fileuploadstart', function(e) {
				$('.fileinput-button').css('display', 'none');
				$('.fileUpLoadingSign').css('display', 'inline-block');
				$('#exlProgress').show();
			}).bind('fileuploadstop', function(e) {
				$('.fileinput-button').css('display', 'inline-block');
				$('.fileUpLoadingSign').css('display', 'none');
			});
		}else{
			$('#leadFile').fileupload({
				url: '/DimensionExcel/importFileAgain?id='+$("#tabId").val(),
				dataType: 'json',
				change: function(e, data) {
					var flag = false;
					data.files.forEach(function(el, i) {
						var str = el.name.substring(el.name.lastIndexOf(".") + 1).toLowerCase();
						if (str == "xls" || str == "xlsx") {
							flag =  true;
						} else {
							flag =  false;
							yunNotyError("请上传xls或xlsx格式的文件！");
						}
					});
					return flag;
				},
				done: function(e, data) {
					if (data.result.status == 0) {
						yunNoty(data.result);
						uploadInterval = setInterval(confirmLoad, 400);
					} else {
						yunNoty(data.result);
						$('#exlProgress').hide();
						$('#exlProgress .progress-bar').css('width', '0%');
						$('.fileinput-button').css('display', 'inline-block');
						$('.fileUpLoadingSign').css('display', 'none');
					}
				},
				// }
			}).bind('fileuploadstart', function(e) {
				$('.fileinput-button').css('display', 'none');
				$('.fileUpLoadingSign').css('display', 'inline-block');
				$('#exlProgress').show();
			}).bind('fileuploadstop', function(e) {
				$('.fileinput-button').css('display', 'inline-block');
				$('.fileUpLoadingSign').css('display', 'none');
			});
		}
	}

	$("#leadBtn").click(function(){
        if($.trim($('.tabName').val()) == '' || $.trim($.trim($('.tabName').val()).length) < 2 || $.trim($.trim($('.tabName').val()).length) > 20){
			$('#leadTabModal .modal-footer #leadBtn').removeAttr('data-target data-dismiss');
			yunNotyError('表格名称长度在2到20之间！');
		}else if($('.fileName').html()==''){
			$('#leadTabModal .modal-footer #leadBtn').removeAttr('data-target data-dismiss');
			yunNotyError('请导入表格！');
		}else{
			$('#leadTabModal .modal-footer #leadBtn').attr({
				'data-target':"#rheTemModal",
				'data-dismiss':"modal"
			});
		}
	});

	//判断说辞模板,失败说辞是否为空，点击下一步到反问说辞
	var answerFormatLabel1 = '';
	var errorFormatLabel1 = '';
	$("#rheTemBtn").click(function(){
		if($('#rheTemInfo').html()==''||$('#failRheInfo').html()==''){
			$('#rheTemModal .modal-footer #rheTemBtn').removeAttr('data-target data-dismiss');
			yunNotyError('说辞模板不能有空值，请填写说辞模板！');
		}else{
			answerFormatLabel1 = $("#rheTemInfo").html();
			errorFormatLabel1 = $("#failRheInfo").html();
			$('#rheTemModal .modal-footer #rheTemBtn').attr({
				'data-target':'#queRheModal',
				'data-dismiss':"modal"
			});
		}
	})
	//判断反问说辞是否为空，点击保存
	$('#saveBtn').click(function(){
		if($('#x-queRheInfo').val()==''||$('#y-queRheInfo').val()==''){
			//$('#queRheModal .modal-footer #saveBtn').removeAttr('data-dismiss');
			//yunNotyError('反问模板不能有空值，请填写反问模板！');
		}
		/*else{
			$('#queRheModal .modal-footer #saveBtn').attr({
				'data-dismiss':"modal"
			});
		}*/
	})
	
	/***********************queryList START***********************/
	//动态生成表格列表
	var flag_tab_add=false;
	var arr = [];
	function queryList(pageNum){
		//不勾选全选
		$('.select_rows').iCheck('uncheck');
		if(!pageNum)pageNum=1;
		$('#queryList').tableAjaxLoader2(7);
		$('[name="orderType"]').val(2);
		$.ajax({
			type:'post',
			datatype:'json',
			cache:true,
			url:encodeURI('../../DimensionExcel/listRelationWord?word='+$('#sip').val()+'&pageSize=' + 10 + '&pageNum=' + pageNum + '&orderType='+$('[name="orderType"]').val()),
			success:function(data){
				if(data.status===0){
					if(data.list===undefined){
						$('.select_rows').iCheck('uncheck');
						$('#queryList').find('tbody').html('<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>  当前纪录为空！</td></tr>');
						$('#pageList').html('');
						return;
					}
					if(data.list.length>0){
						var html = "";
						for(var i=0;i<data.list.length;i++){
							html += '<tr Id="'+data.list[i].Id+'" ResultType="'+data.list[i].ResultType+'" TitleX="'+data.list[i].TitleX+'" TitleY="'+data.list[i].TitleY+'" Name="'+data.list[i].Name+'">'+
										'<td><input type="checkbox" name="ckb" class="select_row" value='+data.list[i].Id+' /></td>'+
										'<td>'+data.list[i].Name+'</td>'+
										'<td style="display: none;">'+data.list[i].AnswerFormatLabel+'</td>'+
										'<td style="display: none;">'+data.list[i].ErrorFormatLabel+'</td>'+
										'<td style="display: none;">'+data.list[i].QuestionOne+'</td>'+
										'<td style="display: none;">'+data.list[i].QuestionTwo+'</td>'+
										'<td>'+data.list[i].AnswerFormat+'</td>'+
										'<td>'+
											'<a href="javascript:;" class="download"><i class="timeTip clickBtn glyphicon glyphicon-arrow-down" title=""data-original-title="下载"></i></a>'+
											'<a href="" class="revise" data-num="0" data-toggle="modal" data-target="#leadTabModal"><i class="timeTip edit-synonym glyphicon glyphicon-pencil" title="" data-original-title="编辑"></i></a>'+
											'<a href="" class="delete" data-num="0" data-toggle="modal"><i class="timeTip ig clickBtn glyphicon glyphicon-trash" title="" data-original-title="删除"></i></a>'+
										'</td>'+
									'</tr>';
						}
						$('#queryList').find('tbody').html(html);
						$(".timeTip").tooltip();
						//单个删除
						$('.delete').unbind('click').bind('click',function(){
							var self = this;
							$("#delModal").modal('show');
							$("#delModal #delButton").unbind('click').bind('click',function(){
								somedel(self);
							});
						});
						//下载文件
						$(".download").click(function(){
							var $tr = $(this).parents('tr');
							var ids = $tr.attr('id');
							downTab(ids);
						});
						//修改
						$(".revise").click(function(){
							$('#rheTemInfo').focus();
							var id = $(this).parents('tr').attr('id');
							var Name = $(this).parents('tr').attr('name');
							var TitleX = $(this).parents('tr').attr('TitleX');
							var TitleY = $(this).parents('tr').attr('TitleY');
							// $("#rheTemModal .rhePrevBtn").removeClass('btn-primary');
							// $("#rheTemModal .rhePrevBtn").addClass('btn-default');
							// $("#rheTemModal .rhePrevBtn").css({'cursor':'not-allowed'});
							// $("#rheTemModal .rhePrevBtn").removeAttr('data-target data-dismiss');
							$("#tabId").val(id);
                            $(".tabName").val(Name);
                            $('.fileName').html(Name);
							fileEdit = false;
							uploadFile(fileEdit);
							$("#rheTemInfo").html($(this).parents('tr').find('td:eq(2)').html());
							$("#failRheInfo").html($(this).parents('tr').find('td:eq(3)').html());
							$("#x-queRheInfo").html($(this).parents('tr').find('td:eq(4)').html());
							$("#y-queRheInfo").html($(this).parents('tr').find('td:eq(5)').html());
							
							$("#rheInsert_X,#failInsert_X,#queInsert_X").text('+X('+TitleX+')');
							$("#rheInsert_Y,#failInsert_Y,#queInsert_Y").text('+Y('+TitleY+')');
							//设置结果类型样式
							if($(this).parents('tr').attr('resulttype') == 0){
								$('#type1').iCheck('uncheck');
								$('#type2').iCheck('check');
							}else{
								$('#type1').iCheck('check');
								$('#type2').iCheck('uncheck');
							}
							$(".timeTip").tooltip();
						});
						
						icheckListInit();

						//设置批量删除样式
						$('#mul-del').css('cursor','not-allowed');
						$('#mul-del').removeClass('btn-primary').addClass('btn-default');
						$('.select_rows,.select_row').on("ifChanged",function(){
							if($('.select_row:checked').length>0){
								$('#mul-del').css('cursor','pointer');
								$('#mul-del').removeClass('btn-default').addClass('btn-primary');
							}else{
								$('#mul-del').css('cursor','not-allowed');
								$('#mul-del').removeClass('btn-primary').addClass('btn-default');
							}
						});

						//下面开始处理分页
						var options = {
							data: [data, 'list', 'total'],
							currentPage: data.currentPage,
							totalPages: data.totlePages,
							onPageClicked: function (event, originalEvent, type, page) {
								queryList(page);
							}
						};
						setPage('pageList',options);
					}else{
						$('.select_rows').iCheck('uncheck');
						$('#queryList').find('tbody').html('<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>  当前纪录为空！</td></tr>');
						$('#pageList').html('');
					}
					$(".timeTip").tooltip();
				}else{
					yunNoty(data);
				}
			}
		});
	};
	
	//表格查询模板保存或修改
	function saveTab(tabId,resultType,answerFormat,errorFormat,questionOne,questionTwo,answerFormatLabel,errorFormatLabel){
		$.ajax({
			type:'post',
			datatype:'json',
			cache:false,//不从缓存中去数据
			url:encodeURI('../../DimensionExcel/saveAndUpdateData'),
			data:{
                'id':tabId,
                'name':$('.tabName').val(),
				'resultType':resultType,
				'answerFormat':answerFormat,
				'errorFormat':errorFormat,
				'questionOne':questionOne,
				'questionTwo':questionTwo,
				'answerFormatLabel':answerFormatLabel,
				'errorFormatLabel':errorFormatLabel
			},
			success:function(data){
				if(data.status===0){
					yunNoty(data);
					queryList();
					$('#saveBtn').attr('data-dismiss','modal');
					$('#queRheModal').modal('hide');
				}else{
					yunNoty(data);
					$('#queRheModal').modal('show');
				}
			}
		});
	}
	//下载模板
	$("#downTab").click(function(){
		var ids = 0;
		downTab(ids);
	});
	//下载模板
	function downTab(ids){
		document.location.href = "/DimensionExcel/exportWords?id="+ids;
	}

	//点击保存按钮
	$('#saveBtn').click(function(){
		var resultType;
		var answerFormatLabel = $("#rheTemInfo").html();
		var errorFormatLabel = $("#failRheInfo").html();
		for(var j = 0;j < $("#rheTemInfo img").length;j++){
			if($("#rheTemInfo img").eq(j).is('.imgX')){
				$("#rheTemInfo img").eq(j).replaceWith('<img class="imgX" />{X}');
			}
			if($("#rheTemInfo img").eq(j).is('.imgY')){
				$("#rheTemInfo img").eq(j).replaceWith('<img class="imgY"/>{Y}');
			}
			if($("#rheTemInfo img").eq(j).is('.imgZ')){
				$("#rheTemInfo img").eq(j).replaceWith('<img class="imgZ"/>{Z}');
			}
		}
		for(var j = 0;j < $("#failRheInfo img").length;j++){
			if($("#failRheInfo img").eq(j).is('.imgX')){
				$("#failRheInfo img").eq(j).replaceWith('<img class="imgX"/>{X}');
			}
			if($("#failRheInfo img").eq(j).is('.imgY')){
				$("#failRheInfo img").eq(j).replaceWith('<img class="imgY"/>{Y}');
			}
		}
		
		if($('.iradio_flat-blue.checked').parent().text()=='文本'){
			resultType = 1;
		}else{
			resultType = 0;
		}
		var answerFormat = $("#rheTemInfo").text();
		var errorFormat = $("#failRheInfo").text();
		var questionOne = $("#x-queRheInfo").val();
		var questionTwo = $("#y-queRheInfo").val();
		var tabId = $("#tabId").val();
		saveTab(tabId,resultType,answerFormat,errorFormat,questionOne,questionTwo,answerFormatLabel,errorFormatLabel);
	});
	//点击反问说辞上一步
	$('.prevQue').click(function(){
		$("#rheTemInfo").html(answerFormatLabel1);
		$("#failRheInfo").html(errorFormatLabel1);
	});
	
	//点击单个删除
	function somedel(obj){
		var $tr = $(obj).parents('tr');
		var ids = $tr.attr('id');
		$.ajax({
			url: '../../DimensionExcel/delOptDimensionQueryById',
			type:'POST',
			dataType:'json',
			data: {
				'ids': ids
			},
			success: function(data) {
		        if(data.status==0) {
		            yunNoty(data);
		            $("#delModal").modal('hide');
	   				queryList();
		        }else {
		        	$("#delModal").modal('hide');
		            yunNoty(data);
		        }
		    }
		});
    }
    $("#muiDelModal #muiDelButton").unbind('click').bind('click',function () {
        muiDel();
    });
	//点击批量删除
	$('#mul-del').click(function(){
		if($('.select_row:checked').length>0) {
			$("#muiDelModal").modal('show');
		}else{
            yunNotyError('请选择要删除问题！');
		}
	});
	function muiDel(){
		var id1 = [];
		var id2 = 0;
		$('.select_row').each(function(){
			var $tr = $(this).parents('tr');
			id2 = $tr.attr('id');
			if($(this).is(':checked')){
				id1.push(id2);
			}
		});
		if (id1.toString()) {
	        $.ajax({
	          url: '../../DimensionExcel/delOptDimensionQueryById',
	          type:'POST',
	          dataType:'json',
	          data: {
	            'ids': id1.toString()
	          },
	          success: function(data) {
	            if (data.status==0) {
	              yunNoty(data);
	              $("#muiDelModal").modal('hide');
	              queryList();
	            } else {
	              yunNoty(data);
	            }
	          }
	        });
	    } else {
	        $('#muiDelModal').modal('hide');
	        yunNotyError('请勾选您要删除的表格', false);
	    }
	}
	
	//填写说辞模板
	$('#rheInsert_X').click(function(){
		//$('#rheTemInfo').blur();
		$('#rheTemInfo').focus();
        if($('#rheTemInfo').is(':focus')){
        	insertHtmlAtCaret('<img class="imgX" src="images/X.png"/>');
        };
	});
	$('#rheInsert_Y').click(function(){
		//$('#rheTemInfo').blur();
		$('#rheTemInfo').focus();
        if($('#rheTemInfo').is(':focus')){
        	insertHtmlAtCaret('<img class="imgY" src="images/Y.png"/>');
        };
	});
	$('#rheInsert_Z').click(function(){
		//$('#rheTemInfo').blur();
        $('#rheTemInfo').focus();
        if($('#rheTemInfo').is(':focus')){
        	insertHtmlAtCaret('<img class="imgZ" src="images/Z.png"/>');
        };
	});
	
	//填写失败说辞
	$('#failInsert_X').click(function(){
		//$('#failRheInfo').blur();
        $('#failRheInfo').focus();
        if($('#failRheInfo').is(':focus')){
        	insertHtmlAtCaret('<img class="imgX" src="images/X.png"/>');
        };
	});
	$('#failInsert_Y').click(function(){
		//$('#failRheInfo').blur();
        $('#failRheInfo').focus();
        if($('#failRheInfo').is(':focus')){
        	insertHtmlAtCaret('<img class="imgY" src="images/Y.png"/>');
        };
	});
	
    /*
     * text:要插入的内容
     * $html:可编辑的div
     *
     */

    function insertHtmlAtCaret(html) {
        var sel, range;
        if (window.getSelection) {
            sel = window.getSelection();
            if (sel.getRangeAt && sel.rangeCount) {
                range = sel.getRangeAt(0);
                range.deleteContents();
                var el = document.createElement("div");
                el.innerHTML = html;
                var frag = document.createDocumentFragment(), node, lastNode;
                while ( (node = el.firstChild) ) {
                    lastNode = frag.appendChild(node);
                }
                range.insertNode(frag);
                if (lastNode) {
                    range = range.cloneRange();
                    range.setStartAfter(lastNode);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                }
            }
        } else if (document.selection && document.selection.type != "Control") {
            // IE < 9
            document.selection.createRange().pasteHTML(html);
        }
    }

	//单击搜索
	$("#searchBtn").click(function(){
		queryList();
	})
	//搜索框回车
	$('#sip').keydown(function(event){
		if(event.keyCode==13){
			queryList();
		}
	});

