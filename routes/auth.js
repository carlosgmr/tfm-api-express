var express = require('express');
var router = express.Router();
var controller = require('../controllers/auth');
var validator = require('express-validator/check');
var checkSchema = validator.checkSchema;
var model = require('../models/auth');

router.post('/login', checkSchema(model.config.rulesForLogin), controller.authenticate);

module.exports = router;