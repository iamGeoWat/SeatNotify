// 云函数入口文件
const cloud = require('wx-server-sdk')
const http = require('http')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return new Promise((resolve, reject) => {
    http.get('http://207.148.92.101:3001/lastUpdateTime', (res) => {
      var rawData = ''
      res.on('data', (d) => {
        rawData += d
      })
      res.on('end', () => {
        resolve(rawData.toString())
      })
    })
  })
}