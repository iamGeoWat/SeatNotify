const axios = require('axios');
const wxConf = require('../config/wxConfig');
let Redis = require('ioredis');
let redis = new Redis();

//sentry.io fault logging
const Sentry = require('@sentry/node');
Sentry.init({ dsn: 'https://ae4081dec4e54a37a4a08fdfff5ce7c7@sentry.io/5172204' });

let urlStr = wxConf.accessTokenUrl + '&appid=' + wxConf.appid + '&secret=' + wxConf.secret;
let request = () => {
  axios.get(urlStr)
    .then((response) => {
      console.log('access token now expires in', response.data.expires_in, 'seconds.');
      redis.set('access_token', response.data.access_token);
      console.log('access token now set to ', response.data.access_token, ' in redis.')
    })
    .catch((error) => {
      console.log(error)
    });
};

request();
setInterval(() => {
  request();
}, wxConf.expires_in/2);
