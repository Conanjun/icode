/**add by zhaoyuxing at 2018.9.3
 * index.js 作用：
 * 1、首页业务逻辑
 * 2、页面与用户交互
 * 注明：
 * 1、所有存储在session中的数据目的：从详情页/单点登录返回首页时，保持跳转前的状态
*/
/**
 * 获取url中的参数
*/
var urlSearch = new UrlSearch();

/*页面上dom元素的集合*/
var dom = {
    viewCount: $('#viewCount'), // 头部排序按钮
    resetBtn: $('#all'),// 头部显示全部内容按钮
    home: $('#home'),// 首页按钮
    search: $('#search'),// 搜索页面按钮
    collect: $('#collect'), // 收藏页面按钮
    contentBox: $('.content-box'),// 显示区域元素
    menu: $('.menu'),// 菜单按钮栏
    ztreeBox: $('.ztree-box'),// 分类树容器
    knowledge: $('.knowledge'),// 展示知识的容器
    pageList: $("#pageList"), // 分页显示行
    fhead: $('.fhead'),// 排序功能栏
    searchRow: $('.search-row'),// 搜索功能栏
    searchType: $('.searchType'), // 搜索类型
    searchString: $('#keyword'),// 搜索关键词
    searchBtn: $('#searchBtn'),// 搜索按钮
    tipModal: $('.tip'), // 提示框
    /*收藏页单点登录form表单元素*/
    fQuestion: $('[name=question]'),
    fAnswer: $('[name=answer]'),
    fType: $('[name=type]'),
    fOrderType: $('[name=orderType]'),
    fQueryType: $('[name=queryType]'),
    fPageSize: $('[name=pageSize]'),
    fPageNo: $('[name=pageNo]'),
    fGroupId: $('[name=groupId]'),
    fCollect: $('[name=collect]'),
    fShowFlow: $('[name=showFlow]'),
    fOriginUrl: $('[name=originUrl]'),
    showcollect: $('#showcollect'),// 表单id
    /*收藏页单点登录form表单元素结束*/

    editCollectForm: $('#editCollectForm') // 收藏操作表单id

}
/*页面上dom元素的集合*/
function KnowledgeBase() {
    this.question = '', // 搜索 问题 字符串
    this.answer = '',// 搜索 答案 字符串
    this.type = 1,
    this.pageSize = 10,// 每页显示的条数
    this.queryType = 1,//搜索时标记搜索字符串的类型 1：问题 2：答案
    this.collect = '',//是否查询收藏的答案 1：仅查询收藏 
    this.showFlow = 1,// 仅获取问题类型答案
    this.userName = '' // 单点登录成功后，在url中获取的用户名
    this.mobile = '' // 单点登录成功后，在url中获取的手机号
    /**
     * 以下为各个页面所处的分类、页码、排序方式
     * 排序方式： 13 浏览次数正序  14浏览次数倒序
     * */
    this.homeGroupId = 0;
    this.homePageNo = 1;
    this.homeOrderType = 14;

    this.searchGroupId = 0;
    this.searchPageNo = 1;
    this.searchOrderType = 14;
    this.searchType = 1;
    this.searchKeyWord = '';

    this.collectGroupId = 0;
    this.collectPageNo = 1;
    this.collectOrderType = 14;

    this.nowPage = 'home';// 当前所处页面
    this.emptyHtml = '<li class="empty"><img src="./static/images/alert.png">当前记录为空</li>', // 查询列表为空时的样式

    this.isLogin = urlSearch.iticket,// 是否已经单点登录
    this.userName = urlSearch.userName || '';// 单点登录后返回的url的值
    this.mobile = urlSearch.mobile || '';

    if(this.mobile){
        this.userName = this.mobile;
    }
    if (this.isIE()) {
        this.userName = encodeURI(this.userName);
    }
    this.originUrl = window.location.protocol + '//' + window.location.host + window.location.pathname// 单点登录前的地址

    this.init();
}

