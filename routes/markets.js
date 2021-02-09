var express = require('express');
var router = express.Router();
var OpenMarkets = require('../models').OpenMarkets;
var Markets = require('../models').Markets;
var Users = require('../models').Users;
var axios = require('axios');
let { getAuthHeader } = require('../src/hmac');

router.post('/:account', function (req, res, next) {
    Users.findOne({
        where: {
          Account:req.params.account
        },
    })
        .then((result) => {
            
        })
        .catch((err) => {
            //can't find account in user
        })

        /*.then((result) => {
        res.status(201).json(result);
    })
        .catch((err) => {
            console.error(err);
            next(err);
            res.json(err);
        });*/
});