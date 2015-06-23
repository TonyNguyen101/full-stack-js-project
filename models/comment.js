var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
	body: String,
	recipe: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Recipe"
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
});

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;