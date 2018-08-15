var express = require('express');
var router = express.Router();
var controller = require('../controllers/user');
var model = require('../models/user');
var validator = require('express-validator/check');
var checkSchema = validator.checkSchema;

router.get('/', controller.listing);
router.get('/:id', controller.read);
router.post('/', checkSchema(model.config.rulesForCreate), controller.create);
router.patch('/:id', checkSchema(model.config.rulesForUpdate), controller.update);
router.delete('/:id', controller.delete);
router.get('/:id/group', controller.listingGroup);
router.post('/:id/group', controller.currentGroup);
router.get('/:id/group/questionary', controller.questionnairesMade);
router.get('/:id/questionary/by-state', controller.questionnairesByState);
router.get('/:id/questionary/:idQuestionary', controller.questionaryDetails);
router.get('/:id/group/:idGroup/questionary/by-state', controller.questionnairesByGroupAndState);

module.exports = router;