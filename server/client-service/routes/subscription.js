var express = require('express');
var router = express.Router();

const SubscriptionDao = require('../dao/SubscriptionDao');
const subscriptionDao = new SubscriptionDao()

router.get('/', async (req, res, next) => {
  console.log(req.body)
  console.log(req.params.uid)
  console.log(req.query.uid)
  var result = await subscriptionDao.queryByUid(req.query.uid)
  res.send(result)
});

router.post('/', async (req, res, next) => {
  console.log(req.body)
  var checkDupResult = await subscriptionDao.queryByUidCityDate(req.body.uid, req.body.city, req.body.date)
  if (checkDupResult.length === 0) {
    await subscriptionDao.add(req.body.uid, req.body.city, req.body.date, 0, 0, 0)
    res.send({status: 0, msg: 'success'})
  } else {
    let isDup = false
    for (let i = 0; i < checkDupResult.length; i++ ) {
      if (checkDupResult[i].cancelled === 0) {
        isDup = true
        res.send({status: 1, msg: 'duplicated'})
        break;
      }
    }
    if (!isDup) {
      await subscriptionDao.add(req.body.uid, req.body.city, req.body.date, 0, 0, 0)
      res.send({status: 0, msg: 'success'})
    }
  }
});

router.delete('/', async (req, res, next) => {
  console.log(req.body.sub_id, req.body.uid)
  var result = await subscriptionDao.delBySubidUid(req.body.sub_id, req.body.uid)
  if (result) {
    res.send({status: 0, msg: 'success'})
  } else {
    res.send({status: 1, msg: 'error'})
  }
});

module.exports = router;
