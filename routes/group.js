var express = require('express');
var router = express.Router();
var controller = require('../controllers/group');
var model = require('../models/group');
var validator = require('express-validator/check');
var checkSchema = validator.checkSchema;

router.get('/', controller.listing);
router.get('/:id', controller.read);
router.post('/', checkSchema(model.config.rulesForCreate), controller.create);
router.patch('/:id', checkSchema(model.config.rulesForUpdate), controller.update);
router.delete('/:id', controller.delete);
router.get('/:id/instructor', controller.listingInstructor);
router.get('/:id/user', controller.listingUser);
router.post('/:id/instructor', controller.currentInstructor);
router.post('/:id/user', controller.currentUser);

module.exports = router;