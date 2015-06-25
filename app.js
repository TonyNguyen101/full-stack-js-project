var express 					= require('express'),
    app 							= express(),
    bodyParser 				= require('body-parser'),
    methodOverride 		= require("method-override"),
    session 					= require("cookie-session"),
    morgan 						= require("morgan"),
    db 								= require("./models"),
    request						= require("request");
/*    loginMiddleware 	= require("./middleware/loginHelper"),
    routeMiddleware 	= require("./middleware/routeHelper");
    require('dotenv').load();*/

app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));

//ROOT - All recipes, no login
app.get('/', function (req, res){
	res.redirect('/recipes');
});

//SEARCH INDEX
app.get('/search', function (req, res){
	res.render('search/index'); 
});	

//SEARCH BIGOVEN w/AJAX from Search Index page
app.post('/search', function (req, res){
	var searchTerm = req.body.term.searchTerm;
	var url = "http://api.bigoven.com/recipes?pg=1&rpp=25&title_kw=";
	var apiKey = "&api_key=dvxK85et7PRw0l0hH7I3D9R2cFMvdPop";
	request({
		type: 'GET',
		json: true,
		uri: url + searchTerm + apiKey
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
	var url 				= "http://api.bigoven.com/recipe/";
	var apiKey 			= "dvxK85et7PRw0l0hH7I3D9R2cFMvdPop";
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
app.post('/recipes', function (req, res){
	db.Recipe.create(req.body.recipe, function (err, recipe){	
		if (err) console.log(err);
		//TODO redirect to user's page with her recipes, /user/:id
		res.redirect('/recipes');
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
	db.Recipe.findById(req.params.id, function (err, recipe){
		res.render('recipes/show', {recipe:recipe});
	});
});

//CREATE COMMENT POST FROM AJAX FROM ONE RECIPE PAGE
app.post('/recipes/:id/comments', function (req, res){
	db.Comment.create(req.body.comment, function (err, comment){
		if (err) {
			console.log(err);
			res.redirect('/recipes/' + req.params.id + '/show');
		} else {
			db.Recipe.findById(req.params.id, function (err, recipe){
				//mongoose know just to push the comment's id into the recipe object
				recipe.comments.push(comment);
				comment.recipe = recipe._id;
				recipe.save();
				comment.save();
				res.send(comment);
			});
		}
	});
});
//NEW 
//EDIT

//UPDATE

//DESTROY

//ERROR
app.get('*', function(req,res){
  res.render('errors/404');
});

app.listen(3000, function(){
  console.log("Server is listening on port 3000");
});