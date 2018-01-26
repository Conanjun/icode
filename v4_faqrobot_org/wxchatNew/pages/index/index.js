var app = getApp()

var Common = require('./common').Common

Page({
  data: {
    scrollTop: 0,
    inputWord: '', // 输入框文本
    vb_editCtn_style: { // 输入框样式
      'height': '100rpx'
    },
    // 基础信息参数
    domain: app.domain, // 域名
    sysNum: 1000000, // 客户唯一标识
    sourceId: 0, // 客户来源
    clientId: 0,
    jid: 0, // 自定义客服客户图标
    access_token: '',
    appId: 'lXm32SUSOYh39wRbCZ',
    appSecret: 'GAsZAxQ5KCA0CB8B4BDD',
    webName: '云问科技', //公司名称
    kfPic: '/robot/skin/h5chat/images/robot.png', //客服图标
    khPic: '/robot/skin/h5chat/images/user.png', //客户图标
    uselessReasonItems: [],
    robotName: '',
    chatRecords: []
  },
  onReady: function() {
    // 获取用户信息
    var This = this
    // 验证登录
    wx.login({
      success: function(loginRes) {
        // 获取用户信息
        wx.getUserInfo({
          withCredentials: false,
          success: function() {
            // 获取 token
            Common.request({
              url: app.domain + '/token/getToken',
              data: {
                appId: This.data.appId,
                secret: This.data.appSecret
              },
              success: function(data) {
                if(data.statusCode === 404) {
                  Common.showToast({
                    title: 'Token请求失败！'
                  })
                  return;
                }
                This.setData({
                  clientId: loginRes.code,
                  access_token: data.data.access_token
                });
                // 初始化基本信息->s=p->logo/欢迎语/快捷服务/热门问题/用户信息
                This.request({
                  url: 'servlet/ApiChat',
                  data: {
                    s: 'p',
                  },
                  success: function(res) {
                    if(res.data.errorCode && res.data.errorCode === -1) {
                      Common.showToast({
                        title: res.data.message
                      })
                      return;
                    }
                    if(res.data.skinConfig) {
                      This.setData({
                        kfPic: res.data.skinConfig.kfPic,
                        khPic: res.data.skinConfig.khPic
                      });
                    }
                    if(res.data.uselessReasonItems) {
                      This.setData({
                        uselessReasonItems: res.data.uselessReasonItems
                      });
                    }
                    // 设置公司名
                    wx.setNavigationBarTitle({
                      title: res.data.webConfig.webName || This.data.webName
                    })
                    This.setData({
                      robotName: res.data.webConfig.robotName
                    });
                    //插入欢迎
                    var helloWord = res.data.webConfig.helloWord;
                    if (res.data.chatLink) {
                      if (res.data.chatLink.helloWord) {
                        helloWord = res.data.chatLink.helloWord;
                      }
                    }
                    var dateNow = new Date();
                    var dateStr = dateNow.toLocaleDateString() + ' ' + dateNow.toLocaleTimeString();
                    var helloMsg = {
                      type: 1,
                      img: This.data.domain + This.data.kfPic,
                      msg: helloWord,
                      time: dateStr,
                      robotName: This.data.robotName,
                      leaveQueFlag: 0
                    }
                    //插入留言
                    var leaveQueList = [];
                    if (res.data.leaveQue && res.data.leaveQue[0]) {
                      res.data.leaveQue.forEach(function(el){
                        leaveQueList.push(el);
                      })
                    } else {
                      leaveQueList = null;
                    }
                    helloMsg.leaveQueList = leaveQueList;
                    This.setData({
                      chatRecords: This.data.chatRecords.concat([helloMsg])
                    });
                  }
                })
              }
            })
          },
          fail: function(res) {
            Common.showToast({
              title: res.errMsg
            })
          }
        })
      },
      fail: function(res) {
        Common.showToast({
          title: res.errMsg
        })
      }
    })
  },
  //本页通用的请求方法
  request: function(options) {
    var This = this,
      params = { //必须参数
        sysNum: this.data.sysNum,
        sourceId: this.data.sourceId,
        clientId: this.data.clientId,
        access_token: this.data.access_token
      };
    Common.request({
      url: this.data.domain + '/servlet/ApiChat',
      data: Common.extend(true, {}, params, options.data),
      header: options.header,
      method: options.method,
      success: options.success,
      fail: options.fail,
      complete: options.complete
    })
  },
  // 文字改变事件
  input: function(e) {
    this.setData({
      inputWord: e.detail.value
    })
  },
  //发送方法
  sendMsg: function(param) {
    // 发送问题
    var This = this,
      question = this.data.inputWord;

    if (question || param) {
      var dataJSON = {
        s: 'aq',
        question: question
      }
      if (param) {
        dataJSON = Common.extend(false, {}, dataJSON, param);
        if (param.question) {
          question = param.question;
        }
      }
      var dateNow = new Date();
      var dateStr = dateNow.toLocaleDateString() + ' ' + dateNow.toLocaleTimeString();
      var guestMsg = {
        type: 0,
        img: This.data.domain + This.data.khPic,
        msg: question,
        time: dateStr,
        rank: This.data.chatRecords.length
      }
      This.setData({
        chatRecords: This.data.chatRecords.concat([guestMsg])
      });
      This.srcollToBottom();
      This.request({
        url: 'servlet/ApiChat',
        data: dataJSON,
        success: function(res) {
          //添加机器人的话
          if (res.data.robotAnswer && res.data.robotAnswer[0]) {
            var answer = res.data.robotAnswer[0];
            var dateNow = new Date();
            var dateStr = dateNow.toLocaleDateString() + ' ' + dateNow.toLocaleTimeString();
            var guessWord = '';
            var afterWord = '';
            var guessList = [];
            //手动设置相关问题
            if (answer.relateList && answer.relateList[0]) {
              if(answer.gusWords && answer.gusWords.ydWords) {
                guessWord = answer.gusWords.ydWords;
              } else {
                guessWord = '您是否要咨询以下问题？';
              }
              if(answer.gusWords && answer.gusWords.afterWords) {
                afterWord = answer.gusWords.afterWords;
              }
              answer.relateList.forEach(function(el){
                guessList.push(el);
              })
            }
            if (answer.gusList && answer.gusList[0]) {
              guessList = [];
              if(answer.gusWords && answer.gusWords.ydWords) {
                guessWord = answer.gusWords.ydWords;
              } else {
                guessWord = '您是否要咨询以下问题？';
              }
              if(answer.gusWords && answer.gusWords.afterWords) {
                afterWord = answer.gusWords.afterWords;
              }
              answer.gusList.forEach(function(el){
                guessList.push(el);
              })
            }
            var robotMsg = {
              type: 1,
              img: This.data.domain + This.data.kfPic,
              msg: answer.ansCon,
              time: dateStr,
              robotName: This.data.robotName,
              guessWord: guessWord,
              afterWord: afterWord,
              guessList: guessList,
              aId: answer.aId,
              cluid: answer.cluid,
              rank: This.data.chatRecords.length,
              queComment: '',
              queCommentFlag: 0,
              uselessReasonItems: This.data.uselessReasonItems,
              reasonType: -1,
              uselessReason: ''
            }
            This.setData({
              chatRecords: This.data.chatRecords.concat([robotMsg])
            });
          }
          This.srcollToBottom();
        }
      })
    }
    // 清空输入框
    this.setData({
      inputWord: ''
    })
  },
  //智能推荐点击事件
  guessWordClick: function(event) {
    this.sendMsg({
      question: event.target.dataset.question,
      sId: event.target.dataset.solutionid
    })
  },
  //满意不满意
  queCommentClick: function(event) {
    var This = this;
    this.request({
      url: 'servlet/ApiChat',
      data: {
        s: event.target.dataset.addtype,
        aId: event.target.dataset.aid,
        cluid: event.target.dataset.cluid
      },
      success: function(res) {
        var chatRecordsTemp = This.data.chatRecords;
        chatRecordsTemp[event.target.dataset.rank].queComment = res.data.message;
        if(This.data.uselessReasonItems.length && event.target.dataset.addtype == 'addulc') {
          chatRecordsTemp[event.target.dataset.rank].queCommentFlag = 1;
        } else {
          chatRecordsTemp[event.target.dataset.rank].queCommentFlag = 2;
        }
        This.setData({
          chatRecords: chatRecordsTemp
        });
      }
    });
  },
  reasonChange: function(event) {
    var chatRecordsTemp = this.data.chatRecords;
    chatRecordsTemp[event.target.dataset.rank].reasonType = event.detail.value;
  },
  reasonInput: function(event) {
    var chatRecordsTemp = this.data.chatRecords;
    chatRecordsTemp[event.target.dataset.rank].uselessReason = event.detail.value;
    this.setData({
      chatRecords: chatRecordsTemp
    });
  },
  reasonSubmit: function(event) {
    var This = this;
    var chatRecord = this.data.chatRecords[event.target.dataset.rank]
    this.request({
      url: 'servlet/ApiChat',
      data: {
        s: 'ulreason',
        aId: chatRecord.aid,
        cluid: chatRecord.cluid,
        reasonType: chatRecord.reasonType,
        content: chatRecord.uselessReason
      },
      success: function(res) {
        var chatRecordsTemp = This.data.chatRecords;
        chatRecordsTemp[event.target.dataset.rank].queCommentFlag = 2;
        This.setData({
          chatRecords: chatRecordsTemp
        });
      }
    });
  },
  //留言展开关闭
  leaveQueClick: function() {
    var chatRecordsTemp = this.data.chatRecords;
    chatRecordsTemp[0].leaveQueFlag = !chatRecordsTemp[0].leaveQueFlag;
    this.setData({
      chatRecords: chatRecordsTemp
    });
  },
  //发送点击事件
  sendClick: function() {
    this.sendMsg();
  },
  //滚动到底部
  srcollToBottom: function() {
    this.setData({
      scrollTop: this.data.scrollTop + 1000
    })
  }
})
