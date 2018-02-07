window.ichecklock = true;
;$(function() {
    var ifT = iframeTab.init({iframeBox: ''});
	var This = this;
	
	//iCheck
	$('input').iCheck({
		radioClass : 'iradio_flat-grey',
		checkboxClass : 'icheckbox_flat-grey',
	});



	//预定义
	var $current = $('.msgBtn-first'),
		preUrl = '../../',
		whole = this;

	//如果id存在，则渲染数据
	var search = whole.location.search,
		id = search.match(/id=(\d+)/);

	//iTitle
	var $input1 = $('#iTitle'),
		$tip1 = $('.iTitle-ctn label'),
		$word1 = $('.iTitle-ctn span');
	//iAuthor
	var $input2 = $('#iAuthor'),
		$tip2 = $('.iAuthor-ctn label'),
		$word2 = $('.iAuthor-ctn span');
	//abstract
	var $input3 = $('#abstract'),
		$word3 = $('.abstract-ctn .remainWords3');

	//判断类型
	var isIE = false,
		browser = myBrowser();

	if (browser == "IE") {
	    isIE = true;
	    $tip1.show();
	    $tip2.show();
	}else {
	    isIE = false;
	    $tip1.hide();
	    $tip2.hide();
	}

	/*********ueditor*********/

	icheckInit();

	//ueditor
	var ueditor = UE.getEditor('mid-head', {
		/*toolbars: [[
            'undo', 'redo', '|',
            'fontsize', '|', 
            'blockquote', 'horizontal', '|',
            'removeformat', 'formatmatch',
            'bold', 'italic', 'underline','forecolor', 'backcolor',
            'indent', 'link', 'unlink', '|',
            'simpleupload', 'insertimage', 'insertvideo', 'music', '|',
            'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
            'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
            'insertorderedlist', 'insertunorderedlist', '|',
            'imagenone', 'imageleft', 'imageright', 'imagecenter'
        ]],*/
		initialFrameHeight: 300,
		wordCount: true,
		maximumWords: 10000,
		initialContent: '从这里开始写正文',
        autoClearinitialContent: true,
		zIndex: 190,
	});

	ueditor.addListener('ready', function( editor ) {//ueditor准备就绪
		$(document).trigger('keyup');

		//如果id存在，则渲染数据
		if(id) {
			$tip1.hide();
			$tip2.hide();
			id = parseInt(id[1]);
			/*
				黄世鹏
				修改：后台接口重构，第一个参数改为大写
			 */
			Base.request({
			    url: 'Wxappmsg/findById',
			    params: {
			    	id: id,
			    },
			    callback: function(data) {
			    	if(data.status) {
                        Base.gritter(data.message, false);
                    }

			    	if(!data.result) {
			    		return;
			    	}

			    	if(!data.result.wxappmsg) {
			    		return;
			    	}

			    	window.ichecklock = false;
			    	for(var i=0; i<data.result.wxappmsg.Count; i++) {
			    		$('.msg-ctn').children(':not(.msgBtn-last)').each(function(j) {
			    			var curData = data.result.wxappmsg.WxappmsgDetails[j],
			    				linkLock = 0;

			    			if(curData.Sourceurl) {
								linkLock = 1;
			    			}

			    			$(this).data({
			    				title: curData.Title,
			    				author: curData.Author,
			    				content: curData.Content,
			    				linkLock: linkLock,//
			    				linkUrl: curData.Sourceurl,
			    				wordNum1: curData.Title.length,
			    				wordNum2: curData.Title.length,
			    				wordNum3: 0,
			    				coverLock: curData.ShowPic,
			    				coverHtml: '<img src="'+ curData.ImgUrl +'">',
			    				coverImg: curData.ImgUrl,
			    			});

							showData($(this));
			    		});
			    		if(i < data.result.wxappmsg.Count-1) {
			    			$('.msgBtn-last').trigger('click');
			    		}
			    	}
			    	window.ichecklock = true;
					if($('.msgBtn-last').prev().length) {
						$('.msgBtn-last').prev().trigger('click');
					}
			    },
			});
		}
	});

	ueditor.addListener('selectionchange',function(){//ueditor内容改变
		//$('.iCtx-ctn').height($('#edui1_iframeholder').height());
		bindData($current);

	});

	/*********WebUploader*********/
	
	//上传文件
	var uploader = WebUploader.create({
		//自动上传
		auto: true,
		//swf文件路径
		swf: 'js/Uploader.swf',
		//文件接收接口
		server: preUrl +'material/jQueryFileUpload?type=1'+'&materialType=1',
		//选择文件按钮
		pick: '.localLoad',
		duplicate:true
	});
	
	//加入上传队列
	uploader.on( 'fileQueued', function( file ) {
		$('.cover-ctx').show().find('.cover').empty();

		var str = '<div id="'+ file.id +'"><span class="fileName">'+ file.name +'</span><div class="progress"><span class="progress-bar"></span></div></div>';

		$('.cover').append(str);

		$img = $('#'+ file.id).find('img');
	});

   	//显示进度条
	uploader.on( 'uploadProgress', function( file, percentage ) {
		var $li = $( '#'+ file.id ),
			$percent = $li.find('.progress-bar');

		$percent.css( 'width', percentage*100 +'%' );
	});
	
	//上传成功
	uploader.on( 'uploadSuccess', function( file, response ) {
		var errorMsg = response['files'][0]['error'];
		if(errorMsg) {
			$('.cover-ctx').show().find('.cover').empty();
			Base.gritter(errorMsg, false);
		}else {
			$('.cover').empty().append('<img src="'+ response['files'][0]['url'] +'" />');
			bindData($current);
			showData($current);
		}

	});


	/*********操作左侧栏->上移、下移、删除*********/

	

	//初始化
	setIndex($('.msg-ctn'));//赋下标值
	setCurrentStyle($current);//设置当前样式


	//是否添加原文链接
	$('#linkBtn').on('ifChanged', function() {
		var This = $(this);
		if(This.prop('checked')) {
			This.attr({'index': '1'});
		}else {
			This.attr({'index': '0'});
			$('.link').val('');
		}
		bindData($current);
		showData($current);
	});

	//切换当前
	$('.msg-ctn').on('click', '.msgBtn-first, .msgBtn', function() {
		bindData($current);

		$current = $(this);
		setCurrentStyle($current);//设置当前样式

		window.ichecklock = false;
		showData($current);//展示数据
		window.ichecklock = true;
		$(document).trigger('keyup');
	});

	//增加列表
	$('.msgBtn-last').on('click', function() {
		setIndex($('.msg-ctn'));
		var index = ~~$(this).prev().attr('index');

		$(this).before(getString($(this), index));
		$(this).siblings().find('.cDown').show();
		$(this).prev().find('.cDown').hide();

		$current = $(this).prev();
		setCurrentStyle($current);//设置当前样式

		emptyData();
		bindData($current);
		showData($current);

		$(document).trigger('keyup');
	});

	//删除列表->事件委托
	$('.msg-ctn').on('click', '.cDelete', function() {
		var $current = $(this).parents('.msgBtn');

		$current.trigger('click');
		$current.remove();
		emptyData();

		setIndex($('.msg-ctn'));
		$('.msgBtn-last').show().prev().find('.cDown').hide();
	});

	//交换列表->事件委托
	$('.msg-ctn').on('click', '.cUp, .cDown', function() {
		


	});


	





	

	
	/************************/

	//键盘事件
	$(document).on('keyup', function() {
		remainWord($input1, $tip1, $word1);
		remainWord($input2, $tip2, $word2);
		remainWord($input3, '', $word3);

		bindData($current);
		showData($current);

	});

	//鼠标事件
	$input1.on('focus blur', function(e) {
		if(isIE && !$(this).val()) {
			if(e.type == 'focus') {
				$tip1.hide();
			}else {
				$tip1.show();
			}
		}
	});
	$input2.on('focus blur', function(e) {
		if(isIE && !$(this).val()) {
			if(e.type == 'focus') {
				$tip2.hide();
			}else {
				$tip2.show();
			}
		}
	});

	/************************/

	var cosImgSource = [],//图片
		cosVideoSource = '',//视频
		cosAudioSource = '',//音频
		imgLock;//图片锁

	//图片框
	$('.btn-img').on('click', function() {//右边
		imgLock = true;
		showPop($('.pic-ctx'), true);
	});

	$('.cosImage').on('click', function() {//左边
		imgLock = false;
		showPop($('.pic-ctx'), true);

	});

	//视频框
	$('.btn-video').on('click', function() {

		showPop($('.video-ctx'), true);
	});

	//音频框
	$('.btn-audio').on('click', function() {
		showPop($('.audio-ctx'), true);
	});

	//关闭弹窗
	$('.popup .head i').add('.cancel').on('click', function() {
		emptyChoose(cosImgSource);
		emptyChoose(cosVideoSource);
		emptyChoose(cosAudioSource);

		showPop('', false);
	});

	//选取图片素材
	$('.pic-ctx').on('click', '.show', function() {
		var $mask = $(this).find('.w-mask'),
			imgStr = $(this).find('img').clone()[0].outerHTML,
			onoff;

		if(!imgLock) {
			$('.w-mask').remove();
		}

		if($mask[0]) {//已被标记
			onoff = false;//删
			$(this).find('.w-mask').remove();
		}else {
			onoff = true;//增
			$(this).append('<span class="w-mask"><i class="w-masked"></i><i class="w-mark"></i><span>');
		}

		addSource(cosImgSource, imgStr, onoff, imgLock);

		
	});

	//选取视频素材
	$('.video-ctx').on('click', '.show', function() {
		var $img = $(this).find('img').clone().css({'width': 150});

		$('.w-mask').remove();
		$(this).append('<span class="w-mask"><i class="w-masked"></i><i class="w-mark"></i><span>');

		cosVideoSource = '<a href="/'+ $img.attr('path') +'">'+ '<img src="'+$img.attr('src')+'">' +'</a>';

		
	});

	//选择语音素材
	$('.audio-ctx').on('ifChecked', 'input', function() {
		var $show = $(this).parents('.show'),
			$title = $show.find('.title'),
			$i = $show.find('i');

		cosAudioSource = '<a href="/'+ $title.attr('path') +'"><img src="'+ $i.css('backgroundImage').match(/url\("(.+)"\)/)[1] +'" style="width: 150px;"></a>';
	});

	//确认选取图片
	$('.confirm-pic').on('click', function() {
		var str = srcToString(cosImgSource);

		if(!str) {//未选取
	        Base.gritter('请选取图片素材', false);
			return;
		}

		if(imgLock) {
			ueditor.focus();
			ueditor.setContent(str, true);
		}else {
			$('.cover-ctx').show().children('.cover').empty().append(str);
		}

		bindData($current);
		showData($current);

		$('.popup').hide();
	});

	//确认选取视频
	$('.confirm-video').on('click', function() {
		imgLock = false;

		if(!cosVideoSource) {//未选取
	        Base.gritter('请选取视频素材', false);
			return;
		}
			
		ueditor.focus();
		ueditor.setContent(cosVideoSource, true);

		bindData($current);
		showData($current);

		$('.popup').hide();
	});

	//确认选取音频
	$('.confirm-audio').on('click', function() {
		imgLock = false;

		if(!cosAudioSource) {//未选取
	        Base.gritter('请选取音频素材', false);
			return;
		}

		ueditor.focus();
		ueditor.setContent(cosAudioSource, true);

		bindData($current);
		showData($current);
		
		$('.popup').hide();
	});

	//是否显示正文中
	$('#coverBtn').on('ifChanged', function() {
		var This = $(this);
		if(This.prop('checked')) {
			This.attr({'index': '1'});
		}else {
			This.attr({'index': '0'});
		}
	});
	//$('#coverBtn').iCheck('check');
	//$('#coverBtn').iCheck('uncheck');

	//删除封面
	$('.vDelete').on('click', function() {
		$('.cover').empty().parent().hide();

		bindData($current);
		showData($current);
	});

	//保存
	$('.save').on('click', function() {
		/*
			taskid=610,黄世鹏
			修改原因：保存时，上传给后台的图片是ueditor自带的loading图片，导致加载出的是loading图片
			修改逻辑：在点击保存的时候先调用bindData($current)方法，更新保存内容
		 */
		bindData($current);		
		if(valid($('.msg-ctn'))) {
			showPop($('.release-ctx'), true);
		}
	});

	//清空
	$('.clear').on('click', function() {
		showPop($('.clear-ctx'), true);

	});

	//确认清空
	$('.confirm-clear').on('click', function() {
		$('.msg-ctn').children(':not(.msgBtn-last)').each(function() {
			var $cur = $(this).data();
			$.each($cur, function(key, val) {
				$cur[key] = '';
				if(key == 'title') {
					$cur[key] = '标题';
				}
				if(key == 'coverImg') {
					$cur[key] = 'images/space.png';
				}
			});
			showData($(this));
		});
		$('.popup').hide();
	});

	//最终提交
	$('.confirm-release').on('click', function() {
		var $msgBtns = $('.msgBtn-first').add('.msgBtn'),
			html = '';

		$msgBtns.each(function() {
			$.each($(this).data(), function(key, val) {
				if(key == 'title') {//标题
					html += '<input name="title" value="'+ val +'">';
				}
				if(key == 'author') {//作者
					html += '<input name="author" value="'+ val +'">';
				}
				if(key == 'abstract') {//摘要
					html += '<input name="digest" value="'+ val +'">';
				}
				if(key == 'coverLock') {//是否显示图片
					html += '<input name="showPic" value="'+ val +'">';
				}
				if(key == 'coverImg') {//图片链接
					html += '<input name="imgURL" value="'+ val +'">';
				}
				if(key == 'content') {//正文
					html += '<input name="content" value="'+ val.replace(/\"/g, '\'') +'">';
				}
				if(key == 'linkUrl') {//链接
					html += '<input name="sourceurl" value="'+ val +'">';
				}
			});
		});

		html += '<input name="count" value="'+ $msgBtns.length +'"><input name="subType" value="3">';

		$('#submitDetail').empty().append(html);

		var suffix = '';
		if(id) {
			suffix = '?id='+ id;
		}

		$.ajax({
		    url: encodeURI('../../wxappmsgDetail/submitDetail'+ suffix),
		    type: 'post',
		    data: $('#submitDetail').serialize(),
		    cache: false,
		    success: function(data) {
		    	if(data.status) {
	        		Base.gritter(data.message, false);
		    	}else {
		    		$.gritter.add({
                        title: "提醒",
                        text: data.message,
                        time: 1500,
                        after_close: function() {
            	            var $document = $(window.parent.document),
            	                $this = null;
            	            $('.childLink', $document).each(function() {
            	                if($(this).attr('href') == '#material/menuList') {
            	                    $this = $(this);
            	                }
            	            });

            	            /*$('li', $document).removeClass('active');
            				if($this) {
            	            	$this.parents('li').addClass('active');
							}
                    		document.location.href = 'menuList.html';*/
                    		ifT.closeActIframe();
                        },
                    });
		    	}
		    }
		});

		$('.popup').hide();
		/*$('.noty').noty({
			text: '提交成功',
		});*/
	});


	/*********对接工作*********/

	var typeNum = 0,//当前请求类型
		currentPage = 0,//当前页
		totlePages = 0;//总页数

	/*//上一页
	$('.prevPage').parent().on('click', function() {
		changePage(typeNum, currentPage, totlePages, false);
	});

	//下一页
	$('.nextPage').parent().on('click', function() {
		changePage(typeNum, currentPage, totlePages, true);
	});

	//跳转
	$('.pageGo').on('click', function() {
		var reg = new RegExp('^[0-9]*[1-9][0-9]*$'),
			str = ~~$(this).prev().val();

		if(reg.test(str) && str<=totlePages) {
			request('material/list', {type: typeNum, pageSize: 10, pageNo: ~~str});
		}else {
			Base.gritter('请输入正确的页码', false);
		}
	});*/

	//选取图片
	$('.btn-img').add('.cosImage').on('click', function() {
		cosImgSource = [];
		typeNum = 1;
		request('material/list', {type: typeNum, pageSize: 10, pageNo: 1});
	});

	//选取视频
	$('.btn-video').on('click', function() {
		typeNum = 3;
		request('material/list', {type: typeNum, pageSize: 10, pageNo: 1});
	});

	//选取音频
	$('.btn-audio').on('click', function() {
		typeNum = 2;
		request('material/list', {type: typeNum, pageSize: 10, pageNo: 1});
	});

	// 限制字数
	$('#iTitle').on('input propertychange', function() {
		if($(this).val().length > 64) {
			$(this).val($(this).val().substr(0, 64));
		}
	});
	// 限制字数
	$('#iAuthor').on('input propertychange', function() {
		if($(this).val().length > 8) {
			$(this).val($(this).val().substr(0, 8));
		}
	});
 


	/************************/

	/*//改变页码
	function changePage(typeNum, curNum, maxNum, bool) {
		if(bool) {//下一页
			if(curNum < maxNum) {
				request('material/list', {type: typeNum, pageSize: 10, pageNo: currentPage+1});
			}
		}else {
			if(curNum > 1) {
				request('material/list', {type: typeNum, pageSize: 10, pageNo: currentPage-1});
			}
		}
	}*/

	//数据实例化
	function getData(num, data) {

		var len = data['list'];

		if(!len) {
			return;
		}
		len = len.length;

		var $ctn = null,
			str = '';

		currentPage = data['currentPage'];
		totlePages = data['totlePages'];

		//处理页码
		var $page = $('.pageNum label');

		$page.eq(0).text(currentPage);
		$page.eq(1).text(totlePages);

		if(num == 1) {//图片
			$ctn = $('.pic-ctx .bodyMiddle');
			$ctn.empty();

			for(var i=0; i<len; i++) {
				str += '<div class="show"><img src="" ><div class="nameCtn"><p class="name"></p></div></div>';
			}
			$ctn.append(str);

			$.each($('img', $ctn), function(i) {
				$(this).data(data['list'][i]);

				$(this).attr({'src': window.location.protocol + "//" + (window.location.host + localStorage.getItem('Subdomain')||"") +'/'+ $(this).data('Path')});
				$(this).next().find('.name').text($(this).data('Name'));
			});

		}else if(num == 2) {//音频
			$('.audio-ctx .bodyMiddle').empty();

			for(var i=0; i<len; i++) {
				str += '<div class="show"><label for="audio'+ i +'"><input id="audio'+ i +'" type="radio" name="audioGroup"><p class="title" path="'+ data.list[i].Path +'">'+ data.list[i].Name +'</p><p class="time">'+ data.list[i].Time +'</p><p class="duration">'+ data.list[i].Size +'</p><i></i></label></div>';
			}

			$('.audio-ctx .bodyMiddle').append(str);

			//iCheck
			$('input').iCheck({
				radioClass : 'iradio_flat-grey',
			});
			$('.audio-ctx .bodyMiddle-ctn').slimScroll({
				height: '415px'
			});
		}else {//视频
			$('.video-ctx .showLeft').empty();
			$('.video-ctx .showRight').empty();

			for(var i=0; i<len; i++) {
				if(i%2) {//1
					$('.video-ctx .showRight').append('<div class="show"><p class="title">'+ data.list[i].Name +'</p><p class="time">'+ data.list[i].Time +'</p><div class="pic"><img src="images/video1.png" alt="" path="'+ data.list[i].Path +'"></div><p class="desc"></p></div>');
				}else {//0
					$('.video-ctx .showLeft').append('<div class="show"><p class="title">'+ data.list[i].Name +'</p><p class="time">'+ data.list[i].Time +'</p><div class="pic"><img src="images/video1.png" alt="" path="'+ data.list[i].Path +'"></div><p class="desc"></p></div>');
				}
			}
			$('.video-ctx .bodyMiddle-ctn').slimScroll({
				height: '415px'
			});
		}

		var options = {
            currentPage: data.currentPage,
            totalPages: data.totlePages ? data.totlePages : 1,
            alignment: 'right',
            onPageClicked: function(event, originalEvent, type, page) {
                //pageNo = page;
				request('material/list', {type: typeNum, pageSize: 10, pageNo: page});
            }
        };
        $('#itemContainer').bootstrapPaginator(options);
        $('#itemContainer2').bootstrapPaginator(options);
        $('#itemContainer3').bootstrapPaginator(options);
	}

	//请求
	function request(url, params, dataType) {
		var url = preUrl + url;

		$.ajax({
			url: encodeURI(url),
			dataType: dataType,
			data: params,
			cache: false,
			success: function(data) {
				if(data.status) {
					Base.gritter(data.message, false);
				}

				getData(typeNum, data);
				$('.pageNum span').prev().text(data.currentPage);
				$('.pageNum span').next().text(data.totlePages);
			},
			error:function() {
			}
		});
			
	}

	//保存验证
	function valid($obj) {
		var $childs = $obj.children(':not(".msgBtn-last")'),
			len = $childs.size(),
			onoff = true;

		/*if(len < 2) {
			notyMessage('请编辑至少2个图文');
			onoff = false;
			return false;
		}*/

		for(var i=0; i<len; i++) {
			var $cur = $childs.eq(i),
				title = $cur.data('title'),
				author = $cur.data('author'),
				content = $cur.data('content'),
				linkUrl = $cur.data('linkUrl'),
				coverHtml = $cur.data('coverHtml');

			if(!title || title=='标题' || title.length>64) {
				$cur.trigger('click');
				Base.gritter('标题不能为空且长度不超过64个字', false);
				onoff = false;
				break;
			}else if(author.length>8) {
				$cur.trigger('click');
				Base.gritter('作者长度不超过8个字', false);
				onoff = false;
				break;
			}else if(!content || content=='<p id="initContent">从这里开始写正文</p>') {
				$cur.trigger('click');
				Base.gritter('正文不能为空', false);
				onoff = false;
				break;
			}else if(linkUrl && !/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\*\+,;=]|:|@)|\/|\?)*)?$/i.test(linkUrl)) {
				$cur.trigger('click');
				Base.gritter('请输入完整的正确网址，例如 http://www.faqrobot.org', false);
				onoff = false;
				break;
			}else if(!coverHtml) {
				$cur.trigger('click');
				Base.gritter('需要插入封面', false);
				onoff = false;
				break;
			}
		}

		return onoff;
	}

	//错误信息
	function notyMessage(str) {
		$('.noty').noty({
			text: str,
			type: 'error'
		});
	}

	//被选资源转换为字符串
	function srcToString(arr) {
		var str = '';
		for(var i=0; i<arr.length; i++) {
			str += arr[i];
		}
		return str;
	}

	//增删被选资源
	function addSource(arr, str, bool1, bool2) {
		if(bool1) {//加
			if(!bool2) {
				arr.length = 0;
			}
			arr.push(str);
		}else {
			for(var i=0; i<arr.length; i++) {
				if(arr[i] == str) {
					arr.splice(i, 1);
					break;
				}
			}
		}
	}

	//清空被选资源
	function emptyChoose(arr) {
		$('.w-mask').remove();
		arr.length = 0;
	}

	//显示弹出框
	function showPop($obj, bool) {
		var $popup = $('.popup');

		if(bool) {//显示
			$popup.show();
			$obj.show().siblings(':not(.mask)').hide();
		}else {//隐藏
			$popup.hide();
		}
		
	}

	//设置当前的样式
	function setCurrentStyle($obj) {
		$obj.addClass('msgBtn-focus').siblings().removeClass('msgBtn-focus');

	}

	//清空数据
	function emptyData() {
		$('#iTitle').val('');
		$('#iAuthor').val('');
		ueditor.setContent('');
		$('#linkBtn').attr({'index': '0'});
		$('.link').val('');
		$('#abstract').val('');
		$('.remainWords1').text('0/64');
		$('.remainWords2').text('0/8');
		$('.remainWords3').text('0/120');
		$('#coverBtn').attr({'index': '0'});
		$('.cover').html('');
	}

	//绑定数据
	function bindData($obj) {
		var coverImg = 'images/space.png';
		if($('.cover').html()) {
			coverImg = $('.cover img').attr('src');
		}

		$obj.data({
			title: $('#iTitle').val() || '标题',
			author: $('#iAuthor').val(),
			content: ueditor.getContent(),
			linkLock: $('#linkBtn').attr('index'),
			linkUrl: $('.link').val(),
			abstract: $('#abstract').val(),
			wordNum1: $('.remainWords1').text().match(/\d+/g)[0],
			wordNum2: $('.remainWords2').text().match(/\d+/g)[0],
			wordNum3: $('.remainWords3').text().match(/\d+/g)[0],
			//coverTip: coverTip,
			coverLock: $('#coverBtn').attr('index'),
			coverHtml: $('.cover').html(),
			coverImg: coverImg,
		});
	}

	//展示数据
	function showData($obj) {
		//title
		var title = $obj.data('title');

		if(/^标题$/.test(title)) {
			title = '';
		}

		//link
		var linkLock = ~~$obj.data('linkLock'),
			linkUrl = $obj.data('linkUrl');
		if(linkLock) {//=1
			if(window.ichecklock) {
				$('#linkBtn').iCheck('check');
			}
		}else {//=0 || undefined
			if(window.ichecklock) {
				$('#linkBtn').iCheck('uncheck');
			}
			linkUrl = '';
		}

		//wordNum
		var wordNum1 = $obj.data('wordNum1') || 0,
			wordNum2 = $obj.data('wordNum2') || 0,
			wordNum3 = $obj.data('wordNum3') || 0;

		//coverTip
		var coverTip = '大图片建议尺寸：900像素 * 500像素';
		if($obj.is('.msgBtn')) {
			coverTip = '小图片建议尺寸：200像素 * 200像素';
		}

		//cover
		var coverLock = ~~$obj.data('coverLock'),
			coverHtml = $obj.data('coverHtml');
		if(coverLock) {//=1
			$('#coverBtn').iCheck('check');
		}else {
			$('#coverBtn').iCheck('uncheck');
		}

		if(coverHtml) {
			$('.cover-ctx').show();
		}else {
			$('.cover-ctx').hide();
		}


		$obj.find('.msgTitle').text($obj.data('title'));
		$('#iTitle').val(title);
		$('#iAuthor').val($obj.data('author'));
		ueditor.setContent($obj.data('content'));
		$('#linkBtn').attr({'index': linkLock});
		$('.link').val(linkUrl);
		$('#abstract').val($obj.data('abstract'));
		$('.remainWords1').text(wordNum1 + '/64');
		$('.remainWords2').text(wordNum2 + '/8');
		$('.remainWords3').text(wordNum3 + '/120');
		$('.cover-ctn .tip').text(coverTip);
		$('#coverBtn').attr({'index': coverLock});
		$('.cover').html($obj.data('coverHtml'));
		$('img', $obj).attr({'src': $obj.data('coverImg')});
	}

	//交换数据
	function changeData($obj) {
		var str = $obj.parents('.msgBtn')[0] ? '.msgBtn' : '.msgBtn-first',
			$parent =  $obj.parents(str),
			$other = null;

		if($obj.is('.cUp')) {//向上
			$other = $parent.prev();
		}else {//向下
			$other = $parent.next();
		}

		exchangeData($parent.data(), $other.data());//交换数据

		showData($parent);//显示数据
		showData($other);//显示数据


	}

	//对象值互换
	function exchangeData(obj1, obj2) {
	    var obj = JSON.stringify(obj2);

	    $.each(obj1, function(key, value) {
	        obj2[key] = value;
	    });

	    $.each(JSON.parse(obj), function(key, value) {
	        obj1[key] = value;
	    });
	}

	

	//检测下标返回字符串
	function getString($obj, num) {
		var str = '';

		if(num == 6) {
			str = 'style="display: none"';
			$obj.hide();
		}

		str = '<div class="msgBtn"><div class="msgBtn-ctn"><p class="msgTitle">标题</p><span class="img-ctn"><i></i><img src="" alt="" onerror="this.onerror=\'\'; this.src=\'images/space.png\'"></span></div><div class="cMask-ctn"><i class="cMask"></i><i class="cUp"></i><i class="cDown" '+ str +'></i><i class="cDelete"></i></div></div>';

		return str;
	}

	//设置当前下标
	function setIndex($obj) {
		var $childs = $obj.children(':not(".msgBtn-last")'),
			$firstChild = $childs.eq(0);

		if($childs.length == 1) {
			$firstChild.find('.cDown').hide();
		}else {
			$firstChild.find('.cDown').show();
		}

		$.each($childs, function(i) {
			$(this).attr({'index': i});
		});
	}

	//计算字数
	function remainWord($input, $tip, $word) {
		var nowNum = 0,
			maxNum = $word.text().match(/\d+/g)[1],
			word = $input.val(),
			len = word.toString().length;

		$word.text(len +'/'+ maxNum);

		if(len > maxNum) {
			$word.css({'color': 'red'});
		}else {
			$word.removeAttr('style');
		}
	}

	//判断浏览器类型
	function myBrowser(){
	    var userAgent = navigator.userAgent,
	    	isOpera = userAgent.indexOf("Opera") > -1;

	    if (isOpera) {
	        return "Opera";
	    };
	    if (userAgent.indexOf("Firefox") > -1) {
	        return "FF";
	    }
	    if (userAgent.indexOf("Chrome") > -1){
	  		return "Chrome";
	 	}
	    if (userAgent.indexOf("Safari") > -1) {
	        return "Safari";
	    }
	    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
	        return "IE";
	    };
	}


	









});

















































