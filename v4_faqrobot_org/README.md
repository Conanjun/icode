# 新版后台菜单整理

### 1. 注意事项

* 所有网址请填入NewUrl字段
* 遇到不存在该页面但非填不可的情况，请添字符 **#**
* 前台获取数据，遇到空值或 **#** 则**自动删除**该字段对应的3级菜单

### 2. 详细列表

* #### 首页
	* 首页
		* [首页]( web/home/home.html) web/home/home.html

* #### 知识库整理
	* 业务知识
		* [添加问题] (web/knowledge/addQuestion.html) web/knowledge/addQuestion.html
		* [创建流程] (web/knowledge/addFlow.html) web/knowledge/addFlow.html
		* [问答总览] (web/knowledge/queView.html)  web/knowledge/queView.html
		* [问题分类] (web/knowledge/classify.html)  web/knowledge/classify.html
		* [问题导入] (web/knowledge/importQuestion.html)  web/knowledge/importQuestion.html
		* [知识回收站] (web/knowledge/trash.html)  web/knowledge/trash.html
		* [在线知识库] (web/knowledge/onlineKnowledge.html)  web/knowledge/onlineKnowledge.html
		* [表格查询问答] (web/knowledge/queryTab.html)  web/knowledge/queryTab.html
	* 知识学习
		* [智能学习] (web/knowledge/intelLearnList.html)  web/knowledge/intelLearnList.html
		* [未知问题] (web/knowledge/unknowQue.html)  web/knowledge/unknowQue.html
		* [永久忽略] (web/knowledge/ignore.html)  web/knowledge/ignore.html
		* [未知问题标签] ( web/knowledge/Unknown_mark.html)  web/knowledge/Unknown_mark.html
        * [词权重] (web/knowledge/wordWeight.html) web/knowledge/wordWeight.html
	* 语义知识
        * [添加公共库] (web/knowledge/PublicDataBaseAdd.html)  web/knowledge/PublicDataBaseAdd.html
        * [公共库管理] ( web/knowledge/PublicDataBaseList.html)  web/knowledge/PublicDataBaseList.html
        * [关联词] (web/knowledge/wordRelation.html)  web/knowledge/wordRelation.html
		* [同义词] (web/knowledge/synonym.html)  web/knowledge/synonym.html
        * [词性] (web/knowledge/featureWord.html)  web/knowledge/featureWord.html
		* [专业名词] (web/knowledge/professional.html)  web/knowledge/professional.html
		* [聊天库] (web/knowledge/chatLibrary.html)  web/knowledge/chatLibrary.html
		* [停止词] (web/knowledge/stopword.html)  web/knowledge/stopword.html
		* [词库查询] (web/knowledge/wordQuery.html)  web/knowledge/wordQuery.html
	* 规则配置
		* [自定义查询] (web/temp/searchData.html)  web/temp/searchData.html
		* [句式列表] (web/temp/phraseList.html)  web/temp/phraseList.html
		* [分布式表单列表] (web/temp/formList.html)  web/temp/formList.html
		* [文字链接] (web/system/wordLinkList.html)  web/system/wordLinkList.html
		* [句式组列表] (web/temp/phraseGroup.html)  web/temp/phraseGroup.html
		* [营销列表] (web/temp/marketList.html)  web/temp/marketList.html
* #### 素材管理
	* 素材管理
		* [添加素材] (web/material/addSrc.html)  web/material/addSrc.html
		* [素材预览] (web/material/viewSrc.html)  web/material/viewSrc.html
		* [自定义菜单] (web/material/customMenu.html)  web/material/customMenu.html
		* [图文列表] (web/material/menuList.html)  web/material/menuList.html
		* [添加新图文] (web/material/imgTexts.html)  web/material/imgTexts.html
		* [文本分析] (web/material/highWord.html)  web/material/highWord.html

