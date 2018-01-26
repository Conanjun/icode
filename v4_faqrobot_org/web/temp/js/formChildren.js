
;$(function() {
    var This = this;
    var type = 1,//素材类型
        pageNo = 1,//当前页
        pageSize = 10,//每页数量
        queryStr = '',//搜索内容
        orderType = 25,
        idStr = '',//是否传id
        isJpage = 0,//是否已实例化jpage
        delPage = 0,//是否删除jpage
        isAdd = 1,//添加还是修改
        id = 0;//

    //获取id
    var formId = This.location.href.match(/\?formId=(.+)/);

    if(formId) {
        formId = formId[1];
        $('[name=formId]').val(formId);
    }
    //添加
    $('.form-synonym').validate({
        rules:{
            question:{
                required: true,
            },
            defaultValue:{
                required: true,
            },
            parameterName:{
                required: true,
            },
            parameterValue:{
                required: true,
            },
            validateErrorMsg:{
                required: true,
            },
            orderId:{
                required: true,
                number: true,
            },
        },
        messages:{
            question:{
                required: '请输入问题',
            },
            defaultValue:{
                required: '请输入默认值',
            },
            parameterName:{
                required: '请输入参数名',
            },
            parameterValue:{
                required: '请输入参数展示名称',
            },
            validateErrorMsg:{
                required: '请输入验证失败的话语说明',
            },
            orderId:{
                required: '请输入排序的ID代号',
                number: '请输入数字',
            },
        },
        submitHandler: function() {
            if(isAdd) {//添加
                Base.request({
                    url: 'StepFormItem/doSave',
                    params: {
                    },
                    $formObj: $('#formList'),
                    callback: function(data) {
                        if(data.status) {
                            Base.gritter(data.message, false);
                        }else {
                            isAdd = 1;
                            Base.gritter(data.message, true);

                            $('#modal-dialog').modal('hide');
                            initSrc();
                        }
                    },
                });
            }else {//修改
                Base.request({
                    url: 'StepFormItem/doModify',
                    params: {
                        id: id,
                    },
                    $formObj: $('#formList'),
                    callback: function(data) {
                        if(data.status) {
                            Base.gritter(data.message, false);
                        }else {
                            isAdd = 1;
                            Base.gritter(data.message, true);

                            $('#modal-dialog').modal('hide');
                            initSrc();
                        }
                    },
                });
            }
        },
    });

    // 获取逻辑代码
    Base.request({
        url: 'StepFormItem/findAllPartCode',
        params: {
        },
        callback: function(data) {
            if(data.status) {
                Base.gritter(data.message, false);
            }else {
                var html = '<option value=""></option>';
                for(var i=0; i<data.list.length; i++) {
                    html += '<option value="'+ data.list[i]+'">'+ data.list[i] +'</option>';
                }
                $('[name=partCode]').append(html);
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
    $('input[name=saveType]:first').on('click', function() {
        $('.cosType1').show();
        $('.cosType2').hide();
    });
    $('input[name=saveType]:last').on('click', function() {
        $('.cosType1').hide();
        $('.cosType2').show();
    });

    function initSrc() {
      $('#qqqtable').tableAjaxLoader2(11);
        Base.request({
            url: 'StepFormItem/findByFormId',
            params: {
                orderType: orderType,
                pageNo: pageNo,
                pageSize: pageSize,
                formId: formId,
            },
            callback: function(data) {
                if(data.status) {
                    Base.gritter(data.message, false);
                }else {
                    var html ='';
                    if(data.StepFormItems[0]) {
                        for(var i=0; i<data.StepFormItems.length; i++) {
                            var ValidateType = '';//验证方式
                            switch(data.StepFormItems[i].ValidateType) {
                                case 0:
                                    ValidateType = '缺省';
                                    break;
                                case 1:
                                    ValidateType = '字符串';
                                    break;
                                case 2:
                                    ValidateType = '数字';
                                    break;
                                case 3:
                                    ValidateType = '日期';
                                    break;
                                case 4:
                                    ValidateType = '整数';
                                    break;
                                case 5:
                                    ValidateType = '货币';
                                    break;
                                case 6:
                                    ValidateType = '度量单位';
                                    break;
                                case 7:
                                    ValidateType = '时间';
                                    break;
                                case 21:
                                    ValidateType = '手机';
                                    break;
                                case 22:
                                    ValidateType = '电话';
                                    break;
                                case 23:
                                    ValidateType = '省份';
                                    break;
                                case 24:
                                    ValidateType = '城市';
                                    break;
                                case 25:
                                    ValidateType = '城市';
                                    break;
                                case 26:
                                    ValidateType = '电子邮件';
                                    break;
                                case 51:
                                    ValidateType = 'url';
                                    break;
                                case 52:
                                    ValidateType = '信用卡号';
                                    break;
                                case 53:
                                    ValidateType = 'IP';
                                    break;
                            }

                            //是否必须
                            var MustType = '';
                            switch(data.StepFormItems[i].MustType) {
                                case 0:
                                    MustType = '必须';
                                    break;
                                case 1:
                                    MustType = '非必须';
                                    break;
                            }

                            html += '<tr Id="'+ (data.StepFormItems[i].Id || '') +'" Question="'+ (data.StepFormItems[i].Question || '') +'" DefaultValue="'+ (data.StepFormItems[i].DefaultValue || '') +'" ValidateType="'+ (data.StepFormItems[i].ValidateType || '') +'" MustType="'+ (data.StepFormItems[i].MustType) +'" ParameterName="'+ (data.StepFormItems[i].ParameterName || '') +'" ParameterValue="'+ (data.StepFormItems[i].ParameterValue || '') +'" ValidateErrorMsg="'+ (data.StepFormItems[i].ValidateErrorMsg || '') +'" OrderId="'+ (data.StepFormItems[i].OrderId || '') +'" PartCode="'+ (data.StepFormItems[i].PartCode || '') +'" Answers="'+ (data.StepFormItems[i].Answers || '') +'"><td>'+ (data.StepFormItems[i].Question || '') +'</td><td>'+ (data.StepFormItems[i].DefaultValue || '') +'</td><td>'+ ValidateType +'</td><td>'+ MustType +'</td><td>'+ (data.StepFormItems[i].ParameterName || '') +'</td><td>'+ (data.StepFormItems[i].ParameterValue || '') +'</td><td>'+ (data.StepFormItems[i].ValidateErrorMsg || '') +'</td><td>'+ (data.StepFormItems[i].OrderId || '') +'</td><td>'+ (data.StepFormItems[i].Answers || '') +'</td><td style="white-space: nowrap;">'+ (data.StepFormItems[i].AddTime || '') +'</td><td style="white-space: nowrap;"><a><i class="timeTip edit glyphicon glyphicon-pencil" title="编辑"></i><i class="timeTip del glyphicon glyphicon-trash" title="删除"></i></a></td></tr>';
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
                        html += '<tr><td colspan="11" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
                        $('#itemContainer').empty();
                    }
                    $('tbody').empty().append(html);
                    $('.timeTip').tooltip();


                }
            },
        });
    }
    initSrc();

    $('[name="validateType"]').on('change', function() {
        $('option', this).each(function() {
            if(!$(this).prop('selected')) {
                $(this).removeAttr('selected');
            }
        });
    });

    //修改
    $('body').on('click', '.edit', function() {
        isAdd = 0;
        var $tr = $(this).parents('tr');
        id = $tr.attr('Id');
        $('.modal-header h4').html('修改场景式问答表单项');
        $('[name=question]').val($tr.attr('question'));
        $('[name=defaultValue]').val($tr.attr('defaultValue'));
        $('[name=validateType] option').each(function() {
            if($(this).val() == $tr.attr('validateType')) {
                $(this).attr({'selected': 'selected'});
            }
        });
        if(parseInt($tr.attr('mustType')) === 0){
          $('[name=mustType]').eq(1).attr({'checked': 'checked'});
        } else {
          $('[name=mustType]').eq(0).attr({'checked': 'checked'});
        }
        $('[name=parameterName]').val($tr.attr('parameterName')).attr({'readonly': 'readonly'});
        $('[name=parameterValue]').val($tr.attr('parameterValue'));
        $('[name=validateErrorMsg]').val($tr.attr('validateErrorMsg'));
        $('[name=classMethod]').val($tr.attr('classMethod'));
        $('[name=orderId]').val($tr.attr('orderId'));
        $('[name=partCode]').val($tr.attr('partCode'));
        if($('[name=partCode]').val() != $tr.attr('partCode')){
          $('[name=partCode]').append('<option value="'+$tr.attr('partCode')+'"></option>');
          $('[name=partCode]').val($tr.attr('partCode'));
        }
        $('[name=answers]').val($tr.attr('answers'));

        $('#modal-dialog').modal('show');
    });

    //重置表单
    $('#modal-dialog').on('hidden.bs.modal', function () {
        $('form')[0].reset();
        $('.modal-header h4').html('添加场景式问答表单项');
        $('[name=validateType] option').each(function() {
            $(this).removeAttr('selected');
        });
        $('[name=mustType]').each(function() {
            $(this).removeAttr('checked');
        });
        $('[name=mustType]:first').attr({'checked': 'checked'});
        $('[name=parameterName]').removeAttr('readonly');
    })

    //删除
    $('body').on('click', '.del', function() {
        var $tr = $(this).parents('tr'),
            id = $tr.attr('Id');

        Base.request({
            url: 'StepFormItem/delById',
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
});
