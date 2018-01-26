$(document).ready(function() {
			App.init();
			$('#byTimePiece .selectpicker').selectpicker({
				style: 'btn-primary',
				width: '100%'
			});
			$('#byTimePiece .selectpicker').on('change',function(){
				listPorts(1)
			});
			$('#addPortLi').on('click', function(){
				var tmpNum=parent.$('#tabHeader li[data-tab="'+location.href+'"]').attr('data-num');//获取当前url中的data-num
				ifbOpenWindowInNewTab('/web/temp/addPort.html?tmpNum='+tmpNum, '添加知识集', 'g7');
			});
			//$(document).on('click', '#labelChoose', function(event){
			//	event.stopPropagation();
			//	$('.dpd').toggleClass('see');
			//});
			$(document).on('mouseover mouseout', '#dpc', function(event) {
				if(event.type == "mouseover") {
					$('.dpd').toggleClass('see');
				} else if(event.type == "mouseout") {
					$('.dpd').toggleClass('see');
				}
			});
			$(document).on('mouseover mouseout', '#dpd', function(event) {
				if(event.type == "mouseover") {
					$('.dpd').toggleClass('see');
				} else if(event.type == "mouseout") {
					$('.dpd').toggleClass('see');
				}
			});
			$(document).on('click', '#labelDiv', function(event){
				event.stopPropagation();
			});
			$(document).on('click', '.labelDiv', function(event){
				event.stopPropagation();
				$(this).children().toggleClass('label-primary');
				listPorts(1);
			});
			
			//$(document).on('click', function(){
			//	$('.dpd').removeClass('see');
			//});
			listPorts();
			$.ajax({
				type: 'get',
				datatype: 'json',
				cache: false,
				//不从缓存中去数据
				url: encodeURI('../../label/findAllLabels'),
				success:function(data){
					$('#labelDiv').empty();
					data.list.forEach(function(el){
						$('#labelDiv').append('<div class="labelDiv"><span class="label label-default" style="cursor:pointer;" rel="'+el.Id+'">'+el.LabelName+'</span></div>');
					});
					if($('#labelDiv').html() == '') {
						$('#labelDiv').append('<div style="text-align:center;">暂无标签</div>');
					}
				}
			});
		});
		
		$("body").on("click", ".previewBtn", function() {
		    $(".iyunwen_js_class").remove();
		    $(this).parent().attr('href',chatlinklist[$(this).parents("tr").index()].VisitUrl);
		});
		var chatlinklist = [];
		enterSubmit($('#sip'),listPorts);
		function listPorts(pageNo) {
			//不勾选全选
			//$('.select_rows').iCheck('uncheck');
			if (!pageNo) pageNo = 1;
			//$('#wordweightList').tableAjaxLoader2(3);
			var dataJSON = {};
			var labels = '';
			$('.label-primary').each(function(){
				labels += $(this).attr('rel')+',';
			});
			if(labels != '') {
				if(labels.split(',').length > 1){
					labels = labels.substring(0,labels.length-1);
				}
				dataJSON.labelId = labels;
			}
			dataJSON.name = $('#sip').val();
			dataJSON.orderType = $('#byTimePiece .selectpicker').val();
			$.ajax({
				type: 'get',
				datatype: 'json',
				cache: false,
				//不从缓存中去数据
				url: encodeURI('../../ChatLink/listChatLink?pageSize=' + 10 + '&pageNo=' + pageNo),
				data:dataJSON,
				success: function(data) {
					if (data.status == 0) {
						if(data.list==undefined){
							$('#listContainer').html('<div class="row text-center"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</div>');
							$('#pageList').html('');
							return;
						}
						if (data.list.length > 0) {
							listWordWeightData = data.list;
							for(var i = 0;i < listWordWeightData.length;i++){
								//listWordWeightData[i].VisitUrl = "<script src='http://"+window.location.host+'/robot/skin/zbj/priview/14435836731645796_'+data.list[i].Id+".js' webId='"+data.list[i].WebId+"' jid='"+data.list[i].Id+"' language='JavaScript'></script>";
								listWordWeightData[i].VisitUrl = "http://"+window.location.host+(localStorage.getItem('Subdomain')||"")+'/robot/chat5.html?receiveId='+data.list[i].Id+'&sysNum='+sessionStorage.getItem('sysNum');
							}
							chatlinklist = listWordWeightData;
							var template = Handlebars.compile($("#list-item-template").html());
							var html = template(data);
							$('#listContainer').html(html);
							$('.timeTip').tooltip();
							// 绑定事件
							$('.ckb').add('#ckAll').iCheck({
								checkboxClass: 'icheckbox_flat-blue',
								radioClass: 'iradio_flat-blue',
								cursor: true
							});
							$('#ckAll').on('ifClicked', function() {
								var ckbs = $('.ckb');
								if ($(this)[0].checked) {
									ckbs.iCheck('uncheck');
								} else {
									ckbs.iCheck('check');
								}
							});
							function selectDel2(ids, url, fun, pageId) {
								if (ids === '') {
									ids = getSelectedIds();
								}
								if (ids === "") {
									return false;
								}
								if (url === "") {
									return false;
								}
								$.getJSON(url, "id=" + ids,
								function(data) {
									if (data.status === 0) {
										var ids_array = ids.split(",");
										for (i = 0; i < ids_array.length; i++) {
											$('#list-tr-' + ids_array[i]).hide();
										}
										if (typeof fun == "function") {
											if (pageId) {
												var page = $('#' + pageId + ' .active a').html();
												var oT = $('input[name=orderType]').val();
												if($('.m-del')!==undefined) {
													if($('.m-del').size()==ids_array.length) page-=1;
													if(page<1) page=1;
												}
												if (oT) {
													fun(page, oT);
												} else {
													fun(page);
												}
							
											} else {
												fun();
											}
										}
										$('.select_rows').attr('checked', false);
										yunNoty(data);
									} else {
										yunNoty(data);
									}
								});
								return false;
							}
							//批量删除按钮，是否可用判断
							$("#mul-del").removeClass("btn-primary").addClass("btn-default").attr("disabled",true);

							$(".ckb").on("ifChanged",function(){
								if($(".ckb:checked").length>0){
									$("#mul-del").removeClass("btn-default").addClass("btn-primary").attr("disabled",false)
								}else{
									$("#mul-del").removeClass("btn-primary").addClass("btn-default").attr("disabled",true)
								}
							});

							$('#mul-del').off('click').on('click', function() {
								$(this).adcCreator(function() {
									var cboxs = document.getElementsByClassName('ckb');
									if (typeof cboxs == "undefined") {
										return "";
									}
									var inputvalue = "";

									for (var i = 0; i < cboxs.length; i++) {
										if (cboxs[i].checked === true) {
											inputvalue += cboxs[i].dataset.id + ",";
										}
									}
									if(inputvalue==""){
										yunNotyError('请选择需要移除的问题！');
									}
									inputvalue = inputvalue.substring(0,inputvalue.length-1);
									selectDel2(inputvalue, '../../ChatLink/delChatLinkById', listPorts)
								});
							});
							$('#ckAll').iCheck('uncheck');
							$('.ckb').on('ifUnchecked', function() {
								$('#ckAll').iCheck('uncheck');
							});
							$('.url').each(function(i){
								new QRCode($('.qrcode')[i], {
									text: $(this).html(),
									width: 128,
									height: 128,
									colorDark : "#000000",
									colorLight : "#ffffff",
									correctLevel : QRCode.CorrectLevel.L
								});
							})
							//填充模态窗
							$('.edit').click(function(){
								var index = $(this).attr('rel');
								if(window.top.location.href != window.location.href) {
									$('body').append('<a href="../../web/temp/addPort.html?id='+index+'" data-num="0" data-name="修改知识集" style="display:none;" class="g'+index+'">修改知识集</a>');
									iframeTab.init({
										iframeBox: ''
									});
									$('.g'+index).trigger('click');
								} else {
									location.href="../../web/temp/addPort.html?id="+index;
								}
							});
							//单个删除
							$('.m-del').on('click',function(){
								var self = this;
								$(self).adcCreator(function() {
									delById(self,'../../ChatLink/delChatLinkById',listPorts,'pageList');
								});
							});
							//下面开始处理分页
							var options = {
								data: [data, 'list', 'total'],
								currentPage: data.currentPage,
								totalPages: data.totlePages ? data.totlePages : 1,
								onPageClicked: function(event, originalEvent, type, page) {
									listPorts(page);
								}
							};
							$('#pageList').bootstrapPaginator(options);
						} else {
							$('#listContainer').html('<div class="row text-center"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</div>');
							$('#pageList').html('');
						}
					} else {
						yunNoty(data);
					}
				}
			});
		}