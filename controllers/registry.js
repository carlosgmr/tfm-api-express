var baseController = require('./base.js');
baseController.config.table = 'registry';
baseController.config.publicColumns = [
    'id', 'user', 'questionary', 'question', 'answer', 'created_at'
];

module.exports.listing = baseController.listing();
module.exports.read = baseController.read();
module.exports.create = baseController.create();
module.exports.update = baseController.update();
module.exports.delete = baseController.delete();