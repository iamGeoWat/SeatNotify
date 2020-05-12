var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('You are connected to a server at my home.')
});

module.exports = router;
