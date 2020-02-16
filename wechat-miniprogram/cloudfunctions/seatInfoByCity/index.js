// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return await rp({
    method: 'post',
    uri: 'http://198.13.54.206:3001/seat',
    body: {
      province: event.province,
      city: event.city
    },
    json: true
  }).then((parsedBody) => {
    return parsedBody
  })
}