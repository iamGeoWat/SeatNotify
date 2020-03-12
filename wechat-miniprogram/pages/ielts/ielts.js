//toefl.js
//获取应用实例
import Toast from '../../vant/toast/toast.js'
const app = getApp()

Page({
  data: {
    tmplId: 'hBg0YVqqixtUZH-f776yLuJ0EbB9Vl6bFilyb4Q8B8w',
    subscriptionList: [], // empty in production
    cityList: {
      province_list: {
        110000: '北京',
        120000: '天津',
        130000: '河北',
        140000: '山西',
        150000: '内蒙古',
        210000: '辽宁',
        220000: '吉林',
        230000: '黑龙江',
        310000: '上海',
        320000: '江苏',
        330000: '浙江',
        340000: '安徽',
        350000: '福建',
        360000: '江西',
        370000: '山东',
        410000: '河南',
        420000: '湖北',
        430000: '湖南',
        440000: '广东',
        450000: '广西',
        460000: '海南',
        500000: '重庆',
        510000: '四川',
        520000: '贵州',
        530000: '云南',
        610000: '陕西',
        620000: '甘肃',
        650000: '新疆'
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
      duration: 5
    })
    wx.cloud.callFunction({
      name: 'subscriptionGet',
      data: {
        uid: that.data.uid
      },
      success: function (res) {
        console.log(res.result)
        Toast.clear()
        that.setData({
          subscriptionList: res.result
        })
        console.log(that.data.subscriptionList)
      },
      fail: function () {
        Toast.clear()
        Toast.fail('网络错误')
        console.error
      }
    })
  },
  onSubCancel(e) {
    console.log(e)
    // todo: apply del function here
    var that = this
    Toast.loading({
      mask: true,
      message: '正在删除...',
      duration: 5
    })
    wx.cloud.callFunction({
      name: 'subscriptionDel',
      data: {
        sub_id: e.target.id,
        uid: that.data.uid
      },
      success: function (res) {
        console.log(res.result)
        Toast.clear()
        if (res.result === {}) {
          Toast.fail('网络错误')
          console.error
        } else {
          if (res.result.status) {
            Toast.fail('删除失败')
          } else if (res.result.status === 0) {
            Toast.success('删除成功')
            that.loadSubscriptionList()
          }
        }
      },
      fail: function () {
        Toast.clear()
        Toast.fail('网络错误')
        console.error
      }
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
            duration: 5
          })
          // todo: realize this part: add ADD function
          wx.cloud.callFunction({
            name: 'subscriptionAdd',
            data: {
              city: that.data.cityToSub[1].name,
              date: that.data.selectedTestDate,
              uid: that.data.uid
            },
            success: function (res) {
              console.log(res.result)
              Toast.clear()
              if (res.result === {}) {
                Toast.fail('网络错误')
                console.error
              } else {
                if (res.result.status) {
                  Toast.fail('重复订阅')
                } else if (res.result.status === 0) {
                  Toast.success('订阅成功')
                }
              }
            },
            fail: function () {
              Toast.clear()
              Toast.fail('网络错误')
              console.error
            }
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
  loadSelectedCityInfo(city) {
    var that = this
    console.log(city)
    Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 0
    })
    //load information on server here
    wx.cloud.callFunction({
      // 云函数名称
      name: 'ieltsSeatInfoByProvince',
      // 传给云函数的参数
      data: {
        province: city[0].name
      },
      success: function (res) {
        Toast.clear()
        if (res.result.length === 0) {
          Toast.fail('网络错误')
        }
        console.log(res.result)
        that.setData({
          selectedCityInfo: res.result,
        })
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
        Toast.clear()
        Toast.fail('网络错误')
        console.error
      }
    })
    // load last update time
    wx.cloud.callFunction({
      name: 'ieltsLastUpdateTime',
      success: function (res) {
        console.log(res.result)
        var date = new Date(parseInt(res.result) * 1000)
        var timeString = date.toLocaleString()
        console.log(timeString)
        that.setData({
          lastUpdateTime: timeString
        })
      }
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
    wx.cloud.callFunction({
      name: 'testDaysList',
      success: function (res) {
        console.log(res.result)
        var str = res.result.substring(res.result.indexOf('[') + 1, res.result.lastIndexOf(']'))
        console.log(str)
        var reg1 = new RegExp("'", "g")
        var str = str.replace(reg1, "")
        var reg2 = new RegExp(" ", "g")
        var str = str.replace(reg2, "")
        var arr = str.split(',')
        console.log(arr)
        that.setData({
          testDaysList: arr
        })
        console.log(that.data)
        Toast.clear()
      },
      fail: function () {
        Toast.clear()
        Toast.fail('获取考试日期错误')
        console.error
      }
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
  bindViewTap: function () {
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
    } else if (this.data.canIUse) {
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
  getUserInfo: function (e) {
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
