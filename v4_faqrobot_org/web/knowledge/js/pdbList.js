// 创建根实例
var vm = new Vue({
	el: '#questionList',
	data: {
		list: [],
		checkedNames: []
	},
	methods: {
		addAsStandard: function() {
			if(this.list.length>0 || this.checkedNames.length>1) {
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
				this.list.push({
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
				var checkquestions = [];
				for(var i in this.items) {
					for(var j in this.checkedNames) {
						if(this.items[i].name == this.checkedNames[j]) {
							checkquestions.push({
								id: this.items[i].id,
								name: this.items[i].name,
								display: false
							});
						}
					}
				}
				for(var i in this.list) {
					if(this.list[i].name == this.selectedStd) {
						if(this.list[i].similars) {
							this.list[i].similars = this.list[i].similars.concat(checkquestions);
							this.$set(this.list, i, this.list[i]);
						} else {
							this.list[i].similars = [];
							this.list[i].similars = this.list[i].similars.concat(checkquestions);
							this.$set(this.list, i, this.list[i]);
						}
					}
				}
				vm.checkedNames = [];
			}
		},
		//相似问法是否展示
		toggle: function(index) {
			this.list[index].display = !this.list[index].display;
		},
		//标准问法编辑是否展示
		toggle1: function(index, flag) {
			var self = this;
			if(flag == 1) {
				$.ajax({
					type: 'post',
					datatype: 'json',
					cache: false,
					//不从缓存中去数据
					url: encodeURI('/PublicDataBase/editQuestionInPub'),
					data: {
						id: self.list[index].Id,
						question: self.list[index].editWord
					},
					success: function(data) {
						if(data.status === 0) {
							yunNoty(data);
							self.list[index].Question = self.list[index].editWord;
							self.list[index].editdisplay = !self.list[index].editdisplay;
							self.list[index].editWord = '';
						} else {
							yunNoty(data);
						}
					}
				});
			} else if(flag == 2) {
				self.list[index].editdisplay = !self.list[index].editdisplay;
				self.list[index].editWord = '';
			} else if(flag == 3) {
				if(self.list[index].editWord == '') {
					self.list[index].editWord = self.list[index].Question;
				} else {
					self.list[index].editWord = '';
				}
				self.list[index].editdisplay = !self.list[index].editdisplay;
			}
		},
		//
		toggle2: function(index, Sindex, flag) {
			var self = this;
			if(flag == 1) {
				$.ajax({
					type: 'post',
					datatype: 'json',
					cache: false,
					//不从缓存中去数据
					url: encodeURI('/PublicDataBase/editQuestionInPub'),
					data: {
						id: self.list[index].SimilarList[Sindex].Id,
						question: self.list[index].SimilarList[Sindex].editWord
					},
					success: function(data) {
						if(data.status === 0) {
							yunNoty(data);
							self.list[index].SimilarList[Sindex].Question = self.list[index].SimilarList[Sindex].editWord;
							self.list[index].SimilarList[Sindex].editdisplay = !self.list[index].SimilarList[Sindex].editdisplay;
							self.list[index].SimilarList[Sindex].editWord = '';
						} else {
							yunNoty(data);
						}
					}
				});
			} else if(flag == 2) {
				self.list[index].SimilarList[Sindex].editdisplay = !self.list[index].SimilarList[Sindex].editdisplay;
				self.list[index].SimilarList[Sindex].editWord = '';
			} else if(flag == 3) {
				self.list[index].SimilarList[Sindex].editdisplay = !self.list[index].SimilarList[Sindex].editdisplay;
			}
		},
		addBtn: function(index) {
			$('#addSForm input[name=solutionId]').val(this.list[index].SolutionId);
			$('#addSForm input[name=index]').val(index);
			$('#addSModal').modal('show');
		},
		//
		removeBtn: function(index, sindex) {
			var self = this;
			$.ajax({
				type: 'post',
				datatype: 'json',
				cache: false,
				//不从缓存中去数据
				url: encodeURI('/PublicDataBase/delQuestionInPub'),
				data: {
					id: self.list[index].Id
				},
				success: function(data) {
					if(data.status === 0) {
						yunNoty(data);
						listQueFlow();
					} else {
						yunNoty(data);
					}
				}
			});
		},
		//
		SremoveBtn: function(index, Sindex) {
			var self = this;
			$.ajax({
				type: 'post',
				datatype: 'json',
				cache: false,
				//不从缓存中去数据
				url: encodeURI('/PublicDataBase/delQuestionInPub'),
				data: {
					id: self.list[index].SimilarList[Sindex].Id
				},
				success: function(data) {
					if(data.status === 0) {
						yunNoty(data);
						self.list[index].SimilarList.splice(Sindex, 1);
						self.$set(self.list, index, self.list[index]);
					} else {
						yunNoty(data);
					}
				}
			});
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
});

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
		url: encodeURI('../../PublicDataBase/findAllQuestionInPub'),
		data: dd,
		success: function(data) {
			if (data.status == 0) {
				$('.pageTotal').html(data.total);
				if (data.list.length > 0) {
					for(var i in data.list) {
						if(data.list[i].SimilarList.length > 0) {
							data.list[i].display = false;
						} else {
							data.list[i].display = true;
						}
						data.list[i].editWord = '';
						data.list[i].editdisplay = false;
						for(var j in data.list[i].SimilarList) {
							data.list[i].SimilarList[j].editWord = '';
							data.list[i].SimilarList[j].editdisplay = false;
						}
					}
					vm.list = data.list;
					$('.currPage').html(data.list.length);
					//下面开始处理分页
					var options = {
						currentPage: data.currentPage,
						totalPages: data.totlePages,
						alignment: 'right',
						onPageClicked: function(event, originalEvent, type, page) {
							listQueFlow(page);
						}
					};
					setPage('pageList', options);
				} else {
					vm.list = [];
					$('#pageList').html('');
					$('.currPage').html(0);
				}
			} else {
				yunNoty(data);
			}
		}
	});
}

//新增提交
var flag_add=false;
function add() {
	if(flag_add){
		return;
	}
	flag_add=true;
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('/PublicDataBase/addQuestionIntoPub'),
		data: $('#addForm').serialize(),
		success: function(data) {
			flag_add=false;
			if (data.status == 0) {
				yunNoty(data);
				$('#addModal').modal('hide');
				listQueFlow();
			} else {
				yunNoty(data);
			}
		}
	});
}

//新增相似问法提交
var flag_sadd=false;
function addS() {
	if(flag_sadd){
		return;
	}
	flag_sadd=true;
	$.ajax({
		type: 'post',
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('/PublicDataBase/addSimlarQuestionIntoPub'),
		data: $('#addSForm').serialize(),
		success: function(data) {
			flag_sadd=false;
			if (data.status == 0) {
				yunNoty(data);
				$('#addSModal').modal('hide');
				var index = $('#addSForm input[name=index]').val();
				var Question = $('#addSForm input[name=question]').val();
				vm.list[index].SimilarList.push({
					Id: data.id,
					Question: Question,
					editWord: '',
					editdisplay: false
				});
			} else {
				yunNoty(data);
			}
		}
	});
}