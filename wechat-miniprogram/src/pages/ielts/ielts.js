//toefl.js
//获取应用实例
import Toast from '@vant/weapp/toast/toast.js'
const app = getApp()
//card ad part 1
let interstitialAd = null

Page({
  data: {
    tmplId: 'hBg0YVqqixtUZH-f776yLuJ0EbB9Vl6bFilyb4Q8B8w',
    subscriptionList: [], // empty in production
    cityList: {
      province_list: {
        11: '北京',
        12: '天津',
        13: '河北',
        14: '山西',
        15: '内蒙古',
        21: '辽宁',
        22: '吉林',
        23: '黑龙江',
        31: '上海',
        32: '江苏',
        33: '浙江',
        34: '安徽',
        35: '福建',
        36: '江西',
        37: '山东',
        41: '河南',
        42: '湖北',
        43: '湖南',
        44: '广东',
        45: '广西',
        46: '海南',
        50: '重庆',
        51: '四川',
        52: '贵州',
        53: '云南',
        61: '陕西',
        62: '甘肃',
        65: '新疆'
      }
    },
    activeHelper: '0',
    selectedTestDate: '',
    showTestDateSelector: false,
    testDaysList: [],
    lastUpdateTime: '',
    cityToSub: [{ code: '', name: '' }, { code: '', name: '' }],
    activeDisplayType: 0,
    cityInfoToShow: [],
    selectedCityInfo: [],
    selectedCity: [{ code: '', name: '' }, { code: '', name: '' }],
    showCitySelector: false,
    activeTab: 0, //change in production
    loggedIn: false, //change in production
    userInfo: {},
    uid: '未登录',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  onHelperCollapseChange(e) {
    console.log(e)
    this.setData({
      activeHelper: e.detail
    })
  },
  onSubTabChange(e) {
    var that = this
    console.log(e.detail.index)
    if (e.detail.index === 1) {
      that.loadSubscriptionList()
    }
  },
  loadSubscriptionList() {
    // todo: apply read function here
    var that = this
    Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 5000
    })
    console.log(that.data.uid)
    wx.request({
      url: app.globalData.requestUrl + '/ieltsSubscription',
      data: {
        uid: that.data.uid
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        Toast.clear()
        that.setData({
          subscriptionList: res.data
        })
        console.log(that.data.subscriptionList)
      },
      fail: function () {
        Toast.clear()
        Toast.fail('网络错误，请重试一下哦')
        console.error
      },
      timeout: 5000
    })
  },
  onSubCancel(e) {
    console.log(e)
    // todo: apply del function here
    var that = this
    Toast.loading({
      mask: true,
      message: '正在删除...',
      duration: 5000
    })
    wx.request({
      url: app.globalData.requestUrl + '/ieltsSubscription',
      data: {
        sub_id: e.target.id,
        uid: that.data.uid
      },
      method: 'DELETE',
      success: function (res) {
        console.log(res.data)
        Toast.clear()
        if (res.data === {}) {
          Toast.fail('网络错误，请重试一下哦')
          console.error
        } else {
          if (res.data.status) {
            Toast.fail('删除失败')
          } else if (res.data.status === 0) {
            that.loadSubscriptionList()
          }
        }
      },
      fail: function () {
        Toast.clear()
        Toast.fail('网络错误，请重试一下哦')
        console.error
      },
      timeout: 5000
    })
  },
  onTestDateSelectorOpen() {
    var that = this
    if (that.data.testDaysList.length === 0) {
      that.loadTestDays()
    } else {
      that.setData({
        showTestDateSelector: true
      })
    }
  },
  onTestDateSelectorConfirm(e) {
    console.log(e)
    this.setData({
      selectedTestDate: e.detail.value,
      showTestDateSelector: false
    })
  },
  onTestDateSelectorCancel() {
    this.setData({
      showTestDateSelector: false
    })
  },
  onSubmitCityToSub() {
    var that = this
    console.log(this.data.cityToSub)
    wx.requestSubscribeMessage({
      tmplIds: [that.data.tmplId],
      success: function (res) {
        console.log(res[that.data.tmplId])
        if (res[that.data.tmplId] === 'reject') {
          Toast.fail('请允许通知')
        } else if (res[that.data.tmplId] === 'accept') {
          Toast.loading({
            mask: true,
            message: '正在提交...',
            duration: 5000
          })
          // todo: realize this part: add ADD function
          wx.request({
            url: app.globalData.requestUrl + '/ieltsSubscription',
            data: {
              city: that.data.cityToSub[0].name,
              date: that.data.selectedTestDate,
              uid: that.data.uid
            },
            method: 'POST',
            success: function (res) {
              console.log(res.data)
              Toast.clear()
              if (res.data === {}) {
                Toast.fail('网络错误，请重试一下哦')
                console.error
              } else {
                if (res.data.status) {
                  Toast.fail('重复订阅，请删除已有项目')
                } else if (res.data.status === 0) {
                  Toast.success('订阅成功')
                  // card ad part 3
                  setTimeout(() => {
                    if (interstitialAd) {
                      interstitialAd.show().catch((err) => {
                        console.error(err)
                      })
                    }
                  }, 800)
                }
              }
            },
            fail: function () {
              Toast.clear()
              Toast.fail('网络错误，请重试一下哦')
              console.error
            },
            timeout: 5000
          })
        }
      }
    })
  },
  onCityToSubConfirm(e) {
    this.setData({
      cityToSub: e.detail.values,
      showCitySelector: false
    })
  },
  loadSelectedCityInfo(city) {
    var that = this
    console.log(city)
    Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 0
    })
    //load information on server here
    wx.request({
      url: app.globalData.requestUrl + '/ieltsSeat',
      data: {
        province: city[0].name
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        console.log('2')
        Toast.clear()
        if (res.data.length === 0) {
          Toast.fail('网络错误，请重试一下哦')
        }
        console.log(res.data)
        that.data.selectedCityInfo = res.data
        if (that.data.activeDisplayType === 0) {
          that.setData({
            cityInfoToShow: that.sortCityInfo(that.data.selectedCityInfo, "date")
          })
        } else if (that.data.activeDisplayType === 1) {
          that.setData({
            cityInfoToShow: that.sortCityInfo(that.data.selectedCityInfo, "centerNameCn")
          })
        }
      },
      fail: function () {
        console.log('1')
        Toast.clear()
        Toast.fail('网络错误，请重试一下哦')
        console.error
      },
      timeout: 5000
    })

    // load last update time
    wx.request({
      url: app.globalData.requestUrl + '/ieltsLastUpdateTime',
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var date = new Date(parseInt(res.data) * 1000)
        var timeString = date.toLocaleString()
        console.log(timeString)
        that.setData({
          lastUpdateTime: timeString
        })
      },
      timeout: 5000
    })
  },
  onDisplayTypeChange(e) {
    this.setData({
      activeDisplayType: e.detail.index
    })
    // this.loadSelectedCityInfo(this.data.selectedCity)
    if (this.data.activeDisplayType === 0) {
      this.setData({
        cityInfoToShow: this.sortCityInfo(this.data.selectedCityInfo, "date")
      })
    } else if (this.data.activeDisplayType === 1) {
      this.setData({
        cityInfoToShow: this.sortCityInfo(this.data.selectedCityInfo, "centerNameCn")
      })
    }
    console.log(this.data.activeDisplayType)
  },
  onCitySelectorConfirm(e) {
    console.log(e)
    this.loadSelectedCityInfo(e.detail.values)
    this.setData({
      selectedCity: e.detail.values,
      showCitySelector: false
    })
  },
  onCitySelectorCancel() {
    this.setData({
      showCitySelector: false
    })
  },
  onCitySelectorOpen() {
    this.setData({
      showCitySelector: true
    })
  },
  onTabChange(e) {
    var that = this
    console.log('tab changed', e.detail)
    that.setData({
      activeTab: e.detail
    })
  },
  loadTestDays() {
    var that = this
    Toast.loading({
      mask: true,
      message: '获取考试日期',
      duration: 0
    })
    wx.request({
      url: app.globalData.requestUrl + '/ieltsTestDaysList',
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        var str = res.data.substring(res.data.indexOf('{') + 1, res.data.lastIndexOf('}'))
        console.log(str)
        var reg1 = new RegExp("'", "g")
        var str = str.replace(reg1, "")
        var reg2 = new RegExp(" ", "g")
        var str = str.replace(reg2, "")
        var arr = str.split(',')
        console.log(arr)
        arr = arr.sort(function (b, a) { return Date.parse(b.replace(/-/g, "/")) - Date.parse(a.replace(/-/g, "/")) })
        that.setData({
          testDaysList: arr
        })
        console.log(that.data)
        Toast.clear()
      },
      fail: function () {
        Toast.clear()
        Toast.fail('网络错误，请重试一下哦')
        console.error
      },
      timeout: 5000
    })
  },
  onGetUserInfo(e) {
    var that = this
    that.setData({
      uid: '未登录',
      loggedIn: false
    })
    wx.cloud.callFunction({
      name: 'login',
      success: function (res) {
        console.log(res.result)
        console.log(res.result.openid)
        that.setData({
          uid: res.result.openid,
          loggedIn: true
        })
        wx.setStorage({
          key: 'uid',
          data: res.result.openid,
          fail: function (e) {
            console.log(e)
          }
        })
      }
    })
  },
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    // 进入页面时检查storage里有没有uid
    var that = this
    wx.getStorage({
      key: 'uid',
      success: function (res) {
        console.log('uid exists: ' + res.data)
        that.setData({
          uid: res.data,
          loggedIn: true
        })
      }
    })
    if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          // userInfo: res.userInfo,
          // hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          // app.globalData.userInfo = res.userInfo
          this.setData({
            // userInfo: res.userInfo,
            // hasUserInfo: true
          })
        }
      })
    }
    //card ad part 2
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({ adUnitId: 'adunit-26b28cca79272a47' })
      interstitialAd.onLoad(() => {
        console.log('ad load event emit')
      })
      interstitialAd.onError((err) => {
        console.log('ad error event emit', err)
      })
      interstitialAd.onClose((res) => {
        console.log('ad close event emit', res)
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    // app.globalData.userInfo = e.detail.userInfo
    this.setData({
      // userInfo: e.detail.userInfo,
      // hasUserInfo: true
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
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      console.log(res.target)
    }
    return {
      title: '这里可以查询、监控雅思考位，快来看看吧！',
      path: '/pages/index/index'
    }
  }
})
