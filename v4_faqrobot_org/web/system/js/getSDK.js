
;$(function() {
    var This = this,
        type = 1,
        $tr = null,
        pageNo = 1,
        pageSize = 15,
        idStr = '';// 判断添加还是修改

    // 编辑
    $('body').on('click', '.editBtn', function() {
        var $tr = $(this).parents('tr'),
            id = $tr.attr('Id');

        Base.request({
            url: 'SDKConfig/findConfigById',
            params: {
                id: id,
            },
            callback: function(data) {
                if(data.status) {
                    Base.gritter(data.message, false);
                }else {// 回填
                   $('a[data-toggle="tab"]:first').tab('show');
                   idStr = '?id='+ id;
                   if(data.list) {
                       $('#robotname').val(data.list.Name);
                       $('.imgLogo').attr('src', data.list.PicUrl);
                       $('.cosType option[value='+ data.list.Mode +']').prop('selected', true);
                       $('.cosQue').attr({
                            'mode': data.list.Mode,
                            'value': data.list.Question?data.list.Question.Question:(data.list.ConfigMode?data.list.ConfigMode.Info.split('：')[0]:'')
                        });
                       $('.cosQue').attr('id', data.list.ModeValue);
                       $('.decCtn').val(data.list.Detail);
                       $('.form-group .js-switch').prop('checked', !data.list.Status).next().remove();
                       new Switchery($('.form-group .js-switch')[0], {
                           color : "#348fe2",
                           secondaryColor : "#dfdfdf",
                           className : "switchery",
                           disabled : false,
                           disabledOpacity : 0.5,
                           speed : "0.5s"
                       });
                   }
                }
            },
        });
    });

    // 是否开启
    $('tbody').on('change', '.js-switch', function() {
        var $tr = $(this).parents('tr'),
            id = $tr.attr('Id');

        Base.request({
            url: 'SDKConfig/setStatus',
            params: {
                id: id,
                status: +!$(this).prop('checked'),
            },
            callback: function(data) {
                if(data.status) {
                    Base.gritter(data.message, false);
                }else {
                   Base.gritter(data.message, true);
                }
            },
        });
    });

    // 删除
    $('body').on('click', '.delBtn', function() {
        var $tr = $(this).parents('tr'),
            id = $tr.attr('Id');

        Base.request({
            url: 'SDKConfig/delConfig',
            params: {
                id: id,
            },
            callback: function(data) {
                if(data.status) {
                    Base.gritter(data.message, false);
                }else {
                   Base.gritter(data.message, true);
                   if($('.delBtn').length == 1) {
                       if(pageNo >= 2) {
                           pageNo -= 1;
                       }
                   }
                   initSrc();
                }
            },
        });
    });

    // 切换列表
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        if($(e.target).is('.tab2')) {
            initSrc()
        }
    });

    //$('a[data-toggle="tab"]:last').tab('show');

    // 请求列表
    function initSrc() {
        Base.request({
            url: 'SDKConfig/findConfig',
            params: {
                pageNo: pageNo,
                pageSize: pageSize
            },
            callback: function(data) {
                if(data.status) {
                    Base.gritter(data.message, false);
                }else {
                    var html ='';
                    if(data.list[0]) {
                        for(var i=0; i<data.list.length; i++) {
                            html += '<tr Id="'+ data.list[i].Id +'"><td>'+ data.list[i].Name +'</td><td><img src="'+ data.list[i].PicUrl +'"></td><td>'+ (data.list[i].Mode==1?'知识库':'功能配置') +'</td><td>'+ data.list[i].Detail +'</td><td><input type="checkbox" class="js-switch" data-render="switchery" '+ (!data.list[i].Status?'checked':'unchecked') +'/></td><td><a><i class="timeTip editBtn glyphicon glyphicon-pencil" title="编辑"></i></a><a><i class="timeTip delBtn glyphicon glyphicon-trash" title="删除"></i></a></td></tr>';
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
                        $('#itemContainer').css({
                            width: '100%',
                        });
                        $('#itemContainer ul').css({
                            float: 'right',
                        });
                    }else {
                        html += '<tr><td colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
                        $('#itemContainer').empty();
                    }
                    $('.table tbody').empty().append(html);
                    $('.timeTip').tooltip();
                    $('tbody .js-switch').each(function() {
                        new Switchery(this, {
                            color : "#348fe2",
                            secondaryColor : "#dfdfdf",
                            className : "switchery",
                            disabled : false,
                            disabledOpacity : 0.5,
                            speed : "0.5s"
                        });
                    });
                }
            },
        });
    }

    // 提交
    $('.save').on('click', function() {
        if(!$('#robotname').val()) {
            Base.gritter('请输入功能名称', false);
            return;
        }
        if($('.imgLogo').attr('src') == 'js/add.png') {
            Base.gritter('请选择一张图像', false);
            return;
        }
        if(!$('.cosQue').attr('mode')) {
            Base.gritter('请选择来源', false);
            return;
        }
        Base.request({
            url: 'SDKConfig/addAndEditConfig'+ idStr,
            params: {
                name: $('#robotname').val(),
                isUsePic: 0,// 拓展用，暂时默认传0
                picUrl: $('.imgLogo').attr('src'),
                mode: $('.cosQue').attr('mode'),
                modeValue: $('.cosQue').attr('id'),
                detail: $('.decCtn').val(),
                status: +!$('.form-group .js-switch').prop('checked')
            },
            callback: function(data) {
                if(data.status) {
                    Base.gritter(data.message, false);
                }else {
                    Base.gritter(data.message, true);
                    setTimeout(function() {
                        location.reload();
                    }, 1000);
                }
            },
        });
    });

    new Switchery($('.form-group .js-switch')[0], {
        color : "#348fe2",
        secondaryColor : "#dfdfdf",
        className : "switchery",
        disabled : false,
        disabledOpacity : 0.5,
        speed : "0.5s"
    });

    //上传素材
    var uploader = WebUploader.create({
        server: '../../material/jQueryFileUpload?type='+ type+'&materialType='+type,
        swf: '../common/js/Uploader.swf',
        pick: $('.pickSrc'),
        fileNumLimit: 1,
        duplicate: true,
        auto: true,
    });
    //加入队列之前
    uploader.on( 'beforeFileQueued', function( file ) {
        if(!file.size) {
            Base.gritter('文件大小为空！', false);
        }
    });
    //获取服务端返回的数据
    uploader.on( 'uploadAccept', function( object, data ) {
        var error = data.files[0].error,
            msg = '上传文件成功';

        if(error) {
            Base.gritter(error, false);
        }else {
            getNaturalSize(data.files[0].url, function(width, height) {
                if(width>200 || height>200) {
                    Base.gritter('图片宽、高均不能超过200px', false);
                }else {
                    Base.gritter(msg, true);
                    $('.imgLogo').attr('src', data.files[0].url);
                }
            });
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

    function getNaturalSize(src, fn) {
        var pic = new Image();

        pic.onload = function() {//加载完毕后(建议)
            fn(pic.width, pic.height);
        }
        pic.src = src;//这句放在onload后面(兼容ie8)
    }

    /////////////////////////

    //智能推荐列表//////////////////////////////
      $('#queManual').on('click', 'a[name=delpostInput]', function() {
        if($('#queManual a[name=delpostInput]').size()>1) {
            $(this).parent().parent().remove();
        } else {
            $('#queManual [name=postQueInput]').removeAttr('rel');
            $('#queManual [name=postQueInput]').removeAttr('srel');
            $('#queManual [name=postQueInput]').val('');
        }
      });
      $('#queManual').on('click', '[name=postQueInput]', function() {
        QandFIndex = $(this).parent().parent().index();
        showQueModal();
      });
      $('#queManual').on('click', 'a[name=addpostInput]', function() {
        if($('#queManual a[name=addpostInput]').size() < 5) {
          $('#queManual').append('<div class="QueContainer"><div class="form-group col-md-10"><input class="form-control" type="text" readOnly style="cursor:pointer;" placeholder="请选择推荐的问题" name="postQueInput"></div><div class="form-group col-md-2 m-t-5"><a href="javascript:;" name="delpostInput" class="m-l-5"><span class="fa fa-minus-circle fa-2x"></span></a>&nbsp;<a href="javascript:;" name="addpostInput" class="m-l-5"><span class="fa fa-plus-circle fa-2x"></span></a></div></div>');
        }
      });
      $('#queDivNav a').click(function (e) {
        if($(this).attr('href') == '#queManualQue') {
          sQue();
        } else if($(this).attr('href') == '#queManualFlow') {
          fQue();
        }
      });

    //问题分类树
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
            url: "../../classes/listClasses?m=0",
            autoParam: ["id"],
            dataFilter: ajaxDataFilter
        },
        callback: {
            onClick: ZTreeClassClick,
            beforeClick: zTreeBeforeClick,
            onAsyncSuccess: zTreeOnAsyncSuccess
        }
    };

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
        var zTree = $.fn.zTree.getZTreeObj('treeQueClass');
        Nodes = zTree.getSelectedNodes();
        $('#QuestionClassModel [name=treeName]').val(Nodes[0].Name);
        $('#QuestionClassModel [name=treeId]').val(Nodes[0].Id);
    }
    function zTreeBeforeClick(treeId, treeNode, clickFlag) {
        return ! treeNode.isParent; //当是父节点 返回false不让选取
    }
    function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
        var treeObj = $.fn.zTree.getZTreeObj("treeClasses");
        //treeObj.expandAll(true);
    }

    //智能推荐树
    var hidesetting = {
        view: {
            dblClickExpand: false,
            showIcon: false
        },
        data: {
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
        async : {
            enable : true,
            url : "../../classes/listClasses?m=0",
            autoParam : ["id"],
            dataFilter : ajaxDataFilter
        },
        callback: {
            onClick: function(){
                hideTreeClick('treeHide','queSel','selQueX','menuContent',sQue, fQue);
            },
            beforeClick:hidezTreeBeforeClick
        }
    };
    function hideTreeClick(TreeId,showMenuId,groupId,menuId,fun1,fun2){
        isNUll(TreeId,showMenuId,groupId);
        var zTree = $.fn.zTree.getZTreeObj(TreeId);
        Nodes = zTree.getSelectedNodes();
        $('#'+showMenuId).html(Nodes[0].Name);
        $('.'+groupId).val(Nodes[0].Id);
        $("#"+menuId).fadeOut("fast");
        if(typeof fun1=='function'){
            if($('#queManualQue').hasClass('active')) {
                fun1();
            }
        }
        if(typeof fun2=='function'){
            if($('#queManualFlow').hasClass('active')) {
                fun2();
            }
        }
    }
    //判断参数是否为空
    function  isNUll(can1,can2,can3,can4){
        if(can1 === undefined){return;}
        if(can2 === undefined){return;}
        if(can3 === undefined){return;}
        if(can4 === undefined){return;}
    }
    function hidezTreeBeforeClick(treeId, treeNode, clickFlag) {
        //return !treeNode.isParent;//当是父节点 返回false 不让选取
        if(treeNode.isParent==true){
            $('#search_Que input[name=isLeaf]').val(0);
        }else{
            $('#search_Que input[name=isLeaf]').val(1);
        }
    }
    /*********************tree end***********************/

    // 切换来源
    $('.cosType').on('change', function() {
        switch(+('option:selected', $(this)).val()) {
            case 1:// 知识库
                $('.cosQue').attr('data-target', '#queManualModal');
                break;
            case 2:// 快捷服务
                $('.cosQue').attr('data-target', '#quickManualModal');
                break;
        }
    });

    // 问题
    $('#queManualConfirm').click(function() {
        $tr = $('[name=row_sel1]:checked').parents('tr');
        if($tr[0]) {
            $('#queManualModal').modal('hide');
            $('.cosQue').attr({
                mode: 1,
                id: $tr.attr('id'),
                value: $tr.attr('question')
            });
        }else {
            Base.gritter('请选择一项', false);
        }
    });

    // 快捷
    $('body').on('click', '.quickServ-item', function() {
        $tr = $(this);
        if($tr[0]) {
            $('#queManualModal').modal('hide');
            $('.cosQue').attr({
                mode: 2,
                id: $tr.attr('id'),
                value: $tr.attr('name')
            });
        }else {
            Base.gritter('请选择一项', false);
        }
    });



    /**
    * 获取智能推荐选中问题的Id
    * @param {null}
    * @return {Integer} 选中的Id
    */
    function getSelectedIds_aQue() {
        if($('#queManualQue').hasClass('active')){
            var cboxs = document.getElementsByName('row_sel1');
        }
        else if($('#queManualFlow').hasClass('active')){
            var cboxs = document.getElementsByName('row_sel2');
        }
        if(typeof cboxs=="undefined"){
            return -1;
        }
        var inputvalue="";
        for(var i=0;i<cboxs.length;i++){
            if(cboxs[i].checked==true){
                inputvalue=cboxs[i].value;
            }
        }
        return inputvalue;
    }
    /**
    * 获取智能推荐选中流程的Id
    * @param {null}
    * @return {Integer} 选中的Id
    */
    function getSelectedSolutionIds_aQue() {
        if($('#queManualQue').hasClass('active')){
            var cboxs = document.getElementsByName('row_sel1');
        }
        else if($('#queManualFlow').hasClass('active')){
            var cboxs = document.getElementsByName('row_sel2');
        }
        if(typeof cboxs=="undefined"){
            return -1;
        }
        var inputvalue="";
        for(var i=0;i<cboxs.length;i++){
            if(cboxs[i].checked==true){
                inputvalue=cboxs[i].getAttribute('solutionid');
            }
        }
        return inputvalue;
    }
    /**
    * 智能推荐列表的滚动条
    */
    // $('#queManualQueTable').slimScroll({
        // height: '400px'
    // });

    // $('#queManualFlowTable').slimScroll({
        // height: '400px'
    // });

    $('body').on('click', '#queSel', function() {
        showMenu();
    });

    //智能推荐模态窗中的树
    function showMenu() {
        var cityObj = $("#queSel");
        var cityOffset = $("#queSel").offset();
        $("#menuContent").slideDown("fast");
        $("body").bind("mousedown", onBodyDown);
        $('#classTree').slimScroll({
            height: '300px'
        });
    }
    function hideMenu() {
        $("#menuContent").fadeOut("fast");
        $("body").unbind("mousedown", onBodyDown);
    }
    function onBodyDown(event) {
        if (!(event.target.id == "menuBtn" || event.target.id == "menuContent" || $(event.target).parents("#menuContent").length>0)) {
            hideMenu();
        }
    }

    //智能推荐问题模态框显示
    function showQueModal(){
        $('#queManualModal').modal('show');
    }

    // 显示问题框
    $('#queManualModal').on('show.bs.modal', function () {
        $.fn.zTree.init($("#treeHide"),hidesetting,[]);
        hideMenu();
        if($('#queManualQue').hasClass('active')) {
            sQue(1);
        }
        if($('#queManualFlow').hasClass('active')) {
            fQue(1);
        }
    })

    // 显示快捷框
    $('#quickManualModal').on('show.bs.modal', function () {
        getConfig();
    })

    $('.lookFor').on('click', function() {
        if($('#queDivNav li:first').is('.active')) {
            sQue();
        }else {
            fQue();
        }
    });

    // 所有快捷服务
    function getConfig() {
        Base.request({
            url: 'ConfigMode/listSwitchConfig',
            params: {},
            callback: function(data) {
                if(data.status) {
                    Base.gritter(data.message, false);
                }else {
                    var html ='';
                    if(data.modes[0]) {
                        for(var i=0; i<data.modes.length; i++) {
                            var params = '';
                            for(var key in data.modes[i]) {
                                params += key+'="'+ (''+ data.modes[i][key] || '') +'" ';
                            }
                            if(data.modes[i].Info.split('：')[0]=='寒暄库' || data.modes[i].Info.split('：')[0]=='禁止库' || data.modes[i].Info.split('：')[0]=='联网聊天库') {
                                continue;
                            }
                            var ImageUrl = '';
                            switch(data.modes[i].Info.split('：')[0]) {
                                case '空气质量':
                                    ImageUrl = '/web/common/images/web.switch.plus.aiq.gif';
                                    break;
                                case '菜谱查询':
                                    ImageUrl = '/web/common/images/web.switch.plus.cookbook.gif';
                                    break;
                                case '成语查询':
                                    ImageUrl = '/web/common/images/web.switch.plus.idiom.gif';
                                    break;
                                case '讲笑话':
                                    ImageUrl = '/web/common/images/web.switch.plus.joke.gif';
                                    break;
                                case '智能计算':
                                    ImageUrl = '/web/common/images/web.switch.plus.math.gif';
                                    break;
                                case '手机号码查询':
                                    ImageUrl = '/web/common/images/web.switch.plus.phone.gif';
                                    break;
                                case '汇率转换':
                                    ImageUrl = '/web/common/images/web.switch.plus.rateconversion.gif';
                                    break;
                                case '成语查询':
                                    ImageUrl = '/web/common/images/web.switch.plus.idiom.gif';
                                    break;
                                case '同步翻译':
                                    ImageUrl = '/web/common/images/web.switch.plus.translate.gif';
                                    break;
                                case '单位换算':
                                    ImageUrl = '/web/common/images/web.switch.plus.unitconversion.gif';
                                    break;
                                case '天气查询':
                                    ImageUrl = '/web/common/images/web.switch.plus.weather.gif';
                                    break;

                            }
                            html += '<div class="quickServ-item" '+ params +' name="'+ data.modes[i].Info.split('：')[0] +'" imageurl="http://'+ location.host + ImageUrl +'"><div class="imgCtn"><img src="http://'+ location.host + ImageUrl +'"></div><p>'+ data.modes[i].Info.split('：')[0] +'</p><i class="noDrag" title="点击在选中频道新建此服务"></i></div>';
                        }
                    }else {
                        html += '<div class="emptyTip"><span colspan="7" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;没有快捷服务！</span></div>';
                    }
                    $('.quickServ').empty().append(html);
                }
            },
        });
    }

    //智能推荐问题模态窗列表
    function sQue(pageNo){
        if(!pageNo)pageNo=1;
        $.ajax({
            type:'post',
            datatype:'json',
            cache:false,//不从缓存中去数据
            url:encodeURI('../../question/getQueListByMode?pageSize=8&pageNo='+pageNo+'&solutionType=1'),
            data:$("#search_Que").serialize(),
            success:
            function(data){
                if(data.status==0){
                    if(data.questionList.length>0){
                        var html = "";
                        var existIds=[];
                        $('#queManual').find('input[name=postQueInput]').each(function(){
                            existIds.push($(this).attr('rel')*1);
                        });
                        for(var i=0;i<data.questionList.length;i++){
                            //禁用列表中已经存在的问题
                            if($.inArray(data.questionList[i].Id, existIds)>=0){
                                html += "<tr Question="+data.questionList[i].Question+" id="+data.questionList[i].Id+">";
                                html += "<td><input disabled='' type=\"radio\" name=\"row_sel1\" value=\""+data.questionList[i].Id+"\" solutionId=\""+data.questionList[i].SolutionId+"\"></td>";
                                if(data.questionList[i].AnswerStatus==-4){
                                    html += "<td class=\"dueTd\">"+data.questionList[i].Question+"<a class=\"btn btn-xs btn-danger m-l-5\">已过期</a></td>";
                                }else{
                                    html += "<td>"+data.questionList[i].Question+"</td>";
                                }
                                html += "</tr>";
                            }else{
                                html += "<tr Question="+data.questionList[i].Question+" id="+data.questionList[i].Id+">";
                                html += "<td><input type=\"radio\" name=\"row_sel1\" value=\""+data.questionList[i].Id+"\" solutionId=\""+data.questionList[i].SolutionId+"\"></td>";
                                if(data.questionList[i].AnswerStatus==-4){
                                    html += "<td class=\"dueTd\">"+data.questionList[i].Question+"<a class=\"btn btn-xs btn-danger m-l-5\">已过期</a></td>";
                                }else{
                                    html += "<td>"+data.questionList[i].Question+"</td>";
                                }
                                html += "</tr>";
                            }
                        }
                        $('#ansList').find('tbody').html(html);
                        icheckInit();
                        $('#ansList td').click(function() {
                            $(this).parent().find('input[name=row_sel1]').iCheck('check');
                        });
                        //下面开始处理分页
                        var options = {
                            currentPage: data.currentPage,
                            totalPages: data.totlePages,
                            alignment:'right',
                            onPageClicked: function (event, originalEvent, type, page) {
                                sQue(page);
                            }
                        };
                        setPage('quepageList',options);
                    }else{
                        if($('#search_Que input[name=question]').val() !=''){
                            $('#ansList').find('tbody').html('<tr><td colspan=\"2\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;搜索结果为空！</td></tr>');}
                        else{
                            $('#ansList').find('tbody').html('<tr><td colspan=\"2\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
                        }
                        $('#quepageList').html('');
                    }
                    icheckInit();
                }else{
                    yunNoty(data);
                }
            }
        })
    }

    //智能推荐流程模态窗列表
    function fQue(pageNo){
        if(!pageNo)pageNo=1;
        $.ajax({
            type:'post',
            datatype:'json',
            cache:false,//不从缓存中去数据
            url:encodeURI('../../question/getQueListByMode?pageSize=8&pageNo='+pageNo+'&solutionType=2'),
            data:$("#search_Que").serialize(),
            success:
            function(data){
                if(data.status==0){
                    if(data.questionList.length>0){
                        var html = "";
                        var existIds=[];
                        $('#queManual').find('input[name=postQueInput]').each(function(){
                            existIds.push($(this).attr('rel')*1);
                        });
                        for(var i=0;i<data.questionList.length;i++){
                            //禁用列表中已经存在的问题
                            if($.inArray(data.questionList[i].Id, existIds)>=0){
                                html += "<tr id=\"list-tr-"+data.questionList[i].Id+"\">";
                                html += "<td><input disabled='' type=\"radio\" name=\"row_sel2\" value=\""+data.questionList[i].Id+"\" solutionId=\""+data.questionList[i].SolutionId+"\"></td>";
                                if(data.questionList[i].AnswerStatus==-4){
                                    html += "<td class=\"dueTd\">"+data.questionList[i].Question+"<a class=\"btn btn-xs btn-danger b-l-5\">已过期</a></td>";
                                }else{
                                    html += "<td>"+data.questionList[i].Question+"</td>";
                                }
                                html += "</tr>";
                            }else{
                                html += "<tr id=\"list-tr-"+data.questionList[i].Id+"\">";
                                html += "<td><input type=\"radio\" name=\"row_sel2\" value=\""+data.questionList[i].Id+"\" solutionId=\""+data.questionList[i].SolutionId+"\"></td>";
                                if(data.questionList[i].AnswerStatus==-4){
                                    html += "<td class=\"dueTd\">"+data.questionList[i].Question+"<a class=\"btn btn-xs btn-danger b-l-5\">已过期</a></td>";
                                }else{
                                    html += "<td>"+data.questionList[i].Question+"</td>";
                                }
                                html += "</tr>";
                            }
                        }
                        $('#flowList').find('tbody').html(html);
                        icheckInit();
                        $('#flowList td').click(function() {
                            $(this).parent().find('input[name=row_sel2]').iCheck('check');
                        });
                        //下面开始处理分页
                        var options = {
                            currentPage: data.currentPage,
                            totalPages: data.totlePages,
                            alignment:'right',
                            onPageClicked: function (event, originalEvent, type, page) {
                                fQue(page);
                            }
                        };
                        setPage('flowpageList',options);
                    }else{
                        if($('#search_Que input[name=question]').val() !=''){
                            $('#flowList').find('tbody').html('<tr><td colspan=\"2\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;搜索结果为空！</td></tr>');}
                        else{
                            $('#flowList').find('tbody').html('<tr><td colspan=\"2\" style=\"text-align:center;\"><i class=\"glyphicon glyphicon-warning-sign\"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>');
                        }
                        $('#flowpageList').html('');
                    }
                    icheckInit();
                }else{
                    yunNoty(data);
                }
            }
        })
    }

    //选择问题分类模态窗
      $('.treeDivModal').slimScroll({
        height: '400px'
      });
      $('#QuestionClassModel').on('show.bs.modal', function () {
        $.fn.zTree.init($("#treeQueClass"),classsetting,[]);
      });
      $('#QuestionClassModel').on('hide.bs.modal', function () {
        $('#QuestionClassModel [name=treeName]').val('');
        $('#QuestionClassModel [name=treeId]').val('');
      });

    var solutionId2 = 0,
        questionId2 = 0;

    $('body').on('click', '.editClass', function() {
        $('#QuestionClassModel').modal('show');

        var $tr = $(this).parents('tr');
        solutionId2 = $tr.attr('solutionId');
        questionId2 = $tr.attr('id');
    });

      $('#selClassBtn').on('click', function() {
        var $tr = $(this).parents('tr'),
            queClass = $('#QuestionClassModel [name=treeName]').val();

        if(queClass) {
            Base.request({
                url: 'question/editQuestion',
                params: {
                    solutionId: solutionId2,
                    questionId: questionId2,
                    groupId: $('#QuestionClassModel [name=treeId]').val(),
                    question: $('.queTitle').text(),
                },
                callback: function(data) {
                    if(data.status) {
                        Base.gritter(data.message, false);
                    }else {
                        Base.gritter(data.message, true);
                        $('.editClass em').text(queClass);
                        $('#QuestionClassModel').modal('hide');
                    }
                },
            });
        }
      });
});
