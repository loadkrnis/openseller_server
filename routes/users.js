var express = require('express');
var router = express.Router();
var Users = require('../models').Users;
var Markets = require('../models').Markets;
var axios = require('axios');
let { getAuthHeader } = require('../src/hmac');

router.post('/create', function (req, res, next) {
  Users.create({
    account: req.body.account,
    password: req.body.password,
    name: req.body.name,
    phone: req.body.phone,
    company: req.body.company,
  }).then((result) => {
    res.status(201).json(result);
  })
    .catch((err) => {
      console.error(err);
      next(err);
      res.json(err);
    });
});

router.post('/login', function (req, res, next) {
  Users.findAll({
    where: {
      account: req.body.account,
      password: req.body.password
    },
  }).then((result) => {
    if (result.length == 1) {
      result[0].password = "";
      res.send(200, { result: result[0] });
    }
    else res.send(200, { result: false })
  })
    .catch((err) => {
      console.error(err);
      next(err);
      res.json(err);
    });
});

router.get('/:account', function (req, res, next) {
    Users.findOne({
        where: {
            Account: req.params.account
        },
    }).then((result) => {
        res.json(result);
    })
        .catch((err) => {
            console.error(err);
            next(err);
            res.json(err);
        });
});

router.get('/select/:userId', function (req, res, next) {
  Users.findOne({
    where: {
      id: req.params.userId
    },
  }).then((result) => {
    res.json(result);
  })
    .catch((err) => {
      console.error(err);
      next(err);
      res.json(err);
    });
});

router.get('/:userId/keys', function (req, res, next) {
  Markets.findOne({
    where: {
      open_market_id: req.params.userId
    },
  })
    .then((result) => {
      res.json(
        {
          access_key: result["access_key"],
          secret_key: result["secret_key"],
          vendor_id: result["vendor_id"]
        }
      )
    })
    .catch((err) => {
      console.error(err);
      next(err);
      res.json(err);
    })
});


router.get('/:userId/products', function (req, res, next) {
  Markets.findOne({
    where: {
      open_market_id: req.params.userId
    },
  })
    .then((result) => {
      var config = {
        method: 'get',
        url: 'https://api-gateway.coupang.com/v2/providers/seller_api/apis/api/v1/marketplace/seller-products?vendorId=' + result["vendor_id"] + '&maxPerPage=100',
        headers: {
          'Authorization': getAuthHeader('GET', 'https://api-gateway.coupang.com/v2/providers/seller_api/apis/api/v1/marketplace/seller-products?vendorId=' + result["vendor_id"] + '&maxPerPage=100', { SECRET_KEY: result["secret_key"], CLIENT_KEY: result["access_key"] }),
          'X-Reqeusted-By': result['vendor_id'],
          'Content-Type': 'application/json'
        }
      };
      axios(config)
        .then(function (response) {
          res.json(response.data);
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

router.get('/onlineInquiries/select/:userId/:inquiryStartAt/:inquiryEndAt/:pageNum', function (req, res, next) {
  Markets.findOne({
    where: {
      open_market_id: req.params.userId
    },
  }).then((result) => {
    var axios = require('axios');

    var config = {
      method: 'get',
      url: 'https://api-gateway.coupang.com/v2/providers/openapi/apis/api/v4/vendors/' + result['vendor_id'] + '/onlineInquiries?inquiryStartAt=' + req.params.inquiryStartAt + '&inquiryEndAt=' + req.params.inquiryEndAt + '&answeredType=ALL&pageSize=50&pageNum=' + req.params.pageNum,
      headers: {
        'Authorization': getAuthHeader('GET', 'https://api-gateway.coupang.com/v2/providers/openapi/apis/api/v4/vendors/' + result['vendor_id'] + '/onlineInquiries?inquiryStartAt=' + req.params.inquiryStartAt + '&inquiryEndAt=' + req.params.inquiryEndAt + '&answeredType=ALL&pageSize=50&pageNum=' + req.params.pageNum, { SECRET_KEY: result["secret_key"], CLIENT_KEY: result["access_key"] }),
        'X-Reqeusted-By': result['vendor_id'],
        'Content-Type': 'application/json'
      }
    };

    axios(config)
      .then(function (response) {
        res.status(200).json(response.data); //here!
      })
      .catch(function (error) {
        console.log(error);
        res.send(error);
      });

  })
    .catch((err) => {
      console.error(err);
      next(err);
      res.json(err);
    });
});


router.post('/:userId/onlineInquiries/:inquiryId/replies', function (req, res, next) {
  Markets.findOne({
    where: {
      open_market_id: req.params.userId
    },
  })
    .then((result) => {

      var axios = require('axios');
      var object = { 
        'content': req.body.content, 
        'vendorId': result['vendor_id'], 
        'replyBy': req.body.replyBy 
      };
      var data = JSON.stringify(object);
      var config = {
        method: 'post',
        url: 'https://api-gateway.coupang.com/v2/providers/openapi/apis/api/v4/vendors/' + result['vendor_id'] + '/onlineInquiries/' + req.params.inquiryId + '/replies',
        headers: {
          'Authorization': getAuthHeader('POST', 'https://api-gateway.coupang.com/v2/providers/openapi/apis/api/v4/vendors/' + result['vendor_id'] + '/onlineInquiries/' + req.params.inquiryId + '/replies', { SECRET_KEY: result["secret_key"], CLIENT_KEY: result["access_key"] }),
          'X-Requested-By': result['vendor_id'],
          'Content-Type': 'application/json'
        },
        data: data
      };

      axios(config)
        .then(function (response) {
          res.status(200).json(response.data); //here!
        })
        .catch(function (error) {
          res.status(408).json(error); //here!
          console.log(error);
        });
    })
    .catch((err) => {
      console.error(err);
      next(err);
      res.json(err);
    })
});

module.exports = router;