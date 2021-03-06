var appConfig = require('../config.js');
var utilities = require('../modules/utilities');
var bcrypt = require('bcrypt');
var sha1 = require('sha1');

module.exports.config = {
    'table':'instructor',
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
                'options': utilities.isUnique('instructor', 'email')
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
                'options': utilities.isUnique('instructor', 'email', 'id', 'id')
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
                'table':'instructor_group',
                'publicColumns':['added_at'],
                'fkColumn':'group',
                'whereColumn':'instructor'
            },
            'publicColumns':['id', 'name', 'description', 'created_at', 'updated_at', 'active']
        }
    },
    'formatData':function(data){
        if (data.hasOwnProperty('password')) {
            switch (appConfig.passwordAlgo) {
                case 'bcrypt':
                    var saltRounds = 10;
                    var salt = bcrypt.genSaltSync(saltRounds);
                    data['password'] = bcrypt.hashSync(data['password'], salt);
                    break;
                case 'sha1':
                    data['password'] = sha1(data['password']);
                    break;
            }
        }
        return data;
    },
    'checkAcl':function(req, route){
        switch (route) {
            case 'instructor.read':
            case 'instructor.listing':
            case 'instructor.listing.group':
                if (['administrator', 'instructor', 'user'].indexOf(req.appUser.role) === -1) {
                    return false;
                }
                break;
            case 'instructor.update':
            case 'instructor.listing.questionary':
                if (['administrator', 'instructor'].indexOf(req.appUser.role) === -1) {
                    return false;
                }
                if (req.appUser.role === 'instructor' &&  req.appUser.id !== parseInt(req.params.id, 10)) {
                    return false;
                }
                break;
            case 'instructor.create':
            case 'instructor.delete':
            case 'instructor.current.group':
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