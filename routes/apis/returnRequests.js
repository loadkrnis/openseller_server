var express = require('express');
var router = express.Router();
var axios = require('axios');

let { getAuthHeader, replaceVariables } = require('../../src/hmac');

// body
// vendorId : A00333049
// SECRET_KEY : 7567370a4a58ea3f5f752fc4391e34e4420bb6be
// CLIENT_KEY : 6828cfc3-3a97-4435-9c3d-ffb41d61434b
// "createdAtFrom" : "2020-12-02"
// "createdAtTo" : "2020-12-08" (최대 30일, 마지막조회날짜는 당일 전날) (DEFAUlt = 오늘날짜기준 어제)
// status : RU:출고중지요청 UC:반품접수 CC:반품완료 PR:쿠팡확인요청 DEFAULT:UC(반품접수)
router.post('/', function (req, res, next) {
    var body = req.body;
    if (body.status == undefined) body.status = "UC"
    var config = {
        method: 'get',
        url: 'https://api-gateway.coupang.com/v2/providers/openapi/apis/api/v4/vendors/'+body.vendorId+'/returnRequests?searchType=&createdAtFrom='+body.createdAtFrom+'&createdAtTo='+body.createdAtTo+'&status='+body.status,
        headers: {
            'Authorization': getAuthHeader('GET', 'https://api-gateway.coupang.com/v2/providers/openapi/apis/api/v4/vendors/'+body.vendorId+'/returnRequests?searchType=&createdAtFrom='+body.createdAtFrom+'&createdAtTo='+body.createdAtTo+'&status='+body.status, { SECRET_KEY: body.SECRET_KEY, CLIENT_KEY: body.CLIENT_KEY }),
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

module.exports = router;