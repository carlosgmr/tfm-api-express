var baseController = require('./base.js');
var model = require('../models/answer');
var config = model.config;

module.exports.listing = baseController.listing(config, 'answer.listing');
module.exports.read = baseController.read(config, 'answer.read');
module.exports.create = baseController.create(config, 'answer.create');
module.exports.update = baseController.update(config, 'answer.update');
module.exports.delete = baseController.delete(config, 'answer.delete');