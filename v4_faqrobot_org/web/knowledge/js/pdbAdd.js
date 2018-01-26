// 创建根实例
var vm = new Vue({
	el: '#container',
	data: {
		items: [],
		pubitems: [],
		//选中的左侧
		checkedNames: [],
		//选中的标准问法
		selectedStd: ''
	},
	methods: {
		addAsStandard: function() {
			if(this.pubitems.length>0 || this.checkedNames.length>1) {
				yunNotyError('只能添加一个标准问法');
			} else if(this.checkedNames.length<1) {
				yunNotyError('请选择一个问题作为标准问法');
			} else {
				var checkId = '';
				for(var i in this.items) {
					if(this.items[i].name == this.checkedNames[0]) {
						checkId = this.items[i].id;
					}
				}
				this.pubitems.push({
					id: checkId,
					name: this.checkedNames[0],
					display: false
				});
				vm.checkedNames = [];
			}
		},
		addAsSimilar: function() {
			if(this.selectedStd == '' || this.selectedStd == null) {
				yunNotyError('请选择一个问题作为标准问法');
			} else {
				var addedquestions = [];
				for(var x in this.pubitems) {
					addedquestions.push(this.pubitems[x].id);
					for(var y in this.pubitems[x].similars) {
						addedquestions.push(this.pubitems[x].similars[y].id);
					}
				}
				var checkquestions = [];
				for(var i in this.items) {
					for(var j in this.checkedNames) {
						if(this.items[i].name == this.checkedNames[j]) {
							for(var k in addedquestions) {
								if(addedquestions[k] == this.items[i].id) {
									yunNotyError('问题【'+this.items[i].name+'】已添加');
									return;
								}
							}
							checkquestions.push({
								id: this.items[i].id,
								name: this.items[i].name,
								display: false
							});
						}
					}
				}
				for(var i in this.pubitems) {
					if(this.pubitems[i].name == this.selectedStd) {
						if(this.pubitems[i].similars) {
							this.pubitems[i].similars = this.pubitems[i].similars.concat(checkquestions);
							this.$set(this.pubitems, i, this.pubitems[i]);
						} else {
							this.pubitems[i].similars = [];
							this.pubitems[i].similars = this.pubitems[i].similars.concat(checkquestions);
							this.$set(this.pubitems, i, this.pubitems[i]);
						}
					}
				}
				vm.checkedNames = [];
			}
		},
		//标准问题input同步
		Srenew: function(index) {
			this.$set(this.pubitems, index, this.pubitems[index]);
		},
		//标准问题修改同步
		SrenewBtn: function(index) {
			this.pubitems[index].display = !(this.pubitems[index].display);
		},
		//标准问题删除同步
		SremoveBtn: function(index) {
			this.pubitems.splice(index, 1);
		},
		//相似问法input同步
		renew: function(index) {
			this.$set(this.pubitems, index, this.pubitems[index]);
		},
		//相似问法修改同步
		renewBtn: function(index, sindex) {
			this.pubitems[index].similars[sindex].display = !(this.pubitems[index].similars[sindex].display);
			this.$set(this.pubitems, index, this.pubitems[index]);
		},
		//相似问法删除同步
		removeBtn: function(index, sindex) {
			this.pubitems[index].similars.splice(sindex, 1);
			this.$set(this.pubitems, index, this.pubitems[index]);
		}
	}
});

