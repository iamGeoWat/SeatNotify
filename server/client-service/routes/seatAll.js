var express = require('express');
var router = express.Router();
var Redis = require('ioredis');
var redis = new Redis();

/* GET users listing. */
router.get('/', function(req, res, next) {
  redis.get('seat').then(async function (rawData) {
    var infoList = eval(rawData);
    res.send(infoList);
  })
});

module.exports = router;
