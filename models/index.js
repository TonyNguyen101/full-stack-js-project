var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI ||"mongodb://localhost/chefs_pen");
mongoose.set('debug', true);

module.exports.User 		= require('./user');
module.exports.Recipe 	= require('./recipe');
module.exports.Comment 	= require('./comment');