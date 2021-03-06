var express 					= require('express'),
    app 							= express(),
    bodyParser 				= require('body-parser'),
    methodOverride 		= require("method-override"),
    session 					= require("cookie-session"),
    morgan 						= require("morgan"),
    db 								= require("./models"),
    request						= require("request");
    loginMiddleware 	= require("./middleware/loginHelper");
    routeMiddleware 	= require("./middleware/routeHelper");
    require('dotenv').load();

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

//Make a session cookie
app.use(session({
	maxAge: 36000000,
	secret: "illnevertell",
	name: "Choco Crisp"
}));
//Put after session call
app.use(loginMiddleware);

//Signup routes - has middleware that stops you from logining in while already logged in
app.get('/signup', routeMiddleware.preventLoginSignUp, function (req, res){
	res.render('users/signup');
});
app.post('/signup', function (req, res){
	db.User.create(req.body.user, function (err, user){
		if (user){
			req.login(user);
			res.redirect('/recipes');
		} else {
			alert('Sorry, that user name is already taken');
			res.render('users/signup');
		}
	});
});

//Login Routes
app.get('/login', function (req, res){
	res.render('users/login');
});
app.post('/login', function (req, res){
	db.User.authenticate(req.body.user, function (err, user){
		if (!err && user !== null) {
			req.login(user);
			res.redirect('/recipes');
		} else {
			console.log(err);
			//TODO handle the other errs
			res.redirect('/login');
		}
	});
});
//Logout Route
app.get('/logout', function (req, res){
	req.logout();
	res.redirect('/recipes');
});

//ROOT - All DB recipes, no login
app.get('/', function (req, res){
	//TODO redirect to choice bwn bs or build recipe book?
	res.redirect('/recipes');
});

//USERS INDEX
app.get('/users', function (req, res){
	db.User.find({}, function (err, usersDB){
		res.render('users/index', {usersDB: usersDB});
	});
});

//USERS SHOW with RECIPES 
app.get('/users/:id/show', function (req, res){
	db.User.findById(req.params.id)
		.populate('recipes comments')
		.exec(function (err, user){
			console.log("This is the user recipes", user.recipes);
			res.render('users/show', {user:user});
	});
});

//SEARCH INDEX
app.get('/search', function (req, res){
	res.render('search/index'); 
});	

//SEARCH BIGOVEN w/AJAX from Search Index page
app.post('/search', function (req, res){
	var searchTerm = req.body.term.searchTerm;
	var url = "https://api.bigoven.com/recipes?pg=1&rpp=25&title_kw=";
	//apiKey is in the ignored .env
	var apiKey = process.env.DB_BIGOVEN_PASS;
	request({
		type: 'GET',
		json: true,
		uri: url + searchTerm + "&api_key=" + apiKey
	}, 
	function (err, response, body){
		if (err) {
	    console.log("Error! Request failed - " + err);
	  } else if (!err && response.statusCode === 200) {
	  	res.send(body);
		}
	});		
});

//SEARCH SHOW RECIPE FROM BIGOVEN
app.get('/search/:id/show', function (req, res){
	var recipeId 		= req.params.id;
	var url 				= "https://api.bigoven.com/recipe/";
	//apiKey is in the ignored .env
	var apiKey 			= process.env.DB_BIGOVEN_PASS;
	request({
		type: 'GET',
		json: true,
		uri: url + recipeId + "?api_key=" + apiKey
	}, 
	function (err, response, body){
		if (err) {
	    console.log("Error! Request failed - " + err);
	  } else if (!err && response.statusCode === 200) { 
	  	//Make an recipe object and stuff it with filtered data from Big Oven
	  	//TODO Wrap all of this into one object creation?
	  	var bigOvenRecipeAbridged 					= {};
	  	bigOvenRecipeAbridged.title 				= body.Title;
	  	bigOvenRecipeAbridged.image 				= body.ImageURL;
	  	bigOvenRecipeAbridged.instructions 	= body.Instructions;
	  	//TODO Map over the ingredients array to extract
	  	bigOvenRecipeAbridged.ingredients 	= body.Ingredients.map(function(ingredient){
	  		return {
	  			displayQuantity: 	ingredient.DisplayQuantity,
	  			unit: 						ingredient.Unit,
	  			name: 						ingredient.Name
	  		};
	  	});
	  	res.render('search/show', {bigOvenRecipeAbridged: bigOvenRecipeAbridged});
		}
	});			
});

//CREATE RECIPE FROM SEARCH RESULT
app.post('/recipes', routeMiddleware.ensureLoggedIn, function (req, res){
	db.Recipe.create(req.body.recipe, function (err, recipe){	
		if (err) { 
			console.log(err);
			res.redirect('/recipes');
		}
		//Find the current logged in user and push the recipeID into its recipe array
		db.User.findById(req.session.id, function (err, user){	
			if (err) throw (err);
			user.recipes.push(recipe);
			recipe.user = user._id;
			recipe.save();
			user.save(function (err) {
  			if (err) throw (err);
				//TODO redirect to user's page with her recipes, /user/:id
				res.redirect('/recipes');
  		});
		});
	});
});

//RECIPES INDEX, ALL IN DB
app.get('/recipes', function (req, res){
	db.Recipe.find({}, function (err, recipesDB){
		res.render('recipes/index', {recipesDB: recipesDB});
	});
});

//SHOW ONE RECIPE IN DB, W/ AJAX to CREATE COMMENTS
app.get('/recipes/:id/show', function (req, res){
	db.Recipe.findById(req.params.id)
		//populate the recipe w/ the user and comments
		.populate('user comments')
		.exec(function (err, recipe){
			//Populate the arg1:recipe.comments.user with data from the User model 
			db.Recipe
				.populate(recipe, {
					path: 'comments.user',
					model: 'User'
				}, 
				function (err, recipe) {
					res.render('recipes/show', {recipe:recipe});		
			});
		});
});

//CREATE COMMENT POST FROM AJAX FROM ONE RECIPE PAGE
app.post('/recipes/:id/comments', routeMiddleware.ensureLoggedIn, function (req, res){
	db.Comment.create(req.body.comment, function (err, comment){
		if (err) {
			console.log(err);
			res.redirect('/recipes/' + req.params.id + '/show');
		} else {
			db.Recipe.findById(req.params.id, function (err, recipe){
				//mongoose knows just to push the comment's id into the recipe comments array
				recipe.comments.push(comment);
				console.log("This is the recipe after the comment push", recipe);
				comment.recipe = recipe._id;
				comment.user = req.session.id;
				recipe.save();
				comment.save(function (err, comment){
					db.Comment.findById(comment.id)
						.populate('user')
						.exec(function (err, comment){
							res.send(comment);					
					});
				});
			});
		}
	});
});

//TODO RECIPE UPDATE

//DESTROY RECIPE
app.delete('/recipes/:id', /*routeMiddleware.ensureCorrectUserRecipe,*/ function (req,res) {
  db.Recipe.findByIdAndRemove(req.params.id, function (err, comment) {
    if(err) {
      console.log(err);
      res.redirect('/recipes');
    }
    else {
      res.redirect('/recipes');
    }
  });
});

//ERROR
app.get('*', function(req,res){
  res.render('errors/404');
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is listening on port 3000");
});