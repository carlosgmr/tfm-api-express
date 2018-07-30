var express = require('express');
var router = express.Router();
var controller = require('../controllers/auth');
var validator = require('express-validator/check');
var checkSchema = validator.checkSchema;
var utilities = require('../modules/utilities');
var rulesForLogin = {
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
    'role':{
        'in': ['body'],
        'exists':{
            'errorMessage':utilities.errorMessage('exists', 'role')
        },
        'isIn':{
            'errorMessage':utilities.errorMessage('isIn', 'role'),
            'options':[['administrator','instructor','user']]
        }
    }
};

router.post('/login', checkSchema(rulesForLogin), controller.authenticate);

module.exports = router;