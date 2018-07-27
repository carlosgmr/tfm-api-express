var baseController = require('./base.js');
var config = {
    'table':'group',
    'publicColumns':['id', 'name', 'description', 'created_at', 'updated_at', 'active'],
    'rulesForListing':[],
    'rulesForCreate':[],
    'rulesForUpdate':[],
    'relations':{
        'instructor':{
            'join':{
                'table':'instructor_group',
                'publicColumns':['added_at'],
                'fkColumn':'instructor',
                'whereColumn':'group'
            },
            'publicColumns':['id', 'email', 'name', 'surname_1', 'surname_2', 'created_at', 'updated_at', 'active']
        },
        'user':{
            'join':{
                'table':'user_group',
                'publicColumns':['added_at'],
                'fkColumn':'user',
                'whereColumn':'group'
            },
            'publicColumns':['id', 'email', 'name', 'surname_1', 'surname_2', 'created_at', 'updated_at', 'active']
        }
    }
};

module.exports.listing = baseController.listing(config);
module.exports.read = baseController.read(config);
module.exports.create = baseController.create(config);
module.exports.update = baseController.update(config);
module.exports.delete = baseController.delete(config);
module.exports.listingInstructor = baseController.listingRelation(config.relations.instructor, 'instructor');
module.exports.listingUser = baseController.listingRelation(config.relations.user, 'user');