var express = require('express');
var router = express.Router();
var Redis = require('ioredis');
var redis = new Redis();

/* GET users listing. */
router.get('/', function(req, res, next) {
  redis.get('ielts_days_list').then(async function (data) {
    res.send(data);
  })
});

module.exports = router;
