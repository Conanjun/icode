var Common = require('./common').Common
var WxParse = require('../component/wxParse/wxParse.js')

var plugName = "faqrobot",
    defaults = {
    	// 基础信息参数
    	info: {
    		domain: 'https://v35.faqrobot.org',// 域名
    		sysNum: 1000000,// 客户唯一标识
			sourceId: 0,// 客户来源
    		clientId: 0,
        	jid: 0,// 自定义客服客户图标
			access_token: '',

    	},
    	// 微信有关参数
        wxParams: {
            that: null,
            chatData: {
                html: [],
            	arrayName: '',
            	num: 0,
            	
            },
        },
        webName: '云问科技',//公司名称
        kfPic: '',  //客服图标
        khPic: '', //客户图标
		kfHtml: [
		    '<div class="MN_answer"><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%helloWord%</div><div class="MN_kftime">%formatDate%</div></div>',//欢迎语组合
		    '<div class="MN_helpful"><span class="MN_reasonSend">提交</span><span class="MN_yes">满意</span><span class="MN_no">不满意</span></div>',//是否满意组合
		    '<div class="MN_answer" aId="%aId%" cluid="%cluid%"><div class="MN_kfName">%robotName%</div><div class="MN_kfCtn"><img class="MN_kfImg" src="%kfPic%"><i class="MN_kfTriangle1 MN_triangle"></i><i class="MN_kfTriangle2 MN_triangle"></i>%ansCon%%gusListHtml%%relateListHtml%%commentHtml%</div><div class="MN_kftime">%formatDate%</div></div>'//回答组合
		],//客服结构(所有的属性和%xxx%都必须存在)
		khHtml: '<div class="MN_ask"><div class="MN_khName">我</div><div class="MN_khCtn"><img class="MN_khImg" src="%khPic%"><i class="MN_khTriangle1 MN_triangle"></i><i class="MN_khTriangle2 MN_triangle"></i>%askWord%</div><div class="MN_khtime">%formatDate%</div></div>',//客户结构
		formatDate: '%hour%:%minute%:%second% %year%-%month%-%date%',//配置时间格式(默认10:42:52 2016-06-24)
    };

function Appchat(options) {
	this.options = Common.extend(true, {}, defaults, options)
    this.robot = {};//机器人基本信息
    console.log(this.options)
	this.init()
}

