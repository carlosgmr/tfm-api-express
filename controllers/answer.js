var baseController = require('./base.js');
baseController.config.table = 'answer';
baseController.config.publicColumns = [
    'id', 'question', 'statement', 'correct'
];

module.exports.listing = baseController.listing();
module.exports.read = baseController.read();
module.exports.create = baseController.create();
module.exports.update = baseController.update();
module.exports.delete = baseController.delete();