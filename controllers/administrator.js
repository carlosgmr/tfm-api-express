//var DB = require('../models/database.js');
var baseController = require('./base.js');
baseController.config.table = 'administrator';
baseController.config.publicColumns = [
    'id', 'email', 'name', 'surname_1', 'surname_2', 'created_at', 'updated_at', 'active'
];

module.exports.listing = baseController.listing();
module.exports.read = baseController.read();