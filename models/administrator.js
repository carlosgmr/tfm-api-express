var utilities = require('../modules/utilities');

module.exports.config = {
    'table':'administrator',
    'publicColumns':['id', 'email', 'name', 'surname_1', 'surname_2', 'created_at', 'updated_at', 'active'],
    'rulesForListing':null,
    'rulesForCreate':{
        'email':{
            'in': ['body'],
            //'required|email|max:256|unique:'.$this->table.',email',
            'exists':{
                'errorMessage':utilities.errorMessage('exists', 'email')
            },
            'isEmail':{
                'errorMessage':utilities.errorMessage('isEmail', 'email')
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('maxLength', 'email', {max:256}),
                'options':{max:256}
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
            //'required|email|max:256|unique:'.$this->table.',email',
            'optional':{
                'options':{nullable:true}
            },
            'isEmail':{
                'errorMessage':utilities.errorMessage('isEmail', 'email')
            },
            'isLength':{
                'errorMessage':utilities.errorMessage('maxLength', 'email', {max:256}),
                'options':{max:256}
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
    'relations':null,
    'formatData':function(data){
        return data;
    }
};