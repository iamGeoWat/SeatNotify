//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
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
    activeDisplayType: 0,
    cityInfoToShow: [],
    selectedCityInfo: [],
    selectedCity: [{code:'',name:''},{code:'',name:''}],
    showCitySelector: false,
    activeTab: 0,
    loggedIn: true,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  loadSelectedCityInfo(city) {
    this.setData({
      selectedCityInfo: [{
        centerCode: 'STN80008A',
        centerNameCn: '中国科学技术大学',
        testFee: '198500',
        seatStatus: 0,
        testTime: ' 09:00',
        date: '2020-03-10',
        city: 'BEIJING'
      }, {
        centerCode: 'STN80008B',
        centerNameCn: '中国科学技术大学',
        testFee: '198500',
        seatStatus: 0,
        testTime: ' 09:00',
        date: '2020-03-15',
        city: 'BEIJING'
      }, {
        centerCode: 'STN80009A',
        centerNameCn: '北京大学',
        testFee: '198500',
        seatStatus: 1,
        testTime: ' 09:00',
        date: '2020-03-11',
        city: 'BEIJING'
      }, {
        centerCode: 'STN80009B',
        centerNameCn: '北京大学',
        testFee: '198500',
        seatStatus: 0,
        testTime: ' 09:00',
        date: '2020-03-12',
        city: 'BEIJING'
      }, {
        centerCode: 'STN80009B',
        centerNameCn: '北京大学',
        testFee: '198500',
        seatStatus: 0,
        testTime: ' 09:00',
        date: '2020-03-15',
        city: 'BEIJING'
      }, {
        centerCode: 'STN80009B',
        centerNameCn: '北京大学',
        testFee: '198500',
        seatStatus: 0,
        testTime: ' 09:00',
        date: '2020-03-18',
        city: 'BEIJING'
      }, {
        centerCode: 'STN80009B',
        centerNameCn: '北京大学',
        testFee: '198500',
        seatStatus: 0,
        testTime: ' 09:00',
        date: '2020-03-19',
        city: 'BEIJING'
      }, {
        centerCode: 'STN80009B',
        centerNameCn: '北京大学',
        testFee: '198500',
        seatStatus: 0,
        testTime: ' 09:00',
        date: '2020-03-17',
        city: 'BEIJING'
      }, {
        centerCode: 'STN80009A',
        centerNameCn: '北京大学',
        testFee: '198500',
        seatStatus: 1,
        testTime: ' 09:00',
        date: '2020-03-11',
        city: 'BEIJING'
      }, {
        centerCode: 'STN80009B',
        centerNameCn: '北京大学',
        testFee: '198500',
        seatStatus: 0,
        testTime: ' 09:00',
        date: '2020-03-12',
        city: 'BEIJING'
      }, {
        centerCode: 'STN80009B',
        centerNameCn: '北京大学',
        testFee: '198500',
        seatStatus: 0,
        testTime: ' 09:00',
        date: '2020-03-15',
        city: 'BEIJING'
      }, {
        centerCode: 'STN80009B',
        centerNameCn: '北京大学',
        testFee: '198500',
        seatStatus: 0,
        testTime: ' 09:00',
        date: '2020-03-18',
        city: 'BEIJING'
      }, {
        centerCode: 'STN80009B',
        centerNameCn: '北京大学',
        testFee: '198500',
        seatStatus: 0,
        testTime: ' 09:00',
        date: '2020-03-19',
        city: 'BEIJING'
      }, {
        centerCode: 'STN80009B',
        centerNameCn: '北京大学',
        testFee: '198500',
        seatStatus: 0,
        testTime: ' 09:00',
        date: '2020-03-17',
        city: 'BEIJING'
      }]
    })

    if (this.data.activeDisplayType === 0) {
      this.setData({
        cityInfoToShow: this.sortCityInfo(this.data.selectedCityInfo, "date")
      })
    } else if (this.data.activeDisplayType === 1) {
      this.setData({
        cityInfoToShow: this.sortCityInfo(this.data.selectedCityInfo, "centerNameCn")
      })
    }
  },
  onDisplayTypeChange(e) {
    this.setData({
      activeDisplayType: e.detail.index
    })
    this.loadSelectedCityInfo(this.data.selectedCity)
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
    this.setData({
      activeTab: e.detail
    })
  },
  onGotUserInfo(e) {
    var that = this
    this.setData({
      userInfo: e.detail.userInfo,
      avatarUrl: e.detail.userInfo.avatarUrl
    })
    // console.log(this.data.userInfo)
    app.globalData.userInfo = e.detail.userInfo
    wx.login({
      success: function (res) {
        console.log(res)
      }
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
