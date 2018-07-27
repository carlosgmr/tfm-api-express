var baseController = require('./base.js');
var config = {
    'table':'registry',
    'publicColumns':['id', 'user', 'questionary', 'question', 'answer', 'created_at'],
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
module.exports.update = baseController.notAllowed();
module.exports.delete = baseController.notAllowed();