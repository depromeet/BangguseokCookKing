const mongoClient = require('mongoose');
const to = require('await-to-js').default;
//error
const ClientError = require('../helpers/errors/ClientError');


const IngredientTagSchema = mongoClient.Schema({
	ingredient: {
		type: String,
		required: true
	},
	RecipeList: [{
		type: mongoClient.Schema.ObjectId,
		ref: "Recipe"
	}]
});

IngredientTagSchema.statics.pushRecipe = function (ingredient, RecipeId) {
	return new Promise(async function(resolve, reject) {
		let [err, IngredientTagDoc] = await to(this.findOne({ingredient: ingredient}).exec());
		if(err) reject(err);
		if(IngredientTagDoc === null) {reject(new ClientError("잘못된 재료를 검색하였습니다.", 400, Date.now())); return;}

		IngredientTagDoc.RecipeList.push(RecipeId);

		let [errS, saveDoc] = await to(IngredientTagDoc.save());
		if(errS) reject(errS);
		else resolve(saveDoc);
	}.bind(this));
};

IngredientTagSchema.statics.searchRecipeByTag = function(ingredient) {
	return new Promise(async function (resolve, reject) {
		let [err, IngredientTagDoc] = await to(this.findOne({ingredient: ingredient})
			.populate({
				path: 'RecipeList',
				select: 'title like ingredientList thumbnail subRecipeList -_id',
				populate: {
					path: 'subRecipeList',
					select: 'order thumbnail comment -_id',
					options: {
						sort: { order: 1}
					}
				}
			})
			.exec());
		if(err) reject(err);
		if(IngredientTagDoc === null) {reject(new ClientError("잘못된 재료를 검색하였습니다.", 400, Date.now())); return ;}

		resolve(IngredientTagDoc.RecipeList);
	}.bind(this))
};


module.exports = mongoClient.model('IngredientTag', IngredientTagSchema);