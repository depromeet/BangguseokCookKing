'use strict';

const IngredientTagSchema = require('../models/IngredientTagSchema');
const to = require('await-to-js').default;

exports.searchRecipeByTag = async function(req ,res, next) {
	let searchTag = req.query.tag;
	logger.info("tag = " + searchTag);

	let [err, recipeDocList] = await to (IngredientTagSchema.searchRecipeByTag(searchTag));
	if(err) {throw err;}

	res.json({
		"success": true,
		"code": 200,
		"message": "레시피 찾기 완료",
		"data": recipeDocList,
		"time": new Date()
	})
};