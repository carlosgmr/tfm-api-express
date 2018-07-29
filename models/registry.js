var utilities = require('../modules/utilities');

module.exports.config = {
    'table':'registry',
    'publicColumns':['id', 'user', 'questionary', 'question', 'answer', 'created_at'],
    'rulesForListing':{
        'user':{
            'in': ['query'],
            //'nullable|exists:user,id',
            'optional':{
                'options':{nullable:true}
            }
        },
        'questionary':{
            'in': ['query'],
            //'nullable|exists:questionary,id',
            'optional':{
                'options':{nullable:true}
            }
        },
        'question':{
            'in': ['query'],
            //'nullable|exists:question,id',
            'optional':{
                'options':{nullable:true}
            }
        },
        'answer':{
            'in': ['query'],
            //'nullable|exists:answer,id',
            'optional':{
                'options':{nullable:true}
            }
        }
    },
    'rulesForCreate':{
        'user':{
            'in': ['query'],
            //'nullable|exists:user,id',
            'optional':{
                'options':{nullable:true}
            }
        },
        'questionary':{
            'in': ['query'],
            //'nullable|exists:questionary,id',
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'questionary')
            }
        },
        'question':{
            'in': ['query'],
            //'nullable|exists:question,id',
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'question')
            }
        },
        'answer':{
            'in': ['query'],
            //'nullable|exists:answer,id',
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'answer')
            }
        }
    },
    'rulesForUpdate':{},
    'relations':null
};