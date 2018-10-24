const mongoClient = require('mongoose');
const config = require('../../config/config');
const subRecipeSchema = mongoClient.Schema({
	order: {    // 순서
		type: Number,
		required: true
	},
	thumbnail: {
		type: String,
		default: config.DEFAULT_IMG_PATH
	},
	explain: {
		type: String,
		required: true
	}
});

module.exports = mongoClient.model('SubRecipe', subRecipeSchema);