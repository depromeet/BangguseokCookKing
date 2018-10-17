const express = require('express');
const router = express.Router();
const RecipeCtrl = require('../controllers/RecipeCtrl');
const wrap = require('express-async-wrap');

/* */
router.post('/', wrap(RecipeCtrl.createRecipeHandler));

module.exports = router;
