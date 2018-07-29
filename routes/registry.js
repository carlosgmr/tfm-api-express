var express = require('express');
var router = express.Router();
var controller = require('../controllers/registry');
var model = require('../models/registry');
var validator = require('express-validator/check');
var checkSchema = validator.checkSchema;

router.get('/', checkSchema(model.config.rulesForListing), controller.listing);
router.get('/:id', controller.read);
router.post('/', checkSchema(model.config.rulesForCreate), controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;