Appchat.prototype = {
	init: function() {
		this.initBaseInfo()
	},
	//初始化基本信息->s=p->logo/欢迎语/快捷服务/热门问题/用户信息
	initBaseInfo: function() {
		var This = this;

		// 获取 token
		This.request({
			url: 'servlet/ApiChat',
		    data: {
		        s: 'p',
		    },
		    success: function(res) {
		    	

                This.setLogo(res.data);//设置logo->客服图标/客户图标
                This.addMsg(res.data);//欢迎语
		    }
		})
	},
    //设置logo->客服图标/客户图标 >>> 取消设置logo
    setLogo: function(data) {
        this.robot.kfPic = data.skinConfig ? data.skinConfig.kfPic : this.options.info.domain+this.options.kfPic,//客服图标
        this.robot.khPic = data.skinConfig ? data.skinConfig.khPic : this.options.info.domain+this.options.khPic;//客户图标
        // 设置公司名
        wx.setNavigationBarTitle({
            title: data.webConfig.webName || this.options.webName
        })
    },
    // 增加话语 true 为我说的话
    addMsg: function(data, bool) {
        if(bool) {
            this.options.wxParams.chatData.html.push(this.customHtml(data))
        }else {
            this.options.wxParams.chatData.html.push(this.robotHtml(data))
        }
        this.parseHtml(this.options.wxParams.chatData.arrayName, this.options.wxParams.chatData.html.length, this.options.wxParams.chatData.html)
    },
    //发送问题->s=aq
    askQue: function(word) {
        var This = this,
            question = word;//发送的问题

        if(question) {//问题不为空
            //This.options.sendCallback(question);//点击发送按钮的回调
            if(question.indexOf('%我要发文件%')+1) {//发文件
                This.$obj.$chatCtnId.append(This.customHtml('<div class="FA_'+ question.match(/ran\d+/) +' FA_upFileCtn">loading...</div>'));//添加我的话
            }else {//问问题
                This.addMsg(word, true);//添加我的话
                This.request({
                    url: 'servlet/ApiChat',
                    data: {
                        s: 'aq',
                        question: question,
                    },
                    success: function(res) {
                        This.addMsg(res.data);//添加机器人的话
                    }
                })
            }
        }
    },
	// 解析html
	parseHtml: function(arrayName, num, html) {
        var len = html.length

		for(var i=0; i<len; i++) {
		    WxParse.wxMoreParse('moreData'+i, 'html', html[i], this.options.wxParams.that)
		}

		WxParse.wxParseTemArray(arrayName, "moreData", len, this.options.wxParams.that)
	},
	// 请求方法
	request: function(options) {
		var This = this,
		    params = {//必须参数
		    	sysNum: This.options.info.sysNum,
		    	sourceId: This.options.info.sourceId,
	    	    clientId: This.options.info.clientId,
	    	    access_token: This.options.info.access_token,
		    };

		Common.request({
            url: This.options.info.domain +'/servlet/ApiChat',
		    data: Common.extend(true, {}, params, options.data),
		    header: options.header,
		    method: options.method,
		    success: options.success,
		    fail: options.fail,
		    complete: options.complete
		})
	},
    //机器人结构
    robotHtml: function(data, index) {
    	index = index || 0;//默认渲染机器人的第一句话
        var html = '',
            baseRobotHtml = '',
            gusListHtml = '',
            relateListHtml = '',
            commentHtml = '',
            aId = data.robotAnswer&&data.robotAnswer[index] ? data.robotAnswer[index].aId : 0,//
            cluid = data.robotAnswer&&data.robotAnswer[index] ? data.robotAnswer[index].cluid : 0;//查询问题上下文
        //机器人整体结构
        if(data.webConfig) {//欢迎语结构
            this.robot.robotName = data.webConfig.robotName;//机器人名字
            //%%
            var helloWord = data.webConfig.helloWord;
            if(data.chatLink) {
            	if(data.chatLink.helloWord) {
            		helloWord = data.chatLink.helloWord;
            	}
            }
            html = this.options.kfHtml[0].replace(/%aId%/g, aId).replace(/%cluid%/g, cluid).replace(/%kfPic%/g, this.robot.kfPic).replace(/%robotName%/g, this.robot.robotName).replace(/%helloWord%/g, helloWord).replace(/%formatDate%/g, this.getFormatDate());
        }else if(data.robotAnswer) {//机器人答案
        	if(data.robotAnswer[index]) {
                //智能推荐相关问题结构->.MN_guideQue必须存在，搜索#.MN_guideQue查看原因
                var has_ydWords = false;//是否已有上提示
                if(data.robotAnswer[index].gusList) {
                    if(!data.robotAnswer[index].relateList[0] && data.robotAnswer[index].gusList[0]) {
                        var gusList = data.robotAnswer[index].gusList;
                        if(gusList.length>0){
							gusListHtml= '<p>您是否要咨询以下问题？</p>';
                        	has_ydWords = true;
						}
						for(var i=0; i<gusList.length; i++) {
                            gusListHtml += '<div class="MN_gusList"><span>'+ (i+1) +'. </span><span class="MN_guideQue" sId="'+ gusList[i].solutionId +'" title="'+ gusList[i].seedQuestion.question +'">'+ gusList[i].seedQuestion.question +'</span></div>';
                        }
                    }
                }

                //智能推荐相关问题的上下提示
                if(data.robotAnswer[index].gusWords) {
                    if(!data.robotAnswer[index].relateList[0] && data.robotAnswer[index].gusWords) {
                        var gusWords = data.robotAnswer[index].gusWords,
                        	ydWords = '';

                        if(!has_ydWords) {
                        	ydWords = '<p>'+ (gusWords.ydWords || '您是否要咨询以下问题？') +'</p>';
                        }
                        gusListHtml = ydWords + gusListHtml +'<p>'+ gusWords.afterWords +'</p>';
                    }
            	}

                //手动设置相关问题结构->.MN_guideQue必须存在，搜索#.MN_guideQue查看原因
                if(data.robotAnswer[index].relateList) {
                	if(data.robotAnswer[index].relateList[0]) {
                	    var relateList = data.robotAnswer[index].relateList;

                	    for(var i=0; i<relateList.length; i++) {
                	        relateListHtml += '<div class="MN_relateList"><span>'+ (i+1) +'. </span><span class="MN_guideQue" sId="'+ relateList[i].solutionId +'" title="'+ relateList[i].question +'">'+ relateList[i].question +'</span></div>';
                	    }
                	}
                }

                //是否满意结构
                if(data.robotAnswer[index].aId>1000) {//aId!=0->需要评价
                    //%%
                    commentHtml = this.options.kfHtml[1];
                }
                var ansCon = data.robotAnswer[index].ansCon;
                //%%
                html = this.options.kfHtml[2].replace(/%kfPic%/g, this.robot.kfPic).replace(/%robotName%/g, this.robot.robotName).replace(/%ansCon%/g, this.replaceFace(ansCon)).replace(/%formatDate%/g, data.robotAnswer[index].time?this.getFormatDate(data.robotAnswer[index].time):this.getFormatDate()).replace(/%gusListHtml%/g, gusListHtml).replace(/%relateListHtml%/g, relateListHtml).replace(/%commentHtml%/g, commentHtml).replace(/%aId%/g, aId).replace(/%cluid%/g, cluid);
        	}
        }else {//彻底下线
            this.showMsg(data.message);//请重新刷新访问
        }

        return html;
    },
    //客户结构
    customHtml: function(word, time) {
        var html = '';

        html = this.options.khHtml.replace(/%khPic%/g, this.robot.khPic).replace(/%askWord%/g, word).replace(/%formatDate%/g, time?this.getFormatDate(time):this.getFormatDate());
        return html;
    },
    //转义表情 --- 表情插件需重写
    replaceFace: function(data) {
        /*if(this.options.faceModule.open) {
            var src = this.options.faceModule.faceObj.options.src,
                faceType = this.options.faceModule.faceObj.obj.faceType,
                face = this.options.faceModule.faceObj.obj.face;

            for(var i in face) {
                if(i == faceType[0]) {
                    for(var j=0; j<face[i].length; j++) {//考虑到含有特殊字符，不用正则
                        while(data.indexOf(face[i][j][1])+1) {
                            var index = data.indexOf(face[i][j][1]),
                                len = face[i][j][1].length,
                                str1 = data.substr(0, index),
                                str2 = data.substr(index+len);
                            data = str1 +'<img src="'+ src + j +'.'+ faceType[2] +'">'+ str2;
                        }
                    }
                }
            }
        }*/
        return data;
    },
    showMsg: function() {

    },
    //获取格式化时间
    getFormatDate: function(time) {// 2016-11-21 09:36:43
        time = time ? time.match(/(\d+)-(\d+)-(\d+)\s(\d+):(\d+):(\d+)/) : [];
        var today = new Date(),
            year = time[1] || today.getFullYear(),
            month = time[2] || this.addZero(today.getMonth() + 1),
            date = time[3] || this.addZero(today.getDate()),
            hour = time[4] || this.addZero(today.getHours()),
            minute = time[5] || this.addZero(today.getMinutes()),
            second = time[6] || this.addZero(today.getSeconds());

        var result = this.options.formatDate.replace(/%hour%/g, hour).replace(/%minute%/g, minute).replace(/%second%/g, second).replace(/%year%/g, year).replace(/%month%/g, month).replace(/%date%/g, date);

        return result;
    },
    //个位数前面加0
    addZero: function(num) {
        return num<10 ? "0" + num : num;
    },
}

exports.Appchat = Appchat
