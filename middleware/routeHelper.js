var db = require('../models');

var routeHelpers = {
//Ensure the user is logged in by checking the session.id
	ensureLoggedIn: function (req, res, next){
		console.log(req.session.id);
		if (req.session.id !== null && req.session.id !== undefined){
			return next();
		} else {
			res.redirect('/login');
		}
	},
	//Stops user from messing with recipes and comments that are not his.
	ensureCorrectUserRecipe: function (req, res, next) {
		if (recipe.user !== req.session.id){
			res.redirect('/');
		} else {
			return next();
		}
	},
	ensureCorrectUserComment: function (req, res, next) {
		if (comment.user !== req.session.id){
			res.redirect('/');
		} else {
			return next();
		}
	},
	//stops user from logging in while being already logged in
	preventLoginSignUp: function (req, res, next) {
		if (req.session.id !== null && req.session.id !== undefined){
			res.redirect('/');
		} else {
			return next();
		}
	}	
};

module.exports = routeHelpers;