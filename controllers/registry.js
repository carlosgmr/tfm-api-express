var baseController = require('./base.js');
var model = require('../models/registry');
var config = model.config;

module.exports.listing = baseController.listing(config);
module.exports.read = baseController.read(config);
module.exports.create = baseController.create(config);
module.exports.update = baseController.notAllowed();
module.exports.delete = baseController.notAllowed();