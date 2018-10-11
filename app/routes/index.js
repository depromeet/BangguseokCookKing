const express = require('express');
const router = express.Router();
const mongoHandler = require('../helpers/mongooseHandler');
const member = require('../models/UserSchema');

/* GET home page. */
router.get('/', function(req, res, next) {
    logger.info("test");
    res.json({"ok":"Test"})
});

router.get('/find', (req, res, next) => {
    for(let i = 0; i < 5; i++) {
        member.find({ name: "Kim MinHo"}, (err, member) => {
            if(err)
                console.log("ERR: ", err);
            else {
                console.log(member);
            }
        })
    }
    res.send('finish');
});

router.get('/fix', (req, res, next) => {

    mongoHandler.connect();
    res.send('connect!');
});

module.exports = router;
