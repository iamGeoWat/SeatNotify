const axios = require('axios')
const wxConf = require('../config/wxConfig')
const Redis = require('ioredis')
let actRedis = new Redis()

actRedis.get('access_token').then((access_token) => {
  console.log(access_token)
  axios.post(wxConf.subscribeMessageSendUrl + access_token, {
    access_token: access_token,
    touser: 'owVzd4s0skn2zuL4XVbkYFrHpBgE',
    template_id: wxConf.template_id,
    data: {
      "thing1": {"value": "托福考位释放"},
      "thing3": {"value": "合肥"},
      "date5": {"value": "2020-04-11"},
      "name4": {"value": '看看考位助手'},
      "thing6": {"value": "考位已释放，请前往中国托福官网报名"}
    }
  }).then((data) => {
    console.log(data)
  })
})