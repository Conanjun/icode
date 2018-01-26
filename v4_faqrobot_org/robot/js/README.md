# minichat.js 使用介绍
1. 基本框架
2. 插件概况及使用方法
***
### 更新记录(# 代表本次更新标识)
* 2016/12/12 韩文博 (#1)
### 1. 基本框架
	;(function() {// 匿名函数，防止污染
		// jQuery v1.11.3
		var MN = jQuery.noConflict();// 避免jQuery版本冲突()
	    var $ = jQuery.noConflict();// 重新定义$
		// jQuery Mousewheel 3.1.13
		// layer-v2.1
		// iCheck v1.0.2
		// base.js v-1.2.0
		// jquery.scrollbar.js
		// jquery.dragMove.js
		// jquery.autocomplete.js
		// jquery.face.js
		// 多图预览上传组件
		// jquery.faqrobot.js v1.2.0
	});
### 2. 插件概况及使用方法
* ##### jquery.autocomplete.js
	* ###### 功能介绍
		1. 自动补全插件
		2. 兼容手机端
		4. 支持跨域
		5. 选择文字回调
		6. 条数可自定义
		7. 匹配内容高亮显示 (#1)
	* ###### 调用示例  
			$('.textarea').autocomplete({
		        url: '../../servlet/AQ?s=ig',//[string]
		        targetEl: $('.editShow'),//参照物(用于appendTo和定位)
		        posAttr: ['0rem', '0.133rem'],//外边框的定位[left bottom]
		        itemNum: 5,//[int] 默认全部显示
		        callback: function(data) {//获取文本后的回调函数
		            $('.sendBtn').trigger('click');
		        }
		    });
* ##### jquery.face.js
	* ###### 功能介绍
		1. 表情插件
		2. 兼容手机端
		3. 列数可自定义
		4. 广告信息
		5. 获取表情符回调
		6. 目前支持3套表情
			* 云问表情17个
			* 当当表情30个
			* 旺旺表情40个
	* ###### 调用示例  
			var Face = $('.textarea').face({
		        src: 'src/yun/',//表情路径
		        rowNum: 7,//每行最多显示数量，此属性不适用于常用语
		        ctnAttr: ['0rem', '0rem', '0.133rem', '0.122rem'],//[left bottom width height] 表情框相对targetEl位置和里面的表情格子宽高  要写单位
		        triggerEl: $('.faceBtn'),//触发按钮(不存在则自己生成，不要由a包裹)
		        targetEl: $('.editHide'),//父级参照物(用于appendTo和定位)
		        hideAdv: true,//是否隐藏广告
		        callback: function() {
		            $('.editHide').hide();
		            $('.sendBtn').show().siblings().hide();
		            $('.textarea').focus();
		        },
		    });
* ##### jquery.scrollbar.js  
	* ###### 功能介绍
		1. 美化滚动条插件
		2. 兼容手机端，pc端拖动滚动条或滚动鼠标滚轮，手机端上、下滑动
		3. 需要一个高度可变的子级和一个高度固定的父级
		4. 样式可自定义
		5. 子级内容改变，默认自动滚动到底部（也可取消自动滚动）
		6. 可缓慢滚动至底部，也可瞬间滚动至底部 (#1)
		7. 滚动条样式内嵌进js中 (#1)
		8. 滚动过程中和停止时的事件回调 (#1)
	* ###### 调用示例  
			var scrollbar = $('xxx').parent().scrollbar({
				autoBottom: true,//内容改变，是否自动滚动到底部
	            callback: function(curPos, delta) {},//滚动时事件回调
			});
* ##### jquery.faqrobot.js
	* ###### 功能介绍 

		1. 此插件为minichat.js的核心插件，包含聊天页面的**基础功能**和**拓展功能**
		2. 基础功能
			* 用户问问题，机器人回答
			* 自动补全及条数自定义
			* 常见、热门问题
			* 新增问题
			* 推荐问题
			* 快捷服务
			* 问题满意度评价
			* 服务满意度评价
			* 剩余字数统计
			* 支持跨域
			* 用户和机器人结构可自定义
			* 时间格式可自定义
			* 输入框提示语
			* 快捷关闭页面
			* 公司水印
		3. 拓展功能
			* 上传文件
			* 留言
			* 表情
			* 星座分析
			* 显示天气
			* 自动上、下线
			* 图片放大预览
			* 初始化信息回调
			* 发送信息回调
			* 服务满意度评价回调
			* 留言回调
			* 美化滚动条
			* 兼容手机端
			* 查看聊天记录 (#1)
			* 智能搜索 (#1)
	* ###### 调用示例

			var FAQ = new Faqrobot({
		        //sysNum: 1000000,//客户唯一标识
		        //jid: 0,//自定义客服客户图标
		        //robotName: 'FaqRobot',//机器人名称
		        logoUrl: 'skin/dang/images/logo@2x.png',//logo地址 ----------
		        logoId: 'logo',// ----------
		        webNameId: 'MN_logoWord',//公司名称Id
		        //userInfoId: 'userInfoId',//用户信息Id
		        kfPic: 'skin/dang/images/robot.png',  //客服图标
		        khPic: 'skin/dang/images/user.png', //客户图标
		        formatDate: '%month%月%date%日 %hour%:%minute%:%second%',//配置时间格式(默认10:42:52 2016-06-24)
		        topQueId: 'commonQueLayer',//热门、常见问题Id --------
		        //newQueId: 'newQueId',//新增问题Id
		        //recommendQueId: 'recommendQueId',//推荐问题Id
		        //quickServId: 'MN_quickServer',//快捷服务Id
		        //recommendLinkId: 'recommendLinkId',//推荐咨询Id
		        //maxQueNum: 100,//最多展示问题条数
		        //maxQueLen: 100,//最多展示问题字数
		        //showMsgId: 'showMsgId',//展示信息Id
		        chatCtnId: 'chatCtn',//聊天展示Id y   --------------
		        inputCtnId: 'textarea',//输入框Id y   --------
		        sendBtnId: 'sendBtn',//发送按钮Id y   ------
		        //tipWordId: 'tipWord',//输入框提示语Id ----
		        //tipWord: '请输入您要咨询的问题',//输入框提示语
		        //remainWordId: 'MN_remainWordNum',
		        //remainWordNum: '100',
		        upFileModule: {//上传文件模块
		            open: true,//是否启用功能
		            maxNum: 2,//最大上传数量，0为不限制
		            triggerId: 'sendPic',//触发上传按钮
		            startcall: function() {//上传文件前的回调
		                set_chatScroll_height();
		            },
		            callback: function() {//上传文件后的回调
		            },
		        },
		        commentFormId: 'feedbackForm',//评论框formId -------
		        commentInputCtnId: 'commentCtn',//评论输入框Id ----
		        commentSendBtnId: 'commentBtn',//评论发送按钮Id ---------
		        //commentTipWordId: 'MN_commentTip',//评论输入框提示语Id
		        //commentTipWord: '描述您的意见和建议，以便我们提升服务水平和质量，谢谢您',//评论输入框提示语
		        leaveMsgFormId: 'leaveMsgForm',//留言框formId ---------
		        leaveMsgInputCtnId: 'leaveMsgCtn',//留言输入框Id ---------
		        leaveMsgSendBtnId: 'leaveMsgBtn',//留言发送按钮Id --------
		        //leaveMsgTipWordId: 'leaveMsgTipWordId',//留言输入框提示语Id
		        //leaveMsgTipWord: '输入您的建议，我们会尽快为您处理！',//留言输入框提示语
		
		        //clearBtnId: 'MN_clearBtn',//清除按钮Id
		        //closeBtnId: 'closeBtnId',//关闭聊天页面
		        //poweredCtnId: 'poweredCtnId',//技术支持Id
		        //thirdUrl: '',//未登录第三方账户，跳转至此链接
		        sourceId: 3,//客户来源
		        //ajaxType: 'post',
		        autoOffline: false,//是否会自动下线
		        faceModule: {//表情模块
		            open: true,//是否启用功能
		            faceObj: Face,//表情插件实例
		        },
		        weatherModule: {//天气模块
		            open: true,//是否启用功能
		            triggerId: 'checkCloud',//触发天气按钮
		        },
		        noView: ['.MN_kfImg', '.MN_khImg'],//数组内的图片禁用放大预览
		        sendCallback: function() {//点击发送按钮的回调
		            $('.addbtn').show().siblings().hide();
		        },
		        commentCallback: function(data) {//评论后的回调
		            layer.close(layerCtn);
		            if(!data.status) {
		                if(+$('[name=level]:checked').val()) {//满意
		                    layer.msg('能帮到您小当好开心的呢，我会继续努力的哦^_^', {
		                        area: '0.8rem'
		                    });
		                }else {
		                    layer.msg('没有让您满意小当感到万分心痛，我会继续学习~', {
		                        area: '0.8rem'
		                    });
		                }
		            }
		        },
		        leaveMsgCallback: function() {//留言后的回调
		            layer.close(layerCtn);
		        },
		    });