KnowledgeBase.prototype = {
    init: function () {
        this.bindViewBtn();
        this.bindTabBtn();
        // this.loadKnowledge();
        this.bindResetBtn();
        this.bindSearch();
        this.bindCollect();
        this.bindGoDetail();
        this.backfill();
    },
    /**
     * @function 获得浏览器是否为ie
    */
    isIE: function () {
        var u = navigator.userAgent;
        if (u.indexOf('Trident') > -1) {
            return true;
        } else {
            return false;
        }
    },
    /**
    * @event 排序按钮点击事件
   */
    bindViewBtn: function () {
        var That = this;
        dom.viewCount.on('click', function () {
            if (That[That.nowPage + 'OrderType'] == 13) {
                That[That.nowPage + 'OrderType'] = 14;
                $(this).find('img').attr('src', './static/images/down.png');
            } else {
                That[That.nowPage + 'OrderType'] = 13;
                $(this).find('img').attr('src', './static/images/up.png');
            }
            setLocalStorage(That.nowPage + 'OrderType',  That[That.nowPage + 'OrderType']);
            That.loadKnowledge();
        })
    },
    /**
    * @function 排序按钮点击事件
    */
    orderImage: function () {
        if (this[this.nowPage + 'OrderType'] == 14) {
            dom.viewCount.find('img').attr('src', './static/images/down.png');
        } else {
            dom.viewCount.find('img').attr('src', './static/images/up.png');
        }

    },
    /**
     * @event 头部点击“全部”按钮事件:
     * 将当前页面中浏览次数倒序，全部分类,页面回第一页
    */
    bindResetBtn: function () {
        var That = this;
        dom.resetBtn.on('click', function () {
            That[That.nowPage + 'OrderType'] = 14;
            That[That.nowPage + 'PageNo'] = 1;
            That[That.nowPage + 'GroupId'] = 0;
            That.loadKnowledge();
        })

    },
    /**
    *@event 页面tab切换
   */
    bindTabBtn: function () {
        var That = this;
        dom.menu.on('click', 'li', function () {
            // 记录当前所处页面
            setLocalStorage('nowPage', $(this).attr('id'));
            // 修改按钮样式
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            var id = $(this).attr('id');
            That.nowPage = id;
            // 选中分类树
            if(classfiy){
                classfiy.selectClassfiy(That[That.nowPage + 'GroupId'])
            }           
            if (id == 'home') {
                That.loadHomePage();
            } else if (id == 'search') {
                That.loadSearchPage();
            } else if (id == 'collect') {
                That.loadCollectPage();
            }
        })
    },
    /**
     * @event 点击搜索按钮、enter键触发搜索
    */
    bindSearch: function () {
        var That = this;
        dom.searchBtn.on('click', function () {
            That.getSearchData();
            That.loadKnowledge();
        })
        dom.searchString.on('keyup', function(e){
            if(e.keyCode == 13){
                That.getSearchData();
                That.loadKnowledge();
            }
        })
    },
    /**
     *@function 切换到首页
     *在bindTabBtn() 中判断点击的按钮为首页按钮， 调用该方法加载首页内容
    */
    loadHomePage: function () {
        dom.searchRow.hide();
        dom.fhead.show();
        this.orderImage();
        // 清空查询入参
        this.queryType = 1;
        this.question = '';
        this.answer = '';
        this.collect = '';
        this.loadKnowledge();
    },
    /**
    *@function 切换到搜索页
    *在bindTabBtn() 中判断点击的按钮为搜索按钮， 调用该方法加载搜索页面内容
   */
    loadSearchPage: function () {
        dom.fhead.hide();
        dom.searchRow.show();
        // 回填搜索框的数据
        dom.searchString.val(this.searchKeyWord);
        dom.searchType.val(this.searchType);
        this.collect = '';
        // 回填查询入参
        this.queryType = this.searchType;
        if (this.queryType == 1) {
            this.question = dom.searchString.val();
            this.answer = '';
        } else if (this.queryType == 2) {
            this.question = '';
            this.answer = dom.searchString.val();
        }
        this.loadKnowledge();
    },
    /**
    *@function 切换到收藏页
    *在bindTabBtn() 中判断点击的按钮为收藏按钮， 调用该方法加载收藏页面内容
   */
    loadCollectPage: function () {
        dom.searchRow.hide();
        dom.fhead.show();
        this.orderImage();
        // 清空查询入参
        this.queryType = 1;
        this.question = '';
        this.answer = '';
        this.collect = 1;

        // 单点登录
        if (this.isLogin) {
            this.loadKnowledge();
        } else {
            // 组织数据
            dom.fQuestion.val(this.question);
            dom.fAnswer.val(this.question);
            dom.fType.val(this.type);
            dom.fOrderType.val(this.collectOrderType);
            dom.fQueryType.val(this.queryType);
            dom.fPageSize.val(this.pageSize);
            dom.fPageNo.val(this.collectPageNo);
            dom.fGroupId.val(this.collectGroupId);
            dom.fCollect.val(1),
                dom.fShowFlow.val(this.showFlow);
            dom.fOriginUrl.val(this.originUrl);
            // 表单提交请求接口
            dom.showcollect.submit();
        }

    },
    /**
     * @function 加载页面知识列表结构
     * @param data 为接口返回答案列表数据
     * @return 返回值string 拼接好的html字符串
    */
    itemHtml: function (data) {
        var html = [];
        for (var i = 0; i < data.length; i++) {
            html.push('<li class="view-cell question" sid="' + data[i].Id + '" solutiontype="' + data[i].SolutionType + '">');
            html.push('<div class="border-bottom">');
            html.push('<h4 class="txt" questionid="' + data[i].SolutionId + '">' + (i + 1) + '.');
            html.push('<img src="./static/images/new.png" style="display:' + (data[i].UpdateTime ? this.isNew(data[i].UpdateTime) : this.isNew(data[i].AddTime)) + '">' + this.searchKeyWordHtml(this.filterQue(data[i].Question || '')));
            html.push('</h4>');
            html.push('<div class="info-line">');
            html.push('<p class="info-icon collect-btn" data-collect="' + data[i].collect + '">');
            html.push('<img src="./static/images/' + (data[i].collect ? 'favor' : 'notFavor') + '.png">');
            html.push('</p>');
            html.push('<p class="info-icon">');
            html.push('<img src="./static/images/eye.png">&nbsp;<span>' + (data[i].Hits || 0) + '</span>');
            html.push('</p>');
            html.push('</div>');
            html.push('</div>');
            html.push('</li>');
        }
        return html.join('');
    },
    /**
     * @function 处理语音问题
     * @param tmpInque 答案字符串
     * @return 返回值string 处理后的答案内容
    */
    filterQue: function (tmpInque) {
        if (tmpInque) {
            if (new RegExp('__xgn_iyunwen_').test(tmpInque)) {
                tmpInque = tmpInque.split('__xgn_iyunwen_');
                tmpInque = tmpInque[0];
            }
        }
        return tmpInque;
    },
    /**
     * @function 根据知识添加事件判断是否显示new标志
     * @param getDate 答案添加的时间(毫秒数)
     * @return 返回值string 是否显示'new'的css样式 inline-block/none;
    */
    isNew: function (getDate) {
        //获得系统时间
        var nowDate = new Date(),
            dayMsec = nowDate.getTime() - getDate;//获得毫秒数

        //转化为天数
        var days = parseInt(dayMsec / (1000 * 60 * 60 * 24));

        //3天以内显示
        if (days >= 0 && days <= 2) {
            return 'inline-block';
        } else {
            return 'none';
        }
    },
    /**
     * @function 调用接口成功后的回调：页面显示、处理分页
     * @param data 接口返回的数据
    */
    getKnowledge: function (data) {
        if (data.status == 0 && data.list.Items && data.list.Items.length > 0) {
            var html = knowledgeBase.itemHtml(data.list.Items);
            dom.knowledge.html(html);

            // 处理分页
            var options = {
                data: [data.list, 'Items', 'TotalCount'],
                currentPage: data.list.CurrentIndex,
                totalPages: data.list.PageCount ? data.list.PageCount : 1,
                alignment: 'right',
                onPageClicked: function (event, originalEvent, type, page) {
                    knowledgeBase[knowledgeBase.nowPage + 'PageNo'] = page;
                    // 分页存储于session
                    setLocalStorage(knowledgeBase.nowPage + 'PageNo', page);
                    knowledgeBase.loadKnowledge();
                }
            };
            dom.pageList.bootstrapPaginator(options);
        } else {
            dom.knowledge.html(knowledgeBase.emptyHtml);
            dom.pageList.empty();
        }
        // 选中对应的分类树 
        classfiy.selectClassfiy(knowledgeBase[knowledgeBase.nowPage + 'GroupId'])

    },
    /**
    * @function 调用接口，获取知识列表并加载到页面上
   */
    loadKnowledge: function () {
        // 请求需要的参数
        var param = {
            question: this.question,
            answer: this.answer,
            type: this.type,
            orderType: this[this.nowPage + 'OrderType'],
            pageSize: this.pageSize,
            pageNo: this[this.nowPage + 'PageNo'],
            queryType: this.queryType,
            groupId: this[this.nowPage + 'GroupId'],
            collect: this.collect,
            showFlow: this.showFlow,
            userName: this.userName,
            mobile:this.mobile
        }

        intercept({
            url: api.doFindQueList,
            type: 'post',
            data: param,
            successCallBack: this.getKnowledge
        });
    },
    /**
     * @function 获取搜索数据
    */
    getSearchData: function () {
        this.queryType = this.searchType = dom.searchType.val(); // 保存当前查询类型
        this.searchGroupId = 0;
        this.searchOrderType = 14;
        this.searchPageNo = 1;
        this.searchKeyWord = dom.searchString.val();// 保存当前查询字符串
        if (this.queryType == 1) {
            this.question = dom.searchString.val();
            this.answer = '';
        } else if (this.queryType == 2) {
            this.question = '';
            this.answer = dom.searchString.val();
        }
        setLocalStorage('searchGroupId', 0);
        setLocalStorage('searchOrderType', 14);
        setLocalStorage('searchPageNo', 1);
        setLocalStorage('searchKeyWord',  this.searchKeyWord);
        setLocalStorage('searchType',  this.searchType);
    },
    /**
     * @event 收藏功能事件绑定，发送请求
    */
    bindCollect: function () {
        var That = this;
        dom.knowledge.on('click', '.collect-btn', function (e) {           
            // 只有收藏页面开放收藏功能
            if (That.nowPage != 'collect') {
                return false;
            }
            e.stopPropagation();
            // 组织入参
            var param = {
                id: $(this).parents('li').attr('sid'),
                userName: That.userName,
                mobile:That.mobile
            }
            var collectStatue = $(this).attr('data-collect');
            if (collectStatue == 0) {
                param['collect'] = 1
            } else {
                param['collect'] = 0
            }

            // 单点登录
            if (That.isLogin) {
                // 请求接口
                intercept({
                    url: api.doEditCollect,
                    type: 'post',
                    data: param,
                    successCallBack: That.collectCallback
                })
            } else {
                dom.fOriginUrl.val(this.originUrl);
                dom.editCollectForm.submit();
            }

        })
    },
    /**
     * @function 收藏请求完成后回调
    */
    collectCallback: function (data) {
        if (data.status == 0) {
            // 显示提示
            if (data.collectIf == 0) {
                dom.tipModal.show();
                dom.tipModal.html('取消收藏成功');
            } else {
                dom.tipModal.show();
                dom.tipModal.html('收藏成功');
            }
            // 重新加载当前页
            knowledgeBase.loadKnowledge();
        } else {
            dom.tipModal.show();
            dom.tipModal.html('当前网络延时，请稍后再试');
        }

        // 隐藏提示框
        setTimeout(function () {
            dom.tipModal.hide();
        }, 1500);
    },
    /**
     * @event 跳转详情页面
    */
    bindGoDetail: function () {
        var That = this;
        dom.knowledge.on('click', 'li', function () {
            // 接口参数
            var id = $(this).attr('sId')
            var param = {
                id: id
            }
            // url 参数
            var iscollected = $(this).find('.collect-btn').attr('data-collect'),
                solutionType = $(this).attr('solutionType');
            // 方便详情页判断收藏按钮的显示方式    
            sessionStorage.setItem('iscollected', iscollected || '');
            // 发送请求
            intercept({
                url: api.doAddHits,
                type: 'post',
                data: param,
                successCallBack: function (data) {
                    setTimeout(function () {
                        if (knowledgeBase.isLogin) {
                            var userName = knowledgeBase.userName;
                            // ie中传给详情页的username，将已编码的值还原
                            if(knowledgeBase.isIE()){
                                userName = decodeURI(userName)
                            }
                            window.location.href = 'question.html?id=' + id + '&solutionType=' + solutionType + '&iticket=1' + '&userName=' + userName + '&mobile=' + knowledgeBase.mobile;
                        } else {
                            window.location.href = 'question.html?id=' + id + '&solutionType=' + solutionType;
                        }
                    }, 200)
                }// end of successCallBack
            })// end of intercept
        })// end of dom.knowledge event
    },
    /**
     * @function 进入页面时，首先读取离开前的页面数据
    */
    backfill:function(){
        this.homeGroupId = getLocalStorage('homeGroupId') || 0;
        this.homePageNo = getLocalStorage('homePageNo') || 1;
        this.homeOrderType = getLocalStorage('homeOrderType') || 14;
    
        this.searchGroupId = getLocalStorage('searchGroupId') || 0;
        this.searchPageNo = getLocalStorage('searchPageNo') || 1;
        this.searchOrderType = getLocalStorage('searchOrderType') || 14;
        this.searchType = getLocalStorage('searchType') || 1;
        this.searchKeyWord = getLocalStorage('searchKeyWord') || '';
    
        this.collectGroupId = getLocalStorage('collectGroupId') || 0;
        this.collectPageNo = getLocalStorage('collectPageNo') || 1;
        this.collectOrderType = getLocalStorage('collectOrderType') || 14;

        this.nowPage = getLocalStorage('nowPage') || 'home';
        
        dom[this.nowPage].trigger('click');

    },
    /**
     * @function 搜索的内容匹配搜索关键字标红
     * @param string 问题 
     * @return  string 返回标红文字的html结构
    */
    searchKeyWordHtml:function(ques){
        var questionStr = this.question || this.answer || '';
        if(questionStr){
            if(ques.indexOf(questionStr)>-1){
                return ques.split(questionStr).join('<span class="AU_replaceTip">'+questionStr+'</span>');
            }else{
                return ques
            }
        }else{
            return ques
        }
    }
}

