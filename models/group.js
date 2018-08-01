var utilities = require('../modules/utilities');

module.exports.config = {
    'table':'group',
    'publicColumns':['id', 'name', 'description', 'created_at', 'updated_at', 'active'],
    'rulesForListing':null,
    'rulesForCreate':{
        'name':{
            'in': ['body'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'name')
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('betweenLength', 'name', {min:2,max:256}),
                'options':{min:2,max:256}
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
                'errorMessage':utilities.errorMessage('betweenLength', 'name', {min:2,max:256}),
                'options':{min:2,max:256}
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
    },
    'checkAcl':function(req, route){
        switch (route) {
            case 'group.listing':
            case 'group.read':
            case 'group.listing.instructor':
            case 'group.listing.user':
                if (['administrator', 'instructor', 'user'].indexOf(req.appUser.role) === -1) {
                    return false;
                }
                break;
            case 'group.create':
            case 'group.update':
            case 'group.delete':
            case 'group.current.instructor':
            case 'group.current.user':
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