* #### 系统管理
	* 基本设置
		* [企业信息] ( web/system/company.html)  web/system/company.html
		* [安全设置] (web/system/editPwd.html)  web/system/editPwd.html
		* [获取代码] (web/system/payCode.html)  web/system/payCode.html
		* [文字链接] (web/system/wordLinkList.html)  web/system/wordLinkList.html
		* [参数配置] (web/system/parameters.html)  web/system/parameters.html
		* [重置知识库] (web/system/knowledgeReset.html)  web/system/knowledgeReset.html
	* 个性化设置
        * [SDK快捷配置] (web/system/getSDK.html)  web/system/getSDK.html
		* [机器人设置] (web/system/robot.html)  web/system/robot.html
		* [页面设置] ( web/system/pageConfig.html)  web/system/pageConfig.html
		* [功能配置] ( web/system/setParam.html)  web/system/setParam.html
		* [页面展示配置] (web/system/configuration.html)  web/system/configuration.html
	* 操作日志
		* [操作日志] (web/system/optLog.html)  web/system/optLog.html
		* [意见反馈] (web/system/feedback.html)  web/system/feedback.html
		* [登录日志] (web/system/loginLog.html)  web/system/loginLog.html
	* 系统公告
		* [意见列表] (web/system/feedbackList.html)  web/system/feedbackList.html
		* [新闻列表] (web/system/newsList.html)  web/system/newsList.html
		* [意见列表] (web/system/fbList.html)  web/system/fbList.html
	* 系统设置
        * [规则列表] (web/temp/ruleList.html)  web/temp/ruleList.html
        * [安全设置] (web/system/editPwd.html)  web/system/editPwd.html
        * [报警邮件流水记录] (web/temp/historyEmail.html)  web/temp/historyEmail.html
        * [报警邮箱] (web/temp/emailList.html)  web/temp/emailList.html
	* 未分类
		* [留言列表] (web/system/leaveMsgList.html)  web/system/leaveMsgList.html
		* [交互量列表] ( web/system/interactionList.html)  web/system/interactionList.html
		* [查询注册用户] (web/system/searchRegister.html)  web/system/searchRegister.html
		* [查询站点信息] (web/system/searchWeb.html)  web/system/searchWeb.html
		* [展示信息] (web/system/showInfo.html)  web/system/showInfo.html
		* [策略配置] (web/system/gameConfig.html)  web/system/gameConfig.html

* #### 数据分析
	* 访客统计
		* [访客次数统计] (web/data/visitData.html)  web/data/visitData.html
		* [访客人数统计] (web/data/visitDataByLoginSummary.html)  web/data/visitDataByLoginSummary.html
		* [访客来访区域统计] (web/data/visitorByAreaType.html)  web/data/visitorByAreaType.html
		* [问题访问区域统计] (web/data/queryAndArea.html)  web/data/queryAndArea.html
		* [访客会话明细统计] (web/data/loginSummary.html)  web/data/loginSummary.html
		* [访客绑定率统计] (web/data/visitorBinding.html)  web/data/visitorBinding.html
		* [访客年龄段统计] (web/data/visitorAge.html)  web/data/visitorAge.html
		* [客户会员卡级别统计] ( web/data/vipCardLevel.html)  web/data/vipCardLevel.html
	* 题库统计
		* [知识库统计] (web/data/questionBank.html)  web/data/questionBank.html
		* [题库更新统计] (web/data/questionBankUpdate.html)  web/data/questionBankUpdate.html
		* [客服工作量统计] ( web/data/serviceWorkload.html)  web/data/serviceWorkload.html
		* [访问问题类别统计] (web/data/questionType.html)  web/data/questionType.html
		* [访问问题分级统计] (web/data/questionLevel.html)  web/data/questionLevel.html
		* [访问问题区域统计] (web/data/queryByAreaType.html)  web/data/queryByAreaType.html
		* [访问问题明细统计] (web/data/questionDetail.html)  web/data/questionDetail.html
		* [多维度热点问题分析] (web/data/questionMultiDimension.html)  web/data/questionMultiDimension.html
	* 问答统计
		* [后台使用满意度统计] ( web/data/satisfactionSurvey.html)  web/data/satisfactionSurvey.html
		* [会话满意度统计] ( web/data/evaluation.html)  web/data/evaluation.html
		* [题库满意度统计] (web/data/satisfactionBank.html)  web/data/satisfactionBank.html
		* [问题匹配率统计] (web/data/questionMatching.html)  web/data/questionMatching.html
		* [未知问题数量统计] (web/data/unknownQuestion.html)  web/data/unknownQuestion.html
		* [智能回复时间统计] (web/data/replyTime.html)  web/data/replyTime.html
		* [高频词统计] (web/data/highFrequencyWords.html)  web/data/highFrequencyWords.html
		* [访问匹配率统计] (web/data/visitMatching.html)  web/data/visitMatching.html
		* [未知问题标签报表] (web/data/Label.html)  web/data/Label.html

