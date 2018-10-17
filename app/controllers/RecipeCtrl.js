'use strict';

const RecipeSchema = require('../models/RecipeSchema');
const to = require('await-to-js').default;

exports.createRecipeHandler = async(req, res, next) => {
	// TODO: 데이터 형식 정해야함
	// TODO: 사진 업로드 해야함

	let recipeData = {
		title: "계란찜",
		ingredientList: ["계란 3알", "물 반컵"],
		thumbnail: "/testUrl",
		subRecipeList: [{
			order: 1,
			thumbnail: "/test1",
			comment:  "test 코멘트"
		}, {
			order: 2,
			thumbnail: "/test2",
			comment:  "test 코멘트2"
		}]
	};

	let [err, recipeDoc] = await to(RecipeSchema.createRecipe(recipeData));
	if(err) {
		err.message = "회원가입을 실패하였습니다."; throw err;
	}

	res.json({
		"success": true,
		"code": 200,
		"message": "업로드 완료",
		"time": new Date()
	})
};