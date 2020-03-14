//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
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
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {},
})
