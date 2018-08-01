var baseController = require('./base.js');
var model = require('../models/questionary');
var config = model.config;

module.exports.listing = baseController.listing(config, 'questionary.listing');
module.exports.read = baseController.read(config, 'questionary.read');
module.exports.create = baseController.create(config, 'questionary.create');
module.exports.update = baseController.update(config, 'questionary.update');
module.exports.delete = baseController.delete(config, 'questionary.delete');