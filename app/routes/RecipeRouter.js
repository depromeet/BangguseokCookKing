const express = require('express');
const router = express.Router();
const upload = require('../helpers/multerHandler');
const RecipeCtrl = require('../controllers/RecipeCtrl');
const wrap = require('express-async-wrap');

/* 레시피 등록 API */
router.post('/', upload.fields([
		{name: 'recipe', maxCount: 1},
		{name: 'subRecipe', maxCount: 6}
	]),
	wrap(RecipeCtrl.createRecipeHandler));

/* 레시피 삭제 API */
router.delete('/:recipeId', wrap(RecipeCtrl.removeRecipeHandler));

/* recipeId에 맞는 레시피의 정보 응답 API */
router.get('/:recipeId', wrap(RecipeCtrl.getOneRecipeHandler));

module.exports = router;
