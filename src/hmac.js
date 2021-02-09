const CryptoJS = require("crypto-js");
const _ = require('underscore');

// let CLIENT_KEY = '6828cfc3-3a97-4435-9c3d-ffb41d61434b';
// let SECRET_KEY = '7567370a4a58ea3f5f752fc4391e34e4420bb6be';
// let AUTH_TYPE = 'CEA algorithm=HmacSHA256';

// export function getPath(url) {
//     let pathRegex = /.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/;
//     let result = url.match(pathRegex);
//     return result && result.length > 1 ? result[1] : '';
// }
//
// export function getQueryString(url) {
//     let arrSplit = url.split('?');
//     return arrSplit.length > 1 ? url.substring(url.indexOf('?') + 1) : '';
// }

function getAuthHeader(httpMethod, requestUrl, KEYS) {

    const AUTH_TYPE = 'CEA algorithm=HmacSHA256';

    //let requestPath = getPath(requestUrl);
    let requestPath = ((url) => {
        let pathRegex = /.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/;
        let result = url.match(pathRegex);
        return result && result.length > 1 ? result[1] : '';
    })(requestUrl);

    //let queryString = getQueryString(requestUrl);
    let queryString = ((url) => {
        let arrSplit = url.split('?');
        return arrSplit.length > 1 ? url.substring(url.indexOf('?') + 1) : '';
    })(requestUrl);

    let timestamp = new Date().toISOString().split('.')[0] + "Z";
    timestamp = timestamp.replace(/:/gi, "").replace(/-/gi, "").substring(2);

    let requestData = [timestamp, httpMethod, requestPath, queryString].join("");
    requestData = replaceVariables(requestData);
    let hash = CryptoJS.HmacSHA256(requestData, KEYS.SECRET_KEY);
    let hmacDigest = CryptoJS.enc.Hex.stringify(hash);
    let authHeader = AUTH_TYPE + ", access-key=" + KEYS.CLIENT_KEY + ', signed-date=' + timestamp + ', signature=' + hmacDigest;
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

module.exports = {getAuthHeader, replaceVariables};