var mongoose = require('mongoose');

var recipeSchema = new mongoose.Schema({
	title: String,
	image: String,
	instructions: String,
	ingredients: [{
		unit: String,
		displayQuantity: Number,
		name: String		
	}],
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
