var express = require('express');
var router = express.Router();
var axios = require('axios');
var Markets = require('../../models').Markets;
let { getAuthHeader } = require('../../src/hmac');

// body
// vendorId : A00333049
// SECRET_KEY : 7567370a4a58ea3f5f752fc4391e34e4420bb6be
// CLIENT_KEY : 6828cfc3-3a97-4435-9c3d-ffb41d61434b
// "sellerProductName": "판매상품 이름",
// "brand": "브랜드이름", (생략 가능)
// "deliveryMethod": "SEQUENCIAL", SEQUENCIAL:일반배송(순차배송)  COLD_FRESH:신선냉동  MAKE_ORDER:주문제작  AGENT_BUY:구매대행 DEFAULT:SEQUENCIAL(일반배송)
// "deliveryChargeType": "FREE",  FREE:무료배송 NOT_FREE:유료배송 CHARGE_RECEIVED:착불배송 CONDITIONAL_FREE:조건부 무료배송 DEFAULT:FREE(무료배송)
// "deliveryCharge": 0, DEFAULT:0
// "freeShipOverAmount": "0", body.freeShipOverAmount, DEFAULT:0
// "companyContactNumber": "01011111111", body.companyContactNumber,
// "returnZipCode": "반품지우편번호",
// "returnAddress": "반품지주소" ,
// "returnAddressDetail": "반품지 상세주소",
// "vendorUserId": "쿠팡wing 아이디"
// itemName: "200ml_1개" (단위)
// "originalPrice": 13000,
// "salePrice": 10000,
// "searchTags": ["부천대학교", "컴퓨터소프트웨어과"],
// images : [ 
//      { "imageOrder": 0, "imageType": "REPRESENTATION", "vendorPath": "http://image11.coupangcdn.com/image/product/image/vendoritem/2018/06/25/3719529368/27a6b898-ff3b-4a27-b1e4-330a90c25e9c.jpg" }, 
//      { "imageOrder": 1, "imageType": "DETAIL", "vendorPath": "http://image11.coupangcdn.com/image/product/image/vendoritem/2018/06/25/3719529368/27a6b898-ff3b-4a27-b1e4-330a90c25e9c.jpg" },
//      { "imageOrder": 2, "imageType": "DETAIL", "vendorPath": "http://image11.coupangcdn.com/image/product/image/vendoritem/2018/06/25/3719529368/27a6b898-ff3b-4a27-b1e4-330a90c25e9c.jpg" }
// ]
// "content": "html문자열"
router.post('/create', function (req, res, next) {
    var body = req.body;
    if (body.deliveryMethod == undefined) body.deliveryMethod = "SEQUENCIAL";
    if (body.deliveryChargeType == undefined) body.deliveryChargeType = "FREE";
    if (body.deliveryCharge == undefined) body.deliveryCharge = 0;
    if (body.freeShipOverAmount == undefined) body.freeShipOverAmount = "0";
    if (body.returnZipCode == undefined) body.returnZipCode = "";
    if (body.shippingPlaceName == undefined) body.shippingPlaceName = body.vendorUserId;

    var object = {
        "sellerProductName": body.sellerProductName,
        "vendorId": body.vendorId,
        "saleStartedAt": "2020-12-01T00:00:00",
        "saleEndedAt": "2099-01-01T23:59:59",
        "brand": body.brand,
        "deliveryMethod": body.deliveryMethod,
        "deliveryCompanyCode": "KGB",
        "deliveryChargeType": body.deliveryChargeType,
        "deliveryCharge": body.deliveryCharge, // 배송비
        "freeShipOverAmount": body.freeShipOverAmount, //무료배송 금액조건
        "deliveryChargeOnReturn": 2500,
        "remoteAreaDeliverable": "N",
        "unionDeliveryType": "NOT_UNION_DELIVERY",
        "returnCenterCode": "NO_RETURN_CENTERCODE",
        "returnChargeName": body.vendorUserId,
        "companyContactNumber": body.companyContactNumber,
        "returnZipCode": body.returnZipCode,
        "returnAddress": body.returnAddress,
        "returnAddressDetail": body.returnAddressDetail,
        "returnCharge": 2500,
        "vendorUserId": body.vendorUserId,
        "requested": true, //여기까지
        "items":
            [
                {
                    "itemName": body.itemName,
                    "originalPrice": body.originalPrice,
                    "salePrice": body.salePrice,
                    "maximumBuyCount": "100",
                    "maximumBuyForPerson": "0",
                    "outboundShippingTimeDay": "1",
                    "maximumBuyForPersonPeriod": "1",
                    "unitCount": 1,
                    "adultOnly": "EVERYONE",
                    "taxType": "TAX",
                    "parallelImported": "NOT_PARALLEL_IMPORTED",
                    "overseasPurchased": "NOT_OVERSEAS_PURCHASED",
                    "pccNeeded": "false",
                    "searchTags": body.searchTags,
                    "images": body.images,
                    "attributes":
                        [
                            { "attributeTypeName": "수량", "attributeValueName": "1개" }
                        ],
                    "contents":
                        [
                            {
                                "contentsType": "HTML",
                                "contentDetails": [
                                    { "content": body.content, "detailType": "TEXT" }
                                ]
                            }
                        ]
                }
            ],
        "extraInfoMessage": "",
        "manufacture": body.brand
    };
    var data = JSON.stringify(object);

    var config = {
        method: 'post',
        url: 'https://api-gateway.coupang.com/v2/providers/seller_api/apis/api/v1/marketplace/seller-products',
        headers: {
            'Authorization': getAuthHeader('POST', 'https://api-gateway.coupang.com/v2/providers/seller_api/apis/api/v1/marketplace/seller-products', { SECRET_KEY: body.SECRET_KEY, CLIENT_KEY: body.CLIENT_KEY }),
            'X-Reqeusted-By': body.vendorId,
            'Content-Type': 'application/json'
        },
        data: data
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


router.get('/select/:sellerProductId/user/:userId', function (req, res, next) {
    Markets.findOne({
        where: {
            open_market_id: req.params.userId
        },
    })
        .then((result) => {
            var config = {
                method: 'get',
                url: 'https://api-gateway.coupang.com/v2/providers/seller_api/apis/api/v1/marketplace/seller-products/' + req.params.sellerProductId,
                headers: {
                    'Authorization': getAuthHeader('GET', 'https://api-gateway.coupang.com/v2/providers/seller_api/apis/api/v1/marketplace/seller-products/' + req.params.sellerProductId, { SECRET_KEY: result["secret_key"], CLIENT_KEY: result["access_key"] }),
                    'X-Reqeusted-By': result['vendor_id'],
                    'Content-Type': 'application/json'
                }
            };
            axios(config)
                .then(function (response) {
                    if (response.data.code != "SUCCESS") {
                        res.json({
                            "code": "FAIL",
                            "message": "sellerProductId("+req.params.sellerProductId+")를 볼 권한이 없는 userId("+req.params.userId+")입니다."
                        });
                    }
                    else {
                        res.json(response.data);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                    res.send(408, error);
                });
        })
        .catch((err) => {
            console.error(err);
            next(err);
            res.json(err);
        })
});

module.exports = router;