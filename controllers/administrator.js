var baseController = require('./base.js');
var config = {
    'table':'administrator',
    'publicColumns':['id', 'email', 'name', 'surname_1', 'surname_2', 'created_at', 'updated_at', 'active'],
    'rulesForListing':[],
    'rulesForCreate':[],
    'rulesForUpdate':[],
    'relations':[],
    'formatData':function(data){
        return data;
    }
};

module.exports.listing = baseController.listing(config);
module.exports.read = baseController.read(config);
module.exports.create = baseController.create(config);
module.exports.update = baseController.update(config);
module.exports.delete = baseController.delete(config);