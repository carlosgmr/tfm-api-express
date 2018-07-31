var pool = require('../modules/database');
var validator = require('express-validator/check');
var validationResult = validator.validationResult;
var utilities = require('../modules/utilities');

module.exports.listing = function(config, route) {
    var me = this;
    var table = config.table;
    var publicColumns = [];

    config.publicColumns.forEach(function(currentValue, index, array) {
        publicColumns.push('`'+currentValue+'`');
    });

    return function(req, res, next) {
        // ACL
        if (config.hasOwnProperty('checkAcl') && !config.checkAcl(req, route)) {
            return res.status(401).send({
                'error':['Acceso no autorizado']
            });
        }

        // validación
        var validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(422).send(utilities.formatErrors(validationErrors.array()));
        }

        // filtramos y formateamos request
        var data = utilities.filterRequest(req.query, config.rulesForListing);

        var query = 'SELECT '+publicColumns.join(',')+' FROM `'+table+'`';
        var where = '';
        var bindings = [];

        for (var col in data) {
            if (where !== '') {
                where += ' AND ';
            }

            where += '`'+col+'` = ?';
            bindings.push(data[col]);
        }

        if (where !== '') {
            query += ' WHERE '+where;
        }

        pool.query(query, bindings, function (error, results, fields) {
            if (error) {
                return res.status(500).send({
                    'error':error
                });
            }

            return res.status(200).send(results);
        });
    };
};

module.exports.listingRelation = function(config, relationTable, route) {
    var me = this;
    var colsT1 = [], colsT2 = [];
    var relationConfig = config['relations'][relationTable];

    relationConfig.publicColumns.forEach(function(currentValue, index, array) {
        colsT1.push('T1.`'+currentValue+'`');
    });
    relationConfig.join.publicColumns.forEach(function(currentValue, index, array) {
        colsT2.push('T2.`'+currentValue+'`');
    });

    var query = 'SELECT '+colsT1.join(',')+(colsT2.length > 0 ? ','+colsT2.join(',') : '')+' '+
                'FROM '+
                    '`'+relationTable+'` AS T1 '+
                    'INNER JOIN `'+relationConfig.join.table+'` AS T2 '+
                    'ON T2.`'+relationConfig.join.fkColumn+'` = T1.`id` '+
                'WHERE T2.`'+relationConfig.join.whereColumn+'` = ?';

    return function(req, res, next) {
        // ACL
        if (config.hasOwnProperty('checkAcl') && !config.checkAcl(req, route)) {
            return res.status(401).send({
                'error':['Acceso no autorizado']
            });
        }

        pool.query(query, [req.params.id], function (error, results, fields) {
            if (error) {
                return res.status(500).send({
                    'error':error
                });
            }

            return res.status(200).send(results);
        });
    };
};

module.exports.read = function(config, route) {
    var me = this;

    return function(req, res, next) {
        // ACL
        if (config.hasOwnProperty('checkAcl') && !config.checkAcl(req, route)) {
            return res.status(401).send({
                'error':['Acceso no autorizado']
            });
        }

        me.getPublicData(config, req.params.id, function(error, results) {
            if (error) {
                return res.status(500).send({
                    'error':error
                });
            }

            if (results.length === 0) {
                return res.status(404).send({
                    'error':['El recurso solicitado no existe']
                });
            }

            return res.status(200).send(results[0]);
        });
    };
};

module.exports.getPublicData = function(config, id, callback) {
    var me = this;
    var table = config.table;
    var publicColumns = [];

    config.publicColumns.forEach(function(currentValue, index, array) {
        publicColumns.push('`'+currentValue+'`');
    });

    var query = 'SELECT '+publicColumns.join(',')+' FROM `'+table+'` WHERE id = ?';
    var bindings = [id];

    pool.query(query, bindings, function (error, results, fields) {
        if (error) {
            callback(error, null);
            return;
        }

        callback(null, results);
        return;
    });
};

