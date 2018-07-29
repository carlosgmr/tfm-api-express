var utilities = require('../modules/utilities');

module.exports.config = {
    'table':'answer',
    'publicColumns':['id', 'question', 'statement', 'correct'],
    'rulesForListing':{
        'question':{
            'in': ['query'],
            //'nullable|exists:question,id',
            'optional':{
                'options':{nullable:true}
            }
        }
    },
    'rulesForCreate':{
        'question':{
            'in': ['body'],
            //'required|exists:question,id',
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'question')
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
        'correct':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isBoolean':{
                'errorMessage':utilities.errorMessage('isBoolean', 'correct')
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
        'correct':{
            'in': ['body'],
            'optional':{
                'options':{nullable:true}
            },
            'isBoolean':{
                'errorMessage':utilities.errorMessage('isBoolean', 'correct')
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
    }
};