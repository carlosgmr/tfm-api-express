var baseController = require('./base.js');
var config = {
    'table':'answer',
    'publicColumns':['id', 'question', 'statement', 'correct'],
    'rulesForListing':[],
    'rulesForCreate':[],
    'rulesForUpdate':[],
    'relations':[]
};

module.exports.listing = baseController.listing(config);
module.exports.read = baseController.read(config);
module.exports.create = baseController.create(config);
module.exports.update = baseController.update(config);
module.exports.delete = baseController.delete(config);