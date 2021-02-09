var router = express.Router();
var CryptoJS = require("crypto-js");
var _ = require('underscore');

// var CLIENT_KEY = '6828cfc3-3a97-4435-9c3d-ffb41d61434b';
// var SECRET_KEY = '7567370a4a58ea3f5f752fc4391e34e4420bb6be';
// var AUTH_TYPE = 'CEA algorithm=HmacSHA256';

// export function getPath(url) {
//     var pathRegex = /.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/;
//     var result = url.match(pathRegex);
//     return result && result.length > 1 ? result[1] : '';
// }
//
// export function getQueryString(url) {
//     var arrSplit = url.split('?');
//     return arrSplit.length > 1 ? url.substring(url.indexOf('?') + 1) : '';
// }

export function getAuthHeader(httpMethod, requestUrl, KEYS) {

    const AUTH_TYPE = 'CEA algorithm=HmacSHA256';

    //var requestPath = getPath(requestUrl);
    var requestPath = ((url) => {
        var pathRegex = /.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/;
        var result = url.match(pathRegex);
        return result && result.length > 1 ? result[1] : '';
    })(requestUrl);

    //var queryString = getQueryString(requestUrl);
    var queryString = ((url) => {
        var arrSplit = url.split('?');
        return arrSplit.length > 1 ? url.substring(url.indexOf('?') + 1) : '';
    })(requestUrl);

    var timestamp = new Date().toISOString().split('.')[0] + "Z";
    timestamp = timestamp.replace(/:/gi, "").replace(/-/gi, "").substring(2);

    var requestData = [timestamp, httpMethod, requestPath, queryString].join("");
    requestData = replaceVariables(requestData);
    var hash = CryptoJS.HmacSHA256(requestData, KEYS.SECRET_KEY);
    var hmacDigest = CryptoJS.enc.Hex.stringify(hash);
    var authHeader = AUTH_TYPE + ", access-key=" + KEYS.CLIENT_KEY + ', signed-date=' + timestamp + ', signature=' + hmacDigest;
    return authHeader;
}

export function replaceVariables(templateString) {
    let tokens = _.uniq(templateString.match(/{{\w*}}/g))

    _.forEach(tokens, t => {
        let variable = t.replace(/[{}]/g, '')
        let value = environment[variable] || globals[variable]
        templateString = templateString.replace(new RegExp(t, 'g'), value)
    });

    return templateString
}