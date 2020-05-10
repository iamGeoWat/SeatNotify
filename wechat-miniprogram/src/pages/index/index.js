//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    ifShowAdText: false,
    adText: '',
    ifShowMessageBoard: false,
    messageBoard: [{_id: '1', text: '加载中...', time: 'Now'}]
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
  onLoad: function () {
    var that = this
    wx.cloud.callFunction({
      name: 'getAdText',
      success: function (res) {
        console.log(res)
        that.setData({
          adText: res.result.data[0].text,
          ifShowAdText: res.result.data[0].status
        })
      }
    })
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '看看考位助手',
      path: '/pages/index/index'
    }
  }
})
