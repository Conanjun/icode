
;$(function() {
    /*** addSrc ***/
    var AddSrcTest = function() {
        var This = this;
        var type = 1,//素材类型
            pageNo = 1,//当前页
            pageSize = 10,//每页数量
            name = '',//搜索内容
            isJpage = 0,//是否已实例化jpage
            delPage = 0,//是否删除jpage
			groupId = 0;

        function initSrc() {
            $('.multCos').iCheck('uncheck');
            Base.request({
                url: 'material/list?name='+ name,
                params: {
                    type: type,
                    pageNo: pageNo,
                    pageSize: pageSize,
					groupId: groupId
                },
                callback: function(data) {
                    if(data.status) {
                        Base.gritter(data.message, false);
                    }else {
                        var html ='';
                        if(data.list) {
                            if(data.list[0]) {
                                for(var i=0; i<data.list.length; i++) {

                                    switch(type) {
                                        case 1://图片
                                            html += '<tr Id="'+ data.list[i].Id +'"><td><input class="singleCos" type="checkbox"></td><td><a href="../../'+ data.list[i].Path +'" data-lightbox="image-1"><img src="../../'+ data.list[i].Path +'" alt="'+ data.list[i].Name +'" title="'+ data.list[i].Name +'"></a></td><td><a href="../../'+ data.list[i].Path +'" target="_blank">'+ data.list[i].Name +'</a></td><td>'+ Base.formatSize(data.list[i].Size) +'</td><td>'+ data.list[i].Time +'</td><td>'+ data.list[i].UserName +'</td><td><a href="javascript:;"><i class="editClass glyphicon glyphicon-pencil" title="修改分类"></i></a>&nbsp;<a><i class="one-del-addSrc glyphicon glyphicon-trash" title="删除"></i></a></td></tr>';
                                            break;
                                        case 2://语音
                                            html += '<tr Id="'+ data.list[i].Id +'"><td><input class="singleCos" type="checkbox"></td><td><div id="jquery_jplayer_'+ i +'"class="jp-jplayer" path="../../'+ data.list[i].Path +'"></div><div id="jp_container_'+ i +'"class="jp-audio"role="application"aria-label="media player"><div class="jp-type-single"><div class="jp-gui jp-interface"><div class="jp-controls"><button class="jp-play"role="button"tabindex="0">play</button><button class="jp-stop"role="button"tabindex="0">stop</button></div><div class="jp-progress"><div class="jp-seek-bar"><div class="jp-play-bar"></div></div></div><div class="jp-time-holder"><div class="jp-current-time"role="timer"aria-label="time">&nbsp;</div><div class="jp-duration"role="timer"aria-label="duration">&nbsp;</div><div class="jp-toggles"><button class="jp-repeat"role="button"tabindex="0">repeat</button></div></div></div><div class="jp-no-solution"><span>Update Required</span>To play the media you will need to either update your browser to a recent version or update your<a href="http://get.adobe.com/flashplayer/"target="_blank">Flash plugin</a>.</div></div></div></td><td><a href="../../'+ data.list[i].Path +'" target="_blank">'+ data.list[i].Name +'</a></td><td>'+ Base.formatSize(data.list[i].Size) +'</td><td>'+ data.list[i].Time +'</td><td>'+ data.list[i].UserName +'</td><td><a href="javascript:;"><i class="editClass glyphicon glyphicon-pencil" title="修改分类"></i></a>&nbsp;<a><i class="one-del-addSrc glyphicon glyphicon-trash" title="删除"></i></a></td></tr>';
                                            break;
                                        case 3://视频
                                            html += '<tr Id="'+ data.list[i].Id +'"><td><input class="singleCos" type="checkbox"></td><td><img class="videoBtn-addSrc" path="../../'+ data.list[i].Path +'" src="images/a_video.png" alt="'+ data.list[i].Name +'" title="'+ data.list[i].Name +'" width="35" height="35" href="#modal-dialog" data-toggle="modal"></td><td><a href="../../'+ data.list[i].Path +'" target="_blank">'+ data.list[i].Name +'</a></td><td>'+ Base.formatSize(data.list[i].Size) +'</td><td>'+ data.list[i].Time +'</td><td>'+ data.list[i].UserName +'</td><td><a href="javascript:;"><i class="editClass glyphicon glyphicon-pencil" title="修改分类"></i></a>&nbsp;<a><i class="one-del-addSrc glyphicon glyphicon-trash" title="删除"></i></a></td></tr>';
                                            break;
                                        case 4://文档
                                            html += '<tr Id="'+ data.list[i].Id +'"><td><input class="singleCos" type="checkbox"></td><td><a href="../../'+ data.list[i].Path +'"><img src="images/a_doc.png" alt="'+ data.list[i].Name +'" title="'+ data.list[i].Name +'" width="35" height="35"></a></td><td><a href="../../'+ data.list[i].Path +'" target="_blank">'+ data.list[i].Name +'</a></td><td>'+ Base.formatSize(data.list[i].Size) +'</td><td>'+ data.list[i].Time +'</td><td>'+ data.list[i].UserName +'</td><td><a href="javascript:;"><i class="editClass glyphicon glyphicon-pencil" title="修改分类"></i></a>&nbsp;<a><i class="one-del-addSrc glyphicon glyphicon-trash" title="删除"></i></a></td></tr>';
                                            break;
                                        case 0://其他
                                            html += '<tr Id="'+ data.list[i].Id +'"><td><input class="singleCos" type="checkbox"></td><td><a href="../../'+ data.list[i].Path +'"><img src="images/a_other.png" alt="'+ data.list[i].Name +'" title="'+ data.list[i].Name +'" width="35" height="35"></a></td><td><a href="../../'+ data.list[i].Path +'" target="_blank">'+ data.list[i].Name +'</a></td><td>'+ Base.formatSize(data.list[i].Size) +'</td><td>'+ data.list[i].Time +'</td><td>'+ data.list[i].UserName +'</td><td><a href="javascript:;"><i class="editClass glyphicon glyphicon-pencil" title="修改分类"></i></a>&nbsp;<a><i class="one-del-addSrc glyphicon glyphicon-trash" title="删除"></i></a></td></tr>';
                                            break;
                                    }
                                }

                                var options = {
                                    data: [data, 'list', 'total'],
                                    currentPage: data.currentPage,
                                    totalPages: data.totlePages ? data.totlePages : 1,
                                    alignment: 'right',
                                    onPageClicked: function(event, originalEvent, type, page) {
                                        pageNo = page;
                                        initSrc();
                                    }
                                };
                                $('#itemContainer').bootstrapPaginator(options);
                            }else {
                                html += '<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
                                $('#itemContainer').empty();
                            }
                        }
                        $('tbody').empty().append(html);
                        icheckInit();

                        switch(type) {
                            case 2://语音
                                if(data.list[0]) {
                                    for(var i=0; i<data.list.length; i++) {
                                        //jplayer
                                        $("#jquery_jplayer_"+ i).jPlayer({
                                            ready: function () {
                                                $(this).jPlayer("setMedia", {
                                                    m4a: $(this).attr('path'),
                                                });
                                            },
                                            supplied: "m4a, oga",
                                            cssSelectorAncestor: "#jp_container_"+ i,
                                            wmode: "window",
                                            globalVolume: true,
                                            useStateClassSkin: true,
                                            autoBlur: false,
                                            smoothPlayBar: true,
                                            keyEnabled: true
                                        });
                                    }
                                }
                                break;
                        }

                        
                    }
                },
            });
        }
        initSrc();


        //为视频设置来源
        $('body').on('click', '.videoBtn-addSrc', function() {
            var $this = $(this);

            $("#jquery_jplayer_video").jPlayer("setMedia", {
                title: $this.attr('title'),
                m4v: $this.attr('path'),
                flv: $this.attr('path'),
            });
        });

        //视频初始化
        $("#jquery_jplayer_video").jPlayer({
            supplied: "webmv, ogv, m4v",
            cssSelectorAncestor: "#jp_container_video",
            size: {
                width: "640px",
                height: "360px",
                cssClass: "jp-video-360p",
            },
            useStateClassSkin: true,
            autoBlur: false,
            smoothPlayBar: true,
            keyEnabled: true,
            remainingDuration: true,
            toggleDuration: true,
        });

        //停止视频
        $('#modal-dialog').on('hidden.bs.modal', function (e) {
            $("#jquery_jplayer_video").jPlayer('stop');
        });

        //上传素材
        var uploader = null;
        resetUploader(0, 10);

        $('.progress-striped').hide();
        $('.tab-addSrc').hide();
        $('.tab-addSrc').eq(0).show();
        var tabIndex = 0;
        //切换素材类型
        $('.tabClick-addSrc').each(function(i) {
            $(this).on('click', function() {
                type = i+1;
                if(i == 4) {
                    type = 0;
                }
                pageNo = 1;
                isJpage = 0;
                name = '';
                initSrc();

                $('.add-src').each(function(i) {
                    var txt = $(this).text();

                    $(this).empty().text(txt);
                });

                if(i == 0) {
                    fileNumLimit = 10;
                }else {
                    fileNumLimit = 1;
                }

                resetUploader(i, fileNumLimit);

                $('.tab-addSrc').hide();
                $('.tab-addSrc').eq(i).show();
            });
        });

        setInterval(function() {
            $('.tabClick-addSrc').each(function(i) {
                if($(this).parent().is('.active')) {
                    var str = '';
                    switch(i) {
                        case 0:
                            str = '添加图片';
                            break;
                        case 1:
                            str = '添加语音';
                            break;
                        case 2:
                            str = '添加视频';
                            break;
                        case 3:
                            str = '添加文档';
                            break;
                        case 4:
                            str = '添加其他';
                            break;
                    }
                    $('.webuploader-pick').html(str);
                }
            });

            
        }, 10)

        //重新生成uploader
        function resetUploader(i, fileNumLimit) {
            if(uploader) {
                uploader.destroy();
            }
            //上传素材
            uploader = WebUploader.create({  
                server: '../../material/jQueryFileUpload?type='+ type+'&materialType='+type+'&groupId='+groupId,
                swf: '../common/js/Uploader.swf',  
                pick: $('.add-src').eq(i),
                fileNumLimit: fileNumLimit,
                chunked: true,
                duplicate: true,
                auto: true,
            });
            //加入队列之前
            uploader.on( 'beforeFileQueued', function( file ) {
                if(!file.size) {
                    Base.gritter('文件大小为空！', false);
                }
                if(type == 4) {
                    var msg = '上传文件错误，支持以xlsx、docx、txt、doc、xls、et、wps、pdf、dps、ppt结尾的格式文件！';
                    if(!(msg.indexOf(file.ext)+1)) {
                        Base.gritter(msg, false);
                        return false;
                    }
                }
                if(type == 0) {
                    var msg = '上传文件错误，支持以 rar、zip、swf、apk、exe、html结尾的格式文件！';
                    if(!(msg.indexOf(file.ext)+1)) {
                        Base.gritter(msg, false);
                        return false;
                    }
                }
            });
            //获取服务端返回的数据
            uploader.on( 'uploadAccept', function( object, data ) {
                var error = data.files[0].error,
                    msg = '上传文件成功';

                if(error) {
                    Base.gritter(error, false);
                }else {
                    Base.gritter(msg, true);
                    initSrc();
                }
            });
            //上传开始
            uploader.on( 'startUpload', function( file, percentage ) { 
                $('.progress-striped').show();
            });
            //上传进度
            uploader.on( 'uploadProgress', function( file, percentage ) { 
                $('.progress-bar').css({'width': percentage*100 +'%'});
            });
            //限制单次上传数量
            uploader.on( 'uploadFinished', function( object, data ) { 
                $('.progress-bar').css({'width': 0});
                $('.progress-striped').hide();
                uploader.reset();
            });
        }

        $('body').on('click', '.editClass', function() {
			$('#editClassModel').modal('show');
			$('#mId').val($(this).parents('tr').attr('Id'));
		});
        $('body').on('click', '#selClassBtn', function() {
            Base.request({
                url: 'material/editGroupIdById',
                params: {
                    id : $('#mId').val(),
                    groupId : $('#editClassModel [name=treeId]').val()
                },
                callback: function(data) {
                    if(data.status === 0) {
						Base.gritter(data.message, true);
						$('#editClassModel').modal('hide');
						initSrc();
					} else {
						Base.gritter(data.message, false);
					}
				}
			});
		});

        //删除
        $('body').on('click', '.one-del-addSrc, .mult-del', function() {
            delPage = 1;

            if($(this).is('.one-del-addSrc')) {
                var $tr = $(this).parents('tr'),
                    id = $tr.attr('Id');

                Base.request({
                    url: 'material/doDel',
                    params: {
                        id: id,
                    },
                    callback: function(data) {
                        if(data.status) {
                            Base.gritter(data.message, false);
                        }else {
                            Base.gritter(data.message, true);
                            if($('.one-del-addSrc').length == 1) {
                                if(pageNo >= 2) {
                                    pageNo -= 1;
                                }
                            }
                            initSrc();
                        }
                    },
                });
            }
            if($(this).is('.mult-del')) {
                var ids = [];

                $('.singleCos').each(function() {
                    var $tr = $(this).parents('tr'),
                        id = $tr.attr('Id');

                    if($(this).is(':checked')) {
                        ids.push(id);
                    }
                });

                Base.request({
                    url: 'material/doDels',
                    params: {
                        ids: ids.toString(),
                    },
                    callback: function(data) {
                        if(data.status) {
                            var msg = data.message;
                            if(msg == '参数错误!') {
                                msg = '勾选要删除的素材';
                            }
                            Base.gritter(msg, false);
                        }else {
                            Base.gritter(data.message, true);
                            if($('.one-del-addSrc').length == ids.length) {
                                if(pageNo >= 2) {
                                    pageNo -= 1;
                                }
                            }
                            initSrc();
                        }
                    },
                });
            }
        });

        //全选
        $('body').on('ifChecked', '.multCos', function() {
            $('.singleCos').iCheck('check');
        });
        //全不选
        $('body').on('ifUnchecked', '.multCos', function() {
            $('.singleCos').iCheck('uncheck');
        });

        //搜索
        $('.searchAddSrc').on('click', function() {
            delPage = 1;
            pageNo = 1;
            name = $('.search-input-addSrc').val();
            initSrc();
        });
        $('.search-input-addSrc').on('click', function() {
            return false;
        });

        //ENTER
        $(document).on('keyup', function(e) {
            var $activeEl = $(document.activeElement);
            
            if($activeEl.is('.search-input-addSrc') && (e.keyCode==13||e.keyCode==108)) {
                $('.searchAddSrc').trigger('click');
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


var setting = {
	edit: {
		drag: {
			isCopy: false,
			isMove: false
		},
		enable: true,
		showRemoveBtn: false,
		showRenameBtn: setRenameBtn,
		renameTitle: '重命名'
	},
	data: {
		simpleData: {
			enable: true,
			idKey: "Id",
			pIdKey: "ParentId",
			rootPId: 0
		},
		key: {
			name: "Name"
		}
	},
	view: {
		selectedMulti: false,
		showIcon: false,
		addHoverDom: addHoverDom,
		removeHoverDom: removeHoverDom
	},
	async: {
		enable: true,
		url: "../../classes/pageListClasses?mode=9&pageSize=1000",
		autoParam: ["id"],
		dataFilter: ajaxDataFilter
	},
	callback: {
		//onDrag: zTreeOnDrag,
		onClick: function(e, treeId, treeNode) {
			var ZTree = $.fn.zTree.getZTreeObj("treeClasses"),
			Nodes = ZTree.getSelectedNodes();
			//有问题？？？
			if (Nodes.length == 0) {
				yunNotyError("请先选择一个节点");
			}
			groupId = Nodes[0].Id;
            $('.tabClick-addSrc').each(function(i) {
                if($(this).parent().is('.active')) {
                    var fileNumLimit = 1;
                    if(i == 0) {
                        fileNumLimit = 10;
                    }else {
                        fileNumLimit = 1;
                    }
                    resetUploader(i, fileNumLimit);
                }
            });

			if (treeNode) {
				initSrc();
			}
		},
		beforeClick: zTreeBeforeClick,
		beforeRemove: beforeRemove,
		beforeEditName: beforeRename
	}
};

function zTreeOnDrag(event, treeId, treeNodes) {
	$('#addClassForm input[class=dropClass]').val(treeNodes[0].Id);
	$('#addClassForm input[class=dropClassName]').val(treeNodes[0].Name);
};

//自定义树的操作按钮1
function addHoverDom(treeId, treeNode) {
	var Obj = $("#" + treeNode.tId + "_a");
	if ($("#addBtn_" + treeNode.Id).length > 0) return;
	if (treeNode.tId == "treeClasses_1") {
		var addStr = "<span id='addBtn_" + treeNode.Id + "' title='新增分类' class='button addIcon'></span>";
		Obj.append(addStr);
		var btnAdd = $("#addBtn_" + treeNode.Id);
		if (btnAdd) btnAdd.bind("click",
		function() {
			$('#addClassModal').modal('show');
			$('#addClassForm [name=parentId]').val(treeNode.Id);
		});
	}
	var addStr = "<span id='addBtn_" + treeNode.Id + "' title='新增分类' class='button addIcon'></span>";
	Obj.find('.edit').before(addStr);
	var btnAdd = $("#addBtn_" + treeNode.Id);
	if (btnAdd) btnAdd.bind("click",
	function() {
		$('#addClassModal').modal('show');
		$('#addClassForm [name=parentId]').val(treeNode.Id);
	});

	if (treeNode.isParent == false) {
		if ($("#delBtn_" + treeNode.Id).length > 0) return;
		var delStr = "<span id='delBtn_" + treeNode.Id + "' title='删除分类' class='button remove'></span>";
		Obj.find('.edit').after(delStr);
		var btnDel = $("#delBtn_" + treeNode.Id);
		if (btnDel) btnDel.bind("click",
		function() {
			$('#DelClassModal').modal('show');
			$('#DelClassModal [name=classId]').val(treeNode.tId);
		});
	}
}

//自定义树的操作按钮2
function removeHoverDom(treeId, treeNode) {
	$("#addBtn_" + treeNode.Id).unbind().remove();
	if (treeNode.isParent == false) {
		$("#diyBtn_" + treeNode.Id).unbind().remove();
		$("#delBtn_" + treeNode.Id).unbind().remove();
	}
	$("#outBtn_" + treeNode.Id).unbind().remove();
	$("#outflowBtn_" + treeNode.Id).unbind().remove();
}

// function beforeDrag(treeId, treeNodes) {
// 	return false;
// }

//如果节点下面有子节点则不显示删除按钮
function setRemoveBtn(treeId, treeNode) {
	//判断为顶级节点则不显示删除按钮
	return !treeNode.isParent;　　　
}

function setRenameBtn(treeId, treeNode) {
	if (treeNode.level == 0) {
		return false;
	}
	return true;
}

//重命名节点
function beforeRename(treeId, treeNode, newName, isCancel) {
	$('#editClassForm input[name=classhideName]').val(treeNode.Name);
	$('#editClassForm input[name=className]').val(treeNode.Name);
	$('#editClassForm input[name=id]').val(treeNode.Id);
	$('#editClassModal').modal('show');
	return false;
}

//删除节点
function beforeRemove(treeId, treeNode) {
	var flag = false;
	$.ajax({
		type: 'get',
		async: false,
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../classes/deleteClassesById?id=' + treeNode.Id),
		success: function(data) {
			if (data.status == 0) {
				flag = true;
				yunNoty(data);
			} else {
				yunNoty(data);

			}
		}
	});
	return flag;
}

function zTreeBeforeClick(treeId, treeNode, clickFlag) {
	//return !treeNode.isParent;//当是父节点 返回false 不让选取
	if (treeNode.isParent == true) {
		$('.branchSearch input[name=isLeaf]').val(0);
	} else {
		$('.branchSearch input[name=isLeaf]').val(1);
	}
}

//格式化一步获取的json数据
function ajaxDataFilter(treeId, parentNode, responseData) {
	if (responseData) {
		responseData.list.push({
			Id: 0,
			ParentId: 0,
			Name: "全部分类",
			open: true
		});
		return responseData.list;
	}
	return responseData;
}

//获取ztree的数据列表


$(document).ready(function() {
	$.fn.zTree.init($("#treeClasses"), setting, []);
});

//修改子分类回车
enterSubmit($('#editClassForm input[name=className]'),editClassify);

//确认清空问题
$('#confrimClearQue').click(function() {
	$.ajax({
		type: 'get',
		async: false,
		datatype: 'json',
		cache: false,
		//不从缓存中去数据
		url: encodeURI('../../Question/clearGroup?groupId=' + $('.gId').val()),
		success: function(data) {
			if (data.status == 0) {
				yunNoty(data);
				$('#clearModal').modal('hide');
			} else {
				yunNoty(data);
			}
		}
	});
});

//确认删除分类
$('#confrimdel').click(function() {
	var classId = $('#DelClassModal input[name=classId]').val();
	var treeObj = $.fn.zTree.getZTreeObj("treeClasses");
	var node = treeObj.getNodeByTId(classId);
	treeObj.removeNode(node, true);
	$('#DelClassModal').modal('hide');
});


var classsetting = {
	view: {
		dblClickExpand: false,
		showIcon: false
	},
	data: {
		simpleData: {
			enable: true,
			idKey: "Id",
			pIdKey: "ParentId",
			rootPId: 0
		},
		key: {
			name: "Name"
		}
	},
	async: {
		enable: true,
		url: "../../classes/pageListClasses?mode=9&pageSize=1000",
		autoParam: ["id"],
		dataFilter: ajaxDataFilter
	},
	callback: {
		onClick: ZTreeClassClick,
		beforeClick: zTreeBeforeClick,
		onAsyncSuccess: zTreeOnAsyncSuccess
	}
}

//格式化一步获取的json数据
function ajaxDataFilter(treeId, parentNode, responseData) {
	if (responseData) {
		if (responseData.status == -1) {
			yunNoty(responseData);
		}
		responseData.list.push({
			Id: 0,
			ParentId: 0,
			Name: "全部分类",
			open: true
		});
		return responseData.list;
	}
	return responseData;
}
function ZTreeClassClick(treeId, treeNode) {
	var zTree = $.fn.zTree.getZTreeObj('treeEditClass');
	Nodes = zTree.getSelectedNodes();
	$('#editClassModel [name=treeName]').val(Nodes[0].Name);
	$('#editClassModel [name=treeId]').val(Nodes[0].Id);
}
function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
	var treeObj = $.fn.zTree.getZTreeObj("treeEditClass");
	//treeObj.expandAll(true);
}
$.fn.zTree.init($("#treeEditClass"),classsetting,[]);
    };


    /*** viewSrc ***/
    var ViewSrc = function() {
        var This = this;
        var type = 1,//素材类型
            pageNo = 1,//当前页
            pageSize = 20,//每页数量
            name = '',//搜索内容
            isJpage = 0,//是否已实例化jpage
            delPage = 0,//是否删除jpage
            playerList = '';//播放菜单

        function initSrc() {
            playerList = '';//播放菜单

            $('.multCos').iCheck('uncheck');
            Base.request({
                url: 'material/list?name='+ name,
                params: {
                    type: type,
                    pageNo: pageNo,
                    pageSize: pageSize,
                },
                callback: function(data) {
                    if(data.status) {
                        Base.gritter(data.message, false);
                    }else {
                        var html ='';

                        if(data.list) {
                            if(data.list[0]) {
                                for(var i=0; i<data.list.length; i++) {
                                    switch(type) {
                                        case 1://图片
                                            html += '<div class="image gallery-group-1"><div class="imageCtn-viewSrc"><div class="image-inner"><a href="../../'+ data.list[i].Path +'" data-lightbox="gallery-group-1"><img src="../../'+ data.list[i].Path +'" alt="'+ data.list[i].Name +'" title="'+ data.list[i].Name +'"/></a></div><div class="image-info"><h5 class="title">'+ Base.addDots(data.list[i].Name, 10) +'</h5><a><i class="timetip one-del-addSrc glyphicon glyphicon-trash" title="删除" id="'+ data.list[i].Id +'"></i></a></div></div></div>';
                                            break;
                                        case 2://语音
                                            $('#jquery_jplayer_1').height(0);
                                            html += '<div class="image gallery-group-1"><div class="imageCtn-viewSrc"><div class="image-inner"><img src="images/a_video.png" alt="'+ data.list[i].Name +'" title="'+ data.list[i].Name +'" path="../../'+ data.list[i].Path +'" href="#modal-dialog" data-toggle="modal" index="'+ i +'"/></div><div class="image-info"><h5 class="title">'+ Base.addDots(data.list[i].Name, 10) +'</h5><a><i class="timetip one-del-addSrc glyphicon glyphicon-trash" title="删除" id="'+ data.list[i].Id +'"></i></a></div></div></div>';

                                            playerList += '{"title": "'+ data.list[i].Name +'", "m4v": "../../'+ data.list[i].Path +'"},';
                                            break;
                                        case 3://视频
                                            $('#jquery_jplayer_1').height(320);
                                            html += '<div class="image gallery-group-1"><div class="imageCtn-viewSrc"><div class="image-inner"><img src="images/a_video.png" alt="'+ data.list[i].Name +'" title="'+ data.list[i].Name +'" path="../../'+ data.list[i].Path +'" href="#modal-dialog" data-toggle="modal" index="'+ i +'"/></div><div class="image-info"><h5 class="title">'+ Base.addDots(data.list[i].Name, 10) +'</h5><a><i class="timetip one-del-addSrc glyphicon glyphicon-trash" title="删除" id="'+ data.list[i].Id +'"></i></a></div></div></div>';

                                            playerList += '{"title": "'+ data.list[i].Name +'", "m4v": "../../'+ data.list[i].Path +'"},';
                                            break;
                                        case 4://文档
                                        case 0://其他
                                            html += '<div class="image gallery-group-1"><div class="imageCtn-viewSrc"><div class="image-inner" title="'+ data.list[i].Name +'"> 该文件无法预览</div><div class="image-info"><h5 class="title">'+ Base.addDots(data.list[i].Name, 10) +'</h5><a><i class="timetip one-del-addSrc glyphicon glyphicon-trash" title="删除" id="'+ data.list[i].Id +'"></i></a></div></div></div>';
                                            break;
                                    }
                                }

                                $('.gallery-viewSrc').empty().append('<div class="gallery">'+ html +'</div>');
                                /*$('.gallery').isotope({
                                    itemSelector: '.gallery-group-1',
                                });*/

                                playerList = JSON.parse('['+ playerList.substring(0, playerList.length-1) +']')
                                myPlaylist.setPlaylist(playerList);

                                var options = {
                                    data: [data, 'list', 'total'],
                                    currentPage: data.currentPage,
                                    totalPages: data.totlePages ? data.totlePages : 1,
                                    alignment: 'right',
                                    onPageClicked: function(event, originalEvent, type, page) {
                                        pageNo = page;
                                        initSrc();
                                    }
                                };
                                $('#itemContainer').bootstrapPaginator(options);
                            }else {
                                html += '<div colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</div>';
                                $('.gallery-viewSrc').empty().append('<div class="gallery">'+ html +'</div>');
                                $('#itemContainer').empty();
                            }
                        }
                        $('.timeTip').tooltip();
                    }
                },
            });
        }
        initSrc();

        var myPlaylist = new jPlayerPlaylist({
            jPlayer: "#jquery_jplayer_1",
            cssSelectorAncestor: "#jp_container_1",
            }, [
            ], {
            supplied: "webmv, ogv, m4v, oga, mp3",
            useStateClassSkin: true,
            autoBlur: false,
            smoothPlayBar: true,
            keyEnabled: true,
            audioFullScreen: true,
            size: {
                width: "640px",
                height: "360px",
                cssClass: "jp-video-360p",
            },
        });

        //为视频设置来源
        $('body').on('click', '.image-inner img', function() {
            var $this = $(this);

            myPlaylist.select(parseInt($this.attr('index')));
        });

        //停止视频
        $('#modal-dialog').on('hidden.bs.modal', function (e) {
            $("#jquery_jplayer_1").jPlayer('stop');
        });

        //切换素材类型
        $('.tabClick-addSrc').each(function(i) {
            $(this).on('click', function() {
                type = i+1;
                if(i == 4) {
                    type = 0;
                }
                pageNo = 1;
                isJpage = 0;
                name = '';
                initSrc();
            });
        });

        //删除
        $('body').on('click', '.one-del-addSrc', function() {
            delPage = 1;

            var id = $(this).attr('Id');

            Base.request({
                url: 'material/doDel',
                params: {
                    id: id,
                },
                callback: function(data) {
                    if(data.status) {
                        Base.gritter(data.message, false);
                    }else {
                       Base.gritter(data.message, true);
                       if($('.one-del-addSrc').length == 1) {
                           if(pageNo >= 2) {
                               pageNo -= 1;
                           }
                       }
                       initSrc(); 
                    }
                },
            });
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
    };

    /*** menuList ***/
    var MenuList = function() {
        var This = this;
        var type = 1,//素材类型
            pageNo = 1,//当前页
            pageSize = 20,//每页数量
            name = '',//搜索内容
            isJpage = 0,//是否已实例化jpage
            delPage = 0,//是否删除jpage
            playerList = '';//播放菜单

        function initSrc() {
            playerList = '';//播放菜单

            $('.multCos').iCheck('uncheck');
            Base.request({
                url: 'Wxappmsg/list?name='+ name,
                params: {
                    type: type,
                    pageNo: pageNo,
                    pageSize: pageSize,
                },
                callback: function(data) {
                    if(data.status) {
                        Base.gritter(data.message, false);
                    }else {

                        if(data.result.list[0]) {
                            $('.srcLeft').empty().show();
                            $('.srcMid').empty().show();
                            $('.srcRight').empty().show();
                            $('.srcEmpty').hide();

                            for(var i=0; i<data.result.list.length; i++) {
                                var html ='',
                                    htmlOther = '';

                                for(var j=0; j<data.result.list[i].wxappmsgDetails.length; j++) {
                                    if(j) {//>0
                                        htmlOther += '<div><div class="innerSrcCtn"><p class="innerTitle" title="'+ (data.result.list[i].wxappmsgDetails[j].title || '') +'">'+ Base.addDots((data.result.list[i].wxappmsgDetails[j].title || ''), 14) +'</p><img class="innerImg" src="'+ (data.result.list[i].wxappmsgDetails[j].imgUrl || '') +'"></div>';
                                    }
                                }
                                
                                html = '<div class="imgSrcCtn" id="'+ data.result.list[i].id +'" style="width: auto;"><div class="outerSrcCtn"><p class="outerTitle" title="'+ (data.result.list[i].wxappmsgDetails[0].title || '') +'">'+ (data.result.list[i].wxappmsgDetails[0].title || '') +'</p><img class="outerImg" src="'+ (data.result.list[i].wxappmsgDetails[0].imgUrl || '') +'"></div>'+ htmlOther +'<div style="position: absolute; left: 0; bottom: 0; width: 100%; height: 61px; background: #F5F5F5;"></div><p class="timeStr">'+ data.result.list[i].timeStr +'</p><a class="srcEditCtn"><i class="editPic glyphicon glyphicon-pencil col-md-6" title="编辑" style="cursor: pointer; width: 50%;"></i><i class="one-del-pic glyphicon glyphicon-trash col-md-6" title="删除" style="cursor: pointer;"></i></a></div>';

                                switch(i%3) {
                                    case 0:
                                        $('.srcLeft').append(html);
                                        break;
                                    case 1:
                                        $('.srcMid').append(html);
                                        break;
                                    case 2:
                                        $('.srcRight').append(html);
                                        break;
                                }
                            }

                            var options = {
                                data: [data, 'list', 'total'],
                                currentPage: data.currentPage,
                                totalPages: data.totlePages ? data.totlePages : 1,
                                alignment: 'right',
                                onPageClicked: function(event, originalEvent, type, page) {
                                    pageNo = page;
                                    initSrc();
                                }
                            };
                            $('#itemContainer').bootstrapPaginator(options);
                        }else {
                            $('.srcLeft').hide();
                            $('.srcRight').hide();
                            $('.srcEmpty').show();

                            $('#itemContainer').empty();
                        }

                        
                    }
                },
            });
        }
        initSrc();

        //编辑
        $('body').on('click', '.editPic', function() {
            var $document = $(window.parent.document),
                $this = null;
            $('.childLink', $document).each(function() {
                if($(this).attr('href') == '#material/imgTexts') {
                    $this = $(this);
                }
            });

            $('li', $document).removeClass('active');
            if($this) {
                $this.parents('li').addClass('active');
            }
                        
            var $imgSrcCtn = $(this).parents('.imgSrcCtn'),
                id = $imgSrcCtn.attr('Id');

            document.location.href = 'imgTexts.html?id='+ id;
        });

        //删除
        $('body').on('click', '.one-del-pic', function() {
            var $imgSrcCtn = $(this).parents('.imgSrcCtn'),
                id = $imgSrcCtn.attr('Id');

            Base.request({
                url: 'Wxappmsg/delWxappmsg',
                params: {
                    id: id,
                },
                callback: function(data) {
                    if(data.status) {
                        Base.gritter(data.message, false);
                    }else {
                        Base.gritter(data.message, true);
                        if($('.one-del-pic').length == 1) {
                            if(pageNo >= 2) {
                                pageNo -= 1;
                            }
                        }
                        initSrc();
                    }
                },
            });
        });

        //添加新图文
        $('.newPic').on('click', function() {
            var $document = $(window.parent.document),
                $this = null;
            $('.childLink', $document).each(function() {
                if($(this).attr('href') == '#material/imgTexts') {
                    $this = $(this);
                }
            });

            $('li', $document).removeClass('active');
            if($this) {
                $this.parents('li').addClass('active');
            }
            document.location.href = 'imgTexts.html';
        });
    };

    /*** 初始化对应的页面 ***/
    var href = this.location.href,
        page = href.match(/\/([a-zA-Z]+)(_[a-zA-Z\d]*)*\.html/)[1];
    page = page.replace(/[a-zA-Z]/, page.substr(0, 1).toUpperCase());
    eval(page +'()');
});