module.exports.create = function(config, route) {
    var me = this;
    var table = config.table;

    return function(req, res, next) {
        // ACL
        if (config.hasOwnProperty('checkAcl') && !config.checkAcl(req, route)) {
            return res.status(401).send({
                'error':['Acceso no autorizado']
            });
        }

        // validación
        var validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(422).send(utilities.formatErrors(validationErrors.array()));
        }

        // filtramos y formateamos request
        var data = utilities.filterRequest(req.body, config.rulesForCreate);
        if (config.hasOwnProperty('formatData')) {
            data = config.formatData(data);
        }

        var columns = [], bindings = [], params = [];

        for (var col in data) {
            columns.push('`'+col+'`');
            bindings.push(data[col]);
            params.push('?');
        }

        var query = 'INSERT INTO `'+table+'` ('+columns.join(',')+') VALUES ('+params.join(',')+')';
        pool.query(query, bindings, function (error, results, fields) {
            if (error) {
                return res.status(500).send({
                    'error':error
                });
            }

            var id = results.insertId;
            me.getPublicData(config, id, function(error, results) {
                if (error) {
                    return res.status(500).send({
                        'error':error
                    });
                }

                if (results.length === 0) {
                    return res.status(404).send({
                        'error':['El recurso no ha podido ser creado']
                    });
                }

                return res.status(201).send(results[0]);
            });
        });
    };
};

module.exports.update = function(config, route) {
    var me = this;
    var table = config.table;

    return function(req, res, next) {
        // ACL
        if (config.hasOwnProperty('checkAcl') && !config.checkAcl(req, route)) {
            return res.status(401).send({
                'error':['Acceso no autorizado']
            });
        }

        // validación
        var validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(422).send(utilities.formatErrors(validationErrors.array()));
        }

        // filtramos y formateamos request
        var data = utilities.filterRequest(req.body, config.rulesForUpdate);
        if (config.hasOwnProperty('formatData')) {
            data = config.formatData(data);
        }

        var id = req.params.id;
        var columns = [], bindings = [];

        for (var col in data) {
            columns.push('`'+col+'` = ?');
            bindings.push(data[col]);
        }
        bindings.push(id);

        var query = 'UPDATE `'+table+'` SET '+columns.join(',')+' WHERE `id` = ?';
        pool.query(query, bindings, function (error, results, fields) {
            if (error) {
                return res.status(500).send({
                    'error':error
                });
            }

            me.getPublicData(config, id, function(error, results) {
                if (error) {
                    return res.status(500).send({
                        'error':error
                    });
                }

                if (results.length === 0) {
                    return res.status(404).send({
                        'error':['El recurso ha modificar no existe']
                    });
                }

                return res.status(200).send(results[0]);
            });
        });
    };
};

module.exports.delete = function(config, route) {
    var me = this;
    var table = config.table;

    return function(req, res, next) {
        // ACL
        if (config.hasOwnProperty('checkAcl') && !config.checkAcl(req, route)) {
            return res.status(401).send({
                'error':['Acceso no autorizado']
            });
        }

        var id = req.params.id;

        me.getPublicData(config, id, function(error, results) {
            if (error) {
                return res.status(500).send({
                    'error':error
                });
            }

            if (results.length === 0) {
                return res.status(404).send({
                    'error':['El recurso solicitado no existe']
                });
            }

            var result = results[0];
            var bindings = [id];
            var query = 'DELETE FROM `'+table+'` WHERE `id` = ?';

            pool.query(query, bindings, function (error, results, fields) {
                if (error) {
                    return res.status(500).send({
                        'error':error
                    });
                }

                return res.status(200).send(result);
            });
        });
    };
};

module.exports.notAllowed = function() {
    return function(req, res, next) {
        return res.status(405).send({
            'error':['Método no soportado']
        });
    };
};

module.exports.unauthorized = function() {
    return function(req, res, next) {
        return res.status(401).send({
            'error':['Acceso no autorizado']
        });
    };
};