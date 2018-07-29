var utilities = require('../modules/utilities');

module.exports.config = {
    'table':'questionary',
    'publicColumns':['id', 'group', 'title', 'description', 'model', 'created_at', 'updated_at', 'public', 'active'],
    'rulesForListing':{
        'group':{
            'in': ['query'],
            //'nullable|exists:group,id',
            'optional':{
                'options':{nullable:true}
            }
        },
        'model':{
            'in': ['query'],
            //'nullable|exists:questionary_model,id',
            'optional':{
                'options':{nullable:true}
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
            //'required|exists:group,id',
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'group')
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
            //'required|exists:questionary_model,id',
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'model')
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
    'relations':null
};