var express = require('express');
var router = express.Router();
var controller = require('../controllers/instructor');
var model = require('../models/instructor');
var validator = require('express-validator/check');
var checkSchema = validator.checkSchema;

router.get('/', controller.listing);
router.get('/:id', controller.read);
router.post('/', checkSchema(model.config.rulesForCreate), controller.create);
router.patch('/:id', checkSchema(model.config.rulesForUpdate), controller.update);
router.delete('/:id', controller.delete);
router.get('/:id/group', controller.listingGroup);
router.post('/:id/group', controller.currentGroup);
router.get('/:id/questionary', controller.listingQuestionary);

module.exports = router;