//var DB = require('../models/database.js');
exports.listing = function(req, res, next){
    var results = [
        {"id":1,"name":"Carlos"},
        {"id":2,"name":"Juan"}
    ];

    return res.status(200).send(results);
};