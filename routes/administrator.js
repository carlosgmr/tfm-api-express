var express = require('express');
var router = express.Router();
var administratorController = require('../controllers/administrator');

router.get('/', administratorController.listing);
router.get('/:id', administratorController.read);

module.exports = router;
