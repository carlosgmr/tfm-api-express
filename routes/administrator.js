var express = require('express');
var router = express.Router();
var controller = require('../controllers/administrator');
var model = require('../models/administrator');
var validator = require('express-validator/check');
var checkSchema = validator.checkSchema;

router.get('/', controller.listing);
router.get('/:id', controller.read);
router.post('/', checkSchema(model.config.rulesForCreate), controller.create);
router.patch('/:id', checkSchema(model.config.rulesForUpdate), controller.update);
router.delete('/:id', controller.delete);

module.exports = router;