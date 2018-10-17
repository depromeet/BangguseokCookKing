const express = require('express');
const router = express.Router();
const mongoHandler = require('../helpers/mongooseHandler');
const member = require('../models/UserSchema');

/* GET home page. */
router.get('/', function(req, res, next) {
    logger.info("test");
    res.json({"ok":"Test"})
});


module.exports = router;
