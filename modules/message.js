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
        'isBoolean':'The '+field+' field must be true or false.'
    };
    return messages.hasOwnProperty(key) ? messages[key] : 'Invalid value';
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