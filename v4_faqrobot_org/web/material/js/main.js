
;$(function() {
    /*** addSrc ***/
    var AddSrc = function() {
        var This = this;
        var treeNodeName = '';
        var type = 1,//素材类型
            pageNo = 1,//当前页
            pageSize = 10,//每页数量
            name = '',//搜索内容
            isJpage = 0,//是否已实例化jpage
            delPage = 0,//是否删除jpage
			groupId = 0;

        function abc() {
            window.location.href='../../material/exportMaterial?type='+type+'&groupId='+groupId;
            }
        window.abc = abc;
            function initSrc(isCut) {
                if(isCut){pageNo = 1};
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
                	$("#freememory").text(data.remainSpace);
                	$("#allmemory").text(data.allSpace);
                    if(data.status) {
                        Base.gritter(data.message, false);
                    }else {
                        var html ='';
                        if(data.list) {
                            if(data.list[0]) {
                                for(var i=0; i<data.list.length; i++) {
                                    switch(type) {
                                        case 1://图片
                                            html += '<tr Id="'+ data.list[i].Id +'"><td><input class="singleCos" type="checkbox"></td><td><a href="../../'+ data.list[i].Path +'" data-lightbox="image-1"><img src="../../'+ data.list[i].Path +'" alt="'+ data.list[i].Name +'" title="'+ data.list[i].Name +'" width="120"></a></td><td><p style="width:100px;word-break: break-all;"><a href="../../'+ data.list[i].Path +'" target="_blank">'+ data.list[i].Name +'</a></p></td><td>'+ data.list[i].GroupName +'</td><td>'+ Base.formatSize(data.list[i].Size) +'</td><td>'+ data.list[i].Time +'</td><td>'+ (data.list[i].UserName||"") +'</td><td><a href="javascript:;"><i class="editClass glyphicon glyphicon-pencil" title="修改分类"></i></a>&nbsp;<a><i class="one-del-addSrc glyphicon glyphicon-trash" title="删除"></i></a></td></tr>';
                                            break;
                                        case 2://语音
                                            html += '<tr Id="'+ data.list[i].Id +'"><td><input class="singleCos" type="checkbox"></td><td><div id="jquery_jplayer_'+ i +'"class="jp-jplayer" path="../../'+ data.list[i].Path +'"></div><div id="jp_container_'+ i +'"class="jp-audio"role="application"aria-label="media player"><div class="jp-type-single"><div class="jp-gui jp-interface"><div class="jp-controls" ><button class="jp-play"role="button"tabindex="0">play</button><button class="jp-stop"role="button"tabindex="0">stop</button></div><div class="jp-no-solution"><span>Update Required</span>To play the media you will need to either update your browser to a recent version or update your<a href="http://get.adobe.com/flashplayer/"target="_blank">Flash plugin</a>.</div></div></div></td><td><p style="width:100px;word-break: break-all;"><a href="../../'+ data.list[i].Path +'" target="_blank">'+ data.list[i].Name +'</a></p></td><td>'+ data.list[i].GroupName +'</td><td>'+ Base.formatSize(data.list[i].Size) +'</td><td>'+ data.list[i].Time +'</td><td>'+ (data.list[i].UserName||"") +'</td><td><a href="javascript:;"><i class="editClass glyphicon glyphicon-pencil" title="修改分类"></i></a>&nbsp;<a><i class="one-del-addSrc glyphicon glyphicon-trash" title="删除"></i></a></td></tr>';
                                            break;
                                        case 3://视频
                                            html += '<tr Id="'+ data.list[i].Id +'"><td><input class="singleCos" type="checkbox"></td><td><img class="videoBtn-addSrc" path="../../'+ data.list[i].Path +'" src="images/a_video.png" alt="'+ data.list[i].Name +'" title="'+ data.list[i].Name +'" width="35" height="35" href="#modal-dialog" data-toggle="modal"></td><td><p style="width:100px;word-break: break-all;"><a href="../../'+ data.list[i].Path +'" target="_blank">'+ data.list[i].Name +'</a></p></td><td>'+ data.list[i].GroupName +'</td><td>'+ Base.formatSize(data.list[i].Size) +'</td><td>'+ data.list[i].Time +'</td><td>'+ (data.list[i].UserName||"") +'</td><td><a href="javascript:;"><i class="editClass glyphicon glyphicon-pencil" title="修改分类"></i></a>&nbsp;<a><i class="one-del-addSrc glyphicon glyphicon-trash" title="删除"></i></a></td></tr>';
                                            break;
                                        case 4://文档
                                            var iframeTabStr = 'data-num="0" data-name="素材预览"';
                                            var fileNameSuffix = data.list[i].Name.split(".")[1];
                                            html += '<tr Id="'+ data.list[i].Id +'"><td><input class="singleCos" type="checkbox"></td><td><a href="../../'+ data.list[i].Path +'" '+((fileNameSuffix == "pdf"||fileNameSuffix == "PDF")?iframeTabStr:"")+'><img src="images/a_doc.png" alt="'+ data.list[i].Name +'" title="'+ data.list[i].Name +'" width="35" height="35"></a></td><td><p style="width:100px;word-break: break-all;"><a href="../../'+ data.list[i].Path +'" target="_blank">'+ data.list[i].Name +'</a></p></td><td>'+ data.list[i].GroupName +'</td><td>'+ Base.formatSize(data.list[i].Size) +'</td><td>'+ data.list[i].Time +'</td><td>'+ (data.list[i].UserName||"") +'</td><td><a href="javascript:;"><i class="editClass glyphicon glyphicon-pencil" title="修改分类"></i></a>&nbsp;<a><i class="one-del-addSrc glyphicon glyphicon-trash" title="删除"></i></a></td></tr>';
                                            break;
                                        case 0://其他
                                            html += '<tr Id="'+ data.list[i].Id +'"><td><input class="singleCos" type="checkbox"></td><td><a href="../../'+ data.list[i].Path +'"><img src="images/a_other.png" alt="'+ data.list[i].Name +'" title="'+ data.list[i].Name +'" width="35" height="35"></a></td><td><p style="width:100px;word-break: break-all;"><a href="../../'+ data.list[i].Path +'" target="_blank">'+ data.list[i].Name +'</a></p></td><td>'+ data.list[i].GroupName +'</td><td>'+ Base.formatSize(data.list[i].Size) +'</td><td>'+ data.list[i].Time +'</td><td>'+ (data.list[i].UserName||"") +'</td><td><a href="javascript:;"><i class="editClass glyphicon glyphicon-pencil" title="修改分类"></i></a>&nbsp;<a><i class="one-del-addSrc glyphicon glyphicon-trash" title="删除"></i></a></td></tr>';
                                            break;
                                        /*case 13://资源
                                            html += '<tr Id="'+ data.list[i].Id +'"><td><input class="singleCos" type="checkbox"></td><td><a href="../../'+ data.list[i].Path +'"><img src="images/a_other.png" alt="'+ data.list[i].Name +'" title="'+ data.list[i].Name +'" width="35" height="35"></a></td><td><p style="width:100px;word-break: break-all;"><a href="../../'+ data.list[i].Path +'" target="_blank">'+ data.list[i].Name +'</a></p></td><td>'+ data.materialsList[i].SuffixName +'</td><td>'+ Base.formatSize(data.list[i].Size) +'</td><td>'+ data.list[i].Time +'</td><td>'+ data.list[i].UserName +'</td><td><a class="editRes" data-target="#resClassModal" data-toggle="modal"><i class="glyphicon glyphicon-pencil" title="编辑"></i></a>&nbsp;<a><i class="one-del-addSrc glyphicon glyphicon-trash" title="删除"></i></a></td></tr>';
                                            break;*/
                                    }
                                }
								$('tbody').empty().append(html);
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
                                $('tbody').empty().append(html);
                            }
                        }
                        
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
                                        $("#jquery_jplayer_"+ i).bind($.jPlayer.event.play, function() {
                                          $(this).jPlayer("pauseOthers"); // pause all players except this one.
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
        //$('.progress-striped').hide();
        //$('.tab-addSrc').hide();
        $('.tab-addSrc').eq(0).removeClass('hide');
        var tabIndex = 0;
        //切换素材类型
        $('.tabClick-addSrc').each(function(i) {
            $(this).on('click', function() {
                type = i+1;
                if(i == 4) {
                    type = 0;
                }
                if(type == 6){
                	type = 13;
                	//initSource();
                }else{
                	initSrc(true);
                }
                pageNo = 1;
                isJpage = 0;
                name = '';
                
                $('.add-src').each(function(i) {
                    var txt = $(this).text();

                    $(this).empty().text(txt);
                });

                //if(i == 0) {
                    fileNumLimit = 10;
                //}else {
                //    fileNumLimit = 1;
                //}
				
                resetUploader(i, fileNumLimit);

                $('.tab-addSrc').addClass('hide');
                $('.tab-addSrc').eq(i).removeClass('hide');
                var tmpId=$(this).attr('href').replace('#','');

                var str = '';
                switch($(this).attr('href').replace('#','')) {
                    case 'default-tab-1':
                        str = '添加图片';
                        break;
                    case 'default-tab-2':
                        str = '添加语音';
                        break;
                    case 'default-tab-3':
                        str = '添加视频';
                        break;
                    case 'default-tab-4':
                        str = '添加文档';
                        break;
                    case 'default-tab-5':
                        str = '添加其他';
                        break;
                    case 'default-tab-13':
                        str = '添加资源';
                        break;
                }
                $('#'+$(this).attr('href').replace('#','')+' .webuploader-pick').html(str);
                
            });
            
        });
        
        //重新生成uploader
        function resetUploader(i, fileNumLimit) {
            if(uploader) {
                uploader.destroy();
            }
            //上传素材
            uploader = WebUploader.create({
                server: '../../material/jQueryFileUpload?type='+ type+'&groupId='+groupId+'&materialType='+type,
                swf: '../common/js/Uploader.swf',
                pick: $('.add-src').eq(i),
                fileNumLimit: fileNumLimit,
                duplicate: true,
                auto: true,
            });
            //加入队列之前
            uploader.on( 'beforeFileQueued', function( file ) {
                if(!file.size) {
                    Base.gritter('文件大小为空！', false);
                }
                /*if(file.size > 10240000) {
                    var msg = '文件大小不能超过10M';
                    Base.gritter(msg, false);
                    return false;
                }*/
                if(type == 1){
                    var msg = '上传文件错误，支持以jpeg、jpg、png、bmp、gif、JPEG、JPG、PNG、BMP、GIF结尾的格式文件！';
                    if(!(msg.indexOf(file.ext)+1)) {
                        Base.gritter(msg, false);
                        return false;
                    }
                }
                if(type == 2){
                    var msg = '上传文件错误，支持以mp3、aac、wav、wma、cda、flac、m4a、mid、mka、mp2、mpa、mpc、ape、ofr、ogg、ra、wv、tta、ac3、dts、amr、MP3、AAC、WAV、WMA、CAD、FLAC、M4A、MID、MKA、MP2、MPA、MPC、APE、OFR、OGG、RA、WV、TTA、AC3、DTS、AMR结尾的格式文件！';
                    if(!(msg.indexOf(file.ext)+1)) {
                        Base.gritter(msg, false);
                        return false;
                    }
                }
                if(type == 3){
                    var msg = '上传文件错误，支持以mp4、avi、3gp、rm、rmvb、wmv、mkv、mpg、vob、mov、flv、swf、MP4、AVI、3GP、RM、RMVB、WMV、MKV、MPG、VOB、MOV、FLV、SWF结尾的格式文件！';
                    if(!(msg.indexOf(file.ext)+1)) {
                        Base.gritter(msg, false);
                        return false;
                    }
                }
                if(type == 4) {
                    var msg = '上传文件错误，支持以xlsx、docx、txt、doc、xls、et、wps、pdf、dps、ppt、pptx、XLSX、DOCX、TXT、DOC、XLS、ET、WPS、PDF、DPS、PPT、PPTX结尾的格式文件！';
                    if(!(msg.indexOf(file.ext)+1)) {
                        Base.gritter(msg, false);
                        return false;
                    }
                }
                if(type == 0) {
                    var msg = '上传文件错误，支持以 rar、zip、swf、apk、exe、html、RAR、ZIP、SWF、APK、EXE、HTML结尾的格式文件！';
                    if(!(msg.indexOf(file.ext)+1)) {
                        Base.gritter(msg, false);
                        return false;
                    }
                }
                if(type == 13) {
                    var msg = '上传文件错误，支持以 xls、xlsx、XLS、XLSX结尾的格式文件！';
                    if(!(msg.indexOf(file.ext)+1)) {
                        Base.gritter(msg, false);
                        return false;
                    }
                }
            });
            //获取服务端返回的数据
             /*
                taskid=534,黄世鹏
                修改：正确的解析返回值
             */
            uploader.on( 'uploadAccept', function( object, data ) {
                var error='';
                if(!(data.files instanceof Array)){
            		error = JSON.parse(data.files)[0].error
            	}
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
            	$('.progress-striped').removeClass('hide');
            });
            //上传进度
            uploader.on( 'uploadProgress', function( file, percentage ) {
            	$('.progress-bar').css({'width': percentage*100 +'%'});
            });
            //限制单次上传数量
            uploader.on( 'uploadFinished', function( object, data ) {
        		$('.progress-bar').css({'width': 0});
                $('.progress-striped').addClass('hide');
                uploader.reset();
            });  
        }
        $("#addRes").click(function(){
      		addResource();
        });
        function addResource(){
        	$("#resClassModal").show();
        	$('#resClassModal .tab-addSrc').removeClass('hide');
        	//添加时选择的树
			var hideSetting = {
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
						name : "CodeDesc"
					}
				},
				async : {
					enable : true,
					url : "../../ConfigMode/getValueByCodeType?codeType=resource_type",
					autoParam : ["id"],
					dataFilter : ajaxDataFilter
				},
				callback: {
					beforeClick: zTreeBeforeClick,
					onClick:function (treeId, treeName,treeNode){
						var zTree = $.fn.zTree.getZTreeObj('treeResClasses');
					    Nodes = zTree.getSelectedNodes();
					}
				}
			};
			function zTreeBeforeClick(treeId, treeNode, clickFlag){
			    return !treeNode.isParent;//当是父节点 返回false 不让选取
			}
			//渲染树结构
			function ajaxDataFilter(treeId, parentNode, responseData) {
				if (responseData) {
					responseData.CodeMaster.push({ Id:1, ParentId:0, CodeDesc:"资源类别", open:true});
					return responseData.CodeMaster;
				}
				return responseData;
			};
			function zTreeOnExpand(event, treeId, treeNode) {
				//展开的时候滚动条怎么调用？？？？？？？？？
			};
			
			//添加模态框出现加载分类树
			$('#resClassModal').on('show.bs.modal', function(){
				$.fn.zTree.init($("#classTree_Res"), hideSetting, []);
			});
        }
        
        
        var uploader1,configName1 = null;
        $('#resClassModal').on('show.bs.modal', function(){
        	
        	$("#resSure").unbind('click').bind('click',function(){
        		/*if($("#pickBtn div").is(".webuploader-pick")){
        			yunNotyError('请上传资源文件！');
        		}*/
        		if(!$('.file_name').length){
        			yunNotyError('请添加文件！');
        		}else{
        			if(!$("#classTree_Res_1_ul a").is('.curSelectedNode')){
	        			yunNotyError('请选择资源分类！');
	        		}
        			if($("#classTree_Res_1_ul a").is('.curSelectedNode')){
        				configName1 = $("#classTree_Res_1_ul a.curSelectedNode").attr('title');
        				var obj = new Object();
        				obj.configName=configName1;
        				uploader1.options.formData = obj;
	        			uploader1.upload();
        			}
        		}
        	});
        	if(uploader1){
        		uploader1.destroy();
        	}
        	//上传素材
            uploader1 = WebUploader.create({
                server: '../../material/jQueryFileUpload?type='+ type+'&groupId='+groupId+'&materialType='+type,
                swf: '../common/js/Uploader.swf',
                pick: $('#pickBtn').eq(0),
                fileNumLimit: fileNumLimit,
                duplicate: true,
                auto: false,
            });
            //加入队列之前
            uploader1.on( 'beforeFileQueued', function( file ) {
            	
                if(!file.size) {
                    Base.gritter('文件大小为空！', false);
                }
                /*if(file.size > 10240000) {
                    var msg = '文件大小不能超过10M';
                    Base.gritter(msg, false);
                    return false;
                }*/
                if(type == 1){
                    var msg = '上传文件错误，支持以jpeg、jpg、png、bmp、gif结尾的格式文件！';
                    if(!(msg.indexOf(file.ext)+1)) {
                        Base.gritter(msg, false);
                        return false;
                    }
                }
                if(type == 2){
                    var msg = '上传文件错误，支持以mp3、aac、wav、wma、cda、flac、m4a、mid、mka、mp2、mpa、mpc、ape、ofr、ogg、ra、wv、tta、ac3、dts、amr结尾的格式文件！';
                    if(!(msg.indexOf(file.ext)+1)) {
                        Base.gritter(msg, false);
                        return false;
                    }
                }
                if(type == 3){
                    var msg = '上传文件错误，支持以mp4、avi、3gp、rm、rmvb、wmv、mkv、mpg、vob、mov、flv、swf结尾的格式文件！';
                    if(!(msg.indexOf(file.ext)+1)) {
                        Base.gritter(msg, false);
                        return false;
                    }
                }
                if(type == 4) {
                    var msg = '上传文件错误，支持以xlsx、docx、txt、doc、xls、et、wps、pdf、dps、ppt、pptx结尾的格式文件！';
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
                if(type == 13) {
                    var msg = '上传文件错误，支持以 xls、xlsx结尾的格式文件！';
                    if(!(msg.indexOf(file.ext)+1)) {
                        Base.gritter(msg, false);
                        return false;
                    }
                }
                
                $('#pickBtn').parent().append('<span style="display:none;" class="file_name">'+file.name+'</span>');
            });
            //获取服务端返回的数据
            /*
                taskid=534,黄世鹏
                修改：正确的解析返回值
             */
            uploader1.on( 'uploadAccept', function( object, data ) {
                var error='';
                if(!(data.files instanceof Array)){
            		error = JSON.parse(data.files)[0].error
            	}
                	msg = '上传文件成功';
                if(error) {
                    Base.gritter(error, false);
                }else {
            		Base.gritter(msg, true);
            		initSource();
                }
            });
            //上传开始
            uploader1.on( 'startUpload', function( file, percentage ) {
            	$('.progress-striped').removeClass('hide');
            });
            //上传进度
            uploader1.on( 'uploadProgress', function( file, percentage ) {
                $('.progress-bar').css({'width': percentage*100 +'%'});
            });
            //限制单次上传数量
            uploader1.on( 'uploadFinished', function( object, data ) {
            	$('.progress-bar').css({'width': 0});
                $('.progress-striped').addClass('hide');
                $('#resClassModal').find('button.close').trigger('click');
                uploader1.reset();
            }); 
            
        });
        
        $('#resClassModal').on('hide.bs.modal', function(){
			uploader1.destroy();
		});
        
		$('body').on('click','.editRes',function(){
			addResource();
		});

        $('body').on('click', '.editClass', function() {
			$('#editClassModel').modal('show');
			$('#mId').val($(this).parents('tr').attr('Id'));
		});
		$('body').on('click', '.mult-move', function() {
                var ids = [];

                $('.singleCos').each(function() {
                    var $tr = $(this).parents('tr'),
                        id = $tr.attr('Id');

                    if($(this).is(':checked')) {
                        ids.push(id);
                    }
                });
                if(ids.length == 0) {
					Base.gritter('勾选要移动的素材', false);
					return false;
				} else {
			$('#editClassModel').modal('show');
			$('#mId').val(ids.toString());
				}
		});
		// 批量移动资源分类
		$('body').on('click', '.mult-move-source', function() {
                var ids = [];

                $('.singleCos').each(function() {
                    var $tr = $(this).parents('tr'),
                        id = $tr.attr('Id');

                    if($(this).is(':checked')) {
                        ids.push(id);
                    }
                });
                if(ids.length == 0) {
					Base.gritter('勾选要移动的素材', false);
					return false;
				} else {
			$('#editClassSourceModel').modal('show');
			$('#mSourceId').val(ids.toString());
				}
		});
		$('#editClassModel').on('show.bs.modal', function() {
		  $.fn.zTree.init($("#treeEditClass"),classsetting,[]);
		});
		$('#editClassSourceModel').on('show.bs.modal', function() {
		  $.fn.zTree.init($("#treeEditSourceClass"),classSourcesetting,[]);
		});
        $('body').on('click', '#selClassSourceBtn', function() {
            if($('#editClassSourceModel [name=treeId]').val()&&$('#editClassSourceModel [name=treeName]').val()){
                Base.request({
                    url: 'material/editGroupIdByIds',
                    params: {
                        ids : $('#mSourceId').val(),
                        groupId : $('#editClassSourceModel [name=treeId]').val(),
                        groupName:$('#editClassSourceModel [name=treeName]').val()
                    },
                    callback: function(data) {
                        if(data.status === 0) {
                            Base.gritter(data.message, true);
                            $('#editClassSourceModel').modal('hide');
                            initSource();
                        } else {
                            Base.gritter(data.message, false);
                        }
                    }
                });
            }else{
                Base.gritter("请选择分类！", false);
            }

		});
        $('body').on('click', '#selClassBtn', function() {
			var mig = $('#mId').val();
			if(mig.split(',').length > 1) {
                if($('#editClassModel [name=treeId]').val()&&$('#editClassModel [name=treeName]').val()) {
                    Base.request({
                        url: 'material/editGroupIdByIds',
                        params: {
                            ids: $('#mId').val(),
                            groupId: $('#editClassModel [name=treeId]').val(),
                            groupName: $('#editClassModel [name=treeName]').val()
                        },
                        callback: function (data) {
                            if (data.status === 0) {
                                Base.gritter(data.message, true);
                                $('#editClassModel').modal('hide');
                                initSrc();
                            } else {
                                Base.gritter(data.message, false);
                            }
                        }
                    });
                }else{
                    Base.gritter("请选择分类！", false);
                }
			} else {
                if($('#editClassModel [name=treeId]').val()&&$('#editClassModel [name=treeName]').val()) {
                    Base.request({
                        url: 'material/editGroupIdByIds',
                        params: {
                            ids: $('#mId').val(),
                            groupId: $('#editClassModel [name=treeId]').val(),
                            groupName: $('#editClassModel [name=treeName]').val()
                        },
                        callback: function (data) {
                            if (data.status === 0) {
                                Base.gritter(data.message, true);
                                $('#editClassModel').modal('hide');
                                initSrc();
                            } else {
                                Base.gritter(data.message, false);
                            }
                        }
                    });
                }else{
                    Base.gritter("请选择分类！", false);
                }
			}
		});

        //删除
        $('body').on('click', '.one-del-addSrc, .mult-del', function() {
          $(this).adcCreator(somedeladdsrc, function(obj) {
			if($(obj).is('.mult-del')) {
                var ids = [];

                $('.singleCos').each(function() {
                    var $tr = $(this).parents('tr'),
                        id = $tr.attr('Id');

                    if($(this).is(':checked')) {
                        ids.push(id);
                    }
                });
                if(ids.length == 0) {
					Base.gritter('勾选要删除的素材', false);
					return false;
				}
			}
			return true;
		  });
        });
        function somedeladdsrc(obj) {
            delPage = 1;
            if($(obj).is('.one-del-addSrc')) {
                var $tr = $(obj).parents('tr'),
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
                            /*
                                taskid=763,黄世鹏
                                修改逻辑：判断是否是添加资源界面，调用不同方法
                            */ 
                            if($('.resource ').hasClass('active')){
                                initSource()
                            }else{
                                initSrc();
                            }
                        }
                    },
                });
            }
            if($(obj).is('.mult-del')) {
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
                            /*
                                taskid=763,黄世鹏
                                修改逻辑：判断是否是添加资源界面，调用不同方法
                            */ 
                            if($('.resource ').hasClass('active')){
                                initSource()
                            }else{
                                initSrc();
                            }
                        }
                    },
                });
            }
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
        $('.searchAddSrc').on('click', function() {
            delPage = 1;
            pageNo = 1;
            name = $('.search-input-addSrc').val();
			if($('[href="#default-tab-13"]').parent().hasClass('active')) {
				initSource();
			} else {
				initSrc();
			}
        });
        $('.search-input-addSrc').on('click', function() {
            return false;
        });
        $('.search-input-addSrc').on('keyup', function(e) {
			e.preventDefault();
        });

        //ENTER
        $(document).on('keyup', function(e) {
			e.preventDefault();
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
 
    
    $(".tabClick-addSrc").each(function(i){
    	$(this).on('click',function(){
    		if(i==5){
            	$("#leftList1").css('display','none');
            	$("#leftList2").css('display','block');
            	
            	//资源分类树
				  var resourcesetting = {
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
				        name: "CodeDesc"
				      }
				    },
				    async: {
				      enable: true,
				      url: "../../ConfigMode/getValueByCodeType?codeType=resource_type",
				      autoParam: ["id"],
				      dataFilter: ajaxDataFilter1
				    },
				    callback: {
				      onClick: ZTreeClassResClick,
				      onAsyncSuccess: zTreeOnAsyncSuccess1
				    }
				  };
				  function ZTreeClassResClick(treeId,treeName, treeNode) {
				    var zTree = $.fn.zTree.getZTreeObj('treeResClasses');
				    Nodes = zTree.getSelectedNodes();
				    $('#default-tab-13 input[name=treeName]').val(Nodes[0].CodeDesc);
					$('#default-tab-13 input[name=treeId]').val(Nodes[0].Id);
					initSource();
				  }
				  function zTreeBeforeClick(treeId, treeNode, clickFlag){
					    return !treeNode.isParent;//当是父节点 返回false 不让选取
					}
				  function zTreeOnAsyncSuccess1(event, treeId, treeNode, msg) {
						var treeObj = $.fn.zTree.getZTreeObj("treeResClasses");
						//treeObj.expandAll(true);
					}
				  //格式化一步获取的json数据
					function ajaxDataFilter1(treeId, parentNode, responseData) {
						if (responseData) {
							responseData.CodeMaster.push({
								Id: 1,
								ParentId: 0,
								CodeDesc: "资源类别",
								open: true
							});
							return responseData.CodeMaster;
						}
						return responseData;
					}
	        	$(document).ready(function(){
	        		$.fn.zTree.init($("#treeResClasses"), resourcesetting, []);
	        		initSource();
	        	});
    		}else{
    			$("#leftList1").css('display','block');
    			$("#leftList2").css('display','none');
    		}
    	})
    })
    
  //资源列表
	function initSource() {
        $('.multCos').iCheck('uncheck');
        treeNodeName = $("#default-tab-13 input[name=treeName]").val();
        if(treeNodeName=='资源类别'){
        	treeNodeName='';
        }
        Base.request({
            url: 'Material/listResource?type=13&treeName='+treeNodeName+'&fileName='+$('.search-input-addSrc').val(),
            callback: function(data) {
                    var ohtml ='';
                        if(data.list) {
                        	if(!data.list.length){
								if(!(data.list instanceof Array)) {
									ohtml += '<tr Id="'+ data.list.Id +'"><td><input class="singleCos" type="checkbox"></td><td><a href="../../'+ data.list.Path +'"><img src="images/a_other.png" alt="'+ data.list.Name +'" title="'+ data.list.Name +'" width="35" height="35"></a></td><td><p style="width:100px;word-break: break-all;"><a href="../../'+ data.list.Path +'" target="_blank">'+ data.list.Name +'</a></p></td><td>'+ data.list.SuffixName +'</td><td>'+ Base.formatSize(data.list.Size) +'</td><td>'+ data.list.Time +'</td><td>'+ data.list.UserName +'</td><td><a class="editRes" data-target="#resClassModal" data-toggle="modal"><i class="glyphicon glyphicon-pencil" title="编辑"></i></a>&nbsp;<a><i class="one-del-addSrc glyphicon glyphicon-trash" title="删除"></i></a></td></tr>';
								} else {
									ohtml += '<tr><td colspan="8" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
								}
                        	}
                        	if(data.list.length){
                        		for(var i=0; i < data.list.length; i++) {
                                    ohtml += '<tr Id="'+ data.list[i].Id +'"><td><input class="singleCos" type="checkbox"></td><td><a href="../../'+ data.list[i].Path +'"><img src="images/a_other.png" alt="'+ data.list[i].Name +'" title="'+ data.list[i].Name +'" width="35" height="35"></a></td><td><p style="width:100px;word-break: break-all;"><a href="../../'+ data.list[i].Path +'" target="_blank">'+ data.list[i].Name +'</a></p></td><td>'+ data.list[i].SuffixName +'</td><td>'+ Base.formatSize(data.list[i].Size) +'</td><td>'+ data.list[i].Time +'</td><td>'+ data.list[i].UserName +'</td><td><a class="editRes" data-target="#resClassModal" data-toggle="modal"><i class="glyphicon glyphicon-pencil" title="编辑"></i></a>&nbsp;<a><i class="one-del-addSrc glyphicon glyphicon-trash" title="删除"></i></a></td></tr>';
                                }
                        	}
                            $('tbody').html(ohtml);
                    		icheckInit();
                            $('#itemContainer').empty();
                        }else {
                            ohtml += '<tr><td colspan="8" style="text-align:center;"><i class="glyphicon glyphicon-warning-sign"></i>&nbsp;&nbsp;当前纪录为空！</td></tr>';
                            $('tbody').empty().html(ohtml);
                            $('#itemContainer').empty();
                        }
                 
            }
        });
    }
	

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
        /*
			黄世鹏
			修改：接口重构，pageListClasses改为listClasses，参数mode改为m
		 */
		url: "../../classes/listClasses?m=9&pageSize=1000",
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
                    //if(i == 0) {
                        fileNumLimit = 10;
                    //}else {
                    //    fileNumLimit = 1;
                    //}
                    resetUploader(i, fileNumLimit);
                }
            });

			if (treeNode) {
                pageNo=1;
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
		url: "../../classes/listClasses?m=9&pageSize=1000",
		autoParam: ["id"],
		dataFilter: ajaxDataFilter
	},
	callback: {
		onClick: ZTreeClassClick,
		beforeClick: zTreeBeforeClick,
		onAsyncSuccess: zTreeOnAsyncSuccess
	}
}
var classSourcesetting = {
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
		name: "CodeDesc"
	  }
	},
	async: {
	  enable: true,
	  url: "../../ConfigMode/getValueByCodeType?codeType=resource_type",
	  autoParam: ["id"],
	  dataFilter: function (treeId, parentNode, responseData) {
		if (responseData) {
			responseData.CodeMaster.push({
				Id: 1,
				ParentId: 0,
				CodeDesc: "资源类别",
				open: true
			});
			return responseData.CodeMaster;
		}
		return responseData;
	}
	},
	callback: {
		onClick: function(e, treeId, treeNode){
			var zTree = $.fn.zTree.getZTreeObj(treeId);
			Nodes = zTree.getSelectedNodes();
			$('#editClassSourceModel [name=treeName]').val(Nodes[0].CodeDesc);
			$('#editClassSourceModel [name=treeId]').val(Nodes[0].Id);
		}
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
							$('.srcMid2').empty().show();
                            $('.srcRight').empty().show();
                            $('.srcEmpty').hide();

                            for(var i=0; i<data.result.list.length; i++) {
                                var html ='',
                                    htmlOther = '';
                                /*
                                    黄世鹏，
                                    修改：后台接口重构，将返回的参数名第一个字母大写
                                */
                                for(var j=0; j<data.result.list[i].WxappmsgDetails.length; j++) {
                                    if(j) {//>0
                                        htmlOther += '<div><div class="innerSrcCtn"><p class="innerTitle" title="'+ (data.result.list[i].WxappmsgDetails[j].Title || '') +'">'+ Base.addDots((data.result.list[i].WxappmsgDetails[j].Title || ''), 14) +'</p><img class="innerImg" src="'+ (data.result.list[i].WxappmsgDetails[j].ImgUrl || '') +'"></div>';
                                    }
                                }

                                html = '<div class="imgSrcCtn" id="'+ data.result.list[i].Id +'" style="width: auto;"><div style="position: relative" class="outerSrcCtn"><div style="width:100%;height:30px;background-color:rgba(52, 52, 52, .7);position:absolute;bottom:0"><p style="color: #fff" class="outerTitle" title="'+ (data.result.list[i].WxappmsgDetails[0].Title || '') +'">'+(data.result.list[i].WxappmsgDetails[0].Title || '') +'</p></div><p style="text-indent: 0" class="timeStr">'+ data.result.list[i].TimeStr +'</p><img class="outerImg" src="'+ (data.result.list[i].WxappmsgDetails[0].ImgUrl || '') +'"></div>'+ htmlOther +'<div style="position: absolute; left: 0; bottom: 0; width: 100%; height: 40px; background: #F5F5F5;"></div><div class="srcEditCtn"><a href="imgTexts.html?id='+ data.result.list[i].Id +'" data-num="0" data-name="新建图文消息"><i class="editPic glyphicon glyphicon-pencil col-md-6" title="编辑" style="cursor: pointer; width: 50%;"></i></a><i class="one-del-pic glyphicon glyphicon-trash col-md-6" title="删除" style="cursor: pointer;color: #337ab7;"></i></div></div>';

                                switch(i%4) {
                                    case 0:
                                        $('.srcLeft').append(html);
                                        break;
                                    case 1:
                                        $('.srcMid').append(html);
                                        break;
                                    case 2:
                                        $('.srcRight').append(html);
                                        break;
                                    case 3:
                                        $('.srcMid2').append(html);
                                        break;
                                }
                            }

                            var options = {
                                data: [data, 'list', 'total'],
                                currentPage: data.result.currentPage,
                                totalPages: data.result.totlePages ? data.result.totlePages : 1,
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

            //document.location.href = 'imgTexts.html?id='+ id;
        });

        //删除
        // taskid=454
        // 原因：删除图文素材，弹出误操作提示框
        // 修改：添加公共提示弹出框
        var $imgSrcCtn ='';
        $('body').on('click', '.one-del-pic', function() {
          $imgSrcCtn = $(this).parents('.imgSrcCtn');
          $(this).adcCreator(delPic, function(obj) {
            if($(obj).is('.mult-del')) {
                return false;
            }
            return true;
          },{content:'确定要删除您所选的图文?',title:'确认删除?'});
        });

        // 删除图片接口
        function delPic() {
            var id = $imgSrcCtn.attr('Id');
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
        }

        //添加新图文
        $('.newPic').on('click', function() {
            return
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
            //document.location.href = 'imgTexts.html';
        });
    };

    /*** 初始化对应的页面 ***/
    var href = this.location.href,
        page = href.match(/\/([a-zA-Z]+)(_[a-zA-Z\d]*)*\.html/)[1];
    page = page.replace(/[a-zA-Z]/, page.substr(0, 1).toUpperCase());
    eval(page +'()');
});
