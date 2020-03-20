//app.js
App({
  onLaunch: function () {
    wx.cloud.init()
  },
  globalData: {
    requestUrl: 'https://liuxikai.com'
    // requestUrl: 'http://207.148.92.101:3001'
    // userInfo: null,
    // uid: null
  }
})