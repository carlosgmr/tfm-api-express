var utilities = require('../modules/utilities');
var bcrypt = require('bcrypt');

module.exports.config = {
    'table':'user',
    'publicColumns':['id', 'email', 'name', 'surname_1', 'surname_2', 'created_at', 'updated_at', 'active'],
    'rulesForListing':null,
    'rulesForCreate':{
        'email':{
            'in': ['body'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'email')
            },
            'isEmail':{
                'errorMessage':utilities.errorMessage('isEmail', 'email')
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('maxLength', 'email', {max:256}),
                'options':{max:256}
            },
            'custom':{
                'options': utilities.isUnique('user', 'email')
            }
        },
        'password':{
            'in': ['body'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'password')
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('betweenLength', 'password', {min:4,max:32}),
                'options':{min:4,max:32}
            }
        },
        'name':{
            'in': ['body'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'name')
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('betweenLength', 'name', {min:2,max:64}),
                'options':{min:2,max:64}
            }
        },
        'surname_1':{
            'in': ['body'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'surname_1')
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('betweenLength', 'surname_1', {min:2,max:64}),
                'options':{min:2,max:64}
            }
        },
        'surname_2':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('betweenLength', 'surname_2', {min:2,max:64}),
                'options':{min:2,max:64}
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
        'email':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isEmail':{
                'errorMessage':utilities.errorMessage('isEmail', 'email')
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('maxLength', 'email', {max:256}),
                'options':{max:256}
            },
            'custom':{
                'options': utilities.isUnique('user', 'email', 'id', 'id')
            }
        },
        'password':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('betweenLength', 'password', {min:4,max:32}),
                'options':{min:4,max:32}
            }
        },
        'name':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('betweenLength', 'name', {min:2,max:64}),
                'options':{min:2,max:64}
            }
        },
        'surname_1':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('betweenLength', 'surname_1', {min:2,max:64}),
                'options':{min:2,max:64}
            }
        },
        'surname_2':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('betweenLength', 'surname_2', {min:2,max:64}),
                'options':{min:2,max:64}
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
        'group':{
            'join':{
                'table':'user_group',
                'publicColumns':['added_at'],
                'fkColumn':'group',
                'whereColumn':'user'
            },
            'publicColumns':['id', 'name', 'description', 'created_at', 'updated_at', 'active']
        }
    },
    'formatData':function(data){
        if (data.hasOwnProperty('password')) {
            var saltRounds = 10;
            var salt = bcrypt.genSaltSync(saltRounds);
            data['password'] = bcrypt.hashSync(data['password'], salt);
        }
        return data;
    },
    'checkAcl':function(req, route){
        switch (route) {
            case 'user.read':
            case 'user.listing':
            case 'user.listing.group':
                if (['administrator', 'instructor', 'user'].indexOf(req.appUser.role) === -1) {
                    return false;
                }
                break;
            case 'user.update':
                if (['administrator', 'user'].indexOf(req.appUser.role) === -1) {
                    return false;
                }

                if (req.appUser.role === 'user' &&  req.appUser.id !== parseInt(req.params.id, 10)) {
                    return false;
                }
                break;
            case 'user.create':
            case 'user.delete':
            case 'user.current.group':
                if (['administrator'].indexOf(req.appUser.role) === -1) {
                    return false;
                }
                break;
            case 'user.listing.questionnairesMade':
            case 'user.read.questionaryDetails':
            case 'user.listing.questionnairesByGroupAndState':
            case 'user.listing.questionnairesByState':
                if (['administrator', 'instructor', 'user'].indexOf(req.appUser.role) === -1) {
                    return false;
                }
                if (req.appUser.role === 'user' &&  req.appUser.id !== parseInt(req.params.id, 10)) {
                    return false;
                }
                break;

            default:
                return false;
        }

        return true;
    },
    'formatQuestionnairesByState':function(items){
        var result = [], item;

        for (var i=0; i<items.length; i++) {
            item = items[i];
            result.push({
                'id': item['questionary_id'],
                'group': {
                    'id': item['group_id'],
                    'name': item['group_name']
                },
                'title': item['questionary_title'],
                'description': item['questionary_description'],
                'model': item['questionary_model'],
                'created_at': item['questionary_created_at'],
                'updated_at': item['questionary_updated_at'],
                'public': item['questionary_public'],
                'active': item['questionary_active']
            });
        }

        return result;
    }
};