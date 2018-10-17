const mongoClient = require('mongoose');
const subRecipeSchema = mongoClient.Schema({
	order: {    // 순서
		type: Number,
		required: true
	},
	thumbnail: {
		type: String,
		default: null
	},
	comment: {
		type: String,
		required: true
	}
});

module.exports = mongoClient.model('SubRecipe', subRecipeSchema);