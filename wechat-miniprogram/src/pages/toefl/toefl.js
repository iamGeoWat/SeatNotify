//toefl.js
//获取应用实例
import Toast from '@vant/weapp/toast/toast.js'
const app = getApp()

Page({
  data: {
    tmplId: 'hBg0YVqqixtUZH-f776yLuJ0EbB9Vl6bFilyb4Q8B8w',
    subscriptionList: [], // empty in production
    cityList: {
      province_list: {
        110000: '安徽',
        120000: '北京',
        130000: '重庆',
        140000: '福建',
        150000: '甘肃',
        160000: '广东',
        170000: '海南',
        180000: '河北',
        190000: '黑龙江',
        200000: '河南',
        210000: '湖北',
        220000: '湖南',
        230000: '内蒙古',
        240000: '江苏',
        250000: '江西',
        260000: '吉林',
        270000: '辽宁',
        280000: '陕西',
        290000: '山东',
        300000: '上海',
        310000: '山西',
        320000: '四川',
        330000: '天津',
        340000: '新疆',
        350000: '云南',
        360000: '浙江',
      },
      city_list: {
        110100: '合肥',
        120100: '北京',
        130100: '重庆',
        140100: '福州',
        140200: '厦门',
        150100: '兰州',
        160100: '东莞',
        160200: '广州',
        160300: '深圳',
        170100: '海口',
        180100: '石家庄',
        190100: '哈尔滨',
        200100: '开封',
        200200: '洛阳',
        200300: '郑州',
        210100: '武汉',
        220100: '长沙',
        230100: '呼和浩特',
        240100: '常州',
        240200: '南京',
        240300: '南通',
        240400: '苏州',
        240500: '太仓',
        240600: '徐州',
        240700: '扬州',
        250100: '南昌',
        260100: '长春',
        260200: '延吉',
        270100: '大连',
        270200: '沈阳',
        280100: '西安',
        290100: '济南',
        290200: '临沂',
        290300: '青岛',
        290400: '潍坊',
        290500: '威海',
        290600: '烟台',
        300100: '上海',
        310100: '太原',
        320100: '成都',
        320200: '绵阳',
        330100: '天津',
        340100: '乌鲁木齐',
        350100: '昆明',
        360100: '杭州',
        360200: '宁波',
        360300: '温州',
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
        Toast.fail('网络错误，请重试一下哦')
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
          Toast.fail('网络错误，请重试一下哦')
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
        Toast.fail('网络错误，请重试一下哦')
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
                Toast.fail('网络错误，请重试一下哦')
                console.error
              } else {
                if (res.result.status) {
                  Toast.fail('重复订阅，请删除已有项目')
                } else if (res.result.status === 0) {
                  Toast.success('订阅成功')
                }
              }
            },
            fail: function () {
              Toast.clear()
              Toast.fail('网络错误，请重试一下哦')
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
      name: 'seatInfoByCity',
      // 传给云函数的参数
      data: {
        province: city[0].name,
        city: city[1].name
      },
      success: function (res) {
        Toast.clear()
        if (res.result.length === 0) {
          Toast.fail('网络错误，请重试一下哦')
        }
        console.log(res.result)
        that.data.selectedCityInfo = res.result
        // that.setData({
        //   selectedCityInfo: res.result,
        // })
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
        Toast.fail('网络错误，请重试一下哦')
        console.error
      }
    })
    // load last update time
    wx.cloud.callFunction({
      name: 'lastUpdateTime',
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
        Toast.fail('网络错误，请重试一下哦')
        console.error
      }
    })
  },
  onGotUserInfo(e) {
    var that = this
    // this.setData({
    //   userInfo: e.detail.userInfo,
    // })
    // app.globalData.userInfo = e.detail.userInfo
    wx.cloud.callFunction({
      name: 'login',
      success: function (res) {
        console.log(res.result)
        console.log(res.result.openid)
        that.setData({
          uid: res.result.openid
        })
        // app.globalData.uid = res.code
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
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else 
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
  }
})
