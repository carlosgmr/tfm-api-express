var baseController = require('./base.js');
baseController.config.table = 'group';
baseController.config.publicColumns = [
    'id', 'name', 'description', 'created_at', 'updated_at', 'active'
];

module.exports.listing = baseController.listing();
module.exports.read = baseController.read();
module.exports.create = baseController.create();
module.exports.update = baseController.update();
module.exports.delete = baseController.delete();