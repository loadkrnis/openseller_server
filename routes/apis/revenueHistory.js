var express = require('express');
var router = express.Router();
var axios = require('axios');

let { getAuthHeader, replaceVariables } = require('../../src/hmac');

// body
// vendorId : A00333049
// SECRET_KEY : 7567370a4a58ea3f5f752fc4391e34e4420bb6be
// CLIENT_KEY : 6828cfc3-3a97-4435-9c3d-ffb41d61434b
// "recognitionDateFrom" : "2020-12-02"
// "recognitionDateTo" : "2020-12-08" (최대 30일, 마지막조회날짜는 당일 전날) (DEFAUlt = 오늘날짜기준 어제)
router.post('/', function (req, res, next) {
    var body = req.body;
    if (body.recognitionDateTo == undefined) body.recognitionDateTo = getFormatDate(new Date());
    var config = {
        method: 'get',
        url: 'https://api-gateway.coupang.com/v2/providers/openapi/apis/api/v1/revenue-history?vendorId=' + body.vendorId + '&recognitionDateFrom=' + body.recognitionDateFrom + '&recognitionDateTo=' + body.recognitionDateTo + '&token=&maxPerPage=',
        headers: {
            'Authorization': getAuthHeader('GET', 'https://api-gateway.coupang.com/v2/providers/openapi/apis/api/v1/revenue-history?vendorId=' + body.vendorId + '&recognitionDateFrom=' + body.recognitionDateFrom + '&recognitionDateTo=' + body.recognitionDateTo + '&token=&maxPerPage=', { SECRET_KEY: body.SECRET_KEY, CLIENT_KEY: body.CLIENT_KEY }),
            'X-Reqeusted-By': body.vendorId
        }
    };
    axios(config)
        .then(function (response) {
            res.send(200, response.data)
        })
        .catch(function (error) {
            console.log(error);
            res.send(408, error);
        });
});

function getFormatDate(date) {
    var year = date.getFullYear();              //yyyy
    var month = (1 + date.getMonth());          //M
    month = month >= 10 ? month : '0' + month;  //month 두자리로 저장
    var day = date.getDate() - 1;                   //d
    day = day >= 10 ? day : '0' + day;          //day 두자리로 저장
    return year + '-' + month + '-' + day;       //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
}

module.exports = router;