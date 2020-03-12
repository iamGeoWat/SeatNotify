console.log('ielts notification service started.');
const axios = require('axios');
let Redis = require('ioredis');
let subRedis = new Redis();
let actRedis = new Redis();
const SubscriptionDao = require('../dao/IeltsSubscriptionDao');
const subscriptionDao = new SubscriptionDao();
const wxConf = require('../config/wxConfig');

subRedis.subscribe("ielts_update_timestamp", (err, count) => {
  console.log("err:", err);
  console.log("count:", count);
  subRedis.on("message", async (channel, message) => {
    console.log("channel:", channel);
    console.log("msg:", message);
    if (message === '') {
      console.log('info core test days loading error.')
    } else {
      actRedis.get('ielts_seat').then(async (records) => {
        //--------- prepare subscribe data in DB --------- OUTPUT: { city@date: itsSubscribers }
        let hotSubs = await subscriptionDao.queryHotSubs();
        if (hotSubs.length === 0) {
          console.log('No db record in seat_service')
        } else {
          console.log(hotSubs);
          let cityAtDateAndItsSubscribers = {}; //这样更简单，但是把前后端所有cn改成en更好
          let subscribedCityAtDate = new Set();
          for (let hotSub of hotSubs) {
            console.log(hotSub['city']);
            subscribedCityAtDate.add(hotSub['city']+'@'+hotSub['date'])
          }
          for (let cityAtDate of subscribedCityAtDate) {
            cityAtDateAndItsSubscribers[cityAtDate] = []
          }
          for (let hotSub of hotSubs) {
            cityAtDateAndItsSubscribers[hotSub['city']+'@'+hotSub['date']].push(hotSub['uid'])
          }
          console.log(subscribedCityAtDate);
          console.log(cityAtDateAndItsSubscribers);
          
          //---------- prepare seat status data in REDIS ------- OUTPUT: { city@date: how-many-seats-left }
          let parsedRecords = eval(records);
          let cityAtDateAndSeatNum = {}; //seat num is the num of test centers that have seats
          for (let cityAtDate of subscribedCityAtDate) {
            cityAtDateAndSeatNum[cityAtDate] = 0
          }
          for (let record of parsedRecords) {
            if (subscribedCityAtDate.has(record['cityCn']+'@'+record['date'])) {
              if (record['seatStatus'] === 1) {
                cityAtDateAndSeatNum[record['cityCn']+'@'+record['date']] += record['seatStatus']
              } // prevent status code that is not 0 and 1
            }
          }
          console.log(cityAtDateAndSeatNum);
          
          //check every city@date from cityAtDateAndItsSubscribers in cityAtDateAndSeatNum, if not 0, mod db::has_seat, do notify, mod db::notified.
          for (let cityAtDate of subscribedCityAtDate) {
            console.log(cityAtDate);
            if (cityAtDateAndSeatNum[cityAtDate] !== 0) {
              // mod db::has_seat
              let splitCityAndDate = cityAtDate.split('@');
              console.log(splitCityAndDate);
              console.log(cityAtDateAndItsSubscribers[cityAtDate]);
              for (let uid of cityAtDateAndItsSubscribers[cityAtDate]) {
                await subscriptionDao.modHasSeatByUidCityDate(1, uid, splitCityAndDate[0], splitCityAndDate[1] )
                console.log('ACTION: has_seat modified for ', uid)
              } // mod db::has_seat
              for (let uid of cityAtDateAndItsSubscribers[cityAtDate]) {
                console.log('ACTION: sending notification to...', uid);
                actRedis.get('access_token').then((access_token) => {
                  axios.post(wxConf.subscribeMessageSendUrl + access_token, {
                    access_token: access_token,
                    touser: uid,
                    template_id: wxConf.template_id,
                    data: {
                      "thing1": {"value": "雅思考位释放"},
                      "thing3": {"value": splitCityAndDate[0]},
                      "date5": {"value": splitCityAndDate[1]},
                      "name4": {"value": "看看考位助手"},
                      "thing6": {"value": "考位已释放，请前往中国雅思官网报名"}
                    }
                  }).then(async (msg) => {
                    console.log(msg.data);
                    if (msg.data.errcode === 0) {
                      await subscriptionDao.modNotifiedByUidCityDate(1, uid, splitCityAndDate[0], splitCityAndDate[1])
                      console.log('ACTION: notified modified for ', uid)
                    }
                  })
                })
              }// send notification, mod db::notified in callback
            }
          }
        }
      })
    }
  })
});