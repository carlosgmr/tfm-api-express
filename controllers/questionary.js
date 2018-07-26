var baseController = require('./base.js');
baseController.config.table = 'questionary';
baseController.config.publicColumns = [
    'id', 'group', 'title', 'description', 'model', 'created_at', 'updated_at', 'public', 'active'
];

module.exports.listing = baseController.listing();
module.exports.read = baseController.read();
module.exports.create = baseController.create();
module.exports.update = baseController.update();
module.exports.delete = baseController.delete();