var baseController = require('./base.js');
var model = require('../models/question');
var config = model.config;

module.exports.listing = baseController.listing(config, 'question.listing');
module.exports.read = baseController.read(config, 'question.read');
module.exports.create = baseController.create(config, 'question.create');
module.exports.update = baseController.update(config, 'question.update');
module.exports.delete = baseController.delete(config, 'question.delete');