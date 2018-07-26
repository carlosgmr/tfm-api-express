var mysql = require('mysql');
var appConfig = require('../config.js');
var connection = mysql.createConnection(appConfig.db);

module.exports.config = {
    'table':null,
    'publicColumns':[],
    'rulesForListing':[],
    'rulesForCreate':[],
    'rulesForUpdate':[],
    'relations':[]
};

module.exports.listing = function() {
    var me = this;
    var table = me.config.table;
    var publicColumns = [];

    me.config.publicColumns.forEach(function(currentValue, index, array) {
        publicColumns.push('`'+currentValue+'`');
    });

    return function(req, res, next) {
        // de momento cogemos los datos directamente del request
        var data = req.query;
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

        connection.query(query, bindings, function (error, results, fields) {
            if (error) {
                return res.status(500).send({
                    'error':error
                });
            }

            return res.status(200).send(results);
        });
    };
};

module.exports.listingRelation = function() {
};

module.exports.read = function() {
    var me = this;

    return function(req, res, next) {
        me.getPublicData(req.params.id, function(error, results) {
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

module.exports.getPublicData = function(id, callback) {
    var me = this;
    var publicColumns = [];

    me.config.publicColumns.forEach(function(currentValue, index, array) {
        publicColumns.push('`'+currentValue+'`');
    });

    var query = 'SELECT '+publicColumns.join(',')+' FROM `'+me.config.table+'` WHERE id = ?';
    var bindings = [id];

    connection.query(query, bindings, function (error, results, fields) {
        if (error) {
            callback(error, null);
            return;
        }

        callback(null, results);
        return;
    });
};

module.exports.create = function() {
    var me = this;
    var table = me.config.table;

    return function(req, res, next) {
        // de momento cogemos los datos directamente del request
        var data = req.body;
        var columns = [], bindings = [], params = [];

        for (var col in data) {
            columns.push('`'+col+'`');
            bindings.push(data[col]);
            params.push('?');
        }

        var query = 'INSERT INTO `'+table+'` ('+columns.join(',')+') VALUES ('+params.join(',')+')';
        connection.query(query, bindings, function (error, results, fields) {
            if (error) {
                return res.status(500).send({
                    'error':error
                });
            }

            var id = results.insertId;
            me.getPublicData(id, function(error, results) {
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

module.exports.update = function() {
    var me = this;
    var table = me.config.table;

    return function(req, res, next) {
        var id = req.params.id;
        // de momento cogemos los datos directamente del request
        var data = req.body;
        var columns = [], bindings = [];

        for (var col in data) {
            columns.push('`'+col+'` = ?');
            bindings.push(data[col]);
        }
        bindings.push(id);

        var query = 'UPDATE `'+table+'` SET '+columns.join(',')+' WHERE `id` = ?';
        connection.query(query, bindings, function (error, results, fields) {
            if (error) {
                return res.status(500).send({
                    'error':error
                });
            }

            me.getPublicData(id, function(error, results) {
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

module.exports.delete = function() {
    var me = this;
    var table = me.config.table;

    return function(req, res, next) {
        var id = req.params.id;

        me.getPublicData(id, function(error, results) {
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

            connection.query(query, bindings, function (error, results, fields) {
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