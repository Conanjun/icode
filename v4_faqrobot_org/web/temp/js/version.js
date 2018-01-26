;$(function() {
    var This = this;
    var type = 1,//素材类型
        pageNo = 1,//当前页
        pageSize = 10,//每页数量
        queryStr = '',//搜索内容
        mode = 1,
        idStr = '',//是否传id
        isJpage = 0,//是否已实例化jpage
        delPage = 0;//是否删除jpage

    var edit = false;

    Base.request({
        url: 'Configuration/listAllValue',
        params: {
            dicType: 'source_type'
        },
        callback: function(data) {
            if(data.status) {
                Base.gritter(data.message, false);
            }else {
                window.data = data;
                if(data.listValue) {
                    if(data.listValue[0]) {
                        var html = '';
                        for(var i=0; i<data.listValue.length; i++) {
                            html += '<option value="'+ data.listValue[i].DicCode +'">'+ data.listValue[i].DicDesc +'</option>';
                        }
                        $('[name=type]').append(html);
                        initSrc();
                    }
                }
            }
        },
    });

    //添加
    $('.form-synonym').validate({
        rules:{
            pName:{
                required: true,
            },
            environment:{
                required: true,
            },
            project:{
                required: true,
            },
            funPoint:{
                required: true,
            },
        },
        messages:{
            pName:{
                required: '请输入名称',
            },
            environment:{
                required: '请输入环境',
            },
            project:{
                required: '请输入所属项目',
            },
            funPoint:{
                required: '请输入功能点描述',
            },
        },
        submitHandler: function() {
            if(edit) {// 修改
                var fileData = [];
                for(var i=0,len = $('[name=file]')[0].files.length; i<len; i++) {// IE9-不支持files
                    fileData[i] = $('[name=file]')[0].files[i];
                }

                Base.uploadFile({
                    url: '../../validationVersion/updateVersion',
                    data: {
                        id: id,
                        pName: $('[name=pName]').val() || '',
                        environment: $('[name=environment]').val() || '',
                        project: $('[name=project]').val() || '',
                        funPoint: $('[name=funPoint]').val() || '',
                        type: $('[name=type]').val() || '',
                        category: $('[name=category]').val() || '',
                        file: fileData,
                    },
                    load: function(data) {
                        if(data.status) {
                            Base.gritter(data.message, false);
                        }else {
                            Base.gritter(data.message, true);
                            $('#modal-dialog').modal('hide');
                            $('.form-synonym')[0].reset();
                            $('[name=file]')[0].files = null;
                            initSrc();
                        }
                    }
                });
            }else {// 新增
                var fileData = [];
                for(var i=0,len = $('[name=file]')[0].files.length; i<len; i++) {// IE9-不支持files
                    fileData[i] = $('[name=file]')[0].files[i];
                }

                Base.uploadFile({
                    url: '../../validationVersion/createVersion',
                    data: {
                        pName: $('[name=pName]').val() || '',
                        environment: $('[name=environment]').val() || '',
                        project: $('[name=project]').val() || '',
                        funPoint: $('[name=funPoint]').val() || '',
                        type: $('[name=type]').val() || '',
                        category: $('[name=category]').val() || '',
                        file: fileData,
                    },
                    load: function(data) {
                        if(data.status) {
                            Base.gritter(data.message, false);
                        }else {
                            Base.gritter(data.message, true);
                            $('#modal-dialog').modal('hide');
                            $('.form-synonym')[0].reset();
                            $('[name=file]')[0].files = null;
                            initSrc();
                        }
                    }
                });
            }
        },
    });

    function initSrc() {
  	    $('#ttz').tableAjaxLoader2(9);
        Base.request({
            url: 'validationVersion/findAll',
            params: {
                pageNo: pageNo,
                pageSize: pageSize,
                pName: $('.search-input-addSrc').val() || '',
            },
            callback: function(data) {
                if(data.status) {
                    Base.gritter(data.message, false);
                }else {
                    var html ='';
                    if(data.list[0]) {
                        for(var i=0; i<data.list.length; i++) {
                            var type = '';
                            if(window.data.listValue) {
                                if(window.data.listValue[0]) {
                                    for(var j=0; j<window.data.listValue.length; j++) {
                                        if(data.list[i].Type == window.data.listValue[j].DicCode) {
                                            type = window.data.listValue[j].DicDesc
                                        }

                                    }
                                }
                            }
                            html += '<tr Id="'+ (data.list[i].Id || '') +'"><td>'+ (data.list[i].VersionNumber || '') +'</td><td>'+ (data.list[i].ProjectName || '') +'</td><td>'+ (type || '') +'</td><td>'+ (data.list[i].Environment || '') +'</td><td>'+ (data.list[i].Project || '') +'</td><td>'+ (data.list[i].FunctionPoint || '') +'</td><td>'+ (data.list[i].Time || '') +'</td><td>'+ (data.list[i].CreateUser || '') +'</td><td><a><i class="timeTip edit-synonym glyphicon glyphicon-pencil" title="编辑"></i><i class="timeTip del-synonym glyphicon glyphicon-trash" title="删除"></i></a></td></tr>';
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
                    $('tbody').empty().append(html);
                    $('.timeTip').tooltip();
                    icheckInit();


                }
            },
        });
    }

    $('#modal-dialog').on('hidden.bs.modal', function (e) {
        edit = false;
        $('[name=pName]').val('')
        $('[name=environment]').val('')
        $('[name=project]').val('')
        $('[name=funPoint]').val('')
        $('[name=type]').val(0)
        $('[name=category]').val(1)
        $('[name=file]').next('a').remove();
    });

    //确认添加停止词
    $('.ensure-synonym').on('click', function() {
        $('.form-synonym').submit();
    });

    //修改
    $('body').on('click', '.edit-synonym', function() {
        var $tr = $(this).parents('tr');
        id = $tr.attr('Id');

        edit = true;

        Base.request({
            url: 'validationVersion/findById',
            params: {
                id: id,
            },
            callback: function(data) {
                if(data.status) {
                    Base.gritter(data.message, false);
                }else {
                    if(data.version) {
                        $('#modal-dialog').modal('show');
                        $('[name=pName]').val(data.version.ProjectName || '')
                        $('[name=environment]').val(data.version.Environment || '')
                        $('[name=project]').val(data.version.Project || '')
                        $('[name=funPoint]').val(data.version.FunctionPoint || '')
                        $('[name=type]').val(data.version.Type || '')
                        $('[name=category]').val(data.version.Category || '')
                        if(data.version.FileUrl) {
                            $('[name=file]').after('<a href="/'+ data.version.FileUrl +'">查看已有附件</a>');
                        }
                    }
                }
            },
        });
    });

    //删除
    $('body').on('click', '.del-synonym', function() {
        var $tr = $(this).parents('tr'),
            id = $tr.attr('Id');

        Base.request({
            url: 'validationVersion/deleteVersion',
            params: {
                id: id,
            },
            callback: function(data) {
                if(data.status) {
                    Base.gritter(data.message, false);
                }else {
                    Base.gritter(data.message, true);

                    if($('.del-synonym').length == 1) {
                        if(pageNo >= 2) {
                            pageNo -= 1;
                        }
                    }
                    initSrc();
                }
            },
        });
    });

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

    //ENTER
    $(document).on('keyup', function(e) {
        var $activeEl = $(document.activeElement);

        if($activeEl.is('.search-input-addSrc') && (e.keyCode==13||e.keyCode==108)) {
            $('.search-addSrc').trigger('click');
        }
    });
});
