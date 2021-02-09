var express = require('express');
var router = express.Router();
var Users = require('../models').Users;
var axios = require('axios');

var CryptoJS = require("crypto-js");
var _ = require('underscore');

var CLIENT_KEY = '6828cfc3-3a97-4435-9c3d-ffb41d61434b';
var SECRET_KEY = '7567370a4a58ea3f5f752fc4391e34e4420bb6be';
var AUTH_TYPE = 'CEA algorithm=HmacSHA256';

function getPath(url) {
    var pathRegex = /.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/;
    var result = url.match(pathRegex);
    return result && result.length > 1 ? result[1] : '';
}

function getQueryString(url) {
    var arrSplit = url.split('?');
    return arrSplit.length > 1 ? url.substring(url.indexOf('?') + 1) : '';
}

function getAuthHeader(httpMethod, requestUrl) {

    var requestPath = getPath(requestUrl);
    var queryString = getQueryString(requestUrl);

    var timestamp = new Date().toISOString().split('.')[0] + "Z";
    timestamp = timestamp.replace(/:/gi, "").replace(/-/gi, "").substring(2);

    var requestData = [timestamp, httpMethod, requestPath, queryString].join("");
    requestData = replaceVariables(requestData);
    var hash = CryptoJS.HmacSHA256(requestData, SECRET_KEY);
    var hmacDigest = CryptoJS.enc.Hex.stringify(hash);
    var authHeader = AUTH_TYPE + ", access-key=" + CLIENT_KEY + ', signed-date=' + timestamp + ', signature=' + hmacDigest;
    return authHeader;
}

function replaceVariables(templateString) {
    let tokens = _.uniq(templateString.match(/{{\w*}}/g))

    _.forEach(tokens, t => {
        let variable = t.replace(/[{}]/g, '')
        let value = environment[variable] || globals[variable]
        templateString = templateString.replace(new RegExp(t, 'g'), value)
    });

    return templateString
}


router.post('/', function (req, res, next) {
    Users.create({
        account: req.body.account,
        password: req.body.password,
        name: req.body.name,
        phone: req.body.phone,
        company: req.body.company,
    }).then((result) => {
        console.log(result);
        res.status(201).json(result);
    })
        .catch((err) => {
            console.error(err);
            next(err);
            res.json(err);
        });
    res.send(200, { result: true });
});

// body
// vendorId : A00333049
// inquiryStartAt : 2020-11-01 (최대 7일)
// inquiryEndAt : 2020-11-05
// (선택) answeredType : ALL:전체보기 ANSWERED:답변완료 NOANSWER:미답변  DEFAULT:ALL
router.post('/client/onlineInquiries', function (req, res, next) {
    var body = req.body;
    if (body.answeredType == undefined) body.answeredType = 'ALL';
    //console.log(body.test == undefined);
    var timestamp = new Date().toISOString().split('.')[0] + "Z";
    timestamp = timestamp.replace(/:/gi, "").replace(/-/gi, "").substring(2);
    var config = {
        method: 'get',
        url: 'https://api-gateway.coupang.com/v2/providers/openapi/apis/api/v4/vendors/' + body.vendorId + '/onlineInquiries?vendorId=' + body.vendorId + '&answeredType=' + body.answeredType + '&inquiryStartAt=' + body.inquiryStartAt + '&inquiryEndAt=' + body.inquiryEndAt,
        headers: {
            'Authorization': getAuthHeader('GET', 'https://api-gateway.coupang.com/v2/providers/openapi/apis/api/v4/vendors/' + body.vendorId + '/onlineInquiries?vendorId=' + body.vendorId + '&answeredType=' + body.answeredType + '&inquiryStartAt=' + body.inquiryStartAt + '&inquiryEndAt=' + body.inquiryEndAt),
            'X-Reqeusted-By': body.vendorId
        }
    };
    axios(config)
        .then(function (response) {
            res.send(200, response.data)
        })
        .catch(function (error) {
            console.log(error);
        });
});



module.exports = router;