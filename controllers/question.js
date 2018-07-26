var baseController = require('./base.js');
baseController.config.table = 'question';
baseController.config.publicColumns = [
    'id', 'questionary', 'statement', 'sort', 'model', 'created_at', 'updated_at', 'active'
];

module.exports.listing = baseController.listing();
module.exports.read = baseController.read();
module.exports.create = baseController.create();
module.exports.update = baseController.update();
module.exports.delete = baseController.delete();