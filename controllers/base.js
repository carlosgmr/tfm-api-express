var mysql = require('mysql');
var connection = mysql.createConnection({
    'host': '192.168.1.61',
    'port': 3316,
    'user': 'root',
    'password': 'keWa25Bcw83g',
    'database': 'tfm',
    'dateStrings': true
});

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
    var publicColumns = [];

    me.config.publicColumns.forEach(function(currentValue, index, array) {
        publicColumns.push('`'+currentValue+'`');
    });

    return function(req, res, next) {
        // de momento cogemos los datos directamente del request
        var data = req.query;
        var query = 'SELECT '+publicColumns.join(',')+' FROM `'+me.config.table+'`';
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
};

module.exports.createInDb = function() {
};

module.exports.update = function() {
};

module.exports.updateInDb = function() {
};

module.exports.delete = function() {
};