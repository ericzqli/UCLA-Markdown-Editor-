var jwt = require('jsonwebtoken');
var privateKey = 'C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c';
exports.sign = function(username) {
    var token = jwt.sign(
        {
          "exp": Math.floor(Date.now() / 1000) + (60 * 60 * 2),
          "usr": username
        }, privateKey,
        { header: {
          "alg": "HS256",
          "typ": "JWT"
        }});
    return token;
}

exports.verify = function(token, username) {
    var tokenJson = jwt.verify(token, privateKey);
    if(tokenJson.exp <  Math.floor(Date.now() / 1000)) {
        return false;
    }
    if(tokenJson.usr == username) {
        return true;
    } else {
        return false;
    }
}