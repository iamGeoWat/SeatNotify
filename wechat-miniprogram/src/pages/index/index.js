//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    ifShowMessageBoard: false,
    messageBoard: [{_id: '1', text: '加载中...', time: 'Now: '}]
  },
  showMessageBoard: function () {
    var that = this
    that.setData({
      ifShowMessageBoard: true
    })
    wx.cloud.callFunction({
      name: 'getMessageBoard',
      success: function (res) {
        console.log(res.result.data)
        var sortedData = res.result.data
        sortedData.sort((a, b) => { return a['index'] - b['index'] })
        that.setData({
          messageBoard: sortedData
        })
      }
    })
  },
  onMessageBoardClose: function () {
    this.setData({
      ifShowMessageBoard: false
    })
  },
  onLoad: function () {},
})
