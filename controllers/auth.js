var appConfig = require('../config.js');
var pool = require('../modules/database');
var validator = require('express-validator/check');
var validationResult = validator.validationResult;
var utilities = require('../modules/utilities');
var model = require('../models/auth');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

module.exports.authenticate = function(req, res, next) {
    // validación
    var validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        return res.status(422).send(utilities.formatErrors(validationErrors.array()));
    }

    var data = utilities.filterRequest(req.body, model.config.rulesForLogin);
    var query = 'SELECT `id`, `email`, `password`, `name`, `surname_1`, `surname_2`, `active` '+
            'FROM `'+data['role']+'` '+
            'WHERE `email` = ?';

    pool.query(query, [data['email']], function (error, results, fields) {
        if (error) {
            return res.status(500).send({
                'error':error
            });
        }

        if (results.length === 0) {
            return res.status(400).send({
                'error':['El email indicado no está registrado']
            });
        }

        var appUser = results[0];
        if (!appUser['active']) {
            return res.status(400).send({
                'error':['Tu cuenta se encuentra deshabilitada']
            });
        }

        if (!bcrypt.compareSync(data['password'], appUser['password'].toString('utf8'))) {
            return res.status(400).send({
                'error':['Las credenciales no son válidas']
            });
        }

        // generamos token
        var payload = {
            'iss':appConfig.jwt.issuer,
            'iat':Math.floor(new Date().getTime() / 1000),
            'data':{
                'role':data['role'],
                'id':appUser['id'],
                'email':appUser['email'],
                'fullname':(appUser['name']+' '+appUser['surname_1']+' '+appUser['surname_2']).trim()
            }
        };
        var token = jwt.sign(payload, appConfig.jwt.secret);

        return res.status(200).send({
            'token':token
        });
    });
};