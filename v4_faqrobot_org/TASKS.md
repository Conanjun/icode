## 项目整理

### 聊天页面(后台-张荣松)

1. 页面模板

	* [faqrobot1](http://v4.faqrobot.org/robot/faqrobot1.html?sysNum=1476067342641247)、[faqrobot2](http://v4.faqrobot.org/robot/faqrobot2.html?sysNum=1476067342641247)、[faqrobot3](http://v4.faqrobot.org/robot/faqrobot3.html?sysNum=1476067342641247)
		* 老版
		* pc端
	* [chat1](http://v4.faqrobot.org/robot/chat1.html?sysNum=1476067342641247)、[chat2](http://v4.faqrobot.org/robot/chat2.html?sysNum=1476067342641247)、[chat3](http://v4.faqrobot.org/robot/chat3.html?sysNum=1476067342641247)、[chat4](http://v4.faqrobot.org/robot/chat4.html?sysNum=1476067342641247)
		* 新版
		* pc端
		* chat1 包含语音转义、文字播报功能
		* chat2 包含文档搜索功能
	* [h5chat](http://v4.faqrobot.org/robot/h5chat.html?sysNum=1476067342641247)
		* 新版
		* 手机端
	
2. 单点客户页面
	
	* 钉钉
		* [引导页](http://demo.faqrobot.net/robot/ding_guide.html?corpid=ding9f5ac5896ef870df35c2f4657eb6378f)
		* [手机端聊天页面](http://demo.faqrobot.net/robot/ding.html?corpid=ding9f5ac5896ef870df35c2f4657eb6378f)

	* 无限极
		* app端聊天页面
			* [测试环境](https://robot-test.infinitus.com.cn/robot/infinitusApp.html?sysNum=3000000)
			* [准生产环境](https://robot-staging.infinitus.com.cn/robot/infinitusApp.html?sysNum=3000000)
			* [正式环境](https://robot.infinitus.com.cn/robot/infinitusApp.html?sysNum=3000000)
			* 请下载相应的[app](https://emcs-dev.infinitus.com.cn/front/emcs-server-newMobile/guest/quickResponseCode/list)进行测试
			* [README](file:///C:/Users/Administrator/Desktop/%E4%B8%B4%E6%97%B6%E6%96%87%E4%BB%B6/%E6%97%A0%E9%99%90%E6%9E%81app%E5%9C%A8%E7%BA%BF%E5%AE%A2%E6%9C%8D/%E6%96%87%E6%A1%A3/README.txt)

	* 当当
		* [客户pc端聊天页面](http://v4.faqrobot.org/robot/robotDD.html?sysNum=1476067342641247)
		* [员工pc端聊天页面](http://v4.faqrobot.org/robot/robotDDi.html?sysNum=1476067342641247)
		* [迷你pc端聊天页面](http://v4.faqrobot.org/robot/dangpc.html?sysNum=1476067342641247)
		* [手机端聊天页面](http://v4.faqrobot.org/robot/dang.html?sysNum=1476067342641247)

	* 小如
		* [pc端聊天页面](http://wkf.homeinns.com/robot/rujia.html?sysNum=139577692477010)
		* [手机端聊天页面](http://wkf.homeinns.com/robot/mobileRujia.html?sysNum=139577692477010)

	* 华住
		* [引导页](http://v4.faqrobot.org/robot/huazhu_guide.html?sysNum=1476067342641247)
		* [客户手机端聊天页面](http://hxr.huazhu.com/robot/hxr/mobileRobot.html?sysNum=1476067354706249)
		* [员工手机端聊天页面](http://hxr.huazhu.com/robot/hxr/huazhu.html?sysNum=1476067354706249)
		* [pc端聊天页面](http://hxr.huazhu.com/robot/hxr/chat4.html?sysNum=1476067354706249)

	* 东莞
		* [pc端聊天页面](http://v3.faqrobot.org/robot/faqrobotDG.html?sysNum=1000000)
			* 当用户被接管时，会显示截屏按钮

3. 新版聊天页面注意事项

	* 基本结构
		
			├── css
			│	 └── minichat.css
			├── images
			├── js
			│	 └── minichat.js
			├── skin
			│    ├── a
			│	 │	 ├── css
			│	 │	 │	  └── app.css
			│	 │	 ├── images
			│	 │	 └── js
			│	 │		  └── app.js
			│    ├── b
			│	 │	 ├── css
			│	 │	 │	  └── app.css
			│	 │	 ├── images
			│	 │	 └── js
			│	 │		  └── app.js
			│    └── ...
			├── a.html
			├── b.html
			└── ...

	* 核心文件 [minichat.js](http://v4.faqrobot.org/robot/js/minichat.js) [minichat.css](http://v4.faqrobot.org/robot/css/minichat.css) 修改时会影响所有的页面，慎重修改
	* [minichat.js 使用介绍](http://v4.faqrobot.org/robot/js/README.html)
	* 需要增加功能时，仅需修改相应文件夹内部的文件

### 人工监控(后台-徐健)

* [老版](http://v4.faqrobot.org/onlineMonitor/monitor_old/index.html)
* [新版](http://v4.faqrobot.org/onlineMonitor/monitor/index.html)
	* 核心js [http://v4.faqrobot.org/onlineMonitor/monitor/js/main.js?dev=3](http://v4.faqrobot.org/onlineMonitor/monitor/js/main.js?dev=3)

### [任务追踪](http://rwgz.faqrobot.org/login.html)(后台-靖亮亮)

### [新版官网](http://web.faqrobot.org/web/index.html)

* 缺少后台接口

### 如家大作战(后台-靖亮亮)

* [本地](http://rujiaos.faqrobot.org/hwb/treasure/index.html?key=oIO3gjvMUPSC6AjoS_pCTnPzco5I&name=%E4%BB%98%E6%99%93%E4%B8%9C)(需要后台开启服务)
* [线上](http://wkf.homeinns.com/os/web/treasure/index.html?key=oIO3gjvMUPSC6AjoS_pCTnPzco5I&name=%E4%BB%98%E6%99%93%E4%B8%9C)
* [后台管理](http://rujiaos.faqrobot.org/index_zc.html)(需要登录账号、密码)

### 微信小程序

* 打开**微信web开发者工具**，使用**已绑定的开发者微信账号**扫码，选择**wxchat 2.0.0**
* 项目路径 **http://v4_faqrobot_org/wxchat**
* 公司的小程序ID **wx3f19dcc90e25955f**
* [小程序官方文档](https://mp.weixin.qq.com/debug/wxadoc/dev/)
* [小程序社区](http://www.wxappclub.com/)

### 云监控系统(后台-余游)

* [线上](http://monit.faqrobot.net/login.html)
* 项目路径 **\交接项目\云监控系统**
* 项目基于[vue-bootstrap](https://github.com/ghprod/vue-bootstrap)
* 编译和打包需要[node.js](https://nodejs.org/en/), [详细指南](http://vuejs-templates.github.io/webpack/), [vue-loader文档](http://vuejs.github.io/vue-loader)
* 使用的包见package.json,包括[vue1.0](https://v1.vuejs.org/guide/),[vue-tables](https://github.com/matfish2/vue-tables)等

### 博西家电(后台-靖亮亮)
* [线上](http://ywbot.picture.bshg.com.cn/web/idList/returnReport.html)
* [后台管理](http://ywbot.picture.bshg.com.cn/login.html)(需要登录账号、密码)

### 官网
* [线上](http://www.iyunwen.com/)
* 项目路径 **\交接项目\官网www_iyunwen_com**

### 微信小程序

* 新的微信小程序支持点击满意不满意,进行满意度评价,但是不支持答案中的富文本解析
* 项目路径 **http://v4_faqrobot_org/wxchatNew**