var express = require('express');
var router = express.Router();
var Redis = require('ioredis');
var redis = new Redis();

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log(req.body.province);
  redis.get('seat').then(async function (rawData) {
    var infoList = eval(rawData);
    var matchedList = [];
    for (var i in infoList) {
      if ((infoList[i].provinceCn === req.body.province) && (infoList[i].cityCn === req.body.city)) {
        matchedList.push(infoList[i])
      }
    }
    for (var j in matchedList) {
      delete matchedList[j].cancelDeadline;
      delete matchedList[j].centerNameEn;
      delete matchedList[j].cityEn;
      delete matchedList[j].lateReg;
      delete matchedList[j].lateRegFlag;
      delete matchedList[j].provinceEn;
      delete matchedList[j].rescheduleDeadline;
      delete matchedList[j].seatBookStatus;
      delete matchedList[j].cityCn;
      delete matchedList[j].provinceCn;
    }
    res.send(matchedList);
})
});

module.exports = router;
