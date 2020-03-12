// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return await rp({
    method: 'post',
    uri: 'http://207.148.92.101:3001/ieltsSeat',
    body: {
      province: event.province
    },
    json: true
  }).then((parsedBody) => {
    return parsedBody
  })
}