var vm2 = new Vue({
	el: '#container2',
	data: {
		items: [],
		pubitems: [],
		//选中的左侧
		checkedNames: [],
		//选中的标准问法
		selectedStd: ''
	},
	methods: {
		addAsStandard: function() {
			var num = 0;
			for(var k in this.pubitems) {
				if(this.pubitems[k].id != '' && this.pubitems[k].id != null && this.pubitems[k].id.toString().substr(0, 4) != 'copy') {
					num += 1;
				}
			}
			if(num>=1 || this.checkedNames.length>1) {
				yunNotyError('只能添加一个标准问法到公共库');
			} else if(this.checkedNames.length<1) {
				yunNotyError('请选择左侧的一个问题');
			} else {
				var checkId = '';
				for(var i in this.items) {
					if(this.items[i].name == this.checkedNames[0]) {
						checkId = this.items[i].id;
					}
				}
				this.pubitems.push({
					id: checkId,
					name: this.checkedNames[0],
					display: false,
					editable: true,
					solutionId: '',
					similars: []
				});
				vm2.checkedNames = [];
			}
		},
		addAsSimilar: function() {
			if(this.selectedStd == '' || this.selectedStd == null) {
				yunNotyError('请选择右侧的一个问题');
			} else {
				var checkquestions = [];
				var addedquestions = [];
				for(var x in this.pubitems) {
					addedquestions.push(this.pubitems[x].id);
					for(var y in this.pubitems[x].similars) {
						addedquestions.push(this.pubitems[x].similars[y].id);
					}
				}
				for(var i in this.items) {
					for(var j in this.checkedNames) {
						if(this.items[i].name == this.checkedNames[j]) {
							for(var k in addedquestions) {
								if(addedquestions[k] == this.items[i].id) {
									yunNotyError('问题【'+this.items[i].name+'】已添加');
									return;
								}
							}
							checkquestions.push({
								id: this.items[i].id,
								name: this.items[i].name,
								display: false,
								editable: true
							});
						}
					}
				}
				for(var i in this.pubitems) {
					if(this.pubitems[i].name == this.selectedStd) {
						//console.log(checkquestions);
						if(this.pubitems[i].similars) {
							this.pubitems[i].similars = this.pubitems[i].similars.concat(checkquestions);
							this.$set(this.pubitems, i, this.pubitems[i]);
						} else {
							this.pubitems[i].similars = [];
							this.pubitems[i].similars = this.pubitems[i].similars.concat(checkquestions);
							this.$set(this.pubitems, i, this.pubitems[i]);
						}
					}
				}
				vm2.checkedNames = [];
			}
		},
		//标准问题input同步
		Srenew: function(index) {
			this.$set(this.pubitems, index, this.pubitems[index]);
		},
		//标准问题修改同步
		SrenewBtn: function(index) {
			this.pubitems[index].display = !(this.pubitems[index].display);
		},
		//标准问题删除同步
		SremoveBtn: function(index) {
			this.pubitems.splice(index, 1);
		},
		//相似问法input同步
		renew: function(index) {
			this.$set(this.pubitems, index, this.pubitems[index]);
		},
		//相似问法修改同步
		renewBtn: function(index, sindex) {
			this.pubitems[index].similars[sindex].display = !(this.pubitems[index].similars[sindex].display);
			this.$set(this.pubitems, index, this.pubitems[index]);
		},
		//相似问法删除同步
		removeBtn: function(index, sindex) {
			this.pubitems[index].similars.splice(sindex, 1);
			this.$set(this.pubitems, index, this.pubitems[index]);
		}
	}
});

$(document).ready(function() {
	$('.form_datetime').datetimepicker({
		format: 'yyyy-mm-dd hh:ii',
		language: 'zh-CN',
		autoclose: true,
		todayBtn: true,
		minuteStep: 10,
		endDate: new Date(),
		initialDate: new Date()
	});
	listQueFlow(1);
	$('#newModal').on('hide.bs.modal', function() {
		vm.items = [];
		vm.pubitems = [];
		vm.checkedNames = [];
		vm.selectedStd = '';
	});
	$('#addModal').on('hide.bs.modal', function() {
		vm2.items = [];
		vm2.pubitems = [];
		vm2.checkedNames = [];
		vm2.selectedStd = '';
	});
	$('body').on('click', '.addBtn', function() {
		var i = $(this).parents('li').index();
		answer = returnList[i].Answer;
		if(returnList[i].HasAddCount === 0) {
			//如果是第一次添加
			vm.items.push({
				id: returnList[i].Id,
				name: returnList[i].Question
			});
			if(returnList[i].SimilarList && returnList[i].SimilarList[0]) {
				for(var j in returnList[i].SimilarList) {
					vm.items.push({
						id: returnList[i].SimilarList[j].Id,
						name: returnList[i].SimilarList[j].Question
					});
				}
			}
			$('#newModal').modal('show');
		} else if(returnList[i].CanAddCount > 0) {
			//如果不是第一次
			vm2.items.push({
				id: returnList[i].Id,
				name: returnList[i].Question,
				disabled: returnList[i].AddCount === 1 ? true : false
			});
			if(returnList[i].AddCount === 1) {
				checkSolutionId(returnList[i].Question);
			}
			if(returnList[i].SimilarList && returnList[i].SimilarList[0]) {
				for(var j in returnList[i].SimilarList) {
					vm2.items.push({
						id: returnList[i].SimilarList[j].Id,
						name: returnList[i].SimilarList[j].Question,
						disabled: returnList[i].SimilarList[j].AddCount === 1 ? true : false
					});
					if(returnList[i].SimilarList[j].AddCount === 1) {
						checkSolutionId(returnList[i].SimilarList[j].Question);
					}
				}
			}
			$('#addModal').modal('show');
		}
	});
});

