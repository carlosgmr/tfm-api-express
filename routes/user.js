var express = require('express');
var router = express.Router();
var controller = require('../controllers/user');

router.get('/', controller.listing);
router.get('/:id', controller.read);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);
router.get('/:id/group', controller.listingGroup);
router.post('/:id/group', controller.currentGroup);

module.exports = router;