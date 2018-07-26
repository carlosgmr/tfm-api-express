var baseController = require('./base.js');
baseController.config.table = 'instructor';
baseController.config.publicColumns = [
    'id', 'email', 'name', 'surname_1', 'surname_2', 'created_at', 'updated_at', 'active'
];

module.exports.listing = baseController.listing();
module.exports.read = baseController.read();
module.exports.create = baseController.create();
module.exports.update = baseController.update();
module.exports.delete = baseController.delete();