function checkSolutionId(question) {
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../PublicDataBase/findQuestionInPub?question='+question),
		success: function(data) {
			if(data.list) {
				for(var i = 0; i < vm2.pubitems.length; i++) {
					if(vm2.pubitems[i].solutionId === data.list.SolutionId) return;
				}
				var rdm = randomString(8);
				vm2.pubitems.push({
					id: 'copy'+rdm,
					name: data.list.Question,
					display: false,
					editable: false,
					solutionId: data.list.SolutionId,
					similars: []
				});
				if(data.list.SimilarList && data.list.SimilarList[0]) {
					for(var j in data.list.SimilarList) {
						vm2.pubitems[vm2.pubitems.length-1].similars.push({
							id: 'copy'+rdm,
							name: data.list.SimilarList[j].Question,
							display: false,
							editable: false
						});
					}
				}
			}
		}
	});
}

var answer = '';
//新增提交
var flag_new=false;
function subNew() {
	var datatosend = {};
	datatosend.question = vm.pubitems[0].name;
	datatosend.ids = vm.pubitems[0].id;
	var similarQues = '';
	for(var i in vm.pubitems[0].similars) {
		similarQues += 'similarQues=' + (vm.pubitems[0].similars[i].name) + '&';
		datatosend.ids += ',' + vm.pubitems[0].similars[i].id;
	}
	similarQues = similarQues.substr(0, similarQues.length-1);
	datatosend.answer = answer;
	datatosend.isExist = 0;
	if(flag_new){
		return;
	}
	flag_new=true;
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../PublicDataBase/addQuestionIntoPub?'+similarQues),
		data: datatosend,
		success: function(data) {
			flag_new=false;
			if (data.status == 0) {
				yunNoty(data);
				listQueFlow();
				$('#newModal').modal('hide');
			} else {
				yunNoty(data);
			}
		}
	});
}

//添加提交
function subAdd() {
	for(var i in vm2.pubitems) {
		//标准问题不存在
		if(vm2.pubitems[i].id != '' && vm2.pubitems[i].id != null && vm2.pubitems[i].id.toString().substr(0, 4) != 'copy') {
			var datatosend = {};
			datatosend.question = vm2.pubitems[i].name;
			datatosend.ids = vm2.pubitems[i].id;
			var similarQues = '';
			for(var j in vm2.pubitems[i].similars) {
				if(vm2.pubitems[i].similars[j].id !== '') {
					similarQues += 'similarQues=' + (vm2.pubitems[i].similars[j].name) + '&';
					datatosend.ids += ',' + vm2.pubitems[i].similars[j].id;
				}
			}
			if(similarQues.length) {
				similarQues = similarQues.substr(0, similarQues.length-1);
			}
			datatosend.answer = answer;
			datatosend.isExist = 0;
			$.ajax({
				type: 'post',
				datatype: 'json',
				cache: false,
				//不从缓存中去数据
				url: encodeURI('../../PublicDataBase/addQuestionIntoPub?'+similarQues),
				data: datatosend,
				success: function(data) {
					if (data.status == 0) {
						yunNoty(data);
						listQueFlow();
						$('#addModal').modal('hide');
					} else {
						yunNoty(data);
					}
				}
			});
		} else {
			var datatosend = {};
			datatosend.question = vm2.pubitems[i].name;
			var similarQues = '';
			for(var j in vm2.pubitems[i].similars) {
				if(vm2.pubitems[i].similars[j].id !== '') {
					similarQues += 'similarQues=' + (vm2.pubitems[i].similars[j].name) + '&';
					datatosend.ids += ',' + vm2.pubitems[i].similars[j].id;
				}
			}
			if(similarQues.length) {
				similarQues = similarQues.substr(0, similarQues.length-1);
			} else {
				continue;
			}
			datatosend.answer = answer;
			datatosend.isExist = 1;
			$.ajax({
				type: 'post',
				datatype: 'json',
				cache: false,
				//不从缓存中去数据
				url: encodeURI('../../PublicDataBase/addQuestionIntoPub?'+similarQues),
				data: datatosend,
				success: function(data) {
					if (data.status == 0) {
						yunNoty(data);
						listQueFlow();
						$('#addModal').modal('hide');
					} else {
						yunNoty(data);
					}
				}
			});
		}
	}
}

