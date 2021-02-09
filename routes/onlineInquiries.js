var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req2, res2, next) {
  const https = require('https');
  const crypto = require('crypto');
  
  const vendorId = 'A00279238';
  //input your accessKey
  const ACCESS_KEY = '48994366-5453-4d26-a2ef-dfaf4c99389e';
  //input your secretKey
  const SECRET_KEY = '4126c72e04dcdc6c22208737ee5cc87824f4e281';
  
  const algorithm = 'sha256';
  const datetime = new Date().toISOString().substr(2,17).replace(/:/gi, '').replace(/-/gi, '') + "Z";
  const method ='GET';
  const path ='/v2/providers/openapi/apis/api/v4/vendors/'+ vendorId +'/onlineInquiries';
  const query = 'vendorId='+vendorId+'&answeredType=NOANSWER&inquiryStartAt=2020-09-30&inquiryEndAt=2020-10-01';
  
  const message = datetime + method + path + query;
  const urlpath = path + '?' + query;
  
  const signature = crypto.createHmac(algorithm, SECRET_KEY)
  .update(message)
  .digest('hex');

const authorization = 'CEA algorithm=HmacSHA256, access-key=' + ACCESS_KEY + ', signed-date=' + datetime + ', signature=' + signature;

const options = {
hostname: 'api-gateway.coupang.com',
port: 443,
path: urlpath,
method: method,
headers: {
'Content-Type': 'application/json;charset=UTF-8',
'Authorization': authorization,
'X-EXTENDED-TIMEOUT':90000
}
};

  let body = [];

  const req = https.request(options, res  => {
    console.log(`statusCode: ${res.statusCode}`);
    console.log(`reason: ${res.statusMessage}`);
  
    res.on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      const json = JSON.parse(body);
      res2.setHeader('Access-Control-Allow-Origin', '*');
      res2.setHeader('Access-Control-Allow-Credentials', 'true'); 
      res2.send(JSON.stringify(json, null, 2));
    });
  });
  
  req.on('error', error => {
    res2.send(error);
  });
  
  req.end();
  
});
// router.get('/:id', function(req, res, next){
//     res.send(req.params.id);
// });


module.exports = router;
