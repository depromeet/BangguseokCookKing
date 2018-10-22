'use strict';

const mongoClient = require('mongoose');
const SubRecipeSchema = require('./SubRecipeSchema');
const IngredientTagSchema = require('./IngredientTagSchema');
const to = require('await-to-js').default;
// error
const ClientError = require('../helpers/errors/ClientError');

const recipeSchema = mongoClient.Schema({
	title: {                // 요리 제목
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true
	},
	like: {
		type: Number,
		required: true,
		default: 0
	},                      // TODO: 댓글 모델 리스트
	ingredientList: [{      // 재료 문자열(재료 + 계량) 리스트
		type: String,
	}],
	ingredientTagList: [{   // 재료 태그(스키마) 리스트
		type: mongoClient.Schema.ObjectId,
		ref: "IngredientTag"
	}],
	thumbnail: {            // 썸네일 상대 경로
		type: String,
		default: "/images/defaultThumbnail.jpg"
	},
	subRecipeList: [{       // 상세 레시피 객체 리스트
		type: mongoClient.Schema.ObjectId,
		ref: "SubRecipe",
		minItems: 0,
		maxItems: 6,
	}]
});

recipeSchema.statics.createRecipe = function(recipeObj) {
	// TODO: 좀 더 깔끔히 할 것
	return new Promise(async function(resolve, reject) {
		let Task = require('../helpers/fawnHandler').Task();
		let subRecipeList = [];
		let IngredientTagList = [];

		// subRecipe 생성
		for(let i = 0; i < recipeObj.subRecipeList.length; i++){
			let subRecipeDoc = new SubRecipeSchema({
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


		// IngredientTag 생성 혹은 업데이트
		for(let i = 0; i < recipeObj.ingredientList.length; i++){
			let ingredient = recipeObj.ingredientList[i].split(' ')[0];

			let [err, IngredientTagDoc] = await to(IngredientTagSchema.findOne({ingredient:ingredient}).exec());
			if(err) { reject(err); Task.save(err); return ;}
			if(IngredientTagDoc === null) {
				IngredientTagDoc = new IngredientTagSchema({ ingredient: ingredient});
				IngredientTagDoc.RecipeList.push(recipeDoc._id);
				Task = Task.save('IngredientTag', IngredientTagDoc);
			} else {
				Task = Task.update('IngredientTag', {ingredient: ingredient}, {$push: {RecipeList: recipeDoc._id}});
			}

			IngredientTagList.push(IngredientTagDoc._id);
		}

		for(let i = 0; i < IngredientTagList.length; i++){
			recipeDoc.ingredientTagList.push(IngredientTagList[i]);
		}

		let [err, taskDone] = await to(Task.save('Recipe', recipeDoc).run({useMongoose: true}));
		if(err) {
			logger.error(err); err.myMessage = "레시피 등록에 실패했습니다."; reject(err);
		} else {
			resolve(taskDone);
		}
	}.bind(this))
};

recipeSchema.statics.removeRecipeCascade = function (recipeId) {
	// TODO: 이미지 파일 삭제도 같이 해야한다.
	return new Promise(async function(resolve, reject) {
		let [err, recipeDoc] = await to(this.findById(recipeId).exec());
		if(err) {
			err.myMessage= "레시피 삭제에 오류가 발생했습니다."; reject(err);
		}
		if(recipeDoc === null)
			reject(new ClientError("레시피가 이미 존재하지 않습니다.", 400, Date.now()));

		// Recipe에 연관된 subRecipe 삭제
		for(let i = 0; i < recipeDoc.subRecipeList.length; i++) {
			let subRecipeId = recipeDoc.subRecipeList[i].toString();
			await SubRecipeSchema.findByIdAndRemove(subRecipeId);
		}

		// Recipe에 연관된 ingredientTagList 삭제
		for(let i = 0; i < recipeDoc.ingredientTagList.length; i++) {
			let ingredientTagId = recipeDoc.ingredientTagList[i].toString();
			await IngredientTagSchema.findByIdAndRemove(ingredientTagId);
		}

		await recipeDoc.remove();
		resolve();
	}.bind(this))
};


recipeSchema.statics.getOneRecipeById = function(recipeId) {
	return new Promise(async function(resolve, reject) {
		let [err, recipeDoc] = await to(this.findById(recipeId, '-ingredientTagList -__v')
			.populate({
				path: 'subRecipeList',
				select: '+order +thumbnail +comment -_id -__v',
				options: {
					sort: { order: 1}
				}
			}).exec());
		if(err) {
			err.myMessage = "레시피를 찾는 데 오류가 발생했습니다."; reject(err);
		}
		if(recipeDoc === null)
			reject(new ClientError("레시피를 찾을 수 없습니다.", 400, Date.now()));

		resolve(recipeDoc);
	}.bind(this));
};

recipeSchema.statics.searchRecipeByText = function(text) {
	return new Promise(async function (resolve, reject) {
		let [err, recipeDocList] = await to(this.find({
			title: new RegExp('[a-z 0-9 A-Z 가-힣 ]*'+text+'[a-z 0-9 A-Z 가-힣]*', "i")
			},
			'+title +_id +author +like +ingredientList +thumbnail -ingredientTagList -subRecipeList'
			,{
				sort:{
					like: -1 //Sort by Date Added DESC
				}
			}).exec());
		if(err) {
			err.myMessage = "서버에 오류가 발생하였습니다."; reject(err);
		}

		if(recipeDocList === null) {
			resolve("레시피를 찾을 수 없습니다.");
		} else {
			resolve(recipeDocList);
		}

	}.bind(this))
};

module.exports = mongoClient.model('Recipe', recipeSchema);