var express = require('express');
var router = express.Router();
var controller = require('../controllers/questionary');
var model = require('../models/questionary');
var validator = require('express-validator/check');
var checkSchema = validator.checkSchema;

router.get('/', checkSchema(model.config.rulesForListing), controller.listing);
router.get('/:id', controller.read);
router.post('/', checkSchema(model.config.rulesForCreate), controller.create);
router.patch('/:id', checkSchema(model.config.rulesForUpdate), controller.update);
router.delete('/:id', controller.delete);
router.get('/:id/complete', controller.readComplete);

module.exports = router;