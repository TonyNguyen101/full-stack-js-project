var mongoose = require('mongoose');

var ingredientSchema = new mongoose.Schema({
	unit: String,
	displayQuantity: String,
	name: String
});


var recipeSchema = new mongoose.Schema({
	title: String,
	image: String,
	instructions: String,
	ingredients: [ingredientSchema],
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User" 
	},
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment" 
	}]
});

var Recipe = mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
