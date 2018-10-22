'use strict';

const RecipeSchema = require('../models/RecipeSchema');
const to = require('await-to-js').default;

exports.createRecipeHandler = async(req, res, next) => {
	let recipeData;
	try {
		recipeData = {
			title: req.body.title,
			//author: "김민호",
			ingredientList: JSON.parse(req.body.ingredientList),
			thumbnail: req.files.recipe[0].path.substr(6),
			subRecipeList: JSON.parse(req.body.subRecipeList)
		};
	} catch (err) {
		err.myMessage = "잘못된 json 데이터입니다."; throw err;
	}

	let [err, recipeDoc] = await to(RecipeSchema.createRecipe(recipeData));
	if(err) {logger.error(err); throw err; }

	res.json({
		"success": true,
		"code": 200,
		"message": "레시피 등록 완료",
		"time": new Date()
	})
};

exports.removeRecipeHandler = async function(req, res, next) {
	let recipeId = req.params.recipeId;

	let [err, recipeDoc] = await to(RecipeSchema.removeRecipeCascade(recipeId));
	if(err)
		throw err;

	res.json({
		"success": true,
		"code": 200,
		"message": "레시피 삭제 완료",
		"time": new Date()
	})
};

exports.getOneRecipeHandler = async function(req, res, next) {
	let recipeId = req.params.recipeId;

	let [err, recipeDoc] = await to(RecipeSchema.getOneRecipeById(recipeId));
	if(err) throw err;

	res.json({
		"success": true,
		"code": 200,
		"message": "레시피 찾기 완료",
		"data": recipeDoc,
		"time": new Date()
	})
};

exports.searchRecipeByText = async function(req ,res, next) {
	let searchText = req.query.search;

	let [err, recipeDocList] = await to (RecipeSchema.searchRecipeByText(searchText));
	if(err) throw err;

	res.json({
		"success": true,
		"code": 200,
		"message": "레시피 찾기 완료",
		"data": recipeDocList,
		"time": new Date()
	})
};