const express = require('express');
const router = express.Router();
const RecipeCtrl = require('../controllers/RecipeCtrl');
const wrap = require('express-async-wrap');

/* 레시피 등록 API */
router.post('/', wrap(RecipeCtrl.createRecipeHandler));

/* 레시피 삭제 API */
router.delete('/:recipeId', wrap(RecipeCtrl.removeRecipeHandler));

router.get('/:recipeId', wrap(RecipeCtrl.getOneRecipeHandler));

module.exports = router;
