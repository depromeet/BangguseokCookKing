'use strict';

const mongoClient = require('mongoose');
const subRecipeSchema = require('./subRecipeSchema');
const to = require('await-to-js').default;

const recipeSchema = mongoClient.Schema({
	title: {                // 요리 제목
		type: String,
		required: true
	},                      // TODO: 작성자 ID
	like: {
		type: Number,
		required: true,
		default: 0
	},                      // TODO: 댓글 모델 리스트
	ingredientList: [{      // 재료 리스트
		type: String,
	}],
	thumbnail: {            // 썸네일 상대 경로
		type: String,
		default: "/images/defaultThumbnail.jpg"
	},
	subRecipeList: [{       // 상세 레시피 객체 리스트
		type: mongoClient.Schema.ObjectId,
		minItems: 0,
		maxItems: 6,
	}]
});


recipeSchema.statics.createRecipe = function(recipeObj) {
	return new Promise(async function(resolve, reject) {
		let Task = require('../helpers/fawnHandler').Task();
		let subRecipeList = [];

		// subRecipe 생성
		for(var i = 0; i < recipeObj.subRecipeList.length; i++){
			let subRecipeDoc = new subRecipeSchema({
				order: i + 1,
				thumbnail: recipeObj.subRecipeList[i].thumbnail,
				comment:  recipeObj.subRecipeList[i].comment
			});
			subRecipeList.push(subRecipeDoc);

			Task = Task.save('SubRecipe', subRecipeDoc);
		}

		let recipeDoc = new this({
			title: recipeObj.title,
			ingredientList: recipeObj.ingredientList,
			thumbnail: recipeObj.thumbnail,
			subRecipeList: subRecipeList
		});

		debugger;
		let [err, taskDone] = await to(Task.save('Recipe', recipeDoc).run({useMongoose: true}));
		if(err) {
			logger.error(err); reject(err);
		} else {
			resolve(taskDone);
		}
	}.bind(this))
};



module.exports = mongoClient.model('Recipe', recipeSchema);