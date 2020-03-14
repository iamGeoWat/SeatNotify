//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    loggedIn: false, //change in production
    userInfo: {},
    uid: '未登录',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  onEntryToefl() {
    wx.redirectTo({
      url: '/pages/toefl/toefl',
    })
  },
  onEntryIelts() {
    wx.redirectTo({
      url: '/pages/ielts/ielts',
    })
  },
  onGotUserInfo(e) {
    var that = this
    this.setData({
      userInfo: e.detail.userInfo,
    })
    console.log(that.data.userInfo)
    app.globalData.userInfo = e.detail.userInfo
    wx.cloud.callFunction({
      name: 'login',
      success: function (res) {
        console.log(res.result)
        console.log(res.result.openid)
        that.setData({
          uid: res.result.openid
        })
        app.globalData.uid = res.code
      }
    })
    // wx.login({
    //   success: function (res) {
    //     console.log(res)
    //     that.setData({
    //       uid: res.code
    //     })
    //     app.globalData.uid = res.code
    //   }
    // })
    that.setData({
      loggedIn: true
    })
  },
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  sortCityInfo(data, property) {
    var c = [];
    var d = {};
    data.forEach(element => {
      if (!d[element[property]]) {
        c.push({
          category: property,
          [property]: element[property],
          data: [element]
        });
        d[element[property]] = element;
      } else {
        c.forEach(ele => {
          if (ele[property] == element[property]) {
            ele.data.push(element);
          }
        });
      }

    });
    console.log(c)
    return c;
  }
})
