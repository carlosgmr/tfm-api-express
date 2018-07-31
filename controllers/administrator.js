var baseController = require('./base.js');
var model = require('../models/administrator');
var config = model.config;

module.exports.listing = baseController.listing(config, 'administrator.listing');
module.exports.read = baseController.read(config, 'administrator.read');
module.exports.create = baseController.create(config, 'administrator.create');
module.exports.update = baseController.update(config, 'administrator.update');
module.exports.delete = baseController.delete(config, 'administrator.delete');