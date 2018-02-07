$(document).ready(function() {
	var tmpNum=parent.$('#tabHeader li[data-tab="'+location.href+'"]').attr('data-num');//获取当前url中的data-num
	$('.affixing').affix({
		offset: {
			top: 160
		}
	});
	$('#affix1inner').slimScroll({
		height: $(window).height() - 290 + 'px',
		allowPageScroll: false
	});
 
	$(window).scroll(function(){
		if($(document).scrollTop()>=156){
			$('#affix1').css({
				'top':0,
				'left':'30px',
				'position':'fixed'
			});
			$('#affixM').css({
				'position':'relative'
			});
			$('#affixM').addClass('col-md-offset-3').addClass('col-sm-offset-3');
			
			$('#affix2').css({
				'top':0,
				'right':'40px',
				'position':'fixed',
				'width':$('#affixM').width()
			});
			
		}else{
			$('#affix1,#affix2,#affixM').css({
				'position':'static'
			});
			$('#affixM').removeClass('col-md-offset-3').removeClass('col-sm-offset-3');
		}
	});
	
	$(window).resize(function(){
		$('#affix2').css({
			'width':$('#affixM').width()
		});
	});
	

	iframeTab.init({
		iframeBox: ''
	});

	//生成移动分类树
	var settingEdit = {
		data: {
			simpleData: {
				enable: true
			}
		},
		view: {
			selectedMulti: false,
			showIcon: false
		},
		callback: {
			onClick: function(event, treeId, treeNode, clickFlag) {
				if (treeNode) {
					$('#YDGroupId').val(treeNode.id);
				}
			},
			beforeClick: function(treeId, treeNode, clickFlag) {
				if (treeNode.isParent == true) {
					Base.gritter('问题不能移动到父分类下', false);
					return false;
				}
			},
			onDblClick: function(event, treeId, treeNode) {
				$('#YDYes').trigger('click');
	  }
		}
	};
	var This = this,
		pageNo = 1, //当前页
		pageSize = 10, //每页数量
		orderType = 14,
		isLeaf = 0,
		groupA = 0,
		groupId = 0,
		solutionType = null,
		isJpage = 0, //是否已实例化jpage
		answerStatus = '',
		status = '',
		queryType = 1,
		searchStr1 = 'question=',
		searchStr2 = 'answer=',
		queStr = '',
		timer = null,
		webId = 83,
		visib = '',
		sourceType = -1;
	var setting1 = {
		view: { //不显示图标
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
		// tasksId=686 后台接口更改，加载分类树时需要传递参数吗m=0
        async : {
            enable : true,
			url : "../../classes/listClasses",
			autoParam : ["id"],
			otherParam:{m:0},
			dataFilter : ajaxDataFilter1
        },
		callback: {
			onClick: function(event, treeId, treeNode) {
                if(treeNode){
                    //点击的时候获取当前树的节点信息
                    groupId = treeNode.Id;
                }
                pageNo=1;
				initSrc();
			},
		}
	};
    //渲染树结构
    function ajaxDataFilter1(treeId, parentNode, responseData) {
        if (responseData) {
            responseData.list.push({ Id:0, ParentId:-1, Name:"全部分类", open:true});
            return responseData.list;
        }
        return responseData;
    };
	function filterP(node) {
		return (node.isParent == false);
    }
    $.fn.zTree.init($('#ztree1'), setting1, []);
	/* if (!window.classes) {
		//获取问题分类
		Base.request({
			url: 'classes/listClasses',
			params: {
				m: 0,
			},
			callback: function(data) {
				if (data.status) {
					Base.gritter(data.message, false);
				} else {
					window.classes = true;
					var html = '';
					if (data.list[0]) {
						var formatData = [],
							len = data.list.length;
						for (var key in data.list) {
							formatData[key] = {};
							formatData[key]['name'] = data.list[key]['Name'];
							formatData[key]['pId'] = data.list[key]['ParentId'] + 1;
							formatData[key]['id'] = data.list[key]['Id'] + 1;
						}

						formatData[len] = {};
						formatData[len]['name'] = '全部分类';
						formatData[len]['pId'] = 0;
						formatData[len]['id'] = 1;
						formatData[len]['open'] = true;

						$.fn.zTree.init($('#ztree1'), setting1, formatData);
						$.fn.zTree.init($('#treeeClasses'), settingEdit, formatData);
						treeObj = $.fn.zTree.getZTreeObj('ztree1');
						initSrc();
					}
				}
			},
		});
	} */
	var selectSourceFlag = true;
	var initSrc = function() {
		$('.multCos').iCheck('uncheck');
		$('#tabd').tableAjaxLoader2(1);
		Base.request({
			url: 'question/getHkQueList?' + searchStr1 +'&'+ searchStr2,
			params: {
				pageNo: pageNo,
				pageSize: pageSize,
				orderType: orderType,
				visib:visib,
				groupId: groupId,
				queryType: queryType,
				webId:webId
				/*isLeaf: isLeaf,
        solutionType: solutionType,
        groupId: groupId,
        answerStatus: answerStatus,
        status: status,
        queryType: queryType,
        source: sourceType*/
			},
			callback: function(data) {
				if (data.status) {
					Base.gritter(data.message, false);
				} else {
					if (data.sourceList) {
						if (data.sourceList[0]) {
							if (selectSourceFlag) {
								var html = '<li><a class="sol" href="#" data-sol="-1">全部渠道</a></li>';
								for (var m in data.sourceList) {
									html += '<li><a class="sol" href="javascript:;" data-sol="' + data.sourceList[m].DicCode + '">' + data.sourceList[m].DicDesc + '</a></li>';
								}
								$('#DataSourceUL').empty().append(html);
								$('#DataSourceUL a').on('click', function() {
									pageNo = 1;
									sourceType = $(this).attr('data-sol');
									if (sourceType == '-1') {
										$('.sourceType').html('全部渠道<span class="caret"></span>');
									} else {
										$('.sourceType').html(getSourceName(sourceType) + '<span class="caret"></span>');
									}
									initSrc();
								});
								selectSourceFlag = false;
							}
						}
					}
					var html = '';
					if (data.list.Items[0]) {
						for (var i = 0; i < data.list.Items.length; i++) {
							var ListAnswer = data.list.Items[i].ListAnswer,
								ansStr = '',
								ansThisIndex = '',
								allAns = '',
								delStr = '';
                
							if(ListAnswer){
								for (var j = 0; j < ListAnswer.length; j++) {
									var ansItem_focus = '',
										display = 'style="display: none;"';
									if (!j) { //第一个答案
										ansItem_focus = 'ansItem_focus';
										display = '';
									}
									if (ListAnswer.length > 1) {
										ansThisIndex = j + 1;
										allAns = '<a><span class="getAll timeTip glyphicon glyphicon-chevron-down" title="' + ListAnswer.length + '个答案"></span></a>';
										delStr = '<a><span class="oneDelAns timeTip glyphicon glyphicon-trash" title="删除答案"></span></a>';
									}

									var AnswerStatus = '';
									switch (ListAnswer[j].AnswerStatus) {
									case 0:
										AnswerStatus = '已发布';
										break;
									case -1:
										AnswerStatus = '暂存';
										break;
									case -2:
										AnswerStatus = '等待审核';
										break;
									case -3:
										AnswerStatus = '被退回';
										break;
									case -4:
										AnswerStatus = '已过期';
										break;
									case -5:
										AnswerStatus = '等待生效';
										break;
									}

									//问题答案类型对应的小图标
									var imgMode = '', imgTitle = '';
									switch (data.list.Items[i].ListAnswer[j].Mode) {
									case 0:
										imgMode = 'text.png';
										imgTitle = '文本';
										break;
									case 1:
										imgMode = 'img-text.png';
										imgTitle = '图文';
										break;
									case 2:
										imgMode = 'fwb.png';
										imgTitle = '富文本';
										break;
									case 3:
										if(data.list.Items[i].ListAnswer[j].Material){
											switch(data.list.Items[i].ListAnswer[j].Material.Type){
											case 1:
												imgMode = 'img.png';
												imgTitle = '图片';
												break;
											case 2:
												imgMode = 'video.png';
												imgTitle = '语音';
												break;
											case 3:
												imgMode = 'audio.png';
												imgTitle = '视频';
												break;
											}
										}
										break;
									case 4:
										imgMode = 'dsf.png';
										imgTitle = '第三方';
										break;
									case 6:
										imgMode = 'flow.png';
										imgTitle = '流程';
										break;
									case 7:
										imgMode = 'form.png';
										imgTitle = '表单数据';
										break;
									case 8:
										imgMode = 'monitor.png';
										imgTitle = '转人工';
										break;
									}

									var editAnswer = '<a href="../../web/knowledge/editAnswer.html?solutionId=' + data.list.Items[i].SolutionId + '&groupId=' + data.list.Items[i].GroupId + '&question=' + encodeURIComponent(data.list.Items[i].Question) +'&tmpNum='+tmpNum+'" data-num="0" data-name="新增答案"><span class="timeTip glyphicon glyphicon-plus" title="新增答案"></span></a>',
										link = '../../web/knowledge/queDetail.html?id=' + data.list.Items[i].Id + '',
										link2 = '../../web/knowledge/editAnswer.html?solutionId=' + ListAnswer[j].SolutionId + '&groupId=' + ListAnswer[j].GroupId + '&answerId=' + ListAnswer[j].Id + '&question=' + encodeURIComponent(data.list.Items[i].Question)+'&tmpNum='+tmpNum,
										queType = '';
									if (data.list.Items[i].SolutionType == 2) {
										editAnswer = '<a href="../../web/knowledge/editAnswer.html?solutionId=' + data.list.Items[i].SolutionId + '&groupId=' + data.list.Items[i].GroupId + '&question=' + encodeURIComponent(data.list.Items[i].Question) + '&tmpNum='+tmpNum+'&isFlow=1" data-num="0" data-name="新增流程描述"><span class="timeTip glyphicon glyphicon-plus" title="新增流程描述"></span></a>';

										link = '../../web/knowledge/editFlow.html?questionId=' + data.list.Items[i].Id + '&groupId=' + data.list.Items[i].GroupId + '&solutionId=' + data.list.Items[i].SolutionId+'&tmpNum='+tmpNum;
										link2 = '../../web/knowledge/editAnswer.html?solutionId=' + ListAnswer[j].SolutionId + '&groupId=' + ListAnswer[j].GroupId + '&questionId=' + data.list.Items[i].Id + '&answerId=' + ListAnswer[j].Id + '&question=' + encodeURIComponent(data.list.Items[i].Question)+'&tmpNum='+tmpNum;
										queType = '[流程]';
									}

									ansStr += '<div class="ansItem ' + ansItem_focus + '" ' + display + ' Id="' + ListAnswer[j].Id + '" GroupId="' + ListAnswer[j].GroupId + '" SolutionId="' + ListAnswer[j].SolutionId + '" Webid="' + ListAnswer[j].Webid + '">';
									ansStr += '<div class="ansItemCtn"><span class="timeTip ansItemImg" style="background:url(images/'+ imgMode +') no-repeat" title="'+imgTitle+'"></span><span class="ansIndex">答案' + ansThisIndex + '</span>' + ListAnswer[j].Answer + '</div>';
									/*ansStr += '<div class="ansItemFrom">' + showJueSe(ListAnswer[j], data.sourceList) + '<span>来自:<em>' + ListAnswer[j].UserName + '</em></span>';
								ansStr += '<span class="dot">|</span>' + showQuDao(ListAnswer[j], data.sourceList) + '<span>浏览<em>' + (ListAnswer[j].Hits || 0) + '</em>次</span>';*/
									/*ansStr += '<span>' + AnswerStatus + '</span>';
								ansStr += '<span class="dot">|</span>';
								if(ListAnswer[j].Usefull && ListAnswer[j].Usefull !== 0) {
									ansStr += '<a href="/web/knowledge/satisfaction.html?solutionId=' + ListAnswer[j].SolutionId + '&useFullType=1&count='+ListAnswer[j].Usefull+'" data-num="0" data-name="满意度评价详细">';
									ansStr += '<span><span class="glyphicon glyphicon-thumbs-up" title="赞"></span><em>' + ListAnswer[j].Usefull + '</em>次</span></a>';
								} else {
									ansStr += '<span><span class="glyphicon glyphicon-thumbs-up" title="赞"></span><em>0</em>次</span>';
								}
								if(ListAnswer[j].Useless && ListAnswer[j].Useless !== 0) {
									ansStr += '<span class="dot">|</span><a href="/web/knowledge/satisfaction.html?solutionId=' + ListAnswer[j].SolutionId + '&useFullType=2&count='+ListAnswer[j].Useless+'" data-num="0" data-name="满意度评价详细">';
									ansStr += '<span><span class="glyphicon glyphicon-thumbs-down" title="踩"></span><em>' + ListAnswer[j].Useless + '</em>次</span></a><span class="dot">|</span>';
								} else {
									ansStr += '<span class="dot">|</span>';
									ansStr += '<span><span class="glyphicon glyphicon-thumbs-down" title="踩"></span><em>0</em>次</span><span class="dot">|</span>';
								}
                if (ListAnswer[j].StartTime && ListAnswer[j].EndTime) {
                  ansStr += '<span>生效时间：' + ListAnswer[j].StartTime + '-' + ListAnswer[j].EndTime + '</span><span class="dot">|</span>';
                } else if (ListAnswer[j].StartTime) {
                  ansStr += '<span>起始时间：' + ListAnswer[j].StartTime + '<span class="dot">|</span>';
                } else if (ListAnswer[j].EndTime) {
                  ansStr += '<span>结束时间：' + ListAnswer[j].EndTime + '<span class="dot">|</span>';
                }*/
									ansStr += '</div></div>';
									//							 var usefull = ListAnswer[j].Usefull;
									//             var Useless = ListAnswer[j].Useless;
								}
             
								var Status = '',
									isOver = '';
								/*switch (data.list.Items[i].Status) {
                case 0:
                  Status = '已发布';
                  break;
                case -1:
                  Status = '暂存';
                  break;
                case -2:
                  Status = '等待审核';
                  break;
                case -3:
                  Status = '被退回';
                  break;
                case -4:
                  Status = '已过期';
                  isOver = '<div class="isOver"><img src="images/overdue.png"></div>';
                  break;
                case -5:
                  Status = '等待生效';
                  break;
              }*/

								//问题推荐分类
								var askMode1 = '', askMode2 = '', askMode = [];
								var count1 = 0, count2 = 0;//count1手动推荐个数，count2智能推荐个数
								if(data.list.Items[i].SuggestQuestion){
									var suggestQuestion = data.list.Items[i].SuggestQuestion;
									for(var k=0; k<suggestQuestion.length;k++){
										switch (suggestQuestion[k].Mode) {
										case 1:
											count1++;
											break;
										case 2:
											count2++;
											break;
										}
										if(count1 != 0 && count2 == 0){
											askMode[i] = '手动推荐('+count1+')';
										}else if(count1 == 0 && count2 != 0){
											askMode[i] = '智能推荐('+count2+')';
										}else if(count1 != 0 && count2 != 0){
											askMode[i] = '手动推荐('+count1+')，智能推荐('+count2+')';
										}
									}
								}
								if(askMode[i] == undefined){
									askMode[i] = '未设置';
								}
								var Visibility = '';
								if(data.list.Items[i].Visibility == 1){
									 Visibility = '不可见';
								}else{
									Visibility = '可见';
								}

								html += '<tr class="gg0"><td class="gg1"></td><td class="gg1"></td></tr>';
								html += '<tr Id="' + data.list.Items[i].Id + '" GroupId="' + data.list.Items[i].GroupId + '" SolutionId="' + data.list.Items[i].SolutionId + '" SolutionType="' + data.list.Items[i].SolutionType + '" SolutionType="' + data.list.Items[i].SolutionType + '">';
								html += '<td width="30"><input class="singleCos" type="checkbox"></td>';
								html += '<td><div class="titleCtn"><a class="queDetailBtn">';
								html += '<span class="queTitle">' + data.list.Items[i].Question + queType + '</span></a>' + allAns + '</div>';
								html += '<div class="queCtn">' + isOver + ansStr + '</div><div class="queRight"><div>来自:<em>' + data.list.Items[i].UserName + '</em></div><span class="dot">|</span>';
								html += '<div>分类:<em>' + data.list.Items[i].GroupName + '</em></div><span class="dot">|</span>';
								html += '<div>是否可见：'+Visibility+'<span class="dot">|</span></div>';
								/*var labelName=data.list.Items[i].LabelName;
								if(labelName==null){
									labelName="无";
								}*/
								
								//html+='<div>所属标签:<em>' + labelName + '</em></div><span class="dot">|</span>';
				
								html += '<div>浏览<em>' + (data.list.Items[i].Hits || 0) + '次</em></div><span class="dot">|</span><div>' + Status + '</div>';
								//html += '<span class="dot">|</span><div>';
								if(data.list.Items[i].Usefull && data.list.Items[i].Usefull !== 0) {
									//html += '<a href="/web/knowledge/satisfaction.html?solutionId=' + ListAnswer[0].SolutionId + '&useFullType=1&count='+data.list.Items[i].Usefull+'" data-num="0" data-name="满意度评价详细">';
									html += '<span class="glyphicon glyphicon-thumbs-up" title="赞"></span><em>' + data.list.Items[i].Usefull + '</em>次</a>';
								} else {
									html += '<span class="glyphicon glyphicon-thumbs-up" title="赞"></span><em>0</em>次';
								}
								html += '<span class="dot">|</span>';
								if(data.list.Items[i].Useless && data.list.Items[i].Useless !== 0) {
									//html += '<a href="/web/knowledge/satisfaction.html?solutionId=' + ListAnswer[0].SolutionId + '&useFullType=2&count='+data.list.Items[i].Useless+'" data-num="0" data-name="满意度评价详细">';
									html += '<span class="glyphicon glyphicon-thumbs-down" title="踩"></span><em>' + data.list.Items[i].Useless + '</em>次</a>';
								} else {
									html += '<span class="glyphicon glyphicon-thumbs-down" title="踩"></span><em>0</em>次';
								}
								html += '</div>';
								//html += '<span class="dot">|</span><a class="similar" href="#modal-dialog" data-toggle="modal"><span class="">' + data.list.Items[i].SimilarCount + '个相似问法</span>';
								html += '</div></div></td></tr>';

							}
						}
						$('.tbody1').empty().append(html);
						var options = {
							data: [data.list, 'Items', 'TotalCount'],
							currentPage: data.list.CurrentIndex,
							totalPages: data.list.PageCount ? data.list.PageCount : 1,
							alignment: 'right',
							onPageClicked: function(event, originalEvent, type, page) {
								pageNo = page;
								initSrc();
								var moveTo = new MoveTo();
								var target = document.getElementById('moveTo');
								moveTo.move(target);
							}
						};
						$('#itemContainer').bootstrapPaginator(options);
					} else {
						html += '<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
           	            $('.tbody1').empty().append(html);
						$('#itemContainer').empty().html('');
					}
					/* if (sessionStorage) {
                        sessionStorage.setItem("qv_pageNo", pageNo);
                        sessionStorage.setItem("qv_orderType", orderType);
                        sessionStorage.setItem("qv_groupId", groupId);
                        sessionStorage.setItem("qv_answerStatus", answerStatus);
                        sessionStorage.setItem("qv_status", status);
                        sessionStorage.setItem("qv_queryType", queryType);
                        sessionStorage.setItem("qv_solutionType", solutionType);
                        sessionStorage.setItem("qv_searchStr", searchStr);
                        sessionStorage.setItem("qv_queStr", queStr);
                        sessionStorage.setItem("qv_sortWord2", $('.sortWord2').html());
                        sessionStorage.setItem("qv_sortWord", $('.sortWord').html());
                        sessionStorage.setItem("qv_solutionTypeWord", $('.solutionType').html());
                    } */
          
					$('.timeTip').tooltip();
					icheckInit();
					$('.ansItemCtn').each(function() {
						if ($(this).height() == 400) {
							$(this).slimScroll({
								height: '100%',
							}).trigger('mouseout');
						}
					});
					$('.ansItemCtn').find('img').each(function() {
						if ($(this).attr('style') == undefined) {
							var container = $('<a data-lightbox="roadtrip">' + $(this).prop('outerHTML') + '</a>');
							container.attr('href', $(this).attr('src'));
							$(this).after(container);
							$(this).remove();
						}
					});

				}
			},
		});
	};
    initSrc();
	allQueView();
	//问题总览
	function allQueView() {
		Base.request({
			url: 'learnQue/getParamsValue',
			params: {},
			callback: function(data) {
				if (data.status) {} else {
					$('.beHandle').text(data.UnQues || 0);
					$('.beReview').text(data.needCheck || 0);
					$('.beTurnback').text(data.returnEditCount || 0);
		  if(data.needCheck == 0) {
			  $('.beReview').css('cursor', 'default');
		  }
		  if(data.returnEditCount == 0) {
			  $('.beTurnback').css('cursor', 'default');
		  }
				}
			},
		});
	}
	
	$('.beReview').on('click', function() {
	  if($(this).html() != '0') {
			$('.sort6').trigger('click');
	  }
	});
	$('.beTurnback').on('click', function() {
	  if($(this).html() != '0') {
			$('.sort9').trigger('click');
	  }
	});

	//ENTER
	$(document).on('keyup', function(e) {
		var $activeEl = $(document.activeElement);

		if ($activeEl.is('.inputSim') && (e.keyCode == 13 || e.keyCode == 108)) {
			$('.addSim').trigger('click');
		}
	});

	//展开全部问题
	$('body').on('click', '.getAll', function() {
		var $td = $(this).parents('td');

		if ($(this).is('.glyphicon-chevron-down')) {
			$td.find('.ansItem:not(:first)').stop().slideDown();
			$(this).addClass('glyphicon-chevron-up').removeClass('glyphicon-chevron-down');
		} else {
			$td.find('.ansItem:not(:first)').stop().slideUp();
			$(this).addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
		}
	});

	//修改问题
	$('body').on('click', '.editQue', function() {
		var $titleCtn = $(this).parents('.titleCtn'),
			$editTitleCtn = $('<div><input type="text" class="form-control" placeholder="输入修改后的问题" style="max-width: 60%; display: inline-block; margin: 5px 10px 5px 0;"></td><td></td><td><a class="ensureQue"><span class="timeTip glyphicon glyphicon-ok" title="确定" style="margin-right: 5px;"></span></a><a class="cannelQue"><span class="timeTip glyphicon glyphicon-remove" title="取消"></span></a></div>');

		if (!$titleCtn.next().find('.ensureQue')[0]) {
			$titleCtn.after($editTitleCtn);
			$editTitleCtn.hide().fadeIn();
			$('.timeTip').tooltip();

			$editTitleCtn.find('input').val($titleCtn.find('.queTitle').text().replace(/\[流程\]$/, '')).focus();
		}
	});

	//确认修改问题
	$('body').on('click', '.ensureQue', function() {
		var $tr = $(this).parents('tr'),
			$input = $(this).prev('input'),
			question = $input.val();

		Base.request({
			url: 'question/editQuestion',
			params: {
				solutionId: $tr.attr('solutionId'),
				groupId: $tr.attr('groupId'),
				questionId: $tr.attr('id'),
				question: question,
			},
			callback: function(data) {
				if (data.status) {
					Base.gritter(data.message, false);
				} else {
					Base.gritter(data.message, true);
					var text = $tr.find('.queTitle').text();
					$tr.find('.queTitle').text((text.indexOf('[流程]') + 1) ? question + '[流程]' : question);
					$input.parent().fadeOut(function() {
						$(this).remove();
					});
				}
			},
		});
	});

	//ENTER
	$(document).on('keyup', function(e) {
		var $activeEl = $(document.activeElement);

		if ($activeEl.is('[placeholder=输入修改后的问题]') && (e.keyCode == 13 || e.keyCode == 108)) {
			$('.ensureQue').trigger('click');
		}
	});

	//取消修改问题
	$('body').on('click', '.cannelQue', function() {
		var $div = $(this).parent('div');

		$div.fadeOut(function() {
			$(this).remove();
		});
	});
	var $ansItem = null,
		$tr = null;
	//确认删除答案或问题
	$('#delYes').on('click', function() {
		var title = $('#tipTitle').text();

		if (title == '删除答案') {
			Base.request({
				url: 'answer/deleteAnswer',
				params: {
					solutionId: $ansItem.attr('solutionId'),
					groupId: $ansItem.attr('id'),
					id: $ansItem.attr('id'),
				},
				callback: function(data) {
					$('#delAnsConfirm').modal('hide');
					if (data.status) {
						Base.gritter(data.message, false);
					} else {
						Base.gritter(data.message, true);
						isJpage = 0;
						initSrc();
					}
				},
			});
		}
		if (title == '删除问题') {
			Base.request({
				url: 'question/delOptQuestionByIds',
				params: {
					ids: $tr.attr('id'),
				},
				callback: function(data) {
					$('#delAnsConfirm').modal('hide');
					if (data.status) {
						Base.gritter(data.message, false);
					} else {
						Base.gritter(data.message, true);
						if ($('.oneDelQue').length == 1) {
							if (pageNo >= 2) {
								pageNo -= 1;
							}
						}
						initSrc();
					}
				},
			});
		}
		if (title == '批量删除问题') {
			var ids = [];

			$('.singleCos').each(function() {
				var $tr = $(this).parents('tr'),
					id = $tr.attr('Id');

				if ($(this).is(':checked')) {
					ids.push(id);
				}
			});

			if (ids.toString()) {
				Base.request({
					url: 'question/delOptQuestionByIds',
					params: {
						ids: ids.toString(),
					},
					callback: function(data) {
						$('#delAnsConfirm').modal('hide');
						if (data.status) {
							Base.gritter(data.message, false);
						} else {
							Base.gritter(data.message, true);
							if ($('.oneDelQue').length == ids.length) {
								if (pageNo >= 2) {
									pageNo -= 1;
								}
							}
							initSrc();
						}
					},
				});
			} else {
				$('#delAnsConfirm').modal('hide');
				Base.gritter('勾选您要删除的问题', false);
			}
		}
	});

	//删除答案或问题
	$('body').on('click', '.oneDelAns, .multDelAns, .oneDelQue', function(e) {
		$ansItem = $(this).parents('.ansItem');
		$tr = $(this).parents('tr');

		var ansItemLen = $tr.find('.ansItem').length;

		if ($(e.target).is('.oneDelAns')) { //单个删除答案
			if (ansItemLen == 1) {
				var tmpOBj = {
					'message': '问题至少要有一个答案',
					'status': 1
				};
				yunNoty(tmpOBj);
			} else {
				$('#delAnsConfirm').modal('show');
				$('#tipTitle').text('删除答案');
				$('#tipWord').text('确认删除该答案？');
			}
		}
		if ($(e.target).is('.oneDelQue')) { //单个删除问题
			$('#delAnsConfirm').modal('show');
			$('#tipTitle').text('删除问题');
			$('#tipWord').text('删除该问题将会一并删除与之相关的答案、相似问法，确认删除该问题？（删除的问题可在知识库回收站中找回）');

		}
	});

	setInterval(function(){
		var ids = [];

		$('.singleCos').each(function() {
		  var $tr = $(this).parents('tr'),
				id = $tr.attr('Id');

		  if ($(this).is(':checked')) {
				ids.push(id);
		  }
		});

		if (!ids.toString()) {
			$('.multYDQue').css('cursor', 'not-allowed').css('color', '#aaa');
			$('.multYDQue').off('click', yyidongfenlei);
			$('.multDelQue').css('cursor', 'not-allowed').css('color', '#aaa');
			$('.multDelQue').off('click', piliangshanchu);
		} else {
			$('.multYDQue').css('cursor', 'pointer').css('color', '#666');
			$('.multYDQue').off('click', yyidongfenlei).on('click', yyidongfenlei);
			$('.multDelQue').css('cursor', 'pointer').css('color', '#666');
			$('.multDelQue').off('click', piliangshanchu).on('click', piliangshanchu);
		}
	},500);
	function piliangshanchu() {
		//批量删除问题
		var ids = [];
		$('.singleCos').each(function() {
			var $tr = $(this).parents('tr'),
				id = $tr.attr('Id');

			if ($(this).is(':checked')) {
				ids.push(id);
			}
		});
		if (!ids.toString()) {
			Base.gritter('勾选您要删除的问题', false);
			return false;
		}
		$('#delAnsConfirm').modal('show');
		$('#tipTitle').text('批量删除问题');
		$('#tipWord').text('删除这些问题将会一并删除与它们相关的答案、相似问法，确认批量删除问题？（删除的问题可在知识库回收站中找到）');
	}
	//移动分类
	function yyidongfenlei() {
		var ids = [];

		$('.singleCos').each(function() {
			var $tr = $(this).parents('tr'),
				id = $tr.attr('Id');

			if ($(this).is(':checked')) {
				ids.push(id);
			}
		});

		if (!ids.toString()) {
			Base.gritter('您未选择需要移动的问题', false);
			return false;
		}
		$('#YDConfirm').modal('show');
	}
	//移动分类确认
	$('#YDYes').on('click', function() {
		var ids = [];

		$('.singleCos').each(function() {
			var $tr = $(this).parents('tr'),
				id = $tr.attr('Id');

			if ($(this).is(':checked')) {
				ids.push(id);
			}
		});

		if (ids.toString()) {
			Base.request({
				url: 'question/moveQuestionClassify',
				params: {
					ids: ids.toString(),
					groupId: $('#YDGroupId').val() - 1
				},
				callback: function(data) {
					$('#YDConfirm').modal('hide');
					if (data.status) {
						Base.gritter(data.message, false);
					} else {
						Base.gritter(data.message, true);
						isJpage = 0;
						initSrc();
					}
				},
			});
		} else {
			Base.gritter('您未选择需要移动的问题', false);
		}
	});

	var pageNo2 = 1, //当前页
		pageSize2 = 10, //每页数量
		isJpage2 = 0, //是否已实例化jpage
		delPage2 = 0, //是否删除jpage
		solutionId2 = 0,
		groupId2 = 0;

	function initSrc2() {
		$('#tb02').tableAjaxLoader2(1);
		Base.request({
			url: 'question/findSimilarQuestion',
			params: {
				pageSize: pageSize2,
				pageNo: pageNo2,
				solutionId: solutionId2,
				groupId: groupId2,
			},
			callback: function(data) {
				if (data.status) {
					yunNoty(data);
				} else {
					var html = '';
					if (data.listSimilar[0]) {
						for (var i = 0; i < data.listSimilar.length; i++) {
							html += '<tr Id="' + data.listSimilar[i].Id + '" SolutionId="' + data.listSimilar[i].SolutionId + '">';
							html += '<td><span class="simQue">' + data.listSimilar[i].Question + '</span><span class="viewTimes"> [ 浏览' + (data.listSimilar[i].Hits || 0) + '次 ]</span></td>';
							html += '<td style="white-space: nowrap;"><a class=""><span class="editSim timeTip glyphicon glyphicon-pencil" title="修改"></span></a>';
							html += '<a class="delSimilar"><span class="timeTip glyphicon glyphicon-trash" title="删除"></span></a></td></tr>';
						}

						var options = {
							data: [data, 'listSimilar', 'total'],
							currentPage: data.currentPage,
							totalPages: data.totlePages ? data.totlePages : 1,
							alignment: 'right',
							onPageClicked: function(event, originalEvent, type, page) {
								pageNo2 = page;
								initSrc2();
							}
						};
						$('#itemContainer2').bootstrapPaginator(options);
					} else {
						html += '<tr class="emptyTip"><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
						$('#itemContainer2').empty();
					}
					$('.tbody2').empty().append(html);
					$('.timeTip').tooltip();


				}
			},
		});
	}

	//相似问法
	$('body').on('click', '.similar', function() {
		var $tr = $(this).parents('tr');

		solutionId2 = $tr.attr('solutionId');
		groupId2 = $tr.attr('groupId');

		initSrc2();

		$('.queShow').text('标准问题：' + $('.queTitle', $tr).text() || '');

		$('.tbody2').attr({
			'solutionid': solutionId2
		});
	});

	//添加相似问法
	$('body').on('click', '.addSim', function() {
		var question = $('.inputSim').val();
		//如果问题为空，提示用户输入问题，return
		if (!question) {
			yunNotyError('请输入问题');
			return;
		}
		var curSolutionId = $('.tbody2').attr('solutionid');

		Base.request({
			url: 'question/addSimilarQuestion',
			params: {
				solutionId: solutionId2,
				groupId: groupId2,
				question: question,
			},
			callback: function(data) {
				if (data.status) {
					Base.gritter(data.message, false);
				} else {
					Base.gritter(data.message, true);
					$('.inputSim').val('');

					//更新相似问法个数
					$('.tbody1 tr').each(function() {

						if ($(this).attr('solutionid') == curSolutionId) {
							$(this).find('.similar span').text('' + (($('.tbody2 tr:not(".emptyTip")').length || 0) + 1) + '个相似问法');
						}
					});
					initSrc2();
				}
			},
		});
	});

	//修改相似问法
	$('body').on('click', '.editSim', function() {
		var $tr = $(this).parents('tr'),
			$simQue = $tr.find('.simQue'),
			$simTr = $('<tr><td><input type="text" class="form-control" placeholder="输入修改后的问题" maxlength="200"></td><td></td><td style="vertical-align: middle;"><a class="ensureSim"><span class="timeTip glyphicon glyphicon-ok" title="确定"></span></a><a class="cannelSim"><span class="timeTip glyphicon glyphicon-remove" title="取消"></span></a></td></tr>');

		if (!$tr.next().find('.ensureSim')[0]) {
			$tr.after($simTr);
			$simTr.hide().fadeIn();
			$('.timeTip').tooltip();

			$simTr.find('input').val($simQue.text()).focus();
		}
	});

	//确认修改相似问法
	$('body').on('click', '.ensureSim', function() {
		editSimiQue(this);
	});

	//按回车键提交修改相似问法表单     未完成

	/*$('#simiQueTab').on('change','input[name=simiQue]',function(event){
    alert('111');
    if(event.keyCode==13){
      event.preventDefault();
      editSimiQue(this);
      return;
    }
  })*/

	//修改相似问法
	function editSimiQue(obj) {
		var $tr = $(obj).parents('tr'),
			question = $tr.find('input').val();

		Base.request({
			url: 'question/editSimilarQuestion',
			params: {
				id: $tr.prev().attr('id'),
				groupId: groupId2,
				question: question,
			},
			callback: function(data) {
				if (data.status) {
					yunNoty(data);
				} else {
					yunNoty(data);
					$tr.prev().find('.simQue').text(question);
					$tr.fadeOut(function() {
						$(this).remove();
					});
				}
			},
		});
	}

	//ENTER
	$(document).on('keyup', function(e) {
		var $activeEl = $(document.activeElement);

		if ($activeEl.is('[placeholder=输入修改后的问题]') && (e.keyCode == 13 || e.keyCode == 108)) {
			$('.ensureSim').trigger('click');
		}
	});

	//取消修改相似问法
	$('body').on('click', '.cannelSim', function() {
		var $tr = $(this).parents('tr');

		$tr.fadeOut(function() {
			$(this).remove();
		});
	});


	//删除问法
	$('body').on('click', '.delSimilar', function() {
		var $tr = $(this).parents('tr'),
			curSolutionId = $('.tbody2').attr('solutionid');

		Base.request({
			url: 'question/deleteSimilarQuestion',
			params: {
				id: $tr.attr('id'),
				groupId: groupId2,
			},
			callback: function(data) {
				if (data.status) {
					Base.gritter(data.message, false);
				} else {
					Base.gritter(data.message, true);
					if ($('.delSimilar').length == 1) {
						if (pageNo2 >= 2) {
							pageNo2 -= 1;
						}
					}

					//更新相似问法个数
					$('.tbody1 tr').each(function() {
						if ($(this).attr('solutionid') == curSolutionId) {
							$(this).find('.similar span').text('' + ($('.tbody2 tr').length-1) + '个相似问法');
						}
					});
					initSrc2();
					//$('.tbody1 tr').each(function() {
					//  if ($(this).attr('solutionid') == curSolutionId) {
					//    $(this).find('.similar span').attr({
					//      'data-original-title': '' + ($('.tbody2 tr').length - 1) + '个相似问法'
					//    });
					//  }
					//});
				}
			},
		});
	});

	//当前加背景
	$('body').on('mouseover', '.ansItem', function() {
		var $td = $(this).parents('td');
		$(this).addClass('ansItem_focus').siblings().removeClass('ansItem_focus');
	});

	//搜索
	$('.btnSearch').on('click', function() {
		pageNo = 1;
		isJpage = 0;
		if($('.input-group-btn .sortWord2').html() == '答案&nbsp;<span class="caret"></span>'){
    	if($('.searchBy').val() == undefined||$('.searchBy').val()==null){
	    	searchStr2 = 'answer='+'';
	    }else{
	    	searchStr2 = 'answer='+$('.searchBy').val();
	    }
	    searchStr1 = 'question='+'';
	    queryType = 2;
		}else{
    	if($('.searchBy').val() == undefined||$('.searchBy').val()==null){
	    	searchStr1 = 'question='+'';
	    }else{
	    	searchStr1 = 'question='+$('.searchBy').val();
	    }
	    searchStr2 = 'answer='+'';
	    queryType = 1;
		}
		initSrc();
	});
	$('.sortQue').on('click', function() {
		$('.sortWord2').html($(this).text() + '&nbsp;'+'<span class="caret"></span>');
		pageNo = 1;
		isJpage = 0;
	});
	$('.sortAns').on('click', function() {
		$('.sortWord2').html($(this).text() + '&nbsp;'+ '<span class="caret"></span>');
		pageNo = 1;
		isJpage = 0;
	});
	$('.sortLabel').on('click', function() {
		$('.sortWord2').html($(this).text() + '&nbsp;'+ '<span class="caret"></span>');
		pageNo = 1;
		isJpage = 0;
		searchStr = 'labelName=';
		queStr = $('.searchBy').val();
		queryType = 3;
		//initSrc();
	});
  
	$('.muiSee').on('click',function(){
  	$('.muiWord2').html($(this).text() + '&nbsp;'+ '<span class="caret"></span>');
  		pageNo = 1;
		isJpage = 0;
		//需要展示的可见状态
		visib = '';
		//需要设置的可见状态
		var doEditVisibstate=0;
		var id = '';
    	if($('.icheckbox_flat-blue').hasClass('checked')){
    		for(var i = 0; i < $('.icheckbox_flat-blue').length;i++){
    			if($('.icheckbox_flat-blue').eq(i).hasClass('checked')){
	    			$('#muiSeeModal').modal('show');
		    		$('#muiSeeModal .form-group .isCheck').text('勾选的问题');
		    		$('#muiSeeModal .form-group .isSee').text('可见！');
		    		id += $('.icheckbox_flat-blue').eq(i).parents('tr').attr('id')+',';
	    		}
    		}
    		$('#muiSeeModal #sureSee').unbind('click').bind('click',function(){
    			doEditVisib(id,doEditVisibstate);
    		});
    	}else{
    		$('#muiSeeModal').modal('show');
    		$('#muiSeeModal .form-group .isSee').text('可见！');
    		$('#muiSeeModal .form-group .isCheck').text('所有问题');
    		$('#muiSeeModal #sureSee').click(function(){
				doEditVisib(id,doEditVisibstate);
    		});
    	}
	});
  
	$('.muiNoSee').on('click',function(){
  	$('.muiWord2').html($(this).text() + '&nbsp;'+ '<span class="caret"></span>');
  		pageNo = 1;
		isJpage = 0;
		//需要展示的可见状态
		visib = '';
		//需要设置的可见状态
		var doEditVisibstate=1;
		var ids = '';
    	if($('.icheckbox_flat-blue').hasClass('checked')){
    		for(var i = 0; i < $('.icheckbox_flat-blue').length;i++){
    			if($('.icheckbox_flat-blue').eq(i).hasClass('checked')){
    				$('#muiSeeModal').modal('show');
		    		$('#muiSeeModal .form-group .isCheck').text('勾选的问题');
		    		$('#muiSeeModal .form-group .isSee').text('不可见！');
		    		ids += $('.icheckbox_flat-blue').eq(i).parents('tr').attr('id')+',';
    			}
    		}
    		$('#muiSeeModal #sureSee').unbind('click').bind('click',function(){
    			doEditVisib(ids,doEditVisibstate);
    		});
    	}else{
    		$('#muiSeeModal').modal('show');
    		$('#muiSeeModal .form-group .isSee').text('不可见！');
    		$('#muiSeeModal .form-group .isCheck').text('所有问题');
    		$('#muiSeeModal #sureSee').click(function(){
				doEditVisib(ids,doEditVisibstate);
			});
		}
	});
	function doEditVisib(id,visib){
		$.ajax({
			type:'post',
			url:'../../Question/doEditVisibility',
			data:{'ids':id,'visibility':visib},
			async:true,
			cache:true,
			success:function(data){
				$('#muiSeeModal').modal('hide');
				visib = '';
				//展示全部问题
				$('.solutionType').html('全部问题<span class="caret"></span>');
				initSrc();
			}
		});
	}

	//ENTER
	$(document).on('keyup', function(e) {
		var $activeEl = $(document.activeElement);
		if ($activeEl.is('.searchBy') && (e.keyCode == 13 || e.keyCode == 108)) {
			$('.btnSearch').trigger('click');
		}
	});

	//跳转
	$('.goPage-addSrc1 a').on('click', function() {
		$('.holder1').jPages(parseInt($('.goPage-addSrc1 input').val()));
		return false;
	});

	//全选
	$('.goPage-addSrc1 input').on('focus', function() {
		$(this).select();
	});
	//问题可见
	$('.sT0').on('click',function(){
		$('.solutionType').html($(this).text() + '<span class="caret"></span>');
		status = '';
		orderType = 4;
		pageNo = 1;
		visib = 0;
		initSrc();
	});
	//问题不可见
	$('.sT1').on('click',function(){
		$('.solutionType').html($(this).text() + '<span class="caret"></span>');
		status = '';
		orderType = 4;
		pageNo = 1;
		visib = 1;
		initSrc();
	});
	//显示全部问题
	$('.sTAll').on('click',function(){
		$('.solutionType').html($(this).text() + '<span class="caret"></span>');
		status = '';
		orderType = 4;
		pageNo = 1;
		visib = '';
		initSrc();
	})
	//排序
	$('.sort1').on('click', function() { //默认排序
		$('.sortWord').html($(this).text() + '<span class="caret"></span>');
		status = '';
		orderType = 14;
		pageNo = 1;
		initSrc();
	});
	$('.sort2').on('click', function() { //时间正序
		$('.sortWord').html($(this).text() + '<span class="caret"></span>');
		status = '';
		orderType = 1;
		pageNo = 1;
		initSrc();
	});
	$('.sort3').on('click', function() { //时间倒序
		$('.sortWord').html($(this).text() + '<span class="caret"></span>');
		status = '';
		orderType = 2;
		pageNo = 1;
		initSrc();
	});
	$('.sort4').on('click', function() { //浏览量正序
		$('.sortWord').html($(this).text() + '<span class="caret"></span>');
		status = '';
		orderType = 13;
		pageNo = 1;
		initSrc();
	});
	$('.sort5').on('click', function() { //浏览量倒序
		$('.sortWord').html($(this).text() + '<span class="caret"></span>');
		status = '';
		orderType = 14;
		pageNo = 1;
		initSrc();
	});
  
	$('.sort6').on('click', function() { //满意正序
	    $('.sortWord').html($(this).text() + '<span class="caret"></span>');
	    status = '';
	    orderType = 15;
	    pageNo = 1;
	    initSrc();
	});
	$('.sort7').on('click', function() { //满意倒序
		$('.sortWord').html($(this).text() + '<span class="caret"></span>');
		status = '';
		orderType = 16;
		pageNo = 1;
		initSrc();
	});

	$('.sort8').on('click', function() { //不满意正序
		$('.sortWord').html($(this).text() + '<span class="caret"></span>');
		status = '';
		orderType = 7;
		pageNo = 1;
		initSrc();
	});
	$('.sort9').on('click', function() { //不满意倒序
		$('.sortWord').html($(this).text() + '<span class="caret"></span>');
		status = '';
		orderType = 8;
		pageNo = 1;
		initSrc();
	});
  

	//全选
	$('body').on('ifChecked', '.multCos', function() {
		$('.singleCos').iCheck('check');
	});
	//全不选
	$('body').on('ifUnchecked', '.multCos', function() {
		$('.singleCos').iCheck('uncheck');
	});


	//展开所有
	$('.openAll').on('click', function() {
		var treeObj = $.fn.zTree.getZTreeObj('ztree1');
		treeObj.expandAll(true);
	});
	//折叠所有
	$('.closeAll').on('click', function() {
		var treeObj = $.fn.zTree.getZTreeObj('ztree1');
		treeObj.expandAll(false);
	});

	//展开所有
	$('.openAll2').on('click', function() {
		var treeObj2 = $.fn.zTree.getZTreeObj('ztree2');
		treeObj2.expandAll(true);
	});
	//折叠所有
	$('.closeAll2').on('click', function() {
		var treeObj2 = $.fn.zTree.getZTreeObj('ztree2');
		treeObj2.expandAll(false);
	});

	//展开所有
	$('.openAll3').on('click', function() {
		var treeObj3 = $.fn.zTree.getZTreeObj('ztree3');
		treeObj3.expandAll(true);
	});
	//折叠所有
	$('.closeAll3').on('click', function() {
		var treeObj3 = $.fn.zTree.getZTreeObj('ztree3');
		treeObj3.expandAll(false);
	});
});
