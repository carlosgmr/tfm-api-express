var appConfig = require('../config.js');
var jwt = require('jsonwebtoken');

module.exports.handle = function (req, res, next) {
    if (req.path === '/auth/login') {
        next();
        return;
    }

    var token = req.get('Authorization');
    if (!token) {
        return res.status(400).send({
            'error':['El header Authorization es obligatorio']
        });
    }

    jwt.verify(token, appConfig.jwt.secret, function(err, decoded) {
        if (err) {
            return res.status(400).send({
                'error':['El token no es válido']
            });
        }

        req.appUser = decoded.data;
        next();
    });
};