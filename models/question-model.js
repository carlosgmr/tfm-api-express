var utilities = require('../modules/utilities');

module.exports.config = {
    'table':'question_model',
    'publicColumns':['id', 'name', 'description', 'created_at', 'updated_at', 'active'],
    'rulesForListing':null,
    'rulesForCreate':{
        'name':{
            'in': ['body'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'name')
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('betweenLength', 'name', {min:2,max:32}),
                'options':{min:2,max:32}
            }
        },
        'description':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('betweenLength', 'description', {min:2,max:256}),
                'options':{min:2,max:256}
            }
        },
        'active':{
            'in': ['body'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'active')
            },
            'isBoolean':{
                'errorMessage':utilities.errorMessage('isBoolean', 'active')
            }
        }
    },
    'rulesForUpdate':{
        'name':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('betweenLength', 'name', {min:2,max:32}),
                'options':{min:2,max:32}
            }
        },
        'description':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('betweenLength', 'description', {min:2,max:256}),
                'options':{min:2,max:256}
            }
        },
        'active':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isBoolean':{
                'errorMessage':utilities.errorMessage('isBoolean', 'active')
            }
        }
    },
    'relations':null,
    'checkAcl':function(req, route){
        switch (route) {
            case 'questionModel.listing':
            case 'questionModel.read':
                if (['administrator', 'instructor', 'user'].indexOf(req.appUser.role) === -1) {
                    return false;
                }
                break;
            case 'questionModel.create':
            case 'questionModel.update':
            case 'questionModel.delete':
                if (['administrator'].indexOf(req.appUser.role) === -1) {
                    return false;
                }
                break;

            default:
                return false;
        }

        return true;
    }
};