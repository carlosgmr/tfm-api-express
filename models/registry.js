var utilities = require('../modules/utilities');

module.exports.config = {
    'table':'registry',
    'publicColumns':['id', 'user', 'questionary', 'question', 'answer', 'created_at'],
    'rulesForListing':{
        'user':{
            'in': ['query'],
            'optional':{
                'options':{nullable:true}
            },
            'custom':{
                'options': utilities.existsInDb('user', 'id', 'user')
            }
        },
        'questionary':{
            'in': ['query'],
            'optional':{
                'options':{nullable:true}
            },
            'custom':{
                'options': utilities.existsInDb('questionary', 'id', 'questionary')
            }
        },
        'question':{
            'in': ['query'],
            'optional':{
                'options':{nullable:true}
            },
            'custom':{
                'options': utilities.existsInDb('question', 'id', 'question')
            }
        },
        'answer':{
            'in': ['query'],
            'optional':{
                'options':{nullable:true}
            },
            'custom':{
                'options': utilities.existsInDb('answer', 'id', 'answer')
            }
        }
    },
    'rulesForCreate':{
        'user':{
            'in': ['query'],
            'optional':{
                'options':{nullable:true}
            },
            'custom':{
                'options': utilities.existsInDb('user', 'id', 'user')
            }
        },
        'questionary':{
            'in': ['query'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'questionary')
            },
            'custom':{
                'options': utilities.existsInDb('questionary', 'id', 'questionary')
            }
        },
        'question':{
            'in': ['query'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'question')
            },
            'custom':{
                'options': utilities.existsInDb('question', 'id', 'question')
            }
        },
        'answer':{
            'in': ['query'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'answer')
            },
            'custom':{
                'options': utilities.existsInDb('answer', 'id', 'answer')
            }
        }
    },
    'rulesForUpdate':{},
    'relations':null,
    'checkAcl':function(req, route){
        switch (route) {
            case 'registry.listing':
            case 'registry.read':
                if (['administrator', 'instructor'].indexOf(req.appUser.role) === -1) {
                    return false;
                }
                break;
            case 'registry.create':
                if (['user'].indexOf(req.appUser.role) === -1) {
                    return false;
                }
                break;
            case 'registry.update':
            case 'registry.delete':
                break;

            default:
                return false;
        }

        return true;
    }
};