var express = require('express');
var router = express.Router();
var controller = require('../controllers/administrator');
var message = require('../modules/message');
var validator = require('express-validator/check');
var checkSchema = validator.checkSchema;

var rulesForCreate = {
    'email':{
        'in': ['body'],
        //'required|email|max:256|unique:'.$this->table.',email',
        'exists':{
            'errorMessage':message.errorMessage('exists', 'email')
        },
        'isEmail':{
            'errorMessage':message.errorMessage('isEmail', 'email')
        },
        'isLength':{
            'errorMessage':message.errorMessage('maxLength', 'email', {max:256}),
            'options':{max:256}
        }
    },
    'password':{
        'in': ['body'],
        'exists':{
            'errorMessage':message.errorMessage('exists', 'password')
        },
        'isLength':{
            'errorMessage':message.errorMessage('betweenLength', 'password', {min:4,max:32}),
            'options':{min:4,max:32}
        }
    },
    'name':{
         'in': ['body'],
        'exists':{
            'errorMessage':message.errorMessage('exists', 'name')
        },
        'isLength':{
            'errorMessage':message.errorMessage('betweenLength', 'name', {min:2,max:64}),
            'options':{min:2,max:64}
        }
    },
    'surname_1':{
        'in': ['body'],
        'exists':{
            'errorMessage':message.errorMessage('exists', 'surname_1')
        },
        'isLength':{
            'errorMessage':message.errorMessage('betweenLength', 'surname_1', {min:2,max:64}),
            'options':{min:2,max:64}
        }
    },
    'surname_2':{
         'in': ['body'],
         'optional':{
             'options':{nullable:true}
         },
        'isLength':{
            'errorMessage':message.errorMessage('betweenLength', 'surname_2', {min:2,max:64}),
            'options':{min:2,max:64}
        }
    },
    'active':{
         'in': ['body'],
         'exists':{
            'errorMessage':message.errorMessage('exists', 'active')
        },
        'isBoolean':{
            'errorMessage':message.errorMessage('isBoolean', 'active')
        }
    }
};

router.get('/', controller.listing);
router.get('/:id', controller.read);
router.post('/', checkSchema(rulesForCreate), controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;