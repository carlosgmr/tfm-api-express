var express = require('express');
var router = express.Router();
var controller = require('../controllers/group');

router.get('/', controller.listing);
router.get('/:id', controller.read);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);
router.get('/:id/instructor', controller.listingInstructor);
router.get('/:id/user', controller.listingUser);
router.post('/:id/instructor', controller.currentInstructor);
router.post('/:id/user', controller.currentUser);

module.exports = router;