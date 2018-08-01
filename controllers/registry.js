var baseController = require('./base.js');
var model = require('../models/registry');
var config = model.config;

module.exports.listing = baseController.listing(config, 'registry.listing');
module.exports.read = baseController.read(config, 'registry.read');
module.exports.create = baseController.create(config, 'registry.create');
module.exports.update = baseController.notAllowed(); //'registry.update'
module.exports.delete = baseController.notAllowed(); //'registry.delete'