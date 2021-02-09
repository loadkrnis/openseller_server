var express = require('express');
var router = express.Router();
var axios = require('axios');

let { getAuthHeader, replaceVariables } = require('../../src/hmac');

// body
// vendorId : A00333049
// SECRET_KEY : 7567370a4a58ea3f5f752fc4391e34e4420bb6be
// CLIENT_KEY : 6828cfc3-3a97-4435-9c3d-ffb41d61434b
// inquiryStartAt : 2020-11-01 (최대 7일)
// inquiryEndAt : 2020-11-05
// (선택) answeredType : ALL:전체보기 ANSWERED:답변완료 NOANSWER:미답변  DEFAULT:ALL
router.post('/onlineInquiries', function (req, res, next) {
    var body = req.body;
    if (body.answeredType == undefined) body.answeredType = 'NOANSWER';
    //console.log(body.test == undefined);
    var timestamp = new Date().toISOString().split('.')[0] + "Z";
    timestamp = timestamp.replace(/:/gi, "").replace(/-/gi, "").substring(2);
    var config = {
        method: 'get',
        url: 'https://api-gateway.coupang.com/v2/providers/openapi/apis/api/v4/vendors/' + body.vendorId + '/onlineInquiries?vendorId=' + body.vendorId + '&answeredType=' + body.answeredType + '&inquiryStartAt=' + body.inquiryStartAt + '&inquiryEndAt=' + body.inquiryEndAt,
        headers: {
            'Authorization': getAuthHeader('GET', 'https://api-gateway.coupang.com/v2/providers/openapi/apis/api/v4/vendors/' + body.vendorId + '/onlineInquiries?vendorId=' + body.vendorId + '&answeredType=' + body.answeredType + '&inquiryStartAt=' + body.inquiryStartAt + '&inquiryEndAt=' + body.inquiryEndAt, { SECRET_KEY: body.SECRET_KEY, CLIENT_KEY: body.CLIENT_KEY }),
            'X-Reqeusted-By': body.vendorId
        }
    };
    axios(config)
        .then(function (response) {
            res.send(200, response.data.data)
        })
        .catch(function (error) {
            console.log(error);
            res.send(408, error);
        });
});



module.exports = router;