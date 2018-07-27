var baseController = require('./base.js');
var config = {
    'table':'questionary_model',
    'publicColumns':['id', 'name', 'description', 'created_at', 'updated_at', 'active'],
    'rulesForListing':[],
    'rulesForCreate':[],
    'rulesForUpdate':[],
    'relations':[]
};

module.exports.listing = baseController.listing(config);
module.exports.read = baseController.read(config);
module.exports.create = baseController.notAllowed();
module.exports.update = baseController.update(config);
module.exports.delete = baseController.notAllowed();