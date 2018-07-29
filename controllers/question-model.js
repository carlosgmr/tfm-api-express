var baseController = require('./base.js');
var model = require('../models/question-model');
var config = model.config;

module.exports.listing = baseController.listing(config);
module.exports.read = baseController.read(config);
module.exports.create = baseController.notAllowed();
module.exports.update = baseController.update(config);
module.exports.delete = baseController.notAllowed();