* #### 平台对接
	* 平台对接
		* [对接钉钉微应用] (web/platform/dingchat.html)  web/platform/dingchat.html
		* [认证列表] (web/platform/authList.html)  web/platform/authList.html
		* [接口列表] (web/platform/portList.html)  web/platform/portList.html
		* [微信列表(单点)] (web/platform/wechatListCus.html)  web/platform/wechatListCus.html
		* [微信列表(云上)] (web/platform/wechatListYun.html)  web/platform/wechatListYun.html
		* [对接微信] (web/platform/addWeChat.html)  web/platform/addWeChat.html
		* [多客服] ( web/platform/MultiService.html)  web/platform/MultiService.html
		* [微博列表] (web/platform/weiboList.html)  web/platform/weiboList.html
		* [支付宝列表] ( web/platform/zhifubaoList.html)  web/platform/zhifubaoList.html
		* [第三方微信] ( web/platform/ThirdWeiXin.html)  web/platform/ThirdWeiXin.html
		* [第三方客服] (web/platform/ThirdViewer.html)  web/platform/ThirdViewer.html
		* [AskToken列表] (web/platform/askTokenList.html)  web/platform/askTokenList.html
* #### 人员管理
	* 客服管理
		* [菜单管理] ( web/staff/menu.html)  web/staff/menu.html
		* [资源管理] (web/staff/sourceManage.html)  web/staff/sourceManage.html
		* [角色管理] (web/staff/roleManage.html)  web/staff/roleManage.html
		* [用户列表] (web/staff/userList.html)  web/staff/userList.html
		* [来访者角色] (web/staff/visitorRole.html)  web/staff/visitorRole.html
		* [客户名片列表] (web/staff/cardList.html)  web/staff/cardList.html
		* [API用户列表] (web/staff/apiUserList.html)  web/staff/apiUserList.html
		* [人员导入] (web/staff/importUser.html)  web/staff/importUser.html
	* 访客管理
		* [访客列表] (web/staff/visitorList.html)  web/staff/visitorList.html
		* [访客日志] (web/staff/visitorLog.html)  web/staff/visitorLog.html
		* [质检日志] (web/staff/checkLog.html)  web/staff/checkLog.html

* #### 帮助中心
	* 新手入门
		* [新手入门] (web/help/help.html)  web/help/help.html

* #### 未分类
	* 未分类
		* [机器人链接]( web/temp/addRobotLink.html) web/temp/addRobotLink.html
		* [报警邮箱] ( web/temp/emailList.html)  web/temp/emailList.html
		* [规则列表] (web/temp/ruleList.html)  web/temp/ruleList.html
		* [报警邮件的流水记录] (web/temp/historyEmail.html)  web/temp/historyEmail.html
		* [题库满意度反馈] (web/temp/qBfeedbackList.html)  web/temp/qBfeedbackList.html
		* [题库满意度反馈列表] (web/temp/qBList.html)  web/temp/qBList.html
		* [分布式表单列表] (web/temp/formList.html)  web/temp/formList.html
		* [句式列表] (web/temp/phraseList.html)  web/temp/phraseList.html
		* [自定义查询] (web/temp/searchData.html)  web/temp/searchData.html
		* [生效规则配置] (web/temp/effectiveRule.html)  web/temp/effectiveRule.html
		* [版本管理] (web/temp/version.html)  web/temp/version.html
