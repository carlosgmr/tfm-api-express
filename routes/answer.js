var express = require('express');
var router = express.Router();
var controller = require('../controllers/answer');

router.get('/', controller.listing);
router.get('/:id', controller.read);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;