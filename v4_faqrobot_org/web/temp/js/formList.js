
;$(function() {
    var This = this;
    var type = 1,//素材类型
        pageNo = 1,//当前页
        pageSize = 10,//每页数量
        queryStr = '',//搜索内容
        orderType = 4,
        idStr = '',//是否传id
        isJpage = 0,//是否已实例化jpage
        delPage = 0,//是否删除jpage
        isAdd = 1,//添加还是修改
        id = 0;//
	var dataList = [];

	$('#modal-dialog').on('hide.bs.modal', function() {
		isAdd = 1;
        formo.resetForm();
	});
    //添加
    formo = $('.form-synonym').validate({
        rules:{
            name:{
                required: true,
            },
            info:{
                required: true,
            },
            targetUrl:{
                required: true,
            },
            intentType:{
                required: true,
            },
            className:{
                required: true,
            },
            classMethod:{
                required: true,
            },
            endMessage:{
                required: true,
            },
        },
        messages:{
            name:{
                required: '请输入表单名称',
            },
            info:{
                required: '请输入接口的简介',
            },
            targetUrl:{
                required: '请输入url提交地址',
            },
            intentType:{
                required: '请输入意图类型',
            },
            className:{
                required: '请输入处理数据的类的名称',
            },
            classMethod:{
                required: '请输入处理类的方法',
            },
            endMessage:{
                required: '请输入结束语',
            },
        },
        submitHandler: function(){
	    if($('input[name=saveType]:checked').val()==5){
	        $('#formList input[name=intentType]').val($('#formList input[name=keyWords]').val());
	    }
            if(isAdd) {//添加
                Base.request({
                    url:'StepForm/doSave',
                    params: {
                    },
                    $formObj: $('#formList'),
                    callback: function(data) {
                        if(data.status) {
                            Base.gritter(data.message, false);
                        }else {
                            Base.gritter(data.message, true);

                            $('#modal-dialog').modal('hide');
                            initSrc();
                        }
                    },
                });
            }else {//修改
                Base.request({
                    url: 'StepForm/doModify',
                    params: {
                        id: id,
                    },
                    $formObj: $('#formList'),
                    callback: function(data) {
                        if(data.status) {
                            Base.gritter(data.message, false);
                        }else {
                            Base.gritter(data.message, true);

                            $('#modal-dialog').modal('hide');
                            initSrc();
                        }
                    },
                });
            }
        },
    });

    //确认添加同义词
    $('.ensure-synonym').on('click', function() {
        $('.form-synonym').submit();
    });

    //ENTER
    $(document).on('keyup', function(e) {
        var $activeEl = $(document.activeElement);

        if(($activeEl.is('.input1-synonym')||$activeEl.is('.input2-synonym')) && (e.keyCode==13||e.keyCode==108)) {
            $('.form-synonym').submit();
        }
    });

    //选择保存方式
    $('input[name=saveType]:eq(0)').on('click', function() {
        $('.cosType1').show();
        $('.cosType2').hide();
        $('.cosType3').hide();
    });
    $('input[name=saveType]:eq(1)').on('click', function() {
        $('.cosType1').hide();
        $('.cosType2').show();
        $('.cosType3').hide();
        $('.b').hide();
        $('.g').hide();
    });
    $('input[name=saveType]:eq(2)').on('click', function() {
        $('.cosType1').hide();
        $('.cosType2').show();
        $('.cosType3').hide();
        $('.b').show();
        $('.g').hide();
    });
    $('input[name=saveType]:eq(3)').on('click', function() {
        $('.cosType1').hide();
        $('.cosType2').show();
        $('.cosType3').hide();
        $('.b').hide();
        $('.g').show();
    });
    $('input[name=saveType]:eq(4)').on('click', function() {
        $('.cosType1').hide();
        $('.cosType2').hide();
        $('.cosType3').show();
    });

    function initSrc() {
      $('#ttt').tableAjaxLoader2(7);
        Base.request({
            url: 'StepForm/list',
            params: {
                orderType: orderType,
                pageNo: pageNo,
                pageSize: pageSize,
            },
            callback: function(data) {
                if(data.status) {
                    Base.gritter(data.message, false);
                }else {
                    var html ='';
                    if(data.List[0]) {
						dataList = data.List;
                        for(var i=0; i<data.List.length; i++) {
                            var ShowConfirm = '';//是否需要表单确认
                            switch(data.List[i].ShowConfirm) {
                                case 0:
                                    ShowConfirm = '不确认';
                                    break;
                                case 1:
                                    ShowConfirm = '确认';
                                    break;
                                case 2:
                                    ShowConfirm = '展示确认';
                                    break;
                            }

                            var SaveType = '';//保存方式
                            var Method = '';//url请求方式 / 处理类的方法
                            switch(data.List[i].SaveType) {
                                case 0:
                                    SaveType = '<span style="color: #6D63FB;">url直接提交</span>';
                                    switch(data.List[i].SubmitMethod) {
                                        case 0:
                                            Method = 'get';
                                            break;
                                        case 1:
                                            Method = 'post';
                                            break;
                                    }
                                    break;
                                case 1:
                                    SaveType = '<span style="color: #FB6789;">用java类处理</span>';
                                    Method = data.List[i].ClassMethod;
                                    break;
                            }
                             html += '<tr><td>'+ (data.List[i].Name || '') +'</td><td>'+ ShowConfirm +'</td><td>'+ (data.List[i].Info || '') +'</td><td style="white-space: nowrap;">'+ (data.List[i].AddTime || '') +'</td><td style="white-space: nowrap;"><a href="formChildren.html?formId='+ (data.List[i].Id || '') +'"><i class="timeTip formChildren glyphicon glyphicon-folder-close" title="查看表单项"></i></a><a href="checkData.html?formId='+ (data.List[i].Id || '') +'"><i class="timeTip checkData glyphicon glyphicon-folder-open" title="查看数据结果"></i></a><a><i class="timeTip edit glyphicon glyphicon-pencil" title="编辑"></i><i class="timeTip del glyphicon glyphicon-trash" title="删除"></i></a></td></tr>';
                            
                        }

                        var options = {
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
                    $('#ttt tbody').empty().append(html);
                    $('.timeTip').tooltip();


                }
            },
        });
    }
    initSrc();



    //修改
    $('body').on('click', '.edit', function() {
        isAdd = 0;
        var $tr = $(this).parents('tr');
        i = $tr.index();
        id = dataList[i].Id;
        $('.modal-header h4').html('修改场景式问答表单');
	$().html();
        $('[name=name]').val(dataList[i].Name);
	$('[name=keyWords]').val(dataList[i].IntentType);
        $('[name=showConfirm]').eq(dataList[i].ShowConfirm).attr({'checked': 'checked'});
        $('[name=info]').val(dataList[i].Info);
        $('[name=saveType][value="'+ dataList[i].SaveType +'"]').attr({'checked': 'checked'}).trigger('click');
        $('[name=targetUrl]').val(dataList[i].TargetUrl);
        $('[name=submitMethod]').eq(dataList[i].SubmitMethod).attr({'checked': 'checked'});
        $('[name=intentType]').val(dataList[i].IntentType);
        $('[name=modelId]').val(dataList[i].ModelId);
        $('[name=className]').val(dataList[i].ClassName);
        $('[name=classMethod]').val(dataList[i].ClassMethod);
        $('[name=endMessage]').val(dataList[i].EndMessage);
        $('#modal-dialog').modal('show');
    });

    //重置表单
    $('#modal-dialog').on('hidden.bs.modal', function () {
        $('form')[0].reset();
        $('.modal-header h4').html('添加场景式问答表单');
    })

    //删除
    $('body').on('click', '.del', function() {
      $(this).adcCreator(somedel);
    });
    function somedel(obj) {
        var $tr = $(obj).parents('tr'),
            id = dataList[$tr.index()].Id;

        Base.request({
            url: 'StepForm/doDelById',
            params: {
                id: id,
                ids: id,
            },
            callback: function(data) {
                if(data.status) {
                    Base.gritter(data.message, false);
                }else {
                    Base.gritter(data.message, true);

                    if($('.del').length == 1) {
                        if(pageNo >= 2) {
                            pageNo -= 1;
                        }
                    }
                    initSrc();
                }
            },
        });
    }

    //搜索
    $('.search-addSrc').on('click', function() {
        delPage = 1;
        pageNo = 1;
        queryStr = $('.search-input-addSrc').val();
        isJpage = 0;
        initSrc();
    });
    $('.search-input-addSrc').on('click', function() {
        return false;
    });
});
