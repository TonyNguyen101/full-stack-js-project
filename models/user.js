var mongoose 					= require('mongoose');
var bcrypt						= require('bcrypt');
var SALT_WORK_FACTOR	= 10;

var userSchema = new mongoose.Schema({
	userName: {
		type: String,
		lowercase: true,
		required: true
	},
	password:  {
		type: String,
		required: true
	},
	recipes: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Recipe"
	}],
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	}]
});

//Replace password with a hash before saving
userSchema.pre('save', function (next) {
	var user = this;
	if (!user.isModified('password')) return next;
	return bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt){
		if (err) return next(err);
		return bcrypt.hash(user.password, salt, function (err, hash){
			if (err) return next(err);
			user.password = hash;
			return next();
		});
	});
});

//Checks the userName, then checks the password
userSchema.statics.authenticate = function (formData, callback){
	this.findOne(
	{ userName: formData.userName },
	function (err, user){
		if (user === null) {
			callback('Invalid user name or password', null);
		} else {
			user.checkPassword(formData.password, callback);
		} 
	});
};

userSchema.method.checkPassword = function (password, callback){
	//Refers the this specific instance of the class
	var user = this;
	bcrypt.compare(password, user.password, function (err, isMatch){
		if(isMatch) {
			//arg1 is the err, arg2 is the user
			callback(null, user);
		} else {
			callback(err, null);
		}
	});
};

var User = mongoose.model("User", userSchema);
module.exports = User;

