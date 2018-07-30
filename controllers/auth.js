var pool = require('../modules/database');
var validator = require('express-validator/check');
var validationResult = validator.validationResult;
var utilities = require('../modules/utilities');

module.exports.authenticate = function(req, res, next) {
    // validación
    var validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(422).send(utilities.formatErrors(validationErrors.array()));
    }

    var token = '1234';

    return res.status(200).send({
        'token':token
    });
};