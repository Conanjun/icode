/*
 * 查看聊天记录通用js
 * staff/visitorLog
 * temp/qBList
 * knowledge/satisfaction
 */
function toRoad(dicCode) {
	if (window.data.listSource) {
		if (window.data.listSource[0]) {
			var html = '';
			for (var i = 0; i < window.data.listSource.length; i++) {
				if (window.data.listSource[i].DicCode == dicCode) {
					return window.data.listSource[i].DicDesc;
					break;
				}
			}
		}
	}
}
$(document).ready(function() {
	//聊天记录
	$('#chatModal').on('shown.bs.modal', function () {
		chatRecords(1, 'search');
	});
	$('.bcjl').click(function(){
		$('.chatV').val($('.tempValue').val());
		chatRecords(1);
	});
	$('.qbjl').click(function(){
		$('.bcjl').removeClass('active');
		$('.chatV').val('');
		chatRecords(1);
	});
	$('#visiterForm #searchChatRe').click(function(){
		$('.bcjl').removeClass('active');
		chatRecords();
	});
	//清空表单
	$('#chatModal').on('hidden.bs.modal', function () {
		$('#visiterForm input[type=text]').val('');
		$('#chatLogList').html('<ul class="chats"></ul>');
		$('#chatpageList').html('');
		$('.recordsChatUserId').val('');
		groupId = 0;
		$('#navChatLogOne .ztreeName2').text('全部分类');
		$('#navChatLogTwo .ztreeName3').text('全部分类');
	});
	// 悬浮生成框
	$('body').on('mouseenter', '.wrap', function() {
		if($(this).attr('ischecked')=='1'){}else{
			$(this).find('.wrapInner').show().siblings('.wrapBtn').show();
		}
	});
	$('body').on('mouseleave', '.wrap', function() {
		if($(this).attr('ischecked')=='1'){}else{
			$(this).find('.wrapInner').hide().siblings('.wrapBtn').hide();
		}
	});
	// 弹出框
	$('#chatCheckModal').on('shown.bs.modal', function() {
		findQualityType();
		getList();
		chatRecords(1);
		$('.sendCheck2').hide();
		$('#visiterForm input').val('');
	});
	// 隐藏框 #1
	$('#chatCheckModal').on('hidden.bs.modal', function() {
		$('.sendCheck').hide();
		$('.sendCheck').parent().css('height', '');
	});
	//点击取消 隐藏页面
	$('.cancel').click(function(){
		$('.sendCheck').hide();
		$('.sendCheck').parent().css('height', '');
	});
	var listclassesflag = true;
	// 生成质检框 #1
	$('body').on('click', '.wrapBtn', function(){
		if(!$(this).hasClass('hasTest')){
			$li = $(this).prevAll('.out');
			var	inN = $li.data('question');
			$('[name=formatQue]').val(inN);
			$('.sendCheck').show();
			if($(window).width() > 992) {
				$('.sendCheck').parent().css('height', '600px');
			} else {
				$('.sendCheck').parent().css('height', '830px');
			}
			$('.wrap').trigger('mouseleave');
			if (!+$('.pauseBtn').attr('isPause')){ // start
				$('.pauseBtn').trigger('click');
			}
			$('#qualityForm input[name=uuid]').val($li.data('uid'));
			$('#qualityForm input[name=chatVersion]').val($li.data('chatversion'));
			$('#qualityForm input[name=chatlogId]').val($li.data('id'));
			if(listclassesflag) {
				// 渠道
				Base.request({
					url: 'Configuration/showSourceByWebId',
					callback: function(data) {
						if (data.status) {
							Base.gritter(data.message, false);
						} else {
							if (data.listSource) {
								if (data.listSource[0]) {
									var html = '';
									for (var i = 0; i < data.listSource.length; i++) {
										html += '<option value="' + data.listSource[i].DicCode + '">' + data.listSource[i].DicDesc + '</option>';
									}
									$('[name=sourceId]').empty().append(html);
								}
							}
							window.data = data;
						}
					},
				});
					findQualityType();
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
								$.fn.zTree.init($("#tanchutree1"), setting1, formatData);
								$.fn.zTree.init($("#tanchutree2"), setting2, formatData);
								$.fn.zTree.init($("#tanchutree3"), setting3, formatData);
							} else {

							}

						}
					},
				});
				listclassesflag = false;
			}
			hasAns();
			simiQue();
			getRule();
		}
		
	});
	// 隐藏质检框
	$('.closeCheck').on('click', function() {
		$('.sendCheck').hide();
	});
	
	
	
	
	
					var pageNo = 1,
						pageSize = 20,
						mode = 2; // 1会话质检结果 2聊天质检结果
					$tr = null; // 当前tr

					//ENTER
					$(document).on('keyup', function(e) {
						var $activeEl = $(document.activeElement);

						if ($activeEl.is('[name=content2]') && (e.keyCode == 13 || e.keyCode == 108)) {
							$('.search').trigger('click');
						}
					});
					//ENTER
					$(document).on('keyup', function(e) {
						var $activeEl = $(document.activeElement);

						if ($activeEl.is('[name=value]') && (e.keyCode == 13 || e.keyCode == 108)) {
							$('.ensure-type').trigger('click');
						}
					});

					var status = '';
					//状态
					$('.sort1').on('click', function() { //默认状态
						$('.sortWord').html($(this).text() +' '+ '<span class="caret"></span>');
						status = '';
						listCheckLogItem();
					});
					$('.sort2').on('click', function() { //未处理状态
						$('.sortWord').html($(this).text() +' '+ '<span class="caret"></span>');
						status = 0;
						listCheckLogItem();
					});
					$('.sort3').on('click', function() { //已处理状态
						$('.sortWord').html($(this).text() +' '+ '<span class="caret"></span>');
						status = 1;
						listCheckLogItem();
					});

					// 聊天质检
					function listCheckLogItem() {
					}

					// 会话质检
					function listCheckLoginSummary() {
					}

					// 处理聊天质检
					function addCheckResult() {
						Base.request({
							url: 'QualityCheck/addCheckResult',
							params: {
								mode: mode,
								modeValue: mode == 1 ? $tr.attr('lsId') : $tr.attr('chatlogId'), // 1会话质检结果 2聊天质检结果
								type: $('[name=type]').val(),
								content: $('[name=content]').val(),
								result: $('[name=result]').val(),
							},
							callback: function(data) {
								yunNoty(data);
								
								if (data.status) {} else {
									$('#modal-edit').modal('hide');
								}
							},
						});
					}

					// 搜索
					$('.search').on('click', function() {
						if (mode == 1) { // 1会话质检结果
							listCheckLoginSummary();
						} else { // 2聊天质检结果
							listCheckLogItem();
						}
					})

					// 切换tab
					$('[href*=chatCheck]').on('click', function() {
						mode = 2; // 1会话质检结果 2聊天质检结果
						listCheckLogItem();
					})
					$('[href*=dialogCheck]').on('click', function() {
						mode = 1; // 1会话质检结果 2聊天质检结果
						listCheckLoginSummary();
					})

					// 处理/详情
					$('body').on('click', '.chatEdit, .chatDetail', function(e) {
						$tr = $(this).parents('tr');
						// 处理
						if ($(e.target).is('.chatEdit')) {
							$('.chatCtnEdit').show();
							$('.ensure-check').show();
							$('.chatCtn').hide();
						}
						// 详情
						if ($(e.target).is('.chatDetail')) {
							$('.ensure-check').hide();
							$('.chatCtnEdit').hide();
							$('.chatCtn').show();
						}
						$('.question').text($tr.attr('question') || '');
						$('.count').text($tr.attr('count') || '');
						$('.isDeal').text(($tr.attr('isDeal') || '') ? '已处理' : '未处理');
						/*if (+($tr.attr('isDeal') || '')) {
							$('.chatCtnEdit').hide();
						} else {
							$('.chatCtnEdit').show();
						}*/

						var html = '';
						var ListChatlogQualityCheck2 = JSON.parse(('' + $tr.attr('ListChatlogQualityCheck2')).replace(/\'/g, '\"'));
						if (ListChatlogQualityCheck2) {
							if (ListChatlogQualityCheck2[0]) {
								for (var i = ListChatlogQualityCheck2.length - 1; i >= 0; i--) {
									html += '<div class="chatCtnDetail"><label class="extend bold">第' + (ListChatlogQualityCheck2.length - i) + '次质检</label><div style="display: none;" class="chatCtnDetailCtn"><label class="bold">质检人</label><div>' +
										ListChatlogQualityCheck2[i].Username + '</div><label class="bold">质检得分</label><div>' + ListChatlogQualityCheck2[i].Score + '</div><label class="bold">质检类型</label><div>' + ListChatlogQualityCheck2[i].TypeName +
										'</div><label class="bold">质检时间</label><div>' + ListChatlogQualityCheck2[i].DateTime + '</div><label class="bold">质检评语</label><div>' + ListChatlogQualityCheck2[i].QualityContent + '</div></div></div>';
								}
							}
						}
						html += '<div class="chatCtnDetail"><label class="extend bold">第' + (ListChatlogQualityCheck2 ? (ListChatlogQualityCheck2.length + 1) : 1) + '次质检</label><div class="chatCtnDetailCtn"><label class="bold">质检人</label><div>' + $tr.attr(
								'Username') + '</div><label class="bold">质检得分</label><div>' + $tr.attr('Score') + '</div><label class="bold">质检类型</label><div>' + $tr.attr('TypeName') + '</div><label class="bold">质检时间</label><div>' + $tr.attr('DateTime') +
							'</div><label class="bold">质检评语</label><div>' + $tr.attr('QualityContent') + '</div></div></div>';
						$('.chatCtnBody').empty().append(html);
						$('#modal-edit').modal('show');
					})

					// 显隐质检详细
					$('body').on('click', '.extend', function() {
						$(this).siblings().slideDown().parents('.chatCtnDetail').siblings().find('.chatCtnDetailCtn').slideUp();
					})

					// 确认处理
					$('.ensure-check').on('click', function() {
						addCheckResult();
						$('.chatCtnEdit input').val('');
						$('.chatCtnEdit textarea').val('');
						
						if($('#page-container .listUl li').eq(0).hasClass('active')){
							listCheckLogItem();
						}else{
							listCheckLoginSummary();
						}
					})
					var firstTime = true;
					// 聊天记录
					$('body').on('click', '.chatRead', function() {
						firstTime = true;
						$tr = $(this).parents('tr');
						$('[name=chtvs]').val($tr.attr('ChatVersion') || '');
						$('[name=chatUserId]').val($tr.attr('ChatUserId') || '');
						$('#chatCheckModal').modal('show');
					})

					var pageNo2 = 1,
						pageSize2 = 10,
						$li = null,
						$tr2 = null,
						checkItemCount = 0;

					// 弹出框
					$('#chatCheckModal').on('shown.bs.modal', function() {
						findQualityType();
						getList();
						chatRecords(1);
						$('.sendCheck2').hide();
						$('#visiterForm input').val('');
					});
					// 隐藏框 #1
					$('#chatCheckModal').on('hidden.bs.modal', function() {
						$('.sendCheck').hide();
					});
					// 隐藏框
					$('#chatModal').on('hidden.bs.modal', function() {
						$('[name=chtvs]').val('');
						$('[name=chatUserId]').val('');
					});

					// 弹出质检框
					$('.addCheck').on('click', function() {
						$('#chatCheckModal').modal('show');
					})

					var $tr3 = null;


					function findQualityType() {
						Base.request({
							url: 'QualityCheck/findQualityType',
							params: {},
							callback: function(data) {
								if (data.status) {
									yunNoty(data);
									$('.addCheckType').trigger('click');
									$('#chatCheckModal').modal('hide');
									var _html = '<tr><td colspan=\"9\" style=\"text-align:center;\"><i class=\"icon-exclamation-sign\"></i>  当前纪录为空！</td></tr>';
									$('#checkType tbody').empty().append(_html);
								} else { //
									var html = '',
										_html = '';
									if (data.list[0]) {
										for (var i = 0; i < data.list.length; i++) {
											html += '<option value="' + data.list[i].Id + '">' + data.list[i].Value + '</option>';

											var params = '';
											for (var key in data.list[i]) {
												params += key + '="' + ('' + data.list[i][key] || '').replace(/\"/g, '\'') + '" ';
											}
											var tmpValue=data.list[i].Value;
											_html += '<tr ' + params + '><td>' + (tmpValue || '') + '</td><td>' + (data.list[i].AddTime || '') +
												'</td>';
											if(tmpValue=='句子重点匹配错误' || tmpValue=='未考虑上下文' || tmpValue=='缺乏语义层面匹配' || tmpValue=='缺乏相似问法/模板' || tmpValue=='缺乏近义词/等价词' || tmpValue=='核心实体匹配失败'){										
												_html+='<td style="white-space: nowrap;">系统默认</td>';
											}else{
												_html+='<td style="white-space: nowrap;"><a class="typeEdit btns" href="javascript:;" title="">修改</a><a class="typeDel btns" href="javascript:;" title="">删除</a></td>';
											}
											
											_html +='</tr>';
										}
									} else {
										_html += '<tr><td colspan=\"9\" style=\"text-align:center;\"><i class=\"icon-exclamation-sign\"></i>  当前纪录为空！</td></tr>';
									}
									$('[name=qualityModeId]').empty().append(html);
									$('[name=qualityModeId2]').empty().append(html);
									$('#checkType tbody').empty().append(_html);
								}
							},
						});
					}

					// 删除质检类型
					$('body').on('click', '.typeDel', function() {
						$tr3 = $(this).parents('tr');
						Base.request({
							url: 'QualityCheck/delQualityType',
							params: {
								id: $tr3.attr('id'),
							},
							callback: function(data) {
								if (data.status) {
									yunNoty(data);
								} else { //
									$tr3=null;
									findQualityType();
								}
							},
						});
					})

					// 修改质检类型
					$('body').on('click', '.typeEdit', function() {
						$tr3 = $(this).parents('tr');
						$('[name=value]').val($tr3.attr('Value'));
						$('.ensure-type').text('修改');
					})

					// 弹出质检类型框
					$('.addCheckType').on('click', function() {
						$('#modal-type').modal('show');
					})
					// 确认添加质检类型
					$('.ensure-type').on('click', function() {
						var id = '';
						if ($tr3) {
							id = $tr3.attr('id');
						}
						Base.request({
							url: 'QualityCheck/addOrEditQualityType',
							params: {
								value: $('[name=value]').val(),
								id: id,
							},
							callback: function(data) {
								if (data.status) {
									yunNoty(data);
								} else { //
									$tr3=null;
									findQualityType();
									$('#modal-type').modal('hide');
								}
							},
						});
					})

					// 质检类型框消失后
					$('#modal-type').on('hidden.bs.modal', function() {
						$tr3 = null;
						$('[name=value]').val('');
						$('.ensure-type').text('添加');
					});

					// 生成质检框 #1
					$('body').on('click', '.wrapBtn', function(){
						if(!$(this).hasClass('hasTest')){
							$li = $(this).prevAll('.out');
							var	inN = $li.data('question');
							$('[name=formatQue]').val(inN);
							$('.sendCheck').show();
							$('.wrap').trigger('mouseleave');
							if (!+$('.pauseBtn').attr('isPause')){ // start
								$('.pauseBtn').trigger('click');
							}
							$('#qualityForm input[name=uuid]').val($li.data('uid'));
							$('#qualityForm input[name=chatVersion]').val($li.data('chatversion'));
							$('#qualityForm input[name=chatlogId]').val($li.data('id'));
							hasAns();
							simiQue();
							getRule();
						}
						
					})
					// 隐藏质检框
					$('.closeCheck').on('click', function() {
						$('.sendCheck').hide();
					})

					// 确认会话质检
					$('.ensure-check22').on('click', function() {
						Base.request({
							url: 'QualityCheck/checkLoginSummary',
							params: {
								lsId: $tr2.attr('id'),
								chatVersion: $tr2.attr('chatVersion'),
								checkItemCount: checkItemCount,
								timeSpan: $tr2.attr('staytime'),
								qualityModeId: $('[name=qualityModeId2]').val(),
								score: $('[name=score2]').val(),
								qualityContent: $('[name=qualityContent2]').val(),
							},
							callback: function(data) {
								yunNoty(data);
								if (data.status) {} else { //
									$('.closeCheck').trigger('click');
									$('[name=score2]').val('');
									$('[name=qualityContent2]').val('');
								}
							},
						});
						
					})

					// 确认聊天质检
					$('.ensure-check2').on('click', function() {
						Base.request({
							url: 'QualityCheck/checkLogItem',
							params: {
								uuid: $li.data('Uid'),
								chatVersion: $li.data('chatVersion'),
								chatlogId: $li.data('Id'),
								qualityModeId: $('[name=qualityModeId]').val(),
								score: $('[name=score]').val(),
								qualityContent: $('[name=qualityContent]').val(),
							},
							callback: function(data) {
								yunNoty(data);
								if (data.status) {} else { //
									$('.closeCheck').trigger('click');
									$('[name=score]').val('');
									$('[name=qualityContent]').val('');
									$('.ensure-type').text('添加');
									listCheckLogItem();
								}
							},
						});
					})
					// 搜索
					$('#searchChatRe2').on('click', function() {
						getList();
					})
					// 清空
					$('#resetBtn').on('click', function() {
						$('#visiterForm')[0].reset();
					})

					// 访客日志(仅)
					function getList() {
						var STime = $('#visiterForm input[name=startTime]').val();
						var ETime = $('#visiterForm input[name=endTime]').val();
						var d1 = new Date(STime.replace(/\-/g, "\/")).getTime();
						var d2 = new Date(ETime.replace(/\-/g, "\/")).getTime();
						if(STime || ETime){
							if (STime === "" || ETime === "") {
								Base.gritter('请输入完整的时间段！', false);
								return false;
							}
							if (STime !== "" && ETime !== "" && d1 >= d2) {
								Base.gritter('开始时间不能大于结束时间！', false);
								return false;
							}
						}
						Base.request({
							url: 'loginsummary/getList',
							params: {
								pageNo: pageNo2,
								pageSize: pageSize2,
								logItems: 1, // #1
							},
							$formObj: $('#visiterForm'),
							callback: function(data) {
								if (data.status) {
									yunNoty(data);
								} else {
									var html = '';
									if (data.list[0]) {
										for (var i = 0; i < data.list.length; i++) {
											var params = '';
											for (var key in data.list[i]) {
												params += key + '="' + ('' + data.list[i][key] || '').replace(/\"/g, '\'') + '" ';
											}
											html += '<tr class="go" ' + params + '><td>' + toRoad(data.list[i].SourceId || '') + '(Id=' + (data.list[i].ChatUserId || '') + ')</td><td>' + (data.list[i].LoadTimes || '') + '</td><td>' + (data.list[i].StayTime || 0) +
												'秒</td></tr>';
										}
										var options = {
											data: [data, 'list', 'total'],
											currentPage: data.currentPage,
											totalPages: data.totlePages,
											alignment: 'right',
											onPageClicked: function(event, originalEvent, type, page) {
												pageNo2 = page;
												getList(); // 后台为返回分页
											}
										};
										$('#logpageList').bootstrapPaginator(options);
									} else {
										html += '<tr><td colspan=\"9\" style=\"text-align:center;\"><i class=\"icon-exclamation-sign\"></i>  当前纪录为空！</td></tr>';
										$('#logpageList').empty();
									}
									$('#visiterlogList tbody').empty().append(html);
									if ($('.go:first')[0]) {
									} else {
										$('#chatLogList').find('ul').html('<li style=\"text-align:center;\"><i class=\"icon-exclamation-sign\"></i>  当前纪录为空</li>');
									}

									$('.modalLeft .slim').slimScroll({
										height: 500
									});
									//$('#visiterlogList tbody').children('.go').eq(0).trigger('click');
								}
							},
						});
					}
					
					
					
					
//提示还可以输入多少字
					$('#insert').addWordCount(200);

					//相似问法分类
					var setting1 = {
						data: {
							simpleData: {
								enable: true,
							},
						},
						view: { //不显示图标
							showIcon: false
						},
						callback: {
							onClick: function(event, treeId, treeNode) {
								//获取当前分类的ID
								$('#nav-pills-tab-1 input[name=groupId]').val(treeNode.id-1);
								$('#tanchutree1').fadeOut();
                                $('#nav-pills-tab-1 .ztreeName1').html(treeNode.name);
                                pageNo2=1;
								simiQue();
							}
						}
					};
					//已有答案分类
					var setting2 = {
						data: {
							simpleData: {
								enable: true,
							},
						},
						view: { //不显示图标
							showIcon: false
						},
						callback: {
							onClick: function(event, treeId, treeNode) {
								$('#tanchutree2').fadeOut();
								$('#navChatLogOne .ztreeName2').html(treeNode.name);
                                $('#navChatLogOne input[name=groupId]').val(treeNode.id-1);
                                pageNo2=1;
								/*
								 * taskId = 429 智能学习未知问题编辑答案回答时，多次变价仅回答并学习按钮不置灰
								 *  判断是否是已有答案回答，如果是则执行hasAns
								 */
								if($('.nav-pills li.active a[href="#navChatLogOne"]').text() == '已有答案回答'){
									hasAns();
								}
							}
						}
					};

					//编辑答案
					var setting3 = {
						data: {
							simpleData: {
								enable: true,
							},
						},
						view: { //不显示图标
							showIcon: false
						},
						callback: {
							onClick: function(event, treeId, treeNode) {
								$('#navChatLogTwo input[name=groupId]').val(treeNode.id-1);
								$('#tanchutree3').fadeOut();
								$('.ztreeName3').html(treeNode.name);
							},
							onCheck: function(event, treeId, treeNode) {
								if (isMove) {
									if (treeNode.checked) {
										Base.request({
											url: 'LearnQue/ensureGroup',
											params: {
												groupId: treeNode.id - 1,
												id: $move.attr('id'),
											},
											callback: function(data) {
												if (data.status) {
													Base.gritter(data.message, false);
												} else {
													Base.gritter(data.message, true);
												}
												isMove = false;
												$move.remove();
												$('#' + treeNode.tId + '_check').trigger('click');
											},
										});
									}
								}
							},
						}
					};

					//点击弹出树
					$('.ztreeName1').click(function(){
						$('#tanchutree1').toggle();
					});

					$('.ztreeName2').click(function(){
						$('#tanchutree2').toggle();
					});

					$('.ztreeName3').click(function(){
						$('#tanchutree3').toggle();
					});
					//生效角色
					//生效角色树
					var setting = {
						check: {
							enable: true,
							chkboxType: { "Y" : "ps", "N" : "ps" }
						},
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
							dblClickExpand: false,
							selectedMulti : false,
							showIcon: false
						},
						async : {
							enable: true,
							url: "../../comb/loadCombs",
							autoParam: ["id"],
							dataFilter: function(treeId, parentNode, responseData) {
								if (responseData) {
									return responseData.list;
								}
								return responseData;
							}
						},
						callback : {
							beforeClick: function(treeId, treeNode) {
								var zTree = $.fn.zTree.getZTreeObj("treeQueClass");
								zTree.checkNode(treeNode, !treeNode.checked, null, true);
								return false;
							},
							onCheck: function(e, treeId, treeNode) {
								var zTree = $.fn.zTree.getZTreeObj("treeQueClass");
								nodes = zTree.getCheckedNodes(true);
								v = "";
								I = "";
								for (var i=0, l=nodes.length; i<l; i++) {
									if (nodes[i].Leaf == 1) {
										v += nodes[i].Name + ",";
										I += nodes[i].Id + "~";
									}
								}
								if (v.length > 0 ) v = v.substring(0, v.length-1);
								if (I.length > 0 ) I = I.substring(0, I.length-1);

								$("#juese").html(v);
								$("#QuestionClassModel input[name=hasCheckedId]").val(I);
								
							},
							onAsyncSuccess: function(event, treeId, treeNode) {
								var zTree = $.fn.zTree.getZTreeObj("treeQueClass");
								var IdString = $("#QuestionClassModel input[name=hasCheckedId]").val();
								if(IdString) {
									var Ids = IdString.split('~');
									var node = null;
									for(i = 0 ; i < Ids.length; i ++ ) {
										zTree.checkNode( zTree.getNodeByParam( "Id", Ids[i] ), true );
									}
								}
							}
						}
					};

					$('#QuestionClassModel').on('show.bs.modal',function(){
						$.fn.zTree.init($("#treeQueClass"), setting);
					})
					// 点击td自动选中input
					$('#navChatLogOne').on('click', 'td', function() {
						$(this).parents('tr').find('input').iCheck('check');
					});
					
							//取消选择生效角色
					$('#selClassBtn').click(function(){
						$("#QuestionClassModel input[name=hasCheckedId]").val('');
						$("#juese").html('来访者角色');
					})
					$('#navChatLogOne .dropdown-menu li>a').click(function(){
						var tmpHtml=$(this).html();
						if(tmpHtml=='问题'){
							$('#navChatLogOne input[class=searchInput]').attr('name','question');
							$('#navChatLogOne .curHtml').html('问题');
						}else if(tmpHtml=='答案'){
							$('#navChatLogOne .curHtml').html('答案');
							$('#navChatLogOne input[class=searchInput]').attr('name','answer');
						}
					})
					//质检得分只只能输入数字
					$("#qualityForm input[name=score]").keyup(function(){ 
						var tmptxt=$(this).val();       
            			$(this).val(tmptxt.replace(/\D|^0/g,''));  
					})
					$(".sendCheck2 input[name=score2]").keyup(function(){ 
						var tmptxt=$(this).val();       
            			$(this).val(tmptxt.replace(/\D|^0/g,''));  
					})
					
					$('#navChatLogOne .searchHasAns').click(function(){
						hasAns();
					})
					
					//已有答案回答
					function hasAns(pageNo2) {
						if(!pageNo2){pageNo2=1}
						$("#nav-pills-tab-2-form input[name=pageNo]").val(pageNo2);
						$.ajax({
							type: 'post',
							datatype: 'json',
							cache: false,
							url: encodeURI('/question/getQueList'),
							data: $("#nav-pills-tab-2-form").serialize(),
							success: function(data) {
								if (data.status == 0) {
									if (data.questionList && data.questionList[0]) {
										var html='';
                        for (var i = 0; i < data.questionList.length; i++) {
                            html += '<tr Id="' + (data.questionList[i].Id || '') + '"  SolutionId="' + (data.questionList[i].SolutionId || '') + '">';
							html += '<td style="text-align: center;"><input class="singleAnsCos" type="radio" name="ansQue"></td>';
							if (data.questionList[i].SolutionType == 2) {
								var link = '/web/knowledge/editFlow.html?questionId=' + data.questionList[i].Id + '&groupId=' + data.questionList[i].GroupId + '&solutionId=' + data.questionList[i].SolutionId;
								html += '<td class="cosInput clickop" data-link="'+link+'" data-isf="1">' + (data.questionList[i].Question || '') + '</td>';
							} else {
								link = '/web/knowledge/queDetail.html?id=' + data.questionList[i].Id;
								html += '<td class="cosInput clickop" data-link="'+link+'" data-isf="0">' + (data.questionList[i].Question || '') + '</td>';
							}
							html += '<td class="cosInput" style="position:relative;"><div class="minheight1" style="max-width: 300px;">';
							data.questionList[i].ListAnswer.forEach(function(el, i){
								if(i == 0) {
									html += '<div class="ccca">' + (el.Answer || '') + '</div>';
								} else {
									html += '<div class="ccca" style="display:none;">' + (el.Answer || '') + '</div>';
								}
							});
							if(data.questionList[i].ListAnswer.length > 1) {
								html += '</div><span style="position:absolute;top:10px;right:0;"><i class="fa fa-chevron-up rotog"></span></td>';
							} else {
								html += '</div></td>';
							}
							html += '<td>' + (data.questionList[i].AddTime || '') + '</td></tr>';
                        }
		
										var options = {
											currentPage: data.currentPage,
											totalPages: data.totlePages ? data.totlePages : 1,
											alignment: 'right',
											onPageClicked: function(event, originalEvent, type, page) {
												hasAns(page);
											}
										};
										$('#itemContainer2').bootstrapPaginator(options);
									} else {
										html += '<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
										$('#itemContainer2').empty();
									}
									$('#navChatLogOne .tbody2').empty().append(html);
									icheckInit();
									$('.rotog').on('click', function(){
										if($(this).hasClass('fa-chevron-up')) {
											$(this).removeClass('fa-chevron-up').addClass('fa-chevron-down');
											$(this).parent().parent().find('.minheight1').children(':not(:first-child)').show();
										} else {
											$(this).removeClass('fa-chevron-down').addClass('fa-chevron-up');
											$(this).parent().parent().find('.minheight1').children(':not(:first-child)').hide();
										}
									});
									$('.clickop').on('dblclick', function(){
										if($(this).data('isf')) {
											ifbOpenWindowInNewTab($(this).data('link'), '流程详细');
										} else {
											ifbOpenWindowInNewTab($(this).data('link'), '问题详细');
										}
									});
								} else {
									yunNoty(data);
								}
							}
						});
					}
		
					$('#nav-pills-tab-1-form .searchSimiQue').click(function(){
						simiQue();
					})
					// 相似问题答案回答
					function simiQue(pageNo2) {
						if(!pageNo2)pageNo2=1
						$("#nav-pills-tab-1-form input[name=pageNo]").val(pageNo2);
						$.ajax({
							type: 'post',
							datatype: 'json',
							cache: false,
							url: encodeURI('/question/listQue'),
							data: $("#nav-pills-tab-1-form").serialize(),
							success: function(data) {
								if (data.status == 0) {
									if (data.ListQue && data.ListQue.length>0) {
										var html='';
										for (var i = 0; i < data.ListQue.length; i++) {
											html += '<tr Id="' + (data.ListQue[i].Id || '') + '"  SolutionId="' + (data.ListQue[i].SolutionId || '') + '">';
											html += '<td width="50"><input class="singleAnsCos" type="radio" name="ansQue"></td>';
											html += '<td class="cosInput" ><div class="minheight1">' + (data.ListQue[i].Question || '') + '</div></td>';
											html += '<td class="cosInput" style="white-space: nowrap;">' + (data.ListQue[i].Time || '') + '</td>';
											html += '</tr>';
										}
										var options = {
											currentPage: data.currentPage,
											totalPages: data.totlePages ? data.totlePages : 1,
											alignment: 'right',
											onPageClicked: function(event, originalEvent, type, page) {
												simiQue(page);
											}
										};
										$('#itemContainer').bootstrapPaginator(options);
									} else {
										html += '<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
										$('#itemContainer').empty();
									}
									$('#nav-pills-tab-1 .tbody1').empty().append(html);
									icheckInit();
								} else {
									yunNoty(data);
								}
							}
						});
					}
					//编辑答案中的生效渠道
					function getRule() {
						$.ajax({
							type: 'post',
							datatype: 'json',
							cache: false,
							//不从缓存中去数据
							url: encodeURI('../../Configuration/listAllItem'),
							success: function(data) {
								if(data.status === 0) {
									var List = [];
									if(data.listItem) {
										List = data.listItem;
									} else {
										return;
									}
									for(var i in List) {
										if(List[i].ConfigItemDesc == '生效渠道') {
											if(List[i].IsDisplay === 1) {
												$('#warpRules').remove();
											} else if(List[i].IsDisplay === 0) {
												$.ajax({
													type: 'post',
													datatype: 'json',
													cache: false,
													//不从缓存中去数据
													url: encodeURI('../../Configuration/listValue'),
													data: {
														itemId: List[i].Id
													},
													success: function(data) {
														if(data.status === 0) {
															if(data.listValue) {
																$('#chooseAll').empty();
																$('#chooseAll').append('<input id="wayAll" type="checkbox"><label for="wayAll" style="margin: 5px;">全选</label>');
																$('#wayAll').iCheck({
																	checkboxClass: 'icheckbox_flat-blue',
																	radioClass: 'iradio_flat-blue',
																	cursor: true
																});
																for(var key in data.listValue) {
																	$('#chooseAll').append('<a class="btn btn-white m-r-5 m-b-5" fid="'+data.listValue[key].DicCode+'">'+data.listValue[key].DicDesc+'</a>');
																}
															}
														}
													}
												});
											}
										} else if(List[i].ConfigItemDesc == '生效角色') {
											if(List[i].IsDisplay === 1) {
												$('#warpRoles').remove();
											}
										}
									}
								}
							}
						});
					}
					/*============判断农信配置是否启用=============*/
					function nxQiYong(){
						if(sessionStorage.getItem('qAndACloseValue') == 1){
							$(".testAndlearn").css({
								'pointer-events': 'all',
								'color':'#fff'
							});
							$('.testAndlearn').removeClass('btn-primary').addClass('btn-default').attr('disabled','disabled');
						}else{
							$(".testAndlearn").css({
								'pointer-events': 'painted',
								'color':'#fff'
							});
							$('.testAndlearn').removeClass('btn-default').addClass('btn-primary').attr('disabled',false);
						}
					}

					$('a[href=#navChatLogTwo]').click(function(){
						groupId = 0;
						$('#navChatLogTwo .ztreeName3').text('全部分类');
						nxQiYong();
					});
					$('a[href=#navChatLogOne]').click(function(){
						groupId = 0;
						$('#navChatLogOne .ztreeName2').text('全部分类');
						$(".testAndlearn").css({
							'pointer-events': 'painted',
							'color':'#fff'
						});
						$('.testAndlearn').removeClass('btn-default').addClass('btn-primary').attr('disabled',false);
					});

					//生效渠道
					$('body').on('click', 'a[fid]', function(e) {
						if($(e.target).hasClass('btn-primary')) {
							$(e.target).removeClass('btn-primary');
							$(e.target).attr('ckb', 0);
						} else {
							$(e.target).addClass('btn-primary');
							$(e.target).attr('ckb', 1);
						}
					});
					$('body').on('ifClicked', '#wayAll', function() {
						if ($(this)[0].checked) {
							$('a[fid]').removeClass('btn-primary');
							$('a[fid]').attr('ckb', 0);
						} else {
							$('a[fid]').addClass('btn-primary');
							$('a[fid]').attr('ckb', 1);
						}
					});
					
					$('body').on('click','.testOnly',function(){
						replayTest(0);
					})
					$('body').on('click','.testAndlearn',function(){
						replayTest(1);
					})
		
					//仅质检 点击提交到后台
					function replayTest(learnFlag){
						var qId='',sId='',effectiveRules = [],tmpUrl='';//相似问题的问题id和答案的solutionId
						var tmpStatus=$('.nav-pills-chg li.active').attr('status');
						if(tmpStatus==1 || tmpStatus==3){
							//当前的答案模式是相似问题答案回答或者是已有答案回答
							$('.tab-content .singleAnsCos').each(function() {
								if ($(this).prop('checked')) {
									qId = $(this).parents('tr').attr('id');
									sId = $(this).parents('tr').attr('solutionId');
								}
							});
							
							tmpUrl='&id='+qId+'&solutionId='+sId;
							//相似和已有答案的区分
							if(tmpStatus==3){
								if(!qId && !sId){
									var tmpData={"message":"请选择问题","status":1}
									yunNoty(tmpData);
									return;
								}
								tmpUrl=tmpUrl+'&groupId='+$('#nav-pills-tab-1 input[name=groupId]').val();
							}else if(tmpStatus==1){
								if(!qId && !sId){
									var tmpData={"message":"请选择答案","status":1}
									yunNoty(tmpData);
									return;
								}
								tmpUrl=tmpUrl+'&groupId='+$('#navChatLogOne input[name=groupId]').val();
							}
						}else if(tmpStatus==2){
							//编辑答案回答
							
							var effectiveRule1 = {
								'type' : 1,
								'roleIds' : ""
							};
							$('#warpRules a.btn-primary').each(function() {
								effectiveRule1.roleIds += $(this).attr('fid')+",";
							});
							if(effectiveRule1.roleIds === "") {
								effectiveRule1.roleIds = "-1";
							} else {
								effectiveRule1.roleIds = effectiveRule1.roleIds.substring(0,effectiveRule1.roleIds.length-1);
							}
							var effectiveRule2 = {
								'type' : 2,
								'roleIds' : ""
							};
							if($('#QuestionClassModel input[name=hasCheckedId]').val()) {
								effectiveRule2.roleIds = $('#QuestionClassModel input[name=hasCheckedId]').val().split('~').join(',');
							}
							if(effectiveRule2.roleIds === "") {
								effectiveRule2.roleIds = "-1";
							}
							effectiveRules.push(effectiveRule1);
							effectiveRules.push(effectiveRule2);
							effectiveRules = JSON.stringify(effectiveRules);
							if($('#navChatLogTwo input[name=groupId]').val()==0){
								var tmpData={"message":"请选择分类","status":1}
								yunNoty(tmpData);
								return;
							}
							tmpUrl='&groupId='+$('#navChatLogTwo input[name=groupId]').val()+'&effectiveRules='+effectiveRules+'&answer='+$('#navChatLogTwo #insert').val()
							
						}
						$.ajax({
							type: 'post',
							datatype: 'json',
							cache: false,
							url: encodeURI('/QualityCheck/checkLogItemByAnswer'),
							data: $("#qualityForm").serialize()+'&learnFlag='+learnFlag+'&status='+tmpStatus+tmpUrl,
							success: function(data) {
								if (data.status == 0) {
									yunNoty(data);
									$('.sendCheck .cancel').trigger('click');
									$('#qualityForm input').val('');
									if(tmpStatus==3){
										$('#nav-pills-tab-1 input[name=groupId]').val('0');
										$('#nav-pills-tab-1 input[name=question]').val('0');
										$('#nav-pills-tab-1 .ztreeName1').html('全部分类');
									}else if(tmpStatus==1){
										$('#navChatLogOne input[name=groupId]').val('0');
										$('#navChatLogOne input[class=form-control]').val('');
										$('#navChatLogOne .ztreeName2').html('全部分类');
									}else if(tmpStatus==2){
										$('#navChatLogTwo input').val('');
										$('#navChatLogTwo textarea').val('');
										$('#navChatLogTwo .ztreeName3').html('全部分类');
									}
									if($('#page-container .panel-body>nav-pills-chg li').eq(0).hasClass('.active')){
										listCheckLogItem();
									}else{
										listCheckLoginSummary();
									}
									chatRecords();
								} else {
									yunNoty(data);
								}
							}
						});
					}
});



//访客Modal
function lookChat(obj, locateContent){
    var isExist = true;   
    //被列入的个页面，查看聊天记录后，不出现“已读”两字
    var pageArr = [
        '/web/knowledge/unknowQueNew.html',
        '/web/knowledge/intelLearnDeal.html',
        '/web/knowledge/dsfKnowledgeAns.html'
    ];
    $.each(pageArr, function(i, item){
        if(window.location.href.indexOf(item) > -1){
            isExist = false; //若当前页面是被列入的页面，则变量为false，即不会出现“已读”两字
        }
    })


	$('.sendCheck').hide();
  if($(obj).text().indexOf('已读') < 0 && isExist){
  	$(obj).css('color', '#999');
  	$(obj).parents('tr').removeClass('notRead');
    $(obj).append('&nbsp;<span>已读</span>');
  }
	var userId1=$(obj).attr('rel')=='undefined'?'':$(obj).attr('rel');
	$('.recordsChatUserId').val(userId1);
	var userId2=$(obj).attr('cv')=='undefined'?'':$(obj).attr('cv');
	$('.tempValue').val(userId2);
	$('.chatV').val(userId2);
  $('.locateContent').val(locateContent);
	//设置本次记录按钮active
	$('.bcjl').addClass('active');
	$('ul.nav-pills li').eq(0).addClass('active');
	$('ul.nav-pills li').eq(1).removeClass('active');
	$('#navChatLogOne').addClass('active');
	$('#navChatLogTwo').removeClass('active');
	$('#visiterForm input[name=startTime]').val('');
	$('#visiterForm input[name=endTime]').val('');
	$('#visiterForm input[name=content]').val('');
	var newlocation = window.location.href;
  	if(newlocation.indexOf('intelLearnDeal.html') < 0){
		$('#chatModal').modal('show');
	}
	// 此处判断是否为访客日志中聊天查看
	var visitorLocation = window.location.href;
	if(visitorLocation.indexOf('visitorLogNew.html') > -1&&$("a[class=chooseName]").size()>0){
		// 获取对应td的值添加到聊天界面
		var shenfendStr=""
		var aliceArr=$(obj).parent().parent(0).find("td").slice(0,$(".addlist span").size())
		for(var i=0;i<aliceArr.size();i++){
			if(aliceArr.eq(i).css("display")!= 'none'){
				if(aliceArr.eq(i).html()){
					shenfendStr+=aliceArr.eq(i).html()+'&nbsp;<b style="color:#0088cc;">|</b>&nbsp;';					
				}

			}
		}
		$(".shenfendInfo").html(shenfendStr)
	}
}

function searchClear(){
	$('.bcjl').removeClass('active');
	$('#visiterForm')[0].reset();
}

//访客聊天记录
function chatRecords(pageNo){
	$('#visiterForm .visiterInfo').html("")//清除上次访客信息
	if(!pageNo)pageNo=1;
  var locateContentFlag = false;
  if(arguments.length===2&&arguments[1]==='search'){
    locateContentFlag = true;
  } else {
    $('.locateContent').val('');
  }
	$('#chatLogList').find('ul').html('<li style=\"text-align:center;\"><img src=\"../common/images/ajax_loader.gif\"></li>');
	$.ajax({
		type:'get',
		datatype:'json',
		cache:false,//不从缓存中去数据
		url:encodeURI('../../chatlog/findLog?pageSize='+20+'&pageNo='+pageNo),
		data:$("#visiterForm").serialize(),
		success:
		function(data){
			if(data.status===0){
				var visiterInfo='';
				// 如果有身份信息且不在访客日志页面内则添加访客信息
				if(typeof data.userCard!='undefined' && data.userCard!==null && window.location.href.indexOf('visitorLogNew.html')<0){
					if(data.userCard.Name!='undefined' && data.userCard.Name!==null){
						visiterInfo+=data.userCard.Name+'&nbsp;<b style="color:#0088cc;">|</b>&nbsp;';//姓名
					}
					if(data.userCard.Userid!='undefined' && data.userCard.Userid!==null){
						visiterInfo+=data.userCard.Userid+'&nbsp;<b style="color:#0088cc;">|</b>&nbsp;';//卡号
					}
					if(data.userCard.TelNum!='undefined' && data.userCard.TelNum!==null){
						visiterInfo+=data.userCard.TelNum+'&nbsp;<b style="color:#0088cc;">|</b>&nbsp;';//联系方式
					}
					if(data.userCard.Identity!='undefined' && data.userCard.Identity!==null){
						visiterInfo+=data.userCard.Identity+'&nbsp;<b style="color:#0088cc;">|</b>&nbsp;';//身份类型
					}
					if(data.userCard.Company!='undefined' && data.userCard.Company!==null){
						visiterInfo+=data.userCard.Company+'&nbsp;<b style="color:#0088cc;">|</b>&nbsp;';//公司
					}
					if(data.userCard.Level!='undefined' && data.userCard.Level!==null){
						visiterInfo+=data.userCard.Level+'&nbsp;<b style="color:#0088cc;">|</b>&nbsp;';//会员等级
					}
				}			
				if(typeof data.chatUser!='undefined' && data.chatUser!==null){
					if(data.chatUser.SourceId){
						if(data.chatUser.SourceId==1){
							if(data.chatUser.SysInfo=="0"){
								data.chatUser.SysInfo = '微信订阅号'
							}if(data.chatUser.SysInfo=="1"){
								data.chatUser.SysInfo ='微信服务号'
							}
						}else if(data.chatUser.SourceId==5){
							visiterInfo +='支付宝：'
						}else if(data.chatUser.SourceId==4){
							visiterInfo +='微博：'
						}else if(data.chatUser.SourceId==2){
							visiterInfo +='API：'
						}else if(data.chatUser.SourceId==3){
							visiterInfo +='APP：'
						}
					}
					if(data.chatUser.SysInfo !==null&&data.chatUser.SysInfo !==""){
						visiterInfo +=data.chatUser.SysInfo+'&nbsp;<b style="color:#0088cc;">|</b>&nbsp;';
					}
					if(data.chatUser.Broswer !==null&&data.chatUser.Broswer !==""){
						visiterInfo +=data.chatUser.Broswer+'&nbsp;<b style="color:#0088cc;">|</b>&nbsp;';
					}
					if(data.chatUser.Address !==null&&data.chatUser.Address !==""){
						visiterInfo +=data.chatUser.Address+'&nbsp;<b style="color:#0088cc;">|</b>&nbsp;';
					}
					if(data.chatUser.HostIp !==null&&data.chatUser.HostIp !==""){
						visiterInfo +=data.chatUser.HostIp;
					}
				}
				$('#visiterForm .visiterInfo').html(visiterInfo);
				if(data.list[0]) {
					var html ='';
					if(data.list[0]) {
						for(var i=0; i<data.list.length; i++) {
							var reply = data.list[i].Reply;
							var src = reply.match(/src=\"([^\"]+)/);
							if(src) {
								reply = '<a href="'+ src[1] +'" data-lightbox="gallery">'+(data.list[i].Reply || '　')+ '</a>';
							}
							
							// 我的话添加参数
							var params = '';
							for (var key in data.list[i]) {
								params += 'data-' + key + '="' + ('' + data.list[i][key] || '').replace(/\"/g, '\'') + '" ';
							}
							
							if(data.list[i].Question){
								html += '<li class="right out" ' + params + '><span class="date-time">'+data.list[i].DateTime+'</span><a class="name">访客</a><a class="image"><img src="../common/images/user.png" alt=""></a><div class="message" id="'+data.list[i].Id+'">';
								if(data.list[i].MsgType==1){
									//图片
									var tmpQue=data.list[i].Question;
									if(tmpQue){
										tmpQue=(tmpQue.split('__xgn_iyunwen_')[1] || '');
									}
									html+='<img src="'+tmpQue+'">';
								}else if(data.list[i].MsgType==2){
									//语音
									var tmpQue=data.list[i].Question;
									if(tmpQue){
										tmpQue=tmpQue.split('__xgn_iyunwen_');
									}
									html +=tmpQue[0];
								}else{
									html +=(data.list[i].Question || '　');
								}
								html +='</div></li>';
							}
							
							if(reply){
								html +='<li class="left in"><span class="date-time">'+data.list[i].DateTime+'</span><a class="name">机器人</a><a class="image"><img src="../common/images/robot.png" alt=""></a><div class="message">'+ reply +'</div></li>';
							}
						}
						
					}else {
						html += '<div colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</div>';
					}

					$('#chatLogList').find('ul').html(html);
					// var scrollheight = $(window).height() - 300;
					// $('#chatLogList').slimScroll({
						// height: ((scrollheight)>100?scrollheight:100) + 'px'
					// });
					$('#chatLogList').slimScroll({
						height: '500px'
					});
					$('.modal-body').css('height','auto');
					// 给我的话和机器人的话加父级
					$('.out').each(function() {
						$(this).add($(this).next('.in')).wrapAll('<div class="wrap" ischecked="'+$(this).data('ischecked')+'"></div>');
					})
					if(sessionStorage.getItem('checklogValue') == 1){
						$('.wrap').each(function() {
							if($(this).attr('ischecked')==1){
								$(this).append('<button type="button" class="wrapBtn btn  btn-default hasTest">已质检</button><div class="wrapInner hasTest"></div>');
							}else{
								$(this).append('<button type="button" class="wrapBtn btn  btn-primary">聊天质检</button><div class="wrapInner"></div>');
							}
						})
					}

					//下面开始处理分页
					var options = {
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						onPageClicked: function (event, originalEvent, type, page) {
							chatRecords(page);
						}
					};
					setPage('chatpageList',options);
					if(data.list[0] && locateContentFlag && $('#'+data.locateId).length) {
						$('#chatLogList').slimScroll({ scrollTo: '0px' });
						$('#chatLogList').slimScroll({ scrollTo: $('#'+data.locateId).parent().parent().position().top+'px' });
						$('#'+data.locateId).css('color', '#ff6464');
						$('#'+data.locateId+' a').css('color', '#ff6464');
					}
				}else{
					$('#chatLogList').find('ul').html('<li style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>  当前纪录为空</li>');
					$('#chatpageList').html('');
					$('#chatLogList').slimScroll({
						height: '100px'
					});
					$('.modal-body').css('height','300px');
				}
			}else{
				yunNoty(data);
			}
		}
	});
}
