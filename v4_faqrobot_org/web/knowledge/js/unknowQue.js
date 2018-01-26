$(document).ready(function() {
	$('.ans-textarea').addWordCount(200);
	//datetimepicker配置项
	$('.form_datetime').datetimepicker({
		language: 'zh-CN',
		format: 'yyyy-mm-dd hh:ii',
		autoclose: true,
		todayBtn: true,
		minuteStep: 10,
		initialDate: new Date(),
		zIndex: 1500,
	});


	var selectSourceFlag = true;

	var This = this;
	var type = 1, //素材类型
		pageNo = 1, //当前页
		pageSize = 10, //每页数量
		orderType = 4,
		isLeaf = 0,
		groupId = 0,
		inQue = '', //搜索的问题
		isJpage = 0, //是否已实例化jpage
		delPage = 0, //是否删除jpage
		sourceType = -1;

	function initSrc() {
		$('.multCos').iCheck('uncheck');
		$('#tb01').tableAjaxLoader2(5);
		Base.request({
			url: 'LearnQue/list',
			params: {
				type: type,
				pageNo: pageNo,
				pageSize: pageSize,
				orderType: orderType,
				isLeaf: isLeaf,
				groupId: groupId,
				inQue: inQue,
				startT: $('[name=startT]').val(),
				endT: $('[name=endT]').val(),
				source: sourceType
			},
			callback: function(data) {
				if (data.status) {
					Base.gritter(data.message, false);
				} else {

					if(data.sourceList) {
						if(data.sourceList[0]) {
							if(selectSourceFlag) {
								var html = '<li><a class="sol" href="#" data-sol="-1">全部渠道</a></li>';
								for(var m in data.sourceList) {
									html += '<li><a class="sol" href="javascript:;" data-sol="'+data.sourceList[m].DicCode+'">'+data.sourceList[m].DicDesc+'</a></li>';
								}
								$('#DataSourceUL').empty().append(html);
								$('#DataSourceUL a').on('click',function(){
          							    pageNo = 1;
									sourceType = $(this).attr('data-sol');
									if(sourceType=='-1') {
										$('.sourceType').html('全部渠道<span class="caret"></span>');
									} else {
										$('.sourceType').html(getSourceName(sourceType)+'<span class="caret"></span>');
									}
									initSrc();
								});
								selectSourceFlag = false;
							}
						}
					}
					var setting3 = {
						data: {
							simpleData: {
								enable: true,
							},
						},
						view: { //不显示图标
							showIcon: false
						},
						check: {
							enable: true,
						},
						callback: {
							onCheck: function(event, treeId, treeNode) {
								//console.log(event);
								//console.log(treeId);
								//console.log(treeNode);
								RoleName = [];
								CombIds = [];

								var treeObj3 = $.fn.zTree.getZTreeObj('ztree3');
								var nodes3 = treeObj3.getCheckedNodes(true);

								for (var i = 0; i < nodes3.length; i++) {
									RoleName.push(nodes3[i].name);
									CombIds.push(nodes3[i].id);
								}
								$('.roleInput').attr({
									title: RoleName,
								}).val(RoleName);
							}
						}
					};

					//获取来访者角色分类
					Base.request({
						url: 'comb/loadCombs',
						params: {
							m: 0,
						},
						callback: function(data) {
							if (data.status) {
								Base.gritter(data.message, false);
							} else {
								var html = '';
								if (data.list) {
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
										formatData[len]['name'] = '全部角色';
										formatData[len]['pId'] = 0;
										formatData[len]['id'] = 1;


										$.fn.zTree.init($('#ztree3'), setting3, formatData);

									} else {

									}
								}
							}
						},
					});
					/*TaskId:  401 访客消息为语音，处理后不显示【语音标识】
					 *说明：保存问题的类型 msgType
					 *修改：将接收到问题的类型作为属性，存储到其所在标签的的自定义属性msgType中
					 */
					var html = '';
					if (data.List[0]) {
						for (var i = 0; i < data.List.length; i++) {
							if (data.List[i].watched === false) {
								html += '<tr Id="' + data.List[i].Id + '" InQue="' + data.List[i].InQue + '" GroupId="' + data.List[i].GroupId + '" ChatUserId="' + data.List[i].ChatUserId + '" ChatVersion="' + data.List[i].ChatVersion + '"><td><input class="singleCos" type="checkbox"></td><td msgType="'+data.List[i].MsgType+'">' + data.List[i].InQue + '</td><td style="white-space:nowrap;">' + data.List[i].GroupName + '</td><td style="white-space:nowrap;">' + data.List[i].DateTime + '</td><td style="white-space:nowrap;"><a><i class="timeTip look clickBtn glyphicon glyphicon-eye-open" title="查看聊天记录" data-toggle="modal" data-target="#modal-dialog-record"></i><i class="timeTip move clickBtn glyphicon glyphicon-move" title="移动分类"></i><i class="timeTip ans clickBtn glyphicon glyphicon-pencil" title="回答" data-toggle="modal" data-target="#modal-dialog-ans"></i><i class="timeTip ig clickBtn glyphicon glyphicon-eye-close" title="忽略"></i><i class="timeTip igSame clickBtn glyphicon glyphicon-ban-circle" title="忽略相同"></i><i class="timeTip igA clickBtn glyphicon glyphicon-remove-circle" title="永久忽略"></i></a></td></tr>';
							} else {
								html += '<tr Id="' + data.List[i].Id + '" InQue="' + data.List[i].InQue + '" GroupId="' + data.List[i].GroupId + '" ChatUserId="' + data.List[i].ChatUserId + '" ChatVersion="' + data.List[i].ChatVersion + '"><td><input class="singleCos" type="checkbox"></td><td msgType="'+data.List[i].MsgType+'">'+ data.List[i].InQue + '</td><td style="white-space:nowrap;">' + data.List[i].GroupName + '</td><td style="white-space:nowrap;">' + data.List[i].DateTime + '</td><td style="white-space:nowrap;"><a><i class="timeTip look clickBtn glyphicon glyphicon-eye-open" style="color:#094e8a" title="查看聊天记录" data-toggle="modal" data-target="#modal-dialog-record"></i><i class="timeTip move clickBtn glyphicon glyphicon-move" title="移动分类"></i><i class="timeTip ans clickBtn glyphicon glyphicon-pencil" title="回答" data-toggle="modal" data-target="#modal-dialog-ans"></i><i class="timeTip ig clickBtn glyphicon glyphicon-eye-close" title="忽略"></i><i class="timeTip igSame clickBtn glyphicon glyphicon-ban-circle" title="忽略相同"></i><i class="timeTip igA clickBtn glyphicon glyphicon-remove-circle" title="永久忽略"></i></a></td></tr>';
							}
						}

						var options = {
							data: [data, 'List', 'total'],
							currentPage: data.currentPage,
							totalPages: data.totlePages ? data.totlePages : 1,
							alignment: 'right',
							onPageClicked: function(event, originalEvent, type, page) {
								pageNo = page;
								initSrc();
							}
						};
						$('#itemContainer').bootstrapPaginator(options);
					} else {
						html += '<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
						$('#itemContainer').empty();
					}
					$('.tbody1').empty().append(html);
					$('.timeTip').tooltip();
					icheckInit();


				}
			},
		});
	}
	initSrc();
	//断点
	var setting1 = {
		data: {
			simpleData: {
				enable: true,
			},
		},
		view: { //不显示图标
			showIcon: false
		},
		check: {
			enable: true,
		},
		callback: {
			onClick: function(event, treeId, treeNode) {
                groupId = treeNode.id - 1;
                pageNo=1;
				initSrc();
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
	var setting2 = {
		data: {
			simpleData: {
				enable: true,
			},
		},
		view: { //不显示图标
			showIcon: false
		},
		check: {
			//enable: true,
		},
		callback: {
			onClick: function(event, treeId, treeNode) {
				$('.closeAll2').trigger('click');
				groupId = treeNode.id - 1;
				pageNo2 = 1;
				ansQue();
				$('#ztree2').fadeOut();
				$('.selectQue').html(treeNode.name);
			}
		}
	};
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


					$.fn.zTree.init($('#ztree1'), setting1, formatData);
					$.fn.zTree.init($('#ztree2'), setting2, formatData);
					treeObj = $.fn.zTree.getZTreeObj('ztree1');

				} else {

				}

			}
		},
	});
	//$(function() {

	/* 判断是单点还是云上，云上没有未知问题标签列表 */
	var isDandian = false,
		ignoreWhich = ''; // #1

	if (isDandian) {
		$('.dandain').show();
	} else {
		$('.dandain').hide();
	}




	/**/
	//})

	window.onload = function() { //常用的$(function() {})此时省略
		var $document = $(window.frames['myFrame'].document);
		$document.find('head').append('<style>' +
            'body {padding: 0; background:#fff;}' +
            '#content {display: none!important;}' +
            '.bolda {display: none!important;}' +
            '.boldc {border: none!important;}' +
            '.list {display: none!important;}' +
            '.aa {display: none!important;}' +
            '.a, .rowNav .panel-body, .rowNav .panel-body .col-md-2, .boldb {padding: 0!important; margin: 0!important;}' +
            '</style>');

		//$('.branchSearch input[name=groupId]').val(treeNode.Id);

		// 选择一个未知问题标签
		$('#ensureCos').on('click', function() {

			//doIgnoreQues doIgnoreSameQues doIgnoreQues #1
			var ignoreId = '';
			if (ignoreWhich == 'doIgnoreSameQues') {
				ignoreId = 'id';
			} else {
				ignoreId = 'ids';
			}

			if ($document.find('.curSelectedNode')[0]) {
				if (+$document.find('#isleaf').val()) { // #4
					$.ajax({
						type: 'get',
						datatype: 'json',
						cache: false, //不从缓存中去数据
						url: encodeURI('../../LearnQue/' + ignoreWhich + '?' + ignoreId + '=' + (isType(window.$obj, 'string') ? window.$obj : window.$obj.attr('id'))) + '&classId=' + $document.find('.branchSearch input[name=groupId]').val(),
						success: function(data) {
							if (data.status) {
								var msg = data.message;
								if (msg == '参数不能为空') {
									msg = '勾选要忽略的问题';
								}
								Base.gritter(msg, false);
							} else {
								$('#dandianModal').modal('hide');
								initSrc();
								Base.gritter(data.message, true);
							}
						}
					});
				} else {
					yunNotyError('请选择一个子分类');
				}
			} else {
				yunNotyError('请先选择一个分类');
			}
		});

	};

	// 判断类型 array number string date function regexp object boolean null undefined
	function isType(obj, type) {
		return Object.prototype.toString.call(obj).toLowerCase() === '[object ' + type + ']';
	}

	//全部忽略事件
	$('body').on('click', '.ig, .igSame, .igA, .mult-ig, .mult-igA', function() {
		delPage = 1;

		if ($(this).is('.ig')) { //忽略
			var $tr = $(this).parents('tr'),
				ids = $tr.attr('Id');

			ignoreWhich = 'doIgnoreQues'; // #1
			window.$obj = $tr;
			if (isDandian) {
				$('#dandianModal').modal('show');
			} else {
				Base.request({
					url: 'LearnQue/doIgnoreQues',
					params: {
						ids: ids,
					},
					callback: function(data) {
						if (data.status) {
							Base.gritter(data.message, false);
						} else {
							Base.gritter(data.message, true);
							if ($('.ig').length == 1) {
								if (pageNo >= 2) {
									pageNo -= 1;
								}
							}
							initSrc();
						}
					},
				});
			}
		}
		if ($(this).is('.igSame')) { //忽略相同
			var $tr = $(this).parents('tr'),
				id = $tr.attr('Id');

			ignoreWhich = 'doIgnoreSameQues'; // #1
			window.$obj = $tr;
			if (isDandian) {
				$('#dandianModal').modal('show');
			} else {
				Base.request({
					url: 'LearnQue/doIgnoreSameQues',
					params: {
						id: id,
					},
					callback: function(data) {
						if (data.status) {
							Base.gritter(data.message, false);
						} else {
							Base.gritter(data.message, true);
							if ($('.ig').length == 1) {
								if (pageNo >= 2) {
									pageNo -= 1;
								}
							}
							initSrc();
						}
					},
				});
			}
		}
		if ($(this).is('.igA')) { //永久忽略
			var $tr = $(this).parents('tr'),
				ids = $tr.attr('Id');

			Base.request({
				url: 'LearnQue/doIgnoreForever',
				params: {
					ids: ids,
				},
				callback: function(data) {
					if (data.status) {
						var msg = data.message;
						if (msg == '参数不能为空') {
							msg = '勾选要永久忽略的问题';
						}
						Base.gritter(msg, false);
					} else {
						Base.gritter(data.message, true);
						if ($('.ig').length == 1) {
							if (pageNo >= 2) {
								pageNo -= 1;
							}
						}
						initSrc();
					}
				},
			});
		}
		if ($(this).is('.mult-ig')) { //批量忽略
			var ids = [];

			$('.singleCos').each(function() {
				var $tr = $(this).parents('tr'),
					id = $tr.attr('Id');

				if ($(this).is(':checked')) {
					ids.push(id);
				}
			});

			ignoreWhich = 'doIgnoreQues'; // #1
			window.$obj = ids.toString();
			if (isDandian) {
				$('#dandianModal').modal('show');
			} else {
				Base.request({
					url: 'LearnQue/doIgnoreQues',
					params: {
						ids: ids.toString(),
					},
					callback: function(data) {
						if (data.status) {
							var msg = data.message;
							if (msg == '参数不能为空') {
								msg = '勾选要忽略的问题';
							}
							Base.gritter(msg, false);
						} else {
							Base.gritter(data.message, true);
							if ($('.ig').length == ids.length) {
								if (pageNo >= 2) {
									pageNo -= 1;
								}
							}
							initSrc();
						}
					},
				});
			}
		}
		if ($(this).is('.mult-igA')) { //批量永久忽略
			var ids = [];

			$('.singleCos').each(function() {
				var $tr = $(this).parents('tr'),
					id = $tr.attr('Id');

				if ($(this).is(':checked')) {
					ids.push(id);
				}
			});

			Base.request({
				url: 'LearnQue/doIgnoreForever',
				params: {
					ids: ids.toString(),
				},
				callback: function(data) {
					if (data.status) {
						var msg = data.message;
						if (msg == '参数不能为空') {
							msg = '勾选要永久忽略的问题';
						}
						Base.gritter(msg, false);
					} else {
						Base.gritter(data.message, true);
						if ($('.ig').length == ids.length) {
							if (pageNo >= 2) {
								pageNo -= 1;
							}
						}
						initSrc();
					}
				},
			});
		}
	});
	//ENTER
	$(document).on('keyup', function(e) {
		var $activeEl = $(document.activeElement);

		if ($activeEl.is('.tipsearch') && (e.keyCode == 13 || e.keyCode == 108)) {
			$('#searchChatRe').trigger('click');
		}
		if ($activeEl.is('.search-input-addSrc2') && (e.keyCode == 13 || e.keyCode == 108)) {
			$('.btnSearch2').trigger('click');
		}
	});
	var pageNo1 = 1, //当前页
		pageSize1 = 10, //每页数量
		isJpage1 = 0, //是否已实例化jpage
		startTime = '',
		endTime = '',
		content = '',
		chatUserId = '',
		chtvs = '';

	//配置模态框
	$('#modal-dialog-record').on('hidden.bs.modal', function() {
		$('#clearChatRe').trigger('click');
	});

	//查看聊天记录
	$('body').on('click', '.look', function() {
		$(this).css('color', '#094e8a');
		var $tr = $(this).parents('tr');
		startTime = $('input[name=startTime]').val();
		endTime = $('input[name=endTime]').val();
		content = $('input[name=content]').val();
		chatUserId = $tr.attr('ChatUserId');
		chtvs = $tr.attr('ChatVersion');
		pageNo1 = 1;
		isJpage1 = 0;
		$('.locateContent').val($tr.attr('InQue'));
		lookChat('search');

		$('#modal-dialog-record').attr({
			chatUserId: chatUserId,
			chtvs: chtvs,
		});
	});

	//本次记录
	$('.bcjl').on('click', function() {
		startTime = $('input[name=startTime]').val();
		endTime = $('input[name=endTime]').val();
		content = $('input[name=content]').val();
		pageNo1 = 1;
		isJpage1 = 0;
		chtvs = $('#modal-dialog-record').attr('chtvs');
		lookChat();
	});
	//全部记录
	$('.qbjl').on('click', function() {
		startTime = $('input[name=startTime]').val();
		endTime = $('input[name=endTime]').val();
		content = $('input[name=content]').val();
		pageNo1 = 1;
		isJpage1 = 0;
		chtvs = '';
		lookChat();
	});
	//搜索
	$('#searchChatRe').on('click', function() {
		startTime = $('input[name=startTime]').val();
		endTime = $('input[name=endTime]').val();
		content = $('input[name=content]').val();
		pageNo1 = 1;
		isJpage1 = 0;
		lookChat();
	});
	//清空
	$('#clearChatRe').on('click', function() {
		$('input[name=startTime]').val('');
		$('input[name=endTime]').val('');
		$('input[name=content]').val('');
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

	//查看聊天记录
	function lookChat() {
		var dataJSON = {
			pageNo: pageNo1,
			pageSize: pageSize1,
			startTime: startTime,
			endTime: endTime,
			content: content,
			chatUserId: chatUserId,
			//chatUserId: '1016739',
			chtvs: chtvs,
			//chtvs: '1016739_2016-05-12 15:05:36_45',
		};
		var locateContentFlag = false;
		if (arguments.length === 1 && arguments[0] === 'search') {
			locateContentFlag = true;
			dataJSON.locateContent = $('.locateContent').val();
		} else {
			$('.locateContent').val('');
		}
		Base.request({
			url: 'chatlog/findLog',
			params: dataJSON,
			callback: function(data) {
				if (data.status) {
					Base.gritter(data.message, false);
				} else {
					var visiterInfo = '';
					if (typeof data.userCard != 'undefined' && data.userCard != null) {
						if (data.userCard.Name != null) {
							visiterInfo = data.userCard.Name + '&nbsp;<b style="color:#0088cc;">|</b>&nbsp;';
						} else if (data.userCard.UserName != null) {
							visiterInfo += data.userCard.UserName + '&nbsp;<b style="color:#0088cc;">|</b>&nbsp;';
						}
					}
					if (typeof data.chatUser != 'undefined' && data.chatUser != null) {
						if (data.chatUser.SysInfo != null) {
							visiterInfo += data.chatUser.SysInfo + '&nbsp;<b style="color:#0088cc;">|</b>&nbsp;';
						}
						if (data.chatUser.Broswer != null) {
							visiterInfo += data.chatUser.Broswer + '&nbsp;<b style="color:#0088cc;">|</b>&nbsp;';
						}
						if (data.chatUser.Address != null) {
							visiterInfo += data.chatUser.Address + '&nbsp;<b style="color:#0088cc;">|</b>&nbsp;';
						}
						if (data.chatUser.HostIp != null) {
							visiterInfo += data.chatUser.HostIp;
						}
					}
					$('#visiterForm .visiterInfo').html(visiterInfo + '<button type="button" class="btn btn-primary btn-xs" onclick="$(\'.hideForm\').toggle();">高级查询</button>');

					var html = '';
					if (data.list[0]) {
						for (var i = 0; i < data.list.length; i++) {
							var reply =data.list[i].Reply,
								src = reply.match(/src=\"([^\"]+)/);
							if (src) {
								reply = '<a href="' + src[1] + '" data-lightbox="gallery">' + (data.list[i].Reply || '　') + '</a>';
							}
							if(data.list[i].Question){
								html += '<li class="right"><span class="date-time">'+data.list[i].DateTime+'</span><a class="name">访客</a><a class="image"><img src="../common/images/user.png" alt=""></a><div class="message" id="'+data.list[i].Id+'">';
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
									//html +='<a href="'+tmpQue[1]+'" target="_blank">'+tmpQue[0]+'</a>';
									html +='【语音】'+tmpQue[0];
								}else{
									html +=(data.list[i].Question || '　');
								}
								html +='</div></li>';
							}
							if(reply){
								html +='<li class="left"><span class="date-time">' + data.list[i].DateTime + '</span><a class="name">机器人</a><a class="image"><img src="../common/images/robot.png" alt=""></a><div class="message">' + reply + '</div></li>';
							}
						}

						var options = {
							currentPage: data.currentPage,
							totalPages: data.totlePages ? data.totlePages : 1,
							alignment: 'right',
							onPageClicked: function(event, originalEvent, type, page) {
								pageNo1 = page;
								lookChat();
							}
						};
						$('#itemContainer1').bootstrapPaginator(options);
					} else {
						html += '<td colspan="7" style="text-align:center; display: block; margin: 0 auto;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td>';
						$('#itemContainer1').empty();
					}
					$('.chats').empty().append(html);
					$('.timeTip').tooltip();
					icheckInit();
					$('.chats').slimScroll({
						height: ($(window).height() - 300) + 'px'
					});
					if (data.list[0] && locateContentFlag && $('#' + data.locateId).length) {
						$('.chats').slimScroll({
							scrollTo: '0px'
						});
						$('.chats').slimScroll({
							scrollTo: $('#' + data.locateId).position().top + 'px'
						});
						$('#' + data.locateId).css('color', '#ff6464');
					}
				}
			},
		});
	}

	//全选
	$('body').on('ifChecked', '.multCos', function() {
		$('.singleCos').iCheck('check');
	});
	//全不选
	$('body').on('ifUnchecked', '.multCos', function() {
		$('.singleCos').iCheck('uncheck');
	});

	//搜索
	$('.btnSearch').on('click', function() {
		isJpage = 0;
		pageNo = 1;
		inQue = $('.search-input-addSrc').val();
		initSrc();
	});
	//ENTER
	$(document).on('keyup', function(e) {
		var $activeEl = $(document.activeElement);

		if ($activeEl.is('.search-input-addSrc') && (e.keyCode == 13 || e.keyCode == 108)) {
			$('.btnSearch').trigger('click');
		}
	});

	//跳转
	$('.goPage-addSrc a').on('click', function() {
		$('.holder').jPages(parseInt($('.goPage-addSrc input').val()));
		return false;
	});




	//全选文本
	$('.goPage-addSrc input').on('focus', function() {
		$(this).select();
	});

	var isMove = false, //是否在移动状态
		$move = null, //移动的div
		treeObj = null;

	//生成移动元素
	$('body').on('click', '.move', function(e) {
		var $tr = $(this).parents('tr'),
			moveTxt = $tr.find('td:eq(1)').text();

		isMove = true;
		if ($move) {
			$move.remove();
		}
		$move = $('<div>' + moveTxt + '--请勾选左侧相应的问题分类，右击取消</div>').css({
			'position': 'fixed',
			'left': e.clientX + 10,
			'top': e.clientY - 30,
			'zIndex': 10000,
			'background': '#D9E0E7',
			'padding': '5px 10px',
			'borderRadius': '5px',
		}).attr({
			id: $tr.attr('id'),
		}).appendTo('body');
	});

	//取消移动
	$(document).on('contextmenu', function(e) {
		isMove = false;
		$move.remove();
		return false;
	});
	//移动
	$('body').on('mousemove', function(e) {
		if (isMove) {
			$move.css({
				'left': e.clientX + 10,
				'top': e.clientY - 30,
			});
		}
	});

	//排序
	$('.sort1').on('click', function() { //默认
		$('.sort0_0').html($(this).text() + '<span class="caret"></span>');
		orderType = 3;
		pageNo = 1;
		initSrc();
	});
	$('.sort2').on('click', function() { //时间正序
		$('.sort0_0').html($(this).text() + '<span class="caret"></span>');
		orderType = 3;
		pageNo = 1;
		initSrc();
	});
	$('.sort3').on('click', function() { //时间倒序
		$('.sort0_0').html($(this).text() + '<span class="caret"></span>');
		orderType = 4;
		pageNo = 1;
		initSrc();
	});
	$('.sort4').on('click', function() { //问题内容正序
		$('.sort0_0').html($(this).text() + '<span class="caret"></span>');
		orderType = 33;
		pageNo = 1;
		initSrc();
	});
	$('.sort5').on('click', function() { //问题内容倒序
		$('.sort0_0').html($(this).text() + '<span class="caret"></span>');
		orderType = 34;
		pageNo = 1;
		initSrc();
	});
	$('.sort6').on('click', function() { //提问数量正序
		$('.sort0_0').html($(this).text() + '<span class="caret"></span>');
		orderType = 31;
		pageNo = 1;
		initSrc();
	});
	$('.sort7').on('click', function() { //提问数量倒序
		$('.sort0_0').html($(this).text() + '<span class="caret"></span>');
		orderType = 32;
		pageNo = 1;
		initSrc();
	});

	//导出exl
	$('.outExl').on('click', function() {
		location.href = '../../LearnQue/list?pageSize=' + 10000 + '&pageNo=' + 1 + '&orderType=' + 4 + '&type=' + 1 + '&excelFlag=' + 1 + '&startT=' + ($('[name=startT]').val() || '') + '&endT=' + ($('[name=endT]').val() || '');
	});
	//导出exl2
	$('.outExl2').on('click', function() {
		location.href = '../../report/LearnQuestion/showChart?excelFlag=1' + '&startT=' + ($('[name=startT]').val() || '') + '&endT=' + ($('[name=endT]').val() || '');
	});

	var pageNo2 = 1, //当前页
		pageSize2 = 5, //每页数量
		isJpage2 = 0, //是否已实例化jpage
		groupId = 0,
		solutionId = 0,
		isLeaf = 1,
		answer = '',
		question = '',
		status = 0,
		level = 1,
		ids = 0,
		queryStr = '?question=';

	$('.fromCtn').add('.textareaCtn').hide();

	//回答
	function ansQue() {
		Base.request({
			url: 'question/listAns' + queryStr + answer + $('.search-input-addSrc2').val(),
			params: {
				pageNo: pageNo2,
				pageSize: pageSize2,
				groupId: groupId,
				isLeaf: isLeaf,
				status: status,
				level: level,
			},
			callback: function(data) {
				if (data.status) {
					Base.gritter(data.message, false);
				} else {
					var html = '';
					if (data.ListQue[0]) {
						for (var i = 0; i < data.ListQue.length; i++) {
							if(data.ListQue[i].Answer!=null || data.ListQue[i].Answer!= ""){
								html += '<tr Id="' + (data.ListQue[i].Id || '') + '"  SolutionId="' + (data.ListQue[i].SolutionId || '') + '"><td style="text-align: center;"><input class="singleAnsCos" type="radio" name="ansQue"></td><td class="cosInput" style="max-width: 350px;overflow: auto;"><div class="minheight">' + (data.ListQue[i].Answer) + '</div></td><td class="cosInput" style="white-space: nowrap;">' + (data.ListQue[i].Time || '') + '</td></tr>';

							}
						}

						var options = {
							currentPage: data.currentPage,
							totalPages: data.totlePages ? data.totlePages : 1,
							alignment: 'right',
							onPageClicked: function(event, originalEvent, type, page) {
								pageNo2 = page;
								ansQue();
							}
						};
						$('#itemContainer2').bootstrapPaginator(options);
					} else {
						html += '<td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td>';
						$('#itemContainer2').empty();
					}
					$('.tbody2').empty().append(html);
					$('.timeTip').tooltip();
					icheckInit();
					$('.minheight').each(function() {
						var height = $(this).height;
						if (height > 100) {
							height = 100;
						}
						$('.minheight').slimScroll({
							height: height,
						});
					});
					$('.slimScrollBar').hide();

				}
			},
		});
	}

	// 点击td自动选中input
	$('body').on('click', '.cosInput', function() {
		$(this).parents('tr').find('input').iCheck('check');
	});

	//问题
	function queQue() {
		Base.request({
			url: 'question/listQue',
			params: {
				pageNo: pageNo2,
				pageSize: pageSize2,
				groupId: groupId,
				isLeaf: isLeaf,
				question: $('.search-input-addSrc2').val(),
			},
			callback: function(data) {
				if (data.status) {
					Base.gritter(data.message, false);
				} else {
					var html = '';
					if (data.ListQue[0]) {
						for (var i = 0; i < data.ListQue.length; i++) {
							html += '<tr Id="' + (data.ListQue[i].Id || '') + '"  SolutionId="' + (data.ListQue[i].SolutionId || '') + '"><td><input class="singleAnsCos" type="radio" name="ansQue"></td><td class="cosInput">' + (data.ListQue[i].Question || '') + '</td><td class="cosInput" style="white-space: nowrap;">' + (data.ListQue[i].Time || '') + '</td></tr>';
						}

						var options = {
							currentPage: data.currentPage,
							totalPages: data.totlePages ? data.totlePages : 1,
							alignment: 'right',
							onPageClicked: function(event, originalEvent, type, page) {
								pageNo2 = page;
								queQue();
							}
						};
						$('#itemContainer2').bootstrapPaginator(options);
					} else {
						html += '<td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td>';
						$('#itemContainer2').empty();
					}
					$('.tbody2').empty().append(html);
					$('.timeTip').tooltip();
					icheckInit();


				}
			},
		});
	}

	//调出回答
	/*TaskId:  401 访客消息为语音，处理后不显示【语音】标识
	 *原因：点击回答时，问题类型为语音，去除【语音】标识后传给后台
	 *修改：增加判断，读取问题的msgType属性，如果为2，则滤除标识
	 */
	$('body').on('click', '.ans', function() {
		var treeObj = $.fn.zTree.getZTreeObj('ztree2');
		//treeObj.expandAll(false);

		var $tr = $(this).parents('tr'),
			answer1 = $tr.find('td:eq(1)').text(),
			msgType=$tr.find('td:eq(1)').attr('msgType');
		//去除【语音】标识
		if(msgType==2){
			answer1=answer1.split('【语音】')[1];
		}
		ids = $tr.attr('id');
		$('input[name=ansQueInput]').val(answer1);
		answer = '';
		$('a[href=#nav-pills-tab-1]').trigger('click');
		//ansQue();
	});

	var RoleName = [],
		CombIds = [],
		role = false;

	//确认回答
	$('.justAns').add('.ansAndLearn').on('click', function() {
		if ($(this).is('.justAns')) { //仅回答

			learnFlag = 0;
		}
		if ($(this).is('.ansAndLearn')) { //回答并学习
			learnFlag = 1;
			$('.ansAndLearn').on('click',function(){
				//$('.ansAndLearn').addClass('btn-primary')
			});

		}

		$('.singleAnsCos').each(function() {
			if ($(this).prop('checked')) {

				solutionId = $(this).parents('tr').attr('solutionId');
			}
		});

		answer = $('input[name=ansQueInput]').val();

		if (role) { //可选择来访者角色
			var roleIds1 = '';
			$('.changeChannel').each(function() {
				if (+$(this).attr('go')) {
					roleIds1 += $(this).attr('diccode') + ',';
				}
			});
			if (roleIds1) {
				roleIds1 = roleIds1.substring(0, roleIds1.length - 1);
			} else {
				roleIds1 = '-1';
			}
			CombIds = [];
			CombIds = CombIds.join(',');
			if (!CombIds) {
				CombIds = '-1';
			}
			if (groupId || learnFlag === 0) {
				Base.request({
					url: 'LearnQue/doFixByNewAnswer',
					params: {
						fixMode: 4,
						ids: ids,
						answer: $('.ans-textarea').val(),
						learnFlag: learnFlag,
						groupId: groupId,
						formatQue: answer,
						effectiveRules: '[{"type":1,"roleIds":"' + roleIds1 + '"},{"type":2,"roleIds":"' + CombIds + '"}]',
					},
					callback: function(data) {
						if (data.status) {
							Base.gritter(data.message, false);

						} else {
							Base.gritter(data.message, true);
							$('#modal-dialog-ans').modal('hide');
							groupId = 0;
							initSrc();
						}
					},
				});
			} else {
				Base.gritter('请选择一个分类', false);
			}
		} else { //不可选择来访者角色
			if (solutionId) {
				Base.request({
					url: 'LearnQue/doFixByOtherAnswer',
					params: {
						fixMode: 3,
						ids: ids,
						formatQue: answer,
						learnFlag: learnFlag,
						groupId: groupId,
						solutionId: solutionId,
					},
					callback: function(data) {
						if (data.status) {
							Base.gritter(data.message, false);
						} else {
							Base.gritter(data.message, true);
							$('#modal-dialog-ans').modal('hide');
							groupId = 0;
							initSrc();
						}
					},
				});
			}
		}
	});

	$('#modal-dialog-ans').on('hidden.bs.modal', function(e) {
		groupId = 0;
		isLeaf = 1;
		answer = '';
		question = '';
		status = 0;
		level = 1;
		ids = 0;

		$('.ans-textarea').val('');
		$('.search-input-addSrc2').val('');
		$('a[href=#nav-pills-tab-1]').trigger('click');
		$('a[href=#nav-pills-tab-1]').parent().addClass('active').siblings().removeClass('active');
		$('.ans-textarea').val('');

		//重置生效渠道
		$('.changeChannel').each(function() {
			$(this).removeClass('btn-primary').attr('go', '0');
		});
	});

	//合并回答

	/*TaskId:  401 访客消息为语音，处理后不显示【语音】标识
	 *原因：点击合并回答时，问题类型为语音，去除【语音】标识后传给后台
	 *修改：增加判断，读取问题的msgType属性，如果为2，则滤除标识
	 */
	$('.ansOneTime').on('click', function() {
		ids = [];
		var answer1 = [];
		$('.singleCos').each(function() {
			var $tr = $(this).parents('tr'),
				id = $tr.attr('Id'),
			//去除【语音】标识
			msgType=$tr.find('td:eq(1)').attr('msgType');

			if ($(this).is(':checked')) {
				ids.push(id);
				var pushAns=$tr.find('td:eq(1)').text();
				if(msgType==2){
					pushAns=pushAns.split('【语音】')[1];
				}
				answer1.push(pushAns);
			}

			//if ($(this).is(':checked')) {
			//	ids.push(id);
			//	answer1.push($tr.find('td:eq(1)').text());
			//}
		});
		ids = ids.toString();
		if (ids) {
			$('#modal-dialog-ans').modal('show');
			$('input[name=ansQueInput]').val(answer1);
			answer = '';
			ansQue();
		} else {
			Base.gritter('选择您要合并的回答', false);
		}
	});

	//回答页面搜索
	$('.btnSearch2').on('click', function() {

		answer = $('.search-input-addSrc2').val();
		pageNo2 = 1;
		answer = '';
		if ($('.sort2_0')[0].style.display == 'none') {
			queQue();
		} else {
			ansQue();
		}
	});
	//问题、答案搜索 queryStr
	$('.sort2_1').on('click', function() {
		$('.sort2_0').html($(this).text() + '<span class="caret"></span>');
		queryStr = '?question=';
	});
	$('.sort2_2').on('click', function() {
		$('.sort2_0').html($(this).text() + '<span class="caret"></span>');
		queryStr = '?answer=';
	});

	$('.fromCtn').hide();
	$('.hideCtn').show();
	$('.showCtn').hide();

	//切换列表
	$('a[href=#nav-pills-tab-1]').on('click', function() {
		role = false;
		$('.fromCtn').hide();
		$('.hideCtn').show();
		$('.showCtn').hide();
		$('.sort2_0').show();
		$('#gggggggg').html('答案详细');
		pageNo2 = 1;
		ansQue();
	});
	$('a[href=#nav-pills-tab-2]').on('click', function() {
		role = true;
		$('.fromCtn').show();
		$('.hideCtn').hide();
		$('.showCtn').show();
	});
	$('a[href=#nav-pills-tab-3]').on('click', function() {
		role = false;
		$('.fromCtn').hide();
		$('.hideCtn').show();
		$('.showCtn').hide();
		$('.sort2_0').hide();
		$('#gggggggg').html('问题详细');
		pageNo2 = 1;
		queQue();
	});

	//跳转
	$('.goPage-addSrc2 a').on('click', function() {
		$('.holder2').jPages(parseInt($('.goPage-addSrc2 input').val()));
		return false;
	});

	//全选文本
	$('.goPage-addSrc input').on('focus', function() {
		$(this).select();
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

	// 显隐分类
	$('body').on('click', function(e) {
		if ($(e.target).is('.selectQue') || $(e.target).hasClass('switch')) {
			$('#ztree2').fadeIn();
			$('#ztree2 li:first').slimScroll({
				height: '300px',
			});
		} else {
			$('#ztree2').fadeOut();
		}
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

	//获取生效渠道
	Base.request({
		url: 'Configuration/listItem',
		params: {},
		callback: function(data) {
			if (data.status) {
				Base.gritter(data.message, false);
			} else {
				//生效渠道
				if (data.listItem[0].IsDisplay) { //不展示
					$('.channelCtn').remove();
				} else {
					var html = '';
					if (data.listItem[0].DicList) {
						for (var i = 0; i < data.listItem[0].DicList.length; i++) {
							html += '<a href="javascript:;" class="btn btn-sm btn-white changeChannel" DicCode="' + data.listItem[0].DicList[i].DicCode + '" go="0" style="margin: 2px;">' + data.listItem[0].DicList[i].DicDesc + '</a>';
						}
					}
					$('.channel').append(html);
				}

				//生效角色
				if (data.listItem[1].IsDisplay) { //不展示
					$('.roleCtn').remove();
				}

			}
		},
	});
	//切换选择渠道
	$('body').on('click', '.changeChannel', function() {
		if (+($(this).attr('go'))) { //1
			$(this).attr('go', '0');
			$(this).removeClass('btn-primary');
		} else {
			$(this).attr('go', '1');
			$(this).addClass('btn-primary');
		}
	});
});
