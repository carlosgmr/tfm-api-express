var baseController = require('./base.js');
var model = require('../models/question-model');
var config = model.config;

module.exports.listing = baseController.listing(config, 'questionModel.listing');
module.exports.read = baseController.read(config, 'questionModel.read');
module.exports.create = baseController.notAllowed(); //'questionModel.create'
module.exports.update = baseController.update(config, 'questionModel.update');
module.exports.delete = baseController.notAllowed(); //'questionModel.delete'