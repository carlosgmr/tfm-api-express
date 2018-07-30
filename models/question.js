var utilities = require('../modules/utilities');

module.exports.config = {
    'table':'question',
    'publicColumns':['id', 'questionary', 'statement', 'sort', 'model', 'created_at', 'updated_at', 'active'],
    'rulesForListing':{
        'questionary':{
            'in': ['query'],
            'optional':{
                'options':{nullable:true}
            },
            'custom':{
                'options': utilities.existsInDb('questionary', 'id', 'questionary')
            }
        },
        'model':{
            'in': ['query'],
            'optional':{
                'options':{nullable:true}
            },
            'custom':{
                'options': utilities.existsInDb('question_model', 'id', 'model')
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
        'questionary':{
            'in': ['body'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'questionary')
            },
            'custom':{
                'options': utilities.existsInDb('questionary', 'id', 'questionary')
            }
        },
        'statement':{
            'in': ['body'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'statement')
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('betweenLength', 'statement', {min:2,max:65535}),
                'options':{min:2,max:65535}
            }
        },
        'sort':{
            'in': ['body'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'sort')
            },
            'isInt':{
                'errorMessage':utilities.errorMessage('betweenInt', 'sort', {min:1,max:9999999999}),
                'options':{min:1,max:9999999999}
            }
        },
        'model':{
            'in': ['body'],
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'model')
            },
            'custom':{
                'options': utilities.existsInDb('question_model', 'id', 'model')
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
        'statement':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('betweenLength', 'statement', {min:2,max:65535}),
                'options':{min:2,max:65535}
            }
        },
        'sort':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isInt':{
                'errorMessage':utilities.errorMessage('betweenInt', 'sort', {min:1,max:9999999999}),
                'options':{min:1,max:9999999999}
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