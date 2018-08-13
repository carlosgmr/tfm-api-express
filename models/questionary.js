var utilities = require('../modules/utilities');

module.exports.config = {
    'table':'questionary',
    'publicColumns':['id', 'group', 'title', 'description', 'model', 'created_at', 'updated_at', 'public', 'active'],
    'rulesForListing':{
        'group':{
            'in': ['query'],
            'optional':{
                'options':{nullable:true}
            },
            'custom':{
                'options': utilities.existsInDb('group', 'id', 'group')
            }
        },
        'model':{
            'in': ['query'],
            'optional':{
                'options':{nullable:true}
            },
            'custom':{
                'options': utilities.existsInDb('questionary_model', 'id', 'model')
            }
        },
        'public':{
            'in': ['query'],
            'optional':{
                'options':{nullable:true}
            },
            'isBoolean':{
                'errorMessage':utilities.errorMessage('isBoolean', 'public')
            }
        },
        'active':{
            'in': ['query'],
            'optional':{
                'options':{nullable:true}
            },
            'isBoolean':{
                'errorMessage':utilities.errorMessage('isBoolean', 'active')
            }
        }
    },
    'rulesForCreate':{
        'group':{
            'in': ['body'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'group')
            },
            'custom':{
                'options': utilities.existsInDb('group', 'id', 'group')
            }
        },
        'title':{
            'in': ['body'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'title')
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('betweenLength', 'title', {min:2,max:256}),
                'options':{min:2,max:256}
            }
        },
        'description':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('maxLength', 'description', {max:65535}),
                'options':{max:65535}
            }
        },
        'model':{
            'in': ['body'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'model')
            },
            'custom':{
                'options': utilities.existsInDb('questionary_model', 'id', 'model')
            }
        },
        'public':{
            'in': ['body'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'public')
            },
            'isBoolean':{
                'errorMessage':utilities.errorMessage('isBoolean', 'public')
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
        'title':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('betweenLength', 'title', {min:2,max:256}),
                'options':{min:2,max:256}
            }
        },
        'description':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('maxLength', 'description', {max:65535}),
                'options':{max:65535}
            }
        },
        'public':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isBoolean':{
                'errorMessage':utilities.errorMessage('isBoolean', 'public')
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
            case 'questionary.listing':
            case 'questionary.read':
                if (['administrator', 'instructor', 'user'].indexOf(req.appUser.role) === -1) {
                    return false;
                }
                break;
            case 'questionary.create':
            case 'questionary.update':
            case 'questionary.delete':
            case 'questionary.readComplete':
                if (['instructor'].indexOf(req.appUser.role) === -1) {
                    return false;
                }
                break;

            default:
                return false;
        }

        return true;
    }
};