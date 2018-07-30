var pool = require('../modules/database');

module.exports.errorMessage = function(key, field, formatParams) {
    formatParams = typeof formatParams !== 'undefined' ? formatParams : {};

    var format = function(str, params) {
        for (var index in params) {
            str = str.replace('%'+index+'%', params[index]);
        }
        return str;
    };
    var messages = {
        'exists':'The '+field+' is required.',
        'isEmail':'The '+field+' must be a valid email address.',
        'minLength':format('The '+field+' must be at least %min% characters.', formatParams),
        'maxLength':format('The '+field+' may not be greater than %max% characters.', formatParams),
        'betweenLength':format('The '+field+' must be at least %min% characters and may not be greater than %max% characters.', formatParams),
        'minInt':format('The '+field+' must be at least %min%.', formatParams),
        'maxInt':format('The '+field+' may not be greater than %max%.', formatParams),
        'betweenInt':format('The '+field+' must be at least %min% and may not be greater than %max%.', formatParams),
        'isBoolean':'The '+field+' field must be true or false.',
        'isIn':'The selected '+field+' is invalid.'
    };
    return messages.hasOwnProperty(key) ? messages[key] : 'Invalid value';
};

module.exports.isUnique = function(table, column, nameParam, idColumn) {
    nameParam = typeof nameParam !== 'undefined' ? nameParam : null;
    idColumn = typeof idColumn !== 'undefined' ? idColumn : null;

    return function(value, {req, location, path}) {
        var query = 'SELECT `'+column+'` FROM `'+table+'` WHERE `'+column+'` = ?';
        var bindings = [value];

        if (nameParam !== null && idColumn !== null) {
            query += ' AND `'+idColumn+'` <> ?';
            bindings.push(req.params[nameParam]);
        }

        return new Promise((resolve, reject) => {
            pool.query(query, bindings, function (error, results) {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        })
        .then((results) => {
            if (results.length > 0) {
                return Promise.reject('The '+column+' has already been taken.');
            }
        });
    };
};

module.exports.existsInDb = function(table, column, field) {
    return function(value, {req, location, path}) {
        var query = 'SELECT `'+column+'` FROM `'+table+'` WHERE `'+column+'` = ?';
        var bindings = [value];

        return new Promise((resolve, reject) => {
            pool.query(query, bindings, function (error, results) {
                if (error) {
                    return reject(error);
                }
                return resolve(results);
            });
        })
        .then((results) => {
            if (results.length === 0) {
                return Promise.reject('The selected '+field+' is invalid.');
            }
        });
    };
};

module.exports.formatErrors = function(errors) {
    var result = {}, error;

    for (var i=0; i<errors.length; i++) {
        error = errors[i];
        if (!result.hasOwnProperty(error.param)) {
            result[error.param] = [];
        }
        result[error.param].push(error.msg);
    }

    return result;
};

module.exports.filterRequest = function(requestData, rules) {
    var result = {};

    if (rules) {
        for (var field in rules) {
            if (requestData.hasOwnProperty(field)) {
                result[field] = requestData[field];
            }
        }
    }

    return result;
};