var db = require('../models');

//A function that has two functions for login and logout 
var loginHelpers = function	(req, res, next){	
	req.login = function (user) {
		req.session.id = user._id;
	};
	req.logout = function (user) {
		req.session.id = null;
	};
	//Carry on with whatever you were doing
	next();
};

module.exports = loginHelpers;