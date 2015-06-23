var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/chefs_pen");
mongoose.set('debug', true);

module.exports.User 		= require('./user');
module.exports.Recipe 	= require('./recipe');
module.exports.Comment 	= require('./comment');