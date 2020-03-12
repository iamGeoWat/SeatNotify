// 云函数入口文件
const cloud = require('wx-server-sdk')
var rp = require('request-promise')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return await rp({
    method: 'delete',
    uri: 'http://207.148.92.101:3001/ieltsSubscription',
    body: {
      sub_id: event.sub_id,
      uid: event.uid
    },
    json: true
  }).then((parsedBody) => {
    return parsedBody
  })
}