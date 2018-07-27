var baseController = require('./base.js');
var config = {
    'table':'questionary',
    'publicColumns':['id', 'group', 'title', 'description', 'model', 'created_at', 'updated_at', 'public', 'active'],
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