var knowledgeBase = new KnowledgeBase();


/*定义分类树对象*/
function Ztree() {
    this.tree = $('#treeClasses');
    this.groupId = 0;
    /**
    * @object ztree配置
   */
    this.classsetting = {
        view: {
            dblClickExpand: true,
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
            url: api.doFindGroupList,
            autoParam: ["id"],
            dataFilter: this.ajaxDataFilter
        },
        callback: {
            onClick: this.ZTreeClassClick
        }
    },
        this.init();
}

Ztree.prototype = {
    init: function () {
        $.fn.zTree.init($('#treeClasses'), this.classsetting, []);
    },
    /**
     *@function 格式化异步获取的json数据
    */
    ajaxDataFilter: function (treeId, parentNode, responseData) {
        var list = [];
        if (responseData) {
            responseData.list.push({
                Id: 0,
                ParentId: 0,
                Name: "全部分类",
                open: true
            });
            for (var i = 0; i < responseData.list.length; i++) {
                if (responseData.list[i].ParentId == '2089' || responseData.list[i].ParentId == '1558' || responseData.list[i].Id == 2089 || responseData.list[i].Id == '1558') {
                    continue;
                } else {
                    list.push(responseData.list[i]);
                }
            }
            responseData.list = list;
            return responseData.list;
        }
        return responseData;
    },
    /**
    *@function  点击分类树时的回调
   */
    ZTreeClassClick: function (event, treeId, treeNode, clickFlag) {
        var ztree = $.fn.zTree.getZTreeObj('treeClasses'),
            node = ztree.getSelectedNodes();
        classfiy.groupId = node[0].Id;

        // 调用查询接口 在knowledgeBase中
        knowledgeBase[knowledgeBase.nowPage + 'GroupId'] = classfiy.groupId;
        knowledgeBase[knowledgeBase.nowPage + 'PageNo'] = 1;

        setLocalStorage(knowledgeBase.nowPage + 'GroupId', classfiy.groupId);
        setLocalStorage(knowledgeBase.nowPage + 'PageNo', 1);

        knowledgeBase.loadKnowledge();

    },
    /**
    *@function  选中某个分类
   */
    selectClassfiy: function (groupId) {
        groupId = groupId || 0;
        var treeObj = $.fn.zTree.getZTreeObj('treeClasses'),
            node = treeObj.getNodeByParam("Id", groupId, null);
        if (node) {
            treeObj.selectNode(node);
        }
    }
}

var classfiy = new Ztree()