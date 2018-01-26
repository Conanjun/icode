var app = getApp()
console.log(app, 'success')

var Common = require('../../js/common').Common
var Appchat = require('../../js/appchat').Appchat


//console.log(Appchat)

var WxParse = require('../../component/wxParse/wxParse.js')
/*var WxTip = require('../../component/wxTip/wxTip.js').WxTip*/


Page({
    data: {
        inputWord: '',// 输入框文本
        vb_editCtn_style: {// 输入框样式
            'height': '100rpx'
        },
        vb_sendBtn_style: {// 发送样式
            'show': 0
        },
        imgs: {// 所有的图片素材
            faceBtn: '../../images/faceBtn.png',
            moreBtn: '../../images/moreBtn.png',
        },

    },
    onLoad: function(e) {
    },
    onShow: function() {
        this.login()
    },
    wxParseImgLoad: function() {

    },
    change: function() {

    },
    // 获取用户信息
    login: function() {
        var This = this
        // 验证登录
        wx.login({
            success: function(loginRes) {
                // 获取用户信息
                wx.getUserInfo({
                    success: function(res) {
                        This.initApp(loginRes);
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
    // 实例化 App
    initApp: function(res) {
        var This = this
        // 获取 token
        Common.request({
            url: app.domain +'/token/getToken',
            data: {
                appId: 'lXm32SUSOYh39wRbCZ',
                secret: 'GAsZAxQ5KCA0CB8B4BDD'
            },
            success: function(data) {
                This.App = new Appchat({
                    // 基础信息参数
                    info: {
                        domain: app.domain,
                        clientId: res.code,
                        access_token: data.data.access_token,

                    },
                    // 微信有关参数
                    wxParams: {
                        that: This,
                        chatData: {
                            num: 0
                            
                        }
                    },
                    kfPic: '/robot/skin/h5chat/images/robot.png',  //客服图标
                    khPic: '/robot/skin/h5chat/images/user.png', //客户图标

                })
            }
        })
    },
    // 文字改变事件
    input: function(e) {
        //this.data.vb_sendBtn_style.show = e.detail.cursor
        this.setData({
            inputWord: e.detail.value,
            vb_sendBtn_style: this.data.vb_sendBtn_style,
        })
    },
    appEvent: function(e) {
        console.log(e)
    },
    chatEvent: function(e) {
        // 发送
        if(e.target.dataset.id == 'sendBtn') {
            //this.App.sendBtn(this.data.inputWord);
            this.App.askQue(this.data.inputWord);
            // 清空输入框
            this.data.vb_sendBtn_style.show = ''
            this.setData({
                inputWord: '',
                vb_sendBtn_style: this.data.vb_sendBtn_style,
            })
        }
        // 发送
        if(e.target.dataset.id == 'faceBtn') {
        }

    },
})




