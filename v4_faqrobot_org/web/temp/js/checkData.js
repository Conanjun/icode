
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
        id = 0,//
        startTime = '',
        endTime = '';

    //获取id
    var formId = This.location.href.match(/\?formId=(\d+)/);

    if(formId) {
        formId = formId[1];
        $('[name=formId').val(formId);
    }

    //datetimepicker配置项
    $(".form_datetime").datetimepicker({
        language: "zh-CN",
        format: "yyyy-mm-dd hh:ii",
        autoclose: true,
        todayBtn: true,
        minuteStep: 10,
        initialDate: new Date(),
        zIndex: 1500,
    });

    //ENTER
    $(document).on('keyup', function(e) {
        var $activeEl = $(document.activeElement);

        if(($activeEl.is('.input1-synonym')||$activeEl.is('.input2-synonym')) && (e.keyCode==13||e.keyCode==108)) {
            $('.form-synonym').submit();
        }
    });

    //下拉菜单
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
                    for(var i=0; i<data.List.length; i++) {
                        html += '<li><a class="sortQue" href="#" Id="'+ data.List[i].Id +'">'+ data.List[i].Name +'</a></li>';
                    }
                }else {
                }
                $('.dropdownList').empty().append(html);


            }
        },
    });

    function initSrc() {
        $('#mytable').tableAjaxLoader2(7);
        Base.request({
            url: 'StepFormResult/listResult',
            params: {
                pageSize: pageSize,
                pageNo: pageNo,
                orderType: 2,
                formId: formId,
                startTime: startTime,
                endTime: endTime,
            },
            callback: function(data) {
                if(data.status) {
                    Base.gritter(data.message, false);
                }else {
                    var head = '';
                    var html = '';
                    var arr = [];
                    if(data.List[0]) {
                        for(var i=0; i<data.List.length; i++) {
                            if(!i) {//0
                                for(var key in data.List[i]) {
                                    if(key=='addTime'){
									}else{
										head += '<th key="'+ key +'">'+ data.List[i][key] +'</th>';
									}
                                }
								head += '<th key="addTime">'+ data.List[i].addTime +'</th>';
                                head = '<tr>'+ head +'<th style="white-space: nowrap; width: 80px;">操作</th></tr>';
                                $('#mytable thead').empty().append(head);
                            }else {
                                var tr = '';
                                for(var key0 in data.List[0]) {
                                    var td = '';
                                    var index = 0;
                                    var isHas = [];
                                    for(var m=0; m<data.List[0].length; m++) {
                                        isHas[m] = 0;
                                    }
                                    for(var key2 in data.List[i]) {
                                        if(key2 == key0) {
										    if(key2=='addTime'){}else{
												td = '<td>'+ data.List[i][key2] +'</td>';
											}
                                            isHas[index] = 1;
                                        }else {
                                            isHas[index] = 0;
                                        }
                                        index++;
                                    }
                                    if(!(isHas.join('').indexOf('1')+1)) {//[0 0 0 0 0]
                                        td = '<td></td>';
                                    }
									
                                    tr += td;
                                }
                                tr = '<tr id="'+ (data.List[i].id || '') +'">'+ tr +'<td>'+ data.List[i]['addTime'] +'</td><td style="white-space: nowrap;"><a><span class="del timeTip glyphicon glyphicon-trash" title="删除问题"></span></a></td></tr>';
                                html += tr;
                            }
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

                        if(!data.List[1]) {
                            html += '<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
                            $('#itemContainer').empty();
                        }
                    }else {
                        html += '<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
                        $('#itemContainer').empty();
                    }
                    $('#mytable tbody').empty().append(html);
                    $('.timeTip').tooltip();




                }
            },
        });
    }
    initSrc();

    //删除
    $('body').on('click', '.del', function() {
        var $tr = $(this).parents('tr'),
            id = $tr.attr('Id');

        Base.request({
            url: 'StepFormResult/doDelById',
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

    //清空
    $('.clear').on('click', function() {
        $('[name=startTime]').add('[name=endTime]').val('');
    });

    //选择列表
    $('body').on('click', '.sortQue', function() {
        pageNo = 1;
        startTime = $('[name=startTime]').val();
        endTime = $('[name=endTime]').val();
        formId = $(this).attr('id');

        initSrc();
    });

    //搜索
    $('.btnSearch').on('click', function() {
        pageNo = 1;
        startTime = $('[name=startTime]').val();
        endTime = $('[name=endTime]').val();
        initSrc();
    });

    //导出excel
    $('.excel').on('click', function() {
        document.location.href = '../../StepFormResult/exPortResult?formId='+ formId +'&orderType=1&startTime='+ startTime +'&endTime='+ endTime;
    });

    $('.search-input-addSrc').on('click', function() {
        return false;
    });
});
