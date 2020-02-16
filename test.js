var request = require("request");

var options = { method: 'POST',
  url: 'http://198.13.54.206:3001/seat',
  headers:
    { 'cache-control': 'no-cache',
      Connection: 'keep-alive',
      'Content-Length': '44',
      'Accept-Encoding': 'gzip, deflate',
      Host: '198.13.54.206:3001',
      'Postman-Token': 'b3cbc6a3-ff43-4851-92c7-501ce8e9be91,e911c313-3c02-49b2-8802-6fe7589216a0',
      'Cache-Control': 'no-cache',
      Accept: '*/*',
      'User-Agent': 'PostmanRuntime/7.20.1',
      'Content-Type': 'application/json' },
  body: { province: '江苏', city: '苏州' },
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  
  console.log(body);
});