var returnList = null;
function listQueFlow(pageNo) {
	if (!pageNo) pageNo = $('#pageList').find('li.active a').html() * 1;
	if (!pageNo) pageNo = 1;
	var dd = {
		pageNo: pageNo,
		pageSize: '10',
		status: $('#status').val(),
		startTime: $('#sT').val(),
		endTime: $('#eT').val()
	};
	switch($('#pType').val()) {
	case 'webId':
		dd.webId = $('#sinput').val();
		break;
	case 'groupName':
		dd.groupName = $('#sinput').val();
		break;
	case 'question':
		dd.question = $('#sinput').val();
		break;
	}
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../PublicDataBase/findAllQuestionList'),
		data: dd,
		success: function(data) {
			if (data.status == 0) {
				if (data.list.length > 0) {
					var html = '';
					var List = returnList = data.list;
					for (var i = 0; i < List.length; i++) {
						var simCount = 0;
						var simText = '';
						html += '<li id="li_'+i+'">';
						var dis = '';
						if(List[i].CanAddCount==0) {
							dis = 'text-default';
						} else if(List[i].HasAddCount==0) {
							dis = 'text-info';
						} else {
							dis = 'text-warning';
						}
						html += '<div style="font-size: 16px;">'+(i+1)+'.&nbsp;'+List[i].Question+'</div>';
						html += '<div style="padding: 5px;background: #f8f8f8;"><span class="label label-info">答案</span><br><br>'+List[i].Answer+'<br></div>';
						if(List[i].SimilarList && List[i].SimilarList[0]) {
							for(var j=0; j < List[i].SimilarList.length; j++) {
								simText += '<div>'+(j+1)+'.'+List[i].SimilarList[j].Question+'<span class="pull-right">'+List[i].SimilarList[j].AddTime+'</span></div>';
								simCount += 1;
							}
						}
						html += '<div><span style="color:#0088cc;">来自站点：'+List[i].WebId+'</span>&nbsp;&nbsp;<span style="color:#E03E61;">相似问题（'+simCount+'）</span><span style="display:inline-block;margin:0 5px;">已添加：'+List[i].HasAddCount+'</span><span style="display:inline-block;margin:0 5px;">待添加：'+List[i].CanAddCount+'</span><a class="addBtn '+dis+'">立即添加</a></div>';
						html += '<div>'+simText+'</div>';
						html += '</li>';
					}
					$('.qlist').empty().append(html);
					//下面开始处理分页
					var options = {
						data: [data, 'list', 'total'],
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						alignment: 'right',
						onPageClicked: function(event, originalEvent, type, page) {
							listQueFlow(page);
						}
					};
					setPage('pageList', options);
				} else {
					if ($('input[name=searchvalue]').val() != '') {
						$('.qlist').empty().append('<li style="text-align:center;"><i class="icon-exclamation-sign"></i>&nbsp;&nbsp;搜索结果为空！</li>');
					} else {
						$('.qlist').empty().append('<li style="text-align:center;"><i class="icon-exclamation-sign"></i>&nbsp;&nbsp;当前纪录为空！</li>');
					}
					$('#pageList').html('');
				}
			} else {
				yunNoty(data);
			}
		}
	});
}

function randomString(len) {
	len = len || 32;
	var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678oOLl9gqVvUuI1';
	var maxPos = $chars.length;
	var pwd = '';
	for (i = 0; i < len; i++) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return pwd;
}