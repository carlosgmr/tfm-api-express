var baseController = require('./base.js');
var model = require('../models/questionary-model');
var config = model.config;

module.exports.listing = baseController.listing(config, 'questionaryModel.listing');
module.exports.read = baseController.read(config, 'questionaryModel.read');
module.exports.create = baseController.notAllowed(); //'questionaryModel.create'
module.exports.update = baseController.update(config, 'questionaryModel.update');
module.exports.delete = baseController.notAllowed(); //'questionaryModel.delete'